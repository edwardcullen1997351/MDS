import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Divider, HStack } from '@ds/react';

const meta: Meta<typeof Divider> = {
  title: 'Primitives/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Divider creates clean horizontal or vertical visual separations between content sections, toolbars, and list groups.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Divider>;

export const HorizontalDefault: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '400px' }}>
      <div>Top Section: Machine Status</div>
      <Divider spacing={4} />
      <div>Bottom Section: Operator Information</div>
    </div>
  ),
};

export const VerticalInHStack: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <HStack align="center" gap={3} style={{ height: '32px' }}>
        <span>Line 1</span>
        <Divider orientation="vertical" />
        <span>Line 2</span>
        <Divider orientation="vertical" />
        <span>Line 3</span>
      </HStack>
    </div>
  ),
};

export const StyleVariants: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>variant="subtle"</div>
        <Divider variant="subtle" />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>variant="strong"</div>
        <Divider variant="strong" />
      </div>
      <div>
        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>variant="dashed"</div>
        <Divider variant="dashed" />
      </div>
    </div>
  ),
};

export const WithTextLabels: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Divider label="TELEMETRY LOGS" labelPosition="center" />
      <Divider label="OR" labelPosition="start" />
      <Divider label="SECTION END" labelPosition="end" />
    </div>
  ),
};

export const SpacingScale: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '400px' }}>
      {[2, 4, 8].map(s => (
        <div key={s}>
          <span style={{ fontSize: '12px' }}>Spacing {s} ({s * 4}px)</span>
          <Divider spacing={s as any} />
        </div>
      ))}
    </div>
  ),
};

export const InCardSectionDivider: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px' }}>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', background: '#FFF' }}>
        <div style={{ fontWeight: 600 }}>Stamping Press 04</div>
        <div style={{ fontSize: '12px', color: '#64748B' }}>Primary Blanking Ram</div>
        <Divider spacing={3} />
        <div style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Hydraulic Oil Temp</span>
          <strong>48.2 °C</strong>
        </div>
      </div>
    </div>
  ),
};
