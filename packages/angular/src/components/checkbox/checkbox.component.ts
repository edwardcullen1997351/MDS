import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type CheckboxSize = 'sm' | 'md' | 'lg';

let nextCheckboxId = 0;

@Component({
  selector: 'ds-checkbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [attr.for]="checkboxId" [ngClass]="rootClasses">
      <input
        #inputRef
        [id]="checkboxId"
        type="checkbox"
        [checked]="checked"
        [disabled]="disabled"
        [attr.aria-invalid]="isInvalid || !!errorMessage"
        [attr.aria-describedby]="describedByIds"
        [attr.aria-label]="ariaLabel || null"
        [attr.aria-labelledby]="ariaLabelledBy || (ariaLabel ? null : label ? labelId : null)"
        class="ds-checkbox__input"
        (change)="onCheckboxChange($event)"
      />

      <div class="ds-checkbox__control" aria-hidden="true">
        <svg *ngIf="checked && !indeterminate" class="ds-checkbox__icon" viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg *ngIf="indeterminate" class="ds-checkbox__icon" viewBox="0 0 24 24">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </div>

      <div *ngIf="label || helperText || errorMessage" class="ds-checkbox__label-container">
        <span *ngIf="label" [id]="labelId" class="ds-checkbox__label">{{ label }}</span>
        <span *ngIf="helperText" [id]="helperId" class="ds-checkbox__helper">{{ helperText }}</span>
        <span *ngIf="errorMessage" [id]="errorId" role="alert" class="ds-checkbox__helper">{{ errorMessage }}</span>
      </div>
    </label>
  `,
  styleUrls: ['./checkbox.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DsCheckboxComponent),
      multi: true,
    },
  ],
})
export class DsCheckboxComponent implements ControlValueAccessor, AfterViewInit, OnInit {
  @Input() id?: string;
  @Input() label?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() ariaDescribedBy?: string;
  @Input() helperText?: string;
  @Input() errorMessage?: string;
  @Input() checked: boolean = false;
  @Input() indeterminate: boolean = false;
  @Input() isInvalid: boolean = false;
  @Input() disabled: boolean = false;
  @Input() size: CheckboxSize = 'md';

  @Output() checkedChange = new EventEmitter<boolean>();

  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  private autoId = `ds-checkbox-${++nextCheckboxId}`;

  ngOnInit(): void {
    if (!this.label?.trim() && !this.ariaLabel?.trim() && !this.ariaLabelledBy?.trim()) {
      throw new Error('ds-checkbox requires label, ariaLabel, or ariaLabelledBy.');
    }
  }

  get checkboxId(): string {
    return this.id || this.autoId;
  }

  get helperId(): string {
    return `${this.checkboxId}-helper`;
  }
  get labelId(): string { return `${this.checkboxId}-label`; }

  get errorId(): string { return `${this.checkboxId}-error`; }
  get describedByIds(): string | null {
    return [this.helperText ? this.helperId : null, this.errorMessage ? this.errorId : null, this.ariaDescribedBy].filter(Boolean).join(' ') || null;
  }

  get rootClasses(): string {
    return [
      'ds-checkbox',
      `ds-checkbox--${this.size}`,
      this.checked ? 'ds-checkbox--checked' : '',
      this.indeterminate ? 'ds-checkbox--indeterminate' : '',
      this.disabled ? 'ds-checkbox--disabled' : '',
      this.isInvalid ? 'ds-checkbox--invalid' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  ngAfterViewInit(): void {
    if (this.inputRef) {
      this.inputRef.nativeElement.indeterminate = this.indeterminate;
    }
  }

  onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: boolean): void {
    this.checked = Boolean(val);
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

  onCheckboxChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checked = isChecked;
    this.indeterminate = false;
    this.onChange(isChecked);
    this.checkedChange.emit(isChecked);
    this.onTouched();
  }
}
