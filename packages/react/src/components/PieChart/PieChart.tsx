/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- keyboard-operated visualization surface; interactive controls retain native semantics */
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import React, { useState, useRef, useId, useMemo, useCallback } from 'react';
import {
  VIZ_COLORS,
  PATTERN_PRESETS,
  formatVizValue,
  computePieSlices,
  createArcPath,
  useResponsiveVizBounds
} from '../../utils/viz-core.js';

export type PieChartVariant = 'pie' | 'donut';
export type PieDensity = 'compact' | 'standard' | 'expanded';

export interface PieChartProps {
  data?: Array<Record<string, any>>;
  categoryKey?: string;
  valueKey?: string;
  variant?: PieChartVariant;
  innerRadiusRatio?: number;
  padAngle?: number;
  width?: number;
  height?: number;
  margins?: { top: number; right: number; bottom: number; left: number };
  unit?: string;
  valueLabel?: string;
  centerLabel?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
  showLabels?: boolean;
  showLegend?: boolean;
  showCenterTotal?: boolean;
  enablePatterns?: boolean;
  density?: PieDensity;
  emptyMessage?: string;
  loading?: boolean;
  onSliceSelect?: (datum: Record<string, any>, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * PieChart — Meridian Design System
 *
 * Shows a small number of mutually exclusive parts of a single whole with
 * high-contrast patterns, donut metrics, and Alt+F11 accessible data tables.
 */
export const PieChart: React.FC<PieChartProps> = ({
  data = [],
  categoryKey = 'name',
  valueKey = 'value',
  variant = 'pie',
  innerRadiusRatio = 0.62,
  padAngle = 0.02,
  width = 440,
  height = 340,
  margins: _margins = { top: 16, right: 16, bottom: 16, left: 16 },
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
  density = 'standard',
  emptyMessage = 'No part-to-whole records available.',
  loading = false,
  onSliceSelect,
  className = '',
  style = {}
}) => {
  const chartId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: measuredWidth, height: measuredHeight, densityTier: _densityTier } = useResponsiveVizBounds(containerRef, typeof width === 'number' ? width : 440, typeof height === 'number' ? height : 340);

  const plotWidth = Math.max(220, measuredWidth || (typeof width === 'number' ? width : 440));
  const plotHeight = Math.max(180, measuredHeight || (typeof height === 'number' ? height : 340));

  const [activeSliceIndex, setActiveSliceIndex] = useState(-1);
  const [selectedSliceIndex, setSelectedSliceIndex] = useState(-1);
  const [isolatedCategory, setIsolatedCategory] = useState<string | null>(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const tableDialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(tableDialogRef, showTableModal);
  const [announcement, setAnnouncement] = useState('');

  // Compute Slices & Radial Geometry
  const rawSlices = useMemo(() => {
    if (!data || data.length === 0) return [];
    return computePieSlices(data, {
      valueKey,
      padAngle
    });
  }, [data, valueKey, padAngle]);

  // Aggregate Total Sum
  const totalSum = useMemo(() => {
    return rawSlices.length > 0 ? (rawSlices[0] as any).total || 0 : 0;
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

  // Geometry dimensions and SVG sizing
  const headerHeight = (title || subtitle) ? 44 : 0;
  const legendHeight = (showLegend && slices.length > 1) ? (slices.length > 4 ? 54 : 32) : 0;

  const svgWidth = Math.max(160, plotWidth - 40);
  const svgHeight = Math.max(160, plotHeight - headerHeight - legendHeight - 32);

  const cx = svgWidth / 2;
  const cy = svgHeight / 2;

  const labelMargin = showLabels ? 24 : 10;
  const maxRadius = Math.min(svgWidth, svgHeight) / 2 - labelMargin;
  const outerRadius = Math.max(28, maxRadius);
  const innerRadius = variant === 'donut' ? outerRadius * innerRadiusRatio : 0;

  // Keyboard navigation & Shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'F11' && e.altKey) {
      e.preventDefault();
      setShowTableModal(prev => !prev);
      return;
    }
    if (e.key === 'Escape') {
      if (showTableModal) {
        e.preventDefault();
        setShowTableModal(false);
        return;
      }
      if (activeSliceIndex >= 0 || selectedSliceIndex >= 0) {
        e.preventDefault();
        setActiveSliceIndex(-1);
        setSelectedSliceIndex(-1);
        return;
      }
    }
    if (slices.length === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSliceIndex(prev => {
        const next = (prev + 1) % slices.length;
        const slice = slices[next];
        setAnnouncement(`Selected sector ${slice.catName}: ${formatVizValue(slice.value, unit, locale)}, representing ${slice.percentage.toFixed(1)}% of total.`);
        if (onSliceSelect) onSliceSelect(slice.datum, next);
        return next;
      });
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSliceIndex(prev => {
        const next = (prev - 1 + slices.length) % slices.length;
        const slice = slices[next];
        setAnnouncement(`Selected sector ${slice.catName}: ${formatVizValue(slice.value, unit, locale)}, representing ${slice.percentage.toFixed(1)}% of total.`);
        if (onSliceSelect) onSliceSelect(slice.datum, next);
        return next;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (activeSliceIndex >= 0 && activeSliceIndex < slices.length) {
        setSelectedSliceIndex(prev => prev === activeSliceIndex ? -1 : activeSliceIndex);
      }
    }
  }, [slices, activeSliceIndex, selectedSliceIndex, showTableModal, unit, locale, onSliceSelect]);

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
        <div className="mds-pie-chart__skeleton-header" />
        <div className="mds-pie-chart__skeleton-circle" style={{ height: height - 60 }} />
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
        {title && <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: '0 0 var(--space-2) 0', color: 'var(--text-primary)' }}>{title}</h3>}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: height - 60, color: 'var(--text-secondary)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 8, opacity: 0.6 }}>
            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
            <path d="M22 12A10 10 0 0 0 12 2v10z" />
          </svg>
          <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mds-pie-chart mds-pie-chart--${variant} mds-pie-chart--density-${density} ${className}`}
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        width: typeof width === 'number' ? `${width}px` : width,
        maxWidth: '100%',
        background: 'var(--surface-card)',
        border: 'var(--border-hairline-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4) var(--space-5)',
        fontFamily: 'var(--font-sans)',
        outline: 'none',
        ...style
      }}
      role="region"
      aria-roledescription="pie chart"
      aria-label={title || `Proportional Part-to-Whole Pie Chart. ${slices.length} slices. Use arrow keys to cycle, Alt+F11 for data table.`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerLeave={() => setActiveSliceIndex(-1)}
    >
      {/* Chart Header & Table Modal Toggle */}
      {(title || subtitle) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
          <div>
            {title && (
              <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '3px 0 0 0' }}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowTableModal(prev => !prev)}
            style={{
              padding: 'var(--space-1) var(--space-2)',
              fontSize: 'var(--text-2xs)',
              fontWeight: 600,
              border: 'var(--border-hairline)',
              borderRadius: 'var(--radius-sm)',
              background: showTableModal ? 'var(--action-solid)' : 'var(--surface-card)',
              color: showTableModal ? 'var(--text-inverse)' : 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Toggle Accessible Proportions Table (Alt+F11)"
            aria-label="Toggle Accessible Proportions Table"
          >
            Table (Alt+F11)
          </button>
        </div>
      )}

      {/* SVG Canvas */}
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
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

            const expandOffset = (isActive || isSelected) ? 5 : 0;
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

            // Percentage label position
            const labelRadius = outerRadius + 14;
            const lx = cx + labelRadius * Math.cos(slice.midAngle);
            const ly = cy + labelRadius * Math.sin(slice.midAngle);
            const cosA = Math.cos(slice.midAngle);
            const textAnchor = cosA > 0.1 ? 'start' : cosA < -0.1 ? 'end' : 'middle';

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
                style={{ cursor: 'pointer' }}
              >
                {/* Sector Path */}
                <path
                  d={arcD}
                  fill={slice.color}
                  opacity={isDimmed ? 0.2 : 0.94}
                  stroke="var(--surface-card)"
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

                {/* Direct Sector Concise Percentage Callout */}
                {showLabels && slice.percentage >= 4 && (
                  <text
                    x={lx}
                    y={ly}
                    dy="0.32em"
                    textAnchor={textAnchor}
                    className="mds-pie-chart__label"
                    style={{
                      fontSize: 'var(--text-2xs)',
                      fontWeight: isActive ? 700 : 600,
                      fill: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      paintOrder: 'stroke fill',
                      stroke: 'var(--surface-card)',
                      strokeWidth: 3,
                      strokeLinejoin: 'round',
                      fontVariantNumeric: 'tabular-nums',
                      pointerEvents: 'none'
                    }}
                  >
                    {slice.percentage.toFixed(1)}%
                  </text>
                )}
              </g>
            );
          })}

          {/* Donut Center Metric Callout */}
          {variant === 'donut' && showCenterTotal && (
            <g className="mds-pie-chart__center" style={{ pointerEvents: 'none' }}>
              <text
                x={cx}
                y={cy - 4}
                textAnchor="middle"
                style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 700,
                  fill: 'var(--text-primary)',
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {formatVizValue(activeSlice ? activeSlice.value : totalSum, unit, locale)}
              </text>
              <text
                x={cx}
                y={cy + 14}
                textAnchor="middle"
                style={{
                  fontSize: 'var(--text-2xs)',
                  fontWeight: 600,
                  fill: 'var(--text-secondary)'
                }}
              >
                {activeSlice ? (activeSlice.catName.length > 18 ? `${activeSlice.catName.slice(0, 16)}…` : activeSlice.catName) : centerLabel}
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* Categorical Legend & Isolation Bar */}
      {showLegend && slices.length > 1 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'calc(var(--space-1) + var(--space-half)) var(--space-3)',
            marginTop: 'var(--space-2)'
          }}
          role="toolbar"
          aria-label="Proportions Legend"
        >
          {slices.map((slice) => {
            const isDimmed = isolatedCategory && isolatedCategory !== slice.catName;
            return (
              <button
                key={slice.catName}
                type="button"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 'var(--space-half) calc(var(--space-1) + var(--space-half))',
                  borderRadius: 'var(--radius-sm)',
                  opacity: isDimmed ? 0.35 : 1.0,
                  transition: 'opacity 0.15s ease'
                }}
                onClick={() => setIsolatedCategory(isolatedCategory === slice.catName ? null : slice.catName)}
                aria-pressed={isolatedCategory === slice.catName}
                title={`Click to isolate ${slice.catName}`}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: '9px',
                    height: '9px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: slice.color,
                    flexShrink: 0
                  }}
                />
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {slice.catName}
                </span>
                <strong style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>
                  {slice.percentage.toFixed(1)}%
                </strong>
              </button>
            );
          })}
        </div>
      )}

      {/* Layer 5: 2D Quad-Flip Non-Occluding Tooltip Overlay */}
      {activeSlice && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(Math.max(12, 20 + cx + (outerRadius * 0.75) * Math.cos(activeSlice.midAngle) + (Math.cos(activeSlice.midAngle) >= 0 ? 15 : -180)), width - 185),
            top: Math.min(Math.max(12, 16 + headerHeight + cy + (outerRadius * 0.75) * Math.sin(activeSlice.midAngle) + (Math.sin(activeSlice.midAngle) >= 0 ? 15 : -80)), height - 85),
            background: 'var(--tooltip-background)',
            color: 'var(--tooltip-foreground)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--tooltip-radius)',
            fontSize: 'var(--text-2xs)',
            lineHeight: 1.4,
            boxShadow: 'var(--tooltip-shadow)',
            pointerEvents: 'none',
            zIndex: 100,
            maxWidth: '175px',
            border: 'var(--border-width) solid rgba(255,255,255,0.1)'
          }}
          role="tooltip"
        >
          <div style={{ fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--tooltip-foreground)', marginBottom: 'var(--space-half)' }}>
            {activeSlice.catName}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
            <span style={{ color: 'var(--text-disabled)' }}>{valueLabel}:</span>
            <strong style={{ color: 'var(--text-info)', fontVariantNumeric: 'tabular-nums' }}>
              {formatVizValue(activeSlice.value, unit, locale)}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', marginTop: 'var(--space-half)' }}>
            <span style={{ color: 'var(--text-disabled)' }}>Proportion:</span>
            <strong style={{ color: 'var(--text-success)', fontVariantNumeric: 'tabular-nums' }}>
              {activeSlice.percentage.toFixed(1)}%
            </strong>
          </div>
        </div>
      )}

      {/* Accessible Proportions Data Table Modal (Alt+F11) */}
      {showTableModal && (
        <div ref={tableDialogRef} tabIndex={-1}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(2px)',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)'
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Accessible Part-to-Whole Proportions Table"
        >
          <div
            style={{
              background: 'var(--surface-card)',
              borderRadius: 'var(--radius-md)',
              border: 'var(--border-hairline-subtle)',
              boxShadow: 'var(--shadow-xl)',
              width: '100%',
              maxWidth: 560,
              maxHeight: '90%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', borderBottom: 'var(--border-hairline-subtle)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Accessible Part-to-Whole Proportions Matrix
                </div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)' }}>
                  Total Aggregate: <strong>{formatVizValue(totalSum, unit, locale)}</strong> (100.0%) across {slices.length} categories
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: 18,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
                aria-label="Close table modal"
              >
                &times;
              </button>
            </div>

            <div style={{ overflowY: 'auto', padding: 16 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-sunken)', borderBottom: 'var(--border-width-emphasis) solid var(--border-subtle)' }}>
                    <th style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', color: 'var(--text-secondary)', fontWeight: 600 }}>Category Name</th>
                    <th style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Magnitude ({unit.trim() || 'Units'})</th>
                    <th style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Percentage Share</th>
                  </tr>
                </thead>
                <tbody>
                  {slices.map((slice, idx) => (
                    <tr key={idx} style={{ borderBottom: 'var(--border-hairline-subtle)' }}>
                      <td style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: slice.color }} />
                        {slice.catName}
                      </td>
                      <td style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                        {formatVizValue(slice.value, '', locale)}
                      </td>
                      <td style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--action-solid)' }}>
                        {slice.percentage.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: 'calc(var(--space-2) + var(--space-half)) var(--space-4)', background: 'var(--surface-sunken)', borderTop: 'var(--border-hairline-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                style={{
                  padding: 'calc(var(--space-1) + var(--space-half)) var(--space-3)',
                  background: 'var(--action-solid)',
                  color: 'var(--text-inverse)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 12,
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
      <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(1px, 1px, 1px, 1px)' }} aria-live="polite">
        {announcement || (activeSlice ? `Selected sector ${activeSlice.catName}: ${formatVizValue(activeSlice.value, unit, locale)}, representing ${activeSlice.percentage.toFixed(1)}% of total.` : '')}
      </div>
    </div>
  );
};

export default PieChart;
