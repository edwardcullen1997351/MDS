import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Grid } from '@ds/react';

const meta: Meta = {
  title: 'Primitives/GridItem',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'GridItem controls column spanning, row spanning, and placement offsets within a parent Grid primitive.',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const DefaultColSpan: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Grid columns={12} gap={4}>
        <div style={{ gridColumn: 'span 4', padding: '16px', background: '#EFF6FF', borderRadius: '6px', textAlign: 'center' }}>Span 4</div>
        <div style={{ gridColumn: 'span 8', padding: '16px', background: '#DBEAFE', borderRadius: '6px', textAlign: 'center' }}>Span 8</div>
      </Grid>
    </div>
  ),
};

export const ColSpanHierarchy: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Grid columns={12} gap={3}>
        <div style={{ gridColumn: 'span 12', padding: '12px', background: '#F1F5F9', textAlign: 'center' }}>Span 12 (Full Width)</div>
        <div style={{ gridColumn: 'span 6', padding: '12px', background: '#E2E8F0', textAlign: 'center' }}>Span 6 (Half)</div>
        <div style={{ gridColumn: 'span 6', padding: '12px', background: '#E2E8F0', textAlign: 'center' }}>Span 6 (Half)</div>
        <div style={{ gridColumn: 'span 3', padding: '12px', background: '#CBD5E1', textAlign: 'center' }}>Span 3</div>
        <div style={{ gridColumn: 'span 3', padding: '12px', background: '#CBD5E1', textAlign: 'center' }}>Span 3</div>
        <div style={{ gridColumn: 'span 3', padding: '12px', background: '#CBD5E1', textAlign: 'center' }}>Span 3</div>
        <div style={{ gridColumn: 'span 3', padding: '12px', background: '#CBD5E1', textAlign: 'center' }}>Span 3</div>
      </Grid>
    </div>
  ),
};

export const RowSpanSpanning: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Grid columns={3} gap={4} style={{ gridTemplateRows: '100px 100px' }}>
        <div style={{ gridRow: 'span 2', padding: '16px', background: '#2563EB', color: '#FFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Hero Metric (Span 2 Rows)
        </div>
        <div style={{ padding: '16px', background: '#F1F5F9', borderRadius: '8px' }}>Station A</div>
        <div style={{ padding: '16px', background: '#F1F5F9', borderRadius: '8px' }}>Station B</div>
        <div style={{ padding: '16px', background: '#F1F5F9', borderRadius: '8px' }}>Station C</div>
        <div style={{ padding: '16px', background: '#F1F5F9', borderRadius: '8px' }}>Station D</div>
      </Grid>
    </div>
  ),
};

export const OffsetStartEnd: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Grid columns={12} gap={4}>
        <div style={{ gridColumn: '3 / span 8', padding: '20px', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', textAlign: 'center' }}>
          Centered Column Offset (Start at Col 3, Span 8 Columns)
        </div>
      </Grid>
    </div>
  ),
};

export const ResponsiveColumnSpans: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Grid columns={12} gap={4}>
        <div style={{ gridColumn: 'span 12', padding: '16px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '6px' }}>
          Mobile: Span 12 · Desktop: Span 12
        </div>
      </Grid>
    </div>
  ),
};
