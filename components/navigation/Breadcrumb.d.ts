import * as React from 'react';

export interface BreadcrumbItem {
  /** Crumb text. One or two words — the trail is not the page title. */
  label: string;
  /** Required on every crumb except the last. The last crumb is the current page. */
  href?: string;
  /** Lucide icon name before the label. Normally only the root crumb has one. */
  icon?: string;
}

/**
 * Where you are in the hierarchy, and the way back up.
 * @startingPoint section="Navigation" subtitle="Ancestor trail with collapse" viewport="700x120"
 */
export interface BreadcrumbProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** Root first, current page last. Strings become label-only crumbs. */
  items: Array<string | BreadcrumbItem>;
  /** sm = 11px trail above a dense header. md = 12px, default. */
  size?: 'sm' | 'md';
  /** Separator glyph. chevron = default; slash for path-like trails. */
  variant?: 'chevron' | 'slash';
  /** Collapse the middle into a menu past this many crumbs. Minimum 3; 0 disables. */
  maxItems?: number;
  /** Accessible name of the nav landmark. */
  label?: string;
  /** Called instead of window.location for a collapsed-menu crumb — pass your router's push. */
  onNavigate?: (item: BreadcrumbItem) => void;
  style?: React.CSSProperties;
}
export declare function Breadcrumb(props: BreadcrumbProps): JSX.Element;
