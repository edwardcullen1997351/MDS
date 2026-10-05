Two dates that mean one bounded interval. Composite: it owns the range value, ordering, cross-field validation, per-endpoint naming and validation association, and bounds on each endpoint derived from the other. Each `DatePicker` keeps its own typing, panel and keyboard.

```jsx
const [range, setRange] = React.useState([undefined, undefined]);

<DateRangePicker
  label="Report window"
  value={range}
  onChange={setRange}
  min="2026-01-01"
  max="2026-12-31"
  hint="Both dates are inclusive. Maximum one calendar year."
/>

// inside a form's Field, which supplies the heading and its own error
<Field label="Shift period" error={formError}>
  <DateRangePicker value={range} onChange={setRange} startHint="First shift of the period" />
</Field>

// a filter, where an open interval is a legitimate intermediate value
<DateRangePicker label="Created between" value={range} onChange={setRange} allowPartial />
```

The value is one pair, `[start, end]`, of ISO `'YYYY-MM-DD'` strings — the shape `DatePicker` already established. Either end may be `undefined`.

Ordering is owned here. `constrain` (default true) derives each endpoint's bounds from the other so a calendar cannot invert the range; a typed or incoming inverted pair is reported as invalid on **both** endpoints instead of being silently swapped. Bounds failures mark only the endpoint at fault. `onValidityChange` gives a form its submit gate.

A half-filled range is invalid by default (`allowPartial={false}`) — but the message waits until the empty endpoint has been visited and left, so the form does not turn red between two keystrokes. Pass `allowPartial` for a surface where an open interval is a legitimate intermediate value (a filter, a saved view).

`hint` is a rule about the interval; `startHint`/`endHint` are rules about one endpoint — the distinction is a content rule, not a convenience.

**Not `DatePicker range`.** That is one control with one shared panel, an unlabelled arrow between two inputs and ends that swap — right for picking a window on a calendar, wrong when each endpoint needs its own name, bounds, hint and error. Presets belong there too, not here.
