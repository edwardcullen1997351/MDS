# Tree Diagram Component Prompt Reference

The **Tree Diagram** component visualizes explicit parent-child topology, lineage, branching, and asset hierarchy paths. It emphasizes structural clarity and navigation over quantitative area comparison.

## When to Use
- Visualizing structural parent-child relationships (e.g. Asset Hierarchy, Bill of Materials BOM, Organizational structures).
- Lineage tracing and ancestry inspection (highlighting paths from root to selected leaf).
- Progressive disclosure of deep hierarchies using collapsible branching nodes.

## When NOT to Use
- Comparing quantitative proportion or area shares across categories (use `Treemap` or `PieChart`).
- Arbitrary non-hierarchical network graphs with multi-parent cyclical links (use Network Graph).
- Sequential time-series trends (use `LineChart`).

## Key Properties
- `orientation`: `'horizontal'` (left-to-right; default for BOM and asset trees) | `'vertical'` (top-to-bottom).
- `linkStyle`: `'smooth'` (cubic bezier curves) | `'step'` (orthogonal right-angle connectors) | `'straight'` (direct linear segments).
- `collapsible`: Enables interactive toggle badge $(+ / -)$ on branch nodes.
- `zoomable`: Provides pan & zoom viewport controls with reset capability.

## Keyboard & Accessibility
- <kbd>&larr;</kbd>/<kbd>&rarr;</kbd>/<kbd>&uarr;</kbd>/<kbd>&darr;</kbd>: Traverse parent, child, and sibling nodes based on orientation.
- <kbd>Enter</kbd> / <kbd>Space</kbd>: Toggle branch expansion/collapse or select leaf node.
- <kbd>Home</kbd> / <kbd>End</kbd>: Focus root node / deepest leaf.
- <kbd>Alt+F11</kbd>: Open accessible hierarchical tree table modal.
