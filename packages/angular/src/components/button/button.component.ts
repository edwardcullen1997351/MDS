import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'ds-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type || 'button'"
      [disabled]="disabled || isLoading"
      [attr.aria-busy]="isLoading"
      [attr.aria-disabled]="disabled || isLoading"
      [attr.aria-label]="ariaLabel || null"
      [attr.aria-labelledby]="ariaLabelledBy || null"
      [ngClass]="buttonClasses"
      (click)="onClick.emit($event)"
    >
      <ng-container *ngIf="isLoading">
        <span class="ds-button__spinner" aria-hidden="true"></span>
        <span class="ds-button__sr-only">{{ loadingText }}</span>
      </ng-container>

      <span *ngIf="!isLoading" class="ds-button__icon-left" aria-hidden="true">
        <ng-content select="[slot=left-icon]"></ng-content>
      </span>

      <span class="ds-button__content">
        <ng-content></ng-content>
      </span>

      <span *ngIf="!isLoading" class="ds-button__icon-right" aria-hidden="true">
        <ng-content select="[slot=right-icon]"></ng-content>
      </span>
    </button>
  `,
  styleUrls: ['./button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsButtonComponent implements AfterViewInit {
  constructor(private host: ElementRef<HTMLElement>) {}
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() loadingText: string = 'Loading, please wait...';
  @Input() isFullWidth: boolean = false;
  @Input() type: ButtonType = 'button';
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Output() onClick = new EventEmitter<MouseEvent>();

  ngAfterViewInit(): void {
    if (this.ariaLabel?.trim() || this.ariaLabelledBy?.trim()) return;
    const button = this.host.nativeElement.querySelector('button');
    const copy = button?.cloneNode(true) as HTMLElement | undefined;
    copy?.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove());
    if (!copy?.textContent?.trim()) {
      throw new Error('ds-button requires visible text, ariaLabel, or ariaLabelledBy.');
    }
  }

  get buttonClasses(): string {
    return [
      'ds-button',
      `ds-button--${this.variant}`,
      `ds-button--${this.size}`,
      this.isFullWidth ? 'ds-button--full-width' : '',
      this.isLoading ? 'ds-button--loading' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }
}
