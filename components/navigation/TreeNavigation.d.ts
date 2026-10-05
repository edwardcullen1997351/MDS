import * as React from 'react';

export interface TreeNode {
  /** Unique node or asset identifier. */
  id: string;
  /** Node label (noun, max 28 characters). */
  label: string;
  /** Destination route URL. */
  href?: string;
  /** Optional Lucide icon name. */
  icon?: string;
  /** Numeric count or string status badge. */
  badge?: string | number;
  /** Inactive or restricted access. */
  disabled?: boolean;
  /** Tooltip explanation for permission restrictions. */
  disabledReason?: string;
  /** Recursive child nodes array. */
  children?: TreeNode[];
}

/**
 * Tree Navigation — Recursive Hierarchy Navigation System.
 * @startingPoint section="Navigation" subtitle="Recursive asset and hierarchy tree" viewport="800x600"
 */
export interface TreeNavigationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** Recursive hierarchy root nodes data array. */
  data: TreeNode[];
  /** Currently active/selected node identifier. */
  activeId: string;
  /** Controlled array of expanded branch IDs. */
  expandedIds?: string[];
  /** Callback fired when branch expansion changes. */
  onExpandedChange?: (expandedIds: string[]) => void;
  /** Navigation callback fired when a node is selected. */
  onSelectNode?: (node: TreeNode, event: React.MouseEvent) => void;
  /** Automatically expand ancestor path leading to activeId on mount/update (default: true). */
  autoExpandActive?: boolean;
  /** Density scale: compact (28px), comfortable (34px, default), expanded (42px). */
  density?: 'compact' | 'comfortable' | 'expanded';
  /** Accessible name for the <nav> and role="tree" landmarks. Defaults to "Hierarchy Tree". */
  label?: string;
  /** Custom router link component adapter. */
  LinkComponent?: React.ComponentType<any>;
  /** Optional custom header slot. */
  headerSlot?: React.ReactNode;
  /** Optional custom footer slot. */
  footerSlot?: React.ReactNode;
  style?: React.CSSProperties;
}

export declare function TreeNavigation(props: TreeNavigationProps): JSX.Element;
