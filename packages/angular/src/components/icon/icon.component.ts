import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DsIconSize = 'sm' | 'md' | 'lg' | 'xl';
export type DsIconName =
  | 'search'
  | 'check'
  | 'close'
  | 'chevron-down'
  | 'chevron-right'
  | 'plus'
  | 'trash'
  | 'edit'
  | 'alert-circle'
  | 'check-circle'
  | 'info-circle'
  | 'settings'
  | 'box'
  | 'arrow-right';

@Component({
  selector: 'ds-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      viewBox="0 0 24 24"
      [ngClass]="[
        'ds-icon',
        'ds-icon--' + size,
        spin ? 'ds-icon--spin' : ''
      ]"
      [attr.aria-hidden]="!ariaLabel"
      [attr.aria-label]="ariaLabel"
      [attr.role]="ariaLabel ? 'img' : 'presentation'"
    >
      <ng-container [ngSwitch]="name">
        <!-- search -->
        <ng-container *ngSwitchCase="'search'">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </ng-container>

        <!-- check -->
        <ng-container *ngSwitchCase="'check'">
          <polyline points="20 6 9 17 4 12"></polyline>
        </ng-container>

        <!-- close -->
        <ng-container *ngSwitchCase="'close'">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </ng-container>

        <!-- chevron-down -->
        <ng-container *ngSwitchCase="'chevron-down'">
          <polyline points="6 9 12 15 18 9"></polyline>
        </ng-container>

        <!-- chevron-right -->
        <ng-container *ngSwitchCase="'chevron-right'">
          <polyline points="9 18 15 12 9 6"></polyline>
        </ng-container>

        <!-- plus -->
        <ng-container *ngSwitchCase="'plus'">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </ng-container>

        <!-- trash -->
        <ng-container *ngSwitchCase="'trash'">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </ng-container>

        <!-- alert-circle -->
        <ng-container *ngSwitchCase="'alert-circle'">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </ng-container>

        <!-- check-circle -->
        <ng-container *ngSwitchCase="'check-circle'">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </ng-container>

        <!-- settings -->
        <ng-container *ngSwitchCase="'settings'">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </ng-container>

        <!-- box -->
        <ng-container *ngSwitchCase="'box'">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
          <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </ng-container>

        <!-- Default custom slot -->
        <ng-content></ng-content>
      </ng-container>
    </svg>
  `,
  styleUrls: ['./icon.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsIconComponent {
  @Input() name?: DsIconName;
  @Input() size: DsIconSize = 'md';
  @Input() spin: boolean = false;
  @Input() ariaLabel?: string;
}
