Work in flight — a task that started and will end. **Not** a level: an OEE bar, a utilisation gauge or a capacity meter reports something that is simply true, and belongs in a chart. That is why `Progress` has no tones.

```jsx
// Determinate: a real number, from real work.
<Progress label="Exporting work orders" value={pct} showValue />

// Indeterminate: "working", never "how long". Omit value.
<Progress label="Reconciling with the historian" />

// Spinner: a short unmeasurable wait, inline or beside a control.
<Progress variant="spinner" size="sm" label="Checking line status" />
```

`label` is required in practice and warns when missing: reduced motion stops both loops dead, so the words are sometimes the only cue that anything is happening. Never let a spinner be the sole signal.

Never fake it. A bar that eases toward 90 % on a timer is a lie with a progress indicator's authority; if the duration is unknown, that is what indeterminate is for. The percentage renders beside the label, never inside a 4px track.

Use nothing for a sub-200ms wait, `Skeleton` when the shape of the incoming content is known, `Progress` when the wait is long or unmeasurable, and `Button loading` when the wait belongs to the control that started it.
