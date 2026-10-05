import * as React from 'react';

/**
 * Section titles. The level sets the document outline; size is a separate,
 * optional override so a visually small h2 stays an h2.
 */
export interface HeadingProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'style'> {
  /** 1-6. Drives the tag and, unless size is set, the type step. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Escape hatch for rendering a different tag (e.g. 'div' inside a card header). */
  as?: any;
  /** Overrides the level's size. display-* steps are fluid and marketing-only. */
  size?: '2xs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | 'display-sm' | 'display-md' | 'display-lg' | 'display-xl';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  tone?: 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'accent';
  /** Fluid display type for landing and empty-state hero copy. */
  display?: boolean;
  align?: 'left' | 'center' | 'right';
  measure?: 'prose' | 'narrow' | 'hint';
  truncate?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Heading(props: HeadingProps): JSX.Element;
