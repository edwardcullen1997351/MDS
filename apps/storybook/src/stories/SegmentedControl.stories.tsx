import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Core/SegmentedControl',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [val, setVal] = useState('raw');
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
          {['Raw Telemetry', 'Aggregated (5m)', 'FFT Spectrum'].map(item => (
            <button
              key={item}
              onClick={() => setVal(item)}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: val === item ? '#FFFFFF' : 'transparent',
                color: val === item ? '#0F172A' : '#64748B',
                fontWeight: val === item ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: val === item ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

export const TwoOptions: Story = {
  render: () => {
    const [mode, setMode] = useState('auto');
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
          <button onClick={() => setMode('auto')} style={{ padding: '6px 20px', borderRadius: '6px', border: 'none', background: mode === 'auto' ? '#FFF' : 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Auto Mode</button>
          <button onClick={() => setMode('manual')} style={{ padding: '6px 20px', borderRadius: '6px', border: 'none', background: mode === 'manual' ? '#FFF' : 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Manual Jog</button>
        </div>
      </div>
    );
  },
};

export const WithIcons: Story = {
  render: () => {
    const [view, setView] = useState('grid');
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ display: 'inline-flex', backgroundColor: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
          <button onClick={() => setView('grid')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: view === 'grid' ? '#FFF' : 'none', cursor: 'pointer' }}>📊 Charts</button>
          <button onClick={() => setView('table')} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: view === 'table' ? '#FFF' : 'none', cursor: 'pointer' }}>📋 Data Table</button>
        </div>
      </div>
    );
  },
};

export const CompactSize: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'inline-flex', backgroundColor: '#F1F5F9', padding: '2px', borderRadius: '6px' }}>
        <button style={{ padding: '4px 10px', borderRadius: '4px', border: 'none', background: '#FFF', fontSize: '11px', fontWeight: 600 }}>1H</button>
        <button style={{ padding: '4px 10px', borderRadius: '4px', border: 'none', background: 'transparent', fontSize: '11px', color: '#64748B' }}>24H</button>
        <button style={{ padding: '4px 10px', borderRadius: '4px', border: 'none', background: 'transparent', fontSize: '11px', color: '#64748B' }}>7D</button>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'inline-flex', backgroundColor: '#F8FAFC', padding: '4px', borderRadius: '8px', opacity: 0.5, cursor: 'not-allowed' }}>
        <button disabled style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: '#E2E8F0', color: '#64748B' }}>Locked Option 1</button>
        <button disabled style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#64748B' }}>Locked Option 2</button>
      </div>
    </div>
  ),
};
