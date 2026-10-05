Label + hint/error wrapper for a single form control, and the owner of the accessible plumbing nine components read from.

```jsx
<Field label="Target quantity" hint="Must be under 30000" error={err} required>
  <Input value={v} onChange={set} />
</Field>
```

Field generates the id, points its `<label>` at it, renders the hint under `<id>-hint` and the error under `<id>-err`, and publishes `{ id, describedBy, invalid, required }` on `FieldContext` — so `for`/`id`, `aria-describedby`, `aria-invalid` and `aria-required` are correct by structure, not by hand. An explicit prop on the control always wins.

**The hint stays visible when an error appears** — it carries the rule the error is asking the user to satisfy, so removing it is a 3.3.3 failure. If your error merely repeats your hint, the error copy is wrong. Always pass `label` (it warns without one); use `labelHidden` when the label must not be seen. For a *set* of controls use `Fieldset` — a `<label for>` names one control and cannot name a group.
