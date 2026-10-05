The mode switch: one value, two to four options, all visible, in a toolbar row. A raised segment marks where you are.

```jsx
<SegmentedControl label="View" value={view} onChange={setView}
  options={[{value:'list',label:'List'},{value:'board',label:'Board'},{value:'calendar',label:'Calendar'}]} />

<SegmentedControl label="Alignment" iconOnly size="sm" value={align} onChange={setAlign}
  options={[
    {value:'left',label:'Align left',icon:'align-left'},
    {value:'center',label:'Align centre',icon:'align-center'},
    {value:'right',label:'Align right',icon:'align-right'},
  ]} />
```

Native radios: one tab stop, arrows move and wrap, selection follows focus. Pass `label` always — it stays visually hidden unless `labelVisible`.

Reach for something else when: the press swaps a region of the page (`Tabs`, whose `variant="pill"` is this paint with panel semantics); the set filters data, wraps, or goes multi-select (`ChipGroup`); there are five or more options (`Select`); the two states are on/off (`Switch`).

`orientation="vertical"` stacks the segments for a narrow panel or a drawer — same ceiling, same single track, only the axis changes. Not with `iconOnly`: a column of unlabelled glyphs is a toolbar (`ButtonGroup`), not a segmented control.
