import * as React from 'react';

export interface LocalNavItem {
  /** Unique workspace route identifier. */
  id: string;
  /** Workspace label (noun, max 24 characters). */
  label: string;
  /** Workspace route URL. */
  href?: string;
  /** Optional Lucide icon name. */
  icon?: string;
  /** Numeric count or string alert badge (e.g. 8 open NCRs). */
  badge?: string | number;
  /** Inactive or insufficient role permissions. */
  disabled?: boolean;
  /** Tooltip explanation for permission restrictions. */
  disabledReason?: string;
  /** Subordinate child destinations (max 1 nested level). */
  children?: LocalNavItem[];
}

export interface LocalNavGroup {
  /** Category group title (e.g. "Inspections", "Dispositions"). */
  group: string;
  /** Array of workspace items within this group. */
  items: LocalNavItem[];
}

/**
 * Local Navigation — L2 Information Architecture wayfinding system.
 * @startingPoint section="Navigation" subtitle="Section and workspace navigation" viewport="800x500"
 */
export interface LocalNavigationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** Flat array of items or structured category groups. */
  items: LocalNavItem[] | LocalNavGroup[];
  /** Active workspace route identifier. */
  activeId: string;
  /** Section / module title header (e.g. "Quality & NCs"). */
  title?: string;
  /** Presentation variant: grouped (default), flat, or accordion. */
  variant?: 'grouped' | 'flat' | 'accordion';
  /** Density scale: compact (32px), comfortable (36px, default), expanded (44px). */
  density?: 'compact' | 'comfortable' | 'expanded';
  /** Custom router link component adapter (e.g. React Router NavLink / Next.js Link). */
  LinkComponent?: React.ComponentType<any>;
  /** Navigation click interceptor callback for SPA routing. */
  onNavigate?: (item: LocalNavItem, event: React.MouseEvent) => void;
  /** Accessible name for the <nav> landmark. Defaults to "[Title] Navigation" or "Local Navigation". */
  label?: string;
  /** Custom header slot override. */
  headerSlot?: React.ReactNode;
  /** Custom footer slot override. */
  footerSlot?: React.ReactNode;
  style?: React.CSSProperties;
}

export declare function LocalNavigation(props: LocalNavigationProps): JSX.Element;
