import React from 'react';
import { Input } from '../forms/Input.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Button } from '../core/Button.jsx';
import { Text } from '../primitives/Text.jsx';

/* A text-search control: query entry with search semantics, plus the two
   auxiliary actions search actually needs — clear and submit. The composite
   owns the query contract, the search role, the clear/submit split and their
   coordinated sizing; Input keeps every text-editing behaviour it already has.
   See the SearchField spec, §01.

   NOT a suggestion field (that is Autocomplete), NOT a filter control, and NOT
   the owner of any result state. */

/* The clear control sits INSIDE the field, so it is one step down from the
   field's own size — a 34px button in a 34px box has no room to breathe. */
const CLEAR_SIZE = { sm: 'sm', md: 'sm', lg: 'md' };

export function SearchField({
  label,
  value,
  defaultValue = '',
  onChange,
  onSubmit,
  onClear,
  placeholder,
  submit = 'none',
  clearable = true,
  landmark = false,
  size = 'md',
  disabled = false,
  readOnly = false,
  hint,
  style,
  ...rest
}) {
  const controlled = value !== undefined;
  const [inner, setInner] = React.useState(defaultValue);
  const q = controlled ? value : inner;
  const hintId = React.useId();
  /* Input forwards its ref to the underlying input (amended 6 Sep 2026), so
     focus restoration after a clear is a ref call rather than a composite
     reaching into another component's markup. Spec §13. */
  const ref = React.useRef(null);

  if (!label) {
    console.warn('[Meridian] SearchField: `label` is required — a placeholder is not a label (it disappears on the first keystroke), and the field would be announced only as an unnamed search box.');
  }
  if (submit !== 'none' && !onSubmit) {
    console.warn('[Meridian] SearchField: submit="' + submit + '" with no `onSubmit`. A submit control that does nothing is worse than none — either pass a handler or drop to submit="none" and search as the query changes.');
  }

  const set = (next, e) => {
    if (!controlled) setInner(next);
    onChange?.(next, e);
  };

  /* Clearing is a value change like any other: it goes through onChange so a
     consumer searching on change re-runs with an empty query and never has to
     special-case the clear. onClear is the extra signal, not the only one. */
  const clear = (e) => {
    set('', e);
    onClear?.(e);
    ref.current?.focus(); // focus stays where the user was typing
  };

  const fire = (e) => { onSubmit?.(q, e); };

  const has = String(q ?? '').length > 0;
  const showClear = !disabled && !readOnly && (clearable === 'always' || (clearable === true && has));

  const field = (
    <Input
      {...rest}
      ref={ref}
      /* type="text" + role="searchbox", not type="search": the native search
         input paints its OWN cancel button in WebKit, which would put two
         clear affordances in one field. Spec §13. */
      type="text"
      role="searchbox"
      aria-label={label}
      size={size}
      /* The magnifier is the search affordance — it appears once. With
         submit="icon" the affordance IS the button, so the decorative copy
         inside the field is dropped rather than shown twice. Spec §02. */
      iconLeft={submit === 'icon' ? undefined : 'search'}
      placeholder={placeholder}
      aria-describedby={hint ? hintId : rest['aria-describedby']}
      disabled={disabled}
      readOnly={readOnly}
      value={q}
      onChange={(e) => set(e.target.value, e)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onSubmit) { e.preventDefault(); fire(e); }
        rest.onKeyDown?.(e);
      }}
      suffix={showClear ? (
        <IconButton
          icon="x"
          label={'Clear ' + (label || 'search')}
          variant="ghost"
          size={CLEAR_SIZE[size] || 'sm'}
          onClick={clear}
          disabled={!has}
        />
      ) : null}
      style={{ flex: 1, minWidth: 0 }}
    />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0, ...style }}>
      <div
        role={landmark ? 'search' : undefined}
        aria-label={landmark ? label : undefined}
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--search-field-gap)', minWidth: 0 }}
      >
        {field}
        {submit === 'button' ? (
          <Button size={size} onClick={fire} disabled={disabled}>Search</Button>
        ) : null}
        {submit === 'icon' ? (
          <IconButton icon="search" label={'Run ' + (label || 'search')} variant="solid" size={size} onClick={fire} disabled={disabled} />
        ) : null}
      </div>
      {hint ? <Text id={hintId} size="xs" tone="tertiary" measure="hint">{hint}</Text> : null}
    </div>
  );
}
