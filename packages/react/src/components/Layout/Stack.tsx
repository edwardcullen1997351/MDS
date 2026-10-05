import React, { forwardRef } from 'react';
import { SpacingScale } from './Box.js';
import './Layout.css';

export type StackDirection = 'row' | 'column';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  direction?: StackDirection;
  gap?: SpacingScale;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  isCard?: boolean;
  p?: SpacingScale;
}

export const Stack = forwardRef<HTMLElement, StackProps>(
  (
    {
      children,
      as = 'div',
      direction = 'column',
      gap = 4,
      align,
      justify,
      wrap = false,
      isCard = false,
      p,
      className = '',
      ...props
    },
    ref
  ) => {
    const Component = as;

    const classNames = [
      'ds-stack',
      `ds-stack--${direction}`,
      `ds-gap-${gap}`,
      align ? `ds-align-${align}` : '',
      justify ? `ds-justify-${justify}` : '',
      wrap ? 'ds-stack--wrap' : '',
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

Stack.displayName = 'Stack';

export const HStack = forwardRef<HTMLElement, Omit<StackProps, 'direction'>>(
  ({ align = 'center', ...props }, ref) => (
    <Stack ref={ref} direction="row" align={align} {...props} />
  )
);
HStack.displayName = 'HStack';

export const VStack = forwardRef<HTMLElement, Omit<StackProps, 'direction'>>(
  ({ align = 'stretch', ...props }, ref) => (
    <Stack ref={ref} direction="column" align={align} {...props} />
  )
);
VStack.displayName = 'VStack';
