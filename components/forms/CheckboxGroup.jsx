import React from 'react';
import { Fieldset } from '../core/Fieldset.jsx';
import { Checkbox } from './Checkbox.jsx';

export function CheckboxGroup({
  label,
  hint,
  error,
  required = false,
  options = [],
  value,
  defaultValue,
  onChange,
  selectAll,
  columns = 1,
  disabled = false,
  children,
  style,
  ...rest
}) {
  const autoId = React.useId();
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const [inner, setInner] = React.useState(defaultValue ?? value ?? []);
  const selected = onChange ? (value ?? []) : inner;

  const commit = (next) => {
    if (onChange) onChange(next);
    else setInner(next);
  };

  if (!label) {
    console.warn('[Meridian] CheckboxGroup: `label` is required. A set of boxes with no name is announced as an unlabelled group, which is the defect this component exists to prevent — if the boxes genuinely have no shared question, they are not a group.');
  }
  if (!children && items.length < 2) {
    console.warn('[Meridian] CheckboxGroup: a group of fewer than two options is a single Checkbox with extra scaffolding around it. Use <Checkbox label="…"> instead.');
  }
  if (children && items.length > 0) {
    console.warn('[Meridian] CheckboxGroup: `options` and `children` are alternatives — rendering `children` and ignoring `options`.');
  }
  const hasDescriptions = items.some((o) => o.description);
  if (columns > 1 && hasDescriptions) {
    console.warn('[Meridian] CheckboxGroup: columns > 1 with option descriptions puts two blocks of secondary text side by side, and the reading order stops being obvious. Rendering one column.');
    columns = 1;
  }

  const selectable = items.filter((o) => !o.disabled).map((o) => o.value);
  const allOn = selectable.length > 0 && selectable.every((v) => selected.includes(v));
  const someOn = selected.length > 0 && !allOn;

  return (
    /* The <fieldset>/<legend> scaffold is shared with RadioGroup and
       ChipGroup — see core/Fieldset.jsx. */
    <Fieldset {...rest} label={label} hint={hint} error={error} required={required} disabled={disabled} style={style}>
      {selectAll && !children && (
        <Checkbox
          label={selectAll}
          disabled={disabled}
          checked={allOn}
          indeterminate={someOn}
          onChange={() => commit(allOn ? [] : selectable)}
        />
      )}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.max(1, columns)}, minmax(0, 1fr))`,
        gap: 'var(--space-1) var(--space-6)',
        marginLeft: selectAll && !children ? 24 : 0,
        minWidth: 0,
      }}>
        {children || items.map((o) => (
          <Checkbox
            key={o.value}
            label={o.label}
            description={o.description}
            disabled={disabled || o.disabled}
            checked={selected.includes(o.value)}
            onChange={(e) => commit(e.target.checked ? [...selected, o.value] : selected.filter((v) => v !== o.value))}
          />
        ))}
      </div>
    </Fieldset>
  );
}
