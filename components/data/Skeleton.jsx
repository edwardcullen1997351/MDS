import React from 'react';

/* Skeleton — a shape standing in for content that has not arrived.
   Shipped 1.14.0, deferred at 1.8.1 pending evidence of its shape. The
   evidence was Table: two specs (Badge §06, Pagination §06/§09) already
   deferred to "a skeleton in the cell" and "the table owns the loading
   treatment" for a component that did not exist.

   What Table decided about the API:
   • It is sized by the CONTENT it replaces, not by a size scale. A skeleton
     in a --row-h cell is one line of text tall; a variant ladder would have
     been guessing.
   • It is `aria-hidden`. The loading REGION carries aria-busy and one
     announcement; forty announced placeholders is the failure mode.
   • The sweep is one low-contrast pass, not a pulse. Forty pulsing blocks
     in a table is forty things blinking, and under reduced motion it must
     stop dead and still read as "not data" — which is why the resting fill
     is --surface-sunken rather than a mid-grey that could pass for content.

   Hardened 1.18.0 on its freeze. Three defects, all from one shortcut: the
   single-line and multi-line paths were built as one function and diverged.
   • {...rest} reached the STACK wrapper only, so on the single-line path —
     the common one, and the one Table uses — a caller's className, data-*
     and title were silently dropped.
   • `style` was spread onto EVERY line, so a margin passed to a 3-line stack
     applied three times, and a width overrode the short last line, turning
     text back into a chart.
   • Forced colours erased it: the fill resolves to Canvas and
     background-image is dropped, so a loading table was a blank grid. The
     shape is now outlined against CanvasText via [data-skeleton] — the same
     defect, fix and hook as Badge's dot in 1.8.1. */


/* Nothing renders for the first `delay` ms — see Progress, which carries the
   same hook and the same reasoning: an indicator that flashes for 120 ms reads
   as a glitch, and on a list that reloads per keystroke it strobes. Default 0,
   because this component is frozen. */
function useDelayed(delay) {
  const [shown, setShown] = React.useState(!delay);
  React.useEffect(() => {
    if (!delay) { setShown(true); return undefined; }
    setShown(false);
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return shown;
}

export function Skeleton({
  /* Hold the placeholder back for this many ms. */
  delay = 0,
  width = '100%',
  height,
  lines = 1,
  radius,
  animate = true,
  style,
  ...rest
}) {
  const ready = useDelayed(delay);
  if (lines < 1) {
    console.warn('[Meridian] Skeleton: lines < 1 renders nothing to stand in for the content. Render the component only while the region is loading, rather than asking it for zero lines.');
  }

  /* `outer` is true for the element a caller's style and rest land on: the
     single line, or the stack wrapper. Per-line spreading was the 1.14.0
     behaviour and it applied a caller's margin three times over. */
  const one = (w, key, outer) => (
    <span
      key={key}
      aria-hidden="true"
      data-skeleton=""
      {...(outer ? rest : null)}
      style={{
        display: 'block',
        width: w,
        /* Defaults to the line-box of the text it stands in for, so a
           skeleton in a table cell lines up with the real value. */
        height: height || '1em',
        minHeight: height ? undefined : 'var(--skeleton-min-height)',
        background: 'var(--skeleton-background)',
        borderRadius: radius || 'var(--skeleton-radius)',
        backgroundImage: animate
          ? 'linear-gradient(90deg, transparent 0%, var(--skeleton-sheen) 50%, transparent 100%)'
          : undefined,
        backgroundSize: '200% 100%',
        backgroundRepeat: 'no-repeat',
        animation: animate ? 'var(--anim-skeleton-sweep)' : undefined,
        ...(outer ? style : null),
      }}
    />
  );

  if (!ready) return null;

  if (lines <= 1) return one(width, 0, true);

  return (
    <span aria-hidden="true" {...rest} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--skeleton-line-gap)', ...style }}>
      {/* The last line is short, because a paragraph's last line is. Equal
          bars read as a chart, not as text. */}
      {Array.from({ length: lines }, (_, i) => one(i === lines - 1 ? '62%' : width, i, false))}
    </span>
  );
}
