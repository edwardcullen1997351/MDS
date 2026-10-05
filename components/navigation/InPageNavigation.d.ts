import * as React from 'react';

export interface InPageSection {
  /** Unique DOM element ID of the target section (e.g. 'safety-loto'). */
  id: string;
  /** Visible title of the section link. */
  title: string;
  /** Heading nesting level (2 for h2, 3 for h3). Default: 2. */
  level?: 2 | 3 | number;
  /** Optional custom URL hash override. */
  href?: string;
}

/**
 * In-Page Navigation — Table of Contents / On-This-Page Navigation System.
 * @startingPoint section="Navigation" subtitle="Single-page table of contents and anchor navigation" viewport="800x320"
 */
export interface InPageNavigationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** Ordered list of document sections to navigate. */
  sections: InPageSection[];
  /** Controlled active section ID. If omitted, auto-detected via IntersectionObserver. */
  activeId?: string;
  /** Whether to automatically track scroll position via IntersectionObserver. Default: true. */
  autoScrollspy?: boolean;
  /** Callback fired when a section link is clicked. */
  onSectionClick?: (sectionId: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  /** Presentation variant: 'sidebar' (default), 'floating-rail', 'compact-menu'. */
  variant?: 'sidebar' | 'floating-rail' | 'compact-menu';
  /** Density scale: 'sm' | 'md' | 'lg'. Default: 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Title text displayed above the link list. Default: "On This Page". */
  title?: string;
  /** Fixed header height offset in pixels to subtract from scroll target position. Default: 64. */
  headerOffset?: number;
  /** Whether to scroll smoothly to targets. Default: true. */
  smoothScroll?: boolean;
  /** Accessible landmark label. Default: "On this page". */
  label?: string;
  /** Custom CSS style object. */
  style?: React.CSSProperties;
}

export declare function InPageNavigation(props: InPageNavigationProps): JSX.Element;
