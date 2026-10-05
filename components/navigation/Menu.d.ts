import * as React from 'react';

/** One command row. A bare string is shorthand for `{ label }`. */
export interface MenuItem {
  /** The command, as a short imperative phrase. */
  label?: React.ReactNode;
  /** Lucide glyph name, OR any node — an `Avatar` for a switch-account list, a colour swatch. A string routes to `Icon`; anything else renders as given (1.21.2, additive). */
  icon?: string | React.ReactNode;
  /** Keyboard equivalent, shown right-aligned and published as `aria-keyshortcuts`. Display only — you own the global handler. */
  shortcut?: string;
  /** One short qualifier under the label. Two lines maximum; a row is not a paragraph. */
  description?: React.ReactNode;
  /** `critical` for destructive commands: red label, red-tinted active row. */
  tone?: 'default' | 'critical';
  /** Unavailable but still meaningful. Stays in the list, skipped by the keyboard. */
  disabled?: boolean;
  /** Present ⇒ checkable row. Omit entirely for commands. */
  checked?: boolean;
  /** `single` marks the row as `menuitemradio` inside a one-of group. */
  selection?: 'single' | 'multiple';
  /** Keep the menu open after selection. Defaults to true for checkable rows. */
  keepOpen?: boolean;
  onSelect?: (item: MenuItem) => void;
}

/** A labelled run of rows. Headings are not focusable and cannot be selected. */
export interface MenuGroup {
  group?: React.ReactNode;
  items: Array<MenuItem | MenuGroup | 'divider' | string>;
}

/**
 * A list of commands anchored to a trigger — the system's action surface.
 * Positions through the same engine as `Popover`, `Combobox`, `Autocomplete`
 * and `Tooltip` (`useAnchor`), so it is never clipped by an ancestor's
 * `overflow: hidden`, flips when its side runs out of room, and scrolls
 * rather than running off-screen.
 *
 * Focus moves to the menu itself and the cursor is published with
 * `aria-activedescendant`; rows are not tab stops. Selecting a command
 * closes the menu and returns focus to the trigger. For values in a field
 * use `Select` or `Combobox`; for controls rather than commands use
 * `Popover`; for a blocking decision use `Dialog`.
 */
export interface MenuProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onSelect'> {
  /** The control that opens the menu. Receives `aria-haspopup="menu"` and `aria-expanded`. */
  trigger: React.ReactNode;
  items: Array<MenuItem | MenuGroup | 'divider' | string>;
  /** Accessible name of the menu — what this set of commands acts on ("Row actions", "Export"). Required in practice. */
  label?: string;
  /** Controlled open state. Omit for uncontrolled. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Fires for any selected row, after the row's own `onSelect`. */
  onSelect?: (item: MenuItem, index: number) => void;
  /** Preferred side; flips when there is not enough room. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  /** Gap between trigger and surface, in px. Default 4. */
  offset?: number;
  /** `sm` 28px rows for toolbars and table rows · `md` 32px default. */
  size?: 'sm' | 'md';
  /** Floor for the surface width, in px. Default 180. */
  minWidth?: number;
  /** Ceiling before labels truncate, in px. Default 320. */
  maxWidth?: number;
  /** Take the trigger's width — for a menu that belongs to a full-width control. */
  matchTriggerWidth?: boolean;
  style?: React.CSSProperties;
}
export declare function Menu(props: MenuProps): JSX.Element;

/** The bare row list, with no surface and no keyboard of its own — for
 *  embedding commands in a `Popover` (`padded={false}`) or a sheet. Drive
 *  `cursor`/`onCursorChange` yourself, or leave them for a static list. */
export interface MenuListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'onSelect'> {
  items: Array<MenuItem | MenuGroup | 'divider' | string>;
  size?: 'sm' | 'md';
  /** Index of the active row in the flattened list. −1 for none. */
  cursor?: number;
  onCursorChange?: (index: number) => void;
  onSelect?: (item: MenuItem, index: number) => void;
  /** Prefix for row ids, for your own `aria-activedescendant`. */
  idBase?: string;
  domRef?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
}
export declare function MenuList(props: MenuListProps): JSX.Element;
