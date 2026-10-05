import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-dual-uom-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="ds-dual-uom-badge"
      [class]="customClass"
      [attr.title]="accessibleTitle"
      [attr.aria-label]="accessibleTitle"
    >
      <span class="ds-dual-uom-badge__primary">
        {{ formattedPrimary }} {{ primaryUom }}
      </span>
      <ng-container *ngIf="secondaryQty !== undefined && secondaryUom">
        <span class="ds-dual-uom-badge__separator" aria-hidden="true">|</span>
        <span class="ds-dual-uom-badge__secondary">
          ~{{ formattedSecondary }} {{ secondaryUom }}
        </span>
      </ng-container>
    </span>
  `,
  styleUrls: ['./badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsDualUomBadgeComponent {
  @Input({ required: true }) primaryQty!: number | string;
  @Input({ required: true }) primaryUom!: string;
  @Input() secondaryQty?: number | string;
  @Input() secondaryUom?: string;
  @Input() conversionRatio?: string;
  @Input() customClass = '';

  get formattedPrimary(): string {
    return typeof this.primaryQty === 'number'
      ? this.primaryQty.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })
      : String(this.primaryQty);
  }

  get formattedSecondary(): string {
    return typeof this.secondaryQty === 'number'
      ? this.secondaryQty.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })
      : String(this.secondaryQty ?? '');
  }

  get accessibleTitle(): string {
    if (this.secondaryQty !== undefined && this.secondaryUom) {
      return `${this.formattedPrimary} ${this.primaryUom} (equivalent to ${this.formattedSecondary} ${this.secondaryUom}${
        this.conversionRatio ? ` · Rate: ${this.conversionRatio}` : ''
      })`;
    }
    return `${this.formattedPrimary} ${this.primaryUom}`;
  }
}
