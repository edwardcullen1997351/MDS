import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '@ds/react';

const meta: Meta<typeof Input> = {
  title: 'Components/Forms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'The sizing tier of the input field',
    },
    label: {
      control: 'text',
      description: 'Text label associated with the input',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder prompt text',
    },
    helperText: {
      control: 'text',
      description: 'Helpful guidance rendered below the input',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message rendered when isInvalid is true',
    },
    isInvalid: {
      control: 'boolean',
      description: 'Puts the input into an error/invalid state',
    },
    isRequired: {
      control: 'boolean',
      description: 'Marks the field as required (*)',
    },
    isOptional: {
      control: 'boolean',
      description: 'Displays an (optional) badge',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables user interaction',
    },
    readOnly: {
      control: 'boolean',
      description: 'Makes the input read-only',
    },
  },
  args: {
    label: 'Work Order Number',
    placeholder: 'e.g. WO-2026-4820',
    size: 'md',
    isInvalid: false,
    isRequired: false,
    isOptional: false,
    disabled: false,
    readOnly: false,
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'engineer@suryodaya.co.in',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Batch / Lot Code',
    placeholder: 'LOT-992-B',
    helperText: 'Enter the 8-character production lot identifier printed on the routing card.',
  },
};

export const RequiredField: Story = {
  args: {
    label: 'Plant Cost Centre',
    placeholder: 'CC-4010',
    isRequired: true,
    helperText: 'Required for budget allocation and ERP synchronization.',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Requisition Spend Limit (₹)',
    placeholder: '2,50,000',
    isInvalid: true,
    errorMessage: 'Spend threshold cannot exceed ₹5,00,000 for standard supervisors.',
    defaultValue: '7,50,000',
  },
};

/**
 * Dual described-by linkage: Demonstrates accessible pairing where both an active
 * error alert (role="alert") and instructional helper text are concurrently bound
 * via the computed aria-describedby attribute (WCAG 1.3.1, 3.3.1, 3.3.2).
 */
export const InvalidWithErrorAndHelper: Story = {
  args: {
    label: 'Hydraulic Pressure Threshold (Bar)',
    defaultValue: '380',
    isInvalid: true,
    errorMessage: 'Pressure setpoint exceeds cylinder safety limit of 320 Bar.',
    helperText: 'Operating range for Schuler 1200T press is 180–320 Bar.',
    isRequired: true,
  },
};

export const WithIcons: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
      <Input
        {...args}
        label="Search Item Master"
        placeholder="Search parts by SKU or description..."
        leftIcon={<span>🔍</span>}
      />
      <Input
        {...args}
        label="Purchase Price (₹)"
        placeholder="0.00"
        leftIcon={<span style={{ fontWeight: 600 }}>₹</span>}
        rightIcon={<span style={{ fontSize: '12px', color: '#6B7280' }}>INR</span>}
      />
    </div>
  ),
};

export const SizingMatrix: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Input {...args} size="sm" label="Small (32px)" placeholder="Compact input..." />
      <Input {...args} size="md" label="Medium (40px)" placeholder="Default input..." />
      <Input {...args} size="lg" label="Large (48px)" placeholder="Spacious input..." />
    </div>
  ),
};

export const DisabledAndReadOnly: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
      <Input
        {...args}
        label="Archived Part Code (Disabled)"
        value="BRK-OLD-001"
        disabled
        helperText="This part was sunset in 2024."
      />
      <Input
        {...args}
        label="System Generated UUID (ReadOnly)"
        value="9f4a123c-678b-4def-b123-999988887777"
        readOnly
        helperText="Clicking does not allow modification."
      />
    </div>
  ),
};
