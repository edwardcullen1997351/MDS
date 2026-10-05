import * as React from 'react';

export interface MultiComboboxOption {
  value: string;
  label: string;
  /** Second line, searched by the default filter. */
  description?: string;
  /** Offered but not selectable. */
  disabled?: boolean;
}

/**
 * Several values from a list the system knows — tokens in the box, a
 * searchable multi-select list beneath it.
 *
 * Not `Combobox multiple`: the box has no fixed height, the list stays open on
 * select, removal needs the token × *and* Backspace, overflow is a rule rather
 * than a scrollbar, and the announcement is a count ("3 selected") rather than
 * a re-read of every label.
 *
 * Values are emitted in OPTION order, never click order, so a saved value
 * round-trips identically however the user built it.
 */
export interface MultiComboboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size'> {
  /** Strings are shorthand for `{ value: s, label: s }`. */
  options: (MultiComboboxOption | string)[];
  /** Controlled, always an array. Keep selected values in `options` or their tokens cannot render. */
  value: string[];
  /** Emits the next array in option order — not an event. */
  onChange: (next: string[]) => void;
  /** Server-side search. Pass `filter={false}` with it, or results are filtered twice. */
  onSearch?: (query: string) => void;
  /** `false` disables client filtering; a function replaces the default (label + description, case-insensitive). */
  filter?: false | ((option: MultiComboboxOption, query: string) => boolean);
  /** Shown only while nothing is selected — the first token replaces it. */
  placeholder?: string;
  /** Default `'No matches'`. */
  emptyMessage?: React.ReactNode;
  /** Offer the typed text as a new value — a real option row at the end of the list, reachable by ArrowDown and Enter. Only for OPEN sets (tags, keywords, part numbers); on a closed set it manufactures values the backend will reject. */
  creatable?: boolean;
  /** Maps typed text to an option; the default uses the text as both label and value. Return `null` to refuse the creation. */
  onCreate?: (text: string) => { value: string; label?: string } | null;
  loading?: boolean;
  /** Tokens shown at rest before collapsing to “+N”; `false` always shows all. Default 3. */
  collapseAfter?: number | false;
  /** Selection ceiling. Unselected rows go `aria-disabled` and the list says so. */
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  /** Set by `Field` when it carries an error; the message must come with it. */
  invalid?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function MultiCombobox(props: MultiComboboxProps): JSX.Element;
