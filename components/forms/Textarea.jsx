import React from 'react';
import { FieldContext } from './Field.jsx';

const PY = { sm: 'var(--space-1)', md: 'var(--space-2)', lg: 'var(--space-3)' };
const PX = { sm: 'var(--control-px-sm)', md: 'var(--control-px-md)', lg: 'var(--control-px-lg)' };
/* lg is the touch size: 16px is the largest type iOS Safari will not zoom to
   on focus (--text-lg — --text-base is 14px in this system). */
const FS = { sm: 'var(--text-xs)', md: 'var(--text-sm)', lg: 'var(--text-lg)' };

export function Textarea({
  rows = 4,
  size = 'md',
  invalid = false,
  mono = false,
  disabled = false,
  readOnly = false,
  resize = 'vertical',
  style,
  ...rest
}) {
  const field = React.useContext(FieldContext);
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);

  const id = rest.id ?? field?.id;
  const describedBy = rest['aria-describedby'] ?? field?.describedBy;
  const isInvalid = invalid || !!field?.invalid;
  const named = id != null || rest['aria-label'] != null || rest['aria-labelledby'] != null;

  if (!named) {
    console.warn('[Meridian] Textarea: no accessible name. A placeholder is not a label — it disappears on the first keystroke. Wrap the control in <Field label="…"> (which wires the id automatically) or pass aria-label.');
  }
  if (isInvalid && !describedBy) {
    console.warn('[Meridian] Textarea: `invalid` with no aria-describedby. A red border is a colour-only cue (WCAG 1.4.1) and announces nothing — pass the message through <Field error="…">.');
  }
  if (resize === 'both') {
    console.warn('[Meridian] Textarea: resize="both" lets the user drag the control out of its form column and over whatever sits beside it. Rendering resize="vertical" instead — height is the only dimension worth dragging.');
    resize = 'vertical';
  }

  const border = isInvalid
    ? 'var(--input-border-invalid)'
    : focus
      ? 'var(--input-border-focus)'
      : hover && !disabled
        ? 'var(--input-border-hover)'
        : 'var(--input-border)';

  return (
    <textarea
      {...rest}
      rows={rows}
      disabled={disabled}
      readOnly={readOnly}
      id={id}
      aria-describedby={describedBy}
      aria-invalid={isInvalid || undefined}
      aria-required={field?.required || undefined}
      /* A mono textarea holds a query, a path, YAML or a log line. Spell-check
         underlines and mobile autocorrect corrupt all four. */
      spellCheck={rest.spellCheck ?? !mono}
      autoCapitalize={rest.autoCapitalize ?? (mono ? 'off' : undefined)}
      autoCorrect={rest.autoCorrect ?? (mono ? 'off' : undefined)}
      onMouseEnter={(e) => { setHover(true); rest.onMouseEnter?.(e); }}
      onMouseLeave={(e) => { setHover(false); rest.onMouseLeave?.(e); }}
      onFocus={(e) => { setFocus(true); rest.onFocus?.(e); }}
      onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
      style={{
        width: '100%',
        /* The resize handle can otherwise be dragged down to a one-line
           sliver, which no longer reads as a multi-line control. */
        minHeight: 'var(--control-h-md)',
        padding: `${PY[size] || PY.md} ${PX[size] || PX.md}`,
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-sans)',
        fontSize: FS[size] || FS.md,
        lineHeight: 'var(--leading-normal)',
        letterSpacing: mono ? 'var(--tracking-mono)' : 'var(--tracking-body)',
        color: disabled ? 'var(--input-text-disabled)' : 'var(--input-text)',
        background: disabled
          ? 'var(--input-background-disabled)'
          : readOnly
            ? 'var(--surface-sunken)'
            : 'var(--input-background)',
        border: `var(--border-width) solid ${border}`,
        borderRadius: 'var(--input-radius)',
        boxShadow: focus ? (isInvalid ? 'var(--input-focus-ring-invalid)' : 'var(--input-focus-ring)') : 'none',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'text',
        resize,
        transition: 'var(--transition-control)',
        ...style,
      }}
    />
  );
}
