# ParallelCoordinates Prompting Guide & Best Practices

## Component Overview
`ParallelCoordinates` is an advanced multidimensional visualization component in the Meridian Design System (MDS). It compares multivariate profiles across many quantitative and ordered dimensions to detect clustering, parameter trade-offs, Pareto frontiers, and anomalous manufacturing records.

## Typical Use Cases
1. **Die Casting & Stamping Multi-Parameter Optimization:** Compare tonnage, die temperature, injection pressure, cycle time, and defect PPM simultaneously.
2. **Steel Heat Metallurgical Profiles:** Evaluate tensile strength, yield strength, elongation %, hardness, and carbon equivalent across raw material batches.
3. **CNC Spindle Telemetry & Tool Wear:** Multi-sensor correlation across spindle load %, vibration, temperature, and surface roughness.

## Recommended Defaults
- `variant`: `'brushed'` or `'standard'`
- `colorKey`: `'cluster'` or `'grade'`
- `showControls`: `true`
- `showBrushControls`: `true`
- `showSearch`: `true`

## Example Usage
```tsx
import React from 'react';
import { ParallelCoordinates } from './ParallelCoordinates';

const dimensions = [
  { key: 'tonnage', label: 'Peak Tonnage', unit: 'T', min: 600, max: 1200 },
  { key: 'dieTemp', label: 'Die Temp', unit: '°C', min: 180, max: 320 },
  { key: 'pressure', label: 'Injection Press', unit: 'bar', min: 120, max: 240 },
  { key: 'cycleTime', label: 'Cycle Time', unit: 's', min: 20, max: 55 },
  { key: 'defectPpm', label: 'Defect Rate', unit: 'PPM', min: 0, max: 450, inverted: true }
];

const telemetryData = [
  { id: 'Batch-01', label: 'Batch #01 (Chakan PL-04)', tonnage: 820, dieTemp: 245, pressure: 165, cycleTime: 32, defectPpm: 45, cluster: 'Optimal Process' },
  { id: 'Batch-02', label: 'Batch #02 (Chakan PL-04)', tonnage: 1100, dieTemp: 310, pressure: 225, cycleTime: 48, defectPpm: 380, cluster: 'High Overheat Outlier' },
  { id: 'Batch-03', label: 'Batch #03 (Chakan PL-04)', tonnage: 780, dieTemp: 230, pressure: 155, cycleTime: 29, defectPpm: 25, cluster: 'Optimal Process' }
];

export function CastingProcessExplorer() {
  return (
    <ParallelCoordinates
      data={telemetryData}
      dimensions={dimensions}
      variant="brushed"
      colorKey="cluster"
      title="Die Casting Multi-Parameter Process Telemetry"
      subtitle="Suryodaya Autocomp Ltd · Chakan Plant (PL-04)"
      width={860}
      height={420}
    />
  );
}
```
