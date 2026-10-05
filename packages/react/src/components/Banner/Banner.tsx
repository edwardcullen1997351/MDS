import React, { useState } from 'react';
import './Banner.css';

export type BannerStatus = 'info' | 'success' | 'warning' | 'error';

export interface BannerProps {
  title?: string;
  children?: React.ReactNode;
  status?: BannerStatus;
  isDismissible?: boolean;
  onDismiss?: () => void;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const statusIcons: Record<BannerStatus, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '🚨',
};

export const Banner: React.FC<BannerProps> = ({
  title,
  children,
  status = 'info',
  isDismissible = false,
  onDismiss,
  action,
  icon,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const role = status === 'error' || status === 'warning' ? 'alert' : 'status';

  return (
    <div role={role} className={`ds-banner ds-banner--${status} ${className}`}>
      <span className="ds-banner__icon" aria-hidden="true">
        {icon || statusIcons[status]}
      </span>

      <div className="ds-banner__content">
        {title && <strong className="ds-banner__title">{title}</strong>}
        {children && <div className="ds-banner__description">{children}</div>}
        {action && <div className="ds-banner__action">{action}</div>}
      </div>

      {isDismissible && (
        <button
          type="button"
          className="ds-banner__close"
          aria-label="Dismiss banner"
          onClick={handleDismiss}
        >
          ✕
        </button>
      )}
    </div>
  );
};
