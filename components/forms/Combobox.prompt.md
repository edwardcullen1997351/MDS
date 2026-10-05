Searchable single-select for long lists — above ~15 options, where `Select` stops working.

```jsx
<Field label="Region"><Combobox options={regions} value={region} onChange={setRegion} placeholder="Search regions" /></Field>
// server-side search
<Combobox aria-label="Owner" options={results} value={owner} onChange={setOwner}
  onSearch={fetchOwners} filter={false} loading={pending} emptyMessage="No owners match" />
```

`onChange` gets the value, not an event. Options may carry a `description`
second line. Single-select; free text is never a value — the input reverts to
the committed selection on blur. Needs `Field` or `aria-label`.
