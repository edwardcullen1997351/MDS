import React from 'react';
import { Icon } from './Icon.jsx';

/* The box reads the control tokens rather than literal pixels — the spec
   (§05) has always said 28/34/40 come from --control-h-*, and hard-coded
   numbers silently ignored [data-density]: a compact toolbar drew 34px icon
   buttons beside 28px Buttons. The icon step deliberately does NOT follow
   density, so the glyph stays legible. */
const SIZES = {
  sm: { box: 'var(--control-h-sm)', icon: 14 },
  md: { box: 'var(--control-h-md)', icon: 16 },
  lg: { box: 'var(--control-h-lg)', icon: 18 },
};

/* forwardRef since 1.19.1 — see Button.jsx. A close affordance an overlay
   wants to focus on open is the exact case. */
export const IconButton = React.forwardRef(function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  selected = false,
  disabled = false,
  style,
  ...rest
}, ref) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const solid = variant === 'solid';
  const outline = variant === 'outline';
  /* A filled critical action — the counterpart of Button's `danger`, added
     so a destructive icon action (and a destructive SplitButton cap) is not
     forced to draw in action blue. */
  const danger = variant === 'danger';

  let bg = 'transparent';
  let fg = 'var(--icon-button-foreground)';
  let bc = outline ? 'var(--icon-button-border)' : 'transparent';
  if (danger) { bg = down ? 'var(--icon-button-critical-background-active)' : hover ? 'var(--icon-button-critical-background-hover)' : 'var(--icon-button-critical-background)'; fg = 'var(--icon-button-critical-foreground)'; }
  else if (solid) { bg = down ? 'var(--icon-button-solid-background-active)' : hover ? 'var(--icon-button-solid-background-hover)' : 'var(--icon-button-solid-background)'; fg = 'var(--icon-button-solid-foreground)'; }
  else if (selected) { bg = 'var(--icon-button-background-selected)'; fg = 'var(--icon-button-foreground-selected)'; }
  else if (down) { bg = 'var(--icon-button-background-active)'; fg = 'var(--icon-button-foreground-hover)'; }
  else if (hover) { bg = 'var(--icon-button-background-hover)'; fg = 'var(--icon-button-foreground-hover)'; }
  if (disabled) { bg = 'transparent'; fg = 'var(--icon-button-foreground-disabled)'; }

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={selected || undefined}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setDown(false); }}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: s.box,
        height: s.box,
        padding: 0,
        color: fg,
        background: bg,
        border: `var(--border-width) solid ${disabled && outline ? 'var(--icon-button-border-disabled)' : bc}`,
        borderRadius: 'var(--icon-button-radius)',
        boxShadow: focus && !disabled ? 'var(--button-focus-ring)' : solid || danger ? 'var(--button-primary-shadow)' : 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-control)',
        ...style,
      }}
    >
      <Icon name={icon} size={s.icon} />
    </button>
  );
});
