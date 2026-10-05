import {
Badge,
Text
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Navigation Systems/04 Tab Navigation',
  parameters: {
    docs: {
      description: {
        component:
          '**L3 Peer View Navigation System (§01–§14)**\n\n' +
          'Provides in-page workspace view switching and peer panel partitioning.\n' +
          'Owns tablist semantics, keyboard roving arrow navigation, and route-backed panel state.\n\n' +
          '**Composition Contract:**\n' +
          '- **Required:** `Tabs`, `TabPanel`\n' +
          '- **Optional:** `Icon`, `Badge`\n\n' +
          '*Scenario:* **Work Order WO-99124 Inspection & Routing** at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Work Order Workspace Tabs
export const WorkOrderWorkspaceTabs: Story = {
  render: () => {
    const [tab, setTab] = useState('routing');

    return (
      <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
        <div style={{ marginBottom: '16px' }}>
          <Text size="xs" color="secondary" weight="semibold">WORK ORDER WORKSPACE (WO-99124)</Text>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0 0' }}>Brake Caliper Mounting Bracket (BRK-4820-A)</h2>
        </div>

        <div role="tablist" aria-label="Work order workspace views" style={{ display: 'flex', borderBottom: '2px solid #E2E8F0', gap: '20px' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'routing', label: 'Routing Operations (4)' },
            { id: 'bom', label: 'BOM & Materials' },
            { id: 'telemetry', label: 'CMM Telemetry' },
            { id: 'quality', label: 'NC Deviations', badge: '1' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              style={{
                padding: '10px 4px',
                border: 'none',
                background: 'none',
                borderBottom: tab === item.id ? '2px solid #2563EB' : '2px solid transparent',
                marginBottom: '-2px',
                color: tab === item.id ? '#2563EB' : '#64748B',
                fontWeight: tab === item.id ? 600 : 500,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{item.label}</span>
              {item.badge && <Badge variant="danger">{item.badge}</Badge>}
            </button>
          ))}
        </div>

        {/* Tab Panel */}
        <div role="tabpanel" style={{ padding: '20px 0' }}>
          {tab === 'routing' && (
            <div>
              <Text size="sm" weight="semibold">Op 10: Blanking (Line 2 Press) → Op 20: CNC Roughing → Op 30: 5-Axis Finish</Text>
              <Text size="xs" color="secondary" style={{ marginTop: '4px' }}>
                Assigned to Line Supervisor Sandeep Kulkarni · Shift A (IST).
              </Text>
            </div>
          )}
          {tab === 'overview' && <Text size="sm">WO-99124 batch size: 2,500 pcs · Due: 2026-09-30 (IST)</Text>}
          {tab === 'bom' && <Text size="sm">Raw material: Alloy Steel Billets 20MnCr5 (Lot LOT-2609-118)</Text>}
          {tab === 'telemetry' && <Text size="sm">Live spindle vibration: 0.14 mm/s · Coolant pressure: 72 Bar</Text>}
          {tab === 'quality' && <Text size="sm" color="brand">1 Open NC logged: Minor burr on mounting flange</Text>}
        </div>
      </div>
    );
  },
};

// 2. Shift Schedule Segmented Tabs
export const ShiftScheduleSegmentedTabs: Story = {
  render: () => {
    const [shift, setShift] = useState('A');

    return (
      <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
        <Text size="xs" color="secondary" weight="semibold" style={{ marginBottom: '8px', display: 'block' }}>
          SHOP-FLOOR SHIFT SWITCHER (CHAKAN PL-04)
        </Text>
        <div style={{ display: 'inline-flex', background: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
          {[
            { id: 'A', label: 'Shift A (06:00 – 14:00 IST)' },
            { id: 'B', label: 'Shift B (14:00 – 22:00 IST)' },
            { id: 'C', label: 'Shift C (22:00 – 06:00 IST)' },
          ].map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setShift(s.id)}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '6px',
                background: shift === s.id ? '#FFFFFF' : 'transparent',
                color: shift === s.id ? '#0F172A' : '#475569',
                fontWeight: shift === s.id ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: shift === s.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

// 3. Tabs With Badge Rollup
export const TabsWithBadgeRollup: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', gap: '16px' }}>
      <button style={{ padding: '8px 14px', background: '#EFF6FF', color: '#1D4ED8', border: 'none', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>Line 2 Telemetry</span>
        <Badge variant="brand">Live</Badge>
      </button>
      <button style={{ padding: '8px 14px', background: '#FEF2F2', color: '#991B1B', border: 'none', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>Active NCs</span>
        <Badge variant="danger">3</Badge>
      </button>
      <button style={{ padding: '8px 14px', background: '#F8FAFC', color: '#64748B', border: 'none', borderRadius: '6px', fontWeight: 500 }}>
        Maintenance Log
      </button>
    </div>
  ),
};

// 4. Vertical Maintenance Tabs
export const VerticalMaintenanceTabs: Story = {
  render: () => {
    const [tab, setTab] = useState('hydraulic');

    return (
      <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', gap: '24px' }}>
        <div style={{ width: '220px', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { id: 'hydraulic', label: 'Hydraulic Power Pack' },
            { id: 'spindle', label: 'Spindle Lubrication' },
            { id: 'coolant', label: 'Coolant Chiller' },
            { id: 'sensors', label: 'Optical Interlocks' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              style={{
                padding: '10px 12px',
                textAlign: 'left',
                border: 'none',
                background: tab === item.id ? '#EFF6FF' : 'transparent',
                color: tab === item.id ? '#1D4ED8' : '#475569',
                fontWeight: tab === item.id ? 600 : 500,
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <Text weight="semibold">Subsystem Diagnostics: {tab}</Text>
          <Text size="xs" color="secondary" style={{ marginTop: '6px' }}>
            Maintained by Tool Room Lead Priya Iyer and Maintenance Head Vikram Bhosale.
          </Text>
        </div>
      </div>
    );
  },
};

// 5. Disabled Tab Permissions
export const DisabledTabPermissions: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', gap: '16px' }}>
      <button style={{ padding: '8px 12px', background: '#EFF6FF', color: '#1D4ED8', border: 'none', borderRadius: '6px', fontWeight: 600 }}>
        Production Output
      </button>
      <button
        disabled
        title="Requires Finance / Plant Head role"
        style={{ padding: '8px 12px', background: '#F8FAFC', color: '#64748B', border: 'none', borderRadius: '6px', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        <span>🔒 Cost-Centre Financials (₹ Lakhs)</span>
      </button>
    </div>
  ),
};
