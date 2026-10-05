import React from 'react';

/* Meridian uses Lucide (2px stroke, 24px grid) as its icon set. No icon
   binaries shipped with the brand, so glyphs are masked from SVG files and
   tinted with background-color: currentColor — every icon inherits text
   colour, and the dark scope, for free.

   Glyphs resolve against a configurable base path. The default is the pinned
   lucide-static CDN; call Icon.setBasePath() once at startup to serve them
   from your own origin instead (see Icon.d.ts). */

const CDN = 'https://unpkg.com/lucide-static@0.469.0/icons/';

let basePath = CDN;
/* One warning per session when no glyph resolves — see the effect in Icon(). */
let warnedMissing = false;

/* Every other component in Meridian takes token NAMES rather than raw values,
   so Icon does too. Numbers still work — width/height accept either. */
const STEPS = {
  mark: 'var(--icon-mark)',
  xs: 'var(--icon-xs)',
  sm: 'var(--icon-sm)',
  md: 'var(--icon-md)',
  lg: 'var(--icon-lg)',
};

function step(v) {
  if (typeof v === 'number') return v;
  if (STEPS[v]) return STEPS[v];
  // A plausible CSS length passes through, so size="18px" still works.
  if (/^\d/.test(String(v))) return v;
  // Anything else is a typo. Falling through would put a junk value into
  // width/height, which the browser drops — collapsing the box to 0 and
  // deleting the glyph with no feedback at all. Same failure class as a bad
  // glyph name: fail loudly, render something.
  console.warn(
    `[Meridian] Icon: unknown size "${v}" — falling back to 16px. ` +
    `Valid steps: mark (11) · xs (14) · sm (16) · md (20) · lg (22), ` +
    `a number, or a CSS length.`
  );
  return 16;
}

/* A missing glyph must render NOTHING. A failed mask-image leaves the span
   painting its full currentColor rectangle — a confident solid square exactly
   where the icon should be, which reads as deliberate and survives review. So
   the file is probed once per URL and the fill is withheld until it loads. */
const resolved = new Map();

function probe(url) {
  const pending = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve('ok');
    img.onerror = () => resolve('missing');
    img.src = url;
  }).then((state) => {
    resolved.set(url, state);
    if (state === 'missing') {
      console.warn(
        `[Meridian] Icon: no glyph at ${url} — rendering nothing. ` +
        `Check the name against Lucide 0.469.0 (several were renamed: ` +
        `alert-triangle → triangle-alert, more-horizontal → ellipsis).`
      );
    }
    return state;
  });
  resolved.set(url, pending);
  return pending;
}

export function Icon({ name, size = 16, style, title, ...rest }) {
  const url = basePath + name + '.svg';

  const [state, setState] = React.useState(() => {
    const known = resolved.get(url);
    if (typeof known === 'string') return known;
    // No DOM to probe with (SSR): assume the glyph is good and paint it.
    return typeof window === 'undefined' || typeof Image === 'undefined' ? 'ok' : 'pending';
  });

  React.useEffect(() => {
    const known = resolved.get(url);
    if (typeof known === 'string') { setState(known); return undefined; }
    let live = true;
    (known || probe(url)).then((s) => {
      if (live) setState(s);
      /* ONE warning per session, the first time any glyph fails to resolve.
         Until 1.22.2 the failure was completely silent: an offline or
         img-src-restricted consumer got an empty box per icon, no error, no
         layout change, nothing to search for. That silence is half of why
         vendoring the glyphs has sat open in the backlog — the other half
         being that it needs the lucide-static files, which is not a decision
         anyone can make in this repository. Making the failure loud is the
         half that could be closed here. */
      if (s === 'missing' && !warnedMissing) {
        warnedMissing = true;
        console.warn(`[Meridian] Icon: no glyph resolved from ${basePath} (first failure: "${name}"). Glyphs load from the pinned Lucide CDN by default, which fails offline and under a strict img-src CSP. Vendor them and call Icon.setBasePath('/assets/icons') at startup — see assets/icons/README.md. Every icon renders as an empty box until then.`);
      }
    });
    return () => { live = false; };
  }, [url, name]);

  const painted = state === 'ok';
  const mask = painted ? `url("${url}")` : undefined;

  return (
    <span
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      data-icon={name}
      data-icon-missing={state === 'missing' ? '' : undefined}
      {...rest}
      style={{
        display: 'inline-block',
        flex: '0 0 auto',
        width: step(size),
        height: step(size),
        backgroundColor: painted ? 'currentColor' : 'transparent',
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        ...style,
      }}
    />
  );
}

/* Config hangs off the component itself. Only capital-initial exports reach
   window.<Namespace>, so a bare `setIconBasePath` would be invisible to every
   consumer that loads the compiled bundle. */
Icon.setBasePath = function setBasePath(path) {
  basePath = /\/$/.test(path) ? path : path + '/';
  /* A consumer that repoints the base deserves a fresh verdict: if the new
     path also fails, that is a second, different fact worth one warning. */
  warnedMissing = false;
};

Icon.getBasePath = function getBasePath() {
  return basePath;
};
