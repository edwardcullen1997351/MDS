import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Core/Icon',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const IconGallery: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '24px' }}>
      <span title="Settings">⚙️</span>
      <span title="Warning">⚠️</span>
      <span title="Check">✅</span>
      <span title="Search">🔍</span>
      <span title="Tool">🛠️</span>
      <span title="Plant">🏭</span>
      <span title="Electric">⚡</span>
      <span title="Gauge">🎛️</span>
    </div>
  ),
};

export const SizingMatrix: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <span style={{ fontSize: '14px' }}>⚙️ (14px)</span>
      <span style={{ fontSize: '20px' }}>⚙️ (20px)</span>
      <span style={{ fontSize: '28px' }}>⚙️ (28px)</span>
      <span style={{ fontSize: '40px' }}>⚙️ (40px)</span>
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', fontSize: '24px' }}>
      <span style={{ color: '#2563EB' }}>● Primary</span>
      <span style={{ color: '#15803D' }}>● Success</span>
      <span style={{ color: '#b45309' }}>● Warning</span>
      <span style={{ color: '#b91c1c' }}>● Danger</span>
    </div>
  ),
};

export const InButtonComposition: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '12px' }}>
      <button style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', cursor: 'pointer' }}>
        <span>📥</span> <span>Download Diagnostics</span>
      </button>
      <button style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '6px', backgroundColor: '#2563EB', color: '#FFF', border: 'none', cursor: 'pointer' }}>
        <span>🚀</span> <span>Deploy Firmware</span>
      </button>
    </div>
  ),
};

export const SpinAnimation: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '24px' }}>🔄</span>
      <span style={{ fontSize: '14px', color: '#64748B' }}>Polling live PLC register...</span>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
};
