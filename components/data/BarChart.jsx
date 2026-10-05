import React, { useState, useId, useRef, useMemo, useEffect } from 'react';
import {
  VIZ_COLORS,
  VIZ_SEMANTIC_COLORS,
  PATTERN_PRESETS,
  formatVizValue,
  createPlotRegion,
  createBandScale,
  createLinearScale,
  generateTicks,
  LAYER_STACK,
  createKeyboardRovingFocus
} from './viz-core.js';

/**
 * Meridian Design System — BarChart
 *
 * Compares quantitative magnitude across discrete categories.
 * Built upon the 10 Shared Visualization Infrastructure systems:
 * - Mathematical Scale Engine (createBandScale, createLinearScale)
 * - Strict zero-baseline enforcement for magnitude truth
 * - Multi-channel accessibility (VIZ_COLORS + PATTERN_PRESETS)
 * - Roving tabindex keyboard traversal & Alt+F11 tabular view fallback
 * - WAI-ARIA graphics module semantics (role="graphics-document", role="graphics-symbol")
 */

export function BarChart({
  data = [],
  categoryKey = 'label',
  valueKey = 'value',
  series = null, // array of { key: string, label: string, color?: string }
  variant = 'vertical', // 'vertical' | 'horizontal' | 'grouped' | 'stacked' | 'normalized' | 'diverging' | 'floating'
  orientation = null, // 'vertical' | 'horizontal' (defaults based on variant)
  title = '',
  caption = '',
  description = '',
  unit = '',
  valueFormatter = null,
  referenceLines = [],
  thresholdBands = [],
  baseline = 0,
  domain = null, // [min, max]
  selectedKey = null,
  onSelect = null,
  showGrid = true,
  showValues = false,
  showLegend = true,
  showTooltip = true,
  showTableToggle = true,
  loading = false,
  emptyText = 'No data available for this selection',
  height = 280,
  width = '100%',
  className = '',
  style = {},
  ...rest
}) {
  const chartId = useId().replace(/:/g, '-');
  const containerRef = useRef(null);

  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [activeSeries, setActiveSeries] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [focusedSeriesIndex, setFocusedSeriesIndex] = useState(0);
  const [isTableView, setIsTableView] = useState(false);
  const [svgDimensions, setSvgDimensions] = useState({
    width: 600,
    height: typeof height === 'number' ? height : 280
  });

  const isHorizontal = orientation === 'horizontal' || variant === 'horizontal' || variant === 'diverging';
  const isGrouped = variant === 'grouped';
  const isStacked = variant === 'stacked';
  const isNormalized = variant === 'normalized';
  const isDiverging = variant === 'diverging';
  const isFloating = variant === 'floating';

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

  // Determine series list with colors and accessible hatching patterns
  const normalizedSeries = useMemo(() => {
    if (series && Array.isArray(series) && series.length > 0) {
      return series.map((s, idx) => ({
        key: typeof s === 'string' ? s : s.key,
        label: typeof s === 'string' ? s : (s.label || s.key),
        color: (typeof s === 'object' && s.color) ? s.color : VIZ_COLORS[idx % VIZ_COLORS.length],
        patternId: `${chartId}-${PATTERN_PRESETS[idx % PATTERN_PRESETS.length].id}`
      }));
    }
    return [{
      key: valueKey,
      label: title || 'Value',
      color: VIZ_COLORS[0],
      patternId: `${chartId}-${PATTERN_PRESETS[0].id}`
    }];
  }, [series, valueKey, title, chartId]);

  // Process data records for stacked, normalized, floating, and standard modes
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item, idx) => {
      const cat = item[categoryKey] != null ? item[categoryKey] : `Category ${idx + 1}`;

      if (isNormalized) {
        const total = normalizedSeries.reduce((sum, s) => sum + Math.max(0, Number(item[s.key]) || 0), 0);
        const percentages = {};
        let runningPct = 0;
        normalizedSeries.forEach(s => {
          const raw = Math.max(0, Number(item[s.key]) || 0);
          const pct = total > 0 ? (raw / total) * 100 : 0;
          percentages[s.key] = {
            raw,
            pct,
            startPct: runningPct,
            endPct: runningPct + pct
          };
          runningPct += pct;
        });
        return { ...item, _category: cat, _total: total, _percentages: percentages };
      }

      if (isStacked) {
        let posSum = 0;
        let negSum = 0;
        const stackOffsets = {};
        normalizedSeries.forEach(s => {
          const val = Number(item[s.key]) || 0;
          if (val >= 0) {
            stackOffsets[s.key] = { start: posSum, end: posSum + val, val };
            posSum += val;
          } else {
            stackOffsets[s.key] = { start: negSum, end: negSum + val, val };
            negSum += val;
          }
        });
        return { ...item, _category: cat, _posSum: posSum, _negSum: negSum, _stackOffsets: stackOffsets };
      }

      if (isFloating) {
        const start = Number(item.start ?? item.min ?? 0);
        const end = Number(item.end ?? item.max ?? item[valueKey] ?? 0);
        return { ...item, _category: cat, _start: Math.min(start, end), _end: Math.max(start, end) };
      }

      return { ...item, _category: cat };
    });
  }, [data, categoryKey, normalizedSeries, isNormalized, isStacked, isFloating, valueKey]);

  // Compute scale domain bounds
  const [computedMin, computedMax] = useMemo(() => {
    if (domain && Array.isArray(domain) && domain.length === 2) {
      return domain;
    }
    if (isNormalized) {
      return [0, 100];
    }
    if (processedData.length === 0) {
      return [0, 100];
    }

    let min = baseline;
    let max = baseline;

    if (isStacked) {
      processedData.forEach(d => {
        if (d._posSum > max) max = d._posSum;
        if (d._negSum < min) min = d._negSum;
      });
    } else if (isFloating) {
      processedData.forEach(d => {
        if (d._end > max) max = d._end;
        if (d._start < min) min = d._start;
      });
    } else if (normalizedSeries.length > 1) {
      processedData.forEach(d => {
        normalizedSeries.forEach(s => {
          const v = Number(d[s.key]) || 0;
          if (v > max) max = v;
          if (v < min) min = v;
        });
      });
    } else {
      processedData.forEach(d => {
        const v = Number(d[valueKey]) || 0;
        if (v > max) max = v;
        if (v < min) min = v;
      });
    }

    referenceLines.forEach(rl => {
      if (rl.value > max) max = rl.value;
      if (rl.value < min) min = rl.value;
    });

    const diff = max - min || 10;
    max = max + diff * 0.08;
    if (min < 0) min = min - diff * 0.08;

    // Strict zero baseline enforcement for positive magnitude sets
    if (min >= 0 && baseline === 0) {
      min = 0;
    }

    return [min, max];
  }, [domain, isNormalized, processedData, baseline, isStacked, isFloating, normalizedSeries, valueKey, referenceLines]);

  // Plot Region layout & margins
  const margins = useMemo(() => {
    if (isHorizontal) {
      const maxCatLen = processedData.reduce((max, d) => Math.max(max, String(d._category).length), 0);
      const leftPad = Math.min(140, Math.max(68, maxCatLen * 7.5 + 16));
      return { top: 16, right: 32, bottom: 32, left: leftPad };
    }
    return { top: 16, right: 16, bottom: 44, left: 56 };
  }, [isHorizontal, processedData]);

  const plotRegion = useMemo(() => {
    return createPlotRegion({
      containerWidth: svgDimensions.width,
      containerHeight: svgDimensions.height,
      margins
    });
  }, [svgDimensions, margins]);

  // Initialize Quantitative & Categorical Scales
  const quantitativeScale = useMemo(() => {
    if (isHorizontal) {
      return createLinearScale({
        domain: [computedMin, computedMax],
        range: [0, plotRegion.plotWidth],
        baseline
      });
    }
    return createLinearScale({
      domain: [computedMin, computedMax],
      range: [plotRegion.plotHeight, 0],
      baseline
    });
  }, [computedMin, computedMax, plotRegion, isHorizontal, baseline]);

  const categoricalScale = useMemo(() => {
    const categories = processedData.map(d => d._category);
    return createBandScale({
      domain: categories,
      range: isHorizontal ? [0, plotRegion.plotHeight] : [0, plotRegion.plotWidth],
      paddingInner: 0.24,
      paddingOuter: 0.12
    });
  }, [processedData, isHorizontal, plotRegion]);

  const baselinePos = quantitativeScale(baseline);
  const ticks = useMemo(() => generateTicks(quantitativeScale, isHorizontal ? 5 : 4), [quantitativeScale, isHorizontal]);

  // Keyboard navigation
  const handleKeyDown = useMemo(() => {
    return createKeyboardRovingFocus({
      itemCount: processedData.length,
      currentIndex: focusedIndex,
      onIndexChange: (newIdx) => {
        setFocusedIndex(newIdx);
        setHoveredPoint({
          data: processedData[newIdx],
          index: newIdx,
          seriesKey: normalizedSeries[focusedSeriesIndex]?.key
        });
      },
      onSelect: (idx) => {
        if (onSelect && processedData[idx]) {
          onSelect(processedData[idx], normalizedSeries[focusedSeriesIndex]?.key);
        }
      },
      onDismiss: () => {
        setHoveredPoint(null);
        setFocusedIndex(-1);
        setActiveSeries(null);
      },
      onToggleTable: () => {
        setIsTableView(prev => !prev);
      }
    });
  }, [processedData, focusedIndex, normalizedSeries, focusedSeriesIndex, onSelect]);

  // Skeleton Loading View
  if (loading) {
    return (
      <div
        ref={containerRef}
        className={`mer-barchart-container mer-barchart-loading ${className}`}
        style={{ width, height, position: 'relative', display: 'flex', flexDirection: 'column', ...style }}
        aria-busy="true"
        aria-label="Loading bar chart data..."
        {...rest}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ width: 140, height: 16, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-xs)', animation: 'mer-skeleton-sweep 1.4s ease-in-out infinite' }} />
          <div style={{ width: 60, height: 14, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-xs)' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--border-hairline)' }}>
          {[60, 85, 45, 95, 70, 40].map((h, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                background: 'var(--surface-sunken)',
                borderRadius: 'var(--radius-xs) var(--radius-xs) 0 0',
                animation: 'mer-skeleton-sweep 1.4s ease-in-out infinite',
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Empty State View
  if (!data || data.length === 0) {
    return (
      <div
        ref={containerRef}
        className={`mer-barchart-container mer-barchart-empty ${className}`}
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
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--text-secondary)' }}>{emptyText}</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mer-barchart-root ${className}`}
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
      aria-label={caption || title || 'Bar chart data visualization'}
      {...rest}
    >
      {/* Header & Accessible Tabular Switcher */}
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
                <th scope="col" style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 'var(--weight-medium)', color: 'var(--text-secondary)' }}>Category</th>
                {normalizedSeries.map(s => (
                  <th key={s.key} scope="col" style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 'var(--weight-medium)', color: 'var(--text-secondary)' }}>
                    {s.label} {unit ? `(${unit})` : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processedData.map((d, i) => (
                <tr key={i} style={{ borderBottom: 'var(--border-subtle)' }}>
                  <th scope="row" style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 'var(--weight-medium)' }}>{d._category}</th>
                  {normalizedSeries.map(s => {
                    const rawVal = d[s.key];
                    return (
                      <td key={s.key} style={{ padding: '8px 12px', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                        {formatVizValue(rawVal, isNormalized ? '%' : unit, 'en-IN')}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* SVG Graphical Bar Chart Canvas */
        <div style={{ position: 'relative', width: '100%', height: svgDimensions.height }}>
          <svg
            width="100%"
            height={svgDimensions.height}
            viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
            role="graphics-document"
            aria-roledescription="bar chart"
            style={{ overflow: 'visible' }}
          >
            {/* SVG Screen-Reader Summary */}
            <desc>{description || `${title || 'Bar chart'} displaying ${processedData.length} categories from ${formatVizValue(computedMin, unit)} to ${formatVizValue(computedMax, unit)}.`}</desc>

            {/* Pattern Definitions for Multi-Channel Non-Color Redundancy */}
            <defs>
              {PATTERN_PRESETS.map(p => (
                <pattern
                  key={p.id}
                  id={`${chartId}-${p.id}`}
                  width="6"
                  height="6"
                  patternTransform={p.transform || undefined}
                  patternUnits="userSpaceOnUse"
                >
                  {p.type === 'circle' ? (
                    <circle cx="2" cy="2" r={p.r} fill={p.fill} />
                  ) : p.id === 'pat-cross' ? (
                    <>
                      <line x1="0" y1="0" x2="6" y2="6" stroke={p.stroke} strokeWidth={p.strokeWidth} />
                      <line x1="6" y1="0" x2="0" y2="6" stroke={p.stroke} strokeWidth={p.strokeWidth} />
                    </>
                  ) : (
                    <line x1="0" y1="0" x2="0" y2="6" stroke={p.stroke} strokeWidth={p.strokeWidth} />
                  )}
                </pattern>
              ))}
            </defs>

            {/* Layer 1: Threshold Bands */}
            <g className="layer-threshold-bands">
              {thresholdBands.map((tb, i) => {
                const startPos = quantitativeScale(tb.min);
                const endPos = quantitativeScale(tb.max);
                const toneColor = tb.tone === 'critical' ? 'var(--status-critical-soft, rgba(239,68,68,0.12))' : 'var(--status-warning-soft, rgba(245,158,11,0.12))';

                if (isHorizontal) {
                  const x = Math.min(startPos, endPos) + margins.left;
                  const w = Math.abs(endPos - startPos);
                  return (
                    <rect key={i} x={x} y={margins.top} width={w} height={plotRegion.plotHeight} fill={toneColor} opacity="0.6" />
                  );
                }
                const y = Math.min(startPos, endPos) + margins.top;
                const h = Math.abs(endPos - startPos);
                return (
                  <rect key={i} x={margins.left} y={y} width={plotRegion.plotWidth} height={h} fill={toneColor} opacity="0.6" />
                );
              })}
            </g>

            {/* Layer 1: Gridlines & Quantitative Axis Ticks */}
            {showGrid && (
              <g className="layer-gridlines">
                {ticks.map((tickVal, i) => {
                  const pos = quantitativeScale(tickVal);
                  if (isHorizontal) {
                    const x = margins.left + pos;
                    return (
                      <g key={i}>
                        <line
                          x1={x}
                          y1={margins.top}
                          x2={x}
                          y2={margins.top + plotRegion.plotHeight}
                          stroke="var(--border-subtle, rgba(0,0,0,0.06))"
                          strokeDasharray={tickVal === baseline ? 'none' : '3 3'}
                          strokeWidth={tickVal === baseline ? '1.5' : '1'}
                        />
                        <text
                          x={x}
                          y={margins.top + plotRegion.plotHeight + 16}
                          textAnchor="middle"
                          fontSize="10"
                          fontFamily="var(--font-mono)"
                          fill="var(--text-tertiary)"
                        >
                          {formatVizValue(tickVal, isNormalized ? '%' : unit)}
                        </text>
                      </g>
                    );
                  }
                  const y = margins.top + pos;
                  return (
                    <g key={i}>
                      <line
                        x1={margins.left}
                        y1={y}
                        x2={margins.left + plotRegion.plotWidth}
                        y2={y}
                        stroke="var(--border-subtle, rgba(0,0,0,0.06))"
                        strokeDasharray={tickVal === baseline ? 'none' : '3 3'}
                        strokeWidth={tickVal === baseline ? '1.5' : '1'}
                      />
                      <text
                        x={margins.left - 8}
                        y={y + 3}
                        textAnchor="end"
                        fontSize="10"
                        fontFamily="var(--font-mono)"
                        fill="var(--text-tertiary)"
                      >
                        {formatVizValue(tickVal, isNormalized ? '%' : unit)}
                      </text>
                    </g>
                  );
                })}
              </g>
            )}

            {/* Layer 3: Baseline Zero Anchor Line */}
            {baseline >= computedMin && baseline <= computedMax && (
              <line
                x1={isHorizontal ? margins.left + baselinePos : margins.left}
                y1={isHorizontal ? margins.top : margins.top + baselinePos}
                x2={isHorizontal ? margins.left + baselinePos : margins.left + plotRegion.plotWidth}
                y2={isHorizontal ? margins.top + plotRegion.plotHeight : margins.top + baselinePos}
                stroke="var(--border-strong, #64748b)"
                strokeWidth="1.5"
              />
            )}

            {/* Layer 3: Reference Target Lines */}
            <g className="layer-reference-lines">
              {referenceLines.map((rl, idx) => {
                const pos = quantitativeScale(rl.value);
                const color = rl.tone === 'danger' ? VIZ_SEMANTIC_COLORS.critical : rl.tone === 'warning' ? VIZ_SEMANTIC_COLORS.warning : VIZ_SEMANTIC_COLORS.info;
                if (isHorizontal) {
                  const x = margins.left + pos;
                  return (
                    <g key={`rl-${idx}`}>
                      <line x1={x} y1={margins.top} x2={x} y2={margins.top + plotRegion.plotHeight} stroke={color} strokeDasharray="4 3" strokeWidth="1.5" />
                      <text x={x} y={margins.top - 4} textAnchor="middle" fontSize="9" fontFamily="var(--font-mono)" fill={color} fontWeight="var(--weight-semibold)">
                        {rl.label || formatVizValue(rl.value, unit)}
                      </text>
                    </g>
                  );
                }
                const y = margins.top + pos;
                return (
                  <g key={`rl-${idx}`}>
                    <line x1={margins.left} y1={y} x2={margins.left + plotRegion.plotWidth} y2={y} stroke={color} strokeDasharray="4 3" strokeWidth="1.5" />
                    <text x={margins.left + plotRegion.plotWidth - 4} y={y - 4} textAnchor="end" fontSize="9" fontFamily="var(--font-mono)" fill={color} fontWeight="var(--weight-semibold)">
                      {rl.label || formatVizValue(rl.value, unit)}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Layer 2: Bar Marks & Categorical Axes */}
            <g className="layer-bar-marks">
              {processedData.map((d, catIndex) => {
                const isSelected = selectedKey != null && d[categoryKey] === selectedKey;
                const isFocused = focusedIndex === catIndex;
                const isHovered = hoveredPoint?.index === catIndex;
                const bandPos = categoricalScale(d._category);
                const bandWidth = categoricalScale.bandwidth();

                if (isHorizontal) {
                  // Horizontal Bar Render
                  const catCenterY = margins.top + bandPos + bandWidth / 2;
                  const catY = margins.top + bandPos;

                  return (
                    <g
                      key={catIndex}
                      role="graphics-symbol"
                      aria-label={`${d._category}: ${normalizedSeries.map(s => `${s.label} ${d[s.key]}`).join(', ')}`}
                      tabIndex={-1}
                      onMouseEnter={() => setHoveredPoint({ data: d, index: catIndex })}
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() => onSelect && onSelect(d)}
                      style={{ cursor: onSelect ? 'pointer' : 'default' }}
                    >
                      <text
                        x={margins.left - 10}
                        y={catCenterY + 3.5}
                        textAnchor="end"
                        fontSize="11"
                        fontFamily="var(--font-sans)"
                        fontWeight={isHovered || isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)'}
                        fill={isHovered || isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'}
                      >
                        {d._category}
                      </text>

                      {isGrouped ? (
                        normalizedSeries.map((s, sIdx) => {
                          const subH = bandWidth / normalizedSeries.length;
                          const barY = catY + sIdx * subH;
                          const rawVal = Number(d[s.key]) || 0;
                          const barPos = quantitativeScale(rawVal);
                          const startX = margins.left + Math.min(baselinePos, barPos);
                          const barW = Math.abs(barPos - baselinePos);
                          const isDimmed = activeSeries && activeSeries !== s.key;

                          return (
                            <rect
                              key={s.key}
                              x={startX}
                              y={barY}
                              width={Math.max(2, barW)}
                              height={Math.max(2, subH - 2)}
                              rx="2"
                              fill={s.color}
                              opacity={isDimmed ? 0.25 : (isHovered ? 0.95 : 0.85)}
                              stroke={isFocused && focusedSeriesIndex === sIdx ? 'var(--action-solid)' : (isSelected ? 'var(--text-primary)' : 'none')}
                              strokeWidth={isSelected || isFocused ? 2 : 0}
                            />
                          );
                        })
                      ) : isStacked ? (
                        normalizedSeries.map(s => {
                          const stack = d._stackOffsets[s.key];
                          if (!stack || stack.val === 0) return null;
                          const startX = margins.left + quantitativeScale(stack.start);
                          const endX = margins.left + quantitativeScale(stack.end);
                          const barW = Math.abs(endX - startX);
                          const x = Math.min(startX, endX);

                          return (
                            <rect key={s.key} x={x} y={catY} width={Math.max(1, barW)} height={bandWidth} fill={s.color} opacity={isHovered ? 0.95 : 0.85} />
                          );
                        })
                      ) : (
                        (() => {
                          const rawVal = Number(d[valueKey]) || 0;
                          const barPos = quantitativeScale(rawVal);
                          const startX = margins.left + Math.min(baselinePos, barPos);
                          const barW = Math.abs(barPos - baselinePos);
                          const barColor = isDiverging
                            ? (rawVal >= 0 ? VIZ_SEMANTIC_COLORS.success : VIZ_SEMANTIC_COLORS.critical)
                            : normalizedSeries[0].color;

                          return (
                            <g>
                              <rect
                                x={startX}
                                y={catY}
                                width={Math.max(2, barW)}
                                height={bandWidth}
                                rx="2"
                                fill={barColor}
                                opacity={isHovered ? 0.95 : 0.85}
                                stroke={isFocused ? 'var(--action-solid)' : (isSelected ? 'var(--text-primary)' : 'none')}
                                strokeWidth={isSelected || isFocused ? 2 : 0}
                              />
                              {showValues && (
                                <text x={startX + barW + 6} y={catCenterY + 3.5} fontSize="10" fontFamily="var(--font-mono)" fill="var(--text-secondary)">
                                  {formatVizValue(rawVal, unit)}
                                </text>
                              )}
                            </g>
                          );
                        })()
                      )}
                    </g>
                  );
                }

                // Vertical Bar Render
                const catCenterX = margins.left + bandPos + bandWidth / 2;
                const catX = margins.left + bandPos;

                return (
                  <g
                    key={catIndex}
                    role="graphics-symbol"
                    aria-label={`${d._category}: ${normalizedSeries.map(s => `${s.label} ${d[s.key]}`).join(', ')}`}
                    tabIndex={-1}
                    onMouseEnter={() => setHoveredPoint({ data: d, index: catIndex })}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() => onSelect && onSelect(d)}
                    style={{ cursor: onSelect ? 'pointer' : 'default' }}
                  >
                    <text
                      x={catCenterX}
                      y={margins.top + plotRegion.plotHeight + 16}
                      textAnchor="middle"
                      fontSize="11"
                      fontFamily="var(--font-sans)"
                      fontWeight={isHovered || isSelected ? 'var(--weight-semibold)' : 'var(--weight-regular)'}
                      fill={isHovered || isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'}
                    >
                      {d._category}
                    </text>

                    {isGrouped ? (
                      normalizedSeries.map((s, sIdx) => {
                        const subW = bandWidth / normalizedSeries.length;
                        const barX = catX + sIdx * subW;
                        const rawVal = Number(d[s.key]) || 0;
                        const barPos = quantitativeScale(rawVal);
                        const startY = margins.top + Math.min(baselinePos, barPos);
                        const barH = Math.abs(barPos - baselinePos);
                        const isDimmed = activeSeries && activeSeries !== s.key;

                        return (
                          <rect
                            key={s.key}
                            x={barX}
                            y={startY}
                            width={Math.max(2, subW - 2)}
                            height={Math.max(2, barH)}
                            rx="2"
                            fill={s.color}
                            opacity={isDimmed ? 0.25 : (isHovered ? 0.95 : 0.85)}
                            stroke={isFocused && focusedSeriesIndex === sIdx ? 'var(--action-solid)' : (isSelected ? 'var(--text-primary)' : 'none')}
                            strokeWidth={isSelected || isFocused ? 2 : 0}
                          />
                        );
                      })
                    ) : isStacked ? (
                      normalizedSeries.map(s => {
                        const stack = d._stackOffsets[s.key];
                        if (!stack || stack.val === 0) return null;
                        const startY = margins.top + quantitativeScale(stack.start);
                        const endY = margins.top + quantitativeScale(stack.end);
                        const barH = Math.abs(startY - endY);
                        const y = Math.min(startY, endY);

                        return (
                          <rect key={s.key} x={catX} y={y} width={bandWidth} height={Math.max(1, barH)} fill={s.color} opacity={isHovered ? 0.95 : 0.85} />
                        );
                      })
                    ) : isNormalized ? (
                      normalizedSeries.map(s => {
                        const pctInfo = d._percentages[s.key];
                        if (!pctInfo || pctInfo.pct === 0) return null;
                        const startY = margins.top + quantitativeScale(pctInfo.startPct);
                        const endY = margins.top + quantitativeScale(pctInfo.endPct);
                        const barH = Math.abs(startY - endY);
                        const y = Math.min(startY, endY);

                        return (
                          <rect key={s.key} x={catX} y={y} width={bandWidth} height={Math.max(1, barH)} fill={s.color} opacity={isHovered ? 0.95 : 0.85} />
                        );
                      })
                    ) : isFloating ? (
                      (() => {
                        const startY = margins.top + quantitativeScale(d._start);
                        const endY = margins.top + quantitativeScale(d._end);
                        const barH = Math.abs(startY - endY);
                        const y = Math.min(startY, endY);

                        return (
                          <rect
                            x={catX}
                            y={y}
                            width={bandWidth}
                            height={Math.max(2, barH)}
                            rx="2"
                            fill={normalizedSeries[0].color}
                            opacity={isHovered ? 0.95 : 0.85}
                            stroke={isFocused ? 'var(--action-solid)' : (isSelected ? 'var(--text-primary)' : 'none')}
                            strokeWidth={isSelected || isFocused ? 2 : 0}
                          />
                        );
                      })()
                    ) : (
                      (() => {
                        const rawVal = Number(d[valueKey]) || 0;
                        const barPos = quantitativeScale(rawVal);
                        const startY = margins.top + Math.min(baselinePos, barPos);
                        const barH = Math.abs(barPos - baselinePos);

                        return (
                          <g>
                            <rect
                              x={catX}
                              y={startY}
                              width={bandWidth}
                              height={Math.max(2, barH)}
                              rx="2"
                              fill={normalizedSeries[0].color}
                              opacity={isHovered ? 0.95 : 0.85}
                              stroke={isFocused ? 'var(--action-solid)' : (isSelected ? 'var(--text-primary)' : 'none')}
                              strokeWidth={isSelected || isFocused ? 2 : 0}
                            />
                            {showValues && (
                              <text x={catCenterX} y={startY - 6} textAnchor="middle" fontSize="10" fontFamily="var(--font-mono)" fill="var(--text-secondary)">
                                {formatVizValue(rawVal, unit)}
                              </text>
                            )}
                          </g>
                        );
                      })()
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Layer 5: Floating Inspection Tooltip */}
          {showTooltip && hoveredPoint && (
            <div
              className="mer-barchart-tooltip"
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
                minWidth: 140,
                lineHeight: 1.4
              }}
            >
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 4, marginBottom: 4 }}>
                {hoveredPoint.data._category}
              </div>
              {normalizedSeries.map(s => {
                const val = hoveredPoint.data[s.key];
                return (
                  <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 2 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                      {s.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-medium)', color: 'var(--text-primary)' }}>
                      {formatVizValue(val, isNormalized ? '%' : unit)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Legend for Multi-Series */}
      {showLegend && normalizedSeries.length > 1 && !isTableView && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 12, paddingTop: 8, borderTop: 'var(--border-subtle)' }}>
          {normalizedSeries.map(s => {
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
                <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
