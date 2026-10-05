import React, { forwardRef } from 'react';
import { Heading } from '../Typography/Heading.js';
import './EmptyState.css';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  size?: EmptyStateSize;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon,
      title,
      description,
      primaryAction,
      secondaryAction,
      size = 'md',
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const classNames = [
      'ds-empty-state',
      `ds-empty-state--size-${size}`,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classNames} {...props}>
        {icon && (
          <div className="ds-empty-state-icon" aria-hidden="true">
            {icon}
          </div>
        )}
        <Heading className="ds-empty-state-title" size="lg">{title}</Heading>
        {description && (
          <p className="ds-empty-state-description">{description}</p>
        )}
        {children}
        {(primaryAction || secondaryAction) && (
          <div className="ds-empty-state-actions">
            {secondaryAction}
            {primaryAction}
          </div>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
