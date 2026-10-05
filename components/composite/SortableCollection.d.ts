import * as React from 'react';

/** What a row is told about itself when the consumer uses `renderItem`. */
export interface SortableItemState {
  /** Zero-based position in `items`. */
  index: number;
  /** One-based position, as it is stated to the user. */
  position: number;
  total: number;
  /** This item is in hand. */
  grabbed: boolean;
  /** Where it would land, while grabbed. `null` otherwise. */
  proposedIndex: number | null;
  /** The reason this item cannot be moved, from `canMove`. `null` when it can. */
  immovable: string | null;
}

/**
 * The mechanics of moving an item to a new position: the grab, the modal
 * keyboard grab, the insertion indicator, the legality check for every
 * candidate position, bounded auto-scroll, and the announcements.
 *
 * **It does not own the move.** `items` is the committed order and this
 * component never reorders it. A legal drop calls
 * `onMove(id, fromIndex, toIndex)`; the consumer decides what to commit, what
 * to show while the write is in flight, and what happens when it fails. A
 * component that reordered its own prop would be exactly the optimistic
 * mutation the pattern refuses — see the
 * [direct manipulation of order](../../specs/patterns/DirectManipulationOfOrder.spec.html)
 * pattern, §04 and §10, which this component is the promoted mechanics of.
 *
 * NOT `Table`'s column sort — that is a view, and nothing is committed. NOT a
 * transfer between two collections, which stays a pattern because its commit
 * spans two collections. NOT a general drag-and-drop surface.
 */
export interface SortableCollectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style' | 'children'> {
  /**
   * The committed order, as stable identities. Never indices, and never the
   * item objects — identity is what a grab holds and what survives someone
   * else reordering the collection underneath it. Required.
   */
  items: string[];
  /**
   * What the collection is ("Routing sequence"). Names it in announcements and
   * on the list itself. Required: a position announced with no subject is
   * unusable when two sortable collections are on one screen.
   */
  label: string;
  /**
   * How an item is named, by what it IS — `(id) => 'op 30 Deburr'`. Required.
   * The index is the thing being changed and cannot also be the name.
   */
  itemName: (id: string) => string;
  /**
   * A legal drop happened. The component has already left grabbed state and
   * announced the move as starting; the consumer commits, and only its own
   * success changes `items`. Nothing here is optimistic.
   */
  onMove: (id: string, fromIndex: number, toIndex: number) => void;
  /**
   * Declared legality, evaluated locally for every candidate position while
   * the item is in hand. Return `true` for a legal position, or **the reason**
   * as a string for a refusal — "Op 50 CNC bore is pinned to fixture FX-2210".
   * `false` is accepted with a warning and rendered as a generic refusal,
   * because a refusal that names no rule cannot be acted on.
   *
   * `nextOrder` is the order that would result, so a rule can be written over
   * the whole sequence rather than over a delta.
   */
  canDrop?: (id: string, toIndex: number, nextOrder: string[]) => true | string | false;
  /**
   * Whether this item can move at all. Return `true`, or the reason it is
   * pinned — the handle is then disabled and carries that reason as its
   * accessible name, instead of grabbing and refusing everywhere.
   */
  canMove?: (id: string) => true | string | false;
  /**
   * One node per item, **in `items` order** — the row's own content. The
   * component supplies the row wrapper, the handle, the steppers, the
   * insertion indicator and the position text around it. The usual form, and
   * the one that keeps row markup editable.
   */
  children?: React.ReactNode;
  /** The alternative to `children` for consumers that would rather map. Ignored when `children` is present. */
  renderItem?: (id: string, state: SortableItemState) => React.ReactNode;
  /**
   * `handle-and-steppers` (default) — the grab handle plus Earlier/Later, so a
   * destination off screen is reachable without holding an item across a
   * scroll. `handle` — handle only. `none` warns: it leaves the drag as the
   * only route, which is not a route for a gloved hand on a tablet.
   */
  moveControls?: 'handle-and-steppers' | 'handle' | 'none';
  /** `position-and-neighbours` (default) states what the item now follows and precedes; `position-only` for long collections where that becomes noise. */
  announcementScope?: 'position-and-neighbours' | 'position-only';
  /** Every announcement, also handed to you — for a visible status line of your own. The component still announces unless `liveRegion` is false. */
  onAnnounce?: (text: string) => void;
  /** Set false only when `onAnnounce` feeds a live region you own. Two live regions announce twice. */
  liveRegion?: boolean;
  /** The grab as it changes: `{ id, originIndex, proposedIndex }` or `null`. For a status line or a state inspector — not a way to drive the grab. */
  onGrabChange?: (grab: { id: string; originIndex: number; proposedIndex: number } | null) => void;
  /** Reordering unavailable — a foreign sort is applied, or the user may not resequence. Pair with `disabledReason`. */
  disabled?: boolean;
  /** Why reordering is unavailable. Announced, and carried on every handle. */
  disabledReason?: string;
  /** Bounded scrolling of the nearest scrollable ancestor near its edges during a pointer drag. Default true. */
  autoScroll?: boolean;
  /** One control height for the handle and the steppers, tracking `--control-h-*`. Default `md`. */
  size?: 'sm' | 'md' | 'lg';
  /** `ul` (default), `ol` where the NUMBER is the information, or `div`. */
  as?: 'ul' | 'ol' | 'div';
  /** Layout only — merged onto the list. */
  style?: React.CSSProperties;
}
export declare function SortableCollection(props: SortableCollectionProps): JSX.Element;
