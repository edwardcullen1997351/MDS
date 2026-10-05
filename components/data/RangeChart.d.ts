import * as React from 'react';

export type RangeChartVariant = 'interval-bar' | 'dumbbell' | 'error-bar' | 'range-area';
export type RangeChartOrientation = 'horizontal' | 'vertical';
export type IntervalSemantics = 'min-max' | 'ci-95' | 'tolerance-band' | 'before-after' | 'target-actual' | 'custom';

export interface RangeDataItem {
  id?: string;
  label?: string;
  lower: number;
  upper: number;
  center?: number;
  target?: number;
  status?: 'nominal' | 'warning' | 'critical' | 'info' | 'neutral';
  intervalSemantics?: IntervalSemantics | string;
  isImproved?: boolean; // For dumbbell before/after
  dashed?: boolean;
  metadata?: Record<string, any>;
}

export interface RangeChartProps {
  data: RangeDataItem[];
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
  targetLine?: number | { value: number; label?: string };
  showCenterEstimate?: boolean;
  showDirectLabels?: boolean;
  showControls?: boolean;
  showSearch?: boolean;
  interactive?: boolean;
  className?: string;
  onItemClick?: (item: RangeDataItem, event: React.MouseEvent) => void;
  renderTooltip?: (item: RangeDataItem) => React.ReactNode;
  ariaLabel?: string;
}

export declare const RangeChart: React.FC<RangeChartProps>;
export default RangeChart;
