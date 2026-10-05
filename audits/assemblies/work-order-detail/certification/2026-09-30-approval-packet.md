# Work order detail — certification approval packet

- Assembly: `ra-work-order-detail`
- Version: candidate 0.1.0
- Prepared: 2026-09-30
- Status: technical gates passed; formal approval pending
- Current score: 94/100

## Evidence index

| Evidence | Path / command |
| --- | --- |
| Assembly standard | `reference-assembly-standard.md` |
| Assembly specification | `specs/assemblies/work-order-detail.spec.md` |
| Baseline audit record | `audits/assemblies/work-order-detail/2026-09-28.md` |
| Updated audit record | `audits/assemblies/work-order-detail/2026-09-30.md` |
| Technical gate evidence | `audits/assemblies/work-order-detail/certification/2026-09-30-technical-gate-evidence.json` |
| Screen stress evidence | `audits/assemblies/work-order-detail/certification/2026-09-30-screen-stress-evidence.json` |
| Manual review checklist | `audits/assemblies/work-order-detail/certification/2026-09-30-manual-review-checklist.md` |
| Contract verification | `npm run verify:assemblies` |
| Storybook typecheck | `npm --workspace storybook-app run typecheck` |
| Technical certification runner | `npm run certify:work-order-detail` |
| Screen stress runner | `npm run stress:work-order-detail` |

## Automated coverage summary

- Certification runner covers desktop (1440x1200), tablet (768x1024), and mobile (390x844) viewports.
- Stress runner covers 7 deterministic scenarios (`ready`, `dirty`, `on-hold`, `restricted-planner`, `concurrent-conflict`, `stress-long-content`, `high-density-history`) across 4 viewports (`mobile-narrow 320px`, `mobile 390px`, `tablet 768px`, `desktop 1440px`).
- Assembly-state stress covers `loading`, `offline`, `restricted`, and `stale`.
- Save operation outcomes cover `success` (bumps revision to Rev E), `failure` (retains local modifications), `reauth-required`, and `unknown`.
- Line Hold workflow covers modal dialog launch, reason code selection, supervisor containment remarks, consequence advisory, and live status announcement.
- Zero raw hex colors, zero raw pixel literals, zero mojibake, zero secret/password leaks.
- WCAG 2.2 AA automated verification via axe-core: 0 violations across all tested configurations.
- Zero horizontal scrolling and zero overlapping controls across all container widths.

## Required approvals

| Role | Name | Decision | Date |
| --- | --- | --- | --- |
| Assembly Owner | Pending | Pending | — |
| Engineering Lead | Pending | Pending | — |
| Accessibility Reviewer | Pending | Pending | — |
| Security/Privacy Reviewer | Pending | Pending | — |
| Design System Council | Pending | Pending | — |

## Open decisions before formal certification

1. Complete manual keyboard navigation, VoiceOver/NVDA screen reader walkthrough, and 200%/400% zoom reflow verification.
2. Validate Line Hold consequence advisory with Shop-Floor Safety Lead.
3. Assign named approvers and record sign-off decisions.
