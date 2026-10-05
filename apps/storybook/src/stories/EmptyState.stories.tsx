import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState, Button } from '@ds/react';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const DefaultNoData: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '480px' }}>
      <EmptyState
        title="No Telemetry Feeds Configured"
        description="Connect an OPC-UA industrial gateway to begin streaming high-frequency sensor data."
      >
        <Button variant="primary">Add Gateway Connection</Button>
      </EmptyState>
    </div>
  ),
};

export const SearchFilterZeroResults: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '480px' }}>
      <EmptyState
        title="No Work Orders Match Filter"
        description="Try adjusting your status filter or clearing search keywords."
      >
        <Button variant="outline">Clear All Filters</Button>
      </EmptyState>
    </div>
  ),
};

export const PermissionDenied: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '480px' }}>
      <EmptyState
        title="Access Restricted"
        description="You do not have Metrology Supervisor privileges to view raw calibration certificates."
      >
        <Button variant="secondary">Request Level 3 Access</Button>
      </EmptyState>
    </div>
  ),
};

export const NetworkOffline: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '480px' }}>
      <EmptyState
        title="Edge Gateway Disconnected"
        description="Unable to reach Modbus bridge @ 10.200.4.12. Check physical Ethernet link."
      >
        <Button variant="primary">Retry Connection</Button>
      </EmptyState>
    </div>
  ),
};

export const CompactDropdownEmpty: Story = {
  render: () => (
    <div style={{ padding: '16px', maxWidth: '280px', border: '1px solid #E2E8F0', borderRadius: '6px', textAlign: 'center', fontSize: '12px', color: '#64748B' }}>
      No toolholders in active magazine
    </div>
  ),
};
