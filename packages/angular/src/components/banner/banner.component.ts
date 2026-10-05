import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DsBannerStatus = 'info' | 'success' | 'warning' | 'error';

@Component({
  selector: 'ds-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="isVisible"
      [attr.role]="status === 'error' || status === 'warning' ? 'alert' : 'status'"
      [ngClass]="['ds-banner', 'ds-banner--' + status]"
    >
      <span class="ds-banner__icon" aria-hidden="true">{{ getStatusIcon() }}</span>

      <div class="ds-banner__content">
        <h4 *ngIf="title" class="ds-banner__title">{{ title }}</h4>
        <div class="ds-banner__description">
          <ng-content></ng-content>
        </div>
        <div class="ds-banner__action">
          <ng-content select="[slot=action]"></ng-content>
        </div>
      </div>

      <button
        *ngIf="isDismissible"
        type="button"
        class="ds-banner__close"
        aria-label="Dismiss banner"
        (click)="dismiss()"
      >
        ✕
      </button>
    </div>
  `,
  styleUrls: ['./banner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsBannerComponent {
  @Input() title?: string;
  @Input() status: DsBannerStatus = 'info';
  @Input() isDismissible: boolean = false;

  @Output() dismissed = new EventEmitter<void>();

  isVisible: boolean = true;

  getStatusIcon(): string {
    switch (this.status) {
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

  dismiss(): void {
    this.isVisible = false;
    this.dismissed.emit();
  }
}
