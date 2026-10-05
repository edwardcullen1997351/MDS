A hierarchy the user walks — plant → line → station → asset, a BOM explosion, a routing. The nested collection `List`, `Accordion`, `Menu` and `Table` all refuse: a flat run, one level of disclosure, a surface that closes, and a row group that is not a parent.

```jsx
const [open, setOpen] = React.useState(['PL-04', 'PRESS']);
const [sel, setSel] = React.useState(['PRS-4120']);

<Tree
  label="Plant assets · Chakan (PL-04)"
  selection="single"
  items={[{ id: 'PL-04', label: 'Chakan plant (PL-04)', icon: 'factory', children: [
    { id: 'PRESS', label: 'Press shop', icon: 'layers', meta: '4 assets', children: [
      { id: 'PRS-4120', label: 'PRS-4120', icon: 'cpu', meta: '82 %', trailing: <Badge tone="success">Running</Badge> },
      { id: 'PRS-4121', label: 'PRS-4121', icon: 'cpu', meta: '0 %', trailing: <Badge tone="warning">Changeover</Badge> },
    ]},
    { id: 'WELD', label: 'Weld shop', icon: 'layers', hasChildren: true },
  ]}]}
  expandedIds={open} onExpandedChange={setOpen}
  selectedIds={sel} onSelectionChange={setSel}
  onActivate={(n) => openAsset(n.id)}
/>
```

**Expansion is not selection.** They are separate props on purpose: which nodes are open is view state a product often persists, which node is chosen is data. Collapsing never deselects.

**The row is a control** (`role="treeitem"`, one tab stop for the whole tree, arrows / Home / End / `*` / typeahead) — which is why it has no `actions` slot and no nested `Checkbox`. Commands belong to the pane the selection drives; in `multiple` the row itself is the checkable thing and the square is an indicator.

`selectedIds` is a set in every mode, so `single` yields 0 or 1 and consumers never branch on the mode. `cascade` (off by default) makes a branch's selection stand for its descendants. `hasChildren` marks a branch not yet loaded — expanding it fires `onExpandedChange`; put its id in `loadingIds` while the fetch runs.

Reach elsewhere when: the records are flat (`List`); the fields align into columns (`Table`); it is one level of collapsible sections (`Accordion`); it is a command surface (`Menu`); or the user knows the name and wants to type it (`Combobox` — tree typeahead only matches rows already visible).
