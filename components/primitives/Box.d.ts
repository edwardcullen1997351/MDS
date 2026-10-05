import * as React from 'react';

/** A space step: 0 | 'px' | 'half' | 1..24, or any CSS length ('auto', '50%'). */
export type Space = number | string;

/**
 * The unstyled layout atom. Applies spacing, sizing and surface tokens to one element.
 */
export interface BoxProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** Element or component to render. Default 'div'. */
  as?: any;
  /** Padding, in space steps. px/py are axis shorthands; pt/pr/pb/pl win over them. */
  p?: Space; px?: Space; py?: Space; pt?: Space; pr?: Space; pb?: Space; pl?: Space;
  /** Margin, in space steps. Prefer gap on Stack/Grid over margins. */
  m?: Space; mx?: Space; my?: Space; mt?: Space; mr?: Space; mb?: Space; ml?: Space;
  width?: number | string; height?: number | string;
  minWidth?: number | string; maxWidth?: number | string;
  minHeight?: number | string; maxHeight?: number | string;
  display?: React.CSSProperties['display'];
  /** Colour token name, e.g. 'surface-card', 'background-sunken'. */
  background?: string;
  /** Radius role: none | xs | sm | md | lg | xl | pill. */
  radius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'pill';
  /** Hairline border tone, or true for 'default'. */
  border?: boolean | 'subtle' | 'default' | 'strong' | 'focus' | 'inverse';
  borderTop?: boolean | 'subtle' | 'default' | 'strong';
  borderBottom?: boolean | 'subtle' | 'default' | 'strong';
  /** Elevation level 0-5. Use 0-2 for anything that is not floating. */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  overflow?: React.CSSProperties['overflow'];
  position?: React.CSSProperties['position'];
  flex?: number | string; grow?: number; shrink?: number; basis?: number | string;
  /** Only meaningful with display 'flex' or 'grid' — otherwise reach for Stack. */
  align?: React.CSSProperties['alignItems'];
  justify?: React.CSSProperties['justifyContent'];
  gap?: Space;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Box(props: BoxProps): JSX.Element;
