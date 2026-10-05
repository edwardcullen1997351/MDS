import React, { forwardRef } from 'react';
import { Button, ButtonVariant, ButtonSize } from '../Button/index.js';
import { Menu, MenuTrigger, MenuContent } from '../Menu/index.js';
import './SplitButton.css';

export interface SplitButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: string | number;
  menu: React.ReactNode;
  alignMenu?: 'start' | 'end';
  className?: string;
}

export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      onClick,
      children,
      menu,
      alignMenu = 'end',
      className = '',
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`ds-split-button ds-split-button--${variant} ${className}`}
      >
        <Button
          variant={variant}
          size={size}
          disabled={disabled}
          onClick={onClick}
          className="ds-split-button-action"
        >
          {children}
        </Button>

        <Menu align={alignMenu}>
          <MenuTrigger>
            <Button
              variant={variant}
              size={size}
              disabled={disabled}
              aria-label="Open related actions"
              className="ds-split-button-trigger"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Button>
          </MenuTrigger>
          <MenuContent>{menu}</MenuContent>
        </Menu>
      </div>
    );
  }
);

SplitButton.displayName = 'SplitButton';
