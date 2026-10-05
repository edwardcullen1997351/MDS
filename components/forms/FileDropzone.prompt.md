A drop target and file picker with validation. It selects and validates; it does **not** upload.
`onSelect(accepted, rejected)` hands you both lists and the component keeps nothing — the surface
owns the queue, transport, progress, retry and cancel.

```jsx
<FileDropzone multiple accept=".pdf,.dwg,.csv" maxSize={20 * 1024 * 1024} maxFiles={5}
  currentCount={files.length}
  label="Drop the revised drawing and BOM here, or browse"
  hint="PDF, DWG or CSV · up to 20 MB each · 5 files"
  onSelect={(ok, bad) => { setFiles([...files, ...ok.map(queue)]); reportRejections(bad); }} />
```

Say what is allowed in `hint` before the user picks, and report `rejected` yourself — the dropzone
paints `invalid` but never writes the message. Render each selected file with `FileItem`.
See `specs/forms/FileDropzone.spec.html`.

Rendering files somewhere else — a `Table` name cell, a document list? `fileGlyph(name)` maps an
extension to a Lucide glyph name (`'file'` when unknown):

```jsx
<Icon name={fileGlyph(row.name)} size="sm" /> {row.name}
```

`FileItem` does not use it, on purpose — a row carries no file-type glyph. Note the reach: like every
lowercase helper in this system it is importable from the package but **not** on
`window.<Namespace>`, so a design-system card or spec page has to inline the map instead.
