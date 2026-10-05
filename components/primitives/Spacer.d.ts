import * as React from 'react';

/**
 * A deliberate gap where a gap cannot express it — pushing a trailing action
 * to the far edge of a toolbar, or breaking rhythm inside legacy markup.
 */
export interface SpacerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Space step. Default 4 (16px). Ignored when grow is set. */
  size?: number | string;
  axis?: 'vertical' | 'horizontal';
  /** Absorb all free space in a flex line (flex: 1) instead of a fixed size. */
  grow?: boolean;
  style?: React.CSSProperties;
}
export declare function Spacer(props: SpacerProps): JSX.Element;
