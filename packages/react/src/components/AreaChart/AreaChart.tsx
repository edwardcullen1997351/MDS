/* eslint-disable jsx-a11y/no-noninteractive-element-interactions , jsx-a11y/no-noninteractive-tabindex -- keyboard-operated chart canvas */
import React,{ useCallback,useId,useMemo,useRef,useState } from 'react';
import { ChartDataTable } from '../ChartDataTable/ChartDataTable.js';
import {
LAYER_STACK,
PATTERN_PRESETS,
VIZ_COLORS,
createAreaPath,
createKeyboardRovingFocus,
createLinePath,
createLinearScale,
createPlotRegion,
createPointScale,
createTimeScale,
formatVizValue,
generateTicks,
stackSeriesData,
useResponsiveVizBounds
} from '../../utils/viz-core.js';

export type AreaChartVariant = 'single' | 'stacked' | 'normalized' | 'diverging' | 'stream';
export type AreaCurveType = 'linear' | 'monotone' | 'step-after';
export type AreaScaleType = 'time' | 'linear' | 'band' | 'point';
export type AreaDensity = 'compact' | 'standard' | 'expanded';

export interface AreaSeriesDef {
  key: string;
  label?: string;
  name?: string;
  dataKey?: string;
  color?: string;
  pattern?: string;
  strokeWidth?: number;
}

export interface AreaReferenceLine {
  y: number;
  label?: string;
  color?: string;
  position?: 'start' | 'center' | 'end';
}

export interface AreaThresholdBand {
  yMin?: number;
  yMax?: number;
  y1?: number;
  y2?: number;
  label?: string;
  color?: string;
}

export interface AreaChartProps {
  data: Array<Record<string, any>>;
  series?: AreaSeriesDef[];
  xKey?: string;
  yKey?: string;
  variant?: AreaChartVariant;
  curve?: AreaCurveType;
  baseline?: number;
  width?: number | string;
  height?: number | string;
  margins?: { top?: number; right?: number; bottom?: number; left?: number };
  xScaleType?: AreaScaleType;
  xUnit?: string;
  yUnit?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
  referenceLines?: AreaReferenceLine[];
  thresholdBands?: AreaThresholdBand[];
  showGridX?: boolean;
  showGridY?: boolean;
  showPoints?: boolean;
  showLegend?: boolean;
  showDataTable?: boolean;
  enableCrosshair?: boolean;
  enablePatterns?: boolean;
  patternPresets?: string[];
  density?: AreaDensity;
  emptyMessage?: string;
  loading?: boolean;
  onPointSelect?: (datum: Record<string, any>, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * AreaChart — Meridian Design System
 *
 * Visualizes quantitative change over an ordered domain while emphasizing
 * accumulated magnitude or shifting composition.
 */
export const AreaChart: React.FC<AreaChartProps> = ({
  data = [],
  series = [],
  xKey = 'x',
  yKey = 'y',
  variant = 'single',
  curve = 'monotone',
  baseline = 0,
  width = '100%',
  height = 320,
  margins: customMargins,
  xScaleType = 'time',
  xUnit = '',
  yUnit = '',
  locale = 'en-IN',
  title,
  subtitle,
  referenceLines = [],
  thresholdBands = [],
  showGridX = false,
  showGridY = true,
  showPoints = false,
  showLegend = true,
  showDataTable = true,
  enableCrosshair = true,
  enablePatterns = true,
  patternPresets = ['pat-diagonal', 'pat-dots', 'pat-cross', 'pat-horizontal', 'pat-vertical', 'pat-mesh'],
  density = 'standard',
  emptyMessage = 'No telemetry data available for the selected interval.',
  loading = false,
  onPointSelect,
  className = '',
  style = {}
}) => {
  const chartId = useId().replace(/:/g, '-');
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: measuredWidth, height: measuredHeight, densityTier } = useResponsiveVizBounds(containerRef, typeof width === 'number' ? width : 720, typeof height === 'number' ? height : 320);

  const plotWidth = Math.max(280, measuredWidth || (typeof width === 'number' ? width : 720));
  const plotHeight = Math.max(180, measuredHeight || (typeof height === 'number' ? height : 320));

  const [activeXIndex, setActiveXIndex] = useState(-1);
  const [, _setActiveSeriesIndex] = useState(0);
  const [isolatedSeries, setIsolatedSeries] = useState<string | null>(null);

  const seriesDefs = useMemo(() => {
    if (series && series.length > 0) {
      return series.map((s, idx) => ({
        key: s.key || s.dataKey || `series_${idx}`,
        label: s.label || s.name || s.key || `Series ${idx + 1}`,
        color: s.color || VIZ_COLORS[idx % VIZ_COLORS.length],
        pattern: s.pattern || patternPresets[idx % patternPresets.length],
        strokeWidth: s.strokeWidth || 2
      }));
    }
    return [{
      key: yKey,
      label: title || 'Telemetry Value',
      color: VIZ_COLORS[0],
      pattern: patternPresets[0],
      strokeWidth: 2
    }];
  }, [series, yKey, title, patternPresets]);

  const margins = useMemo(() => {
    const isMobile = densityTier === 'compact';
    return {
      top: customMargins?.top ?? 20,
      right: customMargins?.right ?? (isMobile ? 16 : 28),
      bottom: customMargins?.bottom ?? 36,
      left: customMargins?.left ?? (isMobile ? 48 : 72)
    };
  }, [customMargins, densityTier]);

  const activeSeriesDefs = useMemo(() => {
    if (isolatedSeries) {
      return seriesDefs.filter(s => s.key === isolatedSeries);
    }
    return seriesDefs;
  }, [seriesDefs, isolatedSeries]);

  const activeKeys = useMemo(() => activeSeriesDefs.map(s => s.key), [activeSeriesDefs]);

  const plot = useMemo(() => {
    return createPlotRegion({
      containerWidth: plotWidth,
      containerHeight: plotHeight,
      margins
    });
  }, [plotWidth, plotHeight, margins]);

  const parseTime = (val: any): Date | null => {
    if (val == null) return null;
    if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
    if (typeof val === 'number') {
      if (val > 1000000000) {
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      }
      return null;
    }
    const str = String(val).trim();
    // Match HH:MM or HH:MM:SS
    const timeMatch = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (timeMatch) {
      return new Date(2026, 0, 1, parseInt(timeMatch[1], 10), parseInt(timeMatch[2], 10), parseInt(timeMatch[3] || '0', 10));
    }
    // Match ISO dates YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      const d = new Date(str);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  };

  const stackedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return stackSeriesData(data, activeKeys, {
      type: variant === 'single' ? 'stacked' : variant,
      baseline
    });
  }, [data, activeKeys, variant, baseline]);

  const scales = useMemo(() => {
    if (!data || data.length === 0) return { xScale: null, yScale: null, xTicks: [], yTicks: [] };

    let xScale: any;
    const xValues = data.map(d => d[xKey]);
    if (xScaleType === 'time') {
      const parsedFirst = parseTime(xValues[0]);
      const parsedLast = parseTime(xValues[xValues.length - 1]);
      if (parsedFirst && parsedLast) {
        xScale = createTimeScale({
          domain: [parsedFirst, parsedLast],
          range: [0, plot.plotWidth]
        });
      } else {
        xScale = createPointScale({
          domain: xValues.map(String),
          range: [0, plot.plotWidth]
        });
      }
    } else if (xScaleType === 'band' || xScaleType === 'point') {
      xScale = createPointScale({
        domain: xValues.map(String),
        range: [0, plot.plotWidth]
      });
    } else {
      const minX = Math.min(...xValues.map(Number));
      const maxX = Math.max(...xValues.map(Number));
      xScale = createLinearScale({
        domain: [minX, maxX],
        range: [0, plot.plotWidth]
      });
    }

    let minY = 0;
    let maxY = 100;

    if (variant === 'normalized') {
      minY = 0;
      maxY = 100;
    } else if (stackedData.length > 0) {
      let minVal = Infinity;
      let maxVal = -Infinity;

      stackedData.forEach(seriesPoints => {
        seriesPoints.forEach(p => {
          if (p.y0 < minVal) minVal = p.y0;
          if (p.y1 < minVal) minVal = p.y1;
          if (p.y0 > maxVal) maxVal = p.y0;
          if (p.y1 > maxVal) maxVal = p.y1;
        });
      });

      referenceLines.forEach(r => {
        if (r.y < minVal) minVal = r.y;
        if (r.y > maxVal) maxVal = r.y;
      });

      thresholdBands.forEach(b => {
        const bMin = b.yMin ?? b.y1;
        const bMax = b.yMax ?? b.y2;
        if (bMin != null && bMin < minVal) minVal = bMin;
        if (bMax != null && bMax > maxVal) maxVal = bMax;
      });

      if (baseline !== 0) {
        minVal = Math.min(baseline, minVal);
      }

      const span = (maxVal - minVal) || 1;
      if (baseline !== 0) {
        minY = Math.min(baseline, minVal);
      } else {
        minY = minVal < 0 ? minVal - span * 0.05 : 0;
      }
      maxY = maxVal + span * 0.08;
    }

    const yScale = createLinearScale({
      domain: [minY, maxY],
      range: [plot.plotHeight, 0],
      clamp: false
    });

    const xTicks = generateTicks(xScale, Math.min(7, Math.floor(plot.plotWidth / 90)));
    const yTicks = generateTicks(yScale, Math.min(6, Math.floor(plot.plotHeight / 48)));

    return { xScale, yScale, xTicks, yTicks };
  }, [data, xKey, xScaleType, plot, variant, stackedData, baseline, referenceLines, thresholdBands]);

  const getPointX = useCallback((xVal: any, idx: number): number => {
    if (!scales.xScale) return 0;
    if (xScaleType === 'band' || xScaleType === 'point') {
      const mapped = scales.xScale(String(xVal));
      if (mapped !== undefined) return mapped;
      return (idx / Math.max(1, data.length - 1)) * plot.plotWidth;
    }
    if (xScaleType === 'time') {
      const dt = parseTime(xVal);
      if (dt) {
        return scales.xScale(dt) ?? 0;
      }
      return (idx / (Math.max(1, data.length - 1))) * plot.plotWidth;
    }
    return scales.xScale(xVal) ?? ((idx / (Math.max(1, data.length - 1))) * plot.plotWidth);
  }, [scales, xScaleType, data.length, plot.plotWidth]);

  const areaLayers = useMemo(() => {
    if (!scales.xScale || !scales.yScale || stackedData.length === 0) return [];

    return stackedData.map((seriesPoints, sIndex) => {
      const def = activeSeriesDefs[sIndex];
      const upperPoints: Array<{ x: number; y: number; datum: any; p: any }> = [];
      const lowerPoints: Array<{ x: number; y: number; datum: any; p: any }> = [];

      seriesPoints.forEach((p, idx) => {
        const xVal = data[idx][xKey];
        const px = getPointX(xVal, idx);
        const pyUpper = scales.yScale(p.y1) ?? 0;
        const pyLower = scales.yScale(p.y0) ?? 0;

        upperPoints.push({ x: px, y: pyUpper, datum: data[idx], p });
        lowerPoints.push({ x: px, y: pyLower, datum: data[idx], p });
      });

      const areaPathD = createAreaPath(upperPoints, lowerPoints, curve);
      const boundaryPathD = createLinePath(upperPoints, curve);

      return {
        def,
        sIndex,
        areaPathD,
        boundaryPathD,
        upperPoints,
        lowerPoints
      };
    });
  }, [scales, stackedData, activeSeriesDefs, data, xKey, curve, getPointX]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scales.xScale || data.length === 0 || !enableCrosshair) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseCanvasX = e.clientX - rect.left;
    const plotX = plot.toPlotX(mouseCanvasX);
    if (plotX < 0 || plotX > plot.plotWidth) {
      setActiveXIndex(-1);
      return;
    }

    let nearestIdx = 0;
    let minDist = Infinity;
    data.forEach((d, i) => {
      const xVal = d[xKey];
      const px = getPointX(xVal, i);
      const dist = Math.abs(px - plotX);
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    });

    setActiveXIndex(nearestIdx);
  };

  const handlePointerLeave = () => {
    setActiveXIndex(-1);
  };

  const handleKeyDown = createKeyboardRovingFocus({
    itemCount: data.length,
    currentIndex: activeXIndex,
    onIndexChange: (idx) => {
      setActiveXIndex(idx);
      if (onPointSelect && data[idx]) {
        onPointSelect(data[idx], idx);
      }
    },
    onSelect: (idx) => {
      if (onPointSelect && data[idx]) {
        onPointSelect(data[idx], idx);
      }
    },
    onDismiss: () => {
      setActiveXIndex(-1);
    }
  });

  const activeXDatum = activeXIndex >= 0 ? data[activeXIndex] : null;
  const activeXPos = (activeXDatum && scales.xScale) ? getPointX(activeXDatum[xKey], activeXIndex) : 0;

  if (loading) {
    return (
      <div
        className={`mds-area-chart mds-area-chart--loading ${className}`}
        style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height, ...style }}
        role="region"
        aria-label={`${title || 'Area Chart Loading'} (${chartId})`}
        aria-busy="true"
      >
        <div className="mds-area-chart__skeleton-header">
          <div className="mds-area-chart__skeleton-title" />
          <div className="mds-area-chart__skeleton-sub" />
        </div>
        <div className="mds-area-chart__skeleton-plot" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className={`mds-area-chart mds-area-chart--empty ${className}`}
        style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height, ...style }}
        role="region"
        aria-label={`${title || 'Area Chart Empty'} (${chartId})`}
      >
        {title && <h2 className="mds-area-chart__title">{title}</h2>}
        <div className="mds-area-chart__empty-msg">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3v18h18M7 16l4-4 4 4 5-8" />
          </svg>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mds-area-chart mds-area-chart--${variant} mds-area-chart--density-${density} ${className}`}
      style={{ width: typeof width === 'number' ? `${width}px` : width, ...style }}
      role="application"
      aria-roledescription="area chart"
      aria-label={`${title || 'Area chart visualization'} (${chartId})`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {(title || subtitle) && (
        <div className="mds-area-chart__header">
          <div>
            {title && <h2 className="mds-area-chart__title">{title}</h2>}
            {subtitle && <p className="mds-area-chart__subtitle">{subtitle}</p>}
          </div>
        </div>
      )}

      {showLegend && seriesDefs.length > 1 && (
        <div className="mds-area-chart__legend" role="toolbar" aria-label="Series Filter">
          {seriesDefs.map((s) => {
            const isDimmed = isolatedSeries && isolatedSeries !== s.key;
            return (
              <button
                key={s.key}
                type="button"
                className={`mds-area-chart__legend-item ${isDimmed ? 'mds-area-chart__legend-item--dimmed' : ''}`}
                onClick={() => setIsolatedSeries(isolatedSeries === s.key ? null : s.key)}
                aria-pressed={isolatedSeries === s.key}
                title={`Click to isolate ${s.label}`}
              >
                <svg className="mds-area-chart__legend-swatch" width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
                  <rect x="1" y="1" width="14" height="12" rx="2" fill={s.color} />
                  {enablePatterns && <rect x="1" y="1" width="14" height="12" rx="2" fill={`url(#${chartId}-${s.pattern})`} />}
                </svg>
                <span className="mds-area-chart__legend-label">{s.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <svg
        width="100%"
        height={plotHeight}
        viewBox={`0 0 ${plotWidth} ${plotHeight}`}
        className="mds-area-chart__svg mds-chart-svg"
        aria-hidden="true"
        style={{ overflow: 'visible', display: 'block', width: '100%', height: 'auto' }}
      >
        <defs>
          {seriesDefs.map((s) => (
            <linearGradient key={`grad-${s.key}`} id={`${chartId}-grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.45" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.03" />
            </linearGradient>
          ))}

          {PATTERN_PRESETS.map((pat) => (
            <pattern
              key={pat.id}
              id={`${chartId}-${pat.id}`}
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
              patternTransform={pat.transform || ''}
            >
              {pat.type === 'circle' ? (
                <circle cx="5" cy="5" r={pat.r || 1.2} fill={pat.fill || 'rgba(255,255,255,0.45)'} />
              ) : (
                <line
                  x1="0"
                  y1={pat.id.includes('vertical') ? '0' : '5'}
                  x2={pat.id.includes('vertical') ? '0' : '10'}
                  y2={pat.id.includes('vertical') ? '10' : '5'}
                  stroke={pat.stroke || 'rgba(255,255,255,0.35)'}
                  strokeWidth={pat.strokeWidth || 1.5}
                />
              )}
            </pattern>
          ))}

          <clipPath id={`${chartId}-clip`}>
            <rect x="0" y="0" width={plot.plotWidth} height={plot.plotHeight} />
          </clipPath>
        </defs>

        <g transform={`translate(${plot.margins.left}, ${plot.margins.top})`}>
          {thresholdBands.map((band, idx) => {
            const y1 = scales.yScale ? (scales.yScale(band.yMax || band.y2) ?? 0) : 0;
            const y2 = scales.yScale ? (scales.yScale(band.yMin || band.y1) ?? 0) : 0;
            const h = Math.abs(y2 - y1);
            return (
              <rect
                key={`band-${idx}`}
                x="0"
                y={Math.min(y1, y2)}
                width={plot.plotWidth}
                height={h}
                fill={band.color || 'rgba(16,185,129,0.08)'}
              />
            );
          })}

          {showGridY && scales.yTicks.map((tickVal: any, idx: number) => {
            const yPos = scales.yScale ? (scales.yScale(tickVal) ?? 0) : 0;
            return (
              <g key={`y-grid-${idx}`} className="mds-area-chart__gridline">
                <line x1="0" y1={yPos} x2={plot.plotWidth} y2={yPos} />
              </g>
            );
          })}

          {showGridX && scales.xTicks.map((tickVal: any, idx: number) => {
            const xPos = scales.xScale ? (scales.xScale(tickVal) ?? 0) : 0;
            return (
              <g key={`x-grid-${idx}`} className="mds-area-chart__gridline">
                <line x1={xPos} y1="0" x2={xPos} y2={plot.plotHeight} />
              </g>
            );
          })}

          <g clipPath={`url(#${chartId}-clip)`}>
            {areaLayers.map((layer) => {
              const { def, areaPathD, boundaryPathD, upperPoints } = layer;
              const isSingle = variant === 'single';
              const fillSource = isSingle ? `url(#${chartId}-grad-${def.key})` : def.color;

              return (
                <g key={`layer-${def.key}`} className="mds-area-chart__layer">
                  <path
                    d={areaPathD}
                    fill={fillSource}
                    opacity={variant === 'single' ? 1 : 0.85}
                  />

                  {enablePatterns && (
                    <path
                      d={areaPathD}
                      fill={`url(#${chartId}-${def.pattern})`}
                      opacity={0.65}
                    />
                  )}

                  <path
                    d={boundaryPathD}
                    fill="none"
                    stroke={def.color}
                    strokeWidth={def.strokeWidth}
                    className="mds-area-chart__boundary-line"
                  />

                  {showPoints && upperPoints.map((pt, pIdx) => (
                    <circle
                      key={`pt-${pIdx}`}
                      cx={pt.x}
                      cy={pt.y}
                      r="3.5"
                      fill="var(--surface-card)"
                      stroke={def.color}
                      strokeWidth="2"
                    />
                  ))}
                </g>
              );
            })}
          </g>

          {referenceLines.map((ref, idx) => {
            const yPos = scales.yScale ? (scales.yScale(ref.y) ?? 0) : 0;
            const pos = ref.position || 'end';
            const labelX = pos === 'start' ? 8 : pos === 'center' ? plot.plotWidth / 2 : plot.plotWidth - 8;
            const textAnchor = pos === 'start' ? 'start' : pos === 'center' ? 'middle' : 'end';

            return (
              <g key={`ref-${idx}`} className="mds-area-chart__reference-line">
                <line
                  x1="0"
                  y1={yPos}
                  x2={plot.plotWidth}
                  y2={yPos}
                  stroke={ref.color || 'var(--status-critical-solid)'}
                  strokeDasharray="4 3"
                  strokeWidth="1.5"
                />
                {ref.label && (
                  <text
                    x={labelX}
                    y={yPos - 5}
                    textAnchor={textAnchor}
                    fill={ref.color || 'var(--status-critical-solid)'}
                    stroke="var(--surface-card)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    paintOrder="stroke fill"
                    fontSize="11"
                    fontWeight="600"
                    className="mds-area-chart__ref-label"
                  >
                    {ref.label.includes(String(ref.y)) ? ref.label : `${ref.label} (${formatVizValue(ref.y, yUnit, locale)})`}
                  </text>
                )}
              </g>
            );
          })}

          {activeXIndex >= 0 && enableCrosshair && (
            <g className="mds-area-chart__crosshair">
              <line
                x1={activeXPos}
                y1="0"
                x2={activeXPos}
                y2={plot.plotHeight}
                stroke="var(--border-strong)"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />
              {areaLayers.map((layer) => {
                const upperPt = layer.upperPoints[activeXIndex];
                if (!upperPt) return null;
                return (
                  <circle
                    key={`active-pt-${layer.def.key}`}
                    cx={activeXPos}
                    cy={upperPt.y}
                    r="5"
                    fill="var(--surface-card)"
                    stroke={layer.def.color}
                    strokeWidth="2.5"
                  />
                );
              })}
            </g>
          )}

          <g transform={`translate(0, ${plot.plotHeight})`} className="mds-area-chart__axis mds-area-chart__axis--x">
            <line x1="0" y1="0" x2={plot.plotWidth} y2="0" stroke="var(--border-subtle)" />
            {scales.xTicks.map((tickVal: any, idx: number) => {
              const xPos = scales.xScale ? (scales.xScale(tickVal) ?? 0) : 0;
              let label: string;
              if (xScaleType === 'time' && scales.xScale?.type === 'time') {
                const dt = tickVal instanceof Date ? tickVal : parseTime(tickVal);
                label = dt
                  ? dt.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: false })
                  : formatVizValue(tickVal, '', locale);
              } else if (scales.xScale?.type === 'point' || scales.xScale?.type === 'band') {
                label = String(tickVal);
              } else {
                label = formatVizValue(tickVal, xUnit, locale);
              }
              const textAnchor = idx === 0 ? 'start' : idx === scales.xTicks.length - 1 ? 'end' : 'middle';
              return (
                <g key={`xtick-${idx}`} transform={`translate(${xPos}, 0)`}>
                  <line y2="5" stroke="var(--border-subtle)" />
                  <text y="18" textAnchor={textAnchor}>{label}</text>
                </g>
              );
            })}
          </g>

          <g className="mds-area-chart__axis mds-area-chart__axis--y">
            <line x1="0" y1="0" x2="0" y2={plot.plotHeight} stroke="var(--border-subtle)" />
            {scales.yTicks.map((tickVal: any, idx: number) => {
              const yPos = scales.yScale ? (scales.yScale(tickVal) ?? 0) : 0;
              const formatted = variant === 'normalized'
                ? `${Number(tickVal).toFixed(0)}%`
                : formatVizValue(tickVal, yUnit, locale);
              return (
                <g key={`ytick-${idx}`} transform={`translate(0, ${yPos})`}>
                  <line x2="-5" stroke="var(--border-subtle)" />
                  <text x="-9" dy="0.32em" textAnchor="end">{formatted}</text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {activeXIndex >= 0 && activeXDatum && (() => {
        const canvasX = plot.toCanvasX(activeXPos);
        const isRightHalf = canvasX > plotWidth / 2;
        const tooltipLeft = isRightHalf
          ? Math.max(12, canvasX - 230)
          : Math.min(plotWidth - 230, canvasX + 14);

        return (
          <div
            className="mds-chart-tooltip mds-area-chart__tooltip"
            style={{
              position: 'absolute',
              left: `${tooltipLeft}px`,
              top: `${plot.margins.top + 10}px`,
              pointerEvents: 'none',
              zIndex: LAYER_STACK.TOOLTIP_AND_OVERLAYS,
              background: 'var(--surface-card)',
              border: 'var(--border-width) solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--tooltip-shadow)',
              padding: 'calc(var(--space-2) + var(--space-half)) calc(var(--space-3) + var(--space-half))',
              fontSize: 'var(--text-xs)',
              minWidth: '180px',
              maxWidth: 'var(--tooltip-max-width)',
              lineHeight: 1.4,
              backdropFilter: 'blur(8px)',
              transition: 'left 0.08s ease-out, top 0.08s ease-out'
            }}
            role="tooltip"
          >
            <div className="mds-chart-tooltip__header mds-area-chart__tooltip-header">
              <strong>
                {xScaleType === 'time'
                  ? (() => {
                      const dt = parseTime(activeXDatum[xKey]);
                      return dt
                        ? dt.toLocaleTimeString(locale, {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })
                        : String(activeXDatum[xKey]);
                    })()
                  : formatVizValue(activeXDatum[xKey], xUnit, locale)}
              </strong>
            </div>
            <div className="mds-area-chart__tooltip-body">
              {stackedData.map((seriesPoints, sIdx) => {
                const def = activeSeriesDefs[sIdx];
                const pt = seriesPoints[activeXIndex];
                if (!pt) return null;

                return (
                  <div key={def.key} className="mds-chart-tooltip__row mds-area-chart__tooltip-row">
                    <span
                      className="mds-area-chart__tooltip-swatch"
                      style={{
                        backgroundColor: def.color,
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        flexShrink: 0,
                        display: 'inline-block'
                      }}
                    />
                    <span className="mds-area-chart__tooltip-label" style={{ flexGrow: 1, color: 'var(--text-secondary)' }}>
                      {def.label}:
                    </span>
                    <span className="mds-chart-tooltip__val mds-area-chart__tooltip-val" style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatVizValue(pt.rawVal, yUnit, locale)}
                      {variant === 'normalized' && ` (${pt.share.toFixed(1)}%)`}
                    </span>
                  </div>
                );
              })}

              {variant === 'stacked' && activeSeriesDefs.length > 1 && (
                <div
                  className="mds-chart-tooltip__row mds-area-chart__tooltip-row mds-area-chart__tooltip-row--total"
                  style={{
                    borderTop: 'var(--border-hairline-subtle)',
                    paddingTop: 6,
                    marginTop: 6,
                    fontWeight: 600,
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>Total Accumulated:</span>
                  <strong style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700 }}>
                    {formatVizValue(
                      activeSeriesDefs.reduce((acc, def) => acc + Number(activeXDatum[def.key] || 0), 0),
                      yUnit,
                      locale
                    )}
                  </strong>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      <div className="mds-area-chart__sr-only" aria-live="polite">
        {activeXIndex >= 0 && activeXDatum
          ? `Selected observation ${activeXIndex + 1} of ${data.length}, domain: ${activeXDatum[xKey]}. Values: ${activeSeriesDefs.map(s => `${s.label} ${activeXDatum[s.key]}`).join(', ')}.`
          : ''}
      </div>

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
                {title ? `${title} Data Table` : 'Area Chart Data Table'}
              </caption>
              <thead>
                <tr style={{ borderBottom: 'var(--border-width-emphasis) solid var(--border-default)' }}>
                  <th scope="col" style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {xKey}
                  </th>
                  {seriesDefs.map((s) => (
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
                    {seriesDefs.map((s) => {
                      const val = row[s.key];
                      return (
                        <td key={s.key} style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                          {val != null ? formatVizValue(val, yUnit, locale) : '—'}
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
