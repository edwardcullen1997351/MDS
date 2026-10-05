The mechanics of moving an item to a new position — the grab, the modal keyboard grab, the insertion indicator, per-position legality, bounded auto-scroll, the announcements. Composite: promoted from the [direct manipulation of order](../../specs/patterns/DirectManipulationOfOrder.spec.html) pattern, which keeps everything about the commit.

**It does not own the move.** `items` is your committed order; the component never reorders it. A legal drop calls `onMove`, and only your own successful write changes `items`.

```jsx
<SortableCollection
  label="Routing sequence"
  items={order}                                  // stable identities, committed order
  itemName={(id) => 'op ' + OPS[id].seq + ' ' + OPS[id].name}
  canMove={(id) => id === 'OP10' ? 'Pinned first — the raw blank starts here.' : true}
  canDrop={(id, to, next) =>
    next.indexOf('OP50') > next.indexOf('OP20') ||
    'Op 50 CNC bore is pinned to fixture FX-2210, which requires op 20 Pierce complete.'}
  onMove={(id, from, to) => commitSequence(id, from, to)}   // you commit; you roll back
>
  {order.map((id) => <RoutingRow key={id} id={id} />)}
</SortableCollection>
```

One child per item, **in `items` order** — the component wraps each in the row, the handle, the steppers and the position text. `renderItem(id, state)` is the alternative if you would rather map inside.

`canDrop` returns `true` or **the reason as a string**; a string is announced as the refusal and suppresses the insertion point. Returning `false` warns — "Invalid position" names neither the rule nor anything the user can move instead. `canMove` returns the reason an item is pinned, and its handle is disabled carrying that reason as its name.

Keyboard is the same operation, not a fallback: `Space`/`Enter` grabs, arrows move the proposal, `Home`/`End` jump, `Space` drops, `Escape` leaves it where it was, `Tab` cancels the grab rather than escaping it silently. Both paths run one `canDrop`.

Do not use it for a sorted view (`Table`'s column sort commits nothing — disable reordering while a foreign sort is applied, with `disabled` and `disabledReason`), for transfer between two collections (still a pattern: the commit spans both), or with `items` keyed by index. `onGrabChange` is for a status line, not a way to drive the grab.

`moveControls="none"` warns. A destination twenty rows away is faster typed than dragged, and a drag is not an input a gloved hand on a shop-floor tablet has.
