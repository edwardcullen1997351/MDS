One semantically related set of actions operating on one context, as a single operable surface. Composite: it owns the toolbar role, one tab stop, the arrow-key contract, the overflow relationship, the coordinated control size and the aggregate disabled state — the controls keep their own activation behaviour.

```jsx
<Toolbar label="Document actions" size="sm" overflow="menu">
  <Button variant="ghost" iconLeft="save" data-priority="high">Save</Button>
  <ButtonGroup label="History">
    <IconButton icon="undo" label="Undo" />
    <IconButton icon="redo" label="Redo" />
  </ButtonGroup>
  <Divider />
  <SegmentedControl label="View" options={[{value:'edit',label:'Edit'},{value:'read',label:'Read'}]} />
  <Divider />
  <Button variant="ghost" iconLeft="share-2">Share</Button>
  <Button variant="ghost" iconLeft="printer">Print</Button>
</Toolbar>
```

`label` is mandatory. Set `size` once on the toolbar — `sm` or `md`, pushed to every child that does not set its own, because one forgotten child puts a 34px control beside a 28px one and breaks the row. Children go in logical action order — DOM order is the keyboard order and the visual order. Keep directly exposed actions few: put the rest behind `overflow="menu"` or a `Menu`, and pin the ones that must always be reachable with `data-priority="high"`.

Keyboard: one tab stop; the main-axis arrows (←/→, or ↑/↓ when `orientation="vertical"`) move between controls and do not wrap — `Home`/`End` are the ends. Inside a `SegmentedControl` the cross-axis arrows still change the value natively, because the main axis belongs to the toolbar.

`disabled` is the aggregate state only (native `fieldset disabled`), for when the context itself is unavailable. Only `Button` with a string label and `IconButton` can collapse into overflow; groups and segmented controls stay visible.

Not navigation — use a nav landmark or `Tabs`. Not a horizontal alignment device — use `Stack direction="row" gap="8"`.
