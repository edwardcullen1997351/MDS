import { useState, useCallback, useMemo, useEffect } from 'react';

export type TimeBucket = 'shift' | 'day' | 'week' | 'month';

export interface TriPaneCoordinatorOptions<
  THierarchyItem extends { id: string },
  TRecordItem extends { id: string; hierarchyId?: string },
> {
  /** Initial selected left pane hierarchy node ID */
  initialHierarchyId?: string;
  /** Full list of hierarchy items */
  hierarchyItems?: THierarchyItem[];
  /** Full list of center pane records */
  records?: TRecordItem[];
  /** Optional custom matcher connecting a record to a hierarchy item */
  recordHierarchyMatcher?: (record: TRecordItem, hierarchyId: string) => boolean;
  /** Initial selected record ID */
  initialRecordId?: string;
  /** Initial time bucket */
  initialBucket?: TimeBucket;
  /** Initial center pane view mode */
  initialView?: string;
  /** Whether keyboard shortcuts (j/k) to cycle records are enabled (default: true) */
  enableKeyboardNavigation?: boolean;
}

export interface TriPaneCoordinatorState<
  _THierarchyItem extends { id: string },
  TRecordItem extends { id: string; hierarchyId?: string },
> {
  /** Currently selected left pane node ID */
  selectedHierarchyId: string | null;
  /** Setter for left pane node selection (also auto-syncs center records) */
  selectHierarchy: (id: string | null) => void;

  /** Currently selected record ID */
  selectedRecordId: string | null;
  /** Currently selected full record object */
  selectedRecord: TRecordItem | null;
  /** Setter for center record selection */
  selectRecord: (id: string | null) => void;

  /** Filtered records matching current hierarchy scope */
  filteredRecords: TRecordItem[];

  /** Current time horizon bucket */
  bucketSize: TimeBucket;
  /** Setter for time horizon bucket */
  setBucketSize: (bucket: TimeBucket) => void;

  /** Current active center view mode */
  activeView: string;
  /** Setter for active center view mode */
  setActiveView: (view: string) => void;

  /** Mobile active tab ('nav' | 'main' | 'inspector') */
  activeMobileTab: 'nav' | 'main' | 'inspector';
  /** Setter for mobile active tab */
  setActiveMobileTab: (tab: 'nav' | 'main' | 'inspector') => void;

  /** Mobile drawer states */
  isNavOpen: boolean;
  setIsNavOpen: (open: boolean) => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (open: boolean) => void;

  /** Cycle to previous record (or 'k' key) */
  selectPrevRecord: () => void;
  /** Cycle to next record (or 'j' key) */
  selectNextRecord: () => void;
}

/**
 * useTriPaneCoordinator
 * Certified state machine for 3-pane enterprise workbenches.
 * Guarantees reactive synchronization between Left Hierarchy, Center Matrix/Grid,
 * and Right Record Inspector, preventing desynchronized state and broken mobile viewflows.
 */
export function useTriPaneCoordinator<
  THierarchyItem extends { id: string } = { id: string },
  TRecordItem extends { id: string; hierarchyId?: string } = { id: string; hierarchyId?: string },
>(
  options: TriPaneCoordinatorOptions<THierarchyItem, TRecordItem> = {}
): TriPaneCoordinatorState<THierarchyItem, TRecordItem> {
  const {
    initialHierarchyId = null,
    records = [],
    recordHierarchyMatcher,
    initialRecordId = null,
    initialBucket = 'shift',
    initialView = 'matrix',
    enableKeyboardNavigation = true,
  } = options;

  const [selectedHierarchyId, setSelectedHierarchyId] = useState<string | null>(initialHierarchyId);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(initialRecordId);
  const [bucketSize, setBucketSize] = useState<TimeBucket>(initialBucket);
  const [activeView, setActiveView] = useState<string>(initialView);

  // Mobile navigation state
  const [activeMobileTab, setActiveMobileTab] = useState<'nav' | 'main' | 'inspector'>('main');
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Automatically filter center records based on selected hierarchy item
  const filteredRecords = useMemo(() => {
    if (!selectedHierarchyId) return records;
    if (recordHierarchyMatcher) {
      return records.filter((r) => recordHierarchyMatcher(r, selectedHierarchyId));
    }
    return records.filter((r) => !r.hierarchyId || r.hierarchyId === selectedHierarchyId);
  }, [records, selectedHierarchyId, recordHierarchyMatcher]);

  // Derive active record
  const selectedRecord = useMemo(() => {
    if (!selectedRecordId) return filteredRecords[0] || null;
    return filteredRecords.find((r) => r.id === selectedRecordId) || filteredRecords[0] || null;
  }, [filteredRecords, selectedRecordId]);

  // Selecting a hierarchy node resets/re-targets the center record
  const selectHierarchy = useCallback(
    (id: string | null) => {
      setSelectedHierarchyId(id);
      if (id) {
        // Auto-select first matching record for new scope
        const matching = recordHierarchyMatcher
          ? records.filter((r) => recordHierarchyMatcher(r, id))
          : records.filter((r) => !r.hierarchyId || r.hierarchyId === id);
        if (matching.length > 0) {
          setSelectedRecordId(matching[0].id);
        }
      }
    },
    [records, recordHierarchyMatcher]
  );

  const selectRecord = useCallback((id: string | null) => {
    setSelectedRecordId(id);
  }, []);

  // J / K keyboard navigation across filtered records
  const selectPrevRecord = useCallback(() => {
    if (filteredRecords.length === 0) return;
    const currentIndex = filteredRecords.findIndex((r) => r.id === selectedRecord?.id);
    const prevIndex = (currentIndex - 1 + filteredRecords.length) % filteredRecords.length;
    setSelectedRecordId(filteredRecords[prevIndex].id);
  }, [filteredRecords, selectedRecord]);

  const selectNextRecord = useCallback(() => {
    if (filteredRecords.length === 0) return;
    const currentIndex = filteredRecords.findIndex((r) => r.id === selectedRecord?.id);
    const nextIndex = (currentIndex + 1) % filteredRecords.length;
    setSelectedRecordId(filteredRecords[nextIndex].id);
  }, [filteredRecords, selectedRecord]);

  useEffect(() => {
    if (!enableKeyboardNavigation) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute('contenteditable') === 'true';

      if (isInputFocused) return;

      if (e.key === 'j' || e.key === 'J') {
        selectNextRecord();
      } else if (e.key === 'k' || e.key === 'K') {
        selectPrevRecord();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [enableKeyboardNavigation, selectNextRecord, selectPrevRecord]);

  return {
    selectedHierarchyId,
    selectHierarchy,
    selectedRecordId,
    selectedRecord,
    selectRecord,
    filteredRecords,
    bucketSize,
    setBucketSize,
    activeView,
    setActiveView,
    activeMobileTab,
    setActiveMobileTab,
    isNavOpen,
    setIsNavOpen,
    isInspectorOpen,
    setIsInspectorOpen,
    selectPrevRecord,
    selectNextRecord,
  };
}
