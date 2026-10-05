import React from 'react';
import { Icon } from './Icon.jsx';

/* Chip is the *offered option*: one of a closed set the design authored, all
   of them visible at once, chosen by the user. That is a third thing from the
   two components it gets confused with, and the boundary is worth stating in
   code because it is the only reason this component exists:

   · Badge  — a condition the SYSTEM determined. Read, never chosen.
   · Tag    — a value the DATA or the USER supplied. Open-ended set, mono,
              removable, 20/24px.
   · Chip   — an option the UI OFFERS. Closed set, sans, never removable,
              full control height, and only ever inside a labelled ChipGroup.

   This file is only the paint. The legend, the generated name, the selection
   model and the message row live in ChipGroup.jsx (split out in 1.17.0);
   the semantics are native, so there is no roving tabindex, no aria-checked
   bookkeeping and no key handling in either file. */

/* Exported for ChipGroup.jsx, which owns the group. Lowercase deliberately:
   only capital-initial exports reach window.<Namespace>, so the context
   stays internal to the system instead of appearing beside the components
   as something a product could import. Same rule as anchor.js's useAnchor. */
export const chipContext = React.createContext(null);

const SIZES = {
  sm: { h: 'var(--chip-height-sm)', px: 'var(--chip-padding-sm)', gap: 6, text: 'var(--text-xs)', icon: 'xs' },
  md: { h: 'var(--chip-height-md)', px: 'var(--chip-padding-md)', gap: 7, text: 'var(--text-sm)', icon: 'sm' },
};

export function Chip({
  label,
  children,
  value,
  icon,
  count,
  selected,
  disabled = false,
  size,
  style,
  ...rest
}) {
  const group = React.useContext(chipContext);
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const text = label ?? children;
  const S = SIZES[size || group?.size || 'md'] || SIZES.md;
  const on = selected ?? (group ? group.isSelected(value) : false);
  const off = disabled || group?.disabled;

  if (!group) {
    console.warn(
      '[Meridian] Chip: rendered outside a ChipGroup. A chip is one of a set — ' +
      'a single chip standing alone is a toggle Button, and outside a group it ' +
      'has no name, no legend and no selection semantics.'
    );
  }

  const bg = off
    ? 'var(--chip-background-disabled)'
    : on
      ? hover ? 'var(--chip-background-selected-hover)' : 'var(--chip-background-selected)'
      : hover ? 'var(--chip-background-hover)' : 'var(--chip-background)';

  return (
    <label
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: S.gap,
        height: S.h,
        padding: `0 ${S.px}`,
        fontFamily: 'var(--font-sans)',
        fontSize: S.text,
        fontWeight: on ? 'var(--weight-medium)' : 'var(--weight-regular)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        color: off ? 'var(--chip-foreground-disabled)' : on ? 'var(--chip-foreground-selected)' : 'var(--chip-foreground)',
        background: bg,
        border: `var(--border-width) solid ${off ? 'var(--chip-border-disabled)' : on ? 'var(--chip-border-selected)' : hover ? 'var(--chip-border-hover)' : 'var(--chip-border)'}`,
        borderRadius: 'var(--chip-radius)',
        boxShadow: focus ? 'var(--chip-focus-ring)' : 'none',
        cursor: off ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-control)',
        ...style,
      }}
    >
      <input
        type={group?.type || 'checkbox'}
        name={group?.name}
        value={value}
        checked={on}
        disabled={off}
        /* HTML needs `required` on exactly one radio of a set; the group
           picks which one. On every input, some browsers report the set
           unsatisfied even after a sibling is checked. */
        required={group?.requiredValue != null && group.requiredValue === value ? true : undefined}
        onChange={(e) => { group?.onToggle(value, e); rest.onChange?.(e); }}
        /* :focus-visible, so a pointer click does not leave a ring behind. */
        onFocus={(e) => { setFocus(e.target.matches(':focus-visible')); rest.onFocus?.(e); }}
        onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
        {...rest}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      />
      {/* The check gutter is always present, selected or not: revealing a
          glyph on selection would widen the chip and re-flow the whole row
          under the cursor that just clicked it. */}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          flex: '0 0 auto', width: 'var(--chip-check-size)', height: 'var(--chip-check-size)',
          opacity: on ? 1 : 0, transition: 'var(--transition-control)',
        }}
      >
        <Icon name="check" size="mark" />
      </span>
      {icon && <Icon name={icon} size={S.icon} style={{ color: off ? 'inherit' : on ? 'inherit' : 'var(--chip-icon)' }} />}
      <span style={{ minWidth: 0 }}>{text}</span>
      {count != null && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)',
          fontVariantNumeric: 'tabular-nums',
          color: off ? 'inherit' : on ? 'inherit' : 'var(--chip-count-foreground)',
        }}>{count}</span>
      )}
    </label>
  );
}
