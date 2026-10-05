import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DsContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'ds-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="['ds-container', 'ds-container--' + size]">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsContainerComponent {
  @Input() size: DsContainerSize = 'lg';
}
