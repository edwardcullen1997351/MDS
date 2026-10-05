import React from 'react';
import { FieldContext } from './Field.jsx';

/* Selection and validation only. This component never uploads: it hands the
   caller an accepted list and a rejected list, and the caller owns transport,
   progress, retry and cancel. See specs/forms/FileDropzone.spec.html. */

const SIZES = { sm: { pad: 14, gap: 6 }, md: { pad: 22, gap: 10 } };

export function formatBytes(bytes) {
  if (bytes == null || Number.isNaN(bytes)) return '';
  if (bytes < 1024) return bytes + ' B';
  const kb = bytes / 1024;
  if (kb < 1024) return (kb < 10 ? kb.toFixed(1) : Math.round(kb)) + ' KB';
  const mb = kb / 1024;
  if (mb < 1024) return (mb < 10 ? mb.toFixed(1) : Math.round(mb)) + ' MB';
  return (mb / 1024).toFixed(1) + ' GB';
}

/* accept is matched the way the native picker matches it: extensions
   (.pdf), exact types (application/pdf) and wildcards (image/*). */
function matchesAccept(file, accept) {
  if (!accept) return true;
  const name = (file.name || '').toLowerCase();
  return accept.split(',').map((p) => p.trim().toLowerCase()).filter(Boolean).some((p) => {
    if (p.startsWith('.')) return name.endsWith(p);
    if (p.endsWith('/*')) return (file.type || '').startsWith(p.slice(0, -1));
    return (file.type || '') === p;
  });
}

export function validateFiles(files, { accept, maxSize, maxFiles, currentCount = 0 } = {}) {
  const accepted = [];
  const rejected = [];
  let room = maxFiles == null ? Infinity : Math.max(0, maxFiles - currentCount);
  for (const file of files) {
    if (!matchesAccept(file, accept)) { rejected.push({ file, reason: 'type' }); continue; }
    if (maxSize != null && file.size > maxSize) { rejected.push({ file, reason: 'size' }); continue; }
    if (room <= 0) { rejected.push({ file, reason: 'count' }); continue; }
    room -= 1;
    accepted.push(file);
  }
  return { accepted, rejected };
}

/* Extension → Lucide glyph name, for callers that render files themselves —
   a Table's name cell, a document list, an activity feed. Deliberately NOT
   used by FileItem: its §02 refuses a file-type glyph on the row, because a
   set of five drawings shows five identical icons. Names are Lucide 0.469;
   an unknown one warns loudly in Icon rather than failing silently. */
const GLYPHS = {
  'file-text': ['pdf', 'doc', 'docx', 'rtf', 'txt', 'md'],
  'file-spreadsheet': ['csv', 'xls', 'xlsx', 'tsv'],
  'file-image': ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'tif', 'tiff', 'svg'],
  'file-box': ['dwg', 'dxf', 'step', 'stp', 'iges', 'igs', 'stl', 'sldprt', 'sldasm'],
  'file-code': ['xml', 'json', 'yaml', 'yml', 'html', 'js', 'ts', 'sql'],
  'file-archive': ['zip', 'rar', '7z', 'tar', 'gz'],
  'file-audio': ['mp3', 'wav', 'm4a'],
  'file-video': ['mp4', 'mov', 'avi', 'mkv'],
};

const BY_EXT = Object.entries(GLYPHS).reduce((acc, [glyph, exts]) => {
  for (const e of exts) acc[e] = glyph;
  return acc;
}, {});

export function fileGlyph(name) {
  const ext = String(name || '').toLowerCase().split('.').pop();
  return BY_EXT[ext] || 'file';
}

export function FileDropzone({
  label = 'Drop files here, or browse',
  hint,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  currentCount = 0,
  disabled = false,
  invalid: invalidProp = false,
  size = 'md',
  onSelect,
  style,
  ...rest
}) {
  const inputRef = React.useRef(null);
  const [over, setOver] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const autoId = React.useId();
  const hintId = hint ? autoId + '-hint' : undefined;
  const s = SIZES[size] || SIZES.md;
  /* Inside a Field, the field owns the id, the description ids and the
     invalid flag — the set's label and error must reach this input.
     claimGroup() then stops the Field pointing its own <label for> at this
     id: the inner label is already a <label for> on the same input, and
     browsers CONCATENATE every label aimed at one control, which would
     announce "Revised drawing and BOM Drop the revised drawing and BOM
     here, or browse". Instead the target becomes a role="group" named by
     the field label, and the input keeps its own single name — the set is
     announced once, as the group. Same mechanism DateRangePicker uses. */
  const field = React.useContext(FieldContext);
  const id = field?.id || autoId;
  const invalid = invalidProp || !!field?.invalid;
  const describedBy = rest['aria-describedby'] ?? [field?.describedBy, hintId].filter(Boolean).join(' ') ?? undefined;
  React.useEffect(() => { field?.claimGroup?.(); }, [field]);

  if (!onSelect) {
    console.warn('[Meridian] FileDropzone: no onSelect. The component does not hold files — without a handler the selection is discarded.');
  }
  if (maxFiles != null && maxFiles > 1 && !multiple) {
    console.warn('[Meridian] FileDropzone: maxFiles > 1 with multiple={false}. The picker will only ever return one file.');
  }

  function take(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    const list = multiple ? files : files.slice(0, 1);
    const result = validateFiles(list, { accept, maxSize, maxFiles, currentCount });
    if (!multiple && files.length > 1) {
      for (const f of files.slice(1)) result.rejected.push({ file: f, reason: 'count' });
    }
    onSelect?.(result.accepted, result.rejected);
  }

  const border = disabled
    ? 'var(--border-subtle)'
    : invalid
      ? 'var(--status-critical-solid)'
      : over || hover ? 'var(--border-control-hover)' : 'var(--border-control)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, ...style }}>
      <div
        {...(field?.labelId ? { role: 'group', 'aria-labelledby': field.labelId } : null)}
        onDragOver={(e) => { if (disabled) return; e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { if (disabled) return; e.preventDefault(); setOver(false); take(e.dataTransfer?.files); }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: s.gap, padding: s.pad, textAlign: 'center', minWidth: 0,
          /* Dashed, so the target reads as a place to put something rather
             than as a card. */
          border: 'var(--border-width) dashed ' + border,
          borderRadius: 'var(--radius-md)',
          background: disabled ? 'var(--surface-disabled)' : over ? 'var(--surface-selected)' : 'var(--surface-sunken)',
          boxShadow: focus ? (invalid ? 'var(--input-focus-ring-invalid)' : 'var(--input-focus-ring)') : 'none',
          transition: 'var(--transition-control)',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          {...rest}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          required={rest.required ?? field?.required}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy || undefined}
          onFocus={(e) => { setFocus(e.target.matches(':focus-visible')); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocus(false); rest.onBlur?.(e); }}
          /* The native input stays the control — it is the keyboard, the
             accessible name and the form value. It is only visually hidden. */
          onChange={(e) => { take(e.target.files); e.target.value = ''; }}
          style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
          id={id}
        />
        <label
          htmlFor={id}
          style={{
            fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
            color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            minHeight: 'var(--control-h-sm)', display: 'inline-flex', alignItems: 'center',
          }}
        >{label}</label>
        {hint && (
          <span id={hintId} style={{ fontSize: 'var(--text-xs)', color: disabled ? 'var(--text-disabled)' : 'var(--text-tertiary)', textWrap: 'pretty' }}>{hint}</span>
        )}
      </div>
    </div>
  );
}
