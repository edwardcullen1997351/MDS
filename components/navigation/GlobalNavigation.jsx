import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';

/**
 * Global Navigation — L1 Information Architecture wayfinding system.
 * Provides persistent access to the highest-level operational domains across the application.
 */

const DENSITY_HEIGHTS = {
  compact: 'var(--control-h-sm, 32px)',
  comfortable: 'var(--control-h-md, 40px)',
  expanded: 'var(--control-h-lg, 48px)',
};

export function GlobalNavigation({
  items = [],
  activeId,
  variant = 'sidebar',
  collapsed = false,
  onCollapseChange,
  density = 'comfortable',
  plantContext = { company: 'Suryodaya Autocomp', plant: 'PL-04', location: 'Chakan, Pune' },
  userProfile,
  LinkComponent,
  onNavigate,
  label = 'Primary Navigation',
  skipTarget = 'main-content',
  headerSlot,
  footerSlot,
  style,
  className = '',
  ...rest
}) {
  const [internalCollapsed, setInternalCollapsed] = React.useState(collapsed);
  const isCollapsed = onCollapseChange ? collapsed : internalCollapsed;

  const handleToggleCollapse = () => {
    const next = !isCollapsed;
    if (onCollapseChange) {
      onCollapseChange(next);
    } else {
      setInternalCollapsed(next);
    }
  };

  const isRail = variant === 'rail' || isCollapsed;
  const isTopbar = variant === 'topbar';
  const rowHeight = DENSITY_HEIGHTS[density] || DENSITY_HEIGHTS.comfortable;

  // Base container styles
  const containerStyle = {
    display: 'flex',
    flexDirection: isTopbar ? 'row' : 'column',
    width: isTopbar ? '100%' : isRail ? 60 : 250,
    height: isTopbar ? 'auto' : '100%',
    minHeight: isTopbar ? 52 : '100vh',
    background: 'var(--surface-card)',
    borderRight: isTopbar ? 'none' : 'var(--border-hairline)',
    borderBottom: isTopbar ? 'var(--border-hairline)' : 'none',
    boxShadow: 'var(--shadow-xs)',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
    position: 'relative',
    transition: 'width 180ms cubic-bezier(0.2, 0, 0, 1)',
    flexShrink: 0,
    boxSizing: 'border-box',
    ...style,
  };

  return (
    <nav
      aria-label={label}
      className={`meridian-global-nav ${isRail ? 'meridian-nav-rail' : ''} ${isTopbar ? 'meridian-nav-topbar' : ''} ${className}`.trim()}
      style={containerStyle}
      {...rest}
    >
      {/* Off-screen Skip Navigation Link */}
      <a
        href={`#${skipTarget}`}
        className="meridian-skip-link"
        style={{
          position: 'absolute',
          top: -999,
          left: -999,
          padding: '6px 12px',
          background: 'var(--action-solid)',
          color: '#ffffff',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          borderRadius: 'var(--radius-sm)',
          zIndex: 9999,
          textDecoration: 'none',
        }}
        onFocus={(e) => {
          e.target.style.top = '8px';
          e.target.style.left = '8px';
        }}
        onBlur={(e) => {
          e.target.style.top = '-999px';
          e.target.style.left = '-999px';
        }}
      >
        Skip to main content
      </a>

      {/* Brand / Plant Header */}
      {headerSlot ? (
        headerSlot
      ) : (
        <div
          style={{
            padding: isRail ? '12px 0' : '14px 16px',
            borderBottom: isTopbar ? 'none' : 'var(--border-hairline)',
            borderRight: isTopbar ? 'var(--border-hairline)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isRail ? 'center' : 'flex-start',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--radius-xs)',
              background: 'var(--action-solid)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'var(--weight-semibold)',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              flexShrink: 0,
            }}
          >
            {plantContext.company ? plantContext.company.charAt(0) : 'M'}
          </div>
          {!isRail && (
            <div style={{ overflow: 'hidden', minWidth: 0 }}>
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--weight-semibold)',
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {plantContext.company}
              </div>
              <div
                style={{
                  fontSize: 'var(--text-2xs)',
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-mono)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {plantContext.plant} · {plantContext.location}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Primary Destination Navigation List */}
      <ul
        role="list"
        style={{
          listStyle: 'none',
          margin: 0,
          padding: isRail ? '10px 6px' : isTopbar ? '6px 12px' : '10px 8px',
          display: 'flex',
          flexDirection: isTopbar ? 'row' : 'column',
          gap: 2,
          flex: 1,
          overflowY: isTopbar ? 'visible' : 'auto',
          overflowX: isTopbar ? 'auto' : 'hidden',
        }}
      >
        {items.map((item) => {
          const isActive = activeId === item.id;
          const isDisabled = item.disabled;

          const itemContent = (
            <NavItem
              item={item}
              isActive={isActive}
              isDisabled={isDisabled}
              isRail={isRail}
              isTopbar={isTopbar}
              rowHeight={rowHeight}
              onNavigate={onNavigate}
              LinkComponent={LinkComponent}
            />
          );

          return <li key={item.id}>{itemContent}</li>;
        })}
      </ul>

      {/* Utility / User Profile Footer */}
      {!isTopbar && (
        <div
          style={{
            padding: isRail ? '10px 0' : '12px 14px',
            borderTop: 'var(--border-hairline)',
            background: 'var(--background-page)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            alignItems: isRail ? 'center' : 'stretch',
          }}
        >
          {footerSlot ? (
            footerSlot
          ) : userProfile ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                justifyContent: isRail ? 'center' : 'flex-start',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--surface-sunken)',
                  border: 'var(--border-hairline)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 'var(--weight-medium)',
                  flexShrink: 0,
                }}
              >
                {userProfile.name ? userProfile.name.charAt(0) : 'U'}
              </div>
              {!isRail && (
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div
                    style={{
                      fontSize: 'var(--text-2xs)',
                      fontWeight: 'var(--weight-medium)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {userProfile.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--text-tertiary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {userProfile.role}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Collapse Toggle Trigger */}
          {variant !== 'rail' && (
            <button
              type="button"
              onClick={handleToggleCollapse}
              aria-label={isRail ? 'Expand navigation' : 'Collapse navigation'}
              title={isRail ? 'Expand navigation' : 'Collapse navigation'}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '4px 6px',
                borderRadius: 'var(--radius-xs)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isRail ? 'center' : 'flex-start',
                gap: 6,
                color: 'var(--text-tertiary)',
                fontSize: 'var(--text-2xs)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <Icon name={isRail ? 'panel-left-open' : 'panel-left-close'} size={14} />
              {!isRail && <span>Collapse</span>}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

function NavItem({ item, isActive, isDisabled, isRail, isTopbar, rowHeight, onNavigate, LinkComponent }) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);

  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    if (onNavigate) {
      onNavigate(item, e);
    }
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isRail ? 'center' : 'space-between',
    minHeight: rowHeight,
    padding: isRail ? '6px' : '0 10px',
    borderRadius: 'var(--radius-sm)',
    color: isDisabled
      ? 'var(--text-disabled, rgba(0,0,0,0.3))'
      : isActive
      ? 'var(--text-link)'
      : hover
      ? 'var(--text-primary)'
      : 'var(--text-secondary)',
    background: isActive
      ? 'var(--status-info-soft)'
      : hover && !isDisabled
      ? 'var(--surface-sunken)'
      : 'transparent',
    fontWeight: isActive ? 'var(--weight-medium)' : 'var(--weight-regular)',
    fontSize: 'var(--text-xs)',
    textDecoration: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    outline: focus ? '2px solid var(--action-solid)' : 'none',
    outlineOffset: 1,
    transition: 'background 120ms ease, color 120ms ease',
    position: 'relative',
    whiteSpace: 'nowrap',
  };

  const content = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        {item.icon ? (
          <Icon
            name={item.icon}
            size={16}
            style={{
              color: isActive ? 'var(--action-solid)' : 'currentColor',
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 'var(--radius-full)',
              background: isActive ? 'var(--action-solid)' : 'currentColor',
              flexShrink: 0,
            }}
          />
        )}
        {!isRail && (
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: 'var(--tracking-body)',
            }}
          >
            {item.label}
          </span>
        )}
      </div>

      {!isRail && item.badge !== undefined && item.badge !== null && (
        <span style={{ marginLeft: 8, flexShrink: 0 }}>
          <Badge
            size="sm"
            tone={isActive ? 'info' : 'neutral'}
            count={typeof item.badge === 'number' ? item.badge : undefined}
          >
            {typeof item.badge === 'string' ? item.badge : undefined}
          </Badge>
        </span>
      )}
    </>
  );

  const sharedProps = {
    href: item.href || '#',
    'aria-current': isActive ? 'page' : undefined,
    'aria-disabled': isDisabled ? 'true' : undefined,
    title: isDisabled ? item.disabledReason || item.label : isRail ? item.label : undefined,
    style: itemStyle,
    onClick: handleClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: (e) => setFocus(e.target.matches(':focus-visible')),
    onBlur: () => setFocus(false),
  };

  if (LinkComponent) {
    const CustomLink = LinkComponent;
    return <CustomLink {...sharedProps}>{content}</CustomLink>;
  }

  return <a {...sharedProps}>{content}</a>;
}
