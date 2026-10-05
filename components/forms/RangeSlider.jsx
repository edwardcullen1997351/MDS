import React from 'react';

/* RangeSlider — two thumbs, one range.

   A sibling component rather than a `range` prop on Slider, for the reason
   this system has now applied three times (Combobox/MultiCombobox,
   Checkbox/CheckboxGroup, Radio/RadioGroup): the second thumb changes what the
   control IS. `value` becomes a pair, `onChange` reports which thumb moved,
   every ARIA value attribute doubles, and the two thumbs need independent
   accessible names. A `range` prop would make half of Slider's API conditional
   on a boolean, which is the shape that produced Card's `interactive` defect.

   ARCHITECTURE — the part worth reading before editing:

   Two real <input type="range"> elements provide keyboard and assistive-tech
   operation: each is a genuine slider with its own name, its own arrow-key
   handling, its own announced value. Neither is a div with role="slider".

   But they are NOT stacked full-width and hidden behind the visuals, which is
   the obvious construction and is broken: two overlapping opacity-0 inputs
   mean the one later in the DOM wins every pointer hit, so the lower thumb
   becomes undraggable the moment the two values meet. The usual fix is
   `pointer-events: none` on the input and `auto` on `::-webkit-slider-thumb`,
   which needs a pseudo-element rule — and this system styles inline, with a
   single deliberate stylesheet exception for container queries that its own
   governance card caps at three components.

   So the inputs are keyboard surfaces only (they sit under the track, pointer
   events off), and DRAGGING is handled here: pointerdown on the track picks
   the nearer thumb, setPointerCapture follows it, and each move maps x to a
   stepped value. That also fixes a defect the two-input version cannot: when
   both thumbs sit on the same value, "nearer" is ambiguous, and this picks by
   which direction the pointer moves rather than by DOM order. */

const SIZES = {
  sm: { track: 'var(--slider-track-height-sm)', thumb: 'var(--slider-thumb-size-sm)' },
  md: { track: 'var(--slider-track-height-md)', thumb: 'var(--slider-thumb-size-md)' },
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function RangeSlider({
  label,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  /* The gap the two thumbs may not close. Default 0: they may meet but never
     cross, because a range whose start is past its end is not a state any
     product wants to receive from a control. */
  minDistance = 0,
  unit,
  format,
  showValue = true,
  size = 'md',
  disabled = false,
  onChange,
  /* Names for the two thumbs. Each input is a separate control in the tab
     order and announces separately, so "Price" alone would read as two
     identical sliders. */
  startLabel = 'Minimum',
  endLabel = 'Maximum',
  style,
  ...rest
}) {
  const autoId = React.useId();
  const id = rest.id ?? `${autoId}-range`;
  const trackRef = React.useRef(null);
  const dragging = React.useRef(null);
  const [inner, setInner] = React.useState(() => value ?? defaultValue ?? [min, max]);
  const [focus, setFocus] = React.useState(null);
  const [hover, setHover] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const controlled = value != null && typeof onChange === 'function';

  if (!label && rest['aria-label'] == null && rest['aria-labelledby'] == null) {
    console.warn('[Meridian] RangeSlider: no accessible name. The thumbs announce as "Minimum, 20" and "Maximum, 80" with nothing to say what they measure — pass `label`, and each thumb becomes "<label> Minimum" / "<label> Maximum".');
  }
  if (value != null && typeof onChange !== 'function') {
    console.warn('[Meridian] RangeSlider: `value` without `onChange` — neither thumb can move. Pass onChange, or use defaultValue.');
  }

  const pair = controlled ? value : inner;
  const lo = clamp(Math.min(pair[0], pair[1]), min, max);
  const hi = clamp(Math.max(pair[0], pair[1]), min, max);

  const ratio = (n) => (max === min ? 0 : (n - min) / (max - min));
  const at = (r) => `calc(${r * 100}% - ${r} * ${s.thumb})`;
  const fmt = (n) => (format ? format(n) : unit ? `${n}\u2009${unit}` : String(n));

  const commit = (next) => {
    if (!controlled) setInner(next);
    onChange?.(next);
  };

  /* One thumb never pushes the other: it stops at minDistance. Pushing feels
     helpful and silently rewrites a value the user set deliberately — the
     range they already chose on the far thumb. */
  const setThumb = (which, n) => {
    const v = clamp(Math.round((n - min) / step) * step + min, min, max);
    if (which === 0) commit([Math.min(v, hi - minDistance), hi]);
    else commit([lo, Math.max(v, lo + minDistance)]);
  };

  const valueAt = (clientX) => {
    const el = trackRef.current;
    if (!el) return min;
    const r = el.getBoundingClientRect();
    return min + clamp((clientX - r.left) / r.width, 0, 1) * (max - min);
  };

  const onPointerDown = (e) => {
    if (disabled) return;
    const v = valueAt(e.clientX);
    /* When both thumbs sit on the same value, distance cannot decide. Fall
       back to direction: a pointer to the left of the pair is reaching for the
       low thumb. This is the case the two-stacked-inputs construction gets
       permanently wrong. */
    const which = lo === hi ? (v < lo ? 0 : 1) : Math.abs(v - lo) <= Math.abs(v - hi) ? 0 : 1;
    dragging.current = which;
    e.currentTarget.setPointerCapture(e.pointerId);
    setThumb(which, v);
  };
  const onPointerMove = (e) => {
    if (dragging.current == null) return;
    setThumb(dragging.current, valueAt(e.clientX));
  };
  const endDrag = (e) => {
    if (dragging.current == null) return;
    dragging.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (err) { /* pointer already gone */ }
  };

  const fill = disabled ? 'var(--slider-fill-disabled)' : hover || focus != null ? 'var(--slider-fill-hover)' : 'var(--slider-fill)';
  const thumbBorder = (i) => (disabled
    ? 'var(--slider-thumb-border-disabled)'
    : focus === i ? 'var(--slider-thumb-border-active)'
      : 'var(--slider-thumb-border)');

  const input = (i, v, name, aMin, aMax) => (
    <input
      type="range"
      id={i === 0 ? id : `${id}-end`}
      /* COMPOSED, not replaced. `aria-label` outranks the visible `<label
         for>`, so naming a thumb "Minimum" discarded the group name entirely
         and the control announced "Minimum, 20" with nothing to say what 20
         measured — verbatim the failure this component's own warning claims
         `label` prevents, in a call that correctly passes `label`. A warning
         that only fires on the absent case is a false reassurance for the
         present one. */
      aria-label={label ? `${label} ${name}` : name}
      /* The REAL limits, on the native attributes. Until 1.24.2 these were the
         full scale and the true bounds were published as aria-valuemin /
         aria-valuemax — which ARIA in HTML forbids on input[type=range]
         precisely because min/max already convey them, so the browser
         computed the range from the scale and the aria-* pair was inert. The
         spec claimed a screen-reader user heard the real limit; they heard
         the scale. Native min/max also makes arrow keys stop at the other
         thumb for free, which is what §07 documents. */
      min={aMin}
      max={aMax}
      step={step}
      value={v}
      disabled={disabled}
      onChange={(e) => setThumb(i, Number(e.target.value))}
      aria-valuetext={fmt(v)}
      onFocus={(e) => { if (e.target.matches(':focus-visible')) setFocus(i); }}
      onBlur={() => setFocus(null)}
      /* Under the track and pointer-inert: these exist for the keyboard and
         the accessibility tree. Not `display:none` or `visibility:hidden`,
         either of which would remove them from both. */
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', margin: 0, opacity: 0, pointerEvents: 'none' }}
    />
  );

  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minWidth: 0, ...style }}>
      {(label || showValue) && (
        <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
          {/* The visible label still points at the low thumb so clicking it
              focuses something sensible. It is NOT the accessible name —
              each input composes its own from `label` plus its thumb name. */}
          {label && <label htmlFor={id} style={{ fontSize: 'var(--text-xs)', color: disabled ? 'var(--text-disabled)' : 'var(--text-secondary)' }}>{label}</label>}
          {showValue && (
            /* One reading, not two: "20 – 80" is the value of a range. Two
               separate numbers make the reader assemble the range themselves.
               aria-hidden because both inputs already announce their own. */
            <span aria-hidden="true" style={{ flex: '0 0 auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'var(--numeric-figures)', color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)' }}>
              {fmt(lo)}&thinsp;–&thinsp;{fmt(hi)}
            </span>
          )}
        </span>
      )}
      <span
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ position: 'relative', display: 'block', height: s.thumb, minWidth: 0, touchAction: 'none', cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', height: s.track, background: 'var(--slider-track)', borderRadius: 'var(--slider-radius)' }}>
          {/* The fill is BETWEEN the thumbs, not from zero: the selected
              region of a range is what sits inside it. */}
          <span style={{ position: 'absolute', top: 0, bottom: 0, left: `${ratio(lo) * 100}%`, width: `${(ratio(hi) - ratio(lo)) * 100}%`, background: fill, borderRadius: 'var(--slider-radius)' }} />
        </span>
        {input(0, lo, startLabel, min, Math.max(min, hi - minDistance))}
        {input(1, hi, endLabel, Math.min(max, lo + minDistance), max)}
        {[[0, lo], [1, hi]].map(([i, v]) => (
          <span key={i} aria-hidden="true" style={{
            position: 'absolute',
            top: '50%',
            left: at(ratio(v)),
            transform: 'translateY(-50%)',
            width: s.thumb,
            height: s.thumb,
            borderRadius: 'var(--radius-full)',
            background: disabled ? 'var(--slider-thumb-disabled)' : 'var(--slider-thumb)',
            border: `var(--border-width) solid ${thumbBorder(i)}`,
            boxShadow: focus === i ? 'var(--focus-ring)' : 'var(--slider-thumb-shadow)',
          }} />
        ))}
      </span>
    </span>
  );
}
