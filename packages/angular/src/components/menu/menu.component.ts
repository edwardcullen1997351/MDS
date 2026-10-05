import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsFocusTrapDirective } from '../../utils/focus-trap.directive.js';

export interface MenuItemData {
  id: string;
  label: string;
  icon?: string;
  shortcut?: string;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

let nextMenuId = 0;

@Component({
  selector: 'ds-menu',
  standalone: true,
  imports: [CommonModule, DsFocusTrapDirective],
  template: `
    <div class="ds-menu-wrapper" [class]="customClass">
      <div
        #trigger
        role="button"
        tabindex="0"
        [id]="triggerId"
        aria-haspopup="menu"
        [attr.aria-expanded]="isOpen"
        [attr.aria-controls]="isOpen ? menuId : null"
        (click)="toggleMenu()"
        (keydown.enter)="toggleMenu()"
        (keydown.space)="toggleMenu()"
        (keydown.arrowdown)="openAndFocus()"
      >
        <ng-content select="[menu-trigger]"></ng-content>
      </div>

      <div
        [dsFocusTrap]="trigger"
        *ngIf="isOpen"
        role="menu"
        [id]="menuId"
        [attr.aria-labelledby]="triggerId"
        tabindex="-1"
        class="ds-menu-content"
        [class.ds-menu-content--align-end]="align === 'end'"
        (keydown.escape)="closeMenu()"
      >
        <ng-content></ng-content>
        <button
          *ngFor="let item of items"
          type="button"
          role="menuitem"
          [disabled]="item.disabled"
          [attr.aria-disabled]="item.disabled"
          (click)="onItemClick(item)"
          class="ds-menu-item"
          [class.ds-menu-item--danger]="item.variant === 'danger'"
        >
          <span class="ds-menu-item-main">
            {{ item.label }}
          </span>
          <span *ngIf="item.shortcut" class="ds-menu-item-shortcut">
            {{ item.shortcut }}
          </span>
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./menu.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsMenuComponent {
  @Input() items: MenuItemData[] = [];
  @Input() align: 'start' | 'end' = 'start';
  @Input() customClass = '';

  @Output() selectItem = new EventEmitter<MenuItemData>();

  isOpen = false;
  triggerId = `ds-menu-trigger-${++nextMenuId}`;
  menuId = `ds-menu-content-${nextMenuId}`;

  constructor(private elementRef: ElementRef) {}

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  openAndFocus(): void {
    this.isOpen = true;
  }

  closeMenu(): void {
    this.isOpen = false;
  }

  onItemClick(item: MenuItemData): void {
    if (item.disabled) return;
    this.selectItem.emit(item);
    this.closeMenu();
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeMenu();
    }
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.closeMenu();
    }
  }
}
