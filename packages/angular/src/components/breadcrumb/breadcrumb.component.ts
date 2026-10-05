import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

@Component({
  selector: 'ds-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav aria-label="Breadcrumb" class="ds-breadcrumb" [class]="customClass">
      <ol class="ds-breadcrumb-list">
        <li
          *ngFor="let item of items; let isLast = last"
          class="ds-breadcrumb-item"
        >
          <a
            *ngIf="!item.isCurrent && !isLast && item.href; else textOrPage"
            [href]="item.href"
            (click)="onItemClick(item, $event)"
            class="ds-breadcrumb-link"
          >
            {{ item.label }}
          </a>

          <ng-template #textOrPage>
            <span
              *ngIf="item.isCurrent || isLast; else plainLink"
              role="link"
              aria-disabled="true"
              aria-current="page"
              class="ds-breadcrumb-page"
            >
              {{ item.label }}
            </span>
          </ng-template>

          <ng-template #plainLink>
            <button
              type="button"
              (click)="onItemClick(item, $event)"
              class="ds-breadcrumb-link"
            >
              {{ item.label }}
            </button>
          </ng-template>

          <span
            *ngIf="!isLast"
            role="presentation"
            aria-hidden="true"
            class="ds-breadcrumb-separator"
          >
            {{ separator }}
          </span>
        </li>
      </ol>
    </nav>
  `,
  styleUrls: ['./breadcrumb.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsBreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
  @Input() separator = '›';
  @Input() customClass = '';

  @Output() itemClick = new EventEmitter<BreadcrumbItem>();

  onItemClick(item: BreadcrumbItem, event: Event): void {
    if (this.itemClick.observed) {
      event.preventDefault();
      this.itemClick.emit(item);
    }
  }
}
