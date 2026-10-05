import React, { forwardRef, useState, useEffect, useId, useMemo } from 'react';
import { isZone, zoneParts, instantFrom, zoneAbbr } from './zone.js';
import './DateTimePicker.css';

export interface DateTimeParts {
  /** ISO 'YYYY-MM-DD' on the Site's clock */
  date?: string;
  /** 'HH:mm', 24-hour, on the Site's clock */
  time?: string;
  /** Both halves present. */
  complete: boolean;
  /** The IANA zone the halves are on, or undefined in floating mode. */
  zone?: string;
  /** Clock time does not exist in that zone (spring forward DST skip). */
  shifted?: boolean;
  /** Clock time happens twice (autumn back DST repeat). */
  ambiguous?: boolean;
}

export type DateTimeProblem = 'malformed' | 'nonexistent' | 'bounds' | 'partial' | null;

export interface DateTimePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onChange' | 'defaultValue'> {
  /** Names the moment as a whole (e.g. "Work Order Start", "Fault Timestamp"). */
  label?: string;
  /** UTC instant ('2026-09-23T14:30:00Z') with zone, or local 'YYYY-MM-DDTHH:mm' / { date, time } */
  value?: string | { date?: string; time?: string };
  /** Default uncontrolled initial value */
  defaultValue?: string | { date?: string; time?: string };
  /** Callback on change delivering both serialized string and individual parts */
  onChange?: (value: string | undefined, parts: DateTimeParts) => void;
  /** The record's Site zone as an IANA timezone identifier (e.g. 'Asia/Kolkata', 'America/Chicago') */
  zone?: string;
  /** Label for the date half. Defaults to 'Date'. */
  dateLabel?: string;
  /** Label for the time half. Defaults to 'Time'. */
  timeLabel?: string;
  /** Inclusive minimum bound on the Site clock */
  min?: string | { date?: string; time?: string };
  /** Inclusive maximum bound on the Site clock */
  max?: string | { date?: string; time?: string };
  /** Allow intermediate partial values without immediate invalidation. Default false. */
  allowPartial?: boolean;
  /** Step increment for time in minutes */
  step?: number;
  /** Explicit error message */
  error?: React.ReactNode;
  /** Explanatory hint text */
  hint?: React.ReactNode;
  /** Hint specifically for date */
  dateHint?: React.ReactNode;
  /** Hint specifically for time */
  timeHint?: React.ReactNode;
  /** Layout arrangement: 'auto', 'inline', or 'stacked' */
  layout?: 'auto' | 'inline' | 'stacked';
  /** Sizing tier: 'sm', 'md', or 'lg' */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state */
  disabled?: boolean;
  /** Read-only state */
  readOnly?: boolean;
  /** Show clear button when value is present */
  clearable?: boolean;
  /** Report validity and reason */
  onValidityChange?: (state: { valid: boolean; reason: DateTimeProblem; complete: boolean }) => void;
  className?: string;
  style?: React.CSSProperties;
}

const LOCAL_REGEX = /^(\d{4}-\d{2}-\d{2})(?:[T ](\d{2}:\d{2}))?/;

const splitValue = (
  val?: string | { date?: string; time?: string },
  zone?: string
): { date?: string; time?: string } => {
  if (val == null) return { date: undefined, time: undefined };
  if (typeof val === 'object') return { date: val.date || undefined, time: val.time || undefined };

  const str = String(val).trim();
  if (str.endsWith('Z') && zone && isZone(zone)) {
    return zoneParts(str, zone);
  }
  const match = str.match(LOCAL_REGEX);
  if (match) {
    return { date: match[1], time: match[2] };
  }
  return { date: undefined, time: undefined };
};

export const DateTimePicker = forwardRef<HTMLDivElement, DateTimePickerProps>(
  (
    {
      label,
      value: controlledValue,
      defaultValue,
      onChange,
      zone,
      dateLabel = 'Date',
      timeLabel = 'Time',
      min,
      max,
      allowPartial = false,
      step = 1,
      error,
      hint,
      dateHint,
      timeHint,
      layout = 'auto',
      size = 'md',
      disabled = false,
      readOnly = false,
      clearable = true,
      onValidityChange,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const isZoned = Boolean(zone && isZone(zone));
    const isControlled = controlledValue !== undefined;
    const initial = splitValue(isControlled ? controlledValue : defaultValue, zone);

    const [internalDate, setInternalDate] = useState<string | undefined>(initial.date);
    const [internalTime, setInternalTime] = useState<string | undefined>(initial.time);

    const dateVal = isControlled ? splitValue(controlledValue, zone).date : internalDate;
    const timeVal = isControlled ? splitValue(controlledValue, zone).time : internalTime;

    const uid = useId();
    const dateInputId = `${uid}-date`;
    const timeInputId = `${uid}-time`;

    // Timezone badge label
    const zoneBadge = useMemo(() => {
      if (!isZoned || !zone) return undefined;
      return zoneAbbr(zone);
    }, [isZoned, zone]);

    // Compute assembled value and flags
    const { assembledValue: _assembledValue, parts, problem } = useMemo(() => {
      const complete = Boolean(dateVal && timeVal);
      let resVal: string | undefined = undefined;
      let shifted = false;
      let ambiguous = false;
      let prob: DateTimeProblem = null;

      if (dateVal && timeVal) {
        if (isZoned && zone) {
          const inst = instantFrom(dateVal, timeVal, zone);
          resVal = inst.instant;
          shifted = inst.shifted;
          ambiguous = inst.ambiguous;
          if (shifted) {
            prob = 'nonexistent';
          }
        } else {
          resVal = `${dateVal}T${timeVal}`;
        }
      } else if (dateVal || timeVal) {
        if (!allowPartial) {
          prob = 'partial';
        }
      }

      // Check min/max bounds
      if (resVal && dateVal) {
        const minParts = splitValue(min, zone);
        const maxParts = splitValue(max, zone);

        if (minParts.date && dateVal < minParts.date) prob = 'bounds';
        if (minParts.date && dateVal === minParts.date && minParts.time && timeVal && timeVal < minParts.time) {
          prob = 'bounds';
        }
        if (maxParts.date && dateVal > maxParts.date) prob = 'bounds';
        if (maxParts.date && dateVal === maxParts.date && maxParts.time && timeVal && timeVal > maxParts.time) {
          prob = 'bounds';
        }
      }

      const p: DateTimeParts = {
        date: dateVal,
        time: timeVal,
        complete,
        zone: isZoned ? zone : undefined,
        shifted,
        ambiguous,
      };

      return {
        assembledValue: resVal,
        parts: p,
        problem: prob,
      };
    }, [dateVal, timeVal, isZoned, zone, allowPartial, min, max]);

    const dateHintId = dateHint ? `${uid}-date-hint` : undefined;
    const timeHintId = timeHint ? `${uid}-time-hint` : undefined;
    const hintId = hint ? `${uid}-hint` : undefined;
    const errorId = error || problem ? `${uid}-error` : undefined;
    const dateDescribedBy = [dateHintId, hintId, errorId].filter(Boolean).join(' ') || undefined;
    const timeDescribedBy = [timeHintId, hintId, errorId].filter(Boolean).join(' ') || undefined;

    useEffect(() => {
      onValidityChange?.({
        valid: problem === null,
        reason: problem,
        complete: parts.complete,
      });
    }, [problem, parts.complete, onValidityChange]);

    const handleDateChange = (newDate?: string) => {
      if (disabled || readOnly) return;
      if (!isControlled) setInternalDate(newDate);

      let nextVal: string | undefined;
      let shifted = false;
      let ambiguous = false;

      if (newDate && timeVal) {
        if (isZoned && zone) {
          const inst = instantFrom(newDate, timeVal, zone);
          nextVal = inst.instant;
          shifted = inst.shifted;
          ambiguous = inst.ambiguous;
        } else {
          nextVal = `${newDate}T${timeVal}`;
        }
      }

      onChange?.(nextVal, {
        date: newDate,
        time: timeVal,
        complete: Boolean(newDate && timeVal),
        zone: isZoned ? zone : undefined,
        shifted,
        ambiguous,
      });
    };

    const handleTimeChange = (newTime?: string) => {
      if (disabled || readOnly) return;
      if (!isControlled) setInternalTime(newTime);

      let nextVal: string | undefined;
      let shifted = false;
      let ambiguous = false;

      if (dateVal && newTime) {
        if (isZoned && zone) {
          const inst = instantFrom(dateVal, newTime, zone);
          nextVal = inst.instant;
          shifted = inst.shifted;
          ambiguous = inst.ambiguous;
        } else {
          nextVal = `${dateVal}T${newTime}`;
        }
      }

      onChange?.(nextVal, {
        date: dateVal,
        time: newTime,
        complete: Boolean(dateVal && newTime),
        zone: isZoned ? zone : undefined,
        shifted,
        ambiguous,
      });
    };

    const handleClear = () => {
      if (disabled || readOnly) return;
      if (!isControlled) {
        setInternalDate(undefined);
        setInternalTime(undefined);
      }
      onChange?.(undefined, {
        date: undefined,
        time: undefined,
        complete: false,
        zone: isZoned ? zone : undefined,
      });
    };

    const hasValue = Boolean(dateVal || timeVal);
    const minDate = typeof min === 'string' && !min.includes('T') ? min : splitValue(min, zone).date;
    const maxDate = typeof max === 'string' && !max.includes('T') ? max : splitValue(max, zone).date;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={label || 'Date and Time Picker'}
        className={`ds-datetime-picker ds-datetime-picker--size-${size} ds-datetime-picker--layout-${layout} ${
          disabled ? 'ds-datetime-picker--disabled' : ''
        } ${problem || error ? 'ds-datetime-picker--invalid' : ''} ${className}`}
        style={style}
        {...rest}
      >
        {label && (
          <div className="ds-datetime-picker-header">
            <span className="ds-datetime-picker-label">{label}</span>
            {zoneBadge && (
              <span className="ds-datetime-picker-zone" title={`Timezone: ${zone}`}>
                {zoneBadge}
              </span>
            )}
          </div>
        )}

        <div className="ds-datetime-picker-controls">
          <div className="ds-datetime-picker-field ds-datetime-picker-field--date">
            <label htmlFor={dateInputId} className="ds-datetime-picker-sublabel">
              {dateLabel}
            </label>
            <input
              id={dateInputId}
              aria-invalid={Boolean(error || problem)}
              aria-describedby={dateDescribedBy}
              type="date"
              value={dateVal || ''}
              min={minDate}
              max={maxDate}
              disabled={disabled}
              readOnly={readOnly}
              onChange={(e) => handleDateChange(e.target.value || undefined)}
              className="ds-datetime-picker-input"
            />
            {dateHint && <span id={dateHintId} className="ds-datetime-picker-subhint">{dateHint}</span>}
          </div>

          <div className="ds-datetime-picker-field ds-datetime-picker-field--time">
            <label htmlFor={timeInputId} className="ds-datetime-picker-sublabel">
              {timeLabel}
            </label>
            <input
              id={timeInputId}
              aria-invalid={Boolean(error || problem)}
              aria-describedby={timeDescribedBy}
              type="time"
              step={step * 60}
              value={timeVal || ''}
              disabled={disabled}
              readOnly={readOnly}
              onChange={(e) => handleTimeChange(e.target.value || undefined)}
              className="ds-datetime-picker-input"
            />
            {timeHint && <span id={timeHintId} className="ds-datetime-picker-subhint">{timeHint}</span>}
          </div>

          {clearable && hasValue && !disabled && !readOnly && (
            <button
              type="button"
              onClick={handleClear}
              className="ds-datetime-picker-clear-btn"
              aria-label="Clear date and time"
              title="Clear date and time"
            >
              ✕
            </button>
          )}
        </div>

        {parts.shifted && (
          <div className="ds-datetime-picker-warning" role="status">
            Notice: Clock skipped forward for Daylight Saving Time; adjusted to valid instant.
          </div>
        )}

        {parts.ambiguous && (
          <div className="ds-datetime-picker-notice" role="status">
            Notice: Clock repeats for Daylight Saving Time; earlier occurrence selected.
          </div>
        )}

        {(error || problem) && (
          <div id={errorId} className="ds-datetime-picker-error" role="alert">
            {error ? (
              error
            ) : problem === 'bounds' ? (
              'Selected date and time is outside permitted bounds.'
            ) : problem === 'partial' ? (
              'Please provide both date and time to complete the moment.'
            ) : problem === 'nonexistent' ? (
              'The selected time does not exist in this timezone.'
            ) : (
              'Invalid date or time value.'
            )}
          </div>
        )}

        {hint && (
          <div id={hintId} className="ds-datetime-picker-hint">{hint}</div>
        )}
      </div>
    );
  }
);

DateTimePicker.displayName = 'DateTimePicker';
