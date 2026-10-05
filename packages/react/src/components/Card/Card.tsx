import React, { forwardRef } from 'react';
import { HeadingLevelProvider, useHeadingLevel } from '../Typography/Heading.js';
import './Card.css';

export type CardVariant = 'outline' | 'elevated' | 'sunken';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick' | 'onKeyDown'> {
  variant?: CardVariant;
  padding?: CardPadding;
  as?: 'div' | 'article' | 'section';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      as = 'div',
      variant = 'outline',
      padding = 'md',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const Component = as;
    const classNames = [
      'ds-card',
      `ds-card--${variant}`,
      `ds-card--padding-${padding}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={ref} className={classNames} {...props}>
        <HeadingLevelProvider level={2}>{children}</HeadingLevelProvider>
      </Component>
    );
  }
);
Card.displayName = 'Card';

export interface CardLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
}

/** A primary card link whose pseudo element covers the card without nesting secondary controls. */
export const CardLink = forwardRef<HTMLAnchorElement, CardLinkProps>(
  ({ className = '', children, ...props }, ref) => (
    <a ref={ref} className={`ds-card-link ${className}`} {...props}>{children}</a>
  )
);
CardLink.displayName = 'CardLink';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  action?: React.ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ action, children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`ds-card-header ${className}`} {...props}>
        <div className="ds-card-header-main">{children}</div>
        {action && <div className="ds-card-header-action">{action}</div>}
      </div>
    );
  }
);
CardHeader.displayName = 'CardHeader';

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ as, children, className = '', ...props }, ref) => {
    const HeadingTag = as ?? useHeadingLevel();
    const headingProps = { ref, className: `ds-card-title ${className}`, ...props };
    switch (HeadingTag) {
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
CardTitle.displayName = 'CardTitle';

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <p ref={ref} className={`ds-card-description ${className}`} {...props}>
        {children}
      </p>
    );
  }
);
CardDescription.displayName = 'CardDescription';

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`ds-card-content ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
CardContent.displayName = 'CardContent';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  divided?: boolean;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ divided = false, children, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`ds-card-footer ${divided ? 'ds-card-footer--divided' : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CardFooter.displayName = 'CardFooter';
