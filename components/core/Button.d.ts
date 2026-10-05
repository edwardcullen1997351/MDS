import * as React from 'react';

/**
 * Primary action control.
 */
export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** primary = one per view. secondary = default. ghost = toolbars. danger = destructive. link = inline. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
  /** sm 28px / md 34px (default) / lg 40px. */
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon name rendered before the label. */
  iconLeft?: string;
  /** Lucide icon name rendered after the label. */
  iconRight?: string;
  /** Swaps the leading icon for a spinner glyph and blocks interaction. */
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
/** Forwards its ref to the underlying `<button>` — what makes `Dialog`/`Drawer` `initialFocus` real. */
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
