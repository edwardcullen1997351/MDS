import * as React from 'react';

export interface AvatarGroupPerson {
  id?: string;
  name: string;
  initials?: string;
  src?: string;
  kind?: 'person' | 'machine';
}

/**
 * Who is on this — overlapping discs and **one** accessible summary.
 *
 * Its own component for the reason `ChipGroup` is: the overlap fraction, the
 * overflow maths and the announcement are the whole job, and `Avatar` is only
 * the disc. Six avatars in a cell would otherwise announce six times.
 *
 * Announces as TWO things, not one: a `role="img"` naming the shown people, and
 * a "+N more" chip that names itself and carries the hidden names as its
 * DESCRIPTION, via `title` — so the group's label covers the shown people, the
 * chip covers the rest, and nothing is announced twice.
 *
 * The chip is deliberately NOT focusable and deliberately does not use
 * `Tooltip`: `core` is tier 2 and may not import from tier 3, and `title`
 * answers the pointer only, so a tab stop there would offer a keyboard user
 * nothing. Wrap the chip at the call site if you want the warm, dismissible
 * panel — reaching for `feedback/` is legal there.
 */
export interface AvatarGroupProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Strings are shorthand for `{ name }`. Order is meaningful — the first is painted on top. */
  people: (AvatarGroupPerson | string)[];
  /** Discs shown before collapsing to “+N”. Default 4. */
  max?: number;
  /** Default `sm` — a group is denser than a lone avatar. */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Replaces the generated summary of the SHOWN people. The overflow chip keeps its own name and description regardless. Pass one past ~12 people, where the generated string gets long. */
  label?: string;
  style?: React.CSSProperties;
}
export declare function AvatarGroup(props: AvatarGroupProps): JSX.Element;
