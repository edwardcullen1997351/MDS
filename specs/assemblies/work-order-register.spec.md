# Work order register reference assembly

```yaml
id: ra-work-order-register
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
last_reviewed: 2026-09-29
next_review_due: 2026-10-28
open_items: 2
```

## Purpose and boundary

Use this assembly to search, filter, page, select, and act on a high-density work-order register. Do not use it for one record, a hierarchy, or a workflow whose order is the primary contract.

Outcome: a planner can identify work requiring attention and take a safe single-record or bulk action without losing refinement or selection context.

## Dependencies

- Collection Workspace layout and specification
- SearchField, Select, Table, Checkbox, Pagination, Badge, Button, Card, and EmptyState
- Collection refinement, bulk selection/action, confirmed action, and recoverable failure patterns

## Assembly-owned contract

- Search and area refinement reset pagination but do not silently discard selections.
- The count and select-all control describe the matching set; paging changes only the visible slice.
- Empty results preserve refinement controls and provide a clear-filter recovery.
- Bulk destructive action requires consequence-specific confirmation and preserves context on failure.
- Record identifiers, dates, quantities, and currency use machine typography and locale-aware formatting.

## Required states

Default, loading, no matches, selected, high-density, long-content, restricted, service failure, stale data, bulk action confirmation, bulk action pending, bulk action success, bulk action failed, partial bulk result, restricted bulk action, and unknown bulk outcome.

## Responsive and accessibility

The collection owns horizontal overflow or a documented narrow-width alternative. Header, toolbar, selection region, table, card/list alternative, and compact pagination retain logical reading/focus order. Every checkbox has a record-specific accessible name; result, refinement, selection, and destructive-action outcome changes are announced without moving focus.

## Candidate budgets

- Supported fixture: 10,000 server-backed records, 100 visible rows maximum.
- Refinement feedback: visible within 100 ms after local input processing, excluding network latency.
- Page interaction: p95 under 200 ms on the approved reference workstation.

## Certification evidence

- `npm run certify:work-order-register`
- `npm run stress:work-order-register`
- `audits/assemblies/work-order-register/certification/2026-09-29-technical-gate-evidence.json`
- `audits/assemblies/work-order-register/certification/2026-09-29-screen-stress-evidence.json`

## Adoption rules

Adopters replace data/query/export/mutation adapters. They retain selection semantics, state recovery, accessibility relationships, token usage, and confirmation behavior. The assembly owns no business authorization; the server remains authoritative.
