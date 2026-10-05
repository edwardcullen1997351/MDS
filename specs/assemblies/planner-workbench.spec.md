# Planner workbench reference assembly

```yaml
id: ra-planner-workbench
status: candidate
version: 0.1.0
owner: Meridian Design System Council
engineering_lead: UI Platform Team
accessibility_reviewer: unassigned
security_privacy_reviewer: unassigned
supported_frameworks: [react]
target_frameworks: [angular]
supported_themes: [light, dark]
supported_densities: [compact, comfortable]
supported_locales: [en-IN]
created: 2026-10-01
last_reviewed: 2026-10-01
next_review_due: 2026-11-01
open_items: 2
```

## Purpose and boundary

The canonical interactive assembly is currently implemented and browser-certified in React Storybook. Angular provides the corresponding design-system components, including the three-pane template and stock/transit visualizations, but does not yet have a Planner Workbench assembly or assembly-level browser certification.

Use this assembly to coordinate and execute multi-facility supply chain planning, time-phased production scheduling, and inventory runway monitoring across plants and central staging warehouses.

Outcome: a master planner can reconcile intercompany stock transfers between **Asclepius Wellness (Food & Syrup Plant F-119)** and **Anantshriveda Natural Care (Central RM Warehouse H-9)**, detect concurrent allocation conflicts before they corrupt shop-floor execution, and perform optimistic drag-and-drop shift rescheduling with capacity and transit lead time validation.

## Dependencies

- Layout & Navigation: `Workbench3PaneLayout`, `EntityFacilitySelector`, `TimeHorizonStepper`, `Tabs`, `Breadcrumb`
- Hierarchy & Table: `TreeGridCell`, `TimePhasedMatrix`, `DualUomBadge`, `StaleDataPill`
- Concurrency & Reschedule: `ConcurrentConflictResolver`, `OptimisticDragReschedule`
- Visualizations & Glyphs: `StockRunwayHorizon`, `LeadTimeTransferGlyph`, `IntercompanyStockRibbon`
- Primitives: `Button`, `Badge`, `Card`, `Tooltip`

## Assembly-owned contract

- **Multi-Facility Scope Reactivity**: Switching between Asclepius Plant F-119 and Anantshriveda Warehouse H-9 dynamically updates resource hierarchies, stock runways, and staging bay allocations.
- **Non-Destructive Conflict Resolution**: When an allocation fails due to an ETag 409 mismatch, the planner's input state is preserved while opening a side-by-side comparison drawer with 3 deterministic resolution actions: *Accept Remote & Re-calculate*, *Force Override (Admin)*, or *Allocate Remaining Delta (50 kg)*.
- **Optimistic Shift Dispatch with Spring Rebound**: Dragging order blocks between shifts optimistically places cards immediately. Background asynchronous validation verifies line capacity and lead times; on capacity breach, order cards smoothly bounce back using a spring curve with an inline error announcement.
- **Micro-Scale Visualizations**: Stock coverage is glanceable via inline 24px micro-SVG bars (`StockRunwayHorizon`) tracking safe days, reorder thresholds, and zero-stockout markers alongside road-transit glyphs (`LeadTimeTransferGlyph`).

## Required states

`ready`, `concurrent-conflict`, `optimistic-rebound`, `stale`, `stress-high-density`, `anantshriveda-warehouse`, `minimum-content`, `long-labels`, `missing-data`, `loading`, `empty-state`, `error-state`, `disabled-actions`.

## Responsive and accessibility

- $\ge 1024\text{px}$: 3-pane workbench layout with splitters, collapsible sidebars, and desktop controls.
- $< 1024\text{px}$: Responsive top-tabbed navigation (NotebookLM pattern) transitioning between *Resource Hierarchy*, *Schedule Matrix*, and *Inspector*.
- Full keyboard focus trapping and Escape dismiss for overlay drawers.
- Zero horizontal page overflow (`scrollWidth <= clientWidth + 2`) across 320px, 390px, 768px, and 1440px viewports.
- Zero axe-core WCAG 2.2 AA violations.

## Candidate budgets

- Initial render under 250 ms at p75.
- Optimistic drag card feedback under 16 ms (60 fps).
- Spring rebound animation duration 450 ms with reduced-motion bypass.
- Conflict drawer open under 50 ms.

## Adoption rules

Adopters wire live MES and ERP telemetry endpoints to `onValidateReschedule`, `onAcceptRemote`, `onForceOverride`, and `onRefresh`. They retain the non-destructive conflict drawer, spring rebound error physics, and dual UoM conversion contracts.
