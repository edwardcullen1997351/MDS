# Plant Operations Dashboard certification packet

- Assembly: `ra-plant-operations-dashboard`
- Version: `0.2.0`
- Packet date: 2026-09-29
- Status: technical gates and self-service stress evidence passed; formal named approvals pending

## Evidence index

| Evidence | Location | Purpose |
| --- | --- | --- |
| Assembly specification | `specs/assemblies/plant-operations-dashboard.spec.md` | Scope, dependencies, supported claims, budgets, adoption rules |
| Assembly audit | `audits/assemblies/plant-operations-dashboard/2026-09-28.md` | Score, findings, gate disposition, technical evidence summary |
| Technical gate evidence | `audits/assemblies/plant-operations-dashboard/certification/2026-09-28-technical-gate-evidence.json` | Default-view browser, axe, layout, performance, and source-scan evidence |
| Screen stress evidence | `audits/assemblies/plant-operations-dashboard/certification/2026-09-29-screen-stress-evidence.json` | Passing scenario, viewport, state, long-content, max-volume, and action-outcome stress matrix |
| Manual review checklist | `audits/assemblies/plant-operations-dashboard/certification/2026-09-29-manual-review-checklist.md` | Human-review prompts before formal approval |
| Visual screenshots | `audits/assemblies/plant-operations-dashboard/visual/` | Desktop, tablet, and mobile visual evidence |
| Certification runner | `tools/certify-plant-operations-dashboard.mjs` | Reproducible technical gate runner |
| Stress runner | `tools/stress-plant-operations-dashboard.mjs` | Reproducible screen stress runner |
| Governing standard | `reference-assembly-standard.md` | Certification gates, scoring, approvals, and stress-evidence expectations |

## Commands to reproduce

Run against a fresh Storybook static preview:

```powershell
npm run verify
npm run verify:assemblies
npm --workspace @ds/react run build
npm --workspace storybook-app run typecheck
npm --workspace storybook-app run build
cd apps\storybook
..\..\node_modules\.bin\vite.cmd preview --host 127.0.0.1 --port 6008 --strictPort
```

Then, from the repo root in another terminal:

```powershell
$env:MDS_STORYBOOK_URL='http://127.0.0.1:6008'
npm run certify:plant-operations-dashboard
npm run stress:plant-operations-dashboard
```

## Self-service evidence completed

| Area | Status | Notes |
| --- | --- | --- |
| Build and token verification | Passed | `npm run verify`; Storybook and React package builds |
| Contract checks | Passed | `npm run verify:assemblies` |
| Default browser certification | Passed | `npm run certify:plant-operations-dashboard` |
| Screen stress matrix | Passed | `npm run stress:plant-operations-dashboard`; 32 scenario/viewport checks, 4 assembly-state checks, 3 action-outcome checks |
| Visual captures | Passed | Desktop, tablet, mobile screenshots refreshed |
| Security/privacy self-scan | Passed | Source scan for secret-like strings plus governed action outcomes |
| Formal sign-off | Pending | Requires named human approvals |

## Formal approval routing

The following approvals are still required before the assembly can be labeled formally certified:

| Role | Decision needed |
| --- | --- |
| Assembly Owner | Approves purpose, scope, lifecycle ownership, and adoption contract |
| Engineering Lead | Approves implementation integrity, maintainability, build evidence, and performance budgets |
| Accessibility Reviewer | Approves manual keyboard, focus, zoom/reflow, and assistive-technology review |
| Security/Privacy Reviewer | Approves governed export/review behavior and privacy-safe synthetic data |
| Design System Council | Issues final certification disposition |
