import * as React from 'react';

/**
 * Single-line text control.
 *
 * Inside a `Field` the id, `aria-describedby`, `aria-invalid` and
 * `aria-required` are wired automatically through context — an explicit `id`,
 * `aria-describedby` or `invalid` always wins.
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'style'> {
  /** sm 28 / md 34 / lg 40 px at comfortable density. lg is the touch size (16px `--text-lg`, so iOS does not zoom on focus). */
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon name rendered inside the leading edge (e.g. "search"). Decorative — never the field's only label. */
  iconLeft?: string;
  /** Trailing unit or affordance text, rendered in the mono face ("ms", "/mo"). */
  suffix?: React.ReactNode;
  /** Danger border + danger focus ring + `aria-invalid`. Pair with Field's `error`, which supplies the message the control points at. */
  invalid?: boolean;
  /** Renders the value in IBM Plex Mono — use for IDs, keys, queries. */
  mono?: boolean;
  /** Native disabled: not focusable, so any explanation must sit outside the control. */
  disabled?: boolean;
  /** Focusable and copyable, but not editable — sunken fill, full-contrast text. */
  readOnly?: boolean;
  style?: React.CSSProperties;
}
/** Forwards its ref to the underlying `<input>` — what makes focus restoration in a composite (`SearchField`'s clear) real. Additive amendment to the frozen API: no new prop, no visual change. */
export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
