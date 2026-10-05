import { DsFocusTrapDirective } from '../../utils/focus-trap.directive.js';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  HostListener,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  rollupHierarchy,
  computeTreemapLayout,
  VIZ_COLORS,
  PATTERN_PRESETS,
  formatVizValue,
  TreemapLayoutNode,
  PatternPreset,
  getVizDensityTier,
  VizDensityTier
} from '../../utils/viz-core.js';

export interface TreemapNode {
  id?: string;
  label?: string;
  name?: string;
  value?: number;
  category?: string;
  children?: TreemapNode[];
  [key: string]: any;
}

export interface FlatTreemapNode {
  id: string;
  label: string;
  depth: number;
  category: string;
  value: number;
  formattedValue: string;
  pctSection: string;
  pctTotal: string;
  isLeaf: boolean;
  childrenCount: number;
  parentLabel: string;
  path: string;
}

function flattenTreemapHierarchy(
  node: any,
  depth = 0,
  parentLabel = '',
  parentPath = '',
  sectionTotal = 1,
  plantTotal = 1,
  unit = '',
  locale = 'en-IN'
): FlatTreemapNode[] {
  if (!node) return [];
  const label = node.label || node.name || 'Unnamed';
  const currentPath = parentPath ? `${parentPath} › ${label}` : label;
  const currentVal = node.value || 0;
  const pctSection = ((currentVal / Math.max(1, sectionTotal)) * 100).toFixed(1);
  const pctTotal = ((currentVal / Math.max(1, plantTotal)) * 100).toFixed(1);
  const isLeaf = !node.children || node.children.length === 0;

  const current: FlatTreemapNode = {
    id: node.id || `node-${label}-${depth}`,
    label,
    depth,
    category: node.category || label || 'Uncategorized',
    value: currentVal,
    formattedValue: formatVizValue(currentVal, unit, locale),
    pctSection,
    pctTotal,
    isLeaf,
    childrenCount: node.children ? node.children.length : 0,
    parentLabel: parentLabel || '—',
    path: currentPath
  };

  const children = (node.children || []).flatMap((child: any) =>
    flattenTreemapHierarchy(child, depth + 1, label, currentPath, sectionTotal, plantTotal, unit, locale)
  );

  return [current, ...children];
}

let nextTreemapId = 0;

/**
 * DsTreemapComponent — Hierarchical Area Visualization Component
 *
 * 1:1 Parity with @ds/react:
 * - Live ResizeObserver auto-measurement for container responsiveness.
 * - 3-tier dynamic adaptive typography (desktop, tablet, mobile).
 * - Squarified & Slice-and-Dice layout algorithms with spacious padding.
 * - Responsive viewBox scaling.
 * - Interactive breadcrumb drilldown & drillup stack.
 * - Dual-encoding SVG pattern hatching overlays.
 * - 2D dark enterprise floating HUD tooltip with boundary clamping.
 * - Accessible data table modal dialog (<kbd>Alt+F11</kbd>).
 * - Full WAI-ARIA keyboard navigation & live region announcements.
 */
@Component({
  selector: 'ds-treemap',
  standalone: true,
  imports: [DsFocusTrapDirective, CommonModule],
  template: `
    <div
      #containerRef
      class="ds-treemap"
      [class.ds-treemap--empty]="!fullRoot || fullRoot.value === 0"
      [style.max-width.px]="width"
      style="width: 100%"
      role="region"
      [attr.aria-label]="'Treemap: ' + (title || 'Hierarchical Part-to-Whole') + '. Total: ' + formatVal(fullRoot?.value) + '. Use arrow keys to navigate nodes, Enter to drill down or select, Backspace to navigate up, Alt+F11 for data table.'"
      [attr.aria-activedescendant]="focusedNode ? 'tm-node-' + focusedNode.id : null"
      tabindex="0"
      (keydown)="onKeyDown($event)"
      (pointerleave)="hoveredNode = null"
    >
      <!-- Screen Reader Live Announcements -->
      <div aria-live="polite" class="sr-only">
        {{ announcement }}
      </div>

      <!-- Header & Toolbar -->
      <div *ngIf="title || subtitle" class="ds-treemap__header">
        <div>
          <h3 *ngIf="title" class="ds-treemap__title" [style.font-size.px]="densityTier === 'mobile' ? 14 : 15">{{ title }}</h3>
          <p *ngIf="subtitle" class="ds-treemap__subtitle">{{ subtitle }}</p>
        </div>

        <div class="ds-treemap__actions">
          <button
            type="button"
            class="ds-treemap__table-btn"
            (click)="isTableModalOpen = true"
            title="Open Accessible Data Table (Alt+F11)"
            aria-label="View hierarchy data in accessible table modal (Alt+F11)"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="2" y="2" width="12" height="12" rx="2" />
              <path d="M2 6h12M6 2v12" />
            </svg>
            Table View <span class="ds-treemap__table-btn-sub">(Alt+F11)</span>
          </button>
        </div>
      </div>

      <!-- Breadcrumbs for Drilldown -->
      <nav *ngIf="fullRoot && fullRoot.value > 0" class="ds-treemap__breadcrumbs" aria-label="Hierarchy Breadcrumbs">
        <span class="ds-treemap__breadcrumbs-label">HIERARCHY:</span>
        <ng-container *ngFor="let crumb of breadcrumbTrail; let i = index">
          <span *ngIf="i > 0" class="ds-treemap__crumb-separator">›</span>
          <button
            *ngIf="i < breadcrumbTrail.length - 1"
            type="button"
            class="ds-treemap__crumb"
            (click)="handleDrillUp(crumb.depth)"
          >
            {{ crumb.label }}
          </button>
          <span *ngIf="i === breadcrumbTrail.length - 1" class="ds-treemap__crumb--current" aria-current="location">
            {{ crumb.label }}
          </span>
        </ng-container>
        <span class="ds-treemap__breadcrumbs-total">
          Current View Total: <strong>{{ formatVal(currentRoot?.value) }}</strong>
        </span>
      </nav>

      <!-- Empty State -->
      <div *ngIf="!fullRoot || fullRoot.value === 0" class="ds-treemap__empty-content" [style.height.px]="plotHeight">
        No hierarchical data available to display
      </div>

      <!-- Main SVG Plot with Responsive ViewBox & Dynamic Plot Bounds -->
      <svg
        *ngIf="fullRoot && fullRoot.value > 0"
        [attr.width]="plotWidth"
        [attr.height]="plotHeight"
        [attr.viewBox]="'0 0 ' + plotWidth + ' ' + plotHeight"
        [style.max-height.px]="plotHeight"
        class="ds-treemap__svg"
        style="width: 100%; height: auto"
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
              fill="rgba(255,255,255,0.45)"
            />
            <line
              *ngIf="pat.type !== 'circle'"
              [attr.x1]="0"
              [attr.y1]="0"
              [attr.x2]="0"
              [attr.y2]="8"
              stroke="rgba(255,255,255,0.35)"
              stroke-width="1.5"
            />
          </pattern>
          <filter [attr.id]="chartId + '-active-shadow'" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2" />
          </filter>
        </defs>

        <g>
          <!-- 1. Branch Category Containers -->
          <g
            *ngFor="let branch of branchNodes"
            [attr.id]="'tm-node-' + branch.id"
            class="ds-treemap__branch"
            (click)="onBranchClick(branch)"
            [style.cursor]="enableDrilldown ? 'zoom-in' : 'default'"
          >
            <rect
              [attr.x]="branch.x"
              [attr.y]="branch.y"
              [attr.width]="branch.width"
              [attr.height]="branch.height"
              fill="var(--surface-sunken, #f8fafc)"
              [attr.stroke]="focusedNode?.id === branch.id ? 'var(--action-solid, #2563eb)' : (selectedId === branch.id ? 'var(--text-primary, #0f172a)' : 'var(--border-strong, #cbd5e1)')"
              [attr.stroke-width]="focusedNode?.id === branch.id ? 2.5 : (selectedId === branch.id ? 2 : 1)"
              rx="4"
            />
            <!-- Branch Title Header Bar -->
            <g *ngIf="branch.height >= 22 && branch.width >= 36">
              <rect
                [attr.x]="branch.x"
                [attr.y]="branch.y"
                [attr.width]="branch.width"
                height="18"
                fill="var(--surface-subtle, #e2e8f0)"
                stroke="var(--border-strong, #cbd5e1)"
                stroke-width="0.5"
                rx="4"
              />
              <text
                [attr.x]="branch.x + 6"
                [attr.y]="branch.y + 13"
                [attr.font-size]="densityTier === 'mobile' ? 9.5 : 10.5"
                font-weight="600"
                fill="var(--text-secondary, #334155)"
                pointer-events="none"
              >
                {{ getBranchHeaderLabel(branch) }}
              </text>
              <text
                *ngIf="enableDrilldown && branch.width >= 80"
                [attr.x]="branch.x + branch.width - 6"
                [attr.y]="branch.y + 13"
                text-anchor="end"
                font-size="9"
                fill="var(--action-solid, #2563eb)"
                font-weight="500"
                pointer-events="none"
              >
                drill →
              </text>
            </g>
          </g>

          <!-- 2. Leaf Nodes with 3-Tier Dynamic Adaptive Typography -->
          <g
            *ngFor="let leaf of leafNodes; let idx = index"
            [attr.id]="'tm-node-' + leaf.id"
            class="ds-treemap__leaf"
            [attr.transform]="'translate(' + leaf.x + ',' + leaf.y + ')'"
            (click)="onLeafClick(leaf)"
            (pointerenter)="onPointerEnter(leaf, $event)"
            (pointermove)="onPointerMove($event)"
            (pointerleave)="hoveredNode = null"
            role="button"
            [attr.aria-label]="leaf.label + ': ' + formatVal(leaf.value) + ' (' + getPctParent(leaf) + '% of section)'"
            style="cursor: pointer"
          >
            <!-- Leaf Fill -->
            <rect
              class="ds-treemap__node-rect"
              x="0"
              y="0"
              [attr.width]="Math.max(1, leaf.width)"
              [attr.height]="Math.max(1, leaf.height)"
              [attr.fill]="getNodeColor(leaf.category || leaf.label, idx)"
              [attr.stroke]="(selectedId === leaf.id || focusedNode?.id === leaf.id) ? 'var(--text-primary, #0f172a)' : '#ffffff'"
              [attr.stroke-width]="(selectedId === leaf.id || focusedNode?.id === leaf.id) ? 2.5 : 1"
              rx="3"
              [attr.filter]="selectedId === leaf.id ? 'url(#' + chartId + '-active-shadow)' : null"
              [style.opacity]="(hoveredNode && hoveredNode.id !== leaf.id) ? 0.75 : 1.0"
            />

            <!-- Pattern Hatching Overlay -->
            <rect
              *ngIf="patternFills"
              x="0"
              y="0"
              [attr.width]="Math.max(1, leaf.width)"
              [attr.height]="Math.max(1, leaf.height)"
              [attr.fill]="'url(#' + chartId + '-' + getPatternId(idx) + ')'"
              opacity="0.85"
              pointer-events="none"
              rx="3"
            />

            <!-- Focus Ring Overlay -->
            <rect
              *ngIf="focusedNode?.id === leaf.id"
              x="1"
              y="1"
              [attr.width]="Math.max(1, leaf.width - 2)"
              [attr.height]="Math.max(1, leaf.height - 2)"
              fill="none"
              stroke="#ffffff"
              stroke-width="1.5"
              stroke-dasharray="3 2"
              rx="2"
              pointer-events="none"
            />

            <!-- Adaptive Label inside Leaf -->
            <text
              *ngIf="leaf.width >= (densityTier === 'mobile' ? 24 : 30) && leaf.height >= (densityTier === 'mobile' ? 16 : 18)"
              x="6"
              [attr.y]="leaf.width >= 110 && leaf.height >= 70 ? 18 : 15"
              [attr.font-size]="getLeafLabelFontSize(leaf)"
              font-weight="600"
              fill="#ffffff"
              pointer-events="none"
              style="text-shadow: 0 1px 2px rgba(0,0,0,0.7)"
            >
              {{ truncateLabel(leaf.label, leaf.width - 10, getLeafLabelFontSize(leaf) * 0.58) }}
            </text>

            <!-- Adaptive Metric Value -->
            <text
              *ngIf="densityTier !== 'mobile' && leaf.width >= 46 && leaf.height >= 32"
              x="6"
              [attr.y]="leaf.width >= 110 && leaf.height >= 70 ? 36 : 30"
              [attr.font-size]="getLeafValueFontSize(leaf)"
              font-weight="500"
              fill="rgba(255,255,255,0.95)"
              font-family="var(--font-mono, monospace)"
              pointer-events="none"
              style="font-variant-numeric: tabular-nums; text-shadow: 0 1px 2px rgba(0,0,0,0.7)"
            >
              {{ formatVal(leaf.value) }}
            </text>

            <!-- Adaptive Percentage Share -->
            <text
              *ngIf="densityTier === 'desktop' && leaf.width >= 58 && leaf.height >= 46"
              x="6"
              [attr.y]="leaf.width >= 110 && leaf.height >= 70 ? 52 : 44"
              [attr.font-size]="getLeafPctFontSize(leaf)"
              font-weight="400"
              fill="rgba(255,255,255,0.85)"
              pointer-events="none"
              style="font-variant-numeric: tabular-nums; text-shadow: 0 1px 2px rgba(0,0,0,0.7)"
            >
              {{ getPctParent(leaf) }}%
            </text>
          </g>
        </g>
      </svg>

      <!-- 2D Dark Enterprise Floating HUD Tooltip with Boundary Clamping -->
      <div
        *ngIf="hoveredNode"
        class="ds-treemap__tooltip"
        [style.left.px]="Math.max(10, Math.min(hoveredNode.clientX + 14, (containerRef?.nativeElement?.clientWidth || plotWidth) - 240))"
        [style.top.px]="Math.max(10, Math.min(hoveredNode.clientY - 20, plotHeight - 120))"
      >
        <div class="ds-treemap__tooltip-title">{{ hoveredNode.label }}</div>
        <div *ngIf="hoveredNode.category" class="ds-treemap__tooltip-cat">{{ hoveredNode.category }}</div>

        <div class="ds-treemap__tooltip-row ds-treemap__tooltip-row--top">
          <span>Magnitude:</span>
          <strong class="ds-treemap__tooltip-val">{{ formatVal(hoveredNode.value) }}</strong>
        </div>
        <div class="ds-treemap__tooltip-row">
          <span>Share of Section:</span>
          <span>{{ getPctParent(hoveredNode) }}%</span>
        </div>
        <div class="ds-treemap__tooltip-row">
          <span>Share of Plant Total:</span>
          <span>{{ getPctRoot(hoveredNode) }}%</span>
        </div>
        <div *ngIf="hoveredNode.parent" class="ds-treemap__tooltip-parent">
          Parent: <span>{{ hoveredNode.parent.label }}</span>
        </div>
      </div>

      <!-- Accessible Hierarchical Data Table Modal (Alt+F11) -->
      <div dsFocusTrap tabindex="-1"
        *ngIf="isTableModalOpen"
        class="ds-treemap__modal-backdrop"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="(title || 'Treemap Hierarchy') + ' Data Table'"
        (click)="isTableModalOpen = false"
      >
        <div class="ds-treemap__modal" (click)="$event.stopPropagation()">
          <!-- Modal Header -->
          <div class="ds-treemap__modal-header">
            <div>
              <h4 class="ds-treemap__modal-title">{{ title || 'Treemap Hierarchy' }} — Hierarchical Data Table</h4>
              <div class="ds-treemap__modal-sub">
                Total {{ flatData.length }} records · View Total: {{ formatVal(currentRoot?.value) }}
              </div>
            </div>
            <button
              type="button"
              class="ds-treemap__modal-close-btn"
              (click)="isTableModalOpen = false"
              aria-label="Close data table modal"
            >
              ✕
            </button>
          </div>

          <!-- Modal Table Body -->
          <div class="ds-treemap__modal-body">
            <table class="ds-treemap__modal-table">
              <thead>
                <tr>
                  <th>Hierarchy / Nomenclature</th>
                  <th>Category</th>
                  <th style="text-align: right">Magnitude ({{ unit.trim() || 'Value' }})</th>
                  <th style="text-align: right">Section %</th>
                  <th style="text-align: right">Plant Total %</th>
                  <th style="text-align: center">Level</th>
                  <th>Parent</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of flatData; let idx = index" [class.ds-treemap__modal-row--alt]="idx % 2 !== 0">
                  <td [style.font-weight]="row.depth === 0 ? '700' : (row.isLeaf ? '400' : '600')">
                    <span [style.display]="'inline-block'" [style.width.px]="row.depth * 16"></span>
                    <span *ngIf="row.depth > 0" class="ds-treemap__modal-indent">└─</span>
                    {{ row.label }}
                  </td>
                  <td>{{ row.category }}</td>
                  <td style="text-align: right; font-weight: 600" class="ds-treemap__tabular">{{ row.formattedValue }}</td>
                  <td style="text-align: right" class="ds-treemap__tabular">{{ row.pctSection }}%</td>
                  <td style="text-align: right" class="ds-treemap__tabular">{{ row.pctTotal }}%</td>
                  <td style="text-align: center" class="ds-treemap__tabular">L{{ row.depth + 1 }}</td>
                  <td>{{ row.parentLabel }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Modal Footer -->
          <div class="ds-treemap__modal-footer">
            <button
              type="button"
              class="ds-treemap__modal-dismiss-btn"
              (click)="isTableModalOpen = false"
            >
              Close (Esc)
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./treemap.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsTreemapComponent implements AfterViewInit, OnDestroy {
  Math = Math;

  @Input() data: TreemapNode | TreemapNode[] = [];
  @Input() valueKey: string = 'value';
  @Input() labelKey: string = 'label';
  @Input() categoryKey: string = 'category';
  @Input() childrenKey: string = 'children';
  @Input() width: number = 880;
  @Input() height: number = 500;
  @Input() algorithm: 'squarified' | 'slice-and-dice' = 'squarified';
  @Input() maxDepth: number = Infinity;
  @Input() colorScale: string[] = VIZ_COLORS;
  @Input() patternFills: boolean = true;
  @Input() unit: string = '';
  @Input() locale: string = 'en-IN';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() enableDrilldown: boolean = true;
  @Input() selectedId: string | null = null;

  @Output() nodeClick = new EventEmitter<{ node: any }>();
  @Output() nodeSelect = new EventEmitter<{ node: any }>();
  @Output() drill = new EventEmitter<{ node: any; stack: string[] }>();

  @ViewChild('containerRef') containerRef?: ElementRef<HTMLDivElement>;

  chartId = `ds-treemap-${++nextTreemapId}`;
  drillStack: string[] = [];
  hoveredNode: any = null;
  focusedIndex: number = -1;
  announcement: string = '';
  isTableModalOpen: boolean = false;
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

  get plotHeight(): number {
    return Math.max(180, this.height);
  }

  get densityTier(): VizDensityTier {
    return getVizDensityTier(this.plotWidth);
  }

  get fullRoot() {
    return rollupHierarchy(this.data, {
      labelKey: this.labelKey,
      valueKey: this.valueKey,
      categoryKey: this.categoryKey,
      childrenKey: this.childrenKey
    });
  }

  get currentRoot() {
    if (!this.fullRoot) return null;
    if (this.drillStack.length === 0) return this.fullRoot;

    let curr = this.fullRoot;
    for (const stepId of this.drillStack) {
      if (curr.children && curr.children.length > 0) {
        const next = curr.children.find(c => c.id === stepId);
        if (next) {
          curr = next;
        } else {
          break;
        }
      }
    }
    return curr;
  }

  get layoutNodes(): TreemapLayoutNode[] {
    if (!this.currentRoot) return [];
    return computeTreemapLayout({
      rootNode: this.currentRoot,
      x: 0,
      y: 0,
      width: this.plotWidth,
      height: this.plotHeight,
      padding: 2,
      containerPadding: 4,
      headerHeight: 20,
      algorithm: this.algorithm,
      maxDepth: this.maxDepth
    });
  }

  get branchNodes(): TreemapLayoutNode[] {
    const branches: TreemapLayoutNode[] = [];
    this.layoutNodes.forEach(n => {
      if (n.id === this.currentRoot?.id && n.depth === this.currentRoot?.depth) return;
      if (!n.isLeaf && (this.maxDepth === Infinity || n.depth < this.maxDepth)) {
        branches.push(n);
      }
    });
    return branches;
  }

  get leafNodes(): TreemapLayoutNode[] {
    const leaves: TreemapLayoutNode[] = [];
    this.layoutNodes.forEach(n => {
      if (n.id === this.currentRoot?.id && n.depth === this.currentRoot?.depth) return;
      if (n.isLeaf || (this.maxDepth !== Infinity && n.depth >= this.maxDepth)) {
        leaves.push(n);
      }
    });
    return leaves;
  }

  get navigableNodes(): TreemapLayoutNode[] {
    return [...this.leafNodes, ...this.branchNodes];
  }

  get focusedNode(): TreemapLayoutNode | null {
    if (this.focusedIndex >= 0 && this.focusedIndex < this.navigableNodes.length) {
      return this.navigableNodes[this.focusedIndex];
    }
    return null;
  }

  get flatData(): FlatTreemapNode[] {
    if (!this.currentRoot || !this.fullRoot) return [];
    return flattenTreemapHierarchy(
      this.currentRoot,
      0,
      '',
      '',
      this.currentRoot.value || 1,
      this.fullRoot.value || 1,
      this.unit,
      this.locale
    );
  }

  get breadcrumbTrail() {
    if (!this.fullRoot) return [];
    const trail = [{ id: this.fullRoot.id, label: this.fullRoot.label, depth: 0 }];
    let curr = this.fullRoot;
    for (let i = 0; i < this.drillStack.length; i++) {
      const stepId = this.drillStack[i];
      if (curr.children) {
        const next = curr.children.find(c => c.id === stepId);
        if (next) {
          trail.push({ id: next.id, label: next.label, depth: i + 1 });
          curr = next;
        }
      }
    }
    return trail;
  }

  getNodeColor(cat: string, idx: number): string {
    return this.colorScale[idx % this.colorScale.length];
  }

  getPatternId(idx: number): string {
    return this.patternPresetsList[idx % this.patternPresetsList.length].id;
  }

  formatVal(val: any): string {
    return formatVizValue(val, this.unit, this.locale);
  }

  getPctParent(node: any): string {
    const parentVal = this.currentRoot?.value || 1;
    return (((node?.value || 0) / parentVal) * 100).toFixed(1);
  }

  getPctRoot(node: any): string {
    const rootVal = this.fullRoot?.value || 1;
    return (((node?.value || 0) / rootVal) * 100).toFixed(1);
  }

  getLeafLabelFontSize(leaf: any): number {
    const isMobile = this.densityTier === 'mobile';
    const isTablet = this.densityTier === 'tablet';
    const isLarge = leaf.width >= (isMobile ? 90 : 110) && leaf.height >= (isMobile ? 55 : 70);
    const isMedium = leaf.width >= (isMobile ? 45 : 55) && leaf.height >= (isMobile ? 28 : 36);

    if (isMobile) return isLarge ? 11 : isMedium ? 9.5 : 8.5;
    if (isTablet) return isLarge ? 11.5 : isMedium ? 10 : 9;
    return isLarge ? 12.5 : isMedium ? 11 : 9.5;
  }

  getLeafValueFontSize(leaf: any): number {
    const isMobile = this.densityTier === 'mobile';
    const isTablet = this.densityTier === 'tablet';
    const isLarge = leaf.width >= (isMobile ? 90 : 110) && leaf.height >= (isMobile ? 55 : 70);
    const isMedium = leaf.width >= (isMobile ? 45 : 55) && leaf.height >= (isMobile ? 28 : 36);

    if (isMobile) return isLarge ? 10 : isMedium ? 9 : 8;
    if (isTablet) return isLarge ? 11 : isMedium ? 9.5 : 8.5;
    return isLarge ? 11.5 : isMedium ? 10 : 9;
  }

  getLeafPctFontSize(leaf: any): number {
    const isMobile = this.densityTier === 'mobile';
    const isTablet = this.densityTier === 'tablet';
    const isLarge = leaf.width >= (isMobile ? 90 : 110) && leaf.height >= (isMobile ? 55 : 70);
    const isMedium = leaf.width >= (isMobile ? 45 : 55) && leaf.height >= (isMobile ? 28 : 36);

    if (isMobile) return isLarge ? 9.5 : isMedium ? 8.5 : 7.5;
    if (isTablet) return isLarge ? 10 : isMedium ? 9 : 8;
    return isLarge ? 10.5 : isMedium ? 9.5 : 8.5;
  }

  truncateLabel(str: string, availPx: number, charPx: number): string {
    if (!str) return '';
    if (str.length * charPx <= availPx) return str;
    const maxChars = Math.max(2, Math.floor(availPx / charPx));
    return str.slice(0, maxChars) + '…';
  }

  getBranchHeaderLabel(branch: any): string {
    const hasDrill = this.enableDrilldown && branch.width >= 80;
    const reservedRight = hasDrill ? 48 : 12;
    const availPx = Math.max(10, branch.width - reservedRight - 8);
    return this.truncateLabel(branch.label, availPx, 6.2);
  }

  handleDrillUp(targetDepth: number): void {
    this.drillStack = this.drillStack.slice(0, targetDepth);
    this.focusedIndex = 0;
    this.announcement = this.drillStack.length === 0
      ? 'Returned to top-level plant view.'
      : `Navigated up hierarchy to level ${targetDepth}.`;
    this.drill.emit({ node: this.currentRoot, stack: this.drillStack });
    this.cdr.markForCheck();
  }

  onBranchClick(branch: any): void {
    if (!this.enableDrilldown || branch.isLeaf || !branch.children || branch.children.length === 0) return;
    this.drillStack.push(branch.id);
    this.focusedIndex = 0;
    this.announcement = `Drilled down into ${branch.label}. Total value: ${this.formatVal(branch.value)}.`;
    this.drill.emit({ node: branch, stack: this.drillStack });
    this.cdr.markForCheck();
  }

  onLeafClick(leaf: any): void {
    this.selectedId = leaf.id;
    const share = this.getPctParent(leaf);
    this.announcement = `Selected ${leaf.label}. Value: ${this.formatVal(leaf.value)} (${share}% of section).`;
    this.nodeClick.emit({ node: leaf });
    this.nodeSelect.emit({ node: leaf });
    this.cdr.markForCheck();
  }

  onPointerEnter(leaf: any, event: PointerEvent): void {
    const rect = this.containerRef?.nativeElement.getBoundingClientRect();
    this.hoveredNode = {
      ...leaf,
      clientX: event.clientX - (rect?.left || 0),
      clientY: event.clientY - (rect?.top || 0)
    };
  }

  onPointerMove(event: PointerEvent): void {
    if (this.hoveredNode) {
      const rect = this.containerRef?.nativeElement.getBoundingClientRect();
      this.hoveredNode = {
        ...this.hoveredNode,
        clientX: event.clientX - (rect?.left || 0),
        clientY: event.clientY - (rect?.top || 0)
      };
      this.cdr.markForCheck();
    }
  }

  onKeyDown(e: KeyboardEvent): void {
    // Alt+F11 shortcut
    if (e.altKey && e.key === 'F11') {
      e.preventDefault();
      this.isTableModalOpen = !this.isTableModalOpen;
      this.announcement = this.isTableModalOpen ? 'Opened accessible data table view.' : 'Closed data table view.';
      this.cdr.markForCheck();
      return;
    }

    if (this.isTableModalOpen) {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.isTableModalOpen = false;
        this.announcement = 'Closed data table view.';
        this.cdr.markForCheck();
      }
      return;
    }

    if (this.navigableNodes.length === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.focusedIndex = (this.focusedIndex + 1) % this.navigableNodes.length;
      const target = this.navigableNodes[this.focusedIndex];
      this.announcement = `Focused ${target.label}, ${this.formatVal(target.value)}`;
      this.cdr.markForCheck();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.focusedIndex = (this.focusedIndex - 1 + this.navigableNodes.length) % this.navigableNodes.length;
      const target = this.navigableNodes[this.focusedIndex];
      this.announcement = `Focused ${target.label}, ${this.formatVal(target.value)}`;
      this.cdr.markForCheck();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (this.focusedIndex >= 0 && this.focusedIndex < this.navigableNodes.length) {
        const node = this.navigableNodes[this.focusedIndex];
        if (!node.isLeaf && this.enableDrilldown) {
          this.onBranchClick(node);
        } else {
          this.onLeafClick(node);
        }
      }
    } else if (e.key === 'Backspace' || e.key === 'Escape') {
      if (this.drillStack.length > 0) {
        e.preventDefault();
        this.handleDrillUp(this.drillStack.length - 1);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      this.focusedIndex = 0;
      this.cdr.markForCheck();
    } else if (e.key === 'End') {
      e.preventDefault();
      this.focusedIndex = this.navigableNodes.length - 1;
      this.cdr.markForCheck();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleGlobalKeyDown(e: KeyboardEvent): void {
    if (e.altKey && e.key === 'F11') {
      const isTargetInside = this.containerRef?.nativeElement.contains(document.activeElement);
      if (isTargetInside) {
        e.preventDefault();
        this.isTableModalOpen = !this.isTableModalOpen;
        this.cdr.markForCheck();
      }
    }
  }
}
