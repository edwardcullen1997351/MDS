import * as React from 'react';

/**
 * One-of-N choice. Group 2–4 with a shared `name` — exclusivity and
 * arrow-key navigation both come from the name, not from this component.
 *
 * The label element wraps only the dot and the label text, so `description`
 * is linked with `aria-describedby` rather than swallowed into the accessible
 * name.
 */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'style'> {
  /** The accessible name. */
  label?: React.ReactNode;
  /** Secondary line under the label. Announced as the description, not the name. */
  description?: React.ReactNode;
  /** Shared group name — required. Without it the radio is a group of one that can never be deselected, and there is no arrow-key navigation. */
  name: string;
  value?: string;
  /** Without \`onChange\` this seeds the initial state and the control stays uncontrolled. */
  checked?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Radio(props: RadioProps): JSX.Element;
