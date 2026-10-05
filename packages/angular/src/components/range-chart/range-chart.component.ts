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
  formatVizValue,
  getVizDensityTier,
  VizDensityTier
} from '../../utils/viz-core.js';

export type RangeChartVariant = 'interval-bar' | 'dumbbell' | 'error-bar' | 'range-area';
export type RangeChartOrientation = 'horizontal' | 'vertical';
export type IntervalSemantics = 'min-max' | 'ci-95' | 'tolerance-band' | 'before-after' | 'target-actual' | 'custom';

export interface RangeDataItem {
  id?: string;
  label?: string;
  lower?: number;
  upper?: number;
  center?: number;
  target?: number;
  status?: 'nominal' | 'warning' | 'critical' | 'info' | 'neutral';
  intervalSemantics?: IntervalSemantics | string;
  isImproved?: boolean;
  dashed?: boolean;
  metadata?: Record<string, any>;
  [key: string]: any;
}

let nextRangeId = 0;

const STATUS_COLORS: Record<string, string> = {
  nominal: '#16a34a',
  warning: '#d97706',
  critical: '#dc2626',
  info: '#0284c7',
  neutral: '#64748b'
};

const DUMBBELL_ENDPOINT_COLORS = {
  before: '#64748b',
  afterImproved: '#16a34a',
  afterRegressed: '#dc2626'
};

@Component({
  selector: 'ds-range-chart',
  standalone: true,
  imports: [DsFocusTrapDirective, CommonModule],
  template: `
    <div
      #containerRef
      class="ds-range-chart ds-range-chart--{{ variant }}"
      [ngClass]="{ 'ds-range-chart--loading': loading, 'ds-range-chart--empty': !loading && (!data || data.length === 0) }"
      [style.width]="'100%'"
      role="region"
      [attr.aria-label]="ariaLabel || 'Bounded Interval Range Chart: ' + title + '. ' + sortedData.length + ' items. Use Arrow keys to navigate, Alt+F11 for data table.'"
      tabindex="0"
      (keydown)="onKeyDown($event)"
      (pointerleave)="activeIndex = -1"
    >
      <!-- Skeleton Loading -->
      <ng-container *ngIf="loading">
        <div class="ds-range-chart__skeleton-header"></div>
        <div class="ds-range-chart__skeleton-bars" [style.height.px]="height - 60"></div>
      </ng-container>

      <!-- Empty State -->
      <ng-container *ngIf="!loading && (!data || data.length === 0)">
        <div class="ds-range-chart__empty-msg" [style.height.px]="height - 60">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 8px; color: var(--text-secondary, #64748b)">
            <line x1="4" y1="9" x2="20" y2="9" />
            <line x1="4" y1="15" x2="20" y2="15" />
            <circle cx="8" cy="9" r="2" />
            <circle cx="16" cy="15" r="2" />
          </svg>
          <p style="margin: 0; font-size: 13px; color: var(--text-secondary, #64748b)">{{ emptyMessage }}</p>
        </div>
      </ng-container>

      <!-- Main Chart -->
      <ng-container *ngIf="!loading && data && data.length > 0">
        <!-- Header & Controls Toolbar -->
        <div class="ds-range-chart__header">
          <div>
            <div *ngIf="title" class="ds-range-chart__title">{{ title }}</div>
            <div *ngIf="subtitle" class="ds-range-chart__subtitle">{{ subtitle }}</div>
          </div>

          <div class="ds-range-chart__controls">
            <!-- Search Input -->
            <div *ngIf="showControls && showSearch" class="ds-range-chart__search-box">
              <input
                type="text"
                placeholder="Filter intervals..."
                [value]="searchQuery"
                (input)="onSearchInput($event)"
                class="ds-range-chart__search-input"
              />
              <button
                *ngIf="searchQuery"
                type="button"
                (click)="searchQuery = ''"
                class="ds-range-chart__search-clear"
              >✕</button>
            </div>

            <!-- Sort Selector -->
            <select
              *ngIf="showControls && variant !== 'range-area'"
              [value]="sortBy"
              (change)="onSortChange($event)"
              class="ds-range-chart__sort-select"
            >
              <option value="default">Default Order</option>
              <option value="spread-desc">Spread (High → Low)</option>
              <option value="spread-asc">Spread (Low → High)</option>
              <option value="lower-asc">Lower Bound (Ascending)</option>
              <option value="upper-desc">Upper Bound (Descending)</option>
              <option value="label-asc">Category Name (A → Z)</option>
            </select>

            <!-- Table Modal Toggle -->
            <button
              type="button"
              class="ds-range-chart__table-btn"
              [class.ds-range-chart__table-btn--active]="showTableModal"
              (click)="showTableModal = !showTableModal"
              title="Toggle Accessible Intervals Table (Alt+F11)"
              aria-label="Toggle Accessible Intervals Table"
            >
              Table (Alt+F11)
            </button>
          </div>
        </div>

        <!-- SVG Canvas Area -->
        <svg
          width="100%"
          [attr.height]="svgHeight"
          [attr.viewBox]="'0 0 ' + svgWidth + ' ' + svgHeight"
          class="ds-range-chart__svg"
          aria-hidden="true"
          style="display: block; width: 100%; height: auto;"
          (click)="activeIndex = -1"
        >
          <defs>
            <pattern [attr.id]="chartId + '-rc-hatch-warning'" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#d97706" stroke-width="2" opacity="0.4" />
            </pattern>
            <pattern [attr.id]="chartId + '-rc-hatch-critical'" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#dc2626" stroke-width="2" opacity="0.45" />
            </pattern>
          </defs>

          <g [attr.transform]="'translate(' + margin.left + ', ' + margin.top + ')'">
            <!-- Continuous Axis Spines and Baseline -->
            <!-- Vertical Y-axis Spine Line -->
            <line
              x1="0"
              y1="0"
              x2="0"
              [attr.y2]="innerHeight"
              stroke="var(--border-strong, #cbd5e1)"
              stroke-width="1.5"
            />

            <!-- Horizontal X-axis Baseline -->
            <line
              x1="0"
              [attr.y1]="innerHeight"
              [attr.x2]="innerWidth"
              [attr.y2]="innerHeight"
              stroke="var(--border-strong, #cbd5e1)"
              stroke-width="1.5"
            />

            <!-- Quantitative Grid Lines & Labels -->
            <g *ngIf="orientation === 'horizontal'" class="grid-quantitative-x">
              <g *ngFor="let val of quantTicks; let idx = index" [attr.transform]="'translate(' + valToX(val) + ', 0)'">
                <line y1="0" [attr.y2]="innerHeight" stroke="var(--border-subtle, #f1f5f9)" stroke-width="1" />
                <line [attr.y1]="innerHeight" [attr.y2]="innerHeight + 5" stroke="var(--border-strong, #cbd5e1)" stroke-width="1.5" />
                <text
                  [attr.y]="innerHeight + 18"
                  font-size="10"
                  fill="var(--text-secondary, #64748b)"
                  [attr.text-anchor]="idx === 0 ? 'start' : idx === quantTicks.length - 1 ? 'end' : 'middle'"
                  style="font-variant-numeric: tabular-nums"
                >
                  {{ formatVal(val) }}
                </text>
              </g>
            </g>

            <g *ngIf="orientation === 'vertical'" class="grid-quantitative-y">
              <g *ngFor="let val of quantTicks; let idx = index" [attr.transform]="'translate(0, ' + valToY(val) + ')'">
                <line x1="0" [attr.x2]="innerWidth" stroke="var(--border-subtle, #f1f5f9)" stroke-width="1" />
                <line x1="-5" x2="0" stroke="var(--border-strong, #cbd5e1)" stroke-width="1.5" />
                <text
                  x="-8"
                  y="3"
                  font-size="10"
                  fill="var(--text-secondary, #64748b)"
                  text-anchor="end"
                  style="font-variant-numeric: tabular-nums"
                >
                  {{ formatVal(val) }}
                </text>
              </g>
            </g>

            <!-- Target Baseline Reference Line & Fully Contained Label -->
            <g *ngIf="targetLine != null" class="target-baseline">
              <g *ngIf="orientation === 'horizontal'" [attr.transform]="'translate(' + valToX(targetLineVal) + ', 0)'">
                <line y1="0" [attr.y2]="innerHeight" stroke="var(--status-critical, #dc2626)" stroke-width="1.5" stroke-dasharray="4,3" />
                <text
                  x="0"
                  y="-7"
                  font-size="10"
                  font-weight="600"
                  fill="var(--status-critical, #dc2626)"
                  text-anchor="middle"
                  class="ds-range-chart__label"
                >
                  {{ targetLineLabel }}
                </text>
              </g>
              <g *ngIf="orientation === 'vertical'" [attr.transform]="'translate(0, ' + valToY(targetLineVal) + ')'">
                <line x1="0" [attr.x2]="innerWidth" stroke="var(--status-critical, #dc2626)" stroke-width="1.5" stroke-dasharray="4,3" />
                <text
                  [attr.x]="innerWidth - 6"
                  y="-5"
                  font-size="10"
                  font-weight="600"
                  fill="var(--status-critical, #dc2626)"
                  text-anchor="end"
                  class="ds-range-chart__label"
                >
                  {{ targetLineLabel }}
                </text>
              </g>
            </g>

            <!-- Range Area Variant -->
            <g *ngIf="variant === 'range-area' && rangeAreaPaths" class="range-area-layer">
              <path
                [attr.d]="rangeAreaPaths.bandPath"
                fill="var(--action-subtle, #e0f2fe)"
                opacity="0.75"
                stroke="var(--action-solid, #38bdf8)"
                stroke-width="1"
              />
              <path
                [attr.d]="rangeAreaPaths.centerLinePath"
                fill="none"
                stroke="var(--action-solid, #0284c7)"
                stroke-width="2.5"
              />
              <circle
                *ngFor="let pt of rangeAreaPaths.centerCoords; let i = index"
                [attr.cx]="pt[0]"
                [attr.cy]="pt[1]"
                [attr.r]="activeIndex === i ? 6 : 4"
                fill="var(--action-solid, #0284c7)"
                stroke="var(--surface-card, #ffffff)"
                stroke-width="2"
                style="cursor: pointer; transition: all 0.15s ease"
                (pointerenter)="onItemPointerEnter(sortedData[i], i, $event)"
              />
            </g>

            <!-- Discrete Horizontal Intervals -->
            <g *ngIf="variant !== 'range-area' && orientation === 'horizontal'" class="discrete-horizontal-layer">
              <g
                *ngFor="let d of sortedData; let idx = index"
                class="range-row-horizontal"
                style="cursor: pointer"
                (pointerenter)="onItemPointerEnter(d, idx, $event)"
                (click)="onItemClick(d, idx, $event)"
              >
                <!-- Row Background Highlight -->
                <rect
                  [attr.x]="-margin.left + 4"
                  [attr.y]="idx * rowHeight + 1"
                  [attr.width]="svgWidth - 8"
                  [attr.height]="rowHeight - 2"
                  [attr.fill]="selectedId === (d.id || 'item-' + idx) ? 'var(--action-subtle, #eff6ff)' : activeIndex === idx ? 'var(--surface-sunken, #f8fafc)' : 'transparent'"
                  rx="4"
                />

                <!-- Y-axis row outward tick -->
                <line
                  x1="-5"
                  x2="0"
                  [attr.y1]="getRowCenterY(idx)"
                  [attr.y2]="getRowCenterY(idx)"
                  stroke="var(--border-strong, #cbd5e1)"
                  stroke-width="1"
                />

                <!-- Category Label -->
                <text
                  x="-8"
                  [attr.y]="getRowCenterY(idx) + 4"
                  font-size="11"
                  [attr.font-weight]="selectedId === (d.id || 'item-' + idx) || activeIndex === idx ? '600' : '500'"
                  [attr.fill]="selectedId === (d.id || 'item-' + idx) ? 'var(--action-solid, #0284c7)' : 'var(--text-primary, #1e293b)'"
                  text-anchor="end"
                >
                  <title>{{ getRawLabel(d, idx) }}</title>
                  {{ getDisplayLabel(d, idx) }}
                </text>

                <!-- Interval Bar -->
                <g *ngIf="variant === 'interval-bar'">
                  <rect
                    [attr.x]="getBarStart(d)"
                    [attr.y]="getRowCenterY(idx) - barThickness / 2"
                    [attr.width]="getBarWidth(d)"
                    [attr.height]="barThickness"
                    [attr.rx]="barThickness / 3"
                    [attr.fill]="d.status === 'critical' ? 'url(#' + chartId + '-rc-hatch-critical)' : d.status === 'warning' ? 'url(#' + chartId + '-rc-hatch-warning)' : getStatusColor(d.status)"
                    [attr.stroke]="getStatusColor(d.status)"
                    [attr.stroke-width]="selectedId === (d.id || 'item-' + idx) ? 2 : 1"
                    [attr.opacity]="activeIndex === idx ? 1 : 0.9"
                  />
                  <!-- Center tick -->
                  <line
                    *ngIf="showCenterEstimate && d[centerKey] != null"
                    [attr.x1]="valToX(d[centerKey])"
                    [attr.x2]="valToX(d[centerKey])"
                    [attr.y1]="getRowCenterY(idx) - barThickness / 2 - 2"
                    [attr.y2]="getRowCenterY(idx) + barThickness / 2 + 2"
                    stroke="var(--text-primary, #0f172a)"
                    stroke-width="2.5"
                  />
                  <!-- Direct labels -->
                  <g *ngIf="showDirectLabels" font-size="10" fill="var(--text-secondary, #475569)" style="font-variant-numeric: tabular-nums">
                    <text
                      [attr.x]="Math.max(4, getBarStart(d) - 4)"
                      [attr.y]="getRowCenterY(idx) + 3"
                      text-anchor="end"
                      class="ds-range-chart__label"
                    >
                      {{ d[lowerKey] }}
                    </text>
                    <text
                      [attr.x]="Math.min(innerWidth - 4, getBarStart(d) + getBarWidth(d) + 4)"
                      [attr.y]="getRowCenterY(idx) + 3"
                      text-anchor="start"
                      class="ds-range-chart__label"
                    >
                      {{ d[upperKey] }}
                    </text>
                  </g>
                </g>

                <!-- Dumbbell Variant -->
                <g *ngIf="variant === 'dumbbell'">
                  <line
                    [attr.x1]="valToX(d[lowerKey])"
                    [attr.x2]="valToX(d[upperKey])"
                    [attr.y1]="getRowCenterY(idx)"
                    [attr.y2]="getRowCenterY(idx)"
                    stroke="var(--border-strong, #94a3b8)"
                    [attr.stroke-width]="selectedId === (d.id || 'item-' + idx) ? 3 : 2"
                    [attr.stroke-dasharray]="d.dashed ? '3,2' : undefined"
                  />
                  <circle
                    [attr.cx]="valToX(d[lowerKey])"
                    [attr.cy]="getRowCenterY(idx)"
                    r="5"
                    [attr.fill]="dumbbellColors.before"
                    stroke="var(--surface-card, #ffffff)"
                    stroke-width="1.5"
                  />
                  <circle
                    [attr.cx]="valToX(d[upperKey])"
                    [attr.cy]="getRowCenterY(idx)"
                    r="6"
                    [attr.fill]="getDumbbellEndColor(d)"
                    stroke="var(--surface-card, #ffffff)"
                    stroke-width="2"
                  />
                  <g *ngIf="showDirectLabels" font-size="10" font-weight="600" style="font-variant-numeric: tabular-nums">
                    <text
                      [attr.x]="valToX(d[lowerKey])"
                      [attr.y]="getRowCenterY(idx) - 8"
                      text-anchor="middle"
                      fill="var(--text-secondary, #64748b)"
                      class="ds-range-chart__label"
                    >
                      {{ d[lowerKey] }}
                    </text>
                    <text
                      [attr.x]="valToX(d[upperKey])"
                      [attr.y]="getRowCenterY(idx) - 8"
                      text-anchor="middle"
                      [attr.fill]="getDumbbellEndColor(d)"
                      class="ds-range-chart__label"
                    >
                      {{ d[upperKey] }}
                    </text>
                  </g>
                </g>

                <!-- Error Bar Variant -->
                <g *ngIf="variant === 'error-bar'">
                  <line
                    [attr.x1]="valToX(d[lowerKey])"
                    [attr.x2]="valToX(d[upperKey])"
                    [attr.y1]="getRowCenterY(idx)"
                    [attr.y2]="getRowCenterY(idx)"
                    stroke="var(--text-primary, #334155)"
                    stroke-width="1.5"
                  />
                  <line
                    [attr.x1]="valToX(d[lowerKey])"
                    [attr.x2]="valToX(d[lowerKey])"
                    [attr.y1]="getRowCenterY(idx) - 5"
                    [attr.y2]="getRowCenterY(idx) + 5"
                    stroke="var(--text-primary, #334155)"
                    stroke-width="1.5"
                  />
                  <line
                    [attr.x1]="valToX(d[upperKey])"
                    [attr.x2]="valToX(d[upperKey])"
                    [attr.y1]="getRowCenterY(idx) - 5"
                    [attr.y2]="getRowCenterY(idx) + 5"
                    stroke="var(--text-primary, #334155)"
                    stroke-width="1.5"
                  />
                  <circle
                    [attr.cx]="valToX(d[centerKey] != null ? d[centerKey] : (d[lowerKey] + d[upperKey]) / 2)"
                    [attr.cy]="getRowCenterY(idx)"
                    r="5"
                    [attr.fill]="getStatusColor(d.status)"
                    stroke="var(--surface-card, #ffffff)"
                    stroke-width="1.5"
                  />
                </g>
              </g>
            </g>

            <!-- Discrete Vertical Intervals -->
            <g *ngIf="variant !== 'range-area' && orientation === 'vertical'" class="discrete-vertical-layer">
              <g
                *ngFor="let d of sortedData; let idx = index"
                class="range-col-vertical"
                style="cursor: pointer"
                (pointerenter)="onItemPointerEnter(d, idx, $event)"
                (click)="onItemClick(d, idx, $event)"
              >
                <!-- Column Background Highlight -->
                <rect
                  [attr.x]="idx * (innerWidth / rowCount) + 2"
                  y="0"
                  [attr.width]="(innerWidth / rowCount) - 4"
                  [attr.height]="innerHeight"
                  [attr.fill]="selectedId === (d.id || 'item-' + idx) ? 'var(--action-subtle, #eff6ff)' : activeIndex === idx ? 'var(--surface-sunken, #f8fafc)' : 'transparent'"
                  rx="4"
                />

                <!-- Bottom Outward Tick -->
                <line
                  [attr.x1]="idx * (innerWidth / rowCount) + (innerWidth / rowCount) / 2"
                  [attr.x2]="idx * (innerWidth / rowCount) + (innerWidth / rowCount) / 2"
                  [attr.y1]="innerHeight"
                  [attr.y2]="innerHeight + 5"
                  stroke="var(--border-strong, #cbd5e1)"
                  stroke-width="1"
                />

                <!-- Category Label at bottom -->
                <text
                  [attr.x]="idx * (innerWidth / rowCount) + (innerWidth / rowCount) / 2"
                  [attr.y]="innerHeight + 18"
                  font-size="10"
                  [attr.font-weight]="selectedId === (d.id || 'item-' + idx) || activeIndex === idx ? '600' : '500'"
                  [attr.fill]="selectedId === (d.id || 'item-' + idx) ? 'var(--action-solid, #0284c7)' : 'var(--text-primary, #1e293b)'"
                  text-anchor="middle"
                >
                  {{ d[categoryKey] || 'Item ' + (idx + 1) }}
                </text>

                <!-- Vertical Interval Bar -->
                <g *ngIf="variant === 'interval-bar'">
                  <rect
                    [attr.x]="idx * (innerWidth / rowCount) + (innerWidth / rowCount) / 2 - barThickness / 2"
                    [attr.y]="Math.min(valToY(d[lowerKey]), valToY(d[upperKey]))"
                    [attr.width]="barThickness"
                    [attr.height]="Math.max(2, Math.abs(valToY(d[lowerKey]) - valToY(d[upperKey])))"
                    [attr.rx]="barThickness / 3"
                    [attr.fill]="d.status === 'critical' ? 'url(#' + chartId + '-rc-hatch-critical)' : d.status === 'warning' ? 'url(#' + chartId + '-rc-hatch-warning)' : getStatusColor(d.status)"
                    [attr.stroke]="getStatusColor(d.status)"
                    [attr.stroke-width]="selectedId === (d.id || 'item-' + idx) ? 2 : 1"
                    [attr.opacity]="activeIndex === idx ? 1 : 0.9"
                  />
                  <!-- Center tick -->
                  <line
                    *ngIf="showCenterEstimate && d[centerKey] != null"
                    [attr.x1]="idx * (innerWidth / rowCount) + (innerWidth / rowCount) / 2 - barThickness / 2 - 2"
                    [attr.x2]="idx * (innerWidth / rowCount) + (innerWidth / rowCount) / 2 + barThickness / 2 + 2"
                    [attr.y1]="valToY(d[centerKey])"
                    [attr.y2]="valToY(d[centerKey])"
                    stroke="var(--text-primary, #0f172a)"
                    stroke-width="2.5"
                  />
                </g>

                <!-- Vertical Error Bar -->
                <g *ngIf="variant === 'error-bar'">
                  <line
                    [attr.x1]="idx * (innerWidth / rowCount) + (innerWidth / rowCount) / 2"
                    [attr.x2]="idx * (innerWidth / rowCount) + (innerWidth / rowCount) / 2"
                    [attr.y1]="valToY(d[lowerKey])"
                    [attr.y2]="valToY(d[upperKey])"
                    stroke="var(--text-primary, #334155)"
                    stroke-width="1.5"
                  />
                  <line
                    [attr.x1]="idx * (innerWidth / rowCount) + (innerWidth / rowCount) / 2 - 5"
                    [attr.x2]="idx * (innerWidth / rowCount) + (innerWidth / rowCount) / 2 + 5"
                    [attr.y1]="valToY(d[lowerKey])"
                    [attr.y2]="valToY(d[lowerKey])"
                    stroke="var(--text-primary, #334155)"
                    stroke-width="1.5"
                  />
                  <line
                    [attr.x1]="idx * (innerWidth / rowCount) + (innerWidth / rowCount) / 2 - 5"
                    [attr.x2]="idx * (innerWidth / rowCount) + (innerWidth / rowCount) / 2 + 5"
                    [attr.y1]="valToY(d[upperKey])"
                    [attr.y2]="valToY(d[upperKey])"
                    stroke="var(--text-primary, #334155)"
                    stroke-width="1.5"
                  />
                  <circle
                    [attr.cx]="idx * (innerWidth / rowCount) + (innerWidth / rowCount) / 2"
                    [attr.cy]="valToY(d[centerKey] != null ? d[centerKey] : (d[lowerKey] + d[upperKey]) / 2)"
                    r="5"
                    [attr.fill]="getStatusColor(d.status)"
                    stroke="var(--surface-card, #ffffff)"
                    stroke-width="1.5"
                  />
                </g>
              </g>
            </g>
          </g>
        </svg>

        <!-- 2D Quad-Flip Non-Occluding Tooltip Overlay -->
        <div
          *ngIf="activeItem"
          class="ds-range-chart__tooltip"
          [style.left.px]="tooltipLeft"
          [style.top.px]="tooltipTop"
          role="tooltip"
        >
          <div class="ds-range-chart__tooltip-title">
            {{ activeItem[categoryKey] || activeItem.label || activeItem.id }}
          </div>

          <div *ngIf="activeItem.intervalSemantics" class="ds-range-chart__tooltip-semantics">
            Construct: <strong>{{ activeItem.intervalSemantics }}</strong>
          </div>

          <div class="ds-range-chart__tooltip-grid">
            <span style="color: #cbd5e1">Lower Bound:</span>
            <strong style="text-align: right; font-variant-numeric: tabular-nums">{{ formatVal(activeItem[lowerKey]) }}</strong>

            <span style="color: #cbd5e1">Upper Bound:</span>
            <strong style="text-align: right; font-variant-numeric: tabular-nums">{{ formatVal(activeItem[upperKey]) }}</strong>

            <ng-container *ngIf="activeItem[centerKey] != null">
              <span style="color: #38bdf8">Center:</span>
              <strong style="text-align: right; color: #38bdf8; font-variant-numeric: tabular-nums">
                {{ formatVal(activeItem[centerKey]) }}
              </strong>
            </ng-container>

            <span style="color: #cbd5e1">Spread:</span>
            <strong style="text-align: right; font-variant-numeric: tabular-nums">
              {{ formatVal(Math.abs(activeItem[upperKey] - activeItem[lowerKey])) }}
            </strong>

            <ng-container *ngIf="variant === 'dumbbell'">
              <span style="color: #fcd34d">Delta:</span>
              <strong style="text-align: right; color: #fcd34d; font-variant-numeric: tabular-nums">
                {{ (activeItem[upperKey] - activeItem[lowerKey]).toFixed(1) }} {{ unit }}
              </strong>
            </ng-container>
          </div>

          <div *ngIf="activeItem.status" class="ds-range-chart__tooltip-status" [style.color]="getStatusColor(activeItem.status)">
            ● Status: {{ activeItem.status.toUpperCase() }}
          </div>
        </div>

        <!-- Accessible Intervals Data Table Modal (Alt+F11) -->
        <div dsFocusTrap tabindex="-1" *ngIf="showTableModal" class="ds-range-chart__modal-backdrop" role="dialog" aria-modal="true" aria-label="Accessible Bounded Intervals Matrix">
          <div class="ds-range-chart__modal-dialog">
            <div class="ds-range-chart__modal-header">
              <div>
                <div class="ds-range-chart__modal-title">Accessible Bounded Intervals Matrix</div>
                <div class="ds-range-chart__modal-subtitle">
                  {{ sortedData.length }} records · Bounds expressed in {{ unit.trim() || 'Units' }}
                </div>
              </div>
              <button
                type="button"
                (click)="showTableModal = false"
                class="ds-range-chart__modal-close"
                aria-label="Close table modal"
              >&times;</button>
            </div>

            <div class="ds-range-chart__modal-body">
              <table class="ds-range-chart__table">
                <thead>
                  <tr>
                    <th>Category / Station</th>
                    <th style="text-align: right">Lower Limit</th>
                    <th style="text-align: right">Center</th>
                    <th style="text-align: right">Upper Limit</th>
                    <th style="text-align: right">Span (Spread)</th>
                    <th>Health</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let d of sortedData">
                    <td style="font-weight: 600; color: var(--text-primary, #0f172a)">
                      {{ d[categoryKey] || d.id }}
                    </td>
                    <td style="text-align: right; font-variant-numeric: tabular-nums">
                      {{ formatVal(d[lowerKey]) }}
                    </td>
                    <td style="text-align: right; font-variant-numeric: tabular-nums; color: var(--action-solid, #0284c7)">
                      {{ d[centerKey] != null ? formatVal(d[centerKey]) : '—' }}
                    </td>
                    <td style="text-align: right; font-variant-numeric: tabular-nums">
                      {{ formatVal(d[upperKey]) }}
                    </td>
                    <td style="text-align: right; font-variant-numeric: tabular-nums; font-weight: 600">
                      {{ formatVal(Math.abs(d[upperKey] - d[lowerKey])) }}
                    </td>
                    <td>
                      <span
                        class="ds-range-chart__status-pill"
                        [class.ds-range-chart__status-pill--critical]="d.status === 'critical'"
                        [class.ds-range-chart__status-pill--warning]="d.status === 'warning'"
                        [class.ds-range-chart__status-pill--nominal]="d.status === 'nominal'"
                      >
                        {{ (d.status || 'nominal').toUpperCase() }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="ds-range-chart__modal-footer">
              <button
                type="button"
                (click)="showTableModal = false"
                class="ds-range-chart__modal-btn"
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
  styleUrls: ['./range-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsRangeChartComponent implements AfterViewInit, OnDestroy {
  Math = Math;
  dumbbellColors = DUMBBELL_ENDPOINT_COLORS;

  @Input() data: RangeDataItem[] = [];
  @Input() variant: RangeChartVariant = 'interval-bar';
  @Input() orientation: RangeChartOrientation = 'horizontal';
  @Input() width: number = 760;
  @Input() height: number = 420;
  @Input() title: string = 'Bounded Interval Range Chart';
  @Input() subtitle: string = '';
  @Input() lowerKey: string = 'lower';
  @Input() upperKey: string = 'upper';
  @Input() centerKey: string = 'center';
  @Input() targetKey: string = 'target';
  @Input() categoryKey: string = 'label';
  @Input() unit: string = '';
  @Input() locale: string = 'en-IN';
  @Input() targetLine: number | { value: number; label?: string } | null = null;
  @Input() showCenterEstimate: boolean = true;
  @Input() showDirectLabels: boolean = true;
  @Input() showControls: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() emptyMessage: string = 'No bounded interval telemetry records available.';
  @Input() loading: boolean = false;
  @Input() ariaLabel?: string;

  @Output() itemClick = new EventEmitter<{ item: RangeDataItem; index: number }>();

  @ViewChild('containerRef') containerRef?: ElementRef<HTMLDivElement>;

  chartId = `ds-range-chart-${++nextRangeId}`;
  activeIndex = -1;
  selectedId: string | null = null;
  sortBy = 'default';
  searchQuery = '';
  showTableModal = false;
  announcement = '';

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
    return Math.max(300, this.measuredWidth || this.width);
  }

  get densityTier(): VizDensityTier {
    return getVizDensityTier(this.plotWidth);
  }

  get filteredData(): RangeDataItem[] {
    if (!this.data || this.data.length === 0) return [];
    if (!this.searchQuery.trim()) return this.data;
    const q = this.searchQuery.toLowerCase().trim();
    return this.data.filter(d => {
      const label = String(d[this.categoryKey] || d.id || '').toLowerCase();
      const semantics = String(d.intervalSemantics || d.category || '').toLowerCase();
      return label.includes(q) || semantics.includes(q);
    });
  }

  get sortedData(): RangeDataItem[] {
    if (this.variant === 'range-area' || this.sortBy === 'default') return this.filteredData;
    const list = [...this.filteredData];
    return list.sort((a, b) => {
      const lowA = Number(a[this.lowerKey] ?? 0);
      const lowB = Number(b[this.lowerKey] ?? 0);
      const upA = Number(a[this.upperKey] ?? 0);
      const upB = Number(b[this.upperKey] ?? 0);
      const spreadA = Math.abs(upA - lowA);
      const spreadB = Math.abs(upB - lowB);

      if (this.sortBy === 'spread-desc') return spreadB - spreadA;
      if (this.sortBy === 'spread-asc') return spreadA - spreadB;
      if (this.sortBy === 'lower-asc') return lowA - lowB;
      if (this.sortBy === 'upper-desc') return upB - upA;
      if (this.sortBy === 'label-asc') return String(a[this.categoryKey] || '').localeCompare(String(b[this.categoryKey] || ''));
      return 0;
    });
  }

  get activeItem(): RangeDataItem | null {
    return this.activeIndex >= 0 ? this.sortedData[this.activeIndex] : null;
  }

  get headerHeight(): number {
    return (this.title || this.subtitle || this.showControls) ? 46 : 0;
  }

  get svgWidth(): number {
    return Math.max(200, this.plotWidth - 40);
  }

  get svgHeight(): number {
    return Math.max(160, this.height - this.headerHeight - 32);
  }

  get margin() {
    const isMobile = this.densityTier === 'compact' || this.densityTier === 'mobile';
    if (this.orientation === 'horizontal') {
      const maxLen = this.sortedData.reduce((max, d) => Math.max(max, String(d[this.categoryKey] || d.id || '').length), 0);
      const calcLeft = isMobile
        ? Math.min(130, Math.max(80, maxLen * 5.0 + 16))
        : Math.min(220, Math.max(140, maxLen * 6.5 + 24));
      return { top: 24, right: isMobile ? 18 : 36, bottom: 40, left: calcLeft };
    }
    return { top: 24, right: isMobile ? 16 : 32, bottom: isMobile ? 40 : 56, left: isMobile ? 48 : 64 };
  }

  get innerWidth(): number {
    return Math.max(100, this.svgWidth - this.margin.left - this.margin.right);
  }

  get innerHeight(): number {
    return Math.max(80, this.svgHeight - this.margin.top - this.margin.bottom);
  }

  get domainBounds() {
    if (!this.sortedData || this.sortedData.length === 0) {
      return { domainMin: 0, domainMax: 100, domainSpan: 100 };
    }

    let min = Infinity;
    let max = -Infinity;

    this.sortedData.forEach(d => {
      const l = d[this.lowerKey] != null ? Number(d[this.lowerKey]) : null;
      const u = d[this.upperKey] != null ? Number(d[this.upperKey]) : null;
      const c = d[this.centerKey] != null ? Number(d[this.centerKey]) : null;
      const t = d[this.targetKey] != null ? Number(d[this.targetKey]) : null;

      if (l != null && !isNaN(l) && l < min) min = l;
      if (u != null && !isNaN(u) && u > max) max = u;
      if (c != null && !isNaN(c)) {
        if (c < min) min = c;
        if (c > max) max = c;
      }
      if (t != null && !isNaN(t)) {
        if (t < min) min = t;
        if (t > max) max = t;
      }
    });

    if (this.targetLine != null) {
      const tVal = typeof this.targetLine === 'number' ? this.targetLine : this.targetLine.value;
      if (tVal != null && !isNaN(tVal)) {
        if (tVal < min) min = tVal;
        if (tVal > max) max = tVal;
      }
    }

    if (min === Infinity || max === -Infinity) {
      return { domainMin: 0, domainMax: 100, domainSpan: 100 };
    }

    const span = max - min || 1;
    const pad = span * 0.08;
    return {
      domainMin: min - pad,
      domainMax: max + pad,
      domainSpan: (max + pad) - (min - pad)
    };
  }

  valToX(val: any): number {
    if (val == null || isNaN(val)) return 0;
    const { domainMin, domainSpan } = this.domainBounds;
    return ((val - domainMin) / domainSpan) * this.innerWidth;
  }

  valToY(val: any): number {
    if (val == null || isNaN(val)) return this.innerHeight;
    const { domainMin, domainSpan } = this.domainBounds;
    return this.innerHeight - ((val - domainMin) / domainSpan) * this.innerHeight;
  }

  get quantTicks(): number[] {
    const { domainMin, domainSpan } = this.domainBounds;
    const longestLabel = Math.max(
      ...[domainMin, domainMin + domainSpan / 2, domainMin + domainSpan]
        .map(value => this.formatVal(value).length)
    );
    const minTickSpacing = Math.max(56, longestLabel * 6 + 24);
    const count = this.orientation === 'horizontal'
      ? Math.max(1, Math.min(5, Math.floor(this.innerWidth / minTickSpacing)))
      : 5;
    const ticks: number[] = [];
    for (let i = 0; i <= count; i++) {
      ticks.push(domainMin + (domainSpan * (i / count)));
    }
    return ticks;
  }

  get rowCount(): number {
    return Math.max(1, this.sortedData.length);
  }

  get rowHeight(): number {
    return this.innerHeight / this.rowCount;
  }

  get barThickness(): number {
    return Math.max(6, Math.min(22, this.rowHeight * 0.45));
  }

  getRowCenterY(idx: number): number {
    return idx * this.rowHeight + (this.rowHeight / 2);
  }

  getBarStart(d: any): number {
    const low = Number(d[this.lowerKey] ?? 0);
    const up = Number(d[this.upperKey] ?? 0);
    return Math.min(this.valToX(low), this.valToX(up));
  }

  getBarWidth(d: any): number {
    const low = Number(d[this.lowerKey] ?? 0);
    const up = Number(d[this.upperKey] ?? 0);
    return Math.max(2, Math.abs(this.valToX(up) - this.valToX(low)));
  }

  get targetLineVal(): number {
    if (this.targetLine == null) return 0;
    return typeof this.targetLine === 'number' ? this.targetLine : this.targetLine.value;
  }

  get targetLineLabel(): string {
    if (this.targetLine == null) return '';
    if (typeof this.targetLine === 'object' && this.targetLine.label) return this.targetLine.label;
    return `Target: ${this.formatVal(this.targetLineVal)}`;
  }

  getRawLabel(d: any, idx: number): string {
    return String(d[this.categoryKey] || `Item ${idx + 1}`);
  }

  getDisplayLabel(d: any, idx: number): string {
    const raw = this.getRawLabel(d, idx);
    const maxChars = Math.floor((this.margin.left - 20) / 6.8);
    return raw.length > maxChars ? `${raw.slice(0, maxChars - 1)}…` : raw;
  }

  get rangeAreaPaths() {
    if (this.variant !== 'range-area' || this.sortedData.length === 0) return null;

    const n = this.sortedData.length;
    const stepX = n > 1 ? this.innerWidth / (n - 1) : this.innerWidth / 2;

    const upperCoords: [number, number][] = [];
    const lowerCoords: [number, number][] = [];
    const centerCoords: [number, number][] = [];

    this.sortedData.forEach((d, i) => {
      const x = i * stepX;
      const up = Number(d[this.upperKey] ?? 0);
      const low = Number(d[this.lowerKey] ?? 0);
      const cent = d[this.centerKey] != null ? Number(d[this.centerKey]) : (low + up) / 2;

      const yUp = this.valToY(up);
      const yLow = this.valToY(low);
      const yCent = this.valToY(cent);

      upperCoords.push([x, yUp]);
      lowerCoords.unshift([x, yLow]);
      centerCoords.push([x, yCent]);
    });

    let bandPath = `M ${upperCoords[0][0]} ${upperCoords[0][1]}`;
    for (let i = 1; i < upperCoords.length; i++) {
      bandPath += ` L ${upperCoords[i][0]} ${upperCoords[i][1]}`;
    }
    for (let i = 0; i < lowerCoords.length; i++) {
      bandPath += ` L ${lowerCoords[i][0]} ${lowerCoords[i][1]}`;
    }
    bandPath += ' Z';

    let centerLinePath = `M ${centerCoords[0][0]} ${centerCoords[0][1]}`;
    for (let i = 1; i < centerCoords.length; i++) {
      centerLinePath += ` L ${centerCoords[i][0]} ${centerCoords[i][1]}`;
    }

    return { bandPath, centerLinePath, centerCoords };
  }

  get tooltipLeft(): number {
    if (!this.activeItem) return 0;
    const centerVal = this.activeItem[this.centerKey] ?? this.activeItem[this.upperKey];
    return Math.min(Math.max(12, this.margin.left + this.valToX(centerVal) + 15), this.width - 210);
  }

  get tooltipTop(): number {
    if (!this.activeItem) return 0;
    return Math.min(Math.max(12, 16 + this.headerHeight + this.margin.top + (this.activeIndex * this.rowHeight) - 20), this.height - 120);
  }

  getStatusColor(status?: string): string {
    return STATUS_COLORS[status || 'nominal'] || STATUS_COLORS['nominal'];
  }

  getDumbbellEndColor(d: any): string {
    const isImproved = d.isImproved ?? (d[this.upperKey] <= d[this.lowerKey]);
    return isImproved ? DUMBBELL_ENDPOINT_COLORS.afterImproved : DUMBBELL_ENDPOINT_COLORS.afterRegressed;
  }

  formatVal(val: any): string {
    return formatVizValue(val, this.unit, this.locale);
  }

  onSearchInput(e: any): void {
    this.searchQuery = e.target.value;
  }

  onSortChange(e: any): void {
    this.sortBy = e.target.value;
  }

  onItemPointerEnter(item: any, idx: number, e: Event): void {
    e.stopPropagation();
    this.activeIndex = idx;
    this.announcement = `Selected interval ${item[this.categoryKey] || item.id}: Lower ${this.formatVal(item[this.lowerKey])}, Upper ${this.formatVal(item[this.upperKey])}, Status ${item.status || 'nominal'}.`;
  }

  onItemClick(item: any, idx: number, e: Event): void {
    e.stopPropagation();
    const itemId = item.id || `item-${idx}`;
    this.selectedId = this.selectedId === itemId ? null : itemId;
    this.itemClick.emit({ item, index: idx });
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
      if (this.activeIndex >= 0) {
        e.preventDefault();
        this.activeIndex = -1;
        return;
      }
    }
    if (this.sortedData.length === 0) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % this.sortedData.length;
      const item = this.sortedData[this.activeIndex];
      this.announcement = `Selected interval ${item[this.categoryKey] || item.id}: Lower ${this.formatVal(item[this.lowerKey])}, Upper ${this.formatVal(item[this.upperKey])}, Status ${item.status || 'nominal'}.`;
      this.itemClick.emit({ item, index: this.activeIndex });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      this.activeIndex = (this.activeIndex - 1 + this.sortedData.length) % this.sortedData.length;
      const item = this.sortedData[this.activeIndex];
      this.announcement = `Selected interval ${item[this.categoryKey] || item.id}: Lower ${this.formatVal(item[this.lowerKey])}, Upper ${this.formatVal(item[this.upperKey])}, Status ${item.status || 'nominal'}.`;
      this.itemClick.emit({ item, index: this.activeIndex });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (this.activeIndex >= 0 && this.activeIndex < this.sortedData.length) {
        const item = this.sortedData[this.activeIndex];
        const itemId = item.id || `item-${this.activeIndex}`;
        this.selectedId = this.selectedId === itemId ? null : itemId;
      }
    }
  }
}
