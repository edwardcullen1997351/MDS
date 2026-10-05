import { DsFocusTrapDirective } from '../../utils/focus-trap.directive.js';
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
  POINT_SYMBOLS,
  formatVizValue,
  createPlotRegion,
  createLinearScale,
  createLogScale,
  createBandScale,
  createAreaScale,
  generateTicks,
  renderPointSymbol,
  calculateLinearRegression,
  createLinePath,
  PlotMargins,
  getVizDensityTier,
  VizDensityTier
} from '../../utils/viz-core.js';

export type ScatterPlotVariant = 'scatter' | 'bubble' | 'connected' | 'jittered' | 'binned-density';
export type ScatterScaleType = 'linear' | 'log' | 'band';
export type ScatterDensity = 'compact' | 'standard' | 'expanded';

export interface ScatterSeriesDef {
  key: string;
  label?: string;
  color?: string;
  symbol?: 'circle' | 'square' | 'diamond' | 'triangle' | 'cross' | 'star';
}

export interface ScatterReferenceLine {
  x?: number;
  y?: number;
  label?: string;
  color?: string;
}

export interface ScatterQuadrantLines {
  x?: number;
  y?: number;
  labels?: [string, string, string, string];
}

let nextScatterId = 0;

@Component({
  selector: 'ds-scatter-plot',
  standalone: true,
  imports: [DsFocusTrapDirective, CommonModule],
  template: `
    <div
      #containerRef
      class="ds-scatter-plot ds-scatter-plot--{{ variant }} ds-scatter-plot--density-{{ density }}"
      [ngClass]="{ 'ds-scatter-plot--loading': loading, 'ds-scatter-plot--empty': !loading && (!data || data.length === 0) }"
      [style.width]="'100%'"
      role="region"
      aria-roledescription="scatter plot"
      [attr.aria-label]="title || 'Scatter and multivariate visualization'"
      tabindex="0"
      (keydown)="onKeyDown($event)"
      (pointerleave)="onCanvasLeave()"
    >
      <!-- Loading State -->
      <ng-container *ngIf="loading">
        <div class="ds-scatter-plot__skeleton-header">
          <div class="ds-scatter-plot__skeleton-title"></div>
          <div class="ds-scatter-plot__skeleton-sub"></div>
        </div>
        <div class="ds-scatter-plot__skeleton-plot" [style.height.px]="height"></div>
      </ng-container>

      <!-- Empty State -->
      <ng-container *ngIf="!loading && (!data || data.length === 0)">
        <h3 *ngIf="title" class="ds-scatter-plot__title">{{ title }}</h3>
        <div class="ds-scatter-plot__empty-msg" [style.height.px]="height">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="7.5" cy="14.5" r="2.5" />
            <circle cx="16.5" cy="7.5" r="2.5" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
          <p>{{ emptyMessage }}</p>
        </div>
      </ng-container>

      <!-- Active Content -->
      <ng-container *ngIf="!loading && data && data.length > 0">
        <!-- Header & Toolbar with Standard Table View Button -->
        <div class="ds-scatter-plot__header" [style.justify-content]="title || subtitle ? 'space-between' : 'flex-end'">
          <div *ngIf="title || subtitle">
            <h3 *ngIf="title" class="ds-scatter-plot__title">{{ title }}</h3>
            <p *ngIf="subtitle" class="ds-scatter-plot__subtitle">{{ subtitle }}</p>
          </div>
          <button
            type="button"
            class="ds-scatter-plot__table-btn"
            [class.ds-scatter-plot__table-btn--active]="isTableModalOpen"
            (click)="openTableModal()"
            title="Toggle Accessible Data Table View (Alt+F11)"
            aria-label="Toggle Accessible Data Table View"
          >
            <span>📊</span>
            <span>Table (Alt+F11)</span>
          </button>
        </div>

        <!-- Categorical Legend with WCAG 1.4.1 Shape Glyphs -->
        <div *ngIf="categories.length > 1" class="ds-scatter-plot__legend" role="toolbar" aria-label="Category Filters">
          <button
            *ngFor="let cat of categories"
            type="button"
            class="ds-scatter-plot__legend-item"
            [class.ds-scatter-plot__legend-item--dimmed]="isolatedCategory && isolatedCategory !== cat.key"
            (click)="toggleCategory(cat.key)"
            [attr.aria-pressed]="isolatedCategory === cat.key"
            [attr.title]="'Click to isolate ' + cat.label"
          >
            <svg width="14" height="14" viewBox="-8 -8 16 16" class="ds-scatter-plot__legend-icon">
              <path
                [attr.d]="renderShape(cat.symbol, 0, 0, 5)"
                [attr.fill]="cat.color"
                stroke="var(--surface-card, #ffffff)"
                stroke-width="1.5"
              />
            </svg>
            <span class="ds-scatter-plot__legend-label">{{ cat.label }}</span>
          </button>
        </div>

        <!-- SVG Canvas -->
        <svg
          width="100%"
          [attr.height]="height"
          [attr.viewBox]="'0 0 ' + plotWidth + ' ' + height"
          class="ds-scatter-plot__svg"
          aria-hidden="true"
          style="display: block; width: 100%; height: auto;"
          (pointerleave)="onCanvasLeave()"
          (click)="onCanvasClick()"
        >
          <defs>
            <clipPath [attr.id]="chartId + '-clip'">
              <rect x="0" y="0" [attr.width]="plot.plotWidth" [attr.height]="plot.plotHeight" />
            </clipPath>
          </defs>

          <g [attr.transform]="'translate(' + plot.margins.left + ', ' + plot.margins.top + ')'">
            <!-- Quadrant Reference Lines & 4 Corner Labels -->
            <g *ngIf="quadrantLines" class="ds-scatter-plot__quadrants">
              <line
                *ngIf="quadrantLines.x != null && scales.xScale"
                [attr.x1]="scales.xScale(quadrantLines.x)"
                y1="0"
                [attr.x2]="scales.xScale(quadrantLines.x)"
                [attr.y2]="plot.plotHeight"
                stroke="var(--border-strong, #64748b)"
                stroke-dasharray="4 4"
                stroke-width="1.5"
              />
              <line
                *ngIf="quadrantLines.y != null && scales.yScale"
                x1="0"
                [attr.y1]="scales.yScale(quadrantLines.y)"
                [attr.x2]="plot.plotWidth"
                [attr.y2]="scales.yScale(quadrantLines.y)"
                stroke="var(--border-strong, #64748b)"
                stroke-dasharray="4 4"
                stroke-width="1.5"
              />
              <g *ngIf="quadrantLines.labels" class="ds-scatter-plot__quadrant-labels">
                <!-- Top-Left -->
                <text
                  *ngIf="quadrantLines.labels[0]"
                  x="12"
                  y="16"
                  text-anchor="start"
                  class="ds-scatter-plot__quadrant-label"
                  fill="var(--text-secondary, #475569)"
                  font-size="10.5"
                  font-weight="600"
                  stroke="var(--surface-card, #ffffff)"
                  stroke-width="4"
                  paint-order="stroke fill"
                >
                  {{ quadrantLines.labels[0] }}
                </text>
                <!-- Top-Right -->
                <text
                  *ngIf="quadrantLines.labels[1]"
                  [attr.x]="plot.plotWidth - 12"
                  y="16"
                  text-anchor="end"
                  class="ds-scatter-plot__quadrant-label"
                  fill="var(--text-secondary, #475569)"
                  font-size="10.5"
                  font-weight="600"
                  stroke="var(--surface-card, #ffffff)"
                  stroke-width="4"
                  paint-order="stroke fill"
                >
                  {{ quadrantLines.labels[1] }}
                </text>
                <!-- Bottom-Left -->
                <text
                  *ngIf="quadrantLines.labels[2]"
                  x="12"
                  [attr.y]="plot.plotHeight - 12"
                  text-anchor="start"
                  class="ds-scatter-plot__quadrant-label"
                  fill="var(--text-secondary, #475569)"
                  font-size="10.5"
                  font-weight="600"
                  stroke="var(--surface-card, #ffffff)"
                  stroke-width="4"
                  paint-order="stroke fill"
                >
                  {{ quadrantLines.labels[2] }}
                </text>
                <!-- Bottom-Right -->
                <text
                  *ngIf="quadrantLines.labels[3]"
                  [attr.x]="plot.plotWidth - 12"
                  [attr.y]="plot.plotHeight - 12"
                  text-anchor="end"
                  class="ds-scatter-plot__quadrant-label"
                  fill="var(--text-secondary, #475569)"
                  font-size="10.5"
                  font-weight="600"
                  stroke="var(--surface-card, #ffffff)"
                  stroke-width="4"
                  paint-order="stroke fill"
                >
                  {{ quadrantLines.labels[3] }}
                </text>
              </g>
            </g>

            <!-- Gridlines -->
            <g *ngIf="showGridY && scales.yScale">
              <g *ngFor="let tick of scales.yTicks" class="ds-scatter-plot__gridline">
                <line x1="0" [attr.y1]="scales.yScale(tick)" [attr.x2]="plot.plotWidth" [attr.y2]="scales.yScale(tick)" />
              </g>
            </g>
            <g *ngIf="showGridX && scales.xScale">
              <g *ngFor="let tick of scales.xTicks" class="ds-scatter-plot__gridline">
                <line [attr.x1]="scales.xScale(tick)" y1="0" [attr.x2]="scales.xScale(tick)" [attr.y2]="plot.plotHeight" />
              </g>
            </g>

            <!-- 2D Density Bins -->
            <g *ngIf="variant === 'binned-density'">
              <rect
                *ngFor="let bin of densityBins"
                [attr.x]="bin.x"
                [attr.y]="bin.y"
                [attr.width]="bin.size"
                [attr.height]="bin.size"
                fill="var(--viz-1, #2563eb)"
                [attr.opacity]="0.12 + bin.intensity * 0.78"
                stroke="var(--surface-card, #ffffff)"
                stroke-width="0.5"
              />
            </g>

            <!-- Trajectory Line (Connected Scatter) -->
            <g *ngIf="variant === 'connected' && trajectoryPathD" [attr.clip-path]="'url(#' + chartId + '-clip)'">
              <path
                [attr.d]="trajectoryPathD"
                fill="none"
                stroke="var(--viz-1, #2563eb)"
                stroke-width="2"
                opacity="0.8"
              />
            </g>

            <!-- Linear Regression Trendline with Upper-Left Non-Colliding Badge -->
            <g *ngIf="showTrendline && regression && scales.xScale && scales.yScale" class="ds-scatter-plot__trendline" [attr.clip-path]="'url(#' + chartId + '-clip)'">
              <line
                [attr.x1]="scales.xScale(scales.xScale.domain()[0])"
                [attr.y1]="scales.yScale(regression.predict(scales.xScale.domain()[0]))"
                [attr.x2]="scales.xScale(scales.xScale.domain()[1])"
                [attr.y2]="scales.yScale(regression.predict(scales.xScale.domain()[1]))"
                stroke="var(--status-critical-solid, #ef4444)"
                stroke-width="2"
                stroke-dasharray="6 4"
              />
              <g class="ds-scatter-plot__trend-badge" transform="translate(12, 16)">
                <rect
                  x="-6"
                  y="-12"
                  width="134"
                  height="20"
                  rx="4"
                  fill="var(--surface-card, #ffffff)"
                  stroke="var(--status-critical-solid, #ef4444)"
                  stroke-width="1"
                  fill-opacity="0.95"
                />
                <text
                  x="0"
                  y="2"
                  fill="var(--status-critical-solid, #ef4444)"
                  class="ds-scatter-plot__trend-label"
                  font-size="11"
                  font-weight="600"
                >
                  Linear Fit: R² = {{ regression.rSquared.toFixed(3) }}
                </text>
              </g>
            </g>

            <!-- Reference Lines with Intelligent Density-Aware Side Placement & SVG Text Halo -->
            <ng-container *ngFor="let ref of referenceLines">
              <g *ngIf="ref.y != null && scales.yScale" class="ds-scatter-plot__reference-line">
                <line x1="0" [attr.y1]="scales.yScale(ref.y)" [attr.x2]="plot.plotWidth" [attr.y2]="scales.yScale(ref.y)" [attr.stroke]="ref.color || 'var(--status-critical-solid, #ef4444)'" stroke-dasharray="4 3" stroke-width="1.5" />
                <text
                  *ngIf="ref.label"
                  [attr.x]="getRefYPlacement(ref.y).x"
                  [attr.y]="scales.yScale(ref.y) < 25 ? scales.yScale(ref.y) + 14 : scales.yScale(ref.y) - 6"
                  [attr.text-anchor]="getRefYPlacement(ref.y).textAnchor"
                  [attr.fill]="ref.color || 'var(--status-critical-solid, #ef4444)'"
                  class="ds-scatter-plot__ref-label"
                  font-size="10.5"
                  font-weight="600"
                  stroke="var(--surface-card, #ffffff)"
                  stroke-width="4"
                  paint-order="stroke fill"
                >
                  {{ ref.label }}
                </text>
              </g>
              <g *ngIf="ref.x != null && scales.xScale" class="ds-scatter-plot__reference-line">
                <line [attr.x1]="scales.xScale(ref.x)" y1="0" [attr.x2]="scales.xScale(ref.x)" [attr.y2]="plot.plotHeight" [attr.stroke]="ref.color || 'var(--status-critical-solid, #ef4444)'" stroke-dasharray="4 3" stroke-width="1.5" />
                <text
                  *ngIf="ref.label"
                  [attr.x]="scales.xScale(ref.x) > plot.plotWidth * 0.65 ? scales.xScale(ref.x) - 6 : scales.xScale(ref.x) + 6"
                  [attr.y]="getRefXPlacement(ref.x).y"
                  [attr.text-anchor]="scales.xScale(ref.x) > plot.plotWidth * 0.65 ? 'end' : 'start'"
                  [attr.fill]="ref.color || 'var(--status-critical-solid, #ef4444)'"
                  class="ds-scatter-plot__ref-label"
                  font-size="10.5"
                  font-weight="600"
                  stroke="var(--surface-card, #ffffff)"
                  stroke-width="4"
                  paint-order="stroke fill"
                >
                  {{ ref.label }}
                </text>
              </g>
            </ng-container>

            <!-- Observation Points with WCAG 1.4.1 Shape Symbols -->
            <g [attr.clip-path]="'url(#' + chartId + '-clip)'">
              <path
                *ngFor="let pt of computedPoints"
                [attr.d]="renderShape(pt.symbol, pt.x, pt.y, activePointIndex === pt.idx ? pt.radius + 3 : pt.radius)"
                [attr.fill]="pt.color"
                [attr.fill-opacity]="isolatedCategory && isolatedCategory !== pt.catKey ? 0.15 : pointOpacity"
                [attr.stroke]="activePointIndex === pt.idx || selectedPointIndex === pt.idx ? 'var(--text-primary, #0f172a)' : 'var(--surface-card, #ffffff)'"
                [attr.stroke-width]="activePointIndex === pt.idx || selectedPointIndex === pt.idx ? 2.5 : 1.2"
                class="ds-scatter-plot__point"
                (pointerenter)="onPointEnter($event, pt.idx)"
                (pointerleave)="onPointLeave($event)"
                (click)="onPointClick($event, pt)"
              />
            </g>

            <!-- Active Highlight Ring -->
            <g *ngIf="activePoint" class="ds-scatter-plot__active-marker">
              <circle
                [attr.cx]="activePoint.x"
                [attr.cy]="activePoint.y"
                [attr.r]="activePoint.radius + 6"
                fill="none"
                stroke="var(--action-solid, #2563eb)"
                stroke-width="1.5"
                stroke-dasharray="2 2"
              />
            </g>

            <!-- X Axis — Solid Continuous Spine with Clean Ticks -->
            <g [attr.transform]="'translate(0, ' + plot.plotHeight + ')'" class="ds-scatter-plot__axis ds-scatter-plot__axis--x">
              <line x1="0" y1="0" [attr.x2]="plot.plotWidth" y2="0" stroke="var(--border-strong, #cbd5e1)" stroke-width="1.5" />
              <g *ngFor="let tick of scales.xTicks" [attr.transform]="'translate(' + scales.xScale(tick) + ', 0)'">
                <line y2="5" stroke="var(--border-subtle, #cbd5e1)" />
                <text y="18" text-anchor="middle">{{ formatVal(tick, '') }}</text>
              </g>
              <text *ngIf="xLabel" [attr.x]="plot.plotWidth / 2" y="38" text-anchor="middle" class="ds-scatter-plot__axis-title">
                {{ formatAxisTitle(xLabel, xUnit) }}
              </text>
            </g>

            <!-- Y Axis — Solid Continuous Spine with Clean Ticks -->
            <g class="ds-scatter-plot__axis ds-scatter-plot__axis--y">
              <line x1="0" y1="0" x2="0" [attr.y2]="plot.plotHeight" stroke="var(--border-strong, #cbd5e1)" stroke-width="1.5" />
              <g *ngFor="let tick of scales.yTicks" [attr.transform]="'translate(0, ' + scales.yScale(tick) + ')'">
                <line x2="-5" stroke="var(--border-subtle, #cbd5e1)" />
                <text x="-9" dy="0.32em" text-anchor="end">{{ formatVal(tick, '') }}</text>
              </g>
              <text
                *ngIf="yLabel"
                transform="rotate(-90)"
                [attr.x]="-plot.plotHeight / 2"
                y="-52"
                text-anchor="middle"
                class="ds-scatter-plot__axis-title"
              >
                {{ formatAxisTitle(yLabel, yUnit) }}
              </text>
            </g>
          </g>
        </svg>

        <!-- Layer 5: Beautiful 2D Dark Enterprise Floating HUD Tooltip -->
        <div
          *ngIf="activePoint && tooltipPos"
          class="ds-scatter-plot__tooltip"
          [style.left.px]="tooltipPos.left"
          [style.top.px]="tooltipPos.top"
          role="tooltip"
        >
          <div class="ds-scatter-plot__tooltip-header">
            <div style="display: flex; align-items: center; gap: 6px;">
              <svg width="12" height="12" viewBox="-8 -8 16 16" style="flex-shrink: 0;">
                <path
                  [attr.d]="renderShape(activePoint.symbol, 0, 0, 6)"
                  [attr.fill]="activePoint.color"
                  stroke="#ffffff"
                  stroke-width="1.5"
                />
              </svg>
              <strong style="color: #ffffff; font-size: 12px;">{{ activePoint.catLabel }}</strong>
            </div>
            <span class="ds-scatter-plot__tooltip-badge">Obs #{{ activePoint.idx + 1 }}</span>
          </div>
          <div class="ds-scatter-plot__tooltip-body">
            <div class="ds-scatter-plot__tooltip-row">
              <span>{{ xLabel || xKey }}:</span>
              <strong>{{ formatVal(activePoint.datum[xKey], xUnit) }}</strong>
            </div>
            <div class="ds-scatter-plot__tooltip-row">
              <span>{{ yLabel || yKey }}:</span>
              <strong>{{ formatVal(activePoint.datum[yKey], yUnit) }}</strong>
            </div>
            <div *ngIf="sizeKey && activePoint.datum[sizeKey] != null" class="ds-scatter-plot__tooltip-row">
              <span>{{ sizeKey }}:</span>
              <strong>{{ formatVal(activePoint.datum[sizeKey], sizeUnit) }}</strong>
            </div>
          </div>
        </div>

        <!-- Accessible Data Table Modal Dialog (Alt+F11) -->
        <div dsFocusTrap tabindex="-1"
          *ngIf="isTableModalOpen"
          class="ds-scatter-plot__modal-backdrop"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="(title || 'Scatter Plot') + ' Data Table'"
          (click)="closeTableModal()"
        >
          <div class="ds-scatter-plot__modal" (click)="$event.stopPropagation()">
            <div class="ds-scatter-plot__modal-header">
              <h4>{{ title || 'Scatter Plot' }} — Observation Records ({{ data.length }} total)</h4>
              <button type="button" class="ds-scatter-plot__modal-close" (click)="closeTableModal()" aria-label="Close data table">
                ✕
              </button>
            </div>
            <div class="ds-scatter-plot__modal-body">
              <table class="ds-scatter-plot__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th *ngIf="categoryKey">Category</th>
                    <th style="text-align: right">{{ formatAxisTitle(xLabel || xKey, xUnit) }}</th>
                    <th style="text-align: right">{{ formatAxisTitle(yLabel || yKey, yUnit) }}</th>
                    <th *ngIf="sizeKey" style="text-align: right">{{ formatAxisTitle(sizeKey, sizeUnit) }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let d of data; let idx = index">
                    <td style="color: var(--text-tertiary, #94a3b8)">{{ idx + 1 }}</td>
                    <td *ngIf="categoryKey" style="font-weight: 500">{{ d[categoryKey] ?? '—' }}</td>
                    <td style="text-align: right">{{ formatVal(d[xKey], xUnit) }}</td>
                    <td style="text-align: right">{{ formatVal(d[yKey], yUnit) }}</td>
                    <td *ngIf="sizeKey" style="text-align: right">{{ formatVal(d[sizeKey], sizeUnit) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="ds-scatter-plot__modal-footer">
              <button type="button" class="ds-scatter-plot__modal-footer-btn" (click)="closeTableModal()">
                Close (Esc)
              </button>
            </div>
          </div>
        </div>

        <!-- Screen Reader Live Region -->
        <div class="ds-scatter-plot__sr-only" aria-live="polite">
          {{ activePoint ? ('Observation ' + (activePoint.idx + 1) + ' of ' + data.length + ': ' + activePoint.catLabel + '. ' + (xLabel || xKey) + ': ' + activePoint.datum[xKey] + ' ' + xUnit + ', ' + (yLabel || yKey) + ': ' + activePoint.datum[yKey] + ' ' + yUnit + '.') : '' }}
        </div>
      </ng-container>
    </div>
  `,
  styleUrls: ['./scatter-plot.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsScatterPlotComponent implements AfterViewInit, OnDestroy {
  @Input() data: Array<Record<string, any>> = [];
  @Input() xKey: string = 'x';
  @Input() yKey: string = 'y';
  @Input() sizeKey: string | null = null;
  @Input() categoryKey: string | null = null;
  @Input() series: ScatterSeriesDef[] = [];
  @Input() variant: ScatterPlotVariant = 'scatter';
  @Input() width: number = 640;
  @Input() height: number = 360;
  @Input() margins: Partial<PlotMargins> = { top: 28, right: 36, bottom: 48, left: 72 };
  @Input() xScaleType: ScatterScaleType = 'linear';
  @Input() yScaleType: ScatterScaleType = 'linear';
  @Input() xUnit: string = '';
  @Input() yUnit: string = '';
  @Input() sizeUnit: string = '';
  @Input() xLabel: string = '';
  @Input() yLabel: string = '';
  @Input() locale: string = 'en-IN';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() minRadius: number = 4;
  @Input() maxRadius: number = 22;
  @Input() pointOpacity: number = 0.75;
  @Input() showTrendline: boolean = false;
  @Input() quadrantLines: ScatterQuadrantLines | null = null;
  @Input() referenceLines: ScatterReferenceLine[] = [];
  @Input() showGridX: boolean = true;
  @Input() showGridY: boolean = true;
  @Input() jitterAmount: number = 14;
  @Input() binSize: number = 24;
  @Input() densityThreshold: number = 1;
  @Input() density: ScatterDensity = 'standard';
  @Input() emptyMessage: string = 'No observation records found for the specified parameters.';
  @Input() loading: boolean = false;

  @Output() pointSelect = new EventEmitter<{ datum: Record<string, any>; index: number }>();

  @ViewChild('containerRef') containerRef?: ElementRef<HTMLDivElement>;

  chartId = `ds-scatter-plot-${++nextScatterId}`;
  isolatedCategory: string | null = null;
  activePointIndex: number = -1;
  selectedPointIndex: number = -1;
  isTableModalOpen: boolean = false;

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

  formatAxisTitle(label: string, unit: string): string {
    if (!label) return '';
    const cleanUnit = (unit || '').trim();
    if (!cleanUnit) return label;
    if (label.includes(`(${cleanUnit})`) || label.includes(cleanUnit) || label.includes('(')) {
      return label;
    }
    return `${label} (${cleanUnit})`;
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
        top: this.margins?.top ?? 28,
        right: (this.densityTier === 'compact' || this.densityTier === 'mobile') ? 16 : (this.margins?.right ?? 36),
        bottom: (this.densityTier === 'compact' || this.densityTier === 'mobile') ? 36 : (this.margins?.bottom ?? 48),
        left: this.effectiveLeftMargin
      }
    });
  }

  get categories(): ScatterSeriesDef[] {
    if (this.series && this.series.length > 0) {
      return this.series.map((s, idx) => ({
        key: s.key || `cat_${idx}`,
        label: s.label || s.key || `Category ${idx + 1}`,
        color: s.color || VIZ_COLORS[idx % VIZ_COLORS.length],
        symbol: (s.symbol || POINT_SYMBOLS[idx % POINT_SYMBOLS.length]) as any
      }));
    }
    if (this.categoryKey && this.data && this.data.length > 0) {
      const distinct = Array.from(new Set(this.data.map(d => d[this.categoryKey!]).filter(Boolean)));
      return distinct.map((cat, idx) => ({
        key: String(cat),
        label: String(cat),
        color: VIZ_COLORS[idx % VIZ_COLORS.length],
        symbol: POINT_SYMBOLS[idx % POINT_SYMBOLS.length] as any
      }));
    }
    return [{
      key: 'default',
      label: 'Observations',
      color: VIZ_COLORS[0],
      symbol: 'circle'
    }];
  }

  get categoryMap(): Map<string, ScatterSeriesDef> {
    const map = new Map<string, ScatterSeriesDef>();
    this.categories.forEach(c => map.set(c.key, c));
    return map;
  }

  get jitterOffsets(): number[] {
    if (this.variant !== 'jittered' || !this.data) return [];
    return this.data.map((_, i) => {
      const seed = (i * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      return (rnd - 0.5) * 2 * this.jitterAmount;
    });
  }

  get scales() {
    if (!this.data || this.data.length === 0) {
      return {
        xScale: null as any,
        yScale: null as any,
        sizeScale: null as any,
        xTicks: [] as any[],
        yTicks: [] as any[]
      };
    }

    let xScale: any;
    const xValues = this.data.map(d => d[this.xKey]);
    if (this.xScaleType === 'band') {
      const distinctX = Array.from(new Set(xValues));
      xScale = createBandScale({
        domain: distinctX,
        range: [0, this.plot.plotWidth],
        paddingInner: 0.35
      });
    } else if (this.xScaleType === 'log') {
      const minX = Math.min(...xValues.map(v => Math.max(1e-4, Number(v))));
      const maxX = Math.max(...xValues.map(Number));
      xScale = createLogScale({
        domain: [minX, maxX],
        range: [0, this.plot.plotWidth]
      });
    } else {
      const minX = Math.min(...xValues.map(Number));
      const maxX = Math.max(...xValues.map(Number));
      const span = maxX - minX || 1;
      const xPad = this.quadrantLines ? 0.08 : 0.05;
      xScale = createLinearScale({
        domain: [minX - span * xPad, maxX + span * xPad],
        range: [0, this.plot.plotWidth]
      });
    }

    let yScale: any;
    const yValues = this.data.map(d => Number(d[this.yKey]));
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const spanY = maxY - minY || 1;

    if (this.yScaleType === 'log') {
      yScale = createLogScale({
        domain: [Math.max(1e-4, minY), maxY],
        range: [this.plot.plotHeight, 0]
      });
    } else {
      const topPad = this.quadrantLines ? 0.16 : 0.08;
      const botPad = this.quadrantLines ? 0.12 : 0.08;
      yScale = createLinearScale({
        domain: [minY < 0 ? minY - spanY * botPad : Math.max(0, minY - spanY * botPad), maxY + spanY * topPad],
        range: [this.plot.plotHeight, 0]
      });
    }

    let sizeScale: any = () => this.minRadius;
    if (this.sizeKey && (this.variant === 'bubble' || this.variant === 'scatter')) {
      const sizeValues = this.data.map(d => Number(d[this.sizeKey!] || 0));
      const minZ = Math.min(...sizeValues);
      const maxZ = Math.max(...sizeValues);
      sizeScale = createAreaScale({
        domain: [minZ, maxZ],
        minRadius: this.minRadius,
        maxRadius: this.maxRadius
      });
    }

    const xTicks = generateTicks(xScale, Math.min(6, Math.floor(this.plot.plotWidth / 100)));
    const yTicks = generateTicks(yScale, Math.min(5, Math.floor(this.plot.plotHeight / 56)));

    return { xScale, yScale, sizeScale, xTicks, yTicks };
  }

  get densityBins(): any[] {
    if (this.variant !== 'binned-density' || !this.scales.xScale || !this.scales.yScale || this.data.length === 0) return [];
    const cols = Math.ceil(this.plot.plotWidth / this.binSize);
    const rows = Math.ceil(this.plot.plotHeight / this.binSize);
    const grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

    let maxCount = 0;
    this.data.forEach(d => {
      const px = this.scales.xScale(d[this.xKey]);
      const py = this.scales.yScale(d[this.yKey]);
      const c = Math.floor(px / this.binSize);
      const r = Math.floor(py / this.binSize);
      if (c >= 0 && c < cols && r >= 0 && r < rows) {
        grid[r][c] += 1;
        if (grid[r][c] > maxCount) maxCount = grid[r][c];
      }
    });

    const bins = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const count = grid[r][c];
        if (count >= this.densityThreshold) {
          bins.push({
            x: c * this.binSize,
            y: r * this.binSize,
            size: this.binSize,
            count,
            intensity: count / (maxCount || 1)
          });
        }
      }
    }
    return bins;
  }

  get regression() {
    if (!this.showTrendline || !this.scales.xScale || !this.scales.yScale || this.data.length < 2) return null;
    const points = this.data
      .map(d => ({ x: Number(d[this.xKey]), y: Number(d[this.yKey]) }))
      .filter(p => !isNaN(p.x) && !isNaN(p.y));
    return calculateLinearRegression(points);
  }

  get computedPoints(): any[] {
    if (!this.scales.xScale || !this.scales.yScale || !this.data || this.data.length === 0) return [];

    return this.data.map((d, idx) => {
      let px: number;
      if (this.xScaleType === 'band') {
        px = this.scales.xScale(d[this.xKey]) + this.scales.xScale.bandwidth() / 2;
        if (this.variant === 'jittered') {
          px += (this.jitterOffsets[idx] || 0);
        }
      } else {
        px = this.scales.xScale(d[this.xKey]);
      }

      const py = this.scales.yScale(d[this.yKey]);
      const radius = this.sizeKey ? this.scales.sizeScale(d[this.sizeKey]) : this.minRadius;
      const catKey = this.categoryKey ? String(d[this.categoryKey]) : 'default';
      const catDef = this.categoryMap.get(catKey) || this.categories[0];

      return {
        idx,
        datum: d,
        x: px,
        y: py,
        radius,
        color: catDef.color,
        symbol: catDef.symbol,
        catKey,
        catLabel: catDef.label
      };
    });
  }

  get sortedIndices(): number[] {
    return this.computedPoints
      .map((p, i) => ({ i, x: p.x }))
      .sort((a, b) => a.x - b.x)
      .map(item => item.i);
  }

  get trajectoryPathD(): string {
    if (this.variant !== 'connected' || this.computedPoints.length < 2) return '';
    return createLinePath(this.computedPoints, 'linear');
  }

  get activePoint(): any | null {
    if (this.activePointIndex < 0 || this.activePointIndex >= this.computedPoints.length) return null;
    return this.computedPoints[this.activePointIndex];
  }

  get tooltipPos(): { left: number; top: number } | null {
    if (!this.activePoint) return null;
    const cx = this.plot.toCanvasX(this.activePoint.x);
    const cy = this.plot.toCanvasY(this.activePoint.y);
    const ttWidth = 220;
    const ttHeight = 104;

    const isRightHalf = cx > this.width * 0.48;
    const targetLeft = isRightHalf
      ? cx - ttWidth - 18
      : cx + (this.activePoint.radius || 6) + 18;
    const left = Math.max(12, Math.min(targetLeft, this.width - ttWidth - 12));

    const isBottomHalf = cy > this.height * 0.50;
    const targetTop = isBottomHalf
      ? cy - ttHeight - 14
      : cy + (this.activePoint.radius || 6) + 14;
    const top = Math.max(12, Math.min(targetTop, this.height - ttHeight - 12));

    return { left, top };
  }

  renderShape(symbol: string = 'circle', cx: number, cy: number, r: number): string {
    return renderPointSymbol(symbol as any, cx, cy, r);
  }

  formatVal(val: any, unit: string = ''): string {
    return formatVizValue(val, unit, this.locale);
  }

  toggleCategory(key: string): void {
    this.isolatedCategory = this.isolatedCategory === key ? null : key;
  }

  onPointEnter(e: Event, idx: number): void {
    e.stopPropagation();
    this.activePointIndex = idx;
  }

  onPointLeave(e: Event): void {
    e.stopPropagation();
    this.activePointIndex = -1;
  }

  onPointClick(e: Event, pt: any): void {
    e.stopPropagation();
    this.selectedPointIndex = pt.idx;
    this.pointSelect.emit({ datum: pt.datum, index: pt.idx });
  }

  onCanvasLeave(): void {
    this.activePointIndex = -1;
  }

  onCanvasClick(): void {
    this.activePointIndex = -1;
    this.selectedPointIndex = -1;
  }

  openTableModal(): void {
    this.isTableModalOpen = true;
  }

  closeTableModal(): void {
    this.isTableModalOpen = false;
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.altKey && (e.key === 'F11' || e.code === 'F11')) {
      e.preventDefault();
      this.isTableModalOpen = !this.isTableModalOpen;
      return;
    }

    if (this.isTableModalOpen) {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closeTableModal();
      }
      return;
    }

    const sorted = this.sortedIndices;
    if (sorted.length === 0) return;

    const currentSortedPos = this.activePointIndex >= 0 ? sorted.indexOf(this.activePointIndex) : -1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextPos = (currentSortedPos + 1) % sorted.length;
      this.activePointIndex = sorted[nextPos];
      if (this.data[this.activePointIndex]) {
        this.pointSelect.emit({ datum: this.data[this.activePointIndex], index: this.activePointIndex });
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevPos = (currentSortedPos - 1 + sorted.length) % sorted.length;
      this.activePointIndex = sorted[prevPos];
      if (this.data[this.activePointIndex]) {
        this.pointSelect.emit({ datum: this.data[this.activePointIndex], index: this.activePointIndex });
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (this.activePointIndex >= 0 && this.data[this.activePointIndex]) {
        this.selectedPointIndex = this.activePointIndex;
        this.pointSelect.emit({ datum: this.data[this.activePointIndex], index: this.activePointIndex });
      }
    } else if (e.key === 'Escape') {
      this.activePointIndex = -1;
      this.selectedPointIndex = -1;
    }
  }

  getRefYPlacement(yVal: number): { x: number; textAnchor: string } {
    if (!this.scales.yScale || !this.computedPoints || !this.computedPoints.length) {
      return { x: this.plot.plotWidth - 8, textAnchor: 'end' };
    }
    const yPos = this.scales.yScale(yVal);
    const ptsNearY = this.computedPoints.filter(p => Math.abs(p.y - yPos) < 30);
    const avgXNearY = ptsNearY.length > 0
      ? ptsNearY.reduce((sum, p) => sum + p.x, 0) / ptsNearY.length
      : this.plot.plotWidth / 2;
    const placeOnLeft = avgXNearY > this.plot.plotWidth * 0.45;
    return {
      x: placeOnLeft ? 8 : this.plot.plotWidth - 8,
      textAnchor: placeOnLeft ? 'start' : 'end'
    };
  }

  getRefXPlacement(xVal: number): { y: number } {
    if (!this.scales.xScale || !this.computedPoints || !this.computedPoints.length) {
      return { y: 15 };
    }
    const xPos = this.scales.xScale(xVal);
    const ptsNearX = this.computedPoints.filter(p => Math.abs(p.x - xPos) < 40);
    const avgYNearX = ptsNearX.length > 0
      ? ptsNearX.reduce((sum, p) => sum + p.y, 0) / ptsNearX.length
      : this.plot.plotHeight / 2;
    const placeAtBottom = avgYNearX < this.plot.plotHeight * 0.55;
    return {
      y: placeAtBottom ? this.plot.plotHeight - 8 : 15
    };
  }
}
