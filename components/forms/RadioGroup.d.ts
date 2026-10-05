import * as React from 'react';

export interface RadioGroupOption {
  value: string;
  label: React.ReactNode;
  /** Secondary line under this option — usually what choosing it does. */
  description?: React.ReactNode;
  disabled?: boolean;
}

/**
 * One-of-N choice as a named set: a real `<fieldset>`/`<legend>`, a single
 * string value, and a generated `name` so a repeated set cannot collide with
 * another instance of itself. Do NOT wrap it in a `Field` — a `Field` label
 * points at one control and cannot name a set.
 */
export interface RadioGroupProps extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'style' | 'onChange' | 'defaultValue'> {
  /** The question the set answers. Required. */
  label: React.ReactNode;
  /** Helper copy under the set. Hidden while `error` is set. */
  hint?: React.ReactNode;
  /** Group-level error; replaces the hint, carries `role="alert"`. Individual options are never reddened. */
  error?: React.ReactNode;
  /** Asterisk on the legend. State the rule in `hint` — ARIA has no required state for a group. */
  required?: boolean;
  /** 2–5 options. Strings are used as both value and label. Ignored when `children` is given. */
  options?: Array<string | RadioGroupOption>;
  /** Selected value. Pass with `onChange` to control the group. */
  value?: string;
  /** Initial selection when uncontrolled. */
  defaultValue?: string;
  /** Receives the NEXT VALUE, not an event. */
  onChange?: (next: string) => void;
  /** Label for a leading empty option (value `""`) — the only way to offer "none", since a radio set cannot be cleared. */
  emptyOption?: React.ReactNode;
  /** Override the generated group name. Only needed when a server-rendered form reads it. */
  name?: string;
  /** Disables the whole set: every option paints its disabled state and the fieldset blocks focus and submission. */
  disabled?: boolean;
  /** Bespoke content instead of `options` — you own the radios and their shared name. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function RadioGroup(props: RadioGroupProps): JSX.Element;
