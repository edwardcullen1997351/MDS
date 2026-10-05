import React from 'react';

export interface TreeNode {
  id: string;
  label: string;
  category?: string;
  status?: 'operational' | 'maintenance' | 'alarm' | 'idle' | string;
  code?: string;
  role?: string;
  value?: number;
  children?: TreeNode[];
  [key: string]: any;
}

export interface TreeDiagramProps {
  data: TreeNode;
  orientation?: 'horizontal' | 'vertical';
  linkStyle?: 'smooth' | 'step' | 'straight';
  nodeWidth?: number;
  nodeHeight?: number;
  levelSpacing?: number;
  siblingSpacing?: number;
  width?: number;
  height?: number;
  collapsible?: boolean;
  initialCollapsedIds?: string[];
  selectedId?: string | null;
  onNodeClick?: (node: any) => void;
  onNodeSelect?: (node: any) => void;
  onNodeToggle?: (node: any) => void;
  title?: string;
  subtitle?: string;
  zoomable?: boolean;
  className?: string;
}

export declare const TreeDiagram: React.FC<TreeDiagramProps>;
export default TreeDiagram;
