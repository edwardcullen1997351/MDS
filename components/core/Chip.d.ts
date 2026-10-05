import * as React from 'react';

/**
 * One offered option in a closed set. Only valid inside `ChipGroup` —
 * a chip standing alone is a toggle `Button`.
 * For a value from the data use `Tag`; for a system condition use `Badge`.
 */
export interface ChipProps extends Omit<React.HTMLAttributes<HTMLInputElement>, 'style'> {
  label?: React.ReactNode;
  children?: React.ReactNode;
  value?: string;
  icon?: string;
  count?: number;
  /** Normally supplied by the group. */
  selected?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function Chip(props: ChipProps): JSX.Element;
