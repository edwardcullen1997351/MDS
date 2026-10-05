import * as React from 'react';

export interface MenuNavItem {
  /** Unique destination identifier. */
  id: string;
  /** Destination name (noun, 1–3 words). */
  label: string;
  /** Target route URL. */
  href?: string;
  /** Optional Lucide icon name. */
  icon?: string;
  /** Status badge count or text. */
  badge?: string | number;
  /** Inactive or restricted destination flag. */
  disabled?: boolean;
  /** Tooltip explanation for disabled destination. */
  disabledReason?: string;
  /** Optional nested flyout submenu items. */
  children?: MenuNavItem[];
}

export interface MenuNavGroup {
  /** Group title (e.g. "Plant Operations", "Enterprise Services"). */
  group?: string;
  /** Destination items in this group. */
  items: MenuNavItem[];
}

/**
 * Menu Navigation — Transient Popover Navigation System.
 * @startingPoint section="Navigation" subtitle="On-demand destination popover menu" viewport="600x400"
 */
export interface MenuNavigationProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Trigger element that toggles the popover navigation menu. */
  trigger: React.ReactNode;
  /** Destination items array or grouped structure. */
  items: MenuNavItem[] | MenuNavGroup[];
  /** Active destination identifier. */
  activeId?: string;
  /** Placement alignment: bottom-start (default), bottom-end, top-start, top-end. */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  /** Accessible name for the <nav> landmark. Defaults to "Quick Navigation". */
  label?: string;
  /** Custom router link component adapter. */
  LinkComponent?: React.ComponentType<any>;
  /** Navigation callback fired when a destination is chosen. */
  onNavigate?: (item: MenuNavItem, event: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

export declare function MenuNavigation(props: MenuNavigationProps): JSX.Element;
