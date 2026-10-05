One default action with its close alternatives one press away: `[Save][⌄]`. Composite: it owns which action is primary, that the disclosure never invokes it, one aggregate disabled state, two distinct accessible purposes, and the menu's ownership by the cap.

```jsx
<SplitButton
  label="Save"
  onAction={save}
  actions={[
    { id: 'draft', label: 'Save as draft', icon: 'file-pen' },
    { id: 'copy', label: 'Save as a copy', icon: 'copy' },
    'divider',
    { id: 'template', label: 'Save as template', description: 'Reusable for future documents' },
  ]}
  onSelect={(a) => run(a.id)}
/>

// toolbar row, compact and unfilled
<SplitButton variant="ghost" size="sm" label="Export" onAction={exportCsv}
  actions={[{ id: 'xlsx', label: 'Export as XLSX' }, { id: 'pdf', label: 'Export as PDF' }]} />
```

`label` is mandatory: it is the primary wording, the group's accessible name, and the root of the disclosure's name ("More Save actions") and the menu's ("Save actions"). The two halves are separately reachable and separately named — the cap is never a second "Save".

`actions` uses `Menu`'s item vocabulary (`icon`, `shortcut`, `description`, `tone`, `disabled`, dividers, `{ group, items }`). Every action needs a stable `id`; `onSelect` hands back the object you passed. `disabled` disables both halves together.

Use it only when one action is genuinely the expected one. Peer actions of equal weight are `ButtonGroup`; no primary action at all is `Menu` with a lettered trigger. Never reach for it to save horizontal space, and don't put unrelated commands in the menu — "Save" and "Delete" are not alternatives.

`variant` is `primary` · `secondary` · `ghost` · `danger` (a filled destructive default — the cap draws in the critical fill, not action blue). `link` has no seam to draw; it warns and renders as `secondary`.
