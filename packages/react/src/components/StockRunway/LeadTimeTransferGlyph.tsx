import React, { useRef, useState } from 'react';
import { FloatingDataTooltip } from './FloatingDataTooltip';
import './StockRunway.css';

export type TransferStatus = 'IN_TRANSIT' | 'SCHEDULED' | 'DELAYED' | 'COMPLETED';

export interface LeadTimeTransferGlyphProps {
  /** Origin facility or warehouse code (e.g. 'H-9' or 'Anantshriveda') */
  origin: string;
  /** Destination facility code (e.g. 'F-119' or 'Asclepius') */
  destination: string;
  /** Estimated transit lead time in hours (e.g. 4) */
  transitHours: number;
  /** Current transfer status */
  status?: TransferStatus;
  /** Transfer order identifier (e.g. 'STO-2026-8812') */
  transferId?: string;
  /** Material name being transferred */
  materialName?: string;
  /** Transferred quantity with UoM (e.g. '500 KG') */
  quantity?: string;
  /** Driver or logistics carrier (e.g. 'Maharashtra Express Logistics') */
  carrier?: string;
  /** Estimated arrival time string (e.g. '14:30 (IST)') */
  eta?: string;
  /** Optional custom CSS class */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * LeadTimeTransferGlyph (Wave 3 — Medium)
 *
 * Road-transfer indicator glyph (e.g., H-9 ➔ F-119 [4h]):
 * - Truck transit icon and directional arrow route.
 * - Lead time badge with status color coding.
 * - Interactive hover tooltip showing STO ID, carrier, and ETA.
 */
export const LeadTimeTransferGlyph: React.FC<LeadTimeTransferGlyphProps> = ({
  origin,
  destination,
  transitHours,
  status = 'IN_TRANSIT',
  transferId = 'STO-2026-8812',
  materialName = 'Ashwagandha Extract',
  quantity = '500 KG',
  carrier = 'Deccan Road Freight #MH-14-GH-9012',
  eta = '+4h (14:30 IST)',
  className = '',
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const getStatusClass = (st: TransferStatus) => {
    switch (st) {
      case 'IN_TRANSIT':
        return 'ds-transfer-glyph--in-transit';
      case 'DELAYED':
        return 'ds-transfer-glyph--delayed';
      case 'COMPLETED':
        return 'ds-transfer-glyph--completed';
      case 'SCHEDULED':
      default:
        return 'ds-transfer-glyph--scheduled';
    }
  };

  const getStatusIcon = (st: TransferStatus) => {
    switch (st) {
      case 'IN_TRANSIT':
        return '🚚';
      case 'DELAYED':
        return '⚠️';
      case 'COMPLETED':
        return '✓';
      case 'SCHEDULED':
      default:
        return '⏱️';
    }
  };

  const accessibleLabel = `Transfer ${transferId} from ${origin} to ${destination}, lead time ${transitHours} hours, status ${status}`;

  return (
    <div
      ref={anchorRef}
      className={`ds-transfer-glyph ${getStatusClass(status)} ${className}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={() => setIsHovered(true)}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setIsHovered(true);
        }
      }}
      tabIndex={0}
      role="button"
      aria-expanded={isHovered}
      aria-label={accessibleLabel}
    >
      <span className="ds-transfer-glyph__icon" aria-hidden="true">
        {getStatusIcon(status)}
      </span>

      <span className="ds-transfer-glyph__route">
        <span className="ds-transfer-glyph__node">{origin}</span>
        <span className="ds-transfer-glyph__arrow" aria-hidden="true">➔</span>
        <span className="ds-transfer-glyph__node">{destination}</span>
      </span>

      <span className="ds-transfer-glyph__lead-time">
        [{transitHours}h]
      </span>

      {/* Hover/Focus Tooltip */}
      {isHovered && (
        <FloatingDataTooltip anchorRef={anchorRef} className="ds-transfer-glyph__tooltip">
          <div className="ds-transfer-glyph__tooltip-header">
            <strong>Stock Transfer Order</strong>
            <span className="ds-transfer-glyph__tooltip-id">{transferId}</span>
          </div>
          <div className="ds-transfer-glyph__tooltip-body">
            <div>
              <span className="ds-transfer-glyph__tooltip-label">Cargo:</span>
              <span className="ds-transfer-glyph__tooltip-val">{materialName} ({quantity})</span>
            </div>
            <div>
              <span className="ds-transfer-glyph__tooltip-label">Route:</span>
              <span className="ds-transfer-glyph__tooltip-val">{origin} ➔ {destination}</span>
            </div>
            <div>
              <span className="ds-transfer-glyph__tooltip-label">Carrier:</span>
              <span className="ds-transfer-glyph__tooltip-val">{carrier}</span>
            </div>
            <div>
              <span className="ds-transfer-glyph__tooltip-label">ETA:</span>
              <span className="ds-transfer-glyph__tooltip-val ds-transfer-glyph__tooltip-val--eta">
                {eta}
              </span>
            </div>
          </div>
        </FloatingDataTooltip>
      )}
    </div>
  );
};
