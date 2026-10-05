import React from 'react';
import { IconButton } from '../core/IconButton.jsx';

/* Drawer — a PLACE beside the page, where Dialog is a DECISION on top of it.
   That is the whole boundary, and every difference below follows from it:

   · Dialog stops the page to ask one question, and the page behind is
     unreadable on purpose.
   · Drawer opens a surface next to work that stays visible — a record's
     detail beside the table it came from, a filter panel beside the results
     it narrows, a form beside the context it is about. The page behind is
     meant to be read, and with `modal={false}` it stays usable too.

   So this is not `Dialog` with a `variant="side"`. Dialog's spec (§04)
   refused a drawer variant for exactly this reason: different dismissal,
   different scope, different motion, and — the part a variant flag cannot
   express — a non-modal mode, where there is no scrim, no trap, no scroll
   lock and no aria-modal, because claiming modality without a scrim lies
   about what is reachable (the rule Popover established in 1.5.0).

   What is shared is what must not drift: the focus trap, the focus restore,
   the mousedown-not-click scrim dismissal and the header/body/footer
   geometry are Dialog's, ported deliberately rather than reinvented, and the
   surface, shadow and radius resolve through tokens that point at the same
   semantics. Two floating layers at one elevation must not be two colours.

   Positioning is `absolute`, not `fixed`, for the same reason as Dialog: the
   system's device and browser frames are `position: relative`, and a fixed
   panel would escape the frame. In a product the frame is the app root. */

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

const SIDES = {
  right: {
    place: { top: 0, bottom: 0, right: 0 },
    radius: 'var(--drawer-radius) 0 0 var(--drawer-radius)',
    edge: 'borderLeft',
    anim: 'var(--anim-slide-in-right)',
  },
  left: {
    place: { top: 0, bottom: 0, left: 0 },
    radius: '0 var(--drawer-radius) var(--drawer-radius) 0',
    edge: 'borderRight',
    anim: 'var(--anim-slide-in-left)',
  },
  bottom: {
    place: { left: 0, right: 0, bottom: 0 },
    radius: 'var(--drawer-radius) var(--drawer-radius) 0 0',
    edge: 'borderTop',
    anim: 'var(--anim-slide-in-up)',
  },
};

export function Drawer({
  open = true,
  title,
  description,
  side = 'right',
  size = 'md',
  modal = true,
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
  const S = SIDES[side] || SIDES.right;

  if (open && !title) {
    console.warn('[Meridian] Drawer: no `title`. It is the panel\u2019s accessible name and the only thing that says what has opened beside — or in front of — the page. Pass one; a drawer whose subject is only in its body announces as "dialog".');
  }
  if (open && !onClose) {
    console.warn('[Meridian] Drawer: no `onClose`. Escape, the scrim and the close button all route through it, so without one the panel cannot be dismissed by any means — the definition of a trap.');
  }

  /* Escape always closes, in both modes. The focus TRAP is modal-only: a
     non-modal panel the user cannot tab out of is a trap without a scrim to
     explain why. */
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && dismissible && onClose) { e.stopPropagation(); onClose(); return; }
      if (!modal || e.key !== 'Tab') return;
      const nodes = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) || []).filter((n) => n.offsetParent !== null);
      if (!nodes.length) { e.preventDefault(); return; }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      if (!panelRef.current.contains(active)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, onClose, dismissible, modal]);

  /* Focus moves in, and goes back where it was on close — in both modes.
     Restoring is the half that gets dropped, and the half a keyboard user
     notices: without it, closing dumps focus at the top of the document.
     `document.contains` guards the row that opened the panel having been
     removed by the action taken inside it. */
  React.useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    const target = initialFocus?.current || panelRef.current?.querySelector(FOCUSABLE) || panelRef.current;
    const h = requestAnimationFrame(() => target?.focus?.({ preventScroll: true }));
    return () => {
      cancelAnimationFrame(h);
      const prev = restoreRef.current;
      if (prev && document.contains(prev)) prev.focus?.({ preventScroll: true });
    };
  }, [open, initialFocus]);

  /* Scroll lock is modal-only, and this is the mechanical difference that
     matters most: a non-modal drawer exists so the user can keep scrolling
     and clicking the page beside it. Locking the body there would produce a
     panel that says "carry on" and a page that refuses to. */
  React.useEffect(() => {
    if (!open || !modal) return undefined;
    /* Conditional on the scrim actually covering the viewport — same reasoning
       and same shipped defect as Dialog's lock; see the long note there. This
       panel is `position: absolute` so it stays inside a relative frame, and
       inside one it covers a box rather than the page. `Drawer.spec.html`
       mounted seven open drawers as static demos, each freezing the whole
       spec document, so the spec could not be scrolled. Coverage is measured
       rather than inferred from ancestors: a real app root is usually
       positioned too, and a structural test would skip the lock in
       production, which is the one place it must fire. */
    const r = scrimRef.current?.getBoundingClientRect();
    const covers = r && r.width >= window.innerWidth - 2 && r.height >= window.innerHeight - 2;
    if (!covers) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open, modal]);

  if (!open) return null;

  const isSheet = side === 'bottom';
  const panel = (
    <div
      ref={panelRef}
      role="dialog"
      /* Only when there IS a scrim. A non-modal panel claiming aria-modal
         tells assistive technology the rest of the page is unavailable while
         a sighted user is still clicking it. */
      aria-modal={modal ? 'true' : undefined}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      data-drawer={side}
      {...rest}
      style={{
        position: 'absolute',
        ...S.place,
        display: 'flex',
        flexDirection: 'column',
        width: isSheet ? '100%' : `var(--drawer-width-${size})`,
        maxWidth: '100%',
        height: isSheet ? `var(--drawer-height-${size})` : undefined,
        /* A sheet never covers the page: at that point it is a page, and it
           should be one. The side panel is always full-height. */
        maxHeight: isSheet ? '85%' : '100%',
        background: 'var(--drawer-background)',
        [S.edge]: 'var(--border-width) solid var(--drawer-border)',
        /* Only the leading corners. The other edges are flush with the
           surface, and a radius there shows the page through a 8px notch. */
        borderRadius: S.radius,
        boxShadow: 'var(--drawer-shadow)',
        zIndex: 'var(--z-drawer)',
        animation: S.anim,
        ...style,
      }}
    >
      <header style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', padding: 'var(--space-5) var(--drawer-padding-inline) var(--space-4)', flex: 'none' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 id={titleId} style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-heading)', color: 'var(--drawer-title-text)' }}>{title}</h2>
          {description && <p id={descId} style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', lineHeight: 'var(--leading-normal)', color: 'var(--drawer-description-text)' }}>{description}</p>}
        </div>
        {/* No close button when it cannot close: an X that refuses, or one
            that contradicts a blocked Escape, is worse than none. */}
        {dismissible && onClose && <IconButton icon="x" label="Close panel" size="sm" variant="ghost" onClick={onClose} style={{ flex: 'none' }} />}
      </header>
      {children != null && (
        <div style={{ padding: `0 var(--drawer-padding-inline) var(--space-5)`, overflowY: 'auto', flex: '1 1 auto', minHeight: 0 }}>{children}</div>
      )}
      {footer && (
        /* NOT flex-wrap: wrap. The documented footer is two fullWidth
           buttons, whose base size is the whole content width — with wrapping
           enabled a flex line breaks before either item shrinks, so the row
           the spec asks for becomes the two-row toolbar the spec forbids.
           Without wrapping they shrink and share the row at every width, and
           on a narrow sheet they shrink together rather than stacking. */
        <footer style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-4) var(--drawer-padding-inline)', borderTop: 'var(--border-width) solid var(--drawer-footer-border)', background: 'var(--drawer-footer-background)', flex: 'none' }}>{footer}</footer>
      )}
    </div>
  );

  if (!modal) return panel;

  return (
    <div
      ref={scrimRef}
      data-drawer-scrim=""
      /* mousedown, and only on the scrim itself: a click handler fires when a
         text-selection drag that started inside the panel ends on the scrim,
         closing a half-filled form under the user's hand. Dialog 1.12.0. */
      onMouseDown={(e) => { if (dismissible && onClose && e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        justifyContent: side === 'left' ? 'flex-start' : 'flex-end',
        alignItems: isSheet ? 'flex-end' : 'stretch',
        background: 'var(--drawer-scrim)',
        zIndex: 'var(--z-drawer)',
        animation: 'var(--anim-fade-in)',
      }}
    >
      {panel}
    </div>
  );
}
