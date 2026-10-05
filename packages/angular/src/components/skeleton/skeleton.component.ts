import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

@Component({
  selector: 'ds-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="count > 1; else singleSkeleton"
      class="ds-skeleton-group"
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span
        *ngFor="let item of items; let isLast = last"
        class="ds-skeleton"
        [class.ds-skeleton--text]="variant === 'text'"
        [class.ds-skeleton--circular]="variant === 'circular'"
        [class.ds-skeleton--rectangular]="variant === 'rectangular'"
        [class.ds-skeleton--rounded]="variant === 'rounded'"
        [class.ds-skeleton--pulse]="animation === 'pulse'"
        [class.ds-skeleton--wave]="animation === 'wave'"
        [class]="customClass"
        [style.width]="isLast && variant === 'text' && !width ? '70%' : computedWidth"
        [style.height]="computedHeight"
      ></span>
      <span class="sr-only">Loading content...</span>
    </div>

    <ng-template #singleSkeleton>
      <span
        class="ds-skeleton"
        [class.ds-skeleton--text]="variant === 'text'"
        [class.ds-skeleton--circular]="variant === 'circular'"
        [class.ds-skeleton--rectangular]="variant === 'rectangular'"
        [class.ds-skeleton--rounded]="variant === 'rounded'"
        [class.ds-skeleton--pulse]="animation === 'pulse'"
        [class.ds-skeleton--wave]="animation === 'wave'"
        [class]="customClass"
        [style.width]="computedWidth"
        [style.height]="computedHeight"
        role="status"
        aria-busy="true"
        aria-live="polite"
      >
        <span class="sr-only">Loading content...</span>
      </span>
    </ng-template>
  `,
  styleUrls: ['./skeleton.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsSkeletonComponent {
  @Input() variant: SkeletonVariant = 'text';
  @Input() animation: SkeletonAnimation = 'wave';
  @Input() width?: string | number;
  @Input() height?: string | number;
  @Input() count = 1;
  @Input() customClass = '';

  get items(): number[] {
    return Array.from({ length: this.count });
  }

  get computedWidth(): string | null {
    if (this.width === undefined) return null;
    return typeof this.width === 'number' ? `${this.width}px` : this.width;
  }

  get computedHeight(): string | null {
    if (this.height === undefined) return null;
    return typeof this.height === 'number' ? `${this.height}px` : this.height;
  }
}
