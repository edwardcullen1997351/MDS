import React from 'react';
import { sp } from './scale.js';

export function Spacer({ size, axis = 'vertical', grow = false, style, ...rest }) {
  if (grow) return <div aria-hidden="true" {...rest} style={{ flex: '1 1 auto', ...style }} />;
  const v = sp(size == null ? 4 : size);
  return (
    <div
      aria-hidden="true"
      {...rest}
      style={{
        flex: '0 0 auto',
        width: axis === 'horizontal' ? v : undefined,
        height: axis === 'vertical' ? v : undefined,
        ...style,
      }}
    />
  );
}
