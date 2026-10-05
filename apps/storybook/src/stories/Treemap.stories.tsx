import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Treemap, Button, ToastProvider, useToast } from '@ds/react';
import { EnterpriseChartStoryShell, KPIItem } from './components/EnterpriseChartStoryShell';

const meta: Meta<typeof Treemap> = {
  title: 'Data Visualization/Treemap',
  component: Treemap,
  parameters: {
    docs: {
      description: {
        component:
          'Treemap displays multi-level hierarchical area proportions, plant equipment footprint, scrap value allocation, and inventory stockpile valuations for Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    algorithm: {
      control: 'select',
      options: ['squarified', 'slice-and-dice'],
    },
    enableDrilldown: {
      control: 'boolean',
    },
    patternFills: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Treemap>;

const PLANT_INVENTORY_ROOT = {
  label: 'PL-04 Plant Raw Material & Finished Stockpile Valuation',
  children: [
    {
      label: 'Raw Steel Coils (₹14.5 Cr)',
      category: 'Raw Materials',
      children: [
        { label: 'CRCA 1.2mm Coils (Tata Steel)', value: 6.2, category: 'Raw Materials' },
        { label: 'DP600 High Tensile 2.0mm (JSW)', value: 4.8, category: 'Raw Materials' },
        { label: 'Alloy 6061-T6 Aluminum Sheets', value: 2.3, category: 'Raw Materials' },
        { label: 'Stainless 304 Exhaust Strips', value: 1.2, category: 'Raw Materials' },
      ],
    },
    {
      label: 'Work in Progress - WIP (₹8.2 Cr)',
      category: 'WIP',
      children: [
        { label: 'Stamped Body Side Panels', value: 3.4, category: 'WIP' },
        { label: 'Machined Gear Blanks Bay 2', value: 2.6, category: 'WIP' },
        { label: 'Sub-Assembled Differential Carriers', value: 1.5, category: 'WIP' },
        { label: 'Weldment Brackets Awaiting E-Coat', value: 0.7, category: 'WIP' },
      ],
    },
    {
      label: 'Finished Goods Inventory (₹9.8 Cr)',
      category: 'Finished Goods',
      children: [
        { label: 'EV Transaxle Sets for Tata Motors Sanand', value: 4.5, category: 'Finished Goods' },
        { label: 'Chassis Cross-Members for Maruti Manesar', value: 3.2, category: 'Finished Goods' },
        { label: 'Export Rear Axle Housings for EU Client', value: 2.1, category: 'Finished Goods' },
      ],
    },
    {
      label: 'Tooling & Maintenance Spares (₹3.5 Cr)',
      category: 'MRO Spares',
      children: [
        { label: 'Carbide CNC Milling Inserts', value: 1.4, category: 'MRO Spares' },
        { label: 'Stamping Die Punches & Die Springs', value: 1.2, category: 'MRO Spares' },
        { label: 'Hydraulic Seals & Proportional Valves', value: 0.9, category: 'MRO Spares' },
      ],
    },
  ],
};

const AREA_ALLOCATION_ROOT = {
  label: 'PL-04 Facility Footprint (25,000 m²)',
  children: [
    {
      label: 'Primary Manufacturing (14,500 m²)',
      category: 'Production',
      children: [
        { label: 'Heavy Press Shop (Bays 1 & 2)', value: 6500, category: 'Production' },
        { label: 'CNC Machining Bay (Bay 3)', value: 4200, category: 'Production' },
        { label: 'Robotic Welding Line (Bay 4)', value: 3800, category: 'Production' },
      ],
    },
    {
      label: 'Surface Treatment & Paint (4,500 m²)',
      category: 'Paint Shop',
      children: [
        { label: 'Cathodic E-Coat Dip Line', value: 2800, category: 'Paint Shop' },
        { label: 'Powder Coating & Curing Oven', value: 1700, category: 'Paint Shop' },
      ],
    },
    {
      label: 'Warehouse & Logistics (4,000 m²)',
      category: 'Logistics',
      children: [
        { label: 'Raw Coil Heavy Crane Bay', value: 2200, category: 'Logistics' },
        { label: 'Finished Dispatch Dock', value: 1800, category: 'Logistics' },
      ],
    },
    {
      label: 'QA & Metrology Lab (2,000 m²)',
      category: 'Quality QA',
      children: [
        { label: 'CMM Climate Controlled Room', value: 1200, category: 'Quality QA' },
        { label: 'Metallurgy & Tensile Test Lab', value: 800, category: 'Quality QA' },
      ],
    },
  ],
};

const SCRAP_LOSS_ROOT = {
  label: 'Total Scrap Loss (₹ 24.5 Lakhs)',
  children: [
    {
      label: 'Stamping Press Scrap (₹14.2 L)',
      category: 'Stamping',
      children: [
        { label: 'Die Wrinkling Splits (Critical)', value: 7.8, category: 'Stamping' },
        { label: 'Trimming Offcut Loss', value: 4.2, category: 'Stamping' },
        { label: 'Blanking Punch Shear Burrs', value: 2.2, category: 'Stamping' },
      ],
    },
    {
      label: 'CNC Machining Scrap (₹6.5 L)',
      category: 'CNC',
      children: [
        { label: 'Spindle Tool Breakage Damage', value: 3.8, category: 'CNC' },
        { label: 'Bore Diameter Oversize (CMM)', value: 2.7, category: 'CNC' },
      ],
    },
    {
      label: 'Paint & Surface Scrap (₹3.8 L)',
      category: 'Paint',
      children: [
        { label: 'E-Coat Bath Contamination Pinholes', value: 2.4, category: 'Paint' },
        { label: 'Dry Spray Orange Peel Texture', value: 1.4, category: 'Paint' },
      ],
    },
  ],
};

const ENERGY_LOAD_ROOT = {
  label: 'Plant 04 Connected Load (3,200 kVA)',
  children: [
    {
      label: 'Heavy Presses (1,600 kVA)',
      category: 'Presses',
      children: [
        { label: 'Press 01 Main Motor (800 kVA)', value: 800, category: 'Presses' },
        { label: 'Press 02 Main Motor (550 kVA)', value: 550, category: 'Presses' },
        { label: 'Hydraulic Auxiliary Pumps (250 kVA)', value: 250, category: 'Presses' },
      ],
    },
    {
      label: 'Machining & Spindles (900 kVA)',
      category: 'CNC',
      children: [
        { label: 'Makino Bay 1 (350 kVA)', value: 350, category: 'CNC' },
        { label: 'Mazak Bay 2 (320 kVA)', value: 320, category: 'CNC' },
        { label: 'Coolant High-Pressure Pumps (230 kVA)', value: 230, category: 'CNC' },
      ],
    },
    {
      label: 'Welding Robots (450 kVA)',
      category: 'Welding',
      children: [
        { label: 'ABB Robot Cells (280 kVA)', value: 280, category: 'Welding' },
        { label: 'Seam Welding Power Supplies (170 kVA)', value: 170, category: 'Welding' },
      ],
    },
    {
      label: 'Auxiliary Utilities (250 kVA)',
      category: 'Utilities',
      children: [
        { label: 'Screw Air Compressors (160 kVA)', value: 160, category: 'Utilities' },
        { label: 'Chilled Water Plant (90 kVA)', value: 90, category: 'Utilities' },
      ],
    },
  ],
};

const COMPACT_ROOT = {
  label: 'Scrap (250 kg)',
  children: [
    { label: 'Press Shop', value: 140, category: 'Press' },
    { label: 'CNC Bay', value: 65, category: 'CNC' },
    { label: 'Weld Cell', value: 45, category: 'Weld' },
  ],
};

const INVENTORY_FLAT_TABLE = [
  { item: 'CRCA 1.2mm Coils (Tata Steel)', category: 'Raw Materials', valCr: 6.2 },
  { item: 'DP600 High Tensile 2.0mm (JSW)', category: 'Raw Materials', valCr: 4.8 },
  { item: 'EV Transaxle Sets (Tata Motors Sanand)', category: 'Finished Goods', valCr: 4.5 },
  { item: 'Stamped Body Side Panels', category: 'WIP', valCr: 3.4 },
  { item: 'Chassis Cross-Members (Maruti)', category: 'Finished Goods', valCr: 3.2 },
  { item: 'Machined Gear Blanks Bay 2', category: 'WIP', valCr: 2.6 },
  { item: 'Alloy 6061-T6 Aluminum Sheets', category: 'Raw Materials', valCr: 2.3 },
  { item: 'Export Rear Axle Housings', category: 'Finished Goods', valCr: 2.1 },
  { item: 'Differential Carriers', category: 'WIP', valCr: 1.5 },
  { item: 'Carbide CNC Milling Inserts', category: 'MRO Spares', valCr: 1.4 },
];

// 1. Default Squarified Treemap Story (Spacious Enterprise Layout)
export const Default: Story = {
  args: {
    title: 'PL-04 Plant Inventory Valuation by Category (₹ in Crores)',
    subtitle: 'Chakan Plant Raw Materials, WIP, Finished Goods, and Tooling Spares (Total ₹36.0 Cr)',
    width: 920,
    height: 500,
    algorithm: 'squarified',
    enableDrilldown: true,
    unit: ' ₹Cr',
    locale: 'en-IN',
    data: PLANT_INVENTORY_ROOT,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-INVENTORY-TREEMAP"
      title="PL-04 Plant Inventory Valuation by Category (₹ in Crores)"
      subtitle="Chakan Plant Raw Materials, WIP, Finished Goods, and Tooling Spares (Total ₹36.0 Cr)"
      shift="Plant Financial Inventory Audit"
      kpis={[
        { label: 'Total Stockpile Valuation', value: '₹ 36.0 Cr', sub: 'Audited Inventory Pool', tone: 'success' },
        { label: 'Raw Steel Coils', value: '₹ 14.5 Cr (40.3%)', sub: '28-Day Yard Stock', tone: 'success' },
        { label: 'Finished Goods', value: '₹ 9.8 Cr (27.2%)', sub: 'Ready for OEM Dispatch', tone: 'success' },
        { label: 'WIP In-Progress', value: '₹ 8.2 Cr (22.8%)', sub: 'Across 4 Shop Bays', tone: 'neutral' },
      ]}
      uclLimit="₹ 40.0 Cr (Working Capital Ceiling)"
      lclLimit="₹ 20.0 Cr (Safety Buffer Floor)"
      tableData={INVENTORY_FLAT_TABLE}
      tableColumns={[
        { key: 'item', label: 'Inventory Stock Description' },
        { key: 'category', label: 'Echelon Classification' },
        { key: 'valCr', label: 'Valuation (₹ Cr)', align: 'right' },
      ]}
    >
      <Treemap {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Slice-and-Dice Algorithm Variant
export const Variants: Story = {
  args: {
    title: 'Plant Floor Area Allocation by Functional Shop (Sq. Meters)',
    subtitle: 'Chakan PL-04 25,000 m² Facility Layout Distribution',
    width: 920,
    height: 480,
    algorithm: 'slice-and-dice',
    enableDrilldown: true,
    unit: ' m²',
    data: AREA_ALLOCATION_ROOT,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-FACILITY-AREA"
      title="Plant Floor Area Allocation by Functional Shop (Sq. Meters)"
      subtitle="Chakan PL-04 25,000 m² Facility Layout Distribution"
      shift="Plant Engineering & Industrial Layout"
      kpis={[
        { label: 'Total Facility Area', value: '25,000 m²', sub: 'Covered Shop Floor', tone: 'success' },
        { label: 'Manufacturing Bays', value: '14,500 m² (58%)', sub: 'Press, CNC, Welding', tone: 'success' },
        { label: 'Surface & Paint', value: '4,500 m² (18%)', sub: 'E-Coat & Powder Lines', tone: 'neutral' },
        { label: 'Warehouse / Logistics', value: '4,000 m² (16%)', sub: 'Coil Bay & Dispatch', tone: 'success' },
      ]}
      uclLimit="25,000 m² (Total Plant Footprint)"
      lclLimit="0 m²"
      tableData={[
        { zone: 'Heavy Press Shop (Bays 1 & 2)', sqM: 6500, share: '26.0%' },
        { zone: 'CNC Machining Bay (Bay 3)', sqM: 4200, share: '16.8%' },
        { zone: 'Robotic Welding Line (Bay 4)', sqM: 3800, share: '15.2%' },
        { zone: 'Cathodic E-Coat Dip Line', sqM: 2800, share: '11.2%' },
        { zone: 'Raw Coil Heavy Crane Bay', sqM: 2200, share: '8.8%' },
      ]}
      tableColumns={[
        { key: 'zone', label: 'Functional Workcenter Zone' },
        { key: 'sqM', label: 'Floor Space (m²)', align: 'right' },
        { key: 'share', label: 'Facility Share (%)', align: 'right' },
      ]}
    >
      <Treemap {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Threshold and Scrap Financial Loss Focus
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'Monthly Scrap & Rejection Value Breakdown (₹ in Lakhs)',
    subtitle: 'Top financial leakages highlighting Press Die Wrinkling & Tool Breakage',
    width: 920,
    height: 480,
    unit: ' ₹L',
    enableDrilldown: true,
    data: SCRAP_LOSS_ROOT,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SCRAP-VALUE"
      title="Monthly Scrap & Rejection Value Breakdown (₹ in Lakhs)"
      subtitle="Top financial leakages highlighting Press Die Wrinkling & Tool Breakage"
      shift="Monthly Plant Quality Audit"
      kpis={[
        { label: 'Total Scrap Loss', value: '₹ 24.5 L', sub: 'Monthly Rejections', tone: 'critical' },
        { label: 'Stamping Press Scrap', value: '₹ 14.2 L (58%)', sub: 'Die Wrinkling & Splits', tone: 'critical' },
        { label: 'CNC Spindle Damage', value: '₹ 3.8 L', sub: 'Tool Breakage Root Cause', tone: 'warning' },
        { label: 'Paint Contamination', value: '₹ 2.4 L', sub: 'E-Coat Bath Pinholes', tone: 'warning' },
      ]}
      uclLimit="₹ 20.0 L (Scrap Financial Threshold)"
      lclLimit="₹ 5.0 L (Benchmark Target)"
      tableData={[
        { defect: 'Die Wrinkling Splits (Critical)', bay: 'Stamping Press', costL: 7.8 },
        { defect: 'Trimming Offcut Loss', bay: 'Stamping Press', costL: 4.2 },
        { defect: 'Spindle Tool Breakage Damage', bay: 'CNC Machining', costL: 3.8 },
        { defect: 'Bore Diameter Oversize (CMM)', bay: 'CNC Machining', costL: 2.7 },
        { defect: 'E-Coat Bath Pinholes', bay: 'Paint Shop', costL: 2.4 },
        { defect: 'Blanking Punch Shear Burrs', bay: 'Stamping Press', costL: 2.2 },
      ]}
      tableColumns={[
        { key: 'defect', label: 'Scrap Defect Description' },
        { key: 'bay', label: 'Originating Workcenter' },
        { key: 'costL', label: 'Loss Value (₹ Lakhs)', align: 'right' },
      ]}
    >
      <Treemap {...args} />
    </EnterpriseChartStoryShell>
  ),
};

const RESTORED_TOOLING_ROOT = {
  label: 'Line 9 Commissioning Tooling Asset Valuation (₹4.2 Cr)',
  children: [
    {
      label: 'Progressive Stamping Dies (₹3.0 Cr)',
      children: [
        { label: 'Die 901 (Fender Outer Blanking)', value: 1.8 },
        { label: 'Die 902 (Door Inner Panel Draw)', value: 1.2 },
      ],
    },
    {
      label: 'CNC Tooling Cassettes (₹1.2 Cr)',
      children: [
        { label: 'Makino HMC Cassette Set A', value: 0.7 },
        { label: 'Mazak VCN Cassette Set B', value: 0.5 },
      ],
    },
  ],
};

const RESTORED_TOOLING_TABLE = [
  { tool: 'Die 901 (Fender Outer Blanking)', cat: 'Progressive Stamping Dies', valCr: '₹ 1.8 Cr' },
  { tool: 'Die 902 (Door Inner Panel Draw)', cat: 'Progressive Stamping Dies', valCr: '₹ 1.2 Cr' },
  { tool: 'Makino HMC Cassette Set A', cat: 'CNC Tooling Cassettes', valCr: '₹ 0.7 Cr' },
  { tool: 'Mazak VCN Cassette Set B', cat: 'CNC Tooling Cassettes', valCr: '₹ 0.5 Cr' },
];

const TreemapMissingTelemetryInteractiveStory: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('SAP Asset Master Syncing', 'Polling SAP S/4HANA PM module over RFC gateway...');

    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('Tooling Asset Hierarchy Synchronized', 'Restored 4 active tooling hierarchies valued at ₹4.2 Cr.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('SAP Asset Master Offline', 'Simulated ERP connector disconnection on Line 9.');
  };

  const kpis: KPIItem[] = telemetryState === 'restored'
    ? [
        { label: 'Tooling Database', value: 'SYNCED (₹4.2 Cr)', sub: 'SAP S/4HANA Master Live', tone: 'success' },
        { label: 'Registered Tool Sets', value: '4 Major Sets', sub: '2 Stamping + 2 CNC', tone: 'success' },
        { label: 'Physical Storage Rack', value: 'Rack R-09', sub: 'Die Storage Bay Ready', tone: 'success' },
        { label: 'RFID Tagging', value: '100% Synced', sub: '4 / 4 UHF Tags Active', tone: 'success' },
      ]
    : [
        { label: 'Tooling Database', value: 'NO RECORDS / OFFLINE', sub: 'ERP Asset Sync Pending', tone: 'critical' },
        { label: 'Registered Tool Sets', value: '0 Sets', sub: 'Line 9 In Setup', tone: 'neutral' },
        { label: 'Physical Storage Rack', value: 'Rack R-09', sub: 'Die Storage Bay Ready', tone: 'success' },
        { label: 'RFID Tagging', value: 'In-Progress', sub: '12 UHF Tags Allocated', tone: 'warning' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-TOOLING-LINE9"
      title="Line 9 Commissioning Tooling Asset Treemap"
      subtitle="Tooling inventory hierarchy and valuation allocation"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={kpis}
      uclLimit="50 Tool Sets (Bay Cap)"
      lclLimit="0"
      tableData={telemetryState === 'restored' ? RESTORED_TOOLING_TABLE : []}
      tableColumns={[
        { key: 'tool', label: 'Tooling Asset' },
        { key: 'cat', label: 'Hierarchy Category' },
        { key: 'valCr', label: 'Valuation', align: 'right' },
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
                ? 'TOOLING DATABASE OFFLINE: SAP S/4HANA PM connector unreachable (No active tool registry)'
                : telemetryState === 'reconnecting'
                ? 'SAP ASSET SYNC: Synchronizing tool master records over RFC...'
                : 'TOOLING ASSET TELEMETRY ONLINE: ₹4.2 Cr asset tree synchronized'}
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

        <Treemap
          title="Line 9 Commissioning Tooling Asset Treemap"
          subtitle="Tooling inventory hierarchy and valuation allocation"
          width={880}
          height={380}
          unit=" ₹Cr"
          data={telemetryState === 'restored' ? RESTORED_TOOLING_ROOT : []}
        />
      </div>
    </EnterpriseChartStoryShell>
  );
};

// 4. Missing Telemetry & Empty State
export const MissingTelemetryAndEmpty: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <TreemapMissingTelemetryInteractiveStory />
    </ToastProvider>
  ),
};

// 5. High Density Multi-Shift Complex 20-Leaf Treemap
export const HighDensityMultiShift: Story = {
  args: {
    title: 'Comprehensive 20-Category Machine Maintenance Spend (₹ in Lakhs)',
    subtitle: 'Chakan PL-04 Full Maintenance Budget Breakdown with nested sub-components',
    width: 960,
    height: 520,
    algorithm: 'squarified',
    enableDrilldown: true,
    unit: ' ₹L',
    data: PLANT_INVENTORY_ROOT,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-FULL-TREEMAP"
      title="Comprehensive 20-Category Machine Maintenance Spend (₹ in Lakhs)"
      subtitle="Chakan PL-04 Full Maintenance Budget Breakdown with nested sub-components"
      shift="FY 2026-27 Asset Valuation"
      kpis={[
        { label: 'Total Budget Managed', value: '₹ 36.0 Cr', sub: '20 Tracked Leaf Categories', tone: 'success' },
        { label: 'High-Tensile Coils', value: '₹ 4.8 Cr', sub: 'DP600 Steel Stock', tone: 'success' },
        { label: 'Tata EV Sets', value: '₹ 4.5 Cr', sub: 'Finished Sanand Batch', tone: 'success' },
        { label: 'Inventory Turns', value: '11.8x / Year', sub: 'Automotive Benchmark Met', tone: 'success' },
      ]}
      uclLimit="₹ 45.0 Cr (Budget Ceiling)"
      lclLimit="₹ 15.0 Cr (Operational Base)"
      tableData={INVENTORY_FLAT_TABLE}
      tableColumns={[
        { key: 'item', label: 'Sub-Category Nomenclature' },
        { key: 'category', label: 'Echelon Group' },
        { key: 'valCr', label: 'Valuation (₹ Cr)', align: 'right' },
      ]}
    >
      <Treemap {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 6. Accessible Patterns and Interactive Drilldown
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'Plant Electrical Energy Load Allocation by Equipment',
    subtitle: 'High contrast hatch fills with keyboard arrow navigation and drill-down support',
    width: 920,
    height: 480,
    patternFills: true,
    unit: ' kVA',
    enableDrilldown: true,
    data: ENERGY_LOAD_ROOT,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-CONNECTED-LOAD"
      title="Plant Electrical Energy Load Allocation by Equipment"
      subtitle="Accessible pattern-filled treemap with interactive drill-down and full data table"
      shift="Continuous Load Distribution (3,200 kVA Connected)"
      defaultView="table"
      kpis={[
        { label: 'Connected Load', value: '3,200 kVA', sub: 'Main 33kV Substation', tone: 'success' },
        { label: 'Heavy Presses', value: '1,600 kVA (50%)', sub: 'Press 01 & 02 Main Drives', tone: 'warning' },
        { label: 'CNC Spindles', value: '900 kVA (28.1%)', sub: 'Makino & Mazak Bays', tone: 'success' },
        { label: 'Welding Robots', value: '450 kVA (14.1%)', sub: 'ABB Robotic Cells', tone: 'success' },
      ]}
      uclLimit="3,500 kVA (Sanctioned Load Cap)"
      lclLimit="800 kVA (Base Standby)"
      tableData={[
        { equip: 'Press 01 Main Motor (800T)', cat: 'Heavy Presses', loadKVA: 800 },
        { equip: 'Press 02 Main Motor (1200T)', cat: 'Heavy Presses', loadKVA: 550 },
        { equip: 'Makino Bay 1 HMC', cat: 'CNC Spindles', loadKVA: 350 },
        { equip: 'Mazak Bay 2 VCN', cat: 'CNC Spindles', loadKVA: 320 },
        { equip: 'ABB Robot Cells 1 & 2', cat: 'Welding Robots', loadKVA: 280 },
        { equip: 'Hydraulic Aux Pumps', cat: 'Heavy Presses', loadKVA: 250 },
        { equip: 'Coolant High-Pressure Jet', cat: 'CNC Spindles', loadKVA: 230 },
        { equip: 'Seam Welding Supplies', cat: 'Welding Robots', loadKVA: 170 },
        { equip: 'Screw Air Compressors', cat: 'Aux Utilities', loadKVA: 160 },
        { equip: 'Chilled Water Plant', cat: 'Aux Utilities', loadKVA: 90 },
      ]}
      tableColumns={[
        { key: 'equip', label: 'Equipment Drive / Load' },
        { key: 'cat', label: 'Shop Center' },
        { key: 'loadKVA', label: 'Connected Load (kVA)', align: 'right' },
      ]}
    >
      <Treemap {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    title: 'Scrap Share by Cell',
    subtitle: 'Shift A Live',
    width: 380,
    height: 240,
    unit: ' kg',
    enableDrilldown: false,
    data: COMPACT_ROOT,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SCRAP-MINI-TREE"
      title="Scrap Share by Cell"
      subtitle="Shift A Live"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Total Shift Scrap', value: '250 kg', sub: 'Shift A Cumulative', tone: 'neutral' },
        { label: 'Press Shop Share', value: '140 kg (56%)', sub: 'Trimming Offcuts', tone: 'warning' },
        { label: 'CNC Bay Scrap', value: '65 kg (26%)', sub: 'Machining Swarf', tone: 'success' },
        { label: 'Weld Cell Loss', value: '45 kg (18%)', sub: 'Electrode Slag', tone: 'success' },
      ]}
      uclLimit="350 kg (Shift A Scrap Cap)"
      lclLimit="50 kg"
      tableData={[
        { bay: 'Press Shop', kg: 140 },
        { bay: 'CNC Bay', kg: 65 },
        { bay: 'Weld Cell', kg: 45 },
      ]}
      tableColumns={[
        { key: 'bay', label: 'Workcenter' },
        { key: 'kg', label: 'Scrap (kg)', align: 'right' },
      ]}
    >
      <Treemap {...args} />
    </EnterpriseChartStoryShell>
  ),
};
