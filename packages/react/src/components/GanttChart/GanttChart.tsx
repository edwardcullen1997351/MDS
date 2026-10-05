import React,{ useCallback,useMemo,useRef,useState } from 'react';
import { useResponsiveVizBounds } from '../../utils/viz-core.js';

export type GanttVariant = 'basic' | 'progress' | 'dependency' | 'milestone' | 'grouped';
export type GanttZoomLevel = 'day' | 'week' | 'month';
export type GanttTaskStatus = 'nominal' | 'completed' | 'in-progress' | 'warning' | 'critical' | 'overdue' | 'scheduled';

export interface GanttTask {
  id: string;
  name: string;
  startDate?: string | Date | number;
  endDate?: string | Date | number;
  progress?: number;
  status?: GanttTaskStatus;
  group?: string;
  owner?: string;
  isMilestone?: boolean;
  milestoneDate?: string | Date | number;
  dependencies?: string[];
  isCritical?: boolean;
  metadata?: Record<string, any>;
  [key: string]: any;
}

export interface GanttChartProps {
  tasks: GanttTask[];
  variant?: GanttVariant;
  width?: number;
  height?: number;
  title?: string;
  subtitle?: string;
  startKey?: string;
  endKey?: string;
  progressKey?: string;
  dependenciesKey?: string;
  groupKey?: string;
  showDependencies?: boolean;
  showProgress?: boolean;
  showTodayLine?: boolean;
  todayDate?: Date | string;
  showControls?: boolean;
  showSearch?: boolean;
  defaultZoom?: GanttZoomLevel;
  className?: string;
  onTaskClick?: ((task: GanttTask, event: React.MouseEvent) => void) | null;
  renderTooltip?: (task: GanttTask) => React.ReactNode;
  ariaLabel?: string;
  showDataTable?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  nominal: 'var(--status-success-solid)',
  completed: 'var(--status-success-solid)',
  'in-progress': 'var(--action-solid)',
  warning: 'var(--status-warning-solid)',
  critical: 'var(--status-critical-solid)',
  overdue: 'var(--status-critical-solid)',
  scheduled: 'var(--status-neutral-solid)'
};

/**
 * GanttChart - Meridian Design System
 *
 * Purpose: Communicate schedules by placing activities, phases or resources as intervals on a common temporal scale.
 */
export const GanttChart: React.FC<GanttChartProps> = ({
  tasks = [],
  variant = 'dependency',
  width = 900,
  height = 460,
  title = 'Project & Maintenance Schedule Gantt Chart',
  subtitle = 'Suryodaya Autocomp Ltd · Chakan Plant (PL-04)',
  startKey = 'startDate',
  endKey = 'endDate',
  progressKey = 'progress',
  dependenciesKey = 'dependencies',
  groupKey = 'group',
  showDependencies = true,
  showProgress = true,
  showTodayLine = true,
  todayDate = new Date('2026-09-09'),
  showControls = true,
  showSearch = true,
  defaultZoom = 'day',
  className = '',
  onTaskClick = null,
  showDataTable = true
}) => {
  const [zoomLevel, setZoomLevel] = useState<GanttZoomLevel>(defaultZoom);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [hoveredTask, setHoveredTask] = useState<GanttTask | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [collapsedGroups] = useState<Record<string, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { densityTier } = useResponsiveVizBounds(containerRef, 800, height);

  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase().trim();
    return tasks.filter(t =>
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.id && t.id.toLowerCase().includes(q)) ||
      (t.owner && t.owner.toLowerCase().includes(q)) ||
      (t[groupKey] && String(t[groupKey]).toLowerCase().includes(q))
    );
  }, [tasks, searchQuery, groupKey]);

  const visibleTasks = useMemo(() => {
    const list: GanttTask[] = [];
    filteredTasks.forEach(t => {
      const grp = t[groupKey];
      if (grp && collapsedGroups[grp]) {
        return;
      }
      list.push(t);
    });
    return list;
  }, [filteredTasks, groupKey, collapsedGroups]);

  const parseTaskDate = useCallback((val: any, isEnd: boolean = false): number => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    if (val instanceof Date) return val.getTime();
    const str = String(val).trim();
    const d = new Date(str);
    if (isNaN(d.getTime())) return 0;
    if (isEnd && /^\d{4}-\d{2}-\d{2}$/.test(str)) {
      return d.getTime() + 86400000;
    }
    return d.getTime();
  }, []);

  const { minDate, maxDate, durationMs, totalDays } = useMemo(() => {
    if (!tasks || tasks.length === 0) {
      const now = new Date('2026-09-01').getTime();
      return {
        minDate: new Date(now),
        maxDate: new Date(now + 30 * 86400000),
        durationMs: 30 * 86400000,
        totalDays: 30
      };
    }

    let minTime = Infinity;
    let maxTime = -Infinity;

    tasks.forEach(t => {
      const s = t[startKey] ? parseTaskDate(t[startKey], false) : null;
      const e = t[endKey] ? parseTaskDate(t[endKey], true) : (t.milestoneDate ? parseTaskDate(t.milestoneDate, false) : s);

      if (s != null && !isNaN(s) && s < minTime) minTime = s;
      if (e != null && !isNaN(e) && e > maxTime) maxTime = e;
    });

    if (minTime === Infinity || maxTime === -Infinity) {
      const now = new Date('2026-09-01').getTime();
      return { minDate: new Date(now), maxDate: new Date(now + 30 * 86400000), durationMs: 30 * 86400000, totalDays: 30 };
    }

    const padMs = 2 * 86400000;
    const pMin = new Date(minTime - padMs);
    const pMax = new Date(maxTime + padMs);
    const dur = pMax.getTime() - pMin.getTime() || 86400000;

    return {
      minDate: pMin,
      maxDate: pMax,
      durationMs: dur,
      totalDays: Math.ceil(dur / 86400000)
    };
  }, [tasks, startKey, endKey, parseTaskDate]);

  const dayColumnWidth = zoomLevel === 'day' ? 36 : zoomLevel === 'week' ? 14 : 4;
  const timelineContentWidth = Math.max(width - 280, totalDays * dayColumnWidth);

  const timeToX = useCallback((dateStrOrTime: any) => {
    if (!dateStrOrTime) return 0;
    const t = parseTaskDate(dateStrOrTime, false);
    const ratio = (t - minDate.getTime()) / durationMs;
    return Math.max(0, ratio * timelineContentWidth);
  }, [minDate, durationMs, timelineContentWidth, parseTaskDate]);

  const timeToEndX = useCallback((dateStrOrTime: any) => {
    if (!dateStrOrTime) return 0;
    const t = parseTaskDate(dateStrOrTime, true);
    const ratio = (t - minDate.getTime()) / durationMs;
    return Math.max(0, ratio * timelineContentWidth);
  }, [minDate, durationMs, timelineContentWidth, parseTaskDate]);

  const timeTicks = useMemo(() => {
    const startMs = minDate.getTime();
    const endMs = maxDate.getTime();
    if (isNaN(startMs) || isNaN(endMs) || startMs > endMs) return [];
    const ticks: Array<{ time: number; label: string; secondary: string; isWeekend: boolean }> = [];
    const curr = new Date(startMs);
    curr.setHours(0, 0, 0, 0);
    let safetyCount = 0;
    const maxTicks = 500;

    while (curr.getTime() <= endMs && safetyCount++ < maxTicks) {
      const time = curr.getTime();
      if (zoomLevel === 'day') {
        const label = curr.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        const weekday = curr.toLocaleDateString('en-IN', { weekday: 'narrow' });
        const isWeekend = curr.getDay() === 0 || curr.getDay() === 6;
        ticks.push({ time, label, secondary: weekday, isWeekend });
        curr.setDate(curr.getDate() + 1);
      } else if (zoomLevel === 'week') {
        const label = `Wk ${Math.ceil(curr.getDate() / 7)} (${curr.toLocaleDateString('en-IN', { month: 'short' })})`;
        const secondary = curr.toLocaleDateString('en-IN', { day: '2-digit' });
        ticks.push({ time, label, secondary, isWeekend: false });
        curr.setDate(curr.getDate() + 7);
      } else {
        const label = curr.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
        ticks.push({ time, label, secondary: '', isWeekend: false });
        curr.setMonth(curr.getMonth() + 1);
      }
    }
    return ticks;
  }, [minDate, maxDate, zoomLevel]);

  const rowHeight = 36;
  const headerHeight = 44;
  const taskBarHeight = 20;

  const taskIndexMap = useMemo(() => {
    const map: Record<string, number> = {};
    visibleTasks.forEach((t, i) => {
      map[t.id] = i;
    });
    return map;
  }, [visibleTasks]);

  const getTaskBounds = useCallback((t: GanttTask) => {
    if (t.isMilestone) {
      const mx = timeToX(t.milestoneDate || t[startKey]);
      return { startX: mx - 8, endX: mx + 8 };
    }
    const s = timeToX(t[startKey]);
    const e = timeToEndX(t[endKey] || t[startKey]);
    return { startX: Math.min(s, e), endX: Math.max(s, e) };
  }, [timeToX, timeToEndX, startKey, endKey]);

  const dependencyLinks = useMemo(() => {
    if (!showDependencies && variant !== 'dependency') return [];
    const links: Array<{ id: string; sourceId: string; targetId: string; path: string; isCritical: boolean }> = [];

    visibleTasks.forEach((targetTask, targetIdx) => {
      const predecessors = targetTask[dependenciesKey] || [];
      predecessors.forEach((predId: string) => {
        const sourceIdx = taskIndexMap[predId];
        if (sourceIdx !== undefined) {
          const sourceTask = visibleTasks[sourceIdx];

          let sourceX: number;
          if (sourceTask.isMilestone) {
            sourceX = timeToX(sourceTask.milestoneDate || sourceTask[startKey]) + 8;
          } else {
            sourceX = timeToEndX(sourceTask[endKey] || sourceTask[startKey]);
          }
          const sourceY = sourceIdx * rowHeight + rowHeight / 2;

          let targetX: number;
          if (targetTask.isMilestone) {
            targetX = timeToX(targetTask.milestoneDate || targetTask[startKey]) - 8;
          } else {
            targetX = timeToX(targetTask[startKey]);
          }
          const targetY = targetIdx * rowHeight + rowHeight / 2;

          const minRow = Math.min(sourceIdx, targetIdx);
          const maxRow = Math.max(sourceIdx, targetIdx);
          const dirY = targetY > sourceY ? 1 : -1;
          const offset = 14;
          const radius = 4;
          let path = '';

          // Check max right extent of all tasks in the intermediate row span
          let maxIntermediateEndX = sourceX;
          for (let k = minRow; k <= maxRow; k++) {
            const b = getTaskBounds(visibleTasks[k]);
            if (b.endX > maxIntermediateEndX) {
              maxIntermediateEndX = b.endX;
            }
          }

          if (Math.abs(targetY - sourceY) < 4) {
            // Same horizontal line
            path = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
          } else if (targetX >= sourceX + offset * 1.5) {
            const midX = (sourceX + targetX) / 2;
            const isObstructed = visibleTasks.slice(minRow + 1, maxRow).some(t => {
              const b = getTaskBounds(t);
              return midX >= b.startX - 8 && midX <= b.endX + 8;
            });

            if (!isObstructed) {
              const r = Math.min(radius, Math.abs(midX - sourceX) / 2, Math.abs(targetY - sourceY) / 2);
              path = `M ${sourceX} ${sourceY} ` +
                     `H ${midX - r} ` +
                     `Q ${midX} ${sourceY} ${midX} ${sourceY + dirY * r} ` +
                     `V ${targetY - dirY * r} ` +
                     `Q ${midX} ${targetY} ${midX + r} ${targetY} ` +
                     `H ${targetX}`;
            } else {
              // Obstructed forward dependency: route along the inter-row gutter immediately before target
              const gutterY = targetY - dirY * (rowHeight / 2);
              const rightX = sourceX + offset;
              const leftX = targetX - offset;
              const r = Math.min(radius, offset / 2, rowHeight / 4);

              if (leftX >= rightX) {
                path = `M ${sourceX} ${sourceY} ` +
                       `H ${rightX - r} ` +
                       `Q ${rightX} ${sourceY} ${rightX} ${sourceY + dirY * r} ` +
                       `V ${gutterY - dirY * r} ` +
                       `Q ${rightX} ${gutterY} ${rightX + r} ${gutterY} ` +
                       `H ${leftX - r} ` +
                       `Q ${leftX} ${gutterY} ${leftX} ${gutterY + dirY * r} ` +
                       `V ${targetY - dirY * r} ` +
                       `Q ${leftX} ${targetY} ${leftX + r} ${targetY} ` +
                       `H ${targetX}`;
              } else {
                path = `M ${sourceX} ${sourceY} ` +
                       `H ${rightX - r} ` +
                       `Q ${rightX} ${sourceY} ${rightX} ${sourceY + dirY * r} ` +
                       `V ${gutterY - dirY * r} ` +
                       `Q ${rightX} ${gutterY} ${rightX - r} ${gutterY} ` +
                       `H ${leftX + r} ` +
                       `Q ${leftX} ${gutterY} ${leftX} ${gutterY + dirY * r} ` +
                       `V ${targetY - dirY * r} ` +
                       `Q ${leftX} ${targetY} ${leftX + r} ${targetY} ` +
                       `H ${targetX}`;
              }
            }
          } else {
            // Backward or overlapping dependency (target starts before or near source end)
            // Route around the right side of all intermediate tasks, then along the target inter-row gutter
            const rightX = maxIntermediateEndX + offset;
            const leftX = targetX - offset;
            const gutterY = targetY - dirY * (rowHeight / 2);
            const r = Math.min(radius, offset / 2, rowHeight / 4);

            path = `M ${sourceX} ${sourceY} ` +
                   `H ${rightX - r} ` +
                   `Q ${rightX} ${sourceY} ${rightX} ${sourceY + dirY * r} ` +
                   `V ${gutterY - dirY * r} ` +
                   `Q ${rightX} ${gutterY} ${rightX - r} ${gutterY} ` +
                   `H ${leftX + r} ` +
                   `Q ${leftX} ${gutterY} ${leftX} ${gutterY + dirY * r} ` +
                   `V ${targetY - dirY * r} ` +
                   `Q ${leftX} ${targetY} ${leftX + r} ${targetY} ` +
                   `H ${targetX}`;
          }

          links.push({
            id: `${predId}->${targetTask.id}`,
            sourceId: predId,
            targetId: targetTask.id,
            path,
            isCritical: !!(targetTask.isCritical || sourceTask.isCritical)
          });
        }
      });
    });

    return links;
  }, [visibleTasks, taskIndexMap, dependenciesKey, showDependencies, variant, endKey, startKey, timeToX, timeToEndX, getTaskBounds]);

  const handleTableScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (timelineRef.current && e.target === tableRef.current) {
      timelineRef.current.scrollTop = (e.target as HTMLElement).scrollTop;
    }
  };

  const handleTimelineScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (tableRef.current && e.target === timelineRef.current) {
      tableRef.current.scrollTop = (e.target as HTMLElement).scrollTop;
    }
  };

  const todayX = timeToX(todayDate);

  return (
    <div
      ref={containerRef}
      className={`gantt-chart-container ${className}`}
      style={{
        position: 'relative',
        background: 'var(--surface-card)',
        border: 'var(--border-hairline)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4) var(--space-5)',
        maxWidth: '100%',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-sans)'
      }}
    >
      {(title || subtitle || showControls) && (
        <div style={{
          display: 'flex',
          justifyContent: (title || subtitle) ? 'space-between' : 'flex-end',
          alignItems: 'center',
          marginBottom: 'calc(var(--space-3) + var(--space-half))',
          flexWrap: 'wrap',
          gap: 'var(--space-3)'
        }}>
          {(title || subtitle) && (
            <div>
              {title && <div style={{ fontWeight: 700, fontSize: 'var(--text-md)', color: 'var(--text-primary)' }}>{title}</div>}
              {subtitle && <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-half)' }}>{subtitle}</div>}
            </div>
          )}

          {showControls && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'calc(var(--space-2) + var(--space-half))', flexWrap: 'wrap' }}>
              {showSearch && (
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Filter task, owner, group..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      padding: 'var(--space-1) calc(var(--space-2) + var(--space-half))',
                      fontSize: 'var(--text-xs)',
                      border: 'var(--border-hairline)',
                      borderRadius: 'var(--radius-sm)',
                      outline: 'none',
                      width: 180,
                      background: 'var(--surface-card)',
                      color: 'var(--text-primary)',
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: 'calc(var(--space-1) + var(--space-half))',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-disabled)',
                        fontSize: 'var(--text-2xs)'
                      }}
                    >✕</button>
                  )}
                </div>
              )}

              <div style={{
                display: 'flex',
                border: 'var(--border-hairline)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                background: 'var(--surface-card)'
              }}>
                {(['day', 'week', 'month'] as GanttZoomLevel[]).map(z => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => setZoomLevel(z)}
                    style={{
                      padding: 'var(--space-1) var(--space-3)',
                      fontSize: 'var(--text-2xs)',
                      fontWeight: zoomLevel === z ? 600 : 400,
                      border: 'none',
                      background: zoomLevel === z ? 'var(--action-solid)' : 'transparent',
                      color: zoomLevel === z ? 'var(--text-inverse)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{
        display: 'flex',
        border: 'var(--border-hairline)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        height: height - 80
      }}>
        {/* LEFT PANE: Task Grid Table */}
        <div
          ref={tableRef}
          onScroll={handleTableScroll}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- synchronized scroll pane must be keyboard reachable
          tabIndex={0}
          role="region"
          aria-label="Gantt task list"
          style={{
            width: densityTier === 'compact' ? 180 : 280,
            minWidth: densityTier === 'compact' ? 180 : 280,
            borderRight: 'var(--border-hairline)',
            background: 'var(--surface-card)',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          <div style={{
            height: headerHeight,
            display: 'flex',
            alignItems: 'center',
            background: 'var(--surface-sunken)',
            borderBottom: 'var(--border-hairline)',
            padding: '0 var(--space-3)',
            fontSize: 11,
            fontWeight: 700,
            color: 'var(--text-secondary)',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            <div style={{ flex: 1 }}>Task / Work Order</div>
            <div style={{ width: 45, textAlign: 'right' }}>Prog.</div>
          </div>

          {visibleTasks.map((t) => {
            const isSelected = selectedTaskId === t.id;
            const isHovered = hoveredTask?.id === t.id;
            const progress = t[progressKey] ?? 0;
            const status = t.status || (progress === 100 ? 'completed' : 'in-progress');

            return (
              <div
                key={t.id}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={(e) => {
                  setSelectedTaskId(t.id);
                  if (onTaskClick) onTaskClick(t, e);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedTaskId(t.id);
                    if (onTaskClick) onTaskClick(t, e as unknown as React.MouseEvent<HTMLDivElement>);
                  }
                }}
                onMouseEnter={(e) => {
                  setHoveredTask(t);
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredTask(null)}
                style={{
                  height: rowHeight,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 var(--space-3)',
                  fontSize: 'var(--text-xs)',
                  borderBottom: 'var(--border-hairline-subtle)',
                  background: isSelected ? 'var(--surface-selected)' : isHovered ? 'var(--surface-hover)' : 'var(--surface-card)',
                  cursor: 'pointer',
                  transition: 'background 0.1s ease'
                }}
              >
                <div style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ fontWeight: isSelected ? 600 : 400, color: isSelected ? 'var(--action-solid)' : 'var(--text-primary)' }}>
                    {t.isMilestone ? '◆ ' : ''}{t.name}
                  </span>
                  {t.owner && (
                    <span style={{ fontSize: 10, color: 'var(--text-disabled)', marginLeft: 6 }}>({t.owner})</span>
                  )}
                </div>
                <div style={{ width: 45, textAlign: 'right', fontSize: 'var(--text-2xs)', fontWeight: 600, color: STATUS_COLORS[status] }}>
                  {t.isMilestone ? '—' : `${progress}%`}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT PANE: Timeline Canvas (Synchronized Scroll) */}
        <div
          ref={timelineRef}
          onScroll={handleTimelineScroll}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- synchronized scroll pane must be keyboard reachable
          tabIndex={0}
          role="region"
          aria-label="Gantt timeline"
          style={{
            flex: 1,
            overflowX: 'auto',
            overflowY: 'auto',
            background: 'var(--surface-card)',
            position: 'relative'
          }}
        >
          <div style={{
            display: 'flex',
            height: headerHeight,
            position: 'sticky',
            top: 0,
            background: 'var(--surface-sunken)',
            borderBottom: 'var(--border-hairline)',
            zIndex: 10,
            width: timelineContentWidth
          }}>
            {timeTicks.map((tick, idx) => {
              const x = timeToX(tick.time);
              return (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: x,
                    width: dayColumnWidth * (zoomLevel === 'week' ? 7 : zoomLevel === 'month' ? 30 : 1),
                    padding: 'var(--space-1) calc(var(--space-1) + var(--space-half))',
                    fontSize: 10,
                    fontWeight: 600,
                    color: tick.isWeekend ? 'var(--text-disabled)' : 'var(--text-secondary)',
                    borderLeft: 'var(--border-hairline)',
                    background: tick.isWeekend ? 'var(--surface-sunken)' : 'transparent',
                    height: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div>{tick.label}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-disabled)' }}>{tick.secondary}</div>
                </div>
              );
            })}
          </div>

          <div style={{ position: 'relative', width: timelineContentWidth, height: visibleTasks.length * rowHeight }}>
            <svg
              width={timelineContentWidth}
              height={visibleTasks.length * rowHeight}
              style={{ display: 'block', position: 'absolute', top: 0, left: 0 }}
            >
              <defs>
                <marker id="gantt-arrow-crit" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--status-critical-solid)" />
                </marker>
                <marker id="gantt-arrow-norm" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--status-neutral-solid)" />
                </marker>
                <pattern id="gantt-hatch-overdue" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="var(--status-critical-solid)" strokeWidth="2" opacity="0.35" />
                </pattern>
                <pattern id="gantt-hatch-warn" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="var(--status-warning-solid)" strokeWidth="2" opacity="0.35" />
                </pattern>
              </defs>

              {timeTicks.map((tick, idx) => {
                const x = timeToX(tick.time);
                return (
                  <line
                    key={idx}
                    x1={x}
                    x2={x}
                    y1={0}
                    y2={visibleTasks.length * rowHeight}
                    stroke={tick.isWeekend ? 'var(--border-subtle)' : 'var(--surface-sunken)'}
                    strokeWidth="1"
                  />
                );
              })}

              {showTodayLine && todayX > 0 && todayX < timelineContentWidth && (
                <g className="today-marker" transform={`translate(${todayX}, 0)`}>
                  <line y1="0" y2={visibleTasks.length * rowHeight} stroke="var(--action-solid)" strokeWidth="2" strokeDasharray="4,2" />
                  <polygon points="-4,0 4,0 0,6" fill="var(--action-solid)" />
                </g>
              )}

              {dependencyLinks.map(link => (
                <path
                  key={link.id}
                  d={link.path}
                  fill="none"
                  stroke={link.isCritical ? 'var(--status-critical-solid)' : 'var(--text-disabled)'}
                  strokeWidth={link.isCritical ? 2 : 1.5}
                  markerEnd={link.isCritical ? 'url(#gantt-arrow-crit)' : 'url(#gantt-arrow-norm)'}
                />
              ))}

              {visibleTasks.map((t, idx) => {
                const isSelected = selectedTaskId === t.id;
                const isHovered = hoveredTask?.id === t.id;
                const y = idx * rowHeight + (rowHeight - taskBarHeight) / 2;

                if (t.isMilestone) {
                  const mDate = t.milestoneDate || t[startKey];
                  const mx = timeToX(mDate);
                  const status = t.status || 'completed';
                  const color = STATUS_COLORS[status];

                  return (
                    <g
                      key={t.id}
                      transform={`translate(${mx}, ${idx * rowHeight + rowHeight / 2})`}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={(e) => {
                        setHoveredTask(t);
                        setTooltipPos({ x: e.clientX, y: e.clientY });
                      }}
                      onMouseLeave={() => setHoveredTask(null)}
                      onClick={(e) => {
                        setSelectedTaskId(t.id);
                        if (onTaskClick) onTaskClick(t, e);
                      }}
                    >
                      <polygon
                        points="0,-8 8,0 0,8 -8,0"
                        fill={color}
                        stroke="var(--surface-card)"
                        strokeWidth="2"
                        filter={isSelected ? 'drop-shadow(0 0 4px var(--action-solid))' : undefined}
                      />
                      <text
                        x="12"
                        y="3.5"
                        fontSize="10"
                        fontWeight="600"
                        fill="var(--text-primary)"
                        stroke="var(--surface-card)"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        paintOrder="stroke fill"
                      >
                        {t.name}
                      </text>
                    </g>
                  );
                }

                const sDate = t[startKey];
                const eDate = t[endKey];
                const xStart = timeToX(sDate);
                const xEnd = timeToEndX(eDate || sDate);
                const barWidth = Math.max(14, xEnd - xStart);
                const progress = t[progressKey] ?? 0;
                const progressWidth = (progress / 100) * barWidth;
                const status = t.status || (progress === 100 ? 'completed' : 'in-progress');
                const baseColor = STATUS_COLORS[status];

                const isWideEnoughForInsideText = barWidth >= 75;
                const maxChars = Math.max(1, Math.floor((barWidth - 14) / 6.5));
                const insideLabel = t.name.length > maxChars ? `${t.name.slice(0, Math.max(1, maxChars - 1))}…` : t.name;

                return (
                  <g
                    key={t.id}
                    className="gantt-task-bar"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                      setHoveredTask(t);
                      setTooltipPos({ x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setHoveredTask(null)}
                    onClick={(e) => {
                      setSelectedTaskId(t.id);
                      if (onTaskClick) onTaskClick(t, e);
                    }}
                  >
                    <rect
                      x="0"
                      y={idx * rowHeight}
                      width={timelineContentWidth}
                      height={rowHeight}
                      fill={isSelected ? 'var(--surface-selected)' : isHovered ? 'var(--surface-hover)' : 'transparent'}
                      opacity="0.6"
                    />

                    <rect
                      x={xStart}
                      y={y}
                      width={barWidth}
                      height={taskBarHeight}
                      rx="3"
                      fill={status === 'overdue' ? 'url(#gantt-hatch-overdue)' : status === 'warning' ? 'url(#gantt-hatch-warn)' : 'var(--surface-sunken)'}
                      stroke={isSelected ? 'var(--action-solid)' : baseColor}
                      strokeWidth={isSelected ? 2 : 1}
                    />

                    {showProgress && progress > 0 && (
                      <rect
                        x={xStart}
                        y={y}
                        width={progressWidth}
                        height={taskBarHeight}
                        rx="3"
                        fill={baseColor}
                        opacity="0.85"
                      />
                    )}

                    {isWideEnoughForInsideText ? (
                      <text
                        x={xStart + 8}
                        y={y + taskBarHeight / 2 + 3.5}
                        fontSize="10"
                        fontWeight="600"
                        fill={progress > 55 ? 'var(--text-inverse)' : 'var(--text-primary)'}
                        pointerEvents="none"
                      >
                        {insideLabel}
                      </text>
                    ) : (
                      <text
                        x={xEnd + 8}
                        y={y + taskBarHeight / 2 + 3.5}
                        fontSize="10"
                        fontWeight="600"
                        fill="var(--text-primary)"
                        stroke="var(--surface-card)"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        paintOrder="stroke fill"
                        pointerEvents="none"
                      >
                        {t.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {hoveredTask && (
        <div style={{
          position: 'fixed',
          left: tooltipPos.x + 14,
          top: tooltipPos.y + 14,
          background: 'var(--tooltip-background)',
          color: 'var(--tooltip-foreground)',
          padding: 'calc(var(--space-2) + var(--space-half)) calc(var(--space-3) + var(--space-half))',
          borderRadius: 'var(--tooltip-radius)',
          fontSize: 'var(--text-xs)',
          boxShadow: 'var(--tooltip-shadow)',
          pointerEvents: 'none',
          zIndex: 100,
          maxWidth: 280
        }}>
          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>
            {hoveredTask.name}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: 'var(--space-1) var(--space-3)', fontSize: 'var(--text-2xs)' }}>
            {hoveredTask[groupKey] && (
              <>
                <span style={{ color: 'var(--text-disabled)' }}>Group / Phase:</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>{hoveredTask[groupKey]}</span>
              </>
            )}

            {hoveredTask.owner && (
              <>
                <span style={{ color: 'var(--text-disabled)' }}>Assignee:</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>{hoveredTask.owner}</span>
              </>
            )}

            {hoveredTask.isMilestone ? (
              <>
                <span style={{ color: 'var(--text-info)' }}>Milestone Date:</span>
                <span style={{ fontWeight: 600, textAlign: 'right', color: 'var(--text-info)' }}>
                  {new Date(hoveredTask.milestoneDate || hoveredTask[startKey]).toLocaleDateString('en-IN')}
                </span>
              </>
            ) : (
              <>
                <span style={{ color: 'var(--text-secondary)' }}>Start:</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>
                  {new Date(hoveredTask[startKey]).toLocaleDateString('en-IN')}
                </span>

                <span style={{ color: 'var(--text-secondary)' }}>End:</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>
                  {new Date(hoveredTask[endKey]).toLocaleDateString('en-IN')}
                </span>

                <span style={{ color: 'var(--text-secondary)' }}>Progress:</span>
                <span style={{ fontWeight: 600, textAlign: 'right', color: 'var(--text-info)' }}>
                  {hoveredTask[progressKey] ?? 0}%
                </span>
              </>
            )}

            {hoveredTask[dependenciesKey] && hoveredTask[dependenciesKey].length > 0 && (
              <>
                <span style={{ color: 'var(--text-secondary)' }}>Predecessors:</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>
                  {hoveredTask[dependenciesKey].join(', ')}
                </span>
              </>
            )}
          </div>

          {hoveredTask.status && (
            <div style={{ marginTop: 6, fontSize: 11, color: STATUS_COLORS[hoveredTask.status] }}>
              ● Status: {hoveredTask.status.toUpperCase()}
            </div>
          )}
        </div>
      )}

      {/* Accessible Tabular Mirror */}
      {showDataTable && tasks && tasks.length > 0 && (
        <details
          className="ds-chart-table-details"
          style={{
            marginTop: 12,
            borderTop: 'var(--border-hairline-subtle)',
            paddingTop: 'var(--space-2)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)'
          }}
        >
          <summary
            className="ds-chart-table-summary"
            style={{
              cursor: 'pointer',
              padding: 'var(--space-1) var(--space-2)',
              fontWeight: 500,
              userSelect: 'none'
            }}
          >
            View Accessible Schedule Table
          </summary>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable data table requires keyboard access */}
          <div role="region" aria-label="Gantt schedule table" tabIndex={0} style={{ overflowX: 'auto', marginTop: 8 }}>
            <table
              className="ds-chart-table"
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: 'var(--text-xs)'
              }}
            >
              <caption style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>
                {title ? `${title} Data Table` : 'Gantt Chart Schedule Table'}
              </caption>
              <thead>
                <tr style={{ borderBottom: 'var(--border-width-emphasis) solid var(--border-default)' }}>
                  <th scope="col" style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontWeight: 600, color: 'var(--text-primary)' }}>Task Name</th>
                  <th scope="col" style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontWeight: 600, color: 'var(--text-primary)' }}>Start Date</th>
                  <th scope="col" style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontWeight: 600, color: 'var(--text-primary)' }}>End Date</th>
                  <th scope="col" style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontWeight: 600, color: 'var(--text-primary)' }}>Progress</th>
                  <th scope="col" style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontWeight: 600, color: 'var(--text-primary)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} style={{ borderBottom: 'var(--border-hairline-subtle)' }}>
                    <th scope="row" style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {task.name} ({task.id})
                    </th>
                    <td style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {task[startKey] ? new Date(task[startKey]).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {task[endKey] ? new Date(task[endKey]).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {task[progressKey] != null ? `${task[progressKey]}%` : '—'}
                    </td>
                    <td style={{ padding: 'calc(var(--space-1) + var(--space-half)) var(--space-2)', color: STATUS_COLORS[task.status || 'nominal'] || 'var(--text-secondary)' }}>
                      {task.status || 'nominal'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
};

export default GanttChart;
