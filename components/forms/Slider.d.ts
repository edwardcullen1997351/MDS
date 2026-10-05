import * as React from 'react';

/**
 * A value on a bounded range, where the position on the range is the point.
 *
 * Renders a real `<input type="range">` — transparent over a painted track —
 * so the role, value announcements, arrow keys, Home/End, PageUp/PageDown,
 * pointer dragging and the form value are native. Always paired with a mono
 * readout: the track carries the approximation, the number carries the
 * precision. Never a progress bar (`Progress`), never precise numeric entry
 * (`Input`), and it must not borrow `--progress-*`.
 */
export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'style' | 'value' | 'defaultValue'> {
  /** The accessible name — the quantity being set, with its unit if the readout does not carry one. */
  label?: React.ReactNode;
  /** Controlled value. Requires `onChange`; warns without it, because the thumb then cannot move. */
  value?: number;
  /** Seeds an uncontrolled slider. */
  defaultValue?: number;
  min?: number;
  max?: number;
  /** Granularity. Choose the smallest step the operator can act on, not the smallest the data has. */
  step?: number;
  /** Appended to the readout after a thin space: `68 %`, `240 s`. */
  unit?: string;
  /** Full control of the readout — takes precedence over `unit`. Also becomes `aria-valuetext`. */
  format?: (value: number) => string;
  /** The mono readout above the track. Hide it only when the value is printed elsewhere on the row. */
  showValue?: boolean;
  /** Tick positions, with optional labels rendered under the track. Endpoints are the usual pair. */
  marks?: Array<number | { value: number; label?: React.ReactNode }>;
  /** sm 3px track / 14px thumb, md 4px / 16px. No lg — see the spec. */
  size?: 'sm' | 'md';
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Slider(props: SliderProps): JSX.Element;
