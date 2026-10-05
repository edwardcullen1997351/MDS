/* eslint-disable jsx-a11y/no-noninteractive-element-interactions -- keyboard-operated visualization surface; interactive controls retain native semantics */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- chart region is intentionally keyboard reachable */
import React, { useState, useRef, useId, useMemo } from 'react';
import {
  formatVizValue,
  createPlotRegion,
  createBandScale,
  createSequentialColorScale,
  createDivergingColorScale,
  useResponsiveVizBounds
} from '../../utils/viz-core.js';

export type HeatmapVariant = 'matrix' | 'clustered' | 'calendar' | 'correlation';
export type HeatmapColorScaleType = 'sequential' | 'diverging';
export type HeatmapDensity = 'compact' | 'standard' | 'expanded';

export interface HeatmapProps {
  data: Array<Record<string, any>>;
  rows?: string[];
  cols?: string[];
  rowKey?: string;
  colKey?: string;
  valueKey?: string;
  variant?: HeatmapVariant;
  colorScaleType?: HeatmapColorScaleType;
  colorRange?: string[];
  domain?: [number, number] | null;
  neutralValue?: number;
  cellPadding?: number;
  cellRadius?: number;
  showCellValues?: boolean;
  width?: number;
  height?: number;
  margins?: { top?: number; right?: number; bottom?: number; left?: number };
  unit?: string;
  rowLabel?: string;
  colLabel?: string;
  valueLabel?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
  missingCellLabel?: string;
  showLegend?: boolean;
  showDataTable?: boolean;
  density?: HeatmapDensity;
  emptyMessage?: string;
  loading?: boolean;
  rotateXLabels?: boolean | 'auto';
  xLabelAngle?: number;
  onCellSelect?: (datum: Record<string, any>, coords: { rIdx: number; cIdx: number }) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function getContrastTextColor(colorStr: string): string {
  if (!colorStr || colorStr === 'transparent' || colorStr.startsWith('url(')) {
    return 'var(--text-primary, #0f172a)';
  }
  let r = 255, g = 255, b = 255;
  if (colorStr.startsWith('#')) {
    const hex = colorStr.replace('#', '');
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length >= 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    }
  } else if (colorStr.startsWith('rgb')) {
    const match = colorStr.match(/\d+/g);
    if (match && match.length >= 3) {
      r = parseInt(match[0], 10);
      g = parseInt(match[1], 10);
      b = parseInt(match[2], 10);
    }
  }
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 145 ? '#ffffff' : 'var(--text-primary, #0f172a)';
}

export function formatCellValue(val: number | null, variant: HeatmapVariant = 'matrix'): string {
  if (val == null || isNaN(val)) return '';
  if (variant === 'correlation') {
    return val.toFixed(2);
  }
  if (Number.isInteger(val)) {
    return val.toString();
  }
  return val.toFixed(1);
}

/**
 * Heatmap — Meridian Design System
 *
 * Visualizes patterns, intensity gradients, correlations, and anomalies across
 * two-dimensional categorical, ordinal, or discretized quantitative structures.
 */
export const Heatmap: React.FC<HeatmapProps> = ({
  data = [],
  rows = [],
  cols = [],
  rowKey = 'row',
  colKey = 'col',
  valueKey = 'value',
  variant = 'matrix',
  colorScaleType = 'sequential',
  colorRange = ['#eff6ff', '#1d4ed8'],
  domain = null,
  neutralValue = 0,
  cellPadding = 2,
  cellRadius = 2,
  showCellValues = false,
  width = 640,
  height = 360,
  margins,
  unit = '',
  rowLabel = 'Row Dimension',
  colLabel: _colLabel = 'Column Dimension',
  valueLabel = 'Intensity Value',
  locale = 'en-IN',
  title,
  subtitle,
  missingCellLabel = 'No Record / Down',
  showLegend = true,
  showDataTable = true,
  density = 'standard',
  emptyMessage = 'No matrix observation records found.',
  loading = false,
  rotateXLabels = 'auto',
  xLabelAngle = -45,
  onCellSelect,
  className = '',
  style = {}
}) => {
  const chartId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: measuredWidth, height: measuredHeight, densityTier } = useResponsiveVizBounds(containerRef, typeof width === 'number' ? width : 640, typeof height === 'number' ? height : 360);

  const plotWidth = Math.max(280, measuredWidth || (typeof width === 'number' ? width : 640));
  const plotHeight = Math.max(180, measuredHeight || (typeof height === 'number' ? height : 360));

  const [activeCellCoord, setActiveCellCoord] = useState<{ rIdx: number; cIdx: number } | null>(null);
  const [selectedCellCoord, setSelectedCellCoord] = useState<{ rIdx: number; cIdx: number } | null>(null);

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

  const maxRowLabelLen = useMemo(() => {
    return Math.max(0, ...rowLabels.map(l => String(l).length));
  }, [rowLabels]);

  const resolvedMargins = useMemo(() => {
    const isMobile = densityTier === 'compact';
    const defaultRight = showLegend ? (isMobile ? 50 : 80) : 24;
    const isRotatedExpected = rotateXLabels === true || (rotateXLabels === 'auto' && (isMobile || colLabels.length > 6));
    const autoLeft = isMobile
      ? Math.max(54, Math.min(120, Math.round(maxRowLabelLen * 5.5 + 16)))
      : Math.max(88, Math.min(220, Math.round(maxRowLabelLen * 7.5 + 24)));
    return {
      top: margins?.top ?? 32,
      right: margins?.right ?? defaultRight,
      bottom: margins?.bottom ?? (isRotatedExpected ? 56 : 48),
      left: margins?.left ?? autoLeft
    };
  }, [margins, showLegend, rotateXLabels, maxRowLabelLen, densityTier, colLabels.length]);

  // Compute 2D Data Grid Matrix Lookup
  const { gridMatrix, minVal, maxVal } = useMemo(() => {
    const map = new Map<string, { datum: any; value: number | null }>();
    const vals: number[] = [];

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
      containerWidth: plotWidth,
      containerHeight: plotHeight,
      margins: resolvedMargins
    });
  }, [plotWidth, plotHeight, resolvedMargins]);

  // Compute Scales
  const scales = useMemo(() => {
    if (rowLabels.length === 0 || colLabels.length === 0) {
      return { scaleX: null, scaleY: null, colorScale: null };
    }

    const scaleX = createBandScale({
      domain: colLabels,
      range: [0, plot.plotWidth],
      paddingInner: 0,
      paddingOuter: 0
    });

    const scaleY = createBandScale({
      domain: rowLabels,
      range: [0, plot.plotHeight],
      paddingInner: 0,
      paddingOuter: 0
    });

    let colorScale: any;
    if (colorScaleType === 'diverging' || variant === 'correlation') {
      colorScale = createDivergingColorScale({
        domain: [minVal, maxVal],
        colors: (colorRange.length >= 3 ? colorRange : ['#ef4444', '#f8fafc', '#2563eb']) as [string, string, string],
        neutral: neutralValue
      });
    } else {
      colorScale = createSequentialColorScale({
        domain: [minVal, maxVal],
        colors: (colorRange.length >= 2 ? colorRange : ['#eff6ff', '#1d4ed8']) as [string, string]
      });
    }

    return { scaleX, scaleY, colorScale };
  }, [rowLabels, colLabels, plot, colorScaleType, variant, minVal, maxVal, colorRange, neutralValue]);

  // 2D Keyboard Handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
      default:
        break;
    }
  };

  const activeCell = (activeCellCoord && gridMatrix[activeCellCoord.rIdx])
    ? gridMatrix[activeCellCoord.rIdx][activeCellCoord.cIdx]
    : null;

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

  if (!data || data.length === 0 || rowLabels.length === 0 || colLabels.length === 0) {
    return (
      <div
        className={`mds-heatmap mds-heatmap--empty ${className}`}
        style={{ width, height, ...style }}
        role="region"
        aria-label={title || 'Heatmap Empty'}
      >
        {title && <h2 className="mds-heatmap__title">{title}</h2>}
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

  const cellWidth = scales.scaleX ? scales.scaleX.bandwidth() : 0;
  const cellHeight = scales.scaleY ? scales.scaleY.bandwidth() : 0;
  const isXRotated = rotateXLabels === true || (rotateXLabels === 'auto' && cellWidth < 36);
  const actualXAngle = xLabelAngle ?? (isXRotated ? -45 : 0);

  return (
    <div
      ref={containerRef}
      className={`mds-heatmap mds-heatmap--${variant} mds-heatmap--density-${density} ${className}`}
      style={{ width: typeof width === 'number' ? `${width}px` : width, maxWidth: '100%', ...style }}
      role="region"
      aria-roledescription="heatmap"
      aria-label={title || '2D Heatmap Matrix Visualization'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {(title || subtitle) && (
        <div className="mds-heatmap__header">
          <div>
            {title && <h2 className="mds-heatmap__title">{title}</h2>}
            {subtitle && <p className="mds-heatmap__subtitle">{subtitle}</p>}
          </div>
        </div>
      )}

      <svg
        width="100%"
        height={plotHeight}
        viewBox={`0 0 ${plotWidth} ${plotHeight}`}
        className="mds-heatmap__svg mds-chart-svg"
        style={{ overflow: 'visible', display: 'block' }}
        aria-hidden="true"
        onClick={() => setActiveCellCoord(null)}
      >
        <defs>
          <pattern id={`${chartId}-missing-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45 0 0)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="var(--border-strong, #94a3b8)" strokeWidth="1.2" opacity="0.4" />
          </pattern>

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
          {gridMatrix.map((rowCells, rIdx) => {
            const rLabel = rowLabels[rIdx];
            const yPos = scales.scaleY ? (scales.scaleY(rLabel) ?? 0) : 0;

            return (
              <g key={`row-${rLabel}`} className="mds-heatmap__row" role="row">
                {rowCells.map((cell, cIdx) => {
                  const cLabel = colLabels[cIdx];
                  const xPos = scales.scaleX ? (scales.scaleX(cLabel) ?? 0) : 0;
                  const isNull = cell.value == null || isNaN(cell.value);
                  const fill = isNull ? `url(#${chartId}-missing-hatch)` : (scales.colorScale ? scales.colorScale(cell.value) : 'transparent');
                  const isActive = activeCellCoord && activeCellCoord.rIdx === rIdx && activeCellCoord.cIdx === cIdx;
                  const isSelected = selectedCellCoord && selectedCellCoord.rIdx === rIdx && selectedCellCoord.cIdx === cIdx;
                  const textColor = getContrastTextColor(fill);

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
                      {showCellValues && !isNull && cell.value != null && cellWidth > 28 && cellHeight > 18 && (
                        <text
                          x={(cellWidth - cellPadding) / 2}
                          y={(cellHeight - cellPadding) / 2}
                          dy="0.32em"
                          textAnchor="middle"
                          fill={textColor}
                          className="mds-heatmap__cell-text"
                          style={{ fontSize: Math.min(11, Math.max(9, cellHeight * 0.45)), pointerEvents: 'none' }}
                        >
                          {formatCellValue(cell.value, variant)}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            );
          })}

          {rowLabels.map((rLabel) => {
            const yPos = scales.scaleY ? ((scales.scaleY(rLabel) ?? 0) + cellHeight / 2) : 0;
            return (
              <text
                key={`ylabel-${rLabel}`}
                x="-12"
                y={yPos}
                dy="0.32em"
                textAnchor="end"
                fontSize="11"
                fontWeight="500"
                fill="var(--text-secondary, #475569)"
                className="mds-heatmap__row-label"
              >
                {rLabel}
              </text>
            );
          })}

          {colLabels.map((cLabel) => {
            const xPos = scales.scaleX ? ((scales.scaleX(cLabel) ?? 0) + cellWidth / 2) : 0;
            const yPos = plot.plotHeight + (isXRotated ? 12 : 18);
            return (
              <g
                key={`xlabel-${cLabel}`}
                transform={`translate(${xPos}, ${yPos})`}
              >
                <text
                  transform={isXRotated ? `rotate(${actualXAngle})` : undefined}
                  textAnchor={isXRotated ? 'end' : 'middle'}
                  dx={isXRotated ? '-4' : '0'}
                  dy={isXRotated ? '4' : '0'}
                  fontSize="11"
                  fontWeight="500"
                  fill="var(--text-secondary, #475569)"
                  className="mds-heatmap__col-label"
                >
                  {cLabel}
                </text>
              </g>
            );
          })}

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

      {activeCell && activeCellCoord && (
        <div
          className="mds-heatmap__tooltip"
          style={{
            left: Math.max(10, Math.min(plot.toCanvasX((scales.scaleX ? (scales.scaleX(colLabels[activeCellCoord.cIdx]) ?? 0) : 0)) + cellWidth / 2 + 10, width - 210)),
            top: Math.max(10, Math.min(plot.toCanvasY((scales.scaleY ? (scales.scaleY(rowLabels[activeCellCoord.rIdx]) ?? 0) : 0)) - 15, height - 90))
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

      <div className="mds-heatmap__sr-only" aria-live="polite">
        {activeCell && activeCellCoord
          ? `Selected matrix cell ${rowLabels[activeCellCoord.rIdx]}, ${colLabels[activeCellCoord.cIdx]}: ${activeCell.value != null ? `${activeCell.value} ${unit}` : missingCellLabel}.`
          : ''}
      </div>

      {/* Accessible Tabular Matrix Mirror */}
      {showDataTable && data && data.length > 0 && (
        <details
          className="ds-chart-table-details"
          style={{
            marginTop: 'var(--space-3)',
            borderTop: 'var(--border-hairline-subtle)',
            paddingTop: 'var(--space-2)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)'
          }}
        >
          <summary
            className="ds-chart-table-summary"
            style={{
              cursor: 'pointer',
              padding: 'var(--space-1) var(--space-2)',
              fontWeight: 500,
              userSelect: 'none'
            }}
          >
            View Accessible Data Matrix
          </summary>
          <div role="region" aria-label="Heatmap data matrix" tabIndex={0} style={{ overflowX: 'auto', marginTop: 8 }}>
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
                {title ? `${title} Data Matrix` : 'Heatmap Data Matrix'}
              </caption>
              <thead>
                <tr style={{ borderBottom: 'var(--border-width-emphasis) solid var(--border-default)' }}>
                  <th scope="col" style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {rowLabel || 'Row / Col'}
                  </th>
                  {colLabels.map((c) => (
                    <th key={c} scope="col" style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rowLabels.map((r, rIdx) => (
                  <tr key={r} style={{ borderBottom: 'var(--border-hairline-subtle)' }}>
                    <th scope="row" style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {r}
                    </th>
                    {colLabels.map((c, cIdx) => {
                      const cell = gridMatrix[rIdx]?.[cIdx];
                      const val = cell?.value;
                      return (
                        <td key={c} style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                          {val != null ? formatVizValue(val, unit, locale) : missingCellLabel}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
};
