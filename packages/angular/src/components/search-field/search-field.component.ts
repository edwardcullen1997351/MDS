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
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

export type SearchFieldSize = 'sm' | 'md' | 'lg';

let nextSearchId = 0;

@Component({
  selector: 'ds-search-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ds-searchfield-wrapper" [class]="customClass">
      <label *ngIf="label" [attr.for]="inputId" class="ds-field__label">{{ label }}</label>
      <div
        class="ds-searchfield-container"
        [class.ds-searchfield-container--sm]="size === 'sm'"
        [class.ds-searchfield-container--md]="size === 'md'"
        [class.ds-searchfield-container--lg]="size === 'lg'"
        [class.ds-searchfield-container--disabled]="disabled"
      >
        <span class="ds-searchfield-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>

        <input
          [id]="inputId"
          type="search"
          [value]="value"
          [placeholder]="placeholder"
          [disabled]="disabled"
          (input)="onInputChange($event)"
          (keydown)="onKeyDown($event)"
          (blur)="onBlur()"
          class="ds-searchfield-input"
          [attr.aria-label]="label ? null : ariaLabel || null"
          [attr.aria-labelledby]="ariaLabelledBy || null"
        />

        <div class="ds-searchfield-actions">
          <span *ngIf="isLoading" class="ds-searchfield-spinner" aria-hidden="true">
            ⟳
          </span>

          <button
            *ngIf="!isLoading && value && !disabled"
            type="button"
            class="ds-searchfield-clear-btn"
            (click)="handleClear()"
            aria-label="Clear search query"
            title="Clear"
          >
            ✕
          </button>

          <kbd *ngIf="!isLoading && !value && shortcutKey" class="ds-searchfield-kbd">
            {{ shortcutKey }}
          </kbd>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./search-field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DsSearchFieldComponent),
      multi: true,
    },
  ],
})
export class DsSearchFieldComponent implements ControlValueAccessor, OnInit {
  @Input() id?: string;
  @Input() placeholder = 'Search...';
  @Input() size: SearchFieldSize = 'md';
  @Input() disabled = false;
  @Input() isLoading = false;
  @Input() shortcutKey?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() label?: string;
  @Input() customClass = '';

  @Output() valueChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  value = '';
  private autoId = `ds-search-field-${++nextSearchId}`;

  ngOnInit(): void {
    if (!this.label?.trim() && !this.ariaLabel?.trim() && !this.ariaLabelledBy?.trim()) {
      throw new Error('ds-search-field requires label, ariaLabel, or ariaLabelledBy.');
    }
  }

  get inputId(): string {
    return this.id || this.autoId;
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

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.search.emit(this.value);
    } else if (event.key === 'Escape' && this.value) {
      event.preventDefault();
      this.handleClear();
    }
  }

  handleClear(): void {
    this.value = '';
    this.onChange('');
    this.valueChange.emit('');
    this.clear.emit();
  }

  onBlur(): void {
    this.onTouched();
  }
}
