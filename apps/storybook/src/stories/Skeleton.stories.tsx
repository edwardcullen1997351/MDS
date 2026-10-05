import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '@ds/react';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Skeleton>;

export const DefaultLine: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '300px' }}>
      <Skeleton height="16px" width="100%" />
    </div>
  ),
};

export const TextParagraph: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Skeleton height="16px" width="100%" />
      <Skeleton height="16px" width="85%" />
      <Skeleton height="16px" width="60%" />
    </div>
  ),
};

export const AvatarCircle: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Skeleton height="40px" width="40px" style={{ borderRadius: '50%' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '160px' }}>
        <Skeleton height="14px" width="100%" />
        <Skeleton height="12px" width="60%" />
      </div>
    </div>
  ),
};

export const CardPlaceholder: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '340px' }}>
      <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px' }}>
        <Skeleton height="120px" width="100%" style={{ marginBottom: '12px', borderRadius: '6px' }} />
        <Skeleton height="18px" width="70%" style={{ marginBottom: '8px' }} />
        <Skeleton height="14px" width="90%" />
      </div>
    </div>
  ),
};

export const TableRowsSkeleton: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Skeleton height="32px" width="100%" />
      <Skeleton height="24px" width="100%" />
      <Skeleton height="24px" width="100%" />
      <Skeleton height="24px" width="100%" />
    </div>
  ),
};
