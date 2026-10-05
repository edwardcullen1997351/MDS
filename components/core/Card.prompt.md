The default grouping device, and the surface most other components sit inside.

```jsx
<Card title="Work orders" subtitle="Days shift" headingLevel={2}
      actions={<IconButton icon="ellipsis" label="Card actions" size="sm" />}>
  <Chart />
</Card>

{/* A table fills the card edge to edge; Pagination needs footerAlign="between" */}
<Card title="Work orders" padding="none"
      footer={<Pagination page={p} totalItems={n} pageSize={25} onPageChange={setP} />}
      footerAlign="between">
  <Table caption="Work orders" rowKey="wo" columns={cols} rows={rows} />
</Card>
```

The element follows the content: a titled card is a named `<section>`, an untitled one a `<div>` — an unnamed `<section>` isn't exposed as a region at all. Set `headingLevel` to match the document outline. `interactive` requires `onClick` (it warns otherwise) and then wires focus, Enter/Space and a focus ring — never fake it with `cursor: pointer`. Default `footerAlign="end"` is for an action row; use `between` for any single child that distributes itself.
