import React from 'react';

/* DescriptionList — one record's fields.

   Asked for by name three times before it existed: Table §01 ("show one
   record's fields → a definition list"), Table §12 ("a table for one record is
   a definition list wearing a table") and List §14. Three specs sending work
   to a component nobody had built is the clearest signal in the backlog.

   Why it is not List with two slots renamed, which is the shape it would have
   taken if folded in:

   · The element is `dl` of `dt`/`dd`, and that pairing is the whole semantic
     payload. A screen reader announces the term and then its value; a `ul` of
     `li` announces two anonymous strings.
   · The geometry is a two-column grid whose TERM COLUMN IS ONE WIDTH down the
     whole list. That alignment is the component. A list row is as tall and as
     wide as its content and aligns nothing across rows.
   · There is no leading slot, no actions and no per-row link. A field is not
     a record; it has no commands of its own.

   The `<div>` wrapper around each pair is deliberate and valid: HTML5 permits
   a single `div` to group a `dt` with its `dd`s inside a `dl`, and it is what
   makes a CSS grid possible without breaking the pairing. Without it, `display:
   grid` on the `dl` lays out every `dt` and `dd` as independent cells, so a
   term with two values silently pushes every later row out of alignment. */

const ROW_GAP = { sm: 'var(--description-list-row-gap-sm)', md: 'var(--description-list-row-gap-md)' };
const TERM_SIZE = { sm: 'var(--text-2xs)', md: 'var(--text-xs)' };
const VALUE_SIZE = { sm: 'var(--text-xs)', md: 'var(--text-sm)' };

export function DescriptionList({
  items = [],
  layout = 'columns',
  size = 'md',
  /* What renders for a field with no value. NOT a blank cell: a row whose
     value is empty reads as a rendering failure, and Table's content rule
     applies here too — pick one placeholder and never mix it with another
     down the same list. */
  emptyValue = '—',
  divided = false,
  termWidth,
  /* Opt-in container query (§11). Never automatic: this component is frozen,
     and a default that changed underneath a shipped product is not a
     responsive improvement, it is a regression they did not ask for. */
  responsive = false,
  style,
  ...rest
}) {
  const stacked = layout === 'stacked';

  if (!items.length) {
    console.warn('[Meridian] DescriptionList: no `items`. An empty definition list renders nothing at all — if the record has no fields yet, that is an EmptyState.');
  }
  if (items.some((f) => !f || f.term == null)) {
    console.warn('[Meridian] DescriptionList: every item needs a `term`. A value with no label is a string on a page.');
  }

  const list = (
    <dl
      {...rest}
      data-ds-cq={responsive && !stacked ? 'description-list' : undefined}
      style={{
        display: 'grid',
        gridTemplateColumns: stacked ? 'minmax(0,1fr)' : `${termWidth || 'var(--description-list-term-width)'} minmax(0,1fr)`,
        columnGap: 'var(--description-list-column-gap)',
        rowGap: ROW_GAP[size] || ROW_GAP.md,
        margin: 0,
        minWidth: 0,
        ...style,
      }}
    >
      {items.map((f, i) => {
        if (!f) return null;
        const values = Array.isArray(f.value) ? f.value : [f.value];
        const empty = values.every((v) => v == null || v === '');
        return (
          /* The pair group: `display: contents` so the div participates in
             the dl's grid rather than becoming a cell of its own, while still
             keeping each dt bound to its own dd in the DOM. This is the one
             place the component needs both a real element and no box. */
          <div
            key={f.term ?? i}
            style={{
              display: 'contents',
            }}
          >
            <dt
              style={{
                gridColumn: stacked ? '1' : undefined,
                margin: 0,
                fontSize: TERM_SIZE[size] || TERM_SIZE.md,
                color: 'var(--description-list-term-text)',
                textWrap: 'pretty',
                paddingBottom: divided && !stacked ? ROW_GAP[size] || ROW_GAP.md : 0,
                borderBottom: divided && !stacked && i < items.length - 1 ? 'var(--border-width) solid var(--description-list-divider)' : 'none',
              }}
            >
              {f.term}
            </dt>
            {empty ? (
              <dd
                style={{
                  gridColumn: stacked ? '1' : undefined,
                  margin: 0,
                  fontSize: VALUE_SIZE[size] || VALUE_SIZE.md,
                  color: 'var(--description-list-empty-text)',
                  paddingBottom: divided && !stacked ? ROW_GAP[size] || ROW_GAP.md : 0,
                  borderBottom: divided && !stacked && i < items.length - 1 ? 'var(--border-width) solid var(--description-list-divider)' : 'none',
                }}
              >
                {emptyValue}
              </dd>
            ) : (
              values.map((v, vi) => (
                <dd
                  key={vi}
                  style={{
                    gridColumn: stacked ? '1' : undefined,
                    /* A term with several values keeps the term column empty
                       on the continuation rows rather than repeating the
                       term — the grid places these in column 2 automatically
                       only because each dd is its own grid item. */
                    gridColumnStart: !stacked && vi > 0 ? 2 : undefined,
                    margin: 0,
                    fontSize: VALUE_SIZE[size] || VALUE_SIZE.md,
                    fontFamily: f.mono ? 'var(--font-mono)' : undefined,
                    fontVariantNumeric: f.mono ? 'tabular-nums' : undefined,
                    color: 'var(--description-list-description-text)',
                    minWidth: 0,
                    textWrap: 'pretty',
                    paddingBottom: divided && !stacked && vi === values.length - 1 ? ROW_GAP[size] || ROW_GAP.md : 0,
                    borderBottom: divided && !stacked && vi === values.length - 1 && i < items.length - 1 ? 'var(--border-width) solid var(--description-list-divider)' : 'none',
                  }}
                >
                  {v}
                </dd>
              ))
            )}
          </div>
        );
      })}
    </dl>
  );

  /* The container has to be an ancestor, not the queried element itself: a
     container-type element cannot match its own @container rule. One wrapper
     div, and only when asked for. */
  return responsive && !stacked ? <div data-ds-container style={{ minWidth: 0 }}>{list}</div> : list;
}
