import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Feedback/Progress',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Determinate: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
        <span style={{ fontWeight: 600 }}>Machining Cycle (450 / 600 parts)</span>
        <span style={{ fontWeight: 600, color: '#2563EB' }}>75%</span>
      </div>
      <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: '75%', height: '100%', backgroundColor: '#2563EB' }} />
      </div>
    </div>
  ),
};

export const SuccessTone: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
        <span style={{ fontWeight: 600 }}>Daily Production Target Met</span>
        <span style={{ fontWeight: 600, color: '#15803D' }}>100%</span>
      </div>
      <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '100%', backgroundColor: '#15803D' }} />
      </div>
    </div>
  ),
};

export const WarningTone: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
        <span style={{ fontWeight: 600 }}>Thermal Reservoir Capacity (Warning)</span>
        <span style={{ fontWeight: 600, color: '#b45309' }}>82%</span>
      </div>
      <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: '82%', height: '100%', backgroundColor: '#b45309' }} />
      </div>
    </div>
  ),
};

export const CriticalTone: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
        <span style={{ fontWeight: 600, color: '#b91c1c' }}>Hydraulic Oil Contamination Level</span>
        <span style={{ fontWeight: 600, color: '#b91c1c' }}>96%</span>
      </div>
      <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: '96%', height: '100%', backgroundColor: '#b91c1c' }} />
      </div>
    </div>
  ),
};

export const SizingMatrix: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Small (4px)</div>
        <div style={{ height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}><div style={{ width: '40%', height: '100%', backgroundColor: '#2563EB' }} /></div>
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Medium (8px)</div>
        <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}><div style={{ width: '65%', height: '100%', backgroundColor: '#2563EB' }} /></div>
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>Large (16px)</div>
        <div style={{ height: '16px', backgroundColor: '#E2E8F0', borderRadius: '8px', overflow: 'hidden' }}><div style={{ width: '85%', height: '100%', backgroundColor: '#2563EB' }} /></div>
      </div>
    </div>
  ),
};
