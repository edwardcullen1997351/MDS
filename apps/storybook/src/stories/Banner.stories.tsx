import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Banner, Button } from '@ds/react';

const meta: Meta<typeof Banner> = {
  title: 'Components/Feedback/Banner',
  component: Banner,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Banner>;

export const Info: Story = {
  render: () => (
    <div style={{ maxWidth: '640px', padding: '24px' }}>
      <Banner status="info" title="Scheduled Maintenance Notice" isDismissible>
        Tandem Press Line 2 will undergo scheduled hydraulic seal replacement on Sunday during Shift C.
      </Banner>
    </div>
  ),
};

export const Success: Story = {
  render: () => (
    <div style={{ maxWidth: '640px', padding: '24px' }}>
      <Banner status="success" title="Quality Audit Passed (ISO-9001)" isDismissible>
        All 1,200 machined components cleared surface finish tolerances.
      </Banner>
    </div>
  ),
};

export const Warning: Story = {
  render: () => (
    <div style={{ maxWidth: '640px', padding: '24px' }}>
      <Banner status="warning" title="Calibration Expiry Warning" isDismissible action={<Button size="sm" variant="secondary">Schedule Calibration</Button>}>
        Micrometer Station MS-04 calibration certificate expires in 3 days.
      </Banner>
    </div>
  ),
};

export const CriticalError: Story = {
  render: () => (
    <div style={{ maxWidth: '640px', padding: '24px' }}>
      <Banner status="error" title="Critical Equipment Interruption" isDismissible>
        Blanking Press emergency stop engaged on line PL-04. Immediate supervisor inspection required.
      </Banner>
    </div>
  ),
};

export const StickyPlantWideAnnouncement: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '800px', padding: '24px' }}>
      <Banner status="info" title="Plant Shift Change Protocol (Shift B to C)">
        All operators must submit digital workstation handoff checklists prior to 18:00 UTC.
      </Banner>
    </div>
  ),
};
