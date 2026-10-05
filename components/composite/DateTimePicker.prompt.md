One temporal value assembled from a date and a wall-clock time. Composite: it owns assembly and disassembly, partial-value behaviour, combined validation, group naming and serialization. `DatePicker` keeps date selection, `TimeField` keeps time entry.

```jsx
// An instant. Stored in UTC, edited on the Site's clock, zone named.
const [at, setAt] = React.useState('2026-09-14T07:00:00Z');

<DateTimePicker
  label="Fault occurred"
  zone={site.timezone}            // IANA: 'Asia/Kolkata', never 'IST'
  value={at}
  onChange={(instant) => setAt(instant)}
  min="2026-09-01T06:00"          // on the Site's clock
  step={15}
/>

// A floating wall clock — a shift template, no zone yet.
<DateTimePicker label="Cut-off" value={{ date, time }} onChange={(v, p) => setParts(p)} />
```

**Two modes, and the difference is whose clock.** With `zone` the value is a UTC instant ending in `Z` and the field edits it on the Site's clock — real conversion, never the browser's zone. Without `zone` the value is a local `'YYYY-MM-DDTHH:mm'` that never pretends to be an instant.

The zone shown beside the time tracks the season, not a fixed string: it is derived from the zone *at that instant*. Indian Standard Time reads `UTC+5:30` year-round — half-hour offset included — while a zone with transitions reads differently in summer and winter. A hard-coded label is wrong half the year, and `'IST'` alone is claimed by India, Ireland and Israel.

DST is handled explicitly: a clock time that does not exist (spring forward) is invalid and emits no instant; a time that happens twice (autumn back) uses the earlier occurrence and says so under the field.

`onChange(value, parts)`: `parts` always carries `{date, time, complete, zone, shifted, ambiguous}`. Nothing is inferred — a date with no time does not become midnight. A half-filled value is invalid by default (`allowPartial={false}`), though the message waits until the empty half has been visited and left. `min`/`max` are Site-clock bounds compared at the precision given, and time bounds bind only on a boundary day.
