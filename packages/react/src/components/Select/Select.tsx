import React, { useId, useMemo, useEffect, useRef } from 'react';
import * as select from '@zag-js/select';
import { useMachine, normalizeProps, Portal } from '@zag-js/react';
import './Select.css';

export interface SelectItem {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectBaseProps {
  items: SelectItem[];
  placeholder?: string;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (details: { value: string[]; items: SelectItem[] }) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  name?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  helperText?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export type SelectProps = SelectBaseProps & (
  | { label: string; 'aria-label'?: string }
  | { label?: string; 'aria-label': string }
  | { label?: string; 'aria-labelledby': string; 'aria-label'?: string }
);

export const Select: React.FC<SelectProps> = ({
  items,
  label,
  placeholder = 'Select an option...',
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  size = 'md',
  id: customId,
  name,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  isInvalid = false,
  errorMessage,
  helperText,
}) => {
  const generatedId = useId();
  const id = customId || generatedId;
  const helperId = helperText ? `${id}-helper` : undefined;
  const errorId = errorMessage ? `${id}-error` : undefined;
  const invalid = isInvalid || Boolean(errorMessage);
  const describedByIds = [helperId, errorId, ariaDescribedBy].filter(Boolean).join(' ') || undefined;

  const collection = useMemo(
    () =>
      select.collection({
        items,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.value,
        isItemDisabled: (item) => Boolean(item.disabled),
      }),
    [items]
  );

  const [state, send] = useMachine(
    select.machine({
      id,
      name,
      collection,
      value: value ?? defaultValue,
      disabled,
      onValueChange(details) {
        onValueChange?.(details as unknown as { value: string[]; items: SelectItem[] });
      },
    }),
    { context: { collection, ...(value !== undefined ? { value } : {}), disabled } }
  );

  const api = select.connect(state, send, normalizeProps);
  const apiRef = useRef(api);

  useEffect(() => {
    apiRef.current = api;
  }, [api]);

  useEffect(() => {
    if (apiRef.current.setCollection) {
      apiRef.current.setCollection(collection);
    }
  }, [collection]);

  useEffect(() => {
    if (value !== undefined && apiRef.current.setValue) {
      apiRef.current.setValue(value);
    }
  }, [value]);

  const currentValues = value !== undefined ? value : (api.value || []);
  const selectedItemLabels = items
    .filter((item) => currentValues.includes(item.value))
    .map((item) => item.label);

  const displayLabel =
    selectedItemLabels.length > 0
      ? selectedItemLabels.join(', ')
      : api.valueAsString || placeholder;
  const triggerProps = api.getTriggerProps();

  return (
    <div {...api.getRootProps()} className="ds-select-root">
      {label && (
        <label {...api.getLabelProps()} className="ds-select-label">
          {label}
        </label>
      )}

      {/* Hidden native select for form submission */}
      <select {...api.getHiddenSelectProps()}>
        {items.map((item) => (
          <option key={item.value} value={item.value} disabled={item.disabled}>
            {item.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        role="combobox"
        {...triggerProps}
        aria-expanded={triggerProps['aria-expanded']}
        aria-controls={triggerProps['aria-controls']}
        aria-label={label ? undefined : ariaLabel}
        aria-labelledby={[label ? triggerProps['aria-labelledby'] : undefined, ariaLabelledBy].filter(Boolean).join(' ') || undefined}
        aria-invalid={invalid ? 'true' : undefined}
        aria-describedby={describedByIds}
        className={`ds-select-trigger ds-select-trigger--${size} ${invalid ? 'ds-select-trigger--invalid' : ''}`}
      >
        <span className="ds-select-value">
          {displayLabel}
        </span>
        <span className="ds-select-indicator" aria-hidden="true">
          ▼
        </span>
      </button>

      {helperText && (
        <p id={helperId} className="ds-select-helper-text">
          {helperText}
        </p>
      )}

      {errorMessage && (
        <p id={errorId} role="alert" className="ds-select-error-message">
          {errorMessage}
        </p>
      )}

      {api.open && (
        <Portal>
          <div {...api.getPositionerProps()} className="ds-select-positioner">
            <ul {...api.getContentProps()} className="ds-select-content">
              {items.map((item) => (
                <li
                  key={item.value}
                  {...api.getItemProps({ item })}
                  className="ds-select-item"
                >
                  <span {...api.getItemTextProps({ item })}>
                    {item.label}
                  </span>
                  <span {...api.getItemIndicatorProps({ item })} className="ds-select-item-indicator">
                    ✓
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Portal>
      )}
    </div>
  );
};
