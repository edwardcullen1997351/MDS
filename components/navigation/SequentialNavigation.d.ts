import * as React from 'react';

export interface SequentialItem {
  /** Unique identifier for sequence item (e.g. 'SOP-01', 'WO-STEP-03'). */
  id?: string;
  /** Primary human-readable title of destination. */
  title: string;
  /** Secondary subtitle or station context. */
  subtitle?: string;
  /** Target navigation URL when rendering link-based destinations. */
  href?: string;
  /** Estimated duration, status, or additional arbitrary metadata. */
  metadata?: Record<string, any>;
}

/**
 * Sequential Navigation — Ordered Sequence Navigation System.
 * @startingPoint section="Navigation" subtitle="Ordered sequence navigation controls" viewport="800x200"
 */
export interface SequentialNavigationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** Ordered collection of destinations in the sequence. */
  items: SequentialItem[];
  /** 0-based active index in the sequence. */
  currentIndex: number;
  /** Callback fired when user navigates to previous or next item. */
  onNavigate?: (newIndex: number, item: SequentialItem, direction: 'prev' | 'next') => void;
  /** Presentation variant: 'preview-cards' (default), 'standard-bar', 'progress-strip', 'single-direction'. */
  variant?: 'preview-cards' | 'standard-bar' | 'progress-strip' | 'single-direction';
  /** Component density and size scale. Default: 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the sequence wraps around circularly at the ends. Default: false. */
  allowWrap?: boolean;
  /** Whether to render sequence progression bar. Default: false. */
  showProgress?: boolean;
  /** Whether to bind Alt+Arrow / [/] global keyboard shortcuts. Default: false. */
  enableShortcuts?: boolean;
  /** Direction label text for previous control. Default: "Previous". */
  prevLabel?: string;
  /** Direction label text for next control. Default: "Next". */
  nextLabel?: string;
  /** Accessible landmark label. Default: "Sequential navigation". */
  label?: string;
  /** Custom CSS style object. */
  style?: React.CSSProperties;
}

export declare function SequentialNavigation(props: SequentialNavigationProps): JSX.Element;
