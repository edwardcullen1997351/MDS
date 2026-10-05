import * as React from 'react';

/**
 * A short, inverse-surface description of the control it is attached to,
 * shown on hover and on keyboard focus. It is wired to its trigger with
 * `aria-describedby` — a *description*, never a name: if the trigger has no
 * accessible name of its own, fix the trigger.
 *
 * Never holds interactive content, never holds anything the user must read
 * to proceed, and never opens on a touch pointer. On the shared `useAnchor`
 * engine, so it is not clipped by an `overflow: hidden` ancestor and flips
 * when its side runs out of room.
 */
export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** The description. A few words, no terminal period. */
  content: React.ReactNode;
  /** Keyboard hint set in mono after the label, e.g. "⌘K". Display only. */
  shortcut?: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  /** Open delay in ms. Default 400 — and 0 while the group is warm. */
  delay?: number;
  /** Wrapping ceiling. Defaults to `--tooltip-max-width` (260px). */
  maxWidth?: number | string;
  /** Suppress entirely — for a control whose label is already visible. */
  disabled?: boolean;
  /** Controlled visibility. Escape, hover and focus stop driving it. */
  open?: boolean;
  /** The trigger. A single element receives `aria-describedby` — unless it is
   *  `disabled`, in which case the wrapper becomes the focusable stop and
   *  carries the association instead. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Tooltip(props: TooltipProps): JSX.Element;
