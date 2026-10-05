import React, { forwardRef } from 'react';
import { Input, InputProps } from '../Input/Input.js';
import { Icon } from '../Icon/Icon.js';
import './SearchField.css';

export type SearchFieldProps = Omit<InputProps, 'leftIcon' | 'rightIcon' | 'label' | 'aria-label' | 'aria-labelledby'> & (
  | { label: string; 'aria-label'?: string; 'aria-labelledby'?: string }
  | { label?: string; 'aria-label': string; 'aria-labelledby'?: string }
  | { label?: string; 'aria-label'?: string; 'aria-labelledby': string }
) & {
  onClear?: () => void;
  isLoading?: boolean;
  shortcutKey?: string;
};

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  (
    {
      value,
      onChange,
      onClear,
      placeholder = 'Search...',
      isLoading = false,
      shortcutKey,
      className = '',
      ...props
    },
    ref
  ) => {
    const hasValue = Boolean(value && String(value).length > 0);

    const handleClear = () => {
      onClear?.();
    };

    return (
      <div className={`ds-searchfield-wrapper ${className}`}>
        <Input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          leftIcon={<Icon name="search" size="sm" />}
          rightIcon={
            isLoading ? (
              <span className="ds-searchfield-spinner" aria-hidden="true">
                ⟳
              </span>
            ) : hasValue && onClear ? (
              <button
                type="button"
                className="ds-searchfield-clear-btn"
                onClick={handleClear}
                aria-label="Clear search query"
              >
                ✕
              </button>
            ) : shortcutKey ? (
              <kbd className="ds-searchfield-kbd">{shortcutKey}</kbd>
            ) : undefined
          }
          {...props}
        />
      </div>
    );
  }
);

SearchField.displayName = 'SearchField';
