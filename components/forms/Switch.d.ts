import * as React from 'react';

/**
 * Immediate on/off setting — no save button implied.
 *
 * The label element wraps only the track and the label text, so `description`
 * is linked with `aria-describedby` rather than swallowed into the accessible
 * name. Renders `<input type="checkbox" role="switch">`, so it announces as
 * "on"/"off" rather than "checked".
 */
export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'style'> {
  /** The accessible name — the thing being switched, phrased as its on state. */
  label?: React.ReactNode;
  /** Secondary line under the label, for the consequence of turning it on. Announced as the description. */
  description?: React.ReactNode;
  /** Without \`onChange\` this seeds the initial state and the control stays uncontrolled. */
  checked?: boolean;
  /** sm 28×16 / md 34×20. No lg — see the spec. */
  size?: 'sm' | 'md';
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;
