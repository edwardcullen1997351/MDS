import React, { useEffect, useState } from 'react';
import './Toast.css';

export type ToastStatus = 'info' | 'success' | 'warning' | 'error';

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  status?: ToastStatus;
  duration?: number; // ms, 0 = persistent
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastProps extends ToastData {
  onClose: (id: string) => void;
}

const statusIcons: Record<ToastStatus, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '🚨',
};

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  status = 'info',
  duration = 5000,
  action,
  onClose,
}) => {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!duration || duration <= 0 || isPaused) return;

    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, isPaused, onClose]);

  // Determine accessible screen reader announcement level
  const ariaLive = status === 'error' || status === 'warning' ? 'assertive' : 'polite';
  const role = status === 'error' || status === 'warning' ? 'alert' : 'status';

  return (
    <div
      role={role}
      aria-live={ariaLive}
      className={`ds-toast ds-toast--${status}`}
      onPointerEnter={() => setIsPaused(true)}
      onPointerLeave={() => setIsPaused(false)}
    >
      <span className="ds-toast__icon" aria-hidden="true">
        {statusIcons[status]}
      </span>

      <div className="ds-toast__content">
        <h4 className="ds-toast__title">{title}</h4>
        {description && <p className="ds-toast__description">{description}</p>}
        {action && (
          <div className="ds-toast__action">
            <button
              type="button"
              className="ds-button ds-button--sm ds-button--secondary"
              onClick={() => {
                action.onClick();
                onClose(id);
              }}
            >
              {action.label}
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        className="ds-toast__close"
        aria-label="Dismiss notification"
        onClick={() => onClose(id)}
      >
        ✕
      </button>
    </div>
  );
};
