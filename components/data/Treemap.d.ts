import React from 'react';

export interface TreemapNode {
  id?: string;
  label: string;
  value?: number;
  category?: string;
  children?: TreemapNode[];
  [key: string]: any;
}

export interface TreemapProps {
  data: TreemapNode | TreemapNode[];
  valueKey?: string;
  labelKey?: string;
  categoryKey?: string;
  childrenKey?: string;
  width?: number;
  height?: number;
  algorithm?: 'squarified' | 'slice-and-dice';
  maxDepth?: number;
  colorScale?: string[];
  patternFills?: boolean;
  unit?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
  enableDrilldown?: boolean;
  selectedId?: string | null;
  onNodeClick?: (node: any) => void;
  onNodeSelect?: (node: any) => void;
  onDrill?: (node: any, stack: string[]) => void;
  className?: string;
}

export declare const Treemap: React.FC<TreemapProps>;
export default Treemap;
