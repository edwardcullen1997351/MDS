import * as React from 'react';

export interface AutocompleteSuggestion {
  /** The text written into the field when this row is accepted. */
  value: string;
  /** Display text; defaults to `value`. */
  label?: string;
  /** Optional second line. Shown, never matched. */
  description?: string;
}

/**
 * A text field that suggests as you type. The **typed text is the value** —
 * suggestions only accelerate typing and never constrain it, which is the
 * exact inverse of `Combobox`, where free text can never be a value.
 *
 * Always controlled: hold `value` in your state and update it from `onChange`,
 * which fires on every keystroke and on an accepted suggestion alike. Nothing
 * is ever "selected": accepting a row simply rewrites the text.
 */
export interface AutocompleteProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'style' | 'value' | 'onChange' | 'onSelect' | 'type' | 'role'> {
  /** Candidate completions. Strings are used as both value and label. */
  suggestions?: Array<string | AutocompleteSuggestion>;
  /** The field's text. This IS the value. */
  value: string;
  /** Every keystroke and every accepted suggestion. Required in practice. */
  onChange?: (value: string) => void;
  /** Fires only when a suggestion is accepted — analytics, or fetching the record behind the text. Never the source of the value. */
  onSelect?: (suggestion: AutocompleteSuggestion) => void;
  /** Custom matcher `(suggestion, lowercasedQuery) => boolean`, or `false` when the server matches. Default ranks prefix, then word-start, then mid-word matches on the label. */
  filter?: false | ((suggestion: AutocompleteSuggestion, query: string) => boolean);
  /** Characters required before anything is suggested. Default 1; raise it for server-backed fields. */
  minChars?: number;
  /** Hard cap on rows. Default 6 — the list never scrolls. Warns above 10. */
  maxSuggestions?: number;
  /** Also show the top suggestion's remainder as grey ghost text in the field; → accepts it. Sets `aria-autocomplete="both"`. */
  inline?: boolean;
  placeholder?: string;
  /** Spinner in the field and a "Searching…" row — for async fetches. */
  loading?: boolean;
  /** sm/md/lg, matching Input. `lg` draws 16px type so iOS does not zoom on focus. */
  size?: 'sm' | 'md' | 'lg';
  /** Danger border + ring + `aria-invalid`. Inherited from `Field`'s `error`. */
  invalid?: boolean;
  disabled?: boolean;
  /** Layout only — applied to the wrapper. The list is positioned in viewport coordinates, so no ancestor clips it. */
  style?: React.CSSProperties;
}
export declare function Autocomplete(props: AutocompleteProps): JSX.Element;
