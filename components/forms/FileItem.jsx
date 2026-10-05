import React from 'react';
import { Button } from '../core/Button.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { formatBytes } from './FileDropzone.jsx';

/* One file's identity and state. A pure representation: it owns no upload and
   no timer, and every state on screen is a prop. */

const STATE_TEXT = {
  queued: 'Queued',
  uploading: 'Uploading',
  complete: '',
  failed: 'Failed',
};

export function FileItem({
  name,
  size,
  state = 'complete',
  progress,
  error,
  meta,
  onRemove,
  onRetry,
  disabled = false,
  style,
  ...rest
}) {
  const autoId = React.useId();
  const failed = state === 'failed';
  const uploading = state === 'uploading';

  if (uploading && progress == null) {
    console.warn('[Meridian] FileItem: state="uploading" with no progress. An indeterminate upload cannot be distinguished from a stalled one — pass a number, or use state="queued".');
  }

  const secondary = [formatBytes(size), meta].filter(Boolean).join(' · ');
  const status = failed ? (error || STATE_TEXT.failed) : uploading ? Math.round(progress ?? 0) + '%' : STATE_TEXT[state];

  return (
    <div
      {...rest}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', minWidth: 0,
        padding: '8px 10px',
        border: 'var(--border-width) solid ' + (failed ? 'var(--status-critical-border)' : 'var(--border-subtle)'),
        borderRadius: 'var(--radius-sm)',
        background: failed ? 'var(--status-critical-soft)' : 'var(--surface-card)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0, flex: '1 1 auto' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }} title={name}>{name}</span>
        <span style={{ display: 'flex', gap: 8, fontSize: 'var(--text-2xs)', color: failed ? 'var(--text-critical)' : 'var(--text-tertiary)' }}>
          {secondary && <span>{secondary}</span>}
          {status && <span role={uploading || failed ? 'status' : undefined} id={autoId + '-status'}>{status}</span>}
        </span>
        {uploading && (
          /* Determinate only: the bar is the progress prop, never an animation
             the component invents. */
          <div role="progressbar" aria-valuenow={Math.round(progress ?? 0)} aria-valuemin={0} aria-valuemax={100}
            aria-label={'Uploading ' + name}
            style={{ height: 3, borderRadius: 'var(--radius-pill)', background: 'var(--surface-track)', overflow: 'hidden', marginTop: 2 }}>
            <div style={{ width: Math.max(0, Math.min(100, progress ?? 0)) + '%', height: '100%', background: 'var(--action-solid)', transition: 'width var(--duration-fast) var(--ease-out)' }} />
          </div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: '0 0 auto' }}>
        {/* Composed from the core controls rather than hand-rolled: they carry
           the density box, the hover/press tints and the focus ring. */}
        {failed && onRetry && (
          <Button variant="secondary" size="sm" iconLeft="rotate-ccw" onClick={onRetry} disabled={disabled}>Retry</Button>
        )}
        {onRemove && (
          <IconButton icon="x" size="sm" variant="ghost" disabled={disabled}
            label={(uploading ? 'Cancel upload of ' : 'Remove ') + name}
            onClick={onRemove} />
        )}
      </div>
    </div>
  );
}
