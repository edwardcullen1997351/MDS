import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  BarChart,
  Button,
  ToastProvider,
  useToast,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
} from '@ds/react';
import { EnterpriseChartStoryShell, KPIItem } from './components/EnterpriseChartStoryShell';

const meta: Meta<typeof BarChart> = {
  title: 'Data Visualization/BarChart',
  component: BarChart,
  parameters: {
    docs: {
      description: {
        component:
          'BarChart compares quantitative magnitude across discrete manufacturing categories with strict zero baseline, multi-channel accessibility patterns, control limits, and tabular fallbacks for Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['vertical', 'horizontal', 'grouped', 'stacked', 'normalized', 'diverging', 'floating'],
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    showDataTable: {
      control: 'boolean',
      description: 'Renders an accessible non-visual tabular summary disclosure (<details>) directly below chart for WCAG 1.1.1 compliance',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BarChart>;

const DEFAULT_DATA = [
  { line: 'Line 1 (Press 800T)', output: 520 },
  { line: 'Line 2 (Press 1200T)', output: 480 },
  { line: 'Line 3 (Tandem Line)', output: 430 },
  { line: 'Line 4 (Progressive)', output: 610 },
  { line: 'Line 5 (Blanking)', output: 390 },
  { line: 'Line 6 (Sub-Assembly)', output: 560 },
];

const VARIANTS_DATA = [
  { bay: 'Bay 1 (Heavy Press)', availability: 91, performance: 86, quality: 98 },
  { bay: 'Bay 2 (CNC Milling)', availability: 88, performance: 84, quality: 96 },
  { bay: 'Bay 3 (Robotic Weld)', availability: 94, performance: 89, quality: 99 },
  { bay: 'Bay 4 (Heat Treat)', availability: 82, performance: 79, quality: 94 },
  { bay: 'Bay 5 (Final Test)', availability: 96, performance: 92, quality: 99.5 },
];

const STACKED_DATA = [
  { machine: 'Press P-01', preventive: 1.8, corrective: 0.4, spares: 1.2 },
  { machine: 'Press P-02', preventive: 2.4, corrective: 1.1, spares: 1.9 },
  { machine: 'CNC Bay C-01', preventive: 1.2, corrective: 0.2, spares: 0.8 },
  { machine: 'CNC Bay C-02', preventive: 1.5, corrective: 0.6, spares: 1.1 },
  { machine: 'Weld Cell W-01', preventive: 0.9, corrective: 0.1, spares: 0.5 },
  { machine: 'E-Coat Tank #2', preventive: 2.1, corrective: 0.8, spares: 0.7 },
];

const THRESHOLD_DATA = [
  { batch: 'Batch B2601', ppm: 18 },
  { batch: 'Batch B2602', ppm: 24 },
  { batch: 'Batch B2603', ppm: 31 },
  { batch: 'Batch B2604', ppm: 68 },
  { batch: 'Batch B2605', ppm: 45 },
  { batch: 'Batch B2606', ppm: 82 },
  { batch: 'Batch B2607', ppm: 22 },
  { batch: 'Batch B2608', ppm: 19 },
];

const HIGH_DENSITY_DATA = [
  { hour: '06h', strokes: 780 },
  { hour: '07h', strokes: 920 },
  { hour: '08h', strokes: 950 },
  { hour: '09h', strokes: 940 },
  { hour: '10h', strokes: 890 },
  { hour: '11h', strokes: 930 },
  { hour: '12h', strokes: 650 },
  { hour: '13h', strokes: 910 },
  { hour: '14h', strokes: 840 },
  { hour: '15h', strokes: 960 },
  { hour: '16h', strokes: 980 },
  { hour: '17h', strokes: 950 },
  { hour: '18h', strokes: 920 },
  { hour: '19h', strokes: 910 },
  { hour: '20h', strokes: 700 },
  { hour: '21h', strokes: 940 },
  { hour: '22h', strokes: 820 },
  { hour: '23h', strokes: 870 },
  { hour: '00h', strokes: 890 },
  { hour: '01h', strokes: 910 },
  { hour: '02h', strokes: 860 },
  { hour: '03h', strokes: 880 },
  { hour: '04h', strokes: 840 },
  { hour: '05h', strokes: 810 },
];

const ACCESSIBLE_DATA = [
  { month: 'Apr 2026', crca: 14.2, al6061: 6.8, brass: 2.1 },
  { month: 'May 2026', crca: 16.5, al6061: 7.4, brass: 2.5 },
  { month: 'Jun 2026', crca: 13.9, al6061: 5.9, brass: 1.8 },
  { month: 'Jul 2026', crca: 15.1, al6061: 8.2, brass: 2.9 },
  { month: 'Aug 2026', crca: 17.8, al6061: 9.1, brass: 3.2 },
  { month: 'Sep 2026', crca: 14.6, al6061: 7.0, brass: 2.4 },
];

const COMPACT_DATA = [
  { defect: 'Burr / Flash', count: 14 },
  { defect: 'Dent / Scratch', count: 8 },
  { defect: 'Weld Porosity', count: 5 },
  { defect: 'Dim. Deviation', count: 3 },
];

// 1. Default Baseline Story
export const Default: Story = {
  args: {
    title: 'Daily Line Output vs Target (Units)',
    caption: 'Chakan PL-04 Stamping & Assembly Bays — Shift A & B',
    width: '100%',
    height: 340,
    categoryKey: 'line',
    valueKey: 'output',
    unit: ' units',
    variant: 'vertical',
    showGrid: true,
    showLegend: false,
    referenceLines: [
      { value: 450, label: 'Target Quota (450 units)', tone: 'brand', strokeStyle: 'dashed' },
    ],
    data: DEFAULT_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-STAMP-LINE"
      title="Daily Line Output vs Target (Units)"
      subtitle="Chakan PL-04 Stamping & Assembly Bays — Shift A & B"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Total Plant Output', value: '2,990 Units', sub: '+8.7% over Quota', tone: 'success' },
        { label: 'Top Producing Line', value: 'Line 4 (610)', sub: 'Progressive Blanking', tone: 'success' },
        { label: 'Plant Target Cap', value: '450 U/Line', sub: 'Standard Shift Target', tone: 'neutral' },
        { label: 'Underperforming', value: 'Line 5 (390)', sub: 'Die Jamming Delay', tone: 'warning' },
      ]}
      uclLimit="650 Units (Max Press Velocity)"
      lclLimit="450 Units (Quota Baseline)"
      tableData={DEFAULT_DATA}
      tableColumns={[
        { key: 'line', label: 'Production Line / Workcenter' },
        { key: 'output', label: 'Output Volume (Units)', align: 'right' },
      ]}
    >
      <BarChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Grouped Multi-Shift Comparison
export const Variants: Story = {
  args: {
    title: 'OEE Availability vs Performance vs Quality by Bay (%)',
    caption: 'Chakan PL-04 Overall Equipment Effectiveness Breakdown',
    width: '100%',
    height: 360,
    categoryKey: 'bay',
    variant: 'grouped',
    unit: '%',
    series: [
      { key: 'availability', label: 'Availability (%)', color: '#2563eb' },
      { key: 'performance', label: 'Performance (%)', color: '#15803D' },
      { key: 'quality', label: 'Quality Rate (%)', color: '#b45309' },
    ],
    referenceLines: [
      { value: 85, label: 'World Class OEE (85%)', tone: 'success', strokeStyle: 'dashed' },
    ],
    data: VARIANTS_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-OEE-MONITOR"
      title="OEE Availability vs Performance vs Quality by Bay (%)"
      subtitle="Chakan PL-04 Overall Equipment Effectiveness Breakdown"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Overall Plant OEE', value: '87.4%', sub: 'World Class Target Met', tone: 'success' },
        { label: 'Average Quality', value: '97.3%', sub: 'Six Sigma Standard', tone: 'success' },
        { label: 'Lowest Availability', value: '82.0%', sub: 'Bay 4 Heat Treat', tone: 'warning' },
        { label: 'Top Performer', value: 'Bay 5 (96.0%)', sub: 'Final Test Cell', tone: 'success' },
      ]}
      uclLimit="100.0% (Theoretical Maximum)"
      lclLimit="85.0% (World Class OEE Minimum)"
      tableData={VARIANTS_DATA}
      tableColumns={[
        { key: 'bay', label: 'Shop Floor Bay' },
        { key: 'availability', label: 'Availability (%)', align: 'right' },
        { key: 'performance', label: 'Performance (%)', align: 'right' },
        { key: 'quality', label: 'Quality Rate (%)', align: 'right' },
      ]}
    >
      <BarChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Stacked & Normalized Proportions
export const StackedOrGrouped: Story = {
  args: {
    title: 'Monthly Maintenance Cost Breakdown by Machine (₹ in Lakhs)',
    caption: 'Preventive, Corrective, and Tooling Spares Expenses',
    width: '100%',
    height: 360,
    categoryKey: 'machine',
    variant: 'stacked',
    unit: ' ₹L',
    series: [
      { key: 'preventive', label: 'Preventive PM (₹L)', color: '#2563eb' },
      { key: 'corrective', label: 'Corrective BD (₹L)', color: '#b91c1c' },
      { key: 'spares', label: 'Spares & Tooling (₹L)', color: '#b45309' },
    ],
    data: STACKED_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-MAINT-EXP"
      title="Monthly Maintenance Cost Breakdown by Machine (₹ in Lakhs)"
      subtitle="Preventive, Corrective, and Tooling Spares Expenses"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Total Maintenance Spend', value: '₹ 19.8 L', sub: 'Within FY Allocation', tone: 'success' },
        { label: 'Highest Cost Center', value: 'Press P-02', sub: '₹ 5.4 L (Schuler 1200T)', tone: 'warning' },
        { label: 'Preventive Ratio', value: '50.5%', sub: 'Proactive Maintenance', tone: 'success' },
        { label: 'Corrective Loss', value: '₹ 3.2 L', sub: '16.1% Total Spend', tone: 'neutral' },
      ]}
      uclLimit="₹ 6.0 L / Machine (Budget Cap)"
      lclLimit="₹ 1.0 L / Machine (Minimum PM Spend)"
      tableData={STACKED_DATA}
      tableColumns={[
        { key: 'machine', label: 'Equipment Asset' },
        { key: 'preventive', label: 'Preventive PM (₹L)', align: 'right' },
        { key: 'corrective', label: 'Corrective BD (₹L)', align: 'right' },
        { key: 'spares', label: 'Spares / Tooling (₹L)', align: 'right' },
      ]}
    >
      <BarChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 4. Threshold and Control Limits
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'Crankshaft Bearing Runout Rejection Rate (PPM)',
    caption: 'Tolerance Limit: 50 PPM Max Allowance Before Quarantine',
    width: '100%',
    height: 340,
    categoryKey: 'batch',
    valueKey: 'ppm',
    unit: ' PPM',
    variant: 'vertical',
    referenceLines: [
      { value: 50, label: 'Upper Spec Limit (50 PPM)', tone: 'danger', strokeStyle: 'solid' },
      { value: 20, label: 'Target Benchmark (20 PPM)', tone: 'success', strokeStyle: 'dashed' },
    ],
    thresholdBands: [
      { min: 50, max: 120, label: 'Quarantine Red Zone (>50 PPM)', tone: 'critical' },
    ],
    data: THRESHOLD_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-CRANK-QA"
      title="Crankshaft Bearing Runout Rejection Rate (PPM)"
      subtitle="Tolerance Limit: 50 PPM Max Allowance Before Quarantine"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Worst Batch Breach', value: '82 PPM', sub: 'Batch B2606 Quarantined', tone: 'critical' },
        { label: 'Average Rejection', value: '38.6 PPM', sub: 'Spec Cap 50 PPM', tone: 'warning' },
        { label: 'Best Batch Rate', value: '18 PPM', sub: 'Batch B2601 (Target Met)', tone: 'success' },
        { label: 'Batches In Quarantine', value: '2 of 8', sub: 'B2604 & B2606', tone: 'critical' },
      ]}
      uclLimit="50 PPM (Upper Specification Limit)"
      lclLimit="0 PPM (Zero Defect Floor)"
      tableData={THRESHOLD_DATA}
      tableColumns={[
        { key: 'batch', label: 'Production Lot / Batch' },
        { key: 'ppm', label: 'Defect PPM', align: 'right' },
      ]}
    >
      <BarChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 5. Missing Telemetry and Empty Recovery Interactive Story
const RESTORED_YIELD_DATA = [
  { cycle: 'CYC-101', yield: 48 },
  { cycle: 'CYC-102', yield: 52 },
  { cycle: 'CYC-103', yield: 50 },
  { cycle: 'CYC-104', yield: 54 },
  { cycle: 'CYC-105', yield: 49 },
  { cycle: 'CYC-106', yield: 53 },
];

const MissingTelemetryInteractiveStory: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('PLC Gateway Reconnecting', 'Negotiating Profinet / Modbus TCP session on 192.168.7.20...');

    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('PLC Telemetry Restored', 'Synchronized 6 cycle yield telemetry records for Robotic Cell Line 7.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('PLC Connection Dropped', 'Simulated Ethernet gateway timeout on Line 7 PLC.');
  };

  const kpis: KPIItem[] = telemetryState === 'restored'
    ? [
        { label: 'PLC Communication', value: 'ONLINE (10 Hz)', sub: 'Profinet Link Active', tone: 'success' },
        { label: 'Cycle Average Yield', value: '51.0 Units', sub: 'Target 50 U / Cycle', tone: 'success' },
        { label: 'Current Cycle Yield', value: '53 Units', sub: 'Nominal Stamping Rate', tone: 'success' },
        { label: 'Active Sensors', value: '12 / 12 Active', sub: 'All I/O Nodes Healthy', tone: 'success' },
      ]
    : [
        { label: 'PLC Communication', value: 'DISCONNECTED', sub: 'Modbus Gateway Off', tone: 'critical' },
        { label: 'Commissioning Stage', value: 'Phase 3 (Dry Run)', sub: 'FAT Signoff Done', tone: 'neutral' },
        { label: 'Estimated First Yield', value: '18:00 IST', sub: 'Shift B Ramp', tone: 'neutral' },
        { label: 'Sensor Link', value: '0 / 12 Active', sub: 'I/O Bus Re-scan', tone: 'warning' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-ROBO-LINE7"
      title="Chakan PL-04 Line 7 Robotic Cell Cycle Yield"
      subtitle="Commissioning cycle yield telemetry and edge I/O monitor"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={kpis}
      uclLimit="60 Units / Cycle (Robotic Max)"
      lclLimit="40 Units / Cycle (Minimum Threshold)"
      tableData={telemetryState === 'restored' ? RESTORED_YIELD_DATA : []}
      tableColumns={[
        { key: 'cycle', label: 'Cycle ID' },
        { key: 'yield', label: 'Yield Volume (Units)', align: 'right' },
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
                ? 'PLC GATEWAY OFFLINE: Line 7 Industrial Ethernet Timeout'
                : telemetryState === 'reconnecting'
                ? 'CONNECTING TO PLC: Handshake with Profinet Node 192.168.7.20...'
                : 'PLC ONLINE: Profinet RT stream active at 100 Mbps'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            {telemetryState === 'offline' ? (
              <Button size="sm" variant="primary" onClick={handleReconnect}>
                Simulate PLC Reconnect
              </Button>
            ) : (
              <Button size="sm" variant="secondary" onClick={handleDisconnect} disabled={telemetryState === 'reconnecting'}>
                Simulate Bus Dropout
              </Button>
            )}
          </div>
        </div>

        <BarChart
          title="Line 7 Robotic Stamping Yield Profile"
          caption="Real-time cycle volume output"
          width="100%"
          height={280}
          categoryKey="cycle"
          valueKey="yield"
          unit=" units"
          variant="vertical"
          loading={telemetryState === 'reconnecting'}
          emptyText="No production yield records received for Line 7 (PLC Gateway Disconnected)."
          referenceLines={[
            { value: 50, label: 'Target Quota (50)', tone: 'brand', strokeStyle: 'dashed' },
          ]}
          data={telemetryState === 'restored' ? RESTORED_YIELD_DATA : []}
        />
      </div>
    </EnterpriseChartStoryShell>
  );
};

export const MissingTelemetryAndEmpty: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <MissingTelemetryInteractiveStory />
    </ToastProvider>
  ),
};

// 6. High Density Multi-Shift
export const HighDensityMultiShift: Story = {
  args: {
    title: 'Hourly Stamping Strokes Across 3 Shifts (24 Hours)',
    caption: 'Shift A (06-14), Shift B (14-22), Shift C (22-06) — PL-04 Main Transfer Press',
    width: '100%',
    height: 360,
    categoryKey: 'hour',
    valueKey: 'strokes',
    unit: ' strokes',
    variant: 'vertical',
    referenceLines: [
      { value: 900, label: 'Nominal Stroke Rate (900/hr)', tone: 'brand', strokeStyle: 'dashed' },
    ],
    data: HIGH_DENSITY_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-TRANSFER-PRESS"
      title="Hourly Stamping Strokes Across 3 Shifts (24 Hours)"
      subtitle="Shift A (06-14), Shift B (14-22), Shift C (22-06) — PL-04 Main Transfer Press"
      shift="24 Hours (All Shifts)"
      kpis={[
        { label: '24h Total Strokes', value: '21,100', sub: 'Target 21,600 (97.7%)', tone: 'success' },
        { label: 'Peak Hourly Rate', value: '980 strokes', sub: 'At 16:00 IST (Shift B)', tone: 'success' },
        { label: 'Lunch Changeover Dip', value: '650 strokes', sub: '12:00 IST Planned PM', tone: 'warning' },
        { label: 'Die Swap Downtime', value: '700 strokes', sub: '20:00 IST SMED Swap', tone: 'warning' },
      ]}
      uclLimit="1,000 Strokes/hr (Press Mechanical Ceiling)"
      lclLimit="700 Strokes/hr (Minimum Shift Baseline)"
      tableData={HIGH_DENSITY_DATA}
      tableColumns={[
        { key: 'hour', label: 'Hour (IST)' },
        { key: 'strokes', label: 'Stamping Strokes', align: 'right' },
      ]}
    >
      <BarChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Accessible Patterns & Table View
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'Scrap Metal Weight by Alloy Category (Tons / Month)',
    caption: 'Accessible pattern fills with keyboard table modal toggle for WCAG 2.2 AA',
    width: '100%',
    height: 340,
    categoryKey: 'month',
    variant: 'horizontal',
    unit: ' Tons',
    enablePatterns: true,
    series: [
      { key: 'crca', label: 'CRCA Mild Steel Sheet', color: '#1d4ed8', pattern: 'pat-diagonal' },
      { key: 'al6061', label: 'Aluminum Alloy 6061', color: '#047857', pattern: 'pat-dots' },
      { key: 'brass', label: 'High-Tensile Brass Shavings', color: '#b45309', pattern: 'pat-cross' },
    ],
    data: ACCESSIBLE_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SCRAP-RECLAIM"
      title="Scrap Metal Weight by Alloy Category (Tons / Month)"
      subtitle="Accessible pattern fills with high-density tabular toggle for WCAG 2.2 AA"
      shift="H1 FY 2026-27 (Apr – Sep)"
      defaultView="table"
      kpis={[
        { label: 'Total CRCA Scrap', value: '92.1 Tons', sub: 'Avg 15.3 T/Mo', tone: 'success' },
        { label: 'Total Al 6061 Scrap', value: '44.4 Tons', sub: 'Billet Return Stream', tone: 'success' },
        { label: 'Total Brass Shavings', value: '14.9 Tons', sub: 'High Value Reclaim', tone: 'success' },
        { label: 'Gross Scrap Recovery', value: '₹ 84.5 L', sub: 'Foundry Remelt Credit', tone: 'success' },
      ]}
      uclLimit="20.0 Tons/Mo (Scrap Ceiling Cap)"
      lclLimit="5.0 Tons/Mo (Minimum Baseline)"
      tableData={ACCESSIBLE_DATA}
      tableColumns={[
        { key: 'month', label: 'Month' },
        { key: 'crca', label: 'CRCA Steel (Tons)', align: 'right' },
        { key: 'al6061', label: 'Aluminum 6061 (Tons)', align: 'right' },
        { key: 'brass', label: 'High-Tensile Brass (Tons)', align: 'right' },
      ]}
    >
      <BarChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 8. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    width: '100%',
    height: 160,
    categoryKey: 'defect',
    valueKey: 'count',
    unit: ' pcs',
    variant: 'horizontal',
    showGrid: true,
    showLegend: false,
    data: COMPACT_DATA,
  },
  render: (args) => (
    <div style={{ maxWidth: '1140px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
            Plant PL-04 · Shift Quality & Workcenter Rejects
          </div>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
            Live Production Quality Diagnostics
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant="success" size="sm" hasDot>
            Quality Stream Active
          </Badge>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Updated 14:30:00 IST</span>
        </div>
      </div>

      {/* 3-Column Compact Widget Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Widget 1: Visual Inspection Defects */}
        <Card variant="elevated" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <CardHeader style={{ padding: '14px 16px 8px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb' }}>CELL-INSPECT-01</span>
                <CardTitle style={{ fontSize: '1rem', fontWeight: 700, margin: '2px 0 0 0' }}>Shift A Defect Tally</CardTitle>
                <CardDescription style={{ fontSize: '0.75rem', color: '#64748b' }}>Optical camera inspection</CardDescription>
              </div>
              <Badge variant="success" size="sm">Yield 99.0%</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>30 pcs</span>
              <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 600 }}>0.98% Defect Rate</span>
            </div>
          </CardHeader>
          <CardContent style={{ padding: '0 12px 8px 12px' }}>
            <BarChart {...args} />
          </CardContent>
          <CardFooter style={{ padding: '8px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Top Issue: <strong style={{ color: '#b45309' }}>Burr / Flash (14)</strong></span>
            <span>Threshold: <strong style={{ color: '#b91c1c' }}>40 pcs Cap</strong></span>
          </CardFooter>
        </Card>

        {/* Widget 2: Robotic Welding Faults */}
        <Card variant="outline" style={{ backgroundColor: '#ffffff', borderRadius: '8px' }}>
          <CardHeader style={{ padding: '14px 16px 8px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#047857' }}>WELD-ROBOT-04</span>
                <CardTitle style={{ fontSize: '1rem', fontWeight: 700, margin: '2px 0 0 0' }}>Weld Seam Anomaly</CardTitle>
                <CardDescription style={{ fontSize: '0.75rem', color: '#64748b' }}>Ultrasonic seam integrity</CardDescription>
              </div>
              <Badge variant="success" size="sm">Nominal</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>12 seams</span>
              <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 600 }}>99.6% Clean Weld</span>
            </div>
          </CardHeader>
          <CardContent style={{ padding: '0 12px 8px 12px' }}>
            <BarChart
              width="100%"
              height={160}
              categoryKey="defect"
              valueKey="count"
              unit=" seams"
              variant="horizontal"
              showGrid={true}
              showLegend={false}
              series={[{ key: 'count', label: 'Weld Faults', color: '#047857' }]}
              data={[
                { defect: 'Spatter Accum.', count: 6 },
                { defect: 'Underfill', count: 3 },
                { defect: 'Burn Through', count: 2 },
                { defect: 'Misalignment', count: 1 },
              ]}
            />
          </CardContent>
          <CardFooter style={{ padding: '8px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Torch Tip Wear: <strong style={{ color: '#0f172a' }}>22%</strong></span>
            <span>Gas Flow: <strong style={{ color: '#15803D' }}>18 L/min</strong></span>
          </CardFooter>
        </Card>

        {/* Widget 3: Final Packaging Rejects */}
        <Card variant="outline" style={{ backgroundColor: '#ffffff', borderRadius: '8px' }}>
          <CardHeader style={{ padding: '14px 16px 8px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309' }}>PACK-LINE-02</span>
                <CardTitle style={{ fontSize: '1rem', fontWeight: 700, margin: '2px 0 0 0' }}>Packaging Line Rejects</CardTitle>
                <CardDescription style={{ fontSize: '0.75rem', color: '#64748b' }}>Weight & barcode verification</CardDescription>
              </div>
              <Badge variant="warning" size="sm">Barcode Alert</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>19 pkgs</span>
              <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>0.41% Total Rejects</span>
            </div>
          </CardHeader>
          <CardContent style={{ padding: '0 12px 8px 12px' }}>
            <BarChart
              width="100%"
              height={160}
              categoryKey="defect"
              valueKey="count"
              unit=" pkgs"
              variant="horizontal"
              showGrid={true}
              showLegend={false}
              series={[{ key: 'count', label: 'Rejects', color: '#b45309' }]}
              data={[
                { defect: 'Barcode Unread', count: 9 },
                { defect: 'Weight Low', count: 5 },
                { defect: 'Seal Breach', count: 3 },
                { defect: 'Label Shift', count: 2 },
              ]}
            />
          </CardContent>
          <CardFooter style={{ padding: '8px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Scanner Optic: <strong style={{ color: '#b45309' }}>Clean Needed</strong></span>
            <span>Checkweigher: <strong style={{ color: '#15803D' }}>Calibrated</strong></span>
          </CardFooter>
        </Card>
      </div>
    </div>
  ),
};

/**
 * Dedicated accessibility story showcasing the built-in tabular summary mirror disclosure
 * satisfying WCAG 2.2 AA non-text contrast and non-visual data consumption.
 */
export const AccessibleDataTableMirror: Story = {
  args: {
    title: 'Press Shop Line Production (Accessible Alternative Mirror)',
    data: DEFAULT_DATA,
    categoryKey: 'line',
    valueKey: 'output',
    unit: ' parts',
    showDataTable: true,
    width: '100%',
    height: 320,
  },
};
