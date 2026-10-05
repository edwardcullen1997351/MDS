import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from '@ds/react';

const meta: Meta<typeof Text> = {
  title: 'Primitives/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Text provides tokenized typographical scale sizes, font weights, semantic color tones, and line-clamp truncations.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Text>;

export const DefaultBody: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '520px' }}>
      <Text size="base" color="primary">
        Hydraulic ram pressure sensors sampled at 1,000 Hz continuous logging. All 32 channels are streaming telemetry without packet degradation.
      </Text>
    </div>
  ),
};

export const SizingScale: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text size="xs">Extra Small (xs - 12px) · Sensor subtext & timestamps</Text>
      <Text size="sm">Small (sm - 14px) · Table cells & form helper notes</Text>
      <Text size="base">Base (base - 16px) · Default body reading copy</Text>
      <Text size="lg">Large (lg - 18px) · Subheaders & lead paragraphs</Text>
      <Text size="xl">Extra Large (xl - 20px) · Metric telemetry readouts</Text>
    </div>
  ),
};

export const FontWeights: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text weight="regular">Regular (400) - Standard documentation body</Text>
      <Text weight="medium">Medium (500) - Interactive table row cells</Text>
      <Text weight="semibold">Semibold (600) - Field labels and card headers</Text>
      <Text weight="bold">Bold (700) - Key performance indicator numbers</Text>
    </div>
  ),
};

export const MonospaceDataPrecision: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <Text variant="mono" size="sm">ISO_TIMESTAMP: 2026-09-23T12:00:00.000Z</Text>
      <Text variant="mono" size="sm">CRC32_CHECKSUM: 0x99A8F142</Text>
      <Text variant="mono" size="sm">TELEMETRY_SAMPLE_RATE: 25600_HZ</Text>
    </div>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text color="primary">Primary Text (Neutral 900)</Text>
      <Text color="secondary">Secondary Text (Neutral 600)</Text>
      <Text color="muted">Muted / Disabled (Neutral 400)</Text>
      <Text color="success">Success Status (Green 600)</Text>
      <Text color="warning">Warning Status (Amber 600)</Text>
      <Text color="danger">Critical Danger (Red 600)</Text>
    </div>
  ),
};

export const TruncationAndLineClamp: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '300px' }}>
      <Text truncate>
        Very long machine serial string that exceeds parent bounding container width and gets truncated.
      </Text>
    </div>
  ),
};

export const PolymorphicAs: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Text as="p">Rendered as standard &lt;p&gt; paragraph tag.</Text>
      <Text as="span">Rendered as inline &lt;span&gt; tag.</Text>
      <Text as="strong">Rendered as semantic &lt;strong&gt; tag.</Text>
      <Text as="code">Rendered as semantic &lt;code&gt; tag.</Text>
    </div>
  ),
};
