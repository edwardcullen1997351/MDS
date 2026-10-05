import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DateRangeData {
  startDate: string;
  endDate: string;
}
let nextDateRangeId = 0;

@Component({
  selector: 'ds-date-range-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-date-range-picker" [class]="customClass" [class.ds-date-range-picker--invalid]="isInvalid">
      <div *ngIf="showPresets" class="ds-date-range-presets">
        <button
          *ngFor="let p of presets"
          type="button"
          (click)="selectPreset(p)"
          class="ds-preset-btn"
          [class.ds-preset-btn--active]="activePreset === p.label"
        >
          {{ p.label }}
        </button>
      </div>

      <div class="ds-date-range-inputs">
        <label class="ds-date-range-sr-only" [attr.for]="startId">Start Date</label>
        <input
          [id]="startId"
          type="text"
          [value]="range.startDate"
          readonly
          placeholder="Start Date"
          [attr.aria-invalid]="isInvalid || errorMessage ? 'true' : null"
          [attr.aria-describedby]="describedByIds"
        />
        <span aria-hidden="true">→</span>
        <label class="ds-date-range-sr-only" [attr.for]="endId">End Date</label>
        <input
          [id]="endId"
          type="text"
          [value]="range.endDate"
          readonly
          placeholder="End Date"
          [attr.aria-invalid]="isInvalid || errorMessage ? 'true' : null"
          [attr.aria-describedby]="describedByIds"
        />
      </div>

      <p *ngIf="helperText" [id]="helperId" class="ds-date-range-helper">{{ helperText }}</p>
      <p *ngIf="errorMessage" [id]="errorId" role="alert" class="ds-date-range-error">{{ errorMessage }}</p>

      <div class="ds-calendar-header">
        <button type="button" class="ds-preset-btn" (click)="prevMonth()" aria-label="Previous month">‹</button>
        <strong>{{ monthNames[currentMonth] }} {{ currentYear }}</strong>
        <button type="button" class="ds-preset-btn" (click)="nextMonth()" aria-label="Next month">›</button>
      </div>

      <div class="ds-calendar-grid">
        <span *ngFor="let d of ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" class="ds-calendar-day-header">
          {{ d }}
        </span>

        <button
          *ngFor="let day of daysArray"
          type="button"
          (click)="selectDay(day)"
          class="ds-calendar-day"
          [attr.aria-label]="monthNames[currentMonth] + ' ' + day + ', ' + currentYear"
          [attr.aria-pressed]="isDaySelected(day)"
          [class.ds-calendar-day--selected]="isDaySelected(day)"
          [class.ds-calendar-day--in-range]="isDayInRange(day)"
        >
          {{ day }}
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./date-range-picker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsDateRangePickerComponent {
  private autoId = `ds-date-range-${++nextDateRangeId}`;
  get startId(): string { return `${this.autoId}-start`; }
  get endId(): string { return `${this.autoId}-end`; }
  get helperId(): string { return `${this.autoId}-helper`; }
  get errorId(): string { return `${this.autoId}-error`; }
  get describedByIds(): string | null { return [this.helperText ? this.helperId : null, this.errorMessage ? this.errorId : null].filter(Boolean).join(' ') || null; }
  @Input() range: DateRangeData = { startDate: '2026-09-15', endDate: '2026-09-22' };
  @Input() showPresets = true;
  @Input() customClass = '';
  @Input() isInvalid: boolean = false;
  @Input() errorMessage?: string;
  @Input() helperText?: string;

  @Output() rangeChange = new EventEmitter<DateRangeData>();

  activePreset = 'Last 7 Days';
  currentMonth = 8; // Sep (0-indexed)
  currentYear = 2026;

  presets = [
    { label: 'Last 24 Hours', days: 1 },
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
  ];

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  get daysArray(): number[] {
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }

  selectPreset(preset: { label: string; days: number }): void {
    this.activePreset = preset.label;
    const end = new Date(2026, 8, 22);
    const start = new Date(2026, 8, 22 - preset.days);

    const formatDate = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;

    this.range = { startDate: formatDate(start), endDate: formatDate(end) };
    this.rangeChange.emit(this.range);
  }

  selectDay(day: number): void {
    const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;

    if (!this.range.startDate || (this.range.startDate && this.range.endDate)) {
      this.range = { startDate: dateStr, endDate: '' };
      this.activePreset = 'Custom';
    } else {
      let start = this.range.startDate;
      let end = dateStr;
      if (new Date(dateStr) < new Date(start)) {
        end = start;
        start = dateStr;
      }
      this.range = { startDate: start, endDate: end };
      this.activePreset = 'Custom';
      this.rangeChange.emit(this.range);
    }
  }

  isDaySelected(day: number): boolean {
    const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    return this.range.startDate === dateStr || this.range.endDate === dateStr;
  }

  isDayInRange(day: number): boolean {
    if (!this.range.startDate || !this.range.endDate) return false;
    const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;
    const d = new Date(dateStr).getTime();
    const s = new Date(this.range.startDate).getTime();
    const e = new Date(this.range.endDate).getTime();
    return d > s && d < e;
  }

  prevMonth(): void {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth(): void {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }
}
