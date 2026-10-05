import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Forms/RadioGroup',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const VerticalGroup: Story = {
  render: () => {
    const [shift, setShift] = useState('shift-a');
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Production Shift Assignment</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'shift-a', title: 'Shift A (Morning)', time: '06:00 - 14:30' },
            { id: 'shift-b', title: 'Shift B (Evening)', time: '14:30 - 23:00' },
            { id: 'shift-c', title: 'Shift C (Night)', time: '23:00 - 06:00' },
          ].map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <input id={`radio-${s.id}`} type="radio" name="shift" checked={shift === s.id} onChange={() => setShift(s.id)} style={{ marginTop: '2px', accentColor: '#2563EB' }} />
              <label htmlFor={`radio-${s.id}`}>
                <span style={{ display: 'block', fontSize: '14px', fontWeight: 500 }}>{s.title}</span>
                <span style={{ display: 'block', fontSize: '12px', color: '#64748B' }}>{s.time}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

export const HorizontalGroup: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Coolant Delivery Mode</div>
      <div style={{ display: 'flex', gap: '20px' }}>
        {['Flood Coolant', 'High-Pressure Mist', 'Air Blast Only'].map((mode, i) => (
          <label key={mode} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="radio" name="coolant" defaultChecked={i === 0} style={{ accentColor: '#2563EB' }} />
            <span>{mode}</span>
          </label>
        ))}
      </div>
    </div>
  ),
};

export const CardStyleRadios: Story = {
  render: () => {
    const [type, setType] = useState('routine');
    return (
      <div role="radiogroup" aria-label="Maintenance type" style={{ padding: '24px', display: 'flex', gap: '12px', maxWidth: '520px' }}>
        {[
          { id: 'routine', title: 'Routine PM', desc: 'Standard lubrication and sensor clean' },
          { id: 'overhaul', title: 'Major Overhaul', desc: 'Bearing pack & seals replacement' },
        ].map(item => (
          <label
            key={item.id}
            style={{
              flex: 1,
              padding: '16px',
              border: type === item.id ? '2px solid #2563EB' : '1px solid #CBD5E1',
              borderRadius: '8px',
              backgroundColor: type === item.id ? '#EFF6FF' : '#FFF',
              cursor: 'pointer',
            }}
          >
            <input type="radio" name="maintenance-type" value={item.id} checked={type === item.id} onChange={() => setType(item.id)} />
            <div style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A' }}>{item.title}</div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{item.desc}</div>
          </label>
        ))}
      </div>
    );
  },
};

export const ValidationError: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#b91c1c', marginBottom: '8px' }}>Select Mandatory Tool Path Strategy *</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '13px' }}><input type="radio" name="toolpath" /> High Feed Milling (Trochoidal)</label>
        <label style={{ fontSize: '13px' }}><input type="radio" name="toolpath" /> Conventional Pocketing</label>
      </div>
      <span style={{ fontSize: '12px', color: '#b91c1c', marginTop: '4px', display: 'block' }}>Please select one strategy to proceed.</span>
    </div>
  ),
};

export const DisabledOptions: Story = {
  render: () => (
    <div style={{ padding: '24px', opacity: 0.6 }}>
      <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748B', marginBottom: '8px' }}>Machine Override Modes</div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'not-allowed' }}>
        <input type="radio" disabled checked /> <span style={{ color: '#64748B' }}>CNC Lock Mode (Authorized Personnel Only)</span>
      </label>
    </div>
  ),
};
