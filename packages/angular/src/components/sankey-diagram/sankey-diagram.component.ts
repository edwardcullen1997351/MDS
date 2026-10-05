import { DsFocusTrapDirective } from '../../utils/focus-trap.directive.js';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  computeSankeyLayout,
  createSankeyRibbonPath,
  VIZ_COLORS,
  PATTERN_PRESETS,
  formatVizValue,
  SankeyNode,
  SankeyLink,
  getVizDensityTier,
  VizDensityTier
} from '../../utils/viz-core.js';

@Component({
  selector: 'ds-sankey-diagram',
  standalone: true,
  imports: [DsFocusTrapDirective, CommonModule],
  template: `
    <div
      #containerEl
      class="ds-sankey-diagram"
      [style.width]="'100%'"
      role="region"
      [attr.aria-label]="title || 'Sankey Flow Diagram'"
      tabindex="0"
      (keydown)="handleKeyDown($event)"
    >
      <!-- Screen Reader Announcement Live Region -->
      <div aria-live="polite" class="sr-only" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0;">
        {{ announcement }}
      </div>

      <!-- Header & Toolbar Controls -->
      <div class="ds-sankey-diagram__header">
        <div>
          <h3 *ngIf="title" class="ds-sankey-diagram__title">{{ title }}</h3>
          <p *ngIf="subtitle" class="ds-sankey-diagram__subtitle">{{ subtitle }}</p>
        </div>

        <div class="ds-sankey-diagram__toolbar">
          <input
            type="text"
            placeholder="Search flow or node..."
            [value]="searchQuery"
            (input)="onSearchInput($event)"
            class="ds-sankey-diagram__search"
            aria-label="Filter flows by node name"
          />

          <button
            type="button"
            *ngIf="selectedId"
            (click)="clearSelection()"
            class="ds-sankey-diagram__btn"
            title="Clear Highlighted Pathway"
          >
            Reset Path
          </button>

          <button
            type="button"
            (click)="toggleTableModal()"
            class="ds-sankey-diagram__btn ds-sankey-diagram__btn--table"
            title="Open Accessible Data Table (Alt+F11)"
            aria-label="Open Accessible Data Table (Alt+F11)"
          >
            <span>📊 Table</span>
            <kbd class="ds-sankey-diagram__kbd">Alt+F11</kbd>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div
        *ngIf="!nodes || nodes.length === 0 || !links || links.length === 0"
        class="ds-sankey-diagram__empty"
        [style.height.px]="height"
      >
        <span>⚡ No flow network telemetry available to display</span>
      </div>

      <!-- SVG Canvas -->
      <svg
        *ngIf="nodes && nodes.length > 0 && links && links.length > 0"
        width="100%"
        [attr.height]="height"
        [attr.viewBox]="'0 0 ' + plotWidth + ' ' + height"
        class="ds-sankey-diagram__svg"
        style="display: block; width: 100%; height: auto;"
      >
        <defs>
          <!-- Pattern Fills for WCAG 1.4.1 Non-Color Differentiation -->
          <ng-container *ngIf="patternFills">
            <pattern
              *ngFor="let pat of patternPresets"
              [attr.id]="'sankey-pat-ng-' + pat.id"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              [attr.patternTransform]="pat.transform || null"
            >
              <circle
                *ngIf="pat.type === 'circle'"
                cx="4"
                cy="4"
                [attr.r]="pat.r || 1.2"
                fill="currentColor"
                style="color: var(--text-inverse, rgba(255,255,255,0.45));"
              />
              <line
                *ngIf="pat.type !== 'circle'"
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke="currentColor"
                [attr.stroke-width]="pat.strokeWidth || 1.5"
                style="color: var(--text-inverse, rgba(255,255,255,0.4));"
              />
            </pattern>
          </ng-container>

          <!-- Smooth Link Gradients -->
          <ng-container *ngIf="linkGradient">
            <linearGradient
              *ngFor="let link of layoutResult.links"
              [attr.id]="'grad-ng-' + link.id"
              gradientUnits="userSpaceOnUse"
              [attr.x1]="link.source.x + link.source.width"
              y1="0"
              [attr.x2]="link.target.x"
              y2="0"
            >
              <stop offset="0%" [attr.stop-color]="getNodeColor(link.source.category || link.source.label)" stop-opacity="0.65" />
              <stop offset="100%" [attr.stop-color]="getNodeColor(link.target.category || link.target.label)" stop-opacity="0.65" />
            </linearGradient>
          </ng-container>

          <filter id="sankey-node-glow-ng" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="var(--border-strong, #0f172a)" flood-opacity="0.3" />
          </filter>
        </defs>

        <!-- Stage Headers -->
        <g *ngIf="layoutResult.stages && layoutResult.stages.length > 1 && width >= 400">
          <ng-container *ngFor="let stageNodes of layoutResult.stages; let colIdx = index">
            <text
              *ngIf="stageNodes.length > 0"
              [attr.x]="getStageHeaderX(colIdx)"
              y="18"
              [attr.text-anchor]="getStageHeaderAnchor(colIdx)"
              font-size="10"
              font-weight="600"
              fill="var(--text-muted, #64748b)"
              style="text-transform: uppercase; letter-spacing: 0.04em;"
            >
              {{ getStageTitle(colIdx) }}
            </text>
          </ng-container>
        </g>

        <!-- Link Ribbons -->
        <g class="ds-sankey-diagram__links">
          <path
            *ngFor="let link of layoutResult.links"
            class="ds-sankey-diagram__ribbon"
            [attr.d]="getRibbonPath(link)"
            [attr.fill]="linkGradient ? 'url(#grad-ng-' + link.id + ')' : getNodeColor(link.source.category || link.source.label)"
            [attr.stroke]="link.id === selectedId ? 'var(--border-strong, #0f172a)' : (isPathActive(link.id, 'link') ? 'var(--border-strong, rgba(15,23,42,0.6))' : 'var(--border-subtle, rgba(255,255,255,0.2))')"
            [attr.stroke-width]="link.id === selectedId ? 2 : (isPathActive(link.id, 'link') ? 1.5 : 0.5)"
            [attr.opacity]="isLinkDimmed(link.id) ? 0.12 : (isPathActive(link.id, 'link') ? 0.92 : 0.55)"
            (click)="onSelectLink(link)"
            (pointerenter)="onLinkPointerEnter($event, link)"
            (pointermove)="onLinkPointerMove($event)"
            (pointerleave)="hoveredItem = null"
          />
        </g>

        <!-- Stage Nodes -->
        <g class="ds-sankey-diagram__nodes">
          <g
            *ngFor="let node of layoutResult.nodes; let i = index"
            class="ds-sankey-diagram__node"
            [attr.transform]="'translate(' + node.x + ', ' + node.y + ')'"
            (click)="onSelectNode(node)"
            (pointerenter)="onNodePointerEnter($event, node)"
            (pointermove)="onNodePointerMove($event)"
            (pointerleave)="hoveredItem = null"
          >
            <title>{{ node.label }} ({{ formatVal(node.value) }})</title>
            <rect
              x="0"
              y="0"
              [attr.width]="node.width"
              [attr.height]="node.height"
              [attr.fill]="getNodeColor(node.category || node.label)"
              [attr.stroke]="node.id === selectedId || focusedIndex === i ? 'var(--border-strong, #0f172a)' : 'var(--surface-card, #ffffff)'"
              [attr.stroke-width]="node.id === selectedId || focusedIndex === i ? 2.5 : 1"
              rx="3"
              [attr.filter]="node.id === selectedId ? 'url(#sankey-node-glow-ng)' : null"
              [attr.opacity]="isNodeDimmed(node.id) ? 0.3 : 1.0"
            />

            <!-- Hatch Pattern Overlay -->
            <rect
              *ngIf="patternFills && getNodePattern(node.category || node.label)"
              x="0"
              y="0"
              [attr.width]="node.width"
              [attr.height]="node.height"
              [attr.fill]="'url(#sankey-pat-ng-' + getNodePattern(node.category || node.label).id + ')'"
              rx="3"
              style="pointer-events: none;"
              [attr.opacity]="isNodeDimmed(node.id) ? 0.1 : 0.8"
            />

            <!-- Direct Node Label with Theme-Adaptive Text Halo -->
            <text
              [attr.x]="getNodeTextX(node)"
              [attr.y]="getNodeTextY(node)"
              [attr.text-anchor]="getNodeTextAnchor(node)"
              font-size="11"
              font-weight="600"
              fill="var(--text-primary, #0f172a)"
              style="pointer-events: none; paint-order: stroke fill; stroke: var(--surface-card, #ffffff); stroke-width: 3.5px; stroke-linejoin: round;"
            >
              {{ getNodeDisplayLabel(node.label) }}
            </text>

            <!-- Numeric Metric Line -->
            <text
              *ngIf="shouldShowNodeValue(node)"
              [attr.x]="getNodeTextX(node)"
              [attr.y]="getNodeTextY(node) + 12"
              [attr.text-anchor]="getNodeTextAnchor(node)"
              font-size="9.5"
              font-weight="500"
              fill="var(--text-secondary, #64748b)"
              style="pointer-events: none; paint-order: stroke fill; stroke: var(--surface-card, #ffffff); stroke-width: 3px; font-variant-numeric: tabular-nums;"
            >
              {{ formatVal(node.value) }}
            </text>
          </g>
        </g>
      </svg>

      <!-- 2D Quad-Flip Hover Tooltip -->
      <div
        *ngIf="hoveredItem"
        class="ds-sankey-diagram__tooltip"
        [style.left.px]="tooltipX"
        [style.top.px]="tooltipY"
      >
        <ng-container *ngIf="hoveredItem.type === 'link'">
          <div style="font-weight: 600; font-size: 12px; color: #ffffff; margin-bottom: 4px;">
            {{ hoveredItem.item.source.label }} → {{ hoveredItem.item.target.label }}
          </div>
          <div style="display: flex; justify-content: space-between; gap: 12px; margin-top: 2px;">
            <span style="color: #94a3b8;">Flow Volume:</span>
            <strong style="color: #38bdf8; font-variant-numeric: tabular-nums;">
              {{ formatVal(hoveredItem.item.value) }}
            </strong>
          </div>
          <div style="display: flex; justify-content: space-between; gap: 12px;">
            <span style="color: #94a3b8;">% of {{ hoveredItem.item.source.label }}:</span>
            <span style="font-variant-numeric: tabular-nums;">
              {{ ((hoveredItem.item.value / (hoveredItem.item.source.value || 1)) * 100).toFixed(1) }}%
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; gap: 12px;">
            <span style="color: #94a3b8;">% of {{ hoveredItem.item.target.label }}:</span>
            <span style="font-variant-numeric: tabular-nums;">
              {{ ((hoveredItem.item.value / (hoveredItem.item.target.value || 1)) * 100).toFixed(1) }}%
            </span>
          </div>
        </ng-container>

        <ng-container *ngIf="hoveredItem.type === 'node'">
          <div style="font-weight: 600; font-size: 12px; color: #ffffff; margin-bottom: 4px;">
            {{ hoveredItem.item.label }} (Stage {{ hoveredItem.item.column + 1 }})
          </div>
          <div style="display: flex; justify-content: space-between; gap: 12px; margin-top: 2px;">
            <span style="color: #94a3b8;">Net Throughput:</span>
            <strong style="color: #38bdf8; font-variant-numeric: tabular-nums;">
              {{ formatVal(hoveredItem.item.value) }}
            </strong>
          </div>
          <div *ngIf="hoveredItem.item.inValue > 0" style="display: flex; justify-content: space-between; gap: 12px;">
            <span style="color: #94a3b8;">Total Inflow:</span>
            <span style="font-variant-numeric: tabular-nums;">{{ formatVal(hoveredItem.item.inValue) }}</span>
          </div>
          <div *ngIf="hoveredItem.item.outValue > 0" style="display: flex; justify-content: space-between; gap: 12px;">
            <span style="color: #94a3b8;">Total Outflow:</span>
            <span style="font-variant-numeric: tabular-nums;">{{ formatVal(hoveredItem.item.outValue) }}</span>
          </div>
        </ng-container>
      </div>

      <!-- Non-Spatial Accessible Data Table Modal (Alt+F11) -->
      <div dsFocusTrap tabindex="-1"
        *ngIf="isTableModalOpen"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="tableTitleId"
        class="ds-sankey-diagram__modal-backdrop"
        (click)="onBackdropClick($event)"
      >
        <div class="ds-sankey-diagram__modal">
          <div class="ds-sankey-diagram__modal-header">
            <div>
              <h3 [id]="tableTitleId" style="margin: 0; font-size: 15px; font-weight: 600;">
                {{ title || 'Sankey Flow' }} — Accessible Data Table
              </h3>
              <div style="font-size: 12px; color: var(--text-secondary, #64748b); margin-top: 2px;">
                Total Network Volume: {{ formatVal(totalFlowVolume) }} across {{ layoutResult.links.length }} active streams
              </div>
            </div>
            <button
              type="button"
              (click)="isTableModalOpen = false"
              class="ds-sankey-diagram__modal-close"
              aria-label="Close table modal"
            >
              ✕
            </button>
          </div>

          <div class="ds-sankey-diagram__modal-body">
            <table class="ds-sankey-diagram__table">
              <thead>
                <tr>
                  <th style="text-align: left;">Source Origin</th>
                  <th style="text-align: left;">Destination</th>
                  <th style="text-align: right;">Volume ({{ unit.trim() || 'Units' }})</th>
                  <th style="text-align: right;">% of Source</th>
                  <th style="text-align: right;">% of Target</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  *ngFor="let l of layoutResult.links"
                  [style.background]="selectedId === l.id ? 'var(--surface-sunken, #f1f5f9)' : 'transparent'"
                >
                  <td style="font-weight: 500;">{{ l.source.label }}</td>
                  <td style="font-weight: 500;">{{ l.target.label }}</td>
                  <td style="text-align: right; font-weight: 600; font-variant-numeric: tabular-nums;">
                    {{ formatVal(l.value) }}
                  </td>
                  <td style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-secondary, #64748b);">
                    {{ ((l.value / (l.source.value || 1)) * 100).toFixed(1) }}%
                  </td>
                  <td style="text-align: right; font-variant-numeric: tabular-nums; color: var(--text-secondary, #64748b);">
                    {{ ((l.value / (l.target.value || 1)) * 100).toFixed(1) }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="ds-sankey-diagram__modal-footer">
            <button type="button" (click)="isTableModalOpen = false" class="ds-sankey-diagram__btn ds-sankey-diagram__btn--primary">
              Close (<kbd style="font-size: 10px;">Esc</kbd>)
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./sankey-diagram.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsSankeyDiagramComponent implements AfterViewInit, OnDestroy {
  private static nextId = 0;
  tableTitleId = `ds-sankey-table-title-${++DsSankeyDiagramComponent.nextId}`;
  @Input() nodes: any[] = [];
  @Input() links: any[] = [];
  @Input() width: number = 780;
  @Input() height: number = 440;
  @Input() nodeWidth: number = 20;
  @Input() nodePadding: number = 18;
  @Input() align: 'justify' | 'left' | 'right' | 'center' = 'justify';
  @Input() colorScale: string[] = VIZ_COLORS;
  @Input() linkGradient: boolean = true;
  @Input() patternFills: boolean = true;
  @Input() unit: string = '';
  @Input() locale: string = 'en-IN';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() selectedId: string | null = null;

  @Output() nodeClick = new EventEmitter<{ node: any }>();
  @Output() linkClick = new EventEmitter<{ link: any }>();
  @Output() selectionChange = new EventEmitter<{ type: 'node' | 'link'; item: any } | null>();

  @ViewChild('containerEl') containerEl!: ElementRef<HTMLDivElement>;

  patternPresets = PATTERN_PRESETS;
  hoveredItem: { type: 'node' | 'link'; item: any; clientX: number; clientY: number } | null = null;
  focusedIndex: number = 0;
  announcement: string = '';
  searchQuery: string = '';
  isTableModalOpen: boolean = false;

  measuredWidth: number = 0;
  private resizeObserver?: ResizeObserver;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.containerEl?.nativeElement && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = Math.floor(entry.contentRect.width);
          if (w > 0) {
            this.measuredWidth = w;
            this.cdr.markForCheck();
          }
        }
      });
      this.resizeObserver.observe(this.containerEl.nativeElement);
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

  get filteredLinks(): any[] {
    if (!this.links) return [];
    if (!this.searchQuery.trim()) return this.links;
    const q = this.searchQuery.toLowerCase();
    return this.links.filter(l => {
      const s = typeof l.source === 'object' ? l.source.label || l.source.id : l.source;
      const t = typeof l.target === 'object' ? l.target.label || l.target.id : l.target;
      return String(s).toLowerCase().includes(q) || String(t).toLowerCase().includes(q);
    });
  }

  get layoutResult() {
    const isMobile = this.densityTier === 'compact' || this.densityTier === 'mobile';
    return computeSankeyLayout({
      nodes: this.nodes,
      links: this.filteredLinks,
      width: this.plotWidth,
      height: this.height,
      nodeWidth: isMobile ? Math.min(this.nodeWidth, 14) : this.nodeWidth,
      nodePadding: isMobile ? Math.min(this.nodePadding, 8) : this.nodePadding,
      align: this.align,
      margin: isMobile ? { top: 28, right: 16, bottom: 24, left: 16 } : { top: 32, right: 32, bottom: 28, left: 32 }
    });
  }

  get totalFlowVolume(): number {
    return (this.layoutResult.links || []).reduce((sum, l) => sum + (Number(l.value) || 0), 0);
  }

  get activePathSets(): { nodeIds: Set<string>; linkIds: Set<string>; isActive: boolean } {
    const activeNodeIds = new Set<string>();
    const activeLinkIds = new Set<string>();

    const activeTarget = this.hoveredItem?.item || (this.selectedId ? (
      (this.layoutResult.nodes || []).find(n => n.id === this.selectedId) ||
      (this.layoutResult.links || []).find(l => l.id === this.selectedId)
    ) : null);

    if (!activeTarget) return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: false };

    if (activeTarget.source && activeTarget.target) {
      activeLinkIds.add(activeTarget.id);
      activeNodeIds.add(activeTarget.source.id);
      activeNodeIds.add(activeTarget.target.id);
    } else {
      activeNodeIds.add(activeTarget.id);

      const downstreamQueue = [activeTarget];
      let dCount = 0;
      while (downstreamQueue.length > 0 && dCount++ < 1000) {
        const curr = downstreamQueue.shift();
        if (!curr) break;
        curr.outLinks?.forEach((l: any) => {
          activeLinkIds.add(l.id);
          if (l.target && !activeNodeIds.has(l.target.id)) {
            activeNodeIds.add(l.target.id);
            downstreamQueue.push(l.target);
          }
        });
      }

      const upstreamQueue = [activeTarget];
      let uCount = 0;
      while (upstreamQueue.length > 0 && uCount++ < 1000) {
        const curr = upstreamQueue.shift();
        if (!curr) break;
        curr.inLinks?.forEach((l: any) => {
          activeLinkIds.add(l.id);
          if (l.source && !activeNodeIds.has(l.source.id)) {
            activeNodeIds.add(l.source.id);
            upstreamQueue.push(l.source);
          }
        });
      }
    }

    return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: true };
  }

  get tooltipX(): number {
    if (!this.hoveredItem) return 0;
    const tooltipW = 230;
    const isRightHalf = this.hoveredItem.clientX > this.width * 0.52;
    const targetX = isRightHalf
      ? this.hoveredItem.clientX - tooltipW - 16
      : this.hoveredItem.clientX + 16;
    return Math.max(12, Math.min(targetX, this.width - tooltipW - 12));
  }

  get tooltipY(): number {
    if (!this.hoveredItem) return 0;
    const tooltipH = this.hoveredItem.type === 'link' ? 100 : 90;
    const isBottomHalf = this.hoveredItem.clientY > this.height * 0.58;
    const targetY = isBottomHalf
      ? this.hoveredItem.clientY - tooltipH - 12
      : this.hoveredItem.clientY + 12;
    return Math.max(12, Math.min(targetY, this.height - tooltipH - 12));
  }

  isPathActive(id: string, type: 'node' | 'link'): boolean {
    const paths = this.activePathSets;
    return type === 'node' ? paths.nodeIds.has(id) : paths.linkIds.has(id);
  }

  isNodeDimmed(id: string): boolean {
    const paths = this.activePathSets;
    return paths.isActive && !paths.nodeIds.has(id);
  }

  isLinkDimmed(id: string): boolean {
    const paths = this.activePathSets;
    return paths.isActive && !paths.linkIds.has(id);
  }

  getRibbonPath(link: any): string {
    return createSankeyRibbonPath({ link, curvature: 0.5 });
  }

  getNodeColor(cat: string): string {
    const str = String(cat || '');
    const idx = Math.abs(str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
    return this.colorScale[idx % this.colorScale.length];
  }

  getNodePattern(cat: string): any {
    const str = String(cat || '');
    const idx = Math.abs(str.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
    return this.patternPresets[idx % this.patternPresets.length];
  }

  getStageHeaderX(colIdx: number): number {
    const stages = this.layoutResult.stages || [];
    if (!stages[colIdx] || stages[colIdx].length === 0) return 0;
    const colX = stages[colIdx][0].x;
    if (colIdx === 0) return colX;
    if (colIdx === stages.length - 1) return colX + this.nodeWidth;
    return colX + this.nodeWidth / 2;
  }

  getStageHeaderAnchor(colIdx: number): 'start' | 'middle' | 'end' {
    const stages = this.layoutResult.stages || [];
    if (colIdx === 0) return 'start';
    if (colIdx === stages.length - 1) return 'end';
    return 'middle';
  }

  getStageTitle(colIdx: number): string {
    const stages = this.layoutResult.stages || [];
    if (colIdx === 0) return this.width >= 600 ? 'Input Origin' : 'Input';
    if (colIdx === stages.length - 1) return this.width >= 600 ? 'Output Destination' : 'Output';
    return (this.width / Math.max(1, stages.length) < 110) ? `S${colIdx + 1}` : `Stage ${colIdx + 1}`;
  }

  getNodeDisplayLabel(label: string): string {
    const stages = this.layoutResult.stages || [];
    const colSpacing = stages.length > 1 ? (this.width - 64 - this.nodeWidth) / (stages.length - 1) : this.width;
    const maxChars = Math.max(10, Math.floor((colSpacing - this.nodeWidth - 12) / 7.2));
    return label.length > maxChars ? `${label.slice(0, maxChars - 1)}…` : label;
  }

  getNodeTextX(node: any): number {
    const stages = this.layoutResult.stages || [];
    const isRight = node.column === (stages.length - 1);
    const isLeft = node.column === 0;
    if (isRight) return -8;
    if (isLeft) return node.width + 8;
    return node.width / 2;
  }

  getNodeTextY(node: any): number {
    const stages = this.layoutResult.stages || [];
    const isMiddle = node.column !== 0 && node.column !== (stages.length - 1);
    if (isMiddle && node.height < 24) return -6;
    return node.height / 2 + 4;
  }

  getNodeTextAnchor(node: any): 'start' | 'middle' | 'end' {
    const stages = this.layoutResult.stages || [];
    if (node.column === (stages.length - 1)) return 'end';
    if (node.column === 0) return 'start';
    return 'middle';
  }

  shouldShowNodeValue(node: any): boolean {
    const stages = this.layoutResult.stages || [];
    const isMiddle = node.column !== 0 && node.column !== (stages.length - 1);
    return node.height >= 26 && !isMiddle;
  }

  formatVal(val: any): string {
    return formatVizValue(val, this.unit, this.locale);
  }

  onSelectNode(node: any): void {
    const nextId = this.selectedId === node.id ? null : node.id;
    this.selectedId = nextId;
    this.announcement = `Selected node ${node.label}. Net flow: ${this.formatVal(node.value)}.`;
    this.nodeClick.emit({ node });
    this.selectionChange.emit(nextId ? { type: 'node', item: node } : null);
  }

  onSelectLink(link: any): void {
    const nextId = this.selectedId === link.id ? null : link.id;
    this.selectedId = nextId;
    this.announcement = `Selected flow from ${link.source.label} to ${link.target.label}. Volume: ${this.formatVal(link.value)}.`;
    this.linkClick.emit({ link });
    this.selectionChange.emit(nextId ? { type: 'link', item: link } : null);
  }

  clearSelection(): void {
    this.selectedId = null;
    this.selectionChange.emit(null);
    this.announcement = 'Cleared selection lock.';
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
  }

  toggleTableModal(): void {
    this.isTableModalOpen = !this.isTableModalOpen;
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.isTableModalOpen = false;
    }
  }

  onLinkPointerEnter(event: MouseEvent, link: any): void {
    const rect = this.containerEl?.nativeElement.getBoundingClientRect();
    this.hoveredItem = {
      type: 'link',
      item: link,
      clientX: event.clientX - (rect?.left || 0),
      clientY: event.clientY - (rect?.top || 0)
    };
  }

  onLinkPointerMove(event: MouseEvent): void {
    if (!this.hoveredItem) return;
    const rect = this.containerEl?.nativeElement.getBoundingClientRect();
    this.hoveredItem = {
      ...this.hoveredItem,
      clientX: event.clientX - (rect?.left || 0),
      clientY: event.clientY - (rect?.top || 0)
    };
  }

  onNodePointerEnter(event: MouseEvent, node: any): void {
    const rect = this.containerEl?.nativeElement.getBoundingClientRect();
    this.hoveredItem = {
      type: 'node',
      item: node,
      clientX: event.clientX - (rect?.left || 0),
      clientY: event.clientY - (rect?.top || 0)
    };
  }

  onNodePointerMove(event: MouseEvent): void {
    if (!this.hoveredItem) return;
    const rect = this.containerEl?.nativeElement.getBoundingClientRect();
    this.hoveredItem = {
      ...this.hoveredItem,
      clientX: event.clientX - (rect?.left || 0),
      clientY: event.clientY - (rect?.top || 0)
    };
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.altKey && (event.key === 'F11' || event.code === 'F11')) {
      event.preventDefault();
      this.toggleTableModal();
      return;
    }

    if (this.isTableModalOpen) {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.isTableModalOpen = false;
      }
      return;
    }

    const nodesList = this.layoutResult.nodes || [];
    if (nodesList.length === 0) return;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusedIndex = (this.focusedIndex + 1) % nodesList.length;
      const target = nodesList[this.focusedIndex];
      this.announcement = `Focused node ${target.label}, ${this.formatVal(target.value)}`;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusedIndex = (this.focusedIndex - 1 + nodesList.length) % nodesList.length;
      const target = nodesList[this.focusedIndex];
      this.announcement = `Focused node ${target.label}, ${this.formatVal(target.value)}`;
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (this.focusedIndex >= 0 && this.focusedIndex < nodesList.length) {
        this.onSelectNode(nodesList[this.focusedIndex]);
      }
    } else if (event.key === 'Escape') {
      if (this.selectedId) {
        event.preventDefault();
        this.clearSelection();
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  onGlobalKeyDown(event: KeyboardEvent): void {
    if (event.altKey && (event.key === 'F11' || event.code === 'F11')) {
      if (this.containerEl?.nativeElement.contains(document.activeElement)) {
        event.preventDefault();
        this.toggleTableModal();
      }
    }
  }
}
