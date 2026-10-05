import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* Tabs — one screen, sibling views. The tablist is a roving-tabindex group
   (APG tabs): one tab stop for the whole bar, arrows to move within it.
   Panels are the product's own markup; TabPanel exists only to wire the
   roles and ids when a product opts in by passing idBase.

   Nothing about the indicator is animated. A sliding underline has to
   measure the active tab, re-measure on font load, resize and label change,
   and it is the one motion in a console that a user triggers dozens of times
   an hour — so it is drawn on the tab itself as a border. */

const SIZES = {
  sm: { underlineH: 32, pillH: 24, px: 8, text: 'var(--text-xs)', icon: 14, gap: 5, pad: 2 },
  md: { underlineH: 36, pillH: 26, px: 10, text: 'var(--text-sm)', icon: 14, gap: 6, pad: 3 },
};

const norm = (raw) => (typeof raw === 'string' ? { value: raw, label: raw } : raw);

function Tab({ item, active, variant, size, idBase, fitted, activation, onSelect, tabRef, onKeyDown }) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const underline = variant === 'underline';
  const disabled = !!item.disabled;

  return (
    <button
      type="button"
      role="tab"
      id={idBase ? `${idBase}-tab-${item.value}` : undefined}
      aria-selected={active}
      aria-controls={idBase ? `${idBase}-panel-${item.value}` : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={active ? 0 : -1}
      disabled={disabled}
      ref={tabRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={(e) => {
        setFocus(e.target.matches(':focus-visible'));
        if (activation === 'automatic' && !disabled && !active) onSelect(item.value);
      }}
      onBlur={() => setFocus(false)}
      onKeyDown={onKeyDown}
      onClick={() => !disabled && onSelect(item.value)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        flex: fitted ? '1 1 0' : '0 0 auto',
        minWidth: 0,
        height: underline ? s.underlineH : s.pillH,
        padding: underline ? '0 2px' : `0 ${s.px}px`,
        margin: 0,
        fontFamily: 'var(--font-sans)',
        fontSize: s.text,
        fontWeight: active ? 'var(--weight-semibold)' : 'var(--weight-medium)',
        letterSpacing: 'var(--tracking-body)',
        color: disabled ? 'var(--tab-text-disabled)' : active ? 'var(--tab-text-active)' : hover ? 'var(--tab-text-hover)' : 'var(--tab-text)',
        background: underline ? 'transparent' : active ? 'var(--tab-pill-background-active)' : hover && !disabled ? 'var(--tab-pill-background-hover)' : 'transparent',
        border: 0,
        borderBottom: underline
          ? `var(--border-width-emphasis) solid ${active ? 'var(--tab-indicator)' : hover && !disabled ? 'var(--tab-indicator-hover)' : 'transparent'}`
          : 0,
        borderRadius: underline ? 0 : 'var(--radius-xs)',
        boxShadow: focus ? 'var(--tab-focus-ring)' : !underline && active ? 'var(--tab-pill-shadow-active)' : 'none',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-control)',
        whiteSpace: 'nowrap',
        position: 'relative',
        zIndex: focus ? 1 : undefined,
      }}
    >
      {item.icon && (
        <Icon name={item.icon} size={s.icon} style={{ color: disabled ? 'var(--tab-text-disabled)' : active ? 'var(--tab-icon-active)' : 'var(--tab-icon)' }} />
      )}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
      {item.count != null && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: disabled ? 'var(--tab-text-disabled)' : active ? 'var(--tab-count-text-active)' : 'var(--tab-count-text)' }}>
          {item.count}
        </span>
      )}
    </button>
  );
}

export function Tabs({
  items = [],
  value,
  onChange,
  variant = 'underline',
  size = 'md',
  label,
  idBase,
  fitted = false,
  activation = 'automatic',
  style,
  ...rest
}) {
  const underline = variant === 'underline';
  const s = SIZES[size] || SIZES.md;
  const rows = items.map(norm).filter(Boolean);
  const refs = React.useRef([]);
  const scroller = React.useRef(null);

  React.useEffect(() => {
    /* A tablist with no accessible name is announced as "tab list" and
       nothing else — in a screen with three of them, indistinguishable. */
    if (!label) console.warn('[Meridian] Tabs: no `label` — the tablist has no accessible name. Say what the tabs switch between ("Alarm state").');
  }, [label]);

  /* Keep the active tab in view when the bar scrolls. scrollIntoView would
     also scroll the page, so the scroller is moved directly. */
  React.useEffect(() => {
    const i = rows.findIndex((r) => r.value === value);
    const el = refs.current[i];
    const box = scroller.current;
    if (!el || !box || box.scrollWidth <= box.clientWidth) return;
    const left = el.offsetLeft;
    const right = left + el.offsetWidth;
    if (left < box.scrollLeft) box.scrollTo({ left: left - 16, behavior: 'auto' });
    else if (right > box.scrollLeft + box.clientWidth) box.scrollTo({ left: right - box.clientWidth + 16, behavior: 'auto' });
  }, [value, rows.length]);

  const focusAt = (from, dir) => {
    const n = rows.length;
    for (let step = 1; step <= n; step += 1) {
      const i = (from + dir * step + n * step) % n;
      if (!rows[i].disabled && refs.current[i]) { refs.current[i].focus(); return; }
    }
  };
  const focusEdge = (dir) => {
    const order = dir > 0 ? rows.map((_, i) => i) : rows.map((_, i) => rows.length - 1 - i);
    for (const i of order) if (!rows[i].disabled && refs.current[i]) { refs.current[i].focus(); return; }
  };

  const keyDown = (index) => (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); focusAt(index, 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); focusAt(index, -1); }
    else if (e.key === 'Home') { e.preventDefault(); focusEdge(1); }
    else if (e.key === 'End') { e.preventDefault(); focusEdge(-1); }
    else if ((e.key === 'Enter' || e.key === ' ') && activation === 'manual') {
      e.preventDefault();
      if (!rows[index].disabled) onChange(rows[index].value);
    }
  };

  return (
    <div
      ref={scroller}
      role="tablist"
      aria-label={label}
      aria-orientation="horizontal"
      data-tabs={variant}
      {...rest}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: underline ? 'var(--space-5)' : 2,
        padding: underline ? 0 : s.pad,
        background: underline ? 'transparent' : 'var(--tabs-pill-background)',
        border: underline ? 0 : 'var(--border-width) solid var(--tabs-pill-border)',
        borderBottom: underline ? 'var(--border-width) solid var(--tabs-border)' : undefined,
        borderRadius: underline ? 0 : 'var(--radius-md)',
        width: underline || fitted ? '100%' : 'fit-content',
        maxWidth: '100%',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        /* The bar scrolls and its scrollbar is hidden, which until now left
           NO cue that there were tabs off-screen. The fade is a mask rather
           than the colour-gradient overlay --tabs-scroll-fade presumed: an
           overlay would need a wrapper element and would paint over the pill
           variant's own background, whereas a mask fades to whatever is
           actually behind and works on both variants. The token was the
           wrong shape for the fix and was removed. */
        maskImage: 'linear-gradient(to right, transparent 0, #000 var(--space-4), #000 calc(100% - var(--space-4)), transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 var(--space-4), #000 calc(100% - var(--space-4)), transparent 100%)',
        ...style,
      }}
    >
      {rows.map((item, i) => (
        <Tab
          key={item.value}
          item={item}
          active={item.value === value}
          variant={variant}
          size={size}
          idBase={idBase}
          fitted={fitted}
          activation={activation}
          onSelect={onChange}
          tabRef={(el) => { refs.current[i] = el; }}
          onKeyDown={keyDown(i)}
        />
      ))}
    </div>
  );
}

/* Opt-in panel wiring. Products that render one panel at a time can skip it,
   but then they must not claim aria-controls either — which is why Tabs sets
   the relationship only when idBase is passed. */
export function TabPanel({ idBase, value, active = true, children, style, ...rest }) {
  return (
    <div
      id={`${idBase}-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`${idBase}-tab-${value}`}
      tabIndex={0}
      hidden={!active || undefined}
      {...rest}
      style={{ outline: 'none', minWidth: 0, ...style }}
    >
      {children}
    </div>
  );
}
