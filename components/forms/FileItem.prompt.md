One file's row: name, size, state, progress and removal. It represents state — it does not
upload. `state` and `progress` come from the caller's queue.

```jsx
{files.map(f => (
  <FileItem key={f.id} name={f.name} size={f.size} meta={f.meta}
    state={f.state} progress={f.progress} error={f.error}
    onRemove={() => cancelOrRemove(f.id)}
    onRetry={f.state === 'failed' ? () => retry(f.id) : undefined} />
))}
```

`state="uploading"` needs a real `progress` number — the bar is determinate, so an indeterminate
upload has to be `queued` instead. Write `error` as the reason, not "Error". Pair with
`FileDropzone`. See `specs/forms/FileItem.spec.html`.
