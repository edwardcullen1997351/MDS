# Maintenance request form reference assembly

```yaml
id: ra-maintenance-request-form
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
open_items: 2
```

## Purpose and boundary

Use this assembly to create or edit one maintenance request with explicit validation, draft, cancel, and submit boundaries. Do not use it for instant settings or a multi-screen approval workflow.

Outcome: an operator can dispatch an actionable request without losing entered data when validation or a dependency fails.

## Dependencies

- Single Column layout, Card, Input, Select, Switch, Button
- Validated submission, explicit save, asynchronous action, confirmed action, and recoverable failure patterns

## Assembly-owned contract

- Validation is separate from operation failure and focuses the first actionable problem.
- Submit uses a stable snapshot, blocks duplicates, and preserves input on failure.
- Draft does not imply dispatch; cancel/reset disclose whether entered work will be lost.
- Cost uses locale-aware parsing/formatting and server validation.
- Switches describe immediate local choices; submission commits their values with the request.

## Required states

Pristine, dirty, invalid title, invalid cost, draft saving/saved/failed/recovered, submit pending, submit failed, partial dispatch, unknown outcome, duplicate blocked, loading, offline, restricted, stale, and successful dispatch.

## Responsive and accessibility

Labels, hints, errors, required state, and groups are programmatically associated. Two-column pairs stack without reordering. Error summary/focus behavior is required when multiple fields fail.

## Candidate budgets

- Local validation feedback under 100 ms.
- Submit acknowledgement within 200 ms; unresolved requests enter an explicit pending/unknown state.
- No user-entered value is discarded by recoverable failure.

## Adoption rules

Adopters replace validation, draft, and submission adapters. They retain snapshot, duplicate prevention, focus, error, recovery, and unsaved-change behavior.
