import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TimeHorizonBucket = 'shift' | 'day' | 'week' | 'month';

@Component({
  selector: 'ds-time-horizon-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ds-time-horizon-stepper"
      [class]="customClass"
      role="toolbar"
      [attr.aria-label]="ariaLabel"
    >
      <div class="ds-time-horizon-stepper__buckets" role="radiogroup" aria-label="Horizon Granularity" (keydown)="onBucketKeyDown($event)">
        <button
          *ngFor="let b of buckets"
          type="button"
          role="radio"
          [attr.aria-checked]="bucketSize === b.key"
          [attr.tabindex]="bucketSize === b.key ? 0 : -1"
          class="ds-time-horizon-stepper__bucket-btn"
          [class.ds-time-horizon-stepper__bucket-btn--active]="bucketSize === b.key"
          (click)="setBucket(b.key)"
        >
          {{ b.label }}
        </button>
      </div>

      <div class="ds-time-horizon-stepper__nav">
        <button
          type="button"
          class="ds-time-horizon-stepper__nav-btn"
          (click)="prev.emit()"
          [disabled]="prevDisabled"
          aria-label="Previous planning horizon"
          title="Previous (Arrow Left)"
        >
          ◀
        </button>

        <span class="ds-time-horizon-stepper__current" aria-live="polite" title="Active horizon">
          {{ currentHorizonLabel }}
        </span>

        <button
          type="button"
          class="ds-time-horizon-stepper__nav-btn"
          (click)="next.emit()"
          [disabled]="nextDisabled"
          aria-label="Next planning horizon"
          title="Next (Arrow Right)"
        >
          ▶
        </button>
      </div>

      <button
        *ngIf="showJumpToday"
        type="button"
        class="ds-time-horizon-stepper__jump-btn"
        (click)="jumpToday.emit()"
        [attr.aria-label]="jumpTodayLabel"
        [attr.title]="jumpTodayLabel"
      >
        <span aria-hidden="true" style="font-size: 12px">⟲</span>
        <span>{{ jumpTodayLabel }}</span>
      </button>
    </div>
  `,
  styleUrls: ['./time-horizon-stepper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTimeHorizonStepperComponent {
  @Input() bucketSize: TimeHorizonBucket = 'day';
  @Input({ required: true }) currentHorizonLabel!: string;
  @Input() jumpTodayLabel = 'Today / Shift 1';
  @Input() showJumpToday = true;
  @Input() prevDisabled = false;
  @Input() nextDisabled = false;
  @Input() ariaLabel = 'Production planning time horizon';
  @Input() customClass = '';

  @Output() bucketSizeChange = new EventEmitter<TimeHorizonBucket>();
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() jumpToday = new EventEmitter<void>();

  buckets: { key: TimeHorizonBucket; label: string }[] = [
    { key: 'shift', label: 'Shift' },
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
  ];

  setBucket(bucket: TimeHorizonBucket): void {
    this.bucketSize = bucket;
    this.bucketSizeChange.emit(bucket);
  }

  onBucketKeyDown(event: KeyboardEvent): void {
    const currentIndex = this.buckets.findIndex(bucket => bucket.key === this.bucketSize);
    let nextIndex: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (currentIndex + 1) % this.buckets.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (currentIndex + this.buckets.length - 1) % this.buckets.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = this.buckets.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    this.setBucket(this.buckets[nextIndex].key);
    (event.currentTarget as HTMLElement).querySelectorAll<HTMLButtonElement>('[role="radio"]')[nextIndex]?.focus();
  }
}
