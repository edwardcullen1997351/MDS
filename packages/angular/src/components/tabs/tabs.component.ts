import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type TabsVariant = 'line' | 'pill';
export type TabsSize = 'sm' | 'md' | 'lg';

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

let nextTabsId = 0;

@Component({
  selector: 'ds-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ds-tabs"
      [class.ds-tabs--variant-line]="variant === 'line'"
      [class.ds-tabs--variant-pill]="variant === 'pill'"
      [class.ds-tabs--size-sm]="size === 'sm'"
      [class.ds-tabs--size-md]="size === 'md'"
      [class.ds-tabs--size-lg]="size === 'lg'"
      [class]="customClass"
    >
      <div role="tablist" class="ds-tab-list" [attr.aria-label]="ariaLabel" (keydown)="onKeyDown($event)">
        <button
          *ngFor="let tab of tabs"
          type="button"
          role="tab"
          [id]="baseId + '-tab-' + tab.id"
          [attr.aria-selected]="activeTab === tab.id"
          [attr.aria-controls]="baseId + '-panel-' + tab.id"
          [attr.aria-disabled]="tab.disabled"
          [disabled]="tab.disabled"
          [tabIndex]="activeTab === tab.id ? 0 : -1"
          (click)="selectTab(tab.id)"
          class="ds-tab-trigger"
        >
          {{ tab.label }}
        </button>
      </div>

      <div
        role="tabpanel"
        [id]="baseId + '-panel-' + activeTab"
        [attr.aria-labelledby]="baseId + '-tab-' + activeTab"
        tabindex="0"
        class="ds-tab-panel"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./tabs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTabsComponent {
  @Input() tabs: TabItem[] = [];
  @Input() activeTab = '';
  @Input() variant: TabsVariant = 'line';
  @Input() size: TabsSize = 'md';
  @Input() ariaLabel = 'Tab options';
  @Input() customClass = '';

  @Output() activeTabChange = new EventEmitter<string>();

  baseId = `ds-tabs-${++nextTabsId}`;

  selectTab(id: string): void {
    const tab = this.tabs.find((t) => t.id === id);
    if (tab && !tab.disabled && this.activeTab !== id) {
      this.activeTab = id;
      this.activeTabChange.emit(id);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const enabledTabs = this.tabs.filter((t) => !t.disabled);
    if (enabledTabs.length === 0) return;
    const currentIndex = enabledTabs.findIndex((t) => t.id === this.activeTab);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextIndex = (currentIndex + 1) % enabledTabs.length;
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      nextIndex = enabledTabs.length - 1;
    }

    if (nextIndex !== currentIndex && nextIndex >= 0) {
      this.selectTab(enabledTabs[nextIndex].id);
    }
  }
}
