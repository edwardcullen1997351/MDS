The densest surface in the system — a record per row, read for hours. Geometry rides `[data-density]`.

```jsx
<Table
  caption="Work orders"                 {/* accessible name; visually hidden */}
  rowKey="wo"                            {/* rows identify themselves */}
  columns={[
    { key: 'wo', header: 'WO', mono: true, sortable: true },
    { key: 'line', header: 'Line' },
    { key: 'status', header: 'Status', render: r => <Badge tone={r.tone}>{r.status}</Badge> },
    { key: 'qty', header: 'Qty', align: 'right', sortable: true },
  ]}
  rows={orders}
  selectable selectedKeys={sel} onSelectionChange={setSel}
  rowLabel={r => `work order ${r.wo}`}
  sort={sort} onSortChange={setSort}
  loading={pending} stickyHeader
/>
```

**Selection is keyed by identity, never by index** — index-based selection silently reassigns itself when the table is sorted or paged. Always pass `caption` (it warns without one). Numeric columns get `align="right"` for tabular figures; `mono` for IDs; `wrap` only when a column genuinely needs it, since it costs the fixed row height. Tables live in `Card padding="none"`, and `Pagination` goes in the card footer.
