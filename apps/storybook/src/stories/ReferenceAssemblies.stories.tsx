import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import type { Meta, StoryObj } from '@storybook/react';
import './reference-assemblies.css';
import {
  CollectionWorkspaceLayout,
  SingleColumnLayout,
  SidebarLayout,
  DashboardLayout,
  DashboardWidget,
  Button,
  Input,
  Select,
  Checkbox,
  Switch,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  TabList,
  TabTrigger,
  TabPanel,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  SearchField,
  SplitButton,
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  LineChart,
  BarChart,
  AreaChart,
  EmptyState,
  Skeleton,
  ToastProvider,
  useToast,
  MenuItem,
  SegmentedControl,
  CommandToolbarGroup,
} from '@ds/react';

// Directional Panel Toggle Icons (§01–§14)
const SidebarLeftCollapseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="3" />
    <path d="M9 3v18" />
    <path d="m14 9-3 3 3 3" />
  </svg>
);

const SidebarLeftExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="3" />
    <path d="M9 3v18" />
    <path d="m11 9 3 3-3 3" />
  </svg>
);

const SidebarRightCollapseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="3" />
    <path d="M15 3v18" />
    <path d="m10 9 3 3-3 3" />
  </svg>
);

const SidebarRightExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="3" />
    <path d="M15 3v18" />
    <path d="m14 9-3 3 3 3" />
  </svg>
);

const meta: Meta = {
  title: 'Reference Assemblies/Candidate Overview',
  decorators: [
    (Story) => (
      <ToastProvider position="top-right">
        <div className="reference-assembly-root">
          <Story />
        </div>
      </ToastProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '# Candidate Reference Assemblies\n\n' +
          'Production-representative manufacturing ERP screens demonstrating the coordinated use of **Layout Templates**, **Navigation Systems**, **Composites**, **Interaction Patterns**, and **Components**.\n\n' +
          '> [!NOTE]\n' +
          '> Status: **candidate**. These assemblies are being audited under `reference-assembly-standard.md` and must not be represented as certified until their individual gates and evidence records pass.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

interface ChartDatum {
  label: string;
  value: number;
}

function AccessibleDataTable({
  data,
  valueHeading,
  unit = '',
}: {
  data: ChartDatum[];
  valueHeading: string;
  unit?: string;
}) {
  return (
    <details style={{ marginTop: 'var(--space-3)' }}>
      <summary style={{ color: 'var(--text-accent)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
        View data table
      </summary>
      <div style={{ marginTop: 'var(--space-2)' }}>
        <Table density="compact" bordered>
          <TableHeader>
            <TableRow>
              <TableHead>Period or area</TableHead>
              <TableHead align="right">{valueHeading}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((datum) => (
              <TableRow key={datum.label}>
                <TableCell>{datum.label}</TableCell>
                <TableCell align="right" style={{ fontFamily: 'var(--font-mono)' }}>{datum.value.toLocaleString('en-IN')}{unit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </details>
  );
}

type AssemblyState = 'ready' | 'loading' | 'offline' | 'restricted' | 'stale';

const ASSEMBLY_STATE_ITEMS = [
  { label: 'Ready', value: 'ready' },
  { label: 'Loading', value: 'loading' },
  { label: 'Service offline', value: 'offline' },
  { label: 'Permission restricted', value: 'restricted' },
  { label: 'Stale data', value: 'stale' },
];

function AssemblyStateHarness({
  id,
  state,
  onChange,
  children,
}: {
  id: string;
  state: AssemblyState;
  onChange: (state: AssemblyState) => void;
  children?: React.ReactNode;
}) {
  return (
    <details
      data-harness="remove-on-copy"
      style={{
        padding: 'var(--space-3)',
        marginBottom: 'calc(var(--space-12) + var(--space-10) + var(--space-10))',
        borderBottom: 'var(--border-dashed)',
        background: 'var(--surface-sunken)',
      }}
    >
      <summary style={{ cursor: 'pointer', color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)' }}>
        Inspection controls <span style={{ fontWeight: 'var(--weight-regular)' }}>- current state: {state}</span>
      </summary>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)', paddingTop: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Badge variant="info">Remove on adoption</Badge>
        <div style={{ minWidth: 'calc(var(--sidebar-w-collapsed) * 3)' }}>
          <Select
            aria-label={`Simulate ${id} assembly state`}
            size="sm"
            value={[state]}
            onValueChange={(detail) => onChange((detail.value[0] || 'ready') as AssemblyState)}
            items={ASSEMBLY_STATE_ITEMS}
          />
        </div>
        {children}
      </div>
    </details>
  );
}

function AssemblyStateBoundary({
  state,
  subject,
  onRetry,
  children,
}: {
  state: AssemblyState;
  subject: string;
  onRetry: () => void;
  children: React.ReactNode;
}) {
  if (state === 'loading') {
    return (
      <Card aria-busy="true" aria-label={`Loading ${subject}`} style={{ margin: 'var(--space-6)' }}>
        <CardHeader><CardTitle>Loading {subject}</CardTitle></CardHeader>
        <CardContent><Skeleton count={8} /></CardContent>
      </Card>
    );
  }

  if (state === 'offline') {
    return (
      <Card style={{ margin: 'var(--space-6)' }}>
        <EmptyState
          title={`${subject} is unavailable`}
          description="The plant service did not respond. No entered values were discarded."
          primaryAction={<Button variant="primary" onClick={onRetry}>Retry</Button>}
        />
      </Card>
    );
  }

  if (state === 'restricted') {
    return (
      <Card style={{ margin: 'var(--space-6)' }}>
        <EmptyState
          title="Access restricted"
          description={`Your current plant role cannot view ${subject}. Request access from the PL-04 administrator.`}
          secondaryAction={<Button variant="outline">Request access</Button>}
        />
      </Card>
    );
  }

  return (
    <>
      {state === 'stale' && (
        <div role="status" style={{ margin: 'var(--space-3)', padding: 'var(--space-3)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', color: 'var(--text-warning)', background: 'var(--status-warning-soft, var(--surface-sunken))' }}>
          Data may be stale. Last successful refresh: 28 Sep 2026, 15:10 (IST).
        </div>
      )}
      {children}
    </>
  );
}

// ==========================================
// 1. RECORD LIST REFERENCE ASSEMBLY
// ==========================================
interface WorkOrderRecord {
  id: string;
  name: string;
  category: 'Press Shop' | 'Machine Shop' | 'Assembly';
  status: 'Released' | 'At Risk' | 'Completed' | 'On Hold';
  owner: string;
  createdDate: string;
  value: string;
}

const initialRecords: WorkOrderRecord[] = [
  { id: 'WO-561188', name: 'Bearing housing assembly', category: 'Assembly', status: 'Released', owner: 'Sandeep Kulkarni', createdDate: '2026-09-01', value: '₹1,25,000' },
  { id: 'WO-561196', name: 'Manifold gasket batch', category: 'Assembly', status: 'At Risk', owner: 'Meera Nair', createdDate: '2026-09-05', value: '₹84,000' },
  { id: 'WO-561204', name: 'Caliper bracket forging', category: 'Press Shop', status: 'Released', owner: 'Anjali Deshmukh', createdDate: '2026-09-10', value: '₹2,10,000' },
  { id: 'WO-561212', name: 'Transmission housing machining', category: 'Machine Shop', status: 'Completed', owner: 'Vikram Bhosale', createdDate: '2026-09-12', value: '₹45,500' },
  { id: 'WO-561220', name: 'Gear housing cover press', category: 'Press Shop', status: 'On Hold', owner: 'Shalini Rao', createdDate: '2026-09-15', value: '₹3,50,000' },
  { id: 'WO-561224', name: 'Mounting plate forming', category: 'Press Shop', status: 'Released', owner: 'Priya Iyer', createdDate: '2026-09-18', value: '₹92,000' },
];

const WORK_ORDER_REGISTER_SCENARIO_ITEMS = [
  { label: 'Ready with matching records', value: 'ready' },
  { label: 'No matching records', value: 'no-matches' },
  { label: 'Selected records', value: 'selected' },
  { label: 'High-density records', value: 'high-density' },
  { label: 'Long content stress', value: 'stress-long-content' },
];

const WORK_ORDER_BULK_OUTCOME_ITEMS = [
  { label: 'Success', value: 'success' },
  { label: 'Service failure', value: 'failure' },
  { label: 'Partial result', value: 'partial' },
  { label: 'Permission restricted', value: 'restricted' },
  { label: 'Unknown outcome', value: 'unknown' },
];

function createWorkOrderStressRecords(count: number): WorkOrderRecord[] {
  const categories: WorkOrderRecord['category'][] = ['Press Shop', 'Machine Shop', 'Assembly'];
  const statuses: WorkOrderRecord['status'][] = ['Released', 'At Risk', 'Completed', 'On Hold'];
  return Array.from({ length: count }, (_, index) => ({
    id: `WO-${String(562000 + index).padStart(6, '0')}`,
    name: `Stress fixture work order ${index + 1} for PL-04 production planning`,
    category: categories[index % categories.length],
    status: statuses[index % statuses.length],
    owner: ['Sandeep Kulkarni', 'Meera Nair', 'Anjali Deshmukh', 'Vikram Bhosale'][index % 4],
    createdDate: `2026-09-${String((index % 28) + 1).padStart(2, '0')}`,
    value: `₹${(45000 + index * 3750).toLocaleString('en-IN')}`,
  }));
}

function getWorkOrderScenarioRecords(scenario: string) {
  if (scenario === 'high-density') return createWorkOrderStressRecords(120);
  if (scenario === 'stress-long-content') {
    return initialRecords.map((record, index) => ({
      ...record,
      name: `${record.name} with extended routing, material hold, supplier inspection, and shift handover note ${index + 1}`,
      owner: `${record.owner} - PL-04 cross-functional planning escalation owner`,
    }));
  }
  return initialRecords;
}

export const RecordListExample: Story = {
  name: '1. Work Order Register Candidate',
  render: () => {
    const [registerScenario, setRegisterScenario] = useState<string[]>([getDashboardParam('registerScenario', 'ready')]);
    const records = getWorkOrderScenarioRecords(registerScenario[0]);
    const [selectedIds, setSelectedIds] = useState<string[]>(registerScenario[0] === 'selected' ? [records[0]?.id, records[1]?.id].filter(Boolean) : []);
    const [searchQuery, setSearchQuery] = useState(registerScenario[0] === 'no-matches' ? 'not-a-real-work-order' : '');
    const [categoryFilter, setCategoryFilter] = useState<string[]>(['ALL']);
    const [currentPage, setCurrentPage] = useState(1);
    const [bulkOutcome, setBulkOutcome] = useState<string[]>([getDashboardParam('bulkOutcome', 'success')]);
    const [isBulkProcessing, setIsBulkProcessing] = useState(false);
    const [bulkConfirmationArmed, setBulkConfirmationArmed] = useState(false);
    const [registerStatus, setRegisterStatus] = useState('Work order register ready. Selection and refinement changes are announced here.');
    const [assemblyState, setAssemblyState] = useState<AssemblyState>(getInitialAssemblyState());

    const activeCat = categoryFilter[0] || 'ALL';
    const filteredRecords = records.filter((rec) => {
      const matchesSearch =
        rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCat === 'ALL' || rec.category === activeCat;
      return matchesSearch && matchesCategory;
    });
    const pageSize = 6;
    const pageCount = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
    const safePage = Math.min(currentPage, pageCount);
    const pageStart = (safePage - 1) * pageSize;
    const pagedRecords = filteredRecords.slice(pageStart, pageStart + pageSize);
    const paginationWindow = Array.from(
      new Set([1, safePage - 1, safePage, safePage + 1, pageCount].filter((page) => page >= 1 && page <= pageCount))
    ).sort((a, b) => a - b);

    const isAllSelected =
      filteredRecords.length > 0 &&
      filteredRecords.every((rec) => selectedIds.includes(rec.id));

    const handleSelectAll = (checked: boolean) => {
      if (checked) {
        setSelectedIds(Array.from(new Set([...selectedIds, ...filteredRecords.map((r) => r.id)])));
      } else {
        setSelectedIds(selectedIds.filter((id) => !filteredRecords.some((r) => r.id === id)));
      }
    };

    const handleToggleRow = (id: string) => {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
      setBulkConfirmationArmed(false);
    };

    const handleBulkDelete = () => {
      if (selectedIds.length === 0 || isBulkProcessing) return;
      if (!bulkConfirmationArmed) {
        flushSync(() => {
          setBulkConfirmationArmed(true);
        });
        setRegisterStatus(`Confirm deletion for ${selectedIds.length} selected work order${selectedIds.length === 1 ? '' : 's'}.`);
        return;
      }
      flushSync(() => {
        setIsBulkProcessing(true);
        setRegisterStatus(`Deleting ${selectedIds.length} selected work order${selectedIds.length === 1 ? '' : 's'}. Duplicate bulk actions are blocked.`);
      });
      window.setTimeout(() => {
        setIsBulkProcessing(false);
        setBulkConfirmationArmed(false);
        if (bulkOutcome[0] === 'failure') {
          setRegisterStatus('Bulk delete failed. Selection and filters are preserved for retry.');
          return;
        }
        if (bulkOutcome[0] === 'partial') {
          setRegisterStatus('Partial bulk result. Some work orders were deleted; remaining selected records need review.');
          return;
        }
        if (bulkOutcome[0] === 'restricted') {
          setRegisterStatus('Bulk delete restricted. Your role can review work orders but cannot delete released records.');
          return;
        }
        if (bulkOutcome[0] === 'unknown') {
          setRegisterStatus('Bulk delete outcome unknown. Check the audit log before retrying.');
          return;
        }
        setSelectedIds([]);
        setRegisterStatus('Selected work orders deleted and audit event recorded.');
      }, 500);
    };

    const getStatusVariant = (status: WorkOrderRecord['status']) => {
      switch (status) {
        case 'Released': return 'success';
        case 'At Risk': return 'warning';
        case 'Completed': return 'info';
        case 'On Hold': return 'neutral';
      }
    };

    return (
      <>
        <AssemblyStateHarness id="work-order-register" state={assemblyState} onChange={setAssemblyState}>
          <Select
            aria-label="Work order register scenario"
            value={registerScenario}
            onValueChange={(detail) => {
              const nextScenario = detail.value[0] || 'ready';
              const nextRecords = getWorkOrderScenarioRecords(nextScenario);
              setRegisterScenario(detail.value);
              setSearchQuery(nextScenario === 'no-matches' ? 'not-a-real-work-order' : '');
              setSelectedIds(nextScenario === 'selected' ? [nextRecords[0]?.id, nextRecords[1]?.id].filter(Boolean) : []);
              setCurrentPage(1);
              setBulkConfirmationArmed(false);
              setRegisterStatus('Work order register scenario changed for inspection.');
            }}
            items={WORK_ORDER_REGISTER_SCENARIO_ITEMS}
          />
          <Select
            aria-label="Work order bulk action outcome"
            value={bulkOutcome}
            onValueChange={(detail) => setBulkOutcome(detail.value)}
            items={WORK_ORDER_BULK_OUTCOME_ITEMS}
          />
        </AssemblyStateHarness>
        <AssemblyStateBoundary state={assemblyState} subject="work order register" onRetry={() => setAssemblyState('ready')}>
          <CollectionWorkspaceLayout
        className="reference-assembly-workspace reference-assembly-workspace--comfortable"
        selectedCount={selectedIds.length}
        scopeHeader={
          <div className="reference-assembly-scope-row">
            <div>
              <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-accent)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>
                Chakan plant PL-04 · Candidate reference assembly
              </span>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-semibold)', margin: 'var(--space-1) 0 0', color: 'var(--text-primary)' }}>
                Work order register
              </h1>
            </div>
            <CommandToolbarGroup
              actionControls={
                <>
                  <Button variant="outline" size="sm">Export work orders</Button>
                  <Button variant="primary" size="sm">Create work order</Button>
                </>
              }
            />
          </div>
        }
        toolbar={
          <CommandToolbarGroup
            filterControls={
              <div style={{ flex: '1 1 var(--sidebar-w)', maxWidth: 'calc(var(--container-sm) / 2)' }}>
                <SearchField aria-label="Search by work order or part"
                  placeholder="Search by work order or part..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  onClear={() => { setSearchQuery(''); setCurrentPage(1); }}
                  size="sm"
                />
              </div>
            }
            viewControls={
              <SegmentedControl
                aria-label="Filter work orders by production area"
                value={categoryFilter[0] || 'ALL'}
                onChange={(val) => {
                  setCategoryFilter([val]);
                  setCurrentPage(1);
                  setBulkConfirmationArmed(false);
                  setRegisterStatus('Work order area filter changed.');
                }}
                options={[
                  { value: 'ALL', label: 'All areas' },
                  { value: 'Press Shop', label: 'Press Shop' },
                  { value: 'Machine Shop', label: 'Machine Shop' },
                  { value: 'Assembly', label: 'Assembly' },
                ]}
              />
            }
          />
        }
        selectionBar={
          selectedIds.length > 0 ? (
            <div className="work-order-register-selection" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-2) var(--space-3)', background: 'var(--surface-selected)', borderRadius: 'var(--radius-sm)', border: 'var(--border-hairline)', width: '100%' }}>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-accent)' }}>
                {selectedIds.length} work order{selectedIds.length === 1 ? '' : 's'} selected
              </span>
              <Button size="sm" variant="secondary">Bulk Assign</Button>
              <Button size="sm" variant="danger" isLoading={isBulkProcessing} loadingText="Deleting selected work orders" disabled={isBulkProcessing} onClick={handleBulkDelete}>
                {bulkConfirmationArmed ? 'Confirm delete selected' : 'Bulk Delete'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>Clear</Button>
            </div>
          ) : undefined
        }
        footer={
          <div className="reference-assembly-footer-row">
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
               Showing {filteredRecords.length === 0 ? 0 : pageStart + 1}–{Math.min(pageStart + pageSize, filteredRecords.length)} of {filteredRecords.length} matching work orders
            </span>
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} /></PaginationItem>
                {paginationWindow.map((page, index) => (
                  <React.Fragment key={page}>
                    {index > 0 && page - paginationWindow[index - 1] > 1 ? (
                      <PaginationItem>
                        <span className="work-order-pagination-ellipsis" aria-hidden="true">...</span>
                      </PaginationItem>
                    ) : null}
                    <PaginationItem>
                      <PaginationLink isActive={safePage === page} onClick={() => setCurrentPage(page)}>{page}</PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                ))}
                <PaginationItem><PaginationNext onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))} /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        }
      >
        <div role="status" aria-live="polite" className="work-order-register-status">
          {registerStatus}
        </div>
        <Card className="reference-assembly-data-surface" padding="none" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div className="work-order-register-table">
          <Table density="compact" hoverable bordered>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: 'var(--space-10)' }}>
                   <Checkbox aria-label="Select all matching work orders" checked={isAllSelected} onChange={(e) => handleSelectAll(e.target.checked)} />
                </TableHead>
                <TableHead>Work Order</TableHead>
                <TableHead>Part / Operation</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead align="right">Value</TableHead>
                <TableHead align="center" style={{ width: 'var(--space-20)' }}>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9}>
                    <EmptyState
                      size="sm"
                      title="No work orders match these filters"
                      description="Clear the search or select another production area."
                      primaryAction={<Button size="sm" variant="outline" onClick={() => { setSearchQuery(''); setCategoryFilter(['ALL']); }}>Clear filters</Button>}
                    />
                  </TableCell>
                </TableRow>
              ) : pagedRecords.map((rec) => {
                const isSelected = selectedIds.includes(rec.id);
                return (
                  <TableRow key={rec.id} style={{ backgroundColor: isSelected ? 'var(--table-row-background-selected)' : undefined }}>
                    <TableCell>
                       <Checkbox aria-label={`Select work order ${rec.id}`} checked={isSelected} onChange={() => handleToggleRow(rec.id)} />
                    </TableCell>
                    <TableCell style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 600 }}>{rec.id}</TableCell>
                    <TableCell style={{ fontWeight: 500 }}>{rec.name}</TableCell>
                    <TableCell>{rec.category}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(rec.status)}>{rec.status}</Badge>
                    </TableCell>
                    <TableCell>{rec.owner}</TableCell>
                    <TableCell style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{rec.createdDate}</TableCell>
                    <TableCell align="right" style={{ fontFamily: 'var(--font-mono, monospace)' }}>{rec.value}</TableCell>
                    <TableCell align="center">
                      <Button size="sm" variant="ghost">Edit</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>
          <div className="work-order-register-list" aria-label="Work order cards">
            {filteredRecords.length === 0 ? (
              <EmptyState
                size="sm"
                title="No work orders match these filters"
                description="Clear the search or select another production area."
                primaryAction={<Button size="sm" variant="outline" onClick={() => { setSearchQuery(''); setCategoryFilter(['ALL']); setRegisterStatus('Filters cleared.'); }}>Clear filters</Button>}
              />
            ) : pagedRecords.map((rec) => {
              const isSelected = selectedIds.includes(rec.id);
              return (
                <article key={rec.id} className="work-order-card">
                  <div className="work-order-card__header">
                    <Checkbox aria-label={`Select work order ${rec.id}`} checked={isSelected} onChange={() => handleToggleRow(rec.id)} />
                    <span className="work-order-card__id">{rec.id}</span>
                    <Badge variant={getStatusVariant(rec.status)}>{rec.status}</Badge>
                  </div>
                  <p className="work-order-card__title">{rec.name}</p>
                  <dl className="work-order-card__meta">
                    <div><dt>Area</dt><dd>{rec.category}</dd></div>
                    <div><dt>Owner</dt><dd>{rec.owner}</dd></div>
                    <div><dt>Created</dt><dd>{rec.createdDate}</dd></div>
                    <div><dt>Value</dt><dd>{rec.value}</dd></div>
                  </dl>
                  <Button size="sm" variant="ghost">Edit {rec.id}</Button>
                </article>
              );
            })}
          </div>
        </Card>
          </CollectionWorkspaceLayout>
        </AssemblyStateBoundary>
      </>
    );
  },
};

// ==========================================
// ==========================================
// 2. RECORD DETAIL REFERENCE ASSEMBLY
// ==========================================
interface WorkOrderDetailAuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  previousValue: string;
  updatedValue: string;
  badgeText: string;
  badgeVariant: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
}

interface WorkOrderRoutingOperation {
  id: string;
  seq: string;
  name: string;
  workCenter: string;
  standardTakt: string;
  setupTime: string;
  status: string;
  statusVariant: 'info' | 'success' | 'warning' | 'neutral';
}

interface WorkOrderQualityRecord {
  id: string;
  documentCode: string;
  title: string;
  authority: string;
  status: string;
  statusVariant: 'info' | 'success' | 'warning' | 'neutral';
}

const WORK_ORDER_DETAIL_SCENARIO_ITEMS = [
  { label: 'Active Released (Ready)', value: 'ready' },
  { label: 'Unsaved Modifications', value: 'dirty' },
  { label: 'Tooling Hold Applied', value: 'on-hold' },
  { label: 'Restricted Planner Role', value: 'restricted-planner' },
  { label: 'Concurrent Revision Conflict', value: 'concurrent-conflict' },
  { label: 'Stress: Long Part Content', value: 'stress-long-content' },
  { label: 'High Density History & Ops', value: 'high-density-history' },
];

const WORK_ORDER_DETAIL_SAVE_OUTCOME_ITEMS = [
  { label: 'Save succeeds (Rev E)', value: 'success' },
  { label: 'MES sync failure (500)', value: 'failure' },
  { label: 'Authorization required', value: 'reauth-required' },
  { label: 'Ledger unknown state', value: 'unknown' },
];

const WORK_ORDER_DETAIL_HOLD_OUTCOME_ITEMS = [
  { label: 'Hold confirmed', value: 'success' },
  { label: 'Interlock rejected', value: 'failure' },
];

const BASE_WORK_ORDER_AUDIT_LOGS: WorkOrderDetailAuditRecord[] = [
  {
    id: 'aud-1',
    timestamp: '2026-09-24 14:30:10',
    actor: 'Anjali Deshmukh',
    action: 'Released to production',
    previousValue: 'Status: Planned',
    updatedValue: 'Status: Released',
    badgeText: 'Released',
    badgeVariant: 'success',
  },
  {
    id: 'aud-2',
    timestamp: '2026-09-24 11:15:00',
    actor: 'Vikram Bhosale',
    action: 'Routing verification approved',
    previousValue: 'Routing: Rev C',
    updatedValue: 'Routing: Rev D',
    badgeText: 'Verified',
    badgeVariant: 'info',
  },
  {
    id: 'aud-3',
    timestamp: '2026-09-22 16:45:20',
    actor: 'Meera Nair',
    action: 'Quality inspection plan sign-off',
    previousValue: 'Quality: Draft',
    updatedValue: 'Quality: QP-4820-D Approved',
    badgeText: 'Approved',
    badgeVariant: 'success',
  },
  {
    id: 'aud-4',
    timestamp: '2026-09-01 09:15:00',
    actor: 'PL-04 Planning Engine',
    action: 'Work order instantiated',
    previousValue: '—',
    updatedValue: 'Created as WO-561204',
    badgeText: 'Created',
    badgeVariant: 'neutral',
  },
];

const STRESS_WORK_ORDER_AUDIT_LOGS: WorkOrderDetailAuditRecord[] = Array.from({ length: 14 }, (_, i) => ({
  id: `aud-${i + 1}`,
  timestamp: `2026-09-${String(24 - (i % 20)).padStart(2, '0')} 14:${String(30 - ((i * 2) % 60)).padStart(2, '0')}:00`,
  actor: i % 2 === 0 ? 'Anjali Deshmukh / Shift A Lead' : 'PL-04 Automated Telemetry Gateway',
  action: i === 0 ? 'Batch quantity adjustment recorded' : `Operational state check milestone ${i + 1}`,
  previousValue: i === 0 ? 'Batch: 1,200 pcs' : `Param state Rev-${i}`,
  updatedValue: i === 0 ? 'Batch: 1,450 pcs' : `Param state Rev-${i + 1}`,
  badgeText: i === 0 ? 'Adjusted' : 'Audited',
  badgeVariant: i === 0 ? 'warning' : 'info',
}));

const BASE_ROUTING_OPERATIONS: WorkOrderRoutingOperation[] = [
  { id: 'op-10', seq: '010', name: 'Coil Decoiling & Hydraulic Blanking', workCenter: 'Press Line P-2 (Cell 01)', standardTakt: '45 s / pc', setupTime: '15 min', status: 'In Progress', statusVariant: 'info' },
  { id: 'op-20', seq: '020', name: 'First Draw & Flange Edge Forming', workCenter: 'Press Line P-2 (Cell 02)', standardTakt: '60 s / pc', setupTime: '25 min', status: 'Queued', statusVariant: 'neutral' },
  { id: 'op-30', seq: '030', name: 'High-Precision Piercing & Trimming', workCenter: 'Press Line P-2 (Cell 03)', standardTakt: '33 s / pc', setupTime: '10 min', status: 'Queued', statusVariant: 'neutral' },
  { id: 'op-40', seq: '040', name: 'Coordinate Optical & Flange Inspection', workCenter: 'Metrology Lab CMM-01', standardTakt: '90 s / pc', setupTime: '5 min', status: 'Scheduled', statusVariant: 'neutral' },
];

const STRESS_ROUTING_OPERATIONS: WorkOrderRoutingOperation[] = [
  ...BASE_ROUTING_OPERATIONS,
  { id: 'op-50', seq: '050', name: 'Surface Deburring and Vibro-Finishing', workCenter: 'Finishing Bay 3', standardTakt: '25 s / pc', setupTime: '8 min', status: 'Scheduled', statusVariant: 'neutral' },
  { id: 'op-60', seq: '060', name: 'Anti-Rust Electro-Plating (Zinc-Nickel)', workCenter: 'Plating Line PL-02', standardTakt: '120 s / pc', setupTime: '40 min', status: 'Scheduled', statusVariant: 'neutral' },
];

const BASE_QUALITY_RECORDS: WorkOrderQualityRecord[] = [
  { id: 'qc-1', documentCode: 'QP-4820-D', title: 'Critical Stamping Quality Control Plan', authority: 'Meera Nair (Quality Auditor)', status: 'Approved', statusVariant: 'success' },
  { id: 'qc-2', documentCode: 'EN 10204 3.1', title: 'Raw Material Coil Mill Test Certificate #TC-9921', authority: 'Tata Steel Jamshedpur', status: 'Verified', statusVariant: 'success' },
  { id: 'qc-3', documentCode: 'IATF 16949 §8.5', title: 'Automotive Production Traceability Conformance', authority: 'Suryodaya Quality Assurance', status: 'Certified', statusVariant: 'info' },
  { id: 'qc-4', documentCode: 'IS 2062:2011', title: 'Hot Rolled Medium and High Tensile Structural Steel', authority: 'Bureau of Indian Standards', status: 'Compliant', statusVariant: 'neutral' },
];

export const RecordDetailExample: Story = {
  name: '2. Work Order Detail Candidate',
  render: () => {
    const toast = useToast();
    const [assemblyState, setAssemblyState] = useState<AssemblyState>(getInitialAssemblyState());
    const [detailScenario, setDetailScenario] = useState<string[]>([getDashboardParam('detailScenario', 'ready')]);
    const [saveOutcome, setSaveOutcome] = useState<string[]>([getDashboardParam('saveOutcome', 'success')]);
    const [holdOutcome, setHoldOutcome] = useState<string[]>([getDashboardParam('holdOutcome', 'success')]);

    const isDirtyScenario = detailScenario[0] === 'dirty';
    const isOnHoldScenario = detailScenario[0] === 'on-hold';
    const isRestricted = detailScenario[0] === 'restricted-planner';
    const isConflict = detailScenario[0] === 'concurrent-conflict';
    const isStressLong = detailScenario[0] === 'stress-long-content';
    const isHighDensity = detailScenario[0] === 'high-density-history';

    // Work order operational attributes
    const [currentOrderStatus, setCurrentOrderStatus] = useState<'Released' | 'On Hold' | 'Draft'>(
      isOnHoldScenario ? 'On Hold' : 'Released'
    );
    const [currentRevision, setCurrentRevision] = useState<'Rev D' | 'Rev E'>('Rev D');
    const [currentQty, setCurrentQty] = useState(isDirtyScenario ? '1,450 pcs' : '1,200 pcs');
    const [currentValue, setCurrentValue] = useState(isDirtyScenario ? '₹2,53,750' : '₹2,10,000');
    const [_activeTab, _setActiveTab] = useState<'history' | 'operations' | 'compliance'>('history');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Action execution states
    const [isSaving, setIsSaving] = useState(false);
    const [isHolding, setIsHolding] = useState(false);
    const [holdDialogOpen, setHoldDialogOpen] = useState(false);
    const [holdReason, setHoldReason] = useState<string[]>(['tooling-wear']);
    const [holdRemarks, setHoldRemarks] = useState('');
    const [orderStatusText, setOrderStatusText] = useState(
      isConflict
        ? 'Conflict detected: Routing revision Rev E was committed by Vikram Bhosale at 10:14 IST. Review diff before overwriting.'
        : isOnHoldScenario
        ? 'Work order WO-561204 placed on Line Hold. Tooling containment active on Press Line P-2.'
        : isDirtyScenario
        ? 'Unsaved batch quantity modifications pending. Review parameters before dispatching save.'
        : isRestricted
        ? 'Restricted mode: Shop-floor operator role has read-only access to routing specifications.'
        : 'Work order WO-561204 synchronized with plant MES. Production routing Rev D active.'
    );

    // Derived datasets
    const auditLogs = isHighDensity ? STRESS_WORK_ORDER_AUDIT_LOGS : BASE_WORK_ORDER_AUDIT_LOGS;
    const routingOps = isHighDensity ? STRESS_ROUTING_OPERATIONS : BASE_ROUTING_OPERATIONS;

    useEffect(() => {
      const containers = document.querySelectorAll<HTMLElement>('.work-order-detail-card .ds-table-container');
      containers.forEach((container) => {
        if (!container.hasAttribute('tabindex')) {
          container.setAttribute('tabindex', '0');
          container.setAttribute('role', 'region');
          container.setAttribute('aria-label', 'Operational records table');
        }
      });
    });

    const handleSaveWorkOrder = (actionType: 'save' | 'save-and-release') => {
      if (isRestricted || isSaving) return;
      flushSync(() => {
        setIsSaving(true);
        setOrderStatusText('Saving work order WO-561204. In-flight dispatch sent to PL-04 routing engine…');
      });
      window.setTimeout(() => {
        setIsSaving(false);
        if (saveOutcome[0] === 'failure') {
          setOrderStatusText('Save failed for WO-561204. Manufacturing Execution System was unreachable. Unsaved entries are retained on screen.');
          toast.error('Save failed', 'MES routing service unreachable. Local parameters retained.');
          return;
        }
        if (saveOutcome[0] === 'reauth-required') {
          setOrderStatusText('Authorization required. Modifying released production parameters requires Plant Administrator credentials.');
          toast.warning('Authorization required', 'Enter supervisor credentials to commit routing revision.');
          return;
        }
        if (saveOutcome[0] === 'unknown') {
          setOrderStatusText('Save outcome unknown for WO-561204. Inspect plant audit ledger before reapplying modifications.');
          toast.warning('Outcome unknown', 'Check audit ledger trace before retrying save.');
          return;
        }
        setCurrentRevision('Rev E');
        if (actionType === 'save-and-release') {
          setCurrentOrderStatus('Released');
        }
        setOrderStatusText('Work order WO-561204 saved successfully. Routing revision Rev E active and logged to PL-04 MES ledger.');
        toast.success(
          actionType === 'save-and-release' ? 'Saved and released' : 'Work order saved',
          `Routing revision Rev E committed with ${currentQty} planned quantity.`
        );
      }, 550);
    };

    const handleExecuteHold = () => {
      setIsHolding(true);
      setOrderStatusText('Applying line hold to WO-561204 in plant MES registry…');
      window.setTimeout(() => {
        setIsHolding(false);
        setHoldDialogOpen(false);
        if (holdOutcome[0] === 'failure') {
          setOrderStatusText('Line hold rejected. Machine safety interlock blocked hold placement during active hydraulic stroke.');
          toast.error('Hold rejected', 'Machine safety interlock blocked hold placement during active cycle.');
          return;
        }
        setCurrentOrderStatus('On Hold');
        setOrderStatusText('Work order WO-561204 placed on Line Hold. Tooling containment active.');
        toast.warning('Work order on hold', 'Press Line P-2 dispatch halted. Audit event #AUD-8812 logged.');
      }, 500);
    };

    const handleReleaseFromHold = () => {
      setCurrentOrderStatus('Released');
      setOrderStatusText('Work order WO-561204 resumed. Tooling hold cleared; Press Line P-2 takt dispatch restored.');
      toast.success('Hold cleared', 'Work order released back to active manufacturing schedule.');
    };

    const handleDuplicate = () => {
      setOrderStatusText('Duplicate created: Cloned into draft work order WO-561205 with initial Rev A routing.');
      toast.info('Record duplicated', 'New draft work order WO-561205 generated in planning register.');
    };

    const partDisplayTitle = isStressLong
      ? 'BRK-4820-A-HEAVY-DUTY-VENTILATED-CALIPER-BRACKET-LEFT-HAND-SUBASSEMBLY-WITH-ANTI-VIBRATION-BUSHINGS'
      : 'BRK-4820-A · Caliper bracket LH';

    const lineDisplayMeta = isStressLong
      ? 'High-Tonnage Hydraulic Tandem Cold Press Line 2 — Heavy Stamping Cell 04 — Shift A — Suryodaya Autocomp Chakan Plant PL-04'
      : 'Chakan plant PL-04 · Press line P-2 · Shift A · Due 30 Sep 2026 (IST)';

    return (
      <>
        <AssemblyStateHarness id="work-order-detail" state={assemblyState} onChange={setAssemblyState}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ minWidth: 'calc(var(--sidebar-w-collapsed) * 3)' }}>
              <Select
                aria-label="Work order detail scenario"
                size="sm"
                value={detailScenario}
                onValueChange={(detail) => {
                  const nextScenario = detail.value[0] || 'ready';
                  setDetailScenario(detail.value);
                  if (nextScenario === 'dirty') {
                    setCurrentQty('1,450 pcs');
                    setCurrentValue('₹2,53,750');
                  } else {
                    setCurrentQty('1,200 pcs');
                    setCurrentValue('₹2,10,000');
                  }
                  if (nextScenario === 'on-hold') {
                    setCurrentOrderStatus('On Hold');
                  } else {
                    setCurrentOrderStatus('Released');
                  }
                  setOrderStatusText(`Scenario updated to ${nextScenario}. Context refreshed.`);
                }}
                items={WORK_ORDER_DETAIL_SCENARIO_ITEMS}
              />
            </div>
            <div style={{ minWidth: 'calc(var(--sidebar-w-collapsed) * 2.5)' }}>
              <Select
                aria-label="Save operation outcome"
                size="sm"
                value={saveOutcome}
                onValueChange={(detail) => setSaveOutcome(detail.value)}
                items={WORK_ORDER_DETAIL_SAVE_OUTCOME_ITEMS}
              />
            </div>
            <div style={{ minWidth: 'calc(var(--sidebar-w-collapsed) * 2)' }}>
              <Select
                aria-label="Hold operation outcome"
                size="sm"
                value={holdOutcome}
                onValueChange={(detail) => setHoldOutcome(detail.value)}
                items={WORK_ORDER_DETAIL_HOLD_OUTCOME_ITEMS}
              />
            </div>
          </div>
        </AssemblyStateHarness>

        <AssemblyStateBoundary state={assemblyState} subject="work order detail" onRetry={() => setAssemblyState('ready')}>
          <div className="reference-assembly-workspace reference-assembly-workspace--comfortable">
            <SidebarLayout
              sidebarWidth="calc(var(--sidebar-w-collapsed) * 4.5)"
              minMainWidth="0"
              sidebarPosition="end"
              isCollapsed={isSidebarCollapsed}
              sidebarAriaLabel="Work order status and linked evidence"
              mainAriaLabel="Work order production attributes and tabs"
              header={
                <div className="work-order-detail-header">
                  <div className="work-order-detail-title-group">
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem><BreadcrumbLink href="#">Work orders</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbLink href="#">Press Shop</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><span style={{ color: 'var(--text-primary)', fontWeight: 'var(--weight-semibold)' }}>WO-561204</span></BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                      <Badge variant={currentOrderStatus === 'Released' ? 'success' : currentOrderStatus === 'On Hold' ? 'warning' : 'neutral'}>
                        {currentOrderStatus}
                      </Badge>
                      <Badge variant="info">{currentRevision}</Badge>
                      {isDirtyScenario && <Badge variant="warning">Unsaved modifications</Badge>}
                      {isConflict && <Badge variant="danger">Concurrent Conflict</Badge>}
                      {isRestricted && <Badge variant="neutral">Read-only</Badge>}
                    </div>
                    <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-semibold)', margin: 'var(--space-1) 0 0', color: 'var(--text-primary)' }}>
                      {partDisplayTitle} · WO-561204
                    </h1>
                    <div className="work-order-detail-meta">
                      <span>{lineDisplayMeta}</span>
                    </div>
                  </div>

                  <div className="work-order-detail-header-actions">
                    <Button variant="outline" size="sm" onClick={handleDuplicate}>
                      Duplicate
                    </Button>
                    <SplitButton
                      variant="primary"
                      size="sm"
                      disabled={isRestricted || isSaving}
                      onClick={() => handleSaveWorkOrder('save')}
                      menu={
                        <div>
                          <MenuItem onClick={() => handleSaveWorkOrder('save-and-release')}>Save and release</MenuItem>
                          <MenuItem onClick={() => handleSaveWorkOrder('save')}>Save as Draft</MenuItem>
                          <MenuItem onClick={() => toast.info('Export traveller', 'Exporting PDF routing traveller #WO-561204.')}>
                            Export as PDF
                          </MenuItem>
                        </div>
                      }
                    >
                      {isSaving ? 'Saving…' : 'Save work order'}
                    </SplitButton>
                    {isSidebarCollapsed && (
                      <div className="work-order-detail-expand-slot">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ds-workbench-header-expand-btn ds-workbench-header-expand-btn--inspector"
                          onClick={() => setIsSidebarCollapsed(false)}
                          aria-expanded={false}
                          aria-label="Expand order lifecycle panel"
                          title="Expand Order Summary Panel"
                          style={{
                            padding: 'var(--space-1)',
                            color: 'var(--text-accent)',
                            backgroundColor: 'var(--surface-selected)',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          <SidebarRightExpandIcon />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              }
              sidebar={
                <div className="work-order-detail-sidebar">
                  {/* Status & Lifecycle Card */}
                  <div className="work-order-detail-card">
                    <div className="work-order-detail-card-header">
                      <div>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                          Lifecycle & Control State
                        </span>
                        <span style={{ display: 'block', fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-half)' }}>
                          Supervisory MES operational parameters
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Badge variant={currentOrderStatus === 'Released' ? 'success' : currentOrderStatus === 'On Hold' ? 'warning' : 'neutral'}>
                          {currentOrderStatus}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsSidebarCollapsed(true)}
                          aria-label="Collapse order summary panel"
                          title="Collapse Panel"
                          style={{ padding: 'var(--space-1)', color: 'var(--text-secondary)' }}
                        >
                          <SidebarRightCollapseIcon />
                        </Button>
                      </div>
                    </div>
                    <div className="work-order-detail-status-list">
                      <div className="work-order-detail-status-row">
                        <span className="work-order-detail-status-row-label">Operational state</span>
                        <Badge variant={currentOrderStatus === 'Released' ? 'success' : currentOrderStatus === 'On Hold' ? 'warning' : 'neutral'}>
                          {currentOrderStatus}
                        </Badge>
                      </div>
                      <div className="work-order-detail-status-row">
                        <span className="work-order-detail-status-row-label">Assigned planner</span>
                        <span className="work-order-detail-status-row-value">Anjali Deshmukh</span>
                      </div>
                      <div className="work-order-detail-status-row">
                        <span className="work-order-detail-status-row-label">Routing revision</span>
                        <span className="work-order-detail-status-row-value" style={{ fontFamily: 'var(--font-mono)' }}>
                          {currentRevision}
                        </span>
                      </div>
                      <div className="work-order-detail-status-row">
                        <span className="work-order-detail-status-row-label">Target takt</span>
                        <span className="work-order-detail-status-row-value" style={{ fontFamily: 'var(--font-mono)' }}>
                          138 s / pc
                        </span>
                      </div>
                      <div className="work-order-detail-status-row">
                        <span className="work-order-detail-status-row-label">Execution shift</span>
                        <span className="work-order-detail-status-row-value">Shift A · Cell 04</span>
                      </div>

                      <div style={{ paddingTop: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
                        {currentOrderStatus === 'On Hold' ? (
                          <Button
                            variant="primary"
                            size="md"
                            style={{ width: '100%' }}
                            disabled={isRestricted}
                            onClick={handleReleaseFromHold}
                          >
                            Release from line hold
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            size="md"
                            style={{ width: '100%' }}
                            disabled={isRestricted || isHolding}
                            onClick={() => setHoldDialogOpen(true)}
                          >
                            Place work order on hold
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Linked Evidence Card */}
                  <div className="work-order-detail-card">
                    <div className="work-order-detail-card-header">
                      <div>
                        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                          Linked Operational Evidence
                        </span>
                        <span style={{ display: 'block', fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-half)' }}>
                          Governed attachments & line telemetry
                        </span>
                      </div>
                      <Badge variant="neutral">3 records</Badge>
                    </div>
                    <div className="work-order-detail-evidence-list">
                      <div
                        role="button"
                        tabIndex={0}
                        className="work-order-detail-evidence-item"
                        onClick={() => toast.info('Drawings opened', 'Opening blueprint sheet DWG-4820-A rev 4.')}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toast.info('Drawings opened', 'Opening blueprint sheet DWG-4820-A rev 4.'); } }}
                      >
                        <div className="work-order-detail-evidence-top">
                          <span className="work-order-detail-evidence-title">Traveller & CAD Drawings</span>
                          <Badge variant="neutral">4 Sheets</Badge>
                        </div>
                        <p className="work-order-detail-evidence-desc">
                          Blueprint sheet DWG-4820-A rev 4 · Stamping die layout
                        </p>
                      </div>

                      <div
                        role="button"
                        tabIndex={0}
                        className="work-order-detail-evidence-item"
                        onClick={() => toast.info('Reservations', 'Material batch #CR4-8842 allocated in warehouse.')}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toast.info('Reservations', 'Material batch #CR4-8842 allocated in warehouse.'); } }}
                      >
                        <div className="work-order-detail-evidence-top">
                          <span className="work-order-detail-evidence-title">Material Reservations</span>
                          <Badge variant="success">Allocated</Badge>
                        </div>
                        <p className="work-order-detail-evidence-desc">
                          Coil batch #CR4-8842 allocated in warehouse Bay 2
                        </p>
                      </div>

                      <div
                        role="button"
                        tabIndex={0}
                        className="work-order-detail-evidence-item"
                        onClick={() => toast.info('Line telemetry', 'Navigating to Press Line P-2 real-time sensor view.')}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toast.info('Line telemetry', 'Navigating to Press Line P-2 real-time sensor view.'); } }}
                      >
                        <div className="work-order-detail-evidence-top">
                          <span className="work-order-detail-evidence-title">Line Sensor Telemetry</span>
                          <Badge variant="info">Live Stream</Badge>
                        </div>
                        <p className="work-order-detail-evidence-desc">
                          Press Line P-2 real-time hydraulic stroke telemetry
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                {/* Live Status Announcer */}
                <div
                  role="status"
                  aria-live="polite"
                  className={`work-order-detail-status-banner ${
                    isConflict
                      ? 'work-order-detail-status-banner--conflict'
                      : currentOrderStatus === 'On Hold'
                      ? 'work-order-detail-status-banner--hold'
                      : 'work-order-detail-status-banner--ready'
                  }`}
                >
                  <span>
                    <strong>Operational status:</strong> {orderStatusText}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    Policy POL-AUD-12 compliant
                  </span>
                </div>

                {/* Production Specifications Card */}
                <div className="work-order-detail-card">
                  <div className="work-order-detail-card-header">
                    <div>
                      <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', margin: 0, color: 'var(--text-primary)' }}>
                        Production Specifications & Routing Attributes
                      </h2>
                      <p style={{ margin: 'var(--space-half) 0 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                        Released quantities, stamping work centers, and commercial batch valuation.
                      </p>
                    </div>
                  </div>
                  <div className="work-order-detail-grid">
                    <div className="work-order-detail-metric">
                      <span className="work-order-detail-metric-label">Part identity</span>
                      <span className="work-order-detail-metric-value">{partDisplayTitle}</span>
                    </div>
                    <div className="work-order-detail-metric">
                      <span className="work-order-detail-metric-label">Batch planned quantity</span>
                      <span className="work-order-detail-metric-value work-order-detail-metric-value--mono">{currentQty}</span>
                    </div>
                    <div className="work-order-detail-metric">
                      <span className="work-order-detail-metric-label">Assigned work center</span>
                      <span className="work-order-detail-metric-value">Press Line P-2 · Stamping Cell 04</span>
                    </div>
                    <div className="work-order-detail-metric">
                      <span className="work-order-detail-metric-label">Commercial valuation</span>
                      <span className="work-order-detail-metric-value work-order-detail-metric-value--mono">{currentValue}</span>
                    </div>
                  </div>
                </div>

                {/* Detail Tabs Card */}
                <div className="work-order-detail-card">
                  <Tabs defaultValue="history">
                    <TabList>
                      <TabTrigger value="history">Audit Traceability ({auditLogs.length})</TabTrigger>
                      <TabTrigger value="operations">Routing Operations ({routingOps.length})</TabTrigger>
                      <TabTrigger value="compliance">Quality & Compliance (4)</TabTrigger>
                    </TabList>

                    {/* Tab 1: Audit History */}
                    <TabPanel value="history">
                      <div className="reference-assembly-data-surface" style={{ padding: 0 }}>
                        <Table density="compact" bordered>
                          <TableHeader>
                            <TableRow>
                              <TableHead style={{ width: '22%' }}>Timestamp (IST)</TableHead>
                              <TableHead style={{ width: '22%' }}>Actor</TableHead>
                              <TableHead style={{ width: '26%' }}>Action</TableHead>
                              <TableHead style={{ width: '15%' }}>Previous</TableHead>
                              <TableHead style={{ width: '15%' }}>Updated</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {auditLogs.map((log) => (
                              <TableRow key={log.id}>
                                <TableCell style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                                  {log.timestamp}
                                </TableCell>
                                <TableCell style={{ fontWeight: 'var(--weight-medium)' }}>
                                  {log.actor}
                                </TableCell>
                                <TableCell>
                                  <span>{log.action}</span>
                                </TableCell>
                                <TableCell style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                                  {log.previousValue}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={log.badgeVariant}>{log.badgeText}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabPanel>

                    {/* Tab 2: Routing Operations */}
                    <TabPanel value="operations">
                      <div className="reference-assembly-data-surface" style={{ padding: 0 }}>
                        <Table density="compact" bordered>
                          <TableHeader>
                            <TableRow>
                              <TableHead style={{ width: '10%' }}>Seq</TableHead>
                              <TableHead style={{ width: '35%' }}>Operation Name</TableHead>
                              <TableHead style={{ width: '25%' }}>Work Center</TableHead>
                              <TableHead style={{ width: '15%' }}>Standard Takt</TableHead>
                              <TableHead align="right" style={{ width: '15%' }}>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {routingOps.map((op) => (
                              <TableRow key={op.id}>
                                <TableCell style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-bold)' }}>
                                  {op.seq}
                                </TableCell>
                                <TableCell style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                                  {op.name}
                                </TableCell>
                                <TableCell style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                                  {op.workCenter}
                                </TableCell>
                                <TableCell style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                                  {op.standardTakt}
                                </TableCell>
                                <TableCell align="right">
                                  <Badge variant={op.statusVariant}>{op.status}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabPanel>

                    {/* Tab 3: Quality & Compliance */}
                    <TabPanel value="compliance">
                      <div className="reference-assembly-data-surface" style={{ padding: 0 }}>
                        <Table density="compact" bordered>
                          <TableHeader>
                            <TableRow>
                              <TableHead style={{ width: '20%' }}>Document Code</TableHead>
                              <TableHead style={{ width: '40%' }}>Standard Specification</TableHead>
                              <TableHead style={{ width: '25%' }}>Certifying Authority</TableHead>
                              <TableHead align="right" style={{ width: '15%' }}>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {BASE_QUALITY_RECORDS.map((qc) => (
                              <TableRow key={qc.id}>
                                <TableCell style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-bold)', color: 'var(--text-accent)' }}>
                                  {qc.documentCode}
                                </TableCell>
                                <TableCell style={{ fontWeight: 'var(--weight-medium)', color: 'var(--text-primary)' }}>
                                  {qc.title}
                                </TableCell>
                                <TableCell style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                                  {qc.authority}
                                </TableCell>
                                <TableCell align="right">
                                  <Badge variant={qc.statusVariant}>{qc.status}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TabPanel>
                  </Tabs>
                </div>
              </div>
            </SidebarLayout>
          </div>
        </AssemblyStateBoundary>

        {/* Line Hold Confirmation Modal Dialog */}
        {holdDialogOpen && (
          <div className="plant-settings-modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setHoldDialogOpen(false); }}>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="hold-dialog-title"
              className="plant-settings-modal-dialog"
            >
              <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: 'var(--border-hairline-subtle)' }}>
                <h2 id="hold-dialog-title" style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                  Place Work Order WO-561204 on Line Hold
                </h2>
                <p style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  Halts line-side takt dispatch and locks raw material reservations on Press Line P-2.
                </p>
              </div>

              <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ padding: 'var(--space-3)', border: 'var(--border-hairline) solid var(--text-warning)', borderRadius: 'var(--radius-md)', background: 'var(--status-warning-soft, var(--surface-raised))' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-warning)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--space-1)' }}>
                    Consequence Advisory
                  </span>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Placing this order on hold immediately flags Press Line P-2 in supervisory SCADA and suspends material transfer requests.
                  </p>
                </div>

                <div className="plant-settings-field-group">
                  <label htmlFor="hold-reason-select" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                    Engineering Hold Reason
                  </label>
                  <Select aria-label="Select option"
                    id="hold-reason-select"
                    value={holdReason}
                    onValueChange={(d) => setHoldReason(d.value)}
                    items={[
                      { label: 'Tooling Wear Boundary · Die clearance drift on Press P-2', value: 'tooling-wear' },
                      { label: 'Raw Material Variance · Coil thickness out of tolerance', value: 'material-variance' },
                      { label: 'Hydraulic Circuit Alert · Pressure fluctuation during stroke', value: 'hydraulic-alert' },
                      { label: 'Customer Engineering Change · Flange specification update', value: 'customer-ecn' },
                    ]}
                  />
                </div>

                <div className="plant-settings-field-group">
                  <label htmlFor="hold-remarks-input" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                    Supervisor Remarks & Root Cause Note
                  </label>
                  <Input aria-label="Enter containment rationale and required maintenance inspection"
                    id="hold-remarks-input"
                    placeholder="Enter containment rationale and required maintenance inspection..."
                    value={holdRemarks}
                    onChange={(e) => setHoldRemarks(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: 'var(--border-hairline-subtle)', background: 'var(--surface-raised)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                <Button size="sm" variant="outline" disabled={isHolding} onClick={() => setHoldDialogOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="danger" disabled={isHolding} onClick={handleExecuteHold}>
                  {isHolding ? 'Applying hold…' : 'Confirm Line Hold'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
};

// ==========================================
// 3. DASHBOARD REFERENCE ASSEMBLY
// ==========================================
const DASHBOARD_DATA = {
  '24h': {
    asOf: 'Today, 09:20 IST',
    kpis: [
      { label: 'Accepted output', value: '2,410 pcs', delta: '+4.2 % vs shift plan', isWarning: false, statusText: 'On plan' },
      { label: 'First-pass yield', value: '99.1 %', delta: '+0.5 pt', isWarning: false, statusText: 'Healthy' },
      { label: 'Open line alerts', value: '1 alert', delta: '-4 since shift start', isWarning: false, statusText: 'Normal' },
      { label: 'Cycle time', value: '138 s', delta: '-12 s vs standard', isWarning: false, statusText: 'Healthy' },
    ],
    trend: [
      { label: '00:00', value: 75 },
      { label: '04:00', value: 82 },
      { label: '08:00', value: 98 },
      { label: '12:00', value: 91 },
      { label: '16:00', value: 95 },
      { label: '20:00', value: 88 },
    ],
    categories: [
      { label: 'Press P-2', value: 120 },
      { label: 'HMC-04', value: 80 },
      { label: 'Assembly A-1', value: 41 },
    ],
    reviews: [
      { key: 'WO-561196', cat: 'Assembly A-2', owner: 'Meera Nair', status: 'Material at risk', variant: 'warning' as const },
    ],
  },
  '7d': {
    asOf: '24 Sep 2026, 18:00 IST',
    kpis: [
      { label: 'Accepted output', value: '14,820 pcs', delta: '+12.4 % vs last week', isWarning: false, statusText: 'On plan' },
      { label: 'First-pass yield', value: '98.6 %', delta: '+0.8 pt', isWarning: false, statusText: 'Healthy' },
      { label: 'Open line alerts', value: '3 alerts', delta: '-2 since yesterday', isWarning: true, statusText: 'Attention' },
      { label: 'Cycle time', value: '142 s', delta: '-18 s vs standard', isWarning: false, statusText: 'Healthy' },
    ],
    trend: [
      { label: 'Mon', value: 2100 },
      { label: 'Tue', value: 2250 },
      { label: 'Wed', value: 2400 },
      { label: 'Thu', value: 2150 },
      { label: 'Fri', value: 2380 },
      { label: 'Sat', value: 1840 },
      { label: 'Sun', value: 1700 },
    ],
    categories: [
      { label: 'Press Shop', value: 45 },
      { label: 'Machine Shop', value: 30 },
      { label: 'Assembly', value: 25 },
    ],
    reviews: [
      { key: 'WO-561196', cat: 'Assembly A-2', owner: 'Meera Nair', status: 'Material at risk', variant: 'warning' as const },
      { key: 'NC-4081', cat: 'Press P-2', owner: 'Shalini Rao', status: 'Disposition queued', variant: 'info' as const },
    ],
  },
  '30d': {
    asOf: '01 Sep to 24 Sep 2026',
    kpis: [
      { label: 'Accepted output', value: '62,400 pcs', delta: '+18.6 % vs target', isWarning: false, statusText: 'Above plan' },
      { label: 'First-pass yield', value: '97.9 %', delta: '-0.2 pt vs target', isWarning: true, statusText: 'Warning' },
      { label: 'Open line alerts', value: '5 alerts', delta: '+1 in backlog', isWarning: true, statusText: 'Attention' },
      { label: 'Cycle time', value: '149 s', delta: '+4 s vs standard', isWarning: false, statusText: 'Monitor' },
    ],
    trend: [
      { label: 'Week 1', value: 14200 },
      { label: 'Week 2', value: 15800 },
      { label: 'Week 3', value: 16100 },
      { label: 'Week 4', value: 16300 },
    ],
    categories: [
      { label: 'Press Shop', value: 52 },
      { label: 'Machine Shop', value: 28 },
      { label: 'Assembly', value: 20 },
    ],
    reviews: [
      { key: 'WO-561196', cat: 'Assembly A-2', owner: 'Meera Nair', status: 'Material at risk', variant: 'warning' as const },
      { key: 'NC-4081', cat: 'Press P-2', owner: 'Shalini Rao', status: 'Disposition queued', variant: 'info' as const },
      { key: 'PM-2044', cat: 'HMC-04', owner: 'Vikram Bhosale', status: 'Maintenance due', variant: 'neutral' as const },
    ],
  },
};

const DASHBOARD_SCENARIO_ITEMS = [
  { label: 'Complete data', value: 'complete' },
  { label: 'Module loading', value: 'module-loading' },
  { label: 'Module failure', value: 'module-error' },
  { label: 'Partial telemetry', value: 'partial' },
  { label: 'Restricted module', value: 'restricted-module' },
  { label: 'Empty priority queue', value: 'empty-queue' },
  { label: 'Stress: long content', value: 'stress-long-content' },
  { label: 'Stress: max priority rows', value: 'stress-max-priority' },
];

const DASHBOARD_ACTION_OUTCOME_ITEMS = [
  { label: 'Action succeeds', value: 'success' },
  { label: 'Service failure', value: 'failure' },
  { label: 'Permission denied', value: 'restricted' },
];

function getDashboardParam(name: string, fallback: string) {
  if (typeof window === 'undefined') return fallback;
  return new URLSearchParams(window.location.search).get(name) || fallback;
}

function getInitialAssemblyState(): AssemblyState {
  const state = getDashboardParam('assemblyState', 'ready');
  return ASSEMBLY_STATE_ITEMS.some((item) => item.value === state) ? (state as AssemblyState) : 'ready';
}

const maxPriorityRows = Array.from({ length: 50 }, (_, index) => {
  const base = DASHBOARD_DATA['30d'].reviews[index % DASHBOARD_DATA['30d'].reviews.length];
  return {
    ...base,
    key: `${base.key}-${String(index + 1).padStart(2, '0')}`,
    cat: `${base.cat} / escalation lane ${Math.floor(index / 10) + 1}`,
  };
});

export const DashboardExample: Story = {
  name: '3. Plant Operations Dashboard Candidate',
  render: () => {
    const toast = useToast();
    const [timeRange, setTimeRange] = useState<string[]>([getDashboardParam('range', '7d')]);
    const [dashboardScenario, setDashboardScenario] = useState<string[]>([getDashboardParam('dashboardScenario', 'complete')]);
    const [actionOutcome, setActionOutcome] = useState<string[]>([getDashboardParam('actionOutcome', 'success')]);
    const [isExporting, setIsExporting] = useState(false);
    const [reviewingId, setReviewingId] = useState<string | null>(null);
    const [assemblyState, setAssemblyState] = useState<AssemblyState>(getInitialAssemblyState());
    const currentKey = (timeRange[0] as keyof typeof DASHBOARD_DATA) || '7d';
    const currentData = DASHBOARD_DATA[currentKey] || DASHBOARD_DATA['7d'];
    const scenario = dashboardScenario[0] || 'complete';
    const stressTrend = Array.from({ length: 31 }, (_, index) => ({
      label: `D${index + 1}`,
      value: 1700 + ((index * 137) % 820),
    }));
    const stressCategories = Array.from({ length: 12 }, (_, index) => ({
      label: `Production area ${index + 1}`,
      value: 8 + ((index * 7) % 42),
    }));
    const longContentReviews = currentData.reviews.map((review) => ({
      ...review,
      cat: `${review.cat} with line-side quality containment, shortage risk, and replan dependency`,
      owner: `${review.owner} / Shift escalation owner for Suryodaya Autocomp Chakan PL-04`,
      status: `${review.status} - supervisor decision needed before next takt review`,
    }));
    const displayedTrend =
      scenario === 'stress-max-priority'
        ? stressTrend
        : scenario === 'partial'
          ? currentData.trend.slice(0, Math.max(1, currentData.trend.length - 2))
          : currentData.trend;
    const displayedCategories =
      scenario === 'stress-max-priority'
        ? stressCategories
        : scenario === 'partial'
          ? currentData.categories.slice(0, 2)
          : currentData.categories;
    const displayedReviews =
      scenario === 'stress-max-priority'
        ? maxPriorityRows
        : scenario === 'stress-long-content'
          ? longContentReviews
          : currentData.reviews;

    const finishGovernedAction = (action: 'export' | 'review', recordId?: string) => {
      const outcome = actionOutcome[0] || 'success';
      window.setTimeout(() => {
        if (action === 'export') setIsExporting(false);
        if (action === 'review') setReviewingId(null);

        if (outcome === 'restricted') {
          toast.error('Permission required', `${action === 'export' ? 'Snapshot export' : `Review of ${recordId}`} requires the Plant Supervisor role. No data was changed.`);
          return;
        }
        if (outcome === 'failure') {
          toast.error(`${action === 'export' ? 'Export' : 'Review'} unavailable`, 'The service did not respond. The dashboard remains current; retry when connectivity is restored.');
          return;
        }
        if (action === 'export') {
          toast.success('Snapshot exported', 'The PDF was generated and the export event was recorded in the plant audit log.');
        } else {
          toast.success('Review opened', `${recordId} was opened without changing its workflow state.`);
        }
      }, 600);
    };

    const handleExport = () => {
      if (isExporting) return;
      flushSync(() => {
        setIsExporting(true);
      });
      finishGovernedAction('export');
    };

    const handleReview = (recordId: string) => {
      if (reviewingId) return;
      setReviewingId(recordId);
      finishGovernedAction('review', recordId);
    };

    return (
      <>
        <AssemblyStateHarness id="plant-operations-dashboard" state={assemblyState} onChange={setAssemblyState}>
          <div style={{ minWidth: 'calc(var(--sidebar-w-collapsed) * 3)' }}>
            <Select
              aria-label="Simulate dashboard module scenario"
              size="sm"
              value={dashboardScenario}
              onValueChange={(detail) => setDashboardScenario(detail.value)}
              items={DASHBOARD_SCENARIO_ITEMS}
            />
          </div>
          <div style={{ minWidth: 'calc(var(--sidebar-w-collapsed) * 3)' }}>
            <Select
              aria-label="Simulate governed action outcome"
              size="sm"
              value={actionOutcome}
              onValueChange={(detail) => setActionOutcome(detail.value)}
              items={DASHBOARD_ACTION_OUTCOME_ITEMS}
            />
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>Dashboard-only inspection controls; remove on adoption.</span>
        </AssemblyStateHarness>
        <AssemblyStateBoundary state={assemblyState} subject="plant operations dashboard" onRetry={() => setAssemblyState('ready')}>
          <DashboardLayout
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-accent)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>
                  Suryodaya Autocomp - Chakan PL-04 - Candidate
                </span>
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)' }}>-</span>
                <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  As of {currentData.asOf}
                </span>
              </div>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-semibold)', margin: 'var(--space-1) 0 var(--space-half)', color: 'var(--text-primary)' }}>
                Plant operations overview
              </h1>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Output, quality, line alerts, and priority actions across the current production horizon.
              </p>
            </div>
            <CommandToolbarGroup
              viewControls={
                <SegmentedControl
                  aria-label="Dashboard time range"
                  value={timeRange[0] || '7d'}
                  onChange={(val) => {
                    setTimeRange([val]);
                    toast.info('Dashboard Scope Updated', `Interval set to ${val === '24h' ? 'Past 24 Hours' : val === '7d' ? 'Past 7 Days' : 'Past 30 Days'}`);
                  }}
                  options={[
                    { value: '24h', label: 'Past 24h' },
                    { value: '7d', label: 'Past 7d' },
                    { value: '30d', label: 'Past 30d' },
                  ]}
                />
              }
              actionControls={
                <Button
                  size="sm"
                  variant="primary"
                  isLoading={isExporting}
                  loadingText="Exporting snapshot"
                  onClick={handleExport}
                >
                  {isExporting ? 'Exporting snapshot' : 'Export snapshot (PDF)'}
                </Button>
              }
            />
          </div>
        }
        kpiRow={
          <>
            {currentData.kpis.map((kpi, idx) => (
              <Card key={idx} padding="md">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontWeight: 'var(--weight-medium)' }}>{kpi.label}</span>
                  <Badge variant={kpi.isWarning ? 'warning' : 'neutral'}>
                    {kpi.statusText}
                  </Badge>
                </div>
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)', margin: 'var(--space-2) 0 var(--space-1)', color: 'var(--text-primary)' }}>{kpi.value}</p>
                <div style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--weight-semibold)', color: kpi.isWarning ? 'var(--text-warning)' : 'var(--text-success)' }}>
                  {kpi.delta}
                </div>
              </Card>
            ))}
          </>
        }
      >
        {scenario === 'partial' && (
          <DashboardWidget colSpan={12} title="Partial telemetry">
            <div role="status" style={{ color: 'var(--text-warning)' }}>
              Assembly A-1 and the two most recent output intervals are unavailable. Available values remain visible and are not estimated.
            </div>
          </DashboardWidget>
        )}
        <DashboardWidget
          colSpan={8}
          title="Accepted output trend"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.info('Navigating to Trend Details', 'Opening time-series analytics workspace...')}
            >
               View output details &gt;
            </Button>
          }
        >
          <div style={{ padding: 'var(--space-2) 0' }}>
            <LineChart
              data={displayedTrend}
              height={220}
              xKey="label"
              yKey="value"
              unit=" units"
            />
            <AccessibleDataTable data={displayedTrend} valueHeading="Accepted output" unit=" pcs" />
          </div>
        </DashboardWidget>

        <DashboardWidget
          colSpan={4}
          title="Output by production area"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.info('Navigating to Category Breakdown', 'Opening category allocation workspace...')}
            >
              Breakdown &gt;
            </Button>
          }
          isLoading={scenario === 'module-loading'}
          isError={scenario === 'module-error'}
          errorMessage="Assembly A-1 telemetry is unavailable. Other plant modules remain current."
        >
          {scenario === 'restricted-module' ? (
            <EmptyState
              title="Production-area output restricted"
              description="Your current plant role can view aggregate KPIs but not line-level output allocation."
              secondaryAction={<Button variant="outline" size="sm">Request access</Button>}
            />
          ) : (
            <div style={{ padding: 'var(--space-2) 0' }}>
              <BarChart
                data={displayedCategories}
                height={220}
                showValues={true}
                showTooltip={false}
              />
              <AccessibleDataTable data={displayedCategories} valueHeading="Share" unit=" %" />
            </div>
          )}
        </DashboardWidget>

        <DashboardWidget
          colSpan={12}
          title={`Priority actions (${scenario === 'empty-queue' ? 0 : displayedReviews.length})`}
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.info('Navigating to Record Register', 'Opening Collection Workspace (/records)...')}
            >
               Open work order register &gt;
            </Button>
          }
        >
          {scenario === 'empty-queue' ? (
            <EmptyState
              title="No priority actions"
              description="No production exceptions require supervisor review for this horizon."
              primaryAction={<Button variant="outline" size="sm" onClick={() => setTimeRange(['30d'])}>Review past 30 days</Button>}
            />
          ) : <>
          <div className="dashboard-priority-table">
          <Table density="compact" bordered>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead align="right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedReviews.map((rev) => (
                <TableRow key={rev.key}>
                  <TableCell style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-semibold)' }}>{rev.key}</TableCell>
                  <TableCell>{rev.cat}</TableCell>
                  <TableCell>{rev.owner}</TableCell>
                  <TableCell><Badge variant={rev.variant}>{rev.status}</Badge></TableCell>
                  <TableCell align="right">
                    <Button
                      size="sm"
                      variant="outline"
                      isLoading={reviewingId === rev.key}
                      loadingText={`Opening review for ${rev.key}`}
                      disabled={reviewingId !== null && reviewingId !== rev.key}
                      onClick={() => handleReview(rev.key)}
                    >
                      {reviewingId === rev.key ? 'Opening review' : 'Review'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          <div className="dashboard-priority-list" aria-label="Priority actions">
            {displayedReviews.map((rev) => (
              <article key={rev.key} className="dashboard-priority-card">
                <div className="dashboard-priority-card__heading">
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-semibold)' }}>{rev.key}</span>
                  <Badge variant={rev.variant}>{rev.status}</Badge>
                </div>
                <p>{rev.cat} - Owner: {rev.owner}</p>
                <Button
                  size="sm"
                  variant="outline"
                  isLoading={reviewingId === rev.key}
                  loadingText={`Opening review for ${rev.key}`}
                  disabled={reviewingId !== null && reviewingId !== rev.key}
                  onClick={() => handleReview(rev.key)}
                >
                  {reviewingId === rev.key ? 'Opening review' : `Review ${rev.key}`}
                </Button>
              </article>
            ))}
          </div>
          </>}
        </DashboardWidget>
          </DashboardLayout>
        </AssemblyStateBoundary>
      </>
    );
  },
};

// ==========================================
// 4. FORM REFERENCE ASSEMBLY
// ==========================================
const MAINTENANCE_FORM_SCENARIO_ITEMS = [
  { label: 'Ready with realistic values', value: 'ready' },
  { label: 'Pristine empty form', value: 'pristine' },
  { label: 'Missing required title', value: 'invalid-title' },
  { label: 'Invalid cost value', value: 'invalid-cost' },
  { label: 'Draft recovery', value: 'draft-recovery' },
  { label: 'Long content stress', value: 'stress-long-content' },
];

const MAINTENANCE_SUBMIT_OUTCOME_ITEMS = [
  { label: 'Success', value: 'success' },
  { label: 'Service failure', value: 'failure' },
  { label: 'Partial dispatch', value: 'partial' },
  { label: 'Unknown outcome', value: 'unknown' },
];

const MAINTENANCE_DRAFT_OUTCOME_ITEMS = [
  { label: 'Draft saved', value: 'success' },
  { label: 'Draft service failure', value: 'failure' },
];

function initialMaintenanceFormValues(scenario: string) {
  if (scenario === 'pristine' || scenario === 'invalid-title') {
    return { title: '', cost: '' };
  }
  if (scenario === 'invalid-cost') {
    return { title: 'Replace HMC-04 spindle coolant pump', cost: '-25000' };
  }
  if (scenario === 'draft-recovery') {
    return { title: 'Recover draft for HMC-04 coolant-pump request', cost: '150000' };
  }
  if (scenario === 'stress-long-content') {
    return {
      title: 'Replace HMC-04 spindle coolant pump assembly after repeated thermal overload, vibration alarm, and coolant-pressure loss during third-shift production',
      cost: '9876543',
    };
  }
  return { title: 'Replace HMC-04 spindle coolant pump', cost: '150000' };
}

function parseMaintenanceCost(value: string) {
  const normalized = value.replace(/[,\s₹]/g, '');
  if (!normalized) return { valid: true, parsed: null };
  if (!/^\d+$/.test(normalized)) return { valid: false, parsed: null };
  const parsed = Number(normalized);
  if (!Number.isSafeInteger(parsed) || parsed < 0 || parsed > 10000000) return { valid: false, parsed: null };
  return { valid: true, parsed };
}

export const FormExample: Story = {
  name: '4. Maintenance Request Form Candidate',
  render: () => {
    const toast = useToast();
    const [formScenario, setFormScenario] = useState<string[]>([getDashboardParam('formScenario', 'ready')]);
    const initialValues = initialMaintenanceFormValues(formScenario[0]);
    const [itemName, setItemName] = useState(initialValues.title);
    const [category, setCategory] = useState<string[]>(['corrective']);
    const [estimatedValue, setEstimatedValue] = useState(initialValues.cost);
    const [immediateVerification, setImmediateVerification] = useState(true);
    const [notifyOwner, setNotifyOwner] = useState(true);
    const [itemNameError, setItemNameError] = useState<string | null>(formScenario[0] === 'invalid-title' ? 'Enter a maintenance request title.' : null);
    const [costError, setCostError] = useState<string | null>(formScenario[0] === 'invalid-cost' ? 'Enter a whole INR amount from 0 to 1,00,00,000.' : null);
    const [submissionMode, setSubmissionMode] = useState<string[]>([getDashboardParam('submitOutcome', 'success')]);
    const [draftMode, setDraftMode] = useState<string[]>([getDashboardParam('draftOutcome', 'success')]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [operationStatus, setOperationStatus] = useState(formScenario[0] === 'draft-recovery' ? 'Recovered draft loaded. Review entries before dispatch.' : 'Ready for maintenance request entry.');
    const [assemblyState, setAssemblyState] = useState<AssemblyState>(getInitialAssemblyState());

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const parsedCost = parseMaintenanceCost(estimatedValue);
      if (!itemName.trim()) {
        setItemNameError('Enter a maintenance request title.');
        setOperationStatus('Submission blocked by validation. Enter a request title.');
        toast.error('Request not submitted', 'Enter a title, then submit the maintenance request again.');
        return;
      }
      if (!parsedCost.valid) {
        setCostError('Enter a whole INR amount from 0 to 1,00,00,000.');
        setOperationStatus('Submission blocked by validation. Correct the estimated cost.');
        toast.error('Request not submitted', 'Correct the estimated cost, then submit the maintenance request again.');
        return;
      }
      if (isSubmitting) return;
      setItemNameError(null);
      setCostError(null);
      const catLabel = category[0] === 'corrective' ? 'Corrective maintenance' : category[0] === 'preventive' ? 'Preventive maintenance' : 'Safety inspection';
      const snapshot = { itemName, catLabel, estimatedValue: parsedCost.parsed };
      flushSync(() => {
        setIsSubmitting(true);
        setOperationStatus('Submitting maintenance request. Duplicate submissions are blocked.');
      });
      window.setTimeout(() => {
        setIsSubmitting(false);
        if (submissionMode[0] === 'failure') {
          setOperationStatus('Submission failed. Entries are preserved for retry.');
          toast.error('Request not submitted', 'The maintenance service did not respond. Your entries are preserved; try again.');
          return;
        }
        if (submissionMode[0] === 'partial') {
          setOperationStatus('Partial dispatch recorded. Diagnostics are queued, but planner notification needs retry.');
          toast.warning('Maintenance request partially submitted', 'Diagnostics were queued, but planner notification failed. Retry notification before closing.');
          return;
        }
        if (submissionMode[0] === 'unknown') {
          setOperationStatus('Submission outcome unknown. Check the maintenance queue before submitting again.');
          toast.warning('Submission outcome unknown', 'Check the maintenance queue before submitting again. Your entries are preserved.');
          return;
        }
        setOperationStatus('Maintenance request submitted successfully.');
        toast.success('Maintenance request submitted', `${snapshot.itemName} · ${snapshot.catLabel} · estimated ₹${Number(snapshot.estimatedValue || 0).toLocaleString('en-IN')}`);
      }, 600);
    };

    const handleSaveDraft = () => {
      if (isSavingDraft) return;
      flushSync(() => {
        setIsSavingDraft(true);
        setOperationStatus('Saving maintenance request draft.');
      });
      window.setTimeout(() => {
        setIsSavingDraft(false);
        if (draftMode[0] === 'failure') {
          setOperationStatus('Draft save failed. Entries are preserved locally.');
          toast.error('Draft not saved', 'The draft service did not respond. Entries remain on screen; try again.');
          return;
        }
        setOperationStatus('Draft saved. The maintenance request remains editable and has not been dispatched.');
        toast.info('Draft saved', 'The maintenance request remains editable and has not been dispatched.');
      }, 350);
    };

    const handleReset = () => {
      setItemName('');
      setCategory(['corrective']);
      setEstimatedValue('');
      setItemNameError(null);
      setCostError(null);
      setOperationStatus('Form cleared. No maintenance request was submitted.');
      toast.info('Form cleared', 'No maintenance request was submitted.');
    };

    return (
      <>
        <AssemblyStateHarness id="maintenance-request-form" state={assemblyState} onChange={setAssemblyState}>
          <Select
            aria-label="Maintenance form scenario"
            value={formScenario}
            onValueChange={(detail) => {
              const nextScenario = detail.value[0] || 'ready';
              const nextValues = initialMaintenanceFormValues(nextScenario);
              setFormScenario(detail.value);
              setItemName(nextValues.title);
              setEstimatedValue(nextValues.cost);
              setItemNameError(nextScenario === 'invalid-title' ? 'Enter a maintenance request title.' : null);
              setCostError(nextScenario === 'invalid-cost' ? 'Enter a whole INR amount from 0 to 1,00,00,000.' : null);
              setOperationStatus(nextScenario === 'draft-recovery' ? 'Recovered draft loaded. Review entries before dispatch.' : 'Ready for maintenance request entry.');
            }}
            items={MAINTENANCE_FORM_SCENARIO_ITEMS}
          />
          <Select
            aria-label="Next submit outcome"
            value={submissionMode}
            onValueChange={(detail) => setSubmissionMode(detail.value)}
            items={MAINTENANCE_SUBMIT_OUTCOME_ITEMS}
          />
          <Select
            aria-label="Next draft outcome"
            value={draftMode}
            onValueChange={(detail) => setDraftMode(detail.value)}
            items={MAINTENANCE_DRAFT_OUTCOME_ITEMS}
          />
        </AssemblyStateHarness>
        <AssemblyStateBoundary state={assemblyState} subject="maintenance request form" onRetry={() => setAssemblyState('ready')}>
          <form onSubmit={handleSubmit}>
            <SingleColumnLayout
          contentWidth="md"
          header={
            <div>
              <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-accent)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>
                Chakan plant PL-04 · Candidate reference assembly
              </span>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-semibold)', margin: 'var(--space-1) 0 0', color: 'var(--text-primary)' }}>
                Create maintenance request
              </h1>
              <p style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Record the equipment issue, classify the work, and dispatch it to maintenance planning.
              </p>
            </div>
          }
          actions={
            <CommandToolbarGroup
              actionControls={
                <div className="maintenance-form-actions">
                  <Button type="button" variant="ghost" onClick={handleReset}>Cancel</Button>
                  <Button type="button" variant="outline" isLoading={isSavingDraft} loadingText="Saving draft" disabled={isSubmitting} onClick={handleSaveDraft}>
                    {isSavingDraft ? 'Saving draft' : 'Save as Draft'}
                  </Button>
                  <Button type="submit" variant="primary" isLoading={isSubmitting} loadingText="Submitting request" disabled={isSubmitting || isSavingDraft}>
                    {isSubmitting ? 'Submitting request' : 'Submit request'}
                  </Button>
                </div>
              }
            />
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div role="status" aria-live="polite" className="maintenance-form-status">
              {operationStatus}
            </div>
            <Card>
              <CardHeader>
                <CardTitle as="h2">1. Request details</CardTitle>
                <CardDescription>Identify the affected equipment and maintenance classification.</CardDescription>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div>
                  <label htmlFor="maintenance-title" style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)' }}>
                    Request title <span style={{ color: 'var(--text-critical)' }} aria-hidden="true">*</span>
                  </label>
                  <Input aria-label="e.g. Replace HMC-04 spindle coolant pump"
                    id="maintenance-title"
                    required
                    aria-describedby="maintenance-title-help"
                    placeholder="e.g. Replace HMC-04 spindle coolant pump"
                    value={itemName}
                    onChange={(e) => {
                      setItemName(e.target.value);
                      if (itemNameError) setItemNameError(null);
                    }}
                    isInvalid={Boolean(itemNameError)}
                    errorMessage={itemNameError || undefined}
                  />
                  <p id="maintenance-title-help" className="maintenance-form-help">Use a specific equipment and fault summary; avoid personal or customer data.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, calc(var(--container-sm) / 3)), 1fr))', gap: 'var(--space-4)' }}>
                  <div>
                    <span id="story-referenceassemblies-2129" style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)' }}>
                      Maintenance class <span style={{ color: 'var(--text-critical)' }} aria-hidden="true">*</span>
                    </span>
                    <Select aria-labelledby="story-referenceassemblies-2129" aria-label="Select option"
                      value={category}
                      onValueChange={(d) => {
                        setCategory(d.value);
                        toast.info('Category Selected', `Changed scope to ${d.items?.[0]?.label || d.value.join(', ')}`);
                      }}
                      items={[
                        { label: 'Corrective maintenance', value: 'corrective' },
                        { label: 'Preventive maintenance', value: 'preventive' },
                        { label: 'Safety inspection', value: 'safety' },
                      ]}
                    />
                  </div>
                  <div>
                    <label htmlFor="maintenance-cost" style={{ display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', marginBottom: 'var(--space-2)' }}>
                      Estimated cost (INR)
                    </label>
                    <Input aria-label="e.g. 150000"
                      placeholder="e.g. 150000"
                      id="maintenance-cost"
                      inputMode="numeric"
                      value={estimatedValue}
                      onChange={(e) => {
                        setEstimatedValue(e.target.value);
                        if (costError) setCostError(null);
                      }}
                      isInvalid={Boolean(costError)}
                      errorMessage={costError || undefined}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Dispatch options</CardTitle>
                <CardDescription>Choose the checks and notifications created with this request.</CardDescription>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Switch
                    label="Run equipment diagnostics"
                    description="Queue HMC-04 vibration and coolant-pressure checks after dispatch."
                    checked={immediateVerification}
                    onChange={(checked) => setImmediateVerification(checked)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Switch
                    label="Notify maintenance planner"
                    description="Send the dispatch confirmation to Vikram Bhosale."
                    checked={notifyOwner}
                    onChange={(checked) => setNotifyOwner(checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
            </SingleColumnLayout>
          </form>
        </AssemblyStateBoundary>
      </>
    );
  },
};

// ==========================================
// 5. SETTINGS REFERENCE ASSEMBLY
// ==========================================
type SettingsSection = 'general' | 'access' | 'notifications' | 'integrations' | 'logs';

const PLANT_SETTINGS_SECTIONS: { id: SettingsSection; label: string; count?: number; alert?: boolean }[] = [
  { id: 'general', label: 'Regional defaults' },
  { id: 'access', label: 'Access and roles', count: 5 },
  { id: 'notifications', label: 'Alert channels' },
  { id: 'integrations', label: 'Integrations', alert: true },
  { id: 'logs', label: 'Audit and logs' },
];

const PLANT_SETTINGS_SCENARIO_ITEMS = [
  { label: 'Ready (default configuration)', value: 'ready' },
  { label: 'Unsaved modifications pending', value: 'dirty' },
  { label: 'Restricted section access', value: 'restricted-section' },
  { label: 'Concurrent modification conflict', value: 'concurrent-conflict' },
  { label: 'Long content stress', value: 'stress-long-content' },
  { label: 'High density configuration', value: 'high-density' },
];

const PLANT_SETTINGS_SAVE_OUTCOME_ITEMS = [
  { label: 'Save success', value: 'success' },
  { label: 'Service failure (retryable)', value: 'failure' },
  { label: 'Re-authentication required', value: 'reauth-required' },
  { label: 'Save outcome unknown', value: 'unknown' },
];

const PLANT_SETTINGS_ROTATION_OUTCOME_ITEMS = [
  { label: 'Rotation success', value: 'success' },
  { label: 'Rotation failure (rollback)', value: 'failure' },
  { label: 'Re-authentication failed', value: 'reauth-failed' },
  { label: 'Rotation outcome unknown', value: 'unknown' },
];

interface PlantUserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  roleVariant: 'info' | 'neutral';
  status: string;
  statusVariant: 'success' | 'warning' | 'danger';
  lastActive: string;
}

const BASE_PLANT_USERS: PlantUserRecord[] = [
  { id: 'USR-01', name: 'Anjali Deshmukh', email: 'anjali.deshmukh@suryodaya.co.in', role: 'Plant Admin', roleVariant: 'info', status: 'Active', statusVariant: 'success', lastActive: '2026-09-25 10:15' },
  { id: 'USR-02', name: 'Vikram Bhosale', email: 'vikram.bhosale@suryodaya.co.in', role: 'Shift Supervisor', roleVariant: 'neutral', status: 'Active', statusVariant: 'success', lastActive: '2026-09-25 09:40' },
  { id: 'USR-03', name: 'Meera Nair', email: 'meera.nair@suryodaya.co.in', role: 'Quality Auditor', roleVariant: 'neutral', status: 'Invited', statusVariant: 'warning', lastActive: '—' },
  { id: 'USR-04', name: 'Sandeep Kulkarni', email: 'sandeep.kulkarni@suryodaya.co.in', role: 'Maintenance Lead', roleVariant: 'info', status: 'Active', statusVariant: 'success', lastActive: '2026-09-24 16:30' },
  { id: 'USR-05', name: 'Rajeshwari Iyer', email: 'rajeshwari.iyer@suryodaya.co.in', role: 'Process Engineer', roleVariant: 'neutral', status: 'Active', statusVariant: 'success', lastActive: '2026-09-23 11:20' },
];

function getPlantScenarioUsers(scenario: string): PlantUserRecord[] {
  if (scenario === 'high-density') {
    return Array.from({ length: 12 }, (_, index) => {
      const base = BASE_PLANT_USERS[index % BASE_PLANT_USERS.length];
      return {
        id: `USR-${String(index + 1).padStart(2, '0')}`,
        name: `${base.name} ${index >= 5 ? `(#${index + 1})` : ''}`.trim(),
        email: `usr${index + 1}.${base.email}`,
        role: base.role,
        roleVariant: base.roleVariant,
        status: index % 4 === 3 ? 'Suspended' : base.status,
        statusVariant: index % 4 === 3 ? 'danger' : base.statusVariant,
        lastActive: base.lastActive === '—' ? '—' : `2026-09-${String(20 + (index % 6)).padStart(2, '0')} 10:00`,
      };
    });
  }
  if (scenario === 'stress-long-content') {
    return [
      {
        id: 'USR-01',
        name: 'Dr. Chandrasekhar Venkata Raman-Krishnamurthy',
        email: 'chandrasekhar.venkata.raman.krishnamurthy@suryodaya-automotive-components-maharashtra.co.in',
        role: 'Cross-Functional Multi-Plant Operations & Statutory Environmental Compliance Director',
        roleVariant: 'info',
        status: 'Active',
        statusVariant: 'success',
        lastActive: '2026-09-25 10:15',
      },
      ...BASE_PLANT_USERS.slice(1),
    ];
  }
  return BASE_PLANT_USERS;
}

interface ConnectedServiceRecord {
  id: string;
  name: string;
  protocol: string;
  status: string;
  statusVariant: 'success' | 'warning' | 'danger';
  latency: string;
}

const BASE_CONNECTED_SERVICES: ConnectedServiceRecord[] = [
  { id: 'srv-1', name: 'Cloud Object Storage (Telemetry Raw)', protocol: 'S3 / REST', status: 'Connected', statusVariant: 'success', latency: '18 ms' },
  { id: 'srv-2', name: 'Enterprise SSO Identity Provider', protocol: 'OIDC / SAML 2.0', status: 'Connected', statusVariant: 'success', latency: '42 ms' },
  { id: 'srv-3', name: 'Downstream Telemetry Sink (Kafka / TLS)', protocol: 'Kafka 3.4 / TLS', status: 'Degraded Latency', statusVariant: 'warning', latency: '184 ms' },
  { id: 'srv-4', name: 'Industrial IoT Edge Gateway (Chakan Line 2)', protocol: 'MQTT / TLS', status: 'Connected', statusVariant: 'success', latency: '12 ms' },
];

function getPlantScenarioServices(scenario: string): ConnectedServiceRecord[] {
  if (scenario === 'high-density') {
    return [
      ...BASE_CONNECTED_SERVICES,
      { id: 'srv-5', name: 'MES Production Schedule Bus', protocol: 'AMQP / RabbitMQ', status: 'Connected', statusVariant: 'success', latency: '24 ms' },
      { id: 'srv-6', name: 'Statutory Pollution Monitoring Link', protocol: 'HTTPS / JSON-RPC', status: 'Connected', statusVariant: 'success', latency: '65 ms' },
    ];
  }
  return BASE_CONNECTED_SERVICES;
}

const RETENTION_POLICY_OPTIONS = [
  { label: '30 days — Policy POL-OPS-04: Operational Diagnostics & Scada Cache', value: '30d' },
  { label: '90 days — Policy POL-AUD-12: IATF 16949 / ISO 9001 Quality Audit Schedule', value: '90d' },
  { label: '365 days — Policy POL-SEC-08: Statutory Environmental & Energy Compliance', value: '365d' },
  { label: '2555 days (7 yr) — Policy POL-LEG-01: Permanent Safety & Structural Integrity Archive', value: '2555d' },
];

export const SettingsExample: Story = {
  name: '5. Plant Settings Candidate',
  render: () => {
    const toast = useToast();
    const initialSection = (getDashboardParam('settingsSection', 'general') as SettingsSection) || 'general';
    const [activeSection, setActiveSection] = useState<SettingsSection>(initialSection);
    const [settingsScenario, setSettingsScenario] = useState<string[]>([getDashboardParam('settingsScenario', 'ready')]);
    const [saveOutcome, setSaveOutcome] = useState<string[]>([getDashboardParam('saveOutcome', 'success')]);
    const [rotationOutcome, setRotationOutcome] = useState<string[]>([getDashboardParam('rotationOutcome', 'success')]);
    const [assemblyState, setAssemblyState] = useState<AssemblyState>(getInitialAssemblyState());
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);

    const isDirtyScenario = settingsScenario[0] === 'dirty';
    const isRestrictedScenario = settingsScenario[0] === 'restricted-section';
    const isConflictScenario = settingsScenario[0] === 'concurrent-conflict';

    // General preferences state
    const [timezone, setTimezone] = useState<string[]>(['IST']);
    const [currency, setCurrency] = useState<string[]>(['INR']);
    const [shiftModel, setShiftModel] = useState<string[]>(['3-shift']);

    // Access control state
    const scenarioUsers = getPlantScenarioUsers(settingsScenario[0]);
    const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
    const [inviteName, setInviteName] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<string[]>(['Shift Supervisor']);
    const [customUsers, setCustomUsers] = useState<PlantUserRecord[]>([]);
    const [userSearchQuery, setUserSearchQuery] = useState('');

    const allUsers = [...customUsers, ...scenarioUsers];
    const filteredUsers = allUsers.filter((u) => {
      const q = userSearchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });

    const handleSendInvitation = () => {
      const trimmedName = inviteName.trim();
      const trimmedEmail = inviteEmail.trim();
      if (!trimmedName || !trimmedEmail) {
        toast.warning('Incomplete invitation', 'Provide both personnel name and corporate email.');
        return;
      }
      const roleStr = inviteRole[0] || 'Shift Supervisor';
      const roleVariant = roleStr.includes('Admin') ? 'info' : roleStr.includes('Lead') ? 'info' : 'neutral';
      const newUser: PlantUserRecord = {
        id: `USR-${String(allUsers.length + 1).padStart(2, '0')}`,
        name: trimmedName,
        email: trimmedEmail,
        role: roleStr,
        roleVariant,
        status: 'Invited',
        statusVariant: 'warning',
        lastActive: '—',
      };
      setCustomUsers((prev) => [newUser, ...prev]);
      setInviteDialogOpen(false);
      setInviteName('');
      setInviteEmail('');
      setSettingsStatus(`Invitation dispatched for ${trimmedName}. One-time authentication voucher logged to security ledger.`);
      toast.success('Invitation sent', `${trimmedName} invited with ${roleStr} privileges.`);
    };

    // Notifications state
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(false);
    const [webhookAlerts, setWebhookAlerts] = useState(true);
    const [pagerEscalation, setPagerEscalation] = useState(true);

    // Integrations state
    const initialWebhookUrl = settingsScenario[0] === 'stress-long-content'
      ? 'https://telemetry-gateway.internal.suryodaya.co.in:8443/v2/plants/in-mh-pn-chakan-pl04/security/event-stream/subscribers/inbound-dispatch-sink'
      : 'https://events.example.invalid/v1/plant-alerts';
    const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);
    const [keyFingerprint, setKeyFingerprint] = useState('SHA256:7A:19:4E:5D:89:C2:F1:B2:34:E8:90:12:AA:BC:DE:F0');
    const [activeKeyVoucher, setActiveKeyVoucher] = useState<string | null>(null);
    const [rotationDialogOpen, setRotationDialogOpen] = useState(false);
    const [rotationPasscode, setRotationPasscode] = useState('');
    const [acknowledgeRisk, setAcknowledgeRisk] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const services = getPlantScenarioServices(settingsScenario[0]);

    // Logs state
    const [retention, setRetention] = useState<string[]>(['90d']);
    const [logLevel, setLogLevel] = useState<string[]>(['INFO']);

    // Operational status & in-flight states
    const [isSaving, setIsSaving] = useState(false);
    const [settingsStatus, setSettingsStatus] = useState(
      isConflictScenario
        ? 'Concurrent modification detected. Configuration revision #REV-4089 was committed by Sandeep Kulkarni at 10:14 IST. Review diff before overwriting.'
        : isDirtyScenario
        ? 'Unsaved modifications pending. Review parameters before dispatching save.'
        : 'Plant platform settings ready. All 5 operational domains synchronized with plant registry.'
    );

    const handleSaveSection = (sectionName: string) => {
      if (isSaving) return;
      flushSync(() => {
        setIsSaving(true);
      });
      setSettingsStatus(`Saving ${sectionName} settings. In-flight request dispatched to PL-04 registry.`);
      window.setTimeout(() => {
        setIsSaving(false);
        if (saveOutcome[0] === 'failure') {
          setSettingsStatus(`Save failed for ${sectionName}. The configuration service did not respond. All unsaved entries are preserved on screen.`);
          toast.error('Settings not saved', 'Plant registry service was unreachable. Local parameters retained; retry when available.');
          return;
        }
        if (saveOutcome[0] === 'reauth-required') {
          setSettingsStatus(`Re-authentication required. Privileged configuration changes to ${sectionName} require plant administrator authorization.`);
          toast.warning('Authorization required', 'Enter administrator passcode to authorize policy update.');
          return;
        }
        if (saveOutcome[0] === 'unknown') {
          setSettingsStatus(`Save outcome unknown for ${sectionName}. Inspect plant audit ledger before reapplying changes.`);
          toast.warning('Outcome unknown', 'Check settings audit trace before reapplying changes.');
          return;
        }
        setSettingsStatus(`${sectionName} settings saved successfully. Audit event #AUD-9102 logged to plant immutable ledger.`);
        toast.success('Settings saved', `${sectionName} configuration committed and synchronized.`);
      }, 550);
    };

    const handleResetSection = (sectionName: string) => {
      setSettingsStatus(`${sectionName} settings reset to plant baseline defaults.`);
      toast.info('Settings reset', `Restored default parameters for ${sectionName}.`);
    };

    const handleExecuteRotation = () => {
      if (!acknowledgeRisk || isRotating) return;
      flushSync(() => {
        setIsRotating(true);
      });
      setSettingsStatus('Rotating webhook signing key in plant KMS. Existing signature verifications will transition.');
      window.setTimeout(() => {
        setIsRotating(false);
        setRotationDialogOpen(false);
        setRotationPasscode('');
        setAcknowledgeRisk(false);

        if (rotationOutcome[0] === 'failure') {
          setSettingsStatus('Key rotation failed during KMS provisioning. Rollback executed: previous key remains active and unaffected.');
          toast.error('Key rotation failed', 'KMS provisioning aborted. Rollback executed: previous key remains active.');
          return;
        }
        if (rotationOutcome[0] === 'reauth-failed') {
          setSettingsStatus('Authorization passcode invalid. Key rotation cancelled; previous signing key retained.');
          toast.error('Authorization rejected', 'Invalid passcode. Signing key retained.');
          return;
        }
        if (rotationOutcome[0] === 'unknown') {
          setSettingsStatus('Rotation outcome unknown. Inspect KMS cluster status before issuing subsequent signing key commands.');
          toast.warning('Rotation outcome unknown', 'Verify KMS cluster status before retrying.');
          return;
        }

        const newFingerprint = 'SHA256:8F:20:5B:6E:91:34:C8:D9:11:47:AA:BB:CC:DD:EE:FF';
        setKeyFingerprint(newFingerprint);
        setActiveKeyVoucher('pl04_sig_k1_9f3a8b2c4d1e0f7a6b5c8d2e');
        setSettingsStatus(`Webhook signing key rotated successfully. New fingerprint ${newFingerprint} active. Audit log #AUD-8834 committed.`);
        toast.success('Key rotated', 'New signing key active. One-time verification credential issued.');
      }, 700);
    };

    return (
      <>
        <AssemblyStateHarness id="plant-settings" state={assemblyState} onChange={setAssemblyState}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ minWidth: 'calc(var(--sidebar-w-collapsed) * 3)' }}>
              <Select
                aria-label="Plant settings scenario"
                size="sm"
                value={settingsScenario}
                onValueChange={(detail) => setSettingsScenario(detail.value)}
                items={PLANT_SETTINGS_SCENARIO_ITEMS}
              />
            </div>
            <div style={{ minWidth: 'calc(var(--sidebar-w-collapsed) * 2.5)' }}>
              <Select
                aria-label="Settings section"
                size="sm"
                value={[activeSection]}
                onValueChange={(detail) => setActiveSection((detail.value[0] || 'general') as SettingsSection)}
                items={PLANT_SETTINGS_SECTIONS.map((s) => ({ label: s.label, value: s.id }))}
              />
            </div>
            <div style={{ minWidth: 'calc(var(--sidebar-w-collapsed) * 2)' }}>
              <Select
                aria-label="Save operation outcome"
                size="sm"
                value={saveOutcome}
                onValueChange={(detail) => setSaveOutcome(detail.value)}
                items={PLANT_SETTINGS_SAVE_OUTCOME_ITEMS}
              />
            </div>
            <div style={{ minWidth: 'calc(var(--sidebar-w-collapsed) * 2)' }}>
              <Select
                aria-label="Key rotation outcome"
                size="sm"
                value={rotationOutcome}
                onValueChange={(detail) => setRotationOutcome(detail.value)}
                items={PLANT_SETTINGS_ROTATION_OUTCOME_ITEMS}
              />
            </div>
          </div>
        </AssemblyStateHarness>

        <AssemblyStateBoundary state={assemblyState} subject="plant settings" onRetry={() => setAssemblyState('ready')}>
          <div className="reference-assembly-workspace reference-assembly-workspace--comfortable">
            <SidebarLayout
              sidebarWidth="var(--sidebar-w)"
              minMainWidth="0"
              isCollapsed={isNavCollapsed}
              sidebarAriaLabel="Plant settings sections"
              mainAriaLabel="Plant settings content"
              header={
                <div className="reference-assembly-scope-row" style={{ padding: 'var(--space-4)', borderBottom: 'var(--border-hairline-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                    {isNavCollapsed && (
                      <div style={{ display: 'flex', alignItems: 'center', borderRight: 'var(--border-hairline-subtle)', paddingRight: 'var(--space-3)' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ds-workbench-header-expand-btn ds-workbench-header-expand-btn--nav"
                          onClick={() => setIsNavCollapsed(false)}
                          aria-expanded={false}
                          aria-label="Expand plant settings navigation (Ctrl+B)"
                          title="Expand Navigation (Ctrl+B)"
                          style={{
                            padding: 'var(--space-1)',
                            color: 'var(--text-accent)',
                            backgroundColor: 'var(--surface-selected)',
                            borderRadius: 'var(--radius-sm)',
                          }}
                        >
                          <SidebarLeftExpandIcon />
                        </Button>
                      </div>
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                        <Badge variant="info">Chakan Plant PL-04</Badge>
                        <Badge variant="neutral">Reference Assembly</Badge>
                        {isDirtyScenario && <Badge variant="warning">Unsaved modifications</Badge>}
                        {isConflictScenario && <Badge variant="danger">Concurrent Conflict</Badge>}
                      </div>
                      <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-semibold)', margin: 0, color: 'var(--text-primary)' }}>
                        Plant platform settings
                      </h1>
                      <p style={{ margin: 'var(--space-half) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                        Enterprise configuration for regional defaults, role access, alert routing, integrations, and audit records.
                      </p>
                    </div>
                  </div>
                  <CommandToolbarGroup
                    aria-label="Plant settings commands"
                    actionControls={
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          toast.info('Registry refreshed', 'Synchronized live configuration from plant registry service.');
                          setSettingsStatus('Settings synchronized with plant registry. Revision #REV-4090 verified.');
                        }}
                      >
                        Refresh Registry
                      </Button>
                    }
                  />
                </div>
              }
              sidebar={
                <nav className="plant-settings-nav" aria-label="Plant settings navigation" style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>
                      Configuration Domains
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsNavCollapsed(true)}
                      aria-label="Collapse plant settings navigation"
                      title="Collapse Navigation"
                      style={{ padding: 'var(--space-1)', color: 'var(--text-secondary)' }}
                    >
                      <SidebarLeftCollapseIcon />
                    </Button>
                  </div>
                  <ul className="plant-settings-nav-list">
                    {PLANT_SETTINGS_SECTIONS.map((nav) => {
                      const isActive = activeSection === nav.id;
                      return (
                        <li key={nav.id} className="plant-settings-nav-item">
                          <button
                            type="button"
                            className="plant-settings-nav-button"
                            aria-current={isActive ? 'page' : undefined}
                            onClick={() => {
                              setActiveSection(nav.id);
                              setSettingsStatus(`Displaying ${nav.label} configuration panel.`);
                            }}
                          >
                            <span>{nav.label}</span>
                            {nav.count !== undefined && (
                              <Badge variant={isActive ? 'info' : 'neutral'}>{nav.count}</Badge>
                            )}
                            {nav.alert && (
                              <Badge variant="warning">Alert</Badge>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              }
            >
              <div style={{ padding: 'var(--space-5)' }}>
                {/* Live Status Announcer */}
                <div
                  role="status"
                  aria-live="polite"
                  className="plant-settings-status"
                >
                  <strong>Operational status:</strong> {settingsStatus}
                </div>

                {/* SECTION 1: REGIONAL DEFAULTS */}
                {activeSection === 'general' && (
                  <Card className="plant-settings-card">
                    <CardHeader>
                      <CardTitle as="h2">Regional Defaults and System Localization</CardTitle>
                      <CardDescription>
                        Configure global timezone calculation, monetary currency scales, and operational shift boundaries.
                      </CardDescription>
                    </CardHeader>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                      <div className="plant-settings-field-group">
                        <label
                          htmlFor="plant-settings-timezone"
                          style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}
                        >
                          Default Operational Timezone
                        </label>
                        <Select aria-label="Select option"
                          id="plant-settings-timezone"
                          aria-describedby="plant-settings-timezone-desc"
                          value={timezone}
                          onValueChange={(d) => setTimezone(d.value)}
                          items={[
                            { label: 'IST (Asia/Kolkata) UTC+05:30 · Chakan Plant Official', value: 'IST' },
                            { label: 'UTC (Coordinated Universal Time) · Cloud Standard', value: 'UTC' },
                            { label: 'EST (Eastern Standard Time) · HQ Telemetry Link', value: 'EST' },
                            { label: 'CET (Central European Time) · Partner Assembly', value: 'CET' },
                          ]}
                        />
                        <p id="plant-settings-timezone-desc" className="plant-settings-help-text">
                          All supervisory SCADA records and shift logs are rendered in this local operational zone.
                        </p>
                      </div>

                      <div className="plant-settings-field-group">
                        <label
                          htmlFor="plant-settings-currency"
                          style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}
                        >
                          Monetary Valuation & Number Scale
                        </label>
                        <Select aria-label="Select option"
                          id="plant-settings-currency"
                          aria-describedby="plant-settings-currency-desc"
                          value={currency}
                          onValueChange={(d) => setCurrency(d.value)}
                          items={[
                            { label: '₹ INR (Indian Rupee · Lakh/Crore grouping)', value: 'INR' },
                            { label: '$ USD (United States Dollar · Million grouping)', value: 'USD' },
                            { label: '€ EUR (Euro · Million grouping)', value: 'EUR' },
                          ]}
                        />
                        <p id="plant-settings-currency-desc" className="plant-settings-help-text">
                          Governs material requisitions, work order valuation, and maintenance expenditure reports.
                        </p>
                      </div>

                      <div className="plant-settings-field-group">
                        <label
                          htmlFor="plant-settings-shift"
                          style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}
                        >
                          Plant Work Shift Model
                        </label>
                        <Select aria-label="Select option"
                          id="plant-settings-shift"
                          aria-describedby="plant-settings-shift-desc"
                          value={shiftModel}
                          onValueChange={(d) => setShiftModel(d.value)}
                          items={[
                            { label: '3-Shift Continuous (24x7 Manufacturing Operation)', value: '3-shift' },
                            { label: '2-Shift Standard (16h Production + 8h Maintenance)', value: '2-shift' },
                            { label: 'Single Shift Inspection & Tooling', value: '1-shift' },
                          ]}
                        />
                        <p id="plant-settings-shift-desc" className="plant-settings-help-text">
                          Determines handover boundary timestamps and operator attendance aggregation intervals.
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter style={{ borderTop: 'var(--border-hairline-subtle)', padding: 'var(--space-3) var(--space-4)' }}>
                      <div className="plant-settings-actions">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResetSection('Regional Defaults')}
                        >
                          Reset Defaults
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          disabled={isSaving}
                          onClick={() => handleSaveSection('Regional Defaults')}
                        >
                          {isSaving ? 'Saving…' : 'Save regional defaults'}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                )}

                {/* SECTION 2: ACCESS CONTROL & ROLES */}
                {activeSection === 'access' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {isRestrictedScenario ? (
                      <Card className="plant-settings-card">
                        <EmptyState
                          title="Restricted section access"
                          description="Modifying enterprise security policies and role assignments requires Plant Security Officer (PL-SO) privileges. Your current role has read-only access to role directories."
                          secondaryAction={<Button variant="outline">Request policy elevation</Button>}
                        />
                      </Card>
                    ) : (
                      <Card className="plant-settings-card plant-settings-card--table" padding="none">
                        <div className="plant-settings-card-header">
                          <div className="plant-settings-card-title-group">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--weight-semibold)', margin: 0, color: 'var(--text-primary)' }}>
                                Access Control and Role Assignments
                              </h2>
                              <Badge variant="info">{allUsers.length} accounts</Badge>
                            </div>
                            <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                              Supervise workstation accounts, privilege bands, and security access status for PL-04 personnel.
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => setInviteDialogOpen(true)}
                          >
                            + Invite User
                          </Button>
                        </div>

                        <div className="plant-settings-table-toolbar">
                          <div style={{ flex: '1 1 calc(var(--sidebar-w-collapsed) * 3)', maxWidth: 'calc(var(--sidebar-w-collapsed) * 4)' }}>
                            <Input
                              placeholder="Search by name, role or email…"
                              value={userSearchQuery}
                              onChange={(e) => setUserSearchQuery(e.target.value)}
                              aria-label="Filter personnel records"
                            />
                          </div>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                            Showing {filteredUsers.length} of {allUsers.length} personnel
                          </span>
                        </div>

                        <CardContent style={{ padding: 0 }}>
                          <div className="reference-assembly-data-surface">
                            <Table density="compact" bordered>
                              <TableHeader>
                                <TableRow>
                                  <TableHead style={{ width: '40%' }}>User / Identity</TableHead>
                                  <TableHead style={{ width: '22%' }}>Assigned Role</TableHead>
                                  <TableHead style={{ width: '14%' }}>Status</TableHead>
                                  <TableHead style={{ width: '14%' }}>Last Active</TableHead>
                                  <TableHead align="right" style={{ width: '10%' }}>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredUsers.map((u) => {
                                  const initials = u.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .filter(Boolean)
                                    .slice(0, 2)
                                    .join('')
                                    .toUpperCase();
                                  return (
                                    <TableRow key={u.id}>
                                      <TableCell>
                                        <div className="plant-settings-user-cell">
                                          <span className="plant-settings-user-avatar" aria-hidden="true">
                                            {initials}
                                          </span>
                                          <div>
                                            <div style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                                              {u.name}
                                            </div>
                                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                                              {u.email}
                                            </div>
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant={u.roleVariant}>{u.role}</Badge>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant={u.statusVariant}>{u.status}</Badge>
                                      </TableCell>
                                      <TableCell style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                                        {u.lastActive}
                                      </TableCell>
                                      <TableCell align="right">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => toast.info('Edit role', `Opening role configuration for ${u.name}.`)}
                                        >
                                          Edit
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </CardContent>

                        <div className="plant-settings-card-footer">
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                            Policy POL-SEC-04: Role assignments synchronized with enterprise LDAP directory.
                          </span>
                          <div className="plant-settings-actions">
                            <Button size="sm" variant="outline" onClick={() => handleResetSection('Access Policies')}>
                              Cancel
                            </Button>
                            <Button size="sm" variant="primary" disabled={isSaving} onClick={() => handleSaveSection('Access Policies')}>
                              {isSaving ? 'Saving…' : 'Save access policies'}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {/* SECTION 3: ALERT CHANNELS */}
                {activeSection === 'notifications' && (
                  <Card className="plant-settings-card">
                    <CardHeader>
                      <CardTitle>Notification Channels and Alert Routing</CardTitle>
                      <CardDescription>
                        Configure automated dispatch destinations for machinery stoppages, parameter threshold breaches, and quality incidents.
                      </CardDescription>
                    </CardHeader>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                      <fieldset style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <legend style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                          Critical Incident Dispatch Channels
                        </legend>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', border: 'var(--border-hairline-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--surface-raised)' }}>
                          <div>
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', display: 'block', color: 'var(--text-primary)' }}>
                              Email alert dispatch
                            </span>
                            <span id="desc-email-alert" className="plant-settings-help-text">
                              Deliver automated shift incident summaries and threshold breach logs to subscribed engineers.
                            </span>
                          </div>
                          <Switch
                            aria-describedby="desc-email-alert"
                            aria-label="Email alert dispatch"
                            checked={emailAlerts}
                            onChange={(v) => setEmailAlerts(v)}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', border: 'var(--border-hairline-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--surface-raised)' }}>
                          <div>
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', display: 'block', color: 'var(--text-primary)' }}>
                              SMS emergency broadcasts
                            </span>
                            <span id="desc-sms-alert" className="plant-settings-help-text">
                              Send priority cellular broadcasts to the on-duty maintenance manager for severity-1 safety alerts.
                            </span>
                          </div>
                          <Switch
                            aria-describedby="desc-sms-alert"
                            aria-label="SMS emergency broadcasts"
                            checked={smsAlerts}
                            onChange={(v) => setSmsAlerts(v)}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', border: 'var(--border-hairline-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--surface-raised)' }}>
                          <div>
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', display: 'block', color: 'var(--text-primary)' }}>
                              Webhook event streaming
                            </span>
                            <span id="desc-webhook-alert" className="plant-settings-help-text">
                              Forward signed HMAC-SHA256 event payloads to registered enterprise webhook endpoints.
                            </span>
                          </div>
                          <Switch
                            aria-describedby="desc-webhook-alert"
                            aria-label="Webhook event streaming"
                            checked={webhookAlerts}
                            onChange={(v) => setWebhookAlerts(v)}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', border: 'var(--border-hairline-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--surface-raised)' }}>
                          <div>
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', display: 'block', color: 'var(--text-primary)' }}>
                              Pager on-call escalation
                            </span>
                            <span id="desc-pager-alert" className="plant-settings-help-text">
                              Trigger continuous escalation paging when machinery critical faults remain unacknowledged for &gt; 15 minutes.
                            </span>
                          </div>
                          <Switch
                            aria-describedby="desc-pager-alert"
                            aria-label="Pager on-call escalation"
                            checked={pagerEscalation}
                            onChange={(v) => setPagerEscalation(v)}
                          />
                        </div>
                      </fieldset>
                    </CardContent>
                    <CardFooter style={{ borderTop: 'var(--border-hairline-subtle)', padding: 'var(--space-3) var(--space-4)' }}>
                      <div className="plant-settings-actions">
                        <Button size="sm" variant="outline" onClick={() => handleResetSection('Notification Rules')}>
                          Reset
                        </Button>
                        <Button size="sm" variant="primary" disabled={isSaving} onClick={() => handleSaveSection('Notification Rules')}>
                          {isSaving ? 'Saving…' : 'Save notification rules'}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                )}

                {/* SECTION 4: EXTERNAL INTEGRATIONS */}
                {activeSection === 'integrations' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                    <Card className="plant-settings-card">
                      <CardHeader>
                        <CardTitle>External Integrations and Machine Communications</CardTitle>
                        <CardDescription>
                          Configure machine-to-machine dispatch destinations, webhook signing credentials, and cryptographic verification metadata.
                        </CardDescription>
                      </CardHeader>
                      <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div className="plant-settings-field-group">
                          <label
                            htmlFor="plant-settings-key-fingerprint"
                            style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}
                          >
                            Webhook Signing Key Fingerprint (HMAC-SHA256)
                          </label>
                          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            <div style={{ flex: '1 1 300px' }}>
                              <Input aria-label="Webhook Signing Key Fingerprint (HMAC-SHA256)"
                                id="plant-settings-key-fingerprint"
                                value={keyFingerprint}
                                readOnly
                                aria-describedby="plant-settings-key-desc"
                                style={{ fontFamily: 'var(--font-mono)' }}
                              />
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                toast.success('Fingerprint copied', 'Key digest copied to clipboard.');
                                setSettingsStatus('Public signing key fingerprint copied to clipboard.');
                              }}
                            >
                              Copy fingerprint
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setRotationDialogOpen(true)}
                            >
                              Rotate webhook signing key
                            </Button>
                          </div>
                          <p id="plant-settings-key-desc" className="plant-settings-help-text">
                            Public cryptographic digest used by webhook receivers to verify payload integrity without exposing private key material.
                          </p>
                        </div>

                        {activeKeyVoucher && (
                          <div
                            role="status"
                            style={{
                              padding: 'var(--space-3)',
                              border: '1px solid var(--ds-global-color-success-700)',
                              borderRadius: 'var(--radius-md)',
                              background: 'var(--surface-raised)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-success)', textTransform: 'uppercase' }}>
                                One-Time Verification Credential
                              </span>
                              <Badge variant="success">Issued</Badge>
                            </div>
                            <p style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                              This private signing credential is displayed only once. Record it in your secure enterprise key vault immediately.
                            </p>
                            <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                              <Input aria-label="Reference Assemblies field" value={activeKeyVoucher} readOnly style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }} />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  toast.success('Credential copied', 'Private verification credential copied to clipboard.');
                                  setActiveKeyVoucher(null);
                                }}
                              >
                                Copy and dismiss
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="plant-settings-field-group">
                          <label
                            htmlFor="plant-settings-webhook-url"
                            style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}
                          >
                            Outbound Webhook Endpoint URL
                          </label>
                          <Input aria-label="Outbound Webhook Endpoint URL"
                            id="plant-settings-webhook-url"
                            value={webhookUrl}
                            onChange={(e) => setWebhookUrl(e.target.value)}
                            aria-describedby="plant-settings-webhook-desc"
                            style={{ fontFamily: 'var(--font-mono)' }}
                          />
                          <p id="plant-settings-webhook-desc" className="plant-settings-help-text">
                            Target HTTPS endpoint where plant supervisory events and shift telemetries are dispatched. Must terminate with TLS 1.3.
                          </p>
                        </div>
                      </CardContent>
                      <CardFooter style={{ borderTop: 'var(--border-hairline-subtle)', padding: 'var(--space-3) var(--space-4)' }}>
                        <div className="plant-settings-actions">
                          <Button size="sm" variant="outline" onClick={() => handleResetSection('Endpoint Settings')}>
                            Cancel
                          </Button>
                          <Button size="sm" variant="primary" disabled={isSaving} onClick={() => handleSaveSection('Endpoint Settings')}>
                            {isSaving ? 'Saving…' : 'Save endpoint settings'}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>

                    {/* CONNECTED SERVICES HEALTH TABLE */}
                    <Card className="plant-settings-card">
                      <CardHeader>
                        <CardTitle>Connected Enterprise Services Telemetry</CardTitle>
                        <CardDescription>
                          Real-time connection latency and protocol health for integrated production pipelines.
                        </CardDescription>
                      </CardHeader>
                      <CardContent style={{ padding: 0 }}>
                        <div className="reference-assembly-data-surface">
                          <Table density="compact" bordered>
                            <TableHeader>
                              <TableRow>
                                <TableHead style={{ width: '45%' }}>Service Name</TableHead>
                                <TableHead style={{ width: '25%' }}>Protocol / Version</TableHead>
                                <TableHead style={{ width: '18%' }}>Connection Status</TableHead>
                                <TableHead align="right" style={{ width: '12%' }}>Latency</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {services.map((srv) => (
                                <TableRow key={srv.id}>
                                  <TableCell style={{ fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                                    {srv.name}
                                  </TableCell>
                                  <TableCell style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                                    {srv.protocol}
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant={srv.statusVariant}>{srv.status}</Badge>
                                  </TableCell>
                                  <TableCell align="right" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>
                                    {srv.latency}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* SECTION 5: AUDIT AND LOGS */}
                {activeSection === 'logs' && (
                  <Card className="plant-settings-card">
                    <CardHeader>
                      <CardTitle>Audit Trail and Telemetry Retention Policy</CardTitle>
                      <CardDescription>
                        Approved records retention schedules and diagnostics log verbosity governed by enterprise quality compliance.
                      </CardDescription>
                    </CardHeader>
                    <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                      <div className="plant-settings-field-group">
                        <label
                          htmlFor="plant-settings-retention"
                          style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}
                        >
                          Approved Records Retention Schedule
                        </label>
                        <Select aria-label="Select option"
                          id="plant-settings-retention"
                          aria-describedby="plant-settings-retention-desc"
                          value={retention}
                          onValueChange={(d) => setRetention(d.value)}
                          items={RETENTION_POLICY_OPTIONS}
                        />
                        <p id="plant-settings-retention-desc" className="plant-settings-help-text">
                          Governed by Corporate Quality standard POL-AUD-12. Plant PL-04 requires a minimum 90-day retention schedule to satisfy ISO 9001 and IATF 16949 audit readiness.
                        </p>
                      </div>

                      <div className="plant-settings-field-group">
                        <label
                          htmlFor="plant-settings-log-level"
                          style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}
                        >
                          Minimum Log Verbosity Level
                        </label>
                        <Select aria-label="Select option"
                          id="plant-settings-log-level"
                          aria-describedby="plant-settings-log-desc"
                          value={logLevel}
                          onValueChange={(d) => setLogLevel(d.value)}
                          items={[
                            { label: 'DEBUG · Detailed telemetry trace for equipment commissioning', value: 'DEBUG' },
                            { label: 'INFO · Standard operational events & shift transactions', value: 'INFO' },
                            { label: 'WARN · Warnings and recoverable threshold deviations only', value: 'WARN' },
                            { label: 'ERROR · Critical equipment stoppages and security failures only', value: 'ERROR' },
                          ]}
                        />
                        <p id="plant-settings-log-desc" className="plant-settings-help-text">
                          Controls the granularity of logs stored in the local plant SCADA buffer and forwarded to the enterprise telemetry sink.
                        </p>
                      </div>

                      <div style={{ padding: 'var(--space-3)', border: 'var(--border-hairline-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--surface-raised)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', display: 'block' }}>
                              Immutable Audit Ledger Verification
                            </span>
                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                              Hash chain root #LGR-7890 verified at 2026-09-29 08:00 IST. Total committed records: 48,920.
                            </span>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => toast.info('Ledger export', 'Compiling cryptographically signed audit trace archive.')}>
                            Export Ledger
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter style={{ borderTop: 'var(--border-hairline-subtle)', padding: 'var(--space-3) var(--space-4)' }}>
                      <div className="plant-settings-actions">
                        <Button size="sm" variant="outline" onClick={() => handleResetSection('Telemetry Logs')}>
                          Reset
                        </Button>
                        <Button size="sm" variant="primary" disabled={isSaving} onClick={() => handleSaveSection('Telemetry Logs')}>
                          {isSaving ? 'Applying…' : 'Apply retention policy'}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </SidebarLayout>
          </div>
        </AssemblyStateBoundary>

        {/* KEY ROTATION CONFIRMATION DIALOG (RA-SET-003) */}
        {rotationDialogOpen && (
          <div className="plant-settings-modal-backdrop" role="presentation">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="rotation-dialog-title"
              className="plant-settings-modal-dialog"
            >
              <div style={{ padding: 'var(--space-5)', borderBottom: 'var(--border-hairline-subtle)' }}>
                <h2 id="rotation-dialog-title" style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                  Authorize Webhook Signing Key Rotation
                </h2>
                <p style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  This high-consequence administrative action revokes the existing signature key across all downstream receivers.
                </p>
              </div>

              <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ padding: 'var(--space-3)', border: '1px solid var(--text-warning)', borderRadius: 'var(--radius-md)', background: 'var(--status-warning-soft, var(--surface-raised))' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-warning)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--space-1)' }}>
                    Consequence Advisory
                  </span>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Downstream ERP and MES subscribers validating webhooks with the previous key will reject event deliveries until updated with the newly issued credential.
                  </p>
                </div>

                <div className="plant-settings-field-group">
                  <label htmlFor="rotation-passcode-input" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                    Administrator Authorization Passcode
                  </label>
                  <Input aria-label="Enter admin passcode"
                    id="rotation-passcode-input"
                    autoComplete="off"
                    placeholder="Enter admin passcode"
                    value={rotationPasscode}
                    onChange={(e) => setRotationPasscode(e.target.value)}
                    aria-describedby="rotation-passcode-help"
                  />
                  <p id="rotation-passcode-help" className="plant-settings-help-text">
                    Requires Plant Security Officer or Plant Administrator elevation credentials.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                  <Checkbox aria-label="Ack Rotation Risk"
                    id="ack-rotation-risk"
                    checked={acknowledgeRisk}
                    onChange={(checked) => setAcknowledgeRisk(Boolean(checked))}
                  />
                  <label htmlFor="ack-rotation-risk" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', cursor: 'pointer', lineHeight: 1.4 }}>
                    I acknowledge that active webhook subscribers will fail payload verification until re-keyed with the new credential.
                  </label>
                </div>
              </div>

              <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: 'var(--border-hairline-subtle)', background: 'var(--surface-raised)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isRotating}
                  onClick={() => {
                    setRotationDialogOpen(false);
                    setRotationPasscode('');
                    setAcknowledgeRisk(false);
                    setSettingsStatus('Key rotation cancelled. Current signing key remains active.');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  disabled={!acknowledgeRisk || isRotating}
                  onClick={handleExecuteRotation}
                >
                  {isRotating ? 'Rotating key in KMS…' : 'Authorize and rotate key'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {inviteDialogOpen && (
          <div className="plant-settings-modal-backdrop" role="presentation" onClick={(e) => { if (e.target === e.currentTarget) setInviteDialogOpen(false); }}>
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="invite-dialog-title"
              className="plant-settings-modal-dialog"
            >
              <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: 'var(--border-hairline-subtle)' }}>
                <h2 id="invite-dialog-title" style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                  Invite Personnel to Plant Workstations
                </h2>
                <p style={{ margin: 'var(--space-1) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                  Authorize operational account and issue a 24-hour cryptographic credential voucher.
                </p>
              </div>

              <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div className="plant-settings-field-group">
                  <label htmlFor="invite-name-input" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                    Personnel Full Name
                  </label>
                  <Input aria-label="e.g. Rahul Sharma"
                    id="invite-name-input"
                    placeholder="e.g. Rahul Sharma"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                  />
                </div>

                <div className="plant-settings-field-group">
                  <label htmlFor="invite-email-input" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                    Workstation Email Address
                  </label>
                  <Input aria-label="username@suryodaya.co.in"
                    id="invite-email-input"
                    placeholder="username@suryodaya.co.in"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <p className="plant-settings-help-text">
                    Must belong to verified plant domain (@suryodaya.co.in).
                  </p>
                </div>

                <div className="plant-settings-field-group">
                  <label htmlFor="invite-role-select" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
                    Operational Role & Privileges
                  </label>
                  <Select aria-label="Select option"
                    id="invite-role-select"
                    value={inviteRole}
                    onValueChange={(d) => setInviteRole(d.value)}
                    items={[
                      { label: 'Shift Supervisor · Supervisory SCADA Access', value: 'Shift Supervisor' },
                      { label: 'Plant Admin · Unrestricted Configuration', value: 'Plant Admin' },
                      { label: 'Quality Auditor · Read-only Traceability', value: 'Quality Auditor' },
                      { label: 'Maintenance Lead · Equipment Interlock Override', value: 'Maintenance Lead' },
                      { label: 'Process Engineer · Recipe & Takt Management', value: 'Process Engineer' },
                    ]}
                  />
                </div>

                <div style={{ padding: 'var(--space-3)', border: 'var(--border-hairline-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--surface-raised)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-accent)', textTransform: 'uppercase', display: 'block', marginBottom: 'var(--space-1)' }}>
                    Security Authorization Protocol
                  </span>
                  <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Upon dispatch, an authorized registration voucher will be delivered to the internal email with an immutable record logged to the PL-04 security ledger.
                  </p>
                </div>
              </div>

              <div style={{ padding: 'var(--space-4) var(--space-5)', borderTop: 'var(--border-hairline-subtle)', background: 'var(--surface-raised)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                <Button size="sm" variant="outline" onClick={() => setInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" onClick={handleSendInvitation}>
                  Send Invitation
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  },
};


// ==========================================
// 6. ANALYTICS REFERENCE ASSEMBLY
// ==========================================
const ANALYTICS_DATA = {
  '7d': {
    area: [
      { label: 'Day 1', value: 180 },
      { label: 'Day 2', value: 240 },
      { label: 'Day 3', value: 310 },
      { label: 'Day 4', value: 290 },
      { label: 'Day 5', value: 350 },
      { label: 'Day 6', value: 220 },
      { label: 'Day 7', value: 190 },
    ],
    bars: [
      { label: 'Press Shop', value: 85 },
      { label: 'Machine Shop', value: 54 },
      { label: 'Assembly', value: 38 },
    ],
    velocity: [
      { label: 'P-2', value: 28 },
      { label: 'P-5', value: 24 },
      { label: 'HMC-04', value: 22 },
      { label: 'A-1', value: 20 },
    ],
  },
  '30d': {
    area: [
      { label: 'W1', value: 1200 },
      { label: 'W2', value: 1850 },
      { label: 'W3', value: 2400 },
      { label: 'W4', value: 3100 },
      { label: 'W5', value: 3800 },
    ],
    bars: [
      { label: 'Press Shop', value: 340 },
      { label: 'Machine Shop', value: 210 },
      { label: 'Assembly', value: 150 },
    ],
    velocity: [
      { label: 'P-2', value: 42 },
      { label: 'P-5', value: 38 },
      { label: 'HMC-04', value: 31 },
      { label: 'A-1', value: 29 },
    ],
  },
  '90d': {
    area: [
      { label: 'Month 1', value: 5400 },
      { label: 'Month 2', value: 6800 },
      { label: 'Month 3', value: 8100 },
    ],
    bars: [
      { label: 'Press Shop', value: 1100 },
      { label: 'Machine Shop', value: 720 },
      { label: 'Assembly', value: 490 },
    ],
    velocity: [
      { label: 'P-2', value: 55 },
      { label: 'P-5', value: 48 },
      { label: 'HMC-04', value: 41 },
      { label: 'A-1', value: 36 },
    ],
  },
};

const ANALYTICS_SCENARIO_ITEMS = [
  { label: 'Complete telemetry', value: 'complete' },
  { label: 'Empty telemetry', value: 'empty' },
  { label: 'Missing telemetry points', value: 'missing-points' },
  { label: 'Partial series', value: 'partial-series' },
  { label: 'High-density 90-day series', value: 'high-density' },
  { label: 'Long content stress', value: 'stress-long-content' },
];

const ANALYTICS_EXPORT_OUTCOME_ITEMS = [
  { label: 'Success', value: 'success' },
  { label: 'Service failure', value: 'failure' },
  { label: 'Permission restricted', value: 'restricted' },
  { label: 'Unknown outcome', value: 'unknown' },
];

function analyticsStressSeries(prefix: string, length: number, base: number, step: number) {
  return Array.from({ length }, (_, index) => ({
    label: `${prefix} ${String(index + 1).padStart(2, '0')}`,
    value: base + ((index * step) % 1700),
  }));
}

function getAnalyticsScenarioData(scenario: string, currentKey: keyof typeof ANALYTICS_DATA) {
  const baseData = ANALYTICS_DATA[currentKey] || ANALYTICS_DATA['30d'];
  if (scenario === 'empty') {
    return {
      area: [],
      bars: [],
      velocity: [],
      quality: 'No accepted-output telemetry is available for this horizon.',
    };
  }
  if (scenario === 'missing-points') {
    return {
      area: [
        { label: 'W1', value: 1200 },
        { label: 'W2', value: 0 },
        { label: 'W3', value: 2400 },
        { label: 'W4', value: 0 },
        { label: 'W5', value: 3800 },
      ],
      bars: baseData.bars,
      velocity: baseData.velocity,
      quality: 'Missing telemetry points are flagged; zero values are not treated as confirmed output.',
    };
  }
  if (scenario === 'partial-series') {
    return {
      area: baseData.area.slice(0, Math.max(1, baseData.area.length - 1)),
      bars: baseData.bars.slice(0, 2),
      velocity: baseData.velocity.slice(0, 3),
      quality: 'Partial telemetry: Assembly area and final line-rate records are still reconciling.',
    };
  }
  if (scenario === 'high-density') {
    return {
      area: analyticsStressSeries('Day', 90, 1400, 137),
      bars: [
        { label: 'Press Shop', value: 12840 },
        { label: 'Machine Shop', value: 9240 },
        { label: 'Weld Cell', value: 8120 },
        { label: 'Paint Line', value: 6760 },
        { label: 'Assembly', value: 5940 },
        { label: 'Final Inspection', value: 3210 },
      ],
      velocity: analyticsStressSeries('Line', 24, 28, 7),
      quality: 'High-density telemetry is aggregated for chart rendering; exact values remain available in synchronized tables.',
    };
  }
  if (scenario === 'stress-long-content') {
    return {
      area: [
        { label: 'First-shift accepted production after die-change and coolant-pressure recovery', value: 1200 },
        { label: 'Second-shift output with extended quality hold and rework release', value: 1850 },
        { label: 'Third-shift output after HMC-04 spindle inspection and restart', value: 2400 },
      ],
      bars: [
        { label: 'Press Shop - progressive die Line P-2 and P-5', value: 340 },
        { label: 'Machine Shop - HMC-04 spindle cell', value: 210 },
        { label: 'Assembly - final torque and inspection benches', value: 150 },
      ],
      velocity: [
        { label: 'Press Line P-2 third-shift sustained rate', value: 42 },
        { label: 'Press Line P-5 corrective-maintenance recovery rate', value: 38 },
        { label: 'HMC-04 coolant-pressure constrained rate', value: 31 },
      ],
      quality: 'Long labels are displayed to test truncation, reflow, and table alternatives.',
    };
  }
  return {
    ...baseData,
    quality: 'Telemetry complete. Last synchronized 29 Sep 2026, 10:30 IST.',
  };
}

export const AnalyticsExample: Story = {
  name: '6. Production Analytics Candidate',
  render: () => {
    const toast = useToast();
    const [timeRange, setTimeRange] = useState<string[]>([getDashboardParam('analyticsRange', '30d')]);
    const [analyticsScenario, setAnalyticsScenario] = useState<string[]>([getDashboardParam('analyticsScenario', 'complete')]);
    const [exportOutcome, setExportOutcome] = useState<string[]>([getDashboardParam('exportOutcome', 'success')]);
    const [isExporting, setIsExporting] = useState(false);
    const [exportStatus, setExportStatus] = useState('Export ready. Dataset contains synthetic PL-04 telemetry only.');
    const [assemblyState, setAssemblyState] = useState<AssemblyState>(getInitialAssemblyState());
    const currentKey = (timeRange[0] as keyof typeof ANALYTICS_DATA) || '30d';
    const currentData = getAnalyticsScenarioData(analyticsScenario[0], currentKey);

    const handleExport = () => {
      if (isExporting) return;
      flushSync(() => {
        setIsExporting(true);
        setExportStatus('Preparing governed analytics export. Duplicate export requests are blocked.');
      });
      window.setTimeout(() => {
        setIsExporting(false);
        if (exportOutcome[0] === 'failure') {
          setExportStatus('Export failed. No file was downloaded; retry after telemetry service recovery.');
          toast.error('Export failed', 'The analytics export service did not respond. No file was downloaded.');
          return;
        }
        if (exportOutcome[0] === 'restricted') {
          setExportStatus('Export restricted. Your role can inspect telemetry but cannot download datasets.');
          toast.warning('Export restricted', 'Request analytics-export permission from the PL-04 data steward.');
          return;
        }
        if (exportOutcome[0] === 'unknown') {
          setExportStatus('Export outcome unknown. Check the audit log before starting another export.');
          toast.warning('Export outcome unknown', 'Check the analytics audit log before exporting again.');
          return;
        }
        setExportStatus('Dataset export completed and audit event recorded.');
        toast.success('Data exported', 'Downloaded synthetic analytics dataset in CSV format; audit event recorded.');
      }, 500);
    };

    return (
      <>
        <AssemblyStateHarness id="production-analytics" state={assemblyState} onChange={setAssemblyState}>
          <Select
            aria-label="Production analytics scenario"
            value={analyticsScenario}
            onValueChange={(detail) => setAnalyticsScenario(detail.value)}
            items={ANALYTICS_SCENARIO_ITEMS}
          />
          <Select
            aria-label="Analytics export outcome"
            value={exportOutcome}
            onValueChange={(detail) => setExportOutcome(detail.value)}
            items={ANALYTICS_EXPORT_OUTCOME_ITEMS}
          />
        </AssemblyStateHarness>
        <AssemblyStateBoundary state={assemblyState} subject="production analytics" onRetry={() => setAssemblyState('ready')}>
          <DashboardLayout
        header={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <span style={{ fontSize: 'var(--text-2xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--text-accent)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)' }}>
                Chakan plant PL-04 · Candidate reference assembly
              </span>
              <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-semibold)', margin: 'var(--space-1) 0 var(--space-half)', color: 'var(--text-primary)' }}>
                Production performance analytics
              </h1>
              <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                Accepted output, production-area distribution, and line rate across the selected horizon.
              </p>
            </div>
            <CommandToolbarGroup
              viewControls={
                <SegmentedControl
                  aria-label="Analytics time range"
                  value={timeRange[0] || '30d'}
                  onChange={(val) => {
                    setTimeRange([val]);
                    toast.info('Analytics scope updated', `Interval set to ${val === '7d' ? 'Last 7 Days' : val === '30d' ? 'Last 30 Days' : 'Last Quarter (90d)'}`);
                  }}
                  options={[
                    { value: '7d', label: 'Last 7d' },
                    { value: '30d', label: 'Last 30d' },
                    { value: '90d', label: 'Last 90d' },
                  ]}
                />
              }
              actionControls={
                <Button
                  size="sm"
                  variant="primary"
                  isLoading={isExporting}
                  loadingText="Exporting dataset"
                  disabled={isExporting}
                  onClick={handleExport}
                >
                  {isExporting ? 'Exporting dataset' : 'Export Dataset (CSV)'}
                </Button>
              }
            />
          </div>
        }
      >
        <DashboardWidget colSpan={12} title="Telemetry quality and export status">
          <div className="analytics-status-grid" role="status" aria-live="polite">
            <div>
              <span className="analytics-status-label">Data quality</span>
              <p>{currentData.quality}</p>
            </div>
            <div>
              <span className="analytics-status-label">Export control</span>
              <p>{exportStatus}</p>
            </div>
          </div>
        </DashboardWidget>
        <DashboardWidget
          colSpan={12}
          title="Accepted output trend (pcs)"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.info('Navigating to Output Logs', 'Opening cumulative throughput telemetry...')}
            >
              Output Details ›
            </Button>
          }
        >
          <div style={{ padding: 'var(--space-2) 0' }}>
            <AreaChart
              data={currentData.area}
              height={240}
              xKey="label"
              yKey="value"
              xScaleType="point"
              showPoints={true}
            />
            {currentData.area.length === 0 && (
              <EmptyState title="No accepted-output telemetry" description="No production output records matched the selected horizon." />
            )}
            <AccessibleDataTable data={currentData.area} valueHeading="Accepted output" unit=" pcs" />
          </div>
        </DashboardWidget>

        <DashboardWidget
          colSpan={6}
          title="Output by production area"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.info('Navigating to Category Allocation', 'Opening discrete classification report...')}
            >
              Breakdown ›
            </Button>
          }
        >
          <div style={{ padding: 'var(--space-2) 0' }}>
            <BarChart
              data={currentData.bars}
              height={200}
              showValues={true}
              unit=" units"
            />
            {currentData.bars.length === 0 && (
              <EmptyState title="No production-area data" description="Area distribution will appear when telemetry is restored." />
            )}
            <AccessibleDataTable data={currentData.bars} valueHeading="Accepted output" unit=" pcs" />
          </div>
        </DashboardWidget>

        <DashboardWidget
          colSpan={6}
          title="Line rate (pcs/hr)"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast.info('Navigating to Batch Performance', 'Opening batch processing rate diagnostics...')}
            >
              Batch Logs ›
            </Button>
          }
        >
          <div style={{ padding: 'var(--space-2) 0' }}>
            <LineChart
              data={currentData.velocity}
              height={200}
              xKey="label"
              yKey="value"
              pointVisibility="always"
              unit=" pcs/hr"
            />
            {currentData.velocity.length === 0 && (
              <EmptyState title="No line-rate data" description="Line-rate telemetry is unavailable for this horizon." />
            )}
            <AccessibleDataTable data={currentData.velocity} valueHeading="Line rate" unit=" pcs/hr" />
          </div>
        </DashboardWidget>
          </DashboardLayout>
        </AssemblyStateBoundary>
      </>
    );
  },
};
