import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';

/**
 * GanttChart - Meridian Design System
 *
 * Purpose: Communicate schedules by placing activities, phases or resources as intervals on a common temporal scale.
 * Supported Variants:
 *  - 'basic': Standard task duration bars.
 *  - 'progress': Task duration bars with percentage progress fill overlays.
 *  - 'dependency': Predecessor-to-successor routing connector arrows.
 *  - 'milestone': Zero-duration checkpoint diamonds.
 *  - 'grouped': Hierarchical grouping (e.g. Work Center, Project Phase, Machine Cell).
 */

const STATUS_COLORS = {
  nominal: '#16a34a',
  completed: '#16a34a',
  'in-progress': '#2563eb',
  warning: '#d97706',
  critical: '#dc2626',
  overdue: '#dc2626',
  scheduled: '#64748b'
};

export function GanttChart({
  tasks = [],
  variant = 'dependency', // 'basic' | 'progress' | 'dependency' | 'milestone' | 'grouped'
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
  defaultZoom = 'day', // 'day' | 'week' | 'month'
  className = '',
  onTaskClick = null
}) {
  const [zoomLevel, setZoomLevel] = useState(defaultZoom);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  // Sync scrolling between left task table and right timeline
  const tableRef = useRef(null);
  const timelineRef = useRef(null);

  // Keyboard shortcut for Accessible Modal (Alt + F11)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && (e.key === 'F11' || e.keyCode === 122)) {
        e.preventDefault();
        setIsTableModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter Tasks by Search Query
  const filteredTasks = useMemo(() => {
    if (!searchQuery.trim()) return tasks;
    const q = searchQuery.toLowerCase().trim();
    return tasks.filter(t =>
      (t.name && t.name.toLowerCase().includes(q)) ||
      (t.id && t.id.toLowerCase().includes(q)) ||
      (t.owner && t.owner.toLowerCase().includes(q)) ||
      (t[groupKey] && t[groupKey].toLowerCase().includes(q))
    );
  }, [tasks, searchQuery, groupKey]);

  // Group Hierarchy & Flattened Visible Tasks
  const visibleTasks = useMemo(() => {
    const list = [];
    filteredTasks.forEach(t => {
      const grp = t[groupKey];
      if (grp && collapsedGroups[grp]) {
        return; // skip collapsed group children
      }
      list.push(t);
    });
    return list;
  }, [filteredTasks, groupKey, collapsedGroups]);

  // Domain Min & Max Calculation
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
      const s = t[startKey] ? new Date(t[startKey]).getTime() : null;
      const e = t[endKey] ? new Date(t[endKey]).getTime() : (t.milestoneDate ? new Date(t.milestoneDate).getTime() : s);

      if (s != null && !isNaN(s) && s < minTime) minTime = s;
      if (e != null && !isNaN(e) && e > maxTime) maxTime = e;
    });

    if (minTime === Infinity || maxTime === -Infinity) {
      const now = new Date('2026-09-01').getTime();
      return { minDate: new Date(now), maxDate: new Date(now + 30 * 86400000), durationMs: 30 * 86400000, totalDays: 30 };
    }

    // Pad by 2 days before and after
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
  }, [tasks, startKey, endKey]);

  // Timeline Column Width & Pixel Scale
  const dayColumnWidth = zoomLevel === 'day' ? 36 : zoomLevel === 'week' ? 14 : 4;
  const timelineContentWidth = Math.max(width - 280, totalDays * dayColumnWidth);

  const timeToX = useCallback((dateStrOrTime) => {
    if (!dateStrOrTime) return 0;
    const t = typeof dateStrOrTime === 'number' ? dateStrOrTime : new Date(dateStrOrTime).getTime();
    const ratio = (t - minDate.getTime()) / durationMs;
    return Math.max(0, ratio * timelineContentWidth);
  }, [minDate, durationMs, timelineContentWidth]);

  // Header Time Ticks
  const timeTicks = useMemo(() => {
    const startMs = minDate.getTime();
    const endMs = maxDate.getTime();
    const ticks = [];
    const curr = new Date(startMs);
    curr.setHours(0, 0, 0, 0);

    while (curr.getTime() <= endMs) {
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

  // Row Layout Constants
  const rowHeight = 36;
  const headerHeight = 44;
  const taskBarHeight = 20;

  // Task Index Map for Row Lookup
  const taskIndexMap = useMemo(() => {
    const map = {};
    visibleTasks.forEach((t, i) => {
      map[t.id] = i;
    });
    return map;
  }, [visibleTasks]);

  // Generate Dependency Paths
  const dependencyLinks = useMemo(() => {
    if (!showDependencies && variant !== 'dependency') return [];
    const links = [];

    visibleTasks.forEach((targetTask, targetIdx) => {
      const predecessors = targetTask[dependenciesKey] || [];
      predecessors.forEach(predId => {
        const sourceIdx = taskIndexMap[predId];
        if (sourceIdx !== undefined) {
          const sourceTask = visibleTasks[sourceIdx];
          const sEnd = sourceTask[endKey] || sourceTask.milestoneDate || sourceTask[startKey];
          const tStart = targetTask[startKey] || targetTask.milestoneDate;

          const sourceX = timeToX(sEnd);
          const sourceY = sourceIdx * rowHeight + rowHeight / 2;
          const targetX = timeToX(tStart);
          const targetY = targetIdx * rowHeight + rowHeight / 2;

          const isTargetRight = targetX >= sourceX + 16;
          let path = '';
          if (isTargetRight) {
            const midX = sourceX + 12;
            path = `M ${sourceX} ${sourceY} L ${midX} ${sourceY} L ${midX} ${targetY} L ${targetX} ${targetY}`;
          } else {
            const midY = (sourceY + targetY) / 2;
            const rightX = sourceX + 12;
            const leftX = targetX - 12;
            path = `M ${sourceX} ${sourceY} L ${rightX} ${sourceY} L ${rightX} ${midY} L ${leftX} ${midY} L ${leftX} ${targetY} L ${targetX} ${targetY}`;
          }

          links.push({
            id: `${predId}->${targetTask.id}`,
            sourceId: predId,
            targetId: targetTask.id,
            path,
            isCritical: targetTask.isCritical || sourceTask.isCritical
          });
        }
      });
    });

    return links;
  }, [visibleTasks, taskIndexMap, dependenciesKey, showDependencies, variant, endKey, startKey, timeToX]);

  // Synchronized scroll handlers
  const handleTableScroll = (e) => {
    if (timelineRef.current && e.target === tableRef.current) {
      timelineRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const handleTimelineScroll = (e) => {
    if (tableRef.current && e.target === timelineRef.current) {
      tableRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const toggleGroup = (grp) => {
    setCollapsedGroups(prev => ({ ...prev, [grp]: !prev[grp] }));
  };

  const todayX = timeToX(todayDate);

  return (
    <div
      className={`gantt-chart-container ${className}`}
      style={{
        position: 'relative',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        padding: '16px 20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Header & Controls Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{title}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{subtitle}</div>
        </div>

        {showControls && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {/* Search Input */}
            {showSearch && (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Filter task, owner, group..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '4px 10px',
                    fontSize: 12,
                    border: '1px solid #cbd5e1',
                    borderRadius: 4,
                    outline: 'none',
                    width: 170
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: 6,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      color: '#94a3b8',
                      fontSize: 11
                    }}
                  >✕</button>
                )}
              </div>
            )}

            {/* Zoom Toggle Buttons */}
            <div style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: 4, overflow: 'hidden' }}>
              {['day', 'week', 'month'].map(z => (
                <button
                  key={z}
                  onClick={() => setZoomLevel(z)}
                  style={{
                    padding: '4px 10px',
                    fontSize: 11,
                    border: 'none',
                    background: zoomLevel === z ? '#0284c7' : '#ffffff',
                    color: zoomLevel === z ? '#ffffff' : '#334155',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {z}
                </button>
              ))}
            </div>

            {/* Accessible Table Modal Button */}
            <button
              onClick={() => setIsTableModalOpen(true)}
              title="Accessible Table Modal (Alt + F11)"
              style={{
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 600,
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                background: '#f8fafc',
                color: '#0284c7',
                cursor: 'pointer'
              }}
            >
              📊 Table View
            </button>
          </div>
        )}
      </div>

      {/* Split-View Workspace: Left Table + Right Timeline Canvas */}
      <div style={{
        display: 'flex',
        border: '1px solid #e2e8f0',
        borderRadius: 6,
        overflow: 'hidden',
        height: height - 80
      }}>
        {/* LEFT PANE: Task Grid Table */}
        <div
          ref={tableRef}
          onScroll={handleTableScroll}
          style={{
            width: 280,
            minWidth: 280,
            borderRight: '1px solid #e2e8f0',
            background: '#ffffff',
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          {/* Table Header */}
          <div style={{
            height: headerHeight,
            display: 'flex',
            alignItems: 'center',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 12px',
            fontSize: 11,
            fontWeight: 700,
            color: '#475569',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            <div style={{ flex: 1 }}>Task / Work Order</div>
            <div style={{ width: 45, textAlign: 'right' }}>Prog.</div>
          </div>

          {/* Task Rows */}
          {visibleTasks.map((t, idx) => {
            const isSelected = selectedTaskId === t.id;
            const isHovered = hoveredTask?.id === t.id;
            const progress = t[progressKey] ?? 0;
            const status = t.status || (progress === 100 ? 'completed' : 'in-progress');

            return (
              <div
                key={t.id}
                onClick={(e) => {
                  setSelectedTaskId(t.id);
                  if (onTaskClick) onTaskClick(t, e);
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
                  padding: '0 12px',
                  fontSize: 12,
                  borderBottom: '1px solid #f1f5f9',
                  background: isSelected ? '#eff6ff' : isHovered ? '#f8fafc' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'background 0.1s ease'
                }}
              >
                <div style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <span style={{ fontWeight: isSelected ? 600 : 400, color: isSelected ? '#0284c7' : '#0f172a' }}>
                    {t.isMilestone ? '◆ ' : ''}{t.name}
                  </span>
                  {t.owner && (
                    <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 6 }}>({t.owner})</span>
                  )}
                </div>
                <div style={{ width: 45, textAlign: 'right', fontSize: 11, fontWeight: 600, color: STATUS_COLORS[status] }}>
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
          style={{
            flex: 1,
            overflowX: 'auto',
            overflowY: 'auto',
            background: '#ffffff',
            position: 'relative'
          }}
        >
          {/* Header Time Axis Ticks */}
          <div style={{
            display: 'flex',
            height: headerHeight,
            position: 'sticky',
            top: 0,
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
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
                    padding: '4px 6px',
                    fontSize: 10,
                    fontWeight: 600,
                    color: tick.isWeekend ? '#94a3b8' : '#334155',
                    borderLeft: '1px solid #e2e8f0',
                    background: tick.isWeekend ? '#f1f5f9' : 'transparent',
                    height: '100%',
                    boxSizing: 'border-box'
                  }}
                >
                  <div>{tick.label}</div>
                  <div style={{ fontSize: 9, color: '#94a3b8' }}>{tick.secondary}</div>
                </div>
              );
            })}
          </div>

          {/* SVG Timeline Canvas for Bars & Dependency Connectors */}
          <div style={{ position: 'relative', width: timelineContentWidth, height: visibleTasks.length * rowHeight }}>
            <svg
              width={timelineContentWidth}
              height={visibleTasks.length * rowHeight}
              style={{ display: 'block', position: 'absolute', top: 0, left: 0 }}
            >
              <defs>
                <marker id="gantt-arrow-crit" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#dc2626" />
                </marker>
                <marker id="gantt-arrow-norm" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
                </marker>
                <pattern id="gantt-hatch-overdue" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#dc2626" strokeWidth="2" opacity="0.35" />
                </pattern>
                <pattern id="gantt-hatch-warn" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
                  <line x1="0" y1="0" x2="0" y2="8" stroke="#d97706" strokeWidth="2" opacity="0.35" />
                </pattern>
              </defs>

              {/* Vertical Grid Day/Week Lines */}
              {timeTicks.map((tick, idx) => {
                const x = timeToX(tick.time);
                return (
                  <line
                    key={idx}
                    x1={x}
                    x2={x}
                    y1={0}
                    y2={visibleTasks.length * rowHeight}
                    stroke={tick.isWeekend ? '#f1f5f9' : '#f8fafc'}
                    strokeWidth="1"
                  />
                );
              })}

              {/* Today Marker Line */}
              {showTodayLine && todayX > 0 && todayX < timelineContentWidth && (
                <g className="today-marker" transform={`translate(${todayX}, 0)`}>
                  <line y1="0" y2={visibleTasks.length * rowHeight} stroke="#0284c7" strokeWidth="2" strokeDasharray="4,2" />
                  <polygon points="-4,0 4,0 0,6" fill="#0284c7" />
                </g>
              )}

              {/* Dependency Connector Paths */}
              {dependencyLinks.map(link => (
                <path
                  key={link.id}
                  d={link.path}
                  fill="none"
                  stroke={link.isCritical ? '#dc2626' : '#94a3b8'}
                  strokeWidth={link.isCritical ? 2 : 1.5}
                  markerEnd={link.isCritical ? 'url(#gantt-arrow-crit)' : 'url(#gantt-arrow-norm)'}
                />
              ))}

              {/* Task Interval Bars & Milestones */}
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
                        stroke="#ffffff"
                        strokeWidth="2"
                        filter={isSelected ? 'drop-shadow(0 0 4px #0284c7)' : undefined}
                      />
                      <text x="12" y="3" fontSize="10" fontWeight="600" fill="#1e293b">
                        {t.name}
                      </text>
                    </g>
                  );
                }

                const sDate = t[startKey];
                const eDate = t[endKey];
                const xStart = timeToX(sDate);
                const xEnd = timeToX(eDate);
                const barWidth = Math.max(4, xEnd - xStart);
                const progress = t[progressKey] ?? 0;
                const progressWidth = (progress / 100) * barWidth;
                const status = t.status || (progress === 100 ? 'completed' : 'in-progress');
                const baseColor = STATUS_COLORS[status];

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
                    {/* Row Background Highlight */}
                    <rect
                      x="0"
                      y={idx * rowHeight}
                      width={timelineContentWidth}
                      height={rowHeight}
                      fill={isSelected ? '#eff6ff' : isHovered ? '#f8fafc' : 'transparent'}
                      opacity="0.6"
                    />

                    {/* Outer Duration Bar */}
                    <rect
                      x={xStart}
                      y={y}
                      width={barWidth}
                      height={taskBarHeight}
                      rx="3"
                      fill={status === 'overdue' ? 'url(#gantt-hatch-overdue)' : status === 'warning' ? 'url(#gantt-hatch-warn)' : '#e2e8f0'}
                      stroke={isSelected ? '#0284c7' : baseColor}
                      strokeWidth={isSelected ? 2 : 1}
                    />

                    {/* Progress Overlay Fill */}
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

                    {/* Bar Direct Label */}
                    <text
                      x={xStart + 6}
                      y={y + taskBarHeight / 2 + 4}
                      fontSize="10"
                      fontWeight="600"
                      fill={progress > 50 ? '#ffffff' : '#1e293b'}
                      pointerEvents="none"
                    >
                      {barWidth > 60 ? `${t.name}` : ''}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredTask && (
        <div style={{
          position: 'fixed',
          left: tooltipPos.x + 14,
          top: tooltipPos.y + 14,
          background: '#0f172a',
          color: '#ffffff',
          padding: '10px 14px',
          borderRadius: 6,
          fontSize: 12,
          boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
          pointerEvents: 'none',
          zIndex: 100,
          maxWidth: 280
        }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
            {hoveredTask.name}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '4px 12px', fontSize: 11 }}>
            {hoveredTask[groupKey] && (
              <>
                <span style={{ color: '#94a3b8' }}>Group / Phase:</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>{hoveredTask[groupKey]}</span>
              </>
            )}

            {hoveredTask.owner && (
              <>
                <span style={{ color: '#94a3b8' }}>Assignee:</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>{hoveredTask.owner}</span>
              </>
            )}

            {hoveredTask.isMilestone ? (
              <>
                <span style={{ color: '#38bdf8' }}>Milestone Date:</span>
                <span style={{ fontWeight: 600, textAlign: 'right', color: '#38bdf8' }}>
                  {new Date(hoveredTask.milestoneDate || hoveredTask[startKey]).toLocaleDateString('en-IN')}
                </span>
              </>
            ) : (
              <>
                <span style={{ color: '#cbd5e1' }}>Start:</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>
                  {new Date(hoveredTask[startKey]).toLocaleDateString('en-IN')}
                </span>

                <span style={{ color: '#cbd5e1' }}>End:</span>
                <span style={{ fontWeight: 600, textAlign: 'right' }}>
                  {new Date(hoveredTask[endKey]).toLocaleDateString('en-IN')}
                </span>

                <span style={{ color: '#cbd5e1' }}>Progress:</span>
                <span style={{ fontWeight: 600, textAlign: 'right', color: '#38bdf8' }}>
                  {hoveredTask[progressKey] ?? 0}%
                </span>
              </>
            )}

            {hoveredTask[dependenciesKey] && hoveredTask[dependenciesKey].length > 0 && (
              <>
                <span style={{ color: '#cbd5e1' }}>Predecessors:</span>
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

      {/* Accessible Schedule Table Modal (Alt + F11) */}
      {isTableModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 8,
            width: '90%',
            maxWidth: 780,
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <h3 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>Accessible Schedule & Task Data Table</h3>
              <button
                onClick={() => setIsTableModalOpen(false)}
                style={{ border: 'none', background: 'none', fontSize: 18, cursor: 'pointer', color: '#64748b' }}
              >✕</button>
            </div>

            <div style={{ padding: 20, overflowY: 'auto', flex: 1 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px' }}>Task Name</th>
                    <th style={{ padding: '8px 10px' }}>Phase / Group</th>
                    <th style={{ padding: '8px 10px' }}>Start Date</th>
                    <th style={{ padding: '8px 10px' }}>End Date</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right' }}>Progress</th>
                    <th style={{ padding: '8px 10px' }}>Predecessors</th>
                    <th style={{ padding: '8px 10px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleTasks.map((t, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600 }}>{t.name}</td>
                      <td style={{ padding: '8px 10px', color: '#64748b' }}>{t[groupKey] || 'General'}</td>
                      <td style={{ padding: '8px 10px' }}>
                        {t.isMilestone ? '—' : new Date(t[startKey]).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        {t.isMilestone ? new Date(t.milestoneDate || t[startKey]).toLocaleDateString('en-IN') : new Date(t[endKey]).toLocaleDateString('en-IN')}
                      </td>
                      <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 600 }}>
                        {t.isMilestone ? 'Milestone' : `${t[progressKey] ?? 0}%`}
                      </td>
                      <td style={{ padding: '8px 10px', color: '#64748b' }}>
                        {(t[dependenciesKey] || []).join(', ') || '—'}
                      </td>
                      <td style={{ padding: '8px 10px', color: STATUS_COLORS[t.status || 'scheduled'], fontWeight: 600 }}>
                        {(t.status || 'scheduled').toUpperCase()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GanttChart;
