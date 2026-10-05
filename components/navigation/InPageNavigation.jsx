import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * In-Page Navigation — Table of Contents / On-This-Page Navigation System.
 * Provides direct navigation to named sections within a single page or continuous view.
 * Features built-in scrollspy tracking, heading indentation levels, deep linking, and header offsets.
 */

export function InPageNavigation({
  sections = [],
  activeId: controlledActiveId,
  autoScrollspy = true,
  onSectionClick,
  variant = 'sidebar', // 'sidebar' | 'floating-rail' | 'compact-menu'
  size = 'md', // 'sm' | 'md' | 'lg'
  title = 'On This Page',
  headerOffset = 64,
  smoothScroll = true,
  label = 'On this page',
  className = '',
  style,
  ...rest
}) {
  const [internalActiveId, setInternalActiveId] = React.useState(sections[0]?.id || '');
  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;

  // Scrollspy observer using IntersectionObserver
  React.useEffect(() => {
    if (!autoScrollspy || typeof window === 'undefined' || !('IntersectionObserver' in window) || sections.length === 0) {
      return;
    }

    const sectionElements = sections
      .map(s => document.getElementById(s.id))
      .filter(Boolean);

    if (sectionElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInternalActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: `-${headerOffset}px 0px -60% 0px`,
        threshold: 0.1
      }
    );

    sectionElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [autoScrollspy, sections, headerOffset]);

  const handleLinkClick = (id, e) => {
    if (onSectionClick) {
      onSectionClick(id, e);
    }

    if (!e.defaultPrevented) {
      const targetEl = document.getElementById(id);
      if (targetEl) {
        e.preventDefault();
        setInternalActiveId(id);
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: targetPos,
          behavior: smoothScroll ? 'smooth' : 'auto'
        });

        // Update URL hash without forcing hard scroll jump
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', `#${id}`);
        }
      }
    }
  };

  const sizeStyles = {
    sm: { pad: '4px 8px', font: '11px', indent: 14, titleFont: '10px' },
    md: { pad: '6px 10px', font: '12px', indent: 18, titleFont: '11px' },
    lg: { pad: '8px 14px', font: '13px', indent: 22, titleFont: '12px' }
  }[size] || { pad: '6px 10px', font: '12px', indent: 18, titleFont: '11px' };

  if (sections.length === 0) return null;

  return (
    <nav
      aria-label={label}
      className={`mds-inpage-navigation mds-inpage-${variant} ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
        ...style
      }}
      {...rest}
    >
      {title && (
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: sizeStyles.titleFont,
            textTransform: 'uppercase',
            letterSpacing: 'var(--tracking-caps)',
            color: 'var(--text-tertiary)',
            fontWeight: 'var(--weight-semibold)',
            padding: '0 4px'
          }}
        >
          {title}
        </div>
      )}

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: variant === 'compact-menu' ? 'row' : 'column',
          flexWrap: variant === 'compact-menu' ? 'wrap' : 'nowrap',
          gap: '2px'
        }}
      >
        {sections.map((sec) => {
          const isActive = activeId === sec.id;
          const isLvl3 = sec.level === 3;

          return (
            <li key={sec.id} style={{ width: variant === 'compact-menu' ? 'auto' : '100%' }}>
              <a
                href={`#${sec.id}`}
                onClick={(e) => handleLinkClick(sec.id, e)}
                aria-current={isActive ? 'location' : undefined}
                className={`mds-inpage-link ${isActive ? 'active' : ''}`}
                style={{
                  display: 'block',
                  padding: sizeStyles.pad,
                  paddingLeft: isLvl3 && variant !== 'compact-menu' ? `${sizeStyles.indent}px` : sizeStyles.pad.split(' ')[1],
                  borderRadius: 'var(--radius-xs)',
                  fontSize: isLvl3 ? '11px' : sizeStyles.font,
                  color: isActive ? 'var(--action-solid)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 'var(--weight-semibold)' : 'var(--weight-normal)',
                  background: isActive ? 'var(--surface-sunken)' : 'transparent',
                  borderLeft: variant !== 'compact-menu' ? `2px solid ${isActive ? 'var(--action-solid)' : 'transparent'}` : 'none',
                  textDecoration: 'none',
                  transition: 'all 0.12s ease',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {sec.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
