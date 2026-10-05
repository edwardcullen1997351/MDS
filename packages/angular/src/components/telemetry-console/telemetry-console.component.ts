import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

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
}

@Component({
  selector: 'ds-telemetry-console',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mds-chart-console" [class.mds-chart-console--compact]="compact" [class]="customClass">
      <!-- Console Header -->
      <div class="mds-chart-console__header">
        <div>
          <div class="mds-chart-console__station-eyebrow">
            <span>{{ stationEyebrow }}</span>
            <span>•</span>
            <span style="color: var(--action-solid, #2563eb);">{{ stationId }}</span>
            <span class="mds-chart-console__live-badge">
              <span class="mds-chart-console__live-dot"></span> LIVE
            </span>
          </div>
          <h2 class="mds-chart-console__title">{{ title }}</h2>
          <p *ngIf="subtitle" class="mds-chart-console__subtitle">{{ subtitle }}</p>
        </div>

        <!-- Operational Toolbar -->
        <div class="mds-chart-console__toolbar">
          <!-- Shift Selector -->
          <div class="mds-chart-console__pill-group">
            <button
              *ngFor="let s of shifts"
              type="button"
              class="mds-chart-console__pill"
              [class.mds-chart-console__pill--active]="activeShift === s"
              (click)="selectShift(s)"
            >
              {{ s }}
            </button>
          </div>

          <!-- Time Range Selector -->
          <div class="mds-chart-console__pill-group">
            <button
              *ngFor="let r of ranges"
              type="button"
              class="mds-chart-console__pill"
              [class.mds-chart-console__pill--active]="activeRange === r"
              (click)="selectRange(r)"
            >
              {{ r }}
            </button>
          </div>

          <!-- View Mode Toggle -->
          <div class="mds-chart-console__pill-group">
            <button
              type="button"
              class="mds-chart-console__pill"
              [class.mds-chart-console__pill--active]="activeView === 'chart'"
              (click)="activeView = 'chart'"
              aria-label="Switch to graphical visualization view"
            >
              📈 Chart
            </button>
            <button
              type="button"
              class="mds-chart-console__pill"
              [class.mds-chart-console__pill--active]="activeView === 'table'"
              (click)="activeView = 'table'"
              aria-label="Switch to accessible data table view"
            >
              📋 Data Table
            </button>
          </div>
        </div>
      </div>

      <!-- KPI Metric Strip -->
      <div *ngIf="kpis && kpis.length > 0" class="mds-chart-kpi-strip">
        <div *ngFor="let kpi of kpis" class="mds-chart-kpi-cell">
          <span class="mds-chart-kpi-cell__label">{{ kpi.label }}</span>
          <span class="mds-chart-kpi-cell__value">{{ kpi.value }}</span>
          <span
            *ngIf="kpi.sub"
            class="mds-chart-kpi-cell__sub"
            [class.mds-chart-kpi-cell__sub--success]="kpi.tone === 'success'"
            [class.mds-chart-kpi-cell__sub--warning]="kpi.tone === 'warning'"
            [class.mds-chart-kpi-cell__sub--critical]="kpi.tone === 'critical'"
          >
            {{ kpi.sub }}
          </span>
        </div>
      </div>

      <!-- Main View Area -->
      <div style="position: relative; min-height: 320px;">
        <ng-container *ngIf="activeView === 'chart'">
          <ng-content></ng-content>
        </ng-container>

        <div *ngIf="activeView === 'table'" class="mds-data-table-container">
          <div class="mds-data-table-toolbar">
            <span style="font-weight: 600; color: var(--text-primary, #0f172a);">
              Telemetric Records ({{ tableData.length }} observations)
            </span>
            <span style="font-family: var(--font-mono, monospace); fontSize: 11px; color: var(--text-tertiary, #64748b);">
              Active Window: {{ activeShift }} · {{ activeRange }}
            </span>
          </div>
          <div style="overflow-x: auto; max-height: 380px;">
            <table class="mds-data-table">
              <thead>
                <tr>
                  <th *ngFor="let col of resolvedColumns" [class.num]="col.align === 'right'" scope="col">
                    {{ col.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of tableData; let rIdx = index">
                  <td *ngFor="let col of resolvedColumns" [class.num]="col.align === 'right'">
                    {{ row[col.key] ?? '—' }}
                  </td>
                </tr>
                <tr *ngIf="tableData.length === 0">
                  <td [attr.colspan]="resolvedColumns.length" style="text-align: center; padding: 24px; color: var(--text-secondary, #64748b);">
                    No telemetric records available for the active query window.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Footer Control Limits -->
      <div class="mds-chart-footer-status">
        <div>
          <span>Control Limits: </span>
          <strong>UCL: {{ uclLimit }}</strong>
          <span style="margin: 0 8px; color: var(--border-subtle, #cbd5e1);">|</span>
          <strong>LCL: {{ lclLimit }}</strong>
        </div>
        <div style="display: flex; gap: 12px;">
          <span>Supervisor: <strong>{{ supervisor }}</strong></span>
          <span style="color: var(--border-subtle, #cbd5e1);">|</span>
          <span>Shift: <strong>{{ shift }}</strong></span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./telemetry-console.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTelemetryConsoleComponent {
  @Input({ required: true }) title = '';
  @Input() subtitle?: string;
  @Input() stationEyebrow = 'Suryodaya Autocomp Ltd · Chakan Plant PL-04, Pune';
  @Input() stationId = 'CELL-CNC-04';
  @Input() shift = 'Shift A (06:00 – 14:00 IST)';
  @Input() supervisor = 'Sandeep Kulkarni';
  @Input() uclLimit = '450 kVA (Contract Demand Cap)';
  @Input() lclLimit = '120 kVA (Base Standby)';
  @Input() kpis: KPIItem[] = [
    { label: 'Current Output', value: '425 kVA', sub: 'Nominal Range', tone: 'success' },
    { label: 'Peak Reading', value: '440 kVA', sub: 'Max at 16:00 IST', tone: 'warning' },
    { label: 'Shift Average', value: '382 kVA', sub: 'Within Budget', tone: 'success' },
    { label: 'UCL Limit', value: '450 kVA', sub: 'Contract Demand Cap', tone: 'critical' },
  ];
  @Input() tableData: Array<Record<string, any>> = [];
  @Input() tableColumns: TelemetryTableColumn[] = [];
  @Input() defaultView: 'chart' | 'table' = 'chart';
  @Input() compact = false;
  @Input() customClass = '';

  @Output() shiftChange = new EventEmitter<string>();
  @Output() timeRangeChange = new EventEmitter<string>();

  shifts = ['Shift A', 'Shift B', 'Shift C'];
  ranges = ['1h', '8h', '24h', '7d'];
  activeShift = 'Shift A';
  activeRange = '8h';
  activeView: 'chart' | 'table' = 'chart';

  ngOnInit() {
    this.activeView = this.defaultView;
  }

  get resolvedColumns(): TelemetryTableColumn[] {
    if (this.tableColumns && this.tableColumns.length > 0) {
      return this.tableColumns;
    }
    if (this.tableData && this.tableData.length > 0) {
      return Object.keys(this.tableData[0]).map((k) => ({
        key: k,
        label: k.toUpperCase(),
        align: typeof this.tableData[0][k] === 'number' ? 'right' : 'left',
      }));
    }
    return [
      { key: 'id', label: 'ID' },
      { key: 'time', label: 'TIMESTAMP' },
      { key: 'val', label: 'VALUE', align: 'right' },
    ];
  }

  selectShift(s: string) {
    this.activeShift = s;
    this.shiftChange.emit(s);
  }

  selectRange(r: string) {
    this.activeRange = r;
    this.timeRangeChange.emit(r);
  }
}
