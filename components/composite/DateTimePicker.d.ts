import * as React from 'react';

/** The parts of the value, always both reported, either possibly `undefined`. */
export interface DateTimeParts {
  /** ISO `'YYYY-MM-DD'` on the Site's clock — `DatePicker`'s value, unchanged. */
  date?: string;
  /** `'HH:mm'`, 24-hour, on the Site's clock — `TimeField`'s value, unchanged. */
  time?: string;
  /** Both halves present. `false` means the emitted value is `undefined`. */
  complete: boolean;
  /** The IANA zone the halves are on, or `undefined` in floating mode. */
  zone?: string;
  /** That clock time does not exist in that zone (spring forward) — no instant was emitted. */
  shifted?: boolean;
  /** That clock time happens twice (autumn back). The earlier occurrence was used. */
  ambiguous?: boolean;
}

/** Why the current value is not valid. `null` when it is. */
export type DateTimeProblem = 'malformed' | 'nonexistent' | 'bounds' | 'partial' | null;

/**
 * One temporal value, assembled from a calendar date and a wall-clock time.
 *
 * The composite owns assembly and disassembly, partial-value behaviour,
 * combined validation, group naming, ordering and serialization. `DatePicker`
 * still owns date selection; `TimeField` still owns time entry.
 *
 * **Two modes, and the difference is whose clock:**
 *
 * - **An instant** — pass the record's Site `zone`. The value is a UTC ISO
 *   instant ending in `Z`, stored in UTC and edited on the Site's clock with
 *   the zone named beside the field, exactly as the principles require. Real
 *   conversion, via `components/forms/zone.js`. Never the browser's zone.
 * - **A floating wall clock** — omit `zone`. The value is a local
 *   `'YYYY-MM-DDTHH:mm'` with no offset, for a moment that genuinely has no
 *   zone: a shift template, a recurring cut-off. It never pretends to be an
 *   instant.
 */
export interface DateTimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onChange'> {
  /**
   * Names the moment as a whole ("Fault occurred", "Outage start"). Required
   * outside a `Field`; the group's visible heading when there is no Field.
   */
  label?: string;
  /**
   * A UTC instant (`'2026-09-14T07:00:00Z'`) when `zone` is set; otherwise a
   * local `'YYYY-MM-DDTHH:mm'` or `{ date, time }` — the parts form lets a
   * half-entered floating value round-trip.
   */
  value?: string | { date?: string; time?: string };
  /**
   * `(value, parts)`. `value` is the UTC instant (zoned) or the local string
   * (floating), and `undefined` while a half is missing or the clock time does
   * not exist. `parts` always carries the halves and the DST flags.
   */
  onChange?: (value: string | undefined, parts: DateTimeParts) => void;
  /**
   * The record's Site zone, as an **IANA name** — `'Asia/Kolkata'`, not
   * `'IST'` (India, Ireland and Israel all use that abbreviation). The label
   * shown beside the field is derived from the zone at that instant, so IST
   * reads `UTC+5:30` year-round while a zone with transitions reads
   * differently in summer and winter.
   */
  zone?: string;
  /** Half terminology. Defaults `'Date'` / `'Time'`. */
  dateLabel?: string;
  timeLabel?: string;
  /**
   * Inclusive bounds on the **Site's clock**, at the precision given:
   * `'2026-09-01'` means from the start of that day and, as a `max`, the end
   * of it. A UTC instant is accepted and read onto the same clock. Time bounds
   * constrain the time field only on a boundary day.
   */
  min?: string | { date?: string; time?: string };
  max?: string | { date?: string; time?: string };
  /**
   * Default `false` — one half filled is invalid, because a moment with no
   * time is not a moment. `true` accepts it as an intermediate. Either way the
   * message waits until the empty half has been visited and left, and nothing
   * is ever inferred.
   */
  allowPartial?: boolean;
  /** `TimeField`'s arrow-key step, in minutes. 15 or 30 for scheduled times. */
  step?: number;
  /** Consumer message, shown instead of the derived one and marking both halves. For domain rules the composite does not know. */
  error?: React.ReactNode;
  /** A rule about the whole moment. Described to both halves. */
  hint?: React.ReactNode;
  /** A rule about one half. Keep half-rules here and combined rules in `hint`. */
  dateHint?: React.ReactNode;
  timeHint?: React.ReactNode;
  /** `auto` (default) wraps when the date can no longer fit · `inline` never wraps · `stacked` always stacks. Arrangement only: order stays date → time and the value model never changes. */
  layout?: 'auto' | 'inline' | 'stacked';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  readOnly?: boolean;
  clearable?: boolean;
  weekStartsOn?: 0 | 1;
  isDateDisabled?: (iso: string) => boolean;
  /** Fires when validity changes — a form's submit gate. Reports immediately, unlike the deferred partial message. */
  onValidityChange?: (state: { valid: boolean; reason: DateTimeProblem; complete: boolean }) => void;
  style?: React.CSSProperties;
}
export declare function DateTimePicker(props: DateTimePickerProps): JSX.Element;
