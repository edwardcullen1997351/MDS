import React, { forwardRef } from 'react';
import './Layout.css';

export type AspectRatioPreset = '16/9' | '4/3' | '1/1' | '21/9' | '3/2';

export interface AspectRatioProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  ratio?: number | AspectRatioPreset;
}

const presetRatioMap: Record<AspectRatioPreset, string> = {
  '16/9': '16 / 9',
  '4/3': '4 / 3',
  '1/1': '1 / 1',
  '21/9': '21 / 9',
  '3/2': '3 / 2',
};

export const AspectRatio = forwardRef<HTMLElement, AspectRatioProps>(
  (
    {
      as = 'div',
      ratio = '16/9',
      children,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const Component = as;

    const computedRatio =
      typeof ratio === 'string' && ratio in presetRatioMap
        ? presetRatioMap[ratio as AspectRatioPreset]
        : String(ratio);

    const computedStyle: React.CSSProperties = {
      ...style,
      aspectRatio: computedRatio,
    };

    return (
      <Component
        ref={ref}
        className={`ds-aspect-ratio ${className}`}
        style={computedStyle}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';
