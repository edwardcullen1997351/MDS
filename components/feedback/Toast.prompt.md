Transient confirmation of something the user just did — or the failure of it. Mount `<Toaster />` once at the app root and call it imperatively from wherever the work happens.

```jsx
<Toaster position="bottom-right" />          // once, at the root

Toaster.success('Work order created');
Toaster.show({ title: 'Line 4 held', message: 'Downtime logged from 09:12.',
               action: <Button variant="link" size="sm" onClick={undo}>Undo</Button> });
Toaster.error({ title: 'Export failed', message: 'The report service did not respond.' });
```

Tone sets the default lifetime: info and success 5s, warning 8s, **danger never auto-dismisses**. Reuse an `id` to replace a toast in place. Never put anything in a toast that the user must read or act on — that is a `Dialog`, an inline error, or a banner.
