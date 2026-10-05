import { HeadingLevelProvider } from '../Typography/Heading.js';
import React, { forwardRef } from 'react';
import './LayoutTemplates.css';

export interface HolyGrailLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width of the left navigation track */
  navWidth?: string;
  /** Width of the right utility track */
  utilityWidth?: string;
  /** Collapsed state of navigation track */
  isNavCollapsed?: boolean;
  /** Collapsed state of right utility track */
  isUtilityCollapsed?: boolean;
  /** Usable width floor for center work region */
  centerMinWidth?: string;
  /** Top banner or application shell header */
  header?: React.ReactNode;
  /** Left navigation region (nav landmark) */
  navigation?: React.ReactNode;
  /** Right contextual utility drawer / region (complementary landmark) */
  utility?: React.ReactNode;
  /** Application or screen footer */
  footer?: React.ReactNode;
  /** Skip link text for keyboard accessibility */
  skipLinkText?: string;
}

/**
 * HolyGrailLayout (§01–§14)
 * Dominant center region between two lateral regions with independent purposes (Nav & Utility).
 * Features cascading responsive collapse, accessible landmark bypass link, and independent scroll tracks.
 */
export const HolyGrailLayout = forwardRef<HTMLDivElement, HolyGrailLayoutProps>(
  (
    {
      children,
      header,
      navigation,
      utility,
      footer,
      navWidth = 'var(--layout-holy-grail-nav-w)',
      utilityWidth = 'var(--layout-holy-grail-utility-w)',
      isNavCollapsed = false,
      isUtilityCollapsed = false,
      centerMinWidth = 'var(--layout-holy-grail-center-min-w)',
      skipLinkText = 'Skip to main content',
      className = '',
      ...props
    },
    ref
  ) => {
    // Determine dynamic grid tracks based on active visible panes
    // Prevents collapsed display:none panes from shifting center main content into a 0px track
    const tracks: string[] = [];
    if (!isNavCollapsed) {
      tracks.push(navWidth);
    }
    tracks.push(isNavCollapsed && isUtilityCollapsed ? '1fr' : `minmax(${centerMinWidth}, 1fr)`);
    if (!isUtilityCollapsed) {
      tracks.push(utilityWidth);
    }
    const gridTemplateColumns = tracks.join(' ');

    return (
      <HeadingLevelProvider>
      <div
        ref={ref}
        className={`ds-holy-grail ${className}`}
        {...props}
      >
        {header && (
          <header className="ds-holy-grail__header" aria-label="Application header">
            {header}
          </header>
        )}

        <div
          className="ds-holy-grail__body"
          style={{ gridTemplateColumns }}
        >
          <nav
            className={`ds-holy-grail__nav ${
              isNavCollapsed ? 'ds-holy-grail__nav--collapsed' : ''
            }`}
            aria-label="Application navigation"
          >
            {navigation}
          </nav>

          <main
            id="ds-main-content"
            className="ds-holy-grail__main"
            aria-label="Main work canvas"
          >
            <a href="#ds-main-content" className="ds-sr-only">
              {skipLinkText}
            </a>
            {children}
          </main>

          <aside
            className={`ds-holy-grail__utility ${
              isUtilityCollapsed ? 'ds-holy-grail__utility--collapsed' : ''
            }`}
            aria-label="Utility panel"
          >
            {utility}
          </aside>
        </div>

        {footer && (
          <footer className="ds-holy-grail__footer" aria-label="Application footer">
            {footer}
          </footer>
        )}
      </div>
      </HeadingLevelProvider>
    );
  }
);

HolyGrailLayout.displayName = 'HolyGrailLayout';
