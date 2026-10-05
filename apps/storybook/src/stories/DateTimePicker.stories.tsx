import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  DateTimePicker,
  DateTimeParts,
  VStack,
  HStack,
  Badge,
  Text,
  Box,
} from '@ds/react';

const meta: Meta<typeof DateTimePicker> = {
  title: 'Composites/DateTimePicker',
  component: DateTimePicker,
  tags: ['autodocs'],
  argTypes: {
    zone: {
      control: 'text',
      description: 'IANA timezone for the Site clock (e.g. Asia/Kolkata, America/Chicago)',
    },
    layout: {
      control: 'select',
      options: ['auto', 'inline', 'stacked'],
      description: 'Layout orientation for date and time fields',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Control height and typography density scale',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables both date and time controls',
    },
    readOnly: {
      control: 'boolean',
      description: 'Sets fields to read-only state',
    },
    allowPartial: {
      control: 'boolean',
      description: 'Permits intermediate state where only date or time is entered',
    },
    error: {
      control: 'text',
      description: 'Explicit error announcement rendered when value is invalid (role="alert")',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateTimePicker>;

/**
 * Interactive default playground for DateTimePicker.
 */
export const Default: Story = {
  render: () => {
    const [val, setVal] = useState<string | undefined>('2026-09-23T14:30:00Z');
    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '600px' }}>
        <DateTimePicker
          label="Telemetry Timestamp"
          zone="Asia/Kolkata"
          value={val}
          onChange={(v) => setVal(v)}
          hint="Stored as UTC instant; rendered in Indian Standard Time (IST)."
        />
      </VStack>
    );
  },
};

/**
 * Production incident logging in Suryodaya Autocomp Ltd (Chakan Plant PL-04, Pune).
 * Values stored in UTC and edited on the plant's IST (Asia/Kolkata) clock.
 */
export const PlantInstant: Story = {
  render: () => {
    const [instantValue, setInstantValue] = useState<string | undefined>(
      '2026-09-23T09:00:00Z'
    );
    const [parts, setParts] = useState<DateTimeParts | null>(null);

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '640px' }}>
        <Box p={3} isCard style={{ width: '100%' }}>
          <VStack gap={2}>
            <Text size="xs" color="secondary" weight="semibold">
              SURYODAYA AUTOCOMP LTD · CHAKAN PLANT (PL-04)
            </Text>
            <HStack gap={3} align="center" wrap>
              <Text size="sm" weight="medium">
                Committed Instant (UTC):
              </Text>
              <Badge variant="brand">{instantValue || 'None (Incomplete)'}</Badge>
            </HStack>
            {parts && (
              <Text size="xs" color="muted">
                Plant Wall Clock: {parts.date || '—'} at {parts.time || '—'} (IST / UTC+5:30)
              </Text>
            )}
          </VStack>
        </Box>

        <DateTimePicker
          label="CNC Spindle Thermal Fault Incident"
          zone="Asia/Kolkata"
          value={instantValue}
          onChange={(val, p) => {
            setInstantValue(val);
            setParts(p);
          }}
          hint="Logged in Indian Standard Time (IST). Saved as UTC instant in MES telemetry."
        />
      </VStack>
    );
  },
};

/**
 * Floating Wall-Clock mode for shift schedules, maintenance templates, or unzoned events.
 */
export const FloatingWallClock: Story = {
  render: () => {
    const [floatingVal, setFloatingVal] = useState<string | undefined>(
      '2026-09-24T06:00'
    );

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '580px' }}>
        <HStack gap={2} align="center">
          <Text weight="medium">Shift Cut-off Schedule:</Text>
          <Badge variant="neutral">{floatingVal || 'Unspecified'}</Badge>
        </HStack>

        <DateTimePicker
          label="Morning Shift A Handover Window"
          value={floatingVal}
          onChange={(val) => setFloatingVal(val)}
          hint="Floating wall-clock template applied to whichever production line runs this shift."
        />
      </VStack>
    );
  },
};

/**
 * Demonstrates cross-field boundary constraints and error targeting.
 * Restricts selection to the September shutdown calibration cycle.
 */
export const InvalidIntervalBounds: Story = {
  render: () => {
    const [val, setVal] = useState<string | undefined>('2026-10-15T10:00:00Z');

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '580px' }}>
        <DateTimePicker
          label="Tooling Calibration Work Order Window"
          zone="Asia/Kolkata"
          value={val}
          min="2026-09-01T00:00:00Z"
          max="2026-09-30T23:59:00Z"
          onChange={(v) => setVal(v)}
          hint="Valid calibration range: 2026-09-01 to 2026-09-30 (September shutdown cycle)."
        />
      </VStack>
    );
  },
};

/**
 * Partial entry state with `allowPartial={true}` permitting intermediate entry.
 */
export const PartialEntryState: Story = {
  render: () => {
    const [val, setVal] = useState<string | undefined>('2026-09-23');

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '580px' }}>
        <DateTimePicker
          label="Scheduled Maintenance Outage"
          allowPartial={true}
          zone="Asia/Kolkata"
          value={val}
          onChange={(v) => setVal(v)}
          hint="Intermediate entry permitted while technician confirms final hour window."
        />
      </VStack>
    );
  },
};

/**
 * Layout arrangements: Stacked layout for compact sidebars and narrow drawers.
 */
export const StackedLayout: Story = {
  render: () => (
    <VStack gap={6} align="start" style={{ padding: '24px', maxWidth: '320px' }}>
      <DateTimePicker
        label="Drawer Compact Picker"
        layout="stacked"
        zone="Asia/Kolkata"
        defaultValue="2026-09-23T16:00:00Z"
        hint="Stacked vertical layout for narrow mobile/drawer forms."
      />
    </VStack>
  ),
};

/**
 * Disabled and Read-Only states for locked inspection logs and historical audits.
 */
export const DisabledAndReadOnly: Story = {
  render: () => (
    <VStack gap={6} align="start" style={{ padding: '24px', maxWidth: '580px' }}>
      <DateTimePicker
        label="Archived Quality Non-conformance (Locked)"
        zone="Asia/Kolkata"
        value="2026-08-14T04:30:00Z"
        disabled
        hint="Historical record signed by Quality Manager Meera Nair."
      />

      <DateTimePicker
        label="MES Audit Snapshot (Read-Only Inspection)"
        zone="Asia/Kolkata"
        value="2026-09-20T12:00:00Z"
        readOnly
        hint="Live telemetry snapshot viewable by line supervisors."
      />
    </VStack>
  ),
};

/**
 * Invalid and Boundary Violation state: Demonstrates WCAG 3.3.1 error announcement
 * when a scheduled maintenance window falls outside permissible shift operating hours.
 */
export const InvalidAndBoundaryNotice: Story = {
  render: (args) => {
    const [val, setVal] = useState<string | undefined>('2026-09-23T23:45:00Z');
    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '600px' }}>
        <DateTimePicker
          {...args}
          label="Furnace Preheat Initiation"
          zone="Asia/Kolkata"
          value={val}
          onChange={(v) => setVal(v)}
          min="2026-09-23T06:00:00Z"
          max="2026-09-23T22:00:00Z"
          error="Furnace preheating cannot be scheduled during Plant PL-04 peak power tariff window (22:00 - 06:00 IST)."
          hint="Permissible scheduling window: 06:00 to 22:00 IST."
        />
      </VStack>
    );
  },
};
