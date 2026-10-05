import * as React from 'react';

/**
 * The run of records `Table` refuses — an activity feed, an alarm list, search
 * results. Table §01 sends "items with unlike shapes" away by name, and this is
 * where they go.
 *
 * **The row is not a control.** Interaction lives in the row's content: `href`
 * makes the title a link, `actions` holds Buttons or a Menu. `onClick` on a row
 * is the mouse-only control Card shipped in 1.15.0 and Avatar refuses outright.
 *
 * Not a `listbox` (that is `Combobox`/`MultiCombobox`, which own selectable
 * options), and not a definition list (`dl/dt/dd` — a separate component, §14).
 */
export interface ListProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** What the items are ("Recent activity", "Open alarms"). A list announces its length but not its subject. */
  label?: string;
  /** `divided` — rules between rows, no gap; the dense default. `plain` — a gap, no rules. */
  variant?: 'divided' | 'plain';
  size?: 'sm' | 'md' | 'lg';
  /** Tighten rows to the `sm` rhythm below 380px of CONTAINER width, via a container query. Opt-in — the structure never changes, only the vertical rhythm. */
  responsive?: boolean;
  /** Renders an `<ol>` and numbers the rows. Only when the NUMBER is the information — a ranking, a procedure — not merely the order things arrived in. */
  ordered?: boolean;
  /** Override the element. Rarely needed; `ordered` already picks `ol`. */
  as?: 'ul' | 'ol' | 'div';
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function List(props: ListProps): JSX.Element;

export interface ListItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title' | 'style' | 'onClick'> {
  /** An `Icon` (which gets a sunken tile), an `Avatar`, a `Badge`, a status dot. If ANY row has one, every row reserves the gutter so the titles align. */
  leading?: React.ReactNode;
  /** A manual ordinal or key; `ordered` supplies these automatically. Its OWN column, independent of `leading` — a row may carry both, and unlike the leading glyph the ordinal is never hidden from the accessibility tree. */
  marker?: React.ReactNode;
  /** One line, truncated. The part that is always read. */
  title?: React.ReactNode;
  /** Makes the TITLE a link — not the row. One tab stop, selectable text, actions still reachable. */
  href?: string;
  /** Up to two lines, clamped. A row is not a paragraph. */
  description?: React.ReactNode;
  /** Mono, one line — a timestamp, an ID, an author. */
  meta?: React.ReactNode;
  /** Trailing Buttons, an `IconButton`, a `Menu`. Where a row's commands belong. */
  actions?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function ListItem(props: ListItemProps): JSX.Element;
