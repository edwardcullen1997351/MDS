import React from 'react';
import { sp } from './scale.js';

export function Grid({
  as: Tag = 'div',
  columns = 'responsive',
  minItemWidth = 240,
  gap,
  rowGap,
  columnGap,
  align,
  justify,
  children,
  style,
  ...rest
}) {
  const track =
    columns === 'responsive' ? 'repeat(var(--grid-columns), minmax(0, 1fr))'
    : columns === 'fluid' ? 'repeat(auto-fit, minmax(min(' + (typeof minItemWidth === 'number' ? minItemWidth + 'px' : minItemWidth) + ', 100%), 1fr))'
    : typeof columns === 'number' ? 'repeat(' + columns + ', minmax(0, 1fr))'
    : columns;
  const g = gap == null ? 'var(--grid-gutter)' : sp(gap);

  return (
    <Tag
      {...rest}
      style={{
        display: 'grid',
        gridTemplateColumns: track,
        gap: g,
        rowGap: sp(rowGap),
        columnGap: sp(columnGap),
        alignItems: align,
        justifyItems: justify,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}

export function GridItem({ as: Tag = 'div', span = 1, start, rowSpan, children, style, ...rest }) {
  return (
    <Tag
      {...rest}
      style={{
        gridColumn: start != null ? start + ' / span ' + span : 'span ' + span + ' / span ' + span,
        gridRow: rowSpan ? 'span ' + rowSpan + ' / span ' + rowSpan : undefined,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
