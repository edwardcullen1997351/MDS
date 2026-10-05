import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '@ds/react';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

export const DefaultUnchecked: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Checkbox label="Enable high-frequency telemetry logging" />
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Checkbox defaultChecked label="Spindle lubrication check passed" />
    </div>
  ),
};

export const IndeterminateParent: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Checkbox indeterminate label="Austin Facility Sub-assemblies (2 of 4 selected)" />
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Checkbox
        label="Engage automatic vibration damping"
        helperText="Enables active counter-harmonic feedback on Axis Z."
      />
    </div>
  ),
};

export const ErrorValidation: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Checkbox
        isInvalid
        label="I have verified optical curtain alignment (Mandatory)"
        helperText="Safety acknowledgement required before starting cycle."
      />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Checkbox disabled defaultChecked label="PLC Hardwired E-Stop (Locked)" />
    </div>
  ),
};

export const SizingMatrix: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <Checkbox size="sm" label="Small (sm)" />
      <Checkbox size="md" label="Medium (md)" />
      <Checkbox size="lg" label="Large (lg)" />
    </div>
  ),
};
