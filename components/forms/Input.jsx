import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { FieldContext } from './Field.jsx';

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };
const PX = { sm: 'var(--control-px-sm)', md: 'var(--control-px-md)', lg: 'var(--control-px-lg)' };
/* lg is the touch size, and 16px is the largest type iOS Safari will not zoom
   to on focus — --text-lg, since --text-base is 14px in this system. */
const FS = { sm: 'var(--text-xs)', md: 'var(--text-sm)', lg: 'var(--text-lg)' };
const IS = { sm: 'xs', md: 'xs', lg: 'sm' };

export const Input = React.forwardRef(function Input({
  size = 'md',
  iconLeft,
  suffix,
  invalid = false,
  mono = false,
  disabled = false,
  readOnly = false,
  style,
  ...rest
}, forwarded) {
  const field = React.useContext(FieldContext);
  const ref = React.useRef(null);
  /* The box needs the node for its own click-to-focus, and a composite needs
     it to restore focus after clearing — so the forwarded ref is merged rather
     than replacing the internal one. */
  const setRef = (el) => {
    ref.current = el;
    if (typeof forwarded === 'function') forwarded(el);
    else if (forwarded) forwarded.current = el;
  };
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);

  const id = rest.id ?? field?.id;
  const describedBy = rest['aria-describedby'] ?? field?.describedBy;
  const isInvalid = invalid || !!field?.invalid;
  const named = id != null || rest['aria-label'] != null || rest['aria-labelledby'] != null;

  if (!named) {
    console.warn('[Meridian] Input: no accessible name. A placeholder is not a label — it disappears on the first keystroke and is not announced by every screen reader. Wrap the control in <Field label="…"> (which wires the id automatically) or pass aria-label.');
  }
  if (isInvalid && !describedBy) {
    console.warn('[Meridian] Input: `invalid` with no aria-describedby. A red border is a colour-only cue (WCAG 1.4.1) and announces nothing — pass the message through <Field error="…">, which renders it and points the control at it.');
  }
  if (rest.type === 'number') {
    console.warn('[Meridian] Input: type="number" mutates the value on mouse wheel while focused, hides digits behind spinners, and silently rejects thousands separators. Use type="text" with inputMode="numeric" (and `mono` for machine values) instead.');
  }

  const border = isInvalid
    ? 'var(--input-border-invalid)'
    : focus
      ? 'var(--input-border-focus)'
      : hover && !disabled
        ? 'var(--input-border-hover)'
        : 'var(--input-border)';

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      /* The whole box is the target, not just the 13px text run inside it.
         Clicking the padding, the leading icon or the suffix focuses the field
         and leaves the caret where the browser would have put it. */
      onMouseDown={(e) => {
        if (e.target !== ref.current && ref.current && !disabled) {
          e.preventDefault();
          ref.current.focus();
        }
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        height: H[size] || H.md,
        padding: `0 ${PX[size] || PX.md}`,
        background: disabled
          ? 'var(--input-background-disabled)'
          : readOnly
            ? 'var(--surface-sunken)'
            : 'var(--input-background)',
        border: `var(--border-width) solid ${border}`,
        borderRadius: 'var(--input-radius)',
        boxShadow: focus ? (isInvalid ? 'var(--input-focus-ring-invalid)' : 'var(--input-focus-ring)') : 'none',
        color: disabled ? 'var(--input-text-disabled)' : 'var(--input-icon)',
        cursor: disabled ? 'not-allowed' : 'text',
        transition: 'var(--transition-control)',
        minWidth: 0,
        ...style,
      }}
    >
      {iconLeft && <Icon name={iconLeft} size={IS[size] || IS.md} />}
      <input
        {...rest}
        ref={setRef}
        id={id}
        disabled={disabled}
        readOnly={readOnly}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        aria-required={field?.required || undefined}
        onFocus={(e) => { setFocus(true); rest.onFocus?.(e); }}
        onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
        style={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          margin: 0,
          padding: 0,
          border: 0,
          outline: 'none',
          background: 'transparent',
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
          fontSize: FS[size] || FS.md,
          letterSpacing: mono ? 'var(--tracking-mono)' : 'var(--tracking-body)',
          color: disabled ? 'var(--input-text-disabled)' : 'var(--input-text)',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
      {suffix && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', flex: '0 0 auto' }}>{suffix}</span>}
    </div>
  );
});
