import * as React from 'react';

export type LineChartVariant =
  | 'single'
  | 'multi'
  | 'stepped'
  | 'indexed'
  | 'small-multiples';

export type LineInterpolation =
  | 'linear'
  | 'step'
  | 'step-after'
  | 'monotone'
  | 'smooth';

export type MissingValuePolicy = 'dashed' | 'gap' | 'zero';

export interface LineSeriesConfig {
  key: string;
  label: string;
  color?: string;
  strokeDash?: string;
  symbol?: 'circle' | 'square' | 'diamond' | 'triangle' | 'cross';
}

export interface LineReferenceConfig {
  value: number;
  label?: string;
  tone?: 'neutral' | 'danger' | 'warning' | 'success' | 'brand';
  strokeStyle?: 'dashed' | 'solid';
}

export interface LineThresholdBandConfig {
  min: number;
  max: number;
  label?: string;
  tone?: 'critical' | 'warning' | 'neutral';
}

export interface LineChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onSelect'> {
  /** Array of ordered sequential data records. */
  data: any[];
  /** Object property representing the ordered/temporal X-axis dimension. Default 'timestamp'. */
  xKey?: string;
  /** Object property representing the quantitative Y-axis measure. Default 'value'. */
  yKey?: string;
  /** Multi-series definitions with colors, dashes, and symbols for differentiation. */
  series?: (string | LineSeriesConfig)[];
  /** Visual variant of the trajectory line chart. Default 'single'. */
  variant?: LineChartVariant;
  /** Curve interpolation algorithm. Default 'linear'. */
  interpolation?: LineInterpolation;
  /** Comparison mode: 'absolute' values or 'indexed' percentage change from t0 baseline. Default 'absolute'. */
  compareMode?: 'absolute' | 'indexed';
  /** Point mark display behavior: 'always', 'hover', 'never', or 'endpoints'. Default 'hover'. */
  pointVisibility?: 'always' | 'hover' | 'never' | 'endpoints';
  /** Policy for handling missing/null telemetry: 'dashed' line, 'gap' break, or 'zero'. Default 'dashed'. */
  missingValuePolicy?: MissingValuePolicy;
  /** Accessible chart title displayed in header and landmark announcements. */
  title?: string;
  /** Subtitle or contextual note rendered under title. */
  caption?: string;
  /** Extended summary populated in the SVG `<desc>` tag for assistive technologies. */
  description?: string;
  /** Unit of measurement (e.g. 'mm/s', '°C', 'ppm', '₹', '%', 'RPM'). Formatted via `en-IN`. */
  unit?: string;
  /** Custom formatter function for numeric data values. */
  valueFormatter?: (val: number, item?: any) => string;
  /** Benchmark or ceiling target reference lines. */
  referenceLines?: LineReferenceConfig[];
  /** Shaded tolerance bands indicating control limit zones (e.g. UCL/LCL). */
  thresholdBands?: LineThresholdBandConfig[];
  /** Custom quantitative Y-axis domain bounds `[min, max]`. Calculated from data if omitted. */
  domain?: [number, number];
  /** Currently selected timestamp or record key. */
  selectedKey?: string | number | null;
  /** Callback fired when a data point or time slice is selected. */
  onSelect?: (item: any, seriesKey?: string) => void;
  /** Show quantitative gridlines and baseline. Default true. */
  showGrid?: boolean;
  /** Show vertical crosshair tracking line on hover/focus. Default true. */
  showCrosshair?: boolean;
  /** Render interactive series legend for multi-series charts. Default true. */
  showLegend?: boolean;
  /** Display floating interactive hover/focus tooltip card. Default true. */
  showTooltip?: boolean;
  /** Display toggle button to switch between visual chart and accessible data table (Alt+F11). Default true. */
  showTableToggle?: boolean;
  /** Skeleton shimmer loading state. Sets `aria-busy="true"`. */
  loading?: boolean;
  /** Message displayed when `data` is empty or missing. */
  emptyText?: string;
  /** Chart rendering height in pixels or CSS value. Default 280. */
  height?: number | string;
  /** Chart rendering width in pixels or CSS value. Default '100%'. */
  width?: number | string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * LineChart — shows change, trajectory, trend, and rate across an ordered (temporal) domain.
 * Interpolation math, multi-channel dash/glyph differentiation, explicit missing-data policies,
 * crosshair tracking, keyboard roving tabindex, and accessible tabular fallback.
 */
export declare const LineChart: React.FC<LineChartProps>;
