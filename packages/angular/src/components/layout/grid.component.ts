import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsSpacingScale } from './box.component.js';

export type DsGridColumns = 1 | 2 | 3 | 4 | 6 | 12;

@Component({
  selector: 'ds-grid',
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
export class DsGridComponent {
  @Input() columns: DsGridColumns = 3;
  @Input() gap: DsSpacingScale = 4;
  @Input() p?: DsSpacingScale;

  get rootClasses(): string {
    return [
      'ds-grid',
      `ds-grid--cols-${this.columns}`,
      `ds-gap-${this.gap}`,
      this.p !== undefined ? `ds-p-${this.p}` : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
