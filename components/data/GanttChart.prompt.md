# GanttChart Prompting Guide & Best Practices

## Component Overview
`GanttChart` is a comprehensive temporal schedule visualization component in the Meridian Design System (MDS). It places activities, project phases, tooling schedules, and maintenance shutdown tasks as bounded intervals on a common temporal scale.

## Supported Variants
1. `basic`: Standard temporal interval bars across project tasks.
2. `progress`: Task bars with embedded percentage completion fills ($0-100\%$).
3. `dependency`: Predecessor-to-successor routing connector arrows to highlight critical paths.
4. `milestone`: Checkpoint diamonds indicating critical delivery dates, audits, and sign-offs.
5. `grouped`: Grouped tasks by work center, project phase, or machine cell.

## Recommended Defaults
- `variant`: `'dependency'` (or `'progress'`)
- `defaultZoom`: `'day'` (toggles available for `'week'` and `'month'`)
- `showTodayLine`: `true`
- `showDependencies`: `true`
- `showProgress`: `true`

## Example Usage
```tsx
import React from 'react';
import { GanttChart } from './GanttChart';

const shutdownTasks = [
  { id: 'T1', name: 'Press 800T Electrical Lockout', startDate: '2026-09-01', endDate: '2026-09-03', progress: 100, status: 'completed', group: 'Phase 1: Isolation' },
  { id: 'T2', name: 'Die Tooling Extraction & Visual NDT', startDate: '2026-09-03', endDate: '2026-09-07', progress: 100, status: 'completed', dependencies: ['T1'], group: 'Phase 1: Isolation' },
  { id: 'M1', name: 'Safety De-energize Gate Sign-off', milestoneDate: '2026-09-07', isMilestone: true, status: 'completed', group: 'Phase 1: Isolation' },
  { id: 'T3', name: 'Hydraulic Cylinder Seal Replacement', startDate: '2026-09-08', endDate: '2026-09-14', progress: 60, status: 'in-progress', dependencies: ['M1'], group: 'Phase 2: Overhaul' },
  { id: 'T4', name: 'Platen Bed Precision Laser Alignment', startDate: '2026-09-14', endDate: '2026-09-18', progress: 0, status: 'scheduled', dependencies: ['T3'], group: 'Phase 2: Overhaul' },
  { id: 'M2', name: 'Final CMM Trial Run & SOP Sign-off', milestoneDate: '2026-09-22', isMilestone: true, status: 'scheduled', group: 'Phase 3: Commissioning' }
];

export function PressMaintenanceSchedule() {
  return (
    <GanttChart
      tasks={shutdownTasks}
      variant="dependency"
      title="Annual Press Line Overhaul & Die Maintenance"
      subtitle="Suryodaya Autocomp Ltd · Chakan Plant (PL-04)"
      width={900}
      height={440}
    />
  );
}
```
