A value on a bounded range, used when the *position* on that range is what the operator is
judging — a threshold between two known limits, a sensitivity, a sample window. If the exact
figure matters more than the position, that is an `Input`; if the bar reports work the system is
doing, that is `Progress`.

```jsx
<Slider label="Fault threshold" unit="%" min={0} max={100} step={5}
  value={threshold} onChange={e => setThreshold(Number(e.target.value))}
  marks={[{value:0,label:'0'},{value:50,label:'50'},{value:100,label:'100'}]} />
<Slider label="Sample window" min={30} max={600} step={30} format={v => `${v/60} min`} />
```

Always keep the mono readout (`showValue`, on by default) — a track alone cannot say 68. Label the
quantity, never the act of dragging. No two-thumb range, no vertical orientation, no tones.
See `specs/forms/Slider.spec.html`.
