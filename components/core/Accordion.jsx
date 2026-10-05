import React from 'react';
import { Icon } from './Icon.jsx';

/* Accordion — a stack of disclosures. The header is a real <button> inside a
   real heading, the panel is a labelled region, and the open set is the only
   state. Height is never animated (see Motion in the spec): the panel's
   content fades in, the chevron rotates, and the row snaps to its new size.
   Both are transform/opacity, which is all the motion layer permits. */

const SIZES = {
  sm: { h: 34, px: 'var(--space-3)', title: 'var(--text-xs)', icon: 'xs', marker: 14, gap: 8, panelPt: 'var(--space-2)', panelPb: 'var(--space-3)' },
  md: { h: 44, px: 'var(--space-4)', title: 'var(--text-sm)', icon: 'sm', marker: 16, gap: 10, panelPt: 'var(--space-3)', panelPb: 'var(--space-5)' },
};

const norm = (raw) => (typeof raw === 'string' ? { value: raw, title: raw } : raw);
const asArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

export function AccordionItem({
  item,
  size = 'md',
  variant = 'bordered',
  headingLevel = 3,
  open: openProp,
  defaultOpen = false,
  onToggle,
  first = false,
  last = false,
  keepMounted = false,
  idBase,
  buttonRef,
  onKeyDown,
  children,
}) {
  const it = norm(item) || {};
  const s = SIZES[size] || SIZES.md;
  const uid = React.useId();
  const base = idBase || uid;
  const [selfOpen, setSelfOpen] = React.useState(defaultOpen);
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const open = openProp != null ? openProp : selfOpen;
  const disabled = !!it.disabled;
  const content = children != null ? children : it.content;
  const Heading = `h${Math.min(6, Math.max(1, headingLevel))}`;
  const flush = variant === 'flush';

  const toggle = () => {
    if (disabled) return;
    if (openProp == null) setSelfOpen((o) => !o);
    if (onToggle) onToggle(!open, it);
  };

  return (
    <div
      data-accordion-item={it.value}
      data-expanded={open ? '' : undefined}
      style={{
        borderTop: first || flush ? 0 : `var(--border-width) solid var(--accordion-divider)`,
        minWidth: 0,
      }}
    >
      <Heading style={{ margin: 0, font: 'inherit', fontWeight: 'inherit' }}>
        <button
          type="button"
          id={`${base}-header`}
          ref={buttonRef}
          aria-expanded={open}
          aria-controls={`${base}-panel`}
          aria-disabled={disabled || undefined}
          disabled={disabled}
          onClick={toggle}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={(e) => setFocus(e.target.matches(':focus-visible'))}
          onBlur={() => setFocus(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: s.gap,
            width: '100%',
            minHeight: s.h,
            padding: `${size === 'sm' ? 6 : 8}px ${flush ? 0 : s.px}`,
            margin: 0,
            textAlign: 'left',
            fontFamily: 'var(--font-sans)',
            fontSize: s.title,
            fontWeight: 'var(--weight-medium)',
            letterSpacing: 'var(--tracking-body)',
            lineHeight: 1.4,
            color: disabled ? 'var(--accordion-header-text-disabled)' : hover ? 'var(--accordion-header-text-hover)' : 'var(--accordion-header-text)',
            background: disabled
              ? 'transparent'
              : hover && !flush
              ? 'var(--accordion-header-background-hover)'
              : open
              ? 'var(--accordion-header-background-expanded)'
              : 'var(--accordion-header-background)',
            border: 0,
            borderRadius: flush ? 'var(--radius-xs)' : first ? 'calc(var(--accordion-radius) - 1px) calc(var(--accordion-radius) - 1px) 0 0' : 0,
            boxShadow: focus ? 'var(--accordion-header-focus-ring)' : 'none',
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'var(--transition-control)',
            position: 'relative',
            zIndex: focus ? 1 : undefined,
          }}
        >
          {it.icon && (
            <Icon
              name={it.icon}
              size={s.icon}
              style={{ color: disabled ? 'var(--accordion-marker-disabled)' : 'var(--accordion-marker)' }}
            />
          )}
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</span>
            {it.description && (
              <span
                style={{
                  display: 'block',
                  marginTop: 2,
                  fontSize: 'var(--text-2xs)',
                  fontWeight: 'var(--weight-regular)',
                  color: disabled ? 'var(--accordion-header-text-disabled)' : 'var(--accordion-description-text)',
                }}
              >
                {it.description}
              </span>
            )}
          </span>
          {it.meta != null && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, flex: '0 0 auto' }} onClick={(e) => e.stopPropagation()}>
              {it.meta}
            </span>
          )}
          <Icon
            name="chevron-down"
            size={s.marker}
            style={{
              color: disabled ? 'var(--accordion-marker-disabled)' : open ? 'var(--accordion-marker-expanded)' : 'var(--accordion-marker)',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: `transform var(--duration-fast) var(--ease-out)`,
            }}
          />
        </button>
      </Heading>
      {(open || keepMounted) && (
        <div
          id={`${base}-panel`}
          role="region"
          aria-labelledby={`${base}-header`}
          hidden={!open || undefined}
          style={{
            padding: `${open ? s.panelPt : 0} ${flush ? 0 : s.px} ${open ? s.panelPb : 0}`,
            paddingLeft: flush ? 0 : it.icon ? `calc(${s.px} + ${s.icon === 'xs' ? 14 : 16}px + ${s.gap}px)` : s.px,
            fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
            color: 'var(--accordion-panel-text)',
            minWidth: 0,
            animation: open ? 'var(--anim-fade-in)' : undefined,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export function Accordion({
  items = [],
  value,
  defaultValue,
  onChange,
  multiple = false,
  size = 'md',
  variant = 'bordered',
  headingLevel = 3,
  keepMounted = false,
  style,
  ...rest
}) {
  const uid = React.useId();
  const controlled = value !== undefined;
  const [selfValue, setSelfValue] = React.useState(() => (multiple ? asArray(defaultValue) : defaultValue ?? null));
  const current = controlled ? value : selfValue;
  const openSet = React.useMemo(() => new Set(asArray(current)), [current]);
  const refs = React.useRef([]);
  const rows = items.map(norm).filter(Boolean);

  const commit = (next) => {
    if (!controlled) setSelfValue(next);
    if (onChange) onChange(next);
  };

  const setOpen = (val, next) => {
    if (multiple) {
      const set = new Set(openSet);
      if (next) set.add(val); else set.delete(val);
      commit(rows.map((r) => r.value).filter((v) => set.has(v)));
    } else {
      commit(next ? val : null);
    }
  };

  /* Roving arrow keys between headers; each header stays a tab stop, per APG.
     Disabled headers are skipped — they are still in the DOM and still
     announced, they just cannot be landed on by arrow. */
  const move = (from, dir) => {
    const n = rows.length;
    for (let step = 1; step <= n; step += 1) {
      const i = (from + dir * step + n * step) % n;
      if (!rows[i].disabled && refs.current[i]) { refs.current[i].focus(); return; }
    }
  };
  const edge = (dir) => {
    const order = dir > 0 ? rows.map((_, i) => i) : rows.map((_, i) => rows.length - 1 - i);
    for (const i of order) if (!rows[i].disabled && refs.current[i]) { refs.current[i].focus(); return; }
  };

  const keyDown = (index) => (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(index, 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(index, -1); }
    else if (e.key === 'Home') { e.preventDefault(); edge(1); }
    else if (e.key === 'End') { e.preventDefault(); edge(-1); }
  };

  const bordered = variant === 'bordered';

  return (
    <div
      data-accordion=""
      {...rest}
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: bordered ? 'var(--accordion-background)' : 'transparent',
        border: bordered ? `var(--border-width) solid var(--accordion-border)` : 0,
        borderTop: variant === 'divided' ? `var(--border-width) solid var(--accordion-divider)` : undefined,
        borderBottom: variant === 'divided' ? `var(--border-width) solid var(--accordion-divider)` : undefined,
        borderRadius: bordered ? 'var(--accordion-radius)' : 0,
        minWidth: 0,
        ...style,
      }}
    >
      {rows.map((item, i) => (
        <AccordionItem
          key={item.value}
          item={item}
          size={size}
          variant={variant}
          headingLevel={headingLevel}
          idBase={`${uid}-${i}`}
          first={i === 0}
          last={i === rows.length - 1}
          keepMounted={keepMounted}
          open={openSet.has(item.value)}
          onToggle={(next) => setOpen(item.value, next)}
          buttonRef={(el) => { refs.current[i] = el; }}
          onKeyDown={keyDown(i)}
        />
      ))}
    </div>
  );
}
