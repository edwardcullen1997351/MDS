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
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  computeNetworkLayout,
  computeEdgePerimeterCoords,
  VIZ_COLORS,
  POINT_SYMBOLS,
  VIZ_SEMANTIC_COLORS,
  formatVizValue,
  NetworkNode,
  NetworkLink,
  getVizDensityTier,
  VizDensityTier
} from '../../utils/viz-core.js';

@Component({
  selector: 'ds-network-diagram',
  standalone: true,
  imports: [DsFocusTrapDirective, CommonModule, FormsModule],
  template: `
    <div
      #containerRef
      class="ds-network-diagram"
      [style.width]="'100%'"
      role="region"
      [attr.aria-label]="(title || 'Network Diagram') + '. ' + nodes.length + ' nodes, ' + links.length + ' edges. Use arrow keys to traverse, Alt+F11 for table.'"
      tabindex="0"
      (keydown)="onKeyDown($event)"
    >
      <!-- Live Region for Screen Reader Announcements -->
      <div aria-live="polite" class="sr-only">
        {{ announcement }}
      </div>

      <!-- Header & Controls Toolbar -->
      <div class="ds-network-diagram__header">
        <div>
          <div *ngIf="title" class="ds-network-diagram__title">{{ title }}</div>
          <div *ngIf="subtitle" class="ds-network-diagram__subtitle">{{ subtitle }}</div>
        </div>

        <div class="ds-network-diagram__toolbar">
          <!-- Dynamic Stretch Slider -->
          <div class="ds-network-diagram__stretch-control">
            <span class="ds-network-diagram__stretch-label">Stretch:</span>
            <input
              type="range"
              [min]="minSpread"
              [max]="maxSpread"
              step="0.1"
              [(ngModel)]="spreadMultiplier"
              class="ds-network-diagram__slider"
              [attr.aria-label]="'Stretch edge spacing from ' + minSpread + 'x to ' + maxSpread + 'x'"
            />
            <span class="ds-network-diagram__stretch-val">{{ spreadMultiplier.toFixed(1) }}x</span>
          </div>

          <!-- Search Filter Input -->
          <div *ngIf="searchable" class="ds-network-diagram__search-wrapper">
            <input
              type="text"
              placeholder="Search node..."
              [(ngModel)]="searchQuery"
              class="ds-network-diagram__search-input"
              aria-label="Filter network nodes"
            />
            <button
              *ngIf="searchQuery"
              type="button"
              (click)="searchQuery = ''"
              class="ds-network-diagram__search-clear"
            >&times;</button>
          </div>

          <!-- Zoom & Reset Controls -->
          <div *ngIf="zoomable" class="ds-network-diagram__zoom-group">
            <button
              type="button"
              (click)="onZoomIn()"
              class="ds-network-diagram__zoom-btn"
              title="Zoom In"
            >+</button>
            <button
              type="button"
              (click)="onZoomOut()"
              class="ds-network-diagram__zoom-btn"
              title="Zoom Out"
            >&minus;</button>
            <button
              type="button"
              (click)="onResetZoom()"
              class="ds-network-diagram__zoom-btn ds-network-diagram__zoom-btn--reset"
              title="Reset View and Node Positions"
            >Reset</button>
          </div>

          <!-- Accessible Table Modal Toggle Button -->
          <button
            type="button"
            (click)="showTableModal = !showTableModal"
            class="ds-network-diagram__table-toggle"
            [class.ds-network-diagram__table-toggle--active]="showTableModal"
            title="Toggle Accessible Relationship Table View (Alt+F11)"
            aria-label="Toggle Accessible Relationship Table View"
          >
            Table (Alt+F11)
          </button>
        </div>
      </div>

      <!-- SVG Viewport Canvas -->
      <div class="ds-network-diagram__svg-wrapper">
        <svg
          #svgRef
          width="100%"
          [attr.height]="height"
          [attr.viewBox]="'0 0 ' + plotWidth + ' ' + height"
          class="ds-network-diagram__svg"
          style="display: block; width: 100%; height: auto;"
          [style.cursor]="draggingNodeId ? 'grabbing' : (isPanning ? 'grabbing' : (zoomable ? 'grab' : 'default'))"
          (mousedown)="onCanvasMouseDown($event)"
          (mousemove)="onMouseMove($event)"
          (mouseup)="onMouseUp()"
          (mouseleave)="onMouseUp()"
        >
          <defs>
            <!-- Directed Arrowhead Marker -->
            <marker
              *ngIf="directed"
              id="ng-net-arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--border-strong, #94a3b8)" />
            </marker>
            <marker
              *ngIf="directed"
              id="ng-net-arrow-active"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--action-solid, #2563eb)" />
            </marker>
            <filter id="ng-net-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.25" flood-color="#2563eb" />
            </filter>
          </defs>

          <g [attr.transform]="'translate(' + pan.x + ', ' + pan.y + ') scale(' + zoom + ')'">
            <!-- 1. Relational Edges with Perimeter Clipping -->
            <g class="ds-network-diagram__edges">
              <line
                *ngFor="let link of processedLinks"
                [attr.x1]="link.coords.x1"
                [attr.y1]="link.coords.y1"
                [attr.x2]="link.coords.x2"
                [attr.y2]="link.coords.y2"
                [attr.stroke]="link.isActive || link.isSelected ? 'var(--action-solid, #2563eb)' : 'var(--border-strong, #cbd5e1)'"
                [attr.stroke-width]="link.isActive || link.isSelected ? link.strokeWidth + 1.5 : link.strokeWidth"
                [attr.stroke-opacity]="link.isDimmed ? 0.1 : (link.isActive ? 0.9 : 0.55)"
                [attr.marker-end]="directed ? (link.isActive ? 'url(#ng-net-arrow-active)' : 'url(#ng-net-arrow)') : null"
                (click)="onLinkSelect($event, link)"
                (mouseenter)="onLinkHover($event, link)"
                (mouseleave)="onHoverLeave()"
                class="ds-network-diagram__edge-line"
              />
            </g>

            <!-- 2. Entity Nodes -->
            <g class="ds-network-diagram__nodes">
              <g
                *ngFor="let node of processedNodes; let idx = index"
                class="ds-network-diagram__node-group"
                [attr.transform]="'translate(' + node.x + ', ' + node.y + ')'"
                (mousedown)="onNodeMouseDown(node, $event)"
                (click)="onNodeClickAction(node, $event)"
                (mouseenter)="onNodeHover($event, node)"
                (mouseleave)="onHoverLeave()"
                [style.cursor]="draggingNodeId === node.id ? 'grabbing' : (draggableNodes ? 'grab' : 'pointer')"
                role="button"
                tabindex="-1"
                [attr.aria-label]="node.label + ' (' + (node.category || 'default') + '), degree: ' + node.degree + '. Draggable.'"
              >
                <!-- Focus / Selection Ring -->
                <circle
                  *ngIf="node.isSelected || node.isFocused || draggingNodeId === node.id"
                  cx="0"
                  cy="0"
                  [attr.r]="(node.radius || 12) + 6"
                  fill="none"
                  stroke="var(--action-solid, #2563eb)"
                  stroke-width="2"
                  stroke-dasharray="3 2"
                />

                <!-- Critical / Warning Status Halo Ring -->
                <circle
                  *ngIf="node.status === 'critical'"
                  cx="0"
                  cy="0"
                  [attr.r]="(node.radius || 12) + 4"
                  fill="none"
                  stroke="var(--status-critical-solid, #ef4444)"
                  stroke-width="2.5"
                  stroke-opacity="0.85"
                />
                <circle
                  *ngIf="node.status === 'warning'"
                  cx="0"
                  cy="0"
                  [attr.r]="(node.radius || 12) + 3.5"
                  fill="none"
                  stroke="var(--status-warning-solid, #f59e0b)"
                  stroke-width="2"
                  stroke-opacity="0.8"
                />

                <!-- Primary Node Circle -->
                <circle
                  cx="0"
                  cy="0"
                  [attr.r]="node.radius || 12"
                  [attr.fill]="node.status === 'critical' ? 'var(--status-critical-solid, #ef4444)' : node.styleColor"
                  stroke="#ffffff"
                  [attr.stroke-width]="node.isSelected || draggingNodeId === node.id ? 3 : 2"
                  [attr.opacity]="node.isDimmed ? 0.15 : 1.0"
                  [attr.filter]="node.isSelected || draggingNodeId === node.id ? 'url(#ng-net-glow)' : null"
                />

                <!-- Geometric Dual-Encoding Symbol (WCAG 1.4.1) -->
                <rect
                  *ngIf="node.symbol === 'square'"
                  [attr.x]="-(node.radius || 12) / 2.5"
                  [attr.y]="-(node.radius || 12) / 2.5"
                  [attr.width]="(node.radius || 12) * 0.8"
                  [attr.height]="(node.radius || 12) * 0.8"
                  fill="#ffffff"
                  [attr.opacity]="node.isDimmed ? 0.2 : 0.85"
                  style="pointer-events: none;"
                />
                <polygon
                  *ngIf="node.symbol === 'diamond'"
                  [attr.points]="'0,' + (-(node.radius || 12) * 0.5) + ' ' + ((node.radius || 12) * 0.5) + ',0 0,' + ((node.radius || 12) * 0.5) + ' ' + (-(node.radius || 12) * 0.5) + ',0'"
                  fill="#ffffff"
                  [attr.opacity]="node.isDimmed ? 0.2 : 0.85"
                  style="pointer-events: none;"
                />

                <!-- Status Badge Pin -->
                <circle
                  *ngIf="node.status"
                  [attr.cx]="(node.radius || 12) * 0.7"
                  [attr.cy]="-(node.radius || 12) * 0.7"
                  r="3.5"
                  [attr.fill]="node.status === 'critical' ? '#ef4444' : node.status === 'warning' ? '#f59e0b' : '#10b981'"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  style="pointer-events: none;"
                />

                <!-- Node Label with Protective Halo -->
                <text
                  x="0"
                  [attr.y]="(node.radius || 12) + 13"
                  text-anchor="middle"
                  font-size="10"
                  font-weight="600"
                  fill="var(--text-primary, #0f172a)"
                  [attr.opacity]="node.isDimmed ? 0.2 : 1.0"
                  style="pointer-events: none; paint-order: stroke fill; stroke: var(--surface-card, #ffffff); stroke-width: 3.5px; stroke-linejoin: round; stroke-linecap: round;"
                >
                  {{ node.label }}
                </text>
              </g>
            </g>
          </g>
        </svg>

        <!-- Floating 2D Quad-Flip Non-Occluding Tooltip -->
        <div
          *ngIf="hoveredItem && !draggingNodeId"
          class="ds-network-diagram__tooltip"
          [style.left.px]="tooltipLeft"
          [style.top.px]="tooltipTop"
          role="tooltip"
        >
          <ng-container *ngIf="hoveredItem.type === 'node'">
            <div class="ds-network-diagram__tooltip-title">{{ hoveredItem.item.label }}</div>
            <div class="ds-network-diagram__tooltip-sub">Category: {{ hoveredItem.item.category || 'Standard' }}</div>
            <div *ngIf="hoveredItem.item.status" class="ds-network-diagram__tooltip-status" [class.is-critical]="hoveredItem.item.status === 'critical'" [class.is-warning]="hoveredItem.item.status === 'warning'" [class.is-nominal]="hoveredItem.item.status === 'nominal'">
              Status: <strong>{{ hoveredItem.item.status.toUpperCase() }}</strong>
            </div>
            <div class="ds-network-diagram__tooltip-row">
              <span>Network Degree:</span>
              <strong class="ds-network-diagram__highlight">{{ hoveredItem.item.degree }} connections</strong>
            </div>
            <div class="ds-network-diagram__tooltip-hint">(Click node to isolate neighborhood · Drag to stretch)</div>
          </ng-container>

          <ng-container *ngIf="hoveredItem.type === 'link'">
            <div class="ds-network-diagram__tooltip-title">
              {{ hoveredItem.item.source.label || hoveredItem.item.source.id }} &rarr; {{ hoveredItem.item.target.label || hoveredItem.item.target.id }}
            </div>
            <div class="ds-network-diagram__tooltip-row">
              <span>Edge Weight:</span>
              <strong class="ds-network-diagram__highlight">{{ hoveredItem.item.weight }}</strong>
            </div>
            <div *ngIf="hoveredItem.item.label" class="ds-network-diagram__tooltip-sub">
              Relation: {{ hoveredItem.item.label }}
            </div>
          </ng-container>
        </div>

        <!-- Accessible Relationship Table Modal (Alt+F11) -->
        <div dsFocusTrap tabindex="-1"
          *ngIf="showTableModal"
          class="ds-network-diagram__modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Accessible Network Adjacency Table"
        >
          <div class="ds-network-diagram__modal-card">
            <div class="ds-network-diagram__modal-header">
              <div>
                <div class="ds-network-diagram__modal-title">Accessible Network Topology Table</div>
                <div class="ds-network-diagram__modal-sub">Non-spatial tabular representation of graph vertices and connections</div>
              </div>
              <button
                type="button"
                (click)="showTableModal = false"
                class="ds-network-diagram__modal-close"
                aria-label="Close table modal"
              >&times;</button>
            </div>

            <div class="ds-network-diagram__modal-body">
              <table class="ds-network-diagram__table">
                <thead>
                  <tr>
                    <th>Node Label</th>
                    <th>Category</th>
                    <th>Degree</th>
                    <th>Status</th>
                    <th>Connected Neighbors</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let n of processedNodes">
                    <td class="font-bold">{{ n.label }}</td>
                    <td>{{ n.category || '—' }}</td>
                    <td class="tabular-nums font-bold">{{ n.degree }}</td>
                    <td>
                      <span
                        class="ds-network-diagram__badge"
                        [class.badge-critical]="n.status === 'critical'"
                        [class.badge-warning]="n.status === 'warning'"
                        [class.badge-nominal]="!n.status || n.status === 'nominal'"
                      >
                        {{ n.status ? n.status.toUpperCase() : 'NOMINAL' }}
                      </span>
                    </td>
                    <td class="text-secondary text-sm">{{ getNeighborsText(n.id) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="ds-network-diagram__modal-footer">
              <button
                type="button"
                (click)="showTableModal = false"
                class="ds-network-diagram__modal-btn"
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./network-diagram.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsNetworkDiagramComponent implements OnInit, AfterViewInit, OnDestroy {
  Math = Math;

  @Input() nodes: NetworkNode[] = [];
  @Input() links: NetworkLink[] = [];
  @Input() width: number = 760;
  @Input() height: number = 480;
  @Input() layout: 'force' | 'circular' = 'force';
  @Input() directed: boolean = true;
  @Input() colorScale: string[] = VIZ_COLORS;
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() searchable: boolean = true;
  @Input() zoomable: boolean = true;
  @Input() draggableNodes: boolean = true;
  @Input() initialSpread: number = 1.2;
  @Input() minSpread: number = 0.4;
  @Input() maxSpread: number = 4.0;
  @Input() selectedId: string | null = null;

  @Output() nodeClick = new EventEmitter<{ node: any }>();
  @Output() linkClick = new EventEmitter<{ link: any }>();
  @Output() selectionChange = new EventEmitter<{ selection: any }>();

  @ViewChild('containerRef') containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('svgRef') svgRef!: ElementRef<SVGSVGElement>;

  internalSelectedId: string | null = null;
  spreadMultiplier: number = 1.2;
  searchQuery: string = '';
  focusedIndex: number = 0;
  showTableModal: boolean = false;
  announcement: string = '';

  zoom: number = 1;
  pan: { x: number; y: number } = { x: 0, y: 0 };
  isPanning: boolean = false;
  startPan: { x: number; y: number } = { x: 0, y: 0 };

  draggingNodeId: string | null = null;
  dragOffset: { x: number; y: number } = { x: 0, y: 0 };
  nodePositions: Map<string, { x: number; y: number }> = new Map();

  hoveredItem: {
    type: 'node' | 'link';
    item: any;
    id: string;
    clientX: number;
    clientY: number;
  } | null = null;

  measuredWidth: number = 0;
  private resizeObserver?: ResizeObserver;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.spreadMultiplier = this.initialSpread;
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

  get activeSelectedId(): string | null {
    return this.selectedId !== undefined && this.selectedId !== null
      ? this.selectedId
      : this.internalSelectedId;
  }

  get layoutResult() {
    const isMobile = this.densityTier === 'compact' || this.densityTier === 'mobile';
    const effectiveSpread = isMobile ? this.spreadMultiplier * 0.75 : this.spreadMultiplier;
    return computeNetworkLayout({
      nodes: this.nodes,
      links: this.links,
      width: this.plotWidth,
      height: this.height,
      layout: this.layout,
      linkDistance: (isMobile ? 65 : 90) * effectiveSpread,
      repulsion: (isMobile ? 1200 : 1800) * (effectiveSpread * effectiveSpread)
    });
  }

  get categoryStyleMap(): Map<string, { color: string; symbol: string }> {
    const map = new Map<string, { color: string; symbol: string }>();
    this.nodes.forEach(n => {
      const cat = n.category || 'default';
      if (!map.has(cat)) {
        map.set(cat, {
          color: this.colorScale[map.size % this.colorScale.length],
          symbol: POINT_SYMBOLS[map.size % POINT_SYMBOLS.length]
        });
      }
    });
    return map;
  }

  get searchMatchIds(): Set<string> {
    if (!this.searchQuery.trim()) return new Set();
    const q = this.searchQuery.toLowerCase();
    const set = new Set<string>();
    this.nodes.forEach(n => {
      if (
        n.label.toLowerCase().includes(q) ||
        n.id.toLowerCase().includes(q) ||
        n.category?.toLowerCase().includes(q)
      ) {
        set.add(n.id);
      }
    });
    return set;
  }

  get activeNeighborhood(): { nodeIds: Set<string>; linkIds: Set<string>; isActive: boolean } {
    const activeNodeIds = new Set<string>();
    const activeLinkIds = new Set<string>();
    const activeTargetId = this.hoveredItem?.id || this.activeSelectedId;
    const { links, adjacencyMap } = this.layoutResult;

    if (this.searchMatchIds.size > 0) {
      this.searchMatchIds.forEach(id => activeNodeIds.add(id));
      links.forEach(l => {
        if (this.searchMatchIds.has(l.source.id) && this.searchMatchIds.has(l.target.id)) {
          activeLinkIds.add(l.id);
        }
      });
      return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: true };
    }

    if (!activeTargetId) return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: false };

    const targetNode = this.nodes.find(n => n.id === activeTargetId);
    if (targetNode) {
      activeNodeIds.add(targetNode.id);
      const neighbors = adjacencyMap.get(targetNode.id) || new Set();
      neighbors.forEach((nId: string) => activeNodeIds.add(nId));

      links.forEach(l => {
        if (l.source.id === targetNode.id || l.target.id === targetNode.id) {
          activeLinkIds.add(l.id);
        }
      });
    } else {
      const targetLink = links.find(l => l.id === activeTargetId);
      if (targetLink) {
        activeLinkIds.add(targetLink.id);
        activeNodeIds.add(targetLink.source.id);
        activeNodeIds.add(targetLink.target.id);
      }
    }

    return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: true };
  }

  get processedNodes(): any[] {
    const { nodes } = this.layoutResult;
    const styleMap = this.categoryStyleMap;
    const neighborhood = this.activeNeighborhood;

    return nodes.map((n, i) => {
      const pos = this.nodePositions.get(n.id);
      const x = pos ? pos.x : n.x;
      const y = pos ? pos.y : n.y;
      const isSelected = n.id === this.activeSelectedId;
      const isFocused = nodes[this.focusedIndex]?.id === n.id;
      const isNeighborActive = neighborhood.nodeIds.has(n.id);
      const isDimmed = neighborhood.isActive && !isNeighborActive;
      const style = styleMap.get(n.category || 'default') || { color: this.colorScale[0], symbol: 'circle' };

      return {
        ...n,
        x,
        y,
        isSelected,
        isFocused,
        isDimmed,
        styleColor: style.color,
        symbol: style.symbol
      };
    });
  }

  get processedLinks(): any[] {
    const { links } = this.layoutResult;
    const nodeMap = new Map(this.processedNodes.map(n => [n.id, n]));
    const neighborhood = this.activeNeighborhood;

    return links.map(l => {
      const source = nodeMap.get(l.source.id) || l.source;
      const target = nodeMap.get(l.target.id) || l.target;
      const isPathActive = neighborhood.linkIds.has(l.id);
      const isDimmed = neighborhood.isActive && !isPathActive;
      const isSelected = l.id === this.activeSelectedId;
      const strokeWidth = Math.max(1, Math.min(6, Math.sqrt(l.weight || 1) * 1.5));
      const coords = computeEdgePerimeterCoords(source, target, this.directed ? 6 : 0);

      return {
        ...l,
        source,
        target,
        coords,
        isActive: isPathActive,
        isDimmed,
        isSelected,
        strokeWidth
      };
    });
  }

  get tooltipLeft(): number {
    if (!this.hoveredItem) return 0;
    return this.hoveredItem.clientX > this.width / 2
      ? Math.max(12, this.hoveredItem.clientX - 230)
      : Math.min(this.hoveredItem.clientX + 16, this.width - 230);
  }

  get tooltipTop(): number {
    if (!this.hoveredItem) return 0;
    return this.hoveredItem.clientY > this.height / 2
      ? Math.max(12, this.hoveredItem.clientY - 120)
      : Math.min(this.hoveredItem.clientY + 14, this.height - 120);
  }

  getNeighborsText(nodeId: string): string {
    const neighbors = this.layoutResult.adjacencyMap.get(nodeId);
    if (!neighbors || neighbors.size === 0) return 'None';
    return Array.from(neighbors).join(', ');
  }

  getTransformedCoordinates(clientX: number, clientY: number): { x: number; y: number } {
    if (!this.svgRef?.nativeElement) return { x: clientX, y: clientY };
    const rect = this.svgRef.nativeElement.getBoundingClientRect();
    const rawX = clientX - rect.left;
    const rawY = clientY - rect.top;
    return {
      x: (rawX - this.pan.x) / this.zoom,
      y: (rawY - this.pan.y) / this.zoom
    };
  }

  onNodeMouseDown(node: any, e: MouseEvent): void {
    if (!this.draggableNodes) return;
    e.stopPropagation();
    this.draggingNodeId = node.id;
    const coords = this.getTransformedCoordinates(e.clientX, e.clientY);
    this.dragOffset = {
      x: coords.x - (node.x || 0),
      y: coords.y - (node.y || 0)
    };
  }

  onMouseMove(e: MouseEvent): void {
    if (this.draggingNodeId) {
      const coords = this.getTransformedCoordinates(e.clientX, e.clientY);
      const newX = coords.x - this.dragOffset.x;
      const newY = coords.y - this.dragOffset.y;

      const next = new Map(this.nodePositions);
      next.set(this.draggingNodeId, { x: newX, y: newY });
      this.nodePositions = next;
    } else if (this.isPanning && this.zoomable) {
      this.pan = { x: e.clientX - this.startPan.x, y: e.clientY - this.startPan.y };
    }
  }

  onMouseUp(): void {
    if (this.draggingNodeId) {
      const node = this.nodes.find(n => n.id === this.draggingNodeId);
      if (node) {
        this.announcement = `Repositioned node ${node.label}. Connected edges stretched.`;
      }
      this.draggingNodeId = null;
    }
    this.isPanning = false;
  }

  onCanvasMouseDown(e: MouseEvent): void {
    if (!this.zoomable) return;
    this.isPanning = true;
    this.startPan = { x: e.clientX - this.pan.x, y: e.clientY - this.pan.y };
  }

  onZoomIn(): void {
    this.zoom = Math.min(3.5, this.zoom + 0.25);
  }

  onZoomOut(): void {
    this.zoom = Math.max(0.3, this.zoom - 0.25);
  }

  onResetZoom(): void {
    this.zoom = 1;
    this.pan = { x: 0, y: 0 };
    this.nodePositions = new Map();
    this.spreadMultiplier = this.initialSpread;
  }

  onNodeClickAction(node: any, e: MouseEvent): void {
    e.stopPropagation();
    const nextId = this.activeSelectedId === node.id ? null : node.id;
    this.internalSelectedId = nextId;
    const neighborsCount = (this.layoutResult.adjacencyMap.get(node.id) || new Set()).size;
    this.announcement = `Selected node ${node.label}. Connected to ${neighborsCount} neighbor nodes.`;
    this.nodeClick.emit({ node });
    this.selectionChange.emit({ selection: nextId ? { type: 'node', node } : null });
  }

  onLinkSelect(e: MouseEvent, link: any): void {
    e.stopPropagation();
    this.internalSelectedId = link.id;
    this.linkClick.emit({ link });
    this.selectionChange.emit({ selection: { type: 'link', link } });
  }

  onNodeHover(e: MouseEvent, node: any): void {
    const rect = this.containerRef?.nativeElement?.getBoundingClientRect();
    this.hoveredItem = {
      type: 'node',
      item: node,
      id: node.id,
      clientX: e.clientX - (rect?.left || 0),
      clientY: e.clientY - (rect?.top || 0)
    };
  }

  onLinkHover(e: MouseEvent, link: any): void {
    const rect = this.containerRef?.nativeElement?.getBoundingClientRect();
    this.hoveredItem = {
      type: 'link',
      item: link,
      id: link.id,
      clientX: e.clientX - (rect?.left || 0),
      clientY: e.clientY - (rect?.top || 0)
    };
  }

  onHoverLeave(): void {
    this.hoveredItem = null;
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
      if (this.activeSelectedId) {
        e.preventDefault();
        this.internalSelectedId = null;
        this.selectionChange.emit({ selection: null });
        return;
      }
    }

    if (this.nodes.length === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      this.focusedIndex = (this.focusedIndex + 1) % this.nodes.length;
      const target = this.nodes[this.focusedIndex];
      this.announcement = `Focused ${target.label}`;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      this.focusedIndex = (this.focusedIndex - 1 + this.nodes.length) % this.nodes.length;
      const target = this.nodes[this.focusedIndex];
      this.announcement = `Focused ${target.label}`;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (this.focusedIndex >= 0 && this.focusedIndex < this.nodes.length) {
        this.onNodeClickAction(this.nodes[this.focusedIndex], new MouseEvent('click'));
      }
    }
  }
}
