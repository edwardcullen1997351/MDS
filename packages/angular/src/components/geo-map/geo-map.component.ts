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
  createGeoProjection,
  createCurvedRoutePath,
  VIZ_COLORS,
  formatVizValue,
  getVizDensityTier,
  VizDensityTier
} from '../../utils/viz-core.js';

export type GeoVariant = 'hybrid' | 'choropleth' | 'bubble' | 'route';
export type GeoProjectionType = 'mercator' | 'equirectangular';

export interface GeoRegion {
  id: string;
  label?: string;
  name?: string;
  code?: string;
  path?: string;
  d?: string;
  value?: number;
  category?: string;
  centroid?: [number, number];
  [key: string]: any;
}

export interface GeoHub {
  id: string;
  label?: string;
  name?: string;
  coordinates: [number, number];
  role?: string;
  type?: string;
  status?: string;
  value?: number;
  size?: number;
  category?: string;
  [key: string]: any;
}

export interface GeoRoute {
  id: string;
  sourceId?: string;
  targetId?: string;
  source?: string | GeoHub;
  target?: string | GeoHub;
  label?: string;
  value?: number;
  flow?: number;
  status?: string;
  curvature?: number;
  [key: string]: any;
}

export interface GeoMapData {
  regions?: GeoRegion[];
  hubs?: GeoHub[];
  routes?: GeoRoute[];
}

const DEFAULT_INDIA_REGIONS: GeoRegion[] = [
  { id: 'reg-mh', code: 'MH', label: 'Maharashtra (Auto Corridor)', path: 'M 290 250 L 375 230 L 420 270 L 400 340 L 315 355 L 265 300 Z', centroid: [344, 290], value: 88, category: 'Tier-1 Hub' },
  { id: 'reg-gj', code: 'GJ', label: 'Gujarat (Sanand & Hazira)', path: 'M 230 195 L 290 185 L 305 240 L 250 260 L 210 230 Z', centroid: [257, 222], value: 74, category: 'Assembly Zone' },
  { id: 'reg-ka', code: 'KA', label: 'Karnataka (Raw Materials & Tech)', path: 'M 310 350 L 370 340 L 380 410 L 330 450 L 295 385 Z', centroid: [337, 387], value: 65, category: 'Steel / Mining' },
  { id: 'reg-tn', code: 'TN', label: 'Tamil Nadu (Chennai Auto Belt)', path: 'M 370 405 L 425 395 L 440 465 L 375 490 L 355 440 Z', centroid: [393, 439], value: 82, category: 'Export Hub' },
  { id: 'reg-hr-dl', code: 'NCR', label: 'NCR / Haryana (Manesar Cluster)', path: 'M 320 120 L 380 105 L 400 150 L 350 170 L 310 145 Z', centroid: [352, 138], value: 79, category: 'Assembly Zone' },
  { id: 'reg-jh-wb', code: 'EAST', label: 'Eastern Belt (Jamshedpur / Steel)', path: 'M 490 200 L 560 190 L 575 255 L 510 270 L 470 230 Z', centroid: [521, 229], value: 70, category: 'Raw Materials' }
];

const DEFAULT_INDIA_HUBS: GeoHub[] = [
  { id: 'hub-chakan', label: 'PL-04 (Chakan HQ)', coordinates: [73.85, 18.75], role: 'Primary Manufacturing Plant', status: 'Operational', value: 4250, size: 9, category: 'HQ Plant' },
  { id: 'hub-mumbai', label: 'JNPT Port', coordinates: [72.95, 18.95], role: 'Sea Export Terminal', status: 'Active', value: 2100, size: 7, category: 'Logistics Port' },
  { id: 'hub-sanand', label: 'Sanand', coordinates: [72.38, 23.0], role: 'OEM EV Assembly Client', status: 'Active', value: 1850, size: 6, category: 'OEM Client' },
  { id: 'hub-manesar', label: 'Manesar', coordinates: [76.93, 28.35], role: 'OEM Stamping Delivery', status: 'Active', value: 1650, size: 6, category: 'OEM Client' },
  { id: 'hub-chennai', label: 'Chennai', coordinates: [79.95, 12.97], role: 'OEM Assembly Client', status: 'Active', value: 1950, size: 6, category: 'OEM Client' },
  { id: 'hub-jsw', label: 'JSW Steel', coordinates: [76.65, 15.15], role: 'Raw Steel Coil Supplier', status: 'Active', value: 3100, size: 7, category: 'Supplier' },
  { id: 'hub-jamshedpur', label: 'Tata Steel', coordinates: [86.20, 22.80], role: 'High-Tensile Sheet Supplier', status: 'Active', value: 2400, size: 7, category: 'Supplier' },
  { id: 'hub-aurangabad', label: 'Waluj', coordinates: [75.32, 19.87], role: 'Die Stamping Satellite', status: 'Active', value: 1200, size: 6, category: 'Satellite Plant' }
];

const DEFAULT_SUPPLY_ROUTES: GeoRoute[] = [
  { id: 'route-jsw-chakan', sourceId: 'hub-jsw', targetId: 'hub-chakan', label: 'CRCA Coil Freight (Daily)', value: 1850, status: 'On-Time', curvature: 0.2 },
  { id: 'route-jamshedpur-chakan', sourceId: 'hub-jamshedpur', targetId: 'hub-chakan', label: 'High-Tensile Steel Rail (Weekly)', value: 1200, status: 'On-Time', curvature: -0.22 },
  { id: 'route-chakan-mumbai', sourceId: 'hub-chakan', targetId: 'hub-mumbai', label: 'Export Body Panels (Expressway)', value: 1400, status: 'On-Time', curvature: 0.15 },
  { id: 'route-chakan-sanand', sourceId: 'hub-chakan', targetId: 'hub-sanand', label: 'EV Chassis Sub-Assemblies', value: 1650, status: 'In-Transit', curvature: -0.25 },
  { id: 'route-chakan-chennai', sourceId: 'hub-chakan', targetId: 'hub-chennai', label: 'Deep-Draw Stampings Corridor', value: 1100, status: 'On-Time', curvature: 0.18 },
  { id: 'route-chakan-manesar', sourceId: 'hub-chakan', targetId: 'hub-manesar', label: 'North India Freight Trunk', value: 950, status: 'Delayed', curvature: -0.18 },
  { id: 'route-chakan-aurangabad', sourceId: 'hub-chakan', targetId: 'hub-aurangabad', label: 'Inter-Plant Die Tooling Shuttles', value: 650, status: 'On-Time', curvature: 0.1 }
];

@Component({
  selector: 'ds-geo-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #containerRef
      class="ds-geo-map ds-geo-map--{{ variant }}"
      [style.width]="'100%'"
      role="region"
      [attr.aria-label]="title || 'Geographic supply chain map'"
      tabindex="0"
    >
      <div *ngIf="title || subtitle" class="ds-geo-map__header">
        <div>
          <h3 *ngIf="title" class="ds-geo-map__title">{{ title }}</h3>
          <p *ngIf="subtitle" class="ds-geo-map__subtitle">{{ subtitle }}</p>
        </div>
      </div>

      <!-- Toolbar Controls -->
      <div class="ds-geo-map__toolbar">
        <button
          type="button"
          class="ds-geo-map__btn"
          [ngClass]="{ 'ds-geo-map__btn--active': showRegions }"
          (click)="showRegions = !showRegions"
        >Regions</button>
        <button
          type="button"
          class="ds-geo-map__btn"
          [ngClass]="{ 'ds-geo-map__btn--active': showHubs }"
          (click)="showHubs = !showHubs"
        >Hubs</button>
        <button
          type="button"
          class="ds-geo-map__btn"
          [ngClass]="{ 'ds-geo-map__btn--active': showRoutes }"
          (click)="showRoutes = !showRoutes"
        >Routes</button>
      </div>

      <!-- SVG Map Viewport -->
      <div class="ds-geo-map__svg-wrapper" [style.height.px]="height">
        <svg
          width="100%"
          [attr.height]="height"
          [attr.viewBox]="'0 0 ' + numericWidth + ' ' + height"
          preserveAspectRatio="xMidYMid meet"
          class="ds-geo-map__svg"
          style="display: block; width: 100%; height: auto;"
        >
          <!-- Regions Layer -->
          <g *ngIf="showRegions">
            <g *ngFor="let reg of regionList; let idx = index">
              <path
                class="ds-geo-map__region"
                [attr.d]="reg.path || reg.d"
                [attr.fill]="colorScale[idx % colorScale.length]"
                [attr.fill-opacity]="variant === 'choropleth' ? '0.40' : '0.18'"
                [attr.stroke]="variant === 'choropleth' ? '#64748b' : 'rgba(148, 163, 184, 0.45)'"
                [attr.stroke-width]="variant === 'choropleth' ? 1.25 : 0.75"
                (pointerenter)="hoveredItem = reg"
                (pointerleave)="hoveredItem = null"
                (click)="onFeatureClick(reg)"
              />
              <text
                *ngIf="getCentroid(reg)"
                [attr.x]="getCentroid(reg)![0]"
                [attr.y]="getCentroid(reg)![1]"
                text-anchor="middle"
                dominant-baseline="middle"
                [attr.font-size]="variant === 'choropleth' ? 10 : 9"
                [attr.font-weight]="variant === 'choropleth' ? '700' : '600'"
                [attr.fill]="variant === 'choropleth' ? 'var(--text-primary, #0f172a)' : 'var(--text-muted, #64748b)'"
                style="paint-order: stroke; stroke: rgba(255, 255, 255, 0.92); stroke-width: 2.2px; stroke-linejoin: round;"
              >
                {{ variant === 'choropleth' && reg.value != null ? (reg.code || reg.label) + ' · ' + reg.value + '%' : (reg.code || reg.label) }}
              </text>
            </g>
          </g>

          <!-- Supply Chain Routes Layer -->
          <g *ngIf="showRoutes">
            <path
              *ngFor="let r of projectedRoutes"
              class="ds-geo-map__route"
              [attr.d]="r.pathD"
              fill="none"
              stroke="var(--action-solid, #2563eb)"
              stroke-width="1.5"
              stroke-opacity="0.55"
              stroke-dasharray="6 3"
              (pointerenter)="hoveredItem = r"
              (pointerleave)="hoveredItem = null"
              (click)="onFeatureClick(r)"
            />
          </g>

          <!-- Logistics Hubs Layer -->
          <g *ngIf="showHubs">
            <g *ngFor="let hub of projectedHubs">
              <circle
                class="ds-geo-map__hub"
                [attr.cx]="hub.x"
                [attr.cy]="hub.y"
                [attr.r]="hub.size || 7"
                [attr.fill]="getHubFill(hub)"
                stroke="#ffffff"
                stroke-width="1.5"
                (pointerenter)="hoveredItem = hub"
                (pointerleave)="hoveredItem = null"
                (click)="onFeatureClick(hub)"
              />
              <text
                [attr.x]="hub.id === 'hub-mumbai' ? hub.x - (hub.size || 7) - 5 : hub.x"
                [attr.y]="hub.id === 'hub-mumbai' ? hub.y + 3 : hub.y + (hub.size || 7) + 10"
                [attr.text-anchor]="hub.id === 'hub-mumbai' ? 'end' : 'middle'"
                font-size="9.5"
                font-weight="600"
                fill="var(--text-primary, #0f172a)"
                style="paint-order: stroke; stroke: rgba(255, 255, 255, 0.95); stroke-width: 2.5px; stroke-linejoin: round;"
              >
                {{ hub.label || hub.name }}
              </text>
            </g>
          </g>
        </svg>

        <!-- Empty State Telemetry Placeholder -->
        <div
          *ngIf="isEmpty"
          style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: var(--text-muted, #64748b); font-size: 13px; text-align: center; padding: 24px; pointer-events: none;"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m4.93 4.93 14.14 14.14"></path>
          </svg>
          <div style="font-weight: 600; color: var(--text-primary, #0f172a);">
            No Active Geographic Telemetry
          </div>
          <div style="font-size: 11px; max-width: 320px;">
            {{ ariaLabel || 'No active vessel or GIS telemetry received from logistics transponders.' }}
          </div>
        </div>

        <!-- Floating Entity Legend -->
        <div
          *ngIf="showLegend && !isEmpty"
          class="ds-geo-map__legend"
          style="position: absolute; bottom: 12px; left: 12px; background: rgba(255, 255, 255, 0.94); backdrop-filter: blur(6px); padding: 5px 10px; border-radius: var(--radius-sm, 6px); border: 1px solid var(--border-subtle, #e2e8f0); box-shadow: 0 1px 3px rgba(0,0,0,0.06); display: flex; align-items: center; flex-wrap: wrap; gap: 10px; font-size: 11px; font-weight: 500; color: var(--text-secondary, #475569); z-index: 10;"
        >
          <div *ngIf="variant === 'choropleth'" style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 10px; color: var(--text-muted, #64748b); font-weight: 600;">Density: Low (0%)</span>
            <div style="width: 90px; height: 8px; border-radius: 3px; background: linear-gradient(to right, rgba(37,99,235,0.2), rgba(37,99,235,0.9));"></div>
            <span style="font-size: 10px; color: var(--text-primary, #0f172a); font-weight: 600;">High (100%)</span>
          </div>
          <ng-container *ngIf="variant !== 'choropleth'">
            <button
              type="button"
              *ngIf="showHubs"
              (click)="toggleCategory('HQ Plant')"
              [style.opacity]="hiddenCategories.has('HQ Plant') ? 0.35 : 1"
              [style.textDecoration]="hiddenCategories.has('HQ Plant') ? 'line-through' : 'none'"
              style="display: flex; align-items: center; gap: 5px; background: none; border: none; padding: 2px 4px; cursor: pointer; color: inherit; font: inherit;"
              title="Toggle HQ Plant nodes"
            >
              <span style="width: 9px; height: 9px; border-radius: 50%; background: var(--action-solid, #2563eb); border: 1.5px solid #ffffff; box-shadow: 0 0 0 1px #2563eb;"></span>
              <span>HQ Plant</span>
            </button>
            <button
              type="button"
              *ngIf="showHubs"
              (click)="toggleCategory('OEM Client')"
              [style.opacity]="hiddenCategories.has('OEM Client') ? 0.35 : 1"
              [style.textDecoration]="hiddenCategories.has('OEM Client') ? 'line-through' : 'none'"
              style="display: flex; align-items: center; gap: 5px; background: none; border: none; padding: 2px 4px; cursor: pointer; color: inherit; font: inherit;"
              title="Toggle OEM Client nodes"
            >
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #7c3aed;"></span>
              <span>OEM Client</span>
            </button>
            <button
              type="button"
              *ngIf="showHubs"
              (click)="toggleCategory('Supplier')"
              [style.opacity]="hiddenCategories.has('Supplier') ? 0.35 : 1"
              [style.textDecoration]="hiddenCategories.has('Supplier') ? 'line-through' : 'none'"
              style="display: flex; align-items: center; gap: 5px; background: none; border: none; padding: 2px 4px; cursor: pointer; color: inherit; font: inherit;"
              title="Toggle Supplier nodes"
            >
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #059669;"></span>
              <span>Supplier</span>
            </button>
            <button
              type="button"
              *ngIf="showHubs"
              (click)="toggleCategory('Logistics Port')"
              [style.opacity]="hiddenCategories.has('Logistics Port') ? 0.35 : 1"
              [style.textDecoration]="hiddenCategories.has('Logistics Port') ? 'line-through' : 'none'"
              style="display: flex; align-items: center; gap: 5px; background: none; border: none; padding: 2px 4px; cursor: pointer; color: inherit; font: inherit;"
              title="Toggle Port nodes"
            >
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #d97706;"></span>
              <span>Port</span>
            </button>
            <button
              type="button"
              *ngIf="showRoutes"
              (click)="toggleCategory('Road')"
              [style.opacity]="hiddenCategories.has('Road') ? 0.35 : 1"
              [style.textDecoration]="hiddenCategories.has('Road') ? 'line-through' : 'none'"
              style="display: flex; align-items: center; gap: 5px; background: none; border: none; padding: 2px 4px; cursor: pointer; color: inherit; font: inherit;"
              title="Toggle Road routes"
            >
              <span style="width: 12px; height: 2px; background: var(--action-solid, #2563eb);"></span>
              <span>Road</span>
            </button>
            <button
              type="button"
              *ngIf="showRoutes"
              (click)="toggleCategory('Rail')"
              [style.opacity]="hiddenCategories.has('Rail') ? 0.35 : 1"
              [style.textDecoration]="hiddenCategories.has('Rail') ? 'line-through' : 'none'"
              style="display: flex; align-items: center; gap: 5px; background: none; border: none; padding: 2px 4px; cursor: pointer; color: inherit; font: inherit;"
              title="Toggle Rail routes"
            >
              <span style="width: 12px; height: 0; border-top: 2px dashed #94a3b8;"></span>
              <span>Rail</span>
            </button>
          </ng-container>
        </div>

        <!-- Floating Tooltip -->
        <div
          *ngIf="hoveredItem"
          class="ds-geo-map__tooltip"
          [style.left.px]="hoveredItem.x ? hoveredItem.x + 15 : 120"
          [style.top.px]="hoveredItem.y ? hoveredItem.y - 10 : 60"
        >
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 3px;">
            <strong>{{ hoveredItem.label || hoveredItem.name || hoveredItem.id }}</strong>
            <span
              *ngIf="hoveredItem.category"
              [style.background]="getHubFill(hoveredItem)"
              style="font-size: 9px; font-weight: 600; text-transform: uppercase; padding: 1px 5px; border-radius: 3px; color: #ffffff;"
            >
              {{ hoveredItem.category }}
            </span>
          </div>
          <div *ngIf="hoveredItem.role">{{ hoveredItem.role }}</div>
          <div *ngIf="hoveredItem.status">Status: {{ hoveredItem.status }}</div>
          <div *ngIf="hoveredItem.value != null">Volume: {{ formatVal(hoveredItem.value) }}</div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./geo-map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DsGeoMapComponent implements AfterViewInit, OnDestroy {
  @Input() data?: GeoMapData;
  @Input() regions: GeoRegion[] = DEFAULT_INDIA_REGIONS;
  @Input() hubs: GeoHub[] = DEFAULT_INDIA_HUBS;
  @Input() routes: GeoRoute[] = DEFAULT_SUPPLY_ROUTES;
  @Input() width: number | string = '100%';
  @Input() height: number = 520;
  @Input() projection: GeoProjectionType = 'mercator';
  @Input() center: [number, number] = [79.0, 21.0];
  @Input() scale?: number;
  @Input() variant: GeoVariant = 'hybrid';
  @Input() colorScale: string[] = VIZ_COLORS;
  @Input() unit: string = '';
  @Input() locale: string = 'en-IN';
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() showLegend: boolean = true;
  @Input() ariaLabel?: string;

  @Output() featureClick = new EventEmitter<{ feature: any }>();

  @ViewChild('containerRef') containerRef?: ElementRef<HTMLDivElement>;

  showRegions: boolean = true;
  showHubs: boolean = true;
  showRoutes: boolean = true;
  hoveredItem: any = null;
  hiddenCategories: Set<string> = new Set<string>();

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

  toggleCategory(cat: string): void {
    const next = new Set(this.hiddenCategories);
    if (next.has(cat)) {
      next.delete(cat);
    } else {
      next.add(cat);
    }
    this.hiddenCategories = next;
  }

  resolveCategory(hub: any): string {
    if (hub?.category) return hub.category;
    const id = (hub?.id || '').toLowerCase();
    const role = (hub?.role || '').toLowerCase();
    if (id.includes('chakan') || id.includes('hq') || role.includes('central')) return 'HQ Plant';
    if (id.includes('sanand') || id.includes('manesar') || id.includes('chennai') || role.includes('oem')) return 'OEM Client';
    if (id.includes('steel') || id.includes('jsw') || id.includes('jamshedpur') || role.includes('supplier')) return 'Supplier';
    if (id.includes('port') || id.includes('mumbai') || id.includes('nhava') || role.includes('port')) return 'Logistics Port';
    return 'HQ Plant';
  }

  get numericWidth(): number {
    return Math.max(300, this.measuredWidth || (typeof this.width === 'number' ? this.width : 700));
  }

  get densityTier(): VizDensityTier {
    return getVizDensityTier(this.numericWidth);
  }

  get effectiveScale(): number {
    const baseScale = (this.densityTier === 'compact' || this.densityTier === 'mobile') ? 800 : (this.densityTier === 'tablet' ? 960 : 1120);
    return this.scale !== undefined ? this.scale : Math.round((this.height / 520) * baseScale);
  }

  get isEmpty(): boolean {
    return this.regionList.length === 0 && this.hubList.length === 0 && this.routeList.length === 0;
  }

  getHubFill(hub: any): string {
    if (hub?.fill) return hub.fill;
    const cat = hub?.category;
    if (cat === 'HQ Plant') return 'var(--action-solid, #2563eb)';
    if (cat === 'OEM Client') return '#7c3aed';
    if (cat === 'Supplier') return '#059669';
    if (cat === 'Logistics Port') return '#d97706';
    if (cat === 'Satellite Plant') return '#0891b2';
    const id = (hub?.id || '').toLowerCase();
    const role = (hub?.role || '').toLowerCase();
    if (id.includes('chakan') || id.includes('hq') || role.includes('central')) return 'var(--action-solid, #2563eb)';
    if (id.includes('sanand') || id.includes('manesar') || id.includes('chennai') || role.includes('oem')) return '#7c3aed';
    if (id.includes('steel') || id.includes('jsw') || id.includes('jamshedpur') || role.includes('supplier')) return '#059669';
    if (id.includes('port') || id.includes('mumbai') || id.includes('nhava') || role.includes('port')) return '#d97706';
    return '#0d9488';
  }

  get widthValue(): string {
    return typeof this.width === 'number' ? `${this.width}px` : this.width;
  }

  get regionList(): GeoRegion[] {
    return this.data?.regions ?? this.regions ?? [];
  }

  get hubList(): GeoHub[] {
    return this.data?.hubs ?? this.hubs ?? [];
  }

  get routeList(): GeoRoute[] {
    return this.data?.routes ?? this.routes ?? [];
  }

  get geoProj() {
    return createGeoProjection({
      center: this.center,
      scale: this.effectiveScale,
      width: this.numericWidth,
      height: this.height,
      projection: this.projection
    });
  }

  get projectedHubs(): any[] {
    return this.hubList
      .filter(h => !this.hiddenCategories.has(this.resolveCategory(h)))
      .map(h => {
        const [x, y] = this.geoProj.project(h.coordinates);
        return { ...h, x, y };
      });
  }

  get projectedRoutes(): any[] {
    const hubMap = new Map<string, any>(this.projectedHubs.map(h => [h.id, h]));
    return this.routeList
      .filter(r => {
        const mode = (r.mode || (r.dashed ? 'Rail' : 'Road')).toLowerCase();
        if (mode.includes('rail') && this.hiddenCategories.has('Rail')) return false;
        if (!mode.includes('rail') && this.hiddenCategories.has('Road')) return false;
        return true;
      })
      .map(r => {
        const sId = typeof r.source === 'string' ? r.source : (r.sourceId || (r.source as any)?.id);
        const tId = typeof r.target === 'string' ? r.target : (r.targetId || (r.target as any)?.id);
        const s = hubMap.get(sId);
        const t = hubMap.get(tId);
        if (!s || !t) return null;
        const pathD = createCurvedRoutePath({
          sourcePoint: [s.x, s.y],
          targetPoint: [t.x, t.y],
          curvature: r.curvature !== undefined ? r.curvature : 0.2
        });
        return { ...r, source: s, target: t, pathD };
      }).filter(Boolean);
  }

  getCentroid(reg: GeoRegion): [number, number] | null {
    if (reg.centroid) return reg.centroid;
    const pathD = reg.path || reg.d;
    if (!pathD) return null;
    const numbers = pathD.match(/[0-9.]+/g);
    if (!numbers || numbers.length < 2) return null;
    let sumX = 0;
    let sumY = 0;
    let count = 0;
    for (let i = 0; i < numbers.length - 1; i += 2) {
      sumX += parseFloat(numbers[i]);
      sumY += parseFloat(numbers[i + 1]);
      count++;
    }
    return count > 0 ? [Math.round(sumX / count), Math.round(sumY / count)] : null;
  }

  formatVal(val: any): string {
    return formatVizValue(val, this.unit, this.locale);
  }

  onFeatureClick(feat: any): void {
    this.featureClick.emit({ feature: feat });
  }
}
