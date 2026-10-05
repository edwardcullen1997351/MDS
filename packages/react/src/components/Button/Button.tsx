import React, { forwardRef } from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

export interface ButtonBaseProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label' | 'aria-labelledby'> {
  /**
   * Visual style variant conveying semantic hierarchy.
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Sizing tier governing height, padding, gap, and typography.
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Shows an accessible loading spinner and disables clicks.
   * @default false
   */
  isLoading?: boolean;

  /**
   * Screen reader announcement text when `isLoading` is true.
   * @default 'Loading, please wait...'
   */
  loadingText?: string;

  /**
   * Icon or graphic placed before the text label.
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon or graphic placed after the text label.
   */
  rightIcon?: React.ReactNode;

  /**
   * Expands the button to 100% of its parent container width.
   * @default false
   */
  isFullWidth?: boolean;
}

/** Text buttons carry their own name; icon-only buttons need an explicit accessible name. */
export type ButtonProps = ButtonBaseProps & (
  | { children: string | number | readonly (string | number)[]; 'aria-label'?: string; 'aria-labelledby'?: string }
  | { children?: React.ReactNode; 'aria-label': string; 'aria-labelledby'?: string }
  | { children?: React.ReactNode; 'aria-label'?: string; 'aria-labelledby': string }
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText = 'Loading, please wait...',
      disabled = false,
      leftIcon,
      rightIcon,
      isFullWidth = false,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'ds-button',
      `ds-button--${variant}`,
      `ds-button--${size}`,
      isFullWidth ? 'ds-button--full-width' : '',
      isLoading ? 'ds-button--loading' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        disabled={isDisabled}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <>
            <span className="ds-button__spinner" aria-hidden="true" />
            <span className="ds-button__sr-only">{loadingText}</span>
          </>
        )}
        {!isLoading && leftIcon && (
          <span className="ds-button__icon-left" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className="ds-button__content">{children}</span>
        {!isLoading && rightIcon && (
          <span className="ds-button__icon-right" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
