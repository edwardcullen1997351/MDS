import { DsFocusTrapDirective } from '../../utils/focus-trap.directive.js';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ChangeDetectionStrategy,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConflictFieldDiff {
  fieldKey: string;
  label: string;
  localValue: string | number;
  remoteValue: string | number;
  unit?: string;
  isConflicted?: boolean;
}
let nextConflictId = 0;

@Component({
  selector: 'ds-concurrent-conflict-resolver',
  standalone: true,
  imports: [DsFocusTrapDirective, CommonModule],
  template: `
    <div
      *ngIf="isOpen"
      class="ds-conflict-overlay"
      [class]="customClass"
      role="presentation"
      (click)="onBackdropClick($event)"
    >
      <div dsFocusTrap tabindex="-1"
        class="ds-conflict-drawer"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="conflictId + '-title'"
        [attr.aria-describedby]="conflictId + '-desc'"
      >
        <!-- Header -->
        <div class="ds-conflict-header">
          <div class="ds-conflict-header__title-group">
            <div class="ds-conflict-badge">
              <span class="ds-conflict-badge__dot" aria-hidden="true"></span>
              <span>VERSION MISMATCH (409 CONFLICT)</span>
            </div>
            <h2 [id]="conflictId + '-title'" class="ds-conflict-title">
              {{ title }}
            </h2>
            <div class="ds-conflict-subhead">
              <span class="ds-conflict-code">{{ recordCode }}</span>
              <span class="ds-conflict-separator" aria-hidden="true">•</span>
              <span class="ds-conflict-name">{{ recordName }}</span>
              <ng-container *ngIf="recordId">
                <span class="ds-conflict-separator" aria-hidden="true">•</span>
                <span class="ds-conflict-id">ID: {{ recordId }}</span>
              </ng-container>
            </div>
          </div>
          <button
            type="button"
            class="ds-conflict-close"
            (click)="closeDrawer()"
            aria-label="Close conflict resolution drawer"
            title="Close drawer"
          >
            ✕
          </button>
        </div>

        <!-- Informational Callout -->
        <div class="ds-conflict-callout" [id]="conflictId + '-desc'">
          <div class="ds-conflict-callout__icon" aria-hidden="true">⚠️</div>
          <div class="ds-conflict-callout__text">
            <strong>Allocation Preempted:</strong> {{ conflictReason }}
            <div class="ds-conflict-callout__meta">
              <span>Local ETag: <code>{{ localEtag }}</code></span>
              <span class="ds-conflict-separator" aria-hidden="true">•</span>
              <span>Remote ETag: <code>{{ remoteEtag }}</code></span>
            </div>
          </div>
        </div>

        <!-- Side-by-Side Comparison Columns -->
        <div
          class="ds-conflict-body"
          tabindex="0"
          role="region"
          aria-label="Conflict comparison details"
        >
          <div class="ds-conflict-columns">
            <!-- Left Column: Your Planned Change -->
            <div class="ds-conflict-column ds-conflict-column--local">
              <div class="ds-conflict-column__header">
                <div class="ds-conflict-column__user-badge ds-conflict-column__user-badge--local">
                  <span class="ds-conflict-avatar" aria-hidden="true">👤</span>
                  <div>
                    <div class="ds-conflict-user-name">{{ localUser }}</div>
                    <div class="ds-conflict-user-role">{{ localRole }}</div>
                  </div>
                </div>
                <div class="ds-conflict-column__status-tag">YOUR PLANNED CHANGE</div>
              </div>

              <div class="ds-conflict-hero-metric">
                <span class="ds-conflict-hero-metric__label">Requested Allocation</span>
                <div class="ds-conflict-hero-metric__value">
                  {{ proposedQuantity }} <span class="ds-conflict-hero-metric__uom">{{ uom }}</span>
                </div>
                <span class="ds-conflict-hero-metric__subtext">Target: Line 02</span>
              </div>

              <div class="ds-conflict-field-list">
                <div *ngFor="let f of fields" class="ds-conflict-field-item">
                  <span class="ds-conflict-field-label">{{ f.label }}</span>
                  <span class="ds-conflict-field-value ds-conflict-field-value--local">
                    {{ f.localValue }} {{ f.unit || '' }}
                  </span>
                </div>
              </div>

              <div class="ds-conflict-column__timestamp">
                Created: {{ localTimestamp }}
              </div>
            </div>

            <!-- Visual Versus Divider -->
            <div class="ds-conflict-versus" aria-hidden="true">
              <span class="ds-conflict-versus__line"></span>
              <span class="ds-conflict-versus__badge">VS</span>
              <span class="ds-conflict-versus__line"></span>
            </div>

            <!-- Right Column: Current System State -->
            <div class="ds-conflict-column ds-conflict-column--remote">
              <div class="ds-conflict-column__header">
                <div class="ds-conflict-column__user-badge ds-conflict-column__user-badge--remote">
                  <span class="ds-conflict-avatar" aria-hidden="true">🏢</span>
                  <div>
                    <div class="ds-conflict-user-name">{{ remoteUser }}</div>
                    <div class="ds-conflict-user-role">{{ remoteRole }}</div>
                  </div>
                </div>
                <div class="ds-conflict-column__status-tag ds-conflict-column__status-tag--remote">
                  CURRENT SYSTEM STATE
                </div>
              </div>

              <div class="ds-conflict-hero-metric ds-conflict-hero-metric--remote">
                <span class="ds-conflict-hero-metric__label">Reserved by Remote</span>
                <div class="ds-conflict-hero-metric__value">
                  {{ remoteQuantity }} <span class="ds-conflict-hero-metric__uom">{{ uom }}</span>
                </div>
                <span class="ds-conflict-hero-metric__subtext">
                  Available Delta: <strong>{{ deltaQuantity }} {{ uom }}</strong>
                </span>
              </div>

              <div class="ds-conflict-field-list">
                <div *ngFor="let f of fields" class="ds-conflict-field-item">
                  <span class="ds-conflict-field-label">{{ f.label }}</span>
                  <span class="ds-conflict-field-value ds-conflict-field-value--remote">
                    {{ f.remoteValue }} {{ f.unit || '' }}
                  </span>
                </div>
              </div>

              <div class="ds-conflict-column__timestamp">
                Committed: {{ remoteTimestamp }}
              </div>
            </div>
          </div>
        </div>

        <!-- 1-Click Action Resolution Footer -->
        <div class="ds-conflict-footer">
          <div class="ds-conflict-footer__info">
            Choose an automated resolution pathway to preserve ledger integrity:
          </div>
          <div class="ds-conflict-footer__actions">
            <!-- Action 1: Discard local, accept remote and re-calculate -->
            <button
              type="button"
              class="ds-conflict-action ds-conflict-action--accept-remote"
              (click)="triggerAcceptRemote()"
            >
              <span class="ds-conflict-action__icon" aria-hidden="true">⟲</span>
              <span class="ds-conflict-action__content">
                <span class="ds-conflict-action__title">Accept Remote & Re-calculate</span>
                <span class="ds-conflict-action__desc">Sync latest warehouse reservation ({{ remoteQuantity }} {{ uom }})</span>
              </span>
            </button>

            <!-- Action 3: Allocate Remaining Delta -->
            <button
              type="button"
              class="ds-conflict-action ds-conflict-action--allocate-delta"
              (click)="triggerAllocateDelta()"
            >
              <span class="ds-conflict-action__icon" aria-hidden="true">✓</span>
              <span class="ds-conflict-action__content">
                <span class="ds-conflict-action__title">
                  Allocate Remaining Delta ({{ deltaQuantity }} {{ uom }})
                </span>
                <span class="ds-conflict-action__desc">Claim leftover balance without conflict</span>
              </span>
            </button>

            <!-- Action 2: Force Override (Admin) -->
            <button
              *ngIf="isAdmin"
              type="button"
              class="ds-conflict-action ds-conflict-action--force-override"
              (click)="triggerForceOverride()"
            >
              <span class="ds-conflict-action__icon" aria-hidden="true">⚡</span>
              <span class="ds-conflict-action__content">
                <span class="ds-conflict-action__title">Force Override (Admin)</span>
                <span class="ds-conflict-action__desc">Overwrite remote state with planned {{ proposedQuantity }} {{ uom }}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./concurrent-conflict-resolver.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConcurrentConflictResolverComponent implements OnChanges, OnDestroy {
  conflictId = `ds-conflict-${++nextConflictId}`;
  @Input() isOpen = false;
  @Input() title = 'Concurrent Allocation Conflict Detected';
  @Input() recordId?: string;
  @Input() recordCode = 'RAW-EXT-ASH-05';
  @Input() recordName = 'Ashwagandha Root Extract 2.5% Withanolides';
  @Input() localUser = 'You (Shift Lead)';
  @Input() localRole = 'Asclepius Food Plant F-119';
  @Input() remoteUser = 'Anantshriveda Supply Coordinator';
  @Input() remoteRole = 'RM Warehouse H-9';
  @Input() localTimestamp = 'Just now (Draft State)';
  @Input() remoteTimestamp = '2 mins ago (Committed)';
  @Input() localEtag = 'W/"109-rev1"';
  @Input() remoteEtag = 'W/"110-rev2"';
  @Input() proposedQuantity = 150;
  @Input() remoteQuantity = 100;
  @Input() deltaQuantity = 50;
  @Input() uom = 'KG';
  @Input() conflictReason = 'Another planner committed an allocation for this material while your changes were in review. ETag version mismatch prevents direct overwrite.';
  @Input() fields: ConflictFieldDiff[] = [
    {
      fieldKey: 'targetLine',
      label: 'Target Work Center',
      localValue: 'Line 02 - Syrup Bottling',
      remoteValue: 'QC Holding Bay (RM Warehouse)',
      isConflicted: true,
    },
    {
      fieldKey: 'allocatedQty',
      label: 'Allocated Quantity',
      localValue: 150,
      remoteValue: 100,
      unit: 'KG',
      isConflicted: true,
    },
    {
      fieldKey: 'remainingStock',
      label: 'Available Remainder',
      localValue: 0,
      remoteValue: 50,
      unit: 'KG',
      isConflicted: true,
    },
    {
      fieldKey: 'priority',
      label: 'Dispatch Priority',
      localValue: 'HIGH',
      remoteValue: 'CRITICAL',
      isConflicted: true,
    },
  ];
  @Input() isAdmin = true;
  @Input() customClass = '';

  @Output() close = new EventEmitter<void>();
  @Output() acceptRemote = new EventEmitter<void>();
  @Output() forceOverride = new EventEmitter<void>();
  @Output() allocateDelta = new EventEmitter<void>();

  private originalOverflow = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        this.originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = this.originalOverflow;
      }
    }
  }

  ngOnDestroy(): void {
    if (this.isOpen && typeof document !== 'undefined') {
      document.body.style.overflow = this.originalOverflow;
    }
  }

  @HostListener('window:keydown.escape')
  handleEscape(): void {
    if (this.isOpen) {
      this.closeDrawer();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeDrawer();
    }
  }

  closeDrawer(): void {
    this.close.emit();
  }

  triggerAcceptRemote(): void {
    this.acceptRemote.emit();
  }

  triggerForceOverride(): void {
    this.forceOverride.emit();
  }

  triggerAllocateDelta(): void {
    this.allocateDelta.emit();
  }
}
