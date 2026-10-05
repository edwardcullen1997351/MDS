import { forwardRef, Optional, SkipSelf } from '@angular/core';
import { DsHeadingLevelProviderComponent } from '../typography/heading.component.js';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DsSplitViewRatio = '50/50' | '60/40' | '70/30' | '40/60' | '30/70';
export type DsSplitViewOrientation = 'horizontal' | 'vertical';
export type DsSplitViewPane = 'primary' | 'secondary';

@Component({
  selector: 'ds-split-view-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-split-view" [ngClass]="customClass">
      <header class="ds-split-view__header" aria-label="Workspace header">
        <ng-content select="[workspaceHeader]"></ng-content>
      </header>

      <!-- Responsive Mobile Tab Switcher -->
      <div class="ds-split-view__tabs" role="tablist" aria-label="Split view panes">
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="activePane === 'primary'"
          (click)="selectPane('primary')"
          [style.padding]="'6px 14px'"
          [style.borderRadius]="'6px'"
          [style.border]="activePane === 'primary' ? '1px solid #2563eb' : '1px solid #cbd5e1'"
          [style.background]="activePane === 'primary' ? '#eff6ff' : '#ffffff'"
          [style.color]="activePane === 'primary' ? '#1d4ed8' : '#475569'"
          [style.fontWeight]="600"
          [style.fontSize]="'13px'"
          [style.cursor]="'pointer'"
        >
          {{ primaryLabel }}
        </button>
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="activePane === 'secondary'"
          (click)="selectPane('secondary')"
          [style.padding]="'6px 14px'"
          [style.borderRadius]="'6px'"
          [style.border]="activePane === 'secondary' ? '1px solid #2563eb' : '1px solid #cbd5e1'"
          [style.background]="activePane === 'secondary' ? '#eff6ff' : '#ffffff'"
          [style.color]="activePane === 'secondary' ? '#1d4ed8' : '#475569'"
          [style.fontWeight]="600"
          [style.fontSize]="'13px'"
          [style.cursor]="'pointer'"
        >
          {{ secondaryLabel }}
        </button>
      </div>

      <div
        class="ds-split-view__panes"
        [style.gridTemplateColumns]="getGridColumns()"
        [style.gridTemplateRows]="getGridRows()"
      >
        <section
          class="ds-split-view__pane ds-split-view__pane--primary"
          [class.ds-split-view__pane--hidden]="activePane !== 'primary'"
          [attr.aria-label]="primaryLabel"
        >
          <ng-content select="[primaryPane]"></ng-content>
        </section>

        <section
          class="ds-split-view__pane ds-split-view__pane--secondary"
          [class.ds-split-view__pane--hidden]="activePane !== 'secondary'"
          [attr.aria-label]="secondaryLabel"
        >
          <ng-content select="[secondaryPane]"></ng-content>
        </section>
      </div>
    </div>
  `,
  styleUrls: ['./layout-templates.component.css'],
  providers: [{ provide: DsHeadingLevelProviderComponent, useExisting: forwardRef(() => DsSplitViewLayoutComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsSplitViewLayoutComponent extends DsHeadingLevelProviderComponent {
  constructor(@Optional() @SkipSelf() parent: DsHeadingLevelProviderComponent | null) { super(parent); }
  @Input() ratio: DsSplitViewRatio = '50/50';
  @Input() orientation: DsSplitViewOrientation = 'horizontal';
  @Input() activePane: DsSplitViewPane = 'primary';
  @Input() primaryLabel = 'Primary Pane';
  @Input() secondaryLabel = 'Secondary Pane';
  @Input() customClass = '';

  @Output() activePaneChange = new EventEmitter<DsSplitViewPane>();

  selectPane(pane: DsSplitViewPane): void {
    this.activePane = pane;
    this.activePaneChange.emit(pane);
  }

  getGridColumns(): string {
    if (this.orientation === 'vertical') return '1fr';
    const ratioMap: Record<DsSplitViewRatio, string> = {
      '50/50': '1fr 1fr',
      '60/40': '1.5fr 1fr',
      '70/30': '2.33fr 1fr',
      '40/60': '1fr 1.5fr',
      '30/70': '1fr 2.33fr',
    };
    return ratioMap[this.ratio];
  }

  getGridRows(): string {
    if (this.orientation === 'horizontal') return '1fr';
    const ratioMap: Record<DsSplitViewRatio, string> = {
      '50/50': '1fr 1fr',
      '60/40': '1.5fr 1fr',
      '70/30': '2.33fr 1fr',
      '40/60': '1fr 1.5fr',
      '30/70': '1fr 2.33fr',
    };
    return ratioMap[this.ratio];
  }
}
