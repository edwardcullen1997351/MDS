The group scaffold — `<fieldset>` + `<legend>` + one hint/error row. Used by `ChipGroup`, `RadioGroup` and `CheckboxGroup`; reach for it when building a new grouped control, not for a single control (that is `Field`).

```jsx
<Fieldset label="Areas" hint="Counts are open work orders." required>
  <div style={{ display: 'flex', gap: 8 }}>{/* the controls */}</div>
</Fieldset>
```

A `Field` label points at one control and cannot name a set — that is why groups label themselves, and why this exists so they all look alike.
