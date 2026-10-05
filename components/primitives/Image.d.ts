import * as React from 'react';

/**
 * Raster media with reserved space, a fit rule and a striped fallback.
 * Never renders a broken-image glyph.
 */
export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'style' | 'width' | 'height'> {
  src?: string;
  /** Required unless the image is decorative, in which case pass alt="". */
  alt?: string;
  /** Wraps the image in an AspectRatio so layout never shifts. */
  ratio?: 'square' | 'video' | 'wide' | 'photo' | 'portrait' | number | string;
  fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  position?: string;
  radius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'pill';
  background?: string;
  /** 'lazy' by default; use 'eager' only above the fold. */
  loading?: 'lazy' | 'eager';
  /** Caption shown in the striped placeholder when src is missing or fails. */
  placeholder?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}
export declare function Image(props: ImageProps): JSX.Element;
