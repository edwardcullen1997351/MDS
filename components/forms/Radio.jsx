import React from 'react';

export function Radio({
  label,
  description,
  name,
  value,
  checked = false,
  disabled = false,
  onChange,
  style,
  ...rest
}) {
  const autoId = React.useId();
  const descId = description ? `${autoId}-desc` : undefined;
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);

  if (!name) {
    console.warn('[Meridian] Radio: `name` is required. Radios are exclusive only through a shared name — without it every radio is its own group of one, nothing ever deselects, and the browser gives no arrow-key navigation between them.');
  }
  if (!label && rest['aria-label'] == null && rest['aria-labelledby'] == null) {
    console.warn('[Meridian] Radio: no accessible name. An unlabelled radio announces as "radio button, not selected" with nothing to say what it chooses — pass `label`, or aria-label.');
  }

  const border = disabled
    ? 'var(--radio-border-disabled)'
    : checked
      ? hover ? 'var(--radio-border-checked-hover)' : 'var(--radio-border-checked)'
      : hover ? 'var(--radio-border-hover)' : 'var(--radio-border)';

  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 2, minWidth: 0, ...style }}>
      <label
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: label ? 'flex-start' : 'center',
          gap: 'var(--space-2)',
          /* The dot is 16px; the TARGET is a control-height row, so it clears
             the 24px minimum (2.5.8) and grows with density. */
          minHeight: 'var(--control-h-sm)',
          minWidth: label ? 0 : 'var(--control-h-sm)',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <input
          type="radio"
          {...rest}
          name={name}
          value={value}
          {...(onChange ? { checked } : { defaultChecked: checked, readOnly: true })}
          disabled={disabled}
          aria-describedby={rest['aria-describedby'] ?? descId}
          onChange={onChange}
          /* :focus-visible, so arrow-key navigation rings but a click does not. */
          onFocus={(e) => { setFocus(e.target.matches(':focus-visible')); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
        />
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 auto',
          width: 16,
          height: 16,
          background: disabled
            ? 'var(--radio-background-disabled)'
            : hover && !checked ? 'var(--radio-background-hover)' : 'var(--radio-background)',
          border: `var(--border-width) solid ${border}`,
          borderRadius: 'var(--radius-pill)',
          boxShadow: focus ? 'var(--input-focus-ring)' : 'none',
          transition: 'var(--transition-control)',
        }}>
          {checked && (
            <span style={{
              width: 8,
              height: 8,
              borderRadius: 'var(--radius-pill)',
              background: disabled ? 'var(--radio-dot-disabled)' : hover ? 'var(--radio-dot-hover)' : 'var(--radio-dot)',
              transition: 'var(--transition-control)',
            }} />
          )}
        </span>
        {label && (
          <span style={{ minWidth: 0, fontSize: 'var(--text-sm)', color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)', lineHeight: 'var(--leading-snug)' }}>{label}</span>
        )}
      </label>
      {/* Outside the <label>: inside it, the description is read as part of
          the control's NAME instead of as its description. */}
      {description && (
        <span id={descId} style={{ marginLeft: 24, fontSize: 'var(--text-xs)', color: disabled ? 'var(--text-disabled)' : 'var(--text-tertiary)' }}>{description}</span>
      )}
    </span>
  );
}
