import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DistributionPlot, Button, ToastProvider, useToast } from '@ds/react';
import { EnterpriseChartStoryShell, KPIItem } from './components/EnterpriseChartStoryShell';

const meta: Meta<typeof DistributionPlot> = {
  title: 'Data Visualization/DistributionPlot',
  component: DistributionPlot,
  parameters: {
    docs: {
      description: {
        component:
          'DistributionPlot visualizes statistical spread, frequency histograms, box-and-whisker quantiles, KDE density curves, tolerance limits, and outlier detection for manufacturing metrology at Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['histogram', 'box', 'violin', 'strip', 'dotplot', 'density'],
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
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
type Story = StoryObj<typeof DistributionPlot>;

const DEFAULT_DATA = [
  { sampleId: 'PIN-2024-001', batch: 'B-0941', timestamp: '06:12 IST', dimension: 24.981, status: 'In-Spec' },
  { sampleId: 'PIN-2024-002', batch: 'B-0941', timestamp: '06:28 IST', dimension: 24.984, status: 'In-Spec' },
  { sampleId: 'PIN-2024-003', batch: 'B-0941', timestamp: '06:45 IST', dimension: 24.989, status: 'In-Spec' },
  { sampleId: 'PIN-2024-004', batch: 'B-0942', timestamp: '07:05 IST', dimension: 24.992, status: 'In-Spec' },
  { sampleId: 'PIN-2024-005', batch: 'B-0942', timestamp: '07:22 IST', dimension: 24.994, status: 'In-Spec' },
  { sampleId: 'PIN-2024-006', batch: 'B-0942', timestamp: '07:40 IST', dimension: 24.995, status: 'In-Spec' },
  { sampleId: 'PIN-2024-007', batch: 'B-0943', timestamp: '08:00 IST', dimension: 24.997, status: 'In-Spec' },
  { sampleId: 'PIN-2024-008', batch: 'B-0943', timestamp: '08:15 IST', dimension: 24.998, status: 'In-Spec' },
  { sampleId: 'PIN-2024-009', batch: 'B-0943', timestamp: '08:30 IST', dimension: 24.999, status: 'In-Spec' },
  { sampleId: 'PIN-2024-010', batch: 'B-0944', timestamp: '08:50 IST', dimension: 25.000, status: 'In-Spec' },
  { sampleId: 'PIN-2024-011', batch: 'B-0944', timestamp: '09:05 IST', dimension: 25.000, status: 'In-Spec' },
  { sampleId: 'PIN-2024-012', batch: 'B-0944', timestamp: '09:20 IST', dimension: 25.001, status: 'In-Spec' },
  { sampleId: 'PIN-2024-013', batch: 'B-0945', timestamp: '09:40 IST', dimension: 25.001, status: 'In-Spec' },
  { sampleId: 'PIN-2024-014', batch: 'B-0945', timestamp: '10:00 IST', dimension: 25.002, status: 'In-Spec' },
  { sampleId: 'PIN-2024-015', batch: 'B-0945', timestamp: '10:18 IST', dimension: 25.002, status: 'In-Spec' },
  { sampleId: 'PIN-2024-016', batch: 'B-0946', timestamp: '10:35 IST', dimension: 25.003, status: 'In-Spec' },
  { sampleId: 'PIN-2024-017', batch: 'B-0946', timestamp: '10:55 IST', dimension: 25.004, status: 'In-Spec' },
  { sampleId: 'PIN-2024-018', batch: 'B-0946', timestamp: '11:10 IST', dimension: 25.005, status: 'In-Spec' },
  { sampleId: 'PIN-2024-019', batch: 'B-0947', timestamp: '11:30 IST', dimension: 25.006, status: 'In-Spec' },
  { sampleId: 'PIN-2024-020', batch: 'B-0947', timestamp: '11:50 IST', dimension: 25.008, status: 'In-Spec' },
  { sampleId: 'PIN-2024-021', batch: 'B-0948', timestamp: '12:15 IST', dimension: 25.011, status: 'In-Spec' },
  { sampleId: 'PIN-2024-022', batch: 'B-0948', timestamp: '12:40 IST', dimension: 25.014, status: 'In-Spec' },
  { sampleId: 'PIN-2024-023', batch: 'B-0949', timestamp: '13:05 IST', dimension: 25.018, status: 'In-Spec' },
  { sampleId: 'PIN-2024-024', batch: 'B-0949', timestamp: '13:30 IST', dimension: 25.022, status: 'In-Spec' },
  { sampleId: 'PIN-2024-025', batch: 'B-0950', timestamp: '13:45 IST', dimension: 25.028, status: 'Outlier (USL Exceeded)' }, // Outlier above USL
  { sampleId: 'PIN-2024-026', batch: 'B-0950', timestamp: '13:58 IST', dimension: 24.971, status: 'Outlier (LSL Deficit)' }, // Outlier below LSL
];

const BOX_DATA = [
  { sampleId: 'TC-0101', machine: 'Press P-01', sensorId: 'TS-P01-BRG', timestamp: '08:00 IST', temp: 58, status: 'Optimal' },
  { sampleId: 'TC-0102', machine: 'Press P-01', sensorId: 'TS-P01-BRG', timestamp: '09:00 IST', temp: 62, status: 'Optimal' },
  { sampleId: 'TC-0103', machine: 'Press P-01', sensorId: 'TS-P01-BRG', timestamp: '10:00 IST', temp: 64, status: 'Optimal' },
  { sampleId: 'TC-0104', machine: 'Press P-01', sensorId: 'TS-P01-BRG', timestamp: '11:00 IST', temp: 65, status: 'Optimal' },
  { sampleId: 'TC-0105', machine: 'Press P-01', sensorId: 'TS-P01-BRG', timestamp: '12:00 IST', temp: 67, status: 'Optimal' },
  { sampleId: 'TC-0106', machine: 'Press P-01', sensorId: 'TS-P01-BRG', timestamp: '13:00 IST', temp: 72, status: 'Elevated' },
  { sampleId: 'TC-0107', machine: 'Press P-01', sensorId: 'TS-P01-BRG', timestamp: '13:45 IST', temp: 96, status: 'Critical Trip' },
  { sampleId: 'TC-0201', machine: 'Press P-02', sensorId: 'TS-P02-BRG', timestamp: '08:15 IST', temp: 60, status: 'Optimal' },
  { sampleId: 'TC-0202', machine: 'Press P-02', sensorId: 'TS-P02-BRG', timestamp: '09:15 IST', temp: 63, status: 'Optimal' },
  { sampleId: 'TC-0203', machine: 'Press P-02', sensorId: 'TS-P02-BRG', timestamp: '10:15 IST', temp: 66, status: 'Optimal' },
  { sampleId: 'TC-0204', machine: 'Press P-02', sensorId: 'TS-P02-BRG', timestamp: '11:15 IST', temp: 68, status: 'Optimal' },
  { sampleId: 'TC-0205', machine: 'Press P-02', sensorId: 'TS-P02-BRG', timestamp: '12:15 IST', temp: 70, status: 'Optimal' },
  { sampleId: 'TC-0206', machine: 'Press P-02', sensorId: 'TS-P02-BRG', timestamp: '13:15 IST', temp: 74, status: 'Elevated' },
  { sampleId: 'TC-0301', machine: 'CNC Makino', sensorId: 'TS-MAK-SPN', timestamp: '08:30 IST', temp: 48, status: 'Optimal' },
  { sampleId: 'TC-0302', machine: 'CNC Makino', sensorId: 'TS-MAK-SPN', timestamp: '09:30 IST', temp: 51, status: 'Optimal' },
  { sampleId: 'TC-0303', machine: 'CNC Makino', sensorId: 'TS-MAK-SPN', timestamp: '10:30 IST', temp: 53, status: 'Optimal' },
  { sampleId: 'TC-0304', machine: 'CNC Makino', sensorId: 'TS-MAK-SPN', timestamp: '11:30 IST', temp: 54, status: 'Optimal' },
  { sampleId: 'TC-0305', machine: 'CNC Makino', sensorId: 'TS-MAK-SPN', timestamp: '12:30 IST', temp: 56, status: 'Optimal' },
  { sampleId: 'TC-0306', machine: 'CNC Makino', sensorId: 'TS-MAK-SPN', timestamp: '13:30 IST', temp: 59, status: 'Optimal' },
  { sampleId: 'TC-0401', machine: 'CNC Mazak', sensorId: 'TS-MAZ-SPN', timestamp: '08:45 IST', temp: 52, status: 'Optimal' },
  { sampleId: 'TC-0402', machine: 'CNC Mazak', sensorId: 'TS-MAZ-SPN', timestamp: '09:45 IST', temp: 55, status: 'Optimal' },
  { sampleId: 'TC-0403', machine: 'CNC Mazak', sensorId: 'TS-MAZ-SPN', timestamp: '10:45 IST', temp: 57, status: 'Optimal' },
  { sampleId: 'TC-0404', machine: 'CNC Mazak', sensorId: 'TS-MAZ-SPN', timestamp: '11:45 IST', temp: 59, status: 'Optimal' },
  { sampleId: 'TC-0405', machine: 'CNC Mazak', sensorId: 'TS-MAZ-SPN', timestamp: '12:45 IST', temp: 62, status: 'Optimal' },
  { sampleId: 'TC-0406', machine: 'CNC Mazak', sensorId: 'TS-MAZ-SPN', timestamp: '13:45 IST', temp: 88, status: 'Warning Hotspot' },
];

const DENSITY_DATA = [
  { batchId: 'BAT-A01', setup: 'Tool Setup A (Die 01)', operator: 'Rajesh S.', timestamp: '06:30 IST', force: 485, status: 'In-Spec' },
  { batchId: 'BAT-A02', setup: 'Tool Setup A (Die 01)', operator: 'Rajesh S.', timestamp: '07:15 IST', force: 490, status: 'In-Spec' },
  { batchId: 'BAT-A03', setup: 'Tool Setup A (Die 01)', operator: 'Rajesh S.', timestamp: '08:00 IST', force: 495, status: 'In-Spec' },
  { batchId: 'BAT-A04', setup: 'Tool Setup A (Die 01)', operator: 'Rajesh S.', timestamp: '09:10 IST', force: 498, status: 'In-Spec (Nominal)' },
  { batchId: 'BAT-A05', setup: 'Tool Setup A (Die 01)', operator: 'Rajesh S.', timestamp: '10:20 IST', force: 500, status: 'In-Spec (Peak Mode)' },
  { batchId: 'BAT-A06', setup: 'Tool Setup A (Die 01)', operator: 'Rajesh S.', timestamp: '11:30 IST', force: 502, status: 'In-Spec' },
  { batchId: 'BAT-A07', setup: 'Tool Setup A (Die 01)', operator: 'Rajesh S.', timestamp: '12:15 IST', force: 505, status: 'In-Spec' },
  { batchId: 'BAT-A08', setup: 'Tool Setup A (Die 01)', operator: 'Rajesh S.', timestamp: '13:00 IST', force: 510, status: 'In-Spec' },
  { batchId: 'BAT-A09', setup: 'Tool Setup A (Die 01)', operator: 'Rajesh S.', timestamp: '13:40 IST', force: 515, status: 'In-Spec' },
  { batchId: 'BAT-B01', setup: 'Tool Setup B (Die 02)', operator: 'Amit P.', timestamp: '07:30 IST', force: 475, status: 'Low Bound' },
  { batchId: 'BAT-B02', setup: 'Tool Setup B (Die 02)', operator: 'Amit P.', timestamp: '08:15 IST', force: 482, status: 'In-Spec' },
  { batchId: 'BAT-B03', setup: 'Tool Setup B (Die 02)', operator: 'Amit P.', timestamp: '09:00 IST', force: 488, status: 'In-Spec' },
  { batchId: 'BAT-B04', setup: 'Tool Setup B (Die 02)', operator: 'Amit P.', timestamp: '10:10 IST', force: 492, status: 'In-Spec' },
  { batchId: 'BAT-B05', setup: 'Tool Setup B (Die 02)', operator: 'Amit P.', timestamp: '11:20 IST', force: 496, status: 'In-Spec' },
  { batchId: 'BAT-B06', setup: 'Tool Setup B (Die 02)', operator: 'Amit P.', timestamp: '12:30 IST', force: 501, status: 'In-Spec' },
  { batchId: 'BAT-B07', setup: 'Tool Setup B (Die 02)', operator: 'Amit P.', timestamp: '13:00 IST', force: 508, status: 'In-Spec' },
  { batchId: 'BAT-B08', setup: 'Tool Setup B (Die 02)', operator: 'Amit P.', timestamp: '13:30 IST', force: 518, status: 'Elevated' },
  { batchId: 'BAT-B09', setup: 'Tool Setup B (Die 02)', operator: 'Amit P.', timestamp: '13:50 IST', force: 525, status: 'High Bound' },
];

const THRESHOLD_DATA = [
  { partId: 'AXLE-0891', machine: 'Superfinish SF-02', timestamp: '06:30 IST', ra: 0.22, status: 'Mirror Finish' },
  { partId: 'AXLE-0892', machine: 'Superfinish SF-02', timestamp: '07:15 IST', ra: 0.28, status: 'In-Spec' },
  { partId: 'AXLE-0893', machine: 'Superfinish SF-02', timestamp: '08:00 IST', ra: 0.31, status: 'In-Spec' },
  { partId: 'AXLE-0894', machine: 'Superfinish SF-02', timestamp: '08:45 IST', ra: 0.35, status: 'In-Spec' },
  { partId: 'AXLE-0895', machine: 'Superfinish SF-02', timestamp: '09:30 IST', ra: 0.38, status: 'In-Spec' },
  { partId: 'AXLE-0896', machine: 'Superfinish SF-02', timestamp: '10:15 IST', ra: 0.40, status: 'Target Mean' },
  { partId: 'AXLE-0897', machine: 'Superfinish SF-02', timestamp: '11:00 IST', ra: 0.41, status: 'In-Spec' },
  { partId: 'AXLE-0898', machine: 'Superfinish SF-02', timestamp: '11:45 IST', ra: 0.42, status: 'In-Spec' },
  { partId: 'AXLE-0899', machine: 'Superfinish SF-02', timestamp: '12:15 IST', ra: 0.44, status: 'In-Spec' },
  { partId: 'AXLE-0900', machine: 'Superfinish SF-02', timestamp: '12:45 IST', ra: 0.47, status: 'In-Spec' },
  { partId: 'AXLE-0901', machine: 'Superfinish SF-02', timestamp: '13:00 IST', ra: 0.51, status: 'In-Spec' },
  { partId: 'AXLE-0902', machine: 'Superfinish SF-02', timestamp: '13:15 IST', ra: 0.55, status: 'In-Spec' },
  { partId: 'AXLE-0903', machine: 'Superfinish SF-02', timestamp: '13:30 IST', ra: 0.62, status: 'In-Spec (Worn Stone)' },
  { partId: 'AXLE-0904', machine: 'Superfinish SF-02', timestamp: '13:40 IST', ra: 0.71, status: 'Near USL Limit' },
  { partId: 'AXLE-0905', machine: 'Superfinish SF-02', timestamp: '13:50 IST', ra: 0.85, status: 'USL Exceeded (Reject)' },
  { partId: 'AXLE-0906', machine: 'Superfinish SF-02', timestamp: '13:58 IST', ra: 0.92, status: 'USL Exceeded (Reject)' },
];

const HIGH_DENSITY_DATA = Array.from({ length: 120 }, (_, i) => {
  const u = Math.sin(i * 0.3) + Math.cos(i * 0.7);
  const strength = Math.round(485 + u * 20);
  const shiftName = i < 40 ? 'Shift A' : i < 80 ? 'Shift B' : 'Shift C';
  return {
    sampleId: `WELD-2024-${String(i + 1).padStart(4, '0')}`,
    shift: shiftName,
    station: `Bay 3 Robot R-0${(i % 3) + 1}`,
    strength,
    status: strength >= 420 ? 'Pass (Spec >420)' : 'Fail (Deficit)',
  };
});

const ACCESSIBLE_DATA = [
  { strokeId: 'STRK-88401', toolSet: 'Die Set D-01 (Pre-form)', machine: 'Press P-01 (1000T)', timestamp: '06:15 IST', tonnage: 610, status: 'In-Spec' },
  { strokeId: 'STRK-88402', toolSet: 'Die Set D-01 (Pre-form)', machine: 'Press P-01 (1000T)', timestamp: '06:45 IST', tonnage: 625, status: 'In-Spec' },
  { strokeId: 'STRK-88403', toolSet: 'Die Set D-02 (Piercing)', machine: 'Press P-01 (1000T)', timestamp: '07:20 IST', tonnage: 640, status: 'In-Spec' },
  { strokeId: 'STRK-88404', toolSet: 'Die Set D-02 (Piercing)', machine: 'Press P-01 (1000T)', timestamp: '08:05 IST', tonnage: 655, status: 'In-Spec' },
  { strokeId: 'STRK-88405', toolSet: 'Die Set D-02 (Piercing)', machine: 'Press P-01 (1000T)', timestamp: '08:40 IST', tonnage: 670, status: 'In-Spec' },
  { strokeId: 'STRK-88406', toolSet: 'Die Set D-03 (Bending)', machine: 'Press P-02 (800T)', timestamp: '09:15 IST', tonnage: 680, status: 'In-Spec' },
  { strokeId: 'STRK-88407', toolSet: 'Die Set D-03 (Bending)', machine: 'Press P-02 (800T)', timestamp: '09:50 IST', tonnage: 690, status: 'In-Spec' },
  { strokeId: 'STRK-88408', toolSet: 'Die Set D-03 (Bending)', machine: 'Press P-02 (800T)', timestamp: '10:25 IST', tonnage: 700, status: 'In-Spec' },
  { strokeId: 'STRK-88409', toolSet: 'Die Set D-04 (Emboss)', machine: 'Press P-02 (800T)', timestamp: '11:00 IST', tonnage: 710, status: 'In-Spec' },
  { strokeId: 'STRK-88410', toolSet: 'Die Set D-04 (Emboss)', machine: 'Press P-02 (800T)', timestamp: '11:35 IST', tonnage: 715, status: 'In-Spec' },
  { strokeId: 'STRK-88411', toolSet: 'Die Set D-04 (Emboss)', machine: 'Press P-02 (800T)', timestamp: '12:10 IST', tonnage: 720, status: 'In-Spec' },
  { strokeId: 'STRK-88412', toolSet: 'Die Set D-04 (Emboss)', machine: 'Press P-02 (800T)', timestamp: '12:45 IST', tonnage: 730, status: 'In-Spec' },
  { strokeId: 'STRK-88413', toolSet: 'Die Set D-05 (Coining)', machine: 'Press P-02 (800T)', timestamp: '13:10 IST', tonnage: 745, status: 'In-Spec' },
  { strokeId: 'STRK-88414', toolSet: 'Die Set D-05 (Coining)', machine: 'Press P-02 (800T)', timestamp: '13:30 IST', tonnage: 760, status: 'In-Spec' },
  { strokeId: 'STRK-88415', toolSet: 'Die Set D-05 (Coining)', machine: 'Press P-02 (800T)', timestamp: '13:45 IST', tonnage: 775, status: 'Warning (High)' },
  { strokeId: 'STRK-88416', toolSet: 'Die Set D-05 (Coining)', machine: 'Press P-02 (800T)', timestamp: '13:55 IST', tonnage: 790, status: 'Warning (High)' },
];

const COMPACT_DATA = [
  { microns: 22 }, { microns: 24 }, { microns: 25 }, { microns: 25 },
  { microns: 26 }, { microns: 27 }, { microns: 28 }, { microns: 32 },
];

// 1. Default Baseline Histogram
export const Default: Story = {
  args: {
    title: 'CNC Pin Diameter Tolerance Spread (mm)',
    subtitle: 'Chakan PL-04 Bay 2 — High-precision cylindrical grinding gauge (Nominal: 25.000 mm ± 0.025 mm)',
    width: '100%',
    height: 340,
    variant: 'histogram',
    valueKey: 'dimension',
    valueLabel: 'Pin Measured Dimension',
    unit: ' mm',
    binCount: 12,
    referenceLines: [
      { value: 24.975, label: 'LSL (24.975 mm)', color: '#b91c1c', position: 'start' },
      { value: 25.000, label: 'Nominal (25.000 mm)', color: '#2563eb', position: 'center' },
      { value: 25.025, label: 'USL (25.025 mm)', color: '#b91c1c', position: 'end' },
    ],
    toleranceBands: [
      { min: 24.975, max: 25.025, label: 'Acceptable In-Spec Tolerance (±0.025 mm)' },
    ],
    data: DEFAULT_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-CNC-METROLOGY"
      title="CNC Pin Diameter Tolerance Spread (mm)"
      subtitle="Chakan PL-04 Bay 2 — High-precision cylindrical grinding gauge (Nominal: 25.000 mm ± 0.025 mm)"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Sample Mean X̄', value: '25.002 mm', sub: '+0.002 mm Offset', tone: 'success' },
        { label: 'Std Dev (σ)', value: '0.0094 mm', sub: 'Six Sigma CpK 1.48', tone: 'success' },
        { label: 'In-Spec Yield', value: '92.3%', sub: '24 of 26 In Tolerance', tone: 'warning' },
        { label: 'Outlier Count', value: '2 Parts', sub: '1 High, 1 Low', tone: 'critical' },
      ]}
      uclLimit="25.025 mm (USL Upper Spec)"
      lclLimit="24.975 mm (LSL Lower Spec)"
      tableData={DEFAULT_DATA}
      tableColumns={[
        { key: 'sampleId', label: 'Sample ID' },
        { key: 'batch', label: 'Batch No.' },
        { key: 'timestamp', label: 'Time' },
        { key: 'dimension', label: 'Measured Pin Dimension (mm)', align: 'right' },
        { key: 'status', label: 'Tolerance Status' },
      ]}
    >
      <DistributionPlot {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Box Plot Variant across Machines
export const Variants: Story = {
  args: {
    title: 'Spindle Bearing Operating Temperature by Machine (°C)',
    subtitle: 'Chakan PL-04 Stamping & Milling Cells — Box-and-Whisker Quantile Comparison',
    width: '100%',
    height: 360,
    variant: 'box',
    valueKey: 'temp',
    categoryKey: 'machine',
    categoryLabel: 'Machine Workcenter',
    valueLabel: 'Spindle Bearing Temperature',
    unit: ' °C',
    showOutliers: true,
    showMean: true,
    referenceLines: [
      { value: 85, label: 'Warning Limit (85°C)', color: '#b45309', position: 'start' },
      { value: 95, label: 'Trip Limit (95°C)', color: '#b91c1c', position: 'end' },
    ],
    data: BOX_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-THERMAL-PM"
      title="Spindle Bearing Operating Temperature by Machine (°C)"
      subtitle="Chakan PL-04 Stamping & Milling Cells — Box-and-Whisker Quantile Comparison"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Hotspot Outlier', value: '96.0 °C', sub: 'Press P-01 Main Bearing', tone: 'critical' },
        { label: 'Median Temperature', value: '59.5 °C', sub: 'Across 4 Workcenters', tone: 'success' },
        { label: 'Coolest Machine', value: 'CNC Makino (53°C)', sub: 'Chilled Spindle Jacket', tone: 'success' },
        { label: 'Warning Exceedance', value: '2 Machines', sub: 'P-01 & CNC Mazak', tone: 'warning' },
      ]}
      uclLimit="95.0 °C (Emergency Thermal Trip)"
      lclLimit="40.0 °C (Minimum Warmup Floor)"
      tableData={BOX_DATA}
      tableColumns={[
        { key: 'sampleId', label: 'Sample ID' },
        { key: 'machine', label: 'Machine Workcenter' },
        { key: 'sensorId', label: 'Sensor ID' },
        { key: 'timestamp', label: 'Time' },
        { key: 'temp', label: 'Spindle Temp (°C)', align: 'right' },
        { key: 'status', label: 'Thermal Status' },
      ]}
    >
      <DistributionPlot {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Density / KDE Plot Variant
export const StackedOrGrouped: Story = {
  args: {
    title: 'Press Hydraulic Clamping Force Probability Density (kN)',
    subtitle: 'Kernel Density Estimation (KDE) across Tool Setup A (Die 01) vs Tool Setup B (Die 02)',
    width: '100%',
    height: 340,
    variant: 'density',
    valueKey: 'force',
    categoryKey: 'setup',
    categoryLabel: 'Tooling Setup',
    valueLabel: 'Hydraulic Clamping Force',
    unit: ' kN',
    series: [
      { key: 'Tool Setup A (Die 01)', label: 'Tool Setup A (Die 01)', color: '#2563eb' },
      { key: 'Tool Setup B (Die 02)', label: 'Tool Setup B (Die 02)', color: '#15803D' },
    ],
    referenceLines: [
      { value: 500, label: 'Nominal Clamping Force (500 kN)', color: '#0f172a', position: 'center' },
    ],
    data: DENSITY_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-PRESS-HYD"
      title="Press Hydraulic Clamping Force Probability Density (kN)"
      subtitle="Kernel Density Estimation (KDE) across Tool Setup A (Die 01) vs Tool Setup B (Die 02)"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Setup A Peak Mode', value: '500 kN', sub: 'Exact Setpoint Match', tone: 'success' },
        { label: 'Setup B Spread', value: '475 – 525 kN', sub: 'Higher Thermal Variance', tone: 'warning' },
        { label: 'Target Force', value: '500 kN', sub: 'Nominal Die Load', tone: 'neutral' },
        { label: 'Variance (σ²)', value: '14.2 kN²', sub: 'Setup B Hyd Drift', tone: 'warning' },
      ]}
      uclLimit="530 kN (Maximum Die Load)"
      lclLimit="470 kN (Minimum Clamping Floor)"
      tableData={DENSITY_DATA}
      tableColumns={[
        { key: 'batchId', label: 'Batch ID' },
        { key: 'setup', label: 'Tooling Setup' },
        { key: 'operator', label: 'Lead Operator' },
        { key: 'timestamp', label: 'Time' },
        { key: 'force', label: 'Clamping Force (kN)', align: 'right' },
        { key: 'status', label: 'Quality Status' },
      ]}
    >
      <DistributionPlot {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

// 4. Threshold and Control Limits
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'Axle Shaft Surface Roughness Ra (µm)',
    subtitle: 'Upper Spec Limit Ra 0.8 µm — Superfinishing Cell PL-04',
    width: '100%',
    height: 340,
    variant: 'histogram',
    valueKey: 'ra',
    valueLabel: 'Axle Shaft Surface Roughness Ra',
    unit: ' µm',
    binCount: 10,
    referenceLines: [
      { value: 0.4, label: 'Process Mean (0.40 µm)', color: '#15803D', position: 'start' },
      { value: 0.8, label: 'USL Limit (0.80 µm)', color: '#b91c1c', position: 'end' },
    ],
    toleranceBands: [
      { min: 0.1, max: 0.8, label: 'Acceptable Superfinish Spec (0.10 - 0.80 µm)' },
    ],
    data: THRESHOLD_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SUPERFINISH-02"
      title="Axle Shaft Surface Roughness Ra (µm)"
      subtitle="Upper Spec Limit Ra 0.8 µm — Superfinishing Cell PL-04"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Mean Roughness Ra', value: '0.485 µm', sub: 'Target 0.400 µm', tone: 'success' },
        { label: 'USL Violations', value: '2 Parts', sub: 'Ra 0.85 & 0.92 µm', tone: 'critical' },
        { label: 'Honing Stone Life', value: '88% Worn', sub: 'Stone Replacement Due', tone: 'warning' },
        { label: 'Pass Rate', value: '87.5%', sub: '14 of 16 In Spec', tone: 'warning' },
      ]}
      uclLimit="0.80 µm (USL Roughness Limit)"
      lclLimit="0.10 µm (LSL Mirror Polish Spec)"
      tableData={THRESHOLD_DATA}
      tableColumns={[
        { key: 'partId', label: 'Part Identifier' },
        { key: 'machine', label: 'Finishing Machine' },
        { key: 'timestamp', label: 'Time' },
        { key: 'ra', label: 'Roughness Ra (µm)', align: 'right' },
        { key: 'status', label: 'Surface QA' },
      ]}
    >
      <DistributionPlot {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

// 5. Interactive CMM Telemetry Recovery Simulation
const CmmTelemetrySimulation: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('CMM Calibration In Progress', 'Bridge zero confirmed. Ingesting 26-point stylus dimensional scan...');
    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('Dimensional Scan Ingested', '26 precision cylindrical pin samples mapped to ISO 17025 tolerance.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('CMM Probe Recalibration Alert', 'Ruby stylus deflection detected. System paused for recalibration.');
  };

  const isRestored = telemetryState === 'restored';
  const isReconnecting = telemetryState === 'reconnecting';

  const liveKpis: KPIItem[] = isRestored
    ? [
        { label: 'Sample Mean X̄', value: '25.002 mm', sub: '+0.002 mm Offset', tone: 'success' },
        { label: 'Std Dev (σ)', value: '0.0094 mm', sub: 'Six Sigma CpK 1.48', tone: 'success' },
        { label: 'In-Spec Yield', value: '92.3%', sub: '24 of 26 In Tolerance', tone: 'warning' },
        { label: 'Outlier Count', value: '2 Parts', sub: '1 High, 1 Low', tone: 'critical' },
      ]
    : [
        { label: 'CMM Status', value: isReconnecting ? 'SCANNING...' : 'CALIBRATING / OFFLINE', sub: 'ISO 17025 Protocol', tone: 'critical' },
        { label: 'Last Probe Audit', value: '11:30 IST', sub: 'Ruby Stylus 3mm', tone: 'neutral' },
        { label: 'Queued Batches', value: '6 Pallets', sub: 'Awaiting Metrology QA', tone: 'warning' },
        { label: 'Next Run ETA', value: '15:15 IST', sub: 'Shift B Handover', tone: 'neutral' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-CMM-METRO"
      title="CMM Automated Metrology Dimensional Log"
      subtitle="Coordinate Measuring Machine bridge inspection log (Nominal: 25.000 mm ± 0.025 mm)"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={liveKpis}
      uclLimit="25.025 mm (Upper Spec USL)"
      lclLimit="24.975 mm (Lower Spec LSL)"
      tableData={isRestored ? DEFAULT_DATA : []}
      tableColumns={[
        { key: 'sampleId', label: 'Sample ID' },
        { key: 'batch', label: 'Batch No.' },
        { key: 'timestamp', label: 'Time' },
        { key: 'dimension', label: 'Measured Pin Dimension (mm)', align: 'right' },
        { key: 'status', label: 'Tolerance Status' },
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
                ? 'CMM BRIDGE OFFLINE: ISO 17025 annual calibration routine active (Zero dimensional records)'
                : telemetryState === 'reconnecting'
                ? 'CALIBRATING CMM PROBE: Renishaw SP25M 3D probe zeroing...'
                : 'CMM METROLOGY ONLINE: 26-point dimensional distribution stream active'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            {telemetryState === 'offline' ? (
              <Button size="sm" variant="primary" onClick={handleReconnect}>
                Simulate Gateway Reconnect
              </Button>
            ) : (
              <Button size="sm" variant="secondary" onClick={handleDisconnect} disabled={isReconnecting}>
                Simulate Bus Dropout
              </Button>
            )}
          </div>
        </div>

        <DistributionPlot
          width="100%"
          height={320}
          variant="histogram"
          valueKey="dimension"
          valueLabel="Measured Pin Dimension"
          unit=" mm"
          binCount={12}
          referenceLines={
            isRestored
              ? [
                  { value: 24.975, label: 'LSL (24.975 mm)', color: '#b91c1c', position: 'start' },
                  { value: 25.000, label: 'Nominal (25.000 mm)', color: '#2563eb', position: 'center' },
                  { value: 25.025, label: 'USL (25.025 mm)', color: '#b91c1c', position: 'end' },
                ]
              : []
          }
          toleranceBands={
            isRestored
              ? [{ min: 24.975, max: 25.025, label: 'Acceptable In-Spec Tolerance (±0.025 mm)' }]
              : []
          }
          data={isRestored ? DEFAULT_DATA : []}
          loading={isReconnecting}
          emptyMessage="No metrology inspection records available. CMM probe undergoing ISO 17025 recalibration."
        />
      </div>
    </EnterpriseChartStoryShell>
  );
};

export const MissingTelemetryAndEmpty: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <CmmTelemetrySimulation />
    </ToastProvider>
  ),
};

// 6. High Density Multi-Shift Sampling
export const HighDensityMultiShift: Story = {
  args: {
    title: 'High-Density 500-Part Weld Tensile Strength Distribution (MPa)',
    subtitle: 'Continuous 3-Shift Robotic Seam Welding Quality Assurance',
    width: '100%',
    height: 360,
    variant: 'histogram',
    valueKey: 'strength',
    valueLabel: 'Coupon Tensile Strength',
    unit: ' MPa',
    binCount: 20,
    referenceLines: [
      { value: 420, label: 'Min Tensile Spec (420 MPa)', color: '#b91c1c', position: 'start' },
      { value: 490, label: 'Nominal Optimum (490 MPa)', color: '#2563eb', position: 'end' },
    ],
    data: HIGH_DENSITY_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-WELD-SEAM-01"
      title="High-Density 500-Part Weld Tensile Strength Distribution (MPa)"
      subtitle="Continuous 3-Shift Robotic Seam Welding Quality Assurance"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Mean Tensile Spec', value: '484.2 MPa', sub: 'Spec Cap 420 MPa', tone: 'success' },
        { label: 'Minimum Observed', value: '445 MPa', sub: '+25 MPa Safety Margin', tone: 'success' },
        { label: 'Sample Population', value: '120 Coupons', sub: '100% Destructive Pass', tone: 'success' },
        { label: 'Process CpK', value: '1.64', sub: 'Automotive Grade 1', tone: 'success' },
      ]}
      uclLimit="550 MPa (Maximum Hardness Bound)"
      lclLimit="420 MPa (Minimum Tensile Strength Spec)"
      tableData={HIGH_DENSITY_DATA}
      tableColumns={[
        { key: 'sampleId', label: 'Sample Coupon ID' },
        { key: 'shift', label: 'Operating Shift' },
        { key: 'station', label: 'Welding Robot' },
        { key: 'strength', label: 'Tensile Strength (MPa)', align: 'right' },
        { key: 'status', label: 'QA Verification' },
      ]}
    >
      <DistributionPlot {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Accessible Patterns & Roving Keyboard Focus
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'Die Stamping Tonnage Distribution by Press Tool Set',
    subtitle: 'Pattern-filled histogram bins with accessible ARIA metrics and table fallback',
    width: '100%',
    height: 340,
    variant: 'histogram',
    valueKey: 'tonnage',
    valueLabel: 'Forming Load',
    unit: ' T',
    enablePatterns: true,
    binCount: 8,
    data: ACCESSIBLE_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-TOOL-QA"
      title="Die Stamping Tonnage Distribution by Press Tool Set"
      subtitle="Accessible pattern-filled histogram with high-density data table"
      shift="Shift A (06:00 – 14:00 IST)"
      defaultView="table"
      kpis={[
        { label: 'Mean Tool Tonnage', value: '698.8 T', sub: 'Nominal 700 T Die Window', tone: 'success' },
        { label: 'Peak Forming Load', value: '790 T', sub: 'Die Set D-04', tone: 'warning' },
        { label: 'Minimum Load', value: '610 T', sub: 'Blanking Pre-Form', tone: 'success' },
        { label: 'Tool Life Rating', value: '84,500 Strokes', sub: 'Next Die Polish at 100k', tone: 'success' },
      ]}
      uclLimit="800 T (Press Rating Limit)"
      lclLimit="600 T (Under-Forming Limit)"
      tableData={ACCESSIBLE_DATA}
      tableColumns={[
        { key: 'strokeId', label: 'Stroke / Log ID' },
        { key: 'toolSet', label: 'Press Tool Set' },
        { key: 'machine', label: 'Press Workcenter' },
        { key: 'timestamp', label: 'Time' },
        { key: 'tonnage', label: 'Forming Tonnage (T)', align: 'right' },
        { key: 'status', label: 'QA Disposition' },
      ]}
    >
      <DistributionPlot {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

// 8. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    width: '100%',
    height: 160,
    variant: 'box',
    valueKey: 'microns',
    unit: ' µm',
    density: 'compact',
    showOutliers: true,
    data: COMPACT_DATA,
  },
  render: (args) => (
    <div style={{ maxWidth: '1140px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
      {/* Dashboard Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>
            Plant PL-04 · Statistical Quality Metrology
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>
            Multi-Workcenter Tolerance & Dispersion Monitor
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#15803D' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#15803D' }}>SPC Active (100% Sampling)</span>
        </div>
      </div>

      {/* 3-Column Compact Card Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Widget 1 */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>CELL-ECOAT-BATH</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Paint Film Thickness (µm)</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>26.0 µm</div>
              <div style={{ fontSize: '0.625rem', color: '#15803D', fontWeight: 600 }}>In Tolerance (25±5)</div>
            </div>
          </div>
          <DistributionPlot
            {...args}
            title=""
            subtitle=""
            height={140}
            variant="box"
            data={COMPACT_DATA}
            valueKey="microns"
            unit=" µm"
            referenceLines={[{ value: 30, label: 'USL (30)', color: '#b91c1c', position: 'end' }]}
          />
        </div>

        {/* Widget 2 */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>CELL-CNC-PIN</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Pin Diameter Spread (mm)</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a' }}>25.002 mm</div>
              <div style={{ fontSize: '0.625rem', color: '#15803D', fontWeight: 600 }}>CpK 1.48 (Nominal)</div>
            </div>
          </div>
          <DistributionPlot
            {...args}
            title=""
            subtitle=""
            height={140}
            variant="histogram"
            data={DEFAULT_DATA}
            valueKey="dimension"
            unit=" mm"
            binCount={8}
            referenceLines={[{ value: 25.000, label: 'Target', color: '#2563eb', position: 'center' }]}
          />
        </div>

        {/* Widget 3 */}
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>CELL-SUPERFINISH-02</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>Shaft Surface Ra (µm)</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#b91c1c' }}>0.485 µm</div>
              <div style={{ fontSize: '0.625rem', color: '#b91c1c', fontWeight: 600 }}>2 Spec Breaches</div>
            </div>
          </div>
          <DistributionPlot
            {...args}
            title=""
            subtitle=""
            height={140}
            variant="histogram"
            data={THRESHOLD_DATA}
            valueKey="ra"
            unit=" µm"
            binCount={6}
            referenceLines={[{ value: 0.8, label: 'USL', color: '#b91c1c', position: 'end' }]}
          />
        </div>
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
    title: 'Pin Diameter Tolerance Distribution (Accessible Alternative Mirror)',
    data: DEFAULT_DATA,
    valueKey: 'dimension',
    unit: ' mm',
    variant: 'box',
    showDataTable: true,
    width: '100%',
    height: 320,
  },
};
