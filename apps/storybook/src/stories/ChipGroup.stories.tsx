import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Core/ChipGroup',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const SingleSelect: Story = {
  render: () => {
    const [selected, setSelected] = useState('All');
    const options = ['All Stations', 'Press Line A', 'Robotic Welder B', 'CNC Cell C', 'Paint Shop D'];
    return (
      <div style={{ padding: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              border: selected === opt ? '1px solid #2563EB' : '1px solid #CBD5E1',
              backgroundColor: selected === opt ? '#EFF6FF' : '#FFFFFF',
              color: selected === opt ? '#1D4ED8' : '#475569',
              fontWeight: selected === opt ? 600 : 500,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    );
  },
};

export const MultiSelectTags: Story = {
  render: () => {
    const [selected, setSelected] = useState(['Vibration', 'Pressure']);
    const tags = ['Vibration', 'Temperature', 'Pressure', 'Acoustic', 'Torque'];
    const toggle = (t: string) => setSelected(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

    return (
      <div style={{ padding: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => toggle(tag)}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              border: selected.includes(tag) ? '1px solid #15803D' : '1px solid #CBD5E1',
              backgroundColor: selected.includes(tag) ? '#DCFCE7' : '#FFFFFF',
              color: selected.includes(tag) ? '#15803D' : '#475569',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {selected.includes(tag) ? '✓ ' : '+ '}{tag}
          </button>
        ))}
      </div>
    );
  },
};

export const WrapLayout: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
      {Array.from({ length: 12 }, (_, i) => (
        <span key={i} style={{ padding: '4px 10px', backgroundColor: '#F1F5F9', borderRadius: '12px', fontSize: '12px', color: '#334155' }}>
          WorkCell-0{i + 1}
        </span>
      ))}
    </div>
  ),
};

export const CompactDensity: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '4px' }}>
      {['P0 Critical', 'P1 High', 'P2 Normal'].map(p => (
        <span key={p} style={{ padding: '2px 8px', backgroundColor: '#E2E8F0', borderRadius: '8px', fontSize: '11px', fontWeight: 600, color: '#1E293B' }}>
          {p}
        </span>
      ))}
    </div>
  ),
};

export const DisabledGroup: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '8px', opacity: 0.5, cursor: 'not-allowed' }}>
      {['Manual Override', 'Auto Pilot', 'E-Stop Interlock'].map(p => (
        <button key={p} disabled style={{ padding: '6px 12px', borderRadius: '16px', border: '1px solid #CBD5E1', backgroundColor: '#F8FAFC', color: '#64748B' }}>
          {p}
        </button>
      ))}
    </div>
  ),
};
