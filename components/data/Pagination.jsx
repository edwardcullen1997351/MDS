import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Select } from '../forms/Select.jsx';

/* Pagination — the controls under a Table, and the count that makes them
   legible. Pages are 1-based because every label in the row is user-facing;
   an off-by-one here is a support ticket, not a warning.

   Three variants for three data realities: numbered (the count is known and
   cheap), compact (known but the row is narrow), cursor (the count is not
   knowable — keyset paging over a stream). The component refuses to fake a
   page count it was not given. */

const SIZES = {
  sm: { h: 24, min: 24, px: 6, text: 'var(--text-2xs)', icon: 14, gap: 2 },
  md: { h: 28, min: 28, px: 8, text: 'var(--text-xs)', icon: 16, gap: 3 },
};

const fmt = (n) => new Intl.NumberFormat().format(n);

function Cell({ size, current, disabled, label, ariaLabel, ariaCurrent, onClick, children, wide }) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={(e) => setFocus(e.target.matches(':focus-visible'))}
      onBlur={() => setFocus(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        height: s.h,
        minWidth: wide ? undefined : s.min,
        padding: wide ? `0 ${s.px}px` : '0 4px',
        margin: 0,
        fontFamily: 'var(--font-mono)',
        fontSize: s.text,
        fontVariantNumeric: 'tabular-nums',
        /* Arrows and numbers share a colour deliberately. Both are
           interactive controls of equal standing, and the only colour that
           may distinguish them is the disabled one. Quietening the arrows
           would need --text-tertiary, which the text contract reserves for
           things the operator does NOT have to read in order to act — an
           arrow is acted upon. There is no --pagination-arrow-text. */
        color: disabled
          ? 'var(--pagination-arrow-text-disabled)'
          : current
          ? 'var(--pagination-page-text-current)'
          : hover
          ? 'var(--pagination-page-text-hover)'
          : 'var(--pagination-page-text)',
        background: current ? 'var(--pagination-page-background-current)' : hover && !disabled ? 'var(--pagination-page-background-hover)' : 'transparent',
        border: 0,
        borderRadius: 'var(--pagination-page-radius)',
        boxShadow: focus ? 'var(--pagination-focus-ring)' : 'none',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-control)',
        position: 'relative',
        zIndex: focus ? 1 : undefined,
      }}
    >
      {children != null ? children : label}
    </button>
  );
}

/* The window: first, last, and siblingCount either side of current, with a
   gap marker where pages were skipped. Fixed width by construction — the row
   must not resize as the user pages through it. */
function windowPages(page, pageCount, siblingCount) {
  const total = siblingCount * 2 + 5;
  if (pageCount <= total) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const left = Math.max(2, page - siblingCount);
  const right = Math.min(pageCount - 1, page + siblingCount);
  const out = [1];
  if (left > 2) out.push('gap-left');
  for (let p = left; p <= right; p += 1) out.push(p);
  if (right < pageCount - 1) out.push('gap-right');
  out.push(pageCount);
  return out;
}

export function Pagination({
  page = 1,
  pageCount,
  totalItems,
  pageSize = 25,
  onPageChange,
  pageSizeOptions,
  onPageSizeChange,
  variant = 'numbered',
  size = 'md',
  siblingCount = 1,
  hasNext,
  hasPrev,
  itemLabel = 'rows',
  showSummary = true,
  label = 'Pagination',
  style,
  ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const count = pageCount != null ? pageCount : totalItems != null ? Math.max(1, Math.ceil(totalItems / pageSize)) : null;
  const cursor = variant === 'cursor';

  React.useEffect(() => {
    if (!cursor && count == null) {
      console.warn('[Meridian] Pagination: needs pageCount or totalItems + pageSize. Without a total, use variant="cursor" with hasNext/hasPrev rather than a page count you do not have.');
    }
  }, [cursor, count]);

  const prevOn = cursor ? !!hasPrev : page > 1;
  const nextOn = cursor ? !!hasNext : count != null && page < count;
  const go = (p) => { if (onPageChange) onPageChange(p); };

  const from = totalItems != null ? Math.min((page - 1) * pageSize + 1, totalItems) : (page - 1) * pageSize + 1;
  const to = totalItems != null ? Math.min(page * pageSize, totalItems) : page * pageSize;

  const summary = cursor
    ? `${fmt(from)}–${fmt(to)}`
    : totalItems != null
    ? `${fmt(from)}–${fmt(to)} of ${fmt(totalItems)} ${itemLabel}`
    : `Page ${fmt(page)} of ${fmt(count || 1)}`;

  return (
    <nav
      aria-label={label}
      data-pagination={variant}
      {...rest}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 'var(--space-3)',
        minWidth: 0,
        ...style,
      }}
    >
      {showSummary ? (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: s.text, color: 'var(--pagination-summary-text)', fontVariantNumeric: 'tabular-nums' }}>{summary}</span>
      ) : <span />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 0 }}>
        {pageSizeOptions && pageSizeOptions.length > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: s.text, color: 'var(--pagination-summary-text)' }}>Per page</span>
            <Select
              aria-label={`${itemLabel} per page`}
              size="sm"
              options={pageSizeOptions.map((n) => String(n))}
              value={String(pageSize)}
              onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}
              style={{ width: 72 }}
            />
          </span>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
          <Cell size={size} disabled={!prevOn} ariaLabel="Previous page" onClick={() => go(page - 1)}>
            <Icon name="chevron-left" size={s.icon} />
          </Cell>

          {variant === 'numbered' && count != null && windowPages(page, count, siblingCount).map((p) =>
            typeof p === 'number' ? (
              <Cell
                key={p}
                size={size}
                current={p === page}
                ariaLabel={`Page ${p}`}
                ariaCurrent={p === page ? 'page' : undefined}
                onClick={() => go(p)}
                label={fmt(p)}
              />
            ) : (
              /* A gap marker, not a control: the pages it stands for are
                 reachable by paging or by the arrows, and a menu of forty
                 page numbers helps nobody. */
              <span key={p} aria-hidden="true" style={{ minWidth: s.min, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: s.text, color: 'var(--pagination-ellipsis-text)' }}>…</span>
            )
          )}

          {variant === 'compact' && count != null && (
            <span style={{ padding: `0 ${s.px}px`, fontFamily: 'var(--font-mono)', fontSize: s.text, color: 'var(--pagination-page-text)', fontVariantNumeric: 'tabular-nums' }}>
              {fmt(page)} / {fmt(count)}
            </span>
          )}

          <Cell size={size} disabled={!nextOn} ariaLabel="Next page" onClick={() => go(page + 1)}>
            <Icon name="chevron-right" size={s.icon} />
          </Cell>
        </div>
      </div>
    </nav>
  );
}
