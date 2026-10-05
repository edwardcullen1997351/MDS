import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Tag } from '../core/Tag.jsx';
import { FieldContext } from './Field.jsx';
import { useAnchor, anchorStyle } from '../core/anchor.js';

/* Several values from a list the system knows. Logged as an open item by two
   specs — Combobox ("multi-select") and Autocomplete ("a tag input") — and
   built as its own component for the reason both of them gave: it is not a
   `multiple` prop on either.

   What changes when one value becomes several is not the list, it is
   everything around it:

   · The box has no fixed height. It holds tokens that wrap, so it starts at
     one control height and grows. --control-h-* cannot express that.
   · The list STAYS OPEN on select. Committing and closing is the whole
     interaction model of Combobox; here a press is one of several.
   · Removal needs two routes — the × on each token, and Backspace on an
     empty query, which is the keyboard route every tag input has and the
     one users try first.
   · Overflow is a real rule, not a scrollbar. Unfocused, the box shows
     `collapseAfter` tokens and a count; focused, it shows everything.
   · The announcement is plural and it is a COUNT, not a list: "3 selected"
     after every change, through one role="status". Reading four token
     labels back on every keystroke is how these controls become unusable
     with a screen reader.

   Everything else — the anchored surface, the match emphasis, the option
   rows — is Combobox's, deliberately: one list appearance in the system. */

const MINH = { sm: 'var(--multi-combobox-min-height-sm)', md: 'var(--multi-combobox-min-height-md)', lg: 'var(--multi-combobox-min-height-lg)' };
const PX = { sm: 'var(--control-px-sm)', md: 'var(--control-px-md)', lg: 'var(--control-px-lg)' };
/* 16px at lg is the largest type iOS Safari will not zoom to on focus. */
const FS = { sm: 'var(--text-xs)', md: 'var(--text-sm)', lg: 'var(--text-lg)' };
const IS = { sm: 14, md: 14, lg: 16 };
const LIST_MAX = 264;

const norm = (o) => (typeof o === 'string' ? { value: o, label: o } : o);
const defaultFilter = (o, q) => o.label.toLowerCase().includes(q) || (o.description || '').toLowerCase().includes(q);

function Match({ text, query }) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query);
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark style={{ background: 'none', color: 'var(--multi-combobox-option-match-text)', fontWeight: 'var(--weight-semibold)' }}>{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

export function MultiCombobox({
  options = [],
  value = [],
  onChange,
  onSearch,
  filter,
  placeholder,
  emptyMessage = 'No matches',
  /* Creatable: the typed text becomes a value. Off by default, because a
     control that invents options is only correct when the SET is open —
     tags, keywords, part numbers a plant adds daily. On a closed set
     (statuses, areas) it silently manufactures values the backend will
     reject, which is worse than "No matches". */
  creatable = false,
  /* Turns typed text into an option. The default trims and uses the text as
     both label and value; a product with ids passes its own. */
  onCreate,
  loading = false,
  /* Unfocused ceiling. 3 fits a half-width field at md without wrapping; false
     shows every token always and lets the box grow. */
  collapseAfter = 3,
  max,
  size = 'md',
  invalid = false,
  disabled = false,
  style,
  ...rest
}) {
  const field = React.useContext(FieldContext);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(-1);
  const [hover, setHover] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const wrapRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);
  const surfaceRef = React.useRef(null);
  const baseId = React.useId();
  const listId = baseId + '-list';
  const pos = useAnchor(wrapRef, surfaceRef, { open, matchWidth: true, max: LIST_MAX });

  const id = rest.id ?? field?.id;
  const describedBy = rest['aria-describedby'] ?? field?.describedBy;
  const isInvalid = invalid || !!field?.invalid;
  const named = id != null || rest['aria-label'] != null || rest['aria-labelledby'] != null;

  const items = React.useMemo(() => options.map(norm), [options]);
  const selectedValues = Array.isArray(value) ? value : [];
  const selectedSet = React.useMemo(() => new Set(selectedValues), [selectedValues]);
  /* Token order is OPTION order, never click order, so a saved value
     round-trips identically however the user built it — ChipGroup's rule. */
  const selected = React.useMemo(
    () => items.filter((o) => selectedSet.has(o.value)),
    [items, selectedSet]
  );
  const q = query.trim().toLowerCase();
  const shown = React.useMemo(() => {
    if (filter === false || !q) return items;
    const fn = typeof filter === 'function' ? filter : defaultFilter;
    return items.filter((o) => fn(o, q));
  }, [items, q, filter]);

  const atMax = max != null && selectedValues.length >= max;

  /* The create row appears only when the query is non-empty, matches no
     EXISTING option exactly, and is not already selected. Case-insensitive on
     purpose: offering to create "Assembly" when "assembly" exists is how a
     tag list ends up with both. */
  const trimmed = q.trim();
  const exact = trimmed && items.some((o) => String(o.label ?? o.value).toLowerCase() === trimmed.toLowerCase());
  const canCreate = creatable && !!trimmed && !exact && !atMax;

  if (!named) {
    console.warn('[Meridian] MultiCombobox: no accessible name. The placeholder is not a label — it disappears behind the first token. Wrap the control in <Field label="…"> or pass aria-label.');
  }
  if (isInvalid && !describedBy) {
    console.warn('[Meridian] MultiCombobox: `invalid` with no aria-describedby. A red border is a colour-only cue (WCAG 1.4.1) — pass the message through <Field error="…">.');
  }
  if (onSearch && filter !== false) {
    console.warn('[Meridian] MultiCombobox: `onSearch` without `filter={false}` filters server results a second time on the client. Pass filter={false} when the server does the matching.');
  }
  if (value !== undefined && typeof onChange !== 'function') {
    console.warn('[Meridian] MultiCombobox: `value` without `onChange`. The control renders but nothing can be added or removed.');
  }
  if (!Array.isArray(value)) {
    console.warn('[Meridian] MultiCombobox: `value` must be an array. One value is a Combobox.');
  }
  const missing = selectedValues.filter((v) => !items.some((o) => o.value === v));
  if (missing.length && items.length) {
    console.warn(`[Meridian] MultiCombobox: ${JSON.stringify(missing)} is selected but not in \`options\`, so it renders no token and the user cannot see or remove it. Keep selected options in the list even when they fall outside the current search.`);
  }

  React.useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) close(); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  /* Keep the active row in view without scrollIntoView, which would scroll the
     page as well as the list. */
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

  function close() { setOpen(false); setActive(-1); }

  /* One emit shape for every route in and out — the × , Backspace, the row,
     Enter — so a product only ever handles "here is the next array". */
  function emit(next) {
    onChange?.(items.filter((o) => next.has(o.value)).map((o) => o.value));
  }
  function toggle(opt) {
    if (!opt || opt.disabled) return;
    const next = new Set(selectedSet);
    if (next.has(opt.value)) next.delete(opt.value);
    else {
      if (atMax) return;
      next.add(opt.value);
    }
    emit(next);
    /* The query is cleared but the list STAYS OPEN: the user is picking
       several, and re-opening between each is the defect this component
       exists to avoid. */
    setQuery('');
    onSearch?.('');
    inputRef.current?.focus();
  }
  function remove(v) {
    const next = new Set(selectedSet);
    next.delete(v);
    emit(next);
    inputRef.current?.focus();
  }

  function create() {
    if (!canCreate) return;
    const made = onCreate ? onCreate(trimmed) : { value: trimmed, label: trimmed };
    if (!made || made.value == null) return;
    /* Emitted directly rather than through emit(), which maps the next set
       against `items` — a value that does not exist there yet would be
       filtered straight back out. */
    onChange?.([...selectedValues, made.value]);
    setQ('');
    setActive(-1);
  }

  function onKeyDown(e) {
    if (disabled) return;
    /* The create row, when offered, is a real row at the end of the list —
       so ArrowDown reaches it and Enter takes it, exactly like an option.
       A create affordance only clickable by mouse is the Card 1.15.0 defect
       in a different component. */
    const last = shown.length - 1 + (canCreate ? 1 : 0);
    const onCreateRow = canCreate && active === shown.length;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) { setOpen(true); setActive(0); return; }
        return setActive((i) => (i >= last ? 0 : i + 1));
      case 'ArrowUp':
        e.preventDefault();
        if (!open) { setOpen(true); setActive(last); return; }
        return setActive((i) => (i <= 0 ? last : i - 1));
      case 'Home': if (open) { e.preventDefault(); setActive(0); } return;
      case 'End': if (open) { e.preventDefault(); setActive(last); } return;
      case 'Enter':
        if (open && onCreateRow) { e.preventDefault(); create(); return; }
        if (open && active >= 0) { e.preventDefault(); toggle(shown[active]); }
        return;
      case 'Backspace':
        /* Only on an EMPTY query, and only when the caret has nothing to
           delete — otherwise this eats the text the user is editing. */
        if (query === '' && selected.length) { e.preventDefault(); remove(selected[selected.length - 1].value); }
        return;
      case 'Escape':
        if (open) { e.preventDefault(); close(); }
        return;
      case 'Tab':
        close();
        return;
      default:
        return;
    }
  }

  /* Collapsed only when the control is at rest: a user reading the form sees
     a stable box, and the moment they focus it every token is present and
     removable. */
  const collapsed = collapseAfter !== false && !focused && !open && selected.length > collapseAfter;
  const visible = collapsed ? selected.slice(0, collapseAfter) : selected;
  const hiddenCount = selected.length - visible.length;

  const border = isInvalid
    ? 'var(--multi-combobox-border-invalid)'
    : (open || focused)
      ? 'var(--multi-combobox-border-focus)'
      : hover && !disabled
        ? 'var(--multi-combobox-border-hover)'
        : 'var(--multi-combobox-border)';
  const px = PX[size] || PX.md;
  const iconPx = IS[size] || IS.md;
  /* "No matches" is suppressed when a create row is offered: the row IS the
     answer to an empty result, and printing both says the search failed and
     then immediately offers the fix, which reads as a contradiction. */
  const status = loading ? 'Searching…'
    : shown.length === 0 && !canCreate ? emptyMessage
      : atMax ? `Limit of ${max} reached`
        : null;
  const tagSize = size === 'lg' ? 'md' : 'sm';

  return (
    <div ref={wrapRef} style={{ position: 'relative', minWidth: 0, ...style }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseDown={(e) => {
          /* Clicking the padding focuses the input, as in any text field —
             but a press on a token's × must not steal it back. */
          if (e.target === e.currentTarget && !disabled) { e.preventDefault(); inputRef.current?.focus(); setOpen(true); }
        }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--space-1)',
          minHeight: MINH[size] || MINH.md,
          padding: `3px calc(${px} - 2px)`,
          background: disabled ? 'var(--multi-combobox-background-disabled)' : 'var(--multi-combobox-background)',
          border: `var(--border-width) solid ${border}`,
          borderRadius: 'var(--multi-combobox-radius)',
          boxShadow: (open || focused) ? (isInvalid ? 'var(--multi-combobox-focus-ring-invalid)' : 'var(--multi-combobox-focus-ring)') : 'none',
          transition: 'var(--transition-control)',
          cursor: disabled ? 'not-allowed' : 'text',
          minWidth: 0,
        }}
      >
        {visible.map((o) => (
          /* The non-shrinking wrapper, not a style on the Tag: tokens are flex
             items beside a query input that holds `flex: 1 1 60px`, so at the
             default `0 1 auto` the row squeezes every token to an ellipsis
             ("Thai" → "T…") instead of wrapping a line. The wrapper owns the
             flex behaviour so Tag's own geometry stays Tag's. */
          <span key={o.value} style={{ display: 'inline-flex', flex: '0 0 auto', minWidth: 0, maxWidth: '100%' }}>
            <Tag
              label={o.label}
              font="sans"
              size={tagSize}
              onRemove={disabled ? undefined : () => remove(o.value)}
            />
          </span>
        ))}
        {hiddenCount > 0 && (
          <span
            aria-hidden="true"
            style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-xs)', color: 'var(--multi-combobox-overflow-text)', whiteSpace: 'nowrap' }}
          >+{hiddenCount}</span>
        )}
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
          aria-describedby={[describedBy, `${baseId}-count`].filter(Boolean).join(' ')}
          aria-invalid={isInvalid || undefined}
          aria-required={field?.required || undefined}
          disabled={disabled}
          placeholder={selected.length ? undefined : placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(-1);
            if (!open) setOpen(true);
            onSearch?.(e.target.value);
          }}
          onMouseDown={() => { if (!open) setOpen(true); }}
          onKeyDown={onKeyDown}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => {
            setFocused(false);
            if (!wrapRef.current?.contains(e.relatedTarget)) close();
            rest.onBlur?.(e);
          }}
          style={{
            flex: '1 1 60px',
            minWidth: 60,
            height: 'var(--control-h-sm)',
            padding: 0,
            margin: 0,
            border: 0,
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: FS[size] || FS.md,
            color: disabled ? 'var(--multi-combobox-text-disabled)' : 'var(--multi-combobox-text)',
            cursor: disabled ? 'not-allowed' : 'text',
          }}
        />
        <span
          aria-hidden="true"
          onMouseDown={(e) => { e.preventDefault(); if (disabled) return; setOpen(!open); inputRef.current?.focus(); }}
          style={{ display: 'flex', alignItems: 'center', paddingLeft: 4, color: disabled ? 'var(--multi-combobox-text-disabled)' : 'var(--multi-combobox-icon)', cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          <Icon name={loading ? 'loader' : 'chevron-down'} size={iconPx} style={loading ? { animation: 'var(--anim-spin)' } : undefined} />
        </span>
      </div>

      {/* The plural contract: a count, always mounted, never a list of labels.
          It is also the input's aria-describedby, so the current total is
          read when focus arrives and again after every change. */}
      <span
        id={`${baseId}-count`}
        role="status"
        style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap', border: 0 }}
      >
        {selected.length === 0 ? 'None selected' : `${selected.length} selected`}
      </span>

      {open && pos && (
        <div
          ref={surfaceRef}
          style={{
            ...anchorStyle(pos),
            background: 'var(--multi-combobox-list-background)',
            border: 'var(--border-width) solid var(--multi-combobox-list-border)',
            borderRadius: 'var(--multi-combobox-list-radius)',
            boxShadow: 'var(--multi-combobox-list-shadow)',
            overflowY: 'auto',
          }}
        >
          {status && (
            <div style={{ padding: `10px ${px}`, fontSize: FS[size] || FS.md, color: 'var(--multi-combobox-status-text)' }}>{status}</div>
          )}
          <div
            ref={listRef}
            role="listbox"
            id={listId}
            aria-multiselectable="true"
            aria-label={rest['aria-label']}
            style={{ display: (shown.length === 0 && !canCreate) || loading ? 'none' : 'block' }}
          >
            {shown.map((o, i) => {
              const isSelected = selectedSet.has(o.value);
              const blocked = o.disabled || (atMax && !isSelected);
              return (
                <div
                  key={o.value}
                  id={`${baseId}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={blocked || undefined}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => { e.preventDefault(); toggle(o); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: `7px ${px}`,
                    cursor: blocked ? 'not-allowed' : 'pointer',
                    opacity: blocked ? 0.55 : 1,
                    background: i === active
                      ? 'var(--multi-combobox-option-background-active)'
                      : isSelected
                        ? 'var(--multi-combobox-option-background-selected)'
                        : 'transparent',
                  }}
                >
                  {/* A checkbox glyph, not a trailing tick: the row is a
                      toggle, and the gutter is reserved so selecting cannot
                      re-flow the list under the cursor. */}
                  <span aria-hidden="true" style={{ display: 'flex', flex: '0 0 auto', width: 14, color: 'var(--multi-combobox-option-check)' }}>
                    <Icon name={isSelected ? 'square-check' : 'square'} size={14} style={{ color: isSelected ? 'var(--multi-combobox-option-check)' : 'var(--multi-combobox-icon)' }} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: FS[size] || FS.md, color: 'var(--multi-combobox-option-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Match text={o.label} query={q} />
                    </span>
                    {o.description && (
                      <span style={{ display: 'block', marginTop: 1, fontSize: 'var(--text-2xs)', color: 'var(--multi-combobox-option-description-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Match text={o.description} query={q} />
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
            {canCreate && (
              /* role="option" like any other row: it is in the same listbox,
                 reachable by the same arrow keys, and announced in the same
                 sequence. A div with an onClick here would be invisible to
                 the arrow-key model the rest of the list already has. */
              <div
                id={`${baseId}-opt-${shown.length}`}
                role="option"
                aria-selected={false}
                onMouseEnter={() => setActive(shown.length)}
                onMouseDown={(e) => { e.preventDefault(); create(); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: `7px ${px}`,
                  cursor: 'pointer',
                  borderTop: shown.length ? 'var(--border-width) solid var(--multi-combobox-list-border)' : 'none',
                  background: active === shown.length ? 'var(--multi-combobox-option-background-active)' : 'transparent',
                }}
              >
                <span aria-hidden="true" style={{ display: 'flex', flex: '0 0 auto', width: 14, color: 'var(--multi-combobox-icon)' }}>
                  <Icon name="plus" size={14} />
                </span>
                <span style={{ flex: 1, minWidth: 0, fontSize: FS[size] || FS.md, color: 'var(--multi-combobox-option-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {/* The typed text is quoted, so a user can see exactly what
                      they are about to create — including trailing spaces
                      that would otherwise be invisible. */}
                  Create <strong style={{ fontWeight: 'var(--weight-medium)' }}>“{trimmed}”</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
