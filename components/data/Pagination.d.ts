import * as React from 'react';

/**
 * Page controls for a table or list, with the count that makes them legible.
 */
export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** 1-based current page. */
  page: number;
  /** Total pages. Give this or totalItems — never a guess. */
  pageCount?: number;
  /** Total rows; pageCount is derived from it with pageSize. Also drives the "1–25 of 1,204" summary. */
  totalItems?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  /** Renders a per-page Select when provided, e.g. [25, 50, 100]. */
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  /** numbered = known, cheap count. compact = "3 / 48" for narrow rows. cursor = no total exists. */
  variant?: 'numbered' | 'compact' | 'cursor';
  /** sm = 24px cells (dense tables). md = 28px, default. */
  size?: 'sm' | 'md';
  /** Page numbers either side of the current one. 1 = 7 cells wide. */
  siblingCount?: number;
  /** Cursor variant only — the arrows' enabled state comes from the API, not arithmetic. */
  hasNext?: boolean;
  hasPrev?: boolean;
  /** Plural noun for the summary and the per-page label. */
  itemLabel?: string;
  showSummary?: boolean;
  /** Accessible name of the nav landmark. */
  label?: string;
  style?: React.CSSProperties;
}
export declare function Pagination(props: PaginationProps): JSX.Element;
