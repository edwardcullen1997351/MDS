# Meridian Design System — 1-Iteration Assembly Playbook

**Owner:** Design System Council
**Target Audience:** Design System Engineers, Product UI Architects, Quality Engineers
**Goal:** Deliver certified, production-representative enterprise reference assemblies in a single iteration with zero accessibility violations, zero horizontal overflow, and full multi-framework parity.

---

## 1. The 6-Layer Assembly Recipe

Every enterprise screen (Anchor or Satellite) must be systematically mapped into this 6-tier architecture before writing any UI code:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LAYOUT TEMPLATE                                          │
│    Structural skeleton & responsive reflow boundaries        │
├─────────────────────────────────────────────────────────────┤
│ 2. NAVIGATION SYSTEM                                        │
│    Spatial scope (facilities/plants) & Temporal horizons    │
├─────────────────────────────────────────────────────────────┤
│ 3. INTERACTION PATTERNS                                     │
│    Concurrent conflict containment, optimistic mutations    │
├─────────────────────────────────────────────────────────────┤
│ 4. COMPOSITES                                               │
│    Multi-dimensional planning grids, intercompany ribbons   │
├─────────────────────────────────────────────────────────────┤
│ 5. COMPONENTS                                               │
│    Tree cells, dual UoM badges, latency status pills        │
├─────────────────────────────────────────────────────────────┤
│ 6. DATA VISUALIZATIONS                                      │
│    Inline micro-runway bars, sparklines, capacity gauges    │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. The "Big 5" Pre-Flight Guardrails (Zero-Failure Contract)

These five failure modes accounted for 100% of historical axe-core and layout audit gate failures. Enforcing them upfront guarantees first-pass certification:

### Rule 1: The Semantic Token Rule (Contrast Guard)
* **Trap**: Using `--ds-semantic-color-text-muted` (`#9ca3af`) on `--ds-semantic-color-surface-subtle` (`#f8fafc`) yields only 2.42:1 contrast (WCAG AA requires 4.5:1).
* **Fix**: **Never** use `text-muted` for informational text, subheadings, labels, or badges on light/subtle backgrounds. Use `--ds-semantic-color-text-secondary` (`#475569`, >= 5.3:1) or `--ds-semantic-color-text-primary` (`#0f172a`, >= 14:1).

```css
/* ❌ VIOLATION */
.item__subtext { color: var(--ds-semantic-color-text-muted, #94a3b8); }

/* ✅ GOLD STANDARD */
.item__subtext { color: var(--ds-semantic-color-text-secondary, #475569); }
```

### Rule 2: Container Role Safety (No `nested-interactive`)
* **Trap**: Giving a card `role="button"` when it contains child action buttons (e.g. quick-jump shift pills, delete buttons).
* **Fix**: Draggable, selectable, or composite cards must use `role="article"`, `role="listitem"`, or `role="group"` with `tabIndex={0}`.

```tsx
/* ❌ VIOLATION */
<div className="card" role="button" tabIndex={0}>
  <button onClick={...}>Edit</button>
</div>

/* ✅ GOLD STANDARD */
<div className="card" role="article" tabIndex={0} aria-label="...">
  <button type="button" onClick={...}>Edit</button>
</div>
```

### Rule 3: Native Table ARIA Contract (`aria-allowed-attr`)
* **Trap**: Placing `aria-level` or `aria-expanded` directly on native `<td>` elements.
* **Fix**: Place `role="row"` and `aria-level` on the `<tr>` element. Place `aria-expanded` on the nested disclosure `<button>`.

```tsx
/* ❌ VIOLATION */
<td aria-level={2} aria-expanded={true}>...</td>

/* ✅ GOLD STANDARD */
<tr role="row" aria-level={2}>
  <td>
    <button type="button" aria-expanded={true} aria-label="...">Chevron</button>
    <span>Label</span>
  </td>
</tr>
```

### Rule 4: Touch Target Sizing (WCAG 2.5.8)
* **Trap**: Micro-buttons, dismiss icons, and shift jump chips sized under 24px failing pointer target minimums on touch viewports.
* **Fix**: Every clickable element must enforce `min-width: 24px; min-height: 24px; display: inline-flex; align-items: center; justify-content: center;`.

```css
/* ✅ GOLD STANDARD */
.action-btn {
  min-width: 24px;
  min-height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  font-size: 11px;
}
```

### Rule 5: Keyboard-Scrollable Regions (WCAG 2.1.1)
* **Trap**: Drawers, panels, and table bodies with `overflow-y: auto` or `overflow-x: auto` cannot be scrolled via keyboard in Safari/Edge.
* **Fix**: Add `tabIndex={0}`, `role="region"`, and an explicit `aria-label`.

```tsx
/* ✅ GOLD STANDARD */
<div
  className="drawer-body"
  tabIndex={0}
  role="region"
  aria-label="Inspection details"
>
  {content}
</div>
```

### Rule 6: The Zero-Bespoke-CSS Mandate (Composition Gap Guard)
* **Trap**: Writing bespoke CSS classes (`.ds-planner-toolbar`, `.ds-planner-view-btn`, `.ds-planner-view-toggle`) in assembly story files when aligning or grouping controls. This leads to leaked overrides, theme breakdown, and layout blowouts.
* **Fix**: **Never write bespoke CSS for controls in reference assemblies.** If controls must be unified (e.g. date stepper + view toggle), promote and use a Tier 2 composite (`CommandToolbarGroup`). If view switches are needed, use a Tier 1 primitive (`SegmentedControl`).

```tsx
/* ❌ VIOLATION: Bespoke toolbar hack in story CSS */
<div className="ds-planner-toolbar">
  <TimeHorizonStepper ... />
  <div className="ds-planner-view-toggle">
    <button className="ds-planner-view-btn active">Matrix View</button>
  </div>
</div>

/* ✅ GOLD STANDARD: Pure Tier 1 / Tier 2 Composition */
<CommandToolbarGroup
  controls={
    <>
      <TimeHorizonStepper currentBucket={bucket} onBucketChange={setBucket} />
      <SegmentedControl
        name="center-view"
        value={activeCenterView}
        onChange={setActiveCenterView}
        options={[
          { value: 'matrix', label: 'Matrix View' },
          { value: 'reschedule', label: 'Shift Dispatch' },
        ]}
      />
    </>
  }
/>
```

### Rule 7: Viewport Pinning & Reflow Mandate (WCAG 2.2 Reflow 1.4.10)
* **Trap**: Omitting `min-width: 0` or `min-height: 0` on flex items inside 3-pane layouts, or allowing flex items to push parents beyond `100vw`.
* **Fix**: Enforce strict viewport containment in layout templates:
  - `min-width: 0; min-height: 0; max-width: 100%; overflow: hidden;` on body and center containers.
  - Flex-shrink `0` on pinned navigation/inspector rails.
  - `scrollWidth <= clientWidth` across all 5 viewports (320px, 390px, 768px, 1440px, 1920px).

### Rule 8: Tri-Pane State Coordination Contract
* **Trap**: Left, Center, and Right panes acting as isolated data islands where selections do not update adjacent panels or keyboard navigation is missing.
* **Fix**: Orchestrate state reactively using `useTriPaneCoordinator`:
  - Left pane selector filters center matrix.
  - Center row selection immediately synchronizes right inspector.
  - Keyboard navigation (`j`/`k` row jumps, `Ctrl+Z` undo within 8s window) with polite ARIA live region feedback.

---

## 3. The 14 Mandatory Enterprise Test Scenarios

Every assembly candidate must define these 14 URL-driven deterministic test scenarios (`?scenario={name}`):

1. **`ready`**: Nominal production operating state with live metrics and balanced layouts.
2. **`concurrent-conflict`**: Simulates ETag 409 version mismatch with open resolution drawer preserving local edits.
3. **`optimistic-rebound`**: Simulates optimistic dispatch failure, displaying validation feedback and spring rebound.
4. **`stale`**: Simulates cached/delayed telemetry (>5 min) with active warning pills and manual sync triggers.
5. **`stress-high-density`**: Extreme data density (max rows, multi-level trees, dual UoM badges, narrow column packing).
6. **`anantshriveda-warehouse`**: Cross-entity multi-plant switch (Plant ↔ Warehouse) verifying filter stability.
7. **`minimum-content`**: Single-node or single-row minimal operational baseline.
8. **`long-labels`**: Extreme typographic label expansion (stress-testing text truncation and tooltip disclosure).
9. **`missing-data`**: Null/empty field representations (em-dash fallbacks, zero-inventory buffers).
10. **`loading`**: Full screen skeleton/spinner telemetry initialization state.
11. **`partial-loading`**: Center matrix loading while side rails remain interactive.
12. **`empty-state`**: Zero-data illustration with actionable recovery trigger.
13. **`error-state`**: Critical MES connection fault (503) with isolated buffer fallback banner.
14. **`disabled-actions`**: Read-only viewer role with all dispatch actions disabled.

---

## 4. One-Click Assembly Scaffolding & 70-Gate Verification

To scaffold and certify a new reference assembly screen in 1 iteration:

### Step 1: Create Story & Stylesheet
* File: `apps/storybook/src/stories/assemblies/{ScreenName}.stories.tsx`
* Style: `apps/storybook/src/stories/assemblies/{screen-name}.css`
* Zero bespoke control styles. 100% design token purity (`var(--ds-*)`).

### Step 2: Create Technical Gate & Stress Runners
* Duplicate `tools/stress-planner-workbench.mjs` ➔ `tools/stress-{screen-name}.mjs`
* Register script in `package.json`:
  ```json
  "stress:{screen-name}": "node tools/stress-{screen-name}.mjs"
  ```

### Step 3: Run Automated 70-Gate Stress Matrix
```bash
# 1. Verify TypeScript types across monorepo
npm run typecheck

# 2. Run Headless CDP 70-Point Stress Matrix (14 Scenarios × 5 Viewports: 320px, 390px, 768px, 1440px, 1920px)
node tools/stress-{screen-name}.mjs
```

### Step 4: Publish Certification Packet
* `audits/assemblies/{screen-name}/certification/{date}-screen-stress-evidence.json`
* `audits/assemblies/{screen-name}/certification/{date}-approval-packet.md`
* `audits/assemblies/{screen-name}/certification/{date}-manual-review-checklist.md`

Following this playbook guarantees that reference assemblies achieve 1-iteration gold-standard certification with 0 Axe violations, 0 horizontal scroll reflow issues, and zero CSS debt.
