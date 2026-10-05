Text input with optional leading icon and trailing unit. Always wrap it in `Field` — that is what
supplies the label, the message, and the id/`aria-describedby` wiring. A placeholder is not a label.

```jsx
<Field label="Search resources" hint="Name, tag or ID">
  <Input placeholder="e.g. line-3-mixer" iconLeft="search" />
</Field>

<Field label="API key">
  <Input mono value="ak_live_9f2c…" suffix="key" readOnly />
</Field>

<Field label="Database" error="No database named “prod db”.">
  <Input value="prod db" />
</Field>
```

Placeholders describe the format, never repeat the label. Use `mono` for anything machine-generated.
Never `type="number"` — use `type="text" inputMode="numeric"`. See `specs/forms/Input.spec.html`.
