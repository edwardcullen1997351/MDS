import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export type RadioSize = 'sm' | 'md' | 'lg';

let nextRadioId = 0;

@Component({
  selector: 'ds-radio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [attr.for]="radioId" [ngClass]="rootClasses">
      <input
        [id]="radioId"
        type="radio"
        [name]="name"
        [value]="value"
        [checked]="checked"
        [disabled]="disabled"
        [attr.aria-describedby]="helperText ? helperId : null"
        [attr.aria-label]="label ? null : ariaLabel || null"
        [attr.aria-labelledby]="ariaLabelledBy || (ariaLabel ? null : label ? labelId : null)"
        class="ds-radio__input"
        (change)="onRadioChange()"
      />

      <div class="ds-radio__control" aria-hidden="true">
        <div class="ds-radio__dot"></div>
      </div>

      <div *ngIf="label || helperText" class="ds-radio__label-container">
        <span *ngIf="label" [id]="labelId" class="ds-radio__label">{{ label }}</span>
        <span *ngIf="helperText" [id]="helperId" class="ds-radio__helper">{{ helperText }}</span>
      </div>
    </label>
  `,
  styleUrls: ['./radio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsRadioComponent implements OnInit {
  @Input() id?: string;
  @Input() name?: string;
  @Input() value: string = '';
  @Input() label?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() helperText?: string;
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Input() size: RadioSize = 'md';

  @Output() selected = new EventEmitter<string>();

  private autoId = `ds-radio-${++nextRadioId}`;

  ngOnInit(): void {
    if (!this.label?.trim() && !this.ariaLabel?.trim() && !this.ariaLabelledBy?.trim()) {
      throw new Error('ds-radio requires label, ariaLabel, or ariaLabelledBy.');
    }
  }

  get radioId(): string {
    return this.id || this.autoId;
  }

  get helperId(): string {
    return `${this.radioId}-helper`;
  }
  get labelId(): string { return `${this.radioId}-label`; }

  get rootClasses(): string {
    return [
      'ds-radio',
      `ds-radio--${this.size}`,
      this.checked ? 'ds-radio--checked' : '',
      this.disabled ? 'ds-radio--disabled' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }

  onRadioChange(): void {
    this.selected.emit(this.value);
  }
}
