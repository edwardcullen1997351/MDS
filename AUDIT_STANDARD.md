# Meridian Design System â€” Comprehensive Universal Audit Standard

This document establishes the official, universal audit protocol covering **every section of the Meridian Design System** â€” from foundational principles and design tokens to primitives, components, composites, interaction patterns, layout templates, data visualizations, and navigation systems.

---

```
                       MERIDIAN DESIGN SYSTEM 9-TIER TAXONOMY

   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
   â”‚ 1. Foundations (Color science, Typography, Spatial Grid, Elevation, Motion)â”‚
   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
   â”‚ 2. Design Tokens (W3C DTCG Format, CSS Variables, TS Maps, Themes, Density)â”‚
   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
   â”‚ 3. Primitives (Button, Input, Checkbox, Radio, Switch, Badge, Tag, Avatar) â”‚
   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
   â”‚ 4. Components (Card, Dialog, Drawer, Toast, Popover, Tooltip, Alert, Modal)â”‚
   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
   â”‚ 5. Composites (Pickers, Toolbar, SearchField, FileUpload, TelemetryConsole)â”‚
   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
   â”‚ 6. Interaction Patterns (7 Manufacturing ERP Workflows, MES State Machines)â”‚
   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
   â”‚ 7. Layout Templates (Plant PL-04 Shells, Multi-Column, Master-Detail Grid) â”‚
   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
   â”‚ 8. Data Visualization (15 Charts/Graphs, Scales, Axes, Glyphs, Tooltips)   â”‚
   â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
   â”‚ 9. Navigation Systems (Tabs, Breadcrumbs, Pagination, Menus, Steppers)     â”‚
   â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## 1. Universal Audit Criteria (Applies to All Artifacts)

Every artifact submitted for audit must satisfy these 7 universal baselines:

1. **Frozen Specification Adherence**: Implementation strictly complies with the spec in `specs/<section>/<component>.spec.html`.
2. **Strict TypeScript Typing**: Exported types/interfaces for all props, inputs, outputs, models, and states with zero implicit `any`.
3. **Design Token Strictness**: Zero hardcoded CSS hex values, pixel sizes, or fonts outside design token variables (`--surface-*`, `--text-*`, `--border-*`, `--viz-*`, `--space-*`, `--radius-*`, `--shadow-*`).
4. **Theme & Density Invariance**: Pixel-perfect rendering across Light and Dark themes, as well as Compact and Comfortable density modes.
5. **Geometric Bounds & Coordinate Integrity**:
   - Zero hardcoded coordinate offsets or manual pixel shifts (e.g., `cx - 20`, `cy - 20`).
   - All SVG coordinates (`cx`, `cy`, axes, scales, nodes) MUST be computed strictly from explicit `viewBox` and inner plotting bounds.
   - Zero label clipping or perimeter overflow: all text nodes, badges, direct labels, and markers must remain completely within container bounds across standard viewports ($280\text{px}$ compact to $1920\text{px}$ desktop).
6. **Accessibility Rigor (WCAG 2.2 AA/AAA)**:
   - Minimum $4.5:1$ text contrast ($\ge 7:1$ for AAA) and $3:1$ graphical object contrast.
   - Complete keyboard accessibility (<kbd>Tab</kbd>, <kbd>Enter</kbd>, <kbd>Space</kbd>, <kbd>Escape</kbd>, Arrow keys).
   - Screen reader attributes (`aria-expanded`, `aria-controls`, `aria-selected`, `aria-live`, `aria-describedby`, `role`).
7. **1:1 Multi-Framework Parity**: Exact behavioral, visual, structural, and event parity between `@ds/react` and `@ds/angular`.
8. **Active Interaction Wiring & Visual Affordance Integrity**:
   - **Zero Hollow Mock Handlers**: Storybook stories and reference assemblies must never use unhandled or inert callbacks (`onClick={() => {}}`, unwired `onToggle`, unhandled `onPrev`/`onNext`). Every interactive control must be wired to reactive state.
   - **Action Button vs. Status Badge Distinction**: Actionable elements that perform a mutation or navigation jump must possess unmistakable button affordances (elevation, border, action glyphs like `âŸ²`, `â–¶`, `+`, `âœ•`). They must NEVER be styled as passive status pills or tags.
   - **Multi-Entity Scope Reactivity**: Switching corporate entities, plants, or warehouses in header composites must reactively re-render child lines, storage bays, and datasets rather than remaining static.
   - **TreeGrid Expansion Reactivity**: Any component or template utilizing tree structures or `TreeGridCell` must support active branch expansion/collapse with child node suppression and keyboard accessibility (<kbd>ArrowRight</kbd>/<kbd>ArrowLeft</kbd>).
---

## 2. Comprehensive 9-Section Audit Checklists

---

### Section 1: Foundations
*(Color Science, Typography Ramps, Spatial Grid, Elevation, Depth, Motion & Transitions)*
- [ ] **Color Foundations**:
  - Perceptually uniform lightness curves across neutral and semantic scales.
  - WCAG 2.2 AA contrast compliance against `--surface-ground` and `--surface-card` backgrounds.
  - Semantic status roles: Critical (Red), Warning (Amber), Success (Green), Info (Blue).
- [ ] **Typography Scale**:
  - Primary sans-serif font stack (`--font-sans`) and tabular monospace stack (`--font-mono`).
  - Strict type scale with proportional line-heights and font weights (400, 500, 600, 700).
  - OpenType tabular numerals (`font-variant-numeric: tabular-nums`) enabled for all metrics and data.
- [ ] **Spatial Grid & Geometry**:
  - 4px base spatial unit with continuous progression (`--space-1` [4px] through `--space-16` [64px]).
  - Radii system (`--radius-sm` [2px], `--radius-md` [4px], `--radius-lg` [8px], `--radius-full` [9999px]).
- [ ] **Elevation & Depth**:
  - Multi-stop box shadows (`--shadow-sm` to `--shadow-xl`) simulating industrial physical depth.
- [ ] **Motion & Transitions**:
  - Tokenized durations (`--duration-fast` [100ms], `--duration-base` [200ms], `--duration-slow` [300ms]) and standard easings (`cubic-bezier`).
  - Mandatory `@media (prefers-reduced-motion: reduce)` disabling non-essential transitions.

---

### Section 2: Design Tokens
*(W3C DTCG Format, Token Build Engine, CSS Variables, TypeScript Declaration Maps, Theme Switching)*
- [ ] **Token Source Authority**:
  - Defined in central JSON dictionary (`packages/tokens/src/`) adhering to W3C Design Token Community Group (DTCG) standard.
- [ ] **Token Build Automation**:
  - Script pipeline (`packages/tokens/build.js`) transforms source JSON into:
    - CSS custom properties (`tokens.css`, `dark.css`).
    - TypeScript declarations (`index.d.ts`) and constants (`tokens.js`).
- [ ] **Semantic Aliasing**:
  - High-level semantic aliases (`--action-primary-default`, `--surface-sunken`) referencing base scale tokens.
- [ ] **Multi-Theme & Density Support**:
  - Flawless runtime switching via `[data-theme="light" | "dark"]` and `[data-density="compact" | "comfortable"]`.
  - Zero hardcoded color literals (`#fff`, `rgb()`, `hsl()`) in component stylesheets.

---

### Section 3: Primitives
*(Button, Input, Checkbox, Radio, Switch, Badge, Tag, Avatar, Icon, Fieldset, SegmentedControl)*
- [ ] **Interactive State Coverage**:
  - Explicit visual states for `default`, `hover`, `active`, `focus-visible` (2px focus ring with 2px offset), `disabled`, and `read-only`.
- [ ] **Form Control Semantics**:
  - Native form integration (`name`, `value`, `form`, `disabled`, `required`, `invalid`).
  - Programmatic form reset and error state rendering (`aria-invalid="true"`).
- [ ] **Microcopy & Accessibility Associations**:
  - Labels linked via `for`/`id` or `aria-labelledby`.
  - Helper texts and error validation connected via `aria-describedby` and `aria-errormessage`.
- [ ] **Physical Ergonomics**:
  - Minimum touch target area ($44 \times 44\text{px}$ or $32\text{px}$ with optical hit padding).
  - Inline icons optically balanced with line-height and text baselines.

---

### Section 4: Components
*(Card, Dialog, Drawer, Toast, Popover, Tooltip, Alert, Banner, Skeleton, EmptyState)*
- [ ] **DOM Portal & Layer Management**:
  - Overlays render into `document.body` portal to prevent clipping by parent `overflow: hidden` or `z-index` stacking contexts.
- [ ] **Focus Management & Trapping**:
  - Modal dialogs trap keyboard focus (<kbd>Tab</kbd>/<kbd>Shift+Tab</kbd>) within the active container.
  - Background content inerted (`inert` or `aria-hidden="true"`).
  - Focus returns to trigger element on dismiss.
- [ ] **Backdrop & Scroll Lock**:
  - Body scroll locking prevents background scrolling while modal or drawer is active.
  - Backdrop clicks or <kbd>Escape</kbd> key invoke dismiss callbacks.
- [ ] **Non-Intrusive Notifications (Toast/Alert)**:
  - Live region announcements (`aria-live="polite"` or `assertive`).
  - Auto-dismiss pause on user hover or focus.
- [ ] **Visual Hierarchy & Anatomy**:
  - Card components provide modular header, body, footer, and media subcomponents.

---

### Section 5: Composites
*(DateRangePicker, DateTimePicker, ScopePicker, SearchField, Toolbar, SplitButton, FileUpload, SortableCollection, TelemetryConsole)*
- [ ] **Complex State Synchronization**:
  - Coordinated multi-field logic (e.g., date range start/end constraints, ISO-8601 validation, `IST` timezone).
- [ ] **Collision-Aware Positioning**:
  - Floating menus and dropdowns dynamically calculate viewport bounds and flip (top/bottom/left/right) to stay in view.
- [ ] **Search & Filter Mechanics**:
  - SearchField supports instant debounced querying, clear button ($\times$), loading spinner, and keyboard roving navigation.
- [ ] **Industrial Telemetry Console**:
  - Live streaming log buffer with auto-scroll lock toggle, log level filter (Trace, Info, Warn, Error), search query, and CSV/JSON export.
- [ ] **File Upload & Drag-and-Drop**:
  - Drag-over active styling, MIME type validation, file size limit rejection, and upload progress status indicators.
- [ ] **Multi-Entity Scope Reactivity**:
  - Entity/facility scope selectors must dynamically drive child workspaces (e.g., Finished Goods Plant mode $\leftrightarrow$ Raw Material Warehouse Staging mode) rather than displaying static dummy text.
- [ ] **Interactive Filter Synchronization**:
  - Embedded controllers, segmented steppers, and filter buttons must directly mutate state and update data matrices in real time.

---

### Section 6: Interaction Patterns
*(Manufacturing ERP Workflows: Work Order Release, Nonconformance Disposition, Purchase Requisition, BOM Change, Goods Receipt, Maintenance Request, Shift Capacity Planning)*
- [ ] **Domain Grounding (Suryodaya Autocomp Ltd, Chakan Plant PL-04, Pune)**:
  - Currency in Indian Rupees (`â‚¹`) with Indian lakh numbering format (`â‚¹2,50,000`, `en-IN`).
  - Timezone explicitly formatted in `IST` (`YYYY-MM-DD HH:mm (IST)`).
  - Realistic plant roles (Anjali Deshmukh, Meera Nair, Shalini Rao, Vikram Bhosale, Sandeep Kulkarni).
  - Indian automotive supply chain partners (Nashik Forge, Sahyadri Bearings, Deccan Machine Supply).
- [ ] **MES State Machines & Failure Modes**:
  - Exhaustive handling of shop-floor failure states (MES offline, material shortage, lot hold, safety interlock tripped).
  - Step-by-step confirmation, approval signatures, and audit trail timestamps.
- [ ] **Optimistic UI & Rollback**:
  - Transaction rollback handling on network/server failure with clear recovery guidance.

---

### Section 7: Layout Templates
*(Plant PL-04 Canvas, Enterprise Shells, Multi-Column Workspaces, Master-Detail Layouts, Responsive Dashboards)*
- [ ] **Industrial Plant Hierarchy**:
  - Top plant header with breadcrumb navigation (Suryodaya Autocomp $\rightarrow$ Plant PL-04 $\rightarrow$ Shop Floor / Line).
  - Plant status banner displaying active shift (Shift A / Shift B / Shift C) and telemetry connectivity status.
- [ ] **Responsive Grid Breakpoints**:
  - Fluid grid system adapting from 1920px desktop control terminals down to 768px shop-floor tablets.
  - Collapsible sidebars, drawer-based detail panels on narrow viewports.
- [ ] **Master-Detail Ergonomics**:
  - Synchronized selection between list/grid view and detail inspection pane.
  - Keyboard navigation allows browsing records without losing focus or scroll position.
- [ ] **TreeGrid & Hierarchical Branching Reactivity**:
  - Any template displaying multi-level bills-of-materials or work orders must wire active expand/collapse state with child row suppression/disclosure, proper indentation variables (`--ds-indent-level`), and accessible keyboard branching (<kbd>ArrowRight</kbd> to expand, <kbd>ArrowLeft</kbd> to collapse).
- [ ] **Coordinated 3-Pane Synchronization**:
  - Left navigation filters (shifts, lines/bays) must filter central matrix items; selecting any central matrix record must immediately synchronize the right inspector pane.

---

### Section 8: Data Visualization
*(15 Charts/Graphs: AreaChart, BarChart, DistributionPlot, GanttChart, GeoMap, Heatmap, LineChart, NetworkDiagram, ParallelCoordinates, PieChart, RangeChart, SankeyDiagram, ScatterPlot, TreeDiagram, Treemap)*
- [ ] **Strict SVG Layer Hierarchy**:
  $$\text{Canvas/Grid} \longrightarrow \text{Bands/Zones} \longrightarrow \text{Edges/Lines} \longrightarrow \text{Marks/Nodes} \longrightarrow \text{Labels/Halos} \longrightarrow \text{Crosshair/Overlay}$$
- [ ] **Concentric Geometry & Coordinate Origin**:
  - Radial charts (`PieChart`, `DonutChart`, `RadarChart`, `PolarPlot`) MUST calculate origin `(cx, cy)` strictly as `svgWidth / 2` and `svgHeight / 2` with explicit SVG `viewBox`.
  - Zero arbitrary coordinate subtractions (e.g. `cx - 20`, `cy - 20`) or unscaled pixel translations.
- [ ] **Direct Label Perimeter Containment**:
  - Direct sector or node labels along outer perimeters MUST be concise (e.g., percentage callout `42.4%` or compact key) to prevent horizontal clipping against container boundaries on compact cards ($320\text{â€“}480\text{px}$).
  - Full descriptive names MUST be deferred to categorical legends, hover tooltips, and data tables.
  - Labels must implement dynamic text anchoring based on vector angle ($\cos(\theta_{\text{mid}}) > 0.1 \rightarrow \text{start}$, $< -0.1 \rightarrow \text{end}$, else $\text{middle}$).
- [ ] **Concentric Donut Cutout Metric**:
  - In donut variants, total value readouts (e.g. `1,840 kVA`) and category captions (`Total kVA` or hovered slice) MUST be concentrically stacked at `(cx, cy - 4)` and `(cx, cy + 14)` with tabular numerals (`font-variant-numeric: tabular-nums`).
- [ ] **Continuous Axis Spines & Ticks**:
  - Vertical Y-axis spine line (`strokeWidth="1.5"`), horizontal X-axis baseline, and outward ticks (`x2="-5"`).
- [ ] **Edge Perimeter Clipping (Graphs/Networks)**:
  - Directed graph arrowheads clip precisely to node boundary radius ($R_{\text{node}} + \text{offset}$), never obscured under node fills.
- [ ] **Label Legibility Halos**:
  - High-contrast text stroke halos (`paint-order: stroke fill; stroke-width: 3-5px; stroke: var(--surface-card)`) over crossing data lines.
- [ ] **2D Non-Occluding Tooltips**:
  - Quad-flip positioning (flips vertically to bottom when hovering top peak points; flips horizontally away from crosshairs) with boundary clamping.
- [ ] **WCAG 1.4.1 Dual-Encoding**:
  - Categorical series encoded with both distinctive colors and geometric glyphs (square, diamond, triangle, circle), hatch patterns, or stroke dash patterns.
- [ ] **Non-Spatial Table Modal**:
  - <kbd>Alt+F11</kbd> keyboard shortcut and toolbar button toggling an accessible data table modal.
- [ ] **The 7 Mandatory Story Archetypes**:
  1. `Default` (Plant operational scenario wrapped in `EnterpriseChartStoryShell`)
  2. `Variants` (Alternative visual layout or encoding dimension)
  3. `ThresholdAndControlLimits` (UCL/LCL lines, target baselines, risk status encoding)
  4. `MissingTelemetryAndEmpty` (Interactive simulation: Offline $\rightarrow$ Reconnect $\rightarrow$ Restored)
  5. `HighDensityMultiShift` (Stress test with high-density data and de-cluttering controls)
  6. `AccessiblePatternsAndTable` (Default table view, dual-encoding glyphs, keyboard flow)
  7. `CompactDashboardWidget` (Dense dashboard card dimensions $360\text{â€“}380\text{px} \times 220\text{â€“}240\text{px}$)

---

### Section 9: Navigation Systems
*(Tabs, Breadcrumbs, Pagination, Menus, Steppers, Tree Navigation)*
- [ ] **Active & Selected States**:
  - High-contrast indicator bar or pill on active tab/page with `aria-current="page"` or `aria-selected="true"`.
- [ ] **Standard Keyboard Navigation**:
  - Tabs: Left/Right arrow keys navigate tabs; <kbd>Home</kbd>/<kbd>End</kbd> jumps to start/end.
  - Menus: Up/Down arrow keys traverse menu items; Right arrow opens submenus; Left/Escape closes.
  - Steppers: Visual progression tracking with reachable step selection.
- [ ] **Responsive Truncation & Overflow**:
  - Breadcrumbs and tab headers collapse into an overflow dropdown ($\dots$) on narrow viewports without clipping text.
- [ ] **Pagination Controls**:
  - Jump to first/last, previous/next, dynamic page range with ellipsis, and configurable page size selector.

---

## 3. Verification & Certification Pipeline

Before marking any design system artifact as certified:

1. **Automated Gates**: Run `npm run typecheck`, `npm run test:phase3-contracts`, `npm run test:phase4-types`, `npm run lint:a11y`, `npx turbo run build`, and `npm run test:a11y`. CI blocks new strict JSX accessibility errors and new axe findings across all 771 relevant Storybook stories. The two checked-in baseline files document existing findings and must not be expanded without review. The covered-story baseline contains 84 JSX findings and 58 axe contrast nodes; the first expanded-category audit snapshot exposed 158 axe nodes before the latest token and story fixes, so this gate is not yet a zero-violation accessibility certification.
2. **Visual Inspection**: Explore all stories in Storybook across Light and Dark themes, explicitly verifying that **no text strings clip against card margins or outer boundaries**.
3. **Keyboard & Screen Reader Walkthrough**: Verify full keyboard traversal and live region announcements.
4. **Interactive Click & Affordance Audit**:
   - Actively exercise every interactive control in Storybook (click every action button, shift/line selector, stepper arrow, tree branch toggle, and facility scope option).
   - Verify zero inert/dead mock handlers (`onClick={() => {}}` or unhandled optional callbacks).
   - Verify that all mutation/jump controls have distinct action button affordances (elevation, borders, action glyphs), never styled as passive status pills.
5. **Walkthrough Documentation**: Record findings and verification in `walkthrough.md`.

### Component authoring and Definition of Done

Use the [Component Accessibility Specification Template and Definition of Done](guidelines/component-accessibility.md) for every new or materially changed component, composite, layout, chart, or reference assembly. The specification records native semantics, accessible name and description, keyboard and focus behavior, form association, landmark ownership, non-color indicators, React/Angular parity, and verification evidence. A component is not certified by an axe pass alone; complete the manual keyboard and screen reader checks in the template.


## Accessibility CI and Pre-release Regression Gate

The pull-request accessibility gate runs the targeted Storybook axe suite for changed or remediated stories. The Phase 5 remediation set covered the 75 reported axe findings; affected-story verification passed, along with JSX accessibility lint, React typecheck, and the Storybook production build.

Before a release, run the complete Storybook axe suite with A11Y_SCOPE=all. It currently enumerates 766 stories and is the authoritative regression check. A prior exploratory run completed 250 of 766 stories before being stopped for runtime; that partial run is not a substitute for the pre-release check.

Record the date, commit, story count, axe violations, and baseline exceptions for each completed pre-release run. Existing documented baseline findings must not increase.
