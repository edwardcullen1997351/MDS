import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Core/Tag',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const Neutral: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <span style={{ padding: '4px 8px', backgroundColor: '#F1F5F9', color: '#475569', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
        SERIAL #9921
      </span>
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <span style={{ padding: '4px 8px', backgroundColor: '#DCFCE7', color: '#15803D', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
        CALIBRATED
      </span>
    </div>
  ),
};

export const Warning: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <span style={{ padding: '4px 8px', backgroundColor: '#FEF3C7', color: '#B45309', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
        DRIFT DETECTED
      </span>
    </div>
  ),
};

export const Critical: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <span style={{ padding: '4px 8px', backgroundColor: '#FEE2E2', color: '#B91C1C', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
        E-STOP TRIP
      </span>
    </div>
  ),
};

export const SolidTags: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '8px' }}>
      <span style={{ padding: '4px 8px', backgroundColor: '#2563EB', color: '#FFF', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>TIER-1 CORE</span>
      <span style={{ padding: '4px 8px', backgroundColor: '#7C3AED', color: '#FFF', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>TIER-2 SPEC</span>
    </div>
  ),
};

export const RemovableTag: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <span style={{ padding: '4px 8px', backgroundColor: '#E0E7FF', color: '#3730A3', borderRadius: '4px', fontSize: '12px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
        <span>Filter: Press 1</span>
        <button style={{ background: 'none', border: 'none', color: '#3730A3', cursor: 'pointer', padding: 0 }}>×</button>
      </span>
    </div>
  ),
};
