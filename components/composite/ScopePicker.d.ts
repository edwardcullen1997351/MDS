import * as React from 'react';
import { TreeNode } from '../data/Tree';

/**
 * Several hierarchy nodes as ONE scope value — the cost centres a charge
 * posts against, the BOM lines a revision covers, the assets a PM plan
 * includes.
 *
 * The composite owns three contracts no part can hold alone:
 *
 * 1. **The value is a scope, not a selection.** Under `cascade` a parent
 *    stands for its descendants, so the value is normalised to the COVERING
 *    set — the shallowest nodes that imply the rest. Two encodings of one
 *    scope is how a form submits something other than it displayed.
 * 2. **Completeness.** A scope drawn from a partly-fetched hierarchy is
 *    *provisional*, and the summary says so: `Tree` sees nodes, the form sees
 *    ids, neither can tell that "Press shop" stands for four cost centres
 *    that were never loaded.
 * 3. **The query and the tree agree.** Filtering keeps matches with their
 *    ancestors and opens the path to each hit, restores the operator's own
 *    expansion when the query clears, and never touches the scope —
 *    narrowing the view must not narrow the answer.
 *
 * Owns no nodes, no expansion, no tree keyboard contract (`Tree`), no text
 * editing (`SearchField`), and no page-level empty state.
 */
export interface ScopePickerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onChange'> {
  items: TreeNode[];
  /** Required. Names the scope ("Charge scope"), the tree inside it, and the filter. */
  label: string;
  /** The covering set. Store exactly this: it is what the scope means, not which rows are ticked. */
  value?: string[];
  /** Emits the next covering set, already normalised in both directions (redundant descendants dropped, a fully selected parent rolled up). */
  onChange?: (scope: string[]) => void;
  /** A parent stands for its descendants. On by default — that reading is what makes this a scope rather than a list of ids. */
  cascade?: boolean;
  /** What one leaf is, for the summary: `unit="cost centre"` → "3 cost centres in scope". */
  unit?: string;
  /** Coordinated across the filter and the tree. `lg` sizes the field only; a tree has no `lg` row. */
  size?: 'sm' | 'md' | 'lg';
  /** The filter above the tree. Off for a hierarchy that fits without one. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** An empty scope is unacceptable: the frame goes critical and `requiredMessage` shows. */
  required?: boolean;
  /** Force the invalid frame from the product's own rule (a scope that crosses plants, a node the user may not charge). */
  invalid?: boolean;
  /** The failure in the product's words. The composite decides when a scope is unacceptable; only the product knows what it costs. */
  requiredMessage?: React.ReactNode;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  /** Not called while a filter is active — the revealed path is the composite's, not the operator's browse position. */
  onExpandedChange?: (ids: string[]) => void;
  /** Passed through to `Tree`; a selected branch in this list makes the scope provisional. */
  loadingIds?: string[];
  /** One line under the frame, replaced by `requiredMessage` when invalid. */
  hint?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function ScopePicker(props: ScopePickerProps): JSX.Element;
