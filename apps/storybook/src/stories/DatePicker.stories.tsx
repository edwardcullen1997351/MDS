import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Forms/DatePicker',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState('2026-09-23');
    return (
      <div style={{ padding: '24px', maxWidth: '320px' }}>
        <label htmlFor="story-datepicker-16" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Production Schedule Date</label>
        <input id="story-datepicker-16" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }} />
      </div>
    );
  },
};

export const DateRangePicker: Story = {
  render: () => {
    const [start, setStart] = useState('2026-09-01');
    const [end, setEnd] = useState('2026-09-30');
    return (
      <div style={{ padding: '24px', maxWidth: '440px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>OEE Audit Reporting Window</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input type="date" aria-label="Audit window start date" value={start} onChange={e => setStart(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }} />
          <span>to</span>
          <input type="date" aria-label="Audit window end date" value={end} onChange={e => setEnd(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }} />
        </div>
      </div>
    );
  },
};

export const WithQuickPresets: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px' }}>
      <label htmlFor="story-datepicker-43" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Shift Window</label>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        {['Today', 'Yesterday', 'Last 7 Days', 'Current Shift'].map(p => (
          <button key={p} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: '11px', cursor: 'pointer' }}>{p}</button>
        ))}
      </div>
      <input id="story-datepicker-43" type="date" defaultValue="2026-09-23" style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px', boxSizing: 'border-box' }} />
    </div>
  ),
};

export const MinMaxRestricted: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '320px' }}>
      <label htmlFor="story-datepicker-57" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Next Maintenance Window (Q3 Only)</label>
      <input id="story-datepicker-57" type="date" min="2026-07-01" max="2026-09-30" defaultValue="2026-09-25" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }} />
      <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', display: 'block' }}>Restricted to: Jul 1, 2026 - Sep 30, 2026</span>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '320px', opacity: 0.6 }}>
      <label htmlFor="story-datepicker-67" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#64748B' }}>Audit Date (Locked)</label>
      <input id="story-datepicker-67" type="date" disabled defaultValue="2026-09-01" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', color: '#64748B', cursor: 'not-allowed', boxSizing: 'border-box' }} />
    </div>
  ),
};
