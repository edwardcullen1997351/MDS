# Network Diagram Component Prompt Reference

The **Network Diagram** visualization explores arbitrary relational structures, connectivity, clusters, communities, and central hubs where relationships cannot be simplified to strict single-parent trees or sequential stages.

## When to Use
- Visualizing complex multi-to-multi topologies (e.g. Industrial IoT Sensor communication mesh, Tier-1 supply chains, cross-functional organizational dependency networks).
- Inspecting degree centrality, connectivity density, and community clusters.
- Isolating 1-hop and 2-hop connected neighborhoods on hover or selection.

## When NOT to Use
- Hierarchical single-parent taxonomy trees (use `TreeDiagram` or `Treemap`).
- Conserved multi-stage quantitative transfers (use `SankeyDiagram`).
- Plain tabular lists with no graph relationships (use Table).

## Key Properties
- `layout`: `'force'` (default; deterministic simulated annealing physics) | `'circular'`.
- `directed`: Renders directional arrowhead markers on edges.
- `searchable`: Provides integrated search field to highlight matching nodes.
- `zoomable`: Enables pan & zoom viewport controls.

## Keyboard & Accessibility
- <kbd>&larr;</kbd>/<kbd>&rarr;</kbd>/<kbd>&uarr;</kbd>/<kbd>&darr;</kbd>: Traverse nodes.
- <kbd>Enter</kbd> / <kbd>Space</kbd>: Select node and lock neighborhood highlighting.
- <kbd>Alt+F11</kbd>: Open accessible network relationship and adjacency table modal.
