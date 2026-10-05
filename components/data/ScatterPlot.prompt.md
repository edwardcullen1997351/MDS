# ScatterPlot (`components/data/ScatterPlot.jsx`)

Use `ScatterPlot` to reveal observation-level relationships, distributions, associations, clustering, outliers, and multivariate patterns between continuous and categorical variables.

---

## 1. When to Use vs Other Charts
- **Scatter Plot (this component)**: Use when individual observations, correlation strength, clustering anomalies, or multi-dimensional parameter distributions matter.
- **Line Chart (`LineChart`)**: Use when tracking continuous temporal trajectory where sequence connecting points represents a singular evolution over time.
- **Bar Chart (`BarChart`)**: Use for aggregated categorical comparisons across discrete groups.

---

## 2. Included Variants

| Variant | Purpose | Key Prop Configuration |
| :--- | :--- | :--- |
| `scatter` | Standard two-variable correlation/clustering with categorical shape glyphs. | `variant="scatter"` |
| `bubble` | Three-variable multivariate analysis using area-proportional mark sizing. | `variant="bubble" sizeKey="dieTemp"` |
| `connected` | Trajectory path connecting observations across sequential cycles or time. | `variant="connected"` |
| `jittered` | Categorical/ordinal domain with deterministic spatial displacement to resolve overlap. | `variant="jittered" xScaleType="band"` |
| `binned-density` | 2D rectangular/hexagonal grid aggregating dense observation clusters into counts. | `variant="binned-density" binSize={24}` |

---

## 3. Mandatory Rules & Anti-Patterns
- **Area Proportionality**: Mark sizing for bubble plots must ALWAYS scale proportional to area ($\sqrt{z}$ scaling via `createAreaScale`), NEVER linear radius scaling (which quadruples perceived visual area).
- **Non-Color Category Differentiation (WCAG 1.4.1)**: Distinct shape glyphs (`circle`, `square`, `diamond`, `triangle`, `cross`, `star`) must accompany color hues for all categorical series.
- **Keyboard Navigation**: Supports roving focus across sorted observation points (<kbd>←</kbd>/<kbd>→</kbd> by X position) and <kbd>Alt+F11</kbd> accessible data table modal disclosure.
- **Overplotting Management**: For datasets with &gt;1,000 points, activate `variant="binned-density"` or apply reduced opacity (`pointOpacity={0.4}`).

---

## 4. Manufacturing ERP Scenario Context
- **Entity**: *Suryodaya Autocomp Ltd — Chakan plant (PL-04), Pune*.
- **Telemetry**: CNC Spindle Speed vs Vibration (RPM vs mm/s), Press Stroke Rate vs Hydraulic Pressure (SPM vs bar), Carburizing Furnace Temperature vs Carbon Potential (°C vs %CP), Machining Surface Roughness (Ra µm).
- **Locale**: `en-IN` (Indian numbering system).
