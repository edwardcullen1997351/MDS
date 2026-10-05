import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardLink, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from '@ds/react';

const meta: Meta<typeof Card> = {
  title: 'Components/Core/Card',
  component: Card,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Card>;

export const ElevatedDefault: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', padding: '24px' }}>
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Stamping Cell SC-04</CardTitle>
          <CardDescription>Continuous load telemetry and cycle analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ fontSize: '13px', color: '#475569' }}>Hydraulic ram tonnage operating nominally @ 245T (98% efficiency).</div>
        </CardContent>
        <CardFooter>
          <Button size="sm" variant="outline">View Telemetry</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const Outline: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', padding: '24px' }}>
      <Card variant="outline">
        <CardHeader>
          <CardTitle>Spindle Temperature Sensor</CardTitle>
          <CardDescription>Station 2A - Bearing Package</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0F172A' }}>74.2 °C</div>
        </CardContent>
      </Card>
    </div>
  ),
};

const InteractiveCardExample = () => {
  const [pinned, setPinned] = React.useState(false);
  return (
    <div style={{ maxWidth: '400px', padding: '24px' }}>
      <Card variant="outline">
        <CardHeader>
          <CardTitle><CardLink href="#tool-wear-report">Inspect Tool Wear Report →</CardLink></CardTitle>
          <CardDescription>Open the toolpath wear report or pin it for later.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button size="sm" variant="outline" aria-pressed={pinned} onClick={() => setPinned(!pinned)}>
            {pinned ? 'Unpin report' : 'Pin report'}
          </Button>
        </CardFooter>
      </Card>
      <section id="tool-wear-report" style={{ marginTop: 'var(--space-6)' }}>
        <h2>Tool wear report</h2>
        <p>Toolpath wear simulation and inspection details.</p>
      </section>
    </div>
  );
};

export const InteractiveClickable: Story = {
  render: () => <InteractiveCardExample />,
};

export const CompactDensity: Story = {
  render: () => (
    <div style={{ maxWidth: '320px', padding: '24px' }}>
      <Card variant="outline" style={{ padding: '12px' }}>
        <div style={{ fontSize: '12px', color: '#64748B' }}>AIR PRESSURE</div>
        <div style={{ fontSize: '18px', fontWeight: 600 }}>6.2 Bar</div>
      </Card>
    </div>
  ),
};

export const DisabledCard: Story = {
  render: () => (
    <div style={{ maxWidth: '400px', padding: '24px' }}>
      <Card variant="outline">
        <CardHeader>
          <CardTitle>Line 4 (Decommissioned)</CardTitle>
          <CardDescription>Archived telemetry logs only</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
};
