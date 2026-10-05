import * as React from 'react';

export type ScatterPlotVariant = 'scatter' | 'bubble' | 'connected' | 'jittered' | 'binned-density';
export type ScatterScaleType = 'linear' | 'log' | 'band';
export type ScatterDensity = 'compact' | 'standard' | 'expanded';

export interface ScatterSeriesDef {
  key: string;
  label?: string;
  color?: string;
  symbol?: 'circle' | 'square' | 'diamond' | 'triangle' | 'cross' | 'star';
}

export interface ScatterReferenceLine {
  x?: number;
  y?: number;
  label?: string;
  color?: string;
}

export interface ScatterQuadrantLines {
  x?: number;
  y?: number;
  labels?: [string, string, string, string];
}

export interface ScatterPlotProps {
  data: Array<Record<string, any>>;
  xKey?: string;
  yKey?: string;
  sizeKey?: string | null;
  categoryKey?: string | null;
  series?: ScatterSeriesDef[];
  variant?: ScatterPlotVariant;
  width?: number;
  height?: number;
  margins?: { top: number; right: number; bottom: number; left: number };
  xScaleType?: ScatterScaleType;
  yScaleType?: ScatterScaleType;
  xUnit?: string;
  yUnit?: string;
  sizeUnit?: string;
  xLabel?: string;
  yLabel?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
  minRadius?: number;
  maxRadius?: number;
  pointOpacity?: number;
  showTrendline?: boolean;
  quadrantLines?: ScatterQuadrantLines | null;
  referenceLines?: ScatterReferenceLine[];
  showGridX?: boolean;
  showGridY?: boolean;
  jitterAmount?: number;
  binSize?: number;
  densityColorRange?: [string, string];
  densityThreshold?: number;
  density?: ScatterDensity;
  emptyMessage?: string;
  loading?: boolean;
  onPointSelect?: (datum: Record<string, any>, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export declare const ScatterPlot: React.FC<ScatterPlotProps>;
