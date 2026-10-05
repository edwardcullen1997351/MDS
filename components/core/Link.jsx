import React from 'react';
import { Icon } from './Icon.jsx';

/* Navigation. A Link goes somewhere; a Button does something. If there is no
   href, it is not a Link — use <Button variant="link"> for an action that must
   read inline. See the Link spec, §01.

   Underline policy is an accessibility contract, not a style choice.
   --text-link measures 2.56:1 against body text (2.18:1 in dark), below the
   3:1 that WCAG 1.4.1 requires for colour to be the only cue — so a link
   inside a sentence is underlined at rest. Standalone links (nav rows,
   breadcrumbs, card titles) are not inside a text block, so they may
   underline on hover only. */

const TONES = {
  default: { rest: 'var(--link-foreground)', hover: 'var(--link-foreground-hover)', active: 'var(--link-foreground-active)' },
  subtle: { rest: 'var(--link-foreground-subtle)', hover: 'var(--link-foreground-subtle-hover)', active: 'var(--link-foreground-subtle-hover)' },
  inverse: { rest: 'var(--link-foreground-inverse)', hover: 'var(--link-foreground-inverse-hover)', active: 'var(--link-foreground-inverse-active)' },
};

export function Link({
  href,
  children,
  tone = 'default',
  underline = 'always',
  external = false,
  showExternalIcon = true,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);

  if (!href) {
    console.warn('[Meridian] Link: `href` is required. A control with no destination is not a link — use <Button variant="link"> for an action, which is announced as a button and reachable by Space.');
  }

  /* An inverse link sits at 1.63:1 against inverse body text — further below
     the 3:1 that 1.4.1 wants than the default tone's 2.56:1. Without a resting
     underline it has no cue at all, so this combination is refused rather than
     warned about. */
  if (tone === 'inverse' && underline === 'hover') {
    console.warn('[Meridian] Link: tone="inverse" cannot use underline="hover" — an inverse link is only 1.63:1 against surrounding inverse text, so the underline is its only resting cue. Rendering underlined.');
    underline = 'always';
  }

  const t = TONES[tone] || TONES.default;
  const colour = down ? t.active : hover ? t.hover : t.rest;
  const lined = underline === 'always' || (underline === 'hover' && hover);

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      /* noopener closes the window.opener hole; noreferrer is house policy. */
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setDown(false); }}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      {...rest}
      style={{
        color: colour,
        textDecoration: lined ? 'underline' : 'none',
        textUnderlineOffset: 2,
        /* Keeps the glyph and the label on one line and lets the underline run
           under both, so an external link reads as a single target. */
        ...(external && showExternalIcon
          ? { display: 'inline-flex', alignItems: 'center', gap: 'var(--icon-gap-tight)' }
          : null),
        transition: 'color var(--duration-fast) var(--ease-out)',
        ...style,
      }}
    >
      {children}
      {external && showExternalIcon ? <Icon name="arrow-up-right" size="xs" /> : null}
      {external ? (
        /* Announced, not drawn: the glyph alone does not tell a screen-reader
           user the destination opens in a new tab. */
        <span style={{ position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }}>
          (opens in a new tab)
        </span>
      ) : null}
    </a>
  );
}
