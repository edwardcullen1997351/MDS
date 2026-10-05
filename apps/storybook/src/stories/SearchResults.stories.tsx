import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  SearchField,
  Badge,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Banner,
  ToastProvider,
} from '@ds/react';

const meta: Meta = {
  title: 'Interaction Patterns/04 Search Results',
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
          '**Search Results Pattern (§01–§20)**\n\n' +
          'Governs the correspondence between one query state and one result set, counts/ranges always stated in terms of the query that produced them, zero matches as a completed retrieval distinct from failure, retry against the current query, and request identities preventing out-of-order writes.\n\n' +
          '*Scenario:* Item master lookup for shortage materials at **Suryodaya Autocomp Ltd (PL-04 Chakan)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface ItemMasterRow {
  sku: string;
  name: string;
  category: string;
  stock: number;
  bin: string;
}

const itemCatalog: ItemMasterRow[] = [
  { sku: 'BRK-4820-A', name: 'Bevel Pinion Forging (EN36C)', category: 'Forgings', stock: 450, bin: 'BIN-P04-A12' },
  { sku: 'BRK-4821-B', name: 'Crown Gear Blank (20MnCr5)', category: 'Forgings', stock: 120, bin: 'BIN-P04-A14' },
  { sku: 'BRK-9904-X', name: 'Splined Input Shaft (Hardened)', category: 'Shafts', stock: 85, bin: 'BIN-P04-B02' },
  { sku: 'TOL-D2-881', name: 'Progressive Piercing Punch (D2 Tool Steel)', category: 'Tooling', stock: 12, bin: 'TOOL-CRIB-01' },
  { sku: 'HYD-SEAL-09', name: 'Hydraulic Piston Seal (Viton 90)', category: 'Spares', stock: 4, bin: 'MAINT-STORE-S3' },
];

// 1. Live Query Search (Happy Path)
export const LiveQuerySearch: Story = {
  render: () => {
    const [query, setQuery] = useState('BRK');
    const filtered = itemCatalog.filter(
      (item) =>
        item.sku.toLowerCase().includes(query.toLowerCase()) ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.bin.toLowerCase().includes(query.toLowerCase())
    );

    return (
      <Box style={{ maxWidth: '720px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Item Master Database · PL-04 Central Stores
            </span>
            <Heading as="h2" size="xl" weight="bold">Item Master Search</Heading>
            <Text variant="caption" color="secondary">
              Real-time query matching against plant part numbers, descriptions, and bin locations.
            </Text>
          </div>

          <SearchField aria-label="Search SKU (e.g. BRK-4820), name, or bin"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Search SKU (e.g. BRK-4820), name, or bin..."
          />

          <HStack justify="between" align="center">
            <Text size="xs" color="secondary">
              Showing <strong>{filtered.length}</strong> {filtered.length === 1 ? 'item' : 'items'} matching "{query}"
            </Text>
            <Badge variant="neutral">PL-04 Stores</Badge>
          </HStack>

          <Box isCard style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>PART NUMBER</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>DESCRIPTION</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>ON HAND</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>BIN LOCATION</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.sku} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1D4ED8' }}>{r.sku}</td>
                    <td style={{ padding: '10px 14px' }}>{r.name}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <Badge variant={r.stock < 10 ? 'danger' : 'success'}>{r.stock} pcs</Badge>
                    </td>
                    <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#64748B' }}>{r.bin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 2. Zero Results with Recovery
export const ZeroResultsWithRecovery: Story = {
  render: () => {
    const [query, setQuery] = useState('XYZ-9999');

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="warning">Zero Matches</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Zero Search Results State
            </Heading>
            <Text variant="caption" color="secondary">
              Zero matches is a completed retrieval, distinct from failure. Offers clear recovery routes.
            </Text>
          </div>

          <SearchField aria-label="Search records"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
          />

          <Box p={6} isCard style={{ textAlign: 'center' }}>
            <VStack gap={3} align="center">
              <Heading as="h3" size="lg">No items match "{query}"</Heading>
              <Text size="sm" color="secondary" style={{ maxWidth: '420px' }}>
                No active parts or tooling registered with this code in the PL-04 Item Master. Check the SKU format or reset your search.
              </Text>
              <HStack gap={3} style={{ marginTop: '8px' }}>
                <Button size="sm" variant="outline" onClick={() => setQuery('')}>
                  Clear Query
                </Button>
                <Button size="sm" variant="primary" onClick={() => setQuery('BRK-4820')}>
                  Search "BRK-4820"
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 3. Network Timeout with Retry
export const NetworkTimeoutWithRetry: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="danger">Catalog Gateway Outage</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Search Operational Failure
          </Heading>
          <Text variant="caption" color="secondary">
            ERP Item Master service timed out. Search query "BRK-4820-A" preserved for immediate retry.
          </Text>
        </div>

        <SearchField aria-label="Search records" value="BRK-4820-A" readOnly />

        <Banner status="error" title="Item Master Service Unavailable (504 Gateway Timeout)" isDismissible={false}>
          Could not fetch search results for "BRK-4820-A". Your query was preserved. Click below to retry.
        </Banner>

        <Box p={4} isCard>
          <HStack justify="between" align="center">
            <Text size="sm">Retry search against backup ERP database replica?</Text>
            <Button variant="danger" size="sm" onClick={() => alert('Retrying search...')}>
              Retry Search
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 4. Retained Previous Results While Loading
export const RetainedPreviousResultsWhileLoading: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Flicker Prevention</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Retained Previous Results During In-Flight Query
          </Heading>
          <Text variant="caption" color="secondary">
            Old results remain visible (dimmed) during background loading so layout doesn't collapse.
          </Text>
        </div>

        <SearchField aria-label="Searching" value="Forging" placeholder="Searching..." />

        <div style={{ position: 'relative' }}>
          <Box isCard p={4}>
            <Text size="xs" color="secondary" style={{ marginBottom: '8px' }}>
              PREVIOUS RESULTS (UPDATING...)
            </Text>
            <VStack gap={2} align="stretch">
              <Text weight="semibold">BRK-4820-A (Bevel Pinion Forging)</Text>
              <Text weight="semibold">BRK-4821-B (Crown Gear Blank)</Text>
            </VStack>
          </Box>
        </div>

        <Text size="xs" color="secondary" style={{ textAlign: 'center' }}>
          ⏳ Fetching updated matches from Chakan central stores...
        </Text>
      </VStack>
    </Box>
  ),
};

// 5. Pagination and Sorting
export const PaginationAndSorting: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Heading as="h2" size="xl" weight="bold">Paged Search Results</Heading>
          <Text variant="caption" color="secondary">
            Page index and sort criteria remain bound to the active search query.
          </Text>
        </div>

        <SearchField aria-label="Search records" value="Tooling" />

        <Box isCard p={4}>
          <VStack gap={3} align="stretch">
            <HStack justify="between">
              <Text size="sm" weight="semibold">TOL-D2-881 · Piercing Punch</Text>
              <Badge variant="neutral">Page 1 of 4</Badge>
            </HStack>
            <HStack justify="between" style={{ marginTop: '12px' }}>
              <Button size="sm" variant="outline" disabled>← Previous</Button>
              <Button size="sm" variant="outline">Next Page →</Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 6. Clean Initial Search State
export const EmptyInitialSearch: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Heading as="h2" size="xl" weight="bold">Item Master Directory</Heading>
          <Text variant="caption" color="secondary">
            Type part number or select popular categories to start searching.
          </Text>
        </div>

        <SearchField aria-label="Search 14,820 plant components" placeholder="Search 14,820 plant components..." />

        <Box p={5} isCard>
          <Text size="xs" weight="bold" color="secondary" style={{ marginBottom: '8px' }}>
            FREQUENTLY SEARCHED AT PL-04
          </Text>
          <HStack gap={2} wrap>
            <Badge variant="neutral">EN36C Forgings</Badge>
            <Badge variant="neutral">Press Die Tooling</Badge>
            <Badge variant="neutral">Hydraulic Seals</Badge>
            <Badge variant="neutral">Shaft Blanks</Badge>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 7. Screen Reader Announcements
export const ScreenReaderAnnouncements: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Accessibility</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Live Region Result Count
          </Heading>
          <Text variant="caption" color="secondary">
            `aria-live="polite"` announces result count changes without interrupting the user's typing.
          </Text>
        </div>

        <Box p={5} isCard>
          <div role="status" aria-live="polite" style={{ fontSize: '13px', color: '#1E293B', fontWeight: 500 }}>
            "4 items found for query 'BRK' in Suryodaya item master."
          </div>
        </Box>
      </VStack>
    </Box>
  ),
};
