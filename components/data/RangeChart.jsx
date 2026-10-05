import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';

/**
 * RangeChart - Meridian Design System
 *
 * Purpose: Compare bounded intervals, uncertainty, before/after endpoints, variation or deviation.
 * Supported Variants:
 *  - 'interval-bar': Floating range bars bounded between lower and upper limits.
 *  - 'dumbbell': Two distinct endpoint dots connected by a line showing before/after delta.
 *  - 'error-bar': Central estimate point with bounded uncertainty whiskers.
 *  - 'range-area': Continuous sequence/time series confidence band envelope.
 */

// Semantic Status Colors
const STATUS_COLORS = {
  nominal: '#16a34a',
  warning: '#d97706',
  critical: '#dc2626',
  info: '#2563eb',
  neutral: '#64748b'
};

const DUMBBELL_ENDPOINT_COLORS = {
  before: '#64748b', // Start / Baseline
  afterImproved: '#16a34a', // Target reached / Faster / Improved
  afterRegressed: '#dc2626' // Regressed / Slower
};

export function RangeChart({
  data = [],
  variant = 'interval-bar', // 'interval-bar' | 'dumbbell' | 'error-bar' | 'range-area'
  orientation = 'horizontal', // 'horizontal' | 'vertical'
  width = 760,
  height = 420,
  title = 'Bounded Interval Range Chart',
  subtitle = 'Suryodaya Autocomp Ltd · Chakan Plant (PL-04)',
  lowerKey = 'lower',
  upperKey = 'upper',
  centerKey = 'center',
  targetKey = 'target',
  categoryKey = 'label',
  unit = '',
  targetLine = null, // e.g. 500 or { value: 500, label: 'Nominal Target' }
  showCenterEstimate = true,
  showDirectLabels = true,
  showControls = true,
  showSearch = true,
  interactive = true,
  className = '',
  onItemClick = null
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'spread-desc' | 'spread-asc' | 'lower-asc' | 'upper-desc' | 'label-asc'
  const [searchQuery, setSearchQuery] = useState('');
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const svgRef = useRef(null);

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

  // Filter Data by Search Query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase().trim();
    return data.filter(d => {
      const label = String(d[categoryKey] || d.id || '').toLowerCase();
      const semantics = String(d.intervalSemantics || d.category || '').toLowerCase();
      return label.includes(q) || semantics.includes(q);
    });
  }, [data, searchQuery, categoryKey]);

  // Sort Data
  const sortedData = useMemo(() => {
    if (variant === 'range-area' || sortBy === 'default') return filteredData;
    const list = [...filteredData];
    return list.sort((a, b) => {
      const lowA = Number(a[lowerKey] ?? 0);
      const lowB = Number(b[lowerKey] ?? 0);
      const upA = Number(a[upperKey] ?? 0);
      const upB = Number(b[upperKey] ?? 0);
      const spreadA = Math.abs(upA - lowA);
      const spreadB = Math.abs(upB - lowB);

      if (sortBy === 'spread-desc') return spreadB - spreadA;
      if (sortBy === 'spread-asc') return spreadA - spreadB;
      if (sortBy === 'lower-asc') return lowA - lowB;
      if (sortBy === 'upper-desc') return upB - upA;
      if (sortBy === 'label-asc') return String(a[categoryKey] || '').localeCompare(String(b[categoryKey] || ''));
      return 0;
    });
  }, [filteredData, sortBy, lowerKey, upperKey, categoryKey, variant]);

  // Margin Layout calculations
  const margin = useMemo(() => {
    if (orientation === 'horizontal') {
      return { top: 28, right: 48, bottom: 44, left: 160 };
    }
    return { top: 28, right: 32, bottom: 64, left: 60 };
  }, [orientation]);

  const innerWidth = Math.max(100, width - margin.left - margin.right);
  const innerHeight = Math.max(100, height - margin.top - margin.bottom);

  // Quantitative Domain Bounds
  const { domainMin, domainMax, domainSpan } = useMemo(() => {
    if (!sortedData || sortedData.length === 0) {
      return { domainMin: 0, domainMax: 100, domainSpan: 100 };
    }

    let min = Infinity;
    let max = -Infinity;

    sortedData.forEach(d => {
      const l = d[lowerKey] != null ? Number(d[lowerKey]) : null;
      const u = d[upperKey] != null ? Number(d[upperKey]) : null;
      const c = d[centerKey] != null ? Number(d[centerKey]) : null;
      const t = d[targetKey] != null ? Number(d[targetKey]) : null;

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

    if (targetLine != null) {
      const tVal = typeof targetLine === 'number' ? targetLine : targetLine.value;
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
  }, [sortedData, lowerKey, upperKey, centerKey, targetKey, targetLine]);

  // Coordinate Scalers
  const valToX = useCallback((val) => {
    if (val == null || isNaN(val)) return 0;
    return ((val - domainMin) / domainSpan) * innerWidth;
  }, [domainMin, domainSpan, innerWidth]);

  const valToY = useCallback((val) => {
    if (val == null || isNaN(val)) return innerHeight;
    return innerHeight - ((val - domainMin) / domainSpan) * innerHeight;
  }, [domainMin, domainSpan, innerHeight]);

  // Axis Ticks
  const quantTicks = useMemo(() => {
    const count = 5;
    const ticks = [];
    for (let i = 0; i <= count; i++) {
      const val = domainMin + (domainSpan * (i / count));
      ticks.push(val);
    }
    return ticks;
  }, [domainMin, domainSpan]);

  // Range Area Path calculation
  const rangeAreaPaths = useMemo(() => {
    if (variant !== 'range-area' || sortedData.length === 0) return null;

    const n = sortedData.length;
    const stepX = n > 1 ? innerWidth / (n - 1) : innerWidth / 2;

    const upperCoords = [];
    const lowerCoords = [];
    const centerCoords = [];

    sortedData.forEach((d, i) => {
      const x = i * stepX;
      const up = Number(d[upperKey] ?? 0);
      const low = Number(d[lowerKey] ?? 0);
      const cent = d[centerKey] != null ? Number(d[centerKey]) : (low + up) / 2;

      const yUp = valToY(up);
      const yLow = valToY(low);
      const yCent = valToY(cent);

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
  }, [variant, sortedData, upperKey, lowerKey, centerKey, innerWidth, valToY]);

  // Category band height / spacing
  const rowCount = Math.max(1, sortedData.length);
  const rowHeight = innerHeight / rowCount;
  const barThickness = Math.max(6, Math.min(24, rowHeight * 0.45));

  return (
    <div
      className={`range-chart-container ${className}`}
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
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{subtitle}</div>
        </div>

        {showControls && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Search Input */}
            {showSearch && (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Filter category..."
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

            {/* Sort Select (for discrete items) */}
            {variant !== 'range-area' && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '4px 8px',
                  fontSize: 12,
                  border: '1px solid #cbd5e1',
                  borderRadius: 4,
                  background: '#ffffff',
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                <option value="default">Default Order</option>
                <option value="spread-desc">Spread (High → Low)</option>
                <option value="spread-asc">Spread (Low → High)</option>
                <option value="lower-asc">Lower Bound (Ascending)</option>
                <option value="upper-desc">Upper Bound (Descending)</option>
                <option value="label-asc">Category Name (A → Z)</option>
              </select>
            )}

            {/* Accessible Table Button */}
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

      {/* SVG Canvas Area */}
      <div style={{ position: 'relative', width: '100%', overflowX: 'auto' }}>
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          style={{ display: 'block', margin: '0 auto' }}
        >
          <defs>
            {/* WCAG 1.4.1 Accessible Diagonal Hatch Pattern */}
            <pattern id="rc-hatch-warning" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#d97706" strokeWidth="2" opacity="0.35" />
            </pattern>
            <pattern id="rc-hatch-critical" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
              <line x1="0" y1="0" x2="0" y2="8" stroke="#dc2626" strokeWidth="2" opacity="0.4" />
            </pattern>
            <filter id="rc-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
            </filter>
          </defs>

          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {/* Quantitative Grid Lines & Labels */}
            {orientation === 'horizontal' ? (
              <g className="grid-quantitative-x">
                {quantTicks.map((val, idx) => {
                  const x = valToX(val);
                  return (
                    <g key={idx} transform={`translate(${x}, 0)`}>
                      <line y1="0" y2={innerHeight} stroke="#f1f5f9" strokeWidth="1" />
                      <line y1={innerHeight} y2={innerHeight + 5} stroke="#cbd5e1" strokeWidth="1" />
                      <text
                        y={innerHeight + 18}
                        fontSize="11"
                        fill="#64748b"
                        textAnchor="middle"
                      >
                        {val.toLocaleString('en-IN', { maximumFractionDigits: 1 })} {unit}
                      </text>
                    </g>
                  );
                })}
              </g>
            ) : (
              <g className="grid-quantitative-y">
                {quantTicks.map((val, idx) => {
                  const y = valToY(val);
                  return (
                    <g key={idx} transform={`translate(0, ${y})`}>
                      <line x1="0" x2={innerWidth} stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="-5" x2="0" stroke="#cbd5e1" strokeWidth="1" />
                      <text
                        x="-10"
                        y="4"
                        fontSize="11"
                        fill="#64748b"
                        textAnchor="end"
                      >
                        {val.toLocaleString('en-IN', { maximumFractionDigits: 1 })} {unit}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Target Baseline Reference Line */}
            {targetLine != null && (() => {
              const tVal = typeof targetLine === 'number' ? targetLine : targetLine.value;
              const tLabel = typeof targetLine === 'number' ? `Target: ${tVal} ${unit}` : targetLine.label || `Target: ${tVal} ${unit}`;
              if (tVal == null || isNaN(tVal)) return null;

              if (orientation === 'horizontal') {
                const tx = valToX(tVal);
                return (
                  <g className="target-baseline" transform={`translate(${tx}, 0)`}>
                    <line y1="-8" y2={innerHeight} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,3" />
                    <text y="-12" fontSize="10" fontWeight="600" fill="#dc2626" textAnchor="middle">
                      {tLabel}
                    </text>
                  </g>
                );
              } else {
                const ty = valToY(tVal);
                return (
                  <g className="target-baseline" transform={`translate(0, ${ty})`}>
                    <line x1="0" x2={innerWidth + 8} stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,3" />
                    <text x={innerWidth + 12} y="3" fontSize="10" fontWeight="600" fill="#dc2626" textAnchor="start">
                      {tLabel}
                    </text>
                  </g>
                );
              }
            })()}

            {/* VARIANT: RANGE AREA (Continuous Band) */}
            {variant === 'range-area' && rangeAreaPaths && (
              <g className="range-area-layer">
                {/* Shaded Area Band */}
                <path
                  d={rangeAreaPaths.bandPath}
                  fill="#e0f2fe"
                  opacity="0.8"
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
                {/* Central Estimate Line */}
                <path
                  d={rangeAreaPaths.centerLinePath}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                />
                {/* Data Points on Central Line */}
                {rangeAreaPaths.centerCoords.map((pt, i) => {
                  const item = sortedData[i];
                  const isHovered = hoveredItem?.index === i;
                  return (
                    <circle
                      key={i}
                      cx={pt[0]}
                      cy={pt[1]}
                      r={isHovered ? 6 : 4}
                      fill="#0284c7"
                      stroke="#ffffff"
                      strokeWidth="2"
                      style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                      onMouseEnter={(e) => {
                        setHoveredItem({ ...item, index: i });
                        setTooltipPos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => setHoveredItem(null)}
                    />
                  );
                })}
              </g>
            )}

            {/* VARIANT: INTERVAL BAR, DUMBBELL, ERROR BAR (Discrete Categories) */}
            {variant !== 'range-area' && orientation === 'horizontal' && (
              <g className="discrete-horizontal-layer">
                {sortedData.map((d, idx) => {
                  const itemId = d.id || `item-${idx}`;
                  const isSelected = selectedId === itemId;
                  const isHovered = hoveredItem?.id === itemId;

                  const low = Number(d[lowerKey] ?? 0);
                  const up = Number(d[upperKey] ?? 0);
                  const cent = d[centerKey] != null ? Number(d[centerKey]) : null;

                  const xLow = valToX(low);
                  const xUp = valToX(up);
                  const xStart = Math.min(xLow, xUp);
                  const barWidth = Math.max(2, Math.abs(xUp - xLow));

                  const yCenter = idx * rowHeight + (rowHeight / 2);
                  const status = d.status || 'nominal';
                  const statusColor = STATUS_COLORS[status];

                  return (
                    <g
                      key={itemId}
                      className="range-row-horizontal"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        setHoveredItem(d);
                        setTooltipPos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={(e) => {
                        setSelectedId(itemId);
                        if (onItemClick) onItemClick(d, e);
                      }}
                    >
                      {/* Row Hover / Selection Background */}
                      <rect
                        x={-margin.left + 8}
                        y={idx * rowHeight + 2}
                        width={width - 24}
                        height={rowHeight - 4}
                        fill={isSelected ? '#eff6ff' : isHovered ? '#f8fafc' : 'transparent'}
                        rx="4"
                      />

                      {/* Category Label */}
                      <text
                        x="-12"
                        y={yCenter + 4}
                        fontSize="12"
                        fontWeight={isSelected || isHovered ? 600 : 400}
                        fill={isSelected ? '#0284c7' : '#1e293b'}
                        textAnchor="end"
                      >
                        {d[categoryKey] || `Item ${idx + 1}`}
                      </text>

                      {/* SUB-VARIANT: INTERVAL BAR */}
                      {variant === 'interval-bar' && (
                        <g>
                          {/* Floating Bar */}
                          <rect
                            x={xStart}
                            y={yCenter - barThickness / 2}
                            width={barWidth}
                            height={barThickness}
                            rx={barThickness / 3}
                            fill={status === 'critical' ? 'url(#rc-hatch-critical)' : status === 'warning' ? 'url(#rc-hatch-warning)' : statusColor}
                            stroke={statusColor}
                            strokeWidth={isSelected ? 2 : 1}
                            opacity={isHovered ? 1 : 0.85}
                            filter="url(#rc-glow)"
                          />

                          {/* Center Estimate Marker (Diamond or Tick) */}
                          {showCenterEstimate && cent != null && (
                            <line
                              x1={valToX(cent)}
                              x2={valToX(cent)}
                              y1={yCenter - barThickness / 2 - 2}
                              y2={yCenter + barThickness / 2 + 2}
                              stroke="#0f172a"
                              strokeWidth="2.5"
                            />
                          )}

                          {/* Direct Value Labels */}
                          {showDirectLabels && (
                            <g fontSize="10" fill="#64748b">
                              <text x={xStart - 5} y={yCenter + 3} textAnchor="end">{low}</text>
                              <text x={xStart + barWidth + 5} y={yCenter + 3} textAnchor="start">{up}</text>
                            </g>
                          )}
                        </g>
                      )}

                      {/* SUB-VARIANT: DUMBBELL (Before / After Delta) */}
                      {variant === 'dumbbell' && (() => {
                        const isImproved = d.isImproved ?? (up <= low); // e.g. cycle time reduction is improved
                        const endpointEndColor = isImproved ? DUMBBELL_ENDPOINT_COLORS.afterImproved : DUMBBELL_ENDPOINT_COLORS.afterRegressed;

                        return (
                          <g>
                            {/* Connecting Line */}
                            <line
                              x1={xLow}
                              x2={xUp}
                              y1={yCenter}
                              y2={yCenter}
                              stroke="#94a3b8"
                              strokeWidth={isSelected ? 3 : 2}
                              strokeDasharray={d.dashed ? '3,2' : undefined}
                            />

                            {/* Start / Before Node */}
                            <circle
                              cx={xLow}
                              cy={yCenter}
                              r="6"
                              fill={DUMBBELL_ENDPOINT_COLORS.before}
                              stroke="#ffffff"
                              strokeWidth="1.5"
                            />

                            {/* End / After Node */}
                            <circle
                              cx={xUp}
                              cy={yCenter}
                              r="7"
                              fill={endpointEndColor}
                              stroke="#ffffff"
                              strokeWidth="2"
                              filter="url(#rc-glow)"
                            />

                            {/* Direct Labels */}
                            {showDirectLabels && (
                              <g fontSize="10" fontWeight="600">
                                <text x={xLow} y={yCenter - 9} textAnchor="middle" fill="#64748b">{low}</text>
                                <text x={xUp} y={yCenter - 9} textAnchor="middle" fill={endpointEndColor}>{up}</text>
                              </g>
                            )}
                          </g>
                        );
                      })()}

                      {/* SUB-VARIANT: ERROR BAR (Whisker & Center Point) */}
                      {variant === 'error-bar' && (() => {
                        const cVal = cent != null ? cent : (low + up) / 2;
                        const xCent = valToX(cVal);

                        return (
                          <g>
                            {/* Whisker Span Line */}
                            <line
                              x1={xLow}
                              x2={xUp}
                              y1={yCenter}
                              y2={yCenter}
                              stroke="#334155"
                              strokeWidth="1.5"
                            />
                            {/* Lower Whisker Cap */}
                            <line
                              x1={xLow}
                              x2={xLow}
                              y1={yCenter - 5}
                              y2={yCenter + 5}
                              stroke="#334155"
                              strokeWidth="1.5"
                            />
                            {/* Upper Whisker Cap */}
                            <line
                              x1={xUp}
                              x2={xUp}
                              y1={yCenter - 5}
                              y2={yCenter + 5}
                              stroke="#334155"
                              strokeWidth="1.5"
                            />
                            {/* Center Point Marker */}
                            <circle
                              cx={xCent}
                              cy={yCenter}
                              r="5"
                              fill={statusColor}
                              stroke="#ffffff"
                              strokeWidth="1.5"
                            />
                          </g>
                        );
                      })()}
                    </g>
                  );
                })}
              </g>
            )}
          </g>
        </svg>

        {/* Floating Tooltip */}
        {hoveredItem && (
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
            maxWidth: 260
          }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
              {hoveredItem[categoryKey] || hoveredItem.label || hoveredItem.id}
            </div>

            {hoveredItem.intervalSemantics && (
              <div style={{ color: '#94a3b8', fontSize: 11, marginBottom: 6 }}>
                Construct: <strong>{hoveredItem.intervalSemantics}</strong>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px 12px', fontSize: 11 }}>
              <span style={{ color: '#cbd5e1' }}>Lower Bound:</span>
              <span style={{ fontWeight: 600, textAlign: 'right' }}>{hoveredItem[lowerKey]} {unit}</span>

              <span style={{ color: '#cbd5e1' }}>Upper Bound:</span>
              <span style={{ fontWeight: 600, textAlign: 'right' }}>{hoveredItem[upperKey]} {unit}</span>

              {hoveredItem[centerKey] != null && (
                <>
                  <span style={{ color: '#38bdf8' }}>Center Estimate:</span>
                  <span style={{ fontWeight: 600, textAlign: 'right', color: '#38bdf8' }}>
                    {hoveredItem[centerKey]} {unit}
                  </span>
                </>
              )}

              <span style={{ color: '#cbd5e1' }}>Spread (Span):</span>
              <span style={{ fontWeight: 600, textAlign: 'right' }}>
                {Math.abs(Number(hoveredItem[upperKey]) - Number(hoveredItem[lowerKey])).toLocaleString('en-IN', { maximumFractionDigits: 2 })} {unit}
              </span>

              {variant === 'dumbbell' && (
                <>
                  <span style={{ color: '#fcd34d' }}>Delta (Change):</span>
                  <span style={{ fontWeight: 600, textAlign: 'right', color: '#fcd34d' }}>
                    {(Number(hoveredItem[upperKey]) - Number(hoveredItem[lowerKey])).toFixed(1)} {unit}
                  </span>
                </>
              )}
            </div>

            {hoveredItem.status && (
              <div style={{ marginTop: 6, fontSize: 11, color: STATUS_COLORS[hoveredItem.status] }}>
                ● Status: {hoveredItem.status.toUpperCase()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accessible Spatial Table Modal (Alt + F11) */}
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
            width: '90%',
            maxWidth: 720,
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
              <h3 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>Accessible Range & Interval Data Table</h3>
              <button
                onClick={() => setIsTableModalOpen(false)}
                style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#64748b' }}
              >✕</button>
            </div>

            <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px' }}>Category / Item</th>
                    <th style={{ padding: '8px 10px' }}>Interval Semantics</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Lower Limit</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Center Estimate</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Upper Limit</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Spread (Interval)</th>
                    <th style={{ padding: '8px 10px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((d, i) => {
                    const low = Number(d[lowerKey] ?? 0);
                    const up = Number(d[upperKey] ?? 0);
                    const cent = d[centerKey] != null ? Number(d[centerKey]) : null;
                    const spread = Math.abs(up - low);

                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 600 }}>{d[categoryKey] || `Item ${i + 1}`}</td>
                        <td style={{ padding: '8px 10px', color: '#64748b' }}>{d.intervalSemantics || 'Bounded Range'}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>{low.toLocaleString('en-IN')} {unit}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: '#0284c7' }}>
                          {cent != null ? `${cent.toLocaleString('en-IN')} ${unit}` : '—'}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>{up.toLocaleString('en-IN')} {unit}</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                          {spread.toLocaleString('en-IN', { maximumFractionDigits: 2 })} {unit}
                        </td>
                        <td style={{ padding: '8px 10px', color: STATUS_COLORS[d.status || 'nominal'], fontWeight: 600 }}>
                          {(d.status || 'nominal').toUpperCase()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RangeChart;
