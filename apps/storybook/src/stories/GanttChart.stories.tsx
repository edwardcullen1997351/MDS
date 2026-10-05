import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GanttChart, Button, ToastProvider, useToast } from '@ds/react';
import { EnterpriseChartStoryShell, KPIItem } from './components/EnterpriseChartStoryShell';

const meta: Meta<typeof GanttChart> = {
  title: 'Data Visualization/GanttChart',
  component: GanttChart,
  parameters: {
    docs: {
      description: {
        component:
          'GanttChart communicates manufacturing schedules, plant overhaul phases, die changeovers, maintenance windows, and dependencies along a continuous temporal scale at Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['basic', 'progress', 'dependency', 'milestone', 'grouped'],
    },
    defaultZoom: {
      control: 'select',
      options: ['day', 'week', 'month'],
    },
    showDataTable: {
      control: 'boolean',
      description: 'Renders an accessible non-visual tabular summary disclosure (<details>) directly below chart for WCAG 1.1.1 compliance',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GanttChart>;

const DEFAULT_TASKS = [
  {
    id: 'T-01',
    name: '33kV Substation Breaker Servicing',
    group: 'Utilities',
    startDate: '2026-09-01',
    endDate: '2026-09-05',
    progress: 100,
    status: 'completed' as const,
    owner: 'R. Kulkarni',
  },
  {
    id: 'T-02',
    name: 'Press P-01 (800T) Hydraulic Cylinder Re-sealing',
    group: 'Press Shop',
    startDate: '2026-09-04',
    endDate: '2026-09-10',
    progress: 100,
    status: 'completed' as const,
    dependencies: ['T-01'],
    owner: 'S. Patil',
  },
  {
    id: 'T-03',
    name: 'Schuler 1200T Flywheel Clutch Overhaul',
    group: 'Press Shop',
    startDate: '2026-09-08',
    endDate: '2026-09-16',
    progress: 60,
    status: 'in-progress' as const,
    dependencies: ['T-02'],
    isCritical: true,
    owner: 'A. Deshmukh',
  },
  {
    id: 'T-04',
    name: 'Mazak CNC Spindle Taper Regrinding',
    group: 'CNC Bay',
    startDate: '2026-09-11',
    endDate: '2026-09-18',
    progress: 25,
    status: 'warning' as const,
    dependencies: ['T-02'],
    owner: 'M. Shinde',
  },
  {
    id: 'T-05',
    name: 'Robotic Weld Cell Fixture Recalibration',
    group: 'Welding',
    startDate: '2026-09-15',
    endDate: '2026-09-22',
    progress: 0,
    status: 'scheduled' as const,
    dependencies: ['T-03'],
    owner: 'V. Joshi',
  },
  {
    id: 'T-06',
    name: 'Trial Batch Stamping & CMM Validation Run',
    group: 'Quality QA',
    isMilestone: true,
    milestoneDate: '2026-09-24',
    progress: 0,
    status: 'scheduled' as const,
    dependencies: ['T-04', 'T-05'],
    owner: 'QA Lead',
  },
];

const VARIANTS_TASKS = [
  {
    id: 'EV-01',
    name: 'Die Set Casting Import & Port Customs (JNPT)',
    group: 'Procurement',
    startDate: '2026-08-15',
    endDate: '2026-08-30',
    progress: 100,
    status: 'completed' as const,
  },
  {
    id: 'EV-02',
    name: 'Die Tryout #1 at Chakan Toolroom',
    group: 'Tooling',
    startDate: '2026-09-01',
    endDate: '2026-09-12',
    progress: 100,
    status: 'completed' as const,
    dependencies: ['EV-01'],
  },
  {
    id: 'EV-03',
    name: 'Dimensional Correction & CNC Spark EDM',
    group: 'Tooling',
    startDate: '2026-09-13',
    endDate: '2026-09-22',
    progress: 40,
    status: 'in-progress' as const,
    dependencies: ['EV-02'],
  },
  {
    id: 'EV-04',
    name: 'PPAP Level 3 Sample Submission to OEM',
    group: 'Quality QA',
    startDate: '2026-09-23',
    endDate: '2026-10-02',
    progress: 0,
    status: 'scheduled' as const,
    dependencies: ['EV-03'],
  },
  {
    id: 'EV-05',
    name: 'SOP Commercial Ramp-up (500 sets/day)',
    group: 'Production',
    isMilestone: true,
    milestoneDate: '2026-10-10',
    progress: 0,
    status: 'scheduled' as const,
    dependencies: ['EV-04'],
  },
];

const CRITICAL_TASKS = [
  {
    id: 'BD-01',
    name: 'Failure Root Cause Analysis (Die Jamming)',
    startDate: '2026-09-08',
    endDate: '2026-09-10',
    progress: 100,
    status: 'completed' as const,
  },
  {
    id: 'BD-02',
    name: 'Piston Rod Fabrication at Pune Tooling Partner',
    startDate: '2026-09-10',
    endDate: '2026-09-13',
    progress: 70,
    status: 'overdue' as const,
    isCritical: true,
    dependencies: ['BD-01'],
  },
  {
    id: 'BD-03',
    name: 'Line Re-assembly & Pressure Testing',
    startDate: '2026-09-14',
    endDate: '2026-09-17',
    progress: 0,
    status: 'critical' as const,
    isCritical: true,
    dependencies: ['BD-02'],
  },
  {
    id: 'BD-04',
    name: 'Line Release Signoff (Shift A Supervisor)',
    isMilestone: true,
    milestoneDate: '2026-09-18',
    progress: 0,
    status: 'scheduled' as const,
    dependencies: ['BD-03'],
  },
];

const MULTI_SHIFT_TASKS = [
  { id: 'WO-101', name: 'Shift A: Coolant Refill Bay 1', startDate: '2026-09-24', endDate: '2026-09-24', progress: 100, status: 'completed' as const, owner: 'Shift A Tech' },
  { id: 'WO-102', name: 'Shift A: Lubrication of Press 800T', startDate: '2026-09-24', endDate: '2026-09-24', progress: 100, status: 'completed' as const, owner: 'Shift A Tech' },
  { id: 'WO-103', name: 'Shift B: CNC Cutter Tip Replacement', startDate: '2026-09-24', endDate: '2026-09-25', progress: 50, status: 'in-progress' as const, owner: 'Shift B Tech' },
  { id: 'WO-104', name: 'Shift B: Weld Spatter Cleaning Bay 3', startDate: '2026-09-24', endDate: '2026-09-25', progress: 80, status: 'in-progress' as const, owner: 'Shift B Tech' },
  { id: 'WO-105', name: 'Shift C: Ultrasonic Die Crack Inspection', startDate: '2026-09-25', endDate: '2026-09-26', progress: 0, status: 'scheduled' as const, owner: 'Shift C NDT' },
  { id: 'WO-106', name: 'Shift C: Scrap Bin Evacuation to Yard', startDate: '2026-09-25', endDate: '2026-09-26', progress: 0, status: 'scheduled' as const, owner: 'Shift C Yard' },
];

const ACCESSIBLE_TASKS = [
  { id: 'CAP-01', name: 'Rooftop Solar PV Installation (1.2 MWp)', group: 'ESG', startDate: '2026-08-01', endDate: '2026-09-30', progress: 85, status: 'in-progress' as const },
  { id: 'CAP-02', name: 'Automated Guided Vehicles (AGV) Fleet', group: 'Logistics', startDate: '2026-09-01', endDate: '2026-10-31', progress: 30, status: 'in-progress' as const },
  { id: 'CAP-03', name: 'Effluent Treatment Plant (ETP) Zero Discharge', group: 'ESG', startDate: '2026-08-15', endDate: '2026-11-15', progress: 45, status: 'in-progress' as const },
  { id: 'CAP-04', name: 'Laser Blanking Machine Commissioning', group: 'Production', startDate: '2026-10-01', endDate: '2026-12-15', progress: 0, status: 'scheduled' as const },
];

const COMPACT_TASKS = [
  { id: 'SMED-1', name: 'De-clamping Old Die', startDate: '2026-09-24', endDate: '2026-09-24', progress: 100, status: 'completed' as const },
  { id: 'SMED-2', name: 'Crane Hoist & Die Swap', startDate: '2026-09-24', endDate: '2026-09-24', progress: 80, status: 'in-progress' as const },
  { id: 'SMED-3', name: 'Clamp New Die & First-Off Test', startDate: '2026-09-24', endDate: '2026-09-25', progress: 0, status: 'scheduled' as const },
];

// 1. Default Baseline Schedule
export const Default: Story = {
  args: {
    title: 'PL-04 Annual Maintenance & Tooling Overhaul',
    subtitle: 'Chakan Plant Heavy Press Bay & Substation Turnaround Schedule',
    width: 860,
    height: 440,
    variant: 'dependency',
    defaultZoom: 'day',
    todayDate: new Date('2026-09-12'),
    tasks: DEFAULT_TASKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-ANNUAL-TURNAROUND"
      title="PL-04 Annual Maintenance & Tooling Overhaul"
      subtitle="Chakan Plant Heavy Press Bay & Substation Turnaround Schedule"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Overall Progress', value: '56.4%', sub: 'On Schedule (Day 12)', tone: 'success' },
        { label: 'Critical Path Task', value: 'T-03 Schuler 1200T', sub: '60% Done (Clutch)', tone: 'warning' },
        { label: 'Completed Tasks', value: '2 of 6', sub: 'Substation & Hyd Press', tone: 'success' },
        { label: 'Milestone Run', value: '24 Sep 2026', sub: 'Trial Stamping QA', tone: 'neutral' },
      ]}
      uclLimit="24 Sep 2026 (Go-Live Deadline)"
      lclLimit="01 Sep 2026 (Project Kickoff)"
      tableData={DEFAULT_TASKS}
      tableColumns={[
        { key: 'id', label: 'WBS Code' },
        { key: 'name', label: 'Work Package Description' },
        { key: 'group', label: 'Shop Center' },
        { key: 'startDate', label: 'Start Date' },
        { key: 'endDate', label: 'End Date' },
        { key: 'progress', label: 'Progress (%)', align: 'right' },
        { key: 'owner', label: 'Assigned Lead' },
      ]}
    >
      <GanttChart {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Grouped Variant by Department
export const Variants: Story = {
  args: {
    title: 'EV Transaxle Tooling Commissioning Gantt',
    subtitle: 'Cross-functional engineering milestones grouped by shop-floor workcenter',
    width: 860,
    height: 460,
    variant: 'grouped',
    defaultZoom: 'week',
    todayDate: new Date('2026-09-15'),
    tasks: VARIANTS_TASKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-EV-PROGRAM"
      title="EV Transaxle Tooling Commissioning Gantt"
      subtitle="Cross-functional engineering milestones grouped by shop-floor workcenter"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Active Phase', value: 'EV-03 Tooling EDM', sub: '40% Progress', tone: 'warning' },
        { label: 'PPAP Sample ETA', value: '23 Sep 2026', sub: 'Level 3 Submission', tone: 'neutral' },
        { label: 'Commercial SOP', value: '10 Oct 2026', sub: '500 sets/day Ramp', tone: 'success' },
        { label: 'Phase Milestones', value: '2 Completed', sub: 'Castings & Tryout #1', tone: 'success' },
      ]}
      uclLimit="10 Oct 2026 (SOP Commercial Launch)"
      lclLimit="15 Aug 2026 (Tooling Import Start)"
      tableData={VARIANTS_TASKS}
      tableColumns={[
        { key: 'id', label: 'Task ID' },
        { key: 'name', label: 'Milestone Title' },
        { key: 'group', label: 'Department' },
        { key: 'startDate', label: 'Start' },
        { key: 'endDate', label: 'End' },
        { key: 'progress', label: 'Progress (%)', align: 'right' },
      ]}
    >
      <GanttChart {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Threshold and Critical Path Highlighting
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'Line 4 Emergency Breakdown Recovery Critical Path',
    subtitle: 'Zero-buffer critical path with overdue alert status',
    width: 860,
    height: 400,
    variant: 'dependency',
    defaultZoom: 'day',
    todayDate: new Date('2026-09-14'),
    tasks: CRITICAL_TASKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-EMERG-BD-04"
      title="Line 4 Emergency Breakdown Recovery Critical Path"
      subtitle="Zero-buffer critical path with overdue alert status"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Critical Path Delay', value: '+18 Hours', sub: 'Rod Fabrication Overdue', tone: 'critical' },
        { label: 'Root Cause Status', value: 'CLOSED', sub: 'Die Jamming Cleared', tone: 'success' },
        { label: 'Line Assembly ETA', value: '17 Sep 2026', sub: 'Pressure Test Pending', tone: 'warning' },
        { label: 'Line Release Signoff', value: '18 Sep 2026', sub: 'Shift A Supervisor', tone: 'neutral' },
      ]}
      uclLimit="18 Sep 2026 (OEM Delivery Penalty Deadline)"
      lclLimit="08 Sep 2026 (Breakdown Occurrence)"
      tableData={CRITICAL_TASKS}
      tableColumns={[
        { key: 'id', label: 'Code' },
        { key: 'name', label: 'Recovery Action' },
        { key: 'startDate', label: 'Scheduled Start' },
        { key: 'endDate', label: 'Target Completion' },
        { key: 'progress', label: 'Progress (%)', align: 'right' },
        { key: 'status', label: 'Health Status' },
      ]}
    >
      <GanttChart {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

const GanttChartMissingTelemetryInteractiveStory: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('SAP PM Gateway Reconnecting', 'Establishing SOAP/REST API sync with SAP Plant Maintenance Work Order Server...');

    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('Work Order Feed Restored', 'Synchronized 8 active turnaround tasks for PL-04 Overhaul.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('CMMS Link Offline', 'Simulated ERP Maintenance Server session timeout.');
  };

  const kpis: KPIItem[] = telemetryState === 'restored'
    ? [
        { label: 'CMMS Sync Link', value: 'ONLINE (SAP PM)', sub: 'ERP Work Orders Synced', tone: 'success' },
        { label: 'Active Scheduled Tasks', value: '8 Tasks', sub: 'Q4 Turnaround Active', tone: 'success' },
        { label: 'Critical Path Health', value: 'Nominal', sub: 'Zero Slippage Logged', tone: 'success' },
        { label: 'Plant Availability', value: '98.5%', sub: 'Within SLA Spec', tone: 'success' },
      ]
    : [
        { label: 'CMMS Sync Link', value: 'DISCONNECTED', sub: 'SAP PM Server Timeout', tone: 'critical' },
        { label: 'Scheduled Tasks', value: '0 Tasks Logged', sub: 'Awaiting ERP Link', tone: 'neutral' },
        { label: 'Grid Availability', value: '100%', sub: 'MSEDCL Feed Normal', tone: 'success' },
        { label: 'Standby DG Set', value: 'Ready (1.5 MVA)', sub: 'Full Diesel Reserve', tone: 'success' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SHUTDOWN-PLAN"
      title="PL-04 Plant Shut-Down Plan (FY 26-27 Q4)"
      subtitle="Real-time SAP PM turnaround schedule and work order synchronizer"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={kpis}
      uclLimit="0 Days (Zero Planned Downtime)"
      lclLimit="0 Days"
      tableData={telemetryState === 'restored' ? DEFAULT_TASKS : []}
      tableColumns={[
        { key: 'id', label: 'Task ID' },
        { key: 'name', label: 'Task Name' },
        { key: 'group', label: 'Department' },
        { key: 'progress', label: 'Progress (%)', align: 'right' },
        { key: 'status', label: 'Status' },
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', boxSizing: 'border-box' }}>
        {/* Simulation Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            backgroundColor: telemetryState === 'offline' ? '#fef2f2' : telemetryState === 'reconnecting' ? '#fefce8' : '#f0fdf4',
            border: `1px solid ${telemetryState === 'offline' ? '#fecaca' : telemetryState === 'reconnecting' ? '#fef08a' : '#bbf7d0'}`,
            borderRadius: '6px',
            fontSize: '0.875rem',
            boxSizing: 'border-box',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 260px', minWidth: 0 }}>
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: telemetryState === 'offline' ? '#b91c1c' : telemetryState === 'reconnecting' ? '#ca8a04' : '#15803D',
              }}
            />
            <span
              style={{
                fontWeight: 600,
                wordBreak: 'break-word',
                color: telemetryState === 'offline' ? '#991b1b' : telemetryState === 'reconnecting' ? '#854d0e' : '#166534',
              }}
            >
              {telemetryState === 'offline'
                ? 'CMMS SERVER OFFLINE: SAP PM Gateway Timed Out (No active work orders received)'
                : telemetryState === 'reconnecting'
                ? 'CONNECTING TO SAP PM: Negotiating ERP Work Order Sync on port 443...'
                : 'CMMS FEED ONLINE: Live scheduled maintenance tasks synchronized'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            {telemetryState === 'offline' ? (
              <Button size="sm" variant="primary" onClick={handleReconnect}>
                Simulate Gateway Reconnect
              </Button>
            ) : (
              <Button size="sm" variant="secondary" onClick={handleDisconnect} disabled={telemetryState === 'reconnecting'}>
                Simulate Bus Dropout
              </Button>
            )}
          </div>
        </div>

        <GanttChart
          title="PL-04 Plant Turnaround & Overhaul Schedule"
          subtitle="Real-time CMMS maintenance timeline"
          width={760}
          height={320}
          tasks={telemetryState === 'restored' ? DEFAULT_TASKS : []}
          ariaLabel="No active scheduled turnaround tasks found for the selected timeline."
        />
      </div>
    </EnterpriseChartStoryShell>
  );
};

// 4. Missing Telemetry & Empty State
export const MissingTelemetryAndEmpty: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <GanttChartMissingTelemetryInteractiveStory />
    </ToastProvider>
  ),
};

// 5. High Density Multi-Shift Work Orders
export const HighDensityMultiShift: Story = {
  args: {
    title: '24-Hour Continuous Shift Handover Maintenance Log',
    subtitle: 'Shift A (06:00-14:00), Shift B (14:00-22:00), Shift C (22:00-06:00)',
    width: 880,
    height: 480,
    variant: 'progress',
    defaultZoom: 'day',
    todayDate: new Date('2026-09-24'),
    tasks: MULTI_SHIFT_TASKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-HANDOVER-LOG"
      title="24-Hour Continuous Shift Handover Maintenance Log"
      subtitle="Shift A (06:00-14:00), Shift B (14:00-22:00), Shift C (22:00-06:00)"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Shift A Tasks', value: '100% Completed', sub: '2 of 2 Handed Over', tone: 'success' },
        { label: 'Shift B Active', value: '65% Average', sub: '2 Tasks In-Progress', tone: 'warning' },
        { label: 'Shift C Queued', value: '2 Tasks Scheduled', sub: 'NDT Crack Testing', tone: 'neutral' },
        { label: 'Handover Compliance', value: '98.5%', sub: 'Zero Open Criticals', tone: 'success' },
      ]}
      uclLimit="24h Window (Daily Handover Cap)"
      lclLimit="0h"
      tableData={MULTI_SHIFT_TASKS}
      tableColumns={[
        { key: 'id', label: 'Work Order' },
        { key: 'name', label: 'Maintenance Operation' },
        { key: 'owner', label: 'Technician' },
        { key: 'progress', label: 'Progress (%)', align: 'right' },
        { key: 'status', label: 'Current State' },
      ]}
    >
      <GanttChart {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

// 6. Accessible Patterns and Direct Search
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'Plant 04 Capital Expenditure Upgrade Projects',
    subtitle: 'Keyboard navigable tasks with interactive search filter and high-contrast status pills',
    width: 860,
    height: 440,
    variant: 'basic',
    showSearch: true,
    showControls: true,
    tasks: ACCESSIBLE_TASKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-CAPEX-PROJECTS"
      title="Plant 04 Capital Expenditure Upgrade Projects"
      subtitle="Keyboard navigable tasks with interactive search filter and high-contrast status pills"
      shift="Shift A (06:00 – 14:00 IST)"
      defaultView="table"
      kpis={[
        { label: 'Solar Rooftop (1.2 MW)', value: '85% Progress', sub: 'Grid Sync 30 Sep', tone: 'success' },
        { label: 'AGV Fleet Deployment', value: '30% Progress', sub: 'Trial on Bay 3', tone: 'warning' },
        { label: 'ETP Zero Discharge', value: '45% Progress', sub: 'Civil Work Complete', tone: 'warning' },
        { label: 'Laser Blanking CapEx', value: '₹ 4.2 Cr', sub: 'Starts 01 Oct', tone: 'neutral' },
      ]}
      uclLimit="31 Dec 2026 (CapEx Budget Year End)"
      lclLimit="01 Aug 2026 (Kickoff)"
      tableData={ACCESSIBLE_TASKS}
      tableColumns={[
        { key: 'id', label: 'Project ID' },
        { key: 'name', label: 'CapEx Initiative' },
        { key: 'group', label: 'Focus Area' },
        { key: 'startDate', label: 'Start Date' },
        { key: 'endDate', label: 'Completion Target' },
        { key: 'progress', label: 'Progress (%)', align: 'right' },
      ]}
    >
      <GanttChart {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    title: 'Press Line 01 Die Changeover',
    subtitle: 'SMED Target: < 45 Mins',
    width: 480,
    height: 240,
    variant: 'progress',
    showControls: false,
    showSearch: false,
    tasks: COMPACT_TASKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SMED-01"
      title="Press Line 01 Die Changeover"
      subtitle="SMED Target: < 45 Mins"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Elapsed SMED Time', value: '28 Mins', sub: 'Target 45 Mins', tone: 'success' },
        { label: 'Crane Hoist Status', value: '80% Clamped', sub: 'Die Set D-12', tone: 'warning' },
        { label: 'First Off Stamping', value: 'Scheduled', sub: 'CMM Check Next', tone: 'neutral' },
        { label: 'Tool Room Signoff', value: 'P. Joshi', sub: 'Quality Inspector', tone: 'success' },
      ]}
      uclLimit="45 Mins (Max SMED Window)"
      lclLimit="20 Mins (Benchmark Record)"
      tableData={COMPACT_TASKS}
      tableColumns={[
        { key: 'id', label: 'Step' },
        { key: 'name', label: 'SMED Action' },
        { key: 'progress', label: 'Progress (%)', align: 'right' },
        { key: 'status', label: 'Status' },
      ]}
    >
      <GanttChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

/**
 * Dedicated accessibility story showcasing the built-in tabular summary mirror disclosure
 * satisfying WCAG 2.2 AA non-text contrast and non-visual data consumption.
 */
export const AccessibleDataTableMirror: Story = {
  args: {
    title: 'Plant PL-04 Overhaul Schedule (Accessible Table Mirror)',
    subtitle: 'Screen Reader Accessible Non-Visual Representation',
    tasks: DEFAULT_TASKS,
    showDataTable: true,
    width: 800,
    height: 400,
  },
};
