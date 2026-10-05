import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SankeyDiagram, Button, ToastProvider, useToast } from '@ds/react';
import { EnterpriseChartStoryShell, KPIItem } from './components/EnterpriseChartStoryShell';

const meta: Meta<typeof SankeyDiagram> = {
  title: 'Data Visualization/SankeyDiagram',
  component: SankeyDiagram,
  parameters: {
    docs: {
      description: {
        component:
          'SankeyDiagram visualizes multi-stage quantitative flow, raw steel mass balance, energy distribution losses, scrap recycling streams, and assembly routing for Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    align: {
      control: 'select',
      options: ['justify', 'left', 'right', 'center'],
    },
    linkGradient: {
      control: 'boolean',
    },
    patternFills: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SankeyDiagram>;

const DEFAULT_NODES = [
  { id: 'n-in-crca', label: 'Inbound CRCA Coils (3,000 MT)' },
  { id: 'n-in-dp600', label: 'Inbound DP600 Steel (1,500 MT)' },
  { id: 'n-blanking', label: 'Blanking & Decoiling Line' },
  { id: 'n-press', label: 'Transfer Press Stamping' },
  { id: 'n-finished', label: 'Finished OEM Body Panels' },
  { id: 'n-scrap-trim', label: 'Trimming Offcuts Scrap' },
  { id: 'n-scrap-reject', label: 'Quality Reject Scrap' },
  { id: 'n-recycle', label: 'Foundry Remelting Ingot' },
];

const DEFAULT_LINKS = [
  { source: 'n-in-crca', target: 'n-blanking', value: 3000 },
  { source: 'n-in-dp600', target: 'n-blanking', value: 1500 },
  { source: 'n-blanking', target: 'n-press', value: 3900 },
  { source: 'n-blanking', target: 'n-scrap-trim', value: 600 },
  { source: 'n-press', target: 'n-finished', value: 3600 },
  { source: 'n-press', target: 'n-scrap-reject', value: 300 },
  { source: 'n-scrap-trim', target: 'n-recycle', value: 600 },
  { source: 'n-scrap-reject', target: 'n-recycle', value: 300 },
];

const ENERGY_NODES = [
  { id: 'grid', label: 'MSEDCL 33kV Grid (850 MWh)' },
  { id: 'solar', label: 'Rooftop Solar PV (150 MWh)' },
  { id: 'main-sub', label: 'Main Substation Bus' },
  { id: 'press-shop', label: 'Press Shop Drives (480 MWh)' },
  { id: 'furnace', label: 'Annealing Furnace (240 MWh)' },
  { id: 'cnc-bay', label: 'CNC Bay Machining (160 MWh)' },
  { id: 'lighting-hvac', label: 'Lighting & HVAC (70 MWh)' },
  { id: 'useful-work', label: 'Useful Mechanical Work (720 MWh)' },
  { id: 'heat-loss', label: 'Thermal & Copper Losses (280 MWh)' },
];

const ENERGY_LINKS = [
  { source: 'grid', target: 'main-sub', value: 850 },
  { source: 'solar', target: 'main-sub', value: 150 },
  { source: 'main-sub', target: 'press-shop', value: 480 },
  { source: 'main-sub', target: 'furnace', value: 240 },
  { source: 'main-sub', target: 'cnc-bay', value: 160 },
  { source: 'main-sub', target: 'lighting-hvac', value: 70 },
  { source: 'press-shop', target: 'useful-work', value: 390 },
  { source: 'press-shop', target: 'heat-loss', value: 90 },
  { source: 'furnace', target: 'useful-work', value: 160 },
  { source: 'furnace', target: 'heat-loss', value: 80 },
  { source: 'cnc-bay', target: 'useful-work', value: 130 },
  { source: 'cnc-bay', target: 'heat-loss', value: 30 },
  { source: 'lighting-hvac', target: 'useful-work', value: 40 },
  { source: 'lighting-hvac', target: 'heat-loss', value: 30 },
];

const COST_NODES = [
  { id: 'c-steel', label: 'Raw Steel Coils (₹18.5 Cr)' },
  { id: 'c-power', label: 'Grid Electricity (₹4.2 Cr)' },
  { id: 'c-labor', label: 'Shop Floor Labor (₹3.8 Cr)' },
  { id: 'c-stamping', label: 'Stamping Process (₹16.0 Cr)' },
  { id: 'c-machining', label: 'CNC Machining (₹10.5 Cr)' },
  { id: 'c-oem-ev', label: 'OEM EV Transaxles (₹14.2 Cr)' },
  { id: 'c-oem-ice', label: 'OEM ICE Chassis (₹12.3 Cr)' },
];

const COST_LINKS = [
  { source: 'c-steel', target: 'c-stamping', value: 12.0 },
  { source: 'c-steel', target: 'c-machining', value: 6.5 },
  { source: 'c-power', target: 'c-stamping', value: 2.5 },
  { source: 'c-power', target: 'c-machining', value: 1.7 },
  { source: 'c-labor', target: 'c-stamping', value: 1.5 },
  { source: 'c-labor', target: 'c-machining', value: 2.3 },
  { source: 'c-stamping', target: 'c-oem-ev', value: 8.5 },
  { source: 'c-stamping', target: 'c-oem-ice', value: 7.5 },
  { source: 'c-machining', target: 'c-oem-ev', value: 5.7 },
  { source: 'c-machining', target: 'c-oem-ice', value: 4.8 },
];

const ROUTING_NODES = [
  { id: 's1', label: 'Raw Blanks' },
  { id: 's2', label: 'Line 1 Draw' },
  { id: 's3', label: 'Line 2 Form' },
  { id: 's4', label: 'Pierce Cell 1' },
  { id: 's5', label: 'Pierce Cell 2' },
  { id: 's6', label: 'Laser Trim' },
  { id: 's7', label: 'Weld Cell A' },
  { id: 's8', label: 'Weld Cell B' },
  { id: 's9', label: 'E-Coat Bath' },
  { id: 's10', label: 'Powder Coat' },
  { id: 's11', label: 'Final QA Pack' },
];

const ROUTING_LINKS = [
  { source: 's1', target: 's2', value: 1200 },
  { source: 's1', target: 's3', value: 800 },
  { source: 's2', target: 's4', value: 700 },
  { source: 's2', target: 's5', value: 500 },
  { source: 's3', target: 's5', value: 400 },
  { source: 's3', target: 's6', value: 400 },
  { source: 's4', target: 's7', value: 700 },
  { source: 's5', target: 's7', value: 450 },
  { source: 's5', target: 's8', value: 450 },
  { source: 's6', target: 's8', value: 400 },
  { source: 's7', target: 's9', value: 950 },
  { source: 's7', target: 's10', value: 200 },
  { source: 's8', target: 's9', value: 350 },
  { source: 's8', target: 's10', value: 500 },
  { source: 's9', target: 's11', value: 1300 },
  { source: 's10', target: 's11', value: 700 },
];

const WASTE_NODES = [
  { id: 'w-gen', label: 'Shop Waste Generation (120 T)' },
  { id: 'w-sludge', label: 'Paint ETP Sludge (50 T)' },
  { id: 'w-oil', label: 'Used Hydraulic Oil (45 T)' },
  { id: 'w-coolant', label: 'Spent CNC Coolant (25 T)' },
  { id: 'w-auth-incin', label: 'Authorized Incineration (50 T)' },
  { id: 'w-re-refine', label: 'Oil Re-Refinery Hub (45 T)' },
  { id: 'w-bio-treat', label: 'Bio-Remediation Facility (25 T)' },
];

const WASTE_LINKS = [
  { source: 'w-gen', target: 'w-sludge', value: 50 },
  { source: 'w-gen', target: 'w-oil', value: 45 },
  { source: 'w-gen', target: 'w-coolant', value: 25 },
  { source: 'w-sludge', target: 'w-auth-incin', value: 50 },
  { source: 'w-oil', target: 'w-re-refine', value: 45 },
  { source: 'w-coolant', target: 'w-bio-treat', value: 25 },
];

const COMPACT_NODES = [
  { id: 'in', label: 'Coils (100T)' },
  { id: 'parts', label: 'Parts (88T)' },
  { id: 'scrap', label: 'Scrap (12T)' },
];

const COMPACT_LINKS = [
  { source: 'in', target: 'parts', value: 88 },
  { source: 'in', target: 'scrap', value: 12 },
];

// 1. Default Baseline Mass Balance Story
export const Default: Story = {
  args: {
    title: 'Raw Steel Coil Mass Balance & Yield Flow (MT / Month)',
    subtitle: 'Chakan PL-04 Inbound Raw Coils -> Stamping -> Finished Transaxles & Recycled Offcuts',
    width: 780,
    height: 440,
    unit: ' MT',
    align: 'justify',
    nodes: DEFAULT_NODES,
    links: DEFAULT_LINKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-MASS-BALANCE"
      title="Raw Steel Coil Mass Balance & Yield Flow (MT / Month)"
      subtitle="Chakan PL-04 Inbound Raw Coils -> Stamping -> Finished Transaxles & Recycled Offcuts"
      shift="Monthly Plant Mass Flow"
      kpis={[
        { label: 'Total Inbound Steel', value: '4,500 MT', sub: 'CRCA + DP600 Coils', tone: 'success' },
        { label: 'Finished Yield', value: '3,600 MT (80%)', sub: 'Finished OEM Body Panels', tone: 'success' },
        { label: 'Offcuts Scrap', value: '600 MT (13.3%)', sub: 'Blanking Trimming', tone: 'warning' },
        { label: 'Foundry Recycled', value: '900 MT (20%)', sub: '100% Ingot Remelted', tone: 'success' },
      ]}
      uclLimit="5,000 MT/Mo (Max Coil Throughput)"
      lclLimit="2,000 MT/Mo (Min Quota)"
      tableData={DEFAULT_LINKS}
      tableColumns={[
        { key: 'source', label: 'Source Node' },
        { key: 'target', label: 'Destination Node' },
        { key: 'value', label: 'Flow Volume (MT)', align: 'right' },
      ]}
    >
      <SankeyDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Plant Energy Flow Variant
export const Variants: Story = {
  args: {
    title: 'PL-04 Plant Electrical & Thermal Energy Sankey (MWh)',
    subtitle: '33kV Substation & Solar PV Generation Flow to Shop Bays & Waste Heat Losses',
    width: 780,
    height: 440,
    unit: ' MWh',
    align: 'justify',
    nodes: ENERGY_NODES,
    links: ENERGY_LINKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-ENERGY-SANKEY"
      title="PL-04 Plant Electrical & Thermal Energy Sankey (MWh)"
      subtitle="33kV Substation & Solar PV Generation Flow to Shop Bays & Waste Heat Losses"
      shift="Monthly Energy Audit"
      kpis={[
        { label: 'Total Inflow Energy', value: '1,000 MWh', sub: 'Grid (850) + Solar (150)', tone: 'success' },
        { label: 'Useful Work Output', value: '720 MWh (72%)', sub: 'Mechanical Conversion', tone: 'success' },
        { label: 'Thermal & Copper Loss', value: '280 MWh (28%)', sub: 'Heat Recovery Planned', tone: 'warning' },
        { label: 'Solar Contribution', value: '15.0%', sub: 'Zero-Carbon Power', tone: 'success' },
      ]}
      uclLimit="1,200 MWh (Demand Sanction)"
      lclLimit="500 MWh (Base Operation)"
      tableData={ENERGY_LINKS}
      tableColumns={[
        { key: 'source', label: 'Energy Source / Stage' },
        { key: 'target', label: 'Consumer / Loss' },
        { key: 'value', label: 'Energy (MWh)', align: 'right' },
      ]}
    >
      <SankeyDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Threshold and Cost Allocation Flow
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'Manufacturing Cost Absorption Flow (₹ in Crores)',
    subtitle: 'Allocating direct material, power, and labor to final unit cost',
    width: 780,
    height: 440,
    unit: ' ₹Cr',
    nodes: COST_NODES,
    links: COST_LINKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-COST-SANKEY"
      title="Manufacturing Cost Absorption Flow (₹ in Crores)"
      subtitle="Allocating direct material, power, and labor to final unit cost"
      shift="Cost Accounting Division"
      kpis={[
        { label: 'Total Input Cost', value: '₹ 26.5 Cr', sub: 'Steel (18.5) + Power + Labor', tone: 'neutral' },
        { label: 'OEM EV Transaxles', value: '₹ 14.2 Cr (53.6%)', sub: 'Higher Value Add', tone: 'success' },
        { label: 'OEM ICE Chassis', value: '₹ 12.3 Cr (46.4%)', sub: 'Standard Margin', tone: 'success' },
        { label: 'Stamping Absorption', value: '₹ 16.0 Cr', sub: 'Primary Process Center', tone: 'success' },
      ]}
      uclLimit="₹ 30.0 Cr (Cost Ceiling)"
      lclLimit="₹ 15.0 Cr (Base Cost)"
      tableData={COST_LINKS}
      tableColumns={[
        { key: 'source', label: 'Cost Driver' },
        { key: 'target', label: 'Cost Center' },
        { key: 'value', label: 'Amount (₹ Cr)', align: 'right' },
      ]}
    >
      <SankeyDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

const RESTORED_ETP_NODES = [
  { id: 'etp-raw', label: 'Phosphating & Paint Rinse (30 kL)' },
  { id: 'etp-mach', label: 'CNC Bay Coolant Wash (15 kL)' },
  { id: 'etp-prim', label: 'Primary Coagulation & Clarifier' },
  { id: 'etp-ro', label: 'Reverse Osmosis (RO) Plant' },
  { id: 'etp-reuse', label: 'Permeate Recycled to Rinse (38 kL)' },
  { id: 'etp-sludge', label: 'Evaporator Concentrate (7 kL)' },
];

const RESTORED_ETP_LINKS = [
  { source: 'etp-raw', target: 'etp-prim', value: 30 },
  { source: 'etp-mach', target: 'etp-prim', value: 15 },
  { source: 'etp-prim', target: 'etp-ro', value: 45 },
  { source: 'etp-ro', target: 'etp-reuse', value: 38 },
  { source: 'etp-ro', target: 'etp-sludge', value: 7 },
];

const SankeyDiagramMissingTelemetryInteractiveStory: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('ETP Flow Meters Reconnecting', 'Querying Krohne electromagnetic flow meters over Modbus TCP...');

    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('ETP Flow Telemetry Synchronized', 'Restored 5 flow streams totaling 45 kL/Day liquid balance.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('ETP Telemetry Bus Offline', 'Simulated Modbus TCP gateway timeout on ETP panel.');
  };

  const kpis: KPIItem[] = telemetryState === 'restored'
    ? [
        { label: 'Flow Meter Link', value: 'ONLINE (100 Mbps)', sub: 'Modbus TCP Stream Active', tone: 'success' },
        { label: 'ETP Zero Discharge', value: '84.4% Recovery', sub: '38 kL Recycled to Rinse', tone: 'success' },
        { label: 'Treated Effluent', value: '45 kL / Day', sub: '100% In-Plant Recycled', tone: 'success' },
        { label: 'Evaporator Sludge', value: '7 kL / Day', sub: 'Hazardous Waste Stream', tone: 'warning' },
      ]
    : [
        { label: 'Flow Meter Link', value: 'CALIBRATING / OFFLINE', sub: 'NABL Flow Standard Audit', tone: 'critical' },
        { label: 'ETP Zero Discharge', value: 'Active', sub: 'Recycled Water to Paint', tone: 'success' },
        { label: 'Treated Effluent', value: '100% Retained', sub: 'Zero Municipal Discharge', tone: 'success' },
        { label: 'BOD / COD Sensors', value: 'Online', sub: 'CPCB Cloud Uplinked', tone: 'neutral' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-ETP-SANKEY"
      title="Effluent Treatment Plant (ETP) Liquid Waste Balance"
      subtitle="Flow meters undergoing annual NABL calibration"
      shift="Environmental Safety Team"
      kpis={kpis}
      uclLimit="50 kL/Day (ETP Design Cap)"
      lclLimit="10 kL/Day"
      tableData={telemetryState === 'restored' ? RESTORED_ETP_LINKS : []}
      tableColumns={[
        { key: 'source', label: 'Inlet Stream' },
        { key: 'target', label: 'Treatment Stage' },
        { key: 'value', label: 'Volume (kL)', align: 'right' },
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
                ? 'ETP FLOW METER OFFLINE: Modbus TCP gateway unreachable (Annual NABL calibration in progress)'
                : telemetryState === 'reconnecting'
                ? 'CALIBRATING FLOW SENSORS: Polling Krohne electromagnetic flow meters...'
                : 'ETP FLOW TELEMETRY ONLINE: 45 kL/Day mass balance streams active'}
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

        <SankeyDiagram
          title="Effluent Treatment Plant (ETP) Liquid Waste Balance"
          subtitle="Flow meters undergoing annual NABL calibration"
          width={700}
          height={320}
          unit=" kL"
          nodes={telemetryState === 'restored' ? RESTORED_ETP_NODES : []}
          links={telemetryState === 'restored' ? RESTORED_ETP_LINKS : []}
        />
      </div>
    </EnterpriseChartStoryShell>
  );
};

// 4. Missing Telemetry & Empty State
export const MissingTelemetryAndEmpty: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <SankeyDiagramMissingTelemetryInteractiveStory />
    </ToastProvider>
  ),
};

// 5. High Density Multi-Shift Complex Routing
export const HighDensityMultiShift: Story = {
  args: {
    title: 'Chakan PL-04 Multi-Stage Part Routing Flow',
    subtitle: 'Detailed 14-node flow through Blanking, Forming, Piercing, Welding, Paint, and QA',
    width: 860,
    height: 480,
    unit: ' pcs/shift',
    nodes: ROUTING_NODES,
    links: ROUTING_LINKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-PART-ROUTING"
      title="Chakan PL-04 Multi-Stage Part Routing Flow"
      subtitle="Detailed 11-node routing through Blanking, Forming, Piercing, Welding, Paint, and QA"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Shift Inbound Blanks', value: '2,000 pcs', sub: 'Lines 1 & 2 Feeding', tone: 'success' },
        { label: 'Final Pack Output', value: '2,000 pcs', sub: 'E-Coat (1.3k) + Powder (700)', tone: 'success' },
        { label: 'Weld Cell A Load', value: '1,150 pcs', sub: 'ABB Robot Cell', tone: 'success' },
        { label: 'Process Bottleneck', value: 'None', sub: 'Line Balance Efficiency 96%', tone: 'success' },
      ]}
      uclLimit="2,500 pcs/shift (Conveyor Ceiling)"
      lclLimit="1,200 pcs/shift (Minimum Run)"
      tableData={ROUTING_LINKS}
      tableColumns={[
        { key: 'source', label: 'Upstream Workcenter' },
        { key: 'target', label: 'Downstream Operation' },
        { key: 'value', label: 'Transfer Rate (pcs/shift)', align: 'right' },
      ]}
    >
      <SankeyDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 6. Accessible Patterns & Keyboard Flow Inspection
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'Hazardous Waste Stream Manifest (Tons / Year)',
    subtitle: 'Pattern-filled accessible ribbons with keyboard node focus and tabular fallback',
    width: 780,
    height: 420,
    patternFills: true,
    unit: ' Tons',
    nodes: WASTE_NODES,
    links: WASTE_LINKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-HAZWASTE-SANKEY"
      title="Hazardous Waste Stream Manifest (Tons / Year)"
      subtitle="Accessible pattern-filled flows with comprehensive high-density data table"
      shift="Annual Environmental Audit (MPCB Form 4)"
      defaultView="table"
      kpis={[
        { label: 'Total Hazardous Waste', value: '120 Tons/Yr', sub: '100% Manifest Tracked', tone: 'success' },
        { label: 'Re-Refined Oil', value: '45 Tons (37.5%)', sub: 'Circular Economy Stream', tone: 'success' },
        { label: 'Paint ETP Sludge', value: '50 Tons (41.7%)', sub: 'Authorized Co-Processing', tone: 'warning' },
        { label: 'Bio-Remediated', value: '25 Tons (20.8%)', sub: 'Zero Landfill Impact', tone: 'success' },
      ]}
      uclLimit="150 Tons/Yr (Consent Limit MPCB)"
      lclLimit="0 Tons/Yr"
      tableData={WASTE_LINKS}
      tableColumns={[
        { key: 'source', label: 'Waste Stream Origin' },
        { key: 'target', label: 'Authorized Disposal / Recovery' },
        { key: 'value', label: 'Volume (Tons/Yr)', align: 'right' },
      ]}
    >
      <SankeyDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    title: 'Shift A Scrap Flow',
    subtitle: 'Input -> Output',
    width: 380,
    height: 220,
    unit: ' T',
    nodes: COMPACT_NODES,
    links: COMPACT_LINKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SCRAP-MINI"
      title="Shift A Scrap Flow"
      subtitle="Input -> Output"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Raw Coil Feed', value: '100 Tons', sub: 'Shift A Input', tone: 'neutral' },
        { label: 'Good Parts Yield', value: '88 Tons (88%)', sub: 'Target 85%', tone: 'success' },
        { label: 'Scrap Generated', value: '12 Tons (12%)', sub: 'Offcut Stream', tone: 'warning' },
        { label: 'Material Efficiency', value: '88.0%', sub: 'Within Norm', tone: 'success' },
      ]}
      uclLimit="15 Tons (Scrap Cap)"
      lclLimit="5 Tons"
      tableData={COMPACT_LINKS}
      tableColumns={[
        { key: 'source', label: 'Input' },
        { key: 'target', label: 'Output' },
        { key: 'value', label: 'Mass (Tons)', align: 'right' },
      ]}
    >
      <SankeyDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};
