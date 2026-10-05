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

export type TransferStatus = 'IN_TRANSIT' | 'SCHEDULED' | 'DELAYED' | 'COMPLETED';

@Component({
  selector: 'ds-lead-time-transfer-glyph',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ds-transfer-glyph"
      [class.ds-transfer-glyph--in-transit]="status === 'IN_TRANSIT'"
      [class.ds-transfer-glyph--scheduled]="status === 'SCHEDULED'"
      [class.ds-transfer-glyph--delayed]="status === 'DELAYED'"
      [class.ds-transfer-glyph--completed]="status === 'COMPLETED'"
      [class]="customClass"
      (mouseenter)="showTooltip($event)"
      (mouseleave)="hideTooltip()"
      (focus)="showTooltip($event)"
      (blur)="hideTooltip()"
      tabindex="0"
      role="region"
      [attr.aria-label]="accessibleLabel"
    >
      <span class="ds-transfer-glyph__icon" aria-hidden="true">
        {{ statusIcon }}
      </span>

      <span class="ds-transfer-glyph__route">
        <span class="ds-transfer-glyph__node">{{ origin }}</span>
        <span class="ds-transfer-glyph__arrow" aria-hidden="true">➔</span>
        <span class="ds-transfer-glyph__node">{{ destination }}</span>
      </span>

      <span class="ds-transfer-glyph__lead-time">
        [{{ transitHours }}h]
      </span>

    </div>
  `,
  styleUrls: ['./stock-runway.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsLeadTimeTransferGlyphComponent implements OnDestroy {
  @Input() origin = 'H-9';
  @Input() destination = 'F-119';
  @Input() transitHours = 4;
  @Input() status: TransferStatus = 'IN_TRANSIT';
  @Input() transferId = 'STO-2026-8812';
  @Input() materialName = 'Ashwagandha Extract';
  @Input() quantity = '500 KG';
  @Input() carrier = 'Deccan Road Freight #MH-14-GH-9012';
  @Input() eta = '+4h (14:30 IST)';
  @Input() customClass = '';

  private readonly tooltip = new FloatingDataTooltip();

  get statusIcon(): string {
    switch (this.status) {
      case 'IN_TRANSIT': return '🚚';
      case 'DELAYED': return '⚠️';
      case 'COMPLETED': return '✓';
      case 'SCHEDULED':
      default: return '⏱️';
    }
  }

  get accessibleLabel(): string {
    return `Transfer ${this.transferId} from ${this.origin} to ${this.destination}, lead time ${this.transitHours} hours, status ${this.status}`;
  }

  showTooltip(event: MouseEvent | FocusEvent): void {
    this.tooltip.show({
      anchor: event.currentTarget as HTMLElement,
      prefix: 'ds-transfer-glyph',
      heading: 'Stock Transfer Order',
      tag: this.transferId,
      rows: [
        { label: 'Cargo:', value: `${this.materialName} (${this.quantity})` },
        { label: 'Route:', value: `${this.origin} ➔ ${this.destination}` },
        { label: 'Carrier:', value: this.carrier },
        { label: 'ETA:', value: this.eta, tone: 'eta' },
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
