import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Feedback/Alert',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Info: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '540px' }}>
      <div style={{ padding: '14px 16px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', color: '#1E40AF', display: 'flex', gap: '12px' }}>
        <span>ℹ️</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>Maintenance Window Active</div>
          <div style={{ fontSize: '13px', marginTop: '2px' }}>Tandem Press Line 2 is scheduled for toolhead replacement.</div>
        </div>
      </div>
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '540px' }}>
      <div style={{ padding: '14px 16px', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', color: '#166534', display: 'flex', gap: '12px' }}>
        <span>✅</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>Calibration Complete</div>
          <div style={{ fontSize: '13px', marginTop: '2px' }}>All 32 displacement sensors verified within ±0.005mm tolerance.</div>
        </div>
      </div>
    </div>
  ),
};

export const Warning: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '540px' }}>
      <div style={{ padding: '14px 16px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', color: '#92400E', display: 'flex', gap: '12px' }}>
        <span>⚠️</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>Thermal Warning Threshold</div>
          <div style={{ fontSize: '13px', marginTop: '2px' }}>Spindle bearing temperature reached 78°C (Max safe: 85°C).</div>
        </div>
      </div>
    </div>
  ),
};

export const Critical: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '540px' }}>
      <div style={{ padding: '14px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#991B1B', display: 'flex', gap: '12px' }}>
        <span>🛑</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>Emergency Stop Tripped</div>
          <div style={{ fontSize: '13px', marginTop: '2px' }}>Sub-station optical curtain breached. Main hydraulic power isolated.</div>
        </div>
      </div>
    </div>
  ),
};

export const WithActionButton: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '540px' }}>
      <div style={{ padding: '14px 16px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', color: '#92400E', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>Lubrication Level Low</div>
          <div style={{ fontSize: '12px', marginTop: '2px' }}>Auto-lube reservoir at 15% capacity.</div>
        </div>
        <button style={{ padding: '6px 12px', backgroundColor: '#92400E', color: '#FFF', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
          Log Refill
        </button>
      </div>
    </div>
  ),
};

export const Dismissible: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '540px' }}>
      <div style={{ padding: '12px 16px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', color: '#1E40AF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px' }}>Shift B telemetry reports are ready for export.</span>
        <button style={{ background: 'none', border: 'none', color: '#1E40AF', fontSize: '16px', cursor: 'pointer' }}>×</button>
      </div>
    </div>
  ),
};
