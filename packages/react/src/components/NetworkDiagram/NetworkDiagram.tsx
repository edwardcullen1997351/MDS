/* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- keyboard-operated visualization surface; interactive controls retain native semantics */
import React,{ useCallback,useMemo,useRef,useState } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import {
computeEdgePerimeterCoords,
computeNetworkLayout,
NetworkLink,
NetworkNode,
POINT_SYMBOLS,
useResponsiveVizBounds,
VIZ_COLORS
} from '../../utils/viz-core.js';

export type { NetworkLink,NetworkNode };

export interface NetworkDiagramProps {
  nodes?: NetworkNode[];
  links?: NetworkLink[];
  width?: number;
  height?: number;
  layout?: 'force' | 'circular';
  directed?: boolean;
  colorScale?: string[];
  title?: string;
  subtitle?: string;
  searchable?: boolean;
  zoomable?: boolean;
  draggableNodes?: boolean;
  initialSpread?: number;
  minSpread?: number;
  maxSpread?: number;
  selectedId?: string | null;
  onNodeClick?: (node: any) => void;
  onLinkClick?: (link: any) => void;
  onSelectionChange?: (selection: any) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * NetworkDiagram — Relational Graph & Topology Visualization Component
 */
export const NetworkDiagram: React.FC<NetworkDiagramProps> = ({
  nodes: inputNodes = [],
  links: inputLinks = [],
  width = 760,
  height = 480,
  layout = 'force',
  directed = true,
  colorScale = VIZ_COLORS,
  title = '',
  subtitle = '',
  searchable = true,
  zoomable = true,
  draggableNodes = true,
  initialSpread = 1.2,
  minSpread = 0.4,
  maxSpread = 4.0,
  selectedId: controlledSelectedId = null,
  onNodeClick,
  onLinkClick,
  onSelectionChange,
  className = '',
  style = {}
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<{
    type: 'node' | 'link';
    item: any;
    id: string;
    clientX: number;
    clientY: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showTableModal, setShowTableModal] = useState(false);
  const tableDialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(tableDialogRef, showTableModal);
  const [announcement, setAnnouncement] = useState('');
  const [spreadMultiplier, setSpreadMultiplier] = useState(initialSpread);

  // Viewport Pan & Zoom
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Interactive Node Dragging / Stretching state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [nodePositionState, setNodePositionState] = useState(() => ({
    inputNodes,
    inputLinks,
    layout,
    positions: new Map<string, { x: number; y: number }>(),
  }));
  if (
    nodePositionState.inputNodes !== inputNodes ||
    nodePositionState.inputLinks !== inputLinks ||
    nodePositionState.layout !== layout
  ) {
    setNodePositionState({
      inputNodes,
      inputLinks,
      layout,
      positions: new Map(),
    });
  }
  const nodePositions = nodePositionState.positions;
  const setNodePositions = useCallback<React.Dispatch<
    React.SetStateAction<Map<string, { x: number; y: number }>>
  >>((action) => {
    setNodePositionState((previous) => {
      const sourceChanged =
        previous.inputNodes !== inputNodes ||
        previous.inputLinks !== inputLinks ||
        previous.layout !== layout;
      const current = sourceChanged ? new Map<string, { x: number; y: number }>() : previous.positions;
      return {
        inputNodes,
        inputLinks,
        layout,
        positions: typeof action === 'function' ? action(current) : action,
      };
    });
  }, [inputNodes, inputLinks, layout]);

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { width: measuredWidth, height: measuredHeight, densityTier } = useResponsiveVizBounds(containerRef, typeof width === 'number' ? width : 800, typeof height === 'number' ? height : 500);

  const plotWidth = Math.max(280, measuredWidth || (typeof width === 'number' ? width : 800));
  const plotHeight = Math.max(200, measuredHeight || (typeof height === 'number' ? height : 500));

  const selectedId = controlledSelectedId !== undefined && controlledSelectedId !== null
    ? controlledSelectedId
    : internalSelectedId;

  // Compute Layout Topology
  const { nodes: baseNodes, links: baseLinks, adjacencyMap } = useMemo(() => {
    return computeNetworkLayout({
      nodes: inputNodes,
      links: inputLinks,
      width: plotWidth,
      height: plotHeight,
      layout,
      linkDistance: (densityTier === 'compact' ? 65 : 90) * spreadMultiplier,
      repulsion: (densityTier === 'compact' ? 1200 : 1800) * (spreadMultiplier * spreadMultiplier)
    });
  }, [inputNodes, inputLinks, plotWidth, plotHeight, layout, spreadMultiplier, densityTier]);

  // Sync / apply user-dragged node overrides
  const nodes = useMemo(() => {
    return (baseNodes as NetworkNode[]).map(n => {
      const dragged = nodePositions.get(n.id);
      if (dragged) {
        return { ...n, x: dragged.x, y: dragged.y };
      }
      return n;
    });
  }, [baseNodes, nodePositions]);

  // Sync links with updated node coordinates
  const links = useMemo(() => {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    return (baseLinks as any[]).map(l => ({
      ...l,
      source: nodeMap.get(l.source.id) || l.source,
      target: nodeMap.get(l.target.id) || l.target
    }));
  }, [baseLinks, nodes]);

  // Category Color & Shape Assignment for Dual-Encoding (WCAG 1.4.1)
  const categoryStyleMap = useMemo(() => {
    const map = new Map<string, { color: string; symbol: string }>();
    nodes.forEach(n => {
      const cat = n.category || 'default';
      if (!map.has(cat)) {
        map.set(cat, {
          color: colorScale[map.size % colorScale.length],
          symbol: POINT_SYMBOLS[map.size % POINT_SYMBOLS.length]
        });
      }
    });
    return map;
  }, [nodes, colorScale]);

  // Search filter matching IDs
  const searchMatchIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set<string>();
    const q = searchQuery.toLowerCase();
    const set = new Set<string>();
    nodes.forEach(n => {
      if (n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q) || n.category?.toLowerCase().includes(q)) {
        set.add(n.id);
      }
    });
    return set;
  }, [searchQuery, nodes]);

  // Active Neighborhood Highlighting
  const activeNeighborhood = useMemo(() => {
    const activeNodeIds = new Set<string>();
    const activeLinkIds = new Set<string>();

    const activeTargetId = hoveredItem?.id || selectedId;

    if (searchMatchIds.size > 0) {
      searchMatchIds.forEach(id => activeNodeIds.add(id));
      links.forEach(l => {
        if (searchMatchIds.has(l.source.id) && searchMatchIds.has(l.target.id)) {
          activeLinkIds.add(l.id);
        }
      });
      return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: true };
    }

    if (!activeTargetId) return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: false };

    // Check if target is a node
    const targetNode = nodes.find(n => n.id === activeTargetId);
    if (targetNode) {
      activeNodeIds.add(targetNode.id);
      const neighbors = adjacencyMap.get(targetNode.id) || new Set();
      neighbors.forEach((nId: string) => activeNodeIds.add(nId));

      links.forEach(l => {
        if (l.source.id === targetNode.id || l.target.id === targetNode.id) {
          activeLinkIds.add(l.id);
        }
      });
    } else {
      // Check if target is a link
      const targetLink = links.find(l => l.id === activeTargetId);
      if (targetLink) {
        activeLinkIds.add(targetLink.id);
        activeNodeIds.add(targetLink.source.id);
        activeNodeIds.add(targetLink.target.id);
      }
    }

    return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: true };
  }, [hoveredItem, selectedId, searchMatchIds, nodes, links, adjacencyMap]);

  // Node Selection Handler
  const handleSelectNode = useCallback((node: NetworkNode) => {
    const nextId = selectedId === node.id ? null : node.id;
    setInternalSelectedId(nextId);
    const neighborsCount = (adjacencyMap.get(node.id) || new Set()).size;
    setAnnouncement(`Selected node ${node.label}. Connected to ${neighborsCount} neighbor nodes.`);
    if (onNodeClick) onNodeClick(node);
    if (onSelectionChange) onSelectionChange(nextId ? { type: 'node', node } : null);
  }, [selectedId, adjacencyMap, onNodeClick, onSelectionChange]);

  // Convert client pointer to transformed SVG coordinate
  const getTransformedCoordinates = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return { x: clientX, y: clientY };
    const rect = svgRef.current.getBoundingClientRect();
    const rawX = clientX - rect.left;
    const rawY = clientY - rect.top;
    return {
      x: (rawX - pan.x) / zoom,
      y: (rawY - pan.y) / zoom
    };
  }, [pan, zoom]);

  // Interactive Node Drag Start
  const handleNodeMouseDown = useCallback((node: NetworkNode, e: React.MouseEvent) => {
    if (!draggableNodes) return;
    e.stopPropagation();
    setDraggingNodeId(node.id);
    const coords = getTransformedCoordinates(e.clientX, e.clientY);
    setDragOffset({
      x: coords.x - (node.x || 0),
      y: coords.y - (node.y || 0)
    });
  }, [draggableNodes, getTransformedCoordinates]);

  // Mouse Move Handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingNodeId) {
      const coords = getTransformedCoordinates(e.clientX, e.clientY);
      const newX = coords.x - dragOffset.x;
      const newY = coords.y - dragOffset.y;

      setNodePositions(prev => {
        const next = new Map(prev);
        next.set(draggingNodeId, { x: newX, y: newY });
        return next;
      });
    } else if (isPanning && zoomable) {
      setPan({ x: e.clientX - startPan.x, y: e.clientY - startPan.y });
    }
  }, [draggingNodeId, dragOffset, getTransformedCoordinates, isPanning, zoomable, startPan, setNodePositions]);

  const handleMouseUp = useCallback(() => {
    if (draggingNodeId) {
      const node = nodes.find(n => n.id === draggingNodeId);
      if (node) {
        setAnnouncement(`Repositioned node ${node.label}. Connected edges stretched.`);
      }
      setDraggingNodeId(null);
    }
    setIsPanning(false);
  }, [draggingNodeId, nodes]);

  // Keyboard Navigation across nodes & modal shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'F11' && e.altKey) {
      e.preventDefault();
      setShowTableModal(prev => !prev);
      return;
    }
    if (e.key === 'Escape') {
      if (showTableModal) {
        e.preventDefault();
        setShowTableModal(false);
        return;
      }
      if (selectedId) {
        e.preventDefault();
        setInternalSelectedId(null);
        if (onSelectionChange) onSelectionChange(null);
        return;
      }
    }

    if (nodes.length === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = (prev + 1) % nodes.length;
        const target = nodes[next];
        setAnnouncement(`Focused ${target.label}, degree ${target.degree}`);
        return next;
      });
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = (prev - 1 + nodes.length) % nodes.length;
        const target = nodes[next];
        setAnnouncement(`Focused ${target.label}, degree ${target.degree}`);
        return next;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < nodes.length) {
        handleSelectNode(nodes[focusedIndex]);
      }
    }
  }, [nodes, focusedIndex, handleSelectNode, showTableModal, selectedId, onSelectionChange]);

  // Pan & Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(3.5, z + 0.25));
  const handleZoomOut = () => setZoom(z => Math.max(0.3, z - 0.25));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setNodePositions(new Map());
    setSpreadMultiplier(initialSpread);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (!zoomable) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  if (!nodes || nodes.length === 0) {
    return (
      <div className={`network-empty ${className}`} style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-sunken, #f8fafc)', border: '1px dashed var(--border-subtle, #cbd5e1)', borderRadius: 'var(--radius-md, 8px)', color: 'var(--text-muted, #64748b)', fontSize: '13px' }}>
        No relational network data available to display
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`network-container ${className}`}
      style={{
        position: 'relative',
        width: typeof width === 'number' ? `${width}px` : width,
        maxWidth: '100%',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        userSelect: 'none',
        ...style
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Network Diagram: ${title || 'Relational Graph'}. ${nodes.length} nodes, ${links.length} edges. Drag nodes to stretch clusters. Spread slider (${minSpread}x to ${maxSpread}x) expands spacing. Use arrow keys to navigate nodes, Enter to isolate neighborhood.`}
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

        {/* Toolbar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Dynamic Network Spread / Stretch Slider with Configurable Range */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-secondary, #475569)', background: 'var(--surface-sunken, #f1f5f9)', padding: '2px 8px', borderRadius: 'var(--radius-sm, 4px)' }}>
            <span style={{ fontWeight: 600 }}>Stretch:</span>
            <input
              type="range"
              min={minSpread}
              max={maxSpread}
              step="0.1"
              value={spreadMultiplier}
              onChange={e => setSpreadMultiplier(parseFloat(e.target.value))}
              style={{ width: '75px', cursor: 'ew-resize' }}
              title={`Expand / Stretch Network Spacing (${minSpread}x - ${maxSpread}x)`}
              aria-label={`Stretch network edge spacing from ${minSpread}x to ${maxSpread}x`}
            />
            <span style={{ fontSize: '10px', fontVariantNumeric: 'tabular-nums', width: '28px' }}>
              {spreadMultiplier.toFixed(1)}x
            </span>
          </div>

          {searchable && (
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search node..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  fontSize: '11px',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm, 4px)',
                  border: '1px solid var(--border-subtle, #cbd5e1)',
                  background: 'var(--surface-card, #ffffff)',
                  color: 'var(--text-primary, #0f172a)',
                  width: '115px'
                }}
                aria-label="Filter network nodes"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '12px', color: '#94a3b8' }}
                >
                  &times;
                </button>
              )}
            </div>
          )}

          {zoomable && (
            <div style={{ display: 'inline-flex', background: 'var(--surface-card, #ffffff)', border: '1px solid var(--border-subtle, #cbd5e1)', borderRadius: 'var(--radius-sm, 4px)', overflow: 'hidden' }}>
              <button
                type="button"
                onClick={handleZoomIn}
                style={{ padding: '3px 8px', background: 'transparent', border: 'none', borderRight: '1px solid var(--border-subtle, #cbd5e1)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary, #475569)' }}
                title="Zoom In"
              >
                +
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                style={{ padding: '3px 8px', background: 'transparent', border: 'none', borderRight: '1px solid var(--border-subtle, #cbd5e1)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: 'var(--text-secondary, #475569)' }}
                title="Zoom Out"
              >
                &minus;
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                style={{ padding: '3px 8px', background: 'transparent', border: 'none', fontSize: '11px', cursor: 'pointer', color: 'var(--text-secondary, #475569)' }}
                title="Reset View and Node Positions"
              >
                Reset
              </button>
            </div>
          )}

          {/* Accessible Table Modal Toggle Button */}
          <button
            type="button"
            onClick={() => setShowTableModal(prev => !prev)}
            style={{
              padding: '3px 8px',
              background: showTableModal ? 'var(--action-solid, #2563eb)' : 'var(--surface-card, #ffffff)',
              color: showTableModal ? '#ffffff' : 'var(--text-secondary, #475569)',
              border: '1px solid var(--border-subtle, #cbd5e1)',
              borderRadius: 'var(--radius-sm, 4px)',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
            title="Toggle Accessible Relationship Table View (Alt+F11)"
            aria-label="Toggle Accessible Relationship Table View"
          >
            Table (Alt+F11)
          </button>
        </div>
      </div>

      {/* SVG Canvas for Network Graph */}
      <svg
        ref={svgRef}
        width="100%"
        height={plotHeight}
        viewBox={`0 0 ${plotWidth} ${plotHeight}`}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          display: 'block',
          background: 'var(--surface-card, #ffffff)',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          borderRadius: 'var(--radius-md, 6px)',
          overflow: 'hidden',
          cursor: draggingNodeId ? 'grabbing' : (isPanning ? 'grabbing' : (zoomable ? 'grab' : 'default'))
        }}
      >
        <defs>
          {/* Arrowhead marker for directed edges */}
          {directed && (
            <marker
              id="net-arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--border-strong, #94a3b8)" />
            </marker>
          )}
          {directed && (
            <marker
              id="net-arrow-active"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--action-solid, #2563eb)" />
            </marker>
          )}
          <filter id="net-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" floodColor="#2563eb" />
          </filter>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* 1. Relational Edges with Perimeter Clipping */}
          <g className="network-edges">
            {links.map((link: any) => {
              const isPathActive = activeNeighborhood.linkIds.has(link.id);
              const isDimmed = activeNeighborhood.isActive && !isPathActive;
              const isSelected = link.id === selectedId;

              const strokeWidth = Math.max(1, Math.min(6, Math.sqrt(link.weight || 1) * 1.5));
              const coords = computeEdgePerimeterCoords(link.source, link.target, directed ? 6 : 0);

              return (
                <line
                  key={link.id}
                  x1={coords.x1}
                  y1={coords.y1}
                  x2={coords.x2}
                  y2={coords.y2}
                  stroke={isPathActive || isSelected ? 'var(--action-solid, #2563eb)' : 'var(--border-strong, #cbd5e1)'}
                  strokeWidth={isPathActive || isSelected ? strokeWidth + 1.5 : strokeWidth}
                  strokeOpacity={isDimmed ? 0.1 : (isPathActive ? 0.9 : 0.55)}
                  markerEnd={directed ? (isPathActive ? 'url(#net-arrow-active)' : 'url(#net-arrow)') : undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    setInternalSelectedId(link.id);
                    if (onLinkClick) onLinkClick(link);
                  }}
                  onMouseEnter={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    setHoveredItem({
                      type: 'link',
                      item: link,
                      id: link.id,
                      clientX: e.clientX - (rect?.left || 0),
                      clientY: e.clientY - (rect?.top || 0)
                    });
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{
                    cursor: 'pointer',
                    transition: draggingNodeId ? 'none' : 'stroke 0.15s ease, stroke-opacity 0.15s ease'
                  }}
                />
              );
            })}
          </g>

          {/* 2. Entity Nodes */}
          <g className="network-nodes">
            {nodes.map((node: NetworkNode) => {
              const isSelected = node.id === selectedId;
              const isFocused = nodes[focusedIndex]?.id === node.id;
              const isNeighborActive = activeNeighborhood.nodeIds.has(node.id);
              const isDimmed = activeNeighborhood.isActive && !isNeighborActive;
              const isBeingDragged = draggingNodeId === node.id;

              const style = categoryStyleMap.get(node.category || 'default') || { color: colorScale[0], symbol: 'circle' };
              const nodeRadius = node.radius || 12;

              // Node status styling
              const isCritical = node.status === 'critical';
              const isWarning = node.status === 'warning';
              const _isNominal = node.status === 'nominal';

              return (
                <g
                  key={node.id}
                  className="network-node"
                  transform={`translate(${node.x}, ${node.y})`}
                  onMouseDown={(e) => handleNodeMouseDown(node, e)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectNode(node);
                  }}
                  onMouseEnter={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    setHoveredItem({
                      type: 'node',
                      item: node,
                      id: node.id,
                      clientX: e.clientX - (rect?.left || 0),
                      clientY: e.clientY - (rect?.top || 0)
                    });
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                  style={{ cursor: isBeingDragged ? 'grabbing' : (draggableNodes ? 'grab' : 'pointer') }}
                  role="button"
                  tabIndex={-1}
                  aria-label={`${node.label} (${node.category}), degree: ${node.degree}, status: ${node.status || 'normal'}. Draggable.`}
                >
                  {/* Outer Focus / Selection Ring */}
                  {(isSelected || isFocused || isBeingDragged) && (
                    <circle
                      cx={0}
                      cy={0}
                      r={nodeRadius + 6}
                      fill="none"
                      stroke="var(--action-solid, #2563eb)"
                      strokeWidth={2}
                      strokeDasharray="3 2"
                    />
                  )}

                  {/* Status Indicator Halo Ring */}
                  {isCritical && (
                    <circle
                      cx={0}
                      cy={0}
                      r={nodeRadius + 4}
                      fill="none"
                      stroke="var(--status-critical-solid, #ef4444)"
                      strokeWidth={2.5}
                      strokeOpacity={0.85}
                    />
                  )}
                  {isWarning && (
                    <circle
                      cx={0}
                      cy={0}
                      r={nodeRadius + 3.5}
                      fill="none"
                      stroke="var(--status-warning-solid, #f59e0b)"
                      strokeWidth={2}
                      strokeOpacity={0.8}
                    />
                  )}

                  {/* Primary Node Mark */}
                  <circle
                    cx={0}
                    cy={0}
                    r={nodeRadius}
                    fill={isCritical ? 'var(--status-critical-solid, #ef4444)' : style.color}
                    stroke="#ffffff"
                    strokeWidth={isSelected || isBeingDragged ? 3 : 2}
                    opacity={isDimmed ? 0.15 : 1.0}
                    filter={isSelected || isBeingDragged ? 'url(#net-glow)' : undefined}
                    style={{ transition: draggingNodeId ? 'none' : 'opacity 0.2s ease, r 0.15s ease' }}
                  />

                  {/* Geometric Symbol Dual-Encoding Indicator (WCAG 1.4.1) */}
                  {style.symbol === 'square' && (
                    <rect
                      x={-nodeRadius / 2.5}
                      y={-nodeRadius / 2.5}
                      width={nodeRadius * 0.8}
                      height={nodeRadius * 0.8}
                      fill="#ffffff"
                      opacity={isDimmed ? 0.2 : 0.85}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  {style.symbol === 'diamond' && (
                    <polygon
                      points={`0,${-nodeRadius * 0.5} ${nodeRadius * 0.5},0 0,${nodeRadius * 0.5} ${-nodeRadius * 0.5},0`}
                      fill="#ffffff"
                      opacity={isDimmed ? 0.2 : 0.85}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}

                  {/* Status Badge Pin for Nominal/Warning/Critical */}
                  {node.status && (
                    <circle
                      cx={nodeRadius * 0.7}
                      cy={-nodeRadius * 0.7}
                      r={3.5}
                      fill={isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#10b981'}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}

                  {/* Node Title Label with Legibility Halo */}
                  <text
                    x={0}
                    y={nodeRadius + 13}
                    textAnchor="middle"
                    fontSize="10px"
                    fontWeight="600"
                    fill="var(--text-primary, #0f172a)"
                    opacity={isDimmed ? 0.2 : 1.0}
                    style={{
                      pointerEvents: 'none',
                      paintOrder: 'stroke fill',
                      stroke: 'var(--surface-card, #ffffff)',
                      strokeWidth: 3.5,
                      strokeLinejoin: 'round',
                      strokeLinecap: 'round'
                    }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Floating 2D Quad-Flip Non-Occluding Tooltip */}
      {hoveredItem && !draggingNodeId && (
        <div
          style={{
            position: 'absolute',
            left: hoveredItem.clientX > width / 2
              ? Math.max(12, hoveredItem.clientX - 230)
              : Math.min(hoveredItem.clientX + 16, width - 230),
            top: hoveredItem.clientY > height / 2
              ? Math.max(12, hoveredItem.clientY - 120)
              : Math.min(hoveredItem.clientY + 14, height - 120),
            background: 'var(--surface-floating, #0f172a)',
            color: '#f8fafc',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm, 6px)',
            fontSize: '11px',
            lineHeight: 1.4,
            boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.3))',
            pointerEvents: 'none',
            zIndex: 60,
            maxWidth: '220px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
          role="tooltip"
        >
          {hoveredItem.type === 'node' ? (
            <>
              <div style={{ fontWeight: 600, fontSize: '12px', color: '#ffffff' }}>
                {hoveredItem.item.label}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '10px' }}>
                Category: {hoveredItem.item.category || 'Standard'}
              </div>
              {hoveredItem.item.status && (
                <div style={{ fontSize: '10px', marginTop: '2px', color: hoveredItem.item.status === 'critical' ? '#f87171' : hoveredItem.item.status === 'warning' ? '#fbbf24' : '#4ade80' }}>
                  Status: <strong>{hoveredItem.item.status.toUpperCase()}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Network Degree:</span>
                <strong style={{ color: '#38bdf8' }}>{hoveredItem.item.degree} connections</strong>
              </div>
              <div style={{ color: '#64748b', fontSize: '9px', marginTop: '2px', fontStyle: 'italic' }}>
                (Click node to isolate neighborhood · Drag to stretch)
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 600, fontSize: '12px', color: '#ffffff' }}>
                {hoveredItem.item.source.label || hoveredItem.item.source.id} &rarr; {hoveredItem.item.target.label || hoveredItem.item.target.id}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Edge Weight:</span>
                <strong style={{ color: '#38bdf8' }}>{hoveredItem.item.weight}</strong>
              </div>
              {hoveredItem.item.label && (
                <div style={{ color: '#94a3b8', fontSize: '10px', marginTop: '2px' }}>
                  Relation: {hoveredItem.item.label}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Accessible Relationship Table Modal (Alt+F11) */}
      {showTableModal && (
        <div ref={tableDialogRef} tabIndex={-1}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(2px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Accessible Network Adjacency Table"
        >
          <div
            style={{
              background: 'var(--surface-card, #ffffff)',
              borderRadius: 'var(--radius-md, 8px)',
              border: '1px solid var(--border-subtle, #cbd5e1)',
              boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.2))',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle, #e2e8f0)' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                  Accessible Network Topology Table
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary, #64748b)' }}>
                  Non-spatial tabular representation of graph vertices and connections
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '18px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: 'var(--text-secondary, #64748b)'
                }}
                aria-label="Close table modal"
              >
                &times;
              </button>
            </div>

            <div style={{ overflowY: 'auto', padding: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-sunken, #f8fafc)', borderBottom: '2px solid var(--border-subtle, #e2e8f0)' }}>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>Node Label</th>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>Category</th>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>Degree</th>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>Status</th>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)', fontWeight: 600 }}>Connected Neighbors</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map(n => {
                    const neighbors = Array.from(adjacencyMap.get(n.id) || []).join(', ') || 'None';
                    return (
                      <tr key={n.id} style={{ borderBottom: '1px solid var(--border-subtle, #f1f5f9)' }}>
                        <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>{n.label}</td>
                        <td style={{ padding: '8px 10px', color: 'var(--text-secondary, #64748b)' }}>{n.category || '—'}</td>
                        <td style={{ padding: '8px 10px', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{n.degree}</td>
                        <td style={{ padding: '8px 10px' }}>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: n.status === 'critical' ? '#fee2e2' : n.status === 'warning' ? '#fef3c7' : '#ecfdf5',
                              color: n.status === 'critical' ? '#b91c1c' : n.status === 'warning' ? '#92400e' : '#047857'
                            }}
                          >
                            {n.status ? n.status.toUpperCase() : 'NOMINAL'}
                          </span>
                        </td>
                        <td style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)', fontSize: '11px' }}>{neighbors}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '10px 16px', background: 'var(--surface-sunken, #f8fafc)', borderTop: '1px solid var(--border-subtle, #e2e8f0)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                style={{
                  padding: '5px 12px',
                  background: 'var(--action-solid, #2563eb)',
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

export default NetworkDiagram;
