# Sankey Diagram Component Prompt Reference

The **Sankey Diagram** visualization displays quantitative transfers, conversions, splits, and merges across entities and sequential process stages where link ribbon thickness directly encodes flow volume.

## When to Use
- Visualizing energy transformation, mass balances, water circuits, supply chains, and defect cost flows.
- Understanding multi-stage conversion efficiency and routing pathways.
- Tracing connected upstream inputs and downstream outputs via interactive path highlighting.

## When NOT to Use
- General hierarchy containment without physical flow (use `Treemap` or `TreeDiagram`).
- Unweighted relational networks (use Network Graph).
- Simple single-stage part-to-whole questions (use `BarChart` or `PieChart`).

## Key Properties
- `align`: `'justify'` (default; pushes sink nodes to last column) | `'left'` | `'right'` | `'center'`.
- `linkGradient`: Renders smooth source-to-target color gradients along flow ribbons.
- `patternFills`: Applies SVG hatch patterns for WCAG 2.2 AA non-color discernment.

## Keyboard & Accessibility
- <kbd>&larr;</kbd>/<kbd>&rarr;</kbd>/<kbd>&uarr;</kbd>/<kbd>&darr;</kbd>: Roving focus across stage nodes.
- <kbd>Enter</kbd> / <kbd>Space</kbd>: Select and lock flow path isolation.
- <kbd>Alt+F11</kbd>: Open accessible flow tabular modal with source-target-value records.
