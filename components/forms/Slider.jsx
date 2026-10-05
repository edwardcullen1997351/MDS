import React from 'react';

/* Geometry lives in --slider-* tokens; the component only names them, so a
   product can re-scale the control without forking it. The percentage maths
   is done in calc() against those same tokens rather than in JS pixels. */
const SIZES = {
  sm: { track: 'var(--slider-track-height-sm)', thumb: 'var(--slider-thumb-size-sm)' },
  md: { track: 'var(--slider-track-height-md)', thumb: 'var(--slider-thumb-size-md)' },
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export function Slider({
  label,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  unit,
  format,
  showValue = true,
  marks,
  size = 'md',
  disabled = false,
  onChange,
  style,
  ...rest
}) {
  const autoId = React.useId();
  const id = rest.id ?? `${autoId}-slider`;
  const [inner, setInner] = React.useState(value ?? defaultValue ?? min);
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const controlled = value != null && typeof onChange === 'function';

  if (!label && rest['aria-label'] == null && rest['aria-labelledby'] == null) {
    console.warn('[Meridian] Slider: no accessible name. A bare track announces as "slider, 68" with nothing to say what 68 measures — pass `label`, or aria-label.');
  }
  if (value != null && typeof onChange !== 'function') {
    console.warn('[Meridian] Slider: `value` without `onChange` — the thumb cannot move. Pass onChange, or use defaultValue for an uncontrolled slider.');
  }

  const v = clamp(controlled ? value : inner, min, max);
  const ratio = max === min ? 0 : (v - min) / (max - min);
  const pct = ratio * 100;
  /* left edge of the thumb, so the thumb never overhangs either end */
  const at = (r) => `calc(${r * 100}% - ${r} * ${s.thumb})`;
  const text = format ? format(v) : unit ? `${v}\u2009${unit}` : String(v);

  const handle = (e) => {
    const n = Number(e.target.value);
    if (!controlled) setInner(n);
    onChange?.(e);
  };

  const fill = disabled ? 'var(--slider-fill-disabled)' : hover || active ? 'var(--slider-fill-hover)' : 'var(--slider-fill)';
  const thumbBorder = disabled
    ? 'var(--slider-thumb-border-disabled)'
    : active ? 'var(--slider-thumb-border-active)'
      : hover ? 'var(--slider-thumb-border-hover)'
        : 'var(--slider-thumb-border)';

  const normMarks = (marks || []).map((m) => (typeof m === 'object' ? m : { value: m }));

  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0, ...style }}>
      {(label || showValue) && (
        <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-3)', minWidth: 0 }}>
          {label ? (
            <label htmlFor={id} style={{ minWidth: 0, fontSize: 'var(--text-sm)', color: disabled ? 'var(--text-disabled)' : 'var(--slider-label-text)', lineHeight: 'var(--leading-snug)', cursor: disabled ? 'not-allowed' : 'pointer' }}>{label}</label>
          ) : <span />}
          {/* The readout is the precision the track cannot carry. Mono and
              tabular so the number does not jitter while dragging. */}
          {showValue && (
            <span aria-hidden="true" style={{ flex: '0 0 auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontVariantNumeric: 'var(--numeric-figures)', color: disabled ? 'var(--text-disabled)' : 'var(--slider-value-text)' }}>{text}</span>
          )}
        </span>
      )}
      <span
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{ position: 'relative', display: 'block', minWidth: 0, height: 'var(--control-h-sm)' }}
      >
        <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', height: s.track, background: disabled ? 'var(--slider-track-disabled)' : 'var(--slider-track)', borderRadius: 'var(--slider-radius)' }}>
          <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `calc(${pct}% + ${0.5 - ratio} * ${s.thumb})`, background: fill, borderRadius: 'var(--slider-radius)', transition: 'var(--transition-tint)' }} />
          {normMarks.map((m) => {
            const r = max === min ? 0 : clamp((m.value - min) / (max - min), 0, 1);
            return <span key={`t${m.value}`} aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: `calc(${r * 100}% - ${r} * var(--border-width))`, width: 'var(--border-width)', background: 'var(--slider-tick)' }} />;
          })}
        </span>
        {/* A real <input type="range">: role, value announcements, arrow keys,
            Home/End, PageUp/PageDown and pointer dragging all come free, and
            the control posts a form value. It sits transparent over the
            painted track rather than being restyled, because the native
            thumb is only reachable through vendor pseudo-elements. */}
        <input
          {...rest}
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={v}
          disabled={disabled}
          onChange={handle}
          aria-valuetext={text}
          onFocus={(e) => { setFocus(e.target.matches(':focus-visible')); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocus(false); setActive(false); rest.onBlur?.(e); }}
          onPointerDown={(e) => { setActive(true); rest.onPointerDown?.(e); }}
          onPointerUp={(e) => { setActive(false); rest.onPointerUp?.(e); }}
          onKeyDown={(e) => { setActive(true); rest.onKeyDown?.(e); }}
          onKeyUp={(e) => { setActive(false); rest.onKeyUp?.(e); }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', margin: 0, opacity: 0, cursor: disabled ? 'not-allowed' : 'pointer' }}
        />
        <span aria-hidden="true" style={{
          position: 'absolute',
          top: '50%',
          left: at(ratio),
          width: s.thumb,
          height: s.thumb,
          transform: 'translateY(-50%)',
          background: disabled ? 'var(--slider-thumb-disabled)' : 'var(--slider-thumb)',
          border: `var(--border-width) solid ${thumbBorder}`,
          borderRadius: 'var(--slider-radius)',
          boxShadow: focus ? 'var(--input-focus-ring)' : disabled ? 'none' : 'var(--slider-thumb-shadow)',
          transition: 'var(--transition-control)',
          pointerEvents: 'none',
        }} />
      </span>
      {normMarks.some((m) => m.label != null) && (
        <span aria-hidden="true" style={{ position: 'relative', display: 'block', height: 14, minWidth: 0 }}>
          {normMarks.filter((m) => m.label != null).map((m) => {
            const r = max === min ? 0 : clamp((m.value - min) / (max - min), 0, 1);
            return (
              <span key={`l${m.value}`} style={{ position: 'absolute', top: 0, left: `${r * 100}%`, transform: `translateX(-${r * 100}%)`, whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: disabled ? 'var(--text-disabled)' : 'var(--slider-tick-label)' }}>{m.label}</span>
            );
          })}
        </span>
      )}
    </span>
  );
}
