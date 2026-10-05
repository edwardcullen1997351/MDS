import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface FloatingDataTooltipProps {
  id?: string;
  anchorRef: React.RefObject<HTMLElement | null>;
  className: string;
  children: React.ReactNode;
}

/** Places matrix detail above or below its trigger without scroll-container clipping. */
export const FloatingDataTooltip: React.FC<FloatingDataTooltipProps> = ({ id, anchorRef, className, children }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    const updatePosition = () => {
      const anchor = anchorRef.current;
      const tooltip = tooltipRef.current;
      if (!anchor || !tooltip) return;

      const anchorRect = anchor.getBoundingClientRect();
      const width = tooltip.offsetWidth;
      const height = tooltip.offsetHeight;
      const gap = 8;
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight;

      let topBoundary = gap;
      for (let parent = anchor.parentElement; parent; parent = parent.parentElement) {
        const style = window.getComputedStyle(parent);
        if (/(auto|scroll|hidden|clip)/.test(`${style.overflowX} ${style.overflowY}`)) {
          topBoundary = Math.max(gap, parent.getBoundingClientRect().top);
          break;
        }
      }

      const above = anchorRect.top - height - gap;
      const below = anchorRect.bottom + gap;
      const fitsAbove = above >= topBoundary;
      const fitsBelow = below + height <= viewportHeight - gap;
      const preferredTop = fitsAbove ? above : fitsBelow ? below :
        (anchorRect.top - topBoundary > viewportHeight - anchorRect.bottom ? above : below);
      const top = Math.max(gap, Math.min(preferredTop, viewportHeight - height - gap));
      const left = Math.max(gap, Math.min(anchorRect.left + (anchorRect.width - width) / 2, viewportWidth - width - gap));
      setPosition((current) => current?.top === top && current.left === left ? current : { top, left });
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorRef, children]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      id={id}
      ref={tooltipRef}
      className={className}
      role="tooltip"
      style={{
        position: 'fixed',
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        bottom: 'auto',
        transform: 'none',
        animation: 'none',
        zIndex: 1000,
        visibility: position ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>,
    document.body,
  );
};
