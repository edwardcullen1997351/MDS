import React from 'react';
import { Avatar } from './Avatar.jsx';

/* Who is on this — one accessible summary, not N announcements.

   The group is its own component for the reason ChipGroup is: the overlap,
   the overflow maths and the announcement are the whole job, and Avatar.jsx
   is only the disc. Three things it owns that a row of Avatars cannot:

   · The overlap, as a fraction of the disc rather than a pixel offset, so it
     holds at every size.
   · The ring that punches each disc out of the one behind it — the page
     surface, not a border colour (a grey border on a grey disc just gets
     thicker).
   · ONE label. Six avatars in a cell would otherwise announce six times, and
     "Maya Osei, Tomas Lind, and 4 others" is what a person actually wants.

   DOM order is reversed against paint order so that the FIRST avatar sits on
   top without any z-index bookkeeping: later siblings paint above earlier
   ones, so the list is laid out right-to-left with `flex-direction:
   row-reverse`. */

export function AvatarGroup({
  people = [],
  max = 4,
  size = 'sm',
  label,
  style,
  ...rest
}) {
  const shown = people.slice(0, max);
  const hidden = people.length - shown.length;

  if (people.length > 12 && !label) {
    console.warn('[Meridian] AvatarGroup: more than 12 people and no `label`. The generated summary becomes a long string nobody wants read out — pass a label like "12 assignees".');
  }
  if (max < 1) {
    console.warn('[Meridian] AvatarGroup: `max` below 1 renders nothing but a count, which is a number, not a group. Use a Badge.');
  }

  const names = shown.map((p) => (typeof p === 'string' ? p : p.name)).filter(Boolean);
  const hiddenNames = people.slice(max).map((p) => (typeof p === 'string' ? p : p.name)).filter(Boolean);
  /* The label now covers the SHOWN people only. The overflow chip carries the
     rest under its own name, so nothing is double-counted and nothing is
     lost — see the comment on the chip. */
  const summary = label || (names.length > 1
    ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
    : names[0] || '');

  return (
    <span
      {...rest}
      style={{ display: 'inline-flex', flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'flex-end', ...style }}
    >
      {hidden > 0 && (
        /* The chip is NOT decorative: it takes the name "+2 more" and carries
           the hidden names as its DESCRIPTION, so nothing is double-counted
           against the group's own label and nobody hears the same string
           twice.

           The description arrives via `title` rather than a Tooltip, and the
           reason is layering, not taste. Core is tier 2 — it may reach down
           into primitives and sideways within itself, and nothing else. This
           file's `../feedback/Tooltip.jsx` import was the system's only edge
           pointing UP a tier, and `layer-violation` in check-contracts.mjs
           now fails the build on any successor.

           Promoting `Tooltip` into core was the obvious alternative and is
           refused on taxonomy: it is a feedback surface — warmth, dismissal,
           hover tolerance, the family Toast, Snackbar, Alert and Popover
           belong to — and moving it to satisfy one import would distort the
           category to serve its tail. (At 1.26.0 there was a harder reason on
           top: Tooltip imported `feedback/anchor.js`, so promoting it would
           only have moved the violation onto a file with seven consumers.
           That argument retired at 1.27.0, when the anchoring engine moved to
           core/ on its own merits. The taxonomic one stands alone.)

           Taking the tooltip as a prop was refused on different grounds: the
           hidden names are an accessibility feature, and an opt-in one is
           absent wherever a caller forgets it.

           `title` is the option that DELETES the dependency instead of
           relocating it, and it preserves the contract intact: with role="img"
           and an aria-label present, accname skips `title` for the name and
           exposes it as the description — one attribute, both audiences, no
           hidden span.

           What is genuinely lost is the styled panel on KEYBOARD focus, since
           `title` answers the pointer only. So the chip no longer takes
           tabIndex: a focus stop that offers a keyboard user nothing is its
           own defect, and the chip stays in the accessibility tree — a screen
           reader still reaches it, names it and reads the names off it in
           browse mode. A product that wants the warm, dismissible panel wraps
           the chip itself at the call site, where reaching for feedback/ is
           legal.

           Rule, generally: a decorative element may not own a focusable
           trigger. It stops being decorative instead. */
        <span
          role="img"
          aria-label={`+${hidden} more`}
          title={hiddenNames.length ? hiddenNames.join(', ') : undefined}
          /* The chip is DOM-first in a reversed row, which puts it at the
             right end for LAYOUT but bottom-most for PAINT — later siblings
             paint above earlier ones, which is the same fact the group
             relies on to put the first person on top. So its left
             neighbour's negative margin covered the "+" and the chip
             visibly read "2", indistinguishable from a one-letter initial
             in a row where every other disc holds one letter. box-shadow
             does not raise a stacking context; this does. The chip is the
             one element deliberately outside the first-person-on-top
             ordering, so it is the one element that gets a z-index. */
          style={{ display: 'inline-flex', position: 'relative', zIndex: 1, borderRadius: 'var(--avatar-radius)' }}
        >
          <Avatar
            decorative
            size={size}
            initials={`+${hidden}`}
            style={{ boxShadow: `0 0 0 var(--avatar-group-ring-width) var(--avatar-group-ring)`, '--avatar-ink': 'var(--avatar-overflow-foreground)' }}
          />
        </span>
      )}
      <span role="img" aria-label={summary} style={{ display: 'inline-flex', flexDirection: 'row-reverse', alignItems: 'center' }}>
        {[...shown].reverse().map((p, i) => {
          const person = typeof p === 'string' ? { name: p } : p;
          return (
            <Avatar
              key={person.id || person.name || i}
              decorative
              size={size}
              name={person.name}
              /* ONE initial per disc, always — the count is a function of the
                 READABLE width, not the disc width, and in a group every disc
                 but the top one loses ~32% of itself to its neighbour. Two
                 centred glyphs in 24px with 9.7px covered on the left renders
                 as "'L" and ")R": exactly the smudge Avatar §05 introduces the
                 one-initial rule to prevent, recreated at the very size the
                 rule stops applying. Precise identification is not the
                 group's job — the role="img" label and the chip's own name
                 and description carry the names. */
              initials={person.initials != null ? person.initials : Avatar.deriveInitials(person.name, 1)}
              src={person.src}
              kind={person.kind}
              style={{
                /* Negative margin-RIGHT because the row is reversed: in
                   row-reverse the main axis runs right-to-left, so
                   margin-right is the leading edge and a negative one pulls
                   each disc over the neighbour to its right. The visually
                   right-most disc gets none, so the group ends flush — unless
                   the overflow chip follows it, which then needs the pull. */
                marginRight: i === 0 ? (hidden === 0 ? 0 : `calc(var(--avatar-size-${size}) * -1 * var(--avatar-group-overlap))`) : `calc(var(--avatar-size-${size}) * -1 * var(--avatar-group-overlap))`,
                boxShadow: `0 0 0 var(--avatar-group-ring-width) var(--avatar-group-ring)`,
              }}
            />
          );
        })}
      </span>
    </span>
  );
}
