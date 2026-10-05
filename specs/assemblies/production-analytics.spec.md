# Production analytics reference assembly

```yaml
id: ra-production-analytics
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

Use this assembly to compare production output and line rate across a selected horizon. Do not use it when the primary task is live alarm response or editing production records.

Outcome: an analyst can identify a trend or production-area deviation and inspect the exact underlying values without relying on vision or color.

## Dependencies

- Dashboard layout and widgets
- AreaChart, BarChart, LineChart, Table, Select, Button
- Data-visualization, asynchronous-action, and recoverable-failure standards

## Assembly-owned contract

- All charts share the selected horizon and state the measure/unit.
- Every visualization provides a synchronized data-table alternative.
- Missing and partial telemetry are distinguished from zero.
- Stale data names its last successful timestamp.
- Export is permission-aware, privacy-reviewed, asynchronous, and auditable.

## Required states

Default, loading, empty, missing points, partial series, stale, offline, restricted, high-density, long-content, export pending, export succeeded, export failed, export restricted, export unknown, and restored telemetry.

## Responsive and accessibility

Chart summaries and data tables are keyboard and screen-reader reachable. Series use non-color differentiation. Constrained layouts reduce simultaneous panels without hiding the selected horizon or current data quality.

## Candidate budgets

- Reference datasets: 24-hour telemetry, 30-day daily series, and 90-day aggregate series.
- Horizon-change response p95 under 200 ms for locally available data.
- High-volume data is aggregated before rendering; the supported point limit is documented per chart dependency.

## Adoption rules

Adopters replace query, drill-in, and export adapters. They retain units, data-quality disclosure, accessible alternatives, non-color encoding, and export controls.
