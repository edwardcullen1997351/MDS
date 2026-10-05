/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- scrollable table regions are intentionally keyboard reachable */
import React, { useState } from 'react';

export interface KPIItem {
  label: string;
  value: string;
  sub?: string;
  tone?: 'success' | 'warning' | 'critical' | 'neutral';
}

export interface EnterpriseChartStoryShellProps {
  stationEyebrow?: string;
  stationId?: string;
  title: string;
  subtitle?: string;
  shift?: string;
  shifts?: string[] | false;
  timeRanges?: Array<'1h' | '8h' | '24h' | '7d'> | false;
  kpis?: KPIItem[];
  uclLimit?: string;
  lclLimit?: string;
  tableData?: Array<Record<string, any>>;
  tableColumns?: Array<{ key: string; label: string; align?: 'left' | 'right' | 'center'; format?: (val: any) => React.ReactNode }>;
  defaultView?: 'chart' | 'table';
  children: React.ReactNode | ((context: { activeShift: string; activeTimeRange: '1h' | '8h' | '24h' | '7d' }) => React.ReactNode);
}

/**
 * EnterpriseChartStoryShell — Hardened Universal Responsive Storybook Wrapper
 *
 * Complies with Phase 1 Responsive Architecture:
 * - Fluid auto-fit KPI grid reflowing seamlessly from 4 columns down to 2 or 1 column.
 * - Fluid wrapping operational toolbar and pill button groups.
 * - Full horizontal containment with touch-friendly kinetic scroll for industrial tables.
 * - Container-aware typography and station eyebrow text clamping.
 */
export const EnterpriseChartStoryShell: React.FC<EnterpriseChartStoryShellProps> = ({
  stationEyebrow = 'Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune',
  stationId = 'CELL-CNC-04',
  title,
  subtitle,
  shift = 'Shift A (06:00 – 14:00 IST)',
  shifts = ['Shift A', 'Shift B', 'Shift C'],
  timeRanges = ['1h', '8h', '24h', '7d'],
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
  children,
}) => {
  const [activeView, setActiveView] = useState<'chart' | 'table'>(defaultView);
  const [activeTimeRange, setActiveTimeRange] = useState<'1h' | '8h' | '24h' | '7d'>('8h');
  const [activeShift, setActiveShift] = useState<string>(
    Array.isArray(shifts) && shifts.length > 0 ? shifts[0] : 'Shift A'
  );

  return (
    <div className="mds-chart-console" style={{ width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
      {/* Console Header */}
      <div className="mds-chart-console__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', width: '100%' }}>
        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          <div className="mds-chart-console__station-eyebrow" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px 8px' }}>
            <span style={{ wordBreak: 'break-word' }}>{stationEyebrow}</span>
            <span>•</span>
            <span style={{ color: 'var(--action-solid, #2563eb)' }}>{stationId}</span>
            <span className="mds-chart-console__live-badge">
              <span className="mds-chart-console__live-dot" /> LIVE 14:30:00 IST
            </span>
          </div>
          <h2 className="mds-chart-console__title" style={{ wordBreak: 'break-word' }}>{title}</h2>
          {subtitle && <p className="mds-chart-console__subtitle" style={{ wordBreak: 'break-word' }}>{subtitle}</p>}
        </div>

        {/* Operational Toolbar */}
        <div className="mds-chart-console__toolbar" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', maxWidth: '100%' }}>
          {/* Shift Selector */}
          {shifts !== false && (
            <div className="mds-chart-console__pill-group" style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
              {shifts.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`mds-chart-console__pill ${activeShift === s ? 'mds-chart-console__pill--active' : ''}`}
                  onClick={() => setActiveShift(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Time Range Selector */}
          {timeRanges !== false && (
            <div className="mds-chart-console__pill-group" style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
              {timeRanges.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`mds-chart-console__pill ${activeTimeRange === r ? 'mds-chart-console__pill--active' : ''}`}
                  onClick={() => setActiveTimeRange(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* View Mode Toggle */}
          <div className="mds-chart-console__pill-group" style={{ display: 'inline-flex', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`mds-chart-console__pill ${activeView === 'chart' ? 'mds-chart-console__pill--active' : ''}`}
              onClick={() => setActiveView('chart')}
            >
              📈 Chart
            </button>
            <button
              type="button"
              className={`mds-chart-console__pill ${activeView === 'table' ? 'mds-chart-console__pill--active' : ''}`}
              onClick={() => setActiveView('table')}
            >
              📋 Data Table
            </button>
          </div>
        </div>
      </div>

      {/* Responsive KPI Metric Strip */}
      {kpis && kpis.length > 0 && (
        <div
          className="mds-chart-kpi-strip"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))',
            gap: '12px',
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          {kpis.map((kpi, idx) => (
            <div key={idx} className="mds-chart-kpi-cell" style={{ minWidth: 0 }}>
              <span className="mds-chart-kpi-cell__label" style={{ wordBreak: 'break-word' }}>{kpi.label}</span>
              <span className="mds-chart-kpi-cell__value" style={{ wordBreak: 'break-word' }}>{kpi.value}</span>
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
                  style={{ wordBreak: 'break-word' }}
                >
                  {kpi.sub}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main View Area (Chart Canvas or High-Density Accessible Table) */}
      <div style={{ position: 'relative', width: '100%', minWidth: 0, minHeight: '320px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {activeView === 'chart' ? (
          <div style={{ width: '100%', minWidth: 0 }}>
            {typeof children === 'function' ? children({ activeShift, activeTimeRange }) : children}
          </div>
        ) : (
          <div className="mds-data-table-container" style={{ width: '100%', minWidth: 0 }}>
            <div className="mds-data-table-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>
                Telemetric Records ({tableData.length} observations)
              </span>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: '#64748b' }}>
                Active Window: {activeShift} · {activeTimeRange}
              </span>
            </div>
            <div
              style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxHeight: '380px', width: '100%' }}
              tabIndex={0}
              role="region"
              aria-label="Scrollable telemetric records"
            >
              <table className="mds-data-table" style={{ width: '100%', minWidth: '480px' }}>
                <thead>
                  <tr>
                    {tableColumns.length > 0 ? (
                      tableColumns.map((col) => (
                        <th key={col.key} className={col.align === 'right' ? 'num' : ''}>
                          {col.label}
                        </th>
                      ))
                    ) : (
                      <>
                        <th>Index</th>
                        <th>Record Identifier</th>
                        <th>Timestamp</th>
                        <th className="num">Primary Metric</th>
                        <th>Quality Status</th>
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
                      <td colSpan={tableColumns.length || 5} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                        No records available for active query window.
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
      <div className="mds-chart-footer-status" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px 16px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px' }}>
          <span>Control Limits: </span>
          <strong>UCL: {uclLimit}</strong>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <strong>LCL: {lclLimit}</strong>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px' }}>
          <span>Supervisor: <strong>Sandeep Kulkarni</strong></span>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <span>Shift: <strong>{shift}</strong></span>
        </div>
      </div>
    </div>
  );
};
