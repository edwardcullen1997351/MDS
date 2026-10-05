An on/off setting that takes effect the moment it is flipped — no save button. If the change is
pending until submit, that is a `Checkbox`.

```jsx
<Switch label="Auto-hold on fault" description="Holds the work order when a fault stops the line."
  checked={hold} onChange={e => setHold(e.target.checked)} />
<Switch size="sm" aria-label="Follow live data" checked={live} onChange={onLive} />
```

Label the thing, phrased as its on state ("Auto-hold on fault"), never the action ("Enable
auto-hold"). Because it applies immediately, the flip needs a real result — persist it, and show a
Toast if the write can fail. See `specs/forms/Switch.spec.html`.
