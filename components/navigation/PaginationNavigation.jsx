import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * Pagination Navigation — Collection Page Navigation System.
 * Moves among discrete pages within a larger ordered collection while maintaining context.
 */

// Helper to calculate pagination range with ellipsis
function usePaginationRange({ totalPages, page, siblingCount = 1, boundaryCount = 1 }) {
  return React.useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 3 + boundaryCount * 2;

    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(page - siblingCount, boundaryCount + 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages - boundaryCount);

    const shouldShowLeftDots = leftSiblingIndex > boundaryCount + 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - (boundaryCount + 1);

    const startPages = Array.from({ length: boundaryCount }, (_, i) => i + 1);
    const endPages = Array.from({ length: boundaryCount }, (_, i) => totalPages - boundaryCount + i + 1);

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '…', ...endPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
      return [...startPages, '…', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [...startPages, '…', ...middleRange, '…', ...endPages];
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages, page, siblingCount, boundaryCount]);
}

export function PaginationNavigation({
  page = 1,
  totalItems = 0,
  pageSize = 25,
  onPageChange,
  onPageSizeChange,
  siblingCount = 1,
  boundaryCount = 1,
  variant = 'standard',
  label = 'Pagination Navigation',
  itemNoun = 'items',
  className = '',
  style,
  ...rest
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.max(1, Math.min(page, totalPages));

  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);

  const paginationRange = usePaginationRange({
    totalPages,
    page: safePage,
    siblingCount,
    boundaryCount,
  });

  const handlePageClick = (p) => {
    if (p !== safePage && onPageChange && p >= 1 && p <= totalPages) {
      onPageChange(p);
    }
  };

  const isCompact = variant === 'compact';
  const isMinimal = variant === 'minimal';

  const buttonStyle = (isCurrent, isDisabled) => ({
    minWidth: 32,
    height: 32,
    padding: '0 6px',
    borderRadius: 'var(--radius-sm)',
    border: isCurrent ? '1px solid var(--action-solid)' : 'var(--border-hairline)',
    background: isCurrent ? 'var(--action-solid)' : 'var(--surface-card)',
    color: isCurrent ? '#ffffff' : isDisabled ? 'var(--text-disabled, rgba(0,0,0,0.3))' : 'var(--text-secondary)',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--text-xs)',
    fontWeight: isCurrent ? 'var(--weight-semibold)' : 'var(--weight-regular)',
    cursor: isDisabled || isCurrent ? 'default' : 'pointer',
    opacity: isDisabled ? 0.35 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    transition: 'background 100ms ease, color 100ms ease',
  });

  return (
    <nav
      aria-label={label}
      className={`meridian-pagination-nav ${className}`.trim()}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'var(--surface-card)',
        border: 'var(--border-hairline)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-xs)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-secondary)',
        flexWrap: 'wrap',
        gap: 10,
        ...style,
      }}
      {...rest}
    >
      {/* Total Item Count Summary */}
      {!isMinimal && (
        <div style={{ color: 'var(--text-secondary)' }}>
          Showing <strong style={{ color: 'var(--text-primary)' }}>{startItem}–{endItem}</strong> of{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{totalItems.toLocaleString('en-IN')}</strong> {itemNoun}
        </div>
      )}

      {/* Control Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {/* Previous Page Button */}
        <button
          type="button"
          disabled={safePage <= 1}
          aria-label="Go to previous page"
          style={buttonStyle(false, safePage <= 1)}
          onClick={() => handlePageClick(safePage - 1)}
        >
          <Icon name="chevron-left" size={14} />
          {!isCompact && !isMinimal && <span style={{ marginLeft: 2 }}>Prev</span>}
        </button>

        {/* Stepped Compact View */}
        {isCompact || isMinimal ? (
          <span
            style={{
              padding: '0 8px',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-primary)',
            }}
          >
            Page <strong>{safePage}</strong> of <strong>{totalPages}</strong>
          </span>
        ) : (
          /* Standard Full Numbered Range */
          paginationRange.map((p, idx) => {
            if (p === '…') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  aria-hidden="true"
                  style={{
                    minWidth: 24,
                    textAlign: 'center',
                    color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  …
                </span>
              );
            }

            const isCurrent = p === safePage;
            return (
              <button
                key={p}
                type="button"
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`Page ${p}`}
                style={buttonStyle(isCurrent, false)}
                onClick={() => handlePageClick(p)}
              >
                {p}
              </button>
            );
          })
        )}

        {/* Next Page Button */}
        <button
          type="button"
          disabled={safePage >= totalPages}
          aria-label="Go to next page"
          style={buttonStyle(false, safePage >= totalPages)}
          onClick={() => handlePageClick(safePage + 1)}
        >
          {!isCompact && !isMinimal && <span style={{ marginRight: 2 }}>Next</span>}
          <Icon name="chevron-right" size={14} />
        </button>
      </div>
    </nav>
  );
}
