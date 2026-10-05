import React from 'react';
import { col, fontSize } from './scale.js';

const WEIGHTS = { light: 300, regular: 400, medium: 500, semibold: 600, bold: 700 };
const LEADING = { none: 1, tight: 1.2, snug: 1.35, normal: 1.5, relaxed: 1.65 };
const MEASURE = { prose: 'var(--measure-prose)', narrow: 'var(--measure-narrow)', hint: 'var(--measure-hint)' };

export function Text({
  as: Tag = 'span',
  size = 'base',
  weight = 'regular',
  tone = 'primary',
  family = 'sans',
  leading = 'normal',
  align,
  caps = false,
  numeric = false,
  measure,
  truncate = false,
  block = false,
  children,
  style,
  ...rest
}) {
  const lines = typeof truncate === 'number' ? truncate : truncate ? 1 : 0;
  const clamp = lines > 1
    ? { display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
    : lines === 1
      ? { display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
      : null;

  return (
    <Tag
      {...rest}
      style={{
        margin: 0,
        display: block && !clamp ? 'block' : undefined,
        fontFamily: family === 'mono' ? 'var(--font-mono)' : 'var(--font-sans)',
        fontSize: caps ? 'var(--text-2xs)' : fontSize(size),
        fontWeight: WEIGHTS[weight] || weight,
        lineHeight: LEADING[leading] || leading,
        letterSpacing: caps ? 'var(--tracking-caps)' : family === 'mono' ? 'var(--tracking-mono)' : 'var(--tracking-body)',
        textTransform: caps ? 'uppercase' : undefined,
        color: col('text-' + tone),
        textAlign: align,
        maxWidth: MEASURE[measure] || measure,
        fontVariantNumeric: numeric ? 'tabular-nums' : undefined,
        textWrap: measure ? 'pretty' : undefined,
        ...clamp,
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
