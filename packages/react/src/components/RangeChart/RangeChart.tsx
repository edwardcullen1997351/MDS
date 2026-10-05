/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- keyboard-operated visualization surface; interactive controls retain native semantics */
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import React, { useState, useMemo, useRef, useCallback, useId } from 'react';
import { formatVizValue, useResponsiveVizBounds } from '../../utils/viz-core.js';

export type RangeChartVariant = 'interval-bar' | 'dumbbell' | 'error-bar' | 'range-area';
export type RangeChartOrientation = 'horizontal' | 'vertical';
export type IntervalSemantics = 'min-max' | 'ci-95' | 'tolerance-band' | 'before-after' | 'target-actual' | 'custom';

export interface RangeDataItem {
  id?: string;
  label?: string;
  lower?: number;
  upper?: number;
  center?: number;
  target?: number;
  status?: 'nominal' | 'warning' | 'critical' | 'info' | 'neutral';
  intervalSemantics?: IntervalSemantics | string;
  isImproved?: boolean;
  dashed?: boolean;
  metadata?: Record<string, any>;
  [key: string]: any;
}

export interface RangeChartProps {
  data?: RangeDataItem[];
  variant?: RangeChartVariant;
  orientation?: RangeChartOrientation;
  width?: number;
  height?: number;
  title?: string;
  subtitle?: string;
  lowerKey?: string;
  upperKey?: string;
  centerKey?: string;
  targetKey?: string;
  categoryKey?: string;
  unit?: string;
  locale?: string;
  targetLine?: number | { value: number; label?: string } | null;
  showCenterEstimate?: boolean;
  showDirectLabels?: boolean;
  showControls?: boolean;
  showSearch?: boolean;
  interactive?: boolean;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onItemClick?: (item: RangeDataItem, index: number, event?: React.MouseEvent) => void;
  renderTooltip?: (item: RangeDataItem) => React.ReactNode;
  ariaLabel?: string;
}

// Semantic Status Colors
const STATUS_COLORS: Record<string, string> = {
  nominal: 'var(--status-success-solid)',
  warning: 'var(--status-warning-solid)',
  critical: 'var(--status-critical-solid)',
  info: 'var(--status-info-solid)',
  neutral: 'var(--status-neutral-solid)'
};

const DUMBBELL_ENDPOINT_COLORS = {
  before: 'var(--status-neutral-solid)',
  afterImproved: 'var(--status-success-solid)',
  afterRegressed: 'var(--status-critical-solid)'
};

/**
 * RangeChart — Meridian Design System
 *
 * Compares bounded intervals, tolerance bands, statistical uncertainty,
 * and before/after Kaizen transformations with continuous axis spines and Alt+F11 table modal.
 */
export const RangeChart: React.FC<RangeChartProps> = ({
  data = [],
  variant = 'interval-bar',
  orientation = 'horizontal',
  width = 760,
  height = 420,
  title = 'Bounded Interval Range Chart',
  subtitle = '',
  lowerKey = 'lower',
  upperKey = 'upper',
  centerKey = 'center',
  targetKey = 'target',
  categoryKey = 'label',
  unit = '',
  locale = 'en-IN',
  targetLine = null,
  showCenterEstimate = true,
  showDirectLabels = true,
  showControls = true,
  showSearch = true,
  interactive = true,
  emptyMessage = 'No bounded interval telemetry records available.',
  loading = false,
  className = '',
  style = {},
  onItemClick,
  renderTooltip,
  ariaLabel
}) => {
  const chartId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: measuredWidth, height: measuredHeight, densityTier } = useResponsiveVizBounds(containerRef, typeof width === 'number' ? width : 760, typeof height === 'number' ? height : 420);

  const plotWidth = Math.max(280, measuredWidth || (typeof width === 'number' ? width : 760));
  const plotHeight = Math.max(200, measuredHeight || (typeof height === 'number' ? height : 420));

  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTableModal, setShowTableModal] = useState(false);
  const tableDialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(tableDialogRef, showTableModal);
  const [announcement, setAnnouncement] = useState('');

  // Filter Data by Search Query
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (!searchQuery.trim()) return data;
    const q = searchQuery.toLowerCase().trim();
    return data.filter(d => {
      const label = String(d[categoryKey] || d.id || '').toLowerCase();
      const semantics = String(d.intervalSemantics || d.category || '').toLowerCase();
      return label.includes(q) || semantics.includes(q);
    });
  }, [data, searchQuery, categoryKey]);

  // Sort Data
  const sortedData = useMemo(() => {
    if (variant === 'range-area' || sortBy === 'default') return filteredData;
    const list = [...filteredData];
    return list.sort((a, b) => {
      const lowA = Number(a[lowerKey] ?? 0);
      const lowB = Number(b[lowerKey] ?? 0);
      const upA = Number(a[upperKey] ?? 0);
      const upB = Number(b[upperKey] ?? 0);
      const spreadA = Math.abs(upA - lowA);
      const spreadB = Math.abs(upB - lowB);

      if (sortBy === 'spread-desc') return spreadB - spreadA;
      if (sortBy === 'spread-asc') return spreadA - spreadB;
      if (sortBy === 'lower-asc') return lowA - lowB;
      if (sortBy === 'upper-desc') return upB - upA;
      if (sortBy === 'label-asc') return String(a[categoryKey] || '').localeCompare(String(b[categoryKey] || ''));
      return 0;
    });
  }, [filteredData, sortBy, lowerKey, upperKey, categoryKey, variant]);

  // Dynamic Left Margin based on longest category label
  const margin = useMemo(() => {
    const isMobile = densityTier === 'compact';
    if (orientation === 'horizontal') {
      const maxLen = sortedData.reduce((max, d) => Math.max(max, String(d[categoryKey] || d.id || '').length), 0);
      const calcLeft = isMobile
        ? Math.min(120, Math.max(68, maxLen * 4.5 + 12))
        : Math.min(220, Math.max(140, maxLen * 6.5 + 24));
      return { top: 24, right: isMobile ? 18 : 36, bottom: 40, left: calcLeft };
    }
    return { top: 24, right: isMobile ? 16 : 32, bottom: isMobile ? 40 : 56, left: isMobile ? 44 : 64 };
  }, [orientation, sortedData, categoryKey, densityTier]);

  const headerHeight = (title || subtitle || showControls) ? 46 : 0;
  const svgWidth = Math.max(200, plotWidth - 40);
  const svgHeight = Math.max(160, plotHeight - headerHeight - 32);

  const innerWidth = Math.max(100, svgWidth - margin.left - margin.right);
  const innerHeight = Math.max(80, svgHeight - margin.top - margin.bottom);

  // Quantitative Domain Bounds
  const { domainMin, domainMax, domainSpan } = useMemo(() => {
    if (!sortedData || sortedData.length === 0) {
      return { domainMin: 0, domainMax: 100, domainSpan: 100 };
    }

    let min = Infinity;
    let max = -Infinity;

    sortedData.forEach(d => {
      const l = d[lowerKey] != null ? Number(d[lowerKey]) : null;
      const u = d[upperKey] != null ? Number(d[upperKey]) : null;
      const c = d[centerKey] != null ? Number(d[centerKey]) : null;
      const t = d[targetKey] != null ? Number(d[targetKey]) : null;

      if (l != null && !isNaN(l) && l < min) min = l;
      if (u != null && !isNaN(u) && u > max) max = u;
      if (c != null && !isNaN(c)) {
        if (c < min) min = c;
        if (c > max) max = c;
      }
      if (t != null && !isNaN(t)) {
        if (t < min) min = t;
        if (t > max) max = t;
      }
    });

    if (targetLine != null) {
      const tVal = typeof targetLine === 'number' ? targetLine : targetLine.value;
      if (tVal != null && !isNaN(tVal)) {
        if (tVal < min) min = tVal;
        if (tVal > max) max = tVal;
      }
    }

    if (min === Infinity || max === -Infinity) {
      return { domainMin: 0, domainMax: 100, domainSpan: 100 };
    }

    const span = max - min || 1;
    const pad = span * 0.08;
    return {
      domainMin: min - pad,
      domainMax: max + pad,
      domainSpan: (max + pad) - (min - pad)
    };
  }, [sortedData, lowerKey, upperKey, centerKey, targetKey, targetLine]);

  // Coordinate Scalers
  const valToX = useCallback((val: number | null | undefined) => {
    if (val == null || isNaN(val)) return 0;
    return ((val - domainMin) / domainSpan) * innerWidth;
  }, [domainMin, domainSpan, innerWidth]);

  const valToY = useCallback((val: number | null | undefined) => {
    if (val == null || isNaN(val)) return innerHeight;
    return innerHeight - ((val - domainMin) / domainSpan) * innerHeight;
  }, [domainMin, domainSpan, innerHeight]);

  // Axis Ticks
  const quantTicks = useMemo(() => {
    // Leave room for the formatted value and unit before adding another tick.
    // A fixed six-tick axis crowds compact dashboard cards.
    const longestLabel = Math.max(
      ...[domainMin, domainMin + domainSpan / 2, domainMax]
        .map(value => formatVizValue(value, unit, locale).length)
    );
    const minTickSpacing = Math.max(56, longestLabel * 6 + 24);
    const count = orientation === 'horizontal'
      ? Math.max(1, Math.min(5, Math.floor(innerWidth / minTickSpacing)))
      : 5;
    const ticks: number[] = [];
    for (let i = 0; i <= count; i++) {
      const val = domainMin + (domainSpan * (i / count));
      ticks.push(val);
    }
    return ticks;
  }, [domainMin, domainMax, domainSpan, innerWidth, orientation, unit, locale]);

  // Range Area Path calculation
  const rangeAreaPaths = useMemo(() => {
    if (variant !== 'range-area' || sortedData.length === 0) return null;

    const n = sortedData.length;
    const stepX = n > 1 ? innerWidth / (n - 1) : innerWidth / 2;

    const upperCoords: [number, number][] = [];
    const lowerCoords: [number, number][] = [];
    const centerCoords: [number, number][] = [];

    sortedData.forEach((d, i) => {
      const x = i * stepX;
      const up = Number(d[upperKey] ?? 0);
      const low = Number(d[lowerKey] ?? 0);
      const cent = d[centerKey] != null ? Number(d[centerKey]) : (low + up) / 2;

      const yUp = valToY(up);
      const yLow = valToY(low);
      const yCent = valToY(cent);

      upperCoords.push([x, yUp]);
      lowerCoords.unshift([x, yLow]);
      centerCoords.push([x, yCent]);
    });

    let bandPath = `M ${upperCoords[0][0]} ${upperCoords[0][1]}`;
    for (let i = 1; i < upperCoords.length; i++) {
      bandPath += ` L ${upperCoords[i][0]} ${upperCoords[i][1]}`;
    }
    for (let i = 0; i < lowerCoords.length; i++) {
      bandPath += ` L ${lowerCoords[i][0]} ${lowerCoords[i][1]}`;
    }
    bandPath += ' Z';

    let centerLinePath = `M ${centerCoords[0][0]} ${centerCoords[0][1]}`;
    for (let i = 1; i < centerCoords.length; i++) {
      centerLinePath += ` L ${centerCoords[i][0]} ${centerCoords[i][1]}`;
    }

    return { bandPath, centerLinePath, centerCoords };
  }, [variant, sortedData, upperKey, lowerKey, centerKey, innerWidth, valToY]);

  // Category band height / spacing
  const rowCount = Math.max(1, sortedData.length);
  const rowHeight = innerHeight / rowCount;
  const barThickness = Math.max(6, Math.min(22, rowHeight * 0.45));

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
      if (activeIndex >= 0) {
        e.preventDefault();
        setActiveIndex(-1);
        return;
      }
    }
    if (sortedData.length === 0) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveIndex(prev => {
        const next = (prev + 1) % sortedData.length;
        const item = sortedData[next];
        const label = item[categoryKey] || item.id;
        const low = formatVizValue(item[lowerKey], unit, locale);
        const up = formatVizValue(item[upperKey], unit, locale);
        setAnnouncement(`Selected interval ${label}: Lower ${low}, Upper ${up}, Status ${item.status || 'nominal'}.`);
        if (onItemClick) onItemClick(item, next);
        return next;
      });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveIndex(prev => {
        const next = (prev - 1 + sortedData.length) % sortedData.length;
        const item = sortedData[next];
        const label = item[categoryKey] || item.id;
        const low = formatVizValue(item[lowerKey], unit, locale);
        const up = formatVizValue(item[upperKey], unit, locale);
        setAnnouncement(`Selected interval ${label}: Lower ${low}, Upper ${up}, Status ${item.status || 'nominal'}.`);
        if (onItemClick) onItemClick(item, next);
        return next;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < sortedData.length) {
        const item = sortedData[activeIndex];
        setSelectedId(prev => prev === item.id ? null : (item.id || `item-${activeIndex}`));
      }
    }
  }, [sortedData, activeIndex, showTableModal, categoryKey, lowerKey, upperKey, unit, locale, onItemClick]);

  const activeItem = activeIndex >= 0 ? sortedData[activeIndex] : null;

  // Render Skeleton
  if (loading) {
    return (
      <div
        className={`mds-range-chart mds-range-chart--loading ${className}`}
        style={{
          width,
          height,
          background: 'var(--surface-card)',
          border: 'var(--border-hairline-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4) var(--space-5)',
          boxSizing: 'border-box',
          ...style
        }}
        role="region"
        aria-label={title || 'Range Chart Loading'}
        aria-busy="true"
      >
        <div style={{ width: '40%', height: 16, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-2)' }} />
        <div style={{ width: '25%', height: 12, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-5)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(var(--space-3) + var(--space-half))' }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ height: 20, background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)' }} />
          ))}
        </div>
      </div>
    );
  }

  // Render Empty State
  if (!data || data.length === 0) {
    return (
      <div
        className={`mds-range-chart mds-range-chart--empty ${className}`}
        style={{
          width,
          height,
          background: 'var(--surface-card)',
          border: 'var(--border-hairline-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4) var(--space-5)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          ...style
        }}
        role="region"
        aria-label={title || 'Range Chart Empty'}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
          <line x1="4" y1="9" x2="20" y2="9" />
          <line x1="4" y1="15" x2="20" y2="15" />
          <circle cx="8" cy="9" r="2" />
          <circle cx="16" cy="15" r="2" />
        </svg>
        <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mds-range-chart mds-range-chart--${variant} ${className}`}
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        width: typeof width === 'number' ? `${width}px` : width,
        maxWidth: '100%',
        background: 'var(--surface-card)',
        border: 'var(--border-hairline-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4) var(--space-5)',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        outline: 'none',
        ...style
      }}
      role="region"
      aria-label={ariaLabel || `Bounded Interval Range Chart: ${title}. ${sortedData.length} items. Use Arrow keys to navigate, Alt+F11 for data table.`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerLeave={() => setActiveIndex(-1)}
    >
      {/* Header & Controls Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        flexWrap: 'wrap',
        gap: 10
      }}>
        <div>
          {title && (
            <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-primary)' }}>
              {title}
            </div>
          )}
          {subtitle && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-half)' }}>
              {subtitle}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {showControls && (
            <>
              {/* Search Input */}
              {showSearch && (
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Filter intervals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      padding: 'var(--space-1) var(--space-2)',
                      fontSize: 11,
                      border: 'var(--border-hairline-strong)',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--surface-card)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      width: 130
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: 4,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-tertiary)',
                        fontSize: 10
                      }}
                    >✕</button>
                  )}
                </div>
              )}

              {/* Sort Select */}
              {variant !== 'range-area' && (
                <select
                  aria-label="Sort range chart data"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: 'var(--space-1) calc(var(--space-1) + var(--space-half))',
                    fontSize: 11,
                    border: 'var(--border-hairline-strong)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-card)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="default">Default Order</option>
                  <option value="spread-desc">Spread (High → Low)</option>
                  <option value="spread-asc">Spread (Low → High)</option>
                  <option value="lower-asc">Lower Bound (Ascending)</option>
                  <option value="upper-desc">Upper Bound (Descending)</option>
                  <option value="label-asc">Category Name (A → Z)</option>
                </select>
              )}
            </>
          )}

          {/* Accessible Table Modal Button */}
          <button
            type="button"
            onClick={() => setShowTableModal(prev => !prev)}
            style={{
              padding: 'var(--space-1) var(--space-2)',
              fontSize: 11,
              fontWeight: 600,
              border: 'var(--border-hairline-strong)',
              borderRadius: 'var(--radius-sm)',
              background: showTableModal ? 'var(--action-solid)' : 'var(--surface-card)',
              color: showTableModal ? 'var(--action-on-solid)' : 'var(--text-primary)',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Toggle Accessible Intervals Table (Alt+F11)"
            aria-label="Toggle Accessible Intervals Table"
          >
            Table (Alt+F11)
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <svg
        width="100%"
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
        aria-hidden="true"
        onClick={() => setActiveIndex(-1)}
      >
        <defs>
          <pattern id={`${chartId}-rc-hatch-warning`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="var(--status-warning-solid)" strokeWidth="2" opacity="0.4" />
          </pattern>
          <pattern id={`${chartId}-rc-hatch-critical`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="var(--status-critical-solid)" strokeWidth="2" opacity="0.45" />
          </pattern>
        </defs>

        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Continuous Axis Spines and Baseline */}
          {/* Vertical Y-axis Spine Line */}
          <line
            x1="0"
            y1="0"
            x2="0"
            y2={innerHeight}
            stroke="var(--border-strong)"
            strokeWidth="1.5"
          />

          {/* Horizontal X-axis Baseline */}
          <line
            x1="0"
            y1={innerHeight}
            x2={innerWidth}
            y2={innerHeight}
            stroke="var(--border-strong)"
            strokeWidth="1.5"
          />

          {/* Quantitative Grid Lines & Labels */}
          {orientation === 'horizontal' ? (
            <g className="grid-quantitative-x">
              {quantTicks.map((val, idx) => {
                const x = valToX(val);
                return (
                  <g key={idx} transform={`translate(${x}, 0)`}>
                    <line y1="0" y2={innerHeight} stroke="var(--border-subtle)" strokeWidth="1" />
                    <line y1={innerHeight} y2={innerHeight + 5} stroke="var(--border-strong)" strokeWidth="1.5" />
                    <text
                      y={innerHeight + 18}
                      fontSize="10"
                      fill="var(--text-secondary)"
                      textAnchor={idx === 0 ? 'start' : idx === quantTicks.length - 1 ? 'end' : 'middle'}
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {formatVizValue(val, unit, locale)}
                    </text>
                  </g>
                );
              })}
            </g>
          ) : (
            <g className="grid-quantitative-y">
              {quantTicks.map((val, idx) => {
                const y = valToY(val);
                return (
                  <g key={idx} transform={`translate(0, ${y})`}>
                    <line x1="0" x2={innerWidth} stroke="var(--border-subtle)" strokeWidth="1" />
                    <line x1="-5" x2="0" stroke="var(--border-strong)" strokeWidth="1.5" />
                    <text
                      x="-8"
                      y="3"
                      fontSize="10"
                      fill="var(--text-secondary)"
                      textAnchor="end"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {formatVizValue(val, unit, locale)}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Target Baseline Reference Line & Fully Contained Label */}
          {targetLine != null && (() => {
            const tVal = typeof targetLine === 'number' ? targetLine : targetLine.value;
            const tLabel = typeof targetLine === 'number' ? `Target: ${formatVizValue(tVal, unit, locale)}` : targetLine.label || `Target: ${formatVizValue(tVal, unit, locale)}`;
            if (tVal == null || isNaN(tVal)) return null;

            if (orientation === 'horizontal') {
              const tx = valToX(tVal);
              return (
                <g className="target-baseline" transform={`translate(${tx}, 0)`}>
                  <line y1="0" y2={innerHeight} stroke="var(--status-critical-solid)" strokeWidth="1.5" strokeDasharray="4,3" />
                  <text
                    x={0}
                    y="-7"
                    fontSize="10"
                    fontWeight="600"
                    fill="var(--status-critical-solid)"
                    textAnchor="middle"
                    style={{ paintOrder: 'stroke fill', stroke: 'var(--surface-card)', strokeWidth: 3 }}
                  >
                    {tLabel}
                  </text>
                </g>
              );
            } else {
              const ty = valToY(tVal);
              return (
                <g className="target-baseline" transform={`translate(0, ${ty})`}>
                  <line x1="0" x2={innerWidth} stroke="var(--status-critical-solid)" strokeWidth="1.5" strokeDasharray="4,3" />
                  <text
                    x={innerWidth - 6}
                    y="-5"
                    fontSize="10"
                    fontWeight="600"
                    fill="var(--status-critical-solid)"
                    textAnchor="end"
                    style={{ paintOrder: 'stroke fill', stroke: 'var(--surface-card)', strokeWidth: 3 }}
                  >
                    {tLabel}
                  </text>
                </g>
              );
            }
          })()}

          {/* VARIANT: RANGE AREA */}
          {variant === 'range-area' && rangeAreaPaths && (
            <g className="range-area-layer">
              <path
                d={rangeAreaPaths.bandPath}
                fill="var(--action-soft)"
                opacity="0.75"
                stroke="var(--action-solid)"
                strokeWidth="1"
              />
              <path
                d={rangeAreaPaths.centerLinePath}
                fill="none"
                stroke="var(--action-solid)"
                strokeWidth="2.5"
              />
              {rangeAreaPaths.centerCoords.map((pt, i) => {
                const _item = sortedData[i];
                const isActive = activeIndex === i;
                return (
                  <circle
                    key={i}
                    cx={pt[0]}
                    cy={pt[1]}
                    r={isActive ? 6 : 4}
                    fill="var(--action-solid)"
                    stroke="var(--surface-card)"
                    strokeWidth="2"
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                    onPointerEnter={(e) => {
                      e.stopPropagation();
                      setActiveIndex(i);
                    }}
                  />
                );
              })}
            </g>
          )}

          {/* VARIANT: DISCRETE HORIZONTAL */}
          {variant !== 'range-area' && orientation === 'horizontal' && (
            <g className="discrete-horizontal-layer">
              {sortedData.map((d, idx) => {
                const itemId = d.id || `item-${idx}`;
                const isSelected = selectedId === itemId;
                const isActive = activeIndex === idx;

                const low = Number(d[lowerKey] ?? 0);
                const up = Number(d[upperKey] ?? 0);
                const cent = d[centerKey] != null ? Number(d[centerKey]) : null;

                const xLow = valToX(low);
                const xUp = valToX(up);
                const xStart = Math.min(xLow, xUp);
                const barWidth = Math.max(2, Math.abs(xUp - xLow));

                const yCenter = idx * rowHeight + (rowHeight / 2);
                const status = d.status || 'nominal';
                const statusColor = STATUS_COLORS[status] || STATUS_COLORS.nominal;

                // Truncate category label if longer than left margin
                const rawLabel = String(d[categoryKey] || `Item ${idx + 1}`);
                const maxChars = Math.floor((margin.left - 20) / 6.8);
                const displayLabel = rawLabel.length > maxChars ? `${rawLabel.slice(0, maxChars - 1)}…` : rawLabel;

                return (
                  <g
                    key={itemId}
                    className="range-row-horizontal"
                    style={{ cursor: interactive ? 'pointer' : 'default' }}
                    onPointerEnter={(e) => {
                      e.stopPropagation();
                      if (!interactive) return;
                      setActiveIndex(idx);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!interactive) return;
                      setSelectedId(prev => prev === itemId ? null : itemId);
                      if (onItemClick) onItemClick(d, idx, e);
                    }}
                  >
                    {/* Row highlight background */}
                    <rect
                      x={-margin.left + 4}
                      y={idx * rowHeight + 1}
                      width={svgWidth - 8}
                      height={rowHeight - 2}
                      fill={isSelected ? 'var(--surface-selected)' : isActive ? 'var(--surface-sunken)' : 'transparent'}
                      rx="4"
                    />

                    {/* Y-axis row outward tick */}
                    <line
                      x1="-5"
                      x2="0"
                      y1={yCenter}
                      y2={yCenter}
                      stroke="var(--border-strong)"
                      strokeWidth="1"
                    />

                    {/* Category Label */}
                    <text
                      x="-8"
                      y={yCenter + 4}
                      fontSize="11"
                      fontWeight={isSelected || isActive ? 600 : 500}
                      fill={isSelected ? 'var(--action-solid)' : 'var(--text-primary)'}
                      textAnchor="end"
                    >
                      <title>{rawLabel}</title>
                      {displayLabel}
                    </text>

                    {/* SUB-VARIANT: INTERVAL BAR */}
                    {variant === 'interval-bar' && (
                      <g>
                        <rect
                          x={xStart}
                          y={yCenter - barThickness / 2}
                          width={barWidth}
                          height={barThickness}
                          rx={barThickness / 3}
                          fill={status === 'critical' ? `url(#${chartId}-rc-hatch-critical)` : status === 'warning' ? `url(#${chartId}-rc-hatch-warning)` : statusColor}
                          stroke={statusColor}
                          strokeWidth={isSelected ? 2 : 1}
                          opacity={isActive ? 1 : 0.9}
                        />

                        {showCenterEstimate && cent != null && (
                          <line
                            x1={valToX(cent)}
                            x2={valToX(cent)}
                            y1={yCenter - barThickness / 2 - 2}
                            y2={yCenter + barThickness / 2 + 2}
                            stroke="var(--text-primary)"
                            strokeWidth="2.5"
                          />
                        )}

                        {showDirectLabels && (
                          <g fontSize="10" fill="var(--text-secondary)" style={{ fontVariantNumeric: 'tabular-nums' }}>
                            <text
                              x={Math.max(4, xStart - 4)}
                              y={yCenter + 3}
                              textAnchor="end"
                              style={{ paintOrder: 'stroke fill', stroke: 'var(--surface-card)', strokeWidth: 3 }}
                            >
                              {low}
                            </text>
                            <text
                              x={Math.min(innerWidth - 4, xStart + barWidth + 4)}
                              y={yCenter + 3}
                              textAnchor="start"
                              style={{ paintOrder: 'stroke fill', stroke: 'var(--surface-card)', strokeWidth: 3 }}
                            >
                              {up}
                            </text>
                          </g>
                        )}
                      </g>
                    )}

                    {/* SUB-VARIANT: DUMBBELL */}
                    {variant === 'dumbbell' && (() => {
                      const isImproved = d.isImproved ?? (up <= low);
                      const endpointEndColor = isImproved ? DUMBBELL_ENDPOINT_COLORS.afterImproved : DUMBBELL_ENDPOINT_COLORS.afterRegressed;

                      return (
                        <g>
                          <line
                            x1={xLow}
                            x2={xUp}
                            y1={yCenter}
                            y2={yCenter}
                            stroke="var(--border-strong)"
                            strokeWidth={isSelected ? 3 : 2}
                            strokeDasharray={d.dashed ? '3,2' : undefined}
                          />

                          <circle
                            cx={xLow}
                            cy={yCenter}
                            r="5"
                            fill={DUMBBELL_ENDPOINT_COLORS.before}
                            stroke="var(--surface-card)"
                            strokeWidth="1.5"
                          />

                          <circle
                            cx={xUp}
                            cy={yCenter}
                            r="6"
                            fill={endpointEndColor}
                            stroke="var(--surface-card)"
                            strokeWidth="2"
                          />

                          {showDirectLabels && (
                            <g fontSize="10" fontWeight="600" style={{ fontVariantNumeric: 'tabular-nums' }}>
                              <text
                                x={xLow}
                                y={yCenter - 8}
                                textAnchor="middle"
                                fill="var(--text-secondary)"
                                style={{ paintOrder: 'stroke fill', stroke: 'var(--surface-card)', strokeWidth: 3 }}
                              >
                                {low}
                              </text>
                              <text
                                x={xUp}
                                y={yCenter - 8}
                                textAnchor="middle"
                                fill={endpointEndColor}
                                style={{ paintOrder: 'stroke fill', stroke: 'var(--surface-card)', strokeWidth: 3 }}
                              >
                                {up}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })()}

                    {/* SUB-VARIANT: ERROR BAR */}
                    {variant === 'error-bar' && (() => {
                      const cVal = cent != null ? cent : (low + up) / 2;
                      const xCent = valToX(cVal);

                      return (
                        <g>
                          <line
                            x1={xLow}
                            x2={xUp}
                            y1={yCenter}
                            y2={yCenter}
                            stroke="var(--text-primary)"
                            strokeWidth="1.5"
                          />
                          <line
                            x1={xLow}
                            x2={xLow}
                            y1={yCenter - 5}
                            y2={yCenter + 5}
                            stroke="var(--text-primary)"
                            strokeWidth="1.5"
                          />
                          <line
                            x1={xUp}
                            x2={xUp}
                            y1={yCenter - 5}
                            y2={yCenter + 5}
                            stroke="var(--text-primary)"
                            strokeWidth="1.5"
                          />
                          <circle
                            cx={xCent}
                            cy={yCenter}
                            r="5"
                            fill={statusColor}
                            stroke="var(--surface-card)"
                            strokeWidth="1.5"
                          />
                        </g>
                      );
                    })()}
                  </g>
                );
              })}
            </g>
          )}

          {/* VARIANT: DISCRETE VERTICAL */}
          {variant !== 'range-area' && orientation === 'vertical' && (
            <g className="discrete-vertical-layer">
              {sortedData.map((d, idx) => {
                const itemId = d.id || `item-${idx}`;
                const isSelected = selectedId === itemId;
                const isActive = activeIndex === idx;

                const colWidth = innerWidth / rowCount;
                const xCenter = idx * colWidth + (colWidth / 2);

                const low = Number(d[lowerKey] ?? 0);
                const up = Number(d[upperKey] ?? 0);
                const cent = d[centerKey] != null ? Number(d[centerKey]) : null;

                const yLow = valToY(low);
                const yUp = valToY(up);
                const yStart = Math.min(yLow, yUp);
                const barHeight = Math.max(2, Math.abs(yLow - yUp));

                const status = d.status || 'nominal';
                const statusColor = STATUS_COLORS[status] || STATUS_COLORS.nominal;

                return (
                  <g
                    key={itemId}
                    className="range-col-vertical"
                    style={{ cursor: interactive ? 'pointer' : 'default' }}
                    onPointerEnter={(e) => {
                      e.stopPropagation();
                      if (!interactive) return;
                      setActiveIndex(idx);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!interactive) return;
                      setSelectedId(prev => prev === itemId ? null : itemId);
                      if (onItemClick) onItemClick(d, idx, e);
                    }}
                  >
                    {/* Column highlight background */}
                    <rect
                      x={idx * colWidth + 2}
                      y={0}
                      width={colWidth - 4}
                      height={innerHeight}
                      fill={isSelected ? 'var(--surface-selected)' : isActive ? 'var(--surface-sunken)' : 'transparent'}
                      rx="4"
                    />

                    {/* Bottom Outward Tick */}
                    <line
                      x1={xCenter}
                      x2={xCenter}
                      y1={innerHeight}
                      y2={innerHeight + 5}
                      stroke="var(--border-strong)"
                      strokeWidth="1"
                    />

                    {/* Category Label at bottom */}
                    <text
                      x={xCenter}
                      y={innerHeight + 18}
                      fontSize="10"
                      fontWeight={isSelected || isActive ? 600 : 500}
                      fill={isSelected ? 'var(--action-solid)' : 'var(--text-primary)'}
                      textAnchor="middle"
                    >
                      {d[categoryKey] || `Item ${idx + 1}`}
                    </text>

                    {/* Vertical Interval Bar */}
                    {variant === 'interval-bar' && (
                      <g>
                        <rect
                          x={xCenter - barThickness / 2}
                          y={yStart}
                          width={barThickness}
                          height={barHeight}
                          rx={barThickness / 3}
                          fill={status === 'critical' ? `url(#${chartId}-rc-hatch-critical)` : status === 'warning' ? `url(#${chartId}-rc-hatch-warning)` : statusColor}
                          stroke={statusColor}
                          strokeWidth={isSelected ? 2 : 1}
                          opacity={isActive ? 1 : 0.9}
                        />

                        {showCenterEstimate && cent != null && (
                          <line
                            x1={xCenter - barThickness / 2 - 2}
                            x2={xCenter + barThickness / 2 + 2}
                            y1={valToY(cent)}
                            y2={valToY(cent)}
                            stroke="var(--text-primary)"
                            strokeWidth="2.5"
                          />
                        )}
                      </g>
                    )}

                    {/* Vertical Error Bar */}
                    {variant === 'error-bar' && (() => {
                      const cVal = cent != null ? cent : (low + up) / 2;
                      const yCent = valToY(cVal);

                      return (
                        <g>
                          <line
                            x1={xCenter}
                            x2={xCenter}
                            y1={yLow}
                            y2={yUp}
                            stroke="var(--text-primary)"
                            strokeWidth="1.5"
                          />
                          <line
                            x1={xCenter - 5}
                            x2={xCenter + 5}
                            y1={yLow}
                            y2={yLow}
                            stroke="var(--text-primary)"
                            strokeWidth="1.5"
                          />
                          <line
                            x1={xCenter - 5}
                            x2={xCenter + 5}
                            y1={yUp}
                            y2={yUp}
                            stroke="var(--text-primary)"
                            strokeWidth="1.5"
                          />
                          <circle
                            cx={xCenter}
                            cy={yCent}
                            r="5"
                            fill={statusColor}
                            stroke="var(--surface-card)"
                            strokeWidth="1.5"
                          />
                        </g>
                      );
                    })()}
                  </g>
                );
              })}
            </g>
          )}
        </g>
      </svg>

      {/* Layer 5: 2D Quad-Flip Non-Occluding Tooltip Overlay */}
      {activeItem && (
        renderTooltip ? renderTooltip(activeItem) : (
          <div
            style={{
              position: 'absolute',
              left: orientation === 'horizontal'
                ? Math.min(Math.max(12, margin.left + valToX(activeItem[centerKey] ?? activeItem[upperKey]) + 15), width - 210)
                : Math.min(Math.max(12, margin.left + (activeIndex * (innerWidth / rowCount)) + 20), width - 210),
              top: orientation === 'horizontal'
                ? Math.min(Math.max(12, 16 + headerHeight + margin.top + (activeIndex * rowHeight) - 20), height - 120)
                : Math.min(Math.max(12, 16 + headerHeight + margin.top + valToY(activeItem[centerKey] ?? activeItem[upperKey]) - 20), height - 120),
              background: 'var(--tooltip-background)',
              color: 'var(--tooltip-foreground)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--tooltip-radius)',
              fontSize: 'var(--text-2xs)',
              lineHeight: 1.4,
              boxShadow: 'var(--tooltip-shadow)',
              pointerEvents: 'none',
              zIndex: 100,
              maxWidth: '200px',
              border: 'var(--border-width) solid var(--tooltip-border)'
            }}
            role="tooltip"
          >
            <div style={{ fontWeight: 700, fontSize: 'var(--text-xs)', color: 'var(--tooltip-foreground)', marginBottom: 'var(--space-half)' }}>
              {activeItem[categoryKey] || activeItem.label || activeItem.id}
            </div>

            {activeItem.intervalSemantics && (
              <div style={{ color: 'var(--tooltip-shortcut-text)', fontSize: 'var(--text-2xs)', marginBottom: 'var(--space-1)' }}>
                Construct: <strong>{activeItem.intervalSemantics}</strong>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: 'calc(var(--space-half) + var(--space-1)) var(--space-2)', fontSize: 'var(--text-2xs)' }}>
              <span style={{ color: 'var(--tooltip-foreground)' }}>Lower Bound:</span>
              <strong style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatVizValue(activeItem[lowerKey], unit, locale)}</strong>

              <span style={{ color: 'var(--tooltip-foreground)' }}>Upper Bound:</span>
              <strong style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatVizValue(activeItem[upperKey], unit, locale)}</strong>

              {activeItem[centerKey] != null && (
                <>
                  <span style={{ color: 'var(--text-link-inverse)' }}>Center:</span>
                  <strong style={{ textAlign: 'right', color: 'var(--text-link-inverse)', fontVariantNumeric: 'tabular-nums' }}>
                    {formatVizValue(activeItem[centerKey], unit, locale)}
                  </strong>
                </>
              )}

              <span style={{ color: 'var(--tooltip-foreground)' }}>Spread:</span>
              <strong style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {formatVizValue(Math.abs(Number(activeItem[upperKey]) - Number(activeItem[lowerKey])), unit, locale)}
              </strong>

              {variant === 'dumbbell' && (
                <>
                  <span style={{ color: 'var(--status-warning-text)' }}>Delta:</span>
                  <strong style={{ textAlign: 'right', color: 'var(--status-warning-text)', fontVariantNumeric: 'tabular-nums' }}>
                    {(Number(activeItem[upperKey]) - Number(activeItem[lowerKey])).toFixed(1)} {unit}
                  </strong>
                </>
              )}
            </div>

            {activeItem.status && (
              <div style={{ marginTop: 'var(--space-1)', fontSize: 'var(--text-2xs)', color: STATUS_COLORS[activeItem.status] || 'var(--tooltip-shortcut-text)', fontWeight: 600 }}>
                ● Status: {activeItem.status.toUpperCase()}
              </div>
            )}
          </div>
        )
      )}

      {/* Accessible Intervals Data Table Modal (Alt+F11) */}
      {showTableModal && (
        <div ref={tableDialogRef} tabIndex={-1}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--scrim)',
            backdropFilter: 'var(--blur-overlay)',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--space-4)'
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Accessible Bounded Intervals Matrix"
        >
          <div
            style={{
              background: 'var(--surface-card)',
              borderRadius: 'var(--radius-md)',
              border: 'var(--border-hairline-subtle)',
              boxShadow: 'var(--dialog-shadow)',
              width: '100%',
              maxWidth: 620,
              maxHeight: '90%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) var(--space-4)', borderBottom: 'var(--border-hairline-subtle)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Accessible Bounded Intervals Matrix
                </div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)' }}>
                  {sortedData.length} records · Bounds expressed in {unit.trim() || 'Units'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)'
                }}
                aria-label="Close table modal"
              >
                &times;
              </button>
            </div>

            <div style={{ overflowY: 'auto', padding: 'var(--space-4)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-sunken)', borderBottom: 'var(--border-width-emphasis) solid var(--border-default)' }}>
                    <th style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', color: 'var(--text-secondary)', fontWeight: 600 }}>Category / Station</th>
                    <th style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Lower Limit</th>
                    <th style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Center</th>
                    <th style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Upper Limit</th>
                    <th style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', color: 'var(--text-secondary)', fontWeight: 600, textAlign: 'right' }}>Span (Spread)</th>
                    <th style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', color: 'var(--text-secondary)', fontWeight: 600 }}>Health</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((d, idx) => {
                    const low = Number(d[lowerKey] ?? 0);
                    const up = Number(d[upperKey] ?? 0);
                    const cent = d[centerKey] != null ? Number(d[centerKey]) : null;
                    const spread = Math.abs(up - low);
                    const status = d.status || 'nominal';

                    return (
                      <tr key={idx} style={{ borderBottom: 'var(--border-hairline-subtle)' }}>
                        <td style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {d[categoryKey] || d.id}
                        </td>
                        <td style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                          {formatVizValue(low, '', locale)}
                        </td>
                        <td style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--action-solid)' }}>
                          {cent != null ? formatVizValue(cent, '', locale) : '—'}
                        </td>
                        <td style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                          {formatVizValue(up, '', locale)}
                        </td>
                        <td style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                          {formatVizValue(spread, '', locale)}
                        </td>
                        <td style={{ padding: 'var(--space-2) calc(var(--space-2) + var(--space-half))' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: 'var(--space-half) calc(var(--space-1) + var(--space-half))',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--text-2xs)',
                            fontWeight: 600,
                            backgroundColor: status === 'critical' ? 'var(--status-critical-soft)' : status === 'warning' ? 'var(--status-warning-soft)' : 'var(--status-success-soft)',
                            color: status === 'critical' ? 'var(--status-critical-text)' : status === 'warning' ? 'var(--status-warning-text)' : 'var(--status-success-text)',
                            border: `var(--border-width) solid ${status === 'critical' ? 'var(--status-critical-border)' : status === 'warning' ? 'var(--status-warning-border)' : 'var(--status-success-border)'}`
                          }}>
                            {status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
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
                  color: 'var(--action-on-solid)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
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

      {/* Live Region for Screen Reader Announcements */}
      <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(var(--space-px), var(--space-px), var(--space-px), var(--space-px))' }} aria-live="polite">
        {announcement || (activeItem ? `Selected interval ${activeItem[categoryKey] || activeItem.id}: Lower ${formatVizValue(activeItem[lowerKey], unit, locale)}, Upper ${formatVizValue(activeItem[upperKey], unit, locale)}, Status ${activeItem.status || 'nominal'}.` : '')}
      </div>
    </div>
  );
};

export default RangeChart;
