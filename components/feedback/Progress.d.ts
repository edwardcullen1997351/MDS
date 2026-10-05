import * as React from 'react';

/**
 * Work in flight — a task that started and will end.
 *
 * NOT a level: a utilisation gauge, an OEE bar or a capacity meter reports
 * something that is simply true, and belongs in a chart (or `role="meter"`).
 * That is why this component has no tones.
 *
 * Omit `value` for an indeterminate bar or spinner. Because reduced motion
 * stops both loops dead, an indeterminate indicator may never be the only
 * signal that work is happening — always pass a `label`.
 */
export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** 0–100. Omit for indeterminate — the value is genuinely unknown, not zero. */
  value?: number;
  /** `bar` is measurable work; `spinner` is a short unmeasurable wait inline or in a control. */
  variant?: 'bar' | 'spinner';
  /** Bar: 2px / 4px. Spinner: 14 / 16 / 20px, matched to the icon scale. */
  size?: 'sm' | 'md' | 'lg';
  /** What is running ("Exporting work orders"). Required in practice; warns when missing. */
  label?: React.ReactNode;
  /** Bar only, determinate only: renders the percentage beside the label, never inside the track. */
  showValue?: boolean;
  /** Render nothing for this many ms. ~300 on anything that can return fast — an indicator that flashes for 120ms reads as a glitch. Default 0. */
  delay?: number;
  style?: React.CSSProperties;
}
export declare function Progress(props: ProgressProps): JSX.Element;
