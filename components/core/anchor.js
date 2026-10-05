import React from 'react';

/* The anchoring engine — shared by Combobox, Autocomplete, MultiCombobox,
   DatePicker, Menu, Tooltip and Popover.

   It lives in core/ (tier 2) rather than beside its first consumer in
   feedback/, and that is a layering fact rather than a filing preference:
   all seven consumers sit in tier 3, spread across forms/, navigation/ and
   feedback/, and a module every tier-3 domain reads from cannot itself be
   tier 3 without those imports being sideways only by luck. It moved here in
   1.27.0, having spent its first eleven versions in feedback/ for no better
   reason than that Combobox needed it first and Popover asked second.

   Uncapitalised deliberately, as primitives/scale.js and primitives/media.js
   are: only capital-initial exports reach window.<Namespace>, so the engine
   stays bundle-internal and useAnchor is not part of the public surface.

   Everything below is a lesson one of those seven reviews paid for:

   · fixed, not absolute — a fixed descendant is not clipped by an ancestor's
     overflow: hidden, so an anchored surface works in a table cell or a
     scrolling panel with no portal and no dependency.
   · MEASURED, never predicted — geometry is read from the DOM, never
     computed in an event handler and never captured in a closure. Both
     Autocomplete defects were a height belonging to a different render.
   · height is written IMPERATIVELY, every frame, ungated. It was React
     state behind a change key, and a missed key left a list capped at the
     height of a shorter one for as long as the query stood. A style write
     cannot be a render behind anything.
   · height is measured on the element that RECEIVES it, borders included:
     sizing a bordered, border-box surface from its content's scrollHeight
     made every list that should exactly fit scroll by 2px.
   · the side is decided at open and held — re-deciding it per frame made a
     list jump 161px against 90px of scroll.
   · height is capped to the room that actually exists, so a surface near the
     bottom of a short viewport scrolls rather than running off-screen. */

const MARGIN = 8; /* viewport gutter kept on every edge */
const MIN_ROOM = 96; /* below this the chosen side is unusable and it re-flips */
const FALLBACK = 200; /* used for one frame, before the surface exists to measure */

const flipped = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

/* The height the surface WANTS: its children's boxes plus its own chrome.
   Children are never clamped, so this is immune to the feedback loop that
   reading the clamped surface's own scrollHeight would create, and
   offsetHeight − clientHeight adds the borders that max-height must cover
   under box-sizing: border-box. */
function contentHeight(f) {
  let h = 0;
  for (let i = 0; i < f.children.length; i++) h += f.children[i].offsetHeight;
  return h ? h + (f.offsetHeight - f.clientHeight) : 0;
}

function roomFor(a, side, offset) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (side === 'bottom') return vh - a.bottom - offset - MARGIN;
  if (side === 'top') return a.top - offset - MARGIN;
  if (side === 'right') return vw - a.right - offset - MARGIN;
  return a.left - offset - MARGIN;
}

export function useAnchor(anchorRef, floatRef, {
  open,
  side = 'bottom',
  align = 'start',
  offset = 4,
  matchWidth = false,
  clampHeight = true,
  max = Infinity,
} = {}) {
  const [pos, setPos] = React.useState(null);
  const sideRef = React.useRef(side);
  const openedRef = React.useRef(true);

  React.useEffect(() => {
    if (!open) { openedRef.current = true; return undefined; }
    let raf = 0;
    let last = '';
    const sync = () => {
      const a = anchorRef.current?.getBoundingClientRect();
      if (!a) return;
      const f = floatRef.current;
      const want = f ? contentHeight(f) : 0;

      /* Written on every frame, not gated: this is the value that was stale. */
      if (f && clampHeight) {
        const s = sideRef.current;
        const room = s === 'top' || s === 'bottom' ? roomFor(a, s, offset) : window.innerHeight - 2 * MARGIN;
        const px = `${Math.round(Math.min(Math.min(want || FALLBACK, max), Math.max(MIN_ROOM, room)))}px`;
        if (f.style.maxHeight !== px) f.style.maxHeight = px;
      }

      const fw = f?.offsetWidth || 0;
      const key = `${Math.round(a.left)}|${Math.round(a.top)}|${Math.round(a.bottom)}|${Math.round(a.width)}|${fw}|${want}`;
      if (key === last) return;
      last = key;
      measure(a, fw, want, openedRef.current);
      openedRef.current = false;
    };
    const tick = () => { sync(); raf = requestAnimationFrame(tick); };
    sync();
    raf = requestAnimationFrame(tick);
    window.addEventListener('scroll', sync, true);
    window.addEventListener('resize', sync);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', sync, true);
      window.removeEventListener('resize', sync);
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [open, side, align, offset, matchWidth, clampHeight, max]);

  function measure(a, fw, fh, opening) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const wantW = matchWidth ? a.width : fw || FALLBACK;
    const wantH = Math.min(fh || FALLBACK, max);
    const vertical = side === 'top' || side === 'bottom';
    const want = vertical ? wantH : wantW;

    /* Decided once, on the first measurement of each open surface, then held
       — unless the chosen side genuinely runs out of room, which a clamped
       max-height cannot rescue. */
    const primary = roomFor(a, side, offset);
    const secondary = roomFor(a, flipped[side], offset);
    if (opening) sideRef.current = primary < want && secondary > primary ? flipped[side] : side;
    else {
      const cur = roomFor(a, sideRef.current, offset);
      const alt = roomFor(a, flipped[sideRef.current], offset);
      if (cur < MIN_ROOM && alt > cur) sideRef.current = flipped[sideRef.current];
    }
    const s = sideRef.current;
    const next = { side: s, width: matchWidth ? a.width : undefined };

    if (s === 'bottom' || s === 'top') {
      if (s === 'bottom') next.top = a.bottom + offset;
      else next.bottom = vh - a.top + offset;
      const raw = align === 'center' ? a.left + a.width / 2 - wantW / 2 : align === 'end' ? a.right - wantW : a.left;
      next.left = matchWidth ? a.left : Math.max(MARGIN, Math.min(raw, vw - wantW - MARGIN));
    } else {
      next.left = s === 'right' ? a.right + offset : Math.max(MARGIN, a.left - offset - wantW);
      const raw = align === 'center' ? a.top + a.height / 2 - wantH / 2 : align === 'end' ? a.bottom - wantH : a.top;
      next.top = Math.max(MARGIN, Math.min(raw, vh - wantH - MARGIN));
    }
    setPos(next);
  }

  return pos;
}

/** The style object every anchored surface shares. Height is NOT here — the
    engine writes max-height directly on the surface (see above). */
export function anchorStyle(pos, z = 'var(--z-dropdown)') {
  return {
    position: 'fixed',
    left: pos.left,
    top: pos.top,
    bottom: pos.bottom,
    width: pos.width,
    zIndex: z,
  };
}
