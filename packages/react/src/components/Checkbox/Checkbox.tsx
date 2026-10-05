import React, { forwardRef, useId, useEffect, useRef } from 'react';
import './Checkbox.css';

export type CheckboxSize = 'sm' | 'md' | 'lg';

interface CheckboxBaseProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'aria-label' | 'aria-labelledby'> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  errorMessage?: string;
  indeterminate?: boolean;
  isInvalid?: boolean;
  size?: CheckboxSize;
}

export type CheckboxProps = CheckboxBaseProps & (
  | { label: string | number; 'aria-label'?: string; 'aria-labelledby'?: string }
  | { label?: React.ReactNode; 'aria-label': string; 'aria-labelledby'?: string }
  | { label?: React.ReactNode; 'aria-label'?: string; 'aria-labelledby': string }
);

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id: customId,
      label,
      helperText,
      errorMessage,
      checked = false,
      indeterminate = false,
      isInvalid = false,
      disabled = false,
      size = 'md',
      className = '',
      onChange,
      'aria-labelledby': externalLabelledBy,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || `ds-checkbox-${generatedId}`;
    const helperId = helperText ? `${id}-helper` : undefined;
    const labelId = label ? `${id}-label` : undefined;
    const errorId = errorMessage ? `${id}-error` : undefined;
    const describedBy = [helperId, errorId, props['aria-describedby']].filter(Boolean).join(' ') || undefined;

    const innerRef = useRef<HTMLInputElement>(null);
    const combinedRef = (node: HTMLInputElement) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
    };

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const rootClasses = [
      'ds-checkbox',
      `ds-checkbox--${size}`,
      checked ? 'ds-checkbox--checked' : '',
      indeterminate ? 'ds-checkbox--indeterminate' : '',
      disabled ? 'ds-checkbox--disabled' : '',
      isInvalid || Boolean(errorMessage) ? 'ds-checkbox--invalid' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label htmlFor={id} className={rootClasses}>
        <input
          ref={combinedRef}
          {...props}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-invalid={isInvalid || Boolean(errorMessage)}
          aria-label={ariaLabel}
          aria-labelledby={externalLabelledBy || (ariaLabel ? undefined : labelId)}
          aria-describedby={describedBy}
          className="ds-checkbox__input"
          onChange={onChange}
        />

        <div className="ds-checkbox__control" aria-hidden="true">
          {checked && !indeterminate && (
            <svg className="ds-checkbox__icon" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
          {indeterminate && (
            <svg className="ds-checkbox__icon" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
        </div>

        {(label || helperText || errorMessage) && (
          <div className="ds-checkbox__label-container">
            {label && <span id={labelId} className="ds-checkbox__label">{label}</span>}
            {helperText && (
              <span id={helperId} className="ds-checkbox__helper">
                {helperText}
              </span>
            )}
            {errorMessage && <span id={errorId} role="alert" className="ds-checkbox__helper">{errorMessage}</span>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
