import React from 'react';
import { col, rad } from './scale.js';

const NAMED = { square: 1, video: 16 / 9, wide: 21 / 9, portrait: 3 / 4, photo: 4 / 3, golden: 1.618 };

export function AspectRatio({ ratio = 'video', radius = 'md', background, children, style, ...rest }) {
  const r = typeof ratio === 'number' ? ratio
    : NAMED[ratio] != null ? NAMED[ratio]
    : String(ratio).indexOf('/') > -1 ? Number(String(ratio).split('/')[0]) / Number(String(ratio).split('/')[1])
    : 16 / 9;

  return (
    <div
      {...rest}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: String(r),
        overflow: 'hidden',
        borderRadius: rad(radius),
        background: col(background),
        ...style,
      }}
    >
      <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>{children}</div>
    </div>
  );
}
