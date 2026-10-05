import React from 'react';
import { IconButton } from '../core/IconButton.jsx';

/* Snackbar — one line of text and one action, anchored to the bottom of the
   surface that caused it.

   The difference from Toast is ownership, not styling. A toast is global,
   queued and raised imperatively from code that has no component in scope; a
   snackbar belongs to a surface — a table, a drawer, an editor — and that
   surface owns its state. So there is no store, no queue and no imperative
   API here: `open` is a prop, and exactly one snackbar exists per scope. A
   second message replaces the first, because two bars stacked at the bottom
   of a panel is a dialog nobody designed.

   It carries no tone: a bar whose point is "Undo" does not need a colour to
   say what happened, and a red bar across the bottom of a console competes
   with the alarm colours in the data. Failures that need a colour need a
   Toast or an inline error. */

const SIZES = {
  sm: { height: 'var(--snackbar-height-sm)', padding: 'var(--snackbar-padding-sm)', text: 'var(--text-xs)' },
  md: { height: 'var(--snackbar-height-md)', padding: 'var(--snackbar-padding-md)', text: 'var(--text-sm)' },
};

export function Snackbar({
  open = false,
  message,
  action,
  onDismiss,
  duration = 6000,
  size = 'md',
  scope = 'container',
  placement = 'floating',
  align = 'center',
  dismissible = true,
  style,
  ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const attached = placement === 'attached';
  const page = scope === 'page';
  const [paused, setPaused] = React.useState(false);

  /* The timer restarts when the message changes, so a replacement gets its
     own full lifetime rather than inheriting the remainder of the old one.
     Pausing clears the handle instead of extending it — same rule as Toast. */
  React.useEffect(() => {
    if (!open || duration == null || paused || !onDismiss) return undefined;
    const h = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(h);
  }, [open, message, duration, paused, onDismiss]);

  return (
    <div
      /* The region is always mounted, even when closed: a live region added
         to the DOM at the same moment as its content is announced
         unreliably, and this one has to survive message swaps. */
      role="status"
      aria-live="polite"
      aria-atomic="true"
      data-snackbar-region={scope}
      style={{
        position: page ? 'fixed' : 'absolute',
        zIndex: page ? 'var(--z-snackbar)' : 1,
        left: attached ? 0 : 'var(--snackbar-inset)',
        right: attached ? 0 : 'var(--snackbar-inset)',
        bottom: attached ? 0 : 'var(--snackbar-inset)',
        display: 'flex',
        justifyContent: align === 'start' ? 'flex-start' : 'center',
        pointerEvents: 'none',
      }}
    >
      {open && (
        <div
          data-snackbar={placement}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          {...rest}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--snackbar-gap)',
            minHeight: s.height,
            width: attached ? '100%' : 'auto',
            maxWidth: attached ? 'none' : 'var(--snackbar-max-width)',
            padding: `0 ${size === 'sm' ? 'var(--space-2)' : 'var(--space-3)'} 0 ${s.padding}`,
            background: 'var(--snackbar-background)',
            border: attached ? 'none' : 'var(--border-width) solid var(--snackbar-border)',
            borderTop: attached ? 'var(--border-width) solid var(--snackbar-attached-border)' : undefined,
            borderRadius: attached ? 0 : 'var(--snackbar-radius)',
            boxShadow: attached ? 'none' : 'var(--snackbar-shadow)',
            pointerEvents: 'auto',
            animation: `mer-rise-in var(--duration-base) var(--ease-out) both`,
            ...style,
          }}
        >
          <span
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: s.text,
              lineHeight: 'var(--leading-snug)',
              color: 'var(--snackbar-text)',
              /* One line. A snackbar that wraps to three is a Toast with a
                 message, or a banner. */
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {message}
          </span>
          {action}
          {dismissible && onDismiss && (
            <IconButton icon="x" label="Dismiss" size="sm" variant="ghost" onClick={onDismiss} style={{ color: 'var(--snackbar-dismiss-icon)' }} />
          )}
        </div>
      )}
    </div>
  );
}
