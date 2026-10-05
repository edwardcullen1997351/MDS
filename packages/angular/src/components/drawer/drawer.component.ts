import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectionStrategy,
  ViewChild, ElementRef, AfterViewChecked, OnDestroy,
  Inject, Optional, SkipSelf, forwardRef,
  ContentChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { useFocusTrap } from '../../utils/focus-trap.js';

export type DrawerPlacement = 'right' | 'left' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

let nextDrawerId = 0;

@Component({
  selector: 'ds-drawer-title',
  standalone: true,
  imports: [CommonModule],
  template: `<h2 [id]="drawer ? drawer.drawerId + '-title' : null" class="ds-drawer-title" [class]="customClass"><ng-content></ng-content></h2>`,
  styleUrls: ['./drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsDrawerTitleComponent {
  @Input() customClass = '';
  constructor(@Optional() @SkipSelf() @Inject(forwardRef(() => DsDrawerComponent)) public drawer: DsDrawerComponent | null) {}
}

@Component({
  selector: 'ds-drawer-description',
  standalone: true,
  imports: [CommonModule],
  template: `<p [id]="drawer ? drawer.drawerId + '-description' : null" class="ds-drawer-description" [class]="customClass"><ng-content></ng-content></p>`,
  styleUrls: ['./drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsDrawerDescriptionComponent {
  @Input() customClass = '';
  constructor(@Optional() @SkipSelf() @Inject(forwardRef(() => DsDrawerComponent)) public drawer: DsDrawerComponent | null) {}
}

@Component({
  selector: 'ds-drawer-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-drawer-header" [class]="customClass">
      <div class="ds-drawer-header-main">
        <ng-content></ng-content>
      </div>
      <button
        *ngIf="showClose"
        type="button"
        class="ds-drawer-close"
        (click)="close.emit()"
        aria-label="Close drawer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `,
  styleUrls: ['./drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsDrawerHeaderComponent {
  @Input() showClose = true;
  @Input() customClass = '';
  @Output() close = new EventEmitter<void>();
}

@Component({
  selector: 'ds-drawer-body',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="ds-drawer-body" [class]="customClass"><ng-content></ng-content></div>`,
  styleUrls: ['./drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsDrawerBodyComponent {
  @Input() customClass = '';
}

@Component({
  selector: 'ds-drawer-footer',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="ds-drawer-footer" [class]="customClass"><ng-content></ng-content></div>`,
  styleUrls: ['./drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsDrawerFooterComponent {
  @Input() customClass = '';
}

@Component({
  selector: 'ds-drawer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #backdrop
      class="ds-drawer-backdrop"
      [class.ds-drawer-backdrop--open]="open"
      (click)="onBackdropClick()"
      aria-hidden="true"
    ></div>
    <div
      #panel
      role="dialog"
      [attr.aria-modal]="open ? 'true' : null"
      [attr.aria-hidden]="open ? null : 'true'"
      [attr.inert]="open ? null : ''"
      tabindex="-1"
      [attr.aria-label]="ariaLabel || null"
      [attr.aria-labelledby]="ariaLabel || !drawerTitle ? null : (drawerId + '-title')"
      [attr.aria-describedby]="drawerDescription ? drawerId + '-description' : null"
      class="ds-drawer-panel"
      [class.ds-drawer-panel--right]="placement === 'right'"
      [class.ds-drawer-panel--left]="placement === 'left'"
      [class.ds-drawer-panel--top]="placement === 'top'"
      [class.ds-drawer-panel--bottom]="placement === 'bottom'"
      [class.ds-drawer-panel--size-sm]="size === 'sm'"
      [class.ds-drawer-panel--size-md]="size === 'md'"
      [class.ds-drawer-panel--size-lg]="size === 'lg'"
      [class.ds-drawer-panel--size-full]="size === 'full'"
      [class.ds-drawer-panel--open]="open"
      [class]="customClass"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./drawer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsDrawerComponent implements AfterViewChecked, OnDestroy {
  @ContentChild(DsDrawerTitleComponent, { descendants: true }) drawerTitle?: DsDrawerTitleComponent;
  @ContentChild(DsDrawerDescriptionComponent, { descendants: true }) drawerDescription?: DsDrawerDescriptionComponent;
  @ViewChild('panel') panel?: ElementRef<HTMLElement>;
  @ViewChild('backdrop') backdrop?: ElementRef<HTMLElement>;
  private releaseFocus?: () => void;
  @Input() open = false;
  @Input() ariaLabel?: string;
  @Input() placement: DrawerPlacement = 'right';
  @Input() size: DrawerSize = 'md';
  @Input() closeOnEsc = true;
  @Input() closeOnBackdropClick = true;
  @Input() customClass = '';

  @Output() openChange = new EventEmitter<boolean>();

  drawerId = `ds-drawer-${++nextDrawerId}`;

  ngAfterViewChecked(): void {
    if (this.open && this.panel && !this.releaseFocus) this.releaseFocus = useFocusTrap(this.panel.nativeElement, this.backdrop ? [this.backdrop.nativeElement] : []);
    if (!this.open && this.releaseFocus) { this.releaseFocus(); this.releaseFocus = undefined; }
  }

  ngOnDestroy(): void { this.releaseFocus?.(); }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.open && this.closeOnEsc) {
      this.close();
    }
  }

  onBackdropClick(): void {
    if (this.closeOnBackdropClick) {
      this.close();
    }
  }

  close(): void {
    this.open = false;
    this.releaseFocus?.();
    this.releaseFocus = undefined;
    this.openChange.emit(false);
  }
}
