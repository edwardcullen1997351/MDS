import React, { forwardRef } from 'react';
import { SpacingScale } from './Box.js';
import './Layout.css';

export type SurfaceTone = 'default' | 'card' | 'sunken' | 'overlay' | 'inverse';
export type SurfaceElevation = 0 | 1 | 2 | 3 | 4 | 5;
export type SurfaceRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type SurfaceBorder = 'none' | 'subtle' | 'strong';

export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  tone?: SurfaceTone;
  elevation?: SurfaceElevation;
  radius?: SurfaceRadius;
  border?: SurfaceBorder;
  p?: SpacingScale;
}

export const Surface = forwardRef<HTMLElement, SurfaceProps>(
  (
    {
      as = 'div',
      tone = 'card',
      elevation = 0,
      radius = 'md',
      border = 'subtle',
      p,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const Component = as;

    const classNames = [
      'ds-surface',
      `ds-surface--tone-${tone}`,
      `ds-surface--elevation-${elevation}`,
      `ds-surface--radius-${radius}`,
      `ds-surface--border-${border}`,
      p !== undefined ? `ds-p-${p}` : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={ref} className={classNames} {...props}>
        {children}
      </Component>
    );
  }
);

Surface.displayName = 'Surface';
