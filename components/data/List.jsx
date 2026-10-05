import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* List — the run of records Table refuses.

   "List" is the vaguest name a design system can ship, and the vagueness is
   the design problem: it collapses at least three unrelated components.

   · A run of records with unlike shapes — an activity feed, an alarm list,
     search results. Table §01 sends these away by name ("if half the columns
     are empty for half the rows, they are not columns") and until 1.22.0 the
     system had nowhere to send them, so every product hand-rolled a div
     stack. THIS is List.
   · One record's label/value pairs. Table §01 and §12 both call for a
     "definition list" — different element (`dl/dt/dd`), different semantics,
     a separate component. Logged, not folded in (§14).
   · A set of selectable options. That is `role="listbox"`, which Combobox and
     MultiCombobox already own inside their popovers. Not this.

   The interaction decision, which is the one that matters: THE ROW IS NOT A
   CONTROL. Interaction lives in the row's content — a Link in the title, an
   IconButton or Menu in the actions slot. This is not timidity; it is the
   third time this system has met the same defect. Table shipped `<tr onClick>`
   and documented what it cost. Card shipped `interactive` with a pointer
   cursor, no role, no tabIndex and no key handler — a mouse-only control.
   Avatar refused `onClick` outright for the same reason. A clickable `<li>`
   would be the fourth. */

const PAD = { sm: 'var(--list-row-padding-y-sm)', md: 'var(--list-row-padding-y-md)', lg: 'var(--list-row-padding-y-lg)' };
const GAP = { sm: 'var(--list-gap-sm)', md: 'var(--list-gap-md)', lg: 'var(--list-gap-lg)' };
const LEAD = { sm: 'var(--list-leading-size-sm)', md: 'var(--list-leading-size-md)', lg: 'var(--list-leading-size-lg)' };
const TITLE = { sm: 'var(--text-xs)', md: 'var(--text-sm)', lg: 'var(--text-base)' };

const listContext = React.createContext({ size: 'md', gutter: false, ordinals: false, divided: true, responsive: false });

export function List({
  as,
  variant = 'divided',
  size = 'md',
  ordered = false,
  /* Opt-in container query (§11) — same reasoning as DescriptionList: frozen
     API, so the caller asks for it. */
  responsive = false,
  label,
  children,
  style,
  ...rest
}) {
  const divided = variant === 'divided';
  const kids = React.Children.toArray(children);
  /* If ANY row carries a leading element, EVERY row reserves the gutter —
     otherwise the titles sit on two different left edges and the column stops
     scanning. Menu solved this with `anyIndent` and MultiCombobox with a
     permanently reserved checkbox column; same rule, third time.

     The ordinal is a SEPARATE reservation, not the same slot: a row can have
     both, and for one build the gutter rendered `marker != null ? marker :
     leading`, so every row of an ordered list silently dropped its icon. */
  const gutter = kids.some((k) => React.isValidElement(k) && k.props.leading);
  const ordinals = ordered || kids.some((k) => React.isValidElement(k) && k.props.marker != null);
  const Tag = as || (ordered ? 'ol' : 'ul');

  if (!label && rest['aria-label'] == null && rest['aria-labelledby'] == null) {
    console.warn('[Meridian] List: no `label`. A list announces "list, 6 items" with no indication of what they are — name it, or point aria-labelledby at the heading above it.');
  }

  /* Two things a row cannot know about itself, so the parent supplies them:
     whether it is last (the divider is a bottom rule, and the last row must
     not draw one — inline styles cannot express :last-child), and its ordinal
     when the list is `ordered`, since list-style: none hides the native
     marker this component always suppresses.

     Mapped over `kids`, NOT over raw `children`: toArray strips null,
     undefined and booleans while Children.map preserves their positions, so
     computing the length from one and the index from the other put `__last`
     on the wrong row the moment a caller wrote {cond && <ListItem/>} — which
     the console template does constantly. */
  const items = kids.map((k, i) =>
    React.isValidElement(k)
      ? React.cloneElement(k, {
        __last: i === kids.length - 1,
        ...(ordered && k.props.marker == null ? { marker: i + 1 } : null),
      })
      : k);

  return (
    <Tag
      {...rest}
      /* role="list" explicitly, even though ul/ol carry it natively: Safari
         with VoiceOver drops list semantics the moment `list-style: none` is
         applied, which this component always applies. Without it a six-row
         list is announced as six loose paragraphs and the list-navigation
         shortcut does nothing. */
      role="list"
      aria-label={label || rest['aria-label']}
      data-ds-container={responsive ? '' : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: divided ? 0 : GAP[size] || GAP.md,
        listStyle: 'none',
        margin: 0,
        padding: 0,
        minWidth: 0,
        ...style,
      }}
    >
      <listContext.Provider value={{ size, gutter, ordinals, divided, responsive }}>{items}</listContext.Provider>
    </Tag>
  );
}

export function ListItem({
  leading,
  marker,
  title,
  href,
  description,
  meta,
  actions,
  __last,
  style,
  ...rest
}) {
  const { size, gutter, ordinals, divided, responsive } = React.useContext(listContext);
  const pad = PAD[size] || PAD.md;

  if (rest.onClick) {
    console.warn('[Meridian] ListItem: `onClick` is not supported. A row that navigates puts a Link in its `title` (pass `href`); a row with commands puts a Button or Menu in `actions`. A clickable <li> has no role, no tabindex and no key handler — the mouse-only control Card shipped in 1.15.0 and Avatar refuses outright.');
  }
  if (!title && !description) {
    console.warn('[Meridian] ListItem: no `title` and no `description` — a row of only a glyph and a timestamp says nothing that can be scanned or announced.');
  }

  return (
    <li
      {...rest}
      onClick={undefined}
      data-ds-cq={responsive ? 'list-row' : undefined}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--list-gutter-gap)',
        padding: divided ? `${pad} 0` : 0,
        /* A bottom rule on every row but the last, not a top rule on every row
           but the first: a list rendered into a Card already has the Card’s
           header rule above it, and a top rule would double it. */
        borderBottom: divided && !__last ? 'var(--border-width) solid var(--list-divider)' : 'none',
        minWidth: 0,
        ...style,
      }}
    >
      {ordinals && (
        /* Its own column, and NEVER aria-hidden: the ordinal is the one thing
           this gutter can hold that is not decorative. It was hidden from the
           accessibility tree for one build — keyed off `leading`, which an
           ordered row does not have — while list-style: none had already
           suppressed the native marker, so `ordered` conveyed its number to
           nobody using a screen reader. */
        <span
          style={{
            flex: '0 0 auto',
            minWidth: 'var(--list-leading-size-sm)',
            display: 'grid',
            placeItems: 'center end',
            height: LEAD[size] || LEAD.md,
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-2xs)',
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--list-marker-text)',
          }}
        >{marker}</span>
      )}
      {gutter && (
        <span
          /* No aria-hidden on the wrapper: the child carries its own
             semantics. An Icon renders no accessible name at all, and a Badge
             dot standing for severity supplies its own aria-label — hiding
             the wrapper would have suppressed that label too. */
          style={{
            flex: '0 0 auto',
            display: 'grid',
            placeItems: 'center',
            width: LEAD[size] || LEAD.md,
            height: LEAD[size] || LEAD.md,
            /* An icon gets the sunken square; an Avatar, a Badge or a status
               dot brings its own shape and must not be boxed inside a second
               one. So the tile is drawn only for a glyph. */
            background: React.isValidElement(leading) && leading.type === Icon ? 'var(--list-leading-background)' : 'transparent',
            borderRadius: 'var(--list-leading-radius)',
            color: 'var(--list-leading-foreground)',
          }}
        >
          {leading}
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {title && (
          <span style={{ fontSize: TITLE[size] || TITLE.md, color: 'var(--list-title-text)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {href ? (
              /* The title becomes the link, and the ROW does not. One tab stop
                 per row, the link's accessible name is the title, the text
                 stays selectable, and the actions beside it remain reachable —
                 none of which survives a block-level overlay link. */
              <a href={href} style={{ color: 'inherit', textDecoration: 'none' }}>{title}</a>
            ) : title}
          </span>
        )}
        {description && (
          /* Two lines, clamped. A list row is not a paragraph — Menu's rule,
             and the reason the row keeps a predictable height in a long run. */
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--list-description-text)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textWrap: 'pretty' }}>{description}</span>
        )}
        {meta && (
          <span style={{ marginTop: 2, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--list-meta-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta}</span>
        )}
      </div>
      {actions && (
        <span style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 'var(--list-actions-gap)' }}>{actions}</span>
      )}
    </li>
  );
}

List.Item = ListItem;
