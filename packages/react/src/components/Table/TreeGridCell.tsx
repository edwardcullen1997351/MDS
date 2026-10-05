import React, { forwardRef } from 'react';
import './Table.css';

export interface TreeGridCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'onToggle'> {
  /** Hierarchical tier level (0 to 5) */
  level?: number;
  /** Whether the row node is expanded */
  expanded?: boolean;
  /** Whether the row node has child rows */
  hasChildren?: boolean;
  /** Callback fired when expand/collapse toggle is activated */
  onToggle?: (expanded: boolean) => void;
  /** Accessible label for the expand/collapse button */
  toggleLabel?: string;
  /** Optional custom class name */
  className?: string;
}

/**
 * TreeGridCell (§01–§14)
 * High-density hierarchical table cell for bill-of-materials pegging and tree grids.
 * Implements accessible indentation, tier indicators, and keyboard expand/collapse controls
 * complying with WAI-ARIA TreeGrid specifications.
 */
export const TreeGridCell = forwardRef<HTMLTableCellElement, TreeGridCellProps>(
  (
    {
      level = 0,
      expanded = false,
      hasChildren = false,
      onToggle,
      toggleLabel,
      children,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const handleToggleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggle?.(!expanded);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!hasChildren) return;
      if (e.key === 'ArrowRight' && !expanded) {
        e.preventDefault();
        onToggle?.(true);
      } else if (e.key === 'ArrowLeft' && expanded) {
        e.preventDefault();
        onToggle?.(false);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle?.(!expanded);
      }
    };

    const cellStyle: React.CSSProperties = {
      ...style,
      '--ds-indent-level': level,
    } as React.CSSProperties;

    const accessibleToggleLabel =
      toggleLabel ||
      (expanded ? `Collapse level ${level + 1} branch` : `Expand level ${level + 1} branch`);

    return (
      <td
        ref={ref}
        className={`ds-table-cell ${className}`}
        {...props}
      >
        <div className="ds-tree-grid-cell" style={cellStyle}>
          {hasChildren ? (
            <button
              type="button"
              className={`ds-tree-grid-cell__toggle ${
                expanded ? 'ds-tree-grid-cell__toggle--expanded' : ''
              }`}
              onClick={handleToggleClick}
              onKeyDown={handleKeyDown}
              aria-label={accessibleToggleLabel}
              aria-expanded={expanded}
              tabIndex={0}
            >
              ▶
            </button>
          ) : (
            <span className="ds-tree-grid-cell__toggle-spacer" aria-hidden="true" />
          )}

          <div className="ds-tree-grid-cell__content">{children}</div>
        </div>
      </td>
    );
  }
);

TreeGridCell.displayName = 'TreeGridCell';
