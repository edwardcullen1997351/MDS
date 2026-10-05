/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-tabindex -- keyboard-operated visualization surface; interactive controls retain native semantics */
import React,{ useCallback,useMemo,useRef,useState } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import {
STROKE_DASH_PATTERNS,
useResponsiveVizBounds
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

export interface ParallelCoordinatesProps {
  data?: Record<string, any>[];
  dimensions?: (ParallelDimension | string)[];
  variant?: ParallelCoordinatesVariant;
  width?: number;
  height?: number;
  title?: string;
  subtitle?: string;
  colorKey?: string;
  idKey?: string;
  labelKey?: string;
  smooth?: boolean;
  normalized?: boolean;
  showBrushControls?: boolean;
  showControls?: boolean;
  showSearch?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onRecordClick?: (record: Record<string, any>, event: React.MouseEvent) => void;
  renderTooltip?: (record: Record<string, any>) => React.ReactNode;
  ariaLabel?: string;
}

const CLUSTER_COLORS = [
  '#0284c7', // Sky blue
  '#16a34a', // Emerald green
  '#d97706', // Amber warning
  '#7c3aed', // Purple
  '#dc2626', // Ruby critical
  '#0d9488'  // Teal
];

/**
 * ParallelCoordinates — Meridian Design System
 *
 * High-dimensional multivariate profile visualization across parallel axes.
 */
export const ParallelCoordinates: React.FC<ParallelCoordinatesProps> = ({
  data = [],
  dimensions = [],
  variant = 'standard',
  width = 860,
  height = 420,
  title = 'Multivariate Process & Quality Telemetry',
  subtitle = '',
  colorKey = 'cluster',
  idKey = 'id',
  labelKey = 'label',
  smooth = false,
  normalized = false,
  showBrushControls = true,
  showControls = true,
  showSearch = true,
  className = '',
  style = {},
  onRecordClick,
  renderTooltip,
  ariaLabel
}) => {
  const [dimensionState, setDimensionState] = useState(() => ({
    source: dimensions,
    value: dimensions,
  }));
  if (dimensionState.source !== dimensions) {
    setDimensionState({ source: dimensions, value: dimensions });
  }
  const activeDimensions = dimensionState.value;
  const setActiveDimensions: React.Dispatch<
    React.SetStateAction<(ParallelDimension | string)[]>
  > = (action) => {
    setDimensionState((previous) => {
      const current = previous.source === dimensions ? previous.value : dimensions;
      return {
        source: dimensions,
        value: typeof action === 'function' ? action(current) : action,
      };
    });
  };
  const [isNormalized, setIsNormalized] = useState(normalized || variant === 'normalized');
  const [isSmooth, setIsSmooth] = useState(smooth || variant === 'spline');
  const [activeBrushes, setActiveBrushes] = useState<Record<string, { min?: number | null; max?: number | null }>>({});
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [hoveredRecord, setHoveredRecord] = useState<Record<string, any> | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [tooltipPos, setTooltipPos] = useState<{ clientX: number; clientY: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const tableDialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(tableDialogRef, showTableModal);
  const [announcement, setAnnouncement] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const { width: measuredWidth, height: measuredHeight, densityTier } = useResponsiveVizBounds(containerRef, typeof width === 'number' ? width : 840, typeof height === 'number' ? height : 440);

  const plotWidth = Math.max(280, measuredWidth || (typeof width === 'number' ? width : 840));
  const plotHeight = Math.max(200, measuredHeight || (typeof height === 'number' ? height : 440));

  // Filter Data by Search Query & Active 1D Brushes
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return data.filter(d => {
      // 1. Text Search Filter
      if (q) {
        const idVal = String(d[idKey] || '').toLowerCase();
        const lblVal = String(d[labelKey] || '').toLowerCase();
        const clusterVal = String(d[colorKey] || '').toLowerCase();
        if (!idVal.includes(q) && !lblVal.includes(q) && !clusterVal.includes(q)) {
          return false;
        }
      }

      // 2. Multidimensional Range Brush Filter
      const brushKeys = Object.keys(activeBrushes);
      for (let i = 0; i < brushKeys.length; i++) {
        const k = brushKeys[i];
        const brush = activeBrushes[k];
        if (brush && (brush.min != null || brush.max != null)) {
          const val = Number(d[k]);
          if (isNaN(val)) return false;
          if (brush.min != null && val < brush.min) return false;
          if (brush.max != null && val > brush.max) return false;
        }
      }

      return true;
    });
  }, [data, searchQuery, activeBrushes, idKey, labelKey, colorKey]);

  // Layout Dimensions & Margins
  const margin = useMemo(() => {
    const isMobile = densityTier === 'compact';
    return {
      top: 36,
      right: isMobile ? 24 : 48,
      bottom: 40,
      left: isMobile ? 24 : 48
    };
  }, [densityTier]);

  const innerWidth = Math.max(100, plotWidth - margin.left - margin.right);
  const innerHeight = Math.max(100, plotHeight - margin.top - margin.bottom);

  // Compute Domain Bounds for each Dimension
  const dimensionDomains = useMemo(() => {
    const domains: Record<string, {
      key: string;
      min: number;
      max: number;
      rawMin: number;
      rawMax: number;
      span: number;
      unit: string;
      label: string;
      inverted: boolean;
    }> = {};
    activeDimensions.forEach(dim => {
      const key = typeof dim === 'string' ? dim : dim.key;
      const dimObj = typeof dim === 'string' ? null : dim;
      let min = dimObj?.min != null ? Number(dimObj.min) : Infinity;
      let max = dimObj?.max != null ? Number(dimObj.max) : -Infinity;

      data.forEach(d => {
        const v = d[key] != null ? Number(d[key]) : null;
        if (v != null && !isNaN(v)) {
          if (v < min) min = v;
          if (v > max) max = v;
        }
      });

      if (min === Infinity || max === -Infinity) {
        min = 0;
        max = 100;
      }

      const span = max - min || 1;
      const pad = span * 0.05;
      const paddedMin = dimObj?.min != null ? dimObj.min : min - pad;
      const paddedMax = dimObj?.max != null ? dimObj.max : max + pad;

      domains[key] = {
        key,
        min: paddedMin,
        max: paddedMax,
        rawMin: min,
        rawMax: max,
        span: paddedMax - paddedMin,
        unit: dimObj?.unit || '',
        label: dimObj?.label || key,
        inverted: !!dimObj?.inverted
      };
    });
    return domains;
  }, [activeDimensions, data]);

  // Calculate Parallel Axis X Coordinates
  const axisCount = activeDimensions.length;
  const axisSpacing = axisCount > 1 ? innerWidth / (axisCount - 1) : innerWidth / 2;

  const axisXCoords = useMemo(() => {
    return activeDimensions.map((_, i) => i * axisSpacing);
  }, [activeDimensions, axisSpacing]);

  // Scaler mapping raw value to Y coordinate
  const valToY = useCallback((val: any, dimKey: string) => {
    const domain = dimensionDomains[dimKey];
    if (!domain || val == null || isNaN(Number(val))) return innerHeight / 2;

    if (isNormalized) {
      let norm = (Number(val) - domain.rawMin) / (domain.rawMax - domain.rawMin || 1);
      norm = Math.max(0, Math.min(1, norm));
      if (domain.inverted) norm = 1 - norm;
      return innerHeight - norm * innerHeight;
    }

    let norm = (Number(val) - domain.min) / domain.span;
    norm = Math.max(0, Math.min(1, norm));
    if (domain.inverted) norm = 1 - norm;
    return innerHeight - norm * innerHeight;
  }, [dimensionDomains, innerHeight, isNormalized]);

  // Generate Polyline SVG path
  const buildPolylinePath = useCallback((record: Record<string, any>) => {
    const points: [number, number][] = [];
    activeDimensions.forEach((dim, i) => {
      const key = typeof dim === 'string' ? dim : dim.key;
      const x = axisXCoords[i];
      const y = valToY(record[key], key);
      points.push([x, y]);
    });

    if (points.length === 0) return '';
    if (!isSmooth) {
      let p = `M ${points[0][0]} ${points[0][1]}`;
      for (let i = 1; i < points.length; i++) {
        p += ` L ${points[i][0]} ${points[i][1]}`;
      }
      return p;
    }

    let p = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const dx = p1[0] - p0[0];
      const cx1 = p0[0] + dx * 0.4;
      const cy1 = p0[1];
      const cx2 = p1[0] - dx * 0.4;
      const cy2 = p1[1];
      p += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p1[0]} ${p1[1]}`;
    }
    return p;
  }, [activeDimensions, axisXCoords, valToY, isSmooth]);

  // Color Mapping by Cluster or Status
  const getRecordColor = useCallback((record: Record<string, any>) => {
    if (record.color) return record.color;
    const cVal = record[colorKey];
    if (typeof cVal === 'number') {
      return CLUSTER_COLORS[cVal % CLUSTER_COLORS.length];
    }
    if (typeof cVal === 'string') {
      let hash = 0;
      for (let i = 0; i < cVal.length; i++) hash = cVal.charCodeAt(i) + ((hash << 5) - hash);
      const idx = Math.abs(hash) % CLUSTER_COLORS.length;
      return CLUSTER_COLORS[idx];
    }
    return CLUSTER_COLORS[0];
  }, [colorKey]);

  // Dual-Encoding Stroke Dash Pattern (WCAG 1.4.1)
  const getRecordDash = useCallback((record: Record<string, any>) => {
    const cVal = record[colorKey];
    if (typeof cVal === 'number') {
      return STROKE_DASH_PATTERNS[cVal % STROKE_DASH_PATTERNS.length];
    }
    if (typeof cVal === 'string') {
      let hash = 0;
      for (let i = 0; i < cVal.length; i++) hash = cVal.charCodeAt(i) + ((hash << 5) - hash);
      const idx = Math.abs(hash) % STROKE_DASH_PATTERNS.length;
      return STROKE_DASH_PATTERNS[idx];
    }
    return 'none';
  }, [colorKey]);

  // Axis Reordering Handlers
  const moveAxis = (idx: number, direction: number) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= activeDimensions.length) return;
    const next = [...activeDimensions];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setActiveDimensions(next);
    setAnnouncement(`Moved axis ${typeof temp === 'string' ? temp : temp.label} to position ${targetIdx + 1}`);
  };

  // Brush Filter Update
  const updateBrush = (key: string, field: 'min' | 'max', val: string) => {
    setActiveBrushes(prev => {
      const current = prev[key] || { min: dimensionDomains[key]?.rawMin, max: dimensionDomains[key]?.rawMax };
      const num = val === '' ? null : Number(val);
      const nextBrush = { ...current, [field]: num };
      return { ...prev, [key]: nextBrush };
    });
  };

  const clearAllBrushes = () => {
    setActiveBrushes({});
    setSearchQuery('');
    setAnnouncement('Cleared all active multidimensional brush filters');
  };

  // Keyboard Navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'F11' && e.altKey) {
      e.preventDefault();
      setShowTableModal(prev => !prev);
      return;
    }
    if (e.key === 'Escape') {
      if (showTableModal) {
        e.preventDefault();
        setShowTableModal(false);
        return;
      }
      if (selectedRecordId) {
        e.preventDefault();
        setSelectedRecordId(null);
        setHoveredRecord(null);
        return;
      }
    }
    if (filteredData.length === 0) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = (prev + 1) % filteredData.length;
        const rec = filteredData[next];
        setHoveredRecord(rec);
        setAnnouncement(`Record ${rec[labelKey] || rec[idKey]}, Cluster: ${rec[colorKey] || 'Standard'}`);
        return next;
      });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = (prev - 1 + filteredData.length) % filteredData.length;
        const rec = filteredData[next];
        setHoveredRecord(rec);
        setAnnouncement(`Record ${rec[labelKey] || rec[idKey]}, Cluster: ${rec[colorKey] || 'Standard'}`);
        return next;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < filteredData.length) {
        const rec = filteredData[focusedIndex];
        const nextId = selectedRecordId === rec[idKey] ? null : rec[idKey];
        setSelectedRecordId(nextId);
        if (onRecordClick) onRecordClick(rec, {} as any);
      }
    }
  }, [filteredData, focusedIndex, selectedRecordId, showTableModal, labelKey, idKey, colorKey, onRecordClick]);

  const activeBrushCount = Object.keys(activeBrushes).filter(k => activeBrushes[k].min != null || activeBrushes[k].max != null).length;

  return (
    <div
      ref={containerRef}
      className={`parallel-coordinates-container ${className}`}
      style={{
        position: 'relative',
        width: typeof width === 'number' ? `${width}px` : width,
        maxWidth: '100%',
        boxSizing: 'border-box',
        background: 'var(--surface-card, #ffffff)',
        border: '1px solid var(--border-subtle, #e2e8f0)',
        borderRadius: 'var(--radius-md, 8px)',
        padding: '16px 20px',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        outline: 'none',
        ...style
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel || `Parallel Coordinates: ${title}. ${filteredData.length} records across ${activeDimensions.length} dimensions. Use arrow keys to cycle, Alt+F11 for data table.`}
    >
      {/* Live Region for Screen Reader Announcements */}
      <div aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }}>
        {announcement}
      </div>

      {/* Header & Controls Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary, #0f172a)' }}>{title}</div>
          {subtitle && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary, #64748b)', marginTop: 2 }}>
              {subtitle} · Showing <strong>{filteredData.length}</strong> of {data.length} records
            </div>
          )}
        </div>

        {showControls && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Search Input */}
            {showSearch && (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Filter record/batch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '4px 10px',
                    fontSize: 12,
                    border: '1px solid var(--border-strong, #cbd5e1)',
                    borderRadius: 'var(--radius-sm, 4px)',
                    background: 'var(--surface-card, #ffffff)',
                    color: 'var(--text-primary, #0f172a)',
                    outline: 'none',
                    width: 150
                  }}
                  aria-label="Search records by ID, label, or cluster"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: 6,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-secondary, #94a3b8)',
                      fontSize: 11
                    }}
                    aria-label="Clear search"
                  >✕</button>
                )}
              </div>
            )}

            {/* Normalization Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary, #334155)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isNormalized}
                onChange={(e) => setIsNormalized(e.target.checked)}
              />
              Normalize 0–100%
            </label>

            {/* Spline Smooth Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary, #334155)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isSmooth}
                onChange={(e) => setIsSmooth(e.target.checked)}
              />
              Smooth Spline
            </label>

            {/* Accessible Brush Filters Modal Trigger */}
            {showBrushControls && (
              <button
                type="button"
                onClick={() => setIsFilterPanelOpen(prev => !prev)}
                style={{
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  border: '1px solid var(--border-strong, #cbd5e1)',
                  borderRadius: 'var(--radius-sm, 4px)',
                  background: activeBrushCount > 0 ? '#eff6ff' : 'var(--surface-card, #ffffff)',
                  color: activeBrushCount > 0 ? 'var(--action-solid, #0284c7)' : 'var(--text-primary, #334155)',
                  cursor: 'pointer'
                }}
              >
                🎯 Brush Filters {activeBrushCount > 0 ? `(${activeBrushCount})` : ''}
              </button>
            )}

            {/* Table Modal Toggle (Alt+F11) */}
            <button
              type="button"
              onClick={() => setShowTableModal(prev => !prev)}
              style={{
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 600,
                border: '1px solid var(--border-strong, #cbd5e1)',
                borderRadius: 'var(--radius-sm, 4px)',
                background: showTableModal ? 'var(--action-solid, #0284c7)' : 'var(--surface-card, #ffffff)',
                color: showTableModal ? '#ffffff' : 'var(--text-primary, #334155)',
                cursor: 'pointer'
              }}
              title="Toggle Accessible Data Table View (Alt+F11)"
              aria-label="Toggle Accessible Data Table View"
            >
              Table (Alt+F11)
            </button>
          </div>
        )}
      </div>

      {/* Non-Drag Accessible Brush Controls Panel */}
      {isFilterPanelOpen && (
        <div style={{
          background: 'var(--surface-sunken, #f8fafc)',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          borderRadius: 'var(--radius-md, 6px)',
          padding: '12px 16px',
          marginBottom: 16,
          fontSize: 12
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
              Accessible 1D Axis Range Filters (Keyboard Alternative to Drag Brushes)
            </span>
            {activeBrushCount > 0 && (
              <button
                type="button"
                onClick={clearAllBrushes}
                style={{ border: 'none', background: 'none', color: 'var(--status-critical-solid, #dc2626)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {activeDimensions.map(dim => {
              const key = typeof dim === 'string' ? dim : dim.key;
              const d = dimensionDomains[key];
              const brush = activeBrushes[key] || {};
              if (!d) return null;

              return (
                <div key={key} style={{ background: 'var(--surface-card, #ffffff)', padding: '8px 10px', borderRadius: 4, border: '1px solid var(--border-strong, #cbd5e1)' }}>
                  <div style={{ fontWeight: 600, fontSize: 11, color: 'var(--text-secondary, #334155)', marginBottom: 4 }}>
                    {d.label} {d.unit ? `(${d.unit})` : ''}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input
                      type="number"
                      placeholder={`Min (${d.rawMin.toFixed(0)})`}
                      value={brush.min ?? ''}
                      onChange={(e) => updateBrush(key, 'min', e.target.value)}
                      style={{ width: '48%', padding: '3px 6px', fontSize: 11, border: '1px solid var(--border-strong, #cbd5e1)', borderRadius: 3 }}
                    />
                    <span style={{ color: 'var(--text-secondary, #94a3b8)' }}>–</span>
                    <input
                      type="number"
                      placeholder={`Max (${d.rawMax.toFixed(0)})`}
                      value={brush.max ?? ''}
                      onChange={(e) => updateBrush(key, 'max', e.target.value)}
                      style={{ width: '48%', padding: '3px 6px', fontSize: 11, border: '1px solid var(--border-strong, #cbd5e1)', borderRadius: 3 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SVG Parallel Coordinates Canvas */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          width="100%"
          height={plotHeight}
          viewBox={`0 0 ${plotWidth} ${plotHeight}`}
          style={{ display: 'block', margin: '0 auto' }}
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* 1. Inactive / Filtered-out Polylines (Muted Background) */}
            {data.map((record, idx) => {
              const isPassing = filteredData.includes(record);
              if (isPassing) return null;
              const p = buildPolylinePath(record);
              return (
                <path
                  key={record[idKey] || idx}
                  d={p}
                  fill="none"
                  stroke="var(--border-subtle, #e2e8f0)"
                  strokeWidth="1"
                  opacity="0.35"
                />
              );
            })}

            {/* 2. Active / Filtered Polylines */}
            {filteredData.map((record, idx) => {
              const itemId = record[idKey] || `rec-${idx}`;
              const isSelected = selectedRecordId === itemId;
              const isHovered = hoveredRecord?.id === itemId || (hoveredRecord && hoveredRecord[idKey] === itemId);
              const color = getRecordColor(record);
              const dash = getRecordDash(record);
              const p = buildPolylinePath(record);

              return (
                <path
                  key={itemId}
                  d={p}
                  fill="none"
                  stroke={isSelected ? 'var(--action-solid, #0284c7)' : color}
                  strokeWidth={isSelected ? 3.5 : isHovered ? 3 : 1.5}
                  strokeDasharray={dash}
                  opacity={hoveredRecord && !isHovered && !isSelected ? 0.2 : isSelected || isHovered ? 1 : 0.7}
                  style={{ cursor: 'pointer', transition: 'stroke-width 0.15s ease, opacity 0.15s ease' }}
                  onMouseEnter={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    setHoveredRecord({ ...record, id: itemId });
                    setTooltipPos({
                      clientX: e.clientX - (rect?.left || 0),
                      clientY: e.clientY - (rect?.top || 0)
                    });
                  }}
                  onMouseLeave={() => setHoveredRecord(null)}
                  onClick={(e) => {
                    setSelectedRecordId(itemId);
                    if (onRecordClick) onRecordClick(record, e);
                  }}
                />
              );
            })}

            {/* 3. Parallel Vertical Axes */}
            {activeDimensions.map((dim, i) => {
              const key = typeof dim === 'string' ? dim : dim.key;
              const d = dimensionDomains[key];
              const x = axisXCoords[i];
              if (!d) return null;

              const ticks = [0, 0.25, 0.5, 0.75, 1].map(pct => {
                const y = innerHeight - pct * innerHeight;
                let valLabel = '';
                if (isNormalized) {
                  valLabel = `${(pct * 100).toFixed(0)}%`;
                } else {
                  const rawVal = d.rawMin + pct * (d.rawMax - d.rawMin);
                  valLabel = rawVal.toLocaleString('en-IN', { maximumFractionDigits: 1 });
                }
                return { y, label: valLabel };
              });

              return (
                <g key={key} transform={`translate(${x}, 0)`}>
                  <line
                    y1="0"
                    y2={innerHeight}
                    stroke="var(--border-strong, #64748b)"
                    strokeWidth="1.5"
                  />

                  {/* Axis Reorder Buttons */}
                  <g transform="translate(0, -22)">
                    {i > 0 && (
                      <text
                        x="-10"
                        y="0"
                        fontSize="10"
                        fill="var(--action-solid, #0284c7)"
                        textAnchor="end"
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => moveAxis(i, -1)}
                        aria-label={`Move axis ${d.label} left`}
                      >◀</text>
                    )}
                    {i < activeDimensions.length - 1 && (
                      <text
                        x="10"
                        y="0"
                        fontSize="10"
                        fill="var(--action-solid, #0284c7)"
                        textAnchor="start"
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => moveAxis(i, 1)}
                        aria-label={`Move axis ${d.label} right`}
                      >▶</text>
                    )}
                  </g>

                  {/* Axis Title with Legibility Halo */}
                  <text
                    x="0"
                    y="-8"
                    fontSize="11"
                    fontWeight="700"
                    fill="var(--text-primary, #0f172a)"
                    textAnchor="middle"
                    style={{
                      paintOrder: 'stroke fill',
                      stroke: 'var(--surface-card, #ffffff)',
                      strokeWidth: 3,
                      strokeLinejoin: 'round'
                    }}
                  >
                    {d.label}
                  </text>
                  {d.unit && (
                    <text
                      x="0"
                      y={innerHeight + 16}
                      fontSize="10"
                      fill="var(--text-secondary, #64748b)"
                      textAnchor="middle"
                    >
                      {d.unit}
                    </text>
                  )}

                  {/* Axis Ticks & Numerical Labels */}
                  {ticks.map((t, tIdx) => (
                    <g key={tIdx} transform={`translate(0, ${t.y})`}>
                      <line x1="-4" x2="4" stroke="var(--border-strong, #94a3b8)" strokeWidth="1" />
                      <text
                        x="-7"
                        y="3"
                        fontSize="9"
                        fill="var(--text-secondary, #64748b)"
                        textAnchor="end"
                        style={{
                          paintOrder: 'stroke fill',
                          stroke: 'var(--surface-card, #ffffff)',
                          strokeWidth: 2
                        }}
                      >
                        {t.label}
                      </text>
                    </g>
                  ))}

                  {/* Multi-Axis Intersection Chips on Hover */}
                  {hoveredRecord && hoveredRecord[key] != null && (
                    <g transform={`translate(0, ${valToY(hoveredRecord[key], key)})`}>
                      <circle r="4.5" fill="var(--action-solid, #0284c7)" stroke="#ffffff" strokeWidth="2" />
                      <rect x="8" y="-9" width="48" height="17" rx="3" fill="var(--surface-floating, #0f172a)" opacity="0.9" />
                      <text x="12" y="3" fontSize="9" fontWeight="600" fill="#ffffff">
                        {Number(hoveredRecord[key]).toLocaleString('en-IN', { maximumFractionDigits: 1 })}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Floating 2D Quad-Flip Non-Occluding Tooltip */}
        {hoveredRecord && tooltipPos && (
          renderTooltip ? renderTooltip(hoveredRecord) : (
            <div style={{
              position: 'absolute',
              left: tooltipPos.clientX > width / 2
                ? Math.max(12, tooltipPos.clientX - 260)
                : Math.min(tooltipPos.clientX + 16, width - 260),
              top: tooltipPos.clientY > height / 2
                ? Math.max(12, tooltipPos.clientY - 160)
                : Math.min(tooltipPos.clientY + 14, height - 160),
              background: 'var(--surface-floating, #0f172a)',
              color: '#ffffff',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm, 6px)',
              fontSize: 12,
              boxShadow: 'var(--shadow-xl, 0 10px 25px rgba(0,0,0,0.3))',
              pointerEvents: 'none',
              zIndex: 100,
              maxWidth: 250,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                {hoveredRecord[labelKey] || hoveredRecord[idKey]}
              </div>

              {hoveredRecord[colorKey] && (
                <div style={{ color: '#38bdf8', fontSize: 11, marginBottom: 6 }}>
                  Classification: <strong>{hoveredRecord[colorKey]}</strong>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '3px 12px', fontSize: 11 }}>
                {activeDimensions.map(dim => {
                  const key = typeof dim === 'string' ? dim : dim.key;
                  const d = dimensionDomains[key];
                  if (!d) return null;
                  return (
                    <React.Fragment key={key}>
                      <span style={{ color: '#cbd5e1' }}>{d.label}:</span>
                      <span style={{ fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {Number(hoveredRecord[key]).toLocaleString('en-IN', { maximumFractionDigits: 2 })} {d.unit}
                      </span>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>

      {/* Accessible Data Table Modal (Alt+F11) */}
      {showTableModal && (
        <div ref={tableDialogRef} tabIndex={-1}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(2px)',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Accessible Multivariate Telemetry Table"
        >
          <div
            style={{
              background: 'var(--surface-card, #ffffff)',
              borderRadius: 'var(--radius-md, 8px)',
              border: '1px solid var(--border-subtle, #cbd5e1)',
              boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.2))',
              width: '100%',
              maxWidth: 780,
              maxHeight: '90%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle, #e2e8f0)' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                  Accessible Multivariate Telemetry Matrix
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary, #64748b)' }}>
                  Showing {filteredData.length} records across {activeDimensions.length} parallel dimensions
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: 18,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--text-secondary, #64748b)'
                }}
                aria-label="Close table modal"
              >
                &times;
              </button>
            </div>

            <div style={{ overflowY: 'auto', padding: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-sunken, #f8fafc)', borderBottom: '2px solid var(--border-subtle, #e2e8f0)' }}>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>Record ID</th>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>Cluster</th>
                    {activeDimensions.map(dim => {
                      const key = typeof dim === 'string' ? dim : dim.key;
                      const d = dimensionDomains[key];
                      return (
                        <th key={key} style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)', fontWeight: 600, textAlign: 'right' }}>
                          {d?.label || key}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((rec, idx) => (
                    <tr key={rec[idKey] || idx} style={{ borderBottom: '1px solid var(--border-subtle, #f1f5f9)' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                        {rec[labelKey] || rec[idKey] || `Record ${idx + 1}`}
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        <span style={{
                          fontSize: 10,
                          fontWeight: 600,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: '#eff6ff',
                          color: '#1e40af'
                        }}>
                          {rec[colorKey] || 'Nominal'}
                        </span>
                      </td>
                      {activeDimensions.map(dim => {
                        const key = typeof dim === 'string' ? dim : dim.key;
                        const d = dimensionDomains[key];
                        return (
                          <td key={key} style={{ padding: '8px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                            {rec[key] != null ? Number(rec[key]).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '—'} {d?.unit || ''}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '10px 16px', background: 'var(--surface-sunken, #f8fafc)', borderTop: '1px solid var(--border-subtle, #e2e8f0)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                style={{
                  padding: '5px 12px',
                  background: 'var(--action-solid, #0284c7)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm, 4px)',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ParallelCoordinates;
