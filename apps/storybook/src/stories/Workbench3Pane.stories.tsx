import React, { useState, useMemo, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Workbench3PaneLayout,
  EntityFacilitySelector,
  EntityFacilitySelection,
  defaultEnterpriseEntities,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TreeGridCell,
  Badge,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  DualUomBadge,
  StaleDataPill,
} from '@ds/react';

// NotebookLM-style Panel Toggle Icons (§01–§14)
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

const meta: Meta<typeof Workbench3PaneLayout> = {
  title: 'Layout Templates/Workbench3Pane',
  component: Workbench3PaneLayout,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Workbench3PaneLayout>;

interface WorkOrderItem {
  id: string;
  parentId?: string;
  level: number;
  code: string;
  name: string;
  lineId: string;
  lineName: string;
  shift: 1 | 2 | 3;
  primaryQty: number;
  primaryUom: string;
  secondaryQty?: number;
  secondaryUom?: string;
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'STAGED' | 'DEFICIT' | 'DISPATCH_READY';
  deficitNote?: string;
  supplierFacility?: string;
  destFacility?: string;
}

// Hierarchical Dataset for Finished Goods Plants (Asclepius)
const plantWorkOrders: WorkOrderItem[] = [
  // Parent 1 (Line 01)
  {
    id: 'wo-1',
    level: 0,
    code: 'ORD-2026-9041',
    name: 'Immuno-Doc Ras 500ml Retail Pack',
    lineId: 'line-01',
    lineName: 'Line 01 - Packaging (High Speed)',
    shift: 1,
    primaryQty: 3000,
    primaryUom: 'Pk',
    secondaryQty: 1500,
    secondaryUom: 'L',
    status: 'CONFIRMED',
  },
  {
    id: 'wo-1-sub',
    parentId: 'wo-1',
    level: 1,
    code: 'BLK-FRM-HERB-901',
    name: 'Herbal Blend Master Liquid Batch 901',
    lineId: 'line-01',
    lineName: 'Line 01 - Packaging (High Speed)',
    shift: 1,
    primaryQty: 1500,
    primaryUom: 'L',
    secondaryQty: 3000,
    secondaryUom: 'Btl',
    status: 'IN_PROGRESS',
  },
  {
    id: 'wo-1-mat-1',
    parentId: 'wo-1-sub',
    level: 2,
    code: 'RAW-EXT-ASH-05',
    name: 'Ashwagandha Root Extract 2.5% Withanolides',
    lineId: 'line-01',
    lineName: 'Line 01 - Packaging (High Speed)',
    shift: 1,
    primaryQty: 150,
    primaryUom: 'KG',
    secondaryQty: 3000,
    secondaryUom: 'Pk',
    status: 'DEFICIT',
    deficitNote: 'Stockout at Plant F-119. Awaiting STO transfer from RM Warehouse H-9.',
    supplierFacility: 'Anantshriveda (RM Warehouse H-9)',
    destFacility: 'Asclepius (Food Plant F-119)',
  },
  {
    id: 'wo-1-mat-2',
    parentId: 'wo-1-sub',
    level: 2,
    code: 'RAW-ING-AML-109',
    name: 'Organic Amla Pulp Concentrate Standardized',
    lineId: 'line-01',
    lineName: 'Line 01 - Packaging (High Speed)',
    shift: 1,
    primaryQty: 350,
    primaryUom: 'KG',
    secondaryQty: 70,
    secondaryUom: 'Can',
    status: 'STAGED',
  },

  // Parent 2 (Line 02)
  {
    id: 'wo-2',
    level: 0,
    code: 'ORD-2026-9042',
    name: 'Dibo-Doc Decoction 1000ml Family Pack',
    lineId: 'line-02',
    lineName: 'Line 02 - Syrup Bottling Line',
    shift: 1,
    primaryQty: 1800,
    primaryUom: 'Btl',
    secondaryQty: 1800,
    secondaryUom: 'L',
    status: 'IN_PROGRESS',
  },
  {
    id: 'wo-2-sub',
    parentId: 'wo-2',
    level: 1,
    code: 'BLK-FRM-DIBO-202',
    name: 'Aqueous Decoction Phase 2 (Jamun & Karela)',
    lineId: 'line-02',
    lineName: 'Line 02 - Syrup Bottling Line',
    shift: 1,
    primaryQty: 1800,
    primaryUom: 'L',
    status: 'IN_PROGRESS',
  },
  {
    id: 'wo-2-mat-1',
    parentId: 'wo-2-sub',
    level: 2,
    code: 'RAW-BOT-GIL-022',
    name: 'Giloy Aqueous Standardized Extract',
    lineId: 'line-02',
    lineName: 'Line 02 - Syrup Bottling Line',
    shift: 1,
    primaryQty: 220,
    primaryUom: 'L',
    status: 'STAGED',
  },

  // Parent 3 (Line 03)
  {
    id: 'wo-3',
    level: 0,
    code: 'ORD-2026-9043',
    name: 'Orthodoc Powder Sachet Dispenser 30x10g',
    lineId: 'line-03',
    lineName: 'Line 03 - Powder Sachet Fill',
    shift: 2,
    primaryQty: 5000,
    primaryUom: 'Box',
    secondaryQty: 1500,
    secondaryUom: 'KG',
    status: 'CONFIRMED',
  },
  {
    id: 'wo-3-sub',
    parentId: 'wo-3',
    level: 1,
    code: 'BLK-FRM-ORTO-303',
    name: 'Micronized Herbal Compound Mix Lot 303',
    lineId: 'line-03',
    lineName: 'Line 03 - Powder Sachet Fill',
    shift: 2,
    primaryQty: 1500,
    primaryUom: 'KG',
    status: 'STAGED',
  },
];

// Warehouse Outbound Transfer Orders (Anantshriveda)
const warehouseTransferOrders: WorkOrderItem[] = [
  {
    id: 'sto-101',
    level: 0,
    code: 'STO-2026-4401',
    name: 'Bulk Botanical Staging Lot for Food Plant F-119',
    lineId: 'bay-a',
    lineName: 'Bay A - Botanical Staging',
    shift: 1,
    primaryQty: 850,
    primaryUom: 'KG',
    status: 'DISPATCH_READY',
    supplierFacility: 'Anantshriveda (RM Warehouse H-9)',
    destFacility: 'Asclepius (Food Plant F-119)',
  },
  {
    id: 'sto-101-sub1',
    parentId: 'sto-101',
    level: 1,
    code: 'LOT-ASH-2026-09',
    name: 'Ashwagandha Extract 2.5% Drum Pack (150kg)',
    lineId: 'bay-a',
    lineName: 'Bay A - Botanical Staging',
    shift: 1,
    primaryQty: 150,
    primaryUom: 'KG',
    status: 'STAGED',
    supplierFacility: 'Anantshriveda (RM Warehouse H-9)',
    destFacility: 'Asclepius (Food Plant F-119)',
  },
  {
    id: 'sto-101-sub2',
    parentId: 'sto-101',
    level: 1,
    code: 'LOT-BRA-2026-14',
    name: 'Brahmi Whole Leaf Shredded (700kg)',
    lineId: 'bay-a',
    lineName: 'Bay A - Botanical Staging',
    shift: 1,
    primaryQty: 700,
    primaryUom: 'KG',
    status: 'STAGED',
    supplierFacility: 'Anantshriveda (RM Warehouse H-9)',
    destFacility: 'Asclepius (Food Plant F-119)',
  },
  {
    id: 'sto-102',
    level: 0,
    code: 'STO-2026-4402',
    name: 'Primary Packaging Bottle Transfer for Plant H1-2213',
    lineId: 'bay-b',
    lineName: 'Bay B - Packaging & Containers',
    shift: 1,
    primaryQty: 10000,
    primaryUom: 'Ea',
    status: 'IN_PROGRESS',
    supplierFacility: 'Anantshriveda (RM Warehouse H-9)',
    destFacility: 'Asclepius (Food Plant H1-2213)',
  },
];

export const InteractiveWorkbench: Story = {
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
  render: () => {
    // 1. Enterprise Scope Picker State
    const [scope, setScope] = useState<EntityFacilitySelection>({
      entityId: 'ent-asclepius',
      facilityId: 'fac-f119',
    });

    // 2. Responsive Panes Open / Collapse State
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isInspectorOpen, setIsInspectorOpen] = useState(false);
    const [navCollapsed, setNavCollapsed] = useState(false);
    const [inspectorCollapsed, setInspectorCollapsed] = useState(false);

    // 3. Operational Filter States
    const [activeShift, setActiveShift] = useState<1 | 2 | 3>(1);
    const [selectedLineId, setSelectedLineId] = useState<string>('all');
    const [selectedRecordId, setSelectedRecordId] = useState<string>('wo-1-mat-1');

    // 4. TreeGrid Expand/Collapse State
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
      'wo-1': true,
      'wo-1-sub': true,
      'wo-2': true,
      'wo-3': false,
      'sto-101': true,
      'sto-102': true,
    });

    const [activeMobileTab, setActiveMobileTab] = useState<'nav' | 'main' | 'inspector'>('main');

    const toggleRow = (id: string, expanded: boolean) => {
      setExpandedRows((prev) => ({ ...prev, [id]: expanded }));
    };

    const _handleToggleNav = () => {
      setIsNavOpen((prev) => {
        const next = !prev;
        if (next) {
          setIsInspectorOpen(false);
          setNavCollapsed(false);
          setActiveMobileTab('nav');
        } else {
          setActiveMobileTab('main');
        }
        return next;
      });
    };

    const _handleToggleInspector = () => {
      setIsInspectorOpen((prev) => {
        const next = !prev;
        if (next) {
          setIsNavOpen(false);
          setInspectorCollapsed(false);
          setActiveMobileTab('inspector');
        } else {
          setActiveMobileTab('main');
        }
        return next;
      });
    };

    const handleCloseNav = () => {
      setIsNavOpen(false);
      setActiveMobileTab('main');
      if (typeof window !== 'undefined' && window.innerWidth > 1024) {
        setNavCollapsed(true);
      }
    };

    const handleCloseInspector = () => {
      setIsInspectorOpen(false);
      setActiveMobileTab('main');
      if (typeof window !== 'undefined' && window.innerWidth > 1024) {
        setInspectorCollapsed(true);
      }
    };

    // Determine current entity and facility
    const currentEntity = defaultEnterpriseEntities.find((e) => e.id === scope.entityId) || defaultEnterpriseEntities[0];
    const currentFacility = currentEntity.facilities.find((f) => f.id === scope.facilityId) || currentEntity.facilities[0];
    const isWarehouse = currentFacility.type === 'warehouse';

    // Lines / Bays depending on facility type
    const plantLines = [
      { id: 'all', name: 'All Plant Lines', sub: 'Overview' },
      { id: 'line-01', name: 'Line 01 - Packaging (High Speed)', sub: 'OEE 94.2% · Running' },
      { id: 'line-02', name: 'Line 02 - Syrup Bottling Line', sub: 'OEE 88.0% · Material Risk' },
      { id: 'line-03', name: 'Line 03 - Powder Sachet Fill', sub: 'OEE 96.1% · Idle' },
    ];

    const warehouseBays = [
      { id: 'all', name: 'All Warehouse Bays', sub: 'Overview' },
      { id: 'bay-a', name: 'Bay A - Botanical Staging', sub: '12 Pallets Staged · Forklift Active' },
      { id: 'bay-b', name: 'Bay B - Packaging & Containers', sub: '4 Trucks Loading · On Schedule' },
    ];

    const currentResourceList = isWarehouse ? warehouseBays : plantLines;

    // Filtered orders
    const activeDataset = isWarehouse ? warehouseTransferOrders : plantWorkOrders;

    const visibleOrders = useMemo(() => {
      const isItemVisible = (item: WorkOrderItem): boolean => {
        if (!item.parentId) return true;
        const parent = activeDataset.find((i) => i.id === item.parentId);
        if (!parent) return true;
        if (!expandedRows[parent.id]) return false;
        return isItemVisible(parent);
      };

      return activeDataset.filter((item) => {
        // Shift filter (only apply to root orders)
        if (item.level === 0 && item.shift !== activeShift) return false;
        // Line filter
        if (selectedLineId !== 'all' && item.lineId !== selectedLineId) return false;
        // Expansion hierarchy visibility
        return isItemVisible(item);
      });
    }, [activeDataset, activeShift, selectedLineId, expandedRows]);

    // Selected record for Inspector
    const selectedRecord = useMemo(() => {
      return (
        activeDataset.find((i) => i.id === selectedRecordId) ||
        activeDataset.find((i) => i.code === selectedRecordId) ||
        activeDataset[0]
      );
    }, [activeDataset, selectedRecordId]);

    // Dynamic Allocation Quantity synced with selectedRecord
    const [allocatedQty, setAllocatedQty] = useState<number>(selectedRecord.primaryQty);
    useEffect(() => {
      setAllocatedQty(selectedRecord.primaryQty);
    }, [selectedRecord.id, selectedRecord.primaryQty]);

    return (
      <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Workbench3PaneLayout
          navCollapsed={navCollapsed}
          onNavCollapsedChange={setNavCollapsed}
          inspectorCollapsed={inspectorCollapsed}
          onInspectorCollapsedChange={setInspectorCollapsed}
          enableResize={true}
          activeMobileTab={activeMobileTab}
          onMobileTabChange={setActiveMobileTab}
          mobileNavTabLabel={
            <>
              <span className="ds-workbench-mobile-tab__icon" aria-hidden="true">☰</span>
              <span className="ds-workbench-mobile-tab__text">Resources</span>
            </>
          }
          mobileMainTabLabel={
            <>
              <span className="ds-workbench-mobile-tab__icon" aria-hidden="true">📊</span>
              <span className="ds-workbench-mobile-tab__text">Schedule</span>
              <span className="ds-workbench-mobile-tab__badge">({visibleOrders.length})</span>
            </>
          }
          mobileInspectorTabLabel={
            <>
              <span className="ds-workbench-mobile-tab__icon" aria-hidden="true">📋</span>
              <span className="ds-workbench-mobile-tab__text">Inspector</span>
            </>
          }
          isNavOpen={isNavOpen}
          onNavOpenChange={setIsNavOpen}
          isInspectorOpen={isInspectorOpen}
          onInspectorOpenChange={setIsInspectorOpen}
          workspaceHeader={
            <div
              style={{
                background: 'var(--color-surface-card, #FFFFFF)',
                borderBottom: '1px solid var(--color-neutral-200, #E5E7EB)',
              }}
            >
              {/* Row 1: Title + scope selectors — always visible */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '12px', flexWrap: 'wrap' }}>
                {navCollapsed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ds-workbench-header-expand-btn ds-workbench-header-expand-btn--nav"
                    onClick={() => setNavCollapsed(false)}
                    aria-expanded={false}
                    aria-label="Expand resources panel (Ctrl+B)"
                    title="Expand Resources Panel (Ctrl+B)"
                    style={{
                      padding: '6px',
                      color: '#2563EB',
                      backgroundColor: '#EFF6FF',
                      borderRadius: '6px',
                    }}
                  >
                    <SidebarLeftExpandIcon />
                  </Button>
                )}
                <HStack gap={3} align="center" style={{ flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
                  <Text size="base" weight="bold">
                    Meridian PPC Planner Workbench
                  </Text>
                  <EntityFacilitySelector
                    value={scope}
                    onChange={(newScope) => {
                      setScope(newScope);
                      setSelectedLineId('all');
                      const isNewWh = newScope.facilityId.includes('h9') || newScope.facilityId.includes('f25');
                      const newSet = isNewWh ? warehouseTransferOrders : plantWorkOrders;
                      setSelectedRecordId(newSet[0]?.id || '');
                    }}
                  />
                  <StaleDataPill
                    lastSyncTime={new Date(Date.now() - 2.5 * 60 * 1000)}
                    staleThresholdMinutes={5}
                    title="ERP MRP Sync"
                    onRefresh={() => alert('Triggering live MRP recalculation...')}
                  />
                </HStack>
                {inspectorCollapsed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ds-workbench-header-expand-btn ds-workbench-header-expand-btn--inspector"
                    onClick={() => setInspectorCollapsed(false)}
                    aria-expanded={false}
                    aria-label="Expand inspector panel"
                    title="Expand Inspector Panel"
                    style={{
                      padding: '6px',
                      color: '#2563EB',
                      backgroundColor: '#EFF6FF',
                      borderRadius: '6px',
                    }}
                  >
                    <SidebarRightExpandIcon />
                  </Button>
                )}
              </div>
            </div>
          }
          navPane={
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="ds-workbench-pane-header">
                <span className="ds-workbench-pane-title" style={{ color: '#475569' }}>
                  Horizon & Resources
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="ds-workbench-pane-toggle"
                    aria-label="Collapse Horizon & Resources Panel"
                    title="Collapse Horizon & Resources Panel"
                    onClick={handleCloseNav}
                  >
                    <SidebarLeftCollapseIcon />
                  </button>
                </div>
              </div>
              <div style={{ padding: '16px', flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain' }}>
                <VStack gap={4}>
                  {/* Shift Selector */}
                  <div>
                    <Text size="xs" weight="bold" color="secondary" style={{ textTransform: 'uppercase' }}>
                      Active Shift Horizon
                    </Text>
                    <HStack gap={1} style={{ marginTop: '8px' }}>
                      {[1, 2, 3].map((shiftNum) => (
                        <Button
                          key={shiftNum}
                          size="sm"
                          variant={activeShift === shiftNum ? 'primary' : 'outline'}
                          onClick={() => setActiveShift(shiftNum as 1 | 2 | 3)}
                          style={{ flex: 1, fontSize: '11px', padding: '4px 6px' }}
                        >
                          Shift {shiftNum}
                        </Button>
                      ))}
                    </HStack>
                  </div>

                  {/* Production Lines / Warehouse Bays */}
                  <div>
                    <Text size="xs" weight="bold" color="secondary" style={{ textTransform: 'uppercase' }}>
                      {isWarehouse ? 'Storage Bays & Dock Doors' : 'Production Lines'}
                    </Text>
                    <VStack gap={1} style={{ marginTop: '8px' }}>
                      {currentResourceList.map((res) => {
                        const isSelected = selectedLineId === res.id;
                        return (
                          <Box
                            key={res.id}
                            p={2}
                            onClick={() => setSelectedLineId(res.id)}
                            style={{
                              background: isSelected ? 'var(--color-primary-50, #EFF6FF)' : 'var(--color-surface-card, #FFFFFF)',
                              border: `1px solid ${isSelected ? 'var(--color-primary-500, #3B82F6)' : 'var(--color-neutral-200, #E5E7EB)'}`,
                              borderRadius: '6px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <Text size="xs" weight={isSelected ? 'bold' : 'semibold'} color={isSelected ? 'brand' : 'primary'}>
                              {res.name}
                            </Text>
                            <Text size="xs" color="secondary">{res.sub}</Text>
                          </Box>
                        );
                      })}
                    </VStack>
                  </div>

                  {/* Supply Chain Dynamic Context Box */}
                  <Box
                    p={3}
                    isCard
                    style={{
                      background: isWarehouse ? 'var(--color-primary-50, #EFF6FF)' : 'var(--color-warning-50, #FFFBEB)',
                      borderColor: isWarehouse ? 'var(--color-primary-200, #BFDBFE)' : 'var(--color-warning-200, #FDE68A)',
                    }}
                  >
                    <Text size="xs" weight="bold" style={{ color: isWarehouse ? '#1E40AF' : '#92400E' }}>
                      {isWarehouse ? 'INTERCOMPANY DISPATCH HUB' : 'INTERCOMPANY SUPPLY PEGGING'}
                    </Text>
                    <Text size="xs" style={{ color: isWarehouse ? '#1D4ED8' : '#B45309', marginTop: '4px' }}>
                      {isWarehouse
                        ? 'Staging botanical & packaging lots for direct transfer to Asclepius Food Processing Plants (F-119, H1-2213).'
                        : 'Anantshriveda RM Warehouse H-9 provides primary botanical buffer stock for this plant schedule.'}
                    </Text>
                  </Box>
                </VStack>
              </div>
            </div>
          }
          mainPane={
            <div style={{ padding: '20px' }}>
              <VStack gap={3}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <Text size="base" weight="bold">
                      {isWarehouse ? 'Outbound Stock Transfer Orders (STOs) & Picking Schedule' : 'Daily Production Schedule & Material Pegging'}
                    </Text>
                    <Text size="xs" color="secondary">
                      Active Facility: <strong>{currentFacility.name}</strong> ({currentEntity.name}) · Shift {activeShift}
                    </Text>
                  </div>
                  <HStack gap={2} align="center">
                    <Badge variant="brand">{visibleOrders.length} Records Visible</Badge>
                    {!isWarehouse && <Badge variant="danger">1 Raw Material Deficit</Badge>}
                  </HStack>
                </div>

                <Table density="compact" bordered hoverable>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ width: '45%' }}>
                        {isWarehouse ? 'OUTBOUND STO / STAGED LOTS' : 'WORK ORDER / BOM COMPONENT'}
                      </TableHead>
                      <TableHead align="right">QUANTITY (DUAL UOM)</TableHead>
                      <TableHead>RESOURCE / LINE</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead align="center">INSPECT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleOrders.map((item) => {
                      const hasChildren = activeDataset.some((child) => child.parentId === item.id);
                      const isExpanded = !!expandedRows[item.id];
                      const isSelected = selectedRecord.id === item.id;
                      const isDeficit = item.status === 'DEFICIT';

                      return (
                        <TableRow
                          key={item.id}
                          style={{
                            backgroundColor: isDeficit
                              ? 'var(--color-danger-50, #FEF2F2)'
                              : isSelected
                              ? 'var(--color-primary-50, #EFF6FF)'
                              : undefined,
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setSelectedRecordId(item.id);
                            if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
                              setIsInspectorOpen(true);
                              setIsNavOpen(false);
                              setActiveMobileTab('inspector');
                            }
                          }}
                        >
                          <TreeGridCell
                            level={item.level}
                            expanded={isExpanded}
                            hasChildren={hasChildren}
                            onToggle={(expanded) => toggleRow(item.id, expanded)}
                          >
                            <span style={{ fontWeight: item.level === 0 ? 600 : 500, color: isDeficit ? 'var(--color-danger-700, #B91C1C)' : undefined }}>
                              {item.code}: {item.name}
                            </span>
                          </TreeGridCell>

                          <TableCell align="right">
                            <DualUomBadge
                              primaryQty={item.primaryQty}
                              primaryUom={item.primaryUom}
                              secondaryQty={item.secondaryQty}
                              secondaryUom={item.secondaryUom}
                            />
                          </TableCell>

                          <TableCell style={{ fontSize: '12px' }}>{item.lineName}</TableCell>

                          <TableCell>
                            <Badge
                              variant={
                                item.status === 'CONFIRMED'
                                  ? 'brand'
                                  : item.status === 'IN_PROGRESS'
                                  ? 'info'
                                  : item.status === 'DEFICIT'
                                  ? 'danger'
                                  : 'success'
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>

                          <TableCell align="center">
                            <Button
                              size="sm"
                              variant={isDeficit ? 'primary' : 'outline'}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRecordId(item.id);
                                setInspectorCollapsed(false);
                                setIsInspectorOpen(true);
                                setIsNavOpen(false);
                                setActiveMobileTab('inspector');
                              }}
                            >
                              {isDeficit ? 'Stage STO' : 'Inspect'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </VStack>
            </div>
          }
          inspectorPane={
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="ds-workbench-pane-header">
                <span className="ds-workbench-pane-title" style={{ color: '#475569' }}>Record Inspector</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    className="ds-workbench-pane-toggle"
                    aria-label="Collapse Record Inspector Panel"
                    title="Collapse Record Inspector Panel"
                    onClick={handleCloseInspector}
                  >
                    <SidebarRightCollapseIcon />
                  </button>
                </div>
              </div>
              <div style={{ padding: '20px', flex: 1, minHeight: 0, overflowY: 'auto', overscrollBehavior: 'contain' }}>
                <VStack gap={4}>
                  <Box p={3} isCard>
                    <VStack gap={2}>
                      <Text size="xs" color="secondary" weight="semibold">SELECTED RECORD</Text>
                      <Text size="sm" weight="bold">{selectedRecord.code}</Text>
                      <Text size="xs">{selectedRecord.name}</Text>
                      <HStack gap={2} style={{ marginTop: '4px', flexWrap: 'wrap' }}>
                        <Badge variant={selectedRecord.status === 'DEFICIT' ? 'danger' : 'brand'}>
                          {selectedRecord.status}
                        </Badge>
                        <Badge variant="neutral">Shift {selectedRecord.shift}</Badge>
                      </HStack>
                      <HStack justify="between" align="center" style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed var(--ds-semantic-color-border-subtle, #e2e8f0)' }}>
                        <Text size="xs" color="secondary">Batch Planned Qty:</Text>
                        <DualUomBadge
                          primaryQty={selectedRecord.primaryQty}
                          primaryUom={selectedRecord.primaryUom}
                          secondaryQty={selectedRecord.secondaryQty}
                          secondaryUom={selectedRecord.secondaryUom}
                        />
                      </HStack>
                    </VStack>
                  </Box>

                  {/* Supply Chain Action Form (dynamically keyed by selected record) */}
                  <VStack key={selectedRecord.id} gap={3}>
                    <Text size="xs" weight="bold" color="secondary" style={{ textTransform: 'uppercase' }}>
                      {selectedRecord.status === 'DEFICIT' ? '⚡ Emergency Intercompany STO Transfer' : 'Allocation & Dispatch Parameters'}
                    </Text>

                    {selectedRecord.deficitNote && (
                      <Box p={2} style={{ background: 'var(--color-danger-50, #FEF2F2)', border: '1px solid var(--color-danger-200, #FECACA)', borderRadius: '4px' }}>
                        <Text size="xs" style={{ color: 'var(--color-danger-700, #B91C1C)', fontWeight: 600 }}>
                          {selectedRecord.deficitNote}
                        </Text>
                      </Box>
                    )}

                    <div>
                      <label htmlFor="story-workbench3pane-801" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700, #374151)' }}>
                        Assigned Work Center / Bay
                      </label>
                      <input id="story-workbench3pane-801"
                        type="text"
                        readOnly
                        value={selectedRecord.lineName}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          fontSize: '12px',
                          borderRadius: '4px',
                          border: '1px solid var(--color-neutral-300, #D1D5DB)',
                          background: 'var(--color-neutral-50, #F9FAFB)',
                          marginTop: '4px',
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="story-workbench3pane-821" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700, #374151)' }}>
                        Supplying Entity & Facility
                      </label>
                      <input id="story-workbench3pane-821"
                        type="text"
                        readOnly
                        value={selectedRecord.supplierFacility || 'Anantshriveda Pvt Ltd (RM Warehouse H-9)'}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          fontSize: '12px',
                          borderRadius: '4px',
                          border: '1px solid var(--color-neutral-300, #D1D5DB)',
                          background: 'var(--color-neutral-50, #F9FAFB)',
                          marginTop: '4px',
                        }}
                      />
                    </div>

                    <div>
                      <label htmlFor="story-workbench3pane-841" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700, #374151)' }}>
                        Destination Entity & Facility
                      </label>
                      <input id="story-workbench3pane-841"
                        type="text"
                        readOnly
                        value={selectedRecord.destFacility || 'Asclepius Wellness Pvt Ltd (Food Plant F-119)'}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          fontSize: '12px',
                          borderRadius: '4px',
                          border: '1px solid var(--color-neutral-300, #D1D5DB)',
                          background: 'var(--color-neutral-50, #F9FAFB)',
                          marginTop: '4px',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-neutral-700, #374151)' }}>
                        Allocation Quantity ({selectedRecord.primaryUom})
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <input
                          aria-label="Allocation quantity"
                          type="number"
                          value={allocatedQty}
                          onChange={(e) => setAllocatedQty(Number(e.target.value) || 0)}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            borderRadius: '4px',
                            border: '1px solid var(--color-neutral-300, #D1D5DB)',
                            background: 'var(--color-surface-card, #FFFFFF)',
                          }}
                        />
                        <Badge variant="neutral">{selectedRecord.primaryUom}</Badge>
                        {selectedRecord.secondaryUom && selectedRecord.secondaryQty && selectedRecord.primaryQty > 0 && (
                          <Text size="xs" color="secondary">
                            ≈ {(allocatedQty * (selectedRecord.secondaryQty / selectedRecord.primaryQty)).toFixed(1)} {selectedRecord.secondaryUom}
                          </Text>
                        )}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={selectedRecord.status === 'DEFICIT' ? 'primary' : 'outline'}
                      style={{ width: '100%', marginTop: '8px' }}
                      onClick={() => alert(`Committed allocation of ${allocatedQty} ${selectedRecord.primaryUom} for [${selectedRecord.code}] ${selectedRecord.name}`)}
                    >
                      {selectedRecord.status === 'DEFICIT' ? '⚡ Commit Intercompany STO Transfer' : 'Update Batch Schedule'}
                    </Button>
                  </VStack>
                </VStack>
              </div>
            </div>
          }
        />
      </div>
    );
  },
};
