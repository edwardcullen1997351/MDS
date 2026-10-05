Boolean choice in forms and the selector in table headers/rows. Every checkbox needs a name —
`label`, or `aria-label` when the box stands alone in a cell.

```jsx
<Checkbox label="Email me on failures" checked={v} onChange={e => set(e.target.checked)} />
<Checkbox label="Retain raw samples" description="Adds ~2 GB per line per day." checked={r} onChange={onR} />
<Checkbox aria-label="Select all rows" indeterminate={some} checked={all} onChange={selectAll} />
```

Use `indeterminate` for partial "select all" — it sets the native property, so it announces as
"mixed". For a setting that takes effect immediately, use `Switch` instead. A group of related
checkboxes needs `role="group"` with its own heading id in `aria-labelledby`; a `Field` label
cannot name a set. See `specs/forms/Checkbox.spec.html`.
