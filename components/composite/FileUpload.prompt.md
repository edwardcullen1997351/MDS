One attachment set on one record. Assembles `FileDropzone` + `FileItem` inside a `Field`, and owns
the one thing neither part can see: whether the set is finished — which is what a Save or Release
button depends on.

```jsx
const [files, setFiles] = React.useState([]);
const [status, setStatus] = React.useState('idle');

<FileUpload label="Revised drawing and BOM"
  targetLabel="Drop the revised drawing and BOM here, or browse"
  hint="PDF, DWG or CSV · up to 20 MB each · 5 files"
  accept=".pdf,.dwg,.csv" maxSize={20 * 1024 * 1024} maxFiles={5} required
  value={files} onChange={setFiles} onStatusChange={setStatus} />

<Button disabled={status !== 'idle'} onClick={release}>Release ECR-2291</Button>
{status === 'busy' && <Text size="xs" tone="tertiary">Waiting for 1 upload</Text>}
```

Controlled only — the composite stores nothing and uploads nothing. Drive each entry's `state` and
`progress` from your own queue (real bytes, never a timer), and block submit on `busy` and `failed`
with the reason in text beside the button, not in a tooltip. Set-level messages go in the field
error; a file's own reason stays on its row. See `specs/composite/FileUpload.spec.html`.
