import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Inject,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  VIZ_COLORS,
  VIZ_SEMANTIC_COLORS,
  PATTERN_PRESETS,
  formatVizValue,
  createPlotRegion,
  createBandScale,
  createLinearScale,
  generateTicks,
  PatternPreset,
  getVizDensityTier,
  VizDensityTier
} from '../../utils/viz-core.js';

export type BarChartVariant =
  | 'vertical'
  | 'horizontal'
  | 'grouped'
  | 'stacked'
  | 'normalized'
  | 'diverging'
  | 'floating';

export interface BarSeriesConfig {
  key: string;
  label: string;
  color?: string;
  pattern?: string;
}

export interface ReferenceLineConfig {
  value: number;
  label?: string;
  tone?: 'neutral' | 'danger' | 'warning' | 'success' | 'brand';
  strokeStyle?: 'dashed' | 'solid';
  position?: 'start' | 'center' | 'end';
}

export interface ThresholdBandConfig {
  min: number;
  max: number;
  label?: string;
  tone?: 'critical' | 'warning' | 'neutral';
}

let nextBarId = 0;

@Component({
  selector: 'ds-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #chartContainer
      class="ds-bar-chart ds-bar-chart--{{ variant }}"
      [ngClass]="{ 'ds-bar-chart--loading': loading, 'ds-bar-chart--empty': !loading && (!data || data.length === 0) }"
      [style.width]="computedWidth"
      role="region"
      [attr.aria-roledescription]="'bar chart'"
      [attr.aria-label]="title || 'Bar chart visualization'"
      [attr.aria-busy]="loading"
      tabindex="0"
      (keydown)="onKeyDown($event)"
      (pointerleave)="onPointerLeave()"
    >
      <!-- Loading State -->
      <ng-container *ngIf="loading">
        <div class="ds-bar-chart__skeleton-header">
          <div class="ds-bar-chart__skeleton-title"></div>
          <div class="ds-bar-chart__skeleton-sub"></div>
        </div>
        <div class="ds-bar-chart__skeleton-plot" [style.height.px]="numericHeight"></div>
      </ng-container>

      <!-- Empty State -->
      <ng-container *ngIf="!loading && (!data || data.length === 0)">
        <h3 *ngIf="title" class="ds-bar-chart__title">{{ title }}</h3>
        <div class="ds-bar-chart__empty-msg" [style.height.px]="numericHeight">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 20V10M12 20V4M6 20v-6" />
          </svg>
          <p>{{ emptyText }}</p>
        </div>
      </ng-container>

      <!-- Main Visual Content -->
      <ng-container *ngIf="!loading && data && data.length > 0">
        <div *ngIf="title || caption" class="ds-bar-chart__header">
          <div>
            <h3 *ngIf="title" class="ds-bar-chart__title">{{ title }}</h3>
            <p *ngIf="caption" class="ds-bar-chart__caption">{{ caption }}</p>
          </div>
        </div>

        <!-- Legend Filter -->
        <div *ngIf="showLegend && normalizedSeries.length > 1" class="ds-bar-chart__legend" role="toolbar" aria-label="Series Filter">
          <button
            *ngFor="let s of normalizedSeries"
            type="button"
            class="ds-bar-chart__legend-item"
            [ngClass]="{ 'ds-bar-chart__legend-item--dimmed': activeSeries && activeSeries !== s.key }"
            (click)="toggleSeries(s.key)"
            [attr.aria-pressed]="activeSeries === s.key"
            [title]="'Click to isolate ' + s.label"
          >
            <svg class="ds-bar-chart__legend-swatch" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
              <rect x="1" y="1" width="12" height="12" rx="2" [attr.fill]="s.color" />
              <rect *ngIf="enablePatterns" x="1" y="1" width="12" height="12" rx="2" [attr.fill]="'url(#' + s.patternId + ')'" />
            </svg>
            <span class="ds-bar-chart__legend-label">{{ s.label }}</span>
          </button>
        </div>

        <!-- SVG Plot -->
        <svg
          width="100%"
          [attr.height]="numericHeight"
          [attr.viewBox]="'0 0 ' + svgWidth + ' ' + numericHeight"
          class="ds-bar-chart__svg"
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

          <g [attr.transform]="'translate(' + margins.left + ', ' + margins.top + ')'">
            <!-- Threshold Bands -->
            <ng-container *ngFor="let band of thresholdBands">
              <rect
                *ngIf="!isHorizontal"
                x="0"
                [attr.y]="Math.min(valueScale(band.max), valueScale(band.min))"
                [attr.width]="plotWidth"
                [attr.height]="Math.abs(valueScale(band.min) - valueScale(band.max))"
                [attr.fill]="getThresholdToneColor(band.tone)"
                opacity="0.12"
              />
              <rect
                *ngIf="isHorizontal"
                [attr.x]="Math.min(valueScale(band.min), valueScale(band.max))"
                y="0"
                [attr.width]="Math.abs(valueScale(band.max) - valueScale(band.min))"
                [attr.height]="plotHeight"
                [attr.fill]="getThresholdToneColor(band.tone)"
                opacity="0.12"
              />
            </ng-container>

            <!-- Gridlines -->
            <g *ngIf="showGrid">
              <ng-container *ngIf="!isHorizontal">
                <g *ngFor="let tick of valueTicks" class="ds-bar-chart__gridline">
                  <line x1="0" [attr.y1]="valueScale(tick)" [attr.x2]="plotWidth" [attr.y2]="valueScale(tick)" />
                </g>
              </ng-container>
              <ng-container *ngIf="isHorizontal">
                <g *ngFor="let tick of valueTicks" class="ds-bar-chart__gridline">
                  <line [attr.x1]="valueScale(tick)" y1="0" [attr.x2]="valueScale(tick)" [attr.y2]="plotHeight" />
                </g>
              </ng-container>
            </g>

            <!-- Baseline Line -->
            <line
              *ngIf="!isHorizontal"
              x1="0"
              [attr.y1]="valueScale(baseline)"
              [attr.x2]="plotWidth"
              [attr.y2]="valueScale(baseline)"
              stroke="var(--border-strong, #64748b)"
              stroke-width="1.5"
            />
            <line
              *ngIf="isHorizontal"
              [attr.x1]="valueScale(baseline)"
              y1="0"
              [attr.x2]="valueScale(baseline)"
              [attr.y2]="plotHeight"
              stroke="var(--border-strong, #64748b)"
              stroke-width="1.5"
            />

            <!-- Render Bars -->
            <g *ngFor="let bar of computedBars" class="ds-bar-chart__bar-group">
              <!-- Solid Bar Fill -->
              <rect
                class="ds-bar-chart__bar"
                [ngClass]="{ 'ds-bar-chart__bar--focused': focusedIndex === bar.itemIndex }"
                [attr.x]="bar.x"
                [attr.y]="bar.y"
                [attr.width]="bar.width"
                [attr.height]="bar.height"
                [attr.fill]="bar.color"
                rx="2"
                (pointerenter)="onBarPointerEnter(bar, $event)"
                (click)="onBarClick(bar)"
              />
              <!-- Pattern Hatch Overlay -->
              <rect
                *ngIf="enablePatterns"
                [attr.x]="bar.x"
                [attr.y]="bar.y"
                [attr.width]="bar.width"
                [attr.height]="bar.height"
                [attr.fill]="'url(#' + bar.patternId + ')'"
                opacity="0.5"
                pointer-events="none"
                rx="2"
              />
              <!-- Direct Value Label -->
              <text
                *ngIf="showValues"
                [attr.x]="bar.labelX"
                [attr.y]="bar.labelY"
                [attr.text-anchor]="bar.labelAnchor"
                class="ds-bar-chart__bar-label"
              >
                {{ formatVal(bar.value) }}
              </text>
            </g>

            <!-- Reference Lines -->
            <g *ngFor="let ref of referenceLines" class="ds-bar-chart__reference-line">
              <ng-container *ngIf="!isHorizontal">
                <line
                  x1="0"
                  [attr.y1]="valueScale(ref.value)"
                  [attr.x2]="plotWidth"
                  [attr.y2]="valueScale(ref.value)"
                  [attr.stroke]="getReferenceToneColor(ref.tone)"
                  [attr.stroke-dasharray]="ref.strokeStyle === 'solid' ? 'none' : '4 3'"
                  stroke-width="1.5"
                />
                <text
                  *ngIf="ref.label"
                  [attr.x]="getRefLabelX(ref)"
                  [attr.y]="valueScale(ref.value) - 5"
                  [attr.text-anchor]="getRefTextAnchor(ref)"
                  [attr.fill]="getReferenceToneColor(ref.tone)"
                  stroke="var(--surface-card, #ffffff)"
                  stroke-width="3"
                  stroke-linejoin="round"
                  paint-order="stroke fill"
                  font-size="10"
                  font-weight="600"
                  class="ds-bar-chart__ref-label"
                >
                  {{ getRefLabel(ref) }}
                </text>
              </ng-container>
              <ng-container *ngIf="isHorizontal">
                <line
                  [attr.x1]="valueScale(ref.value)"
                  y1="0"
                  [attr.x2]="valueScale(ref.value)"
                  [attr.y2]="plotHeight"
                  [attr.stroke]="getReferenceToneColor(ref.tone)"
                  [attr.stroke-dasharray]="ref.strokeStyle === 'solid' ? 'none' : '4 3'"
                  stroke-width="1.5"
                />
                <text
                  *ngIf="ref.label"
                  [attr.x]="valueScale(ref.value)"
                  [attr.y]="getRefLabelY(ref)"
                  text-anchor="middle"
                  [attr.fill]="getReferenceToneColor(ref.tone)"
                  stroke="var(--surface-card, #ffffff)"
                  stroke-width="3"
                  stroke-linejoin="round"
                  paint-order="stroke fill"
                  font-size="10"
                  font-weight="600"
                  class="ds-bar-chart__ref-label"
                >
                  {{ getRefLabel(ref) }}
                </text>
              </ng-container>
            </g>

            <!-- Axes -->
            <g *ngIf="!isHorizontal" [attr.transform]="'translate(0, ' + plotHeight + ')'" class="ds-bar-chart__axis">
              <line x1="0" y1="0" [attr.x2]="plotWidth" y2="0" stroke="var(--border-strong, #64748b)" stroke-width="1.5" />
              <g *ngFor="let cat of categoryTicks" [attr.transform]="'translate(' + ((categoryScale(cat) || 0) + (categoryScale.bandwidth ? categoryScale.bandwidth() / 2 : 0)) + ', 0)'">
                <line y2="5" stroke="var(--border-strong, #64748b)" />
                <text
                  [attr.y]="(categoryScale.bandwidth && categoryScale.bandwidth() < 38) ? 14 : 18"
                  [attr.text-anchor]="(categoryScale.bandwidth && categoryScale.bandwidth() < 38) ? 'end' : 'middle'"
                  [attr.transform]="(categoryScale.bandwidth && categoryScale.bandwidth() < 38) ? 'rotate(-35)' : ''"
                >{{ cat }}</text>
              </g>
            </g>
            <g *ngIf="!isHorizontal" class="ds-bar-chart__axis">
              <line x1="0" y1="0" x2="0" [attr.y2]="plotHeight" stroke="var(--border-strong, #64748b)" stroke-width="1.5" />
              <g *ngFor="let tick of valueTicks" [attr.transform]="'translate(0, ' + valueScale(tick) + ')'">
                <line x2="-5" stroke="var(--border-strong, #64748b)" />
                <text x="-9" dy="0.32em" text-anchor="end">{{ formatVal(tick) }}</text>
              </g>
            </g>

            <g *ngIf="isHorizontal" [attr.transform]="'translate(0, ' + plotHeight + ')'" class="ds-bar-chart__axis">
              <line x1="0" y1="0" [attr.x2]="plotWidth" y2="0" stroke="var(--border-strong, #64748b)" stroke-width="1.5" />
              <g *ngFor="let tick of valueTicks; let i = index" [attr.transform]="'translate(' + valueScale(tick) + ', 0)'">
                <line y2="5" stroke="var(--border-strong, #64748b)" />
                <text y="18" text-anchor="middle">{{ formatXTick(tick, i, valueTicks.length) }}</text>
              </g>
            </g>
            <g *ngIf="isHorizontal" class="ds-bar-chart__axis">
              <line x1="0" y1="0" x2="0" [attr.y2]="plotHeight" stroke="var(--border-strong, #64748b)" stroke-width="1.5" />
              <g *ngFor="let cat of categoryTicks" [attr.transform]="'translate(0, ' + ((categoryScale(cat) || 0) + (categoryScale.bandwidth ? categoryScale.bandwidth() / 2 : 0)) + ')'">
                <line x2="-5" stroke="var(--border-strong, #64748b)" />
                <text x="-9" dy="0.32em" text-anchor="end">{{ cat }}</text>
              </g>
            </g>
          </g>
        </svg>

        <!-- Tooltip -->
        <div
          *ngIf="showTooltip && hoveredPoint"
          class="ds-bar-chart__tooltip"
          [style.left.px]="tooltipLeft"
          [style.top.px]="tooltipTop"
          role="tooltip"
        >
          <div class="ds-bar-chart__tooltip-header">
            <strong>{{ hoveredPoint.category }}</strong>
          </div>
          <div class="ds-bar-chart__tooltip-body">
            <div class="ds-bar-chart__tooltip-row">
              <span class="ds-bar-chart__tooltip-swatch" [style.background-color]="hoveredPoint.color"></span>
              <span class="ds-bar-chart__tooltip-label">{{ hoveredPoint.seriesLabel }}:</span>
              <span class="ds-bar-chart__tooltip-val">{{ formatVal(hoveredPoint.value) }}</span>
            </div>
            <div *ngIf="isNormalized && hoveredPoint.pct != null" class="ds-bar-chart__tooltip-row">
              <span class="ds-bar-chart__tooltip-label">Share:</span>
              <span class="ds-bar-chart__tooltip-val">{{ hoveredPoint.pct.toFixed(1) }}%</span>
            </div>
          </div>
        </div>

        <!-- Screen Reader Live Region -->
        <div class="ds-bar-chart__sr-only" aria-live="polite">
          {{ srAnnouncement }}
        </div>

        <!-- Accessible Tabular Mirror -->
        <section
          *ngIf="(showDataTable || showTableToggle) && data && data.length > 0"
          class="ds-chart-table-details"
        >
          <button type="button" class="ds-chart-table-summary" [attr.aria-pressed]="showTableVisually" (click)="showTableVisually = !showTableVisually">
            {{ showTableVisually ? 'Hide data table on screen' : 'Show data table on screen' }}
          </button>
          <div class="ds-chart-table-wrap" [class.ds-chart-table-wrap--visually-hidden]="!showTableVisually">
            <table class="ds-chart-table">
              <caption class="ds-bar-chart__sr-only">
                {{ title ? title + ' Data Table' : 'Bar Chart Data Table' }}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{{ categoryKey }}</th>
                  <th *ngFor="let s of normalizedSeries" scope="col">{{ s.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of data; let idx = index">
                  <th scope="row">{{ row[categoryKey] ?? (idx + 1) }}</th>
                  <td *ngFor="let s of normalizedSeries">
                    {{ row[s.key] != null ? formatVal(row[s.key]) : '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </ng-container>
    </div>
  `,
  styleUrls: ['./bar-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsBarChartComponent implements AfterViewInit, OnDestroy {
  Math = Math;

  @Input() data: any[] = [];
  @Input() categoryKey: string = 'label';
  @Input() valueKey: string = 'value';
  @Input() series: (string | BarSeriesConfig)[] | null = null;
  @Input() variant: BarChartVariant = 'vertical';
  @Input() orientation: 'vertical' | 'horizontal' | null = null;
  @Input() title: string = '';
  @Input() caption: string = '';
  @Input() description: string = '';
  @Input() unit: string = '';
  @Input() locale: string = 'en-IN';
  @Input() valueFormatter: ((val: number, item?: any) => string) | null = null;
  @Input() referenceLines: ReferenceLineConfig[] = [];
  @Input() thresholdBands: ThresholdBandConfig[] = [];
  @Input() baseline: number = 0;
  @Input() domain: [number, number] | null = null;
  @Input() selectedKey: string | number | null = null;
  @Input() showGrid: boolean = true;
  @Input() showValues: boolean = false;
  @Input() showLegend: boolean = true;
  @Input() showTooltip: boolean = true;
  @Input() showDataTable: boolean = true;
  showTableVisually = false;
  @Input() showTableToggle: boolean = true;
  @Input() enablePatterns: boolean = true;
  @Input() loading: boolean = false;
  @Input() emptyText: string = 'No data available for this selection';
  @Input() height: number | string = 280;
  @Input() width: number | string = '100%';

  @Output() select = new EventEmitter<{ item: any; seriesKey?: string }>();

  @ViewChild('chartContainer') containerRef?: ElementRef<HTMLDivElement>;

  chartId = `ds-bar-chart-${++nextBarId}`;
  activeSeries: string | null = null;
  focusedIndex: number = -1;
  hoveredPoint: any = null;
  patternPresetsList: PatternPreset[] = PATTERN_PRESETS;

  measuredWidth: number = 0;
  private resizeObserver?: ResizeObserver;

  constructor(@Inject(ChangeDetectorRef) private cdr: ChangeDetectorRef) {}

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

  get isHorizontal(): boolean {
    return this.orientation === 'horizontal' || this.variant === 'horizontal' || this.variant === 'diverging';
  }

  get isGrouped(): boolean { return this.variant === 'grouped'; }
  get isStacked(): boolean { return this.variant === 'stacked'; }
  get isNormalized(): boolean { return this.variant === 'normalized'; }
  get isDiverging(): boolean { return this.variant === 'diverging'; }
  get isFloating(): boolean { return this.variant === 'floating'; }

  get numericHeight(): number {
    return typeof this.height === 'number' ? this.height : 280;
  }

  get computedWidth(): string {
    return typeof this.width === 'number' ? `${this.width}px` : String(this.width);
  }

  get computedContainerWidth(): number {
    return Math.max(280, this.measuredWidth || (typeof this.width === 'number' ? this.width : 600));
  }

  get densityTier(): VizDensityTier {
    return getVizDensityTier(this.computedContainerWidth);
  }

  get svgWidth(): number {
    return this.computedContainerWidth;
  }

  get margins() {
    const isMobile = this.densityTier === 'compact' || this.densityTier === 'mobile';
    if (this.isHorizontal) {
      const maxCatLen = this.categories.reduce((max, c) => Math.max(max, c.length), 0);
      const leftPad = isMobile ? Math.min(110, Math.max(52, maxCatLen * 6.5 + 12)) : Math.min(160, Math.max(72, maxCatLen * 8 + 18));
      return { top: 20, right: isMobile ? 12 : 24, bottom: isMobile ? 32 : 38, left: leftPad };
    }
    const sampleFormattedVal = this.formatVal(this.computedDomain[1]);
    const valLen = String(sampleFormattedVal).length;
    const dynamicLeft = Math.min(130, Math.max(isMobile ? 54 : 64, valLen * 7.5 + 20));

    const estBandWidth = (this.svgWidth - dynamicLeft - 24) / Math.max(1, this.categories.length);
    const needsRotation = estBandWidth < 38;
    const maxCatLen = this.categories.reduce((max, c) => Math.max(max, c.length), 0);
    const dynamicBottom = needsRotation ? Math.min(76, Math.max(48, maxCatLen * 5.5 + 18)) : (isMobile ? 36 : 44);

    return {
      top: 20,
      right: isMobile ? 12 : 24,
      bottom: dynamicBottom,
      left: dynamicLeft
    };
  }

  get plotWidth(): number {
    return Math.max(10, this.svgWidth - this.margins.left - this.margins.right);
  }

  get plotHeight(): number {
    return Math.max(10, this.numericHeight - this.margins.top - this.margins.bottom);
  }

  get normalizedSeries(): Array<{ key: string; label: string; color: string; patternId: string }> {
    if (this.series && Array.isArray(this.series) && this.series.length > 0) {
      return this.series.map((s, idx) => {
        const key = typeof s === 'string' ? s : s.key;
        const label = typeof s === 'string' ? s : (s.label || s.key);
        const color = (typeof s === 'object' && s.color) ? s.color : VIZ_COLORS[idx % VIZ_COLORS.length];
        const pattern = typeof s === 'object' ? s.pattern : undefined;
        const patternId = pattern ? `${this.chartId}-${pattern}` : `${this.chartId}-${PATTERN_PRESETS[idx % PATTERN_PRESETS.length].id}`;
        return { key, label, color, patternId };
      });
    }
    return [{
      key: this.valueKey,
      label: this.title || 'Value',
      color: VIZ_COLORS[0],
      patternId: `${this.chartId}-${PATTERN_PRESETS[0].id}`
    }];
  }

  get categories(): string[] {
    if (!this.data) return [];
    return this.data.map((d, i) => String(d[this.categoryKey] != null ? d[this.categoryKey] : `Category ${i + 1}`));
  }

  get computedDomain(): [number, number] {
    if (this.domain) return this.domain;
    if (this.isNormalized) return [0, 100];
    if (!this.data || this.data.length === 0) return [0, 100];

    let min = this.baseline;
    let max = this.baseline;

    if (this.isStacked) {
      this.data.forEach(d => {
        let pos = 0;
        let neg = 0;
        this.normalizedSeries.forEach(s => {
          const v = Number(d[s.key]) || 0;
          if (v >= 0) pos += v;
          else neg += v;
        });
        if (pos > max) max = pos;
        if (neg < min) min = neg;
      });
    } else if (this.isFloating) {
      this.data.forEach(d => {
        const start = Number(d.start ?? d.min ?? 0);
        const end = Number(d.end ?? d.max ?? d[this.valueKey] ?? 0);
        if (Math.max(start, end) > max) max = Math.max(start, end);
        if (Math.min(start, end) < min) min = Math.min(start, end);
      });
    } else if (this.normalizedSeries.length > 1) {
      this.data.forEach(d => {
        this.normalizedSeries.forEach(s => {
          const v = Number(d[s.key]) || 0;
          if (v > max) max = v;
          if (v < min) min = v;
        });
      });
    } else {
      this.data.forEach(d => {
        const v = Number(d[this.valueKey]) || 0;
        if (v > max) max = v;
        if (v < min) min = v;
      });
    }

    const span = max - min || 1;
    return [min < 0 ? min - span * 0.05 : 0, max + span * 0.08];
  }

  get categoryScale() {
    return createBandScale({
      domain: this.categories,
      range: this.isHorizontal ? [0, this.plotHeight] : [0, this.plotWidth],
      paddingInner: 0.25,
      paddingOuter: 0.15
    });
  }

  get valueScale() {
    return createLinearScale({
      domain: this.computedDomain,
      range: this.isHorizontal ? [0, this.plotWidth] : [this.plotHeight, 0],
      baseline: this.baseline
    });
  }

  get categoryTicks(): string[] {
    return this.categories;
  }

  get valueTicks(): number[] {
    const count = this.isHorizontal
      ? (this.plotWidth < 260 ? 3 : this.plotWidth < 400 ? 4 : 5)
      : (this.plotHeight < 200 ? 3 : 4);
    return generateTicks(this.valueScale, count);
  }

  formatXTick(val: number, idx: number, total: number): string {
    if (this.isNormalized) return `${Number(val).toFixed(0)}%`;
    if (this.valueFormatter) return this.valueFormatter(val);
    if (!this.unit) return formatVizValue(val, '', this.locale);
    if (this.plotWidth < 360) {
      return idx === total - 1 ? `${val}${this.unit}` : String(val);
    }
    return `${val}${this.unit}`;
  }

  get computedBars(): any[] {
    if (!this.data || this.data.length === 0) return [];

    const bars: any[] = [];
    const catScale = this.categoryScale;
    const valScale = this.valueScale;
    const bandwidth = catScale.bandwidth ? catScale.bandwidth() : 20;

    this.data.forEach((item, itemIdx) => {
      const cat = String(item[this.categoryKey] != null ? item[this.categoryKey] : `Category ${itemIdx + 1}`);
      const catPos = catScale(cat) || 0;

      if (this.isGrouped && this.normalizedSeries.length > 1) {
        const subWidth = bandwidth / this.normalizedSeries.length;
        this.normalizedSeries.forEach((s, sIdx) => {
          const v = Number(item[s.key]) || 0;
          const subCatPos = catPos + sIdx * subWidth;

          if (!this.isHorizontal) {
            const y0 = valScale(Math.max(this.baseline, v));
            const y1 = valScale(Math.min(this.baseline, v));
            const h = Math.max(2, Math.abs(y1 - y0));
            bars.push({
              itemIndex: itemIdx,
              category: cat,
              seriesKey: s.key,
              seriesLabel: s.label,
              value: v,
              color: s.color,
              patternId: s.patternId,
              x: subCatPos,
              y: y0,
              width: Math.max(1, subWidth - 2),
              height: h,
              labelX: subCatPos + subWidth / 2,
              labelY: y0 - 4,
              labelAnchor: 'middle',
              item
            });
          } else {
            const x0 = valScale(Math.min(this.baseline, v));
            const x1 = valScale(Math.max(this.baseline, v));
            const w = Math.max(2, Math.abs(x1 - x0));
            bars.push({
              itemIndex: itemIdx,
              category: cat,
              seriesKey: s.key,
              seriesLabel: s.label,
              value: v,
              color: s.color,
              patternId: s.patternId,
              x: x0,
              y: subCatPos,
              width: w,
              height: Math.max(1, subWidth - 2),
              labelX: x1 + 4,
              labelY: subCatPos + subWidth / 2 + 3,
              labelAnchor: 'start',
              item
            });
          }
        });
      } else if (this.isStacked && this.normalizedSeries.length > 1) {
        let posSum = 0;
        let negSum = 0;
        this.normalizedSeries.forEach((s) => {
          const v = Number(item[s.key]) || 0;
          if (v >= 0) {
            const y0 = valScale(posSum + v);
            const y1 = valScale(posSum);
            const h = Math.max(1, Math.abs(y1 - y0));
            bars.push({
              itemIndex: itemIdx,
              category: cat,
              seriesKey: s.key,
              seriesLabel: s.label,
              value: v,
              color: s.color,
              patternId: s.patternId,
              x: catPos,
              y: y0,
              width: bandwidth,
              height: h,
              labelX: catPos + bandwidth / 2,
              labelY: y0 + h / 2 + 3,
              labelAnchor: 'middle',
              item
            });
            posSum += v;
          } else {
            const y0 = valScale(negSum);
            const y1 = valScale(negSum + v);
            const h = Math.max(1, Math.abs(y1 - y0));
            bars.push({
              itemIndex: itemIdx,
              category: cat,
              seriesKey: s.key,
              seriesLabel: s.label,
              value: v,
              color: s.color,
              patternId: s.patternId,
              x: catPos,
              y: y0,
              width: bandwidth,
              height: h,
              labelX: catPos + bandwidth / 2,
              labelY: y0 + h / 2 + 3,
              labelAnchor: 'middle',
              item
            });
            negSum += v;
          }
        });
      } else if (this.isNormalized && this.normalizedSeries.length > 1) {
        const total = this.normalizedSeries.reduce((sum, s) => sum + Math.max(0, Number(item[s.key]) || 0), 0);
        let runningPct = 0;
        this.normalizedSeries.forEach(s => {
          const raw = Math.max(0, Number(item[s.key]) || 0);
          const pct = total > 0 ? (raw / total) * 100 : 0;
          const y0 = valScale(runningPct + pct);
          const y1 = valScale(runningPct);
          const h = Math.max(1, Math.abs(y1 - y0));

          bars.push({
            itemIndex: itemIdx,
            category: cat,
            seriesKey: s.key,
            seriesLabel: s.label,
            value: raw,
            pct,
            color: s.color,
            patternId: s.patternId,
            x: catPos,
            y: y0,
            width: bandwidth,
            height: h,
            labelX: catPos + bandwidth / 2,
            labelY: y0 + h / 2 + 3,
            labelAnchor: 'middle',
            item
          });
          runningPct += pct;
        });
      } else {
        const s = this.normalizedSeries[0];
        const v = Number(item[s.key] != null ? item[s.key] : item[this.valueKey]) || 0;

        if (!this.isHorizontal) {
          const y0 = valScale(Math.max(this.baseline, v));
          const y1 = valScale(Math.min(this.baseline, v));
          const h = Math.max(2, Math.abs(y1 - y0));
          bars.push({
            itemIndex: itemIdx,
            category: cat,
            seriesKey: s.key,
            seriesLabel: s.label,
            value: v,
            color: s.color,
            patternId: s.patternId,
            x: catPos,
            y: y0,
            width: bandwidth,
            height: h,
            labelX: catPos + bandwidth / 2,
            labelY: y0 - 4,
            labelAnchor: 'middle',
            item
          });
        } else {
          const x0 = valScale(Math.min(this.baseline, v));
          const x1 = valScale(Math.max(this.baseline, v));
          const w = Math.max(2, Math.abs(x1 - x0));
          bars.push({
            itemIndex: itemIdx,
            category: cat,
            seriesKey: s.key,
            seriesLabel: s.label,
            value: v,
            color: s.color,
            patternId: s.patternId,
            x: x0,
            y: catPos,
            width: w,
            height: bandwidth,
            labelX: x1 + 4,
            labelY: catPos + bandwidth / 2 + 3,
            labelAnchor: 'start',
            item
          });
        }
      }
    });

    return bars;
  }

  get tooltipLeft(): number {
    if (!this.hoveredPoint) return 0;
    return Math.min(this.margins.left + this.hoveredPoint.x + 20, this.svgWidth - 180);
  }

  get tooltipTop(): number {
    if (!this.hoveredPoint) return 0;
    return this.margins.top + this.hoveredPoint.y;
  }

  get srAnnouncement(): string {
    if (this.focusedIndex >= 0 && this.data[this.focusedIndex]) {
      const item = this.data[this.focusedIndex];
      return `Selected category ${item[this.categoryKey]}, value: ${item[this.valueKey] || ''}`;
    }
    return '';
  }

  toggleSeries(key: string): void {
    this.activeSeries = this.activeSeries === key ? null : key;
  }

  formatVal(val: any): string {
    if (this.valueFormatter) return this.valueFormatter(Number(val));
    return formatVizValue(val, this.unit);
  }

  getReferenceToneColor(tone?: string): string {
    if (tone === 'danger') return VIZ_SEMANTIC_COLORS.critical;
    if (tone === 'warning') return VIZ_SEMANTIC_COLORS.warning;
    if (tone === 'success') return VIZ_SEMANTIC_COLORS.success;
    if (tone === 'brand') return 'var(--brand-default, #2563eb)';
    return VIZ_SEMANTIC_COLORS.info || VIZ_SEMANTIC_COLORS.neutral;
  }

  getRefLabelX(ref: ReferenceLineConfig): number {
    const pos = ref.position || 'end';
    if (pos === 'start') return 8;
    if (pos === 'center') return this.plotWidth / 2;
    return this.plotWidth - 8;
  }

  getRefTextAnchor(ref: ReferenceLineConfig): string {
    const pos = ref.position || 'end';
    if (pos === 'start') return 'start';
    if (pos === 'center') return 'middle';
    return 'end';
  }

  getRefLabelY(ref: ReferenceLineConfig): number {
    const pos = ref.position || 'center';
    if (pos === 'start') return 14;
    if (pos === 'end') return this.plotHeight - 6;
    return -6;
  }

  getRefLabel(ref: ReferenceLineConfig): string {
    if (!ref.label) return this.formatVal(ref.value);
    return ref.label.includes(String(ref.value)) ? ref.label : `${ref.label} (${this.formatVal(ref.value)})`;
  }

  getThresholdToneColor(tone?: string): string {
    if (tone === 'critical') return VIZ_SEMANTIC_COLORS.critical;
    if (tone === 'warning') return VIZ_SEMANTIC_COLORS.warning;
    return VIZ_SEMANTIC_COLORS.neutral;
  }

  onBarPointerEnter(bar: any, event: PointerEvent): void {
    this.hoveredPoint = bar;
    this.focusedIndex = bar.itemIndex;
  }

  onPointerLeave(): void {
    this.hoveredPoint = null;
    this.focusedIndex = -1;
  }

  onBarClick(bar: any): void {
    this.select.emit({ item: bar.item, seriesKey: bar.seriesKey });
  }

  onKeyDown(e: KeyboardEvent): void {
    if (!this.data || this.data.length === 0) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        this.focusedIndex = (this.focusedIndex + 1) % this.data.length;
        this.select.emit({ item: this.data[this.focusedIndex] });
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        this.focusedIndex = (this.focusedIndex - 1 + this.data.length) % this.data.length;
        this.select.emit({ item: this.data[this.focusedIndex] });
        break;
      case 'Home':
        e.preventDefault();
        this.focusedIndex = 0;
        this.select.emit({ item: this.data[0] });
        break;
      case 'End':
        e.preventDefault();
        this.focusedIndex = this.data.length - 1;
        this.select.emit({ item: this.data[this.data.length - 1] });
        break;
      case 'Escape':
        e.preventDefault();
        this.hoveredPoint = null;
        this.focusedIndex = -1;
        break;
    }
  }
}
