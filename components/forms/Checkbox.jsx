import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Checkbox({
  label,
  description,
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  const autoId = React.useId();
  const descId = description ? `${autoId}-desc` : undefined;
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const on = checked || indeterminate;

  /* The native `indeterminate` state is a DOM PROPERTY with no attribute, so
     it cannot be set in JSX. Without this the mark is drawn but the control
     still announces "not checked" — a select-all header that lies. */
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  if (!label && rest['aria-label'] == null && rest['aria-labelledby'] == null) {
    console.warn('[Meridian] Checkbox: no accessible name. A bare box in a table row or a header announces as "checkbox, not checked" with nothing to say what it selects — pass `label`, or aria-label ("Select all rows", "Select work order WO-4471").');
  }

  const boxBorder = disabled
    ? 'var(--checkbox-border-disabled)'
    : on
      ? hover ? 'var(--checkbox-border-checked-hover)' : 'var(--checkbox-border-checked)'
      : hover ? 'var(--checkbox-border-hover)' : 'var(--checkbox-border)';

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
          /* The box is 16px; the TARGET is a control-height row, so a bare
             selector still clears the 24px minimum (2.5.8) and grows with
             density instead of staying 16px on a floor tablet. */
          minHeight: 'var(--control-h-sm)',
          minWidth: label ? 0 : 'var(--control-h-sm)',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <input
          type="checkbox"
          {...rest}
          {...(onChange ? { checked } : { defaultChecked: checked, readOnly: true })}
          ref={ref}
          disabled={disabled}
          aria-describedby={rest['aria-describedby'] ?? descId}
          onChange={onChange}
          /* :focus-visible, so a mouse click does not leave a ring behind. */
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
          color: disabled ? 'var(--text-disabled)' : 'var(--checkbox-mark)',
          background: disabled
            ? 'var(--checkbox-background-disabled)'
            : on
              ? hover ? 'var(--checkbox-background-checked-hover)' : 'var(--checkbox-background-checked)'
              : hover ? 'var(--checkbox-background-hover)' : 'var(--checkbox-background)',
          border: `var(--border-width) solid ${boxBorder}`,
          borderRadius: 'var(--checkbox-radius)',
          boxShadow: focus ? 'var(--input-focus-ring)' : 'none',
          transition: 'var(--transition-control)',
        }}>
          {indeterminate ? <Icon name="minus" size="mark" /> : checked ? <Icon name="check" size="mark" /> : null}
        </span>
        {label && (
          <span style={{ minWidth: 0, fontSize: 'var(--text-sm)', color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)', lineHeight: 'var(--leading-snug)' }}>{label}</span>
        )}
      </label>
      {/* Outside the <label> on purpose: inside it, the description is read as
          part of the control's NAME instead of as its description. */}
      {description && (
        <span id={descId} style={{ marginLeft: 24, fontSize: 'var(--text-xs)', color: disabled ? 'var(--text-disabled)' : 'var(--text-tertiary)' }}>{description}</span>
      )}
    </span>
  );
}
