import React from 'react';
import { Icon } from './Icon.jsx';

/* One value, two to four options, all visible, in the width of a toolbar
   button row. The system already had two components that look like this and
   neither one is it:

   · Tabs variant="pill"  — same paint, different job. A tablist OWNS PANELS:
     aria-controls, a tabpanel per tab, and content that is replaced. If the
     press swaps a region of the page, that is Tabs and this component is the
     wrong answer.
   · ChipGroup            — the labelled option set. It wraps, it counts, it
     goes multi-select, and its question is visible above it. That is a
     filter row, not a mode switch: chips answer "which of these?", a
     segmented control answers "which one am I in?".
   · ButtonGroup          — deliberately holds no selected state (its spec
     §01). Joined buttons that remember a choice are this component.

   So: this is the VALUE control with the pill's appearance. It sets a value
   in a toolbar or a form and owns nothing else on the page.

   Semantics are native radios behind <label>s, exactly as Chip does it —
   one tab stop, arrows move and wrap, disabled options skip, and selection
   follows focus because every option is already rendered and switching is
   free. No roving tabindex, no aria-checked bookkeeping, no key handler in
   this file. Every hand-rolled segmented control gets one of those wrong. */

const SIZES = {
  sm: { h: 'var(--segmented-height-sm)', px: 'var(--segmented-padding-sm)', gap: 6, text: 'var(--text-xs)', icon: 'xs' },
  md: { h: 'var(--segmented-height-md)', px: 'var(--segmented-padding-md)', gap: 7, text: 'var(--text-sm)', icon: 'sm' },
};

function Segment({ option, checked, name, size, groupDisabled, iconOnly, onSelect, grow }) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const S = SIZES[size] || SIZES.md;
  const off = groupDisabled || option.disabled;
  const label = option.label;

  return (
    <label
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={iconOnly && typeof label === 'string' ? label : undefined}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: S.gap,
        minWidth: 0,
        flex: grow ? '1 1 auto' : '0 0 auto',
        height: S.h,
        padding: iconOnly ? 0 : `0 ${S.px}`,
        width: iconOnly ? S.h : undefined,
        fontFamily: 'var(--font-sans)',
        fontSize: S.text,
        /* Medium on the selected segment only. The label must not change
           WIDTH on selection or the track jitters, so the weight step is
           paired with equal-width columns by default (§05). */
        fontWeight: checked ? 'var(--weight-medium)' : 'var(--weight-regular)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        color: off
          ? 'var(--segmented-foreground-disabled)'
          : checked
            ? 'var(--segmented-foreground-selected)'
            : hover ? 'var(--segmented-foreground-hover)' : 'var(--segmented-foreground)',
        background: checked
          ? 'var(--segmented-background-selected)'
          : hover && !off ? 'var(--segmented-background-hover)' : 'transparent',
        border: `var(--border-width) solid ${checked ? 'var(--segmented-border-selected)' : 'transparent'}`,
        borderRadius: 'var(--segmented-radius)',
        boxShadow: focus
          ? 'var(--segmented-focus-ring)'
          : checked ? 'var(--segmented-shadow-selected)' : 'none',
        cursor: off ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-control)',
        userSelect: 'none',
      }}
    >
      <input
        type="radio"
        name={name}
        value={option.value}
        checked={checked}
        disabled={off}
        onChange={(e) => onSelect(option.value, e)}
        /* :focus-visible, so a pointer press does not leave a ring behind. */
        onFocus={(e) => setFocus(e.target.matches(':focus-visible'))}
        onBlur={() => setFocus(false)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, margin: 0 }}
      />
      {option.icon && (
        <Icon
          name={option.icon}
          size={S.icon}
          title={iconOnly && typeof label === 'string' ? label : undefined}
          style={{ color: off ? 'inherit' : checked ? 'var(--segmented-icon-selected)' : 'inherit' }}
        />
      )}
      {!iconOnly && (
        /* The label reserves its BOLD width at all times: a hidden medium-weight
           copy sits in the same grid cell, so the cell is as wide as the
           selected state will ever need and selection cannot re-flow the
           track. Reserving the weight here rather than relying on equal
           columns is what lets the columns size to content — minmax(0,1fr)
           collapsed every label to an ellipsis at the track's intrinsic
           width, which is the defect this replaced. */
        <span style={{ display: 'inline-grid', minWidth: 0 }}>
          <span aria-hidden="true" style={{ gridArea: '1 / 1', fontWeight: 'var(--weight-medium)', visibility: 'hidden', overflow: 'hidden', whiteSpace: 'nowrap' }}>{label}</span>
          <span style={{ gridArea: '1 / 1', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        </span>
      )}
    </label>
  );
}

export function SegmentedControl({
  label,
  labelVisible = false,
  options = [],
  value,
  defaultValue,
  onChange,
  size = 'md',
  disabled = false,
  equalWidth = true,
  iconOnly = false,
  fullWidth = false,
  /* Vertical stacks the segments. NOT a general-purpose "make it a list":
     the four-option ceiling still holds, the track is still one fixed shape,
     and the divider still runs only between unselected neighbours — only the
     axis changes. A vertical control with nine options is a Radio group. */
  orientation = 'horizontal',
  name,
  style,
  ...rest
}) {
  const autoId = React.useId();
  /* Generated, so a control rendered per row or per card cannot collide into
     one radio set — switching row four silently clearing row one. Same rule
     as ChipGroup 1.17.0 and RadioGroup 1.2.0. */
  const groupName = name || `segmented-${autoId}`;
  const legendId = `${autoId}-legend`;
  const [inner, setInner] = React.useState(defaultValue ?? options[0]?.value);
  /* Controlled only when BOTH are present: a `value` with no `onChange` is a
     control that cannot move, which is the read-only-slider mistake. */
  const controlled = value !== undefined && typeof onChange === 'function';
  const current = controlled ? value : inner;

  if (!label && rest['aria-label'] == null && rest['aria-labelledby'] == null) {
    console.warn('[Meridian] SegmentedControl: no `label`. Pass the question the segments answer ("View", "Units") — it can stay visually hidden, but a set of unnamed radios announces as loose controls.');
  }
  if (options.length < 2) {
    console.warn('[Meridian] SegmentedControl: fewer than two options. One segment is a toggle Button.');
  }
  if (options.length > 4) {
    console.warn('[Meridian] SegmentedControl: more than four options. The track is fixed-width and every label must fit at once — use ChipGroup (wraps, up to seven) or Select.');
  }
  if (orientation === 'vertical' && iconOnly) {
    console.warn('[Meridian] SegmentedControl: `vertical` with `iconOnly` is a toolbar, not a segmented control — a column of unlabelled glyphs has none of the side-by-side comparison this control exists for. Use ButtonGroup.');
  }
  if (value !== undefined && typeof onChange !== 'function') {
    console.warn('[Meridian] SegmentedControl: `value` without `onChange`. The control renders but cannot change — pass onChange, or use `defaultValue` for an uncontrolled control.');
  }
  if (iconOnly && options.some((o) => typeof o.label !== 'string' || !o.icon)) {
    console.warn('[Meridian] SegmentedControl: `iconOnly` needs every option to carry an `icon` and a STRING `label` — the label becomes the accessible name and the tooltip.');
  }
  if (current != null && options.length && !options.some((o) => o.value === current)) {
    console.warn(`[Meridian] SegmentedControl: value ${JSON.stringify(current)} matches no option, so no segment appears selected — a silent mismatch between the model and the offered set.`);
  }

  const vertical = orientation === 'vertical';

  const select = (v, e) => {
    if (!controlled) setInner(v);
    onChange?.(v, e);
  };

  return (
    <fieldset
      {...rest}
      disabled={disabled || undefined}
      aria-labelledby={label && !rest['aria-label'] && !rest['aria-labelledby'] ? legendId : undefined}
      style={{
        display: fullWidth ? 'block' : 'inline-block',
        margin: 0,
        padding: 0,
        border: 'none',
        minWidth: 0,
        ...style,
      }}
    >
      <legend
        id={legendId}
        style={labelVisible
          ? { padding: 0, marginBottom: 'var(--space-1)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--text-secondary)' }
          /* Visually hidden, not display:none — a hidden legend is still the
             group's accessible name, and display:none removes it from the
             tree entirely. */
          : { position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }}
      >
        {label}
      </legend>
      <div
        style={{
          /* Vertical is always a one-column grid: the segments must be equal
             WIDTH down a stack for the track to read as one object, which is
             the opposite axis from equalWidth's job horizontally. */
          display: vertical || equalWidth ? 'grid' : 'inline-flex',
          /* max-content as the track minimum, not 0: the track's intrinsic
             width must fit every label. 1fr still equalises whatever space is
             left, so fullWidth and a wide container give equal columns. */
          gridTemplateColumns: vertical ? 'minmax(max-content, 1fr)' : equalWidth ? `repeat(${options.length}, minmax(max-content, 1fr))` : undefined,
          alignItems: 'center',
          gap: 0,
          width: fullWidth || vertical ? '100%' : undefined,
          padding: 'var(--border-width)',
          background: disabled ? 'var(--segmented-track-background-disabled)' : 'var(--segmented-track-background)',
          border: `var(--border-width) solid var(--segmented-track-border)`,
          borderRadius: 'var(--segmented-track-radius)',
          boxSizing: 'border-box',
        }}
      >
        {options.map((o, i) => {
          const checked = o.value === current;
          /* A rule only between two unselected neighbours: beside the raised
             segment it reads as a seam, and the lift already separates. */
          const divided = i > 0 && !checked && options[i - 1].value !== current;
          /* The rule is a border on the segment's own left edge, never a
             element between segments: a divider element would occupy a grid
             column and the segments would stop being equal widths. It is
             transparent rather than absent so the 1px never re-flows. */
          return (
            <div
              key={o.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                minWidth: 0,
                /* The rule moves to the top edge when stacked — same rule,
                   same transparency trick so the 1px never re-flows. */
                [vertical ? 'borderTop' : 'borderLeft']: `var(--border-width) solid ${divided ? 'var(--segmented-divider)' : 'transparent'}`,
                transition: 'var(--transition-control)',
              }}
            >
              <Segment
                option={o}
                checked={checked}
                name={groupName}
                size={size}
                groupDisabled={disabled}
                iconOnly={iconOnly}
                onSelect={select}
                grow={equalWidth || fullWidth}
              />
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
