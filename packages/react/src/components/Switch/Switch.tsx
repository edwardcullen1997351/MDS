import React, { forwardRef, useId, useState } from 'react';
import './Switch.css';

export type SwitchSize = 'sm' | 'md' | 'lg';

interface SwitchBaseProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'aria-label' | 'aria-labelledby'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  size?: SwitchSize;
  labelPlacement?: 'start' | 'end';
}

export type SwitchProps = SwitchBaseProps & (
  | { label: string | number; 'aria-label'?: string; 'aria-labelledby'?: string }
  | { label?: React.ReactNode; 'aria-label': string; 'aria-labelledby'?: string }
  | { label?: React.ReactNode; 'aria-label'?: string; 'aria-labelledby': string }
);

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onChange,
      label,
      description,
      error,
      size = 'md',
      labelPlacement = 'end',
      disabled = false,
      id,
      className = '',
      name,
      value,
      'aria-describedby': externalDescribedBy,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = id || generatedId;
    const descriptionId = description ? `${switchId}-desc` : undefined;
    const errorId = error ? `${switchId}-err` : undefined;

    const isControlled = controlledChecked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
    const isChecked = isControlled ? controlledChecked : uncontrolledChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (!isControlled) {
        setUncontrolledChecked(e.target.checked);
      }
      onChange?.(e.target.checked);
    };

    const labelGroup = (label || description) && (
      <div className="ds-switch-label-group">
        {label && (
          <span className="ds-switch-label" id={`${switchId}-label`}>
            {label}
          </span>
        )}
        {description && (
          <span className="ds-switch-description" id={descriptionId}>
            {description}
          </span>
        )}
      </div>
    );

    return (
      <div className={`ds-switch-wrapper ${className}`}>
        <label
          htmlFor={switchId}
          className={`ds-switch-container ${disabled ? 'ds-switch-container--disabled' : ''}`}
        >
          {labelPlacement === 'start' && labelGroup}

          <input
            ref={ref}
            type="checkbox"
            role="switch"
            id={switchId}
            name={name}
            value={value}
            checked={isChecked}
            disabled={disabled}
            aria-checked={isChecked}
            aria-invalid={!!error}
            aria-describedby={[descriptionId, errorId, externalDescribedBy].filter(Boolean).join(' ') || undefined}
            aria-labelledby={label ? `${switchId}-label` : undefined}
            onChange={handleChange}
            className="ds-switch-input"
            {...props}
          />

          <span
            className={`ds-switch-track ds-switch-track--${size} ${
              isChecked ? 'ds-switch-track--checked' : ''
            }`}
            aria-hidden="true"
          >
            <span className={`ds-switch-thumb ds-switch-thumb--${size}`} />
          </span>

          {labelPlacement === 'end' && labelGroup}
        </label>

        {error && (
          <span className="ds-switch-error" id={errorId} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
