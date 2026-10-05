import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-stale-data-pill',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="ds-stale-pill"
      [class.ds-stale-pill--critical]="isCritical"
      [class.ds-stale-pill--stale]="isStale"
      [class.ds-stale-pill--fresh]="isFresh"
      [class]="customClass"
      role="status"
      aria-live="polite"
    >
      <span aria-hidden="true">
        {{ isRefreshing ? '⏳' : isCritical ? '⚠️' : isStale ? '⏱️' : '✓' }}
      </span>
      <span>{{ statusText }}</span>
      <button
        *ngIf="showRefreshButton && !isRefreshing"
        type="button"
        class="ds-stale-pill__refresh"
        (click)="triggerRefresh()"
        aria-label="Refresh MRP calculation"
        title="Refresh calculation"
      >
        🔄
      </button>
    </span>
  `,
  styleUrls: ['./badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsStaleDataPillComponent implements OnInit, OnDestroy {
  @Input() lastSyncTime?: Date | number;
  @Input() ageMinutes?: number;
  @Input() staleThresholdMinutes = 5;
  @Input() criticalThresholdMinutes = 15;
  @Input() isRefreshing = false;
  @Input() showRefreshButton = true;
  @Input() customClass = '';

  @Output() refresh = new EventEmitter<void>();

  computedAge = 0;
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.updateAge();
    this.timer = setInterval(() => this.updateAge(), 30000);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  updateAge(): void {
    if (this.ageMinutes !== undefined) {
      this.computedAge = this.ageMinutes;
      return;
    }
    if (!this.lastSyncTime) {
      this.computedAge = 0;
      return;
    }
    const ms = Date.now() - new Date(this.lastSyncTime).getTime();
    this.computedAge = Math.max(0, Math.floor(ms / 60000));
  }

  get isCritical(): boolean {
    return this.computedAge >= this.criticalThresholdMinutes;
  }

  get isStale(): boolean {
    return !this.isCritical && this.computedAge >= this.staleThresholdMinutes;
  }

  get isFresh(): boolean {
    return !this.isCritical && !this.isStale;
  }

  get statusText(): string {
    if (this.isRefreshing) return 'Recalculating...';
    if (this.isCritical) return `Stale calculation (${this.computedAge}m)`;
    if (this.isStale) return `Data ${this.computedAge}m stale`;
    if (this.computedAge === 0) return 'Synced just now';
    return `Synced ${this.computedAge}m ago`;
  }

  triggerRefresh(): void {
    this.refresh.emit();
  }
}
