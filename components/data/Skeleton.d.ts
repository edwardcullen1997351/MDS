import * as React from 'react';

/**
 * A shape standing in for content that has not arrived.
 *
 * Sized by the content it replaces, not by a size scale. Always
 * `aria-hidden` — the loading *region* carries `aria-busy` and makes the one
 * announcement; announcing every placeholder is the failure mode.
 *
 * For a wait of unknown length use a spinner or a progress bar: a skeleton
 * promises a specific shape is coming.
 */
export interface SkeletonProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Any CSS width. Default 100% of its container. */
  width?: string;
  /** Any CSS height. Defaults to 1em — the line-box of the text it stands in for. */
  height?: string;
  /** More than one renders a stack; the last line is short, as a paragraph's is. */
  lines?: number;
  radius?: string;
  /** false stops the sweep. Reduced motion stops it regardless. */
  animate?: boolean;
  /**
   * Lands on the outer element only — the single line, or the stack wrapper.
   * Never on the individual lines of a stack.
   */
  style?: React.CSSProperties;
  /** Render nothing for this many ms. ~300 on anything that can return fast. Default 0. */
  delay?: number;
}
export declare function Skeleton(props: SkeletonProps): JSX.Element;
