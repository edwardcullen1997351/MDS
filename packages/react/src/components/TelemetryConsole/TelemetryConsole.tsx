import React, { useState, forwardRef } from 'react';
import '../../styles/dataviz.css';

export interface KPIItem {
  label: string;
  value: string;
  sub?: string;
  tone?: 'success' | 'warning' | 'critical' | 'neutral';
}

export interface TelemetryTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  format?: (val: any) => React.ReactNode;
}

export interface TelemetryConsoleProps extends React.HTMLAttributes<HTMLDivElement> {
  stationEyebrow?: string;
  stationId?: string;
  title: string;
  subtitle?: string;
  shift?: string;
  supervisor?: string;
  kpis?: KPIItem[];
  uclLimit?: string;
  lclLimit?: string;
  tableData?: Array<Record<string, any>>;
  tableColumns?: TelemetryTableColumn[];
  defaultView?: 'chart' | 'table';
  compact?: boolean;
  onShiftChange?: (shift: string) => void;
  onTimeRangeChange?: (range: string) => void;
  children: React.ReactNode;
}

export const TelemetryConsole = forwardRef<HTMLDivElement, TelemetryConsoleProps>(
  (
    {
      stationEyebrow = 'Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune',
      stationId = 'CELL-CNC-04',
      title,
      subtitle,
      shift = 'Shift A (06:00 – 14:00 IST)',
      supervisor = 'Sandeep Kulkarni',
      kpis = [
        { label: 'Current Output', value: '425 kVA', sub: 'Nominal Range', tone: 'success' },
        { label: 'Peak Reading', value: '440 kVA', sub: 'Max at 16:00 IST', tone: 'warning' },
        { label: 'Shift Average', value: '382 kVA', sub: 'Within Budget', tone: 'success' },
        { label: 'UCL Limit', value: '450 kVA', sub: 'Contract Demand Cap', tone: 'critical' },
      ],
      uclLimit = '450 kVA (Contract Demand Cap)',
      lclLimit = '120 kVA (Base Standby)',
      tableData = [],
      tableColumns = [],
      defaultView = 'chart',
      compact = false,
      onShiftChange,
      onTimeRangeChange,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const [activeView, setActiveView] = useState<'chart' | 'table'>(defaultView);
    const [activeTimeRange, setActiveTimeRange] = useState<'1h' | '8h' | '24h' | '7d'>('8h');
    const [activeShift, setActiveShift] = useState<string>('Shift A');

    const handleShiftSelect = (s: string) => {
      setActiveShift(s);
      onShiftChange?.(s);
    };

    const handleRangeSelect = (r: '1h' | '8h' | '24h' | '7d') => {
      setActiveTimeRange(r);
      onTimeRangeChange?.(r);
    };

    return (
      <div
        ref={ref}
        className={`mds-chart-console ${compact ? 'mds-chart-console--compact' : ''} ${className}`}
        {...props}
      >
        {/* Console Header */}
        <div className="mds-chart-console__header">
          <div>
            <div className="mds-chart-console__station-eyebrow">
              <span>{stationEyebrow}</span>
              <span>•</span>
              <span style={{ color: 'var(--action-solid)' }}>{stationId}</span>
              <span className="mds-chart-console__live-badge">
                <span className="mds-chart-console__live-dot" /> LIVE
              </span>
            </div>
            <h2 className="mds-chart-console__title">{title}</h2>
            {subtitle && <p className="mds-chart-console__subtitle">{subtitle}</p>}
          </div>

          {/* Operational Toolbar */}
          <div className="mds-chart-console__toolbar">
            {/* Shift Selector */}
            <div className="mds-chart-console__pill-group">
              {['Shift A', 'Shift B', 'Shift C'].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`mds-chart-console__pill ${activeShift === s ? 'mds-chart-console__pill--active' : ''}`}
                  onClick={() => handleShiftSelect(s)}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Time Range Selector */}
            <div className="mds-chart-console__pill-group">
              {(['1h', '8h', '24h', '7d'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`mds-chart-console__pill ${activeTimeRange === r ? 'mds-chart-console__pill--active' : ''}`}
                  onClick={() => handleRangeSelect(r)}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="mds-chart-console__pill-group">
              <button
                type="button"
                className={`mds-chart-console__pill ${activeView === 'chart' ? 'mds-chart-console__pill--active' : ''}`}
                onClick={() => setActiveView('chart')}
                aria-label="Switch to graphical visualization view"
              >
                📈 Chart
              </button>
              <button
                type="button"
                className={`mds-chart-console__pill ${activeView === 'table' ? 'mds-chart-console__pill--active' : ''}`}
                onClick={() => setActiveView('table')}
                aria-label="Switch to accessible data table view"
              >
                📋 Data Table
              </button>
            </div>
          </div>
        </div>

        {/* KPI Metric Strip */}
        {kpis && kpis.length > 0 && (
          <div className="mds-chart-kpi-strip">
            {kpis.map((kpi, idx) => (
              <div key={idx} className="mds-chart-kpi-cell">
                <span className="mds-chart-kpi-cell__label">{kpi.label}</span>
                <span className="mds-chart-kpi-cell__value">{kpi.value}</span>
                {kpi.sub && (
                  <span
                    className={`mds-chart-kpi-cell__sub ${
                      kpi.tone === 'success'
                        ? 'mds-chart-kpi-cell__sub--success'
                        : kpi.tone === 'warning'
                        ? 'mds-chart-kpi-cell__sub--warning'
                        : kpi.tone === 'critical'
                        ? 'mds-chart-kpi-cell__sub--critical'
                        : ''
                    }`}
                  >
                    {kpi.sub}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Main View Area (Chart Canvas or High-Density Accessible Table) */}
        <div style={{ position: 'relative', minHeight: 'var(--layout-telemetry-canvas-min-h)' }}>
          {activeView === 'chart' ? (
            children
          ) : (
            <div className="mds-data-table-container">
              <div className="mds-data-table-toolbar">
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  Telemetric Records ({tableData.length} observations)
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>
                  Active Window: {activeShift} · {activeTimeRange}
                </span>
              </div>
              <div
                style={{ overflowX: 'auto', maxHeight: 'var(--layout-telemetry-table-max-h)' }}
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The overflowing table needs a keyboard scroll target.
                tabIndex={0}
                role="region"
                aria-label="Scrollable telemetric records"
              >
                <table className="mds-data-table">
                  <thead>
                    <tr>
                      {tableColumns.length > 0 ? (
                        tableColumns.map((col) => (
                          <th key={col.key} className={col.align === 'right' ? 'num' : ''} scope="col">
                            {col.label}
                          </th>
                        ))
                      ) : (
                        <>
                          <th scope="col">Index</th>
                          <th scope="col">Record Identifier</th>
                          <th scope="col">Timestamp</th>
                          <th scope="col" className="num">Primary Metric</th>
                          <th scope="col">Quality Status</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.length > 0 ? (
                      tableData.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {tableColumns.length > 0 ? (
                            tableColumns.map((col) => (
                              <td key={col.key} className={col.align === 'right' ? 'num' : ''}>
                                {col.format ? col.format(row[col.key]) : String(row[col.key] ?? '—')}
                              </td>
                            ))
                          ) : (
                            <>
                              <td style={{ fontFamily: 'var(--font-mono, monospace)' }}>#{rIdx + 1}</td>
                              <td>{row.name || row.id || row.key || `REC-${1000 + rIdx}`}</td>
                              <td style={{ fontFamily: 'var(--font-mono, monospace)' }}>{row.time || row.hour || row.date || '14:00 IST'}</td>
                              <td className="num">{row.val || row.value || row.y || row.powerKVA || '—'}</td>
                              <td>
                                <span className="status-tag status-tag--optimal">Optimal</span>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={tableColumns.length || 5} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-secondary)' }}>
                          No telemetric records available for the active query window.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Threshold & Control Limits Status Footer */}
        <div className="mds-chart-footer-status">
          <div>
            <span>Control Limits: </span>
            <strong>UCL: {uclLimit}</strong>
            <span style={{ margin: '0 var(--space-2)', color: 'var(--border-subtle)' }}>|</span>
            <strong>LCL: {lclLimit}</strong>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <span>Supervisor: <strong>{supervisor}</strong></span>
            <span style={{ color: 'var(--border-subtle)' }}>|</span>
            <span>Shift: <strong>{shift}</strong></span>
          </div>
        </div>
      </div>
    );
  }
);

TelemetryConsole.displayName = 'TelemetryConsole';
