import { forwardRef, Optional, SkipSelf } from '@angular/core';
import { DsHeadingLevelProviderComponent } from '../typography/heading.component.js';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ds-holy-grail-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ds-holy-grail" [ngClass]="customClass">
      <a href="#ds-ng-main-content" class="ds-sr-only">{{ skipLinkText }}</a>

      <header class="ds-holy-grail__header" aria-label="Application header">
        <ng-content select="[header]"></ng-content>
      </header>

      <div
        class="ds-holy-grail__body"
        [style.gridTemplateColumns]="getGridColumns()"
      >
        <nav
          class="ds-holy-grail__nav"
          [class.ds-holy-grail__nav--collapsed]="isNavCollapsed"
          aria-label="Application navigation"
        >
          <ng-content select="[navigation]"></ng-content>
        </nav>

        <main
          id="ds-ng-main-content"
          class="ds-holy-grail__main"
          aria-label="Main work canvas"
        >
          <ng-content></ng-content>
        </main>

        <aside
          class="ds-holy-grail__utility"
          [class.ds-holy-grail__utility--collapsed]="isUtilityCollapsed"
          aria-label="Utility panel"
        >
          <ng-content select="[utility]"></ng-content>
        </aside>
      </div>

      <footer class="ds-holy-grail__footer" aria-label="Application footer">
        <ng-content select="[footer]"></ng-content>
      </footer>
    </div>
  `,
  styleUrls: ['./layout-templates.component.css'],
  providers: [{ provide: DsHeadingLevelProviderComponent, useExisting: forwardRef(() => DsHolyGrailLayoutComponent) }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsHolyGrailLayoutComponent extends DsHeadingLevelProviderComponent {
  constructor(@Optional() @SkipSelf() parent: DsHeadingLevelProviderComponent | null) { super(parent); }
  @Input() navWidth = '240px';
  @Input() utilityWidth = '300px';
  @Input() isNavCollapsed = false;
  @Input() isUtilityCollapsed = false;
  @Input() centerMinWidth = '540px';
  @Input() skipLinkText = 'Skip to main content';
  @Input() customClass = '';

  getGridColumns(): string {
    const tracks: string[] = [];
    if (!this.isNavCollapsed) {
      tracks.push(this.navWidth);
    }
    tracks.push(this.isNavCollapsed && this.isUtilityCollapsed ? '1fr' : `minmax(${this.centerMinWidth}, 1fr)`);
    if (!this.isUtilityCollapsed) {
      tracks.push(this.utilityWidth);
    }
    return tracks.join(' ');
  }
}
