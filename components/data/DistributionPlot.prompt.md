# DistributionPlot (`components/data/DistributionPlot.jsx`)

Use `DistributionPlot` to describe the shape, frequency, density, spread, central tendency, quantiles, and outliers of one or more quantitative distributions.

---

## 1. When to Use vs Other Charts
- **Distribution Plot (this component)**: Use when understanding the statistical distribution (median, IQR, skewness, modality, outliers, frequency spread) of quantitative variables across one or more cohorts.
- **Bar Chart (`BarChart`)**: Use for discrete aggregated category sums/counts, NOT continuous distributions.
- **Scatter Plot (`ScatterPlot`)**: Use for bivariate correlation between two independent quantitative variables.

---

## 2. Included Variants

| Variant | Purpose | Key Prop Configuration |
| :--- | :--- | :--- |
| `histogram` | Equal-width frequency bins displaying empirical shape and count. | `variant="histogram"` |
| `box` | Tukey 5-number summary ($Q_1$, Median, $Q_3$, Whiskers, Outliers). | `variant="box"` |
| `violin` | Mirrored KDE density envelope combining shape with embedded quantiles. | `variant="violin"` |
| `strip` | Jittered raw observations along categorical lanes preserving every point. | `variant="strip"` |
| `dotplot` | Stacked discrete unit dots representing integer counts. | `variant="dotplot"` |
| `density` | Continuous smoothed Gaussian KDE density curve with shaded area. | `variant="density"` |

---

## 3. Mandatory Rules & Anti-Patterns
- **Never Hide Distributions Behind Averages Alone**: Never report only mean $\pm$ standard deviation for skewed or bimodal distributions; box or violin plots must expose true median and quartile spreads.
- **Document Bin Policies**: Histogram bin count must default deterministically to Sturges' rule ($k = \lceil\log_2 n + 1\rceil$) or Freedman-Diaconis rule.
- **Statistical Summary Parity (WCAG 2.2 AA)**: All box and violin plots must expose programmatic statistical metadata (Median, $Q_1$, $Q_3$, IQR, Min, Max, Outliers) via <kbd>Alt+F11</kbd> accessible summary table and live screen reader speech.

---

## 4. Manufacturing ERP Scenario Context
- **Entity**: *Suryodaya Autocomp Ltd — Chakan plant (PL-04), Pune*.
- **Metrics**: Press Sheet Metal Thickness Variation ($2.000\text{ mm} \pm 0.050\text{ mm}$), CNC Spindle Vibration Spread (mm/s), Heat Treatment Quench Hardness (HRC), Machining Surface Roughness (Ra µm).
- **Locale**: `en-IN` (Indian numbering system).
