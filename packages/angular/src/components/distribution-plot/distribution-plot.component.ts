import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  VIZ_COLORS,
  PATTERN_PRESETS,
  formatVizValue,
  createPlotRegion,
  createLinearScale,
  createBandScale,
  generateTicks,
  createLinePath,
  createAreaPath,
  computeHistogramBins,
  computeBoxPlotQuantiles,
  computeKDE,
  PlotMargins,
  PatternPreset,
  getVizDensityTier,
  VizDensityTier
} from '../../utils/viz-core.js';

export type DistributionPlotVariant = 'histogram' | 'box' | 'violin' | 'strip' | 'dotplot' | 'density';
export type DistributionDensity = 'compact' | 'standard' | 'expanded';

export interface DistributionSeriesDef {
  key: string;
  label?: string;
  color?: string;
  pattern?: string;
}

export interface DistributionReferenceLine {
  value: number;
  label?: string;
  color?: string;
  position?: 'top' | 'bottom' | 'start' | 'center' | 'end';
  yOffset?: number;
}

export interface DistributionToleranceBand {
  min: number;
  max: number;
  label?: string;
  color?: string;
  tone?: 'optimal' | 'warning' | 'critical' | 'neutral';
}

let nextDistId = 0;

@Component({
  selector: 'ds-distribution-plot',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #chartContainer
      class="ds-distribution-plot ds-distribution-plot--{{ variant }} ds-distribution-plot--density-{{ density }}"
      [ngClass]="{ 'ds-distribution-plot--loading': loading, 'ds-distribution-plot--empty': !loading && (!data || data.length === 0) }"
      [style.width]="'100%'"
      role="region"
      [attr.aria-roledescription]="'distribution plot'"
      [attr.aria-label]="title || 'Distribution plot visualization'"
      [attr.aria-busy]="loading"
      tabindex="0"
      (keydown)="onKeyDown($event)"
      (pointerleave)="onPointerLeave()"
    >
      <!-- Loading State -->
      <ng-container *ngIf="loading">
        <div class="ds-distribution-plot__skeleton-header">
          <div class="ds-distribution-plot__skeleton-title"></div>
          <div class="ds-distribution-plot__skeleton-sub"></div>
        </div>
        <div class="ds-distribution-plot__skeleton-plot" [style.height.px]="height"></div>
      </ng-container>

      <!-- Empty State -->
      <ng-container *ngIf="!loading && (!data || data.length === 0)">
        <h3 *ngIf="title" class="ds-distribution-plot__title">{{ title }}</h3>
        <div class="ds-distribution-plot__empty-msg" [style.height.px]="height">
          <p>{{ emptyMessage }}</p>
        </div>
      </ng-container>

      <!-- Main Visual Content -->
      <ng-container *ngIf="!loading && data && data.length > 0">
        <div *ngIf="title || subtitle" class="ds-distribution-plot__header">
          <div>
            <h3 *ngIf="title" class="ds-distribution-plot__title">{{ title }}</h3>
            <p *ngIf="subtitle" class="ds-distribution-plot__subtitle">{{ subtitle }}</p>
          </div>
        </div>

        <!-- Legend Filter -->
        <div *ngIf="shouldShowLegend && groupedData.length > 1" class="ds-distribution-plot__legend" role="toolbar" aria-label="Category Filter">
          <button
            *ngFor="let g of groupedData"
            type="button"
            class="ds-distribution-plot__legend-item"
            (click)="toggleCategory(g.key)"
            [attr.aria-pressed]="isolatedCategory === g.key"
          >
            <span
              class="ds-distribution-plot__legend-swatch"
              [style.background-color]="g.color"
              [style.background-image]="enablePatterns ? 'url(#' + chartId + '-' + g.pattern + ')' : 'none'"
            ></span>
            <span class="ds-distribution-plot__legend-label">{{ g.label }}</span>
          </button>
        </div>

        <!-- SVG Plot -->
        <svg
          width="100%"
          [attr.height]="height"
          [attr.viewBox]="'0 0 ' + plotWidth + ' ' + height"
          class="ds-distribution-plot__svg"
          aria-hidden="true"
          style="display: block; width: 100%; height: auto;"
        >
          <defs>
            <pattern
              *ngFor="let pat of patternPresetsList"
              [attr.id]="chartId + '-' + pat.id"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              [attr.patternTransform]="pat.transform || ''"
            >
              <circle
                *ngIf="pat.type === 'circle'"
                cx="5"
                cy="5"
                [attr.r]="pat.r || 1.2"
                [attr.fill]="pat.fill || 'rgba(255,255,255,0.45)'"
              />
              <line
                *ngIf="pat.type !== 'circle'"
                [attr.x1]="0"
                [attr.y1]="pat.id.includes('vertical') ? '0' : '5'"
                [attr.x2]="pat.id.includes('vertical') ? '0' : '10'"
                [attr.y2]="pat.id.includes('vertical') ? '10' : '5'"
                [attr.stroke]="pat.stroke || 'rgba(255,255,255,0.35)'"
                [attr.stroke-width]="pat.strokeWidth || 1.5"
              />
            </pattern>
          </defs>

          <g [attr.transform]="'translate(' + plot.margins.left + ', ' + plot.margins.top + ')'">
            <!-- Tolerance Bands -->
            <g *ngFor="let band of toleranceBands" class="ds-distribution-plot__tolerance-band">
              <rect
                [attr.x]="getBandX(band)"
                y="0"
                [attr.width]="getBandWidth(band)"
                [attr.height]="plot.plotHeight"
                [attr.fill]="getBandFill(band)"
                [attr.stroke]="getBandStroke(band)"
                stroke-dasharray="3 3"
              />
              <text
                *ngIf="band.label"
                [attr.x]="getBandCenterX(band)"
                [attr.y]="plot.plotHeight - 10"
                text-anchor="middle"
                [attr.fill]="getBandTextColor(band)"
                stroke="var(--surface-card, #ffffff)"
                stroke-width="3"
                stroke-linejoin="round"
                paint-order="stroke fill"
                font-size="10"
                font-weight="600"
                class="ds-distribution-plot__band-label"
              >
                {{ band.label }}
              </text>
            </g>

            <!-- Gridlines -->
            <g *ngIf="showGrid && scales.valTicks">
              <g *ngFor="let tick of scales.valTicks" class="ds-distribution-plot__gridline">
                <line [attr.x1]="scales.scaleVal(tick)" y1="0" [attr.x2]="scales.scaleVal(tick)" [attr.y2]="plot.plotHeight" />
              </g>
            </g>

            <!-- Render Variant Elements -->
            <!-- 1. Histogram -->
            <ng-container *ngIf="variant === 'histogram'">
              <g *ngFor="let g of transformedGroups">
                <g *ngFor="let b of g.bins">
                  <rect
                    [attr.x]="scales.scaleVal(b.x0)"
                    [attr.y]="scales.scaleFreq(b.count)"
                    [attr.width]="Math.max(1, scales.scaleVal(b.x1) - scales.scaleVal(b.x0) - 1)"
                    [attr.height]="Math.max(0, plot.plotHeight - scales.scaleFreq(b.count))"
                    [attr.fill]="g.color"
                    opacity="0.8"
                    (pointerenter)="hoveredItem = { label: g.label, count: b.count, range: b.x0.toFixed(2) + ' – ' + b.x1.toFixed(2) }; onElementSelect(g)"
                  />
                  <rect
                    *ngIf="enablePatterns"
                    [attr.x]="scales.scaleVal(b.x0)"
                    [attr.y]="scales.scaleFreq(b.count)"
                    [attr.width]="Math.max(1, scales.scaleVal(b.x1) - scales.scaleVal(b.x0) - 1)"
                    [attr.height]="Math.max(0, plot.plotHeight - scales.scaleFreq(b.count))"
                    [attr.fill]="'url(#' + chartId + '-' + g.pattern + ')'"
                    opacity="0.5"
                    pointer-events="none"
                  />
                </g>
              </g>
            </ng-container>

            <!-- 2. Box Plot -->
            <ng-container *ngIf="variant === 'box'">
              <g *ngFor="let g of transformedGroups; let idx = index">
                <!-- Whisker Line -->
                <line
                  [attr.x1]="scales.scaleVal(g.boxStats.lowerWhisker)"
                  [attr.y1]="getCategoryCenterY(g.key, idx)"
                  [attr.x2]="scales.scaleVal(g.boxStats.upperWhisker)"
                  [attr.y2]="getCategoryCenterY(g.key, idx)"
                  stroke="var(--text-primary, #0f172a)"
                  stroke-width="1.5"
                />
                <!-- Whisker caps -->
                <line
                  [attr.x1]="scales.scaleVal(g.boxStats.lowerWhisker)"
                  [attr.y1]="getCategoryCenterY(g.key, idx) - 8"
                  [attr.x2]="scales.scaleVal(g.boxStats.lowerWhisker)"
                  [attr.y2]="getCategoryCenterY(g.key, idx) + 8"
                  stroke="var(--text-primary, #0f172a)"
                  stroke-width="1.5"
                />
                <line
                  [attr.x1]="scales.scaleVal(g.boxStats.upperWhisker)"
                  [attr.y1]="getCategoryCenterY(g.key, idx) - 8"
                  [attr.x2]="scales.scaleVal(g.boxStats.upperWhisker)"
                  [attr.y2]="getCategoryCenterY(g.key, idx) + 8"
                  stroke="var(--text-primary, #0f172a)"
                  stroke-width="1.5"
                />
                <!-- Box rect (Q1 to Q3) -->
                <rect
                  [attr.x]="scales.scaleVal(g.boxStats.q1)"
                  [attr.y]="getCategoryCenterY(g.key, idx) - 14"
                  [attr.width]="Math.max(1, scales.scaleVal(g.boxStats.q3) - scales.scaleVal(g.boxStats.q1))"
                  height="28"
                  [attr.fill]="g.color"
                  opacity="0.8"
                  rx="2"
                  (pointerenter)="hoveredItem = { label: g.label, stats: g.boxStats }; onElementSelect(g)"
                />
                <!-- Median line -->
                <line
                  [attr.x1]="scales.scaleVal(g.boxStats.median)"
                  [attr.y1]="getCategoryCenterY(g.key, idx) - 14"
                  [attr.x2]="scales.scaleVal(g.boxStats.median)"
                  [attr.y2]="getCategoryCenterY(g.key, idx) + 14"
                  stroke="#ffffff"
                  stroke-width="2"
                />
                <!-- Mean marker -->
                <circle
                  *ngIf="showMean"
                  [attr.cx]="scales.scaleVal(g.boxStats.mean)"
                  [attr.cy]="getCategoryCenterY(g.key, idx)"
                  r="3.5"
                  fill="#ffffff"
                  stroke="var(--text-primary, #0f172a)"
                  stroke-width="1.5"
                />
                <!-- Outliers -->
                <ng-container *ngIf="showOutliers">
                  <circle
                    *ngFor="let out of g.boxStats.outliers"
                    [attr.cx]="scales.scaleVal(out)"
                    [attr.cy]="getCategoryCenterY(g.key, idx)"
                    r="3.5"
                    fill="var(--status-critical-solid, #ef4444)"
                  />
                </ng-container>
              </g>
            </ng-container>

            <!-- 3. Density Curve -->
            <ng-container *ngIf="variant === 'density'">
              <g *ngFor="let g of transformedGroups">
                <path
                  [attr.d]="getDensityAreaPath(g)"
                  [attr.fill]="g.color"
                  opacity="0.3"
                />
                <path
                  [attr.d]="getDensityLinePath(g)"
                  fill="none"
                  [attr.stroke]="g.color"
                  stroke-width="2"
                />
              </g>
            </ng-container>

            <!-- Reference Lines -->
            <g *ngFor="let ref of referenceLines; let idx = index" class="ds-distribution-plot__reference-line">
              <line
                [attr.x1]="scales.scaleVal(ref.value)"
                y1="0"
                [attr.x2]="scales.scaleVal(ref.value)"
                [attr.y2]="plot.plotHeight"
                [attr.stroke]="ref.color || 'var(--status-critical-solid, #ef4444)'"
                stroke-dasharray="4 3"
                stroke-width="1.5"
              />
              <text
                *ngIf="getRefLabel(ref)"
                [attr.x]="getRefLabelX(ref, idx)"
                [attr.y]="getRefLabelY(ref, idx)"
                [attr.text-anchor]="getRefTextAnchor(ref, idx)"
                [attr.fill]="ref.color || 'var(--status-critical-solid, #ef4444)'"
                stroke="var(--surface-card, #ffffff)"
                stroke-width="3"
                stroke-linejoin="round"
                paint-order="stroke fill"
                font-size="10"
                font-weight="600"
                class="ds-distribution-plot__ref-label"
              >
                {{ getRefLabel(ref) }}
              </text>
            </g>

            <!-- X Axis -->
            <g [attr.transform]="'translate(0, ' + plot.plotHeight + ')'" class="ds-distribution-plot__axis">
              <line x1="0" y1="0" [attr.x2]="plot.plotWidth" y2="0" stroke="var(--border-subtle, #cbd5e1)" />
              <g *ngFor="let tick of scales.valTicks" [attr.transform]="'translate(' + scales.scaleVal(tick) + ', 0)'">
                <line y2="5" stroke="var(--border-subtle, #cbd5e1)" />
                <text y="18" text-anchor="middle" fill="var(--text-secondary, #475569)" font-size="11" font-family="var(--font-mono, monospace)">
                  {{ formatVal(tick) }}
                </text>
              </g>
              <text *ngIf="valueLabel" [attr.x]="plot.plotWidth / 2" y="36" text-anchor="middle" fill="var(--text-tertiary, #64748b)" font-size="11" font-weight="600">
                {{ valueLabel }} {{ unit ? '(' + unit.trim() + ')' : '' }}
              </text>
            </g>

            <!-- Y Axis: Categorical (for box, violin, strip) -->
            <g *ngIf="categoryKey && (variant === 'box' || variant === 'violin' || variant === 'strip')" class="ds-distribution-plot__axis">
              <line x1="0" y1="0" x2="0" [attr.y2]="plot.plotHeight" stroke="var(--border-subtle, #cbd5e1)" />
              <g *ngFor="let g of activeGroups; let idx = index" [attr.transform]="'translate(0, ' + getCategoryCenterY(g.key, idx) + ')'">
                <line x2="-5" stroke="var(--border-subtle, #cbd5e1)" />
                <text x="-9" dy="0.32em" text-anchor="end" fill="var(--text-secondary, #475569)" font-size="11" font-weight="500">{{ g.label }}</text>
              </g>
              <text *ngIf="categoryLabel" transform="rotate(-90)" [attr.x]="-plot.plotHeight / 2" [attr.y]="-effectiveMargins.left + 16" text-anchor="middle" fill="var(--text-tertiary, #64748b)" font-size="11" font-weight="600">
                {{ categoryLabel }}
              </text>
            </g>

            <!-- Y Axis: Quantitative Frequency / Density -->
            <g *ngIf="variant === 'histogram' || variant === 'density'" class="ds-distribution-plot__axis">
              <line x1="0" y1="0" x2="0" [attr.y2]="plot.plotHeight" stroke="var(--border-subtle, #cbd5e1)" />
              <g *ngFor="let tick of scales.freqTicks" [attr.transform]="'translate(0, ' + scales.scaleFreq(tick) + ')'">
                <line x2="-5" stroke="var(--border-subtle, #cbd5e1)" />
                <text x="-9" dy="0.32em" text-anchor="end" fill="var(--text-secondary, #475569)" font-size="10" font-family="var(--font-mono, monospace)">
                  {{ formatFreqTick(tick) }}
                </text>
              </g>
              <text transform="rotate(-90)" [attr.x]="-plot.plotHeight / 2" [attr.y]="-effectiveMargins.left + 16" text-anchor="middle" fill="var(--text-tertiary, #64748b)" font-size="11" font-weight="600">
                {{ variant === 'histogram' ? 'Frequency (Count)' : 'Relative Density (KDE)' }}
              </text>
            </g>
          </g>
        </svg>

        <!-- Tooltip -->
        <div *ngIf="hoveredItem" class="ds-distribution-plot__tooltip" [style.left.px]="100" [style.top.px]="30">
          <strong>{{ hoveredItem.label }}</strong>
          <div *ngIf="hoveredItem.count != null">Count: {{ hoveredItem.count }} (Range: {{ hoveredItem.range }})</div>
          <div *ngIf="hoveredItem.stats">
            <div>Median: {{ formatVal(hoveredItem.stats.median) }}</div>
            <div>IQR: [{{ formatVal(hoveredItem.stats.q1) }} - {{ formatVal(hoveredItem.stats.q3) }}]</div>
            <div>Mean: {{ formatVal(hoveredItem.stats.mean) }}</div>
          </div>
        </div>

        <!-- Accessible Statistical Summary Table Mirror -->
        <details
          *ngIf="showDataTable && transformedGroups && transformedGroups.length > 0"
          class="ds-chart-table-details"
        >
          <summary class="ds-chart-table-summary">
            View Accessible Distribution Summary Table
          </summary>
          <div class="ds-chart-table-wrap">
            <table class="ds-chart-table">
              <caption style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);">
                {{ title ? title + ' Distribution Statistics' : 'Distribution Summary Table' }}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Category / Cohort</th>
                  <th scope="col">Sample Count</th>
                  <th scope="col">Min</th>
                  <th scope="col">Q1 (25%)</th>
                  <th scope="col">Median (50%)</th>
                  <th scope="col">Q3 (75%)</th>
                  <th scope="col">Max</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let g of transformedGroups">
                  <th scope="row">{{ g.label }}</th>
                  <td>{{ g.boxStats.count }}</td>
                  <td>{{ formatVal(g.boxStats.min) }}</td>
                  <td>{{ formatVal(g.boxStats.q1) }}</td>
                  <td style="font-weight: 600;">{{ formatVal(g.boxStats.median) }}</td>
                  <td>{{ formatVal(g.boxStats.q3) }}</td>
                  <td>{{ formatVal(g.boxStats.max) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </ng-container>
    </div>
  `,
  styleUrls: ['./distribution-plot.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsDistributionPlotComponent implements AfterViewInit, OnDestroy {
  Math = Math;
  typeof = (v: any) => typeof v;

  @Input() data: Array<Record<string, any>> | number[] = [];
  @Input() valueKey: string = 'value';
  @Input() categoryKey: string | null = null;
  @Input() series: DistributionSeriesDef[] = [];
  @Input() variant: DistributionPlotVariant = 'histogram';
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';
  @Input() binCount: number | null = null;
  @Input() binWidth: number | null = null;
  @Input() bandwidth: number | null = null;
  @Input() width: number = 640;
  @Input() height: number = 360;
  @Input() margins?: Partial<PlotMargins>;
  @Input() unit: string = '';
  @Input() valueLabel: string = 'Measured Value';
  @Input() categoryLabel: string = 'Group';
  @Input() locale: string = 'en-IN';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() referenceLines: DistributionReferenceLine[] = [];
  @Input() toleranceBands: DistributionToleranceBand[] = [];
  @Input() showGrid: boolean = true;
  @Input() showLegend?: boolean;
  @Input() showDataTable: boolean = true;
  @Input() showOutliers: boolean = true;
  @Input() showMean: boolean = true;
  @Input() enablePatterns: boolean = true;
  @Input() density: DistributionDensity = 'standard';
  @Input() emptyMessage: string = 'No distribution telemetry records found.';
  @Input() loading: boolean = false;

  @Output() elementSelect = new EventEmitter<{ group: Record<string, any>; index: number }>();

  @ViewChild('chartContainer') containerRef?: ElementRef<HTMLDivElement>;

  chartId = `ds-dist-plot-${++nextDistId}`;
  activeElementIndex = -1;
  isolatedCategory: string | null = null;
  hoveredItem: any = null;
  patternPresetsList: PatternPreset[] = PATTERN_PRESETS;

  measuredWidth: number = 0;
  private resizeObserver?: ResizeObserver;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.containerRef?.nativeElement && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = Math.floor(entry.contentRect.width);
          if (w > 0) {
            this.measuredWidth = w;
            this.cdr.markForCheck();
          }
        }
      });
      this.resizeObserver.observe(this.containerRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  get plotWidth(): number {
    return Math.max(280, this.measuredWidth || this.width);
  }

  get densityTier(): VizDensityTier {
    return getVizDensityTier(this.plotWidth);
  }

  get shouldShowLegend(): boolean {
    if (this.showLegend != null) return this.showLegend;
    return this.variant === 'density' && this.groupedData.length > 1;
  }

  get effectiveMargins(): PlotMargins {
    const isMobile = this.densityTier === 'compact' || this.densityTier === 'mobile';
    let calculatedLeft = isMobile ? 48 : 64;
    if (this.categoryKey && this.activeGroups.length > 0) {
      const maxLabelChars = Math.max(...this.activeGroups.map((g: any) => (g.label || '').length), 4);
      const titleSpace = this.categoryLabel ? (isMobile ? 16 : 28) : 8;
      calculatedLeft = isMobile
        ? Math.min(68, Math.max(48, Math.ceil(maxLabelChars * 5.5) + 12 + titleSpace))
        : Math.max(96, Math.ceil(maxLabelChars * 7.5) + 16 + titleSpace);
    } else if (this.variant === 'histogram' || this.variant === 'density') {
      calculatedLeft = isMobile ? 48 : 68;
    }

    return {
      top: this.margins?.top ?? 24,
      right: this.margins?.right ?? (isMobile ? 16 : 28),
      bottom: this.margins?.bottom ?? (isMobile ? 32 : 44),
      left: this.margins?.left ?? calculatedLeft
    };
  }

  get plot() {
    return createPlotRegion({
      containerWidth: this.plotWidth,
      containerHeight: this.height,
      margins: this.effectiveMargins
    });
  }

  get groupedData(): any[] {
    if (!this.data || this.data.length === 0) return [];

    if (!this.categoryKey) {
      const rawVals = (this.data as any[]).map(d => (typeof d === 'number' ? d : Number(d[this.valueKey]))).filter(v => !isNaN(v));
      return [{
        key: 'all',
        label: this.title || 'Distribution',
        color: VIZ_COLORS[0],
        pattern: PATTERN_PRESETS[0].id,
        values: rawVals,
        items: this.data
      }];
    }

    const map = new Map<string, number[]>();
    (this.data as any[]).forEach(d => {
      const cat = String(d[this.categoryKey!] || 'Other');
      if (!map.has(cat)) map.set(cat, []);
      const v = typeof d === 'number' ? d : Number(d[this.valueKey]);
      if (!isNaN(v)) map.get(cat)!.push(v);
    });

    const categories = Array.from(map.keys());
    return categories.map((cat, idx) => ({
      key: cat,
      label: cat,
      color: VIZ_COLORS[idx % VIZ_COLORS.length],
      pattern: PATTERN_PRESETS[idx % PATTERN_PRESETS.length].id,
      values: map.get(cat)!,
      items: (this.data as any[]).filter(d => String(d[this.categoryKey!]) === cat)
    }));
  }

  get activeGroups(): any[] {
    if (this.isolatedCategory) {
      return this.groupedData.filter(g => g.key === this.isolatedCategory);
    }
    return this.groupedData;
  }

  get extents() {
    const vals: number[] = [];
    this.groupedData.forEach(g => vals.push(...g.values));
    if (vals.length === 0) return { globalMin: 0, globalMax: 100 };

    let minV = Math.min(...vals);
    let maxV = Math.max(...vals);

    this.referenceLines.forEach(ref => {
      if (typeof ref.value === 'number' && !isNaN(ref.value)) {
        minV = Math.min(minV, ref.value);
        maxV = Math.max(maxV, ref.value);
      }
    });

    this.toleranceBands.forEach(b => {
      if (typeof b.min === 'number' && !isNaN(b.min)) minV = Math.min(minV, b.min);
      if (typeof b.max === 'number' && !isNaN(b.max)) maxV = Math.max(maxV, b.max);
    });

    const span = maxV - minV || 1;
    const padding = span * 0.08;
    return {
      globalMin: minV - padding,
      globalMax: maxV + padding
    };
  }

  get transformedGroups(): any[] {
    const { globalMin, globalMax } = this.extents;
    return this.activeGroups.map(g => {
      const bins = computeHistogramBins(g.values, {
        binCount: this.binCount || undefined,
        binWidth: this.binWidth || undefined,
        min: globalMin,
        max: globalMax
      });
      const boxStats = computeBoxPlotQuantiles(g.values);
      const kde = computeKDE(g.values, {
        bandwidth: this.bandwidth || undefined,
        samplePoints: 60,
        min: globalMin,
        max: globalMax
      });
      return { ...g, bins, boxStats, kde };
    });
  }

  get scales() {
    const { globalMin, globalMax } = this.extents;
    const scaleVal = createLinearScale({
      domain: [globalMin, globalMax],
      range: [0, this.plot.plotWidth],
      baseline: null
    });

    const catKeys = this.activeGroups.map(g => g.key);
    const scaleCat = createBandScale({
      domain: catKeys,
      range: [0, this.plot.plotHeight],
      paddingInner: 0.32,
      paddingOuter: 0.16
    });

    let maxFreqOrDensity = 0;
    if (this.variant === 'histogram') {
      this.transformedGroups.forEach(g => {
        g.bins.forEach((b: any) => {
          if (b.count > maxFreqOrDensity) maxFreqOrDensity = b.count;
        });
      });
    } else if (this.variant === 'density' || this.variant === 'violin') {
      this.transformedGroups.forEach(g => {
        if (g.kde.maxDensity > maxFreqOrDensity) maxFreqOrDensity = g.kde.maxDensity;
      });
    }

    const scaleFreq = createLinearScale({
      domain: [0, (maxFreqOrDensity || 1) * 1.12],
      range: [this.plot.plotHeight, 0],
      baseline: 0
    });

    const valTicks = generateTicks(scaleVal, Math.min(7, Math.floor(this.plot.plotWidth / 90)));
    const freqTicks = generateTicks(scaleFreq, Math.min(5, Math.floor(this.plot.plotHeight / 50)));

    return { scaleVal, scaleCat, scaleFreq, valTicks, freqTicks };
  }

  formatFreqTick(val: number): string {
    if (this.variant === 'histogram') {
      return String(Math.round(val));
    }
    return val >= 1 ? val.toFixed(1) : val.toFixed(3);
  }

  getCategoryCenterY(key: string, index: number): number {
    if (!this.categoryKey) return this.plot.plotHeight / 2;
    const pos = this.scales.scaleCat(key) || 0;
    const bw = this.scales.scaleCat.bandwidth ? this.scales.scaleCat.bandwidth() : 30;
    return pos + bw / 2;
  }

  getDensityAreaPath(g: any): string {
    const points = g.kde.points.map((pt: any) => ({
      x: this.scales.scaleVal(pt.x),
      y: this.scales.scaleFreq(pt.density)
    }));
    const baselinePoints = g.kde.points.map((pt: any) => ({
      x: this.scales.scaleVal(pt.x),
      y: this.plot.plotHeight
    }));
    return createAreaPath(points, baselinePoints, 'monotone');
  }

  getDensityLinePath(g: any): string {
    const points = g.kde.points.map((pt: any) => ({
      x: this.scales.scaleVal(pt.x),
      y: this.scales.scaleFreq(pt.density)
    }));
    return createLinePath(points, 'monotone');
  }

  toggleCategory(cat: string): void {
    this.isolatedCategory = this.isolatedCategory === cat ? null : cat;
  }

  formatVal(val: any): string {
    return formatVizValue(val, this.unit, this.locale);
  }

  getBandX(band: DistributionToleranceBand): number {
    const x1 = this.scales?.scaleVal ? (this.scales.scaleVal(band.min) ?? 0) : 0;
    const x2 = this.scales?.scaleVal ? (this.scales.scaleVal(band.max) ?? 0) : 0;
    return Math.min(x1, x2);
  }

  getBandWidth(band: DistributionToleranceBand): number {
    const x1 = this.scales?.scaleVal ? (this.scales.scaleVal(band.min) ?? 0) : 0;
    const x2 = this.scales?.scaleVal ? (this.scales.scaleVal(band.max) ?? 0) : 0;
    return Math.abs(x2 - x1);
  }

  getBandCenterX(band: DistributionToleranceBand): number {
    return this.getBandX(band) + this.getBandWidth(band) / 2;
  }

  getBandFill(band: DistributionToleranceBand): string {
    if (band.color) return band.color;
    if (band.tone === 'critical') return 'rgba(239, 68, 68, 0.08)';
    if (band.tone === 'warning') return 'rgba(245, 158, 11, 0.08)';
    return 'rgba(16, 185, 129, 0.08)';
  }

  getBandStroke(band: DistributionToleranceBand): string {
    if (band.color) return band.color;
    if (band.tone === 'critical') return 'rgba(239, 68, 68, 0.3)';
    if (band.tone === 'warning') return 'rgba(245, 158, 11, 0.3)';
    return 'rgba(16, 185, 129, 0.3)';
  }

  getBandTextColor(band: DistributionToleranceBand): string {
    if (band.tone === 'critical') return 'var(--status-critical-solid, #ef4444)';
    if (band.tone === 'warning') return 'var(--status-warning-solid, #f59e0b)';
    return 'var(--status-success-solid, #10b981)';
  }

  getRefLabel(ref: DistributionReferenceLine): string {
    if (!ref.label) return this.formatVal(ref.value);
    return ref.label.includes(String(ref.value)) ? ref.label : `${ref.label} (${this.formatVal(ref.value)})`;
  }

  getRefLabelY(ref: DistributionReferenceLine, idx: number): number {
    if (ref.yOffset != null) return ref.yOffset;
    if (ref.position === 'bottom') return this.plot.plotHeight - 8;
    return 14 + (idx % 2) * 16;
  }

  getRefLabelX(ref: DistributionReferenceLine, idx: number): number {
    const xPos = this.scales?.scaleVal ? (this.scales.scaleVal(ref.value) ?? 0) : 0;
    const anchor = this.getRefTextAnchor(ref, idx);
    if (anchor === 'end') return xPos - 5;
    if (anchor === 'start') return xPos + 5;
    return xPos;
  }

  getRefTextAnchor(ref: DistributionReferenceLine, idx: number): string {
    if (ref.position === 'start') return 'start';
    if (ref.position === 'end') return 'end';
    if (ref.position === 'center') return 'middle';
    const xPos = this.scales?.scaleVal ? (this.scales.scaleVal(ref.value) ?? 0) : 0;
    if (xPos > this.plot.plotWidth - 70) return 'end';
    if (xPos < 70) return 'start';
    return idx % 2 === 0 ? 'start' : 'end';
  }

  onElementSelect(group: any): void {
    this.elementSelect.emit({ group, index: this.activeElementIndex });
  }

  onPointerLeave(): void {
    this.hoveredItem = null;
  }
}
