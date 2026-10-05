# Plant settings — certification approval packet

- Assembly: `ra-plant-settings`
- Version: candidate 0.1.0
- Prepared: 2026-09-29
- Status: technical gates passed; formal approval pending
- Current score: 94/100

## Evidence index

| Evidence | Path / command |
| --- | --- |
| Assembly standard | `reference-assembly-standard.md` |
| Assembly specification | `specs/assemblies/plant-settings.spec.md` |
| Baseline audit record | `audits/assemblies/plant-settings/2026-09-28.md` |
| Updated audit record | `audits/assemblies/plant-settings/2026-09-29.md` |
| Technical gate evidence | `audits/assemblies/plant-settings/certification/2026-09-29-technical-gate-evidence.json` |
| Screen stress evidence | `audits/assemblies/plant-settings/certification/2026-09-29-screen-stress-evidence.json` |
| Manual review checklist | `audits/assemblies/plant-settings/certification/2026-09-29-manual-review-checklist.md` |
| Contract verification | `npm run verify:assemblies` |
| Storybook typecheck | `npm --workspace storybook-app run typecheck` |
| Technical certification runner | `npm run certify:plant-settings` |
| Screen stress runner | `npm run stress:plant-settings` |

## Automated coverage summary

- Certification runner covers desktop (1440x1200), tablet (768x1024), and mobile (390x844) viewports.
- Stress runner covers 6 deterministic scenarios (`ready`, `dirty`, `restricted-section`, `concurrent-conflict`, `stress-long-content`, `high-density`) across 4 viewports (`mobile-narrow 320px`, `mobile 390px`, `tablet 768px`, `desktop 1440px`).
- Assembly-state stress covers `loading`, `offline`, `restricted`, and `stale`.
- Save operation outcomes cover `success`, `failure` (retains inputs), `reauth-required`, and `unknown`.
- Webhook signing key rotation workflow covers governed consequence confirmation, administrator passcode entry, KMS provisioning delay, one-time verification credential delivery, and rollback execution on failure.
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
2. Confirm webhook signing key rotation consequence advisory and one-time verification credential delivery with Security/Privacy Lead.
3. Assign named approvers and record sign-off decisions.
