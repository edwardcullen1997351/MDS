import React from 'react';

/* Card — the default grouping device, and the surface most other components
   sit inside. Because it is a container rather than a control, almost every
   defect it can have is a semantic one: the wrong element, the wrong heading
   level, or a promise of interactivity it cannot keep.

   Hardened 1.15.0. Four real problems, all invisible in a screenshot:

   • `interactive` set `cursor: pointer` and strengthened the border on a
     <section> that was not focusable, had no role and handled no keys. Any
     product passing onClick through ...rest got a mouse-only card — the same
     defect class as Table's <tr onClick> and Dialog's <th onClick>.
   • `title` always rendered <h3>, so a card nested under an h3 produced an
     invalid heading hierarchy with no way to correct it. Accordion has had
     `headingLevel` since 1.0; Card did not.
   • The <section> had no accessible name. An unnamed <section> is NOT
     exposed as a region, so the element bought nothing — and some screen
     readers announce it as an unnamed region, which is worse than a div.
   • The footer was hard-wired to justify-content: flex-end, which silently
     broke the one composition the system recommends most: Pagination in a
     card footer. Pagination is a space-between flex row with no width, so
     as a flex item in a flex-end footer it collapsed to its content and its
     summary jammed against its controls. */

const PAD = { none: 0, sm: 'var(--space-4)', md: 'var(--space-6)', lg: 'var(--space-8)' };
const FOOTER_ALIGN = { end: 'flex-end', start: 'flex-start', between: 'space-between' };

export function Card({
  as,
  title,
  subtitle,
  actions,
  footer,
  footerAlign = 'end',
  headingLevel = 3,
  padding = 'md',
  elevated = false,
  interactive = false,
  onClick,
  children,
  style,
  ...rest
}) {
  const uid = React.useId();
  const titleId = `${uid}-title`;
  const pad = PAD[padding] != null ? PAD[padding] : PAD.md;
  const hasHeader = title || subtitle || actions;
  const clickable = interactive && !!onClick;

  if (interactive && !onClick) {
    console.warn('[Meridian] Card: `interactive` with no `onClick` gives the card a pointer cursor and a hover border but nothing to activate — and passing onClick through the spread instead leaves it unfocusable and keyboard-inert. Pass onClick, or drop `interactive`.');
  }

  /* A <section> is only a landmark when it has an accessible name; unnamed,
     it buys nothing and some screen readers announce "region" with no
     indication of what it contains. So the element follows the content: a
     titled card is a real named region, an untitled one is a div. */
  const Tag = as || (title ? 'section' : 'div');

  return (
    <Tag
      data-card={clickable ? 'interactive' : 'static'}
      data-elevated={elevated ? '' : undefined}
      aria-labelledby={title && Tag === 'section' ? titleId : undefined}
      onClick={clickable ? onClick : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); }
      } : undefined}
      {...rest}
      style={{
        display: 'flex',
        flexDirection: 'column',
        /* Background, border AND box-shadow are all owned by base.css.
           The shadow has to be there too, not just the border: the
           focus-visible ring IS a box-shadow, and an inline box-shadow of
           any value outranks it, so leaving the resting shadow inline
           silently killed the focus ring. */
        borderRadius: 'var(--card-radius)',
        minWidth: 0,
        ...style,
      }}
    >
      {hasHeader && (
        <header style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', padding: `var(--space-4) ${pad || 'var(--space-4)'}`, borderBottom: 'var(--border-width) solid var(--card-header-border)' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            {title && React.createElement(
              `h${Math.min(Math.max(headingLevel, 1), 6)}`,
              { id: titleId, style: { margin: 0, fontSize: 'var(--text-md)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-heading)', color: 'var(--card-title-text)' } },
              title,
            )}
            {subtitle && <p style={{ margin: '3px 0 0', fontSize: 'var(--text-xs)', color: 'var(--card-subtitle-text)' }}>{subtitle}</p>}
          </div>
          {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flex: '0 0 auto' }}>{actions}</div>}
        </header>
      )}
      <div style={{ padding: pad, minWidth: 0, flex: 1 }}>{children}</div>
      {footer && (
        <footer
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: FOOTER_ALIGN[footerAlign] || FOOTER_ALIGN.end,
            flexWrap: 'wrap',
            gap: 'var(--space-2)',
            padding: `var(--space-3) ${pad || 'var(--space-4)'}`,
            borderTop: 'var(--border-width) solid var(--card-footer-border)',
            background: 'var(--card-footer-background)',
            borderRadius: '0 0 var(--card-radius) var(--card-radius)',
          }}
        >
          {/* footerAlign="between" is for a footer holding ONE full-width
              child that does its own distribution — Pagination, a summary
              row. The child is stretched, because a space-between parent
              cannot help a flex item that has collapsed to its content. */}
          {footerAlign === 'between'
            ? <div style={{ flex: 1, minWidth: 0, display: 'flex' }}>{React.isValidElement(footer) ? React.cloneElement(footer, { style: { flex: 1, minWidth: 0, ...(footer.props.style || {}) } }) : footer}</div>
            : footer}
        </footer>
      )}
    </Tag>
  );
}
