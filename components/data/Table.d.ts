import * as React from 'react';

export interface TableColumn {
  /** Row object key, also the React key and sort key. */
  key: string;
  /** Header label — rendered uppercase with caps tracking. */
  header: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  /** Any CSS width, e.g. "160px" or "20%". */
  width?: string;
  /** Render the cell in IBM Plex Mono — IDs, versions, hashes. */
  mono?: boolean;
  /** Enables the sort affordance — a real button in the header. */
  sortable?: boolean;
  /** Let this column wrap instead of truncating. Costs the fixed row height. */
  wrap?: boolean;
  /** Custom cell renderer; return a Badge, Tag, button row, etc. */
  render?: (row: any, index: number) => React.ReactNode;
}

export interface TableSort { key: string; direction: 'asc' | 'desc' }

/**
 * Dense data table — 44px rows, hairline row rules, uppercase header.
 * Geometry rides `[data-density]`.
 * @startingPoint section="Data" subtitle="Sortable, selectable dense data table" viewport="700x300"
 */
export interface TableProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  columns: TableColumn[];
  rows: any[];
  /** How a row identifies itself. Key name or a function. Default 'id'. */
  rowKey?: string | ((row: any, index: number) => string | number);
  /** The table's accessible name. Visually hidden; required in practice (warns without it). */
  caption?: React.ReactNode;
  /** Adds the leading checkbox column and select-all header. */
  selectable?: boolean;
  /**
   * Identities of selected rows — NOT indices. Index-based selection
   * reassigns itself when the table is sorted or paged.
   */
  selectedKeys?: (string | number)[];
  onSelectionChange?: (keys: (string | number)[]) => void;
  /** Names each row's checkbox after the record: `row => row.wo`. */
  rowLabel?: (row: any, index: number) => string;
  sort?: TableSort;
  onSortChange?: (sort: TableSort) => void;
  /** Whole-row target. Also put a real link on the primary column. */
  onRowClick?: (row: any, index: number) => void;
  /** Skeleton rows at full geometry; sets aria-busy on the region. */
  loading?: boolean;
  loadingRows?: number;
  /** Pins the header while the body scrolls. */
  stickyHeader?: boolean;
  /**
   * Pins the leading block — the selection column and the first data column
   * together — while the rest scrolls. They are one unit: both answer
   * "which record is this". Requires `minWidth` (warns without it).
   */
  freezeLeading?: boolean;
  /** Floor for the table itself. **This is what makes horizontal scroll possible** — without it, truncating cells shrink to fit and the table never overflows. */
  minWidth?: string;
  /** Shown in place of rows when `rows` is empty. */
  emptyMessage?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Table(props: TableProps): JSX.Element;
