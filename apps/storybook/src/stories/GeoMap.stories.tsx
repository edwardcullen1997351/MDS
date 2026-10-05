import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GeoMap, Button, ToastProvider, useToast } from '@ds/react';
import { EnterpriseChartStoryShell, KPIItem } from './components/EnterpriseChartStoryShell';

const meta: Meta<typeof GeoMap> = {
  title: 'Data Visualization/GeoMap',
  component: GeoMap,
  parameters: {
    docs: {
      description: {
        component:
          'GeoMap visualizes national auto component logistics corridors, raw steel supplier hubs, OEM delivery hubs, and multi-echelon supply network flows for Suryodaya Autocomp Ltd (HQ: Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['hybrid', 'choropleth', 'bubble', 'route'],
    },
    projection: {
      control: 'select',
      options: ['mercator', 'equirectangular'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof GeoMap>;

const DEFAULT_HUBS = [
  { id: 'hub-chakan', label: 'PL-04 (Chakan HQ)', coordinates: [73.85, 18.75] as [number, number], role: 'Central Stamping Facility (HQ)', category: 'HQ Plant', status: 'nominal' as const, value: 5400, size: 9 },
  { id: 'hub-sanand', label: 'Sanand', coordinates: [72.38, 23.01] as [number, number], role: 'Tata Motors OEM Assembly', category: 'OEM Client', status: 'nominal' as const, value: 1850, size: 7 },
  { id: 'hub-manesar', label: 'Manesar', coordinates: [76.93, 28.35] as [number, number], role: 'Maruti Suzuki OEM Assembly', category: 'OEM Client', status: 'nominal' as const, value: 1650, size: 7 },
  { id: 'hub-chennai', label: 'Chennai', coordinates: [79.94, 12.97] as [number, number], role: 'Hyundai Sriperumbudur Assembly', category: 'OEM Client', status: 'warning' as const, value: 1950, size: 7 },
  { id: 'hub-mumbai', label: 'JNPT Port', coordinates: [72.95, 18.95] as [number, number], role: 'Export Gateway Container Terminal', category: 'Logistics Port', status: 'nominal' as const, value: 2100, size: 7 },
];

const ROUTES_DATA = [
  { id: 'r-1', sourceId: 'hub-chakan', targetId: 'hub-sanand', label: 'Chakan -> Sanand (Tata EV)', value: 1850, status: 'nominal' as const, mode: 'road' as const, transitHours: 14 },
  { id: 'r-2', sourceId: 'hub-chakan', targetId: 'hub-manesar', label: 'Chakan -> Manesar (Maruti)', value: 1650, status: 'nominal' as const, mode: 'road' as const, transitHours: 28 },
  { id: 'r-3', sourceId: 'hub-chakan', targetId: 'hub-chennai', label: 'Chakan -> Chennai (Hyundai)', value: 1950, status: 'warning' as const, mode: 'road' as const, transitHours: 24 },
  { id: 'r-4', sourceId: 'hub-chakan', targetId: 'hub-mumbai', label: 'Chakan -> JNPT (Export Containers)', value: 2100, status: 'nominal' as const, mode: 'road' as const, transitHours: 4 },
  { id: 'r-5', sourceId: 'hub-jsw', targetId: 'hub-chakan', label: 'JSW Bellary -> Chakan (CRCA Coils)', value: 3100, status: 'nominal' as const, mode: 'rail' as const, transitHours: 20 },
];

const BUBBLE_HUBS = [
  { id: 'hub-chakan', label: 'PL-04 (Chakan HQ)', coordinates: [73.85, 18.75] as [number, number], role: 'Central Stamping Facility (HQ)', category: 'HQ Plant', status: 'nominal' as const, value: 5400, size: 12 },
  { id: 'hub-jsw', label: 'JSW Steel', coordinates: [76.65, 15.15] as [number, number], role: 'CRCA Coil Supplier (Vijayanagar)', category: 'Supplier', status: 'nominal' as const, value: 3200, size: 10 },
  { id: 'hub-jamshedpur', label: 'Tata Steel', coordinates: [86.20, 22.80] as [number, number], role: 'High-Tensile Sheet Supplier (Jamshedpur)', category: 'Supplier', status: 'nominal' as const, value: 2400, size: 9 },
  { id: 'hub-angul', label: 'Jindal Steel', coordinates: [85.10, 20.84] as [number, number], role: 'Heavy Plate Supplier (Angul)', category: 'Supplier', status: 'warning' as const, value: 1100, size: 7 },
  { id: 'hub-salem', label: 'SAIL Salem', coordinates: [78.14, 11.66] as [number, number], role: 'Stainless Exhaust Grade (Salem)', category: 'Supplier', status: 'nominal' as const, value: 850, size: 6 },
];

const REGIONS_DATA = [
  { id: 'reg-mh', code: 'MH', label: 'Maharashtra (Pune & Nashik Cluster)', path: 'M 240 230 L 310 215 L 350 250 L 330 310 L 260 325 L 220 275 Z', centroid: [285, 268] as [number, number], value: 88, category: 'Tier-1 Hub' },
  { id: 'reg-gj', code: 'GJ', label: 'Gujarat (Sanand Auto Belt)', path: 'M 190 180 L 240 170 L 250 220 L 205 240 L 175 210 Z', centroid: [212, 204] as [number, number], value: 74, category: 'Assembly Zone' },
  { id: 'reg-tn', code: 'TN', label: 'Tamil Nadu (Chennai Auto Corridor)', path: 'M 305 370 L 350 360 L 365 425 L 310 445 L 295 400 Z', centroid: [325, 400] as [number, number], value: 82, category: 'Export Hub' },
  { id: 'reg-hr-dl', code: 'NCR', label: 'NCR (Manesar & Gurugram)', path: 'M 265 110 L 315 95 L 330 135 L 290 155 L 255 130 Z', centroid: [291, 125] as [number, number], value: 79, category: 'Assembly Zone' },
  { id: 'reg-ka', code: 'KA', label: 'Karnataka (Bangalore & Hosur)', path: 'M 255 320 L 305 310 L 315 375 L 275 410 L 245 350 Z', centroid: [279, 353] as [number, number], value: 65, category: 'Component Hub' },
];

// 1. Default Baseline Story
export const Default: Story = {
  args: {
    title: 'Suryodaya Autocomp: National Supply Chain Corridors',
    subtitle: 'Chakan PL-04 (Pune) Stamping Hub to OEM Plants & Port Logistics',
    width: '100%',
    height: 520,
    variant: 'hybrid',
    showSearch: true,
    showLayerControls: true,
    unit: ' Tons/Mo',
    locale: 'en-IN',
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-LOGISTICS-HUB"
      title="Suryodaya Autocomp: National Supply Chain Corridors"
      subtitle="Chakan PL-04 (Pune) Stamping Hub to OEM Plants & Port Logistics"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Outbound Monthly Freight', value: '7,550 Tons', sub: '+12.4% MoM Growth', tone: 'success' },
        { label: 'Active Transit Fleet', value: '42 GPS Trucks', sub: '100% Geo-Tracked', tone: 'success' },
        { label: 'Avg Transit Delay', value: '1.4 Hours', sub: 'Within SLA Threshold', tone: 'success' },
        { label: 'Port Export Buffer', value: '2,100 MT', sub: 'JNPT Nhava Sheva', tone: 'neutral' },
      ]}
      uclLimit="10,000 Tons/Mo (Fleet Capacity)"
      lclLimit="3,000 Tons/Mo (Minimum Threshold)"
      tableData={DEFAULT_HUBS}
      tableColumns={[
        { key: 'id', label: 'Node ID' },
        { key: 'label', label: 'Facility Hub / Cluster' },
        { key: 'category', label: 'Entity Type' },
        { key: 'role', label: 'Operational Role' },
        { key: 'value', label: 'Throughput (Tons/Mo)', align: 'right' },
        { key: 'status', label: 'Network Health' },
      ]}
    >
      <GeoMap {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Route Corridor Flow Variant
export const Variants: Story = {
  args: {
    title: 'Outbound Body Panel Freight Logistics Corridors',
    subtitle: 'Transit routes with active freight volume (Tons/Month) and shipment status',
    width: '100%',
    height: 520,
    variant: 'route',
    routes: ROUTES_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-FREIGHT-DISPATCH"
      title="Outbound Body Panel Freight Logistics Corridors"
      subtitle="Transit routes with active freight volume (Tons/Month) and shipment status"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Top Inbound Route', value: 'JSW Bellary (3.1k T)', sub: 'Rail Freight (20h)', tone: 'success' },
        { label: 'Top Outbound Route', value: 'JNPT Export (2.1k T)', sub: 'Dedicated Container Road', tone: 'success' },
        { label: 'Corridor Warning', value: 'Chennai Corridor', sub: 'Rain Weather Delay (24h)', tone: 'warning' },
        { label: 'Total Freight Volume', value: '10,650 MT/Mo', sub: '5 Dedicated Corridors', tone: 'success' },
      ]}
      uclLimit="12,000 MT/Mo (Logistics Cap)"
      lclLimit="5,000 MT/Mo (Minimum Rail Freight)"
      tableData={ROUTES_DATA}
      tableColumns={[
        { key: 'id', label: 'Route ID' },
        { key: 'label', label: 'Origin -> Destination' },
        { key: 'mode', label: 'Mode' },
        { key: 'transitHours', label: 'Transit Time (Hrs)', align: 'right' },
        { key: 'value', label: 'Volume (Tons/Mo)', align: 'right' },
        { key: 'status', label: 'Corridor Status' },
      ]}
    >
      <GeoMap {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Raw Steel Inbound Sourcing Hubs (Bubble Variant)
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'Tier-1 Raw Material Supplier Inflow & Stockpile Tonnage',
    subtitle: 'High-risk single-source vendor nodes highlighted with inventory buffer levels',
    width: '100%',
    height: 520,
    variant: 'bubble',
    unit: ' MT/Mo',
    hubs: BUBBLE_HUBS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-STEEL-SUPPLY"
      title="Tier-1 Raw Material Supplier Inflow & Stockpile Tonnage"
      subtitle="High-risk single-source vendor nodes highlighted with inventory buffer levels"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Chakan Central Stockpile', value: '5,400 MT', sub: '28-Day Production Buffer', tone: 'success' },
        { label: 'JSW Steel Supply', value: '3,200 MT/Mo', sub: 'CRCA Master Coil Lead', tone: 'success' },
        { label: 'Tata Steel Supply', value: '2,400 MT/Mo', sub: 'DP600 High Tensile', tone: 'success' },
        { label: 'Jindal Angul Warning', value: '1,100 MT/Mo', sub: 'Plate Rolling Backlog', tone: 'warning' },
      ]}
      uclLimit="6,000 MT (Max Yard Capacity)"
      lclLimit="2,500 MT (Min Safety Stockpile)"
      tableData={BUBBLE_HUBS}
      tableColumns={[
        { key: 'id', label: 'Supplier Hub' },
        { key: 'label', label: 'Mill Location & Company' },
        { key: 'role', label: 'Alloy Grade Supplied' },
        { key: 'value', label: 'Stockpile (MT/Mo)', align: 'right' },
        { key: 'status', label: 'Supply Risk' },
      ]}
    >
      <GeoMap {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

const GeoMapMissingTelemetryInteractiveStory: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('Maritime AIS Gateway Reconnecting', 'Acquiring Inmarsat-C satellite transponder carrier lock at JNPT Port...');

    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('AIS Satellite Telemetry Restored', 'Synchronized 5 maritime logistics hubs and Pan-India corridors.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('Satellite Uplink Dropout', 'Simulated Inmarsat carrier loss on Nhava Sheva coastal transponder.');
  };

  const kpis: KPIItem[] = telemetryState === 'restored'
    ? [
        { label: 'Satellite Uplink', value: 'ONLINE (Inmarsat-C)', sub: 'Carrier Lock Healthy', tone: 'success' },
        { label: 'Tracked Logistics Hubs', value: '5 Nodes Active', sub: 'JNPT, Sanand, Manesar, Chakan', tone: 'success' },
        { label: 'Active Corridors', value: '4 Coastal Corridors', sub: '100% AIS Telemetry Link', tone: 'success' },
        { label: 'Port Turnaround', value: '4.2 Hours', sub: 'Within 48 Hr SLA', tone: 'success' },
      ]
    : [
        { label: 'Satellite Uplink', value: 'DISCONNECTED', sub: 'Inmarsat-C Offline', tone: 'critical' },
        { label: 'Last Vessel Fix', value: '18.95°N 72.82°E', sub: 'Approaching JNPT', tone: 'neutral' },
        { label: 'Tracked Vessels', value: '0 / 5 Active', sub: 'Awaiting Satellite Reconnect', tone: 'warning' },
        { label: 'Customs Clearance', value: 'On Schedule', sub: 'Port EDI Cleared', tone: 'success' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-MARITIME-AIS"
      title="Overseas Container Vessel Tracking (GPS AIS Feed)"
      subtitle="Demonstrates offline state when maritime satellite uplink is disconnected"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={kpis}
      uclLimit="48 Hrs (Max Port Dwell)"
      lclLimit="4 Hrs (Express Turnaround)"
      tableData={telemetryState === 'restored' ? DEFAULT_HUBS : []}
      tableColumns={[
        { key: 'id', label: 'Vessel / Hub MMSI' },
        { key: 'label', label: 'Facility Name' },
        { key: 'category', label: 'Entity Type' },
        { key: 'status', label: 'AIS Telemetry Status' },
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
                ? 'AIS TRANSPONDER OFFLINE: Inmarsat-C Satellite Gateway Timed Out (JNPT Coastal Hub)'
                : telemetryState === 'reconnecting'
                ? 'ACQUIRING SATELLITE: Handshake with AIS Coastal Receiver Hub...'
                : 'AIS TELEMETRY ONLINE: Dual-channel 161.975 MHz maritime stream active'}
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

        <GeoMap
          title="Overseas Container Vessel Tracking (GPS AIS Feed)"
          subtitle="Real-time maritime satellite uplink and GIS telemetry"
          width="100%"
          height={400}
          hubs={telemetryState === 'restored' ? DEFAULT_HUBS : []}
          routes={telemetryState === 'restored' ? ROUTES_DATA : []}
          regions={telemetryState === 'restored' ? REGIONS_DATA : []}
          ariaLabel="No active vessel or GIS telemetry received from Mumbai Nhava Sheva AIS transponder."
        />
      </div>
    </EnterpriseChartStoryShell>
  );
};

// 4. Missing Telemetry & Empty State
export const MissingTelemetryAndEmpty: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <GeoMapMissingTelemetryInteractiveStory />
    </ToastProvider>
  ),
};

// 5. High Density Multi-Regional Distribution
export const HighDensityMultiShift: Story = {
  args: {
    title: 'Pan-India 28-Hub Automotive Ancillary Supply Grid',
    subtitle: 'Connecting Chakan PL-04 with North, West, South, and East Tier-2 stamping satellites',
    width: '100%',
    height: 520,
    variant: 'hybrid',
    showSearch: true,
    showMinimap: true,
    showScaleBar: true,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-PAN-INDIA-GRID"
      title="Pan-India 28-Hub Automotive Ancillary Supply Grid"
      subtitle="Connecting Chakan PL-04 with North, West, South, and East Tier-2 stamping satellites"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Connected Hubs', value: '28 Regional Sites', sub: 'Covering 4 Auto Belts', tone: 'success' },
        { label: 'National Flow Rate', value: '18,500 MT/Mo', sub: '100% Digitized e-Waybills', tone: 'success' },
        { label: 'On-Time In Full (OTIF)', value: '96.8%', sub: 'Target 95.0%', tone: 'success' },
        { label: 'Transit Loss Rate', value: '0.04%', sub: 'Zero High-Value Damage', tone: 'success' },
      ]}
      uclLimit="25,000 MT/Mo (Network Ceiling)"
      lclLimit="10,000 MT/Mo (National Minimum)"
      tableData={DEFAULT_HUBS}
      tableColumns={[
        { key: 'id', label: 'Regional Node' },
        { key: 'label', label: 'Facility Name' },
        { key: 'role', label: 'Cluster Type' },
        { key: 'value', label: 'Monthly Flow (MT)', align: 'right' },
      ]}
    >
      <GeoMap {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

// 6. Accessible Patterns and Region Choropleth
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'State-wise Automotive Stamping Consumption Density',
    subtitle: 'High-contrast textured region fills with keyboard accessible selection and data modal',
    width: '100%',
    height: 520,
    variant: 'choropleth',
    patternFills: true,
    unit: '% Allocation',
    regions: REGIONS_DATA,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-CHOROPLETH-REGIONS"
      title="State-wise Automotive Stamping Consumption Density"
      subtitle="High-contrast textured region fills with keyboard accessible selection and data modal"
      shift="Shift A (06:00 – 14:00 IST)"
      defaultView="table"
      kpis={[
        { label: 'Maharashtra Cluster', value: '88% Allocation', sub: 'Pune & Nashik Belt', tone: 'success' },
        { label: 'Tamil Nadu Hub', value: '82% Allocation', sub: 'Chennai Export Corridor', tone: 'success' },
        { label: 'NCR Auto Belt', value: '79% Allocation', sub: 'Manesar & Gurugram', tone: 'success' },
        { label: 'Gujarat Auto Belt', value: '74% Allocation', sub: 'Sanand EV Corridor', tone: 'success' },
      ]}
      uclLimit="100% (Full Capacity Allocation)"
      lclLimit="50% (Minimum Economical Run)"
      tableData={REGIONS_DATA}
      tableColumns={[
        { key: 'id', label: 'Region Code' },
        { key: 'label', label: 'State / Industrial Cluster' },
        { key: 'category', label: 'Classification' },
        { key: 'value', label: 'Consumption Density (%)', align: 'right' },
      ]}
    >
      <GeoMap {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    title: 'Outbound Dispatch Status',
    subtitle: 'Live corridor health',
    width: '100%',
    height: 280,
    variant: 'route',
    showSearch: false,
    showLayerControls: false,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-DISPATCH-MINI"
      title="Outbound Dispatch Status"
      subtitle="Live corridor health"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Trucks Dispatched', value: '14 Loads', sub: 'Shift A Cumulative', tone: 'success' },
        { label: 'En-Route Trucks', value: '28 Active', sub: 'On Scheduled Time', tone: 'success' },
        { label: 'Gate Exit Pace', value: '1 Truck / 25m', sub: 'Nominal Turnaround', tone: 'success' },
        { label: 'Corridor Alarm', value: '0 Critical', sub: 'All Routes Clear', tone: 'success' },
      ]}
      uclLimit="20 Trucks / Shift (Max Dock Cap)"
      lclLimit="8 Trucks / Shift (Min Outbound)"
      tableData={ROUTES_DATA.slice(0, 3)}
      tableColumns={[
        { key: 'label', label: 'Dispatch Route' },
        { key: 'transitHours', label: 'Transit (Hrs)', align: 'right' },
        { key: 'status', label: 'Status' },
      ]}
    >
      <GeoMap {...args} title="" subtitle="" />
    </EnterpriseChartStoryShell>
  ),
};
