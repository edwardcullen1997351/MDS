import * as React from 'react';

/**
 * The system's modal — for a decision or a short focused form. There is no
 * separate `Modal` component; this is it.
 *
 * Traps focus, restores it on close, locks page scroll, and is labelled by
 * its own title. Positions absolutely inside the nearest positioned
 * ancestor, so it works inside a framed mock.
 */
export interface DialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  open?: boolean;
  /** Required: the accessible name. A question for a decision, a noun phrase for a form. */
  title: React.ReactNode;
  /** Supporting sentence under the title — say what will happen, including what is irreversible. */
  description?: React.ReactNode;
  /** danger colours the title for destructive confirmations. */
  tone?: 'default' | 'danger';
  /** sm 400 / md 520 (default) / lg 720 px, from --dialog-width-*. */
  width?: 'sm' | 'md' | 'lg';
  /** Right-aligned action row: cancel first, confirm last. */
  footer?: React.ReactNode;
  /** Called on scrim mousedown, close button and Escape. */
  onClose?: () => void;
  /** false blocks Escape and scrim-close and removes the X — only for work in progress that would be lost. */
  dismissible?: boolean;
  /** Where focus lands on open. Defaults to the first focusable element. */
  initialFocus?: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Dialog(props: DialogProps): JSX.Element | null;
