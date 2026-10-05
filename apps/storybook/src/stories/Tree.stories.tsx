import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Data/Tree',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const DefaultExpanded: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px', fontFamily: 'var(--font-sans, system-ui, sans-serif)', fontSize: '13px' }}>
      <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: '8px' }}>📁 Plant Hierarchy (Austin Facility)</div>
      <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div>📁 Fabrication Hall A</div>
        <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', color: '#475569' }}>
          <div>📄 Press Line 1 (Tandem 250T)</div>
          <div>📄 Press Line 2 (Blanking)</div>
        </div>
        <div>📁 Machining Bay B</div>
        <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px', color: '#475569' }}>
          <div>📄 CNC 5-Axis Mill 01</div>
          <div>📄 CNC Precision Lathe 02</div>
        </div>
      </div>
    </div>
  ),
};

export const SelectableTree: Story = {
  render: () => {
    const [selected, setSelected] = useState('Mill 01');
    return (
      <div style={{ padding: '24px', maxWidth: '380px', fontSize: '13px' }}>
        <div style={{ fontWeight: 600, marginBottom: '8px' }}>Select Monitored Asset:</div>
        {['Press Line 1', 'Mill 01', 'Robotic Welder 3'].map(item => (
          <button
            key={item}
            type="button"
            aria-current={selected === item ? 'true' : undefined}
            onClick={() => setSelected(item)}
            style={{
              display: 'block', width: '100%', textAlign: 'left', border: 0,
              padding: '6px 12px',
              borderRadius: '4px',
              backgroundColor: selected === item ? '#EFF6FF' : 'transparent',
              color: selected === item ? '#1D4ED8' : '#334155',
              fontWeight: selected === item ? 600 : 500,
              cursor: 'pointer',
            }}
          >
            {selected === item ? '▸ ' : '  '}📄 {item}
          </button>
        ))}
      </div>
    );
  },
};

export const CheckboxSelectionTree: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px', fontSize: '13px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
        <input type="checkbox" defaultChecked /> <span>Plant 1 (Select All)</span>
      </label>
      <div style={{ paddingLeft: '24px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="checkbox" defaultChecked /> <span>Sub-assembly A</span></label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><input type="checkbox" defaultChecked /> <span>Sub-assembly B</span></label>
      </div>
    </div>
  ),
};

export const CustomIconsTree: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px', fontSize: '13px' }}>
      <div>🏭 Plant Austin</div>
      <div style={{ paddingLeft: '20px', marginTop: '4px' }}>
        <div>⚡ High-Voltage Switchgear</div>
        <div>💧 Coolant Recirculation Chiller</div>
      </div>
    </div>
  ),
};

export const DisabledNode: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px', fontSize: '13px', opacity: 0.5 }}>
      <div>📁 Decommissioned Plant Area</div>
      <div style={{ paddingLeft: '20px', color: '#64748B' }}>🔒 Station 9 (Offline)</div>
    </div>
  ),
};
