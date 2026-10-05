import React, { useId, createContext, useContext, useMemo, useRef } from 'react';
import * as dialog from '@zag-js/dialog';
import { useMachine, normalizeProps, Portal } from '@zag-js/react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import './Dialog.css';

interface DialogContextValue {
  api: dialog.Api;
  open: boolean;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export const useDialogContext = () => {
  return useContext(DialogContext);
};

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  children: React.ReactNode | ((api: dialog.Api) => React.ReactNode);
  id?: string;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  id: customId,
  closeOnOutsideClick = true,
  closeOnEscape = true,
}) => {
  const generatedId = useId();
  const id = customId || generatedId;

  const [state, send] = useMachine(
    dialog.machine({
      id,
      open: open !== undefined ? open : defaultOpen,
      closeOnInteractOutside: closeOnOutsideClick,
      closeOnEscape,
      onOpenChange(details) {
        onOpenChange?.(details);
      },
    }),
    {
      context: {
        open: open !== undefined ? open : defaultOpen,
        closeOnInteractOutside: closeOnOutsideClick,
        closeOnEscape,
      },
    }
  );

  const api = dialog.connect(state, send, normalizeProps);
  const isDialogActive = open !== undefined ? open : api.open;

  const content =
    typeof children === 'function'
      ? (children as (api: dialog.Api) => React.ReactNode)(api)
      : children;

  return (
    <DialogContext.Provider value={{ api, open: isDialogActive }}>
      {content}
    </DialogContext.Provider>
  );
};

Dialog.displayName = 'Dialog';

export interface DialogContentProps {
  api?: dialog.Api;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
  className?: string;
}

export const DialogContent: React.FC<DialogContentProps> = ({
  api: propApi,
  children,
  size = 'md',
  showCloseButton = true,
  className = '',
}) => {
  const ctx = useDialogContext();
  const api = propApi || ctx?.api;
  const isOpen = ctx?.open ?? api?.open ?? false;

  if (!isOpen || !api) return null;

  return <DialogSurface api={api} size={size} showCloseButton={showCloseButton} className={className}>{children}</DialogSurface>;
};

const DialogSurface: React.FC<Required<Pick<DialogContentProps, 'children' | 'size' | 'showCloseButton' | 'className'>> & { api: dialog.Api }> = ({ api, children, size, showCloseButton, className }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const allowedRefs = useMemo(() => [backdropRef], [backdropRef]);
  useFocusTrap(contentRef, true, allowedRefs);

  return (
    <Portal>
      <div {...api.getBackdropProps()} ref={backdropRef} className="ds-dialog-backdrop" />
      <div {...api.getPositionerProps()} className="ds-dialog-positioner">
        <div
          {...api.getContentProps()}
          ref={contentRef}
          tabIndex={-1}
          className={`ds-dialog-content ds-dialog-content--${size} ${className}`}
        >
          {showCloseButton && (
            <button
              type="button"
              {...api.getCloseTriggerProps()}
              className="ds-dialog-close-trigger"
              aria-label="Close dialog"
            >
              ✕
            </button>
          )}
          {children}
        </div>
      </div>
    </Portal>
  );
};

DialogContent.displayName = 'DialogContent';

export interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  className = '',
}) => <div className={`ds-dialog-header ${className}`}>{children}</div>;

DialogHeader.displayName = 'DialogHeader';

export interface DialogTitleProps {
  api?: dialog.Api;
  children: React.ReactNode;
  className?: string;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({
  api: propApi,
  children,
  className = '',
}) => {
  const ctx = useDialogContext();
  const api = propApi || ctx?.api;

  return (
    <h2
      {...(api ? api.getTitleProps() : {})}
      className={`ds-dialog-title ${className}`}
    >
      {children}
    </h2>
  );
};

DialogTitle.displayName = 'DialogTitle';

export interface DialogDescriptionProps {
  api?: dialog.Api;
  children: React.ReactNode;
  className?: string;
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
  api: propApi,
  children,
  className = '',
}) => {
  const ctx = useDialogContext();
  const api = propApi || ctx?.api;

  return (
    <p
      {...(api ? api.getDescriptionProps() : {})}
      className={`ds-dialog-description ${className}`}
    >
      {children}
    </p>
  );
};

DialogDescription.displayName = 'DialogDescription';

export interface DialogBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogBody: React.FC<DialogBodyProps> = ({
  children,
  className = '',
}) => <div className={`ds-dialog-body ${className}`}>{children}</div>;

DialogBody.displayName = 'DialogBody';

export interface DialogFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({
  children,
  className = '',
}) => <div className={`ds-dialog-footer ${className}`}>{children}</div>;

DialogFooter.displayName = 'DialogFooter';
