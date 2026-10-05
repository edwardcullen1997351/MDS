import * as React from 'react';

/**
 * Two thumbs, one range.
 *
 * A sibling of `Slider` rather than a `range` prop on it — the same call this
 * system made for `Combobox`/`MultiCombobox` and `Checkbox`/`CheckboxGroup`.
 * A second thumb changes what the control is: `value` becomes a pair, every
 * ARIA value attribute doubles, and each thumb needs its own name.
 *
 * Two real `<input type="range">` elements carry keyboard and assistive-tech
 * operation; pointer dragging is handled on the track, so the lower thumb
 * stays reachable when both sit on the same value.
 */
export interface RangeSliderProps {
  /** What the range measures. Required in practice: each thumb's accessible name is composed from it — "Price band Minimum", "Price band Maximum" — so without it they announce as bare "Minimum, 20". */
  label?: string;
  /** Controlled value as `[low, high]`. Pass `onChange` with it. */
  value?: [number, number];
  defaultValue?: [number, number];
  min?: number;
  max?: number;
  step?: number;
  /** Gap the thumbs may not close. Default 0 — they may meet, never cross. */
  minDistance?: number;
  /** Appended to each number with a thin space. */
  unit?: string;
  /** Full control of the readout; takes one number. */
  format?: (n: number) => string;
  /** The "20 – 80" readout beside the label. One reading, not two. */
  showValue?: boolean;
  size?: 'sm' | 'md';
  disabled?: boolean;
  /** Receives the new `[low, high]` pair — not an event. */
  onChange?: (value: [number, number]) => void;
  /** Qualifies the low thumb within the group; composed after `label` ("Price band Minimum"). Default "Minimum". */
  startLabel?: string;
  /** Qualifies the high thumb within the group; composed after `label` ("Price band Maximum"). Default "Maximum". */
  endLabel?: string;
  style?: React.CSSProperties;
  id?: string;
}
export declare function RangeSlider(props: RangeSliderProps): JSX.Element;
