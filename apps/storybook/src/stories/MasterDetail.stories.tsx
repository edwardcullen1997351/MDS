import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  MasterDetailLayout,
  Button,
  Badge,
  Input,
  ToastProvider,
} from '@ds/react';

const meta: Meta = {
  title: 'Layout Templates/05 Master Detail',
  decorators: [
    (Story) => (
      <ToastProvider position="top-right">
        <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', fontFamily: 'var(--font-sans, system-ui, sans-serif)' }}>
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          '**Master-Detail Layout Template (§01–§14)**\n\n' +
          'A collection held beside the one member currently being worked.\n' +
          'Enforces one-directional selection dependency, independent position/scroll ownership, and 4 structural layout states.\n\n' +
          '*Enterprise Scenario:* Purchase Order delivery expediting for open supplier lines past promised delivery date at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)** under Purchase Head Vinayak Deshmukh.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface POLine {
  id: string;
  poNumber: string;
  vendor: string;
  partName: string;
  qty: string;
  promisedDate: string;
  daysDelayed: number;
  criticality: 'High' | 'Medium' | 'Low';
  buyer: string;
  contact: string;
}

const poData: POLine[] = [
  { id: '1', poNumber: 'PO-2026-8941', vendor: 'Bharat Forge Ltd', partName: 'Front Axle Beam Forging', qty: '350 pcs', promisedDate: '15-Sep-2026', daysDelayed: 9, criticality: 'High', buyer: 'Vinayak Deshmukh', contact: '+91 98220 11234' },
  { id: '2', poNumber: 'PO-2026-8980', vendor: 'Sundram Fasteners', partName: 'High Tensile M12 Bolts (Grade 10.9)', qty: '12,000 pcs', promisedDate: '18-Sep-2026', daysDelayed: 6, criticality: 'Medium', buyer: 'Vinayak Deshmukh', contact: '+91 94230 55678' },
  { id: '3', poNumber: 'PO-2026-9012', vendor: 'SKF India Ltd', partName: 'Tapered Roller Bearing 32208', qty: '400 pcs', promisedDate: '20-Sep-2026', daysDelayed: 4, criticality: 'High', buyer: 'Pooja Patil', contact: '+91 98901 33456' },
  { id: '4', poNumber: 'PO-2026-9045', vendor: 'Lucas TVS Ltd', partName: 'Starter Motor Assembly 24V', qty: '120 pcs', promisedDate: '21-Sep-2026', daysDelayed: 3, criticality: 'Low', buyer: 'Pooja Patil', contact: '+91 97654 88901' },
];

// 1. Expediting Work Queue (Happy Path)
export const ExpeditingWorkQueue: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState<string | null>('1');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPOs = poData.filter(
      (p) =>
        p.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.partName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activePO = poData.find((p) => p.id === selectedId);

    return (
      <MasterDetailLayout
        masterWidth="380px"
        selectedId={selectedId}
        master={
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Master Header */}
            <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', background: '#FFF' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#b91c1c', textTransform: 'uppercase' }}>
                Procurement Expediting · PL-04
              </span>
              <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '4px 0 10px', color: '#0F172A' }}>
                Delayed PO Lines ({filteredPOs.length})
              </h2>
              <Input aria-label="Filter PO #, vendor, or part"
                placeholder="Filter PO #, vendor, or part..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Master List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredPOs.map((item) => {
                const isSelected = item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-current={isSelected ? 'true' : undefined}
                    onClick={() => setSelectedId(item.id)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left', font: 'inherit',
                      padding: '12px 16px',
                      borderBottom: '1px solid #F1F5F9',
                      background: isSelected ? '#EFF6FF' : '#FFFFFF',
                      borderLeft: isSelected ? '3px solid #2563EB' : '3px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <strong style={{ fontSize: '13px', color: isSelected ? '#1D4ED8' : '#0F172A' }}>
                        {item.poNumber}
                      </strong>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#b91c1c' }}>
                        +{item.daysDelayed}d overdue
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#334155', marginTop: '2px' }}>
                      {item.vendor}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                      {item.partName} · {item.qty}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        }
        detail={
          activePO && (
            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase' }}>
                    Purchase Order Details
                  </span>
                  <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '4px 0 6px', color: '#0F172A' }}>
                    {activePO.poNumber} — {activePO.partName}
                  </h1>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                    Vendor: {activePO.vendor} · Buyer: {activePO.buyer} ({activePO.contact})
                  </p>
                </div>
                <Badge variant={activePO.criticality === 'High' ? 'danger' : 'warning'}>
                  Criticality: {activePO.criticality}
                </Badge>
              </div>

              <div style={{ background: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Promised Delivery Date</span>
                  <strong style={{ fontSize: '14px', color: '#b91c1c' }}>{activePO.promisedDate}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Pending Quantity</span>
                  <strong style={{ fontSize: '14px', color: '#0F172A' }}>{activePO.qty}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Plant Destination</span>
                  <strong style={{ fontSize: '14px', color: '#0F172A' }}>Chakan PL-04 (Gate 2)</strong>
                </div>
              </div>

              <div style={{ background: '#FFF', padding: '20px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>Log Expediting Contact & Escalation</h2>
                <Input aria-label="Enter vendor contact log note (e.g. Spoke with dispatch team, consignment in transit on MH-14...)" placeholder="Enter vendor contact log note (e.g. Spoke with dispatch team, consignment in transit on MH-14...)" />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <Button variant="outline">Flag Assembly Risk</Button>
                  <Button variant="primary">Send Urgent Alert</Button>
                </div>
              </div>
            </div>
          )
        }
      />
    );
  },
};

// 2. Initial Empty State
export const NoSelectionInitialEmptyState: Story = {
  render: () => (
    <MasterDetailLayout
      masterWidth="380px"
      selectedId={null}
      master={
        <div style={{ padding: '16px' }}>
          <h2>Master PO Queue (4 items)</h2>
          <p style={{ color: '#64748B', fontSize: '13px' }}>Click any PO line to view detail pane.</p>
        </div>
      }
    />
  ),
};

// 3. Detail Async Loading Skeleton
export const DetailAsyncLoadingSkeleton: Story = {
  render: () => (
    <MasterDetailLayout
      masterWidth="380px"
      selectedId="1"
      layoutState="detail-loading"
      master={
        <div style={{ padding: '16px' }}>
          <h2>Master PO Queue</h2>
          <p style={{ color: '#64748B', fontSize: '13px' }}>Loading PO details from ERP server...</p>
        </div>
      }
    />
  ),
};

// 4. Detail Query Failure State
export const DetailQueryFailure: Story = {
  render: () => (
    <MasterDetailLayout
      masterWidth="380px"
      selectedId="1"
      layoutState="detail-error"
      master={
        <div style={{ padding: '16px' }}>
          <h2>Master PO Queue</h2>
        </div>
      }
    />
  ),
};

// 5. Filter Refinement Persistence
export const FilterRefinementPersistence: Story = {
  render: () => {
    const [filter, setFilter] = useState('SKF');
    return (
      <MasterDetailLayout
        masterWidth="380px"
        selectedId="3"
        master={
          <div style={{ padding: '16px' }}>
            <Input aria-label="Master Detail field" value={filter} onChange={(e) => setFilter(e.target.value)} />
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>
              Active selection PO-2026-9012 persists during filter changes.
            </p>
          </div>
        }
        detail={
          <div style={{ padding: '24px' }}>
            <h2>PO-2026-9012 (SKF India Ltd)</h2>
            <p style={{ color: '#64748B' }}>Tapered Roller Bearing 32208 · 400 pcs</p>
          </div>
        }
      />
    );
  },
};

// 6. Sequential Mobile Route
export const SequentialMobileRoute: Story = {
  render: () => {
    const [view, setView] = useState<'master' | 'detail'>('detail');
    return (
      <MasterDetailLayout
        mobileView={view}
        onMobileViewChange={setView}
        selectedId="1"
        master={
          <div style={{ padding: '16px' }}>
            <h2>Mobile Master Queue</h2>
            <Button size="sm" onClick={() => setView('detail')}>View Selected PO Detail</Button>
          </div>
        }
        detail={
          <div style={{ padding: '24px' }}>
            <Button size="sm" variant="outline" onClick={() => setView('master')}>← Back to Master List</Button>
            <h2 style={{ marginTop: '16px' }}>PO-2026-8941 (Bharat Forge)</h2>
          </div>
        }
      />
    );
  },
};

// 7. Keyboard Master Detail Traversal
export const KeyboardMasterDetailTraversal: Story = {
  render: () => (
    <MasterDetailLayout
      masterWidth="380px"
      selectedId="1"
      master={
        <div style={{ padding: '16px' }}>
          <Button variant="outline">Master Item #1 (Focused)</Button>
        </div>
      }
      detail={
        <div style={{ padding: '24px' }}>
          <Button variant="primary">Detail Primary Action (Target)</Button>
        </div>
      }
    />
  ),
};
