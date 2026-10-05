Stacked disclosures — headers stay visible, panels open one at a time (or many with `multiple`). Use it to shorten a long page of settings, spec sections or per-asset detail; never to hide something the operator needs at a glance.

```jsx
<Accordion
  items={[
    { value: 'thresholds', title: 'Alert thresholds', description: '4 rules', icon: 'gauge', content: <Fields /> },
    { value: 'schedule', title: 'Maintenance window', meta: <Badge tone="warning">Overdue</Badge>, content: <Schedule /> },
    { value: 'audit', title: 'Audit trail', disabled: true, description: 'Requires admin' },
  ]}
  defaultValue="thresholds"
/>

// Dense, inside a sidebar or a card with padding="none"
<Accordion variant="flush" size="sm" multiple items={groups} />
```

`bordered` (default) is one card holding rows; `divided` is hairlines only, for a section already inside a card; `flush` has no chrome. Pass `keepMounted` when a panel holds a form or a chart that must not reset on collapse. Panels never animate their height — the chevron rotates and the content fades.
