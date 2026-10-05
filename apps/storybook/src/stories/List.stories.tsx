import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Data/List',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const DefaultUnordered: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '400px' }}>
      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#334155', lineHeight: 1.8 }}>
        <li>Verify hydraulic pressure gauges prior to cycle trigger</li>
        <li>Inspect carbide inserts for micro-fractures under 20x loupe</li>
        <li>Ensure protective splash guards interlocked</li>
      </ul>
    </div>
  ),
};

export const OrderedNumbered: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '400px' }}>
      <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#334155', lineHeight: 1.8 }}>
        <li>Power down main 480V disconnect switch</li>
        <li>Affix OSHA Lockout/Tagout padlock</li>
        <li>Bleed residual pneumatic line pressure</li>
      </ol>
    </div>
  ),
};

export const SelectableList: Story = {
  render: () => {
    const [selected, setSelected] = useState('Line 1');
    return (
      <div style={{ padding: '24px', maxWidth: '340px' }}>
        <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
          {['Line 1 - Stamping', 'Line 2 - Milling', 'Line 3 - Welding'].map(item => (
            <button
              key={item}
              type="button"
              onClick={() => setSelected(item)}
              style={{
                display: 'block', width: '100%', textAlign: 'left', border: 0,
                padding: '12px 16px',
                borderBottom: '1px solid #E2E8F0',
                backgroundColor: selected === item ? '#EFF6FF' : '#FFFFFF',
                color: selected === item ? '#1D4ED8' : '#0F172A',
                fontWeight: selected === item ? 600 : 500,
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    );
  },
};

export const WithLeadingIcons: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '360px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px' }}>
          <span>🟢</span> <span>Station 1: Online (Normal)</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px' }}>
          <span>🟡</span> <span>Station 2: Warning (Vib Drift)</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '13px' }}>
          <span>🔴</span> <span>Station 3: Fault (E-Stop)</span>
        </div>
      </div>
    </div>
  ),
};

export const CompactDensity: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '300px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
        <div>• Channel 1 (RMS 0.12)</div>
        <div>• Channel 2 (RMS 0.18)</div>
        <div>• Channel 3 (RMS 0.09)</div>
      </div>
    </div>
  ),
};
