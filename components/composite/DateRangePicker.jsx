import React from 'react';
import { Box } from '../primitives/Box.jsx';
import { Text } from '../primitives/Text.jsx';
import { Icon } from '../core/Icon.jsx';
import { DatePicker } from '../forms/DatePicker.jsx';
import { FieldContext } from '../forms/Field.jsx';
import { parseIso } from '../forms/date.js';

/* Two dates that mean ONE bounded interval. The composite owns the
   relationship the two pickers cannot see from inside themselves: one range
   value, ordering, cross-field validation, per-endpoint identity and
   validation association, derived bounds, and an arrangement that may stack
   without ever reordering time. Each DatePicker keeps its own typing, its own
   panel and its own keyboard. See the DateRangePicker spec, §01.

   NOT `DatePicker range` — that is ONE control with one shared panel, an
   unlabelled arrow between two inputs and ends that silently swap. It is
   right for "pick a window on a calendar" and wrong for a form that must
   name, constrain, validate and describe each endpoint separately (§01). */

/* A column narrower than this clips 'YYYY-MM-DD' plus the clear and calendar
   buttons, which is when `auto` stops trying to stay on one line. */
const MIN_COL = { sm: 176, md: 192, lg: 208 };

export function DateRangePicker({
  label,
  value,
  onChange,
  startLabel = 'Start',
  endLabel = 'End',
  min,
  max,
  constrain = true,
  allowPartial = false,
  error,
  hint,
  startHint,
  endHint,
  layout = 'auto',
  size = 'md',
  disabled = false,
  readOnly = false,
  clearable = true,
  weekStartsOn = 1,
  isDateDisabled,
  onValidityChange,
  presets,
  style,
  ...rest
}) {
  const field = React.useContext(FieldContext);
  const uid = React.useId();
  /* Both endpoints get their OWN id, from one scope. Borrowing the Field's id
     for the start input made the Field's <label> a SECOND label on it —
     announced as "Shift period First shift" against a partner announced as
     just "Last shift". Instead the group is named by the Field's label
     through aria-labelledby, and the Field is told to stop aiming its
     `htmlFor` at a single control (§08, §13). */
  React.useEffect(() => { field?.claimGroup?.(); }, [field]);
  const startId = `${uid}-s`;
  const endId = `${uid}-e`;
  const hintId = `${uid}-hint`;
  const errId = `${uid}-err`;
  const startHintId = `${uid}-s-hint`;
  const endHintId = `${uid}-e-hint`;

  const pair = Array.isArray(value) ? value : [undefined, undefined];
  const start = pair[0] || undefined;
  const end = pair[1] || undefined;

  /* With `allowPartial` false by default, a missing endpoint must not be
     announced while the user is still on their way to it: entry is
     sequential, and a form that reddens between two keystrokes teaches
     people to ignore it. An endpoint counts as answerable once it has been
     visited and left, or once the other end is filled and this one is not
     where the caret is. Ordering and bounds failures do not wait — those are
     about a value the user has already committed. */
  const [touched, setTouched] = React.useState({ start: false, end: false });
  /* Only a blur that leaves the endpoint entirely counts — moving from the
     input to its own calendar button, or into its panel, is still the user
     working on that endpoint. */
  const blurred = (which) => (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setTouched((t) => (t[which] ? t : { ...t, [which]: true }));
  };

  if (value != null && !Array.isArray(value)) {
    console.warn('[Meridian] DateRangePicker: `value` is one range, expressed as [start, end] — the same pair shape `DatePicker range` emits. A single string cannot say which endpoint it is.');
  }
  if (!label && !field) {
    console.warn('[Meridian] DateRangePicker: no `label`. It names the range as a whole ("Report window"); the two endpoints are named by their own visible labels. Without it the group is unnamed, and two ranges on one form are told apart only by reading their fields.');
  }
  if (min && max && min > max) {
    console.warn(`[Meridian] DateRangePicker: min (${min}) is after max (${max}), so no valid range exists and both panels offer nothing.`);
  }
  if (presets) {
    console.warn('[Meridian] DateRangePicker: `presets` is not supported here. A preset sets BOTH endpoints at once, which belongs to a control with one shared panel — use `DatePicker range presets={…}`. This composite is two separately named, separately validated fields.');
  }

  /* ── The relationship. This is the whole reason the composite exists. ── */
  const outOfOrder = !!start && !!end && end < start;
  const malformed = (iso) => !!iso && !parseIso(iso);
  const outside = (iso) => !!iso && !malformed(iso) && ((min && iso < min) || (max && iso > max));
  const startBad = malformed(start) || outside(start);
  const endBad = malformed(end) || outside(end);
  const partial = !allowPartial && (!!start !== !!end);
  /* The gate reports the truth immediately; only the visible message waits to
     be earned (§06) — a submit button must not depend on where the caret has
     been. */
  const partialShown = partial && (start ? touched.end : touched.start);

  /* Ordering first: an inverted pair is the failure that makes the other two
     unreadable. Bounds next, because they name a specific endpoint. */
  const reason = outOfOrder ? 'order' : startBad || endBad ? 'bounds' : partial ? 'partial' : null;
  const valid = !reason && !field?.invalid;
  /* What is drawn: identical to `reason` except that a partial range stays
     quiet until its empty endpoint has been visited and left. */
  const shown = outOfOrder ? 'order' : startBad || endBad ? 'bounds' : partialShown ? 'partial' : null;

  const message = error
    || (shown === 'order' ? `${endLabel} must be on or after ${startLabel.toLowerCase()}.` : null)
    || (shown === 'bounds' ? `${startBad ? startLabel : endLabel} must be${min ? ` on or after ${min}` : ''}${min && max ? ' and' : ''}${max ? ` on or before ${max}` : ''}.` : null)
    || (shown === 'partial' ? `Both ${startLabel.toLowerCase()} and ${endLabel.toLowerCase()} are required — a half-open range is not accepted here.` : null);

  /* Only the implicated endpoint is marked. An ordering failure implicates
     BOTH, because the fault is the relationship rather than either value. */
  const startInvalid = !!field?.invalid || !!error || outOfOrder || startBad || (partialShown && !start);
  const endInvalid = !!field?.invalid || !!error || outOfOrder || endBad || (partialShown && !end);

  const changed = React.useRef();
  React.useEffect(() => {
    const key = `${valid}|${reason || ''}`;
    if (changed.current === key) return;
    changed.current = key;
    onValidityChange?.({ valid, reason });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [valid, reason]);

  /* Each endpoint's bounds are the outer bounds tightened by the OTHER
     endpoint — so the panel cannot produce an inverted range in the first
     place. Withdrawn while the pair is already inverted: constraints derived
     from a broken value would pin the user inside the error with no day left
     to click. */
  const cross = constrain && !outOfOrder;
  const startMax = cross && end ? (max && max < end ? max : end) : max;
  const endMin = cross && start ? (min && min > start ? min : start) : min;

  const emit = (next) => {
    /* Endpoints are never swapped. `DatePicker range` swaps, correctly: one
       panel, two presses, and the second click means "the other end". Here
       each endpoint is a separately named field the user typed into on
       purpose, and moving their entry to the other field is a silent edit of
       something they did not touch. The pair is reported invalid instead. */
    onChange?.(next);
  };

  const stacked = layout === 'stacked';
  const rowStyle = stacked
    ? { display: 'flex', flexDirection: 'column', gap: 'var(--date-range-gap)', minWidth: 0 }
    : {
      display: 'flex',
      flexDirection: 'row',
      /* `auto` wraps to a column when a side can no longer hold a whole
         date; `inline` is a promise the caller made about its container. */
      flexWrap: layout === 'inline' ? 'nowrap' : 'wrap',
      alignItems: 'flex-start',
      gap: 'var(--date-range-gap)',
      minWidth: 0,
    };
  const colStyle = stacked || layout === 'inline'
    ? { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0, flex: '1 1 0' }
    : {
      display: 'flex', flexDirection: 'column', gap: 'var(--space-1)',
      flex: `1 1 ${MIN_COL[size] || MIN_COL.md}px`,
      /* min(), so a container narrower than one column shrinks the field
         instead of overflowing it. */
      minWidth: `min(100%, ${MIN_COL[size] || MIN_COL.md}px)`,
    };

  const describedBy = (own) => [field?.describedBy, hint ? hintId : null, own, message ? errId : null].filter(Boolean).join(' ') || undefined;

  const startCtx = React.useMemo(
    () => ({ id: startId, describedBy: describedBy(startHint ? startHintId : null), invalid: startInvalid, required: !!field?.required }),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [startId, field?.describedBy, field?.required, hint, startHint, startInvalid, message],
  );
  const endCtx = React.useMemo(
    () => ({ id: endId, describedBy: describedBy(endHint ? endHintId : null), invalid: endInvalid, required: !!field?.required }),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [endId, field?.describedBy, field?.required, hint, endHint, endInvalid, message],
  );

  const endpoint = (which) => {
    const isStart = which === 'start';
    return (
      <div style={colStyle} onBlur={blurred(which)}>
        {/* A real <label> for a real input id: the endpoint's identity is in
            its name, never in its position. */}
        <Text as="label" htmlFor={isStart ? startId : endId} size="xs" weight="medium" style={{ color: 'var(--field-label-text)' }}>
          {isStart ? startLabel : endLabel}
        </Text>
        <FieldContext.Provider value={isStart ? startCtx : endCtx}>
          <DatePicker
            /* Named for the CALENDAR BUTTON and the panel dialog, not for the
               input: in single mode with a Field present DatePicker leaves
               the input's name to the <label> above, so this only stops two
               identical "Choose a date" buttons appearing in one group. */
            label={[label, isStart ? startLabel : endLabel].filter(Boolean).join(' ')}
            value={isStart ? start : end}
            onChange={(iso) => emit(isStart ? [iso, end] : [start, iso])}
            min={isStart ? min : endMin}
            max={isStart ? startMax : max}
            isDateDisabled={isDateDisabled}
            weekStartsOn={weekStartsOn}
            size={size}
            disabled={disabled}
            readOnly={readOnly}
            clearable={clearable}
          />
        </FieldContext.Provider>
        {(isStart ? startHint : endHint) ? (
          <Text id={isStart ? startHintId : endHintId} size="xs" tone="tertiary" measure="hint">{isStart ? startHint : endHint}</Text>
        ) : null}
      </div>
    );
  };

  return (
    <Box
      role="group"
      aria-label={!field && label ? label : undefined}
      aria-labelledby={field?.labelId}
      {...rest}
      display="flex"
      style={{ flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0, ...style }}
    >
      {/* Rendered only outside a Field — inside one, the Field's label is
          already the visible heading and `label` is the group's name only. */}
      {label && !field ? (
        <Text size="xs" weight="medium" style={{ color: 'var(--field-label-text)' }}>{label}</Text>
      ) : null}
      {/* DOM order is temporal order, in every arrangement: start, then end.
          No `order`, no `row-reverse`, no visual-only reordering. */}
      <div style={rowStyle}>
        {endpoint('start')}
        {endpoint('end')}
      </div>
      {hint ? <Text id={hintId} size="xs" tone="tertiary" measure="hint">{hint}</Text> : null}
      {/* Permanently mounted, like Field's: a live region inserted together
          with its text is announced unreliably. Range-level messages live
          here, under both fields, because the failure belongs to the pair. */}
      <span id={errId} role="alert" style={message ? { display: 'flex', alignItems: 'flex-start', gap: 'var(--field-message-gap)', fontSize: 'var(--text-xs)', color: 'var(--field-error-text)' } : { display: 'none' }}>
        {message ? <><Icon name="circle-alert" size="xs" aria-hidden="true" style={{ flex: 'none', marginTop: 2 }} />{message}</> : null}
      </span>
    </Box>
  );
}
