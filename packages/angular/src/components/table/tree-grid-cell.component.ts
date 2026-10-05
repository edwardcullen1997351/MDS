import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-tree-grid-cell',
  standalone: true,
  imports: [CommonModule],
  template: `
    <td
      class="ds-table-cell"
      [class]="customClass"
    >
      <div
        class="ds-tree-grid-cell"
        [style.--ds-indent-level]="level"
      >
        <button
          *ngIf="hasChildren; else spacer"
          type="button"
          class="ds-tree-grid-cell__toggle"
          [class.ds-tree-grid-cell__toggle--expanded]="expanded"
          (click)="onToggleClick($event)"
          (keydown)="onKeyDown($event)"
          [attr.aria-label]="accessibleToggleLabel"
          [attr.aria-expanded]="expanded"
          tabindex="0"
        >
          ▶
        </button>
        <ng-template #spacer>
          <span class="ds-tree-grid-cell__toggle-spacer" aria-hidden="true"></span>
        </ng-template>

        <div class="ds-tree-grid-cell__content">
          <ng-content></ng-content>
        </div>
      </div>
    </td>
  `,
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTreeGridCellComponent {
  @Input() level = 0;
  @Input() expanded = false;
  @Input() hasChildren = false;
  @Input() toggleLabel = '';
  @Input() customClass = '';

  @Output() toggle = new EventEmitter<boolean>();

  get accessibleToggleLabel(): string {
    if (this.toggleLabel) return this.toggleLabel;
    return this.expanded
      ? `Collapse level ${this.level + 1} branch`
      : `Expand level ${this.level + 1} branch`;
  }

  onToggleClick(event: MouseEvent): void {
    event.stopPropagation();
    this.expanded = !this.expanded;
    this.toggle.emit(this.expanded);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (!this.hasChildren) return;
    if (event.key === 'ArrowRight' && !this.expanded) {
      event.preventDefault();
      this.expanded = true;
      this.toggle.emit(true);
    } else if (event.key === 'ArrowLeft' && this.expanded) {
      event.preventDefault();
      this.expanded = false;
      this.toggle.emit(false);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.expanded = !this.expanded;
      this.toggle.emit(this.expanded);
    }
  }
}
