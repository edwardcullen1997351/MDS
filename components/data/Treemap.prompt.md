# Treemap Component Prompt Reference

The **Treemap** visualization displays hierarchical quantitative data as nested rectangles whose areas encode magnitude while preserving parent-child containment.

## When to Use
- Comparing quantitative magnitudes within a 2+ level hierarchy (e.g. Plant &rarr; Shop &rarr; Line &rarr; Machine).
- Part-to-whole questions where both high-level allocation and leaf-level granularity are critical.
- Maximizing screen real estate when visualizing hundreds of category leaf items.

## When NOT to Use
- Sequential time-series trends (use `LineChart` or `AreaChart`).
- Comparing small discrete categories with high reading precision requirements (use horizontal `BarChart`).
- Unstructured observations with multiple quantitative measures (use `ScatterPlot`).

## Key Properties
- `algorithm`: `'squarified'` (default; optimizes tile aspect ratios ~1.0) or `'slice-and-dice'` (alternates horizontal/vertical splits by depth).
- `enableDrilldown`: Allows clicking or pressing <kbd>Enter</kbd> on a branch container to zoom into its subtree with interactive breadcrumbs.
- `patternFills`: Overlays WCAG 2.2 AA compliant monochrome hatch patterns for non-color differentiation.
- `maxDepth`: Restricts visible hierarchy rendering depth to avoid visual clutter.

## Keyboard & Accessibility
- <kbd>&larr;</kbd>/<kbd>&rarr;</kbd>/<kbd>&uarr;</kbd>/<kbd>&darr;</kbd>: 2D roving navigation between tiles.
- <kbd>Enter</kbd> / <kbd>Space</kbd>: Zoom/drill down into branch or select leaf.
- <kbd>Backspace</kbd> / <kbd>Esc</kbd>: Navigate up one hierarchy level in breadcrumb trail.
- <kbd>Alt+F11</kbd>: Open accessible hierarchical table modal.
