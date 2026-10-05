import React, { useState, useRef, useId, useMemo } from 'react';
import {
  VIZ_COLORS,
  PATTERN_PRESETS,
  formatVizValue,
  createPlotRegion,
  createLinearScale,
  createTimeScale,
  createBandScale,
  generateTicks,
  createAreaPath,
  createLinePath,
  stackSeriesData,
  createKeyboardRovingFocus,
  LAYER_STACK
} from './viz-core.js';

/**
 * AreaChart — Meridian Design System
 *
 * Visualizes quantitative change over an ordered domain while emphasizing
 * accumulated magnitude or shifting composition.
 *
 * Variants:
 * - 'single': Single area with gradient fill and boundary line against baseline
 * - 'stacked': Accumulated parts-to-whole showing absolute totals and sub-series
 * - 'normalized': 100% proportional share composition over time
 * - 'diverging': Positive and negative deviation areas around a central baseline
 * - 'stream': Silhouette streamgraph centered organically around a zero axis
 */
export function AreaChart({
  data = [],
  series = [],
  xKey = 'x',
  yKey = 'y',
  variant = 'single', // 'single' | 'stacked' | 'normalized' | 'diverging' | 'stream'
  curve = 'monotone', // 'linear' | 'monotone' | 'step-after'
  baseline = 0,
  width = 640,
  height = 320,
  margins = { top: 20, right: 24, bottom: 40, left: 60 },
  xScaleType = 'time', // 'time' | 'linear' | 'band'
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
  enableCrosshair = true,
  enablePatterns = true,
  patternPresets = ['pat-diagonal', 'pat-dots', 'pat-cross', 'pat-horizontal', 'pat-vertical', 'pat-mesh'],
  density = 'standard',
  emptyMessage = 'No telemetry data available for the selected interval.',
  loading = false,
  onPointSelect,
  className = '',
  style = {}
}) {
  const chartId = useId();
  const containerRef = useRef(null);

  const [activeXIndex, setActiveXIndex] = useState(-1);
  const [activeSeriesIndex, setActiveSeriesIndex] = useState(0);
  const [showTableModal, setShowTableModal] = useState(false);
  const [isolatedSeries, setIsolatedSeries] = useState(null);

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

  const activeSeriesDefs = useMemo(() => {
    if (isolatedSeries) {
      return seriesDefs.filter(s => s.key === isolatedSeries);
    }
    return seriesDefs;
  }, [seriesDefs, isolatedSeries]);

  const activeKeys = useMemo(() => activeSeriesDefs.map(s => s.key), [activeSeriesDefs]);

  const plot = useMemo(() => {
    return createPlotRegion({
      containerWidth: width,
      containerHeight: height,
      margins
    });
  }, [width, height, margins]);

  const stackedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return stackSeriesData(data, activeKeys, {
      type: variant,
      baseline
    });
  }, [data, activeKeys, variant, baseline]);

  const scales = useMemo(() => {
    if (!data || data.length === 0) return { xScale: null, yScale: null, xTicks: [], yTicks: [] };

    let xScale;
    const xValues = data.map(d => d[xKey]);
    if (xScaleType === 'time') {
      const minDate = new Date(xValues[0]);
      const maxDate = new Date(xValues[xValues.length - 1]);
      xScale = createTimeScale({
        domain: [minDate, maxDate],
        range: [0, plot.plotWidth]
      });
    } else if (xScaleType === 'band') {
      xScale = createBandScale({
        domain: xValues,
        range: [0, plot.plotWidth],
        padding: 0
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

      if (variant === 'single' || variant === 'stacked') {
        minVal = Math.min(baseline, minVal);
      }

      const span = (maxVal - minVal) || 1;
      minY = minVal < 0 ? minVal - span * 0.05 : 0;
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
  }, [data, xKey, xScaleType, plot, variant, stackedData, baseline, referenceLines]);

  const areaLayers = useMemo(() => {
    if (!scales.xScale || !scales.yScale || stackedData.length === 0) return [];

    return stackedData.map((seriesPoints, sIndex) => {
      const def = activeSeriesDefs[sIndex];
      const upperPoints = [];
      const lowerPoints = [];

      seriesPoints.forEach((p, idx) => {
        let px;
        const xVal = data[idx][xKey];
        if (xScaleType === 'band') {
          px = scales.xScale(xVal) + scales.xScale.bandwidth() / 2;
        } else {
          px = scales.xScale(xVal);
        }

        const pyUpper = scales.yScale(p.y1);
        const pyLower = scales.yScale(p.y0);

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
  }, [scales, stackedData, activeSeriesDefs, data, xKey, xScaleType, curve]);

  const handlePointerMove = (e) => {
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
      const px = scales.xScale(xVal);
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
    },
    onToggleTable: () => {
      setShowTableModal(prev => !prev);
    }
  });

  const activeXDatum = activeXIndex >= 0 ? data[activeXIndex] : null;
  const activeXPos = (activeXDatum && scales.xScale) ? scales.xScale(activeXDatum[xKey]) : 0;

  if (loading) {
    return (
      <div
        className={`mds-area-chart mds-area-chart--loading ${className}`}
        style={{ width, height, ...style }}
        role="region"
        aria-label={title || 'Area Chart Loading'}
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
        style={{ width, height, ...style }}
        role="region"
        aria-label={title || 'Area Chart Empty'}
      >
        {title && <h3 className="mds-area-chart__title">{title}</h3>}
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
      style={{ width, ...style }}
      role="region"
      aria-roledescription="area chart"
      aria-label={title || 'Area chart visualization'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {(title || subtitle) && (
        <div className="mds-area-chart__header">
          <div>
            {title && <h3 className="mds-area-chart__title">{title}</h3>}
            {subtitle && <p className="mds-area-chart__subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="mds-area-chart__table-btn"
            onClick={() => setShowTableModal(true)}
            title="View as Data Table (Alt+F11)"
            aria-label="Toggle accessible data table"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M3 15h18M9 3v18" />
            </svg>
            Table
          </button>
        </div>
      )}

      {seriesDefs.length > 1 && (
        <div className="mds-area-chart__legend" role="toolbar" aria-label="Series Filter">
          {seriesDefs.map((s, idx) => {
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
                <span
                  className="mds-area-chart__legend-swatch"
                  style={{
                    backgroundColor: s.color,
                    backgroundImage: enablePatterns ? `url(#${chartId}-${s.pattern})` : 'none'
                  }}
                />
                <span className="mds-area-chart__legend-label">{s.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <svg
        width={width}
        height={height}
        className="mds-area-chart__svg"
        aria-hidden="true"
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
            const y1 = scales.yScale(band.yMax || band.y2);
            const y2 = scales.yScale(band.yMin || band.y1);
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

          {showGridY && scales.yTicks.map((tickVal, idx) => {
            const yPos = scales.yScale(tickVal);
            return (
              <g key={`y-grid-${idx}`} className="mds-area-chart__gridline">
                <line x1="0" y1={yPos} x2={plot.plotWidth} y2={yPos} />
              </g>
            );
          })}

          {showGridX && scales.xTicks.map((tickVal, idx) => {
            const xPos = scales.xScale(tickVal);
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
                      fill="var(--surface-card, #ffffff)"
                      stroke={def.color}
                      strokeWidth="2"
                    />
                  ))}
                </g>
              );
            })}
          </g>

          {referenceLines.map((ref, idx) => {
            const yPos = scales.yScale(ref.y);
            return (
              <g key={`ref-${idx}`} className="mds-area-chart__reference-line">
                <line
                  x1="0"
                  y1={yPos}
                  x2={plot.plotWidth}
                  y2={yPos}
                  stroke={ref.color || 'var(--status-critical-solid, #ef4444)'}
                  strokeDasharray="4 3"
                  strokeWidth="1.5"
                />
                {ref.label && (
                  <text
                    x={plot.plotWidth - 6}
                    y={yPos - 5}
                    textAnchor="end"
                    fill={ref.color || 'var(--status-critical-solid, #ef4444)'}
                    className="mds-area-chart__ref-label"
                  >
                    {ref.label} ({formatVizValue(ref.y, yUnit, locale)})
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
                stroke="var(--border-strong, #64748b)"
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
                    fill="var(--surface-card, #ffffff)"
                    stroke={layer.def.color}
                    strokeWidth="2.5"
                  />
                );
              })}
            </g>
          )}

          <g transform={`translate(0, ${plot.plotHeight})`} className="mds-area-chart__axis mds-area-chart__axis--x">
            <line x1="0" y1="0" x2={plot.plotWidth} y2="0" stroke="var(--border-subtle, #cbd5e1)" />
            {scales.xTicks.map((tickVal, idx) => {
              const xPos = scales.xScale(tickVal);
              const label = xScaleType === 'time'
                ? new Date(tickVal).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
                : formatVizValue(tickVal, xUnit, locale);
              return (
                <g key={`xtick-${idx}`} transform={`translate(${xPos}, 0)`}>
                  <line y2="5" stroke="var(--border-subtle, #cbd5e1)" />
                  <text y="18" textAnchor="middle">{label}</text>
                </g>
              );
            })}
          </g>

          <g className="mds-area-chart__axis mds-area-chart__axis--y">
            <line x1="0" y1="0" x2="0" y2={plot.plotHeight} stroke="var(--border-subtle, #cbd5e1)" />
            {scales.yTicks.map((tickVal, idx) => {
              const yPos = scales.yScale(tickVal);
              const formatted = variant === 'normalized'
                ? `${tickVal.toFixed(0)}%`
                : formatVizValue(tickVal, yUnit, locale);
              return (
                <g key={`ytick-${idx}`} transform={`translate(0, ${yPos})`}>
                  <line x2="-5" stroke="var(--border-subtle, #cbd5e1)" />
                  <text x="-9" dy="0.32em" textAnchor="end">{formatted}</text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {activeXIndex >= 0 && activeXDatum && (
        <div
          className="mds-area-chart__tooltip"
          style={{
            left: Math.min(plot.toCanvasX(activeXPos) + 12, width - 220),
            top: plot.margins.top + 10
          }}
          role="tooltip"
        >
          <div className="mds-area-chart__tooltip-header">
            <strong>
              {xScaleType === 'time'
                ? new Date(activeXDatum[xKey]).toLocaleString(locale, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : formatVizValue(activeXDatum[xKey], xUnit, locale)}
            </strong>
          </div>
          <div className="mds-area-chart__tooltip-body">
            {stackedData.map((seriesPoints, sIdx) => {
              const def = activeSeriesDefs[sIdx];
              const pt = seriesPoints[activeXIndex];
              if (!pt) return null;

              return (
                <div key={def.key} className="mds-area-chart__tooltip-row">
                  <span className="mds-area-chart__tooltip-swatch" style={{ backgroundColor: def.color }} />
                  <span className="mds-area-chart__tooltip-label">{def.label}:</span>
                  <span className="mds-area-chart__tooltip-val">
                    {formatVizValue(pt.rawVal, yUnit, locale)}
                    {variant === 'normalized' && ` (${pt.share.toFixed(1)}%)`}
                  </span>
                </div>
              );
            })}

            {variant === 'stacked' && activeSeriesDefs.length > 1 && (
              <div className="mds-area-chart__tooltip-row mds-area-chart__tooltip-row--total">
                <span>Total Accumulated:</span>
                <strong>
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
      )}

      {showTableModal && (
        <div
          className="mds-area-chart__modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${chartId}-table-title`}
        >
          <div className="mds-area-chart__modal">
            <div className="mds-area-chart__modal-header">
              <h4 id={`${chartId}-table-title`}>{title || 'Area Chart Telemetry Records'}</h4>
              <button
                type="button"
                className="mds-area-chart__modal-close"
                onClick={() => setShowTableModal(false)}
                aria-label="Close data table"
              >
                ✕
              </button>
            </div>
            <div className="mds-area-chart__modal-body">
              <table className="mds-area-chart__data-table">
                <thead>
                  <tr>
                    <th>Domain ({xKey})</th>
                    {activeSeriesDefs.map(s => (
                      <th key={s.key}>{s.label} ({yUnit || 'Value'})</th>
                    ))}
                    {variant === 'stacked' && <th>Total Sum</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, rowIdx) => {
                    const totalSum = activeSeriesDefs.reduce((acc, s) => acc + Number(d[s.key] || 0), 0);
                    return (
                      <tr key={rowIdx}>
                        <td>
                          {xScaleType === 'time'
                            ? new Date(d[xKey]).toLocaleString(locale)
                            : String(d[xKey])}
                        </td>
                        {activeSeriesDefs.map(s => (
                          <td key={s.key}>
                            {formatVizValue(d[s.key], yUnit, locale)}
                            {variant === 'normalized' && totalSum > 0 && (
                              <span className="mds-area-chart__table-share">
                                {' '}({((Number(d[s.key] || 0) / totalSum) * 100).toFixed(1)}%)
                              </span>
                            )}
                          </td>
                        ))}
                        {variant === 'stacked' && (
                          <td><strong>{formatVizValue(totalSum, yUnit, locale)}</strong></td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="mds-area-chart__sr-only" aria-live="polite">
        {activeXIndex >= 0 && activeXDatum
          ? `Selected observation ${activeXIndex + 1} of ${data.length}, domain: ${activeXDatum[xKey]}. Values: ${activeSeriesDefs.map(s => `${s.label} ${activeXDatum[s.key]}`).join(', ')}.`
          : ''}
      </div>
    </div>
  );
}
