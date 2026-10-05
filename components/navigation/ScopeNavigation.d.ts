import * as React from 'react';

export interface ScopeItem {
  /** Unique immutable scope identifier (e.g. 'PL-04', 'CHAKAN-PROD'). */
  id: string;
  /** Display name of the scope (e.g. 'Chakan Plant (PL-04)'). */
  name: string;
  /** Geographical region or organizational hierarchy group (e.g. 'Western Region · Pune'). */
  region?: string;
  /** Facility description or facility subtype (e.g. 'Heavy Press & CNC Shop'). */
  type?: string;
  /** Environment classification: 'PROD' | 'SANDBOX' | 'STAGING'. */
  env?: 'PROD' | 'SANDBOX' | 'STAGING';
  /** Regulatory GSTIN or registration tax number. */
  gst?: string;
  /** Short 2-letter avatar label text (defaults to first 2 characters of ID). */
  avatarText?: string;
  /** Whether the user has permission to access this scope. Default: true. */
  accessible?: boolean;
  /** Textual explanation displayed when scope is locked/unavailable. */
  lockReason?: string;
  /** Additional arbitrary metadata. */
  metadata?: Record<string, any>;
}

/**
 * Scope Navigation — Contextual Scope / Plant / Tenant Navigation System.
 * @startingPoint section="Navigation" subtitle="Organizational plant and tenant scope switcher" viewport="800x260"
 */
export interface ScopeNavigationProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** Array of available organizational scopes. */
  scopes: ScopeItem[];
  /** Currently active scope identifier. */
  currentScopeId: string;
  /** Callback fired when user selects a new scope. */
  onScopeChange: (newScopeId: string, scope: ScopeItem) => void;
  /** Presentation variant: 'standard-dropdown' (default), 'hierarchical-grouped', 'banner-mode'. */
  variant?: 'standard-dropdown' | 'hierarchical-grouped' | 'banner-mode';
  /** Trigger density scale: 'sm' | 'md' | 'lg'. Default: 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to render typeahead search input inside the popover picker. Default: true. */
  showSearch?: boolean;
  /** Placeholder text for search filter. Default: "Search plant or workspace...". */
  searchPlaceholder?: string;
  /** Accessible landmark / dialog label. Default: "Organizational scope selector". */
  label?: string;
  /** Custom CSS style object. */
  style?: React.CSSProperties;
}

export declare function ScopeNavigation(props: ScopeNavigationProps): JSX.Element;
