import React, { forwardRef, useState, useEffect } from 'react';
import './Badge.css';

export interface StaleDataPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Timestamp of last calculation/sync from engine */
  lastSyncTime?: Date | number;
  /** Explicit minutes since last sync (overrides auto-timer) */
  ageMinutes?: number;
  /** Minutes before status turns to warning amber (default: 5) */
  staleThresholdMinutes?: number;
  /** Minutes before status turns to error red (default: 15) */
  criticalThresholdMinutes?: number;
  /** Callback fired when user triggers calculation refresh */
  onRefresh?: () => void;
  /** Whether calculation/sync is actively executing */
  isRefreshing?: boolean;
}

/**
 * StaleDataPill (§01–§14)
 * Ambient telemetry badge for manufacturing ERP control rooms.
 * Warns planners when displayed MRP or batch calculations are stale,
 * preventing allocation decisions on invalid phantom stock.
 */
export const StaleDataPill = forwardRef<HTMLSpanElement, StaleDataPillProps>(
  (
    {
      lastSyncTime,
      ageMinutes,
      staleThresholdMinutes = 5,
      criticalThresholdMinutes = 15,
      onRefresh,
      isRefreshing = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const [computedAge, setComputedAge] = useState<number>(() => {
      if (ageMinutes !== undefined) return ageMinutes;
      if (!lastSyncTime) return 0;
      const ms = Date.now() - new Date(lastSyncTime).getTime();
      return Math.max(0, Math.floor(ms / 60000));
    });

    useEffect(() => {
      if (ageMinutes !== undefined || !lastSyncTime) return;

      const update = () => {
        const ms = Date.now() - new Date(lastSyncTime).getTime();
        setComputedAge(Math.max(0, Math.floor(ms / 60000)));
      };

      const initialUpdate = setTimeout(update, 0);
      const timer = setInterval(update, 30000); // Check every 30s
      return () => {
        clearTimeout(initialUpdate);
        clearInterval(timer);
      };
    }, [lastSyncTime, ageMinutes]);

    const displayedAge = ageMinutes ?? computedAge;
    const isCritical = displayedAge >= criticalThresholdMinutes;
    const isStale = !isCritical && displayedAge >= staleThresholdMinutes;
    const _isFresh = !isCritical && !isStale;

    const modifierClass = isCritical
      ? 'ds-stale-pill--critical'
      : isStale
      ? 'ds-stale-pill--stale'
      : 'ds-stale-pill--fresh';

    const statusText = isRefreshing
      ? 'Recalculating...'
      : isCritical
      ? `Stale calculation (${displayedAge}m)`
      : isStale
      ? `Data ${displayedAge}m stale`
      : displayedAge === 0
      ? 'Synced just now'
      : `Synced ${displayedAge}m ago`;

    return (
      <span
        ref={ref}
        className={`ds-stale-pill ${modifierClass} ${className}`}
        role="status"
        aria-live="polite"
        {...props}
      >
        <span aria-hidden="true">
          {isRefreshing ? '⏳' : isCritical ? '⚠️' : isStale ? '⏱️' : '✓'}
        </span>
        <span>{statusText}</span>
        {onRefresh && !isRefreshing && (
          <button
            type="button"
            className="ds-stale-pill__refresh"
            onClick={onRefresh}
            aria-label="Refresh MRP calculation"
            title="Refresh calculation"
          >
            🔄
          </button>
        )}
      </span>
    );
  }
);

StaleDataPill.displayName = 'StaleDataPill';
