import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RescheduleOrderBlock {
  id: string;
  code: string;
  name: string;
  shift: 1 | 2 | 3;
  lineId: string;
  lineName: string;
  quantity: number;
  uom: string;
  transitLeadTimeHours?: number;
  maxLineCapacity?: number;
  status?: 'idle' | 'validating' | 'confirmed' | 'error';
  errorMessage?: string;
}

export interface ShiftColumnDefinition {
  shiftNumber: 1 | 2 | 3;
  name: string;
  timeWindow: string;
  capacityLimit: number;
  uom: string;
}

@Component({
  selector: 'ds-optimistic-drag-reschedule',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-drag-reschedule" [class]="customClass">
      <div class="ds-drag-reschedule__header">
        <div>
          <h3 class="ds-drag-reschedule__title">Shift Dispatch Board</h3>
          <p class="ds-drag-reschedule__subtitle">
            Drag order cards across shift columns to reschedule. Validates line capacity & transit lead times in real time.
          </p>
        </div>
      </div>

      <div class="ds-drag-reschedule__board" role="region" aria-label="Shift Dispatch Board">
        <div
          *ngFor="let col of shifts"
          class="ds-drag-reschedule__col"
          [class.ds-drag-reschedule__col--dragover]="dragOverShift === col.shiftNumber"
          (dragover)="onDragOver($event, col.shiftNumber)"
          (dragleave)="onDragLeave()"
          (drop)="onDrop($event, col.shiftNumber)"
          role="group"
          [attr.aria-label]="col.name"
        >
          <div class="ds-drag-reschedule__col-header">
            <div class="ds-drag-reschedule__col-title-group">
              <span class="ds-drag-reschedule__col-name">{{ col.name }}</span>
              <span class="ds-drag-reschedule__col-time">{{ col.timeWindow }}</span>
            </div>
            <div
              class="ds-drag-reschedule__col-capacity"
              [class.ds-drag-reschedule__col-capacity--exceeded]="getColTotalQty(col.shiftNumber) > col.capacityLimit"
            >
              {{ getColTotalQty(col.shiftNumber) }} / {{ col.capacityLimit }} {{ col.uom }}
            </div>
          </div>

          <div class="ds-drag-reschedule__order-list">
            <div *ngIf="getColOrders(col.shiftNumber).length === 0" class="ds-drag-reschedule__empty-slot">
              <span>Drop order here to assign {{ col.name }}</span>
            </div>

            <div
              *ngFor="let order of getColOrders(col.shiftNumber)"
              class="ds-drag-order-card"
              [class.ds-drag-order-card--dragging]="draggedOrderId === order.id"
              [class.ds-drag-order-card--rebounding]="reboundingOrderId === order.id"
              [class.ds-drag-order-card--validating]="order.status === 'validating'"
              [class.ds-drag-order-card--confirmed]="order.status === 'confirmed'"
              [class.ds-drag-order-card--error]="order.status === 'error'"
              [attr.draggable]="order.status !== 'validating'"
              (dragstart)="onDragStart($event, order)"
              tabindex="0"
              role="article"
              [attr.aria-label]="'Order ' + order.code + ', ' + order.quantity + ' ' + order.uom"
            >
              <div class="ds-drag-order-card__header">
                <span class="ds-drag-order-card__code">{{ order.code }}</span>
                <span class="ds-drag-order-card__qty">{{ order.quantity }} {{ order.uom }}</span>
              </div>

              <div class="ds-drag-order-card__name">{{ order.name }}</div>
              <div class="ds-drag-order-card__line">{{ order.lineName }}</div>

              <!-- Optimistic Status Feedback -->
              <div
                *ngIf="order.status === 'validating'"
                class="ds-drag-order-card__status ds-drag-order-card__status--validating"
              >
                <span class="ds-drag-order-card__spinner" aria-hidden="true"></span>
                <span>Validating line capacity & transit...</span>
              </div>

              <div
                *ngIf="order.status === 'confirmed'"
                class="ds-drag-order-card__status ds-drag-order-card__status--confirmed"
              >
                <span aria-hidden="true">✓</span>
                <span>Rescheduled to Shift {{ order.shift }}</span>
              </div>

              <!-- Validation Rebound Error Banner -->
              <div
                *ngIf="order.status === 'error' && order.errorMessage"
                class="ds-drag-order-card__error-banner"
              >
                <div class="ds-drag-order-card__error-text">
                  <span aria-hidden="true">⚠️</span>
                  <span>{{ order.errorMessage }}</span>
                </div>
                <button
                  type="button"
                  class="ds-drag-order-card__dismiss-btn"
                  (click)="dismissError(order.id)"
                  title="Dismiss error"
                >
                  ✕
                </button>
              </div>

              <!-- Shift Quick Jump Buttons for Touch/Keyboard -->
              <div class="ds-drag-order-card__shift-pills" aria-label="Quick reschedule to shift">
                <span class="ds-drag-order-card__shift-label">Move:</span>
                <button
                  *ngFor="let s of [1, 2, 3]"
                  type="button"
                  [disabled]="order.shift === s || order.status === 'validating'"
                  class="ds-drag-order-card__shift-btn"
                  [class.ds-drag-order-card__shift-btn--active]="order.shift === s"
                  (click)="reschedule(order.id, s)"
                >
                  S{{ s }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./optimistic-drag-reschedule.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsOptimisticDragRescheduleComponent {
  @Input() orders: RescheduleOrderBlock[] = [
    {
      id: 'ord-101',
      code: 'ORD-2026-9041',
      name: 'Herbal Blend Master Liquid 901',
      shift: 1,
      lineId: 'line-01',
      lineName: 'Line 01 - Packaging (High Speed)',
      quantity: 1200,
      uom: 'L',
      maxLineCapacity: 2000,
    },
    {
      id: 'ord-102',
      code: 'ORD-2026-9042',
      name: 'Dibo-Doc Decoction Phase 2',
      shift: 2,
      lineId: 'line-02',
      lineName: 'Line 02 - Syrup Bottling',
      quantity: 1400,
      uom: 'L',
      transitLeadTimeHours: 4,
      maxLineCapacity: 1500,
    },
    {
      id: 'ord-103',
      code: 'ORD-2026-9043',
      name: 'Triphala Standardized Liquid Extract',
      shift: 2,
      lineId: 'line-02',
      lineName: 'Line 02 - Syrup Bottling',
      quantity: 600,
      uom: 'L',
      maxLineCapacity: 1500,
    },
  ];

  @Input() shifts: ShiftColumnDefinition[] = [
    { shiftNumber: 1, name: 'Shift 1 (Morning)', timeWindow: '06:00 – 14:00', capacityLimit: 2000, uom: 'L' },
    { shiftNumber: 2, name: 'Shift 2 (Evening)', timeWindow: '14:00 – 22:00', capacityLimit: 1500, uom: 'L' },
    { shiftNumber: 3, name: 'Shift 3 (Night)', timeWindow: '22:00 – 06:00', capacityLimit: 1200, uom: 'L' },
  ];

  @Input() customClass = '';

  @Output() rescheduleAttempt = new EventEmitter<{ order: RescheduleOrderBlock; targetShift: 1 | 2 | 3 }>();
  @Output() rescheduleSuccess = new EventEmitter<{ order: RescheduleOrderBlock; newShift: 1 | 2 | 3 }>();
  @Output() rescheduleFailure = new EventEmitter<{ order: RescheduleOrderBlock; attemptedShift: 1 | 2 | 3; reason: string }>();

  draggedOrderId: string | null = null;
  dragOverShift: number | null = null;
  reboundingOrderId: string | null = null;
  private originalShiftMap: Record<string, 1 | 2 | 3> = {};

  getColOrders(shiftNumber: 1 | 2 | 3): RescheduleOrderBlock[] {
    return this.orders.filter((o) => o.shift === shiftNumber);
  }

  getColTotalQty(shiftNumber: 1 | 2 | 3): number {
    return this.getColOrders(shiftNumber).reduce((sum, o) => sum + o.quantity, 0);
  }

  onDragStart(event: DragEvent, order: RescheduleOrderBlock): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', order.id);
      event.dataTransfer.effectAllowed = 'move';
    }
    this.draggedOrderId = order.id;
  }

  onDragOver(event: DragEvent, shiftNum: 1 | 2 | 3): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    this.dragOverShift = shiftNum;
  }

  onDragLeave(): void {
    this.dragOverShift = null;
  }

  onDrop(event: DragEvent, targetShift: 1 | 2 | 3): void {
    event.preventDefault();
    this.dragOverShift = null;
    const orderId = event.dataTransfer?.getData('text/plain') || this.draggedOrderId;
    this.draggedOrderId = null;
    if (orderId) {
      this.reschedule(orderId, targetShift);
    }
  }

  async reschedule(orderId: string, targetShift: 1 | 2 | 3): Promise<void> {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order || order.shift === targetShift) return;

    const previousShift = order.shift;
    this.originalShiftMap[orderId] = previousShift;

    // 1. Optimistic Update
    order.shift = targetShift;
    order.status = 'validating';
    order.errorMessage = undefined;
    this.rescheduleAttempt.emit({ order, targetShift });

    // 2. Validate asynchronously
    const validationResult = await this.validateRule(order, targetShift);

    if (validationResult.valid) {
      order.status = 'confirmed';
      this.rescheduleSuccess.emit({ order, newShift: targetShift });
      setTimeout(() => {
        if (order.status === 'confirmed') {
          order.status = 'idle';
        }
      }, 2000);
    } else {
      // 3. Rebound on Failure
      this.reboundingOrderId = orderId;
      this.rescheduleFailure.emit({
        order,
        attemptedShift: targetShift,
        reason: validationResult.reason || 'Capacity exceeded',
      });

      setTimeout(() => {
        order.shift = previousShift;
        order.status = 'error';
        order.errorMessage = validationResult.reason;
        this.reboundingOrderId = null;
      }, 400);
    }
  }

  private async validateRule(order: RescheduleOrderBlock, targetShift: 1 | 2 | 3): Promise<{ valid: boolean; reason?: string }> {
    await new Promise((r) => setTimeout(r, 450));
    const targetCol = this.shifts.find((s) => s.shiftNumber === targetShift);
    const capacityLimit = targetCol?.capacityLimit || 1500;

    if (order.quantity > capacityLimit) {
      return {
        valid: false,
        reason: `Exceeds ${targetCol?.name} capacity (${order.quantity}/${capacityLimit} ${order.uom})`,
      };
    }

    if (targetShift === 1 && order.transitLeadTimeHours && order.transitLeadTimeHours > 2) {
      return {
        valid: false,
        reason: `Transit lead time (+${order.transitLeadTimeHours}h) misses Shift 1 cutoff`,
      };
    }

    return { valid: true };
  }

  dismissError(orderId: string): void {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = 'idle';
      order.errorMessage = undefined;
    }
  }
}
