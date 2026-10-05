import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Toolbar,
  SearchField,
  Select,
  Badge,
  Button,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  ToastProvider,
} from '@ds/react';

const meta: Meta = {
  title: 'Interaction Patterns/05 Collection Refinement',
  decorators: [
    (Story) => (
      <ToastProvider position="top-right">
        <div style={{ padding: '32px', backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          '**Collection Refinement Pattern (§01–§20)**\n\n' +
          'Governs one canonical refinement model read by controls, active-criteria tokens, option counts, and the collection. Removal writes back to originating control, with clear zero-result recovery.\n\n' +
          '*Scenario:* Triaging maintenance work requests (WRs) at **Suryodaya Autocomp Ltd (PL-04 Chakan)** under Maintenance Head Vikram Bhosale.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface WorkRequest {
  id: string;
  equipment: string;
  line: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Awaiting Spares' | 'Completed';
}

const initialBacklog: WorkRequest[] = [
  { id: 'WR-401', equipment: '800T Press Main Hydraulic Seal', line: 'Line 01', priority: 'Critical', status: 'Open' },
  { id: 'WR-402', equipment: 'CNC Hobbing Spindle Bearing', line: 'Line 01', priority: 'High', status: 'In Progress' },
  { id: 'WR-403', equipment: 'Induction Coil Water Chiller', line: 'Line 02', priority: 'Medium', status: 'Awaiting Spares' },
  { id: 'WR-404', equipment: 'Deburring Station Dust Collector', line: 'Line 02', priority: 'Low', status: 'Open' },
  { id: 'WR-405', equipment: 'CMM Probe Calibration Offset', line: 'Line 04', priority: 'High', status: 'Open' },
];

// 1. Multi-Faceted Filter (Happy Path)
export const MultiFacetedFilter: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<string[]>(['all']);
    const [lineFilter, setLineFilter] = useState<string[]>(['all']);

    const filtered = initialBacklog.filter((r) => {
      const matchQ = r.equipment.toLowerCase().includes(query.toLowerCase()) || r.id.toLowerCase().includes(query.toLowerCase());
      const matchP = priorityFilter[0] === 'all' || r.priority.toLowerCase() === priorityFilter[0];
      const matchL = lineFilter[0] === 'all' || r.line.toLowerCase() === lineFilter[0];
      return matchQ && matchP && matchL;
    });

    const hasFilters = query || priorityFilter[0] !== 'all' || lineFilter[0] !== 'all';

    const clearAll = () => {
      setQuery('');
      setPriorityFilter(['all']);
      setLineFilter(['all']);
    };

    return (
      <Box style={{ maxWidth: '840px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Plant Maintenance · Chakan PL-04 Work Backlog
            </span>
            <Heading as="h2" size="xl" weight="bold">Maintenance Work Requests</Heading>
            <Text variant="caption" color="secondary">
              Multi-facet filter combining query, priority, and production line with synchronized token state.
            </Text>
          </div>

          <Toolbar
            search={
              <SearchField aria-label="Search equipment or WR id"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClear={() => setQuery('')}
                placeholder="Search equipment or WR id..."
              />
            }
            filters={
              <HStack gap={2}>
                <Select aria-label="Select option"
                  size="md"
                  items={[
                    { label: 'All Priorities', value: 'all' },
                    { label: 'Critical', value: 'critical' },
                    { label: 'High', value: 'high' },
                    { label: 'Medium', value: 'medium' },
                  ]}
                  value={priorityFilter}
                  onValueChange={(d) => setPriorityFilter(d.value)}
                />
                <Select aria-label="Select option"
                  size="md"
                  items={[
                    { label: 'All Lines', value: 'all' },
                    { label: 'Line 01', value: 'line 01' },
                    { label: 'Line 02', value: 'line 02' },
                    { label: 'Line 04', value: 'line 04' },
                  ]}
                  value={lineFilter}
                  onValueChange={(d) => setLineFilter(d.value)}
                />
              </HStack>
            }
          />

          {hasFilters && (
            <HStack gap={2} align="center" style={{ padding: '8px 12px', backgroundColor: '#EFF6FF', borderRadius: '6px' }}>
              <Text size="xs" weight="bold" color="secondary">ACTIVE FILTERS:</Text>
              {query && <Badge variant="neutral">Query: "{query}"</Badge>}
              {priorityFilter[0] !== 'all' && <Badge variant="warning">Priority: {priorityFilter[0]}</Badge>}
              {lineFilter[0] !== 'all' && <Badge variant="neutral">Line: {lineFilter[0]}</Badge>}
              <Button size="sm" variant="ghost" onClick={clearAll} style={{ marginLeft: 'auto', fontSize: '12px' }}>
                Clear All
              </Button>
            </HStack>
          )}

          <Box isCard style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>WR ID</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>EQUIPMENT / FAILURE</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>LINE</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>PRIORITY</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1D4ED8' }}>{r.id}</td>
                    <td style={{ padding: '10px 14px' }}>{r.equipment}</td>
                    <td style={{ padding: '10px 14px', color: '#64748B' }}>{r.line}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <Badge variant={r.priority === 'Critical' ? 'danger' : r.priority === 'High' ? 'warning' : 'neutral'}>
                        {r.priority}
                      </Badge>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <Badge variant={r.status === 'Open' ? 'warning' : 'neutral'}>{r.status}</Badge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#64748B' }}>
                      No work requests match the selected refinement criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 2. Token Removal Sync
export const TokenRemovalSync: Story = {
  render: () => {
    const [tag, setTag] = useState<string | null>('Line 01');

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="info">Sync Contract</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Token Removal Bi-directional Sync
            </Heading>
            <Text variant="caption" color="secondary">
              Dismissing an active filter token directly resets its originating selection control.
            </Text>
          </div>

          <Box p={4} isCard>
            <VStack gap={3} align="start">
              {tag ? (
                <HStack gap={2} align="center">
                  <Badge variant="brand">Line: {tag}</Badge>
                  <Button size="sm" variant="outline" onClick={() => setTag(null)}>
                    ✕ Remove Token
                  </Button>
                </HStack>
              ) : (
                <Text size="sm" color="secondary">Token removed. Filter reset to "All Lines".</Text>
              )}
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 3. Zero Result State with Clear
export const ZeroResultStateWithClear: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="warning">Zero Matches</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Over-Refined Empty State
          </Heading>
          <Text variant="caption" color="secondary">
            Clear distinction between an empty database vs an over-filtered search.
          </Text>
        </div>

        <Box p={6} isCard style={{ textAlign: 'center' }}>
          <VStack gap={3} align="center">
            <Heading as="h3" size="lg">No Work Requests in "Line 03" with "Critical" Priority</Heading>
            <Text size="sm" color="secondary">
              All 12 maintenance requests on Line 03 are currently marked as Normal or Completed.
            </Text>
            <Button variant="primary" size="sm" onClick={() => alert('Filters reset')}>
              Reset All Filters (Show All 42 Requests)
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 4. Async Filter Latency State
export const AsyncFilterUpdate: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Async Latency</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Non-Blocking Refinement
          </Heading>
          <Text variant="caption" color="secondary">
            Controls remain interactive while the collection asynchronously updates in the background.
          </Text>
        </div>

        <Box isCard p={4} style={{ opacity: 0.6 }}>
          <Text size="sm">⏳ Querying PL-04 maintenance cluster for "High Priority"...</Text>
        </Box>
      </VStack>
    </Box>
  ),
};

// 5. Prepopulated Refined View
export const PrepopulatedRefinedView: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="neutral">Deep Link</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Pre-Filtered Supervisor View
          </Heading>
          <Text variant="caption" color="secondary">
            View initialized via URL query params (`?priority=critical&line=line01`).
          </Text>
        </div>

        <Box p={4} isCard>
          <Text size="sm" weight="semibold">Showing 1 Critical Breakdown for Press Shop Line 01</Text>
        </Box>
      </VStack>
    </Box>
  ),
};

// 6. Disabled Filters When Collection Empty
export const DisabledFiltersWhenEmpty: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="neutral">Empty Dataset</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Disabled Filter Controls
          </Heading>
          <Text variant="caption" color="secondary">
            When no items exist in the category, facet dropdowns are gracefully disabled.
          </Text>
        </div>

        <HStack gap={3}>
          <SearchField aria-label="Filter disabled (0 items)" placeholder="Filter disabled (0 items)..." disabled />
          <Button variant="outline" disabled>Filter by Line</Button>
        </HStack>
      </VStack>
    </Box>
  ),
};

// 7. Keyboard Filter Tokens
export const KeyboardFilterTokens: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Keyboard Accessibility</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Keyboard-Accessible Filter Chips
          </Heading>
          <Text variant="caption" color="secondary">
            Focus chips with <kbd>Tab</kbd> and remove them with <kbd>Backspace</kbd> or <kbd>Delete</kbd>.
          </Text>
        </div>

        <Box p={4} isCard>
          <HStack gap={2}>
            <Button size="sm" variant="outline" onClick={() => alert('Removed')}>
              Priority: Critical ✕
            </Button>
            <Button size="sm" variant="outline" onClick={() => alert('Removed')}>
              Line: Line 01 ✕
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};
