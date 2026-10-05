import * as React from 'react';

export type AreaChartVariant = 'single' | 'stacked' | 'normalized' | 'diverging' | 'stream';
export type AreaCurveType = 'linear' | 'monotone' | 'step-after';
export type AreaScaleType = 'time' | 'linear' | 'band';
export type AreaDensity = 'compact' | 'standard' | 'expanded';

export interface AreaSeriesDef {
  key: string;
  label?: string;
  color?: string;
  pattern?: string;
  strokeWidth?: number;
}

export interface AreaReferenceLine {
  y: number;
  label?: string;
  color?: string;
}

export interface AreaThresholdBand {
  yMin?: number;
  yMax?: number;
  y1?: number;
  y2?: number;
  label?: string;
  color?: string;
}

export interface AreaChartProps {
  data: Array<Record<string, any>>;
  series?: AreaSeriesDef[];
  xKey?: string;
  yKey?: string;
  variant?: AreaChartVariant;
  curve?: AreaCurveType;
  baseline?: number;
  width?: number;
  height?: number;
  margins?: { top: number; right: number; bottom: number; left: number };
  xScaleType?: AreaScaleType;
  xUnit?: string;
  yUnit?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
  referenceLines?: AreaReferenceLine[];
  thresholdBands?: AreaThresholdBand[];
  showGridX?: boolean;
  showGridY?: boolean;
  showPoints?: boolean;
  enableCrosshair?: boolean;
  enablePatterns?: boolean;
  patternPresets?: string[];
  density?: AreaDensity;
  emptyMessage?: string;
  loading?: boolean;
  onPointSelect?: (datum: Record<string, any>, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export declare const AreaChart: React.FC<AreaChartProps>;
