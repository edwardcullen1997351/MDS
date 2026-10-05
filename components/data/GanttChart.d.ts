import * as React from 'react';

export type GanttVariant = 'basic' | 'progress' | 'dependency' | 'milestone' | 'grouped';
export type GanttZoomLevel = 'day' | 'week' | 'month';
export type GanttTaskStatus = 'nominal' | 'completed' | 'in-progress' | 'warning' | 'critical' | 'overdue' | 'scheduled';

export interface GanttTask {
  id: string;
  name: string;
  startDate?: string | Date | number;
  endDate?: string | Date | number;
  progress?: number; // 0 - 100
  status?: GanttTaskStatus;
  group?: string;
  owner?: string;
  isMilestone?: boolean;
  milestoneDate?: string | Date | number;
  dependencies?: string[]; // Predecessor task IDs
  isCritical?: boolean;
  metadata?: Record<string, any>;
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
  onTaskClick?: (task: GanttTask, event: React.MouseEvent) => void;
  renderTooltip?: (task: GanttTask) => React.ReactNode;
  ariaLabel?: string;
}

export declare const GanttChart: React.FC<GanttChartProps>;
export default GanttChart;
