import React from 'react';
import { Fieldset } from '../core/Fieldset.jsx';
import { Radio } from './Radio.jsx';

export function RadioGroup({
  label,
  hint,
  error,
  required = false,
  options = [],
  value,
  defaultValue,
  onChange,
  emptyOption,
  name,
  disabled = false,
  children,
  style,
  ...rest
}) {
  const autoId = React.useId();
  /* The name is generated, so a set rendered twice on one page (two table
     rows, a repeated section) cannot collide into a single group — the
     classic radio bug, and one the caller should not have to think about. */
  const groupName = name || `${autoId}-radio`;
  const items = options.map((o) => (typeof o === 'string' ? { value: o, label: o } : o));
  const [inner, setInner] = React.useState(defaultValue ?? value ?? '');
  const selected = onChange ? (value ?? '') : inner;

  const commit = (next) => {
    if (onChange) onChange(next);
    else setInner(next);
  };

  if (!label) {
    console.warn('[Meridian] RadioGroup: `label` is required. Without a group name each option is announced with no question — "First stop, radio button, selected, 1 of 3" tells the user nothing about what is being decided.');
  }
  if (!children && items.length < 2) {
    console.warn('[Meridian] RadioGroup: a one-option radio group cannot be answered any other way, and cannot be cleared. If the choice is yes/no use a single Checkbox or a Switch.');
  }
  if (children && items.length > 0) {
    console.warn('[Meridian] RadioGroup: `options` and `children` are alternatives — rendering `children` and ignoring `options`.');
  }
  if (items.length > 5) {
    console.warn(`[Meridian] RadioGroup: ${items.length} options. Past five, the set stops being scannable and costs a screen of vertical space for one value — use <Select> with a <Field>.`);
  }
  if (selected && items.length > 0 && !items.some((o) => o.value === selected)) {
    console.warn(`[Meridian] RadioGroup: value "${selected}" matches no option, so the group renders with nothing selected. A radio set cannot be cleared by the user, so this state is unreachable by hand and usually means a typo or a stale stored value.`);
  }

  return (
    <Fieldset {...rest} label={label} hint={hint} error={error} required={required} disabled={disabled} style={style}>
      {/* Vertical only: the options are compared, so they share a left edge. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0 }}>
        {children || (
          <React.Fragment>
            {emptyOption && (
              <Radio
                name={groupName}
                value=""
                label={emptyOption}
                disabled={disabled}
                checked={selected === ''}
                onChange={() => commit('')}
              />
            )}
            {items.map((o) => (
              <Radio
                key={o.value}
                name={groupName}
                value={o.value}
                label={o.label}
                description={o.description}
                disabled={disabled || o.disabled}
                checked={selected === o.value}
                onChange={() => commit(o.value)}
              />
            ))}
          </React.Fragment>
        )}
      </div>
    </Fieldset>
  );
}
