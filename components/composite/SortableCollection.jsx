import React from 'react';
import { IconButton } from '../core/IconButton.jsx';

/* The mechanics of moving an item to a new position, and nothing else: the
   grab, the modal keyboard grab, the insertion indicator, the legality check
   for every candidate position, bounded auto-scroll, and the announcements.

   It does NOT own the move. `items` is the committed order and this component
   never reorders it — a legal drop calls `onMove(id, fromIndex, toIndex)` and
   the consumer decides what to commit, what to show while it is in flight, and
   what to do when it fails. That division is the whole point: order is
   committed state, and a component that reordered its own prop would be the
   optimistic mutation the pattern refuses. See the SortableCollection spec §01,
   and the direct-manipulation-of-order pattern §04.

   NOT a sortable table (that is `Table`'s column sort — a view, not a
   commit), NOT a transfer between two collections (a pattern, not a
   component), and NOT a drag-and-drop surface for anything whose containers
   are the product's navigation. */

const HANDLE = 'grip-vertical';
let warnedBool = false;

const scrollParent = (el) => {
  let n = el?.parentElement;
  while (n) {
    const o = getComputedStyle(n).overflowY;
    if ((o === 'auto' || o === 'scroll') && n.scrollHeight > n.clientHeight) return n;
    n = n.parentElement;
  }
  return null;
};

export function SortableCollection({
  items = [],
  label,
  itemName,
  onMove,
  canDrop,
  canMove,
  children,
  renderItem,
  moveControls = 'handle-and-steppers',
  announcementScope = 'position-and-neighbours',
  onAnnounce,
  liveRegion = true,
  onGrabChange,
  disabled = false,
  disabledReason,
  autoScroll = true,
  size = 'md',
  as = 'ul',
  style,
  ...rest
}) {
  const [grab, setGrab] = React.useState(null);
  const [said, setSaid] = React.useState('');
  const rootRef = React.useRef(null);
  const instrId = React.useId();
  /* The pointer path is pointer events with capture, not HTML5 drag-and-drop.
     `draggable` cannot carry this contract: Safari and Firefox will not start
     a drag from a <button>, dragover fires too coarsely to track a proposal,
     and touch produces no drag events at all — which on a shop-floor tablet
     means no pointer path whatsoever. Capture also guarantees the drag ends
     on THIS element, so a pointer lost outside the list still resolves. */
  const grabRef = React.useRef(null);            // mirrors `grab` synchronously
  const dragRef = React.useRef(null);            // live pointer drag, if any
  const winRef = React.useRef(null);             // window listeners for its duration
  const rowEls = React.useRef(new Map());
  const skipClick = React.useRef(null);
  const lastRefused = React.useRef(null);

  const setGrabState = React.useCallback((g) => { grabRef.current = g; setGrab(g); onGrabChange?.(g); }, [onGrabChange]);

  const name = React.useCallback((id) => (itemName ? itemName(id) : String(id)), [itemName]);

  /* Guards fire when a prop is actually NEEDED — never from render and never on
     a timer. A DC consumer's `{{ }}` holes resolve mid-stream, so any timed
     check races the stream and warns falsely on some loads and not others.
     By the time a real interaction happens the props are whatever they will be,
     which is the only moment the check can be correct. */
  const warned = React.useRef({});
  const mismatch = React.useRef(null);   // set in render, reported from guard()
  const guard = React.useCallback(() => {
    const w = warned.current;
    if (mismatch.current != null && !w.kids) { w.kids = 1; console.warn('[Meridian] SortableCollection: ' + mismatch.current + ' children for ' + items.length + ' items. Children are paired with `items` by position, so a mismatch renders the wrong content in a row — render exactly one node per item, in `items` order.'); }
    if (!label && !w.label) { w.label = 1; console.warn('[Meridian] SortableCollection: `label` is required — it names the collection in every announcement ("Moved within Routing sequence"). Without it a screen-reader user is told a position with no subject.'); }
    if (!itemName && !w.itemName) { w.itemName = 1; console.warn('[Meridian] SortableCollection: `itemName` is required. Items are named by what they are, never by their index — the index is the thing being changed and cannot also be the name (pattern §14).'); }
    if (!onMove && !w.onMove) { w.onMove = 1; console.warn('[Meridian] SortableCollection: no `onMove`. The component never reorders `items` itself; without the callback a drop is a gesture that does nothing.'); }
    if (moveControls === 'none' && !w.controls) { w.controls = 1; console.warn('[Meridian] SortableCollection: moveControls="none" leaves the drag as the only route to a destination off screen, and removes the control a gloved hand on a tablet uses by preference. Supported, but state the reason (pattern §11).'); }
    if (new Set(items).size !== items.length && !w.dupes) { w.dupes = 1; console.warn('[Meridian] SortableCollection: `items` contains duplicate identities. Order is held by identity — duplicates make a grab ambiguous and a rollback impossible.'); }
  }, [label, itemName, onMove, moveControls, items]);

  const H = `var(--control-h-${['sm', 'md', 'lg'].indexOf(size) > -1 ? size : 'md'})`;

  /* Legality is a rule over a candidate order, evaluated locally for every
     position while the item is in hand. A refusal is a REASON, not a false. */
  const legalityAt = React.useCallback((id, to) => {
    if (!canDrop) return null;
    const next = items.filter((x) => x !== id);
    next.splice(to, 0, id);
    const r = canDrop(id, to, next);
    if (r === true || r == null) return null;
    if (r === false) {
      if (!warnedBool) {
        warnedBool = true;
        console.warn('[Meridian] SortableCollection: `canDrop` returned false. Return the reason as a string instead — "Invalid position" names neither the rule nor anything the user can move instead (pattern §14).');
      }
      return 'That position is not available.';
    }
    return String(r);
  }, [canDrop, items]);

  const lock = React.useCallback((id) => {
    if (disabled) return disabledReason || 'Reordering is unavailable.';
    if (canMove) { const r = canMove(id); if (r !== true && r != null) return r === false ? 'This item cannot be moved.' : String(r); }
    return null;
  }, [canMove, disabled, disabledReason]);

  const say = React.useCallback((text) => { setSaid(text); onAnnounce?.(text); }, [onAnnounce]);

  const neighbours = React.useCallback((id, to) => {
    if (announcementScope !== 'position-and-neighbours') return '';
    const next = items.filter((x) => x !== id);
    next.splice(to, 0, id);
    const i = next.indexOf(id);
    return (i > 0 ? ' after ' + name(next[i - 1]) : ' at the front') + (i < next.length - 1 ? ', before ' + name(next[i + 1]) : '');
  }, [announcementScope, items, name]);

  /* The grab holds identity AND origin index, from the first moment. Both, or
     Escape and rollback are unimplementable (spec §13). */
  const doGrab = (id) => {
    guard();
    const why = lock(id);
    if (why) { say(name(id) + ' cannot be moved. ' + why); return; }
    const i = items.indexOf(id);
    if (i < 0) return;
    setGrabState({ id, originIndex: i, proposedIndex: i });
    say(name(id) + ' grabbed, position ' + (i + 1) + ' of ' + items.length + '. Up and down arrows to move it, Space to drop, Escape to leave it at ' + (i + 1) + '.');
  };

  /* Reads the grab from the ref: during a continuous pointer drag these fire
     faster than React commits, and a stale closure would propose from an
     out-of-date position. */
  const propose = (to) => {
    const g = grabRef.current;
    if (!g) return;
    const t = Math.max(0, Math.min(items.length - 1, to));
    if (t === g.proposedIndex) return;
    const why = legalityAt(g.id, t);
    if (why) {
      /* A pointer held over a refused position fires this many times a second;
         announce the rule once per position, not once per frame. */
      if (lastRefused.current === t) return;
      lastRefused.current = t;
      say('Position ' + (t + 1) + ' will not take ' + name(g.id) + '. ' + why + ' Still in hand at ' + (g.proposedIndex + 1) + '.');
      return;
    }
    lastRefused.current = null;
    setGrabState(Object.assign({}, g, { proposedIndex: t }));
    say('Would drop ' + name(g.id) + ' at ' + (t + 1) + ' of ' + items.length + neighbours(g.id, t) + '.');
  };

  const cancel = (quiet) => {
    const g = grabRef.current;
    if (!g) return;
    setGrabState(null);
    if (!quiet) say(name(g.id) + ' left at position ' + (g.originIndex + 1) + ' of ' + items.length + '. Nothing was requested.');
  };

  const drop = () => {
    const g = grabRef.current;
    if (!g) return;
    const { id, originIndex, proposedIndex } = g;
    if (proposedIndex === originIndex) { cancel(); return; }
    const why = legalityAt(id, proposedIndex);
    if (why) { say(name(id) + ' was not moved. ' + why + ' It is still in hand at position ' + (proposedIndex + 1) + '.'); return; }
    setGrabState(null);
    say('Moving ' + name(id) + ' to ' + (proposedIndex + 1) + ' of ' + items.length + neighbours(id, proposedIndex) + '\u2026');
    onMove?.(id, originIndex, proposedIndex);
  };

  /* `items` is the consumer's committed order and may change under a grab —
     someone else reorders, or the item is withdrawn. Identity holds; the
     origin index is re-derived, and a vanished item ends the grab. */
  /* Compared by VALUE, not array identity: a consumer that computes `items` in
     render passes a fresh array every time, and an identity-keyed effect then
     re-ran mid-grab and could reset a live proposal. */
  const orderKey = items.join('\u0000');
  React.useEffect(() => {
    const g = grabRef.current;
    if (!g) return;
    const i = items.indexOf(g.id);
    if (i < 0) {
      dragRef.current = null;
      detach();
      setGrabState(null);
      say(name(g.id) + ' left the collection while it was in hand. Nothing was requested and the move cannot be made.');
      return;
    }
    if (i !== g.originIndex) {
      setGrabState({ id: g.id, originIndex: i, proposedIndex: i });
      say(label ? label + ' changed underneath the grab. ' + name(g.id) + ' is now at position ' + (i + 1) + ' of ' + items.length + '.' : name(g.id) + ' is now at position ' + (i + 1) + '.');
    }
  }, [orderKey]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Which position the pointer is over, from the rows' own boxes — the only
     reading that stays correct while the list reflows under the drag. */
  const proposeFromPointer = (y) => {
    const g = grabRef.current;
    if (!g) return;
    let insertAt = items.length;
    for (let i = 0; i < items.length; i++) {
      const el = rowEls.current.get(items[i]);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (y < r.top + r.height / 2) { insertAt = i; break; }
    }
    propose(insertAt > g.originIndex ? insertAt - 1 : insertAt);
  };

  const pointerDown = (id, why) => (e) => {
    skipClick.current = null;           // never carry a stale suppression into a new press
    if (why || disabled || moveControls === 'none' || e.button > 0) return;
    dragRef.current = { id, pointerId: e.pointerId, startY: e.clientY, moved: false };
    /* Bound on the window for the drag's duration, NOT via element pointer
       capture. `lostpointercapture` fires before `pointerup` whenever capture
       ends or was never truly established, which discarded the drag mid-gesture
       and left a grab that could neither commit nor abandon. A window-bound
       pointerup cannot be pre-empted, so every drag has exactly one ending. */
    const move = (ev) => pointerMove(ev);
    const up = (ev) => { detach(); pointerUp(ev); };
    const cancelled = (ev) => { detach(); pointerCancel(ev); };
    winRef.current = { move, up, cancelled };
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancelled);
  };

  const detach = () => {
    const h = winRef.current;
    if (!h) return;
    winRef.current = null;
    window.removeEventListener('pointermove', h.move);
    window.removeEventListener('pointerup', h.up);
    window.removeEventListener('pointercancel', h.cancelled);
  };
  React.useEffect(() => detach, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pointerMove = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    if (!d.moved) {
      if (Math.abs(e.clientY - d.startY) < 4) return;   // a press is not yet a drag
      d.moved = true;
      if (!grabRef.current || grabRef.current.id !== d.id) doGrab(d.id);
      if (!grabRef.current) { dragRef.current = null; return; }   // refused by canMove
    }
    e.preventDefault();
    edge(e.clientY);
    proposeFromPointer(e.clientY);
  };

  const pointerUp = (e) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d || (e.pointerId != null && d.pointerId != null && e.pointerId !== d.pointerId)) return;
    if (!d.moved) return;
    /* Released away from the list: ambiguous, so it abandons rather than
       committing a position the pointer had already left (spec §13). */
    const box = rootRef.current && rootRef.current.getBoundingClientRect();
    if (box && (e.clientY < box.top - 24 || e.clientY > box.bottom + 24)) { cancel(); return; }
    // The press that dropped must not also re-grab — scoped to this handle and
    // this instant, never a flag left to be cleared later.
    skipClick.current = { id: d.id, at: Date.now() };
    drop();
  };

  const pointerCancel = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d && d.moved) cancel();     // a lost pointer resolves to the committed order
  };

  const onKeyDown = (id) => (e) => {
    if (e.key === 'Escape') { if (grab) { e.preventDefault(); cancel(); } return; }
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (grab && grab.id === id) drop(); else doGrab(id); return; }
    if (!grab || grab.id !== id) return;
    if (e.key === 'Tab') { cancel(); return; }              // focus never leaves a live grab silently
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); propose(grab.proposedIndex - 1); }
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); propose(grab.proposedIndex + 1); }
    if (e.key === 'Home') { e.preventDefault(); propose(0); }
    if (e.key === 'End') { e.preventDefault(); propose(items.length - 1); }
  };

  const edge = (clientY) => {
    if (!autoScroll) return;
    const box = scrollParent(rootRef.current);
    const t = box || null;
    if (!t) return;
    const r = t.getBoundingClientRect();
    if (clientY - r.top < 44) t.scrollTop = Math.max(0, t.scrollTop - 16);
    else if (r.bottom - clientY < 44) t.scrollTop = Math.min(t.scrollHeight - t.clientHeight, t.scrollTop + 16);
  };

  const step = (id, delta) => () => {
    guard();
    const from = items.indexOf(id);
    const to = from + delta;
    if (to < 0 || to > items.length - 1) return;
    const why = legalityAt(id, to);
    if (why) { say(name(id) + ' was not moved. ' + why); return; }
    say('Moving ' + name(id) + ' to ' + (to + 1) + ' of ' + items.length + neighbours(id, to) + '\u2026');
    onMove?.(id, from, to);
  };

  const insertBefore = grab ? (grab.proposedIndex >= grab.originIndex ? grab.proposedIndex + 1 : grab.proposedIndex) : -1;
  /* One child per item. A caller whose rows come from a single mapped
     expression hands us one fragment holding all of them; unwrap it so
     `children` behaves the same either way. */
  let kids = children != null ? React.Children.toArray(children) : null;
  if (kids && kids.length === 1 && items.length > 1 && kids[0] && kids[0].type === React.Fragment) {
    kids = React.Children.toArray(kids[0].props.children);
  }
  if (kids && kids.length && kids.length !== items.length) mismatch.current = kids.length;

  const indicator = (key) => (
    <li key={key} aria-hidden="true" data-sortable-indicator="" style={{ listStyle: 'none', height: '2px', margin: '2px 12px', borderRadius: '1px', background: 'var(--action-solid)' }} />
  );

  const Root = as === 'ol' ? 'ol' : as === 'div' ? 'div' : 'ul';
  const rows = [];
  items.forEach((id, i) => {
    if (grab && insertBefore === i) rows.push(indicator('ind-' + i));
    const inHand = !!(grab && grab.id === id);
    const why = lock(id);
    const content = kids ? kids[i] : renderItem?.(id, {
      index: i, position: i + 1, total: items.length, grabbed: inHand,
      proposedIndex: inHand ? grab.proposedIndex : null, immovable: why,
    });
    rows.push(
      <li
        key={id}
        ref={(el) => { if (el) rowEls.current.set(id, el); else rowEls.current.delete(id); }}
        style={{
          listStyle: 'none', position: 'relative', display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          minHeight: H, paddingInlineStart: 'var(--space-1)',
          borderInlineStart: '2px solid ' + (inHand ? 'var(--action-solid)' : 'transparent'),
          background: inHand ? 'var(--status-info-soft)' : 'transparent',
        }}
      >
        <span style={{ flex: 'none', display: 'flex', width: H, height: H }}>
          <IconButton
            icon={HANDLE}
            size={size}
            variant="ghost"
            disabled={!!why}
            aria-pressed={inHand}
            aria-describedby={instrId}
            onPointerDown={pointerDown(id, why)}
            label={why ? name(id) + ' cannot be moved \u2014 ' + why
              : inHand ? 'Drop ' + name(id) + ' at position ' + (grab.proposedIndex + 1) + ' of ' + items.length
                : 'Move ' + name(id) + ', position ' + (i + 1) + ' of ' + items.length}
            onClick={() => {
              const s = skipClick.current;
              skipClick.current = null;
              if (s && s.id === id && Date.now() - s.at < 300) return;   // the drop's own press
              inHand ? drop() : doGrab(id);
            }}
            onKeyDown={onKeyDown(id)}
            style={{ width: H, cursor: why ? 'not-allowed' : inHand ? 'grabbing' : 'grab', touchAction: 'none' }}
          />
        </span>
        <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
          {'Position ' + (i + 1) + ' of ' + items.length + (inHand ? ', in hand from ' + (grab.originIndex + 1) : '')}
        </span>
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>{content}</div>
        {moveControls === 'handle-and-steppers' ? (
          <span style={{ flex: 'none', display: 'flex', gap: '2px' }}>
            <IconButton icon="arrow-up" size={size} variant="ghost" label={'Move ' + name(id) + ' earlier'}
              disabled={!!why || i === 0 || !!legalityAt(id, i - 1)} onClick={step(id, -1)} />
            <IconButton icon="arrow-down" size={size} variant="ghost" label={'Move ' + name(id) + ' later'}
              disabled={!!why || i === items.length - 1 || !!legalityAt(id, i + 1)} onClick={step(id, 1)} />
          </span>
        ) : null}
      </li>
    );
  });
  if (grab && insertBefore === items.length) rows.push(indicator('ind-tail'));

  return (
    <Root
      ref={rootRef}
      aria-label={label}
      aria-describedby={instrId}
      {...rest}
      style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', ...style }}
    >
      {rows}
      <li aria-hidden="true" style={{ listStyle: 'none', position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
        <span id={instrId}>
          {disabled ? (disabledReason || 'Reordering is unavailable.')
            : 'Press Space or Enter to grab an item, arrow keys to move it, Space to drop, Escape to leave it where it was.'}
        </span>
      </li>
      {liveRegion ? (
        <li role="status" aria-live="polite" style={{ listStyle: 'none', position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{said}</li>
      ) : null}
    </Root>
  );
}
