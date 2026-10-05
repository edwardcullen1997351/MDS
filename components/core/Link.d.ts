import * as React from 'react';

/**
 * Navigation. A Link goes somewhere; a Button does something.
 *
 * No `href` → not a Link. Use `<Button variant="link">` for an action that
 * must read inline: it is announced as a button and activates on Space.
 */
export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'style'> {
  /** Destination. Required — warns if omitted. */
  href: string;
  children: React.ReactNode;
  /**
   * `default` — the action colour, for links in prose and standalone links.
   * `subtle` — inherits the secondary text colour, for breadcrumbs, footers
   * and metadata rows where a blue link per line would be noise.
   * `inverse` — on an inverse surface.
   */
  tone?: 'default' | 'subtle' | 'inverse';
  /**
   * `always` (default) — required for any link inside a sentence:
   * `--text-link` is 2.56:1 against body text, below the 3:1 WCAG 1.4.1 needs
   * for colour to be the only cue.
   * `hover` — permitted ONLY for a standalone link that is not inside a text
   * block: a nav row, a breadcrumb, a card title, a table cell.
   */
  underline?: 'always' | 'hover';
  /** Adds target="_blank", rel="noopener noreferrer", the arrow glyph, and an announced "(opens in a new tab)". */
  external?: boolean;
  /** Suppress the arrow glyph on an external link. The announcement stays. */
  showExternalIcon?: boolean;
  /** Layout only. Colour, decoration and size come from tone and context. */
  style?: React.CSSProperties;
}
export declare function Link(props: LinkProps): JSX.Element;
