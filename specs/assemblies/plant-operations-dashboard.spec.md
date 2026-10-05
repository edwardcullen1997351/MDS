# Plant operations dashboard reference assembly

```yaml
id: ra-plant-operations-dashboard
status: candidate
version: 0.2.0
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
open_items: 3
```

## Purpose and boundary

Use this assembly for a time-bounded plant overview where independent modules summarize output, quality, alerts, and priority actions. Do not use it as a decorative KPI gallery or as the only route to transactional work.

Outcome: a supervisor can identify the plant's most consequential deviation and reach the owning workflow without one failed module blanking the whole view.

## Dependencies

- Dashboard layout and widgets
- LineChart, BarChart, Table, Card, Badge, Select, Button
- Data-visualization, asynchronous-action, and recoverable-failure standards

## Assembly-owned contract

- Every module has independent freshness, loading, failure, and recovery behavior.
- KPI deltas always name their comparison and never rely on color or glyph alone.
- Charts provide synchronized readable summaries and data-table alternatives.
- Changing horizon updates every module or explicitly identifies a module with a different horizon.
- Priority actions retain their owning record, area, status, and accountable role.

## Required states

Default, initial loading, per-module loading, per-module failure, partial dashboard, stale module, whole-dashboard failure, restricted module, empty priority queue, and export pending/failed.

## Responsive and accessibility

DOM and reading order follow decision priority rather than visual grid position. Charts expose names, summaries, and data tables. Narrow layouts stack without separating a title from its module or moving priority actions behind decorative metrics.

## Candidate budgets

- Six concurrent modules maximum in the initial viewport.
- Maximum supported dataset: 31 output-trend points, 12 production areas, and 50 priority-action rows per requested horizon. Larger results MUST be aggregated or paginated by the adapter.
- Interaction response p95: horizon selection, state transition, and action acknowledgement under 200 ms on the approved workstation, excluding documented service latency.
- Export acknowledgement MUST enter a visible pending state within 100 ms and MUST prevent duplicate requests until the outcome is known.
- Module isolation: one failed, loading, or restricted module must not delay or conceal successful siblings beyond its own data dependency.
- Initial dashboard payload budget: 250 KiB compressed for assembly-owned code and data, excluding shared Storybook runtime and shared design-system packages.

Run `npm run verify:assemblies` for the executable source-contract checks. Browser performance measurements and the environment profile are collected during the certification-evidence phase.

## Adoption rules

Adopters replace query, drill-in, and export adapters. They retain module independence, freshness disclosure, accessible alternatives, and priority ordering.
