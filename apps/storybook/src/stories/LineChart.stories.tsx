import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LineChart, Button, ToastProvider, useToast } from '@ds/react';
import { EnterpriseChartStoryShell, KPIItem } from './components/EnterpriseChartStoryShell';

const meta: Meta<typeof LineChart> = {
  title: 'Data Visualization/LineChart',
  component: LineChart,
  parameters: {
    docs: {
      description: {
        component:
          'LineChart shows continuous change, rate of change, tolerance envelopes, missing-interval policies, and multi-sensor telemetry for Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['single', 'multi', 'stepped', 'indexed', 'small-multiples'],
    },
    interpolation: {
      control: 'select',
      options: ['monotone', 'linear', 'step', 'step-after', 'smooth'],
    },
    missingValuePolicy: {
      control: 'select',
      options: ['dashed', 'gap', 'zero'],
    },
    showDataTable: {
      control: 'boolean',
      description: 'Renders an accessible non-visual tabular summary disclosure (<details>) directly below chart for WCAG 1.1.1 compliance',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LineChart>;

const DEFAULT_DATA = [
  { time: '06:00', rms: 0.9 },
  { time: '07:00', rms: 1.1 },
  { time: '08:00', rms: 1.3 },
  { time: '09:00', rms: 1.8 },
  { time: '10:00', rms: 2.1 },
  { time: '11:00', rms: 2.7 },
  { time: '12:00', rms: 2.4 },
  { time: '13:00', rms: 1.5 },
  { time: '14:00', rms: 2.9 },
  { time: '15:00', rms: 3.4 },
  { time: '16:00', rms: 4.8 },
  { time: '17:00', rms: 4.2 },
  { time: '18:00', rms: 3.1 },
  { time: '19:00', rms: 2.2 },
  { time: '20:00', rms: 1.4 },
  { time: '21:00', rms: 1.0 },
];

const VARIANTS_DATA = [
  { time: '06:00', pressP01: 32, pressP02: 30, cncBay02: 28 },
  { time: '08:00', pressP01: 44, pressP02: 46, cncBay02: 36 },
  { time: '10:00', pressP01: 52, pressP02: 58, cncBay02: 42 },
  { time: '12:00', pressP01: 58, pressP02: 67, cncBay02: 45 },
  { time: '14:00', pressP01: 61, pressP02: 72, cncBay02: 47 },
  { time: '16:00', pressP01: 59, pressP02: 69, cncBay02: 46 },
  { time: '18:00', pressP01: 54, pressP02: 63, cncBay02: 44 },
  { time: '20:00', pressP01: 48, pressP02: 52, cncBay02: 38 },
  { time: '22:00', pressP01: 38, pressP02: 41, cncBay02: 31 },
];

const THRESHOLD_DATA = [
  { sample: 'S-01', ph: 6.08 },
  { sample: 'S-02', ph: 6.12 },
  { sample: 'S-03', ph: 6.15 },
  { sample: 'S-04', ph: 6.22 },
  { sample: 'S-05', ph: 6.38 },
  { sample: 'S-06', ph: 6.45 },
  { sample: 'S-07', ph: 6.32 },
  { sample: 'S-08', ph: 6.18 },
  { sample: 'S-09', ph: 5.95 },
  { sample: 'S-10', ph: 5.76 },
  { sample: 'S-11', ph: 5.90 },
  { sample: 'S-12', ph: 6.05 },
];

const MISSING_DATA = [
  { time: '01:00', temp: 840 },
  { time: '02:00', temp: 848 },
  { time: '03:00', temp: 852 },
  { time: '04:00', temp: null },
  { time: '05:00', temp: null },
  { time: '06:00', temp: 855 },
  { time: '07:00', temp: 851 },
  { time: '08:00', temp: 846 },
];

const HIGH_DENSITY_DATA = Array.from({ length: 60 }, (_, i) => {
  const mins = i * 2;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const timeStr = `${String(h + 6).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  const pressure = Math.round(210 + Math.sin(i / 5) * 18 + (((i * 7) % 6) - 3));
  return { time: timeStr, pressure };
});

const ACCESSIBLE_DATA = [
  { hour: 'H1', shiftA: 12, shiftB: 14, shiftC: 15 },
  { hour: 'H2', shiftA: 24, shiftB: 28, shiftC: 31 },
  { hour: 'H3', shiftA: 38, shiftB: 42, shiftC: 49 },
  { hour: 'H4', shiftA: 52, shiftB: 59, shiftC: 68 },
  { hour: 'H5', shiftA: 67, shiftB: 74, shiftC: 85 },
  { hour: 'H6', shiftA: 81, shiftB: 90, shiftC: 104 },
  { hour: 'H7', shiftA: 95, shiftB: 106, shiftC: 122 },
  { hour: 'H8', shiftA: 108, shiftB: 121, shiftC: 141 },
];

const COMPACT_DATA = [
  { t: '10:00', bar: 7.4 },
  { t: '10:15', bar: 7.2 },
  { t: '10:30', bar: 7.5 },
  { t: '10:45', bar: 7.1 },
  { t: '11:00', bar: 6.9 },
  { t: '11:15', bar: 7.3 },
];

// 1. Default Baseline Story
export const Default: Story = {
  args: {
    title: 'CNC Spindle #4 Bearing Vibration Velocity (mm/s RMS)',
    caption: 'ISO 10816-3 Class II Machine Vibration Monitor (Shift A & B)',
    width: 720,
    height: 340,
    xKey: 'time',
    yKey: 'rms',
    unit: ' mm/s',
    interpolation: 'monotone',
    showCrosshair: true,
    referenceLines: [
      { value: 4.5, label: 'Unacceptable Alert (4.5 mm/s)', tone: 'danger', strokeStyle: 'solid' },
      { value: 2.8, label: 'Warning Threshold (2.8 mm/s)', tone: 'warning', strokeStyle: 'dashed' },
      { value: 1.1, label: 'Nominal Good (1.1 mm/s)', tone: 'success', strokeStyle: 'dashed' },
    ],
    data: DEFAULT_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-CNC-04-VIB"
      title="CNC Spindle #4 Bearing Vibration Velocity (mm/s RMS)"
      subtitle="ISO 10816-3 Class II Machine Vibration Monitor (Shift A & B)"
      shift="Shift A & B (06:00 – 22:00 IST)"
      kpis={[
        { label: 'Current RMS', value: '1.0 mm/s', sub: 'Zone A (Good Condition)', tone: 'success' },
        { label: 'Peak Vibration', value: '4.8 mm/s', sub: 'Breach at 16:00 IST', tone: 'critical' },
        { label: 'Warning Alert', value: '2.8 mm/s', sub: 'Zone C Action Level', tone: 'warning' },
        { label: 'Spindle Bearing', value: 'SKF 7014 CD', sub: 'Bearing Life 91.4%', tone: 'success' },
      ]}
      uclLimit="4.5 mm/s (Unacceptable Trip Limit)"
      lclLimit="0.5 mm/s (Baseline Floor)"
      tableData={DEFAULT_DATA}
      tableColumns={[
        { key: 'time', label: 'Timestamp (IST)' },
        { key: 'rms', label: 'Vibration RMS (mm/s)', align: 'right' },
      ]}
    >
      <LineChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Multi-Line Comparison Variant
export const Variants: Story = {
  args: {
    title: 'Multi-Machine Hydraulic Oil Temperature Profile (°C)',
    caption: 'Comparing Press P-01, Press P-02, and CNC Spindle over Shift A & B',
    width: 760,
    height: 360,
    xKey: 'time',
    variant: 'multi',
    unit: ' °C',
    series: [
      { key: 'pressP01', label: 'Press P-01 (Komatsu 800T)', color: '#2563eb', symbol: 'circle' },
      { key: 'pressP02', label: 'Press P-02 (Schuler 1200T)', color: '#b91c1c', strokeDash: '5,5', symbol: 'square' },
      { key: 'cncBay02', label: 'CNC Bay 02 (Makino)', color: '#15803D', strokeDash: '2,2', symbol: 'triangle' },
    ],
    referenceLines: [
      { value: 65, label: 'Cooling Fan Cut-In (65°C)', tone: 'warning', strokeStyle: 'dashed' },
    ],
    data: VARIANTS_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-MULTI-THERMAL"
      title="Multi-Machine Hydraulic Oil Temperature Profile (°C)"
      subtitle="Comparing Press P-01, Press P-02, and CNC Spindle over Shift A & B"
      shift="Shift A & B (06:00 – 22:00 IST)"
      kpis={[
        { label: 'Highest Temp', value: '72.0 °C', sub: 'Press P-02 at 14:00 IST', tone: 'critical' },
        { label: 'Press P-01 Temp', value: '38.0 °C', sub: 'Within 60°C Target', tone: 'success' },
        { label: 'CNC Makino Temp', value: '31.0 °C', sub: 'Chiller Stabilized', tone: 'success' },
        { label: 'Cooling Fan Fan Cut-In', value: '65.0 °C', sub: 'Auto Thermostat Trip', tone: 'warning' },
      ]}
      uclLimit="70.0 °C (Hydraulic Oil Degradation Limit)"
      lclLimit="25.0 °C (Cold Start Minimum)"
      tableData={VARIANTS_DATA}
      tableColumns={[
        { key: 'time', label: 'Time (IST)' },
        { key: 'pressP01', label: 'Press P-01 (°C)', align: 'right' },
        { key: 'pressP02', label: 'Press P-02 (°C)', align: 'right' },
        { key: 'cncBay02', label: 'CNC Makino (°C)', align: 'right' },
      ]}
    >
      <LineChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Threshold and Control Limits
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'E-Coat Paint Dip Bath pH Continuous Monitor',
    caption: 'Process tolerance limits: pH 5.80 to 6.40 (Optimal 6.10)',
    width: 780,
    height: 360,
    xKey: 'sample',
    yKey: 'ph',
    unit: ' pH',
    domain: [5.5, 6.7],
    thresholdBands: [
      { min: 5.8, max: 6.4, label: 'Permissible pH Window', tone: 'neutral' },
    ],
    referenceLines: [
      { value: 6.4, label: 'UCL (6.40 pH)', tone: 'danger', strokeStyle: 'solid' },
      { value: 6.1, label: 'Target (6.10 pH)', tone: 'brand', strokeStyle: 'dashed' },
      { value: 5.8, label: 'LCL (5.80 pH)', tone: 'danger', strokeStyle: 'solid' },
    ],
    data: THRESHOLD_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-ECOAT-CHEM"
      title="E-Coat Paint Dip Bath pH Continuous Monitor"
      subtitle="Process tolerance limits: pH 5.8 to 6.4 (Optimal 6.1)"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Current Bath pH', value: '6.05 pH', sub: 'Optimal (Target 6.10)', tone: 'success' },
        { label: 'Alkaline Breach', value: '6.45 pH', sub: 'Sample S-06 (Acid Dosing Triggered)', tone: 'critical' },
        { label: 'Acidic Floor Breach', value: '5.76 pH', sub: 'Sample S-10 (Deionizing Adjusted)', tone: 'critical' },
        { label: 'Process CpK', value: '1.38', sub: 'Cathodic Paint Standard', tone: 'success' },
      ]}
      uclLimit="6.40 pH (Alkaline Over-Etch Trip)"
      lclLimit="5.80 pH (Acidic Under-Coat Floor)"
      tableData={THRESHOLD_DATA}
      tableColumns={[
        { key: 'sample', label: 'Dip Bath Sample' },
        { key: 'ph', label: 'Measured pH', align: 'right' },
      ]}
    >
      <LineChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

const LineChartMissingTelemetryInteractiveStory: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('Modbus RTU Gateway Reconnecting', 'Establishing serial handshake with HT-FURNACE-04 Annealing Pyrometer...');

    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('Modbus Telemetry Restored', 'Synchronized 10 temperature stream samples across Shift C.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('Modbus Bus Dropout', 'Simulated RS-485 serial communication timeout on Furnace HT-04.');
  };

  const kpis: KPIItem[] = telemetryState === 'restored'
    ? [
        { label: 'Current Soak Temp', value: '846 °C', sub: 'Target 850 ± 10 °C', tone: 'success' },
        { label: 'Modbus Telemetry', value: 'ONLINE (1 Hz)', sub: 'RS-485 Bus Synchronized', tone: 'success' },
        { label: 'Backup Pyrometer', value: '849 °C', sub: 'Analog Redundancy', tone: 'success' },
        { label: 'Heating Elements', value: '6 / 6 Healthy', sub: 'Thyristor Power 74%', tone: 'success' },
      ]
    : [
        { label: 'Current Soak Temp', value: '-- °C', sub: 'Sensor Node Unreachable', tone: 'critical' },
        { label: 'Modbus Telemetry', value: 'DISCONNECTED', sub: 'Bus Timeout at 04:00 IST', tone: 'critical' },
        { label: 'Backup Pyrometer', value: '849 °C', sub: 'Analog Redundancy', tone: 'success' },
        { label: 'Heating Elements', value: '6 / 6 Healthy', sub: 'Thyristor Power 74%', tone: 'neutral' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-FURNACE-MODBUS"
      title="Furnace Annealing Temperature with Modbus Dropout"
      subtitle="Real-time furnace thermocouple stream and bus interruption simulation"
      shift="Night Shift C (22:00 – 06:00 IST)"
      kpis={kpis}
      uclLimit="880 °C (High Temp Alarm)"
      lclLimit="820 °C (Low Soak Limit)"
      tableData={telemetryState === 'restored' ? MISSING_DATA : []}
      tableColumns={[
        { key: 'time', label: 'Log Time (IST)' },
        { key: 'temp', label: 'Soak Temp (°C)', align: 'right' },
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
                ? 'MODBUS GATEWAY OFFLINE: Pyrometer Node #4 Serial Communication Timeout (04:00 IST)'
                : telemetryState === 'reconnecting'
                ? 'CONNECTING TO MODBUS: Baud sync 115.2 kbps on Furnace HT-04...'
                : 'MODBUS RTU STREAM ACTIVE: 1 Hz telemetry online'}
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

        <LineChart
          title="Furnace Annealing Temperature with Modbus Dropout"
          caption="Demonstrates missing-data policy (gap bridging with dashed segment)"
          width={720}
          height={320}
          xKey="time"
          yKey="temp"
          unit=" °C"
          missingValuePolicy="gap"
          loading={telemetryState === 'reconnecting'}
          emptyText="Modbus bus timeout: Pyrometer sensor node unreachable since 04:00 IST."
          referenceLines={[
            { value: 850, label: 'Annealing Soak Target (850°C)', tone: 'brand', strokeStyle: 'dashed' },
          ]}
          data={telemetryState === 'restored' ? MISSING_DATA : []}
        />
      </div>
    </EnterpriseChartStoryShell>
  );
};

// 4. Missing Telemetry (Gap & Dashed Interpolation)
export const MissingTelemetryAndEmpty: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <LineChartMissingTelemetryInteractiveStory />
    </ToastProvider>
  ),
};

// 5. High Density Multi-Shift Telemetry
export const HighDensityMultiShift: Story = {
  args: {
    title: 'Chakan PL-04 High-Speed Stamping Stroke Pressure (bar)',
    caption: '120-Point High-Frequency Telemetry across Shift A, B, and C',
    width: 820,
    height: 360,
    xKey: 'time',
    yKey: 'pressure',
    unit: ' bar',
    interpolation: 'linear',
    pointVisibility: 'hover',
    data: HIGH_DENSITY_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-PRESS-BAR"
      title="Chakan PL-04 High-Speed Stamping Stroke Pressure (bar)"
      subtitle="120-Point High-Frequency Telemetry across Shift A, B, and C"
      shift="Continuous Telemetry (60 Sampling Points)"
      kpis={[
        { label: 'Mean Hydraulic Pressure', value: '210.4 bar', sub: 'Nominal 210 bar', tone: 'success' },
        { label: 'Peak Stroke Pressure', value: '228 bar', sub: 'Within 235 bar Limit', tone: 'success' },
        { label: 'Pressure Ripple (ΔP)', value: '±8.5 bar', sub: 'Accumulator Active', tone: 'success' },
        { label: 'Relief Valve Status', value: 'Closed', sub: 'Zero Pressure Leakage', tone: 'success' },
      ]}
      uclLimit="235 bar (Relief Valve Trip)"
      lclLimit="185 bar (Low Pressure Warning)"
      tableData={HIGH_DENSITY_DATA}
      tableColumns={[
        { key: 'time', label: 'Sampling Time' },
        { key: 'pressure', label: 'Pressure (bar)', align: 'right' },
      ]}
    >
      <LineChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 6. Accessible Patterns and Small Multiples / Table
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'Tool Wear Index Across Three Production Shifts',
    caption: 'Distinct dash patterns, point glyphs, keyboard roving focus, and table modal',
    width: 760,
    height: 340,
    xKey: 'hour',
    variant: 'multi',
    series: [
      { key: 'shiftA', label: 'Shift A (Tool Set 1)', color: '#1d4ed8', symbol: 'circle' },
      { key: 'shiftB', label: 'Shift B (Tool Set 2)', color: '#047857', strokeDash: '6,4', symbol: 'square' },
      { key: 'shiftC', label: 'Shift C (Tool Set 3)', color: '#b45309', strokeDash: '3,3', symbol: 'diamond' },
    ],
    data: ACCESSIBLE_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-TOOL-WEAR"
      title="Tool Wear Index Across Three Production Shifts"
      subtitle="Distinct dash patterns, point glyphs, and high-density tabular view"
      shift="All 3 Shifts (A, B, C)"
      defaultView="table"
      kpis={[
        { label: 'Shift C Max Wear', value: '141 Index', sub: 'Replacement Threshold 150', tone: 'warning' },
        { label: 'Shift B Max Wear', value: '121 Index', sub: 'Nominal Flank Wear', tone: 'success' },
        { label: 'Shift A Max Wear', value: '108 Index', sub: 'Optimal Tool Life', tone: 'success' },
        { label: 'Carbide Grade', value: 'TiAlN Coated', sub: 'Sandvik Coromant', tone: 'neutral' },
      ]}
      uclLimit="150 Index (Mandatory Tool Regrind)"
      lclLimit="0 Index (Fresh Edge)"
      tableData={ACCESSIBLE_DATA}
      tableColumns={[
        { key: 'hour', label: 'Operating Hour' },
        { key: 'shiftA', label: 'Shift A Wear Index', align: 'right' },
        { key: 'shiftB', label: 'Shift B Wear Index', align: 'right' },
        { key: 'shiftC', label: 'Shift C Wear Index', align: 'right' },
      ]}
    >
      <LineChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    title: 'Air Compressor Pressure (bar)',
    caption: 'Main Plant Header',
    width: 380,
    height: 240,
    xKey: 't',
    yKey: 'bar',
    unit: ' bar',
    showGrid: false,
    referenceLines: [{ value: 7.0, label: 'Min 7.0 bar', tone: 'danger' }],
    data: COMPACT_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-AIR-HEADER"
      title="Air Compressor Pressure (bar)"
      subtitle="Main Plant Header"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Current Header Bar', value: '7.3 bar', sub: 'Nominal Range', tone: 'success' },
        { label: 'Low Pressure Dip', value: '6.9 bar', sub: '11:00 IST Tool Change', tone: 'warning' },
        { label: 'Compressor 1', value: 'Loaded (82%)', sub: 'Atlas Copco GA75', tone: 'success' },
        { label: 'Compressor 2', value: 'Standby Auto', sub: 'Ready for Cut-In', tone: 'success' },
      ]}
      uclLimit="8.5 bar (Over-Pressure Vent)"
      lclLimit="7.0 bar (Pneumatic Minimum Threshold)"
      tableData={COMPACT_DATA}
      tableColumns={[
        { key: 't', label: 'Timestamp' },
        { key: 'bar', label: 'Header Pressure (bar)', align: 'right' },
      ]}
    >
      <LineChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

/**
 * Dedicated accessibility story showcasing the built-in tabular summary mirror disclosure
 * satisfying WCAG 2.2 AA non-text contrast and non-visual data consumption.
 */
export const AccessibleDataTableMirror: Story = {
  args: {
    title: 'Spindle Bearing RMS Vibration (Accessible Alternative Mirror)',
    data: DEFAULT_DATA,
    xKey: 'time',
    yKey: 'rms',
    unit: ' mm/s',
    showDataTable: true,
    width: '100%',
    height: 320,
  },
};
