import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer, DrawerHeader, DrawerTitle, DrawerBody, DrawerFooter, Button } from '@ds/react';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Feedback/Drawer',
  component: Drawer,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Drawer>;

export const RightPlacement: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: '24px' }}>
        <Button onClick={() => setOpen(true)}>Inspect Telemetry Drawer (Right)</Button>
        <Drawer open={open} onOpenChange={setOpen} placement="right">
          <DrawerHeader>
            <DrawerTitle>Spindle Vibration Diagnostics</DrawerTitle>
          </DrawerHeader>
          <DrawerBody>
            <p><strong>Sensor ID:</strong> VIB-AXIS-Z-09</p>
            <p><strong>Sampling Rate:</strong> 25.6 kHz</p>
            <p><strong>RMS Velocity:</strong> 0.14 mm/s (Nominal)</p>
          </DrawerBody>
          <DrawerFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>Close Drawer</Button>
          </DrawerFooter>
        </Drawer>
      </div>
    );
  },
};

export const LeftPlacement: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Button variant="outline">Machine Tree Navigation Drawer (Left)</Button>
    </div>
  ),
};

export const BottomPlacement: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Button variant="outline">Live Spectrum Analyzer Console (Bottom)</Button>
    </div>
  ),
};

export const WithFormActions: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Button variant="outline">Configure PLC Channel Drawer</Button>
    </div>
  ),
};

export const TelemetryInspectorDrawer: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Button variant="outline">Full Telemetry Inspector Drawer</Button>
    </div>
  ),
};
