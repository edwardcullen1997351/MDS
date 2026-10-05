One line of text and one action, anchored to the bottom of the surface that raised it. Unlike `Toast` it is declarative and singular — the surface owns `open`, there is no queue, and a new message replaces the current one.

```jsx
const [held, setHeld] = React.useState(null);

<div style={{ position: 'relative' }}>          {/* the scope */}
  <LineTable onHold={setHeld} />
  <Snackbar open={!!held} message={`${held?.name} held`} onDismiss={() => setHeld(null)}
            action={<Button variant="link" size="sm" onClick={undo}>Undo</Button>} />
</div>
```

No tones and no icon: if the message needs a colour it needs a `Toast` or an inline error. `placement="attached"` sits flush on the container's bottom edge for panels and drawers; `scope="page"` is fixed at the bottom of the viewport. Auto-dismisses after 6s, pauses on hover and focus, and every action in it must also exist somewhere permanent.
