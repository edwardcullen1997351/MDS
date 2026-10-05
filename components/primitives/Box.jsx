import React from 'react';
import { sp, col, rad, shadow, hairline, deprecatedMargin } from './scale.js';

export function Box({
  as: Tag = 'div',
  p, px, py, pt, pr, pb, pl,
  m, mx, my, mt, mr, mb, ml,
  width, height, minWidth, maxWidth, minHeight, maxHeight,
  display, background, radius, border, borderTop, borderBottom, elevation,
  overflow, position, flex, grow, shrink, basis, align, justify, gap,
  children, style, ...rest
}) {
  /* Margin props contradict the system's own layout rule (space siblings with
     the parent's gap) and are kept only because the console kit still uses a
     few. Warn rather than remove: removal breaks a consumer, and silent
     acceptance keeps teaching the pattern. */
  deprecatedMargin({ m, mx, my, mt, mr, mb, ml });
  return (
    <Tag
      {...rest}
      style={{
        display,
        boxSizing: 'border-box',
        padding: sp(p),
        paddingLeft: sp(pl != null ? pl : px),
        paddingRight: sp(pr != null ? pr : px),
        paddingTop: sp(pt != null ? pt : py),
        paddingBottom: sp(pb != null ? pb : py),
        margin: sp(m),
        marginLeft: sp(ml != null ? ml : mx),
        marginRight: sp(mr != null ? mr : mx),
        marginTop: sp(mt != null ? mt : my),
        marginBottom: sp(mb != null ? mb : my),
        width, height, minWidth, maxWidth, minHeight, maxHeight,
        background: col(background),
        borderRadius: rad(radius),
        border: hairline(border),
        borderTop: hairline(borderTop),
        borderBottom: hairline(borderBottom),
        boxShadow: shadow(elevation),
        overflow, position,
        flex: flex != null ? flex : undefined,
        flexGrow: grow != null ? Number(grow) : undefined,
        flexShrink: shrink != null ? Number(shrink) : undefined,
        flexBasis: basis,
        alignItems: align,
        justifyContent: justify,
        gap: sp(gap),
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
