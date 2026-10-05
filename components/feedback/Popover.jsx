import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
import { useAnchor, anchorStyle } from '../core/anchor.js';

const WIDTHS = { sm: 240, md: 320, lg: 400 };
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function Popover({
  trigger,
  title,
  open,
  onOpenChange,
  side = 'bottom',
  align = 'start',
  offset = 4,
  width = 'md',
  matchTriggerWidth = false,
  padded = true,
  onClose,
  children,
  style,
  ...rest
}) {
  const [uncontrolled, setUncontrolled] = React.useState(false);
  const isControlled = open != null;
  const isOpen = isControlled ? open : uncontrolled;

  const anchorRef = React.useRef(null);
  const panelRef = React.useRef(null);
  const restoreRef = React.useRef(null);
  const baseId = React.useId();
  const titleId = baseId + '-title';

  const pos = useAnchor(anchorRef, panelRef, { open: isOpen, side, align, offset, matchWidth: matchTriggerWidth });

  const setOpen = React.useCallback((next) => {
    if (!isControlled) setUncontrolled(next);
    onOpenChange?.(next);
    if (!next) onClose?.();
  }, [isControlled, onOpenChange, onClose]);

  if (!title && !rest['aria-label'] && !rest['aria-labelledby']) {
    console.warn('[Meridian] Popover: no accessible name. A panel that takes focus must announce what it is — pass `title`, or aria-label when the panel is deliberately untitled.');
  }

  /* Focus MOVES into the panel — the difference from Combobox, where it must
     stay in the input. A popover holds interactive content, so leaving focus
     on the trigger would put a keyboard user's next Tab behind the panel. */
  React.useEffect(() => {
    if (!isOpen) return undefined;
    restoreRef.current = document.activeElement;
    const t = requestAnimationFrame(() => {
      const el = panelRef.current;
      if (!el) return;
      (el.querySelector('[data-autofocus]') || el.querySelector(FOCUSABLE) || el).focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(t);
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return undefined;
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target) || anchorRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      /* Scoped, so a Dialog behind the popover is not also dismissed. */
      e.stopPropagation();
      setOpen(false);
      restoreRef.current?.focus?.({ preventScroll: true });
    };
    /* Not modal and not trapped: Tab out of the last control leaves the
       panel, which dismisses it. That is the honest non-modal contract —
       trapping focus without a scrim strands the keyboard in a panel the
       pointer can click straight out of. */
    const onFocusOut = (e) => {
      const to = e.relatedTarget;
      if (!to) return;
      if (panelRef.current?.contains(to) || anchorRef.current?.contains(to)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    panelRef.current?.addEventListener('focusout', onFocusOut);
    const panel = panelRef.current;
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
      panel?.removeEventListener('focusout', onFocusOut);
    };
  }, [isOpen, setOpen]);

  function close() {
    setOpen(false);
    restoreRef.current?.focus?.({ preventScroll: true });
  }

  return (
    <>
      <span
        ref={anchorRef}
        onClick={() => (isOpen ? close() : setOpen(true))}
        style={{ display: 'inline-flex', maxWidth: '100%' }}
      >
        {React.isValidElement(trigger)
          ? React.cloneElement(trigger, { 'aria-haspopup': 'dialog', 'aria-expanded': isOpen })
          : trigger}
      </span>
      {isOpen && (
        <div
          {...rest}
          ref={panelRef}
          role="dialog"
          tabIndex={-1}
          aria-labelledby={title ? titleId : rest['aria-labelledby']}
          style={{
            ...anchorStyle(pos || { left: -9999, top: 0 }, 'var(--z-popover)'),
            width: matchTriggerWidth ? pos?.width : typeof width === 'number' ? width : WIDTHS[width] || WIDTHS.md,
            maxWidth: `calc(100vw - 16px)`,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--popover-background)',
            border: 'var(--border-width) solid var(--popover-border)',
            borderRadius: 'var(--popover-radius)',
            boxShadow: 'var(--popover-shadow)',
            outline: 'none',
            overflow: 'auto',
            ...style,
          }}
        >
          {title && (
            <header style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: padded ? '10px 12px 8px' : '10px 12px', borderBottom: 'var(--border-width) solid var(--popover-divider)' }}>
              <h2 id={titleId} style={{ flex: 1, minWidth: 0, margin: 0, fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-label)', color: 'var(--popover-title-text)' }}>{title}</h2>
              <IconButton icon="x" label="Close" size="sm" onClick={close} />
            </header>
          )}
          <div style={{ minWidth: 0, padding: padded ? 12 : 0 }}>{children}</div>
        </div>
      )}
    </>
  );
}
