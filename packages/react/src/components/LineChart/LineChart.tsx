/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- keyboard-operated visualization surface; interactive controls retain native semantics */
import React,{ useId,useMemo,useRef,useState } from 'react';
import { ChartDataTable } from '../ChartDataTable/ChartDataTable.js';
import {
LAYER_STACK,
POINT_SYMBOLS,
STROKE_DASH_PATTERNS,
VIZ_COLORS,
VIZ_SEMANTIC_COLORS,
createKeyboardRovingFocus,
createLinePath,
createLinearScale,
createPlotRegion,
formatVizValue,
generateTicks,
useResponsiveVizBounds
} from '../../utils/viz-core.js';

export type LineChartVariant =
  | 'single'
  | 'multi'
  | 'stepped'
  | 'indexed'
  | 'small-multiples';

export type LineInterpolation =
  | 'linear'
  | 'step'
  | 'step-after'
  | 'monotone'
  | 'smooth';

export type MissingValuePolicy = 'dashed' | 'gap' | 'zero';

export interface LineSeriesConfig {
  key: string;
  label: string;
  color?: string;
  strokeDash?: string;
  symbol?: 'circle' | 'square' | 'diamond' | 'triangle' | 'cross' | string;
}

export interface LineReferenceConfig {
  value: number;
  label?: string;
  tone?: 'neutral' | 'danger' | 'warning' | 'success' | 'brand';
  strokeStyle?: 'dashed' | 'solid';
}

export interface LineThresholdBandConfig {
  min: number;
  max: number;
  label?: string;
  tone?: 'critical' | 'warning' | 'neutral';
}

export interface LineChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onSelect'> {
  data: any[];
  xKey?: string;
  yKey?: string;
  series?: (string | LineSeriesConfig)[] | null;
  variant?: LineChartVariant;
  interpolation?: LineInterpolation;
  compareMode?: 'absolute' | 'indexed';
  pointVisibility?: 'always' | 'hover' | 'never' | 'endpoints';
  missingValuePolicy?: MissingValuePolicy;
  title?: string;
  caption?: string;
  description?: string;
  unit?: string;
  valueFormatter?: ((val: number, item?: any) => string) | null;
  referenceLines?: LineReferenceConfig[];
  thresholdBands?: LineThresholdBandConfig[];
  domain?: [number, number] | null;
  selectedKey?: string | number | null;
  onSelect?: ((item: any, seriesKey?: string) => void) | null;
  showGrid?: boolean;
  showCrosshair?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  showDataTable?: boolean;
  loading?: boolean;
  emptyText?: string;
  height?: number | string;
  width?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

function pointSymbol(symbol: string, color: string, radius: number, strokeWidth: number): React.ReactNode {
  const mark = { fill: 'var(--surface-card)', stroke: color, strokeWidth };
  if (symbol === 'square') return <rect x={-radius} y={-radius} width={radius * 2} height={radius * 2} {...mark} />;
  if (symbol === 'diamond') return <rect x={-radius * 0.8} y={-radius * 0.8} width={radius * 1.6} height={radius * 1.6} transform="rotate(45)" {...mark} />;
  if (symbol === 'triangle') return <polygon points={`0,${-radius} ${radius},${radius} ${-radius},${radius}`} {...mark} />;
  if (symbol === 'cross') return <path d={`M${-radius},${-radius} L${radius},${radius} M${radius},${-radius} L${-radius},${radius}`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />;
  if (symbol === 'star') {
    const points = Array.from({ length: 10 }, (_, index) => {
      const angle = -Math.PI / 2 + index * Math.PI / 5;
      const distance = index % 2 ? radius * 0.45 : radius;
      return `${Math.cos(angle) * distance},${Math.sin(angle) * distance}`;
    }).join(' ');
    return <polygon points={points} {...mark} />;
  }
  return <circle r={radius} {...mark} />;
}

/**
 * LineChart — shows change, trajectory, trend, and rate across an ordered (temporal) domain.
 * Interpolation math, multi-channel dash/glyph differentiation, explicit missing-data policies,
 * crosshair tracking, keyboard roving tabindex, and accessible tabular fallback.
 */
export const LineChart: React.FC<LineChartProps> = ({
  data = [],
  xKey = 'timestamp',
  yKey = 'value',
  series = null,
  variant = 'single',
  interpolation = 'linear',
  compareMode = 'absolute',
  pointVisibility = 'endpoints',
  missingValuePolicy = 'dashed',
  title = '',
  caption = '',
  description = '',
  unit = '',
  valueFormatter = null,
  referenceLines = [],
  thresholdBands = [],
  domain = null,
  selectedKey: _selectedKey = null,
  onSelect = null,
  showGrid = true,
  showCrosshair = true,
  showLegend = true,
  showTooltip = true,
  showDataTable = true,
  loading = false,
  emptyText = 'No trajectory data available for this range',
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

  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [focusedSeriesIndex] = useState(0);

  const isStepped = variant === 'stepped' || interpolation === 'step' || interpolation === 'step-after';
  const isIndexed = variant === 'indexed' || compareMode === 'indexed';

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

    const initialValues: Record<string, number> = {};
    if (isIndexed && data.length > 0) {
      normalizedSeries.forEach(s => {
        const firstValid = data.find(d => d[s.key] != null && !isNaN(Number(d[s.key])));
        initialValues[s.key] = firstValid ? Number(firstValid[s.key]) : 1;
      });
    }

    return data.map((item, idx) => {
      const xVal = item[xKey] != null ? item[xKey] : idx;
      const point: Record<string, any> = { ...item, _x: xVal, _raw: item };

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
  const margins = useMemo(() => {
    const isMobile = densityTier === 'compact';
    return {
      top: 20,
      right: isMobile ? 16 : 32,
      bottom: 36,
      left: isIndexed ? (isMobile ? 52 : 64) : (isMobile ? 44 : 54)
    };
  }, [isIndexed, densityTier]);

  const plotRegion = useMemo(() => {
    return createPlotRegion({
      containerWidth: plotWidth,
      containerHeight: plotHeight,
      margins
    });
  }, [plotWidth, plotHeight, margins]);

  // Quantitative Y Scale
  const yScale = useMemo(() => {
    return createLinearScale({
      domain: [computedMinY, computedMaxY],
      range: [plotRegion.plotHeight, 0]
    });
  }, [computedMinY, computedMaxY, plotRegion]);

  // X Coordinate calculation
  const getX = useMemo(() => {
    return (index: number) => {
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
      }
    });
  }, [processedData, focusedIndex, normalizedSeries, focusedSeriesIndex, onSelect]);

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
        <div style={{ flex: 1, position: 'relative', borderBottom: 'var(--border-hairline)' }}>
          <svg width="100%" height="100%" style={{ opacity: 0.4 }}>
            <path
              d={`M 20 ${plotHeight * 0.7} Q ${plotWidth * 0.3} ${plotHeight * 0.2}, ${plotWidth * 0.6} ${plotHeight * 0.5} T ${plotWidth - 20} ${plotHeight * 0.3}`}
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
      {(title || caption) && (
        <div style={{ marginBottom: 8 }}>
          {title && <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>{title}</div>}
          {caption && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{caption}</div>}
        </div>
      )}

      <div style={{ position: 'relative', width: '100%', height: plotHeight }}>
          <svg
            width="100%"
            height={plotHeight}
            viewBox={`0 0 ${plotWidth} ${plotHeight}`}
            role="graphics-document"
            aria-roledescription="line chart"
            aria-labelledby={`${chartId}-title ${chartId}-desc`}
            style={{ overflow: 'visible' }}
          >
            <title id={`${chartId}-title`}>{title || 'Line chart'}</title>
            <desc id={`${chartId}-desc`}>{description || `${title || 'Line chart'} tracking ${processedData.length} observations from ${processedData[0]?._x} to ${processedData[processedData.length - 1]?._x}.`}</desc>

            <g className="layer-threshold-bands">
              {thresholdBands.map((tb, i) => {
                const y1 = yScale(tb.min) ?? 0;
                const y2 = yScale(tb.max) ?? 0;
                const toneColor = tb.tone === 'critical'
                  ? 'var(--status-critical-soft, rgba(239,68,68,0.12))'
                  : tb.tone === 'warning'
                  ? 'var(--status-warning-soft, rgba(245,158,11,0.12))'
                  : 'var(--surface-sunken, rgba(148,163,184,0.12))';
                const y = Math.min(y1, y2) + margins.top;
                const h = Math.abs(y1 - y2);

                return (
                  <rect key={i} x={margins.left} y={y} width={plotRegion.plotWidth} height={h} fill={toneColor} opacity="0.6" rx={2} />
                );
              })}
            </g>

            {showGrid && (
              <g className="layer-gridlines">
                {yTicks.map((tickVal: any, i: number) => {
                  const y = margins.top + (yScale(tickVal) ?? 0);
                  return (
                    <line
                      key={`grid-${i}`}
                      x1={margins.left}
                      y1={y}
                      x2={margins.left + plotRegion.plotWidth}
                      y2={y}
                      stroke="var(--border-subtle, rgba(0,0,0,0.06))"
                      strokeDasharray={tickVal === 0 ? 'none' : '3 3'}
                      strokeWidth={tickVal === 0 ? '1.5' : '1'}
                    />
                  );
                })}
              </g>
            )}

            {/* Y-Axis Spine, Ticks and Numeric Labels */}
            <g className="layer-y-axis">
              <line
                x1={margins.left}
                y1={margins.top}
                x2={margins.left}
                y2={margins.top + plotRegion.plotHeight}
                stroke="var(--border-strong)"
                strokeWidth="1.5"
              />
              {yTicks.map((tickVal: any, i: number) => {
                const y = margins.top + (yScale(tickVal) ?? 0);
                return (
                  <g key={`y-tick-${i}`}>
                    <line
                      x1={margins.left - 5}
                      y1={y}
                      x2={margins.left}
                      y2={y}
                      stroke="var(--border-strong)"
                      strokeWidth="1.5"
                    />
                    <text
                      x={margins.left - 9}
                      y={y + 3.5}
                      textAnchor="end"
                      fontSize="10"
                      fontFamily="var(--font-mono, monospace)"
                      fill="var(--text-secondary)"
                      fontWeight="500"
                    >
                      {isIndexed ? `${tickVal >= 0 ? '+' : ''}${Number(tickVal).toFixed(0)}%` : formatVizValue(tickVal, unit)}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* X-Axis Baseline, Ticks and Labels */}
            <g className="layer-x-axis">
              <line
                x1={margins.left}
                y1={margins.top + plotRegion.plotHeight}
                x2={margins.left + plotRegion.plotWidth}
                y2={margins.top + plotRegion.plotHeight}
                stroke="var(--border-strong)"
                strokeWidth="1.5"
              />
              {processedData.map((d, i) => {
                const total = processedData.length;
                const step = total > 16 ? Math.ceil(total / 6) : (total > 8 ? 2 : 1);
                if (i % step !== 0 && i !== total - 1) return null;

                const x = margins.left + getX(i);
                return (
                  <g key={i}>
                    <line
                      x1={x}
                      y1={margins.top + plotRegion.plotHeight}
                      x2={x}
                      y2={margins.top + plotRegion.plotHeight + 5}
                      stroke="var(--border-strong)"
                      strokeWidth="1.5"
                    />
                    <text
                      x={x}
                      y={margins.top + plotRegion.plotHeight + 16}
                      textAnchor="middle"
                      fontSize="10"
                      fontFamily="var(--font-sans, sans-serif)"
                      fill={hoveredPointIndex === i ? 'var(--text-primary)' : 'var(--text-secondary)'}
                      fontWeight={hoveredPointIndex === i ? 'var(--weight-semibold)' : 'var(--weight-regular)'}
                    >
                      {d._x}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Reference Line Guides */}
            <g className="layer-reference-lines">
              {referenceLines.map((rl, idx) => {
                const y = margins.top + (yScale(rl.value) ?? 0);
                const color = rl.tone === 'danger' ? VIZ_SEMANTIC_COLORS.critical : rl.tone === 'warning' ? VIZ_SEMANTIC_COLORS.warning : VIZ_SEMANTIC_COLORS.info;
                return (
                  <line
                    key={`rl-${idx}`}
                    x1={margins.left}
                    y1={y}
                    x2={margins.left + plotRegion.plotWidth}
                    y2={y}
                    stroke={color}
                    strokeDasharray={rl.strokeStyle === 'solid' ? 'none' : '4 3'}
                    strokeWidth="1.5"
                  />
                );
              })}
            </g>

            <g className="layer-series-lines">
              {normalizedSeries.map((s, sIdx) => {
                const isDimmed = activeSeries && activeSeries !== s.key;

                const segments: Array<{ points: Array<{ x: number; y: number; val: number; index: number; raw: any }>; type: string }> = [];
                let currentSegment: Array<{ x: number; y: number; val: number; index: number; raw: any }> = [];

                processedData.forEach((d, i) => {
                  const val = d[`_val_${s.key}`];
                  const x = margins.left + getX(i);

                  if (val != null) {
                    const y = margins.top + (yScale(val) ?? 0);
                    currentSegment.push({ x, y, val, index: i, raw: d });
                  } else {
                    if (currentSegment.length > 0) {
                      segments.push({ points: currentSegment, type: 'valid' });
                      currentSegment = [];
                    }
                    if (missingValuePolicy === 'zero') {
                      const zeroY = margins.top + (yScale(0) ?? 0);
                      currentSegment.push({ x, y: zeroY, val: 0, index: i, raw: d });
                    }
                  }
                });

                if (currentSegment.length > 0) {
                  segments.push({ points: currentSegment, type: 'valid' });
                }

                return (
                  <g key={s.key} role="graphics-symbol" aria-label={s.label}>
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

                    {processedData.map((d, i) => {
                      const val = d[`_val_${s.key}`];
                      if (val == null) return null;

                      const x = margins.left + getX(i);
                      const y = margins.top + (yScale(val) ?? 0);
                      const isHovered = hoveredPointIndex === i;
                      const isFocused = focusedIndex === i && focusedSeriesIndex === sIdx;

                      const showPoint = pointVisibility === 'always' ||
                        isHovered ||
                        isFocused ||
                        (pointVisibility === 'endpoints' && (i === 0 || i === processedData.length - 1));

                      if (!showPoint) return null;

                      return (
                        <g key={i} transform={`translate(${x}, ${y})`}>
                          {pointSymbol(s.symbol, s.color, isHovered ? 5 : 3.5, isHovered ? 2.5 : 2)}
                        </g>
                      );
                    })}
                  </g>
                );
              })}
            </g>

            {/* Reference Line Labels Overlay with PaintOrder Halo */}
            <g className="layer-reference-labels" pointerEvents="none">
              {referenceLines.map((rl, idx) => {
                const y = margins.top + (yScale(rl.value) ?? 0);
                const color = rl.tone === 'danger' ? VIZ_SEMANTIC_COLORS.critical : rl.tone === 'warning' ? VIZ_SEMANTIC_COLORS.warning : VIZ_SEMANTIC_COLORS.info;
                return (
                  <text
                    key={`rl-lbl-${idx}`}
                    x={margins.left + plotRegion.plotWidth - 4}
                    y={y - 5}
                    textAnchor="end"
                    fontSize="10"
                    fontFamily="var(--font-mono, monospace)"
                    fill={color}
                    fontWeight="600"
                    stroke="var(--surface-card)"
                    strokeWidth="5"
                    paintOrder="stroke fill"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  >
                    {rl.label || formatVizValue(rl.value, isIndexed ? '%' : unit)}
                  </text>
                );
              })}
            </g>

            {showCrosshair && hoveredPointIndex != null && (
              <g className="layer-crosshair" pointerEvents="none">
                <line
                  x1={margins.left + getX(hoveredPointIndex)}
                  y1={margins.top}
                  x2={margins.left + getX(hoveredPointIndex)}
                  y2={margins.top + plotRegion.plotHeight}
                  stroke="var(--border-strong)"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
              </g>
            )}

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

          {showTooltip && hoveredPointIndex != null && processedData[hoveredPointIndex] && (() => {
            const currentX = getX(hoveredPointIndex);
            const isRightHalf = currentX > plotRegion.plotWidth / 2;

            // Calculate topmost point Y coordinate among all active series at this index
            let minPlotY = plotRegion.plotHeight;
            normalizedSeries.forEach(s => {
              const val = processedData[hoveredPointIndex][`_val_${s.key}`];
              if (val != null) {
                const py = yScale(val);
                if (py != null && py < minPlotY) minPlotY = py;
              }
            });

            // When hovering a peak point in the upper half of the chart, position tooltip at the bottom
            const isTopPeak = minPlotY < plotRegion.plotHeight * 0.5;

            const horizontalStyle = isRightHalf
              ? { right: Math.max(12, plotWidth - (margins.left + currentX) + 14), left: 'auto' }
              : { left: Math.max(12, margins.left + currentX + 14), right: 'auto' };

            const verticalStyle = isTopPeak
              ? { top: 'auto', bottom: Math.max(38, margins.bottom + 6) }
              : { top: Math.max(10, margins.top - 10), bottom: 'auto' };

            return (
              <div
                className="mer-linechart-tooltip"
                style={{
                  position: 'absolute',
                  ...horizontalStyle,
                  ...verticalStyle,
                  background: 'var(--surface-card)',
                  border: 'var(--border-hairline)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: 'var(--tooltip-shadow)',
                  padding: 'var(--space-2) var(--space-3)',
                  fontSize: 'var(--text-xs)',
                  pointerEvents: 'none',
                  zIndex: LAYER_STACK.TOOLTIP_AND_OVERLAYS,
                  minWidth: 140,
                  maxWidth: 240,
                  lineHeight: 1.4,
                  backdropFilter: 'blur(8px)',
                  transition: 'left 0.08s ease-out, right 0.08s ease-out, top 0.08s ease-out, bottom 0.08s ease-out'
                }}
              >
                <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', borderBottom: 'var(--border-hairline-subtle)', paddingBottom: 'var(--space-1)', marginBottom: 'var(--space-1)' }}>
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
            );
          })()}
        </div>

      {showLegend && normalizedSeries.length > 1 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', marginTop: 12, paddingTop: 8, borderTop: 'var(--border-subtle)' }}>
          {normalizedSeries.map((s) => {
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
                <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
                  <path d="M1 7 H19" stroke={s.color} strokeWidth="2" strokeDasharray={s.strokeDash !== 'none' ? s.strokeDash : undefined} />
                  <g transform="translate(10 7)">{pointSymbol(s.symbol, s.color, 3, 1.5)}</g>
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
                {title ? `${title} Data Table` : 'Line Chart Data Table'}
              </caption>
              <thead>
                <tr style={{ borderBottom: 'var(--border-width-emphasis) solid var(--border-default)' }}>
                  <th scope="col" style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {xKey}
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
                      {String(row[xKey] ?? idx + 1)}
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
  );
};
