# Work order detail reference assembly

```yaml
id: ra-work-order-detail
status: candidate
version: 0.1.0
owner: Meridian Design System Council
engineering_lead: UI Platform Team
accessibility_reviewer: unassigned
security_privacy_reviewer: unassigned
supported_frameworks: [react]
supported_themes: [light, dark]
supported_densities: [compact, comfortable, expanded]
supported_locales: [en-IN]
created: 2026-09-28
last_reviewed: 2026-09-28
next_review_due: 2026-10-28
open_items: 5
```

## Purpose and boundary

Use this assembly to inspect and act on one operational work order while keeping lifecycle context, linked evidence, and audit history visible. Do not use it for list refinement or long sequential creation workflows.

Outcome: a planner can understand the order's state and consequence before saving, releasing, holding, or following a linked record.

## Dependencies

- Sidebar layout, Breadcrumb, Tabs, Card, Table, Badge, Button, SplitButton
- Explicit save, confirmed action, asynchronous action, and recoverable failure patterns

## Assembly-owned contract

- The record identity and plant/routing context remain visible during every action.
- Save, release, and hold are distinct consequences and never ambiguous aliases.
- Mutations carry a revision identifier; stale writes stop and provide reconciliation.
- Permission restrictions explain why an action is unavailable without revealing protected data.
- Closing temporary surfaces restores focus to the invoking control.

## Required states

Default, loading, restricted, stale revision, save pending/failed, release partial/unknown, hold confirmation, missing linked evidence, and service degradation.

## Responsive and accessibility

At constrained widths the sidebar follows the main record as a labeled region or becomes an explicitly opened detail surface. Breadcrumb, title, primary action, tabs, and sidebar preserve logical reading order and visible focus.

## Candidate budgets

- Primary record usable within 2 s at p75 on the approved plant network profile.
- Tab switch feedback under 100 ms for cached content.
- No more than one blocking mutation in flight per work order.

## Adoption rules

Adopters replace record, permission, mutation, and evidence adapters. They retain optimistic-locking, confirmation, focus, recovery, and audit-event contracts.
