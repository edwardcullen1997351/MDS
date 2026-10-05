import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * Sequential Navigation — Ordered Sequence Navigation System.
 * Moves directly to the preceding or following destination in a fixed, ordered sequence.
 * Ideal for SOPs, machine operating manuals, calibration workflows, and audit checklists.
 */

export function SequentialNavigation({
  items = [],
  currentIndex = 0,
  onNavigate,
  variant = 'preview-cards', // 'preview-cards' | 'standard-bar' | 'progress-strip' | 'single-direction'
  size = 'md', // 'sm' | 'md' | 'lg'
  allowWrap = false,
  showProgress = false,
  enableShortcuts = false,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  label = 'Sequential navigation',
  className = '',
  style,
  ...rest
}) {
  const total = items.length;
  const safeIndex = Math.max(0, Math.min(currentIndex, Math.max(0, total - 1)));

  const currentItem = items[safeIndex] || null;

  const hasPrev = safeIndex > 0 || (allowWrap && total > 1);
  const hasNext = safeIndex < total - 1 || (allowWrap && total > 1);

  const prevIndex = safeIndex > 0 ? safeIndex - 1 : (allowWrap && total > 1 ? total - 1 : null);
  const nextIndex = safeIndex < total - 1 ? safeIndex + 1 : (allowWrap && total > 1 ? 0 : null);

  const prevItem = prevIndex !== null ? items[prevIndex] : null;
  const nextItem = nextIndex !== null ? items[nextIndex] : null;

  const handlePrev = (e) => {
    e?.preventDefault();
    if (prevIndex !== null && onNavigate && prevItem) {
      onNavigate(prevIndex, prevItem, 'prev');
    }
  };

  const handleNext = (e) => {
    e?.preventDefault();
    if (nextIndex !== null && onNavigate && nextItem) {
      onNavigate(nextIndex, nextItem, 'next');
    }
  };

  // Keyboard shortcut listener (Alt+ArrowLeft / Alt+ArrowRight or [/])
  React.useEffect(() => {
    if (!enableShortcuts) return;

    const handleKeyDown = (e) => {
      // Don't intercept when user is typing in form inputs
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || document.activeElement?.isContentEditable) {
        return;
      }

      if ((e.altKey && e.key === 'ArrowLeft') || e.key === '[') {
        if (hasPrev) {
          e.preventDefault();
          handlePrev();
        }
      } else if ((e.altKey && e.key === 'ArrowRight') || e.key === ']') {
        if (hasNext) {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enableShortcuts, hasPrev, hasNext, prevIndex, nextIndex, prevItem, nextItem, onNavigate]);

  const pct = total > 0 ? Math.round(((safeIndex + 1) / total) * 100) : 0;

  // Size padding and font styling
  const sizeStyles = {
    sm: { cardPadding: '8px 12px', btnPadding: '4px 10px', fontSize: '11px', titleSize: '13px' },
    md: { cardPadding: '14px 18px', btnPadding: '8px 16px', fontSize: '12px', titleSize: '14px' },
    lg: { cardPadding: '18px 24px', btnPadding: '12px 20px', fontSize: '13px', titleSize: '16px' }
  }[size] || { cardPadding: '14px 18px', btnPadding: '8px 16px', fontSize: '12px', titleSize: '14px' };

  if (total === 0) {
    return null;
  }

  // VARIANT 1: Preview Cards
  if (variant === 'preview-cards') {
    return (
      <nav
        aria-label={label}
        className={`mds-sequential-nav mds-seq-preview-cards ${className}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          width: '100%',
          ...style
        }}
        {...rest}
      >
        {/* Previous Card */}
        {prevItem ? (
          <a
            href={prevItem.href || '#'}
            onClick={handlePrev}
            className="mds-seq-card mds-seq-card-prev"
            aria-label={`${prevLabel}: ${prevItem.id ? prevItem.id + ' ' : ''}${prevItem.title}`}
            style={{
              background: 'var(--surface-card)',
              border: 'var(--border-hairline)',
              borderRadius: 'var(--radius-md)',
              padding: sizeStyles.cardPadding,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              textDecoration: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--text-tertiary)' }}>
              <span>← {prevLabel}</span>
              {prevItem.id && <span style={{ color: 'var(--text-secondary)' }}>({prevItem.id})</span>}
            </div>
            <div style={{ fontSize: sizeStyles.titleSize, fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {prevItem.title}
            </div>
            {prevItem.subtitle && (
              <div style={{ fontSize: sizeStyles.fontSize, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {prevItem.subtitle}
              </div>
            )}
          </a>
        ) : (
          <div
            className="mds-seq-card mds-seq-card-prev mds-seq-disabled"
            aria-disabled="true"
            style={{
              background: 'var(--surface-card)',
              border: 'var(--border-hairline)',
              borderRadius: 'var(--radius-md)',
              padding: sizeStyles.cardPadding,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              opacity: 0.38,
              cursor: 'not-allowed',
              textAlign: 'left'
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--text-tertiary)' }}>
              ← {prevLabel}
            </div>
            <div style={{ fontSize: sizeStyles.titleSize, fontWeight: 'var(--weight-semibold)', color: 'var(--text-tertiary)' }}>
              Start of Sequence
            </div>
          </div>
        )}

        {/* Next Card */}
        {nextItem ? (
          <a
            href={nextItem.href || '#'}
            onClick={handleNext}
            className="mds-seq-card mds-seq-card-next"
            aria-label={`${nextLabel}: ${nextItem.id ? nextItem.id + ' ' : ''}${nextItem.title}`}
            style={{
              background: 'var(--surface-card)',
              border: 'var(--border-hairline)',
              borderRadius: 'var(--radius-md)',
              padding: sizeStyles.cardPadding,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              textDecoration: 'none',
              cursor: 'pointer',
              textAlign: 'right',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--text-tertiary)' }}>
              {nextItem.id && <span style={{ color: 'var(--text-secondary)' }}>({nextItem.id})</span>}
              <span>{nextLabel} →</span>
            </div>
            <div style={{ fontSize: sizeStyles.titleSize, fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {nextItem.title}
            </div>
            {nextItem.subtitle && (
              <div style={{ fontSize: sizeStyles.fontSize, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {nextItem.subtitle}
              </div>
            )}
          </a>
        ) : (
          <div
            className="mds-seq-card mds-seq-card-next mds-seq-disabled"
            aria-disabled="true"
            style={{
              background: 'var(--surface-card)',
              border: 'var(--border-hairline)',
              borderRadius: 'var(--radius-md)',
              padding: sizeStyles.cardPadding,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              opacity: 0.38,
              cursor: 'not-allowed',
              textAlign: 'right'
            }}
          >
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', color: 'var(--text-tertiary)' }}>
              {nextLabel} →
            </div>
            <div style={{ fontSize: sizeStyles.titleSize, fontWeight: 'var(--weight-semibold)', color: 'var(--text-tertiary)' }}>
              Sequence Complete
            </div>
          </div>
        )}
      </nav>
    );
  }

  // VARIANT 2: Standard Bar
  if (variant === 'standard-bar') {
    return (
      <nav
        aria-label={label}
        className={`mds-sequential-nav mds-seq-standard-bar ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 18px',
          background: 'var(--surface-card)',
          border: 'var(--border-hairline)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xs)',
          width: '100%',
          flexWrap: 'wrap',
          gap: '12px',
          ...style
        }}
        {...rest}
      >
        <button
          type="button"
          disabled={!hasPrev}
          onClick={handlePrev}
          aria-label={prevItem ? `${prevLabel}: ${prevItem.title}` : 'Previous unavailable'}
          style={{
            padding: sizeStyles.btnPadding,
            borderRadius: 'var(--radius-sm)',
            border: 'var(--border-hairline)',
            background: 'var(--surface-card)',
            color: hasPrev ? 'var(--text-primary)' : 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
            fontSize: sizeStyles.fontSize,
            cursor: hasPrev ? 'pointer' : 'not-allowed',
            opacity: hasPrev ? 1 : 0.4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ← {prevLabel}: {prevItem ? (prevItem.id || prevItem.title.slice(0, 16)) : 'Start'}
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: sizeStyles.fontSize, fontWeight: 'var(--weight-semibold)', color: 'var(--text-primary)' }}>
            Step {safeIndex + 1} of {total}
          </span>
          {currentItem && (
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentItem.title}
            </span>
          )}
        </div>

        <button
          type="button"
          disabled={!hasNext}
          onClick={handleNext}
          aria-label={nextItem ? `${nextLabel}: ${nextItem.title}` : 'Next unavailable'}
          style={{
            padding: sizeStyles.btnPadding,
            borderRadius: 'var(--radius-sm)',
            border: 'var(--border-hairline)',
            background: hasNext ? 'var(--action-solid)' : 'var(--surface-card)',
            color: hasNext ? '#ffffff' : 'var(--text-tertiary)',
            fontFamily: 'var(--font-mono)',
            fontSize: sizeStyles.fontSize,
            cursor: hasNext ? 'pointer' : 'not-allowed',
            opacity: hasNext ? 1 : 0.4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {nextLabel}: {nextItem ? (nextItem.id || nextItem.title.slice(0, 16)) : 'End'} →
        </button>
      </nav>
    );
  }

  // VARIANT 3: Progress Strip
  if (variant === 'progress-strip') {
    return (
      <nav
        aria-label={label}
        className={`mds-sequential-nav mds-seq-progress-strip ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          padding: '14px 18px',
          background: 'var(--surface-card)',
          border: 'var(--border-hairline)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-xs)',
          width: '100%',
          ...style
        }}
        {...rest}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>
            PROGRESS: {pct}% COMPLETED
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>
            {total - safeIndex - 1} STEPS REMAINING
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={safeIndex + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label="Sequence progress"
          style={{
            height: '4px',
            background: 'var(--surface-sunken)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            position: 'relative',
            width: '100%'
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'var(--action-solid)',
              borderRadius: 'var(--radius-full)',
              width: `${pct}%`,
              transition: 'width 0.24s cubic-bezier(0,0,0.2,1)'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
          <button
            type="button"
            disabled={!hasPrev}
            onClick={handlePrev}
            aria-label={prevItem ? `${prevLabel}: ${prevItem.title}` : 'Previous unavailable'}
            style={{
              background: 'transparent',
              border: 'none',
              color: hasPrev ? 'var(--text-secondary)' : 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)',
              fontSize: sizeStyles.fontSize,
              cursor: hasPrev ? 'pointer' : 'not-allowed',
              opacity: hasPrev ? 1 : 0.4,
              padding: '4px 8px'
            }}
          >
            ← {prevItem ? `${prevItem.id || ''} ${prevItem.title.slice(0, 20)}...` : 'Start'}
          </button>

          <span style={{ fontFamily: 'var(--font-mono)', fontSize: sizeStyles.fontSize, color: 'var(--text-secondary)' }}>
            {safeIndex + 1} / {total}
          </span>

          <button
            type="button"
            disabled={!hasNext}
            onClick={handleNext}
            aria-label={nextItem ? `${nextLabel}: ${nextItem.title}` : 'Next unavailable'}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'var(--border-hairline)',
              background: 'var(--surface-sunken)',
              color: hasNext ? 'var(--text-primary)' : 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)',
              fontSize: sizeStyles.fontSize,
              cursor: hasNext ? 'pointer' : 'not-allowed',
              opacity: hasNext ? 1 : 0.4
            }}
          >
            {nextItem ? `${nextItem.id || ''} ${nextItem.title.slice(0, 20)}...` : 'Complete'} →
          </button>
        </div>
      </nav>
    );
  }

  // VARIANT 4: Single Direction (Forward Continuation)
  return (
    <nav
      aria-label={label}
      className={`mds-sequential-nav mds-seq-single-direction ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '12px 18px',
        background: 'var(--surface-card)',
        border: 'var(--border-hairline)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-xs)',
        width: '100%',
        ...style
      }}
      {...rest}
    >
      <div style={{ marginRight: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)' }}>
          STEP {safeIndex + 1} OF {total}
        </span>
        {currentItem && (
          <span style={{ fontSize: sizeStyles.fontSize, fontWeight: 'var(--weight-medium)', color: 'var(--text-secondary)' }}>
            {currentItem.title}
          </span>
        )}
      </div>

      <button
        type="button"
        disabled={!hasNext}
        onClick={handleNext}
        aria-label={nextItem ? `Continue to ${nextItem.title}` : 'Sequence complete'}
        style={{
          padding: sizeStyles.btnPadding,
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--action-solid)',
          background: hasNext ? 'var(--action-solid)' : 'var(--surface-card)',
          color: hasNext ? '#ffffff' : 'var(--text-tertiary)',
          fontFamily: 'var(--font-mono)',
          fontSize: sizeStyles.fontSize,
          cursor: hasNext ? 'pointer' : 'not-allowed',
          opacity: hasNext ? 1 : 0.4,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {nextItem ? `Continue to ${nextItem.id || nextItem.title} →` : 'Complete Sequence ✓'}
      </button>
    </nav>
  );
}
