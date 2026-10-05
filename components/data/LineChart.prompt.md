Shows change, trajectory, trend, and rate across an ordered, usually temporal, domain. Prefer when continuity, rate of change, or sequential trajectory is more important than discrete categorical comparison.

```jsx
<LineChart
  title="CNC Spindle Vibration Telemetry (24-Hour IST)"
  caption="Chakan plant PL-04 Line 2 spindle vibration monitoring"
  data={[
    { time: '06:00', vibration: 1.2, setpoint: 2.0 },
    { time: '08:00', vibration: 1.4, setpoint: 2.0 },
    { time: '10:00', vibration: 1.9, setpoint: 2.0 },
    { time: '12:00', vibration: 2.6, setpoint: 2.0 },
    { time: '14:00', vibration: 2.1, setpoint: 2.0 },
    { time: '16:00', vibration: 1.5, setpoint: 2.0 },
  ]}
  xKey="time"
  yKey="vibration"
  unit="mm/s"
  referenceLines={[{ value: 2.5, label: 'UCL (2.5 mm/s)', tone: 'danger' }]}
  onSelect={(point) => console.log('Selected timestamp:', point)}
/>
```

**Never use a Line Chart for unordered categories** — connecting unordered categories implies false continuity. Multi-series charts must differentiate series using distinct stroke dashes and point glyphs (circles, squares, diamonds) in addition to colors. For discrete transitions (batch shifts, state changes), use `variant="stepped"`. For relative percentage change comparisons from a baseline, use `variant="indexed"`. Missing telemetry intervals must use `missingValuePolicy="dashed"` rather than silently connecting through machine downtime. Keyboard traversal (<kbd>←</kbd>/<kbd>→</kbd>) and accessible data table (<kbd>Alt+F11</kbd>) are built in.
