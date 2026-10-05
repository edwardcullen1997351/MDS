import * as React from 'react';

export type ParallelCoordinatesVariant = 'standard' | 'normalized' | 'spline' | 'brushed';

export interface ParallelDimension {
  key: string;
  label: string;
  unit?: string;
  min?: number;
  max?: number;
  inverted?: boolean;
  isCategorical?: boolean;
  categories?: string[];
}

export interface ParallelCoordinatesProps {
  data: Record<string, any>[];
  dimensions: ParallelDimension[];
  variant?: ParallelCoordinatesVariant;
  width?: number;
  height?: number;
  title?: string;
  subtitle?: string;
  colorKey?: string;
  idKey?: string;
  labelKey?: string;
  smooth?: boolean;
  normalized?: boolean;
  showBrushControls?: boolean;
  showControls?: boolean;
  showSearch?: boolean;
  className?: string;
  onRecordClick?: (record: Record<string, any>, event: React.MouseEvent) => void;
  renderTooltip?: (record: Record<string, any>) => React.ReactNode;
  ariaLabel?: string;
}

export declare const ParallelCoordinates: React.FC<ParallelCoordinatesProps>;
export default ParallelCoordinates;
