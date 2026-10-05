Query entry with search semantics, plus clear and submit. Composite: it owns the query contract, the `role="search"` boundary and name, the clear/submit split and their coordinated sizing — `Input` keeps all text editing.

```jsx
// search as you type — no submit control
<SearchField label="Search invoices" value={q} onChange={setQ} placeholder="Invoice no. or customer" />

// explicit submission
<SearchField label="Search the archive" submit="button" onSubmit={run}
  hint="Whole words only. Quotes for exact phrases." />

// stable clear target, compact row
<SearchField label="Filter rows" size="sm" clearable="always" defaultValue="overdue" />
```

`label` is mandatory and is the search scope, not a repeat of "Search" — several search controls on one page are only distinguishable by it. `placeholder` may hint at format; it never replaces the label.

Clearing is an ordinary value change: `onChange('')` fires, `onClear` is an extra signal, and focus returns to the input. The clear control appears only when there is something to clear unless you ask for `clearable="always"`.

With `onSubmit`, `Enter` submits and a `submit="icon"`/`submit="button"` control fires the same handler; without it the query itself is the signal. Both models keep the same semantics — that is the point of the prop.

`size` coordinates the field, the clear control and the submit control together. `landmark` publishes a `role="search"` region — off by default, since the field is already a `searchbox`; turn it on for a page's primary search only.

Not a suggestion field — use `Autocomplete`. It owns no results, suggestions or result counts.
