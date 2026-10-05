import React from 'react';
import { sp, col, rad, shadow, hairline } from './scale.js';

const TONES = {
  card: { bg: 'surface-card', fg: 'text-primary', border: 'default' },
  sunken: { bg: 'surface-sunken', fg: 'text-primary', border: 'subtle' },
  raised: { bg: 'surface-raised', fg: 'text-primary', border: 'default' },
  overlay: { bg: 'surface-overlay', fg: 'text-primary', border: 'default' },
  selected: { bg: 'surface-selected', fg: 'text-primary', border: 'focus' },
  inverse: { bg: 'surface-inverse', fg: 'text-inverse', border: 'inverse' },
};

export function Surface({
  as: Tag = 'div',
  tone = 'card',
  elevation = 0,
  padding = 'none',
  radius = 'md',
  border = true,
  interactive = false,
  fill = false,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const t = TONES[tone] || TONES.card;
  const pad = padding === 'none' ? undefined : padding === 'sm' ? 4 : padding === 'lg' ? 8 : 6;
  const bg = interactive && hover && tone !== 'inverse' ? 'surface-hover' : t.bg;

  return (
    <Tag
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => setHover(false) : undefined}
      {...rest}
      style={{
        boxSizing: 'border-box',
        background: col(bg),
        color: col(t.fg),
        border: border ? hairline(t.border) : undefined,
        borderRadius: rad(radius),
        boxShadow: shadow(elevation),
        padding: sp(pad),
        height: fill ? '100%' : undefined,
        minWidth: 0,
        cursor: interactive ? 'pointer' : undefined,
        transition: 'var(--transition-control)',
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
