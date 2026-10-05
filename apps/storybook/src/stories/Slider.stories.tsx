import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Forms/Slider',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState(65);
    return (
      <div style={{ padding: '24px', maxWidth: '380px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
          <span style={{ fontWeight: 600 }}>Feed Rate Override</span>
          <span style={{ color: '#2563EB', fontWeight: 600 }}>{val}%</span>
        </div>
        <input type="range" aria-label="Feed rate override" min="0" max="150" value={val} onChange={e => setVal(Number(e.target.value))} style={{ width: '100%', accentColor: '#2563EB' }} />
      </div>
    );
  },
};

export const DiscreteStepsWithTicks: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Spindle Rapid Traverse</div>
      <input type="range" aria-label="Spindle rapid traverse" min="0" max="100" step="25" defaultValue="50" style={{ width: '100%', accentColor: '#2563EB' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  ),
};

export const HighPrecisionSurge: Story = {
  render: () => {
    const [val, setVal] = useState(0.85);
    return (
      <div style={{ padding: '24px', maxWidth: '380px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
          <span style={{ fontWeight: 600 }}>Coolant Flow Rate (L/min)</span>
          <span style={{ fontWeight: 600, color: '#15803D' }}>{val.toFixed(2)} L/min</span>
        </div>
        <input type="range" aria-label="Coolant flow rate in liters per minute" min="0" max="5" step="0.05" value={val} onChange={e => setVal(Number(e.target.value))} style={{ width: '100%', accentColor: '#15803D' }} />
      </div>
    );
  },
};

export const SizingScale: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <input type="range" aria-label="Compact slider" defaultValue="30" style={{ width: '100%', height: '4px', accentColor: '#2563EB' }} />
      <input type="range" aria-label="Large slider" defaultValue="60" style={{ width: '100%', height: '8px', accentColor: '#2563EB' }} />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px', opacity: 0.6 }}>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>Laser Power (Interlock Locked)</div>
      <input type="range" aria-label="Laser power" disabled defaultValue="80" style={{ width: '100%', cursor: 'not-allowed' }} />
    </div>
  ),
};
