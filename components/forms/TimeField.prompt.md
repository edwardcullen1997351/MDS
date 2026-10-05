A wall-clock time as two integers, in an `'HH:mm'` string. 24-hour, always — typed, not picked from a list.

```jsx
// Alone: a shift start, a cutoff, a scheduled stop.
<Field label="Planned stop" hint="Site time."><TimeField value={t} onChange={setT} zone="CET" /></Field>

// Composed with DatePicker for an instant. Two strings, one product decision.
<Field label="Stopped at" hint="Site time (CET).">
  <Stack direction="row" gap="8">
    <DatePicker value={date} onChange={setDate} />
    <TimeField value={time} onChange={setTime} step={5} zone="CET" />
  </Stack>
</Field>
// the product builds the instant: instantFrom(date, time, site.timezone)
```

Typing accepts `04:12`, `4:12`, `412`, `1412`, `14`, `4.12` and `now`, and normalises on **blur** — never mid-keystroke, which would move the caret under the typist. `↑`/`↓` move by `step` (snapped to its grid), `PageUp`/`PageDown` by an hour; steps **clamp** at midnight rather than wrapping, because 23:50 + 20 min is the next day and this field has no date to say so. `Home`/`End` are deliberately unbound — in a text input they move the caret.

`zone` labels, it never converts: a time with no date has no offset. Get the value from the record's Site (`Design Principles.md` → Dates, times and timezones), never from the browser.

No AM/PM (12:00 am is midnight or noon depending on the reader), no seconds, no dropdown of times (96 rows to pick 04:15 is slower than typing it — a fixed set of shift starts is a `Select`), and no spinner buttons (stacked arrows in a 34px control are a ~16px target).
