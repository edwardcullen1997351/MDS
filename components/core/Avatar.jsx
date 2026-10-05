import React from 'react';
import { Icon } from './Icon.jsx';
import { useImageFallback } from '../primitives/media.js';

/* Avatar — a person or a machine, identified in the space of a table row.

   The design decision that shapes everything else: THIS AVATAR HAS NO
   COLOUR IDENTITY. Every other system hashes the name to a hue; Meridian
   cannot, because every ramp it owns already carries meaning. Green is
   Success, orange is Warning, red is Critical, and --viz-1…6 means *series*
   identity — its second step is green-600 and its sixth is red-600. Hashing
   would put a Critical-red disc beside one operator in an alarm list and a
   Success-green disc beside the next, signifying nothing. So the disc is a
   sunken surface in every case and the initials do the identifying.

   The one part that may be coloured is the presence dot, because presence
   genuinely is a state, and the state ramps are what state should use.

   Deriving initials is the other half of the work, and it is where every
   implementation is quietly wrong. `name.split(' ').map(w => w[0])` breaks
   on four of the five cases below. */

const SIZES = { xs: 'var(--avatar-size-xs)', sm: 'var(--avatar-size-sm)', md: 'var(--avatar-size-md)', lg: 'var(--avatar-size-lg)', xl: 'var(--avatar-size-xl)' };
/* The NOMINAL pixel value of each rung, kept as plain numbers beside the token
   map because the threshold rules below need arithmetic and a token cannot be
   measured at author time.

   This shipped for one build as `parseInt(SIZES[size])`, which parses the
   string "var(--avatar-size-xs)" — NaN, defaulted to 32 — so `numeric` was 32
   for every rung and all three threshold rules were dead code: `xs` rendered
   two initials at 8px, `status` never warned, and the fallback glyph never
   stepped down. Any future size must be added to BOTH maps; parsing one to get
   the other is the bug.

   Nominal rather than measured on purpose: the thresholds encode a design
   decision about each rung, and a density scope nudging the rendered pixel
   size should not silently flip a component into rendering different
   initials. */
const NOMINAL = { xs: 20, sm: 24, md: 32, lg: 40, xl: 64 };
/* Type is a RATIO of the disc, not a token per size: the initials must stay
   optically centred at 20px and at 64px, and five hand-picked font sizes drift
   the moment a size is added. One glyph can afford more of the disc than two.

   The FLOOR is enforced in CSS rather than trusted to arithmetic. §05 justified
   the one-initial rule by saying two glyphs at 20px means 8px type, "below
   every floor in the system" — and that was still exactly what shipped, because
   8px is 0.4 × 20 whether one glyph or two is drawn. A single ratio cannot
   express a floor, so max() states it: no size, glyph count or future rung can
   render initials below --text-2xs (11px). */
const TYPE_RATIO_ONE = 0.55;
const TYPE_RATIO_MANY = 0.42;
/* Two initials from md up. Not 24: at sm two glyphs land at 10px, under the
   floor, and in a group they are 32% occluded on top of that. The size where
   one initial is enough is also the size whose name lives in an adjacent
   column (§11). */
const ONE_INITIAL_BELOW = 32;
/* A separate threshold with a separate reason — dot legibility, not glyph
   count. 0.3 × 20px is a 6px dot nobody can see or tell apart by hue. */
const STATUS_MIN = 24;
/* Han, Hiragana, Katakana, Hangul. In these scripts one grapheme is already
   a whole name element — a Han surname is a single character — so taking two
   would slice into the given name and produce something nobody is called. */
const SINGLE_GLYPH_SCRIPT = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uac00-\ud7af]/;

/* Grapheme-aware, because a code-point split mangles anything with a
   combining mark or an emoji — "José" can arrive as J + o + s + e + ́ and
   Array.from would still be fine, but a flag or a skin-toned emoji is 2–7
   code points and slicing it renders a broken glyph. */
function graphemes(s) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    try { return Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s), (g) => g.segment); } catch (e) { /* fall through */ }
  }
  return Array.from(s);
}

export function deriveInitials(name, max = 2) {
  if (!name) return '';
  let s = String(name).trim();
  if (!s) return '';
  /* An email is a common stand-in for a name that has not loaded yet.
     Everything after @ is a company, not a person. */
  if (s.includes('@') && !s.includes(' ')) s = s.slice(0, s.indexOf('@')).replace(/[._\-+]+/g, ' ').trim();
  const words = s.split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  const first = graphemes(words[0])[0] || '';
  if (SINGLE_GLYPH_SCRIPT.test(first)) return first;
  if (max < 2) return first.toUpperCase();
  if (words.length === 1) {
    /* One token containing a digit or a separator is an IDENTIFIER, not a
       name — PRS-4120, svc-scheduler, WLD-2207 — and its first two
       characters are what distinguish it from its neighbours in an asset
       family: PR vs PK tells a press from a packer, where P tells nothing.
       So identifiers take two graphemes of the leading alphanumeric run,
       and real single-word names ('Prince') still take one.

       Splitting identifiers on the hyphen instead would be worse: PRS-4120
       would yield "P4", pairing a letter with an arbitrary digit. */
    const isId = /[0-9]/.test(s) || /[-_.]/.test(s);
    if (!isId) return first.toUpperCase();
    const run = (s.match(/[\p{L}\p{N}]+/u) || [s])[0];
    return graphemes(run).slice(0, 2).join('').toUpperCase();
  }
  /* First and LAST word, not the first two: "María del Carmen Rodríguez"
     is MR, and "Jean-Luc Picard" is JP. Middle names and particles are not
     what anyone is known by. */
  const last = graphemes(words[words.length - 1])[0] || '';
  return (first + last).toUpperCase();
}

export function Avatar({
  name,
  initials,
  src,
  kind = 'person',
  size = 'md',
  status,
  statusLabel,
  /* The default ANNOUNCES. An avatar alone in a topbar is the only identity
     present, so silence there would lose it entirely.

     But `decorative` is the right call in most places an avatar actually
     appears — a table cell, a list row — because the name is already beside
     it and announcing both reads "Maya Osei, image, Maya Osei" on every row.
     Pass it there. (This comment asserted the opposite of the code for one
     build, which on an accessibility default is worse than no comment: a
     developer who trusted it would omit the prop in exactly the case that
     needs it.) */
  decorative = false,
  style,
  ...rest
}) {
  const { show: showImage, onError } = useImageFallback(src);
  const px = SIZES[size] || SIZES.md;
  const machine = kind === 'machine';
  const numeric = NOMINAL[size] || NOMINAL.md;
  const resolved = initials != null ? initials : deriveInitials(name, numeric < ONE_INITIAL_BELOW ? 1 : 2);

  if (!name && !initials && !src) {
    console.warn('[Meridian] Avatar: no `name`, `initials` or `src` — this renders an empty disc, which is a layout hole rather than an identity.');
  }
  if (!name && !decorative) {
    console.warn('[Meridian] Avatar: no `name` on a non-decorative avatar. Without it there is nothing to announce; pass `name`, or `decorative` if the name is already beside it in the row.');
  }
  if (rest.onClick) {
    /* Card's 1.15.0 defect, refused up front: a pointer cursor on something
       with no role, no focus and no key handler is a mouse-only control. */
    console.warn('[Meridian] Avatar: `onClick` is not supported. An avatar that opens a profile is a Button or Link WRAPPING an avatar — that way it gets a role, a focus ring, a keyboard and an accessible name. Same rule as Icon.');
  }
  if (status && numeric < STATUS_MIN) {
    console.warn('[Meridian] Avatar: `status` below 24px renders a dot under 7px, which is not legible and not distinguishable by hue. Use size="sm" or larger, or show presence in the row instead.');
  }
  if (status && !statusLabel && !decorative) {
    console.warn(`[Meridian] Avatar: status="${status}" with no \`statusLabel\`. The dot is colour-only (WCAG 1.4.1) unless its meaning reaches the accessible name.`);
  }

  const label = [name, status && (statusLabel || status)].filter(Boolean).join(', ');

  return (
    <span
      {...rest}
      onClick={undefined}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label || undefined}
      aria-hidden={decorative ? 'true' : undefined}
      data-avatar={kind}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: '0 0 auto',
        width: px,
        height: px,
        /* Both, so a flex row cannot squash the disc into an oval — the one
           way an avatar visibly breaks and the reason width alone is not
           enough. */
        minWidth: px,
        background: machine ? 'var(--avatar-background-machine)' : 'var(--avatar-background)',
        border: `var(--border-width) solid var(--avatar-border)`,
        borderRadius: machine ? 'var(--avatar-radius-machine)' : 'var(--avatar-radius)',
        boxSizing: 'border-box',
        /* The initials' ink travels as a custom property rather than being set
           directly on the text span. A plain `color` on the span always wins
           over anything inherited, which is why AvatarGroup's
           --avatar-overflow-foreground was a declared, documented, inert
           token for one build: it was passed as `color` on this disc and the
           span overrode it every time. A caller can now retarget the ink by
           setting --avatar-ink in `style`. */
        '--avatar-ink': machine ? 'var(--avatar-foreground-machine)' : 'var(--avatar-foreground)',
        /* NOT overflow: hidden. The photo is the only child that needs
           clipping to the disc shape, and it clips itself with
           borderRadius: 'inherit' — whereas a clip HERE also cut the presence
           dot into a crescent and erased its ring entirely, which is the one
           thing the ring exists to prevent (§02: "so it reads as sitting on
           top rather than being part of the portrait"). Shipped that way for
           one build. Any future child gets the same freedom. */
        userSelect: 'none',
        ...style,
      }}
    >
      {/* Initials render underneath the image rather than instead of it, so a
          photo that 404s reveals them with no swap and no flash. */}
      <span
        aria-hidden="true"
        style={{
          fontFamily: machine ? 'var(--font-mono)' : 'var(--font-sans)',
          fontSize: `max(calc(${px} * ${(resolved || '').length > 1 ? TYPE_RATIO_MANY : TYPE_RATIO_ONE}), var(--text-2xs))`,
          fontWeight: machine ? 'var(--weight-regular)' : 'var(--weight-medium)',
          letterSpacing: machine ? '-0.03em' : '0.01em',
          lineHeight: 1,
          color: 'var(--avatar-ink)',
        }}
      >
        {resolved || (machine ? <Icon name="cpu" size={numeric < 32 ? 'xs' : 'sm'} /> : <Icon name="user" size={numeric < 32 ? 'xs' : 'sm'} />)}
      </span>
      {showImage && (
        <img
          src={src}
          alt=""
          onError={onError}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 'inherit' }}
        />
      )}
      {status && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: `calc(${px} * var(--avatar-status-size))`,
            height: `calc(${px} * var(--avatar-status-size))`,
            background: `var(--avatar-status-${status})`,
            borderRadius: 'var(--radius-full)',
            /* Ringed in the surface behind it, so the dot reads as sitting
               on top of the disc rather than being part of the portrait. */
            boxShadow: `0 0 0 var(--avatar-group-ring-width) var(--avatar-group-ring)`,
          }}
        />
      )}
    </span>
  );
}

/* Hung off the component, exactly as Icon.setBasePath is: only capital-initial
   exports reach window.<Namespace>, so a bare `deriveInitials` was declared in
   the .d.ts, promised by the spec and unreachable from the compiled bundle —
   which guaranteed the very drift exporting it was meant to prevent. */
Avatar.deriveInitials = deriveInitials;
