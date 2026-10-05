export interface FloatingDataTooltipRow {
  label: string;
  value: string;
  tone?: 'warning' | 'danger' | 'eta';
}

export interface FloatingDataTooltipOptions {
  anchor: HTMLElement;
  prefix: 'ds-stock-runway' | 'ds-transfer-glyph';
  heading: string;
  tag: string;
  rows: FloatingDataTooltipRow[];
}

let nextTooltipId = 0;

/** A document-level detail overlay that stays clear of matrix scroll clipping. */
export class FloatingDataTooltip {
  private element: HTMLDivElement | null = null;
  private anchor: HTMLElement | null = null;
  private readonly updateOnScroll = () => this.updatePosition();

  show({ anchor, prefix, heading, tag, rows }: FloatingDataTooltipOptions): void {
    if (typeof document === 'undefined') return;
    this.hide();

    const tooltip = document.createElement('div');
    tooltip.id = `ds-data-tooltip-${++nextTooltipId}`;
    tooltip.className = `${prefix}__tooltip`;
    tooltip.setAttribute('role', 'tooltip');
    tooltip.style.position = 'fixed';
    tooltip.style.top = '0';
    tooltip.style.left = '0';
    tooltip.style.bottom = 'auto';
    tooltip.style.transform = 'none';
    tooltip.style.animation = 'none';
    tooltip.style.zIndex = '1000';
    tooltip.style.visibility = 'hidden';

    const header = document.createElement('div');
    header.className = `${prefix}__tooltip-header`;
    const title = document.createElement('strong');
    title.textContent = heading;
    const badge = document.createElement('span');
    badge.className = prefix === 'ds-stock-runway' ? `${prefix}__tooltip-tag` : `${prefix}__tooltip-id`;
    badge.textContent = tag;
    header.append(title, badge);
    tooltip.appendChild(header);

    const body = document.createElement('div');
    body.className = prefix === 'ds-stock-runway' ? `${prefix}__tooltip-grid` : `${prefix}__tooltip-body`;
    for (const row of rows) {
      const line = document.createElement('div');
      const label = document.createElement('span');
      label.className = `${prefix}__tooltip-label`;
      label.textContent = row.label;
      const value = document.createElement('span');
      value.className = `${prefix}__tooltip-val${row.tone ? ` ${prefix}__tooltip-val--${row.tone}` : ''}`;
      value.textContent = row.value;
      line.append(label, value);
      body.appendChild(line);
    }
    tooltip.appendChild(body);

    document.body.appendChild(tooltip);
    anchor.setAttribute('aria-describedby', tooltip.id);
    this.element = tooltip;
    this.anchor = anchor;
    this.updatePosition();
    window.addEventListener('scroll', this.updateOnScroll, true);
    window.addEventListener('resize', this.updateOnScroll);
  }

  hide(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.updateOnScroll, true);
      window.removeEventListener('resize', this.updateOnScroll);
    }
    this.anchor?.removeAttribute('aria-describedby');
    this.element?.remove();
    this.anchor = null;
    this.element = null;
  }

  private updatePosition(): void {
    if (!this.anchor || !this.element) return;
    const anchor = this.anchor.getBoundingClientRect();
    const tooltip = this.element;
    const width = tooltip.offsetWidth;
    const height = tooltip.offsetHeight;
    const gap = 8;
    let topBoundary = gap;
    for (let parent = this.anchor.parentElement; parent; parent = parent.parentElement) {
      const style = window.getComputedStyle(parent);
      if (/(auto|scroll|hidden|clip)/.test(`${style.overflowX} ${style.overflowY}`)) {
        topBoundary = Math.max(gap, parent.getBoundingClientRect().top);
        break;
      }
    }
    const above = anchor.top - height - gap;
    const below = anchor.bottom + gap;
    const fitsAbove = above >= topBoundary;
    const fitsBelow = below + height <= window.innerHeight - gap;
    const preferredTop = fitsAbove ? above : fitsBelow ? below :
      (anchor.top - topBoundary > window.innerHeight - anchor.bottom ? above : below);
    tooltip.style.top = `${Math.max(gap, Math.min(preferredTop, window.innerHeight - height - gap))}px`;
    tooltip.style.left = `${Math.max(gap, Math.min(anchor.left + (anchor.width - width) / 2, document.documentElement.clientWidth - width - gap))}px`;
    tooltip.style.visibility = 'visible';
  }
}
