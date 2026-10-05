import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { NetworkDiagram, Button, ToastProvider, useToast } from '@ds/react';
import { EnterpriseChartStoryShell, KPIItem } from './components/EnterpriseChartStoryShell';

const meta: Meta<typeof NetworkDiagram> = {
  title: 'Data Visualization/NetworkDiagram',
  component: NetworkDiagram,
  parameters: {
    docs: {
      description: {
        component:
          'NetworkDiagram models plant OT/IT network topologies, sub-assembly component dependency graphs, SCADA Ethernet bus trees, and multi-tier supplier networks for Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).',
      },
    },
  },
  argTypes: {
    layout: {
      control: 'select',
      options: ['force', 'circular'],
    },
    directed: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof NetworkDiagram>;

const DEFAULT_NODES = [
  { id: 'mes-server', label: 'Central MES Server (Pune HQ)', category: 'Core IT', size: 22, status: 'nominal' as const },
  { id: 'scada-gw', label: 'PL-04 SCADA Gateway', category: 'Edge Gateway', size: 18, status: 'nominal' as const },
  { id: 'plc-press', label: 'Press Shop PLC (Siemens S7-1500)', category: 'Shop PLC', size: 14, status: 'nominal' as const },
  { id: 'plc-cnc', label: 'CNC Bay PLC (Fanuc 31i)', category: 'Shop PLC', size: 14, status: 'nominal' as const },
  { id: 'plc-weld', label: 'Robotic Weld PLC (ABB IRC5)', category: 'Shop PLC', size: 14, status: 'nominal' as const },
  { id: 'plc-paint', label: 'E-Coat Bath PLC (Rockwell)', category: 'Shop PLC', size: 14, status: 'warning' as const },
  { id: 'iot-vib', label: 'Spindle Vibration Edge Node', category: 'Sensors', size: 10, status: 'nominal' as const },
  { id: 'iot-power', label: '33kV Substation Meter RTU', category: 'Sensors', size: 10, status: 'nominal' as const },
];

const DEFAULT_LINKS = [
  { source: 'mes-server', target: 'scada-gw', value: 10, label: '10 Gbps Fiber' },
  { source: 'scada-gw', target: 'plc-press', value: 5, label: 'Profinet Ring' },
  { source: 'scada-gw', target: 'plc-cnc', value: 5, label: 'EtherNet/IP' },
  { source: 'scada-gw', target: 'plc-weld', value: 5, label: 'Profinet' },
  { source: 'scada-gw', target: 'plc-paint', value: 3, label: 'Modbus TCP' },
  { source: 'plc-cnc', target: 'iot-vib', value: 2, label: 'IO-Link' },
  { source: 'scada-gw', target: 'iot-power', value: 2, label: 'RS485/Modbus' },
];

const CIRCULAR_NODES = [
  { id: 'c-diff', label: 'Differential Housing', category: 'Castings', size: 18 },
  { id: 'c-crown', label: 'Crown Wheel Gear', category: 'Forgings', size: 16 },
  { id: 'c-pinion', label: 'Pinion Shaft', category: 'Forgings', size: 14 },
  { id: 'c-bearing-l', label: 'Taper Roller Bearing (LH)', category: 'Bearings', size: 12 },
  { id: 'c-bearing-r', label: 'Taper Roller Bearing (RH)', category: 'Bearings', size: 12 },
  { id: 'c-seal', label: 'Oil Lip Seal', category: 'Elastomers', size: 10 },
  { id: 'c-bolt', label: 'M12 Flange Bolts (x10)', category: 'Hardware', size: 10 },
];

const CIRCULAR_LINKS = [
  { source: 'c-diff', target: 'c-crown', value: 6 },
  { source: 'c-crown', target: 'c-pinion', value: 8 },
  { source: 'c-diff', target: 'c-bearing-l', value: 4 },
  { source: 'c-diff', target: 'c-bearing-r', value: 4 },
  { source: 'c-pinion', target: 'c-seal', value: 3 },
  { source: 'c-crown', target: 'c-bolt', value: 5 },
];

const BOTTLENECK_NODES = [
  { id: 'pl-04', label: 'PL-04 Chakan Assembly', category: 'Assembly', size: 24, status: 'nominal' as const },
  { id: 'v-cast', label: 'Kolhapur Foundry (Single Source)', category: 'Castings', size: 18, status: 'critical' as const },
  { id: 'v-stamp', label: 'Waluj Stamping Satellite', category: 'Stamping', size: 14, status: 'nominal' as const },
  { id: 'v-heat', label: 'Bhosari Heat Treatment Co.', category: 'Processing', size: 14, status: 'warning' as const },
  { id: 'v-bearing', label: 'SKF Pune (Dual Sourced)', category: 'Standard Spares', size: 12, status: 'nominal' as const },
  { id: 'v-fag', label: 'Schaeffler Baroda (Dual Sourced)', category: 'Standard Spares', size: 12, status: 'nominal' as const },
];

const BOTTLENECK_LINKS = [
  { source: 'v-cast', target: 'pl-04', value: 8, label: 'Single Source Risk' },
  { source: 'v-stamp', target: 'pl-04', value: 5 },
  { source: 'v-heat', target: 'pl-04', value: 4 },
  { source: 'v-bearing', target: 'pl-04', value: 3 },
  { source: 'v-fag', target: 'pl-04', value: 3 },
];

const MESH_NODES = [
  { id: 'n-core', label: 'Core Switch PL-04', category: 'Core', size: 22 },
  { id: 'n-dist-1', label: 'Bay 1 Dist Switch', category: 'Distribution', size: 16 },
  { id: 'n-dist-2', label: 'Bay 2 Dist Switch', category: 'Distribution', size: 16 },
  { id: 'n-dist-3', label: 'Bay 3 Dist Switch', category: 'Distribution', size: 16 },
  { id: 'n-p1', label: 'Press 800T', category: 'Machine', size: 12 },
  { id: 'n-p2', label: 'Press 1200T', category: 'Machine', size: 12 },
  { id: 'n-cnc1', label: 'CNC Makino 1', category: 'Machine', size: 12 },
  { id: 'n-cnc2', label: 'CNC Mazak 2', category: 'Machine', size: 12 },
  { id: 'n-weld1', label: 'ABB Robot 1', category: 'Machine', size: 12 },
  { id: 'n-weld2', label: 'ABB Robot 2', category: 'Machine', size: 12 },
  { id: 'n-cmm', label: 'Zeiss CMM QA', category: 'Machine', size: 12 },
  { id: 'n-etp', label: 'ETP Waste Plant', category: 'Utilities', size: 12 },
];

const MESH_LINKS = [
  { source: 'n-core', target: 'n-dist-1', value: 8 },
  { source: 'n-core', target: 'n-dist-2', value: 8 },
  { source: 'n-core', target: 'n-dist-3', value: 8 },
  { source: 'n-dist-1', target: 'n-p1', value: 4 },
  { source: 'n-dist-1', target: 'n-p2', value: 4 },
  { source: 'n-dist-2', target: 'n-cnc1', value: 4 },
  { source: 'n-dist-2', target: 'n-cnc2', value: 4 },
  { source: 'n-dist-3', target: 'n-weld1', value: 4 },
  { source: 'n-dist-3', target: 'n-weld2', value: 4 },
  { source: 'n-dist-2', target: 'n-cmm', value: 4 },
  { source: 'n-dist-3', target: 'n-etp', value: 4 },
];

const ESTOP_NODES = [
  { id: 'es-master', label: 'Master E-Stop Controller', category: 'Safety Master', size: 20 },
  { id: 'es-bay1', label: 'Press Light Curtain Relays', category: 'Sensors', size: 14 },
  { id: 'es-bay2', label: 'CNC Door Interlock Switch', category: 'Sensors', size: 14 },
  { id: 'es-bay3', label: 'Robot Safety Mat Barrier', category: 'Sensors', size: 14 },
  { id: 'es-trip', label: 'Main Power Feeder Shunt Trip', category: 'Actuators', size: 16 },
];

const ESTOP_LINKS = [
  { source: 'es-bay1', target: 'es-master', value: 5 },
  { source: 'es-bay2', target: 'es-master', value: 5 },
  { source: 'es-bay3', target: 'es-master', value: 5 },
  { source: 'es-master', target: 'es-trip', value: 10, label: 'Trip Trigger' },
];

const COMPACT_NODES = [
  { id: 'gw', label: 'GW-01', category: 'Gateway', size: 16 },
  { id: 's1', label: 'Press-1', category: 'PLC', size: 12 },
  { id: 's2', label: 'Press-2', category: 'PLC', size: 12 },
  { id: 's3', label: 'Crane-1', category: 'Drive', size: 10 },
];

const COMPACT_LINKS = [
  { source: 'gw', target: 's1', value: 3 },
  { source: 'gw', target: 's2', value: 3 },
  { source: 'gw', target: 's3', value: 2 },
];

// 1. Default Baseline Story
export const Default: Story = {
  args: {
    title: 'PL-04 Plant OT Network & SCADA Gateway Topology',
    subtitle: 'Industrial Ethernet ring connecting PLC hubs, edge gateways, and ERP MES',
    width: 780,
    height: 480,
    layout: 'force',
    directed: true,
    nodes: DEFAULT_NODES,
    links: DEFAULT_LINKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SCADA-TOPOLOGY"
      title="PL-04 Plant OT Network & SCADA Gateway Topology"
      subtitle="Industrial Ethernet ring connecting PLC hubs, edge gateways, and ERP MES"
      shift="Plant OT Network Infrastructure"
      kpis={[
        { label: 'Active Network Nodes', value: '8 Devices', sub: '100% Core IT Online', tone: 'success' },
        { label: 'Profinet Ring Latency', value: '< 2 ms', sub: 'Deterministic Cycle', tone: 'success' },
        { label: 'Device Warning', value: 'Paint PLC', sub: 'Modbus TCP Packet Loss', tone: 'warning' },
        { label: 'Bandwidth Utilization', value: '18.4%', sub: '10 Gbps Backbone', tone: 'success' },
      ]}
      uclLimit="20 ms (Max Tolerable Jitter)"
      lclLimit="0.5 ms (Baseline Ring Speed)"
      tableData={DEFAULT_NODES}
      tableColumns={[
        { key: 'id', label: 'Node Identifier' },
        { key: 'label', label: 'Equipment / Controller' },
        { key: 'category', label: 'Network Tier' },
        { key: 'status', label: 'Health Status' },
      ]}
    >
      <NetworkDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 2. Circular Layout Variant
export const Variants: Story = {
  args: {
    title: 'Transaxle Component Assembly BOM Relationship Graph',
    subtitle: 'Circular topological graph of mating sub-assemblies and fastener dependencies',
    width: 780,
    height: 480,
    layout: 'circular',
    directed: false,
    nodes: CIRCULAR_NODES,
    links: CIRCULAR_LINKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-BOM-CIRCULAR"
      title="Transaxle Component Assembly BOM Relationship Graph"
      subtitle="Circular topological graph of mating sub-assemblies and fastener dependencies"
      shift="Engineering Release BOM"
      kpis={[
        { label: 'Total BOM Components', value: '7 Parts', sub: 'Transaxle TA-EV-500', tone: 'success' },
        { label: 'Mating Interlocks', value: '6 Interfaces', sub: 'Zero Tolerancing Conflict', tone: 'success' },
        { label: 'Critical Mating Gear', value: 'Crown & Pinion', sub: 'DIN Class 5 Mesh', tone: 'neutral' },
        { label: 'Hardware Fasteners', value: '10x M12 Bolts', sub: 'Torqued to 85 Nm', tone: 'success' },
      ]}
      uclLimit="100% Fitment Clearance"
      lclLimit="0 Interference"
      tableData={CIRCULAR_NODES}
      tableColumns={[
        { key: 'id', label: 'Part Number' },
        { key: 'label', label: 'Sub-Assembly Component' },
        { key: 'category', label: 'Material Class' },
        { key: 'size', label: 'Weight Score', align: 'right' },
      ]}
    >
      <NetworkDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 3. Threshold and Bottleneck Graph
export const ThresholdAndControlLimits: Story = {
  args: {
    title: 'Tier-2 Supplier Risk & Bottleneck Critical Nodes',
    subtitle: 'Highlighting critical vendor single-points of failure (Red nodes indicate single source)',
    width: 780,
    height: 460,
    layout: 'force',
    directed: true,
    nodes: BOTTLENECK_NODES,
    links: BOTTLENECK_LINKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SUPPLIER-RISK"
      title="Tier-2 Supplier Risk & Bottleneck Critical Nodes"
      subtitle="Highlighting critical vendor single-points of failure (Red nodes indicate single source)"
      shift="Supply Chain Risk Audit"
      kpis={[
        { label: 'Single-Source Risk', value: 'Kolhapur Foundry', sub: '100% Differential Castings', tone: 'critical' },
        { label: 'Dual-Sourced Nodes', value: 'SKF & Schaeffler', sub: 'Bearings Redundancy OK', tone: 'success' },
        { label: 'Heat Treatment Lead', value: 'Bhosari Heat Treat', sub: 'Capacity Warning (88%)', tone: 'warning' },
        { label: 'Supply Resilience', value: '76.2%', sub: 'Target > 85.0%', tone: 'warning' },
      ]}
      uclLimit="100% Dual Sourced"
      lclLimit="0 Single-Point Failures"
      tableData={BOTTLENECK_NODES}
      tableColumns={[
        { key: 'id', label: 'Vendor Node' },
        { key: 'label', label: 'Supplier Name' },
        { key: 'category', label: 'Supply Scope' },
        { key: 'status', label: 'Risk Rating' },
      ]}
    >
      <NetworkDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

const RESTORED_BLE_NODES = [
  { id: 'ble-gw', label: 'Line 5 BLE 5.2 Hub (Gateway)', category: 'Gateway', size: 18, status: 'nominal' as const },
  { id: 'vib-01', label: 'Bay 5 Spindle Vib Node 1', category: 'Sensors', size: 12, status: 'nominal' as const },
  { id: 'vib-02', label: 'Bay 5 Spindle Vib Node 2', category: 'Sensors', size: 12, status: 'nominal' as const },
  { id: 'temp-01', label: 'Bay 5 Coolant Temp Node', category: 'Sensors', size: 12, status: 'nominal' as const },
  { id: 'press-01', label: 'Bay 5 Hyd Pressure Node', category: 'Sensors', size: 12, status: 'nominal' as const },
];

const RESTORED_BLE_LINKS = [
  { source: 'ble-gw', target: 'vib-01', value: 4, label: '-55 dBm' },
  { source: 'ble-gw', target: 'vib-02', value: 4, label: '-58 dBm' },
  { source: 'ble-gw', target: 'temp-01', value: 3, label: '-62 dBm' },
  { source: 'ble-gw', target: 'press-01', value: 3, label: '-60 dBm' },
];

const NetworkDiagramMissingTelemetryInteractiveStory: React.FC = () => {
  const toast = useToast();
  const [telemetryState, setTelemetryState] = useState<'offline' | 'reconnecting' | 'restored'>('offline');

  const handleReconnect = () => {
    setTelemetryState('reconnecting');
    toast.info('BLE Gateway Scanning', 'Initiating 2.4 GHz RF chirp and advertising packet capture on CH-37/38/39...');

    setTimeout(() => {
      setTelemetryState('restored');
      toast.success('BLE Mesh Synchronized', 'Connected 4 sensor nodes to Line 5 industrial gateway with RSSI > -65 dBm.');
    }, 1200);
  };

  const handleDisconnect = () => {
    setTelemetryState('offline');
    toast.error('BLE Gateway Offline', 'Simulated gateway power interruption on Line 5 BLE hub.');
  };

  const kpis: KPIItem[] = telemetryState === 'restored'
    ? [
        { label: 'BLE Gateway', value: 'ONLINE (CH-37)', sub: 'Bluetooth 5.2 Mesh Active', tone: 'success' },
        { label: 'Discovered Sensors', value: '4 / 4 Nodes', sub: 'All Endpoints Synced', tone: 'success' },
        { label: 'Avg Signal RSSI', value: '-58.8 dBm', sub: 'Strong Signal Margin', tone: 'success' },
        { label: 'Packet Error Rate', value: '0.01%', sub: 'Within 0.1% SLA', tone: 'success' },
      ]
    : [
        { label: 'BLE Gateway', value: 'SCANNING / OFFLINE', sub: 'Awaiting Beacon Broadcast', tone: 'critical' },
        { label: 'Discovered Sensors', value: '0 / 16 Nodes', sub: 'Pairing Handshake Pending', tone: 'neutral' },
        { label: 'Mesh Channel', value: 'CH-37 Advertising', sub: '2.4 GHz Industrial Radio', tone: 'neutral' },
        { label: 'Link Quality (RSSI)', value: 'N/A', sub: 'No Active Transceivers', tone: 'neutral' },
      ];

  return (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-BLE-MESH"
      title="Line 5 Wireless Mesh Sensor Network Topology"
      subtitle="BLE gateway advertising and multi-sensor pairing status"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={kpis}
      uclLimit="-40 dBm (Strong Signal)"
      lclLimit="-85 dBm (Dropout Threshold)"
      tableData={telemetryState === 'restored' ? RESTORED_BLE_NODES : []}
      tableColumns={[
        { key: 'id', label: 'Node MAC / Tag' },
        { key: 'label', label: 'Sensor Device' },
        { key: 'category', label: 'Device Class' },
        { key: 'status', label: 'RF Status' },
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
                ? 'BLE GATEWAY OFFLINE: Wireless mesh coordinator unreachable (Zero beacon responses)'
                : telemetryState === 'reconnecting'
                ? 'RF SCANNING: Scanning 2.4 GHz channels 37, 38, and 39...'
                : 'BLE MESH ONLINE: 4 wireless telemetry nodes synchronized'}
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

        <NetworkDiagram
          title="Line 5 Wireless Mesh Sensor Network Topology"
          subtitle="BLE gateway advertising and multi-sensor pairing status"
          width={700}
          height={340}
          nodes={telemetryState === 'restored' ? RESTORED_BLE_NODES : []}
          links={telemetryState === 'restored' ? RESTORED_BLE_LINKS : []}
        />
      </div>
    </EnterpriseChartStoryShell>
  );
};

// 4. Missing Telemetry & Empty State
export const MissingTelemetryAndEmpty: Story = {
  render: () => (
    <ToastProvider position="top-right">
      <NetworkDiagramMissingTelemetryInteractiveStory />
    </ToastProvider>
  ),
};

// 5. High Density Multi-Shift Network
export const HighDensityMultiShift: Story = {
  args: {
    title: '20-Node Plant OT Sensor & Control Infrastructure',
    subtitle: 'Chakan PL-04 Full Plant Multi-Echelon Network Mesh',
    width: 840,
    height: 520,
    layout: 'force',
    directed: true,
    searchable: true,
    zoomable: true,
    nodes: MESH_NODES,
    links: MESH_LINKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-FULL-PLANT-MESH"
      title="20-Node Plant OT Sensor & Control Infrastructure"
      subtitle="Chakan PL-04 Full Plant Multi-Echelon Network Mesh"
      shift="Continuous 24/7 Monitored"
      kpis={[
        { label: 'Total Grid Nodes', value: '12 Active Units', sub: 'Covering 3 Bays + Utilities', tone: 'success' },
        { label: 'Distribution Links', value: '11 Uplinks', sub: 'Full Mesh Redundancy', tone: 'success' },
        { label: 'Core Switch Load', value: '24.2%', sub: 'Cisco Industrial Catalyst', tone: 'success' },
        { label: 'Network Uptime', value: '99.98%', sub: 'MTBF > 50,000 hrs', tone: 'success' },
      ]}
      uclLimit="50 Nodes (Subnet Capacity)"
      lclLimit="10 Nodes (Minimum Operating Infrastructure)"
      tableData={MESH_NODES}
      tableColumns={[
        { key: 'id', label: 'Node ID' },
        { key: 'label', label: 'Workcenter / Switch' },
        { key: 'category', label: 'Hierarchy Tier' },
        { key: 'size', label: 'Priority Score', align: 'right' },
      ]}
    >
      <NetworkDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 6. Accessible Patterns and Searchable Filter
export const AccessiblePatternsAndTable: Story = {
  args: {
    title: 'Safety Interlock Relay Graph (Emergency Stop Circuit)',
    subtitle: 'Accessible keyboard navigation, searchable nodes, and high-contrast color categories',
    width: 760,
    height: 440,
    searchable: true,
    nodes: ESTOP_NODES,
    links: ESTOP_LINKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-SAFETY-ESTOP"
      title="Safety Interlock Relay Graph (Emergency Stop Circuit)"
      subtitle="Accessible keyboard navigation, searchable nodes, and high-contrast color categories"
      shift="Plant Safety Interlock Loop (SIL-3)"
      defaultView="table"
      kpis={[
        { label: 'Safety Integrity Level', value: 'SIL-3 / Cat 4', sub: 'Dual Channel Redundant', tone: 'success' },
        { label: 'Master E-Stop', value: 'HEALTHY', sub: 'Pilz PNOZ Master', tone: 'success' },
        { label: 'Light Curtain Relays', value: 'Arm Armed (Bay 1)', sub: 'Response Time < 15ms', tone: 'success' },
        { label: 'Shunt Trip Actuator', value: 'Armed (24VDC)', sub: 'Feeder Breaker Trip', tone: 'success' },
      ]}
      uclLimit="20 ms (Max Tripping Time)"
      lclLimit="0 ms"
      tableData={ESTOP_NODES}
      tableColumns={[
        { key: 'id', label: 'Safety Tag' },
        { key: 'label', label: 'Safety Device / Sensor' },
        { key: 'category', label: 'Safety Role' },
      ]}
    >
      <NetworkDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};

// 7. Compact Dashboard Widget
export const CompactDashboardWidget: Story = {
  args: {
    title: 'Bay 1 Local Bus Mesh',
    subtitle: '5 active nodes',
    width: 360,
    height: 240,
    initialSpread: 0.85,
    searchable: false,
    zoomable: false,
    nodes: COMPACT_NODES,
    links: COMPACT_LINKS,
  },
  render: (args) => (
    <EnterpriseChartStoryShell
      stationEyebrow="Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune"
      stationId="CELL-BUS-BAY1"
      title="Bay 1 Local Bus Mesh"
      subtitle="5 active nodes"
      shift="Shift A (06:00 – 14:00 IST)"
      kpis={[
        { label: 'Active Nodes', value: '4 Devices', sub: 'All Polling OK', tone: 'success' },
        { label: 'Profinet Bus Load', value: '12.4%', sub: 'Nominal', tone: 'success' },
        { label: 'Crane-1 Drive', value: 'Connected', sub: 'VFD Speed Feed', tone: 'success' },
        { label: 'Error Frame Count', value: '0 frames', sub: 'Zero CRC Errors', tone: 'success' },
      ]}
      uclLimit="100 Errors/hr (Alarm Threshold)"
      lclLimit="0 Errors/hr (Clean Bus)"
      tableData={COMPACT_NODES}
      tableColumns={[
        { key: 'id', label: 'Node' },
        { key: 'label', label: 'Device Tag' },
        { key: 'category', label: 'Type' },
      ]}
    >
      <NetworkDiagram {...args} />
    </EnterpriseChartStoryShell>
  ),
};
