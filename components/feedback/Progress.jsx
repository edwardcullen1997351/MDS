import React from 'react';

/* Progress — WORK IN FLIGHT. The whole component turns on one distinction the
   shape cannot express:

   · Progress reports a TASK that started and will end. The bar empties into
     nothing when the export finishes; the number means "how far through".
   · A gauge reports a LEVEL that is simply true — OEE 82 %, tank at 60 %,
     disk at 91 %. Nothing is finishing. Those are charts, or role="meter",
     and a plant console is full of them, which is exactly why this component
     refuses tones: a red bar is how a level pretends to be a job.

   Two kinds of honesty are enforced here rather than documented:

   1. `value` is either a real number or absent. There is no "fake" mode and
      no easing towards 90 % while waiting — a bar that advances on a timer
      is a lie with a progress indicator's authority.
   2. Indeterminate says "working", never "how long". Under reduced motion
      both loops stop dead (tokens/motion.css collapses them), so a spinner
      or an indeterminate bar may NEVER be the only signal that work is
      happening — whatever shows it must also say so in words. The component
      warns when it has no accessible name for that reason.

   Shipped 1.20.0. The evidence was two specs deferring to a component that
   did not exist: Skeleton §01 ("long, or of unknown duration → a progress
   bar") and Table's loading treatment. --anim-indeterminate had been defined
   since 1.0.0 with nothing consuming it. */


/* Nothing renders for the first `delay` ms. A spinner that appears for 120ms
   and vanishes is worse than no spinner: the flash reads as a glitch, and on
   a list that reloads per keystroke it strobes. 300ms is the usual threshold —
   below it a human reads the response as instant, so the honest indicator is
   none at all.

   Default 0, because both components are frozen and a default that delayed
   an existing product's spinner would be a behaviour change nobody asked for.

   The timer is NOT reset by re-renders: the effect depends on `delay` alone,
   so a parent re-rendering every frame during a fetch cannot keep pushing the
   indicator further away. */
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

const BAR_H = { sm: 'var(--progress-height-sm)', md: 'var(--progress-height-md)' };
const SPIN = {
  sm: 'var(--progress-spinner-size-sm)',
  md: 'var(--progress-spinner-size-md)',
  lg: 'var(--progress-spinner-size-lg)',
};

export function Progress({
  /* Hold the indicator back for this many ms (≈300 for a spinner over a
     fetch). See useDelayed. */
  delay = 0,
  value,
  variant = 'bar',
  size = 'md',
  label,
  showValue = false,
  style,
  ...rest
}) {
  const uid = React.useId();
  const labelId = `${uid}-label`;
  const named = label || rest['aria-label'] || rest['aria-labelledby'];
  if (!named) {
    console.warn('[Meridian] Progress: no `label` (or aria-label). An unnamed progressbar announces as "progress bar, busy" with no subject — and because reduced motion stops the animation dead, the words are sometimes the ONLY cue that work is in flight. Say what is running: "Exporting work orders".');
  }

  const ready = useDelayed(delay);
  const indeterminate = value == null;
  if (!indeterminate && (value < 0 || value > 100)) {
    console.warn(`[Meridian] Progress: value ${value} is outside 0–100. Pass a percentage; a bar cannot render a fraction it cannot clamp, and a value over 100 reports work that has more than finished.`);
  }
  const pct = indeterminate ? 0 : Math.max(0, Math.min(100, value));

  /* Determinate reports its number; indeterminate omits aria-valuenow, which
     is what tells assistive technology the duration is unknown. Inventing a
     0 there announces "0 percent" forever. */
  /* aria-labelledby at the rendered label, NOT aria-label derived from it.
     Taking the name from `label` only when it happened to be a string is the
     defect Dialog shipped until 1.12.0: a formatted label ("<strong>Exporting</strong>
     work orders") rendered on screen, set no aria-label, and left the bar
     announcing "progress bar, busy" with no subject — while the
     missing-name warning stayed silent, because a label WAS passed. Pointing
     at the element cannot drift from what is displayed. */
  const aria = {
    role: 'progressbar',
    'aria-labelledby': label ? labelId : rest['aria-labelledby'],
    'aria-label': label ? undefined : rest['aria-label'],
    'aria-valuemin': indeterminate ? undefined : 0,
    'aria-valuemax': indeterminate ? undefined : 100,
    'aria-valuenow': indeterminate ? undefined : Math.round(pct),
    'aria-valuetext': indeterminate ? undefined : `${Math.round(pct)} %`,
  };

  /* Held back: render nothing at all, not an empty box. A reserved space that
     stays blank is the layout shift the delay was meant to avoid, moved
     earlier. */
  if (!ready) return null;

  if (variant === 'spinner') {
    const px = SPIN[size] || SPIN.md;
    if (!indeterminate) {
      console.warn('[Meridian] Progress: variant="spinner" ignores `value`. A ring that reports a percentage is a chart; use variant="bar" for anything measurable.');
    }
    return (
      <span
        {...aria}
        {...rest}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: 0, ...style }}
      >
        {/* A bordered circle with one coloured arc, not an SVG: it inherits
            nothing, needs no viewBox and is one element. */}
        <span
          aria-hidden="true"
          data-progress="spinner"
          style={{
            flex: 'none',
            display: 'block',
            width: px,
            height: px,
            borderRadius: 'var(--radius-full)',
            border: `var(--progress-spinner-width) solid var(--progress-spinner-track)`,
            borderTopColor: 'var(--progress-spinner-indicator)',
            animation: 'var(--anim-spin)',
          }}
        />
        {label && <span id={labelId} style={{ fontSize: 'var(--text-xs)', color: 'var(--progress-label-text)', minWidth: 0 }}>{label}</span>}
      </span>
    );
  }

  return (
    <span style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', minWidth: 0, ...style }}>
      {(label || showValue) && (
        <span style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', minWidth: 0 }}>
          {label ? <span id={labelId} style={{ color: 'var(--progress-label-text)', minWidth: 0 }}>{label}</span> : <span />}
          {/* The value sits OUTSIDE the track. Text inside a 4px bar is
              unreadable, and a taller bar built to hold it is a chart.
              Indeterminate has no number to show. */}
          {showValue && !indeterminate && (
            <span style={{ fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', color: 'var(--progress-value-text)', flex: 'none' }}>{Math.round(pct)} %</span>
          )}
        </span>
      )}
      <span
        {...aria}
        {...rest}
        data-progress={indeterminate ? 'indeterminate' : 'bar'}
        style={{
          display: 'block',
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          height: BAR_H[size] || BAR_H.md,
          background: 'var(--progress-track)',
          borderRadius: 'var(--progress-radius)',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'block',
            height: '100%',
            width: indeterminate ? 'var(--progress-indeterminate-width)' : `${pct}%`,
            background: 'var(--progress-indicator)',
            borderRadius: 'inherit',
            /* Width transitions forward only in practice, because the value
               comes from real work. Never a transform: a scaled bar with a
               radius distorts its own end caps. */
            transition: indeterminate ? undefined : 'width var(--duration-base) var(--ease-out)',
            animation: indeterminate ? 'var(--anim-indeterminate)' : undefined,
          }}
        />
      </span>
    </span>
  );
}
