import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Forms/Textarea',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px' }}>
      <label htmlFor="story-textarea-14" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Shift Handover Notes</label>
      <textarea id="story-textarea-14" rows={4} placeholder="Enter notes on machine downtime or tool changes..." style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }} />
    </div>
  ),
};

export const WithCharacterCounter: Story = {
  render: () => {
    const [text, setText] = useState('Replaced carbide insert on Station 3. Verified surface finish.');
    const max = 200;
    return (
      <div style={{ padding: '24px', maxWidth: '440px' }}>
        <label htmlFor="story-textarea-26" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>Maintenance Log</label>
        <textarea id="story-textarea-26" rows={3} value={text} onChange={e => setText(e.target.value.slice(0, max))} style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', boxSizing: 'border-box' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{text.length} / {max} chars</div>
      </div>
    );
  },
};

export const ValidationState: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px' }}>
      <label htmlFor="story-textarea-37" style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#b91c1c', marginBottom: '6px' }}>Incident Root Cause *</label>
      <textarea id="story-textarea-37" rows={3} defaultValue="E-stop tripped" style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #b91c1c', fontSize: '14px', boxSizing: 'border-box' }} />
      <span style={{ fontSize: '12px', color: '#b91c1c', marginTop: '4px', display: 'block' }}>Root cause description must be at least 20 characters.</span>
    </div>
  ),
};

export const FixedRowsNonResizable: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px' }}>
      <label htmlFor="story-textarea-47" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>G-Code Snippet</label>
      <textarea id="story-textarea-47" rows={5} defaultValue={'G00 X0 Y0 Z5\\nG01 Z-2.0 F250\\nG02 X20 Y20 I10 J0 F800\\nG00 Z50'} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontFamily: 'monospace', fontSize: '13px', resize: 'none', boxSizing: 'border-box' }} />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px', opacity: 0.6 }}>
      <label htmlFor="story-textarea-56" style={{ display: 'block', fontSize: '14px', fontWeight: 600, marginBottom: '6px', color: '#64748B' }}>Audit Remarks (Archived)</label>
      <textarea id="story-textarea-56" disabled rows={3} defaultValue="Audit closed by Lead Quality Inspector #8941." style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: '#F1F5F9', color: '#64748B', cursor: 'not-allowed', boxSizing: 'border-box' }} />
    </div>
  ),
};
