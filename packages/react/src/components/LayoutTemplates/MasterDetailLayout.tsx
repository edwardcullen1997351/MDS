import { Heading, HeadingLevelProvider } from '../Typography/Heading.js';
import React, { forwardRef } from 'react';
import './LayoutTemplates.css';

export type MasterDetailLayoutState =
  | 'initial-empty'
  | 'item-selected'
  | 'detail-loading'
  | 'detail-error';

export type MasterDetailMobileView = 'master' | 'detail';

export interface MasterDetailLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width allocated to the master list track */
  masterWidth?: string;
  /** Current selected member identifier */
  selectedId?: string | number | null;
  /** Structural state of the layout */
  layoutState?: MasterDetailLayoutState;
  /** Mobile view toggle in responsive sequential form */
  mobileView?: MasterDetailMobileView;
  /** Callback fired when mobile view switches */
  onMobileViewChange?: (view: MasterDetailMobileView) => void;
  /** Callback fired to clear selection */
  onClearSelection?: () => void;
  /** Master collection / queue region */
  master?: React.ReactNode;
  /** Member detail inspection/editing region */
  detail?: React.ReactNode;
  /** Custom empty state when nothing is selected */
  emptyState?: React.ReactNode;
  /** Custom loading skeleton state */
  loadingState?: React.ReactNode;
  /** Custom error state */
  errorState?: React.ReactNode;
  /** Default empty state title */
  emptyTitle?: string;
  /** Default empty state description */
  emptyDescription?: string;
}

/**
 * MasterDetailLayout (§01–§14)
 * A collection held beside the one member currently being worked.
 * Strictly maintains one-directional selection dependency, independent position/scroll ownership,
 * and 4 structural layout states (empty, selected, loading, error).
 */
export const MasterDetailLayout = forwardRef<HTMLDivElement, MasterDetailLayoutProps>(
  (
    {
      master,
      detail,
      emptyState,
      loadingState,
      errorState,
      masterWidth = 'var(--layout-master-detail-track-w)',
      selectedId = null,
      layoutState: customLayoutState,
      mobileView = selectedId ? 'detail' : 'master',
      onMobileViewChange: _onMobileViewChange,
      onClearSelection: _onClearSelection,
      emptyTitle = 'No item selected',
      emptyDescription = 'Select an item from the master list to inspect and edit details.',
      className = '',
      ...props
    },
    ref
  ) => {
    // Determine effective layout state
    const layoutState: MasterDetailLayoutState =
      customLayoutState || (selectedId ? 'item-selected' : 'initial-empty');

    const gridTemplateColumns = `${masterWidth} minmax(0, 1fr)`;

    return (
      <HeadingLevelProvider>
      <div
        ref={ref}
        className={`ds-master-detail ${className}`}
        style={{ gridTemplateColumns }}
        {...props}
      >
        <section
          className={`ds-master-detail__master ${
            mobileView !== 'master' ? 'ds-master-detail__master--hidden' : ''
          }`}
          aria-label="Master list"
        >
          {master}
        </section>

        <section
          className={`ds-master-detail__detail ${
            mobileView !== 'detail' ? 'ds-master-detail__detail--hidden' : ''
          }`}
          aria-label="Detail inspector"
        >
          {layoutState === 'detail-loading' && (
            loadingState || (
              <div style={{ padding: 'var(--space-8)' }}>
                <div style={{ height: 'var(--space-8)', width: '60%', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)' }} />
                <div style={{ height: 'var(--layout-master-detail-skeleton-short-h)', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)', marginBottom: 'var(--space-4)' }} />
                <div style={{ height: 'var(--layout-master-detail-skeleton-tall-h)', background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)' }} />
              </div>
            )
          )}

          {layoutState === 'detail-error' && (
            errorState || (
              <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                <Heading size="lg" style={{ color: 'var(--status-critical-text)', fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)' }}>Failed to load detail</Heading>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)' }}>Unable to retrieve member record from the plant server.</p>
              </div>
            )
          )}

          {layoutState === 'initial-empty' && (
            emptyState || (
              <div className="ds-master-detail__empty">
                <div
                  style={{
                    width: 'var(--space-12)',
                    height: 'var(--space-12)',
                    borderRadius: '50%',
                    background: 'var(--surface-sunken)',
                    margin: '0 auto var(--space-4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: 'var(--text-xl)',
                  }}
                >
                  📋
                </div>
                <Heading size="base" style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', margin: '0 0 calc(var(--space-1) + var(--space-half))' }}>
                  {emptyTitle}
                </Heading>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0, lineHeight: 'var(--leading-normal)' }}>
                  {emptyDescription}
                </p>
              </div>
            )
          )}

          {layoutState === 'item-selected' && detail}
        </section>
      </div>
      </HeadingLevelProvider>
    );
  }
);

MasterDetailLayout.displayName = 'MasterDetailLayout';
