import React, { forwardRef } from 'react';
import './Badge.css';

export interface DualUomBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Primary inventory quantity */
  primaryQty: number | string;
  /** Primary inventory unit of measure (e.g. 'KG', 'L') */
  primaryUom: string;
  /** Operational / production converted quantity */
  secondaryQty?: number | string;
  /** Operational production unit of measure (e.g. 'Pk', 'Btl') */
  secondaryUom?: string;
  /** Conversion ratio label for tooltip/title (e.g. '1 KG = 20 Pk') */
  conversionRatio?: string;
}

/**
 * DualUomBadge (§01–§14)
 * Displays primary inventory storage unit and operational production unit side-by-side.
 * Uses machine monospace typography and tabular numbers to prevent jitter in high-density tables.
 */
export const DualUomBadge = forwardRef<HTMLSpanElement, DualUomBadgeProps>(
  (
    {
      primaryQty,
      primaryUom,
      secondaryQty,
      secondaryUom,
      conversionRatio,
      className = '',
      title,
      ...props
    },
    ref
  ) => {
    const formattedPrimary =
      typeof primaryQty === 'number'
        ? primaryQty.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })
        : primaryQty;

    const formattedSecondary =
      typeof secondaryQty === 'number'
        ? secondaryQty.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 })
        : secondaryQty;

    const accessibleTitle =
      title ||
      (secondaryQty && secondaryUom
        ? `${formattedPrimary} ${primaryUom} (equivalent to ${formattedSecondary} ${secondaryUom}${
            conversionRatio ? ` · Rate: ${conversionRatio}` : ''
          })`
        : `${formattedPrimary} ${primaryUom}`);

    return (
      <span
        ref={ref}
        className={`ds-dual-uom-badge ${className}`}
        title={accessibleTitle}
        aria-label={accessibleTitle}
        {...props}
      >
        <span className="ds-dual-uom-badge__primary">
          {formattedPrimary} {primaryUom}
        </span>
        {secondaryQty !== undefined && secondaryUom && (
          <>
            <span className="ds-dual-uom-badge__separator" aria-hidden="true">
              |
            </span>
            <span className="ds-dual-uom-badge__secondary">
              ~{formattedSecondary} {secondaryUom}
            </span>
          </>
        )}
      </span>
    );
  }
);

DualUomBadge.displayName = 'DualUomBadge';
