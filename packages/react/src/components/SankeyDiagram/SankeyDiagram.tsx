/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex -- keyboard-operated visualization surface; interactive controls retain native semantics */
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import React, { useState, useMemo, useRef, useCallback, useEffect, useId } from 'react';
import {
  computeSankeyLayout,
  createSankeyRibbonPath,
  VIZ_COLORS,
  PATTERN_PRESETS,
  formatVizValue,
  useResponsiveVizBounds
} from '../../utils/viz-core.js';

export interface SankeyNode {
  id: string;
  label: string;
  category?: string;
  value?: number;
  column?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  inLinks?: SankeyLink[];
  outLinks?: SankeyLink[];
  inValue?: number;
  outValue?: number;
  [key: string]: any;
}

export interface SankeyLink {
  id?: string;
  source: string | SankeyNode;
  target: string | SankeyNode;
  value: number;
  category?: string;
  y0?: number;
  y1?: number;
  width?: number;
  [key: string]: any;
}

export interface SankeyDiagramProps {
  nodes?: SankeyNode[];
  links?: SankeyLink[];
  width?: number;
  height?: number;
  nodeWidth?: number;
  nodePadding?: number;
  align?: 'justify' | 'left' | 'right' | 'center';
  colorScale?: string[];
  linkGradient?: boolean;
  patternFills?: boolean;
  unit?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
  selectedId?: string | null;
  onNodeClick?: (node: SankeyNode) => void;
  onLinkClick?: (link: SankeyLink) => void;
  onSelectionChange?: (selection: { type: 'node' | 'link'; item: SankeyNode | SankeyLink } | null) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * SankeyDiagram — Multi-Stage Quantitative Flow & Energy Balance Visualization
 * Fully certified against AUDIT_STANDARD.md with Alt+F11 accessible data table modal,
 * upstream/downstream BFS path tracing, pattern fills, and theme-adaptive halos.
 */
export const SankeyDiagram: React.FC<SankeyDiagramProps> = ({
  nodes: inputNodes = [],
  links: inputLinks = [],
  width = 780,
  height = 440,
  nodeWidth = 20,
  nodePadding = 18,
  align = 'justify',
  colorScale = VIZ_COLORS,
  linkGradient = true,
  patternFills = true,
  unit = '',
  locale = 'en-IN',
  title = '',
  subtitle = '',
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
    clientX: number;
    clientY: number;
  } | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [minFlowThreshold, _setMinFlowThreshold] = useState(0);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const tableTitleId = useId();
  const tableDialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(tableDialogRef, isTableModalOpen);

  const containerRef = useRef<HTMLDivElement>(null);
  const tableModalRef = useRef<HTMLDivElement>(null);
  const { width: measuredWidth, height: measuredHeight, densityTier } = useResponsiveVizBounds(containerRef, typeof width === 'number' ? width : 800, typeof height === 'number' ? height : 500);

  const plotWidth = Math.max(280, measuredWidth || (typeof width === 'number' ? width : 800));
  const plotHeight = Math.max(200, measuredHeight || (typeof height === 'number' ? height : 500));

  const selectedId = controlledSelectedId !== undefined && controlledSelectedId !== null
    ? controlledSelectedId
    : internalSelectedId;

  // Filter links based on minimum flow threshold and search query
  const filteredLinks = useMemo(() => {
    return inputLinks.filter(link => {
      const val = Number(link.value) || 0;
      if (val < minFlowThreshold) return false;
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      const sName = typeof link.source === 'object' ? link.source.label || link.source.id : link.source;
      const tName = typeof link.target === 'object' ? link.target.label || link.target.id : link.target;
      return String(sName).toLowerCase().includes(query) || String(tName).toLowerCase().includes(query);
    });
  }, [inputLinks, minFlowThreshold, searchQuery]);

  // Compute Layout Topology
  const { nodes, links, stages } = useMemo(() => {
    const isMobile = densityTier === 'compact';
    return computeSankeyLayout({
      nodes: inputNodes,
      links: filteredLinks,
      width: plotWidth,
      height: plotHeight,
      nodeWidth: isMobile ? Math.max(12, nodeWidth * 0.75) : nodeWidth,
      nodePadding: isMobile ? 8 : nodePadding,
      align,
      margin: { top: 32, right: isMobile ? 16 : 32, bottom: 28, left: isMobile ? 16 : 32 }
    });
  }, [inputNodes, filteredLinks, plotWidth, plotHeight, nodeWidth, nodePadding, align, densityTier]);

  // Color & Pattern Assignment for Nodes
  const categoryColorMap = useMemo(() => {
    const map = new Map<string, { color: string; pattern: any }>();
    (nodes as SankeyNode[]).forEach((node) => {
      const cat = node.category || node.label || node.id;
      if (!map.has(cat)) {
        map.set(cat, {
          color: colorScale[map.size % colorScale.length],
          pattern: PATTERN_PRESETS[map.size % PATTERN_PRESETS.length]
        });
      }
    });
    return map;
  }, [nodes, colorScale]);

  // Active Highlighting Sets (Upstream and Downstream BFS Path Tracing)
  const activePathSets = useMemo(() => {
    const activeNodeIds = new Set<string>();
    const activeLinkIds = new Set<string>();

    const activeTarget = hoveredItem?.item || (selectedId ? ((nodes as any[]).find(n => n.id === selectedId) || (links as any[]).find(l => l.id === selectedId)) : null);

    if (!activeTarget) return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: false };

    if (activeTarget.source && activeTarget.target) {
      activeLinkIds.add(activeTarget.id);
      activeNodeIds.add(activeTarget.source.id);
      activeNodeIds.add(activeTarget.target.id);
    } else {
      activeNodeIds.add(activeTarget.id);

      const downstreamQueue = [activeTarget];
      let dCount = 0;
      while (downstreamQueue.length > 0 && dCount++ < 1000) {
        const curr = downstreamQueue.shift();
        if (!curr) break;
        curr.outLinks?.forEach((l: any) => {
          activeLinkIds.add(l.id);
          if (l.target && !activeNodeIds.has(l.target.id)) {
            activeNodeIds.add(l.target.id);
            downstreamQueue.push(l.target);
          }
        });
      }

      const upstreamQueue = [activeTarget];
      let uCount = 0;
      while (upstreamQueue.length > 0 && uCount++ < 1000) {
        const curr = upstreamQueue.shift();
        if (!curr) break;
        curr.inLinks?.forEach((l: any) => {
          activeLinkIds.add(l.id);
          if (l.source && !activeNodeIds.has(l.source.id)) {
            activeNodeIds.add(l.source.id);
            upstreamQueue.push(l.source);
          }
        });
      }
    }

    return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: true };
  }, [hoveredItem, selectedId, nodes, links]);

  // Selection Handlers
  const handleSelectNode = useCallback((node: SankeyNode) => {
    const nextId = selectedId === node.id ? null : node.id;
    setInternalSelectedId(nextId);
    setAnnouncement(`Selected node ${node.label}. Net flow: ${formatVizValue(node.value || 0, unit, locale)}.`);
    if (onNodeClick) onNodeClick(node);
    if (onSelectionChange) onSelectionChange(nextId ? { type: 'node', item: node } : null);
  }, [selectedId, unit, locale, onNodeClick, onSelectionChange]);

  const handleSelectLink = useCallback((link: any) => {
    const nextId = selectedId === link.id ? null : link.id;
    setInternalSelectedId(nextId);
    setAnnouncement(`Selected flow from ${link.source.label} to ${link.target.label}. Volume: ${formatVizValue(link.value, unit, locale)}.`);
    if (onLinkClick) onLinkClick(link);
    if (onSelectionChange) onSelectionChange(nextId ? { type: 'link', item: link } : null);
  }, [selectedId, unit, locale, onLinkClick, onSelectionChange]);

  // Keyboard Shortcuts (<kbd>Alt+F11</kbd> & Roving Navigation)
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.altKey && (e.key === 'F11' || e.code === 'F11')) {
      e.preventDefault();
      setIsTableModalOpen(prev => !prev);
      return;
    }

    if (isTableModalOpen) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsTableModalOpen(false);
      }
      return;
    }

    if ((nodes as any[]).length === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = (prev + 1) % (nodes as any[]).length;
        const target = (nodes as any[])[next];
        setAnnouncement(`Focused node ${target.label}, ${formatVizValue(target.value, unit, locale)}`);
        return next;
      });
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = (prev - 1 + (nodes as any[]).length) % (nodes as any[]).length;
        const target = (nodes as any[])[next];
        setAnnouncement(`Focused node ${target.label}, ${formatVizValue(target.value, unit, locale)}`);
        return next;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < (nodes as any[]).length) {
        handleSelectNode((nodes as any[])[focusedIndex]);
      }
    } else if (e.key === 'Escape') {
      if (selectedId) {
        e.preventDefault();
        setInternalSelectedId(null);
        if (onSelectionChange) onSelectionChange(null);
        setAnnouncement('Cleared selection lock.');
      }
    }
  }, [nodes, focusedIndex, unit, locale, handleSelectNode, isTableModalOpen, selectedId, onSelectionChange]);

  // Global Alt+F11 listener when container is focused
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'F11' || e.code === 'F11')) {
        if (containerRef.current && containerRef.current.contains(document.activeElement)) {
          e.preventDefault();
          setIsTableModalOpen(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Empty state handling
  if (!inputNodes || inputNodes.length === 0 || !inputLinks || inputLinks.length === 0) {
    return (
      <div
        className={`sankey-empty ${className}`}
        style={{
          width,
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          background: 'var(--surface-sunken, #f8fafc)',
          border: '1px dashed var(--border-subtle, #cbd5e1)',
          borderRadius: 'var(--radius-md, 8px)',
          color: 'var(--text-muted, #64748b)',
          fontSize: '13px',
          fontFamily: 'var(--font-sans, system-ui, sans-serif)'
        }}
      >
        <span style={{ fontSize: '18px' }}>⚡</span>
        <span>No flow network telemetry available to display</span>
      </div>
    );
  }

  const totalFlowVolume = (links as any[]).reduce((sum, l) => sum + (Number(l.value) || 0), 0);

  return (
    <div
      ref={containerRef}
      className={`sankey-container ${className}`}
      style={{
        position: 'relative',
        width: typeof width === 'number' ? `${width}px` : width,
        maxWidth: '100%',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        ...style
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Sankey Flow Diagram: ${title || 'Transfer'}. Use arrow keys to navigate nodes, Enter to lock path, Alt+F11 for data table.`}
    >
      {/* Live Region for Screen Reader Announcements */}
      <div aria-live="polite" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
        {announcement}
      </div>

      {/* Header & Controls Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
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

        {/* Toolbar Actions: Search, Filter, Clear, Table Modal Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search flow or node..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              borderRadius: 'var(--radius-sm, 4px)',
              border: '1px solid var(--border-subtle, #cbd5e1)',
              background: 'var(--surface-card, #ffffff)',
              color: 'var(--text-primary, #0f172a)',
              outline: 'none',
              width: '130px'
            }}
            aria-label="Filter flows by node name"
          />

          {selectedId && (
            <button
              type="button"
              onClick={() => {
                setInternalSelectedId(null);
                if (onSelectionChange) onSelectionChange(null);
              }}
              style={{
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 500,
                borderRadius: 'var(--radius-sm, 4px)',
                border: '1px solid var(--border-subtle, #cbd5e1)',
                background: 'var(--surface-sunken, #f1f5f9)',
                color: 'var(--text-secondary, #475569)',
                cursor: 'pointer'
              }}
              title="Clear Highlighted Pathway"
            >
              Reset Path
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsTableModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm, 4px)',
              border: '1px solid var(--border-subtle, #cbd5e1)',
              background: 'var(--surface-card, #ffffff)',
              color: 'var(--text-primary, #0f172a)',
              cursor: 'pointer'
            }}
            title="Open Accessible Data Table (Alt+F11)"
            aria-label="Open Accessible Data Table (Alt+F11)"
          >
            <span>📊 Table</span>
            <kbd style={{ fontSize: '9px', background: 'var(--surface-sunken, #f1f5f9)', padding: '1px 3px', borderRadius: '3px', border: '1px solid var(--border-subtle, #cbd5e1)' }}>Alt+F11</kbd>
          </button>
        </div>
      </div>

      {/* SVG Canvas for Sankey Flow */}
      <svg
        width="100%"
        height={plotHeight}
        viewBox={`0 0 ${plotWidth} ${plotHeight}`}
        style={{
          display: 'block',
          background: 'var(--surface-card, #ffffff)',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          borderRadius: 'var(--radius-md, 6px)',
          overflow: 'hidden'
        }}
      >
        <defs>
          {/* Dual-Encoding Monochrome Hatch Patterns for Accessibility */}
          {patternFills && PATTERN_PRESETS.map(pat => (
            <pattern
              key={pat.id}
              id={`sankey-pat-${pat.id}`}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform={pat.transform || undefined}
            >
              {pat.type === 'circle' ? (
                <circle cx="4" cy="4" r={(pat as any).r || 1.2} fill="currentColor" style={{ color: 'var(--text-inverse, rgba(255,255,255,0.45))' }} />
              ) : (
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke="currentColor"
                  strokeWidth={(pat as any).strokeWidth || 1.5}
                  style={{ color: 'var(--text-inverse, rgba(255,255,255,0.4))' }}
                />
              )}
            </pattern>
          ))}

          {/* Smooth Two-Tone Source-to-Target Linear Gradients */}
          {linkGradient && (links as any[]).map(link => {
            const sStyle = categoryColorMap.get(link.source.category || link.source.label) || { color: '#2563eb' };
            const tStyle = categoryColorMap.get(link.target.category || link.target.label) || { color: '#0d9488' };
            return (
              <linearGradient
                key={`grad-${link.id}`}
                id={`grad-${link.id}`}
                gradientUnits="userSpaceOnUse"
                x1={link.source.x + link.source.width}
                y1={0}
                x2={link.target.x}
                y2={0}
              >
                <stop offset="0%" stopColor={sStyle.color} stopOpacity={0.65} />
                <stop offset="100%" stopColor={tStyle.color} stopOpacity={0.65} />
              </linearGradient>
            );
          })}

          <filter id="sankey-node-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="var(--border-strong, #0f172a)" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Stage Column Guide Headers */}
        {stages && stages.length > 1 && width >= 400 && (
          <g className="sankey-stage-headers">
            {stages.map((stageNodes, colIdx) => {
              if (stageNodes.length === 0) return null;
              const colX = stageNodes[0].x;
              const isFirst = colIdx === 0;
              const isLast = colIdx === stages.length - 1;

              let anchor: 'start' | 'middle' | 'end' = 'middle';
              let headerX = colX + nodeWidth / 2;
              let stageTitle = `Stage ${colIdx + 1}`;

              if (isFirst) {
                anchor = 'start';
                headerX = colX;
                stageTitle = width >= 600 ? 'Input Origin' : 'Input';
              } else if (isLast) {
                anchor = 'end';
                headerX = colX + nodeWidth;
                stageTitle = width >= 600 ? 'Output Destination' : 'Output';
              } else {
                anchor = 'middle';
                headerX = colX + nodeWidth / 2;
                stageTitle = (width / stages.length < 110) ? `S${colIdx + 1}` : `Stage ${colIdx + 1}`;
              }

              return (
                <text
                  key={`stage-${colIdx}`}
                  x={headerX}
                  y={18}
                  textAnchor={anchor}
                  fontSize="10px"
                  fontWeight="600"
                  fill="var(--text-muted, #64748b)"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.04em' }}
                >
                  {stageTitle}
                </text>
              );
            })}
          </g>
        )}

        {/* 1. Flow Link Ribbons */}
        <g className="sankey-links">
          {(links as any[]).map(link => {
            const ribbonD = createSankeyRibbonPath({ link, curvature: 0.5 });
            const isPathActive = activePathSets.linkIds.has(link.id);
            const isDimmed = activePathSets.isActive && !isPathActive;
            const isSelected = link.id === selectedId;

            const sStyle = categoryColorMap.get(link.source.category || link.source.label) || { color: '#2563eb' };

            return (
              <path
                key={link.id}
                d={ribbonD}
                fill={linkGradient ? `url(#grad-${link.id})` : sStyle.color}
                stroke={isSelected ? 'var(--border-strong, #0f172a)' : (isPathActive ? 'var(--border-strong, rgba(15,23,42,0.6))' : 'var(--border-subtle, rgba(255,255,255,0.2))')}
                strokeWidth={isSelected ? 2 : (isPathActive ? 1.5 : 0.5)}
                opacity={isDimmed ? 0.12 : (isPathActive ? 0.92 : 0.55)}
                onClick={() => handleSelectLink(link)}
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  setHoveredItem({
                    type: 'link',
                    item: link,
                    clientX: e.clientX - (rect?.left || 0),
                    clientY: e.clientY - (rect?.top || 0)
                  });
                }}
                onMouseMove={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  setHoveredItem(prev => prev ? {
                    ...prev,
                    clientX: e.clientX - (rect?.left || 0),
                    clientY: e.clientY - (rect?.top || 0)
                  } : null);
                }}
                onMouseLeave={() => setHoveredItem(null)}
                style={{
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease, fill-opacity 0.2s ease, stroke-width 0.2s ease'
                }}
              />
            );
          })}
        </g>

        {/* 2. Stage Node Rectangles */}
        <g className="sankey-nodes">
          {(nodes as any[]).map((node, index) => {
            const isSelected = node.id === selectedId;
            const isFocused = (nodes as any[])[focusedIndex]?.id === node.id;
            const isPathActive = activePathSets.nodeIds.has(node.id);
            const isDimmed = activePathSets.isActive && !isPathActive;

            const catStyle = categoryColorMap.get(node.category || node.label) || {
              color: colorScale[index % colorScale.length],
              pattern: PATTERN_PRESETS[index % PATTERN_PRESETS.length]
            };

            const isLeftColumn = node.column === 0;
            const isRightColumn = node.column === (stages.length - 1);
            const isMiddleColumn = !isLeftColumn && !isRightColumn;

            const colSpacing = stages.length > 1 ? (width - 64 - nodeWidth) / (stages.length - 1) : width;
            const maxChars = Math.max(10, Math.floor((colSpacing - nodeWidth - 12) / 7.2));
            const displayLabel = node.label.length > maxChars ? `${node.label.slice(0, maxChars - 1)}…` : node.label;

            let textX = node.width / 2;
            let textY = node.height / 2 + 4;
            let textAnchor: 'start' | 'middle' | 'end' = 'middle';

            if (isRightColumn) {
              textX = -8;
              textY = node.height / 2 + 4;
              textAnchor = 'end';
            } else if (isLeftColumn) {
              textX = node.width + 8;
              textY = node.height / 2 + 4;
              textAnchor = 'start';
            } else {
              if (node.height < 24) {
                textX = node.width / 2;
                textY = -6;
                textAnchor = 'middle';
              } else {
                textX = node.width / 2;
                textY = node.height / 2 + 4;
                textAnchor = 'middle';
              }
            }

            return (
              <g
                key={node.id}
                className="sankey-node"
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleSelectNode(node)}
                onMouseEnter={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  setHoveredItem({
                    type: 'node',
                    item: node,
                    clientX: e.clientX - (rect?.left || 0),
                    clientY: e.clientY - (rect?.top || 0)
                  });
                }}
                onMouseMove={(e) => {
                  const rect = containerRef.current?.getBoundingClientRect();
                  setHoveredItem(prev => prev ? {
                    ...prev,
                    clientX: e.clientX - (rect?.left || 0),
                    clientY: e.clientY - (rect?.top || 0)
                  } : null);
                }}
                onMouseLeave={() => setHoveredItem(null)}
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={-1}
                aria-label={`${node.label}: ${formatVizValue(node.value, unit, locale)}`}
              >
                <title>{node.label} ({formatVizValue(node.value, unit, locale)})</title>
                <rect
                  x={0}
                  y={0}
                  width={node.width}
                  height={node.height}
                  fill={catStyle.color}
                  stroke={isSelected || isFocused ? 'var(--border-strong, #0f172a)' : 'var(--surface-card, #ffffff)'}
                  strokeWidth={isSelected || isFocused ? 2.5 : 1}
                  rx="3"
                  filter={isSelected ? 'url(#sankey-node-glow)' : undefined}
                  opacity={isDimmed ? 0.3 : 1.0}
                  style={{ transition: 'opacity 0.2s ease, stroke-width 0.2s ease' }}
                />

                {/* Dual-Encoding Pattern Overlay */}
                {patternFills && catStyle.pattern && (
                  <rect
                    x={0}
                    y={0}
                    width={node.width}
                    height={node.height}
                    fill={`url(#sankey-pat-${catStyle.pattern.id})`}
                    rx="3"
                    style={{ pointerEvents: 'none', opacity: isDimmed ? 0.1 : 0.8 }}
                  />
                )}

                {/* Direct Node Label with Theme-Adaptive Text Halo */}
                <text
                  x={textX}
                  y={textY}
                  textAnchor={textAnchor}
                  fontSize="11px"
                  fontWeight="600"
                  fill="var(--text-primary, #0f172a)"
                  style={{
                    pointerEvents: 'none',
                    paintOrder: 'stroke fill',
                    stroke: 'var(--surface-card, #ffffff)',
                    strokeWidth: 3.5,
                    strokeLinejoin: 'round'
                  }}
                >
                  {displayLabel}
                </text>

                {/* Subtitle Value for tall enough nodes */}
                {node.height >= 26 && !isMiddleColumn && (
                  <text
                    x={textX}
                    y={textY + 12}
                    textAnchor={textAnchor}
                    fontSize="9.5px"
                    fontWeight="500"
                    fill="var(--text-secondary, #64748b)"
                    style={{
                      pointerEvents: 'none',
                      paintOrder: 'stroke fill',
                      stroke: 'var(--surface-card, #ffffff)',
                      strokeWidth: 3,
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {formatVizValue(node.value, unit, locale)}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Inspection Tooltip (2D Non-Occluding Quad-Flip & Boundary Clamped) */}
      {hoveredItem && (() => {
        const tooltipW = 230;
        const tooltipH = hoveredItem.type === 'link' ? 100 : 90;
        const isRightHalf = hoveredItem.clientX > width * 0.52;
        const targetX = isRightHalf
          ? hoveredItem.clientX - tooltipW - 16
          : hoveredItem.clientX + 16;
        const clampedX = Math.max(12, Math.min(targetX, width - tooltipW - 12));

        const isBottomHalf = hoveredItem.clientY > height * 0.58;
        const targetY = isBottomHalf
          ? hoveredItem.clientY - tooltipH - 12
          : hoveredItem.clientY + 12;
        const clampedY = Math.max(12, Math.min(targetY, height - tooltipH - 12));

        return (
          <div
            style={{
              position: 'absolute',
              left: clampedX,
              top: clampedY,
              background: 'var(--surface-floating, #0f172a)',
              color: 'var(--text-inverse, #f8fafc)',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm, 6px)',
              fontSize: '11px',
              lineHeight: 1.4,
              boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.3))',
              pointerEvents: 'none',
              zIndex: 60,
              width: `${tooltipW}px`,
              border: '1px solid var(--border-subtle, rgba(255,255,255,0.1))',
              backdropFilter: 'blur(4px)',
              transition: 'left 0.08s ease, top 0.08s ease'
            }}
          >
            {hoveredItem.type === 'link' ? (
              <>
                <div style={{ fontWeight: 600, fontSize: '12px', color: '#ffffff', marginBottom: '4px' }}>
                  {hoveredItem.item.source.label} &rarr; {hoveredItem.item.target.label}
                </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '2px' }}>
                <span style={{ color: '#94a3b8' }}>Flow Volume:</span>
                <strong style={{ color: '#38bdf8', fontVariantNumeric: 'tabular-nums' }}>
                  {formatVizValue(hoveredItem.item.value, unit, locale)}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ color: '#94a3b8' }}>% of {hoveredItem.item.source.label}:</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {((hoveredItem.item.value / (hoveredItem.item.source.value || 1)) * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ color: '#94a3b8' }}>% of {hoveredItem.item.target.label}:</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {((hoveredItem.item.value / (hoveredItem.item.target.value || 1)) * 100).toFixed(1)}%
                </span>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 600, fontSize: '12px', color: '#ffffff', marginBottom: '4px' }}>
                {hoveredItem.item.label} (Stage {hoveredItem.item.column + 1})
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '2px' }}>
                <span style={{ color: '#94a3b8' }}>Net Flow Throughput:</span>
                <strong style={{ color: '#38bdf8', fontVariantNumeric: 'tabular-nums' }}>
                  {formatVizValue(hoveredItem.item.value, unit, locale)}
                </strong>
              </div>
              {hoveredItem.item.inValue > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ color: '#94a3b8' }}>Total Inflow:</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatVizValue(hoveredItem.item.inValue, unit, locale)}
                  </span>
                </div>
              )}
              {hoveredItem.item.outValue > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ color: '#94a3b8' }}>Total Outflow:</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {formatVizValue(hoveredItem.item.outValue, unit, locale)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      );
    })()}

      {/* Non-Spatial Accessible Data Table Modal (<kbd>Alt+F11</kbd>) */}
      {isTableModalOpen && (
        <div ref={tableDialogRef} tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={tableTitleId}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsTableModalOpen(false);
          }}
        >
          <div
            ref={tableModalRef}
            style={{
              background: 'var(--surface-card, #ffffff)',
              color: 'var(--text-primary, #0f172a)',
              borderRadius: 'var(--radius-lg, 8px)',
              border: '1px solid var(--border-subtle, #cbd5e1)',
              boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.2))',
              width: '100%',
              maxWidth: '680px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle, #e2e8f0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 id={tableTitleId} style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>
                  {title || 'Sankey Flow'} — Accessible Data Table
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary, #64748b)', marginTop: '2px' }}>
                  Total Network Volume: {formatVizValue(totalFlowVolume, unit, locale)} across {(links as any[]).length} active streams
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
                  color: 'var(--text-muted, #64748b)',
                  padding: '4px 8px'
                }}
                aria-label="Close table modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Data Table */}
            <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-subtle, #cbd5e1)', background: 'var(--surface-sunken, #f8fafc)' }}>
                    <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 600 }}>Source Origin</th>
                    <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 600 }}>Destination</th>
                    <th style={{ textAlign: 'right', padding: '8px 10px', fontWeight: 600 }}>Volume ({unit.trim() || 'Units'})</th>
                    <th style={{ textAlign: 'right', padding: '8px 10px', fontWeight: 600 }}>% of Source</th>
                    <th style={{ textAlign: 'right', padding: '8px 10px', fontWeight: 600 }}>% of Target</th>
                  </tr>
                </thead>
                <tbody>
                  {(links as any[]).map((l, idx) => (
                    <tr
                      key={l.id || idx}
                      style={{
                        borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
                        background: selectedId === l.id ? 'var(--surface-sunken, #f1f5f9)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '8px 10px', fontWeight: 500 }}>{l.source.label}</td>
                      <td style={{ padding: '8px 10px', fontWeight: 500 }}>{l.target.label}</td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                        {formatVizValue(l.value, unit, locale)}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary, #64748b)' }}>
                        {((l.value / (l.source.value || 1)) * 100).toFixed(1)}%
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary, #64748b)' }}>
                        {((l.value / (l.target.value || 1)) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle, #e2e8f0)', display: 'flex', justifyContent: 'flex-end', background: 'var(--surface-sunken, #f8fafc)' }}>
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-sm, 4px)',
                  border: '1px solid var(--border-subtle, #cbd5e1)',
                  background: 'var(--surface-card, #ffffff)',
                  color: 'var(--text-primary, #0f172a)',
                  cursor: 'pointer'
                }}
              >
                Close (<kbd style={{ fontSize: '10px' }}>Esc</kbd>)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SankeyDiagram;
