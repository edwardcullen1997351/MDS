import * as React from 'react';

/** One node. A tree's shape is DATA, not composed children — the keyboard
 *  needs the flattened visible order before layout (see `Tree`). */
export interface TreeNode {
  /** Unique across the whole tree. Expansion, selection and focus are all keyed by it. */
  id: string;
  /** One line, truncated. Also what typeahead matches on. */
  label: string;
  /** Lucide glyph name — what the node IS (`factory`, `cpu`, `component`). Never a status; status is `trailing`. */
  icon?: string;
  /** Mono, right-aligned — a quantity, a count, a code. Never a sentence. */
  meta?: React.ReactNode;
  /** A `Badge` or status dot. Static content only: a tree row is a control, so it cannot hold a nested one. */
  trailing?: React.ReactNode;
  children?: TreeNode[];
  /** A branch whose children are not loaded yet: draws a twisty, and expanding it fires `onExpandedChange` so the product can fetch. */
  hasChildren?: boolean;
  /** Focusable and announced, not selectable or activatable. A node the user must see but may not choose. */
  disabled?: boolean;
}

/**
 * A hierarchy the user walks — plant → line → station → asset, a BOM
 * explosion, a routing. The nested collection `List` (flat), `Accordion`
 * (one level, a tab stop per header), `Menu` (closes on selection) and
 * `Table` (a row group is not a parent) each refuse.
 *
 * Owns generic tree semantics (`role="tree"`/`treeitem`/`group` with level
 * and position), **expansion state separable from selection**, and one tab
 * stop with the full tree keyboard contract over the visible order.
 *
 * **The row IS a control here** — unlike `List`, which refuses a clickable
 * row. The difference is the role, the tab stop and the key handler, all of
 * which a treeitem has. What follows: no `actions` slot and no nested
 * `Checkbox` — commands and inputs inside a control are the defect, not the
 * feature. Row commands belong to the pane the selection drives.
 */
export interface TreeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  items: TreeNode[];
  /** What the hierarchy is ("Plant assets", "BOM · BRK-4820-A"). A tree announces level and position, never its subject. */
  label?: string;
  /** `md` (34px rows) for a primary browse pane; `sm` (28px) inside a Drawer or a filter rail. */
  size?: 'sm' | 'md';
  /**
   * `none` — a browse tree; a press toggles the branch and `onActivate` fires on Enter.
   * `single` — one node is the subject of a detail pane (`aria-selected`).
   * `multiple` — a set of nodes (`aria-multiselectable`); Space toggles, the row's square is an indicator, not a Checkbox.
   */
  selection?: 'none' | 'single' | 'multiple';
  /** Always a set, in every mode — `single` simply yields 0 or 1. One shape, so a consumer never branches on the mode. */
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  /** Selecting a branch selects its descendants. Off by default: it changes what a parent's selection MEANS, and only the product knows which reading applies. */
  cascade?: boolean;
  /** Controlled expansion. Pass with `onExpandedChange` when the product persists which nodes are open. */
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** Enter (and a press, when `selection` is not `none`) — open the record, navigate, run the detail fetch. */
  onActivate?: (node: TreeNode) => void;
  /** Branches currently fetching children: the row goes `aria-busy` and says "Loading…" in place of its `meta`. No placeholder child row is grown. */
  loadingIds?: string[];
  /** Hairline vertical rules down each level. On by default; off for a two-level tree, where the indent alone is unambiguous. */
  guides?: boolean;
  style?: React.CSSProperties;
}
export declare function Tree(props: TreeProps): JSX.Element;
