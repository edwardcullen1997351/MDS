import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy, HostListener, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface DsSelectItem {
  label: string;
  value: string;
  disabled?: boolean;
}

export type SelectSize = 'sm' | 'md' | 'lg';

let nextSelectId = 0;

@Component({
  selector: 'ds-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-select-root">
      <label *ngIf="label" [id]="labelId" [attr.for]="triggerId" class="ds-select-label">{{ label }}</label>

      <button
        type="button"
        [id]="triggerId"
        [disabled]="disabled"
        [ngClass]="[
          'ds-select-trigger',
          'ds-select-trigger--' + size,
          isOpen ? 'ds-select-trigger--open' : '',
          isInvalid || errorMessage ? 'ds-select-trigger--invalid' : ''
        ]"
        (click)="toggleOpen()"
        aria-haspopup="listbox"
        [attr.aria-expanded]="isOpen"
        [attr.aria-invalid]="isInvalid || errorMessage ? 'true' : null"
        [attr.aria-describedby]="describedByIds"
        [attr.aria-labelledby]="label ? labelId : ariaLabelledBy || null"
        [attr.aria-label]="label ? null : ariaLabel || null"
      >
        <span class="ds-select-value">{{ selectedLabel || placeholder }}</span>
        <span class="ds-select-indicator" aria-hidden="true">▼</span>
      </button>

      <p *ngIf="helperText" [id]="helperId" class="ds-select-helper-text">{{ helperText }}</p>
      <p *ngIf="errorMessage" [id]="errorId" role="alert" class="ds-select-error-message">{{ errorMessage }}</p>

      <ul *ngIf="isOpen" class="ds-select-content" role="listbox">
        <li
          *ngFor="let item of items"
          role="option"
          [attr.aria-selected]="item.value === value"
          [attr.aria-disabled]="item.disabled"
          [ngClass]="[
            'ds-select-item',
            item.value === value ? 'ds-select-item--selected' : '',
            item.disabled ? 'ds-select-item--disabled' : ''
          ]"
          (click)="selectItem(item)"
        >
          <span>{{ item.label }}</span>
          <span *ngIf="item.value === value" class="ds-select-item-indicator">✓</span>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./select.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DsSelectComponent),
      multi: true,
    },
  ],
})
export class DsSelectComponent implements ControlValueAccessor, OnInit {
  @Input() id?: string;
  @Input() items: DsSelectItem[] = [];
  @Input() label?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() ariaDescribedBy?: string;
  @Input() placeholder: string = 'Select an option...';
  @Input() size: SelectSize = 'md';
  @Input() disabled: boolean = false;
  @Input() isInvalid: boolean = false;
  @Input() errorMessage?: string;
  @Input() helperText?: string;

  @Output() valueChange = new EventEmitter<string>();

  value: string = '';
  isOpen: boolean = false;
  private autoId = `ds-select-${++nextSelectId}`;

  get triggerId(): string {
    return this.id || this.autoId;
  }

  get labelId(): string {
    return `${this.triggerId}-label`;
  }

  get helperId(): string {
    return `${this.triggerId}-helper`;
  }

  get errorId(): string {
    return `${this.triggerId}-error`;
  }

  get describedByIds(): string | null {
    const ids: string[] = [];
    if (this.errorMessage) ids.push(this.errorId);
    if (this.helperText) ids.push(this.helperId);
    if (this.ariaDescribedBy) ids.push(this.ariaDescribedBy);
    return ids.length > 0 ? ids.join(' ') : null;
  }

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    if (!this.label?.trim() && !this.ariaLabel?.trim() && !this.ariaLabelledBy?.trim()) {
      throw new Error('ds-select requires label, ariaLabel, or ariaLabelledBy.');
    }
  }

  get selectedLabel(): string | undefined {
    const item = this.items.find((i) => i.value === this.value);
    return item ? item.label : undefined;
  }

  toggleOpen(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  selectItem(item: DsSelectItem): void {
    if (item.disabled) return;
    this.value = item.value;
    this.isOpen = false;
    this.onChange(item.value);
    this.valueChange.emit(item.value);
    this.onTouched();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    this.isOpen = false;
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
}
