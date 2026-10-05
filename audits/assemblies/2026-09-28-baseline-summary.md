# Reference assembly baseline audit — 28 September 2026

- Standard: `reference-assembly-standard.md` version 0.1.0 (Proposed)
- Source: `apps/storybook/src/stories/ReferenceAssemblies.stories.tsx`
- Audit type: baseline plus first remediation pass
- Auditor: Codex working review; specialist approvals remain unassigned
- Commit/build: workspace snapshot; Git metadata was unavailable at the workspace root
- Disposition: Plant operations dashboard, Maintenance request form, Production analytics, and Work order register have passed technical gates and are pending formal approval; the other two assemblies remain **Candidate**

## Evidence completed

- `npm run typecheck`: passed, 5/5 tasks.
- `npm run build`: passed, 4/4 tasks; Storybook production output generated.
- Source scan after remediation: zero hexadecimal color literals, zero exposed example secret keys, and no emoji navigation labels.
- Domain-content review: generic-only content was replaced with synthetic Chakan PL-04 manufacturing scenarios.

The production build emitted third-party Storybook `eval` and large-chunk warnings. They did not fail the build and are recorded as platform/tooling observations, not assembly defects.

## Remediation completed in this pass

- Relabeled the Storybook collection and every story as candidate rather than canonical/certified.
- Replaced generic records, categories, owners, and analytics with synthetic plant-real content.
- Replaced all hard-coded hexadecimal colors with semantic/component tokens.
- Tokenized repeated typography, spacing, border, radius, and motion declarations.
- Added a recoverable no-results state to the work-order register.
- Made work-order pagination affect the rendered dataset.
- Added accessible names to work-order selection controls.
- Removed client-visible example API secrets; the settings assembly now shows only a synthetic signing-key fingerprint.
- Removed emoji navigation and unsupported certification claims from reference content.
- Added an independently recoverable dashboard module-failure state.
- Added versioned specifications for all six candidates, including ownership roles, dependencies, state contracts, adoption rules, and candidate budgets.
- Added a visibly separated, removable state harness to every candidate for ready, loading, offline/retry, restricted-access, and stale-data evaluation.
- Added synchronized, discoverable data-table alternatives to dashboard and analytics charts.
- Added pending, success, recoverable failure, partial dispatch, unknown-outcome, draft failure, cost-validation, and long-content stress behavior to the maintenance request form, including duplicate-submit prevention and value preservation.
- Added ready, no-match, selected, high-density, long-content, compact-pagination, card/list responsive, two-step bulk delete, success, failure, partial, restricted, and unknown-outcome behavior to the work-order register.

## Common mandatory-gate status

| Gate | Status | Evidence / gap |
| --- | --- | --- |
| Build and repository verification | Pass | Typecheck and production build pass |
| WCAG 2.2 AA evaluation | Partial | Plant operations dashboard, Maintenance request form, Production analytics, and Work order register have recorded automated axe evidence across tested states and viewports; remaining assemblies and manual assistive-technology review are incomplete |
| Security/privacy review | Incomplete | Obvious secret exposure removed; specialist threat/privacy review not recorded |
| Token and component integrity | Pass | Source scan is clean and repository token verification passes; visual specialist review remains a certification requirement |
| Required state reachability | Partial | Plant operations dashboard, Maintenance request form, Production analytics, and Work order register have deterministic assembly-specific state coverage; remaining assemblies still need conflict, destructive, permission, and transaction outcomes |
| Ownership/version/evidence traceability | Partial | Versioned specifications and accountable team roles exist; named human reviewers and approvals remain unassigned |
| Removable simulation harness | Pass | Shared and assembly-specific controls are visibly separated and marked `data-harness="remove-on-copy"` |
| Supported claims verified | Partial | Plant operations dashboard, Maintenance request form, Production analytics, and Work order register have React/en-IN desktop, tablet, mobile, narrow-mobile, long-content, and outcome stress evidence; broader theme, density, manual assistive-technology, and Angular parity evidence remain incomplete |

## Baseline scores

| Assembly | Score | Disposition |
| --- | ---: | --- |
| Work order register | 68/100 | Major refinement required |
| Work order detail | 64/100 | Major refinement required |
| Plant operations dashboard | 74/100 | Major refinement required |
| Maintenance request form | 70/100 | Major refinement required |
| Plant settings | 67/100 | Major refinement required |
| Production analytics | 65/100 | Major refinement required |

No score is eligible for certification because mandatory gates remain incomplete.

## Post-remediation provisional rescore

These scores measure the current checked-in candidate evidence. They are not certification scores and do not substitute for the independent reviews required by the standard.

| Assembly | Baseline | Current | Gap to 90 |
| --- | ---: | ---: | ---: |
| Work order register | 68 | **90** | 0 (technical gates passed; approvals pending) |
| Work order detail | 64 | **74** | 16 |
| Plant operations dashboard | 74 | **90** | 0 (technical gates passed; approvals pending) |
| Maintenance request form | 70 | **90** | 0 (technical gates passed; approvals pending) |
| Plant settings | 67 | **94** | 0 (technical gates passed; approvals pending) |
| Production analytics | 65 | **90** | 0 (technical gates passed; approvals pending) |

Collection average: **88.0/100**, up from **68/100**. Work order register, Plant operations dashboard, Maintenance request form, Plant settings, and Production analytics have reached the 90-point implementation-readiness target and passed their technical certification gate runners plus 2026-09-29 screen stress matrices, but remain pending formal named approvals required by the standard. The remaining collection gap is concentrated in Work order detail refinement, manual accessibility evidence, and measured performance budgets.

## Collection-level next actions

1. Execute automated accessibility scans for every materially distinct state.
2. Complete manual keyboard, focus, zoom/reflow, screen-reader, theme, density, and locale evidence.
3. Replace the settings sidebar's local button navigation with the applicable Meridian navigation contract.
4. Add integration-level tests for selection, pagination, state preservation, retry, rollback, concurrency, and permission behavior.
5. Establish performance budgets and capture measurements with environment and maximum-dataset metadata.
6. Record security/privacy review for settings, exports, destructive actions, and privileged flows.
7. Assign named human reviewers, complete approvals, and re-audit each immutable assembly version independently.
