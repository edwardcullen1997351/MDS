import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  rollupHierarchy,
  computeTreemapLayout,
  VIZ_COLORS,
  PATTERN_PRESETS,
  formatVizValue
} from './viz-core.js';

/**
 * Treemap — Hierarchical Area Visualization Component
 *
 * Visualizes hierarchical quantitative part-to-whole relationships using nested rectangles.
 * Supports squarified & slice-and-dice layouts, interactive drilldown breadcrumb navigation,
 * adaptive label suppression, pattern accessibility overlays, keyboard navigation,
 * and accessible hierarchical data table modal (Alt+F11).
 */
export function Treemap({
  data,
  valueKey = 'value',
  labelKey = 'label',
  categoryKey = 'category',
  childrenKey = 'children',
  width = 720,
  height = 460,
  algorithm = 'squarified', // 'squarified' | 'slice-and-dice'
  maxDepth = Infinity,
  colorScale = VIZ_COLORS,
  patternFills = true,
  unit = '',
  locale = 'en-IN',
  title = '',
  subtitle = '',
  enableDrilldown = true,
  selectedId: controlledSelectedId = null,
  onNodeClick = null,
  onNodeSelect = null,
  onDrill = null,
  className = ''
}) {
  const [drillStack, setDrillStack] = useState([]);
  const [internalSelectedId, setInternalSelectedId] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showTableModal, setShowTableModal] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const containerRef = useRef(null);

  const selectedId = controlledSelectedId !== undefined && controlledSelectedId !== null
    ? controlledSelectedId
    : internalSelectedId;

  // Process full hierarchy
  const fullRoot = useMemo(() => {
    return rollupHierarchy(data, {
      labelKey,
      valueKey,
      categoryKey,
      childrenKey
    });
  }, [data, labelKey, valueKey, categoryKey, childrenKey]);

  // Current view root based on drilldown stack
  const currentRoot = useMemo(() => {
    if (!fullRoot) return null;
    if (drillStack.length === 0) return fullRoot;

    let curr = fullRoot;
    for (const stepId of drillStack) {
      if (curr.children && curr.children.length > 0) {
        const next = curr.children.find(c => c.id === stepId);
        if (next) {
          curr = next;
        } else {
          break;
        }
      }
    }
    return curr;
  }, [fullRoot, drillStack]);

  // Distinct top-level categories for stable color assignment
  const categoryColorMap = useMemo(() => {
    const map = new Map();
    if (!fullRoot) return map;

    const topCategories = (fullRoot.children || [fullRoot]).map(c => c.category || c.label);
    const unique = Array.from(new Set(topCategories));
    unique.forEach((cat, idx) => {
      map.set(cat, {
        color: colorScale[idx % colorScale.length],
        pattern: PATTERN_PRESETS[idx % PATTERN_PRESETS.length]
      });
    });
    return map;
  }, [fullRoot, colorScale]);

  // Compute layout bounding boxes
  const layoutNodes = useMemo(() => {
    if (!currentRoot) return [];
    return computeTreemapLayout({
      rootNode: currentRoot,
      x: 0,
      y: 0,
      width,
      height,
      padding: 2,
      containerPadding: 6,
      headerHeight: 22,
      algorithm,
      maxDepth
    });
  }, [currentRoot, width, height, algorithm, maxDepth]);

  // Leaf and branch nodes for rendering
  const { branchNodes, leafNodes } = useMemo(() => {
    const branches = [];
    const leaves = [];
    layoutNodes.forEach(node => {
      if (node.id === currentRoot?.id && node.depth === currentRoot?.depth) return;
      if (node.isLeaf || (maxDepth !== Infinity && node.depth >= maxDepth)) {
        leaves.push(node);
      } else {
        branches.push(node);
      }
    });
    return { branchNodes: branches, leafNodes: leaves };
  }, [layoutNodes, currentRoot, maxDepth]);

  // Drilldown handler
  const handleDrillDown = useCallback((node) => {
    if (!enableDrilldown || node.isLeaf || !node.children || node.children.length === 0) return;
    const newStack = [...drillStack, node.id];
    setDrillStack(newStack);
    setFocusedIndex(0);
    setAnnouncement(`Drilled down into ${node.label}. Total value: ${formatVizValue(node.value, unit, locale)}.`);
    if (onDrill) onDrill(node, newStack);
  }, [drillStack, enableDrilldown, unit, locale, onDrill]);

  // Drillup handler
  const handleDrillUp = useCallback((targetDepth) => {
    const newStack = drillStack.slice(0, targetDepth);
    setDrillStack(newStack);
    setFocusedIndex(0);
    setAnnouncement(newStack.length === 0 ? 'Returned to top-level plant view.' : `Navigated up hierarchy level ${targetDepth}.`);
    if (onDrill) onDrill(currentRoot, newStack);
  }, [drillStack, currentRoot, onDrill]);

  // Node selection handler
  const handleSelectNode = useCallback((node) => {
    setInternalSelectedId(node.id);
    const parentVal = currentRoot?.value || 1;
    const share = ((node.value / parentVal) * 100).toFixed(1);
    setAnnouncement(`Selected ${node.label}. Value: ${formatVizValue(node.value, unit, locale)} (${share}% of ${currentRoot?.label || 'Total'}).`);
    if (onNodeSelect) onNodeSelect(node);
    if (onNodeClick) onNodeClick(node);
  }, [currentRoot, unit, locale, onNodeSelect, onNodeClick]);

  // Keyboard Navigation across leaf and branch items
  const navigableNodes = useMemo(() => [...leafNodes, ...branchNodes], [leafNodes, branchNodes]);

  const handleKeyDown = useCallback((e) => {
    if (navigableNodes.length === 0) return;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = (prev + 1) % navigableNodes.length;
        const target = navigableNodes[next];
        setAnnouncement(`Focused ${target.label}, ${formatVizValue(target.value, unit, locale)}`);
        return next;
      });
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => {
        const next = (prev - 1 + navigableNodes.length) % navigableNodes.length;
        const target = navigableNodes[next];
        setAnnouncement(`Focused ${target.label}, ${formatVizValue(target.value, unit, locale)}`);
        return next;
      });
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < navigableNodes.length) {
        const node = navigableNodes[focusedIndex];
        if (!node.isLeaf && enableDrilldown) {
          handleDrillDown(node);
        } else {
          handleSelectNode(node);
        }
      }
    } else if (e.key === 'Backspace' || e.key === 'Escape') {
      if (drillStack.length > 0) {
        e.preventDefault();
        handleDrillUp(drillStack.length - 1);
      }
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedIndex(navigableNodes.length - 1);
    } else if (e.altKey && (e.key === 'F11' || e.keyCode === 122)) {
      e.preventDefault();
      setShowTableModal(prev => !prev);
    }
  }, [navigableNodes, focusedIndex, unit, locale, enableDrilldown, handleDrillDown, handleSelectNode, drillStack, handleDrillUp]);

  // Breadcrumb path array
  const breadcrumbTrail = useMemo(() => {
    if (!fullRoot) return [];
    const trail = [{ id: fullRoot.id, label: fullRoot.label, depth: 0 }];
    let curr = fullRoot;
    for (let i = 0; i < drillStack.length; i++) {
      const stepId = drillStack[i];
      if (curr.children) {
        const next = curr.children.find(c => c.id === stepId);
        if (next) {
          trail.push({ id: next.id, label: next.label, depth: i + 1 });
          curr = next;
        }
      }
    }
    return trail;
  }, [fullRoot, drillStack]);

  if (!fullRoot || fullRoot.value === 0) {
    return (
      <div className={`treemap-empty ${className}`} style={{ width, height, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-sunken, #f8fafc)', border: '1px dashed var(--border-subtle, #cbd5e1)', borderRadius: 'var(--radius-md, 8px)', color: 'var(--text-muted, #64748b)', fontFamily: 'var(--font-sans, system-ui, sans-serif)', fontSize: '13px' }}>
        No hierarchical data available to display
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`treemap-container ${className}`}
      style={{
        position: 'relative',
        width,
        fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        userSelect: 'none'
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Treemap: ${title || 'Hierarchical Part-to-Whole'}. Total: ${formatVizValue(fullRoot.value, unit, locale)}. Use arrow keys to navigate nodes, Enter to drill down or select, Backspace to navigate up.`}
    >
      {/* Live Region for Screen Reader Announcements */}
      <div aria-live="polite" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
        {announcement}
      </div>

      {/* Header & Breadcrumb Bar */}
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

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
            title="Open Accessible Data Table (Alt+F11)"
            aria-label="Open accessible hierarchy data table"
          >
            Accessible Table
          </button>
        </div>
      </div>

      {/* Breadcrumbs for Hierarchy Drilldown */}
      <nav aria-label="Hierarchy Breadcrumbs" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', fontSize: '12px', marginBottom: '8px', padding: '4px 8px', background: 'var(--surface-sunken, #f1f5f9)', borderRadius: 'var(--radius-sm, 4px)' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted, #64748b)', marginRight: '4px' }}>
          HIERARCHY:
        </span>
        {breadcrumbTrail.map((crumb, idx) => {
          const isLast = idx === breadcrumbTrail.length - 1;
          return (
            <React.Fragment key={crumb.id}>
              {idx > 0 && <span style={{ color: 'var(--text-muted, #94a3b8)', margin: '0 2px' }}>&rsaquo;</span>}
              <button
                type="button"
                onClick={() => !isLast && handleDrillUp(crumb.depth)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  fontSize: '12px',
                  fontWeight: isLast ? 600 : 400,
                  color: isLast ? 'var(--text-primary, #0f172a)' : 'var(--action-solid, #2563eb)',
                  cursor: isLast ? 'default' : 'pointer',
                  textDecoration: isLast ? 'none' : 'underline'
                }}
                disabled={isLast}
                aria-current={isLast ? 'location' : undefined}
              >
                {crumb.label}
              </button>
            </React.Fragment>
          );
        })}
        <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 500, color: 'var(--text-secondary, #475569)' }}>
          Total: <strong>{formatVizValue(currentRoot?.value, unit, locale)}</strong>
        </span>
      </nav>

      {/* SVG Canvas for Treemap */}
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
          {/* SVG Patterns for Accessible Texture fills */}
          {patternFills && PATTERN_PRESETS.map(pat => (
            <pattern
              key={pat.id}
              id={pat.id}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform={pat.transform || undefined}
            >
              {pat.type === 'circle' ? (
                <circle cx="4" cy="4" r={pat.r || 1.2} fill={pat.fill || 'rgba(255,255,255,0.45)'} />
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
          <filter id="tm-active-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* 1. Branch Containers */}
        {branchNodes.map(branch => {
          const isCurrentActive = branch.id === selectedId;
          return (
            <g
              key={`branch-${branch.id}`}
              className="treemap-branch"
              onClick={() => handleDrillDown(branch)}
              style={{ cursor: enableDrilldown ? 'zoom-in' : 'default' }}
            >
              <rect
                x={branch.x}
                y={branch.y}
                width={branch.width}
                height={branch.height}
                fill="var(--surface-sunken, #f8fafc)"
                stroke="var(--border-strong, #cbd5e1)"
                strokeWidth={isCurrentActive ? 2 : 1}
                rx="4"
              />
              {branch.height >= 24 && branch.width >= 40 && (
                <g>
                  <rect
                    x={branch.x}
                    y={branch.y}
                    width={branch.width}
                    height={20}
                    fill="var(--surface-subtle, #e2e8f0)"
                    stroke="var(--border-strong, #cbd5e1)"
                    strokeWidth={0.5}
                    rx="4"
                  />
                  <text
                    x={branch.x + 6}
                    y={branch.y + 14}
                    fontSize="11px"
                    fontWeight="600"
                    fill="var(--text-secondary, #334155)"
                    style={{ pointerEvents: 'none' }}
                  >
                    {branch.label.length * 7 > branch.width - 20
                      ? branch.label.slice(0, Math.max(3, Math.floor((branch.width - 20) / 7))) + '…'
                      : branch.label}
                  </text>
                  {enableDrilldown && branch.width >= 80 && (
                    <text
                      x={branch.x + branch.width - 6}
                      y={branch.y + 14}
                      textAnchor="end"
                      fontSize="9px"
                      fill="var(--action-solid, #2563eb)"
                      fontWeight="500"
                      style={{ pointerEvents: 'none' }}
                    >
                      drill &rarr;
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* 2. Leaf Nodes */}
        {leafNodes.map((leaf, index) => {
          const categoryStyle = categoryColorMap.get(leaf.category || leaf.label) || {
            color: colorScale[index % colorScale.length],
            pattern: PATTERN_PRESETS[index % PATTERN_PRESETS.length]
          };

          const isSelected = leaf.id === selectedId;
          const isHovered = hoveredNode?.id === leaf.id;
          const isFocused = navigableNodes[focusedIndex]?.id === leaf.id;
          const parentTotal = currentRoot?.value || 1;
          const rootTotal = fullRoot?.value || 1;
          const pctParent = ((leaf.value / parentTotal) * 100).toFixed(1);
          const pctRoot = ((leaf.value / rootTotal) * 100).toFixed(1);

          const showLabel = leaf.width >= 40 && leaf.height >= 24;
          const showValue = leaf.width >= 60 && leaf.height >= 40;
          const showPercent = leaf.width >= 75 && leaf.height >= 56;

          return (
            <g
              key={`leaf-${leaf.id}`}
              className="treemap-leaf"
              transform={`translate(${leaf.x}, ${leaf.y})`}
              onClick={() => handleSelectNode(leaf)}
              onMouseEnter={(e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setHoveredNode({
                  ...leaf,
                  pctParent,
                  pctRoot,
                  clientX: e.clientX - (rect?.left || 0),
                  clientY: e.clientY - (rect?.top || 0)
                });
              }}
              onMouseMove={(e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                setHoveredNode(prev => prev ? {
                  ...prev,
                  clientX: e.clientX - (rect?.left || 0),
                  clientY: e.clientY - (rect?.top || 0)
                } : null);
              }}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
              tabIndex={-1}
              role="button"
              aria-label={`${leaf.label}: ${formatVizValue(leaf.value, unit, locale)} (${pctParent}% of section)`}
            >
              {/* Solid Color Base Fill */}
              <rect
                x={0}
                y={0}
                width={Math.max(1, leaf.width)}
                height={Math.max(1, leaf.height)}
                fill={categoryStyle.color}
                stroke={isSelected || isFocused ? 'var(--action-solid, #0f172a)' : '#ffffff'}
                strokeWidth={isSelected || isFocused ? 2.5 : 1}
                rx="3"
                filter={isSelected ? 'url(#tm-active-shadow)' : undefined}
                style={{
                  transition: 'opacity 0.15s ease, stroke-width 0.15s ease',
                  opacity: (hoveredNode && !isHovered) ? 0.75 : 1.0
                }}
              />

              {/* Accessible Hatch Pattern Overlay */}
              {patternFills && categoryStyle.pattern && (
                <rect
                  x={0}
                  y={0}
                  width={Math.max(1, leaf.width)}
                  height={Math.max(1, leaf.height)}
                  fill={`url(#${categoryStyle.pattern.id})`}
                  rx="3"
                  style={{ pointerEvents: 'none', opacity: 0.85 }}
                />
              )}

              {/* Focus Ring */}
              {isFocused && (
                <rect
                  x={1}
                  y={1}
                  width={Math.max(1, leaf.width - 2)}
                  height={Math.max(1, leaf.height - 2)}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  strokeDasharray="3 2"
                  rx="2"
                  style={{ pointerEvents: 'none' }}
                />
              )}

              {/* Text Labels */}
              {showLabel && (
                <text
                  x={6}
                  y={16}
                  fontSize="11px"
                  fontWeight="600"
                  fill="#ffffff"
                  style={{
                    pointerEvents: 'none',
                    textShadow: '0 1px 2px rgba(0,0,0,0.7)',
                    overflow: 'hidden'
                  }}
                >
                  {leaf.label.length * 6.5 > leaf.width - 12
                    ? leaf.label.slice(0, Math.max(2, Math.floor((leaf.width - 12) / 6.5))) + '…'
                    : leaf.label}
                </text>
              )}

              {showValue && (
                <text
                  x={6}
                  y={32}
                  fontSize="10px"
                  fontWeight="500"
                  fill="rgba(255,255,255,0.95)"
                  style={{
                    pointerEvents: 'none',
                    textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                  }}
                >
                  {formatVizValue(leaf.value, unit, locale)}
                </text>
              )}

              {showPercent && (
                <text
                  x={6}
                  y={46}
                  fontSize="9px"
                  fontWeight="400"
                  fill="rgba(255,255,255,0.85)"
                  style={{
                    pointerEvents: 'none',
                    textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                  }}
                >
                  {pctParent}%
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredNode && (
        <div
          style={{
            position: 'absolute',
            left: Math.min(hoveredNode.clientX + 14, width - 180),
            top: Math.max(10, Math.min(hoveredNode.clientY - 20, height - 100)),
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
        >
          <div style={{ fontWeight: 600, fontSize: '12px', color: '#ffffff', marginBottom: '2px' }}>
            {hoveredNode.label}
          </div>
          {hoveredNode.parent && (
            <div style={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px' }}>
              Parent: {hoveredNode.parent.label}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '4px' }}>
            <span style={{ color: '#94a3b8' }}>Value:</span>
            <strong style={{ color: '#38bdf8' }}>{formatVizValue(hoveredNode.value, unit, locale)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ color: '#94a3b8' }}>Share of Section:</span>
            <span>{hoveredNode.pctParent}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ color: '#94a3b8' }}>Share of Plant Total:</span>
            <span>{hoveredNode.pctRoot}%</span>
          </div>
        </div>
      )}

      {/* Accessible Hierarchical Data Table Modal */}
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
              maxWidth: '680px',
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
            aria-label="Accessible Hierarchy Data Table"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid var(--border-subtle, #e2e8f0)' }}>
              <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                Hierarchical Data Table: {title || 'Treemap Data'}
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
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)' }}>Hierarchy / Node</th>
                    <th style={{ padding: '8px 10px', color: 'var(--text-secondary, #475569)' }}>Type</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--text-secondary, #475569)' }}>Value ({unit || 'qty'})</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: 'var(--text-secondary, #475569)' }}>Share %</th>
                  </tr>
                </thead>
                <tbody>
                  {layoutNodes.map(node => {
                    const indent = (node.depth || 0) * 16;
                    const isLeaf = node.isLeaf;
                    const rootVal = fullRoot?.value || 1;
                    const sharePct = ((node.value / rootVal) * 100).toFixed(1);

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
                        <td style={{ padding: '6px 10px', color: 'var(--text-muted, #64748b)', fontSize: '11px' }}>
                          {isLeaf ? 'Leaf' : `Level ${node.depth}`}
                        </td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                          {formatVizValue(node.value, unit, locale)}
                        </td>
                        <td style={{ padding: '6px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                          {sharePct}%
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
export default Treemap;
