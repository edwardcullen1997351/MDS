import React from 'react';
import { Box } from '../primitives/Box.jsx';
import { Button } from '../core/Button.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Menu } from '../navigation/Menu.jsx';

/* One default action with its close alternatives one press away:
   [Save][⌄]. The composite owns the relationship — which action is primary,
   that the disclosure never invokes it, one aggregate disabled state, two
   distinct accessible purposes, and the menu's ownership by the cap rather
   than by the lettered half. See the SplitButton spec, §01.

   NOT ButtonGroup (peer actions, no default), NOT a Menu with a fancy
   trigger (no primary action at all), and NOT a way to save horizontal
   space. */

/* Button and IconButton do not share a variant vocabulary. IconButton gained
   a `danger` fill (1.27.x, additive) so a destructive default action's cap is
   no longer forced to draw in action blue. */
const CAP_VARIANT = { primary: 'solid', secondary: 'outline', ghost: 'ghost', danger: 'danger' };

const flat = (list, out = []) => {
  for (const a of list || []) {
    if (a == null || a === 'divider' || a === '-' || a.divider) continue;
    if (a.items) flat(a.items, out);
    else out.push(a);
  }
  return out;
};

export function SplitButton({
  label,
  children,
  onAction,
  actions = [],
  onSelect,
  variant = 'primary',
  size = 'md',
  iconLeft,
  loading = false,
  disabled = false,
  open,
  onOpenChange,
  menuLabel,
  disclosureLabel,
  disclosureIcon = 'chevron-down',
  side = 'bottom',
  align = 'end',
  menuSize,
  style,
  ...rest
}) {
  /* Only the hovered or focused half is raised, so its border and its 3px
     focus ring draw over its neighbour instead of being clipped by it. */
  const [raised, setRaised] = React.useState(-1);

  const rows = flat(actions);

  if (!label) {
    console.warn('[Meridian] SplitButton: `label` is required — it names the primary action, the disclosure ("More <label> actions") and the menu. Without it the group is announced as an unnamed pair of buttons and the cap has no purpose of its own.');
  }
  if (!rows.length) {
    console.warn('[Meridian] SplitButton: no `actions`. A split button with an empty menu is a Button with a dead cap — render a Button instead.');
  }
  if (rows.some((a) => a.id == null)) {
    console.warn('[Meridian] SplitButton: every action needs a stable `id`. Selection is reported by identity, and an index changes the moment the alternatives are reordered or filtered.');
  }
  if (label && rows.some((a) => typeof a.label === 'string' && a.label.trim().toLowerCase() === String(label).trim().toLowerCase())) {
    console.warn('[Meridian] SplitButton: an action repeats the primary label "' + label + '". Two routes to the same command make the menu look like the real control — remove it unless a keyboard-only duplicate is a stated requirement.');
  }
  if (!CAP_VARIANT[variant]) {
    /* `link` has no height and no border, so there is nothing to form a seam
       with. Coerced rather than dropped — the action still renders. */
    console.warn('[Meridian] SplitButton: variant "' + variant + '" is not supported — a split button needs a bordered, control-height half on both sides to read as one control. Rendering as "secondary". Supported: primary, secondary, ghost, danger.');
  }
  const v = CAP_VARIANT[variant] ? variant : 'secondary';

  const h = `var(--control-h-${['sm', 'md', 'lg'].indexOf(size) > -1 ? size : 'md'})`;
  const r = 'var(--split-button-radius)';
  const bw = 'calc(var(--border-width) * -1)';

  /* The seam is drawn once, by the cap: a solid half has a transparent
     border, so the divider has to be the fill's own inverse; an outlined
     half shares one border colour across the whole control, held steady
     while either half is hovered. */
  const seam = v === 'primary' || v === 'danger'
    ? { borderLeft: 'var(--border-width) solid var(--split-button-seam-solid)' }
    : v === 'ghost'
      ? { borderLeft: 'var(--border-width) solid var(--split-button-divider)' }
      : { borderColor: 'var(--split-button-border)' };

  const pick = (row, i) => {
    const src = rows.find((a) => a.id != null && a.id === row.id) || row;
    onSelect?.(src, i);
  };

  /* The raise listeners go on a wrapper, not on the halves: Button and
     IconButton spread the caller's props AFTER their own pointer and focus
     handlers, so an onMouseEnter passed in would silently replace their
     hover state and the halves would stop reacting to the pointer. */
  const half = (i) => ({
    onMouseEnter: () => setRaised(i),
    onMouseLeave: () => setRaised(-1),
    onFocusCapture: () => setRaised(i),
    onBlurCapture: () => setRaised(-1),
    style: { display: 'inline-flex', position: 'relative', minWidth: 0, zIndex: raised === i ? 1 : 0 },
  });

  return (
    <Box
      role="group"
      aria-label={label}
      {...rest}
      display="inline-flex"
      style={{ isolation: 'isolate', maxWidth: '100%', ...style }}
    >
      <span {...half(0)}>
      <Button
        variant={v}
        size={size}
        iconLeft={iconLeft}
        loading={loading}
        disabled={disabled}
        /* Named explicitly only when the visible content is not the name. */
        aria-label={children ? label : undefined}
        onClick={onAction}
        style={{
          borderRadius: `${r} 0 0 ${r}`,
          minWidth: 0,
          ...(v === 'secondary' ? { borderColor: 'var(--split-button-border)' } : null),
        }}
      >
        {children ?? label}
      </Button>
      </span>
      <span {...half(1)}>
      <Menu
        trigger={(
          <IconButton
            icon={disclosureIcon}
            /* A distinct purpose, not a second "Save": the cap opens the
               alternatives, and says whose alternatives they are. */
            label={disclosureLabel || 'More ' + (label || 'actions') + ' actions'}
            variant={CAP_VARIANT[v]}
            size={size}
            disabled={disabled || !rows.length}
            style={{
              /* IconButton sizes from --control-h-* (1.27.x), so the two
                 halves stay the same height at every density; the width is
                 pinned to the same token to keep the cap square. */
              width: h,
              marginLeft: bw,
              borderRadius: `0 ${r} ${r} 0`,
              ...seam,
            }}
          />
        )}
        items={actions}
        label={menuLabel || (label ? label + ' actions' : undefined)}
        open={open}
        onOpenChange={onOpenChange}
        onSelect={pick}
        side={side}
        align={align}
        size={menuSize || (size === 'sm' ? 'sm' : 'md')}
      />
      </span>
    </Box>
  );
}
