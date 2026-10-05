import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  getVizDensityTier,
  VizDensityTier,
  GanttTick
} from '../../utils/viz-core.js';

export type GanttVariant = 'basic' | 'progress' | 'dependency' | 'milestone' | 'grouped';
export type GanttZoomLevel = 'day' | 'week' | 'month';
export type GanttTaskStatus = 'nominal' | 'completed' | 'in-progress' | 'warning' | 'critical' | 'overdue' | 'scheduled';

export interface GanttTask {
  id: string;
  name: string;
  startDate?: string | Date | number;
  endDate?: string | Date | number;
  progress?: number;
  status?: GanttTaskStatus;
  group?: string;
  owner?: string;
  isMilestone?: boolean;
  milestoneDate?: string | Date | number;
  dependencies?: string[];
  isCritical?: boolean;
  metadata?: Record<string, any>;
  [key: string]: any;
}


const STATUS_COLORS: Record<string, string> = {
  nominal: '#16a34a',
  completed: '#16a34a',
  'in-progress': '#2563eb',
  warning: '#d97706',
  critical: '#dc2626',
  overdue: '#dc2626',
  scheduled: '#64748b'
};

@Component({
  selector: 'ds-gantt-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #containerRef
      class="ds-gantt-chart ds-gantt-chart--{{ variant }}"
      [style.width]="'100%'"
      role="region"
      [attr.aria-label]="title || 'Gantt schedule chart'"
      tabindex="0"
    >
      <!-- Header & Controls -->
      <div *ngIf="title || subtitle || showControls" class="ds-gantt-chart__header">
        <div *ngIf="title || subtitle">
          <h3 *ngIf="title" class="ds-gantt-chart__title">{{ title }}</h3>
          <p *ngIf="subtitle" class="ds-gantt-chart__subtitle">{{ subtitle }}</p>
        </div>

        <div *ngIf="showControls" class="ds-gantt-chart__controls">
          <!-- Search / Filter -->
          <div *ngIf="showSearch" class="ds-gantt-chart__search-wrap">
            <input
              type="text"
              class="ds-gantt-chart__search-input"
              placeholder="Filter task, owner..."
              [value]="searchQuery"
              (input)="onSearchInput($event)"
            />
            <button
              *ngIf="searchQuery"
              type="button"
              class="ds-gantt-chart__search-clear"
              (click)="searchQuery = ''; cdr.markForCheck()"
            >✕</button>
          </div>

          <!-- Zoom Toggle Pills -->
          <div class="ds-gantt-chart__zoom-group">
            <button
              type="button"
              class="ds-gantt-chart__zoom-btn"
              [ngClass]="{ 'ds-gantt-chart__zoom-btn--active': currentZoom === 'day' }"
              (click)="setZoom('day')"
            >Day</button>
            <button
              type="button"
              class="ds-gantt-chart__zoom-btn"
              [ngClass]="{ 'ds-gantt-chart__zoom-btn--active': currentZoom === 'week' }"
              (click)="setZoom('week')"
            >Week</button>
            <button
              type="button"
              class="ds-gantt-chart__zoom-btn"
              [ngClass]="{ 'ds-gantt-chart__zoom-btn--active': currentZoom === 'month' }"
              (click)="setZoom('month')"
            >Month</button>
          </div>
        </div>
      </div>

      <!-- Body: Split into Left Tasks Table & Right Timeline -->
      <div class="ds-gantt-chart__body" [style.height.px]="height - 80">
        <!-- Left Table -->
        <div
          #tableRef
          class="ds-gantt-chart__table-col"
          [style.width.px]="tableColWidth"
          [style.minWidth.px]="tableColWidth"
          [style.flex]="'0 0 ' + tableColWidth + 'px'"
          (scroll)="handleTableScroll($event)"
        >
          <div class="ds-gantt-chart__table-header">
            <span class="ds-gantt-chart__th-name">Task / Work Order</span>
            <span class="ds-gantt-chart__th-prog">Prog.</span>
          </div>

          <div
            *ngFor="let t of visibleTasks"
            class="ds-gantt-chart__table-row"
            [ngClass]="{
              'ds-gantt-chart__table-row--selected': selectedTaskId === t.id,
              'ds-gantt-chart__table-row--hovered': hoveredTask?.id === t.id
            }"
            (click)="onTaskRowClick(t)"
            (mouseenter)="onTaskHover(t, $event)"
            (mouseleave)="onTaskLeave()"
          >
            <div class="ds-gantt-chart__row-name">
              <span [style.fontWeight]="selectedTaskId === t.id ? '600' : '400'" [style.color]="selectedTaskId === t.id ? '#0284c7' : '#0f172a'">
                {{ t.isMilestone ? '◆ ' : '' }}{{ t.name }}
              </span>
              <span *ngIf="t.owner" class="ds-gantt-chart__row-owner">({{ t.owner }})</span>
            </div>
            <div class="ds-gantt-chart__row-prog" [style.color]="getStatusColor(t.status)">
              {{ t.isMilestone ? '—' : (t[progressKey] ?? 0) + '%' }}
            </div>
          </div>
        </div>

        <!-- Right Timeline -->
        <div
          #timelineRef
          class="ds-gantt-chart__timeline-col"
          (scroll)="handleTimelineScroll($event)"
        >
          <!-- Timeline Header -->
          <div class="ds-gantt-chart__timeline-header" [style.width.px]="timelineContentWidth">
            <div
              *ngFor="let tick of timeTicks"
              class="ds-gantt-chart__tick"
              [ngClass]="{ 'ds-gantt-chart__tick--weekend': tick.isWeekend }"
              [style.position]="'absolute'"
              [style.left.px]="timeToX(tick.time)"
              [style.width.px]="dayColumnWidth * (currentZoom === 'week' ? 7 : currentZoom === 'month' ? 30 : 1)"
            >
              <div class="ds-gantt-chart__tick-primary">{{ tick.label }}</div>
              <div class="ds-gantt-chart__tick-secondary">{{ tick.secondary }}</div>
            </div>
          </div>

          <!-- Timeline SVG Plot -->
          <div class="ds-gantt-chart__timeline-canvas" [style.width.px]="timelineContentWidth" [style.height.px]="visibleTasks.length * rowHeight">
            <svg
              [attr.width]="timelineContentWidth"
              [attr.height]="visibleTasks.length * rowHeight"
              class="ds-gantt-chart__timeline-svg"
            >
              <defs>
                <marker id="gantt-arrow-crit" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#dc2626" />
                </marker>
                <marker id="gantt-arrow-norm" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748b" />
                </marker>
                <pattern id="gantt-hatch-overdue" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#dc2626" stroke-width="2" opacity="0.35" />
                </pattern>
                <pattern id="gantt-hatch-warn" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#d97706" stroke-width="2" opacity="0.35" />
                </pattern>
              </defs>

              <!-- Grid Lines -->
              <g *ngFor="let tick of timeTicks">
                <line
                  [attr.x1]="timeToX(tick.time)"
                  y1="0"
                  [attr.x2]="timeToX(tick.time)"
                  [attr.y2]="visibleTasks.length * rowHeight"
                  [attr.stroke]="tick.isWeekend ? '#f1f5f9' : '#f8fafc'"
                  stroke-width="1"
                />
              </g>

              <!-- Today Line -->
              <g *ngIf="showTodayLine && todayX > 0 && todayX < timelineContentWidth" [attr.transform]="'translate(' + todayX + ', 0)'">
                <line
                  y1="0"
                  [attr.y2]="visibleTasks.length * rowHeight"
                  stroke="#0284c7"
                  stroke-width="2"
                  stroke-dasharray="4 2"
                />
                <polygon points="-4,0 4,0 0,6" fill="#0284c7" />
              </g>

              <!-- Dependency Paths -->
              <g *ngIf="showDependencies || variant === 'dependency'">
                <path
                  *ngFor="let d of dependencyLinks"
                  [attr.d]="d.path"
                  fill="none"
                  [attr.stroke]="d.isCritical ? '#dc2626' : '#94a3b8'"
                  [attr.stroke-width]="d.isCritical ? 2 : 1.5"
                  [attr.marker-end]="d.isCritical ? 'url(#gantt-arrow-crit)' : 'url(#gantt-arrow-norm)'"
                />
              </g>

              <!-- Task Bars & Milestones -->
              <g *ngFor="let t of visibleTasks; let idx = index" class="ds-gantt-chart__task-group">
                <!-- Row background highlight -->
                <rect
                  x="0"
                  [attr.y]="idx * rowHeight"
                  [attr.width]="timelineContentWidth"
                  [attr.height]="rowHeight"
                  [attr.fill]="selectedTaskId === t.id ? '#eff6ff' : hoveredTask?.id === t.id ? '#f8fafc' : 'transparent'"
                  opacity="0.6"
                />

                <!-- Milestone Diamond -->
                <g
                  *ngIf="t.isMilestone"
                  [attr.transform]="'translate(' + timeToX(t.milestoneDate || t[startKey]) + ', ' + (idx * rowHeight + rowHeight / 2) + ')'"
                  class="ds-gantt-chart__milestone"
                  (click)="onTaskClick(t)"
                  (mouseenter)="onTaskHover(t, $event)"
                  (mouseleave)="onTaskLeave()"
                >
                  <polygon
                    points="0,-8 8,0 0,8 -8,0"
                    [attr.fill]="getStatusColor(t.status)"
                    stroke="#ffffff"
                    stroke-width="2"
                    [attr.filter]="selectedTaskId === t.id ? 'drop-shadow(0 0 4px #0284c7)' : null"
                  />
                  <text
                    x="12"
                    y="3.5"
                    font-size="10"
                    font-weight="600"
                    fill="var(--text-primary, #0f172a)"
                    stroke="var(--surface-card, #ffffff)"
                    stroke-width="3"
                    stroke-linejoin="round"
                    paint-order="stroke fill"
                  >
                    {{ t.name }}
                  </text>
                </g>

                <!-- Standard Task Bar -->
                <g
                  *ngIf="!t.isMilestone"
                  class="ds-gantt-chart__task-bar-group"
                  (click)="onTaskClick(t)"
                  (mouseenter)="onTaskHover(t, $event)"
                  (mouseleave)="onTaskLeave()"
                >
                  <!-- Background Track / Hatching -->
                  <rect
                    class="ds-gantt-chart__task-bar"
                    [attr.x]="timeToX(t[startKey])"
                    [attr.y]="idx * rowHeight + (rowHeight - taskBarHeight) / 2"
                    [attr.width]="getBarWidth(t)"
                    [attr.height]="taskBarHeight"
                    [attr.fill]="t.status === 'overdue' ? 'url(#gantt-hatch-overdue)' : t.status === 'warning' ? 'url(#gantt-hatch-warn)' : '#e2e8f0'"
                    [attr.stroke]="selectedTaskId === t.id ? '#0284c7' : getStatusColor(t.status)"
                    [attr.stroke-width]="selectedTaskId === t.id ? 2 : 1"
                    rx="3"
                  />

                  <!-- Progress Bar Overlay -->
                  <rect
                    *ngIf="showProgress && (t[progressKey] ?? 0) > 0"
                    [attr.x]="timeToX(t[startKey])"
                    [attr.y]="idx * rowHeight + (rowHeight - taskBarHeight) / 2"
                    [attr.width]="getBarWidth(t) * ((t[progressKey] ?? 0) / 100)"
                    [attr.height]="taskBarHeight"
                    [attr.fill]="getStatusColor(t.status)"
                    opacity="0.85"
                    rx="3"
                    pointer-events="none"
                  />

                  <!-- Inside Label (if barWidth >= 75px) -->
                  <text
                    *ngIf="getBarWidth(t) >= 75"
                    [attr.x]="timeToX(t[startKey]) + 8"
                    [attr.y]="idx * rowHeight + rowHeight / 2 + 3.5"
                    font-size="10"
                    font-weight="600"
                    [attr.fill]="(t[progressKey] ?? 0) > 55 ? '#ffffff' : '#0f172a'"
                    pointer-events="none"
                  >
                    {{ getInsideLabel(t.name, getBarWidth(t)) }}
                  </text>

                  <!-- Outside Label (if barWidth < 75px) with white halo -->
                  <text
                    *ngIf="getBarWidth(t) < 75"
                    [attr.x]="timeToEndX(t[endKey] || t[startKey]) + 8"
                    [attr.y]="idx * rowHeight + rowHeight / 2 + 3.5"
                    font-size="10"
                    font-weight="600"
                    fill="var(--text-primary, #0f172a)"
                    stroke="var(--surface-card, #ffffff)"
                    stroke-width="3"
                    stroke-linejoin="round"
                    paint-order="stroke fill"
                    pointer-events="none"
                  >
                    {{ t.name }}
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>

      <!-- Floating Tooltip -->
      <div
        *ngIf="hoveredTask"
        class="ds-gantt-chart__tooltip"
        [style.left.px]="tooltipPos.x + 14"
        [style.top.px]="tooltipPos.y + 14"
      >
        <div class="ds-gantt-chart__tooltip-title">{{ hoveredTask.name }}</div>
        <div class="ds-gantt-chart__tooltip-grid">
          <ng-container *ngIf="hoveredTask[groupKey]">
            <span class="ds-gantt-chart__tooltip-lbl">Group / Phase:</span>
            <span class="ds-gantt-chart__tooltip-val">{{ hoveredTask[groupKey] }}</span>
          </ng-container>

          <ng-container *ngIf="hoveredTask.owner">
            <span class="ds-gantt-chart__tooltip-lbl">Assignee:</span>
            <span class="ds-gantt-chart__tooltip-val">{{ hoveredTask.owner }}</span>
          </ng-container>

          <ng-container *ngIf="hoveredTask.isMilestone">
            <span class="ds-gantt-chart__tooltip-lbl" style="color: #38bdf8;">Milestone Date:</span>
            <span class="ds-gantt-chart__tooltip-val" style="color: #38bdf8;">{{ formatDate(hoveredTask.milestoneDate || hoveredTask[startKey]) }}</span>
          </ng-container>

          <ng-container *ngIf="!hoveredTask.isMilestone">
            <span class="ds-gantt-chart__tooltip-lbl">Start:</span>
            <span class="ds-gantt-chart__tooltip-val">{{ formatDate(hoveredTask[startKey]) }}</span>

            <span class="ds-gantt-chart__tooltip-lbl">End:</span>
            <span class="ds-gantt-chart__tooltip-val">{{ formatDate(hoveredTask[endKey]) }}</span>

            <span class="ds-gantt-chart__tooltip-lbl">Progress:</span>
            <span class="ds-gantt-chart__tooltip-val" style="color: #38bdf8;">{{ hoveredTask[progressKey] ?? 0 }}%</span>
          </ng-container>

          <ng-container *ngIf="hoveredTask[dependenciesKey] && hoveredTask[dependenciesKey].length > 0">
            <span class="ds-gantt-chart__tooltip-lbl">Predecessors:</span>
            <span class="ds-gantt-chart__tooltip-val">{{ hoveredTask[dependenciesKey].join(', ') }}</span>
          </ng-container>
        </div>

        <div *ngIf="hoveredTask.status" class="ds-gantt-chart__tooltip-status" [style.color]="getStatusColor(hoveredTask.status)">
          ● Status: {{ (hoveredTask.status || '').toUpperCase() }}
        </div>
      </div>

      <!-- Accessible Tabular Mirror -->
      <details
        *ngIf="showDataTable && tasks && tasks.length > 0"
        class="ds-chart-table-details"
      >
        <summary class="ds-chart-table-summary">
          View Accessible Schedule Table
        </summary>
        <div class="ds-chart-table-wrap">
          <table class="ds-chart-table">
            <caption style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);">
              {{ title ? title + ' Data Table' : 'Gantt Chart Schedule Table' }}
            </caption>
            <thead>
              <tr>
                <th scope="col">Task Name</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Progress</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let task of tasks">
                <th scope="row">
                  {{ task.name }} ({{ task.id }})
                </th>
                <td>
                  {{ task[startKey] ? formatDate(task[startKey]) : '—' }}
                </td>
                <td>
                  {{ task[endKey] ? formatDate(task[endKey]) : '—' }}
                </td>
                <td>
                  {{ task[progressKey] != null ? task[progressKey] + '%' : '—' }}
                </td>
                <td [style.color]="getStatusColor(task.status)">
                  {{ task.status || 'nominal' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </div>
  `,
  styleUrls: ['./gantt-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsGanttChartComponent implements OnInit, AfterViewInit, OnDestroy {
  Math = Math;

  @Input() tasks: GanttTask[] = [];
  @Input() variant: GanttVariant = 'dependency';
  @Input() width: number = 900;
  @Input() height: number = 460;
  @Input() title: string = 'Project & Maintenance Schedule Gantt Chart';
  @Input() subtitle: string = 'Suryodaya Autocomp Ltd · Chakan Plant (PL-04)';
  @Input() startKey: string = 'startDate';
  @Input() endKey: string = 'endDate';
  @Input() progressKey: string = 'progress';
  @Input() dependenciesKey: string = 'dependencies';
  @Input() groupKey: string = 'group';
  @Input() showDependencies: boolean = true;
  @Input() showDataTable: boolean = true;
  @Input() showProgress: boolean = true;
  @Input() showTodayLine: boolean = true;
  @Input() todayDate: Date | string = new Date('2026-09-09');
  @Input() showControls: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() defaultZoom: GanttZoomLevel = 'day';

  @Output() taskClick = new EventEmitter<{ task: GanttTask }>();

  @ViewChild('containerRef') containerRef?: ElementRef<HTMLDivElement>;
  @ViewChild('tableRef') tableRef?: ElementRef<HTMLDivElement>;
  @ViewChild('timelineRef') timelineRef?: ElementRef<HTMLDivElement>;

  currentZoom: GanttZoomLevel = 'day';
  searchQuery: string = '';
  selectedTaskId: string | null = null;
  hoveredTask: GanttTask | null = null;
  tooltipPos = { x: 0, y: 0 };

  rowHeight = 36;
  headerHeight = 44;
  taskBarHeight = 20;

  measuredWidth: number = 0;
  private resizeObserver?: ResizeObserver;

  constructor(public cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.currentZoom = this.defaultZoom;
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

  get tableColWidth(): number {
    return (this.densityTier === 'compact' || this.densityTier === 'mobile') ? 180 : 280;
  }

  get filteredTasks(): GanttTask[] {
    if (!this.searchQuery.trim()) return this.tasks || [];
    const q = this.searchQuery.toLowerCase().trim();
    return (this.tasks || []).filter(t =>
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.id && t.id.toLowerCase().includes(q)) ||
      (t.owner && t.owner.toLowerCase().includes(q)) ||
      (t[this.groupKey] && String(t[this.groupKey]).toLowerCase().includes(q))
    );
  }

  get visibleTasks(): GanttTask[] {
    return this.filteredTasks;
  }

  parseTaskDate(val: any, isEnd: boolean = false): number {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val instanceof Date) return val.getTime();
    const str = String(val).trim();
    const d = new Date(str);
    if (isNaN(d.getTime())) return 0;
    if (isEnd && /^\d{4}-\d{2}-\d{2}$/.test(str)) {
      return d.getTime() + 86400000;
    }
    return d.getTime();
  }

  get domain(): { minDate: Date; maxDate: Date; durationMs: number; totalDays: number } {
    const tasks = this.tasks || [];
    if (tasks.length === 0) {
      const now = new Date('2026-09-01').getTime();
      return {
        minDate: new Date(now),
        maxDate: new Date(now + 30 * 86400000),
        durationMs: 30 * 86400000,
        totalDays: 30
      };
    }

    let minTime = Infinity;
    let maxTime = -Infinity;

    tasks.forEach(t => {
      const s = t[this.startKey] ? this.parseTaskDate(t[this.startKey], false) : null;
      const e = t[this.endKey] ? this.parseTaskDate(t[this.endKey], true) : (t.milestoneDate ? this.parseTaskDate(t.milestoneDate, false) : s);

      if (s != null && !isNaN(s) && s < minTime) minTime = s;
      if (e != null && !isNaN(e) && e > maxTime) maxTime = e;
    });

    if (minTime === Infinity || maxTime === -Infinity) {
      const now = new Date('2026-09-01').getTime();
      return { minDate: new Date(now), maxDate: new Date(now + 30 * 86400000), durationMs: 30 * 86400000, totalDays: 30 };
    }

    const padMs = 2 * 86400000;
    const pMin = new Date(minTime - padMs);
    const pMax = new Date(maxTime + padMs);
    const dur = pMax.getTime() - pMin.getTime() || 86400000;

    return {
      minDate: pMin,
      maxDate: pMax,
      durationMs: dur,
      totalDays: Math.ceil(dur / 86400000)
    };
  }

  get dayColumnWidth(): number {
    return this.currentZoom === 'day' ? 36 : this.currentZoom === 'week' ? 14 : 4;
  }

  get timelineContentWidth(): number {
    return Math.max(this.plotWidth - this.tableColWidth, this.domain.totalDays * this.dayColumnWidth);
  }

  get timeTicks(): GanttTick[] {
    const { minDate, maxDate } = this.domain;
    const startMs = minDate.getTime();
    const endMs = maxDate.getTime();
    if (isNaN(startMs) || isNaN(endMs) || startMs > endMs) return [];

    const ticks: GanttTick[] = [];
    const curr = new Date(startMs);
    curr.setHours(0, 0, 0, 0);
    let safetyCount = 0;
    const maxTicks = 500;

    while (curr.getTime() <= endMs && safetyCount++ < maxTicks) {
      const time = curr.getTime();
      if (this.currentZoom === 'day') {
        const label = curr.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        const weekday = curr.toLocaleDateString('en-IN', { weekday: 'narrow' });
        const isWeekend = curr.getDay() === 0 || curr.getDay() === 6;
        ticks.push({ time, date: new Date(curr), label, secondary: weekday, isWeekend });
        curr.setDate(curr.getDate() + 1);
      } else if (this.currentZoom === 'week') {
        const label = `Wk ${Math.ceil(curr.getDate() / 7)} (${curr.toLocaleDateString('en-IN', { month: 'short' })})`;
        const secondary = curr.toLocaleDateString('en-IN', { day: '2-digit' });
        ticks.push({ time, date: new Date(curr), label, secondary, isWeekend: false });
        curr.setDate(curr.getDate() + 7);
      } else {
        const label = curr.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        ticks.push({ time, date: new Date(curr), label, secondary: '', isWeekend: false });
        curr.setMonth(curr.getMonth() + 1);
      }
    }
    return ticks;
  }

  timeToX(dateVal: any): number {
    if (!dateVal) return 0;
    const t = this.parseTaskDate(dateVal, false);
    const { minDate, durationMs } = this.domain;
    const ratio = (t - minDate.getTime()) / durationMs;
    return Math.max(0, ratio * this.timelineContentWidth);
  }

  timeToEndX(dateVal: any): number {
    if (!dateVal) return 0;
    const t = this.parseTaskDate(dateVal, true);
    const { minDate, durationMs } = this.domain;
    const ratio = (t - minDate.getTime()) / durationMs;
    return Math.max(0, ratio * this.timelineContentWidth);
  }

  getBarWidth(t: GanttTask): number {
    const sDate = t[this.startKey];
    const eDate = t[this.endKey];
    const xStart = this.timeToX(sDate);
    const xEnd = this.timeToEndX(eDate || sDate);
    return Math.max(14, xEnd - xStart);
  }

  getInsideLabel(name: string, barWidth: number): string {
    const maxChars = Math.max(1, Math.floor((barWidth - 14) / 6.5));
    return name.length > maxChars ? `${name.slice(0, Math.max(1, maxChars - 1))}…` : name;
  }

  get todayX(): number {
    return this.timeToX(this.todayDate);
  }

  getTaskBounds(t: GanttTask): { startX: number; endX: number } {
    if (t.isMilestone) {
      const mx = this.timeToX(t.milestoneDate || t[this.startKey]);
      return { startX: mx - 8, endX: mx + 8 };
    }
    const s = this.timeToX(t[this.startKey]);
    const e = this.timeToEndX(t[this.endKey] || t[this.startKey]);
    return { startX: Math.min(s, e), endX: Math.max(s, e) };
  }

  get dependencyLinks(): Array<{ id: string; path: string; isCritical: boolean }> {
    if (!this.showDependencies && this.variant !== 'dependency') return [];
    const links: Array<{ id: string; path: string; isCritical: boolean }> = [];

    const taskMap = new Map<string, { task: GanttTask; index: number }>();
    this.visibleTasks.forEach((t, i) => taskMap.set(t.id, { task: t, index: i }));

    this.visibleTasks.forEach((targetTask, targetIdx) => {
      const preds = targetTask[this.dependenciesKey] || [];
      preds.forEach((predId: string) => {
        const sourceEntry = taskMap.get(predId);
        if (sourceEntry) {
          const sourceTask = sourceEntry.task;
          const sourceIdx = sourceEntry.index;

          let sourceX: number;
          if (sourceTask.isMilestone) {
            sourceX = this.timeToX(sourceTask.milestoneDate || sourceTask[this.startKey]) + 8;
          } else {
            sourceX = this.timeToEndX(sourceTask[this.endKey] || sourceTask[this.startKey]);
          }
          const sourceY = sourceIdx * this.rowHeight + this.rowHeight / 2;

          let targetX: number;
          if (targetTask.isMilestone) {
            targetX = this.timeToX(targetTask.milestoneDate || targetTask[this.startKey]) - 8;
          } else {
            targetX = this.timeToX(targetTask[this.startKey]);
          }
          const targetY = targetIdx * this.rowHeight + this.rowHeight / 2;

          const minRow = Math.min(sourceIdx, targetIdx);
          const maxRow = Math.max(sourceIdx, targetIdx);
          const dirY = targetY > sourceY ? 1 : -1;
          const offset = 14;
          const radius = 4;
          let path = '';

          // Check max right extent of all tasks in the intermediate row span
          let maxIntermediateEndX = sourceX;
          for (let k = minRow; k <= maxRow; k++) {
            const b = this.getTaskBounds(this.visibleTasks[k]);
            if (b.endX > maxIntermediateEndX) {
              maxIntermediateEndX = b.endX;
            }
          }

          if (Math.abs(targetY - sourceY) < 4) {
            // Same horizontal line
            path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
          } else if (targetX >= sourceX + offset * 1.5) {
            const midX = (sourceX + targetX) / 2;
            const isObstructed = this.visibleTasks.slice(minRow + 1, maxRow).some(t => {
              const b = this.getTaskBounds(t);
              return midX >= b.startX - 8 && midX <= b.endX + 8;
            });

            if (!isObstructed) {
              const r = Math.min(radius, Math.abs(midX - sourceX) / 2, Math.abs(targetY - sourceY) / 2);
              path = `M ${sourceX} ${sourceY} ` +
                     `H ${midX - r} ` +
                     `Q ${midX} ${sourceY} ${midX} ${sourceY + dirY * r} ` +
                     `V ${targetY - dirY * r} ` +
                     `Q ${midX} ${targetY} ${midX + r} ${targetY} ` +
                     `H ${targetX}`;
            } else {
              // Obstructed forward dependency: route along the inter-row gutter immediately before target
              const gutterY = targetY - dirY * (this.rowHeight / 2);
              const rightX = sourceX + offset;
              const leftX = targetX - offset;
              const r = Math.min(radius, offset / 2, this.rowHeight / 4);

              if (leftX >= rightX) {
                path = `M ${sourceX} ${sourceY} ` +
                       `H ${rightX - r} ` +
                       `Q ${rightX} ${sourceY} ${rightX} ${sourceY + dirY * r} ` +
                       `V ${gutterY - dirY * r} ` +
                       `Q ${rightX} ${gutterY} ${rightX + r} ${gutterY} ` +
                       `H ${leftX - r} ` +
                       `Q ${leftX} ${gutterY} ${leftX} ${gutterY + dirY * r} ` +
                       `V ${targetY - dirY * r} ` +
                       `Q ${leftX} ${targetY} ${leftX + r} ${targetY} ` +
                       `H ${targetX}`;
              } else {
                path = `M ${sourceX} ${sourceY} ` +
                       `H ${rightX - r} ` +
                       `Q ${rightX} ${sourceY} ${rightX} ${sourceY + dirY * r} ` +
                       `V ${gutterY - dirY * r} ` +
                       `Q ${rightX} ${gutterY} ${rightX - r} ${gutterY} ` +
                       `H ${leftX + r} ` +
                       `Q ${leftX} ${gutterY} ${leftX} ${gutterY + dirY * r} ` +
                       `V ${targetY - dirY * r} ` +
                       `Q ${leftX} ${targetY} ${leftX + r} ${targetY} ` +
                       `H ${targetX}`;
              }
            }
          } else {
            // Backward or overlapping dependency (target starts before or near source end)
            // Route around the right side of all intermediate tasks, then along the target inter-row gutter
            const rightX = maxIntermediateEndX + offset;
            const leftX = targetX - offset;
            const gutterY = targetY - dirY * (this.rowHeight / 2);
            const r = Math.min(radius, offset / 2, this.rowHeight / 4);

            path = `M ${sourceX} ${sourceY} ` +
                   `H ${rightX - r} ` +
                   `Q ${rightX} ${sourceY} ${rightX} ${sourceY + dirY * r} ` +
                   `V ${gutterY - dirY * r} ` +
                   `Q ${rightX} ${gutterY} ${rightX - r} ${gutterY} ` +
                   `H ${leftX + r} ` +
                   `Q ${leftX} ${gutterY} ${leftX} ${gutterY + dirY * r} ` +
                   `V ${targetY - dirY * r} ` +
                   `Q ${leftX} ${targetY} ${leftX + r} ${targetY} ` +
                   `H ${targetX}`;
          }

          links.push({
            id: `${predId}->${targetTask.id}`,
            path,
            isCritical: !!(targetTask.isCritical || sourceTask.isCritical)
          });
        }
      });
    });

    return links;
  }

  getStatusColor(status?: string): string {
    return STATUS_COLORS[status || 'nominal'] || STATUS_COLORS['nominal'];
  }

  setZoom(zoom: GanttZoomLevel): void {
    this.currentZoom = zoom;
    this.cdr.markForCheck();
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.cdr.markForCheck();
  }

  onTaskRowClick(task: GanttTask): void {
    this.selectedTaskId = task.id;
    this.taskClick.emit({ task });
  }

  onTaskClick(task: GanttTask): void {
    this.selectedTaskId = task.id;
    this.taskClick.emit({ task });
  }

  onTaskHover(task: GanttTask, event: MouseEvent): void {
    this.hoveredTask = task;
    this.tooltipPos = { x: event.clientX, y: event.clientY };
    this.cdr.markForCheck();
  }

  onTaskLeave(): void {
    this.hoveredTask = null;
    this.cdr.markForCheck();
  }

  handleTableScroll(e: Event): void {
    const el = e.target as HTMLElement;
    if (this.timelineRef?.nativeElement && el === this.tableRef?.nativeElement) {
      this.timelineRef.nativeElement.scrollTop = el.scrollTop;
    }
  }

  handleTimelineScroll(e: Event): void {
    const el = e.target as HTMLElement;
    if (this.tableRef?.nativeElement && el === this.timelineRef?.nativeElement) {
      this.tableRef.nativeElement.scrollTop = el.scrollTop;
    }
  }

  formatDate(dateVal: any): string {
    if (!dateVal) return '—';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString('en-IN');
  }
}
