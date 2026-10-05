import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy, ContentChildren, QueryList, AfterContentInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DsRadioComponent, RadioSize } from './radio.component.js';

let nextRadioGroupId = 0;

@Component({
  selector: 'ds-radio-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="label" [id]="groupName + '-label'" class="ds-radio-group__label">{{ label }}</div>
    <div role="radiogroup" [attr.aria-label]="ariaLabel || null" [attr.aria-labelledby]="label ? groupName + '-label' : ariaLabelledBy || null" [ngClass]="['ds-radio-group', 'ds-radio-group--' + orientation]">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./radio.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DsRadioGroupComponent),
      multi: true,
    },
  ],
})
export class DsRadioGroupComponent implements ControlValueAccessor, AfterContentInit, OnDestroy, OnInit {
  @Input() name?: string;
  @Input() label?: string;
  @Input() ariaLabel?: string;
  @Input() ariaLabelledBy?: string;
  @Input() size?: RadioSize;
  @Input() disabled: boolean = false;
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';

  @Output() valueChange = new EventEmitter<string>();

  @ContentChildren(DsRadioComponent, { descendants: true }) radios!: QueryList<DsRadioComponent>;

  value: string = '';
  private autoName = `ds-radio-group-${++nextRadioGroupId}`;
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    if (!this.label?.trim() && !this.ariaLabel?.trim() && !this.ariaLabelledBy?.trim()) {
      throw new Error('ds-radio-group requires label, ariaLabel, or ariaLabelledBy.');
    }
  }

  get groupName(): string {
    return this.name || this.autoName;
  }

  ngAfterContentInit(): void {
    this.updateRadios();
    this.radios.changes.subscribe(() => this.updateRadios());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  private updateRadios(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];

    this.radios.forEach((radio) => {
      radio.name = this.groupName;
      if (this.size && !radio.size) radio.size = this.size;
      if (this.disabled) radio.disabled = true;
      radio.checked = radio.value === this.value;

      const sub = radio.selected.subscribe((val: string) => {
        this.value = val;
        this.onChange(val);
        this.valueChange.emit(val);
        this.onTouched();
        this.updateRadioCheckedStates();
      });
      this.subscriptions.push(sub);
    });
  }

  private updateRadioCheckedStates(): void {
    this.radios.forEach((radio) => {
      radio.checked = radio.value === this.value;
    });
  }

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(val: string): void {
    this.value = val || '';
    if (this.radios) {
      this.updateRadioCheckedStates();
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (this.radios) {
      this.radios.forEach((r) => (r.disabled = isDisabled));
    }
  }
}
