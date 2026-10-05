import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
import { FieldContext } from './Field.jsx';
import { parseHm, parseTypedTime, toHm, stepFrom, minutesOf, nowHm, spokenTime } from './time.js';

/* TimeField — a wall-clock time as two integers, in an 'HH:mm' string.

   It exists because fusing time into DatePicker would have changed that
   component's value TYPE on a boolean: '2026-09-05' and
   '2026-09-05T04:12:00Z' are different things, and every consumer's form
   model, validation and API call would change shape with the flag. Kept
   apart, both halves stay honest strings and the PRODUCT builds the instant
   from them plus the Site's timezone — which is the only place that decision
   can correctly be made (Design Principles → Dates, times and timezones).

   24-hour, always. AM/PM is refused: 12:00 am is midnight to some readers
   and noon to others, and a plant whose shifts turn at 06:00, 14:00 and
   22:00 has no use for a convention that needs a suffix to be unambiguous.

   `zone` LABELS, it never converts. A time with no date has no offset to
   convert with; the label is there because the principles require a zone
   wherever a time is absolute, and its value comes from the record's Site.

   There is no dropdown of times, no spinner buttons and no seconds — §04,
   §12 and §13 each carry the reason. Notably no steppers: a pair of stacked
   arrow buttons in a 34px control is a ~16px target, which is the 2.5.8
   failure DatePicker's clear button shipped with, and the keyboard already
   does the job better. */

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };
const PX = { sm: 'var(--control-px-sm)', md: 'var(--control-px-md)', lg: 'var(--control-px-lg)' };
const TS = { sm: 'var(--text-xs)', md: 'var(--text-sm)', lg: 'var(--text-lg)' };

export function TimeField({
  value,
  onChange,
  step = 1,
  min,
  max,
  zone,
  size = 'md',
  disabled = false,
  readOnly = false,
  clearable = true,
  label,
  placeholder = 'HH:MM',
  style,
  ...rest
}) {
  const field = React.useContext(FieldContext);
  const uid = React.useId();
  const [text, setText] = React.useState(value || '');
  const inputRef = React.useRef(null);
  const [focus, setFocus] = React.useState(false);

  /* The sync-back exists for ONE case: an externally changed value — a
     preset, a form reset, a saved view — reaching the display. So it fires
     only when `value` actually differs from the last value we saw, and the
     focus guard lives in a ref rather than in the dependency list.

     Both details are paid for. Letting it run during editing made 3–4 digit
     entry impossible (commit-on-parse changed `value`, the effect rewrote
     the input, React reset the caret to the end, and the next digit appended
     to the normalised string: typing 1400 showed "01:00400" and committed
     01:00). Guarding on `focus` as a DEPENDENCY then moved the bug rather
     than fixing it — the effect re-ran on the blur transition and overwrote
     the text with `value`, so unparseable input was silently discarded:
     typing 9999 for 09:59 emptied the field with no error and nothing for
     the form to validate, because `value` had never changed. */
  const focusRef = React.useRef(false);
  const lastValue = React.useRef(value);
  React.useEffect(() => {
    if (value === lastValue.current) return;
    lastValue.current = value;
    if (!focusRef.current) setText(value || '');
  }, [value]);

  if (!label && !field && rest['aria-label'] == null && rest['aria-labelledby'] == null) {
    console.warn('[Meridian] TimeField: no accessible name. Wrap it in a `Field` or pass `label` — "HH:MM" is a format, not a question, and a placeholder is not a label.');
  }
  if (value && !parseHm(value)) {
    console.warn(`[Meridian] TimeField: value ${JSON.stringify(value)} is not "HH:mm". A time is two integers in a string — not a Date, not minutes since midnight, not "4:12 pm".`);
  }
  if (min && max && minutesOf(min) > minutesOf(max)) {
    console.warn(`[Meridian] TimeField: min (${min}) is after max (${max}), so no time is acceptable. A window that crosses midnight cannot be expressed by a field with no date — validate the pair in the form.`);
  }

  const off = disabled || field?.disabled;
  const invalid = field?.invalid;
  const bounds = { min, max };

  const commit = (hm) => { if (onChange && hm !== value) onChange(hm); };

  const onTyped = (e) => {
    const raw = e.target.value;
    setText(raw);
    if (!raw) { commit(undefined); return; }
    const p = parseTypedTime(raw, nowHm());
    /* Parsed on every keystroke, committed only when it resolves — so "04:"
       mid-edit never clears the value being edited. Same rule as DatePicker.

       EXCEPT a bare one- or two-digit number, which is deferred to blur: it
       parses as a whole hour, so the first keystroke of "1400" would commit
       01:00 and hand the form a time the user never meant to enter. Two or
       fewer digits and no separator is an unfinished entry, not an hour. */
    const bareHour = /^\d{1,2}$/.test(raw.trim());
    if (p && !bareHour) commit(toHm(p.h, p.m));
  };

  /* Normalised on BLUR, not while typing: rewriting "412" to "04:12" under a
     cursor that is still mid-number moves the caret and fights the typist. */
  const onBlur = () => {
    focusRef.current = false;
    setFocus(false);
    if (!text) return;
    const p = parseTypedTime(text, nowHm());
    /* Commits as well as normalises: a bare hour is deliberately not
       committed while typing (see onTyped), so blur is where "14" becomes
       14:00 in the form as well as on screen. Without this the deferral
       would swallow the entry instead of delaying it. */
    /* Unparseable text is LEFT AS TYPED. Nothing overwrites it — the sync
       effect only fires on an external value change — so the operator can
       see and correct what they typed, and the form can say what is wrong.
       Silently emptying the field is the one outcome this must never have. */
    if (p) { setText(toHm(p.h, p.m)); commit(toHm(p.h, p.m)); }
  };

  const nudge = (dir) => {
    if (off || readOnly) return;
    const base = parseHm(value) ? value : (min || nowHm());
    const next = parseHm(value) ? stepFrom(value, dir, step, bounds) : base;
    setText(next);
    commit(next);
  };

  return (
    <div
      {...rest}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        height: H[size] || H.md,
        padding: `0 ${PX[size] || PX.md}`,
        background: off ? 'var(--input-background-disabled)' : readOnly ? 'var(--surface-sunken)' : 'var(--input-background)',
        border: `var(--border-width) solid ${invalid ? 'var(--input-border-invalid)' : focus ? 'var(--input-border-focus)' : 'var(--input-border)'}`,
        borderRadius: 'var(--input-radius)',
        boxShadow: focus ? (invalid ? 'var(--input-focus-ring-invalid)' : 'var(--input-focus-ring)') : 'none',
        transition: 'var(--transition-control)',
        minWidth: 0,
        ...style,
      }}
    >
      <input
        ref={inputRef}
        id={field?.id || `${uid}-time`}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        value={text}
        placeholder={placeholder}
        disabled={off}
        readOnly={readOnly}
        aria-label={label ? undefined : rest['aria-label']}
        aria-describedby={field?.describedBy}
        aria-invalid={invalid || undefined}
        aria-required={field?.required || undefined}
        /* The typed text is the value, so what is announced on focus is what
           is on screen. The spoken form goes on the live update below rather
           than into the name, which would make the field announce a value it
           is not showing. */
        onChange={onTyped}
        onFocus={() => { focusRef.current = true; setFocus(true); }}
        onBlur={onBlur}
        onKeyDown={(e) => {
          /* Home and End are deliberately NOT bound: in a text input they
             move the caret, and hijacking them would break editing to save a
             keystroke. DatePicker binds them because a grid cell has no
             caret to move. */
          if (e.key === 'ArrowUp') { e.preventDefault(); nudge(1); }
          else if (e.key === 'ArrowDown') { e.preventDefault(); nudge(-1); }
          else if (e.key === 'PageUp') { e.preventDefault(); if (parseHm(value)) { const n = stepFrom(value, 1, 60, bounds); setText(n); commit(n); } }
          else if (e.key === 'PageDown') { e.preventDefault(); if (parseHm(value)) { const n = stepFrom(value, -1, 60, bounds); setText(n); commit(n); } }
        }}
        style={{
          flex: 1,
          /* 5ch, not 0. The input is a zero-basis flex item, so with a zone
             label and a clear button beside it — 98px of a 120px box once
             padding and gaps are counted — min-width: 0 let it shrink to
             28px for a value needing 43px, and the field CLIPPED the time it
             exists to show. A control may shrink to its content, never
             below it: five mono characters is exactly "HH:MM". */
          minWidth: '5ch', width: '100%', border: 0, outline: 'none', background: 'transparent',
          fontFamily: 'var(--font-mono)', fontSize: TS[size] || TS.md,
          fontVariantNumeric: 'tabular-nums', letterSpacing: 'var(--tracking-mono)',
          color: off ? 'var(--input-text-disabled)' : 'var(--input-text)',
        }}
      />
      {/* Announced when the arrows change the value, because a nudge moves
          the text without a keystroke the reader can infer. */}
      <span aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
        {parseHm(value) ? spokenTime(value) : ''}
      </span>
      {zone && (
        <span
          /* Part of the field's own reading, not decoration: a time without
             its zone is the ambiguity the principles forbid. */
          style={{ flex: 'none', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', letterSpacing: 'var(--tracking-caps)' }}
        >{zone}</span>
      )}
      {clearable && !off && !readOnly && text && (
        <IconButton
          icon="x" size="sm" variant="ghost" label="Clear time"
          onClick={() => { setText(''); commit(undefined); inputRef.current?.focus(); }}
          style={{ flex: 'none' }}
        />
      )}
    </div>
  );
}
