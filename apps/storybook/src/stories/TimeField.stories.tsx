import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Forms/TimeField',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default24Hour: Story = {
  render: () => {
    const [time, setTime] = useState('14:30');
    return (
      <div style={{ padding: '24px', maxWidth: '280px' }}>
        <label htmlFor="story-timefield-16" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Inspection Timestamp (24h)</label>
        <input id="story-timefield-16" type="time" value={time} onChange={e => setTime(e.target.value)} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }} />
      </div>
    );
  },
};

export const ShiftTimeWindow: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '360px' }}>
      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Telemetry Sampling Window</div>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <input type="time" aria-label="Window start time" defaultValue="08:00" style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }} />
        <span>to</span>
        <input type="time" aria-label="Window end time" defaultValue="16:30" style={{ padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }} />
      </div>
    </div>
  ),
};

export const WithSecondsPrecision: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '280px' }}>
      <label htmlFor="story-timefield-39" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Trip Event Exact Time</label>
      <input id="story-timefield-39" type="time" step="1" defaultValue="10:42:18" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }} />
    </div>
  ),
};

export const SizingScale: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <input type="time" aria-label="Compact time field" defaultValue="08:00" style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '12px' }} />
      <input type="time" aria-label="Standard time field" defaultValue="12:00" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }} />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '280px', opacity: 0.6 }}>
      <label htmlFor="story-timefield-57" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#64748B' }}>Shift Start (Locked)</label>
      <input id="story-timefield-57" type="time" disabled defaultValue="06:00" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', color: '#64748B', cursor: 'not-allowed', boxSizing: 'border-box' }} />
    </div>
  ),
};
