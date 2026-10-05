# AreaChart (`components/data/AreaChart.jsx`)

Use `AreaChart` to show quantitative change over an ordered domain while emphasizing accumulated magnitude, volume, or changing composition over time.

---

## 1. When to Use vs Other Charts
- **Area Chart (this component)**: Use when total volume, accumulated magnitude, parts-to-whole accumulation over time, or organic compositional flow matters.
- **Line Chart (`LineChart`)**: Use when tracking fine rate of change, slope, individual series trends, or when comparing more than 4 intersecting lines where filled overlaps would cause occlusion.
- **Bar Chart (`BarChart`)**: Use for discrete, unordered categorical comparisons where observations do not have continuous sequence.

---

## 2. Included Variants

| Variant | Purpose | Key Prop Configuration |
| :--- | :--- | :--- |
| `single` | Single cumulative volume or consumption filled against baseline. | `variant="single"` |
| `stacked` | Cumulative parts-to-whole showing absolute totals and sub-series. | `variant="stacked"` |
| `normalized` | 100% share composition over time showing relative proportion shifts. | `variant="normalized"` |
| `diverging` | Areas expanding above and below a central baseline (e.g. net power delta). | `variant="diverging" baseline={0}` |
| `stream` | Silhouette streamgraph centered organically around a zero axis. | `variant="stream"` |

---

## 3. Mandatory Accessibility Contract
- **Hatch/Stipple Patterns**: Always enable `enablePatterns={true}` for multi-series area charts so color-blind users can distinguish overlapping and stacked layers without relying solely on color fills.
- **Top Boundary Stroke**: Each area layer includes a crisp 2px top boundary stroke matching its series color token.
- **Keyboard & Modal Table**: Supports 2D keyboard roving focus (<kbd>←</kbd>/<kbd>→</kbd> traverse ordered points, <kbd>↑</kbd>/<kbd>↓</kbd> switch series layers) and <kbd>Alt+F11</kbd> accessible data table modal disclosure.
- **Screen Reader Announcements**: Live region announces selected observation index, domain timestamp, series name, raw value, and percentage share.

---

## 4. Manufacturing ERP Scenario Context
- **Entity**: *Suryodaya Autocomp Ltd — Chakan plant (PL-04), Pune*.
- **Metrics**: Electrical Energy Consumption (kWh), Press Shop Scrap Breakdown (kg/hr), Downtime Cause Composition (%), Quench Thermal Flux (°C).
- **Locale**: `en-IN` (Indian numbering with `₹`, `L`, `Cr`, `°C`, `kWh`, `kg/hr`).
