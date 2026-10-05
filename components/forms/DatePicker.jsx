import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Button } from '../core/Button.jsx';
import { FieldContext } from './Field.jsx';
import { useAnchor, anchorStyle } from '../core/anchor.js';
import {
  toIso, parseIso, parseTyped, addDays, addMonths, daysInMonth,
  inRange, monthGrid, monthName, weekdayNames, spokenDate, todayIso,
} from './date.js';

/* DatePicker — a TEXT FIELD with a calendar, not a calendar with a field.
   That order is the whole design:

   · An operator entering a downtime date types it faster than any grid can
     be clicked, so typing is the primary path and the panel is the fallback
     for "which Tuesday was that".
   · The value is an ISO 'YYYY-MM-DD' STRING, never a Date. A Date is a
     timestamp with a timezone, and local-midnight → toISOString() is the
     off-by-one that files a shift against the previous day for every user
     west of Greenwich (see date.js).
   · Typed input accepts ISO, compact ISO, `today` and `yesterday` and
     REFUSES slash formats: 05/09/2026 is two different days depending on
     the reader, and a plant running to shift boundaries cannot carry that.
     Display is ISO, mono, for the same reason — it is a machine string, and
     the system's content rules put those in the mono face.

   Not built on <input type="date">: the native picker cannot do ranges,
   presets or disabled dates consistently, cannot be styled at all, and
   formats to the OS locale — which reintroduces exactly the ambiguity the
   ISO decision removes. What the native control gives for free (keyboard,
   announcement) is re-implemented here to the APG dialog+grid pattern, and
   the grid is the part every hand-rolled datepicker gets wrong.

   The panel rides the shared useAnchor engine (fixed, measured, flips once)
   so it works inside a table cell, a card or a drawer with no portal. */

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };
const PX = { sm: 'var(--control-px-sm)', md: 'var(--control-px-md)', lg: 'var(--control-px-lg)' };
const TS = { sm: 'var(--text-xs)', md: 'var(--text-sm)', lg: 'var(--text-lg)' };

export function DatePicker({
  value,
  onChange,
  range = false,
  presets,
  min,
  max,
  isDateDisabled,
  weekStartsOn = 1,
  size = 'md',
  disabled = false,
  readOnly = false,
  clearable = true,
  label,
  placeholder = 'YYYY-MM-DD',
  style,
  ...rest
}) {
  const field = React.useContext(FieldContext);
  const uid = React.useId();
  const today = todayIso();

  const from = range ? (Array.isArray(value) ? value[0] : undefined) : value;
  const to = range ? (Array.isArray(value) ? value[1] : undefined) : undefined;

  if (range && value != null && !Array.isArray(value)) {
    console.warn('[Meridian] DatePicker: `range` needs an array value ([from, to]). A single string cannot say which end it is.');
  }
  if (!range && Array.isArray(value)) {
    console.warn('[Meridian] DatePicker: array `value` without `range`. A single date is one string.');
  }
  if (!label && !field && rest['aria-label'] == null && rest['aria-labelledby'] == null) {
    console.warn('[Meridian] DatePicker: no accessible name. Wrap it in a `Field`, or pass `label` — a date field announces as an unnamed text box, and "YYYY-MM-DD" is a format, not a question.');
  }
  /* A caller's `aria-label` is a NAME, not an attribute to forward, and
     treating it as the latter made the guard above a lie for one build.
     `{...rest}` spread it onto the wrapper <div> below — a generic with no
     role, which per ARIA 1.2 exposes no accessible name at all, so browsers
     drop it. `<DatePicker range aria-label="Report window">` therefore named
     NOTHING while satisfying that guard: the two inputs announced bare "Start
     date"/"End date", which is the "two range pickers on a form are
     indistinguishable" outcome the range warning describes, reached by the
     escape hatch the warning itself offers. The false-reassurance class again,
     and the third time in this component — 1.23.6 on the Field association,
     then `label` with no Field, now this.

     So the two spellings collapse into ONE subject that every composition site
     reads, and the caller's copy is pulled out of the spread so it cannot land
     anywhere inert. `aria-labelledby` cannot be collapsed the same way — it is
     an id, and text cannot be composed from it — so it is forwarded to the
     input in SINGLE mode only, where one input can carry the reference whole.
     Range mode drops it and warns instead: two inputs would each need the
     reference PLUS its own "Start date"/"End date" qualifier, and half a name
     on each is worse than being told to pass `label`. */
  const { 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...spread } = rest;
  const subject = label || ariaLabel;
  if (range && !subject && (field || ariaLabelledBy)) {
    /* The one case composition cannot reach, and it is TWO containers, not one.
       A Field exposes an id, not its label's text or that label's element id;
       `aria-labelledby` is an id by definition. Neither gives this component a
       string, and the two inputs cannot qualify a name they cannot read — they
       would announce bare "Start date" and "End date" with the field's own
       subject discarded, which is the 1.23.6 defect a third time.

       So range mode asks for a subject outright, and DOES NOT forward the
       caller's `aria-labelledby` to the inputs (see the aria-labelledby line
       below, which is single-mode only): half a name on each input is worse
       than the warning, because it looks correct in a quick check. This
       warning is the signal that the reference was dropped.

       The message named only the Field for one build, while the condition
       already covered both — so a caller passing `aria-labelledby` with no
       Field anywhere was told their picker was "inside a `Field`". A guard
       firing on the right condition with the wrong prose is the same drift
       class as a guard that does not fire at all. */
    console.warn('[Meridian] DatePicker: `range` needs a `label` (or `aria-label`) of its own. Each input qualifies itself ("Start date"/"End date"), and an aria-label outranks whatever named the group — but a `Field` association and `aria-labelledby` are both ids, not text, so neither can be composed into the two inputs. Without a subject the field\'s own name is discarded, any `aria-labelledby` you passed is dropped rather than half-applied, and two range pickers on a form are indistinguishable.');
  }
  if (min && max && min > max) {
    console.warn(`[Meridian] DatePicker: min (${min}) is after max (${max}), so every date is disabled and the panel offers nothing.`);
  }

  const [open, setOpen] = React.useState(false);
  /* Which END the next click sets. Range picking is a two-press interaction
     and the component has to say out loud which press it is on. */
  const [editing, setEditing] = React.useState('from');
  const [cursor, setCursor] = React.useState(() => parseIso(from) ? from : today);
  const [text, setText] = React.useState({ from: from || '', to: to || '' });
  const [focused, setFocused] = React.useState(null);

  React.useEffect(() => { setText({ from: from || '', to: to || '' }); }, [from, to]);
  React.useEffect(() => { if (open) setCursor((c) => (parseIso(editing === 'to' ? to : from) ? (editing === 'to' ? to : from) : c)); }, [open, editing, from, to]);

  /* Programmatic focus happens in a POST-COMMIT effect, never in a rAF.
     requestAnimationFrame fires before React commits, so an rAF focus lands
     on the day that is about to be replaced — and that button's onFocus then
     wrote the stale date back into `cursor`, cancelling the move. One arrow
     press cost two presses and focus lagged a press behind. The cursor is
     owned by the key handler and by clicks only; focus follows it here. */
  const wantFocus = React.useRef(false);
  const wrapRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const gridRef = React.useRef(null);
  const fromRef = React.useRef(null);
  const toRef = React.useRef(null);
  const pos = useAnchor(wrapRef, panelRef, { open, side: 'bottom', align: 'start', clampHeight: false });

  React.useEffect(() => {
    if (!open || !wantFocus.current) return;
    /* `pos` is in the deps because the panel is gated on it, and useAnchor
       computes it in its OWN effect — so on the commit that sets open the
       grid does not exist yet. Spending the flag on that pass (the first
       version's bug) meant the FIRST open never moved focus into the grid:
       the documented ↓ route did nothing until the panel had been opened and
       closed once, because only then was a stale `pos` already in state. The
       flag is now cleared only when the node was actually found. */
    const el = gridRef.current?.querySelector('[data-day-focus="true"]');
    if (!el) return;
    wantFocus.current = false;
    /* The cell for the current cursor exists by now: this runs after the
       render that created it. PageDown unmounts the previously focused day,
       which is how focus used to end up on <body>. */
    el.focus();
  }, [open, pos, cursor]);

  const off = disabled || field?.disabled;
  const invalid = field?.invalid;

  const dayOff = (iso) => (min && iso < min) || (max && iso > max) || (isDateDisabled ? !!isDateDisabled(iso) : false);

  const commit = (iso, which) => {
    if (!onChange || dayOff(iso)) return;
    if (!range) { onChange(iso); setOpen(false); fromRef.current?.focus(); return; }
    const end = which || editing;
    let next = end === 'from' ? [iso, to] : [from, iso];
    /* Ends swap rather than being refused: a user who clicks the later day
       first has expressed a range, not an error, and a picker that ignores
       the click makes them guess which order it wanted. */
    if (next[0] && next[1] && next[0] > next[1]) next = [next[1], next[0]];
    onChange(next);
    if (end === 'from') { setEditing('to'); } else { setOpen(false); toRef.current?.focus(); }
  };

  const onTyped = (which) => (e) => {
    const raw = e.target.value;
    setText((t) => ({ ...t, [which]: raw }));
    if (!raw) { onChange?.(range ? (which === 'from' ? [undefined, to] : [from, undefined]) : undefined); return; }
    const parsed = parseTyped(raw, today);
    /* Parsed on every keystroke, committed only when it is a real date, so a
       half-typed "2026-0" never clears the value the user is editing. */
    if (parsed) { const iso = toIso(parsed.y, parsed.m, parsed.d); setCursor(iso); commit(iso, which); }
  };

  const move = (n, unit) => {
    const next = unit === 'month' ? addMonths(cursor, n) : unit === 'year' ? addMonths(cursor, n * 12) : addDays(cursor, n);
    wantFocus.current = true;
    setCursor(next);
  };

  const onGridKey = (e) => {
    const k = e.key;
    const map = { ArrowLeft: [-1, 'day'], ArrowRight: [1, 'day'], ArrowUp: [-7, 'day'], ArrowDown: [7, 'day'] };
    if (map[k]) { e.preventDefault(); move(map[k][0], map[k][1]); return; }
    if (k === 'PageUp') { e.preventDefault(); move(e.shiftKey ? -1 : -1, e.shiftKey ? 'year' : 'month'); return; }
    if (k === 'PageDown') { e.preventDefault(); move(e.shiftKey ? 1 : 1, e.shiftKey ? 'year' : 'month'); return; }
    if (k === 'Home') { e.preventDefault(); const p = parseIso(cursor); wantFocus.current = true; setCursor(toIso(p.y, p.m, 1)); return; }
    if (k === 'End') { e.preventDefault(); const p = parseIso(cursor); wantFocus.current = true; setCursor(toIso(p.y, p.m, daysInMonth(p.y, p.m))); return; }
    if (k === 'Enter' || k === ' ') { e.preventDefault(); commit(cursor); return; }
    if (k === 'Escape') { e.preventDefault(); e.stopPropagation(); setOpen(false); (editing === 'to' ? toRef : fromRef).current?.focus(); }
  };

  /* Outside pointer-down closes. mousedown, not click, for the same reason
     as Dialog's scrim: a selection drag that ends outside must not close a
     panel the user is reading. */
  React.useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrapRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    window.addEventListener('mousedown', onDown, true);
    return () => window.removeEventListener('mousedown', onDown, true);
  }, [open]);

  const openPanel = (which) => {
    if (off || readOnly) return;
    setEditing(which);
    wantFocus.current = true;
    setOpen(true);
  };

  const boxStyle = (active) => ({
    display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
    height: H[size] || H.md,
    padding: `0 ${PX[size] || PX.md}`,
    background: off ? 'var(--input-background-disabled)' : readOnly ? 'var(--surface-sunken)' : 'var(--input-background)',
    border: `var(--border-width) solid ${invalid ? 'var(--input-border-invalid)' : active ? 'var(--input-border-focus)' : 'var(--input-border)'}`,
    borderRadius: 'var(--input-radius)',
    boxShadow: active ? (invalid ? 'var(--input-focus-ring-invalid)' : 'var(--input-focus-ring)') : 'none',
    transition: 'var(--transition-control)',
    minWidth: 0, flex: 1,
  });

  const inputStyle = {
    flex: 1,
    /* 10ch — "YYYY-MM-DD" — for the same reason as TimeField's 5ch: with a
       clear and a calendar button beside it, a zero-basis flex item with
       min-width: 0 shrinks below its own value and clips the date. */
    minWidth: '10ch', border: 0, outline: 'none', background: 'transparent',
    fontFamily: 'var(--font-mono)', fontSize: TS[size] || TS.md,
    fontVariantNumeric: 'tabular-nums', letterSpacing: 'var(--tracking-mono)',
    color: off ? 'var(--input-text-disabled)' : 'var(--input-text)',
  };

  const p = parseIso(cursor) || parseIso(today);
  const cells = monthGrid(p.y, p.m, weekStartsOn);
  const selected = (iso) => iso === from || iso === to;

  const one = (which) => (
    <div style={boxStyle(focused === which || (open && editing === which))}>
      <input
        ref={which === 'from' ? fromRef : toRef}
        id={which === 'from' ? (field?.id || `${uid}-from`) : `${uid}-to`}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        value={text[which]}
        placeholder={placeholder}
        disabled={off}
        readOnly={readOnly}
        /* COMPOSED, not replaced — the RangeSlider 1.23.6 defect, which this
           line had too. In range mode both inputs named themselves "Start
           date"/"End date", and since aria-label outranks the Field's
           association, the field's own name was discarded: two date fields
           on one form both announced "Start date" with no way to tell which.

           And single mode deferred to an association that may not exist. It
           returned `undefined` whenever `label` was truthy, on the assumption
           that a <Field> was wrapping it — but this component renders no
           <label> of its own, so `label` with no Field left the input with NO
           accessible name, while the warning explicitly offers `label` as a
           sufficient alternative and stays silent because it is present. The
           very false-reassurance class this rule was written for, one layer
           down. `label` now names the input directly when no Field is there
           to do it. */
        aria-label={which === 'to' || range
          ? [subject, which === 'to' ? 'End date' : 'Start date'].filter(Boolean).join(' ')
          : field ? undefined
            : subject}
        aria-labelledby={!range && !subject ? ariaLabelledBy : undefined}
        aria-describedby={field?.describedBy}
        aria-invalid={invalid || undefined}
        aria-required={field?.required || undefined}
        onChange={onTyped(which)}
        onFocus={() => setFocused(which)}
        onBlur={() => setFocused(null)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') { e.preventDefault(); openPanel(which); }
          if (e.key === 'Escape' && open) { e.preventDefault(); setOpen(false); }
        }}
        style={inputStyle}
      />
      {clearable && !off && !readOnly && text[which] && (
        <IconButton
          icon="x" size="sm" variant="ghost"
          label={which === 'to' ? 'Clear end date' : 'Clear date'}
          onClick={() => { setText((t) => ({ ...t, [which]: '' })); onChange?.(range ? (which === 'from' ? [undefined, to] : [from, undefined]) : undefined); (which === 'from' ? fromRef : toRef).current?.focus(); }}
          /* No size override: IconButton sm is a 28px box, and the 20px one
             this shipped with was a 20×20 target — below 2.5.8, in the one
             control whose spec claims every target clears it. */
          style={{ flex: 'none' }}
        />
      )}
      <IconButton
        icon="calendar" size="sm" variant="ghost"
        label={[subject, which === 'to' ? 'Choose an end date' : 'Choose a date'].filter(Boolean).join(' — ')}
        aria-expanded={open && editing === which}
        disabled={off || readOnly}
        onClick={() => (open && editing === which ? setOpen(false) : openPanel(which))}
        style={{ flex: 'none' }}
      />
    </div>
  );

  return (
    <div ref={wrapRef} {...spread} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0 }}>
        {one('from')}
        {range && (
          <>
            <Icon name="arrow-right" size="xs" aria-hidden="true" style={{ flex: 'none', color: 'var(--text-tertiary)' }} />
            {one('to')}
          </>
        )}
      </div>

      {open && pos && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={[subject, range ? 'Choose a date range' : 'Choose a date'].filter(Boolean).join(' — ')}
          onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); (editing === 'to' ? toRef : fromRef).current?.focus(); } }}
          style={{
            ...anchorStyle(pos, 'var(--z-dropdown)'),
            display: 'flex',
            background: 'var(--datepicker-panel-background)',
            border: `var(--border-width) solid var(--datepicker-panel-border)`,
            borderRadius: 'var(--datepicker-panel-radius)',
            boxShadow: 'var(--datepicker-panel-shadow)',
            animation: 'var(--anim-drop-in)',
          }}
        >
          {presets?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 'var(--space-2)', borderRight: `var(--border-width) solid var(--datepicker-footer-border)`, minWidth: 132 }}>
              {presets.map((ps) => (
                <Button
                  key={ps.label} variant="ghost" size="sm"
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => {
                    if (!onChange) return;
                    onChange(range ? ps.value : (Array.isArray(ps.value) ? ps.value[0] : ps.value));
                    setCursor(Array.isArray(ps.value) ? ps.value[0] : ps.value);
                    setOpen(false);
                    fromRef.current?.focus();
                  }}
                >{ps.label}</Button>
              ))}
            </div>
          )}

          <div style={{ padding: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
              <IconButton icon="chevron-left" size="sm" label="Previous month" onClick={() => setCursor(addMonths(cursor, -1))} />{/* No wantFocus: the chevron keeps its own focus, and the aria-live header announces the month. */}
              {/* aria-live, so a month changed by button or PageUp is
                  announced — the grid's own label alone changes silently. */}
              <div aria-live="polite" style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--datepicker-header-text)' }}>
                {monthName(p.m)} {p.y}
              </div>
              <IconButton icon="chevron-right" size="sm" label="Next month" onClick={() => setCursor(addMonths(cursor, 1))} />
            </div>

            <div
              ref={gridRef}
              role="grid"
              aria-label={`${monthName(p.m)} ${p.y}`}
              onKeyDown={onGridKey}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(7, var(--datepicker-day-size))', gap: 2 }}
            >
              {weekdayNames(weekStartsOn).map((d) => (
                <div key={d} role="columnheader" aria-label={d} style={{ height: 22, display: 'grid', placeItems: 'center', fontSize: 'var(--text-2xs)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--datepicker-weekday-text)' }}>{d.slice(0, 2)}</div>
              ))}
              {cells.map((c) => {
                const isSel = selected(c.iso);
                const isSpan = range && !isSel && inRange(c.iso, from, to);
                const isToday = c.iso === today;
                const d = dayOff(c.iso);
                const isCursor = c.iso === cursor;
                return (
                  <div key={c.iso} role="gridcell" aria-selected={isSel || undefined} style={{ display: 'grid' }}>
                    <button
                      type="button"
                      data-day-focus={isCursor ? 'true' : undefined}
                      /* Roving tabindex: one stop for the whole grid, so Tab
                         leaves the calendar instead of walking 42 days. */
                      tabIndex={isCursor ? 0 : -1}
                      disabled={d}
                      aria-label={spokenDate(c.iso)}
                      aria-current={isToday ? 'date' : undefined}
                      onClick={() => commit(c.iso)}
                      /* No onFocus → setCursor. The cursor is set by the key
                         handler, by a click, or by opening the panel; a focus
                         handler that also wrote it raced the effect above and
                         undid every arrow press. */
                      style={{
                        width: 'var(--datepicker-day-size)', height: 'var(--datepicker-day-size)',
                        display: 'grid', placeItems: 'center', padding: 0,
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'tabular-nums',
                        color: d ? 'var(--datepicker-day-disabled-text)'
                          : isSel ? 'var(--datepicker-day-foreground-selected)'
                            : isSpan ? 'var(--datepicker-day-foreground-range)'
                              : c.outside ? 'var(--datepicker-day-outside-text)' : 'var(--datepicker-day-text)',
                        background: isSel ? 'var(--datepicker-day-background-selected)' : isSpan ? 'var(--datepicker-day-background-range)' : 'transparent',
                        border: `var(--border-width) solid ${isToday && !isSel ? 'var(--datepicker-today-border)' : 'transparent'}`,
                        borderRadius: 'var(--datepicker-day-radius)',
                        cursor: d ? 'not-allowed' : 'pointer',
                        transition: 'var(--transition-control)',
                      }}
                    >{c.day}</button>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)', marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)', borderTop: `var(--border-width) solid var(--datepicker-footer-border)` }}>
              <Button variant="ghost" size="sm" onClick={() => { setCursor(today); commit(today); }} disabled={dayOff(today)}>Today</Button>
              {range && (
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  {editing === 'from' ? 'picking start' : 'picking end'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
