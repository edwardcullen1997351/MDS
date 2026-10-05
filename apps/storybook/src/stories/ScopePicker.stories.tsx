import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  ScopePicker,
  ScopeSelection,
  EntityFacilitySelector,
  EntityFacilitySelection,
  VStack,
  HStack,
  Badge,
  Text,
  Box,
  Button,
} from '@ds/react';

const meta: Meta<typeof ScopePicker> = {
  title: 'Composites/ScopePicker',
  component: ScopePicker,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScopePicker>;

/**
 * Interactive default playground for ScopePicker.
 */
export const Default: Story = {
  render: () => {
    const [scope, setScope] = useState<ScopeSelection>({
      plant: 'plant-04',
      area: 'bay-1',
      unit: 'tg-401',
    });

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '800px', padding: '24px' }}>
        <ScopePicker
          value={scope}
          onChange={setScope}
          onClear={() => setScope({})}
        />
      </VStack>
    );
  },
};

/**
 * Full 3-Level Plant Hierarchy (Suryodaya Autocomp Ltd Chakan Plant PL-04).
 */
export const FullPlantHierarchy: Story = {
  render: () => {
    const [scope, setScope] = useState<ScopeSelection>({
      plant: 'plant-04',
      area: 'stamping-4',
      unit: 'press-2000',
    });

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '800px', padding: '24px' }}>
        <Box p={3} isCard style={{ width: '100%' }}>
          <VStack gap={1}>
            <Text size="xs" color="secondary" weight="semibold">
              ACTIVE TELEMETRY CONSOLE SCOPE
            </Text>
            <HStack gap={2} align="center">
              <Text size="sm" weight="medium">Plant 04 Chakan → Stamping Line 4 → Hydraulic Press 2000T</Text>
              <Badge variant="brand">Active Machine</Badge>
            </HStack>
          </VStack>
        </Box>

        <ScopePicker
          value={scope}
          onChange={setScope}
          onClear={() => setScope({})}
        />
      </VStack>
    );
  },
};

/**
 * Partial Scope Selection: Plant selected, Area and Machine Unit open.
 */
export const PartialScopeSelection: Story = {
  render: () => {
    const [scope, setScope] = useState<ScopeSelection>({
      plant: 'plant-01',
      area: undefined,
      unit: undefined,
    });

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '800px', padding: '24px' }}>
        <Box p={3} isCard style={{ width: '100%', background: 'var(--surface-raised, #F8FAFC)' }}>
          <Text size="xs" color="brand" weight="semibold">
            BROAD SITE-LEVEL QUERY (PLANT 01 PUNE HQ)
          </Text>
          <Text size="xs" color="muted">
            Viewing site-wide operational capacity across all bays. Narrow down by selecting an area below.
          </Text>
        </Box>

        <ScopePicker
          value={scope}
          onChange={setScope}
          onClear={() => setScope({})}
        />
      </VStack>
    );
  },
};

/**
 * Empty Initial State: Prompts user to select enterprise site first.
 */
export const EmptyInitialState: Story = {
  render: () => {
    const [scope, setScope] = useState<ScopeSelection>({});

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '800px', padding: '24px' }}>
        <Text size="sm" color="muted">
          Select an enterprise plant site from the dropdown to initialize hierarchy filter:
        </Text>
        <ScopePicker
          value={scope}
          onChange={setScope}
          onClear={() => setScope({})}
        />
      </VStack>
    );
  },
};

/**
 * Multi-Site Switching: Fast toggle between Sanand Assembly, Chakan Press Shop, and Pune HQ.
 */
export const MultiSiteSwitching: Story = {
  render: () => {
    const [scope, setScope] = useState<ScopeSelection>({
      plant: 'plant-07',
      area: 'robotics',
      unit: undefined,
    });

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '800px', padding: '24px' }}>
        <HStack gap={2}>
          <Button
            size="sm"
            variant={scope.plant === 'plant-01' ? 'primary' : 'outline'}
            onClick={() => setScope({ plant: 'plant-01', area: 'cleanroom' })}
          >
            Switch to Pune HQ
          </Button>
          <Button
            size="sm"
            variant={scope.plant === 'plant-04' ? 'primary' : 'outline'}
            onClick={() => setScope({ plant: 'plant-04', area: 'stamping-4', unit: 'press-2000' })}
          >
            Switch to Chakan (PL-04)
          </Button>
          <Button
            size="sm"
            variant={scope.plant === 'plant-07' ? 'primary' : 'outline'}
            onClick={() => setScope({ plant: 'plant-07', area: 'robotics' })}
          >
            Switch to Sanand (PL-07)
          </Button>
        </HStack>

        <ScopePicker
          value={scope}
          onChange={setScope}
          onClear={() => setScope({})}
        />
      </VStack>
    );
  },
};

/**
 * Dashboard Filter Integration: Shows how ScopePicker drives a data table filter.
 */
export const DashboardFilterIntegration: Story = {
  render: () => {
    const [scope, setScope] = useState<ScopeSelection>({
      plant: 'plant-04',
      area: 'bay-1',
      unit: 'tg-401',
    });

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '800px', padding: '24px' }}>
        <ScopePicker
          value={scope}
          onChange={setScope}
          onClear={() => setScope({})}
        />

        <Box p={4} isCard style={{ width: '100%' }}>
          <VStack gap={2}>
            <Text size="sm" weight="semibold">Filtered Machine Telemetry Rows (34 active sensors)</Text>
            <Text size="xs" color="muted">
              Displaying real-time pressure, vibration, and temperature telemetry strictly scoped to{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{scope.plant || 'All Plants'}</strong> &gt;{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{scope.area || 'All Areas'}</strong> &gt;{' '}
              <strong style={{ color: 'var(--text-primary)' }}>{scope.unit || 'All Units'}</strong>.
            </Text>
          </VStack>
        </Box>
      </VStack>
    );
  },
};

/**
 * MultiCompanyEntityScope: Two-tier hierarchical switcher for Asclepius & Anantshriveda.
 */
export const MultiCompanyEntityScope: Story = {
  render: () => {
    const [selection, setSelection] = useState<EntityFacilitySelection>({
      entityId: 'ent-asclepius',
      facilityId: 'fac-f119',
    });

    return (
      <VStack gap={4} align="start" style={{ maxWidth: '800px', padding: '24px' }}>
        <Text size="base" weight="bold">
          Manufacturing Supply-Chain Scope Context
        </Text>
        <Text size="xs" color="secondary">
          Switches operational context between Asclepius finished goods food processing plants and Anantshriveda raw material extract warehouses.
        </Text>

        <EntityFacilitySelector
          value={selection}
          onChange={setSelection}
        />

        <Box p={3} isCard style={{ width: '100%', marginTop: '12px' }}>
          <VStack gap={1}>
            <Text size="xs" color="secondary" weight="semibold">
              RESOLVED CONTEXT SCOPE
            </Text>
            <HStack gap={2} align="center">
              <Badge variant="brand">Entity: {selection.entityId}</Badge>
              <Badge variant="neutral">Facility: {selection.facilityId}</Badge>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    );
  },
};
