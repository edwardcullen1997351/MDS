import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* EmptyState — the absence of data, explained.

   The premise of this component, and the reason it is not one box with one
   message: "empty" is at least four unrelated situations, and the defect it
   exists to prevent is treating them as one.

   · first-run   Nothing exists yet because the user has not made anything.
                 Wants a primary action that creates the first one.
   · no-results  Data EXISTS; the current query excludes it. Wants a way back
                 (clear the filter, widen the range) and must NOT offer
                 "create your first" — the user has dozens, they just cannot
                 see them. This is the single most common empty-state bug in
                 any console, and it is a content bug that a `variant` prop
                 can prevent structurally.
   · cleared     Nothing is here because the work is done: no open alarms,
                 no unassigned orders. This is a SUCCESS. A sad face and a
                 call to action here tells an operator they have failed at
                 achieving inbox zero.
   · restricted  Nothing is shown because this user may not see it. Nothing
                 to create, nothing to clear — an explanation and, at most, a
                 way to ask someone.

   Two things it deliberately is not:

   · Not an error. "We could not load this" is a condition with a cause and a
     retry, which is `Alert` — and passing an error through here loses the
     retry, the tone and the assertive announcement. The component warns.
   · Not a loading state. A skeleton that never resolves is the most common
     cause of an apparently hung console (Skeleton §12); this renders only
     once the data has arrived and turned out to be empty.

   And it paints nothing by default: no surface, no border. It sits inside a
   Card or a Table region that already has one. */

const VARIANTS = {
  'first-run': { icon: 'circle-plus', positive: false },
  'no-results': { icon: 'search-x', positive: false },
  cleared: { icon: 'circle-check', positive: true },
  restricted: { icon: 'lock', positive: false },
};

const PAD = { sm: 'var(--empty-state-padding-sm)', md: 'var(--empty-state-padding-md)', lg: 'var(--empty-state-padding-lg)' };
const MINH = { sm: 'var(--empty-state-min-height-sm)', md: 'var(--empty-state-min-height-md)', lg: 'var(--empty-state-min-height-lg)' };
const ICON = { sm: 'sm', md: 'lg', lg: 'lg' };
const TITLE = { sm: 'var(--text-sm)', md: 'var(--text-md)', lg: 'var(--text-lg)' };
const BODY = { sm: 'var(--text-xs)', md: 'var(--text-sm)', lg: 'var(--text-sm)' };

export function EmptyState({
  variant = 'first-run',
  /* Opt-in container query (§14): below 380px the illustration goes, because
     it is decoration and the title and action are the content. Never
     automatic — the API is frozen. */
  responsive = false,
  title,
  children,
  hint,
  icon,
  actions,
  headingLevel = 3,
  size = 'md',
  align = 'center',
  bordered = false,
  /* Off by default, exactly as Alert: an empty state present when the region
     first renders has already been read in document order. Only one that
     APPEARS in response to something the user did — a filter that matched
     nothing — needs announcing. */
  live = 'off',
  style,
  ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS['first-run'];
  const centred = align === 'center';

  if (!title) {
    console.warn('[Meridian] EmptyState: no `title`. A glyph over a body sentence gives the user nothing to scan — the title is the one part that is always read.');
  }
  if (variant === 'no-results' && !actions) {
    console.warn('[Meridian] EmptyState: variant="no-results" with no `actions`. The data exists and a filter is hiding it, so the user needs a way back — a Clear filters button, at minimum. Without one this is a dead end.');
  }
  if (variant === 'cleared' && actions) {
    console.warn('[Meridian] EmptyState: variant="cleared" with `actions`. An empty queue is an achievement; a call to action turns it into a task. Show the actions in the region\'s own toolbar instead.');
  }
  if (variant === 'restricted' && live !== 'off') {
    console.warn('[Meridian] EmptyState: variant="restricted" with `live`. A permission boundary is not an event — announcing it interrupts to say nothing changed.');
  }
  if (/^(error|failed|something went wrong|could not|couldn)/i.test(String(title || ''))) {
    console.warn('[Meridian] EmptyState: this looks like an error, not an empty state. An error has a cause and a retry — use <Alert tone="danger"> so it keeps its tone, its retry action and its assertive announcement.');
  }

  const panel = (
    <div
      /* A plain group by default. role="status" only when `live` is on, so a
         filter that empties a table announces once — and an empty state that
         was there on load stays silent. */
      role={live === 'off' ? 'group' : 'status'}
      aria-live={live === 'off' ? undefined : 'polite'}
      data-empty-state={variant}
      data-ds-cq={responsive ? 'empty-state' : undefined}
      {...rest}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: centred ? 'center' : 'flex-start',
        justifyContent: 'center',
        textAlign: centred ? 'center' : 'left',
        gap: 'var(--empty-state-gap)',
        /* min-height, never height, and never a viewport unit: the region
           this sits in decides how tall it is, and a vh floor breaks the
           moment it appears inside a Card or a Drawer. */
        minHeight: MINH[size] || MINH.md,
        padding: PAD[size] || PAD.md,
        background: bordered ? 'var(--empty-state-background-bordered)' : 'var(--empty-state-background)',
        border: bordered ? `var(--border-width) solid var(--empty-state-border)` : 'none',
        borderRadius: bordered ? 'var(--empty-state-radius)' : 0,
        minWidth: 0,
        ...style,
      }}
    >
      {icon !== false && (
        <Icon
          name={icon || v.icon}
          size={ICON[size] || 'lg'}
          aria-hidden="true"
          data-ds-cq={responsive ? 'empty-state-figure' : undefined}
          style={{ color: v.positive ? 'var(--empty-state-icon-positive)' : 'var(--empty-state-icon)', flex: 'none' }}
        />
      )}
      {title && React.createElement(
        `h${Math.min(Math.max(headingLevel, 1), 6)}`,
        {
          style: {
            margin: 0,
            fontSize: TITLE[size] || TITLE.md,
            fontWeight: 'var(--weight-semibold)',
            letterSpacing: 'var(--tracking-heading)',
            color: 'var(--empty-state-title-text)',
            textWrap: 'balance',
          },
        },
        title,
      )}
      {children && (
        <p style={{ margin: 0, maxWidth: 'var(--empty-state-measure)', fontSize: BODY[size] || BODY.md, lineHeight: 'var(--leading-normal)', color: 'var(--empty-state-body-text)', textWrap: 'pretty' }}>{children}</p>
      )}
      {actions && (
        /* Wraps, so two actions become two rows in a narrow panel rather
           than shrinking to ellipses. */
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: centred ? 'center' : 'flex-start', gap: 'var(--empty-state-gap-actions)', marginTop: 'var(--space-1)' }}>{actions}</div>
      )}
      {hint && (
        /* Below the actions on purpose: a keyboard shortcut or a doc link is
           the last thing to read, and above the buttons it pushes the one
           thing the user came for further down. */
        <p style={{ margin: 0, maxWidth: 'var(--empty-state-measure)', fontSize: 'var(--text-2xs)', color: 'var(--empty-state-hint-text)', textWrap: 'pretty' }}>{hint}</p>
      )}
    </div>
  );

  /* The container must be an ANCESTOR — a container-type element cannot match
     its own @container rule, so the panel that shrinks cannot also be the
     element being measured. One wrapper, and only when asked for. */
  return responsive ? <div data-ds-container style={{ minWidth: 0 }}>{panel}</div> : panel;
}
