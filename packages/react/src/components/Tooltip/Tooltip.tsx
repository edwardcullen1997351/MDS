/* eslint-disable jsx-a11y/no-static-element-interactions -- tooltip trigger wrapper mirrors focus and pointer state for its child */
import React, {
  useState,
  useRef,
  useId,
  isValidElement,
  useEffect,
} from 'react';
import './Tooltip.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement<any>;
  placement?: TooltipPlacement;
  delay?: number;
  disabled?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 200,
  disabled = false,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  const showTooltip = () => {
    if (disabled || !content) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        hideTooltip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible]);

  useEffect(() => {
    const trigger = wrapperRef.current?.firstElementChild;
    if (!trigger) return;

    const describedBy = trigger.getAttribute('aria-describedby')?.split(/\s+/).filter(Boolean) ?? [];
    const nextIds = isVisible
      ? [...new Set([...describedBy, tooltipId])]
      : describedBy.filter((id) => id !== tooltipId);

    if (nextIds.length > 0) {
      trigger.setAttribute('aria-describedby', nextIds.join(' '));
    } else {
      trigger.removeAttribute('aria-describedby');
    }

    return () => {
      const currentIds = trigger.getAttribute('aria-describedby')?.split(/\s+/).filter(Boolean) ?? [];
      const remainingIds = currentIds.filter((id) => id !== tooltipId);
      if (remainingIds.length > 0) {
        trigger.setAttribute('aria-describedby', remainingIds.join(' '));
      } else {
        trigger.removeAttribute('aria-describedby');
      }
    };
  }, [children, isVisible, tooltipId]);

  if (!isValidElement(children)) {
    return <>{children}</>;
  }

  return (
    <div
      ref={wrapperRef}
      className={`ds-tooltip-trigger ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`ds-tooltip-content ds-tooltip-content--${placement} ${
            isVisible ? 'ds-tooltip-content--visible' : ''
          }`}
        >
          {content}
          <span className="ds-tooltip-arrow" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';
