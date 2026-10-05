import * as React from 'react';

/**
 * A text-search control: query entry with search semantics, plus the two
 * auxiliary actions search actually needs — clear and submit.
 *
 * The composite owns the query contract (one value, one change signal,
 * clearing as an ordinary value change), the `role="search"` boundary and
 * accessible name, the clear/submit split, and their coordinated sizing.
 * `Input` keeps every text-editing behaviour it already has.
 *
 * NOT a suggestion field — that is `Autocomplete`, which owns a listbox, a
 * cursor and a selection contract. NOT a filter control, and NOT the owner of
 * any result, suggestion or result-count state.
 */
export interface SearchFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'style' | 'value' | 'defaultValue' | 'onChange' | 'onSubmit'> {
  /**
   * Required accessible name, and the scope of the search ("Search invoices").
   * Independent of `placeholder`: a placeholder disappears on the first
   * keystroke, and a search landmark with no name cannot be told apart from
   * the next one on the page.
   */
  label: string;
  /** Controlled query. Pass with `onChange`; omit for uncontrolled. */
  value?: string;
  /** Uncontrolled initial query. Default `''`. */
  defaultValue?: string;
  /** Emits the next query string — not an event. Clearing goes through here too. */
  onChange?: (next: string, e: React.SyntheticEvent) => void;
  /**
   * Explicit submission. Present ⇒ `Enter` submits the current query, and a
   * `submit` control (if any) fires it. Absent ⇒ the query IS the signal and
   * the consumer searches on change.
   */
  onSubmit?: (query: string, e: React.SyntheticEvent) => void;
  /** Extra signal when the query was cleared. `onChange('')` fires either way. */
  onClear?: (e: React.SyntheticEvent) => void;
  /** Example or format hint. Never a substitute for `label`. */
  placeholder?: string;
  /**
   * The explicit submit control: `none` (default — search on change),
   * `icon` (a solid magnifier beside the field), `button` (a lettered
   * "Search"). Requires `onSubmit`.
   */
  submit?: 'none' | 'icon' | 'button';
  /**
   * `true` (default) shows the clear control only when there is something to
   * clear; `'always'` keeps it visible for a stable hit target; `false`
   * removes it.
   */
  clearable?: boolean | 'always';
  /**
   * Publishes the surrounding wrapper as a `role="search"` landmark, named by
   * `label`. Default false: search semantics already come from the field's
   * `searchbox` role, and a landmark named the same as the field it contains
   * announces the scope twice. Set it on a page's PRIMARY search, where the
   * landmark is a genuine navigation shortcut.
   */
  landmark?: boolean;
  /**
   * Coordinated control height: the field, the clear control (one step down,
   * since it sits inside the box) and the submit control all follow it.
   */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Focusable and copyable, not editable — the clear control is withdrawn. */
  readOnly?: boolean;
  /** One short line of supporting information under the field. */
  hint?: React.ReactNode;
  /** Layout only — merged onto the outer wrapper. */
  style?: React.CSSProperties;
}
export declare function SearchField(props: SearchFieldProps): JSX.Element;
