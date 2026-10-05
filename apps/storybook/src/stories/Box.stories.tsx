import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@ds/react';

const meta: Meta<typeof Box> = {
  title: 'Primitives/Box',
  component: Box,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Box is the fundamental polymorphic layout primitive that binds directly to design tokens for padding, margin, surface, and semantic HTML elements.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Box>;

export const DefaultWithTokens: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Box p={4} style={{ backgroundColor: '#F1F5F9', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
        <div style={{ fontWeight: 600, color: '#0F172A' }}>Box Container (p={4} / 16px)</div>
        <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>Token-driven padding and border-box sizing.</div>
      </Box>
    </div>
  ),
};

export const PolymorphicAs: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Box as="section" p={3} style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px' }}>
        <strong>&lt;section&gt;</strong> Semantic landmark container
      </Box>
      <Box as="article" p={3} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '6px' }}>
        <strong>&lt;article&gt;</strong> Self-contained telemetry report
      </Box>
      <Box as="aside" p={3} style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px' }}>
        <strong>&lt;aside&gt;</strong> Contextual machine parameters sidebar
      </Box>
    </div>
  ),
};

export const PaddingMarginScale: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {[1, 2, 4, 6, 8].map(s => (
        <Box key={s} p={s as any} style={{ backgroundColor: '#F8FAFC', border: '1px dashed #64748B', borderRadius: '4px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>Padding Scale: p={s} ({s * 4}px)</span>
        </Box>
      ))}
    </div>
  ),
};

export const BorderRadiusVariants: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {['0px', '4px', '8px', '16px', '9999px'].map((r, _i) => (
        <Box key={r} p={4} style={{ width: '120px', height: '80px', backgroundColor: '#2563EB', color: '#FFF', borderRadius: r, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>
          {r === '9999px' ? 'Full' : r}
        </Box>
      ))}
    </div>
  ),
};

export const BackgroundAndSurfaceTokens: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      <Box p={4} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
        <strong>Surface Default</strong>
      </Box>
      <Box p={4} style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
        <strong>Surface Sunken</strong>
      </Box>
      <Box p={4} style={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px' }}>
        <strong>Surface Inverse</strong>
      </Box>
    </div>
  ),
};

export const ResponsiveDimensions: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Box p={4} style={{ width: '100%', maxWidth: '640px', backgroundColor: '#F1F5F9', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
        <div style={{ fontSize: '13px' }}>Fluid width box with max-width bounding (640px).</div>
      </Box>
    </div>
  ),
};
