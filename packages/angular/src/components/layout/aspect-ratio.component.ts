import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DsAspectRatioPreset = '16/9' | '4/3' | '1/1' | '21/9' | '3/2';

const presetRatioMap: Record<DsAspectRatioPreset, string> = {
  '16/9': '16 / 9',
  '4/3': '4 / 3',
  '1/1': '1 / 1',
  '21/9': '21 / 9',
  '3/2': '3 / 2',
};

@Component({
  selector: 'ds-aspect-ratio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="ds-aspect-ratio"
      [ngStyle]="customStyles"
    >
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsAspectRatioComponent {
  @Input() ratio: number | DsAspectRatioPreset = '16/9';

  get customStyles(): Record<string, string> {
    const computedRatio =
      typeof this.ratio === 'string' && this.ratio in presetRatioMap
        ? presetRatioMap[this.ratio as DsAspectRatioPreset]
        : String(this.ratio);

    return {
      aspectRatio: computedRatio,
    };
  }
}
