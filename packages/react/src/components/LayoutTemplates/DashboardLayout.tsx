import { Heading, HeadingLevelProvider } from '../Typography/Heading.js';
import React, { forwardRef } from 'react';
import './LayoutTemplates.css';

export type DashboardGap = 'sm' | 'md' | 'lg';

export interface DashboardLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Grid gap rhythm between cards (default 'md') */
  gap?: DashboardGap;
  /** High-density mode for operational telemetry */
  compactMode?: boolean;
  /** Global dashboard header (shared filter controls scoping all widgets) */
  header?: React.ReactNode;
  /** Dedicated top row for high-level KPI summary cards */
  kpiRow?: React.ReactNode;
}

export interface DashboardWidgetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Column span within 12-column grid system (1 to 12) */
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /** Widget title */
  title?: React.ReactNode;
  /** Header action controls local to this widget */
  actions?: React.ReactNode;
  /** Isolated loading state for this widget */
  isLoading?: boolean;
  /** Isolated error message for this widget */
  isError?: boolean;
  /** Error fallback message */
  errorMessage?: string;
}

/**
 * DashboardWidget
 * Card surface holding an independently meaningful module with local action scope.
 */
export const DashboardWidget = forwardRef<HTMLDivElement, DashboardWidgetProps>(
  (
    {
      children,
      title,
      actions,
      colSpan = 4,
      isLoading = false,
      isError = false,
      errorMessage = 'Failed to load telemetry',
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`ds-dashboard-widget ds-col-span-${colSpan} ${className}`}
        {...props}
      >
        {(title || actions) && (
          <div className="ds-dashboard-widget__header">
            {typeof title === 'string' ? (
              <Heading className="ds-dashboard-widget__title" size="base">{title}</Heading>
            ) : (
              title
            )}
            {actions && <div>{actions}</div>}
          </div>
        )}

        <div className="ds-dashboard-widget__body">
          {isLoading ? (
            <div role="status" aria-busy="true" aria-label="Loading dashboard module" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <div style={{ height: 'var(--space-5)', width: '40%', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)' }} />
              <div style={{ height: 'calc(var(--space-10) * 2)', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)' }} />
            </div>
          ) : isError ? (
            <div role="alert" style={{ padding: 'var(--space-4)', color: 'var(--text-critical)', fontSize: 'var(--text-sm)', background: 'var(--status-critical-soft, var(--surface-sunken))', borderRadius: 'var(--radius-md)' }}>
              {errorMessage}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    );
  }
);

DashboardWidget.displayName = 'DashboardWidget';

/**
 * DashboardLayout (§01–§14)
 * Simultaneous overview of several independently meaningful modules.
 * Scopes global controls via header, enforces strict document reflow order,
 * and maintains per-module query failure isolation.
 */
export const DashboardLayout = forwardRef<HTMLDivElement, DashboardLayoutProps>(
  (
    {
      children,
      header,
      kpiRow,
      gap: _gap = 'md',
      compactMode = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <HeadingLevelProvider>
      <div
        ref={ref}
        className={`ds-dashboard ${className}`}
        {...props}
      >
        {header && (
          <header className="ds-dashboard__header" aria-label="Dashboard controls">
            {header}
          </header>
        )}

        {kpiRow && (
          <section className="ds-dashboard__kpis" aria-label="Key performance indicators">
            {kpiRow}
          </section>
        )}

        <main
          className={`ds-dashboard__grid ${
            compactMode ? 'ds-dashboard__grid--compact' : ''
          }`}
          aria-label="Dashboard widgets"
        >
          {children}
        </main>
      </div>
      </HeadingLevelProvider>
    );
  }
);

DashboardLayout.displayName = 'DashboardLayout';
