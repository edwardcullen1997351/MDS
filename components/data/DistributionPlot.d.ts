import * as React from 'react';

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
}

export interface DistributionToleranceBand {
  min: number;
  max: number;
  label?: string;
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
  width?: number;
  height?: number;
  margins?: { top: number; right: number; bottom: number; left: number };
  unit?: string;
  valueLabel?: string;
  categoryLabel?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
  referenceLines?: DistributionReferenceLine[];
  toleranceBands?: DistributionToleranceBand[];
  showGrid?: boolean;
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

export declare const DistributionPlot: React.FC<DistributionPlotProps>;
