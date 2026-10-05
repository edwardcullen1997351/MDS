import * as React from 'react';

/**
 * The measured content frame: caps width, centres it, and applies the
 * responsive page gutter. One per screen region, never nested.
 */
export interface ContainerProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  as?: any;
  /** sm 640 forms · md 900 prose · lg 1240 app default · xl 1440 wide tables · full bleed. */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Apply --grid-margin inline padding (16 / 24 / 32 by breakpoint). Default true. */
  gutter?: boolean;
  /** Vertical padding, in space steps. */
  py?: number | string;
  center?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Container(props: ContainerProps): JSX.Element;
