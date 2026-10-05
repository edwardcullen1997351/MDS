import React, { forwardRef } from 'react';
import './Icon.css';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: IconSize;
  spin?: boolean;
  'aria-label'?: string;
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  (
    {
      children,
      size = 'md',
      spin = false,
      'aria-label': ariaLabel,
      className = '',
      viewBox = '0 0 24 24',
      ...props
    },
    ref
  ) => {
    const isAriaHidden = !ariaLabel;

    const classNames = [
      'ds-icon',
      `ds-icon--${size}`,
      spin ? 'ds-icon--spin' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <svg
        ref={ref}
        viewBox={viewBox}
        className={classNames}
        aria-hidden={isAriaHidden}
        aria-label={ariaLabel}
        role={ariaLabel ? 'img' : 'presentation'}
        {...props}
      >
        {children}
      </svg>
    );
  }
);

Icon.displayName = 'Icon';
