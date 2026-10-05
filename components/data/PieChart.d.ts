import * as React from 'react';

export type PieChartVariant = 'pie' | 'donut';
export type PieDensity = 'compact' | 'standard' | 'expanded';

export interface PieChartProps {
  data: Array<Record<string, any>>;
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

export declare const PieChart: React.FC<PieChartProps>;
