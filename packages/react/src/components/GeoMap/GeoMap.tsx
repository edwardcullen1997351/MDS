/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- keyboard-operated visualization surface; interactive controls retain native semantics */
import React,{ useCallback,useMemo,useRef,useState } from 'react';
import {
createCurvedRoutePath,
createGeoProjection,
formatVizValue,
PATTERN_PRESETS,
useResponsiveVizBounds,
VIZ_COLORS
} from '../../utils/viz-core.js';

export type GeoVariant = 'hybrid' | 'choropleth' | 'bubble' | 'route';
export type GeoProjectionType = 'mercator' | 'equirectangular';

export interface GeoCoordinate {
  lon: number;
  lat: number;
}

export interface GeoRegion {
  id: string;
  label?: string;
  name?: string;
  code?: string;
  value?: number;
  formattedValue?: string;
  status?: 'nominal' | 'warning' | 'critical' | 'info';
  category?: string;
  d?: string;
  path?: string;
  fill?: string;
  stroke?: string;
  color?: string;
  centroid?: [number, number];
  metadata?: Record<string, any>;
}

export interface GeoHub {
  id: string;
  label?: string;
  name?: string;
  type?: 'plant' | 'vendor' | 'oem' | 'port' | 'warehouse' | 'station';
  coordinates: [number, number];
  value?: number;
  unit?: string;
  formattedValue?: string;
  status?: 'nominal' | 'warning' | 'critical' | 'info' | string;
  role?: string;
  size?: number;
  tier?: string;
  state?: string;
  city?: string;
  fill?: string;
  category?: string;
  metadata?: Record<string, any>;
}

export interface GeoRoute {
  id: string;
  sourceId?: string;
  targetId?: string;
  source?: string | any;
  target?: string | any;
  flow?: number;
  value?: number;
  label?: string;
  unit?: string;
  status?: 'nominal' | 'warning' | 'critical' | 'info' | string;
  mode?: 'road' | 'rail' | 'sea' | 'air';
  transitHours?: number;
  curved?: boolean;
  curvature?: number;
  dashPattern?: string;
  metadata?: Record<string, any>;
}

export interface GeoMapData {
  regions?: GeoRegion[];
  hubs?: GeoHub[];
  routes?: GeoRoute[];
}

export interface GeoMapProps {
  data?: GeoMapData;
  regions?: GeoRegion[];
  hubs?: GeoHub[];
  routes?: GeoRoute[];
  variant?: GeoVariant;
  projection?: GeoProjectionType;
  width?: number | string;
  height?: number;
  className?: string;
  title?: string;
  subtitle?: string;
  center?: [number, number];
  scale?: number;
  colorScale?: string[];
  patternFills?: boolean;
  unit?: string;
  locale?: string;
  searchable?: boolean;
  zoomable?: boolean;
  layerControls?: boolean;
  showLayerControls?: boolean;
  showSearch?: boolean;
  showMinimap?: boolean;
  showScaleBar?: boolean;
  showLegend?: boolean;
  legend?: boolean;
  selectedId?: string | null;
  onRegionClick?: (region: GeoRegion, event: React.MouseEvent) => void;
  onHubClick?: (hub: GeoHub, event: React.MouseEvent) => void;
  onRouteClick?: (route: GeoRoute, event: React.MouseEvent) => void;
  onFeatureClick?: ((feat: any) => void) | null;
  onSelectionChange?: ((feat: any) => void) | null;
  renderTooltip?: (item: { type: 'region' | 'hub' | 'route'; data: any }) => React.ReactNode;
  ariaLabel?: string;
}

export const GEO_ENTITY_PALETTE: Record<string, { color: string; label: string }> = {
  'HQ Plant': { color: 'var(--action-solid, #2563eb)', label: 'HQ Stamping Plant' },
  'OEM Client': { color: '#7c3aed', label: 'OEM Assembly Client' },
  'Supplier': { color: '#059669', label: 'Raw Steel Supplier' },
  'Logistics Port': { color: '#d97706', label: 'Export Port / Terminal' },
  'Satellite Plant': { color: '#0891b2', label: 'Satellite Toolroom' },
};

export function getHubFillColor(hub: any): string {
  if (hub?.fill) return hub.fill;
  const cat = hub?.category;
  if (cat && GEO_ENTITY_PALETTE[cat]) {
    return GEO_ENTITY_PALETTE[cat].color;
  }
  const id = (hub?.id || '').toLowerCase();
  const role = (hub?.role || '').toLowerCase();
  if (id.includes('chakan') || id.includes('hq') || role.includes('central') || role.includes('primary')) {
    return 'var(--action-solid, #2563eb)';
  }
  if (id.includes('sanand') || id.includes('manesar') || id.includes('chennai') || role.includes('oem') || role.includes('assembly')) {
    return '#7c3aed';
  }
  if (id.includes('steel') || id.includes('jsw') || id.includes('jamshedpur') || id.includes('supplier') || role.includes('supplier')) {
    return '#059669';
  }
  if (id.includes('port') || id.includes('mumbai') || id.includes('nhava') || role.includes('port') || role.includes('terminal')) {
    return '#d97706';
  }
  if (id.includes('waluj') || id.includes('aurangabad') || role.includes('satellite') || role.includes('toolroom')) {
    return '#0891b2';
  }
  return '#0d9488';
}

export function getPathCentroid(pathD: string): [number, number] {
  if (!pathD) return [0, 0];
  const numbers = pathD.match(/[0-9.]+/g);
  if (!numbers || numbers.length < 2) return [0, 0];
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  for (let i = 0; i < numbers.length - 1; i += 2) {
    sumX += parseFloat(numbers[i]);
    sumY += parseFloat(numbers[i + 1]);
    count++;
  }
  return count > 0 ? [Math.round(sumX / count), Math.round(sumY / count)] : [0, 0];
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

/**
 * GeoMap — Geographic Spatial Visualization Component
 */
export const GeoMap: React.FC<GeoMapProps> = ({
  data,
  regions: directRegions,
  hubs: directHubs,
  routes: directRoutes,
  width = '100%',
  height = 520,
  projection = 'mercator',
  center = [79.0, 21.0],
  scale: customScale,
  variant = 'hybrid',
  colorScale = VIZ_COLORS,
  patternFills = true,
  unit = '',
  locale = 'en-IN',
  title = '',
  subtitle = '',
  searchable = true,
  zoomable = true,
  layerControls = true,
  showLegend = true,
  legend,
  selectedId: controlledSelectedId = null,
  onFeatureClick = null,
  onSelectionChange = null,
  ariaLabel,
  className = ''
}) => {
  const isLegendVisible = showLegend !== false && legend !== false;
  const regions = data?.regions ?? directRegions ?? DEFAULT_INDIA_REGIONS;
  const hubs = data?.hubs ?? directHubs ?? DEFAULT_INDIA_HUBS;
  const routes = data?.routes ?? directRoutes ?? DEFAULT_SUPPLY_ROUTES;
  const isEmpty = regions.length === 0 && hubs.length === 0 && routes.length === 0;

  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');

  const [showRegions, setShowRegions] = useState(variant !== 'bubble' && variant !== 'route');
  const [showHubs, setShowHubs] = useState(variant !== 'choropleth');
  const [showRoutes, setShowRoutes] = useState(variant === 'hybrid' || variant === 'route');

  const [hiddenCategories, setHiddenCategories] = useState<Set<string>>(new Set());

  const toggleCategory = useCallback((cat: string) => {
    setHiddenCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }, []);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const { width: measuredWidth, height: measuredHeight, densityTier: _densityTier } = useResponsiveVizBounds(containerRef, typeof width === 'number' ? width : 920, height);

  const numericWidth = Math.max(280, measuredWidth || (typeof width === 'number' ? width : 920));
  const numericHeight = Math.max(200, measuredHeight || height);
  const effectiveScale = customScale !== undefined ? customScale : Math.round((numericHeight / 520) * (numericWidth < 600 ? 800 : 1120));

  const selectedId = controlledSelectedId !== undefined && controlledSelectedId !== null
    ? controlledSelectedId
    : internalSelectedId;

  const geoProj = useMemo(() => {
    return createGeoProjection({
      center,
      scale: effectiveScale,
      width: numericWidth,
      height: numericHeight,
      projection
    });
  }, [center, effectiveScale, numericWidth, numericHeight, projection]);

  const resolveCategory = useCallback((item: any): string => {
    if (item.category) return item.category;
    const id = (item.id || '').toLowerCase();
    const role = (item.role || '').toLowerCase();
    if (id.includes('chakan') || id.includes('hq') || role.includes('central') || role.includes('primary')) return 'HQ Plant';
    if (id.includes('sanand') || id.includes('manesar') || id.includes('chennai') || role.includes('oem')) return 'OEM Client';
    if (id.includes('steel') || id.includes('jsw') || id.includes('jamshedpur') || role.includes('supplier')) return 'Supplier';
    if (id.includes('port') || id.includes('mumbai') || id.includes('nhava') || role.includes('port')) return 'Logistics Port';
    return 'Satellite Plant';
  }, []);

  const projectedHubs = useMemo(() => {
    return hubs
      .filter(hub => !hiddenCategories.has(resolveCategory(hub)))
      .map(hub => {
        const [x, y] = geoProj.project(hub.coordinates);
        return {
          ...hub,
          label: hub.label || hub.name || hub.id,
          x,
          y
        };
      });
  }, [hubs, geoProj, hiddenCategories, resolveCategory]);

  const projectedRoutes = useMemo(() => {
    const hubMap = new Map(projectedHubs.map(h => [h.id, h]));
    return routes
      .filter(route => {
        const mode = (route.mode || 'road').toLowerCase();
        const modeKey = mode === 'rail' ? 'Rail' : 'Road';
        return !hiddenCategories.has(modeKey);
      })
      .map(route => {
        const sId = route.sourceId || (typeof route.source === 'string' ? route.source : route.source?.id);
        const tId = route.targetId || (typeof route.target === 'string' ? route.target : route.target?.id);
        const s = hubMap.get(sId);
        const t = hubMap.get(tId);
        if (!s || !t) return null;
        const pathD = createCurvedRoutePath({
          sourcePoint: [s.x, s.y],
          targetPoint: [t.x, t.y],
          curvature: route.curvature !== undefined ? route.curvature : 0.2
        });
        return {
          ...route,
          sourceId: sId,
          targetId: tId,
          source: s,
          target: t,
          pathD
        };
      }).filter(Boolean) as any[];
  }, [routes, projectedHubs, hiddenCategories]);

  const searchMatchIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const q = searchQuery.toLowerCase();
    const set = new Set<string>();
    regions.forEach(r => {
      const label = r.label || r.name || r.id;
      if (label.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) set.add(r.id);
    });
    projectedHubs.forEach(h => {
      const label = h.label || h.name || h.id;
      if (label.toLowerCase().includes(q) || h.id.toLowerCase().includes(q) || h.role?.toLowerCase().includes(q)) set.add(h.id);
    });
    return set;
  }, [searchQuery, regions, projectedHubs]);

  const activeFeatures = useMemo(() => {
    const activeIds = new Set<string>();
    const activeRouteIds = new Set<string>();

    if (searchMatchIds.size > 0) {
      searchMatchIds.forEach(id => activeIds.add(id));
      projectedRoutes.forEach(r => {
        if (searchMatchIds.has(r.sourceId) || searchMatchIds.has(r.targetId)) {
          activeRouteIds.add(r.id);
        }
      });
      return { ids: activeIds, routeIds: activeRouteIds, isActive: true };
    }

    const activeTarget = hoveredFeature || (selectedId ? (projectedHubs.find(h => h.id === selectedId) || regions.find(r => r.id === selectedId) || projectedRoutes.find(r => r.id === selectedId)) : null);

    if (!activeTarget) return { ids: activeIds, routeIds: activeRouteIds, isActive: false };

    activeIds.add(activeTarget.id);

    projectedRoutes.forEach(r => {
      if (r.sourceId === activeTarget.id || r.targetId === activeTarget.id) {
        activeRouteIds.add(r.id);
        activeIds.add(r.sourceId);
        activeIds.add(r.targetId);
      }
    });

    if (activeTarget.sourceId && activeTarget.targetId) {
      activeRouteIds.add(activeTarget.id);
      activeIds.add(activeTarget.sourceId);
      activeIds.add(activeTarget.targetId);
    }

    return { ids: activeIds, routeIds: activeRouteIds, isActive: true };
  }, [searchMatchIds, hoveredFeature, selectedId, projectedHubs, regions, projectedRoutes]);

  const handleSelectFeature = useCallback((feat: any) => {
    const nextId = selectedId === feat.id ? null : feat.id;
    setInternalSelectedId(nextId);
    setAnnouncement(`Selected spatial feature ${feat.label || feat.name || feat.id}${feat.value ? `: ${formatVizValue(feat.value, unit, locale)}` : ''}.`);
    if (onFeatureClick) onFeatureClick(feat);
    if (onSelectionChange) onSelectionChange(nextId ? feat : null);
  }, [selectedId, unit, locale, onFeatureClick, onSelectionChange]);

  const navigableList = useMemo(() => [...projectedHubs, ...regions], [projectedHubs, regions]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (navigableList.length === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = (prev + 1) % navigableList.length;
        const target = navigableList[next];
        setAnnouncement(`Focused ${target.label || target.name || target.id}`);
        return next;
      });
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = (prev - 1 + navigableList.length) % navigableList.length;
        const target = navigableList[next];
        setAnnouncement(`Focused ${target.label || target.name || target.id}`);
        return next;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < navigableList.length) {
        handleSelectFeature(navigableList[focusedIndex]);
      }
    }
  }, [navigableList, focusedIndex, handleSelectFeature]);

  const handleZoomIn = () => setZoom(z => Math.min(3.0, z + 0.25));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, z - 0.25));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!zoomable) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPanning || !zoomable) return;
    setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
  };

  const handleMouseUp = () => setIsPanning(false);

  return (
    <div
      ref={containerRef}
      className={`geomap-container ${className}`}
      style={{
        position: 'relative',
        width,
        fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        userSelect: 'none'
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Geographic Map: ${title || 'Spatial Distribution'}. ${projectedHubs.length} logistics hubs, ${regions.length} industrial regions.`}
    >
      <div aria-live="polite" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
        {announcement}
      </div>

      {(title || subtitle || layerControls || searchable || zoomable) && (
        <div style={{
          display: 'flex',
          justifyContent: (title || subtitle) ? 'space-between' : 'flex-end',
          alignItems: 'center',
          marginBottom: '10px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {(title || subtitle) && (
            <div>
              {title && (
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #0f172a)', letterSpacing: '-0.01em' }}>
                  {title}
                </div>
              )}
              {subtitle && (
                <div style={{ fontSize: '12px', color: 'var(--text-secondary, #64748b)', marginTop: '2px' }}>
                  {subtitle}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {layerControls && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary, #475569)', background: 'var(--surface-sunken, #f1f5f9)', padding: '3px 8px', borderRadius: 'var(--radius-sm, 4px)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={showRegions} onChange={e => setShowRegions(e.target.checked)} style={{ margin: 0 }} />
                  Regions
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={showHubs} onChange={e => setShowHubs(e.target.checked)} style={{ margin: 0 }} />
                  Hubs
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={showRoutes} onChange={e => setShowRoutes(e.target.checked)} style={{ margin: 0 }} />
                  Corridors
                </label>
              </div>
            )}

            {searchable && (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search city/hub..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    fontSize: '11px',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm, 4px)',
                    border: '1px solid var(--border-subtle, #cbd5e1)',
                    background: 'var(--surface-card, #ffffff)',
                    color: 'var(--text-primary, #0f172a)',
                    width: '120px'
                  }}
                  aria-label="Search map location"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '12px', color: '#94a3b8' }}
                  >
                    &times;
                  </button>
                )}
              </div>
            )}

            {zoomable && (
              <div style={{ display: 'inline-flex', background: 'var(--surface-card, #ffffff)', border: '1px solid var(--border-subtle, #cbd5e1)', borderRadius: 'var(--radius-sm, 4px)', overflow: 'hidden' }}>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  style={{ padding: '3px 8px', background: 'transparent', border: 'none', borderRight: '1px solid var(--border-subtle, #cbd5e1)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary, #475569)' }}
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={handleZoomOut}
                  style={{ padding: '3px 8px', background: 'transparent', border: 'none', borderRight: '1px solid var(--border-subtle, #cbd5e1)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary, #475569)' }}
                  title="Zoom Out"
                >
                  &minus;
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  style={{ padding: '3px 8px', background: 'transparent', border: 'none', fontSize: '11px', cursor: 'pointer', color: 'var(--text-secondary, #475569)' }}
                  title="Reset View"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <svg
        width="100%"
        height={numericHeight}
        viewBox={`0 0 ${numericWidth} ${numericHeight}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '100%',
          background: 'var(--surface-sunken, #f8fafc)',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          borderRadius: 'var(--radius-md, 6px)',
          overflow: 'hidden',
          cursor: isPanning ? 'grabbing' : (zoomable ? 'grab' : 'default')
        }}
      >
        <defs>
          {patternFills && PATTERN_PRESETS.map(pat => (
            <pattern
              key={pat.id}
              id={`geo-${pat.id}`}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform={pat.transform || undefined}
            >
              {pat.type === 'circle' ? (
                <circle cx="4" cy="4" r={pat.r || 1.2} fill={pat.fill || 'rgba(255,255,255,0.45)'} />
              ) : (
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke={pat.stroke || 'rgba(255,255,255,0.35)'}
                  strokeWidth={pat.strokeWidth || 1.5}
                />
              )}
            </pattern>
          ))}

          <filter id="geo-hub-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.25" floodColor="#2563eb" />
          </filter>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {showRegions && (
            <g className="geo-regions">
              {regions.map((reg, idx) => {
                const isSelected = reg.id === selectedId;
                const isHovered = hoveredFeature?.id === reg.id;
                const isPathActive = activeFeatures.ids.has(reg.id);
                const isDimmed = activeFeatures.isActive && !isPathActive;
                const baseColor = reg.color || reg.fill || colorScale[idx % colorScale.length];
                const d = reg.path || reg.d || '';
                const [cx, cy] = reg.centroid || getPathCentroid(d);
                const regionCode = reg.code || reg.label?.split(' ')[0] || reg.id.replace('reg-', '').toUpperCase();
                const isChoropleth = variant === 'choropleth';

                return (
                  <g key={reg.id} className="geo-region-group">
                    <path
                      d={d}
                      fill={baseColor}
                      fillOpacity={isDimmed ? 0.06 : (isSelected || isHovered ? 0.65 : (isChoropleth ? 0.40 : 0.18))}
                      stroke={isSelected ? '#0f172a' : (reg.stroke || (isChoropleth ? '#64748b' : 'rgba(148, 163, 184, 0.45)'))}
                      strokeWidth={isSelected ? 1.5 : (isChoropleth ? 1.25 : 0.75)}
                      onClick={() => handleSelectFeature(reg)}
                      onMouseEnter={(e) => {
                        const rect = containerRef.current?.getBoundingClientRect();
                        setHoveredFeature({
                          ...reg,
                          label: reg.label || reg.name || reg.id,
                          clientX: e.clientX - (rect?.left || 0),
                          clientY: e.clientY - (rect?.top || 0)
                        });
                      }}
                      onMouseLeave={() => setHoveredFeature(null)}
                      style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s ease' }}
                    />

                    {cx > 0 && cy > 0 && (
                      <text
                        x={cx}
                        y={cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={isChoropleth ? '10px' : '9px'}
                        fontWeight={isChoropleth ? '700' : '600'}
                        fill={isChoropleth ? 'var(--text-primary, #0f172a)' : 'var(--text-muted, #64748b)'}
                        opacity={isDimmed ? 0.2 : (isChoropleth ? 0.95 : 0.7)}
                        style={{
                          pointerEvents: 'none',
                          paintOrder: 'stroke',
                          stroke: 'rgba(255,255,255,0.92)',
                          strokeWidth: 2.2,
                          strokeLinejoin: 'round',
                          letterSpacing: '0.4px'
                        }}
                      >
                        {isChoropleth && reg.value !== undefined
                          ? `${regionCode} · ${reg.value}%`
                          : regionCode}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {showRoutes && (
            <g className="geo-routes">
              {projectedRoutes.map(route => {
                const isPathActive = activeFeatures.routeIds.has(route.id);
                const isDimmed = activeFeatures.isActive && !isPathActive;
                const isSelected = route.id === selectedId;

                return (
                  <path
                    key={route.id}
                    d={route.pathD}
                    fill="none"
                    stroke={isPathActive || isSelected ? 'var(--action-solid, #2563eb)' : '#94a3b8'}
                    strokeWidth={isPathActive || isSelected ? 2 : 1.25}
                    strokeDasharray={route.status === 'In-Transit' ? '4 3' : (route.status === 'Delayed' ? '2 2' : undefined)}
                    strokeOpacity={isDimmed ? 0.2 : (isPathActive ? 0.95 : 0.55)}
                    onClick={() => handleSelectFeature(route)}
                    onMouseEnter={(e) => {
                      const rect = containerRef.current?.getBoundingClientRect();
                      setHoveredFeature({
                        ...route,
                        clientX: e.clientX - (rect?.left || 0),
                        clientY: e.clientY - (rect?.top || 0)
                      });
                    }}
                    onMouseLeave={() => setHoveredFeature(null)}
                    style={{ cursor: 'pointer', transition: 'stroke-opacity 0.2s ease' }}
                  />
                );
              })}
            </g>
          )}

          {showHubs && (
            <g className="geo-hubs">
              {projectedHubs.map((hub) => {
                const isSelected = hub.id === selectedId;
                const isFocused = navigableList[focusedIndex]?.id === hub.id;
                const isPathActive = activeFeatures.ids.has(hub.id);
                const isDimmed = activeFeatures.isActive && !isPathActive;
                const isHQ = hub.category === 'HQ Plant';

                const r = hub.size || (isHQ ? 9 : 7);
                const isWestAligned = hub.id === 'hub-mumbai';

                return (
                  <g
                    key={hub.id}
                    className="geo-hub-mark"
                    transform={`translate(${hub.x}, ${hub.y})`}
                    onClick={() => handleSelectFeature(hub)}
                    onMouseEnter={(e) => {
                      const rect = containerRef.current?.getBoundingClientRect();
                      setHoveredFeature({
                        ...hub,
                        clientX: e.clientX - (rect?.left || 0),
                        clientY: e.clientY - (rect?.top || 0)
                      });
                    }}
                    onMouseLeave={() => setHoveredFeature(null)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    tabIndex={-1}
                    aria-label={`${hub.label}: ${formatVizValue(hub.value, unit, locale)}`}
                  >
                    {isHQ && (
                      <circle
                        cx={0}
                        cy={0}
                        r={r + 3.5}
                        fill="none"
                        stroke="var(--action-solid, #2563eb)"
                        strokeWidth={1.5}
                        opacity={0.65}
                      />
                    )}

                    {(isSelected || isFocused) && (
                      <circle
                        cx={0}
                        cy={0}
                        r={r + 4}
                        fill="none"
                        stroke="var(--action-solid, #2563eb)"
                        strokeWidth={2}
                        strokeDasharray="3 2"
                      />
                    )}

                    <circle
                      cx={0}
                      cy={0}
                      r={r}
                      fill={getHubFillColor(hub)}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      opacity={isDimmed ? 0.35 : 1.0}
                      style={{ transition: 'opacity 0.2s ease, r 0.15s ease' }}
                    />

                    <circle cx={0} cy={0} r={isHQ ? 2.5 : 2} fill="#ffffff" opacity={isDimmed ? 0.4 : 0.9} />

                    <text
                      x={isWestAligned ? -r - 5 : 0}
                      y={isWestAligned ? 3 : r + 9}
                      textAnchor={isWestAligned ? 'end' : 'middle'}
                      fontSize="9.5px"
                      fontWeight="600"
                      fill="var(--text-primary, #0f172a)"
                      opacity={isDimmed ? 0.4 : 1.0}
                      style={{
                        pointerEvents: 'none',
                        paintOrder: 'stroke',
                        stroke: 'rgba(255,255,255,0.95)',
                        strokeWidth: 2.5,
                        strokeLinejoin: 'round'
                      }}
                    >
                      {hub.label}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </g>
      </svg>

      {isEmpty && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: 'var(--text-muted, #64748b)',
            fontSize: '13px',
            textAlign: 'center',
            padding: '24px',
            pointerEvents: 'none'
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="m4.93 4.93 14.14 14.14" />
          </svg>
          <div style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
            No Active Geographic Telemetry
          </div>
          <div style={{ fontSize: '11px', maxWidth: '320px' }}>
            {ariaLabel || 'No active vessel or GIS telemetry received from logistics transponders.'}
          </div>
        </div>
      )}

      {isLegendVisible && !isEmpty && (
        <div
          className="geo-map-legend"
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            background: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(6px)',
            padding: '5px 10px',
            borderRadius: 'var(--radius-sm, 6px)',
            border: '1px solid var(--border-subtle, #e2e8f0)',
            boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--text-secondary, #475569)',
            zIndex: 10
          }}
          aria-label="Map Legend"
        >
          {variant === 'choropleth' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted, #64748b)', fontWeight: 600 }}>Density: Low (0%)</span>
              <div
                style={{
                  width: '90px',
                  height: '8px',
                  borderRadius: '3px',
                  background: 'linear-gradient(to right, rgba(37,99,235,0.2), rgba(37,99,235,0.9))'
                }}
              />
              <span style={{ fontSize: '10px', color: 'var(--text-primary, #0f172a)', fontWeight: 600 }}>High (100%)</span>
            </div>
          ) : (
            <>
              {showHubs && (
                <>
                  <button
                    type="button"
                    onClick={() => toggleCategory('HQ Plant')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'none',
                      border: 'none',
                      padding: '2px 4px',
                      cursor: 'pointer',
                      opacity: hiddenCategories.has('HQ Plant') ? 0.35 : 1,
                      textDecoration: hiddenCategories.has('HQ Plant') ? 'line-through' : 'none',
                      color: 'inherit',
                      font: 'inherit'
                    }}
                    title="Toggle HQ Plant nodes"
                  >
                    <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: 'var(--action-solid, #2563eb)', border: '1.5px solid #ffffff', boxShadow: '0 0 0 1px #2563eb' }} />
                    <span>HQ Plant</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCategory('OEM Client')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'none',
                      border: 'none',
                      padding: '2px 4px',
                      cursor: 'pointer',
                      opacity: hiddenCategories.has('OEM Client') ? 0.35 : 1,
                      textDecoration: hiddenCategories.has('OEM Client') ? 'line-through' : 'none',
                      color: 'inherit',
                      font: 'inherit'
                    }}
                    title="Toggle OEM Client nodes"
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7c3aed' }} />
                    <span>OEM Client</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCategory('Supplier')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'none',
                      border: 'none',
                      padding: '2px 4px',
                      cursor: 'pointer',
                      opacity: hiddenCategories.has('Supplier') ? 0.35 : 1,
                      textDecoration: hiddenCategories.has('Supplier') ? 'line-through' : 'none',
                      color: 'inherit',
                      font: 'inherit'
                    }}
                    title="Toggle Supplier nodes"
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
                    <span>Supplier</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCategory('Logistics Port')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'none',
                      border: 'none',
                      padding: '2px 4px',
                      cursor: 'pointer',
                      opacity: hiddenCategories.has('Logistics Port') ? 0.35 : 1,
                      textDecoration: hiddenCategories.has('Logistics Port') ? 'line-through' : 'none',
                      color: 'inherit',
                      font: 'inherit'
                    }}
                    title="Toggle Port nodes"
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#d97706' }} />
                    <span>Port</span>
                  </button>
                </>
              )}
              {showRoutes && (
                <>
                  <button
                    type="button"
                    onClick={() => toggleCategory('Road')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'none',
                      border: 'none',
                      padding: '2px 4px',
                      cursor: 'pointer',
                      opacity: hiddenCategories.has('Road') ? 0.35 : 1,
                      textDecoration: hiddenCategories.has('Road') ? 'line-through' : 'none',
                      color: 'inherit',
                      font: 'inherit'
                    }}
                    title="Toggle Road Freight routes"
                  >
                    <span style={{ width: '12px', height: '2px', background: 'var(--action-solid, #2563eb)' }} />
                    <span>Road Freight</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleCategory('Rail')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'none',
                      border: 'none',
                      padding: '2px 4px',
                      cursor: 'pointer',
                      opacity: hiddenCategories.has('Rail') ? 0.35 : 1,
                      textDecoration: hiddenCategories.has('Rail') ? 'line-through' : 'none',
                      color: 'inherit',
                      font: 'inherit'
                    }}
                    title="Toggle Rail routes"
                  >
                    <span style={{ width: '12px', height: '0', borderTop: '2px dashed #94a3b8' }} />
                    <span>Rail Route</span>
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}

      {hoveredFeature && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(hoveredFeature.clientX + 14, numericWidth - 210),
            top: Math.max(10, Math.min(hoveredFeature.clientY - 20, height - 90)),
            background: 'var(--surface-floating, #0f172a)',
            color: '#f8fafc',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm, 6px)',
            fontSize: '11px',
            lineHeight: 1.4,
            boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.3))',
            pointerEvents: 'none',
            zIndex: 60,
            maxWidth: '240px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
            <div style={{ fontWeight: 600, fontSize: '12px', color: '#ffffff' }}>
              {hoveredFeature.label || hoveredFeature.name || hoveredFeature.id}
            </div>
            {hoveredFeature.category && (
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  background: getHubFillColor(hoveredFeature),
                  color: '#ffffff',
                  whiteSpace: 'nowrap'
                }}
              >
                {hoveredFeature.category}
              </span>
            )}
          </div>
          {hoveredFeature.role && (
            <div style={{ color: '#94a3b8', fontSize: '10px' }}>{hoveredFeature.role}</div>
          )}
          {hoveredFeature.value !== undefined && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '4px' }}>
              <span style={{ color: '#94a3b8' }}>Throughput / Volume:</span>
              <strong style={{ color: '#38bdf8' }}>{formatVizValue(hoveredFeature.value, unit, locale)}</strong>
            </div>
          )}
          {hoveredFeature.status && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ color: '#94a3b8' }}>Status:</span>
              <span>{hoveredFeature.status}</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default GeoMap;
