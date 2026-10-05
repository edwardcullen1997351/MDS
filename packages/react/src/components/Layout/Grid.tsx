import React, { forwardRef } from 'react';
import { SpacingScale } from './Box.js';
import './Layout.css';

export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;

export interface GridProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  columns?: GridColumns;
  gap?: SpacingScale;
  p?: SpacingScale;
}

export const Grid = forwardRef<HTMLElement, GridProps>(
  ({ children, as = 'div', columns = 3, gap = 4, p, className = '', ...props }, ref) => {
    const Component = as;

    const classNames = [
      'ds-grid',
      `ds-grid--cols-${columns}`,
      `ds-gap-${gap}`,
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

Grid.displayName = 'Grid';
