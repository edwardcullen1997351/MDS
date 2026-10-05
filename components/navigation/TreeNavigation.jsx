import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Badge } from '../core/Badge.jsx';

/**
 * Tree Navigation — Recursive Hierarchy Navigation System.
 * Navigates a deeply nested hierarchy while expanding/collapsing branches in place.
 */

const DENSITY_HEIGHTS = {
  compact: '28px',
  comfortable: '34px',
  expanded: '42px',
};

// Helper to build a parent lookup map for auto-expansion
function buildParentMap(nodes, parentMap = {}, parentId = null) {
  for (const node of nodes) {
    if (parentId) {
      parentMap[node.id] = parentId;
    }
    if (node.children && node.children.length > 0) {
      buildParentMap(node.children, parentMap, node.id);
    }
  }
  return parentMap;
}

// Helper to find all ancestor IDs for a given active ID
function getAncestorIds(activeId, parentMap) {
  const ancestors = [];
  let curr = parentMap[activeId];
  while (curr) {
    ancestors.push(curr);
    curr = parentMap[curr];
  }
  return ancestors;
}

export function TreeNavigation({
  data = [],
  activeId,
  expandedIds,
  onExpandedChange,
  onSelectNode,
  autoExpandActive = true,
  density = 'comfortable',
  label = 'Hierarchy Tree',
  LinkComponent,
  headerSlot,
  footerSlot,
  style,
  className = '',
  ...rest
}) {
  const [internalExpanded, setInternalExpanded] = React.useState({});
  const parentMap = React.useMemo(() => buildParentMap(data), [data]);

  // Auto-expand ancestors of activeId
  React.useEffect(() => {
    if (autoExpandActive && activeId) {
      const ancestors = getAncestorIds(activeId, parentMap);
      if (ancestors.length > 0) {
        if (onExpandedChange && expandedIds) {
          const newSet = new Set([...expandedIds, ...ancestors]);
          onExpandedChange(Array.from(newSet));
        } else {
          setInternalExpanded((prev) => {
            const next = { ...prev };
            for (const id of ancestors) {
              next[id] = true;
            }
            return next;
          });
        }
      }
    }
  }, [activeId, autoExpandActive, parentMap]);

  const isNodeExpanded = (nodeId) => {
    if (expandedIds !== undefined) {
      return expandedIds.includes(nodeId);
    }
    return !!internalExpanded[nodeId];
  };

  const handleToggleExpand = (nodeId, e) => {
    e.stopPropagation();
    if (onExpandedChange && expandedIds !== undefined) {
      const isExp = expandedIds.includes(nodeId);
      const next = isExp ? expandedIds.filter((id) => id !== nodeId) : [...expandedIds, nodeId];
      onExpandedChange(next);
    } else {
      setInternalExpanded((prev) => ({
        ...prev,
        [nodeId]: !prev[nodeId],
      }));
    }
  };

  const rowHeight = DENSITY_HEIGHTS[density] || DENSITY_HEIGHTS.comfortable;

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    width: 260,
    minWidth: 220,
    maxWidth: 320,
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

  const renderNodes = (nodes, level = 1) => {
    return nodes.map((node, index) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = isNodeExpanded(node.id);
      const isActive = activeId === node.id;
      const isDisabled = node.disabled;

      return (
        <div key={node.id} style={{ display: 'flex', flexDirection: 'column' }}>
          <TreeNodeItem
            node={node}
            level={level}
            posInSet={index + 1}
            setSize={nodes.length}
            hasChildren={hasChildren}
            isExpanded={isExpanded}
            isActive={isActive}
            isDisabled={isDisabled}
            rowHeight={rowHeight}
            onToggleExpand={(e) => handleToggleExpand(node.id, e)}
            onSelectNode={onSelectNode}
            LinkComponent={LinkComponent}
          />

          {hasChildren && isExpanded && (
            <div role="group" style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {renderNodes(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <nav
      aria-label={label}
      className={`meridian-tree-nav ${className}`.trim()}
      style={containerStyle}
      {...rest}
    >
      {headerSlot && <div style={{ padding: '4px 12px 8px' }}>{headerSlot}</div>}
      <div
        role="tree"
        aria-label={label}
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          padding: '0 4px',
        }}
      >
        {renderNodes(data)}
      </div>
      {footerSlot && <div style={{ padding: '8px 12px', borderTop: 'var(--border-hairline)' }}>{footerSlot}</div>}
    </nav>
  );
}

function TreeNodeItem({
  node,
  level,
  posInSet,
  setSize,
  hasChildren,
  isExpanded,
  isActive,
  isDisabled,
  rowHeight,
  onToggleExpand,
  onSelectNode,
  LinkComponent,
}) {
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);

  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    if (onSelectNode) {
      onSelectNode(node, e);
    }
  };

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: rowHeight,
    paddingLeft: (level - 1) * 14 + 4,
    paddingRight: 8,
    borderRadius: 'var(--radius-xs)',
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
    transition: 'background 100ms ease, color 100ms ease',
    whiteSpace: 'nowrap',
    userSelect: 'none',
  };

  const content = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, minWidth: 0 }}>
        {hasChildren ? (
          <button
            type="button"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            onClick={onToggleExpand}
            style={{
              width: 16,
              height: 16,
              background: 'transparent',
              border: 'none',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-tertiary)',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Icon name={isExpanded ? 'chevron-down' : 'chevron-right'} size={12} />
          </button>
        ) : (
          <span style={{ width: 16, height: 16, display: 'inline-block', flexShrink: 0 }} />
        )}

        {node.icon && (
          <Icon
            name={node.icon}
            size={14}
            style={{ color: isActive ? 'var(--action-solid)' : 'currentColor', flexShrink: 0 }}
          />
        )}

        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            letterSpacing: 'var(--tracking-body)',
          }}
        >
          {node.label}
        </span>
      </div>

      {node.badge !== undefined && node.badge !== null && (
        <span style={{ marginLeft: 6, flexShrink: 0 }}>
          <Badge
            size="sm"
            tone={isActive ? 'info' : 'neutral'}
            count={typeof node.badge === 'number' ? node.badge : undefined}
          >
            {typeof node.badge === 'string' ? node.badge : undefined}
          </Badge>
        </span>
      )}
    </>
  );

  const sharedProps = {
    role: 'treeitem',
    'aria-expanded': hasChildren ? isExpanded : undefined,
    'aria-selected': isActive,
    'aria-current': isActive ? 'page' : undefined,
    'aria-level': level,
    'aria-posinset': posInSet,
    'aria-setsize': setSize,
    'aria-disabled': isDisabled ? 'true' : undefined,
    tabIndex: isActive ? 0 : -1,
    title: isDisabled ? node.disabledReason || node.label : undefined,
    href: node.href || '#',
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
