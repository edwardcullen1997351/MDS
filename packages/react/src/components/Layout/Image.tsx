import React, { forwardRef, useState } from 'react';
import { SurfaceRadius } from './Surface.js';
import { AspectRatioPreset } from './AspectRatio.js';
import './Layout.css';

export type ImageFit = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fit?: ImageFit;
  position?: string;
  radius?: SurfaceRadius;
  aspectRatio?: number | AspectRatioPreset;
  fallbackSrc?: string;
}

const presetRatioMap: Record<AspectRatioPreset, string> = {
  '16/9': '16 / 9',
  '4/3': '4 / 3',
  '1/1': '1 / 1',
  '21/9': '21 / 9',
  '3/2': '3 / 2',
};

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      fit = 'cover',
      position = 'center',
      radius = 'none',
      aspectRatio,
      fallbackSrc,
      loading = 'lazy',
      decoding = 'async',
      className = '',
      style,
      onError,
      ...props
    },
    ref
  ) => {
    const [currentSrc, setCurrentSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      if (!hasError && fallbackSrc) {
        setHasError(true);
        setCurrentSrc(fallbackSrc);
      }
      onError?.(e);
    };

    const computedRatio =
      aspectRatio !== undefined
        ? typeof aspectRatio === 'string' && aspectRatio in presetRatioMap
          ? presetRatioMap[aspectRatio as AspectRatioPreset]
          : String(aspectRatio)
        : undefined;

    const classNames = [
      'ds-image',
      `ds-image--fit-${fit}`,
      `ds-image--radius-${radius}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const computedStyle: React.CSSProperties = {
      ...style,
      objectPosition: position,
      ...(computedRatio ? { aspectRatio: computedRatio } : {}),
    };

    return (
      <img
        ref={ref}
        src={currentSrc}
        alt={alt}
        loading={loading}
        decoding={decoding}
        className={classNames}
        style={computedStyle}
        onError={handleError}
        {...props}
      />
    );
  }
);

Image.displayName = 'Image';
