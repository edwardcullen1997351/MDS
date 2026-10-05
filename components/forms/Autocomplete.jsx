import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { FieldContext } from './Field.jsx';
import { useAnchor, anchorStyle } from '../core/anchor.js';

const H = { sm: 'var(--control-h-sm)', md: 'var(--control-h-md)', lg: 'var(--control-h-lg)' };
const PX = { sm: 'var(--control-px-sm)', md: 'var(--control-px-md)', lg: 'var(--control-px-lg)' };
/* 16px at lg is the largest type iOS Safari will not zoom to on focus. */
const FS = { sm: 'var(--text-xs)', md: 'var(--text-sm)', lg: 'var(--text-lg)' };
const IS = { sm: 14, md: 14, lg: 16 };
const WORD_EDGE = /[\s\-_./:,(]/;

const norm = (s) => (typeof s === 'string' ? { value: s, label: s } : { ...s, label: s.label ?? s.value });

/* 0 = prefix, 1 = word-start, 2 = mid-word, -1 = no match. Prefix matches
   first is the whole point of a typeahead: the user is completing what they
   already typed, so "eu-w" must put eu-west-1 above ap-southeast-1. */
function rank(label, q) {
  const l = label.toLowerCase();
  if (l.startsWith(q)) return 0;
  const i = l.indexOf(q);
  if (i < 0) return -1;
  return WORD_EDGE.test(l[i - 1]) ? 1 : 2;
}
const defaultFilter = (s, q) => rank(s.label, q) >= 0;

/* The typed run is plain and the REST is emphasised — the inverse of
   Combobox, deliberately. There, highlighting the match answers "why is this
   row here?". Here the user already knows what they typed; the news is what
   the suggestion would add. */
function Completion({ text, query }) {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query);
  if (i !== 0) return text;
  return (
    <>
      {text.slice(0, query.length)}
      <span style={{ color: 'var(--autocomplete-suggestion-completion-text)', fontWeight: 'var(--weight-semibold)' }}>{text.slice(query.length)}</span>
    </>
  );
}

export function Autocomplete({
  suggestions = [],
  value = '',
  onChange,
  onSelect,
  filter,
  minChars = 1,
  maxSuggestions = 6,
  inline = false,
  placeholder,
  loading = false,
  size = 'md',
  invalid = false,
  disabled = false,
  style,
  ...rest
}) {
  const field = React.useContext(FieldContext);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(-1);
  const [hover, setHover] = React.useState(false);
  const [focus, setFocus] = React.useState(false);

  const wrapRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);
  const surfaceRef = React.useRef(null);
  const baseId = React.useId();
  const listId = baseId + '-list';

  const id = rest.id ?? field?.id;
  const describedBy = rest['aria-describedby'] ?? field?.describedBy;
  const isInvalid = invalid || !!field?.invalid;
  const named = id != null || rest['aria-label'] != null || rest['aria-labelledby'] != null;

  const items = React.useMemo(() => suggestions.map(norm), [suggestions]);
  const q = value.trim().toLowerCase();
  const shown = React.useMemo(() => {
    if (q.length < minChars) return [];
    if (filter === false) return items.slice(0, maxSuggestions);
    const fn = typeof filter === 'function' ? filter : defaultFilter;
    const hit = items.filter((s) => fn(s, q));
    if (typeof filter === 'function') return hit.slice(0, maxSuggestions);
    return hit
      .map((s, i) => [s, rank(s.label, q), i])
      .sort((a, b) => a[1] - b[1] || a[2] - b[2])
      .map((t) => t[0])
      .slice(0, maxSuggestions);
  }, [items, q, minChars, maxSuggestions, filter]);

  const listOpen = open && !disabled && (loading || shown.length > 0);
  /* The inline hint is only ever the TOP suggestion, and only when it
     genuinely extends what is in the box. */
  const ghost = inline && listOpen && shown[0] && shown[0].label.toLowerCase().startsWith(value.toLowerCase()) && shown[0].label.length > value.length
    ? shown[0]
    : null;

  if (!named) {
    console.warn('[Meridian] Autocomplete: no accessible name. The placeholder is not a label — it disappears on the first keystroke. Wrap the control in <Field label="…"> or pass aria-label.');
  }
  if (isInvalid && !describedBy) {
    console.warn('[Meridian] Autocomplete: `invalid` with no aria-describedby. A red border is a colour-only cue (WCAG 1.4.1) and announces nothing — pass the message through <Field error="…">.');
  }
  if (maxSuggestions > 10) {
    console.warn(`[Meridian] Autocomplete: maxSuggestions={${maxSuggestions}}. A suggestion list is an accelerator, not a browse list — past ~10 rows it scrolls, stops being scannable at a glance, and the control the user wants is Combobox (a closed list, searched) or a results page.`);
  }
  if (onChange == null) {
    console.warn('[Meridian] Autocomplete: no `onChange`. This control is always controlled — the typed text IS the value, so it must be held in your state and passed back as `value`.');
  }

  React.useEffect(() => {
    if (!listOpen) return undefined;
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [listOpen]);

  /* Geometry lives in useAnchor (1.5.0), extracted from this component and
     Combobox after two defects here proved the rule: measure the rendered
     surface, never predict its height. The engine reads the list's own
     scrollHeight on animation frames, so a keystroke that adds rows resizes
     the list in the same pass. */
  const pos = useAnchor(wrapRef, surfaceRef, { open: listOpen, matchWidth: true });

  function accept(s) {
    if (!s) return;
    onChange?.(s.value);
    onSelect?.(s);
    setOpen(false);
    setActive(-1);
    inputRef.current?.focus();
  }

  function onKeyDown(e) {
    if (disabled) return;
    const last = shown.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        if (!shown.length) return;
        e.preventDefault();
        if (!listOpen) { setOpen(true); setActive(0); return; }
        return setActive((i) => (i >= last ? 0 : i + 1));
      case 'ArrowUp':
        if (!listOpen) return;
        e.preventDefault();
        return setActive((i) => (i <= 0 ? last : i - 1));
      case 'ArrowRight':
        /* Accepts the inline hint, and only when the caret is already at the
           end — anywhere else, Right is a cursor move and stays one. */
        if (ghost && e.currentTarget.selectionStart === value.length && e.currentTarget.selectionStart === e.currentTarget.selectionEnd) {
          e.preventDefault();
          accept(ghost);
        }
        return;
      case 'Home': if (listOpen && active >= 0) { e.preventDefault(); setActive(0); } return;
      case 'End': if (listOpen && active >= 0) { e.preventDefault(); setActive(last); } return;
      case 'Enter':
        /* Only swallowed when there is a highlighted row to accept.
           Otherwise the typed text is already the value and Enter must reach
           the form — an autocomplete that eats every Enter breaks search. */
        if (listOpen && active >= 0) { e.preventDefault(); accept(shown[active]); }
        else setOpen(false);
        return;
      case 'Escape':
        /* Closes the list and keeps the text. Escape is never a revert here:
           there is nothing to revert TO — the text is the value. */
        if (listOpen) { e.preventDefault(); e.stopPropagation(); setOpen(false); setActive(-1); }
        return;
      default:
        return;
    }
  }

  const border = isInvalid
    ? 'var(--input-border-invalid)'
    : focus
      ? 'var(--input-border-focus)'
      : hover && !disabled
        ? 'var(--input-border-hover)'
        : 'var(--input-border)';
  const px = PX[size] || PX.md;
  const fs = FS[size] || FS.md;

  return (
    <div ref={wrapRef} style={{ position: 'relative', minWidth: 0, ...style }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          height: H[size] || H.md,
          background: disabled ? 'var(--input-background-disabled)' : 'var(--input-background)',
          border: `var(--border-width) solid ${border}`,
          borderRadius: 'var(--input-radius)',
          boxShadow: focus ? (isInvalid ? 'var(--input-focus-ring-invalid)' : 'var(--input-focus-ring)') : 'none',
          transition: 'var(--transition-control)',
          minWidth: 0,
        }}
      >
        {ghost && (
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              padding: `0 0 0 ${px}`,
              fontFamily: 'var(--font-sans)',
              fontSize: fs,
              whiteSpace: 'pre',
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <span style={{ color: 'transparent' }}>{value}</span>
            <span style={{ color: 'var(--autocomplete-ghost-text)' }}>{ghost.label.slice(value.length)}</span>
          </span>
        )}
        <input
          {...rest}
          ref={inputRef}
          id={id}
          role="combobox"
          type="text"
          /* Ours and the browser's own autofill menu would otherwise stack. */
          autoComplete="off"
          aria-expanded={listOpen}
          aria-controls={listOpen ? listId : undefined}
          aria-autocomplete={inline ? 'both' : 'list'}
          aria-activedescendant={listOpen && active >= 0 ? `${baseId}-opt-${active}` : undefined}
          aria-describedby={describedBy}
          aria-invalid={isInvalid || undefined}
          aria-required={field?.required || undefined}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            const next = e.target.value;
            onChange?.(next);
            setActive(-1);
            if (next.trim().length >= minChars) setOpen(true);
            else setOpen(false);
          }}
          onFocus={(e) => { setFocus(true); rest.onFocus?.(e); }}
          onBlur={(e) => {
            setFocus(false);
            /* No revert, no accept — the text stays exactly as typed. */
            if (!wrapRef.current?.contains(e.relatedTarget)) { setOpen(false); setActive(-1); }
            rest.onBlur?.(e);
          }}
          onKeyDown={onKeyDown}
          style={{
            position: 'relative',
            flex: 1,
            minWidth: 0,
            height: '100%',
            padding: `0 0 0 ${px}`,
            margin: 0,
            border: 0,
            outline: 'none',
            background: 'transparent',
            fontFamily: 'var(--font-sans)',
            fontSize: fs,
            color: disabled ? 'var(--input-text-disabled)' : 'var(--input-text)',
            cursor: disabled ? 'not-allowed' : 'text',
            textOverflow: 'ellipsis',
          }}
        />
        {loading && (
          <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', padding: `0 ${px}`, color: 'var(--input-icon)' }}>
            <Icon name="loader" size={IS[size] || IS.md} style={{ animation: 'var(--anim-spin)' }} />
          </span>
        )}
      </div>

      {listOpen && pos && (
        <div
          ref={surfaceRef}
          style={{
            ...anchorStyle(pos),
            background: 'var(--autocomplete-list-background)',
            border: 'var(--border-width) solid var(--autocomplete-list-border)',
            borderRadius: 'var(--autocomplete-list-radius)',
            boxShadow: 'var(--autocomplete-list-shadow)',
            overflowY: 'auto',
          }}
        >
          {loading && shown.length === 0 ? (
            <div role="status" style={{ padding: `10px ${px}`, fontSize: fs, color: 'var(--autocomplete-status-text)' }}>Searching…</div>
          ) : (
            <div ref={listRef} role="listbox" id={listId} aria-label={rest['aria-label']} style={{ padding: '4px 0' }}>
              {shown.map((s, i) => (
                <div
                  key={s.value}
                  id={`${baseId}-opt-${i}`}
                  role="option"
                  /* The cursor, not a commitment: nothing here is ever
                     "selected" — accepting a row only rewrites the text. */
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(-1)}
                  onMouseDown={(e) => { e.preventDefault(); accept(s); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: `6px ${px}`,
                    cursor: 'pointer',
                    background: i === active ? 'var(--autocomplete-suggestion-background-active)' : 'transparent',
                  }}
                >
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: fs, color: 'var(--autocomplete-suggestion-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Completion text={s.label} query={q} />
                    </span>
                    {s.description && (
                      <span style={{ display: 'block', marginTop: 1, fontSize: 'var(--text-2xs)', color: 'var(--autocomplete-suggestion-description-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.description}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
