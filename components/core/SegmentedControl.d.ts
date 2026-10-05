import * as React from 'react';

export interface SegmentOption {
  value: string;
  /** Must be a string when `iconOnly` — it becomes the accessible name and the tooltip. */
  label: React.ReactNode;
  /** Lucide icon name. Required on every option when `iconOnly`. */
  icon?: string;
  /** Unavailable, still shown: removing it would change the question. Skipped by the arrow keys. */
  disabled?: boolean;
}

/**
 * One value, two to four options, all visible, in the width of a toolbar row —
 * the joined track with a raised segment marking the current value.
 *
 * Native same-name radios behind `<label>`s, so the platform supplies one tab
 * stop, wrapping arrow selection and disabled-skipping. Selection follows
 * focus: every option is already rendered, so switching costs nothing.
 *
 * Not `Tabs variant="pill"` (same paint, but a tablist owns panels), not
 * `ChipGroup` (that wraps, counts and goes multi-select), not `ButtonGroup`
 * (which deliberately holds no selected state).
 */
export interface SegmentedControlProps extends Omit<React.HTMLAttributes<HTMLFieldSetElement>, 'style' | 'onChange' | 'defaultValue'> {
  /** The question the segments answer ("View", "Units"). Hidden by default — still the group's accessible name. */
  label?: React.ReactNode;
  /** Renders the legend above the track. Default false: in a toolbar the question is the surrounding context. */
  labelVisible?: boolean;
  /** Two to four. Past four the track cannot show every label at once — use `ChipGroup` or `Select`. */
  options: SegmentOption[];
  /** Controlled only when passed WITH `onChange`; otherwise the component holds its own value. */
  value?: string;
  /** Uncontrolled initial value. Defaults to the first option. */
  defaultValue?: string;
  /** Emits the next value — not an event. */
  onChange?: (next: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: 'sm' | 'md';
  /** Native `<fieldset disabled>`, so the platform owns the whole subtree. */
  disabled?: boolean;
  /** Equal columns, each floored at its own content width. Default true. (The weight step on selection is absorbed by a per-label bold-width reserve, not by this.) */
  equalWidth?: boolean;
  /** Square segments, glyph only. Every option then needs `icon` and a string `label`. */
  iconOnly?: boolean;
  /** Stretch the track to its container. Default false — a segmented control is toolbar-sized. */
  fullWidth?: boolean;
  /** `vertical` stacks the segments. The four-option ceiling and the one-track shape still hold — only the axis changes. A vertical control with nine options is a Radio group. */
  orientation?: 'horizontal' | 'vertical';
  /** Generated when omitted, so per-row controls cannot collide. Pass one only for a real form POST. */
  name?: string;
  style?: React.CSSProperties;
}
export declare function SegmentedControl(props: SegmentedControlProps): JSX.Element;
