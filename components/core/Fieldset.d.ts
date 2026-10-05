import * as React from 'react';

/**
 * Shared group scaffold — a real `<fieldset>`/`<legend>` plus one hint/error
 * row, used by `ChipGroup`, `RadioGroup` and `CheckboxGroup` so every labelled
 * set in a form renders identically.
 *
 * Not a `Field`: a `Field`'s `<label for>` names one control and cannot name a
 * set. Reach for this only when building a new grouped control; for a single
 * control use `Field`.
 */
export interface FieldsetProps extends Omit<React.FieldsetHTMLAttributes<HTMLFieldSetElement>, 'style'> {
  /** The question the set answers. Required in practice — warns without it, since an unnamed group is the one thing this component exists to prevent. */
  label?: React.ReactNode;
  /** Helper copy under the set. **Stays visible when `error` is set** — it carries the rule the error asks the user to satisfy. */
  hint?: React.ReactNode;
  /** Group-level error. Announced via a permanently-mounted `role="alert"` region and sets `aria-invalid` on the group, never on an individual control. */
  error?: React.ReactNode;
  /**
   * Asterisk on the legend. **Visual only** — `role="group"` supports no
   * required state in ARIA, so state the requirement in `hint` for anyone
   * who cannot see the mark.
   */
  required?: boolean;
  disabled?: boolean;
  /** Vertical rhythm between legend, content and message. */
  gap?: number | string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Fieldset(props: FieldsetProps): JSX.Element;
