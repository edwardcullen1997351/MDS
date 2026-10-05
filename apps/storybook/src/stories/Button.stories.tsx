import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@ds/react';

const meta: Meta<typeof Button> = {
  title: 'Components/Core/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'danger', 'ghost'],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'The size tier of the button',
    },
    isFullWidth: {
      control: 'boolean',
      description: 'Whether the button spans 100% of parent container width',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the button is in a loading state',
    },
    loadingText: {
      control: 'text',
      description: 'Screen reader announcement during loading',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    children: {
      control: 'text',
      description: 'The button label text',
    },
  },
  args: {
    children: 'Button Label',
    variant: 'primary',
    size: 'md',
    isFullWidth: false,
    isLoading: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Save Changes',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Cancel',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Action',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete Resource',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Learn More',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    isLoading: true,
    loadingText: 'Publishing draft...',
    children: 'Publish',
  },
};

export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button
        {...args}
        variant="primary"
        leftIcon={<span>🚀</span>}
      >
        Deploy
      </Button>
      <Button
        {...args}
        variant="secondary"
        rightIcon={<span>→</span>}
      >
        Continue
      </Button>
    </div>
  ),
};

export const FullWidth: Story = {
  args: {
    variant: 'primary',
    isFullWidth: true,
    children: 'Full Width Action',
  },
};

export const SizingMatrix: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button {...args} size="sm">Small (32px)</Button>
      <Button {...args} size="md">Medium (40px)</Button>
      <Button {...args} size="lg">Large (48px)</Button>
    </div>
  ),
};
