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
  createPlotRegion,
  createBandScale,
  createSequentialColorScale,
  createDivergingColorScale,
  formatVizValue,
  PlotMargins,
  getVizDensityTier,
  VizDensityTier
} from '../../utils/viz-core.js';

export type HeatmapVariant = 'matrix' | 'clustered' | 'calendar' | 'correlation';
export type HeatmapColorScaleType = 'sequential' | 'diverging';
export type HeatmapDensity = 'compact' | 'standard' | 'expanded';

@Component({
  selector: 'ds-heatmap',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #containerRef
      class="ds-heatmap ds-heatmap--{{ variant }} ds-heatmap--density-{{ density }}"
      [ngClass]="{ 'ds-heatmap--loading': loading, 'ds-heatmap--empty': !loading && (!data || data.length === 0) }"
      [style.width]="'100%'"
      role="region"
      [attr.aria-label]="title || 'Heatmap matrix visualization'"
      [attr.aria-busy]="loading"
      tabindex="0"
      (keydown)="onKeyDown($event)"
      (pointerleave)="hoveredCell = null"
    >
      <ng-container *ngIf="loading">
        <div class="ds-heatmap__skeleton-header"></div>
        <div class="ds-heatmap__skeleton-plot" [style.height.px]="height"></div>
      </ng-container>

      <ng-container *ngIf="!loading && (!data || data.length === 0)">
        <h3 *ngIf="title" class="ds-heatmap__title">{{ title }}</h3>
        <div class="ds-heatmap__empty-msg" [style.height.px]="height">
          <p>{{ emptyMessage }}</p>
        </div>
      </ng-container>

      <ng-container *ngIf="!loading && data && data.length > 0">
        <div *ngIf="title || subtitle" class="ds-heatmap__header">
          <div>
            <h3 *ngIf="title" class="ds-heatmap__title">{{ title }}</h3>
            <p *ngIf="subtitle" class="ds-heatmap__subtitle">{{ subtitle }}</p>
          </div>
        </div>

        <svg
          width="100%"
          [attr.height]="height"
          [attr.viewBox]="'0 0 ' + plotWidth + ' ' + height"
          class="ds-heatmap__svg"
          style="overflow: visible; display: block; width: 100%; height: auto;"
          aria-hidden="true"
        >
          <defs>
            <pattern id="ds-heatmap-missing-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45 0 0)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--border-strong, #94a3b8)" stroke-width="1.2" opacity="0.4" />
            </pattern>

            <linearGradient id="ds-heatmap-legend-grad" x1="0" y1="1" x2="0" y2="0">
              <ng-container *ngIf="colorScaleType === 'diverging' || variant === 'correlation'">
                <stop offset="0%" [attr.stop-color]="colorRange[0] || '#ef4444'" />
                <stop offset="50%" [attr.stop-color]="colorRange[1] || '#f8fafc'" />
                <stop offset="100%" [attr.stop-color]="colorRange[2] || '#2563eb'" />
              </ng-container>
              <ng-container *ngIf="colorScaleType !== 'diverging' && variant !== 'correlation'">
                <stop offset="0%" [attr.stop-color]="colorRange[0] || '#eff6ff'" />
                <stop offset="100%" [attr.stop-color]="colorRange[1] || '#1d4ed8'" />
              </ng-container>
            </linearGradient>
          </defs>

          <g [attr.transform]="'translate(' + plot.margins.left + ', ' + plot.margins.top + ')'">
            <!-- Heatmap Grid Cells -->
            <g *ngFor="let row of rowLabels; let rIdx = index">
              <g *ngFor="let col of colLabels; let cIdx = index">
                <rect
                  class="ds-heatmap__cell"
                  [attr.x]="cellX(cIdx)"
                  [attr.y]="cellY(rIdx)"
                  [attr.width]="cellWidth"
                  [attr.height]="cellHeight"
                  [attr.rx]="cellRadius"
                  [attr.fill]="getCellFill(rIdx, cIdx)"
                  [attr.stroke]="isCellActive(rIdx, cIdx) ? 'var(--text-primary, #0f172a)' : 'rgba(0,0,0,0.06)'"
                  [attr.stroke-width]="isCellActive(rIdx, cIdx) ? 2 : 1"
                  (pointerenter)="onCellHover(rIdx, cIdx)"
                  (click)="onCellClick(rIdx, cIdx)"
                />
                <text
                  *ngIf="showCellValues && getCellValue(rIdx, cIdx) != null && cellWidth > 28 && cellHeight > 18"
                  [attr.x]="cellX(cIdx) + cellWidth / 2"
                  [attr.y]="cellY(rIdx) + cellHeight / 2"
                  dy="0.32em"
                  text-anchor="middle"
                  [attr.font-size]="fontSize"
                  font-weight="600"
                  [attr.fill]="getCellTextColor(rIdx, cIdx)"
                  pointer-events="none"
                >
                  {{ formatCellValue(getCellValue(rIdx, cIdx)) }}
                </text>
              </g>
            </g>

            <!-- X Axis (Column Labels on Bottom) -->
            <g class="ds-heatmap__axis">
              <g
                *ngFor="let col of colLabels; let cIdx = index"
                [attr.transform]="'translate(' + (cellX(cIdx) + cellWidth / 2) + ', ' + (plot.plotHeight + (isXRotated ? 12 : 18)) + ')'"
              >
                <text
                  [attr.transform]="isXRotated ? 'rotate(' + actualXAngle + ')' : null"
                  [attr.text-anchor]="isXRotated ? 'end' : 'middle'"
                  [attr.dx]="isXRotated ? -4 : 0"
                  [attr.dy]="isXRotated ? 4 : 0"
                  font-size="11"
                  font-weight="500"
                  fill="var(--text-secondary, #475569)"
                >
                  {{ col }}
                </text>
              </g>
            </g>

            <!-- Y Axis (Row Labels on Left) -->
            <g class="ds-heatmap__axis">
              <g *ngFor="let row of rowLabels; let rIdx = index" [attr.transform]="'translate(0, ' + (cellY(rIdx) + cellHeight / 2) + ')'">
                <text x="-12" dy="0.32em" text-anchor="end" font-size="11" font-weight="500" fill="var(--text-secondary, #475569)">{{ row }}</text>
              </g>
            </g>

            <!-- Vertical Legend Bar -->
            <g
              *ngIf="showLegend"
              [attr.transform]="'translate(' + (plot.plotWidth + 24) + ', 10)'"
              class="ds-heatmap__legend-group"
            >
              <text x="0" y="-6" class="ds-heatmap__legend-title">{{ unit || 'Intensity' }}</text>
              <rect
                x="0"
                y="0"
                width="12"
                [attr.height]="plot.plotHeight - 20"
                fill="url(#ds-heatmap-legend-grad)"
                stroke="var(--border-subtle, #cbd5e1)"
                rx="2"
              />
              <text x="18" y="8" dy="0.32em" class="ds-heatmap__legend-tick">
                {{ formatVal(minMaxVals[1]) }}
              </text>
              <text
                *ngIf="colorScaleType === 'diverging' || variant === 'correlation'"
                x="18"
                [attr.y]="(plot.plotHeight - 20) / 2"
                dy="0.32em"
                class="ds-heatmap__legend-tick"
              >
                {{ formatVal(neutralValue) }}
              </text>
              <text x="18" [attr.y]="plot.plotHeight - 24" dy="0.32em" class="ds-heatmap__legend-tick">
                {{ formatVal(minMaxVals[0]) }}
              </text>
            </g>
          </g>
        </svg>

        <!-- Tooltip -->
        <div
          *ngIf="hoveredCell"
          class="ds-heatmap__tooltip"
          [style.left.px]="tooltipLeft"
          [style.top.px]="tooltipTop"
          role="tooltip"
        >
          <strong>{{ hoveredCell.row }} × {{ hoveredCell.col }}</strong>
          <div>
            {{ valueLabel }}:
            <strong>{{ hoveredCell.value != null ? formatVal(hoveredCell.value) : missingCellLabel }}</strong>
          </div>
          <div *ngIf="variant === 'correlation' && hoveredCell.value != null" style="font-size: 11px; color: var(--text-secondary, #64748b); margin-top: 2px;">
            <em>{{ hoveredCell.value > 0.7 ? 'Strong Positive' : hoveredCell.value < -0.7 ? 'Strong Negative' : 'Weak / Neutral' }}</em>
          </div>
        </div>

        <!-- Accessibility Live Announcer -->
        <div class="ds-heatmap__sr-only" style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);" aria-live="polite">
          {{ activeCellText }}
        </div>

        <!-- Accessible Tabular Matrix Mirror -->
        <details
          *ngIf="showDataTable && data && data.length > 0"
          class="ds-chart-table-details"
        >
          <summary class="ds-chart-table-summary">
            View Accessible Data Matrix
          </summary>
          <div class="ds-chart-table-wrap">
            <table class="ds-chart-table">
              <caption style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);">
                {{ title ? title + ' Data Matrix' : 'Heatmap Data Matrix' }}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{{ rowLabel || 'Row / Col' }}</th>
                  <th *ngFor="let c of colLabels" scope="col">{{ c }}</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of rowLabels; let rIdx = index">
                  <th scope="row">{{ r }}</th>
                  <td *ngFor="let c of colLabels; let cIdx = index">
                    {{ getCellValue(rIdx, cIdx) != null ? formatVizValue(getCellValue(rIdx, cIdx)!, unit, locale) : missingCellLabel }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </ng-container>
    </div>
  `,
  styleUrls: ['./heatmap.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsHeatmapComponent implements AfterViewInit, OnDestroy {
  formatVizValue = formatVizValue;

  @Input() data: Array<Record<string, any>> = [];
  @Input() rows: string[] = [];
  @Input() cols: string[] = [];
  @Input() rowKey: string = 'row';
  @Input() colKey: string = 'col';
  @Input() valueKey: string = 'value';
  @Input() variant: HeatmapVariant = 'matrix';
  @Input() colorScaleType: HeatmapColorScaleType = 'sequential';
  @Input() colorRange: string[] = ['#eff6ff', '#1d4ed8'];
  @Input() domain: [number, number] | null = null;
  @Input() neutralValue: number = 0;
  @Input() cellPadding: number = 2;
  @Input() cellRadius: number = 2;
  @Input() showCellValues: boolean = false;
  @Input() width: number = 640;
  @Input() height: number = 360;
  @Input() margins?: Partial<PlotMargins>;
  @Input() unit: string = '';
  @Input() rowLabel: string = 'Row Dimension';
  @Input() colLabel: string = 'Column Dimension';
  @Input() valueLabel: string = 'Intensity Value';
  @Input() locale: string = 'en-IN';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() missingCellLabel: string = 'No Record / Down';
  @Input() showLegend: boolean = true;
  @Input() showDataTable: boolean = true;
  @Input() density: HeatmapDensity = 'standard';
  @Input() emptyMessage: string = 'No matrix observation records found.';
  @Input() loading: boolean = false;
  @Input() rotateXLabels: boolean | 'auto' = 'auto';
  @Input() xLabelAngle: number = -45;

  @Output() cellSelect = new EventEmitter<{ datum: Record<string, any>; coords: { rIdx: number; cIdx: number } }>();

  @ViewChild('containerRef') containerRef?: ElementRef<HTMLDivElement>;

  hoveredCell: any = null;
  activeCellCoord: { rIdx: number; cIdx: number } | null = null;
  selectedCellCoord: { rIdx: number; cIdx: number } | null = null;

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

  get resolvedMargins(): PlotMargins {
    const isMobile = this.densityTier === 'compact' || this.densityTier === 'mobile';
    const defaultRight = this.showLegend ? (isMobile ? 54 : 80) : 24;
    const isRotatedExpected = this.rotateXLabels === true || isMobile;
    const maxRowLabelLen = Math.max(0, ...this.rowLabels.map(l => String(l).length));
    const autoLeft = isMobile
      ? Math.max(54, Math.min(120, Math.round(maxRowLabelLen * 5.5 + 16)))
      : Math.max(88, Math.min(220, Math.round(maxRowLabelLen * 7.5 + 24)));
    return {
      top: this.margins?.top ?? 32,
      right: this.margins?.right ?? defaultRight,
      bottom: this.margins?.bottom ?? (isRotatedExpected ? 56 : 48),
      left: this.margins?.left ?? autoLeft
    };
  }

  get rowLabels(): string[] {
    if (this.rows && this.rows.length > 0) return this.rows;
    if (!this.data || this.data.length === 0) return [];
    return Array.from(new Set(this.data.map(d => String(d[this.rowKey])))).filter(Boolean);
  }

  get colLabels(): string[] {
    if (this.cols && this.cols.length > 0) return this.cols;
    if (!this.data || this.data.length === 0) return [];
    return Array.from(new Set(this.data.map(d => String(d[this.colKey])))).filter(Boolean);
  }

  get plot() {
    return createPlotRegion({
      containerWidth: this.plotWidth,
      containerHeight: this.height,
      margins: this.resolvedMargins
    });
  }

  get matrixLookup(): Map<string, any> {
    const map = new Map();
    this.data.forEach(d => {
      const r = String(d[this.rowKey]);
      const c = String(d[this.colKey]);
      map.set(`${r}:::${c}`, d);
    });
    return map;
  }

  get minMaxVals(): [number, number] {
    if (this.domain) return this.domain;
    if (this.variant === 'correlation') return [-1, 1];
    const vals = this.data.map(d => Number(d[this.valueKey])).filter(v => !isNaN(v));
    if (vals.length === 0) return [0, 100];
    return [Math.min(...vals), Math.max(...vals)];
  }

  get colorScaleFn(): (val: any) => string {
    const [minV, maxV] = this.minMaxVals;
    if (this.colorScaleType === 'diverging' || this.variant === 'correlation') {
      return createDivergingColorScale({
        domain: [minV, maxV],
        colors: this.colorRange.length >= 3 ? (this.colorRange as [string, string, string]) : ['#ef4444', '#f8fafc', '#2563eb'],
        neutral: this.neutralValue
      });
    }
    return createSequentialColorScale({
      domain: [minV, maxV],
      colors: this.colorRange.length >= 2 ? (this.colorRange as [string, string]) : ['#eff6ff', '#1d4ed8']
    });
  }

  get cellWidth(): number {
    const colsCount = Math.max(1, this.colLabels.length);
    return Math.max(2, (this.plot.plotWidth - (colsCount - 1) * this.cellPadding) / colsCount);
  }

  get cellHeight(): number {
    const rowsCount = Math.max(1, this.rowLabels.length);
    return Math.max(2, (this.plot.plotHeight - (rowsCount - 1) * this.cellPadding) / rowsCount);
  }

  get isXRotated(): boolean {
    return this.rotateXLabels === true || (this.rotateXLabels === 'auto' && this.cellWidth < 36);
  }

  get actualXAngle(): number {
    return this.xLabelAngle ?? (this.isXRotated ? -45 : 0);
  }

  get fontSize(): number {
    return Math.min(11, Math.max(9, this.cellHeight * 0.45));
  }

  cellX(cIdx: number): number {
    return cIdx * (this.cellWidth + this.cellPadding);
  }

  cellY(rIdx: number): number {
    return rIdx * (this.cellHeight + this.cellPadding);
  }

  getCellValue(rIdx: number, cIdx: number): number | null {
    const r = this.rowLabels[rIdx];
    const c = this.colLabels[cIdx];
    const datum = this.matrixLookup.get(`${r}:::${c}`);
    if (!datum || datum[this.valueKey] == null) return null;
    const v = Number(datum[this.valueKey]);
    return isNaN(v) ? null : v;
  }

  getCellFill(rIdx: number, cIdx: number): string {
    const v = this.getCellValue(rIdx, cIdx);
    if (v == null) return 'url(#ds-heatmap-missing-hatch)';
    return this.colorScaleFn(v);
  }

  getCellTextColor(rIdx: number, cIdx: number): string {
    const fill = this.getCellFill(rIdx, cIdx);
    if (!fill || fill === 'transparent' || fill.startsWith('url(')) {
      return 'var(--text-primary, #0f172a)';
    }
    let r = 255, g = 255, b = 255;
    if (fill.startsWith('#')) {
      const hex = fill.replace('#', '');
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length >= 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      }
    } else if (fill.startsWith('rgb')) {
      const match = fill.match(/\d+/g);
      if (match && match.length >= 3) {
        r = parseInt(match[0], 10);
        g = parseInt(match[1], 10);
        b = parseInt(match[2], 10);
      }
    }
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance < 145 ? '#ffffff' : 'var(--text-primary, #0f172a)';
  }

  formatCellValue(val: number | null): string {
    if (val == null || isNaN(val)) return '';
    if (this.variant === 'correlation') {
      return val.toFixed(2);
    }
    if (Number.isInteger(val)) {
      return val.toString();
    }
    return val.toFixed(1);
  }

  formatVal(val: any): string {
    if (val == null) return this.missingCellLabel;
    return formatVizValue(val, this.unit, this.locale);
  }

  isCellActive(rIdx: number, cIdx: number): boolean {
    return (
      (this.activeCellCoord?.rIdx === rIdx && this.activeCellCoord?.cIdx === cIdx) ||
      (this.selectedCellCoord?.rIdx === rIdx && this.selectedCellCoord?.cIdx === cIdx)
    );
  }

  get tooltipLeft(): number {
    const raw = this.plot.margins.left + (this.hoveredCell?.cIdx ?? 0) * (this.cellWidth + this.cellPadding) + this.cellWidth / 2 + 10;
    return Math.max(10, Math.min(raw, this.width - 210));
  }

  get tooltipTop(): number {
    const raw = this.plot.margins.top + (this.hoveredCell?.rIdx ?? 0) * (this.cellHeight + this.cellPadding) - 15;
    return Math.max(10, Math.min(raw, this.height - 90));
  }

  get activeCellText(): string {
    if (!this.activeCellCoord) return '';
    const r = this.rowLabels[this.activeCellCoord.rIdx];
    const c = this.colLabels[this.activeCellCoord.cIdx];
    const v = this.getCellValue(this.activeCellCoord.rIdx, this.activeCellCoord.cIdx);
    return `Selected matrix cell ${r}, ${c}: ${v != null ? `${v} ${this.unit}` : this.missingCellLabel}.`;
  }

  onCellHover(rIdx: number, cIdx: number): void {
    const r = this.rowLabels[rIdx];
    const c = this.colLabels[cIdx];
    const val = this.getCellValue(rIdx, cIdx);
    this.hoveredCell = { rIdx, cIdx, row: r, col: c, value: val };
    this.activeCellCoord = { rIdx, cIdx };
  }

  onCellClick(rIdx: number, cIdx: number): void {
    const r = this.rowLabels[rIdx];
    const c = this.colLabels[cIdx];
    const datum = this.matrixLookup.get(`${r}:::${c}`) || { [this.rowKey]: r, [this.colKey]: c };
    this.selectedCellCoord = { rIdx, cIdx };
    this.cellSelect.emit({ datum, coords: { rIdx, cIdx } });
  }

  onKeyDown(e: KeyboardEvent): void {
    if (this.rowLabels.length === 0 || this.colLabels.length === 0) return;

    let r = this.activeCellCoord ? this.activeCellCoord.rIdx : 0;
    let c = this.activeCellCoord ? this.activeCellCoord.cIdx : 0;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        c = (c + 1) % this.colLabels.length;
        this.activeCellCoord = { rIdx: r, cIdx: c };
        this.onCellHover(r, c);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        c = (c - 1 + this.colLabels.length) % this.colLabels.length;
        this.activeCellCoord = { rIdx: r, cIdx: c };
        this.onCellHover(r, c);
        break;
      case 'ArrowDown':
        e.preventDefault();
        r = (r + 1) % this.rowLabels.length;
        this.activeCellCoord = { rIdx: r, cIdx: c };
        this.onCellHover(r, c);
        break;
      case 'ArrowUp':
        e.preventDefault();
        r = (r - 1 + this.rowLabels.length) % this.rowLabels.length;
        this.activeCellCoord = { rIdx: r, cIdx: c };
        this.onCellHover(r, c);
        break;
      case 'Home':
        e.preventDefault();
        this.activeCellCoord = { rIdx: 0, cIdx: 0 };
        this.onCellHover(0, 0);
        break;
      case 'End':
        e.preventDefault();
        this.activeCellCoord = { rIdx: this.rowLabels.length - 1, cIdx: this.colLabels.length - 1 };
        this.onCellHover(this.rowLabels.length - 1, this.colLabels.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (this.activeCellCoord) {
          this.onCellClick(this.activeCellCoord.rIdx, this.activeCellCoord.cIdx);
        }
        break;
      case 'Escape':
        e.preventDefault();
        this.activeCellCoord = null;
        this.hoveredCell = null;
        break;
    }
  }
}
