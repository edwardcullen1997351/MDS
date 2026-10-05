import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export type InputSize = 'sm' | 'md' | 'lg';

let nextUniqueId = 0;

@Component({
  selector: 'ds-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ds-field" [ngClass]="wrapperClassName">
      <label *ngIf="label" [attr.for]="inputId" class="ds-field__label">
        <span>{{ label }}</span>
        <span *ngIf="isRequired" class="ds-field__required" aria-hidden="true">*</span>
        <span *ngIf="isOptional && !isRequired" class="ds-field__optional">(optional)</span>
      </label>

      <div [ngClass]="containerClasses">
        <span class="ds-input__left-addon" aria-hidden="true">
          <ng-content select="[slot=left-icon]"></ng-content>
        </span>

        <input
          [id]="inputId"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [readOnly]="readOnly"
          [required]="isRequired"
          [attr.aria-invalid]="isInvalid || !!errorMessage"
          [attr.aria-required]="isRequired"
          [attr.aria-describedby]="describedByIds"
          [attr.aria-label]="ariaLabel || null"
          [attr.aria-labelledby]="ariaLabelledBy || null"
          [value]="value"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          class="ds-input"
        />

        <span class="ds-input__right-addon">
          <ng-content select="[slot=right-icon]"></ng-content>
        </span>
      </div>

      <div *ngIf="helperText" [id]="helperId" class="ds-field__helper">{{ helperText }}</div>
      <div *ngIf="(isInvalid || errorMessage) && errorMessage" [id]="errorId" class="ds-field__error" role="alert">
        <span aria-hidden="true">⚠️</span>
        <span>{{ errorMessage }}</span>
      </div>

    </div>
  `,
  styleUrls: ['./input.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DsInputComponent),
      multi: true,
    },
  ],
})
export class DsInputComponent implements ControlValueAccessor, OnInit {
  @Input() id?: string;
  @Input() label?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() ariaDescribedBy?: string;
  @Input() helperText?: string;
  @Input() errorMessage?: string;
  @Input() isInvalid: boolean = false;
  @Input() isRequired: boolean = false;
  @Input() isOptional: boolean = false;
  @Input() size: InputSize = 'md';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() disabled: boolean = false;
  @Input() readOnly: boolean = false;
  @Input() wrapperClassName: string = '';

  @Output() valueChange = new EventEmitter<string>();

  value: string = '';
  private autoId = `ds-input-${++nextUniqueId}`;

  ngOnInit(): void {
    if (!this.label?.trim() && !this.ariaLabel?.trim() && !this.ariaLabelledBy?.trim()) {
      throw new Error('ds-input requires label, ariaLabel, or ariaLabelledBy.');
    }
  }

  get inputId(): string {
    return this.id || this.autoId;
  }

  get helperId(): string {
    return `${this.inputId}-helper`;
  }

  get errorId(): string {
    return `${this.inputId}-error`;
  }

  get describedByIds(): string | null {
    return [this.helperText ? this.helperId : null, this.errorMessage ? this.errorId : null, this.ariaDescribedBy].filter(Boolean).join(' ') || null;
  }

  get containerClasses(): string {
    return [
      'ds-input-container',
      `ds-input-container--${this.size}`,
      this.isInvalid || this.errorMessage ? 'ds-input-container--invalid' : '',
      this.disabled ? 'ds-input-container--disabled' : '',
      this.readOnly ? 'ds-input-container--readonly' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value = val || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
    this.valueChange.emit(val);
  }

  onBlur(): void {
    this.onTouched();
  }
}
