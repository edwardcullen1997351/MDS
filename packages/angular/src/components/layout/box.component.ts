import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DsSpacingScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;

@Component({
  selector: 'ds-box',
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
export class DsBoxComponent {
  @Input() p?: DsSpacingScale;
  @Input() isCard: boolean = false;

  get rootClasses(): string {
    return [
      'ds-box',
      this.p !== undefined ? `ds-p-${this.p}` : '',
      this.isCard ? 'ds-surface-card' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
