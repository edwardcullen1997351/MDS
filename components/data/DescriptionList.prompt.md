One record's fields, as a real `dl` of `dt`/`dd` pairs. Asked for by name three times before it existed — `Table` §01, `Table` §12 ("a table for one record is a definition list wearing a table") and `List` §14.

```jsx
<DescriptionList items={[
  { term: 'Work order', value: 'WO-88431', mono: true },
  { term: 'Line', value: 'Assembly 3' },
  { term: 'Owners', value: ['Maya Osei', 'Tomas Lind'] },
  { term: 'Closed', value: null },              // renders —
]} />

<DescriptionList layout="stacked" size="sm" items={fields} />   // narrow panels
```

The term column is **one width down the whole list** — that alignment is the component. A missing value renders `emptyValue` (`—`), never a blank cell, which reads as a rendering failure. `mono` for anything out of the data.

Not `List` with two slots renamed: no leading slot, no actions, no per-row link. A field is not a record. If the record has no fields at all, that's an `EmptyState`. If you have several records sharing these fields, that's a `Table`.
