import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  CollectionWorkspaceLayout,
  Button,
  Badge,
  Input,
  Select,
  Checkbox,
  ToastProvider,
} from '@ds/react';

const meta: Meta = {
  title: 'Layout Templates/07 Collection Workspace',
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
          '**Collection Workspace Layout Template (§01–§14)**\n\n' +
          'Standardized full-screen workspace framing a single large collection.\n' +
          'Integrates 3-tiered control scoping (collection actions, refinement filters, search), identity-preserved batch selection, and sticky status pagination.\n\n' +
          '*Enterprise Scenario:* Metrology standards room gauge and micrometer calibration register at **Suryodaya Autocomp Ltd (PL-04 Chakan, Pune)** under Standards Lead Deepa Sawant.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface GaugeItem {
  id: string;
  code: string;
  type: string;
  range: string;
  location: string;
  lastCalDate: string;
  dueDate: string;
  status: 'Valid' | 'Cal Due Soon' | 'Overdue';
}

const gaugeList: GaugeItem[] = [
  { id: '1', code: 'MIC-DIGI-012', type: 'Digital Micrometer 0-25mm (Mitutoyo)', range: '0.001 mm', location: 'Press Line 2 QA Station', lastCalDate: '15-Mar-2026', dueDate: '15-Sep-2026', status: 'Overdue' },
  { id: '2', code: 'VER-DIGI-045', type: 'Digital Vernier Caliper 0-300mm', range: '0.01 mm', location: 'CNC Cell Metrology Bay', lastCalDate: '28-Apr-2026', dueDate: '28-Oct-2026', status: 'Valid' },
  { id: '3', code: 'PIN-SET-004', type: 'Cylindrical Pin Gauge Set (Ø 1–10mm)', range: 'Grade 1 (± 0.001)', location: 'Standards Room Cabinet A', lastCalDate: '05-May-2026', dueDate: '05-Nov-2026', status: 'Valid' },
  { id: '4', code: 'BORE-DIAL-02', type: 'Bore Dial Gauge 50–150mm (Baker)', range: '0.002 mm', location: 'Line P-1 Sub-assembly', lastCalDate: '20-Mar-2026', dueDate: '20-Sep-2026', status: 'Cal Due Soon' },
  { id: '5', code: 'HGT-ELEC-01', type: 'Electronic Height Master 600mm', range: '0.0005 mm', location: 'Standards Room CMM Room', lastCalDate: '10-Feb-2026', dueDate: '10-Feb-2027', status: 'Valid' },
];

// 1. Calibration Register Workspace (Happy Path)
export const CalibrationRegisterWorkspace: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<string[]>(['1']);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);

    const toggleSelect = (id: string) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    };

    const toggleSelectAll = () => {
      if (selectedIds.length === gaugeList.length) {
        setSelectedIds([]);
      } else {
        setSelectedIds(gaugeList.map((g) => g.id));
      }
    };

    const filteredGauges = gaugeList.filter(
      (g) =>
        g.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <CollectionWorkspaceLayout
        selectedCount={selectedIds.length}
        isDrawerFilterOpen={filterOpen}
        scopeHeader={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#1D4ED8', textTransform: 'uppercase' }}>
                Metrology Standards Room · Chakan PL-04
              </span>
              <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '2px 0 0', color: '#0F172A' }}>
                Gauge & Instrument Calibration Register
              </h1>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button size="sm" variant="outline">Import NABL Certs</Button>
              <Button size="sm" variant="primary">Add New Instrument</Button>
            </div>
          </div>
        }
        toolbar={
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Input aria-label="Search instrument code, type, location"
                placeholder="Search instrument code, type, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '320px' }}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                Filters {filterOpen ? '▲' : '▼'}
              </Button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: '#64748B' }}>
              <span>Showing <strong>{filteredGauges.length}</strong> of <strong>142</strong> instruments</span>
            </div>
          </>
        }
        selectionBar={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1D4ED8' }}>
              {selectedIds.length} instrument{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button size="sm" variant="outline" onClick={() => setSelectedIds([])}>
                Deselect All
              </Button>
              <Button size="sm" variant="primary">
                Dispatch to NABL Calibration Lab
              </Button>
            </div>
          </div>
        }
        filterDrawer={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Refine Instrument Filter</h2>
              <Button size="sm" variant="outline" onClick={() => setFilterOpen(false)}>✕</Button>
            </div>
            <div>
              <span id="story-collectionworkspace-151" style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Calibration Status</span>
              <Select aria-labelledby="story-collectionworkspace-151" aria-label="Select option"
                items={[
                  { value: 'all', label: 'All Statuses' },
                  { value: 'overdue', label: 'Overdue Only' },
                  { value: 'duesoon', label: 'Due Within 15 Days' },
                ]}
                defaultValue={['all']}
              />
            </div>
          </div>
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '13px', color: '#64748B' }}>Page 1 of 6 · PL-04 Standards Database</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <Button size="sm" variant="outline" disabled>Previous</Button>
              <Button size="sm" variant="primary">1</Button>
              <Button size="sm" variant="outline">2</Button>
              <Button size="sm" variant="outline">3</Button>
              <Button size="sm" variant="outline">Next</Button>
            </div>
          </div>
        }
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
            <tr>
              <th style={{ padding: '10px 14px', width: '40px' }}>
                <Checkbox
                  checked={selectedIds.length === gaugeList.length}
                  onChange={toggleSelectAll}
                  aria-label="Select all gauges"
                />
              </th>
              <th style={{ padding: '10px 14px' }}>CODE</th>
              <th style={{ padding: '10px 14px' }}>INSTRUMENT TYPE</th>
              <th style={{ padding: '10px 14px' }}>ACCURACY / RANGE</th>
              <th style={{ padding: '10px 14px' }}>CURRENT LOCATION</th>
              <th style={{ padding: '10px 14px' }}>DUE DATE</th>
              <th style={{ padding: '10px 14px' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredGauges.map((g) => {
              const isSelected = selectedIds.includes(g.id);
              return (
                <tr
                  key={g.id}
                  style={{
                    borderBottom: '1px solid #F1F5F9',
                    background: isSelected ? '#EFF6FF' : '#FFFFFF',
                  }}
                >
                  <td style={{ padding: '10px 14px' }}>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleSelect(g.id)}
                      aria-label={`Select ${g.code}`}
                    />
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 600 }}>{g.code}</td>
                  <td style={{ padding: '10px 14px' }}>{g.type}</td>
                  <td style={{ padding: '10px 14px' }}>{g.range}</td>
                  <td style={{ padding: '10px 14px' }}>{g.location}</td>
                  <td style={{ padding: '10px 14px' }}>{g.dueDate}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge
                      variant={
                        g.status === 'Valid'
                          ? 'success'
                          : g.status === 'Cal Due Soon'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {g.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CollectionWorkspaceLayout>
    );
  },
};

// 2. Active Batch Selection Bar
export const ActiveBatchSelectionBar: Story = {
  render: () => (
    <CollectionWorkspaceLayout
      selectedCount={3}
      selectionBar={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <strong style={{ color: '#1D4ED8' }}>3 Instruments Selected for Recalibration</strong>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button size="sm" variant="outline">Print Calibration Tags</Button>
            <Button size="sm" variant="primary">Generate Transfer Gatepass</Button>
          </div>
        </div>
      }
    >
      <div style={{ padding: '24px' }}>
        <p style={{ color: '#64748B' }}>Batch actions toolbar appears floating without displacing the table grid rows.</p>
      </div>
    </CollectionWorkspaceLayout>
  ),
};

// 3. Slide-Over Filter Drawer
export const SlideOverFilterDrawer: Story = {
  render: () => (
    <CollectionWorkspaceLayout
      isDrawerFilterOpen={true}
      filterDrawer={
        <div>
          <h2>Active Drawer Filter</h2>
          <p style={{ color: '#64748B', fontSize: '13px' }}>Filter by plant department, gauge manufacturer, or tolerance class.</p>
        </div>
      }
    >
      <div style={{ padding: '20px' }}>Table Content Behind Drawer</div>
    </CollectionWorkspaceLayout>
  ),
};

// 4. No Matches Search State
export const NoMatchesSearchState: Story = {
  render: () => (
    <CollectionWorkspaceLayout
      layoutState="no-matches"
      toolbar={<Input aria-label="Collection Workspace field" value="NonExistentGauge#9999" readOnly style={{ width: '300px' }} />}
    />
  ),
};

// 5. Empty Collection State
export const EmptyCollectionState: Story = {
  render: () => (
    <CollectionWorkspaceLayout
      layoutState="empty"
    />
  ),
};

// 6. Sticky Pagination Footer
export const StickyPaginationFooter: Story = {
  render: () => (
    <CollectionWorkspaceLayout
      isStickyFooter={true}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>Showing Page 1 of 12 (142 Instruments Total)</span>
          <Button size="sm" variant="outline">Next Page →</Button>
        </div>
      }
    >
      <div style={{ padding: '20px' }}>
        <p style={{ color: '#64748B' }}>The pagination footer remains locked to the bottom of the viewport as rows scroll.</p>
      </div>
    </CollectionWorkspaceLayout>
  ),
};

// 7. Keyboard Grid Navigation
export const KeyboardGridNavigation: Story = {
  render: () => (
    <CollectionWorkspaceLayout
      toolbar={<Button variant="outline">Focused Toolbar Item</Button>}
      footer={<Button variant="outline">Focused Footer Item</Button>}
    >
      <div style={{ padding: '20px' }}>
        <p style={{ color: '#64748B' }}>Predictable Tab and arrow key traversal through Scope → Toolbar → Grid → Footer.</p>
      </div>
    </CollectionWorkspaceLayout>
  ),
};
