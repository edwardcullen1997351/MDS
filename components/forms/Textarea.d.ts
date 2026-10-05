import * as React from 'react';

/**
 * Multi-line text control.
 *
 * Inside a `Field` the id, `aria-describedby`, `aria-invalid` and
 * `aria-required` are wired automatically through context — an explicit `id`,
 * `aria-describedby` or `invalid` always wins.
 */
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'style'> {
  /** Visible lines at rest — the only height control. Default 4. */
  rows?: number;
  /** Padding and type step, matching Input: sm 12px / md 13px / lg 16px type. lg is the touch size. */
  size?: 'sm' | 'md' | 'lg';
  /** Danger border + danger focus ring + `aria-invalid`. Inherited from Field's `error` — set it directly only outside a Field. */
  invalid?: boolean;
  /** Mono face for queries, YAML, log snippets. Also turns off spell-check, autocorrect and autocapitalise. */
  mono?: boolean;
  /** Vertical only, or fixed. `"both"` is refused (it drags the control out of its column) and warns. */
  resize?: 'none' | 'vertical';
  /** Native disabled: not focusable, so any explanation must sit outside the control. */
  disabled?: boolean;
  /** Focusable, scrollable and copyable, but not editable — sunken fill, full-contrast text. */
  readOnly?: boolean;
  style?: React.CSSProperties;
}
export declare function Textarea(props: TextareaProps): JSX.Element;
