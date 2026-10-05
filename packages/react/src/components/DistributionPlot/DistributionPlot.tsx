/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- chart application region is intentionally keyboard reachable */
import React,{ useId,useMemo,useRef,useState } from 'react';
import {
PATTERN_PRESETS,
VIZ_COLORS,
computeBoxPlotQuantiles,
computeHistogramBins,
computeKDE,
createAreaPath,
createBandScale,
createKeyboardRovingFocus,
createLinePath,
createLinearScale,
createPlotRegion,
formatVizValue,
generateTicks,
renderPointSymbol,
useResponsiveVizBounds
} from '../../utils/viz-core.js';

export type DistributionPlotVariant = 'histogram' | 'box' | 'violin' | 'strip' | 'dotplot' | 'density';
export type DistributionDensity = 'compact' | 'standard' | 'expanded';

export interface DistributionSeriesDef {
  key: string;
  label?: string;
  color?: string;
  pattern?: string;
}

export interface DistributionReferenceLine {
  value: number;
  label?: string;
  color?: string;
  position?: 'top' | 'bottom' | 'start' | 'center' | 'end';
  yOffset?: number;
}

export interface DistributionToleranceBand {
  min: number;
  max: number;
  label?: string;
  color?: string;
  tone?: 'optimal' | 'warning' | 'critical' | 'neutral';
}

export interface DistributionPlotProps {
  data: Array<Record<string, any>> | number[];
  valueKey?: string;
  categoryKey?: string | null;
  series?: DistributionSeriesDef[];
  variant?: DistributionPlotVariant;
  orientation?: 'vertical' | 'horizontal';
  binCount?: number | null;
  binWidth?: number | null;
  bandwidth?: number | null;
  width?: number | string;
  height?: number;
  margins?: Partial<{ top: number; right: number; bottom: number; left: number }>;
  unit?: string;
  valueLabel?: string;
  categoryLabel?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
  referenceLines?: DistributionReferenceLine[];
  toleranceBands?: DistributionToleranceBand[];
  showGrid?: boolean;
  showLegend?: boolean;
  showDataTable?: boolean;
  showOutliers?: boolean;
  showMean?: boolean;
  enablePatterns?: boolean;
  density?: DistributionDensity;
  emptyMessage?: string;
  loading?: boolean;
  onElementSelect?: (group: Record<string, any>, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * DistributionPlot — Meridian Design System
 *
 * Visualizes the shape, frequency, density, spread, central tendency, quantiles,
 * and outliers of one or more quantitative distributions.
 */
export const DistributionPlot: React.FC<DistributionPlotProps> = ({
  data = [],
  valueKey = 'value',
  categoryKey = null,
  series: _series = [],
  variant = 'histogram',
  orientation: _orientation = 'vertical',
  binCount = null,
  binWidth = null,
  bandwidth = null,
  width = 640,
  height = 360,
  margins,
  unit = '',
  valueLabel = 'Measured Value',
  categoryLabel = 'Group',
  locale = 'en-IN',
  title,
  subtitle,
  referenceLines = [],
  toleranceBands = [],
  showGrid = true,
  showLegend,
  showDataTable = true,
  showOutliers = true,
  showMean = true,
  enablePatterns = true,
  density = 'standard',
  emptyMessage = 'No distribution telemetry records found.',
  loading = false,
  onElementSelect,
  className = '',
  style = {}
}) => {
  const chartId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeElementIndex, setActiveElementIndex] = useState(-1);
  const [, setSelectedElementIndex] = useState(-1);
  const [isolatedCategory, setIsolatedCategory] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{
    title: string;
    subtitle?: string;
    rows: Array<{ label: string; value: string; color?: string }>;
    x: number;
    y: number;
  } | null>(null);

  // Group Observations by Category or Single Aggregate
  const groupedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    if (!categoryKey) {
      const rawVals = data.map((d: any) => (typeof d === 'number' ? d : Number(d[valueKey]))).filter((v: number) => !isNaN(v));
      return [{
        key: 'all',
        label: title || 'Distribution',
        color: VIZ_COLORS[0],
        pattern: PATTERN_PRESETS[0].id,
        values: rawVals,
        items: data
      }];
    }

    const map = new Map<string, number[]>();
    (data as Array<Record<string, any>>).forEach((d: any) => {
      const cat = String(d[categoryKey] || 'Other');
      if (!map.has(cat)) map.set(cat, []);
      const v = typeof d === 'number' ? d : Number(d[valueKey]);
      if (!isNaN(v)) map.get(cat)!.push(v);
    });

    const categories = Array.from(map.keys());
    return categories.map((cat, idx) => ({
      key: cat,
      label: cat,
      color: VIZ_COLORS[idx % VIZ_COLORS.length],
      pattern: PATTERN_PRESETS[idx % PATTERN_PRESETS.length].id,
      values: map.get(cat)!,
      items: (data as any[]).filter((d: any) => String(d[categoryKey]) === cat)
    }));
  }, [data, valueKey, categoryKey, title]);

  // Filter Active Categories
  const activeGroups = useMemo(() => {
    if (isolatedCategory) {
      return groupedData.filter(g => g.key === isolatedCategory);
    }
    return groupedData;
  }, [groupedData, isolatedCategory]);

  const { width: measuredWidth, height: measuredHeight, densityTier } = useResponsiveVizBounds(containerRef, typeof width === 'number' ? width : 640, typeof height === 'number' ? height : 360);

  const plotWidth = Math.max(280, measuredWidth || (typeof width === 'number' ? width : 640));
  const plotHeight = Math.max(180, measuredHeight || (typeof height === 'number' ? height : 360));

  // Effective Margins: dynamically allocate space for category labels + rotated axis title
  const effectiveMargins = useMemo(() => {
    const isMobile = densityTier === 'compact';
    let calculatedLeft = isMobile ? 48 : 64;
    if (categoryKey && activeGroups.length > 0) {
      const maxLabelChars = Math.max(...activeGroups.map(g => (g.label || '').length), 4);
      // Character width estimate ~7.5px + 14px tick offset + 26px for rotated title + 18px margin
      const titleSpace = categoryLabel ? (isMobile ? 18 : 28) : 8;
      calculatedLeft = isMobile
        ? Math.max(64, Math.ceil(maxLabelChars * 5.5) + 12 + titleSpace)
        : Math.max(96, Math.ceil(maxLabelChars * 7.5) + 16 + titleSpace);
    } else if (variant === 'histogram' || variant === 'density') {
      calculatedLeft = isMobile ? 48 : 68;
    }

    return {
      top: margins?.top ?? 24,
      right: margins?.right ?? (isMobile ? 16 : 28),
      bottom: margins?.bottom ?? 44,
      left: margins?.left ?? calculatedLeft
    };
  }, [categoryKey, categoryLabel, activeGroups, variant, margins, densityTier]);

  // Dimensions & Plot Region
  const plot = useMemo(() => {
    return createPlotRegion({
      containerWidth: plotWidth,
      containerHeight: plotHeight,
      margins: effectiveMargins
    });
  }, [plotWidth, plotHeight, effectiveMargins]);

  // Compute Overall Extents across all groups, reference lines, and tolerance bands
  const { allValues, globalMin, globalMax } = useMemo(() => {
    const vals: number[] = [];
    groupedData.forEach(g => vals.push(...g.values));
    if (vals.length === 0) return { allValues: [], globalMin: 0, globalMax: 100 };

    let minV = Math.min(...vals);
    let maxV = Math.max(...vals);

    referenceLines.forEach(ref => {
      if (typeof ref.value === 'number' && !isNaN(ref.value)) {
        minV = Math.min(minV, ref.value);
        maxV = Math.max(maxV, ref.value);
      }
    });

    toleranceBands.forEach(b => {
      if (typeof b.min === 'number' && !isNaN(b.min)) minV = Math.min(minV, b.min);
      if (typeof b.max === 'number' && !isNaN(b.max)) maxV = Math.max(maxV, b.max);
    });

    const span = maxV - minV || 1;
    const padding = span * 0.08;
    return {
      allValues: vals,
      globalMin: minV - padding,
      globalMax: maxV + padding
    };
  }, [groupedData, referenceLines, toleranceBands]);

  // Statistical Transformations per Variant
  const transformedGroups = useMemo(() => {
    return activeGroups.map((g) => {
      const bins = computeHistogramBins(g.values, {
        binCount: binCount ?? undefined,
        binWidth: binWidth ?? undefined,
        min: globalMin,
        max: globalMax
      });

      const boxStats = computeBoxPlotQuantiles(g.values);

      const kde = computeKDE(g.values, {
        bandwidth: bandwidth ?? undefined,
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

    // Explicit baseline: null so scaleVal is NOT forced to 0
    const scaleVal = createLinearScale({
      domain: [globalMin, globalMax],
      range: [0, plot.plotWidth],
      baseline: null
    });

    const catKeys = activeGroups.map(g => g.key);
    const scaleCat = createBandScale({
      domain: catKeys,
      range: [0, plot.plotHeight],
      paddingInner: 0.32,
      paddingOuter: 0.16
    });

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
      domain: [0, (maxFreqOrDensity || 1) * 1.12],
      range: [plot.plotHeight, 0],
      baseline: 0
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
    }
  });

  const activeGroup = activeElementIndex >= 0 ? transformedGroups[activeElementIndex] : null;

  // Skeleton Loading View
  if (loading) {
    return (
      <div
        ref={containerRef}
        className={`mds-dist-plot mds-dist-plot--loading ${className}`}
        style={{ width: typeof width === 'number' ? `${width}px` : width, height, position: 'relative', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', maxWidth: '100%', ...style }}
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

  if (!data || data.length === 0 || allValues.length === 0) {
    return (
      <div
        ref={containerRef}
        className={`mds-dist-plot mds-dist-plot--empty ${className}`}
        style={{ width: typeof width === 'number' ? `${width}px` : width, height, boxSizing: 'border-box', maxWidth: '100%', ...style }}
        role="region"
        aria-label={title || 'Distribution Plot Empty'}
      >
        {title && <h2 className="mds-dist-plot__title">{title}</h2>}
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
    <>
    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- chart application region supports keyboard inspection */}
    <div
      ref={containerRef}
      className={`mds-dist-plot mds-dist-plot--${variant} mds-dist-plot--density-${density} ${className}`}
      style={{ width: typeof width === 'number' ? `${width}px` : width, position: 'relative', boxSizing: 'border-box', maxWidth: '100%', ...style }}
      role="application"
      aria-roledescription="distribution plot"
      aria-label={`${title || 'Quantitative distribution visualization'} (${chartId})`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseLeave={() => setHoveredItem(null)}
    >
      {(title || subtitle) && (
        <div className="mds-dist-plot__header">
          <div>
            {title && <h2 className="mds-dist-plot__title">{title}</h2>}
            {subtitle && <p className="mds-dist-plot__subtitle">{subtitle}</p>}
          </div>
        </div>
      )}

      {Boolean(showLegend ?? (variant === 'density' && groupedData.length > 1)) && groupedData.length > 1 && (
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
                <span className="mds-dist-plot__legend-label">{g.label}</span>
              </button>
            );
          })}
        </div>
      )}

      <svg
        width="100%"
        height={plotHeight}
        viewBox={`0 0 ${plotWidth} ${plotHeight}`}
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
                <line x1="0" y1="4" x2="8" y2="4" stroke="rgba(255,255,255,0.35)" strokeWidth={1.2} />
              )}
            </pattern>
          ))}
          <clipPath id={`${chartId}-clip`}>
            <rect x="0" y="0" width={plot.plotWidth} height={plot.plotHeight} />
          </clipPath>
        </defs>

        <g transform={`translate(${plot.margins.left}, ${plot.margins.top})`}>
          {toleranceBands.map((band, idx) => {
            const x1 = scales.scaleVal ? (scales.scaleVal(band.min) ?? 0) : 0;
            const x2 = scales.scaleVal ? (scales.scaleVal(band.max) ?? 0) : 0;
            const bandW = Math.abs(x2 - x1);
            const startX = Math.min(x1, x2);
            const bandFill = band.color || (band.tone === 'critical' ? 'rgba(239, 68, 68, 0.08)' : band.tone === 'warning' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)');
            const bandStroke = band.color || (band.tone === 'critical' ? 'rgba(239, 68, 68, 0.3)' : band.tone === 'warning' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)');
            const textColor = band.tone === 'critical' ? 'var(--status-critical-solid, #ef4444)' : band.tone === 'warning' ? 'var(--status-warning-solid, #f59e0b)' : 'var(--status-success-solid, #10b981)';

            return (
              <g key={`tol-${idx}`} className="mds-dist-plot__tolerance-band">
                <rect
                  x={startX}
                  y="0"
                  width={bandW}
                  height={plot.plotHeight}
                  fill={bandFill}
                  stroke={bandStroke}
                  strokeDasharray="3 3"
                />
                {band.label && (
                  <text
                    x={startX + bandW / 2}
                    y={plot.plotHeight - 10}
                    textAnchor="middle"
                    fill={textColor}
                    stroke="var(--surface-card, #ffffff)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    paintOrder="stroke fill"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="var(--font-mono, monospace)"
                    className="mds-dist-plot__band-label"
                  >
                    {band.label}
                  </text>
                )}
              </g>
            );
          })}

          {showGrid && scales.valTicks.map((tickVal: any, idx: number) => {
            const xPos = scales.scaleVal ? (scales.scaleVal(tickVal) ?? 0) : 0;
            return (
              <g key={`x-grid-${idx}`} className="mds-dist-plot__gridline">
                <line x1={xPos} y1="0" x2={xPos} y2={plot.plotHeight} stroke="var(--border-subtle, #e2e8f0)" strokeDasharray="2 2" />
              </g>
            );
          })}

          {/* 1. Histogram */}
          {variant === 'histogram' && transformedGroups.map((g) => (
            <g key={g.key} className="mds-dist-plot__hist-group">
              {g.bins.map((bin) => {
                const xPos = scales.scaleVal ? (scales.scaleVal(bin.x0) ?? 0) : 0;
                const nextX = scales.scaleVal ? (scales.scaleVal(bin.x1) ?? 0) : 0;
                const barW = Math.max(1, nextX - xPos - 1.5);
                const yPos = scales.scaleFreq ? (scales.scaleFreq(bin.count) ?? 0) : 0;
                const barH = plot.plotHeight - yPos;

                return (
                  <g
                    key={`bin-${bin.binIndex}`}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      const rect = containerRef.current?.getBoundingClientRect();
                      const mouseX = e.clientX - (rect?.left || 0);
                      const mouseY = e.clientY - (rect?.top || 0);
                      setHoveredItem({
                        title: g.label,
                        subtitle: `Bin [${bin.x0.toFixed(3)} – ${bin.x1.toFixed(3)}${unit}]`,
                        rows: [
                          { label: 'Bin Count', value: `${bin.count} parts`, color: g.color },
                          { label: 'Population Share', value: `${((bin.count / Math.max(1, g.values.length)) * 100).toFixed(1)}%` },
                          { label: 'Sample Mean', value: `${(g.boxStats.mean ?? 0).toFixed(3)}${unit}` }
                        ],
                        x: mouseX,
                        y: mouseY
                      });
                    }}
                  >
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

          {/* 2. Box Plot */}
          {variant === 'box' && transformedGroups.map((g) => {
            const stats = g.boxStats;
            const catY = scales.scaleCat ? (scales.scaleCat(g.key) ?? 0) : 0;
            const bandWidth = scales.scaleCat ? scales.scaleCat.bandwidth() : 36;
            const boxH = Math.min(36, bandWidth * 0.7);
            const cy = catY + bandWidth / 2;

            const xLWhisker = scales.scaleVal ? (scales.scaleVal(stats.lowerWhisker) ?? 0) : 0;
            const xQ1 = scales.scaleVal ? (scales.scaleVal(stats.q1) ?? 0) : 0;
            const xMedian = scales.scaleVal ? (scales.scaleVal(stats.median) ?? 0) : 0;
            const xQ3 = scales.scaleVal ? (scales.scaleVal(stats.q3) ?? 0) : 0;
            const xUWhisker = scales.scaleVal ? (scales.scaleVal(stats.upperWhisker) ?? 0) : 0;
            const xMean = stats.mean != null && scales.scaleVal ? (scales.scaleVal(stats.mean) ?? null) : null;

            return (
              <g
                key={g.key}
                className="mds-dist-plot__box-group"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  const mouseX = e.clientX - (rect?.left || 0);
                  const mouseY = e.clientY - (rect?.top || 0);
                  setHoveredItem({
                    title: g.label,
                    subtitle: `Sample Count: ${stats.count} observations`,
                    rows: [
                      { label: 'Median', value: `${stats.median.toFixed(2)}${unit}`, color: g.color },
                      { label: 'Mean', value: `${(stats.mean ?? 0).toFixed(2)}${unit}` },
                      { label: 'IQR (Q1–Q3)', value: `${stats.q1.toFixed(2)} – ${stats.q3.toFixed(2)}${unit}` },
                      { label: 'Whiskers', value: `${stats.lowerWhisker.toFixed(2)} – ${stats.upperWhisker.toFixed(2)}${unit}` },
                      { label: 'Outliers', value: `${stats.outliers.length} detected` }
                    ],
                    x: mouseX,
                    y: mouseY
                  });
                }}
              >
                <line x1={xLWhisker} y1={cy} x2={xQ1} y2={cy} stroke={g.color} strokeWidth="1.5" />
                <line x1={xQ3} y1={cy} x2={xUWhisker} y2={cy} stroke={g.color} strokeWidth="1.5" />

                <line x1={xLWhisker} y1={cy - boxH / 3} x2={xLWhisker} y2={cy + boxH / 3} stroke={g.color} strokeWidth="1.5" />
                <line x1={xUWhisker} y1={cy - boxH / 3} x2={xUWhisker} y2={cy + boxH / 3} stroke={g.color} strokeWidth="1.5" />

                <rect
                  x={xQ1}
                  y={cy - boxH / 2}
                  width={Math.max(2, xQ3 - xQ1)}
                  height={boxH}
                  fill={g.color}
                  opacity="0.75"
                  stroke={g.color}
                  strokeWidth="1.5"
                  rx="3"
                />

                {enablePatterns && (
                  <rect
                    x={xQ1}
                    y={cy - boxH / 2}
                    width={Math.max(2, xQ3 - xQ1)}
                    height={boxH}
                    fill={`url(#${chartId}-${g.pattern})`}
                    opacity="0.6"
                    rx="3"
                  />
                )}

                <line
                  x1={xMedian}
                  y1={cy - boxH / 2}
                  x2={xMedian}
                  y2={cy + boxH / 2}
                  stroke="var(--surface-card, #ffffff)"
                  strokeWidth="3"
                />

                {showMean && xMean != null && (
                  <path
                    d={renderPointSymbol('diamond', xMean, cy, 5)}
                    fill="var(--status-critical-solid, #ef4444)"
                    stroke="#ffffff"
                    strokeWidth="1"
                  />
                )}

                {showOutliers && stats.outliers.map((outVal, oIdx) => (
                  <circle
                    key={`out-${oIdx}`}
                    cx={scales.scaleVal ? (scales.scaleVal(outVal) ?? 0) : 0}
                    cy={cy}
                    r="4"
                    fill="var(--status-critical-solid, #ef4444)"
                    stroke="var(--surface-card, #ffffff)"
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            );
          })}

          {/* 3. Violin Plot */}
          {variant === 'violin' && transformedGroups.map((g) => {
            const catY = scales.scaleCat ? (scales.scaleCat(g.key) ?? 0) : 0;
            const bandWidth = scales.scaleCat ? scales.scaleCat.bandwidth() : 36;
            const maxW = bandWidth * 0.45;
            const cy = catY + bandWidth / 2;
            const stats = g.boxStats;

            const upperPoints: Array<{ x: number; y: number }> = [];
            const lowerPoints: Array<{ x: number; y: number }> = [];

            g.kde.points.forEach(pt => {
              const px = scales.scaleVal ? (scales.scaleVal(pt.x) ?? 0) : 0;
              const offset = (pt.density / (g.kde.maxDensity || 1)) * maxW;
              upperPoints.push({ x: px, y: cy - offset });
              lowerPoints.push({ x: px, y: cy + offset });
            });

            const violinPathD = createAreaPath(upperPoints, lowerPoints, 'monotone');

            return (
              <g
                key={g.key}
                className="mds-dist-plot__violin-group"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  const mouseX = e.clientX - (rect?.left || 0);
                  const mouseY = e.clientY - (rect?.top || 0);
                  setHoveredItem({
                    title: g.label,
                    subtitle: `Violin KDE Density Spread`,
                    rows: [
                      { label: 'Peak Density', value: (g.kde.maxDensity || 0).toFixed(4), color: g.color },
                      { label: 'Median Value', value: `${stats.median.toFixed(2)}${unit}` },
                      { label: 'Interquartile Span', value: `${stats.iqr.toFixed(2)}${unit}` },
                      { label: 'Total Samples', value: `${g.values.length} records` }
                    ],
                    x: mouseX,
                    y: mouseY
                  });
                }}
              >
                <path d={violinPathD} fill={g.color} opacity="0.65" stroke={g.color} strokeWidth="1.5" />

                <line
                  x1={scales.scaleVal ? (scales.scaleVal(stats.q1) ?? 0) : 0}
                  y1={cy}
                  x2={scales.scaleVal ? (scales.scaleVal(stats.q3) ?? 0) : 0}
                  y2={cy}
                  stroke="var(--text-primary, #0f172a)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <circle
                  cx={scales.scaleVal ? (scales.scaleVal(stats.median) ?? 0) : 0}
                  cy={cy}
                  r="3.5"
                  fill="var(--surface-card, #ffffff)"
                />
              </g>
            );
          })}

          {/* 4. Strip Plot */}
          {variant === 'strip' && transformedGroups.map((g) => {
            const catY = scales.scaleCat ? (scales.scaleCat(g.key) ?? 0) : 0;
            const bandWidth = scales.scaleCat ? scales.scaleCat.bandwidth() : 36;
            const cy = catY + bandWidth / 2;
            const spread = bandWidth * 0.35;

            return (
              <g key={g.key} className="mds-dist-plot__strip-group">
                <line x1="0" y1={cy} x2={plot.plotWidth} y2={cy} stroke="var(--border-subtle, #e2e8f0)" strokeDasharray="2 2" />

                {g.values.map((val, idx) => {
                  const seed = (idx * 9301 + 49297) % 233280;
                  const jitter = ((seed / 233280) - 0.5) * 2 * spread;
                  const px = scales.scaleVal ? (scales.scaleVal(val) ?? 0) : 0;
                  const py = cy + jitter;

                  return (
                    <circle
                      key={`strip-pt-${idx}`}
                      cx={px}
                      cy={py}
                      r="4"
                      fill={g.color}
                      opacity="0.75"
                      stroke="var(--surface-card, #ffffff)"
                      strokeWidth="1"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        const rect = containerRef.current?.getBoundingClientRect();
                        const mouseX = e.clientX - (rect?.left || 0);
                        const mouseY = e.clientY - (rect?.top || 0);
                        setHoveredItem({
                          title: g.label,
                          subtitle: `Observation #${idx + 1}`,
                          rows: [
                            { label: 'Value', value: `${val.toFixed(3)}${unit}`, color: g.color }
                          ],
                          x: mouseX,
                          y: mouseY
                        });
                      }}
                    />
                  );
                })}
              </g>
            );
          })}

          {/* 5. Density / KDE Plot */}
          {variant === 'density' && transformedGroups.map((g) => {
            const points = g.kde.points.map(pt => ({
              x: scales.scaleVal ? (scales.scaleVal(pt.x) ?? 0) : 0,
              y: scales.scaleFreq ? (scales.scaleFreq(pt.density) ?? 0) : 0
            }));
            const baselinePoints = g.kde.points.map(pt => ({
              x: scales.scaleVal ? (scales.scaleVal(pt.x) ?? 0) : 0,
              y: plot.plotHeight
            }));

            const areaD = createAreaPath(points, baselinePoints, 'monotone');
            const lineD = createLinePath(points, 'monotone');

            return (
              <g
                key={g.key}
                className="mds-dist-plot__density-group"
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  const mouseX = e.clientX - (rect?.left || 0);
                  const mouseY = e.clientY - (rect?.top || 0);
                  setHoveredItem({
                    title: g.label,
                    subtitle: `KDE Continuous Probability Curve`,
                    rows: [
                      { label: 'Peak Density', value: (g.kde.maxDensity || 0).toFixed(4), color: g.color },
                      { label: 'Mean', value: `${(g.boxStats.mean ?? 0).toFixed(2)}${unit}` },
                      { label: 'Median', value: `${g.boxStats.median.toFixed(2)}${unit}` },
                      { label: 'Sample Count', value: `${g.values.length} records` }
                    ],
                    x: mouseX,
                    y: mouseY
                  });
                }}
              >
                <path d={areaD} fill={g.color} opacity="0.35" />
                <path d={lineD} fill="none" stroke={g.color} strokeWidth="2.5" />
              </g>
            );
          })}

          {/* Reference Lines */}
          {referenceLines.map((ref, idx) => {
            const xPos = scales.scaleVal ? (scales.scaleVal(ref.value) ?? 0) : 0;
            const labelText = ref.label
              ? ref.label.includes(String(ref.value))
                ? ref.label
                : `${ref.label} (${formatVizValue(ref.value, unit, locale)})`
              : formatVizValue(ref.value, unit, locale);

            // Calculate non-colliding staggered Y positions
            const defaultY = 14 + (idx % 2) * 16;
            const yPos = ref.yOffset != null ? ref.yOffset : (ref.position === 'bottom' ? plot.plotHeight - 8 : defaultY);

            // Text anchor calculation
            const isNearRight = xPos > plot.plotWidth - 70;
            const isNearLeft = xPos < 70;
            const textAnchor = ref.position === 'start' ? 'start' : ref.position === 'end' ? 'end' : ref.position === 'center' ? 'middle' : (isNearRight ? 'end' : isNearLeft ? 'start' : (idx % 2 === 0 ? 'start' : 'end'));
            const labelX = textAnchor === 'end' ? xPos - 5 : textAnchor === 'start' ? xPos + 5 : xPos;

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
                {labelText && (
                  <text
                    x={labelX}
                    y={yPos}
                    textAnchor={textAnchor}
                    fill={ref.color || 'var(--status-critical-solid, #ef4444)'}
                    stroke="var(--surface-card, #ffffff)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    paintOrder="stroke fill"
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="var(--font-mono, monospace)"
                    className="mds-dist-plot__ref-label"
                  >
                    {labelText}
                  </text>
                )}
              </g>
            );
          })}

          {/* X Axis */}
          <g transform={`translate(0, ${plot.plotHeight})`} className="mds-dist-plot__axis mds-dist-plot__axis--x">
            <line x1="0" y1="0" x2={plot.plotWidth} y2="0" stroke="var(--border-subtle, #cbd5e1)" />
            {scales.valTicks.map((tickVal: any, idx: number) => {
              const xPos = scales.scaleVal ? (scales.scaleVal(tickVal) ?? 0) : 0;
              return (
                <g key={`xtick-${idx}`} transform={`translate(${xPos}, 0)`}>
                  <line y2="5" stroke="var(--border-subtle, #cbd5e1)" />
                  <text y="18" textAnchor="middle" fill="var(--text-secondary, #475569)" fontSize="11" fontFamily="var(--font-mono, monospace)">
                    {formatVizValue(tickVal, unit, locale)}
                  </text>
                </g>
              );
            })}
            {valueLabel && (
              <text x={plot.plotWidth / 2} y="36" textAnchor="middle" fill="var(--text-tertiary, #64748b)" fontSize="11" fontWeight="600" className="mds-dist-plot__axis-title">
                {valueLabel} {unit ? `(${unit.trim()})` : ''}
              </text>
            )}
          </g>

          {/* Y Axis: Categorical (for box, violin, strip when categoryKey is present) */}
          {Boolean(categoryKey && (variant === 'box' || variant === 'violin' || variant === 'strip')) && (
            <g className="mds-dist-plot__axis mds-dist-plot__axis--y">
              <line x1="0" y1="0" x2="0" y2={plot.plotHeight} stroke="var(--border-subtle, #cbd5e1)" />
              {activeGroups.map((g) => {
                const catY = scales.scaleCat ? (scales.scaleCat(g.key) ?? 0) : 0;
                const bandWidth = scales.scaleCat ? scales.scaleCat.bandwidth() : 36;
                const cy = catY + bandWidth / 2;
                return (
                  <g key={`cat-tick-${g.key}`} transform={`translate(0, ${cy})`}>
                    <line x2="-5" stroke="var(--border-subtle, #cbd5e1)" />
                    <text
                      x="-9"
                      dy="0.32em"
                      textAnchor="end"
                      fill="var(--text-secondary, #475569)"
                      fontSize="11"
                      fontWeight="500"
                    >
                      {g.label}
                    </text>
                  </g>
                );
              })}
              {categoryLabel && (
                <text
                  transform="rotate(-90)"
                  x={-plot.plotHeight / 2}
                  y={-effectiveMargins.left + 16}
                  textAnchor="middle"
                  fill="var(--text-tertiary, #64748b)"
                  fontSize="11"
                  fontWeight="600"
                  className="mds-dist-plot__axis-title"
                >
                  {categoryLabel}
                </text>
              )}
            </g>
          )}

          {/* Y Axis: Quantitative Frequency / Density */}
          {(variant === 'histogram' || variant === 'density') && (
            <g className="mds-dist-plot__axis mds-dist-plot__axis--y">
              <line x1="0" y1="0" x2="0" y2={plot.plotHeight} stroke="var(--border-subtle, #cbd5e1)" />
              {scales.freqTicks.map((tickVal: any, idx: number) => {
                const yPos = scales.scaleFreq ? (scales.scaleFreq(tickVal) ?? 0) : 0;
                const formattedTick = variant === 'histogram'
                  ? Math.round(tickVal)
                  : (tickVal >= 1 ? tickVal.toFixed(1) : tickVal.toFixed(3));
                return (
                  <g key={`ytick-${idx}`} transform={`translate(0, ${yPos})`}>
                    <line x2="-5" stroke="var(--border-subtle, #cbd5e1)" />
                    <text
                      x="-9"
                      dy="0.32em"
                      textAnchor="end"
                      fill="var(--text-secondary, #475569)"
                      fontSize="10"
                      fontFamily="var(--font-mono, monospace)"
                    >
                      {formattedTick}
                    </text>
                  </g>
                );
              })}
              <text
                transform="rotate(-90)"
                x={-plot.plotHeight / 2}
                y={-effectiveMargins.left + 16}
                textAnchor="middle"
                fill="var(--text-tertiary, #64748b)"
                fontSize="11"
                fontWeight="600"
                className="mds-dist-plot__axis-title"
              >
                {variant === 'histogram' ? 'Frequency (Count)' : 'Relative Density (KDE)'}
              </text>
            </g>
          )}

        </g>
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredItem && (
        <div
          className="mds-dist-plot__tooltip"
          style={{
            position: 'absolute',
            left: `${Math.min(plotWidth - 200, Math.max(10, hoveredItem.x + 12))}px`,
            top: `${Math.max(10, hoveredItem.y - 10)}px`,
            pointerEvents: 'none',
            zIndex: 50,
            background: 'var(--surface-card, #ffffff)',
            border: '1px solid var(--border-subtle, #cbd5e1)',
            borderRadius: '6px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            padding: '8px 12px',
            fontSize: '11px',
            lineHeight: 1.4,
            minWidth: '160px'
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--text-primary, #0f172a)', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px', marginBottom: '4px' }}>
            {hoveredItem.title}
          </div>
          {hoveredItem.subtitle && (
            <div style={{ fontSize: '10px', color: 'var(--text-tertiary, #64748b)', marginBottom: '6px' }}>
              {hoveredItem.subtitle}
            </div>
          )}
          {hoveredItem.rows.map((r, rIdx) => (
            <div key={`tip-row-${rIdx}`} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', marginBottom: '2px', color: 'var(--text-secondary, #475569)' }}>
              <span>{r.label}:</span>
              <span style={{ fontWeight: 600, color: r.color || 'var(--text-primary, #0f172a)', fontFamily: 'var(--font-mono, monospace)' }}>{r.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="mds-dist-plot__sr-only" aria-live="polite">
        {activeGroup
          ? `Distribution ${activeGroup.label}: Count ${activeGroup.boxStats.count}, Median ${activeGroup.boxStats.median.toFixed(2)} ${unit}, IQR ${activeGroup.boxStats.iqr.toFixed(2)}, Min ${activeGroup.boxStats.min.toFixed(2)}, Max ${activeGroup.boxStats.max.toFixed(2)}.`
          : ''}
      </div>

      {/* Accessible Statistical Summary Table Mirror */}
      {showDataTable && transformedGroups && transformedGroups.length > 0 && (
        <details
          className="ds-chart-table-details"
          style={{
            marginTop: 12,
            borderTop: '1px solid var(--border-subtle, #e2e8f0)',
            paddingTop: 8,
            fontSize: 'var(--text-xs, 12px)',
            color: 'var(--text-secondary, #64748b)'
          }}
        >
          <summary
            className="ds-chart-table-summary"
            style={{
              cursor: 'pointer',
              padding: '4px 8px',
              fontWeight: 500,
              userSelect: 'none'
            }}
          >
            View Accessible Distribution Summary Table
          </summary>
          <div role="region" aria-label="Distribution summary table" tabIndex={0} style={{ overflowX: 'auto', marginTop: 8 }}>
            <table
              className="ds-chart-table"
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: 'var(--text-xs, 12px)'
              }}
            >
              <caption style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>
                {title ? `${title} Distribution Statistics` : 'Distribution Summary Table'}
              </caption>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-default, #cbd5e1)' }}>
                  <th scope="col" style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>Category / Cohort</th>
                  <th scope="col" style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>Sample Count</th>
                  <th scope="col" style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>Min</th>
                  <th scope="col" style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>Q1 (25%)</th>
                  <th scope="col" style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>Median (50%)</th>
                  <th scope="col" style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>Q3 (75%)</th>
                  <th scope="col" style={{ padding: '6px 8px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>Max</th>
                </tr>
              </thead>
              <tbody>
                {transformedGroups.map((g, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle, #f1f5f9)' }}>
                    <th scope="row" style={{ padding: '6px 8px', fontWeight: 500, color: 'var(--text-primary, #0f172a)' }}>
                      {g.label}
                    </th>
                    <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-secondary, #475569)' }}>
                      {g.boxStats.count}
                    </td>
                    <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-secondary, #475569)' }}>
                      {formatVizValue(g.boxStats.min, unit, locale)}
                    </td>
                    <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-secondary, #475569)' }}>
                      {formatVizValue(g.boxStats.q1, unit, locale)}
                    </td>
                    <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                      {formatVizValue(g.boxStats.median, unit, locale)}
                    </td>
                    <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-secondary, #475569)' }}>
                      {formatVizValue(g.boxStats.q3, unit, locale)}
                    </td>
                    <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-secondary, #475569)' }}>
                      {formatVizValue(g.boxStats.max, unit, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
    </>
  );
};
