import React from 'react';
import { Box } from '../primitives/Box.jsx';
import { Text } from '../primitives/Text.jsx';
import { Icon } from '../core/Icon.jsx';
import { DatePicker } from '../forms/DatePicker.jsx';
import { TimeField } from '../forms/TimeField.jsx';
import { FieldContext } from '../forms/Field.jsx';
import { parseIso } from '../forms/date.js';
import { parseHm } from '../forms/time.js';
import { isZone, zoneParts, instantFrom, zoneAbbr } from '../forms/zone.js';

/* One temporal value, assembled from a date and a wall-clock time.

   The composite owns assembly and disassembly, partial-value behaviour,
   combined validation, ordering, group naming and serialization. DatePicker
   still owns date selection; TimeField still owns time entry. See the
   DateTimePicker spec, §01.

   TWO MODES, and the difference is whose clock:

   · An INSTANT (`zone` given). The value is a UTC ISO instant ending in Z,
     stored in UTC and edited in the SITE's zone with the zone named beside
     the field — exactly what the principles require of an instant (Dates,
     times and timezones). Conversion is real, via components/forms/zone.js.
     Never the browser's zone: the record belongs to the Site, and a fault at
     04:12 IST on the Chennai line read from a Chicago browser must not
     become 17:42 the day before.

   · A FLOATING wall clock (no `zone`). The value is a local
     'YYYY-MM-DDTHH:mm' with no offset, for a moment that genuinely has no
     zone yet: a shift template, a recurring cut-off. Not an instant, and it
     never pretends to be one — the principles' "no local option" is a rule
     about instants, and this mode is the honest way to say the value is not
     one. */

const LOCAL = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}))?/;
const MIN_ROW = { sm: 300, md: 330, lg: 360 };

const splitLocal = (v) => {
  if (v == null) return { date: undefined, time: undefined };
  if (typeof v === 'object') return { date: v.date || undefined, time: v.time || undefined };
  const m = String(v).match(LOCAL);
  return m ? { date: m[1], time: m[2] } : { date: undefined, time: undefined };
};
const isInstant = (v) => typeof v === 'string' && /Z$/.test(v);

export function DateTimePicker({
  label,
  value,
  onChange,
  zone,
  dateLabel = 'Date',
  timeLabel = 'Time',
  min,
  max,
  allowPartial = false,
  step = 1,
  error,
  hint,
  dateHint,
  timeHint,
  layout = 'auto',
  size = 'md',
  disabled = false,
  readOnly = false,
  clearable = true,
  weekStartsOn = 1,
  isDateDisabled,
  onValidityChange,
  style,
  ...rest
}) {
  const field = React.useContext(FieldContext);
  const uid = React.useId();
  React.useEffect(() => { field?.claimGroup?.(); }, [field]);
  const dateId = `${uid}-d`;
  const timeId = `${uid}-t`;
  const hintId = `${uid}-hint`;
  const errId = `${uid}-err`;
  const noteId = `${uid}-note`;
  const dateHintId = `${uid}-d-hint`;
  const timeHintId = `${uid}-t-hint`;

  const zoned = !!zone && isZone(zone);

  if (zone && !zoned) {
    console.warn(`[Meridian] DateTimePicker: zone ${JSON.stringify(zone)} is not an IANA zone this platform knows ("Asia/Kolkata", "America/Chicago"). An abbreviation like "IST" is a LABEL, not a zone — India, Ireland and Israel all use it. Falling back to a floating wall-clock value with no zone.`);
  }
  if (isInstant(value) && !zoned) {
    console.warn(`[Meridian] DateTimePicker: value ${JSON.stringify(value)} is a UTC instant but no valid \`zone\` was given, so there is no clock to show it on. Pass the record's Site zone; without one this control edits a floating wall clock.`);
  }
  if (!isInstant(value) && value != null && zoned) {
    console.warn(`[Meridian] DateTimePicker: with \`zone\` set the value is a UTC instant ending in Z. Got ${JSON.stringify(value)} — a wall clock with no offset, which cannot be placed on a timeline.`);
  }
  if (value != null && !isInstant(value) && typeof value !== 'object' && !LOCAL.test(String(value))) {
    console.warn(`[Meridian] DateTimePicker: value ${JSON.stringify(value)} is neither an instant, 'YYYY-MM-DDTHH:mm', nor { date, time }.`);
  }
  if (!label && !field) {
    console.warn('[Meridian] DateTimePicker: no `label`. It names the moment as a whole ("Fault occurred"); the halves are named by their own labels. Without it the group is unnamed and two of these on one form are told apart only by reading their fields.');
  }

  /* ── Disassembly. The wall clock the user edits. ─────────────────────── */
  const shownParts = zoned && isInstant(value) ? zoneParts(value, zone) : splitLocal(value);
  const [pending, setPending] = React.useState({});
  /* An instant cannot hold a half-entered value — there is no instant for
     "the 14th, no time yet" — so a partial entry lives here until it is
     whole. Cleared as soon as the value round-trips to the same clock. */
  const date = pending.date !== undefined ? pending.date : shownParts.date;
  const time = pending.time !== undefined ? pending.time : shownParts.time;

  const abbr = zoned ? zoneAbbr(zone, isInstant(value) ? value : undefined) : undefined;

  /* ── Assembly, with the two facts a wall clock cannot carry. ─────────── */
  const built = zoned ? instantFrom(date, time, zone) : { instant: undefined, shifted: false, ambiguous: false };

  /* ── Combined validity. The reason the composite exists. ────────────── */
  const complete = !!date && !!time;
  const malformedDate = !!date && !parseIso(date);
  const malformedTime = !!time && !parseHm(time);
  const partial = !allowPartial && (!!date !== !!time);

  /* Bounds are expressed and compared on the SITE's clock, at whatever
     precision they were given: a date-only max means the END of that day,
     not midnight at its start. A 'YYYY-MM-DDTHH:mm' string sorts
     chronologically as it sorts lexicographically, which is the one thing
     this format buys. An instant bound is first read onto the same clock. */
  const asWall = (b, endOfDay) => {
    if (b == null) return undefined;
    const p = isInstant(b) && zoned ? zoneParts(b, zone) : splitLocal(b);
    if (!p.date) return undefined;
    return { date: p.date, full: `${p.date}T${p.time || (endOfDay ? '23:59' : '00:00')}` };
  };
  const lo = asWall(min, false);
  const hi = asWall(max, true);
  const wall = complete ? `${date}T${time}` : undefined;
  const below = !!wall && !!lo && wall < lo.full;
  const above = !!wall && !!hi && wall > hi.full;
  const dateOutside = !!date && !malformedDate && ((lo && date < lo.date) || (hi && date > hi.date));

  const reason = malformedDate || malformedTime ? 'malformed'
    : built.shifted ? 'nonexistent'
      : dateOutside || below || above ? 'bounds'
        : partial ? 'partial' : null;
  const valid = !reason && !field?.invalid;

  /* A missing half is not announced while the user is on their way to it.
     Everything else concerns a value already committed, so it does not
     wait. */
  const [touched, setTouched] = React.useState({ date: false, time: false });
  const blurred = (which) => (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setTouched((t) => (t[which] ? t : { ...t, [which]: true }));
  };
  const partialShown = partial && (date ? touched.time : touched.date);
  const shown = reason === 'partial' ? (partialShown ? 'partial' : null) : reason;

  const message = error
    || (shown === 'malformed' ? `${malformedDate ? dateLabel : timeLabel} is not a valid ${malformedDate ? 'date' : 'time'}.` : null)
    || (shown === 'nonexistent' ? `${time} does not exist on ${date} in ${abbr || zone} — the clock moves forward through that hour. Choose a time on either side of it.` : null)
    || (shown === 'bounds' ? `Must be between ${lo ? lo.full.replace('T', ' ') : '—'} and ${hi ? hi.full.replace('T', ' ') : '—'}${abbr ? ` ${abbr}` : ''}.` : null)
    || (shown === 'partial' ? `Both ${dateLabel.toLowerCase()} and ${timeLabel.toLowerCase()} are required — neither half is assumed.` : null);

  /* Not an error: the clock genuinely shows this time twice, the earlier of
     the two is used, and the user is told which. Silence here would file the
     record an hour out with nothing on screen to explain it. */
  const note = !message && built.ambiguous
    ? `${time} occurs twice on ${date} in ${abbr || zone} — the clock moves back through that hour. The first occurrence is used.`
    : null;

  const dateInvalid = !!field?.invalid || !!error || malformedDate || dateOutside || below || above || built.shifted || (partialShown && !date);
  const timeInvalid = !!field?.invalid || !!error || malformedTime || below || above || built.shifted || (partialShown && !time);

  const changed = React.useRef();
  React.useEffect(() => {
    const key = `${valid}|${reason || ''}`;
    if (changed.current === key) return;
    changed.current = key;
    onValidityChange?.({ valid, reason, complete });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [valid, reason, complete]);

  /* Time bounds bind only on a boundary day: a window opening at 09:00 on
     the 1st must not forbid 08:00 on the 14th. */
  const timeMin = date && lo && lo.date === date ? lo.full.slice(11) : undefined;
  const timeMax = date && hi && hi.date === date ? hi.full.slice(11) : undefined;

  const emit = (nextDate, nextTime) => {
    /* Nothing is inferred. A date with no time does NOT become midnight and a
       time with no date does not become today: both are real answers a user
       might mean, and guessing writes a value nobody entered. */
    const whole = !!nextDate && !!nextTime;
    const parts = { date: nextDate, time: nextTime, complete: whole, zone: zoned ? zone : undefined };
    if (!zoned) {
      setPending(whole ? {} : { date: nextDate, time: nextTime });
      onChange?.(whole ? `${nextDate}T${nextTime}` : undefined, parts);
      return;
    }
    const b = whole ? instantFrom(nextDate, nextTime, zone) : { instant: undefined, shifted: false, ambiguous: false };
    /* The typed pair is retained whenever nothing was emitted — not only
       while it is incomplete, but also when the clock time DOES NOT EXIST.
       Clearing it there was a silent-acceptance bug: with no instant to
       emit, `value` never changes, so the halves fell back to the previous
       instant, the composite recomputed `shifted` from that reverted pair as
       false, and the entry survived only inside TimeField's own text — no
       alert, no aria-invalid, and the record left an hour from where the
       operator wrote it. Pending is cleared only by a successful assembly. */
    const emitted = whole && !b.shifted ? b.instant : undefined;
    setPending(emitted ? {} : { date: nextDate, time: nextTime });
    onChange?.(emitted, { ...parts, shifted: b.shifted, ambiguous: b.ambiguous });
  };

  const stacked = layout === 'stacked';
  const rowStyle = stacked
    ? { display: 'flex', flexDirection: 'column', gap: 'var(--date-time-gap)', minWidth: 0 }
    : {
      display: 'flex', flexDirection: 'row',
      flexWrap: layout === 'inline' ? 'nowrap' : 'wrap',
      alignItems: 'flex-start', gap: 'var(--date-time-gap)', minWidth: 0,
    };
  /* The date needs more room than the time, and the ratio is what keeps a
     wrapped row reading as one value rather than two equal fields. */
  const col = (grow) => (stacked || layout === 'inline'
    ? { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0, flex: `${grow} 1 0` }
    : {
      display: 'flex', flexDirection: 'column', gap: 'var(--space-1)',
      flex: `${grow} 1 ${Math.round((MIN_ROW[size] || MIN_ROW.md) * (grow === 3 ? 0.58 : 0.34))}px`,
      minWidth: `min(100%, ${grow === 3 ? 168 : 116}px)`,
    });

  const describedBy = (own) => [field?.describedBy, hint ? hintId : null, own, note ? noteId : null, message ? errId : null].filter(Boolean).join(' ') || undefined;

  const dateCtx = React.useMemo(
    () => ({ id: dateId, describedBy: describedBy(dateHint ? dateHintId : null), invalid: dateInvalid, required: !!field?.required }),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [dateId, field?.describedBy, field?.required, hint, dateHint, dateInvalid, message, note],
  );
  const timeCtx = React.useMemo(
    () => ({ id: timeId, describedBy: describedBy(timeHint ? timeHintId : null), invalid: timeInvalid, required: !!field?.required }),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [timeId, field?.describedBy, field?.required, hint, timeHint, timeInvalid, message, note],
  );

  return (
    <Box
      role="group"
      aria-label={!field && label ? label : undefined}
      aria-labelledby={field?.labelId}
      {...rest}
      display="flex"
      style={{ flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0, ...style }}
    >
      {label && !field ? (
        <Text size="xs" weight="medium" style={{ color: 'var(--field-label-text)' }}>{label}</Text>
      ) : null}
      {/* DOM order is date then time, in every arrangement — the order the
          value is written and read in. No `order`, no `row-reverse`. */}
      <div style={rowStyle}>
        <div style={col(3)} onBlur={blurred('date')}>
          <Text as="label" htmlFor={dateId} size="xs" weight="medium" style={{ color: 'var(--field-label-text)' }}>{dateLabel}</Text>
          <FieldContext.Provider value={dateCtx}>
            <DatePicker
              label={[label, dateLabel].filter(Boolean).join(' ')}
              value={date}
              onChange={(iso) => emit(iso, time)}
              min={lo?.date}
              max={hi?.date}
              isDateDisabled={isDateDisabled}
              weekStartsOn={weekStartsOn}
              size={size}
              disabled={disabled}
              readOnly={readOnly}
              clearable={clearable}
            />
          </FieldContext.Provider>
          {dateHint ? <Text id={dateHintId} size="xs" tone="tertiary" measure="hint">{dateHint}</Text> : null}
        </div>
        <div style={col(2)} onBlur={blurred('time')}>
          <Text as="label" htmlFor={timeId} size="xs" weight="medium" style={{ color: 'var(--field-label-text)' }}>{timeLabel}</Text>
          <FieldContext.Provider value={timeCtx}>
            <TimeField
              value={time}
              onChange={(hm) => emit(date, hm)}
              min={timeMin}
              max={timeMax}
              step={step}
              /* The abbreviation is derived from the zone AT THIS INSTANT, so
                 a summer and a winter value read differently. A fixed label
                 is wrong half the year. */
              zone={abbr}
              size={size}
              disabled={disabled}
              readOnly={readOnly}
              clearable={clearable}
            />
          </FieldContext.Provider>
          {timeHint ? <Text id={timeHintId} size="xs" tone="tertiary" measure="hint">{timeHint}</Text> : null}
        </div>
      </div>
      {hint ? <Text id={hintId} size="xs" tone="tertiary" measure="hint">{hint}</Text> : null}
      {note ? <Text id={noteId} size="xs" tone="tertiary" measure="hint">{note}</Text> : null}
      {/* Always mounted: a live region inserted together with its text is
          announced unreliably. Combined failures live here, under both
          halves, because the failure belongs to the value. */}
      <span id={errId} role="alert" style={message ? { display: 'flex', alignItems: 'flex-start', gap: 'var(--field-message-gap)', fontSize: 'var(--text-xs)', color: 'var(--field-error-text)' } : { display: 'none' }}>
        {message ? <><Icon name="circle-alert" size="xs" aria-hidden="true" style={{ flex: 'none', marginTop: 2 }} />{message}</> : null}
      </span>
    </Box>
  );
}
