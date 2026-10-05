import { HeadingLevelProvider } from '../Typography/Heading.js';
import React, { forwardRef } from 'react';
import './LayoutTemplates.css';

export type SidebarPosition = 'start' | 'end';

export interface SidebarLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sidebar track placement relative to main content */
  sidebarPosition?: SidebarPosition;
  /** Fixed/bounded width of the sidebar track */
  sidebarWidth?: string;
  /** Controlled collapse state held by the frame */
  isCollapsed?: boolean;
  /** Callback fired when collapse toggle is triggered */
  onToggleCollapse?: (collapsed: boolean) => void;
  /** Minimum usable width floor for the main region */
  minMainWidth?: string;
  /** Top header bar spanning the layout */
  header?: React.ReactNode;
  /** Contextual content held in the sidebar pane */
  sidebar?: React.ReactNode;
  /** Accessible label for the sidebar landmark */
  sidebarAriaLabel?: string;
  /** Accessible label for the main content landmark */
  mainAriaLabel?: string;
}

/**
 * SidebarLayout (§01–§14)
 * Keeps a narrower contextual region continuously beside a dominant flexible main workspace.
 * Manages track persistence, usable-width floor (minmax), and axis-aligned collapse motion.
 */
export const SidebarLayout = forwardRef<HTMLDivElement, SidebarLayoutProps>(
  (
    {
      children,
      sidebar,
      header,
      sidebarPosition = 'start',
      sidebarWidth = 'var(--layout-sidebar-track-w)',
      isCollapsed = false,
      onToggleCollapse: _onToggleCollapse,
      minMainWidth = 'var(--layout-sidebar-main-min-w)',
      sidebarAriaLabel = 'Sidebar context',
      mainAriaLabel = 'Main workspace',
      className = '',
      ...props
    },
    ref
  ) => {
    const gridTemplateColumns = isCollapsed
      ? '1fr'
      : sidebarPosition === 'start'
      ? `${sidebarWidth} minmax(${minMainWidth}, 1fr)`
      : `minmax(${minMainWidth}, 1fr) ${sidebarWidth}`;

    return (
      <HeadingLevelProvider>
      <div
        ref={ref}
        className={`ds-sidebar-layout ${className}`}
        {...props}
      >
        {header && (
          <header className="ds-sidebar-layout__header" aria-label="Page header">
            {header}
          </header>
        )}

        <div
          className="ds-sidebar-layout__body"
          style={{ gridTemplateColumns }}
        >
          {sidebarPosition === 'start' && (
            <aside
              className={`ds-sidebar-layout__sidebar ${
                isCollapsed ? 'ds-sidebar-layout__sidebar--collapsed' : ''
              }`}
              aria-label={sidebarAriaLabel}
            >
              {sidebar}
            </aside>
          )}

          <main
            className="ds-sidebar-layout__main"
            aria-label={mainAriaLabel}
          >
            {children}
          </main>

          {sidebarPosition === 'end' && (
            <aside
              className={`ds-sidebar-layout__sidebar ds-sidebar-layout__sidebar--end ${
                isCollapsed ? 'ds-sidebar-layout__sidebar--collapsed' : ''
              }`}
              aria-label={sidebarAriaLabel}
            >
              {sidebar}
            </aside>
          )}
        </div>
      </div>
      </HeadingLevelProvider>
    );
  }
);

SidebarLayout.displayName = 'SidebarLayout';
