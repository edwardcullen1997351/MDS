import { Component, Input, ChangeDetectionStrategy, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-command-toolbar-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      #toolbar
      class="ds-command-toolbar ds-command-toolbar--{{ density }}"
      [class]="customClass"
      role="toolbar"
      aria-orientation="horizontal"
      [attr.aria-label]="ariaLabel"
      (focusin)="onFocus($event)"
      (keydown)="onKeyDown($event)"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./command-toolbar-group.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsCommandToolbarGroupComponent implements AfterViewInit, OnDestroy {
  @ViewChild('toolbar') toolbar?: ElementRef<HTMLElement>;
  @Input() density: 'compact' | 'default' = 'compact';
  @Input() ariaLabel: string = 'Workbench Command Toolbar';
  @Input() customClass: string = '';

  private activeControl: HTMLElement | null = null;
  private observer?: MutationObserver;

  private getControls(): HTMLElement[] {
    const toolbar = this.toolbar?.nativeElement;
    if (!toolbar) return [];
    return Array.from(toolbar.querySelectorAll<HTMLElement>('button, [role="button"]'))
      .filter((control) => control.closest('[role="toolbar"]') === toolbar &&
        !control.matches(':disabled, [aria-disabled="true"]'));
  }

  private syncTabStops(): void {
    const controls = this.getControls();
    if (!this.activeControl || !controls.includes(this.activeControl)) {
      this.activeControl = controls[0] ?? null;
    }
    controls.forEach((control) => {
      const nextTabIndex = control === this.activeControl ? 0 : -1;
      if (control.tabIndex !== nextTabIndex) control.tabIndex = nextTabIndex;
    });
  }

  ngAfterViewInit(): void {
    this.syncTabStops();
    if (typeof MutationObserver === 'undefined' || !this.toolbar) return;
    this.observer = new MutationObserver(() => this.syncTabStops());
    this.observer.observe(this.toolbar.nativeElement, {
      childList: true, subtree: true, attributes: true,
      attributeFilter: ['disabled', 'aria-disabled', 'tabindex'],
    });
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }

  onFocus(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    if (this.getControls().includes(target)) {
      this.activeControl = target;
      this.syncTabStops();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const controls = this.getControls();
    const index = controls.indexOf(event.target as HTMLElement);
    if (index < 0 || controls.length < 2) return;
    const rtl = getComputedStyle(this.toolbar!.nativeElement).direction === 'rtl';
    let next = index;
    if (event.key === 'ArrowRight') next = (index + (rtl ? -1 : 1) + controls.length) % controls.length;
    else if (event.key === 'ArrowLeft') next = (index + (rtl ? 1 : -1) + controls.length) % controls.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = controls.length - 1;
    else return;
    event.preventDefault();
    this.activeControl = controls[next];
    this.syncTabStops();
    controls[next].focus();
  }
}
