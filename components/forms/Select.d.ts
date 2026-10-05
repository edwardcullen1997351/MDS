import * as React from 'react';

export interface SelectOption { value: string; label: string }

/**
 * Native single-select with Meridian control chrome.
 *
 * Inside a `Field` the id, `aria-describedby`, `aria-invalid` and
 * `aria-required` are wired automatically through context.
 *
 * Single-select only: `multiple` warns and is not supported — a set of
 * choices is a `CheckboxGroup`.
 */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'style' | 'value' | 'onChange' | 'multiple'> {
  /** Strings are used as both value and label. Empty warns — an empty Select opens onto nothing. */
  options: Array<string | SelectOption>;
  /** Omit `onChange` to run uncontrolled — the value is then used as the initial choice. */
  value?: string;
  /** Uncontrolled initial choice, if you prefer the native name. With neither, the first option is selected. */
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Renders a leading empty option; the control shows tertiary text until chosen. Selectable, so a filter can be cleared. */
  placeholder?: string;
  /** sm/md/lg heights, padding and type. `lg` draws 16px type so iOS does not zoom on focus. */
  size?: 'sm' | 'md' | 'lg';
  /** Danger border + danger focus ring + `aria-invalid`. Inherited from Field's `error` — set it directly only outside a Field. */
  invalid?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
