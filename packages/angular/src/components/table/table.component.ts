import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type TableDensity = 'compact' | 'standard' | 'relaxed';
export type TableCellAlign = 'left' | 'center' | 'right';
export type TableSortDirection = 'asc' | 'desc' | 'none';

@Component({
  selector: 'ds-table-head',
  standalone: true,
  imports: [CommonModule],
  template: `
    <th
      scope="col"
      [attr.aria-sort]="ariaSort"
      [tabIndex]="sortable ? 0 : null"
      (click)="onHeadClick()"
      (keydown.enter)="onHeadClick()"
      (keydown.space)="onHeadClick()"
      class="ds-table-head"
      [class.ds-table-head--left]="align === 'left'"
      [class.ds-table-head--center]="align === 'center'"
      [class.ds-table-head--right]="align === 'right'"
      [class.ds-table-head--sortable]="sortable"
      [class]="customClass"
    >
      <div class="ds-table-head-inner">
        <ng-content></ng-content>
        <span
          *ngIf="sortable"
          class="ds-table-sort-icon"
          [class.ds-table-sort-icon--active]="sortDirection !== 'none'"
          aria-hidden="true"
        >
          {{ sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : '▲▼' }}
        </span>
      </div>
    </th>
  `,
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTableHeadComponent {
  @Input() align: TableCellAlign = 'left';
  @Input() sortable = false;
  @Input() sortDirection: TableSortDirection = 'none';
  @Input() customClass = '';
  @Output() sort = new EventEmitter<void>();

  get ariaSort(): string | null {
    if (this.sortDirection === 'asc') return 'ascending';
    if (this.sortDirection === 'desc') return 'descending';
    return null;
  }

  onHeadClick(): void {
    if (this.sortable) {
      this.sort.emit();
    }
  }
}

@Component({
  selector: 'ds-table-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <td
      class="ds-table-cell"
      [class.ds-table-cell--left]="align === 'left'"
      [class.ds-table-cell--center]="align === 'center'"
      [class.ds-table-cell--right]="align === 'right'"
      [class]="customClass"
    >
      <ng-content></ng-content>
    </td>
  `,
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTableCellComponent {
  @Input() align: TableCellAlign = 'left';
  @Input() customClass = '';
}

@Component({
  selector: 'ds-table-row',
  standalone: true,
  imports: [CommonModule],
  template: `
    <tr class="ds-table-row" [class]="customClass">
      <ng-content></ng-content>
    </tr>
  `,
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTableRowComponent {
  @Input() customClass = '';
}

@Component({
  selector: 'ds-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ds-table-container"
      [class.ds-table-container--bordered]="bordered"
      [class]="wrapperClass"
    >
      <table
        class="ds-table"
        [class.ds-table--density-compact]="density === 'compact'"
        [class.ds-table--density-standard]="density === 'standard'"
        [class.ds-table--density-relaxed]="density === 'relaxed'"
        [class.ds-table--striped]="striped"
        [class.ds-table--hoverable]="hoverable"
        [class]="customClass"
      >
        <ng-content></ng-content>
      </table>
    </div>
  `,
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTableComponent {
  @Input() density: TableDensity = 'standard';
  @Input() striped = false;
  @Input() hoverable = true;
  @Input() bordered = true;
  @Input() customClass = '';
  @Input() wrapperClass = '';
}
