import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Feedback/Popover',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ padding: '40px', position: 'relative' }}>
        <button onClick={() => setOpen(!open)} style={{ padding: '8px 16px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Toggle Sensor Info
        </button>
        {open && (
          <div style={{ position: 'absolute', top: '85px', left: '40px', width: '280px', backgroundColor: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 10 }}>
            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>Sensor #SN-9912</div>
            <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>Displacement probe mounted on Axis Z. Calibrated 2026-08-14.</div>
            <a href="#cert" style={{ fontSize: '12px', color: '#2563EB', textDecoration: 'underline' }}>View Metrology Cert →</a>
          </div>
        )}
      </div>
    );
  },
};

export const FilterSettingsPopover: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ border: '1px solid #CBD5E1', borderRadius: '8px', padding: '16px', backgroundColor: '#FFF', width: '260px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>Filter Telemetry Bands</div>
        {['All Channels', 'High Frequency (>10kHz)', 'Low Frequency (<100Hz)'].map(b => (
          <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '4px 0', cursor: 'pointer' }}>
            <input type="radio" name="band" defaultChecked={b.startsWith('All')} />
            <span>{b}</span>
          </label>
        ))}
      </div>
    </div>
  ),
};

export const TopPlacement: Story = {
  render: () => (
    <div style={{ padding: '60px 40px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '10px', left: '40px', padding: '10px 14px', backgroundColor: '#0F172A', color: '#FFF', borderRadius: '6px', fontSize: '12px' }}>
        ▲ Popover Placed on Top
      </div>
      <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #CBD5E1' }}>Top Anchor</button>
    </div>
  ),
};

export const RightPlacement: Story = {
  render: () => (
    <div style={{ padding: '30px 40px', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #CBD5E1' }}>Right Anchor</button>
      <div style={{ padding: '10px 14px', backgroundColor: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '12px' }}>
        ◀ Popover Placed to Right
      </div>
    </div>
  ),
};

export const WithFormFields: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ border: '1px solid #CBD5E1', borderRadius: '8px', padding: '16px', width: '280px' }}>
        <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px' }}>Set Alarm Target</div>
        <input type="number" aria-label="Alarm target" defaultValue="85" style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box' }} />
        <button style={{ width: '100%', padding: '6px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>Save Target</button>
      </div>
    </div>
  ),
};
