import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Optional, SkipSelf, forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsHeadingLevelProviderComponent, DsHeadingLevel } from '../typography/heading.component.js';

export type CardVariant = 'outline' | 'elevated' | 'sunken';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'ds-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-container [ngSwitch]="resolvedAs">
    <h1 *ngSwitchCase="'h1'" class="ds-card-title" [class]="customClass"><ng-content></ng-content></h1>
    <h2 *ngSwitchCase="'h2'" class="ds-card-title" [class]="customClass"><ng-content></ng-content></h2>
    <h3 *ngSwitchCase="'h3'" class="ds-card-title" [class]="customClass"><ng-content></ng-content></h3>
    <h4 *ngSwitchCase="'h4'" class="ds-card-title" [class]="customClass"><ng-content></ng-content></h4>
    <h5 *ngSwitchCase="'h5'" class="ds-card-title" [class]="customClass"><ng-content></ng-content></h5>
    <h6 *ngSwitchCase="'h6'" class="ds-card-title" [class]="customClass"><ng-content></ng-content></h6>
  </ng-container>`,
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsCardTitleComponent {
  @Input() customClass = '';
  @Input() as?: DsHeadingLevel;
  constructor(@Optional() private headingLevel: DsHeadingLevelProviderComponent | null) {}
  get resolvedAs(): DsHeadingLevel { return this.as ?? (`h${this.headingLevel?.resolvedLevel ?? 1}` as DsHeadingLevel); }
}

@Component({
  selector: 'ds-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `<p class="ds-card-description" [class]="customClass"><ng-content></ng-content></p>`,
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsCardDescriptionComponent {
  @Input() customClass = '';
}

@Component({
  selector: 'ds-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-card-header" [class]="customClass">
      <div class="ds-card-header-main">
        <ng-content></ng-content>
      </div>
      <div class="ds-card-header-action">
        <ng-content select="[card-action]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsCardHeaderComponent {
  @Input() customClass = '';
}

@Component({
  selector: 'ds-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="ds-card-content" [class]="customClass"><ng-content></ng-content></div>`,
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsCardContentComponent {
  @Input() customClass = '';
}

@Component({
  selector: 'ds-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ds-card-footer"
      [class.ds-card-footer--divided]="divided"
      [class]="customClass"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsCardFooterComponent {
  @Input() divided = false;
  @Input() customClass = '';
}

@Component({
  selector: 'ds-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ds-card"
      [class.ds-card--outline]="variant === 'outline'"
      [class.ds-card--elevated]="variant === 'elevated'"
      [class.ds-card--sunken]="variant === 'sunken'"
      [class.ds-card--padding-none]="padding === 'none'"
      [class.ds-card--padding-sm]="padding === 'sm'"
      [class.ds-card--padding-md]="padding === 'md'"
      [class.ds-card--padding-lg]="padding === 'lg'"
      [class]="customClass"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./card.component.css'],
  providers: [{ provide: DsHeadingLevelProviderComponent, useExisting: forwardRef(() => DsCardComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsCardComponent extends DsHeadingLevelProviderComponent {
  constructor(@Optional() @SkipSelf() parent: DsHeadingLevelProviderComponent | null) { super(parent); }
  @Input() variant: CardVariant = 'outline';
  @Input() padding: CardPadding = 'md';
  @Input() customClass = '';
}
