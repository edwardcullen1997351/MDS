import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { FieldContext } from './Field.jsx';

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };
const PX = { sm: 'var(--control-px-sm)', md: 'var(--control-px-md)', lg: 'var(--control-px-lg)' };
/* lg is the touch size, and 16px is the largest type iOS Safari will not zoom
   to on focus — --text-lg, since --text-base is 14px in this system. */
const FS = { sm: 'var(--text-xs)', md: 'var(--text-sm)', lg: 'var(--text-lg)' };
const IS = { sm: 14, md: 14, lg: 16 };

export function Select({
  options = [],
  value,
  defaultValue,
  onChange,
  placeholder,
  size = 'md',
  invalid = false,
  disabled = false,
  style,
  ...rest
}) {
  const field = React.useContext(FieldContext);
  const [focus, setFocus] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  /* Uncontrolled selects still have to know whether anything has been chosen:
     the value text is tertiary while the placeholder option is selected and
     primary once it is not. Reading `value` alone left an uncontrolled Select
     showing every real choice in placeholder grey — and with no placeholder
     the browser selects the first option, so the seed is that option, not ''. */
  const seed = value ?? defaultValue ?? (placeholder ? '' : items[0]?.value ?? '');
  const [chosen, setChosen] = React.useState(seed);

  const id = rest.id ?? field?.id;
  const describedBy = rest['aria-describedby'] ?? field?.describedBy;
  const isInvalid = invalid || !!field?.invalid;
  const controlled = typeof onChange === 'function';
  const current = controlled ? value ?? '' : chosen;
  const named = id != null || rest['aria-label'] != null || rest['aria-labelledby'] != null;

  if (!named) {
    console.warn('[Meridian] Select: no accessible name. A placeholder option is not a label — it is replaced by the chosen value and stops being announced. Wrap the control in <Field label="…"> (which wires the id automatically) or pass aria-label.');
  }
  if (isInvalid && !describedBy) {
    console.warn('[Meridian] Select: `invalid` with no aria-describedby. A red border is a colour-only cue (WCAG 1.4.1) and announces nothing — pass the message through <Field error="…">, which renders it and points the control at it.');
  }
  if (rest.multiple) {
    console.warn('[Meridian] Select: `multiple` is not supported. A native multi-select requires ctrl/cmd-click to add and shows a scrolling box with no indication of what is selected off-screen. Use CheckboxGroup, which names the set and shows every choice.');
  }
  if (items.length === 0) {
    console.warn('[Meridian] Select: `options` is empty. The control renders as an empty box that opens onto nothing. Render a disabled Select with a placeholder that says why the list is empty, or do not render it yet.');
  }

  const border = isInvalid
    ? 'var(--input-border-invalid)'
    : focus
      ? 'var(--input-border-focus)'
      : hover && !disabled
        ? 'var(--input-border-hover)'
        : 'var(--input-border)';
  const px = PX[size] || PX.md;
  const iconPx = IS[size] || IS.md;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: H[size] || H.md,
        background: disabled ? 'var(--input-background-disabled)' : 'var(--input-background)',
        border: `var(--border-width) solid ${border}`,
        borderRadius: 'var(--input-radius)',
        boxShadow: focus ? (isInvalid ? 'var(--input-focus-ring-invalid)' : 'var(--input-focus-ring)') : 'none',
        transition: 'var(--transition-control)',
        minWidth: 0,
        ...style,
      }}
    >
      <select
        {...(controlled ? { value: current } : { defaultValue: seed })}
        {...rest}
        id={id}
        disabled={disabled}
        aria-describedby={describedBy}
        aria-invalid={isInvalid || undefined}
        aria-required={field?.required || undefined}
        onChange={(e) => { if (!controlled) setChosen(e.target.value); onChange?.(e); }}
        onFocus={(e) => { setFocus(true); rest.onFocus?.(e); }}
        onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
        style={{
          appearance: 'none',
          WebkitAppearance: 'none',
          flex: 1,
          minWidth: 0,
          height: '100%',
          /* The gutter is computed, not a fixed 28px: padding-x + glyph + 6px,
             so the value text never slides under the chevron at lg. */
          padding: `0 calc(${px} + ${iconPx}px + 6px) 0 ${px}`,
          margin: 0,
          border: 0,
          outline: 'none',
          background: 'transparent',
          fontFamily: 'var(--font-sans)',
          fontSize: FS[size] || FS.md,
          color: disabled ? 'var(--input-text-disabled)' : current ? 'var(--input-text)' : 'var(--input-placeholder)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          textOverflow: 'ellipsis',
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {items.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <Icon
        name="chevron-down"
        size={iconPx}
        style={{ position: 'absolute', right: px, color: disabled ? 'var(--input-text-disabled)' : 'var(--input-icon)', pointerEvents: 'none' }}
      />
    </div>
  );
}
