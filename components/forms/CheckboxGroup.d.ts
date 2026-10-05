import * as React from 'react';

export interface CheckboxGroupOption {
  value: string;
  label: React.ReactNode;
  /** Secondary line under this option. Forces a single column. */
  description?: React.ReactNode;
  disabled?: boolean;
}

/**
 * A named set of independent checkboxes, rendered as a real
 * `<fieldset>`/`<legend>` — the grouping every screen reader announces without
 * ARIA. Owns the set value, the optional select-all parent, and the group-level
 * hint or error. Do NOT wrap it in a `Field`: a `Field` label points at one
 * control and cannot name a set.
 */
export interface CheckboxGroupProps extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'style' | 'onChange' | 'defaultValue'> {
  /** The question the set answers. Required — a nameless group is the defect this component prevents. */
  label: React.ReactNode;
  /** Helper copy under the set. Hidden while `error` is set. */
  hint?: React.ReactNode;
  /** Group-level error; replaces the hint, carries `role="alert"`. Individual boxes are never marked invalid. */
  error?: React.ReactNode;
  /** Asterisk on the legend. State the rule in `hint` — ARIA has no required state for a group. */
  required?: boolean;
  /** Strings are used as both value and label. Ignored when `children` is given. */
  options?: Array<string | CheckboxGroupOption>;
  /** Selected values. Pass with `onChange` to control the group. */
  value?: string[];
  /** Initial selection when running uncontrolled. */
  defaultValue?: string[];
  /** Receives the NEXT ARRAY, not an event — unlike `Checkbox`. */
  onChange?: (next: string[]) => void;
  /** Label for a select-all parent above the set; enables the indeterminate maths. */
  selectAll?: React.ReactNode;
  /** 1 (default) or 2. Forced to 1 when any option has a description. */
  columns?: 1 | 2;
  /** Disables the whole set: every option paints its disabled state and the fieldset blocks focus and submission. */
  disabled?: boolean;
  /** Bespoke content instead of `options` — you own the wiring; the scaffold still supplies the legend, hint and error. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function CheckboxGroup(props: CheckboxGroupProps): JSX.Element;
