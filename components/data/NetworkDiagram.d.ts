import React from 'react';

export interface NetworkNode {
  id: string;
  label: string;
  category?: string;
  size?: number;
  radius?: number;
  value?: number;
  degree?: number;
  role?: string;
  status?: string;
  [key: string]: any;
}

export interface NetworkLink {
  id?: string;
  source: string | NetworkNode;
  target: string | NetworkNode;
  weight?: number;
  value?: number;
  directed?: boolean;
  label?: string;
  category?: string;
  [key: string]: any;
}

export interface NetworkDiagramProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  width?: number;
  height?: number;
  layout?: 'force' | 'circular';
  directed?: boolean;
  colorScale?: string[];
  title?: string;
  subtitle?: string;
  searchable?: boolean;
  zoomable?: boolean;
  draggableNodes?: boolean;
  initialSpread?: number;
  minSpread?: number;
  maxSpread?: number;
  selectedId?: string | null;
  onNodeClick?: (node: any) => void;
  onLinkClick?: (link: any) => void;
  onSelectionChange?: (selection: any) => void;
  className?: string;
}

export declare const NetworkDiagram: React.FC<NetworkDiagramProps>;
export default NetworkDiagram;
