# Heatmap (`components/data/Heatmap.jsx`)

Use `Heatmap` to reveal patterns, anomalies, hotspots, correlations, and intensity gradients across two-dimensional categorical, ordinal, temporal, or discretized quantitative structures.

---

## 1. When to Use vs Other Charts
- **Heatmap (this component)**: Use when evaluating two-dimensional matrices (rows $\times$ columns) where dense pattern recognition, hotspot detection, or cross-correlation is the primary analytical task.
- **Bar Chart (`BarChart`)**: Use when comparing 1-dimensional discrete categories against a single quantitative baseline.
- **Scatter Plot (`ScatterPlot`)**: Use for continuous observation-level correlations between independent continuous variables ($x, y$).

---

## 2. Included Variants

| Variant | Purpose | Key Prop Configuration |
| :--- | :--- | :--- |
| `matrix` | Standard 2D tabular heatmap (Row Category $\times$ Column Category). | `variant="matrix"` |
| `clustered` | Hierarchically ordered matrix grouping similar rows/columns. | `variant="clustered"` |
| `calendar` | Temporal matrix mapping days of week against weeks of month/year. | `variant="calendar"` |
| `correlation` | Symmetric square matrix for correlation coefficients $r \in [-1, +1]$. | `variant="correlation" colorScaleType="diverging"` |

---

## 3. Mandatory Rules & Anti-Patterns
- **Never Rely on Rainbow Color Maps**: Rainbow / spectral palettes distort cognitive intensity gradients. Always use perceptual sequential (e.g. light blue $\to$ dark blue) or diverging (negative red $\to$ neutral white $\to$ positive blue) scales.
- **Missing vs Zero Semantics**: Missing cells and machine downtime periods must render with a distinct diagonal hatch pattern (`missingCellLabel`), never as zero values.
- **High-Contrast Text Inversion**: In-cell text values must dynamically invert between dark slate (`#0f172a`) on light cells and white (`#ffffff`) on saturated dark cells.
- **Accessibility Parity (WCAG 2.2 AA)**: Color intensity cannot be the sole conveyor of information; all cells must expose exact values and coordinates via <kbd>Alt+F11</kbd> accessible data table and live screen reader speech.

---

## 4. Manufacturing ERP Scenario Context
- **Entity**: *Suryodaya Autocomp Ltd — Chakan plant (PL-04), Pune*.
- **Telemetry**: Machine Cell vs Shift Hour Thermal Load (°C), Daily Scrap Generation Matrix (kg), Sensor Cross-Correlation Matrix ($r$), Tool Wear Defect Matrix.
- **Locale**: `en-IN` (Indian numbering system).
