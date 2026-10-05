import React, { forwardRef, useId } from 'react';
import { useRadioGroup, RadioSize } from './RadioGroup.js';
import './Radio.css';

interface RadioBaseProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'aria-label' | 'aria-labelledby'> {
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  size?: RadioSize;
  value: string;
}

export type RadioProps = RadioBaseProps & (
  | { label: string | number; 'aria-label'?: string; 'aria-labelledby'?: string }
  | { label?: React.ReactNode; 'aria-label': string; 'aria-labelledby'?: string }
  | { label?: React.ReactNode; 'aria-label'?: string; 'aria-labelledby': string }
);

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      id: customId,
      name: customName,
      value,
      label,
      helperText,
      checked: controlledChecked,
      disabled: customDisabled,
      size: customSize,
      className = '',
      onChange: customOnChange,
      'aria-labelledby': externalLabelledBy,
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = customId || `ds-radio-${generatedId}`;
    const helperId = helperText ? `${id}-helper` : undefined;
    const labelId = label ? `${id}-label` : undefined;

    const group = useRadioGroup();
    const name = group?.name || customName;
    const isChecked = group ? group.value === value : controlledChecked;
    const isDisabled = group?.disabled || customDisabled;
    const size = customSize || group?.size || 'md';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      group?.onChange?.(e);
      customOnChange?.(e);
    };

    const rootClasses = [
      'ds-radio',
      `ds-radio--${size}`,
      isChecked ? 'ds-radio--checked' : '',
      isDisabled ? 'ds-radio--disabled' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <label htmlFor={id} className={rootClasses}>
        <input
          ref={ref}
          id={id}
          name={name}
          type="radio"
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          aria-describedby={helperId}
          aria-label={ariaLabel}
          aria-labelledby={externalLabelledBy || (ariaLabel ? undefined : labelId)}
          className="ds-radio__input"
          onChange={handleChange}
          {...props}
        />

        <div className="ds-radio__control" aria-hidden="true">
          <div className="ds-radio__dot" />
        </div>

        {(label || helperText) && (
          <div className="ds-radio__label-container">
            {label && <span id={labelId} className="ds-radio__label">{label}</span>}
            {helperText && (
              <span id={helperId} className="ds-radio__helper">
                {helperText}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
