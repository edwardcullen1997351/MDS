import React, { forwardRef } from 'react';
import './Pagination.css';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {}

export const Pagination = forwardRef<HTMLElement, PaginationProps>(
  ({ children, className = '', ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="Pagination Navigation"
      className={`ds-pagination ${className}`}
      {...props}
    >
      {children}
    </nav>
  )
);
Pagination.displayName = 'Pagination';

export const PaginationContent = forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ children, className = '', ...props }, ref) => (
  <ul ref={ref} className={`ds-pagination-content ${className}`} {...props}>
    {children}
  </ul>
));
PaginationContent.displayName = 'PaginationContent';

export const PaginationItem = forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ children, className = '', ...props }, ref) => (
  <li ref={ref} className={`ds-pagination-item ${className}`} {...props}>
    {children}
  </li>
));
PaginationItem.displayName = 'PaginationItem';

export interface PaginationLinkProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

export const PaginationLink = forwardRef<HTMLButtonElement, PaginationLinkProps>(
  ({ isActive = false, children, className = '', ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-current={isActive ? 'page' : undefined}
      className={`ds-pagination-link ${
        isActive ? 'ds-pagination-link--active' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);
PaginationLink.displayName = 'PaginationLink';

export interface PaginationNavProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const PaginationPrevious = forwardRef<
  HTMLButtonElement,
  PaginationNavProps
>(({ children = '‹ Previous', className = '', ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label="Go to previous page"
    className={`ds-pagination-link ds-pagination-nav-button ${className}`}
    {...props}
  >
    {children}
  </button>
));
PaginationPrevious.displayName = 'PaginationPrevious';

export const PaginationNext = forwardRef<HTMLButtonElement, PaginationNavProps>(
  ({ children = 'Next ›', className = '', ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label="Go to next page"
      className={`ds-pagination-link ds-pagination-nav-button ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);
PaginationNext.displayName = 'PaginationNext';

export const PaginationEllipsis = forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className = '', ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={`ds-pagination-ellipsis ${className}`}
    {...props}
  >
    •••
  </span>
));
PaginationEllipsis.displayName = 'PaginationEllipsis';
