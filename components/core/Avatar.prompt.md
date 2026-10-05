A person or a machine, identified in the space of a table row.

```jsx
<Avatar name="Maya Osei" />                                  // MO
<Avatar name="李小龙" />                                       // 李 — one glyph, never two
<Avatar name="PRS-4120" kind="machine" />                     // PR — mono, square corners
<Avatar name="Tomas Lind" status="online" statusLabel="online" size="lg" />
<AvatarGroup people={['Maya Osei','Tomas Lind','Ana Ruiz','Ken Ito','Jo Park']} max={4} />
```

**No colour identity, deliberately.** Every ramp in this system already means something — green is Success, red is Critical, `--viz-1…6` is series identity — so a hashed hue would put a Critical-red disc beside one operator and a Success-green one beside the next. Initials identify; the disc is always sunken. Only the presence dot is coloured, because presence is a state.

Pass `decorative` whenever the name is already beside it — a table cell, a list row. That is the common case, and it stops the same name being announced twice.

No `onClick`: wrap it in a `Button` or `Link` so it gets a role, a focus ring and a keyboard. Same rule as `Icon`. Below 24px only one initial fits and `status` is refused. Use `AvatarGroup` for several — it announces the shown people once, and its “+N more” chip is focusable with a Tooltip naming the rest. `Menu` items accept an Avatar in their `icon` slot for a switch-account list.
