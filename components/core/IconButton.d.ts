import * as React from 'react';

/** Square, label-less action. Always carries an accessible label. */
export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** Lucide icon name. */
  icon: string;
  /** Required accessible name; also used as the native tooltip. */
  label: string;
  /** ghost = toolbars (default). outline = standalone. solid = accent action. danger = filled destructive (1.27.x). */
  variant?: 'ghost' | 'outline' | 'solid' | 'danger';
  /** Square, sized from `--control-h-sm|md|lg`, so it follows `[data-density]`. */
  size?: 'sm' | 'md' | 'lg';
  /** Renders the persistent selected treatment (accent tint). */
  selected?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
}
/** Forwards its ref to the underlying `<button>`. */
export declare const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;
