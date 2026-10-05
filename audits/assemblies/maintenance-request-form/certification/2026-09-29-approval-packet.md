# Maintenance request form — certification approval packet

- Assembly: `ra-maintenance-request-form`
- Version: candidate 0.1.0
- Prepared: 2026-09-29
- Status: technical gates passed; formal approval pending
- Current score: 90/100

## Evidence index

| Evidence | Path / command |
| --- | --- |
| Assembly standard | `reference-assembly-standard.md` |
| Assembly specification | `specs/assemblies/maintenance-request-form.spec.md` |
| Latest audit record | `audits/assemblies/maintenance-request-form/2026-09-28.md` |
| Technical gate evidence | `audits/assemblies/maintenance-request-form/certification/2026-09-29-technical-gate-evidence.json` |
| Screen stress evidence | `audits/assemblies/maintenance-request-form/certification/2026-09-29-screen-stress-evidence.json` |
| Manual review checklist | `audits/assemblies/maintenance-request-form/certification/2026-09-29-manual-review-checklist.md` |
| Contract verification | `npm run verify:assemblies` |
| Storybook typecheck | `npm --workspace storybook-app run typecheck` |
| Technical certification runner | `npm run certify:maintenance-request-form` |
| Screen stress runner | `npm run stress:maintenance-request-form` |

## Automated coverage summary

- Certification runner covers desktop, tablet, and mobile viewports.
- Stress runner covers 6 deterministic form scenarios across 4 viewports.
- Assembly-state stress covers loading, offline, restricted, and stale.
- Submit outcomes cover success, service failure, partial dispatch, and unknown outcome.
- Draft outcomes cover saved and service failure.
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

1. Confirm whether cancel/reset needs an unsaved-change confirmation gate for the certified contract.
2. Record manual keyboard, screen-reader, zoom/reflow, and security/privacy review results.
3. Assign named approvers and record sign-off decisions.
