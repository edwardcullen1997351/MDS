import React from 'react';

const SIZES = { sm: { w: 28, h: 16, k: 12 }, md: { w: 34, h: 20, k: 16 } };

export function Switch({
  label,
  description,
  checked = false,
  disabled = false,
  size = 'md',
  onChange,
  style,
  ...rest
}) {
  const autoId = React.useId();
  const descId = description ? `${autoId}-desc` : undefined;
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const s = SIZES[size] || SIZES.md;

  if (!label && rest['aria-label'] == null && rest['aria-labelledby'] == null) {
    console.warn('[Meridian] Switch: no accessible name. A bare track announces as "switch, off" with nothing to say what it controls — pass `label`, or aria-label.');
  }

  const track = disabled
    ? 'var(--switch-track-disabled)'
    : checked
      ? hover ? 'var(--switch-track-checked-hover)' : 'var(--switch-track-checked)'
      : 'var(--switch-track)';
  const border = disabled
    ? 'var(--switch-border-disabled)'
    : checked
      ? hover ? 'var(--switch-border-checked-hover)' : 'var(--switch-border-checked)'
      : hover ? 'var(--switch-border-hover)' : 'var(--switch-border)';

  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 2, minWidth: 0, ...style }}>
      <label
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          minHeight: 'var(--control-h-sm)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          minWidth: 0,
        }}
      >
        <input
          type="checkbox"
          role="switch"
          {...rest}
          {...(onChange ? { checked } : { defaultChecked: checked, readOnly: true })}
          disabled={disabled}
          aria-describedby={rest['aria-describedby'] ?? descId}
          onChange={onChange}
          /* :focus-visible, so a mouse click does not leave a ring behind. */
          onFocus={(e) => { setFocus(e.target.matches(':focus-visible')); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        />
        <span style={{
          position: 'relative',
          flex: '0 0 auto',
          width: s.w,
          height: s.h,
          background: track,
          border: `var(--border-width) solid ${border}`,
          borderRadius: 'var(--radius-pill)',
          boxShadow: focus ? 'var(--input-focus-ring)' : 'none',
          transition: 'var(--transition-control)',
        }}>
          <span style={{
            position: 'absolute',
            top: (s.h - 2 - s.k) / 2,
            left: 1,
            width: s.k,
            height: s.k,
            /* Off, the white knob sits on a 1.60:1 track, so it carries its own
               hairline; on, it sits on action blue at 6.98:1 and needs none. */
            background: disabled ? 'var(--switch-knob-disabled)' : 'var(--switch-knob)',
            border: checked || disabled ? '0' : `var(--border-width) solid var(--switch-knob-border)`,
            borderRadius: 'var(--radius-pill)',
            boxShadow: disabled ? 'none' : 'var(--switch-knob-shadow)',
            /* transform, not `left` — the system animates only opacity,
               transform, colour and shadow. */
            transform: `translateX(${checked ? s.w - 2 - s.k - 2 : 0}px)`,
            transition: 'transform var(--duration-fast) var(--ease-out),background-color var(--duration-fast) var(--ease-out)',
          }} />
        </span>
        {label && (
          <span style={{ minWidth: 0, fontSize: 'var(--text-sm)', color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)', lineHeight: 'var(--leading-snug)' }}>{label}</span>
        )}
      </label>
      {/* Outside the <label>: inside it, the description is read as part of
          the control's NAME instead of as its description. */}
      {description && (
        <span id={descId} style={{ marginLeft: s.w + 12, fontSize: 'var(--text-xs)', color: disabled ? 'var(--text-disabled)' : 'var(--text-tertiary)' }}>{description}</span>
      )}
    </span>
  );
}
