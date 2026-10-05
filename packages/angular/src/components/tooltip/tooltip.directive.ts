import {
  Directive,
  Input,
  ElementRef,
  HostListener,
  Renderer2,
  OnDestroy,
} from '@angular/core';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

let nextTooltipId = 0;

@Directive({
  selector: '[dsTooltip]',
  standalone: true,
})
export class DsTooltipDirective implements OnDestroy {
  @Input('dsTooltip') tooltipText = '';
  @Input() tooltipPlacement: TooltipPlacement = 'top';
  @Input() tooltipDelay = 200;
  @Input() tooltipDisabled = false;

  private tooltipElement: HTMLElement | null = null;
  private timeoutId: any = null;
  private tooltipId = `ds-tooltip-${++nextTooltipId}`;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('mouseenter')
  @HostListener('focus')
  onShow(): void {
    if (this.tooltipDisabled || !this.tooltipText) return;
    this.clearTimeout();
    this.timeoutId = setTimeout(() => {
      this.createTooltip();
    }, this.tooltipDelay);
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  onHide(): void {
    this.clearTimeout();
    this.destroyTooltip();
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    this.destroyTooltip();
  }

  private createTooltip(): void {
    if (this.tooltipElement) return;

    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
    this.renderer.setAttribute(this.el.nativeElement, 'aria-describedby', this.tooltipId);

    const tooltip = this.renderer.createElement('div');
    this.renderer.setAttribute(tooltip, 'id', this.tooltipId);
    this.renderer.setAttribute(tooltip, 'role', 'tooltip');
    this.renderer.addClass(tooltip, 'ds-tooltip-content');
    this.renderer.addClass(tooltip, `ds-tooltip-content--${this.tooltipPlacement}`);

    const text = this.renderer.createText(this.tooltipText);
    this.renderer.appendChild(tooltip, text);

    const arrow = this.renderer.createElement('span');
    this.renderer.addClass(arrow, 'ds-tooltip-arrow');
    this.renderer.setAttribute(arrow, 'aria-hidden', 'true');
    this.renderer.appendChild(tooltip, arrow);

    this.renderer.appendChild(this.el.nativeElement, tooltip);
    this.tooltipElement = tooltip;
  }

  private destroyTooltip(): void {
    if (this.tooltipElement) {
      this.renderer.removeAttribute(this.el.nativeElement, 'aria-describedby');
      this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
      this.tooltipElement = null;
    }
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  ngOnDestroy(): void {
    this.clearTimeout();
    this.destroyTooltip();
  }
}
