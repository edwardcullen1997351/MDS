import React from 'react';
import { Icon } from '../core/Icon.jsx';

/**
 * Step Navigation — Multi-Stage Process Navigation System.
 * Communicates position in a bounded multi-stage process and allows navigation among stages.
 * Supports linear validation gates, non-linear navigation, optional stages, error states, and responsive pill views.
 */

export function StepNavigation({
  steps = [],
  currentStep = 0,
  completedSteps = [],
  errorStep = null,
  isLinear = true,
  variant = 'horizontal', // 'horizontal' | 'vertical' | 'compact-pill'
  size = 'md', // 'sm' | 'md' | 'lg'
  onStepClick,
  onNext,
  onBack,
  onSkip,
  showActionControls = false,
  nextLabel = 'Save & Continue',
  backLabel = 'Back',
  skipLabel = 'Skip Step',
  label = 'Workflow step navigation',
  className = '',
  style,
  ...rest
}) {
  const total = steps.length;
  const safeCurrent = Math.max(0, Math.min(currentStep, Math.max(0, total - 1)));
  const currentStage = steps[safeCurrent] || null;

  const isStepAccessible = (index) => {
    if (steps[index]?.disabled) return false;
    if (!isLinear) return true;
    return completedSteps.includes(index) || index <= Math.max(...completedSteps, -1) + 1;
  };

  const handleNodeClick = (index) => {
    if (!isStepAccessible(index)) return;
    if (onStepClick) {
      onStepClick(index, steps[index]);
    }
  };

  const sizeStyles = {
    sm: { circleSize: 24, fontSize: '11px', titleSize: '12px', pad: '8px 12px' },
    md: { circleSize: 32, fontSize: '12px', titleSize: '13px', pad: '12px 16px' },
    lg: { circleSize: 40, fontSize: '14px', titleSize: '15px', pad: '16px 20px' }
  }[size] || { circleSize: 32, fontSize: '12px', titleSize: '13px', pad: '12px 16px' };

  if (total === 0) return null;

  return (
    <div className={`mds-step-navigation-root ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', ...style }} {...rest}>
      {/* VARIANT 1: Horizontal Stepper */}
      {variant === 'horizontal' && (
        <nav aria-label={label} className="mds-stepper-horizontal" style={{ width: '100%', padding: '12px 0' }}>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', alignItems: 'center', width: '100%' }}>
            {steps.map((stg, i) => {
              const isCompleted = completedSteps.includes(i);
              const isCurrent = i === safeCurrent;
              const isErr = i === errorStep;
              const accessible = isStepAccessible(i);

              return (
                <React.Fragment key={stg.id || i}>
                  <li style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                    <button
                      type="button"
                      disabled={!accessible}
                      onClick={() => handleNodeClick(i)}
                      aria-current={isCurrent ? 'step' : undefined}
                      aria-invalid={isErr ? 'true' : undefined}
                      aria-label={`${stg.title}${isCompleted ? ' (Completed)' : ''}${isCurrent ? ' (Current step)' : ''}${isErr ? ' (Error in step)' : ''}`}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: accessible ? 'pointer' : 'not-allowed',
                        opacity: accessible ? 1 : 0.45,
                        width: '100%',
                        maxWidth: '160px'
                      }}
                    >
                      <div
                        style={{
                          width: `${sizeStyles.circleSize}px`,
                          height: `${sizeStyles.circleSize}px`,
                          borderRadius: 'var(--radius-full)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontSize: sizeStyles.fontSize,
                          fontWeight: 'var(--weight-semibold)',
                          background: isCompleted ? 'var(--status-success-solid)' : 'var(--surface-card)',
                          color: isCompleted ? '#ffffff' : (isErr ? 'var(--status-critical-solid)' : (isCurrent ? 'var(--action-solid)' : 'var(--text-tertiary)')),
                          border: `2px solid ${isErr ? 'var(--status-critical-solid)' : (isCompleted ? 'var(--status-success-solid)' : (isCurrent ? 'var(--action-solid)' : 'var(--border-hairline)'))}`,
                          boxShadow: isCurrent ? '0 0 0 3px var(--status-info-soft)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {isErr ? '!' : (isCompleted ? '✓' : i + 1)}
                      </div>
                      <div style={{ textAlign: 'center', width: '100%' }}>
                        <div style={{ fontSize: sizeStyles.titleSize, fontWeight: isCurrent ? 'var(--weight-semibold)' : 'var(--weight-normal)', color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {stg.title}
                        </div>
                        {stg.optional && (
                          <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', display: 'block' }}>
                            (Optional)
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                  {i < total - 1 && (
                    <div
                      aria-hidden="true"
                      style={{
                        flex: 1,
                        height: '2px',
                        background: completedSteps.includes(i) ? 'var(--status-success-solid)' : 'var(--border-hairline)',
                        margin: '0 -8px 24px -8px',
                        transition: 'background 0.2s ease'
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </ol>
        </nav>
      )}

      {/* VARIANT 2: Vertical Stepper */}
      {variant === 'vertical' && (
        <nav aria-label={label} className="mds-stepper-vertical" style={{ background: 'var(--surface-card)', border: 'var(--border-hairline)', borderRadius: 'var(--radius-md)', padding: '16px' }}>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {steps.map((stg, i) => {
              const isCompleted = completedSteps.includes(i);
              const isCurrent = i === safeCurrent;
              const isErr = i === errorStep;
              const accessible = isStepAccessible(i);

              return (
                <li key={stg.id || i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <button
                    type="button"
                    disabled={!accessible}
                    onClick={() => handleNodeClick(i)}
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-invalid={isErr ? 'true' : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: accessible ? 'pointer' : 'not-allowed',
                      opacity: accessible ? 1 : 0.45,
                      textAlign: 'left'
                    }}
                  >
                    <div
                      style={{
                        width: `${sizeStyles.circleSize}px`,
                        height: `${sizeStyles.circleSize}px`,
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-mono)',
                        fontSize: sizeStyles.fontSize,
                        fontWeight: 'var(--weight-semibold)',
                        background: isCompleted ? 'var(--status-success-solid)' : 'var(--surface-card)',
                        color: isCompleted ? '#ffffff' : (isErr ? 'var(--status-critical-solid)' : (isCurrent ? 'var(--action-solid)' : 'var(--text-tertiary)')),
                        border: `2px solid ${isErr ? 'var(--status-critical-solid)' : (isCompleted ? 'var(--status-success-solid)' : (isCurrent ? 'var(--action-solid)' : 'var(--border-hairline)'))}`,
                        flexShrink: 0
                      }}
                    >
                      {isErr ? '!' : (isCompleted ? '✓' : i + 1)}
                    </div>
                    <div>
                      <div style={{ fontSize: sizeStyles.titleSize, fontWeight: isCurrent ? 'var(--weight-semibold)' : 'var(--weight-normal)', color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                        {stg.id ? `${stg.id}: ` : ''}{stg.title}
                      </div>
                      {stg.subtitle && (
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                          {stg.subtitle} {stg.optional && '· (Optional)'}
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* VARIANT 3: Compact Pill Stepper */}
      {variant === 'compact-pill' && (
        <nav
          aria-label={label}
          className="mds-stepper-compact-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-sunken)',
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            border: 'var(--border-hairline)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)', color: 'var(--action-solid)' }}>
              STAGE {safeCurrent + 1} OF {total}
            </span>
            {currentStage && (
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)', color: 'var(--text-primary)' }}>
                {currentStage.title}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  width: '24px',
                  height: '6px',
                  borderRadius: 'var(--radius-full)',
                  background: completedSteps.includes(i) ? 'var(--status-success-solid)' : (i === safeCurrent ? 'var(--action-solid)' : 'var(--border-hairline)')
                }}
              />
            ))}
          </div>
        </nav>
      )}

      {/* Optional Integrated Action Controls */}
      {showActionControls && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: 'var(--border-hairline)' }}>
          <button
            type="button"
            disabled={safeCurrent === 0}
            onClick={onBack}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              border: 'var(--border-hairline)',
              background: 'var(--surface-card)',
              color: safeCurrent === 0 ? 'var(--text-tertiary)' : 'var(--text-primary)',
              cursor: safeCurrent === 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-xs)'
            }}
          >
            ← {backLabel}
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            {currentStage?.optional && onSkip && (
              <button
                type="button"
                onClick={onSkip}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-xs)'
                }}
              >
                {skipLabel}
              </button>
            )}

            <button
              type="button"
              onClick={onNext}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'var(--action-solid)',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 'var(--weight-semibold)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'var(--text-xs)'
              }}
            >
              {safeCurrent === total - 1 ? 'Submit & Finalize ✓' : `${nextLabel} →`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
