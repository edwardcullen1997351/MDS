import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav role="navigation" aria-label="Pagination Navigation" class="ds-pagination" [class]="customClass">
      <ul class="ds-pagination-content">
        <li class="ds-pagination-item">
          <button
            type="button"
            aria-label="Go to previous page"
            [disabled]="currentPage <= 1"
            [attr.aria-disabled]="currentPage <= 1"
            (click)="setPage(currentPage - 1)"
            class="ds-pagination-link ds-pagination-nav-button"
          >
            ‹ Previous
          </button>
        </li>

        <li *ngFor="let p of visiblePages" class="ds-pagination-item">
          <span *ngIf="p === -1" aria-hidden="true" class="ds-pagination-ellipsis">•••</span>
          <button
            *ngIf="p !== -1"
            type="button"
            [attr.aria-current]="p === currentPage ? 'page' : null"
            (click)="setPage(p)"
            class="ds-pagination-link"
            [class.ds-pagination-link--active]="p === currentPage"
          >
            {{ p }}
          </button>
        </li>

        <li class="ds-pagination-item">
          <button
            type="button"
            aria-label="Go to next page"
            [disabled]="currentPage >= totalPages"
            [attr.aria-disabled]="currentPage >= totalPages"
            (click)="setPage(currentPage + 1)"
            class="ds-pagination-link ds-pagination-nav-button"
          >
            Next ›
          </button>
        </li>
      </ul>
    </nav>
  `,
  styleUrls: ['./pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsPaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() customClass = '';

  @Output() pageChange = new EventEmitter<number>();

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    if (current <= 4) {
      return [1, 2, 3, 4, 5, -1, total];
    }

    if (current >= total - 3) {
      return [1, -1, total - 4, total - 3, total - 2, total - 1, total];
    }

    return [1, -1, current - 1, current, current + 1, -1, total];
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
  }
}
