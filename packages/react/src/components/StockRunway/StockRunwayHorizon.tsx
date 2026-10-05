/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- keyboard-operated visualization surface; interactive controls retain native semantics */
import React, { useState, useId, useRef } from 'react';
import { FloatingDataTooltip } from './FloatingDataTooltip';
import './StockRunwayHorizon.css';

export interface StockRunwayHorizonProps {
  /** Number of days of safe stock coverage (Green zone) */
  safeDays: number;
  /** Number of days in reorder threshold zone before stockout when stockoutDay is omitted */
  reorderDays: number;
  /** Total visible horizon in days (default: 30 days) */
  totalHorizonDays?: number;
  /** Projected zero-stockout day offset; overrides the implied end of the reorder zone */
  stockoutDay?: number;
  /** Optional formatted label for zero stockout date (e.g. 'Oct 24') */
  stockoutDateLabel?: string;
  /** Optional formatted label for reorder point (e.g. 'Oct 18') */
  reorderPointDateLabel?: string;
  /** Current stock on-hand quantity */
  currentStockQty?: number;
  /** Unit of measure (e.g. KG, L) */
  uom?: string;
  /** Daily average consumption rate */
  dailyBurnRate?: number;
  /** Height of the micro-horizontal SVG bar (default: 24px) */
  height?: number;
  /** Width of the SVG bar (or '100%') */
  width?: string | number;
  /** Whether to render compact inline text badge inside the component */
  showInlineBadge?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * StockRunwayHorizon (Wave 3 — Data Visualization)
 *
 * 24px high micro-horizontal SVG bar rendered inline within matrix rows:
 * - Segment 1 (Green): Safe stock days.
 * - Segment 2 (Yellow): Reorder threshold zone.
 * - Vertical Marker (Red): Zero-stockout event date marker.
 * Strictly adheres to design token colors, coordinate bounds, and accessibility standards.
 */
export const StockRunwayHorizon: React.FC<StockRunwayHorizonProps> = ({
  safeDays,
  reorderDays,
  totalHorizonDays = 30,
  stockoutDay,
  stockoutDateLabel,
  reorderPointDateLabel,
  currentStockQty,
  uom = 'KG',
  dailyBurnRate,
  height = 24,
  width = '100%',
  showInlineBadge = true,
  className = '',
  style,
}) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const patternId = useId();
  const tooltipId = useId();
  const showTooltip = isHovered || isFocused;

  // Normalize days to horizon percentage
  const totalDays = Math.max(1, totalHorizonDays);
  const zeroDay = Math.max(0, stockoutDay ?? Math.max(0, safeDays) + Math.max(0, reorderDays));
  const zeroClamped = Math.min(totalDays, zeroDay);
  const safeClamped = Math.min(zeroClamped, Math.max(0, safeDays));
  const reorderClamped = Math.max(0, zeroClamped - safeClamped);
  const reorderLabel = reorderPointDateLabel || `Day ${safeClamped}`;
  const stockoutLabel = stockoutDateLabel || `Day ${zeroDay}`;

  const safePercent = (safeClamped / totalDays) * 100;
  const reorderPercent = (reorderClamped / totalDays) * 100;
  const zeroPercent = (zeroClamped / totalDays) * 100;

  // Accessible description
  const accessibleLabel = `Stock runway: ${safeClamped} days safe, reorder by ${reorderLabel}, projected stockout ${stockoutLabel}`;

  return (
    <div
      ref={anchorRef}
      className={`ds-stock-runway ${className}`}
      style={{ ...style, width }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={(event) => { if (event.key === 'Escape') { setIsHovered(false); setIsFocused(false); } }}
      tabIndex={0}
      role="img"
      aria-label={accessibleLabel}
      aria-describedby={showTooltip ? tooltipId : undefined}
    >
      <div className="ds-stock-runway__svg-container" style={{ height: `${height}px` }}>
        <svg
          viewBox="0 0 100 24"
          preserveAspectRatio="none"
          className="ds-stock-runway__svg"
          aria-hidden="true"
        >
          <defs>
            {/* Deficit risk diagonal hatch pattern */}
            <pattern
              id={`deficit-hatch-${patternId}`}
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="4"
                className="ds-stock-runway__hatch-line"
                strokeWidth="1.2"
              />
            </pattern>
          </defs>

          {/* Background Track */}
          <rect
            x="0"
            y="4"
            width="100"
            height="16"
            rx="4"
            ry="4"
            className="ds-stock-runway__track"
          />

          {/* Segment 3: Deficit Zone (from zeroStockout to end) */}
          {zeroPercent < 100 && (
            <rect
              x={zeroPercent}
              y="4"
              width={100 - zeroPercent}
              height="16"
              fill={`url(#deficit-hatch-${patternId})`}
              className="ds-stock-runway__segment-deficit"
            />
          )}

          {/* Segment 2: Reorder Threshold Zone (Yellow/Amber) */}
          {reorderPercent > 0 && (
            <rect
              x={safePercent}
              y="4"
              width={reorderPercent}
              height="16"
              className="ds-stock-runway__segment-reorder"
            />
          )}

          {/* Segment 1: Safe Stock Days (Green) */}
          {safePercent > 0 && (
            <rect
              x="0"
              y="4"
              width={safePercent}
              height="16"
              rx="4"
              ry="4"
              className="ds-stock-runway__segment-safe"
            />
          )}

          {/* Vertical Marker (Red): Zero-Stockout Event Date */}
          {zeroDay > 0 && zeroDay <= totalDays && (
            <g className="ds-stock-runway__marker-group" transform={`translate(${zeroPercent}, 0)`}>
              {/* Vertical red event line */}
              <line
                x1="0"
                y1="2"
                x2="0"
                y2="22"
                className="ds-stock-runway__marker-line"
                strokeWidth="2"
              />
              {/* Top diamond flag notch */}
              <polygon
                points="-3,1 0,5 3,1 0,-3"
                className="ds-stock-runway__marker-diamond"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Inline Glanceable Readout */}
      {showInlineBadge && (
        <div className="ds-stock-runway__info">
          <span className="ds-stock-runway__badge ds-stock-runway__badge--safe">
            {safeClamped}d Safe
          </span>
          <span className="ds-stock-runway__badge ds-stock-runway__badge--reorder">
            Reorder: {reorderLabel}
          </span>
          <span className="ds-stock-runway__badge ds-stock-runway__badge--stockout">
            Stockout: {stockoutLabel}
          </span>
        </div>
      )}

      {/* Quad-flip Non-Occluding Hover Tooltip */}
      {showTooltip && (
        <FloatingDataTooltip id={tooltipId} anchorRef={anchorRef} className="ds-stock-runway__tooltip">
          <div className="ds-stock-runway__tooltip-header">
            <strong>Stock Runway Analysis</strong>
            <span className="ds-stock-runway__tooltip-tag">
              {zeroDay} Days Left
            </span>
          </div>
          <div className="ds-stock-runway__tooltip-grid">
            {currentStockQty != null && <div>
              <span className="ds-stock-runway__tooltip-label">On-Hand:</span>
              <span className="ds-stock-runway__tooltip-val">{currentStockQty} {uom}</span>
            </div>}
            {dailyBurnRate != null && <div>
              <span className="ds-stock-runway__tooltip-label">Burn Rate:</span>
              <span className="ds-stock-runway__tooltip-val">{dailyBurnRate} {uom}/day</span>
            </div>}
            <div>
              <span className="ds-stock-runway__tooltip-label">Reorder By:</span>
              <span className="ds-stock-runway__tooltip-val ds-stock-runway__tooltip-val--warning">
                {reorderLabel}
              </span>
            </div>
            <div>
              <span className="ds-stock-runway__tooltip-label">Zero-Stockout:</span>
              <span className="ds-stock-runway__tooltip-val ds-stock-runway__tooltip-val--danger">
                {stockoutLabel}
              </span>
            </div>
          </div>
        </FloatingDataTooltip>
      )}
    </div>
  );
};
