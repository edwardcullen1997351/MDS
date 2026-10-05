import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchField, VStack, HStack, Text, Badge, Box } from '@ds/react';

const meta: Meta<typeof SearchField> = {
  title: 'Composites/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Input sizing tier',
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    shortcutKey: { control: 'text' },
  },
  args: {
    placeholder: 'Search by part number, lot code, or vendor...',
    size: 'md',
    isLoading: false,
    disabled: false,
    shortcutKey: '⌘K',
  },
};

export default meta;
type Story = StoryObj<typeof SearchField>;

/**
 * Interactive default playground for SearchField.
 */
export const Default: Story = {
  render: (args) => {
    const [query, setQuery] = useState('');
    return (
      <div style={{ maxWidth: '480px', padding: '24px' }}>
        <SearchField
          {...args}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
        />
      </div>
    );
  },
};

/**
 * Active Query with Instant Clear Button trigger.
 */
export const WithClearAction: Story = {
  render: () => {
    const [query, setQuery] = useState('BRK-4820-A');
    return (
      <VStack gap={3} align="start" style={{ maxWidth: '480px', padding: '24px' }}>
        <HStack gap={2} align="center">
          <Text size="sm" weight="medium">Active Query:</Text>
          <Badge variant="brand">{query || 'Empty'}</Badge>
        </HStack>
        <SearchField aria-label="Search items"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          placeholder="Search items..."
        />
      </VStack>
    );
  },
};

/**
 * Asynchronous debounce/loading state while fetching results from MES backend.
 */
export const LoadingState: Story = {
  render: () => (
    <div style={{ maxWidth: '480px', padding: '24px' }}>
      <SearchField aria-label="Querying item master catalog"
        value="Suryodaya"
        isLoading={true}
        placeholder="Querying item master catalog..."
      />
    </div>
  ),
};

/**
 * Keyboard Shortcut badge trigger (e.g. '/' or '⌘K' global search jump).
 */
export const WithKeyboardShortcut: Story = {
  render: () => {
    const [query, setQuery] = useState('');
    return (
      <div style={{ maxWidth: '480px', padding: '24px' }}>
        <SearchField aria-label="Press '/' to search ERP records"
          value={query}
          shortcutKey="/"
          placeholder="Press '/' to search ERP records..."
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
        />
      </div>
    );
  },
};

/**
 * Density Scale comparison across sm, md, and lg tiers.
 */
export const DensityScale: Story = {
  render: () => (
    <VStack gap={4} align="start" style={{ maxWidth: '480px', padding: '24px' }}>
      <VStack gap={1} style={{ width: '100%' }}>
        <Text size="xs" color="muted">Small (sm - 28px height):</Text>
        <SearchField aria-label="Compact filter search" size="sm" placeholder="Compact filter search..." />
      </VStack>

      <VStack gap={1} style={{ width: '100%' }}>
        <Text size="xs" color="muted">Medium (md - 32px height - default):</Text>
        <SearchField aria-label="Standard toolbar search" size="md" placeholder="Standard toolbar search..." />
      </VStack>

      <VStack gap={1} style={{ width: '100%' }}>
        <Text size="xs" color="muted">Large (lg - 40px height):</Text>
        <SearchField aria-label="Hero header search" size="lg" placeholder="Hero header search..." />
      </VStack>
    </VStack>
  ),
};

/**
 * Disabled State: Search inactive or permission restricted.
 */
export const DisabledState: Story = {
  render: () => (
    <div style={{ maxWidth: '480px', padding: '24px' }}>
      <SearchField aria-label="Search restricted"
        value="Restricted Inventory Vault"
        disabled={true}
        placeholder="Search restricted..."
      />
    </div>
  ),
};

/**
 * Plant Inventory Query: Real-world search scenario for part `BRK-4820-A` in plant PL-04.
 */
export const PlantInventoryQuery: Story = {
  render: () => {
    const [searchVal, setSearchVal] = useState('BRK-4820-A');
    return (
      <VStack gap={4} align="start" style={{ maxWidth: '540px', padding: '24px' }}>
        <Box p={3} isCard style={{ width: '100%' }}>
          <VStack gap={1}>
            <Text size="xs" color="secondary" weight="semibold">
              SURYODAYA AUTOCOMP LTD · ITEM MASTER SEARCH
            </Text>
            <Text size="sm" weight="medium">
              Searching Part Master: Brake Rotor Discs (Cast EN-GJL-250)
            </Text>
          </VStack>
        </Box>

        <SearchField aria-label="Filter by part ID (e.g. BRK-4820-A)"
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onClear={() => setSearchVal('')}
          placeholder="Filter by part ID (e.g. BRK-4820-A)..."
        />
      </VStack>
    );
  },
};
