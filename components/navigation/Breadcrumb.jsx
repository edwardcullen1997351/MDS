import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Menu } from './Menu.jsx';

/* Breadcrumb — where you are, and the way back up. A trail of links plus one
   current-page crumb that is deliberately NOT a link: a link to the page you
   are on is a no-op the user has to test to discover.

   It draws its own anchors rather than wrapping Link, because a trail is
   standalone navigation: no resting underline, secondary colour, per-size
   type, and a last item that is plain text. Link's contract is the opposite
   of all four. */

const SIZES = {
  sm: { text: 'var(--text-2xs)', icon: 12, sep: 12, gap: 5 },
  md: { text: 'var(--text-xs)', icon: 14, sep: 14, gap: 6 },
};

const norm = (raw) => (typeof raw === 'string' ? { label: raw } : raw);

function Crumb({ item, size, current }) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const body = (
    <>
      {item.icon && <Icon name={item.icon} size={s.icon} style={{ color: current ? 'var(--breadcrumb-text-current)' : 'var(--breadcrumb-icon)' }} />}
      {item.label ? <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span> : null}
    </>
  );
  const shared = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--icon-gap-tight)',
    fontFamily: 'var(--font-sans)',
    fontSize: s.text,
    letterSpacing: 'var(--tracking-body)',
    maxWidth: 220,
    minWidth: 0,
  };

  if (current) {
    return (
      /* aria-current, not a disabled link: the crumb is the page title in
         miniature, so it is text, and it is the only crumb in --weight-medium. */
      <span aria-current="page" style={{ ...shared, color: 'var(--breadcrumb-text-current)', fontWeight: 'var(--weight-medium)' }}>
        {body}
      </span>
    );
  }

  return (
    <a
      href={item.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={(e) => setFocus(e.target.matches(':focus-visible'))}
      onBlur={() => setFocus(false)}
      style={{
        ...shared,
        color: hover ? 'var(--breadcrumb-text-hover)' : 'var(--breadcrumb-text)',
        textDecoration: hover ? 'underline' : 'none',
        textUnderlineOffset: 2,
        borderRadius: 'var(--radius-xs)',
        boxShadow: focus ? 'var(--breadcrumb-focus-ring)' : 'none',
        outline: 'none',
        transition: 'color var(--duration-fast) var(--ease-out)',
      }}
    >
      {body}
    </a>
  );
}

function Sep({ size, variant }) {
  const s = SIZES[size] || SIZES.md;
  if (variant === 'slash') {
    return (
      <span aria-hidden="true" style={{ color: 'var(--breadcrumb-separator)', fontSize: s.text, userSelect: 'none' }}>/</span>
    );
  }
  return <Icon name="chevron-right" size={s.sep} style={{ color: 'var(--breadcrumb-separator)' }} />;
}

export function Breadcrumb({
  items = [],
  size = 'md',
  variant = 'chevron',
  maxItems = 4,
  label = 'Breadcrumb',
  onNavigate,
  style,
  ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const rows = items.map(norm).filter(Boolean);

  React.useEffect(() => {
    const missing = rows.slice(0, -1).filter((r) => !r.href).length;
    if (missing) console.warn(`[Meridian] Breadcrumb: ${missing} ancestor crumb(s) have no href. Every crumb except the last must be a real link — a trail you cannot climb is decoration.`);
  }, [rows.length]);

  /* Collapse the middle, never the ends: the root orients, the parent is the
     one crumb people actually press, and the current page is the label. */
  let head = rows;
  let hidden = [];
  let tail = [];
  if (rows.length > maxItems && maxItems >= 3) {
    head = rows.slice(0, 1);
    tail = rows.slice(-2);
    hidden = rows.slice(1, -2);
  }

  const visible = [...head, ...(hidden.length ? ['overflow'] : []), ...tail];

  return (
    <nav aria-label={label} data-breadcrumb={variant} {...rest} style={{ minWidth: 0, ...style }}>
      <ol style={{ display: 'flex', alignItems: 'center', gap: s.gap, margin: 0, padding: 0, listStyle: 'none', minWidth: 0 }}>
        {visible.map((entry, i) => {
          const last = i === visible.length - 1;
          const key = entry === 'overflow' ? 'overflow' : `${entry.href || ''}-${i}`;
          return (
            <li key={key} style={{ display: 'flex', alignItems: 'center', gap: s.gap, minWidth: 0 }}>
              {entry === 'overflow' ? (
                <Menu
                  label="Skipped levels"
                  size="sm"
                  items={hidden.map((h) => ({
                    label: h.label,
                    icon: h.icon,
                    /* Menu rows are commands, not links, so the skipped
                       levels navigate through a handler. SPAs pass
                       onNavigate to keep it inside the router. */
                    onSelect: () => (onNavigate ? onNavigate(h) : h.href && window.location.assign(h.href)),
                  }))}
                  trigger={
                    <button
                      type="button"
                      aria-label={`Show ${hidden.length} skipped level${hidden.length === 1 ? '' : 's'}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        height: 18,
                        padding: '0 4px',
                        border: 0,
                        background: 'transparent',
                        color: 'var(--breadcrumb-overflow-text)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: s.text,
                        borderRadius: 'var(--radius-xs)',
                        cursor: 'pointer',
                        transition: 'var(--transition-control)',
                      }}
                    >
                      …
                    </button>
                  }
                />
              ) : (
                <Crumb item={entry} size={size} current={last} />
              )}
              {!last && <Sep size={size} variant={variant} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
