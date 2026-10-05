import { HeadingLevelProvider } from '../Typography/Heading.js';
import React, { forwardRef } from 'react';
import './LayoutTemplates.css';

export type SingleColumnContentWidth = 'sm' | 'md' | 'lg' | 'full';
export type SingleColumnAlignment = 'centered' | 'start';
export type SingleColumnSectionSpacing = 'sm' | 'md' | 'lg';
export type SingleColumnActionsPlacement = 'flow' | 'anchored';

export interface SingleColumnLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width boundary of the central content column (§03 Properties) */
  contentWidth?: SingleColumnContentWidth;
  /** Alignment of the content column within the page container */
  alignment?: SingleColumnAlignment;
  /** Vertical rhythm applied between section blocks in region 3 */
  sectionSpacing?: SingleColumnSectionSpacing;
  /** Whether the action area sits inline in vertical flow or anchors to viewport footer */
  actionsPlacement?: SingleColumnActionsPlacement;
  /** Region 2: Optional page header (Breadcrumbs, title, summary) */
  header?: React.ReactNode;
  /** Region 4: Optional action bar (commit, save, cancel actions) */
  actions?: React.ReactNode;
  /** Region 5: Optional supplementary content in subordinate vertical flow */
  supplementary?: React.ReactNode;
  /** Landmark role for the main content area (defaults to 'main') */
  role?: string;
  /** Accessible landmark label */
  'aria-label'?: string;
}

/**
 * SingleColumnLayout (§01–§14)
 * Default enterprise frame for content whose hierarchy is a vertical reading or task sequence.
 * Enforces unified section rhythm, measure bounding, and optional anchored commit bar.
 */
export const SingleColumnLayout = forwardRef<HTMLDivElement, SingleColumnLayoutProps>(
  (
    {
      children,
      contentWidth = 'md',
      alignment = 'centered',
      sectionSpacing = 'md',
      actionsPlacement = 'flow',
      header,
      actions,
      supplementary,
      className = '',
      role = 'main',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    return (
      <HeadingLevelProvider>
      <div
        ref={ref}
        role={role}
        aria-label={ariaLabel}
        className={`ds-single-column ${className}`}
        {...props}
      >
        <div
          className={`ds-single-column__wrapper ds-single-column__wrapper--${contentWidth} ds-single-column__wrapper--${alignment}`}
        >
          {header && (
            <div className="ds-single-column__header">
              {header}
            </div>
          )}

          <div
            className={`ds-single-column__main ds-single-column__main--spacing-${sectionSpacing}`}
          >
            {children}
          </div>

          {actions && actionsPlacement === 'flow' && (
            <div className="ds-single-column__actions" aria-label="Page actions">
              {actions}
            </div>
          )}

          {supplementary && (
            <aside
              className="ds-single-column__supplementary"
              aria-label="Supplementary reference"
            >
              {supplementary}
            </aside>
          )}
        </div>

        {actions && actionsPlacement === 'anchored' && (
          <div
            className="ds-single-column__actions ds-single-column__actions--anchored"
            aria-label="Anchored actions"
          >
            <div
              className={`ds-single-column__wrapper ds-single-column__wrapper--${contentWidth} ds-single-column__wrapper--${alignment}`}
              style={{ padding: '0' }}
            >
              {actions}
            </div>
          </div>
        )}
      </div>
      </HeadingLevelProvider>
    );
  }
);

SingleColumnLayout.displayName = 'SingleColumnLayout';
