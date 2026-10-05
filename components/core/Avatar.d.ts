import * as React from 'react';

/**
 * A person or a machine, identified in the space of a table row.
 *
 * **No colour identity, by design.** Every ramp this system owns already
 * carries meaning — green is Success, red is Critical, and `--viz-1…6` means
 * *series* identity — so hashing a name to a hue would put a Critical-red disc
 * beside one operator in an alarm list and a Success-green one beside the next.
 * The initials identify; the disc is always a sunken surface. Only the presence
 * dot may be coloured, because presence genuinely is a state.
 *
 * Takes no `onClick`: an avatar that opens a profile is a `Button` or `Link`
 * *wrapping* an avatar, so it gets a role, a focus ring and a keyboard.
 */
export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children' | 'onClick'> {
  /** The full name. Initials are derived from it, and it becomes the accessible name. */
  name?: string;
  /** Override the derived initials — a nickname, or a name the heuristic gets wrong. */
  initials?: string;
  /** Optional photo. Initials render underneath, so a 404 reveals them with no flash. */
  src?: string;
  /** `machine` for a service account or an asset ID (PRS-4120): mono type, square corners. Tag's rule — mono for identifiers, sans for names. */
  kind?: 'person' | 'machine';
  /** 20 · 24 · 32 · 40 · 64 px. Below 24px only one initial is rendered — two do not fit. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Presence. The only coloured part of the component, and it needs `statusLabel`. Not available below 24px. */
  status?: 'online' | 'busy' | 'away' | 'offline';
  /** The presence meaning in words, appended to the accessible name — the dot alone is colour-only (WCAG 1.4.1). */
  statusLabel?: string;
  /** Hide from the accessibility tree. **Correct whenever the name is already beside it** — in a table cell, a row, a list item. */
  decorative?: boolean;
  style?: React.CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;

/**
 * Also reachable as `Avatar.deriveInitials` — which is how a consumer loading the
 * compiled bundle gets at it, since only capital-initial exports reach the window
 * namespace (the same reason `Icon.setBasePath` hangs off `Icon`).
 *
 * First grapheme of the first word + first grapheme of the last word, upper-cased.
 * Exported because the rules are not obvious and duplicating them drifts:
 * a Han/Hiragana/Hangul first glyph returns ALONE (one character is already a
 * whole name element); a single word returns one; an email is reduced to its
 * local part first; and the split is grapheme-aware, so combining marks and
 * emoji are not sliced in half. A single token containing a digit or a separator is
 * treated as an IDENTIFIER and takes TWO graphemes of its leading alphanumeric run
 * ('PRS-4120' → PR), because the prefix is what distinguishes one asset from its
 * family; a real single-word name ('Prince') still takes one.
 */
export declare function deriveInitials(name?: string, max?: number): string;
