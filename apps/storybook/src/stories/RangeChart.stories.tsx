import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RangeChart, Button, ToastProvider, useToast } from '@ds/react';
import { EnterpriseChartStoryShell, KPIItem } from './components/EnterpriseChartStoryShell';

const meta: Meta<typeof RangeChart> = {
  title: 'Data Visualization/RangeChart',
  component: RangeChart,
  parameters: {
    docs: {
      description: {
        component:
          'RangeChart compares bounded intervals, uncertainty bands, min-max temperature envelopes, and before/after Kaizen improvements (dumbbell/interval-bar/error-bar) for Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['interval-bar', 'dumbbell', 'error-bar', 'range-area'],
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof RangeChart>;

const DEFAULT_DATA = [
  { id: 'P-01', label: 'Press 01 (Komatsu 800T)', lower: 710, upper: 790, center: 752, target: 750, status: 'nominal' as const },
  { id: 'P-02', label: 'Press 02 (Schuler 1200T)', lower: 680, upper: 840, center: 775, target: 750, status: 'warning' as const },
  { id: 'P-03', label: 'Press 03 (Tandem Lead)', lower: 720, upper: 770, center: 748, target: 750, status: 'nominal' as const },
  { id: 'P-04', label: 'Press 04 (Progressive Blank)', lower: 590, upper: 640, center: 615, target: 620, status: 'nominal' as const },
  { id: 'P-05', label: 'Press 05 (Deep Draw 500T)', lower: 440, upper: 530, center: 495, target: 480, status: 'critical' as const },
];

const DUMBBELL_DATA = [
  { id: 'L-1', label: 'Line 1 (800T Transfer)', lower: 28, upper: 75, isImproved: true, status: 'nominal' as const },
  { id: 'L-2', label: 'Line 2 (1200T Schuler)', lower: 34, upper: 92, isImproved: true, status: 'nominal' as const },
  { id: 'L-3', label: 'Line 3 (Tandem Cell)', lower: 22, upper: 60, isImproved: true, status: 'nominal' as const },
  { id: 'L-4', label: 'Line 4 (Blanking Line)', lower: 15, upper: 45, isImproved: true, status: 'nominal' as const },
  { id: 'L-5', label: 'Line 5 (Deep Draw)', lower: 42, upper: 50, isImproved: true, status: 'warning' as const },
];

const ERROR_BAR_DATA = [
  { id: 'G-1', label: 'Grinder G-01', lower: 47.992, upper: 48.006, center: 47.999, status: 'nominal' as const },
  { id: 'G-2', label: 'Grinder G-02', lower: 47.995, upper: 48.009, center: 48.002, status: 'nominal' as const },
  { id: 'G-3', label: 'Grinder G-03 (Worn Wheel)', lower: 48.012, upper: 48.028, center: 48.020, status: 'critical' as const },
  { id: 'G-4', label: 'Grinder G-04', lower: 47.989, upper: 48.003, center: 47.996, status: 'nominal' as const },
  { id: 'G-5', label: 'Superfinishing Cell', lower: 47.998, upper: 48.002, center: 48.000, status: 'nominal' as const },
];

const HIGH_DENSITY_DATA = [
  { label: 'P-01 Main Drive', lower: 42, upper: 68, center: 55, status: 'nominal' as const },
  { label: 'P-02 Main Drive', lower: 45, upper: 74, center: 62, status: 'warning' as const },
  { label: 'P-03 Flywheel', lower: 38, upper: 58, center: 48, status: 'nominal' as const },
  { label: 'CNC-01 Spindle', lower: 35, upper: 52, center: 44, status: 'nominal' as const },
  { label: 'CNC-02 Spindle', lower: 36, upper: 54, center: 45, status: 'nominal' as const },
  { label: 'CNC-03 Spindle', lower: 40, upper: 82, center: 65, status: 'critical' as const },
  { label: 'Weld Robot 1 J1', lower: 32, upper: 48, center: 40, status: 'nominal' as const },
  { label: 'Weld Robot 2 J1', lower: 34, upper: 50, center: 42, status: 'nominal' as const },
  { label: 'Compressor #1', lower: 55, upper: 78, center: 66, status: 'warning' as const },
  { label: 'Compressor #2', lower: 52, upper: 72, center: 61, status: 'nominal' as const },
];

const ACCESSIBLE_DATA = [
  { label: 'Coil Batch C-881 (CRCA 1.2mm)', lower: 1.18, upper: 1.22, center: 1.20, status: 'nominal' as const },
  { label: 'Coil Batch C-882 (CRCA 1.5mm)', lower: 1.47, upper: 1.54, center: 1.51, status: 'nominal' as const },
  { label: 'Coil Batch C-883 (DP600 2.0mm)', lower: 1.94, upper: 2.08, center: 2.01, status: 'warning' as const },
  { label: 'Coil Batch C-884 (AL6061 2.5mm)', lower: 2.46, upper: 2.53, center: 2.49, status: 'nominal' as const },
];

const COMPACT_DATA = [
  { label: 'Line 1', lower: 28, upper: 65, isImproved: true },
  { label: 'Line 2', lower: 35, upper: 80, isImproved: true },
  { label: 'Line 3', lower: 20, upper: 45, isImproved: true },
];

// 1. Default Baseline Interval Bar Story
export const Default: Story = {
  args: {
    title: 'Hydraulic Press Operating Tonnage Ranges (Min - Max - Mean)',
    subtitle: 'Chakan PL-04 Stamping Bay — Nominal Target vs Actual Pressure Envelope',
    width: 760,
    height: 420,
    variant: 'interval-bar',
    orientation: 'horizontal',
    categoryKey: 'label',
    lowerKey: 'lower',
    upperKey: 'upper',
    centerKey: 'center',
    targetKey: 'target',
    unit: ' T',
    targetLine: { value: 750, label: 'Plant Target (750 T)' },
    data: DEFAULT_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-PRESS-RANGES"
      title="Hydraulic Press Operating Tonnage Ranges (Min - Max - Mean)"
      subtitle="Chakan PL-04 Stamping Bay — Nominal Target vs Actual Pressure Envelope"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Target Setpoint', value: '750 Tonnage', sub: 'Plant Baseline Goal', tone: 'neutral' },
        { label: 'Widest Operating Span', value: '680 – 840 T', sub: 'Press 02 (Schuler 1200T)', tone: 'warning' },
        { label: 'Tightest Control', value: '720 – 770 T', sub: 'Press 03 (Tandem Lead)', tone: 'success' },
        { label: 'Overload Alarm', value: 'Press 05 Out of Spec', sub: 'Upper 530 T vs 480 T Cap', tone: 'critical' },
      ]}
      uclLimit="850 T (Die Safety Limit)"
      lclLimit="400 T (Minimum Forming Load)"
      tableData={DEFAULT_DATA}
      tableColumns={[
        { key: 'label', label: 'Machine / Station' },
        { key: 'lower', label: 'Min Load (T)', align: 'right' },
        { key: 'center', label: 'Mean Load (T)', align: 'right' },
        { key: 'upper', label: 'Max Load (T)', align: 'right' },
        { key: 'target', label: 'Target (T)', align: 'right' },
        { key: 'status', label: 'Envelope Health' },
      ]}
    >
      <RangeChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Dumbbell Before/After Kaizen Improvement Variant
export const Variants: Story = {
  args: {
    title: 'Die Changeover SMED Kaizen: Before vs After Time (Minutes)',
    subtitle: 'Dumbbell range plot tracking Single-Minute Exchange of Die improvements across lines',
    width: 760,
    height: 400,
    variant: 'dumbbell',
    orientation: 'horizontal',
    categoryKey: 'label',
    lowerKey: 'lower',
    upperKey: 'upper',
    unit: ' mins',
    data: DUMBBELL_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SMED-KAIZEN"
      title="Die Changeover SMED Kaizen: Before vs After Time (Minutes)"
      subtitle="Dumbbell range plot tracking Single-Minute Exchange of Die improvements across lines"
      shift="Kaizen Continuous Improvement"
      kpis={[
        { label: 'Average SMED Reduction', value: '-54.2%', sub: 'From 64.4 to 28.2 Mins', tone: 'success' },
        { label: 'Best Line Improvement', value: 'Line 4 (-66%)', sub: 'From 45 to 15 Mins', tone: 'success' },
        { label: 'Schuler 1200T Gain', value: 'Line 2 (-58 Mins)', sub: 'From 92 to 34 Mins', tone: 'success' },
        { label: 'Kaizen Target Met', value: '4 of 5 Lines', sub: 'Line 5 Needs Tool Cart', tone: 'warning' },
      ]}
      uclLimit="45 Mins (SMED Standard Target)"
      lclLimit="10 Mins (Benchmark Record)"
      tableData={DUMBBELL_DATA}
      tableColumns={[
        { key: 'label', label: 'Stamping Line' },
        { key: 'upper', label: 'Before Kaizen (Mins)', align: 'right' },
        { key: 'lower', label: 'After Kaizen (Mins)', align: 'right' },
        { key: 'status', label: 'Kaizen Status' },
      ]}
    >
      <RangeChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Error-Bar 95% Confidence Interval Tolerance
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'Crankshaft Journal Diameter 95% Confidence Intervals (mm)',
    subtitle: 'High precision CMM metrology: Tolerance Band 48.000 mm ± 0.015 mm',
    width: 760,
    height: 400,
    variant: 'error-bar',
    orientation: 'vertical',
    categoryKey: 'label',
    lowerKey: 'lower',
    upperKey: 'upper',
    centerKey: 'center',
    unit: ' mm',
    targetLine: { value: 48.000, label: 'Nominal 48.000 mm' },
    data: ERROR_BAR_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-CRANK-CMM"
      title="Crankshaft Journal Diameter 95% Confidence Intervals (mm)"
      subtitle="High precision CMM metrology: Tolerance Band 48.000 mm ± 0.015 mm"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Nominal Diameter', value: '48.000 mm', sub: 'Drawing Spec Dimension', tone: 'neutral' },
        { label: 'Best Center Match', value: 'Superfinish (48.000mm)', sub: '± 0.002 mm Confidence', tone: 'success' },
        { label: 'Worn Wheel Outlier', value: 'Grinder G-03 (48.020mm)', sub: 'Exceeds USL 48.015 mm', tone: 'critical' },
        { label: 'Overall Metrology Pass', value: '80.0%', sub: '4 of 5 Grinders Pass', tone: 'warning' },
      ]}
      uclLimit="48.015 mm (USL Upper Tolerance)"
      lclLimit="47.985 mm (LSL Lower Tolerance)"
      tableData={ERROR_BAR_DATA}
      tableColumns={[
        { key: 'label', label: 'Grinding Machine' },
        { key: 'lower', label: 'LCL 95% (mm)', align: 'right' },
        { key: 'center', label: 'Sample Mean (mm)', align: 'right' },
        { key: 'upper', label: 'UCL 95% (mm)', align: 'right' },
        { key: 'status', label: 'Tolerance Health' },
      ]}
    >
      <RangeChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

const RESTORED_QUENCH_DATA = [
  { id: 'Q-01', label: 'Quench Zone 1 (Entry)', lower: 840, upper: 870, center: 855, status: 'nominal' as const },
  { id: 'Q-02', label: 'Quench Zone 2 (Core Soak)', lower: 845, upper: 865, center: 852, status: 'nominal' as const },
  { id: 'Q-03', label: 'Quench Zone 3 (Oil Bath Immersion)', lower: 60, upper: 75, center: 66, status: 'nominal' as const },
  { id: 'Q-04', label: 'Quench Zone 4 (Cooling Runout)', lower: 40, upper: 55, center: 46, status: 'nominal' as const },
];

const RangeChartMissingTelemetryInteractiveStory: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('Pyrometer Calibrator Reconnecting', 'Negotiating Modbus RTU telemetry link with Quench Chamber IR Optical Pyrometer...');

    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('Pyrometer Telemetry Restored', 'Synchronized 4 furnace temperature interval bounds for HT-04.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('Pyrometer Calibrator Offline', 'Simulated optical pyrometer optical bus disconnection.');
  };

  const kpis: KPIItem[] = telemetryState === 'restored'
    ? [
        { label: 'Pyrometer Sensor', value: 'ONLINE (Modbus)', sub: 'IR Optical Calibrated', tone: 'success' },
        { label: 'Core Soak Range', value: '845 – 865 °C', sub: 'Nominal Hardening Zone', tone: 'success' },
        { label: 'Quench Tank Oil', value: '66 °C', sub: 'Circulation Optimal', tone: 'success' },
        { label: 'Process Control', value: 'In-Spec (CpK 1.58)', sub: 'Zero Hardness Defects', tone: 'success' },
      ]
    : [
        { label: 'Pyrometer Sensor', value: 'DISCONNECTED', sub: 'Calibrator Offline', tone: 'critical' },
        { label: 'Last Quench Reading', value: '845 – 860 °C', sub: 'Recorded at 21:30 IST', tone: 'neutral' },
        { label: 'Quench Tank Oil', value: '62 °C', sub: 'Circulation Pump Running', tone: 'success' },
        { label: 'Alarm Protocol', value: 'Manual Dip Check', sub: 'Every 30 Mins', tone: 'warning' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-FURNACE-BOUNDS"
      title="Heat Treatment Furnace Quench Temperature Bounds"
      subtitle="Real-time optical pyrometer temperature bounds and calibrator telemetry"
      shift="Night Shift C (22:00 – 06:00 IST)"
      kpis={kpis}
      uclLimit="880 °C (Upper Thermal Limit)"
      lclLimit="820 °C (Lower Quench Floor)"
      tableData={telemetryState === 'restored' ? RESTORED_QUENCH_DATA : []}
      tableColumns={[
        { key: 'label', label: 'Quench Zone' },
        { key: 'lower', label: 'Lower Bound (°C)', align: 'right' },
        { key: 'center', label: 'Mean (°C)', align: 'right' },
        { key: 'upper', label: 'Upper Bound (°C)', align: 'right' },
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
                ? 'PYROMETER CALIBRATOR OFFLINE: HT-04 Quench Optical Bus Timeout'
                : telemetryState === 'reconnecting'
                ? 'CALIBRATING PYROMETER: Optical handshake on Modbus RTU 115.2 kbps...'
                : 'PYROMETER TELEMETRY ONLINE: Dual-wavelength optical thermal stream active'}
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

        <RangeChart
          title="Heat Treatment Furnace Quench Temperature Bounds"
          subtitle="Real-time temperature bounds (°C)"
          width={680}
          height={300}
          unit=" °C"
          ariaLabel="No bounded interval telemetry records found for furnace quench chamber."
          data={telemetryState === 'restored' ? RESTORED_QUENCH_DATA : []}
        />
      </div>
    </EnterpriseChartStoryShell>
  );
};

// 4. Missing Telemetry & Empty State
export const MissingTelemetryAndEmpty: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <RangeChartMissingTelemetryInteractiveStory />
    </ToastProvider>
  ),
};

// 5. High Density Multi-Shift Temperature Bounds
export const HighDensityMultiShift: Story = {
  args: {
    title: '12-Machine Bearing Operating Temperature Min-Max Range (°C)',
    subtitle: 'Full shop-floor thermal envelope across Shift A, B, and C',
    width: 800,
    height: 440,
    variant: 'interval-bar',
    orientation: 'horizontal',
    unit: ' °C',
    targetLine: { value: 70, label: 'Max Safe Temp (70°C)' },
    data: HIGH_DENSITY_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-PLANT-THERMAL"
      title="12-Machine Bearing Operating Temperature Min-Max Range (°C)"
      subtitle="Full shop-floor thermal envelope across Shift A, B, and C"
      shift="All Shifts (10 Key Machine Drives)"
      kpis={[
        { label: 'Highest Peak Temp', value: '82.0 °C', sub: 'CNC-03 Spindle Outlier', tone: 'critical' },
        { label: 'Warning Threshold Machine', value: 'P-02 Drive (74°C)', sub: 'Oil Cooler Check', tone: 'warning' },
        { label: 'Coolest Operating Drive', value: 'Robot 1 J1 (48°C)', sub: 'Optimal Lubrication', tone: 'success' },
        { label: 'Plant Health Index', value: '80.0% Nominal', sub: '8 of 10 Drives Safe', tone: 'warning' },
      ]}
      uclLimit="70.0 °C (Safe Operating Limit)"
      lclLimit="30.0 °C (Cold Ambient Floor)"
      tableData={HIGH_DENSITY_DATA}
      tableColumns={[
        { key: 'label', label: 'Machine Bearing Point' },
        { key: 'lower', label: 'Min Temp (°C)', align: 'right' },
        { key: 'center', label: 'Mean Temp (°C)', align: 'right' },
        { key: 'upper', label: 'Max Temp (°C)', align: 'right' },
        { key: 'status', label: 'Thermal Health' },
      ]}
    >
      <RangeChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 6. Accessible Direct Labels & Search
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'Stamping Thickness Tolerance Envelope by Raw Material Batch',
    subtitle: 'Interactive search, keyboard navigation, and high-contrast status markers',
    width: 760,
    height: 400,
    variant: 'interval-bar',
    showSearch: true,
    showControls: true,
    unit: ' mm',
    data: ACCESSIBLE_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-THICKNESS-QA"
      title="Stamping Thickness Tolerance Envelope by Raw Material Batch"
      subtitle="Interactive search, keyboard navigation, and high-density data table"
      shift="Shift A (06:00 – 14:00 IST)"
      defaultView="table"
      kpis={[
        { label: 'CRCA 1.2mm Coil', value: '1.18 – 1.22 mm', sub: 'Nominal 1.20 mm', tone: 'success' },
        { label: 'DP600 2.0mm Coil', value: '1.94 – 2.08 mm', sub: 'Gauge Variation Alert', tone: 'warning' },
        { label: 'Aluminum 6061', value: '2.46 – 2.53 mm', sub: 'Tightest Spread (±0.035mm)', tone: 'success' },
        { label: 'Batch Acceptance', value: '100% Accepted', sub: 'All Within Slit Tolerances', tone: 'success' },
      ]}
      uclLimit="Nominal + 5% (Upper Gauge Bound)"
      lclLimit="Nominal - 5% (Lower Gauge Bound)"
      tableData={ACCESSIBLE_DATA}
      tableColumns={[
        { key: 'label', label: 'Coil Material Lot' },
        { key: 'lower', label: 'Min Thickness (mm)', align: 'right' },
        { key: 'center', label: 'Mean Thickness (mm)', align: 'right' },
        { key: 'upper', label: 'Max Thickness (mm)', align: 'right' },
        { key: 'status', label: 'Lot Quality' },
      ]}
    >
      <RangeChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    title: 'Die SMED Range (min)',
    subtitle: 'Current shift',
    width: 340,
    height: 220,
    variant: 'dumbbell',
    showControls: false,
    showSearch: false,
    unit: 'm',
    data: COMPACT_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SMED-MINI"
      title="Die SMED Range (min)"
      subtitle="Current shift"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Line 3 SMED', value: '20 Mins (Best)', sub: 'From 45 Mins Before', tone: 'success' },
        { label: 'Line 2 SMED', value: '35 Mins', sub: 'From 80 Mins Before', tone: 'success' },
        { label: 'Line 1 SMED', value: '28 Mins', sub: 'From 65 Mins Before', tone: 'success' },
        { label: 'SMED Target', value: '< 45 Mins', sub: '100% Lines Met', tone: 'success' },
      ]}
      uclLimit="45 Mins (Max Threshold)"
      lclLimit="15 Mins (Record)"
      tableData={COMPACT_DATA}
      tableColumns={[
        { key: 'label', label: 'Line' },
        { key: 'upper', label: 'Before (min)', align: 'right' },
        { key: 'lower', label: 'After (min)', align: 'right' },
      ]}
    >
      <RangeChart {...args} />
    </EnterpriseChartStoryShell>
  ),
};
