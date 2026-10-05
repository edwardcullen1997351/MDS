import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonSize, ButtonVariant, ButtonType } from './button.component.js';

@Component({
  selector: 'ds-icon-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [attr.aria-label]="ariaLabel || null"
      [attr.aria-labelledby]="ariaLabelledBy || null"
      [ngClass]="['ds-button', 'ds-button--' + variant, 'ds-button--' + size]"
      (click)="onClick.emit($event)"
    ><span class="ds-button__content"><ng-content></ng-content></span></button>
  `,
  styleUrls: ['./button.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsIconButtonComponent implements OnInit {
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: ButtonType = 'button';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<MouseEvent>();

  ngOnInit(): void {
    if (!this.ariaLabel?.trim() && !this.ariaLabelledBy?.trim()) {
      throw new Error('ds-icon-button requires ariaLabel or ariaLabelledBy.');
    }
  }
}
