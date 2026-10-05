import React, { forwardRef } from 'react';
import './Skeleton.css';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(
  (
    {
      variant = 'text',
      animation = 'wave',
      width,
      height,
      count = 1,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const classNames = [
      'ds-skeleton',
      `ds-skeleton--${variant}`,
      animation !== 'none' ? `ds-skeleton--${animation}` : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const computedStyle: React.CSSProperties = {
      ...style,
      width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
      height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    };

    if (count > 1) {
      return (
        <div className="ds-skeleton-group" role="status" aria-busy="true" aria-live="polite">
          {Array.from({ length: count }).map((_, index) => (
            <span
              key={index}
              className={classNames}
              style={{
                ...computedStyle,
                width: index === count - 1 && variant === 'text' && !width ? '70%' : computedStyle.width,
              }}
              {...props}
            />
          ))}
          <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            Loading content...
          </span>
        </div>
      );
    }

    return (
      <span
        ref={ref}
        className={classNames}
        style={computedStyle}
        role="status"
        aria-busy="true"
        aria-live="polite"
        {...props}
      >
        <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          Loading content...
        </span>
      </span>
    );
  }
);

Skeleton.displayName = 'Skeleton';
