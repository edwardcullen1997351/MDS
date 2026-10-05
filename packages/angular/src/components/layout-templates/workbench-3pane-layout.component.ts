import { forwardRef, Inject, Optional, SkipSelf } from '@angular/core';
import { DsHeadingLevelProviderComponent } from '../typography/heading.component.js';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-workbench-3pane-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ds-workbench-3pane ds-workbench-3pane--mobile-{{ mobileMode }}"
      [class]="customClass"
      [class.ds-workbench-3pane--tab-page-scroll]="pageScrollOnTabs && mobileMode === 'tabs'"
      [style.--ds-wb-nav-width]="resolvedNavWidth"
      [style.--ds-wb-inspector-width]="resolvedInspectorWidth"
    >
      <header
        class="ds-workbench-3pane__header"
        aria-label="Workbench header"
      >
        <ng-content select="[workspaceHeader]"></ng-content>
      </header>

      <!-- NotebookLM-style Mobile Top Tab Bar -->
      <nav
        *ngIf="mobileMode === 'tabs'"
        class="ds-workbench-mobile-tabs"
        role="tablist"
        aria-label="Workspace views"
      >
        <button
          type="button"
          role="tab"
          id="ds-tab-nav"
          class="ds-workbench-mobile-tab"
          [class.ds-workbench-mobile-tab--active]="resolvedMobileTab === 'nav'"
          [attr.aria-selected]="resolvedMobileTab === 'nav'"
          aria-controls="ds-panel-nav"
          (click)="selectMobileTab('nav')"
        >
          <span class="ds-workbench-mobile-tab__icon" aria-hidden="true">☰</span>
          <span class="ds-workbench-mobile-tab__text">Resources</span>
        </button>

        <button
          type="button"
          role="tab"
          id="ds-tab-main"
          class="ds-workbench-mobile-tab"
          [class.ds-workbench-mobile-tab--active]="resolvedMobileTab === 'main'"
          [attr.aria-selected]="resolvedMobileTab === 'main'"
          aria-controls="ds-panel-main"
          (click)="selectMobileTab('main')"
        >
          <span class="ds-workbench-mobile-tab__icon" aria-hidden="true">📊</span>
          <span class="ds-workbench-mobile-tab__text">Schedule</span>
        </button>

        <button
          type="button"
          role="tab"
          id="ds-tab-inspector"
          class="ds-workbench-mobile-tab"
          [class.ds-workbench-mobile-tab--active]="resolvedMobileTab === 'inspector'"
          [attr.aria-selected]="resolvedMobileTab === 'inspector'"
          aria-controls="ds-panel-inspector"
          (click)="selectMobileTab('inspector')"
        >
          <span class="ds-workbench-mobile-tab__icon" aria-hidden="true">📋</span>
          <span class="ds-workbench-mobile-tab__text">Inspector</span>
        </button>
      </nav>

      <div
        class="ds-workbench-3pane__body"
        [class.ds-workbench-3pane__body--nav-collapsed]="navCollapsed && !inspectorCollapsed"
        [class.ds-workbench-3pane__body--inspector-collapsed]="!navCollapsed && inspectorCollapsed"
        [class.ds-workbench-3pane__body--both-collapsed]="navCollapsed && inspectorCollapsed"
        [class.ds-workbench-3pane__body--tab-nav]="resolvedMobileTab === 'nav'"
        [class.ds-workbench-3pane__body--tab-main]="resolvedMobileTab === 'main'"
        [class.ds-workbench-3pane__body--tab-inspector]="resolvedMobileTab === 'inspector'"
        [class.ds-workbench-3pane__body--resizing]="isDraggingNav || isDraggingInspector"
      >
        <!-- Left Navigation / Time Horizon / Hierarchy Pane -->
        <nav
          class="ds-workbench-3pane__nav"
          [class.ds-workbench-3pane__nav--open]="isNavOpen"
          [attr.aria-label]="navLabel"
          [attr.aria-hidden]="navCollapsed && !isNavOpen"
        >
          <div id="ds-panel-nav" [attr.role]="mobileMode === 'tabs' ? 'tabpanel' : null" [attr.aria-labelledby]="mobileMode === 'tabs' ? 'ds-tab-nav' : null" class="ds-workbench-3pane__nav-content">
            <ng-content select="[navPane]"></ng-content>
          </div>
        </nav>

        <!-- Draggable Splitter (Nav) -->
        <div
          *ngIf="enableResize && !navCollapsed"
          role="separator"
          tabindex="0"
          aria-orientation="vertical"
          aria-label="Resize Horizon & Resources Panel"
          [attr.aria-valuenow]="navWidthPx || 280"
          [attr.aria-valuemin]="navMinWidth"
          [attr.aria-valuemax]="navMaxWidth"
          class="ds-workbench-splitter ds-workbench-splitter--nav"
          [class.ds-workbench-splitter--dragging]="isDraggingNav"
          (pointerdown)="startNavDrag($event)"
          (dblclick)="resetNavWidth()"
          (keydown)="handleNavKeyDown($event)"
          title="Drag to resize panel · Double-click to reset"
        ></div>

        <div
          *ngIf="mobileMode === 'drawer' && isNavOpen"
          class="ds-workbench-3pane__backdrop"
          (click)="closeNav()"
          aria-hidden="true"
        ></div>

        <!-- Central Main Matrix Work Surface -->
        <main
          class="ds-workbench-3pane__center"
          [attr.aria-label]="mainLabel"
        >
          <!-- §GB-3a: Authoritative center scroll track -->
          <div id="ds-panel-main" [attr.role]="mobileMode === 'tabs' ? 'tabpanel' : null" [attr.aria-labelledby]="mobileMode === 'tabs' ? 'ds-tab-main' : null" class="ds-workbench-3pane__center-content">
            <ng-content select="[mainPane]"></ng-content>
          </div>
        </main>

        <!-- Draggable Splitter (Inspector) -->
        <div
          *ngIf="enableResize && !inspectorCollapsed"
          role="separator"
          tabindex="0"
          aria-orientation="vertical"
          aria-label="Resize Record Inspector Panel"
          [attr.aria-valuenow]="inspectorWidthPx || 360"
          [attr.aria-valuemin]="inspectorMinWidth"
          [attr.aria-valuemax]="inspectorMaxWidth"
          class="ds-workbench-splitter ds-workbench-splitter--inspector"
          [class.ds-workbench-splitter--dragging]="isDraggingInspector"
          (pointerdown)="startInspectorDrag($event)"
          (dblclick)="resetInspectorWidth()"
          (keydown)="handleInspectorKeyDown($event)"
          title="Drag to resize inspector · Double-click to reset"
        ></div>

        <!-- Right Contextual Inspector / Reschedule Pane -->
        <aside
          class="ds-workbench-3pane__inspector"
          [class.ds-workbench-3pane__inspector--open]="isInspectorOpen"
          [attr.aria-label]="inspectorLabel"
          [attr.aria-hidden]="inspectorCollapsed && !isInspectorOpen"
        >
          <div id="ds-panel-inspector" [attr.role]="mobileMode === 'tabs' ? 'tabpanel' : null" [attr.aria-labelledby]="mobileMode === 'tabs' ? 'ds-tab-inspector' : null" class="ds-workbench-3pane__inspector-content">
            <ng-content select="[inspectorPane]"></ng-content>
          </div>
        </aside>

        <div
          *ngIf="mobileMode === 'drawer' && isInspectorOpen"
          class="ds-workbench-3pane__backdrop"
          (click)="closeInspector()"
          aria-hidden="true"
        ></div>
      </div>
    </div>
  `,
  styleUrls: ['./layout-templates.component.css'],
  providers: [{ provide: DsHeadingLevelProviderComponent, useExisting: forwardRef(() => DsWorkbench3PaneLayoutComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsWorkbench3PaneLayoutComponent extends DsHeadingLevelProviderComponent {
  constructor(@Optional() @SkipSelf() @Inject(DsHeadingLevelProviderComponent) parent: DsHeadingLevelProviderComponent | null) { super(parent); }
  @Input() navCollapsed = false;
  @Input() inspectorCollapsed = false;
  @Input() showEdgeToggles = true;
  @Input() enableResize = true;
  @Input() navMinWidth = 200;
  @Input() navMaxWidth = 480;
  @Input() inspectorMinWidth = 280;
  @Input() inspectorMaxWidth = 560;

  @Input() mobileMode: 'tabs' | 'drawer' = 'tabs';
  @Input() pageScrollOnTabs = false;
  @Input() activeMobileTab: 'nav' | 'main' | 'inspector' = 'main';

  @Input() isNavOpen = false;
  @Input() isInspectorOpen = false;

  @Input() navLabel = 'Planning Navigation';
  @Input() mainLabel = 'Planning Matrix Work Surface';
  @Input() inspectorLabel = 'Record Inspector';

  @Input() navWidth: string | null = null;
  @Input() inspectorWidth: string | null = null;
  @Input() customClass = '';

  @Output() navOpenChange = new EventEmitter<boolean>();
  @Output() inspectorOpenChange = new EventEmitter<boolean>();
  @Output() navCollapsedChange = new EventEmitter<boolean>();
  @Output() inspectorCollapsedChange = new EventEmitter<boolean>();
  @Output() mobileTabChange = new EventEmitter<'nav' | 'main' | 'inspector'>();
  @Output() navWidthChange = new EventEmitter<number>();
  @Output() inspectorWidthChange = new EventEmitter<number>();

  navWidthPx: number | null = null;
  inspectorWidthPx: number | null = null;
  isDraggingNav = false;
  isDraggingInspector = false;

  get resolvedNavWidth(): string {
    return this.navWidthPx ? `${this.navWidthPx}px` : (this.navWidth || '280px');
  }

  get resolvedInspectorWidth(): string {
    return this.inspectorWidthPx ? `${this.inspectorWidthPx}px` : (this.inspectorWidth || '360px');
  }

  get resolvedMobileTab(): 'nav' | 'main' | 'inspector' {
    if (this.isNavOpen) return 'nav';
    if (this.isInspectorOpen) return 'inspector';
    return this.activeMobileTab;
  }

  selectMobileTab(tab: 'nav' | 'main' | 'inspector'): void {
    this.activeMobileTab = tab;
    this.mobileTabChange.emit(tab);
    if (tab === 'nav') {
      this.isNavOpen = true;
      this.isInspectorOpen = false;
      this.navOpenChange.emit(true);
      this.inspectorOpenChange.emit(false);
    } else if (tab === 'inspector') {
      this.isInspectorOpen = true;
      this.isNavOpen = false;
      this.inspectorOpenChange.emit(true);
      this.navOpenChange.emit(false);
    } else {
      this.isNavOpen = false;
      this.isInspectorOpen = false;
      this.navOpenChange.emit(false);
      this.inspectorOpenChange.emit(false);
    }
  }

  @HostListener('window:keydown.escape')
  handleEscape(): void {
    if (this.isNavOpen) {
      this.closeNav();
    }
    if (this.isInspectorOpen) {
      this.closeInspector();
    }
    if (this.activeMobileTab !== 'main') {
      this.selectMobileTab('main');
    }
  }

  toggleNavCollapsed(): void {
    this.navCollapsed = !this.navCollapsed;
    this.navCollapsedChange.emit(this.navCollapsed);
  }

  toggleInspectorCollapsed(): void {
    this.inspectorCollapsed = !this.inspectorCollapsed;
    this.inspectorCollapsedChange.emit(this.inspectorCollapsed);
  }

  closeNav(): void {
    this.isNavOpen = false;
    this.navOpenChange.emit(false);
  }

  closeInspector(): void {
    this.isInspectorOpen = false;
    this.inspectorOpenChange.emit(false);
  }

  startNavDrag(event: PointerEvent): void {
    event.preventDefault();
    this.isDraggingNav = true;
  }

  resetNavWidth(): void {
    this.navWidthPx = null;
    this.navWidthChange.emit(280);
  }

  startInspectorDrag(event: PointerEvent): void {
    event.preventDefault();
    this.isDraggingInspector = true;
  }

  resetInspectorWidth(): void {
    this.inspectorWidthPx = null;
    this.inspectorWidthChange.emit(360);
  }

  @HostListener('document:pointerup')
  onPointerUp(): void {
    this.isDraggingNav = false;
    this.isDraggingInspector = false;
  }

  handleNavKeyDown(e: KeyboardEvent): void {
    const current = this.navWidthPx || 280;
    if (e.key === 'ArrowLeft') {
      const next = Math.max(this.navMinWidth, current - 16);
      this.navWidthPx = next;
      this.navWidthChange.emit(next);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      const next = Math.min(this.navMaxWidth, current + 16);
      this.navWidthPx = next;
      this.navWidthChange.emit(next);
      e.preventDefault();
    } else if (e.key === 'Home') {
      this.navWidthPx = this.navMinWidth;
      this.navWidthChange.emit(this.navMinWidth);
      e.preventDefault();
    } else if (e.key === 'End') {
      this.navWidthPx = this.navMaxWidth;
      this.navWidthChange.emit(this.navMaxWidth);
      e.preventDefault();
    }
  }

  handleInspectorKeyDown(e: KeyboardEvent): void {
    const current = this.inspectorWidthPx || 360;
    if (e.key === 'ArrowLeft') {
      const next = Math.min(this.inspectorMaxWidth, current + 16);
      this.inspectorWidthPx = next;
      this.inspectorWidthChange.emit(next);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      const next = Math.max(this.inspectorMinWidth, current - 16);
      this.inspectorWidthPx = next;
      this.inspectorWidthChange.emit(next);
      e.preventDefault();
    } else if (e.key === 'Home') {
      this.inspectorWidthPx = this.inspectorMaxWidth;
      this.inspectorWidthChange.emit(this.inspectorMaxWidth);
      e.preventDefault();
    } else if (e.key === 'End') {
      this.inspectorWidthPx = this.inspectorMinWidth;
      this.inspectorWidthChange.emit(this.inspectorMinWidth);
      e.preventDefault();
    }
  }
}
