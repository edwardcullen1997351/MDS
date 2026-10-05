import * as React from 'react';

export type HeatmapVariant = 'matrix' | 'clustered' | 'calendar' | 'correlation';
export type HeatmapColorScaleType = 'sequential' | 'diverging';
export type HeatmapDensity = 'compact' | 'standard' | 'expanded';

export interface HeatmapProps {
  data: Array<Record<string, any>>;
  rows?: string[];
  cols?: string[];
  rowKey?: string;
  colKey?: string;
  valueKey?: string;
  variant?: HeatmapVariant;
  colorScaleType?: HeatmapColorScaleType;
  colorRange?: string[];
  domain?: [number, number] | null;
  neutralValue?: number;
  cellPadding?: number;
  cellRadius?: number;
  showCellValues?: boolean;
  width?: number;
  height?: number;
  margins?: { top: number; right: number; bottom: number; left: number };
  unit?: string;
  rowLabel?: string;
  colLabel?: string;
  valueLabel?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
  missingCellLabel?: string;
  showLegend?: boolean;
  density?: HeatmapDensity;
  emptyMessage?: string;
  loading?: boolean;
  onCellSelect?: (datum: Record<string, any>, coords: { rIdx: number; cIdx: number }) => void;
  className?: string;
  style?: React.CSSProperties;
}

export declare const Heatmap: React.FC<HeatmapProps>;
