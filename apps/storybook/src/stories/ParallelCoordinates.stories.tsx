import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ParallelCoordinates, Button, ToastProvider, useToast } from '@ds/react';
import { EnterpriseChartStoryShell, KPIItem } from './components/EnterpriseChartStoryShell';

const meta: Meta<typeof ParallelCoordinates> = {
  title: 'Data Visualization/ParallelCoordinates',
  component: ParallelCoordinates,
  parameters: {
    docs: {
      description: {
        component:
          'ParallelCoordinates visualizes high-dimensional multi-sensor operational profiles, stamping quality trade-offs, and multivariate batch clustering for Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['standard', 'normalized', 'spline', 'brushed'],
    },
    smooth: {
      control: 'boolean',
    },
    normalized: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ParallelCoordinates>;

const DIMENSIONS = [
  { key: 'spindleRpm', label: 'Spindle Speed (RPM)', unit: ' RPM', min: 4000, max: 12000 },
  { key: 'feedRate', label: 'Feed Rate (mm/min)', unit: ' mm/m', min: 200, max: 1200 },
  { key: 'toolTemp', label: 'Tool Tip Temp (°C)', unit: ' °C', min: 40, max: 120 },
  { key: 'vibrationRms', label: 'Vibration (mm/s)', unit: ' mm/s', min: 0.5, max: 5.0 },
  { key: 'surfaceRa', label: 'Surface Ra (µm)', unit: ' µm', min: 0.2, max: 1.6 },
  { key: 'cycleTime', label: 'Cycle Time (s)', unit: ' s', min: 30, max: 90 },
];

const SAMPLE_BATCH_DATA = [
  { id: 'B-101', label: 'Batch 101 (Optimal)', cluster: 'Nominal', spindleRpm: 8200, feedRate: 650, toolTemp: 62, vibrationRms: 1.2, surfaceRa: 0.38, cycleTime: 42 },
  { id: 'B-102', label: 'Batch 102 (Optimal)', cluster: 'Nominal', spindleRpm: 8400, feedRate: 680, toolTemp: 65, vibrationRms: 1.4, surfaceRa: 0.42, cycleTime: 40 },
  { id: 'B-103', label: 'Batch 103 (Optimal)', cluster: 'Nominal', spindleRpm: 8000, feedRate: 620, toolTemp: 59, vibrationRms: 1.1, surfaceRa: 0.35, cycleTime: 45 },
  { id: 'B-104', label: 'Batch 104 (High Feed)', cluster: 'Aggressive', spindleRpm: 10500, feedRate: 1100, toolTemp: 98, vibrationRms: 3.8, surfaceRa: 0.95, cycleTime: 32 },
  { id: 'B-105', label: 'Batch 105 (High Feed)', cluster: 'Aggressive', spindleRpm: 11200, feedRate: 1150, toolTemp: 105, vibrationRms: 4.2, surfaceRa: 1.10, cycleTime: 30 },
  { id: 'B-106', label: 'Batch 106 (Worn Tool)', cluster: 'Degraded', spindleRpm: 7500, feedRate: 450, toolTemp: 112, vibrationRms: 4.6, surfaceRa: 1.45, cycleTime: 65 },
  { id: 'B-107', label: 'Batch 107 (Worn Tool)', cluster: 'Degraded', spindleRpm: 7200, feedRate: 420, toolTemp: 118, vibrationRms: 4.8, surfaceRa: 1.55, cycleTime: 68 },
  { id: 'B-108', label: 'Batch 108 (Eco Cut)', cluster: 'Conservative', spindleRpm: 5500, feedRate: 350, toolTemp: 48, vibrationRms: 0.8, surfaceRa: 0.28, cycleTime: 82 },
];

const HIGH_DENSITY_BATCH_DATA = Array.from({ length: 40 }, (_, i) => {
  const isNight = i % 3 === 2;
  const baseRpm = isNight ? 7600 : 8300;
  return {
    id: `B-${200 + i}`,
    label: `Batch ${200 + i} (${isNight ? 'Shift C' : 'Shift A/B'})`,
    cluster: isNight ? 'Night Drift' : 'Day Normal',
    spindleRpm: Math.round(baseRpm + (((i * 17) % 800) - 400)),
    feedRate: Math.round(620 + (((i * 11) % 120) - 60)),
    toolTemp: Math.round((isNight ? 78 : 62) + (((i * 5) % 10) - 5)),
    vibrationRms: +(1.2 + (isNight ? 0.8 : 0.2) + ((i % 4) * 0.1)).toFixed(2),
    surfaceRa: +(0.4 + (isNight ? 0.25 : 0.05) + ((i % 3) * 0.03)).toFixed(2),
    cycleTime: Math.round(42 + (((i * 7) % 6) - 3)),
  };
});

// 1. Default Baseline Story
export const Default: Story = {
  args: {
    title: 'CNC Machining Multivariate Parameter Telemetry',
    subtitle: 'Chakan PL-04 Bay 2 — Multi-axis correlation between speed, feed, temperature, vibration, and Ra finish',
    width: 860,
    height: 420,
    dimensions: DIMENSIONS,
    data: SAMPLE_BATCH_DATA,
    colorKey: 'cluster',
    variant: 'standard',
    showControls: true,
    showSearch: true,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-CNC-MULTIVAR"
      title="CNC Machining Multivariate Parameter Telemetry"
      subtitle="Chakan PL-04 Bay 2 — Multi-axis correlation between speed, feed, temperature, vibration, and Ra finish"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Nominal Batches', value: '3 Batches', sub: 'Ra 0.35–0.42 µm (Pass)', tone: 'success' },
        { label: 'Aggressive Cuts', value: '2 Batches', sub: 'Cycle 30s (Temp 105°C)', tone: 'warning' },
        { label: 'Worn Tool Alarm', value: '2 Batches', sub: 'Vibration > 4.5 mm/s', tone: 'critical' },
        { label: 'Optimal Window', value: '8,200 RPM', sub: 'Feed 650 mm/min', tone: 'success' },
      ]}
      uclLimit="Vib < 3.5 mm/s | Ra < 0.80 µm"
      lclLimit="Spindle > 6,000 RPM | Feed > 400 mm/min"
      tableData={SAMPLE_BATCH_DATA}
      tableColumns={[
        { key: 'id', label: 'Batch ID' },
        { key: 'cluster', label: 'Operational Profile' },
        { key: 'spindleRpm', label: 'Speed (RPM)', align: 'right' },
        { key: 'feedRate', label: 'Feed (mm/min)', align: 'right' },
        { key: 'toolTemp', label: 'Temp (°C)', align: 'right' },
        { key: 'vibrationRms', label: 'Vib (mm/s)', align: 'right' },
        { key: 'surfaceRa', label: 'Finish Ra (µm)', align: 'right' },
      ]}
    >
      <ParallelCoordinates {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Normalized Spline Variant
export const Variants: Story = {
  args: {
    title: 'Normalized Spline Multi-Parametric Process Signature',
    subtitle: 'Smoothed bezier trajectories with 0-100% min-max scaling for cross-metric comparison',
    width: 860,
    height: 420,
    dimensions: DIMENSIONS,
    data: SAMPLE_BATCH_DATA,
    colorKey: 'cluster',
    variant: 'spline',
    smooth: true,
    normalized: true,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SPLINE-PARAM"
      title="Normalized Spline Multi-Parametric Process Signature"
      subtitle="Smoothed bezier trajectories with 0-100% min-max scaling for cross-metric comparison"
      shift="Shift A & B (06:00 – 22:00 IST)"
      kpis={[
        { label: 'Normalized Profile', value: '0 – 100% Bounds', sub: 'Dimensionless Scaling', tone: 'neutral' },
        { label: 'Thermal Envelope', value: '40 – 120 °C', sub: 'Tip Temperature Axis', tone: 'warning' },
        { label: 'Vibration Axis', value: '0.5 – 5.0 mm/s', sub: 'RMS Velocity Scale', tone: 'critical' },
        { label: 'Profile Coherence', value: '94.2%', sub: 'Cluster Repeatability', tone: 'success' },
      ]}
      uclLimit="100% (Normalized Axis Ceiling)"
      lclLimit="0% (Normalized Axis Floor)"
      tableData={SAMPLE_BATCH_DATA}
      tableColumns={[
        { key: 'id', label: 'Batch' },
        { key: 'cluster', label: 'Cluster' },
        { key: 'spindleRpm', label: 'RPM', align: 'right' },
        { key: 'feedRate', label: 'Feed', align: 'right' },
        { key: 'vibrationRms', label: 'Vibration', align: 'right' },
        { key: 'surfaceRa', label: 'Ra', align: 'right' },
      ]}
    >
      <ParallelCoordinates {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Threshold and Process Outlier Envelope
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'Process Window Tolerance Boundaries & Anomaly Detection',
    subtitle: 'Batch profiles breaching vibration (>3.5 mm/s) or surface roughness (>0.8 µm)',
    width: 860,
    height: 420,
    dimensions: DIMENSIONS,
    data: SAMPLE_BATCH_DATA,
    colorKey: 'cluster',
    variant: 'brushed',
    showBrushControls: true,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-ANOMALY-DETECTION"
      title="Process Window Tolerance Boundaries & Anomaly Detection"
      subtitle="Batch profiles breaching vibration (>3.5 mm/s) or surface roughness (>0.8 µm)"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Outlier Batches', value: '2 Batches (25%)', sub: 'B-106 & B-107 (Worn Tool)', tone: 'critical' },
        { label: 'High Vibration Flag', value: '4.8 mm/s Peak', sub: 'Exceeds 3.5 mm/s Guard', tone: 'critical' },
        { label: 'Surface Finish Alarm', value: '1.55 µm Peak', sub: 'USL Spec 0.80 µm', tone: 'critical' },
        { label: 'Recommended Action', value: 'Replace Tool Inserts', sub: 'Auto-Hold On Cell 2', tone: 'warning' },
      ]}
      uclLimit="Vib 3.5 mm/s | Ra 0.80 µm (Upper Spec Guard)"
      lclLimit="Vib 0.5 mm/s | Ra 0.20 µm"
      tableData={SAMPLE_BATCH_DATA}
      tableColumns={[
        { key: 'id', label: 'Batch ID' },
        { key: 'cluster', label: 'Status' },
        { key: 'vibrationRms', label: 'Vib RMS (mm/s)', align: 'right' },
        { key: 'surfaceRa', label: 'Finish Ra (µm)', align: 'right' },
        { key: 'toolTemp', label: 'Temp (°C)', align: 'right' },
      ]}
    >
      <ParallelCoordinates {...args} />
    </EnterpriseChartStoryShell>
  ),
};

const RESTORED_PARALLEL_DATA = [
  { id: 'B-101', label: 'Batch 101 (Optimal)', cluster: 'Nominal', spindleRpm: 8200, feedRate: 650, toolTemp: 62, vibrationRms: 1.2, surfaceRa: 0.38, cycleTime: 42 },
  { id: 'B-102', label: 'Batch 102 (Optimal)', cluster: 'Nominal', spindleRpm: 8400, feedRate: 680, toolTemp: 65, vibrationRms: 1.4, surfaceRa: 0.42, cycleTime: 40 },
  { id: 'B-103', label: 'Batch 103 (Optimal)', cluster: 'Nominal', spindleRpm: 8000, feedRate: 620, toolTemp: 59, vibrationRms: 1.1, surfaceRa: 0.35, cycleTime: 45 },
  { id: 'B-104', label: 'Batch 104 (High Feed)', cluster: 'Aggressive', spindleRpm: 10500, feedRate: 1100, toolTemp: 98, vibrationRms: 3.8, surfaceRa: 0.95, cycleTime: 32 },
];

const ParallelCoordinatesMissingTelemetryInteractiveStory: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('Multivariate Buffer Syncing', 'Polling Line 6 high-speed ring buffer over Profinet 100 Mbps...');

    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('Multivariate Telemetry Synchronized', 'Restored 4 observation vectors across 6 sensor dimensions.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('Logger Bus Timeout', 'Simulated Profinet packet timeout on Line 6 FIFO buffer.');
  };

  const kpis: KPIItem[] = telemetryState === 'restored'
    ? [
        { label: 'Buffer Status', value: 'SYNCED (4 Batches)', sub: 'Continuous 100 Hz Logging', tone: 'success' },
        { label: 'Spindle Peak RPM', value: '10,500 RPM', sub: 'Batch 104 High Feed', tone: 'warning' },
        { label: 'Vibration Max', value: '3.8 mm/s', sub: 'Within 5.0 mm/s Limit', tone: 'success' },
        { label: 'Surface Finish', value: '0.35–0.95 µm', sub: 'Average Ra 0.52 µm', tone: 'success' },
      ]
    : [
        { label: 'Buffer Status', value: 'EMPTY (0 / 1024)', sub: 'Awaiting Batch Trigger', tone: 'critical' },
        { label: 'Dimension Channels', value: '6 Telemetry Axes', sub: 'Sensors Armed', tone: 'neutral' },
        { label: 'Sampling Rate', value: '100 Hz', sub: 'Synchronous Capture', tone: 'neutral' },
        { label: 'Link Quality', value: 'Offline', sub: 'Profinet Bus Timeout', tone: 'warning' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-LOGGER-LINE6"
      title="Line 6 High-Speed Stamping Multivariate Logger"
      subtitle="Multivariate 6-axis correlation vectors across recent batches"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={kpis}
      uclLimit="100% Vector Capacity"
      lclLimit="0"
      tableData={telemetryState === 'restored' ? RESTORED_PARALLEL_DATA : []}
      tableColumns={[
        { key: 'id', label: 'Batch ID' },
        { key: 'cluster', label: 'Profile' },
        { key: 'spindleRpm', label: 'RPM', align: 'right' },
        { key: 'toolTemp', label: 'Temp (°C)', align: 'right' },
        { key: 'vibrationRms', label: 'Vib (mm/s)', align: 'right' },
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
                ? 'MULTIVARIATE BUFFER OFFLINE: Ring buffer empty / awaiting DAQ trigger packet'
                : telemetryState === 'reconnecting'
                ? 'SYNCING BUFFER: Retrieving 6-axis synchronous vectors from FIFO queue...'
                : 'MULTIVARIATE TELEMETRY ONLINE: 4 observation vectors active'}
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

        <ParallelCoordinates
          title="Line 6 High-Speed Stamping Multivariate Logger"
          subtitle="Multivariate 6-axis correlation vectors across recent batches"
          width={760}
          height={340}
          dimensions={DIMENSIONS}
          data={telemetryState === 'restored' ? RESTORED_PARALLEL_DATA : []}
        />
      </div>
    </EnterpriseChartStoryShell>
  );
};

// 4. Missing Telemetry & Empty State
export const MissingTelemetryAndEmpty: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <ParallelCoordinatesMissingTelemetryInteractiveStory />
    </ToastProvider>
  ),
};

// 5. High Density Multi-Shift Batch Runs
export const HighDensityMultiShift: Story = {
  args: {
    title: '40-Batch Multi-Shift Multivariate Trace (Shift A, B, C)',
    subtitle: 'High density clustering revealing night-shift thermal drift patterns',
    width: 880,
    height: 440,
    dimensions: DIMENSIONS,
    smooth: false,
    colorKey: 'cluster',
    data: HIGH_DENSITY_BATCH_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-40BATCH-TRACE"
      title="40-Batch Multi-Shift Multivariate Trace (Shift A, B, C)"
      subtitle="High density clustering revealing night-shift thermal drift patterns"
      shift="All Shifts (40-Batch Population)"
      kpis={[
        { label: 'Total Batches', value: '40 Lots', sub: 'Sampled Over 72 Hours', tone: 'success' },
        { label: 'Night Drift Cluster', value: '13 Batches', sub: 'Temp +16°C Higher (Shift C)', tone: 'warning' },
        { label: 'Day Nominal Cluster', value: '27 Batches', sub: 'Repeatable Envelope', tone: 'success' },
        { label: 'Mean Surface Ra', value: '0.48 µm', sub: 'Nominal Spec Met', tone: 'success' },
      ]}
      uclLimit="Ra 0.80 µm | Temp 100°C"
      lclLimit="Ra 0.20 µm | Temp 40°C"
      tableData={HIGH_DENSITY_BATCH_DATA.slice(0, 10)}
      tableColumns={[
        { key: 'id', label: 'Batch ID' },
        { key: 'cluster', label: 'Shift Group' },
        { key: 'spindleRpm', label: 'RPM', align: 'right' },
        { key: 'toolTemp', label: 'Temp (°C)', align: 'right' },
        { key: 'vibrationRms', label: 'Vib (mm/s)', align: 'right' },
        { key: 'surfaceRa', label: 'Ra (µm)', align: 'right' },
      ]}
    >
      <ParallelCoordinates {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 6. Accessible Table and Searchable Filter
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'Stamping Press Multivariate Parameter Verification',
    subtitle: 'Press Alt+F11 or click Table toggle to inspect full numerical data matrix',
    width: 860,
    height: 420,
    dimensions: DIMENSIONS,
    data: SAMPLE_BATCH_DATA,
    colorKey: 'cluster',
    showSearch: true,
    showControls: true,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-ACCESSIBLE-PC"
      title="Stamping Press Multivariate Parameter Verification"
      subtitle="Accessible multivariate parallel coordinates with high-density data table"
      shift="Shift A (06:00 – 14:00 IST)"
      defaultView="table"
      kpis={[
        { label: 'Optimal Batches', value: 'B-101 to B-103', sub: 'Nominal Speed & Finish', tone: 'success' },
        { label: 'Eco Cut Mode', value: 'B-108 (5.5k RPM)', sub: 'Lowest Ra 0.28 µm', tone: 'success' },
        { label: 'Fastest Cycle', value: '30s (B-105)', sub: 'High Feed 1,150 mm/min', tone: 'warning' },
        { label: 'Batch Compliance', value: '75.0% Pass', sub: '6 of 8 In Process Window', tone: 'success' },
      ]}
      uclLimit="Tolerance Envelope Window (100%)"
      lclLimit="0%"
      tableData={SAMPLE_BATCH_DATA}
      tableColumns={[
        { key: 'id', label: 'Batch ID' },
        { key: 'cluster', label: 'Cluster Profile' },
        { key: 'spindleRpm', label: 'Speed (RPM)', align: 'right' },
        { key: 'feedRate', label: 'Feed (mm/min)', align: 'right' },
        { key: 'toolTemp', label: 'Tip Temp (°C)', align: 'right' },
        { key: 'vibrationRms', label: 'Vib (mm/s)', align: 'right' },
        { key: 'surfaceRa', label: 'Surface Ra (µm)', align: 'right' },
        { key: 'cycleTime', label: 'Cycle Time (s)', align: 'right' },
      ]}
    >
      <ParallelCoordinates {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    title: 'Live CNC Telemetry Vector',
    subtitle: 'Key 4-axis profile',
    width: 440,
    height: 240,
    showControls: false,
    showSearch: false,
    dimensions: [
      { key: 'spindleRpm', label: 'RPM', unit: '', min: 4000, max: 12000 },
      { key: 'toolTemp', label: 'Temp', unit: '°C', min: 40, max: 120 },
      { key: 'vibrationRms', label: 'Vib', unit: 'mm/s', min: 0.5, max: 5.0 },
      { key: 'surfaceRa', label: 'Ra', unit: 'µm', min: 0.2, max: 1.6 },
    ],
    data: SAMPLE_BATCH_DATA.slice(0, 4),
    colorKey: 'cluster',
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-CNC-MINI"
      title="Live CNC Telemetry Vector"
      subtitle="Key 4-axis profile"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Active Cut Profile', value: 'B-101 (Nominal)', sub: '8,200 RPM', tone: 'success' },
        { label: 'Spindle Vib', value: '1.2 mm/s', sub: 'Nominal Good', tone: 'success' },
        { label: 'Tip Temp', value: '62 °C', sub: 'Coolant Flow OK', tone: 'success' },
        { label: 'Surface Ra', value: '0.38 µm', sub: 'Spec 0.80 µm', tone: 'success' },
      ]}
      uclLimit="Vib < 3.5 mm/s | Ra < 0.80 µm"
      lclLimit="Floor Zero"
      tableData={SAMPLE_BATCH_DATA.slice(0, 4)}
      tableColumns={[
        { key: 'id', label: 'Batch' },
        { key: 'spindleRpm', label: 'RPM', align: 'right' },
        { key: 'toolTemp', label: 'Temp (°C)', align: 'right' },
        { key: 'vibrationRms', label: 'Vib (mm/s)', align: 'right' },
      ]}
    >
      <ParallelCoordinates {...args} />
    </EnterpriseChartStoryShell>
  ),
};
