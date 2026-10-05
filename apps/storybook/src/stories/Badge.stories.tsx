import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge, DualUomBadge, StaleDataPill } from '@ds/react';

const meta: Meta<typeof Badge> = {
  title: 'Components/Core/Badge',
  component: Badge,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Neutral: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Badge variant="neutral">TOOLING HSK-63</Badge>
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Badge variant="success">INSPECTION PASSED</Badge>
    </div>
  ),
};

export const Warning: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Badge variant="warning">CALIBRATION DUE</Badge>
    </div>
  ),
};

export const Danger: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Badge variant="danger">CRITICAL ALARM</Badge>
    </div>
  ),
};

export const Info: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Badge variant="info">SHIFT ACTIVE</Badge>
    </div>
  ),
};

export const StatusDots: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Badge variant="success">● Online</Badge>
      <Badge variant="warning">● Thermal Alert</Badge>
      <Badge variant="danger">● E-Stop Active</Badge>
    </div>
  ),
};

export const SizingMatrix: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Badge variant="info" size="sm">Small (sm)</Badge>
      <Badge variant="info" size="md">Medium (md)</Badge>
      <Badge variant="info" size="lg">Large (lg)</Badge>
    </div>
  ),
};

export const DualUomInventoryDisplay: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>MPC Dual Unit of Measure (UoM) Display</h2>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <DualUomBadge
          primaryQty={150.0}
          primaryUom="KG"
          secondaryQty={3000}
          secondaryUom="Pk"
          conversionRatio="1 KG = 20 Pk"
        />
        <DualUomBadge
          primaryQty={4250.5}
          primaryUom="L"
          secondaryQty={8501}
          secondaryUom="Btl"
          conversionRatio="1 L = 2 Btl"
        />
        <DualUomBadge
          primaryQty={780}
          primaryUom="Tons"
        />
      </div>
    </div>
  ),
};

export const StaleDataTelemetryPill: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Sync Latency & Stale Data Pill</h2>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Fresh (2 min):</span>
          <StaleDataPill lastSyncTime={new Date(Date.now() - 2 * 60 * 1000)} staleThresholdMinutes={5} />
        </div>
        <div>
          <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Stale Warning (8 min):</span>
          <StaleDataPill
            lastSyncTime={new Date(Date.now() - 8 * 60 * 1000)}
            staleThresholdMinutes={5}
            onRefresh={() => alert('Manual ERP pipeline resync triggered!')}
          />
        </div>
        <div>
          <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Custom Title:</span>
          <StaleDataPill
            lastSyncTime={new Date(Date.now() - 15 * 60 * 1000)}
            staleThresholdMinutes={5}
            title="Plant F-119 SCADA Sync"
            onRefresh={() => alert('Refreshing Plant F-119 telemetry...')}
          />
        </div>
      </div>
    </div>
  ),
};
