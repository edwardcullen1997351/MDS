import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsDualUomBadgeComponent } from '../badge/dual-uom-badge.component.js';

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

@Component({
  selector: 'ds-time-phased-matrix',
  standalone: true,
  imports: [CommonModule, DsDualUomBadgeComponent],
  template: `
    <div class="ds-time-phased-matrix" [class]="customClass">
      <div class="ds-time-phased-matrix__toolbar">
        <ng-content select="[toolbar]"></ng-content>
      </div>

      <div
        #viewport
        class="ds-time-phased-matrix__viewport"
        (scroll)="onScroll($event)"
        [attr.tabindex]="data.length === 0 ? 0 : -1"
        role="region"
        [attr.aria-label]="gridLabel"
      >
        <table
          class="ds-time-phased-matrix__table"
          role="grid"
          [attr.aria-rowcount]="data.length"
          [attr.aria-colcount]="totalTableCols"
        >
          <thead>
            <!-- Row 1: Sticky corner cells and Date buckets -->
            <tr>
              <th
                rowspan="2"
                class="ds-time-phased-matrix__corner-sku ds-time-phased-matrix__col-sku ds-time-phased-matrix__th--date"
                scope="col"
                style="top: 0"
              >
                SKU Code
              </th>
              <th
                rowspan="2"
                class="ds-time-phased-matrix__corner-name ds-time-phased-matrix__col-name ds-time-phased-matrix__th--date"
                scope="col"
                style="top: 0"
              >
                Material / Botanical Name
              </th>
              <th
                rowspan="2"
                class="ds-time-phased-matrix__corner-stock ds-time-phased-matrix__col-stock ds-time-phased-matrix__th--date"
                scope="col"
                style="top: 0"
              >
                Current Stock
              </th>

              <th
                *ngFor="let period of periods; trackBy: trackByPeriodId"
                [attr.colspan]="period.shifts.length"
                class="ds-time-phased-matrix__th--date"
                scope="colgroup"
              >
                {{ period.label }}
              </th>
            </tr>

            <!-- Row 2: Shift sub-headers -->
            <tr>
              <ng-container *ngFor="let period of periods; trackBy: trackByPeriodId">
                <th
                  *ngFor="let shift of period.shifts; trackBy: trackByShiftId"
                  class="ds-time-phased-matrix__th--shift"
                  scope="col"
                >
                  {{ shift.label }}
                </th>
              </ng-container>
            </tr>
          </thead>

          <tbody>
            <!-- Virtual Top Spacer -->
            <tr
              *ngIf="topSpacerHeight > 0"
              [style.height.px]="topSpacerHeight"
              aria-hidden="true"
            >
              <td
                [attr.colspan]="totalTableCols"
                [style.height.px]="topSpacerHeight"
                style="padding: 0; border: none;"
              ></td>
            </tr>

            <!-- Visible Window Rows -->
            <tr
              *ngFor="let row of visibleRows; let idx = index; trackBy: trackByRowId"
              class="ds-time-phased-matrix__row"
              [class.ds-time-phased-matrix__row--selected]="row.id === selectedRowId"
              [style.height.px]="rowHeight"
              (click)="onRowClick(row, startIndex + idx, $event)"
              (focus)="onRowFocus(startIndex + idx)"
              (keydown)="onRowKeyDown($event, row, startIndex + idx)"
              [attr.tabindex]="startIndex + idx === rovingRowIndex ? 0 : -1"
              [attr.data-row-index]="startIndex + idx"
              role="row"
              [attr.aria-rowindex]="startIndex + idx + 1"
              [attr.aria-selected]="row.id === selectedRowId"
            >
              <!-- Sticky Column 1: SKU -->
              <td
                class="ds-time-phased-matrix__col-sku ds-time-phased-matrix__cell"
                role="gridcell"
              >
                {{ row.sku }}
              </td>

              <!-- Sticky Column 2: Material Name -->
              <td
                class="ds-time-phased-matrix__col-name ds-time-phased-matrix__cell"
                role="gridcell"
              >
                <div
                  class="ds-time-phased-matrix__name-text"
                  [attr.title]="row.name"
                >
                  {{ row.name }}
                </div>
                <div
                  *ngIf="row.category"
                  class="ds-time-phased-matrix__category-text"
                >
                  {{ row.category }}
                </div>
              </td>

              <!-- Sticky Column 3: Stock Dual UoM -->
              <td
                class="ds-time-phased-matrix__col-stock ds-time-phased-matrix__cell"
                role="gridcell"
              >
                <ds-dual-uom-badge
                  [primaryQty]="row.primaryStock"
                  [primaryUom]="row.primaryUom"
                  [secondaryQty]="row.secondaryStock"
                  [secondaryUom]="row.secondaryUom"
                ></ds-dual-uom-badge>
              </td>

              <!-- Dynamic Shift Cells -->
              <ng-container *ngFor="let period of periods; trackBy: trackByPeriodId">
                <td
                  *ngFor="let shift of period.shifts; trackBy: trackByShiftId"
                  class="ds-time-phased-matrix__cell"
                  [class.ds-time-phased-matrix__cell--deficit]="isDeficit(row, shift.key)"
                  [class.ds-time-phased-matrix__cell--planned]="isPlanned(row, shift.key)"
                  role="gridcell"
                  [attr.title]="getCellTitle(row, period.label, shift.label, shift.key)"
                >
                  {{ formatCellValue(row, shift.key) }}
                </td>
              </ng-container>
            </tr>

            <!-- Virtual Bottom Spacer -->
            <tr
              *ngIf="bottomSpacerHeight > 0"
              [style.height.px]="bottomSpacerHeight"
              aria-hidden="true"
            >
              <td
                [attr.colspan]="totalTableCols"
                [style.height.px]="bottomSpacerHeight"
                style="padding: 0; border: none;"
              ></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrls: ['./time-phased-matrix.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTimePhasedMatrixComponent implements AfterViewInit, OnDestroy {
  @Input() data: TimePhasedMatrixRow[] = [];
  @Input() periods: TimePhasedPeriod[] = [];
  @Input() rowHeight = 44;
  @Input() overscan = 8;
  @Input() selectedRowId?: string;
  @Input() gridLabel = 'Time-Phased Production & Inventory Matrix';
  @Input() customClass = '';

  @Output() selectRow = new EventEmitter<TimePhasedMatrixRow>();

  @ViewChild('viewport') viewportRef?: ElementRef<HTMLDivElement>;

  scrollTop = 0;
  viewportHeight = 500;
  focusedRowIndex = 0;
  private resizeObserver?: ResizeObserver;

  constructor(@Inject(ChangeDetectorRef) private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (this.viewportRef?.nativeElement) {
      const el = this.viewportRef.nativeElement;
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.height > 0) {
            this.viewportHeight = entry.contentRect.height;
            this.cdr.markForCheck();
          }
        }
      });
      this.resizeObserver.observe(el);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  get totalShiftCols(): number {
    return this.periods.reduce((acc, p) => acc + p.shifts.length, 0);
  }

  get totalTableCols(): number {
    return 3 + this.totalShiftCols;
  }

  get startIndex(): number {
    return Math.max(0, Math.floor(this.scrollTop / this.rowHeight) - this.overscan);
  }

  get endIndex(): number {
    const visibleCount = Math.ceil(this.viewportHeight / this.rowHeight) + 2 * this.overscan;
    return Math.min(this.data.length, this.startIndex + visibleCount);
  }

  get topSpacerHeight(): number {
    return this.startIndex * this.rowHeight;
  }

  get bottomSpacerHeight(): number {
    return Math.max(0, (this.data.length - this.endIndex) * this.rowHeight);
  }

  get visibleRows(): TimePhasedMatrixRow[] {
    return this.data.slice(this.startIndex, this.endIndex);
  }

  get rovingRowIndex(): number {
    return this.focusedRowIndex >= this.startIndex && this.focusedRowIndex < this.endIndex
      ? this.focusedRowIndex : this.startIndex;
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    this.scrollTop = target.scrollTop;
    this.cdr.markForCheck();
  }

  onRowClick(row: TimePhasedMatrixRow, index: number, event: MouseEvent): void {
    this.focusedRowIndex = index;
    (event.currentTarget as HTMLElement).focus();
    this.selectRow.emit(row);
  }

  onRowFocus(index: number): void {
    this.focusedRowIndex = index;
    this.cdr.markForCheck();
  }

  onRowKeyDown(event: KeyboardEvent, row: TimePhasedMatrixRow, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectRow.emit(row);
      return;
    }
    let next = index;
    if (event.key === 'ArrowDown') next = Math.min(this.data.length - 1, index + 1);
    else if (event.key === 'ArrowUp') next = Math.max(0, index - 1);
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = this.data.length - 1;
    else if (event.key === 'PageDown') next = Math.min(this.data.length - 1, index + Math.max(1, Math.floor(this.viewportHeight / this.rowHeight)));
    else if (event.key === 'PageUp') next = Math.max(0, index - Math.max(1, Math.floor(this.viewportHeight / this.rowHeight)));
    else return;
    event.preventDefault();
    if (next === index) return;
    this.focusedRowIndex = next;
    const viewport = this.viewportRef?.nativeElement;
    if (viewport && (next < this.startIndex || next >= this.endIndex)) {
      viewport.scrollTop = next * this.rowHeight;
      this.scrollTop = viewport.scrollTop;
    }
    this.cdr.detectChanges();
    viewport?.querySelector<HTMLElement>(`tr[data-row-index="${next}"]`)?.focus();
  }

  isDeficit(row: TimePhasedMatrixRow, key: string): boolean {
    const cell = row.cells[key];
    if (!cell) return false;
    return !!cell.isDeficit || (cell.value !== undefined && cell.value < 0);
  }

  isPlanned(row: TimePhasedMatrixRow, key: string): boolean {
    return row.cells[key]?.type === 'planned';
  }

  formatCellValue(row: TimePhasedMatrixRow, key: string): string {
    const val = row.cells[key]?.value;
    return val !== undefined ? val.toLocaleString() : '—';
  }

  getCellTitle(
    row: TimePhasedMatrixRow,
    periodLabel: string,
    shiftLabel: string,
    key: string
  ): string | undefined {
    const cell = row.cells[key];
    if (!cell || cell.value === undefined) return undefined;
    const deficitStr = this.isDeficit(row, key) ? ' (DEFICIT)' : '';
    return `${row.sku} - ${periodLabel} ${shiftLabel}: ${cell.value.toLocaleString()} ${row.primaryUom}${deficitStr}`;
  }

  trackByRowId(_index: number, item: TimePhasedMatrixRow): string {
    return item.id;
  }

  trackByPeriodId(_index: number, item: TimePhasedPeriod): string {
    return item.id;
  }

  trackByShiftId(_index: number, item: TimePhasedShift): string {
    return item.id;
  }
}
