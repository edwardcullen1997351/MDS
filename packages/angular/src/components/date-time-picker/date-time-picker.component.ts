import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { isZone, zoneParts, instantFrom, zoneAbbr } from './zone.js';

export interface DateTimeParts {
  date?: string;
  time?: string;
  complete: boolean;
  zone?: string;
  shifted?: boolean;
  ambiguous?: boolean;
}

export type DateTimeProblem = 'malformed' | 'nonexistent' | 'bounds' | 'partial' | null;

let nextDtId = 0;

@Component({
  selector: 'ds-date-time-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      role="group"
      [attr.aria-label]="label || 'Date and Time Picker'"
      class="ds-datetime-picker"
      [class.ds-datetime-picker--sm]="size === 'sm'"
      [class.ds-datetime-picker--md]="size === 'md'"
      [class.ds-datetime-picker--lg]="size === 'lg'"
      [class.ds-datetime-picker--stacked]="layout === 'stacked'"
      [class.ds-datetime-picker--inline]="layout === 'inline'"
      [class.ds-datetime-picker--disabled]="disabled"
      [class.ds-datetime-picker--invalid]="problem !== null || error"
      [class]="customClass"
    >
      <div *ngIf="label" class="ds-datetime-picker-header">
        <span class="ds-datetime-picker-label">{{ label }}</span>
        <span *ngIf="zoneBadge" class="ds-datetime-picker-zone" [title]="'Timezone: ' + zone">
          {{ zoneBadge }}
        </span>
      </div>

      <div class="ds-datetime-picker-controls">
        <div class="ds-datetime-picker-field ds-datetime-picker-field--date">
          <label [attr.for]="dateInputId" class="ds-datetime-picker-sublabel">
            {{ dateLabel }}
          </label>
          <input
            [id]="dateInputId"
            [attr.aria-invalid]="error || problem ? 'true' : null"
            [attr.aria-describedby]="dateDescribedBy"
            type="date"
            [value]="dateValue || ''"
            [min]="minDate"
            [max]="maxDate"
            [disabled]="disabled"
            [readOnly]="readOnly"
            (input)="onDateInput($event)"
            class="ds-datetime-picker-input"
          />
          <span *ngIf="dateHint" [id]="dateHintId" class="ds-datetime-picker-subhint">{{ dateHint }}</span>
        </div>

        <div class="ds-datetime-picker-field ds-datetime-picker-field--time">
          <label [attr.for]="timeInputId" class="ds-datetime-picker-sublabel">
            {{ timeLabel }}
          </label>
          <input
            [id]="timeInputId"
            [attr.aria-invalid]="error || problem ? 'true' : null"
            [attr.aria-describedby]="timeDescribedBy"
            type="time"
            [step]="step * 60"
            [value]="timeValue || ''"
            [disabled]="disabled"
            [readOnly]="readOnly"
            (input)="onTimeInput($event)"
            class="ds-datetime-picker-input"
          />
          <span *ngIf="timeHint" [id]="timeHintId" class="ds-datetime-picker-subhint">{{ timeHint }}</span>
        </div>

        <button
          *ngIf="clearable && hasValue && !disabled && !readOnly"
          type="button"
          (click)="handleClear()"
          class="ds-datetime-picker-clear-btn"
          aria-label="Clear date and time"
          title="Clear"
        >
          ✕
        </button>
      </div>

      <div *ngIf="parts.shifted" class="ds-datetime-picker-warning" role="status">
        Notice: Clock skipped forward for Daylight Saving Time; adjusted to valid instant.
      </div>

      <div *ngIf="parts.ambiguous" class="ds-datetime-picker-notice" role="status">
        Notice: Clock repeats for Daylight Saving Time; earlier occurrence selected.
      </div>

      <div *ngIf="error || problem" [id]="errorId" class="ds-datetime-picker-error" role="alert">
        {{ error ? error : getProblemMessage() }}
      </div>

      <div *ngIf="hint" [id]="hintId" class="ds-datetime-picker-hint">
        {{ hint }}
      </div>
    </div>
  `,
  styleUrls: ['./date-time-picker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DsDateTimePickerComponent),
      multi: true,
    },
  ],
})
export class DsDateTimePickerComponent implements ControlValueAccessor, OnChanges {
  @Input() label?: string;
  @Input() zone?: string;
  @Input() dateLabel = 'Date';
  @Input() timeLabel = 'Time';
  @Input() min?: string;
  @Input() max?: string;
  @Input() allowPartial = false;
  @Input() step = 1;
  @Input() error?: string;
  @Input() hint?: string;
  @Input() dateHint?: string;
  @Input() timeHint?: string;
  @Input() layout: 'auto' | 'inline' | 'stacked' = 'auto';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() clearable = true;
  @Input() customClass = '';

  @Output() valueChange = new EventEmitter<string | undefined>();
  @Output() partsChange = new EventEmitter<DateTimeParts>();
  @Output() validityChange = new EventEmitter<{ valid: boolean; reason: DateTimeProblem; complete: boolean }>();

  dateValue?: string;
  timeValue?: string;
  problem: DateTimeProblem = null;
  zoneBadge?: string;

  parts: DateTimeParts = {
    complete: false,
  };

  private uid = `ds-dt-${++nextDtId}`;
  get dateInputId(): string {
    return `${this.uid}-d`;
  }
  get timeInputId(): string {
    return `${this.uid}-t`;
  }
  get dateHintId(): string { return `${this.uid}-date-hint`; }
  get timeHintId(): string { return `${this.uid}-time-hint`; }
  get hintId(): string { return `${this.uid}-hint`; }
  get errorId(): string { return `${this.uid}-error`; }
  get dateDescribedBy(): string | null { return [this.dateHint ? this.dateHintId : null, this.hint ? this.hintId : null, this.error || this.problem ? this.errorId : null].filter(Boolean).join(' ') || null; }
  get timeDescribedBy(): string | null { return [this.timeHint ? this.timeHintId : null, this.hint ? this.hintId : null, this.error || this.problem ? this.errorId : null].filter(Boolean).join(' ') || null; }

  get hasValue(): boolean {
    return Boolean(this.dateValue || this.timeValue);
  }

  get minDate(): string | undefined {
    if (!this.min) return undefined;
    return this.min.includes('T') ? this.min.split('T')[0] : this.min;
  }

  get maxDate(): string | undefined {
    if (!this.max) return undefined;
    return this.max.includes('T') ? this.max.split('T')[0] : this.max;
  }

  onChange: (value: string | undefined) => void = () => {};
  onTouched: () => void = () => {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['zone']) {
      this.zoneBadge = this.zone && isZone(this.zone) ? zoneAbbr(this.zone) : undefined;
    }
    this.recompute();
  }

  writeValue(val: string | undefined): void {
    if (!val) {
      this.dateValue = undefined;
      this.timeValue = undefined;
    } else if (val.endsWith('Z') && this.zone && isZone(this.zone)) {
      const p = zoneParts(val, this.zone);
      this.dateValue = p.date;
      this.timeValue = p.time;
    } else if (val.includes('T')) {
      const [d, t] = val.split('T');
      this.dateValue = d;
      this.timeValue = t?.substring(0, 5);
    }
    this.recompute();
  }

  registerOnChange(fn: (value: string | undefined) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDateInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.dateValue = val || undefined;
    this.handleValueUpdate();
  }

  onTimeInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.timeValue = val || undefined;
    this.handleValueUpdate();
  }

  handleClear(): void {
    this.dateValue = undefined;
    this.timeValue = undefined;
    this.handleValueUpdate();
  }

  private handleValueUpdate(): void {
    const result = this.recompute();
    this.onChange(result);
    this.valueChange.emit(result);
    this.partsChange.emit(this.parts);
  }

  private recompute(): string | undefined {
    const isZoned = Boolean(this.zone && isZone(this.zone));
    const complete = Boolean(this.dateValue && this.timeValue);
    let resVal: string | undefined = undefined;
    let shifted = false;
    let ambiguous = false;
    let prob: DateTimeProblem = null;

    if (this.dateValue && this.timeValue) {
      if (isZoned && this.zone) {
        const inst = instantFrom(this.dateValue, this.timeValue, this.zone);
        resVal = inst.instant;
        shifted = inst.shifted;
        ambiguous = inst.ambiguous;
        if (shifted) prob = 'nonexistent';
      } else {
        resVal = `${this.dateValue}T${this.timeValue}`;
      }
    } else if (this.dateValue || this.timeValue) {
      if (!this.allowPartial) {
        prob = 'partial';
      }
    }

    if (resVal && this.dateValue) {
      if (this.minDate && this.dateValue < this.minDate) prob = 'bounds';
      if (this.maxDate && this.dateValue > this.maxDate) prob = 'bounds';
    }

    this.problem = prob;
    this.parts = {
      date: this.dateValue,
      time: this.timeValue,
      complete,
      zone: isZoned ? this.zone : undefined,
      shifted,
      ambiguous,
    };

    this.validityChange.emit({
      valid: prob === null,
      reason: prob,
      complete,
    });

    return resVal;
  }

  getProblemMessage(): string {
    switch (this.problem) {
      case 'bounds':
        return 'Selected date and time is outside permitted bounds.';
      case 'partial':
        return 'Please provide both date and time to complete the moment.';
      case 'nonexistent':
        return 'The selected time does not exist in this timezone.';
      default:
        return 'Invalid date or time value.';
    }
  }
}
