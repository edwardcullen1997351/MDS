import * as React from 'react';

/**
 * One-dimensional flow with a token gap. The default way to space siblings —
 * margins between elements are a bug in this system.
 */
export interface StackProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  as?: any;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** Space step. 2 inside controls, 3-4 between fields, 6 between sections. Default 4. */
  gap?: number | string;
  /** Defaults to 'center' for rows, stretch for columns. */
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  wrap?: boolean;
  /** Render as inline-flex so the stack shrinks to its content. */
  inline?: boolean;
  grow?: number;
  /** Stretch to the parent height. */
  fill?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Stack(props: StackProps): JSX.Element;
