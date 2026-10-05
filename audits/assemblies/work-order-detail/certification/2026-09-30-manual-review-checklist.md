# Work order detail — manual certification checklist

- Assembly: `ra-work-order-detail`
- Version: candidate 0.1.0
- Checklist date: 2026-09-30
- Automated evidence: passed (axe-core 0 violations, zero layout shift/overflow)
- Manual evidence: pending reviewer completion

## Keyboard and focus

- [ ] Tab navigation follows logical order: breadcrumb links, header actions (Duplicate, Save SplitButton), main specification card, tab headers, active tab table rows, sidebar actions.
- [ ] SplitButton primary action and dropdown trigger expose visible focus rings with `outline-offset: 1px`.
- [ ] Line hold modal dialog traps focus within dialog when open and restores focus to "Place work order on hold" button upon dismissal.
- [ ] Escape key dismisses line hold modal safely without applying hold.
- [ ] Tabs allow arrow key switching (`ArrowLeft` / `ArrowRight`) between Audit Traceability, Routing Operations, and Quality & Compliance.
- [ ] Save triggers do not trap keyboard focus during `isSaving` pending state.

## Screen reader and announcements

- [ ] Breadcrumb hierarchy is announced with landmark and separators ignored by screen readers.
- [ ] Order status, revision, and scenario badges announce their state clearly.
- [ ] Operational status live region (`role="status"`, `aria-live="polite"`) announces:
  - Save pending, success (Rev E), failure, and authorization states
  - Line hold modal submission, pending application, and release outcomes
  - Scenario transitions
- [ ] Tables in tabs have accessible column headers and row associations.
- [ ] Modal dialog has `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="hold-dialog-title"`.

## Responsive, zoom, and text expansion

- [ ] Zero horizontal scrolling across 320px, 390px, 768px, and 1440px viewports.
- [ ] Sidebar follows main content cleanly without layout overlap or clipping at narrow viewports (≤768px).
- [ ] Header actions wrap gracefully on mobile viewports (≤640px) with minimum 44px tap targets.
- [ ] In `stress-long-content`, 90+ character automotive part names wrap cleanly without breaking grid layout.
- [ ] At 200% zoom, text remains legible without clipping table columns or action buttons.
- [ ] At 400% zoom, specification grid reflows into a single column.

## Security, privacy, and recovery

- [ ] Synthetic data only: no real employee IDs, customer serial numbers, or sensitive cost formulas.
- [ ] Restricted planner mode prevents unauthorized parameter changes while clearly indicating read-only status.
- [ ] Concurrent conflict state warns operators before stale writes occur.
- [ ] Save failure preserves all modified inputs on screen and allows immediate retry.
- [ ] Quality specifications link to governed standards (QP-4820-D, EN 10204 3.1, IATF 16949 §8.5, IS 2062:2011).

## Reviewer sign-off

| Review area | Reviewer | Result | Notes |
| --- | --- | --- | --- |
| Keyboard/focus | Pending | Pending |  |
| Screen reader | Pending | Pending |  |
| Zoom/reflow | Pending | Pending |  |
| Security/privacy | Pending | Pending |  |
| Domain/content | Pending | Pending |  |
