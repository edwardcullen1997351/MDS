import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from '@ds/react';

const meta: Meta<typeof IconButton> = {
  title: 'Components/Core/IconButton',
  component: IconButton,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
  render: () => <IconButton aria-label="Refresh telemetry" icon="↻" />,
};

export const Secondary: Story = {
  render: () => <IconButton variant="secondary" aria-label="Settings" icon="⚙" />,
};

export const Danger: Story = {
  render: () => <IconButton variant="danger" aria-label="Emergency stop" icon="!" />,
};

export const SizingMatrix: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <IconButton size="sm" aria-label="Search small" icon="⌕" />
      <IconButton size="md" aria-label="Search medium" icon="⌕" />
      <IconButton size="lg" aria-label="Search large" icon="⌕" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => <IconButton disabled aria-label="Locked action" icon="🔒" />,
};
