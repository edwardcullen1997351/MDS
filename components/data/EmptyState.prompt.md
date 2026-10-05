The absence of data, explained. `variant` is the whole point: "empty" is four different situations and one message cannot serve them.

```jsx
// nothing exists yet — offer to create
<EmptyState variant="first-run" title="No work orders yet"
  actions={<Button variant="primary" iconLeft="plus">New work order</Button>}>
  Work orders scheduled for this line will appear here.
</EmptyState>

// data exists, a filter hides it — offer a way BACK, never "create your first"
<EmptyState variant="no-results" title="No work orders match this filter"
  live="polite"
  actions={<Button variant="secondary" onClick={reset}>Clear filters</Button>}>
  Try widening the date range or clearing the line filter.
</EmptyState>

// the work is done — a success, and it takes no actions
<EmptyState variant="cleared" title="No open alarms" size="sm" />
```

Inside a `Table`, pass it to `emptyMessage` rather than replacing the table — the slot takes a ReactNode, so the column headers stay and the empty still gets its action:

```jsx
<Table rows={rows} columns={cols} emptyMessage={
  <EmptyState variant="no-results" size="sm" live="polite" title="No lines match this filter"
    actions={<Button variant="secondary" size="sm" onClick={clear}>Clear filters</Button>} />
} />
```

Renders **no surface and no border** by default — it goes inside a `Card` or `Table` region that has one. Pass `bordered` only when standing alone. Set `headingLevel` to match the outline. `live="polite"` only when it replaces content because of something the user just did.

Not an error — that is `Alert tone="danger"`, which keeps the cause, the retry and the assertive announcement. Not a loading state — that is `Skeleton`. No illustration slot: the glyph is capped at 22px, the system's ceiling.
