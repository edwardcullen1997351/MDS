import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from '@ds/react';

const meta: Meta<typeof Radio> = {
  title: 'Components/Forms/Radio',
  component: Radio,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Radio>;

export const DefaultUnchecked: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Radio name="cooling" value="flood" label="Flood Coolant Delivery" />
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Radio name="cooling" value="mist" defaultChecked label="High-Pressure Mist Delivery" />
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div>
        <Radio
          name="toolpath"
          value="trochoidal"
          label="Trochoidal Milling Strategy"
        />
        <p style={{ margin: '4px 0 0 24px', fontSize: '12px', color: '#64748B' }}>
          Maintains constant tool engagement angle to reduce cutting forces.
        </p>
      </div>
    </div>
  ),
};

export const SizingScale: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <Radio name="size-demo" value="sm" size="sm" label="Small (sm)" />
      <Radio name="size-demo" value="md" size="md" label="Medium (md)" />
      <Radio name="size-demo" value="lg" size="lg" label="Large (lg)" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Radio name="locked" value="lock" disabled defaultChecked label="Hardware Interlock Lockout (Locked)" />
    </div>
  ),
};
