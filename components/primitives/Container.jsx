import React from 'react';
import { sp } from './scale.js';

const SIZES = { sm: 'var(--container-sm)', md: 'var(--container-md)', lg: 'var(--container-lg)', xl: 'var(--container-xl)', full: '100%' };

export function Container({ as: Tag = 'div', size = 'lg', gutter = true, py, center = true, children, style, ...rest }) {
  return (
    <Tag
      {...rest}
      style={{
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: SIZES[size] || SIZES.lg,
        marginInline: center ? 'auto' : undefined,
        paddingInline: gutter ? 'var(--grid-margin)' : undefined,
        paddingBlock: sp(py),
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
