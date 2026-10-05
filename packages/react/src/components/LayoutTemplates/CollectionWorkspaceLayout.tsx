import { Heading, HeadingLevelProvider } from '../Typography/Heading.js';
import React, { forwardRef } from 'react';
import './LayoutTemplates.css';

export type CollectionWorkspaceLayoutState =
  | 'idle'
  | 'loading'
  | 'empty'
  | 'no-matches'
  | 'error';

export interface CollectionWorkspaceLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of items currently selected (triggers conditional non-displacing bulk action bar) */
  selectedCount?: number;
  /** Whether the pagination footer sticks to viewport bottom */
  isStickyFooter?: boolean;
  /** Structural state of the collection */
  layoutState?: CollectionWorkspaceLayoutState;
  /** Region 1: Scope header (page title, breadcrumbs, summary KPIs) */
  scopeHeader?: React.ReactNode;
  /** Region 2: Dedicated 3-tiered action/filter toolbar */
  toolbar?: React.ReactNode;
  /** Conditional bulk action bar rendered when selectedCount > 0 */
  selectionBar?: React.ReactNode;
  /** Slide-over filter drawer / panel */
  filterDrawer?: React.ReactNode;
  /** Whether the filter drawer is expanded */
  isDrawerFilterOpen?: boolean;
  /** Region 4: Bottom status & pagination footer */
  footer?: React.ReactNode;
  /** Custom empty state */
  emptyState?: React.ReactNode;
  /** Custom no-matches search state */
  noMatchesState?: React.ReactNode;
  /** Custom error state */
  errorState?: React.ReactNode;
}

/**
 * CollectionWorkspaceLayout (§01–§14)
 * Standardized full-screen workspace framing a single large collection.
 * Integrates 3-tiered control scoping (collection, refinement, batch action),
 * identity-preserved selection, and sticky status pagination.
 */
export const CollectionWorkspaceLayout = forwardRef<HTMLDivElement, CollectionWorkspaceLayoutProps>(
  (
    {
      children,
      scopeHeader,
      toolbar,
      selectionBar,
      filterDrawer,
      footer,
      emptyState,
      noMatchesState,
      errorState,
      selectedCount = 0,
      isStickyFooter = true,
      layoutState = 'idle',
      isDrawerFilterOpen = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <HeadingLevelProvider>
      <div
        ref={ref}
        className={`ds-collection-workspace ${className}`}
        {...props}
      >
        {scopeHeader && (
          <header className="ds-collection-workspace__scope-header" aria-label="Collection scope">
            {scopeHeader}
          </header>
        )}

        {toolbar && (
          <section aria-label="Collection controls">
          <div className="ds-collection-workspace__toolbar" role="toolbar" aria-label="Collection toolbar">
            {toolbar}
          </div>
          </section>
        )}

        {selectedCount > 0 && selectionBar && (
          <div
            className="ds-collection-workspace__selection-bar"
            role="region"
            aria-label="Batch actions"
          >
            {selectionBar}
          </div>
        )}

        <main className="ds-collection-workspace__content" aria-label="Collection data">
          {layoutState === 'loading' && (
            <div style={{ padding: 'var(--space-8)' }}>
              <div style={{ height: 'var(--control-h-lg)', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-3)' }} />
              <div style={{ height: 'var(--control-h-lg)', background: 'var(--background-page)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-2)' }} />
              <div style={{ height: 'var(--control-h-lg)', background: 'var(--background-page)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-2)' }} />
              <div style={{ height: 'var(--control-h-lg)', background: 'var(--background-page)', borderRadius: 'var(--radius-sm)' }} />
            </div>
          )}

          {layoutState === 'empty' && (
            emptyState || (
              <div style={{ padding: 'var(--space-16) var(--space-6)', textAlign: 'center' }}>
                <Heading size="base" style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>No items in this collection</Heading>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Create a new item to get started.</p>
              </div>
            )
          )}

          {layoutState === 'no-matches' && (
            noMatchesState || (
              <div style={{ padding: 'var(--space-16) var(--space-6)', textAlign: 'center' }}>
                <Heading size="base" style={{ fontSize: 'var(--text-lg)', fontWeight: 600, color: 'var(--text-primary)' }}>No matching records found</Heading>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>Try clearing filters or changing search keywords.</p>
              </div>
            )
          )}

          {layoutState === 'error' && (
            errorState || (
              <div style={{ padding: 'var(--space-12) var(--space-6)', textAlign: 'center', color: 'var(--status-critical-text)' }}>
                <Heading size="base" style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Failed to load collection</Heading>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>The connection to the plant data server timed out.</p>
              </div>
            )
          )}

          {layoutState === 'idle' && children}
        </main>

        {filterDrawer && isDrawerFilterOpen && (
          <aside
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'var(--drawer-width-sm)',
              background: 'var(--surface-card)',
              borderLeft: 'var(--border-hairline-subtle)',
              boxShadow: 'var(--drawer-shadow)',
              zIndex: 50,
              padding: 'var(--space-6)',
              overflowY: 'auto',
            }}
            aria-label="Filter panel"
          >
            {filterDrawer}
          </aside>
        )}

        {footer && (
          <footer
            className={`ds-collection-workspace__footer ${
              isStickyFooter ? 'ds-collection-workspace__footer--sticky' : ''
            }`}
            aria-label="Collection pagination and status"
          >
            {footer}
          </footer>
        )}
      </div>
      </HeadingLevelProvider>
    );
  }
);

CollectionWorkspaceLayout.displayName = 'CollectionWorkspaceLayout';
