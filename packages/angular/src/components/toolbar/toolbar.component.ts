import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      role="toolbar"
      [attr.aria-label]="ariaLabel || 'Toolbar'"
      class="ds-toolbar"
      [class.ds-toolbar--bulk-active]="selectedCount > 0"
      [class]="customClass"
      (keydown)="onToolbarKeyDown($event)"
    >
      <!-- Bulk Selection Mode -->
      <div *ngIf="selectedCount > 0" class="ds-toolbar__bulk-row">
        <div class="ds-toolbar__bulk-info">
          <span class="ds-toolbar__selection-pill">
            {{ selectedCount }} selected
          </span>
          <button
            type="button"
            class="ds-toolbar__deselect-btn"
            (click)="onClearSelection.emit()"
          >
            Deselect all
          </button>
        </div>
        <div class="ds-toolbar__bulk-actions">
          <ng-content select="[slot=bulk-actions]"></ng-content>
        </div>
      </div>

      <!-- Standard Controls Mode -->
      <div *ngIf="selectedCount === 0" class="ds-toolbar__standard-row">
        <div class="ds-toolbar__leading">
          <div class="ds-toolbar__search-slot">
            <ng-content select="[slot=search]"></ng-content>
          </div>
          <div class="ds-toolbar__filters-slot">
            <ng-content select="[slot=filters]"></ng-content>
          </div>
        </div>
        <div class="ds-toolbar__trailing">
          <ng-content select="[slot=actions]"></ng-content>
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./toolbar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsToolbarComponent {
  @Input() selectedCount = 0;
  @Input() ariaLabel = 'Actions toolbar';
  @Input() customClass = '';

  @Output() onClearSelection = new EventEmitter<void>();

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  /**
   * Implements roving tabIndex / arrow key navigation across child buttons, inputs, and controls.
   */
  onToolbarKeyDown(event: KeyboardEvent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return;
    }

    const host = this.elementRef.nativeElement;
    const focusableSelector =
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex="0"]';
    const focusableElements = Array.from(
      host.querySelectorAll<HTMLElement>(focusableSelector)
    );

    if (focusableElements.length === 0) return;

    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % focusableElements.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = focusableElements.length - 1;
    }

    event.preventDefault();
    focusableElements[nextIndex]?.focus();
  }
}
