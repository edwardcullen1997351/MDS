/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-static-element-interactions -- keyboard-operated visualization surface; interactive controls retain native semantics */
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  rollupHierarchy,
  computeTreemapLayout,
  VIZ_COLORS,
  PATTERN_PRESETS,
  formatVizValue,
  useResponsiveVizBounds
} from '../../utils/viz-core.js';

export interface TreemapNode {
  id?: string;
  label: string;
  value?: number;
  category?: string;
  children?: TreemapNode[];
  [key: string]: any;
}

export interface TreemapProps {
  data: TreemapNode | TreemapNode[];
  valueKey?: string;
  labelKey?: string;
  categoryKey?: string;
  childrenKey?: string;
  width?: number;
  height?: number;
  algorithm?: 'squarified' | 'slice-and-dice';
  maxDepth?: number;
  colorScale?: string[];
  patternFills?: boolean;
  unit?: string;
  locale?: string;
  title?: string;
  subtitle?: string;
  enableDrilldown?: boolean;
  selectedId?: string | null;
  onNodeClick?: (node: any) => void;
  onNodeSelect?: (node: any) => void;
  onDrill?: (node: any, stack: string[]) => void;
  className?: string;
  style?: React.CSSProperties;
}

interface FlatTreemapNode {
  id: string;
  label: string;
  depth: number;
  category: string;
  value: number;
  formattedValue: string;
  pctSection: string;
  pctTotal: string;
  isLeaf: boolean;
  childrenCount: number;
  parentLabel: string;
  path: string;
}

function flattenTreemapHierarchy(
  node: any,
  depth = 0,
  parentLabel = '',
  parentPath = '',
  sectionTotal = 1,
  plantTotal = 1,
  unit = '',
  locale = 'en-IN'
): FlatTreemapNode[] {
  if (!node) return [];
  const currentPath = parentPath ? `${parentPath} › ${node.label}` : node.label;
  const currentVal = node.value || 0;
  const pctSection = ((currentVal / Math.max(1, sectionTotal)) * 100).toFixed(1);
  const pctTotal = ((currentVal / Math.max(1, plantTotal)) * 100).toFixed(1);
  const isLeaf = !node.children || node.children.length === 0;

  const current: FlatTreemapNode = {
    id: node.id || `node-${node.label}-${depth}`,
    label: node.label,
    depth,
    category: node.category || node.label || 'Uncategorized',
    value: currentVal,
    formattedValue: formatVizValue(currentVal, unit, locale),
    pctSection,
    pctTotal,
    isLeaf,
    childrenCount: node.children ? node.children.length : 0,
    parentLabel: parentLabel || '—',
    path: currentPath
  };

  const children = (node.children || []).flatMap((child: any) =>
    flattenTreemapHierarchy(child, depth + 1, node.label, currentPath, sectionTotal, plantTotal, unit, locale)
  );

  return [current, ...children];
}

/**
 * Treemap — Hierarchical Area Part-to-Whole Visualization Component
 *
 * Fully compliant with AUDIT_STANDARD.md & Responsive Phase 2:
 * - Reactive ResizeObserver auto-measurement for live container recalculation.
 * - 3-tier dynamic adaptive typography (desktop, tablet, mobile).
 * - Squarified (Bruls et al.) & Slice-and-Dice partitioning algorithms.
 * - Interactive breadcrumb drilldown & drillup navigation.
 * - WCAG 1.4.1 dual-encoding with high-contrast SVG hatch patterns (PATTERN_PRESETS).
 * - 2D non-occluding dark enterprise floating HUD tooltip with quad-boundary clamping.
 * - Accessible data table modal dialog (<kbd>Alt+F11</kbd>) with focus trap and Esc dismiss.
 * - Complete WAI-ARIA keyboard navigation (<kbd>Arrows</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>, <kbd>Backspace</kbd>, <kbd>Home</kbd>, <kbd>End</kbd>).
 * - Live region announcements (`aria-live="polite"`).
 * - Strict design token adherence with Light & Dark theme invariance.
 */
export const Treemap: React.FC<TreemapProps> = ({
  data,
  valueKey = 'value',
  labelKey = 'label',
  categoryKey = 'category',
  childrenKey = 'children',
  width = 880,
  height = 500,
  algorithm = 'squarified',
  maxDepth = Infinity,
  colorScale = VIZ_COLORS,
  patternFills = true,
  unit = '',
  locale = 'en-IN',
  title = '',
  subtitle = '',
  enableDrilldown = true,
  selectedId: controlledSelectedId = null,
  onNodeClick,
  onNodeSelect,
  onDrill,
  className = '',
  style
}) => {
  const [drillStack, setDrillStack] = useState<string[]>([]);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [announcement, setAnnouncement] = useState('');
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const tableDialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(tableDialogRef, isTableModalOpen);

  const containerRef = useRef<HTMLDivElement>(null);
  const { width: measuredWidth, height: measuredHeight, densityTier } = useResponsiveVizBounds(containerRef, width, height);

  const plotWidth = Math.max(280, measuredWidth || width);
  const plotHeight = Math.max(180, measuredHeight || height);

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
        const next = curr.children.find((c: any) => c.id === stepId);
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
    const map = new Map<string, { color: string; pattern: any }>();
    if (!fullRoot) return map;

    const topCategories = (fullRoot.children || [fullRoot]).map((c: any) => c.category || c.label);
    const unique = Array.from(new Set(topCategories));
    unique.forEach((cat: any, idx) => {
      map.set(cat, {
        color: colorScale[idx % colorScale.length],
        pattern: PATTERN_PRESETS[idx % PATTERN_PRESETS.length]
      });
    });
    return map;
  }, [fullRoot, colorScale]);

  // Compute layout bounding boxes dynamically against measured container pixels
  const layoutNodes = useMemo(() => {
    if (!currentRoot) return [];
    return computeTreemapLayout({
      rootNode: currentRoot,
      x: 0,
      y: 0,
      width: plotWidth,
      height: plotHeight,
      padding: 2,
      containerPadding: 4,
      headerHeight: 20,
      algorithm,
      maxDepth
    });
  }, [currentRoot, plotWidth, plotHeight, algorithm, maxDepth]);

  // Leaf and branch nodes for rendering
  const { branchNodes, leafNodes } = useMemo(() => {
    const branches: any[] = [];
    const leaves: any[] = [];
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

  const navigableNodes = useMemo(() => [...leafNodes, ...branchNodes], [leafNodes, branchNodes]);

  // Flat data for accessible table modal
  const flatData = useMemo(() => {
    if (!currentRoot || !fullRoot) return [];
    return flattenTreemapHierarchy(
      currentRoot,
      0,
      '',
      '',
      currentRoot.value || 1,
      fullRoot.value || 1,
      unit,
      locale
    );
  }, [currentRoot, fullRoot, unit, locale]);

  // Lineage breadcrumb trail
  const breadcrumbTrail = useMemo(() => {
    if (!fullRoot) return [];
    const trail = [{ id: fullRoot.id, label: fullRoot.label, depth: 0 }];
    let curr = fullRoot;
    for (let i = 0; i < drillStack.length; i++) {
      const stepId = drillStack[i];
      if (curr.children) {
        const next = curr.children.find((c: any) => c.id === stepId);
        if (next) {
          trail.push({ id: next.id, label: next.label, depth: i + 1 });
          curr = next;
        }
      }
    }
    return trail;
  }, [fullRoot, drillStack]);

  // Drilldown handler
  const handleDrillDown = useCallback((node: any) => {
    if (!enableDrilldown || node.isLeaf || !node.children || node.children.length === 0) return;
    const newStack = [...drillStack, node.id];
    setDrillStack(newStack);
    setFocusedIndex(0);
    setAnnouncement(`Drilled down into ${node.label}. Total value: ${formatVizValue(node.value, unit, locale)}.`);
    if (onDrill) onDrill(node, newStack);
  }, [drillStack, enableDrilldown, unit, locale, onDrill]);

  // Drillup handler
  const handleDrillUp = useCallback((targetDepth: number) => {
    const newStack = drillStack.slice(0, targetDepth);
    setDrillStack(newStack);
    setFocusedIndex(0);
    setAnnouncement(newStack.length === 0 ? 'Returned to top-level plant view.' : `Navigated up hierarchy to level ${targetDepth}.`);
    if (onDrill) onDrill(currentRoot, newStack);
  }, [drillStack, currentRoot, onDrill]);

  // Node selection handler
  const handleSelectNode = useCallback((node: any) => {
    setInternalSelectedId(node.id);
    const parentVal = currentRoot?.value || 1;
    const share = ((node.value / parentVal) * 100).toFixed(1);
    setAnnouncement(`Selected ${node.label}. Value: ${formatVizValue(node.value, unit, locale)} (${share}% of ${currentRoot?.label || 'Total'}).`);
    if (onNodeSelect) onNodeSelect(node);
    if (onNodeClick) onNodeClick(node);
  }, [currentRoot, unit, locale, onNodeSelect, onNodeClick]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Alt+F11 shortcut for accessible table modal
    if (e.altKey && e.key === 'F11') {
      e.preventDefault();
      setIsTableModalOpen(prev => !prev);
      setAnnouncement(isTableModalOpen ? 'Closed data table view.' : 'Opened accessible data table view.');
      return;
    }

    if (isTableModalOpen) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsTableModalOpen(false);
        setAnnouncement('Closed data table view.');
      }
      return;
    }

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
    }
  }, [isTableModalOpen, navigableNodes, focusedIndex, unit, locale, enableDrilldown, handleDrillDown, handleSelectNode, drillStack, handleDrillUp]);

  // Global Alt+F11 window listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'F11') {
        const isTargetInside = containerRef.current && containerRef.current.contains(document.activeElement);
        if (isTargetInside) {
          e.preventDefault();
          setIsTableModalOpen(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  if (!fullRoot || fullRoot.value === 0) {
    return (
      <div
        className={`treemap-empty ${className}`}
        style={{
          width: '100%',
          maxWidth: typeof width === 'number' ? `${width}px` : width,
          height: plotHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--surface-sunken, #f8fafc)',
          border: '1px dashed var(--border-subtle, #cbd5e1)',
          borderRadius: 'var(--radius-md, 8px)',
          color: 'var(--text-muted, #64748b)',
          fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          fontSize: '13px',
          ...style
        }}
      >
        No hierarchical data available to display
      </div>
    );
  }

  const focusedNode = focusedIndex >= 0 && focusedIndex < navigableNodes.length ? navigableNodes[focusedIndex] : null;

  return (
    <div
      ref={containerRef}
      className={`treemap-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: typeof width === 'number' ? `${width}px` : width,
        fontFamily: 'var(--font-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        userSelect: 'none',
        outline: 'none',
        ...style
      }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="application"
      aria-label={`Treemap: ${title || 'Hierarchical Part-to-Whole'}. Total: ${formatVizValue(fullRoot.value, unit, locale)}. Use arrow keys to navigate nodes, Enter to drill down or select, Backspace to navigate up, Alt+F11 for data table.`}
      aria-activedescendant={focusedNode ? `tm-node-${focusedNode.id}` : undefined}
    >
      {/* Screen Reader Live Announcements */}
      <div
        aria-live="polite"
        className="sr-only"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          border: 0
        }}
      >
        {announcement}
      </div>

      {/* Header & Controls Toolbar */}
      {(title || subtitle) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            {title && (
              <div style={{ fontSize: densityTier === 'mobile' ? '14px' : '15px', fontWeight: 600, color: 'var(--text-primary, #0f172a)', letterSpacing: '-0.01em' }}>
                {title}
              </div>
            )}
            {subtitle && (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary, #64748b)', marginTop: '2px' }}>
                {subtitle}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setIsTableModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--text-secondary, #475569)',
                backgroundColor: 'var(--surface-subtle, #f1f5f9)',
                border: '1px solid var(--border-subtle, #cbd5e1)',
                borderRadius: 'var(--radius-sm, 4px)',
                cursor: 'pointer'
              }}
              title="Open Accessible Data Table (Alt+F11)"
              aria-label="View hierarchy data in accessible table modal (Alt+F11)"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="12" height="12" rx="2" />
                <path d="M2 6h12M6 2v12" />
              </svg>
              Table View <span style={{ color: 'var(--text-secondary, #475569)', fontSize: '10px' }}>(Alt+F11)</span>
            </button>
          </div>
        </div>
      )}

      {/* Breadcrumbs for Hierarchy Drilldown */}
      <nav
        aria-label="Hierarchy Breadcrumbs"
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '4px',
          fontSize: '12px',
          marginBottom: '8px',
          padding: '6px 10px',
          background: 'var(--surface-sunken, #f1f5f9)',
          borderRadius: 'var(--radius-sm, 4px)',
          border: '1px solid var(--border-subtle, #e2e8f0)'
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary, #475569)', marginRight: '4px' }}>
          HIERARCHY:
        </span>
        {breadcrumbTrail.map((crumb, idx) => {
          const isLast = idx === breadcrumbTrail.length - 1;
          return (
            <React.Fragment key={crumb.id}>
              {idx > 0 && <span style={{ color: 'var(--text-secondary, #475569)', margin: '0 2px' }}>›</span>}
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
        <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: 500, color: 'var(--text-secondary, #475569)', fontVariantNumeric: 'tabular-nums' }}>
          Current View Total: <strong>{formatVizValue(currentRoot?.value, unit, locale)}</strong>
        </span>
      </nav>

      {/* SVG Canvas for Treemap with Dynamic Plot Bounds */}
      <svg
        width={plotWidth}
        height={plotHeight}
        viewBox={`0 0 ${plotWidth} ${plotHeight}`}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          maxHeight: `${plotHeight}px`,
          background: 'var(--surface-card, #ffffff)',
          border: '1px solid var(--border-subtle, #e2e8f0)',
          borderRadius: 'var(--radius-md, 6px)',
          overflow: 'hidden'
        }}
      >
        <defs>
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
                <circle cx="4" cy="4" r={(pat as any).r || 1.2} fill={(pat as any).fill || 'rgba(255,255,255,0.45)'} />
              ) : (
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="8"
                  stroke={(pat as any).stroke || 'rgba(255,255,255,0.35)'}
                  strokeWidth={(pat as any).strokeWidth || 1.5}
                />
              )}
            </pattern>
          ))}
          <filter id="tm-active-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* 1. Branch Category Containers */}
        {branchNodes.map((branch: any) => {
          const isCurrentActive = branch.id === selectedId;
          const isFocused = focusedNode?.id === branch.id;
          const hasDrillBadge = enableDrilldown && branch.width >= 80;
          const reservedRight = hasDrillBadge ? 48 : 12;
          const maxChars = Math.max(2, Math.floor((branch.width - reservedRight - 8) / 6.2));
          const headerLabel = branch.label.length > maxChars
            ? `${branch.label.slice(0, Math.max(2, maxChars - 1))}…`
            : branch.label;

          return (
            <g
              key={`branch-${branch.id}`}
              id={`tm-node-${branch.id}`}
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
                stroke={isFocused ? 'var(--action-solid, #2563eb)' : isCurrentActive ? 'var(--text-primary, #0f172a)' : 'var(--border-strong, #cbd5e1)'}
                strokeWidth={isFocused ? 2.5 : isCurrentActive ? 2 : 1}
                rx="4"
              />
              {branch.height >= 22 && branch.width >= 36 && (
                <g>
                  <rect
                    x={branch.x}
                    y={branch.y}
                    width={branch.width}
                    height={18}
                    fill="var(--surface-subtle, #e2e8f0)"
                    stroke="var(--border-strong, #cbd5e1)"
                    strokeWidth={0.5}
                    rx="4"
                  />
                  <text
                    x={branch.x + 6}
                    y={branch.y + 13}
                    fontSize={densityTier === 'mobile' ? '9.5px' : '10.5px'}
                    fontWeight="600"
                    fill="var(--text-secondary, #334155)"
                    style={{ pointerEvents: 'none' }}
                  >
                    {headerLabel}
                  </text>
                  {hasDrillBadge && (
                    <text
                      x={branch.x + branch.width - 6}
                      y={branch.y + 13}
                      textAnchor="end"
                      fontSize="9px"
                      fill="var(--action-solid, #2563eb)"
                      fontWeight="500"
                      style={{ pointerEvents: 'none' }}
                    >
                      drill →
                    </text>
                  )}
                </g>
              )}
            </g>
          );
        })}

        {/* 2. Leaf Nodes with 3-Tier Dynamic Adaptive Typography */}
        {leafNodes.map((leaf: any, index: number) => {
          const categoryStyle = categoryColorMap.get(leaf.category || leaf.label) || {
            color: colorScale[index % colorScale.length],
            pattern: PATTERN_PRESETS[index % PATTERN_PRESETS.length]
          };

          const isSelected = leaf.id === selectedId;
          const isHovered = hoveredNode?.id === leaf.id;
          const isFocused = focusedNode?.id === leaf.id;
          const parentTotal = currentRoot?.value || 1;
          const rootTotal = fullRoot?.value || 1;
          const pctParent = ((leaf.value / parentTotal) * 100).toFixed(1);
          const pctRoot = ((leaf.value / rootTotal) * 100).toFixed(1);

          // 3-Tier Dynamic Adaptive Typography Thresholds
          const isMobile = densityTier === 'mobile';
          const isTablet = densityTier === 'tablet';

          const isLarge = leaf.width >= (isMobile ? 90 : 110) && leaf.height >= (isMobile ? 55 : 70);
          const isMedium = leaf.width >= (isMobile ? 45 : 55) && leaf.height >= (isMobile ? 28 : 36);

          const labelFontSize = isMobile
            ? (isLarge ? 11 : isMedium ? 9.5 : 8.5)
            : isTablet
            ? (isLarge ? 11.5 : isMedium ? 10 : 9)
            : (isLarge ? 12.5 : isMedium ? 11 : 9.5);

          const valueFontSize = isMobile
            ? (isLarge ? 10 : isMedium ? 9 : 8)
            : isTablet
            ? (isLarge ? 11 : isMedium ? 9.5 : 8.5)
            : (isLarge ? 11.5 : isMedium ? 10 : 9);

          const pctFontSize = isMobile
            ? (isLarge ? 9.5 : isMedium ? 8.5 : 7.5)
            : isTablet
            ? (isLarge ? 10 : isMedium ? 9 : 8)
            : (isLarge ? 10.5 : isMedium ? 9.5 : 8.5);

          const showLabel = leaf.width >= (isMobile ? 24 : 30) && leaf.height >= (isMobile ? 16 : 18);
          const showValue = !isMobile && (leaf.width >= 46 && leaf.height >= 32);
          const showPercent = (!isMobile && !isTablet) && (leaf.width >= 58 && leaf.height >= 46);

          const maxChars = Math.max(2, Math.floor((leaf.width - 10) / (labelFontSize * 0.58)));

          return (
            <g
              key={`leaf-${leaf.id}`}
              id={`tm-node-${leaf.id}`}
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
                setHoveredNode((prev: any) => prev ? {
                  ...prev,
                  clientX: e.clientX - (rect?.left || 0),
                  clientY: e.clientY - (rect?.top || 0)
                } : null);
              }}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-label={`${leaf.label}: ${formatVizValue(leaf.value, unit, locale)} (${pctParent}% of section, ${pctRoot}% of total)`}
            >
              <rect
                x={0}
                y={0}
                width={Math.max(1, leaf.width)}
                height={Math.max(1, leaf.height)}
                fill={categoryStyle.color}
                stroke={isSelected || isFocused ? 'var(--text-primary, #0f172a)' : '#ffffff'}
                strokeWidth={isSelected || isFocused ? 2.5 : 1}
                rx="3"
                filter={isSelected ? 'url(#tm-active-shadow)' : undefined}
                style={{
                  transition: 'opacity 0.15s ease, stroke-width 0.15s ease',
                  opacity: (hoveredNode && !isHovered) ? 0.75 : 1.0
                }}
              />

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

              {showLabel && (
                <text
                  x={6}
                  y={isLarge ? 18 : 15}
                  fontSize={`${labelFontSize}px`}
                  fontWeight="600"
                  fill="#ffffff"
                  style={{
                    pointerEvents: 'none',
                    textShadow: '0 1px 2px rgba(0,0,0,0.7)',
                    overflow: 'hidden'
                  }}
                >
                  {leaf.label.length > maxChars ? leaf.label.slice(0, maxChars) + '…' : leaf.label}
                </text>
              )}

              {showValue && (
                <text
                  x={6}
                  y={isLarge ? 36 : 30}
                  fontSize={`${valueFontSize}px`}
                  fontWeight="500"
                  fill="rgba(255,255,255,0.95)"
                  fontFamily="var(--font-mono, monospace)"
                  style={{
                    pointerEvents: 'none',
                    fontVariantNumeric: 'tabular-nums',
                    textShadow: '0 1px 2px rgba(0,0,0,0.7)'
                  }}
                >
                  {formatVizValue(leaf.value, unit, locale)}
                </text>
              )}

              {showPercent && (
                <text
                  x={6}
                  y={isLarge ? 52 : 44}
                  fontSize={`${pctFontSize}px`}
                  fontWeight="400"
                  fill="rgba(255,255,255,0.85)"
                  style={{
                    pointerEvents: 'none',
                    fontVariantNumeric: 'tabular-nums',
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

      {/* 2D Dark Enterprise Floating HUD Tooltip with Boundary Clamping */}
      {hoveredNode && (
        <div
          style={{
            position: 'absolute',
            left: Math.max(10, Math.min(hoveredNode.clientX + 14, plotWidth - 240)),
            top: Math.max(10, Math.min(hoveredNode.clientY - 20, plotHeight - 120)),
            backgroundColor: 'var(--surface-floating, #0f172a)',
            color: '#f8fafc',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md, 6px)',
            fontSize: '11px',
            lineHeight: 1.45,
            boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(0,0,0,0.4))',
            pointerEvents: 'none',
            zIndex: 60,
            minWidth: '200px',
            maxWidth: '260px',
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <div style={{ fontWeight: 600, fontSize: '12px', color: '#ffffff', marginBottom: '2px', wordBreak: 'break-word' }}>
            {hoveredNode.label}
          </div>
          {hoveredNode.category && (
            <div style={{ color: '#38bdf8', fontSize: '10px', fontWeight: 500, marginBottom: '6px' }}>
              {hoveredNode.category}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginTop: '4px', borderTop: '1px dashed rgba(255,255,255,0.15)', paddingTop: '4px' }}>
            <span style={{ color: '#94a3b8' }}>Magnitude:</span>
            <strong style={{ color: '#38bdf8', fontVariantNumeric: 'tabular-nums' }}>
              {formatVizValue(hoveredNode.value, unit, locale)}
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ color: '#94a3b8' }}>Share of Section:</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{hoveredNode.pctParent}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <span style={{ color: '#94a3b8' }}>Share of Plant Total:</span>
            <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{hoveredNode.pctRoot}%</span>
          </div>
          {hoveredNode.parent && (
            <div style={{ color: '#64748b', fontSize: '10px', marginTop: '6px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '4px' }}>
              Parent: <span style={{ color: '#cbd5e1' }}>{hoveredNode.parent.label}</span>
            </div>
          )}
        </div>
      )}

      {/* Accessible Hierarchical Treemap Table Modal (Alt+F11) */}
      {isTableModalOpen && (
        <div ref={tableDialogRef} tabIndex={-1}
          className="treemap-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`${title || 'Treemap Hierarchy'} Data Table`}
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
            className="treemap-modal"
            style={{
              backgroundColor: 'var(--surface-card, #ffffff)',
              borderRadius: 'var(--radius-lg, 8px)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
              width: '100%',
              maxWidth: '840px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle, #e2e8f0)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                borderBottom: '1px solid var(--border-subtle, #e2e8f0)',
                backgroundColor: 'var(--surface-subtle, #f8fafc)'
              }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                  {title || 'Treemap Hierarchy'} — Hierarchical Data Table
                </h4>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary, #64748b)', marginTop: '2px' }}>
                  Total {flatData.length} records · View Total: {formatVizValue(currentRoot?.value, unit, locale)}
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
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)' }}>Hierarchy / Nomenclature</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)' }}>Category</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)', textAlign: 'right' }}>Magnitude ({unit.trim() || 'Value'})</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)', textAlign: 'right' }}>Section %</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)', textAlign: 'right' }}>Plant Total %</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)', textAlign: 'center' }}>Level</th>
                    <th style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--text-secondary, #475569)' }}>Parent</th>
                  </tr>
                </thead>
                <tbody>
                  {flatData.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      style={{
                        borderBottom: '1px solid var(--border-subtle, #f1f5f9)',
                        backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--surface-subtle, #f8fafc)'
                      }}
                    >
                      <td style={{ padding: '8px 10px', fontWeight: row.depth === 0 ? 700 : row.isLeaf ? 400 : 600, color: 'var(--text-primary, #0f172a)' }}>
                        <span style={{ display: 'inline-block', width: `${row.depth * 16}px` }} />
                        {row.depth > 0 && <span style={{ color: 'var(--text-secondary, #475569)', marginRight: '6px' }}>└─</span>}
                        {row.label}
                      </td>
                      <td style={{ padding: '8px 10px', color: 'var(--text-secondary, #64748b)' }}>
                        {row.category}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--text-primary, #0f172a)' }}>
                        {row.formattedValue}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary, #64748b)' }}>
                        {row.pctSection}%
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary, #64748b)' }}>
                        {row.pctTotal}%
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'center', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary, #64748b)' }}>
                        L{row.depth + 1}
                      </td>
                      <td style={{ padding: '8px 10px', color: 'var(--text-secondary, #64748b)' }}>
                        {row.parentLabel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '10px 18px',
                borderTop: '1px solid var(--border-subtle, #e2e8f0)',
                backgroundColor: 'var(--surface-subtle, #f8fafc)'
              }}
            >
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                style={{
                  padding: '6px 14px',
                  backgroundColor: 'var(--action-solid, #0f172a)',
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

export default Treemap;
