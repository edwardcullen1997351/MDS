import * as React from 'react';

export interface GlobalNavItem {
  /** Unique route or destination identifier. */
  id: string;
  /** Destination name (concise noun, max 24 characters). */
  label: string;
  /** Destination route URL. */
  href?: string;
  /** Lucide icon name displayed before the label. */
  icon?: string;
  /** Numeric count or string alert badge (e.g. 14 open work orders). */
  badge?: string | number;
  /** Inactive or insufficient role permissions. */
  disabled?: boolean;
  /** Tooltip explanation for permission restrictions. */
  disabledReason?: string;
  /** Subordinate child destinations (sub-trees). */
  children?: GlobalNavItem[];
}

export interface PlantContext {
  company?: string;
  plant?: string;
  location?: string;
}

export interface UserProfileContext {
  name?: string;
  role?: string;
  avatar?: string;
}

/**
 * Global Navigation — L1 Information Architecture wayfinding system.
 * @startingPoint section="Navigation" subtitle="Primary application shell navigation" viewport="800x600"
 */
export interface GlobalNavigationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** Ordered set of primary L1 destinations. */
  items: GlobalNavItem[];
  /** Active top-level destination identifier. */
  activeId: string;
  /** Presentation variant: sidebar (default 240px), rail (compact 56px), topbar (horizontal header). */
  variant?: 'sidebar' | 'rail' | 'topbar';
  /** Controlled collapsed state for vertical sidebar/rail presentations. */
  collapsed?: boolean;
  /** Callback fired when the collapse trigger is activated. */
  onCollapseChange?: (collapsed: boolean) => void;
  /** Density scale: compact (32px), comfortable (40px, default), expanded (48px). */
  density?: 'compact' | 'comfortable' | 'expanded';
  /** Plant header branding context (e.g. Suryodaya Autocomp PL-04). */
  plantContext?: PlantContext;
  /** Logged-in operator profile rendered in the utility footer. */
  userProfile?: UserProfileContext;
  /** Custom router link component adapter (e.g. React Router NavLink / Next.js Link). */
  LinkComponent?: React.ComponentType<any>;
  /** Navigation click interceptor callback for SPA routing. */
  onNavigate?: (item: GlobalNavItem, event: React.MouseEvent) => void;
  /** Accessible name for the <nav> landmark. Defaults to "Primary Navigation". */
  label?: string;
  /** DOM ID of the main content container for the skip-navigation link. Defaults to "main-content". */
  skipTarget?: string;
  /** Custom header slot override. */
  headerSlot?: React.ReactNode;
  /** Custom footer slot override. */
  footerSlot?: React.ReactNode;
  style?: React.CSSProperties;
}

export declare function GlobalNavigation(props: GlobalNavigationProps): JSX.Element;
