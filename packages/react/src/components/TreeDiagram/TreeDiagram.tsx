/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- keyboard-operated hierarchy canvas */
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  computeTreeTopology,
  createTreeLinkPath,
  VIZ_SEMANTIC_COLORS,
  useResponsiveVizBounds
} from '../../utils/viz-core.js';

export interface TreeNode {
  id: string;
  label: string;
  category?: string;
  status?: 'operational' | 'maintenance' | 'alarm' | 'idle' | string;
  code?: string;
  role?: string;
  value?: number;
  children?: TreeNode[];
  [key: string]: any;
}

export interface TreeDiagramProps {
  data: TreeNode;
  orientation?: 'horizontal' | 'vertical';
  linkStyle?: 'smooth' | 'step' | 'straight';
  nodeWidth?: number;
  nodeHeight?: number;
  levelSpacing?: number;
  siblingSpacing?: number;
  width?: number;
  height?: number;
  collapsible?: boolean;
  initialCollapsedIds?: string[];
  selectedId?: string | null;
  onNodeClick?: (node: any) => void;
  onNodeSelect?: (node: any) => void;
  onNodeToggle?: (node: any) => void;
  title?: string;
  subtitle?: string;
  zoomable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

interface FlatTreeNode {
  id: string;
  label: string;
  depth: number;
  category?: string;
  role?: string;
  code?: string;
  status?: string;
  childrenCount: number;
  parentLabel?: string;
}

function flattenTreeData(node: TreeNode, depth = 0, parentLabel = ''): FlatTreeNode[] {
  if (!node) return [];
  const current: FlatTreeNode = {
    id: node.id,
    label: node.label,
    depth,
    category: node.category,
    role: node.role,
    code: node.code,
    status: node.status,
    childrenCount: node.children ? node.children.length : 0,
    parentLabel: parentLabel || '—'
  };
  const children = (node.children || []).flatMap(child => flattenTreeData(child, depth + 1, node.label));
  return [current, ...children];
}

function isDescendantOf(descendantId: string | null | undefined, ancestorId: string, allNodes: any[]): boolean {
  if (!descendantId || !ancestorId || descendantId === ancestorId) return false;
  let curr = allNodes.find(n => n.id === descendantId);
  const visited = new Set<string>();
  while (curr && curr.parent && !visited.has(curr.id)) {
    visited.add(curr.id);
    if (curr.parent.id === ancestorId) return true;
    curr = allNodes.find(n => n.id === curr.parent.id);
  }
  return false;
}

/**
 * TreeDiagram — Hierarchical Topology Visualization Component
 *
 * Complies with AUDIT_STANDARD.md:
 * - Full multi-framework parity (React & Angular).
 * - Interactive Pan & Zoom viewport with reset controls, mouse dragging & auto-framing on expand/collapse.
 * - Active ancestor path highlighting on hover/selection.
 * - 2D non-occluding dark enterprise floating HUD tooltip.
 * - Accessible data table modal dialog with Alt+F11 shortcut, focus trap & Esc dismiss.
 * - WAI-ARIA Treeview roving tabindex keyboard navigation with focus shifting on branch collapse.
 * - Screen reader live region announcements.
 */
export const TreeDiagram: React.FC<TreeDiagramProps> = ({
  data,
  orientation = 'horizontal',
  linkStyle = 'smooth',
  nodeWidth = 160,
  nodeHeight = 56,
  levelSpacing = 75,
  siblingSpacing = 22,
  width = 800,
  height = 500,
  collapsible = true,
  initialCollapsedIds = [],
  selectedId: controlledSelectedId = null,
  onNodeClick,
  onNodeSelect,
  onNodeToggle,
  title = '',
  subtitle = '',
  zoomable = true,
  className = '',
  style
}) => {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set(initialCollapsedIds));
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [storedFocusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [isKeyboardNav, setIsKeyboardNav] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const tableDialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(tableDialogRef, isTableModalOpen);

  // Viewport Pan & Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const { width: measuredWidth, height: measuredHeight, densityTier: _densityTier } = useResponsiveVizBounds(containerRef, typeof width === 'number' ? width : 800, typeof height === 'number' ? height : 500);

  const plotWidth = Math.max(280, measuredWidth || (typeof width === 'number' ? width : 800));
  const plotHeight = Math.max(180, measuredHeight || (typeof height === 'number' ? height : 500));

  const selectedId = controlledSelectedId !== undefined && controlledSelectedId !== null
    ? controlledSelectedId
    : internalSelectedId;

  // Flattened data for Alt+F11 table modal
  const flatData = useMemo(() => flattenTreeData(data), [data]);

  // Compute Layout Topology
  const { nodes, links } = useMemo(() => {
    return computeTreeTopology({
      rootNode: data,
      orientation,
      nodeWidth,
      nodeHeight,
      levelSpacing,
      siblingSpacing,
      collapsedIds
    });
  }, [data, orientation, nodeWidth, nodeHeight, levelSpacing, siblingSpacing, collapsedIds]);

  const focusedNodeId = nodes.some((node) => node.id === storedFocusedNodeId)
    ? storedFocusedNodeId
    : nodes[0]?.id ?? null;

  // Alt+F11 Keyboard Shortcut Listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'F11') {
        e.preventDefault();
        setIsTableModalOpen(prev => !prev);
      } else if (e.key === 'Escape' && isTableModalOpen) {
        setIsTableModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isTableModalOpen]);

  // Map of active ancestors and descendants
  const activePathIds = useMemo(() => {
    const activeId = hoveredNodeId || selectedId;
    if (!activeId) return { nodeIds: new Set<string>(), linkIds: new Set<string>() };

    const nodeIds = new Set<string>([activeId]);
    const linkIds = new Set<string>();

    let curr = nodes.find(n => n.id === activeId);
    const visited = new Set<string>();
    while (curr && curr.parent && !visited.has(curr.id)) {
      visited.add(curr.id);
      nodeIds.add(curr.parent.id);
      linkIds.add(`link-${curr.parent.id}-${curr.id}`);
      curr = nodes.find(n => n.id === curr.parent.id);
    }

    return { nodeIds, linkIds };
  }, [nodes, hoveredNodeId, selectedId]);

  // Active node for tooltip HUD
  const hoveredNode = useMemo(() => {
    if (!hoveredNodeId) return null;
    return nodes.find(n => n.id === hoveredNodeId) || null;
  }, [hoveredNodeId, nodes]);

  // Ancestor trail lineage
  const nodeLineage = useMemo(() => {
    if (!hoveredNode) return '';
    const trail: string[] = [];
    let curr = hoveredNode;
    while (curr && curr.parent) {
      trail.unshift(curr.parent.label);
      curr = nodes.find(n => n.id === curr.parent?.id) as any;
    }
    return trail.length > 0 ? trail.join(' › ') : 'Root Anchor';
  }, [hoveredNode, nodes]);

  // Tooltip HUD positioning
  const tooltipStyle = useMemo(() => {
    if (!hoveredNode) return null;
    const nodeCenterX = pan.x + (hoveredNode.x + hoveredNode.width / 2) * zoom;
    const nodeTopY = pan.y + hoveredNode.y * zoom;
    const nodeBottomY = nodeTopY + hoveredNode.height * zoom;

    const tooltipWidth = 240;
    const tooltipHeight = 150;

    let left = nodeCenterX - tooltipWidth / 2;
    let top = nodeTopY - tooltipHeight - 12;

    if (top < 10) {
      top = nodeBottomY + 12;
    }
    if (left < 10) {
      left = 10;
    } else if (left + tooltipWidth > width - 10) {
      left = width - tooltipWidth - 10;
    }

    return {
      position: 'absolute' as const,
      left: `${left}px`,
      top: `${top}px`,
      width: `${tooltipWidth}px`,
      pointerEvents: 'none' as const,
      zIndex: 40,
      transition: 'left 0.08s ease, top 0.08s ease'
    };
  }, [hoveredNode, pan, zoom, width]);

  // Viewport Auto-Framing & A11y Focus Shift Engine
  const handleToggleCollapse = useCallback((node: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!collapsible || node.isLeaf || node.childrenCount === 0) return;

    setCollapsedIds(prev => {
      const next = new Set(prev);
      const isCurrentlyCollapsed = next.has(node.id);

      if (isCurrentlyCollapsed) {
        // --- EXPAND BRANCH ---
        next.delete(node.id);
        setAnnouncement(`Expanded ${node.label}. ${node.childrenCount} child items visible.`);

        // Auto-frame newly expanded children cluster into viewport
        const nextTopo = computeTreeTopology({
          rootNode: data,
          orientation,
          nodeWidth,
          nodeHeight,
          levelSpacing,
          siblingSpacing,
          collapsedIds: next
        });

        const expandedNode = nextTopo.nodes.find(n => n.id === node.id);
        const expandedChildren = nextTopo.nodes.filter(n => n.parent?.id === node.id);

        if (expandedNode && expandedChildren.length > 0) {
          const cluster = [expandedNode, ...expandedChildren];
          const minX = Math.min(...cluster.map(n => n.x));
          const maxX = Math.max(...cluster.map(n => n.x + n.width));
          const minY = Math.min(...cluster.map(n => n.y));
          const maxY = Math.max(...cluster.map(n => n.y + n.height));

          const margin = 48;
          let shiftX = 0;
          let shiftY = 0;

          const screenMinX = pan.x + minX * zoom;
          const screenMaxX = pan.x + maxX * zoom;
          const screenMinY = pan.y + minY * zoom;
          const screenMaxY = pan.y + maxY * zoom;

          if (screenMaxX > width - margin) {
            shiftX = (width - margin) - screenMaxX;
          } else if (screenMinX < margin) {
            shiftX = margin - screenMinX;
          }

          if (screenMaxY > height - margin) {
            shiftY = (height - margin) - screenMaxY;
          } else if (screenMinY < margin) {
            shiftY = margin - screenMinY;
          }

          if (shiftX !== 0 || shiftY !== 0) {
            setPan(p => ({ x: p.x + shiftX, y: p.y + shiftY }));
          }
        }
      } else {
        // --- COLLAPSE BRANCH ---
        next.add(node.id);

        // A11y Focus Invariant: If focus or selection was inside hidden subtree, shift to parent
        if (isDescendantOf(focusedNodeId, node.id, nodes)) {
          setFocusedNodeId(node.id);
          setAnnouncement(`Collapsed ${node.label}. Focus shifted to parent.`);
        } else {
          setAnnouncement(`Collapsed ${node.label}. ${node.childrenCount} child items hidden.`);
        }

        if (isDescendantOf(selectedId, node.id, nodes)) {
          setInternalSelectedId(node.id);
        }
      }

      return next;
    });

    if (onNodeToggle) onNodeToggle(node);
  }, [collapsible, data, orientation, nodeWidth, nodeHeight, levelSpacing, siblingSpacing, pan, zoom, width, height, focusedNodeId, selectedId, nodes, onNodeToggle]);

  // Select Node
  const handleSelectNode = useCallback((node: any) => {
    setIsKeyboardNav(false);
    setInternalSelectedId(node.id);
    setFocusedNodeId(node.id);
    setAnnouncement(`Selected ${node.label}${node.status ? `, status: ${node.status}` : ''}${node.role ? `, role: ${node.role}` : ''}.`);
    if (onNodeSelect) onNodeSelect(node);
    if (onNodeClick) onNodeClick(node);
  }, [onNodeSelect, onNodeClick]);

  // WAI-ARIA Treeview Keyboard Navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!nodes || nodes.length === 0) return;
    const currentIndex = nodes.findIndex(n => n.id === focusedNodeId);
    const currNode = currentIndex >= 0 ? nodes[currentIndex] : nodes[0];

    const isHorizontal = orientation === 'horizontal';

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setIsKeyboardNav(true);
      if (isHorizontal) {
        if (!currNode.isLeaf && currNode.isCollapsed && collapsible) {
          // If collapsed, ArrowRight expands branch
          handleToggleCollapse(currNode);
        } else {
          // If open, navigate to first child
          const children = nodes.filter(n => n.parent?.id === currNode.id);
          if (children.length > 0) {
            setFocusedNodeId(children[0].id);
            setAnnouncement(`Focused child: ${children[0].label}`);
          }
        }
      } else {
        const nextIdx = (currentIndex + 1) % nodes.length;
        setFocusedNodeId(nodes[nextIdx].id);
        setAnnouncement(`Focused: ${nodes[nextIdx].label}`);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setIsKeyboardNav(true);
      if (isHorizontal) {
        if (!currNode.isLeaf && !currNode.isCollapsed && collapsible) {
          // If expanded, ArrowLeft collapses branch
          handleToggleCollapse(currNode);
        } else if (currNode.parent) {
          // If already collapsed or leaf, moves to parent
          setFocusedNodeId(currNode.parent.id);
          setAnnouncement(`Focused parent: ${currNode.parent.label}`);
        }
      } else {
        const prevIdx = (currentIndex - 1 + nodes.length) % nodes.length;
        setFocusedNodeId(nodes[prevIdx].id);
        setAnnouncement(`Focused: ${nodes[prevIdx].label}`);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsKeyboardNav(true);
      if (isHorizontal) {
        const nextIdx = (currentIndex + 1) % nodes.length;
        setFocusedNodeId(nodes[nextIdx].id);
        setAnnouncement(`Focused: ${nodes[nextIdx].label}`);
      } else {
        if (!currNode.isLeaf && currNode.isCollapsed && collapsible) {
          handleToggleCollapse(currNode);
        } else {
          const children = nodes.filter(n => n.parent?.id === currNode.id);
          if (children.length > 0) {
            setFocusedNodeId(children[0].id);
            setAnnouncement(`Focused child: ${children[0].label}`);
          }
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsKeyboardNav(true);
      if (isHorizontal) {
        const prevIdx = (currentIndex - 1 + nodes.length) % nodes.length;
        setFocusedNodeId(nodes[prevIdx].id);
        setAnnouncement(`Focused: ${nodes[prevIdx].label}`);
      } else {
        if (!currNode.isLeaf && !currNode.isCollapsed && collapsible) {
          handleToggleCollapse(currNode);
        } else if (currNode.parent) {
          setFocusedNodeId(currNode.parent.id);
          setAnnouncement(`Focused parent: ${currNode.parent.label}`);
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsKeyboardNav(true);
      if (currNode) {
        if (!currNode.isLeaf && collapsible) {
          handleToggleCollapse(currNode);
        } else {
          handleSelectNode(currNode);
        }
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      setIsKeyboardNav(true);
      setFocusedNodeId(nodes[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      setIsKeyboardNav(true);
      setFocusedNodeId(nodes[nodes.length - 1].id);
    }
  }, [nodes, focusedNodeId, orientation, collapsible, handleToggleCollapse, handleSelectNode]);

  // Pan & Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(2.5, z + 0.2));
  const handleZoomOut = () => setZoom(z => Math.max(0.4, z - 0.2));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsKeyboardNav(false);
    if (!zoomable) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !zoomable) return;
    setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
  };

  const handleMouseUp = () => setIsPanning(false);

  // Status indicator helper
  const getStatusColor = (status?: string) => {
    if (!status) return null;
    const s = status.toLowerCase();
    if (s === 'operational' || s === 'running' || s === 'active' || s === 'good') return VIZ_SEMANTIC_COLORS.success;
    if (s === 'maintenance' || s === 'warning' || s === 'derated') return VIZ_SEMANTIC_COLORS.warning;
    if (s === 'alarm' || s === 'critical' || s === 'stoppage' || s === 'failed') return VIZ_SEMANTIC_COLORS.critical;
    if (s === 'idle' || s === 'standby') return VIZ_SEMANTIC_COLORS.neutral;
    return VIZ_SEMANTIC_COLORS.info;
  };

  if (!data) {
    return (
      <div
        className={`treediagram-empty ${className}`}
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--surface-sunken, #f8fafc)',
          border: '1px dashed var(--border-subtle, #cbd5e1)',
          borderRadius: 'var(--radius-md, 8px)',
          color: 'var(--text-muted, #64748b)',
          fontSize: '13px',
          ...style
        }}
      >
        No hierarchy topology data available
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`treediagram-container ${className}`}
      style={{
        position: 'relative',
        width: typeof width === 'number' ? `${width}px` : width,
        maxWidth: '100%',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        userSelect: 'none',
        outline: 'none',
        ...style
      }}
    >
      {/* Global CSS reset for SVG focus outlines */}
      <style>{`
        .treediagram-container,
        .treediagram-container *,
        .treediagram-container svg,
        .treediagram-container svg *,
        .treediagram-container:focus,
        .treediagram-container:focus-visible,
        .treediagram-container .tree-node,
        .treediagram-container .tree-node:focus,
        .treediagram-container .tree-node:focus-visible {
          outline: none !important;
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>

      {/* Live Region for Screen Reader Announcements */}
      <div aria-live="polite" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
        {announcement}
      </div>

      {/* Header & Controls Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          {title && (
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #0f172a)', letterSpacing: '-0.01em' }}>
              {title}
            </div>
          )}
          {subtitle && (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary, #64748b)', marginTop: '2px' }}>
              {subtitle}
            </div>
          )}
        </div>

        {/* Viewport & Table Modal Toolbar */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setIsTableModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              background: 'var(--surface-card, #ffffff)',
              border: '1px solid var(--border-subtle, #cbd5e1)',
              borderRadius: 'var(--radius-sm, 4px)',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              color: 'var(--text-secondary, #475569)',
              outline: 'none'
            }}
            aria-label="Open accessible data table modal (Alt+F11)"
            title="View accessible data table (Alt+F11)"
          >
            📊 Table <kbd style={{ fontSize: '9px', background: 'var(--surface-subtle, #f1f5f9)', padding: '1px 4px', borderRadius: '2px', border: '1px solid var(--border-subtle, #cbd5e1)' }}>Alt+F11</kbd>
          </button>

          {zoomable && (
            <div style={{ display: 'inline-flex', background: 'var(--surface-card, #ffffff)', border: '1px solid var(--border-subtle, #cbd5e1)', borderRadius: 'var(--radius-sm, 4px)', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={handleZoomIn}
                style={{ padding: '3px 8px', background: 'transparent', border: 'none', borderRight: '1px solid var(--border-subtle, #cbd5e1)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary, #475569)', outline: 'none' }}
                title="Zoom In"
                aria-label="Zoom in tree viewport"
              >
                +
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                style={{ padding: '3px 8px', background: 'transparent', border: 'none', borderRight: '1px solid var(--border-subtle, #cbd5e1)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary, #475569)', outline: 'none' }}
                title="Zoom Out"
                aria-label="Zoom out tree viewport"
              >
                &minus;
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                style={{ padding: '3px 8px', background: 'transparent', border: 'none', fontSize: '11px', cursor: 'pointer', color: 'var(--text-secondary, #475569)', outline: 'none' }}
                title="Reset View"
                aria-label="Reset zoom and center view"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas for Tree Diagram */}
      <div
        role="tree"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`Hierarchy Tree Diagram: ${title || 'Topology'}. Use arrow keys to traverse hierarchy nodes, Enter to toggle expand/collapse.`}
        aria-activedescendant={focusedNodeId ? `td-node-${focusedNodeId}` : undefined}
      >
      <svg
        width="100%"
        height={plotHeight}
        viewBox={`0 0 ${plotWidth} ${plotHeight}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          display: 'block',
          background: 'var(--surface-card, #ffffff)',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          borderRadius: 'var(--radius-md, 6px)',
          overflow: 'hidden',
          outline: 'none',
          cursor: isPanning ? 'grabbing' : (zoomable ? 'grab' : 'default')
        }}
      >
        <defs>
          <filter id="td-node-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" />
          </filter>
          <filter id="td-active-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2563eb" floodOpacity="0.2" />
          </filter>
        </defs>

        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          style={{ transition: isPanning ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          {/* 1. Connecting Hierarchy Link Edges */}
          <g className="tree-links">
            {links.map((link: any) => {
              const pathD = createTreeLinkPath({
                source: link.source,
                target: link.target,
                orientation,
                linkStyle
              });
              const isPathActive = activePathIds.linkIds.has(link.id);

              return (
                <path
                  key={link.id}
                  d={pathD}
                  fill="none"
                  stroke={isPathActive ? 'var(--action-solid, #2563eb)' : 'var(--border-strong, #cbd5e1)'}
                  strokeWidth={isPathActive ? 2.5 : 1.5}
                  style={{
                    transition: 'stroke 0.2s ease, stroke-width 0.2s ease'
                  }}
                />
              );
            })}
          </g>

          {/* 2. Hierarchy Entity Nodes */}
          <g className="tree-nodes" role="group" aria-label="Hierarchy nodes">
            {nodes.map((node: any) => {
              const isSelected = node.id === selectedId;
              const isFocused = isKeyboardNav && node.id === focusedNodeId;
              const isPathActive = activePathIds.nodeIds.has(node.id);
              const statusColor = getStatusColor(node.status);
              const hasExpandToggle = collapsible && !node.isLeaf && node.childrenCount > 0;

              return (
                <g
                  key={`node-${node.id}`}
                  id={`td-node-${node.id}`}
                  className="tree-node"
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => handleSelectNode(node)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  style={{ cursor: 'pointer', outline: 'none' }}
                  role="treeitem"
                  aria-expanded={hasExpandToggle ? (!node.isCollapsed) : undefined}
                  aria-selected={isSelected}
                >
                  <rect
                    x={0}
                    y={0}
                    width={node.width}
                    height={node.height}
                    fill={isSelected ? 'var(--surface-active, #eff6ff)' : 'var(--surface-card, #ffffff)'}
                    stroke={isSelected || isFocused ? 'var(--action-solid, #2563eb)' : (isPathActive ? '#64748b' : 'var(--border-subtle, #cbd5e1)')}
                    strokeWidth={isSelected || isFocused ? 2 : (isPathActive ? 1.5 : 1)}
                    rx="6"
                    filter={isSelected || isFocused ? 'url(#td-active-shadow)' : 'url(#td-node-shadow)'}
                    style={{ transition: 'all 0.15s ease', outline: 'none' }}
                  />

                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={node.height}
                    fill={isSelected || isFocused ? 'var(--action-solid, #2563eb)' : (statusColor || 'var(--border-strong, #94a3b8)')}
                    rx="2"
                  />

                  <text
                    x={10}
                    y={20}
                    fontSize="12px"
                    fontWeight="600"
                    fill="var(--text-primary, #0f172a)"
                    style={{ pointerEvents: 'none' }}
                  >
                    {node.label.length > 18 ? node.label.slice(0, 17) + '…' : node.label}
                  </text>

                  <text
                    x={10}
                    y={36}
                    fontSize="10px"
                    fill="var(--text-secondary, #64748b)"
                    style={{ pointerEvents: 'none' }}
                  >
                    {node.code || node.role || (node.isLeaf ? 'Leaf Unit' : `${node.childrenCount} sub-units`)}
                  </text>

                  {node.status && (
                    <g transform={`translate(10, 42)`}>
                      <circle cx={3} cy={3} r={3} fill={statusColor || '#64748b'} />
                      <text x={9} y={6} fontSize="9px" fontWeight="500" fill={statusColor || '#64748b'}>
                        {node.status}
                      </text>
                    </g>
                  )}

                  {hasExpandToggle && (
                    <g
                      transform={
                        orientation === 'horizontal'
                          ? `translate(${node.width + 4}, ${node.height / 2})`
                          : `translate(${node.width / 2}, ${node.height + 4})`
                      }
                      onClick={(e) => handleToggleCollapse(node, e)}
                      style={{ cursor: 'pointer', outline: 'none' }}
                      role="button"
                      aria-label={node.isCollapsed ? `Expand ${node.label}` : `Collapse ${node.label}`}
                    >
                      <circle
                        cx={0}
                        cy={0}
                        r={8}
                        fill="var(--surface-card, #ffffff)"
                        stroke="var(--action-solid, #2563eb)"
                        strokeWidth={1.5}
                      />
                      <text
                        x={0}
                        y={3.5}
                        textAnchor="middle"
                        fontSize="10px"
                        fontWeight="700"
                        fill="var(--action-solid, #2563eb)"
                        style={{ pointerEvents: 'none' }}
                      >
                        {node.isCollapsed ? '+' : '−'}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </g>
      </svg>
      </div>

      {/* Floating Dark Enterprise HUD Tooltip */}
      {hoveredNode && tooltipStyle && (
        <div
          className="treediagram-tooltip"
          style={{
            ...tooltipStyle,
            background: 'var(--surface-floating, #0f172a)',
            color: '#ffffff',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm, 6px)',
            fontSize: '11px',
            lineHeight: 1.4,
            boxShadow: 'var(--shadow-xl, 0 12px 28px -4px rgba(0, 0, 0, 0.45))',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(6px)',
            boxSizing: 'border-box'
          }}
          role="tooltip"
        >
          {/* Tooltip Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', paddingBottom: '6px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: getStatusColor(hoveredNode.status) || '#38bdf8',
                  flexShrink: 0
                }}
              />
              <strong style={{ fontSize: '12px', color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {hoveredNode.label}
              </strong>
            </div>
            <span style={{ fontSize: '10px', color: '#94a3b8', fontVariantNumeric: 'tabular-nums', background: 'rgba(255, 255, 255, 0.08)', padding: '1px 5px', borderRadius: '3px', flexShrink: 0 }}>
              Level {hoveredNode.depth != null ? hoveredNode.depth + 1 : 1}
            </span>
          </div>

          {/* Tooltip Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {hoveredNode.code && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#94a3b8' }}>
                <span>Asset / Part Code:</span>
                <strong style={{ color: '#38bdf8', fontFamily: 'var(--font-mono, monospace)' }}>
                  {hoveredNode.code}
                </strong>
              </div>
            )}
            {(hoveredNode.category || hoveredNode.role) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#94a3b8' }}>
                <span>Classification:</span>
                <span style={{ color: '#ffffff', fontWeight: 500 }}>
                  {hoveredNode.category || hoveredNode.role}
                </span>
              </div>
            )}
            {hoveredNode.status && (
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#94a3b8' }}>
                <span>Health State:</span>
                <span style={{ color: getStatusColor(hoveredNode.status) || '#38bdf8', fontWeight: 600, textTransform: 'capitalize' }}>
                  {hoveredNode.status}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', color: '#94a3b8' }}>
              <span>Sub-units:</span>
              <strong style={{ color: '#38bdf8', fontVariantNumeric: 'tabular-nums' }}>
                {hoveredNode.isLeaf ? '0 (Leaf Unit)' : `${hoveredNode.childrenCount} child nodes`}
              </strong>
            </div>
            {nodeLineage && (
              <div style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px dashed rgba(255,255,255,0.1)', fontSize: '10px', color: '#64748b' }}>
                <span style={{ color: '#94a3b8' }}>Lineage: </span>
                {nodeLineage}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Accessible Hierarchical Tree Table Modal (Alt+F11) */}
      {isTableModalOpen && (
        <div ref={tableDialogRef} tabIndex={-1}
          className="treediagram-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${title || 'Hierarchy Tree Diagram'} Data Table`}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={() => setIsTableModalOpen(false)}
        >
          <div
            className="treediagram-modal"
            style={{
              backgroundColor: 'var(--surface-card, #ffffff)',
              borderRadius: 'var(--radius-lg, 8px)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              width: '100%',
              maxWidth: '820px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle, #e2e8f0)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
              backgroundColor: 'var(--surface-subtle, #f8fafc)'
            }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                  {title || 'Hierarchy Tree Diagram'} — Equipment Taxonomy Table
                </h4>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary, #64748b)', marginTop: '2px' }}>
                  Total {flatData.length} hierarchical asset and functional units
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary, #64748b)',
                  padding: '4px 8px',
                  lineHeight: 1
                }}
                aria-label="Close data table modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Table Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-subtle, #e2e8f0)', backgroundColor: 'var(--surface-subtle, #f8fafc)' }}>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)' }}>Hierarchical Structure</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)' }}>Identifier / Code</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)' }}>Classification / Role</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)' }}>Health State</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)', textAlign: 'center' }}>Level</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)', textAlign: 'right' }}>Children</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)' }}>Parent Entity</th>
                  </tr>
                </thead>
                <tbody>
                  {flatData.map((row, idx) => {
                    const statusColor = getStatusColor(row.status);
                    return (
                      <tr
                        key={row.id || idx}
                        style={{
                          borderBottom: '1px solid var(--border-subtle, #f1f5f9)',
                          backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--surface-subtle, #f8fafc)'
                        }}
                      >
                        <td style={{ padding: '8px 10px', fontWeight: row.depth === 0 ? 700 : 500, color: 'var(--text-primary, #0f172a)' }}>
                          <span style={{ display: 'inline-block', width: `${row.depth * 18}px` }} />
                          {row.depth > 0 && <span style={{ color: 'var(--text-muted, #94a3b8)', marginRight: '6px' }}>└─</span>}
                          {row.label}
                        </td>
                        <td style={{ padding: '8px 10px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-secondary, #64748b)', fontSize: '11px' }}>
                          {row.code || row.id || '—'}
                        </td>
                        <td style={{ padding: '8px 10px', color: 'var(--text-secondary, #64748b)' }}>
                          {row.category || row.role || '—'}
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          {row.status ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: statusColor || 'var(--text-secondary, #64748b)' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColor || '#94a3b8' }} />
                              {row.status}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted, #94a3b8)' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'center', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary, #64748b)' }}>
                          L{row.depth + 1}
                        </td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary, #64748b)' }}>
                          {row.childrenCount}
                        </td>
                        <td style={{ padding: '8px 10px', color: 'var(--text-secondary, #64748b)' }}>
                          {row.parentLabel}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              padding: '10px 18px',
              borderTop: '1px solid var(--border-subtle, #e2e8f0)',
              backgroundColor: 'var(--surface-subtle, #f8fafc)'
            }}>
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                style={{
                  padding: '6px 14px',
                  backgroundColor: 'var(--action-solid, #2563eb)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-sm, 4px)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeDiagram;
