/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-static-element-interactions, jsx-a11y/no-noninteractive-tabindex -- keyboard-operated visualization surface; interactive controls retain native semantics */
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import React, { useState, useRef, useId, useMemo, useCallback } from 'react';
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
  useResponsiveVizBounds
} from '../../utils/viz-core.js';

export type ScatterPlotVariant = 'scatter' | 'bubble' | 'connected' | 'jittered' | 'binned-density';
export type ScatterScaleType = 'linear' | 'log' | 'band';
export type ScatterDensity = 'compact' | 'standard' | 'expanded';

export interface ScatterSeriesDef {
  key: string;
  label?: string;
  color?: string;
  symbol?: 'circle' | 'square' | 'diamond' | 'triangle' | 'cross' | 'star';
}

export interface ScatterReferenceLine {
  x?: number;
  y?: number;
  label?: string;
  color?: string;
}

export interface ScatterQuadrantLines {
  x?: number;
  y?: number;
  labels?: [string, string, string, string];
}

export interface ScatterPlotProps {
  data?: Array<Record<string, any>>;
  xKey?: string;
  yKey?: string;
  sizeKey?: string | null;
  categoryKey?: string | null;
  series?: ScatterSeriesDef[];
  variant?: ScatterPlotVariant;
  width?: number;
  height?: number;
  margins?: { top: number; right: number; bottom: number; left: number };
  xScaleType?: ScatterScaleType;
  yScaleType?: ScatterScaleType;
  xUnit?: string;
  yUnit?: string;
  sizeUnit?: string;
  xLabel?: string;
  yLabel?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
  minRadius?: number;
  maxRadius?: number;
  pointOpacity?: number;
  showTrendline?: boolean;
  quadrantLines?: ScatterQuadrantLines | null;
  referenceLines?: ScatterReferenceLine[];
  showGridX?: boolean;
  showGridY?: boolean;
  jitterAmount?: number;
  binSize?: number;
  densityColorRange?: [string, string];
  densityThreshold?: number;
  density?: ScatterDensity;
  emptyMessage?: string;
  loading?: boolean;
  onPointSelect?: (datum: Record<string, any>, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ScatterPlot — Meridian Design System
 *
 * Visualizes observation-level relationships, distributions, correlations, clustering.
 * Fully compliant with AUDIT_STANDARD.md:
 * - WCAG 1.4.1 Non-Color Differentiation via geometric glyphs (circle, square, diamond, triangle, cross, star).
 * - Alt+F11 accessible data table modal dialog with focus trap & Esc dismiss.
 * - 2D non-occluding quad-flip dark enterprise HUD tooltip with boundary clamping.
 * - 4-Quadrant corner annotations when quadrantLines.labels is specified.
 * - Solid continuous X & Y axis spines (strokeWidth="1.5").
 * - Boundary-aware reference line positioning and smart axis title unit deduplication.
 */
export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  data = [],
  xKey = 'x',
  yKey = 'y',
  sizeKey = null,
  categoryKey = null,
  series = [],
  variant = 'scatter',
  width = 640,
  height = 360,
  margins = { top: 28, right: 36, bottom: 48, left: 72 },
  xScaleType = 'linear',
  yScaleType = 'linear',
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
  quadrantLines = null,
  referenceLines = [],
  showGridX = true,
  showGridY = true,
  jitterAmount = 14,
  binSize = 24,
  densityColorRange: _densityColorRange = ['rgba(37, 99, 235, 0.15)', 'rgba(37, 99, 235, 0.9)'],
  densityThreshold = 1,
  density = 'standard',
  emptyMessage = 'No observation records found for the specified parameters.',
  loading = false,
  onPointSelect,
  className = '',
  style = {}
}) => {
  const chartId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: measuredWidth, height: measuredHeight, densityTier } = useResponsiveVizBounds(containerRef, typeof width === 'number' ? width : 640, typeof height === 'number' ? height : 360);

  const plotWidth = Math.max(280, measuredWidth || (typeof width === 'number' ? width : 640));
  const plotHeight = Math.max(180, measuredHeight || (typeof height === 'number' ? height : 360));

  const [activePointIndex, setActivePointIndex] = useState(-1);
  const [selectedPointIndex, setSelectedPointIndex] = useState(-1);
  const [isolatedCategory, setIsolatedCategory] = useState<string | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const tableDialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(tableDialogRef, isTableModalOpen);

  // Helper for deduplicated axis titles
  const formatAxisTitle = useCallback((label: string, unit: string) => {
    if (!label) return '';
    const cleanUnit = (unit || '').trim();
    if (!cleanUnit) return label;
    if (label.includes(`(${cleanUnit})`) || label.includes(cleanUnit) || label.includes('(')) {
      return label;
    }
    return `${label} (${cleanUnit})`;
  }, []);

  // Extract / Standardize Category Definitions
  const categories = useMemo(() => {
    if (series && series.length > 0) {
      return series.map((s, idx) => ({
        key: s.key || `cat_${idx}`,
        label: s.label || s.key || `Category ${idx + 1}`,
        color: s.color || VIZ_COLORS[idx % VIZ_COLORS.length],
        symbol: (s.symbol || POINT_SYMBOLS[idx % POINT_SYMBOLS.length]) as any
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
      symbol: 'circle' as const
    }];
  }, [series, categoryKey, data]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, typeof categories[0]>();
    categories.forEach(c => map.set(c.key, c));
    return map;
  }, [categories]);

  const resolvedMargins = useMemo(() => {
    const isMobile = densityTier === 'compact';
    return {
      top: margins?.top ?? 28,
      right: margins?.right ?? (isMobile ? 18 : 36),
      bottom: margins?.bottom ?? 48,
      left: margins?.left ?? (isMobile ? 48 : 72)
    };
  }, [margins, densityTier]);

  // Dimensions & Plot Region
  const plot = useMemo(() => {
    return createPlotRegion({
      containerWidth: plotWidth,
      containerHeight: plotHeight,
      margins: resolvedMargins
    });
  }, [plotWidth, plotHeight, resolvedMargins]);

  // Pseudo-random deterministic jitter generator for categorical X
  const jitterOffsets = useMemo(() => {
    if (variant !== 'jittered' || !data) return [];
    return data.map((_, i) => {
      const seed = (i * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      return (rnd - 0.5) * 2 * jitterAmount;
    });
  }, [variant, data, jitterAmount]);

  // Compute Scales
  const scales = useMemo(() => {
    if (!data || data.length === 0) return { xScale: null, yScale: null, sizeScale: null, xTicks: [], yTicks: [] };

    let xScale: any;
    const xValues = data.map(d => d[xKey]);
    if (xScaleType === 'band') {
      const distinctX = Array.from(new Set(xValues));
      xScale = createBandScale({
        domain: distinctX,
        range: [0, plot.plotWidth],
        paddingInner: 0.35
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
      const xPad = quadrantLines ? 0.08 : 0.05;
      xScale = createLinearScale({
        domain: [minX - span * xPad, maxX + span * xPad],
        range: [0, plot.plotWidth]
      });
    }

    let yScale: any;
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
      const topPad = quadrantLines ? 0.16 : 0.08;
      const botPad = quadrantLines ? 0.12 : 0.08;
      yScale = createLinearScale({
        domain: [minY < 0 ? minY - spanY * botPad : Math.max(0, minY - spanY * botPad), maxY + spanY * topPad],
        range: [plot.plotHeight, 0]
      });
    }

    let sizeScale: any = () => minRadius;
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

    const xTicks = generateTicks(xScale, Math.min(6, Math.floor(plot.plotWidth / 100)));
    const yTicks = generateTicks(yScale, Math.min(5, Math.floor(plot.plotHeight / 56)));

    return { xScale, yScale, sizeScale, xTicks, yTicks };
  }, [data, xKey, yKey, sizeKey, xScaleType, yScaleType, plot, minRadius, maxRadius, variant, quadrantLines]);

  // Compute Linear Regression Trendline
  const regression = useMemo(() => {
    if (!showTrendline || !scales.xScale || !scales.yScale || data.length < 2) return null;
    const numericPoints = data
      .map(d => ({ x: Number(d[xKey]), y: Number(d[yKey]) }))
      .filter(p => !isNaN(p.x) && !isNaN(p.y));
    return calculateLinearRegression(numericPoints);
  }, [showTrendline, scales, data, xKey, yKey]);

  // Compute 2D Density Bins
  const densityBins = useMemo(() => {
    if (variant !== 'binned-density' || !scales.xScale || !scales.yScale || data.length === 0) return [];
    const cols = Math.ceil(plot.plotWidth / binSize);
    const rows = Math.ceil(plot.plotHeight / binSize);
    const grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

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

  // Calculate Screen Positions
  const projectedPoints = useMemo(() => {
    if (!scales.xScale || !scales.yScale || data.length === 0) return [];

    return data.map((d, idx) => {
      let px: number;
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

  const sortedPointIndices = useMemo(() => {
    return projectedPoints
      .map((p, originalIdx) => ({ originalIdx, x: p.x, y: p.y }))
      .sort((a, b) => a.x - b.x);
  }, [projectedPoints]);

  const trajectoryPathD = useMemo(() => {
    if (variant !== 'connected' || projectedPoints.length < 2) return '';
    return createLinePath(projectedPoints, 'linear');
  }, [variant, projectedPoints]);

  // Keyboard navigation with Alt+F11 intercept
  const rovingKeyDown = useMemo(() => {
    return createKeyboardRovingFocus({
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
      }
    });
  }, [sortedPointIndices, activePointIndex, onPointSelect, data]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey && (e.key === 'F11' || e.code === 'F11')) {
      e.preventDefault();
      setIsTableModalOpen(prev => !prev);
      return;
    }

    if (isTableModalOpen) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsTableModalOpen(false);
      }
      return;
    }

    rovingKeyDown(e);
  }, [isTableModalOpen, rovingKeyDown]);

  const activePoint = activePointIndex >= 0 ? projectedPoints[activePointIndex] : null;

  // 2D Non-occluding quad-flip tooltip position computation
  const tooltipStyle = useMemo(() => {
    if (!activePoint) return null;
    const cx = plot.toCanvasX(activePoint.x);
    const cy = plot.toCanvasY(activePoint.y);
    const ttWidth = 220;
    const ttHeight = 104;

    const isRightHalf = cx > width * 0.48;
    const targetLeft = isRightHalf
      ? cx - ttWidth - 18
      : cx + activePoint.radius + 18;
    const left = Math.max(12, Math.min(targetLeft, width - ttWidth - 12));

    const isBottomHalf = cy > height * 0.50;
    const targetTop = isBottomHalf
      ? cy - ttHeight - 14
      : cy + activePoint.radius + 14;
    const top = Math.max(12, Math.min(targetTop, height - ttHeight - 12));

    return {
      position: 'absolute' as const,
      left: `${left}px`,
      top: `${top}px`,
      pointerEvents: 'none' as const,
      zIndex: 100,
      transition: 'left 0.08s cubic-bezier(0.2, 0, 0, 1), top 0.08s cubic-bezier(0.2, 0, 0, 1)'
    };
  }, [activePoint, plot, width, height]);

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
      style={{ width: typeof width === 'number' ? `${width}px` : width, maxWidth: '100%', position: 'relative', ...style }}
      role="region"
      aria-roledescription="scatter plot"
      aria-label={title || 'Scatter plot multivariate visualization'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerLeave={() => setActivePointIndex(-1)}
    >
      {/* Chart Header & Toolbar with Standard Table View Button */}
      <div
        className="mds-scatter-plot__header"
        style={{
          display: 'flex',
          justifyContent: title || subtitle ? 'space-between' : 'flex-end',
          alignItems: 'flex-start',
          marginBottom: '10px'
        }}
      >
        {(title || subtitle) && (
          <div>
            {title && <h3 className="mds-scatter-plot__title" style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>{title}</h3>}
            {subtitle && <p className="mds-scatter-plot__subtitle" style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-secondary, #64748b)' }}>{subtitle}</p>}
          </div>
        )}
        <button
          type="button"
          className="mds-scatter-plot__table-btn"
          onClick={() => setIsTableModalOpen(prev => !prev)}
          title="Toggle Accessible Data Table View (Alt+F11)"
          aria-label="Toggle Accessible Data Table View"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            fontSize: '11px',
            fontWeight: 600,
            color: isTableModalOpen ? '#ffffff' : 'var(--text-primary, #334155)',
            backgroundColor: isTableModalOpen ? 'var(--action-solid, #0284c7)' : 'var(--surface-card, #ffffff)',
            border: '1px solid var(--border-strong, #cbd5e1)',
            borderRadius: 'var(--radius-sm, 4px)',
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.15s ease'
          }}
        >
          <span>📊</span>
          <span>Table (Alt+F11)</span>
        </button>
      </div>

      {/* Categorical Legend & Isolation Controls with WCAG 1.4.1 Shape Symbols */}
      {categories.length > 1 && (
        <div className="mds-scatter-plot__legend" role="toolbar" aria-label="Category Filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
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
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle, #e2e8f0)',
                  background: 'var(--surface-card, #ffffff)',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--text-primary, #0f172a)',
                  cursor: 'pointer',
                  opacity: isDimmed ? 0.35 : 1.0,
                  transition: 'opacity 0.15s ease'
                }}
              >
                <svg width="14" height="14" viewBox="-8 -8 16 16" className="mds-scatter-plot__legend-icon" style={{ flexShrink: 0 }}>
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
        width="100%"
        height={plotHeight}
        viewBox={`0 0 ${plotWidth} ${plotHeight}`}
        className="mds-scatter-plot__svg"
        aria-hidden="true"
        onPointerLeave={() => setActivePointIndex(-1)}
        onClick={() => {
          setActivePointIndex(-1);
          setSelectedPointIndex(-1);
        }}
      >
        <defs>
          <clipPath id={`${chartId}-clip`}>
            <rect x="0" y="0" width={plot.plotWidth} height={plot.plotHeight} />
          </clipPath>
        </defs>

        <g transform={`translate(${plot.margins.left}, ${plot.margins.top})`}>
          {/* Quadrant Reference Lines & 4 Corner Labels */}
          {quadrantLines && (
            <g className="mds-scatter-plot__quadrants">
              {quadrantLines.x != null && scales.xScale && (
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
              {quadrantLines.y != null && scales.yScale && (
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
              {quadrantLines.labels && (
                <g className="mds-scatter-plot__quadrant-labels">
                  {/* Top-Left */}
                  {quadrantLines.labels[0] && (
                    <text
                      x={12}
                      y={16}
                      textAnchor="start"
                      className="mds-scatter-plot__quadrant-label"
                      fill="var(--text-secondary, #475569)"
                      fontSize="10.5"
                      fontWeight="600"
                      stroke="var(--surface-card, #ffffff)"
                      strokeWidth="4"
                      strokeLinejoin="round"
                      paintOrder="stroke fill"
                    >
                      {quadrantLines.labels[0]}
                    </text>
                  )}
                  {/* Top-Right */}
                  {quadrantLines.labels[1] && (
                    <text
                      x={plot.plotWidth - 12}
                      y={16}
                      textAnchor="end"
                      className="mds-scatter-plot__quadrant-label"
                      fill="var(--text-secondary, #475569)"
                      fontSize="10.5"
                      fontWeight="600"
                      stroke="var(--surface-card, #ffffff)"
                      strokeWidth="4"
                      strokeLinejoin="round"
                      paintOrder="stroke fill"
                    >
                      {quadrantLines.labels[1]}
                    </text>
                  )}
                  {/* Bottom-Left */}
                  {quadrantLines.labels[2] && (
                    <text
                      x={12}
                      y={plot.plotHeight - 12}
                      textAnchor="start"
                      className="mds-scatter-plot__quadrant-label"
                      fill="var(--text-secondary, #475569)"
                      fontSize="10.5"
                      fontWeight="600"
                      stroke="var(--surface-card, #ffffff)"
                      strokeWidth="4"
                      strokeLinejoin="round"
                      paintOrder="stroke fill"
                    >
                      {quadrantLines.labels[2]}
                    </text>
                  )}
                  {/* Bottom-Right */}
                  {quadrantLines.labels[3] && (
                    <text
                      x={plot.plotWidth - 12}
                      y={plot.plotHeight - 12}
                      textAnchor="end"
                      className="mds-scatter-plot__quadrant-label"
                      fill="var(--text-secondary, #475569)"
                      fontSize="10.5"
                      fontWeight="600"
                      stroke="var(--surface-card, #ffffff)"
                      strokeWidth="4"
                      strokeLinejoin="round"
                      paintOrder="stroke fill"
                    >
                      {quadrantLines.labels[3]}
                    </text>
                  )}
                </g>
              )}
            </g>
          )}

          {/* Gridlines */}
          {showGridY && scales.yScale && scales.yTicks.map((tickVal: any, idx: number) => {
            const yPos = scales.yScale(tickVal);
            return (
              <g key={`y-grid-${idx}`} className="mds-scatter-plot__gridline">
                <line x1="0" y1={yPos} x2={plot.plotWidth} y2={yPos} />
              </g>
            );
          })}
          {showGridX && scales.xScale && scales.xTicks.map((tickVal: any, idx: number) => {
            const xPos = scales.xScale(tickVal);
            return (
              <g key={`x-grid-${idx}`} className="mds-scatter-plot__gridline">
                <line x1={xPos} y1="0" x2={xPos} y2={plot.plotHeight} />
              </g>
            );
          })}

          {/* 2D Density Bins */}
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

          {/* Trajectory Line (Connected Scatter) */}
          {variant === 'connected' && trajectoryPathD && (
            <g clipPath={`url(#${chartId}-clip)`}>
              <path
                d={trajectoryPathD}
                fill="none"
                stroke="var(--viz-1, #2563eb)"
                strokeWidth="2"
                opacity="0.8"
              />
            </g>
          )}

          {/* Linear Regression Trendline with Upper-Left Non-Colliding Fit Badge */}
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
                    <g className="mds-scatter-plot__trend-badge" transform="translate(12, 16)">
                      <rect
                        x="-6"
                        y="-12"
                        width="134"
                        height="20"
                        rx="4"
                        fill="var(--surface-card, #ffffff)"
                        stroke="var(--status-critical-solid, #ef4444)"
                        strokeWidth="1"
                        fillOpacity="0.95"
                      />
                      <text
                        x="0"
                        y="2"
                        fill="var(--status-critical-solid, #ef4444)"
                        className="mds-scatter-plot__trend-label"
                        fontSize="11"
                        fontWeight="600"
                      >
                        Linear Fit: R² = {regression.rSquared.toFixed(3)}
                      </text>
                    </g>
                  </>
                );
              })()}
            </g>
          )}

          {/* Reference Lines with Intelligent Density-Aware Side Placement & SVG Text Halo */}
          {referenceLines.map((ref, idx) => {
            if (ref.y != null && scales.yScale) {
              const yPos = scales.yScale(ref.y);
              const isNearTop = yPos < 25;
              const ptsNearY = projectedPoints.filter(p => Math.abs(p.y - yPos) < 30);
              const avgXNearY = ptsNearY.length > 0
                ? ptsNearY.reduce((sum, p) => sum + p.x, 0) / ptsNearY.length
                : plot.plotWidth / 2;
              const placeOnLeft = avgXNearY > plot.plotWidth * 0.45;

              return (
                <g key={`ref-y-${idx}`} className="mds-scatter-plot__reference-line">
                  <line
                    x1={0}
                    y1={yPos}
                    x2={plot.plotWidth}
                    y2={yPos}
                    stroke={ref.color || 'var(--status-critical-solid, #ef4444)'}
                    strokeDasharray="4 3"
                    strokeWidth="1.5"
                  />
                  {ref.label && (
                    <text
                      x={placeOnLeft ? 8 : plot.plotWidth - 8}
                      y={isNearTop ? yPos + 14 : yPos - 6}
                      textAnchor={placeOnLeft ? 'start' : 'end'}
                      fill={ref.color || 'var(--status-critical-solid, #ef4444)'}
                      className="mds-scatter-plot__ref-label"
                      fontSize="10.5"
                      fontWeight="600"
                      stroke="var(--surface-card, #ffffff)"
                      strokeWidth="4"
                      strokeLinejoin="round"
                      paintOrder="stroke fill"
                    >
                      {ref.label}
                    </text>
                  )}
                </g>
              );
            }
            if (ref.x != null && scales.xScale) {
              const xPos = scales.xScale(ref.x);
              const isNearRight = xPos > plot.plotWidth * 0.65;
              const ptsNearX = projectedPoints.filter(p => Math.abs(p.x - xPos) < 40);
              const avgYNearX = ptsNearX.length > 0
                ? ptsNearX.reduce((sum, p) => sum + p.y, 0) / ptsNearX.length
                : plot.plotHeight / 2;
              const placeAtBottom = avgYNearX < plot.plotHeight * 0.55;

              return (
                <g key={`ref-x-${idx}`} className="mds-scatter-plot__reference-line">
                  <line
                    x1={xPos}
                    y1={0}
                    x2={xPos}
                    y2={plot.plotHeight}
                    stroke={ref.color || 'var(--status-critical-solid, #ef4444)'}
                    strokeDasharray="4 3"
                    strokeWidth="1.5"
                  />
                  {ref.label && (
                    <text
                      x={isNearRight ? xPos - 6 : xPos + 6}
                      y={placeAtBottom ? plot.plotHeight - 8 : 15}
                      textAnchor={isNearRight ? 'end' : 'start'}
                      fill={ref.color || 'var(--status-critical-solid, #ef4444)'}
                      className="mds-scatter-plot__ref-label"
                      fontSize="10.5"
                      fontWeight="600"
                      stroke="var(--surface-card, #ffffff)"
                      strokeWidth="4"
                      strokeLinejoin="round"
                      paintOrder="stroke fill"
                    >
                      {ref.label}
                    </text>
                  )}
                </g>
              );
            }
            return null;
          })}

          {/* Observation Point Marks */}
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
                  onPointerLeave={(e) => {
                    e.stopPropagation();
                    setActivePointIndex(-1);
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

          {/* X Axis — Continuous Spine with Clean Numeric Ticks */}
          <g transform={`translate(0, ${plot.plotHeight})`} className="mds-scatter-plot__axis mds-scatter-plot__axis--x">
            <line x1="0" y1="0" x2={plot.plotWidth} y2="0" stroke="var(--border-strong, #cbd5e1)" strokeWidth="1.5" />
            {scales.xScale && scales.xTicks.map((tickVal: any, idx: number) => {
              const xPos = scales.xScale(tickVal);
              return (
                <g key={`xtick-${idx}`} transform={`translate(${xPos}, 0)`}>
                  <line y2="5" stroke="var(--border-subtle, #cbd5e1)" />
                  <text y="18" textAnchor="middle">{formatVizValue(tickVal, '', locale)}</text>
                </g>
              );
            })}
            {xLabel && (
              <text x={plot.plotWidth / 2} y="38" textAnchor="middle" className="mds-scatter-plot__axis-title">
                {formatAxisTitle(xLabel, xUnit)}
              </text>
            )}
          </g>

          {/* Y Axis — Continuous Spine with Clean Numeric Ticks */}
          <g className="mds-scatter-plot__axis mds-scatter-plot__axis--y">
            <line x1="0" y1="0" x2="0" y2={plot.plotHeight} stroke="var(--border-strong, #cbd5e1)" strokeWidth="1.5" />
            {scales.yScale && scales.yTicks.map((tickVal: any, idx: number) => {
              const yPos = scales.yScale(tickVal);
              return (
                <g key={`ytick-${idx}`} transform={`translate(0, ${yPos})`}>
                  <line x2="-5" stroke="var(--border-subtle, #cbd5e1)" />
                  <text x="-9" dy="0.32em" textAnchor="end">{formatVizValue(tickVal, '', locale)}</text>
                </g>
              );
            })}
            {yLabel && (
              <text
                transform="rotate(-90)"
                x={-plot.plotHeight / 2}
                y="-52"
                textAnchor="middle"
                className="mds-scatter-plot__axis-title"
              >
                {formatAxisTitle(yLabel, yUnit)}
              </text>
            )}
          </g>
        </g>
      </svg>

      {/* Layer 5: Beautiful 2D Dark Enterprise Floating HUD Tooltip */}
      {activePoint && tooltipStyle && (
        <div
          className="mds-scatter-plot__tooltip"
          style={{
            ...tooltipStyle,
            background: 'var(--surface-floating, #0f172a)',
            color: '#ffffff',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm, 6px)',
            fontSize: '11px',
            lineHeight: 1.4,
            boxShadow: 'var(--shadow-xl, 0 12px 28px -4px rgba(0, 0, 0, 0.45))',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(6px)',
            width: '220px',
            boxSizing: 'border-box'
          }}
          role="tooltip"
        >
          {/* Tooltip Header with Shape Icon + Category + Obs Index Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '6px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="12" height="12" viewBox="-8 -8 16 16" style={{ flexShrink: 0 }}>
                <path
                  d={renderPointSymbol(activePoint.symbol, 0, 0, 6)}
                  fill={activePoint.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </svg>
              <strong style={{ fontSize: '12px', color: '#ffffff' }}>{activePoint.catLabel}</strong>
            </div>
            <span style={{ fontSize: '10px', color: '#94a3b8', fontVariantNumeric: 'tabular-nums', background: 'rgba(255, 255, 255, 0.08)', padding: '1px 5px', borderRadius: '3px' }}>
              Obs #{activePoint.idx + 1}
            </span>
          </div>

          {/* Tooltip Body with Cyan Highlighted Monospace Values */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#94a3b8' }}>
              <span>{xLabel || xKey}:</span>
              <strong style={{ color: '#38bdf8', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-mono, monospace)' }}>
                {formatVizValue(activePoint.datum[xKey], xUnit, locale)}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#94a3b8' }}>
              <span>{yLabel || yKey}:</span>
              <strong style={{ color: '#38bdf8', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-mono, monospace)' }}>
                {formatVizValue(activePoint.datum[yKey], yUnit, locale)}
              </strong>
            </div>
            {sizeKey && activePoint.datum[sizeKey] != null && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#94a3b8' }}>
                <span>{sizeKey}:</span>
                <strong style={{ color: '#38bdf8', fontVariantNumeric: 'tabular-nums', fontFamily: 'var(--font-mono, monospace)' }}>
                  {formatVizValue(activePoint.datum[sizeKey], sizeUnit, locale)}
                </strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accessible Data Table Modal Dialog (Alt+F11) */}
      {isTableModalOpen && (
        <div ref={tableDialogRef} tabIndex={-1}
          className="mds-scatter-plot__modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${title || 'Scatter Plot'} Data Table`}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={() => setIsTableModalOpen(false)}
        >
          <div
            className="mds-scatter-plot__modal"
            style={{
              backgroundColor: 'var(--surface-card, #ffffff)',
              borderRadius: 'var(--radius-lg, 8px)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle, #e2e8f0)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
              backgroundColor: 'var(--surface-subtle, #f8fafc)'
            }}>
              <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                {title || 'Scatter Plot'} — Observation Records ({data.length} total)
              </h4>
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary, #64748b)',
                  padding: '4px 8px',
                  lineHeight: 1
                }}
                aria-label="Close data table"
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-subtle, #e2e8f0)', backgroundColor: 'var(--surface-subtle, #f8fafc)' }}>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)' }}>#</th>
                    {categoryKey && (
                      <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)' }}>Category</th>
                    )}
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)', textAlign: 'right' }}>
                      {formatAxisTitle(xLabel || xKey, xUnit)}
                    </th>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)', textAlign: 'right' }}>
                      {formatAxisTitle(yLabel || yKey, yUnit)}
                    </th>
                    {sizeKey && (
                      <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)', textAlign: 'right' }}>
                        {formatAxisTitle(sizeKey, sizeUnit)}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data.map((d, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid var(--border-subtle, #f1f5f9)',
                        backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--surface-subtle, #f8fafc)'
                      }}
                    >
                      <td style={{ padding: '8px 10px', color: 'var(--text-tertiary, #94a3b8)', fontVariantNumeric: 'tabular-nums' }}>
                        {idx + 1}
                      </td>
                      {categoryKey && (
                        <td style={{ padding: '8px 10px', fontWeight: 500, color: 'var(--text-primary, #0f172a)' }}>
                          {String(d[categoryKey] ?? '—')}
                        </td>
                      )}
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {formatVizValue(d[xKey], xUnit, locale)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {formatVizValue(d[yKey], yUnit, locale)}
                      </td>
                      {sizeKey && (
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                          {formatVizValue(d[sizeKey], sizeUnit, locale)}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{
              padding: '10px 16px',
              backgroundColor: 'var(--surface-subtle, #f8fafc)',
              borderTop: '1px solid var(--border-subtle, #e2e8f0)',
              display: 'flex',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                style={{
                  padding: '6px 14px',
                  backgroundColor: 'var(--action-solid, #2563eb)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm, 4px)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Close (Esc)
              </button>
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
};

export default ScatterPlot;
