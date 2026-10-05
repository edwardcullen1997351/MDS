import React from 'react';
import { sp } from './scale.js';

export function Stack({
  as: Tag = 'div',
  direction = 'column',
  gap = 4,
  align,
  justify,
  wrap = false,
  inline = false,
  grow,
  fill = false,
  children,
  style,
  ...rest
}) {
  return (
    <Tag
      {...rest}
      style={{
        display: inline ? 'inline-flex' : 'flex',
        flexDirection: direction,
        gap: sp(gap),
        alignItems: align || (direction === 'row' ? 'center' : undefined),
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : undefined,
        flexGrow: grow != null ? Number(grow) : undefined,
        height: fill ? '100%' : undefined,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
