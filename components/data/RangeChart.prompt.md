# RangeChart Prompting Guide & Best Practices

## Component Overview
`RangeChart` is a specialized bounded interval visualization component in the Meridian Design System (MDS). It represents bounded intervals, uncertainty, variation, deviation, and before/after endpoint deltas across manufacturing, metrology, and engineering metrics.

## Supported Variants
1. `interval-bar`: Floating range bars bounded between lower and upper limits with optional central diamond/tick.
2. `dumbbell`: Two distinct endpoint markers connected by a link to highlight Before vs After or Planned vs Actual changes.
3. `error-bar`: Central estimate point (mean/median) with lower and upper uncertainty whiskers (e.g. 95% Confidence Interval).
4. `range-area`: Continuous chronological sequence / time-series shaded confidence envelope with a central trend line.

## Key Rules & Anti-Patterns
- **Explicit Interval Semantics:** Never imply statistical confidence when an interval represents physical tolerance or empirical min/max. Always declare `intervalSemantics` (`'min-max' | 'ci-95' | 'tolerance-band' | 'before-after' | 'target-actual'`).
- **Preserve Endpoint Relationship:** Never truncate axes so aggressively that the proportional relationship between lower and upper bounds is distorted.
- **Directional Semantics:** For dumbbell charts, encode improvement vs regression (e.g., cycle time reduction = green, cycle time increase = red).

## Example Usage
```tsx
import React from 'react';
import { RangeChart } from './RangeChart';

// 1. CNC Machining Tolerance Bands
const toleranceData = [
  { id: 'dim-1', label: 'Crankshaft Main Journal Dia', lower: 49.985, upper: 50.015, center: 50.002, target: 50.000, status: 'nominal', intervalSemantics: 'Tolerance Band (±15 µm)' },
  { id: 'dim-2', label: 'Cylinder Bore Diameter', lower: 82.490, upper: 82.520, center: 82.518, target: 82.500, status: 'warning', intervalSemantics: 'Tolerance Band (±15 µm)' },
  { id: 'dim-3', label: 'Piston Pin Bore Dia', lower: 21.992, upper: 22.008, center: 22.012, target: 22.000, status: 'critical', intervalSemantics: 'Tolerance Band (±8 µm)' }
];

// 2. Kaizen Cycle Time Reduction (Dumbbell)
const kaizenData = [
  { id: 'press-1', label: 'Press Line 01 (800T Blanking)', lower: 48, upper: 32, isImproved: true, intervalSemantics: 'Before → After Kaizen' },
  { id: 'press-2', label: 'Press Line 02 (1200T Drawing)', lower: 64, upper: 44, isImproved: true, intervalSemantics: 'Before → After Kaizen' },
  { id: 'weld-1', label: 'Robotic Spot Welding Cell', lower: 52, upper: 56, isImproved: false, intervalSemantics: 'Before → After Kaizen' }
];

export function ToleranceOverview() {
  return (
    <RangeChart
      data={toleranceData}
      variant="interval-bar"
      orientation="horizontal"
      unit="mm"
      title="Critical CNC Machining Tolerance Bands"
      subtitle="Suryodaya Autocomp · Chakan Plant (PL-04)"
      width={760}
      height={320}
    />
  );
}
```
