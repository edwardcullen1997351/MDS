A text field with a calendar — not a calendar with a field. Operators type dates faster than any grid can be clicked, so typing is the primary path and the panel answers "which Tuesday was that".

```jsx
// Single date. The value is an ISO string, never a Date.
<Field label="Downtime date" htmlFor="dt">
  <DatePicker value={date} onChange={setDate} max={todayIso} />
</Field>

// Range: two fields, one panel, ends swap if picked out of order.
<DatePicker range value={[from, to]} onChange={setRange} label="Shift window"
  presets={[
    { label: 'Today',       value: [today, today] },
    { label: 'Last 7 days', value: [weekAgo, today] },
    { label: 'This month',  value: [monthStart, today] },
  ]} />
```

`value` is `'YYYY-MM-DD'` — never a `Date`. A Date is a timestamp with a timezone, and local-midnight → `toISOString()` files a date against the previous day everywhere west of Greenwich.

Typed entry accepts ISO, compact ISO (`20260905`), `today` and `yesterday`. **Slash formats are refused**: `05/09/2026` is two different days depending on the reader, and display is ISO in the mono face for the same reason.

Keyboard is the APG grid: `↓` from the field opens the panel, arrows move a day, `PageUp`/`PageDown` a month (`Shift` a year), `Home`/`End` the month ends, `Enter` selects, `Esc` closes and returns focus. One tab stop for the whole grid.

No time-of-day, no `Date` objects, no locale-formatted display, and no native `<input type="date">` (its picker can't do ranges, presets or disabled dates, and formats to the OS locale). Wrap it in a `Field` for its label, hint and error.
