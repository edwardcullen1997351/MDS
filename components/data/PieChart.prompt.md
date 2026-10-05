# PieChart (`components/data/PieChart.jsx`)

Use `PieChart` to show a small number of mutually exclusive parts of a single whole (typically 2–6 categories) where angular sectors encode proportional share.

---

## 1. When to Use vs Other Charts
- **Pie / Donut Chart (this component)**: Use ONLY for simple, mutually exclusive part-to-whole proportional shares of a single genuine 100% total (e.g. scrap composition, power consumption breakdown, downtime classification).
- **Bar Chart (`BarChart`)**: Use when comparing more than 6 categories, when accurate visual magnitude ranking is primary, or when negative values exist.
- **Stacked Area Chart (`AreaChart`)**: Use when tracking part-to-whole composition evolving over an ordered time series.

---

## 2. Included Variants

| Variant | Purpose | Key Prop Configuration |
| :--- | :--- | :--- |
| `pie` | Full solid circular disk ($r_{inner} = 0$) displaying pure sector angles. | `variant="pie"` |
| `donut` | Annular ring ($r_{inner} > 0$) with central total readout and label. | `variant="donut" innerRadiusRatio={0.62}` |

---

## 3. Mandatory Rules & Anti-Patterns
- **7-Category Ceiling**: Never display more than 6–7 categories in a pie chart. If more categories exist, consolidate minor slices into an "Other" category or use a horizontal `BarChart`.
- **Zero & Negative Values Prohibited**: Proportions must represent non-negative quantities summing to a meaningful whole ($100.0\%$).
- **No 3D Perspective or Explosions**: False perspective distortions and gratuitous slice explosions impair angular comparison.
- **Non-Color Category Differentiation (WCAG 1.4.1)**: Always overlay SVG hatch/stipple patterns (`PATTERN_PRESETS`) onto slice fills so color-deficient operators can distinguish sectors without color alone.
- **Keyboard & Modal Table**: Supports 2D keyboard roving focus (<kbd>←</kbd>/<kbd>→</kbd> traverse sectors in clockwise order, <kbd>Enter</kbd> to select) and <kbd>Alt+F11</kbd> accessible data table modal disclosure.

---

## 4. Manufacturing ERP Scenario Context
- **Entity**: *Suryodaya Autocomp Ltd — Chakan plant (PL-04), Pune*.
- **Metrics**: Scrap Loss Breakdown by Category (%), Press Shop Power Draw Breakdown (kWh with 1,050 kWh Center Total), Plant Downtime Classification (Hours), Quality Inspection Grade Split (Grade A/B/C).
- **Locale**: `en-IN` (Indian numbering system).
