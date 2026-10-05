import * as React from 'react';

/**
 * Pagination Navigation — Collection Page Navigation System.
 * @startingPoint section="Navigation" subtitle="Collection page navigation controls" viewport="800x200"
 */
export interface PaginationNavigationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** Current 1-based active page index. */
  page: number;
  /** Total count of records in the collection. */
  totalItems: number;
  /** Number of items displayed per page (default: 25). */
  pageSize?: number;
  /** Callback fired when page index changes. */
  onPageChange: (page: number) => void;
  /** Optional callback fired when page size is changed. */
  onPageSizeChange?: (pageSize: number) => void;
  /** Number of sibling page buttons visible on each side of the active page (default: 1). */
  siblingCount?: number;
  /** Number of boundary page buttons visible at start and end of range (default: 1). */
  boundaryCount?: number;
  /** Presentation variant: standard (full numbered range), compact (stepped text), minimal (icon stepper). */
  variant?: 'standard' | 'compact' | 'minimal';
  /** Accessible landmark label. Defaults to "Pagination Navigation". */
  label?: string;
  /** Collection entity noun displayed in summary count (e.g. "work orders", "parts"). */
  itemNoun?: string;
  style?: React.CSSProperties;
}

export declare function PaginationNavigation(props: PaginationNavigationProps): JSX.Element;
