import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  AreaChart,
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

const meta: Meta<typeof AreaChart> = {
  title: 'Data Visualization/AreaChart',
  component: AreaChart,
  parameters: {
    docs: {
      description: {
        component:
          'AreaChart displays quantitative change over continuous or ordered intervals with accumulated magnitude, stacked proportions, control limits, and multi-channel textures for manufacturing operations at Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['single', 'stacked', 'normalized', 'diverging', 'stream'],
    },
    curve: {
      control: 'select',
      options: ['monotone', 'linear', 'step-after'],
    },
    density: {
      control: 'select',
      options: ['compact', 'standard', 'expanded'],
    },
    showLegend: {
      control: 'boolean',
      description: 'Toggles visibility of the interactive series color & pattern filter legend',
    },
    showDataTable: {
      control: 'boolean',
      description: 'Renders an accessible non-visual tabular summary disclosure (<details>) directly below chart for WCAG 1.1.1 compliance',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AreaChart>;

const DEFAULT_DATA = [
  { time: '06:00', powerKVA: 180 },
  { time: '07:00', powerKVA: 240 },
  { time: '08:00', powerKVA: 380 },
  { time: '09:00', powerKVA: 410 },
  { time: '10:00', powerKVA: 425 },
  { time: '11:00', powerKVA: 390 },
  { time: '12:00', powerKVA: 340 },
  { time: '13:00', powerKVA: 220 },
  { time: '14:00', powerKVA: 395 },
  { time: '15:00', powerKVA: 430 },
  { time: '16:00', powerKVA: 440 },
  { time: '17:00', powerKVA: 405 },
  { time: '18:00', powerKVA: 375 },
  { time: '19:00', powerKVA: 260 },
  { time: '20:00', powerKVA: 210 },
  { time: '21:00', powerKVA: 190 },
  { time: '22:00', powerKVA: 160 },
];

const STACKED_DATA = [
  { hour: '06:00', pressShop: 45, cncBay: 38, weldingCell: 30 },
  { hour: '08:00', pressShop: 85, cncBay: 78, weldingCell: 65 },
  { hour: '10:00', pressShop: 120, cncBay: 110, weldingCell: 95 },
  { hour: '12:00', pressShop: 95, cncBay: 88, weldingCell: 75 },
  { hour: '14:00', pressShop: 135, cncBay: 125, weldingCell: 110 },
  { hour: '16:00', pressShop: 140, cncBay: 130, weldingCell: 118 },
  { hour: '18:00', pressShop: 115, cncBay: 105, weldingCell: 90 },
  { hour: '20:00', pressShop: 75, cncBay: 68, weldingCell: 60 },
  { hour: '22:00', pressShop: 50, cncBay: 45, weldingCell: 40 },
];

const THRESHOLD_DATA = [
  { cycle: 'C-01', tonnage: 742 },
  { cycle: 'C-02', tonnage: 748 },
  { cycle: 'C-03', tonnage: 755 },
  { cycle: 'C-04', tonnage: 768 },
  { cycle: 'C-05', tonnage: 775 },
  { cycle: 'C-06', tonnage: 785 },
  { cycle: 'C-07', tonnage: 812 },
  { cycle: 'C-08', tonnage: 790 },
  { cycle: 'C-09', tonnage: 752 },
  { cycle: 'C-10', tonnage: 746 },
  { cycle: 'C-11', tonnage: 735 },
  { cycle: 'C-12', tonnage: 698 },
  { cycle: 'C-13', tonnage: 730 },
  { cycle: 'C-14', tonnage: 750 },
];

const HIGH_DENSITY_DATA = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? '00' : '30';
  const timeStr = `${String(h).padStart(2, '0')}:${m}`;
  let base = 250;
  if (h >= 6 && h < 14) base = 480 + Math.sin(i / 3) * 70;
  else if (h >= 14 && h < 22) base = 520 + Math.cos(i / 4) * 90;
  else base = 180 + Math.sin(i) * 30;
  return { timestamp: timeStr, kwh: Math.round(base) };
});

const ACCESSIBLE_DATA = [
  { shift: 'Mon Shift A', castIron: 140, aluminumSheet: 85, highTensile: 45 },
  { shift: 'Mon Shift B', castIron: 165, aluminumSheet: 92, highTensile: 50 },
  { shift: 'Tue Shift A', castIron: 130, aluminumSheet: 78, highTensile: 40 },
  { shift: 'Tue Shift B', castIron: 180, aluminumSheet: 110, highTensile: 65 },
  { shift: 'Wed Shift A', castIron: 125, aluminumSheet: 70, highTensile: 38 },
  { shift: 'Wed Shift B', castIron: 155, aluminumSheet: 95, highTensile: 52 },
];

const COMPACT_DATA = [
  { min: 'T-50', ppm: 28 },
  { min: 'T-40', ppm: 32 },
  { min: 'T-30', ppm: 36 },
  { min: 'T-20', ppm: 44 },
  { min: 'T-10', ppm: 42 },
  { min: 'T-00', ppm: 38 },
];

// 1. Default Baseline Story
export const Default: Story = {
  args: {
    title: 'Chakan PL-04: Gross Energy Consumption (kVA)',
    subtitle: 'Main 33kV Substation Telemetry — 06:00 to 22:00 IST (Shift A & Shift B)',
    width: '100%',
    height: 320,
    xKey: 'time',
    yKey: 'powerKVA',
    xUnit: 'IST',
    yUnit: ' kVA',
    locale: 'en-IN',
    curve: 'monotone',
    variant: 'single',
    showGridY: true,
    enableCrosshair: true,
    referenceLines: [{ y: 450, label: 'Contract Demand Cap (450 kVA)', color: '#b91c1c' }],
    data: DEFAULT_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SUB-33KV"
      title="Gross Energy Consumption (kVA)"
      subtitle="Main 33kV Substation Telemetry — 06:00 to 22:00 IST (Shift A & Shift B)"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Current Output', value: '425 kVA', sub: 'Nominal (Shift A)', tone: 'success' },
        { label: 'Peak Reading', value: '440 kVA', sub: 'Max at 16:00 IST', tone: 'warning' },
        { label: 'Shift Average', value: '382 kVA', sub: 'Within Budget', tone: 'success' },
        { label: 'UCL Limit', value: '450 kVA', sub: 'Contract Demand Cap', tone: 'critical' },
      ]}
      uclLimit="450 kVA (Contract Demand Cap)"
      lclLimit="120 kVA (Base Standby)"
      tableData={DEFAULT_DATA}
      tableColumns={[
        { key: 'time', label: 'Timestamp (IST)' },
        { key: 'powerKVA', label: 'Power Load (kVA)', align: 'right' },
      ]}
    >
      <AreaChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Stacked Multi-Series Shop Floor Allocation
export const StackedOrGrouped: Story = {
  args: {
    title: 'Cumulative Production Throughput by Shop Floor Bay',
    subtitle: 'Finished Transaxle Units per Hour — Press Shop, CNC Line, Welding Cell',
    width: '100%',
    height: 340,
    xKey: 'hour',
    variant: 'stacked',
    curve: 'monotone',
    showLegend: true,
    yUnit: ' units',
    enablePatterns: true,
    series: [
      { key: 'pressShop', name: 'Press Shop (800T Line)', color: '#2563eb', pattern: 'pat-diagonal' },
      { key: 'cncBay', name: 'CNC Machining Bay 02', color: '#15803D', pattern: 'pat-dots' },
      { key: 'weldingCell', name: 'Robotic Weld Cell 04', color: '#b45309', pattern: 'pat-cross' },
    ],
    data: STACKED_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-PRESS-BAY"
      title="Cumulative Production Throughput by Shop Floor Bay"
      subtitle="Finished Transaxle Units per Hour — Press Shop, CNC Line, Welding Cell"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Press Shop (800T)', value: '960 Units', sub: 'Nominal Pace', tone: 'success' },
        { label: 'CNC Bay 02', value: '879 Units', sub: 'Makino Line', tone: 'success' },
        { label: 'Welding Cell 04', value: '781 Units', sub: 'ABB Robot Cell', tone: 'success' },
        { label: 'Run-Rate Output', value: '388 U/hr', sub: 'Target 380 U/hr', tone: 'success' },
      ]}
      uclLimit="450 Units/hr (Max Line Cap)"
      lclLimit="150 Units/hr (Minimum Quota)"
      tableData={STACKED_DATA}
      tableColumns={[
        { key: 'hour', label: 'Shift Hour (IST)' },
        { key: 'pressShop', label: 'Press Shop (Units)', align: 'right' },
        { key: 'cncBay', label: 'CNC Bay (Units)', align: 'right' },
        { key: 'weldingCell', label: 'Welding Cell (Units)', align: 'right' },
      ]}
    >
      <AreaChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Threshold and Control Limits
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'Hydraulic Press #3: Tonnage Pressure Envelope (T)',
    subtitle: 'Upper Control Limit (UCL) & Lower Control Limit (LCL) Continuous Monitor',
    width: '100%',
    height: 340,
    xKey: 'cycle',
    yKey: 'tonnage',
    variant: 'single',
    curve: 'linear',
    xScaleType: 'point',
    showPoints: true,
    baseline: 650,
    yUnit: ' T',
    thresholdBands: [
      { y1: 720, y2: 780, label: 'Nominal Operating Window (720–780 T)', color: 'rgba(22, 163, 74, 0.12)' },
    ],
    referenceLines: [
      { y: 810, label: 'UCL (810 T) — Die Overload Trip', color: '#b91c1c', position: 'end' },
      { y: 750, label: 'Target Pressure (750 T)', color: '#2563eb', position: 'center' },
      { y: 700, label: 'LCL (700 T) — Incomplete Form Alarm', color: '#b45309', position: 'start' },
    ],
    data: THRESHOLD_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-HYD-PRESS-03"
      title="Hydraulic Press #3: Tonnage Pressure Envelope (T)"
      subtitle="Continuous Upper and Lower Control Limit Stamping Monitor"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Peak Stroke Tonnage', value: '812 T', sub: 'Breach at Cycle C-07', tone: 'critical' },
        { label: 'Mean Press Force', value: '751.5 T', sub: 'Target 750 T', tone: 'success' },
        { label: 'LCL Floor Alarm', value: '698 T', sub: 'Cycle C-12 Trip', tone: 'warning' },
        { label: 'Process CpK', value: '1.42', sub: 'Six Sigma Standard', tone: 'success' },
      ]}
      uclLimit="810 T (Die Overload Trip)"
      lclLimit="700 T (Incomplete Form Floor)"
      tableData={THRESHOLD_DATA}
      tableColumns={[
        { key: 'cycle', label: 'Stroke Cycle' },
        { key: 'tonnage', label: 'Tonnage (T)', align: 'right' },
      ]}
    >
      <AreaChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 4. Missing Telemetry and Empty Recovery Interactive Story
const RESTORED_TELEMETRY_DATA = [
  { time: '06:00', tempC: 48.2 },
  { time: '07:00', tempC: 56.5 },
  { time: '08:00', tempC: 64.1 },
  { time: '09:00', tempC: 67.8 },
  { time: '10:00', tempC: 69.2 },
  { time: '11:00', tempC: 68.4 },
  { time: '12:00', tempC: 66.0 },
  { time: '13:00', tempC: 63.5 },
  { time: '14:00', tempC: 68.7 },
  { time: '15:00', tempC: 71.4 },
  { time: '16:00', tempC: 74.2 },
  { time: '17:00', tempC: 70.1 },
  { time: '18:00', tempC: 68.0 },
];

const MissingTelemetryInteractiveStory: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('Modbus Gateway Reconnecting', 'Negotiating RS-485 baud rate (115200 bps) with CNC-SPINDLE-03...');

    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('Telemetry Restored', 'Synchronized 13 packets from PL-04 Line 3 Spindle Sensor.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('Telemetry Bus Dropout', 'Simulated RS-485 bus interruption on Node #4.');
  };

  const kpis: KPIItem[] = telemetryState === 'restored'
    ? [
        { label: 'Bearing Temp', value: '68.4 °C', sub: 'Nominal Operating Temp', tone: 'success' },
        { label: 'Max Shift Peak', value: '74.2 °C', sub: 'Peak at 16:00 IST', tone: 'warning' },
        { label: 'Warning Limit', value: '75.0 °C', sub: 'Threshold Warning', tone: 'warning' },
        { label: 'Trip Limit (UCL)', value: '85.0 °C', sub: 'Auto-Shutdown Threshold', tone: 'critical' },
      ]
    : [
        { label: 'Bearing Temp', value: '-- °C', sub: 'Sensor Node Unreachable', tone: 'critical' },
        { label: 'Max Shift Peak', value: '-- °C', sub: 'No telemetry stream', tone: 'neutral' },
        { label: 'Warning Limit', value: '75.0 °C', sub: 'Threshold Warning', tone: 'warning' },
        { label: 'Trip Limit (UCL)', value: '85.0 °C', sub: 'Auto-Shutdown Threshold', tone: 'critical' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-CNC-SPINDLE-03"
      title="Main Spindle Bearing Temperature (°C)"
      subtitle="Condition monitoring thermocouple stream (RS-485 Modbus RTU)"
      shift="Shift A & B (06:00 – 22:00 IST)"
      kpis={kpis}
      uclLimit="85.0 °C (Critical Trip Limit)"
      lclLimit="35.0 °C (Cold Baseline)"
      tableData={telemetryState === 'restored' ? RESTORED_TELEMETRY_DATA : []}
      tableColumns={[
        { key: 'time', label: 'Timestamp (IST)' },
        { key: 'tempC', label: 'Bearing Temp (°C)', align: 'right' },
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
                ? 'BUS DROPOUT: Node #4 Unreachable (Modbus Timeout at 14:28:10 IST)'
                : telemetryState === 'reconnecting'
                ? 'POLLING GATEWAY: Re-negotiating RS-485 bus sync...'
                : 'TELEMETRY ONLINE: Modbus RTU 115.2 kbps stream healthy'}
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

        {/* Chart View */}
        <AreaChart
          title="Line 3 Spindle Bearing Thermal Profile"
          subtitle="Real-time Modbus thermocouple array"
          width="100%"
          height={280}
          xKey="time"
          yKey="tempC"
          yUnit=" °C"
          curve="monotone"
          loading={telemetryState === 'reconnecting'}
          emptyMessage="Telemetry bus timeout: Sensor Node #4 (Modbus RTU over RS-485) unreachable since 14:28:10 IST."
          referenceLines={[
            { y: 75, label: 'Warning (75°C)', color: '#b45309' },
            { y: 85, label: 'Trip UCL (85°C)', color: '#b91c1c' },
          ]}
          data={telemetryState === 'restored' ? RESTORED_TELEMETRY_DATA : []}
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

// 5. High Density Multi-Shift Telemetry
export const HighDensityMultiShift: Story = {
  args: {
    title: '24-Hour Continuous Plant Power Telemetry (3 Shifts)',
    subtitle: 'Shift A (06:00-14:00), Shift B (14:00-22:00), Shift C Night (22:00-06:00)',
    width: '100%',
    height: 340,
    xKey: 'timestamp',
    yKey: 'kwh',
    yUnit: ' kWh',
    curve: 'monotone',
    density: 'compact',
    showPoints: false,
    referenceLines: [
      { y: 600, label: 'Peak Tariff Threshold (600 kWh)', color: '#e11d48' },
    ],
    data: HIGH_DENSITY_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SUB-33KV"
      title="24-Hour Continuous Plant Power Telemetry (3 Shifts)"
      subtitle="Shift A (06:00-14:00), Shift B (14:00-22:00), Shift C Night (22:00-06:00)"
      shift="All Shifts (24-Hour Monitored)"
      kpis={[
        { label: '24h Peak Power', value: '610 kWh', sub: 'Peak Tariff at 17:30', tone: 'critical' },
        { label: 'Shift A Total', value: '3,720 kWh', sub: 'Nominal Day Load', tone: 'success' },
        { label: 'Shift B Total', value: '4,180 kWh', sub: 'Evening Heavy Draw', tone: 'warning' },
        { label: 'Shift C Total', value: '1,840 kWh', sub: 'Base Night Load', tone: 'success' },
      ]}
      uclLimit="600 kWh (Peak Tariff Threshold)"
      lclLimit="150 kWh (Off-Peak Base)"
      tableData={HIGH_DENSITY_DATA}
      tableColumns={[
        { key: 'timestamp', label: 'Time (IST)' },
        { key: 'kwh', label: 'Power Draw (kWh)', align: 'right' },
      ]}
    >
      <AreaChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 6. Accessible Patterns and Table Story
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'Scrap Generation by Component Category (Shift A & B)',
    subtitle: 'High-contrast hatch patterns with accessible roving focus and modal table data',
    width: '100%',
    height: 320,
    xKey: 'shift',
    variant: 'stacked',
    showLegend: true,
    enablePatterns: true,
    patternPresets: ['pat-diagonal', 'pat-cross', 'pat-dots'],
    yUnit: ' kg',
    series: [
      { key: 'castIron', name: 'Cast Iron Turnings', color: '#1e40af', pattern: 'pat-diagonal' },
      { key: 'aluminumSheet', name: 'Aluminum 6061 Trimmings', color: '#047857', pattern: 'pat-dots' },
      { key: 'highTensile', name: 'High-Tensile Stamping Offcuts', color: '#b45309', pattern: 'pat-cross' },
    ],
    data: ACCESSIBLE_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SCRAP-MGT"
      title="Scrap Generation by Component Category (Shift A & B)"
      subtitle="Accessible high-contrast patterns and telemetric data table"
      shift="Shift A & B (06:00 – 22:00 IST)"
      defaultView="table"
      kpis={[
        { label: 'Cast Iron Total', value: '905 kg', sub: 'Foundry Reclaimed', tone: 'success' },
        { label: 'Aluminum 6061', value: '508 kg', sub: 'Billet Remelt', tone: 'success' },
        { label: 'High-Tensile', value: '290 kg', sub: 'Under Budget', tone: 'success' },
        { label: 'Net Scrap Cost', value: '₹ 1.84 L', sub: '0.42% of Throughput', tone: 'success' },
      ]}
      uclLimit="1,200 kg (Shift Scrap Limit)"
      lclLimit="200 kg (Baseline Minimum)"
      tableData={ACCESSIBLE_DATA}
      tableColumns={[
        { key: 'shift', label: 'Shift Window' },
        { key: 'castIron', label: 'Cast Iron (kg)', align: 'right' },
        { key: 'aluminumSheet', label: 'Aluminum 6061 (kg)', align: 'right' },
        { key: 'highTensile', label: 'High-Tensile (kg)', align: 'right' },
      ]}
    >
      <AreaChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    width: '100%',
    height: 160,
    density: 'compact',
    xKey: 'min',
    yKey: 'ppm',
    yUnit: ' ppm',
    curve: 'monotone',
    showGridX: false,
    showGridY: true,
    referenceLines: [{ y: 45, label: 'CPCB Cap (45)', color: '#b91c1c', position: 'end' }],
    data: COMPACT_DATA,
  },
  render: (args) => (
    <div style={{ maxWidth: '1140px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Dashboard Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
            Plant PL-04 · Paint & Finishing Shop Telemetry
          </div>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
            Live Environmental & Operational Stream
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant="success" size="sm" hasDot>
            Modbus Polling Active
          </Badge>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Updated 14:30:00 IST</span>
        </div>
      </div>

      {/* 3-Column Compact Widget Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Widget 1: Primary Target (VOC Emissions) */}
        <Card variant="elevated" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <CardHeader style={{ padding: '14px 16px 8px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb' }}>CELL-PAINT-02</span>
                <CardTitle style={{ fontSize: '1rem', fontWeight: 700, margin: '2px 0 0 0' }}>VOC Concentration</CardTitle>
                <CardDescription style={{ fontSize: '0.75rem', color: '#64748b' }}>Real-time photo-ionization sensor</CardDescription>
              </div>
              <Badge variant="success" size="sm">Nominal</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>38 ppm</span>
              <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 600 }}>↓ 6 ppm vs 1-hr peak</span>
            </div>
          </CardHeader>
          <CardContent style={{ padding: '0 12px 8px 12px' }}>
            <AreaChart {...args} />
          </CardContent>
          <CardFooter style={{ padding: '8px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Wet Scrubber: <strong style={{ color: '#15803D' }}>99.2%</strong></span>
            <span>Statutory Cap: <strong style={{ color: '#b91c1c' }}>45 ppm</strong></span>
          </CardFooter>
        </Card>

        {/* Widget 2: Companion Airflow Widget */}
        <Card variant="outline" style={{ backgroundColor: '#ffffff', borderRadius: '8px' }}>
          <CardHeader style={{ padding: '14px 16px 8px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#047857' }}>BLOWER-EXHAUST-01</span>
                <CardTitle style={{ fontSize: '1rem', fontWeight: 700, margin: '2px 0 0 0' }}>Booth Exhaust Airflow</CardTitle>
                <CardDescription style={{ fontSize: '0.75rem', color: '#64748b' }}>Differential pressure velocity</CardDescription>
              </div>
              <Badge variant="success" size="sm">Optimal</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>1,465 CFM</span>
              <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 600 }}>Target: 1,450 CFM</span>
            </div>
          </CardHeader>
          <CardContent style={{ padding: '0 12px 8px 12px' }}>
            <AreaChart
              width="100%"
              height={160}
              density="compact"
              xKey="min"
              yKey="cfm"
              yUnit=" CFM"
              curve="monotone"
              series={[{ key: 'cfm', name: 'Exhaust Airflow', color: '#047857' }]}
              referenceLines={[{ y: 1350, label: 'Min Floor (1350)', color: '#b45309', position: 'start' }]}
              data={[
                { min: 'T-50', cfm: 1420 },
                { min: 'T-40', cfm: 1410 },
                { min: 'T-30', cfm: 1395 },
                { min: 'T-20', cfm: 1450 },
                { min: 'T-10', cfm: 1480 },
                { min: 'T-00', cfm: 1465 },
              ]}
            />
          </CardContent>
          <CardFooter style={{ padding: '8px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Fan VFD: <strong style={{ color: '#0f172a' }}>48.5 Hz</strong></span>
            <span>Filter ΔP: <strong style={{ color: '#15803D' }}>120 Pa</strong></span>
          </CardFooter>
        </Card>

        {/* Widget 3: Companion Curing Chamber Widget */}
        <Card variant="outline" style={{ backgroundColor: '#ffffff', borderRadius: '8px' }}>
          <CardHeader style={{ padding: '14px 16px 8px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#b45309' }}>OVEN-ZONE-03</span>
                <CardTitle style={{ fontSize: '1rem', fontWeight: 700, margin: '2px 0 0 0' }}>Bake Curing Temp</CardTitle>
                <CardDescription style={{ fontSize: '0.75rem', color: '#64748b' }}>Zone 3 IR thermal profile</CardDescription>
              </div>
              <Badge variant="warning" size="sm">High Curing</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>176 °C</span>
              <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>Spec: 175 ± 5 °C</span>
            </div>
          </CardHeader>
          <CardContent style={{ padding: '0 12px 8px 12px' }}>
            <AreaChart
              width="100%"
              height={160}
              density="compact"
              xKey="min"
              yKey="tempC"
              yUnit=" °C"
              curve="monotone"
              baseline={150}
              series={[{ key: 'tempC', name: 'Curing Temp', color: '#b45309' }]}
              referenceLines={[
                { y: 180, label: 'Upper Spec (180)', color: '#b91c1c', position: 'end' },
                { y: 170, label: 'Lower Spec (170)', color: '#2563eb', position: 'start' },
              ]}
              data={[
                { min: 'T-50', tempC: 168 },
                { min: 'T-40', tempC: 172 },
                { min: 'T-30', tempC: 175 },
                { min: 'T-20', tempC: 174 },
                { min: 'T-10', tempC: 178 },
                { min: 'T-00', tempC: 176 },
              ]}
            />
          </CardContent>
          <CardFooter style={{ padding: '8px 16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Burner Mod: <strong style={{ color: '#0f172a' }}>64%</strong></span>
            <span>Conveyor Speed: <strong style={{ color: '#15803D' }}>2.4 m/min</strong></span>
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
    title: 'Paint Shop Curing Oven Temperature (Accessible Alternative Mirror)',
    data: [
      { min: 'T-50', tempC: 168 },
      { min: 'T-40', tempC: 172 },
      { min: 'T-30', tempC: 175 },
      { min: 'T-20', tempC: 174 },
      { min: 'T-10', tempC: 178 },
      { min: 'T-00', tempC: 176 },
    ],
    xKey: 'min',
    yKey: 'tempC',
    yUnit: ' °C',
    showDataTable: true,
    width: '100%',
    height: 320,
  },
};
