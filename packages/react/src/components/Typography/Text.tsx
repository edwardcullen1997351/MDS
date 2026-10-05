import React, { forwardRef } from 'react';
import { HeadingWeight, TypographyColor } from './Heading.js';
import './Typography.css';

export type TextElement = 'p' | 'span' | 'div' | 'label' | 'small' | 'code' | 'strong';
export type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
export type TextVariant = 'body' | 'caption' | 'overline' | 'mono';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: TextElement;
  size?: TextSize;
  weight?: HeadingWeight;
  color?: TypographyColor;
  variant?: TextVariant;
  truncate?: boolean;
  clamp?: 2 | 3;
}

export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      children,
      as = 'p',
      size = 'base',
      weight = 'regular',
      color = 'primary',
      variant = 'body',
      truncate = false,
      clamp,
      className = '',
      ...props
    },
    ref
  ) => {
    const Component = as as React.ElementType;

    const classNames = [
      'ds-text',
      `ds-text--${size}`,
      `ds-text--${variant}`,
      `ds-weight-${weight}`,
      `ds-color-${color}`,
      truncate ? 'ds-truncate' : '',
      clamp ? `ds-clamp-${clamp}` : '',
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

Text.displayName = 'Text';

export const Code: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <code className={`ds-code ${className}`} {...props}>
    {children}
  </code>
);
