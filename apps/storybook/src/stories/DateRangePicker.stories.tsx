import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DateRangePicker, DateRange, VStack, HStack, Badge, Text, Box } from '@ds/react';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Composites/DateRangePicker',
  component: DateRangePicker,
  tags: ['autodocs'],
  argTypes: {
    showPresets: {
      control: 'boolean',
      description: 'Show quick date preset buttons (Last 24h, 7d, 30d, 90d)',
    },
    isInvalid: {
      control: 'boolean',
      description: 'Places the date range picker into an error/invalid state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error announcement displayed when isInvalid is true (role="alert")',
    },
    helperText: {
      control: 'text',
      description: 'Accessible guidance describing allowable date range intervals',
    },
    className: {
      control: 'text',
      description: 'Custom container class name',
    },
  },
};

export default meta;
type Story = StoryObj<typeof DateRangePicker>;

/**
 * Interactive default playground for DateRangePicker.
 */
export const Default: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({
      startDate: '2026-09-15',
      endDate: '2026-09-22',
    });

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '640px' }}>
        <HStack gap={2} align="center">
          <Text weight="medium">Active Range:</Text>
          <Badge variant="brand">
            {range.startDate} → {range.endDate || '...'}
          </Badge>
        </HStack>

        <DateRangePicker
          value={range}
          onChange={setRange}
          onApply={(r) => alert(`Applied Range: ${r.startDate} to ${r.endDate}`)}
        />
      </VStack>
    );
  },
};

/**
 * Grounded in Suryodaya Autocomp Ltd (Chakan Plant PL-04) shop-floor shift telemetry.
 */
export const PlantTelemetryWindow: Story = {
  render: () => {
    const [telemetryRange, setTelemetryRange] = useState<DateRange>({
      startDate: '2026-09-01',
      endDate: '2026-09-15',
    });

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '640px' }}>
        <Box p={3} isCard style={{ width: '100%' }}>
          <VStack gap={1}>
            <Text size="xs" color="secondary" weight="semibold">
              SURYODAYA AUTOCOMP LTD · CHAKAN PLANT (PL-04)
            </Text>
            <Text size="sm" weight="medium">
              CNC Milling Line 4: OEE Telemetry Aggregation Window
            </Text>
            <HStack gap={2} align="center">
              <Text size="xs" color="muted">Interval:</Text>
              <Badge variant="brand">{telemetryRange.startDate} to {telemetryRange.endDate}</Badge>
            </HStack>
          </VStack>
        </Box>

        <DateRangePicker
          value={telemetryRange}
          onChange={setTelemetryRange}
        />
      </VStack>
    );
  },
};

/**
 * Quick preset filters for operational dashboards (24 Hours, 7 Days, 30 Days).
 */
export const PresetOptions: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({
      startDate: '2026-09-15',
      endDate: '2026-09-22',
    });

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '640px' }}>
        <DateRangePicker
          showPresets={true}
          value={range}
          onChange={setRange}
        />
      </VStack>
    );
  },
};

/**
 * Clean mode without preset pill bar for compact dialog forms and side drawers.
 */
export const WithoutPresets: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({
      startDate: '2026-09-10',
      endDate: '2026-09-20',
    });

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '640px' }}>
        <DateRangePicker
          showPresets={false}
          value={range}
          onChange={setRange}
        />
      </VStack>
    );
  },
};

/**
 * Partial interval entry in progress: Start date selected, awaiting end date selection.
 */
export const PartialEntryInProgress: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({
      startDate: '2026-09-18',
      endDate: '',
    });

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '640px' }}>
        <Box p={3} isCard style={{ width: '100%', background: 'var(--surface-raised, #F8FAFC)' }}>
          <Text size="xs" color="brand" weight="semibold">
            SELECT END DATE TO COMPLETE TIME WINDOW
          </Text>
          <Text size="xs" color="muted">
            Start date locked at {range.startDate}. Click a subsequent day on the calendar to close the interval.
          </Text>
        </Box>

        <DateRangePicker
          value={range}
          onChange={setRange}
        />
      </VStack>
    );
  },
};

/**
 * Form modal integration with explicit Apply and Cancel callbacks.
 */
export const DialogFormIntegration: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({
      startDate: '2026-09-05',
      endDate: '2026-09-18',
    });

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '640px' }}>
        <DateRangePicker
          value={range}
          onChange={setRange}
          onApply={(r) => alert(`Submitted inspection date range: ${r.startDate} to ${r.endDate}`)}
          onCancel={() => alert('Date range selection cancelled')}
        />
      </VStack>
    );
  },
};

/**
 * Month navigation across past fiscal quarters and forward scheduling.
 */
export const MonthNavigation: Story = {
  render: () => {
    const [range, setRange] = useState<DateRange>({
      startDate: '2026-08-01',
      endDate: '2026-08-31',
    });

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '640px' }}>
        <Text size="sm" color="muted">
          Viewing historical August 2026 preventive maintenance interval:
        </Text>
        <DateRangePicker
          defaultValue={range}
          value={range}
          onChange={setRange}
        />
      </VStack>
    );
  },
};

/**
 * Invalid Range state: Displays WCAG 3.3.1 compliant error disclosure when an invalid
 * range is selected (e.g. range spans across uncalibrated telemetry downtime periods).
 */
export const InvalidRange: Story = {
  render: (args) => {
    const [range, setRange] = useState<DateRange>({
      startDate: '2026-09-01',
      endDate: '2026-09-30',
    });

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '640px' }}>
        <DateRangePicker
          {...args}
          value={range}
          onChange={setRange}
          isInvalid={true}
          errorMessage="Selected range exceeds the maximum permissible query window of 14 days."
          helperText="Shift telemetry archives are partitioned in 14-day snapshots per plant SOP-IT-09."
        />
      </VStack>
    );
  },
};
