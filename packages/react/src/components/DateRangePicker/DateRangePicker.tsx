import React, { forwardRef, useState, useId } from 'react';
import { Button } from '../Button/index.js';
import { Input } from '../Input/index.js';
import './DateRangePicker.css';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DateRangePickerProps {
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (range: DateRange) => void;
  onApply?: (range: DateRange) => void;
  onCancel?: () => void;
  showPresets?: boolean;
  className?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  helperText?: string;
}

const presets = [
  { label: 'Last 24 Hours', days: 1 },
  { label: 'Last 7 Days', days: 7 },
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 90 Days', days: 90 },
];

export const DateRangePicker = forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      value: controlledValue,
      defaultValue = { startDate: '2026-09-15', endDate: '2026-09-22' },
      onChange,
      onApply,
      onCancel,
      showPresets = true,
      className = '',
      isInvalid = false,
      errorMessage,
      helperText,
    },
    ref
  ) => {
    const generatedId = useId();
    const helperId = helperText ? `ds-drp-${generatedId}-helper` : undefined;
    const errorId = errorMessage ? `ds-drp-${generatedId}-error` : undefined;
    const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;
    const [range, setRange] = useState<DateRange>(controlledValue || defaultValue);
    const [activePreset, setActivePreset] = useState<string>('Last 7 Days');
    const [currentMonth, setCurrentMonth] = useState(8); // September (0-indexed)
    const [currentYear, setCurrentYear] = useState(2026);

    const handlePresetClick = (presetLabel: string, days: number) => {
      setActivePreset(presetLabel);
      const end = new Date(2026, 8, 22);
      const start = new Date(2026, 8, 22 - days);

      const formatDate = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
          d.getDate()
        ).padStart(2, '0')}`;

      const newRange = { startDate: formatDate(start), endDate: formatDate(end) };
      setRange(newRange);
      onChange?.(newRange);
    };

    const handleDayClick = (dayNumber: number) => {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
        dayNumber
      ).padStart(2, '0')}`;

      if (!range.startDate || (range.startDate && range.endDate)) {
        const newRange = { startDate: dateStr, endDate: '' };
        setRange(newRange);
        setActivePreset('Custom');
        onChange?.(newRange);
      } else {
        let newRange: DateRange;
        if (new Date(dateStr) < new Date(range.startDate)) {
          newRange = { startDate: dateStr, endDate: range.startDate };
        } else {
          newRange = { startDate: range.startDate, endDate: dateStr };
        }
        setRange(newRange);
        setActivePreset('Custom');
        onChange?.(newRange);
      }
    };

    const isSelected = (day: number) => {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`;
      return range.startDate === dateStr || range.endDate === dateStr;
    };

    const isInRange = (day: number) => {
      if (!range.startDate || !range.endDate) return false;
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
        day
      ).padStart(2, '0')}`;
      const d = new Date(dateStr).getTime();
      const s = new Date(range.startDate).getTime();
      const e = new Date(range.endDate).getTime();
      return d > s && d < e;
    };

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    return (
      <div ref={ref} className={`ds-date-range-picker ${isInvalid ? 'ds-date-range-picker--invalid' : ''} ${className}`}>
        {showPresets && (
          <div className="ds-date-range-presets">
            {presets.map((p) => (
              <Button
                key={p.label}
                variant={activePreset === p.label ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handlePresetClick(p.label, p.days)}
              >
                {p.label}
              </Button>
            ))}
          </div>
        )}

        <div className="ds-date-range-inputs">
          <Input
            label="Start Date"
            aria-describedby={describedBy}
            size="sm"
            value={range.startDate}
            isInvalid={isInvalid || Boolean(errorMessage)}
            onChange={(e) => setRange({ ...range, startDate: e.target.value })}
          />
          <span className="ds-date-range-separator">→</span>
          <Input
            label="End Date"
            aria-describedby={describedBy}
            size="sm"
            value={range.endDate}
            isInvalid={isInvalid || Boolean(errorMessage)}
            onChange={(e) => setRange({ ...range, endDate: e.target.value })}
          />
        </div>

        {helperText && (
          <p id={helperId} className="ds-date-range-helper">
            {helperText}
          </p>
        )}

        {errorMessage && (
          <p id={errorId} role="alert" className="ds-date-range-error">
            {errorMessage}
          </p>
        )}

        <div className="ds-calendar-header">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Previous month"
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
          >
            ‹
          </Button>
          <span className="ds-calendar-title">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Next month"
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
          >
            ›
          </Button>
        </div>

        <div className="ds-calendar-grid">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <span key={d} className="ds-calendar-day-header">
              {d}
            </span>
          ))}

          {daysArray.map((day) => (
            <button
              key={day}
              type="button"
              aria-label={`${monthNames[currentMonth]} ${day}, ${currentYear}`}
              aria-pressed={isSelected(day)}
              onClick={() => handleDayClick(day)}
              className={`ds-calendar-day ${
                isSelected(day) ? 'ds-calendar-day--selected' : ''
              } ${isInRange(day) ? 'ds-calendar-day--in-range' : ''}`}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="ds-date-range-footer">
          {onCancel && (
            <Button variant="secondary" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={() => onApply?.(range)}
          >
            Apply Range
          </Button>
        </div>
      </div>
    );
  }
);

DateRangePicker.displayName = 'DateRangePicker';
