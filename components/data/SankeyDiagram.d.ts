import React from 'react';

export interface SankeyNode {
  id: string;
  label: string;
  category?: string;
  [key: string]: any;
}

export interface SankeyLink {
  id?: string;
  source: string | SankeyNode;
  target: string | SankeyNode;
  value: number;
  category?: string;
  [key: string]: any;
}

export interface SankeyDiagramProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  width?: number;
  height?: number;
  nodeWidth?: number;
  nodePadding?: number;
  align?: 'justify' | 'left' | 'right' | 'center';
  colorScale?: string[];
  linkGradient?: boolean;
  patternFills?: boolean;
  unit?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
  selectedId?: string | null;
  onNodeClick?: (node: any) => void;
  onLinkClick?: (link: any) => void;
  onSelectionChange?: (selection: any) => void;
  className?: string;
}

export declare const SankeyDiagram: React.FC<SankeyDiagramProps>;
export default SankeyDiagram;
