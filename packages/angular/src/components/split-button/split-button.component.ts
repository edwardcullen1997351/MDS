import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsButtonComponent, ButtonVariant, ButtonSize } from '../button/index.js';
import { DsMenuComponent, MenuItemData } from '../menu/index.js';

@Component({
  selector: 'ds-split-button',
  standalone: true,
  imports: [CommonModule, DsButtonComponent, DsMenuComponent],
  template: `
    <div
      class="ds-split-button"
      [class.ds-split-button--primary]="variant === 'primary'"
      [class.ds-split-button--secondary]="variant === 'secondary'"
      [class.ds-split-button--outline]="variant === 'outline'"
      [class.ds-split-button--danger]="variant === 'danger'"
      [class]="customClass"
    >
      <button
        type="button"
        [disabled]="disabled"
        (click)="mainClick.emit($event)"
        class="ds-button ds-button--{{ variant }} ds-button--{{ size }} ds-button-main"
      >
        <ng-content></ng-content>
      </button>

      <ds-menu
        [items]="menuItems"
        [align]="menuAlign"
        (selectItem)="selectMenuItem.emit($event)"
      >
        <button
          menu-trigger
          type="button"
          [disabled]="disabled"
          class="ds-button ds-button--{{ variant }} ds-button--{{ size }} ds-split-button-trigger"
          aria-label="Open related actions"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </ds-menu>
    </div>
  `,
  styleUrls: ['./split-button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsSplitButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() menuItems: MenuItemData[] = [];
  @Input() menuAlign: 'start' | 'end' = 'end';
  @Input() customClass = '';

  @Output() mainClick = new EventEmitter<MouseEvent>();
  @Output() selectMenuItem = new EventEmitter<MenuItemData>();
}
