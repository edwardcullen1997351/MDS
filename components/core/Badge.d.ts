import * as React from 'react';

/**
 * Small non-interactive status label. The word comes from a fixed set the
 * system owns, and the tone carries meaning — for user- or data-derived text
 * use `Tag`, which is monochrome and removable.
 */
export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** `critical` is the documented name; `danger` is kept for compatibility. */
  tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'critical' | 'danger';
  size?: 'sm' | 'md';
  /** Leading status dot in the tone's solid colour. Mutually exclusive with `icon`. */
  dot?: boolean;
  /** Lucide icon name shown before the label. Mutually exclusive with `dot`. */
  icon?: string;
  /** Count ceiling: a numeric label above it renders `max+` and keeps the true value in the accessible name. */
  max?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
