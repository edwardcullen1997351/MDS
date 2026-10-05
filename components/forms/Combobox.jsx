import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { FieldContext } from './Field.jsx';
import { useAnchor, anchorStyle } from '../core/anchor.js';

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };
const PX = { sm: 'var(--control-px-sm)', md: 'var(--control-px-md)', lg: 'var(--control-px-lg)' };
/* 16px at lg is the largest type iOS Safari will not zoom to on focus, and a
   Combobox focuses its input on every open — the zoom would fire constantly. */
const FS = { sm: 'var(--text-xs)', md: 'var(--text-sm)', lg: 'var(--text-lg)' };
const IS = { sm: 14, md: 14, lg: 16 };
const LIST_MAX = 264; /* ~8 single-line options; past that the list scrolls */

const norm = (o) => (typeof o === 'string' ? { value: o, label: o } : o);
const defaultFilter = (o, q) => o.label.toLowerCase().includes(q) || (o.description || '').toLowerCase().includes(q);

/** Bold the matched run so the user can see WHY a row is in the list. */
function Match({ text, query }) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark style={{ background: 'none', color: 'var(--combobox-option-match-text)', fontWeight: 'var(--weight-semibold)' }}>{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

export function Combobox({
  options = [],
  value,
  onChange,
  onSearch,
  filter,
  placeholder,
  emptyMessage = 'No matches',
  loading = false,
  size = 'md',
  invalid = false,
  disabled = false,
  style,
  ...rest
}) {
  const field = React.useContext(FieldContext);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  /* `dirty` is what separates "opened, showing the current value" from "typing
     a search". Without it, opening a Combobox whose value is Frankfurt filters
     the list down to Frankfurt alone — the one row the user does not need. */
  const [dirty, setDirty] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const [hover, setHover] = React.useState(false);

  const wrapRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);
  const surfaceRef = React.useRef(null);
  const baseId = React.useId();
  const listId = baseId + '-list';
  /* Geometry lives in useAnchor (1.5.0) — the list is `position: fixed`, so an
     ancestor's `overflow: hidden` cannot clip it, and the engine measures and
     caps the surface it styles. This component shipped that code first; the
     extraction removed ~60 lines from it unchanged. */
  const pos = useAnchor(wrapRef, surfaceRef, { open, matchWidth: true, max: LIST_MAX });

  const id = rest.id ?? field?.id;
  const describedBy = rest['aria-describedby'] ?? field?.describedBy;
  const isInvalid = invalid || !!field?.invalid;
  const named = id != null || rest['aria-label'] != null || rest['aria-labelledby'] != null;

  const items = React.useMemo(() => options.map(norm), [options]);
  const selected = items.find((o) => o.value === value);
  const q = query.trim().toLowerCase();
  const shown = React.useMemo(() => {
    if (filter === false || !dirty || !q) return items;
    const fn = typeof filter === 'function' ? filter : defaultFilter;
    return items.filter((o) => fn(o, q));
  }, [items, q, dirty, filter]);

  if (!named) {
    console.warn('[Meridian] Combobox: no accessible name. The placeholder is not a label — it is replaced by the chosen value and stops being announced. Wrap the control in <Field label="…"> or pass aria-label.');
  }
  if (isInvalid && !describedBy) {
    console.warn('[Meridian] Combobox: `invalid` with no aria-describedby. A red border is a colour-only cue (WCAG 1.4.1) and announces nothing — pass the message through <Field error="…">.');
  }
  if (onSearch && filter !== false) {
    console.warn('[Meridian] Combobox: `onSearch` without `filter={false}` filters server results a second time on the client, so rows the server matched on a field you do not render will vanish. Pass filter={false} when the server does the matching.');
  }
  /* `value &&`, not `value != null`: an empty string is the normal initial
     state of a controlled Combobox (React.useState('')), and nothing is
     missing from the list when nothing is selected. Warning on it fired on
     every render and buried the genuine warnings. */
  if (value && !selected && items.length > 0) {
    console.warn(`[Meridian] Combobox: value "${value}" is not in \`options\`, so the control renders empty and the user cannot see what is selected. Keep the selected option in the list even when it falls outside the current search.`);
  }

  /* Close on outside pointer-down, not click: a click that starts inside the
     list and ends outside would otherwise commit nothing and leave it open. */
  React.useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) close(); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  /* Keep the active option in view without scrollIntoView, which would scroll
     the page as well as the list. The surface is the scroll box — it is the
     element the engine caps — and rows are laid out against it, since a
     fixed surface is their offsetParent. */
  React.useEffect(() => {
    if (!open || active < 0 || !listRef.current) return;
    const el = listRef.current.children[active];
    const box = surfaceRef.current;
    if (!el || !box) return;
    if (el.offsetTop < box.scrollTop) box.scrollTop = el.offsetTop;
    else if (el.offsetTop + el.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTop = el.offsetTop + el.offsetHeight - box.clientHeight;
    }
  }, [active, open, shown.length]);

  /* A fixed list does not travel with its field — useAnchor owns that now. */

  function openList(seedActive) {
    if (disabled) return;
    setQuery(selected?.label ?? '');
    setDirty(false);
    setActive(seedActive === 'selected' && selected ? items.indexOf(selected) : -1);
    setOpen(true);
  }
  function close() { setOpen(false); setDirty(false); setActive(-1); }
  function commit(opt) {
    if (!opt) return;
    onChange?.(opt.value);
    close();
    inputRef.current?.focus();
  }

  function onKeyDown(e) {
    if (disabled) return;
    const last = shown.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) return openList('selected');
        return setActive((i) => (i >= last ? 0 : i + 1));
      case 'ArrowUp':
        e.preventDefault();
        if (!open) return openList('selected');
        return setActive((i) => (i <= 0 ? last : i - 1));
      case 'Home': if (open) { e.preventDefault(); setActive(0); } return;
      case 'End': if (open) { e.preventDefault(); setActive(last); } return;
      case 'Enter':
        /* Only swallow Enter when it has a row to commit; otherwise it must
           reach the form and submit, exactly as in a plain Input. */
        if (open && active >= 0) { e.preventDefault(); commit(shown[active]); }
        else if (open) close();
        return;
      case 'Escape': if (open) { e.preventDefault(); close(); } return;
      case 'Tab':
        /* Tab commits the highlighted row — a user who typed "fra", arrowed to
           Frankfurt and tabbed away means Frankfurt. Nothing highlighted
           reverts to the committed value; half-typed text is never a value. */
        if (open && active >= 0) commit(shown[active]);
        else close();
        return;
      default:
        return;
    }
  }

  const border = isInvalid
    ? 'var(--input-border-invalid)'
    : open
      ? 'var(--input-border-focus)'
      : hover && !disabled
        ? 'var(--input-border-hover)'
        : 'var(--input-border)';
  const px = PX[size] || PX.md;
  const iconPx = IS[size] || IS.md;
  const status = loading ? 'Searching…' : shown.length === 0 ? emptyMessage : null;

  return (
    <div ref={wrapRef} style={{ position: 'relative', minWidth: 0, ...style }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          height: H[size] || H.md,
          background: disabled ? 'var(--input-background-disabled)' : 'var(--input-background)',
          border: `var(--border-width) solid ${border}`,
          borderRadius: 'var(--input-radius)',
          boxShadow: open ? (isInvalid ? 'var(--input-focus-ring-invalid)' : 'var(--input-focus-ring)') : 'none',
          transition: 'var(--transition-control)',
          minWidth: 0,
        }}
      >
        <input
          {...rest}
          ref={inputRef}
          id={id}
          role="combobox"
          type="text"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={open && active >= 0 ? `${baseId}-opt-${active}` : undefined}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          aria-required={field?.required || undefined}
          disabled={disabled}
          placeholder={placeholder}
          value={open ? query : selected?.label ?? ''}
          onChange={(e) => {
            setQuery(e.target.value);
            setDirty(true);
            setActive(-1);
            if (!open) setOpen(true);
            onSearch?.(e.target.value);
          }}
          onMouseDown={() => { if (!open) openList('selected'); }}
          onKeyDown={onKeyDown}
          onBlur={(e) => { if (!wrapRef.current?.contains(e.relatedTarget)) close(); rest.onBlur?.(e); }}
          style={{
            flex: 1,
            minWidth: 0,
            height: '100%',
            padding: `0 0 0 ${px}`,
            margin: 0,
            border: 0,
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: FS[size] || FS.md,
            color: disabled ? 'var(--input-text-disabled)' : 'var(--input-text)',
            cursor: disabled ? 'not-allowed' : 'text',
            textOverflow: 'ellipsis',
          }}
        />
        <span
          aria-hidden="true"
          onMouseDown={(e) => { e.preventDefault(); if (open) { close(); inputRef.current?.focus(); } else { openList('selected'); inputRef.current?.focus(); } }}
          style={{ display: 'flex', alignItems: 'center', padding: `0 ${px}`, color: disabled ? 'var(--input-text-disabled)' : 'var(--input-icon)', cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          <Icon name={loading ? 'loader' : 'chevron-down'} size={iconPx} style={loading ? { animation: 'var(--anim-spin)' } : undefined} />
        </span>
      </div>

      {open && pos && (
        <div
          ref={surfaceRef}
          style={{
            ...anchorStyle(pos),
            background: 'var(--combobox-list-background)',
            border: 'var(--border-width) solid var(--combobox-list-border)',
            borderRadius: 'var(--combobox-list-radius)',
            boxShadow: 'var(--combobox-list-shadow)',
            overflowY: 'auto',
          }}
        >
          {status && (
            <div role="status" style={{ padding: `10px ${px}`, fontSize: FS[size] || FS.md, color: 'var(--combobox-status-text)' }}>{status}</div>
          )}
          <div
            ref={listRef}
            role="listbox"
            id={listId}
            aria-label={rest['aria-label']}
            style={{ display: status ? 'none' : 'block' }}
          >
            {shown.map((o, i) => {
              const isSelected = o.value === value;
              return (
                <div
                  key={o.value}
                  id={`${baseId}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => { e.preventDefault(); commit(o); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: `7px ${px}`,
                    cursor: 'pointer',
                    background: i === active
                      ? 'var(--combobox-option-background-active)'
                      : isSelected
                        ? 'var(--combobox-option-background-selected)'
                        : 'transparent',
                  }}
                >
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: FS[size] || FS.md, color: 'var(--combobox-option-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Match text={o.label} query={dirty ? q : ''} />
                    </span>
                    {o.description && (
                      <span style={{ display: 'block', marginTop: 1, fontSize: 'var(--text-2xs)', color: 'var(--combobox-option-description-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Match text={o.description} query={dirty ? q : ''} />
                      </span>
                    )}
                  </span>
                  {isSelected && <Icon name="check" size={14} style={{ color: 'var(--combobox-option-check)', flex: '0 0 auto' }} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
