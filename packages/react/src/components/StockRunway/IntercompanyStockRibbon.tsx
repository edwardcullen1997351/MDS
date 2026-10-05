import React from 'react';
import './StockRunway.css';

export interface IntercompanyMetric {
  label: string;
  facility: string;
  quantity: number;
  uom: string;
  status?: 'safe' | 'warning' | 'danger' | 'info';
  statusLabel?: string;
  subtext?: string;
}

export interface IntercompanyStockRibbonProps {
  /** Metric 1: Plant Stock On-Hand (e.g. at F-119) */
  plantStock?: IntercompanyMetric;
  /** Metric 2: Warehouse Stock Staged (e.g. at H-9) */
  warehouseStock?: IntercompanyMetric;
  /** Metric 3: In-Transit STO Quantity & Status */
  inTransitStock?: IntercompanyMetric;
  /** Metric 4: Net Intercompany Balance & Coverage */
  netBalance?: IntercompanyMetric;
  /** Optional callback to trigger STO transfer request */
  onRequestTransfer?: () => void;
  /** Optional callback to view STO details */
  onViewDetails?: () => void;
  /** Additional CSS class */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

const DEFAULT_PLANT_STOCK: IntercompanyMetric = {
  label: 'Plant Stock On-Hand',
  facility: 'Food Plant F-119',
  quantity: 350,
  uom: 'KG',
  status: 'warning',
  statusLabel: 'Deficit Risk',
  subtext: '4.2 Days Runway',
};

const DEFAULT_WAREHOUSE_STOCK: IntercompanyMetric = {
  label: 'Warehouse Staged',
  facility: 'RM Warehouse H-9',
  quantity: 1200,
  uom: 'KG',
  status: 'safe',
  statusLabel: 'Available',
  subtext: 'Batch B-901 Passed QC',
};

const DEFAULT_IN_TRANSIT_STOCK: IntercompanyMetric = {
  label: 'In-Transit STO',
  facility: 'En Route (H-9 ➔ F-119)',
  quantity: 500,
  uom: 'KG',
  status: 'info',
  statusLabel: 'ETA 14:30',
  subtext: 'Carrier MH-14-GH-9012',
};

const DEFAULT_NET_BALANCE: IntercompanyMetric = {
  label: 'Net Intercompany Balance',
  facility: 'Total System Runway',
  quantity: 2050,
  uom: 'KG',
  status: 'safe',
  statusLabel: '24.6d Coverage',
  subtext: 'Exceeds Reorder Point',
};

/**
 * IntercompanyStockRibbon (Wave 3 — Medium)
 *
 * Consolidated 4-metric intercompany balance strip:
 * 1. Plant Stock (F-119)
 * 2. Warehouse Stock (H-9)
 * 3. In-Transit STO (En route)
 * 4. Net Intercompany Balance
 */
export const IntercompanyStockRibbon: React.FC<IntercompanyStockRibbonProps> = ({
  plantStock = DEFAULT_PLANT_STOCK,
  warehouseStock = DEFAULT_WAREHOUSE_STOCK,
  inTransitStock = DEFAULT_IN_TRANSIT_STOCK,
  netBalance = DEFAULT_NET_BALANCE,
  onRequestTransfer,
  onViewDetails,
  className = '',
  style,
}) => {
  const metrics = [plantStock, warehouseStock, inTransitStock, netBalance];

  const getStatusBadgeClass = (status?: string) => {
    switch (status) {
      case 'warning':
        return 'ds-stock-ribbon__pill--warning';
      case 'danger':
        return 'ds-stock-ribbon__pill--danger';
      case 'info':
        return 'ds-stock-ribbon__pill--info';
      case 'safe':
      default:
        return 'ds-stock-ribbon__pill--safe';
    }
  };

  return (
    <div className={`ds-stock-ribbon ${className}`} style={style} role="region" aria-label="Intercompany Stock Balance Strip">
      <div className="ds-stock-ribbon__metrics">
        {metrics.map((m, idx) => (
          <div key={idx} className="ds-stock-ribbon__card">
            <div className="ds-stock-ribbon__header">
              <span className="ds-stock-ribbon__label">{m.label}</span>
              {m.statusLabel && (
                <span className={`ds-stock-ribbon__pill ${getStatusBadgeClass(m.status)}`}>
                  {m.statusLabel}
                </span>
              )}
            </div>

            <div className="ds-stock-ribbon__qty-group">
              <span className="ds-stock-ribbon__qty">{m.quantity.toLocaleString()}</span>
              <span className="ds-stock-ribbon__uom">{m.uom}</span>
            </div>

            <div className="ds-stock-ribbon__facility">
              <span className="ds-stock-ribbon__icon" aria-hidden="true">📍</span>
              <span>{m.facility}</span>
            </div>

            {m.subtext && <div className="ds-stock-ribbon__subtext">{m.subtext}</div>}
          </div>
        ))}
      </div>

      {(onRequestTransfer || onViewDetails) && (
        <div className="ds-stock-ribbon__actions">
          {onRequestTransfer && (
            <button
              type="button"
              className="ds-stock-ribbon__action-btn ds-stock-ribbon__action-btn--primary"
              onClick={onRequestTransfer}
            >
              <span aria-hidden="true">+</span>
              <span>Request STO Transfer</span>
            </button>
          )}
          {onViewDetails && (
            <button
              type="button"
              className="ds-stock-ribbon__action-btn ds-stock-ribbon__action-btn--secondary"
              onClick={onViewDetails}
            >
              <span>View STO Ledger</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
