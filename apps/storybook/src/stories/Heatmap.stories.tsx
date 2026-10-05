import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Heatmap, Button, ToastProvider, useToast } from '@ds/react';
import { EnterpriseChartStoryShell, KPIItem } from './components/EnterpriseChartStoryShell';

const meta: Meta<typeof Heatmap> = {
  title: 'Data Visualization/Heatmap',
  component: Heatmap,
  parameters: {
    docs: {
      description: {
        component:
          'Heatmap visualizes multi-axis intensity matrices, machine failure frequencies, shift downtime patterns, and correlated defect densities across workcenters for Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['matrix', 'clustered', 'calendar', 'correlation'],
    },
    colorScaleType: {
      control: 'select',
      options: ['sequential', 'diverging'],
    },
    density: {
      control: 'select',
      options: ['compact', 'standard', 'expanded'],
    },
    showDataTable: {
      control: 'boolean',
      description: 'Renders an accessible non-visual tabular summary disclosure (<details>) directly below chart for WCAG 1.1.1 compliance',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Heatmap>;

const SHIFTS = ['Shift A (06-14)', 'Shift B (14-22)', 'Shift C (22-06)'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const WORKCENTERS = ['Press 800T', 'Press 1200T', 'CNC Bay 1', 'CNC Bay 2', 'Robo Weld 1', 'Paint E-Coat'];

const DEFAULT_DATA = [
  { workcenter: 'Press 800T', day: 'Mon', downtimeMins: 15 },
  { workcenter: 'Press 800T', day: 'Tue', downtimeMins: 20 },
  { workcenter: 'Press 800T', day: 'Wed', downtimeMins: 45 },
  { workcenter: 'Press 800T', day: 'Thu', downtimeMins: 10 },
  { workcenter: 'Press 800T', day: 'Fri', downtimeMins: 25 },
  { workcenter: 'Press 800T', day: 'Sat', downtimeMins: 85 },
  { workcenter: 'Press 800T', day: 'Sun', downtimeMins: 0 },

  { workcenter: 'Press 1200T', day: 'Mon', downtimeMins: 30 },
  { workcenter: 'Press 1200T', day: 'Tue', downtimeMins: 10 },
  { workcenter: 'Press 1200T', day: 'Wed', downtimeMins: 120 },
  { workcenter: 'Press 1200T', day: 'Thu', downtimeMins: 40 },
  { workcenter: 'Press 1200T', day: 'Fri', downtimeMins: 15 },
  { workcenter: 'Press 1200T', day: 'Sat', downtimeMins: 90 },
  { workcenter: 'Press 1200T', day: 'Sun', downtimeMins: 0 },

  { workcenter: 'CNC Bay 1', day: 'Mon', downtimeMins: 5 },
  { workcenter: 'CNC Bay 1', day: 'Tue', downtimeMins: 8 },
  { workcenter: 'CNC Bay 1', day: 'Wed', downtimeMins: 12 },
  { workcenter: 'CNC Bay 1', day: 'Thu', downtimeMins: 15 },
  { workcenter: 'CNC Bay 1', day: 'Fri', downtimeMins: 6 },
  { workcenter: 'CNC Bay 1', day: 'Sat', downtimeMins: 35 },
  { workcenter: 'CNC Bay 1', day: 'Sun', downtimeMins: 0 },

  { workcenter: 'CNC Bay 2', day: 'Mon', downtimeMins: 10 },
  { workcenter: 'CNC Bay 2', day: 'Tue', downtimeMins: 14 },
  { workcenter: 'CNC Bay 2', day: 'Wed', downtimeMins: 18 },
  { workcenter: 'CNC Bay 2', day: 'Thu', downtimeMins: 22 },
  { workcenter: 'CNC Bay 2', day: 'Fri', downtimeMins: 10 },
  { workcenter: 'CNC Bay 2', day: 'Sat', downtimeMins: 40 },
  { workcenter: 'CNC Bay 2', day: 'Sun', downtimeMins: 0 },

  { workcenter: 'Robo Weld 1', day: 'Mon', downtimeMins: 0 },
  { workcenter: 'Robo Weld 1', day: 'Tue', downtimeMins: 5 },
  { workcenter: 'Robo Weld 1', day: 'Wed', downtimeMins: 8 },
  { workcenter: 'Robo Weld 1', day: 'Thu', downtimeMins: 12 },
  { workcenter: 'Robo Weld 1', day: 'Fri', downtimeMins: 15 },
  { workcenter: 'Robo Weld 1', day: 'Sat', downtimeMins: 60 },
  { workcenter: 'Robo Weld 1', day: 'Sun', downtimeMins: 0 },

  { workcenter: 'Paint E-Coat', day: 'Mon', downtimeMins: 20 },
  { workcenter: 'Paint E-Coat', day: 'Tue', downtimeMins: 25 },
  { workcenter: 'Paint E-Coat', day: 'Wed', downtimeMins: 30 },
  { workcenter: 'Paint E-Coat', day: 'Thu', downtimeMins: 18 },
  { workcenter: 'Paint E-Coat', day: 'Fri', downtimeMins: 22 },
  { workcenter: 'Paint E-Coat', day: 'Sat', downtimeMins: 95 },
  { workcenter: 'Paint E-Coat', day: 'Sun', downtimeMins: 0 },
];

const CORRELATION_DATA = [
  { var1: 'Spindle RPM', var2: 'Spindle RPM', r: 1.0 },
  { var1: 'Spindle RPM', var2: 'Vibration', r: 0.78 },
  { var1: 'Spindle RPM', var2: 'Oil Temp', r: 0.65 },
  { var1: 'Spindle RPM', var2: 'Press Force', r: -0.12 },
  { var1: 'Spindle RPM', var2: 'Scrap Rate', r: 0.42 },

  { var1: 'Vibration', var2: 'Spindle RPM', r: 0.78 },
  { var1: 'Vibration', var2: 'Vibration', r: 1.0 },
  { var1: 'Vibration', var2: 'Oil Temp', r: 0.84 },
  { var1: 'Vibration', var2: 'Press Force', r: 0.05 },
  { var1: 'Vibration', var2: 'Scrap Rate', r: 0.88 },

  { var1: 'Oil Temp', var2: 'Spindle RPM', r: 0.65 },
  { var1: 'Oil Temp', var2: 'Vibration', r: 0.84 },
  { var1: 'Oil Temp', var2: 'Oil Temp', r: 1.0 },
  { var1: 'Oil Temp', var2: 'Press Force', r: 0.18 },
  { var1: 'Oil Temp', var2: 'Scrap Rate', r: 0.76 },

  { var1: 'Press Force', var2: 'Spindle RPM', r: -0.12 },
  { var1: 'Press Force', var2: 'Vibration', r: 0.05 },
  { var1: 'Press Force', var2: 'Oil Temp', r: 0.18 },
  { var1: 'Press Force', var2: 'Press Force', r: 1.0 },
  { var1: 'Press Force', var2: 'Scrap Rate', r: 0.35 },

  { var1: 'Scrap Rate', var2: 'Spindle RPM', r: 0.42 },
  { var1: 'Scrap Rate', var2: 'Vibration', r: 0.88 },
  { var1: 'Scrap Rate', var2: 'Oil Temp', r: 0.76 },
  { var1: 'Scrap Rate', var2: 'Press Force', r: 0.35 },
  { var1: 'Scrap Rate', var2: 'Scrap Rate', r: 1.0 },
];

const THRESHOLD_DATA = [
  { bank: 'Bank A (Primary)', phase: 'Phase R', temp: 68 },
  { bank: 'Bank A (Primary)', phase: 'Phase Y', temp: 72 },
  { bank: 'Bank A (Primary)', phase: 'Phase B', temp: 71 },
  { bank: 'Bank A (Primary)', phase: 'Neutral', temp: 55 },

  { bank: 'Bank B (Secondary)', phase: 'Phase R', temp: 74 },
  { bank: 'Bank B (Secondary)', phase: 'Phase Y', temp: 96 },
  { bank: 'Bank B (Secondary)', phase: 'Phase B', temp: 88 },
  { bank: 'Bank B (Secondary)', phase: 'Neutral', temp: 60 },

  { bank: 'Bank C (Rectifier)', phase: 'Phase R', temp: 79 },
  { bank: 'Bank C (Rectifier)', phase: 'Phase Y', temp: 82 },
  { bank: 'Bank C (Rectifier)', phase: 'Phase B', temp: 94 },
  { bank: 'Bank C (Rectifier)', phase: 'Neutral', temp: 62 },

  { bank: 'Bank D (Inverter)', phase: 'Phase R', temp: 65 },
  { bank: 'Bank D (Inverter)', phase: 'Phase Y', temp: 68 },
  { bank: 'Bank D (Inverter)', phase: 'Phase B', temp: 67 },
  { bank: 'Bank D (Inverter)', phase: 'Neutral', temp: 50 },
];

const HIGH_DENSITY_DATA = DAYS.flatMap((day) =>
  Array.from({ length: 24 }, (_, h) => {
    const hourStr = `${String(h).padStart(2, '0')}h`;
    const isPeak = (h >= 14 && h <= 17) || (h >= 2 && h <= 4);
    const scrap = isPeak ? Math.floor(((h * 7 + day.charCodeAt(0)) % 18) + 12) : Math.floor(((h * 3 + day.charCodeAt(0)) % 6));
    return { day, hour: hourStr, scrap };
  })
);

const ACCESSIBLE_DATA = [
  { defect: 'Flash / Burr', shift: 'Shift A (06-14)', ppm: 32 },
  { defect: 'Flash / Burr', shift: 'Shift B (14-22)', ppm: 48 },
  { defect: 'Flash / Burr', shift: 'Shift C (22-06)', ppm: 72 },

  { defect: 'Dent on Surface', shift: 'Shift A (06-14)', ppm: 14 },
  { defect: 'Dent on Surface', shift: 'Shift B (14-22)', ppm: 22 },
  { defect: 'Dent on Surface', shift: 'Shift C (22-06)', ppm: 35 },

  { defect: 'Weld Blowhole', shift: 'Shift A (06-14)', ppm: 8 },
  { defect: 'Weld Blowhole', shift: 'Shift B (14-22)', ppm: 15 },
  { defect: 'Weld Blowhole', shift: 'Shift C (22-06)', ppm: 28 },

  { defect: 'Thread Damage', shift: 'Shift A (06-14)', ppm: 5 },
  { defect: 'Thread Damage', shift: 'Shift B (14-22)', ppm: 11 },
  { defect: 'Thread Damage', shift: 'Shift C (22-06)', ppm: 19 },
];

const COMPACT_DATA = [
  { bay: 'Bay 1', metric: 'Avail', score: 92 },
  { bay: 'Bay 1', metric: 'Perf', score: 86 },
  { bay: 'Bay 1', metric: 'Qual', score: 98 },
  { bay: 'Bay 2', metric: 'Avail', score: 84 },
  { bay: 'Bay 2', metric: 'Perf', score: 79 },
  { bay: 'Bay 2', metric: 'Qual', score: 95 },
  { bay: 'Bay 3', metric: 'Avail', score: 96 },
  { bay: 'Bay 3', metric: 'Perf', score: 91 },
  { bay: 'Bay 3', metric: 'Qual', score: 99 },
];

// 1. Default Matrix Story
export const Default: Story = {
  args: {
    title: 'Weekly Equipment Downtime Matrix (Minutes Lost)',
    subtitle: 'Chakan PL-04 Workcenter Downtime by Day of Week',
    width: 720,
    height: 360,
    variant: 'matrix',
    rows: WORKCENTERS,
    cols: DAYS,
    rowKey: 'workcenter',
    colKey: 'day',
    valueKey: 'downtimeMins',
    rowLabel: 'Shop Workcenter',
    colLabel: 'Day of Week',
    valueLabel: 'Downtime',
    unit: ' mins',
    showCellValues: true,
    data: DEFAULT_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-DOWNTIME-MATRIX"
      title="Weekly Equipment Downtime Matrix (Minutes Lost)"
      subtitle="Chakan PL-04 Workcenter Downtime by Day of Week"
      shift="Weekly Aggregation (All Shifts)"
      kpis={[
        { label: 'Worst Outage Cell', value: '120 Mins', sub: 'Press 1200T (Wednesday)', tone: 'critical' },
        { label: 'Weekend PM Spike', value: '95 Mins', sub: 'Paint E-Coat (Saturday)', tone: 'warning' },
        { label: 'Lowest Downtime Bay', value: 'CNC Bay 1', sub: 'Total 81 Mins / Week', tone: 'success' },
        { label: 'Plant Availability', value: '94.2%', sub: 'Within 95% SLA Target', tone: 'success' },
      ]}
      uclLimit="60 Mins / Shift (Max Unplanned Downtime Cap)"
      lclLimit="0 Mins (Zero Downtime Ideal)"
      tableData={DEFAULT_DATA}
      tableColumns={[
        { key: 'workcenter', label: 'Workcenter / Bay' },
        { key: 'day', label: 'Day of Week' },
        { key: 'downtimeMins', label: 'Downtime (Mins)', align: 'right' },
      ]}
    >
      <Heatmap {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Diverging Correlation Matrix
export const Variants: Story = {
  args: {
    title: 'Process Variable Correlation Matrix (Pearson r)',
    subtitle: 'Telemetry correlation: Spindle RPM, Vibration, Oil Temp, Tonnage, Scrap Rate',
    width: 720,
    height: 380,
    variant: 'correlation',
    colorScaleType: 'diverging',
    colorRange: ['#b91c1c', '#f8fafc', '#2563eb'],
    domain: [-1, 1],
    neutralValue: 0,
    rows: ['Spindle RPM', 'Vibration', 'Oil Temp', 'Press Force', 'Scrap Rate'],
    cols: ['Spindle RPM', 'Vibration', 'Oil Temp', 'Press Force', 'Scrap Rate'],
    rowKey: 'var1',
    colKey: 'var2',
    valueKey: 'r',
    showCellValues: true,
    data: CORRELATION_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-AI-CORRELATION"
      title="Process Variable Correlation Matrix (Pearson r)"
      subtitle="Telemetry correlation: Spindle RPM, Vibration, Oil Temp, Tonnage, Scrap Rate"
      shift="AI Metrology Engine"
      kpis={[
        { label: 'Strongest Correlation', value: 'r = +0.88', sub: 'Vibration vs Scrap Rate', tone: 'critical' },
        { label: 'Thermal Coupling', value: 'r = +0.84', sub: 'Vibration vs Oil Temp', tone: 'warning' },
        { label: 'Independent Metric', value: 'r = +0.05', sub: 'Vibration vs Press Force', tone: 'neutral' },
        { label: 'Speed Correlation', value: 'r = +0.78', sub: 'Spindle RPM vs Vibration', tone: 'warning' },
      ]}
      uclLimit="+1.00 (Perfect Positive Correlation)"
      lclLimit="-1.00 (Perfect Negative Correlation)"
      tableData={CORRELATION_DATA}
      tableColumns={[
        { key: 'var1', label: 'Parameter X' },
        { key: 'var2', label: 'Parameter Y' },
        { key: 'r', label: 'Pearson (r)', align: 'right' },
      ]}
    >
      <Heatmap {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Threshold and Temperature Overheating Hotspots
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'Transformer Core Winding Temperature Hotspot Grid (°C)',
    subtitle: 'Alert threshold: Cells exceeding 90°C require cooling fan actuation',
    width: 700,
    height: 340,
    rows: ['Bank A (Primary)', 'Bank B (Secondary)', 'Bank C (Rectifier)', 'Bank D (Inverter)'],
    cols: ['Phase R', 'Phase Y', 'Phase B', 'Neutral'],
    rowKey: 'bank',
    colKey: 'phase',
    valueKey: 'temp',
    unit: ' °C',
    showCellValues: true,
    colorRange: ['#fef3c7', '#b91c1c'],
    data: THRESHOLD_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-XFMR-THERMAL"
      title="Transformer Core Winding Temperature Hotspot Grid (°C)"
      subtitle="Alert threshold: Cells exceeding 90°C require cooling fan actuation"
      shift="Main 33kV Substation"
      kpis={[
        { label: 'Peak Core Hotspot', value: '96.0 °C', sub: 'Bank B (Phase Y) Overheat', tone: 'critical' },
        { label: 'Secondary Hotspot', value: '94.0 °C', sub: 'Bank C (Phase B)', tone: 'critical' },
        { label: 'Neutral Bus Temp', value: '55.0 °C', sub: 'Nominal Ground Return', tone: 'success' },
        { label: 'Aux Cooling Fan', value: 'ACTIVATED', sub: 'Forced Air Stage 2', tone: 'warning' },
      ]}
      uclLimit="90.0 °C (Forced Cooling Threshold)"
      lclLimit="45.0 °C (Ambient Base)"
      tableData={THRESHOLD_DATA}
      tableColumns={[
        { key: 'bank', label: 'Transformer Bank' },
        { key: 'phase', label: 'Electrical Phase' },
        { key: 'temp', label: 'Winding Temp (°C)', align: 'right' },
      ]}
    >
      <Heatmap {...args} />
    </EnterpriseChartStoryShell>
  ),
};

const RESTORED_IR_DATA = [
  { row: 'Sensor Row 1', col: 'Col A', temp: 64.2 },
  { row: 'Sensor Row 1', col: 'Col B', temp: 66.8 },
  { row: 'Sensor Row 1', col: 'Col C', temp: 68.5 },
  { row: 'Sensor Row 1', col: 'Col D', temp: 63.1 },
  { row: 'Sensor Row 2', col: 'Col A', temp: 72.4 },
  { row: 'Sensor Row 2', col: 'Col B', temp: 88.6 },
  { row: 'Sensor Row 2', col: 'Col C', temp: 89.2 },
  { row: 'Sensor Row 2', col: 'Col D', temp: 71.0 },
  { row: 'Sensor Row 3', col: 'Col A', temp: 78.1 },
  { row: 'Sensor Row 3', col: 'Col B', temp: 94.5 },
  { row: 'Sensor Row 3', col: 'Col C', temp: 91.3 },
  { row: 'Sensor Row 3', col: 'Col D', temp: 74.8 },
  { row: 'Sensor Row 4', col: 'Col A', temp: 58.0 },
  { row: 'Sensor Row 4', col: 'Col B', temp: 62.4 },
  { row: 'Sensor Row 4', col: 'Col C', temp: 61.9 },
  { row: 'Sensor Row 4', col: 'Col D', temp: 56.5 },
];

const HeatmapMissingTelemetryInteractiveStory: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('Thermal IR Hub Reconnecting', 'Establishing Gigabit Ethernet link to FLIR A700 IR Sensor Matrix...');

    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('Thermal IR Telemetry Restored', 'Synchronized 16-point focal temperature array at 30 fps.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('Thermal Hub Disconnected', 'Simulated GigE Vision network link drop on FLIR Gateway.');
  };

  const kpis: KPIItem[] = telemetryState === 'restored'
    ? [
        { label: 'Thermal IR Hub', value: 'ONLINE (30 Hz)', sub: 'FLIR A700 GigE Vision Active', tone: 'success' },
        { label: 'Peak Matrix Temp', value: '94.5 °C', sub: 'Row 3 / Col B Hotspot', tone: 'warning' },
        { label: 'Matrix Grid', value: '4 × 4 Active', sub: '16 Monitored Focus Points', tone: 'success' },
        { label: 'Thermal SLA', value: '99.8%', sub: 'Within APQP Specification', tone: 'success' },
      ]
    : [
        { label: 'Thermal IR Hub', value: 'OFFLINE', sub: 'FLIR Gateway Timeout', tone: 'critical' },
        { label: 'Calibration Cycle', value: 'ISO 18436-7', sub: 'NABL Certified Lab', tone: 'neutral' },
        { label: 'Array Grid Size', value: '4 × 4 Px', sub: 'High-Res Matrix', tone: 'neutral' },
        { label: 'Uptime SLA', value: '99.1%', sub: 'Year-to-Date', tone: 'neutral' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-IR-ARRAY"
      title="Chakan PL-04 FLIR Thermal Infrared Matrix"
      subtitle="Real-time focal temperature array and edge infrared hotspot telemetry"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={kpis}
      uclLimit="100.0 °C (Thermal Limit)"
      lclLimit="40.0 °C (Base Ambient)"
      tableData={telemetryState === 'restored' ? RESTORED_IR_DATA : []}
      tableColumns={[
        { key: 'row', label: 'Sensor Grid Y' },
        { key: 'col', label: 'Sensor Grid X' },
        { key: 'temp', label: 'Temperature (°C)', align: 'right' },
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
                ? 'FLIR IR HUB OFFLINE: Sensor Gateway Timed Out (GigE Vision Port 3956 Unreachable)'
                : telemetryState === 'reconnecting'
                ? 'INITIALIZING SENSOR: Handshake with FLIR A700 IR Focal Hub...'
                : 'THERMAL STREAM ACTIVE: 30 fps GigE Vision calibrated telemetry online'}
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

        <Heatmap
          title="Chakan PL-04 Ultrasonic Thickness & Thermal Matrix"
          subtitle="Real-time focal temperature array (°C)"
          width={680}
          height={300}
          rows={['Sensor Row 1', 'Sensor Row 2', 'Sensor Row 3', 'Sensor Row 4']}
          cols={['Col A', 'Col B', 'Col C', 'Col D']}
          rowKey="row"
          colKey="col"
          valueKey="temp"
          unit=" °C"
          colorRange={['#fef3c7', '#b91c1c']}
          showCellValues={true}
          loading={telemetryState === 'reconnecting'}
          emptyMessage="No thermal array records received. FLIR IR-array hub communication timed out."
          data={telemetryState === 'restored' ? RESTORED_IR_DATA : []}
        />
      </div>
    </EnterpriseChartStoryShell>
  );
};

// 4. Missing Telemetry & Empty State
export const MissingTelemetryAndEmpty: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <HeatmapMissingTelemetryInteractiveStory />
    </ToastProvider>
  ),
};

// 5. High Density Multi-Shift Shift-Hour Heatmap
export const HighDensityMultiShift: Story = {
  args: {
    title: 'Hourly Scrap Rejections Across 7 Days (Pieces)',
    subtitle: 'High density 24-hour observation matrix across all shifts',
    width: 820,
    height: 380,
    density: 'compact',
    rows: DAYS,
    cols: Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}h`),
    rowKey: 'day',
    colKey: 'hour',
    valueKey: 'scrap',
    unit: ' pcs',
    showCellValues: false,
    data: HIGH_DENSITY_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SCRAP-HEATMAP"
      title="Hourly Scrap Rejections Across 7 Days (Pieces)"
      subtitle="High density 24-hour observation matrix across all shifts (168 Cells)"
      shift="Continuous 24x7 (168 Observation Hours)"
      kpis={[
        { label: 'Peak Scrap Interval', value: '28 pcs/hr', sub: 'Shift B Changeover (16h)', tone: 'critical' },
        { label: 'Night Shift Spikes', value: '18 pcs/hr', sub: '02h-04h Fatigue Window', tone: 'warning' },
        { label: 'Weekly Total Scrap', value: '1,420 pcs', sub: '0.62% of Weekly Run', tone: 'success' },
        { label: 'Zero Scrap Hours', value: '34 Hours', sub: 'Optimal Steady State', tone: 'success' },
      ]}
      uclLimit="20 pcs/hr (Hourly Scrap Alarm Cap)"
      lclLimit="0 pcs/hr (Zero Defect Floor)"
      tableData={HIGH_DENSITY_DATA.slice(0, 24)}
      tableColumns={[
        { key: 'day', label: 'Day' },
        { key: 'hour', label: 'Hour Window' },
        { key: 'scrap', label: 'Scrap Pieces', align: 'right' },
      ]}
    >
      <Heatmap {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 6. Accessible Patterns and Cell Selection
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'Shift-wise Defect PPM by Defect Category',
    subtitle: 'Roving tabindex keyboard focus navigation and accessible value announcement',
    width: 740,
    height: 340,
    rows: ['Flash / Burr', 'Dent on Surface', 'Weld Blowhole', 'Thread Damage'],
    cols: SHIFTS,
    rowKey: 'defect',
    colKey: 'shift',
    valueKey: 'ppm',
    unit: ' PPM',
    showCellValues: true,
    data: ACCESSIBLE_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-DEFECT-PPM"
      title="Shift-wise Defect PPM by Defect Category"
      subtitle="Roving tabindex keyboard focus navigation and high-density telemetric table"
      shift="All 3 Shifts (A, B, C)"
      defaultView="table"
      kpis={[
        { label: 'Highest Defect', value: 'Flash/Burr (72 PPM)', sub: 'Shift C Night Peak', tone: 'critical' },
        { label: 'Best Performing Shift', value: 'Shift A (14.8 PPM avg)', sub: 'Day Shift Master Crew', tone: 'success' },
        { label: 'Thread Damage Rate', value: '11.6 PPM avg', sub: 'Well Under 20 PPM Cap', tone: 'success' },
        { label: 'Quality Sigma', value: '5.2 σ', sub: 'Automotive APQP Spec', tone: 'success' },
      ]}
      uclLimit="50 PPM (Plant Ceiling Spec)"
      lclLimit="0 PPM (Zero Defect Standard)"
      tableData={ACCESSIBLE_DATA}
      tableColumns={[
        { key: 'defect', label: 'Defect Category' },
        { key: 'shift', label: 'Production Shift' },
        { key: 'ppm', label: 'Defect PPM', align: 'right' },
      ]}
    >
      <Heatmap {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    title: 'Bay OEE % Heatmap',
    subtitle: 'Current shift',
    width: 340,
    height: 200,
    density: 'compact',
    rows: ['Bay 1', 'Bay 2', 'Bay 3'],
    cols: ['Avail', 'Perf', 'Qual'],
    rowKey: 'bay',
    colKey: 'metric',
    valueKey: 'score',
    unit: '%',
    showCellValues: true,
    data: COMPACT_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-OEE-MINI"
      title="Bay OEE % Heatmap"
      subtitle="Current shift live status"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Top OEE Bay', value: 'Bay 3 (95.3%)', sub: 'Robotic Welding', tone: 'success' },
        { label: 'Lowest Metric', value: 'Bay 2 Perf (79%)', sub: 'CNC Tooling Change', tone: 'warning' },
        { label: 'Quality High', value: 'Bay 3 Qual (99%)', sub: 'Zero Weld Rejects', tone: 'success' },
        { label: 'Plant OEE', value: '89.4%', sub: 'Target 85.0%', tone: 'success' },
      ]}
      uclLimit="100.0% (Maximum OEE)"
      lclLimit="85.0% (World Class Target)"
      tableData={COMPACT_DATA}
      tableColumns={[
        { key: 'bay', label: 'Bay' },
        { key: 'metric', label: 'OEE Factor' },
        { key: 'score', label: 'Score (%)', align: 'right' },
      ]}
    >
      <Heatmap {...args} />
    </EnterpriseChartStoryShell>
  ),
};

/**
 * Dedicated accessibility story showcasing the built-in tabular summary mirror disclosure
 * satisfying WCAG 2.2 AA non-text contrast and non-visual data consumption.
 */
export const AccessibleDataTableMirror: Story = {
  args: {
    title: 'Workcenter Downtime Matrix (Accessible Alternative Mirror)',
    data: DEFAULT_DATA,
    colKey: 'day',
    rowKey: 'workcenter',
    valueKey: 'downtimeMins',
    unit: ' mins',
    showDataTable: true,
    width: 800,
    height: 380,
  },
};
