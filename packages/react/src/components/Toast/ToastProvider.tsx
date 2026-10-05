import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastData, ToastStatus } from './Toast.js';
import './Toast.css';

interface ToastOptions {
  title: string;
  description?: string;
  status?: ToastStatus;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toast: {
    show: (options: ToastOptions) => string;
    success: (title: string, description?: string) => string;
    error: (title: string, description?: string) => string;
    warning: (title: string, description?: string) => string;
    info: (title: string, description?: string) => string;
    dismiss: (id: string) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return context.toast;
};

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-center' | 'bottom-right';
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (options: ToastOptions): string => {
      const id = `ds-toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const newToast: ToastData = {
        id,
        ...options,
      };
      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const success = useCallback(
    (title: string, description?: string) => show({ title, description, status: 'success' }),
    [show]
  );

  const error = useCallback(
    (title: string, description?: string) => show({ title, description, status: 'error' }),
    [show]
  );

  const warning = useCallback(
    (title: string, description?: string) => show({ title, description, status: 'warning' }),
    [show]
  );

  const info = useCallback(
    (title: string, description?: string) => show({ title, description, status: 'info' }),
    [show]
  );

  return (
    <ToastContext.Provider value={{ toast: { show, success, error, warning, info, dismiss } }}>
      {children}
      <div className={`ds-toast-container ds-toast-container--${position}`} role="status" aria-label="Notifications">
        {toasts.map((toastItem) => (
          <Toast key={toastItem.id} {...toastItem} onClose={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
