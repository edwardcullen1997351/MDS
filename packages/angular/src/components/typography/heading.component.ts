import { Component, Input, ChangeDetectionStrategy, Inject, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DsHeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type DsHeadingSize = '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'base';
export type DsHeadingWeight = 'regular' | 'medium' | 'semibold' | 'bold';
export type DsTypographyColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'inverse';

const defaultSizeMap: Record<DsHeadingLevel, DsHeadingSize> = {
  h1: '4xl',
  h2: '3xl',
  h3: '2xl',
  h4: 'xl',
  h5: 'lg',
  h6: 'base',
};

@Component({
  selector: 'ds-heading-level',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsHeadingLevelProviderComponent {
  @Input() level?: number;
  constructor(@Optional() @SkipSelf() @Inject(DsHeadingLevelProviderComponent) protected parent: DsHeadingLevelProviderComponent | null) {}
  get resolvedLevel(): number {
    return Math.max(1, Math.min(6, this.level ?? (this.parent?.resolvedLevel ?? 1) + 1));
  }
}

@Component({
  selector: 'ds-heading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container [ngSwitch]="resolvedAs">
      <h1 *ngSwitchCase="'h1'" [ngClass]="rootClasses"><ng-content></ng-content></h1>
      <h2 *ngSwitchCase="'h2'" [ngClass]="rootClasses"><ng-content></ng-content></h2>
      <h3 *ngSwitchCase="'h3'" [ngClass]="rootClasses"><ng-content></ng-content></h3>
      <h4 *ngSwitchCase="'h4'" [ngClass]="rootClasses"><ng-content></ng-content></h4>
      <h5 *ngSwitchCase="'h5'" [ngClass]="rootClasses"><ng-content></ng-content></h5>
      <h6 *ngSwitchCase="'h6'" [ngClass]="rootClasses"><ng-content></ng-content></h6>
      <h2 *ngSwitchDefault [ngClass]="rootClasses"><ng-content></ng-content></h2>
    </ng-container>
  `,
  styleUrls: ['./typography.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsHeadingComponent {
  @Input() as?: DsHeadingLevel;
  @Input() size?: DsHeadingSize;
  @Input() weight: DsHeadingWeight = 'semibold';
  @Input() color: DsTypographyColor = 'primary';
  @Input() truncate: boolean = false;
  @Input() customClass = '';

  constructor(@Optional() @Inject(DsHeadingLevelProviderComponent) private headingLevel: DsHeadingLevelProviderComponent | null) {}

  get resolvedAs(): DsHeadingLevel {
    return this.as ?? (`h${this.headingLevel?.resolvedLevel ?? 1}` as DsHeadingLevel);
  }

  get rootClasses(): string {
    const computedSize = this.size || defaultSizeMap[this.resolvedAs];
    return [
      'ds-heading',
      `ds-heading--${computedSize}`,
      `ds-weight-${this.weight}`,
      `ds-color-${this.color}`,
      this.truncate ? 'ds-truncate' : '',
      this.customClass,
    ]
      .filter(Boolean)
      .join(' ');
  }
}
