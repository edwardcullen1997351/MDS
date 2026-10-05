import {
  Component,
  Input,
  ChangeDetectionStrategy,
  HostListener,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingDataTooltip } from './floating-data-tooltip';

@Component({
  selector: 'ds-stock-runway-horizon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ds-stock-runway"
      [class]="customClass"
      [style.width]="width"
      (mouseenter)="showTooltip($event)"
      (mouseleave)="hideTooltip()"
      (focus)="showTooltip($event)"
      (blur)="hideTooltip()"
      tabindex="0"
      role="img"
      [attr.aria-label]="accessibleLabel"
    >
      <div class="ds-stock-runway__svg-container" [style.height.px]="height">
        <svg
          viewBox="0 0 100 24"
          preserveAspectRatio="none"
          class="ds-stock-runway__svg"
          aria-hidden="true"
        >
          <defs>
            <pattern
              [id]="'deficit-hatch-' + instanceId"
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="4"
                class="ds-stock-runway__hatch-line"
                stroke-width="1.2"
              ></line>
            </pattern>
          </defs>

          <!-- Background Track -->
          <rect
            x="0"
            y="4"
            width="100"
            height="16"
            rx="4"
            ry="4"
            class="ds-stock-runway__track"
          ></rect>

          <!-- Deficit Zone -->
          <rect
            *ngIf="zeroPercent < 100"
            [attr.x]="zeroPercent"
            y="4"
            [attr.width]="100 - zeroPercent"
            height="16"
            [attr.fill]="'url(#deficit-hatch-' + instanceId + ')'"
            class="ds-stock-runway__segment-deficit"
          ></rect>

          <!-- Reorder Threshold Zone (Yellow) -->
          <rect
            *ngIf="reorderPercent > 0"
            [attr.x]="safePercent"
            y="4"
            [attr.width]="reorderPercent"
            height="16"
            class="ds-stock-runway__segment-reorder"
          ></rect>

          <!-- Safe Stock Days (Green) -->
          <rect
            *ngIf="safePercent > 0"
            x="0"
            y="4"
            [attr.width]="safePercent"
            height="16"
            rx="4"
            ry="4"
            class="ds-stock-runway__segment-safe"
          ></rect>

          <!-- Zero Stockout Event Line & Marker -->
          <g
            *ngIf="zeroDay > 0 && zeroDay <= totalDays"
            class="ds-stock-runway__marker-group"
            [attr.transform]="'translate(' + zeroPercent + ', 0)'"
          >
            <line
              x1="0"
              y1="2"
              x2="0"
              y2="22"
              class="ds-stock-runway__marker-line"
              stroke-width="2"
            ></line>
            <polygon
              points="-3,1 0,5 3,1 0,-3"
              class="ds-stock-runway__marker-diamond"
            ></polygon>
          </g>
        </svg>
      </div>

      <!-- Inline Readout -->
      <div *ngIf="showInlineBadge" class="ds-stock-runway__info">
        <span class="ds-stock-runway__badge ds-stock-runway__badge--safe">
          {{ safeClamped }}d Safe
        </span>
        <span class="ds-stock-runway__badge ds-stock-runway__badge--reorder">
          Reorder: {{ reorderLabel }}
        </span>
        <span class="ds-stock-runway__badge ds-stock-runway__badge--stockout">
          Stockout: {{ stockoutLabel }}
        </span>
      </div>

    </div>
  `,
  styleUrls: ['./stock-runway-horizon.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsStockRunwayHorizonComponent implements OnDestroy {
  @Input({ required: true }) safeDays!: number;
  @Input({ required: true }) reorderDays!: number;
  @Input() totalHorizonDays = 30;
  @Input() stockoutDay?: number;
  @Input() stockoutDateLabel?: string;
  @Input() reorderPointDateLabel?: string;
  @Input() currentStockQty?: number;
  @Input() uom = 'KG';
  @Input() dailyBurnRate?: number;
  @Input() height = 24;
  @Input() width: string | number = '100%';
  @Input() showInlineBadge = true;
  @Input() customClass = '';

  private readonly tooltip = new FloatingDataTooltip();
  instanceId = Math.random().toString(36).substring(2, 9);

  get totalDays(): number {
    return Math.max(1, this.totalHorizonDays);
  }

  get zeroDay(): number {
    return Math.max(0, this.stockoutDay ?? Math.max(0, this.safeDays) + Math.max(0, this.reorderDays));
  }

  get zeroClamped(): number {
    return Math.min(this.totalDays, this.zeroDay);
  }

  get safeClamped(): number {
    return Math.min(this.zeroClamped, Math.max(0, this.safeDays));
  }

  get reorderClamped(): number {
    return Math.max(0, this.zeroClamped - this.safeClamped);
  }

  get reorderLabel(): string {
    return this.reorderPointDateLabel || `Day ${this.safeClamped}`;
  }

  get stockoutLabel(): string {
    return this.stockoutDateLabel || `Day ${this.zeroDay}`;
  }

  get safePercent(): number {
    return (this.safeClamped / this.totalDays) * 100;
  }

  get reorderPercent(): number {
    return (this.reorderClamped / this.totalDays) * 100;
  }

  get zeroPercent(): number {
    return (this.zeroClamped / this.totalDays) * 100;
  }

  get accessibleLabel(): string {
    return `Stock runway: ${this.safeClamped} days safe, reorder by ${this.reorderLabel}, projected stockout ${this.stockoutLabel}`;
  }

  showTooltip(event: MouseEvent | FocusEvent): void {
    this.tooltip.show({
      anchor: event.currentTarget as HTMLElement,
      prefix: 'ds-stock-runway',
      heading: 'Stock Runway Analysis',
      tag: `${this.zeroDay} Days Left`,
      rows: [
        ...(this.currentStockQty != null ? [{ label: 'On-Hand:', value: `${this.currentStockQty} ${this.uom}` }] : []),
        ...(this.dailyBurnRate != null ? [{ label: 'Burn Rate:', value: `${this.dailyBurnRate} ${this.uom}/day` }] : []),
        { label: 'Reorder By:', value: this.reorderLabel, tone: 'warning' },
        { label: 'Zero-Stockout:', value: this.stockoutLabel, tone: 'danger' },
      ],
    });
  }

  hideTooltip(): void {
    this.tooltip.hide();
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.hideTooltip();
  }

  ngOnDestroy(): void {
    this.hideTooltip();
  }
}
