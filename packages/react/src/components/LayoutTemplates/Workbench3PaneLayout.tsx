import { HeadingLevelProvider } from '../Typography/Heading.js';
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- ARIA separator splitters implement pointer and keyboard resizing */
import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import './LayoutTemplates.css';

export interface Workbench3PaneLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Top workspace header bar (Entity selector, global actions, user info) */
  workspaceHeader?: React.ReactNode;
  /** Left navigation / time-horizon / hierarchy tree pane */
  navPane?: React.ReactNode;
  /** Center primary work surface (matrix, table, execution grid) */
  mainPane?: React.ReactNode;
  /** Right contextual inspector / detail / reschedule pane */
  inspectorPane?: React.ReactNode;

  /** Desktop collapsed state for left nav */
  navCollapsed?: boolean;
  /** Desktop collapsed state for right inspector */
  inspectorCollapsed?: boolean;
  /** Callback fired when left nav collapse state changes via mid-screen or edge toggle */
  onNavCollapsedChange?: (collapsed: boolean) => void;
  /** Callback fired when right inspector collapse state changes via mid-screen or edge toggle */
  onInspectorCollapsedChange?: (collapsed: boolean) => void;
  /** Whether to render the mid-screen edge toggle handles (default: true) */
  showEdgeToggles?: boolean;

  /** Whether user draggable resizing is enabled between panes on desktop (default: true) */
  enableResize?: boolean;
  /** Minimum width for the left navigation pane when dragging in px (default: 200) */
  navMinWidth?: number;
  /** Maximum width for the left navigation pane when dragging in px (default: 480) */
  navMaxWidth?: number;
  /** Minimum width for the right inspector pane when dragging in px (default: 280) */
  inspectorMinWidth?: number;
  /** Maximum width for the right inspector pane when dragging in px (default: 560) */
  inspectorMaxWidth?: number;
  /** Callback fired when left nav pane width changes via splitter drag */
  onNavWidthChange?: (width: number) => void;
  /** Callback fired when right inspector pane width changes via splitter drag */
  onInspectorWidthChange?: (width: number) => void;

  /** Mobile layout mode: 'tabs' (NotebookLM top-tabbed navigation) or 'drawer' (overlay drawers). Default: 'tabs' */
  mobileMode?: 'tabs' | 'drawer';
  /** Let the page own vertical scrolling when the responsive tab layout is active. */
  pageScrollOnTabs?: boolean;
  /** Currently active pane in mobile top-tabbed mode ('nav' | 'main' | 'inspector') */
  activeMobileTab?: 'nav' | 'main' | 'inspector';
  /** Callback fired when the active mobile tab changes */
  onMobileTabChange?: (tab: 'nav' | 'main' | 'inspector') => void;
  /** Optional custom tab labels for mobile tab navigation */
  mobileNavTabLabel?: React.ReactNode;
  mobileMainTabLabel?: React.ReactNode;
  mobileInspectorTabLabel?: React.ReactNode;

  /** Mobile/Tablet off-canvas open state for left nav */
  isNavOpen?: boolean;
  /** Callback fired when left nav open state changes */
  onNavOpenChange?: (open: boolean) => void;

  /** Mobile/Tablet bottom-sheet open state for right inspector */
  isInspectorOpen?: boolean;
  /** Callback fired when right inspector open state changes */
  onInspectorOpenChange?: (open: boolean) => void;

  /** Accessible label for left nav landmark */
  navLabel?: string;
  /** Accessible label for central main landmark */
  mainLabel?: string;
  /** Accessible label for right inspector landmark */
  inspectorLabel?: string;

  /** Optional custom CSS grid track width for nav (default: minmax(240px, 18vw)) */
  navWidth?: string;
  /** Optional custom CSS grid track width for inspector (default: minmax(360px, 24vw)) */
  inspectorWidth?: string;
}

/**
 * Workbench3PaneLayout (§01–§14)
 * High-density manufacturing & planning workspace with 3 coordinated panes:
 * - Left: Navigation / Time-horizon / Plant hierarchy
 * - Center: Primary time-phased grid or work surface
 * - Right: Contextual record inspector or allocation drawer
 * Supports desktop collapsible tracks, interactive draggable splitters, and
 * responsive NotebookLM-style top-tabbed navigation at <= 1024px or 200% zoom.
 */
export const Workbench3PaneLayout = forwardRef<HTMLDivElement, Workbench3PaneLayoutProps>(
  (
    {
      workspaceHeader,
      navPane,
      mainPane,
      inspectorPane,
      navCollapsed = false,
      inspectorCollapsed = false,
      onNavCollapsedChange: _onNavCollapsedChange,
      onInspectorCollapsedChange: _onInspectorCollapsedChange,
      showEdgeToggles: _showEdgeToggles = true,
      enableResize = true,
      navMinWidth = 200,
      navMaxWidth = 480,
      inspectorMinWidth = 280,
      inspectorMaxWidth = 560,
      onNavWidthChange,
      onInspectorWidthChange,
      mobileMode = 'tabs',
      pageScrollOnTabs = false,
      activeMobileTab,
      onMobileTabChange,
      mobileNavTabLabel,
      mobileMainTabLabel,
      mobileInspectorTabLabel,
      isNavOpen = false,
      onNavOpenChange,
      isInspectorOpen = false,
      onInspectorOpenChange,
      navLabel = 'Planning Navigation',
      mainLabel = 'Planning Matrix Work Surface',
      inspectorLabel = 'Record Inspector',
      navWidth,
      inspectorWidth,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const bodyRef = useRef<HTMLDivElement | null>(null);

    // Draggable Splitter State
    const [navWidthPx, setNavWidthPx] = useState<number | null>(null);
    const [inspectorWidthPx, setInspectorWidthPx] = useState<number | null>(null);
    const [isDraggingNav, setIsDraggingNav] = useState(false);
    const [isDraggingInspector, setIsDraggingInspector] = useState(false);

    // Mobile Tab State
    const [mobileTabState, setMobileTabState] = useState(() => ({
      activeMobileTab,
      isNavOpen,
      isInspectorOpen,
      tab: isNavOpen
        ? 'nav' as const
        : isInspectorOpen
          ? 'inspector' as const
          : activeMobileTab ?? 'main',
    }));
    if (
      mobileTabState.activeMobileTab !== activeMobileTab ||
      mobileTabState.isNavOpen !== isNavOpen ||
      mobileTabState.isInspectorOpen !== isInspectorOpen
    ) {
      let tab = mobileTabState.tab;
      if (mobileTabState.activeMobileTab !== activeMobileTab && activeMobileTab !== undefined) {
        tab = activeMobileTab;
      }
      if (mobileTabState.isNavOpen !== isNavOpen || mobileTabState.isInspectorOpen !== isInspectorOpen) {
        if (isNavOpen) {
          tab = 'nav';
        } else if (isInspectorOpen) {
          tab = 'inspector';
        }
      }
      setMobileTabState({ activeMobileTab, isNavOpen, isInspectorOpen, tab });
    }

    const isControlled = activeMobileTab !== undefined && onMobileTabChange !== undefined;
    const resolvedMobileTab: 'nav' | 'main' | 'inspector' = isControlled
      ? activeMobileTab
      : mobileTabState.tab;

    const handleSelectMobileTab = useCallback(
      (tab: 'nav' | 'main' | 'inspector') => {
        setMobileTabState((previous) => ({ ...previous, tab }));
        onMobileTabChange?.(tab);
        if (tab === 'nav') {
          onNavOpenChange?.(true);
          onInspectorOpenChange?.(false);
        } else if (tab === 'inspector') {
          onInspectorOpenChange?.(true);
          onNavOpenChange?.(false);
        } else {
          onNavOpenChange?.(false);
          onInspectorOpenChange?.(false);
        }
      },
      [onMobileTabChange, onNavOpenChange, onInspectorOpenChange]
    );

    // Handle Escape key to close mobile overlays or return to main tab
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (isNavOpen && onNavOpenChange) {
            onNavOpenChange(false);
          }
          if (isInspectorOpen && onInspectorOpenChange) {
            onInspectorOpenChange(false);
          }
          if (resolvedMobileTab !== 'main') {
            handleSelectMobileTab('main');
          }
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isNavOpen, isInspectorOpen, onNavOpenChange, onInspectorOpenChange, resolvedMobileTab, handleSelectMobileTab]);

    // Nav Splitter Drag Handlers
    const handleNavPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      setIsDraggingNav(true);
    };

    const handleNavPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingNav || !bodyRef.current) return;
      const rect = bodyRef.current.getBoundingClientRect();
      const newWidth = Math.round(Math.max(navMinWidth, Math.min(navMaxWidth, e.clientX - rect.left)));
      setNavWidthPx(newWidth);
      onNavWidthChange?.(newWidth);
    };

    const handleNavPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (isDraggingNav) {
        setIsDraggingNav(false);
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {}
      }
    };

    const handleNavDoubleClick = () => {
      setNavWidthPx(null);
      onNavWidthChange?.(280);
    };

    const handleNavKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const current = navWidthPx || 280;
      if (e.key === 'ArrowLeft') {
        const next = Math.max(navMinWidth, current - 16);
        setNavWidthPx(next);
        onNavWidthChange?.(next);
      } else if (e.key === 'ArrowRight') {
        const next = Math.min(navMaxWidth, current + 16);
        setNavWidthPx(next);
        onNavWidthChange?.(next);
      } else if (e.key === 'Home') {
        setNavWidthPx(navMinWidth);
        onNavWidthChange?.(navMinWidth);
      } else if (e.key === 'End') {
        setNavWidthPx(navMaxWidth);
        onNavWidthChange?.(navMaxWidth);
      }
    };

    // Inspector Splitter Drag Handlers
    const handleInspectorPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      setIsDraggingInspector(true);
    };

    const handleInspectorPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingInspector || !bodyRef.current) return;
      const rect = bodyRef.current.getBoundingClientRect();
      const newWidth = Math.round(Math.max(inspectorMinWidth, Math.min(inspectorMaxWidth, rect.right - e.clientX)));
      setInspectorWidthPx(newWidth);
      onInspectorWidthChange?.(newWidth);
    };

    const handleInspectorPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
      if (isDraggingInspector) {
        setIsDraggingInspector(false);
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {}
      }
    };

    const handleInspectorDoubleClick = () => {
      setInspectorWidthPx(null);
      onInspectorWidthChange?.(360);
    };

    const handleInspectorKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const current = inspectorWidthPx || 360;
      if (e.key === 'ArrowRight') {
        const next = Math.max(inspectorMinWidth, current - 16);
        setInspectorWidthPx(next);
        onInspectorWidthChange?.(next);
      } else if (e.key === 'ArrowLeft') {
        const next = Math.min(inspectorMaxWidth, current + 16);
        setInspectorWidthPx(next);
        onInspectorWidthChange?.(next);
      } else if (e.key === 'Home') {
        setInspectorWidthPx(inspectorMinWidth);
        onInspectorWidthChange?.(inspectorMinWidth);
      } else if (e.key === 'End') {
        setInspectorWidthPx(inspectorMaxWidth);
        onInspectorWidthChange?.(inspectorMaxWidth);
      }
    };

    const bodyModifierClass = [
      navCollapsed && inspectorCollapsed
        ? 'ds-workbench-3pane__body--both-collapsed'
        : navCollapsed
        ? 'ds-workbench-3pane__body--nav-collapsed'
        : inspectorCollapsed
        ? 'ds-workbench-3pane__body--inspector-collapsed'
        : '',
    ]
      .filter(Boolean)
      .join(' ');

    const resolvedNavWidth = navWidthPx ? `${navWidthPx}px` : navWidth;
    const resolvedInspectorWidth = inspectorWidthPx ? `${inspectorWidthPx}px` : inspectorWidth;

    const customStyles: React.CSSProperties = {
      ...style,
      ...(resolvedNavWidth ? { '--ds-wb-nav-width': resolvedNavWidth } : {}),
      ...(resolvedInspectorWidth ? { '--ds-wb-inspector-width': resolvedInspectorWidth } : {}),
    } as React.CSSProperties;

    return (
      <HeadingLevelProvider>
      <div
        ref={ref}
        className={`ds-workbench-3pane ds-workbench-3pane--mobile-${mobileMode} ${pageScrollOnTabs && mobileMode === 'tabs' ? 'ds-workbench-3pane--tab-page-scroll' : ''} ${className}`}
        style={customStyles}
        {...props}
      >
        {workspaceHeader && (
          <header className="ds-workbench-3pane__header" aria-label="Workbench header">
            {workspaceHeader}
          </header>
        )}

        {/* Mobile Top-Tabbed Navigation Bar (NotebookLM style, visible <= 1024px) */}
        {mobileMode === 'tabs' && (
          <div
            className="ds-workbench-mobile-tabs"
            role="tablist"
            aria-label="Workspace views"
          >
            {navPane && (
              <button
                type="button"
                role="tab"
                id="ds-tab-nav"
                aria-selected={resolvedMobileTab === 'nav'}
                aria-controls="ds-panel-nav"
                className={`ds-workbench-mobile-tab ${resolvedMobileTab === 'nav' ? 'ds-workbench-mobile-tab--active' : ''}`}
                onClick={() => handleSelectMobileTab('nav')}
              >
                {mobileNavTabLabel || (
                  <>
                    <span className="ds-workbench-mobile-tab__icon" aria-hidden="true">☰</span>
                    <span className="ds-workbench-mobile-tab__text">Resources</span>
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              role="tab"
              id="ds-tab-main"
              aria-selected={resolvedMobileTab === 'main'}
              aria-controls="ds-panel-main"
              className={`ds-workbench-mobile-tab ${resolvedMobileTab === 'main' ? 'ds-workbench-mobile-tab--active' : ''}`}
              onClick={() => handleSelectMobileTab('main')}
            >
              {mobileMainTabLabel || (
                <>
                  <span className="ds-workbench-mobile-tab__icon" aria-hidden="true">📊</span>
                  <span className="ds-workbench-mobile-tab__text">Schedule</span>
                </>
              )}
            </button>

            {inspectorPane && (
              <button
                type="button"
                role="tab"
                id="ds-tab-inspector"
                aria-selected={resolvedMobileTab === 'inspector'}
                aria-controls="ds-panel-inspector"
                className={`ds-workbench-mobile-tab ${resolvedMobileTab === 'inspector' ? 'ds-workbench-mobile-tab--active' : ''}`}
                onClick={() => handleSelectMobileTab('inspector')}
              >
                {mobileInspectorTabLabel || (
                  <>
                    <span className="ds-workbench-mobile-tab__icon" aria-hidden="true">📋</span>
                    <span className="ds-workbench-mobile-tab__text">Inspector</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        <div
          ref={bodyRef}
          className={`ds-workbench-3pane__body ${bodyModifierClass} ds-workbench-3pane__body--tab-${resolvedMobileTab} ${
            isDraggingNav || isDraggingInspector ? 'ds-workbench-3pane__body--resizing' : ''
          }`}
        >
          {/* Left Navigation Pane */}
          {navPane && (
            <>
              <nav
                className={`ds-workbench-3pane__nav ${isNavOpen ? 'ds-workbench-3pane__nav--open' : ''}`}
                aria-label={navLabel}
                aria-hidden={navCollapsed && !isNavOpen}
              >
                <div id="ds-panel-nav" role={mobileMode === 'tabs' ? 'tabpanel' : undefined} aria-labelledby={mobileMode === 'tabs' ? 'ds-tab-nav' : undefined} className="ds-workbench-3pane__nav-content">
                  {navPane}
                </div>
              </nav>

              {/* Draggable Splitter between Nav and Main Pane (Desktop) */}
              {enableResize && !navCollapsed && (
                <div className="ds-workbench-splitter-region" role="region" aria-label="Navigation resize control">
                <div
                  role="separator"
                  tabIndex={0}
                  aria-orientation="vertical"
                  aria-label="Resize Horizon & Resources Panel"
                  aria-valuenow={navWidthPx || 280}
                  aria-valuemin={navMinWidth}
                  aria-valuemax={navMaxWidth}
                  className={`ds-workbench-splitter ds-workbench-splitter--nav ${
                    isDraggingNav ? 'ds-workbench-splitter--dragging' : ''
                  }`}
                  onPointerDown={handleNavPointerDown}
                  onPointerMove={handleNavPointerMove}
                  onPointerUp={handleNavPointerUp}
                  onPointerCancel={handleNavPointerUp}
                  onDoubleClick={handleNavDoubleClick}
                  onKeyDown={handleNavKeyDown}
                  title="Drag to resize panel · Double-click to reset"
                />
                </div>
              )}

              {mobileMode === 'drawer' && isNavOpen && (
                <div
                  className="ds-workbench-3pane__backdrop"
                  onClick={() => onNavOpenChange?.(false)}
                  aria-hidden="true"
                />
              )}
            </>
          )}

          {/* Central Main Work Surface */}
          <main
            className="ds-workbench-3pane__center"
            aria-label={mainLabel}
          >
            {/* §GB-3a: Authoritative center scroll track — consumer content
                must NOT set their own overflow on their root div */}
            <div id="ds-panel-main" role={mobileMode === 'tabs' ? 'tabpanel' : undefined} aria-labelledby={mobileMode === 'tabs' ? 'ds-tab-main' : undefined} className="ds-workbench-3pane__center-content">
              {mainPane}
            </div>
          </main>

          {/* Right Contextual Inspector Pane */}
          {inspectorPane && (
            <>
              {/* Draggable Splitter between Main and Inspector Pane (Desktop) */}
              {enableResize && !inspectorCollapsed && (
                <div className="ds-workbench-splitter-region" role="region" aria-label="Inspector resize control">
                <div
                  role="separator"
                  tabIndex={0}
                  aria-orientation="vertical"
                  aria-label="Resize Record Inspector Panel"
                  aria-valuenow={inspectorWidthPx || 360}
                  aria-valuemin={inspectorMinWidth}
                  aria-valuemax={inspectorMaxWidth}
                  className={`ds-workbench-splitter ds-workbench-splitter--inspector ${
                    isDraggingInspector ? 'ds-workbench-splitter--dragging' : ''
                  }`}
                  onPointerDown={handleInspectorPointerDown}
                  onPointerMove={handleInspectorPointerMove}
                  onPointerUp={handleInspectorPointerUp}
                  onPointerCancel={handleInspectorPointerUp}
                  onDoubleClick={handleInspectorDoubleClick}
                  onKeyDown={handleInspectorKeyDown}
                  title="Drag to resize inspector · Double-click to reset"
                />
                </div>
              )}

              <aside
                className={`ds-workbench-3pane__inspector ${
                  isInspectorOpen ? 'ds-workbench-3pane__inspector--open' : ''
                }`}
                aria-label={inspectorLabel}
                aria-hidden={inspectorCollapsed && !isInspectorOpen}
              >
                <div id="ds-panel-inspector" role={mobileMode === 'tabs' ? 'tabpanel' : undefined} aria-labelledby={mobileMode === 'tabs' ? 'ds-tab-inspector' : undefined} className="ds-workbench-3pane__inspector-content">
                  {inspectorPane}
                </div>
              </aside>

              {mobileMode === 'drawer' && isInspectorOpen && (
                <div
                  className="ds-workbench-3pane__backdrop"
                  onClick={() => onInspectorOpenChange?.(false)}
                  aria-hidden="true"
                />
              )}
            </>
          )}
        </div>
      </div>
      </HeadingLevelProvider>
    );
  }
);

Workbench3PaneLayout.displayName = 'Workbench3PaneLayout';
