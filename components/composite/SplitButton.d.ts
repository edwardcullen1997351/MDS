import * as React from 'react';
import type { MenuItem, MenuGroup } from '../navigation/Menu';

/** One alternative action. `id` is required in practice — selection is
 *  reported by identity, not by position. */
export interface SplitButtonAction extends MenuItem {
  /** Stable identifier, carried back to `onSelect` unchanged. */
  id?: string;
}

/**
 * One default action with its close alternatives one press away:
 * `[Save][⌄]`.
 *
 * The composite owns the *relationship*: which action is primary, that the
 * disclosure never invokes it, one aggregate disabled state across both
 * surfaces, two distinct accessible purposes, matched geometry and a single
 * seam, and the menu's ownership by the cap rather than by the lettered
 * half. `Button`, `IconButton` and `Menu` keep every behaviour they already
 * have.
 *
 * NOT `ButtonGroup` — that is peer actions with no default. NOT a `Menu`
 * with a lettered trigger — that has no primary action at all. NOT a way to
 * save horizontal space.
 */
export interface SplitButtonProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onSelect'> {
  /**
   * The primary action's wording, and the accessible name of the group. Also
   * the root of the disclosure's name ("More <label> actions") and the
   * menu's ("<label> actions"), which is what keeps two split buttons on one
   * screen distinguishable. Required.
   */
  label: string;
  /** Richer visible content for the primary half. `label` stays the accessible name. */
  children?: React.ReactNode;
  /** The primary action fired. Never fires when the menu is opened. */
  onAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * The alternatives, in `Menu`'s item vocabulary — `'divider'` and
   * `{ group, items }` included. Genuine alternatives to the primary action
   * only; an empty list means this should have been a `Button`.
   */
  actions?: Array<SplitButtonAction | MenuGroup | 'divider'>;
  /** An alternative was chosen. Receives the action object you passed, not a copy. */
  onSelect?: (action: SplitButtonAction, index: number) => void;
  /**
   * `primary` (default) a solid default action · `secondary` outlined ·
   * `ghost` for a toolbar or table row · `danger` a filled destructive
   * default. `link` is refused with a console warning and renders as
   * `secondary` (see the spec, §04).
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** One height for both halves, tracking `--control-h-*` at any density. */
  size?: 'sm' | 'md' | 'lg';
  /** Leading glyph on the primary half. The trailing glyph is the disclosure's. */
  iconLeft?: string;
  /** Primary action in flight. The alternatives stay reachable. */
  loading?: boolean;
  /** Aggregate: disables the primary half and the disclosure together. */
  disabled?: boolean;
  /** Controlled menu open state. Omit for uncontrolled — the composite owns the trigger relationship either way. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Overrides the menu's accessible name. Default `"<label> actions"`. */
  menuLabel?: string;
  /** Overrides the disclosure's accessible name. Default `"More <label> actions"`. */
  disclosureLabel?: string;
  /** Disclosure glyph. Default `chevron-down`. */
  disclosureIcon?: string;
  /** Preferred menu side; flips when there is no room. Default `bottom`. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Default `end` — the menu hangs from the cap it belongs to. */
  align?: 'start' | 'center' | 'end';
  /** Menu row height. Defaults to `sm` for an `sm` control, otherwise `md`. */
  menuSize?: 'sm' | 'md';
  /** Layout only — merged onto the group wrapper. */
  style?: React.CSSProperties;
}
export declare function SplitButton(props: SplitButtonProps): JSX.Element;
