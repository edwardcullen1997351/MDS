import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PieChart, Button, ToastProvider, useToast } from '@ds/react';
import { EnterpriseChartStoryShell, KPIItem } from './components/EnterpriseChartStoryShell';

const meta: Meta<typeof PieChart> = {
  title: 'Data Visualization/PieChart',
  component: PieChart,
  parameters: {
    docs: {
      description: {
        component:
          'PieChart & DonutChart display proportional part-to-whole allocations, energy consumption shares, scrap category splits, and defect distributions with multi-channel patterns for Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['pie', 'donut'],
    },
    density: {
      control: 'select',
      options: ['compact', 'standard', 'expanded'],
    },
    enablePatterns: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PieChart>;

const DEFAULT_DATA = [
  { bay: 'Press Shop (800T & 1200T)', powerKVA: 780 },
  { bay: 'CNC Machining Bays', powerKVA: 420 },
  { bay: 'Robotic Welding Lines', powerKVA: 290 },
  { bay: 'E-Coat Paint Shop', powerKVA: 210 },
  { bay: 'Utilities & Compressors', powerKVA: 140 },
];

const ALLOY_DATA = [
  { alloy: 'CRCA Mild Steel Sheet (IS 513)', tonnage: 1650 },
  { alloy: 'High-Tensile Steel (DP 600)', tonnage: 920 },
  { alloy: 'Aluminum Alloy 6061-T6', tonnage: 540 },
  { alloy: 'Forging Steel (EN8 / EN19)', tonnage: 340 },
];

const THRESHOLD_DATA = [
  { cause: 'Die Wrinkling & Splits', lossINR: 8.5 },
  { cause: 'Trimming Burr / Flash', lossINR: 4.2 },
  { cause: 'Weld Seam Porosity', lossINR: 2.8 },
  { cause: 'Surface Scratches & Pits', lossINR: 1.6 },
  { cause: 'Dimensional Drift', lossINR: 0.9 },
];

const HIGH_DENSITY_DATA = [
  { expense: 'Raw Material Procurement', amountCr: 24.2 },
  { expense: 'Electrical & Gas Utilities', amountCr: 8.4 },
  { expense: 'Tooling & Die Maintenance', amountCr: 5.8 },
  { expense: 'Direct Labor & Overtime', amountCr: 4.6 },
  { expense: 'Freight & Logistics Fleet', amountCr: 3.2 },
  { expense: 'Consumables & Lubricants', amountCr: 1.5 },
  { expense: 'Environmental ETP Compliance', amountCr: 0.8 },
];

const ACCESSIBLE_DATA = [
  { shift: 'Shift A (06:00 - 14:00 IST)', units: 1450 },
  { shift: 'Shift B (14:00 - 22:00 IST)', units: 1380 },
  { shift: 'Shift C (22:00 - 06:00 IST)', units: 920 },
];

const COMPACT_DATA = [
  { type: 'Unplanned BD', hrs: 1.2 },
  { type: 'Die Changeover', hrs: 0.8 },
  { type: 'Minor Stoppages', hrs: 0.5 },
  { type: 'Speed Loss', hrs: 0.4 },
];

// 1. Default Donut Baseline Story
export const Default: Story = {
  args: {
    title: 'PL-04 Electrical Power Consumption Share by Bay (%)',
    subtitle: 'Main Substation 33kV Load Allocation — Total 1,840 kVA',
    width: 480,
    height: 360,
    variant: 'donut',
    categoryKey: 'bay',
    valueKey: 'powerKVA',
    unit: ' kVA',
    centerLabel: 'Total kVA',
    showCenterTotal: true,
    showLegend: true,
    showLabels: true,
    data: DEFAULT_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SUB-33KV"
      title="PL-04 Electrical Power Consumption Share by Bay (%)"
      subtitle="Main Substation 33kV Load Allocation — Total 1,840 kVA"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Total Connected Load', value: '1,840 kVA', sub: 'Main 33kV Substation', tone: 'success' },
        { label: 'Press Shop Load', value: '780 kVA (42.4%)', sub: '800T & 1200T Presses', tone: 'warning' },
        { label: 'CNC Bay Share', value: '420 kVA (22.8%)', sub: 'Milling Centers', tone: 'success' },
        { label: 'Power Factor (cos φ)', value: '0.992', sub: 'APFC Bank Active', tone: 'success' },
      ]}
      uclLimit="2,000 kVA (Contract Demand Limit)"
      lclLimit="500 kVA (Base Standby)"
      tableData={DEFAULT_DATA}
      tableColumns={[
        { key: 'bay', label: 'Shop Floor Bay / Division' },
        { key: 'powerKVA', label: 'Power Draw (kVA)', align: 'right' },
      ]}
    >
      <PieChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Solid Pie Variant
export const Variants: Story = {
  args: {
    title: 'Raw Material Consumption Share by Alloy (Tons)',
    subtitle: 'Monthly Coil & Billet Requisition — 3,450 MT Total',
    width: 480,
    height: 360,
    variant: 'pie',
    categoryKey: 'alloy',
    valueKey: 'tonnage',
    unit: ' MT',
    showLegend: true,
    showLabels: true,
    data: ALLOY_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-RAW-ALLOY"
      title="Raw Material Consumption Share by Alloy (Tons)"
      subtitle="Monthly Coil & Billet Requisition — 3,450 MT Total"
      shift="Monthly Requisition Allocation"
      kpis={[
        { label: 'Total Steel Consumed', value: '3,450 MT', sub: '100% Sourced from India', tone: 'success' },
        { label: 'CRCA Mild Steel', value: '1,650 MT (47.8%)', sub: 'Stamping Body Panels', tone: 'success' },
        { label: 'DP600 High Tensile', value: '920 MT (26.7%)', sub: 'Chassis Crossmembers', tone: 'success' },
        { label: 'Aluminum 6061', value: '540 MT (15.7%)', sub: 'EV Battery Enclosures', tone: 'neutral' },
      ]}
      uclLimit="4,000 MT/Mo (Max Yard Storage)"
      lclLimit="1,500 MT/Mo (Minimum Run)"
      tableData={ALLOY_DATA}
      tableColumns={[
        { key: 'alloy', label: 'Alloy Grade Specification' },
        { key: 'tonnage', label: 'Consumption (MT)', align: 'right' },
      ]}
    >
      <PieChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Threshold and Defect Pareto Proportions
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'Scrap & Defect Cause Allocation (INR ₹ in Lakhs)',
    subtitle: 'Top scrap causes exceeding 75% total loss threshold',
    width: 480,
    height: 360,
    variant: 'donut',
    categoryKey: 'cause',
    valueKey: 'lossINR',
    unit: ' ₹L',
    centerLabel: 'Scrap Loss',
    data: THRESHOLD_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SCRAP-PARETO"
      title="Scrap & Defect Cause Allocation (INR ₹ in Lakhs)"
      subtitle="Top scrap causes exceeding 75% total loss threshold"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Total Scrap Loss', value: '₹ 18.0 L', sub: 'Monthly Rejection Cost', tone: 'critical' },
        { label: 'Top Scrap Driver', value: 'Die Wrinkles (₹8.5L)', sub: '47.2% of Total Loss', tone: 'critical' },
        { label: 'Trimming Burr', value: '₹ 4.2 L (23.3%)', sub: 'Tool Resharpen Due', tone: 'warning' },
        { label: 'Kaizen Target', value: '-25% Reduction', sub: 'Target ₹13.5L Next Month', tone: 'neutral' },
      ]}
      uclLimit="₹ 20.0 L (Scrap Financial Redline)"
      lclLimit="₹ 5.0 L (World Class Floor)"
      tableData={THRESHOLD_DATA}
      tableColumns={[
        { key: 'cause', label: 'Defect Root Cause' },
        { key: 'lossINR', label: 'Loss Value (₹ Lakhs)', align: 'right' },
      ]}
    >
      <PieChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

const RESTORED_SCRAP_DATA = [
  { category: 'Off-cut Trimmings', weight: 420 },
  { category: 'Burr & Edge Shavings', weight: 180 },
  { category: 'Dimensional Rejects', weight: 95 },
  { category: 'Setup Blanking Scrap', weight: 65 },
];

const PieChartMissingTelemetryInteractiveStory: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('Smart Scale Gateway Reconnecting', 'Establishing Modbus RTU link with Avery Weigh-Tronix loadcell hub...');

    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('Weigh Scale Telemetry Restored', 'Synchronized 4 scrap stream weight allocations for Line 7.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('Loadcell Hub Offline', 'Simulated serial communication loss on digital weigh scale.');
  };

  const kpis: KPIItem[] = telemetryState === 'restored'
    ? [
        { label: 'Weigh Scale Link', value: 'ONLINE (Modbus)', sub: 'Loadcell Transducer Live', tone: 'success' },
        { label: 'Total Shift Scrap', value: '760 kg', sub: 'Within 800 kg Allowance', tone: 'success' },
        { label: 'Top Scrap Stream', value: 'Off-cut (55.3%)', sub: 'Recyclable Prime Steel', tone: 'warning' },
        { label: 'Scale Calibration', value: 'Zeroed ±0.1kg', sub: 'ISO 9001 Verified', tone: 'success' },
      ]
    : [
        { label: 'Weigh Scale Link', value: 'DISCONNECTED', sub: 'Loadcell Hub Offline', tone: 'critical' },
        { label: 'Recorded Scrap', value: '0 kg', sub: 'No telemetry stream', tone: 'neutral' },
        { label: 'Commissioning', value: 'Stage 4', sub: 'Trial Hot Stamping Next', tone: 'neutral' },
        { label: 'Scale Calibrator', value: 'Zeroed', sub: 'NABL Certified Loadcell', tone: 'neutral' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-LINE7-SCRAP"
      title="Line 7 Scrap Category Breakdown"
      subtitle="Real-time scrap weight distribution and loadcell telemetry"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={kpis}
      uclLimit="800 kg (Shift Allowance)"
      lclLimit="0 kg"
      tableData={telemetryState === 'restored' ? RESTORED_SCRAP_DATA : []}
      tableColumns={[
        { key: 'category', label: 'Scrap Category' },
        { key: 'weight', label: 'Weight (kg)', align: 'right' },
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
                ? 'LOADCELL GATEWAY OFFLINE: Line 7 Digital Scale RS-485 Timeout'
                : telemetryState === 'reconnecting'
                ? 'CONNECTING TO SCALE: Negotiating Modbus ASCII protocol...'
                : 'SCALE TELEMETRY ONLINE: High-precision loadcell stream active'}
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

        <PieChart
          title="Line 7 Scrap Weight Allocation"
          subtitle="Real-time loadcell category breakdown"
          width={440}
          height={320}
          categoryKey="category"
          valueKey="weight"
          unit=" kg"
          loading={telemetryState === 'reconnecting'}
          emptyMessage="No part-to-whole allocation records logged for Line 7 (Loadcell Offline)."
          data={telemetryState === 'restored' ? RESTORED_SCRAP_DATA : []}
        />
      </div>
    </EnterpriseChartStoryShell>
  );
};

// 4. Missing Telemetry & Empty State
export const MissingTelemetryAndEmpty: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <PieChartMissingTelemetryInteractiveStory />
    </ToastProvider>
  ),
};

// 5. High Density Multi-Shift / High Slice Count
export const HighDensityMultiShift: Story = {
  args: {
    title: 'Plant Operating Budget Expense Allocation (FY 26-27)',
    subtitle: 'Annual maintenance and operations expense pool (₹ 48.5 Cr)',
    width: 520,
    height: 380,
    variant: 'donut',
    categoryKey: 'expense',
    valueKey: 'amountCr',
    unit: ' ₹Cr',
    centerLabel: 'Annual OpEx',
    data: HIGH_DENSITY_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-OPEX-BUDGET"
      title="Plant Operating Budget Expense Allocation (FY 26-27)"
      subtitle="Annual maintenance and operations expense pool (₹ 48.5 Cr)"
      shift="FY 2026-27 Annual Budget"
      kpis={[
        { label: 'Total OpEx Budget', value: '₹ 48.5 Cr', sub: '100% Allocated', tone: 'success' },
        { label: 'Raw Steel Share', value: '₹ 24.2 Cr (49.9%)', sub: 'Coil Procurement', tone: 'warning' },
        { label: 'Utilities Cost', value: '₹ 8.4 Cr (17.3%)', sub: 'Power & Gas Supply', tone: 'neutral' },
        { label: 'Tooling PM', value: '₹ 5.8 Cr (12.0%)', sub: 'Die Refurbishment', tone: 'success' },
      ]}
      uclLimit="₹ 50.0 Cr (Approved Board Cap)"
      lclLimit="₹ 35.0 Cr (Minimum Base OpEx)"
      tableData={HIGH_DENSITY_DATA}
      tableColumns={[
        { key: 'expense', label: 'Cost Element Classification' },
        { key: 'amountCr', label: 'Allocated Amount (₹ Cr)', align: 'right' },
      ]}
    >
      <PieChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 6. Accessible Patterns and Direct Table Fallback
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'Shift Production Output Contribution Share (%)',
    subtitle: 'High contrast hatch textures for colorblind accessibility and keyboard navigation',
    width: 480,
    height: 360,
    variant: 'donut',
    categoryKey: 'shift',
    valueKey: 'units',
    unit: ' units',
    enablePatterns: true,
    centerLabel: 'Total Output',
    data: ACCESSIBLE_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SHIFT-SHARE"
      title="Shift Production Output Contribution Share (%)"
      subtitle="Accessible high-contrast patterns with high-density data table"
      shift="24-Hour Production Cycle (3 Shifts)"
      defaultView="table"
      kpis={[
        { label: 'Gross Plant Output', value: '3,750 Units', sub: 'Daily Target 3,600 Met', tone: 'success' },
        { label: 'Shift A Leader', value: '1,450 Units (38.7%)', sub: 'Morning Shift', tone: 'success' },
        { label: 'Shift B Run', value: '1,380 Units (36.8%)', sub: 'Evening Shift', tone: 'success' },
        { label: 'Shift C Night', value: '920 Units (24.5%)', sub: 'Automated Line Run', tone: 'neutral' },
      ]}
      uclLimit="4,000 Units (Plant Maximum)"
      lclLimit="2,500 Units (Break-Even Floor)"
      tableData={ACCESSIBLE_DATA}
      tableColumns={[
        { key: 'shift', label: 'Shift Window' },
        { key: 'units', label: 'Finished Units Produced', align: 'right' },
      ]}
    >
      <PieChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    title: 'PL-04 OEE Loss Share',
    subtitle: 'Shift A Live',
    width: 280,
    height: 200,
    variant: 'donut',
    density: 'compact',
    showLegend: false,
    showLabels: false,
    centerLabel: 'Loss',
    categoryKey: 'type',
    valueKey: 'hrs',
    unit: 'h',
    data: COMPACT_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-OEE-LOSS"
      title="PL-04 OEE Loss Share"
      subtitle="Shift A Live"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Total Loss Time', value: '2.9 Hours', sub: 'Out of 8.0 Shift Hours', tone: 'warning' },
        { label: 'Unplanned BD', value: '1.2 Hours (41%)', sub: 'Hydraulic Seal Leak', tone: 'critical' },
        { label: 'SMED Die Swap', value: '0.8 Hours (28%)', sub: 'Within Target', tone: 'success' },
        { label: 'Net Operating Rate', value: '63.8%', sub: 'Target 75.0%', tone: 'warning' },
      ]}
      uclLimit="2.0 Hours (Maximum Allowable Loss)"
      lclLimit="0 Hours"
      tableData={COMPACT_DATA}
      tableColumns={[
        { key: 'type', label: 'Loss Category' },
        { key: 'hrs', label: 'Downtime (Hours)', align: 'right' },
      ]}
    >
      <PieChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};
