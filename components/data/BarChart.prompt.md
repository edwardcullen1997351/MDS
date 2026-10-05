Compares quantitative magnitude across discrete categories. Prefer when accurate comparison, ranking, or categorical composition is more important than continuity.

```jsx
<BarChart
  title="Shop floor scrap rate by line"
  caption="Monthly scrap variance across Chakan plant press lines"
  data={[
    { line: 'Line 1 (Tandem)', scrap: 142000, target: 120000 },
    { line: 'Line 2 (Prog)', scrap: 88000, target: 100000 },
    { line: 'Line 3 (Transfer)', scrap: 215000, target: 150000 },
    { line: 'Line 4 (Blanking)', scrap: 64000, target: 80000 },
  ]}
  categoryKey="line"
  valueKey="scrap"
  unit="₹"
  variant="horizontal"
  referenceLines={[{ value: 120000, label: 'Ceiling Threshold', tone: 'danger' }]}
  onSelect={(row) => console.log('Selected line:', row)}
/>
```

**Never truncate the quantitative baseline above zero for magnitude comparison** — doing so exaggerates small differences and misleads operators. Use `variant="horizontal"` when category labels are long (e.g. machine names or part numbers). Multi-series comparisons use `variant="grouped"` or `variant="stacked"`. For part-to-whole proportions, use `variant="normalized"`. Accessible screen-reader support, keyboard traversal (<kbd>←</kbd>/<kbd>→</kbd>), and tabular view toggle (<kbd>Alt+F11</kbd>) are built in.
