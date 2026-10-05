import React from 'react';
import { col, rad } from './scale.js';
import { AspectRatio } from './AspectRatio.jsx';
import { useImageFallback } from './media.js';

function Placeholder({ label }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'repeating-linear-gradient(135deg, var(--surface-sunken) 0 8px, var(--surface-card) 8px 16px)',
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--code-size)',
        textAlign: 'center',
        padding: 'var(--space-3)',
      }}
    >
      {label || 'image'}
    </div>
  );
}

export function Image({
  src,
  alt = '',
  ratio,
  fit = 'cover',
  position = 'center',
  radius = 'md',
  background = 'surface-sunken',
  loading = 'lazy',
  placeholder,
  width,
  height,
  style,
  ...rest
}) {
  const { show, onError } = useImageFallback(src);
  const img = show ? (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={onError}
      {...rest}
      style={{
        display: 'block',
        width: '100%',
        height: ratio ? '100%' : height ? '100%' : 'auto',
        objectFit: fit,
        objectPosition: position,
        borderRadius: ratio ? undefined : rad(radius),
        background: col(background),
        ...(ratio ? null : style),
      }}
    />
  ) : null;

  if (ratio) {
    return (
      <AspectRatio ratio={ratio} radius={radius} background={background} style={{ width, ...style }}>
        {img}
        {!show && <Placeholder label={placeholder || alt} />}
      </AspectRatio>
    );
  }

  if (!show) {
    return (
      <div style={{ position: 'relative', width: width || '100%', height: height || 160, borderRadius: rad(radius), overflow: 'hidden', ...style }}>
        <Placeholder label={placeholder || alt} />
      </div>
    );
  }

  return img;
}
