import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from '@ds/react';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Core/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Tabs>;

export const DefaultUnderline: Story = {
  render: () => {
    const [tab, setTab] = useState('telemetry');
    return (
      <div style={{ padding: '24px', maxWidth: '500px' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #E2E8F0', gap: '24px' }}>
          {['telemetry', 'alarms', 'maintenance'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 0',
                border: 'none',
                background: 'none',
                borderBottom: tab === t ? '2px solid #2563EB' : '2px solid transparent',
                marginBottom: '-2px',
                color: tab === t ? '#2563EB' : '#64748B',
                fontWeight: tab === t ? 600 : 500,
                fontSize: '14px',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

export const PillSegmented: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'inline-flex', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
        <button style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: '#FFF', fontWeight: 600, fontSize: '13px' }}>Shift A</button>
        <button style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#64748B', fontSize: '13px' }}>Shift B</button>
        <button style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#64748B', fontSize: '13px' }}>Shift C</button>
      </div>
    </div>
  ),
};

export const WithBadges: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px' }}>
      <button style={{ padding: '8px 12px', border: 'none', background: '#EFF6FF', color: '#1E40AF', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>Alarms</span> <span style={{ backgroundColor: '#b91c1c', color: '#FFF', padding: '2px 6px', borderRadius: '10px', fontSize: '11px' }}>4</span>
      </button>
      <button style={{ padding: '8px 12px', border: 'none', background: '#F8FAFC', color: '#64748B', borderRadius: '6px', fontWeight: 500 }}>
        Reports
      </button>
    </div>
  ),
};

export const VerticalOrientation: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '160px', borderRight: '1px solid #E2E8F0' }}>
        <div style={{ padding: '8px 12px', fontWeight: 600, color: '#2563EB', borderLeft: '3px solid #2563EB' }}>General</div>
        <div style={{ padding: '8px 12px', color: '#64748B' }}>Calibration</div>
        <div style={{ padding: '8px 12px', color: '#64748B' }}>Network</div>
      </div>
      <div>Configuration content pane</div>
    </div>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px' }}>
      <button style={{ padding: '8px 12px', border: 'none', background: '#FFF', fontWeight: 600 }}>Active Tab</button>
      <button disabled style={{ padding: '8px 12px', border: 'none', background: '#FFF', color: '#64748B', cursor: 'not-allowed' }}>🔒 Locked Tab</button>
    </div>
  ),
};
