import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Surface } from '@ds/react';

const meta: Meta<typeof Surface> = {
  title: 'Primitives/Surface',
  component: Surface,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Surface provides elevation, background color tokens, and structured card layers for component depth hierarchy.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Surface>;

export const DefaultElevated: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Surface elevation={2} radius="lg" border="subtle" p={4} style={{ maxWidth: '400px' }}>
        <div style={{ fontWeight: 600, fontSize: '15px' }}>Elevated Telemetry Surface</div>
        <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>Elevation 2 with subtle border and lg radius.</div>
      </Surface>
    </div>
  ),
};

export const ToneMatrix: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', maxWidth: '640px' }}>
      <Surface tone="default" p={4} border="subtle" radius="md">
        <strong>Tone: Default</strong>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>Clean white base layer</p>
      </Surface>
      <Surface tone="card" p={4} elevation={1} radius="md">
        <strong>Tone: Card</strong>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>Elevated card layer</p>
      </Surface>
      <Surface tone="sunken" p={4} border="subtle" radius="md">
        <strong>Tone: Sunken</strong>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748B' }}>Recessed background</p>
      </Surface>
      <Surface tone="inverse" p={4} radius="md">
        <strong>Tone: Inverse</strong>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#CBD5E1' }}>High contrast dark container</p>
      </Surface>
    </div>
  ),
};

export const ElevationVocabulary: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {[0, 1, 2, 3, 4, 5].map(e => (
        <Surface key={e} elevation={e as any} radius="md" p={4} style={{ width: '130px', height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '14px' }}>Elevation {e}</span>
          <span style={{ fontSize: '11px', color: '#64748B' }}>shadow-{e}</span>
        </Surface>
      ))}
    </div>
  ),
};

export const BorderedVariants: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px' }}>
      <Surface border="none" elevation={1} radius="md" p={4}>Border: None</Surface>
      <Surface border="subtle" radius="md" p={4}>Border: Subtle (1px)</Surface>
      <Surface border="strong" radius="md" p={4}>Border: Strong (2px)</Surface>
    </div>
  ),
};

export const RadiusScale: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      {['xs', 'sm', 'md', 'lg', 'xl', 'full'].map(r => (
        <Surface key={r} radius={r as any} border="subtle" p={3} style={{ width: '90px', textAlign: 'center', fontSize: '12px', fontWeight: 600 }}>
          {r}
        </Surface>
      ))}
    </div>
  ),
};

export const IndustrialDarkPanel: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '440px' }}>
      <Surface tone="inverse" radius="lg" elevation={3} p={5}>
        <div style={{ fontSize: '12px', color: '#60A5FA', fontWeight: 600 }}>SCADA CONTROL SURFACE</div>
        <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>Line 04 Hydraulic Unit</div>
        <div style={{ fontSize: '13px', color: '#CBD5E1', marginTop: '4px' }}>Running nominal @ 245 Bar (99.8% OEE)</div>
      </Surface>
    </div>
  ),
};
