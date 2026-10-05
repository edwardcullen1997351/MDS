import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';

/**
 * ParallelCoordinates - Meridian Design System
 *
 * Purpose: Compare multivariate profiles across many dimensions and identify clusters, trade-offs and anomalous records.
 * Supported Variants:
 *  - 'standard': Raw dimensional values on individual linear axes.
 *  - 'normalized': 0% - 100% normalized scales across all axes for uniform slope comparison.
 *  - 'spline': Smooth cubic bezier curves connecting axes.
 *  - 'brushed': Interactive 1D range brushing to filter multidimensional records.
 */

const CLUSTER_COLORS = [
  '#0284c7', // Sky blue (Cluster A / Class 1)
  '#16a34a', // Emerald green (Cluster B / Class 2)
  '#d97706', // Amber warning (Cluster C / Outliers)
  '#7c3aed', // Purple (Cluster D)
  '#dc2626', // Ruby critical
  '#0d9488'  // Teal
];

export function ParallelCoordinates({
  data = [],
  dimensions = [],
  variant = 'standard', // 'standard' | 'normalized' | 'spline' | 'brushed'
  width = 860,
  height = 420,
  title = 'Multivariate Process & Quality Telemetry',
  subtitle = 'Suryodaya Autocomp Ltd · Chakan Plant (PL-04)',
  colorKey = 'cluster', // Key used to color-code polylines
  idKey = 'id',
  labelKey = 'label',
  smooth = false,
  normalized = false,
  showBrushControls = true,
  showControls = true,
  showSearch = true,
  className = '',
  onRecordClick = null
}) {
  const [activeDimensions, setActiveDimensions] = useState(dimensions);
  const [isNormalized, setIsNormalized] = useState(normalized || variant === 'normalized');
  const [isSmooth, setIsSmooth] = useState(smooth || variant === 'spline');
  const [activeBrushes, setActiveBrushes] = useState({});
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [hoveredRecord, setHoveredRecord] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Sync dimensions when prop changes
  useEffect(() => {
    setActiveDimensions(dimensions);
  }, [dimensions]);

  // Keyboard shortcut for Accessible Modal (Alt + F11)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'F11' || e.keyCode === 122)) {
        e.preventDefault();
        setIsTableModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
  const margin = useMemo(() => ({
    top: 36,
    right: 48,
    bottom: 40,
    left: 48
  }), []);

  const innerWidth = Math.max(100, width - margin.left - margin.right);
  const innerHeight = Math.max(100, height - margin.top - margin.bottom);

  // Compute Domain Bounds for each Dimension
  const dimensionDomains = useMemo(() => {
    const domains = {};
    activeDimensions.forEach(dim => {
      const key = typeof dim === 'string' ? dim : dim.key;
      let min = dim.min != null ? Number(dim.min) : Infinity;
      let max = dim.max != null ? Number(dim.max) : -Infinity;

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
      const paddedMin = dim.min != null ? dim.min : min - pad;
      const paddedMax = dim.max != null ? dim.max : max + pad;

      domains[key] = {
        key,
        min: paddedMin,
        max: paddedMax,
        rawMin: min,
        rawMax: max,
        span: paddedMax - paddedMin,
        unit: dim.unit || '',
        label: dim.label || key,
        inverted: !!dim.inverted
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
  const valToY = useCallback((val, dimKey) => {
    const domain = dimensionDomains[dimKey];
    if (!domain || val == null || isNaN(Number(val))) return innerHeight / 2;

    if (isNormalized) {
      // 0 to 1 normalized
      let norm = (Number(val) - domain.rawMin) / (domain.rawMax - domain.rawMin || 1);
      norm = Math.max(0, Math.min(1, norm));
      if (domain.inverted) norm = 1 - norm;
      return innerHeight - norm * innerHeight;
    }

    // Raw scaling
    let norm = (Number(val) - domain.min) / domain.span;
    norm = Math.max(0, Math.min(1, norm));
    if (domain.inverted) norm = 1 - norm;
    return innerHeight - norm * innerHeight;
  }, [dimensionDomains, innerHeight, isNormalized]);

  // Generate Polyline SVG path
  const buildPolylinePath = useCallback((record) => {
    const points = [];
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

    // Cubic bezier spline
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
  const getRecordColor = useCallback((record) => {
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

  // Axis Reordering Handlers (Move Left / Move Right)
  const moveAxis = (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= activeDimensions.length) return;
    const next = [...activeDimensions];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    setActiveDimensions(next);
  };

  // Brush Filter Update
  const updateBrush = (key, field, val) => {
    setActiveBrushes(prev => {
      const current = prev[key] || { min: dimensionDomains[key].rawMin, max: dimensionDomains[key].rawMax };
      const num = val === '' ? null : Number(val);
      const nextBrush = { ...current, [field]: num };
      return { ...prev, [key]: nextBrush };
    });
  };

  const clearAllBrushes = () => {
    setActiveBrushes({});
    setSearchQuery('');
  };

  const activeBrushCount = Object.keys(activeBrushes).filter(k => activeBrushes[k].min != null || activeBrushes[k].max != null).length;

  return (
    <div
      className={`parallel-coordinates-container ${className}`}
      style={{
        position: 'relative',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '16px 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
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
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{title}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
            {subtitle} · Showing <strong>{filteredData.length}</strong> of {data.length} records
          </div>
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
                    border: '1px solid #cbd5e1',
                    borderRadius: 4,
                    outline: 'none',
                    width: 150
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: 6,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#94a3b8',
                      fontSize: 11
                    }}
                  >✕</button>
                )}
              </div>
            )}

            {/* Normalization Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isNormalized}
                onChange={(e) => setIsNormalized(e.target.checked)}
              />
              Normalize 0–100%
            </label>

            {/* Spline Smooth Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isSmooth}
                onChange={(e) => setIsSmooth(e.target.checked)}
              />
              Smooth Spline
            </label>

            {/* Accessible Brush Filters Modal Trigger */}
            <button
              onClick={() => setIsFilterPanelOpen(prev => !prev)}
              style={{
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 600,
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                background: activeBrushCount > 0 ? '#eff6ff' : '#ffffff',
                color: activeBrushCount > 0 ? '#0284c7' : '#334155',
                cursor: 'pointer'
              }}
            >
              🎯 Brush Filters {activeBrushCount > 0 ? `(${activeBrushCount})` : ''}
            </button>

            {/* Accessible Table Modal Trigger */}
            <button
              onClick={() => setIsTableModalOpen(true)}
              title="Accessible Table Modal (Alt + F11)"
              style={{
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 600,
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                background: '#f8fafc',
                color: '#0284c7',
                cursor: 'pointer'
              }}
            >
              📊 Table View
            </button>
          </div>
        )}
      </div>

      {/* Non-Drag Accessible Brush Controls Panel */}
      {isFilterPanelOpen && (
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 6,
          padding: '12px 16px',
          marginBottom: 16,
          fontSize: 12
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>Accessible 1D Axis Range Filters (Keyboard Alternative to Drag Brushes)</span>
            {activeBrushCount > 0 && (
              <button
                onClick={clearAllBrushes}
                style={{ border: 'none', background: 'none', color: '#dc2626', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}
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

              return (
                <div key={key} style={{ background: '#ffffff', padding: '8px 10px', borderRadius: 4, border: '1px solid #cbd5e1' }}>
                  <div style={{ fontWeight: 600, fontSize: 11, color: '#334155', marginBottom: 4 }}>
                    {d.label} {d.unit ? `(${d.unit})` : ''}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <input
                      type="number"
                      placeholder={`Min (${d.rawMin.toFixed(0)})`}
                      value={brush.min ?? ''}
                      onChange={(e) => updateBrush(key, 'min', e.target.value)}
                      style={{ width: '48%', padding: '3px 6px', fontSize: 11, border: '1px solid #cbd5e1', borderRadius: 3 }}
                    />
                    <span style={{ color: '#94a3b8' }}>–</span>
                    <input
                      type="number"
                      placeholder={`Max (${d.rawMax.toFixed(0)})`}
                      value={brush.max ?? ''}
                      onChange={(e) => updateBrush(key, 'max', e.target.value)}
                      style={{ width: '48%', padding: '3px 6px', fontSize: 11, border: '1px solid #cbd5e1', borderRadius: 3 }}
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
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ display: 'block', margin: '0 auto' }}
        >
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* 1. Inactive / Filtered-out Polylines (Muted Background) */}
            {data.map((record, idx) => {
              const isPassing = filteredData.includes(record);
              if (isPassing) return null; // rendered in foreground
              const p = buildPolylinePath(record);
              return (
                <path
                  key={record[idKey] || idx}
                  d={p}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  opacity="0.4"
                />
              );
            })}

            {/* 2. Active / Filtered Polylines */}
            {filteredData.map((record, idx) => {
              const itemId = record[idKey] || `rec-${idx}`;
              const isSelected = selectedRecordId === itemId;
              const isHovered = hoveredRecord?.id === itemId;
              const color = getRecordColor(record);
              const p = buildPolylinePath(record);

              return (
                <path
                  key={itemId}
                  d={p}
                  fill="none"
                  stroke={isSelected ? '#0284c7' : color}
                  strokeWidth={isSelected ? 3.5 : isHovered ? 3 : 1.5}
                  opacity={hoveredRecord && !isHovered && !isSelected ? 0.2 : isSelected || isHovered ? 1 : 0.7}
                  style={{ cursor: 'pointer', transition: 'stroke-width 0.15s ease, opacity 0.15s ease' }}
                  onMouseEnter={(e) => {
                    setHoveredRecord({ ...record, id: itemId });
                    setTooltipPos({ x: e.clientX, y: e.clientY });
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

              // Generate 5 ticks per axis
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
                  {/* Axis Background Line */}
                  <line
                    y1="0"
                    y2={innerHeight}
                    stroke="#475569"
                    strokeWidth="1.5"
                  />

                  {/* Axis Reorder Buttons */}
                  <g transform="translate(0, -22)">
                    {i > 0 && (
                      <text
                        x="-10"
                        y="0"
                        fontSize="10"
                        fill="#0284c7"
                        textAnchor="end"
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => moveAxis(i, -1)}
                        title="Move Axis Left"
                      >◀</text>
                    )}
                    {i < activeDimensions.length - 1 && (
                      <text
                        x="10"
                        y="0"
                        fontSize="10"
                        fill="#0284c7"
                        textAnchor="start"
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        onClick={() => moveAxis(i, 1)}
                        title="Move Axis Right"
                      >▶</text>
                    )}
                  </g>

                  {/* Dimension Title Label */}
                  <text
                    x="0"
                    y="-8"
                    fontSize="11"
                    fontWeight="700"
                    fill="#0f172a"
                    textAnchor="middle"
                  >
                    {d.label}
                  </text>
                  {d.unit && (
                    <text
                      x="0"
                      y={innerHeight + 16}
                      fontSize="10"
                      fill="#64748b"
                      textAnchor="middle"
                    >
                      {d.unit}
                    </text>
                  )}

                  {/* Axis Ticks */}
                  {ticks.map((t, tIdx) => (
                    <g key={tIdx} transform={`translate(0, ${t.y})`}>
                      <line x1="-4" x2="4" stroke="#94a3b8" strokeWidth="1" />
                      <text
                        x="-7"
                        y="3"
                        fontSize="9"
                        fill="#64748b"
                        textAnchor="end"
                      >
                        {t.label}
                      </text>
                    </g>
                  ))}

                  {/* Active Hover Intersection Crosshair Indicator */}
                  {hoveredRecord && hoveredRecord[key] != null && (
                    <g transform={`translate(0, ${valToY(hoveredRecord[key], key)})`}>
                      <circle r="4.5" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                      <rect x="8" y="-9" width="45" height="16" rx="3" fill="#0f172a" opacity="0.85" />
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

        {/* Floating Tooltip */}
        {hoveredRecord && (
          <div style={{
            position: 'fixed',
            left: tooltipPos.x + 14,
            top: tooltipPos.y + 14,
            background: '#0f172a',
            color: '#ffffff',
            padding: '10px 14px',
            borderRadius: 6,
            fontSize: 12,
            boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
            pointerEvents: 'none',
            zIndex: 100,
            maxWidth: 280
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
                return (
                  <React.Fragment key={key}>
                    <span style={{ color: '#cbd5e1' }}>{d.label}:</span>
                    <span style={{ fontWeight: 600, textAlign: 'right' }}>
                      {Number(hoveredRecord[key]).toLocaleString('en-IN', { maximumFractionDigits: 2 })} {d.unit}
                    </span>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Accessible Multivariate Table Modal (Alt + F11) */}
      {isTableModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 8,
            width: '92%',
            maxWidth: 880,
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h3 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>Accessible Multivariate Observations Table</h3>
              <button
                onClick={() => setIsTableModalOpen(false)}
                style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#64748b' }}
              >✕</button>
            </div>

            <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px' }}>Record / Batch</th>
                    <th style={{ padding: '8px 10px' }}>Cluster / Grade</th>
                    {activeDimensions.map(dim => {
                      const key = typeof dim === 'string' ? dim : dim.key;
                      const d = dimensionDomains[key];
                      return (
                        <th key={key} style={{ padding: '8px 10px', textAlign: 'right' }}>
                          {d.label} {d.unit ? `(${d.unit})` : ''}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600 }}>{r[labelKey] || r[idKey] || `Record ${i + 1}`}</td>
                      <td style={{ padding: '8px 10px', color: '#0284c7', fontWeight: 600 }}>{r[colorKey] || '—'}</td>
                      {activeDimensions.map(dim => {
                        const key = typeof dim === 'string' ? dim : dim.key;
                        const v = Number(r[key]);
                        return (
                          <td key={key} style={{ padding: '8px 10px', textAlign: 'right' }}>
                            {!isNaN(v) ? v.toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '—'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParallelCoordinates;
