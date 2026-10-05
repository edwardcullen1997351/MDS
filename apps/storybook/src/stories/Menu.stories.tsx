import { Menu } from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';

const meta: Meta<typeof Menu> = {
  title: 'Components/Core/Menu',
  component: Menu,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Menu>;

export const DefaultDropdown: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '240px' }}>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px', backgroundColor: '#FFF', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '8px 12px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>View Telemetry</div>
        <div style={{ padding: '8px 12px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>Export CSV Data</div>
        <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '4px 0' }} />
        <div style={{ padding: '8px 12px', fontSize: '13px', fontWeight: 500, color: '#b91c1c', cursor: 'pointer' }}>Decommission Station</div>
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '240px' }}>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px', backgroundColor: '#FFF' }}>
        <div style={{ padding: '8px 12px', fontSize: '13px', display: 'flex', gap: '8px', cursor: 'pointer' }}><span>📊</span><span>Analytics</span></div>
        <div style={{ padding: '8px 12px', fontSize: '13px', display: 'flex', gap: '8px', cursor: 'pointer' }}><span>⚙️</span><span>Parameters</span></div>
        <div style={{ padding: '8px 12px', fontSize: '13px', display: 'flex', gap: '8px', cursor: 'pointer' }}><span>🔒</span><span>Lock Station</span></div>
      </div>
    </div>
  ),
};

export const WithDividers: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '240px' }}>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px' }}>
        <div style={{ padding: '6px 12px', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>OPERATOR TOOLS</div>
        <div style={{ padding: '8px 12px', fontSize: '13px' }}>Jog Axis Manual</div>
        <div style={{ height: '1px', backgroundColor: '#E2E8F0', margin: '4px 0' }} />
        <div style={{ padding: '6px 12px', fontSize: '11px', color: '#64748B', fontWeight: 600 }}>SUPERVISOR TOOLS</div>
        <div style={{ padding: '8px 12px', fontSize: '13px' }}>Override Limits</div>
      </div>
    </div>
  ),
};

export const WithDangerAction: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '240px' }}>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px' }}>
        <div style={{ padding: '8px 12px', fontSize: '13px' }}>Calibrate Axis</div>
        <div style={{ padding: '8px 12px', fontSize: '13px', color: '#b91c1c', fontWeight: 600 }}>Emergency Halt All</div>
      </div>
    </div>
  ),
};

export const DisabledItems: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '240px' }}>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '6px' }}>
        <div style={{ padding: '8px 12px', fontSize: '13px' }}>Available Option</div>
        <div style={{ padding: '8px 12px', fontSize: '13px', color: '#64748B', cursor: 'not-allowed' }}>Locked (Admin Only)</div>
      </div>
    </div>
  ),
};
