import * as React from 'react';

export interface ComboboxOption {
  value: string;
  label: string;
  /** Optional second line — the thing a native `<select>` cannot render. */
  description?: string;
}

/**
 * Searchable single-select. Use above ~15 options, where `Select`'s
 * unsearchable native list stops working; use `Select` below that.
 *
 * The control box is `Input`'s chrome; the list is drawn by us with
 * `role="listbox"`, `aria-activedescendant` and full keyboard support.
 * Single-select only, and free text is never a value — the input reverts to
 * the committed selection on blur.
 */
export interface ComboboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'style' | 'value' | 'onChange' | 'type' | 'role'> {
  options: Array<string | ComboboxOption>;
  /** The selected option's `value`. Must exist in `options` or the control renders empty and warns. */
  value?: string;
  /** Receives the chosen option's `value` — not an event. */
  onChange?: (value: string) => void;
  /** Called with the query on every keystroke, for server-side search. Requires `filter={false}`. */
  onSearch?: (query: string) => void;
  /** Custom matcher `(option, lowercasedQuery) => boolean`, or `false` to disable client filtering when the server matches. */
  filter?: false | ((option: ComboboxOption, query: string) => boolean);
  placeholder?: string;
  /** Shown in place of the list when nothing matches. Say what would help. Default "No matches". */
  emptyMessage?: string;
  /** Spinner in the chevron slot and a "Searching…" row — for async fetches. */
  loading?: boolean;
  /** sm/md/lg, matching Input. `lg` draws 16px type so iOS does not zoom on focus. */
  size?: 'sm' | 'md' | 'lg';
  /** Danger border + ring + `aria-invalid`. Inherited from `Field`'s `error`. */
  invalid?: boolean;
  disabled?: boolean;
  /** Layout only — applied to the wrapper. The list is positioned in viewport coordinates, so no ancestor clips it. */
  style?: React.CSSProperties;
}
export declare function Combobox(props: ComboboxProps): JSX.Element;
