import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { useFocusTrap } from '../../utils/focus-trap.js';

export type DialogSize = 'sm' | 'md' | 'lg';
let nextDialogId = 0;

@Component({
  selector: 'ds-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="open" #backdrop class="ds-dialog-backdrop" (click)="onBackdropClick()"></div>
    <div *ngIf="open" class="ds-dialog-positioner" role="presentation">
      <div
        #content
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        [attr.aria-labelledby]="title ? dialogId + '-title' : null"
        [attr.aria-describedby]="description ? dialogId + '-desc' : null"
        class="ds-dialog-content"
        [ngClass]="'ds-dialog-content--' + size"
      >
        <button
          *ngIf="showCloseButton"
          type="button"
          class="ds-dialog-close-trigger"
          (click)="close()"
          aria-label="Close dialog"
        >
          ✕
        </button>

        <div *ngIf="title || description" class="ds-dialog-header">
          <h2 *ngIf="title" [id]="dialogId + '-title'" class="ds-dialog-title">{{ title }}</h2>
          <p *ngIf="description" [id]="dialogId + '-desc'" class="ds-dialog-description">{{ description }}</p>
        </div>

        <div class="ds-dialog-body">
          <ng-content></ng-content>
        </div>

        <div class="ds-dialog-footer">
          <ng-content select="[slot=footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsDialogComponent implements AfterViewChecked, OnDestroy {
  @ViewChild('content') content?: ElementRef<HTMLElement>;
  @ViewChild('backdrop') backdrop?: ElementRef<HTMLElement>;
  private releaseFocus?: () => void;
  dialogId = `ds-dialog-${++nextDialogId}`;
  @Input() open: boolean = false;
  @Input() title?: string;
  @Input() description?: string;
  @Input() size: DialogSize = 'md';
  @Input() showCloseButton: boolean = true;
  @Input() closeOnOutsideClick: boolean = true;
  @Input() closeOnEscape: boolean = true;

  @Output() openChange = new EventEmitter<boolean>();

  ngAfterViewChecked(): void {
    if (this.open && this.content && !this.releaseFocus) this.releaseFocus = useFocusTrap(this.content.nativeElement, this.backdrop ? [this.backdrop.nativeElement] : []);
    if (!this.open && this.releaseFocus) { this.releaseFocus(); this.releaseFocus = undefined; }
  }

  ngOnDestroy(): void { this.releaseFocus?.(); }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.open && this.closeOnEscape) {
      this.close();
    }
  }

  onBackdropClick(): void {
    if (this.closeOnOutsideClick) {
      this.close();
    }
  }

  close(): void {
    this.open = false;
    this.releaseFocus?.();
    this.releaseFocus = undefined;
    this.openChange.emit(false);
  }
}
