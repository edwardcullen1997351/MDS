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
  PATTERN_PRESETS,
  formatVizValue,
  computePieSlices,
  createArcPath,
  PlotMargins,
  PatternPreset,
  getVizDensityTier,
  VizDensityTier
} from '../../utils/viz-core.js';

export type PieChartVariant = 'pie' | 'donut';
export type PieDensity = 'compact' | 'standard' | 'expanded';

let nextPieId = 0;

@Component({
  selector: 'ds-pie-chart',
  standalone: true,
  imports: [DsFocusTrapDirective, CommonModule],
  template: `
    <div
      #containerRef
      class="ds-pie-chart ds-pie-chart--{{ variant }} ds-pie-chart--density-{{ density }}"
      [ngClass]="{ 'ds-pie-chart--loading': loading, 'ds-pie-chart--empty': !loading && (!data || data.length === 0 || totalSum === 0) }"
      [style.width]="'100%'"
      role="region"
      aria-roledescription="pie chart"
      [attr.aria-label]="title || 'Proportional Part-to-Whole Pie Chart. ' + slices.length + ' slices. Use arrow keys to cycle, Alt+F11 for data table.'"
      tabindex="0"
      (keydown)="onKeyDown($event)"
      (pointerleave)="activeSliceIndex = -1"
    >
      <!-- Skeleton Loading -->
      <ng-container *ngIf="loading">
        <div class="ds-pie-chart__skeleton-header"></div>
        <div class="ds-pie-chart__skeleton-circle" [style.height.px]="height - 60"></div>
      </ng-container>

      <!-- Empty State -->
      <ng-container *ngIf="!loading && (!data || data.length === 0 || totalSum === 0)">
        <h3 *ngIf="title" class="ds-pie-chart__title">{{ title }}</h3>
        <div class="ds-pie-chart__empty-msg" [style.height.px]="height - 60">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 8px; opacity: 0.6">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
          <p>{{ emptyMessage }}</p>
        </div>
      </ng-container>

      <!-- Main Chart -->
      <ng-container *ngIf="!loading && data && data.length > 0 && totalSum > 0">
        <!-- Header & Table Modal Toggle Button -->
        <div *ngIf="title || subtitle" class="ds-pie-chart__header">
          <div>
            <h3 *ngIf="title" class="ds-pie-chart__title">{{ title }}</h3>
            <p *ngIf="subtitle" class="ds-pie-chart__subtitle">{{ subtitle }}</p>
          </div>
          <button
            type="button"
            class="ds-pie-chart__table-btn"
            [class.ds-pie-chart__table-btn--active]="showTableModal"
            (click)="showTableModal = !showTableModal"
            title="Toggle Accessible Proportions Table (Alt+F11)"
            aria-label="Toggle Accessible Proportions Table"
          >
            Table (Alt+F11)
          </button>
        </div>

        <!-- SVG Canvas -->
        <svg
          [attr.width]="svgWidth"
          [attr.height]="svgHeight"
          [attr.viewBox]="'0 0 ' + svgWidth + ' ' + svgHeight"
          class="ds-pie-chart__svg"
          aria-hidden="true"
          (click)="activeSliceIndex = -1"
        >
          <defs>
            <pattern
              *ngFor="let pat of patternPresetsList"
              [attr.id]="chartId + '-' + pat.id"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              [attr.patternTransform]="pat.transform || ''"
            >
              <circle
                *ngIf="pat.type === 'circle'"
                cx="4"
                cy="4"
                [attr.r]="pat.r || 1.2"
                fill="rgba(255,255,255,0.4)"
              />
              <line
                *ngIf="pat.type !== 'circle'"
                [attr.x1]="0"
                [attr.y1]="4"
                [attr.x2]="8"
                [attr.y2]="4"
                stroke="rgba(255,255,255,0.35)"
                stroke-width="1.2"
              />
            </pattern>
          </defs>

          <!-- Slices -->
          <g class="ds-pie-chart__sectors">
            <g
              *ngFor="let s of slices; let idx = index"
              class="ds-pie-chart__slice-group"
              (pointerenter)="onSlicePointerEnter(s, idx, $event)"
              (click)="onSliceClick(s, idx, $event)"
            >
              <!-- Sector path -->
              <path
                class="ds-pie-chart__slice"
                [attr.d]="getSlicePath(s, idx)"
                [attr.fill]="s.color"
                [attr.opacity]="isolatedCategory && isolatedCategory !== s.catName ? 0.2 : 0.94"
                stroke="var(--surface-card, #ffffff)"
                stroke-width="2"
              />
              <!-- Hatch pattern overlay -->
              <path
                *ngIf="enablePatterns"
                [attr.d]="getSlicePath(s, idx)"
                [attr.fill]="'url(#' + chartId + '-' + s.pattern + ')'"
                opacity="0.6"
                pointer-events="none"
              />
              <!-- Direct Sector Concise Percentage Label -->
              <text
                *ngIf="showLabels && s.percentage >= 4"
                [attr.x]="getLabelCoords(s).x"
                [attr.y]="getLabelCoords(s).y"
                dy="0.32em"
                [attr.text-anchor]="getLabelAnchor(s)"
                class="ds-pie-chart__label"
                [style.font-weight]="activeSliceIndex === idx ? '700' : '600'"
                [style.fill]="activeSliceIndex === idx ? 'var(--text-primary, #0f172a)' : 'var(--text-secondary, #334155)'"
              >
                {{ s.percentage.toFixed(1) }}%
              </text>
            </g>

            <!-- Center Donut Cutout Total Readout -->
            <g *ngIf="variant === 'donut' && showCenterTotal" style="pointer-events: none">
              <text
                [attr.x]="cx"
                [attr.y]="cy - 4"
                text-anchor="middle"
                class="ds-pie-chart__center-val"
              >
                {{ formatVal(activeSlice ? activeSlice.value : totalSum) }}
              </text>
              <text
                [attr.x]="cx"
                [attr.y]="cy + 14"
                text-anchor="middle"
                class="ds-pie-chart__center-label"
              >
                {{ activeSlice ? (activeSlice.catName.length > 18 ? activeSlice.catName.slice(0, 16) + '…' : activeSlice.catName) : centerLabel }}
              </text>
            </g>
          </g>
        </svg>

        <!-- Categorical Legend & Isolation Bar -->
        <div *ngIf="showLegend && slices.length > 1" class="ds-pie-chart__legend" role="toolbar" aria-label="Proportions Legend">
          <button
            *ngFor="let s of slices; let idx = index"
            type="button"
            class="ds-pie-chart__legend-item"
            [class.ds-pie-chart__legend-item--dimmed]="isolatedCategory && isolatedCategory !== s.catName"
            (click)="toggleIsolateCategory(s.catName)"
            [attr.aria-pressed]="isolatedCategory === s.catName"
            [attr.title]="'Click to isolate ' + s.catName"
          >
            <span class="ds-pie-chart__legend-swatch" [style.background-color]="s.color"></span>
            <span class="ds-pie-chart__legend-label">{{ s.catName }}</span>
            <strong class="ds-pie-chart__legend-pct">{{ s.percentage.toFixed(1) }}%</strong>
          </button>
        </div>

        <!-- 2D Quad-Flip Non-Occluding Tooltip Overlay -->
        <div
          *ngIf="activeSlice"
          class="ds-pie-chart__tooltip"
          [style.left.px]="tooltipLeft"
          [style.top.px]="tooltipTop"
          role="tooltip"
        >
          <div class="ds-pie-chart__tooltip-title">{{ activeSlice.catName }}</div>
          <div class="ds-pie-chart__tooltip-row">
            <span>{{ valueLabel }}:</span>
            <strong style="color: #38bdf8">{{ formatVal(activeSlice.value) }}</strong>
          </div>
          <div class="ds-pie-chart__tooltip-row" style="margin-top: 2px">
            <span>Proportion:</span>
            <strong style="color: #4ade80">{{ activeSlice.percentage.toFixed(1) }}%</strong>
          </div>
        </div>

        <!-- Accessible Proportions Data Table Modal (Alt+F11) -->
        <div dsFocusTrap tabindex="-1" *ngIf="showTableModal" class="ds-pie-chart__modal-backdrop" role="dialog" aria-modal="true" aria-label="Accessible Part-to-Whole Proportions Matrix">
          <div class="ds-pie-chart__modal-dialog">
            <div class="ds-pie-chart__modal-header">
              <div>
                <div class="ds-pie-chart__modal-title">Accessible Part-to-Whole Proportions Matrix</div>
                <div class="ds-pie-chart__modal-subtitle">
                  Total Aggregate: <strong>{{ formatVal(totalSum) }}</strong> (100.0%) across {{ slices.length }} categories
                </div>
              </div>
              <button
                type="button"
                (click)="showTableModal = false"
                class="ds-pie-chart__modal-close"
                aria-label="Close table modal"
              >&times;</button>
            </div>

            <div class="ds-pie-chart__modal-body">
              <table class="ds-pie-chart__table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th style="text-align: right">Magnitude ({{ unit.trim() || 'Units' }})</th>
                    <th style="text-align: right">Percentage Share</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let s of slices">
                    <td style="font-weight: 600; display: flex; align-items: center; gap: 6px">
                      <span [style.background-color]="s.color" style="display: inline-block; width: 8px; height: 8px; border-radius: 50%"></span>
                      {{ s.catName }}
                    </td>
                    <td style="text-align: right; font-variant-numeric: tabular-nums">
                      {{ formatVizValue(s.value, '', locale) }}
                    </td>
                    <td style="text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; color: var(--action-solid, #0284c7)">
                      {{ s.percentage.toFixed(1) }}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="ds-pie-chart__modal-footer">
              <button
                type="button"
                (click)="showTableModal = false"
                class="ds-pie-chart__modal-btn"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>

        <!-- Live Region for Screen Reader Announcements -->
        <div class="sr-only" aria-live="polite">
          {{ announcement }}
        </div>
      </ng-container>
    </div>
  `,
  styleUrls: ['./pie-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsPieChartComponent implements AfterViewInit, OnDestroy {
  Math = Math;
  formatVizValue = formatVizValue;

  @Input() data: Array<Record<string, any>> = [];
  @Input() categoryKey: string = 'name';
  @Input() valueKey: string = 'value';
  @Input() variant: PieChartVariant = 'pie';
  @Input() innerRadiusRatio: number = 0.62;
  @Input() padAngle: number = 0.02;
  @Input() width: number = 440;
  @Input() height: number = 340;
  @Input() margins: Partial<PlotMargins> = { top: 16, right: 16, bottom: 16, left: 16 };
  @Input() unit: string = '';
  @Input() valueLabel: string = 'Share';
  @Input() centerLabel: string = 'Total';
  @Input() locale: string = 'en-IN';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() showLabels: boolean = true;
  @Input() showLegend: boolean = true;
  @Input() showCenterTotal: boolean = true;
  @Input() enablePatterns: boolean = true;
  @Input() density: PieDensity = 'standard';
  @Input() emptyMessage: string = 'No part-to-whole records available.';
  @Input() loading: boolean = false;

  @Output() sliceSelect = new EventEmitter<{ datum: Record<string, any>; index: number }>();

  @ViewChild('containerRef') containerRef?: ElementRef<HTMLDivElement>;

  chartId = `ds-pie-chart-${++nextPieId}`;
  activeSliceIndex = -1;
  selectedSliceIndex = -1;
  isolatedCategory: string | null = null;
  showTableModal = false;
  announcement = '';
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
    return Math.max(260, this.measuredWidth || this.width);
  }

  get densityTier(): VizDensityTier {
    return getVizDensityTier(this.plotWidth);
  }

  get rawSlices() {
    if (!this.data || this.data.length === 0) return [];
    return computePieSlices(this.data, {
      valueKey: this.valueKey,
      padAngle: this.padAngle
    });
  }

  get totalSum(): number {
    return this.rawSlices.length > 0 ? this.rawSlices[0].total : 0;
  }

  get slices() {
    return this.rawSlices.map((s, idx) => {
      const catName = String(s.datum[this.categoryKey] || `Category ${idx + 1}`);
      const color = s.datum.color || VIZ_COLORS[idx % VIZ_COLORS.length];
      const pattern = PATTERN_PRESETS[idx % PATTERN_PRESETS.length].id;
      return { ...s, catName, color, pattern };
    });
  }

  get activeSlice(): any {
    return this.activeSliceIndex >= 0 ? this.slices[this.activeSliceIndex] : null;
  }

  get headerHeight(): number {
    return (this.title || this.subtitle) ? 44 : 0;
  }

  get legendHeight(): number {
    return (this.showLegend && this.slices.length > 1) ? (this.slices.length > 4 ? 54 : 32) : 0;
  }

  get svgWidth(): number {
    return Math.max(160, this.plotWidth - 40);
  }

  get svgHeight(): number {
    return Math.max(160, this.height - this.headerHeight - this.legendHeight - 32);
  }

  get cx(): number {
    return this.svgWidth / 2;
  }

  get cy(): number {
    return this.svgHeight / 2;
  }

  get outerRadius(): number {
    const labelMargin = this.showLabels ? 24 : 10;
    const maxR = Math.min(this.svgWidth, this.svgHeight) / 2 - labelMargin;
    return Math.max(28, maxR);
  }

  get innerRadius(): number {
    return this.variant === 'donut' ? this.outerRadius * this.innerRadiusRatio : 0;
  }

  getSlicePath(slice: any, idx: number): string {
    const isActive = this.activeSliceIndex === idx || this.selectedSliceIndex === idx;
    const expandOffset = isActive ? 5 : 0;
    const sliceCx = this.cx + expandOffset * Math.cos(slice.midAngle);
    const sliceCy = this.cy + expandOffset * Math.sin(slice.midAngle);

    return createArcPath({
      cx: sliceCx,
      cy: sliceCy,
      innerRadius: this.innerRadius,
      outerRadius: isActive ? this.outerRadius + 2 : this.outerRadius,
      startAngle: slice.startAngle,
      endAngle: slice.endAngle
    });
  }

  getLabelCoords(slice: any): { x: number; y: number } {
    const labelRadius = this.outerRadius + 14;
    return {
      x: this.cx + labelRadius * Math.cos(slice.midAngle),
      y: this.cy + labelRadius * Math.sin(slice.midAngle)
    };
  }

  getLabelAnchor(slice: any): string {
    const cosVal = Math.cos(slice.midAngle);
    return cosVal > 0.1 ? 'start' : cosVal < -0.1 ? 'end' : 'middle';
  }

  get tooltipLeft(): number {
    if (!this.activeSlice) return 0;
    const midAngle = this.activeSlice.midAngle;
    const offset = Math.cos(midAngle) >= 0 ? 15 : -180;
    const rawX = 20 + this.cx + (this.outerRadius * 0.75) * Math.cos(midAngle) + offset;
    return Math.min(Math.max(12, rawX), this.width - 185);
  }

  get tooltipTop(): number {
    if (!this.activeSlice) return 0;
    const midAngle = this.activeSlice.midAngle;
    const offset = Math.sin(midAngle) >= 0 ? 15 : -80;
    const rawY = 16 + this.headerHeight + this.cy + (this.outerRadius * 0.75) * Math.sin(midAngle) + offset;
    return Math.min(Math.max(12, rawY), this.height - 85);
  }

  formatVal(val: any): string {
    return formatVizValue(val, this.unit, this.locale);
  }

  toggleIsolateCategory(catName: string): void {
    this.isolatedCategory = this.isolatedCategory === catName ? null : catName;
  }

  onSlicePointerEnter(slice: any, index: number, e: Event): void {
    e.stopPropagation();
    this.activeSliceIndex = index;
    this.announcement = `Selected sector ${slice.catName}: ${this.formatVal(slice.value)}, representing ${slice.percentage.toFixed(1)}% of total.`;
  }

  onSliceClick(slice: any, index: number, e: Event): void {
    e.stopPropagation();
    this.selectedSliceIndex = this.selectedSliceIndex === index ? -1 : index;
    this.sliceSelect.emit({ datum: slice.datum, index });
  }

  onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'F11' && e.altKey) {
      e.preventDefault();
      this.showTableModal = !this.showTableModal;
      return;
    }
    if (e.key === 'Escape') {
      if (this.showTableModal) {
        e.preventDefault();
        this.showTableModal = false;
        return;
      }
      if (this.activeSliceIndex >= 0 || this.selectedSliceIndex >= 0) {
        e.preventDefault();
        this.activeSliceIndex = -1;
        this.selectedSliceIndex = -1;
        return;
      }
    }
    if (this.slices.length === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.activeSliceIndex = (this.activeSliceIndex + 1) % this.slices.length;
      const s = this.slices[this.activeSliceIndex];
      this.announcement = `Selected sector ${s.catName}: ${this.formatVal(s.value)}, representing ${s.percentage.toFixed(1)}% of total.`;
      this.sliceSelect.emit({ datum: s.datum, index: this.activeSliceIndex });
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.activeSliceIndex = (this.activeSliceIndex - 1 + this.slices.length) % this.slices.length;
      const s = this.slices[this.activeSliceIndex];
      this.announcement = `Selected sector ${s.catName}: ${this.formatVal(s.value)}, representing ${s.percentage.toFixed(1)}% of total.`;
      this.sliceSelect.emit({ datum: s.datum, index: this.activeSliceIndex });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (this.activeSliceIndex >= 0 && this.activeSliceIndex < this.slices.length) {
        this.selectedSliceIndex = this.selectedSliceIndex === this.activeSliceIndex ? -1 : this.activeSliceIndex;
      }
    }
  }
}
