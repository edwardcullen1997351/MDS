import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Core/Chip',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '8px' }}>
      <span style={{ padding: '6px 12px', backgroundColor: '#F1F5F9', color: '#334155', borderRadius: '16px', fontSize: '13px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        Tandem Line 1
      </span>
    </div>
  ),
};

export const SelectedState: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '8px' }}>
      <span style={{ padding: '6px 12px', backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #93C5FD', borderRadius: '16px', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        ✓ CNC Milling Active
      </span>
    </div>
  ),
};

export const RemovableChips: Story = {
  render: () => {
    const [chips, setChips] = useState(['High Temp (>80°C)', 'Line PL-04', 'Shift A']);
    return (
      <div style={{ padding: '24px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {chips.map(c => (
          <span key={c} style={{ padding: '6px 12px', backgroundColor: '#F1F5F9', color: '#1E293B', borderRadius: '16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span>{c}</span>
            <button onClick={() => setChips(chips.filter(x => x !== c))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 700, color: '#64748B' }}>×</button>
          </span>
        ))}
      </div>
    );
  },
};

export const SizingScale: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
      <span style={{ padding: '4px 8px', backgroundColor: '#F1F5F9', borderRadius: '12px', fontSize: '11px', fontWeight: 500 }}>Small Chip</span>
      <span style={{ padding: '6px 12px', backgroundColor: '#F1F5F9', borderRadius: '16px', fontSize: '13px', fontWeight: 500 }}>Medium (Default)</span>
      <span style={{ padding: '8px 16px', backgroundColor: '#F1F5F9', borderRadius: '20px', fontSize: '15px', fontWeight: 500 }}>Large Filter</span>
    </div>
  ),
};

export const DisabledChip: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '8px' }}>
      <span style={{ padding: '6px 12px', backgroundColor: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0', borderRadius: '16px', fontSize: '13px', cursor: 'not-allowed' }}>
        Locked Parameter
      </span>
    </div>
  ),
};
