import * as React from 'react';

/**
 * A surface attached to an edge of the app frame — a *place* beside the page,
 * where `Dialog` is a *decision* on top of it.
 *
 * Use for a record's detail beside the table it came from, a filter panel
 * beside the results it narrows, or a form about context that must stay
 * visible. For one blocking question use `Dialog`; for a small anchored panel
 * use `Popover`; for a permanent side region use layout, not a component.
 */
export interface DrawerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  open?: boolean;
  /** Required — the panel's accessible name. Warns when missing. */
  title?: React.ReactNode;
  /** One line under the title: the record's identity, not a paragraph. */
  description?: React.ReactNode;
  /** `bottom` is the sheet, for touch and for narrow viewports. */
  side?: 'right' | 'left' | 'bottom';
  /** Width for `right`/`left` (360 / 460 / 640), height for `bottom` (280 / 420 / 560). */
  size?: 'sm' | 'md' | 'lg';
  /**
   * `true` (default): scrim, focus trap, scroll lock, `aria-modal`.
   * `false`: none of those — the page beside stays readable AND usable, and
   * the panel does not claim modality it is not enforcing.
   */
  modal?: boolean;
  /** Sticky action row. Two buttons at most; the primary goes last. */
  footer?: React.ReactNode;
  /** Escape, the scrim and the close button all route through it. Required in practice. */
  onClose?: () => void;
  /** `false` blocks Escape and scrim-close AND removes the close button. */
  dismissible?: boolean;
  /** Focus this instead of the first focusable element. */
  initialFocus?: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Drawer(props: DrawerProps): JSX.Element | null;
