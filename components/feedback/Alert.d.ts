import * as React from 'react';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

/**
 * A condition, stated in the page flow, that stays until the condition does.
 * No timer, no position, no portal — the product controls it by rendering it.
 */
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  tone?: AlertTone;
  /** One line naming the condition. Scannable; the body explains it. */
  title?: React.ReactNode;
  /** The explanation and, if there is one, what to do about it. */
  children?: React.ReactNode;
  /** Override the tone's icon by name, or `false` to remove it. */
  icon?: string | false;
  /** Up to two Buttons — secondary emphasis; the alert is not a call to action. */
  action?: React.ReactNode;
  /** Renders the dismiss button. Only for an alert the user may legitimately silence. */
  onDismiss?: () => void;
  size?: 'sm' | 'md';
  /** `banner` spans the frame edge to edge: no radius, a bottom rule and a tone accent bar. */
  variant?: 'inline' | 'banner';
  /** `on` announces an alert that APPEARS. Leave off for one present at load. */
  live?: 'off' | 'on';
  style?: React.CSSProperties;
}
export declare function Alert(props: AlertProps): JSX.Element;
