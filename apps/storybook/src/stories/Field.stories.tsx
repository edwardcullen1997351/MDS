import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Forms/Field',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="story-field-15" style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>Target Spindle Speed (RPM)</label>
        <input id="story-field-15" type="number" defaultValue="12000" style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }} />
        <span style={{ fontSize: '12px', color: '#64748B' }}>Nominal operational envelope for tool HSK-63.</span>
      </div>
    </div>
  ),
};

export const RequiredField: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="story-field-27" style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>Batch Serial Identifier <span style={{ color: '#b91c1c' }}>*</span></label>
        <input id="story-field-27" type="text" placeholder="e.g. BAT-2026-901" style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }} />
      </div>
    </div>
  ),
};

export const OptionalField: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label htmlFor="story-field-secondary-operator-notes" style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>Secondary Operator Notes</label>
          <span style={{ fontSize: '12px', color: '#64748B' }}>(Optional)</span>
        </div>
        <input id="story-field-secondary-operator-notes" type="text" placeholder="Add optional shift context..." style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px' }} />
      </div>
    </div>
  ),
};

export const ValidationSuccess: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="story-field-52" style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>Machine IP Address</label>
        <input id="story-field-52" type="text" defaultValue="192.168.10.45" style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #15803D', fontSize: '14px' }} />
        <span style={{ fontSize: '12px', color: '#15803D', fontWeight: 500 }}>✓ Host reachable over SCADA subnet (Ping 2ms)</span>
      </div>
    </div>
  ),
};

export const ValidationError: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label htmlFor="story-field-64" style={{ fontSize: '14px', fontWeight: 600, color: '#b91c1c' }}>Hydraulic Pressure Limit (Bar)</label>
        <input id="story-field-64" type="text" defaultValue="310" style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #b91c1c', fontSize: '14px' }} />
        <span style={{ fontSize: '12px', color: '#b91c1c', fontWeight: 500 }}>✕ Value exceeds maximum safety valve threshold (250 Bar)</span>
      </div>
    </div>
  ),
};
