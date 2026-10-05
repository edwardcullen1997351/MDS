import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Feedback/Snackbar',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', backgroundColor: '#0F172A', color: '#FFF', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', minWidth: '380px' }}>
        <span>Telemetry log archive saved to S3 bucket.</span>
        <button style={{ background: 'none', border: 'none', color: '#60A5FA', fontWeight: 600, cursor: 'pointer', padding: 0 }}>View File</button>
      </div>
    </div>
  ),
};

export const WithUndoAction: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    return (
      <div style={{ padding: '24px' }}>
        {visible ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', backgroundColor: '#0F172A', color: '#FFF', padding: '12px 20px', borderRadius: '8px', fontSize: '14px', minWidth: '420px' }}>
            <span>4 Work order items detached from Shift Schedule.</span>
            <button onClick={() => setVisible(false)} style={{ background: 'none', border: 'none', color: '#F59E0B', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Undo</button>
          </div>
        ) : (
          <button onClick={() => setVisible(true)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #CBD5E1', cursor: 'pointer' }}>Trigger Snackbar</button>
        )}
      </div>
    );
  },
};

export const SuccessNotification: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', backgroundColor: '#14532D', color: '#DCFCE7', padding: '12px 20px', borderRadius: '8px', fontSize: '14px' }}>
        <span>✓</span> <span>Calibration run certified for 32 stations.</span>
      </div>
    </div>
  ),
};

export const CriticalAlert: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', backgroundColor: '#7F1D1D', color: '#FEE2E2', padding: '12px 20px', borderRadius: '8px', fontSize: '14px' }}>
        <span>🛑</span> <span>SCADA gateway connection lost (Retrying...)</span>
      </div>
    </div>
  ),
};

export const BottomLeftPosition: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'inline-flex', padding: '8px 16px', backgroundColor: '#334155', color: '#FFF', borderRadius: '6px', fontSize: '13px' }}>
        Position: Bottom Left Docked
      </div>
    </div>
  ),
};
