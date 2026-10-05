A non-modal panel anchored to a trigger — filters, column pickers, detail
peeks, small forms. The system's anchoring primitive: `Combobox`,
`Autocomplete` and `Tooltip` position through the same engine, so nothing here
is clipped by an ancestor's `overflow: hidden`.

```jsx
<Popover trigger={<Button variant="secondary" iconRight="chevron-down">Filters</Button>} title="Filters">
  <Stack gap={3}>…</Stack>
</Popover>
// anchored to a field, edge-to-edge content, controlled
<Popover open={open} onOpenChange={setOpen} side="right" align="start"
  width={360} padded={false} aria-label="Machine detail">…</Popover>
```

Focus moves into the panel and returns to the trigger on close. Escape, an
outside pointer-down, or tabbing out of the panel dismisses it — it is not
modal and not focus-trapped. `Dialog` for a blocking decision, `Tooltip` for a
hover label. No arrow, deliberately.
