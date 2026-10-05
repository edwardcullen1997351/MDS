import {
Button,
Text
} from '@ds/react';
import type { Meta,StoryObj } from '@storybook/react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Navigation Systems/07 Pagination',
  parameters: {
    docs: {
      description: {
        component:
          '**Collection Page Navigation System (§01–§14)**\n\n' +
          'Provides deterministic navigation across high-volume dataset partitions and collection records.\n' +
          'Owns discrete page ranges, boundary constraints, query parameter synchronization, and rows-per-page selection.\n\n' +
          '**Composition Contract:**\n' +
          '- **Required:** `Pagination`\n' +
          '- **Optional:** *None*\n\n' +
          '*Scenario:* **Work Order & Nonconformance Records Pagination** (1,280 active orders) at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// 1. Work Order Collection Pages
export const WorkOrderCollectionPages: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const totalPages = 64;

    return (
      <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <Text size="sm" weight="semibold">Shop Floor Work Orders (PL-04 Chakan)</Text>
            <Text size="xs" color="secondary">Showing page {page} of {totalPages} (1,280 total orders)</Text>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
            Previous
          </Button>
          {[1, 2, 3, 4, 5].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: page === p ? '1px solid #1D4ED8' : '1px solid #CBD5E1',
                background: page === p ? '#1D4ED8' : '#FFF',
                color: page === p ? '#FFF' : '#334155',
                fontWeight: page === p ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {p}
            </button>
          ))}
          <span style={{ padding: '0 4px', color: '#64748B' }}>...</span>
          <button
            type="button"
            onClick={() => setPage(totalPages)}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              border: page === totalPages ? '1px solid #1D4ED8' : '1px solid #CBD5E1',
              background: page === totalPages ? '#1D4ED8' : '#FFF',
              color: page === totalPages ? '#FFF' : '#334155',
              cursor: 'pointer',
            }}
          >
            {totalPages}
          </button>
          <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
            Next
          </Button>
        </div>
      </div>
    );
  },
};

// 2. Compact Previous Next Only
export const CompactPreviousNextOnly: Story = {
  render: () => {
    const [page, setPage] = useState(3);
    return (
      <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text size="xs" color="secondary">Page <strong>{page}</strong> of <strong>12</strong></Text>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
          <Button size="sm" variant="outline" disabled={page >= 12} onClick={() => setPage(p => p + 1)}>Next</Button>
        </div>
      </div>
    );
  },
};

// 3. Rows Per Page Density
export const RowsPerPageDensity: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Text size="sm">Rows per page:</Text>
      <select aria-label="Rows per page" style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '13px' }}>
        <option>20 orders / page</option>
        <option>50 orders / page</option>
        <option>100 orders / page</option>
      </select>
      <Text size="xs" color="secondary">Displaying 1–20 of 1,280 records</Text>
    </div>
  ),
};

// 4. Boundary Termination
export const BoundaryTermination: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button size="sm" variant="outline" disabled>Previous (Boundary: Page 1)</Button>
      <Text size="xs" color="secondary">Page 1 of 64</Text>
      <Button size="sm" variant="outline">Next (Page 2)</Button>
    </div>
  ),
};

// 5. Jump To Specific Page
export const JumpToSpecificPage: Story = {
  render: () => (
    <div style={{ padding: '24px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Text size="sm">Go to page:</Text>
      <input aria-label="Page number" type="number" defaultValue="24" style={{ width: '60px', padding: '6px 8px', border: '1px solid #CBD5E1', borderRadius: '6px' }} />
      <Button size="sm" variant="secondary">Jump</Button>
    </div>
  ),
};
