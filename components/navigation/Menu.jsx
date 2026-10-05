import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { useAnchor, anchorStyle } from '../core/anchor.js';

/* Menu is the fifth surface on the anchoring engine (after Combobox,
   Autocomplete, Tooltip and Popover) and the first whose rows are COMMANDS
   rather than values. Two consequences shape the code:

   · Focus stays on the menu container and the cursor is published with
     aria-activedescendant, not moved item to item. Menu rows are not
     tab stops, and a menu that moves DOM focus per arrow key has to
     re-implement restore-on-close for every row it ever focused.
   · Selecting closes, because a command is done. Checkable rows are the
     exception and stay open — the user is setting several, not choosing one. */

const SIZES = {
  sm: { h: 28, px: 8, gap: 8, text: 'var(--text-xs)', icon: 'xs', pad: 4 },
  md: { h: 32, px: 10, gap: 10, text: 'var(--text-sm)', icon: 'sm', pad: 4 },
};

/* Flattens the authored shape — items, 'divider' strings, and
   { group, items } objects — into one row list, so the keyboard only ever
   walks a flat array and group headings cannot be landed on. */
function flatten(items, out = []) {
  for (const raw of items || []) {
    if (raw == null) continue;
    if (raw === 'divider' || raw === '-' || raw.divider) { out.push({ type: 'divider' }); continue; }
    if (raw.items) {
      if (raw.group) out.push({ type: 'group', label: raw.group });
      flatten(raw.items, out);
      continue;
    }
    const item = typeof raw === 'string' ? { label: raw } : raw;
    out.push({ type: 'item', ...item });
  }
  return out;
}

const isEnabled = (r) => r.type === 'item' && !r.disabled;

export function MenuList({
  items,
  size = 'md',
  cursor = -1,
  onCursorChange,
  onSelect,
  idBase = 'menu',
  domRef,
  style,
  ...rest
}) {
  const S = SIZES[size] || SIZES.md;
  const rows = React.useMemo(() => flatten(items), [items]);
  const anyIndent = rows.some((r) => r.type === 'item' && (r.icon || r.checked != null));

  return (
    <div
      role="menu"
      ref={domRef}
      {...rest}
      style={{ display: 'flex', flexDirection: 'column', padding: S.pad, minWidth: 0, ...style }}
    >
      {rows.map((r, i) => {
        if (r.type === 'divider') {
          return <div key={i} role="separator" style={{ height: 'var(--border-width)', background: 'var(--menu-divider)', margin: `${S.pad}px 0` }} />;
        }
        if (r.type === 'group') {
          return (
            <div key={i} role="presentation" style={{ padding: `${S.pad + 2}px ${S.px}px 3px`, fontSize: 'var(--text-2xs)', fontWeight: 'var(--weight-semibold)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--menu-group-text)' }}>{r.label}</div>
          );
        }
        const active = i === cursor && !r.disabled;
        const critical = r.tone === 'critical' || r.tone === 'danger';
        const checkable = r.checked != null;
        return (
          <div
            key={i}
            id={`${idBase}-r${i}`}
            role={checkable ? (r.selection === 'single' ? 'menuitemradio' : 'menuitemcheckbox') : 'menuitem'}
            aria-checked={checkable ? !!r.checked : undefined}
            aria-disabled={r.disabled || undefined}
            aria-keyshortcuts={r.shortcut || undefined}
            onPointerMove={() => !r.disabled && onCursorChange?.(i)}
            onClick={(e) => { if (r.disabled) { e.stopPropagation(); return; } onSelect?.(r, i); }}
            style={{
              display: 'grid',
              gridTemplateColumns: `${anyIndent ? `${S.h - S.px}px ` : ''}minmax(0,1fr) auto`,
              alignItems: 'center',
              columnGap: S.gap,
              minHeight: S.h,
              padding: `${r.description ? 5 : 0}px ${S.px}px`,
              borderRadius: 'var(--radius-sm)',
              fontSize: S.text,
              lineHeight: 1.35,
              color: r.disabled ? 'var(--menu-item-text-disabled)' : critical ? 'var(--menu-item-text-critical)' : 'var(--menu-item-text)',
              background: active ? (critical ? 'var(--menu-item-background-critical-active)' : 'var(--menu-item-background-active)') : 'transparent',
              cursor: r.disabled ? 'not-allowed' : 'pointer',
              userSelect: 'none',
            }}
          >
            {anyIndent && (
              <span style={{ display: 'grid', placeItems: 'center', color: r.disabled ? 'inherit' : checkable ? 'var(--menu-item-check)' : critical ? 'inherit' : 'var(--menu-item-icon)' }}>
                {checkable
                  ? (r.checked ? <Icon name="check" size={S.icon} /> : null)
                  /* `icon` takes a NODE as well as a Lucide name. It was a
                     string only, which meant a "switch account" menu had
                     nowhere to put a 20px Avatar per row — logged as an open
                     item on Avatar and resolved here, because it was always a
                     Menu API question. A string still routes to Icon, so
                     every existing call site is untouched. */
                  : r.icon ? (typeof r.icon === 'string' ? <Icon name={r.icon} size={S.icon} /> : r.icon) : null}
              </span>
            )}
            <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</span>
              {r.description && (
                <span style={{ fontSize: 'var(--text-2xs)', color: r.disabled ? 'inherit' : 'var(--menu-item-description-text)', whiteSpace: 'normal' }}>{r.description}</span>
              )}
            </span>
            {r.shortcut && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: r.disabled ? 'inherit' : 'var(--menu-item-shortcut-text)', whiteSpace: 'nowrap' }}>{r.shortcut}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Menu({
  trigger,
  items,
  label,
  open,
  onOpenChange,
  onSelect,
  side = 'bottom',
  align = 'start',
  offset = 4,
  size = 'md',
  minWidth = 180,
  maxWidth = 320,
  matchTriggerWidth = false,
  style,
  ...rest
}) {
  const [uncontrolled, setUncontrolled] = React.useState(false);
  const isControlled = open != null;
  const isOpen = isControlled ? open : uncontrolled;

  const anchorRef = React.useRef(null);
  const listRef = React.useRef(null);
  const wantFocus = React.useRef(false);
  const restoreRef = React.useRef(null);
  const typed = React.useRef({ buf: '', at: 0 });
  const [cursor, setCursor] = React.useState(-1);
  const idBase = React.useId();

  const rows = React.useMemo(() => flatten(items), [items]);
  const pos = useAnchor(anchorRef, listRef, { open: isOpen, side, align, offset, matchWidth: matchTriggerWidth });

  if (!label && !rest['aria-label'] && !rest['aria-labelledby']) {
    console.warn('[Meridian] Menu: no accessible name. Pass `label` — a screen reader announcing "menu, 6 items" with no name tells the user nothing about what the commands do.');
  }

  const setOpen = React.useCallback((next, from) => {
    if (!isControlled) setUncontrolled(next);
    onOpenChange?.(next);
    if (next) {
      wantFocus.current = true;
      restoreRef.current = document.activeElement;
      setCursor(from === 'last' ? rows.map(isEnabled).lastIndexOf(true) : from === 'first' ? rows.findIndex(isEnabled) : -1);
    } else setCursor(-1);
  }, [isControlled, onOpenChange, rows]);

  function close(restore = true) {
    setOpen(false);
    if (restore) restoreRef.current?.focus?.({ preventScroll: true });
    restoreRef.current = null;
  }

  /* Focus is taken in the ref callback, the moment the surface exists —
     not in a deferred frame. A trigger's own press handling (a button
     re-focusing itself on click, a pointerup landing after the open) runs
     between commit and the next animation frame, so a rAF focus was being
     undone and every key in §07 was unreachable for a real user. The effect
     below only re-asserts it if something else stole focus. */
  const attachList = React.useCallback((el) => {
    listRef.current = el;
    if (el && wantFocus.current) el.focus({ preventScroll: true });
  }, []);

  React.useEffect(() => {
    if (!isOpen) { wantFocus.current = false; return undefined; }
    if (!listRef.current?.contains(restoreRef.current) && (restoreRef.current == null || restoreRef.current === document.body)) restoreRef.current = document.activeElement;
    const t = requestAnimationFrame(() => {
      const el = listRef.current;
      if (el && !el.contains(document.activeElement) && document.activeElement !== el) el.focus({ preventScroll: true });
      wantFocus.current = false;
    });
    const onDown = (e) => {
      if (listRef.current?.contains(e.target) || anchorRef.current?.contains(e.target)) return;
      close(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => { cancelAnimationFrame(t); document.removeEventListener('pointerdown', onDown); };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [isOpen]);

  function step(dir) {
    const n = rows.length;
    for (let k = 1; k <= n; k++) {
      const i = ((cursor < 0 ? (dir > 0 ? -1 : 0) : cursor) + dir * k + n * k) % n;
      if (isEnabled(rows[i])) { setCursor(i); return; }
    }
  }

  function pick(row, i) {
    if (!row || row.disabled) return;
    row.onSelect?.(row);
    onSelect?.(row, i);
    /* A command is finished when it is chosen; a checkable row is one of
       several the user is still setting, so the menu stays. */
    if (row.keepOpen ?? row.checked != null) return;
    close();
  }

  function onKeyDown(e) {
    const k = e.key;
    if (k === 'Escape') { e.stopPropagation(); close(); return; }
    if (k === 'Tab') { close(false); return; }
    if (k === 'ArrowDown') { e.preventDefault(); step(1); return; }
    if (k === 'ArrowUp') { e.preventDefault(); step(-1); return; }
    if (k === 'Home') { e.preventDefault(); setCursor(rows.findIndex(isEnabled)); return; }
    if (k === 'End') { e.preventDefault(); setCursor(rows.map(isEnabled).lastIndexOf(true)); return; }
    if (k === 'Enter' || k === ' ') { e.preventDefault(); pick(rows[cursor], cursor); return; }
    if (k.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const now = Date.now();
      typed.current.buf = now - typed.current.at > 600 ? k : typed.current.buf + k;
      typed.current.at = now;
      const q = typed.current.buf.toLowerCase();
      const from = typed.current.buf.length > 1 ? cursor : cursor + 1;
      const order = rows.map((_, i) => (i + Math.max(from, 0)) % rows.length);
      const hit = order.find((i) => isEnabled(rows[i]) && String(rows[i].label).toLowerCase().startsWith(q));
      if (hit != null) setCursor(hit);
    }
  }

  function onTriggerKeyDown(e) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true, 'first'); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setOpen(true, 'last'); }
  }

  return (
    <>
      <span
        ref={anchorRef}
        onClick={() => (isOpen ? close() : setOpen(true))}
        onKeyDown={isOpen ? onKeyDown : onTriggerKeyDown}
        style={{ display: 'inline-flex', maxWidth: '100%' }}
      >
        {React.isValidElement(trigger)
          ? React.cloneElement(trigger, { 'aria-haspopup': 'menu', 'aria-expanded': isOpen })
          : trigger}
      </span>
      {isOpen && (
        <MenuList
          {...rest}
          items={items}
          size={size}
          cursor={cursor}
          onCursorChange={setCursor}
          onSelect={pick}
          idBase={idBase}
          aria-label={label || rest['aria-label']}
          aria-activedescendant={cursor >= 0 ? `${idBase}-r${cursor}` : undefined}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          style={{
            ...anchorStyle(pos || { left: -9999, top: 0 }, 'var(--z-popover)'),
            width: matchTriggerWidth ? pos?.width : 'max-content',
            minWidth: matchTriggerWidth ? undefined : minWidth,
            maxWidth: `min(${maxWidth}px, calc(100vw - 16px))`,
            background: 'var(--menu-background)',
            border: 'var(--border-width) solid var(--menu-border)',
            borderRadius: 'var(--menu-radius)',
            boxShadow: 'var(--menu-shadow)',
            outline: 'none',
            overflow: 'auto',
            animation: `${pos?.side === 'top' ? 'mer-rise-in' : pos?.side === 'bottom' ? 'mer-drop-in' : 'mer-fade-in'} var(--duration-instant) var(--ease-out)`,
            ...style,
          }}
          domRef={attachList}
        />
      )}
    </>
  );
}
