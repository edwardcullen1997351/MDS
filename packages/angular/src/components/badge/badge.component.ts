import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DsBadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export type DsBadgeStyle = 'subtle' | 'solid' | 'outline';
export type DsBadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ds-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [ngClass]="rootClasses">
      <span *ngIf="hasDot" class="ds-badge__dot" aria-hidden="true"></span>
      <span class="ds-badge__icon-left" aria-hidden="true">
        <ng-content select="[slot=left-icon]"></ng-content>
      </span>
      <span class="ds-badge__content">
        <ng-content></ng-content>
      </span>
      <span class="ds-badge__icon-right" aria-hidden="true">
        <ng-content select="[slot=right-icon]"></ng-content>
      </span>
      <button
        *ngIf="isDismissible"
        type="button"
        class="ds-badge__dismiss"
        aria-label="Remove tag"
        (click)="onDismissClick($event)"
      >
        ✕
      </button>
    </span>
  `,
  styleUrls: ['./badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsBadgeComponent {
  @Input() variant: DsBadgeVariant = 'neutral';
  @Input() styleVariant: DsBadgeStyle = 'subtle';
  @Input() size: DsBadgeSize = 'md';
  @Input() hasDot: boolean = false;
  @Input() isDismissible: boolean = false;

  @Output() dismissed = new EventEmitter<MouseEvent>();

  get rootClasses(): string {
    return [
      'ds-badge',
      `ds-badge--${this.variant}`,
      `ds-badge--${this.styleVariant}`,
      `ds-badge--${this.size}`,
    ]
      .filter(Boolean)
      .join(' ');
  }

  onDismissClick(event: MouseEvent): void {
    event.stopPropagation();
    this.dismissed.emit(event);
  }
}
