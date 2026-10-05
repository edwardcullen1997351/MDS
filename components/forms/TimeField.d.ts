import * as React from 'react';

/**
 * A wall-clock time as two integers, in an `'HH:mm'` string. 24-hour, always.
 *
 * Kept separate from `DatePicker` on purpose: fusing them would change that
 * component's value *type* on a boolean. Compose the two and let the product
 * build the UTC instant from both halves plus the record's Site timezone —
 * the only place that decision can correctly be made.
 *
 * No AM/PM, no seconds, no dropdown of times, no spinner buttons.
 */
export interface TimeFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onChange' | 'defaultValue'> {
  /** `'HH:mm'`, 24-hour. Controlled. Never a `Date` and never minutes-since-midnight. */
  value?: string;
  /** Emits the next `'HH:mm'`, or `undefined` when cleared. Not an event. */
  onChange?: (next: string | undefined) => void;
  /** Minutes the arrow keys move by, snapped to the grid it describes. 15 for shift-ish times. */
  step?: number;
  /** `'HH:mm'` bounds, inclusive. Steps clamp at them; they never wrap past midnight. */
  min?: string;
  max?: string;
  /**
   * A zone LABEL rendered in the field ("CET"). It never converts — a time
   * with no date has no offset. The value comes from the record's Site.
   */
  zone?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  /** Only when not wrapped in a `Field`. Warns when neither is present. */
  label?: React.ReactNode;
  /** Defaults to `HH:MM` — the format IS the hint. */
  placeholder?: string;
  style?: React.CSSProperties;
}
export declare function TimeField(props: TimeFieldProps): JSX.Element;
