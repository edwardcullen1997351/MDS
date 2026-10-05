import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Input,
  Badge,
  Button,
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Banner,
  ToastProvider,
  useToast,
} from '@ds/react';

const meta: Meta = {
  title: 'Interaction Patterns/08 Collection Editing',
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
          '**Collection Editing Pattern (§01–§20)**\n\n' +
          'Governs committed values and drafts as separate state keyed by item identity, cancel as deletion of the draft, whole-draft validation, optimistic or single commit writers, and revision-stamped concurrency protection.\n\n' +
          '*Scenario:* Editing press-shop weekly shift capacity targets at **Suryodaya Autocomp Ltd (PL-04 Chakan)** under Press Shop Head Shalini Rao.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface ShiftPlan {
  id: string;
  pressLine: string;
  targetUnits: number;
  shift: 'Shift A' | 'Shift B' | 'Shift C';
  operator: string;
  revision: number;
}

const initialPlan: ShiftPlan[] = [
  { id: 'PL-1', pressLine: 'Line 01 (800T Heavy Press)', targetUnits: 450, shift: 'Shift A', operator: 'S. Pawar', revision: 1 },
  { id: 'PL-2', pressLine: 'Line 02 (400T Progressive Press)', targetUnits: 800, shift: 'Shift A', operator: 'A. Kulkarni', revision: 1 },
  { id: 'PL-3', pressLine: 'Line 03 (CNC Turning Cell)', targetUnits: 300, shift: 'Shift B', operator: 'V. Patil', revision: 2 },
];

// 1. Inline Row Editing (Happy Path)
export const InlineRowEditing: Story = {
  render: () => {
    const toast = useToast();
    const [rows, setRows] = useState<ShiftPlan[]>(initialPlan);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draftUnits, setDraftUnits] = useState<string>('');

    const startEdit = (row: ShiftPlan) => {
      setEditingId(row.id);
      setDraftUnits(row.targetUnits.toString());
    };

    const cancelEdit = () => {
      setEditingId(null);
      setDraftUnits('');
    };

    const saveEdit = (id: string) => {
      const num = parseInt(draftUnits, 10);
      if (isNaN(num) || num <= 0) {
        toast.error('Invalid Target', 'Target must be a positive integer.');
        return;
      }
      setRows(rows.map((r) => (r.id === id ? { ...r, targetUnits: num, revision: r.revision + 1 } : r)));
      toast.success('Capacity Updated', `Target updated to ${num} units for ${rows.find((r) => r.id === id)?.pressLine}.`);
      setEditingId(null);
    };

    return (
      <Box style={{ maxWidth: '840px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Press Shop Capacity · Week 39 Schedule
            </span>
            <Heading as="h2" size="xl" weight="bold">Shift Capacity Allocation</Heading>
            <Text variant="caption" color="secondary">
              Inline draft editing with explicit row-level Save and Discard actions.
            </Text>
          </div>

          <Box isCard style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>PRESS LINE</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>SHIFT</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>OPERATOR</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>TARGET (UNITS)</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const isEditing = editingId === r.id;
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: isEditing ? '#FEFCE8' : 'transparent' }}>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.pressLine}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <Badge variant="neutral">{r.shift}</Badge>
                      </td>
                      <td style={{ padding: '10px 14px', color: '#64748B' }}>{r.operator}</td>
                      <td style={{ padding: '10px 14px' }}>
                        {isEditing ? (
                          <Input aria-label="Collection Editing field"
                            type="number"
                            value={draftUnits}
                            onChange={(e) => setDraftUnits(e.target.value)}
                            style={{ width: '120px' }}

                          />
                        ) : (
                          <span style={{ fontWeight: 600, color: '#0F172A' }}>{r.targetUnits} pcs</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                        {isEditing ? (
                          <HStack justify="end" gap={2}>
                            <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                            <Button size="sm" variant="primary" onClick={() => saveEdit(r.id)}>Save</Button>
                          </HStack>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => startEdit(r)}>
                            Edit Target
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        </VStack>
      </Box>
    );
  },
};

// 2. Draft Validation Rejection
export const DraftValidationRejection: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="danger">Draft Validation</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Machine Rating Over-Allocation
          </Heading>
          <Text variant="caption" color="secondary">
            Draft value exceeds the physical nameplate capacity of the press (max 1000 units/shift).
          </Text>
        </div>

        <Box p={4} isCard style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5' }}>
          <VStack gap={2} align="start">
            <Text weight="bold" color="danger">Error: Line 02 capacity cannot exceed 1,000 units</Text>
            <Text size="xs">Attempted value: 1,450 units. Draft preserved for correction.</Text>
            <Input aria-label="Attempted value: 1,450 units. Draft preserved for correction." value="1450" isInvalid style={{ width: '160px', marginTop: '4px' }} />
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 3. Concurrent Edit Conflict
export const ConcurrentEditConflict: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="warning">Revision Conflict §04</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Mid-Air Collision Conflict
          </Heading>
          <Text variant="caption" color="secondary">
            Shift Supervisor Vikram Bhosale saved revision 3 while this draft was open.
          </Text>
        </div>

        <Banner status="warning" title="Concurrent Edit Detected" isDismissible={false}>
          The target for Line 03 was modified to 350 units by Vikram Bhosale 2 minutes ago. Choose how to proceed:
        </Banner>

        <HStack gap={3}>
          <Button variant="outline" size="sm">Discard My Draft & Load Rev 3</Button>
          <Button variant="danger" size="sm">Overwrite with My Draft (400 Units)</Button>
        </HStack>
      </VStack>
    </Box>
  ),
};

// 4. Draft Discard Confirmation
export const DraftDiscardConfirmation: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Draft Lifecycle</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Cancel Discards Draft Cleanly
          </Heading>
          <Text variant="caption" color="secondary">
            Cancelling row editing restores the original committed snapshot without side effects.
          </Text>
        </div>

        <Box p={4} isCard>
          <Text size="sm">Draft deleted. Line 01 target reverted to original 450 units.</Text>
        </Box>
      </VStack>
    </Box>
  ),
};

// 5. Multi-Row Draft Mode
export const MultiRowDraftMode: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Heading as="h2" size="xl" weight="bold">Batch Capacity Edit</Heading>
          <Text variant="caption" color="secondary">Multiple rows in active draft status simultaneously.</Text>
        </div>

        <Box p={4} isCard>
          <VStack gap={2}>
            <HStack justify="between">
              <Text size="sm">Line 01 (800T Press):</Text>
              <Input aria-label="Line 01 (800T Press)" value="500" style={{ width: '100px' }} />
            </HStack>
            <HStack justify="between">
              <Text size="sm">Line 02 (400T Press):</Text>
              <Input aria-label="Line 02 (400T Press)" value="850" style={{ width: '100px' }} />
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 6. Read-Only Locked Shift
export const ReadOnlyLockedShift: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="neutral">Historical Shift</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Past Shift Plan (Locked)
          </Heading>
        </div>

        <Box p={4} isCard>
          <Text size="sm" color="secondary">
            Shift A (2026-09-22) has completed. Production records are locked for audit.
          </Text>
        </Box>
      </VStack>
    </Box>
  ),
};

// 7. Keyboard Row Navigation
export const KeyboardRowNavigation: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Keyboard Ergonomics</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Keyboard Row Edit Flow
          </Heading>
          <Text variant="caption" color="secondary">
            Press <kbd>Enter</kbd> to save active draft, <kbd>Escape</kbd> to discard.
          </Text>
        </div>

        <Box p={4} isCard>
          <Input aria-label="Type new target units" placeholder="Type new target units..." />
        </Box>
      </VStack>
    </Box>
  ),
};
