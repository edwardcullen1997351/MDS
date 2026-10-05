/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- keyboard-operated visualization surface; interactive controls retain native semantics */
import React,{ useId,useMemo,useRef,useState } from 'react';
import { ChartDataTable } from '../ChartDataTable/ChartDataTable.js';
import {
LAYER_STACK,
PATTERN_PRESETS,
VIZ_COLORS,
VIZ_SEMANTIC_COLORS,
createBandScale,
createKeyboardRovingFocus,
createLinearScale,
createPlotRegion,
formatVizValue,
generateTicks,
useResponsiveVizBounds
} from '../../utils/viz-core.js';

export type BarChartVariant =
  | 'vertical'
  | 'horizontal'
  | 'grouped'
  | 'stacked'
  | 'normalized'
  | 'diverging'
  | 'floating';

export interface BarSeriesConfig {
  key: string;
  label: string;
  color?: string;
  pattern?: string;
}

export interface ReferenceLineConfig {
  value: number;
  label?: string;
  tone?: 'neutral' | 'danger' | 'warning' | 'success' | 'brand';
  strokeStyle?: 'dashed' | 'solid';
  position?: 'start' | 'center' | 'end';
}

export interface ThresholdBandConfig {
  min: number;
  max: number;
  label?: string;
  tone?: 'critical' | 'warning' | 'neutral';
}

export interface BarChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onSelect'> {
  data: any[];
  categoryKey?: string;
  valueKey?: string;
  series?: (string | BarSeriesConfig)[] | null;
  variant?: BarChartVariant;
  orientation?: 'vertical' | 'horizontal' | null;
  title?: string;
  caption?: string;
  description?: string;
  unit?: string;
  valueFormatter?: ((val: number, item?: any) => string) | null;
  referenceLines?: ReferenceLineConfig[];
  thresholdBands?: ThresholdBandConfig[];
  baseline?: number;
  domain?: [number, number] | null;
  selectedKey?: string | number | null;
  onSelect?: ((item: any, seriesKey?: string) => void) | null;
  showGrid?: boolean;
  showValues?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showDataTable?: boolean;
  enablePatterns?: boolean;
  loading?: boolean;
  emptyText?: string;
  height?: number | string;
  width?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * BarChart — compares quantitative magnitude across discrete categories.
 * Strict zero-baseline proportional truth, multi-channel accessibility,
 * keyboard roving tabindex traversal, WAI-ARIA graphics semantics, and tabular fallback.
 */
export const BarChart: React.FC<BarChartProps> = ({
  data = [],
  categoryKey = 'label',
  valueKey = 'value',
  series = null,
  variant = 'vertical',
  orientation = null,
  title = '',
  caption = '',
  description = '',
  unit = '',
  valueFormatter = null,
  referenceLines = [],
  thresholdBands = [],
  baseline = 0,
  domain = null,
  selectedKey = null,
  onSelect = null,
  showGrid = true,
  showValues = false,
  showLegend = true,
  showTooltip = true,
  showDataTable = true,
  enablePatterns = true,
  loading = false,
  emptyText = 'No data available for this selection',
  height = 280,
  width = '100%',
  className = '',
  style = {},
  ...rest
}) => {
  const chartId = useId().replace(/:/g, '-');
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: measuredWidth, height: measuredHeight, densityTier } = useResponsiveVizBounds(containerRef, typeof width === 'number' ? width : 600, typeof height === 'number' ? height : 280);

  const plotWidth = Math.max(280, measuredWidth || (typeof width === 'number' ? width : 600));
  const plotHeight = Math.max(180, measuredHeight || (typeof height === 'number' ? height : 280));

  const [hoveredPoint, setHoveredPoint] = useState<any>(null);
  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [focusedSeriesIndex, _setFocusedSeriesIndex] = useState(0);

  const isHorizontal = orientation === 'horizontal' || variant === 'horizontal' || variant === 'diverging';
  const isGrouped = variant === 'grouped';
  const isStacked = variant === 'stacked';
  const isNormalized = variant === 'normalized';
  const isDiverging = variant === 'diverging';
  const isFloating = variant === 'floating';

  // Determine series list with colors and accessible hatching patterns
  const normalizedSeries = useMemo(() => {
    if (series && Array.isArray(series) && series.length > 0) {
      return series.map((s, idx) => {
        const key = typeof s === 'string' ? s : s.key;
        const label = typeof s === 'string' ? s : (s.label || s.key);
        const color = (typeof s === 'object' && s.color) ? s.color : VIZ_COLORS[idx % VIZ_COLORS.length];
        const pattern = typeof s === 'object' ? s.pattern : undefined;
        const patternId = pattern ? `${chartId}-${pattern}` : `${chartId}-${PATTERN_PRESETS[idx % PATTERN_PRESETS.length].id}`;
        return { key, label, color, patternId };
      });
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
        const percentages: Record<string, any> = {};
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
        const stackOffsets: Record<string, any> = {};
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

  // Plot Region layout & margins with dynamic quantitative label padding
  const margins = useMemo(() => {
    const isMobile = densityTier === 'compact';
    if (isHorizontal) {
      const maxCatLen = processedData.reduce((max, d) => Math.max(max, String(d._category).length), 0);
      const leftPad = isMobile ? Math.min(110, Math.max(52, maxCatLen * 6.5 + 12)) : Math.min(160, Math.max(72, maxCatLen * 8 + 18));
      return { top: 16, right: isMobile ? 16 : 28, bottom: isMobile ? 32 : 38, left: leftPad };
    }
    // Vertical mode: dynamically calculate left margin from maximum formatted tick string length
    const sampleMaxFormatted = formatVizValue(computedMax, isNormalized ? '%' : unit);
    const sampleMinFormatted = formatVizValue(computedMin, isNormalized ? '%' : unit);
    const maxValLen = Math.max(String(sampleMaxFormatted).length, String(sampleMinFormatted).length);
    const dynamicLeft = Math.min(130, Math.max(isMobile ? 54 : 64, maxValLen * 7.5 + 20));

    // Bottom margin in vertical mode: accommodate rotated category labels if categories are dense
    const estBandWidth = (plotWidth - dynamicLeft - 24) / Math.max(1, processedData.length);
    const needsRotation = estBandWidth < 38;
    const maxCatLen = processedData.reduce((max, d) => Math.max(max, String(d._category).length), 0);
    const dynamicBottom = needsRotation ? Math.min(76, Math.max(48, maxCatLen * 5.5 + 18)) : (isMobile ? 36 : 44);

    return { top: 16, right: 16, bottom: dynamicBottom, left: dynamicLeft };
  }, [isHorizontal, processedData, densityTier, computedMax, computedMin, isNormalized, unit, plotWidth]);

  const plotRegion = useMemo(() => {
    return createPlotRegion({
      containerWidth: plotWidth,
      containerHeight: plotHeight,
      margins
    });
  }, [plotWidth, plotHeight, margins]);

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
    const categories = processedData.map(d => String(d._category));
    return createBandScale({
      domain: categories,
      range: isHorizontal ? [0, plotRegion.plotHeight] : [0, plotRegion.plotWidth],
      paddingInner: 0.24,
      paddingOuter: 0.12
    });
  }, [processedData, isHorizontal, plotRegion]);

  const baselinePos = quantitativeScale(baseline) ?? 0;

  const tickCount = useMemo(() => {
    if (isHorizontal) {
      return plotRegion.plotWidth < 260 ? 3 : plotRegion.plotWidth < 400 ? 4 : 5;
    }
    return plotRegion.plotHeight < 200 ? 3 : 4;
  }, [isHorizontal, plotRegion.plotWidth, plotRegion.plotHeight]);

  const ticks = useMemo(() => generateTicks(quantitativeScale, tickCount), [quantitativeScale, tickCount]);

  const formatXTick = (tickVal: number, idx: number, total: number) => {
    if (isNormalized) return `${Number(tickVal).toFixed(0)}%`;
    if (valueFormatter) return valueFormatter(tickVal);
    if (!unit) return formatVizValue(tickVal, '', 'en-IN');
    // In compact widgets or narrow widths, show unit only on the maximum tick to prevent collision
    if (plotRegion.plotWidth < 360) {
      return idx === total - 1 ? `${tickVal}${unit}` : String(tickVal);
    }
    return `${tickVal}${unit}`;
  };

  const formatYTick = (tickVal: number) => {
    if (isNormalized) return `${Number(tickVal).toFixed(0)}%`;
    if (valueFormatter) return valueFormatter(tickVal);
    return formatVizValue(tickVal, unit, 'en-IN');
  };

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
      }
    });
  }, [processedData, focusedIndex, normalizedSeries, focusedSeriesIndex, onSelect]);

  // Skeleton Loading View
  if (loading) {
    return (
      <div
        ref={containerRef}
        className={`mer-barchart-container mer-barchart-loading ${className}`}
        style={{ width, height, position: 'relative', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', maxWidth: '100%', ...style }}
        aria-busy="true"
        aria-label="Loading bar chart data..."
        {...rest}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ width: 140, height: 16, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-xs)', animation: 'mer-skeleton-sweep 1.4s ease-in-out infinite' }} />
          <div style={{ width: 60, height: 14, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-xs)' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 16, padding: 'var(--space-4) 0', borderBottom: 'var(--border-hairline)' }}>
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
          boxSizing: 'border-box',
          maxWidth: '100%',
          textAlign: 'center',
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
    <>
    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- chart application region supports keyboard inspection */}
    <div
      ref={containerRef}
      className={`mer-barchart-root ${className}`}
      style={{
        width,
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-primary)',
        position: 'relative',
        boxSizing: 'border-box',
        maxWidth: '100%',
        ...style
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label={`${caption || title || 'Bar chart data visualization'} (${chartId})`}
      {...rest}
    >
      {/* Header */}
      {(title || caption) && (
        <div style={{ marginBottom: 8 }}>
          {title && <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>{title}</div>}
          {caption && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{caption}</div>}
        </div>
      )}

      {/* SVG Graphical Bar Chart Canvas */}
      <div style={{ position: 'relative', width: '100%', height: plotHeight }}>
          <svg
            width="100%"
            height={plotHeight}
            viewBox={`0 0 ${plotWidth} ${plotHeight}`}
            role="graphics-document"
            aria-roledescription="bar chart"
            aria-labelledby={`${chartId}-title ${chartId}-desc`}
            style={{ overflow: 'visible' }}
          >
            <title id={`${chartId}-title`}>{title || 'Bar chart'}</title>
            <desc id={`${chartId}-desc`}>{description || `${title || 'Bar chart'} comparing ${processedData.length} categories.`}</desc>
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
                const startPos = quantitativeScale(tb.min) ?? 0;
                const endPos = quantitativeScale(tb.max) ?? 0;
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

            {/* Layer 1: Background Gridlines */}
            {showGrid && (
              <g className="layer-gridlines">
                {ticks.map((tickVal: any, i: number) => {
                  const pos = quantitativeScale(tickVal) ?? 0;
                  if (isHorizontal) {
                    const x = margins.left + pos;
                    return (
                      <line
                        key={i}
                        x1={x}
                        y1={margins.top}
                        x2={x}
                        y2={margins.top + plotRegion.plotHeight}
                        stroke="var(--border-subtle, rgba(0,0,0,0.06))"
                        strokeDasharray={tickVal === baseline ? 'none' : '3 3'}
                        strokeWidth={tickVal === baseline ? '1.5' : '1'}
                      />
                    );
                  }
                  const y = margins.top + pos;
                  return (
                    <line
                      key={i}
                      x1={margins.left}
                      y1={y}
                      x2={margins.left + plotRegion.plotWidth}
                      y2={y}
                      stroke="var(--border-subtle, rgba(0,0,0,0.06))"
                      strokeDasharray={tickVal === baseline ? 'none' : '3 3'}
                      strokeWidth={tickVal === baseline ? '1.5' : '1'}
                    />
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
                stroke="var(--border-strong)"
                strokeWidth="1.5"
              />
            )}

            {/* Layer 2: Bar Marks */}
            <g className="layer-bar-marks">
              {processedData.map((d, catIndex) => {
                const isSelected = selectedKey != null && d[categoryKey] === selectedKey;
                const isFocused = focusedIndex === catIndex;
                const isHovered = hoveredPoint?.index === catIndex;
                const bandPos = categoricalScale(String(d._category)) ?? 0;
                const bandWidth = categoricalScale.bandwidth();

                if (isHorizontal) {
                  const catCenterY = margins.top + bandPos + bandWidth / 2;
                  const catY = margins.top + bandPos;

                  return (
                    <g
                      key={catIndex}
                      role="graphics-symbol"
                      aria-label={`${d._category}: ${normalizedSeries.map(s => `${s.label} ${d[s.key]}`).join(', ')}`}
                      onMouseEnter={() => setHoveredPoint({ data: d, index: catIndex })}
                      onMouseLeave={() => setHoveredPoint(null)}
                      onClick={() => onSelect && onSelect(d)}
                      style={{ cursor: onSelect ? 'pointer' : 'default', outline: 'none' }}
                    >
                      {isGrouped ? (
                        normalizedSeries.map((s, sIdx) => {
                          const subH = bandWidth / normalizedSeries.length;
                          const barY = catY + sIdx * subH;
                          const rawVal = Number(d[s.key]) || 0;
                          const barPos = quantitativeScale(rawVal) ?? 0;
                          const startX = margins.left + Math.min(baselinePos, barPos);
                          const barW = Math.abs(barPos - baselinePos);
                          const isDimmed = activeSeries && activeSeries !== s.key;

                          return (
                            <g key={s.key}>
                              <rect
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
                              {enablePatterns && (
                                <rect
                                  x={startX}
                                  y={barY}
                                  width={Math.max(2, barW)}
                                  height={Math.max(2, subH - 2)}
                                  rx="2"
                                  fill={`url(#${s.patternId})`}
                                  opacity={0.55}
                                  pointerEvents="none"
                                />
                              )}
                            </g>
                          );
                        })
                      ) : isStacked ? (
                        normalizedSeries.map(s => {
                          const stack = d._stackOffsets[s.key];
                          if (!stack || stack.val === 0) return null;
                          const startX = margins.left + (quantitativeScale(stack.start) ?? 0);
                          const endX = margins.left + (quantitativeScale(stack.end) ?? 0);
                          const barW = Math.abs(endX - startX);
                          const x = Math.min(startX, endX);

                          return (
                            <g key={s.key}>
                              <rect x={x} y={catY} width={Math.max(1, barW)} height={bandWidth} fill={s.color} opacity={isHovered ? 0.95 : 0.85} />
                              {enablePatterns && (
                                <rect x={x} y={catY} width={Math.max(1, barW)} height={bandWidth} fill={`url(#${s.patternId})`} opacity={0.55} pointerEvents="none" />
                              )}
                            </g>
                          );
                        })
                      ) : (
                        (() => {
                          const rawVal = Number(d[valueKey]) || 0;
                          const barPos = quantitativeScale(rawVal) ?? 0;
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
                              {enablePatterns && (
                                <rect
                                  x={startX}
                                  y={catY}
                                  width={Math.max(2, barW)}
                                  height={bandWidth}
                                  rx="2"
                                  fill={`url(#${normalizedSeries[0].patternId})`}
                                  opacity={0.55}
                                  pointerEvents="none"
                                />
                              )}
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

                const catCenterX = margins.left + bandPos + bandWidth / 2;
                const catX = margins.left + bandPos;

                return (
                  <g
                    key={catIndex}
                    role="graphics-symbol"
                    aria-label={`${d._category}: ${normalizedSeries.map(s => `${s.label} ${d[s.key]}`).join(', ')}`}
                    onMouseEnter={() => setHoveredPoint({ data: d, index: catIndex })}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() => onSelect && onSelect(d)}
                    style={{ cursor: onSelect ? 'pointer' : 'default', outline: 'none' }}
                  >
                    {isGrouped ? (
                      normalizedSeries.map((s, sIdx) => {
                        const subW = bandWidth / normalizedSeries.length;
                        const barX = catX + sIdx * subW;
                        const rawVal = Number(d[s.key]) || 0;
                        const barPos = quantitativeScale(rawVal) ?? 0;
                        const startY = margins.top + Math.min(baselinePos, barPos);
                        const barH = Math.abs(barPos - baselinePos);
                        const isDimmed = activeSeries && activeSeries !== s.key;

                        return (
                          <g key={s.key}>
                            <rect
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
                            {enablePatterns && (
                              <rect
                                x={barX}
                                y={startY}
                                width={Math.max(2, subW - 2)}
                                height={Math.max(2, barH)}
                                rx="2"
                                fill={`url(#${s.patternId})`}
                                opacity={0.55}
                                pointerEvents="none"
                              />
                            )}
                          </g>
                        );
                      })
                    ) : isStacked ? (
                      normalizedSeries.map(s => {
                        const stack = d._stackOffsets[s.key];
                        if (!stack || stack.val === 0) return null;
                        const startY = margins.top + (quantitativeScale(stack.start) ?? 0);
                        const endY = margins.top + (quantitativeScale(stack.end) ?? 0);
                        const barH = Math.abs(startY - endY);
                        const y = Math.min(startY, endY);

                        return (
                          <g key={s.key}>
                            <rect x={catX} y={y} width={bandWidth} height={Math.max(1, barH)} fill={s.color} opacity={isHovered ? 0.95 : 0.85} />
                            {enablePatterns && (
                              <rect x={catX} y={y} width={bandWidth} height={Math.max(1, barH)} fill={`url(#${s.patternId})`} opacity={0.55} pointerEvents="none" />
                            )}
                          </g>
                        );
                      })
                    ) : isNormalized ? (
                      normalizedSeries.map(s => {
                        const pctInfo = d._percentages[s.key];
                        if (!pctInfo || pctInfo.pct === 0) return null;
                        const startY = margins.top + (quantitativeScale(pctInfo.startPct) ?? 0);
                        const endY = margins.top + (quantitativeScale(pctInfo.endPct) ?? 0);
                        const barH = Math.abs(startY - endY);
                        const y = Math.min(startY, endY);

                        return (
                          <g key={s.key}>
                            <rect x={catX} y={y} width={bandWidth} height={Math.max(1, barH)} fill={s.color} opacity={isHovered ? 0.95 : 0.85} />
                            {enablePatterns && (
                              <rect x={catX} y={y} width={bandWidth} height={Math.max(1, barH)} fill={`url(#${s.patternId})`} opacity={0.55} pointerEvents="none" />
                            )}
                          </g>
                        );
                      })
                    ) : isFloating ? (
                      (() => {
                        const startY = margins.top + (quantitativeScale(d._start) ?? 0);
                        const endY = margins.top + (quantitativeScale(d._end) ?? 0);
                        const barH = Math.abs(startY - endY);
                        const y = Math.min(startY, endY);

                        return (
                          <g>
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
                            {enablePatterns && (
                              <rect
                                x={catX}
                                y={y}
                                width={bandWidth}
                                height={Math.max(2, barH)}
                                rx="2"
                                fill={`url(#${normalizedSeries[0].patternId})`}
                                opacity={0.55}
                                pointerEvents="none"
                              />
                            )}
                          </g>
                        );
                      })()
                    ) : (
                      (() => {
                        const rawVal = Number(d[valueKey]) || 0;
                        const barPos = quantitativeScale(rawVal) ?? 0;
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
                            {enablePatterns && (
                              <rect
                                x={catX}
                                y={startY}
                                width={bandWidth}
                                height={Math.max(2, barH)}
                                rx="2"
                                fill={`url(#${normalizedSeries[0].patternId})`}
                                opacity={0.55}
                                pointerEvents="none"
                              />
                            )}
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

            {/* Layer 4: Reference Target Lines & Annotations (Rendered on top of bars) */}
            <g className="layer-reference-lines">
              {referenceLines.map((rl, idx) => {
                const pos = quantitativeScale(rl.value) ?? 0;
                const color =
                  rl.tone === 'danger'
                    ? VIZ_SEMANTIC_COLORS.critical
                    : rl.tone === 'warning'
                    ? VIZ_SEMANTIC_COLORS.warning
                    : rl.tone === 'success'
                    ? VIZ_SEMANTIC_COLORS.success
                    : rl.tone === 'brand'
                    ? 'var(--action-solid)'
                    : VIZ_SEMANTIC_COLORS.info;
                const strokeDash = rl.strokeStyle === 'solid' ? 'none' : '4 3';
                const posMode = rl.position || (isHorizontal ? 'center' : 'end');
                const labelText = rl.label
                  ? rl.label.includes(String(rl.value))
                    ? rl.label
                    : `${rl.label} (${formatVizValue(rl.value, unit)})`
                  : formatVizValue(rl.value, unit);

                if (isHorizontal) {
                  const x = margins.left + pos;
                  const labelY =
                    posMode === 'start'
                      ? margins.top + 14
                      : posMode === 'end'
                      ? margins.top + plotRegion.plotHeight - 6
                      : margins.top - 6;

                  return (
                    <g key={`rl-${idx}`} className="mer-barchart-ref-line-group">
                      <line
                        x1={x}
                        y1={margins.top}
                        x2={x}
                        y2={margins.top + plotRegion.plotHeight}
                        stroke={color}
                        strokeDasharray={strokeDash}
                        strokeWidth="1.5"
                      />
                      <text
                        x={x}
                        y={labelY}
                        textAnchor="middle"
                        fontSize="10"
                        fontFamily="var(--font-mono)"
                        fill={color}
                        stroke="var(--surface-card)"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        paintOrder="stroke fill"
                        fontWeight="600"
                        className="mer-barchart-ref-label"
                      >
                        {labelText}
                      </text>
                    </g>
                  );
                }

                const y = margins.top + pos;
                const labelX =
                  posMode === 'start'
                    ? margins.left + 8
                    : posMode === 'center'
                    ? margins.left + plotRegion.plotWidth / 2
                    : margins.left + plotRegion.plotWidth - 8;
                const textAnchor = posMode === 'start' ? 'start' : posMode === 'center' ? 'middle' : 'end';

                return (
                  <g key={`rl-${idx}`} className="mer-barchart-ref-line-group">
                    <line
                      x1={margins.left}
                      y1={y}
                      x2={margins.left + plotRegion.plotWidth}
                      y2={y}
                      stroke={color}
                      strokeDasharray={strokeDash}
                      strokeWidth="1.5"
                    />
                    <text
                      x={labelX}
                      y={y - 5}
                      textAnchor={textAnchor}
                      fontSize="10"
                      fontFamily="var(--font-mono)"
                      fill={color}
                      stroke="var(--surface-card)"
                      strokeWidth="3"
                      strokeLinejoin="round"
                      paintOrder="stroke fill"
                      fontWeight="600"
                      className="mer-barchart-ref-label"
                    >
                      {labelText}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Layer 5: Visible Solid X and Y Axes with Tick Notches */}
            <g className="mer-barchart-axis mer-barchart-axis--x">
              {/* Continuous X-Axis Domain Line */}
              <line
                x1={margins.left}
                y1={margins.top + plotRegion.plotHeight}
                x2={margins.left + plotRegion.plotWidth}
                y2={margins.top + plotRegion.plotHeight}
                stroke="var(--border-strong)"
                strokeWidth="1.5"
              />
              {isHorizontal ? (
                ticks.map((tickVal: any, i: number) => {
                  const pos = quantitativeScale(tickVal) ?? 0;
                  const x = margins.left + pos;
                  return (
                    <g key={`xtick-${i}`} className="mer-barchart-tick">
                      <line
                        x1={x}
                        y1={margins.top + plotRegion.plotHeight}
                        x2={x}
                        y2={margins.top + plotRegion.plotHeight + 5}
                        stroke="var(--border-strong)"
                        strokeWidth="1"
                      />
                      <text
                        x={x}
                        y={margins.top + plotRegion.plotHeight + 18}
                        textAnchor="middle"
                        fontSize="10"
                        fontFamily="var(--font-mono, monospace)"
                        fill="var(--text-tertiary)"
                      >
                        {formatXTick(tickVal, i, ticks.length)}
                      </text>
                    </g>
                  );
                })
              ) : (
                processedData.map((d, catIndex) => {
                  const bandPos = categoricalScale(String(d._category)) ?? 0;
                  const bandWidth = categoricalScale.bandwidth();
                  const catCenterX = margins.left + bandPos + bandWidth / 2;
                  const isRotated = bandWidth < 38;
                  const isHovered = hoveredPoint?.index === catIndex;
                  const isSelected = selectedKey != null && d[categoryKey] === selectedKey;

                  return (
                    <g key={`cat-${catIndex}`} className="mer-barchart-tick">
                      <line
                        x1={catCenterX}
                        y1={margins.top + plotRegion.plotHeight}
                        x2={catCenterX}
                        y2={margins.top + plotRegion.plotHeight + 5}
                        stroke="var(--border-strong)"
                        strokeWidth="1"
                      />
                      <text
                        x={catCenterX}
                        y={margins.top + plotRegion.plotHeight + (isRotated ? 14 : 18)}
                        textAnchor={isRotated ? 'end' : 'middle'}
                        transform={isRotated ? `rotate(-35, ${catCenterX}, ${margins.top + plotRegion.plotHeight + 14})` : undefined}
                        fontSize="10.5"
                        fontFamily="var(--font-sans, system-ui, sans-serif)"
                        fontWeight={isHovered || isSelected ? '600' : '500'}
                        fill={isHovered || isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'}
                      >
                        {d._category}
                      </text>
                    </g>
                  );
                })
              )}
            </g>

            <g className="mer-barchart-axis mer-barchart-axis--y">
              {/* Continuous Y-Axis Domain Line */}
              <line
                x1={margins.left}
                y1={margins.top}
                x2={margins.left}
                y2={margins.top + plotRegion.plotHeight}
                stroke="var(--border-strong)"
                strokeWidth="1.5"
              />
              {isHorizontal ? (
                processedData.map((d, catIndex) => {
                  const bandPos = categoricalScale(String(d._category)) ?? 0;
                  const bandWidth = categoricalScale.bandwidth();
                  const catCenterY = margins.top + bandPos + bandWidth / 2;
                  const isHovered = hoveredPoint?.index === catIndex;
                  const isSelected = selectedKey != null && d[categoryKey] === selectedKey;

                  return (
                    <g key={`cat-y-${catIndex}`} className="mer-barchart-tick">
                      <line
                        x1={margins.left - 5}
                        y1={catCenterY}
                        x2={margins.left}
                        y2={catCenterY}
                        stroke="var(--border-strong)"
                        strokeWidth="1"
                      />
                      <text
                        x={margins.left - 8}
                        y={catCenterY + 3.5}
                        textAnchor="end"
                        fontSize="11"
                        fontFamily="var(--font-sans, system-ui, sans-serif)"
                        fontWeight={isHovered || isSelected ? '600' : '500'}
                        fill={isHovered || isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'}
                      >
                        {d._category}
                      </text>
                    </g>
                  );
                })
              ) : (
                ticks.map((tickVal: any, i: number) => {
                  const pos = quantitativeScale(tickVal) ?? 0;
                  const y = margins.top + pos;
                  return (
                    <g key={`ytick-${i}`} className="mer-barchart-tick">
                      <line
                        x1={margins.left - 5}
                        y1={y}
                        x2={margins.left}
                        y2={y}
                        stroke="var(--border-strong)"
                        strokeWidth="1"
                      />
                      <text
                        x={margins.left - 8}
                        y={y + 3.5}
                        textAnchor="end"
                        fontSize="10"
                        fontFamily="var(--font-mono, monospace)"
                        fill="var(--text-tertiary)"
                      >
                        {formatYTick(tickVal)}
                      </text>
                    </g>
                  );
                })
              )}
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
                background: 'var(--surface-card)',
                border: 'var(--border-hairline)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow-md)',
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-xs)',
                pointerEvents: 'none',
                zIndex: LAYER_STACK.TOOLTIP_AND_OVERLAYS,
                minWidth: 140,
                lineHeight: 1.4
              }}
            >
              <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', borderBottom: 'var(--border-hairline-subtle)', paddingBottom: 4, marginBottom: 4 }}>
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

      {/* Legend for Multi-Series */}
      {showLegend && normalizedSeries.length > 1 && (
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
                  padding: 'var(--space-half) var(--space-1)',
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
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <rect x="1" y="1" width="12" height="12" rx="2" fill={s.color} />
                  {enablePatterns && <rect x="1" y="1" width="12" height="12" rx="2" fill={`url(#${s.patternId})`} />}
                </svg>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Accessible Tabular Mirror */}
      {showDataTable && data && data.length > 0 && (
        <ChartDataTable>
          <div style={{ overflowX: 'auto', marginTop: 8 }}>
            <table
              className="ds-chart-table"
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: 'var(--text-xs)'
              }}
            >
              <caption style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>
                {title ? `${title} Data Table` : 'Bar Chart Data Table'}
              </caption>
              <thead>
                <tr style={{ borderBottom: 'var(--border-width-emphasis) solid var(--border-default)' }}>
                  <th scope="col" style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {categoryKey}
                  </th>
                  {normalizedSeries.map((s) => (
                    <th key={s.key} scope="col" style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {s.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: 'var(--border-hairline-subtle)' }}>
                    <th scope="row" style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {String(row[categoryKey] ?? idx + 1)}
                    </th>
                    {normalizedSeries.map((s) => {
                      const val = row[s.key];
                      return (
                        <td key={s.key} style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                          {val != null ? (valueFormatter ? valueFormatter(val, row) : formatVizValue(val, unit)) : '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartDataTable>
      )}
    </div>
    </>
  );
};
