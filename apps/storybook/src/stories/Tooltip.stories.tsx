import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip, Button } from '@ds/react';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Feedback/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: '40px' }}>
      <Tooltip content="Live 1000Hz vibration telemetry stream">
        <Button variant="outline">Sensor Status</Button>
      </Tooltip>
    </div>
  ),
};

export const TopPlacement: Story = {
  render: () => (
    <div style={{ padding: '40px' }}>
      <Tooltip content="Tooltip positioned on top" placement="top">
        <Button variant="outline">Top Placement</Button>
      </Tooltip>
    </div>
  ),
};

export const RightPlacement: Story = {
  render: () => (
    <div style={{ padding: '40px' }}>
      <Tooltip content="Tooltip positioned to right" placement="right">
        <Button variant="outline">Right Placement</Button>
      </Tooltip>
    </div>
  ),
};

export const BottomPlacement: Story = {
  render: () => (
    <div style={{ padding: '40px' }}>
      <Tooltip content="Tooltip positioned on bottom" placement="bottom">
        <Button variant="outline">Bottom Placement</Button>
      </Tooltip>
    </div>
  ),
};

export const LeftPlacement: Story = {
  render: () => (
    <div style={{ padding: '40px' }}>
      <Tooltip content="Tooltip positioned to left" placement="left">
        <Button variant="outline">Left Placement</Button>
      </Tooltip>
    </div>
  ),
};

export const RichContentWithShortcut: Story = {
  render: () => (
    <div style={{ padding: '40px' }}>
      <div style={{ display: 'inline-flex', padding: '6px 10px', backgroundColor: '#0F172A', color: '#FFF', borderRadius: '4px', fontSize: '12px', gap: '8px' }}>
        <span>Quick Zero Calibration</span> <span style={{ color: '#CBD5E1' }}>⌘ + K</span>
      </div>
    </div>
  ),
};
