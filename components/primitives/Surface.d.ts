import * as React from 'react';

/**
 * A content plane: background + hairline + radius, resolved as one decision.
 * Surface is what a Box becomes when it needs to read as a distinct layer.
 */
export interface SurfaceProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  as?: any;
  /** card = default plane. sunken = wells and code. raised/overlay = floating. inverse = dark. */
  tone?: 'card' | 'sunken' | 'raised' | 'overlay' | 'selected' | 'inverse';
  /** 0 flush, 1 resting card, 2 sticky, 3 popover, 4 toast/drawer, 5 dialog. */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  /** none | sm (16) | md (24, default when set) | lg (32). */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  /** Adds hover feedback and a pointer cursor — pair with a real button or link role. */
  interactive?: boolean;
  /** Stretch to the height of the parent track. */
  fill?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Surface(props: SurfaceProps): JSX.Element;
