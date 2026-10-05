import React, { forwardRef } from 'react';
import './TimeHorizonStepper.css';

export type TimeHorizonBucket = 'shift' | 'day' | 'week' | 'month';

export interface TimeHorizonStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Active bucket granularity (shift, day, week, month) */
  bucketSize?: TimeHorizonBucket;
  /** Callback fired when bucket granularity changes */
  onBucketSizeChange?: (bucket: TimeHorizonBucket) => void;
  /** Display label for currently focused horizon (e.g. "01-Oct-2026 · Shift 1") */
  currentHorizonLabel: string;
  /** Previous step callback */
  onPrev?: () => void;
  /** Disable traversal before the first available horizon */
  prevDisabled?: boolean;
  /** Next step callback */
  onNext?: () => void;
  /** Disable traversal after the last available horizon */
  nextDisabled?: boolean;
  /** Quick jump to current/today callback */
  onJumpToday?: () => void;
  /** Label for quick jump button (default: "Today / Shift 1") */
  jumpTodayLabel?: string;
  /** Accessible label for the navigation region */
  ariaLabel?: string;
}

const buckets: { key: TimeHorizonBucket; label: string }[] = [
  { key: 'shift', label: 'Shift' },
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
];

/**
 * TimeHorizonStepper (§01–§14)
 * Manufacturing planning horizon navigation controller.
 * Enables rapid temporal traversal between shifts, days, and planning horizons
 * with single-click jump back to real-time execution shift.
 */
export const TimeHorizonStepper = forwardRef<HTMLDivElement, TimeHorizonStepperProps>(
  (
    {
      bucketSize = 'day',
      onBucketSizeChange,
      currentHorizonLabel,
      onPrev,
      prevDisabled = false,
      onNext,
      nextDisabled = false,
      onJumpToday,
      jumpTodayLabel = 'Today / Shift 1',
      ariaLabel = 'Production planning time horizon',
      className = '',
      ...props
    },
    ref
  ) => {
    const handleBucketKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = buckets.findIndex((bucket) => bucket.key === bucketSize);
      let nextIndex: number;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = (currentIndex + 1) % buckets.length;
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex = (currentIndex + buckets.length - 1) % buckets.length;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = buckets.length - 1;
          break;
        default:
          return;
      }
      event.preventDefault();
      onBucketSizeChange?.(buckets[nextIndex].key);
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')[nextIndex]?.focus();
    };

    return (
      <div
        ref={ref}
        className={`ds-time-horizon-stepper ${className}`}
        role="toolbar"
        aria-label={ariaLabel}
        {...props}
      >
        {/* Bucket Granularity Switcher */}
        <div className="ds-time-horizon-stepper__buckets" role="radiogroup" aria-label="Horizon Granularity" tabIndex={-1} onKeyDown={handleBucketKeyDown}>
          {buckets.map((b) => {
            const isActive = bucketSize === b.key;
            return (
              <button
                key={b.key}
                type="button"
                role="radio"
                aria-checked={isActive}
                tabIndex={isActive ? 0 : -1}
                className={`ds-time-horizon-stepper__bucket-btn ${
                  isActive ? 'ds-time-horizon-stepper__bucket-btn--active' : ''
                }`}
                onClick={() => onBucketSizeChange?.(b.key)}
              >
                {b.label}
              </button>
            );
          })}
        </div>

        {/* Step Traversal Navigation */}
        <div className="ds-time-horizon-stepper__nav">
          <button
            type="button"
            className="ds-time-horizon-stepper__nav-btn"
            onClick={onPrev}
            disabled={prevDisabled || !onPrev}
            aria-label="Previous planning horizon"
            title="Previous (Arrow Left)"
          >
            ◀
          </button>

          <span
            className="ds-time-horizon-stepper__current"
            aria-live="polite"
            title="Active horizon"
          >
            {currentHorizonLabel}
          </span>

          <button
            type="button"
            className="ds-time-horizon-stepper__nav-btn"
            onClick={onNext}
            disabled={nextDisabled || !onNext}
            aria-label="Next planning horizon"
            title="Next (Arrow Right)"
          >
            ▶
          </button>
        </div>

        {/* Quick Jump Action */}
        {onJumpToday && (
          <button
            type="button"
            className="ds-time-horizon-stepper__jump-btn"
            onClick={onJumpToday}
            aria-label={jumpTodayLabel}
            title={jumpTodayLabel}
          >
            <span aria-hidden="true" style={{ fontSize: 'var(--text-xs)' }}>⟲</span>
            <span>{jumpTodayLabel}</span>
          </button>
        )}
      </div>
    );
  }
);

TimeHorizonStepper.displayName = 'TimeHorizonStepper';
