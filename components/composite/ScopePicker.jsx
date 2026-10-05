import React from 'react';
import { Tree } from '../data/Tree.jsx';
import { SearchField } from './SearchField.jsx';
import { Text } from '../primitives/Text.jsx';

/* ScopePicker — several hierarchy nodes as ONE scope value.

   Why this is a composite and not a pattern (promotion policy §01):

   THE OWNERSHIP TEST. Tree reports which nodes are selected. SearchField
   reports a query. A detail pane shows one record. None of them can hold the
   three contracts this assembly holds:

   · THE VALUE IS A SCOPE, NOT A SELECTION. Under `cascade` a parent stands
     for its descendants, so [PL-04, PRESS, PRS-4120] and [PL-04] can mean
     the same thing. The composite normalises to the COVERING set — the
     shallowest nodes that imply the rest — because two encodings of one
     scope is how a form submits a different thing than it displayed.
   · COMPLETENESS. A scope drawn from a partly-fetched hierarchy is
     PROVISIONAL: a selected branch whose children were never loaded may
     stand for four cost centres or forty, and neither the Tree (which sees
     nodes) nor the form (which sees ids) can tell. The composite derives it
     and says so.
   · THE QUERY AND THE TREE MUST AGREE. A hit behind a collapsed parent is a
     query that lies. Filtering keeps matches WITH their ancestors and opens
     the path to each one, and it never touches the scope — narrowing the
     view must not narrow the answer, which is the defect every hand-built
     version of this ships with.

   THE CONSEQUENCE TEST, in the product's terms: a rework charge posts
   against "Press shop" meaning one cost centre, when the four beneath it
   were never fetched — ₹2,40,000 to the wrong line, discovered at month
   close.

   Neither does it fetch: the filter matches loaded labels, and a hierarchy
   too large to hold is narrowed by the product above this component. Owning
   a query would mean owning retry, cancel, debounce and a race against the
   scope — the boundary FileDropzone holds when it refuses transport.

   What it does NOT own: nodes, expansion, keyboard tree navigation, the
   selection indicator (all Tree); text editing, clear and submit (all
   SearchField); and no results state of its own — a query matching nothing
   is a message inside this frame, not an EmptyState page. */

const has = (n) => !!((n.children && n.children.length) || n.hasChildren);

function walk(nodes, fn, ancestors = []) {
  nodes.forEach((n) => { fn(n, ancestors); walk(n.children || [], fn, [...ancestors, n]); });
}

/* Matches plus every ancestor of a match — never a match alone, or the row
   arrives with no indication of what it belongs to, which for cost centres
   (four sites all carrying "Press shop") makes the hit unreadable. */
function prune(nodes, q) {
  const out = [];
  nodes.forEach((n) => {
    const kids = prune(n.children || [], q);
    const self = String(n.label || '').toLowerCase().includes(q);
    if (self || kids.length) out.push({ ...n, children: kids.length ? kids : (self ? n.children : []) });
  });
  return out;
}

export function ScopePicker({
  items = [],
  label,
  /* The normalised covering set. A consumer stores exactly this and never
     has to re-derive what a parent stood for. */
  value = [],
  onChange,
  cascade = true,
  size = 'md',
  searchable = true,
  searchPlaceholder = 'Filter…',
  required = false,
  invalid,
  /* One line under the frame: the failure, in the product's words. The
     composite decides WHEN a scope is unacceptable; only the product can say
     what that costs. */
  requiredMessage = 'Select at least one node.',
  /** Names what one leaf is, for the summary: "cost centre" → "3 cost centres". */
  unit = 'node',
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  loadingIds = [],
  hint,
  style,
  ...rest
}) {
  const [query, setQuery] = React.useState('');
  const frameRef = React.useRef(null);
  const [ownExpanded, setOwnExpanded] = React.useState(() => new Set(defaultExpandedIds));
  const controlled = expandedIds != null;
  const openSet = controlled ? new Set(expandedIds) : ownExpanded;

  if (!label) {
    console.warn('[Meridian] ScopePicker: `label` is required — it names the scope ("Charge scope"), the tree inside it and, when `searchable`, the filter. Three unnamed controls in one frame.');
  }

  const index = React.useMemo(() => {
    const byId = new Map(); const parentOf = new Map();
    walk(items, (n, anc) => { byId.set(n.id, n); if (anc.length) parentOf.set(n.id, anc[anc.length - 1].id); });
    return { byId, parentOf };
  }, [items]);

  /* Covering set → the leaves it stands for, counted only where the
     hierarchy is actually loaded. This is the number the summary states and
     the reason `provisional` exists. */
  const resolved = React.useMemo(() => {
    const leaves = new Set(); let provisional = false;
    const take = (node) => {
      if (!has(node)) { leaves.add(node.id); return; }
      if (node.hasChildren && !(node.children && node.children.length)) { provisional = true; leaves.add(node.id); return; }
      (node.children || []).forEach(take);
    };
    value.forEach((id) => { const n = index.byId.get(id); if (n) take(n); });
    return { count: leaves.size, provisional };
  }, [value, index]);

  /* Normalise: drop any node an ancestor already covers, then roll a fully
     selected parent up into itself. Both directions, or the value drifts
     between "PRESS" and its four children on successive edits. */
  const normalise = (ids) => {
    const set = new Set(ids);
    [...set].forEach((id) => {
      let p = index.parentOf.get(id);
      while (p) { if (set.has(p)) { set.delete(id); break; } p = index.parentOf.get(p); }
    });
    if (!cascade) return [...set];
    let changed = true;
    while (changed) {
      changed = false;
      walk(items, (n) => {
        const kids = n.children || [];
        if (!kids.length || set.has(n.id)) return;
        if (kids.every((k) => set.has(k.id)) && !n.hasChildren) {
          kids.forEach((k) => set.delete(k.id));
          set.add(n.id);
          changed = true;
        }
      });
    }
    return [...set];
  };

  /* What Tree is given: the covering set expanded to every id beneath it, so
     a rolled-up parent still draws its children as chosen. The composite
     translates in both directions; neither shape leaks to the consumer. */
  const treeSelected = React.useMemo(() => {
    const out = new Set();
    const take = (node) => { out.add(node.id); (node.children || []).forEach(take); };
    value.forEach((id) => { const n = index.byId.get(id); if (n) take(n); });
    return [...out];
  }, [value, index]);

  const q = query.trim().toLowerCase();
  const shown = q ? prune(items, q) : items;
  const noHits = q && shown.length === 0;

  /* A filter reveals the path to every hit and RESTORES the user's own
     expansion when the query clears — an expansion state overwritten by a
     search is a browse position the operator has to rebuild by hand. */
  const filterOpen = React.useMemo(() => {
    if (!q) return null;
    const ids = new Set();
    walk(shown, (n, anc) => { if (has(n)) ids.add(n.id); anc.forEach((a) => ids.add(a.id)); });
    return [...ids];
  }, [q, shown]);

  const setExpanded = (ids) => {
    if (q) return;
    if (onExpandedChange) onExpandedChange(ids);
    if (!controlled) setOwnExpanded(new Set(ids));
  };

  const isInvalid = invalid != null ? invalid : (required && value.length === 0);

  return (
    <div {...rest} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--scope-picker-gap)', minWidth: 0, ...style }}>
      <div
        ref={frameRef}
        style={{
          display: 'flex', flexDirection: 'column', gap: 0, minWidth: 0,
          background: 'var(--scope-picker-background)',
          border: `var(--border-width) solid ${isInvalid ? 'var(--scope-picker-border-invalid)' : 'var(--scope-picker-border)'}`,
          borderRadius: 'var(--scope-picker-radius)',
          overflow: 'hidden',
        }}
      >
        {searchable && (
          <div
            style={{ padding: 'var(--scope-picker-tree-padding)', borderBottom: 'var(--border-width) solid var(--scope-picker-summary-border)' }}
            /* The two keys the assembly owns (§07): the filter and the tree
               read as one control, so a keyboard user must not have to Tab
               between them, and Escape belongs to the QUERY — never to the
               value. Nothing here clears a scope by accident. */
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                const row = frameRef.current && frameRef.current.querySelector('[role="treeitem"][tabindex="0"]');
                if (row) { e.preventDefault(); row.focus(); }
              } else if (e.key === 'Escape' && query) {
                e.preventDefault();
                setQuery('');
              }
            }}
          >
            <SearchField
              label={'Filter ' + (label || 'scope')}
              placeholder={searchPlaceholder}
              value={query}
              onChange={setQuery}
              size={size}
            />
          </div>
        )}
        <div
          style={{
            padding: 'var(--scope-picker-tree-padding)',
            maxHeight: 'var(--scope-picker-tree-max-height)',
            overflow: 'auto',
            minWidth: 0,
          }}
        >
          {noHits ? (
            <Text size="xs" tone="tertiary" style={{ display: 'block', padding: '6px 4px' }}>
              No {unit} matches “{query}”. The scope is unchanged.
            </Text>
          ) : (
            <Tree
              label={label}
              items={shown}
              size={size === 'lg' ? 'md' : size}
              selection="multiple"
              cascade={cascade}
              selectedIds={treeSelected}
              onSelectionChange={(ids) => onChange && onChange(normalise(ids))}
              expandedIds={filterOpen || [...openSet]}
              onExpandedChange={setExpanded}
              loadingIds={loadingIds}
            />
          )}
        </div>
        <div
          /* The scope in words, derived and announced. polite, not assertive:
             it changes on every keystroke of a filter and every tick of a
             box, and an assertive region there interrupts continuously. */
          aria-live="polite"
          style={{
            display: 'flex', alignItems: 'baseline', gap: 'var(--scope-picker-gap)', flexWrap: 'wrap',
            padding: 'var(--scope-picker-summary-padding)',
            background: 'var(--scope-picker-summary-background)',
            borderTop: 'var(--border-width) solid var(--scope-picker-summary-border)',
            fontSize: 'var(--text-xs)',
            color: 'var(--scope-picker-summary-text)',
          }}
        >
          {value.length === 0 ? (
            <span style={{ color: 'var(--scope-picker-empty-text)' }}>Nothing in scope</span>
          ) : (
            <>
              <span>
                <strong style={{ color: 'var(--scope-picker-summary-count-text)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-medium)' }}>{resolved.count}</strong>
                {' '}{resolved.count === 1 ? unit : unit + 's'} in scope
              </span>
              <span style={{ color: 'var(--scope-picker-empty-text)' }}>
                from {value.length} {value.length === 1 ? 'selection' : 'selections'}
                {value.length < resolved.count ? ' (rolled up)' : ''}
              </span>
              {resolved.provisional && (
                <span style={{ color: 'var(--scope-picker-invalid-text)' }}>
                  Provisional — a selected branch is not fully loaded.
                </span>
              )}
            </>
          )}
        </div>
      </div>
      {isInvalid ? (
        <Text size="xs" tone="critical" style={{ display: 'block' }}>{requiredMessage}</Text>
      ) : hint ? (
        <Text size="xs" tone="tertiary" style={{ display: 'block' }}>{hint}</Text>
      ) : null}
    </div>
  );
}
