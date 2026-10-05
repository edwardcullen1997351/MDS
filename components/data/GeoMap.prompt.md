# GeoMap Prompting Guide & Best Practices

## Component Overview
`GeoMap` is a high-performance geographic visualization component in the Meridian Design System (MDS). It represents multi-layered spatial data where geographic position, shape, distance, route, or spatial neighborhood is analytically meaningful. It supports choropleth state fills, proportional hub nodes, and curved freight route corridors.

## Typical Use Cases
1. **Supply Chain & Logistics Corridors:** Track multi-tier raw material suppliers, manufacturing plants (e.g. Suryodaya Autocomp Chakan PL-04), OEM assembly hubs, and container freight ports.
2. **State-Level Regional Dispatches:** Visualizing regional quotas, yield variances, or state-level scrap/dispatch rates via choropleth fills.
3. **Multi-Modal Route Monitoring:** Monitoring inter-state road, rail, and sea logistics with real-time transit status (Nominal, Warning, Critical delay).

## Recommended Defaults
- `variant`: `'hybrid'` (renders regions + hubs + routes simultaneously)
- `projection`: `'mercator'` or `'equirectangular'`
- `center`: `[77.0, 20.0]` (Central India)
- `scale`: `1200`
- `showLayerControls`: `true`
- `showSearch`: `true`
- `showScaleBar`: `true`

## Example Usage
```tsx
import React from 'react';
import { GeoMap } from './GeoMap';

const supplyChainData = {
  regions: [
    { id: 'MH', name: 'Maharashtra', value: 84200, formattedValue: '84,200 MT', status: 'nominal' },
    { id: 'GJ', name: 'Gujarat', value: 42100, formattedValue: '42,100 MT', status: 'nominal' },
    { id: 'TN', name: 'Tamil Nadu', value: 29800, formattedValue: '29,800 MT', status: 'warning' },
    { id: 'HR', name: 'Haryana', value: 18500, formattedValue: '18,500 MT', status: 'critical' },
    { id: 'KA', name: 'Karnataka', value: 36000, formattedValue: '36,000 MT', status: 'nominal' }
  ],
  hubs: [
    { id: 'CHAKAN', name: 'Chakan Plant (PL-04)', type: 'plant', coordinates: [73.85, 18.75], value: 45000, unit: 'units/mo', status: 'nominal', city: 'Pune' },
    { id: 'JNPT', name: 'Nhava Sheva Port (JNPT)', type: 'port', coordinates: [72.95, 18.95], value: 14200, unit: 'containers', status: 'nominal', city: 'Navi Mumbai' },
    { id: 'SANAND', name: 'Sanand OEM Assembly', type: 'oem', coordinates: [72.38, 23.00], value: 18000, unit: 'chassis/mo', status: 'nominal', city: 'Sanand' },
    { id: 'CHENNAI', name: 'Chennai Auto Cluster', type: 'oem', coordinates: [80.27, 13.08], value: 22000, unit: 'units/mo', status: 'warning', city: 'Chennai' },
    { id: 'MANESAR', name: 'Manesar Powertrain', type: 'oem', coordinates: [76.93, 28.35], value: 12500, unit: 'engines/mo', status: 'critical', city: 'Gurugram' },
    { id: 'BELLARY', name: 'Vijayanagar Steel Works', type: 'vendor', coordinates: [76.65, 15.15], value: 36000, unit: 'MT Coil', status: 'nominal', city: 'Bellary' }
  ],
  routes: [
    { id: 'R1', source: 'BELLARY', target: 'CHAKAN', flow: 36000, unit: 'MT Coil', status: 'nominal', mode: 'rail', transitHours: 18 },
    { id: 'R2', source: 'CHAKAN', target: 'JNPT', flow: 14200, unit: 'TEU Export', status: 'nominal', mode: 'road', transitHours: 4 },
    { id: 'R3', source: 'CHAKAN', target: 'SANAND', flow: 18000, unit: 'Assemblies', status: 'nominal', mode: 'road', transitHours: 14 },
    { id: 'R4', source: 'CHAKAN', target: 'CHENNAI', flow: 12000, unit: 'Axles', status: 'warning', mode: 'rail', transitHours: 28 },
    { id: 'R5', source: 'CHAKAN', target: 'MANESAR', flow: 8500, unit: 'Transmissions', status: 'critical', mode: 'road', transitHours: 36 }
  ]
};

export function SupplyChainMap() {
  return (
    <GeoMap
      data={supplyChainData}
      variant="hybrid"
      title="National Supply Chain Logistics & Freight Corridors"
      subtitle="Suryodaya Autocomp Ltd — Chakan Plant (PL-04) Dispatch Network"
      width={900}
      height={580}
    />
  );
}
```
