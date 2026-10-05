import React, { forwardRef, createContext, useContext } from 'react';
import './Table.css';

export type TableDensity = 'compact' | 'standard' | 'relaxed';
export type TableCellAlign = 'left' | 'center' | 'right';
export type TableSortDirection = 'asc' | 'desc' | 'none';

interface TableContextValue {
  density: TableDensity;
}

const TableContext = createContext<TableContextValue>({ density: 'standard' });

const _useTableContext = () => useContext(TableContext);

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  density?: TableDensity;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  wrapperClassName?: string;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  (
    {
      density = 'standard',
      striped = false,
      hoverable = true,
      bordered = true,
      children,
      className = '',
      wrapperClassName = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'ds-table',
      `ds-table--density-${density}`,
      striped ? 'ds-table--striped' : '',
      hoverable ? 'ds-table--hoverable' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <TableContext.Provider value={{ density }}>
        <div
          className={`ds-table-container ${
            bordered ? 'ds-table-container--bordered' : ''
          } ${wrapperClassName}`}
        >
          <table ref={ref} className={classNames} {...props}>
            {children}
          </table>
        </div>
      </TableContext.Provider>
    );
  }
);
Table.displayName = 'Table';

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ children, className = '', ...props }, ref) => (
  <thead ref={ref} className={`ds-table-header ${className}`} {...props}>
    {children}
  </thead>
));
TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ children, className = '', ...props }, ref) => (
  <tbody ref={ref} className={`ds-table-body ${className}`} {...props}>
    {children}
  </tbody>
));
TableBody.displayName = 'TableBody';

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ children, className = '', ...props }, ref) => (
  <tfoot ref={ref} className={`ds-table-footer ${className}`} {...props}>
    {children}
  </tfoot>
));
TableFooter.displayName = 'TableFooter';

export const TableRow = forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ children, className = '', ...props }, ref) => (
  <tr ref={ref} className={`ds-table-row ${className}`} {...props}>
    {children}
  </tr>
));
TableRow.displayName = 'TableRow';

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: TableCellAlign;
  sortable?: boolean;
  sortDirection?: TableSortDirection;
  onSort?: () => void;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      align = 'left',
      sortable = false,
      sortDirection = 'none',
      onSort,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const ariaSort =
      sortDirection === 'asc'
        ? 'ascending'
        : sortDirection === 'desc'
        ? 'descending'
        : undefined;

    const handleClick = () => {
      if (sortable && onSort) {
        onSort();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (sortable && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onSort?.();
      }
    };

    return (
      <th
        ref={ref}
        scope="col"
        aria-sort={ariaSort}
        tabIndex={sortable ? 0 : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`ds-table-head ds-table-head--${align} ${
          sortable ? 'ds-table-head--sortable' : ''
        } ${className}`}
        {...props}
      >
        <div className="ds-table-head-inner">
          {children}
          {sortable && (
            <span
              className={`ds-table-sort-icon ${
                sortDirection !== 'none' ? 'ds-table-sort-icon--active' : ''
              }`}
              aria-hidden="true"
            >
              {sortDirection === 'asc'
                ? '▲'
                : sortDirection === 'desc'
                ? '▼'
                : '▲▼'}
            </span>
          )}
        </div>
      </th>
    );
  }
);
TableHead.displayName = 'TableHead';

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: TableCellAlign;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ align = 'left', children, className = '', ...props }, ref) => (
    <td
      ref={ref}
      className={`ds-table-cell ds-table-cell--${align} ${className}`}
      {...props}
    >
      {children}
    </td>
  )
);
TableCell.displayName = 'TableCell';

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ children, className = '', ...props }, ref) => (
  <caption ref={ref} className={`ds-table-caption ${className}`} {...props}>
    {children}
  </caption>
));
TableCaption.displayName = 'TableCaption';
