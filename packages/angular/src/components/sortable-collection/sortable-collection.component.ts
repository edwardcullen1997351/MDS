import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  TemplateRef,
  ContentChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SortableItemState {
  index: number;
  position: number;
  total: number;
  grabbed: boolean;
  proposedIndex: number | null;
  immovable: string | null;
}

export type LegalityResult = true | string | false;

let nextSortableId = 0;

@Component({
  selector: 'ds-sortable-collection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-sortable-collection-wrapper" [class]="customClass">
      <!-- Live Region for screen-reader announcements -->
      <div
        *ngIf="liveRegion"
        [id]="liveRegionId"
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        class="ds-sortable-sr-only"
      >
        {{ announcement }}
      </div>

      <span [id]="instrId" class="ds-sortable-sr-only">
        Press Space or Enter to grab item, Arrow keys to move candidate position, Enter or Space to commit drop, Escape to cancel.
      </span>

      <ul
        role="list"
        [attr.aria-label]="label"
        class="ds-sortable-collection"
        [class.ds-sortable-collection--sm]="size === 'sm'"
        [class.ds-sortable-collection--md]="size === 'md'"
        [class.ds-sortable-collection--lg]="size === 'lg'"
        [class.ds-sortable-collection--disabled]="disabled"
      >
        <ng-container *ngFor="let id of items; let index = index">
          <!-- Proposed Drop Indicator Line (before item) -->
          <li
            *ngIf="isGrabbedActive && proposedIndex === index && grabbedIndex !== null && proposedIndex <= index && grabbedId !== id"
            class="ds-sortable-drop-indicator"
            aria-hidden="true"
          >
            <span class="ds-sortable-drop-pill"></span>
          </li>

          <li
            role="listitem"
            aria-roledescription="sortable item"
            [attr.aria-grabbed]="grabbedId === id"
            [attr.aria-describedby]="instrId"
            class="ds-sortable-item"
            [class.ds-sortable-item--grabbed]="grabbedId === id"
            [class.ds-sortable-item--immovable]="isImmovable(id)"
            [draggable]="!disabled && !isImmovable(id)"
            (dragstart)="onDragStart($event, id, index)"
            (dragover)="onDragOver($event, index)"
            (drop)="onDragDrop($event, index)"
            (dragend)="onDragEnd()"
          >
            <div class="ds-sortable-item-row">
              <!-- Grab Handle -->
              <div
                *ngIf="moveControls !== 'none'"
                role="button"
                [attr.tabindex]="disabled || isImmovable(id) ? -1 : 0"
                [attr.aria-disabled]="disabled || isImmovable(id)"
                [attr.aria-label]="'Reorder ' + getItemName(id) + ', position ' + (index + 1) + ' of ' + items.length"
                [title]="isImmovable(id) ? (getImmovableReason(id) || 'Pinned') : ('Grab and drag ' + getItemName(id))"
                class="ds-sortable-handle"
                [draggable]="!disabled && !isImmovable(id)"
                (dragstart)="$event.stopPropagation(); onDragStart($event, id, index)"
                (dragend)="onDragEnd()"
                (keydown)="onHandleKeyDown($event, id, index)"
                (click)="$event.stopPropagation(); onHandleClick(id, index)"
              >
                <span class="ds-sortable-handle-icon" aria-hidden="true">⠿</span>
              </div>

              <!-- Item Content Template or Fallback Text -->
              <div class="ds-sortable-item-content">
                <ng-container
                  *ngIf="itemTemplate; else defaultContent"
                  [ngTemplateOutlet]="itemTemplate"
                  [ngTemplateOutletContext]="{ $implicit: id, state: getItemState(id, index) }"
                ></ng-container>
                <ng-template #defaultContent>
                  <span class="ds-sortable-item-fallback">{{ getItemName(id) }}</span>
                </ng-template>
              </div>

              <!-- Steppers -->
              <div *ngIf="moveControls === 'handle-and-steppers'" class="ds-sortable-steppers">
                <button
                  type="button"
                  [disabled]="disabled || isImmovable(id) || index === 0"
                  [attr.aria-label]="'Move ' + getItemName(id) + ' earlier'"
                  title="Move earlier"
                  (click)="$event.stopPropagation(); handleStep(id, index, 'up')"
                  class="ds-sortable-stepper-btn"
                >
                  ▲
                </button>
                <button
                  type="button"
                  [disabled]="disabled || isImmovable(id) || index === items.length - 1"
                  [attr.aria-label]="'Move ' + getItemName(id) + ' later'"
                  title="Move later"
                  (click)="$event.stopPropagation(); handleStep(id, index, 'down')"
                  class="ds-sortable-stepper-btn"
                >
                  ▼
                </button>
              </div>
            </div>
          </li>

          <!-- Proposed Drop Indicator Line (after item) -->
          <li
            *ngIf="isGrabbedActive && proposedIndex === index && grabbedIndex !== null && proposedIndex > index && grabbedId !== id"
            class="ds-sortable-drop-indicator"
            aria-hidden="true"
          >
            <span class="ds-sortable-drop-pill"></span>
          </li>
        </ng-container>
      </ul>
    </div>
  `,
  styleUrls: ['./sortable-collection.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsSortableCollectionComponent {
  @Input() items: string[] = [];
  @Input() label = 'Sortable items';
  @Input() itemName?: (id: string) => string;
  @Input() canDrop?: (id: string, toIndex: number, nextOrder: string[]) => LegalityResult;
  @Input() canMove?: (id: string) => LegalityResult;
  @Input() moveControls: 'handle-and-steppers' | 'handle' | 'none' = 'handle-and-steppers';
  @Input() liveRegion = true;
  @Input() disabled = false;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() customClass = '';

  @ContentChild('itemTemplate') itemTemplate?: TemplateRef<any>;

  @Output() move = new EventEmitter<{ id: string; fromIndex: number; toIndex: number }>();
  @Output() announce = new EventEmitter<string>();
  @Output() grabChange = new EventEmitter<{ id: string; originIndex: number; proposedIndex: number } | null>();

  grabbedId: string | null = null;
  grabbedIndex: number | null = null;
  proposedIndex: number | null = null;
  announcement = '';

  private uid = `ds-sortable-${++nextSortableId}`;
  get liveRegionId(): string {
    return `${this.uid}-live`;
  }
  get instrId(): string {
    return `${this.uid}-instr`;
  }

  get isGrabbedActive(): boolean {
    return this.grabbedId !== null && this.proposedIndex !== null;
  }

  getItemName(id: string): string {
    return this.itemName ? this.itemName(id) : id;
  }

  isImmovable(id: string): boolean {
    if (!this.canMove) return false;
    return this.canMove(id) !== true;
  }

  getImmovableReason(id: string): string | null {
    if (!this.canMove) return null;
    const res = this.canMove(id);
    return typeof res === 'string' ? res : null;
  }

  getItemState(id: string, index: number): SortableItemState {
    const isGrabbed = this.grabbedId === id;
    return {
      index,
      position: index + 1,
      total: this.items.length,
      grabbed: isGrabbed,
      proposedIndex: isGrabbed ? this.proposedIndex : null,
      immovable: this.getImmovableReason(id),
    };
  }

  checkLegality(id: string, targetIndex: number): { allowed: boolean; reason?: string } {
    if (!this.canDrop) return { allowed: true };
    const nextOrder = this.items.filter((x) => x !== id);
    nextOrder.splice(targetIndex, 0, id);
    const res = this.canDrop(id, targetIndex, nextOrder);
    if (res === true) return { allowed: true };
    if (typeof res === 'string') return { allowed: false, reason: res };
    return { allowed: false, reason: 'Drop not permitted at this position.' };
  }

  private sendAnnouncement(text: string): void {
    this.announcement = text;
    this.announce.emit(text);
  }

  onHandleClick(id: string, index: number): void {
    if (this.disabled || this.isImmovable(id)) return;
    if (this.grabbedId === id) {
      this.commitDrop();
    } else {
      this.startGrab(id, index);
    }
  }

  startGrab(id: string, index: number): void {
    if (this.disabled || this.isImmovable(id)) return;
    this.grabbedId = id;
    this.grabbedIndex = index;
    this.proposedIndex = index;

    this.grabChange.emit({ id, originIndex: index, proposedIndex: index });
    this.sendAnnouncement(
      `Grabbed ${this.getItemName(id)}, position ${index + 1} of ${this.items.length} in ${this.label}. Use up and down arrow keys to reorder, Space or Enter to drop, Escape to cancel.`
    );
  }

  commitDrop(): void {
    if (!this.grabbedId || this.grabbedIndex === null || this.proposedIndex === null) return;

    const id = this.grabbedId;
    const originIndex = this.grabbedIndex;
    const targetIndex = this.proposedIndex;

    const legality = this.checkLegality(id, targetIndex);
    if (!legality.allowed) {
      this.sendAnnouncement(`Cannot drop ${this.getItemName(id)} at position ${targetIndex + 1}: ${legality.reason}`);
      return;
    }

    this.grabbedId = null;
    this.grabbedIndex = null;
    this.proposedIndex = null;
    this.grabChange.emit(null);

    if (originIndex !== targetIndex) {
      this.sendAnnouncement(`Moved ${this.getItemName(id)} from position ${originIndex + 1} to position ${targetIndex + 1} in ${this.label}.`);
      this.move.emit({ id, fromIndex: originIndex, toIndex: targetIndex });
    } else {
      this.sendAnnouncement(`Released ${this.getItemName(id)} without moving.`);
    }
  }

  cancelGrab(): void {
    if (!this.grabbedId) return;
    const name = this.getItemName(this.grabbedId);
    this.grabbedId = null;
    this.grabbedIndex = null;
    this.proposedIndex = null;
    this.grabChange.emit(null);
    this.sendAnnouncement(`Cancelled moving ${name}.`);
  }

  onHandleKeyDown(event: KeyboardEvent, id: string, index: number): void {
    if (this.disabled) return;

    if (!this.grabbedId) {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        this.startGrab(id, index);
      }
      return;
    }

    if (this.grabbedId === id && this.proposedIndex !== null) {
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (this.proposedIndex > 0) {
          this.proposedIndex--;
          const legality = this.checkLegality(id, this.proposedIndex);
          this.grabChange.emit({ id, originIndex: this.grabbedIndex!, proposedIndex: this.proposedIndex });
          this.sendAnnouncement(
            `Proposed position ${this.proposedIndex + 1} of ${this.items.length}${
              !legality.allowed ? ` (Refused: ${legality.reason})` : ''
            }.`
          );
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (this.proposedIndex < this.items.length - 1) {
          this.proposedIndex++;
          const legality = this.checkLegality(id, this.proposedIndex);
          this.grabChange.emit({ id, originIndex: this.grabbedIndex!, proposedIndex: this.proposedIndex });
          this.sendAnnouncement(
            `Proposed position ${this.proposedIndex + 1} of ${this.items.length}${
              !legality.allowed ? ` (Refused: ${legality.reason})` : ''
            }.`
          );
        }
      } else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.commitDrop();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        this.cancelGrab();
      }
    }
  }

  handleStep(id: string, currentIndex: number, direction: 'up' | 'down'): void {
    if (this.disabled || this.isImmovable(id)) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= this.items.length) return;

    const legality = this.checkLegality(id, targetIndex);
    if (!legality.allowed) {
      this.sendAnnouncement(`Cannot move ${this.getItemName(id)} ${direction === 'up' ? 'earlier' : 'later'}: ${legality.reason}`);
      return;
    }

    this.move.emit({ id, fromIndex: currentIndex, toIndex: targetIndex });
    this.sendAnnouncement(`Moved ${this.getItemName(id)} to position ${targetIndex + 1} of ${this.items.length} in ${this.label}.`);
  }

  onDragStart(event: DragEvent, id: string, index: number): void {
    if (this.disabled || this.isImmovable(id)) return;
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', id);
      event.dataTransfer.effectAllowed = 'move';
    }
    this.startGrab(id, index);
  }

  onDragOver(event: DragEvent, index: number): void {
    if (!this.grabbedId) return;
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
    if (this.proposedIndex !== index) {
      this.proposedIndex = index;
    }
  }

  onDragDrop(event: DragEvent, index: number): void {
    event.preventDefault();
    if (this.grabbedId) {
      this.proposedIndex = index;
      this.commitDrop();
    }
  }

  onDragEnd(): void {
    if (this.grabbedId) {
      this.commitDrop();
    }
  }
}
