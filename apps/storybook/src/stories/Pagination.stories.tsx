import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination, Button } from '@ds/react';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Core/Pagination',
  component: Pagination,
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(3);
    return (
      <div style={{ padding: '24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
        {[1, 2, 3, 4, 5].map(p => (
          <button key={p} onClick={() => setPage(p)} style={{ width: '32px', height: '32px', borderRadius: '6px', border: page === p ? '1px solid #2563EB' : '1px solid #CBD5E1', backgroundColor: page === p ? '#2563EB' : '#FFF', color: page === p ? '#FFF' : '#334155', fontWeight: 600, cursor: 'pointer' }}>
            {p}
          </button>
        ))}
        <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)}>Next</Button>
      </div>
    );
  },
};

export const CompactPreviousNext: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }}>Previous</button>
      <span style={{ fontSize: '13px', color: '#64748B' }}>Page <strong>4</strong> of <strong>28</strong></span>
      <button style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', background: '#FFF' }}>Next</button>
    </div>
  ),
};

export const RowsPerPageSelector: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
      <label htmlFor="story-rows-per-page" style={{ fontSize: '13px', color: '#64748B' }}>Rows per page:</label>
      <select id="story-rows-per-page" style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '13px' }}>
        <option>20</option>
        <option>50</option>
        <option>100</option>
      </select>
      <span style={{ fontSize: '13px', color: '#64748B' }}>Showing 1–20 of 480 items</span>
    </div>
  ),
};

export const WithDirectPageInput: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label htmlFor="story-page-number" style={{ fontSize: '13px' }}>Go to page:</label>
      <input id="story-page-number" type="number" defaultValue="14" style={{ width: '50px', padding: '4px 6px', border: '1px solid #CBD5E1', borderRadius: '4px' }} />
      <button style={{ padding: '4px 10px', borderRadius: '4px', border: '1px solid #CBD5E1', background: '#F8FAFC' }}>Go</button>
    </div>
  ),
};

export const DisabledBoundaries: Story = {
  render: () => (
    <div style={{ padding: '24px', display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Button size="sm" variant="outline" disabled>Previous</Button>
      <span style={{ fontSize: '13px', color: '#64748B' }}>Page 1 of 10</span>
      <Button size="sm" variant="outline">Next</Button>
    </div>
  ),
};
