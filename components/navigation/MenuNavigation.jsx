import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';

/**
 * Menu Navigation — Transient Popover Navigation System.
 * Exposes on-demand destination menus with disclosure semantics and guaranteed focus restoration.
 */

export function MenuNavigation({
  trigger,
  items = [],
  activeId,
  placement = 'bottom-start',
  label = 'Quick Navigation',
  LinkComponent,
  onNavigate,
  className = '',
  style,
  ...rest
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const menuRef = React.useRef(null);

  // Normalize grouped vs flat items
  const normalizedGroups = React.useMemo(() => {
    if (!items.length) return [];
    if ('group' in items[0] || 'items' in items[0]) {
      return items;
    }
    return [{ group: null, items }];
  }, [items]);

  // Click outside listener
  React.useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        // Restore focus to trigger
        if (triggerRef.current) {
          triggerRef.current.focus();
        }
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleTriggerClick = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = (item, e) => {
    if (item.disabled) {
      e.preventDefault();
      return;
    }
    setIsOpen(false);
    if (onNavigate) {
      onNavigate(item, e);
    }
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  // Clone trigger with ref and aria attributes
  const triggerElement = React.isValidElement(trigger) ? (
    React.cloneElement(trigger, {
      ref: triggerRef,
      'aria-haspopup': 'true',
      'aria-expanded': isOpen,
      onClick: (e) => {
        if (trigger.props.onClick) trigger.props.onClick(e);
        handleTriggerClick(e);
      },
    })
  ) : (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="true"
      aria-expanded={isOpen}
      onClick={handleTriggerClick}
      style={{
        background: 'transparent',
        border: 'var(--border-hairline)',
        borderRadius: 'var(--radius-sm)',
        padding: '6px 10px',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-sans)',
        color: 'var(--text-primary)',
      }}
    >
      <span>{trigger || 'Menu'}</span>
      <Icon name="chevron-down" size={12} />
    </button>
  );

  const getPlacementStyle = () => {
    const isTop = placement.startsWith('top');
    const isEnd = placement.endsWith('end');
    return {
      position: 'absolute',
      top: isTop ? 'auto' : 'calc(100% + 4px)',
      bottom: isTop ? 'calc(100% + 4px)' : 'auto',
      left: isEnd ? 'auto' : 0,
      right: isEnd ? 0 : 'auto',
      zIndex: 'var(--z-index-drawer, 200)',
    };
  };

  return (
    <div
      ref={containerRef}
      className={`meridian-menu-nav-container ${className}`.trim()}
      style={{ position: 'relative', display: 'inline-block', ...style }}
      {...rest}
    >
      {triggerElement}

      {isOpen && (
        <div style={getPlacementStyle()}>
          <nav
            ref={menuRef}
            aria-label={label}
            className="meridian-menu-nav-surface"
            style={{
              background: 'var(--surface-card)',
              border: 'var(--border-hairline)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-md, 0 4px 16px rgba(0,0,0,0.1))',
              width: 240,
              minWidth: 200,
              maxWidth: 280,
              padding: '6px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              fontFamily: 'var(--font-sans)',
            }}
          >
            {normalizedGroups.map((grp, gIdx) => (
              <div key={grp.group || gIdx} style={{ display: 'flex', flexDirection: 'column' }}>
                {gIdx > 0 && (
                  <div
                    role="separator"
                    style={{
                      height: 1,
                      background: 'var(--border-subtle)',
                      margin: '4px 0',
                    }}
                  />
                )}
                {grp.group && (
                  <div
                    style={{
                      padding: '6px 12px 2px',
                      fontSize: 10,
                      fontFamily: 'var(--font-mono)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--tracking-caps)',
                      color: 'var(--text-tertiary)',
                      fontWeight: 'var(--weight-semibold)',
                    }}
                  >
                    {grp.group}
                  </div>
                )}
                <ul
                  role="list"
                  style={{
                    listStyle: 'none',
                    margin: 0,
                    padding: '0 4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  {grp.items.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <li key={item.id}>
                        <MenuNavItem
                          item={item}
                          isActive={isActive}
                          onClick={(e) => handleItemClick(item, e)}
                          LinkComponent={LinkComponent}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

function MenuNavItem({ item, isActive, onClick, LinkComponent }) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const isDisabled = item.disabled;

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 34,
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
    outlineOffset: -1,
    transition: 'background 100ms ease, color 100ms ease',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  const content = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
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
    onClick,
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
