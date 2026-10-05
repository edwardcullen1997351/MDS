import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  computeTreeTopology,
  createTreeLinkPath,
  VIZ_COLORS,
  VIZ_SEMANTIC_COLORS,
  formatVizValue
} from './viz-core.js';

/**
 * TreeDiagram — Hierarchical Topology Visualization Component
 *
 * Visualizes explicit parent-child lineage, branching structure, and asset topology.
 * Supports horizontal & vertical orientations, interactive collapsible subtree folding,
 * ancestor/descendant edge highlighting, pan & zoom viewport controls, keyboard tree navigation,
 * and accessible hierarchical data table modal (Alt+F11).
 */
export function TreeDiagram({
  data,
  orientation = 'horizontal', // 'horizontal' | 'vertical'
  linkStyle = 'smooth', // 'smooth' | 'step' | 'straight'
  nodeWidth = 160,
  nodeHeight = 56,
  levelSpacing = 75,
  siblingSpacing = 22,
  width = 800,
  height = 500,
  collapsible = true,
  initialCollapsedIds = [],
  selectedId: controlledSelectedId = null,
  onNodeClick = null,
  onNodeSelect = null,
  onNodeToggle = null,
  title = '',
  subtitle = '',
  zoomable = true,
  className = ''
}) {
  const [collapsedIds, setCollapsedIds] = useState(() => new Set(initialCollapsedIds));
  const [internalSelectedId, setInternalSelectedId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [showTableModal, setShowTableModal] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  // Viewport Pan & Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  const selectedId = controlledSelectedId !== undefined && controlledSelectedId !== null
    ? controlledSelectedId
    : internalSelectedId;

  // Compute Layout Topology
  const { nodes, links, bounds } = useMemo(() => {
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

  // Set initial focus to root node
  useEffect(() => {
    if (nodes.length > 0 && !focusedNodeId) {
      setFocusedNodeId(nodes[0].id);
    }
  }, [nodes, focusedNodeId]);

  // Map of active ancestors and descendants for highlighted paths
  const activePathIds = useMemo(() => {
    const activeId = hoveredNodeId || selectedId;
    if (!activeId) return { nodeIds: new Set(), linkIds: new Set() };

    const nodeIds = new Set([activeId]);
    const linkIds = new Set();

    // Trace ancestors
    let curr = nodes.find(n => n.id === activeId);
    while (curr && curr.parent) {
      nodeIds.add(curr.parent.id);
      linkIds.add(`link-${curr.parent.id}-${curr.id}`);
      curr = nodes.find(n => n.id === curr.parent.id);
    }

    return { nodeIds, linkIds };
  }, [nodes, hoveredNodeId, selectedId]);

  // Toggle Collapse / Expand
  const handleToggleCollapse = useCallback((node, e) => {
    if (e) e.stopPropagation();
    if (!collapsible || node.isLeaf || node.childrenCount === 0) return;

    setCollapsedIds(prev => {
      const next = new Set(prev);
      const isCurrentlyCollapsed = next.has(node.id);
      if (isCurrentlyCollapsed) {
        next.delete(node.id);
        setAnnouncement(`Expanded ${node.label}. ${node.childrenCount} child items visible.`);
      } else {
        next.add(node.id);
        setAnnouncement(`Collapsed ${node.label}. ${node.childrenCount} child items hidden.`);
      }
      return next;
    });

    if (onNodeToggle) onNodeToggle(node);
  }, [collapsible, onNodeToggle]);

  // Select Node
  const handleSelectNode = useCallback((node) => {
    setInternalSelectedId(node.id);
    setFocusedNodeId(node.id);
    setAnnouncement(`Selected ${node.label}${node.status ? `, status: ${node.status}` : ''}${node.role ? `, role: ${node.role}` : ''}.`);
    if (onNodeSelect) onNodeSelect(node);
    if (onNodeClick) onNodeClick(node);
  }, [onNodeSelect, onNodeClick]);

  // Keyboard Tree Navigation
  const handleKeyDown = useCallback((e) => {
    if (!nodes || nodes.length === 0) return;
    const currentIndex = nodes.findIndex(n => n.id === focusedNodeId);
    const currNode = currentIndex >= 0 ? nodes[currentIndex] : nodes[0];

    const isHorizontal = orientation === 'horizontal';

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (isHorizontal) {
        // Horizontal: go to first child
        const children = nodes.filter(n => n.parent?.id === currNode.id);
        if (children.length > 0) {
          setFocusedNodeId(children[0].id);
          setAnnouncement(`Focused child: ${children[0].label}`);
        }
      } else {
        // Vertical: go to next sibling
        const nextIdx = (currentIndex + 1) % nodes.length;
        setFocusedNodeId(nodes[nextIdx].id);
        setAnnouncement(`Focused: ${nodes[nextIdx].label}`);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (isHorizontal) {
        // Horizontal: go to parent
        if (currNode.parent) {
          setFocusedNodeId(currNode.parent.id);
          setAnnouncement(`Focused parent: ${currNode.parent.label}`);
        }
      } else {
        // Vertical: go to previous sibling
        const prevIdx = (currentIndex - 1 + nodes.length) % nodes.length;
        setFocusedNodeId(nodes[prevIdx].id);
        setAnnouncement(`Focused: ${nodes[prevIdx].label}`);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (isHorizontal) {
        // Horizontal: go to next visible sibling / node
        const nextIdx = (currentIndex + 1) % nodes.length;
        setFocusedNodeId(nodes[nextIdx].id);
        setAnnouncement(`Focused: ${nodes[nextIdx].label}`);
      } else {
        // Vertical: go to first child
        const children = nodes.filter(n => n.parent?.id === currNode.id);
        if (children.length > 0) {
          setFocusedNodeId(children[0].id);
          setAnnouncement(`Focused child: ${children[0].label}`);
        }
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isHorizontal) {
        // Horizontal: go to prev visible sibling / node
        const prevIdx = (currentIndex - 1 + nodes.length) % nodes.length;
        setFocusedNodeId(nodes[prevIdx].id);
        setAnnouncement(`Focused: ${nodes[prevIdx].label}`);
      } else {
        // Vertical: go to parent
        if (currNode.parent) {
          setFocusedNodeId(currNode.parent.id);
          setAnnouncement(`Focused parent: ${currNode.parent.label}`);
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (currNode) {
        if (!currNode.isLeaf && collapsible) {
          handleToggleCollapse(currNode);
        } else {
          handleSelectNode(currNode);
        }
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedNodeId(nodes[0].id);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedNodeId(nodes[nodes.length - 1].id);
    } else if (e.altKey && (e.key === 'F11' || e.keyCode === 122)) {
      e.preventDefault();
      setShowTableModal(prev => !prev);
    }
  }, [nodes, focusedNodeId, orientation, collapsible, handleToggleCollapse, handleSelectNode]);

  // Pan & Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(2.5, z + 0.2));
  const handleZoomOut = () => setZoom(z => Math.max(0.4, z - 0.2));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (!zoomable) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isPanning || !zoomable) return;
    setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
  };

  const handleMouseUp = () => setIsPanning(false);

  // Status indicator helper
  const getStatusColor = (status) => {
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
      <div className={`treediagram-empty ${className}`} style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-sunken, #f8fafc)', border: '1px dashed var(--border-subtle, #cbd5e1)', borderRadius: 'var(--radius-md, 8px)', color: 'var(--text-muted, #64748b)', fontSize: '13px' }}>
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
        width,
        fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        userSelect: 'none'
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="tree"
      aria-label={`Hierarchy Tree Diagram: ${title || 'Topology'}. Use arrow keys to traverse hierarchy nodes, Enter to toggle expand/collapse, Alt+F11 for accessible data table.`}
    >
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

        {/* Viewport Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {zoomable && (
            <div style={{ display: 'inline-flex', background: 'var(--surface-card, #ffffff)', border: '1px solid var(--border-subtle, #cbd5e1)', borderRadius: 'var(--radius-sm, 4px)', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={handleZoomIn}
                style={{ padding: '3px 8px', background: 'transparent', border: 'none', borderRight: '1px solid var(--border-subtle, #cbd5e1)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary, #475569)' }}
                title="Zoom In"
                aria-label="Zoom in tree viewport"
              >
                +
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                style={{ padding: '3px 8px', background: 'transparent', border: 'none', borderRight: '1px solid var(--border-subtle, #cbd5e1)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary, #475569)' }}
                title="Zoom Out"
                aria-label="Zoom out tree viewport"
              >
                &minus;
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                style={{ padding: '3px 8px', background: 'transparent', border: 'none', fontSize: '11px', cursor: 'pointer', color: 'var(--text-secondary, #475569)' }}
                title="Reset View"
                aria-label="Reset zoom and center view"
              >
                Reset
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowTableModal(true)}
            style={{
              fontSize: '11px',
              fontWeight: 500,
              padding: '4px 8px',
              borderRadius: 'var(--radius-sm, 4px)',
              border: '1px solid var(--border-subtle, #cbd5e1)',
              background: 'var(--surface-card, #ffffff)',
              color: 'var(--text-secondary, #475569)',
              cursor: 'pointer'
            }}
            title="Open Accessible Tree Table (Alt+F11)"
            aria-label="Open accessible hierarchy table"
          >
            Accessible Table
          </button>
        </div>
      </div>

      {/* SVG Canvas for Tree Diagram */}
      <svg
        width={width}
        height={height}
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
          cursor: isPanning ? 'grabbing' : (zoomable ? 'grab' : 'default')
        }}
      >
        <defs>
          <filter id="td-node-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.08" />
          </filter>
          <filter id="td-active-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#2563eb" floodOpacity="0.25" />
          </filter>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* 1. Connecting Hierarchy Link Edges */}
          <g className="tree-links">
            {links.map(link => {
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
                  strokeDasharray={isPathActive ? undefined : undefined}
                  style={{
                    transition: 'stroke 0.2s ease, stroke-width 0.2s ease'
                  }}
                />
              );
            })}
          </g>

          {/* 2. Hierarchy Entity Nodes */}
          <g className="tree-nodes">
            {nodes.map(node => {
              const isSelected = node.id === selectedId;
              const isHovered = node.id === hoveredNodeId;
              const isFocused = node.id === focusedNodeId;
              const isPathActive = activePathIds.nodeIds.has(node.id);
              const statusColor = getStatusColor(node.status);
              const hasExpandToggle = collapsible && !node.isLeaf && node.childrenCount > 0;

              return (
                <g
                  key={`node-${node.id}`}
                  className="tree-node"
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => handleSelectNode(node)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  style={{ cursor: 'pointer' }}
                  role="treeitem"
                  aria-expanded={hasExpandToggle ? (!node.isCollapsed) : undefined}
                  aria-selected={isSelected}
                  tabIndex={-1}
                >
                  {/* Node Background Surface */}
                  <rect
                    x={0}
                    y={0}
                    width={node.width}
                    height={node.height}
                    fill={isSelected ? 'var(--surface-active, #eff6ff)' : 'var(--surface-card, #ffffff)'}
                    stroke={isSelected ? 'var(--action-solid, #2563eb)' : (isPathActive ? '#64748b' : 'var(--border-subtle, #cbd5e1)')}
                    strokeWidth={isSelected ? 2 : (isPathActive ? 1.5 : 1)}
                    rx="6"
                    filter={isSelected ? 'url(#td-active-shadow)' : 'url(#td-node-shadow)'}
                    style={{ transition: 'all 0.15s ease' }}
                  />

                  {/* Left Accent Stripe (based on category or selection) */}
                  <rect
                    x={0}
                    y={0}
                    width={4}
                    height={node.height}
                    fill={isSelected ? 'var(--action-solid, #2563eb)' : (statusColor || 'var(--border-strong, #94a3b8)')}
                    rx="2"
                  />

                  {/* Focus Ring */}
                  {isFocused && (
                    <rect
                      x={-2}
                      y={-2}
                      width={node.width + 4}
                      height={node.height + 4}
                      fill="none"
                      stroke="var(--action-solid, #2563eb)"
                      strokeWidth={1.5}
                      strokeDasharray="3 2"
                      rx="8"
                      style={{ pointerEvents: 'none' }}
                    />
                  )}

                  {/* Node Label Text */}
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

                  {/* Subtitle / Code / Role */}
                  <text
                    x={10}
                    y={36}
                    fontSize="10px"
                    fill="var(--text-secondary, #64748b)"
                    style={{ pointerEvents: 'none' }}
                  >
                    {node.code || node.role || (node.isLeaf ? 'Leaf Unit' : `${node.childrenCount} sub-units`)}
                  </text>

                  {/* Status Indicator Dot & Label */}
                  {node.status && (
                    <g transform={`translate(10, 42)`}>
                      <circle cx={3} cy={3} r={3} fill={statusColor || '#64748b'} />
                      <text x={9} y={6} fontSize="9px" fontWeight="500" fill={statusColor || '#64748b'}>
                        {node.status}
                      </text>
                    </g>
                  )}

                  {/* Expand / Collapse Circular Toggle Badge */}
                  {hasExpandToggle && (
                    <g
                      transform={
                        orientation === 'horizontal'
                          ? `translate(${node.width + 4}, ${node.height / 2})`
                          : `translate(${node.width / 2}, ${node.height + 4})`
                      }
                      onClick={(e) => handleToggleCollapse(node, e)}
                      style={{ cursor: 'pointer' }}
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

      {/* Accessible Hierarchical Tree Table Modal */}
      {showTableModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
          onClick={() => setShowTableModal(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--surface-card, #ffffff)',
              borderRadius: 'var(--radius-lg, 8px)',
              boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.3))',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle, #cbd5e1)'
            }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Accessible Hierarchy Tree Data Table"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle, #e2e8f0)' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                Hierarchy Topology Table: {title || 'Tree Data'}
              </h3>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--text-muted, #64748b)'
                }}
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>

            <div style={{ overflowY: 'auto', padding: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-strong, #cbd5e1)', background: 'var(--surface-sunken, #f8fafc)' }}>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)' }}>Hierarchy Node</th>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)' }}>Identifier / Code</th>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)' }}>Role / Type</th>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map(node => {
                    const indent = (node.depth || 0) * 16;
                    const isLeaf = node.isLeaf;

                    return (
                      <tr
                        key={node.id}
                        style={{
                          borderBottom: '1px solid var(--border-subtle, #f1f5f9)',
                          fontWeight: isLeaf ? 400 : 600,
                          background: node.id === selectedId ? 'var(--surface-active, #eff6ff)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '6px 10px', paddingLeft: `${indent + 10}px` }}>
                          {!isLeaf ? '📁 ' : '📄 '}
                          {node.label}
                        </td>
                        <td style={{ padding: '6px 10px', color: 'var(--text-muted, #64748b)', fontSize: '11px', fontVariantNumeric: 'tabular-nums' }}>
                          {node.code || node.id}
                        </td>
                        <td style={{ padding: '6px 10px', color: 'var(--text-secondary, #475569)' }}>
                          {node.role || (isLeaf ? 'Leaf Component' : `Branch (${node.childrenCount})`)}
                        </td>
                        <td style={{ padding: '6px 10px' }}>
                          {node.status ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: getStatusColor(node.status) || 'inherit' }}>
                              ● {node.status}
                            </span>
                          ) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 16px', background: 'var(--surface-sunken, #f8fafc)', borderTop: '1px solid var(--border-subtle, #e2e8f0)' }}>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm, 4px)',
                  background: 'var(--action-solid, #2563eb)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Close Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default TreeDiagram;
