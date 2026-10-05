A named one-of-N choice. Use it for every radio set — never a `Field`, whose label can only name
one control, and never loose `Radio`s whose shared `name` you have to manage yourself.

```jsx
<RadioGroup
  label="Attribute downtime to"
  hint="Applies to new records only."
  options={[
    { value: 'first', label: 'First stop', description: 'The station that stopped first.' },
    { value: 'constraint', label: 'Constraint', description: 'The bottleneck machine.' },
    { value: 'line', label: 'Line total', description: 'Not attributed to a station.' },
  ]}
  value={attr}
  onChange={setAttr}
/>

<RadioGroup label="Area" emptyOption="Any area" options={['Mixing', 'Filling']} defaultValue="" />
```

`onChange` receives the next **value string**. The `name` is generated, so a repeated set cannot
collide. 2–5 options; past five use `Select`. A radio set cannot be cleared — offer `emptyOption`
if "none" is legal. See `specs/forms/RadioGroup.spec.html`.
