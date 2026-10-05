import React from 'react';
import { Icon } from './Icon.jsx';

const SIZES = {
  sm: { h: 'var(--control-h-sm)', px: 'var(--control-px-sm)', fs: 'var(--text-xs)', icon: 14, gap: 5 },
  md: { h: 'var(--control-h-md)', px: 'var(--control-px-md)', fs: 'var(--text-sm)', icon: 16, gap: 6 },
  lg: { h: 'var(--control-h-lg)', px: 'var(--control-px-lg)', fs: 'var(--text-base)', icon: 16, gap: 7 },
};

function palette(variant, state) {
  const on = (rest, hover, active) => (state === 'active' ? active : state === 'hover' ? hover : rest);
  switch (variant) {
    case 'secondary':
      return {
        bg: on('var(--button-secondary-background)', 'var(--button-secondary-background-hover)', 'var(--button-secondary-background-active)'),
        fg: 'var(--button-secondary-foreground)',
        bc: on('var(--button-secondary-border)', 'var(--button-secondary-border-hover)', 'var(--button-secondary-border-hover)'),
        sh: 'var(--button-primary-shadow)',
      };
    case 'ghost':
      return {
        bg: on('transparent', 'var(--button-ghost-background-hover)', 'var(--button-ghost-background-active)'),
        fg: state === 'rest' ? 'var(--button-ghost-foreground)' : 'var(--button-ghost-foreground-hover)',
        bc: 'transparent',
        sh: 'none',
      };
    case 'danger':
      return {
        bg: on('var(--button-critical-background)', 'var(--button-critical-background-hover)', 'var(--button-critical-background-active)'),
        fg: 'var(--button-critical-foreground)',
        bc: 'transparent',
        sh: 'var(--button-primary-shadow)',
      };
    case 'link':
      return {
        bg: 'transparent',
        fg: on('var(--button-link-foreground)', 'var(--button-link-foreground-hover)', 'var(--button-link-foreground-active)'),
        bc: 'transparent',
        sh: 'none',
      };
    default:
      return {
        bg: on('var(--button-primary-background)', 'var(--button-primary-background-hover)', 'var(--button-primary-background-active)'),
        fg: 'var(--button-primary-foreground)',
        bc: 'transparent',
        sh: 'var(--button-primary-shadow)',
      };
  }
}

/* forwardRef since 1.19.1: the ref reaches the <button>, which is what makes
   `initialFocus` real. Dialog and Drawer both document "point initialFocus at
   Cancel", and with a plain function component that ref never populated —
   React logged a warning and the layer silently fell back to focusing the
   first field. A documented pattern that no-ops is worse than a missing
   feature, because nobody checks a ref they were told to pass. */
export const Button = React.forwardRef(function Button({
  variant = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  children,
  style,
  ...rest
}, ref) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const off = disabled || loading;
  const p = palette(variant, off ? 'rest' : down ? 'active' : hover ? 'hover' : 'rest');
  const bare = variant === 'link';

  return (
    <button
      ref={ref}
      type={type}
      disabled={off}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setDown(false); }}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      {...rest}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: bare ? 'auto' : s.h,
        padding: bare ? 0 : `0 ${s.px}`,
        font: 'inherit',
        fontFamily: 'var(--font-sans)',
        fontSize: s.fs,
        fontWeight: 'var(--weight-medium)',
        letterSpacing: 'var(--tracking-body)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        color: off ? 'var(--button-disabled-foreground)' : p.fg,
        background: off && !bare ? 'var(--button-disabled-background)' : p.bg,
        border: `var(--border-width) solid ${off && !bare ? 'var(--button-disabled-border)' : p.bc}`,
        borderRadius: 'var(--button-radius)',
        boxShadow: focus && !off ? 'var(--button-focus-ring)' : off ? 'none' : p.sh,
        textDecoration: bare && hover && !off ? 'underline' : 'none',
        textUnderlineOffset: 2,
        cursor: off ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-control)',
        ...style,
      }}
    >
      {/* It spins. Until 1.20.0 this carried animation: 'none' — a loading
          state whose only cue was a static glyph that reads as a decorative
          icon, so a pressed button looked merely disabled. --anim-spin is
          the system's one permitted rotation, and reduced motion stops it,
          which is survivable only because the button is also disabled and
          its label still says what it is doing. */}
      {loading ? <Icon name="loader-circle" size={s.icon} style={{ animation: 'var(--anim-spin)', opacity: 0.7 }} /> : iconLeft ? <Icon name={iconLeft} size={s.icon} /> : null}
      {children}
      {iconRight ? <Icon name={iconRight} size={s.icon} /> : null}
    </button>
  );
});
