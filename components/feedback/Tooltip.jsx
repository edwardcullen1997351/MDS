import React from 'react';
import { useAnchor, anchorStyle } from '../core/anchor.js';

/* Tooltip is the smallest surface in the system and the one most often got
   wrong, because everything difficult about it is behavioural rather than
   visual. Four things this file exists to enforce:

   · It is a DESCRIPTION, not a name. The tip is wired to the trigger with
     aria-describedby; a trigger with no accessible name of its own is a bug
     in the trigger, not something a tooltip can fix.
   · It waits. An instant tooltip fires on a pointer merely crossing the
     control, so the first one costs --tooltip-delay; once one has opened,
     the group is WARM and neighbours open immediately, which is what makes a
     toolbar readable instead of stuttering.
   · It is dismissible and hoverable (WCAG 1.4.13): Escape closes it, and the
     pointer may enter it without it vanishing.
   · It never opens on touch. A tap is a press, and there is no hover state
     to represent — on a coarse pointer the trigger must carry its meaning
     some other way (§11). */

const OFFSET = 8;
const DELAY = 400;
const WARM = 200;   /* how long after a close the group stays warm */
const GRACE = 120;  /* pointer may cross the gap to the tip */

/* Module-level, deliberately: warmth belongs to the SESSION, not to one
   tooltip. Sharing it is the only way a row of icon buttons reads as one
   surface rather than eight independent waits. */
let warmUntil = 0;

export function Tooltip({
  content,
  shortcut,
  side = 'top',
  align = 'center',
  delay,
  maxWidth,
  disabled = false,
  open: openProp,
  children,
  style,
  ...rest
}) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const tipRef = React.useRef(null);
  const timer = React.useRef(0);
  const id = React.useId();
  const isControlled = openProp != null;
  const shown = (isControlled ? openProp : open) && !disabled && content != null;

  const pos = useAnchor(anchorRef, tipRef, { open: shown, side, align, offset: OFFSET, clampHeight: false });

  const clear = () => { clearTimeout(timer.current); timer.current = 0; };

  const show = React.useCallback((immediate) => {
    if (disabled || isControlled) return;
    clear();
    const wait = immediate || Date.now() < warmUntil ? 0 : (delay ?? DELAY);
    if (wait === 0) setOpen(true);
    else timer.current = setTimeout(() => setOpen(true), wait);
  }, [disabled, isControlled, delay]);

  const hide = React.useCallback((graceful) => {
    if (isControlled) return;
    clear();
    const done = () => { setOpen((was) => { if (was) warmUntil = Date.now() + WARM; return false; }); };
    if (graceful) timer.current = setTimeout(done, GRACE);
    else done();
  }, [isControlled]);

  React.useEffect(() => clear, []);

  /* Escape closes it wherever focus is — 1.4.13 dismissible. Bound only while
     open, so no listener exists for the hundreds of idle tooltips on a page. */
  React.useEffect(() => {
    if (!shown) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') hide(false); };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [shown, hide]);

  /* A coarse pointer has no hover to represent, and a tap is a press. */
  const coarse = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches;

  /* A disabled form control dispatches no pointer events, and they do not
     reach ancestors either — so wrapping one is not enough on its own: the
     wrapper never sees the pointer, and the control cannot be focused. When
     the child is disabled we neutralise its pointer handling and promote the
     WRAPPER to the focus stop, carrying the disabled semantics itself. The
     explanation of why a control is unavailable is exactly the case where a
     tooltip must be reachable. */
  const childDisabled = React.isValidElement(children) && children.props.disabled === true;

  const child = React.isValidElement(children)
    ? React.cloneElement(children, childDisabled
      ? { style: { ...children.props.style, pointerEvents: 'none' } }
      : { 'aria-describedby': shown ? [children.props['aria-describedby'], id].filter(Boolean).join(' ') : children.props['aria-describedby'] })
    : children;

  return (
    <span
      ref={anchorRef}
      {...(childDisabled && !disabled ? {
        tabIndex: 0,
        role: 'button',
        'aria-disabled': true,
        'aria-describedby': shown ? id : undefined,
      } : null)}
      onPointerEnter={(e) => { if (e.pointerType !== 'touch' && !coarse) show(false); }}
      onPointerLeave={(e) => { if (e.pointerType !== 'touch') hide(true); }}
      onPointerDown={() => hide(false)}
      /* Keyboard focus only. A tooltip on click-focus fires every time the
         user presses the control they are already using. */
      onFocus={(e) => { if (e.target.matches?.(':focus-visible')) show(true); }}
      onBlur={() => hide(false)}
      {...rest}
      style={{ display: 'inline-flex', maxWidth: '100%', ...style }}
    >
      {child}
      {shown && (
        <span
          ref={tipRef}
          id={id}
          role="tooltip"
          onPointerEnter={clear}
          onPointerLeave={() => hide(true)}
          style={{
            ...anchorStyle(pos || { left: -9999, top: 0 }, 'var(--z-tooltip)'),
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 6,
            padding: 'var(--tooltip-padding)',
            maxWidth: maxWidth ?? 'var(--tooltip-max-width)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--weight-regular)',
            lineHeight: 1.35,
            textWrap: 'pretty',
            color: 'var(--tooltip-foreground)',
            background: 'var(--tooltip-background)',
            border: 'var(--border-width) solid var(--tooltip-border)',
            borderRadius: 'var(--tooltip-radius)',
            boxShadow: 'var(--tooltip-shadow)',
            animation: 'mer-fade-in var(--duration-instant) var(--ease-out)',
          }}
        >
          <span style={{ minWidth: 0 }}>{content}</span>
          {shortcut && (
            <span style={{ flex: 'none', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--tooltip-shortcut-text)', letterSpacing: 'var(--tracking-label)', whiteSpace: 'nowrap' }}>{shortcut}</span>
          )}
        </span>
      )}
    </span>
  );
}
