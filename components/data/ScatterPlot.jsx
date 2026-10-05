import React, { useState, useRef, useId, useMemo } from 'react';
import {
  VIZ_COLORS,
  POINT_SYMBOLS,
  formatVizValue,
  createPlotRegion,
  createLinearScale,
  createLogScale,
  createBandScale,
  createAreaScale,
  generateTicks,
  renderPointSymbol,
  calculateLinearRegression,
  createLinePath,
  createKeyboardRovingFocus,
  LAYER_STACK
} from './viz-core.js';

/**
 * ScatterPlot — Meridian Design System
 *
 * Visualizes observation-level relationships, distributions, correlations,
 * clustering, and multivariate structures across quantitative/ordinal domains.
 *
 * Variants:
 * - 'scatter': Two-variable correlation / clustering with optional categorical series
 * - 'bubble': Three-variable multivariate plot with true area-proportional mark sizing
 * - 'connected': Sequential trajectory scatter connecting observations with directed line
 * - 'jittered': Categorical/ordinal domain with deterministic spatial displacement
 * - 'binned-density': 2D grid density aggregation for high-volume observation datasets
 */
export function ScatterPlot({
  data = [],
  xKey = 'x',
  yKey = 'y',
  sizeKey = null,
  categoryKey = null,
  series = [],
  variant = 'scatter', // 'scatter' | 'bubble' | 'connected' | 'jittered' | 'binned-density'
  width = 640,
  height = 360,
  margins = { top: 24, right: 28, bottom: 44, left: 64 },
  xScaleType = 'linear', // 'linear' | 'log' | 'band'
  yScaleType = 'linear', // 'linear' | 'log'
  xUnit = '',
  yUnit = '',
  sizeUnit = '',
  xLabel = '',
  yLabel = '',
  locale = 'en-IN',
  title,
  subtitle,
  minRadius = 4,
  maxRadius = 22,
  pointOpacity = 0.75,
  showTrendline = false,
  quadrantLines = null, // { x: 2000, y: 3.0, labels: ['Q1', 'Q2', 'Q3', 'Q4'] }
  referenceLines = [], // [{ x?: 2500, y?: 4.5, label: 'UCL Limit', color: 'var(--status-critical-solid)' }]
  showGridX = true,
  showGridY = true,
  jitterAmount = 14,
  binSize = 24,
  densityColorRange = ['rgba(37, 99, 235, 0.15)', 'rgba(37, 99, 235, 0.9)'],
  densityThreshold = 1,
  density = 'standard', // 'compact' | 'standard' | 'expanded'
  emptyMessage = 'No observation records found for the specified parameters.',
  loading = false,
  onPointSelect,
  className = '',
  style = {}
}) {
  const chartId = useId();
  const containerRef = useRef(null);

  const [activePointIndex, setActivePointIndex] = useState(-1);
  const [selectedPointIndex, setSelectedPointIndex] = useState(-1);
  const [isolatedCategory, setIsolatedCategory] = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);

  // Extract / Standardize Category Definitions
  const categories = useMemo(() => {
    if (series && series.length > 0) {
      return series.map((s, idx) => ({
        key: s.key || s.id || `cat_${idx}`,
        label: s.label || s.name || s.key || `Category ${idx + 1}`,
        color: s.color || VIZ_COLORS[idx % VIZ_COLORS.length],
        symbol: s.symbol || POINT_SYMBOLS[idx % POINT_SYMBOLS.length]
      }));
    }
    if (categoryKey && data && data.length > 0) {
      const distinct = Array.from(new Set(data.map(d => d[categoryKey]).filter(Boolean)));
      return distinct.map((cat, idx) => ({
        key: String(cat),
        label: String(cat),
        color: VIZ_COLORS[idx % VIZ_COLORS.length],
        symbol: POINT_SYMBOLS[idx % POINT_SYMBOLS.length]
      }));
    }
    return [{
      key: 'default',
      label: 'Observations',
      color: VIZ_COLORS[0],
      symbol: 'circle'
    }];
  }, [series, categoryKey, data]);

  const categoryMap = useMemo(() => {
    const map = new Map();
    categories.forEach(c => map.set(c.key, c));
    return map;
  }, [categories]);

  // Dimensions & Plot Region
  const plot = useMemo(() => {
    return createPlotRegion({
      containerWidth: width,
      containerHeight: height,
      margins
    });
  }, [width, height, margins]);

  // Pseudo-random deterministic jitter generator for categorical X
  const jitterOffsets = useMemo(() => {
    if (variant !== 'jittered' || !data) return [];
    return data.map((_, i) => {
      // Deterministic PRNG using linear congruential formula
      const seed = (i * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      return (rnd - 0.5) * 2 * jitterAmount;
    });
  }, [variant, data, jitterAmount]);

  // Compute Scales
  const scales = useMemo(() => {
    if (!data || data.length === 0) return { xScale: null, yScale: null, sizeScale: null, xTicks: [], yTicks: [] };

    // 1. X Scale
    let xScale;
    const xValues = data.map(d => d[xKey]);
    if (xScaleType === 'band') {
      const distinctX = Array.from(new Set(xValues));
      xScale = createBandScale({
        domain: distinctX,
        range: [0, plot.plotWidth],
        padding: 0.35
      });
    } else if (xScaleType === 'log') {
      const minX = Math.min(...xValues.map(v => Math.max(1e-4, Number(v))));
      const maxX = Math.max(...xValues.map(Number));
      xScale = createLogScale({
        domain: [minX, maxX],
        range: [0, plot.plotWidth]
      });
    } else {
      const minX = Math.min(...xValues.map(Number));
      const maxX = Math.max(...xValues.map(Number));
      const span = maxX - minX || 1;
      xScale = createLinearScale({
        domain: [minX - span * 0.05, maxX + span * 0.05],
        range: [0, plot.plotWidth]
      });
    }

    // 2. Y Scale
    let yScale;
    const yValues = data.map(d => Number(d[yKey]));
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const spanY = maxY - minY || 1;

    if (yScaleType === 'log') {
      yScale = createLogScale({
        domain: [Math.max(1e-4, minY), maxY],
        range: [plot.plotHeight, 0]
      });
    } else {
      yScale = createLinearScale({
        domain: [minY < 0 ? minY - spanY * 0.06 : Math.max(0, minY - spanY * 0.08), maxY + spanY * 0.08],
        range: [plot.plotHeight, 0]
      });
    }

    // 3. Size / Area Scale (True sqrt area proportionality)
    let sizeScale = () => minRadius;
    if (sizeKey && (variant === 'bubble' || variant === 'scatter')) {
      const sizeValues = data.map(d => Number(d[sizeKey] || 0));
      const minZ = Math.min(...sizeValues);
      const maxZ = Math.max(...sizeValues);
      sizeScale = createAreaScale({
        domain: [minZ, maxZ],
        minRadius,
        maxRadius
      });
    }

    const xTicks = generateTicks(xScale, Math.min(7, Math.floor(plot.plotWidth / 85)));
    const yTicks = generateTicks(yScale, Math.min(6, Math.floor(plot.plotHeight / 48)));

    return { xScale, yScale, sizeScale, xTicks, yTicks };
  }, [data, xKey, yKey, sizeKey, xScaleType, yScaleType, plot, minRadius, maxRadius, variant]);

  // Compute Linear Regression Trendline
  const regression = useMemo(() => {
    if (!showTrendline || !scales.xScale || !scales.yScale || data.length < 2) return null;
    const numericPoints = data
      .map(d => ({ x: Number(d[xKey]), y: Number(d[yKey]) }))
      .filter(p => !isNaN(p.x) && !isNaN(p.y));
    return calculateLinearRegression(numericPoints);
  }, [showTrendline, scales, data, xKey, yKey]);

  // Compute 2D Density Bins for 'binned-density' variant
  const densityBins = useMemo(() => {
    if (variant !== 'binned-density' || !scales.xScale || !scales.yScale || data.length === 0) return [];
    const cols = Math.ceil(plot.plotWidth / binSize);
    const rows = Math.ceil(plot.plotHeight / binSize);
    const grid = Array.from({ length: rows }, () => Array(cols).fill(0));

    let maxCount = 0;
    data.forEach(d => {
      const px = scales.xScale(d[xKey]);
      const py = scales.yScale(d[yKey]);
      const c = Math.floor(px / binSize);
      const r = Math.floor(py / binSize);
      if (c >= 0 && c < cols && r >= 0 && r < rows) {
        grid[r][c] += 1;
        if (grid[r][c] > maxCount) maxCount = grid[r][c];
      }
    });

    const bins = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const count = grid[r][c];
        if (count >= densityThreshold) {
          bins.push({
            x: c * binSize,
            y: r * binSize,
            size: binSize,
            count,
            intensity: count / (maxCount || 1)
          });
        }
      }
    }
    return bins;
  }, [variant, scales, data, xKey, yKey, plot, binSize, densityThreshold]);

  // Calculate Screen Positions for all Observations
  const projectedPoints = useMemo(() => {
    if (!scales.xScale || !scales.yScale || data.length === 0) return [];

    return data.map((d, idx) => {
      let px;
      if (xScaleType === 'band') {
        px = scales.xScale(d[xKey]) + scales.xScale.bandwidth() / 2;
        if (variant === 'jittered') {
          px += (jitterOffsets[idx] || 0);
        }
      } else {
        px = scales.xScale(d[xKey]);
      }

      const py = scales.yScale(d[yKey]);
      const radius = sizeKey ? scales.sizeScale(d[sizeKey]) : minRadius;
      const catKey = categoryKey ? String(d[categoryKey]) : 'default';
      const catDef = categoryMap.get(catKey) || categories[0];

      return {
        idx,
        datum: d,
        x: px,
        y: py,
        radius,
        color: catDef.color,
        symbol: catDef.symbol,
        catKey,
        catLabel: catDef.label
      };
    });
  }, [scales, data, xKey, yKey, sizeKey, categoryKey, categoryMap, categories, xScaleType, variant, jitterOffsets, minRadius]);

  // Sort points by X for 1D/2D keyboard navigation
  const sortedPointIndices = useMemo(() => {
    return projectedPoints
      .map((p, originalIdx) => ({ originalIdx, x: p.x, y: p.y }))
      .sort((a, b) => a.x - b.x);
  }, [projectedPoints]);

  // Connected Scatter Trajectory Path
  const trajectoryPathD = useMemo(() => {
    if (variant !== 'connected' || projectedPoints.length < 2) return '';
    return createLinePath(projectedPoints, 'linear');
  }, [variant, projectedPoints]);

  // Keyboard navigation
  const handleKeyDown = createKeyboardRovingFocus({
    itemCount: sortedPointIndices.length,
    currentIndex: activePointIndex >= 0 ? sortedPointIndices.findIndex(s => s.originalIdx === activePointIndex) : -1,
    onIndexChange: (sortedIdx) => {
      const originalIdx = sortedPointIndices[sortedIdx].originalIdx;
      setActivePointIndex(originalIdx);
      if (onPointSelect && data[originalIdx]) {
        onPointSelect(data[originalIdx], originalIdx);
      }
    },
    onSelect: (sortedIdx) => {
      const originalIdx = sortedPointIndices[sortedIdx].originalIdx;
      setSelectedPointIndex(originalIdx);
      if (onPointSelect && data[originalIdx]) {
        onPointSelect(data[originalIdx], originalIdx);
      }
    },
    onDismiss: () => {
      setActivePointIndex(-1);
    },
    onToggleTable: () => {
      setShowTableModal(prev => !prev);
    }
  });

  const activePoint = activePointIndex >= 0 ? projectedPoints[activePointIndex] : null;

  // Render Skeleton
  if (loading) {
    return (
      <div
        className={`mds-scatter-plot mds-scatter-plot--loading ${className}`}
        style={{ width, height, ...style }}
        role="region"
        aria-label={title || 'Scatter Plot Loading'}
        aria-busy="true"
      >
        <div className="mds-scatter-plot__skeleton-header">
          <div className="mds-scatter-plot__skeleton-title" />
          <div className="mds-scatter-plot__skeleton-sub" />
        </div>
        <div className="mds-scatter-plot__skeleton-plot" />
      </div>
    );
  }

  // Render Empty State
  if (!data || data.length === 0) {
    return (
      <div
        className={`mds-scatter-plot mds-scatter-plot--empty ${className}`}
        style={{ width, height, ...style }}
        role="region"
        aria-label={title || 'Scatter Plot Empty'}
      >
        {title && <h3 className="mds-scatter-plot__title">{title}</h3>}
        <div className="mds-scatter-plot__empty-msg">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="7.5" cy="14.5" r="2.5" />
            <circle cx="16.5" cy="7.5" r="2.5" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mds-scatter-plot mds-scatter-plot--${variant} mds-scatter-plot--density-${density} ${className}`}
      style={{ width, ...style }}
      role="region"
      aria-roledescription="scatter plot"
      aria-label={title || 'Scatter plot multivariate visualization'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Chart Header */}
      {(title || subtitle) && (
        <div className="mds-scatter-plot__header">
          <div>
            {title && <h3 className="mds-scatter-plot__title">{title}</h3>}
            {subtitle && <p className="mds-scatter-plot__subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="mds-scatter-plot__table-btn"
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

      {/* Categorical Legend & Isolation Controls */}
      {categories.length > 1 && (
        <div className="mds-scatter-plot__legend" role="toolbar" aria-label="Category Filters">
          {categories.map((c) => {
            const isDimmed = isolatedCategory && isolatedCategory !== c.key;
            return (
              <button
                key={c.key}
                type="button"
                className={`mds-scatter-plot__legend-item ${isDimmed ? 'mds-scatter-plot__legend-item--dimmed' : ''}`}
                onClick={() => setIsolatedCategory(isolatedCategory === c.key ? null : c.key)}
                aria-pressed={isolatedCategory === c.key}
                title={`Click to isolate ${c.label}`}
              >
                <svg width="16" height="16" viewBox="-8 -8 16 16" className="mds-scatter-plot__legend-icon">
                  <path
                    d={renderPointSymbol(c.symbol, 0, 0, 5)}
                    fill={c.color}
                    stroke="var(--surface-card, #ffffff)"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="mds-scatter-plot__legend-label">{c.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        width={width}
        height={height}
        className="mds-scatter-plot__svg"
        aria-hidden="true"
        onClick={() => setActivePointIndex(-1)}
      >
        <defs>
          <clipPath id={`${chartId}-clip`}>
            <rect x="0" y="0" width={plot.plotWidth} height={plot.plotHeight} />
          </clipPath>
        </defs>

        <g transform={`translate(${plot.margins.left}, ${plot.margins.top})`}>
          {/* Layer 1: Quadrant Reference Lines */}
          {quadrantLines && (
            <g className="mds-scatter-plot__quadrants">
              {quadrantLines.x != null && (
                <line
                  x1={scales.xScale(quadrantLines.x)}
                  y1="0"
                  x2={scales.xScale(quadrantLines.x)}
                  y2={plot.plotHeight}
                  stroke="var(--border-strong, #64748b)"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />
              )}
              {quadrantLines.y != null && (
                <line
                  x1="0"
                  y1={scales.yScale(quadrantLines.y)}
                  x2={plot.plotWidth}
                  y2={scales.yScale(quadrantLines.y)}
                  stroke="var(--border-strong, #64748b)"
                  strokeDasharray="4 4"
                  strokeWidth="1.5"
                />
              )}
            </g>
          )}

          {/* Layer 1: Gridlines */}
          {showGridY && scales.yTicks.map((tickVal, idx) => {
            const yPos = scales.yScale(tickVal);
            return (
              <g key={`y-grid-${idx}`} className="mds-scatter-plot__gridline">
                <line x1="0" y1={yPos} x2={plot.plotWidth} y2={yPos} />
              </g>
            );
          })}
          {showGridX && scales.xTicks.map((tickVal, idx) => {
            const xPos = scales.xScale(tickVal);
            return (
              <g key={`x-grid-${idx}`} className="mds-scatter-plot__gridline">
                <line x1={xPos} y1="0" x2={xPos} y2={plot.plotHeight} />
              </g>
            );
          })}

          {/* Layer 1b: 2D Density Bins (if binned-density) */}
          {variant === 'binned-density' && densityBins.map((bin, idx) => (
            <rect
              key={`bin-${idx}`}
              x={bin.x}
              y={bin.y}
              width={bin.size}
              height={bin.size}
              fill="var(--viz-1, #2563eb)"
              opacity={0.12 + bin.intensity * 0.78}
              stroke="var(--surface-card, #ffffff)"
              strokeWidth="0.5"
            />
          ))}

          {/* Layer 2: Trajectory Line (Connected Scatter) */}
          {variant === 'connected' && trajectoryPathD && (
            <g clipPath={`url(#${chartId}-clip)`}>
              <path
                d={trajectoryPathD}
                fill="none"
                stroke="var(--viz-1, #2563eb)"
                strokeWidth="2"
                strokeDasharray="none"
                opacity="0.8"
              />
            </g>
          )}

          {/* Layer 2: Statistical Linear Regression Trendline */}
          {regression && scales.xScale && scales.yScale && (
            <g className="mds-scatter-plot__trendline" clipPath={`url(#${chartId}-clip)`}>
              {(() => {
                const [minX, maxX] = scales.xScale.domain();
                const x1 = scales.xScale(minX);
                const y1 = scales.yScale(regression.predict(minX));
                const x2 = scales.xScale(maxX);
                const y2 = scales.yScale(regression.predict(maxX));
                return (
                  <>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="var(--status-critical-solid, #ef4444)"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                    />
                    <text
                      x={plot.plotWidth - 8}
                      y={20}
                      textAnchor="end"
                      fill="var(--status-critical-solid, #ef4444)"
                      className="mds-scatter-plot__trend-label"
                    >
                      Linear Fit: R² = {regression.rSquared.toFixed(3)}
                    </text>
                  </>
                );
              })()}
            </g>
          )}

          {/* Layer 3: Reference Lines */}
          {referenceLines.map((ref, idx) => {
            if (ref.y != null) {
              const yPos = scales.yScale(ref.y);
              return (
                <g key={`ref-y-${idx}`} className="mds-scatter-plot__reference-line">
                  <line x1="0" y1={yPos} x2={plot.plotWidth} y2={yPos} stroke={ref.color || 'var(--status-critical-solid)'} strokeDasharray="4 3" strokeWidth="1.5" />
                  {ref.label && <text x={plot.plotWidth - 6} y={yPos - 5} textAnchor="end" fill={ref.color || 'var(--status-critical-solid)'} className="mds-scatter-plot__ref-label">{ref.label}</text>}
                </g>
              );
            }
            if (ref.x != null) {
              const xPos = scales.xScale(ref.x);
              return (
                <g key={`ref-x-${idx}`} className="mds-scatter-plot__reference-line">
                  <line x1={xPos} y1="0" x2={xPos} y2={plot.plotHeight} stroke={ref.color || 'var(--status-critical-solid)'} strokeDasharray="4 3" strokeWidth="1.5" />
                  {ref.label && <text x={xPos + 5} y={15} fill={ref.color || 'var(--status-critical-solid)'} className="mds-scatter-plot__ref-label">{ref.label}</text>}
                </g>
              );
            }
            return null;
          })}

          {/* Layer 4: Observation Point Marks */}
          <g clipPath={`url(#${chartId}-clip)`}>
            {projectedPoints.map((pt) => {
              const isDimmed = isolatedCategory && isolatedCategory !== pt.catKey;
              const isActive = activePointIndex === pt.idx;
              const isSelected = selectedPointIndex === pt.idx;

              return (
                <path
                  key={`pt-${pt.idx}`}
                  d={renderPointSymbol(pt.symbol, pt.x, pt.y, isActive ? pt.radius + 3 : pt.radius)}
                  fill={pt.color}
                  fillOpacity={isDimmed ? 0.15 : pointOpacity}
                  stroke={isActive || isSelected ? 'var(--text-primary, #0f172a)' : 'var(--surface-card, #ffffff)'}
                  strokeWidth={isActive || isSelected ? 2.5 : 1.2}
                  className="mds-scatter-plot__point"
                  style={{ cursor: 'pointer', transition: 'transform 100ms ease' }}
                  onPointerEnter={(e) => {
                    e.stopPropagation();
                    setActivePointIndex(pt.idx);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPointIndex(pt.idx);
                    if (onPointSelect) onPointSelect(pt.datum, pt.idx);
                  }}
                />
              );
            })}
          </g>

          {/* Active Highlight Ring */}
          {activePoint && (
            <g className="mds-scatter-plot__active-marker">
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r={activePoint.radius + 6}
                fill="none"
                stroke="var(--action-solid, #2563eb)"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            </g>
          )}

          {/* X Axis */}
          <g transform={`translate(0, ${plot.plotHeight})`} className="mds-scatter-plot__axis mds-scatter-plot__axis--x">
            <line x1="0" y1="0" x2={plot.plotWidth} y2="0" stroke="var(--border-subtle, #cbd5e1)" />
            {scales.xTicks.map((tickVal, idx) => {
              const xPos = scales.xScale(tickVal);
              return (
                <g key={`xtick-${idx}`} transform={`translate(${xPos}, 0)`}>
                  <line y2="5" stroke="var(--border-subtle, #cbd5e1)" />
                  <text y="18" textAnchor="middle">{formatVizValue(tickVal, xUnit, locale)}</text>
                </g>
              );
            })}
            {xLabel && (
              <text x={plot.plotWidth / 2} y="34" textAnchor="middle" className="mds-scatter-plot__axis-title">
                {xLabel} {xUnit ? `(${xUnit})` : ''}
              </text>
            )}
          </g>

          {/* Y Axis */}
          <g className="mds-scatter-plot__axis mds-scatter-plot__axis--y">
            <line x1="0" y1="0" x2="0" y2={plot.plotHeight} stroke="var(--border-subtle, #cbd5e1)" />
            {scales.yTicks.map((tickVal, idx) => {
              const yPos = scales.yScale(tickVal);
              return (
                <g key={`ytick-${idx}`} transform={`translate(0, ${yPos})`}>
                  <line x2="-5" stroke="var(--border-subtle, #cbd5e1)" />
                  <text x="-9" dy="0.32em" textAnchor="end">{formatVizValue(tickVal, yUnit, locale)}</text>
                </g>
              );
            })}
            {yLabel && (
              <text
                transform={`rotate(-90)`}
                x={-plot.plotHeight / 2}
                y="-46"
                textAnchor="middle"
                className="mds-scatter-plot__axis-title"
              >
                {yLabel} {yUnit ? `(${yUnit})` : ''}
              </text>
            )}
          </g>
        </g>
      </svg>

      {/* Layer 5: Tooltip Overlay */}
      {activePoint && (
        <div
          className="mds-scatter-plot__tooltip"
          style={{
            left: Math.min(plot.toCanvasX(activePoint.x) + 14, width - 220),
            top: Math.max(10, plot.toCanvasY(activePoint.y) - 30)
          }}
          role="tooltip"
        >
          <div className="mds-scatter-plot__tooltip-header">
            <strong>{activePoint.catLabel} · Obs #{activePoint.idx + 1}</strong>
          </div>
          <div className="mds-scatter-plot__tooltip-body">
            <div className="mds-scatter-plot__tooltip-row">
              <span>{xLabel || xKey}:</span>
              <strong>{formatVizValue(activePoint.datum[xKey], xUnit, locale)}</strong>
            </div>
            <div className="mds-scatter-plot__tooltip-row">
              <span>{yLabel || yKey}:</span>
              <strong>{formatVizValue(activePoint.datum[yKey], yUnit, locale)}</strong>
            </div>
            {sizeKey && (
              <div className="mds-scatter-plot__tooltip-row">
                <span>{sizeKey}:</span>
                <strong>{formatVizValue(activePoint.datum[sizeKey], sizeUnit, locale)}</strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accessible Data Table Modal (<kbd>Alt+F11</kbd>) */}
      {showTableModal && (
        <div
          className="mds-scatter-plot__modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${chartId}-table-title`}
        >
          <div className="mds-scatter-plot__modal">
            <div className="mds-scatter-plot__modal-header">
              <h4 id={`${chartId}-table-title`}>{title || 'Scatter Plot Observation Records'}</h4>
              <button
                type="button"
                className="mds-scatter-plot__modal-close"
                onClick={() => setShowTableModal(false)}
                aria-label="Close data table"
              >
                ✕
              </button>
            </div>
            <div className="mds-scatter-plot__modal-body">
              <table className="mds-scatter-plot__data-table">
                <thead>
                  <tr>
                    <th>Obs #</th>
                    {categoryKey && <th>Category</th>}
                    <th>{xLabel || xKey} ({xUnit || 'Units'})</th>
                    <th>{yLabel || yKey} ({yUnit || 'Units'})</th>
                    {sizeKey && <th>{sizeKey} ({sizeUnit || 'Magnitude'})</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, rowIdx) => (
                    <tr key={rowIdx}>
                      <td>#{rowIdx + 1}</td>
                      {categoryKey && <td>{String(d[categoryKey])}</td>}
                      <td>{formatVizValue(d[xKey], xUnit, locale)}</td>
                      <td>{formatVizValue(d[yKey], yUnit, locale)}</td>
                      {sizeKey && <td>{formatVizValue(d[sizeKey], sizeUnit, locale)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Screen Reader Live Region */}
      <div className="mds-scatter-plot__sr-only" aria-live="polite">
        {activePoint
          ? `Observation ${activePoint.idx + 1} of ${data.length}: ${activePoint.catLabel}. ${xLabel || xKey}: ${activePoint.datum[xKey]} ${xUnit}, ${yLabel || yKey}: ${activePoint.datum[yKey]} ${yUnit}.`
          : ''}
      </div>
    </div>
  );
}
