import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsSpacingScale } from './box.component.js';

export type DsSurfaceTone = 'default' | 'card' | 'sunken' | 'overlay' | 'inverse';
export type DsSurfaceElevation = 0 | 1 | 2 | 3 | 4 | 5;
export type DsSurfaceRadius = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type DsSurfaceBorder = 'none' | 'subtle' | 'strong';

@Component({
  selector: 'ds-surface',
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
export class DsSurfaceComponent {
  @Input() tone: DsSurfaceTone = 'card';
  @Input() elevation: DsSurfaceElevation = 0;
  @Input() radius: DsSurfaceRadius = 'md';
  @Input() border: DsSurfaceBorder = 'subtle';
  @Input() p?: DsSpacingScale;

  get rootClasses(): string {
    return [
      'ds-surface',
      `ds-surface--tone-${this.tone}`,
      `ds-surface--elevation-${this.elevation}`,
      `ds-surface--radius-${this.radius}`,
      `ds-surface--border-${this.border}`,
      this.p !== undefined ? `ds-p-${this.p}` : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
