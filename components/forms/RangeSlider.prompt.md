Two thumbs, one range. A sibling of `Slider`, not a `range` prop on it — a second thumb changes what the control is.

```jsx
<RangeSlider label="Cycle time" value={range} onChange={setRange}
  min={0} max={60} step={0.5} unit="s" minDistance={1} />
```

`onChange` receives the new `[low, high]` pair, not an event. Thumbs may meet but never cross, and one never pushes the other — it stops at `minDistance`, because pushing silently rewrites a value the user set deliberately.

Each thumb is a real `<input type="range">` whose accessible name is composed from `label` plus its own qualifier (`startLabel`/`endLabel`, default "Minimum"/"Maximum") — "Price band Minimum", "Price band Maximum", so both are keyboard-operable and announce independently. Dragging is handled on the track so the two stay separable when they sit on the same value.

Use `Slider` for one value. Use two `Input`s when the bounds are typed precisely (a price filter someone knows the numbers for) — a slider is for choosing approximately.
