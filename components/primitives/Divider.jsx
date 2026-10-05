import React from 'react';
import { sp, col } from './scale.js';

export function Divider({ orientation = 'horizontal', tone = 'default', spacing = 0, inset = 0, label, style, ...rest }) {
  const line = 'var(--border-width) solid ' + col('border-' + tone);

  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        {...rest}
        style={{ alignSelf: 'stretch', width: 0, minHeight: '1em', borderLeft: line, marginInline: sp(spacing), marginBlock: sp(inset), ...style }}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        {...rest}
        style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBlock: sp(spacing), marginInline: sp(inset), ...style }}
      >
        <span style={{ flex: 1, borderTop: line }} />
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-2xs)', fontWeight: 'var(--weight-semibold)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={{ flex: 1, borderTop: line }} />
      </div>
    );
  }

  return (
    <hr
      {...rest}
      style={{ border: 0, borderTop: line, height: 0, marginBlock: sp(spacing), marginInline: sp(inset), alignSelf: 'stretch', ...style }}
    />
  );
}
