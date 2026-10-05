The run of records `Table` refuses — activity feeds, alarm lists, search results. Table §01 sends "items with unlike shapes" away by name; this is where they go.

```jsx
<List label="Recent activity">
  <ListItem leading={<Icon name="clipboard-list" size="xs" />}
    title="WO-88431 released to Assembly 3"
    meta="2,000 pcs · m.osei · 12 min ago" />
  <ListItem leading={<Avatar name="Tomas Lind" size="sm" decorative />}
    title="Changeover completed on Pack 1" href="/wo/88429"
    description="PN-7742 → PN-7749."
    actions={<IconButton icon="ellipsis" label="Row actions" size="sm" />} />
</List>
```

**The row is not a control.** `href` makes the *title* a link; `actions` holds the row's commands. `onClick` on a row warns — it's the mouse-only control `Card` shipped in 1.15.0.

Always pass `label`: a list announces its length, never its subject. If any row has `leading`, every row reserves the gutter so titles align. `variant="plain"` swaps rules for a gap. `ordered` numbers the rows — only when the number is the information.

Reach elsewhere when: rows share fields and should align in columns (`Table`); the rows are selectable options (`Combobox`/`MultiCombobox` own `listbox`); they're label/value pairs for one record (a definition list — not yet built); or each row needs its own surface and heading (`Card`s in a stack).
