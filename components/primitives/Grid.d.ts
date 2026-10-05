import * as React from 'react';

/**
 * Two-dimensional layout on the system grid: 4 columns on mobile, 8 on tablet,
 * 12 on desktop, with the matching gutter.
 */
export interface GridProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  as?: any;
  /** 'responsive' = the 4/8/12 system grid. 'fluid' = auto-fit by minItemWidth. A number = fixed columns. */
  columns?: 'responsive' | 'fluid' | number | string;
  /** Only with columns='fluid'. Default 240. */
  minItemWidth?: number | string;
  /** Space step. Defaults to --grid-gutter, which tracks the breakpoint. */
  gap?: number | string;
  rowGap?: number | string;
  columnGap?: number | string;
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyItems'];
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Grid(props: GridProps): JSX.Element;

export interface GridItemProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  as?: any;
  /** Columns to span. Never exceed the column count of the smallest breakpoint you support. */
  span?: number;
  /** 1-based start line. */
  start?: number;
  rowSpan?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function GridItem(props: GridItemProps): JSX.Element;
