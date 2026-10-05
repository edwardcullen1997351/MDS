import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type SwitchSize = 'sm' | 'md' | 'lg';

let nextUniqueId = 0;

@Component({
  selector: 'ds-switch',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-switch-wrapper" [class]="wrapperClass">
      <label
        [attr.for]="switchId"
        class="ds-switch-container"
        [class.ds-switch-container--disabled]="disabled"
      >
        <div *ngIf="labelPlacement === 'start' && (label || description)" class="ds-switch-label-group">
          <span *ngIf="label" class="ds-switch-label" [id]="switchId + '-label'">{{ label }}</span>
          <span *ngIf="description" class="ds-switch-description" [id]="switchId + '-desc'">{{ description }}</span>
        </div>

        <input
          type="checkbox"
          role="switch"
          [id]="switchId"
          [name]="name"
          [value]="value"
          [checked]="checked"
          [disabled]="disabled"
          [attr.aria-checked]="checked"
          [attr.aria-invalid]="!!error"
          [attr.aria-describedby]="ariaDescribedBy"
          [attr.aria-labelledby]="label ? switchId + '-label' : ariaLabelledBy || null"
          [attr.aria-label]="label ? null : ariaLabel || null"
          (change)="onCheckboxChange($event)"
          (blur)="onBlur()"
          class="ds-switch-input"
        />

        <span
          class="ds-switch-track"
          [class.ds-switch-track--sm]="size === 'sm'"
          [class.ds-switch-track--md]="size === 'md'"
          [class.ds-switch-track--lg]="size === 'lg'"
          [class.ds-switch-track--checked]="checked"
          aria-hidden="true"
        >
          <span
            class="ds-switch-thumb"
            [class.ds-switch-thumb--sm]="size === 'sm'"
            [class.ds-switch-thumb--md]="size === 'md'"
            [class.ds-switch-thumb--lg]="size === 'lg'"
          ></span>
        </span>

        <div *ngIf="labelPlacement === 'end' && (label || description)" class="ds-switch-label-group">
          <span *ngIf="label" class="ds-switch-label" [id]="switchId + '-label'">{{ label }}</span>
          <span *ngIf="description" class="ds-switch-description" [id]="switchId + '-desc'">{{ description }}</span>
        </div>
      </label>

      <span *ngIf="error" class="ds-switch-error" [id]="switchId + '-err'" role="alert">
        {{ error }}
      </span>
    </div>
  `,
  styleUrls: ['./switch.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DsSwitchComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsSwitchComponent implements ControlValueAccessor, OnInit {
  @Input() id = `ds-switch-${++nextUniqueId}`;
  @Input() name?: string;
  @Input() value?: string;
  @Input() checked = false;
  @Input() disabled = false;
  @Input() label?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() describedBy?: string;
  @Input() description?: string;
  @Input() error?: string;
  @Input() size: SwitchSize = 'md';
  @Input() labelPlacement: 'start' | 'end' = 'end';
  @Input() wrapperClass = '';

  @Output() checkedChange = new EventEmitter<boolean>();

  ngOnInit(): void {
    if (!this.label?.trim() && !this.ariaLabel?.trim() && !this.ariaLabelledBy?.trim()) {
      throw new Error('ds-switch requires label, ariaLabel, or ariaLabelledBy.');
    }
  }

  get switchId(): string {
    return this.id;
  }

  get ariaDescribedBy(): string | null {
    const ids: string[] = [];
    if (this.description) ids.push(`${this.switchId}-desc`);
    if (this.error) ids.push(`${this.switchId}-err`);
    if (this.describedBy) ids.push(this.describedBy);
    return ids.length > 0 ? ids.join(' ') : null;
  }

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  onCheckboxChange(event: Event): void {
    if (this.disabled) return;
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this.onChange(this.checked);
    this.checkedChange.emit(this.checked);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: boolean): void {
    this.checked = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
