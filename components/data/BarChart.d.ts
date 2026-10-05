import * as React from 'react';

export type BarChartVariant =
  | 'vertical'
  | 'horizontal'
  | 'grouped'
  | 'stacked'
  | 'normalized'
  | 'diverging'
  | 'floating';

export interface BarSeriesConfig {
  key: string;
  label: string;
  color?: string;
}

export interface ReferenceLineConfig {
  value: number;
  label?: string;
  tone?: 'neutral' | 'danger' | 'warning' | 'success' | 'brand';
  strokeStyle?: 'dashed' | 'solid';
}

export interface ThresholdBandConfig {
  min: number;
  max: number;
  label?: string;
  tone?: 'critical' | 'warning' | 'neutral';
}

export interface BarChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onSelect'> {
  /** Array of data records. */
  data: any[];
  /** Object property representing the discrete categorical dimension. Default 'label'. */
  categoryKey?: string;
  /** Object property representing the primary quantitative measure. Default 'value'. */
  valueKey?: string;
  /** Multi-series definitions for grouped or stacked comparisons. */
  series?: (string | BarSeriesConfig)[];
  /** Visual variant of the bar chart. Default 'vertical'. */
  variant?: BarChartVariant;
  /** Explicit layout orientation. Inferred from variant if omitted. */
  orientation?: 'vertical' | 'horizontal';
  /** Accessible title displayed in header and used for accessible naming. */
  title?: string;
  /** Subtitle or contextual note rendered under title. */
  caption?: string;
  /** Extended summary populated in the SVG `<desc>` tag for assistive technologies. */
  description?: string;
  /** Unit of measurement (e.g. '₹', '%', 'ppm', 'mm/s', 'units'). Formatted via `en-IN`. */
  unit?: string;
  /** Custom formatter function for numeric data values. */
  valueFormatter?: (val: number, item?: any) => string;
  /** Horizontal or vertical reference benchmark lines. */
  referenceLines?: ReferenceLineConfig[];
  /** Shaded threshold bands indicating tolerance or control limit zones. */
  thresholdBands?: ThresholdBandConfig[];
  /** Zero-baseline floor. Enforced to preserve proportional visual integrity. Default 0. */
  baseline?: number;
  /** Custom quantitative domain bounds `[min, max]`. Calculated from data if omitted. */
  domain?: [number, number];
  /** Currently selected category identifier. */
  selectedKey?: string | number | null;
  /** Callback fired when a bar or category is selected. */
  onSelect?: (item: any, seriesKey?: string) => void;
  /** Show quantitative gridlines and baseline. Default true. */
  showGrid?: boolean;
  /** Render data value labels directly on or adjacent to bars. Default false. */
  showValues?: boolean;
  /** Render interactive series legend for multi-series charts. Default true. */
  showLegend?: boolean;
  /** Display floating interactive hover/focus tooltip card. Default true. */
  showTooltip?: boolean;
  /** Display toggle button to switch between visual chart and accessible data table. Default true. */
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
 * BarChart — compares quantitative magnitude across discrete categories.
 * Strict zero-baseline proportional truth, multi-channel accessibility,
 * keyboard roving tabindex traversal, WAI-ARIA graphics semantics, and tabular fallback.
 */
export declare const BarChart: React.FC<BarChartProps>;
