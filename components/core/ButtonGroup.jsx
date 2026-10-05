import React from 'react';
import { Button } from './Button.jsx';
import { IconButton } from './IconButton.jsx';

/* A cluster of joined action buttons: [Refresh][Export][⌄]. Each button fires
   its own action — nothing stays selected. For a view switcher (one option
   stays highlighted) use Tabs; for spaced buttons in a dialog footer use
   Stack direction="row" gap="8". See the ButtonGroup spec, §01. */

/* Button and IconButton do not share a variant vocabulary, so a group-level
   variant is translated for icon children. */
const ICON_VARIANT = { primary: 'solid', secondary: 'outline', ghost: 'ghost', danger: 'solid' };

const FILLED = ['primary', 'danger', 'solid'];

export function ButtonGroup({ label, variant = 'secondary', size = 'md', children, style, ...rest }) {
  const items = React.Children.toArray(children).filter(Boolean);
  // Only the hovered or focused child is raised, so its border and its 3px
  // focus ring draw over the neighbour instead of being clipped by it.
  const [raised, setRaised] = React.useState(-1);

  if (!label) {
    console.warn('[Meridian] ButtonGroup: `label` is required — role="group" with no accessible name is announced as an unlabelled group.');
  }

  /* Resolve each child before warning about any of it, so the checks below
     see what will actually render. */
  const resolved = items.map((child) => {
    const isIcon = child.type === IconButton;
    const isButton = child.type === Button;
    let v = child.props?.variant || (isIcon ? ICON_VARIANT[variant] : variant);

    if (!isIcon && !isButton) {
      console.warn(
        '[Meridian] ButtonGroup: children must be Button or IconButton. ' +
        'Anything else is handed `variant` and `size` props it does not understand, ' +
        'and the corner and seam styles will not land — the cluster will not read as one control.'
      );
    }

    /* `link` has no height, no padding and no border, so it cannot form a
       seam: one link child collapses the cluster's geometry. Coerced rather
       than dropped, so the action still renders. */
    if (v === 'link') {
      console.warn(
        '[Meridian] ButtonGroup: variant "link" cannot be used inside a group — ' +
        'it has no border or height to join, so it breaks the seam. ' +
        'Rendering as "secondary"; put a link action outside the group instead.'
      );
      v = isIcon ? 'outline' : 'secondary';
    }

    return { child, isIcon, variant: v };
  });

  const fills = resolved.filter((r) => !r.isIcon && FILLED.indexOf(r.variant) > -1).length;
  if (fills > 1) {
    console.warn('[Meridian] ButtonGroup: more than one filled button in a group. Two solid fills side by side read as two competing primaries — keep one filled button at most.');
  }

  const r = 'var(--button-group-radius)';

  return (
    <div
      role="group"
      aria-label={label}
      {...rest}
      style={{ display: 'inline-flex', isolation: 'isolate', ...style }}
    >
      {resolved.map(({ child, variant: childVariant }, i) => {
        const first = i === 0;
        const last = i === resolved.length - 1;

        /* Structural styles are injected LAST so a caller's style prop cannot
           break the seam. The corners and the -1px overlap are what make the
           cluster read as one control. */
        const structural = {
          borderRadius: `${first ? r : '0'} ${last ? r : '0'} ${last ? r : '0'} ${first ? r : '0'}`,
          marginLeft: first ? undefined : 'calc(var(--border-width) * -1)',
          /* One seam colour for the whole cluster. Button `secondary` borders
             at --border-default while IconButton `outline` borders at
             --border-control (4.74:1, correct for a STANDALONE icon button
             whose border is its only boundary) — left alone, a split button
             draws its icon cap 3.7x darker than its lettered half. Inside a
             group an icon child is not standalone: it is identified by its
             siblings and the group name, so the contrast argument does not
             apply. Overriding the colour outright also holds the outline
             steady while one child is hovered, which is what a single
             continuous control should do. */
          ...(childVariant === 'secondary' || childVariant === 'outline'
            ? { borderColor: 'var(--button-group-border)' }
            : null),
          ...(childVariant === 'ghost' && !first
            ? { borderLeftColor: 'var(--button-group-divider)' }
            : null),
        };

        return (
          <span
            key={child.key || i}
            onMouseEnter={() => setRaised(i)}
            onMouseLeave={() => setRaised(-1)}
            onFocusCapture={() => setRaised(i)}
            onBlurCapture={() => setRaised(-1)}
            style={{ display: 'inline-flex', position: 'relative', zIndex: raised === i ? 1 : 0 }}
          >
            {React.cloneElement(child, {
              variant: childVariant,
              size: child.props.size || size,
              style: { ...child.props.style, ...structural },
            })}
          </span>
        );
      })}
    </div>
  );
}
