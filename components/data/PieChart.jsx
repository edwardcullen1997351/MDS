import React, { useState, useRef, useId, useMemo } from 'react';
import {
  VIZ_COLORS,
  PATTERN_PRESETS,
  formatVizValue,
  computePieSlices,
  createArcPath,
  createKeyboardRovingFocus,
  LAYER_STACK
} from './viz-core.js';

/**
 * PieChart — Meridian Design System
 *
 * Shows a small number of mutually exclusive parts of a single whole
 * where angular sectors encode proportional share.
 *
 * Variants:
 * - 'pie': Full solid circular disk (innerRadius = 0)
 * - 'donut': Annular ring with central cutout (innerRadius > 0) supporting center total readout
 */
export function PieChart({
  data = [], // [{ name: 'Turnings', value: 450 }, ...]
  categoryKey = 'name',
  valueKey = 'value',
  variant = 'pie', // 'pie' | 'donut'
  innerRadiusRatio = 0.62, // Ratio of inner radius for donut variant (0.5 to 0.75)
  padAngle = 0.02, // Radial padding between sectors in radians
  width = 440,
  height = 340,
  margins = { top: 20, right: 20, bottom: 24, left: 20 },
  unit = '',
  valueLabel = 'Share',
  centerLabel = 'Total',
  locale = 'en-IN',
  title,
  subtitle,
  showLabels = true,
  showLegend = true,
  showCenterTotal = true,
  enablePatterns = true,
  density = 'standard', // 'compact' | 'standard' | 'expanded'
  emptyMessage = 'No part-to-whole records available.',
  loading = false,
  onSliceSelect,
  className = '',
  style = {}
}) {
  const chartId = useId();
  const containerRef = useRef(null);

  const [activeSliceIndex, setActiveSliceIndex] = useState(-1);
  const [selectedSliceIndex, setSelectedSliceIndex] = useState(-1);
  const [isolatedCategory, setIsolatedCategory] = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);

  // Compute Slices & Radial Geometry
  const rawSlices = useMemo(() => {
    if (!data || data.length === 0) return [];
    return computePieSlices(data, {
      valueKey,
      padAngle: padAngle
    });
  }, [data, valueKey, padAngle]);

  // Aggregate Total Sum
  const totalSum = useMemo(() => {
    return rawSlices.length > 0 ? rawSlices[0].total : 0;
  }, [rawSlices]);

  // Normalized Slice Definitions with Colors and Pattern Presets
  const slices = useMemo(() => {
    return rawSlices.map((s, idx) => {
      const catName = String(s.datum[categoryKey] || `Category ${idx + 1}`);
      const color = s.datum.color || VIZ_COLORS[idx % VIZ_COLORS.length];
      const pattern = PATTERN_PRESETS[idx % PATTERN_PRESETS.length].id;
      return {
        ...s,
        catName,
        color,
        pattern
      };
    });
  }, [rawSlices, categoryKey]);

  // Geometry dimensions
  const plotWidth = width - margins.left - margins.right;
  const plotHeight = height - margins.top - margins.bottom;
  const cx = margins.left + plotWidth / 2;
  const cy = margins.top + plotHeight / 2 - (showLegend ? 16 : 0);
  const maxRadius = Math.min(plotWidth, plotHeight) / 2 - (showLabels ? 28 : 10);
  const outerRadius = Math.max(20, maxRadius);
  const innerRadius = variant === 'donut' ? outerRadius * innerRadiusRatio : 0;

  // Keyboard navigation
  const handleKeyDown = createKeyboardRovingFocus({
    itemCount: slices.length,
    currentIndex: activeSliceIndex,
    onIndexChange: (idx) => {
      setActiveSliceIndex(idx);
      if (onSliceSelect && slices[idx]) {
        onSliceSelect(slices[idx].datum, idx);
      }
    },
    onSelect: (idx) => {
      setSelectedSliceIndex(idx);
      if (onSliceSelect && slices[idx]) {
        onSliceSelect(slices[idx].datum, idx);
      }
    },
    onDismiss: () => {
      setActiveSliceIndex(-1);
    },
    onToggleTable: () => {
      setShowTableModal(prev => !prev);
    }
  });

  const activeSlice = activeSliceIndex >= 0 ? slices[activeSliceIndex] : null;

  // Render Skeleton
  if (loading) {
    return (
      <div
        className={`mds-pie-chart mds-pie-chart--loading ${className}`}
        style={{ width, height, ...style }}
        role="region"
        aria-label={title || 'Pie Chart Loading'}
        aria-busy="true"
      >
        <div className="mds-pie-chart__skeleton-header">
          <div className="mds-pie-chart__skeleton-title" />
          <div className="mds-pie-chart__skeleton-sub" />
        </div>
        <div className="mds-pie-chart__skeleton-circle" />
      </div>
    );
  }

  // Render Empty State
  if (!data || data.length === 0 || totalSum === 0) {
    return (
      <div
        className={`mds-pie-chart mds-pie-chart--empty ${className}`}
        style={{ width, height, ...style }}
        role="region"
        aria-label={title || 'Pie Chart Empty'}
      >
        {title && <h3 className="mds-pie-chart__title">{title}</h3>}
        <div className="mds-pie-chart__empty-msg">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
          <p>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mds-pie-chart mds-pie-chart--${variant} mds-pie-chart--density-${density} ${className}`}
      style={{ width, ...style }}
      role="region"
      aria-roledescription="pie chart"
      aria-label={title || 'Proportional Part-to-Whole Pie Chart'}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Chart Header */}
      {(title || subtitle) && (
        <div className="mds-pie-chart__header">
          <div>
            {title && <h3 className="mds-pie-chart__title">{title}</h3>}
            {subtitle && <p className="mds-pie-chart__subtitle">{subtitle}</p>}
          </div>
          <button
            type="button"
            className="mds-pie-chart__table-btn"
            onClick={() => setShowTableModal(true)}
            title="View as Data Table (Alt+F11)"
            aria-label="Toggle accessible tabular proportions"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M3 15h18M9 3v18" />
            </svg>
            Table
          </button>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        width={width}
        height={height}
        className="mds-pie-chart__svg"
        aria-hidden="true"
        onClick={() => setActiveSliceIndex(-1)}
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
        </defs>

        <g className="mds-pie-chart__sectors">
          {slices.map((slice, idx) => {
            const isActive = activeSliceIndex === idx;
            const isSelected = selectedSliceIndex === idx;
            const isDimmed = isolatedCategory && isolatedCategory !== slice.catName;

            // Offset active slice outward by 6px along midAngle
            const expandOffset = (isActive || isSelected) ? 6 : 0;
            const sliceCx = cx + expandOffset * Math.cos(slice.midAngle);
            const sliceCy = cy + expandOffset * Math.sin(slice.midAngle);

            const arcD = createArcPath({
              cx: sliceCx,
              cy: sliceCy,
              innerRadius,
              outerRadius: (isActive || isSelected) ? outerRadius + 2 : outerRadius,
              startAngle: slice.startAngle,
              endAngle: slice.endAngle
            });

            // Callout label coordinates
            const labelRadius = outerRadius + 18;
            const lx = cx + labelRadius * Math.cos(slice.midAngle);
            const ly = cy + labelRadius * Math.sin(slice.midAngle);
            const textAnchor = Math.cos(slice.midAngle) > 0.1 ? 'start' : Math.cos(slice.midAngle) < -0.1 ? 'end' : 'middle';

            return (
              <g
                key={`slice-${idx}`}
                className="mds-pie-chart__slice-group"
                onPointerEnter={(e) => {
                  e.stopPropagation();
                  setActiveSliceIndex(idx);
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSliceIndex(idx);
                  if (onSliceSelect) onSliceSelect(slice.datum, idx);
                }}
                style={{ cursor: 'pointer', transition: 'transform 150ms ease' }}
              >
                {/* Sector Path */}
                <path
                  d={arcD}
                  fill={slice.color}
                  opacity={isDimmed ? 0.2 : 0.9}
                  stroke="var(--surface-card, #ffffff)"
                  strokeWidth="2"
                  className="mds-pie-chart__arc"
                />

                {/* Accessible Pattern Overlay */}
                {enablePatterns && (
                  <path
                    d={arcD}
                    fill={`url(#${chartId}-${slice.pattern})`}
                    opacity={0.6}
                    stroke="none"
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* Direct Sector Label */}
                {showLabels && slice.percentage >= 5 && (
                  <text
                    x={lx}
                    y={ly}
                    dy="0.32em"
                    textAnchor={textAnchor}
                    className="mds-pie-chart__label"
                    style={{
                      fontSize: '11px',
                      fontWeight: isActive ? 'bold' : 'normal',
                      fill: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    {slice.catName} ({slice.percentage.toFixed(1)}%)
                  </text>
                )}
              </g>
            );
          })}

          {/* Donut Center Metric Callout */}
          {variant === 'donut' && showCenterTotal && (
            <g className="mds-pie-chart__center" style={{ pointerEvents: 'none' }}>
              <text x={cx} y={cy - 6} textAnchor="middle" className="mds-pie-chart__center-val">
                {formatVizValue(activeSlice ? activeSlice.value : totalSum, unit, locale)}
              </text>
              <text x={cx} y={cy + 12} textAnchor="middle" className="mds-pie-chart__center-label">
                {activeSlice ? `${activeSlice.catName} (${activeSlice.percentage.toFixed(1)}%)` : centerLabel}
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* Categorical Legend & Isolation Bar */}
      {showLegend && slices.length > 1 && (
        <div className="mds-pie-chart__legend" role="toolbar" aria-label="Proportions Legend">
          {slices.map((slice) => {
            const isDimmed = isolatedCategory && isolatedCategory !== slice.catName;
            return (
              <button
                key={slice.catName}
                type="button"
                className={`mds-pie-chart__legend-item ${isDimmed ? 'mds-pie-chart__legend-item--dimmed' : ''}`}
                onClick={() => setIsolatedCategory(isolatedCategory === slice.catName ? null : slice.catName)}
                aria-pressed={isolatedCategory === slice.catName}
                title={`Click to isolate ${slice.catName}`}
              >
                <span className="mds-pie-chart__legend-swatch" style={{ backgroundColor: slice.color }} />
                <span className="mds-pie-chart__legend-label">{slice.catName}</span>
                <strong className="mds-pie-chart__legend-pct">{slice.percentage.toFixed(1)}%</strong>
              </button>
            );
          })}
        </div>
      )}

      {/* Layer 5: Tooltip Overlay */}
      {activeSlice && (
        <div
          className="mds-pie-chart__tooltip"
          style={{
            left: Math.min(cx + (outerRadius * 0.7) * Math.cos(activeSlice.midAngle) + 20, width - 180),
            top: Math.max(10, cy + (outerRadius * 0.7) * Math.sin(activeSlice.midAngle) - 20)
          }}
          role="tooltip"
        >
          <div className="mds-pie-chart__tooltip-header">
            <strong>{activeSlice.catName}</strong>
          </div>
          <div className="mds-pie-chart__tooltip-body">
            <div className="mds-pie-chart__tooltip-row">
              <span>{valueLabel}:</span>
              <strong>{formatVizValue(activeSlice.value, unit, locale)}</strong>
            </div>
            <div className="mds-pie-chart__tooltip-row">
              <span>Proportion:</span>
              <strong>{activeSlice.percentage.toFixed(1)}%</strong>
            </div>
          </div>
        </div>
      )}

      {/* Accessible Proportions Data Table Modal (<kbd>Alt+F11</kbd>) */}
      {showTableModal && (
        <div
          className="mds-pie-chart__modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${chartId}-table-title`}
        >
          <div className="mds-pie-chart__modal">
            <div className="mds-pie-chart__modal-header">
              <h4 id={`${chartId}-table-title`}>{title || 'Part-to-Whole Breakdown'}</h4>
              <button
                type="button"
                className="mds-pie-chart__modal-close"
                onClick={() => setShowTableModal(false)}
                aria-label="Close proportions table"
              >
                ✕
              </button>
            </div>
            <div className="mds-pie-chart__modal-body">
              <table className="mds-pie-chart__data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Value ({unit || 'Units'})</th>
                    <th>Percentage Share</th>
                  </tr>
                </thead>
                <tbody>
                  {slices.map((slice) => (
                    <tr key={slice.catName}>
                      <td><strong>{slice.catName}</strong></td>
                      <td>{formatVizValue(slice.value, unit, locale)}</td>
                      <td><strong>{slice.percentage.toFixed(1)}%</strong></td>
                    </tr>
                  ))}
                  <tr className="mds-pie-chart__table-total">
                    <td><strong>Total Aggregate (100.0%)</strong></td>
                    <td><strong>{formatVizValue(totalSum, unit, locale)}</strong></td>
                    <td><strong>100.0%</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Screen Reader Live Region */}
      <div className="mds-pie-chart__sr-only" aria-live="polite">
        {activeSlice
          ? `Selected sector ${activeSlice.catName}: ${activeSlice.value} ${unit}, representing ${activeSlice.percentage.toFixed(1)}% of total.`
          : ''}
      </div>
    </div>
  );
}
