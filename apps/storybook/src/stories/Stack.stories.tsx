import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Stack, HStack, VStack, Button } from '@ds/react';

const meta: Meta<typeof Stack> = {
  title: 'Primitives/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Stack, HStack, and VStack manage 1-dimensional flexbox layouts with deterministic token gaps and alignment rules.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Stack>;

export const VerticalVStack: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px' }}>
      <VStack gap={3}>
        <div style={{ padding: '12px', backgroundColor: '#F1F5F9', borderRadius: '6px' }}>Item 1: Pressure Relief Valve</div>
        <div style={{ padding: '12px', backgroundColor: '#F1F5F9', borderRadius: '6px' }}>Item 2: Hydraulic Pump Station</div>
        <div style={{ padding: '12px', backgroundColor: '#F1F5F9', borderRadius: '6px' }}>Item 3: Accumulator Pre-charge</div>
      </VStack>
    </div>
  ),
};

export const HorizontalHStack: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <HStack gap={4} align="center">
        <Button variant="primary">Deploy Patch</Button>
        <Button variant="secondary">Run Dry Cycle</Button>
        <Button variant="outline">Abort</Button>
      </HStack>
    </div>
  ),
};

export const GapSpacingScale: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {[1, 2, 4, 8].map(g => (
        <div key={g}>
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>gap={g} ({g * 4}px)</div>
          <HStack gap={g as any}>
            <div style={{ padding: '8px 16px', background: '#EFF6FF', borderRadius: '4px' }}>A</div>
            <div style={{ padding: '8px 16px', background: '#EFF6FF', borderRadius: '4px' }}>B</div>
            <div style={{ padding: '8px 16px', background: '#EFF6FF', borderRadius: '4px' }}>C</div>
          </HStack>
        </div>
      ))}
    </div>
  ),
};

export const AlignmentMatrix: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '24px' }}>
      {(['start', 'center', 'end', 'stretch'] as const).map(a => (
        <div key={a} style={{ border: '1px solid #CBD5E1', padding: '12px', borderRadius: '6px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>align="{a}"</div>
          <HStack gap={2} align={a} style={{ height: '80px', background: '#F8FAFC' }}>
            <div style={{ width: '24px', height: '30px', background: '#2563EB' }} />
            <div style={{ width: '24px', height: '50px', background: '#3B82F6' }} />
            <div style={{ width: '24px', height: '20px', background: '#60A5FA' }} />
          </HStack>
        </div>
      ))}
    </div>
  ),
};

export const JustifyBetween: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '500px' }}>
      <HStack justify="between" align="center" style={{ padding: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
        <div>
          <strong style={{ fontSize: '14px' }}>Press Line 01</strong>
          <div style={{ fontSize: '12px', color: '#64748B' }}>Continuous Stamping</div>
        </div>
        <span style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>ONLINE</span>
      </HStack>
    </div>
  ),
};

export const WrapAndOverflow: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '340px' }}>
      <HStack wrap gap={2}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} style={{ padding: '4px 10px', backgroundColor: '#F1F5F9', borderRadius: '12px', fontSize: '12px' }}>
            Sensor-{i + 1}
          </span>
        ))}
      </HStack>
    </div>
  ),
};

export const DividedStack: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '380px' }}>
      <VStack gap={0} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>Section 1: Spindle Speeds</div>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>Section 2: Feed Rates</div>
        <div style={{ padding: '12px 16px' }}>Section 3: Rapid Traverse</div>
      </VStack>
    </div>
  ),
};
