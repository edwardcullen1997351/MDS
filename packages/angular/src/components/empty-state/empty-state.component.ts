import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ds-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ds-empty-state"
      [class.ds-empty-state--size-sm]="size === 'sm'"
      [class.ds-empty-state--size-md]="size === 'md'"
      [class.ds-empty-state--size-lg]="size === 'lg'"
      [class]="customClass"
    >
      <div *ngIf="hasIcon" class="ds-empty-state-icon" aria-hidden="true">
        <ng-content select="[empty-icon]"></ng-content>
      </div>

      <h3 class="ds-empty-state-title">{{ title }}</h3>

      <p *ngIf="description" class="ds-empty-state-description">
        {{ description }}
      </p>

      <ng-content></ng-content>

      <div class="ds-empty-state-actions">
        <ng-content select="[empty-secondary-action]"></ng-content>
        <ng-content select="[empty-primary-action]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./empty-state.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsEmptyStateComponent {
  @Input({ required: true }) title = '';
  @Input() description?: string;
  @Input() size: EmptyStateSize = 'md';
  @Input() hasIcon = true;
  @Input() customClass = '';
}
