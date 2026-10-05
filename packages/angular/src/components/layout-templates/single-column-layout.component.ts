import { forwardRef, Optional, SkipSelf } from '@angular/core';
import { DsHeadingLevelProviderComponent } from '../typography/heading.component.js';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DsSingleColumnContentWidth = 'sm' | 'md' | 'lg' | 'full';
export type DsSingleColumnAlignment = 'centered' | 'start';
export type DsSingleColumnSectionSpacing = 'sm' | 'md' | 'lg';
export type DsSingleColumnActionsPlacement = 'flow' | 'anchored';

@Component({
  selector: 'ds-single-column-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      [attr.role]="role"
      [attr.aria-label]="ariaLabel"
      class="ds-single-column"
      [ngClass]="customClass"
    >
      <div
        class="ds-single-column__wrapper"
        [ngClass]="[
          'ds-single-column__wrapper--' + contentWidth,
          'ds-single-column__wrapper--' + alignment
        ]"
      >
        <header class="ds-single-column__header" aria-label="Page header">
          <ng-content select="[header]"></ng-content>
        </header>

        <div
          class="ds-single-column__main"
          [ngClass]="'ds-single-column__main--spacing-' + sectionSpacing"
        >
          <ng-content></ng-content>
        </div>

        <div
          *ngIf="actionsPlacement === 'flow'"
          class="ds-single-column__actions"
          aria-label="Page actions"
        >
          <ng-content select="[actions]"></ng-content>
        </div>

        <aside
          class="ds-single-column__supplementary"
          aria-label="Supplementary reference"
        >
          <ng-content select="[supplementary]"></ng-content>
        </aside>
      </div>

      <div
        *ngIf="actionsPlacement === 'anchored'"
        class="ds-single-column__actions ds-single-column__actions--anchored"
        aria-label="Anchored actions"
      >
        <div
          class="ds-single-column__wrapper"
          [ngClass]="[
            'ds-single-column__wrapper--' + contentWidth,
            'ds-single-column__wrapper--' + alignment
          ]"
          style="padding: 0;"
        >
          <ng-content select="[actions]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./layout-templates.component.css'],
  providers: [{ provide: DsHeadingLevelProviderComponent, useExisting: forwardRef(() => DsSingleColumnLayoutComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsSingleColumnLayoutComponent extends DsHeadingLevelProviderComponent {
  constructor(@Optional() @SkipSelf() parent: DsHeadingLevelProviderComponent | null) { super(parent); }
  @Input() contentWidth: DsSingleColumnContentWidth = 'md';
  @Input() alignment: DsSingleColumnAlignment = 'centered';
  @Input() sectionSpacing: DsSingleColumnSectionSpacing = 'md';
  @Input() actionsPlacement: DsSingleColumnActionsPlacement = 'flow';
  @Input() role = 'main';
  @Input() ariaLabel?: string;
  @Input() customClass = '';
}
