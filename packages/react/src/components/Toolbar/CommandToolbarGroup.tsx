import React, { useCallback, useEffect, useRef } from 'react';
import './CommandToolbarGroup.css';

export interface CommandToolbarGroupProps {
  /** Leftmost primary navigation/stepper controls (e.g. TimeHorizonStepper) */
  primaryControls?: React.ReactNode;
  /** Center view mode controls (e.g. SegmentedControl) */
  viewControls?: React.ReactNode;
  /** Secondary filter / search controls */
  filterControls?: React.ReactNode;
  /** Rightmost action buttons (e.g. Refresh, Dispatch, Settings) */
  actionControls?: React.ReactNode;
  /** Density variant: 'compact' (32px height for high-density ERP) | 'default' (36px height) */
  density?: 'compact' | 'default';
  /** Accessible label for the command toolbar */
  'aria-label'?: string;
  /** Optional custom CSS class name */
  className?: string;
  /** Optional children if raw layout is needed */
  children?: React.ReactNode;
}

export const CommandToolbarGroup: React.FC<CommandToolbarGroupProps> = ({
  primaryControls,
  viewControls,
  filterControls,
  actionControls,
  density = 'compact',
  'aria-label': ariaLabel = 'Workbench Command Toolbar',
  className = '',
  children,
}) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const activeControl = useRef<HTMLElement | null>(null);

  const getControls = useCallback(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return [];
    return Array.from(toolbar.querySelectorAll<HTMLElement>('button, [role="button"]'))
      .filter((control) => control.closest('[role="toolbar"]') === toolbar &&
        !control.matches(':disabled, [aria-disabled="true"]'));
  }, []);

  const syncTabStops = useCallback(() => {
    const controls = getControls();
    if (!activeControl.current || !controls.includes(activeControl.current)) {
      activeControl.current = controls[0] ?? null;
    }
    controls.forEach((control) => {
      const nextTabIndex = control === activeControl.current ? 0 : -1;
      if (control.tabIndex !== nextTabIndex) control.tabIndex = nextTabIndex;
    });
  }, [getControls]);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    if (!toolbar) return;
    syncTabStops();
    const observer = new MutationObserver(syncTabStops);
    observer.observe(toolbar, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'aria-disabled', 'tabindex'] });
    return () => observer.disconnect();
  }, [syncTabStops]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const controls = getControls();
    const index = controls.indexOf(event.target as HTMLElement);
    if (index < 0 || controls.length < 2) return;
    const rtl = window.getComputedStyle(event.currentTarget).direction === 'rtl';
    let next = index;
    if (event.key === 'ArrowRight') next = (index + (rtl ? -1 : 1) + controls.length) % controls.length;
    else if (event.key === 'ArrowLeft') next = (index + (rtl ? 1 : -1) + controls.length) % controls.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = controls.length - 1;
    else return;
    event.preventDefault();
    activeControl.current = controls[next];
    syncTabStops();
    controls[next].focus();
  };

  return (
    <div
      ref={toolbarRef}
      role="toolbar"
      aria-orientation="horizontal"
      aria-label={ariaLabel}
      onFocusCapture={(event) => {
        if (getControls().includes(event.target as HTMLElement)) {
          activeControl.current = event.target as HTMLElement;
          syncTabStops();
        }
      }}
      onKeyDown={handleKeyDown}
      className={`ds-command-toolbar ds-command-toolbar--${density} ${className}`}
    >
      {children ? (
        children
      ) : (
        <>
          <div className="ds-command-toolbar__section ds-command-toolbar__section--primary">
            {primaryControls}
            {primaryControls && viewControls && <div className="ds-command-toolbar__divider" aria-hidden="true" />}
            {viewControls}
          </div>

          {(filterControls || actionControls) && (
            <div className="ds-command-toolbar__section ds-command-toolbar__section--actions">
              {filterControls && (
                <div className="ds-command-toolbar__filters">{filterControls}</div>
              )}
              {filterControls && actionControls && <div className="ds-command-toolbar__divider" aria-hidden="true" />}
              {actionControls && (
                <div className="ds-command-toolbar__buttons">{actionControls}</div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
