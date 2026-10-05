import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Forms/RangeSlider',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [minVal, setMinVal] = useState(30);
    const [maxVal, setMaxVal] = useState(85);
    return (
      <div style={{ padding: '24px', maxWidth: '420px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
          <span style={{ fontWeight: 600 }}>Permissible Temperature Range</span>
          <span style={{ color: '#2563EB', fontWeight: 600 }}>{minVal}°C – {maxVal}°C</span>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <input type="range" aria-label="Minimum permissible temperature" min="0" max="120" value={minVal} onChange={e => setMinVal(Number(e.target.value))} style={{ width: '50%', accentColor: '#2563EB' }} />
          <input type="range" aria-label="Maximum permissible temperature" min="0" max="120" value={maxVal} onChange={e => setMaxVal(Number(e.target.value))} style={{ width: '50%', accentColor: '#2563EB' }} />
        </div>
      </div>
    );
  },
};

export const PressureBand: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '420px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Hydraulic Line Operating Band (Bar)</div>
      <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span>Low Threshold: <strong>140 Bar</strong></span>
          <span>High Limit: <strong>220 Bar</strong></span>
        </div>
      </div>
    </div>
  ),
};

export const DiscreteSteps: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '420px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Tolerance Band Limits (± mm)</div>
      <input type="range" aria-label="Tolerance band limit in millimeters" min="0" max="0.05" step="0.005" defaultValue="0.02" style={{ width: '100%', accentColor: '#2563EB' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
        <span>0.000 mm</span>
        <span>0.025 mm</span>
        <span>0.050 mm</span>
      </div>
    </div>
  ),
};

export const SizingMatrix: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Compact Slider</div>
        <input type="range" aria-label="Compact slider" style={{ width: '100%', height: '4px', accentColor: '#2563EB' }} />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Large Dashboard Slider</div>
        <input type="range" aria-label="Large dashboard slider" style={{ width: '100%', height: '10px', accentColor: '#2563EB' }} />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '420px', opacity: 0.6 }}>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>Locked Range Band</div>
      <input type="range" aria-label="Locked range band" disabled defaultValue="50" style={{ width: '100%', cursor: 'not-allowed' }} />
    </div>
  ),
};
