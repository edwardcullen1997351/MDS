import React from 'react';
import { IconButton } from '../core/IconButton.jsx';

/* Dialog — the system's modal. One component, one name.
   There is no separate `Modal`: a second component for the same behaviour
   would mean two focus traps, two scrim rules and two sets of ARIA to keep
   in step, and products would pick between them by feel.

   A modal is the most expensive thing this system can do to a user: it
   stops the page, takes their focus, and refuses to let them read anything
   behind it. So the component is built to make the expensive parts correct
   — trap, restore, scroll lock, labelled by its own title — and to make the
   cheap misuse (a modal for something that isn't a decision) obvious in
   review rather than easy in code.

   Positioning is `absolute`, not `fixed`, on purpose: the system's device
   and browser frames are `position: relative`, and a `fixed` dialog would
   escape the frame and cover the whole preview. In a real product the frame
   is the app root, so the effect is identical. */

const WIDTHS = { sm: 'var(--dialog-width-sm)', md: 'var(--dialog-width-md)', lg: 'var(--dialog-width-lg)' };

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Dialog({
  open = true,
  title,
  description,
  tone = 'default',
  width = 'md',
  footer,
  onClose,
  dismissible = true,
  initialFocus,
  children,
  style,
  ...rest
}) {
  const panelRef = React.useRef(null);
  const scrimRef = React.useRef(null);
  const restoreRef = React.useRef(null);
  const uid = React.useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;

  if (open && !title) {
    console.warn('[Meridian] Dialog: a modal must have a title. It is the accessible name of the dialog and the only thing that tells a screen-reader user what has taken their focus.');
  }

  /* Escape, and a focus trap. Both belong to the modal itself rather than to
     the product: a modal that can be tabbed out of is not modal, and every
     product that has to remember to add the trap eventually forgets. */
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && dismissible && onClose) { e.stopPropagation(); onClose(); return; }
      if (e.key !== 'Tab') return;
      const nodes = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) || []).filter((n) => n.offsetParent !== null);
      if (!nodes.length) { e.preventDefault(); return; }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      /* Wrapping is what makes it a trap, and the out-of-panel case matters
         too: focus can land outside via a click on the scrim. */
      if (!panelRef.current.contains(active)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose, dismissible]);

  /* Move focus in, and put it back where it was on close. Restoring is the
     half everyone drops, and it is the half a keyboard user notices: without
     it, closing a dialog dumps focus at the top of the document. */
  React.useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    const target = initialFocus?.current || panelRef.current?.querySelector(FOCUSABLE) || panelRef.current;
    /* One frame, so the panel is laid out before we focus into it. */
    const h = requestAnimationFrame(() => target?.focus?.({ preventScroll: true }));
    return () => {
      cancelAnimationFrame(h);
      const prev = restoreRef.current;
      if (prev && document.contains(prev)) prev.focus?.({ preventScroll: true });
    };
  }, [open, initialFocus]);

  /* Scroll lock. Without it the page behind scrolls under the scrim, which
     both breaks the illusion of a stopped page and loses the user's place.

     But it is conditional on the scrim ACTUALLY COVERING THE VIEWPORT, and
     that condition is the whole point. This dialog is `position: absolute`
     rather than `fixed` by design (see the note above) so it stays inside a
     relative frame — a device mock, an app root, a spec's demo stage. Inside
     such a frame it covers a box, not the page, and there is nothing behind it
     to protect: locking `document.body` there reaches out of the frame and
     freezes a document the dialog does not cover.

     Which is exactly what shipped. `Dialog.spec.html` mounts EIGHT open
     dialogs as static demos and `Drawer.spec.html` seven, each locking body
     overflow — so both specs, and `Popover.spec.html` (one dialog at §10),
     could not be scrolled at all. The documents were unreadable past the fold
     in the Design System tab, and nothing in them looked broken; the page
     simply did not move. Several locks also stack badly on unmount, since each
     captures `prev` AFTER an earlier one has already written 'hidden'.

     Measuring the scrim rather than inspecting ancestors is deliberate: a real
     app root is usually `position: relative` too, so a structural test would
     have skipped the lock in production. Coverage is the actual condition. */
  React.useEffect(() => {
    if (!open) return undefined;
    const r = scrimRef.current?.getBoundingClientRect();
    const covers = r && r.width >= window.innerWidth - 2 && r.height >= window.innerHeight - 2;
    if (!covers) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={scrimRef}
      data-dialog-scrim=""
      /* mousedown on the scrim, not click on the wrapper: a click handler
         fires when a drag that STARTED inside the panel (selecting text in
         the body) happens to end on the scrim, closing a form under the
         user's hand. Comparing the target to the scrim itself also removes
         the need for a stopPropagation on the panel. */
      onMouseDown={(e) => { if (dismissible && onClose && e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 'var(--dialog-inset-block) var(--dialog-inset-inline)',
        background: 'var(--dialog-scrim)',
        backdropFilter: 'var(--overlay-blur)',
        zIndex: 'var(--z-dialog)',
        animation: 'var(--anim-fade-in)',
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        data-dialog={tone}
        {...rest}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: WIDTHS[width] || WIDTHS.md,
          /* The panel never exceeds the viewport: the body scrolls, the
             header and footer stay. A dialog whose actions have scrolled
             off the bottom of the screen is a trap with no way out. */
          maxHeight: '100%',
          background: 'var(--dialog-background)',
          border: 'var(--border-width) solid var(--dialog-border)',
          borderRadius: 'var(--dialog-radius)',
          boxShadow: 'var(--dialog-shadow)',
          /* --anim-rise-in, not a scale: the system has no scale keyframe
             and does not need one. 8px up reads as arrival without the
             zoom that makes a modal feel like it pounced. */
          animation: 'var(--anim-rise-in)',
          ...style,
        }}
      >
        <header style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', padding: 'var(--space-5) var(--dialog-padding-inline) var(--space-4)', flex: 'none' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 id={titleId} style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-heading)', color: tone === 'danger' ? 'var(--dialog-title-text-critical)' : 'var(--dialog-title-text)' }}>{title}</h2>
            {description && <p id={descId} style={{ margin: '6px 0 0', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-normal)', color: 'var(--dialog-description-text)' }}>{description}</p>}
          </div>
          {/* No close button when the dialog is not dismissible — a visible X
              that does nothing, or that contradicts a blocked Escape, is
              worse than no X at all. */}
          {dismissible && onClose && <IconButton icon="x" label="Close" size="sm" variant="ghost" onClick={onClose} style={{ flex: 'none' }} />}
        </header>
        {children != null && (
          <div style={{ padding: `0 var(--dialog-padding-inline) var(--space-5)`, overflowY: 'auto', flex: '1 1 auto', minHeight: 0 }}>{children}</div>
        )}
        {footer && (
          <footer style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 'var(--space-2)', padding: 'var(--space-4) var(--dialog-padding-inline)', borderTop: 'var(--border-width) solid var(--dialog-footer-border)', background: 'var(--dialog-footer-background)', borderRadius: '0 0 var(--dialog-radius) var(--dialog-radius)', flex: 'none' }}>{footer}</footer>
        )}
      </div>
    </div>
  );
}
