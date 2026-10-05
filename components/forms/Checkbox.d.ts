import * as React from 'react';

/**
 * Independent boolean choice; also the table row selector.
 *
 * The label element wraps only the box and the label text, so `description`
 * is linked with `aria-describedby` rather than swallowed into the accessible
 * name. `indeterminate` sets the native DOM property, so the control really
 * announces as "mixed".
 */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'style'> {
  /** The accessible name. Omit it only for a bare selector, and then pass `aria-label`. */
  label?: React.ReactNode;
  /** Secondary line under the label, for consequences or scope. Announced as the description, not the name. */
  description?: React.ReactNode;
  /** Without \`onChange\` this seeds the initial state and the control stays uncontrolled. */
  checked?: boolean;
  /** Partial-selection dash for "select all" headers; sets the native indeterminate property (announced as "mixed"). */
  indeterminate?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
