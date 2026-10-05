import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@ds/react';

const meta: Meta<typeof Switch> = {
  title: 'Components/Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Switch>;

export const DefaultOff: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Switch label="High-pressure spindle coolant" />
    </div>
  ),
};

export const DefaultOn: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Switch defaultChecked label="Active vibration suppression" />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [active, setActive] = useState(true);
    return (
      <div style={{ padding: '24px' }}>
        <Switch
          checked={active}
          onChange={setActive}
          label={active ? 'SCADA Auto-sync Enabled' : 'SCADA Auto-sync Paused'}
        />
      </div>
    );
  },
};

export const WithSubtext: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Switch
        defaultChecked
        label="Automatic toolwear compensation"
        description="Adjusts CNC offsets dynamically based on in-line laser tool measurement."
      />
    </div>
  ),
};

export const SizingScale: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '24px', alignItems: 'center' }}>
      <Switch size="sm" label="Small" />
      <Switch size="md" label="Medium" />
      <Switch size="lg" label="Large" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Switch disabled defaultChecked label="Hardware E-stop interlock (Locked)" />
    </div>
  ),
};
