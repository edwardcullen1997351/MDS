import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ScopeData {
  plant?: string;
  area?: string;
  unit?: string;
}

@Component({
  selector: 'ds-scope-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-scope-picker" [class]="customClass">
      <div class="ds-scope-picker-controls">
        <div>
          <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Enterprise Plant</label>
          <select
            style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #D1D5DB;"
            [value]="scope.plant || ''"
            (change)="onPlantSelect($event)"
          >
            <option value="">Select Plant...</option>
            <option value="plant-01">Plant 01 - Pune HQ</option>
            <option value="plant-04">Plant 04 - Chakan Press Shop</option>
            <option value="plant-07">Plant 07 - Sanand Assembly</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Area / Hall</label>
          <select
            style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #D1D5DB;"
            [disabled]="!scope.plant"
            [value]="scope.area || ''"
            (change)="onAreaSelect($event)"
          >
            <option value="">Select Area...</option>
            <option *ngIf="scope.plant === 'plant-04'" value="bay-1">Turbine Hall Bay 1</option>
            <option *ngIf="scope.plant === 'plant-04'" value="stamping-4">Heavy Stamping Line 4</option>
            <option *ngIf="scope.plant === 'plant-04'" value="boiler-house">Auxiliary Boiler House</option>
            <option *ngIf="scope.plant === 'plant-01'" value="cnc-bay">CNC Machining Bay</option>
            <option *ngIf="scope.plant === 'plant-01'" value="cleanroom">Inspection Cleanroom</option>
            <option *ngIf="scope.plant === 'plant-07'" value="robotics">Robotic Chassis Line</option>
            <option *ngIf="scope.plant === 'plant-07'" value="battery-cell">Battery Pack Testing Cell</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 14px; font-weight: 500; margin-bottom: 4px;">Machine Unit</label>
          <select
            style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid #D1D5DB;"
            [disabled]="!scope.area"
            [value]="scope.unit || ''"
            (change)="onUnitSelect($event)"
          >
            <option value="">Select Unit...</option>
            <option *ngIf="scope.area === 'bay-1'" value="tg-401">Turbine Generator TG-401</option>
            <option *ngIf="scope.area === 'bay-1'" value="v-12">Steam Manifold Valve V-12</option>
            <option *ngIf="scope.area === 'stamping-4'" value="press-2000">Hydraulic Press 2000T</option>
            <option *ngIf="scope.area === 'stamping-4'" value="feeder-08">Blank Feeder F-08</option>
            <option *ngIf="scope.area === 'boiler-house'" value="boiler-01">High-Pressure Boiler B-01</option>
            <option *ngIf="scope.area === 'cnc-bay'" value="cnc-01">5-Axis CNC Milling Center MC-01</option>
            <option *ngIf="scope.area === 'cnc-bay'" value="lathe-04">Precision CNC Lathe L-04</option>
            <option *ngIf="scope.area === 'cleanroom'" value="cmm-01">Coordinate Measuring Machine CMM-01</option>
            <option *ngIf="scope.area === 'cleanroom'" value="opp-02">Optical Profile Projector OPP-02</option>
            <option *ngIf="scope.area === 'robotics'" value="robot-101">Spot Welding Robot Arm R-101</option>
            <option *ngIf="scope.area === 'battery-cell'" value="cycler-01">High-Voltage Discharge Cycler DC-01</option>
          </select>
        </div>
      </div>

      <div *ngIf="scope.plant || scope.area || scope.unit" class="ds-scope-picker-summary">
        <span style="font-size: 13px; color: #4B5563;">
          Scope: <strong>{{ scope.plant }}</strong> &gt; <strong>{{ scope.area }}</strong> &gt; <strong>{{ scope.unit }}</strong>
        </span>
        <button
          type="button"
          style="background: transparent; border: none; color: #2563EB; font-size: 13px; cursor: pointer;"
          (click)="clearScope()"
        >
          Clear
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./scope-picker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsScopePickerComponent {
  @Input() scope: ScopeData = { plant: 'plant-04', area: 'bay-1', unit: 'tg-401' };
  @Input() customClass = '';

  @Output() scopeChange = new EventEmitter<ScopeData>();

  onPlantSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.scope = { plant: target.value || undefined, area: undefined, unit: undefined };
    this.scopeChange.emit(this.scope);
  }

  onAreaSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.scope = { ...this.scope, area: target.value || undefined, unit: undefined };
    this.scopeChange.emit(this.scope);
  }

  onUnitSelect(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.scope = { ...this.scope, unit: target.value || undefined };
    this.scopeChange.emit(this.scope);
  }

  clearScope(): void {
    this.scope = {};
    this.scopeChange.emit(this.scope);
  }
}
