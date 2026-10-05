import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsHeadingWeight, DsTypographyColor } from './heading.component.js';

export type DsTextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl';
export type DsTextVariant = 'body' | 'caption' | 'overline' | 'mono';

@Component({
  selector: 'ds-text',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [ngClass]="rootClasses">
      <ng-content></ng-content>
    </p>
  `,
  styleUrls: ['./typography.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTextComponent {
  @Input() size: DsTextSize = 'base';
  @Input() weight: DsHeadingWeight = 'regular';
  @Input() color: DsTypographyColor = 'primary';
  @Input() variant: DsTextVariant = 'body';
  @Input() truncate: boolean = false;

  get rootClasses(): string {
    return [
      'ds-text',
      `ds-text--${this.size}`,
      `ds-text--${this.variant}`,
      `ds-weight-${this.weight}`,
      `ds-color-${this.color}`,
      this.truncate ? 'ds-truncate' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
