import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toast, Button } from '@ds/react';

const meta: Meta<typeof Toast> = {
  title: 'Components/Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Toast>;

export const InteractiveTriggerSuite: Story = {
  render: () => {
    const [msg, _setMsg] = useState('Work order WO-4912 scheduled.');
    return (
      <div style={{ padding: '24px' }}>
        <Button variant="primary" onClick={() => alert(msg)}>Trigger Shift Toast</Button>
      </div>
    );
  },
};

export const SuccessToast: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ padding: '12px 16px', backgroundColor: '#F0FDF4', borderLeft: '4px solid #15803D', borderRadius: '6px', maxWidth: '360px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ fontWeight: 600, fontSize: '14px', color: '#166534' }}>Tool Calibrated</div>
        <div style={{ fontSize: '12px', color: '#15803D' }}>Micrometer Station 3 certification saved.</div>
      </div>
    </div>
  ),
};

export const WarningToast: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ padding: '12px 16px', backgroundColor: '#FFFBEB', borderLeft: '4px solid #b45309', borderRadius: '6px', maxWidth: '360px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ fontWeight: 600, fontSize: '14px', color: '#92400E' }}>Thermal Load High</div>
        <div style={{ fontSize: '12px', color: '#B45309' }}>Spindle package reached 82°C.</div>
      </div>
    </div>
  ),
};

export const CriticalErrorToast: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ padding: '12px 16px', backgroundColor: '#FEF2F2', borderLeft: '4px solid #b91c1c', borderRadius: '6px', maxWidth: '360px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ fontWeight: 600, fontSize: '14px', color: '#991B1B' }}>Emergency Trip</div>
        <div style={{ fontSize: '12px', color: '#B91C1C' }}>Press Line 2 E-stop manually engaged.</div>
      </div>
    </div>
  ),
};

export const WithActionLink: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ padding: '12px 16px', backgroundColor: '#0F172A', color: '#FFF', borderRadius: '6px', maxWidth: '400px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px' }}>Firmware patch ready to install.</span>
        <button style={{ color: '#60A5FA', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Apply Now</button>
      </div>
    </div>
  ),
};
