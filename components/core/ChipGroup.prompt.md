The labelled set of offered options — the system's segmented control. The group is the component: a `Chip` outside one is a toggle `Button`.

```jsx
// Single-select: radios. onChange gives the next VALUE, not an event.
<ChipGroup label="Shift" value={shift} onChange={setShift}
  options={[{value:'days',label:'Days'},{value:'swing',label:'Swing'},{value:'nights',label:'Nights'}]} />

// Multi-select: checkboxes. onChange gives the next ARRAY, in option order.
<ChipGroup label="Areas" multiple value={areas} onChange={setAreas}
  hint="Any number of areas."
  options={[
    {value:'assembly',label:'Assembly',count:42},
    {value:'paint',label:'Paint',count:8},
    {value:'shipping',label:'Shipping',count:3,disabled:true},
  ]} />
```

`label` is the question the chips answer and is required (`aria-label` when it is already on screen). Two options minimum, seven maximum — past that use `Select` (known list) or `Combobox` (searchable); there is no overflow count, because hiding an offered option is the failure this control prevents.

Single-select is one tab stop with wrapping arrow selection; `multiple` is a stop per chip with `Space`. Both come from native inputs — nothing is re-implemented. A radio set cannot be cleared, so offer "All" as an option rather than making a chosen chip clickable-off.

Always controlled. `name` is generated per group — never share one, or two rendered groups become one radio set. Disable an unavailable option, never remove it. Not a view switcher (`Tabs`), not an action row (`ButtonGroup`), not a display of applied filters (`TagList`).
