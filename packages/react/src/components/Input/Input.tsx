import React, { forwardRef, useId } from 'react';
import './Input.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputBaseProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'aria-label' | 'aria-labelledby'> {
  /**
   * Field label placed above the input.
   */
  label?: string;

  /**
   * Helper text providing additional guidance below the input.
   */
  helperText?: string;

  /**
   * Error message displayed when `isInvalid` is true.
   */
  errorMessage?: string;

  /**
   * Sets the input into an error/invalid state.
   * @default false
   */
  isInvalid?: boolean;

  /**
   * Marks the field as required and appends an indicator.
   * @default false
   */
  isRequired?: boolean;

  /**
   * Shows an optional badge when not required.
   * @default false
   */
  isOptional?: boolean;

  /**
   * Sizing tier for height and typography.
   * @default 'md'
   */
  size?: InputSize;

  /**
   * Icon or graphic placed inside the input on the left.
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon or graphic placed inside the input on the right (e.g. clear, password toggle).
   */
  rightIcon?: React.ReactNode;

  /**
   * Additional wrapper class name.
   */
  wrapperClassName?: string;
}

export type InputProps = InputBaseProps & (
  | { label: string; 'aria-label'?: string; 'aria-labelledby'?: string }
  | { label?: string; 'aria-label': string; 'aria-labelledby'?: string }
  | { label?: string; 'aria-label'?: string; 'aria-labelledby': string }
);

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: customId,
      label,
      helperText,
      errorMessage,
      isInvalid = false,
      isRequired = false,
      isOptional = false,
      size = 'md',
      leftIcon,
      rightIcon,
      disabled = false,
      readOnly = false,
      className = '',
      wrapperClassName = '',
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = customId || `ds-input-${generatedId}`;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const errorId = errorMessage ? `${inputId}-error` : undefined;

    // Build accessible description IDs
    const describedByIds = [helperId, errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

    const containerClasses = [
      'ds-input-container',
      `ds-input-container--${size}`,
      isInvalid || Boolean(errorMessage) ? 'ds-input-container--invalid' : '',
      disabled ? 'ds-input-container--disabled' : '',
      readOnly ? 'ds-input-container--readonly' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`ds-field ${wrapperClassName}`}>
        {label && (
          <label htmlFor={inputId} className="ds-field__label">
            <span>{label}</span>
            {isRequired && (
              <span className="ds-field__required" aria-hidden="true">
                *
              </span>
            )}
            {isOptional && !isRequired && (
              <span className="ds-field__optional">(optional)</span>
            )}
          </label>
        )}

        <div className={containerClasses}>
          {leftIcon && (
            <span className="ds-input__left-addon" aria-hidden="true">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            {...props}
            id={inputId}
            disabled={disabled}
            readOnly={readOnly}
            required={isRequired}
            aria-invalid={isInvalid || Boolean(errorMessage)}
            aria-required={isRequired}
            aria-describedby={describedByIds}
            className={`ds-input ${className}`}
          />

          {rightIcon && (
            <span className="ds-input__right-addon">
              {rightIcon}
            </span>
          )}
        </div>

        {helperText && (
          <div id={helperId} className="ds-field__helper">{helperText}</div>
        )}
        {(isInvalid || Boolean(errorMessage)) && errorMessage && (
          <div id={errorId} className="ds-field__error" role="alert">
            <span aria-hidden="true">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export const TextField = Input;
