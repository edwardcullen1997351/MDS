# Planner Workbench — Design System Decomposition & Gap Analysis

- **Reference Assembly**: `ra-planner-workbench`
- **Canonical Story**: `apps/storybook/src/stories/assemblies/PlannerWorkbench.stories.tsx`
- **Audit Date**: 2026-10-01
- **Status**: Formally Decomposed & Certified

---

## 1. Executive Taxonomy Matrix

| Layer | Design System Artifact | Gap Type | Missing Capability Solved |
| :--- | :--- | :--- | :--- |
| **Layout Template** | `Workbench3PaneLayout` | **Missing Structure** | 3-pane workbench (collapsible resources tree, central planning workspace, contextual inspector) with fluid `<1024px` top-tabbed mobile reflow. |
| **Navigation System** | `EntityFacilitySelector` | **Missing Traversal Mechanism** | Multi-enterprise facility scoping (Asclepius Plant F-119 ↔ Anantshriveda RM Warehouse H-9) preserving active workbench context. |
| **Navigation System** | `TimeHorizonStepper` | **Missing Traversal Mechanism** | Discrete temporal zooming across Shift, Day, Week, Month, and Quarter horizons. |
| **Interaction Pattern** | `ConcurrentConflictResolver` | **Missing Behavior** | Version mismatch (ETag 409) containment drawer with side-by-side local vs. remote diff and 3 one-click resolution actions. |
| **Interaction Pattern** | `OptimisticDragReschedule` | **Missing Behavior** | Optimistic drag-and-drop / keyboard shift rescheduling with real-time transit validation and animated rebound on constraint failure. |
| **Interaction Pattern** | `TreeGridKeyboardNav` | **Missing Behavior** | 2D hierarchical grid navigation (`ArrowUp`/`Down`/`Left`/`Right`, `Enter` expansion) with WCAG-compliant ARIA structure. |
| **Composite** | `TimePhasedMatrix` | **Missing Reusable Assembly** | High-density supply-demand matrix combining hierarchical row headers, bucket columns, inline runway visualizers, and cell editors. |
| **Composite** | `IntercompanyStockRibbon` | **Missing Reusable Assembly** | Consolidated 4-metric strip (`In-Transit STO`, `Available at Source`, `Safety Stock Target`, `Stockout Risk Date`) linking plant and warehouse. |
| **Component** | `TreeGridCell` | **Missing UI Element** | Indented hierarchical cell with level markers, branch toggle chevrons, and item labels. |
| **Component** | `DualUomBadge` | **Missing UI Element** | Glanceable primary/secondary unit-of-measure conversion badge (e.g., `1,850 L (1,850 kg)`). |
| **Component** | `StaleDataPill` | **Missing UI Element** | Telemetry freshness indicator with real-time age count, pulse status dot, and manual sync action. |
| **Component** | `LeadTimeTransferGlyph` | **Missing UI Element** | Inter-facility logistics badge (`H-9 ➔ F-119 [4h]`) depicting route, transport mode, and transit window. |
| **Data Visualization** | `StockRunwayHorizon` | **Missing Data Representation** | 24px micro-horizontal SVG bar displaying safe days (green), reorder zone (amber), and zero-stockout date marker (red pin). |

---

## 2. Inventions & Systematic Gap Classifications

### A. Missing Structure → Layout Template
* **The Gap**: The design system previously only provided standard single-column, dashboard-grid, and form-flow layouts. It lacked an enterprise-grade 3-pane workbench capable of hosting simultaneous hierarchical navigation, wide tabular planning matrices, and a right-rail telemetry inspector.
* **The Invention**: `Workbench3PaneLayout`.
* **Design System Hardening**:
  - Desktop (`>=1024px`): Fixed 280px left pane, fluid center pane (`minmax(0, 1fr)`), fixed 340px right inspector pane with independently scrollable internal viewports.
  - Mobile/Tablet (`<1024px`): Automatically replaces horizontal panes with an accessible tabbed navigation bar (`Resources`, `Schedule Matrix`, `Inspector`) with live badges and zero horizontal page overflow.

### B. Missing Traversal Mechanism → Navigation System
* **The Gap 1 (Spatial/Organizational)**: Planners needed to switch operational context between manufacturing plants (Asclepius) and raw material suppliers (Anantshriveda) without page reloads or dropping their active planning line filters.
  - **Invention**: `EntityFacilitySelector`.
* **The Gap 2 (Temporal)**: Supply planning operates at varying bucket granularities (hours in a shift, days in a week, weeks in a month). Traditional dropdowns or date pickers were too slow for operational planning.
  - **Invention**: `TimeHorizonStepper` with keyboard-selectable bucket chips and tabular date window descriptors.

### C. Missing Behavior → Interaction Patterns
* **The Gap 1 (ETag 409 Version Conflict)**: In multi-user ERP/MES environments, submitting a schedule change after another planner updated the same line resulted in generic toast errors ("Record updated by another user") that cleared the planner's unsaved form.
  - **Invention**: `ConcurrentConflictResolver`. A side-by-side drawer preserving local edits in the left column, rendering remote committed state in the right column, and offering three deterministic 1-click resolution actions: `Accept Remote & Re-calculate`, `Force Override (Admin)`, and `Allocate Remaining Delta (50 kg)`.
* **The Gap 2 (Optimistic Dispatch with Validation Rebound)**: Planners dispatch orders across shifts. Waiting for roundtrip backend constraint validation introduces unacceptable UI lag; however, purely client-side drag risks data corruption.
  - **Invention**: `OptimisticDragReschedule`. Updates UI optimistically on drop, checks line capacity and raw material transit lead times in the background, and smoothly animates the order block back to its original slot with an actionable error badge if constraints fail.
  - **A11y Innovation**: Built-in keyboard quick-jump buttons (`S1`, `S2`, `S3`) providing a 100% accessible alternative to drag-and-drop.

### D. Missing Reusable Assemblies → Composites
* **The Gap 1 (Time-Phased Production Matrix)**: No composite existed in the design system to handle dense supply/demand balancing where rows are hierarchical products/lines and columns are temporal buckets.
  - **Invention**: `TimePhasedMatrix`.
* **The Gap 2 (Intercompany Supply Ribbon)**: Multi-facility supply chains require at-a-glance synchronization of stock transfers (STOs).
  - **Invention**: `IntercompanyStockRibbon`.

### E. Missing UI Elements → Components
* **`TreeGridCell`**: Built for hierarchical table rows with proper `aria-expanded` and indent tracking without invalid ARIA placement on native `<td>`.
* **`DualUomBadge`**: Built to resolve pharmaceutical and food industry dual-unit requirements (bulk mass vs. liquid volume vs. packaged packs).
* **`StaleDataPill`**: Built to indicate live telemetry latency against cached operational databases.
* **`LeadTimeTransferGlyph`**: Built as an inline transfer indicator communicating warehouse origin, plant destination, and road transit hours.

### F. Missing Data Representation → Data Visualizations
* **The Gap**: Standard charts (line, bar, scatter) consume too much vertical space to fit inside dense matrix table rows. Planners needed instant visual stockout risk cues without opening separate analytical dashboards.
* **The Invention**: `StockRunwayHorizon`. A 24px micro-horizontal SVG bar rendered inline within matrix rows:
  - **Safe Zone (Green)**: Days of stock above safety buffer.
  - **Reorder Zone (Amber)**: Stock level below reorder threshold.
  - **Stockout Event (Red Marker)**: Precise projected date where inventory hits zero.

---

## 3. Design System Feedback Loop & Reusable Learnings

When stress-testing future anchor/satellite screens (e.g., Procurement Cockpit, Dispatch Console, Batch Genealogy), apply the following standardized rules derived from this workbench audit:

1. **Strict Semantic Token Rule (No `text-muted` on Subtle Surfaces)**:
   - *Learning*: `--ds-semantic-color-text-muted` (`#9ca3af`) on `--ds-semantic-color-surface-subtle` (`#f8fafc`) yields only 2.42:1 contrast (WCAG failure).
   - *Standard*: All text, labels, and badges on subtle or white surfaces must use `--ds-semantic-color-text-secondary` (`#475569`, >= 5.3:1 contrast).

2. **Native Table ARIA Contract (`aria-allowed-attr`)**:
   - *Learning*: Screen readers and axe-core flag `aria-level` and `aria-expanded` as invalid when placed directly on native `<td>` elements.
   - *Standard*: Place `role="row"` and `aria-level` on the parent `<tr>`, and place `aria-expanded` on the nested chevron `<button>`.

3. **No Interactive Containers (`nested-interactive`)**:
   - *Learning*: Marking cards with `role="button"` prevents nested action buttons (quick-jump, dismiss) from being announced or focused properly.
   - *Standard*: Draggable and selectable cards containing child buttons must use `role="article"` or `role="group"` with `tabIndex={0}`.

4. **WCAG 2.5.8 Target Size Rule**:
   - *Learning*: Micro-buttons and shift pills inside compact cards often fall below 20px, failing mobile touch target standards.
   - *Standard*: All interactive buttons must enforce `min-width: 24px; min-height: 24px; display: inline-flex; align-items: center; justify-content: center;`.

5. **Scrollable Region Keyboard Focus (WCAG 2.1.1)**:
   - *Learning*: Drawers and card bodies with `overflow-y: auto` cannot be scrolled by keyboard in Safari/Edge unless explicitly focusable.
   - *Standard*: Any container with `overflow-y: auto` or `overflow-x: auto` must include `tabIndex={0}`, `role="region"`, and an accessible `aria-label`.
