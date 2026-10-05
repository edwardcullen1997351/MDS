import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ScatterPlot, Button, ToastProvider, useToast } from '@ds/react';
import { EnterpriseChartStoryShell, KPIItem } from './components/EnterpriseChartStoryShell';

const meta: Meta<typeof ScatterPlot> = {
  title: 'Data Visualization/ScatterPlot',
  component: ScatterPlot,
  parameters: {
    docs: {
      description: {
        component:
          'ScatterPlot & BubblePlot visualize observation-level correlations, regression trendlines, quadrant classification, and multivariate clustering for Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['scatter', 'bubble', 'connected', 'jittered', 'binned-density'],
    },
    showTrendline: {
      control: 'boolean',
    },
    density: {
      control: 'select',
      options: ['compact', 'standard', 'expanded'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScatterPlot>;

const DEFAULT_DATA = [
  { cuttingSpeed: 120, toolTemp: 48 },
  { cuttingSpeed: 140, toolTemp: 52 },
  { cuttingSpeed: 160, toolTemp: 55 },
  { cuttingSpeed: 180, toolTemp: 59 },
  { cuttingSpeed: 200, toolTemp: 64 },
  { cuttingSpeed: 210, toolTemp: 66 },
  { cuttingSpeed: 230, toolTemp: 71 },
  { cuttingSpeed: 250, toolTemp: 76 },
  { cuttingSpeed: 270, toolTemp: 82 },
  { cuttingSpeed: 290, toolTemp: 87 },
  { cuttingSpeed: 310, toolTemp: 94 },
  { cuttingSpeed: 330, toolTemp: 102 },
  { cuttingSpeed: 350, toolTemp: 110 },
];

const BUBBLE_DATA = [
  { strokesPerMin: 18, peakTonnage: 720, scrapPpm: 12, name: 'Batch 1' },
  { strokesPerMin: 22, peakTonnage: 740, scrapPpm: 18, name: 'Batch 2' },
  { strokesPerMin: 25, peakTonnage: 755, scrapPpm: 24, name: 'Batch 3' },
  { strokesPerMin: 28, peakTonnage: 765, scrapPpm: 32, name: 'Batch 4' },
  { strokesPerMin: 32, peakTonnage: 785, scrapPpm: 65, name: 'Batch 5' },
  { strokesPerMin: 35, peakTonnage: 810, scrapPpm: 110, name: 'Batch 6' },
  { strokesPerMin: 20, peakTonnage: 710, scrapPpm: 15, name: 'Batch 7' },
  { strokesPerMin: 24, peakTonnage: 735, scrapPpm: 20, name: 'Batch 8' },
  { strokesPerMin: 30, peakTonnage: 770, scrapPpm: 45, name: 'Batch 9' },
];

const QUADRANT_DATA = [
  { oee: 92, maintCost: 6.5, name: 'Press P-01 (Komatsu 800T)' },
  { oee: 89, maintCost: 8.2, name: 'Press P-03 (Tandem)' },
  { oee: 94, maintCost: 5.1, name: 'CNC Makino Bay 1' },
  { oee: 76, maintCost: 14.8, name: 'Press P-02 (Aging Schuler)' },
  { oee: 72, maintCost: 12.5, name: 'E-Coat Bath Recirculator' },
  { oee: 81, maintCost: 7.2, name: 'Robotic Weld Cell 2' },
  { oee: 88, maintCost: 11.2, name: 'Laser Blanking Cell' },
];

const HIGH_DENSITY_DATA = Array.from({ length: 60 }, (_, i) => {
  const shift = i < 20 ? 'Shift A' : i < 40 ? 'Shift B' : 'Shift C';
  // Natural multi-shift thermal drift (ambient temperature rises in evening / night shifts)
  const shiftOffset = i < 20 ? 0 : i < 40 ? 0.005 : 0.010;
  const baseDia = 24.988 + (i * 0.0005) + (Math.sin(i * 1.5) * 0.003) + shiftOffset;
  const diameter = +baseDia.toFixed(3);
  const roughness = +(0.26 + (diameter - 24.985) * 6.0 + (Math.cos(i * 2.1) * 0.05)).toFixed(2);
  return { diameter, roughness, shift, partId: `JRNL-${1000 + i}` };
});

const ACCESSIBLE_DATA = [
  { heatInput: 1.2, tensileMpa: 520, operatorGrade: 'Certified Expert' },
  { heatInput: 1.3, tensileMpa: 515, operatorGrade: 'Certified Expert' },
  { heatInput: 1.4, tensileMpa: 530, operatorGrade: 'Certified Expert' },
  { heatInput: 1.1, tensileMpa: 480, operatorGrade: 'Standard Welder' },
  { heatInput: 1.3, tensileMpa: 490, operatorGrade: 'Standard Welder' },
  { heatInput: 1.5, tensileMpa: 475, operatorGrade: 'Standard Welder' },
  { heatInput: 1.0, tensileMpa: 425, operatorGrade: 'Trainee Apprentice' },
  { heatInput: 1.6, tensileMpa: 410, operatorGrade: 'Trainee Apprentice' },
  { heatInput: 1.7, tensileMpa: 395, operatorGrade: 'Trainee Apprentice' },
];

const COMPACT_DATA = [
  { rpm: 4, t: 45 },
  { rpm: 6, t: 55 },
  { rpm: 8, t: 68 },
  { rpm: 10, t: 84 },
];

// 1. Default Baseline Correlation with Trendline
export const Default: Story = {
  args: {
    title: 'Spindle Cutting Speed vs Tool Tip Temperature (°C)',
    subtitle: 'Chakan PL-04 Bay 2 — Linear regression correlation (R² = 0.88)',
    width: 740,
    height: 360,
    variant: 'scatter',
    xKey: 'cuttingSpeed',
    yKey: 'toolTemp',
    xUnit: 'm/min',
    yUnit: '°C',
    xLabel: 'Cutting Surface Speed',
    yLabel: 'Tool Tip Temperature',
    showTrendline: true,
    referenceLines: [
      { y: 90, label: 'Tool Degradation Temp (90°C)', color: '#b91c1c' },
      { x: 300, label: 'Recommended Max Speed (300 m/min)', color: '#b45309' },
    ],
    data: DEFAULT_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-CNC-THERMAL-CORR"
      title="Spindle Cutting Speed vs Tool Tip Temperature (°C)"
      subtitle="Chakan PL-04 Bay 2 — Linear regression correlation (R² = 0.88)"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Correlation Fit (R²)', value: '0.884', sub: 'Strong Thermal Coupling', tone: 'success' },
        { label: 'Max Safe Speed', value: '290 m/min', sub: 'Temp 87°C (Under 90°C)', tone: 'success' },
        { label: 'Thermal Degradation', value: '350 m/min', sub: '110°C Tool Breakdown', tone: 'critical' },
        { label: 'Optimal Operating Range', value: '210–250 m/min', sub: '66–76°C (Balanced)', tone: 'success' },
      ]}
      uclLimit="90.0 °C (Tool Tip Thermal Degradation)"
      lclLimit="45.0 °C (Cold Idle Floor)"
      tableData={DEFAULT_DATA}
      tableColumns={[
        { key: 'cuttingSpeed', label: 'Cutting Speed (m/min)', align: 'right' },
        { key: 'toolTemp', label: 'Tool Tip Temp (°C)', align: 'right' },
      ]}
    >
      <ScatterPlot {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Bubble Variant (3-Variable Sizing)
export const Variants: Story = {
  args: {
    title: 'Press Stroke Speed vs Tonnage vs Rejection Rate (Bubble)',
    subtitle: 'Bubble area represents scrap rate in PPM across 16 stamping batches',
    width: 760,
    height: 380,
    variant: 'bubble',
    xKey: 'strokesPerMin',
    yKey: 'peakTonnage',
    sizeKey: 'scrapPpm',
    xUnit: 'SPM',
    yUnit: 'T',
    sizeUnit: 'PPM',
    xLabel: 'Press Speed',
    yLabel: 'Peak Forming Tonnage',
    minRadius: 5,
    maxRadius: 22,
    data: BUBBLE_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-PRESS-BUBBLE"
      title="Press Stroke Speed vs Tonnage vs Rejection Rate (Bubble)"
      subtitle="Bubble area represents scrap rate in PPM across 9 stamping batches"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Lowest Scrap Batch', value: 'Batch 1 (12 PPM)', sub: '18 SPM @ 720 T', tone: 'success' },
        { label: 'Severe Scrap Spike', value: 'Batch 6 (110 PPM)', sub: '35 SPM @ 810 T (Over-speed)', tone: 'critical' },
        { label: 'Sweet Spot Speed', value: '22–25 SPM', sub: 'Scrap < 25 PPM', tone: 'success' },
        { label: 'Tonnage Cap', value: '780 T', sub: 'Upper Spec Bound', tone: 'warning' },
      ]}
      uclLimit="800 T | 30 SPM (Press Safety Ceiling)"
      lclLimit="700 T | 15 SPM (Minimum Speed)"
      tableData={BUBBLE_DATA}
      tableColumns={[
        { key: 'name', label: 'Stamping Batch' },
        { key: 'strokesPerMin', label: 'Speed (SPM)', align: 'right' },
        { key: 'peakTonnage', label: 'Peak Tonnage (T)', align: 'right' },
        { key: 'scrapPpm', label: 'Scrap (PPM)', align: 'right' },
      ]}
    >
      <ScatterPlot {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Quadrant Lines Decision Matrix
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'Machine Overall Equipment Effectiveness vs Maintenance Cost',
    subtitle: 'Quadrant matrix: High OEE / Low Cost vs Low OEE / High Cost critical machines',
    width: 760,
    height: 380,
    variant: 'scatter',
    xKey: 'oee',
    yKey: 'maintCost',
    xUnit: '%',
    yUnit: '₹L',
    xLabel: 'Machine OEE',
    yLabel: 'Annual Maintenance Cost',
    quadrantLines: {
      x: 85,
      y: 10,
      labels: ['High Cost, Low OEE (Replace)', 'High Cost, High OEE (Critical)', 'Low Cost, Low OEE (Tune)', 'Low Cost, High OEE (Ideal)'],
    },
    data: QUADRANT_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-ASSET-QUADRANT"
      title="Machine Overall Equipment Effectiveness vs Maintenance Cost"
      subtitle="Quadrant matrix: High OEE / Low Cost vs Low OEE / High Cost critical machines"
      shift="Plant Asset Management Review"
      kpis={[
        { label: 'Ideal Machine Cell', value: 'CNC Makino (94% OEE)', sub: '₹5.1 L Maint (Best in Class)', tone: 'success' },
        { label: 'Aging Risk Asset', value: 'Press P-02 (76% OEE)', sub: '₹14.8 L (High Cost / Low OEE)', tone: 'critical' },
        { label: 'Heavy Workhorse', value: 'Laser Blanking (88%)', sub: '₹11.2 L (High OEE / High Cost)', tone: 'warning' },
        { label: 'Plant OEE Mean', value: '84.4%', sub: 'Target 85.0%', tone: 'warning' },
      ]}
      uclLimit="OEE > 85.0% | Cost < ₹10.0 L"
      lclLimit="OEE 70.0% | Cost Floor"
      tableData={QUADRANT_DATA}
      tableColumns={[
        { key: 'name', label: 'Machine Asset' },
        { key: 'oee', label: 'OEE (%)', align: 'right' },
        { key: 'maintCost', label: 'Maint Cost (₹ Lakhs)', align: 'right' },
      ]}
    >
      <ScatterPlot {...args} />
    </EnterpriseChartStoryShell>
  ),
};

const RESTORED_ACOUSTIC_DATA = [
  { cuttingSpeed: 120, toolTemp: 48 },
  { cuttingSpeed: 140, toolTemp: 52 },
  { cuttingSpeed: 180, toolTemp: 59 },
  { cuttingSpeed: 210, toolTemp: 66 },
  { cuttingSpeed: 250, toolTemp: 76 },
  { cuttingSpeed: 290, toolTemp: 87 },
  { cuttingSpeed: 330, toolTemp: 102 },
  { cuttingSpeed: 350, toolTemp: 110 },
];

const ScatterPlotMissingTelemetryInteractiveStory: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('Acoustic DAQ Hub Reconnecting', 'Negotiating high-speed USB/Ethernet link to Mistras 1MHz AE Transducer...');

    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('Acoustic Telemetry Restored', 'Synchronized 8 speed-temperature telemetry scatter points.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('Acoustic Probe Disconnected', 'Simulated piezoelectric sensor lead detachment.');
  };

  const kpis: KPIItem[] = telemetryState === 'restored'
    ? [
        { label: 'Acoustic Sensor', value: 'ONLINE (1 MHz)', sub: 'Piezo Transducer Active', tone: 'success' },
        { label: 'Tool Tip Temp', value: '110 °C Max', sub: 'High-Speed Cut Regime', tone: 'warning' },
        { label: 'Die Acoustic Health', value: 'Nominal (48 dB)', sub: 'Zero Micro-Cracks', tone: 'success' },
        { label: 'Spindle Interlock', value: 'Full Power', sub: '100% Feedrate Armed', tone: 'success' },
      ]
    : [
        { label: 'Acoustic Sensor', value: 'OFFLINE', sub: 'Transducer Replaced', tone: 'critical' },
        { label: 'Last Die Audit', value: '08:45 IST', sub: 'Zero Surface Micro-Cracks', tone: 'success' },
        { label: 'Sample Frequency', value: '1 MHz', sub: 'High-Res Ultrasonic', tone: 'neutral' },
        { label: 'Safety Interlock', value: 'Armed', sub: 'Press Speed Throttled', tone: 'warning' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-ACOUSTIC-NDT"
      title="Stamping Die Acoustic Emission vs Tool Temp Sensor Feed"
      subtitle="Real-time piezoelectric sensor stream and ultrasonic health scatter"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={kpis}
      uclLimit="120 °C (Tool Temp Alarm)"
      lclLimit="40 °C (Ambient Coolant Base)"
      tableData={telemetryState === 'restored' ? RESTORED_ACOUSTIC_DATA : []}
      tableColumns={[
        { key: 'cuttingSpeed', label: 'Cutting Speed (m/min)', align: 'right' },
        { key: 'toolTemp', label: 'Tool Temp (°C)', align: 'right' },
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
                ? 'ACOUSTIC DAQ OFFLINE: Piezoelectric Sensor Bus Unreachable (Probe Swap in Progress)'
                : telemetryState === 'reconnecting'
                ? 'CONNECTING TO SENSOR: Calibrating 1MHz AE preamp on Makino Spindle...'
                : 'ACOUSTIC TELEMETRY ONLINE: High-frequency ultrasonic stream active'}
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

        <ScatterPlot
          title="CNC Cutting Speed vs Tool Temp Scatter"
          subtitle="Real-time acoustic emission and temperature correlation"
          width={680}
          height={300}
          xKey="cuttingSpeed"
          yKey="toolTemp"
          xUnit="m/min"
          yUnit="°C"
          xLabel="Cutting Surface Speed"
          yLabel="Tool Tip Temperature"
          loading={telemetryState === 'reconnecting'}
          emptyMessage="No acoustic telemetry points captured for the active stamping cycle."
          data={telemetryState === 'restored' ? RESTORED_ACOUSTIC_DATA : []}
        />
      </div>
    </EnterpriseChartStoryShell>
  );
};

// 4. Missing Telemetry & Empty State
export const MissingTelemetryAndEmpty: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <ScatterPlotMissingTelemetryInteractiveStory />
    </ToastProvider>
  ),
};

// 5. High Density Multi-Shift Scatter (Thermal Drift Analysis)
export const HighDensityMultiShift: Story = {
  args: {
    title: '60-Part CNC Journal Diameter vs Surface Roughness Multi-Shift Drift',
    subtitle: 'Observations sampled across Shift A, B, and C over 48 hours',
    width: 800,
    height: 380,
    variant: 'scatter',
    xKey: 'diameter',
    yKey: 'roughness',
    categoryKey: 'shift',
    xUnit: 'mm',
    yUnit: 'µm',
    xLabel: 'Journal Diameter',
    yLabel: 'Roughness Ra',
    pointOpacity: 0.75,
    minRadius: 4.5,
    showTrendline: true,
    referenceLines: [
      { x: 25.020, label: 'USL Upper Spec (25.020 mm)', color: '#b91c1c' },
      { y: 0.50, label: 'Max Allowable Roughness (0.50 µm)', color: '#b45309' },
    ],
    series: [
      { key: 'Shift A', label: 'Shift A', color: '#15803D', symbol: 'circle' },
      { key: 'Shift B', label: 'Shift B', color: '#2563eb', symbol: 'diamond' },
      { key: 'Shift C', label: 'Shift C', color: '#b45309', symbol: 'triangle' },
    ],
    data: HIGH_DENSITY_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-HIGH-RES-SCATTER"
      title="60-Part CNC Journal Diameter vs Surface Roughness Multi-Shift Drift"
      subtitle="Observations sampled across Shift A, B, and C over 48 hours"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Shift A Mean', value: '24.995 mm', sub: 'Ra 0.32 µm (Nominal)', tone: 'success' },
        { label: 'Shift B Mean', value: '25.008 mm', sub: 'Ra 0.40 µm (Mild Drift)', tone: 'warning' },
        { label: 'Shift C Drift', value: '25.018 mm', sub: 'Ra 0.46 µm (Thermal Peak)', tone: 'warning' },
        { label: 'Outlier Count', value: '0 Parts', sub: '100% In-Tolerance Sample', tone: 'success' },
      ]}
      uclLimit="25.020 mm | Ra 0.50 µm"
      lclLimit="24.980 mm | Ra 0.20 µm"
      tableData={HIGH_DENSITY_DATA}
      tableColumns={[
        { key: 'partId', label: 'Journal Part ID' },
        { key: 'shift', label: 'Production Shift' },
        { key: 'diameter', label: 'Journal Diameter (mm)', align: 'right' },
        { key: 'roughness', label: 'Roughness Ra (µm)', align: 'right' },
      ]}
    >
      <ScatterPlot {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 6. Accessible Multi-Category Point Glyphs
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'Weld Tensile Strength vs Heat Input by Welding Operator Grade',
    subtitle: 'High-contrast symbols (Circle, Square, Triangle) for WCAG 2.2 AA non-color identification',
    width: 760,
    height: 360,
    variant: 'scatter',
    xKey: 'heatInput',
    yKey: 'tensileMpa',
    categoryKey: 'operatorGrade',
    xUnit: 'kJ/mm',
    yUnit: 'MPa',
    xLabel: 'Weld Heat Input',
    yLabel: 'Tensile Strength',
    series: [
      { key: 'Certified Expert', label: 'Certified Expert (Grade A)', color: '#15803D', symbol: 'circle' },
      { key: 'Standard Welder', label: 'Standard Welder (Grade B)', color: '#2563eb', symbol: 'square' },
      { key: 'Trainee Apprentice', label: 'Trainee Apprentice (Grade C)', color: '#b45309', symbol: 'triangle' },
    ],
    data: ACCESSIBLE_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-WELD-TENSILE"
      title="Weld Tensile Strength vs Heat Input by Welding Operator Grade"
      subtitle="High-contrast symbols for WCAG 2.2 AA non-color identification and tabular fallback"
      shift="Shift A (06:00 – 14:00 IST)"
      defaultView="table"
      kpis={[
        { label: 'Grade A Experts', value: '521.7 MPa avg', sub: 'Heat 1.2–1.4 kJ/mm (Optimal)', tone: 'success' },
        { label: 'Grade B Standard', value: '481.7 MPa avg', sub: 'Passes 420 MPa Spec', tone: 'success' },
        { label: 'Grade C Trainees', value: '410.0 MPa avg', sub: 'Heat Input Too High (1.6+)', tone: 'critical' },
        { label: 'Mandatory Retraining', value: 'Grade C Crew', sub: 'SOP Re-certification Due', tone: 'warning' },
      ]}
      uclLimit="600 MPa | Heat 1.5 kJ/mm"
      lclLimit="420 MPa (Minimum Tensile Spec)"
      tableData={ACCESSIBLE_DATA}
      tableColumns={[
        { key: 'operatorGrade', label: 'Operator Skill Grade' },
        { key: 'heatInput', label: 'Heat Input (kJ/mm)', align: 'right' },
        { key: 'tensileMpa', label: 'Tensile Strength (MPa)', align: 'right' },
      ]}
    >
      <ScatterPlot {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    title: 'RPM vs Temp Scatter',
    subtitle: 'Current line',
    width: 340,
    height: 200,
    xKey: 'rpm',
    yKey: 't',
    xUnit: 'k',
    yUnit: '°',
    density: 'compact',
    showGridX: false,
    showGridY: true,
    data: COMPACT_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-RPM-TEMP"
      title="RPM vs Temp Scatter"
      subtitle="Current line"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Spindle RPM', value: '8,000 RPM', sub: '68 °C Tip Temp', tone: 'success' },
        { label: 'Max Observed', value: '10,000 RPM', sub: '84 °C (Approaching 90°C Cap)', tone: 'warning' },
        { label: 'Coolant Flow', value: '18 L/min', sub: 'High Pressure Jet', tone: 'success' },
        { label: 'Thermal Drift', value: '+1.2 °C/hr', sub: 'Stabilized', tone: 'success' },
      ]}
      uclLimit="90 °C | 12k RPM"
      lclLimit="20 °C | 2k RPM"
      tableData={COMPACT_DATA}
      tableColumns={[
        { key: 'rpm', label: 'Speed (k RPM)', align: 'right' },
        { key: 't', label: 'Temperature (°C)', align: 'right' },
      ]}
    >
      <ScatterPlot {...args} />
    </EnterpriseChartStoryShell>
  ),
};

const CONNECTED_DATA = [
  { hour: 1, toolWear: 0.02, powerDraw: 4.2 },
  { hour: 2, toolWear: 0.05, powerDraw: 4.5 },
  { hour: 3, toolWear: 0.09, powerDraw: 4.9 },
  { hour: 4, toolWear: 0.15, powerDraw: 5.4 },
  { hour: 5, toolWear: 0.22, powerDraw: 6.1 },
  { hour: 6, toolWear: 0.31, powerDraw: 7.0 },
  { hour: 7, toolWear: 0.44, powerDraw: 8.3 },
  { hour: 8, toolWear: 0.60, powerDraw: 10.1 },
];

// 8. Connected Scatter Trajectory (Evolution over Time)
export const ConnectedTrajectory: Story = {
  args: {
    title: 'CNC Tool Wear vs Spindle Power Draw Trajectory Over Shift',
    subtitle: 'Connected scatter path tracks wear progression across an 8-hour continuous milling cycle',
    width: 760,
    height: 360,
    variant: 'connected',
    xKey: 'toolWear',
    yKey: 'powerDraw',
    xUnit: 'mm',
    yUnit: 'kW',
    xLabel: 'Tool Flank Wear',
    yLabel: 'Spindle Power Draw',
    referenceLines: [
      { x: 0.40, label: 'Warning Wear Threshold (0.40 mm)', color: '#b45309' },
      { y: 8.5, label: 'Critical Power Draw (8.5 kW)', color: '#b91c1c' },
    ],
    data: CONNECTED_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-TOOL-TRAJECTORY"
      title="CNC Tool Wear vs Spindle Power Draw Trajectory Over Shift"
      subtitle="Connected scatter path tracks wear progression across an 8-hour continuous milling cycle"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Initial Draw (Hr 1)', value: '4.2 kW', sub: 'Wear: 0.02 mm (Sharp)', tone: 'success' },
        { label: 'Current State (Hr 8)', value: '10.1 kW', sub: 'Wear: 0.60 mm (Dull)', tone: 'critical' },
        { label: 'Degradation Rate', value: '+0.08 mm/hr', sub: 'Accelerating after Hr 5', tone: 'warning' },
        { label: 'Recommended Action', value: 'Tool Swap', sub: 'Exceeded 0.40 mm limit', tone: 'critical' },
      ]}
      uclLimit="0.50 mm Flank Wear | 9.0 kW"
      lclLimit="0.00 mm | 3.5 kW Idle"
      tableData={CONNECTED_DATA}
      tableColumns={[
        { key: 'hour', label: 'Shift Hour', align: 'right' },
        { key: 'toolWear', label: 'Flank Wear (mm)', align: 'right' },
        { key: 'powerDraw', label: 'Power Draw (kW)', align: 'right' },
      ]}
    >
      <ScatterPlot {...args} />
    </EnterpriseChartStoryShell>
  ),
};

const BINNED_DATA = Array.from({ length: 80 }, (_, i) => {
  const feedrate = 150 + ((i * 17) % 250);
  const vibration = +(0.8 + ((feedrate - 150) / 250) * 3.5 + (((i * 29) % 30) - 15) * 0.08).toFixed(2);
  return { feedrate, vibration };
});

// 9. Binned Density Scatter for High-Volume Telemetry
export const BinnedDensity: Story = {
  args: {
    title: 'Spindle Feedrate vs Vibration Amplitude 2D Density Heatmap',
    subtitle: 'Aggregated 2D density bins visualize dense telemetry clustering and operational sweet spots',
    width: 760,
    height: 360,
    variant: 'binned-density',
    xKey: 'feedrate',
    yKey: 'vibration',
    xUnit: 'mm/min',
    yUnit: 'mm/s',
    xLabel: 'Axis Feedrate',
    yLabel: 'Vibration RMS',
    binSize: 28,
    data: BINNED_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-DENSITY-VIBRATION"
      title="Spindle Feedrate vs Vibration Amplitude 2D Density Heatmap"
      subtitle="Aggregated 2D density bins visualize dense telemetry clustering and operational sweet spots"
      shift="Continuous Multi-Batch Monitoring"
      kpis={[
        { label: 'Total Telemetry Points', value: '80 Obs', sub: 'Sampled at 100 Hz', tone: 'neutral' },
        { label: 'Primary Cluster Feed', value: '220–280 mm/min', sub: '1.8–2.6 mm/s (Optimal)', tone: 'success' },
        { label: 'High Vibration Tail', value: '380+ mm/min', sub: '4.2+ mm/s (Harmonic Resonance)', tone: 'warning' },
        { label: 'Vibration Cap (ISO 10816)', value: '4.5 mm/s', sub: 'Class II Industrial Machinery', tone: 'critical' },
      ]}
      uclLimit="4.50 mm/s (ISO Warning Limit)"
      lclLimit="0.50 mm/s (Quiescent Floor)"
      tableData={BINNED_DATA.slice(0, 10)}
      tableColumns={[
        { key: 'feedrate', label: 'Feedrate (mm/min)', align: 'right' },
        { key: 'vibration', label: 'Vibration RMS (mm/s)', align: 'right' },
      ]}
    >
      <ScatterPlot {...args} />
    </EnterpriseChartStoryShell>
  ),
};
