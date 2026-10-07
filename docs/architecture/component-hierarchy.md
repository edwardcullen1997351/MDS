# Meridian Component Hierarchy

Meridian enforces a strict 3-tier component architecture:

```
┌─────────────────────────────────────────────────────────┐
│               MERIDIAN DESIGN SYSTEM                    │
└────────────────────────────┬────────────────────────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     ▼                       ▼                       ▼
Tier 1: Primitives      Tier 2: Components      Tier 3: Composites
(Foundational)          (Single-Purpose)        (Multi-Part)
```

---

## Tier 1: Primitives (Foundations & Layout)
- **Role:** Pure layout, geometry, and typographic wrappers with zero business logic.
- **Props:** Directly consume token scales (`gap`, `p`, `tone`, `radius`).
- **Inventory:** `Box`, `Stack`, `Grid`, `Container`, `Spacer`, `Divider`, `Text`, `Heading`, `Surface`, `Image`, `AspectRatio`.
- **Governance:** Documented by `.d.ts`, `.prompt.md`, `scale.js`, and `guidelines/primitives-policy.card.html`.

---

## Tier 2: Components (Single-Purpose UI Elements)
- **Role:** Discrete controls and single-responsibility interface units.
- **Sub-domains:**
  - **Core / General:** `Button`, `IconButton`, `ButtonGroup`, `Avatar`, `AvatarGroup`, `Badge`, `Chip`, `Tag`, `Card`, `Link`, `SegmentedControl`, `Fieldset`, `Icon`.
  - **Forms:** `Input`, `Textarea`, `Select`, `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `Switch`, `Slider`, `RangeSlider`, `DatePicker`, `TimeField`, `Autocomplete`, `Combobox`, `MultiCombobox`, `FileDropzone`, `FileItem`.
  - **Feedback:** `Alert`, `Dialog`, `Drawer`, `Popover`, `Tooltip`, `Toast`, `Snackbar`, `Progress`.
  - **Navigation:** `Tabs`, `Breadcrumb`, `Menu`, `Pagination`, `StepNavigation`, `SequentialNavigation`, `GlobalNavigation`, `LocalNavigation`, `InPageNavigation`, `TreeNavigation`, `ScopeNavigation`.
  - **Data & Visualization:** `Table`, `List`, `DescriptionList`, `Tree`, `EmptyState`, `Skeleton`, `BarChart`, `LineChart`, `AreaChart`, `PieChart`, `Heatmap`, `GeoMap`, `GanttChart`, `ScatterPlot`, `Treemap`, `NetworkDiagram`, `ParallelCoordinates`, `DistributionPlot`, `RangeChart`, `SankeyDiagram`, `TreeDiagram`.

---

## Tier 3: Composites (Multi-Part Assemblies & Compound Widgets)
- **Role:** Coordinated multi-component assemblies that introduce specialized contracts, multi-field synchronization, or aggregate workflows.
- **Inventory:** `DateRangePicker`, `DateTimePicker`, `FileUpload`, `ScopePicker`, `SearchField`, `SortableCollection`, `SplitButton`, `Toolbar`, `TelemetryConsole`, `ConcurrentConflictResolver`, `StockRunwayHorizon`.
- **Governance:** Governed by `guidelines/composite-spec-standard.card.html`.
