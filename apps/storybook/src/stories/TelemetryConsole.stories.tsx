import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TelemetryConsole, LineChart, BarChart, AreaChart, ScatterPlot } from '@ds/react';

const meta: Meta<typeof TelemetryConsole> = {
  title: 'Composites/TelemetryConsole',
  component: TelemetryConsole,
  parameters: {
    docs: {
      description: {
        component:
          'TelemetryConsole is a Tier 3 Composite Component providing an enterprise-grade industrial monitoring shell with station metadata, live pulse status, a 4-metric KPI strip, operational time/shift toolbar, instant dual chart/table accessibility toggle, and control limit status footers.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TelemetryConsole>;

const sampleTelemetryData = [
  { time: '06:00', val: 180, powerKVA: 180, temp: 42.1, status: 'Optimal' },
  { time: '08:00', val: 380, powerKVA: 380, temp: 58.4, status: 'Optimal' },
  { time: '10:00', val: 425, powerKVA: 425, temp: 74.2, status: 'Warning' },
  { time: '12:00', val: 340, powerKVA: 340, temp: 62.0, status: 'Optimal' },
  { time: '14:00', val: 395, powerKVA: 395, temp: 68.5, status: 'Optimal' },
  { time: '16:00', val: 440, powerKVA: 440, temp: 82.1, status: 'Warning' },
  { time: '18:00', val: 375, powerKVA: 375, temp: 65.0, status: 'Optimal' },
  { time: '20:00', val: 210, powerKVA: 210, temp: 48.0, status: 'Optimal' },
  { time: '22:00', val: 160, powerKVA: 160, temp: 44.0, status: 'Optimal' },
];

// 1. Default Baseline Story
export const Default: Story = {
  render: () => (
    <TelemetryConsole
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SUB-33KV"
      title="Main 33kV Substation Gross Energy Telemetry"
      subtitle="Shift A & B Continuous Demand Load Monitoring"
      shift="Shift A (06:00 – 14:00 IST)"
      supervisor="Sandeep Kulkarni"
      uclLimit="450 kVA (Contract Cap)"
      lclLimit="120 kVA (Base Standby)"
      kpis={[
        { label: 'Current Demand', value: '425 kVA', sub: 'Nominal Range', tone: 'success' },
        { label: 'Shift Peak', value: '440 kVA', sub: '16:00 IST', tone: 'warning' },
        { label: 'Shift Average', value: '382 kVA', sub: 'Within Budget', tone: 'success' },
        { label: 'UCL Limit', value: '450 kVA', sub: 'Threshold Alert', tone: 'critical' },
      ]}
      tableData={sampleTelemetryData}
      tableColumns={[
        { key: 'time', label: 'TIMESTAMP (IST)' },
        { key: 'powerKVA', label: 'POWER DRAW (kVA)', align: 'right' },
        { key: 'temp', label: 'XFMR TEMP (°C)', align: 'right' },
        { key: 'status', label: 'GRID QUALITY' },
      ]}
    >
      <AreaChart
        data={sampleTelemetryData}
        xKey="time"
        yKey="powerKVA"
        width={760}
        height={300}
        xUnit="IST"
        yUnit=" kVA"
        curve="monotone"
        referenceLines={[{ y: 450, label: 'Demand Cap (450 kVA)', color: '#b91c1c' }]}
      />
    </TelemetryConsole>
  ),
};

// 2. Compact Card Widget Variant
export const CompactCardWidget: Story = {
  render: () => (
    <div style={{ maxWidth: '520px' }}>
      <TelemetryConsole
        compact
        stationEyebrow="Suryodaya Autocomp Ltd · PL-04"
        stationId="CELL-CNC-02"
        title="Spindle Load Telemetry"
        subtitle="3-Column Dashboard Tile"
        shift="Shift A (IST)"
        supervisor="Meera Nair"
        uclLimit="85.0 kW"
        lclLimit="15.0 kW"
        kpis={[
          { label: 'Current', value: '68.4 kW', sub: 'Nominal', tone: 'success' },
          { label: 'UCL Cap', value: '85.0 kW', sub: 'Alarm', tone: 'critical' },
        ]}
        tableData={sampleTelemetryData}
      >
        <LineChart
          data={sampleTelemetryData}
          xKey="time"
          yKey="val"
          unit=" kW"
          interpolation="monotone"
        />
      </TelemetryConsole>
    </div>
  ),
};

// 3. Threshold Breach State
export const ThresholdBreachState: Story = {
  render: () => (
    <TelemetryConsole
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-CNC-04-VIB"
      title="5-Axis Spindle Vibration RMS Continuous Telemetry"
      subtitle="ISO 10816-3 Machine Condition Vibration Profile — UCL Breach Warning"
      shift="Shift A (06:00 – 14:00 IST)"
      supervisor="Vikram Bhosale"
      uclLimit="4.50 mm/s (Alarm Trip)"
      lclLimit="0.00 mm/s (Ideal Base)"
      kpis={[
        { label: 'Current RMS', value: '4.82 mm/s', sub: 'Zone D Critical Breach', tone: 'critical' },
        { label: 'Peak Transient', value: '5.10 mm/s', sub: 'Exceeds UCL Trip', tone: 'critical' },
        { label: 'Warning Limit', value: '2.80 mm/s', sub: 'Zone C Warning', tone: 'warning' },
        { label: 'Trip Limit', value: '4.50 mm/s', sub: 'Mandatory Stop', tone: 'critical' },
      ]}
      tableData={[
        { time: '13:30', val: 2.14, status: 'Optimal' },
        { time: '13:45', val: 3.40, status: 'Warning' },
        { time: '14:00', val: 4.82, status: 'Critical' },
        { time: '14:15', val: 5.10, status: 'Critical' },
      ]}
    >
      <LineChart
        data={[
          { time: '13:30', val: 2.14 },
          { time: '13:45', val: 3.40 },
          { time: '14:00', val: 4.82 },
          { time: '14:15', val: 5.10 },
        ]}
        xKey="time"
        yKey="val"
        unit=" mm/s"
        interpolation="monotone"
        referenceLines={[{ value: 4.5, label: 'Trip Limit (4.5 mm/s)', tone: 'danger' }]}
      />
    </TelemetryConsole>
  ),
};

// 4. Empty & Sensor Dropout State
export const EmptyDegradedTelemetry: Story = {
  render: () => (
    <TelemetryConsole
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-PRESS-08-OFFLINE"
      title="Press Line 08 Hydraulic Tonnage Sensor Telemetry"
      subtitle="Sensor Communication Dropout — Standby Mode"
      shift="Shift C (22:00 – 06:00 IST)"
      supervisor="Priya Iyer"
      uclLimit="800 T"
      lclLimit="0 T"
      kpis={[
        { label: 'Telemetry Status', value: 'NO SIGNAL', sub: 'PLC Gateway Timeout', tone: 'critical' },
        { label: 'Last Reading', value: '0 T', sub: '22:15 IST', tone: 'neutral' },
        { label: 'Shift Total', value: '0 units', sub: 'Line Inactive', tone: 'neutral' },
        { label: 'Health Flag', value: 'OFFLINE', sub: 'Investigate SCADA', tone: 'critical' },
      ]}
      tableData={[]}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '280px',
          background: 'var(--surface-sunken, #f8fafc)',
          borderRadius: '8px',
          border: '1px dashed var(--border-hairline, #cbd5e1)',
          color: 'var(--text-secondary, #64748b)',
        }}
      >
        <span style={{ fontSize: '28px', marginBottom: '8px' }}>📡</span>
        <strong style={{ color: 'var(--text-primary, #0f172a)', fontSize: '14px' }}>
          No Sensor Telemetry Received
        </strong>
        <p style={{ margin: '4px 0 0', fontSize: '12px' }}>
          PLC node CELL-PRESS-08 did not respond to polling request. Check Ethernet link.
        </p>
      </div>
    </TelemetryConsole>
  ),
};

// 5. High-Density Multi-Shift Telemetry
export const HighDensityMultiShift: Story = {
  render: () => (
    <TelemetryConsole
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-STAMP-LINE"
      title="Press Shop 24-Hour Continuous Output Telemetry"
      subtitle="Shift A, Shift B & Shift C Comparative Run"
      shift="Full 24-Hour Cycle (IST)"
      supervisor="Shalini Rao"
      uclLimit="450 pcs/hr"
      lclLimit="100 pcs/hr"
      kpis={[
        { label: '24h Total', value: '8,420 pcs', sub: '98.2% Plan', tone: 'success' },
        { label: 'Peak Rate', value: '410 pcs/hr', sub: 'Shift B Record', tone: 'success' },
        { label: 'Shift A Rate', value: '380 pcs/hr', sub: 'On Target', tone: 'success' },
        { label: 'Shift C Rate', value: '310 pcs/hr', sub: 'Maintenance PM', tone: 'warning' },
      ]}
      tableData={sampleTelemetryData}
    >
      <BarChart
        data={sampleTelemetryData}
        categoryKey="time"
        valueKey="val"
        width={760}
        height={300}
      />
    </TelemetryConsole>
  ),
};

// 6. Accessible High-Density Data Table View
export const AccessibleDataTableView: Story = {
  render: () => (
    <TelemetryConsole
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-STAMP-LINE"
      title="Press Shop Production Output by Machine Line"
      subtitle="Accessible High-Density Tabular Audit View (Default Table Mode)"
      shift="Shift B (14:00 – 22:00 IST)"
      defaultView="table"
      tableData={sampleTelemetryData}
      tableColumns={[
        { key: 'time', label: 'SHIFT HOUR (IST)' },
        { key: 'powerKVA', label: 'TOTAL UNITS PRODUCED', align: 'right' },
        { key: 'temp', label: 'RAM HYDRAULIC TEMP (°C)', align: 'right' },
        { key: 'status', label: 'QC DISPOSITION STATUS' },
      ]}
    >
      <BarChart
        data={sampleTelemetryData}
        categoryKey="time"
        valueKey="val"
        width={760}
        height={300}
      />
    </TelemetryConsole>
  ),
};

// 7. Multi-Metric Correlation Console
export const MultiMetricCorrelation: Story = {
  render: () => {
    const correlationData = [
      { speed: 1200, temp: 45, vibration: 0.8 },
      { speed: 1800, temp: 52, vibration: 1.2 },
      { speed: 2400, temp: 61, vibration: 1.8 },
      { speed: 3000, temp: 72, vibration: 2.4 },
      { speed: 3600, temp: 84, vibration: 3.2 },
      { speed: 4200, temp: 98, vibration: 4.6 },
    ];

    return (
      <TelemetryConsole
        stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
        stationId="CELL-CNC-CORRELATION"
        title="Spindle Speed (RPM) vs Bearing Temperature (°C)"
        subtitle="Multivariate Machine Anomaly Diagnostic Console"
        shift="Shift A (06:00 – 14:00 IST)"
        supervisor="Vikram Bhosale"
        uclLimit="90.0 °C (Temp Alarm)"
        lclLimit="35.0 °C (Min Base)"
        kpis={[
          { label: 'Pearson (r)', value: '0.942', sub: 'Strong Correlation', tone: 'warning' },
          { label: 'Max Speed', value: '4,200 RPM', sub: 'Test Run', tone: 'neutral' },
          { label: 'Peak Temp', value: '98.0 °C', sub: 'Alarm Exceeded', tone: 'critical' },
          { label: 'Vibration', value: '4.60 mm/s', sub: 'Zone D Breach', tone: 'critical' },
        ]}
        tableData={correlationData}
        tableColumns={[
          { key: 'speed', label: 'SPINDLE SPEED (RPM)', align: 'right' },
          { key: 'temp', label: 'BEARING TEMP (°C)', align: 'right' },
          { key: 'vibration', label: 'RMS VIBRATION (mm/s)', align: 'right' },
        ]}
      >
        <ScatterPlot
          data={correlationData}
          xKey="speed"
          yKey="temp"
          width={760}
          height={300}
          xUnit=" RPM"
          yUnit=" °C"
        />
      </TelemetryConsole>
    );
  },
};
