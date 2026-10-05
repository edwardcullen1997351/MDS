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
  PATTERN_PRESETS,
  formatVizValue,
  createPlotRegion,
  createLinearScale,
  createTimeScale,
  createBandScale,
  createPointScale,
  generateTicks,
  createAreaPath,
  createLinePath,
  stackSeriesData,
  PlotMargins,
  PatternPreset,
  getVizDensityTier,
  VizDensityTier
} from '../../utils/viz-core.js';

export type AreaChartVariant = 'single' | 'stacked' | 'normalized' | 'diverging' | 'stream';
export type AreaCurveType = 'linear' | 'monotone' | 'step-after';
export type AreaScaleType = 'time' | 'linear' | 'band' | 'point';
export type AreaDensity = 'compact' | 'standard' | 'expanded';

export interface AreaSeriesDef {
  key: string;
  label?: string;
  color?: string;
  pattern?: string;
  strokeWidth?: number;
}

export interface AreaReferenceLine {
  y: number;
  label?: string;
  color?: string;
  position?: 'start' | 'center' | 'end';
}

export interface AreaThresholdBand {
  yMin?: number;
  yMax?: number;
  y1?: number;
  y2?: number;
  label?: string;
  color?: string;
}

let nextId = 0;

@Component({
  selector: 'ds-area-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #chartContainer
      class="ds-area-chart ds-area-chart--{{ variant }} ds-area-chart--density-{{ density }}"
      [ngClass]="{ 'ds-area-chart--loading': loading, 'ds-area-chart--empty': !loading && (!data || data.length === 0) }"
      [style.width]="'100%'"
      role="region"
      [attr.aria-roledescription]="'area chart'"
      [attr.aria-label]="title || 'Area chart visualization'"
      [attr.aria-busy]="loading"
      tabindex="0"
      (keydown)="onKeyDown($event)"
      (pointermove)="onPointerMove($event)"
      (pointerleave)="onPointerLeave()"
    >
      <!-- Loading State -->
      <ng-container *ngIf="loading">
        <div class="ds-area-chart__skeleton-header">
          <div class="ds-area-chart__skeleton-title"></div>
          <div class="ds-area-chart__skeleton-sub"></div>
        </div>
        <div class="ds-area-chart__skeleton-plot" [style.height.px]="height"></div>
      </ng-container>

      <!-- Empty State -->
      <ng-container *ngIf="!loading && (!data || data.length === 0)">
        <h3 *ngIf="title" class="ds-area-chart__title">{{ title }}</h3>
        <div class="ds-area-chart__empty-msg" [style.height.px]="height">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 3v18h18M7 16l4-4 4 4 5-8" />
          </svg>
          <p>{{ emptyMessage }}</p>
        </div>
      </ng-container>

      <!-- Main Visual Content -->
      <ng-container *ngIf="!loading && data && data.length > 0">
        <div *ngIf="title || subtitle" class="ds-area-chart__header">
          <div>
            <h3 *ngIf="title" class="ds-area-chart__title">{{ title }}</h3>
            <p *ngIf="subtitle" class="ds-area-chart__subtitle">{{ subtitle }}</p>
          </div>
        </div>

        <!-- Legend Filter -->
        <div *ngIf="showLegend && seriesDefs.length > 1" class="ds-area-chart__legend" role="toolbar" aria-label="Series Filter">
          <button
            *ngFor="let s of seriesDefs"
            type="button"
            class="ds-area-chart__legend-item"
            [ngClass]="{ 'ds-area-chart__legend-item--dimmed': isolatedSeries && isolatedSeries !== s.key }"
            (click)="toggleSeriesIsolation(s.key)"
            [attr.aria-pressed]="isolatedSeries === s.key"
            [title]="'Click to isolate ' + s.label"
          >
            <svg class="ds-area-chart__legend-swatch" width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
              <rect x="1" y="1" width="14" height="12" rx="2" [attr.fill]="s.color" />
              <rect *ngIf="enablePatterns" x="1" y="1" width="14" height="12" rx="2" [attr.fill]="'url(#' + chartId + '-' + s.pattern + ')'" />
            </svg>
            <span class="ds-area-chart__legend-label">{{ s.label }}</span>
          </button>
        </div>

        <!-- SVG Plot -->
        <svg
          width="100%"
          [attr.height]="height"
          [attr.viewBox]="'0 0 ' + plotWidth + ' ' + height"
          class="ds-area-chart__svg mds-chart-svg"
          aria-hidden="true"
          style="overflow: visible; display: block; width: 100%; height: auto;"
        >
          <defs>
            <linearGradient
              *ngFor="let s of seriesDefs"
              [attr.id]="chartId + '-grad-' + s.key"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" [attr.stop-color]="s.color" stop-opacity="0.45" />
              <stop offset="100%" [attr.stop-color]="s.color" stop-opacity="0.03" />
            </linearGradient>

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

            <clipPath [attr.id]="chartId + '-clip'">
              <rect x="0" y="0" [attr.width]="plot.plotWidth" [attr.height]="plot.plotHeight" />
            </clipPath>
          </defs>

          <g [attr.transform]="'translate(' + plot.margins.left + ', ' + plot.margins.top + ')'">
            <!-- Threshold Bands -->
            <rect
              *ngFor="let band of thresholdBands"
              x="0"
              [attr.y]="getBandY(band)"
              [attr.width]="plot.plotWidth"
              [attr.height]="getBandHeight(band)"
              [attr.fill]="band.color || 'rgba(16,185,129,0.08)'"
            />

            <!-- Y Gridlines -->
            <g *ngIf="showGridY">
              <g *ngFor="let tickVal of yTicks" class="ds-area-chart__gridline">
                <line x1="0" [attr.y1]="yScale(tickVal)" [attr.x2]="plot.plotWidth" [attr.y2]="yScale(tickVal)" />
              </g>
            </g>

            <!-- X Gridlines -->
            <g *ngIf="showGridX">
              <g *ngFor="let tickVal of xTicks" class="ds-area-chart__gridline">
                <line [attr.x1]="xScale(tickVal)" y1="0" [attr.x2]="xScale(tickVal)" [attr.y2]="plot.plotHeight" />
              </g>
            </g>

            <!-- Area Fills & Boundaries -->
            <g [attr.clip-path]="'url(#' + chartId + '-clip)'">
              <g *ngFor="let layer of areaLayers" class="ds-area-chart__layer">
                <path
                  [attr.d]="layer.areaPathD"
                  [attr.fill]="variant === 'single' ? 'url(#' + chartId + '-grad-' + layer.def.key + ')' : layer.def.color"
                  [attr.opacity]="variant === 'single' ? 1 : 0.85"
                />
                <path
                  *ngIf="enablePatterns"
                  [attr.d]="layer.areaPathD"
                  [attr.fill]="'url(#' + chartId + '-' + layer.def.pattern + ')'"
                  opacity="0.65"
                />
                <path
                  [attr.d]="layer.boundaryPathD"
                  fill="none"
                  [attr.stroke]="layer.def.color"
                  [attr.stroke-width]="layer.def.strokeWidth || 2"
                />
                <ng-container *ngIf="showPoints">
                  <circle
                    *ngFor="let pt of layer.upperPoints"
                    [attr.cx]="pt.x"
                    [attr.cy]="pt.y"
                    r="3.5"
                    fill="var(--surface-card, #ffffff)"
                    [attr.stroke]="layer.def.color"
                    stroke-width="2"
                  />
                </ng-container>
              </g>
            </g>

            <!-- Reference Lines -->
            <g *ngFor="let ref of referenceLines" class="ds-area-chart__reference-line">
              <line
                x1="0"
                [attr.y1]="yScale(ref.y)"
                [attr.x2]="plot.plotWidth"
                [attr.y2]="yScale(ref.y)"
                [attr.stroke]="ref.color || 'var(--status-critical-solid, #ef4444)'"
                stroke-dasharray="4 3"
                stroke-width="1.5"
              />
              <text
                *ngIf="ref.label"
                [attr.x]="getRefLabelX(ref)"
                [attr.y]="yScale(ref.y) - 5"
                [attr.text-anchor]="getRefAnchor(ref)"
                [attr.fill]="ref.color || 'var(--status-critical-solid, #ef4444)'"
                stroke="var(--surface-card, #ffffff)"
                stroke-width="3"
                stroke-linejoin="round"
                paint-order="stroke fill"
                font-size="11"
                font-weight="600"
                class="ds-area-chart__ref-label"
              >
                {{ formatRefLabel(ref) }}
              </text>
            </g>

            <!-- Crosshair & Active Point -->
            <g *ngIf="activeXIndex >= 0 && enableCrosshair" class="ds-area-chart__crosshair">
              <line
                [attr.x1]="activeXPos"
                y1="0"
                [attr.x2]="activeXPos"
                [attr.y2]="plot.plotHeight"
                stroke="var(--border-strong, #64748b)"
                stroke-dasharray="3 3"
                stroke-width="1.5"
              />
              <ng-container *ngFor="let layer of areaLayers">
                <circle
                  *ngIf="layer.upperPoints[activeXIndex]"
                  [attr.cx]="activeXPos"
                  [attr.cy]="layer.upperPoints[activeXIndex].y"
                  r="5"
                  fill="var(--surface-card, #ffffff)"
                  [attr.stroke]="layer.def.color"
                  stroke-width="2.5"
                />
              </ng-container>
            </g>

            <!-- X Axis -->
            <g [attr.transform]="'translate(0, ' + plot.plotHeight + ')'" class="ds-area-chart__axis ds-area-chart__axis--x">
              <line x1="0" y1="0" [attr.x2]="plot.plotWidth" y2="0" stroke="var(--border-subtle, #cbd5e1)" />
              <g *ngFor="let tickVal of xTicks; let i = index; let first = first; let last = last" [attr.transform]="'translate(' + xScale(tickVal) + ', 0)'">
                <line y2="5" stroke="var(--border-subtle, #cbd5e1)" />
                <text y="18" [attr.text-anchor]="first ? 'start' : (last ? 'end' : 'middle')">{{ formatXTick(tickVal) }}</text>
              </g>
            </g>

            <!-- Y Axis -->
            <g class="ds-area-chart__axis ds-area-chart__axis--y">
              <line x1="0" y1="0" x2="0" [attr.y2]="plot.plotHeight" stroke="var(--border-subtle, #cbd5e1)" />
              <g *ngFor="let tickVal of yTicks" [attr.transform]="'translate(0, ' + yScale(tickVal) + ')'">
                <line x2="-5" stroke="var(--border-subtle, #cbd5e1)" />
                <text x="-9" dy="0.32em" text-anchor="end">{{ formatYTick(tickVal) }}</text>
              </g>
            </g>
          </g>
        </svg>

        <!-- Tooltip -->
        <div
          *ngIf="activeXIndex >= 0 && activeXDatum"
          class="ds-area-chart__tooltip"
          [style.left.px]="tooltipLeft"
          [style.top.px]="plot.margins.top + 10"
          role="tooltip"
        >
          <div class="ds-area-chart__tooltip-header">
            <strong>{{ formatTooltipHeader(activeXDatum[xKey]) }}</strong>
          </div>
          <div class="ds-area-chart__tooltip-body">
            <div *ngFor="let layer of areaLayers; let sIdx = index" class="ds-area-chart__tooltip-row">
              <span class="ds-area-chart__tooltip-swatch" [style.background-color]="layer.def.color"></span>
              <span class="ds-area-chart__tooltip-label">{{ layer.def.label }}:</span>
              <span class="ds-area-chart__tooltip-val">
                {{ formatVal(getStackedRawVal(sIdx, activeXIndex), yUnit) }}
                <ng-container *ngIf="variant === 'normalized'">
                  ({{ getStackedShare(sIdx, activeXIndex).toFixed(1) }}%)
                </ng-container>
              </span>
            </div>
            <div *ngIf="variant === 'stacked' && activeSeriesDefs.length > 1" class="ds-area-chart__tooltip-row ds-area-chart__tooltip-row--total">
              <span>Total Accumulated:</span>
              <strong>{{ formatVal(getActiveDatumTotal(activeXDatum), yUnit) }}</strong>
            </div>
          </div>
        </div>

        <!-- Screen Reader Live Region -->
        <div class="ds-area-chart__sr-only" aria-live="polite">
          {{ srAnnouncement }}
        </div>

        <!-- Accessible Tabular Mirror -->
        <section
          *ngIf="showDataTable && data && data.length > 0"
          class="ds-chart-table-details"
        >
          <button type="button" class="ds-chart-table-summary" [attr.aria-pressed]="showTableVisually" (click)="showTableVisually = !showTableVisually">
            {{ showTableVisually ? 'Hide data table on screen' : 'Show data table on screen' }}
          </button>
          <div class="ds-chart-table-wrap" [class.ds-chart-table-wrap--visually-hidden]="!showTableVisually">
            <table class="ds-chart-table">
              <caption class="ds-area-chart__sr-only">
                {{ title ? title + ' Data Table' : 'Area Chart Data Table' }}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{{ xKey }}</th>
                  <th *ngFor="let s of seriesDefs" scope="col">{{ s.label || s.key }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of data; let idx = index">
                  <th scope="row">{{ row[xKey] ?? (idx + 1) }}</th>
                  <td *ngFor="let s of seriesDefs">
                    {{ row[s.key] != null ? formatVal(row[s.key], yUnit) : '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </ng-container>
    </div>
  `,
  styleUrls: ['./area-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsAreaChartComponent implements AfterViewInit, OnDestroy {
  @Input() data: Array<Record<string, any>> = [];
  @Input() series: AreaSeriesDef[] = [];
  @Input() xKey: string = 'x';
  @Input() yKey: string = 'y';
  @Input() variant: AreaChartVariant = 'single';
  @Input() curve: AreaCurveType = 'monotone';
  @Input() baseline: number = 0;
  @Input() width: number = 640;
  @Input() height: number = 320;
  @Input() margins: Partial<PlotMargins> = { top: 20, right: 28, bottom: 36, left: 72 };
  @Input() xScaleType: AreaScaleType = 'time';
  @Input() xUnit: string = '';
  @Input() yUnit: string = '';
  @Input() locale: string = 'en-IN';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() referenceLines: AreaReferenceLine[] = [];
  @Input() thresholdBands: AreaThresholdBand[] = [];
  @Input() showGridX: boolean = false;
  @Input() showGridY: boolean = true;
  @Input() showPoints: boolean = false;
  @Input() showLegend: boolean = true;
  @Input() showDataTable: boolean = true;
  showTableVisually = false;
  @Input() enableCrosshair: boolean = true;
  @Input() enablePatterns: boolean = true;
  @Input() patternPresets: string[] = ['pat-diagonal', 'pat-dots', 'pat-cross', 'pat-horizontal', 'pat-vertical', 'pat-mesh'];
  @Input() density: AreaDensity = 'standard';
  @Input() emptyMessage: string = 'No telemetry data available for the selected interval.';
  @Input() loading: boolean = false;

  @Output() pointSelect = new EventEmitter<{ datum: Record<string, any>; index: number }>();

  @ViewChild('chartContainer') containerRef?: ElementRef<HTMLDivElement>;

  chartId = `ds-area-chart-${++nextId}`;
  activeXIndex = -1;
  isolatedSeries: string | null = null;
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

  get plotWidth(): number {
    return Math.max(280, this.measuredWidth || this.width);
  }

  get densityTier(): VizDensityTier {
    return getVizDensityTier(this.plotWidth);
  }

  parseTime(val: any): Date | null {
    if (val == null) return null;
    if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
    if (typeof val === 'number') {
      if (val > 1000000000) {
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      }
      return null;
    }
    const str = String(val).trim();
    const timeMatch = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (timeMatch) {
      return new Date(2026, 0, 1, parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), parseInt(timeMatch[3] || '0', 10));
    }
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      const d = new Date(str);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  }

  get seriesDefs(): AreaSeriesDef[] {
    if (this.series && this.series.length > 0) {
      return this.series.map((s, idx) => ({
        key: s.key || `series_${idx}`,
        label: s.label || s.key || `Series ${idx + 1}`,
        color: s.color || VIZ_COLORS[idx % VIZ_COLORS.length],
        pattern: s.pattern || this.patternPresets[idx % this.patternPresets.length],
        strokeWidth: s.strokeWidth || 2
      }));
    }
    return [{
      key: this.yKey,
      label: this.title || 'Telemetry Value',
      color: VIZ_COLORS[0],
      pattern: this.patternPresets[0],
      strokeWidth: 2
    }];
  }

  get activeSeriesDefs(): AreaSeriesDef[] {
    if (this.isolatedSeries) {
      return this.seriesDefs.filter(s => s.key === this.isolatedSeries);
    }
    return this.seriesDefs;
  }

  get activeKeys(): string[] {
    return this.activeSeriesDefs.map(s => s.key);
  }

  get effectiveLeftMargin(): number {
    return (this.densityTier === 'compact' || this.densityTier === 'mobile')
      ? Math.min(this.margins?.left ?? 72, 48)
      : (this.margins?.left ?? 72);
  }

  get plot() {
    return createPlotRegion({
      containerWidth: this.plotWidth,
      containerHeight: this.height,
      margins: {
        top: this.margins?.top ?? 20,
        right: this.margins?.right ?? 28,
        bottom: this.margins?.bottom ?? 36,
        left: this.effectiveLeftMargin
      }
    });
  }

  get stackedData(): any[][] {
    if (!this.data || this.data.length === 0) return [];
    return stackSeriesData(this.data, this.activeKeys, {
      type: this.variant,
      baseline: this.baseline
    });
  }

  get scales() {
    if (!this.data || this.data.length === 0) {
      return {
        xScale: (v: any) => 0,
        yScale: (v: any) => 0,
        xTicks: [] as any[],
        yTicks: [] as any[]
      };
    }

    let xScale: any;
    const xValues = this.data.map(d => d[this.xKey]);
    if (this.xScaleType === 'time') {
      const minDate = this.parseTime(xValues[0]);
      const maxDate = this.parseTime(xValues[xValues.length - 1]);
      if (minDate && maxDate) {
        xScale = createTimeScale({
          domain: [minDate, maxDate],
          range: [0, this.plot.plotWidth]
        });
      } else {
        xScale = createPointScale({
          domain: xValues.map(String),
          range: [0, this.plot.plotWidth]
        });
      }
    } else if (this.xScaleType === 'band' || this.xScaleType === 'point') {
      xScale = createPointScale({
        domain: xValues.map(String),
        range: [0, this.plot.plotWidth]
      });
    } else {
      const minX = Math.min(...xValues.map(Number));
      const maxX = Math.max(...xValues.map(Number));
      xScale = createLinearScale({
        domain: [minX, maxX],
        range: [0, this.plot.plotWidth]
      });
    }

    let minY = 0;
    let maxY = 100;

    if (this.variant === 'normalized') {
      minY = 0;
      maxY = 100;
    } else if (this.stackedData.length > 0) {
      let minVal = Infinity;
      let maxVal = -Infinity;

      this.stackedData.forEach(seriesPoints => {
        seriesPoints.forEach(p => {
          if (p.y0 < minVal) minVal = p.y0;
          if (p.y1 < minVal) minVal = p.y1;
          if (p.y0 > maxVal) maxVal = p.y0;
          if (p.y1 > maxVal) maxVal = p.y1;
        });
      });

      this.referenceLines.forEach(r => {
        if (r.y < minVal) minVal = r.y;
        if (r.y > maxVal) maxVal = r.y;
      });

      this.thresholdBands.forEach(b => {
        const bMin = b.yMin ?? b.y1;
        const bMax = b.yMax ?? b.y2;
        if (bMin != null && bMin < minVal) minVal = bMin;
        if (bMax != null && bMax > maxVal) maxVal = bMax;
      });

      if (this.baseline !== 0) {
        minVal = Math.min(this.baseline, minVal);
      }

      const span = (maxVal - minVal) || 1;
      if (this.baseline !== 0) {
        minY = Math.min(this.baseline, minVal);
      } else {
        minY = minVal < 0 ? minVal - span * 0.05 : 0;
      }
      maxY = maxVal + span * 0.08;
    }

    const yScale = createLinearScale({
      domain: [minY, maxY],
      range: [this.plot.plotHeight, 0],
      clamp: false
    });

    const xTicks = generateTicks(xScale, Math.min(7, Math.floor(this.plot.plotWidth / 90)));
    const yTicks = generateTicks(yScale, Math.min(6, Math.floor(this.plot.plotHeight / 48)));

    return { xScale, yScale, xTicks, yTicks };
  }

  getRefLabelX(ref: AreaReferenceLine): number {
    const pos = ref.position || 'end';
    if (pos === 'start') return 8;
    if (pos === 'center') return this.plot.plotWidth / 2;
    return this.plot.plotWidth - 8;
  }

  getRefAnchor(ref: AreaReferenceLine): string {
    const pos = ref.position || 'end';
    if (pos === 'start') return 'start';
    if (pos === 'center') return 'middle';
    return 'end';
  }

  get xScale() { return this.scales.xScale; }
  get yScale() { return this.scales.yScale; }
  get xTicks() { return this.scales.xTicks; }
  get yTicks() { return this.scales.yTicks; }

  getPointX(xVal: any, idx: number): number {
    if (!this.scales.xScale) return 0;
    if (this.xScaleType === 'band' || this.xScaleType === 'point') {
      const mapped = this.scales.xScale(String(xVal));
      if (mapped !== undefined) return mapped;
      return (idx / Math.max(1, this.data.length - 1)) * this.plot.plotWidth;
    }
    if (this.xScaleType === 'time') {
      const dt = this.parseTime(xVal);
      if (dt) {
        return this.scales.xScale(dt) || 0;
      }
      return (idx / Math.max(1, this.data.length - 1)) * this.plot.plotWidth;
    }
    return this.scales.xScale(xVal) ?? ((idx / Math.max(1, this.data.length - 1)) * this.plot.plotWidth);
  }

  get areaLayers() {
    if (!this.scales.xScale || !this.scales.yScale || this.stackedData.length === 0) return [];

    return this.stackedData.map((seriesPoints, sIndex) => {
      const def = this.activeSeriesDefs[sIndex] || { key: `s_${sIndex}`, label: `Series ${sIndex}`, color: VIZ_COLORS[0], pattern: 'pat-diagonal', strokeWidth: 2 };
      const upperPoints: any[] = [];
      const lowerPoints: any[] = [];

      seriesPoints.forEach((p, idx) => {
        const xVal = this.data[idx]?.[this.xKey];
        const px = this.getPointX(xVal, idx);
        const pyUpper = this.scales.yScale(p.y1);
        const pyLower = this.scales.yScale(p.y0);

        upperPoints.push({ x: px, y: pyUpper, datum: this.data[idx], p });
        lowerPoints.push({ x: px, y: pyLower, datum: this.data[idx], p });
      });

      const areaPathD = createAreaPath(upperPoints, lowerPoints, this.curve);
      const boundaryPathD = createLinePath(upperPoints, this.curve);

      return {
        def,
        sIndex,
        areaPathD,
        boundaryPathD,
        upperPoints,
        lowerPoints
      };
    });
  }

  get activeXDatum(): any {
    return this.activeXIndex >= 0 ? this.data[this.activeXIndex] : null;
  }

  get activeXPos(): number {
    if (!this.activeXDatum || !this.scales.xScale) return 0;
    return this.getPointX(this.activeXDatum[this.xKey], this.activeXIndex);
  }

  get tooltipLeft(): number {
    return Math.min(this.plot.toCanvasX(this.activeXPos) + 12, this.width - 220);
  }

  get srAnnouncement(): string {
    if (this.activeXIndex >= 0 && this.activeXDatum) {
      const valuesStr = this.activeSeriesDefs.map(s => `${s.label} ${this.activeXDatum[s.key]}`).join(', ');
      return `Selected observation ${this.activeXIndex + 1} of ${this.data.length}, domain: ${this.activeXDatum[this.xKey]}. Values: ${valuesStr}.`;
    }
    return '';
  }

  toggleSeriesIsolation(key: string): void {
    this.isolatedSeries = this.isolatedSeries === key ? null : key;
  }

  getBandY(band: AreaThresholdBand): number {
    const y1 = this.yScale(band.yMax ?? band.y2 ?? 0);
    const y2 = this.yScale(band.yMin ?? band.y1 ?? 0);
    return Math.min(y1, y2);
  }

  getBandHeight(band: AreaThresholdBand): number {
    const y1 = this.yScale(band.yMax ?? band.y2 ?? 0);
    const y2 = this.yScale(band.yMin ?? band.y1 ?? 0);
    return Math.abs(y2 - y1);
  }

  formatVal(val: any, unit: string = ''): string {
    return formatVizValue(val, unit, this.locale);
  }

  formatRefLabel(ref: AreaReferenceLine): string {
    if (!ref.label) return '';
    return ref.label.includes(String(ref.y)) ? ref.label : `${ref.label} (${this.formatVal(ref.y, this.yUnit)})`;
  }

  formatXTick(tickVal: any): string {
    if (this.xScaleType === 'time' && (this.scales.xScale as any)?.type === 'time') {
      const dt = tickVal instanceof Date ? tickVal : this.parseTime(tickVal);
      return dt
        ? dt.toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit', hour12: false })
        : formatVizValue(tickVal, '', this.locale);
    } else if ((this.scales.xScale as any)?.type === 'point' || (this.scales.xScale as any)?.type === 'band') {
      return String(tickVal);
    }
    return formatVizValue(tickVal, this.xUnit, this.locale);
  }

  formatTooltipHeader(val: any): string {
    if (this.xScaleType === 'time') {
      const dt = this.parseTime(val);
      return dt
        ? dt.toLocaleTimeString(this.locale, { hour: '2-digit', minute: '2-digit', hour12: false })
        : String(val);
    }
    return formatVizValue(val, this.xUnit, this.locale);
  }

  formatYTick(tickVal: any): string {
    if (this.variant === 'normalized') {
      return `${Number(tickVal).toFixed(0)}%`;
    }
    return formatVizValue(tickVal, this.yUnit, this.locale);
  }

  formatTableDomain(val: any): string {
    if (this.xScaleType === 'time') {
      return new Date(val).toLocaleString(this.locale);
    }
    return String(val);
  }

  getStackedRawVal(sIdx: number, itemIdx: number): number {
    return this.stackedData[sIdx]?.[itemIdx]?.rawVal ?? 0;
  }

  getStackedShare(sIdx: number, itemIdx: number): number {
    return this.stackedData[sIdx]?.[itemIdx]?.share ?? 0;
  }

  getActiveDatumTotal(datum: any): number {
    return this.activeSeriesDefs.reduce((acc, def) => acc + Number(datum[def.key] || 0), 0);
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.scales.xScale || !this.data || this.data.length === 0 || !this.enableCrosshair) return;
    const rect = this.containerRef?.nativeElement.getBoundingClientRect();
    if (!rect) return;

    const mouseCanvasX = e.clientX - rect.left;
    const plotX = this.plot.toPlotX(mouseCanvasX);
    if (plotX < 0 || plotX > this.plot.plotWidth) {
      this.activeXIndex = -1;
      return;
    }

    let nearestIdx = 0;
    let minDist = Infinity;
    this.data.forEach((d, i) => {
      const xVal = d[this.xKey];
      const px = this.scales.xScale(xVal) || 0;
      const dist = Math.abs(px - plotX);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    });

    this.activeXIndex = nearestIdx;
  }

  onPointerLeave(): void {
    this.activeXIndex = -1;
  }

  onKeyDown(e: KeyboardEvent): void {
    if (!this.data || this.data.length === 0) return;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        this.activeXIndex = (this.activeXIndex + 1) % this.data.length;
        this.emitSelect();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        this.activeXIndex = (this.activeXIndex - 1 + this.data.length) % this.data.length;
        this.emitSelect();
        break;
      case 'Home':
        e.preventDefault();
        this.activeXIndex = 0;
        this.emitSelect();
        break;
      case 'End':
        e.preventDefault();
        this.activeXIndex = this.data.length - 1;
        this.emitSelect();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.emitSelect();
        break;
      case 'Escape':
        e.preventDefault();
        this.activeXIndex = -1;
        break;
    }
  }

  private emitSelect(): void {
    if (this.activeXIndex >= 0 && this.data[this.activeXIndex]) {
      this.pointSelect.emit({
        datum: this.data[this.activeXIndex],
        index: this.activeXIndex
      });
    }
  }
}
