import React from 'react';
import { Icon } from './Icon.jsx';

/* Badge is the system's only *system-derived* chip: the word is one WE chose
   from a fixed set, and its colour therefore means something. Tag is the
   opposite — user- or data-derived text, monochrome, removable. That split is
   the whole rule: if a colour on the label would be an assertion nobody
   checked, it is a Tag.

   Three things the code enforces, because review kept finding them broken:
   · Badge is never interactive. It is a <span> with no handlers, no focus
     ring and no hover — a status label that responds to the cursor teaches
     people to click something that does nothing.
   · A badge always has an accessible name. A dot- or icon-only badge carries
     its meaning in colour alone (1.4.1), so it must be given aria-label.
   · A capped count keeps its true value in the accessible name: "99+" is a
     layout decision, not the number. */

const TONES = {
  neutral: ['var(--badge-neutral-background)', 'var(--badge-neutral-foreground)', 'var(--badge-neutral-border)', 'var(--badge-neutral-dot)'],
  accent: ['var(--badge-accent-background)', 'var(--badge-accent-foreground)', 'var(--badge-accent-border)', 'var(--badge-accent-dot)'],
  success: ['var(--badge-success-background)', 'var(--badge-success-foreground)', 'var(--badge-success-border)', 'var(--badge-success-dot)'],
  warning: ['var(--badge-warning-background)', 'var(--badge-warning-foreground)', 'var(--badge-warning-border)', 'var(--badge-warning-dot)'],
  critical: ['var(--badge-critical-background)', 'var(--badge-critical-foreground)', 'var(--badge-critical-border)', 'var(--badge-critical-dot)'],
};
/* `danger` shipped first; the token layer and every other component say
   `critical`. Both resolve, `critical` is the documented name. */
TONES.danger = TONES.critical;

const SIZES = {
  sm: { h: 'var(--badge-height-sm)', px: 'var(--badge-padding-sm)', gap: 'var(--badge-gap-sm)', text: 'var(--text-2xs)', icon: 'mark' },
  md: { h: 'var(--badge-height-md)', px: 'var(--badge-padding-md)', gap: 'var(--badge-gap-md)', text: 'var(--text-xs)', icon: 'xs' },
};

export function Badge({ tone = 'neutral', size = 'md', dot = false, icon, max, children, style, ...rest }) {
  const [bg, fg, bc, solid] = TONES[tone] || TONES.neutral;
  const S = SIZES[size] || SIZES.md;

  /* A capped count. The label truncates, the accessible name does not. */
  const numeric = typeof children === 'number' || (typeof children === 'string' && /^\d+$/.test(children));
  const capped = max != null && numeric && Number(children) > max;
  const label = capped ? `${max}+` : children;

  const hasText = children != null && children !== '' && children !== false;
  const named = hasText || rest['aria-label'] || rest['aria-labelledby'];

  {
    if (!named) {
      console.warn(
        '[Meridian] Badge: no text and no aria-label — a dot or icon alone ' +
        'carries its meaning in colour, which fails WCAG 1.4.1. Pass a label ' +
        'or aria-label="Down".'
      );
    }
    if (dot && icon) {
      console.warn('[Meridian] Badge: `dot` and `icon` together read as two status marks. Pick one.');
    }
    if (rest.onClick || rest.href) {
      console.warn(
        '[Meridian] Badge: badges are not interactive. Use Button for an ' +
        'action, Link to navigate, or Tag for a value the user can toggle.'
      );
    }
  }

  return (
    <span
      data-badge=""
      {...(capped ? { 'aria-label': rest['aria-label'] ?? String(children), title: rest.title ?? String(children) } : null)}
      {...rest}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: S.gap,
        height: S.h,
        padding: `0 ${S.px}`,
        fontFamily: 'var(--font-sans)',
        fontSize: S.text,
        fontWeight: 'var(--weight-medium)',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        fontVariantNumeric: numeric ? 'tabular-nums' : undefined,
        color: fg,
        background: bg,
        border: `var(--border-width) solid ${bc}`,
        borderRadius: 'var(--badge-radius)',
        ...style,
      }}
    >
      {dot && (
        <span
          data-badge-dot=""
          aria-hidden="true"
          style={{
            width: 'var(--badge-dot-size)', height: 'var(--badge-dot-size)',
            borderRadius: 'var(--radius-pill)', background: solid, flex: '0 0 auto',
          }}
        />
      )}
      {icon && !dot && <Icon name={icon} size={S.icon} />}
      {label}
    </span>
  );
}
