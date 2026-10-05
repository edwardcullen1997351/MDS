import * as React from 'react';

/**
 * A user- or data-derived token: an applied filter, a facet, a label someone
 * typed, a value pulled off a record. Tag is the counterpart to `Badge` —
 * Badge states a condition the system knows about, in a colour that carries
 * meaning; Tag carries a value the system does not interpret, and therefore
 * has no tones at all.
 *
 * The body is a `<button>` only when `onClick` is passed; a display-only tag
 * is a `<span>` and not a tab stop. A removable tag is always reachable by
 * keyboard: `Delete` / `Backspace` removes it when focused, and when the body
 * is not a button the × is itself a real button.
 */
export interface TagProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style' | 'children'> {
  /** The token text. Exact and verbatim — `site:tilburg`, `PN-7749`. */
  label?: React.ReactNode;
  children?: React.ReactNode;
  /** Optional leading Lucide glyph. Use for the token's *kind*, not decoration. */
  icon?: string;
  /** Makes the tag removable: renders the ×, publishes `aria-keyshortcuts="Delete"`. */
  onRemove?: (e: React.SyntheticEvent) => void;
  /** Accessible name for the remove control. Defaults to `Remove <label>`. */
  removeLabel?: string;
  /** Applied / active. A pressable tag always reports `aria-pressed`, true or false. */
  selected?: boolean;
  disabled?: boolean;
  /** `sm` for table cells and dense rows · `md` default. Heights are token-driven
   *  (`--tag-height-*`) and rise to 32/36px under a coarse pointer. */
  size?: 'sm' | 'md';
  /** `mono` (default) for keys, ids and facets · `sans` for typed phrases. */
  font?: 'mono' | 'sans';
  /** Truncation ceiling, e.g. 160 or '12rem'. Labels ellipsis; keep the title attribute. */
  maxWidth?: number | string;
  /** Present ⇒ pressable: the tag becomes a `<button>`. */
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;

/**
 * A wrapped row of tags with a single tab stop and ←/→ travel between them,
 * plus an overflow count that always has a destination: it is a real button
 * which either calls `onShowMore` or reveals the remaining tags in place.
 */
export interface TagListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  children?: React.ReactNode;
  /** Render at most this many, then `+n more`. Omit to show all. */
  limit?: number;
  /** Custom overflow text, e.g. `(n) => \`+${n} filters\``. */
  moreLabel?: (hidden: number) => React.ReactNode;
  /** Handle the overflow press yourself — open a Popover, route to a filter panel.
   *  Omit and the count expands the row in place. */
  onShowMore?: (e: React.MouseEvent, hidden: number) => void;
  /** Gap in px. Default 6. */
  gap?: number;
  align?: 'start' | 'end';
  style?: React.CSSProperties;
}
export declare const TagList: React.ForwardRefExoticComponent<TagListProps & React.RefAttributes<HTMLDivElement>>;
