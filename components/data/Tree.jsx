import React from 'react';
import { Icon } from '../core/Icon.jsx';

/* Tree — a hierarchy the user walks.

   The gap this closes: List, Accordion, Menu and Table each hold a
   collection, and not one of them holds a NESTED one.

   · List is a flat run of records and its row is deliberately not a control.
   · Accordion is one level of disclosure. Nested Accordions give you
     expansion but no tree semantics, no roving focus, and a tab stop per
     header — a six-level BOM becomes 200 tab stops.
   · Menu is a command surface that closes on selection; a tree persists.
   · Table has rows, and a row group is not a parent: a nested Table cannot
     answer ArrowLeft with "focus my parent".

   Three things only a tree core can own, and the reason this is a component
   rather than a pattern:

   1. GENERIC TREE SEMANTICS — role="tree" / "treeitem" / "group" with
      aria-level, aria-posinset and aria-setsize, so a screen reader says
      "level 3, 2 of 7" instead of reading an indented flat list.
   2. EXPANSION STATE as a first-class value, separable from selection.
      Which nodes are open is view state a product often persists; which node
      is chosen is data. Collapsing a node must never deselect it.
   3. ONE TAB STOP with tree keyboard navigation — arrows, Home/End, `*`,
      typeahead — over the flattened VISIBLE order. That order is why the
      component takes `items` as data rather than composed children: roving
      focus has to know which row follows the one you are on, and a children
      tree only knows after layout — and gets it wrong the moment a caller
      writes {cond && <TreeItem/>}. List's `__last` bug was the cheap version
      of the same problem.

   THE ROW IS A CONTROL HERE, and that is not a reversal of List. What List,
   Card and Avatar refuse is a row that LOOKS interactive and answers only a
   mouse — no role, no tabindex, no key handler. A treeitem is the opposite:
   the role exists, the keyboard contract is specified, and the tab stop is
   accounted for. What follows is that a tree row cannot host commands — a
   button inside a treeitem is a control inside a control — so there is no
   `actions` slot (§12). Row commands belong to the surface the selection
   drives.

   For the same reason `selection="multiple"` does NOT put a real Checkbox in
   the row: the treeitem is already the checkable control (Space toggles,
   aria-selected carries the answer), and a nested input would be a second
   tab stop announcing the same state twice. The square drawn in the row is
   an indicator, aria-hidden, exactly like the tick inside Checkbox's box. */

const ROW_H = { sm: 'var(--tree-row-height-sm)', md: 'var(--tree-row-height-md)' };
const LABEL = { sm: 'var(--text-xs)', md: 'var(--text-sm)' };

const has = (n) => !!((n.children && n.children.length) || n.hasChildren);

/* Visible order — the keyboard's model of the tree. Rebuilt on every
   expansion change (cheap) and always the same order the render walks, which
   is the point: two orders is how focus ends up somewhere the eye is not. */
function flatten(items, expanded, level = 0, parentId = null, out = []) {
  items.forEach((node, i) => {
    const branch = has(node);
    const open = branch && expanded.has(node.id);
    out.push({ id: node.id, node, level, parentId, branch, open, posinset: i + 1, setsize: items.length });
    if (open && node.children && node.children.length) flatten(node.children, expanded, level + 1, node.id, out);
  });
  return out;
}

function descendantIds(node, acc = []) {
  (node.children || []).forEach((c) => { acc.push(c.id); descendantIds(c, acc); });
  return acc;
}

function TreeRow({ node, level, posinset, setsize, branch, open, size, selection, isSelected, partial, busy, tabbable, guides, registerRef, onRowClick, onChevron, onKeys, onFocusRow, children }) {
  const [hover, setHover] = React.useState(false);
  const [twisty, setTwisty] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const disabled = !!node.disabled;

  return (
    <li
      ref={registerRef}
      role="treeitem"
      tabIndex={tabbable ? 0 : -1}
      aria-expanded={branch ? open : undefined}
      aria-selected={selection === 'none' ? undefined : isSelected}
      aria-level={level + 1}
      aria-posinset={posinset}
      aria-setsize={setsize}
      aria-disabled={disabled || undefined}
      aria-busy={busy || undefined}
      /* :focus-visible, so a pointer press does not leave a ring behind —
         and the ring is drawn on the ROW, never on the li, whose box holds
         the whole open subtree. */
      onFocus={(e) => { if (e.target !== e.currentTarget) return; setFocus(e.target.matches(':focus-visible')); onFocusRow(); }}
      onBlur={(e) => { if (e.target === e.currentTarget) setFocus(false); }}
      onKeyDown={(e) => { if (e.target === e.currentTarget) onKeys(e); }}
      style={{ listStyle: 'none', margin: 0, padding: 0, outline: 'none', minWidth: 0 }}
    >
      <div
        onClick={disabled ? undefined : onRowClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 'var(--tree-row-gap)',
          padding: '0 var(--tree-row-padding-x)',
          minHeight: ROW_H[size] || ROW_H.md,
          borderRadius: 'var(--tree-row-radius)',
          background: isSelected ? 'var(--tree-row-background-selected)' : hover && !disabled ? 'var(--tree-row-background-hover)' : 'transparent',
          color: disabled ? 'var(--tree-row-text-disabled)' : isSelected ? 'var(--tree-row-text-selected)' : branch ? 'var(--tree-branch-text)' : 'var(--tree-leaf-text)',
          fontSize: LABEL[size] || LABEL.md,
          fontWeight: branch ? 'var(--weight-medium)' : 'var(--weight-regular)',
          cursor: disabled ? 'not-allowed' : 'default',
          userSelect: 'none',
          boxShadow: focus ? 'var(--tree-focus-ring)' : 'none',
          position: 'relative',
          zIndex: focus ? 1 : undefined,
          transition: 'background-color var(--duration-fast) var(--ease-out)',
          minWidth: 0,
        }}
      >
        <span
          /* The twisty is a pointer refinement of the row's own control, not
             a nested button: aria-hidden, no tab stop, and the keyboard
             reaches expansion through ArrowRight / ArrowLeft. A real
             IconButton here would be the control-inside-a-control this
             component refuses in `actions` too. */
          aria-hidden="true"
          onClick={branch && !disabled ? onChevron : undefined}
          onMouseEnter={() => setTwisty(true)}
          onMouseLeave={() => setTwisty(false)}
          style={{ flex: '0 0 auto', width: 16, height: 16, display: 'grid', placeItems: 'center', color: branch && twisty && !disabled ? 'var(--tree-chevron-hover)' : 'var(--tree-chevron)', cursor: branch && !disabled ? 'pointer' : 'default', transition: 'color var(--duration-fast) var(--ease-out)' }}
        >
          {branch ? <Icon name={open ? 'chevron-down' : 'chevron-right'} size="xs" /> : null}
        </span>
        {selection === 'multiple' && (
          <span
            aria-hidden="true"
            style={{
              flex: '0 0 auto', width: 14, height: 14, display: 'grid', placeItems: 'center',
              borderRadius: 'var(--radius-xs)',
              border: isSelected || partial ? 'none' : 'var(--border-width) solid var(--tree-indicator-border)',
              background: isSelected || partial ? 'var(--tree-indicator-background-selected)' : 'var(--tree-indicator-background)',
              color: 'var(--tree-indicator-foreground)',
            }}
          >
            {isSelected ? <Icon name="check" size="mark" /> : partial ? <Icon name="minus" size="mark" /> : null}
          </span>
        )}
        {node.icon && (
          <span aria-hidden="true" style={{ flex: '0 0 auto', display: 'grid', placeItems: 'center', color: isSelected ? 'inherit' : 'var(--tree-leading-foreground)' }}>
            <Icon name={node.icon} size="xs" />
          </span>
        )}
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{node.label}</span>
        {busy && <span style={{ flex: '0 0 auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--tree-meta-text)' }}>Loading…</span>}
        {!busy && node.meta != null && (
          <span style={{ flex: '0 0 auto', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', fontVariantNumeric: 'tabular-nums', color: 'var(--tree-meta-text)', whiteSpace: 'nowrap' }}>{node.meta}</span>
        )}
        {node.trailing != null && <span style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>{node.trailing}</span>}
      </div>
      {children}
    </li>
  );
}

export function Tree({
  items = [],
  label,
  size = 'md',
  selection = 'none',
  selectedIds = [],
  onSelectionChange,
  /* Selecting a branch selects everything under it. OFF by default, because
     it changes what a parent's selection MEANS — with cascade "Press shop"
     stands for its four presses; without it "Press shop" is its own answer.
     A component cannot guess which one the product asked for. */
  cascade = false,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  onActivate,
  /* Ids whose children are being fetched. The parent row goes aria-busy and
     says so inline; it does NOT grow a placeholder child row, because a row
     inside role="group" that is not a treeitem is invalid structure, and one
     that is becomes a focus stop for a thing that does not exist yet. */
  loadingIds = [],
  guides = true,
  style,
  ...rest
}) {
  const controlled = expandedIds != null;
  const [ownExpanded, setOwnExpanded] = React.useState(() => new Set(defaultExpandedIds));
  const expanded = React.useMemo(() => new Set(controlled ? expandedIds : ownExpanded), [controlled, expandedIds, ownExpanded]);
  const loading = React.useMemo(() => new Set(loadingIds), [loadingIds]);
  const selected = React.useMemo(() => new Set(selectedIds), [selectedIds]);
  const rows = React.useMemo(() => flatten(items, expanded), [items, expanded]);

  const [focusId, setFocusId] = React.useState(null);
  const nodeRefs = React.useRef(new Map());
  const typeahead = React.useRef({ buf: '', at: 0 });
  const wantFocus = React.useRef(false);

  React.useEffect(() => {
    if (!wantFocus.current) return;
    wantFocus.current = false;
    const el = nodeRefs.current.get(focusId);
    if (el) el.focus();
  }, [focusId]);

  if (!label && rest['aria-label'] == null && rest['aria-labelledby'] == null) {
    console.warn('[Meridian] Tree: no `label`. A tree announces level and position but never its subject — name it ("Plant assets", "BOM · BRK-4820-A") or point aria-labelledby at the heading above it.');
  }

  const first = rows[0] && rows[0].id;
  /* The tab stop: wherever focus last was, else the selected node, else the
     first row. Never nowhere — a tree whose only tabbable row has just been
     collapsed away drops out of the tab order entirely. */
  const tabId = rows.some((r) => r.id === focusId) ? focusId
    : ((selection !== 'none' && rows.find((r) => selected.has(r.id))) || {}).id || first;

  const setExpanded = (next) => {
    if (onExpandedChange) onExpandedChange([...next]);
    if (!controlled) setOwnExpanded(next);
  };
  const toggle = (row, open) => {
    if (!row.branch) return;
    const next = new Set(expanded);
    const wantOpen = open == null ? !next.has(row.id) : open;
    if (wantOpen) next.add(row.id); else next.delete(row.id);
    setExpanded(next);
  };
  const move = (id) => { if (id == null) return; wantFocus.current = true; setFocusId(id); };

  const select = (row) => {
    if (row.node.disabled) return;
    if (selection === 'none') { if (onActivate) onActivate(row.node); return; }
    if (selection === 'single') {
      if (onSelectionChange) onSelectionChange([row.id]);
      if (onActivate) onActivate(row.node);
      return;
    }
    const next = new Set(selected);
    const ids = cascade ? [row.id, ...descendantIds(row.node)] : [row.id];
    if (next.has(row.id)) ids.forEach((i) => next.delete(i)); else ids.forEach((i) => next.add(i));
    if (onSelectionChange) onSelectionChange([...next]);
  };

  const onKeys = (e) => {
    const i = rows.findIndex((r) => r.id === tabId);
    if (i < 0) return;
    const row = rows[i];
    const key = e.key;
    if (key === 'ArrowDown') { e.preventDefault(); move((rows[i + 1] || row).id); return; }
    if (key === 'ArrowUp') { e.preventDefault(); move((rows[i - 1] || row).id); return; }
    if (key === 'Home') { e.preventDefault(); move(rows[0].id); return; }
    if (key === 'End') { e.preventDefault(); move(rows[rows.length - 1].id); return; }
    if (key === 'ArrowRight') {
      e.preventDefault();
      if (row.branch && !row.open) toggle(row, true);
      else if (row.open && rows[i + 1] && rows[i + 1].parentId === row.id) move(rows[i + 1].id);
      return;
    }
    if (key === 'ArrowLeft') {
      e.preventDefault();
      if (row.branch && row.open) toggle(row, false);
      else if (row.parentId != null) move(row.parentId);
      return;
    }
    if (key === 'Enter') { e.preventDefault(); select(row); return; }
    if (key === ' ') {
      e.preventDefault();
      if (selection === 'none' && row.branch) toggle(row); else select(row);
      return;
    }
    /* `*` opens every branch at the focused node's own level under the same
       parent — the APG shortcut, and the only bulk expand offered. There is
       no "expand all": on a 4,000-line BOM it produces a scrollbar and no
       information. */
    if (key === '*') {
      e.preventDefault();
      const next = new Set(expanded);
      rows.filter((r) => r.parentId === row.parentId && r.branch).forEach((r) => next.add(r.id));
      setExpanded(next);
      return;
    }
    /* Typeahead over the VISIBLE rows only. A tree cannot search what it is
       not showing — an open-and-reveal search is Combobox's job, or the
       product's filter above the tree. */
    if (key.length === 1 && /\S/.test(key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
      const now = Date.now();
      const ta = typeahead.current;
      ta.buf = now - ta.at < 700 ? ta.buf + key.toLowerCase() : key.toLowerCase();
      ta.at = now;
      const order = [...rows.slice(i + 1), ...rows.slice(0, i + 1)];
      const hit = order.find((r) => String(r.node.label || '').toLowerCase().startsWith(ta.buf));
      if (hit) move(hit.id);
    }
  };

  const renderLevel = (list, level, parentId) => (
    <ul
      role={level === 0 ? undefined : 'group'}
      style={{
        listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', minWidth: 0,
        ...(level > 0
          ? guides
            ? { marginLeft: 'var(--tree-indent)', borderLeft: 'var(--border-width) solid var(--tree-guide)', paddingLeft: 2 }
            : { marginLeft: 'var(--tree-indent)' }
          : null),
      }}
    >
      {list.map((node, idx) => {
        const branch = has(node);
        const open = branch && expanded.has(node.id);
        const isSelected = selected.has(node.id);
        const row = { id: node.id, node, level, parentId, branch, open };
        return (
          <TreeRow
            key={node.id}
            node={node}
            level={level}
            posinset={idx + 1}
            setsize={list.length}
            branch={branch}
            open={open}
            size={size}
            selection={selection}
            isSelected={isSelected}
            partial={selection === 'multiple' && !isSelected && descendantIds(node).some((d) => selected.has(d))}
            busy={loading.has(node.id)}
            tabbable={tabId === node.id}
            guides={guides}
            registerRef={(el) => { if (el) nodeRefs.current.set(node.id, el); else nodeRefs.current.delete(node.id); }}
            onFocusRow={() => setFocusId(node.id)}
            onKeys={onKeys}
            onChevron={(e) => { e.stopPropagation(); setFocusId(node.id); toggle(row); }}
            onRowClick={() => {
              setFocusId(node.id);
              /* A pointer press on a display tree toggles the branch; with a
                 selection contract it selects, and expansion stays with the
                 twisty. Otherwise choosing a parent would collapse the
                 children the user chose it to see. */
              if (selection === 'none' && branch) toggle(row); else select(row);
            }}
          >
            {open && node.children && node.children.length ? renderLevel(node.children, level + 1, node.id) : null}
          </TreeRow>
        );
      })}
    </ul>
  );

  return (
    <div
      {...rest}
      role="tree"
      aria-label={label || rest['aria-label']}
      aria-multiselectable={selection === 'multiple' ? true : undefined}
      style={{ minWidth: 0, ...style }}
    >
      {renderLevel(items, 0, null)}
    </div>
  );
}

/* No Tree.Item export. A tree's shape is data — see the header note on why
   composed children cannot answer "which row follows this one". */
