import React, { useState, useId, useRef, useMemo, useEffect } from 'react';
import {
  VIZ_COLORS,
  VIZ_SEMANTIC_COLORS,
  POINT_SYMBOLS,
  STROKE_DASH_PATTERNS,
  formatVizValue,
  createPlotRegion,
  createLinearScale,
  generateTicks,
  LAYER_STACK,
  createLinePath,
  createKeyboardRovingFocus
} from './viz-core.js';

/**
 * Meridian Design System — LineChart
 *
 * Shows change, trajectory, trend, and rate across an ordered (temporal) domain.
 * Consumes the 10 Shared Visualization Infrastructure systems:
 * - Scale Engine (Linear, Temporal, Indexed Rebasing)
 * - Interpolation Engine (Linear, Stepped, Monotone smooth)
 * - Multi-Channel Series Differentiation (Stroke Dashes + Point Glyphs)
 * - Explicit Missing-Value Treatment (Gaps, Dashed paths, Zero)
 * - Crosshair Tracking, Keyboard Roving Tabindex & Tabular Fallback (Alt+F11)
 * - WAI-ARIA Graphics Module Semantics (role="graphics-document", role="graphics-symbol")
 */

export function LineChart({
  data = [],
  xKey = 'timestamp',
  yKey = 'value',
  series = null, // array of { key: string, label: string, color?: string, strokeDash?: string, symbol?: string }
  variant = 'single', // 'single' | 'multi' | 'stepped' | 'indexed' | 'small-multiples'
  interpolation = 'linear', // 'linear' | 'step' | 'step-after' | 'monotone' | 'smooth'
  compareMode = 'absolute', // 'absolute' | 'indexed'
  pointVisibility = 'hover', // 'always' | 'hover' | 'never' | 'endpoints'
  missingValuePolicy = 'dashed', // 'dashed' | 'gap' | 'zero'
  title = '',
  caption = '',
  description = '',
  unit = '',
  valueFormatter = null,
  referenceLines = [],
  thresholdBands = [],
  domain = null, // [min, max]
  selectedKey = null,
  onSelect = null,
  showGrid = true,
  showCrosshair = true,
  showLegend = true,
  showTooltip = true,
  showTableToggle = true,
  loading = false,
  emptyText = 'No trajectory data available for this range',
  height = 280,
  width = '100%',
  className = '',
  style = {},
  ...rest
}) {
  const chartId = useId().replace(/:/g, '-');
  const containerRef = useRef(null);

  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  const [activeSeries, setActiveSeries] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [focusedSeriesIndex, setFocusedSeriesIndex] = useState(0);
  const [isTableView, setIsTableView] = useState(false);
  const [svgDimensions, setSvgDimensions] = useState({
    width: 600,
    height: typeof height === 'number' ? height : 280
  });

  const isStepped = variant === 'stepped' || interpolation === 'step' || interpolation === 'step-after';
  const isIndexed = variant === 'indexed' || compareMode === 'indexed';
  const isSmallMultiples = variant === 'small-multiples';

  // Responsive resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0) {
          setSvgDimensions({
            width: w,
            height: typeof height === 'number' ? height : Math.max(220, h || 280)
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [height]);

  // Determine normalized multi-channel series
  const normalizedSeries = useMemo(() => {
    if (series && Array.isArray(series) && series.length > 0) {
      return series.map((s, idx) => ({
        key: typeof s === 'string' ? s : s.key,
        label: typeof s === 'string' ? s : (s.label || s.key),
        color: (typeof s === 'object' && s.color) ? s.color : VIZ_COLORS[idx % VIZ_COLORS.length],
        strokeDash: (typeof s === 'object' && s.strokeDash) ? s.strokeDash : STROKE_DASH_PATTERNS[idx % STROKE_DASH_PATTERNS.length],
        symbol: (typeof s === 'object' && s.symbol) ? s.symbol : POINT_SYMBOLS[idx % POINT_SYMBOLS.length]
      }));
    }
    return [{
      key: yKey,
      label: title || 'Value',
      color: VIZ_COLORS[0],
      strokeDash: 'none',
      symbol: POINT_SYMBOLS[0]
    }];
  }, [series, yKey, title]);

  // Processed data and indexed baseline transformations
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Calculate t0 baseline values for indexed comparison
    const initialValues = {};
    if (isIndexed && data.length > 0) {
      normalizedSeries.forEach(s => {
        const firstValid = data.find(d => d[s.key] != null && !isNaN(Number(d[s.key])));
        initialValues[s.key] = firstValid ? Number(firstValid[s.key]) : 1;
      });
    }

    return data.map((item, idx) => {
      const xVal = item[xKey] != null ? item[xKey] : idx;
      const point = { ...item, _x: xVal, _raw: item };

      normalizedSeries.forEach(s => {
        const raw = item[s.key];
        if (raw == null || isNaN(Number(raw))) {
          point[`_val_${s.key}`] = null;
          point[`_display_${s.key}`] = null;
        } else if (isIndexed) {
          const base = initialValues[s.key] || 1;
          const pctChange = ((Number(raw) - base) / (base || 1)) * 100;
          point[`_val_${s.key}`] = pctChange;
          point[`_display_${s.key}`] = `${pctChange >= 0 ? '+' : ''}${pctChange.toFixed(1)}%`;
        } else {
          point[`_val_${s.key}`] = Number(raw);
          point[`_display_${s.key}`] = formatVizValue(raw, unit, 'en-IN');
        }
      });

      return point;
    });
  }, [data, xKey, normalizedSeries, isIndexed, unit]);

  // Compute quantitative Y-axis domain
  const [computedMinY, computedMaxY] = useMemo(() => {
    if (domain && Array.isArray(domain) && domain.length === 2) {
      return domain;
    }
    if (processedData.length === 0) {
      return [0, 100];
    }

    let min = Infinity;
    let max = -Infinity;

    processedData.forEach(d => {
      normalizedSeries.forEach(s => {
        const v = d[`_val_${s.key}`];
        if (v != null) {
          if (v < min) min = v;
          if (v > max) max = v;
        }
      });
    });

    referenceLines.forEach(rl => {
      if (rl.value > max) max = rl.value;
      if (rl.value < min) min = rl.value;
    });

    if (min === Infinity || max === -Infinity) {
      return [0, 100];
    }

    if (min === max) {
      min = min - 10;
      max = max + 10;
    } else {
      const diff = max - min;
      max = max + diff * 0.08;
      min = min - diff * 0.08;
    }

    if (isIndexed) {
      if (min > 0) min = 0;
      if (max < 0) max = 0;
    }

    return [min, max];
  }, [domain, processedData, normalizedSeries, referenceLines, isIndexed]);

  // Layout bounds & Plot Region
  const margins = useMemo(() => ({
    top: 20,
    right: 32,
    bottom: 36,
    left: isIndexed ? 64 : 54
  }), [isIndexed]);

  const plotRegion = useMemo(() => {
    return createPlotRegion({
      containerWidth: svgDimensions.width,
      containerHeight: svgDimensions.height,
      margins
    });
  }, [svgDimensions, margins]);

  // Quantitative Y Scale
  const yScale = useMemo(() => {
    return createLinearScale({
      domain: [computedMinY, computedMaxY],
      range: [plotRegion.plotHeight, 0]
    });
  }, [computedMinY, computedMaxY, plotRegion]);

  // X Coordinate calculation
  const getX = useMemo(() => {
    return (index) => {
      if (processedData.length <= 1) return plotRegion.plotWidth / 2;
      return (index / (processedData.length - 1)) * plotRegion.plotWidth;
    };
  }, [processedData.length, plotRegion.plotWidth]);

  const yTicks = useMemo(() => generateTicks(yScale, 5), [yScale]);

  // Keyboard navigation along time sequence
  const handleKeyDown = useMemo(() => {
    return createKeyboardRovingFocus({
      itemCount: processedData.length,
      currentIndex: focusedIndex,
      onIndexChange: (newIdx) => {
        setFocusedIndex(newIdx);
        setHoveredPointIndex(newIdx);
      },
      onSelect: (idx) => {
        if (onSelect && processedData[idx]) {
          onSelect(processedData[idx]._raw, normalizedSeries[focusedSeriesIndex]?.key);
        }
      },
      onDismiss: () => {
        setHoveredPointIndex(null);
        setFocusedIndex(-1);
        setActiveSeries(null);
      },
      onToggleTable: () => {
        setIsTableView(prev => !prev);
      }
    });
  }, [processedData, focusedIndex, normalizedSeries, focusedSeriesIndex, onSelect]);

  // Skeleton Loading State
  if (loading) {
    return (
      <div
        ref={containerRef}
        className={`mer-linechart-container mer-linechart-loading ${className}`}
        style={{ width, height, position: 'relative', display: 'flex', flexDirection: 'column', ...style }}
        aria-busy="true"
        aria-label="Loading trajectory data..."
        {...rest}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ width: 160, height: 16, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-xs)', animation: 'mer-skeleton-sweep 1.4s ease-in-out infinite' }} />
          <div style={{ width: 80, height: 14, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-xs)' }} />
        </div>
        <div style={{ flex: 1, position: 'relative', borderBottom: '1px solid var(--border-hairline)' }}>
          <svg width="100%" height="100%" style={{ opacity: 0.4 }}>
            <path
              d={`M 20 ${svgDimensions.height * 0.7} Q ${svgDimensions.width * 0.3} ${svgDimensions.height * 0.2}, ${svgDimensions.width * 0.6} ${svgDimensions.height * 0.5} T ${svgDimensions.width - 20} ${svgDimensions.height * 0.3}`}
              fill="none"
              stroke="var(--border-strong)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>
        </div>
      </div>
    );
  }

  // Empty State
  if (!data || data.length === 0) {
    return (
      <div
        ref={containerRef}
        className={`mer-linechart-container mer-linechart-empty ${className}`}
        style={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--surface-card)',
          border: 'var(--border-hairline)',
          borderRadius: 'var(--radius-md)',
          padding: 24,
          color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-sans)',
          ...style
        }}
        {...rest}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 8, opacity: 0.6 }}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--text-secondary)' }}>{emptyText}</span>
      </div>
    );
  }

  const effectiveInterpolation = isStepped ? 'step' : interpolation;

  return (
    <div
      ref={containerRef}
      className={`mer-linechart-root ${className}`}
      style={{
        width,
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-primary)',
        position: 'relative',
        ...style
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={caption || title || 'Line chart trajectory visualization'}
      {...rest}
    >
      {/* Header & Table View Toggle */}
      {(title || caption || showTableToggle) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 12 }}>
          <div>
            {title && <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>{title}</div>}
            {caption && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{caption}</div>}
          </div>
          {showTableToggle && (
            <button
              type="button"
              onClick={() => setIsTableView(!isTableView)}
              style={{
                background: 'transparent',
                border: 'var(--border-hairline)',
                borderRadius: 'var(--radius-xs)',
                padding: '2px 8px',
                fontSize: 'var(--text-2xs)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
              title="Toggle accessible tabular view (Alt+F11)"
              aria-pressed={isTableView}
            >
              <span>{isTableView ? '📊 Chart View' : '📋 Table View'}</span>
            </button>
          )}
        </div>
      )}

      {/* Accessible Tabular View */}
      {isTableView ? (
        <div style={{ maxHeight: height, overflow: 'auto', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
            <thead>
              <tr style={{ background: 'var(--surface-sunken)', borderBottom: 'var(--border-hairline)' }}>
                <th scope="col" style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 'var(--weight-medium)', color: 'var(--text-secondary)' }}>Timestamp / Step</th>
                {normalizedSeries.map(s => (
                  <th key={s.key} scope="col" style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'var(--weight-medium)', color: 'var(--text-secondary)' }}>
                    {s.label} {isIndexed ? '(%)' : (unit ? `(${unit})` : '')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedData.map((d, i) => (
                <tr key={i} style={{ borderBottom: 'var(--border-subtle)' }}>
                  <th scope="row" style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 'var(--weight-medium)' }}>{d._x}</th>
                  {normalizedSeries.map(s => {
                    const displayVal = d[`_display_${s.key}`];
                    return (
                      <td key={s.key} style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                        {displayVal != null ? displayVal : '— (No Telemetry)'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* SVG Graphical Trajectory View */
        <div style={{ position: 'relative', width: '100%', height: svgDimensions.height }}>
          <svg
            width="100%"
            height={svgDimensions.height}
            viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
            role="graphics-document"
            aria-roledescription="line chart"
            style={{ overflow: 'visible' }}
          >
            <desc>{description || `${title || 'Line chart'} tracking ${processedData.length} observations from ${processedData[0]?._x} to ${processedData[processedData.length - 1]?._x}.`}</desc>

            {/* Layer 1: Threshold Tolerance Bands */}
            <g className="layer-threshold-bands">
              {thresholdBands.map((tb, i) => {
                const y1 = yScale(tb.min);
                const y2 = yScale(tb.max);
                const toneColor = tb.tone === 'critical' ? 'var(--status-critical-soft, rgba(239,68,68,0.12))' : 'var(--status-warning-soft, rgba(245,158,11,0.12))';
                const y = Math.min(y1, y2) + margins.top;
                const h = Math.abs(y1 - y2);

                return (
                  <rect key={i} x={margins.left} y={y} width={plotRegion.plotWidth} height={h} fill={toneColor} opacity="0.6" />
                );
              })}
            </g>

            {/* Layer 1: Y Quantitative Gridlines & Ticks */}
            {showGrid && (
              <g className="layer-gridlines">
                {yTicks.map((tickVal, i) => {
                  const y = margins.top + yScale(tickVal);
                  return (
                    <g key={i}>
                      <line
                        x1={margins.left}
                        y1={y}
                        x2={margins.left + plotRegion.plotWidth}
                        y2={y}
                        stroke="var(--border-subtle, rgba(0,0,0,0.06))"
                        strokeDasharray={tickVal === 0 ? 'none' : '3 3'}
                        strokeWidth={tickVal === 0 ? '1.5' : '1'}
                      />
                      <text
                        x={margins.left - 8}
                        y={y + 3}
                        textAnchor="end"
                        fontSize="10"
                        fontFamily="var(--font-mono)"
                        fill="var(--text-tertiary)"
                      >
                        {isIndexed ? `${tickVal >= 0 ? '+' : ''}${tickVal.toFixed(0)}%` : formatVizValue(tickVal, unit)}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Layer 1: X Temporal Axis Ticks */}
            <g className="layer-x-axis">
              {processedData.map((d, i) => {
                // Decimate labels if too crowded
                const total = processedData.length;
                const step = total > 16 ? Math.ceil(total / 6) : (total > 8 ? 2 : 1);
                if (i % step !== 0 && i !== total - 1) return null;

                const x = margins.left + getX(i);
                return (
                  <g key={i}>
                    <line x1={x} y1={margins.top + plotRegion.plotHeight} x2={x} y2={margins.top + plotRegion.plotHeight + 4} stroke="var(--border-strong)" strokeWidth="1" />
                    <text
                      x={x}
                      y={margins.top + plotRegion.plotHeight + 16}
                      textAnchor="middle"
                      fontSize="10"
                      fontFamily="var(--font-sans)"
                      fill={hoveredPointIndex === i ? 'var(--text-primary)' : 'var(--text-secondary)'}
                      fontWeight={hoveredPointIndex === i ? 'var(--weight-semibold)' : 'var(--weight-regular)'}
                    >
                      {d._x}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Layer 3: Reference Target Lines */}
            <g className="layer-reference-lines">
              {referenceLines.map((rl, idx) => {
                const y = margins.top + yScale(rl.value);
                const color = rl.tone === 'danger' ? VIZ_SEMANTIC_COLORS.critical : rl.tone === 'warning' ? VIZ_SEMANTIC_COLORS.warning : VIZ_SEMANTIC_COLORS.info;
                return (
                  <g key={`rl-${idx}`}>
                    <line x1={margins.left} y1={y} x2={margins.left + plotRegion.plotWidth} y2={y} stroke={color} strokeDasharray="4 3" strokeWidth="1.5" />
                    <text x={margins.left + plotRegion.plotWidth - 4} y={y - 4} textAnchor="end" fontSize="9" fontFamily="var(--font-mono)" fill={color} fontWeight="var(--weight-semibold)">
                      {rl.label || formatVizValue(rl.value, isIndexed ? '%' : unit)}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Layer 2: Series Lines & Area Paths */}
            <g className="layer-series-lines">
              {normalizedSeries.map((s, sIdx) => {
                const isDimmed = activeSeries && activeSeries !== s.key;

                // Segregate continuous segments based on missingValuePolicy
                const segments = [];
                let currentSegment = [];

                processedData.forEach((d, i) => {
                  const val = d[`_val_${s.key}`];
                  const x = margins.left + getX(i);

                  if (val != null) {
                    const y = margins.top + yScale(val);
                    currentSegment.push({ x, y, val, index: i, raw: d });
                  } else {
                    if (currentSegment.length > 0) {
                      segments.push({ points: currentSegment, type: 'valid' });
                      currentSegment = [];
                    }
                    // Handle missing policy
                    if (missingValuePolicy === 'zero') {
                      const zeroY = margins.top + yScale(0);
                      currentSegment.push({ x, y: zeroY, val: 0, index: i, raw: d });
                    }
                  }
                });

                if (currentSegment.length > 0) {
                  segments.push({ points: currentSegment, type: 'valid' });
                }

                return (
                  <g key={s.key} role="graphics-symbol" aria-label={s.label}>
                    {/* Render Line Segments */}
                    {segments.map((seg, segIdx) => {
                      const pathD = createLinePath(seg.points, effectiveInterpolation);
                      return (
                        <path
                          key={segIdx}
                          d={pathD}
                          fill="none"
                          stroke={s.color}
                          strokeWidth={sIdx === focusedSeriesIndex ? 2.5 : 2}
                          strokeDasharray={s.strokeDash !== 'none' ? s.strokeDash : undefined}
                          opacity={isDimmed ? 0.25 : 1}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      );
                    })}

                    {/* Connect gaps with broken dashed line if policy is 'dashed' */}
                    {missingValuePolicy === 'dashed' && segments.length > 1 && (
                      segments.slice(0, -1).map((seg, segIdx) => {
                        const nextSeg = segments[segIdx + 1];
                        const pStart = seg.points[seg.points.length - 1];
                        const pEnd = nextSeg.points[0];
                        return (
                          <line
                            key={`gap-${segIdx}`}
                            x1={pStart.x}
                            y1={pStart.y}
                            x2={pEnd.x}
                            y2={pEnd.y}
                            stroke={s.color}
                            strokeWidth="1.5"
                            strokeDasharray="2 3"
                            opacity={isDimmed ? 0.2 : 0.6}
                          />
                        );
                      })
                    )}

                    {/* Point Marks & Symbols */}
                    {processedData.map((d, i) => {
                      const val = d[`_val_${s.key}`];
                      if (val == null) return null;

                      const x = margins.left + getX(i);
                      const y = margins.top + yScale(val);
                      const isHovered = hoveredPointIndex === i;
                      const isFocused = focusedIndex === i && focusedSeriesIndex === sIdx;

                      const showPoint = pointVisibility === 'always' ||
                        isHovered ||
                        isFocused ||
                        (pointVisibility === 'endpoints' && (i === 0 || i === processedData.length - 1));

                      if (!showPoint) return null;

                      return (
                        <g key={i} transform={`translate(${x}, ${y})`}>
                          {s.symbol === 'square' ? (
                            <rect
                              x={isHovered ? -5 : -3.5}
                              y={isHovered ? -5 : -3.5}
                              width={isHovered ? 10 : 7}
                              height={isHovered ? 10 : 7}
                              fill="var(--surface-card)"
                              stroke={s.color}
                              strokeWidth={isHovered ? 2.5 : 2}
                            />
                          ) : s.symbol === 'diamond' ? (
                            <rect
                              x={isHovered ? -4.5 : -3}
                              y={isHovered ? -4.5 : -3}
                              width={isHovered ? 9 : 6}
                              height={isHovered ? 9 : 6}
                              transform="rotate(45)"
                              fill="var(--surface-card)"
                              stroke={s.color}
                              strokeWidth={isHovered ? 2.5 : 2}
                            />
                          ) : (
                            <circle
                              r={isHovered ? 5 : 3.5}
                              fill="var(--surface-card)"
                              stroke={s.color}
                              strokeWidth={isHovered ? 2.5 : 2}
                            />
                          )}
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </g>

            {/* Layer 4: Active Hover Crosshair Line */}
            {showCrosshair && hoveredPointIndex != null && (
              <g className="layer-crosshair" pointerEvents="none">
                <line
                  x1={margins.left + getX(hoveredPointIndex)}
                  y1={margins.top}
                  x2={margins.left + getX(hoveredPointIndex)}
                  y2={margins.top + plotRegion.plotHeight}
                  stroke="var(--border-strong, #64748b)"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
              </g>
            )}

            {/* Invisible Hit Slices for Pointer Scrubbing */}
            <g className="layer-interaction-slices">
              {processedData.map((d, i) => {
                const x = margins.left + getX(i);
                const sliceW = plotRegion.plotWidth / Math.max(1, processedData.length);
                return (
                  <rect
                    key={i}
                    x={x - sliceW / 2}
                    y={margins.top}
                    width={sliceW}
                    height={plotRegion.plotHeight}
                    fill="transparent"
                    onMouseEnter={() => setHoveredPointIndex(i)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                    onClick={() => onSelect && onSelect(d._raw)}
                    style={{ cursor: onSelect ? 'pointer' : 'default' }}
                  />
                );
              })}
            </g>
          </svg>

          {/* Layer 5: Floating Inspection Tooltip */}
          {showTooltip && hoveredPointIndex != null && processedData[hoveredPointIndex] && (
            <div
              className="mer-linechart-tooltip"
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: 'var(--surface-card, #ffffff)',
                border: 'var(--border-hairline, 1px solid rgba(0,0,0,0.12))',
                borderRadius: 'var(--radius-sm, 4px)',
                boxShadow: 'var(--shadow-md, 0 4px 12px rgba(0,0,0,0.08))',
                padding: '8px 12px',
                fontSize: 'var(--text-xs, 12px)',
                pointerEvents: 'none',
                zIndex: LAYER_STACK.TOOLTIP_AND_OVERLAYS,
                minWidth: 150,
                lineHeight: 1.4
              }}
            >
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4, marginBottom: 4 }}>
                {processedData[hoveredPointIndex]._x}
              </div>
              {normalizedSeries.map(s => {
                const displayVal = processedData[hoveredPointIndex][`_display_${s.key}`];
                return (
                  <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 2 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                      {s.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-medium)', color: displayVal != null ? 'var(--text-primary)' : 'var(--text-critical)' }}>
                      {displayVal != null ? displayVal : 'No Telemetry'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Legend Footer for Multi-Series */}
      {showLegend && normalizedSeries.length > 1 && !isTableView && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 12, paddingTop: 8, borderTop: 'var(--border-subtle)' }}>
          {normalizedSeries.map((s, sIdx) => {
            const isDimmed = activeSeries && activeSeries !== s.key;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setActiveSeries(activeSeries === s.key ? null : s.key)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '2px 4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  opacity: isDimmed ? 0.35 : 1,
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)'
                }}
                title={`Click to isolate ${s.label}`}
              >
                <span style={{ width: 14, height: 2, background: s.color, display: 'inline-block', borderTop: s.strokeDash !== 'none' ? '2px dashed currentColor' : 'none' }} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
