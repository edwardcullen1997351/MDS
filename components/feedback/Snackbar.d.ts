import * as React from 'react';

/**
 * One line of text and one action, anchored to the bottom of the surface that
 * raised it. Declarative and singular: the surface owns `open`, and a new
 * message replaces the current one rather than stacking.
 */
export interface SnackbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  open?: boolean;
  /** One clause, past tense, no full stop. Truncates rather than wrapping. */
  message?: React.ReactNode;
  /** A single `variant="link"` Button — Undo, Retry, View. Never two. */
  action?: React.ReactNode;
  /** Called by the timer and by the dismiss button. Required for auto-dismiss. */
  onDismiss?: () => void;
  /** Milliseconds, or null to persist. Restarts when `message` changes. */
  duration?: number | null;
  size?: 'sm' | 'md';
  /** `container` positions against the nearest positioned ancestor; `page` is fixed at --z-snackbar. */
  scope?: 'container' | 'page';
  /** `attached` sits flush on the container's bottom edge — no radius, no shadow. */
  placement?: 'floating' | 'attached';
  align?: 'center' | 'start';
  /** false removes the dismiss button — legal only when the bar expires on its own. */
  dismissible?: boolean;
  style?: React.CSSProperties;
}
export declare function Snackbar(props: SnackbarProps): JSX.Element;
