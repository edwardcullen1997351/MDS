import * as React from 'react';

export interface DatePreset {
  label: string;
  /** A single ISO date, or `[from, to]` for a range picker. */
  value: string | [string, string];
}

/**
 * A text field with a calendar — not a calendar with a field. Typing is the
 * primary path; the panel answers "which Tuesday was that".
 *
 * The value is an ISO `'YYYY-MM-DD'` **string**, never a `Date`: a Date is a
 * timestamp with a timezone, and local-midnight → `toISOString()` files a
 * date against the previous day everywhere west of Greenwich.
 *
 * Typed entry accepts ISO, compact ISO (`20260905`), `today` and `yesterday`.
 * Slash formats are refused deliberately — `05/09/2026` is two different days
 * depending on the reader.
 *
 * There is no time-of-day: a timestamp needs a time field and a timezone, and
 * that is a different control.
 */
export interface DatePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onChange' | 'defaultValue'> {
  /** ISO date, or `[from, to]` when `range`. Controlled. */
  value?: string | [string | undefined, string | undefined];
  /** Emits the next ISO string, or the next `[from, to]` pair — never an event or a Date. */
  onChange?: (next: any) => void;
  /** Two fields and one panel; ends swap if picked out of order. */
  range?: boolean;
  /** "Last 7 days", "This shift" — the column beside the grid. What makes a range picker usable in ops. */
  presets?: DatePreset[];
  /** ISO bounds, inclusive. */
  min?: string;
  max?: string;
  /** Per-date veto, e.g. non-production days. Receives an ISO string. */
  isDateDisabled?: (iso: string) => boolean;
  /** 1 = Monday (default, ISO 8601). 0 = Sunday. Moves the header with the grid. */
  weekStartsOn?: 0 | 1;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** Sunken fill at full text contrast; the panel cannot be opened. */
  readOnly?: boolean;
  /** The × that empties the field. */
  clearable?: boolean;
  /** Only when not wrapped in a `Field`. Warns when neither is present. */
  label?: React.ReactNode;
  /** Defaults to `YYYY-MM-DD` — the format IS the hint. */
  placeholder?: string;
  style?: React.CSSProperties;
}
export declare function DatePicker(props: DatePickerProps): JSX.Element;
