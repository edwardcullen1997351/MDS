import React, { useRef, useCallback } from 'react';
import './SegmentedControl.css';

export interface SegmentedControlOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  /** Array of selectable segments */
  options: SegmentedControlOption<T>[];
  /** Currently selected value */
  value: T;
  /** Callback fired when selection changes */
  onChange: (value: T) => void;
  /** Size variant: 'sm' (compact 32px for dense ERP) or 'md' (standard 36px) */
  size?: 'sm' | 'md';
  /** Accessible label for the segmented control group */
  'aria-label': string;
  /** Optional custom CSS class name */
  className?: string;
  /** Whether the entire control group is disabled */
  disabled?: boolean;
  /** Whether to expand to full width of container */
  fullWidth?: boolean;
}

export const SegmentedControl = <T extends string = string>({
  options,
  value,
  onChange,
  size = 'sm',
  'aria-label': ariaLabel,
  className = '',
  disabled = false,
  fullWidth = false,
}: SegmentedControlProps<T>): React.ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
      const enabledOptions = options.map((opt, i) => ({ ...opt, index: i })).filter((opt) => !opt.disabled && !disabled);
      if (enabledOptions.length === 0) return;

      const currentEnabledIndex = enabledOptions.findIndex((opt) => opt.index === currentIndex);
      let targetIndex = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetIndex = (currentEnabledIndex + 1) % enabledOptions.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetIndex = (currentEnabledIndex - 1 + enabledOptions.length) % enabledOptions.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetIndex = enabledOptions.length - 1;
      }

      if (targetIndex !== -1) {
        const nextOption = enabledOptions[targetIndex];
        onChange(nextOption.value);
        const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
        buttons?.[nextOption.index]?.focus();
      }
    },
    [options, disabled, onChange]
  );

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label={ariaLabel}
      aria-disabled={disabled}
      className={`ds-segmented-control ds-segmented-control--${size} ${fullWidth ? 'ds-segmented-control--full-width' : ''} ${
        disabled ? 'ds-segmented-control--disabled' : ''
      } ${className}`}
    >
      {options.map((option, index) => {
        const isSelected = option.value === value;
        const isOptionDisabled = disabled || option.disabled;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={isOptionDisabled}
            tabIndex={isSelected ? 0 : -1}
            className={`ds-segmented-control__segment ${
              isSelected ? 'ds-segmented-control__segment--selected' : ''
            } ${isOptionDisabled ? 'ds-segmented-control__segment--disabled' : ''}`}
            onClick={() => {
              if (!isOptionDisabled && !isSelected) {
                onChange(option.value);
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {option.icon && (
              <span className="ds-segmented-control__icon" aria-hidden="true">
                {option.icon}
              </span>
            )}
            <span className="ds-segmented-control__label">{option.label}</span>
            {option.badge && (
              <span className="ds-segmented-control__badge" aria-hidden="true">
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
