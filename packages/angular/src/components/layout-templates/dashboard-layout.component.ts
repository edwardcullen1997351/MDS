import { forwardRef, Optional, SkipSelf } from '@angular/core';
import { DsHeadingLevelProviderComponent } from '../typography/heading.component.js';
import { DsHeadingComponent } from '../typography/heading.component.js';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DsDashboardGap = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ds-dashboard-widget',
  standalone: true,
  imports: [CommonModule, DsHeadingComponent],
  template: `
    <div
      class="ds-dashboard-widget"
      [ngClass]="['ds-col-span-' + colSpan, customClass]"
    >
      <div *ngIf="title || hasActions" class="ds-dashboard-widget__header">
        <ds-heading *ngIf="title" size="base" customClass="ds-dashboard-widget__title">{{ title }}</ds-heading>
        <ng-content select="[title]"></ng-content>
        <div>
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>

      <div class="ds-dashboard-widget__body">
        <div *ngIf="isLoading" style="display: flex; flex-direction: column; gap: 10px;">
          <div style="height: 20px; width: 40%; background: #e2e8f0; border-radius: 4px;"></div>
          <div style="height: 80px; background: #e2e8f0; border-radius: 4px;"></div>
        </div>

        <div
          *ngIf="!isLoading && isError"
          style="padding: 16px; color: #dc2626; font-size: 13px; background: #fef2f2; border-radius: 6px;"
        >
          ⚠️ {{ errorMessage }}
        </div>

        <ng-container *ngIf="!isLoading && !isError">
          <ng-content></ng-content>
        </ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./layout-templates.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsDashboardWidgetComponent {
  @Input() colSpan = 4;
  @Input() title?: string;
  @Input() hasActions = false;
  @Input() isLoading = false;
  @Input() isError = false;
  @Input() errorMessage = 'Failed to load telemetry';
  @Input() customClass = '';
}

@Component({
  selector: 'ds-dashboard-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-dashboard" [ngClass]="customClass">
      <header class="ds-dashboard__header" aria-label="Dashboard controls">
        <ng-content select="[header]"></ng-content>
      </header>

      <section class="ds-dashboard__kpis" aria-label="Key performance indicators">
        <ng-content select="[kpiRow]"></ng-content>
      </section>

      <main
        class="ds-dashboard__grid"
        [class.ds-dashboard__grid--compact]="compactMode"
        aria-label="Dashboard widgets"
      >
        <ng-content></ng-content>
      </main>
    </div>
  `,
  styleUrls: ['./layout-templates.component.css'],
  providers: [{ provide: DsHeadingLevelProviderComponent, useExisting: forwardRef(() => DsDashboardLayoutComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsDashboardLayoutComponent extends DsHeadingLevelProviderComponent {
  constructor(@Optional() @SkipSelf() parent: DsHeadingLevelProviderComponent | null) { super(parent); }
  @Input() gap: DsDashboardGap = 'md';
  @Input() compactMode = false;
  @Input() customClass = '';
}
