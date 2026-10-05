import React, { createContext, useContext, useId } from 'react';
import './Radio.css';

export type RadioSize = 'sm' | 'md' | 'lg';

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  size?: RadioSize;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export const useRadioGroup = () => useContext(RadioGroupContext);

interface RadioGroupBaseProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  size?: RadioSize;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
  children: React.ReactNode;
  className?: string;
}

export type RadioGroupProps = RadioGroupBaseProps & (
  | { label: string; 'aria-label'?: string; 'aria-labelledby'?: string }
  | { label?: string; 'aria-label': string; 'aria-labelledby'?: string }
  | { label?: string; 'aria-label'?: string; 'aria-labelledby': string }
);

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name: customName,
  value,
  onChange,
  size = 'md',
  disabled = false,
  orientation = 'vertical',
  children,
  className = '',
  label,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  const generatedName = useId();
  const name = customName || `ds-radio-group-${generatedName}`;
  const labelId = label ? `${name}-label` : undefined;

  return (
    <RadioGroupContext.Provider value={{ name, value, onChange, size, disabled }}>
      {label && <div id={labelId} className="ds-radio-group__label">{label}</div>}
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        aria-labelledby={[labelId, ariaLabelledBy].filter(Boolean).join(' ') || undefined}
        className={`ds-radio-group ds-radio-group--${orientation} ${className}`}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};
