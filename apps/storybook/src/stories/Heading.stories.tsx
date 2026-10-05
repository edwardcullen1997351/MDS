import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Heading, HeadingLevelProvider, Card, CardTitle } from '@ds/react';

const meta: Meta<typeof Heading> = {
  title: 'Primitives/Heading',
  component: Heading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Heading provides accessible semantic h1-h6 headers with visual typographic scale bindings.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Heading>;

const contextStyle = { position: 'absolute' as const, width: 1, height: 1, overflow: 'hidden' as const, clipPath: 'inset(50%)' };

export const H1Display: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Heading as="h1" size="4xl">Plant Operations Telemetry (H1 - 4xl)</Heading>
    </div>
  ),
};

export const H2SectionHeader: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Heading as="h2" size="3xl">Tandem Stamping Line 04 (H2 - 3xl)</Heading>
    </div>
  ),
};

export const H3CardTitle: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h1 style={contextStyle}>Heading examples</h1><h2 style={contextStyle}>Card examples</h2>
      <Heading as="h3" size="2xl">Hydraulic Spindle Pressure (H3 - 2xl)</Heading>
    </div>
  ),
};

export const H4WidgetHeader: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h1 style={contextStyle}>Heading examples</h1><h2 style={contextStyle}>Card examples</h2><h3 style={contextStyle}>Widget examples</h3>
      <Heading as="h4" size="xl">Vibration Spectrum (H4 - xl)</Heading>
    </div>
  ),
};

export const H5Subheading: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <h1 style={contextStyle}>Heading examples</h1><h2 style={contextStyle}>Card examples</h2><h3 style={contextStyle}>Widget examples</h3><h4 style={contextStyle}>Subheading examples</h4>
      <Heading as="h5" size="lg">Channel 01 Telemetry (H5 - lg)</Heading>
    </div>
  ),
};

export const SemanticLevelsWithVisualOverrides: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Heading as="h1" size="base">Semantic H1 with Visual Size "base"</Heading>
      <h2 style={contextStyle}>Semantic section context</h2>
      <Heading as="h3" size="3xl">Semantic H3 with Visual Size "3xl"</Heading>
    </div>
  ),
};

export const NestedContext: Story = {
  render: () => (
    <div style={{ padding: 24 }}>
      <Heading>Page title (h1)</Heading>
      <HeadingLevelProvider>
        <Heading>Section title (h2)</Heading>
        <Card style={{ marginTop: 16 }}>
          <CardTitle>Card title (h3)</CardTitle>
        </Card>
      </HeadingLevelProvider>
    </div>
  ),
};
