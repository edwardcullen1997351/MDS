import {
Badge,
Box,
Button,
Heading,
HStack,
SortableCollection,
Text,
ToastProvider,
useToast,
VStack
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Interaction Patterns/14 Direct Manipulation of Order',
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
          '**Direct Manipulation of Order Pattern (§01–§20)**\n\n' +
          'Governs committed order vs proposed grab order, keyboard and mouse parity, local drop legality rules, side-effect-free abandon, optimistic updates with rollback, and live position announcements.\n\n' +
          '*Scenario:* Resequencing routing operations for `BRK-4820-A` at **Suryodaya Autocomp Ltd (PL-04 Chakan)** under Process Planner Anjali Deshmukh.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const initialOperations = [
  'OP-10: Raw Forging Inspection & Shot Blast',
  'OP-20: CNC Rough Pinion Turning',
  'OP-30: Gear Hobbing & Teeth Generation',
  'OP-40: Induction Hardening (HRC 58)',
  'OP-50: Metrology CMM & Final Quality Stamp',
];

// 1. Drag & Stepper Reorder (Happy Path)
export const DragAndDropReorder: Story = {
  render: () => {
    const toast = useToast();
    const [ops, setOps] = useState<string[]>(initialOperations);

    const handleMove = (id: string, fromIdx: number, toIdx: number) => {
      const next = [...ops];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      setOps(next);
      toast.info('Sequence Updated', `Moved "${id}" from step ${fromIdx + 1} to step ${toIdx + 1}.`);
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Process Engineering · Routing Resequencer
            </span>
            <Heading as="h2" size="xl" weight="bold">Resequence Routing Operations</Heading>
            <Text variant="caption" color="secondary">
              Drag handles or use stepper arrows / keyboard to reorder manufacturing steps for BRK-4820-A.
            </Text>
          </div>

          <Box p={5} isCard>
            <VStack gap={4} align="stretch">
              <SortableCollection
                items={ops}
                label="Manufacturing Routing Steps"
                itemName={(id) => id}
                onMove={handleMove}
                renderItem={(id, state) => (
                  <HStack justify="between" align="center" style={{ width: '100%', padding: '6px 0' }}>
                    <Text size="sm" weight="semibold">{id}</Text>
                    <Badge variant="neutral">Step {state.position} of {state.total}</Badge>
                  </HStack>
                )}
              />

              <HStack justify="end">
                <Button variant="primary" onClick={() => toast.success('Routing Committed', 'New operation sequence committed to ERP.')}>
                  Commit Routing Sequence
                </Button>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 2. Keyboard Reorder Flow
export const KeyboardReorder: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Keyboard Navigation</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Keyboard-Only Reordering
          </Heading>
          <Text variant="caption" color="secondary">
            Press <kbd>Space</kbd> on a handle to grab, <kbd>Up</kbd>/<kbd>Down</kbd> to move, <kbd>Enter</kbd> to drop, <kbd>Esc</kbd> to cancel.
          </Text>
        </div>

        <Box p={5} isCard>
          <SortableCollection
            items={initialOperations.slice(0, 3)}
            label="Key Operations"
            itemName={(id) => id}
          />
        </Box>
      </VStack>
    </Box>
  ),
};

// 3. Drop Legality Validation Rule
export const DropLegalityRule: Story = {
  render: () => {
    const toast = useToast();
    const [ops, setOps] = useState<string[]>(initialOperations);

    const checkCanDrop = (id: string, toIdx: number) => {
      // Heat treatment cannot precede shot blasting (index 0)
      if (id.includes('Hardening') && toIdx === 0) {
        return 'Induction Hardening cannot occur before Raw Forging Shot Blast (OP-10).';
      }
      return true;
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="warning">Drop Legality §04</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Illegal Drop Position Refusal
            </Heading>
            <Text variant="caption" color="secondary">
              Metallurgical rule: Heat Treatment (OP-40) is legally barred from being moved ahead of Shot Blast (OP-10).
            </Text>
          </div>

          <Box p={5} isCard>
            <SortableCollection
              items={ops}
              label="Legal Routing Chain"
              itemName={(id) => id}
              canDrop={checkCanDrop}
              onMove={(id, from, to) => {
                const next = [...ops];
                const [m] = next.splice(from, 1);
                next.splice(to, 0, m);
                setOps(next);
                toast.info('Step Moved', `Moved ${id} to step ${to + 1}`);
              }}
            />
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 4. Optimistic Update with Rollback
export const OptimisticUpdateWithRollback: Story = {
  render: () => {
    const [isRollingBack, setIsRollingBack] = useState(false);

    const triggerFailedReorder = () => {
      setIsRollingBack(true);
      setTimeout(() => {
        setIsRollingBack(false);
        alert('Server 500 error! Sequence rolled back to committed origin.');
      }, 1000);
    };

    return (
      <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <Badge variant="danger">Optimism & Rollback</Badge>
            <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
              Optimistic Reorder with Server Rollback
            </Heading>
            <Text variant="caption" color="secondary">
              UI updates instantly upon drop; if backend rejected, animation reverts to previous position.
            </Text>
          </div>

          <Box p={5} isCard>
            <VStack gap={3}>
              <Text size="sm">Simulate failed server write during resequence:</Text>
              <Button variant="danger" isLoading={isRollingBack} onClick={triggerFailedReorder}>
                Test Optimistic Rollback
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 5. Subcontract Transfer Between Collections
export const SubcontractTransfer: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Heading as="h2" size="xl" weight="bold">In-House vs Subcontract Transfer</Heading>
          <Text variant="caption" color="secondary">
            Move OP-40 Induction Hardening to vendor Nashik Forge.
          </Text>
        </div>

        <Box p={4} isCard>
          <HStack justify="between" align="center">
            <Text size="sm" weight="semibold">OP-40: Induction Hardening</Text>
            <Button size="sm" variant="outline">Transfer to Subcontractor</Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 6. Locked Sequence State
export const LockedSequenceState: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="neutral">Certified Master</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Locked Master Routing
          </Heading>
          <Text variant="caption" color="secondary">
            PPAP Certified routing cannot be reordered without engineering change request (ECR).
          </Text>
        </div>

        <Box p={5} isCard>
          <SortableCollection
            items={initialOperations.slice(0, 3)}
            label="Locked Sequence"
            itemName={(id) => id}
            disabled
            disabledReason="Locked under ECR-2026-99"
          />
        </Box>
      </VStack>
    </Box>
  ),
};

// 7. A11y Order Announcements
export const A11yOrderAnnouncements: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Live Region</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Live Region Position Speech
          </Heading>
        </div>

        <Box p={4} isCard>
          <div role="status" aria-live="assertive" style={{ fontSize: '13px', color: '#1E293B' }}>
            "Moved OP-20 CNC Rough Turning to step 1 of 5 in Manufacturing Routing Steps."
          </div>
        </Box>
      </VStack>
    </Box>
  ),
};
