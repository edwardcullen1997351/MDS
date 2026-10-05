import React, { createContext, forwardRef, useContext } from 'react';
import './Typography.css';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingSize = '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'base';
export type HeadingWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type TypographyColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'inverse';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  size?: HeadingSize;
  weight?: HeadingWeight;
  color?: TypographyColor;
  truncate?: boolean;
}

const HeadingLevelContext = createContext(1);

export const useHeadingLevel = (): HeadingLevel => `h${useContext(HeadingLevelContext)}` as HeadingLevel;

export interface HeadingLevelProviderProps {
  children: React.ReactNode;
  /** Set an absolute level for a template root, or omit to advance one level. */
  level?: number;
}

export const HeadingLevelProvider: React.FC<HeadingLevelProviderProps> = ({ children, level }) => {
  const parentLevel = useContext(HeadingLevelContext);
  return <HeadingLevelContext.Provider value={Math.max(1, Math.min(6, level ?? parentLevel + 1))}>{children}</HeadingLevelContext.Provider>;
};

const defaultSizeMap: Record<HeadingLevel, HeadingSize> = {
  h1: '4xl',
  h2: '3xl',
  h3: '2xl',
  h4: 'xl',
  h5: 'lg',
  h6: 'base',
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  (
    {
      children,
      as,
      size,
      weight = 'semibold',
      color = 'primary',
      truncate = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const contextLevel = useHeadingLevel();
    const Component: HeadingLevel = as ?? contextLevel;
    const computedSize = size || defaultSizeMap[Component];

    const classNames = [
      'ds-heading',
      `ds-heading--${computedSize}`,
      `ds-weight-${weight}`,
      `ds-color-${color}`,
      truncate ? 'ds-truncate' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const headingProps = { ref, className: classNames, ...props };
    switch (Component) {
      case 'h1':
        return <h1 {...headingProps}>{children}</h1>;
      case 'h2':
        return <h2 {...headingProps}>{children}</h2>;
      case 'h3':
        return <h3 {...headingProps}>{children}</h3>;
      case 'h4':
        return <h4 {...headingProps}>{children}</h4>;
      case 'h5':
        return <h5 {...headingProps}>{children}</h5>;
      case 'h6':
        return <h6 {...headingProps}>{children}</h6>;
    }
  }
);

Heading.displayName = 'Heading';
