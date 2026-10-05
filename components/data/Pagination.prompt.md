Page controls under a table or list, plus the range summary that makes them mean something. Pages are 1-based.

```jsx
<Pagination page={page} totalItems={1204} pageSize={size} itemLabel="work orders"
  pageSizeOptions={[25, 50, 100]} onPageSizeChange={setSize} onPageChange={setPage} />

// No total available — keyset paging over a stream.
<Pagination variant="cursor" page={page} pageSize={50}
  hasPrev={!!cursors.prev} hasNext={!!cursors.next} onPageChange={setPage} />
```

`numbered` (default) needs a real `pageCount` or `totalItems`; `compact` shows "3 / 48" where the row is narrow; `cursor` drops page numbers entirely and takes `hasPrev`/`hasNext` from the API. Never pass an invented count — the component warns rather than faking one.
