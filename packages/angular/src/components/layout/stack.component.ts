import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsSpacingScale } from './box.component.js';

export type DsStackDirection = 'row' | 'column';
export type DsStackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type DsStackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

@Component({
  selector: 'ds-stack',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="rootClasses">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsStackComponent {
  @Input() direction: DsStackDirection = 'column';
  @Input() gap: DsSpacingScale = 4;
  @Input() align?: DsStackAlign;
  @Input() justify?: DsStackJustify;
  @Input() wrap: boolean = false;
  @Input() isCard: boolean = false;
  @Input() p?: DsSpacingScale;

  get rootClasses(): string {
    return [
      'ds-stack',
      `ds-stack--${this.direction}`,
      `ds-gap-${this.gap}`,
      this.align ? `ds-align-${this.align}` : '',
      this.justify ? `ds-justify-${this.justify}` : '',
      this.wrap ? 'ds-stack--wrap' : '',
      this.p !== undefined ? `ds-p-${this.p}` : '',
      this.isCard ? 'ds-surface-card' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
