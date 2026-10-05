import React, {
  forwardRef,
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useId,
} from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import './Menu.css';

interface MenuContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerId: string;
  menuId: string;
  align: 'start' | 'end';
}

const MenuContext = createContext<MenuContextValue | null>(null);

const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu compound components must be used within a <Menu>');
  }
  return context;
};

export interface MenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: 'start' | 'end';
  children: React.ReactNode;
  className?: string;
}

export const Menu: React.FC<MenuProps> = ({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  align = 'start',
  children,
  className = '',
}) => {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerId = useId();
  const menuId = useId();

  const handleOpenChange = useCallback((open: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(open);
    }
    onOpenChange?.(open);
  }, [isControlled, onOpenChange]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        handleOpenChange(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleOpenChange]);

  return (
    <MenuContext.Provider
      value={{
        isOpen,
        setIsOpen: handleOpenChange,
        triggerId,
        menuId,
        align,
      }}
    >
      <div ref={wrapperRef} className={`ds-menu-wrapper ${className}`}>
        {children}
      </div>
    </MenuContext.Provider>
  );
};

Menu.displayName = 'Menu';

export interface MenuTriggerProps {
  children: React.ReactElement<any>;
}

export const MenuTrigger: React.FC<MenuTriggerProps> = ({ children }) => {
  const { isOpen, setIsOpen, triggerId, menuId } = useMenuContext();
  const childProps = (children.props as any) || {};

  const handleClick = (e: React.MouseEvent) => {
    childProps.onClick?.(e);
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    childProps.onKeyDown?.(e);
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return React.cloneElement(children as React.ReactElement<any>, {
    id: triggerId,
    'aria-haspopup': 'menu',
    'aria-expanded': isOpen,
    'aria-controls': isOpen ? menuId : undefined,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
  } as any);
};

MenuTrigger.displayName = 'MenuTrigger';

export interface MenuContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  ({ children, className = '', ...props }, ref) => {
    const { isOpen, menuId, triggerId, align } = useMenuContext();
    const contentRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const allowedRefs = useMemo(() => [triggerRef], [triggerRef]);

    useEffect(() => {
      triggerRef.current = document.getElementById(triggerId);
    }, [triggerId]);
    useFocusTrap(contentRef, isOpen, allowedRefs);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const container = contentRef.current;
      if (!container) return;

      const items = Array.from(
        container.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])')
      );
      const currentIndex = items.findIndex((item) => item === document.activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (currentIndex + 1) % items.length;
        items[next]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (currentIndex - 1 + items.length) % items.length;
        items[prev]?.focus();
      } else if (e.key === 'Home') {
        e.preventDefault();
        items[0]?.focus();
      } else if (e.key === 'End') {
        e.preventDefault();
        items[items.length - 1]?.focus();
      }
    };

    if (!isOpen) return null;

    return (
      <div
        ref={(node) => {
          (contentRef as any).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as any).current = node;
        }}
        id={menuId}
        role="menu"
        aria-labelledby={triggerId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={`ds-menu-content ds-menu-content--align-${align} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MenuContent.displayName = 'MenuContent';

interface MenuItemBaseProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label' | 'aria-labelledby'> {
  icon?: React.ReactNode;
  shortcut?: string;
  variant?: 'default' | 'danger';
}

export type MenuItemProps = MenuItemBaseProps & (
  | { children: string | number | readonly (string | number)[]; 'aria-label'?: string; 'aria-labelledby'?: string }
  | { children?: React.ReactNode; 'aria-label': string; 'aria-labelledby'?: string }
  | { children?: React.ReactNode; 'aria-label'?: string; 'aria-labelledby': string }
);

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  (
    {
      icon,
      shortcut,
      variant = 'default',
      children,
      disabled = false,
      onClick,
      className = '',
      ...props
    },
    ref
  ) => {
    const { setIsOpen } = useMenuContext();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onClick?.(e);
      setIsOpen(false);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="menuitem"
        disabled={disabled}
        aria-disabled={disabled}
        onClick={handleClick}
        className={`ds-menu-item ds-menu-item--${variant} ${className}`}
        {...props}
      >
        <span className="ds-menu-item-main">
          {icon && <span className="ds-menu-item-icon">{icon}</span>}
          {children}
        </span>
        {shortcut && <span className="ds-menu-item-shortcut">{shortcut}</span>}
      </button>
    );
  }
);

MenuItem.displayName = 'MenuItem';

export const MenuSeparator = forwardRef<
  HTMLHRElement,
  React.HTMLAttributes<HTMLHRElement>
>(({ className = '', ...props }, ref) => (
  <hr ref={ref} className={`ds-menu-separator ${className}`} {...props} />
));

MenuSeparator.displayName = 'MenuSeparator';

export const MenuLabel = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`ds-menu-label ${className}`} {...props}>
    {children}
  </div>
));

MenuLabel.displayName = 'MenuLabel';

export const MenuGroup = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className = '', ...props }, ref) => (
  <div ref={ref} role="group" className={`ds-menu-group ${className}`} {...props}>
    {children}
  </div>
));

MenuGroup.displayName = 'MenuGroup';
