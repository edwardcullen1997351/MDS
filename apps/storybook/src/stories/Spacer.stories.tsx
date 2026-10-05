import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Spacer, HStack, Button } from '@ds/react';

const meta: Meta<typeof Spacer> = {
  title: 'Primitives/Spacer',
  component: Spacer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Spacer provides adjustable flexbox auto-expanding push spacing and fixed token-based spacing intervals.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Spacer>;

export const FlexAutoSpacer: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '600px' }}>
      <HStack align="center" style={{ padding: '12px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px' }}>
        <span style={{ fontWeight: 600 }}>Plant Header</span>
        <Spacer />
        <Button size="sm" variant="primary">Export Telemetry</Button>
      </HStack>
    </div>
  ),
};

export const FixedHorizontalScale: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', alignItems: 'center' }}>
      <div style={{ padding: '8px 16px', background: '#2563EB', color: '#FFF' }}>Left</div>
      <Spacer size={6} axis="horizontal" />
      <div style={{ padding: '8px 16px', background: '#2563EB', color: '#FFF' }}>Right (size={6} / 24px)</div>
    </div>
  ),
};

export const FixedVerticalScale: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ padding: '8px 16px', background: '#0F172A', color: '#FFF' }}>Top Item</div>
      <Spacer size={6} axis="vertical" />
      <div style={{ padding: '8px 16px', background: '#0F172A', color: '#FFF' }}>Bottom Item (size={6} / 24px)</div>
    </div>
  ),
};

export const BothXYSpacers: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'inline-block', padding: '8px 16px', background: '#15803D', color: '#FFF' }}>Box A</div>
      <Spacer size={8} axis="both" />
      <div style={{ display: 'inline-block', padding: '8px 16px', background: '#15803D', color: '#FFF' }}>Box B (size={8} / 32px block)</div>
    </div>
  ),
};

export const HeaderActionToolbarSpacing: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '640px' }}>
      <HStack align="center" style={{ padding: '14px 18px', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px' }}>Line 02 Telemetry Stream</div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>1,000 Hz Industrial Polling</div>
        </div>
        <Spacer />
        <Button size="sm" variant="outline">Refresh</Button>
        <Spacer size={2} axis="horizontal" />
        <Button size="sm" variant="primary">Download Log</Button>
      </HStack>
    </div>
  ),
};
