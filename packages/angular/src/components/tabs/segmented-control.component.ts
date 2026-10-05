import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AngularSegmentOption<T extends string = string> {
  value: T;
  label: string;
  icon?: string;
  badge?: string | number;
  disabled?: boolean;
}

@Component({
  selector: 'ds-segmented-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ds-segmented-control ds-segmented-control--{{ size }}"
      [class.ds-segmented-control--full-width]="fullWidth"
      [class.ds-segmented-control--disabled]="disabled"
      [class]="customClass"
      role="radiogroup"
      [attr.aria-label]="ariaLabel"
      [attr.aria-disabled]="disabled"
    >
      <button
        *ngFor="let opt of options; let i = index"
        type="button"
        role="radio"
        [attr.aria-checked]="value === opt.value"
        [disabled]="disabled || opt.disabled"
        [tabIndex]="value === opt.value ? 0 : -1"
        class="ds-segmented-control__segment"
        [class.ds-segmented-control__segment--selected]="value === opt.value"
        [class.ds-segmented-control__segment--disabled]="disabled || opt.disabled"
        (click)="selectOption(opt)"
        (keydown)="onKeydown($event, i)"
      >
        <span *ngIf="opt.icon" class="ds-segmented-control__icon" aria-hidden="true">{{ opt.icon }}</span>
        <span class="ds-segmented-control__label">{{ opt.label }}</span>
        <span *ngIf="opt.badge !== undefined" class="ds-segmented-control__badge" aria-hidden="true">{{ opt.badge }}</span>
      </button>
    </div>
  `,
  styleUrls: ['./segmented-control.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsSegmentedControlComponent<T extends string = string> {
  @Input() options: AngularSegmentOption<T>[] = [];
  @Input() value!: T;
  @Input() size: 'sm' | 'md' = 'sm';
  @Input() ariaLabel: string = 'View Switcher';
  @Input() disabled: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() customClass: string = '';

  @Output() valueChange = new EventEmitter<T>();

  selectOption(opt: AngularSegmentOption<T>): void {
    if (this.disabled || opt.disabled || this.value === opt.value) return;
    this.valueChange.emit(opt.value);
  }

  onKeydown(e: KeyboardEvent, currentIndex: number): void {
    const enabled = this.options.map((o, idx) => ({ ...o, idx })).filter((o) => !o.disabled && !this.disabled);
    if (enabled.length === 0) return;

    const currentEnabledIdx = enabled.findIndex((o) => o.idx === currentIndex);
    let targetIdx = -1;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      targetIdx = (currentEnabledIdx + 1) % enabled.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      targetIdx = (currentEnabledIdx - 1 + enabled.length) % enabled.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      targetIdx = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      targetIdx = enabled.length - 1;
    }

    if (targetIdx !== -1) {
      const next = enabled[targetIdx];
      this.valueChange.emit(next.value);
    }
  }
}
