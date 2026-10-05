import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { DualUomBadge } from '../Badge/DualUomBadge.js';
import './TimePhasedMatrix.css';

export interface TimePhasedShift {
  id: string;
  label: string;
  key: string;
}

export interface TimePhasedPeriod {
  id: string;
  label: string;
  shifts: TimePhasedShift[];
}

export interface TimePhasedCellData {
  value: number;
  type?: 'planned' | 'actual' | 'projected';
  isDeficit?: boolean;
}

export interface TimePhasedMatrixRow {
  id: string;
  sku: string;
  name: string;
  category?: string;
  primaryStock: number;
  primaryUom: string;
  secondaryStock?: number;
  secondaryUom?: string;
  cells: Record<string, TimePhasedCellData>;
}

export interface TimePhasedMatrixProps {
  /** Array of row data (can scale to 10,000+ records) */
  data: TimePhasedMatrixRow[];
  /** Time period headers and child shift definitions */
  periods: TimePhasedPeriod[];
  /** Fixed row height in pixels for virtualization (default 44) */
  rowHeight?: number;
  /** Number of buffer rows rendered outside visible viewport (default 8) */
  overscan?: number;
  /** Currently selected row ID */
  selectedRowId?: string;
  /** Callback fired when a row is clicked or activated via keyboard */
  onSelectRow?: (row: TimePhasedMatrixRow) => void;
  /** Optional custom toolbar node (e.g. Stepper, Search, Filters, StaleDataPill) */
  toolbarContent?: React.ReactNode;
  /** Accessible title for the matrix grid */
  gridLabel?: string;
  /** Additional custom class names */
  className?: string;
}

export interface TimePhasedMatrixHandle {
  /** Scroll to a specific row index smoothly or immediately */
  scrollToIndex: (index: number) => void;
  /** Scroll to the top of the matrix */
  scrollToTop: () => void;
}

/**
 * TimePhasedMatrix (§01–§14)
 * High-performance virtualized grid with bi-directional sticky freeze:
 * - Columns 1–3 (SKU code, botanical name, total stock) are sticky on the X-axis.
 * - Rows 1–2 (Dates, shift headers: Morning/Evening/Night) are sticky on the Y-axis.
 * Performance Budget: Virtual window rendering maximum ~60 DOM rows at any time regardless of 10,000-record dataset.
 */
export const TimePhasedMatrix = forwardRef<TimePhasedMatrixHandle, TimePhasedMatrixProps>(
  (
    {
      data,
      periods,
      rowHeight = 44,
      overscan = 8,
      selectedRowId,
      onSelectRow,
      toolbarContent,
      gridLabel = 'Time-Phased Production & Inventory Matrix',
      className = '',
    },
    ref
  ) => {
    const viewportRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(500);
    const [focusedRowIndex, setFocusedRowIndex] = useState(0);
    const pendingRowFocus = useRef(false);

    // Track viewport resize
    useEffect(() => {
      const el = viewportRef.current;
      if (!el) return;

      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.height > 0) {
            setViewportHeight(entry.contentRect.height);
          }
        }
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    // Handle scroll
    const handleScroll = useCallback(() => {
      if (viewportRef.current) {
        setScrollTop(viewportRef.current.scrollTop);
      }
    }, []);

    // Virtualization calculations
    const totalRows = data.length;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visibleCount = Math.ceil(viewportHeight / rowHeight) + 2 * overscan;
    const endIndex = Math.min(totalRows, startIndex + visibleCount);

    const topSpacerHeight = startIndex * rowHeight;
    const bottomSpacerHeight = Math.max(0, (totalRows - endIndex) * rowHeight);

    const visibleRows = data.slice(startIndex, endIndex);
    const rovingRowIndex = focusedRowIndex >= startIndex && focusedRowIndex < endIndex
      ? focusedRowIndex : startIndex;

    useEffect(() => {
      if (!pendingRowFocus.current) return;
      const row = viewportRef.current?.querySelector<HTMLElement>(`tr[data-row-index="${focusedRowIndex}"]`);
      if (row) {
        row.focus();
        pendingRowFocus.current = false;
      }
    }, [focusedRowIndex, startIndex, endIndex]);

    // Flatten columns for colSpan calculations
    const totalShiftCols = periods.reduce((acc, p) => acc + p.shifts.length, 0);
    const totalTableCols = 3 + totalShiftCols;

    // Imperative scroll API
    useImperativeHandle(ref, () => ({
      scrollToIndex: (index: number) => {
        if (viewportRef.current) {
          viewportRef.current.scrollTop = Math.max(0, index * rowHeight);
        }
      },
      scrollToTop: () => {
        if (viewportRef.current) {
          viewportRef.current.scrollTop = 0;
        }
      },
    }));

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent, row: TimePhasedMatrixRow, index: number) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelectRow?.(row);
        return;
      }
      let next = index;
      if (e.key === 'ArrowDown') next = Math.min(data.length - 1, index + 1);
      else if (e.key === 'ArrowUp') next = Math.max(0, index - 1);
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = data.length - 1;
      else if (e.key === 'PageDown') next = Math.min(data.length - 1, index + Math.max(1, Math.floor(viewportHeight / rowHeight)));
      else if (e.key === 'PageUp') next = Math.max(0, index - Math.max(1, Math.floor(viewportHeight / rowHeight)));
      else return;
      e.preventDefault();
      if (next === index) return;
      pendingRowFocus.current = true;
      setFocusedRowIndex(next);
      if (next < startIndex || next >= endIndex) {
        viewportRef.current?.scrollTo({ top: next * rowHeight });
      }
    };

    return (
      <div className={`ds-time-phased-matrix ${className}`}>
        {toolbarContent && (
          <div className="ds-time-phased-matrix__toolbar">{toolbarContent}</div>
        )}

        <div
          ref={viewportRef}
          className="ds-time-phased-matrix__viewport"
          onScroll={handleScroll}
          tabIndex={data.length === 0 ? 0 : -1}
          role="region"
          aria-label={gridLabel}
        >
          <table
            className="ds-time-phased-matrix__table"
            aria-rowcount={totalRows}
            aria-colcount={totalTableCols}
          >
            <thead>
              {/* Row 1: Corner freezing & Date buckets */}
              <tr>
                <th
                  rowSpan={2}
                  className="ds-time-phased-matrix__corner-sku ds-time-phased-matrix__col-sku ds-time-phased-matrix__th--date"
                  scope="col"
                  style={{ top: 0 }}
                >
                  SKU Code
                </th>
                <th
                  rowSpan={2}
                  className="ds-time-phased-matrix__corner-name ds-time-phased-matrix__col-name ds-time-phased-matrix__th--date"
                  scope="col"
                  style={{ top: 0 }}
                >
                  Material / Botanical Name
                </th>
                <th
                  rowSpan={2}
                  className="ds-time-phased-matrix__corner-stock ds-time-phased-matrix__col-stock ds-time-phased-matrix__th--date"
                  scope="col"
                  style={{ top: 0 }}
                >
                  Current Stock
                </th>

                {periods.map((period) => (
                  <th
                    key={period.id}
                    colSpan={period.shifts.length}
                    className="ds-time-phased-matrix__th--date"
                    scope="colgroup"
                  >
                    {period.label}
                  </th>
                ))}
              </tr>

              {/* Row 2: Shift sub-headers */}
              <tr>
                {periods.flatMap((period) =>
                  period.shifts.map((shift) => (
                    <th
                      key={`${period.id}-${shift.id}`}
                      className="ds-time-phased-matrix__th--shift"
                      scope="col"
                    >
                      {shift.label}
                    </th>
                  ))
                )}
              </tr>
            </thead>

            <tbody>
              {/* Virtual top spacer */}
              {topSpacerHeight > 0 && (
                <tr style={{ height: `${topSpacerHeight}px` }} aria-hidden="true">
                  <td
                    colSpan={totalTableCols}
                    style={{
                      height: `${topSpacerHeight}px`,
                      padding: 0,
                      border: 'none',
                    }}
                  />
                </tr>
              )}

              {/* Rendered window rows */}
              {visibleRows.map((row, idx) => {
                const actualIndex = startIndex + idx;
                const isSelected = row.id === selectedRowId;

                return (
                  <tr
                    key={row.id}
                    className={`ds-time-phased-matrix__row ${
                      isSelected ? 'ds-time-phased-matrix__row--selected' : ''
                    }`}
                    style={{ height: `${rowHeight}px` }}
                    onClick={(e) => { setFocusedRowIndex(actualIndex); e.currentTarget.focus(); onSelectRow?.(row); }}
                    onFocus={() => setFocusedRowIndex(actualIndex)}
                    onKeyDown={(e) => handleKeyDown(e, row, actualIndex)}
                    tabIndex={actualIndex === rovingRowIndex ? 0 : -1}
                    data-row-index={actualIndex}
                    role="row"
                    aria-rowindex={actualIndex + 1}
                    aria-selected={isSelected}
                  >
                    {/* Sticky Column 1: SKU */}
                    <td
                      className="ds-time-phased-matrix__col-sku ds-time-phased-matrix__cell"
                      role="gridcell"
                    >
                      {row.sku}
                    </td>

                    {/* Sticky Column 2: Material / Botanical Name */}
                    <td
                      className="ds-time-phased-matrix__col-name ds-time-phased-matrix__cell"
                      role="gridcell"
                    >
                      <div
                        className="ds-time-phased-matrix__name-text"
                        title={row.name}
                      >
                        {row.name}
                      </div>
                      {row.category && (
                        <div
                          className="ds-time-phased-matrix__category-text"
                        >
                          {row.category}
                        </div>
                      )}
                    </td>

                    {/* Sticky Column 3: Current Stock (Dual UoM) */}
                    <td
                      className="ds-time-phased-matrix__col-stock ds-time-phased-matrix__cell"
                      role="gridcell"
                    >
                      <DualUomBadge
                        primaryQty={row.primaryStock}
                        primaryUom={row.primaryUom}
                        secondaryQty={row.secondaryStock}
                        secondaryUom={row.secondaryUom}
                      />
                    </td>

                    {/* Dynamic Shift Cells */}
                    {periods.flatMap((period) =>
                      period.shifts.map((shift) => {
                        const cellData = row.cells[shift.key];
                        const val = cellData?.value;
                        const isDeficit = cellData?.isDeficit || (val !== undefined && val < 0);
                        const isPlanned = cellData?.type === 'planned';

                        let cellClass = 'ds-time-phased-matrix__cell';
                        if (isDeficit) {
                          cellClass += ' ds-time-phased-matrix__cell--deficit';
                        } else if (isPlanned) {
                          cellClass += ' ds-time-phased-matrix__cell--planned';
                        }

                        return (
                          <td
                            key={`${row.id}-${period.id}-${shift.id}`}
                            className={cellClass}
                            role="gridcell"
                            title={
                              val !== undefined
                                ? `${row.sku} - ${period.label} ${shift.label}: ${val.toLocaleString()} ${row.primaryUom}${isDeficit ? ' (DEFICIT)' : ''}`
                                : undefined
                            }
                          >
                            {val !== undefined ? val.toLocaleString() : '—'}
                          </td>
                        );
                      })
                    )}
                  </tr>
                );
              })}

              {/* Virtual bottom spacer */}
              {bottomSpacerHeight > 0 && (
                <tr style={{ height: `${bottomSpacerHeight}px` }} aria-hidden="true">
                  <td
                    colSpan={totalTableCols}
                    style={{
                      height: `${bottomSpacerHeight}px`,
                      padding: 0,
                      border: 'none',
                    }}
                  />
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

TimePhasedMatrix.displayName = 'TimePhasedMatrix';
