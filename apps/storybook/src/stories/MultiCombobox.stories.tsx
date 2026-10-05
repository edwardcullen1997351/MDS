import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Forms/MultiCombobox',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState(['Marcus Vance', 'Elena Rostova']);
    const toggle = (name: string) => setSelected(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);

    return (
      <div style={{ padding: '24px', maxWidth: '440px' }}>
        <span id="story-assign-shift-crew" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Assign Shift Crew</span>
        <div role="group" aria-labelledby="story-assign-shift-crew" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '8px', minHeight: '42px', alignItems: 'center' }}>
          {selected.map(name => (
            <span key={name} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '4px 10px', borderRadius: '16px', fontSize: '12px', fontWeight: 500 }}>
              {name}
              <button onClick={() => toggle(name)} style={{ background: 'none', border: 'none', color: '#1D4ED8', cursor: 'pointer', padding: 0 }}>×</button>
            </span>
          ))}
        </div>
      </div>
    );
  },
};

export const AlarmSubscriptions: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px' }}>
      <span style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Notification Severity Subscriptions</span>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['Critical Faults (P0)', 'High Temp (P1)', 'Cycle Time Drift (P2)'].map(tag => (
          <span key={tag} style={{ backgroundColor: '#F1F5F9', color: '#334155', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  ),
};

export const WithMaxTagsTruncation: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '400px' }}>
      <span style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Monitored Sensor Channels</span>
      <div style={{ display: 'flex', gap: '6px', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px', alignItems: 'center' }}>
        <span style={{ backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>Vib-X</span>
        <span style={{ backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>Vib-Y</span>
        <span style={{ backgroundColor: '#E2E8F0', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>+14 more</span>
      </div>
    </div>
  ),
};

export const ClearAllAction: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
        <span style={{ fontWeight: 600 }}>Selected Filters (3)</span>
        <button style={{ color: '#2563EB', background: 'none', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Clear All</button>
      </div>
      <div style={{ display: 'flex', gap: '6px', padding: '8px', border: '1px solid #CBD5E1', borderRadius: '6px' }}>
        <span style={{ background: '#EFF6FF', color: '#1E40AF', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Line 1 ×</span>
        <span style={{ background: '#EFF6FF', color: '#1E40AF', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Shift A ×</span>
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px', opacity: 0.6 }}>
      <span style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#64748B' }}>Locked Work Orders</span>
      <div style={{ padding: '8px 12px', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', borderRadius: '8px', color: '#64748B', fontSize: '13px', cursor: 'not-allowed' }}>
        WO-4912, WO-4913 (In Execution)
      </div>
    </div>
  ),
};
