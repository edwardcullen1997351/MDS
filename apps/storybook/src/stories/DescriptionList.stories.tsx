import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Data/DescriptionList',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const DefaultHorizontal: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '540px', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
      <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: '160px 1fr', gap: '12px 16px', fontSize: '14px' }}>
        <dt style={{ color: '#64748B', fontWeight: 500 }}>Equipment Model</dt>
        <dd style={{ margin: 0, color: '#0F172A', fontWeight: 600 }}>DMG MORI DMU 50 5-Axis</dd>
        <dt style={{ color: '#64748B', fontWeight: 500 }}>Controller Firmware</dt>
        <dd style={{ margin: 0, color: '#0F172A' }}>Siemens Sinumerik 840D sl (v4.95)</dd>
        <dt style={{ color: '#64748B', fontWeight: 500 }}>Total Run Hours</dt>
        <dd style={{ margin: 0, color: '#0F172A' }}>14,820.4 hrs</dd>
      </dl>
    </div>
  ),
};

export const BorderedVariant: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '540px' }}>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
        {[
          { label: 'Work Order', val: 'WO-88192' },
          { label: 'Target Material', val: 'Titanium Ti-6Al-4V (Grade 5)' },
          { label: 'Coolant Type', val: 'Synthetic Micro-Emulsion (8%)' },
        ].map((r, i) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC', borderBottom: i < 2 ? '1px solid #E2E8F0' : 'none', fontSize: '13px' }}>
            <span style={{ color: '#64748B' }}>{r.label}</span>
            <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.val}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const VerticalStacked: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '400px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
        <div>
          <div style={{ color: '#64748B', fontSize: '12px' }}>METROLOGY TOLERANCE</div>
          <div style={{ fontWeight: 600, fontSize: '14px', marginTop: '2px' }}>±0.0025 mm (ISO 2768-f)</div>
        </div>
        <div>
          <div style={{ color: '#64748B', fontSize: '12px' }}>LEAD INSPECTOR</div>
          <div style={{ fontWeight: 600, fontSize: '14px', marginTop: '2px' }}>Elena Rostova (Badge #QA-99)</div>
        </div>
      </div>
    </div>
  ),
};

export const CompactDensity: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '6px', fontSize: '12px' }}>
        <span style={{ color: '#64748B' }}>Axis X Load:</span> <span>34%</span>
        <span style={{ color: '#64748B' }}>Axis Y Load:</span> <span>41%</span>
        <span style={{ color: '#64748B' }}>Axis Z Load:</span> <span>58%</span>
      </div>
    </div>
  ),
};

export const WithStatusTags: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '500px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>Calibration Certificate</div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>CERT-2026-NIST</div>
        </div>
        <span style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>PASSED</span>
      </div>
    </div>
  ),
};
