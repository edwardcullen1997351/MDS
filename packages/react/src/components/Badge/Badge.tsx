import React, { forwardRef } from 'react';
import './Badge.css';

export type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeStyle = 'subtle' | 'solid' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  styleVariant?: BadgeStyle;
  size?: BadgeSize;
  hasDot?: boolean;
  isDismissible?: boolean;
  onDismiss?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = 'neutral',
      styleVariant = 'subtle',
      size = 'md',
      hasDot = false,
      isDismissible = false,
      onDismiss,
      leftIcon,
      rightIcon,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'ds-badge',
      `ds-badge--${variant}`,
      `ds-badge--${styleVariant}`,
      `ds-badge--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <span ref={ref} className={classNames} {...props}>
        {hasDot && <span className="ds-badge__dot" aria-hidden="true" />}
        {leftIcon && <span className="ds-badge__icon-left" aria-hidden="true">{leftIcon}</span>}
        <span className="ds-badge__content">{children}</span>
        {rightIcon && <span className="ds-badge__icon-right" aria-hidden="true">{rightIcon}</span>}
        {isDismissible && (
          <button
            type="button"
            className="ds-badge__dismiss"
            aria-label="Remove tag"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss?.(e);
            }}
          >
            ✕
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export const Tag = Badge;
export const Pill = Badge;
