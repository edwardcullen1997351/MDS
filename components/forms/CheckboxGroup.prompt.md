A named set of independent checkboxes. Use it for any two or more related boxes — never a `Field`,
whose label can only name one control.

```jsx
<CheckboxGroup
  label="Areas included in the report"
  hint="Pick at least one."
  selectAll="All areas"
  options={['Mixing', 'Filling', 'Packing', 'Palletising']}
  value={areas}
  onChange={setAreas}
/>

<CheckboxGroup label="Notifications" options={[
  { value: 'fail', label: 'Failures', description: 'Paged immediately.' },
  { value: 'digest', label: 'Weekly digest', description: 'Mondays at 09:00 CET.' },
]} defaultValue={['fail']} />
```

`onChange` receives the next **array**, not an event. `selectAll` adds the parent box and its
indeterminate maths. Renders a real `<fieldset>`/`<legend>`. `columns={2}` only for short labels
with no descriptions. See `specs/forms/CheckboxGroup.spec.html`.
