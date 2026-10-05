import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';
import { useFocusTrap } from './focus-trap.js';

/** Applies the document-wide focus stack to an overlay created by *ngIf. */
@Directive({ selector: '[dsFocusTrap]', standalone: true })
export class DsFocusTrapDirective implements AfterViewInit, OnDestroy {
  @Input() dsFocusTrap?: HTMLElement | HTMLElement[] | '';
  private release?: () => void;

  constructor(private element: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const allowed = Array.isArray(this.dsFocusTrap) ? this.dsFocusTrap : this.dsFocusTrap instanceof HTMLElement ? [this.dsFocusTrap] : [];
    this.release = useFocusTrap(this.element.nativeElement, allowed);
  }

  ngOnDestroy(): void {
    this.release?.();
  }
}
