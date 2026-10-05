import { Button } from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Core/ButtonGroup',
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj;

export const DefaultAttached: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'inline-flex' }}>
      <Button variant="outline" style={{ borderRadius: '6px 0 0 6px', borderRight: 'none' }}>Day Shift</Button>
      <Button variant="outline" style={{ borderRadius: 0, borderRight: 'none' }}>Evening Shift</Button>
      <Button variant="outline" style={{ borderRadius: '0 6px 6px 0' }}>Night Shift</Button>
    </div>
  ),
};

export const DisconnectedGroup: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '8px' }}>
      <Button variant="primary">Approve Inspection</Button>
      <Button variant="secondary">Request Re-work</Button>
      <Button variant="danger">Scrap Batch</Button>
    </div>
  ),
};

export const IconActionsGroup: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'inline-flex' }}>
      <Button variant="outline" style={{ borderRadius: '6px 0 0 6px', borderRight: 'none', padding: '8px 12px' }}>🔍 Zoom In</Button>
      <Button variant="outline" style={{ borderRadius: 0, borderRight: 'none', padding: '8px 12px' }}>🔎 Zoom Out</Button>
      <Button variant="outline" style={{ borderRadius: '0 6px 6px 0', padding: '8px 12px' }}>🔄 Reset View</Button>
    </div>
  ),
};

export const VerticalOrientation: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'inline-flex', flexDirection: 'column', width: '200px' }}>
      <Button variant="outline" style={{ borderRadius: '6px 6px 0 0', borderBottom: 'none' }}>Export Telemetry</Button>
      <Button variant="outline" style={{ borderRadius: 0, borderBottom: 'none' }}>Export Alarms</Button>
      <Button variant="outline" style={{ borderRadius: '0 0 6px 6px' }}>Export Audit Trail</Button>
    </div>
  ),
};

export const DisabledGroup: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '8px' }}>
      <Button variant="primary" disabled>Commit Changes</Button>
      <Button variant="secondary" disabled>Discard</Button>
    </div>
  ),
};
