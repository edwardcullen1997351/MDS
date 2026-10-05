import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';

/* Toast — transient confirmation of something the user did, and the one
   surface in this system that appears without being asked for. Everything
   here is shaped by that: it is small, it is never modal, it never steals
   focus, and a critical toast does not auto-dismiss.

   Toast is the presentation. Toaster is the viewport, the queue and the
   timers — mounted once per app, driven imperatively, because the code that
   needs to say "saved" is usually a mutation handler with no component
   nearby. */

const TONES = {
  info: { icon: 'info', color: 'var(--toast-icon-info)', ms: 5000 },
  success: { icon: 'circle-check', color: 'var(--toast-icon-success)', ms: 5000 },
  warning: { icon: 'triangle-alert', color: 'var(--toast-icon-warning)', ms: 8000 },
  /* Critical toasts never expire: a failure the user has not read is not a
     failure they have been told about. */
  danger: { icon: 'circle-alert', color: 'var(--toast-icon-critical)', ms: null },
};

export function Toast({ tone = 'info', title, message, action, onDismiss, live = 'off', style, ...rest }) {
  const t = TONES[tone] || TONES.info;
  const assertive = tone === 'danger';
  return (
    <div
      /* The live region is the viewport, not the toast — but a critical
         toast marks itself assertive wherever it renders, and a standalone
         Toast outside Toaster opts into announcing with `live`. */
      role={assertive ? 'alert' : live === 'off' ? 'group' : 'status'}
      aria-live={assertive ? 'assertive' : live === 'off' ? undefined : 'polite'}
      data-toast={tone}
      {...rest}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        width: 'var(--toast-width)',
        maxWidth: '100%',
        padding: 'var(--space-3) var(--space-3) var(--space-3) var(--space-4)',
        background: 'var(--toast-background)',
        border: 'var(--border-width) solid var(--toast-border)',
        borderRadius: 'var(--toast-radius)',
        boxShadow: 'var(--toast-shadow)',
        pointerEvents: 'auto',
        ...style,
      }}
    >
      <Icon name={t.icon} size={16} style={{ color: t.color, marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)', color: 'var(--toast-title-text)' }}>{title}</div>
        {message && <div style={{ marginTop: 2, fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-snug)', color: 'var(--toast-message-text)' }}>{message}</div>}
        {action && <div style={{ marginTop: 'var(--space-2)' }}>{action}</div>}
      </div>
      {onDismiss && <IconButton icon="x" label="Dismiss" size="sm" variant="ghost" onClick={onDismiss} style={{ color: 'var(--toast-dismiss-icon)', flex: 'none' }} />}
    </div>
  );
}

/* ── Store ────────────────────────────────────────────────────────────
   Module-level, so toast() works from a mutation handler, a socket callback
   or a route guard — anywhere without a component in scope. */
let seq = 0;
let queue = [];
const listeners = new Set();
const emit = () => listeners.forEach((l) => l(queue));

function push(input) {
  const spec = typeof input === 'string' ? { title: input } : input || {};
  const tone = spec.tone || 'info';
  const id = spec.id != null ? spec.id : `toast-${++seq}`;
  const duration = spec.duration !== undefined ? spec.duration : (TONES[tone] || TONES.info).ms;
  const item = { ...spec, id, tone, duration };
  /* Same id ⇒ replace in place. A progress toast ("Exporting…" → "Export
     ready") is one notice with two states, not two notices. */
  const at = queue.findIndex((q) => q.id === id);
  queue = at === -1 ? [...queue, item] : queue.map((q, i) => (i === at ? item : q));
  emit();
  return id;
}

function dismiss(id) {
  queue = queue.filter((q) => q.id !== id);
  emit();
}

export function Toaster({ position = 'bottom-right', maxVisible = 3, style, ...rest }) {
  const [items, setItems] = React.useState(queue);
  const [paused, setPaused] = React.useState(false);
  const timers = React.useRef(new Map());

  React.useEffect(() => {
    listeners.add(setItems);
    setItems(queue);
    return () => listeners.delete(setItems);
  }, []);

  /* Timers live here, not in the store: a paused pointer or a focused action
     must hold every visible toast, and only the viewport knows about those. */
  React.useEffect(() => {
    const shown = items.slice(0, maxVisible);
    shown.forEach((it) => {
      if (it.duration == null || paused || timers.current.has(it.id)) return;
      timers.current.set(it.id, window.setTimeout(() => { timers.current.delete(it.id); dismiss(it.id); }, it.duration));
    });
    if (paused) {
      timers.current.forEach((h) => window.clearTimeout(h));
      timers.current.clear();
    }
    return undefined;
  }, [items, paused, maxVisible]);

  React.useEffect(() => () => { timers.current.forEach((h) => window.clearTimeout(h)); timers.current.clear(); }, []);

  const shown = items.slice(0, maxVisible);
  const hidden = items.length - shown.length;
  const top = position.startsWith('top');
  const centre = position.endsWith('center');

  return (
    <div
      aria-label="Notifications"
      /* One live region for the whole stack, polite: a critical toast marks
         itself role="alert" inside it. Announcing from the region rather than
         per toast means a queue of three is read in order, once each. */
      role="region"
      aria-live="polite"
      aria-relevant="additions"
      data-toaster={position}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      {...rest}
      style={{
        position: 'fixed',
        zIndex: 'var(--z-toast)',
        [top ? 'top' : 'bottom']: 'var(--toast-viewport-inset)',
        ...(centre
          ? { left: '50%', transform: 'translateX(-50%)' }
          : { right: 'var(--toast-viewport-inset)' }),
        display: 'flex',
        flexDirection: top ? 'column' : 'column-reverse',
        gap: 'var(--toast-gap)',
        pointerEvents: 'none',
        maxWidth: 'calc(100vw - 2 * var(--toast-viewport-inset))',
        ...style,
      }}
    >
      {shown.map((it) => (
        <div key={it.id} style={{ animation: `${centre && top ? 'mer-drop-in' : 'mer-slide-in-right'} var(--duration-base) var(--ease-out) both` }}>
          <Toast
            tone={it.tone}
            title={it.title}
            message={it.message}
            action={it.action}
            onDismiss={it.dismissible === false ? undefined : () => dismiss(it.id)}
          />
        </div>
      ))}
      {hidden > 0 && (
        <span style={{ alignSelf: centre ? 'center' : 'flex-end', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--toast-overflow-text)', pointerEvents: 'auto' }}>
          +{hidden} more
        </span>
      )}
    </div>
  );
}

/* Imperative API, hung off the component so it reaches window.<Namespace>. */
Toaster.show = push;
Toaster.dismiss = dismiss;
Toaster.dismissAll = function dismissAll() { queue = []; emit(); };
Toaster.success = (input) => push({ ...(typeof input === 'string' ? { title: input } : input), tone: 'success' });
Toaster.error = (input) => push({ ...(typeof input === 'string' ? { title: input } : input), tone: 'danger' });
Toaster.warning = (input) => push({ ...(typeof input === 'string' ? { title: input } : input), tone: 'warning' });
