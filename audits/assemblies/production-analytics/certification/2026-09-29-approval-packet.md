# Production analytics — certification approval packet

- Assembly: `ra-production-analytics`
- Version: candidate 0.1.0
- Prepared: 2026-09-29
- Status: technical gates passed; formal approval pending
- Current score: 90/100

## Evidence index

| Evidence | Path / command |
| --- | --- |
| Assembly standard | `reference-assembly-standard.md` |
| Assembly specification | `specs/assemblies/production-analytics.spec.md` |
| Latest audit record | `audits/assemblies/production-analytics/2026-09-28.md` |
| Technical gate evidence | `audits/assemblies/production-analytics/certification/2026-09-29-technical-gate-evidence.json` |
| Screen stress evidence | `audits/assemblies/production-analytics/certification/2026-09-29-screen-stress-evidence.json` |
| Manual review checklist | `audits/assemblies/production-analytics/certification/2026-09-29-manual-review-checklist.md` |
| Contract verification | `npm run verify:assemblies` |
| Storybook typecheck | `npm --workspace storybook-app run typecheck` |
| Technical certification runner | `npm run certify:production-analytics` |
| Screen stress runner | `npm run stress:production-analytics` |

## Automated coverage summary

- Certification runner covers desktop, tablet, and mobile viewports.
- Stress runner covers complete, empty, missing-points, partial-series, high-density, and long-content scenarios across 4 viewports.
- Assembly-state stress covers loading, offline, restricted, and stale.
- Export outcomes cover success, service failure, permission restriction, and unknown outcome.
- Source scan checks raw hex colors, raw px literals, secret-like strings, and mojibake-like text.

## Required approvals

| Role | Name | Decision | Date |
| --- | --- | --- | --- |
| Assembly Owner | Pending | Pending | — |
| Engineering Lead | Pending | Pending | — |
| Accessibility Reviewer | Pending | Pending | — |
| Security/Privacy Reviewer | Pending | Pending | — |
| Design System Council | Pending | Pending | — |

## Open decisions before certification

1. Record manual screen-reader review of chart summaries and synchronized data tables.
2. Confirm production export audit-log and permission wording with Security/Privacy reviewer.
3. Assign named approvers and record sign-off decisions.
