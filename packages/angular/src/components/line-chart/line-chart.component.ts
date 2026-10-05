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
  POINT_SYMBOLS,
  STROKE_DASH_PATTERNS,
  formatVizValue,
  createPlotRegion,
  createLinearScale,
  generateTicks,
  createLinePath,
  getVizDensityTier,
  VizDensityTier
} from '../../utils/viz-core.js';

export type LineChartVariant =
  | 'single'
  | 'multi'
  | 'stepped'
  | 'indexed'
  | 'small-multiples';

export type LineInterpolation =
  | 'linear'
  | 'step'
  | 'step-after'
  | 'monotone'
  | 'smooth';

export type MissingValuePolicy = 'dashed' | 'gap' | 'zero';

export interface LineSeriesConfig {
  key: string;
  label: string;
  color?: string;
  strokeDash?: string;
  symbol?: 'circle' | 'square' | 'diamond' | 'triangle' | 'cross' | 'star';
}

export interface LineReferenceConfig {
  value: number;
  label?: string;
  tone?: 'neutral' | 'danger' | 'warning' | 'success' | 'brand';
  strokeStyle?: 'dashed' | 'solid';
}

export interface LineThresholdBandConfig {
  min: number;
  max: number;
  label?: string;
  tone?: 'critical' | 'warning' | 'neutral';
}

let nextLineId = 0;

@Component({
  selector: 'ds-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #chartContainer
      class="ds-line-chart ds-line-chart--{{ variant }}"
      [ngClass]="{ 'ds-line-chart--loading': loading, 'ds-line-chart--empty': !loading && (!data || data.length === 0) }"
      [style.width]="'100%'"
      role="region"
      [attr.aria-roledescription]="'line chart'"
      [attr.aria-label]="title || 'Line chart visualization'"
      [attr.aria-busy]="loading"
      tabindex="0"
      (keydown)="onKeyDown($event)"
      (pointerleave)="onPointerLeave()"
      (pointermove)="onPointerMove($event)"
    >
      <ng-container *ngIf="loading">
        <div class="ds-line-chart__skeleton-header"></div>
        <div class="ds-line-chart__skeleton-plot" [style.height.px]="numericHeight"></div>
      </ng-container>

      <ng-container *ngIf="!loading && (!data || data.length === 0)">
        <h3 *ngIf="title" class="ds-line-chart__title">{{ title }}</h3>
        <div class="ds-line-chart__empty-msg" [style.height.px]="numericHeight">
          <p>{{ emptyText }}</p>
        </div>
      </ng-container>

      <ng-container *ngIf="!loading && data && data.length > 0">
        <div *ngIf="title || caption" class="ds-line-chart__header">
          <div>
            <h3 *ngIf="title" class="ds-line-chart__title">{{ title }}</h3>
            <p *ngIf="caption" class="ds-line-chart__caption">{{ caption }}</p>
          </div>
        </div>

        <div *ngIf="showLegend && normalizedSeries.length > 1" class="ds-line-chart__legend" role="toolbar" aria-label="Series Filter">
          <button
            *ngFor="let s of normalizedSeries"
            type="button"
            class="ds-line-chart__legend-item"
            [ngClass]="{ 'ds-line-chart__legend-item--dimmed': activeSeries && activeSeries !== s.key }"
            (click)="toggleSeries(s.key)"
            [attr.aria-pressed]="activeSeries === s.key"
          >
            <svg class="ds-line-chart__legend-line" width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
              <path d="M1 7 H19" [attr.stroke]="s.color" stroke-width="2" [attr.stroke-dasharray]="s.strokeDash !== 'none' ? s.strokeDash : null" />
              <g transform="translate(10 7)" [ngSwitch]="s.symbol">
                <rect *ngSwitchCase="'square'" x="-3" y="-3" width="6" height="6" fill="var(--surface-card)" [attr.stroke]="s.color" stroke-width="1.5" />
                <rect *ngSwitchCase="'diamond'" x="-2.5" y="-2.5" width="5" height="5" transform="rotate(45)" fill="var(--surface-card)" [attr.stroke]="s.color" stroke-width="1.5" />
                <polygon *ngSwitchCase="'triangle'" points="0,-3 3,3 -3,3" fill="var(--surface-card)" [attr.stroke]="s.color" stroke-width="1.5" />
                <path *ngSwitchCase="'cross'" d="M-3,-3 L3,3 M3,-3 L-3,3" fill="none" [attr.stroke]="s.color" stroke-width="1.5" />
                <polygon *ngSwitchCase="'star'" points="0,-4 1,-1 4,-1 2,1 3,4 0,2 -3,4 -2,1 -4,-1 -1,-1" fill="var(--surface-card)" [attr.stroke]="s.color" stroke-width="1.5" />
                <circle *ngSwitchDefault r="3" fill="var(--surface-card)" [attr.stroke]="s.color" stroke-width="1.5" />
              </g>
            </svg>
            <span class="ds-line-chart__legend-label">{{ s.label }}</span>
          </button>
        </div>

        <svg
          width="100%"
          [attr.height]="numericHeight"
          [attr.viewBox]="'0 0 ' + svgWidth + ' ' + numericHeight"
          class="ds-line-chart__svg"
          aria-hidden="true"
          style="display: block; width: 100%; height: auto;"
        >
          <g [attr.transform]="'translate(' + margins.left + ', ' + margins.top + ')'">
            <!-- Threshold Bands -->
            <rect
              *ngFor="let band of thresholdBands"
              x="0"
              [attr.y]="Math.min(yScale(band.max), yScale(band.min))"
              [attr.width]="plotWidth"
              [attr.height]="Math.abs(yScale(band.min) - yScale(band.max))"
              [attr.fill]="getThresholdToneColor(band.tone)"
              opacity="0.12"
            />

            <!-- Gridlines -->
            <g *ngIf="showGrid">
              <g *ngFor="let tick of yTicks" class="ds-line-chart__gridline">
                <line x1="0" [attr.y1]="yScale(tick)" [attr.x2]="plotWidth" [attr.y2]="yScale(tick)" />
              </g>
            </g>

            <!-- Reference Lines (Guides) -->
            <g *ngFor="let ref of referenceLines">
              <line
                x1="0"
                [attr.y1]="yScale(ref.value)"
                [attr.x2]="plotWidth"
                [attr.y2]="yScale(ref.value)"
                [attr.stroke]="getReferenceToneColor(ref.tone)"
                [attr.stroke-dasharray]="ref.strokeStyle === 'solid' ? 'none' : '4 3'"
                stroke-width="1.5"
              />
            </g>

            <!-- Line Series Paths -->
            <g *ngFor="let s of visibleSeries">
              <path
                [attr.d]="getLinePath(s.key)"
                fill="none"
                [attr.stroke]="s.color"
                [attr.stroke-dasharray]="s.strokeDash !== 'none' ? s.strokeDash : null"
                stroke-width="2"
              />
              <!-- Data Points -->
              <ng-container *ngFor="let pt of getSeriesPoints(s.key); let first = first; let last = last">
                <g *ngIf="pointVisibility === 'always' || (pointVisibility === 'hover' && hoveredPointIndex !== null) || (pointVisibility === 'endpoints' && (first || last))"
                   [attr.transform]="'translate(' + pt.x + ',' + pt.y + ')'" [ngSwitch]="s.symbol">
                  <rect *ngSwitchCase="'square'" x="-3.5" y="-3.5" width="7" height="7" fill="var(--surface-card)" [attr.stroke]="s.color" stroke-width="2" />
                  <rect *ngSwitchCase="'diamond'" x="-3" y="-3" width="6" height="6" transform="rotate(45)" fill="var(--surface-card)" [attr.stroke]="s.color" stroke-width="2" />
                  <polygon *ngSwitchCase="'triangle'" points="0,-4 4,4 -4,4" fill="var(--surface-card)" [attr.stroke]="s.color" stroke-width="2" />
                  <path *ngSwitchCase="'cross'" d="M-4,-4 L4,4 M4,-4 L-4,4" fill="none" [attr.stroke]="s.color" stroke-width="2" />
                  <polygon *ngSwitchCase="'star'" points="0,-5 1.5,-1.5 5,-1.5 2.5,1.5 3.5,5 0,3 -3.5,5 -2.5,1.5 -5,-1.5 -1.5,-1.5" fill="var(--surface-card)" [attr.stroke]="s.color" stroke-width="2" />
                  <circle *ngSwitchDefault r="3.5" fill="var(--surface-card)" [attr.stroke]="s.color" stroke-width="2" />
                </g>
              </ng-container>
            </g>

            <!-- Reference Line Labels (Overlay with protective paint-order halo) -->
            <g *ngFor="let ref of referenceLines" pointer-events="none">
              <text
                *ngIf="ref.label"
                [attr.x]="plotWidth - 6"
                [attr.y]="yScale(ref.value) - 5"
                text-anchor="end"
                [attr.fill]="getReferenceToneColor(ref.tone)"
                class="ds-line-chart__ref-label"
                style="paint-order: stroke fill; stroke: var(--surface-card, #ffffff); stroke-width: 5px; stroke-linejoin: round; stroke-linecap: round; font-size: 10px; font-weight: 600; font-family: var(--font-mono, monospace);"
              >
                {{ ref.label }} ({{ formatVal(ref.value) }})
              </text>
            </g>

            <!-- Crosshair Line -->
            <g *ngIf="showCrosshair && hoveredPointIndex !== null && crosshairX != null">
              <line
                [attr.x1]="crosshairX"
                y1="0"
                [attr.x2]="crosshairX"
                [attr.y2]="plotHeight"
                stroke="var(--border-strong, #64748b)"
                stroke-dasharray="3 3"
                stroke-width="1.5"
              />
            </g>

            <!-- X Axis -->
            <g [attr.transform]="'translate(0, ' + plotHeight + ')'" class="ds-line-chart__axis">
              <line x1="0" y1="0" [attr.x2]="plotWidth" y2="0" stroke="var(--border-strong, #94a3b8)" stroke-width="1.5" />
              <g *ngFor="let tick of xTicks" [attr.transform]="'translate(' + tick.x + ', 0)'">
                <line y2="5" stroke="var(--border-strong, #94a3b8)" stroke-width="1.5" />
                <text y="18" text-anchor="middle" fill="var(--text-secondary, #475569)" font-size="10">{{ tick.label }}</text>
              </g>
            </g>

            <!-- Y Axis -->
            <g class="ds-line-chart__axis">
              <line x1="0" y1="0" x2="0" [attr.y2]="plotHeight" stroke="var(--border-strong, #94a3b8)" stroke-width="1.5" />
              <g *ngFor="let tick of yTicks" [attr.transform]="'translate(0, ' + yScale(tick) + ')'">
                <line x2="-5" stroke="var(--border-strong, #94a3b8)" stroke-width="1.5" />
                <text x="-9" dy="0.32em" text-anchor="end" fill="var(--text-secondary, #475569)" font-family="var(--font-mono, monospace)" font-size="10" font-weight="500">{{ formatVal(tick) }}</text>
              </g>
            </g>
          </g>
        </svg>

        <!-- Tooltip (2D Quad-Flip Non-Occluding) -->
        <div
          *ngIf="showTooltip && hoveredPointIndex !== null && activeDatum"
          class="ds-line-chart__tooltip"
          [style.left.px]="tooltipLeft"
          [style.top.px]="isTopPeak ? null : Math.max(8, margins.top - 10)"
          [style.bottom.px]="isTopPeak ? Math.max(38, margins.bottom + 6) : null"
          role="tooltip"
        >
          <div class="ds-line-chart__tooltip-header">
            <strong>{{ formatXValue(activeDatum[xKey]) }}</strong>
          </div>
          <div class="ds-line-chart__tooltip-body">
            <div *ngFor="let s of visibleSeries" class="ds-line-chart__tooltip-row">
              <span class="ds-line-chart__tooltip-swatch" [style.background-color]="s.color"></span>
              <span class="ds-line-chart__tooltip-label">{{ s.label }}:</span>
              <span class="ds-line-chart__tooltip-val">{{ formatVal(activeDatum[s.key] != null ? activeDatum[s.key] : activeDatum[yKey]) }}</span>
            </div>
          </div>
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
              <caption class="ds-line-chart__sr-only">
                {{ title ? title + ' Data Table' : 'Line Chart Data Table' }}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{{ xKey }}</th>
                  <th *ngFor="let s of normalizedSeries" scope="col">{{ s.label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of data; let idx = index">
                  <th scope="row">{{ row[xKey] ?? (idx + 1) }}</th>
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
  styleUrls: ['./line-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsLineChartComponent implements AfterViewInit, OnDestroy {
  Math = Math;

  @Input() data: any[] = [];
  @Input() xKey: string = 'timestamp';
  @Input() yKey: string = 'value';
  @Input() series: (string | LineSeriesConfig)[] | null = null;
  @Input() variant: LineChartVariant = 'single';
  @Input() interpolation: LineInterpolation = 'linear';
  @Input() compareMode: 'absolute' | 'indexed' = 'absolute';
  @Input() pointVisibility: 'always' | 'hover' | 'never' | 'endpoints' = 'endpoints';
  @Input() missingValuePolicy: MissingValuePolicy = 'dashed';
  @Input() title: string = '';
  @Input() caption: string = '';
  @Input() description: string = '';
  @Input() unit: string = '';
  @Input() valueFormatter: ((val: number, item?: any) => string) | null = null;
  @Input() referenceLines: LineReferenceConfig[] = [];
  @Input() thresholdBands: LineThresholdBandConfig[] = [];
  @Input() domain: [number, number] | null = null;
  @Input() selectedKey: string | number | null = null;
  @Input() showGrid: boolean = true;
  @Input() showCrosshair: boolean = true;
  @Input() showLegend: boolean = true;
  @Input() showTooltip: boolean = true;
  @Input() showDataTable: boolean = true;
  showTableVisually = false;
  @Input() showTableToggle: boolean = true;
  @Input() loading: boolean = false;
  @Input() emptyText: string = 'No trajectory data available for this range';
  @Input() height: number | string = 280;
  @Input() width: number | string = '100%';

  @Output() select = new EventEmitter<{ item: any; seriesKey?: string }>();

  @ViewChild('chartContainer') containerRef?: ElementRef<HTMLDivElement>;

  chartId = `ds-line-chart-${++nextLineId}`;
  activeSeries: string | null = null;
  hoveredPointIndex: number | null = null;

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

  get isIndexed(): boolean {
    return this.variant === 'indexed' || this.compareMode === 'indexed';
  }

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
    return {
      top: 20,
      right: isMobile ? 12 : 32,
      bottom: isMobile ? 32 : 36,
      left: this.isIndexed ? (isMobile ? 52 : 64) : (isMobile ? 44 : 54)
    };
  }

  get plotWidth(): number {
    return Math.max(10, this.svgWidth - this.margins.left - this.margins.right);
  }

  get plotHeight(): number {
    return Math.max(10, this.numericHeight - this.margins.top - this.margins.bottom);
  }

  get normalizedSeries(): Array<{ key: string; label: string; color: string; strokeDash: string; symbol: string }> {
    if (this.series && Array.isArray(this.series) && this.series.length > 0) {
      return this.series.map((s, idx) => ({
        key: typeof s === 'string' ? s : s.key,
        label: typeof s === 'string' ? s : (s.label || s.key),
        color: (typeof s === 'object' && s.color) ? s.color : VIZ_COLORS[idx % VIZ_COLORS.length],
        strokeDash: (typeof s === 'object' && s.strokeDash) ? s.strokeDash : STROKE_DASH_PATTERNS[idx % STROKE_DASH_PATTERNS.length],
        symbol: (typeof s === 'object' && s.symbol) ? s.symbol : POINT_SYMBOLS[idx % POINT_SYMBOLS.length]
      }));
    }
    return [{
      key: this.yKey,
      label: this.title || 'Value',
      color: VIZ_COLORS[0],
      strokeDash: 'none',
      symbol: POINT_SYMBOLS[0]
    }];
  }

  get visibleSeries() {
    if (this.activeSeries) {
      return this.normalizedSeries.filter(s => s.key === this.activeSeries);
    }
    return this.normalizedSeries;
  }

  get computedYDomain(): [number, number] {
    if (this.domain) return this.domain;
    if (!this.data || this.data.length === 0) return [0, 100];

    let min = Infinity;
    let max = -Infinity;

    this.data.forEach(d => {
      this.normalizedSeries.forEach(s => {
        const v = d[s.key] != null ? Number(d[s.key]) : (d[this.yKey] != null ? Number(d[this.yKey]) : null);
        if (v != null && !isNaN(v)) {
          if (v < min) min = v;
          if (v > max) max = v;
        }
      });
    });

    this.referenceLines.forEach(rl => {
      if (rl.value > max) max = rl.value;
      if (rl.value < min) min = rl.value;
    });

    if (min === Infinity || max === -Infinity) return [0, 100];
    const diff = max - min || 1;
    return [min - diff * 0.08, max + diff * 0.08];
  }

  get yScale() {
    return createLinearScale({
      domain: this.computedYDomain,
      range: [this.plotHeight, 0]
    });
  }

  get yTicks(): number[] {
    return generateTicks(this.yScale, 5);
  }

  get xTicks(): Array<{ x: number; label: string }> {
    if (!this.data || this.data.length === 0) return [];
    const step = Math.max(1, Math.floor(this.data.length / 5));
    const ticks: Array<{ x: number; label: string }> = [];

    for (let i = 0; i < this.data.length; i += step) {
      const item = this.data[i];
      const x = this.getXCoord(i);
      ticks.push({ x, label: this.formatXValue(item[this.xKey]) });
    }
    return ticks;
  }

  getXCoord(index: number): number {
    const n = Math.max(1, this.data.length - 1);
    return (index / n) * this.plotWidth;
  }

  getSeriesPoints(seriesKey: string): Array<{ x: number; y: number }> {
    return this.data.map((d, i) => {
      const v = d[seriesKey] != null ? Number(d[seriesKey]) : Number(d[this.yKey]);
      return {
        x: this.getXCoord(i),
        y: isNaN(v) ? this.plotHeight : this.yScale(v)
      };
    });
  }

  getLinePath(seriesKey: string): string {
    const pts = this.getSeriesPoints(seriesKey);
    return createLinePath(pts, this.interpolation);
  }

  get crosshairX(): number | null {
    if (this.hoveredPointIndex === null) return null;
    return this.getXCoord(this.hoveredPointIndex);
  }

  get activeDatum(): any {
    return this.hoveredPointIndex !== null ? this.data[this.hoveredPointIndex] : null;
  }

  get isTopPeak(): boolean {
    if (this.hoveredPointIndex === null || !this.data || !this.data[this.hoveredPointIndex]) return false;
    let minPlotY = this.plotHeight;
    this.normalizedSeries.forEach((s) => {
      const v = this.data[this.hoveredPointIndex!][s.key] != null
        ? Number(this.data[this.hoveredPointIndex!][s.key])
        : (this.data[this.hoveredPointIndex!][this.yKey] != null ? Number(this.data[this.hoveredPointIndex!][this.yKey]) : null);
      if (v != null && !isNaN(v)) {
        const py = this.yScale(v);
        if (py < minPlotY) minPlotY = py;
      }
    });
    return minPlotY < this.plotHeight * 0.5;
  }

  get tooltipLeft(): number {
    if (this.crosshairX == null) return 0;
    const isRightHalf = this.crosshairX > this.plotWidth / 2;
    if (isRightHalf) {
      return Math.max(12, this.margins.left + this.crosshairX - 180);
    }
    return Math.min(this.margins.left + this.crosshairX + 14, this.svgWidth - 180);
  }

  toggleSeries(key: string): void {
    this.activeSeries = this.activeSeries === key ? null : key;
  }

  formatVal(val: any): string {
    if (this.valueFormatter) return this.valueFormatter(Number(val));
    return formatVizValue(val, this.unit);
  }

  formatXValue(val: any): string {
    return String(val);
  }

  getReferenceToneColor(tone?: string): string {
    if (tone === 'danger') return VIZ_SEMANTIC_COLORS.critical;
    if (tone === 'warning') return VIZ_SEMANTIC_COLORS.warning;
    if (tone === 'success') return VIZ_SEMANTIC_COLORS.success;
    return VIZ_SEMANTIC_COLORS.neutral;
  }

  getThresholdToneColor(tone?: string): string {
    if (tone === 'critical') return VIZ_SEMANTIC_COLORS.critical;
    if (tone === 'warning') return VIZ_SEMANTIC_COLORS.warning;
    return VIZ_SEMANTIC_COLORS.neutral;
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.data || this.data.length === 0) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseX = e.clientX - rect.left - this.margins.left;
    const ratio = Math.max(0, Math.min(1, mouseX / this.plotWidth));
    const idx = Math.round(ratio * (this.data.length - 1));
    this.hoveredPointIndex = idx;
  }

  onPointerLeave(): void {
    this.hoveredPointIndex = null;
  }

  onKeyDown(e: KeyboardEvent): void {
    if (!this.data || this.data.length === 0) return;
    const len = this.data.length;
    const current = this.hoveredPointIndex ?? -1;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        this.hoveredPointIndex = current < len - 1 ? current + 1 : 0;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        this.hoveredPointIndex = current > 0 ? current - 1 : len - 1;
        break;
      case 'Home':
        e.preventDefault();
        this.hoveredPointIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        this.hoveredPointIndex = len - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (this.hoveredPointIndex !== null && this.data[this.hoveredPointIndex]) {
          this.select.emit({
            item: this.data[this.hoveredPointIndex],
            seriesKey: this.activeSeries || this.normalizedSeries[0]?.key
          });
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.hoveredPointIndex = null;
        this.activeSeries = null;
        break;
    }
  }
}
