import React from 'react';
import { col, fontSize } from './scale.js';

const LEVEL_SIZE = { 1: '3xl', 2: '2xl', 3: 'xl', 4: 'lg', 5: 'md', 6: 'sm' };
const MEASURE = { prose: 'var(--measure-prose)', narrow: 'var(--measure-narrow)', hint: 'var(--measure-hint)' };

export function Heading({
  level = 2,
  as,
  size,
  weight = 'semibold',
  tone = 'primary',
  display = false,
  align,
  measure,
  truncate = false,
  children,
  style,
  ...rest
}) {
  const Tag = as || 'h' + level;
  const resolved = size || (display ? 'display-md' : LEVEL_SIZE[level] || 'xl');
  const isDisplay = /^display-/.test(resolved);

  return (
    <Tag
      {...rest}
      style={{
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontSize: fontSize(resolved),
        fontWeight: weight === 'semibold' ? 'var(--weight-semibold)' : 'var(--weight-' + weight + ')',
        lineHeight: isDisplay ? 'var(--leading-display)' : 'var(--leading-tight)',
        letterSpacing: isDisplay ? 'var(--tracking-display)' : 'var(--tracking-heading)',
        color: col('text-' + tone),
        textAlign: align,
        maxWidth: MEASURE[measure] || measure,
        textWrap: 'balance',
        ...(truncate ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } : null),
        ...style,
      }}
    >
      {children}
    </Tag>
  );
}
