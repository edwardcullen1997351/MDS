/* eslint-disable jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-noninteractive-element-to-interactive-role -- scrollable workbench panes and treegrid rows expose intentional keyboard navigation */
import React, { useState, useEffect, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import './planner-workbench.css';
import {
  Workbench3PaneLayout,
  EntityFacilitySelector,
  TreeGridCell,
  TimeHorizonStepper,
  DualUomBadge,
  StaleDataPill,
  ConcurrentConflictResolver,
  OptimisticDragReschedule,
  StockRunwayHorizon,
  LeadTimeTransferGlyph,
  IntercompanyStockRibbon,
  SegmentedControl,
  CommandToolbarGroup,
  Button,
  Badge,
  EmptyState,
  Skeleton,
} from '@ds/react';
import type { EntityFacilitySelection, TimeHorizonBucket } from '@ds/react';

const meta: Meta = {
  title: 'Reference Assemblies/Planner Workbench',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Canonical Planner Workbench Reference Assembly (ra-planner-workbench). Orchestrates multi-plant supply chain, time-phased matrix planning, intercompany STO balancing, optimistic shift dispatching, and concurrent allocation conflict resolution connecting Asclepius (Plant F-119) and Anantshriveda (RM Warehouse H-9).',
      },
    },
  },
};
export default meta;

const PaneToggleIcon = ({ side, expand }: { side: 'left' | 'right'; expand: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="18" height="18" x="3" y="3" rx="3" />
    <path d={side === 'left' ? 'M9 3v18' : 'M15 3v18'} />
    <path d={side === 'left' ? (expand ? 'm11 9 3 3-3 3' : 'm14 9-3 3 3 3') : (expand ? 'm14 9-3 3 3 3' : 'm10 9 3 3-3 3')} />
  </svg>
);

const reorderDateFromStockout = (stockoutDate: string, reorderDays: number): string | undefined => {
  const match = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2})$/.exec(stockoutDate);
  if (!match) return undefined;
  const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(match[1]);
  const date = new Date(Date.UTC(2026, month, Number(match[2]) - reorderDays));
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' }).format(date);
};

export type WorkbenchScenario =
  | 'ready'
  | 'concurrent-conflict'
  | 'optimistic-rebound'
  | 'stale'
  | 'stress-high-density'
  | 'anantshriveda-warehouse'
  | 'minimum-content'
  | 'long-labels'
  | 'missing-data'
  | 'loading'
  | 'partial-loading'
  | 'empty-state'
  | 'error-state'
  | 'disabled-actions';

interface ResourceItem {
  id: string;
  name: string;
  level: number;
  hasChildren: boolean;
  expanded?: boolean;
  capacity: string;
  orderCount: number;
}

interface OrderDetail {
  id: string;
  code: string;
  name: string;
  batch?: string;
  line?: string;
  quantity: number;
  primaryUom: string;
  secondaryQuantity?: number;
  secondaryUom?: string;
  conversionRatio?: string;
  scheduledDate: string;
  allocationStatus: string;
  allocatedQty: number;
  requestedUom: string;
  materialCode: string;
}

interface WorkbenchViewProps {
  initialScenario?: WorkbenchScenario;
  showHarness?: boolean;
}

const createCurrentSyncTime = (): Date => new Date();
const createStaleSyncTime = (): Date => new Date(Date.now() - 360000);

const WorkbenchExperience: React.FC<WorkbenchViewProps> = ({
  initialScenario = 'ready',
  showHarness = false,
}) => {
  // 1. Deterministic Scenario Parameter via URL or local state
  const urlScenario = typeof window !== 'undefined'
    ? (new URLSearchParams(window.location.search).get('scenario') as WorkbenchScenario | null)
    : null;

  const [scenario, setScenario] = useState<WorkbenchScenario>(urlScenario || initialScenario);

  // 2. Multi-Plant Entity Scope
  const [entitySelection, setEntitySelection] = useState<EntityFacilitySelection>({
    entityId: scenario === 'anantshriveda-warehouse' ? 'ent-anantshriveda' : 'ent-asclepius',
    facilityId: scenario === 'anantshriveda-warehouse' ? 'fac-h9' : 'fac-f119',
  });

  const isAsclepius = entitySelection.entityId === 'ent-asclepius';

  // 3. View mode: Time-Phased Matrix vs Optimistic Reschedule
  const [activeCenterView, setActiveCenterView] = useState<'matrix' | 'reschedule'>(
    scenario === 'optimistic-rebound' ? 'reschedule' : 'matrix'
  );

  // 4. Time Horizon Stepper State
  const [currentBucket, setCurrentBucket] = useState<TimeHorizonBucket>('day');

  // 5. Stale Data Simulation
  const [syncTime, setSyncTime] = useState<Date>(() =>
    scenario === 'stale' ? createStaleSyncTime() : createCurrentSyncTime()
  );

  // 6. Conflict Drawer State (ETag 409)
  const [isConflictOpen, setIsConflictOpen] = useState<boolean>(scenario === 'concurrent-conflict');
  const [bannerNotice, setBannerNotice] = useState<{ message: string; type: 'info' | 'warning' | 'danger' } | null>(
    scenario === 'stale'
      ? { message: 'Warning: Inventory matrix is showing cached telemetry (6m stale). Click refresh to synchronize.', type: 'warning' }
      : scenario === 'error-state'
      ? { message: 'Critical Error [FAULT-MES-503-F119-DOWNSTREAM]: Connection to Asclepius MES Plant PL-04 lost. Running on isolated buffer.', type: 'danger' }
      : scenario === 'disabled-actions'
      ? { message: 'Read-Only Mode: Current operator role has viewer permissions only. Dispatch actions disabled.', type: 'info' }
      : scenario === 'loading'
      ? { message: 'Loading live planning telemetry from Asclepius MES PL-04...', type: 'info' }
      : null
  );

  // P1: Undo Notification State (8s window, Alt+Z / Ctrl+Z support)
  interface UndoNotification {
    id: string;
    message: string;
    onUndo: () => void;
  }
  const [undoNotification, setUndoNotification] = useState<UndoNotification | null>(null);

  // P2: Stock runway visual legend disclosure
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);

  useEffect(() => {
    const tabbedViewport = window.matchMedia('(max-width: 1024px)');
    const restoreTabbedPanes = () => {
      if (tabbedViewport.matches) {
        setNavCollapsed(false);
        setInspectorCollapsed(false);
      }
    };
    restoreTabbedPanes();
    tabbedViewport.addEventListener('change', restoreTabbedPanes);
    return () => tabbedViewport.removeEventListener('change', restoreTabbedPanes);
  }, []);

  // Power-path: Active row index for J / K keyboard navigation
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0);

  // Auto-dismiss undo notification after 8 seconds
  useEffect(() => {
    if (!undoNotification) return;
    const timer = setTimeout(() => {
      setUndoNotification(null);
    }, 8000);
    return () => clearTimeout(timer);
  }, [undoNotification]);

  // 7. Resource Tree State (Left Pane)
  const initialAsclepiusResources: ResourceItem[] = useMemo(() => {
    if (scenario === 'minimum-content') {
      return [
        { id: 'line-01', name: 'Line 01 - Bottling', level: 0, hasChildren: false, capacity: '92% Load', orderCount: 3 },
      ];
    }
    if (scenario === 'long-labels') {
      return [
        {
          id: 'plant-f119-long',
          name: 'Asclepius Comprehensive Multi-Facility Botanical Extraction & Advanced Liquid Packaging Complex F-119 Campus North',
          level: 0,
          hasChildren: true,
          expanded: true,
          capacity: '92.4% Verified Operational Load',
          orderCount: 28,
        },
        {
          id: 'line-02-long',
          name: 'Line 02 — High-Capacity Automated Continuous Multi-Stage Maceration, Cold Percolation & Hydro-Ethanolic Extract Blending Subsystem',
          level: 1,
          hasChildren: false,
          capacity: '1,420 / 1,500 L Maximum Throughput',
          orderCount: 9,
        },
      ];
    }
    if (scenario === 'missing-data') {
      return [
        { id: 'line-01', name: 'Line 01 - Unassigned Spec', level: 0, hasChildren: false, capacity: '—', orderCount: 0 },
        { id: 'line-02', name: 'Line 02 - Extraction Tank', level: 0, hasChildren: false, capacity: '—', orderCount: 0 },
      ];
    }
    if (scenario === 'empty-state') {
      return [];
    }
    return [
      { id: 'plant-f119', name: 'Asclepius Plant F-119', level: 0, hasChildren: true, expanded: true, capacity: '92% Load', orderCount: 28 },
      { id: 'line-01', name: 'Line 01 - High Speed Liquid Bottling', level: 1, hasChildren: false, capacity: '1,850 / 2,000 L', orderCount: 12 },
      { id: 'line-02', name: 'Line 02 - Syrup & Extract Blending', level: 1, hasChildren: false, capacity: '1,420 / 1,500 L', orderCount: 9 },
      { id: 'line-03', name: 'Line 03 - Solid Dose & Capsules', level: 1, hasChildren: false, capacity: '820 / 1,200 KG', orderCount: 5 },
      { id: 'line-04', name: 'Line 04 - Packaging & Boxing', level: 1, hasChildren: false, capacity: '95% Speed', orderCount: 2 },
    ];
  }, [scenario]);

  const initialAnantshrivedaResources: ResourceItem[] = useMemo(() => {
    if (scenario === 'empty-state') return [];
    return [
      { id: 'wh-h9', name: 'Anantshriveda Central RM Warehouse H-9', level: 0, hasChildren: true, expanded: true, capacity: '78% Vol', orderCount: 44 },
      { id: 'bay-a', name: 'Bay A - Raw Extract Cold Storage (4°C)', level: 1, hasChildren: false, capacity: '4,200 / 5,000 KG', orderCount: 18 },
      { id: 'bay-b', name: 'Bay B - Bulk Liquids & Drums', level: 1, hasChildren: false, capacity: '8,500 / 10,000 L', orderCount: 14 },
      { id: 'bay-c', name: 'Bay C - QC Hold & Quarantine Zone', level: 1, hasChildren: false, capacity: '600 / 1,000 KG', orderCount: 8 },
      { id: 'bay-d', name: 'Bay D - STO Staging & Dispatch Docks', level: 1, hasChildren: false, capacity: 'Gate 1-4 Active', orderCount: 4 },
    ];
  }, [scenario]);

  const activeResourceData = isAsclepius
    ? initialAsclepiusResources
    : initialAnantshrivedaResources;
  const [resourceState, setResourceState] = useState(() => ({
    source: activeResourceData,
    resources: activeResourceData,
    selectedResourceId: activeResourceData[0]?.id || '',
  }));
  if (resourceState.source !== activeResourceData) {
    setResourceState({
      source: activeResourceData,
      resources: activeResourceData,
      selectedResourceId: activeResourceData[0]?.id || '',
    });
  }
  const resources = resourceState.resources;
  const selectedResourceId = resourceState.selectedResourceId;
  const setResources: React.Dispatch<React.SetStateAction<ResourceItem[]>> = (action) => {
    setResourceState((previous) => ({
      ...previous,
      resources: typeof action === 'function' ? action(previous.resources) : action,
    }));
  };
  const setSelectedResourceId: React.Dispatch<React.SetStateAction<string>> = (action) => {
    setResourceState((previous) => ({
      ...previous,
      selectedResourceId:
        typeof action === 'function' ? action(previous.selectedResourceId) : action,
    }));
  };

  // Handle tree expand/collapse
  const toggleExpand = (id: string) => {
    setResources((prev) =>
      prev.map((item) => (item.id === id ? { ...item, expanded: !item.expanded } : item))
    );
  };

  // 8. Dynamic Time Horizon Stepper State & Label Generation
  const [horizonOffset, setHorizonOffset] = useState<number>(0);

  const currentHorizonLabel = useMemo(() => {
    if (currentBucket === 'shift') {
      const shiftNum = ((horizonOffset % 3 + 3) % 3) + 1;
      return `01-Oct · Shift ${shiftNum}`;
    }
    if (currentBucket === 'day') {
      const day = 1 + horizonOffset;
      const formatted = day < 10 ? `0${day}` : `${day}`;
      return `${formatted}-Oct-2026`;
    }
    if (currentBucket === 'week') {
      const w = 40 + horizonOffset;
      return `W${w} (01–07 Oct)`;
    }
    const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const mIdx = Math.max(0, Math.min(months.length - 1, (horizonOffset % months.length + months.length) % months.length));
    return `${months[mIdx]} 2026`;
  }, [currentBucket, horizonOffset]);

  // 9. Work Order Definitions & Catalog Architecture
  const defaultOrder = useMemo<OrderDetail>(() => ({
    id: 'ord-102',
    code: 'ORD-2026-9042',
    name: 'Ashwagandha Restorative Syrup 200ml',
    batch: 'BAT-2026-OCT-0881',
    line: 'Line 02 - Syrup & Extract Blending',
    quantity: 1400,
    primaryUom: 'L',
    secondaryQuantity: 7000,
    secondaryUom: 'Btl',
    conversionRatio: '1 L = 5 Btl',
    scheduledDate: '2026-10-02 (Shift 2)',
    allocationStatus: 'CONFLICT_PREEMPTED',
    allocatedQty: 150,
    requestedUom: 'KG Extract',
    materialCode: 'RAW-EXT-ASH-05',
  }), []);

  interface MatrixMaterialRow {
    code: string;
    name: string;
    plant: string;
    lineId: string;
    lineName: string;
    onHandQty: number;
    uom: string;
    secondaryQty?: number;
    secondaryUom?: string;
    safeDays: number;
    reorderDays: number;
    stockoutDate: string;
    transitOrigin: string;
    transitDest: string;
    transitHours: number;
    transitStatus: 'SCHEDULED' | 'IN_TRANSIT' | 'DELAYED';
    order: OrderDetail;
  }

  const asclepiusCatalog: MatrixMaterialRow[] = useMemo(() => [
    {
      code: 'RAW-BOT-1000ML',
      name: 'Amber Glass Bottles 1000ml Type III',
      plant: 'Plant F-119',
      lineId: 'line-01',
      lineName: 'Line 01 - High Speed Liquid Bottling',
      onHandQty: 1200,
      uom: 'Btl',
      secondaryQty: 100,
      secondaryUom: 'Boxes',
      safeDays: 4,
      reorderDays: 4,
      stockoutDate: 'Oct 10',
      transitOrigin: 'Nashik-WH',
      transitDest: 'F-119',
      transitHours: 8,
      transitStatus: 'DELAYED',
      order: {
        id: 'ord-101',
        code: 'ORD-2026-9041',
        name: 'Bottling: Ashwagandha Syrup 1000ml',
        batch: 'BAT-2026-OCT-0880',
        line: 'Line 01 - High Speed Liquid Bottling',
        quantity: 1850,
        primaryUom: 'L',
        secondaryQuantity: 1850,
        secondaryUom: 'Btl',
        conversionRatio: '1 L = 1 Btl',
        scheduledDate: '2026-10-02 (Shift 1)',
        allocationStatus: 'ALLOCATED',
        allocatedQty: 1850,
        requestedUom: 'Btl',
        materialCode: 'RAW-BOT-1000ML',
      },
    },
    {
      code: 'RAW-CAP-ALU-28',
      name: 'Aluminum ROPP Closures 28mm Tamper-Evident',
      plant: 'Plant F-119',
      lineId: 'line-01',
      lineName: 'Line 01 - High Speed Liquid Bottling',
      onHandQty: 25000,
      uom: 'Caps',
      secondaryQty: 50,
      secondaryUom: 'Bags',
      safeDays: 15,
      reorderDays: 5,
      stockoutDate: 'Oct 25',
      transitOrigin: 'H-9',
      transitDest: 'F-119',
      transitHours: 4,
      transitStatus: 'IN_TRANSIT',
      order: {
        id: 'ord-101b',
        code: 'ORD-2026-9041',
        name: 'Bottling: Ashwagandha Syrup 1000ml',
        batch: 'BAT-2026-OCT-0880',
        line: 'Line 01 - High Speed Liquid Bottling',
        quantity: 1850,
        primaryUom: 'L',
        secondaryQuantity: 1850,
        secondaryUom: 'Btl',
        conversionRatio: '1 L = 1 Btl',
        scheduledDate: '2026-10-02 (Shift 1)',
        allocationStatus: 'ALLOCATED',
        allocatedQty: 1850,
        requestedUom: 'Caps',
        materialCode: 'RAW-CAP-ALU-28',
      },
    },
    {
      code: 'RAW-EXT-ASH-05',
      name: 'Ashwagandha Root Extract 2.5%',
      plant: 'Plant F-119',
      lineId: 'line-02',
      lineName: 'Line 02 - Syrup & Extract Blending',
      onHandQty: 350,
      uom: 'KG',
      secondaryQty: 14,
      secondaryUom: 'Drums',
      safeDays: 12,
      reorderDays: 6,
      stockoutDate: 'Oct 20',
      transitOrigin: 'H-9',
      transitDest: 'F-119',
      transitHours: 4,
      transitStatus: 'IN_TRANSIT',
      order: {
        id: 'ord-102',
        code: 'ORD-2026-9042',
        name: 'Ashwagandha Restorative Syrup 200ml',
        batch: 'BAT-2026-OCT-0881',
        line: 'Line 02 - Syrup & Extract Blending',
        quantity: 1400,
        primaryUom: 'L',
        secondaryQuantity: 7000,
        secondaryUom: 'Btl',
        conversionRatio: '1 L = 5 Btl',
        scheduledDate: '2026-10-02 (Shift 2)',
        allocationStatus: 'CONFLICT_PREEMPTED',
        allocatedQty: 150,
        requestedUom: 'KG Extract',
        materialCode: 'RAW-EXT-ASH-05',
      },
    },
    {
      code: 'RAW-ING-AML-109',
      name: 'Organic Amla Pulp Concentrate',
      plant: 'Plant F-119',
      lineId: 'line-02',
      lineName: 'Line 02 - Syrup & Extract Blending',
      onHandQty: 850,
      uom: 'KG',
      secondaryQty: 34,
      secondaryUom: 'Drums',
      safeDays: 20,
      reorderDays: 6,
      stockoutDate: 'Oct 28',
      transitOrigin: 'H-9',
      transitDest: 'F-119',
      transitHours: 6,
      transitStatus: 'SCHEDULED',
      order: {
        id: 'ord-105',
        code: 'ORD-2026-9045',
        name: 'Organic Amla Vitality Tonic 500ml',
        batch: 'BAT-2026-OCT-0885',
        line: 'Line 02 - Syrup & Extract Blending',
        quantity: 850,
        primaryUom: 'L',
        secondaryQuantity: 4250,
        secondaryUom: 'Btl',
        conversionRatio: '1 L = 5 Btl',
        scheduledDate: '2026-10-03 (Shift 1)',
        allocationStatus: 'ALLOCATED',
        allocatedQty: 850,
        requestedUom: 'KG Concentrate',
        materialCode: 'RAW-ING-AML-109',
      },
    },
    {
      code: 'RAW-EXT-BRA-10',
      name: 'Brahmi Extract 10% Bacosides',
      plant: 'Plant F-119',
      lineId: 'line-03',
      lineName: 'Line 03 - Solid Dose & Capsules',
      onHandQty: 420,
      uom: 'KG',
      secondaryQty: 17,
      secondaryUom: 'Drums',
      safeDays: 14,
      reorderDays: 4,
      stockoutDate: 'Oct 22',
      transitOrigin: 'H-9',
      transitDest: 'F-119',
      transitHours: 4,
      transitStatus: 'IN_TRANSIT',
      order: {
        id: 'ord-103',
        code: 'ORD-2026-9043',
        name: 'Brahmi Memory Complex Veg Capsules',
        batch: 'BAT-2026-OCT-0882',
        line: 'Line 03 - Solid Dose & Capsules',
        quantity: 820,
        primaryUom: 'KG',
        secondaryQuantity: 1640000,
        secondaryUom: 'Caps',
        conversionRatio: '1 KG = 2,000 Caps',
        scheduledDate: '2026-10-02 (Shift 3)',
        allocationStatus: 'SCHEDULED',
        allocatedQty: 820,
        requestedUom: 'KG Extract',
        materialCode: 'RAW-EXT-BRA-10',
      },
    },
    {
      code: 'PKG-BOX-CORR-01',
      name: 'Corrugated Outer Shipping Cartons 5-Ply',
      plant: 'Plant F-119',
      lineId: 'line-04',
      lineName: 'Line 04 - Packaging & Boxing',
      onHandQty: 2400,
      uom: 'Boxes',
      secondaryQty: 40,
      secondaryUom: 'Bundles',
      safeDays: 16,
      reorderDays: 5,
      stockoutDate: 'Oct 26',
      transitOrigin: 'Pune-Packaging',
      transitDest: 'F-119',
      transitHours: 2,
      transitStatus: 'SCHEDULED',
      order: {
        id: 'ord-104',
        code: 'ORD-2026-9044',
        name: 'Export Pallet Packaging & QC Staging',
        batch: 'BAT-2026-OCT-0883',
        line: 'Line 04 - Packaging & Boxing',
        quantity: 500,
        primaryUom: 'Boxes',
        secondaryQuantity: 50,
        secondaryUom: 'Pallets',
        conversionRatio: '10 Boxes = 1 Pallet',
        scheduledDate: '2026-10-02 (Shift 2)',
        allocationStatus: 'ALLOCATED',
        allocatedQty: 500,
        requestedUom: 'Boxes',
        materialCode: 'PKG-BOX-CORR-01',
      },
    },
  ], []);

  const anantshrivedaCatalog: MatrixMaterialRow[] = useMemo(() => [
    {
      code: 'RAW-EXT-ASH-05',
      name: 'Ashwagandha Root Extract 2.5% (Cold Staged)',
      plant: 'Warehouse H-9',
      lineId: 'bay-a',
      lineName: 'Bay A - Raw Extract Cold Storage (4°C)',
      onHandQty: 4200,
      uom: 'KG',
      secondaryQty: 168,
      secondaryUom: 'Drums',
      safeDays: 25,
      reorderDays: 8,
      stockoutDate: 'Nov 15',
      transitOrigin: 'Bay A',
      transitDest: 'F-119 Receiving',
      transitHours: 4,
      transitStatus: 'IN_TRANSIT',
      order: {
        id: 'sto-801',
        code: 'STO-2026-8801',
        name: 'Intercompany STO: Botanical Extract Transfer to F-119',
        batch: 'STO-ASH-0881',
        line: 'Bay A - Raw Extract Cold Storage (4°C)',
        quantity: 500,
        primaryUom: 'KG',
        secondaryQuantity: 20,
        secondaryUom: 'Drums',
        conversionRatio: '1 Drum = 25 KG',
        scheduledDate: '2026-10-02 (Shift 2)',
        allocationStatus: 'IN_TRANSIT',
        allocatedQty: 500,
        requestedUom: 'KG',
        materialCode: 'RAW-EXT-ASH-05',
      },
    },
    {
      code: 'RAW-ING-AML-109',
      name: 'Bulk Organic Amla Pulp Concentrate',
      plant: 'Warehouse H-9',
      lineId: 'bay-b',
      lineName: 'Bay B - Bulk Liquids & Drums',
      onHandQty: 8500,
      uom: 'L',
      secondaryQty: 42,
      secondaryUom: 'Drums',
      safeDays: 30,
      reorderDays: 10,
      stockoutDate: 'Nov 28',
      transitOrigin: 'Bay B',
      transitDest: 'F-119 Blending',
      transitHours: 6,
      transitStatus: 'SCHEDULED',
      order: {
        id: 'sto-802',
        code: 'STO-2026-8802',
        name: 'Bulk Concentrate STO: Chakan ➔ Pune F-119',
        batch: 'STO-AML-0882',
        line: 'Bay B - Bulk Liquids & Drums',
        quantity: 850,
        primaryUom: 'L',
        secondaryQuantity: 42,
        secondaryUom: 'Drums',
        conversionRatio: '1 Drum = 20 L',
        scheduledDate: '2026-10-02 (Shift 1)',
        allocationStatus: 'ALLOCATED',
        allocatedQty: 850,
        requestedUom: 'L',
        materialCode: 'RAW-ING-AML-109',
      },
    },
    {
      code: 'RAW-EXT-ASH-05-QC',
      name: 'Ashwagandha Dry Extract Lot #301 (HPLC Verification Hold)',
      plant: 'Warehouse H-9',
      lineId: 'bay-c',
      lineName: 'Bay C - QC Hold & Quarantine Zone',
      onHandQty: 600,
      uom: 'KG',
      secondaryQty: 24,
      secondaryUom: 'Drums',
      safeDays: 6,
      reorderDays: 6,
      stockoutDate: 'Oct 15',
      transitOrigin: 'QC Quarantine',
      transitDest: 'Bay A Staging',
      transitHours: 0,
      transitStatus: 'DELAYED',
      order: {
        id: 'qc-301',
        code: 'QC-LOT-2026-301',
        name: 'Quarantine Hold Lot: HPLC Verification Pending',
        batch: 'QC-HOLD-0301',
        line: 'Bay C - QC Hold & Quarantine Zone',
        quantity: 600,
        primaryUom: 'KG',
        secondaryQuantity: 24,
        secondaryUom: 'Drums',
        conversionRatio: '1 Drum = 25 KG',
        scheduledDate: '2026-10-02 (Shift 2)',
        allocationStatus: 'CONFLICT_PREEMPTED',
        allocatedQty: 0,
        requestedUom: 'KG',
        materialCode: 'RAW-EXT-ASH-05-QC',
      },
    },
    {
      code: 'RAW-EXT-ASH-05-STG',
      name: 'Staged Ashwagandha Extract for Plant F-119 Receiving',
      plant: 'Warehouse H-9',
      lineId: 'bay-d',
      lineName: 'Bay D - STO Staging & Dispatch Docks',
      onHandQty: 500,
      uom: 'KG',
      secondaryQty: 20,
      secondaryUom: 'Drums',
      safeDays: 14,
      reorderDays: 4,
      stockoutDate: 'Oct 20',
      transitOrigin: 'H-9 Dock 4',
      transitDest: 'F-119 Receiving',
      transitHours: 4,
      transitStatus: 'IN_TRANSIT',
      order: {
        id: 'sto-804',
        code: 'STO-2026-8804',
        name: 'NH-48 Express Freight Dispatch to Plant F-119',
        batch: 'STO-DISP-0884',
        line: 'Bay D - STO Staging & Dispatch Docks',
        quantity: 500,
        primaryUom: 'KG',
        secondaryQuantity: 20,
        secondaryUom: 'Drums',
        conversionRatio: '1 Drum = 25 KG',
        scheduledDate: '2026-10-02 (Shift 2)',
        allocationStatus: 'ALLOCATED',
        allocatedQty: 500,
        requestedUom: 'KG',
        materialCode: 'RAW-EXT-ASH-05-STG',
      },
    },
  ], []);

  // 10. Selected Work Order State
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(() => {
    if (scenario === 'empty-state') return null;
    if (scenario === 'minimum-content') {
      return {
        id: 'ord-01',
        code: 'ORD-MIN-1',
        name: 'Syrup 100ml',
        batch: 'BAT-01',
        line: 'Line 01',
        quantity: 100,
        primaryUom: 'L',
        secondaryQuantity: 500,
        secondaryUom: 'Btl',
        conversionRatio: '1 L = 5 Btl',
        scheduledDate: '01-Oct',
        allocationStatus: 'ALLOCATED',
        allocatedQty: 100,
        requestedUom: 'KG',
        materialCode: 'RAW-01',
      };
    }
    if (scenario === 'long-labels') {
      return {
        id: 'ord-102-long',
        code: 'ORD-2026-9042-EXT-SPL-BATCH-VERY-LONG-IDENTIFIER',
        name: 'Ashwagandha & Shatavari Bio-Enhancing Pediatric & Adult Restorative Syrup Extra Strength Formulation 200ml Amber Glass',
        batch: 'BAT-2026-OCT-0881-EXP-2028-REGULATORY-VALIDATED-CHAKAN-UNIT-4',
        line: 'Line 02 — High-Capacity Automated Continuous Multi-Stage Maceration, Cold Percolation & Hydro-Ethanolic Extract Blending Subsystem',
        quantity: 1400,
        primaryUom: 'L',
        secondaryQuantity: 7000,
        secondaryUom: 'Btl',
        conversionRatio: '1 L = 5 Btl (Standardized Bottling Specification)',
        scheduledDate: '2026-10-02 · Shift 2 Afternoon Dispatch (14:00–22:00 IST / Extended Capacity Window)',
        allocationStatus: 'CONFLICT_PREEMPTED',
        allocatedQty: 150,
        requestedUom: 'KG Extract',
        materialCode: 'RAW-EXT-ASHWAGANDHA-STANDARDIZED-HPLC-GRADE-2.5-WITHANOLIDES-BULK',
      };
    }
    if (scenario === 'missing-data') {
      return {
        id: 'ord-102-missing',
        code: 'ORD-2026-9042',
        name: 'Ashwagandha Restorative Syrup 200ml',
        batch: undefined,
        line: undefined,
        quantity: 1400,
        primaryUom: 'L',
        secondaryQuantity: undefined,
        secondaryUom: undefined,
        conversionRatio: undefined,
        scheduledDate: '2026-10-02',
        allocationStatus: 'UNASSIGNED',
        allocatedQty: 0,
        requestedUom: 'KG Extract',
        materialCode: 'RAW-EXT-ASH-05',
      };
    }
    if (scenario === 'error-state') {
      return {
        ...defaultOrder,
        allocationStatus: 'FAILED_CAPACITY_BREACH',
      };
    }
    return defaultOrder;
  });

  // 11. Reactive Matrix Rows: Dynamically Filtered by Left Pane Selected Resource
  const matrixRows = useMemo(() => {
    if (scenario === 'empty-state') {
      return [];
    }

    if (scenario === 'minimum-content') {
      return [
        {
          code: 'RAW-EXT-ASH-05',
          name: 'Ashwagandha Root Extract 2.5%',
          plant: isAsclepius ? 'Plant F-119' : 'Warehouse H-9',
          lineId: isAsclepius ? 'line-01' : 'bay-a',
          lineName: isAsclepius ? 'Line 01' : 'Bay A',
          onHandQty: 350,
          uom: 'KG',
          secondaryQty: 14,
          secondaryUom: 'Drums',
          safeDays: 12,
          reorderDays: 6,
          stockoutDate: 'Oct 20',
          transitOrigin: 'H-9',
          transitDest: 'F-119',
          transitHours: 4,
          transitStatus: 'IN_TRANSIT' as const,
          order: defaultOrder,
        },
      ];
    }

    if (scenario === 'long-labels') {
      return [
        {
          code: 'RAW-EXT-ASHWAGANDHA-STANDARDIZED-HPLC-GRADE-2.5-WITHANOLIDES-BULK',
          name: 'Organic Standardized Ashwagandha (Withania Somnifera) Root Dry Extract, Verified 2.5% Withanolides via HPLC Testing, Pharma Grade Drum Packaging',
          plant: 'Asclepius Multi-Facility Extraction Complex F-119',
          lineId: 'line-02-long',
          lineName: 'Line 02 — High-Capacity Automated Continuous Multi-Stage Maceration',
          onHandQty: 350,
          uom: 'KG',
          secondaryQty: 14,
          secondaryUom: 'Drums',
          safeDays: 12,
          reorderDays: 6,
          stockoutDate: 'Oct 20, 2026 (Extended Run)',
          transitOrigin: 'Anantshriveda Warehouse Bay D',
          transitDest: 'Plant F-119 Receiving Docks',
          transitHours: 4,
          transitStatus: 'IN_TRANSIT' as const,
          order: defaultOrder,
        },
      ];
    }

    if (scenario === 'missing-data') {
      return [
        {
          code: 'RAW-EXT-ASH-05',
          name: 'Ashwagandha Root Extract 2.5%',
          plant: isAsclepius ? 'Plant F-119' : 'Warehouse H-9',
          lineId: 'line-01',
          lineName: 'Line 01 - Unassigned Spec',
          onHandQty: 350,
          uom: 'KG',
          safeDays: 12,
          reorderDays: 6,
          stockoutDate: 'Oct 20',
          transitOrigin: '—',
          transitDest: '—',
          transitHours: 0,
          transitStatus: 'SCHEDULED' as const,
          order: defaultOrder,
        },
        {
          code: 'RAW-ING-AML-109',
          name: 'Organic Amla Pulp Concentrate (Missing Horizon Dates)',
          plant: isAsclepius ? 'Plant F-119' : 'Warehouse H-9',
          lineId: 'line-02',
          lineName: 'Line 02 - Extraction Tank',
          onHandQty: 850,
          uom: 'KG',
          safeDays: 20,
          reorderDays: 6,
          stockoutDate: '—',
          transitOrigin: 'H-9',
          transitDest: 'F-119',
          transitHours: 6,
          transitStatus: 'SCHEDULED' as const,
          order: defaultOrder,
        },
      ];
    }

    const currentCatalog = isAsclepius ? asclepiusCatalog : anantshrivedaCatalog;
    const isRoot = selectedResourceId === 'plant-f119' || selectedResourceId === 'wh-h9' || !selectedResourceId;
    const filtered = isRoot
      ? currentCatalog
      : currentCatalog.filter((m) => m.lineId === selectedResourceId);

    const baseList = filtered.length > 0 ? filtered : currentCatalog;

    if (scenario === 'stress-high-density') {
      const extra: MatrixMaterialRow[] = [];
      for (let i = 1; i <= 30; i++) {
        extra.push({
          code: `RAW-MAT-STRESS-${100 + i}`,
          name: `Excipient & Compound Blend Grade #${i}`,
          plant: isAsclepius ? 'Plant F-119' : 'Warehouse H-9',
          lineId: selectedResourceId || 'line-01',
          lineName: 'Stress Line',
          onHandQty: 500 + i * 25,
          uom: 'KG',
          secondaryQty: 20 + i,
          secondaryUom: 'Bags',
          safeDays: 8 + (i % 14),
          reorderDays: 4 + (i % 5),
          stockoutDate: `Oct ${12 + (i % 15)}`,
          transitOrigin: 'H-9',
          transitDest: 'F-119',
          transitHours: 4 + (i % 6),
          transitStatus: (i % 3 === 0 ? 'DELAYED' : i % 2 === 0 ? 'IN_TRANSIT' : 'SCHEDULED') as any,
          order: {
            ...defaultOrder,
            id: `ord-stress-${i}`,
            code: `ORD-STRESS-${i}`,
            name: `Excipient Blend #${i} Production Run`,
            materialCode: `RAW-MAT-STRESS-${100 + i}`,
          },
        });
      }
      return [...baseList, ...extra];
    }

    return baseList;
  }, [scenario, isAsclepius, selectedResourceId, asclepiusCatalog, anantshrivedaCatalog, defaultOrder]);

  // Synchronized Selection Handler for Left Pane Tree Nodes
  const handleSelectResource = (resourceId: string) => {
    setSelectedResourceId(resourceId);
    const pool = isAsclepius ? asclepiusCatalog : anantshrivedaCatalog;
    const isRoot = resourceId === 'plant-f119' || resourceId === 'wh-h9';
    const matching = isRoot ? pool : pool.filter((m) => m.lineId === resourceId);
    if (matching.length > 0) {
      setSelectedRowIndex(0);
      setSelectedOrder(matching[0].order);
    }
    const node = resources.find((r) => r.id === resourceId);
    setBannerNotice({
      message: `Scoped view to ${node?.name || resourceId}. Second pane matrix and inspector synchronized.`,
      type: 'info',
    });
  };

  // Synchronized Selection Handler for Center Pane Matrix Rows
  const handleSelectMaterialRow = (row: MatrixMaterialRow, idx: number) => {
    setSelectedRowIndex(idx);
    setSelectedOrder(row.order);
    if (row.lineId && row.lineId !== selectedResourceId) {
      setSelectedResourceId(row.lineId);
    }
  };

  // Global Keyboard shortcuts: Escape (popovers/drawers), Alt+Z / Ctrl+Z (undo), J / K (row navigation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLegendOpen) {
          setIsLegendOpen(false);
        } else if (isConflictOpen) {
          setIsConflictOpen(false);
        } else if (undoNotification) {
          setUndoNotification(null);
        }
      }
      if ((e.ctrlKey || e.altKey) && e.key.toLowerCase() === 'z') {
        if (undoNotification) {
          e.preventDefault();
          undoNotification.onUndo();
        }
      }
      // Alex's Power Path: J / K and Arrow navigation through matrix rows
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (!isInput && matrixRows.length > 0) {
        if (e.key === 'j' || e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedRowIndex((prev) => {
            const next = Math.min(matrixRows.length - 1, prev + 1);
            const row = matrixRows[next];
            if (row) {
              setSelectedOrder(row.order || defaultOrder);
            }
            return next;
          });
        } else if (e.key === 'k' || e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedRowIndex((prev) => {
            const prevIdx = Math.max(0, prev - 1);
            const row = matrixRows[prevIdx];
            if (row) {
              setSelectedOrder(row.order || defaultOrder);
            }
            return prevIdx;
          });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLegendOpen, isConflictOpen, undoNotification, matrixRows, defaultOrder]);

  // Handle Scenario Button clicks
  const applyScenario = (sc: WorkbenchScenario) => {
    setScenario(sc);
    if (sc === 'concurrent-conflict') {
      setIsConflictOpen(true);
      setActiveCenterView('matrix');
      setBannerNotice(null);
    } else if (sc === 'optimistic-rebound') {
      setIsConflictOpen(false);
      setActiveCenterView('reschedule');
      setBannerNotice({
        message: 'Scenario: Drag ORD-2026-9042 into Shift 3 to trigger capacity validation rebound.',
        type: 'info',
      });
    } else if (sc === 'stale') {
      setIsConflictOpen(false);
      setSyncTime(createStaleSyncTime());
      setBannerNotice({
        message: 'Warning: Inventory matrix is showing cached telemetry (6m stale). Click refresh to synchronize.',
        type: 'warning',
      });
    } else if (sc === 'anantshriveda-warehouse') {
      setIsConflictOpen(false);
      setEntitySelection({ entityId: 'ent-anantshriveda', facilityId: 'fac-h9' });
      setBannerNotice({
        message: 'Switched context to Anantshriveda Central RM Warehouse H-9.',
        type: 'info',
      });
    } else if (sc === 'error-state') {
      setIsConflictOpen(false);
      setBannerNotice({
        message: 'Critical Error [FAULT-MES-503-F119-DOWNSTREAM]: Connection to Asclepius MES Plant PL-04 lost. Running on isolated buffer.',
        type: 'danger',
      });
    } else if (sc === 'disabled-actions') {
      setIsConflictOpen(false);
      setBannerNotice({
        message: 'Read-Only Mode: Current operator role has viewer permissions only. Dispatch actions disabled.',
        type: 'info',
      });
    } else if (sc === 'loading') {
      setIsConflictOpen(false);
      setBannerNotice({
        message: 'Loading live planning telemetry from Asclepius MES PL-04...',
        type: 'info',
      });
    } else if (sc === 'partial-loading') {
      setIsConflictOpen(false);
      setBannerNotice({
        message: 'Partial telemetry refresh: Updating time-phased material allocations...',
        type: 'info',
      });
    } else if (sc === 'empty-state') {
      setIsConflictOpen(false);
      setSelectedOrder(null);
      setBannerNotice({
        message: 'Empty State: Zero work centers or active material horizons found.',
        type: 'info',
      });
    } else {
      setIsConflictOpen(false);
      setBannerNotice(null);
      setEntitySelection({ entityId: 'ent-asclepius', facilityId: 'fac-f119' });
    }
  };

  const isActionsDisabled = scenario === 'disabled-actions';

  return (
    <div className={`ds-planner-root ${navCollapsed || inspectorCollapsed ? 'ds-planner-root--side-pane-collapsed' : ''} ${navCollapsed && inspectorCollapsed ? 'ds-planner-root--focused' : ''}`}>
      {/* Top Scenario Harness Bar for Headless Automation & Reviewers */}
      {showHarness && (
        <div className="ds-planner-harness" role="region" aria-label="Scenario Test Harness">
          <span className="ds-planner-harness__label">Workbench Scenario:</span>
          {(
            [
              'ready',
              'concurrent-conflict',
              'optimistic-rebound',
              'stale',
              'stress-high-density',
              'anantshriveda-warehouse',
              'minimum-content',
              'long-labels',
              'missing-data',
              'loading',
              'partial-loading',
              'empty-state',
              'error-state',
              'disabled-actions',
            ] as WorkbenchScenario[]
          ).map((sc) => (
            <button
              key={sc}
              type="button"
              className={`ds-planner-harness__btn ${scenario === sc ? 'ds-planner-harness__btn--active' : ''}`}
              onClick={() => applyScenario(sc)}
            >
              {sc}
            </button>
          ))}
        </div>
      )}

      {/* Global Workbench Header */}
      <header className="ds-planner-header" role="banner">
        <div className="ds-planner-header__brand">
          <div className="ds-planner-header__logo" aria-hidden="true">PW</div>
          <div className="ds-planner-header__titles">
            <h1 className="ds-planner-header__title">
              {scenario === 'long-labels'
                ? 'Asclepius Multi-Facility Bio-Pharma & Botanical Liquid Processing Center F-119 Campus North'
                : 'Meridian Master Planner Workbench'}
            </h1>
            <p className="ds-planner-header__subtitle">
              {isAsclepius
                ? scenario === 'long-labels'
                  ? 'Asclepius Wellness • Comprehensive Multi-Facility Botanical Extraction & Advanced Liquid Packaging Complex F-119 (Pune Industrial Corridor, MH)'
                  : 'Asclepius Wellness • Food & Syrup Processing Plant F-119 (Pune, MH)'
                : 'Anantshriveda Natural Care • Central RM Warehouse H-9 (Chakan, MH)'}
            </p>
          </div>
        </div>

        <div className="ds-planner-header__actions">
          {/* Scope and Telemetry Cluster */}
          <div className="ds-planner-header__action-cluster" role="group" aria-label="Facility scope and data sync">
            <EntityFacilitySelector
              value={entitySelection}
              onChange={(sel) => setEntitySelection(sel)}
            />
            <StaleDataPill
              lastSyncTime={syncTime}
              staleThresholdMinutes={5}
              onRefresh={() => {
                setSyncTime(new Date());
                setBannerNotice({ message: 'Telemetry synchronized with Plant PL-04 MES live feed.', type: 'info' });
              }}
            />
          </div>

          {/* Operational Action Cluster */}
          {showHarness && (
            <div className="ds-planner-header__action-cluster" role="group" aria-label="System testing actions">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsConflictOpen(true)}
                aria-label="Simulate Concurrent ETag 409 Conflict"
                disabled={isActionsDisabled}
                title={isActionsDisabled ? 'Action unavailable: Read-only viewer role permissions' : undefined}
              >
                ⚠️ Test ETag Conflict
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Intercompany Balance Ribbon Bar */}
      <div className="ds-planner-ribbon-bar" role="region" aria-label="Intercompany Stock Ribbon">
        {scenario === 'loading' ? (
          <div className="ds-planner-loading-card" role="status" aria-busy="true" aria-label="Loading stock ribbon">
            <Skeleton variant="rounded" height={28} width="100%" />
          </div>
        ) : (
          <IntercompanyStockRibbon
            plantStock={{
              label: 'Plant Stock On-Hand',
              facility: isAsclepius ? 'Food Plant F-119' : 'Staged for F-119',
              quantity: scenario === 'minimum-content' ? 50 : 350,
              uom: 'KG',
              status: scenario === 'error-state' ? 'danger' : 'warning',
              statusLabel: scenario === 'error-state' ? 'Deficit' : 'Deficit Risk',
              subtext: scenario === 'error-state' ? 'Stockout Imminent' : '4.2 Days Runway',
            }}
            warehouseStock={{
              label: 'RM Warehouse Staged',
              facility: 'RM Warehouse H-9',
              quantity: scenario === 'minimum-content' ? 200 : 1200,
              uom: 'KG',
              status: 'safe',
              statusLabel: 'Available',
              subtext: 'QC Inspection Passed',
            }}
            inTransitStock={{
              label: 'In-Transit STO',
              facility: 'En Route (H-9 ➔ F-119)',
              quantity: scenario === 'minimum-content' ? 0 : 500,
              uom: 'KG',
              status: scenario === 'missing-data' ? 'info' : 'info',
              statusLabel: scenario === 'missing-data' ? 'Unscheduled' : 'ETA 14:30',
              subtext: scenario === 'missing-data' ? 'Pending Transit Assignment' : 'Deccan Road Freight',
            }}
            netBalance={{
              label: 'Net Supply Balance',
              facility: 'Network Total',
              quantity: scenario === 'minimum-content' ? 250 : 2050,
              uom: 'KG',
              status: 'safe',
              statusLabel: 'Covered',
              subtext: 'Coverage Buffer Safe',
            }}
            onRequestTransfer={
              isActionsDisabled
                ? undefined
                : () =>
                    setBannerNotice({
                      message: 'Stock Transfer Order (STO-2026-9901) dispatched to RM Warehouse H-9 for 500 KG Ashwagandha.',
                      type: 'info',
                    })
            }
            onViewDetails={() =>
              setBannerNotice({
                message: 'Viewing Intercompany Transit Manifest on NH-48 corridor.',
                type: 'info',
              })
            }
          />
        )}
      </div>

      {/* Operational Status / Event Notice Banner */}
      {bannerNotice && (
        <div className={`ds-planner-banner ds-planner-banner--${bannerNotice.type}`} role={bannerNotice.type === 'danger' ? 'alert' : 'status'}>
          <div className="ds-planner-banner__content">
            <span aria-hidden="true">{bannerNotice.type === 'danger' ? '❌' : 'ℹ️'}</span>
            <span>{bannerNotice.message}</span>
            {bannerNotice.type === 'danger' && (
              <>
                <span className="ds-planner-banner__code" aria-label="Incident reference taxonomy code">
                  CODE: FAULT-MES-503-F119
                </span>
                <button
                  type="button"
                  className="ds-planner-banner__action"
                  onClick={() => {
                    setBannerNotice({
                      message: 'Reconnected to Asclepius MES Plant PL-04. Telemetry synchronized.',
                      type: 'info',
                    });
                  }}
                >
                  Retry Connection
                </button>
              </>
            )}
          </div>
          <button
            type="button"
            className="ds-planner-banner__close"
            onClick={() => setBannerNotice(null)}
            aria-label="Dismiss banner"
          >
            ✕
          </button>
        </div>
      )}

      {/* 3-Pane Responsive Layout */}
      <div className="ds-planner-layout-wrapper">
        <Workbench3PaneLayout
          pageScrollOnTabs
          navCollapsed={navCollapsed}
          onNavCollapsedChange={setNavCollapsed}
          inspectorCollapsed={inspectorCollapsed}
          onInspectorCollapsedChange={setInspectorCollapsed}
          navWidth="260px"
          inspectorWidth="320px"
          navPane={
            <div className="ds-planner-resource-pane" role="region" aria-label="Plant Resource Hierarchy">
              <div className="ds-planner-pane-header">
                <h2 className="ds-planner-pane-title">
                  {isAsclepius ? 'Plant Work Centers' : 'Warehouse Storage Bays'}
                </h2>
                <div className="ds-planner-pane-header__actions">
                  <Badge variant="neutral" styleVariant="subtle">{resources.length} Nodes</Badge>
                  <button type="button" className="ds-planner-pane-toggle" onClick={() => setNavCollapsed(true)} aria-label="Collapse plant work centers" title="Collapse plant work centers">
                    <PaneToggleIcon side="left" expand={false} />
                  </button>
                </div>
              </div>

              {scenario === 'loading' ? (
                <div className="ds-planner-loading-card" role="status" aria-busy="true" aria-label="Loading work centers">
                  <Skeleton variant="rectangular" height={20} width="60%" />
                  <Skeleton variant="rounded" height={28} count={4} />
                </div>
              ) : resources.length === 0 ? (
                <div className="ds-planner-empty-wrapper">
                  <EmptyState
                    size="sm"
                    title="No Work Centers"
                    description="No manufacturing lines or storage bays found for this facility scope."
                    primaryAction={
                      <Button variant="outline" size="sm" onClick={() => applyScenario('ready')}>
                        Reset Facility Scope
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="ds-planner-tree-list" role="region" aria-label="Work Centers List" tabIndex={0}>
                  <table role="treegrid" aria-label="Work Centers Hierarchy" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {resources.map((item) => (
                        <tr
                          key={item.id}
                          role="row"
                          aria-level={item.level + 1}
                          aria-expanded={item.hasChildren ? item.expanded : undefined}
                          className={`ds-planner-tree-item ${selectedResourceId === item.id ? 'ds-planner-tree-item--active' : ''}`}
                          onClick={() => handleSelectResource(item.id)}
                          tabIndex={0}
                          aria-selected={selectedResourceId === item.id}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleSelectResource(item.id);
                            }
                          }}
                        >
                          <TreeGridCell
                            level={item.level}
                            hasChildren={item.hasChildren}
                            expanded={item.expanded}
                            onToggle={() => toggleExpand(item.id)}
                          >
                            <span>{item.name}</span>
                          </TreeGridCell>
                          <td style={{ padding: '6px 8px', textAlign: 'right' }}>
                            <span className="ds-planner-tree-item__count">{item.capacity}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          }
          mainPane={
            <div className="ds-planner-center-pane" role="region" aria-label="Scheduling Matrix and Dispatch" tabIndex={0}>
              {(navCollapsed || inspectorCollapsed) && (
                <div className="ds-planner-restore-bar" role="group" aria-label="Restore side panels">
                  {navCollapsed && (
                    <button type="button" className="ds-planner-pane-toggle ds-planner-pane-toggle--restore" onClick={() => setNavCollapsed(false)} aria-label="Expand plant work centers" title="Expand plant work centers">
                      <PaneToggleIcon side="left" expand />
                      <span>Show work centers</span>
                    </button>
                  )}
                  {inspectorCollapsed && (
                    <button type="button" className="ds-planner-pane-toggle ds-planner-pane-toggle--restore ds-planner-pane-toggle--right" onClick={() => setInspectorCollapsed(false)} aria-label="Expand work order inspector" title="Expand work order inspector">
                      <span>Show inspector</span>
                      <PaneToggleIcon side="right" expand />
                    </button>
                  )}
                </div>
              )}
              {/* Certified Design System Command Toolbar Ribbon */}
              <div className="ds-planner-toolbar-group">
                <CommandToolbarGroup
                  aria-label="Planning Horizon and Mode Ribbon"
                  density="compact"
                  primaryControls={
                    <TimeHorizonStepper
                      bucketSize={currentBucket}
                      onBucketSizeChange={(b) => {
                        setCurrentBucket(b);
                        setBannerNotice({
                          message: `Horizon switched to ${b.toUpperCase()} view. Stock runway remains a 30-day forecast.`,
                          type: 'info',
                        });
                      }}
                      currentHorizonLabel={currentHorizonLabel}
                      onPrev={() => {
                        setHorizonOffset((prev) => prev - 1);
                        setBannerNotice({ message: 'Navigated back 1 horizon step.', type: 'info' });
                      }}
                      onNext={() => {
                        setHorizonOffset((prev) => prev + 1);
                        setBannerNotice({ message: 'Navigated forward 1 horizon step.', type: 'info' });
                      }}
                      jumpTodayLabel="Reference day"
                      onJumpToday={() => {
                        setHorizonOffset(0);
                        setCurrentBucket('day');
                        setBannerNotice({ message: 'Timeline reset to the reference planning day.', type: 'info' });
                      }}
                    />
                  }
                  viewControls={
                    <SegmentedControl
                      aria-label="Center view mode"
                      size="sm"
                      value={activeCenterView}
                      onChange={(val) => setActiveCenterView(val as 'matrix' | 'reschedule')}
                      options={[
                        { value: 'matrix', label: 'Matrix View' },
                        { value: 'reschedule', label: 'Shift Dispatch' },
                      ]}
                    />
                  }
                />
              </div>

              {/* View 1: Time Phased Matrix with Inline Micro-Horizons */}
              {activeCenterView === 'matrix' && (
                scenario === 'loading' || scenario === 'partial-loading' ? (
                  <div
                    className="ds-planner-loading-card"
                    role="status"
                    aria-busy="true"
                    aria-label={scenario === 'partial-loading' ? 'Updating material horizon matrix telemetry' : 'Loading material matrix'}
                  >
                    <Skeleton variant="rectangular" height={32} width="100%" />
                    <Skeleton variant="rounded" height={44} count={3} />
                  </div>
                ) : matrixRows.length === 0 ? (
                  <div className="ds-planner-empty-wrapper">
                    <EmptyState
                      size="md"
                      title="No Scheduled Material Horizons"
                      description="There are no materials or components scheduled for the active time horizon and facility scope."
                      primaryAction={
                        <Button variant="outline" size="sm" onClick={() => applyScenario('ready')}>
                          Reset to Live Horizon
                        </Button>
                      }
                    />
                  </div>
                ) : (
                  <div className="ds-planner-matrix-card" role="region" aria-label="Material SKU Horizon Matrix Table" tabIndex={0}>
                    <p className="ds-planner-matrix-scroll-hint">Swipe across the matrix to view runway and transit details.</p>
                    {isLegendOpen && (
                      <div
                        id="ds-planner-runway-legend-popover"
                        className="ds-planner-runway-legend"
                        role="region"
                        aria-label="Stock Runway Visual Conventions Legend"
                      >
                        <div className="ds-planner-runway-legend__header">
                          <span className="ds-planner-runway-legend__title">Stock Runway Horizon Key</span>
                          <button
                            type="button"
                            className="ds-planner-runway-legend__close"
                            onClick={() => setIsLegendOpen(false)}
                            aria-label="Close runway legend"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="ds-planner-runway-legend__grid">
                          <div className="ds-planner-runway-legend__item">
                            <span className="ds-planner-runway-legend__swatch ds-planner-runway-legend__swatch--safe" aria-hidden="true" />
                            <div className="ds-planner-runway-legend__text">
                              <strong>Safe Horizon:</strong> Projected inventory within safe buffer (green bar).
                            </div>
                          </div>
                          <div className="ds-planner-runway-legend__item">
                            <span className="ds-planner-runway-legend__swatch ds-planner-runway-legend__swatch--reorder" aria-hidden="true" />
                            <div className="ds-planner-runway-legend__text">
                              <strong>Reorder Window:</strong> Below reorder point; transfer required (hatched amber).
                            </div>
                          </div>
                          <div className="ds-planner-runway-legend__item">
                            <span className="ds-planner-runway-legend__swatch ds-planner-runway-legend__swatch--stockout" aria-hidden="true" />
                            <div className="ds-planner-runway-legend__text">
                              <strong>Stockout Point:</strong> Projected date of zero on-hand stock (vertical red pin).
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <table role="table" aria-label="Material SKU Horizon Matrix" className="ds-planner-matrix-table">
                      <thead>
                        <tr className="ds-planner-matrix-th-row">
                          <th className="ds-planner-matrix-th" scope="col">Material SKU</th>
                          <th className="ds-planner-matrix-th" scope="col">On-Hand Dual UoM</th>
                          <th className="ds-planner-matrix-th ds-planner-matrix-th--runway" scope="col">
                            <div className="ds-planner-th-runway-header">
                              <span>Stock Runway (30 Days)</span>
                              <button
                                type="button"
                                className="ds-planner-legend-toggle"
                                onClick={() => setIsLegendOpen((prev) => !prev)}
                                aria-expanded={isLegendOpen}
                                aria-controls="ds-planner-runway-legend-popover"
                                aria-label="Toggle Stock Runway visual legend"
                              >
                                ℹ️ Legend
                              </button>
                            </div>
                          </th>
                          <th className="ds-planner-matrix-th" scope="col">Intercompany Road Transit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matrixRows.map((row, idx) => {
                          const isRowActive = selectedOrder?.materialCode === row.code || selectedRowIndex === idx;
                          return (
                            <tr
                              key={row.code}
                              role="row"
                              tabIndex={0}
                              aria-selected={isRowActive}
                              className={`ds-planner-matrix-tr ${isRowActive ? 'ds-planner-matrix-tr--active' : ''}`}
                              onClick={() => handleSelectMaterialRow(row, idx)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleSelectMaterialRow(row, idx);
                                }
                              }}
                            >
                              <td className="ds-planner-matrix-td">
                                <div className="ds-planner-matrix-sku">{row.code}</div>
                                <div className="ds-planner-matrix-name">{row.name}</div>
                              </td>
                              <td className="ds-planner-matrix-td">
                                <DualUomBadge
                                  primaryQty={row.onHandQty}
                                  primaryUom={row.uom}
                                  secondaryQty={row.secondaryQty}
                                  secondaryUom={row.secondaryUom}
                                />
                              </td>
                              <td className="ds-planner-matrix-td">
                                <StockRunwayHorizon
                                  safeDays={row.safeDays}
                                  reorderDays={row.reorderDays}
                                  totalHorizonDays={30}
                                  reorderPointDateLabel={reorderDateFromStockout(row.stockoutDate, row.reorderDays)}
                                  stockoutDateLabel={row.stockoutDate === '—' ? undefined : row.stockoutDate}
                                  currentStockQty={row.onHandQty}
                                  uom={row.uom}
                                  height={24}
                                />
                                <span className="ds-planner-compact-transit">
                                  <LeadTimeTransferGlyph
                                    origin={row.transitOrigin}
                                    destination={row.transitDest}
                                    transitHours={row.transitHours}
                                    status={row.transitStatus}
                                    materialName={row.name}
                                    quantity={`${row.onHandQty} ${row.uom}`}
                                  />
                                </span>
                              </td>
                              <td className="ds-planner-matrix-td">
                                <LeadTimeTransferGlyph
                                  origin={row.transitOrigin}
                                  destination={row.transitDest}
                                  transitHours={row.transitHours}
                                  status={row.transitStatus}
                                  materialName={row.name}
                                  quantity={`${row.onHandQty} ${row.uom}`}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )
              )}

              {/* View 2: Optimistic Drag Reschedule Board */}
              {activeCenterView === 'reschedule' && (
                <OptimisticDragReschedule
                  onRescheduleSuccess={(order, newShift) => {
                    setBannerNotice({
                      message: `✅ Dispatched: ${order.code} committed to Shift ${newShift}. Line capacity verified.`,
                      type: 'info',
                    });
                    setUndoNotification({
                      id: `undo-reschedule-${Date.now()}`,
                      message: `Rescheduled ${order.code} to Shift ${newShift}.`,
                      onUndo: () => {
                        setUndoNotification(null);
                        setBannerNotice({
                          message: `Reverted reschedule for ${order.code}. Returned to previous shift slot.`,
                          type: 'info',
                        });
                      },
                    });
                  }}
                  onRescheduleFailure={(order, attemptedShift, reason) => {
                    setBannerNotice({
                      message: `❌ Capacity Breach: ${order.code} cannot fit into Shift ${attemptedShift} (${reason}). Spring rebounded.`,
                      type: 'danger',
                    });
                  }}
                />
              )}
            </div>
          }
          inspectorPane={
            <div className="ds-planner-inspector-pane" role="region" aria-label="Work Order Inspector" tabIndex={0}>
              <div className="ds-planner-pane-header">
                <h2 className="ds-planner-pane-title">Work Order Inspector</h2>
                <div className="ds-planner-pane-header__actions">
                  {selectedOrder && (
                    selectedOrder.code.length > 24 ? (
                      <span className="ds-planner-order-code-long">{selectedOrder.code}</span>
                    ) : (
                      <Badge variant="brand" styleVariant="outline">{selectedOrder.code}</Badge>
                    )
                  )}
                  <button type="button" className="ds-planner-pane-toggle" onClick={() => setInspectorCollapsed(true)} aria-label="Collapse work order inspector" title="Collapse work order inspector">
                    <PaneToggleIcon side="right" expand={false} />
                  </button>
                </div>
              </div>

              {scenario === 'loading' ? (
                <div className="ds-planner-loading-card" role="status" aria-busy="true" aria-label="Loading work order details">
                  <Skeleton variant="rectangular" height={24} width="80%" />
                  <Skeleton variant="text" count={5} />
                  <Skeleton variant="rounded" height={36} width="100%" />
                </div>
              ) : !selectedOrder ? (
                <div className="ds-planner-empty-wrapper">
                  <EmptyState
                    size="sm"
                    title="No Order Selected"
                    description="Select a work center or matrix item to inspect order allocation telemetry."
                    primaryAction={
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(defaultOrder)}
                      >
                        Inspect First Order
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="ds-planner-order-card" role="region" aria-label="Selected Work Order Summary">
                  {scenario === 'disabled-actions' && (
                    <div className="ds-planner-role-notice" role="status">
                      🔒 Read-Only: Operator role has viewer permissions only. Editing disabled.
                    </div>
                  )}
                  <div className="ds-planner-order-header">
                    <h2 className="ds-planner-order-title">
                      {selectedOrder.name}
                    </h2>
                    <span className="ds-planner-order-batch">
                      Batch: {selectedOrder.batch || '— (Unassigned)'}
                    </span>
                  </div>

                  <div className="ds-planner-detail-row">
                    <span className="ds-planner-detail-label">Work Center</span>
                    <span className="ds-planner-detail-value">{selectedOrder.line || '— (Unassigned)'}</span>
                  </div>

                  <div className="ds-planner-detail-row">
                    <span className="ds-planner-detail-label">Schedule Slot</span>
                    <span className="ds-planner-detail-value">{selectedOrder.scheduledDate || '—'}</span>
                  </div>

                  <div className="ds-planner-detail-row">
                    <span className="ds-planner-detail-label">Batch Size</span>
                    <span className="ds-planner-detail-value">
                      <DualUomBadge
                        primaryQty={selectedOrder.quantity}
                        primaryUom={selectedOrder.primaryUom}
                        secondaryQty={selectedOrder.secondaryQuantity}
                        secondaryUom={selectedOrder.secondaryUom}
                        conversionRatio={selectedOrder.conversionRatio}
                      />
                    </span>
                  </div>

                  <div className="ds-planner-detail-row">
                    <span className="ds-planner-detail-label">Allocation Status</span>
                    <span className="ds-planner-detail-value">
                      <Badge
                        variant={
                          selectedOrder.allocationStatus === 'ALLOCATED'
                            ? 'success'
                            : selectedOrder.allocationStatus.includes('FAILED')
                            ? 'danger'
                            : 'warning'
                        }
                        styleVariant="subtle"
                      >
                        {selectedOrder.allocationStatus}
                      </Badge>
                    </span>
                  </div>

                  <div className="ds-planner-order-actions">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsConflictOpen(true)}
                      aria-label="Open Conflict Resolver Drawer"
                      disabled={isActionsDisabled || selectedOrder.allocationStatus === 'ALLOCATED'}
                      title={
                        isActionsDisabled
                          ? 'Action unavailable: Read-only viewer role permissions'
                          : selectedOrder.allocationStatus === 'ALLOCATED'
                          ? 'Action disabled: Order allocation is already fully allocated'
                          : undefined
                      }
                    >
                      Resolve Allocation Conflict
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isActionsDisabled}
                      title={isActionsDisabled ? 'Action unavailable: Read-only viewer role permissions' : undefined}
                      onClick={() => {
                        const prevOrder = { ...selectedOrder };
                        setSelectedOrder({ ...selectedOrder, allocationStatus: 'ALLOCATED' });
                        // Update line load in left pane
                        setResources((prev) =>
                          prev.map((r) =>
                            r.id === selectedResourceId || (selectedOrder.line && r.name.includes(selectedOrder.line))
                              ? { ...r, capacity: r.capacity.includes('Load') ? '98% Load' : 'Committed', orderCount: r.orderCount + 1 }
                              : r
                          )
                        );
                        setBannerNotice({
                          message: `Committed ${selectedOrder.quantity} ${selectedOrder.primaryUom} to ${selectedOrder.line || 'production line'}. Status: ALLOCATED.`,
                          type: 'info',
                        });
                        setUndoNotification({
                          id: `undo-${Date.now()}`,
                          message: `Committed ${selectedOrder.quantity} ${selectedOrder.primaryUom} to ${selectedOrder.line || 'Line 02'}.`,
                          onUndo: () => {
                            setSelectedOrder(prevOrder);
                            setUndoNotification(null);
                            setBannerNotice({
                              message: `Reverted commit for ${selectedOrder.code}. Restored previous schedule state.`,
                              type: 'info',
                            });
                          },
                        });
                      }}
                    >
                      Save Order Schedule
                    </Button>
                  </div>
                </div>
              )}
            </div>
          }
        />
      </div>

      {/* Concurrent Conflict Resolver Drawer (ETag 409 Resolution) */}
      {selectedOrder && (
        <ConcurrentConflictResolver
          isOpen={isConflictOpen}
          onClose={() => setIsConflictOpen(false)}
          recordCode={selectedOrder.materialCode}
          recordName={selectedOrder.name}
          proposedQuantity={150}
          remoteQuantity={100}
          deltaQuantity={50}
          uom="KG"
          localUser="You (Shift Lead)"
          localRole="Asclepius Plant F-119"
          remoteUser="Anantshriveda Supply Lead"
          remoteRole="RM Warehouse H-9"
          onAcceptRemote={() => {
            setIsConflictOpen(false);
            setSelectedOrder({ ...selectedOrder, allocationStatus: 'ALLOCATED', allocatedQty: 100 });
            setResources((prev) =>
              prev.map((r) =>
                r.id === selectedResourceId || (selectedOrder.line && r.name.includes(selectedOrder.line))
                  ? { ...r, capacity: '96% Load', orderCount: r.orderCount + 1 }
                  : r
              )
            );
            setBannerNotice({
              message: 'Accepted Remote State (100 kg reserved for QC). Matrix recalculated.',
              type: 'info',
            });
          }}
          onForceOverride={() => {
            setIsConflictOpen(false);
            setSelectedOrder({ ...selectedOrder, allocationStatus: 'ALLOCATED', allocatedQty: 150 });
            setResources((prev) =>
              prev.map((r) =>
                r.id === selectedResourceId || (selectedOrder.line && r.name.includes(selectedOrder.line))
                  ? { ...r, capacity: '100% Load', orderCount: r.orderCount + 1 }
                  : r
              )
            );
            setBannerNotice({
              message: 'Administrator Force Override applied (150 kg allocated to Line 02).',
              type: 'warning',
            });
          }}
          onAllocateDelta={() => {
            setIsConflictOpen(false);
            setSelectedOrder({ ...selectedOrder, allocationStatus: 'ALLOCATED', allocatedQty: 50 });
            setResources((prev) =>
              prev.map((r) =>
                r.id === selectedResourceId || (selectedOrder.line && r.name.includes(selectedOrder.line))
                  ? { ...r, capacity: '94% Load', orderCount: r.orderCount + 1 }
                  : r
              )
            );
            setBannerNotice({
              message: 'Allocated Remaining Delta (50 kg). Partial allocation committed.',
              type: 'info',
            });
          }}
        />
      )}
      {/* P1: Accessible Undo Notification Toast (8s window, Alt+Z / Ctrl+Z support) */}
      {undoNotification && (
        <div
          className="ds-planner-undo-toast"
          role="status"
          aria-live="polite"
          aria-label="Action feedback with undo affordance"
        >
          <div className="ds-planner-undo-toast__content">
            <span className="ds-planner-undo-toast__icon" aria-hidden="true">↺</span>
            <span className="ds-planner-undo-toast__msg">{undoNotification.message}</span>
          </div>
          <div className="ds-planner-undo-toast__actions">
            <button
              type="button"
              className="ds-planner-undo-toast__btn"
              onClick={undoNotification.onUndo}
              aria-label="Undo last action"
            >
              Undo (Ctrl+Z)
            </button>
            <button
              type="button"
              className="ds-planner-undo-toast__dismiss"
              onClick={() => setUndoNotification(null)}
              aria-label="Dismiss undo notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const CandidateOverview: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="ready" />,
};

export const ScenarioHarness: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="ready" showHarness />,
};

export const MinimumContent: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="minimum-content" />,
};

export const TypicalContent: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="ready" />,
};

export const MaximumContent: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="stress-high-density" />,
};

export const LongLabels: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="long-labels" />,
};

export const MissingData: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="missing-data" />,
};

export const Loading: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="loading" />,
};

export const PartialLoading: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="partial-loading" />,
};

export const EmptyStateStory: StoryObj = {
  name: 'Empty State',
  render: () => <WorkbenchExperience initialScenario="empty-state" />,
};

export const ErrorState: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="error-state" />,
};

export const ConcurrentConflict: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="concurrent-conflict" />,
};

export const OptimisticRebound: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="optimistic-rebound" />,
};

export const StaleTelemetry: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="stale" />,
};

export const AnantshrivedaWarehouse: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="anantshriveda-warehouse" />,
};

export const DisabledActions: StoryObj = {
  render: () => <WorkbenchExperience initialScenario="disabled-actions" />,
};
