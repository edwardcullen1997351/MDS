# Manual review checklist - Plant Operations Dashboard

- Assembly: `ra-plant-operations-dashboard`
- Version: `0.2.0`
- Checklist date: 2026-09-29
- Purpose: record the human-review items that cannot be fully replaced by automated evidence.

## Keyboard and focus review

| Check | Expected result | Reviewer result |
| --- | --- | --- |
| Tab order follows inspection controls, header controls, KPI/modules, chart table toggles, and priority actions | Logical and predictable | Pending |
| Focus indicator is visible on all buttons, selects, summary toggles, and priority actions | Visible at 100% and 200% zoom | Pending |
| Chart data-table toggles operate by keyboard | Enter/Space toggles details | Pending |
| Export action prevents duplicate activation while pending | Button enters pending state and duplicate activation is blocked | Pending |
| Review action prevents conflicting duplicate review openings | Only the active review button enters pending state | Pending |

## Assistive-technology review

| Check | Expected result | Reviewer result |
| --- | --- | --- |
| Page/region purpose is understandable from heading and module titles | Screen reader announces meaningful structure | Pending |
| KPI deltas are not color-only | Text explains trend comparison | Pending |
| Charts have accessible names and data-table alternatives | SVG names plus table fallback are discoverable | Pending |
| Module failure/restricted/partial states are announced with recovery context | User understands what failed and what remains usable | Pending |
| Priority action cards preserve record ID, area, owner, status, and action | Mobile reading order remains complete | Pending |

## Zoom, reflow, and responsive review

| Check | Expected result | Reviewer result |
| --- | --- | --- |
| 320px mobile viewport | No horizontal overflow; priority cards replace table | Prepared by stress runner |
| 390px mobile viewport | No clipping; readable module order | Prepared by stress runner |
| 768px tablet viewport | Table layout remains usable; no overlap | Prepared by stress runner |
| 1440px desktop viewport | Full dashboard hierarchy remains balanced | Prepared by stress runner |
| 200% browser zoom | No loss of information or functionality | Pending manual confirmation |
| Long-content scenario | Labels wrap without hiding actions | Prepared by stress runner |
| Max-priority scenario | 50 priority records render without overflow | Prepared by stress runner |

## Security/privacy review

| Check | Expected result | Reviewer result |
| --- | --- | --- |
| Synthetic data only | No real personal, production, secret, or regulated data | Prepared by source scan |
| Export action is governed | Pending, success, service-failure, and permission-denied outcomes are covered | Prepared by stress runner |
| Review action is non-mutating in reference demo | Copy states that review opens without changing workflow state | Pending reviewer confirmation |
| Permission-denied state preserves context | No data is changed; recovery guidance is clear | Prepared by stress runner |
| Adoption warning is clear | Adopters know reference implementation is not a security control | Pending reviewer confirmation |

## Reviewer notes

| Reviewer | Date | Notes |
| --- | --- | --- |
|  |  |  |
