import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  computeSankeyLayout,
  createSankeyRibbonPath,
  VIZ_COLORS,
  PATTERN_PRESETS,
  formatVizValue
} from './viz-core.js';

/**
 * SankeyDiagram — Multi-Stage Quantitative Flow Visualization Component
 *
 * Visualizes transfers, conversions, splits, and merges between entities or stages.
 * Features deterministic column staging, non-crossing link ribbon stacking,
 * path isolation on hover/selection, source-target gradients, hatch pattern dual-encoding,
 * keyboard roving navigation, and accessible flow table modal (Alt+F11).
 */
export function SankeyDiagram({
  nodes: inputNodes = [],
  links: inputLinks = [],
  width = 760,
  height = 440,
  nodeWidth = 18,
  nodePadding = 16,
  align = 'justify', // 'justify' | 'left' | 'right' | 'center'
  colorScale = VIZ_COLORS,
  linkGradient = true,
  patternFills = true,
  unit = '',
  locale = 'en-IN',
  title = '',
  subtitle = '',
  selectedId: controlledSelectedId = null,
  onNodeClick = null,
  onLinkClick = null,
  onSelectionChange = null,
  className = ''
}) {
  const [internalSelectedId, setInternalSelectedId] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null); // { type: 'node'|'link', item, clientX, clientY }
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showTableModal, setShowTableModal] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const containerRef = useRef(null);

  const selectedId = controlledSelectedId !== undefined && controlledSelectedId !== null
    ? controlledSelectedId
    : internalSelectedId;

  // Compute Layout Topology
  const { nodes, links, stages } = useMemo(() => {
    return computeSankeyLayout({
      nodes: inputNodes,
      links: inputLinks,
      width,
      height,
      nodeWidth,
      nodePadding,
      align
    });
  }, [inputNodes, inputLinks, width, height, nodeWidth, nodePadding, align]);

  // Color & Pattern Assignment for Nodes
  const categoryColorMap = useMemo(() => {
    const map = new Map();
    nodes.forEach((node, idx) => {
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

  // Active Highlighting Sets (Traces connected upstream & downstream paths)
  const activePathSets = useMemo(() => {
    const activeNodeIds = new Set();
    const activeLinkIds = new Set();

    const activeTarget = hoveredItem?.item || (selectedId ? (nodes.find(n => n.id === selectedId) || links.find(l => l.id === selectedId)) : null);

    if (!activeTarget) return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: false };

    if (activeTarget.source && activeTarget.target) {
      // It is a link
      activeLinkIds.add(activeTarget.id);
      activeNodeIds.add(activeTarget.source.id);
      activeNodeIds.add(activeTarget.target.id);
    } else {
      // It is a node -> trace all connected links
      activeNodeIds.add(activeTarget.id);

      // Downstream
      const downstreamQueue = [activeTarget];
      while (downstreamQueue.length > 0) {
        const curr = downstreamQueue.shift();
        curr.outLinks?.forEach(l => {
          activeLinkIds.add(l.id);
          if (!activeNodeIds.has(l.target.id)) {
            activeNodeIds.add(l.target.id);
            downstreamQueue.push(l.target);
          }
        });
      }

      // Upstream
      const upstreamQueue = [activeTarget];
      while (upstreamQueue.length > 0) {
        const curr = upstreamQueue.shift();
        curr.inLinks?.forEach(l => {
          activeLinkIds.add(l.id);
          if (!activeNodeIds.has(l.source.id)) {
            activeNodeIds.add(l.source.id);
            upstreamQueue.push(l.source);
          }
        });
      }
    }

    return { nodeIds: activeNodeIds, linkIds: activeLinkIds, isActive: true };
  }, [hoveredItem, selectedId, nodes, links]);

  // Node Selection Handler
  const handleSelectNode = useCallback((node) => {
    const nextId = selectedId === node.id ? null : node.id;
    setInternalSelectedId(nextId);
    setAnnouncement(`Selected node ${node.label}. Net flow: ${formatVizValue(node.value, unit, locale)}.`);
    if (onNodeClick) onNodeClick(node);
    if (onSelectionChange) onSelectionChange(nextId ? { type: 'node', node } : null);
  }, [selectedId, unit, locale, onNodeClick, onSelectionChange]);

  // Link Selection Handler
  const handleSelectLink = useCallback((link) => {
    const nextId = selectedId === link.id ? null : link.id;
    setInternalSelectedId(nextId);
    setAnnouncement(`Selected flow from ${link.source.label} to ${link.target.label}. Quantity: ${formatVizValue(link.value, unit, locale)}.`);
    if (onLinkClick) onLinkClick(link);
    if (onSelectionChange) onSelectionChange(nextId ? { type: 'link', link } : null);
  }, [selectedId, unit, locale, onLinkClick, onSelectionChange]);

  // Keyboard Navigation across nodes
  const handleKeyDown = useCallback((e) => {
    if (nodes.length === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = (prev + 1) % nodes.length;
        const target = nodes[next];
        setAnnouncement(`Focused node ${target.label}, ${formatVizValue(target.value, unit, locale)}`);
        return next;
      });
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = (prev - 1 + nodes.length) % nodes.length;
        const target = nodes[next];
        setAnnouncement(`Focused node ${target.label}, ${formatVizValue(target.value, unit, locale)}`);
        return next;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < nodes.length) {
        handleSelectNode(nodes[focusedIndex]);
      }
    } else if (e.altKey && (e.key === 'F11' || e.keyCode === 122)) {
      e.preventDefault();
      setShowTableModal(prev => !prev);
    }
  }, [nodes, focusedIndex, unit, locale, handleSelectNode]);

  if (!nodes || nodes.length === 0 || !links || links.length === 0) {
    return (
      <div className={`sankey-empty ${className}`} style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-sunken, #f8fafc)', border: '1px dashed var(--border-subtle, #cbd5e1)', borderRadius: 'var(--radius-md, 8px)', color: 'var(--text-muted, #64748b)', fontSize: '13px' }}>
        No flow network data available to display
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`sankey-container ${className}`}
      style={{
        position: 'relative',
        width,
        fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        userSelect: 'none'
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Sankey Flow Diagram: ${title || 'Transfer'}. Use arrow keys to navigate nodes, Enter to select path, Alt+F11 for accessible flow table.`}
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

        {/* Action Button */}
        <button
          type="button"
          onClick={() => setShowTableModal(true)}
          style={{
            fontSize: '11px',
            fontWeight: 500,
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm, 4px)',
            border: '1px solid var(--border-subtle, #cbd5e1)',
            background: 'var(--surface-card, #ffffff)',
            color: 'var(--text-secondary, #475569)',
            cursor: 'pointer'
          }}
          title="Open Accessible Flow Data Table (Alt+F11)"
          aria-label="Open accessible flow data table"
        >
          Accessible Table
        </button>
      </div>

      {/* SVG Canvas for Sankey Flow */}
      <svg
        width={width}
        height={height}
        style={{
          display: 'block',
          background: 'var(--surface-card, #ffffff)',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          borderRadius: 'var(--radius-md, 6px)',
          overflow: 'hidden'
        }}
      >
        <defs>
          {/* SVG Patterns for Accessible Node Textures */}
          {patternFills && PATTERN_PRESETS.map(pat => (
            <pattern
              key={pat.id}
              id={`sankey-${pat.id}`}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform={pat.transform || undefined}
            >
              {pat.type === 'circle' ? (
                <circle cx="4" cy="4" r={pat.r || 1.2} fill={pat.fill || 'rgba(255,255,255,0.4)'} />
              ) : (
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke={pat.stroke || 'rgba(255,255,255,0.35)'}
                  strokeWidth={pat.strokeWidth || 1.5}
                />
              )}
            </pattern>
          ))}

          {/* Gradients for Link Ribbons */}
          {linkGradient && links.map(link => {
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

          <filter id="sankey-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* 1. Flow Link Ribbons */}
        <g className="sankey-links">
          {links.map(link => {
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
                stroke={isSelected ? '#0f172a' : (isPathActive ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.2)')}
                strokeWidth={isSelected ? 1.5 : 0.5}
                opacity={isDimmed ? 0.12 : (isPathActive ? 0.9 : 0.55)}
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
                  transition: 'opacity 0.2s ease, fill-opacity 0.2s ease'
                }}
              />
            );
          })}
        </g>

        {/* 2. Stage Node Rectangles */}
        <g className="sankey-nodes">
          {nodes.map((node, index) => {
            const isSelected = node.id === selectedId;
            const isFocused = nodes[focusedIndex]?.id === node.id;
            const isPathActive = activePathSets.nodeIds.has(node.id);
            const isDimmed = activePathSets.isActive && !isPathActive;

            const catStyle = categoryColorMap.get(node.category || node.label) || {
              color: colorScale[index % colorScale.length],
              pattern: PATTERN_PRESETS[index % PATTERN_PRESETS.length]
            };

            const isLeftColumn = node.column === 0;
            const isRightColumn = node.column === (stages.length - 1);

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
                {/* Solid Base Node Bar */}
                <rect
                  x={0}
                  y={0}
                  width={node.width}
                  height={node.height}
                  fill={catStyle.color}
                  stroke={isSelected || isFocused ? '#0f172a' : '#ffffff'}
                  strokeWidth={isSelected || isFocused ? 2.5 : 1}
                  rx="3"
                  filter={isSelected ? 'url(#sankey-glow)' : undefined}
                  opacity={isDimmed ? 0.3 : 1.0}
                  style={{ transition: 'opacity 0.2s ease' }}
                />

                {/* Accessible Pattern Texture */}
                {patternFills && catStyle.pattern && (
                  <rect
                    x={0}
                    y={0}
                    width={node.width}
                    height={node.height}
                    fill={`url(#sankey-${catStyle.pattern.id})`}
                    rx="3"
                    style={{ pointerEvents: 'none', opacity: isDimmed ? 0.1 : 0.8 }}
                  />
                )}

                {/* Node Label & Quantity */}
                <text
                  x={isRightColumn ? -8 : (isLeftColumn ? node.width + 8 : node.width / 2)}
                  y={node.height / 2 + 4}
                  textAnchor={isRightColumn ? 'end' : (isLeftColumn ? 'start' : 'middle')}
                  fontSize="11px"
                  fontWeight="600"
                  fill="var(--text-primary, #0f172a)"
                  style={{
                    pointerEvents: 'none',
                    paintOrder: 'stroke',
                    stroke: 'rgba(255,255,255,0.85)',
                    strokeWidth: 3,
                    strokeLinejoin: 'round'
                  }}
                >
                  {node.label}
                </text>

                {node.height >= 24 && (
                  <text
                    x={isRightColumn ? -8 : (isLeftColumn ? node.width + 8 : node.width / 2)}
                    y={node.height / 2 + 16}
                    textAnchor={isRightColumn ? 'end' : (isLeftColumn ? 'start' : 'middle')}
                    fontSize="9px"
                    fontWeight="500"
                    fill="var(--text-secondary, #64748b)"
                    style={{ pointerEvents: 'none' }}
                  >
                    {formatVizValue(node.value, unit, locale)}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Inspection Tooltip */}
      {hoveredItem && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(hoveredItem.clientX + 14, width - 210),
            top: Math.max(10, Math.min(hoveredItem.clientY - 20, height - 100)),
            background: 'var(--surface-floating, #0f172a)',
            color: '#f8fafc',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm, 6px)',
            fontSize: '11px',
            lineHeight: 1.4,
            boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.3))',
            pointerEvents: 'none',
            zIndex: 60,
            maxWidth: '230px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          {hoveredItem.type === 'link' ? (
            <>
              <div style={{ fontWeight: 600, fontSize: '12px', color: '#ffffff', marginBottom: '2px' }}>
                {hoveredItem.item.source.label} &rarr; {hoveredItem.item.target.label}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Flow Volume:</span>
                <strong style={{ color: '#38bdf8' }}>{formatVizValue(hoveredItem.item.value, unit, locale)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ color: '#94a3b8' }}>% of {hoveredItem.item.source.label}:</span>
                <span>{((hoveredItem.item.value / hoveredItem.item.source.value) * 100).toFixed(1)}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ color: '#94a3b8' }}>% of {hoveredItem.item.target.label}:</span>
                <span>{((hoveredItem.item.value / hoveredItem.item.target.value) * 100).toFixed(1)}%</span>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontWeight: 600, fontSize: '12px', color: '#ffffff', marginBottom: '2px' }}>
                {hoveredItem.item.label} (Stage {hoveredItem.item.column + 1})
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '4px' }}>
                <span style={{ color: '#94a3b8' }}>Net Flow Value:</span>
                <strong style={{ color: '#38bdf8' }}>{formatVizValue(hoveredItem.item.value, unit, locale)}</strong>
              </div>
              {hoveredItem.item.inValue > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ color: '#94a3b8' }}>Total Inflow:</span>
                  <span>{formatVizValue(hoveredItem.item.inValue, unit, locale)}</span>
                </div>
              )}
              {hoveredItem.item.outValue > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ color: '#94a3b8' }}>Total Outflow:</span>
                  <span>{formatVizValue(hoveredItem.item.outValue, unit, locale)}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Accessible Flow Data Table Modal */}
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
              maxWidth: '720px',
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
            aria-label="Accessible Flow Data Table"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle, #e2e8f0)' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                Flow Transfer Table: {title || 'Sankey Data'}
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
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)' }}>Source Entity</th>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)' }}>Target Entity</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--text-secondary, #475569)' }}>Transfer Quantity</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--text-secondary, #475569)' }}>% of Source</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--text-secondary, #475569)' }}>% of Target</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map(link => {
                    const pctSource = ((link.value / link.source.value) * 100).toFixed(1);
                    const pctTarget = ((link.value / link.target.value) * 100).toFixed(1);

                    return (
                      <tr
                        key={link.id}
                        style={{
                          borderBottom: '1px solid var(--border-subtle, #f1f5f9)',
                          background: link.id === selectedId ? 'var(--surface-active, #eff6ff)' : 'transparent'
                        }}
                      >
                        <td style={{ padding: '6px 10px', fontWeight: 600 }}>{link.source.label}</td>
                        <td style={{ padding: '6px 10px', fontWeight: 600 }}>{link.target.label}</td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                          {formatVizValue(link.value, unit, locale)}
                        </td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                          {pctSource}%
                        </td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                          {pctTarget}%
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
export default SankeyDiagram;
