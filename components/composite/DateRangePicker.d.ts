import * as React from 'react';

/** `[start, end]` — the same pair shape `DatePicker range` emits. ISO `'YYYY-MM-DD'` strings, never `Date`s. */
export type DateRange = [string | undefined, string | undefined];

/** Why the current pair is not a valid range. `null` when it is. */
export type DateRangeProblem = 'order' | 'bounds' | 'partial' | null;

/**
 * Two dates that mean one bounded interval.
 *
 * The composite owns the relationship the two pickers cannot see from inside
 * themselves: one range value, ordering, cross-field validation, per-endpoint
 * accessible identity and validation association, bounds on each endpoint
 * derived from the other, and an arrangement that may stack without ever
 * reordering time. Each `DatePicker` keeps its own typed entry, its own panel
 * and its own keyboard.
 *
 * NOT `DatePicker range` — that is ONE control: one shared panel, an
 * unlabelled arrow between two inputs, and ends that silently swap when
 * picked out of order. Right for "pick a window on a calendar"; wrong for a
 * form that must name, bound, validate and describe each endpoint
 * separately.
 */
export interface DateRangePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onChange'> {
  /**
   * Names the range as a whole ("Report window", "Shift period"). Required
   * outside a `Field`. Rendered as the group's visible heading when there is
   * no `Field` above it; used as the group's accessible name either way. The
   * endpoints are named by their own labels, never by this.
   */
  label?: string;
  /** The range. Controlled: `[start, end]`, either end possibly `undefined`. */
  value?: DateRange;
  /** Emits the next `[start, end]` pair — never one date, never an event, never a `Date`. */
  onChange?: (next: DateRange) => void;
  /** Endpoint terminology. Defaults `'Start'` / `'End'`; keep one pair of words across a product. */
  startLabel?: string;
  endLabel?: string;
  /** Outer ISO bounds, inclusive, applied to both endpoints. */
  min?: string;
  max?: string;
  /**
   * Default `true`: each endpoint's bounds are tightened by the other, so a
   * calendar cannot produce an inverted range. Withdrawn automatically while
   * the pair is *already* inverted, or the user would be pinned inside the
   * error. `false` reports ordering without ever preventing it.
   */
  constrain?: boolean;
  /**
   * Default `false` — most forms have no meaning for a half-open interval,
   * so one filled end is invalid. `true` treats a partial range as a valid
   * intermediate value while the user is still working.
   *
   * Either way the message only appears once the endpoint has been
   * *visited and left* — a form does not turn red between two keystrokes.
   */
  allowPartial?: boolean;
  /** Consumer message, shown instead of the derived one and marking both endpoints. For domain rules (duration caps, blackout periods) the composite deliberately does not know. */
  error?: React.ReactNode;
  /** Range-level supporting text — a rule about the interval. Described to both endpoints. */
  hint?: React.ReactNode;
  /** Supporting text for one endpoint only. Keep endpoint rules here and interval rules in `hint`. */
  startHint?: React.ReactNode;
  endHint?: React.ReactNode;
  /**
   * `auto` (default) sits inline and wraps to stacked when a side can no
   * longer hold a whole date · `inline` never wraps · `stacked` always
   * stacks. Arrangement only: DOM and focus order stay start → end, and the
   * value model never changes.
   */
  layout?: 'auto' | 'inline' | 'stacked';
  /** One control height for both endpoints. */
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  /** `DatePicker`'s read-only behaviour on both endpoints. */
  readOnly?: boolean;
  /** The × on each endpoint. Default true. */
  clearable?: boolean;
  weekStartsOn?: 0 | 1;
  /** Per-date veto, applied to both endpoints. */
  isDateDisabled?: (iso: string) => boolean;
  /** Fires when range validity changes — for a form that owns submit state. */
  onValidityChange?: (state: { valid: boolean; reason: DateRangeProblem }) => void;
  style?: React.CSSProperties;
}
export declare function DateRangePicker(props: DateRangePickerProps): JSX.Element;
