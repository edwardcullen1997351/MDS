import { forwardRef, Optional, SkipSelf } from '@angular/core';
import { DsHeadingLevelProviderComponent } from '../typography/heading.component.js';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DsSidebarPosition = 'start' | 'end';

@Component({
  selector: 'ds-sidebar-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-sidebar-layout" [ngClass]="customClass">
      <header class="ds-sidebar-layout__header" aria-label="Page header">
        <ng-content select="[header]"></ng-content>
      </header>

      <div
        class="ds-sidebar-layout__body"
        [style.gridTemplateColumns]="getGridColumns()"
      >
        <aside
          *ngIf="sidebarPosition === 'start'"
          class="ds-sidebar-layout__sidebar"
          [class.ds-sidebar-layout__sidebar--collapsed]="isCollapsed"
          [attr.aria-label]="sidebarAriaLabel"
        >
          <ng-content select="[sidebar]"></ng-content>
        </aside>

        <main class="ds-sidebar-layout__main" [attr.aria-label]="mainAriaLabel">
          <ng-content></ng-content>
        </main>

        <aside
          *ngIf="sidebarPosition === 'end'"
          class="ds-sidebar-layout__sidebar ds-sidebar-layout__sidebar--end"
          [class.ds-sidebar-layout__sidebar--collapsed]="isCollapsed"
          [attr.aria-label]="sidebarAriaLabel"
        >
          <ng-content select="[sidebar]"></ng-content>
        </aside>
      </div>
    </div>
  `,
  styleUrls: ['./layout-templates.component.css'],
  providers: [{ provide: DsHeadingLevelProviderComponent, useExisting: forwardRef(() => DsSidebarLayoutComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsSidebarLayoutComponent extends DsHeadingLevelProviderComponent {
  constructor(@Optional() @SkipSelf() parent: DsHeadingLevelProviderComponent | null) { super(parent); }
  @Input() sidebarPosition: DsSidebarPosition = 'start';
  @Input() sidebarWidth = '320px';
  @Input() isCollapsed = false;
  @Input() minMainWidth = '560px';
  @Input() sidebarAriaLabel = 'Sidebar context';
  @Input() mainAriaLabel = 'Main workspace';
  @Input() customClass = '';

  @Output() toggleCollapse = new EventEmitter<boolean>();

  getGridColumns(): string {
    if (this.isCollapsed) {
      return '1fr';
    }
    return this.sidebarPosition === 'start'
      ? `${this.sidebarWidth} minmax(${this.minMainWidth}, 1fr)`
      : `minmax(${this.minMainWidth}, 1fr) ${this.sidebarWidth}`;
  }
}
