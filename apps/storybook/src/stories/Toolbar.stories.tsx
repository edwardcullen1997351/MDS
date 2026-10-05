import {
Badge,
Box,
Button,
HStack,
SearchField,
Select,
Text,
Toolbar,
VStack
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta<typeof Toolbar> = {
  title: 'Composites/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  argTypes: {
    selectedCount: {
      control: 'number',
      description: 'Number of selected rows triggering bulk selection mode',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toolbar>;

const filterItems = [
  { label: 'All Work Cells', value: 'all' },
  { label: 'Cell 1: Hydraulic Press', value: 'cell-1' },
  { label: 'Cell 2: CNC 5-Axis Milling', value: 'cell-2' },
  { label: 'Cell 3: Robotic Laser Welder', value: 'cell-3' },
];

/**
 * Interactive default playground for Toolbar.
 */
export const Default: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    return (
      <div style={{ padding: '24px' }}>
        <Toolbar
          search={
            <SearchField aria-label="Search work orders, lot numbers"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              placeholder="Search work orders, lot numbers..."
            />
          }
          filters={
            <Select aria-label="Select option"
              items={filterItems}
              defaultValue={['all']}
              placeholder="Filter by Cell..."
            />
          }
          actions={
            <HStack gap={2}>
              <Button variant="outline" size="md">
                Export CSV
              </Button>
              <Button variant="primary" size="md">
                + New Work Order
              </Button>
            </HStack>
          }
        />
      </div>
    );
  },
};

/**
 * Bulk Selection Mode: Automatically triggered when rows are selected in an attached table.
 */
export const BulkSelectionActive: Story = {
  render: () => {
    const [selectedCount, setSelectedCount] = useState(8);

    return (
      <VStack gap={4} style={{ padding: '24px', width: '100%', boxSizing: 'border-box' }}>
        <HStack gap={2}>
          <Button size="sm" variant="outline" onClick={() => setSelectedCount(0)}>
            Clear Selection (0)
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelectedCount(4)}>
            Select 4 Rows
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelectedCount(12)}>
            Select 12 Rows
          </Button>
        </HStack>

        <Toolbar
          selectedCount={selectedCount}
          onClearSelection={() => setSelectedCount(0)}
          bulkActions={
            <HStack gap={2}>
              <Button variant="outline" size="sm">
                Batch Print Routing Travelers
              </Button>
              <Button variant="outline" size="sm">
                Assign Line Supervisor
              </Button>
              <Button variant="danger" size="sm">
                Hold Selected Batches
              </Button>
            </HStack>
          }
        />
      </VStack>
    );
  },
};

/**
 * Search and Action Buttons Only (No secondary dropdown filters).
 */
export const SearchAndActionsOnly: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    return (
      <div style={{ padding: '24px' }}>
        <Toolbar
          search={
            <SearchField aria-label="Search part catalogue"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              placeholder="Search part catalogue..."
            />
          }
          actions={
            <Button variant="primary" size="md">
              Create Part Entry
            </Button>
          }
        />
      </div>
    );
  },
};

/**
 * Plant Shift Operations Console (Suryodaya Autocomp Ltd Chakan Plant PL-04).
 */
export const ShopFloorConsoleMode: Story = {
  render: () => {
    const [query, setQuery] = useState('BRK-4820-A');
    return (
      <VStack gap={4} style={{ padding: '24px', width: '100%', boxSizing: 'border-box' }}>
        <Box p={3} isCard style={{ width: '100%' }}>
          <VStack gap={1}>
            <Text size="xs" color="secondary" weight="semibold">
              CHAKAN PLANT PL-04 · SHIFT A LIVE DISPATCH CONSOLE
            </Text>
            <HStack gap={2} align="center">
              <Text size="sm" weight="medium">Production Supervisor: Sandeep Kulkarni</Text>
              <Badge variant="brand">Shift A Nominal</Badge>
            </HStack>
          </VStack>
        </Box>

        <Toolbar
          search={
            <SearchField aria-label="Filter active work orders"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              placeholder="Filter active work orders..."
            />
          }
          filters={
            <div style={{ minWidth: '240px' }}>
              <Select aria-label="Select option"
                items={[
                  { label: 'All Shifts (A / B / C)', value: 'all' },
                  { label: 'Shift A (06:00 - 14:30 IST)', value: 'shift-a' },
                  { label: 'Shift B (14:30 - 23:00 IST)', value: 'shift-b' },
                ]}
                defaultValue={['shift-a']}
              />
            </div>
          }
          actions={
            <HStack gap={2}>
              <Button variant="outline" size="md">
                Shift Summary PDF
              </Button>
              <Button variant="primary" size="md">
                Release Next Batch
              </Button>
            </HStack>
          }
        />
      </VStack>
    );
  },
};

/**
 * Interactive Selection Switcher: Toggles between standard table toolbar and batch execution mode.
 */
export const InteractiveSelectionToggle: Story = {
  render: () => {
    const [isBulk, setIsBulk] = useState(false);
    const [query, setQuery] = useState('');

    return (
      <VStack gap={4} style={{ padding: '24px', width: '100%', boxSizing: 'border-box' }}>
        <HStack>
          <Button size="sm" variant="outline" onClick={() => setIsBulk(!isBulk)}>
            Toggle Mode: {isBulk ? 'Switch to Standard Search' : 'Simulate 6 Items Selected'}
          </Button>
        </HStack>

        <Toolbar
          selectedCount={isBulk ? 6 : 0}
          onClearSelection={() => setIsBulk(false)}
          search={
            <SearchField aria-label="Search equipment telemetry"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              placeholder="Search equipment telemetry..."
            />
          }
          actions={
            <Button variant="primary" size="md">
              Run Calibration Routine
            </Button>
          }
          bulkActions={
            <HStack gap={2}>
              <Button variant="outline" size="sm">
                Sync Telemetry (6)
              </Button>
              <Button variant="danger" size="sm">
                Emergency Hold
              </Button>
            </HStack>
          }
        />
      </VStack>
    );
  },
};

/**
 * Dense Sub-Panel Toolbar: Compact toolbar for drawer sidebars and sub-inspections.
 */
export const DenseSubPanelToolbar: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    return (
      <div style={{ maxWidth: '480px', padding: '24px' }}>
        <Toolbar
          search={
            <SearchField aria-label="Filter attributes"
              size="sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              placeholder="Filter attributes..."
            />
          }
          actions={
            <Button variant="outline" size="sm">
              Filter
            </Button>
          }
        />
      </div>
    );
  },
};

/**
 * Minimal Toolbar with Actions Only.
 */
export const ActionsOnly: Story = {
  render: () => (
    <div style={{ padding: '24px' }}>
      <Toolbar
        actions={
          <HStack gap={2}>
            <Button variant="outline" size="md">
              Refresh Telemetry
            </Button>
            <Button variant="primary" size="md">
              Acknowledge All Alarms
            </Button>
          </HStack>
        }
      />
    </div>
  ),
};
