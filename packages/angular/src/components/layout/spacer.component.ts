import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsSpacingScale } from './box.component.js';

export type DsSpacerAxis = 'horizontal' | 'vertical' | 'both';

@Component({
  selector: 'ds-spacer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      aria-hidden="true"
      [ngClass]="rootClasses"
      [ngStyle]="customStyles"
    ></div>
  `,
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsSpacerComponent {
  @Input() size?: DsSpacingScale;
  @Input() axis: DsSpacerAxis = 'both';
  @Input() flex?: number | string;

  get isFlexExpand(): boolean {
    return this.size === undefined && this.flex === undefined;
  }

  get rootClasses(): string {
    return [
      'ds-spacer',
      this.isFlexExpand ? 'ds-spacer--flex' : '',
      this.size !== undefined ? `ds-spacer--${this.axis}-${this.size}` : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  get customStyles(): Record<string, string | number> {
    const styles: Record<string, string | number> = {};
    if (this.flex !== undefined) {
      styles['flex'] = this.flex;
    }
    return styles;
  }
}
