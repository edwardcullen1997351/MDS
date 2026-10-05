import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SplitButton,
  MenuItem,
  MenuSeparator,
  MenuLabel,
  HStack,
  VStack,
  Icon,
  Text,
  Box,
} from '@ds/react';

const meta: Meta<typeof SplitButton> = {
  title: 'Composites/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'outline'],
      description: 'Visual button hierarchy variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size scale',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables both main button and dropdown caret',
    },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    children: 'Release Work Order',
  },
};

export default meta;
type Story = StoryObj<typeof SplitButton>;

/**
 * Interactive default playground for SplitButton.
 */
export const Default: Story = {
  render: (args) => (
    <div style={{ padding: '24px 24px 200px 24px' }}>
      <SplitButton
        {...args}
        menu={
          <>
            <MenuLabel>Batch Actions</MenuLabel>
            <MenuItem icon={<Icon name="check" size="sm" />}>
              Release & Print Dispatch Label
            </MenuItem>
            <MenuItem icon={<Icon name="alert-circle" size="sm" />}>
              Release with Engineering Hold
            </MenuItem>
            <MenuSeparator />
            <MenuItem variant="danger" icon={<Icon name="trash" size="sm" />}>
              Scrap Batch Record
            </MenuItem>
          </>
        }
      />
    </div>
  ),
};

/**
 * Variant Scale: Demonstrates primary, secondary, outline, and danger variants.
 */
export const VariantScale: Story = {
  render: () => (
    <VStack gap={4} align="start" style={{ padding: '24px 24px 200px 24px' }}>
      <SplitButton
        variant="primary"
        menu={<MenuItem>Deploy Firmware Immediately</MenuItem>}
      >
        Sync Telemetry Engine
      </SplitButton>

      <SplitButton
        variant="secondary"
        menu={<MenuItem>Export to S3 Bucket</MenuItem>}
      >
        Download CSV Report
      </SplitButton>

      <SplitButton
        variant="outline"
        menu={<MenuItem>Schedule Audit for Tomorrow</MenuItem>}
      >
        Run Line Diagnostics
      </SplitButton>

      <SplitButton
        variant="danger"
        menu={<MenuItem>Purge Historical Calibration Logs</MenuItem>}
      >
        Emergency Plant Lockout
      </SplitButton>
    </VStack>
  ),
};

/**
 * Size Scale: Demonstrates sm (28px), md (32px), and lg (40px) sizing tiers.
 */
export const SizeScale: Story = {
  render: () => (
    <VStack gap={4} align="start" style={{ padding: '24px 24px 200px 24px' }}>
      <HStack gap={3} align="center">
        <Text size="xs" color="muted" style={{ width: '80px' }}>Small (sm):</Text>
        <SplitButton size="sm" variant="secondary" menu={<MenuItem>Print Label</MenuItem>}>
          Dispatch Lot
        </SplitButton>
      </HStack>

      <HStack gap={3} align="center">
        <Text size="xs" color="muted" style={{ width: '80px' }}>Medium (md):</Text>
        <SplitButton size="md" variant="secondary" menu={<MenuItem>Print Label</MenuItem>}>
          Dispatch Lot
        </SplitButton>
      </HStack>

      <HStack gap={3} align="center">
        <Text size="xs" color="muted" style={{ width: '80px' }}>Large (lg):</Text>
        <SplitButton size="lg" variant="secondary" menu={<MenuItem>Print Label</MenuItem>}>
          Dispatch Lot
        </SplitButton>
      </HStack>
    </VStack>
  ),
};

/**
 * Work Order Release Action Workflow in Suryodaya Autocomp Ltd (Chakan Plant PL-04).
 */
export const WorkOrderActions: Story = {
  render: () => (
    <VStack gap={4} align="start" style={{ maxWidth: '600px', padding: '24px 24px 200px 24px' }}>
      <Box p={3} isCard style={{ width: '100%' }}>
        <VStack gap={1}>
          <Text size="xs" color="secondary" weight="semibold">
            WORK ORDER WO-4820-09
          </Text>
          <Text size="sm" weight="medium">
            Part BRK-4820-A (Quantity: 500 pcs) • Status: Ready for Production Release
          </Text>
        </VStack>
      </Box>

      <SplitButton
        variant="primary"
        onClick={() => alert('Work Order Released directly to shop floor')}
        menu={
          <>
            <MenuItem onClick={() => alert('Releasing with supervisor override')}>
              Release with Supervisor Override
            </MenuItem>
            <MenuItem onClick={() => alert('Releasing to Stage Buffer')}>
              Release to Staging Bay
            </MenuItem>
            <MenuSeparator />
            <MenuItem variant="danger" onClick={() => alert('Cancelling WO')}>
              Cancel Work Order
            </MenuItem>
          </>
        }
      >
        Release to Line 4 (Immediate)
      </SplitButton>
    </VStack>
  ),
};

/**
 * High-Severity Emergency Danger Action.
 */
export const DangerAction: Story = {
  render: () => (
    <div style={{ padding: '24px 24px 200px 24px' }}>
      <SplitButton
        variant="danger"
        onClick={() => alert('EMERGENCY STOP TRIGGERED')}
        menu={
          <>
            <MenuItem onClick={() => alert('Selective Hydraulic De-energize')}>
              De-energize Hydraulic Stamping Cell
            </MenuItem>
            <MenuItem onClick={() => alert('Full Plant Power Cut')}>
              Full Substation Power Cut
            </MenuItem>
          </>
        }
      >
        Emergency Cell Stop
      </SplitButton>
    </div>
  ),
};

/**
 * Synchronized Disabled State: Both main action and caret dropdown are disabled together.
 */
export const DisabledState: Story = {
  render: () => (
    <VStack gap={4} align="start" style={{ padding: '24px' }}>
      <Text size="sm" color="muted">
        Disabled state when user lacks authorization role (Quality Inspector vs Plant Head):
      </Text>
      <SplitButton
        disabled={true}
        variant="primary"
        menu={<MenuItem>Override Quality Gate</MenuItem>}
      >
        Authorize Shipment Disposition
      </SplitButton>
    </VStack>
  ),
};

/**
 * Tooling calibration actions with icon triggers.
 */
export const ToolingActions: Story = {
  render: () => (
    <div style={{ padding: '24px 24px 200px 24px' }}>
      <SplitButton
        variant="secondary"
        onClick={() => alert('Starting automatic probe calibration')}
        menu={
          <>
            <MenuItem icon={<Icon name="settings" size="sm" />}>
              Configure Probe Offsets
            </MenuItem>
            <MenuItem icon={<Icon name="file-text" size="sm" />}>
              View Calibration History
            </MenuItem>
            <MenuSeparator />
            <MenuItem icon={<Icon name="download" size="sm" />}>
              Export Raw Sensor Telemetry
            </MenuItem>
          </>
        }
      >
        Calibrate CMM Touch Probe
      </SplitButton>
    </div>
  ),
};
