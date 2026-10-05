A condition stated in the page flow — the persistent member of the notice family. `Toast` is an event in the corner, `Snackbar` an event on a surface, `Alert` is **state**: it has no timer and stays until the product stops rendering it.

```jsx
<Alert tone="warning" title="Maintenance window in 40 minutes"
       action={<Button variant="secondary" size="sm">Reschedule</Button>}>
  Lines 3 and 4 stop at 18:00 CET. Work orders in progress are held, not cancelled.
</Alert>

<Alert tone="danger" variant="banner" title="Historian unreachable" live="on">
  Trend charts show the last cached values from 09:12.
</Alert>
```

Tones: `info`, `success`, `warning`, `danger`, `neutral`. Always give it a `title` in words — the tint and icon never carry the meaning alone. `live="off"` (default) is right for an alert already on the page at load; set `live="on"` only when it appears in response to something. Use `variant="banner"` for app-frame-wide conditions, and don't make it dismissible unless silencing it is genuinely the user's call.
