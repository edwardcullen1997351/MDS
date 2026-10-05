import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Forms/CheckboxGroup',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const VerticalChecklist: Story = {
  render: () => {
    const [selected, setSelected] = useState(['guard', 'estop']);
    const toggle = (v: string) => setSelected(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

    return (
      <div style={{ padding: '24px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Pre-Shift Safety Checks</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'guard', label: 'Optical light curtains aligned' },
            { id: 'estop', label: 'E-stop trip response certified' },
            { id: 'pressure', label: 'Main hydraulic reservoir >= 180 Bar' },
          ].map(item => (
            <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
              <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} style={{ accentColor: '#2563EB' }} />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  },
};

export const HorizontalInline: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Active Alarms Stream</div>
      <div style={{ display: 'flex', gap: '16px' }}>
        {['Pressure', 'Temperature', 'Vibration', 'Acoustic'].map(item => (
          <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked={item !== 'Acoustic'} style={{ accentColor: '#2563EB' }} />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </div>
  ),
};

export const SelectAllMaster: Story = {
  render: () => {
    const all = ['Sensor 1', 'Sensor 2', 'Sensor 3'];
    const [selected, setSelected] = useState<string[]>(all);
    const toggleAll = () => setSelected(selected.length === all.length ? [] : all);

    return (
      <div style={{ padding: '24px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px', marginBottom: '8px', cursor: 'pointer' }}>
          <input type="checkbox" checked={selected.length === all.length} onChange={toggleAll} style={{ accentColor: '#2563EB' }} />
          <span>Select All Telemetry Sensors ({selected.length}/{all.length})</span>
        </label>
        <div style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {all.map(s => (
            <label key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <input type="checkbox" checked={selected.includes(s)} onChange={() => setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])} style={{ accentColor: '#2563EB' }} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </div>
    );
  },
};

export const WithValidationErrors: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#b91c1c', marginBottom: '8px' }}>Mandatory Safety Signoffs (Required)</div>
      <div style={{ borderLeft: '3px solid #b91c1c', paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <input type="checkbox" /> <span>Visual weld penetration inspection performed</span>
        </label>
        <span style={{ fontSize: '12px', color: '#b91c1c' }}>You must acknowledge all safety requirements before proceeding.</span>
      </div>
    </div>
  ),
};

export const DisabledGroup: Story = {
  render: () => (
    <div style={{ padding: '24px', opacity: 0.6 }}>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>Locked Shift Handover Items</div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'not-allowed' }}>
        <input type="checkbox" disabled checked /> <span style={{ color: '#64748B' }}>Shift A Final Tonnage Tally (Locked by System)</span>
      </label>
    </div>
  ),
};
