import * as React from 'react';

/**
 * Reserves proportional space before its content loads, so media and embeds
 * never shift the layout.
 */
export interface AspectRatioProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Named ratio, a 'w/h' string, or a number. square 1:1 · video 16:9 (default) · wide 21:9 · photo 4:3 · portrait 3:4. */
  ratio?: 'square' | 'video' | 'wide' | 'photo' | 'portrait' | 'golden' | number | string;
  radius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Colour token shown while the child loads, e.g. 'surface-sunken'. */
  background?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function AspectRatio(props: AspectRatioProps): JSX.Element;
