import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Toolbar,
  Checkbox,
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
  title: 'Interaction Patterns/06 Bulk Selection and Action',
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
          '**Bulk Selection and Action Pattern (§01–§20)**\n\n' +
          'Governs selection as a set of stable identities outliving paging/sorting, aggregate count explicitly named in action buttons, honest indeterminate state, target snapshots frozen at initiation, single-shot execution guards, partial failure handling, and scoped retries.\n\n' +
          '*Scenario:* Posting gate-inward goods receipts (GRNs) from suppliers at **Suryodaya Autocomp Ltd (PL-04 Chakan)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface GoodsReceipt {
  id: string;
  grn: string;
  supplier: string;
  part: string;
  qty: number;
  status: 'Pending Gate Inward' | 'Posted' | 'Quarantined';
}

const initialReceipts: GoodsReceipt[] = [
  { id: '1', grn: 'GRN-9401', supplier: 'Nashik Forge & Machine', part: 'BRK-4820-A Forgings', qty: 500, status: 'Pending Gate Inward' },
  { id: '2', grn: 'GRN-9402', supplier: 'Sahyadri Bearings Pvt Ltd', part: 'ROL-6204 Ball Bearings', qty: 200, status: 'Pending Gate Inward' },
  { id: '3', grn: 'GRN-9403', supplier: 'Deccan Machine Supply', part: 'PUN-D2 Piercing Punches', qty: 25, status: 'Pending Gate Inward' },
  { id: '4', grn: 'GRN-9404', supplier: 'Nashik Forge & Machine', part: 'CRW-20Mn Crown Blanks', qty: 150, status: 'Pending Gate Inward' },
];

// 1. Batch Selection & Contextual Toolbar (Happy Path)
export const BatchSelectionAndToolbar: Story = {
  render: () => {
    const toast = useToast();
    const [rows, setRows] = useState<GoodsReceipt[]>(initialReceipts);
    const [selectedIds, setSelectedIds] = useState<string[]>(['1', '2']);
    const [isPosting, setIsPosting] = useState(false);

    const isAllSelected = rows.length > 0 && selectedIds.length === rows.length;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < rows.length;

    const handleToggleAll = (checked: boolean) => {
      setSelectedIds(checked ? rows.map((r) => r.id) : []);
    };

    const handleToggleRow = (id: string, checked: boolean) => {
      setSelectedIds(checked ? [...selectedIds, id] : selectedIds.filter((i) => i !== id));
    };

    const handleBulkPost = () => {
      setIsPosting(true);
      setTimeout(() => {
        setIsPosting(false);
        setRows(rows.map((r) => (selectedIds.includes(r.id) ? { ...r, status: 'Posted' } : r)));
        toast.success('GRNs Posted', `${selectedIds.length} goods receipt(s) posted to Chakan inventory.`);
        setSelectedIds([]);
      }, 700);
    };

    return (
      <Box style={{ maxWidth: '840px', margin: '0 auto' }}>
        <VStack gap={4} align="stretch">
          <div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Plant Logistics · Gate 02 Inward Post
            </span>
            <Heading as="h2" size="xl" weight="bold">Goods Receipt Inward Ledger</Heading>
            <Text variant="caption" color="secondary">
              Select incoming consignments to post stock or route to quarantine inspection.
            </Text>
          </div>

          <Toolbar
            selectedCount={selectedIds.length}
            onClearSelection={() => setSelectedIds([])}
            bulkActions={
              <HStack gap={2}>
                <Button variant="primary" size="sm" isLoading={isPosting} onClick={handleBulkPost}>
                  Post {selectedIds.length} Receipt(s) to Stock
                </Button>
                <Button variant="danger" size="sm" onClick={() => {
                  setRows(rows.map((r) => (selectedIds.includes(r.id) ? { ...r, status: 'Quarantined' } : r)));
                  toast.warning('Hold Placed', `${selectedIds.length} shipment(s) moved to quarantine.`);
                  setSelectedIds([]);
                }}>
                  Move to Quarantine ({selectedIds.length})
                </Button>
              </HStack>
            }
          />

          <Box isCard style={{ overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '10px 14px', width: '40px' }}>
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={(e) => handleToggleAll(e.target.checked)}
                      aria-label="Select all receipts"
                    />
                  </th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>GRN NO</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>SUPPLIER</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>MATERIAL / SKU</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>QTY</th>
                  <th style={{ padding: '10px 14px', fontWeight: 600 }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const isSelected = selectedIds.includes(r.id);
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: isSelected ? '#EFF6FF' : 'transparent' }}>
                      <td style={{ padding: '10px 14px' }}>
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => handleToggleRow(r.id, e.target.checked)}
                          aria-label={`Select ${r.grn}`}
                        />
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1D4ED8' }}>{r.grn}</td>
                      <td style={{ padding: '10px 14px' }}>{r.supplier}</td>
                      <td style={{ padding: '10px 14px' }}>{r.part}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 600 }}>{r.qty} pcs</td>
                      <td style={{ padding: '10px 14px' }}>
                        <Badge variant={r.status === 'Posted' ? 'success' : r.status === 'Quarantined' ? 'danger' : 'neutral'}>
                          {r.status}
                        </Badge>
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

// 2. Indeterminate Checkbox State
export const IndeterminateState: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Visual Feedback</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Honest Indeterminate State
          </Heading>
          <Text variant="caption" color="secondary">
            Master checkbox accurately reflects partial subset selection across current records.
          </Text>
        </div>

        <Box p={4} isCard>
          <HStack gap={3} align="center">
            <Checkbox checked={false} indeterminate aria-label="Partially selected" />
            <Text size="sm" weight="semibold">2 of 4 Receipts Selected</Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 3. Partial Batch Failure
export const PartialBatchFailure: Story = {
  render: () => (
    <Box style={{ maxWidth: '680px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="warning">Partial Outcome</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Partial Batch Execution (3 Succeeded, 1 Failed)
          </Heading>
          <Text variant="caption" color="secondary">
            Distinctly reports succeeded vs failed items. Retrying only executes against the failed items.
          </Text>
        </div>

        <Banner status="warning" title="Partial Batch Posting: 1 Consignment Blocked" isDismissible={false}>
          GRN-9403 failed validation (Purchase Order PO-881 expired). Other 3 receipts successfully posted to ledger.
        </Banner>

        <Box p={4} isCard>
          <HStack justify="between" align="center">
            <div>
              <Text weight="semibold">Failed: GRN-9403 (Deccan Machine Supply)</Text>
              <Text size="xs" color="secondary">Error: PO-881 Expired on 2026-09-20</Text>
            </div>
            <Button size="sm" variant="danger" onClick={() => alert('Retrying GRN-9403 with override code')}>
              Retry GRN-9403 Only
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 4. Complete MES Outage on Bulk Commit
export const CompleteMESOutage: Story = {
  render: () => (
    <Box style={{ maxWidth: '680px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="danger">ERP Service Failure</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Batch Commit Aborted (Preserved Selection)
          </Heading>
          <Text variant="caption" color="secondary">
            ERP write failed. Selected checkboxes and target snapshot survive for single-click retry.
          </Text>
        </div>

        <Banner status="error" title="SAP MM Batch Processor Error (503 Service Unavailable)" isDismissible={false}>
          Inventory transaction aborted. No records were posted. Your 4 selected receipts remain active for retry.
        </Banner>

        <Box p={4} isCard>
          <HStack justify="between">
            <Text size="sm">4 items selected for inward commit</Text>
            <Button variant="danger" size="sm">Retry Post (4 Receipts)</Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 5. Single-Shot Commit Guard
export const SingleShotCommitGuard: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Idempotency Guard</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Single-Shot Batch Lock
          </Heading>
          <Text variant="caption" color="secondary">
            Action triggers disable immediately upon dispatch to prevent duplicate postings.
          </Text>
        </div>

        <Box p={5} isCard>
          <Button variant="primary" isLoading loadingText="Posting 3 Receipts to SAP Inventory...">
            Post 3 Receipts
          </Button>
        </Box>
      </VStack>
    </Box>
  ),
};

// 6. Empty Collection State
export const EmptyCollectionState: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Heading as="h2" size="xl" weight="bold">Goods Receipt Staging</Heading>
        </div>

        <Box p={6} isCard style={{ textAlign: 'center' }}>
          <VStack gap={2} align="center">
            <Heading as="h3" size="lg">All Inward Consignments Cleared</Heading>
            <Text size="sm" color="secondary">
              No pending vendor deliveries at Gate 02. Shift A inward queue is empty.
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 7. Select Across All Pages Prompt
export const SelectAcrossPagesPrompt: Story = {
  render: () => (
    <Box style={{ maxWidth: '680px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Pagination Scope</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Explicit Cross-Page Selection Scope
          </Heading>
          <Text variant="caption" color="secondary">
            Clearly separates selecting the current 10 visible rows from the entire dataset of 148 items.
          </Text>
        </div>

        <Box p={3} style={{ backgroundColor: '#EFF6FF', borderRadius: '6px', border: '1px solid #BFDBFE' }}>
          <HStack justify="between" align="center">
            <Text size="xs" color="primary">
              All 10 receipts on this page are selected.
            </Text>
            <Button size="sm" variant="outline">
              Select all 148 receipts across all pages
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};

// 8. Keyboard Row Selection
export const KeyboardRowSelection: Story = {
  render: () => (
    <Box style={{ maxWidth: '640px', margin: '0 auto' }}>
      <VStack gap={4} align="stretch">
        <div>
          <Badge variant="info">Keyboard Accessibility</Badge>
          <Heading as="h2" size="xl" weight="bold" style={{ marginTop: '6px' }}>
            Keyboard Row Toggle
          </Heading>
          <Text variant="caption" color="secondary">
            Use <kbd>Tab</kbd> to focus checkboxes and <kbd>Space</kbd> to toggle selection state.
          </Text>
        </div>

        <Box p={4} isCard>
          <HStack gap={3} align="center">
            <Checkbox aria-label="Toggle GRN-9401" />
            <Text size="sm">Press Space to toggle GRN-9401</Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  ),
};
