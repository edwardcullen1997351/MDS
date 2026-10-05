import React, { forwardRef } from 'react';
import { Button, type ButtonBaseProps } from './Button.js';

/** Icon-only actions must provide a name independent of the icon artwork. */
export type IconButtonProps = ButtonBaseProps & {
  icon: React.ReactNode;
  children?: never;
} & (
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-label'?: string; 'aria-labelledby': string }
);

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({ icon, ...props }, ref) => (
  <Button ref={ref} {...props}>{icon}</Button>
));

IconButton.displayName = 'IconButton';
