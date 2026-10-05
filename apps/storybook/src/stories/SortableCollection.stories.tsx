import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  SortableCollection,
  VStack,
  HStack,
  Badge,
  Text,
  Box,
} from '@ds/react';

const meta: Meta<typeof SortableCollection> = {
  title: 'Composites/SortableCollection',
  component: SortableCollection,
  tags: ['autodocs'],
  argTypes: {
    moveControls: {
      control: 'select',
      options: ['handle-and-steppers', 'handle', 'none'],
      description: 'Controls shown on each row for repositioning',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Control sizing and density scale',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables all reordering interactions',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SortableCollection>;

interface Operation {
  id: string;
  code: string;
  name: string;
  workCenter: string;
  cycleTime: string;
  pinned?: boolean;
}

const initialOperations: Record<string, Operation> = {
  'op-10': {
    id: 'op-10',
    code: 'OP-10',
    name: 'Cast Blank Visual Inspection & De-flash',
    workCenter: 'WC-01 Casting Yard',
    cycleTime: '45s',
  },
  'op-20': {
    id: 'op-20',
    code: 'OP-20',
    name: 'Rough CNC Turning & Bore Profiling',
    workCenter: 'WC-04 CNC Turning Cell',
    cycleTime: '120s',
  },
  'op-30': {
    id: 'op-30',
    code: 'OP-30',
    name: 'Induction Hardening & Quench Cycle',
    workCenter: 'WC-08 Heat Treatment',
    cycleTime: '240s',
  },
  'op-40': {
    id: 'op-40',
    code: 'OP-40',
    name: 'Precision Twin-Disc Surface Grinding',
    workCenter: 'WC-12 Grinding Bay',
    cycleTime: '90s',
  },
  'op-50': {
    id: 'op-50',
    code: 'OP-50',
    name: 'Laser 2D DataMatrix Serial Marking',
    workCenter: 'WC-19 Laser Cell',
    cycleTime: '15s',
  },
};

/**
 * Default interactive reordering playground.
 */
export const Default: Story = {
  render: () => {
    const [order, setOrder] = useState<string[]>(['op-10', 'op-20', 'op-30', 'op-40', 'op-50']);

    const handleMove = (id: string, fromIndex: number, toIndex: number) => {
      const next = [...order];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);
      setOrder(next);
    };

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '680px' }}>
        <SortableCollection
          items={order}
          label="Sequence"
          itemName={(id) => `${initialOperations[id].code} - ${initialOperations[id].name}`}
          onMove={handleMove}
        />
      </VStack>
    );
  },
};

/**
 * Manufacturing Work-Order Routing Sequence (Suryodaya Autocomp Ltd - Part BRK-4820-A).
 * Demonstrates standard drag-and-drop and stepper buttons for re-sequencing plant operations.
 */
export const ManufacturingRoutingSequence: Story = {
  render: () => {
    const [order, setOrder] = useState<string[]>([
      'op-10',
      'op-20',
      'op-30',
      'op-40',
      'op-50',
    ]);

    const handleMove = (id: string, fromIndex: number, toIndex: number) => {
      const next = [...order];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);
      setOrder(next);
    };

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '680px' }}>
        <Box p={3} isCard style={{ width: '100%' }}>
          <VStack gap={1}>
            <Text size="xs" color="secondary" weight="semibold">
              PART BRK-4820-A · BRAKE DISC ROTOR (CHAKAN PLANT PL-04)
            </Text>
            <Text size="sm" weight="medium">
              Active Routing Order: {order.map((id) => initialOperations[id].code).join(' → ')}
            </Text>
          </VStack>
        </Box>

        <SortableCollection
          items={order}
          label="Part BRK-4820-A Manufacturing Routing Sequence"
          itemName={(id) => `${initialOperations[id].code} - ${initialOperations[id].name}`}
          onMove={handleMove}
          renderItem={(id, state) => {
            const op = initialOperations[id];
            return (
              <HStack justify="between" align="center" style={{ width: '100%' }}>
                <HStack gap={3} align="center">
                  <Badge variant="neutral">{state.position}</Badge>
                  <VStack gap={0}>
                    <Text size="sm" weight="semibold">
                      {op.code}: {op.name}
                    </Text>
                    <Text size="xs" color="muted">
                      {op.workCenter}
                    </Text>
                  </VStack>
                </HStack>
                <Badge variant="brand">{op.cycleTime}</Badge>
              </HStack>
            );
          }}
        />
      </VStack>
    );
  },
};

/**
 * Restricted Target Positions:
 * Demonstrates business logic constraints via `canDrop`.
 * Rule 1: OP-50 (Laser Marking) must remain the final station.
 * Rule 2: OP-30 (Heat Treatment) cannot precede OP-20 (Rough Turning).
 */
export const RestrictedTargetPositions: Story = {
  render: () => {
    const [order, setOrder] = useState<string[]>([
      'op-10',
      'op-20',
      'op-30',
      'op-40',
      'op-50',
    ]);

    const canDrop = (id: string, toIndex: number, nextOrder: string[]) => {
      if (id === 'op-50' && toIndex !== nextOrder.length - 1) {
        return 'Laser serial marking must remain the final operational step.';
      }
      const idx20 = nextOrder.indexOf('op-20');
      const idx30 = nextOrder.indexOf('op-30');
      if (idx30 !== -1 && idx20 !== -1 && idx30 < idx20) {
        return 'Induction hardening (OP-30) cannot occur before rough machining (OP-20).';
      }
      return true;
    };

    const handleMove = (id: string, fromIndex: number, toIndex: number) => {
      const next = [...order];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);
      setOrder(next);
    };

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '680px' }}>
        <Box p={3} isCard style={{ width: '100%', background: 'var(--surface-raised, #F8FAFC)' }}>
          <VStack gap={1}>
            <Text size="xs" color="brand" weight="semibold">
              ENGINEERING VALIDATION CONSTRAINTS ACTIVE
            </Text>
            <Text size="xs" color="secondary">
              • OP-50 must remain the final station.
              <br />• OP-30 (Hardening) cannot be moved before OP-20 (Rough Turning).
            </Text>
          </VStack>
        </Box>

        <SortableCollection
          items={order}
          label="Constrained Routing Sequence"
          itemName={(id) => initialOperations[id].name}
          canDrop={canDrop}
          onMove={handleMove}
          renderItem={(id, state) => {
            const op = initialOperations[id];
            return (
              <HStack justify="between" align="center" style={{ width: '100%' }}>
                <HStack gap={3} align="center">
                  <Badge variant="neutral">{state.position}</Badge>
                  <Text size="sm" weight="semibold">
                    {op.code}: {op.name}
                  </Text>
                </HStack>
                <Text size="xs" color="muted">
                  {op.workCenter}
                </Text>
              </HStack>
            );
          }}
        />
      </VStack>
    );
  },
};

/**
 * Pinning Immovable Items: OP-10 is locked/pinned to casting intake.
 */
export const PinningImmovableItems: Story = {
  render: () => {
    const [order, setOrder] = useState<string[]>(['op-10', 'op-20', 'op-30', 'op-40']);

    const canMove = (id: string) => {
      if (id === 'op-10') return 'OP-10 is permanently pinned to casting intake bay.';
      return true;
    };

    const handleMove = (id: string, fromIndex: number, toIndex: number) => {
      const next = [...order];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);
      setOrder(next);
    };

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '680px' }}>
        <Text size="sm" color="muted">
          OP-10 is pinned in position and cannot be grabbed or moved:
        </Text>
        <SortableCollection
          items={order}
          label="Locked Sequence"
          canMove={canMove}
          itemName={(id) => initialOperations[id].name}
          onMove={handleMove}
        />
      </VStack>
    );
  },
};

/**
 * Keyboard-Driven Reordering Flow with Live Region Announcement Display.
 */
export const KeyboardDrivenFlow: Story = {
  render: () => {
    const [order, setOrder] = useState<string[]>(['op-10', 'op-20', 'op-30', 'op-40']);
    const [liveLog, setLiveLog] = useState<string>(
      'Press Space or Enter on any grab handle to initiate keyboard reordering.'
    );

    const handleMove = (id: string, fromIndex: number, toIndex: number) => {
      const next = [...order];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);
      setOrder(next);
    };

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '680px' }}>
        <Box p={3} isCard style={{ width: '100%' }}>
          <VStack gap={1}>
            <Text size="xs" color="secondary" weight="semibold">
              ACCESSIBILITY & LIVE REGION TELEMETRY
            </Text>
            <Text size="sm" color="primary" style={{ fontFamily: 'var(--font-mono, monospace)' }}>
              📢 {liveLog}
            </Text>
          </VStack>
        </Box>

        <SortableCollection
          items={order}
          label="Accessible Work-Order Routing Sequence"
          itemName={(id) => `${initialOperations[id].code} ${initialOperations[id].name}`}
          onAnnounce={(msg) => setLiveLog(msg)}
          onMove={handleMove}
          renderItem={(id, state) => {
            const op = initialOperations[id];
            return (
              <HStack justify="between" align="center" style={{ width: '100%' }}>
                <HStack gap={3} align="center">
                  <Badge variant="neutral">{state.position}</Badge>
                  <Text size="sm" weight="medium">
                    {op.code}: {op.name}
                  </Text>
                </HStack>
                <Badge variant="neutral">{op.cycleTime}</Badge>
              </HStack>
            );
          }}
        />
      </VStack>
    );
  },
};

/**
 * Handle Only Mode: Displays only grab handles without stepper arrow buttons.
 */
export const HandleOnlyMode: Story = {
  render: () => {
    const [order, setOrder] = useState<string[]>(['op-10', 'op-20', 'op-30', 'op-40']);

    const handleMove = (id: string, fromIndex: number, toIndex: number) => {
      const next = [...order];
      const [removed] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, removed);
      setOrder(next);
    };

    return (
      <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '680px' }}>
        <SortableCollection
          items={order}
          moveControls="handle"
          label="Handle-Only Sequence"
          itemName={(id) => initialOperations[id].name}
          onMove={handleMove}
        />
      </VStack>
    );
  },
};

/**
 * Disabled State: Reordering disabled due to locked batch signoff.
 */
export const DisabledState: Story = {
  render: () => (
    <VStack gap={4} align="start" style={{ padding: '24px', maxWidth: '680px' }}>
      <Text size="sm" color="muted">
        Locked work order routing (signed by Plant Head Shalini Rao):
      </Text>
      <SortableCollection
        items={['op-10', 'op-20', 'op-30']}
        disabled={true}
        label="Signed Sequence"
        itemName={(id) => initialOperations[id].name}
      />
    </VStack>
  ),
};
