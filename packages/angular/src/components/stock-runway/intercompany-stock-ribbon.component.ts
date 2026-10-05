import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface IntercompanyMetric {
  label: string;
  facility: string;
  quantity: number;
  uom: string;
  status?: 'safe' | 'warning' | 'danger' | 'info';
  statusLabel?: string;
  subtext?: string;
}

@Component({
  selector: 'ds-intercompany-stock-ribbon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-stock-ribbon" [class]="customClass" role="region" aria-label="Intercompany Stock Balance Strip">
      <div class="ds-stock-ribbon__metrics">
        <div *ngFor="let m of metrics" class="ds-stock-ribbon__card">
          <div class="ds-stock-ribbon__header">
            <span class="ds-stock-ribbon__label">{{ m.label }}</span>
            <span
              *ngIf="m.statusLabel"
              class="ds-stock-ribbon__pill"
              [class.ds-stock-ribbon__pill--safe]="m.status === 'safe' || !m.status"
              [class.ds-stock-ribbon__pill--warning]="m.status === 'warning'"
              [class.ds-stock-ribbon__pill--danger]="m.status === 'danger'"
              [class.ds-stock-ribbon__pill--info]="m.status === 'info'"
            >
              {{ m.statusLabel }}
            </span>
          </div>

          <div class="ds-stock-ribbon__qty-group">
            <span class="ds-stock-ribbon__qty">{{ m.quantity | number }}</span>
            <span class="ds-stock-ribbon__uom">{{ m.uom }}</span>
          </div>

          <div class="ds-stock-ribbon__facility">
            <span class="ds-stock-ribbon__icon" aria-hidden="true">📍</span>
            <span>{{ m.facility }}</span>
          </div>

          <div *ngIf="m.subtext" class="ds-stock-ribbon__subtext">{{ m.subtext }}</div>
        </div>
      </div>

      <div *ngIf="hasActions" class="ds-stock-ribbon__actions">
        <button
          *ngIf="showRequestButton"
          type="button"
          class="ds-stock-ribbon__action-btn ds-stock-ribbon__action-btn--primary"
          (click)="triggerRequestTransfer()"
        >
          <span aria-hidden="true">+</span>
          <span>Request STO Transfer</span>
        </button>
        <button
          *ngIf="showDetailsButton"
          type="button"
          class="ds-stock-ribbon__action-btn ds-stock-ribbon__action-btn--secondary"
          (click)="triggerViewDetails()"
        >
          <span>View STO Ledger</span>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./stock-runway.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsIntercompanyStockRibbonComponent {
  @Input() plantStock: IntercompanyMetric = {
    label: 'Plant Stock On-Hand',
    facility: 'Food Plant F-119',
    quantity: 350,
    uom: 'KG',
    status: 'warning',
    statusLabel: 'Deficit Risk',
    subtext: '4.2 Days Runway',
  };

  @Input() warehouseStock: IntercompanyMetric = {
    label: 'Warehouse Staged',
    facility: 'RM Warehouse H-9',
    quantity: 1200,
    uom: 'KG',
    status: 'safe',
    statusLabel: 'Available',
    subtext: 'Batch B-901 Passed QC',
  };

  @Input() inTransitStock: IntercompanyMetric = {
    label: 'In-Transit STO',
    facility: 'En Route (H-9 ➔ F-119)',
    quantity: 500,
    uom: 'KG',
    status: 'info',
    statusLabel: 'ETA 14:30',
    subtext: 'Carrier MH-14-GH-9012',
  };

  @Input() netBalance: IntercompanyMetric = {
    label: 'Net Intercompany Balance',
    facility: 'Total System Runway',
    quantity: 2050,
    uom: 'KG',
    status: 'safe',
    statusLabel: '24.6d Coverage',
    subtext: 'Exceeds Reorder Point',
  };

  @Input() showRequestButton = true;
  @Input() showDetailsButton = true;
  @Input() customClass = '';

  @Output() requestTransfer = new EventEmitter<void>();
  @Output() viewDetails = new EventEmitter<void>();

  get metrics(): IntercompanyMetric[] {
    return [this.plantStock, this.warehouseStock, this.inTransitStock, this.netBalance];
  }

  get hasActions(): boolean {
    return this.showRequestButton || this.showDetailsButton;
  }

  triggerRequestTransfer(): void {
    this.requestTransfer.emit();
  }

  triggerViewDetails(): void {
    this.viewDetails.emit();
  }
}
