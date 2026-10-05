import React from 'react';
import { Chip, chipContext } from './Chip.jsx';
import { Fieldset } from './Fieldset.jsx';

/* The group IS the component. A chip on its own is a toggle Button: it has no
   question above it, no set to be one of, and no value. Everything that makes
   a chip row a control lives here — the legend, the generated name, the
   selection model, the message row — and Chip.jsx is only the paint.

   Split out of Chip.jsx in 1.17.0. It had shipped as a second export of the
   file it depends on, which meant the system's only grouped core control had
   no spec, no .d.ts of its own and no card, while the four sections that
   actually govern it (selection semantics, keyboard, name collisions, the
   seven-option ceiling) were documented inside Chip's spec as asides.

   The semantics are native: single-select is same-name radios, multi-select
   is checkboxes, both visually hidden behind <label> chips. So there is no
   roving tabindex, no aria-checked bookkeeping and no key handling in this
   file — the platform ships one tab stop with wrapping arrow selection and
   disabled-skipping, and every hand-rolled segmented control gets one of
   those three wrong. */

export function ChipGroup({
  label,
  hint,
  error,
  options,
  children,
  value,
  onChange,
  multiple = false,
  required = false,
  disabled = false,
  size = 'md',
  name,
  /* Token, not 8: freeze criterion 3 — a product re-scaling the space
     scale must not leave this row on a private number. */
  gap = 'var(--space-2)',
  style,
  ...rest
}) {
  const autoId = React.useId();
  /* Generated, so a group rendered per table row cannot collide into one
     radio set — selecting in row four silently clearing row one is the
     defect this closes, same as RadioGroup 1.2.0. */
  const groupName = name || `chip-${autoId}`;
  const items = options || [];
  const childList = React.Children.toArray(children).filter(Boolean);

  if (!label && rest['aria-label'] == null && rest['aria-labelledby'] == null) {
    console.warn('[Meridian] ChipGroup: no `label`. A set of options with no question announces as loose controls — pass the question the chips answer ("Shift", "Areas").');
  }
  if ((items.length || childList.length) < 2) {
    console.warn('[Meridian] ChipGroup: fewer than two options. One chip is a toggle Button.');
  }
  if (items.length && childList.length) {
    console.warn('[Meridian] ChipGroup: both `options` and children. The children render after the options, outside the value model — pass one or the other.');
  }
  if (!multiple && Array.isArray(value)) {
    console.warn('[Meridian] ChipGroup: array `value` without `multiple`. Single-select holds one string.');
  }
  if (items.length > 7) {
    console.warn('[Meridian] ChipGroup: more than seven options. Past about seven the row wraps into a block nobody scans — use Select for a known list, Combobox for a searchable one.');
  }

  /* Selection order is the OPTION order, never the click order, so a saved
     value round-trips identically however the user built it. Children are
     read for their values too — the 1.9.0 implementation only ordered
     `options`, and fell back to click order for chip children. */
  const order = items.length
    ? items.map((o) => o.value)
    : childList.map((c) => c.props?.value).filter((v) => v != null);

  /* '' and null are the normal UNANSWERED state of a single-select group, so
     they are not a mismatch — warning on them would fire on every required
     group in a product before the user has touched it. */
  if (value != null && value !== '' && order.length) {
    const missing = (multiple ? (Array.isArray(value) ? value : []) : [value]).filter((v) => v != null && v !== '' && order.indexOf(v) === -1);
    if (missing.length) {
      console.warn(`[Meridian] ChipGroup: value ${JSON.stringify(missing)} matches no option, so nothing appears selected — a silent mismatch between the form model and the offered set.`);
    }
  }

  const selectedSet = multiple ? new Set(Array.isArray(value) ? value : []) : null;

  /* HTML needs `required` on exactly ONE radio of a set; on every input some
     browsers report the group unsatisfied even after a sibling is checked.
     There is no checkbox equivalent — "at least one of these" is not a native
     constraint — so `multiple` + `required` marks the legend and leaves the
     rule to the form and to `hint`. */
  const requiredValue = required && !multiple && !disabled
    ? (items.length ? items.find((o) => !o.disabled)?.value : order[0])
    : undefined;

  const ctx = {
    name: groupName,
    type: multiple ? 'checkbox' : 'radio',
    size,
    disabled,
    required,
    requiredValue,
    isSelected: (v) => (multiple ? selectedSet.has(v) : value === v),
    onToggle: (v, e) => {
      if (!onChange) return;
      if (!multiple) { onChange(v, e); return; }
      const next = new Set(selectedSet);
      next.has(v) ? next.delete(v) : next.add(v);
      onChange(order.length ? order.filter((k) => next.has(k)) : Array.from(next), e);
    },
  };

  return (
    <Fieldset {...rest} label={label} hint={hint} error={error} required={required} disabled={disabled} style={style}>
      <chipContext.Provider value={ctx}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap, minWidth: 0 }}>
          {items.map((o) => (
            <Chip key={o.value} value={o.value} label={o.label} icon={o.icon} count={o.count} disabled={o.disabled} />
          ))}
          {children}
        </div>
      </chipContext.Provider>
    </Fieldset>
  );
}
