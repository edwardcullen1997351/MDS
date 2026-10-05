import React, { forwardRef } from 'react';
import { SpacingScale } from './Box.js';
import './Layout.css';

export type SpacerAxis = 'horizontal' | 'vertical' | 'both';

export interface SpacerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  size?: SpacingScale;
  axis?: SpacerAxis;
  flex?: number | string;
}

export const Spacer = forwardRef<HTMLElement, SpacerProps>(
  (
    {
      as = 'div',
      size,
      axis = 'both',
      flex,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const Component = as;

    const isFlexExpand = size === undefined && flex === undefined;

    const classNames = [
      'ds-spacer',
      isFlexExpand ? 'ds-spacer--flex' : '',
      size !== undefined ? `ds-spacer--${axis}-${size}` : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const computedStyle: React.CSSProperties = {
      ...style,
      ...(flex !== undefined ? { flex } : {}),
    };

    return (
      <Component
        ref={ref}
        aria-hidden="true"
        className={classNames}
        style={computedStyle}
        {...props}
      />
    );
  }
);

Spacer.displayName = 'Spacer';
