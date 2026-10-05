import React, { useState, useRef, useId, useMemo } from 'react';
import {
  VIZ_COLORS,
  POINT_SYMBOLS,
  PATTERN_PRESETS,
  formatVizValue,
  createPlotRegion,
  createLinearScale,
  createBandScale,
  generateTicks,
  createLinePath,
  createAreaPath,
  renderPointSymbol,
  computeHistogramBins,
  computeBoxPlotQuantiles,
  computeKDE,
  createKeyboardRovingFocus,
  LAYER_STACK
} from './viz-core.js';

/**
 * DistributionPlot — Meridian Design System
 *
 * Visualizes the shape, frequency, density, spread, central tendency, quantiles,
 * and outliers of one or more quantitative distributions.
 *
 * Variants:
 * - 'histogram': Equal-width or rule-based frequency bins
 * - 'box': Tukey 5-number summary (Min, Q1, Median, Q3, Max, IQR Whiskers & Outliers)
 * - 'violin': Mirrored KDE density envelope with embedded quartile markers
 * - 'strip': Raw observation dots with controlled categorical spatial jitter
 * - 'dotplot': Stacked unit dots representing discrete frequency counts
 * - 'density': Smooth continuous KDE curve with shaded density area
 */
export function DistributionPlot({
  data = [],
  valueKey = 'value',
  categoryKey = null,
  series = [],
  variant = 'histogram', // 'histogram' | 'box' | 'violin' | 'strip' | 'dotplot' | 'density'
  orientation = 'vertical', // 'vertical' (quantitative on X/Y as appropriate)
  binCount = null,
  binWidth = null,
  bandwidth = null,
  width = 640,
  height = 360,
  margins = { top: 24, right: 28, bottom: 44, left: 60 },
  unit = '',
  valueLabel = 'Measured Value',
  categoryLabel = 'Group',
  locale = 'en-IN',
  title,
  subtitle,
  referenceLines = [], // [{ value: 2.0, label: 'Nominal Spec Target', color: 'var(--status-critical-solid)' }]
  toleranceBands = [], // [{ min: 1.95, max: 2.05, label: 'Acceptable Spec Window' }]
  showGrid = true,
  showOutliers = true,
  showMean = true,
  enablePatterns = true,
  density = 'standard', // 'compact' | 'standard' | 'expanded'
  emptyMessage = 'No distribution telemetry records found.',
  loading = false,
  onElementSelect,
  className = '',
  style = {}
}) {
  const chartId = useId();
  const containerRef = useRef(null);

  const [activeElementIndex, setActiveElementIndex] = useState(-1);
  const [selectedElementIndex, setSelectedElementIndex] = useState(-1);
  const [isolatedCategory, setIsolatedCategory] = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);

  // Group Observations by Category or Single Aggregate
  const groupedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    if (!categoryKey) {
      const rawVals = data.map(d => (typeof d === 'number' ? d : Number(d[valueKey]))).filter(v => !isNaN(v));
      return [{
        key: 'all',
        label: title || 'Distribution',
        color: VIZ_COLORS[0],
        pattern: PATTERN_PRESETS[0].id,
        values: rawVals,
        items: data
      }];
    }

    const map = new Map();
    data.forEach(d => {
      const cat = String(d[categoryKey] || 'Other');
      if (!map.has(cat)) map.set(cat, []);
      const v = typeof d === 'number' ? d : Number(d[valueKey]);
      if (!isNaN(v)) map.get(cat).push(v);
    });

    const categories = Array.from(map.keys());
    return categories.map((cat, idx) => ({
      key: cat,
      label: cat,
      color: VIZ_COLORS[idx % VIZ_COLORS.length],
      pattern: PATTERN_PRESETS[idx % PATTERN_PRESETS.length].id,
      values: map.get(cat),
      items: data.filter(d => String(d[categoryKey]) === cat)
    }));
  }, [data, valueKey, categoryKey, title]);

  // Filter Active Categories
  const activeGroups = useMemo(() => {
    if (isolatedCategory) {
      return groupedData.filter(g => g.key === isolatedCategory);
    }
    return groupedData;
  }, [groupedData, isolatedCategory]);

  // Dimensions & Plot Region
  const plot = useMemo(() => {
    return createPlotRegion({
      containerWidth: width,
      containerHeight: height,
      margins
    });
  }, [width, height, margins]);

  // Compute Overall Extents across all groups
  const { allValues, globalMin, globalMax } = useMemo(() => {
    const vals = [];
    groupedData.forEach(g => vals.push(...g.values));
    if (vals.length === 0) return { allValues: [], globalMin: 0, globalMax: 100 };
    const minV = Math.min(...vals);
    const maxV = Math.max(...vals);
    const span = maxV - minV || 1;
    return {
      allValues: vals,
      globalMin: minV - span * 0.05,
      globalMax: maxV + span * 0.05
    };
  }, [groupedData]);

  // Statistical Transformations per Variant
  const transformedGroups = useMemo(() => {
    return activeGroups.map((g) => {
      // 1. Histogram
      const bins = computeHistogramBins(g.values, {
        binCount,
        binWidth,
        min: globalMin,
        max: globalMax
      });

      // 2. Box Plot Summary
      const boxStats = computeBoxPlotQuantiles(g.values);

      // 3. KDE Density Estimate
      const kde = computeKDE(g.values, {
        bandwidth,
        samplePoints: 60,
        min: globalMin,
        max: globalMax
      });

      return {
        ...g,
        bins,
        boxStats,
        kde
      };
    });
  }, [activeGroups, binCount, binWidth, bandwidth, globalMin, globalMax]);

  // Compute Scales
  const scales = useMemo(() => {
    if (allValues.length === 0) return { scaleVal: null, scaleCat: null, scaleFreq: null, valTicks: [], freqTicks: [] };

    // 1. Value Scale (Quantitative continuous domain)
    const scaleVal = createLinearScale({
      domain: [globalMin, globalMax],
      range: [0, plot.plotWidth]
    });

    // 2. Category Scale (Band scale for multiple groups)
    const catKeys = activeGroups.map(g => g.key);
    const scaleCat = createBandScale({
      domain: catKeys,
      range: [0, plot.plotHeight],
      padding: 0.28
    });

    // 3. Frequency / Density Scale (for Histogram / Density / Violin)
    let maxFreqOrDensity = 0;
    if (variant === 'histogram') {
      transformedGroups.forEach(g => {
        g.bins.forEach(b => {
          if (b.count > maxFreqOrDensity) maxFreqOrDensity = b.count;
        });
      });
    } else if (variant === 'density' || variant === 'violin') {
      transformedGroups.forEach(g => {
        if (g.kde.maxDensity > maxFreqOrDensity) maxFreqOrDensity = g.kde.maxDensity;
      });
    }

    const scaleFreq = createLinearScale({
      domain: [0, (maxFreqOrDensity || 1) * 1.08],
      range: [plot.plotHeight, 0]
    });

    const valTicks = generateTicks(scaleVal, Math.min(7, Math.floor(plot.plotWidth / 90)));
    const freqTicks = generateTicks(scaleFreq, Math.min(5, Math.floor(plot.plotHeight / 50)));

    return { scaleVal, scaleCat, scaleFreq, valTicks, freqTicks };
  }, [allValues, globalMin, globalMax, activeGroups, variant, transformedGroups, plot]);

  // Keyboard navigation
  const handleKeyDown = createKeyboardRovingFocus({
    itemCount: transformedGroups.length,
    currentIndex: activeElementIndex,
    onIndexChange: (idx) => {
      setActiveElementIndex(idx);
      if (onElementSelect && transformedGroups[idx]) {
        onElementSelect(transformedGroups[idx], idx);
      }
    },
    onSelect: (idx) => {
      setSelectedElementIndex(idx);
      if (onElementSelect && transformedGroups[idx]) {
        onElementSelect(transformedGroups[idx], idx);
      }
    },
    onDismiss: () => {
      setActiveElementIndex(-1);
    },
    onToggleTable: () => {
      setShowTableModal(prev => !prev);
    }
  });

  const activeGroup = activeElementIndex >= 0 ? transformedGroups[activeElementIndex] : null;

  // Render Skeleton
  if (loading) {
    return (
      <div
        className={`mds-dist-plot mds-dist-plot--loading ${className}`}
        style={{ width, height, ...style }}
        role="region"
        aria-label={title || 'Distribution Plot Loading'}
        aria-busy="true"
      >
        <div className="mds-dist-plot__skeleton-header">
          <div className="mds-dist-plot__skeleton-title" />
          <div className="mds-dist-plot__skeleton-sub" />
        </div>
        <div className="mds-dist-plot__skeleton-plot" />
      </div>
    );
  }

  // Render Empty State
  if (!data || data.length === 0 || allValues.length === 0) {
    return (
      <div
        className={`mds-dist-plot mds-dist-plot--empty ${className}`}
        style={{ width, height, ...style }}
        role="region"
        aria-label={title || 'Distribution Plot Empty'}
      >
        {title && <h3 className="mds-dist-plot__title">{title}</h3>}
        <div className="mds-dist-plot__empty-msg">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 20h18M6 20v-6M10 20v-12M14 20v-16M18 20v-8" />
          </svg>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mds-dist-plot mds-dist-plot--${variant} mds-dist-plot--density-${density} ${className}`}
      style={{ width, ...style }}
      role="region"
      aria-roledescription="distribution plot"
      aria-label={title || 'Quantitative distribution visualization'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Chart Header */}
      {(title || subtitle) && (
        <div className="mds-dist-plot__header">
          <div>
            {title && <h3 className="mds-dist-plot__title">{title}</h3>}
            {subtitle && <p className="mds-dist-plot__subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="mds-dist-plot__table-btn"
            onClick={() => setShowTableModal(true)}
            title="View Summary Table (Alt+F11)"
            aria-label="Toggle statistical summary data table"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M3 15h18M9 3v18" />
            </svg>
            Table
          </button>
        </div>
      )}

      {/* Categorical Legend & Isolation Controls */}
      {groupedData.length > 1 && (
        <div className="mds-dist-plot__legend" role="toolbar" aria-label="Group Filter">
          {groupedData.map((g) => {
            const isDimmed = isolatedCategory && isolatedCategory !== g.key;
            return (
              <button
                key={g.key}
                type="button"
                className={`mds-dist-plot__legend-item ${isDimmed ? 'mds-dist-plot__legend-item--dimmed' : ''}`}
                onClick={() => setIsolatedCategory(isolatedCategory === g.key ? null : g.key)}
                aria-pressed={isolatedCategory === g.key}
                title={`Click to isolate ${g.label}`}
              >
                <span className="mds-dist-plot__legend-swatch" style={{ backgroundColor: g.color }} />
                <span className="mds-dist-plot__legend-label">{g.label} ({g.values.length})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        width={width}
        height={height}
        className="mds-dist-plot__svg"
        aria-hidden="true"
      >
        <defs>
          {PATTERN_PRESETS.map((pat) => (
            <pattern
              key={pat.id}
              id={`${chartId}-${pat.id}`}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform={pat.transform || ''}
            >
              {pat.type === 'circle' ? (
                <circle cx="4" cy="4" r={1.2} fill="rgba(255,255,255,0.4)" />
              ) : (
                <line x1="0" y1="4" x2="8" y2="4" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
              )}
            </pattern>
          ))}
          <clipPath id={`${chartId}-clip`}>
            <rect x="0" y="0" width={plot.plotWidth} height={plot.plotHeight} />
          </clipPath>
        </defs>

        <g transform={`translate(${plot.margins.left}, ${plot.margins.top})`}>

          {/* Layer 1: Tolerance Range Bands */}
          {toleranceBands.map((band, idx) => {
            const x1 = scales.scaleVal(band.min);
            const x2 = scales.scaleVal(band.max);
            const bandW = Math.abs(x2 - x1);
            return (
              <g key={`tol-${idx}`}>
                <rect
                  x={Math.min(x1, x2)}
                  y="0"
                  width={bandW}
                  height={plot.plotHeight}
                  fill="rgba(16, 185, 129, 0.08)"
                />
                {band.label && (
                  <text
                    x={Math.min(x1, x2) + bandW / 2}
                    y="14"
                    textAnchor="middle"
                    fill="var(--status-success-solid, #10b981)"
                    className="mds-dist-plot__band-label"
                  >
                    {band.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Layer 1: Gridlines */}
          {showGrid && scales.valTicks.map((tickVal, idx) => {
            const xPos = scales.scaleVal(tickVal);
            return (
              <g key={`x-grid-${idx}`} className="mds-dist-plot__gridline">
                <line x1={xPos} y1="0" x2={xPos} y2={plot.plotHeight} />
              </g>
            );
          })}

          {/* Layer 2: Variant-Specific Visual Marks */}

          {/* VARIANT A: Histogram */}
          {variant === 'histogram' && transformedGroups.map((g, gIdx) => (
            <g key={g.key} className="mds-dist-plot__hist-group">
              {g.bins.map((bin) => {
                const xPos = scales.scaleVal(bin.x0);
                const barW = Math.max(1, scales.scaleVal(bin.x1) - xPos - 1.5);
                const yPos = scales.scaleFreq(bin.count);
                const barH = plot.plotHeight - yPos;

                return (
                  <g key={`bin-${bin.binIndex}`}>
                    <rect
                      x={xPos}
                      y={yPos}
                      width={barW}
                      height={barH}
                      fill={g.color}
                      opacity="0.85"
                      className="mds-dist-plot__bar"
                    />
                    {enablePatterns && (
                      <rect
                        x={xPos}
                        y={yPos}
                        width={barW}
                        height={barH}
                        fill={`url(#${chartId}-${g.pattern})`}
                        opacity="0.6"
                      />
                    )}
                  </g>
                );
              })}
            </g>
          ))}

          {/* VARIANT B: Box Plot (Tukey Quantiles) */}
          {variant === 'box' && transformedGroups.map((g, gIdx) => {
            const stats = g.boxStats;
            const catY = scales.scaleCat(g.key);
            const boxH = Math.min(36, scales.scaleCat.bandwidth());
            const cy = catY + scales.scaleCat.bandwidth() / 2;

            const xMin = scales.scaleVal(stats.min);
            const xLWhisker = scales.scaleVal(stats.lowerWhisker);
            const xQ1 = scales.scaleVal(stats.q1);
            const xMedian = scales.scaleVal(stats.median);
            const xQ3 = scales.scaleVal(stats.q3);
            const xUWhisker = scales.scaleVal(stats.upperWhisker);
            const xMax = scales.scaleVal(stats.max);
            const xMean = stats.mean != null ? scales.scaleVal(stats.mean) : null;

            return (
              <g key={g.key} className="mds-dist-plot__box-group">
                {/* Whiskers Line */}
                <line x1={xLWhisker} y1={cy} x2={xQ1} y2={cy} stroke={g.color} strokeWidth="1.5" />
                <line x1={xQ3} y1={cy} x2={xUWhisker} y2={cy} stroke={g.color} strokeWidth="1.5" />

                {/* Whisker End Caps */}
                <line x1={xLWhisker} y1={cy - boxH / 4} x2={xLWhisker} y2={cy + boxH / 4} stroke={g.color} strokeWidth="1.5" />
                <line x1={xUWhisker} y1={cy - boxH / 4} x2={xUWhisker} y2={cy + boxH / 4} stroke={g.color} strokeWidth="1.5" />

                {/* IQR Box (Q1 to Q3) */}
                <rect
                  x={xQ1}
                  y={cy - boxH / 2}
                  width={Math.max(2, xQ3 - xQ1)}
                  height={boxH}
                  fill={g.color}
                  opacity="0.75"
                  stroke={g.color}
                  strokeWidth="1.5"
                  rx="2"
                />

                {/* Accessible Pattern Overlay */}
                {enablePatterns && (
                  <rect
                    x={xQ1}
                    y={cy - boxH / 2}
                    width={Math.max(2, xQ3 - xQ1)}
                    height={boxH}
                    fill={`url(#${chartId}-${g.pattern})`}
                    opacity="0.6"
                    rx="2"
                  />
                )}

                {/* Median Bar */}
                <line
                  x1={xMedian}
                  y1={cy - boxH / 2}
                  x2={xMedian}
                  y2={cy + boxH / 2}
                  stroke="var(--surface-card, #ffffff)"
                  strokeWidth="3"
                />

                {/* Mean Diamond Indicator */}
                {showMean && xMean != null && (
                  <path
                    d={renderPointSymbol('diamond', xMean, cy, 4)}
                    fill="var(--status-critical-solid, #ef4444)"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                )}

                {/* Outlier Glyphs */}
                {showOutliers && stats.outliers.map((outVal, oIdx) => (
                  <circle
                    key={`out-${oIdx}`}
                    cx={scales.scaleVal(outVal)}
                    cy={cy}
                    r="3.5"
                    fill="none"
                    stroke="var(--status-critical-solid, #ef4444)"
                    strokeWidth="1.5"
                  />
                ))}

                {/* Category Label on Y */}
                <text
                  x="-10"
                  y={cy}
                  dy="0.32em"
                  textAnchor="end"
                  className="mds-dist-plot__cat-label"
                >
                  {g.label}
                </text>
              </g>
            );
          })}

          {/* VARIANT C: Violin Plot (Mirrored KDE Envelope) */}
          {variant === 'violin' && transformedGroups.map((g) => {
            const catY = scales.scaleCat(g.key);
            const maxW = scales.scaleCat.bandwidth() / 2;
            const cy = catY + scales.scaleCat.bandwidth() / 2;
            const stats = g.boxStats;

            const upperPoints = [];
            const lowerPoints = [];

            g.kde.points.forEach(pt => {
              const px = scales.scaleVal(pt.x);
              const offset = (pt.density / (g.kde.maxDensity || 1)) * maxW;
              upperPoints.push({ x: px, y: cy - offset });
              lowerPoints.push({ x: px, y: cy + offset });
            });

            const violinPathD = createAreaPath(upperPoints, lowerPoints, 'monotone');

            return (
              <g key={g.key} className="mds-dist-plot__violin-group">
                {/* Symmetrical KDE Hull */}
                <path d={violinPathD} fill={g.color} opacity="0.65" stroke={g.color} strokeWidth="1.5" />

                {/* Embedded Mini Box & Median */}
                <line
                  x1={scales.scaleVal(stats.q1)}
                  y1={cy}
                  x2={scales.scaleVal(stats.q3)}
                  y2={cy}
                  stroke="var(--text-primary, #0f172a)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <circle
                  cx={scales.scaleVal(stats.median)}
                  cy={cy}
                  r="3.5"
                  fill="var(--surface-card, #ffffff)"
                />

                <text x="-10" y={cy} dy="0.32em" textAnchor="end" className="mds-dist-plot__cat-label">
                  {g.label}
                </text>
              </g>
            );
          })}

          {/* VARIANT D: Strip Plot (Jittered Observations) */}
          {variant === 'strip' && transformedGroups.map((g) => {
            const catY = scales.scaleCat(g.key);
            const cy = catY + scales.scaleCat.bandwidth() / 2;
            const spread = scales.scaleCat.bandwidth() * 0.35;

            return (
              <g key={g.key} className="mds-dist-plot__strip-group">
                {/* Center Guideline */}
                <line x1="0" y1={cy} x2={plot.plotWidth} y2={cy} stroke="var(--border-subtle, #e2e8f0)" strokeDasharray="2 2" />

                {/* Points */}
                {g.values.map((val, idx) => {
                  const seed = (idx * 9301 + 49297) % 233280;
                  const jitter = ((seed / 233280) - 0.5) * 2 * spread;
                  const px = scales.scaleVal(val);
                  const py = cy + jitter;

                  return (
                    <circle
                      key={`strip-pt-${idx}`}
                      cx={px}
                      cy={py}
                      r="3.5"
                      fill={g.color}
                      opacity="0.7"
                      stroke="var(--surface-card, #ffffff)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Category Label */}
                <text x="-10" y={cy} dy="0.32em" textAnchor="end" className="mds-dist-plot__cat-label">
                  {g.label}
                </text>
              </g>
            );
          })}

          {/* VARIANT E: Continuous Density Area */}
          {variant === 'density' && transformedGroups.map((g) => {
            const points = g.kde.points.map(pt => ({
              x: scales.scaleVal(pt.x),
              y: scales.scaleFreq(pt.density)
            }));
            const baselinePoints = g.kde.points.map(pt => ({
              x: scales.scaleVal(pt.x),
              y: plot.plotHeight
            }));

            const areaD = createAreaPath(points, baselinePoints, 'monotone');
            const lineD = createLinePath(points, 'monotone');

            return (
              <g key={g.key} className="mds-dist-plot__density-group">
                <path d={areaD} fill={g.color} opacity="0.35" />
                <path d={lineD} fill="none" stroke={g.color} strokeWidth="2" />
              </g>
            );
          })}

          {/* Layer 3: Reference Lines (Spec Target / Control Limits) */}
          {referenceLines.map((ref, idx) => {
            const xPos = scales.scaleVal(ref.value);
            return (
              <g key={`ref-${idx}`} className="mds-dist-plot__reference-line">
                <line
                  x1={xPos}
                  y1="0"
                  x2={xPos}
                  y2={plot.plotHeight}
                  stroke={ref.color || 'var(--status-critical-solid, #ef4444)'}
                  strokeDasharray="4 3"
                  strokeWidth="1.5"
                />
                {ref.label && (
                  <text
                    x={xPos + 5}
                    y="14"
                    fill={ref.color || 'var(--status-critical-solid, #ef4444)'}
                    className="mds-dist-plot__ref-label"
                  >
                    {ref.label} ({formatVizValue(ref.value, unit, locale)})
                  </text>
                )}
              </g>
            );
          })}

          {/* X Axis (Continuous Values) */}
          <g transform={`translate(0, ${plot.plotHeight})`} className="mds-dist-plot__axis mds-dist-plot__axis--x">
            <line x1="0" y1="0" x2={plot.plotWidth} y2="0" stroke="var(--border-subtle, #cbd5e1)" />
            {scales.valTicks.map((tickVal, idx) => {
              const xPos = scales.scaleVal(tickVal);
              return (
                <g key={`xtick-${idx}`} transform={`translate(${xPos}, 0)`}>
                  <line y2="5" stroke="var(--border-subtle, #cbd5e1)" />
                  <text y="18" textAnchor="middle">{formatVizValue(tickVal, unit, locale)}</text>
                </g>
              );
            })}
            {valueLabel && (
              <text x={plot.plotWidth / 2} y="34" textAnchor="middle" className="mds-dist-plot__axis-title">
                {valueLabel} {unit ? `(${unit})` : ''}
              </text>
            )}
          </g>

          {/* Y Axis for Histogram / Density */}
          {(variant === 'histogram' || variant === 'density') && (
            <g className="mds-dist-plot__axis mds-dist-plot__axis--y">
              <line x1="0" y1="0" x2="0" y2={plot.plotHeight} stroke="var(--border-subtle, #cbd5e1)" />
              {scales.freqTicks.map((tickVal, idx) => {
                const yPos = scales.scaleFreq(tickVal);
                return (
                  <g key={`ytick-${idx}`} transform={`translate(0, ${yPos})`}>
                    <line x2="-5" stroke="var(--border-subtle, #cbd5e1)" />
                    <text x="-9" dy="0.32em" textAnchor="end">{tickVal}</text>
                  </g>
                );
              })}
              <text transform="rotate(-90)" x={-plot.plotHeight / 2} y="-44" textAnchor="middle" className="mds-dist-plot__axis-title">
                {variant === 'histogram' ? 'Frequency (Count)' : 'Density'}
              </text>
            </g>
          )}

        </g>
      </svg>

      {/* Accessible Summary Table Modal (<kbd>Alt+F11</kbd>) */}
      {showTableModal && (
        <div
          className="mds-dist-plot__modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${chartId}-table-title`}
        >
          <div className="mds-dist-plot__modal">
            <div className="mds-dist-plot__modal-header">
              <h4 id={`${chartId}-table-title`}>{title || 'Statistical Distribution Summary'}</h4>
              <button
                type="button"
                className="mds-dist-plot__modal-close"
                onClick={() => setShowTableModal(false)}
                aria-label="Close summary table"
              >
                ✕
              </button>
            </div>
            <div className="mds-dist-plot__modal-body">
              <table className="mds-dist-plot__data-table">
                <thead>
                  <tr>
                    <th>Group</th>
                    <th>Count</th>
                    <th>Min</th>
                    <th>Q1 (25%)</th>
                    <th>Median (50%)</th>
                    <th>Q3 (75%)</th>
                    <th>Max</th>
                    <th>IQR</th>
                    <th>Mean ± SD</th>
                    <th>Outliers</th>
                  </tr>
                </thead>
                <tbody>
                  {transformedGroups.map((g) => {
                    const s = g.boxStats;
                    return (
                      <tr key={g.key}>
                        <td><strong>{g.label}</strong></td>
                        <td>{s.count}</td>
                        <td>{formatVizValue(s.min, unit, locale)}</td>
                        <td>{formatVizValue(s.q1, unit, locale)}</td>
                        <td><strong>{formatVizValue(s.median, unit, locale)}</strong></td>
                        <td>{formatVizValue(s.q3, unit, locale)}</td>
                        <td>{formatVizValue(s.max, unit, locale)}</td>
                        <td>{formatVizValue(s.iqr, unit, locale)}</td>
                        <td>{formatVizValue(s.mean, unit, locale)} ± {s.stdDev.toFixed(2)}</td>
                        <td>
                          {s.outliers.length > 0 ? (
                            <span className="mds-dist-plot__outlier-badge">
                              {s.outliers.length} ({s.outliers.map(o => formatVizValue(o, unit, locale)).join(', ')})
                            </span>
                          ) : (
                            '0'
                          )}
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

      {/* Screen Reader Speech Region */}
      <div className="mds-dist-plot__sr-only" aria-live="polite">
        {activeGroup
          ? `Distribution ${activeGroup.label}: Count ${activeGroup.boxStats.count}, Median ${activeGroup.boxStats.median.toFixed(2)} ${unit}, IQR ${activeGroup.boxStats.iqr.toFixed(2)}, Min ${activeGroup.boxStats.min.toFixed(2)}, Max ${activeGroup.boxStats.max.toFixed(2)}.`
          : ''}
      </div>
    </div>
  );
}
