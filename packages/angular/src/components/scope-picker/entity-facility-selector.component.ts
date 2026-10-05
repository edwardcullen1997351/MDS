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

export interface Facility {
  id: string;
  entityId: string;
  name: string;
  code: string;
  type: 'plant' | 'warehouse';
  status?: 'active' | 'maintenance' | 'restricted';
}

export interface LegalEntity {
  id: string;
  name: string;
  code: string;
  facilities: Facility[];
}

export interface EntityFacilitySelection {
  entityId: string;
  facilityId: string;
}

export const defaultEnterpriseEntities: LegalEntity[] = [
  {
    id: 'ent-asclepius',
    name: 'Asclepius Wellness Private Limited',
    code: 'AWPL',
    facilities: [
      { id: 'fac-f119', entityId: 'ent-asclepius', name: 'Food Plant F-119', code: 'F-119', type: 'plant', status: 'active' },
      { id: 'fac-h1-2213', entityId: 'ent-asclepius', name: 'Food Plant H1-2213', code: 'H1-2213', type: 'plant', status: 'active' },
      { id: 'fac-h1-2193', entityId: 'ent-asclepius', name: 'Food Plant H1-2193', code: 'H1-2193', type: 'plant', status: 'active' },
    ],
  },
  {
    id: 'ent-anantshriveda',
    name: 'Anantshriveda Private Limited',
    code: 'APL',
    facilities: [
      { id: 'fac-h9', entityId: 'ent-anantshriveda', name: 'RM Warehouse H-9', code: 'H-9', type: 'warehouse', status: 'active' },
      { id: 'fac-f25', entityId: 'ent-anantshriveda', name: 'RM Warehouse F-25', code: 'F-25', type: 'warehouse', status: 'active' },
    ],
  },
];

@Component({
  selector: 'ds-entity-facility-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-entity-facility-selector" [class]="customClass">
      <button
        type="button"
        class="ds-entity-facility-selector__trigger"
        (click)="toggleOpen()"
        [attr.aria-haspopup]="'listbox'"
        [attr.aria-expanded]="isOpen"
        [attr.aria-label]="ariaLabel"
        [disabled]="disabled"
      >
        <div class="ds-entity-facility-selector__content">
          <span
            class="ds-entity-facility-selector__entity-label"
            [title]="currentEntity?.name"
          >
            {{ currentEntity?.name }}
          </span>
          <span
            class="ds-entity-facility-selector__facility-label"
            [title]="currentFacility?.name"
          >
            <span
              class="ds-entity-facility-selector__type-tag"
              [class.ds-entity-facility-selector__type-tag--plant]="currentFacility?.type === 'plant'"
              [class.ds-entity-facility-selector__type-tag--warehouse]="currentFacility?.type === 'warehouse'"
            >
              {{ currentFacility?.type === 'plant' ? 'Plant' : 'Warehouse' }}
            </span>
            {{ currentFacility?.name }}
          </span>
        </div>
        <span aria-hidden="true" class="ds-entity-facility-selector__chevron">
          {{ isOpen ? '▲' : '▼' }}
        </span>
      </button>

      <div
        *ngIf="isOpen"
        class="ds-entity-facility-selector__dropdown"
        role="listbox"
        [attr.aria-label]="ariaLabel"
      >
        <div
          *ngFor="let entity of entities"
          class="ds-entity-facility-selector__group"
          role="group"
          [attr.aria-label]="entity.name"
        >
          <div class="ds-entity-facility-selector__group-header">
            <span>{{ entity.name }}</span>
            <span class="ds-entity-facility-selector__code-badge">[{{ entity.code }}]</span>
          </div>

          <button
            *ngFor="let fac of entity.facilities"
            type="button"
            role="option"
            [attr.aria-selected]="isSelected(entity.id, fac.id)"
            class="ds-entity-facility-selector__item"
            [class.ds-entity-facility-selector__item--selected]="isSelected(entity.id, fac.id)"
            (click)="selectFacility(entity.id, fac.id)"
          >
            <span class="ds-entity-facility-selector__facility-label">
              <span
                class="ds-entity-facility-selector__type-tag"
                [class.ds-entity-facility-selector__type-tag--plant]="fac.type === 'plant'"
                [class.ds-entity-facility-selector__type-tag--warehouse]="fac.type === 'warehouse'"
              >
                {{ fac.type === 'plant' ? 'Plant' : 'Warehouse' }}
              </span>
              {{ fac.name }}
            </span>
            <span
              *ngIf="isSelected(entity.id, fac.id)"
              aria-hidden="true"
              class="ds-entity-facility-selector__check"
            >
              ✓
            </span>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./scope-picker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsEntityFacilitySelectorComponent {
  @Input() entities: LegalEntity[] = defaultEnterpriseEntities;
  @Input() value: EntityFacilitySelection = {
    entityId: 'ent-asclepius',
    facilityId: 'fac-f119',
  };
  @Input() ariaLabel = 'Select Operating Entity and Facility';
  @Input() disabled = false;
  @Input() customClass = '';

  @Output() selectionChange = new EventEmitter<EntityFacilitySelection>();

  isOpen = false;

  constructor(private elementRef: ElementRef) {}

  get currentEntity(): LegalEntity | undefined {
    return this.entities.find((e) => e.id === this.value.entityId) || this.entities[0];
  }

  get currentFacility(): Facility | undefined {
    return (
      this.currentEntity?.facilities.find((f) => f.id === this.value.facilityId) ||
      this.currentEntity?.facilities[0]
    );
  }

  isSelected(entityId: string, facilityId: string): boolean {
    return this.value.entityId === entityId && this.value.facilityId === facilityId;
  }

  toggleOpen(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  selectFacility(entityId: string, facilityId: string): void {
    this.value = { entityId, facilityId };
    this.selectionChange.emit(this.value);
    this.isOpen = false;
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.isOpen = false;
    }
  }
}
