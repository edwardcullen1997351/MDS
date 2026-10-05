import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsSurfaceRadius } from './surface.component.js';
import { DsAspectRatioPreset } from './aspect-ratio.component.js';

export type DsImageFit = 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';

const presetRatioMap: Record<DsAspectRatioPreset, string> = {
  '16/9': '16 / 9',
  '4/3': '4 / 3',
  '1/1': '1 / 1',
  '21/9': '21 / 9',
  '3/2': '3 / 2',
};

@Component({
  selector: 'ds-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img
      [src]="currentSrc"
      [alt]="alt"
      [loading]="loading"
      [decoding]="decoding"
      [ngClass]="rootClasses"
      [ngStyle]="customStyles"
      (error)="handleError($event)"
      (load)="onLoad.emit($event)"
    />
  `,
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsImageComponent {
  @Input() src: string = '';
  @Input() alt: string = '';
  @Input() fit: DsImageFit = 'cover';
  @Input() position: string = 'center';
  @Input() radius: DsSurfaceRadius = 'none';
  @Input() aspectRatio?: number | DsAspectRatioPreset;
  @Input() fallbackSrc?: string;
  @Input() loading: 'lazy' | 'eager' = 'lazy';
  @Input() decoding: 'async' | 'sync' | 'auto' = 'async';

  @Output() onError = new EventEmitter<Event>();
  @Output() onLoad = new EventEmitter<Event>();

  hasError: boolean = false;
  currentSrc: string = '';

  ngOnInit() {
    this.currentSrc = this.src;
  }

  ngOnChanges() {
    if (!this.hasError) {
      this.currentSrc = this.src;
    }
  }

  handleError(event: Event) {
    if (!this.hasError && this.fallbackSrc) {
      this.hasError = true;
      this.currentSrc = this.fallbackSrc;
    }
    this.onError.emit(event);
  }

  get rootClasses(): string {
    return [
      'ds-image',
      `ds-image--fit-${this.fit}`,
      `ds-image--radius-${this.radius}`,
    ]
      .filter(Boolean)
      .join(' ');
  }

  get customStyles(): Record<string, string> {
    const styles: Record<string, string> = {
      objectPosition: this.position,
    };

    if (this.aspectRatio !== undefined) {
      styles['aspectRatio'] =
        typeof this.aspectRatio === 'string' && this.aspectRatio in presetRatioMap
          ? presetRatioMap[this.aspectRatio as DsAspectRatioPreset]
          : String(this.aspectRatio);
    }

    return styles;
  }
}
