import { DsFocusTrapDirective } from '../../utils/focus-trap.directive.js';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  HostListener,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  computeTreeTopology,
  createTreeLinkPath,
  VIZ_SEMANTIC_COLORS,
  TreeTopologyNode,
  TreeTopologyLink,
  getVizDensityTier,
  VizDensityTier
} from '../../utils/viz-core.js';

export interface TreeNode {
  id: string;
  label: string;
  category?: string;
  status?: 'operational' | 'maintenance' | 'alarm' | 'idle' | string;
  code?: string;
  role?: string;
  value?: number;
  children?: TreeNode[];
  [key: string]: any;
}

export interface FlatTreeNode {
  id: string;
  label: string;
  depth: number;
  category?: string;
  role?: string;
  code?: string;
  status?: string;
  childrenCount: number;
  parentLabel?: string;
}

function flattenTreeData(node: TreeNode, depth = 0, parentLabel = ''): FlatTreeNode[] {
  if (!node) return [];
  const current: FlatTreeNode = {
    id: node.id,
    label: node.label,
    depth,
    category: node.category,
    role: node.role,
    code: node.code,
    status: node.status,
    childrenCount: node.children ? node.children.length : 0,
    parentLabel: parentLabel || '—'
  };
  const children = (node.children || []).flatMap(child => flattenTreeData(child, depth + 1, node.label));
  return [current, ...children];
}

function isDescendantOf(descendantId: string | null | undefined, ancestorId: string, allNodes: any[]): boolean {
  if (!descendantId || !ancestorId || descendantId === ancestorId) return false;
  let curr = allNodes.find(n => n.id === descendantId);
  const visited = new Set<string>();
  while (curr && curr.parent && !visited.has(curr.id)) {
    visited.add(curr.id);
    if (curr.parent.id === ancestorId) return true;
    curr = allNodes.find(n => n.id === curr.parent.id);
  }
  return false;
}

@Component({
  selector: 'ds-tree-diagram',
  standalone: true,
  imports: [DsFocusTrapDirective, CommonModule],
  template: `
    <div
      #containerRef
      class="ds-tree-diagram"
      [style.width]="'100%'"
      [style.max-width.px]="width"
      role="tree"
      [attr.aria-label]="'Hierarchy Tree Diagram: ' + (title || 'Topology') + '. Use arrow keys to traverse hierarchy nodes, Enter to toggle expand/collapse.'"
      [attr.aria-activedescendant]="focusedNodeId ? 'td-node-' + focusedNodeId : null"
      tabindex="0"
      (keydown)="handleKeyDown($event)"
    >
      <!-- Live Region for Screen Reader Announcements -->
      <div aria-live="polite" class="sr-only">
        {{ announcement }}
      </div>

      <!-- Header & Controls Toolbar -->
      <div class="ds-tree-diagram__header">
        <div>
          <div *ngIf="title" class="ds-tree-diagram__title">{{ title }}</div>
          <div *ngIf="subtitle" class="ds-tree-diagram__subtitle">{{ subtitle }}</div>
        </div>

        <!-- Viewport & Table Modal Toolbar -->
        <div class="ds-tree-diagram__toolbar-group">
          <button
            type="button"
            class="ds-tree-diagram__btn-table"
            (click)="isTableModalOpen = true"
            aria-label="Open accessible data table modal (Alt+F11)"
            title="View accessible data table (Alt+F11)"
          >
            📊 Table <kbd class="ds-tree-diagram__kbd">Alt+F11</kbd>
          </button>

          <div *ngIf="zoomable" class="ds-tree-diagram__zoom-group">
            <button
              type="button"
              class="ds-tree-diagram__btn-zoom"
              (click)="handleZoomIn()"
              title="Zoom In"
              aria-label="Zoom in tree viewport"
            >+</button>
            <button
              type="button"
              class="ds-tree-diagram__btn-zoom"
              (click)="handleZoomOut()"
              title="Zoom Out"
              aria-label="Zoom out tree viewport"
            >&minus;</button>
            <button
              type="button"
              class="ds-tree-diagram__btn-zoom ds-tree-diagram__btn-zoom--reset"
              (click)="handleResetZoom()"
              title="Reset View"
              aria-label="Reset zoom and center view"
            >Reset</button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        *ngIf="!data"
        class="ds-tree-diagram__empty"
        [style.width]="'100%'"
        [style.height.px]="plotHeight"
      >
        No hierarchy topology data available
      </div>

      <!-- SVG Canvas Viewport -->
      <svg
        *ngIf="data"
        width="100%"
        [attr.height]="plotHeight"
        [attr.viewBox]="'0 0 ' + plotWidth + ' ' + plotHeight"
        class="ds-tree-diagram__svg"
        (mousedown)="handleMouseDown($event)"
        (mousemove)="handleMouseMove($event)"
        (mouseup)="handleMouseUp()"
        (mouseleave)="handleMouseUp()"
        [style.cursor]="isPanning ? 'grabbing' : (zoomable ? 'grab' : 'default')"
      >
        <defs>
          <filter id="ds-td-node-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.08" />
          </filter>
          <filter id="ds-td-active-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#2563eb" flood-opacity="0.2" />
          </filter>
        </defs>

        <g
          [attr.transform]="'translate(' + pan.x + ', ' + pan.y + ') scale(' + zoom + ')'"
          [style.transition]="isPanning ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)'"
        >
          <!-- 1. Hierarchy Link Edges -->
          <g class="tree-links">
            <path
              *ngFor="let link of topology.links"
              [attr.d]="getLinkPath(link)"
              fill="none"
              [attr.stroke]="activePathIds.linkIds.has(link.id) ? 'var(--action-solid, #2563eb)' : 'var(--border-strong, #cbd5e1)'"
              [attr.stroke-width]="activePathIds.linkIds.has(link.id) ? 2.5 : 1.5"
              class="ds-tree-diagram__link-path"
            />
          </g>

          <!-- 2. Hierarchy Entity Nodes -->
          <g class="tree-nodes">
            <g
              *ngFor="let node of topology.nodes"
              [attr.id]="'td-node-' + node.id"
              class="ds-tree-diagram__node-card"
              [attr.transform]="'translate(' + node.x + ', ' + node.y + ')'"
              (click)="handleSelectNode(node)"
              (mouseenter)="hoveredNodeId = node.id"
              (mouseleave)="hoveredNodeId = null"
              role="treeitem"
              [attr.aria-expanded]="collapsible && !node.isLeaf && node.childrenCount > 0 ? (!node.isCollapsed) : undefined"
              [attr.aria-selected]="node.id === currentSelectedId"
            >
              <!-- Card Background -->
              <rect
                [attr.width]="node.width"
                [attr.height]="node.height"
                rx="6"
                [attr.fill]="node.id === currentSelectedId ? 'var(--surface-active, #eff6ff)' : 'var(--surface-card, #ffffff)'"
                [attr.stroke]="(node.id === currentSelectedId || (isKeyboardNav && node.id === focusedNodeId)) ? 'var(--action-solid, #2563eb)' : (activePathIds.nodeIds.has(node.id) ? '#64748b' : 'var(--border-subtle, #cbd5e1)')"
                [attr.stroke-width]="(node.id === currentSelectedId || (isKeyboardNav && node.id === focusedNodeId)) ? 2 : (activePathIds.nodeIds.has(node.id) ? 1.5 : 1)"
                [attr.filter]="(node.id === currentSelectedId || (isKeyboardNav && node.id === focusedNodeId)) ? 'url(#ds-td-active-shadow)' : 'url(#ds-td-node-shadow)'"
                class="ds-tree-diagram__rect-transition"
              />

              <!-- Status Indicator Bar -->
              <rect
                x="0"
                y="0"
                width="4"
                [attr.height]="node.height"
                rx="2"
                [attr.fill]="(node.id === currentSelectedId || (isKeyboardNav && node.id === focusedNodeId)) ? 'var(--action-solid, #2563eb)' : (getStatusColor(node.status) || 'var(--border-strong, #94a3b8)')"
              />

              <!-- Label -->
              <text
                x="10"
                y="20"
                font-size="12px"
                font-weight="600"
                fill="var(--text-primary, #0f172a)"
                style="pointer-events: none;"
              >
                {{ node.label.length > 18 ? node.label.slice(0, 17) + '…' : node.label }}
              </text>

              <!-- Secondary Details -->
              <text
                x="10"
                y="36"
                font-size="10px"
                fill="var(--text-secondary, #64748b)"
                style="pointer-events: none;"
              >
                {{ node.code || node.role || (node.isLeaf ? 'Leaf Unit' : node.childrenCount + ' sub-units') }}
              </text>

              <!-- Status Dot & Text -->
              <g *ngIf="node.status" transform="translate(10, 42)">
                <circle cx="3" cy="3" r="3" [attr.fill]="getStatusColor(node.status) || '#64748b'" />
                <text x="9" y="6" font-size="9px" font-weight="500" [attr.fill]="getStatusColor(node.status) || '#64748b'">
                  {{ node.status }}
                </text>
              </g>

              <!-- Expand/Collapse Button Indicator -->
              <g
                *ngIf="collapsible && !node.isLeaf && node.childrenCount > 0"
                [attr.transform]="orientation === 'horizontal' ? 'translate(' + (node.width + 4) + ', ' + (node.height / 2) + ')' : 'translate(' + (node.width / 2) + ', ' + (node.height + 4) + ')'"
                (click)="toggleCollapse(node, $event)"
                role="button"
                [attr.aria-label]="node.isCollapsed ? 'Expand ' + node.label : 'Collapse ' + node.label"
                style="cursor: pointer;"
              >
                <circle r="8" fill="var(--surface-card, #ffffff)" stroke="var(--action-solid, #2563eb)" stroke-width="1.5" />
                <text text-anchor="middle" dy="3.5" font-size="10px" font-weight="700" fill="var(--action-solid, #2563eb)" style="pointer-events: none;">
                  {{ node.isCollapsed ? '+' : '−' }}
                </text>
              </g>
            </g>
          </g>
        </g>
      </svg>

      <!-- 2D Dark Enterprise Floating HUD Tooltip -->
      <div
        *ngIf="hoveredNode && tooltipStyle"
        class="ds-tree-diagram__tooltip"
        [ngStyle]="tooltipStyle"
        role="tooltip"
      >
        <!-- Tooltip Header -->
        <div class="ds-tree-diagram__tt-header">
          <div class="ds-tree-diagram__tt-title-group">
            <span
              class="ds-tree-diagram__tt-dot"
              [style.background]="getStatusColor(hoveredNode.status) || '#38bdf8'"
            ></span>
            <strong class="ds-tree-diagram__tt-title">
              {{ hoveredNode.label }}
            </strong>
          </div>
          <span class="ds-tree-diagram__tt-badge">
            Level {{ (hoveredNode.depth != null ? hoveredNode.depth + 1 : 1) }}
          </span>
        </div>

        <!-- Tooltip Details -->
        <div class="ds-tree-diagram__tt-body">
          <div *ngIf="hoveredNode.code" class="ds-tree-diagram__tt-row">
            <span>Asset / Part Code:</span>
            <strong class="ds-tree-diagram__tt-cyan-mono">{{ hoveredNode.code }}</strong>
          </div>
          <div *ngIf="hoveredNode.category || hoveredNode.role" class="ds-tree-diagram__tt-row">
            <span>Classification:</span>
            <span style="color: #ffffff; font-weight: 500;">{{ hoveredNode.category || hoveredNode.role }}</span>
          </div>
          <div *ngIf="hoveredNode.status" class="ds-tree-diagram__tt-row">
            <span>Health State:</span>
            <span [style.color]="getStatusColor(hoveredNode.status) || '#38bdf8'" style="font-weight: 600; text-transform: capitalize;">
              {{ hoveredNode.status }}
            </span>
          </div>
          <div class="ds-tree-diagram__tt-row">
            <span>Sub-units:</span>
            <strong class="ds-tree-diagram__tt-cyan">
              {{ hoveredNode.isLeaf ? '0 (Leaf Unit)' : hoveredNode.childrenCount + ' child nodes' }}
            </strong>
          </div>
          <div *ngIf="nodeLineage" class="ds-tree-diagram__tt-lineage">
            <span>Lineage: </span>{{ nodeLineage }}
          </div>
        </div>
      </div>

      <!-- Accessible Hierarchical Tree Table Modal (Alt+F11) -->
      <div dsFocusTrap tabindex="-1"
        *ngIf="isTableModalOpen"
        class="ds-tree-diagram__modal-backdrop"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="(title || 'Hierarchy Tree Diagram') + ' Data Table'"
        (click)="isTableModalOpen = false"
      >
        <div class="ds-tree-diagram__modal" (click)="$event.stopPropagation()">
          <!-- Modal Header -->
          <div class="ds-tree-diagram__modal-header">
            <div>
              <h4 class="ds-tree-diagram__modal-title">
                {{ title || 'Hierarchy Tree Diagram' }} — Equipment Taxonomy Table
              </h4>
              <div class="ds-tree-diagram__modal-subtitle">
                Total {{ flatData.length }} hierarchical asset and functional units
              </div>
            </div>
            <button
              type="button"
              class="ds-tree-diagram__modal-close-btn"
              (click)="isTableModalOpen = false"
              aria-label="Close data table modal"
            >✕</button>
          </div>

          <!-- Modal Table Body -->
          <div class="ds-tree-diagram__modal-body">
            <table class="ds-tree-diagram__table">
              <thead>
                <tr>
                  <th>Hierarchical Structure</th>
                  <th>Identifier / Code</th>
                  <th>Classification / Role</th>
                  <th>Health State</th>
                  <th style="text-align: center;">Level</th>
                  <th style="text-align: right;">Children</th>
                  <th>Parent Entity</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of flatData; let idx = index">
                  <td [style.font-weight]="row.depth === 0 ? 700 : 500">
                    <span [style.display]="'inline-block'" [style.width.px]="row.depth * 18"></span>
                    <span *ngIf="row.depth > 0" class="ds-tree-diagram__tree-indent-glyph">└─ </span>
                    {{ row.label }}
                  </td>
                  <td class="ds-tree-diagram__mono-cell">{{ row.code || row.id || '—' }}</td>
                  <td>{{ row.category || row.role || '—' }}</td>
                  <td>
                    <span *ngIf="row.status" class="ds-tree-diagram__status-pill">
                      <span class="ds-tree-diagram__status-dot" [style.background]="getStatusColor(row.status) || '#94a3b8'"></span>
                      {{ row.status }}
                    </span>
                    <span *ngIf="!row.status" style="color: var(--text-muted, #94a3b8);">—</span>
                  </td>
                  <td style="text-align: center;">L{{ row.depth + 1 }}</td>
                  <td style="text-align: right;">{{ row.childrenCount }}</td>
                  <td>{{ row.parentLabel }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Modal Footer -->
          <div class="ds-tree-diagram__modal-footer">
            <button
              type="button"
              class="ds-tree-diagram__modal-footer-btn"
              (click)="isTableModalOpen = false"
            >Close (Esc)</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./tree-diagram.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsTreeDiagramComponent implements OnInit {
  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;

  @Input() data: TreeNode = { id: 'root', label: 'Root System' };
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() linkStyle: 'smooth' | 'step' | 'straight' = 'smooth';
  @Input() nodeWidth: number = 160;
  @Input() nodeHeight: number = 56;
  @Input() levelSpacing: number = 75;
  @Input() siblingSpacing: number = 22;
  @Input() width: number = 800;
  @Input() height: number = 500;
  @Input() collapsible: boolean = true;
  @Input() initialCollapsedIds: string[] = [];
  @Input() selectedId: string | null = null;
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() zoomable: boolean = true;

  @Output() nodeClick = new EventEmitter<{ node: any }>();
  @Output() nodeSelect = new EventEmitter<{ node: any }>();
  @Output() nodeToggle = new EventEmitter<{ node: any }>();

  collapsedIds = new Set<string>();
  internalSelectedId: string | null = null;
  hoveredNodeId: string | null = null;
  focusedNodeId: string | null = null;
  isKeyboardNav: boolean = false;
  announcement: string = '';
  isTableModalOpen: boolean = false;

  // Viewport Pan & Zoom state
  zoom: number = 1;
  pan = { x: 0, y: 0 };
  isPanning: boolean = false;
  startPan = { x: 0, y: 0 };

  ngOnInit() {
    this.collapsedIds = new Set(this.initialCollapsedIds);
    const topo = this.topology;
    if (topo.nodes.length > 0) {
      this.focusedNodeId = topo.nodes[0].id;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleGlobalKeyDown(e: KeyboardEvent): void {
    if (e.altKey && e.key === 'F11') {
      e.preventDefault();
      this.isTableModalOpen = !this.isTableModalOpen;
    } else if (e.key === 'Escape' && this.isTableModalOpen) {
      this.isTableModalOpen = false;
    }
  }

  get currentSelectedId(): string | null {
    return this.selectedId !== undefined && this.selectedId !== null
      ? this.selectedId
      : this.internalSelectedId;
  }

  get topology() {
    return computeTreeTopology({
      rootNode: this.data,
      orientation: this.orientation,
      nodeWidth: this.nodeWidth,
      nodeHeight: this.nodeHeight,
      levelSpacing: this.levelSpacing,
      siblingSpacing: this.siblingSpacing,
      collapsedIds: this.collapsedIds
    });
  }

  get flatData(): FlatTreeNode[] {
    return flattenTreeData(this.data);
  }

  get activePathIds(): { nodeIds: Set<string>; linkIds: Set<string> } {
    const activeId = this.hoveredNodeId || this.currentSelectedId;
    if (!activeId) return { nodeIds: new Set<string>(), linkIds: new Set<string>() };

    const nodeIds = new Set<string>([activeId]);
    const linkIds = new Set<string>();
    const nodes = this.topology.nodes;

    let curr = nodes.find(n => n.id === activeId);
    const visited = new Set<string>();
    while (curr && curr.parent && !visited.has(curr.id)) {
      visited.add(curr.id);
      nodeIds.add(curr.parent.id);
      linkIds.add(`link-${curr.parent.id}-${curr.id}`);
      curr = nodes.find(n => n.id === curr!.parent!.id);
    }

    return { nodeIds, linkIds };
  }

  get hoveredNode(): any | null {
    if (!this.hoveredNodeId) return null;
    return this.topology.nodes.find(n => n.id === this.hoveredNodeId) || null;
  }

  get nodeLineage(): string {
    if (!this.hoveredNode) return '';
    const trail: string[] = [];
    const nodes = this.topology.nodes;
    let curr = this.hoveredNode;
    while (curr && curr.parent) {
      trail.unshift(curr.parent.label);
      curr = nodes.find(n => n.id === curr.parent?.id);
    }
    return trail.length > 0 ? trail.join(' › ') : 'Root Anchor';
  }

  get tooltipStyle(): Record<string, string> | null {
    if (!this.hoveredNode) return null;
    const nodeCenterX = this.pan.x + (this.hoveredNode.x + this.hoveredNode.width / 2) * this.zoom;
    const nodeTopY = this.pan.y + this.hoveredNode.y * this.zoom;
    const nodeBottomY = nodeTopY + this.hoveredNode.height * this.zoom;

    const tooltipWidth = 240;
    const tooltipHeight = 150;

    let left = nodeCenterX - tooltipWidth / 2;
    let top = nodeTopY - tooltipHeight - 12;

    if (top < 10) {
      top = nodeBottomY + 12;
    }
    if (left < 10) {
      left = 10;
    } else if (left + tooltipWidth > this.width - 10) {
      left = this.width - tooltipWidth - 10;
    }

    return {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      width: `${tooltipWidth}px`,
      pointerEvents: 'none',
      zIndex: '40',
      transition: 'left 0.08s ease, top 0.08s ease'
    };
  }

  getLinkPath(link: TreeTopologyLink): string {
    return createTreeLinkPath({
      source: link.source,
      target: link.target,
      orientation: this.orientation,
      linkStyle: this.linkStyle
    });
  }

  getStatusColor(status?: string): string | null {
    if (!status) return null;
    const s = status.toLowerCase();
    if (s === 'operational' || s === 'running' || s === 'active' || s === 'good') return VIZ_SEMANTIC_COLORS.success;
    if (s === 'maintenance' || s === 'warning' || s === 'derated') return VIZ_SEMANTIC_COLORS.warning;
    if (s === 'alarm' || s === 'critical' || s === 'stoppage' || s === 'failed') return VIZ_SEMANTIC_COLORS.critical;
    if (s === 'idle' || s === 'standby') return VIZ_SEMANTIC_COLORS.neutral;
    return VIZ_SEMANTIC_COLORS.info;
  }

  handleZoomIn(): void {
    this.zoom = Math.min(2.5, this.zoom + 0.2);
  }

  handleZoomOut(): void {
    this.zoom = Math.max(0.4, this.zoom - 0.2);
  }

  handleResetZoom(): void {
    this.zoom = 1;
    this.pan = { x: 0, y: 0 };
  }

  handleMouseDown(e: MouseEvent): void {
    this.isKeyboardNav = false;
    if (!this.zoomable) return;
    this.isPanning = true;
    this.startPan = { x: e.clientX - this.pan.x, y: e.clientY - this.pan.y };
  }

  handleMouseMove(e: MouseEvent): void {
    if (!this.isPanning || !this.zoomable) return;
    this.pan = { x: e.clientX - this.startPan.x, y: e.clientY - this.startPan.y };
  }

  handleMouseUp(): void {
    this.isPanning = false;
  }

  toggleCollapse(node: any, event: MouseEvent): void {
    event.stopPropagation();
    if (!this.collapsible || node.isLeaf || node.childrenCount === 0) return;

    const next = new Set(this.collapsedIds);
    const isCurrentlyCollapsed = next.has(node.id);

    if (isCurrentlyCollapsed) {
      // --- EXPAND BRANCH ---
      next.delete(node.id);
      this.announcement = `Expanded ${node.label}. ${node.childrenCount} child items visible.`;

      // Auto-frame newly expanded children cluster into viewport
      const nextTopo = computeTreeTopology({
        rootNode: this.data,
        orientation: this.orientation,
        nodeWidth: this.nodeWidth,
        nodeHeight: this.nodeHeight,
        levelSpacing: this.levelSpacing,
        siblingSpacing: this.siblingSpacing,
        collapsedIds: next
      });

      const expandedNode = nextTopo.nodes.find(n => n.id === node.id);
      const expandedChildren = nextTopo.nodes.filter(n => n.parent?.id === node.id);

      if (expandedNode && expandedChildren.length > 0) {
        const cluster = [expandedNode, ...expandedChildren];
        const minX = Math.min(...cluster.map(n => n.x));
        const maxX = Math.max(...cluster.map(n => n.x + n.width));
        const minY = Math.min(...cluster.map(n => n.y));
        const maxY = Math.max(...cluster.map(n => n.y + n.height));

        const margin = 48;
        let shiftX = 0;
        let shiftY = 0;

        const screenMinX = this.pan.x + minX * this.zoom;
        const screenMaxX = this.pan.x + maxX * this.zoom;
        const screenMinY = this.pan.y + minY * this.zoom;
        const screenMaxY = this.pan.y + maxY * this.zoom;

        if (screenMaxX > this.width - margin) {
          shiftX = (this.width - margin) - screenMaxX;
        } else if (screenMinX < margin) {
          shiftX = margin - screenMinX;
        }

        if (screenMaxY > this.height - margin) {
          shiftY = (this.height - margin) - screenMaxY;
        } else if (screenMinY < margin) {
          shiftY = margin - screenMinY;
        }

        if (shiftX !== 0 || shiftY !== 0) {
          this.pan = { x: this.pan.x + shiftX, y: this.pan.y + shiftY };
        }
      }
    } else {
      // --- COLLAPSE BRANCH ---
      next.add(node.id);

      // A11y Focus Invariant: If focus or selection was inside hidden subtree, shift to parent
      const currentNodes = this.topology.nodes;
      if (isDescendantOf(this.focusedNodeId, node.id, currentNodes)) {
        this.focusedNodeId = node.id;
        this.announcement = `Collapsed ${node.label}. Focus shifted to parent.`;
      } else {
        this.announcement = `Collapsed ${node.label}. ${node.childrenCount} child items hidden.`;
      }

      if (isDescendantOf(this.currentSelectedId, node.id, currentNodes)) {
        this.internalSelectedId = node.id;
      }
    }

    this.collapsedIds = next;
    this.nodeToggle.emit({ node });
  }

  handleSelectNode(node: any): void {
    this.isKeyboardNav = false;
    this.internalSelectedId = node.id;
    this.focusedNodeId = node.id;
    this.announcement = `Selected ${node.label}${node.status ? ', status: ' + node.status : ''}${node.role ? ', role: ' + node.role : ''}.`;
    this.nodeClick.emit({ node });
    this.nodeSelect.emit({ node });
  }

  handleKeyDown(e: KeyboardEvent): void {
    const nodes = this.topology.nodes;
    if (!nodes || nodes.length === 0) return;
    const currentIndex = nodes.findIndex(n => n.id === this.focusedNodeId);
    const currNode = currentIndex >= 0 ? nodes[currentIndex] : nodes[0];
    const isHorizontal = this.orientation === 'horizontal';

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.isKeyboardNav = true;
      if (isHorizontal) {
        if (!currNode.isLeaf && currNode.isCollapsed && this.collapsible) {
          this.toggleCollapse(currNode, e as any);
        } else {
          const children = nodes.filter(n => n.parent?.id === currNode.id);
          if (children.length > 0) {
            this.focusedNodeId = children[0].id;
            this.announcement = `Focused child: ${children[0].label}`;
          }
        }
      } else {
        const nextIdx = (currentIndex + 1) % nodes.length;
        this.focusedNodeId = nodes[nextIdx].id;
        this.announcement = `Focused: ${nodes[nextIdx].label}`;
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.isKeyboardNav = true;
      if (isHorizontal) {
        if (!currNode.isLeaf && !currNode.isCollapsed && this.collapsible) {
          this.toggleCollapse(currNode, e as any);
        } else if (currNode.parent) {
          this.focusedNodeId = currNode.parent.id;
          this.announcement = `Focused parent: ${currNode.parent.label}`;
        }
      } else {
        const prevIdx = (currentIndex - 1 + nodes.length) % nodes.length;
        this.focusedNodeId = nodes[prevIdx].id;
        this.announcement = `Focused: ${nodes[prevIdx].label}`;
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.isKeyboardNav = true;
      if (isHorizontal) {
        const nextIdx = (currentIndex + 1) % nodes.length;
        this.focusedNodeId = nodes[nextIdx].id;
        this.announcement = `Focused: ${nodes[nextIdx].label}`;
      } else {
        if (!currNode.isLeaf && currNode.isCollapsed && this.collapsible) {
          this.toggleCollapse(currNode, e as any);
        } else {
          const children = nodes.filter(n => n.parent?.id === currNode.id);
          if (children.length > 0) {
            this.focusedNodeId = children[0].id;
            this.announcement = `Focused child: ${children[0].label}`;
          }
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.isKeyboardNav = true;
      if (isHorizontal) {
        const prevIdx = (currentIndex - 1 + nodes.length) % nodes.length;
        this.focusedNodeId = nodes[prevIdx].id;
        this.announcement = `Focused: ${nodes[prevIdx].label}`;
      } else {
        if (!currNode.isLeaf && !currNode.isCollapsed && this.collapsible) {
          this.toggleCollapse(currNode, e as any);
        } else if (currNode.parent) {
          this.focusedNodeId = currNode.parent.id;
          this.announcement = `Focused parent: ${currNode.parent.label}`;
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.isKeyboardNav = true;
      if (currNode) {
        if (!currNode.isLeaf && this.collapsible) {
          this.toggleCollapse(currNode, e as any);
        } else {
          this.handleSelectNode(currNode);
        }
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      this.isKeyboardNav = true;
      this.focusedNodeId = nodes[0].id;
    } else if (e.key === 'End') {
      e.preventDefault();
      this.isKeyboardNav = true;
      this.focusedNodeId = nodes[nodes.length - 1].id;
    }
  }
}
