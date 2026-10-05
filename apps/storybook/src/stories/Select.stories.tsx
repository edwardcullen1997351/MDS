import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '@ds/react';

const meta: Meta<typeof Select> = {
  title: 'Components/Forms/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Sizing tier for trigger height and typography',
    },
    label: {
      control: 'text',
      description: 'Accessible label associated with the select',
    },
    placeholder: {
      control: 'text',
      description: 'Prompt displayed when no option is selected',
    },
    helperText: {
      control: 'text',
      description: 'Guidance text linked via aria-describedby',
    },
    errorMessage: {
      control: 'text',
      description: 'Error alert linked via aria-describedby when isInvalid is true',
    },
    isInvalid: {
      control: 'boolean',
      description: 'Marks select trigger invalid and applies error styling',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables select trigger and interaction',
    },
  },
  args: {
    size: 'md',
    isInvalid: false,
    disabled: false,
  },
};
export default meta;
type Story = StoryObj<typeof Select>;

const alloys = [
  { label: 'Titanium Ti-6Al-4V (Grade 5)', value: 'ti6al4v' },
  { label: 'Aluminum 6061-T6', value: 'al6061' },
  { label: 'Inconel 718 Superalloy', value: 'inconel718' },
];

export const Default: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '340px' }}>
      <Select label="Machining Material Alloy" items={alloys} defaultValue={['ti6al4v']} />
    </div>
  ),
};

export const WithPlaceholder: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '340px' }}>
      <Select
        label="Select Shift Supervisor"
        placeholder="Choose assigned supervisor..."
        items={[
          { label: 'Marcus Vance', value: 'mv' },
          { label: 'Elena Rostova', value: 'er' },
        ]}
      />
    </div>
  ),
};

export const SizingMatrix: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <Select size="sm" label="Small (sm)" items={[{ label: 'Option 1', value: '1' }]} />
      <Select size="md" label="Medium (md)" items={[{ label: 'Option 1', value: '1' }]} />
      <Select size="lg" label="Large (lg)" items={[{ label: 'Option 1', value: '1' }]} />
    </div>
  ),
};

export const DisabledState: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '340px' }}>
      <Select disabled label="Locked Calibration Protocol" defaultValue={['nist']} items={[{ label: 'NIST Traceable Spec A-99', value: 'nist' }]} />
    </div>
  ),
};

export const InteractiveSelection: Story = {
  render: () => (
    <div style={{ padding: '24px', maxWidth: '340px' }}>
      <Select label="Active Toolholder Profile" items={alloys} />
    </div>
  ),
};

export const WithHelperText: Story = {
  render: (args) => (
    <div style={{ padding: '24px', maxWidth: '340px' }}>
      <Select
        {...args}
        label="Inspection Sampling Standard"
        items={[
          { label: 'ISO 2859-1 (Normal Sampling)', value: 'iso2859' },
          { label: 'MIL-STD-105E (Tightened)', value: 'mil105e' },
          { label: 'Zero Acceptance Number (c=0)', value: 'c0' },
        ]}
        helperText="Defines the statistical sampling plan for incoming lot verification."
      />
    </div>
  ),
};

export const InvalidState: Story = {
  render: (args) => (
    <div style={{ padding: '24px', maxWidth: '340px' }}>
      <Select
        {...args}
        label="Mandatory Calibration Standard"
        items={[
          { label: 'ISO/IEC 17025 Certified', value: 'iso17025' },
          { label: 'NABL Accredited Lab Spec', value: 'nabl' },
        ]}
        isInvalid={true}
        errorMessage="Please select an approved calibration accreditation standard."
        helperText="Required by plant quality assurance audit SOP-QA-04."
      />
    </div>
  ),
};
