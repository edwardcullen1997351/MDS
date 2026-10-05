Single-choice dropdown for 4+ options (use Radio below that, Tabs for view switching).

```jsx
<Field label="Environment"><Select options={['Production', 'Staging', 'Development']} value={env} onChange={e => setEnv(e.target.value)} /></Field>
<Select size="sm" aria-label="Region" placeholder="All regions" options={regions} />
```

Wraps the native `<select>`, so keyboard, typeahead and mobile pickers come free.
Single-select only — a set of choices is a `CheckboxGroup`. Needs a name: `Field`
or `aria-label`, never the placeholder alone.
