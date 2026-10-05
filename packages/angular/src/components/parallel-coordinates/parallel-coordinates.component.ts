import { DsFocusTrapDirective } from '../../utils/focus-trap.directive.js';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  calculateDimensionDomains,
  generateParallelPolylinePath,
  evaluateBrushFilters,
  STROKE_DASH_PATTERNS,
  VIZ_COLORS,
  formatVizValue,
  DimensionDomain,
  getVizDensityTier,
  VizDensityTier
} from '../../utils/viz-core.js';

export type ParallelCoordinatesVariant = 'standard' | 'normalized' | 'spline' | 'brushed';

export interface ParallelDimension {
  key: string;
  label: string;
  unit?: string;
  min?: number;
  max?: number;
  inverted?: boolean;
  isCategorical?: boolean;
  categories?: string[];
}

const CLUSTER_COLORS = [
  '#0284c7',
  '#16a34a',
  '#d97706',
  '#7c3aed',
  '#dc2626',
  '#0d9488'
];

@Component({
  selector: 'ds-parallel-coordinates',
  standalone: true,
  imports: [DsFocusTrapDirective, CommonModule, FormsModule],
  template: `
    <div
      #containerRef
      class="ds-parallel-coordinates ds-parallel-coordinates--{{ variant }}"
      [style.width]="'100%'"
      role="region"
      [attr.aria-label]="(title || 'Multivariate Parallel Coordinates') + '. ' + filteredData.length + ' records across ' + activeDimensions.length + ' dimensions. Use arrow keys to cycle, Alt+F11 for data table.'"
      tabindex="0"
      (keydown)="onKeyDown($event)"
    >
      <!-- Live Region for Screen Reader Announcements -->
      <div aria-live="polite" class="sr-only">
        {{ announcement }}
      </div>

      <!-- Header & Controls Toolbar -->
      <div class="ds-parallel-coordinates__header">
        <div>
          <div *ngIf="title" class="ds-parallel-coordinates__title">{{ title }}</div>
          <div *ngIf="subtitle" class="ds-parallel-coordinates__subtitle">
            {{ subtitle }} · Showing <strong>{{ filteredData.length }}</strong> of {{ data.length }} records
          </div>
        </div>

        <div *ngIf="showControls" class="ds-parallel-coordinates__toolbar">
          <!-- Search Input -->
          <div *ngIf="showSearch" class="ds-parallel-coordinates__search-wrapper">
            <input
              type="text"
              placeholder="Filter record/batch..."
              [(ngModel)]="searchQuery"
              class="ds-parallel-coordinates__search-input"
              aria-label="Filter records by ID, label, or cluster"
            />
            <button
              *ngIf="searchQuery"
              type="button"
              (click)="searchQuery = ''"
              class="ds-parallel-coordinates__search-clear"
              aria-label="Clear search"
            >&times;</button>
          </div>

          <!-- Normalization Toggle -->
          <label class="ds-parallel-coordinates__checkbox-label">
            <input
              type="checkbox"
              [(ngModel)]="isNormalized"
            />
            Normalize 0–100%
          </label>

          <!-- Spline Smooth Toggle -->
          <label class="ds-parallel-coordinates__checkbox-label">
            <input
              type="checkbox"
              [(ngModel)]="isSmooth"
            />
            Smooth Spline
          </label>

          <!-- Accessible Brush Filters Panel Trigger -->
          <button
            *ngIf="showBrushControls"
            type="button"
            class="ds-parallel-coordinates__btn"
            [class.ds-parallel-coordinates__btn--active]="isFilterPanelOpen"
            (click)="isFilterPanelOpen = !isFilterPanelOpen"
          >
            🎯 Brush Filters {{ activeBrushCount > 0 ? '(' + activeBrushCount + ')' : '' }}
          </button>

          <!-- Table Modal Toggle Button (Alt+F11) -->
          <button
            type="button"
            class="ds-parallel-coordinates__btn"
            [class.ds-parallel-coordinates__btn--active]="showTableModal"
            (click)="showTableModal = !showTableModal"
            title="Toggle Accessible Data Table View (Alt+F11)"
            aria-label="Toggle Accessible Data Table View"
          >
            Table (Alt+F11)
          </button>
        </div>
      </div>

      <!-- Non-Drag Accessible Brush Controls Panel -->
      <div *ngIf="isFilterPanelOpen" class="ds-parallel-coordinates__brush-panel">
        <div class="ds-parallel-coordinates__brush-header">
          <span class="ds-parallel-coordinates__brush-title">
            Accessible 1D Axis Range Filters (Keyboard Alternative to Drag Brushes)
          </span>
          <button
            *ngIf="activeBrushCount > 0"
            type="button"
            (click)="clearAllBrushes()"
            class="ds-parallel-coordinates__brush-reset"
          >
            Reset All Filters
          </button>
        </div>

        <div class="ds-parallel-coordinates__brush-grid">
          <div *ngFor="let dim of activeDimensions" class="ds-parallel-coordinates__brush-card">
            <div class="ds-parallel-coordinates__brush-label">
              {{ dim.label || dim.key }} {{ dim.unit ? '(' + dim.unit + ')' : '' }}
            </div>
            <div class="ds-parallel-coordinates__brush-inputs">
              <input
                type="number"
                [placeholder]="'Min (' + (dimDomains[dim.key]?.rawMin?.toFixed(0) || 0) + ')'"
                [ngModel]="activeBrushes[dim.key]?.min"
                (ngModelChange)="updateBrush(dim.key, 'min', $event)"
                class="ds-parallel-coordinates__brush-input"
              />
              <span class="ds-parallel-coordinates__brush-sep">&ndash;</span>
              <input
                type="number"
                [placeholder]="'Max (' + (dimDomains[dim.key]?.rawMax?.toFixed(0) || 100) + ')'"
                [ngModel]="activeBrushes[dim.key]?.max"
                (ngModelChange)="updateBrush(dim.key, 'max', $event)"
                class="ds-parallel-coordinates__brush-input"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Main SVG Plot Canvas -->
      <div class="ds-parallel-coordinates__svg-wrapper">
        <svg
          width="100%"
          [attr.height]="height"
          [attr.viewBox]="'0 0 ' + plotWidth + ' ' + height"
          class="ds-parallel-coordinates__svg"
          style="display: block; width: 100%; height: auto;"
        >
          <g [attr.transform]="'translate(' + margin.left + ', ' + margin.top + ')'">
            <!-- 1. Filtered-out Background Polylines -->
            <g class="ds-parallel-coordinates__inactive-lines">
              <ng-container *ngFor="let record of data; let idx = index">
                <path
                  *ngIf="!filteredData.includes(record)"
                  [attr.d]="getRecordPath(record)"
                  fill="none"
                  stroke="var(--border-subtle, #e2e8f0)"
                  stroke-width="1"
                  opacity="0.35"
                />
              </ng-container>
            </g>

            <!-- 2. Active Polylines -->
            <g class="ds-parallel-coordinates__active-lines">
              <path
                *ngFor="let record of filteredData; let idx = index"
                class="ds-parallel-coordinates__line"
                [attr.d]="getRecordPath(record)"
                fill="none"
                [attr.stroke]="getRecordColor(record, idx)"
                [attr.stroke-dasharray]="getRecordDash(record, idx)"
                [attr.stroke-width]="selectedRecordId === (record[idKey] || idx) ? 3.5 : (hoveredRecord === record ? 3 : 1.5)"
                [attr.stroke-opacity]="hoveredRecord && hoveredRecord !== record && selectedRecordId !== (record[idKey] || idx) ? 0.2 : (selectedRecordId === (record[idKey] || idx) || hoveredRecord === record ? 1 : 0.7)"
                (pointerenter)="onPointerEnter(record, $event)"
                (pointerleave)="hoveredRecord = null; tooltipPos = null"
                (click)="onRecordClickAction(record, $event)"
              />
            </g>

            <!-- 3. Parallel Vertical Axes -->
            <g *ngFor="let dim of activeDimensions; let i = index" class="ds-parallel-coordinates__axis" [attr.transform]="'translate(' + axisXCoords[i] + ', 0)'">
              <!-- Vertical Spine Line -->
              <line x1="0" y1="0" x2="0" [attr.y2]="innerHeight" />

              <!-- Axis Reorder Controls -->
              <g transform="translate(0, -22)">
                <text
                  *ngIf="i > 0"
                  x="-10"
                  y="0"
                  class="ds-parallel-coordinates__reorder-btn"
                  text-anchor="end"
                  (click)="moveAxis(i, -1)"
                >◀</text>
                <text
                  *ngIf="i < activeDimensions.length - 1"
                  x="10"
                  y="0"
                  class="ds-parallel-coordinates__reorder-btn"
                  text-anchor="start"
                  (click)="moveAxis(i, 1)"
                >▶</text>
              </g>

              <!-- Axis Title -->
              <text y="-8" text-anchor="middle" class="ds-parallel-coordinates__axis-title">
                {{ dim.label || dim.key }}
              </text>

              <!-- Unit Label -->
              <text *ngIf="dim.unit" [attr.y]="innerHeight + 16" text-anchor="middle" class="ds-parallel-coordinates__axis-unit">
                {{ dim.unit }}
              </text>

              <!-- Axis Ticks -->
              <g *ngFor="let pct of [0, 0.25, 0.5, 0.75, 1]" [attr.transform]="'translate(0, ' + (innerHeight - pct * innerHeight) + ')'">
                <line x1="-4" x2="4" stroke="var(--border-strong, #94a3b8)" stroke-width="1" />
                <text x="-7" y="3" text-anchor="end" class="ds-parallel-coordinates__tick-label">
                  {{ getTickLabel(dim.key, pct) }}
                </text>
              </g>

              <!-- Multi-Axis Intersection Chips on Hover -->
              <g *ngIf="hoveredRecord && hoveredRecord[dim.key] != null" [attr.transform]="'translate(0, ' + valToY(hoveredRecord[dim.key], dim.key) + ')'">
                <circle r="4.5" fill="var(--action-solid, #0284c7)" stroke="#ffffff" stroke-width="2" />
                <rect x="8" y="-9" width="48" height="17" rx="3" fill="var(--surface-floating, #0f172a)" opacity="0.9" />
                <text x="12" y="3" font-size="9" font-weight="600" fill="#ffffff">
                  {{ formatVal(hoveredRecord[dim.key], '') }}
                </text>
              </g>
            </g>
          </g>
        </svg>

        <!-- Floating 2D Quad-Flip Non-Occluding Tooltip -->
        <div
          *ngIf="hoveredRecord && tooltipPos"
          class="ds-parallel-coordinates__tooltip"
          [style.left.px]="tooltipPos.clientX > width / 2 ? Math.max(12, tooltipPos.clientX - 260) : Math.min(tooltipPos.clientX + 16, width - 260)"
          [style.top.px]="tooltipPos.clientY > height / 2 ? Math.max(12, tooltipPos.clientY - 160) : Math.min(tooltipPos.clientY + 14, height - 160)"
        >
          <div class="ds-parallel-coordinates__tooltip-title">
            {{ hoveredRecord[labelKey] || hoveredRecord[idKey] || 'Record' }}
          </div>
          <div *ngIf="hoveredRecord[colorKey]" class="ds-parallel-coordinates__tooltip-cluster">
            Classification: <strong>{{ hoveredRecord[colorKey] }}</strong>
          </div>
          <div class="ds-parallel-coordinates__tooltip-grid">
            <ng-container *ngFor="let dim of activeDimensions">
              <span class="ds-parallel-coordinates__tooltip-dim">{{ dim.label || dim.key }}:</span>
              <span class="ds-parallel-coordinates__tooltip-val">
                {{ formatVal(hoveredRecord[dim.key], dim.unit) }}
              </span>
            </ng-container>
          </div>
        </div>
      </div>

      <!-- Accessible Data Table Modal (Alt+F11) -->
      <div dsFocusTrap tabindex="-1" *ngIf="showTableModal" class="ds-parallel-coordinates__modal-backdrop" role="dialog" aria-modal="true" aria-label="Accessible Multivariate Telemetry Matrix">
        <div class="ds-parallel-coordinates__modal-dialog">
          <div class="ds-parallel-coordinates__modal-header">
            <div>
              <div class="ds-parallel-coordinates__modal-title">Accessible Multivariate Telemetry Matrix</div>
              <div class="ds-parallel-coordinates__modal-subtitle">
                Showing {{ filteredData.length }} records across {{ activeDimensions.length }} parallel dimensions
              </div>
            </div>
            <button
              type="button"
              (click)="showTableModal = false"
              class="ds-parallel-coordinates__modal-close"
              aria-label="Close table modal"
            >&times;</button>
          </div>

          <div class="ds-parallel-coordinates__modal-body">
            <table class="ds-parallel-coordinates__table">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Cluster</th>
                  <th *ngFor="let dim of activeDimensions" style="text-align: right">
                    {{ dim.label || dim.key }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let rec of filteredData; let idx = index">
                  <td style="font-weight: 600">{{ rec[labelKey] || rec[idKey] || ('Record ' + (idx + 1)) }}</td>
                  <td>
                    <span class="ds-parallel-coordinates__cluster-badge">{{ rec[colorKey] || 'Nominal' }}</span>
                  </td>
                  <td *ngFor="let dim of activeDimensions" style="text-align: right; font-variant-numeric: tabular-nums">
                    {{ formatVal(rec[dim.key], dim.unit) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="ds-parallel-coordinates__modal-footer">
            <button
              type="button"
              (click)="showTableModal = false"
              class="ds-parallel-coordinates__modal-btn"
            >
              Close (Esc)
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
  styleUrls: ['./parallel-coordinates.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsParallelCoordinatesComponent implements OnInit, AfterViewInit, OnDestroy {
  Math = Math;

  @Input() data: Record<string, any>[] = [];
  @Input() dimensions: ParallelDimension[] = [];
  @Input() variant: ParallelCoordinatesVariant = 'standard';
  @Input() width: number = 860;
  @Input() height: number = 420;
  @Input() title: string = 'Multivariate Process & Quality Telemetry';
  @Input() subtitle: string = '';
  @Input() colorKey: string = 'cluster';
  @Input() idKey: string = 'id';
  @Input() labelKey: string = 'label';
  @Input() smooth: boolean = false;
  @Input() normalized: boolean = false;
  @Input() showBrushControls: boolean = true;
  @Input() showControls: boolean = true;
  @Input() showSearch: boolean = true;

  @Output() recordClick = new EventEmitter<{ record: Record<string, any> }>();

  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;

  activeDimensions: ParallelDimension[] = [];
  isNormalized = false;
  isSmooth = false;
  hoveredRecord: any = null;
  selectedRecordId: string | null = null;
  focusedIndex = -1;
  searchQuery = '';
  isFilterPanelOpen = false;
  showTableModal = false;
  announcement = '';
  tooltipPos: { clientX: number; clientY: number } | null = null;
  activeBrushes: Record<string, { min?: number | null; max?: number | null }> = {};

  margin = { top: 36, right: 48, bottom: 40, left: 48 };

  measuredWidth: number = 0;
  private resizeObserver?: ResizeObserver;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.activeDimensions = [...this.dimensions];
    this.isNormalized = this.normalized || this.variant === 'normalized';
    this.isSmooth = this.smooth || this.variant === 'spline';
  }

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
    return Math.max(300, this.measuredWidth || this.width);
  }

  get densityTier(): VizDensityTier {
    return getVizDensityTier(this.plotWidth);
  }

  get innerWidth(): number {
    return Math.max(100, this.plotWidth - this.margin.left - this.margin.right);
  }

  get innerHeight(): number {
    return Math.max(100, this.height - this.margin.top - this.margin.bottom);
  }

  get filteredData(): Record<string, any>[] {
    const q = this.searchQuery.toLowerCase().trim();
    return this.data.filter(d => {
      if (q) {
        const idVal = String(d[this.idKey] || '').toLowerCase();
        const lblVal = String(d[this.labelKey] || '').toLowerCase();
        const clusterVal = String(d[this.colorKey] || '').toLowerCase();
        if (!idVal.includes(q) && !lblVal.includes(q) && !clusterVal.includes(q)) {
          return false;
        }
      }

      const brushKeys = Object.keys(this.activeBrushes);
      for (let i = 0; i < brushKeys.length; i++) {
        const k = brushKeys[i];
        const brush = this.activeBrushes[k];
        if (brush && (brush.min != null || brush.max != null)) {
          const val = Number(d[k]);
          if (isNaN(val)) return false;
          if (brush.min != null && val < brush.min) return false;
          if (brush.max != null && val > brush.max) return false;
        }
      }

      return true;
    });
  }

  get dimDomains(): Record<string, DimensionDomain> {
    return calculateDimensionDomains(this.data, this.activeDimensions);
  }

  get axisSpacing(): number {
    const count = this.activeDimensions.length;
    return count > 1 ? this.innerWidth / (count - 1) : this.innerWidth / 2;
  }

  get axisXCoords(): number[] {
    return this.activeDimensions.map((_, i) => i * this.axisSpacing);
  }

  get yScales(): Record<string, (v: any) => number> {
    const scales: Record<string, (v: any) => number> = {};
    const domains = this.dimDomains;

    this.activeDimensions.forEach(dim => {
      const dom = domains[dim.key];
      scales[dim.key] = (val: any) => {
        if (!dom || val == null || isNaN(Number(val))) return this.innerHeight / 2;

        if (this.isNormalized) {
          const rMin = dom.rawMin ?? dom.min ?? 0;
          const rMax = dom.rawMax ?? dom.max ?? 100;
          let norm = (Number(val) - rMin) / (rMax - rMin || 1);
          norm = Math.max(0, Math.min(1, norm));
          if (dom.inverted) norm = 1 - norm;
          return this.innerHeight - norm * this.innerHeight;
        }

        const span = dom.span || 1;
        const dMin = dom.min ?? 0;
        let norm = (Number(val) - dMin) / span;
        norm = Math.max(0, Math.min(1, norm));
        if (dom.inverted) norm = 1 - norm;
        return this.innerHeight - norm * this.innerHeight;
      };
    });
    return scales;
  }

  valToY(val: any, key: string): number {
    const scale = this.yScales[key];
    return scale ? scale(val) : this.innerHeight / 2;
  }

  getRecordPath(record: any): string {
    return generateParallelPolylinePath(
      record,
      this.activeDimensions,
      this.axisXCoords,
      this.yScales,
      { smooth: this.isSmooth }
    );
  }

  getRecordColor(record: any, idx: number): string {
    if (record.color) return record.color;
    const cVal = record[this.colorKey];
    if (typeof cVal === 'number') return CLUSTER_COLORS[cVal % CLUSTER_COLORS.length];
    if (typeof cVal === 'string') {
      let hash = 0;
      for (let i = 0; i < cVal.length; i++) hash = cVal.charCodeAt(i) + ((hash << 5) - hash);
      return CLUSTER_COLORS[Math.abs(hash) % CLUSTER_COLORS.length];
    }
    return CLUSTER_COLORS[idx % CLUSTER_COLORS.length];
  }

  getRecordDash(record: any, idx: number): string {
    const cVal = record[this.colorKey];
    if (typeof cVal === 'number') return STROKE_DASH_PATTERNS[cVal % STROKE_DASH_PATTERNS.length];
    if (typeof cVal === 'string') {
      let hash = 0;
      for (let i = 0; i < cVal.length; i++) hash = cVal.charCodeAt(i) + ((hash << 5) - hash);
      return STROKE_DASH_PATTERNS[Math.abs(hash) % STROKE_DASH_PATTERNS.length];
    }
    return 'none';
  }

  getTickLabel(key: string, pct: number): string {
    if (this.isNormalized) return `${(pct * 100).toFixed(0)}%`;
    const dom = this.dimDomains[key];
    if (!dom) return '';
    const rMin = dom.rawMin ?? dom.min ?? 0;
    const rMax = dom.rawMax ?? dom.max ?? 100;
    const rawVal = rMin + pct * (rMax - rMin);
    return rawVal.toLocaleString('en-IN', { maximumFractionDigits: 1 });
  }

  moveAxis(idx: number, direction: number): void {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= this.activeDimensions.length) return;
    const next = [...this.activeDimensions];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    this.activeDimensions = next;
    this.announcement = `Moved axis ${temp.label || temp.key} to position ${targetIdx + 1}`;
  }

  updateBrush(key: string, field: 'min' | 'max', val: any): void {
    const current = this.activeBrushes[key] || { min: this.dimDomains[key]?.rawMin, max: this.dimDomains[key]?.rawMax };
    const num = val === '' || val == null ? null : Number(val);
    this.activeBrushes = {
      ...this.activeBrushes,
      [key]: { ...current, [field]: num }
    };
  }

  clearAllBrushes(): void {
    this.activeBrushes = {};
    this.searchQuery = '';
    this.announcement = 'Cleared all multidimensional brush filters';
  }

  get activeBrushCount(): number {
    return Object.keys(this.activeBrushes).filter(k => this.activeBrushes[k].min != null || this.activeBrushes[k].max != null).length;
  }

  formatVal(val: any, unit: string = ''): string {
    return formatVizValue(val, unit);
  }

  onPointerEnter(record: any, e: PointerEvent): void {
    this.hoveredRecord = record;
    const rect = this.containerRef?.nativeElement?.getBoundingClientRect();
    this.tooltipPos = {
      clientX: e.clientX - (rect?.left || 0),
      clientY: e.clientY - (rect?.top || 0)
    };
  }

  onRecordClickAction(record: any, e: MouseEvent): void {
    this.selectedRecordId = record[this.idKey] || null;
    this.recordClick.emit({ record });
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
      if (this.selectedRecordId) {
        e.preventDefault();
        this.selectedRecordId = null;
        this.hoveredRecord = null;
        return;
      }
    }
    if (this.filteredData.length === 0) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      this.focusedIndex = (this.focusedIndex + 1) % this.filteredData.length;
      const rec = this.filteredData[this.focusedIndex];
      this.hoveredRecord = rec;
      this.announcement = `Record ${rec[this.labelKey] || rec[this.idKey]}, Cluster: ${rec[this.colorKey] || 'Nominal'}`;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      this.focusedIndex = (this.focusedIndex - 1 + this.filteredData.length) % this.filteredData.length;
      const rec = this.filteredData[this.focusedIndex];
      this.hoveredRecord = rec;
      this.announcement = `Record ${rec[this.labelKey] || rec[this.idKey]}, Cluster: ${rec[this.colorKey] || 'Nominal'}`;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (this.focusedIndex >= 0 && this.focusedIndex < this.filteredData.length) {
        const rec = this.filteredData[this.focusedIndex];
        this.selectedRecordId = this.selectedRecordId === rec[this.idKey] ? null : rec[this.idKey];
        this.recordClick.emit({ record: rec });
      }
    }
  }
}
