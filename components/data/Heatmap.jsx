import React, { useState, useRef, useId, useMemo } from 'react';
import {
  VIZ_COLORS,
  formatVizValue,
  createPlotRegion,
  createBandScale,
  createSequentialColorScale,
  createDivergingColorScale,
  generateTicks,
  createKeyboardRovingFocus,
  LAYER_STACK
} from './viz-core.js';

/**
 * Heatmap — Meridian Design System
 *
 * Visualizes patterns, intensity gradients, correlations, and anomalies across
 * two-dimensional categorical, ordinal, or discretized quantitative structures.
 *
 * Variants:
 * - 'matrix': Standard 2D grid (Row Dimension × Column Dimension)
 * - 'clustered': Hierarchically ordered matrix grouping similar rows and columns
 * - 'calendar': Temporal matrix mapping days of week against weeks of year/month
 * - 'correlation': Symmetric square matrix for correlation coefficients r in [-1, +1]
 */
export function Heatmap({
  data = [], // [{ row: 'CNC-01', col: '06:00', value: 42.5 }, ...] or 2D matrix
  rows = [], // Explicit row labels
  cols = [], // Explicit col labels
  rowKey = 'row',
  colKey = 'col',
  valueKey = 'value',
  variant = 'matrix', // 'matrix' | 'clustered' | 'calendar' | 'correlation'
  colorScaleType = 'sequential', // 'sequential' | 'diverging'
  colorRange = ['#eff6ff', '#1d4ed8'], // [minColor, maxColor] or [neg, neutral, pos]
  domain = null, // [minVal, maxVal]
  neutralValue = 0,
  cellPadding = 2,
  cellRadius = 2,
  showCellValues = false,
  width = 640,
  height = 360,
  margins = { top: 32, right: 80, bottom: 48, left: 80 },
  unit = '',
  rowLabel = 'Row Dimension',
  colLabel = 'Column Dimension',
  valueLabel = 'Intensity Value',
  locale = 'en-IN',
  title,
  subtitle,
  missingCellLabel = 'No Record / Down',
  showLegend = true,
  density = 'standard', // 'compact' | 'standard' | 'expanded'
  emptyMessage = 'No matrix observation records found.',
  loading = false,
  onCellSelect,
  className = '',
  style = {}
}) {
  const chartId = useId();
  const containerRef = useRef(null);

  const [activeCellCoord, setActiveCellCoord] = useState(null); // { rIdx, cIdx }
  const [selectedCellCoord, setSelectedCellCoord] = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);

  // Extract distinct row & column labels
  const rowLabels = useMemo(() => {
    if (rows && rows.length > 0) return rows;
    if (!data || data.length === 0) return [];
    return Array.from(new Set(data.map(d => String(d[rowKey])))).filter(Boolean);
  }, [rows, data, rowKey]);

  const colLabels = useMemo(() => {
    if (cols && cols.length > 0) return cols;
    if (!data || data.length === 0) return [];
    return Array.from(new Set(data.map(d => String(d[colKey])))).filter(Boolean);
  }, [cols, data, colKey]);

  // Compute 2D Data Grid Matrix Lookup
  const { gridMatrix, allValues, minVal, maxVal } = useMemo(() => {
    const map = new Map();
    const vals = [];

    data.forEach(d => {
      const r = String(d[rowKey]);
      const c = String(d[colKey]);
      const v = d[valueKey] != null ? Number(d[valueKey]) : null;
      map.set(`${r}:::${c}`, { datum: d, value: v });
      if (v != null && !isNaN(v)) vals.push(v);
    });

    const matrix = rowLabels.map(r => {
      return colLabels.map(c => {
        const item = map.get(`${r}:::${c}`);
        return item || { datum: { [rowKey]: r, [colKey]: c }, value: null };
      });
    });

    let minV = 0, maxV = 100;
    if (vals.length > 0) {
      minV = Math.min(...vals);
      maxV = Math.max(...vals);
    }
    if (domain) {
      minV = domain[0];
      maxV = domain[1];
    } else if (variant === 'correlation') {
      minV = -1;
      maxV = 1;
    }

    return { gridMatrix: matrix, allValues: vals, minVal: minV, maxVal: maxV };
  }, [data, rowLabels, colLabels, rowKey, colKey, valueKey, domain, variant]);

  // Dimensions & Plot Region
  const plot = useMemo(() => {
    return createPlotRegion({
      containerWidth: width,
      containerHeight: height,
      margins
    });
  }, [width, height, margins]);

  // Compute Scales
  const scales = useMemo(() => {
    if (rowLabels.length === 0 || colLabels.length === 0) {
      return { scaleX: null, scaleY: null, colorScale: null };
    }

    const scaleX = createBandScale({
      domain: colLabels,
      range: [0, plot.plotWidth],
      padding: 0
    });

    const scaleY = createBandScale({
      domain: rowLabels,
      range: [0, plot.plotHeight],
      padding: 0
    });

    let colorScale;
    if (colorScaleType === 'diverging' || variant === 'correlation') {
      colorScale = createDivergingColorScale({
        domain: [minVal, maxVal],
        colors: colorRange.length >= 3 ? colorRange : ['#ef4444', '#f8fafc', '#2563eb'],
        neutral: neutralValue
      });
    } else {
      colorScale = createSequentialColorScale({
        domain: [minVal, maxVal],
        colors: colorRange.length >= 2 ? colorRange : ['#eff6ff', '#1d4ed8']
      });
    }

    return { scaleX, scaleY, colorScale };
  }, [rowLabels, colLabels, plot, colorScaleType, variant, minVal, maxVal, colorRange, neutralValue]);

  // Total Cells Count for Keyboard Roving Focus
  const totalCells = rowLabels.length * colLabels.length;
  const current1DIndex = activeCellCoord ? activeCellCoord.rIdx * colLabels.length + activeCellCoord.cIdx : -1;

  // 2D Keyboard Handler
  const handleKeyDown = (e) => {
    if (rowLabels.length === 0 || colLabels.length === 0) return;

    let r = activeCellCoord ? activeCellCoord.rIdx : 0;
    let c = activeCellCoord ? activeCellCoord.cIdx : 0;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        c = (c + 1) % colLabels.length;
        setActiveCellCoord({ rIdx: r, cIdx: c });
        break;
      case 'ArrowLeft':
        e.preventDefault();
        c = (c - 1 + colLabels.length) % colLabels.length;
        setActiveCellCoord({ rIdx: r, cIdx: c });
        break;
      case 'ArrowDown':
        e.preventDefault();
        r = (r + 1) % rowLabels.length;
        setActiveCellCoord({ rIdx: r, cIdx: c });
        break;
      case 'ArrowUp':
        e.preventDefault();
        r = (r - 1 + rowLabels.length) % rowLabels.length;
        setActiveCellCoord({ rIdx: r, cIdx: c });
        break;
      case 'Home':
        e.preventDefault();
        setActiveCellCoord({ rIdx: 0, cIdx: 0 });
        break;
      case 'End':
        e.preventDefault();
        setActiveCellCoord({ rIdx: rowLabels.length - 1, cIdx: colLabels.length - 1 });
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeCellCoord) {
          setSelectedCellCoord(activeCellCoord);
          const cellItem = gridMatrix[activeCellCoord.rIdx][activeCellCoord.cIdx];
          if (onCellSelect) onCellSelect(cellItem.datum, activeCellCoord);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setActiveCellCoord(null);
        break;
      case 'F11':
        if (e.altKey) {
          e.preventDefault();
          setShowTableModal(prev => !prev);
        }
        break;
      default:
        break;
    }
  };

  const activeCell = (activeCellCoord && gridMatrix[activeCellCoord.rIdx])
    ? gridMatrix[activeCellCoord.rIdx][activeCellCoord.cIdx]
    : null;

  // Render Skeleton
  if (loading) {
    return (
      <div
        className={`mds-heatmap mds-heatmap--loading ${className}`}
        style={{ width, height, ...style }}
        role="region"
        aria-label={title || 'Heatmap Loading'}
        aria-busy="true"
      >
        <div className="mds-heatmap__skeleton-header">
          <div className="mds-heatmap__skeleton-title" />
          <div className="mds-heatmap__skeleton-sub" />
        </div>
        <div className="mds-heatmap__skeleton-plot" />
      </div>
    );
  }

  // Render Empty State
  if (!data || data.length === 0 || rowLabels.length === 0 || colLabels.length === 0) {
    return (
      <div
        className={`mds-heatmap mds-heatmap--empty ${className}`}
        style={{ width, height, ...style }}
        role="region"
        aria-label={title || 'Heatmap Empty'}
      >
        {title && <h3 className="mds-heatmap__title">{title}</h3>}
        <div className="mds-heatmap__empty-msg">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  const cellWidth = scales.scaleX.bandwidth();
  const cellHeight = scales.scaleY.bandwidth();

  return (
    <div
      ref={containerRef}
      className={`mds-heatmap mds-heatmap--${variant} mds-heatmap--density-${density} ${className}`}
      style={{ width, ...style }}
      role="region"
      aria-roledescription="heatmap"
      aria-label={title || '2D Heatmap Matrix Visualization'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Chart Header */}
      {(title || subtitle) && (
        <div className="mds-heatmap__header">
          <div>
            {title && <h3 className="mds-heatmap__title">{title}</h3>}
            {subtitle && <p className="mds-heatmap__subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="mds-heatmap__table-btn"
            onClick={() => setShowTableModal(true)}
            title="View as Data Table (Alt+F11)"
            aria-label="Toggle accessible tabular heatmap"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M3 15h18M9 3v18" />
            </svg>
            Table
          </button>
        </div>
      )}

      {/* SVG Heatmap Grid */}
      <svg
        width={width}
        height={height}
        className="mds-heatmap__svg"
        aria-hidden="true"
        onClick={() => setActiveCellCoord(null)}
      >
        <defs>
          {/* Missing cell hatch pattern */}
          <pattern id={`${chartId}-missing-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45 0 0)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--border-strong, #94a3b8)" strokeWidth="1.2" opacity="0.4" />
          </pattern>

          {/* Color Gradient Legend Ramp */}
          <linearGradient id={`${chartId}-legend-grad`} x1="0" y1="1" x2="0" y2="0">
            {colorScaleType === 'diverging' || variant === 'correlation' ? (
              <>
                <stop offset="0%" stopColor={colorRange[0] || '#ef4444'} />
                <stop offset="50%" stopColor={colorRange[1] || '#f8fafc'} />
                <stop offset="100%" stopColor={colorRange[2] || '#2563eb'} />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor={colorRange[0] || '#eff6ff'} />
                <stop offset="100%" stopColor={colorRange[1] || '#1d4ed8'} />
              </>
            )}
          </linearGradient>
        </defs>

        <g transform={`translate(${plot.margins.left}, ${plot.margins.top})`}>

          {/* Matrix Cells */}
          {gridMatrix.map((rowCells, rIdx) => {
            const rLabel = rowLabels[rIdx];
            const yPos = scales.scaleY(rLabel);

            return (
              <g key={`row-${rLabel}`} className="mds-heatmap__row" role="row">
                {rowCells.map((cell, cIdx) => {
                  const cLabel = colLabels[cIdx];
                  const xPos = scales.scaleX(cLabel);
                  const isNull = cell.value == null || isNaN(cell.value);
                  const fill = isNull ? `url(#${chartId}-missing-hatch)` : scales.colorScale(cell.value);
                  const isActive = activeCellCoord && activeCellCoord.rIdx === rIdx && activeCellCoord.cIdx === cIdx;
                  const isSelected = selectedCellCoord && selectedCellCoord.rIdx === rIdx && selectedCellCoord.cIdx === cIdx;

                  // High-contrast text color threshold calculation
                  let textColor = 'var(--text-primary, #0f172a)';
                  if (!isNull) {
                    const normalizedRatio = (cell.value - minVal) / (maxVal - minVal || 1);
                    if (normalizedRatio > 0.55 || (colorScaleType === 'diverging' && Math.abs(cell.value) > 0.6)) {
                      textColor = '#ffffff';
                    }
                  }

                  return (
                    <g
                      key={`cell-${rLabel}-${cLabel}`}
                      transform={`translate(${xPos + cellPadding / 2}, ${yPos + cellPadding / 2})`}
                      className="mds-heatmap__cell-group"
                      onPointerEnter={(e) => {
                        e.stopPropagation();
                        setActiveCellCoord({ rIdx, cIdx });
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCellCoord({ rIdx, cIdx });
                        if (onCellSelect) onCellSelect(cell.datum, { rIdx, cIdx });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect
                        width={Math.max(2, cellWidth - cellPadding)}
                        height={Math.max(2, cellHeight - cellPadding)}
                        rx={cellRadius}
                        fill={fill}
                        stroke={isActive || isSelected ? 'var(--text-primary, #0f172a)' : 'rgba(0,0,0,0.06)'}
                        strokeWidth={isActive || isSelected ? 2 : 1}
                        className="mds-heatmap__cell"
                      />
                      {/* Optional In-Cell Text Values */}
                      {showCellValues && !isNull && cellWidth > 28 && cellHeight > 18 && (
                        <text
                          x={(cellWidth - cellPadding) / 2}
                          y={(cellHeight - cellPadding) / 2}
                          dy="0.32em"
                          textAnchor="middle"
                          fill={textColor}
                          className="mds-heatmap__cell-text"
                          style={{ fontSize: Math.min(11, Math.max(9, cellHeight * 0.45)), pointerEvents: 'none' }}
                        >
                          {cell.value.toFixed(1)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Row Labels (Y Axis) */}
          {rowLabels.map((rLabel) => {
            const yPos = scales.scaleY(rLabel) + cellHeight / 2;
            return (
              <text
                key={`ylabel-${rLabel}`}
                x="-10"
                y={yPos}
                dy="0.32em"
                textAnchor="end"
                className="mds-heatmap__row-label"
              >
                {rLabel}
              </text>
            );
          })}

          {/* Column Labels (X Axis Top & Bottom) */}
          {colLabels.map((cLabel) => {
            const xPos = scales.scaleX(cLabel) + cellWidth / 2;
            return (
              <text
                key={`xlabel-${cLabel}`}
                x={xPos}
                y={plot.plotHeight + 18}
                textAnchor="middle"
                className="mds-heatmap__col-label"
              >
                {cLabel}
              </text>
            );
          })}

          {/* Continuous Color Gradient Legend Ramp */}
          {showLegend && (
            <g transform={`translate(${plot.plotWidth + 24}, 10)`} className="mds-heatmap__legend-group">
              <text x="0" y="-6" className="mds-heatmap__legend-title">{unit || 'Intensity'}</text>
              <rect
                x="0"
                y="0"
                width="12"
                height={plot.plotHeight - 20}
                fill={`url(#${chartId}-legend-grad)`}
                stroke="var(--border-subtle, #cbd5e1)"
                rx="2"
              />
              <text x="18" y="8" dy="0.32em" className="mds-heatmap__legend-tick">
                {formatVizValue(maxVal, unit, locale)}
              </text>
              {colorScaleType === 'diverging' && (
                <text x="18" y={(plot.plotHeight - 20) / 2} dy="0.32em" className="mds-heatmap__legend-tick">
                  {formatVizValue(neutralValue, unit, locale)}
                </text>
              )}
              <text x="18" y={plot.plotHeight - 24} dy="0.32em" className="mds-heatmap__legend-tick">
                {formatVizValue(minVal, unit, locale)}
              </text>
            </g>
          )}

        </g>
      </svg>

      {/* Layer 5: Tooltip Overlay */}
      {activeCell && activeCellCoord && (
        <div
          className="mds-heatmap__tooltip"
          style={{
            left: Math.min(plot.toCanvasX(scales.scaleX(colLabels[activeCellCoord.cIdx])) + cellWidth / 2 + 10, width - 200),
            top: Math.max(10, plot.toCanvasY(scales.scaleY(rowLabels[activeCellCoord.rIdx])) - 15)
          }}
          role="tooltip"
        >
          <div className="mds-heatmap__tooltip-header">
            <strong>{rowLabels[activeCellCoord.rIdx]} × {colLabels[activeCellCoord.cIdx]}</strong>
          </div>
          <div className="mds-heatmap__tooltip-body">
            <div className="mds-heatmap__tooltip-row">
              <span>{valueLabel}:</span>
              <strong>
                {activeCell.value != null ? formatVizValue(activeCell.value, unit, locale) : missingCellLabel}
              </strong>
            </div>
            {variant === 'correlation' && activeCell.value != null && (
              <div className="mds-heatmap__tooltip-row mds-heatmap__tooltip-row--sub">
                <span>Correlation:</span>
                <em>{activeCell.value > 0.7 ? 'Strong Positive' : activeCell.value < -0.7 ? 'Strong Negative' : 'Weak / Neutral'}</em>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accessible Tabular Heatmap Modal (<kbd>Alt+F11</kbd>) */}
      {showTableModal && (
        <div
          className="mds-heatmap__modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${chartId}-table-title`}
        >
          <div className="mds-heatmap__modal">
            <div className="mds-heatmap__modal-header">
              <h4 id={`${chartId}-table-title`}>{title || 'Heatmap 2D Matrix Table'}</h4>
              <button
                type="button"
                className="mds-heatmap__modal-close"
                onClick={() => setShowTableModal(false)}
                aria-label="Close matrix data table"
              >
                ✕
              </button>
            </div>
            <div className="mds-heatmap__modal-body">
              <table className="mds-heatmap__data-table">
                <thead>
                  <tr>
                    <th>{rowLabel}</th>
                    {colLabels.map(col => <th key={col}>{col}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {gridMatrix.map((rowCells, rIdx) => (
                    <tr key={rowLabels[rIdx]}>
                      <td><strong>{rowLabels[rIdx]}</strong></td>
                      {rowCells.map((cell, cIdx) => (
                        <td key={colLabels[cIdx]}>
                          {cell.value != null ? formatVizValue(cell.value, unit, locale) : '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Screen Reader Live Region */}
      <div className="mds-heatmap__sr-only" aria-live="polite">
        {activeCell && activeCellCoord
          ? `Selected matrix cell ${rowLabels[activeCellCoord.rIdx]}, ${colLabels[activeCellCoord.cIdx]}: ${activeCell.value != null ? `${activeCell.value} ${unit}` : missingCellLabel}.`
          : ''}
      </div>
    </div>
  );
}
