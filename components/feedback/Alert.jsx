import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';

/* Alert — a condition, stated in the page, that stays until the condition
   goes away.

   This is the third and last member of the notice family, and the only
   persistent one: Toast is an event in the corner, Snackbar is an event on a
   surface, Alert is STATE in the flow. That is why it has no timer, no
   position, no z-index and no portal — it is laid out like any other block,
   and it disappears because the product stopped rendering it, not because
   time passed.

   Two consequences worth knowing before reading the code:
   • It is not announced by default. An alert that is on the page when the
     page loads has already been read in document order; only one that
     APPEARS in response to something needs `live`.
   • The tone colour never carries the message on its own. Every alert has a
     title in words, and the icon is decorative. */

const TONES = {
  info: { icon: 'info', bg: 'var(--alert-info-background)', border: 'var(--alert-info-border)', ic: 'var(--alert-info-icon)', title: 'var(--alert-info-title)' },
  success: { icon: 'circle-check', bg: 'var(--alert-success-background)', border: 'var(--alert-success-border)', ic: 'var(--alert-success-icon)', title: 'var(--alert-success-title)' },
  warning: { icon: 'triangle-alert', bg: 'var(--alert-warning-background)', border: 'var(--alert-warning-border)', ic: 'var(--alert-warning-icon)', title: 'var(--alert-warning-title)' },
  danger: { icon: 'circle-alert', bg: 'var(--alert-critical-background)', border: 'var(--alert-critical-border)', ic: 'var(--alert-critical-icon)', title: 'var(--alert-critical-title)' },
  neutral: { icon: 'info', bg: 'var(--alert-neutral-background)', border: 'var(--alert-neutral-border)', ic: 'var(--alert-neutral-icon)', title: 'var(--alert-neutral-title)' },
};

export function Alert({
  tone = 'info',
  title,
  children,
  icon,
  action,
  onDismiss,
  size = 'md',
  variant = 'inline',
  live = 'off',
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.info;
  const banner = variant === 'banner';
  const sm = size === 'sm';

  if (!title && !children) {
    /* The failure this component is most often used to cause: a coloured
       block with no words, or a paragraph with no heading to scan. */
    console.warn('[Meridian] Alert: needs a title, body content, or both. A tinted block with no words carries its meaning in colour alone, which fails WCAG 1.4.1.');
  }
  if (onDismiss && tone === 'danger') {
    console.warn('[Meridian] Alert: a dismissible danger alert lets the user hide a condition that is still true. Remove onDismiss, or resolve the condition instead of silencing it.');
  }

  return (
    <div
      /* role="alert" is assertive and interrupts — correct for a condition
         that just arose, wrong for one that was already on the page. So the
         default is a plain region: read in document order, like the prose
         around it. */
      role={live === 'off' ? 'group' : tone === 'danger' ? 'alert' : 'status'}
      aria-live={live === 'off' ? undefined : tone === 'danger' ? 'assertive' : 'polite'}
      data-alert={tone}
      data-alert-variant={variant}
      {...rest}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--alert-gap)',
        padding: sm ? 'var(--alert-padding-sm)' : 'var(--alert-padding-md)',
        background: t.bg,
        /* A banner spans the app frame edge to edge, so it keeps only the
           bottom rule and loses its radius: a rounded card wedged against
           two window edges reads as a mistake. The longhands are spread in
           only on that branch — an `undefined` longhand still assigns '' in
           React and would clear the shorthand above it. */
        ...(banner
          ? { border: 'none', borderBottom: `var(--border-width) solid ${t.border}`, borderLeft: `var(--alert-accent-width) solid ${t.ic}`, borderRadius: 0 }
          : { border: `var(--border-width) solid ${t.border}`, borderRadius: 'var(--alert-radius)' }),
        ...style,
      }}
    >
      {icon !== false && <Icon name={icon || t.icon} size={sm ? 14 : 16} style={{ color: t.ic, marginTop: sm ? 1 : 2, flex: 'none' }} aria-hidden="true" />}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: children && title ? 'var(--space-1)' : 0 }}>
        {title && (
          <div style={{ fontSize: sm ? 'var(--text-xs)' : 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: t.title, lineHeight: 'var(--leading-snug)' }}>{title}</div>
        )}
        {children && (
          /* Body copy is neutral, not the tone's text colour: a paragraph in
             red-700 is a headline pretending to be prose. */
          <div style={{ fontSize: sm ? 'var(--text-xs)' : 'var(--text-sm)', color: title ? 'var(--alert-body-text)' : 'var(--alert-title-text)', lineHeight: 'var(--leading-normal)', textWrap: 'pretty' }}>{children}</div>
        )}
        {action && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>{action}</div>}
      </div>
      {onDismiss && (
        <IconButton icon="x" label="Dismiss" size="sm" variant="ghost" onClick={onDismiss} style={{ color: 'var(--alert-dismiss-icon)', flex: 'none' }} />
      )}
    </div>
  );
}
