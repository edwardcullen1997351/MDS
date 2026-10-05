import React, { forwardRef } from 'react';
import './Layout.css';

export type SpacingScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

export interface BoxProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  p?: SpacingScale;
  isCard?: boolean;
}

export const Box = forwardRef<HTMLElement, BoxProps>(
  ({ children, as = 'div', p, isCard = false, className = '', ...props }, ref) => {
    const Component = as;

    const classNames = [
      'ds-box',
      p !== undefined ? `ds-p-${p}` : '',
      isCard ? 'ds-surface-card' : '',
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

Box.displayName = 'Box';
