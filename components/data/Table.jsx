import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Checkbox } from '../forms/Checkbox.jsx';
import { Skeleton } from './Skeleton.jsx';

/* Table — the densest surface in the system and the one an operator reads
   for hours. Everything here is shaped by two facts: a row is a RECORD, not
   a position, and a console table is read far more often than it is clicked.

   Hardened 1.14.0. The defect that mattered most: selection was held as
   `number[]` of array indices, so sorting or paging a table with rows
   selected silently reassigned the selection to different records. In a
   plant console that means holding the wrong line. Selection is now keyed
   by the row's own identity.

   `freezeLeading` (1.14.1) closes the gap that making horizontal scroll
   real had opened: once a wide table scrolls, the identity column goes with
   it and the operator reads a row of numbers with nothing naming the
   record. The deferred question was which column to freeze — the checkbox
   or the first data column — and the answer is that they are ONE unit,
   because both answer "which record is this". They freeze together or not
   at all; freezing a checkbox while its row's identity scrolls away is the
   worse version of the original bug.

   The other four were accessibility failures that a screenshot cannot show:
   sortable headers were `<th onClick>` — not focusable, not operable by
   keyboard at all, and carrying no `aria-sort`; clickable rows were
   `<tr onClick>`, equally unreachable; the table had no accessible name;
   and the horizontal scroll container could not be scrolled without a
   pointer. */

/* The selection column's width, shared by the header, the cells and the
   frozen offset maths — three places that must agree or the frozen block
   develops a seam. */
const SELECT_W = 36;

const keyOf = (row, rowKey, i) => {
  if (typeof rowKey === 'function') return rowKey(row, i);
  const v = row?.[rowKey];
  return v == null ? i : v;
};

function Row({ columns, row, rk, index, selectable, selected, rowLabel, freeze, onSelectRow, onRowClick }) {
  const clickable = !!onRowClick;
  return (
    <tr
      data-table-row={selected ? 'selected' : 'default'}
      /* A clickable row is focusable and answers Enter/Space. The row keeps
         role="row" — a <tr role="button"> destroys the table's semantics —
         so products should ALSO put a real link on the primary column; this
         handles the whole-row target without making it the only route in. */
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? () => onRowClick(row, index) : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRowClick(row, index); }
      } : undefined}
      style={{
        /* Background is NOT set here: hover, selection and focus all need
           real selectors, and an inline background would outrank every one
           of them. base.css owns them via [data-table-row] — the same
           stylesheet-hook pattern Badge uses for forced colours. */
        cursor: clickable ? 'pointer' : 'default',
      }}
    >
      {selectable && (
        <td data-table-frozen={freeze ? '' : undefined} style={{ width: SELECT_W, padding: '0 0 0 var(--table-cell-padding-x)', borderBottom: 'var(--border-width) solid var(--table-row-border)', ...(freeze ? { position: 'sticky', left: 0, zIndex: 1 } : null) }}>
          {/* Named by the record, not the position. "Select row 3" tells a
              screen-reader user nothing, and after a sort it is a lie. */}
          <Checkbox aria-label={`Select ${rowLabel || `row ${index + 1}`}`} checked={selected} onChange={(e) => onSelectRow(rk, e.target.checked)} onClick={(e) => e.stopPropagation()} />
        </td>
      )}
      {columns.map((c, ci) => {
        const content = c.render ? c.render(row, index) : row[c.key];
        /* Only the FIRST data column freezes. A second frozen column is a
           different feature (a frozen pane) with its own width budget, and
           at that point the scrolling area is what is left over. */
        const frozen = freeze && ci === 0;
        return (
          <td
            key={c.key}
            data-table-frozen={frozen ? '' : undefined}
            /* Truncated text is recoverable on hover only when the cell has
               a plain string in it. Cells with a rendered node get nothing,
               because a title on a Badge would announce twice. */
            title={!c.wrap && !c.render && typeof content === 'string' ? content : undefined}
            style={{
              padding: c.wrap ? 'var(--table-cell-padding-y) var(--table-cell-padding-x)' : '0 var(--table-cell-padding-x)',
              height: c.wrap ? undefined : 'var(--table-row-height)',
              borderBottom: 'var(--border-width) solid var(--table-row-border)',
              fontSize: 'var(--text-sm)',
              fontFamily: c.mono ? 'var(--font-mono)' : 'var(--font-sans)',
              fontVariantNumeric: c.align === 'right' ? 'tabular-nums' : undefined,
              color: 'var(--table-cell-text)',
              textAlign: c.align || 'left',
              verticalAlign: c.wrap ? 'top' : 'middle',
              width: c.width,
              whiteSpace: c.wrap ? 'normal' : 'nowrap',
              overflow: c.wrap ? undefined : 'hidden',
              textOverflow: c.wrap ? undefined : 'ellipsis',
              textWrap: c.wrap ? 'pretty' : undefined,
              ...(frozen ? { position: 'sticky', left: selectable ? SELECT_W : 0, zIndex: 1 } : null),
            }}
          >
            {content}
          </td>
        );
      })}
    </tr>
  );
}

export function Table({
  columns = [],
  rows = [],
  rowKey = 'id',
  caption,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  rowLabel,
  sort,
  onSortChange,
  onRowClick,
  loading = false,
  loadingRows = 5,
  stickyHeader = false,
  freezeLeading = false,
  minWidth,
  emptyMessage = 'No results',
  /* Destructured purely to strip it from `rest`: left in, React spreads the
     old prop onto the wrapper div and the consumer gets an unknown-prop
     error on top of the migration warning below. */
  selectedRows,
  style,
  ...rest
}) {
  const scrollRef = React.useRef(null);
  const [scrollable, setScrollable] = React.useState(false);

  if (!caption && !rest['aria-label'] && !rest['aria-labelledby']) {
    console.warn('[Meridian] Table: no caption and no aria-label. A table is the one component whose accessible name cannot be inferred from its content — a screen-reader user landing in it hears only "table" and a column count.');
  }
  if (freezeLeading && !minWidth) {
    console.warn('[Meridian] Table: freezeLeading with no minWidth does nothing. A table at width:100% with truncating cells never overflows, so there is no horizontal scroll for a frozen column to hold still against — set minWidth (Table §11).');
  }
  if (selectedRows) {
    console.warn('[Meridian] Table: `selectedRows` (array indices) was replaced by `selectedKeys` in 1.14.0. Index-based selection silently reassigns itself when the table is sorted or paged — select a row, sort, and you are holding a different record. Pass row identities and set `rowKey`.');
  }

  /* Only label the scroll region when it actually scrolls: a focusable
     region that never needs scrolling is one more Tab stop for nothing.

     Note this can only ever fire when the table has a `minWidth` (or enough
     fixed column widths to exceed the container). With truncating cells and
     `tableLayout: auto`, a table WITHOUT one shrinks to fit forever and
     never overflows — so `minWidth` is not a nicety, it is the thing that
     makes horizontal scrolling exist at all. */
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const check = () => setScrollable(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [columns, rows]);

  const keys = React.useMemo(() => rows.map((r, i) => keyOf(r, rowKey, i)), [rows, rowKey]);
  const allOn = rows.length > 0 && keys.every((k) => selectedKeys.includes(k));
  const someOn = selectedKeys.length > 0 && !allOn;
  const colCount = columns.length + (selectable ? 1 : 0);

  const set = (k, on) => {
    if (!onSelectionChange) return;
    onSelectionChange(on ? [...selectedKeys, k] : selectedKeys.filter((x) => x !== k));
  };

  const headerCell = (c, ci) => {
    const active = sort && sort.key === c.key;
    const dir = active ? sort.direction : null;
    const canSort = c.sortable && onSortChange;
    const frozen = freezeLeading && ci === 0;
    return (
      <th
        key={c.key}
        scope="col"
        data-table-frozen={frozen ? '' : undefined}
        /* aria-sort belongs on the header cell, and only on the ONE that is
           sorted — "none" on every other sortable column is noise. */
        aria-sort={active ? (dir === 'asc' ? 'ascending' : 'descending') : undefined}
        style={{
          height: 'var(--table-header-height)',
          padding: 0,
          borderBottom: 'var(--border-width) solid var(--table-header-border)',
          textAlign: c.align || 'left',
          width: c.width,
          whiteSpace: 'nowrap',
          background: stickyHeader ? 'var(--table-header-background-sticky)' : undefined,
          /* A frozen header cell is sticky on BOTH axes, and must outrank
             the header row and the frozen body cells it crosses. */
          ...(frozen ? { position: 'sticky', left: selectable ? SELECT_W : 0, zIndex: stickyHeader ? 3 : 1 } : null),
        }}
      >
        {/* A real button: focusable, Enter/Space for free, and announced as
            a control rather than as a cell that happens to react to clicks. */}
        {React.createElement(
          canSort ? 'button' : 'span',
          {
            type: canSort ? 'button' : undefined,
            onClick: canSort ? () => onSortChange({ key: c.key, direction: active && dir === 'asc' ? 'desc' : 'asc' }) : undefined,
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              justifyContent: c.align === 'right' ? 'flex-end' : c.align === 'center' ? 'center' : 'flex-start',
              width: '100%',
              height: 'var(--table-header-height)',
              padding: '0 var(--table-cell-padding-x)',
              margin: 0,
              border: 'none',
              background: 'none',
              font: 'inherit',
              fontSize: 'var(--text-2xs)',
              fontWeight: 'var(--weight-semibold)',
              letterSpacing: 'var(--tracking-caps)',
              textTransform: 'uppercase',
              textAlign: 'inherit',
              color: active ? 'var(--table-header-text-active)' : 'var(--table-header-text)',
              cursor: canSort ? 'pointer' : 'default',
              userSelect: 'none',
            },
          },
          c.header,
          c.sortable ? <Icon key="i" name={active ? (dir === 'asc' ? 'arrow-up' : 'arrow-down') : 'chevrons-up-down'} size="mark" style={{ opacity: active ? 1 : 0.5, flex: 'none' }} aria-hidden="true" /> : null,
        )}
      </th>
    );
  };

  return (
    <div
      ref={scrollRef}
      /* Focusable only when it overflows, so a keyboard user can reach the
         columns that are off-screen — an unfocusable overflow container is
         content that exists but cannot be read without a mouse. */
      tabIndex={scrollable ? 0 : undefined}
      role={scrollable ? 'region' : undefined}
      aria-label={scrollable ? (typeof caption === 'string' ? `${caption} (scrollable)` : 'Table, scrollable') : undefined}
      aria-busy={loading || undefined}
      style={{ width: '100%', overflowX: 'auto', ...style }}
      {...rest}
    >
      <table style={{ width: '100%', minWidth, borderCollapse: 'collapse', tableLayout: 'auto' }}>
        {caption && (
          /* Visually hidden by default: the table's name is usually already
             a visible heading above it, and printing it twice is noise —
             but the table itself must still carry one. */
          <caption style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>{caption}</caption>
        )}
        <thead style={stickyHeader ? { position: 'sticky', top: 0, zIndex: 2, boxShadow: 'var(--table-header-shadow-sticky)' } : undefined}>
          <tr style={{ background: 'var(--table-header-background)' }}>
            {selectable && (
              <th scope="col" data-table-frozen={freezeLeading ? '' : undefined} style={{ width: SELECT_W, padding: '0 0 0 var(--table-cell-padding-x)', height: 'var(--table-header-height)', borderBottom: 'var(--border-width) solid var(--table-header-border)', background: stickyHeader ? 'var(--table-header-background-sticky)' : undefined, ...(freezeLeading ? { position: 'sticky', left: 0, zIndex: stickyHeader ? 3 : 1 } : null) }}>
                <Checkbox
                  aria-label={allOn ? 'Deselect all rows' : 'Select all rows'}
                  checked={allOn}
                  indeterminate={someOn}
                  onChange={() => onSelectionChange && onSelectionChange(allOn ? [] : keys)}
                />
              </th>
            )}
            {columns.map(headerCell)}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            /* Rows keep their real geometry while loading, so the table does
               not resize when the data lands. One announcement comes from
               aria-busy on the region; the placeholders are aria-hidden. */
            Array.from({ length: loadingRows }, (_, i) => (
              <tr key={`sk-${i}`}>
                {selectable && <td data-table-frozen={freezeLeading ? '' : undefined} style={{ width: SELECT_W, padding: '0 0 0 var(--table-cell-padding-x)', height: 'var(--table-row-height)', borderBottom: 'var(--border-width) solid var(--table-row-border)', ...(freezeLeading ? { position: 'sticky', left: 0, zIndex: 1 } : null) }}><Skeleton width="16px" height="16px" /></td>}
                {columns.map((c, ci) => (
                  <td key={c.key} data-table-frozen={freezeLeading && ci === 0 ? '' : undefined} style={{ padding: '0 var(--table-cell-padding-x)', height: 'var(--table-row-height)', borderBottom: 'var(--border-width) solid var(--table-row-border)', ...(freezeLeading && ci === 0 ? { position: 'sticky', left: selectable ? SELECT_W : 0, zIndex: 1 } : null) }}>
                    <Skeleton width={c.align === 'right' ? '48px' : '70%'} style={c.align === 'right' ? { marginLeft: 'auto' } : undefined} />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={colCount} style={{ height: 96, textAlign: 'center', fontSize: 'var(--text-sm)', color: 'var(--table-empty-text)' }}>{emptyMessage}</td>
            </tr>
          ) : (
            rows.map((row, i) => {
              const rk = keys[i];
              return (
                <Row
                  key={rk}
                  columns={columns}
                  row={row}
                  rk={rk}
                  index={i}
                  selectable={selectable}
                  selected={selectedKeys.includes(rk)}
                  rowLabel={rowLabel ? rowLabel(row, i) : undefined}
                  freeze={freezeLeading}
                  onSelectRow={set}
                  onRowClick={onRowClick}
                />
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
