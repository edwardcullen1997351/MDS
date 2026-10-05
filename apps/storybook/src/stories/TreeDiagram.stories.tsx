import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TreeDiagram, Button, ToastProvider, useToast } from '@ds/react';
import { EnterpriseChartStoryShell, KPIItem } from './components/EnterpriseChartStoryShell';

const meta: Meta<typeof TreeDiagram> = {
  title: 'Data Visualization/TreeDiagram',
  component: TreeDiagram,
  parameters: {
    docs: {
      description: {
        component:
          'TreeDiagram displays hierarchical plant equipment taxonomy, ERP functional location trees, Bill of Materials (BOM) parent-child breakdowns, and root-cause fault trees for Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    linkStyle: {
      control: 'select',
      options: ['smooth', 'step', 'straight'],
    },
    collapsible: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TreeDiagram>;

const PLANT_TAXONOMY_ROOT = {
  id: 'root-pl04',
  label: 'Chakan Plant (PL-04)',
  category: 'Plant Facility',
  status: 'operational',
  code: 'PL04-PUNE',
  children: [
    {
      id: 'shop-press',
      label: 'Press & Stamping Bay',
      category: 'Workcenter',
      status: 'operational',
      children: [
        {
          id: 'm-press-800',
          label: 'Press 01 (Komatsu 800T)',
          category: 'Heavy Machine',
          status: 'operational',
          children: [
            { id: 'sub-hyd-800', label: 'Hydraulic Power Pack', category: 'Subsystem', status: 'operational' },
            { id: 'sub-ram-800', label: 'Slide Ram & Guide Gibs', category: 'Subsystem', status: 'operational' },
          ],
        },
        {
          id: 'm-press-1200',
          label: 'Press 02 (Schuler 1200T)',
          category: 'Heavy Machine',
          status: 'warning',
          children: [
            { id: 'sub-clutch-1200', label: 'Pneumatic Clutch & Brake', category: 'Subsystem', status: 'warning' },
            { id: 'sub-cushion-1200', label: 'Die Cushion Bed', category: 'Subsystem', status: 'operational' },
          ],
        },
      ],
    },
    {
      id: 'shop-cnc',
      label: 'CNC Machining Cell',
      category: 'Workcenter',
      status: 'operational',
      children: [
        {
          id: 'm-cnc-makino',
          label: 'Makino HMC A51nx',
          category: 'Machining Center',
          status: 'operational',
          children: [
            { id: 'sub-spindle-mak', label: '14,000 RPM Spindle Unit', category: 'Subsystem', status: 'operational' },
            { id: 'sub-atc-mak', label: '60-Tool ATC Magazine', category: 'Subsystem', status: 'operational' },
          ],
        },
        {
          id: 'm-cnc-mazak',
          label: 'Mazak VCN-530C',
          category: 'Machining Center',
          status: 'operational',
          children: [
            { id: 'sub-spindle-maz', label: 'Direct-Drive Spindle', category: 'Subsystem', status: 'operational' },
          ],
        },
      ],
    },
    {
      id: 'shop-weld',
      label: 'Robotic Welding Bay',
      category: 'Workcenter',
      status: 'operational',
      children: [
        { id: 'm-robot-abb', label: 'ABB IRB 6700 Weld Cell', category: 'Robot', status: 'operational' },
        { id: 'm-robot-kuka', label: 'KUKA KR 210 Seam Cell', category: 'Robot', status: 'operational' },
      ],
    },
  ],
};

const BOM_ROOT = {
  id: 'bom-root',
  label: 'EV Transaxle Assy',
  category: 'Finished Product',
  status: 'operational',
  code: 'TA-EV-500',
  children: [
    {
      id: 'bom-casing',
      label: 'Alloy Casing Sub-Assy',
      category: 'Sub-Assy',
      status: 'operational',
      children: [
        { id: 'p-upper-case', label: 'Upper Case 6061', category: 'Part', status: 'operational' },
        { id: 'p-lower-case', label: 'Lower Case 6061', category: 'Part', status: 'operational' },
      ],
    },
    {
      id: 'bom-geartrain',
      label: 'Planetary Geartrain',
      category: 'Sub-Assy',
      status: 'operational',
      children: [
        { id: 'p-sun-gear', label: 'Sun Gear 20CrMnTi', category: 'Part', status: 'operational' },
        { id: 'p-planet-carrier', label: 'Planet Carrier', category: 'Part', status: 'operational' },
        { id: 'p-ring-gear', label: 'Internal Ring Gear', category: 'Part', status: 'operational' },
      ],
    },
    {
      id: 'bom-diff',
      label: 'Differential Unit',
      category: 'Sub-Assy',
      status: 'operational',
      children: [
        { id: 'p-pinion', label: 'Bevel Pinion Set', category: 'Part', status: 'operational' },
        { id: 'p-side-gear', label: 'Side Gears (x2)', category: 'Part', status: 'operational' },
      ],
    },
  ],
};

const FTA_ROOT = {
  id: 'fta-root',
  label: 'Hydraulic Pressure Loss Trip',
  category: 'Top Event',
  status: 'alarm',
  children: [
    {
      id: 'fta-pump',
      label: 'Main Vane Pump Failure',
      category: 'Intermediate',
      status: 'alarm',
      children: [
        { id: 'fta-cavitation', label: 'Fluid Cavitation / Air Ingestion', category: 'Basic Cause', status: 'alarm' },
        { id: 'fta-seal', label: 'Shaft Seal Rupture', category: 'Basic Cause', status: 'idle' },
      ],
    },
    {
      id: 'fta-filter',
      label: 'High Differential Pressure Filter Block',
      category: 'Intermediate',
      status: 'alarm',
      children: [
        { id: 'fta-particulate', label: 'Metal Debris in 10µm Filter', category: 'Basic Cause', status: 'alarm' },
        { id: 'fta-clog-sensor', label: 'Pressure Sensor Drift', category: 'Basic Cause', status: 'idle' },
      ],
    },
    {
      id: 'fta-relief',
      label: 'Pressure Relief Valve Bypass',
      category: 'Intermediate',
      status: 'idle',
      children: [
        { id: 'fta-spring', label: 'Broken Spring', category: 'Basic Cause', status: 'idle' },
      ],
    },
  ],
};

const QA_ROOT = {
  id: 'qa-head',
  label: 'VP Quality & Operations',
  category: 'Executive',
  status: 'operational',
  children: [
    {
      id: 'qa-plant-mgr',
      label: 'Chakan QA Plant Manager',
      category: 'Management',
      status: 'operational',
      children: [
        { id: 'qa-shift-a', label: 'Shift A QA Lead Engineer', category: 'Lead', status: 'operational' },
        { id: 'qa-shift-b', label: 'Shift B QA Lead Engineer', category: 'Lead', status: 'operational' },
        { id: 'qa-shift-c', label: 'Shift C QA Lead Engineer', category: 'Lead', status: 'operational' },
      ],
    },
    {
      id: 'qa-sqa-mgr',
      label: 'Supplier Quality Manager (SQA)',
      category: 'Management',
      status: 'operational',
      children: [
        { id: 'qa-sqa-steel', label: 'Raw Steel Auditor', category: 'Auditor', status: 'operational' },
        { id: 'qa-sqa-foundry', label: 'Foundry & Castings Auditor', category: 'Auditor', status: 'operational' },
      ],
    },
  ],
};

const COMPACT_ROOT = {
  id: 'p1',
  label: 'Press 800T',
  status: 'operational',
  children: [
    { id: 'hyd', label: 'Hydraulics', status: 'operational' },
    { id: 'elec', label: 'Drive VFD', status: 'warning' },
  ],
};

const TAXONOMY_FLAT_TABLE = [
  { code: 'PL04-PUNE', label: 'Chakan Plant Main', level: 'Plant (L1)', status: 'Operational' },
  { code: 'PL04-PRESS', label: 'Press & Stamping Bay', level: 'Workcenter (L2)', status: 'Operational' },
  { code: 'PL04-P01', label: 'Press 01 (Komatsu 800T)', level: 'Machine (L3)', status: 'Operational' },
  { code: 'PL04-P02', label: 'Press 02 (Schuler 1200T)', level: 'Machine (L3)', status: 'Warning' },
  { code: 'PL04-CNC', label: 'CNC Machining Cell', level: 'Workcenter (L2)', status: 'Operational' },
  { code: 'PL04-MAK', label: 'Makino HMC A51nx', level: 'Machine (L3)', status: 'Operational' },
  { code: 'PL04-WELD', label: 'Robotic Welding Bay', level: 'Workcenter (L2)', status: 'Operational' },
];

// 1. Default Baseline Tree Story
export const Default: Story = {
  args: {
    title: 'PL-04 Enterprise Equipment Hierarchy (ISA-95 Level 2/3)',
    subtitle: 'Chakan Plant functional location breakdown: Plant -> Shop Bay -> Machine -> Subsystem',
    width: 860,
    height: 520,
    orientation: 'horizontal',
    linkStyle: 'smooth',
    collapsible: true,
    data: PLANT_TAXONOMY_ROOT,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-EAM-HIERARCHY"
      title="PL-04 Enterprise Equipment Hierarchy (ISA-95 Level 2/3)"
      subtitle="Chakan Plant functional location breakdown: Plant -> Shop Bay -> Machine -> Subsystem"
      shift="SAP PM / ISA-95 Tree"
      kpis={[
        { label: 'Asset Taxonomy Nodes', value: '14 Equipment Assets', sub: 'Covering 3 Production Bays', tone: 'success' },
        { label: 'Operational Assets', value: '13 / 14 (92.8%)', sub: 'Healthy Running State', tone: 'success' },
        { label: 'Asset Under Warning', value: 'Schuler 1200T Clutch', sub: 'PM Overhaul Scheduled', tone: 'warning' },
        { label: 'ISA-95 Standard', value: 'Level 2/3 Tagged', sub: 'MES SCADA Integrated', tone: 'neutral' },
      ]}
      uclLimit="100% Asset Health"
      lclLimit="85% Minimum Threshold"
      tableData={TAXONOMY_FLAT_TABLE}
      tableColumns={[
        { key: 'code', label: 'Asset Tag Code' },
        { key: 'label', label: 'Functional Location Name' },
        { key: 'level', label: 'ISA-95 Tier' },
        { key: 'status', label: 'Asset Condition' },
      ]}
    >
      <TreeDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Vertical Orientation Variant
export const Variants: Story = {
  args: {
    title: 'Transaxle Assembly Bill of Materials (BOM) Tree',
    subtitle: 'Vertical multi-level engineering BOM hierarchy with step connectors',
    width: 860,
    height: 520,
    orientation: 'vertical',
    linkStyle: 'step',
    collapsible: true,
    nodeWidth: 140,
    nodeHeight: 52,
    data: BOM_ROOT,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-BOM-TREE"
      title="Transaxle Assembly Bill of Materials (BOM) Tree"
      subtitle="Vertical multi-level engineering BOM hierarchy with step connectors"
      shift="Engineering Release Tree"
      kpis={[
        { label: 'Finished Product', value: 'TA-EV-500', sub: 'EV Transaxle Assy', tone: 'success' },
        { label: 'Sub-Assemblies', value: '3 Major Units', sub: 'Casing, Geartrain, Diff', tone: 'success' },
        { label: 'Component Leaf Parts', value: '7 Child Parts', sub: '100% Sourced & Tracked', tone: 'success' },
        { label: 'PLM Sync', value: 'Released Rev D', sub: 'Teamcenter PLM Linked', tone: 'neutral' },
      ]}
      uclLimit="100% BOM Level Traceability"
      lclLimit="0 Missing Child Nodes"
      tableData={[
        { id: 'TA-EV-500', name: 'EV Transaxle Finished Assembly', level: 'Level 0 (Finished)' },
        { id: 'Sub-Assy 1', name: 'Alloy Casing (Upper & Lower 6061)', level: 'Level 1 (Sub-Assy)' },
        { id: 'Sub-Assy 2', name: 'Planetary Geartrain (Sun, Carrier, Ring)', level: 'Level 1 (Sub-Assy)' },
        { id: 'Sub-Assy 3', name: 'Differential Unit (Pinion & Side Gears)', level: 'Level 1 (Sub-Assy)' },
      ]}
      tableColumns={[
        { key: 'id', label: 'Part / Assembly Code' },
        { key: 'name', label: 'Component Nomenclature' },
        { key: 'level', label: 'BOM Indenture Level' },
      ]}
    >
      <TreeDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Fault Tree Analysis (FTA) Threshold / Alarm State
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'Root Cause Fault Tree: Press Line 2 Emergency Hydraulic Trip',
    subtitle: 'Diagnostic branching identifying sensor failure & dirty filter root causes',
    width: 860,
    height: 480,
    orientation: 'horizontal',
    linkStyle: 'smooth',
    data: FTA_ROOT,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-FTA-PRESS2"
      title="Root Cause Fault Tree: Press Line 2 Emergency Hydraulic Trip"
      subtitle="Diagnostic branching identifying sensor failure & dirty filter root causes"
      shift="Emergency RCA Breakdown"
      kpis={[
        { label: 'Top Event Failure', value: 'Pressure Loss Trip', sub: 'Press 02 Tripped at 10:15', tone: 'critical' },
        { label: 'Root Cause 1', value: 'Fluid Cavitation', sub: 'Air Ingestion in Pump', tone: 'critical' },
        { label: 'Root Cause 2', value: 'Filter Blockage', sub: 'Metal Debris in 10µm Element', tone: 'critical' },
        { label: 'Corrective PM', value: 'Element Replaced', sub: 'Line Resumed 11:45', tone: 'success' },
      ]}
      uclLimit="0 Uncontained Root Causes"
      lclLimit="100% Corrective Action Signoff"
      tableData={[
        { event: 'Hydraulic Pressure Loss Trip', type: 'Top Event', status: 'Alarm Active' },
        { event: 'Main Vane Pump Failure', type: 'Intermediate Branch', status: 'Alarm Active' },
        { event: 'Fluid Cavitation / Air Ingestion', type: 'Basic Root Cause', status: 'Verified Active' },
        { event: 'Metal Debris in 10µm Filter', type: 'Basic Root Cause', status: 'Verified Active' },
      ]}
      tableColumns={[
        { key: 'event', label: 'Fault Event Description' },
        { key: 'type', label: 'FTA Event Classification' },
        { key: 'status', label: 'Diagnostic Verification' },
      ]}
    >
      <TreeDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

const RESTORED_ROBOT_BOM_ROOT = {
  id: 'line8-cell',
  label: 'Line 8 Robotic Spot Weld Cell (ABB IRB-6700)',
  category: 'Robot Workcell',
  status: 'operational',
  children: [
    {
      id: 'arm-6700',
      label: '6-Axis Articulated Arm (IRB-6700)',
      category: 'Manipulator',
      status: 'operational',
      children: [
        { id: 'j1-j3', label: 'Primary Axis Drive (J1–J3 AC Servos)', category: 'Drives', status: 'operational' },
        { id: 'j4-j6', label: 'Wrist Assembly (J4–J6 Harmonic Drives)', category: 'Drives', status: 'operational' },
      ],
    },
    {
      id: 'tool-gun',
      label: 'Servo Spot Welding Gun (ARO Heavy-Duty)',
      category: 'End Effector',
      status: 'operational',
      children: [
        { id: 'gun-trans', label: 'MFDC Transformer (100 kVA)', category: 'Electrical', status: 'operational' },
        { id: 'gun-elec', label: 'CuCrZr Electrode Tip Holders', category: 'Wear Parts', status: 'operational' },
      ],
    },
  ],
};

const RESTORED_ROBOT_TABLE = [
  { id: 'line8-cell', label: 'Line 8 Spot Weld Cell', cat: 'Robot Workcell', status: 'Operational' },
  { id: 'arm-6700', label: '6-Axis Articulated Arm', cat: 'Manipulator', status: 'Operational' },
  { id: 'tool-gun', label: 'Servo Spot Welding Gun', cat: 'End Effector', status: 'Operational' },
  { id: 'gun-trans', label: 'MFDC Transformer (100 kVA)', cat: 'Electrical', status: 'Operational' },
];

const TreeDiagramMissingTelemetryInteractiveStory: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('PLM Teamcenter Syncing', 'Parsing STEP AP242 / JT model for Line 8 robot cell BOM...');

    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('Robot Cell BOM Synchronized', 'Restored 7 assembly hierarchy nodes for ABB IRB-6700 cell.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('PLM Connector Timeout', 'Simulated Siemens Teamcenter PLM connector disconnect.');
  };

  const kpis: KPIItem[] = telemetryState === 'restored'
    ? [
        { label: 'Hierarchy Status', value: 'SYNCED (7 Nodes)', sub: 'Teamcenter PLM Linked', tone: 'success' },
        { label: 'Robot Workcell', value: 'ABB IRB-6700', sub: '6-Axis Manipulator', tone: 'success' },
        { label: 'Spot Weld Gun', value: 'ARO MFDC 100kVA', sub: 'Servo Actuated', tone: 'success' },
        { label: 'Schema Version', value: 'ISO 10303 AP242', sub: 'Automotive Standard', tone: 'success' },
      ]
    : [
        { label: 'Hierarchy Status', value: 'AWAITING CAD / OFFLINE', sub: 'STEP / JT Import Pending', tone: 'critical' },
        { label: 'Target Nodes', value: '0 / 7 Nodes Loaded', sub: 'Line 8 Robotic Cell', tone: 'neutral' },
        { label: 'Schema Version', value: 'ISO 10303 AP242', sub: 'Standard Automotive CAD', tone: 'neutral' },
        { label: 'Sync Channel', value: 'PLM Teamcenter', sub: 'Connector Offline', tone: 'warning' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-ROBO-LINE8"
      title="Line 8 Robot Cell BOM Hierarchy"
      subtitle="Engineering CAD assembly taxonomy and functional location breakdown"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={kpis}
      uclLimit="100% Node Parsing"
      lclLimit="0 Missing Definitions"
      tableData={telemetryState === 'restored' ? RESTORED_ROBOT_TABLE : []}
      tableColumns={[
        { key: 'id', label: 'Node ID' },
        { key: 'label', label: 'Assembly Component' },
        { key: 'cat', label: 'Classification' },
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
                ? 'BOM HIERARCHY OFFLINE: PLM Teamcenter connector disconnected (Awaiting CAD schema ingestion)'
                : telemetryState === 'reconnecting'
                ? 'INGESTING CAD: Parsing STEP AP242 / JT model for Line 8 robot cell...'
                : 'BOM HIERARCHY ONLINE: 7 robotic workcell nodes active'}
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

        <TreeDiagram
          title="Line 8 Robot Cell BOM Hierarchy"
          subtitle="Engineering CAD assembly taxonomy and functional location breakdown"
          width={680}
          height={300}
          orientation="horizontal"
          data={telemetryState === 'restored' ? RESTORED_ROBOT_BOM_ROOT : { id: 'empty', label: 'No Hierarchy Data Loaded', status: 'idle' }}
        />
      </div>
    </EnterpriseChartStoryShell>
  );
};

// 4. Missing Telemetry & Empty State
export const MissingTelemetryAndEmpty: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <TreeDiagramMissingTelemetryInteractiveStory />
    </ToastProvider>
  ),
};

// 5. High Density Multi-Shift Complex 5-Level Hierarchy
export const HighDensityMultiShift: Story = {
  args: {
    title: 'Enterprise Asset Management (EAM) Deep Plant Hierarchy',
    subtitle: 'Comprehensive 5-level functional location map with zoom & pan navigation',
    width: 880,
    height: 540,
    orientation: 'horizontal',
    zoomable: true,
    data: PLANT_TAXONOMY_ROOT,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-EAM-FULL"
      title="Enterprise Asset Management (EAM) Deep Plant Hierarchy"
      subtitle="Comprehensive 5-level functional location map with zoom & pan navigation"
      shift="Enterprise EAM Architecture"
      kpis={[
        { label: 'Hierarchy Depth', value: '4 Levels', sub: 'Plant -> Bay -> Machine -> Sub', tone: 'success' },
        { label: 'Total Tracked Assets', value: '14 Units', sub: '100% In SAP PM Database', tone: 'success' },
        { label: 'Active Sensors', value: '38 Telemetry Nodes', sub: 'Vibration & Thermal', tone: 'success' },
        { label: 'Preventive Compliance', value: '98.2%', sub: 'Zero Overdue PM Work Orders', tone: 'success' },
      ]}
      uclLimit="50 Assets / Workcenter"
      lclLimit="1 Asset Baseline"
      tableData={TAXONOMY_FLAT_TABLE}
      tableColumns={[
        { key: 'code', label: 'SAP Functional Location' },
        { key: 'label', label: 'Asset Name' },
        { key: 'level', label: 'Hierarchy Level' },
        { key: 'status', label: 'Operational State' },
      ]}
    >
      <TreeDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 6. Accessible Patterns and Keyboard Traversal
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'Quality Escalation Matrix & Authority Tree',
    subtitle: 'Keyboard roving focus navigation with Enter/Space branch toggle and high contrast pills',
    width: 840,
    height: 480,
    orientation: 'horizontal',
    data: QA_ROOT,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-QA-ESCALATION"
      title="Quality Escalation Matrix & Authority Tree"
      subtitle="Accessible keyboard navigation, branch toggling, and comprehensive table view"
      shift="Corporate Quality Assurance"
      defaultView="table"
      kpis={[
        { label: 'Escalation Levels', value: '3 Management Tiers', sub: 'Executive -> Mgr -> Leads', tone: 'success' },
        { label: 'Shift QA Leads', value: '3 Shifts Covered', sub: 'Shifts A, B, and C', tone: 'success' },
        { label: 'Supplier Quality', value: '2 Specialist Auditors', sub: 'Steel & Foundry SQA', tone: 'success' },
        { label: 'SLA Response Time', value: '< 15 Mins', sub: 'Line Hold Escalation', tone: 'success' },
      ]}
      uclLimit="15 Mins (Max Response Window)"
      lclLimit="0 Mins"
      tableData={[
        { role: 'VP Quality & Operations', person: 'Executive Head', scope: 'Plant-wide Escalations' },
        { role: 'Chakan QA Plant Manager', person: 'Operations Lead', scope: 'Plant Production Quality' },
        { role: 'Shift A QA Lead Engineer', person: 'Shift Engineer', scope: '06:00 – 14:00 Line QA' },
        { role: 'Shift B QA Lead Engineer', person: 'Shift Engineer', scope: '14:00 – 22:00 Line QA' },
        { role: 'Supplier Quality Manager', person: 'SQA Lead', scope: 'Tier-1 & Tier-2 Audits' },
      ]}
      tableColumns={[
        { key: 'role', label: 'Authority Designation' },
        { key: 'person', label: 'Incumbent Role' },
        { key: 'scope', label: 'Escalation Responsibility' },
      ]}
    >
      <TreeDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    title: 'Press 01 Asset Tree',
    subtitle: 'Live status',
    width: 380,
    height: 240,
    orientation: 'horizontal',
    nodeWidth: 110,
    nodeHeight: 40,
    levelSpacing: 50,
    data: COMPACT_ROOT,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-PRESS1-TREE"
      title="Press 01 Asset Tree"
      subtitle="Live status"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Press 800T Main', value: 'RUNNING', sub: 'Nominal Cycle', tone: 'success' },
        { label: 'Hydraulics', value: 'Optimal (210 bar)', sub: 'Oil Temp 52°C', tone: 'success' },
        { label: 'Drive VFD', value: 'Warning (82°C)', sub: 'Fan Speed High', tone: 'warning' },
        { label: 'Subsystems', value: '2 / 2 Tracked', sub: 'SCADA Live', tone: 'success' },
      ]}
      uclLimit="100% Operational Health"
      lclLimit="80%"
      tableData={[
        { id: 'p1', label: 'Komatsu 800T Press', status: 'Operational' },
        { id: 'hyd', label: 'Hydraulic Power Pack', status: 'Operational' },
        { id: 'elec', label: 'Drive VFD Inverter', status: 'Warning (High Temp)' },
      ]}
      tableColumns={[
        { key: 'id', label: 'Subsystem ID' },
        { key: 'label', label: 'Asset Description' },
        { key: 'status', label: 'Health State' },
      ]}
    >
      <TreeDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};
