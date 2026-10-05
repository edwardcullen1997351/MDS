import React from 'react';
import { Field } from '../forms/Field.jsx';
import { FileDropzone } from '../forms/FileDropzone.jsx';
import { FileItem } from '../forms/FileItem.jsx';

/* FileUpload — one attachment set on one record.
   Specified at 1.29.0, built at 1.30.0. See specs/composite/FileUpload.spec.html.

   The composite owns the thing neither part can see: whether the SET is
   finished. FileDropzone knows only the last drop; FileItem knows only its
   own row. Nothing here is stored — value in, onChange out, status derived
   on every render — because the queue belongs to whoever owns the transport. */

const REASON = {
  type: 'is not an accepted file type',
  size: 'is over the size limit',
  count: 'is over the file limit',
};

/* invalid → failed → busy → idle. `failed` outranks `busy` deliberately: three
   files uploading and one failed is a failed set, because the operator has
   something to do NOW and a spinner would hide it. */
export function deriveStatus(value = [], { required = false, rejected = 0 } = {}) {
  if (rejected > 0 || (required && value.length === 0)) return 'invalid';
  if (value.some((f) => f.state === 'failed')) return 'failed';
  if (value.some((f) => f.state === 'uploading' || f.state === 'queued')) return 'busy';
  return 'idle';
}

const newId = () =>
  (globalThis.crypto?.randomUUID?.() || 'f' + Math.random().toString(36).slice(2, 10));

export function FileUpload({
  value = [],
  onChange,
  label,
  targetLabel,
  hint,
  error,
  required = false,
  requiredMessage,
  showRequired = false,
  accept,
  maxSize,
  maxFiles,
  size = 'md',
  disabled = false,
  onStatusChange,
  style,
  ...rest
}) {
  const wrapRef = React.useRef(null);
  const [rejections, setRejections] = React.useState([]);
  const [announcement, setAnnouncement] = React.useState('');
  /* Set after a removal: which row index should hold focus once the list has
     re-rendered. Focus lost to the document body is the most common
     composite-level a11y defect there is (§08). */
  const [focusRow, setFocusRow] = React.useState(null);
  /* An empty required set is invalid from mount — the Release button must be
     blocked immediately — but the MESSAGE waits until the operator has
     touched the set, or until the surface says a submit was attempted. A form
     that reddens before anyone has done anything teaches people to ignore it;
     the same reason DateRangePicker tracks `touched`. Found by building a
     real surface against this composite, not by the specification — see
     templates/evidence-attachment, the consumer that survives. */
  const [touched, setTouched] = React.useState(false);


  /* A single file cap means the picker itself should be single-select. */
  const multiple = maxFiles !== 1;

  /* Deferred by a tick rather than checked during render: a streamed Design
     Component template renders first with label="{{ heading }}" unresolved,
     and a hole that resolves on the next tick clears the timeout before it
     fires. A genuinely nameless set still warns. */
  React.useEffect(() => {
    if (label) return undefined;
    const t = window.setTimeout(() => {
      console.warn('[Meridian] FileUpload: no label. The set is ONE form field with several values; the label names the set, and the dropzone borrows it as the group name.');
    }, 0);
    return () => window.clearTimeout(t);
  }, [label]);

  const status = deriveStatus(value, { required, rejected: rejections.length });
  const lastStatus = React.useRef(null);
  React.useEffect(() => {
    if (lastStatus.current === status) return;
    lastStatus.current = status;
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  /* The composite consumes rejections rather than passing them through: this
     is the one place reason codes become sentences, so they are written once
     (§10, §13). */
  const derivedError =
    error ??
    (rejections.length
      ? rejections.length === 1
        ? rejections[0]
        : `${rejections.length} files were refused: ${rejections.join('; ')}`
      : status === 'failed'
        ? 'One file did not upload. Retry it, or remove it.'
        : status === 'invalid' && (touched || showRequired)
          ? (requiredMessage ?? 'At least one file is required.')
          : undefined);

  React.useEffect(() => {
    if (focusRow == null) return;
    const rows = wrapRef.current?.querySelectorAll('[data-file-row]') || [];
    const row = rows[Math.min(focusRow, rows.length - 1)];
    const buttons = row?.querySelectorAll('button');
    if (buttons?.length) buttons[buttons.length - 1].focus();
    else wrapRef.current?.querySelector('input[type="file"]')?.focus();
    setFocusRow(null);
  }, [focusRow, value.length]);

  /* Fired at the moment a write would be lost, rather than during render: a
     Design Component template renders once with its {{ }} holes unresolved,
     so a render-time check warned on every DC that mounts this component
     even when a handler was wired. Same defect class as Field's
     conditionally-mounted live region — a diagnostic that cries wolf. */
  function warnIfUnwired(what) {
    if (!onChange) {
      console.warn('[Meridian] FileUpload: ' + what + ' was discarded — no onChange. The set is controlled, so the queue lives with whoever owns the transport; without a handler nothing the operator does survives.');
    }
  }

  function onSelect(accepted, rejected) {
    warnIfUnwired(accepted.length + ' file(s)');
    setTouched(true);
    setRejections(rejected.map((r) => `${r.file.name} ${REASON[r.reason]}`));
    const added = accepted.map((file) => ({
      id: newId(), file, name: file.name, size: file.size, state: 'queued',
    }));
    if (added.length) onChange?.([...value, ...added]);
    /* A drag-and-drop gesture gives a non-visual user no other feedback. */
    const parts = [];
    if (added.length) parts.push(`${added.length} file${added.length === 1 ? '' : 's'} added`);
    if (rejected.length) parts.push(`${rejected.length} refused`);
    setAnnouncement(parts.join(', '));
  }

  function removeAt(index) {
    if (disabled) return;
    warnIfUnwired('a removal');
    setTouched(true);
    const next = value.filter((_, i) => i !== index);
    onChange?.(next);
    setRejections([]);
    setAnnouncement(`${value[index]?.name} removed`);
    setFocusRow(next.length ? index : null);
    if (!next.length) {
      window.setTimeout(() => wrapRef.current?.querySelector('input[type="file"]')?.focus(), 0);
    }
  }

  function patch(index, changes) {
    onChange?.(value.map((f, i) => (i === index ? { ...f, ...changes } : f)));
  }

  return (
    <div ref={wrapRef} {...rest} style={{ minWidth: 0, ...style }}>
      {/* `hint` is the RULES line, and it goes to the dropzone rather than to
          the Field: Field renders its hint after its children, which would put
          "up to 20 MB each" below the target and below the rows the user has
          already dropped (§08 reading order, §10). */}
      <Field label={label} error={derivedError} required={required}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
          <FileDropzone
            size={size}
            label={targetLabel}
            hint={hint}
            accept={accept}
            multiple={multiple}
            maxSize={maxSize}
            maxFiles={maxFiles}
            /* Supplied, not accepted: the composite can see the set, so a
               caller never has to keep currentCount in step with it. */
            currentCount={value.length}
            disabled={disabled}
            onSelect={onSelect}
          />
          {value.map((f, i) => (
            <FileItem
              key={f.id ?? i}
              data-file-row=""
              name={f.name}
              size={f.size}
              meta={f.meta}
              state={f.state}
              progress={f.progress}
              error={f.error}
              disabled={disabled}
              /* The handlers stay, and `disabled` makes them inert: a released
                 record's rows should still read as rows that once had actions
                 (§13). Omitting them would silently turn a frozen row into a
                 read-only one, which is a different thing. */
              onRemove={() => removeAt(i)}
              onRetry={f.state === 'failed'
                ? (f.onRetry ? () => f.onRetry(f) : () => patch(i, { state: 'uploading', progress: 0, error: undefined }))
                : undefined}
            />
          ))}
        </div>
      </Field>
      <span aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>{announcement}</span>
    </div>
  );
}
