# Planner Workbench — Manual Certification Checklist

- **Assembly**: `ra-planner-workbench`
- **Candidate Story**: `reference-assemblies-planner-workbench--candidate-overview`
- **Version**: candidate 0.1.0
- **Checklist Date**: 2026-10-01
- **Automated Evidence**: Passed (Axe-core 0 violations across 24 runs, Zero horizontal overflow)
- **Manual Verification**: Pending human reviewer completion

---

## 1. Keyboard Navigation and Focus Management

- [ ] **Tab Order**: Logical order from facility selector → time horizon stepper → view switchers → left resource tree → center matrix/dispatch board → right inspector pane.
- [ ] **Focus Rings**: All interactive buttons, tabs, tree items, and stepper pills render visible focus rings with minimum 2px width and >= 1px offset.
- [ ] **Conflict Resolution Drawer**:
  - [ ] Opening drawer automatically shifts focus into the drawer (close button or first action).
  - [ ] Tab key cycles exclusively within the drawer (focus trap active).
  - [ ] `Escape` key dismisses drawer without committing changes.
  - [ ] Closing drawer restores focus to the triggering element.
- [ ] **TreeGridCell Navigation**:
  - [ ] Arrow keys (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`) navigate rows and cells.
  - [ ] `Enter` / `Space` toggles tree row expansion when focused on expandable rows.
- [ ] **Shift Dispatch Board**:
  - [ ] Order cards are focusable via keyboard (`tabIndex={0}`).
  - [ ] Quick-jump shift buttons (`S1`, `S2`, `S3`) can be operated using keyboard (`Enter`/`Space`) as an accessible alternative to drag-and-drop.

---

## 2. Screen Reader and Assistive Technology Announcements

- [ ] **Landmarks and Regions**:
  - [ ] Left pane announced as navigation / resource tree region.
  - [ ] Center matrix announced as interactive supply grid or region.
  - [ ] Right pane announced as details / telemetry inspector region.
- [ ] **Live Regions (`aria-live`)**:
  - [ ] Stale data refresh announces cache update timestamps politely.
  - [ ] Drag-and-drop optimistic rescheduling announces validating state, confirmation, and rebound errors.
  - [ ] 1-click conflict resolution announces banner feedback upon committing delta or remote state.
- [ ] **Data Visualizations**:
  - [ ] `StockRunwayHorizon` SVG contains accessible title/desc announcing days of safe stock, reorder zone, and stockout date.
  - [ ] `LeadTimeTransferGlyph` announces transit route, mode, and lead time duration.
  - [ ] `IntercompanyStockRibbon` exposes metrics with associated text labels, units, and status badges.

---

## 3. Responsive Layout, Reflow, and Touch Targets

- [ ] **Mobile Narrow (320px)**:
  - [ ] Content reflows vertically into tabbed navigation without horizontal scrolling.
  - [ ] All buttons and touch targets meet minimum 24x24px dimensions (WCAG 2.5.8).
  - [ ] Text remains crisp without truncation or overlapping.
- [ ] **Tablet (768px)**:
  - [ ] Responsive 2-pane arrangement or drawer overlay behaves smoothly without content clipping.
- [ ] **Desktop (1440px)**:
  - [ ] 3-pane workbench utilizes full viewport with balanced pane sizing.
- [ ] **Zoom Reflow (200% & 400%)**:
  - [ ] Zooming to 200% maintains full readability without text collisions.
  - [ ] Zooming to 400% activates mobile vertical stack without loss of core planning data.

---

## 4. Multi-Plant Data Integrity & Recovery

- [ ] **Asclepius Plant F-119**:
  - [ ] Displays manufacturing bottling/blending lines, finished goods stock, and inbound transfer glyphs.
- [ ] **Anantshriveda Warehouse H-9**:
  - [ ] Displays bulk raw material stock levels (Tulsi Extract, Ashwagandha), QC reserves, and outbound transfer glyphs.
- [ ] **Conflict Handling (ETag 409)**:
  - [ ] "Accept Remote & Re-calculate" imports remote reservation without loss of other form state.
  - [ ] "Allocate Remaining Delta (50 kg)" commits only available headroom.
  - [ ] "Force Override (Admin)" exposes warning prompt before executing.

---

## 5. Reviewer Sign-Off

| Review Area | Reviewer | Result | Notes |
| :--- | :--- | :--- | :--- |
| **Keyboard / Focus** | Pending | Pending |  |
| **Screen Reader** | Pending | Pending |  |
| **Zoom & Touch Reflow** | Pending | Pending |  |
| **Multi-Plant Flow** | Pending | Pending |  |
| **Visual Polish & Tokens** | Pending | Pending |  |
