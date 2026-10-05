import { forwardRef, Optional, SkipSelf } from '@angular/core';
import { DsHeadingLevelProviderComponent } from '../typography/heading.component.js';
import { DsHeadingComponent } from '../typography/heading.component.js';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DsMasterDetailLayoutState =
  | 'initial-empty'
  | 'item-selected'
  | 'detail-loading'
  | 'detail-error';

export type DsMasterDetailMobileView = 'master' | 'detail';

@Component({
  selector: 'ds-master-detail-layout',
  standalone: true,
  imports: [CommonModule, DsHeadingComponent],
  template: `
    <div
      class="ds-master-detail"
      [style.gridTemplateColumns]="masterWidth + ' minmax(0, 1fr)'"
      [ngClass]="customClass"
    >
      <section
        class="ds-master-detail__master"
        [class.ds-master-detail__master--hidden]="mobileView !== 'master'"
        aria-label="Master list"
      >
        <ng-content select="[master]"></ng-content>
      </section>

      <section
        class="ds-master-detail__detail"
        [class.ds-master-detail__detail--hidden]="mobileView !== 'detail'"
        aria-label="Detail inspector"
      >
        <!-- Loading State -->
        <div *ngIf="getEffectiveState() === 'detail-loading'">
          <ng-content select="[loadingState]"></ng-content>
          <div *ngIf="!hasCustomLoading" style="padding: 32px;">
            <div style="height: 32px; width: 60%; background: #e2e8f0; border-radius: 4px; margin-bottom: 16px;"></div>
            <div style="height: 120px; background: #e2e8f0; border-radius: 4px; margin-bottom: 16px;"></div>
            <div style="height: 200px; background: #e2e8f0; border-radius: 4px;"></div>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="getEffectiveState() === 'detail-error'">
          <ng-content select="[errorState]"></ng-content>
          <div *ngIf="!hasCustomError" style="padding: 32px; text-align: center;">
            <ds-heading size="lg" color="danger">Failed to load detail</ds-heading>
            <p style="color: #64748b; font-size: 14px;">Unable to retrieve member record from the plant server.</p>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="getEffectiveState() === 'initial-empty'">
          <ng-content select="[emptyState]"></ng-content>
          <div *ngIf="!hasCustomEmpty" class="ds-master-detail__empty">
            <div
              style="width: 48px; height: 48px; border-radius: 50%; background: #e2e8f0; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 20px;"
            >
              📋
            </div>
            <ds-heading size="base">
              {{ emptyTitle }}
            </ds-heading>
            <p style="font-size: 13px; color: #64748b; margin: 0; line-height: 1.5;">
              {{ emptyDescription }}
            </p>
          </div>
        </div>

        <!-- Selected Detail View -->
        <div *ngIf="getEffectiveState() === 'item-selected'">
          <ng-content select="[detail]"></ng-content>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./layout-templates.component.css'],
  providers: [{ provide: DsHeadingLevelProviderComponent, useExisting: forwardRef(() => DsMasterDetailLayoutComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsMasterDetailLayoutComponent extends DsHeadingLevelProviderComponent {
  constructor(@Optional() @SkipSelf() parent: DsHeadingLevelProviderComponent | null) { super(parent); }
  @Input() masterWidth = '380px';
  @Input() selectedId: string | number | null = null;
  @Input() layoutState?: DsMasterDetailLayoutState;
  @Input() mobileView: DsMasterDetailMobileView = 'master';
  @Input() emptyTitle = 'No item selected';
  @Input() emptyDescription = 'Select an item from the master list to inspect and edit details.';
  @Input() hasCustomLoading = false;
  @Input() hasCustomError = false;
  @Input() hasCustomEmpty = false;
  @Input() customClass = '';

  @Output() mobileViewChange = new EventEmitter<DsMasterDetailMobileView>();
  @Output() clearSelection = new EventEmitter<void>();

  getEffectiveState(): DsMasterDetailLayoutState {
    if (this.layoutState) return this.layoutState;
    return this.selectedId ? 'item-selected' : 'initial-empty';
  }
}
