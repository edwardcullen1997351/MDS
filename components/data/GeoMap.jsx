import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  createGeoProjection,
  createCurvedRoutePath,
  VIZ_COLORS,
  PATTERN_PRESETS,
  VIZ_SEMANTIC_COLORS,
  formatVizValue
} from './viz-core.js';

/**
 * Built-in Lightweight Vector Geometries for Indian Automotive & Industrial Clusters
 */
const DEFAULT_INDIA_REGIONS = [
  { id: 'reg-mh', label: 'Maharashtra (Auto Corridor)', path: 'M 240 230 L 310 215 L 350 250 L 330 310 L 260 325 L 220 275 Z', value: 88, category: 'Tier-1 Hub' },
  { id: 'reg-gj', label: 'Gujarat (Sanand & Hazira)', path: 'M 190 180 L 240 170 L 250 220 L 205 240 L 175 210 Z', value: 74, category: 'Assembly Zone' },
  { id: 'reg-ka', label: 'Karnataka (Raw Materials & Tech)', path: 'M 255 320 L 305 310 L 315 375 L 275 410 L 245 350 Z', value: 65, category: 'Steel / Mining' },
  { id: 'reg-tn', label: 'Tamil Nadu (Chennai Auto Belt)', path: 'M 305 370 L 350 360 L 365 425 L 310 445 L 295 400 Z', value: 82, category: 'Export Hub' },
  { id: 'reg-hr-dl', label: 'NCR / Haryana (Manesar Cluster)', path: 'M 265 110 L 315 95 L 330 135 L 290 155 L 255 130 Z', value: 79, category: 'Assembly Zone' },
  { id: 'reg-jh-wb', label: 'Eastern Belt (Jamshedpur / Steel)', path: 'M 405 185 L 465 175 L 475 235 L 420 250 L 390 210 Z', value: 70, category: 'Raw Materials' }
];

const DEFAULT_INDIA_HUBS = [
  { id: 'hub-chakan', label: 'Chakan Plant PL-04 (Pune)', coordinates: [73.85, 18.75], role: 'Primary Manufacturing Plant', status: 'Operational', value: 4250, size: 18, category: 'HQ Plant' },
  { id: 'hub-mumbai', label: 'Nhava Sheva Port (JNPT)', coordinates: [72.95, 18.95], role: 'Sea Export Terminal', status: 'Active', value: 2100, size: 14, category: 'Logistics Port' },
  { id: 'hub-sanand', label: 'Sanand Assembly Hub (Tata)', coordinates: [72.38, 23.0], role: 'OEM EV Assembly Client', status: 'Active', value: 1850, size: 14, category: 'OEM Client' },
  { id: 'hub-manesar', label: 'Manesar Auto Hub (NCR)', coordinates: [76.93, 28.35], role: 'OEM Stamping Delivery', status: 'Active', value: 1650, size: 13, category: 'OEM Client' },
  { id: 'hub-chennai', label: 'Sriperumbudur Hub (Chennai)', coordinates: [79.95, 12.97], role: 'OEM Assembly Client', status: 'Active', value: 1950, size: 14, category: 'OEM Client' },
  { id: 'hub-jsw', label: 'JSW Vijayanagar (Bellary)', coordinates: [76.65, 15.15], role: 'Raw Steel Coil Supplier', status: 'Active', value: 3100, size: 15, category: 'Supplier' },
  { id: 'hub-jamshedpur', label: 'Tata Steel (Jamshedpur)', coordinates: [86.20, 22.80], role: 'High-Tensile Sheet Supplier', status: 'Active', value: 2400, size: 14, category: 'Supplier' },
  { id: 'hub-aurangabad', label: 'Waluj Toolroom (Aurangabad)', coordinates: [75.32, 19.87], role: 'Die Stamping Satellite', status: 'Active', value: 1200, size: 12, category: 'Satellite Plant' }
];

const DEFAULT_SUPPLY_ROUTES = [
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
 *
 * Visualizes spatial distributions, regional choropleths, logistics hubs, and supply chain routes.
 * Features customizable projection math, interactive pan & zoom, layer visibility toggles,
 * connected corridor highlights, search filtering, WCAG hatch textures, and accessible tabular modals (Alt+F11).
 */
export function GeoMap({
  regions = DEFAULT_INDIA_REGIONS,
  hubs = DEFAULT_INDIA_HUBS,
  routes = DEFAULT_SUPPLY_ROUTES,
  width = 760,
  height = 480,
  projection = 'mercator',
  center = [78.5, 21.0], // Center of India
  scale = 920,
  variant = 'hybrid', // 'hybrid' | 'choropleth' | 'bubble' | 'route'
  colorScale = VIZ_COLORS,
  patternFills = true,
  unit = '',
  locale = 'en-IN',
  title = '',
  subtitle = '',
  searchable = true,
  zoomable = true,
  layerControls = true,
  selectedId: controlledSelectedId = null,
  onFeatureClick = null,
  onSelectionChange = null,
  className = ''
}) {
  const [internalSelectedId, setInternalSelectedId] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showTableModal, setShowTableModal] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Layer Visibility state
  const [showRegions, setShowRegions] = useState(variant !== 'bubble' && variant !== 'route');
  const [showHubs, setShowHubs] = useState(variant !== 'choropleth');
  const [showRoutes, setShowRoutes] = useState(variant === 'hybrid' || variant === 'route');

  // Viewport Pan & Zoom
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  const selectedId = controlledSelectedId !== undefined && controlledSelectedId !== null
    ? controlledSelectedId
    : internalSelectedId;

  // Geographic Projection Instance
  const geoProj = useMemo(() => {
    return createGeoProjection({
      center,
      scale,
      width,
      height,
      projection
    });
  }, [center, scale, width, height, projection]);

  // Projected Hub Coordinates
  const projectedHubs = useMemo(() => {
    return hubs.map(hub => {
      const [x, y] = geoProj.project(hub.coordinates);
      return {
        ...hub,
        x,
        y
      };
    });
  }, [hubs, geoProj]);

  // Projected Routes
  const projectedRoutes = useMemo(() => {
    const hubMap = new Map(projectedHubs.map(h => [h.id, h]));
    return routes.map(route => {
      const s = hubMap.get(route.sourceId);
      const t = hubMap.get(route.targetId);
      if (!s || !t) return null;
      const pathD = createCurvedRoutePath({
        sourcePoint: [s.x, s.y],
        targetPoint: [t.x, t.y],
        curvature: route.curvature !== undefined ? route.curvature : 0.2
      });
      return {
        ...route,
        source: s,
        target: t,
        pathD
      };
    }).filter(Boolean);
  }, [routes, projectedHubs]);

  // Search Filter matching
  const searchMatchIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set();
    const q = searchQuery.toLowerCase();
    const set = new Set();
    regions.forEach(r => {
      if (r.label.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) set.add(r.id);
    });
    projectedHubs.forEach(h => {
      if (h.label.toLowerCase().includes(q) || h.id.toLowerCase().includes(q) || h.role?.toLowerCase().includes(q)) set.add(h.id);
    });
    return set;
  }, [searchQuery, regions, projectedHubs]);

  // Active Highlighting Sets
  const activeFeatures = useMemo(() => {
    const activeIds = new Set();
    const activeRouteIds = new Set();

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

    // If hub selected, highlight connected routes
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

  // Handle Feature Selection
  const handleSelectFeature = useCallback((feat) => {
    const nextId = selectedId === feat.id ? null : feat.id;
    setInternalSelectedId(nextId);
    setAnnouncement(`Selected spatial feature ${feat.label || feat.id}${feat.value ? `: ${formatVizValue(feat.value, unit, locale)}` : ''}.`);
    if (onFeatureClick) onFeatureClick(feat);
    if (onSelectionChange) onSelectionChange(nextId ? feat : null);
  }, [selectedId, unit, locale, onFeatureClick, onSelectionChange]);

  // Keyboard navigation across navigable features
  const navigableList = useMemo(() => [...projectedHubs, ...regions], [projectedHubs, regions]);

  const handleKeyDown = useCallback((e) => {
    if (navigableList.length === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = (prev + 1) % navigableList.length;
        const target = navigableList[next];
        setAnnouncement(`Focused ${target.label}`);
        return next;
      });
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = (prev - 1 + navigableList.length) % navigableList.length;
        const target = navigableList[next];
        setAnnouncement(`Focused ${target.label}`);
        return next;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < navigableList.length) {
        handleSelectFeature(navigableList[focusedIndex]);
      }
    } else if (e.altKey && (e.key === 'F11' || e.keyCode === 122)) {
      e.preventDefault();
      setShowTableModal(prev => !prev);
    }
  }, [navigableList, focusedIndex, handleSelectFeature]);

  // Pan & Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(3.0, z + 0.25));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, z - 0.25));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (!zoomable) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
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
      aria-label={`Geographic Map: ${title || 'Spatial Distribution'}. ${projectedHubs.length} logistics hubs, ${regions.length} industrial regions. Use arrow keys to navigate features, Enter to select, Alt+F11 for accessible tabular modal.`}
    >
      {/* Live Region for Screen Reader Announcements */}
      <div aria-live="polite" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
        {announcement}
      </div>

      {/* Header & Controls Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
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

        {/* Toolbar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Layer Visibility Checkboxes */}
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
                  width: '115px'
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

          <button
            type="button"
            onClick={() => setShowTableModal(true)}
            style={{
              fontSize: '11px',
              fontWeight: 500,
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm, 4px)',
              border: '1px solid var(--border-subtle, #cbd5e1)',
              background: 'var(--surface-card, #ffffff)',
              color: 'var(--text-secondary, #475569)',
              cursor: 'pointer'
            }}
            title="Open Accessible Spatial Data Table (Alt+F11)"
            aria-label="Open accessible geographic data table"
          >
            Accessible Table
          </button>
        </div>
      </div>

      {/* SVG Canvas for Map */}
      <svg
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          display: 'block',
          background: 'var(--surface-sunken, #f8fafc)',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          borderRadius: 'var(--radius-md, 6px)',
          overflow: 'hidden',
          cursor: isPanning ? 'grabbing' : (zoomable ? 'grab' : 'default')
        }}
      >
        <defs>
          {/* SVG Patterns for Choropleth Fills */}
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

          {/* Marker Arrow for Freight Corridors */}
          <marker
            id="geo-route-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--action-solid, #2563eb)" />
          </marker>

          <filter id="geo-hub-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" floodColor="#2563eb" />
          </filter>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* 1. Regional Choropleth Polygons */}
          {showRegions && (
            <g className="geo-regions">
              {regions.map((reg, idx) => {
                const isSelected = reg.id === selectedId;
                const isHovered = hoveredFeature?.id === reg.id;
                const isPathActive = activeFeatures.ids.has(reg.id);
                const isDimmed = activeFeatures.isActive && !isPathActive;

                const baseColor = reg.color || colorScale[idx % colorScale.length];

                return (
                  <path
                    key={reg.id}
                    d={reg.path}
                    fill={baseColor}
                    fillOpacity={isDimmed ? 0.15 : (isSelected || isHovered ? 0.85 : 0.45)}
                    stroke={isSelected ? '#0f172a' : '#ffffff'}
                    strokeWidth={isSelected ? 2 : 1}
                    onClick={() => handleSelectFeature(reg)}
                    onMouseEnter={(e) => {
                      const rect = containerRef.current?.getBoundingClientRect();
                      setHoveredFeature({
                        ...reg,
                        clientX: e.clientX - (rect?.left || 0),
                        clientY: e.clientY - (rect?.top || 0)
                      });
                    }}
                    onMouseLeave={() => setHoveredFeature(null)}
                    style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s ease' }}
                  />
                );
              })}
            </g>
          )}

          {/* 2. Supply Chain & Logistics Route Corridors */}
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
                    strokeWidth={isPathActive || isSelected ? 2.5 : 1.5}
                    strokeDasharray={route.status === 'In-Transit' ? '4 3' : (route.status === 'Delayed' ? '2 2' : undefined)}
                    strokeOpacity={isDimmed ? 0.1 : (isPathActive ? 0.95 : 0.55)}
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

          {/* 3. Logistics Hubs & Plant Point Marks */}
          {showHubs && (
            <g className="geo-hubs">
              {projectedHubs.map((hub, index) => {
                const isSelected = hub.id === selectedId;
                const isFocused = navigableList[focusedIndex]?.id === hub.id;
                const isPathActive = activeFeatures.ids.has(hub.id);
                const isDimmed = activeFeatures.isActive && !isPathActive;
                const isHQ = hub.category === 'HQ Plant';

                const r = hub.size || 12;

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
                    {/* Ripple Pulse for Primary Chakan HQ Hub */}
                    {isHQ && (
                      <circle
                        cx={0}
                        cy={0}
                        r={r + 6}
                        fill="none"
                        stroke="var(--action-solid, #2563eb)"
                        strokeWidth={1.5}
                        opacity={0.6}
                      />
                    )}

                    {/* Focus / Selection Ring */}
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

                    {/* Base Node Bubble */}
                    <circle
                      cx={0}
                      cy={0}
                      r={r}
                      fill={isHQ ? 'var(--action-solid, #2563eb)' : '#0d9488'}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 3 : 2}
                      opacity={isDimmed ? 0.2 : 1.0}
                      filter={isSelected ? 'url(#geo-hub-glow)' : undefined}
                      style={{ transition: 'opacity 0.2s ease, r 0.15s ease' }}
                    />

                    {/* Center Icon/Dot */}
                    <circle cx={0} cy={0} r={3} fill="#ffffff" opacity={isDimmed ? 0.3 : 0.9} />

                    {/* Hub Title Label */}
                    <text
                      x={0}
                      y={r + 11}
                      textAnchor="middle"
                      fontSize="10px"
                      fontWeight="600"
                      fill="var(--text-primary, #0f172a)"
                      opacity={isDimmed ? 0.2 : 1.0}
                      style={{
                        pointerEvents: 'none',
                        paintOrder: 'stroke',
                        stroke: 'rgba(255,255,255,0.95)',
                        strokeWidth: 3,
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

      {/* Floating Inspection Tooltip */}
      {hoveredFeature && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(hoveredFeature.clientX + 14, width - 210),
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
            maxWidth: '230px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '12px', color: '#ffffff' }}>
            {hoveredFeature.label || hoveredFeature.id}
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

      {/* Accessible Geographic Data Table Modal */}
      {showTableModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={() => setShowTableModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--surface-card, #ffffff)',
              borderRadius: 'var(--radius-lg, 8px)',
              boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.3))',
              maxWidth: '740px',
              width: '100%',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle, #cbd5e1)'
            }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Accessible Geographic Spatial Data Table"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle, #e2e8f0)' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                Geographic Spatial Table: {title || 'Map Data'}
              </h3>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--text-muted, #64748b)'
                }}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div style={{ overflowY: 'auto', padding: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-strong, #cbd5e1)', background: 'var(--surface-sunken, #f8fafc)' }}>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)' }}>Spatial Feature / Hub</th>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)' }}>Category</th>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)' }}>Coordinates</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--text-secondary, #475569)' }}>Volume ({unit || 'qty'})</th>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projectedHubs.map(hub => (
                    <tr
                      key={hub.id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle, #f1f5f9)',
                        background: hub.id === selectedId ? 'var(--surface-active, #eff6ff)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '6px 10px', fontWeight: 600 }}>📍 {hub.label}</td>
                      <td style={{ padding: '6px 10px', color: 'var(--text-secondary, #475569)' }}>{hub.category || hub.role}</td>
                      <td style={{ padding: '6px 10px', color: 'var(--text-muted, #64748b)', fontSize: '11px', fontVariantNumeric: 'tabular-nums' }}>
                        {hub.coordinates ? `${hub.coordinates[1]}°N, ${hub.coordinates[0]}°E` : '—'}
                      </td>
                      <td style={{ padding: '6px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {formatVizValue(hub.value, unit, locale)}
                      </td>
                      <td style={{ padding: '6px 10px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: VIZ_SEMANTIC_COLORS.success }}>
                          ● {hub.status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {regions.map(reg => (
                    <tr key={reg.id} style={{ borderBottom: '1px solid var(--border-subtle, #f1f5f9)' }}>
                      <td style={{ padding: '6px 10px', fontWeight: 600 }}>🗺️ {reg.label}</td>
                      <td style={{ padding: '6px 10px', color: 'var(--text-secondary, #475569)' }}>{reg.category || 'Region'}</td>
                      <td style={{ padding: '6px 10px', color: 'var(--text-muted, #64748b)', fontSize: '11px' }}>Region Polygon</td>
                      <td style={{ padding: '6px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {formatVizValue(reg.value, '%', locale)}
                      </td>
                      <td style={{ padding: '6px 10px', color: 'var(--text-muted, #64748b)' }}>Industrial Cluster</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 16px', background: 'var(--surface-sunken, #f8fafc)', borderTop: '1px solid var(--border-subtle, #e2e8f0)' }}>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm, 4px)',
                  background: 'var(--action-solid, #2563eb)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Close Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default GeoMap;
