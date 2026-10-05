import { HeadingLevelProvider } from '../Typography/Heading.js';
import React, { forwardRef } from 'react';
import './LayoutTemplates.css';

export type SplitViewRatio = '50/50' | '60/40' | '70/30' | '40/60' | '30/70';
export type SplitViewOrientation = 'horizontal' | 'vertical';
export type SplitViewPane = 'primary' | 'secondary';

export interface SplitViewLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Relative space ratio allocated to primary vs secondary pane */
  ratio?: SplitViewRatio;
  /** Layout orientation */
  orientation?: SplitViewOrientation;
  /** Active pane in narrow/sequential fallback mode */
  activePane?: SplitViewPane;
  /** Callback fired when switching active pane in responsive mode */
  onActivePaneChange?: (pane: SplitViewPane) => void;
  /** Accessible title for primary pane */
  primaryLabel?: string;
  /** Accessible title for secondary pane */
  secondaryLabel?: string;
  /** Top workspace header bar */
  workspaceHeader?: React.ReactNode;
  /** Primary work surface content */
  primaryPane?: React.ReactNode;
  /** Secondary work surface content */
  secondaryPane?: React.ReactNode;
}

/**
 * SplitViewLayout (§01–§14)
 * Two substantial work surfaces held side-by-side in one workspace.
 * Manages declared ratios (50/50, 60/40, 70/30), independent scroll boundaries,
 * and responsive conversion to sequential tabs when space is constrained.
 */
export const SplitViewLayout = forwardRef<HTMLDivElement, SplitViewLayoutProps>(
  (
    {
      ratio = '50/50',
      orientation = 'horizontal',
      activePane = 'primary',
      onActivePaneChange,
      primaryLabel = 'Primary Pane',
      secondaryLabel = 'Secondary Pane',
      workspaceHeader,
      primaryPane,
      secondaryPane,
      className = '',
      ...props
    },
    ref
  ) => {
    // Derive grid tracks from ratio
    const ratioMap: Record<SplitViewRatio, string> = {
      '50/50': '1fr 1fr',
      '60/40': '1.5fr 1fr',
      '70/30': '2.33fr 1fr',
      '40/60': '1fr 1.5fr',
      '30/70': '1fr 2.33fr',
    };

    const gridTemplateColumns =
      orientation === 'horizontal' ? ratioMap[ratio] : '1fr';
    const gridTemplateRows =
      orientation === 'vertical' ? ratioMap[ratio] : '1fr';

    return (
      <HeadingLevelProvider>
      <div
        ref={ref}
        className={`ds-split-view ${className}`}
        {...props}
      >
        {workspaceHeader && (
          <header className="ds-split-view__header" aria-label="Workspace header">
            {workspaceHeader}
          </header>
        )}

        {/* Responsive Sequential Tab Bar (visible on narrow screens) */}
        <div className="ds-split-view__tabs" role="tablist" aria-label="Split view panes">
          <button
            type="button"
            role="tab"
            aria-selected={activePane === 'primary'}
            onClick={() => onActivePaneChange?.('primary')}
            style={{
              padding: 'calc(var(--space-1) + var(--space-half)) calc(var(--space-3) + var(--space-half))',
              borderRadius: 'var(--radius-md)',
              border: activePane === 'primary' ? 'var(--border-width) solid var(--action-solid)' : 'var(--border-width) solid var(--border-default)',
              background: activePane === 'primary' ? 'var(--surface-selected)' : 'var(--surface-card)',
              color: activePane === 'primary' ? 'var(--action-text)' : 'var(--text-secondary)',
              fontWeight: 'var(--weight-semibold)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
            }}
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activePane === 'secondary'}
            onClick={() => onActivePaneChange?.('secondary')}
            style={{
              padding: 'calc(var(--space-1) + var(--space-half)) calc(var(--space-3) + var(--space-half))',
              borderRadius: 'var(--radius-md)',
              border: activePane === 'secondary' ? 'var(--border-width) solid var(--action-solid)' : 'var(--border-width) solid var(--border-default)',
              background: activePane === 'secondary' ? 'var(--surface-selected)' : 'var(--surface-card)',
              color: activePane === 'secondary' ? 'var(--action-text)' : 'var(--text-secondary)',
              fontWeight: 'var(--weight-semibold)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
            }}
          >
            {secondaryLabel}
          </button>
        </div>

        <div
          className="ds-split-view__panes"
          style={{ gridTemplateColumns, gridTemplateRows }}
        >
          <section
            className={`ds-split-view__pane ds-split-view__pane--primary ${
              activePane !== 'primary' ? 'ds-split-view__pane--hidden' : ''
            }`}
            aria-label={primaryLabel}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- independently scrolling pane
            tabIndex={0}
          >
            {React.isValidElement(primaryPane)
              ? React.cloneElement(primaryPane as React.ReactElement<any>, {
                  tabIndex: (primaryPane.props as any).tabIndex ?? 0,
                  role: (primaryPane.props as any).role ?? 'region',
                  'aria-label': (primaryPane.props as any)['aria-label'] ?? `${primaryLabel} content`,
                })
              : primaryPane}
          </section>

          <section
            className={`ds-split-view__pane ds-split-view__pane--secondary ${
              activePane !== 'secondary' ? 'ds-split-view__pane--hidden' : ''
            }`}
            aria-label={secondaryLabel}
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- independently scrolling pane
            tabIndex={0}
          >
            {React.isValidElement(secondaryPane)
              ? React.cloneElement(secondaryPane as React.ReactElement<any>, {
                  tabIndex: (secondaryPane.props as any).tabIndex ?? 0,
                  role: (secondaryPane.props as any).role ?? 'region',
                  'aria-label': (secondaryPane.props as any)['aria-label'] ?? `${secondaryLabel} content`,
                })
              : secondaryPane}
          </section>
        </div>
      </div>
      </HeadingLevelProvider>
    );
  }
);

SplitViewLayout.displayName = 'SplitViewLayout';
