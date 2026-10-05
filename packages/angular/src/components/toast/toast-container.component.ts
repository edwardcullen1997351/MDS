import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsToastService, DsToastData, DsToastStatus } from './toast.service.js';

@Component({
  selector: 'ds-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="['ds-toast-container', 'ds-toast-container--' + position]" aria-label="Notifications">
      <div
        *ngFor="let toast of toastService.toasts$ | async"
        [ngClass]="['ds-toast', 'ds-toast--' + toast.status]"
        [attr.role]="toast.status === 'error' || toast.status === 'warning' ? 'alert' : 'status'"
        [attr.aria-live]="toast.status === 'error' || toast.status === 'warning' ? 'assertive' : 'polite'"
      >
        <span class="ds-toast__icon" aria-hidden="true">{{ getStatusIcon(toast.status) }}</span>

        <div class="ds-toast__content">
          <h4 class="ds-toast__title">{{ toast.title }}</h4>
          <p *ngIf="toast.description" class="ds-toast__description">{{ toast.description }}</p>
          <div *ngIf="toast.action" class="ds-toast__action">
            <button
              type="button"
              class="ds-button ds-button--sm ds-button--secondary"
              (click)="onActionClick(toast)"
            >
              {{ toast.action.label }}
            </button>
          </div>
        </div>

        <button
          type="button"
          class="ds-toast__close"
          aria-label="Dismiss notification"
          (click)="toastService.dismiss(toast.id)"
        >
          ✕
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./toast.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsToastContainerComponent {
  @Input() position: 'top-right' | 'top-center' | 'bottom-right' = 'top-right';

  constructor(public toastService: DsToastService) {}

  getStatusIcon(status?: DsToastStatus): string {
    switch (status) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '🚨';
      default:
        return 'ℹ️';
    }
  }

  onActionClick(toast: DsToastData): void {
    if (toast.action) {
      toast.action.onClick();
      this.toastService.dismiss(toast.id);
    }
  }
}
