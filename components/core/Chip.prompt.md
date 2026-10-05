The offered option — one of a closed set the design owns, all visible at once. `Badge` states a condition, `Tag` carries a value from the data, `Chip` is chosen.

```jsx
<ChipGroup label="Shift" value={shift} onChange={setShift}
  options={[{value:'days',label:'Days'},{value:'swing',label:'Swing'},{value:'nights',label:'Nights'}]} />

<ChipGroup label="Areas" multiple value={areas} onChange={setAreas}
  options={[
    {value:'assembly',label:'Assembly',count:42},
    {value:'paint',label:'Paint',count:8},
    {value:'packing',label:'Packing',count:17},
  ]} />
```

Single-select is radios (one tab stop, arrows move), `multiple` is checkboxes (tab per chip, space toggles) — native, not re-implemented. Always inside a `ChipGroup` with a `label`; two options minimum, and past about seven use `Select`.
