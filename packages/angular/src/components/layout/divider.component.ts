import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsSpacingScale } from './box.component.js';

export type DsDividerOrientation = 'horizontal' | 'vertical';
export type DsDividerVariant = 'subtle' | 'strong' | 'dashed';

@Component({
  selector: 'ds-divider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="hasLabel; else defaultDivider">
      <div
        role="separator"
        [attr.aria-orientation]="orientation"
        [ngClass]="rootClasses"
      >
        <span class="ds-divider__label">{{ label }}</span>
      </div>
    </ng-container>

    <ng-template #defaultDivider>
      <hr
        *ngIf="orientation === 'horizontal'"
        role="separator"
        [attr.aria-orientation]="orientation"
        [ngClass]="rootClasses"
      />
      <div
        *ngIf="orientation === 'vertical'"
        role="separator"
        [attr.aria-orientation]="orientation"
        [ngClass]="rootClasses"
      ></div>
    </ng-template>
  `,
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsDividerComponent {
  @Input() orientation: DsDividerOrientation = 'horizontal';
  @Input() variant: DsDividerVariant = 'subtle';
  @Input() spacing?: DsSpacingScale;
  @Input() label?: string;
  @Input() labelPosition: 'start' | 'center' | 'end' = 'center';

  get hasLabel(): boolean {
    return Boolean(this.label && this.orientation === 'horizontal');
  }

  get rootClasses(): string {
    return [
      'ds-divider',
      `ds-divider--${this.orientation}`,
      `ds-divider--${this.variant}`,
      this.spacing !== undefined ? `ds-divider--spacing-${this.spacing}` : '',
      this.hasLabel
        ? `ds-divider--with-label ds-divider--label-${this.labelPosition}`
        : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
