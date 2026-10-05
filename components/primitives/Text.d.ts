import * as React from 'react';

/**
 * Every run of non-heading text in the system. Sets family, size, weight,
 * leading, tracking and colour from tokens in one decision.
 */
export interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** 'span' (default), 'p', 'div', 'label', 'li', 'code'. */
  as?: any;
  /** 2xs 11 · xs 12 · sm 13 · base 14 (default) · md 15 · lg 16 · xl 18 · 2xl 22. */
  size?: '2xs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  /** Maps to --text-<tone>. */
  tone?: 'primary' | 'secondary' | 'tertiary' | 'disabled' | 'inverse' | 'link' | 'accent' | 'success' | 'warning' | 'critical' | 'info';
  /** mono for IDs, codes, timestamps and anything machine-generated. */
  family?: 'sans' | 'mono';
  leading?: 'none' | 'tight' | 'snug' | 'normal' | 'relaxed';
  align?: 'left' | 'center' | 'right';
  /** Uppercase micro-label: forces 11px and caps tracking. */
  caps?: boolean;
  /** Tabular figures — required for any number in a column. */
  numeric?: boolean;
  /** Caps the line length: prose 68ch · narrow 46ch · hint 52ch. */
  measure?: 'prose' | 'narrow' | 'hint';
  /** true = one line with an ellipsis; a number = that many lines. */
  truncate?: boolean | number;
  block?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Text(props: TextProps): JSX.Element;
