/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- comparison region is keyboard-scrollable */
import React,{ useEffect,useId,useRef } from 'react';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import './ConcurrentConflictResolver.css';

export interface ConflictFieldDiff {
  fieldKey: string;
  label: string;
  localValue: string | number;
  remoteValue: string | number;
  unit?: string;
  isConflicted?: boolean;
}

export interface ConcurrentConflictResolverProps {
  /** Controls open/close state of the resolver drawer */
  isOpen: boolean;
  /** Callback fired when user closes or cancels the drawer */
  onClose: () => void;
  /** Primary title of the conflict drawer */
  title?: string;
  /** Unique ID of the conflicting record or allocation */
  recordId?: string;
  /** Work order / resource code (e.g. RAW-EXT-ASH-05) */
  recordCode?: string;
  /** Descriptive name of the material or work order */
  recordName?: string;
  /** Local planner identifier */
  localUser?: string;
  /** Local planner role description */
  localRole?: string;
  /** Remote planner identifier */
  remoteUser?: string;
  /** Remote planner role description */
  remoteRole?: string;
  /** Local edit timestamp */
  localTimestamp?: string;
  /** Remote edit timestamp */
  remoteTimestamp?: string;
  /** Local entity ETag string */
  localEtag?: string;
  /** Remote entity ETag string */
  remoteEtag?: string;
  /** Proposed allocation quantity */
  proposedQuantity?: number;
  /** Remote reserved quantity */
  remoteQuantity?: number;
  /** Remaining available delta quantity */
  deltaQuantity?: number;
  /** Unit of measure (e.g. KG, L, Btl) */
  uom?: string;
  /** Explanation of the conflict */
  conflictReason?: string;
  /** Detailed field-by-field diff comparison */
  fields?: ConflictFieldDiff[];
  /** 1-Click Action 1: Discard local, accept remote and re-calculate matrix */
  onAcceptRemote: () => void;
  /** 1-Click Action 2: Admin force override remote state */
  onForceOverride?: () => void;
  /** 1-Click Action 3: Allocate only the remaining unreserved delta */
  onAllocateDelta: () => void;
  /** Whether the active user has administrative override rights */
  isAdmin?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Optional inline styles */
  style?: React.CSSProperties;
}

/**
 * ConcurrentConflictResolver (Wave 3 — Interaction Pattern)
 *
 * Non-destructive side-by-side comparison drawer for concurrent allocation conflicts:
 * - Prevents wiping the user's form or showing unhelpful dismissive toasts.
 * - Compares "Your Planned Change" against "Current System State" (ETag mismatch).
 * - Provides three 1-click resolution actions:
 *   1. Accept Remote & Re-calculate
 *   2. Force Override (Admin)
 *   3. Allocate Remaining Delta (e.g., 50 kg)
 */
export const ConcurrentConflictResolver: React.FC<ConcurrentConflictResolverProps> = ({
  isOpen,
  onClose,
  title = 'Concurrent Allocation Conflict Detected',
  recordId,
  recordCode = 'RAW-EXT-ASH-05',
  recordName = 'Ashwagandha Root Extract 2.5% Withanolides',
  localUser = 'You (Shift Lead)',
  localRole = 'Asclepius Food Plant F-119',
  remoteUser = 'Anantshriveda Supply Coordinator',
  remoteRole = 'RM Warehouse H-9',
  localTimestamp = 'Just now (Draft State)',
  remoteTimestamp = '2 mins ago (Committed)',
  localEtag = 'W/"109-rev1"',
  remoteEtag = 'W/"110-rev2"',
  proposedQuantity = 150,
  remoteQuantity = 100,
  deltaQuantity = 50,
  uom = 'KG',
  conflictReason = 'Another planner committed an allocation for this material while your changes were in review. ETag version mismatch prevents direct overwrite.',
  fields = [
    {
      fieldKey: 'targetLine',
      label: 'Target Work Center',
      localValue: 'Line 02 - Syrup Bottling',
      remoteValue: 'QC Holding Bay (RM Warehouse)',
      isConflicted: true,
    },
    {
      fieldKey: 'allocatedQty',
      label: 'Allocated Quantity',
      localValue: 150,
      remoteValue: 100,
      unit: 'KG',
      isConflicted: true,
    },
    {
      fieldKey: 'remainingStock',
      label: 'Available Remainder',
      localValue: 0,
      remoteValue: 50,
      unit: 'KG',
      isConflicted: true,
    },
    {
      fieldKey: 'priority',
      label: 'Dispatch Priority',
      localValue: 'HIGH',
      remoteValue: 'CRITICAL',
      isConflicted: true,
    },
  ],
  onAcceptRemote,
  onForceOverride,
  onAllocateDelta,
  isAdmin = true,
  className = '',
  style,
}) => {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const overlayId = useId();
  useFocusTrap(drawerRef, isOpen);

  // Body scroll lock and Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    // Body scroll lock
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`ds-conflict-overlay ${className}`}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={style}
    >
      <div
        ref={drawerRef}
        tabIndex={-1}
        className="ds-conflict-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${overlayId}-title`}
        aria-describedby={`${overlayId}-desc`}
      >
        {/* Header */}
        <div className="ds-conflict-header">
          <div className="ds-conflict-header__title-group">
            <div className="ds-conflict-badge">
              <span className="ds-conflict-badge__dot" aria-hidden="true" />
              <span>VERSION MISMATCH (409 CONFLICT)</span>
            </div>
            <h2 id={`${overlayId}-title`} className="ds-conflict-title">
              {title}
            </h2>
            <div className="ds-conflict-subhead">
              <span className="ds-conflict-code">{recordCode}</span>
              <span className="ds-conflict-separator" aria-hidden="true">•</span>
              <span className="ds-conflict-name">{recordName}</span>
              {recordId && (
                <>
                  <span className="ds-conflict-separator" aria-hidden="true">•</span>
                  <span className="ds-conflict-id">ID: {recordId}</span>
                </>
              )}
            </div>
          </div>
          <button
            type="button"
            className="ds-conflict-close"
            onClick={onClose}
            aria-label="Close conflict resolution drawer"
            title="Close drawer"
          >
            ✕
          </button>
        </div>

        {/* Informational Callout */}
        <div className="ds-conflict-callout" id={`${overlayId}-desc`}>
          <div className="ds-conflict-callout__icon" aria-hidden="true">⚠️</div>
          <div className="ds-conflict-callout__text">
            <strong>Allocation Preempted:</strong> {conflictReason}
            <div className="ds-conflict-callout__meta">
              <span>Local ETag: <code>{localEtag}</code></span>
              <span className="ds-conflict-separator" aria-hidden="true">•</span>
              <span>Remote ETag: <code>{remoteEtag}</code></span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Columns */}
        <div
          className="ds-conflict-body"
          tabIndex={0}
          role="region"
          aria-label="Conflict comparison details"
        >
          <div className="ds-conflict-columns">
            {/* Left Column: Your Planned Change */}
            <div className="ds-conflict-column ds-conflict-column--local">
              <div className="ds-conflict-column__header">
                <div className="ds-conflict-column__user-badge ds-conflict-column__user-badge--local">
                  <span className="ds-conflict-avatar" aria-hidden="true">👤</span>
                  <div>
                    <div className="ds-conflict-user-name">{localUser}</div>
                    <div className="ds-conflict-user-role">{localRole}</div>
                  </div>
                </div>
                <div className="ds-conflict-column__status-tag">YOUR PLANNED CHANGE</div>
              </div>

              <div className="ds-conflict-hero-metric">
                <span className="ds-conflict-hero-metric__label">Requested Allocation</span>
                <div className="ds-conflict-hero-metric__value">
                  {proposedQuantity} <span className="ds-conflict-hero-metric__uom">{uom}</span>
                </div>
                <span className="ds-conflict-hero-metric__subtext">Target: Line 02</span>
              </div>

              <div className="ds-conflict-field-list">
                {fields.map((f) => (
                  <div key={f.fieldKey} className="ds-conflict-field-item">
                    <span className="ds-conflict-field-label">{f.label}</span>
                    <span className="ds-conflict-field-value ds-conflict-field-value--local">
                      {f.localValue} {f.unit || ''}
                    </span>
                  </div>
                ))}
              </div>

              <div className="ds-conflict-column__timestamp">
                Created: {localTimestamp}
              </div>
            </div>

            {/* Visual Versus Divider */}
            <div className="ds-conflict-versus" aria-hidden="true">
              <span className="ds-conflict-versus__line" />
              <span className="ds-conflict-versus__badge">VS</span>
              <span className="ds-conflict-versus__line" />
            </div>

            {/* Right Column: Current System State */}
            <div className="ds-conflict-column ds-conflict-column--remote">
              <div className="ds-conflict-column__header">
                <div className="ds-conflict-column__user-badge ds-conflict-column__user-badge--remote">
                  <span className="ds-conflict-avatar" aria-hidden="true">🏢</span>
                  <div>
                    <div className="ds-conflict-user-name">{remoteUser}</div>
                    <div className="ds-conflict-user-role">{remoteRole}</div>
                  </div>
                </div>
                <div className="ds-conflict-column__status-tag ds-conflict-column__status-tag--remote">
                  CURRENT SYSTEM STATE
                </div>
              </div>

              <div className="ds-conflict-hero-metric ds-conflict-hero-metric--remote">
                <span className="ds-conflict-hero-metric__label">Reserved by Remote</span>
                <div className="ds-conflict-hero-metric__value">
                  {remoteQuantity} <span className="ds-conflict-hero-metric__uom">{uom}</span>
                </div>
                <span className="ds-conflict-hero-metric__subtext">
                  Available Delta: <strong className="ds-conflict-delta-badge">+{deltaQuantity} {uom} Divergence</strong>
                </span>
              </div>

              <div className="ds-conflict-field-list">
                {fields.map((f) => (
                  <div key={f.fieldKey} className="ds-conflict-field-item">
                    <span className="ds-conflict-field-label">{f.label}</span>
                    <span className="ds-conflict-field-value ds-conflict-field-value--remote">
                      {f.remoteValue} {f.unit || ''}
                    </span>
                  </div>
                ))}
              </div>

              <div className="ds-conflict-column__timestamp">
                Committed: {remoteTimestamp}
              </div>
            </div>
          </div>
        </div>

        {/* 1-Click Action Resolution Footer */}
        <div className="ds-conflict-footer">
          <div className="ds-conflict-footer__info">
            Choose an automated resolution pathway to preserve ledger integrity:
          </div>
          <div className="ds-conflict-footer__actions">
            {/* Action 1: Discard local, accept remote and re-calculate */}
            <button
              type="button"
              className="ds-conflict-action ds-conflict-action--accept-remote"
              onClick={onAcceptRemote}
            >
              <span className="ds-conflict-action__icon" aria-hidden="true">⟲</span>
              <span className="ds-conflict-action__content">
                <span className="ds-conflict-action__title">Accept Remote & Re-calculate</span>
                <span className="ds-conflict-action__desc">Sync latest warehouse reservation (100 {uom})</span>
              </span>
            </button>

            {/* Action 3: Allocate Remaining Delta */}
            <button
              type="button"
              className="ds-conflict-action ds-conflict-action--allocate-delta"
              onClick={onAllocateDelta}
            >
              <span className="ds-conflict-action__icon" aria-hidden="true">✓</span>
              <span className="ds-conflict-action__content">
                <span className="ds-conflict-action__title">
                  Allocate Remaining Delta ({deltaQuantity} {uom})
                </span>
                <span className="ds-conflict-action__desc">Claim leftover balance without conflict</span>
              </span>
            </button>

            {/* Action 2: Force Override (Admin) */}
            {isAdmin && onForceOverride && (
              <button
                type="button"
                className="ds-conflict-action ds-conflict-action--force-override"
                onClick={onForceOverride}
              >
                <span className="ds-conflict-action__icon" aria-hidden="true">⚡</span>
                <span className="ds-conflict-action__content">
                  <span className="ds-conflict-action__title">Force Override (Admin)</span>
                  <span className="ds-conflict-action__desc">Overwrite remote state with planned 150 {uom}</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
