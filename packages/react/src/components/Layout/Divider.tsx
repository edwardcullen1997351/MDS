import React, { forwardRef } from 'react';
import { SpacingScale } from './Box.js';
import './Layout.css';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'subtle' | 'strong' | 'dashed';

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  spacing?: SpacingScale;
  label?: React.ReactNode;
  labelPosition?: 'start' | 'center' | 'end';
}

export const Divider = forwardRef<HTMLElement, DividerProps>(
  (
    {
      as,
      orientation = 'horizontal',
      variant = 'subtle',
      spacing,
      label,
      labelPosition = 'center',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const hasContent = Boolean(label || children);
    const hasLabel = hasContent && orientation === 'horizontal';

    // If it has a label/children or is vertical, use 'div' or custom 'as'; otherwise default to 'hr'
    const Component = as || (hasLabel || orientation === 'vertical' ? 'div' : 'hr');

    const classNames = [
      'ds-divider',
      `ds-divider--${orientation}`,
      `ds-divider--${variant}`,
      spacing !== undefined ? `ds-divider--spacing-${spacing}` : '',
      hasLabel ? `ds-divider--with-label ds-divider--label-${labelPosition}` : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    if (Component === 'hr') {
      return (
        <hr
          ref={ref as React.Ref<HTMLHRElement>}
          aria-orientation={orientation}
          className={classNames}
          {...(props as React.HTMLAttributes<HTMLHRElement>)}
        />
      );
    }

    return (
      <Component
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={classNames}
        {...props}
      >
        {hasLabel && <span className="ds-divider__label">{label || children}</span>}
      </Component>
    );
  }
);

Divider.displayName = 'Divider';
