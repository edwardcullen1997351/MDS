import React, { forwardRef } from 'react';
import './Breadcrumb.css';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  separator?: React.ReactNode;
}

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ children, className = '', ...props }, ref) => {
    const hasList = React.Children.toArray(children).some(
      child => React.isValidElement(child) && child.type === BreadcrumbList
    );
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={`ds-breadcrumb ${className}`}
        {...props}
      >
        {hasList ? children : <BreadcrumbList>{children}</BreadcrumbList>}
      </nav>
    );
  }
);
Breadcrumb.displayName = 'Breadcrumb';

export const BreadcrumbList = forwardRef<
  HTMLOListElement,
  React.OlHTMLAttributes<HTMLOListElement>
>(({ children, className = '', ...props }, ref) => (
  <ol ref={ref} className={`ds-breadcrumb-list ${className}`} {...props}>
    {children}
  </ol>
));
BreadcrumbList.displayName = 'BreadcrumbList';

export const BreadcrumbItem = forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ children, className = '', ...props }, ref) => (
  <li ref={ref} className={`ds-breadcrumb-item ${className}`} {...props}>
    {children}
  </li>
));
BreadcrumbItem.displayName = 'BreadcrumbItem';

export interface BreadcrumbLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  as?: React.ElementType;
}

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ as = 'a', children, className = '', ...props }, ref) => {
    const Component = as;
    return (
      <Component
        ref={ref}
        className={`ds-breadcrumb-link ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
BreadcrumbLink.displayName = 'BreadcrumbLink';

export const BreadcrumbPage = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ children, className = '', ...props }, ref) => (
  <span
    ref={ref}
    aria-current="page"
    className={`ds-breadcrumb-page ${className}`}
    {...props}
  >
    {children}
  </span>
));
BreadcrumbPage.displayName = 'BreadcrumbPage';

const ChevronRightIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export interface BreadcrumbSeparatorProps
  extends React.LiHTMLAttributes<HTMLLIElement> {}

export const BreadcrumbSeparator = forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ children, className = '', ...props }, ref) => (
  <li
    ref={ref}
    aria-hidden="true"
    className={`ds-breadcrumb-separator ${className}`}
    {...props}
  >
    {children ?? <ChevronRightIcon />}
  </li>
));
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export const BreadcrumbEllipsis = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className = '', ...props }, ref) => (
  <span
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={`ds-breadcrumb-ellipsis ${className}`}
    {...props}
  >
    •••
  </span>
));
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis';
