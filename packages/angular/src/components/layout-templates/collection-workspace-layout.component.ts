import { forwardRef, Optional, SkipSelf } from '@angular/core';
import { DsHeadingLevelProviderComponent } from '../typography/heading.component.js';
import { DsHeadingComponent } from '../typography/heading.component.js';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DsCollectionWorkspaceLayoutState =
  | 'idle'
  | 'loading'
  | 'empty'
  | 'no-matches'
  | 'error';

@Component({
  selector: 'ds-collection-workspace-layout',
  standalone: true,
  imports: [CommonModule, DsHeadingComponent],
  template: `
    <div class="ds-collection-workspace" [ngClass]="customClass">
      <header class="ds-collection-workspace__scope-header" aria-label="Collection scope">
        <ng-content select="[scopeHeader]"></ng-content>
      </header>

      <div class="ds-collection-workspace__toolbar" role="toolbar" aria-label="Collection toolbar">
        <ng-content select="[toolbar]"></ng-content>
      </div>

      <div
        *ngIf="selectedCount > 0"
        class="ds-collection-workspace__selection-bar"
        role="region"
        aria-label="Batch actions"
      >
        <ng-content select="[selectionBar]"></ng-content>
      </div>

      <main class="ds-collection-workspace__content" aria-label="Collection data">
        <!-- Loading State -->
        <div *ngIf="layoutState === 'loading'">
          <ng-content select="[loadingState]"></ng-content>
          <div *ngIf="!hasCustomLoading" style="padding: 32px;">
            <div style="height: 40px; background: #f1f5f9; border-radius: 4px; margin-bottom: 12px;"></div>
            <div style="height: 40px; background: #f8fafc; border-radius: 4px; margin-bottom: 8px;"></div>
            <div style="height: 40px; background: #f8fafc; border-radius: 4px; margin-bottom: 8px;"></div>
            <div style="height: 40px; background: #f8fafc; border-radius: 4px;"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="layoutState === 'empty'">
          <ng-content select="[emptyState]"></ng-content>
          <div *ngIf="!hasCustomEmpty" style="padding: 64px 24px; text-align: center;">
            <ds-heading size="base">No items in this collection</ds-heading>
            <p style="font-size: 13px; color: #64748b;">Create a new item to get started.</p>
          </div>
        </div>

        <!-- No Matches State -->
        <div *ngIf="layoutState === 'no-matches'">
          <ng-content select="[noMatchesState]"></ng-content>
          <div *ngIf="!hasCustomNoMatches" style="padding: 64px 24px; text-align: center;">
            <ds-heading size="base">No matching records found</ds-heading>
            <p style="font-size: 13px; color: #64748b;">Try clearing filters or changing search keywords.</p>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="layoutState === 'error'">
          <ng-content select="[errorState]"></ng-content>
          <div *ngIf="!hasCustomError" style="padding: 48px 24px; text-align: center; color: #dc2626;">
            <ds-heading size="base">Failed to load collection</ds-heading>
            <p style="font-size: 13px; color: #64748b;">The connection to the plant data server timed out.</p>
          </div>
        </div>

        <!-- Default Content -->
        <div *ngIf="layoutState === 'idle'">
          <ng-content></ng-content>
        </div>
      </main>

      <!-- Filter Drawer -->
      <aside
        *ngIf="isDrawerFilterOpen"
        style="position: fixed; top: 0; right: 0; bottom: 0; width: 360px; background: #ffffff; border-left: 1px solid #e2e8f0; box-shadow: -4px 0 16px rgba(0,0,0,0.1); z-index: 50; padding: 24px; overflow-y: auto;"
        aria-label="Filter panel"
      >
        <ng-content select="[filterDrawer]"></ng-content>
      </aside>

      <footer
        class="ds-collection-workspace__footer"
        [class.ds-collection-workspace__footer--sticky]="isStickyFooter"
        aria-label="Collection pagination and status"
      >
        <ng-content select="[footer]"></ng-content>
      </footer>
    </div>
  `,
  styleUrls: ['./layout-templates.component.css'],
  providers: [{ provide: DsHeadingLevelProviderComponent, useExisting: forwardRef(() => DsCollectionWorkspaceLayoutComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsCollectionWorkspaceLayoutComponent extends DsHeadingLevelProviderComponent {
  constructor(@Optional() @SkipSelf() parent: DsHeadingLevelProviderComponent | null) { super(parent); }
  @Input() selectedCount = 0;
  @Input() isStickyFooter = true;
  @Input() layoutState: DsCollectionWorkspaceLayoutState = 'idle';
  @Input() isDrawerFilterOpen = false;
  @Input() hasCustomLoading = false;
  @Input() hasCustomEmpty = false;
  @Input() hasCustomNoMatches = false;
  @Input() hasCustomError = false;
  @Input() customClass = '';
}
