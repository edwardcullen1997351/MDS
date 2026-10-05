import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';

/**
 * Local Navigation — L2 Information Architecture wayfinding system.
 * Provides structured navigation among workspaces belonging to the active module.
 */

const DENSITY_HEIGHTS = {
  compact: 'var(--control-h-sm, 32px)',
  comfortable: '36px',
  expanded: 'var(--control-h-lg, 48px)',
};

export function LocalNavigation({
  items = [],
  activeId,
  title,
  variant = 'grouped',
  density = 'comfortable',
  LinkComponent,
  onNavigate,
  label,
  headerSlot,
  footerSlot,
  style,
  className = '',
  ...rest
}) {
  const [expandedGroups, setExpandedGroups] = React.useState({});

  const toggleGroup = (groupName) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: prev[groupName] !== undefined ? !prev[groupName] : false,
    }));
  };

  const rowHeight = DENSITY_HEIGHTS[density] || DENSITY_HEIGHTS.comfortable;
  const isGrouped = variant === 'grouped' || variant === 'accordion';
  const isAccordion = variant === 'accordion';

  // Normalize items into groups if array has groups or flat items
  const normalizedGroups = React.useMemo(() => {
    if (!items.length) return [];
    if ('group' in items[0] || 'items' in items[0]) {
      return items;
    }
    return [{ group: null, items }];
  }, [items]);

  const navLabel = label || (title ? `${title} Navigation` : 'Local Navigation');

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: 230,
    minWidth: 200,
    maxWidth: 280,
    background: 'var(--surface-card)',
    borderRight: 'var(--border-hairline)',
    boxShadow: 'var(--shadow-xs)',
    fontFamily: 'var(--font-sans)',
    color: 'var(--text-primary)',
    padding: '8px 0',
    flexShrink: 0,
    boxSizing: 'border-box',
    ...style,
  };

  return (
    <nav
      aria-label={navLabel}
      className={`meridian-local-nav ${className}`.trim()}
      style={containerStyle}
      {...rest}
    >
      {/* Module Title Header */}
      {headerSlot ? (
        headerSlot
      ) : title ? (
        <div
          style={{
            padding: '6px 14px 10px',
            borderBottom: 'var(--border-subtle)',
            marginBottom: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 'var(--weight-semibold)',
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: '9px',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              letterSpacing: 'var(--tracking-caps)',
            }}
          >
            L2 Nav
          </span>
        </div>
      ) : null}

      {/* Destination Groups List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {normalizedGroups.map((grp, grpIdx) => {
          const isGroupExpanded = isAccordion
            ? expandedGroups[grp.group] !== false
            : true;

          return (
            <div key={grp.group || grpIdx} style={{ display: 'flex', flexDirection: 'column' }}>
              {grp.group && (
                <div
                  role={isAccordion ? 'button' : undefined}
                  tabIndex={isAccordion ? 0 : undefined}
                  aria-expanded={isAccordion ? isGroupExpanded : undefined}
                  onClick={isAccordion ? () => toggleGroup(grp.group) : undefined}
                  onKeyDown={
                    isAccordion
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleGroup(grp.group);
                          }
                        }
                      : undefined
                  }
                  style={{
                    padding: '6px 14px 4px',
                    fontSize: '10px',
                    fontFamily: 'var(--font-mono)',
                    textTransform: 'uppercase',
                    letterSpacing: 'var(--tracking-caps)',
                    color: 'var(--text-tertiary)',
                    fontWeight: 'var(--weight-semibold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: isAccordion ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                >
                  <span>{grp.group}</span>
                  {isAccordion && (
                    <Icon
                      name={isGroupExpanded ? 'chevron-down' : 'chevron-right'}
                      size={12}
                      style={{ color: 'var(--text-tertiary)' }}
                    />
                  )}
                </div>
              )}

              {isGroupExpanded && (
                <ul
                  role="list"
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: '0 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  {grp.items.map((item) => {
                    const isActive = activeId === item.id;
                    const isDisabled = item.disabled;

                    return (
                      <li key={item.id}>
                        <LocalNavItem
                          item={item}
                          isActive={isActive}
                          isDisabled={isDisabled}
                          rowHeight={rowHeight}
                          onNavigate={onNavigate}
                          LinkComponent={LinkComponent}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {footerSlot && (
        <div
          style={{
            padding: '8px 12px',
            borderTop: 'var(--border-hairline)',
            marginTop: 8,
          }}
        >
          {footerSlot}
        </div>
      )}
    </nav>
  );
}

function LocalNavItem({ item, isActive, isDisabled, rowHeight, onNavigate, LinkComponent }) {
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
    justifyContent: 'space-between',
    minHeight: rowHeight,
    padding: '0 8px',
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
    whiteSpace: 'nowrap',
  };

  const content = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        {item.icon && (
          <Icon
            name={item.icon}
            size={14}
            style={{
              color: isActive ? 'var(--action-solid)' : 'currentColor',
              flexShrink: 0,
            }}
          />
        )}
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: 'var(--tracking-body)',
          }}
        >
          {item.label}
        </span>
      </div>

      {item.badge !== undefined && item.badge !== null && (
        <span style={{ marginLeft: 6, flexShrink: 0 }}>
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
    title: isDisabled ? item.disabledReason || item.label : undefined,
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
