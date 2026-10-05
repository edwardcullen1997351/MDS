import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useId,
  useMemo,
  createContext,
  useContext,
} from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import './Drawer.css';

export type DrawerPlacement = 'right' | 'left' | 'top' | 'bottom';
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

interface DrawerContextValue {
  isOpen: boolean;
  onClose: () => void;
  titleId: string;
  descriptionId: string;
  placement: DrawerPlacement;
  size: DrawerSize;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

const useDrawerContext = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('Drawer compound components must be used within a <Drawer>');
  }
  return context;
};

export interface DrawerProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  children: React.ReactNode;
  closeOnEsc?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  open,
  onOpenChange,
  placement = 'right',
  size = 'md',
  children,
  closeOnEsc = true,
  closeOnBackdropClick = true,
  className = '',
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const allowedRefs = useMemo(() => [backdropRef], [backdropRef]);

  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !open;
  }, [open]);
  useFocusTrap(panelRef, open, allowedRefs);

  const handleClose = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEsc) {
        handleClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, closeOnEsc, handleClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <DrawerContext.Provider
      value={{
        isOpen: open,
        onClose: handleClose,
        titleId,
        descriptionId,
        placement,
        size,
      }}
    >
      <div
        ref={backdropRef}
        className={`ds-drawer-backdrop ${open ? 'ds-drawer-backdrop--open' : ''}`}
        onClick={closeOnBackdropClick ? handleClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal={open ? 'true' : undefined}
        aria-hidden={open ? undefined : true}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={`ds-drawer-panel ds-drawer-panel--${placement} ds-drawer-panel--size-${size} ${
          open ? 'ds-drawer-panel--open' : ''
        } ${className}`}
      >
        {children}
      </div>
    </DrawerContext.Provider>,
    document.body
  );
};

Drawer.displayName = 'Drawer';

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showClose?: boolean;
}

export const DrawerHeader = forwardRef<HTMLDivElement, DrawerHeaderProps>(
  ({ showClose = true, children, className = '', ...props }, ref) => {
    const { onClose } = useDrawerContext();

    return (
      <div ref={ref} className={`ds-drawer-header ${className}`} {...props}>
        <div className="ds-drawer-header-main">{children}</div>
        {showClose && (
          <button
            type="button"
            className="ds-drawer-close"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
DrawerHeader.displayName = 'DrawerHeader';

export interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  ({ as = 'h2', children, className = '', ...props }, ref) => {
    const { titleId } = useDrawerContext();
    const HeadingTag = as;

    return (
      <HeadingTag
        ref={ref}
        id={titleId}
        className={`ds-drawer-title ${className}`}
        {...props}
      >
        {children}
      </HeadingTag>
    );
  }
);
DrawerTitle.displayName = 'DrawerTitle';

export interface DrawerDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const DrawerDescription = forwardRef<HTMLParagraphElement, DrawerDescriptionProps>(
  ({ children, className = '', ...props }, ref) => {
    const { descriptionId } = useDrawerContext();

    return (
      <p
        ref={ref}
        id={descriptionId}
        className={`ds-drawer-description ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  }
);
DrawerDescription.displayName = 'DrawerDescription';

export interface DrawerBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`ds-drawer-body ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
DrawerBody.displayName = 'DrawerBody';

export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`ds-drawer-footer ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
DrawerFooter.displayName = 'DrawerFooter';
