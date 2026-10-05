# Meridian Design System — Reference Assembly Operating Standard

**Document owner:** Design System Council
**Approval authority:** Design System Council and Accessibility Lead
**Status:** Proposed
**Version:** 0.1.0
**Effective date:** Not effective until approved
**Review cadence:** Quarterly and after every material platform, accessibility, or design-system change

---

## 1. Purpose

This document defines how Meridian reference assemblies are proposed, designed, implemented, reviewed, certified, published, audited, refined, deprecated, and retired.

A reference assembly is a production-representative, interactive composition of approved Meridian assets that demonstrates how a recurring class of enterprise screen should work as a coherent whole. It is executable guidance: more specific than a design principle, broader than a component or interaction pattern, and safer to adopt than an illustrative demo.

This standard has two uses:

1. Govern every future reference assembly from proposal through retirement.
2. Provide the audit baseline for refining reference assemblies that already exist.

This document does not replace component, composite, pattern, navigation, layout, token, content, or accessibility specifications. It coordinates them and defines the evidence required at assembly level.

### 1.1 Normative language

The words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** are normative only when capitalized.

### 1.2 Enterprise-standard claim

Conformance to this document means conformance to Meridian's internal reference-assembly standard. It MUST NOT be described as “Fortune 500 certified,” “industry certified,” or equivalent unless an independent authority has issued that certification. Enterprise quality is demonstrated through evidence, controls, repeatable review, and measurable outcomes—not through a label.

---

## 2. Scope and boundaries

This standard applies to compositions presented as any of the following:

- canonical screen;
- reference assembly;
- enterprise example;
- recommended application blueprint;
- copy-ready starter screen;
- approved cross-component workflow example.

It applies across React, Angular, or any later supported implementation where the assembly is represented.

It does not govern:

- isolated component stories;
- visual-only concept explorations;
- product-specific screens that are not promoted as reusable guidance;
- test fixtures that exist only for automated testing;
- marketing compositions.

### 2.1 What a reference assembly owns

A reference assembly owns decisions that arise only when several system assets operate together:

- screen purpose and user outcome;
- region hierarchy and information priority;
- composition and dependency choices;
- cross-region state and event choreography;
- loading, empty, error, partial, stale, restricted, and success behavior;
- responsive transformation of the complete screen;
- end-to-end focus order and announcement behavior;
- realistic content and data-density expectations;
- operational, security, privacy, performance, and observability requirements;
- adoption instructions and removable demonstration scaffolding.

It MUST NOT redefine a contract already owned by a token, component, composite, interaction pattern, navigation system, or layout template. It references that source and documents only the assembly-level decision.

### 2.2 Classification rule

The canonical implementation hierarchy is:

1. **Primitives** — structural and typographic foundations such as `Box`, `Stack`, and `Text`.
2. **Components** — single-purpose controls and data/feedback/navigation elements.
3. **Composites** — standardized multi-component units with a shared contract.

Foundations, tokens, interaction patterns, layout templates, data visualizations, and navigation systems are governed artifact domains; they are not additional implementation tiers. A reference assembly consumes these domains but does not create another component tier.

### 2.3 Three-Tier Composition Architecture & Zero-Bespoke-CSS Mandate

To permanently eliminate the "Composition Gap"—where missing intermediate primitives force screen authors to write thousands of lines of bespoke, unmaintainable CSS that breaks viewport constraints and accessibility—every reference assembly MUST conform to the Three-Tier Model:

1. **Tier 1 (Primitives & Core Controls)**: Reusable, atomic controls (`Button`, `Badge`, `SegmentedControl`, `Tabs`, `TreeGridCell`, `Input`, `Switch`). Governed in `@ds/tokens`, `@ds/react`, and `@ds/angular`.
2. **Tier 2 (Composites & Layout Templates)**: Standardized multi-component units and viewport containers (`CommandToolbarGroup`, `Workbench3PaneLayout`, `TimeHorizonStepper`, `ConflictResolver`, `DualUomBadge`, `StockRunwayHorizon`). Governed in `@ds/react` and `@ds/angular`.
3. **Tier 3 (Reference Assemblies)**: Orchestrates Tier 1 and Tier 2 components solely through reactive state coordination (e.g. `useTriPaneCoordinator`).

#### The Zero-Bespoke-CSS Mandate (Normative)
- Reference assembly stylesheets (`*.stories.css` or `*.assembly.css`) MUST NEVER define bespoke styles for interactive controls, buttons, toolbars, steppers, segmented controls, or layout template body containers.
- Any requirement to align controls (e.g. placing a date stepper next to a view switcher) MUST be fulfilled by a Tier 2 composite (`CommandToolbarGroup`).
- Any requirement to switch views (e.g. Matrix vs Dispatch) MUST be fulfilled by a Tier 1 primitive (`SegmentedControl`).
- Reference assembly CSS is strictly restricted to:
  - Domain-specific layout ratios (e.g. pane flex proportions);
  - High-level container background and semantic theme tokens;
  - Zero raw hex literals, zero arbitrary pixel margins outside token scale, zero `!important`, and zero component override rules.
- Any bespoke control styling detected during an audit constitutes an immediate blocking gate failure. The underlying gap MUST be promoted to Tier 1 or Tier 2 before assembly certification.

---

## 3. Authority and precedence

When requirements overlap, use this order:

1. Applicable law, regulation, contractual obligation, and approved organizational policy.
2. Accessibility and security requirements adopted by the organization.
3. This reference-assembly operating standard.
4. The applicable Meridian artifact standard and frozen specification.
5. General guidance and examples.

The most specific applicable requirement governs unless it conflicts with a higher authority. Conflicts MUST be recorded in the assembly decision log; they MUST NOT be silently resolved in implementation.

### 3.1 Required Meridian sources

Every assembly author and auditor MUST consult the sources applicable to the assembly:

- `readme.md` — repository architecture, status, and source-of-truth map;
- `Design Principles.md` — product and interaction north star;
- `Token Architecture.md` — token contract;
- `guidelines/composition-rules.card.html` — universal composition rules;
- `guidelines/promotion-policy.card.html` — maturity and freeze rules;
- `guidelines/layout-template-spec-standard.card.html` — layout ownership;
- `guidelines/interaction-pattern-spec-standard.card.html` — behavior and workflow ownership;
- `guidelines/composite-spec-standard.card.html` — composite ownership;
- the applicable core, navigation, and visualization standards;
- `AUDIT_STANDARD.md` — system-wide technical audit checks;
- every frozen specification for a dependency used by the assembly.

Where `AUDIT_STANDARD.md` describes artifact categories as tiers, this document's Section 2.2 controls the terminology. The audit categories remain valid coverage areas.

### 3.2 External baselines

Unless a stricter organizational policy applies, assemblies MUST target:

- WCAG 2.2 Level AA for web accessibility;
- the WAI-ARIA Authoring Practices Guide for widget behavior where native HTML does not supply the interaction;
- the repository's adopted design-token contract and supported Design Tokens Community Group format version;
- the organization's approved security, privacy, browser-support, localization, and records-retention policies.

External standards MUST be recorded with a version or access date. Draft standards MUST be identified as drafts and MUST NOT be represented as final standards.

---

## 4. Operating principles

Every reference assembly SHALL follow these principles:

1. **Outcome before arrangement.** Begin with the user decision or task, not a preferred collection of components.
2. **Reuse before invention.** Use frozen Meridian assets before introducing local structure or behavior.
3. **One owner per contract.** A rule is defined once and referenced everywhere else.
4. **Real behavior over screenshots.** Important states and transitions must be operable and inspectable.
5. **Realistic pressure.** Content volume, latency, permissions, failure, and concurrency must expose weak decisions.
6. **Accessibility by construction.** Keyboard, focus, semantics, announcements, zoom, reflow, and alternative input are design inputs.
7. **Secure and private by default.** Examples use synthetic data and demonstrate least privilege, safe disclosure, and destructive-action controls.
8. **Tokens over literals.** Product-facing visual decisions use approved semantic or component tokens.
9. **Evidence over assertion.** A claim is accepted only with reproducible evidence.
10. **Copy safety.** Demonstration scaffolding is visibly separate and removable in one pass.
11. **Progressive standardization.** A useful candidate may evolve, but only certified assemblies are presented as approved standards.
12. **Measured maintenance.** Adoption, defects, accessibility findings, exceptions, and age inform refinement or retirement.

---

## 5. Roles and accountability

One person MAY hold multiple roles, but every role MUST be named in assembly metadata.

| Role | Accountability |
| --- | --- |
| Assembly owner | Outcome, scope, lifecycle, review scheduling, and remediation closure |
| Design lead | Information hierarchy, composition, content hierarchy, responsive behavior, and visual conformance |
| Engineering lead | Architecture, supported frameworks, performance, reliability, testing, and maintainability |
| Accessibility reviewer | WCAG evaluation, assistive-technology review, keyboard/focus verification, and accessibility sign-off |
| Content/domain reviewer | Terminology, scenario realism, localization readiness, and operational accuracy |
| Security/privacy reviewer | Threat-sensitive flows, data exposure, permissions, logging, retention, and privacy review |
| Design System Council | Classification, exceptions, certification, deprecation, and final governance decisions |
| Adopting product team | Product-specific validation, integration testing, and reporting divergence or defects |

No author may be the sole approver of their own assembly. Certification requires approval from the Assembly Owner, Engineering Lead, Accessibility Reviewer, and Design System Council. Security/privacy approval is additionally REQUIRED when the assembly handles authentication, authorization, personal data, secrets, payments, destructive operations, exports, or regulated records.

---

## 6. Required artifact set

A reference assembly is not certifiable until all required artifacts exist.

### 6.1 Assembly specification

Location: `specs/assemblies/<assembly-slug>.spec.md` or the repository's later approved equivalent.

It MUST include:

- metadata from Section 7;
- problem statement, users, jobs, and measurable outcome;
- use and do-not-use boundaries;
- region and dependency map;
- assembly-owned flow, state, and event contracts;
- role and permission behavior;
- responsive and localization behavior;
- accessibility, security/privacy, performance, and reliability requirements;
- analytics/telemetry requirements, including prohibited data;
- decision log, known limits, and open items;
- adoption and extension rules.

### 6.2 Executable canonical implementation

The implementation MUST:

- use real Meridian exports and supported APIs;
- use semantic/component tokens rather than raw presentation literals;
- exercise realistic data volume and text expansion;
- make every assembly-owned state reachable through controls or deterministic fixtures;
- expose the current assembly state where doing so aids inspection;
- separate all simulation and explanatory scaffolding with `data-harness="remove-on-copy"` or the approved platform equivalent;
- identify which integration stubs an adopting team must replace;
- contain no real credentials, personal data, customer data, or production endpoints.

### 6.3 Story or reference card

A discoverable entry MUST connect the specification, implementation, audit record, and adoption guidance. It MUST state the lifecycle status and last certification date.

### 6.4 Audit record

Location: `audits/assemblies/<assembly-slug>/<YYYY-MM-DD>.md` or an approved governed system.

The record MUST include:

- commit or artifact version tested;
- environment, browsers, viewport/container sizes, themes, densities, and locales tested;
- automated and manual test results;
- assistive technologies used and their versions;
- findings with severity, owner, due date, and evidence;
- approved exceptions and expiry dates;
- score, gate results, reviewers, and disposition.

### 6.5 Adoption guide

The adoption guide MUST identify:

- what adopters copy or import;
- what must remain unchanged to preserve the contract;
- permitted extension points;
- product-owned decisions;
- required integrations and data mappings;
- migration notes and known limitations.

---

## 7. Mandatory metadata

Every specification and discoverable reference entry MUST show:

```yaml
id: ra-<stable-slug>
name: <human-readable name>
status: proposed | candidate | certified | deprecated | retired
version: <semantic version>
owner: <named team or accountable person>
design_lead: <name or team>
engineering_lead: <name or team>
accessibility_reviewer: <name or team>
security_privacy_reviewer: <name, team, or not-applicable with reason>
supported_frameworks: [react, angular]
supported_themes: [light, dark]
supported_densities: [compact, comfortable, expanded]
supported_locales: [<locale list>]
created: YYYY-MM-DD
last_reviewed: YYYY-MM-DD
next_review_due: YYYY-MM-DD
dependencies: [<spec and version references>]
supersedes: [<assembly ids or none>]
superseded_by: <assembly id or none>
open_items: <count>
exceptions: [<exception ids or none>]
```

Unknown values are written as `unknown` and create an open item. They MUST NOT be omitted when the field is applicable.

---

## 8. Lifecycle and decision gates

```text
Propose → Triage → Specify → Assemble → Verify → Review → Certify → Publish
                                                        ↓
                                 Monitor → Audit → Refine → Re-certify
                                                        ↓
                                             Deprecate → Retire
```

### 8.1 Proposed

Required evidence:

- recurring enterprise screen or workflow problem;
- at least two plausible adopting contexts, or one high-consequence context;
- explanation of why existing component, pattern, and layout guidance is insufficient;
- named owner and intended users;
- initial success measures.

The Council rejects proposals that merely showcase components, duplicate an existing assembly, encode one product's branding, or lack a reusable assembly-level contract.

### 8.2 Candidate

A candidate has its specification, executable implementation, reference entry, initial tests, and no unresolved scope question. It MAY be used for evaluation but MUST be labeled non-certified.

### 8.3 Certified

Certification requires:

- all mandatory artifacts;
- every mandatory gate in Section 12 passing;
- a score of at least 90/100;
- zero blocker or critical findings;
- no overdue high-severity findings;
- zero open items affecting user safety, accessibility, security, data integrity, or the core contract;
- named approvals required by Section 5;
- evidence recorded against an immutable version or commit.

Certification applies only to the audited version. Material changes trigger impact assessment and possibly re-certification.

### 8.4 Deprecated

Deprecation MUST include:

- reason and decision date;
- recommended replacement;
- migration guidance;
- support window and retirement date;
- telemetry or adoption evidence where available.

Deprecated assemblies remain discoverable but MUST NOT be recommended for new adoption.

### 8.5 Retired

Retired assemblies are removed from normal discovery and preserved in version history or an archive. Links from active documentation MUST be updated. A retired assembly MUST NOT remain labeled canonical or certified.

---

## 9. Content and scenario policy

### 9.1 Primary evidence must be domain-real

The canonical Meridian implementation MUST use the established manufacturing ERP context defined by the applicable pattern and layout standards. Data MUST be synthetic but operationally credible: realistic roles, quantities, identifiers, timestamps, currency, permissions, latency, failure modes, and record volume.

Generic labels such as `Record`, `Item`, `Category`, and `Owner` MAY appear in a companion portability view, schema, or mapping guide. They MUST NOT be the sole canonical evidence because they do not test terminology, truncation, risk communication, or domain consequences.

### 9.2 Content requirements

The assembly MUST demonstrate:

- concise, action-oriented labels;
- specific error and recovery messages;
- dates, time zones, numbers, units, and currency formatted by locale-aware utilities;
- long names and translated-text expansion;
- empty, redacted, restricted, unknown, and stale values where applicable;
- safe synthetic identities and data;
- no lorem ipsum, joke content, or unexplained placeholder copy.

### 9.3 Localization and internationalization

Where applicable, test at least:

- the primary product locale;
- one locale with materially longer strings;
- one RTL locale when the product supports RTL;
- time-zone boundaries and daylight-saving transitions;
- locale-sensitive dates, decimals, grouping, currency, and pluralization.

User-visible strings MUST be externalizable. Layouts MUST NOT depend on English word length or left-to-right direction unless the limitation is explicitly approved and documented.

---

## 10. Assembly requirements

### 10.1 Purpose and hierarchy

The assembly MUST make the primary user goal, primary action, risk state, current context, and navigation exit apparent. It MUST define which regions are persistent, conditional, replaceable, scrollable, sticky, or modal.

### 10.2 Dependency integrity

- Dependencies MUST be named and versioned.
- Frozen dependencies SHOULD be used for certification.
- A non-frozen dependency requires a recorded risk, owner, and expiry.
- Assemblies MUST NOT fork component behavior or reproduce internal component styling.
- Local wrappers MUST have a documented assembly-level purpose and MUST NOT become shadow components.
- React and Angular implementations advertised as equivalent MUST satisfy the same user-visible contract; DOM identity is not required.

### 10.3 Token and visual conformance

- Raw colors, typography, spacing, radii, shadows, z-index values, and motion values are prohibited in product-facing assembly code unless the value is data-derived and the exception is documented.
- Themes and density modes MUST preserve semantics, hierarchy, and operability.
- Status MUST NOT rely on color alone.
- Focus indicators MUST remain visible and unobscured.
- Zoom and text spacing MUST not hide content or functionality.

### 10.4 Required state model

Every applicable state MUST be specified, reachable, and tested:

- initial and default;
- loading and delayed loading;
- first-run empty;
- no-results empty;
- success and completion;
- validation failure;
- permission denied or restricted;
- authentication/session expiry;
- network/service failure;
- partial success or partial data;
- stale data and concurrent modification;
- optimistic update, rollback, and unknown outcome;
- offline/degraded operation;
- destructive confirmation and cancellation;
- maximum supported data density and overflow.

An omitted state requires a written reason. “Handled by the backend” is not sufficient when the state changes the user experience.

### 10.5 Interaction and focus

The assembly MUST document and test:

- entry and exit points;
- keyboard order and shortcuts;
- focus placement after navigation, validation, disclosure, mutation, failure, cancellation, and deletion;
- focus restoration after modal or temporary surfaces close;
- double-submission and rapid-repeat protection;
- pointer, touch, and non-drag alternatives where applicable;
- announcements for asynchronous status changes;
- preservation or intentional clearing of user input after failure.

### 10.6 Responsive and adaptive behavior

The assembly MUST be validated by available container width, not only named device sizes. At minimum, test the supported narrow, tablet, desktop, and ultrawide conditions plus 200% and 400% zoom where applicable.

The specification MUST define:

- region reflow or replacement;
- navigation transformation;
- reading and focus order after reflow;
- overflow and truncation behavior;
- table/list/chart alternatives at constrained widths;
- wide-desktop composition behavior, including when dense data surfaces should use a comfortable maximum width, compact density, or a larger visible row count instead of stretching sparse records across the full canvas;
- touch-target behavior;
- sticky, fixed, modal, and scroll ownership;
- safe-area and on-screen-keyboard effects where relevant.

### 10.7 Accessibility

The assembly MUST conform to WCAG 2.2 Level AA within the supported scope. Evaluation MUST combine automated tests with manual keyboard and assistive-technology testing. Passing an automated scanner alone is insufficient.

Evidence MUST cover, where applicable:

- semantic regions, headings, labels, names, roles, values, and relationships;
- logical reading and focus order;
- full keyboard operation without a trap;
- visible and unobscured focus;
- contrast and non-color identification;
- reflow, zoom, text spacing, orientation, and target size;
- status messages and live-region behavior;
- accessible errors, instructions, authentication, and redundant entry;
- alternatives for drag, hover, charts, and non-text content;
- reduced-motion behavior.

### 10.8 Security and privacy

The assembly MUST demonstrate safe patterns for its risk profile, including:

- least-privilege visibility and actions;
- authorization-aware empty/restricted states;
- no secrets or sensitive values in examples, URLs, analytics, logs, or client-visible errors;
- confirmation proportional to consequence;
- protection against duplicate destructive or financial operations;
- safe handling of uploads, exports, copied values, and external links;
- session timeout and re-authentication where required;
- masking/redaction and retention behavior where applicable;
- synthetic data only.

The reference implementation is not a security control. Adopters remain responsible for server-side authorization, validation, output encoding, request integrity, secure storage, and organizational security requirements.

### 10.9 Reliability and recovery

For every remote operation, specify:

- pending behavior;
- timeout behavior;
- retry eligibility and idempotency expectation;
- what data and context survive failure;
- rollback behavior;
- partial and unknown outcomes;
- reconciliation path;
- user-visible correlation or support information where appropriate.

### 10.10 Performance

Each assembly MUST define measurable budgets appropriate to its use, including:

- initial and incremental loading behavior;
- interaction response target;
- supported record/series/node volume;
- rendering and memory constraints;
- network assumptions;
- degradation strategy.

No universal numeric budget is invented by this document. Budgets require a target environment and measurement method. A result without environment, dataset, percentile, and tool is not evidence.

### 10.11 Observability

The assembly SHOULD define events that answer whether users complete, abandon, recover, or encounter failure. Telemetry MUST:

- use stable event names and documented schemas;
- distinguish validation, dependency, permission, and system failures;
- avoid sensitive payloads;
- record performance at meaningful percentiles;
- include assembly/version context;
- state retention and access expectations.

---

## 11. Verification matrix

The verification plan MUST be risk-based and recorded before certification.

| Dimension | Minimum evidence |
| --- | --- |
| Static quality | Typecheck, lint, contract checks, dependency checks, and successful production build |
| Unit/contract | Assembly-owned state transitions, events, data mapping, permission decisions, and error recovery |
| Integration | Real component/composite/pattern/layout integration and API boundary behavior |
| Accessibility automation | Automated scan of every materially distinct state, with results retained |
| Accessibility manual | Keyboard-only walkthrough plus screen-reader verification on approved platform combinations |
| Visual regression | Supported theme, density, responsive conditions, and high-risk states |
| Responsive | Declared container widths, text expansion, zoom, and overflow behavior |
| Localization | Primary locale plus applicable expansion, RTL, date/time, number, and currency cases |
| Resilience | Slow, failed, partial, stale, duplicated, cancelled, and unknown operations |
| Security/privacy | Threat-sensitive flows, permission states, sensitive-data review, and destructive actions |
| Performance | Recorded environment, dataset, method, percentile, budget, and result |
| Cross-framework | Equivalent user-visible contracts for every framework claimed in metadata |
| Content/domain | Domain review of terminology, plausibility, consequences, and recovery guidance |

Test evidence SHOULD be automated in continuous integration where stable automation is possible. Manual evidence MUST identify the reviewer and date.

### 11.1 Pre-approval evidence packet

Before requesting formal certification approval, the assembly team MUST prepare a self-service evidence packet that allows approvers to review evidence rather than rediscover basic defects.

The packet MUST include:

- the assembly specification and version;
- the latest audit record and score rationale;
- commands required to reproduce build, verification, certification, stress, and visual evidence;
- machine-readable technical evidence where automation exists;
- visual captures for supported high-risk viewports and states;
- a manual review checklist for keyboard, focus, assistive technology, zoom/reflow, security/privacy, and adoption safety;
- a list of required approvers and pending decisions;
- all open findings, exceptions, and expiry dates.

The packet SHOULD use stable relative paths so it can be reviewed in code review, an internal document, or an approval workflow without translation.

### 11.2 Screen and module stress testing

Every certification candidate MUST include stress evidence for its highest-risk screen, module, or flow before formal approval is requested.

Stress evidence MUST cover, where applicable:

- the narrowest supported mobile width, common mobile width, tablet width, and desktop/control-room width;
- 200% zoom or an equivalent reflow check;
- long-content expansion of labels, names, statuses, and actions;
- maximum supported dataset volume declared by the assembly;
- empty, loading, failed, stale, partial, restricted, duplicate, cancelled, and unknown states;
- slow acknowledgement and duplicate-activation prevention for governed actions;
- localization-sensitive date, time, number, unit, and text-expansion behavior;
- absence of horizontal overflow, clipped controls, incoherent overlap, and hidden primary actions;
- accessible alternatives for data visualizations and non-text summaries.

Stress scenarios MUST be deterministic. If the reference implementation uses a harness, the harness MUST be removable and MUST NOT be required by adopters. Storybook or demo environments SHOULD expose deterministic scenario selection through stable controls or URL parameters so evidence can be reproduced without manual clicking.

### 11.3 Reviewer-ready automation

Automation SHOULD be narrow, deterministic, and owned by the assembly rather than a generic screenshot smoke test. Certification runners SHOULD record:

- assembly ID and version;
- execution date and environment;
- tested URL or route;
- viewport dimensions and device mode;
- scenario/state identifiers;
- accessibility automation result and violation detail;
- layout overflow and overlap results;
- state-specific assertions;
- performance acknowledgement timings for governed actions;
- source scans for raw presentation literals, unsafe mock data, and mojibake or encoding defects;
- output file paths for retained evidence.

Automation MUST NOT replace required specialist approval when the standard requires human judgment. Passing automation means the assembly is ready for formal review, not that it is automatically certified.

---

## 12. Certification gates and scoring

### 12.1 Mandatory gates

The following are pass/fail and cannot be compensated for by a high score:

1. Production build and required repository verification pass.
2. WCAG 2.2 AA evaluation passes for the supported scope, or a time-limited exception is approved where legally and organizationally permitted.
3. No unresolved blocker or critical security/privacy finding.
4. No raw presentation literals or unauthorized component forks.
5. Required states are reachable and tested.
6. Dependency, owner, version, and evidence traceability is complete.
7. Simulation scaffolding is removable and synthetic data is safe.
8. Applicable framework, theme, density, locale, and responsive claims are verified.

### 12.2 Weighted score

| Domain | Weight |
| --- | ---: |
| Purpose, user outcome, and scope | 10 |
| Architecture, hierarchy, and dependency integrity | 15 |
| Interaction, state, failure, and recovery | 15 |
| Accessibility | 15 |
| Responsive behavior and internationalization | 10 |
| Tokens, visual consistency, themes, and density | 10 |
| Security, privacy, and reliability | 10 |
| Performance and observability | 5 |
| Documentation and adoption safety | 5 |
| Test evidence and traceability | 5 |
| **Total** | **100** |

Scoring scale for each criterion:

- **0** — absent or contradicted;
- **1** — acknowledged without adequate implementation/evidence;
- **2** — partially implemented or inconsistently evidenced;
- **3** — complete for the declared scope with reproducible evidence;
- **4** — complete, automated where appropriate, measured in adoption, and demonstrably resilient.

Scores are normalized to the domain weight.

| Result | Disposition |
| --- | --- |
| 90–100 and all gates pass | Eligible for certification |
| 80–89 or one non-critical gate incomplete | Candidate; remediation required |
| 60–79 | Major refinement required |
| Below 60 | Reject or redesign |

The score supports judgment; it does not replace it. Reviewers MUST record the evidence and rationale for each score.

### 12.3 The 5 Automated Certification Gates for Enterprise Screens

Every candidate reference assembly MUST pass 100% of the following automated gates before human certification sign-off. These gates are executed across all 14 mandatory enterprise edge scenarios and all 5 canonical viewports (320px, 390px, 768px, 1440px, 1920px) = 70 verification points:

```
┌────────────────────────────────────────────────────────────────────────┐
│               MERIDIAN 5-GATE SCREEN CERTIFICATION MATRIX              │
├────────────────────────────────────────────────────────────────────────┤
│ GATE 1: Zero-Bespoke-CSS & Token Purity                                │
│         • 0 control/toolbar/stepper/layout overrides in story CSS      │
│         • 100% var(--ds-*) tokens; 0 raw hex literals                  │
├────────────────────────────────────────────────────────────────────────┤
│ GATE 2: Viewport Containment & 0 H-Scroll (WCAG 2.2 AA Reflow 1.4.10) │
│         • scrollWidth <= clientWidth across all 5 viewports            │
│         • min-width: 0; min-height: 0; flex-shrink: 0 pinned rails     │
├────────────────────────────────────────────────────────────────────────┤
│ GATE 3: Automated Accessibility & High Contrast                        │
│         • 0 Axe-core violations across all 14 scenarios                │
│         • Text contrast >= 4.5:1; Active state contrast >= 3:1 non-text│
│         • ARIA roles (toolbar, radiogroup, region, polite live region) │
├────────────────────────────────────────────────────────────────────────┤
│ GATE 4: Reactive Tri-Pane State Coordination                           │
│         • Left selector filters Center data; Center updates Right      │
│         • Bidirectional state sync on mutations (drag, dispatch, sync) │
│         • Keyboard shortcuts (j/k row jump, Ctrl+Z 8s undo window)     │
├────────────────────────────────────────────────────────────────────────┤
│ GATE 5: Dual-Framework Contract Parity                                 │
│         • 100% API, prop, event, and token parity in React & Angular   │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Gate 1: Zero-Bespoke-CSS & Token Purity Gate**
   - 0 bespoke control overrides (`.ds-*-btn`, `.ds-*-toolbar`, `.ds-*-toggle`) in assembly CSS.
   - 100% token purity: all color, spacing, radius, and elevation values MUST use `var(--ds-*)`. 0 raw hex literals, 0 arbitrary pixel margins outside token scale.
2. **Gate 2: Viewport Containment & 0 H-Scroll Gate**
   - WCAG 2.2 AA Reflow (SC 1.4.10): Verified across all 5 canonical viewports:
     - `320px × 844px` (Mobile Narrow)
     - `390px × 844px` (Mobile Standard)
     - `768px × 1024px` (Tablet)
     - `1440px × 1200px` (Desktop Control Room)
     - `1920px × 1080px` (Ultra-Wide Operations Console)
   - `scrollWidth <= clientWidth` across all 5 viewports (0 horizontal overflow).
   - Layout template containers MUST pin `min-width: 0`, `min-height: 0`, and enforce independent internal scroll boundaries.
3. **Gate 3: Automated Accessibility & High-Contrast Gate**
   - 0 Axe accessibility violations across all 14 mandatory enterprise scenarios (`ready`, `concurrent-conflict`, `optimistic-rebound`, `stale`, `stress-high-density`, `anantshriveda-warehouse`, `minimum-content`, `long-labels`, `missing-data`, `loading`, `partial-loading`, `empty-state`, `error-state`, `disabled-actions`).
   - Text contrast >= 4.5:1 (e.g. `--ds-semantic-color-text-primary` on `--ds-semantic-color-surface-muted`).
   - Active interactive states contrast >= 3:1 non-text and >= 4.5:1 text against active solid backgrounds (`--ds-semantic-color-action-primary-default`).
   - WAI-ARIA conformance: toolbar `role="toolbar"`, segmented control `role="radiogroup"` with arrow-key navigation, polite live regions for async feedback.
4. **Gate 4: Reactive Tri-Pane State Coordination Gate**
   - Left-to-Center: Selecting an entity, facility, or work center node MUST reactively filter and update the center matrix dataset.
   - Center-to-Right: Selecting a material row or matrix cell MUST immediately synchronize and bind the right Inspector pane.
   - Action-to-Panes: Optimistic dispatching, reschedule drag, or conflict overrides MUST propagate updates bidirectionally across tree capacity badges, matrix allocations, and inspector summaries.
   - Power navigation: Keyboard shortcuts (`j`/`k` row navigation, `Ctrl+Z` / `Alt+Z` undo within 8-second window) MUST be operable without mouse dependency.
5. **Gate 5: Dual-Framework Parity Gate**
   - All Tier 1 and Tier 2 components introduced or used by the reference assembly MUST have 100% contract parity across `@ds/react` and `@ds/angular`.
   - Prop names, event payloads, ARIA attributes, and token bindings must be identical.

---

## 13. Findings and remediation

| Severity | Definition | Required treatment |
| --- | --- | --- |
| Blocker | Creates immediate safety, legal, severe security/privacy, or data-integrity risk; or prevents meaningful evaluation | Do not publish or adopt; remediate before further certification review |
| Critical | Prevents completion for a supported user group, violates a mandatory gate, or creates serious operational risk | Must be fixed before certification |
| High | Materially degrades a primary workflow or creates significant inconsistency/recovery risk | Owner and due date required; normally fixed before certification |
| Medium | Affects a secondary workflow, edge condition, maintainability, or documented consistency | Scheduled remediation required |
| Low | Minor quality or documentation issue with limited user consequence | Backlog with rationale |

Every finding MUST contain: identifier, criterion, evidence, affected users/scenarios, severity, owner, target date, status, and closure evidence.

Severity is based on user and organizational consequence, not implementation effort.

---

## 14. Exceptions and waivers

Exceptions are temporary risk acceptances, not permanent alternate standards.

An exception MUST record:

- requirement and affected assembly/version;
- business and user impact;
- reason compliance is not currently possible;
- alternatives considered;
- compensating control;
- accountable owner;
- approver;
- remediation plan;
- issue link;
- expiry date no more than 90 days away unless the Council documents why a longer period is necessary.

Exceptions affecting accessibility, security, privacy, safety, legal compliance, or financial integrity require approval from the relevant specialist owner. An expired exception automatically becomes a failed gate.

Repeated exceptions for the same gap trigger a system-level decision: add the missing capability, revise the standard through governance, or stop claiming the unsupported scope.

---

## 15. Change control and versioning

Reference assemblies use semantic versioning for their documented contract:

- **Patch:** defect, documentation, or internal implementation correction with no intended contract change.
- **Minor:** backward-compatible addition such as a new optional state, integration example, or supported configuration.
- **Major:** changed or removed behavior, hierarchy, adoption contract, required dependency, or user flow.

Every change MUST include an impact assessment covering accessibility, security/privacy, tokens, responsive behavior, localization, performance, frameworks, documentation, tests, and adopting products.

Re-certification is REQUIRED after:

- a major version change;
- a changed primary flow or information hierarchy;
- a changed authentication, authorization, destructive, financial, or regulated-data behavior;
- a changed accessibility contract;
- replacement of a governing layout, pattern, navigation system, or critical component;
- addition of a claimed framework, platform, theme, density, or locale;
- an incident showing the certified behavior is unsafe or materially misleading.

Patch and minor changes MAY use a documented delta review when the impact assessment shows no mandatory gate is affected.

---

## 16. Monitoring and review cadence

Certified assemblies MUST be reviewed:

- at least every 12 months;
- quarterly for ownership, open findings, exceptions, dependency status, and adoption signals;
- within 30 days of a relevant major design-system release;
- after a material accessibility, security, privacy, or production incident;
- when an underlying dependency is deprecated or materially changed;
- when user research or adoption data contradicts the assembly's assumptions.

Review outcomes are: retain, refine, re-certify, deprecate, or retire.

Recommended operating measures include:

- active adopting products;
- time to implement from the assembly;
- local divergence rate and reasons;
- defects and incidents attributable to the assembly;
- accessibility findings over time;
- exception count and age;
- completion, failure, recovery, and abandonment measures where privacy-safe telemetry exists;
- age since last evidence refresh.

Metrics inform decisions; adoption count alone does not prove quality.

---

## 17. Audit procedure

Auditors SHALL perform the following sequence:

1. Identify the assembly version, status, owner, scope, supported claims, and dependencies.
2. Confirm that the artifact is truly a reference assembly under Section 2.
3. Check metadata, required artifacts, links, and evidence freshness.
4. Trace each dependency to its governing specification and status.
5. Exercise every assembly-owned state and primary flow.
6. Execute the verification matrix appropriate to risk.
7. Record findings without modifying the implementation during evidence collection.
8. Apply mandatory gates.
9. Score the assembly and document rationale.
10. Agree finding owners and dates; route exceptions separately.
11. Re-test remediation and attach closure evidence.
12. Issue the final disposition and next review date.

Auditors MUST distinguish:

- **inherited defect** — originates in a dependency;
- **assembly defect** — originates in composition or orchestration;
- **product concern** — outside the reusable assembly contract;
- **standard gap** — no existing rule governs a consequential recurring decision.

A defect is recorded at its source and linked from every affected assembly. Assemblies MUST NOT duplicate ownership merely to make their local audit appear complete.

---

## 18. Baseline audit of current reference assemblies

The current Storybook reference assemblies are existing candidates, not certified assemblies, until audited under this standard.

The first refinement pass SHALL:

1. Inventory the current record list, record detail, dashboard, form, settings, and analytics assemblies.
2. Assign stable IDs, owners, lifecycle status, and dependencies.
3. Replace product-facing hard-coded presentation values with approved tokens or system props.
4. Establish a domain-real canonical scenario for each assembly.
5. Retain generic content only as an optional portability companion or mapping guide.
6. Identify and remove local recreations of existing components, composites, patterns, navigation systems, and layouts.
7. Add deterministic controls for all applicable required states.
8. Add accessibility, responsive, localization, resilience, security/privacy, and performance evidence.
9. Separate simulation scaffolding using the approved removable-harness convention.
10. Publish an audit record and remediation backlog for each assembly.
11. Certify assemblies individually; one passing example does not certify the collection.

Until these steps are complete, discoverable documentation MUST label the collection **candidate reference assemblies** rather than canonical or certified.

---

## 19. Pull-request checklist

### Proposal and ownership

- [ ] Reusable user problem and success measure are stated.
- [ ] Use and do-not-use boundaries are explicit.
- [ ] Owner and required reviewers are named.
- [ ] Duplication and promotion checks are complete.

### Architecture and implementation

- [ ] Applicable layout, pattern, navigation, component, and token sources are linked.
- [ ] Assembly-owned decisions are separated from inherited contracts.
- [ ] No unauthorized forks, raw presentation literals, or shadow components exist.
- [ ] Demonstration scaffolding is marked and removable.

### Behavior and content

- [ ] Required states are specified, reachable, and tested.
- [ ] Failure, partial, stale, duplicate, and unknown outcomes are handled where applicable.
- [ ] Canonical evidence uses realistic synthetic domain content and representative volume.
- [ ] Locale, time-zone, text-expansion, and RTL behavior are covered as applicable.

### Quality gates

- [ ] Build, types, lint, contracts, and automated tests pass.
- [ ] Manual keyboard and assistive-technology review is recorded.
- [ ] Responsive, theme, density, and visual regression evidence exists.
- [ ] Security/privacy, resilience, and performance evidence exists where applicable.
- [ ] Findings, exceptions, approvals, score, and next review date are recorded.

---

## 20. Decision record template

```markdown
### ADR-RA-000 — <decision title>

- Status: proposed | accepted | superseded | rejected
- Date: YYYY-MM-DD
- Owners: <names or teams>
- Context: <decision pressure and evidence>
- Options considered: <options and trade-offs>
- Decision: <what is now normative>
- Consequences: <benefits, costs, risks, and migration>
- Evidence: <links>
- Supersedes / superseded by: <ids or none>
```

---

## 21. Audit record template

```markdown
# Reference assembly audit — <name>

- Assembly ID/version:
- Commit/build:
- Audit date:
- Auditors:
- Supported scope tested:
- Previous audit:
- Next review due:

## Mandatory gates

| Gate | Pass/Fail | Evidence |
| --- | --- | --- |

## Score

| Domain | Score | Weight | Evidence and rationale |
| --- | ---: | ---: | --- |

## Findings

| ID | Criterion | Severity | Evidence | Owner | Due | Status |
| --- | --- | --- | --- | --- | --- | --- |

## Exceptions

| ID | Requirement | Compensating control | Owner | Approver | Expiry |
| --- | --- | --- | --- | --- | --- |

## Disposition

Candidate | Certified | Refinement required | Deprecated | Retired

Approvals:
```

---

## 22. References

Internal authoritative sources:

- `readme.md`
- `Design Principles.md`
- `Token Architecture.md`
- `AUDIT_STANDARD.md`
- `guidelines/composition-rules.card.html`
- `guidelines/promotion-policy.card.html`
- `guidelines/core-spec-standard.card.html`
- `guidelines/composite-spec-standard.card.html`
- `guidelines/interaction-pattern-spec-standard.card.html`
- `guidelines/layout-template-spec-standard.card.html`
- `guidelines/data-visualization-spec-standard.card.html`
- `guidelines/navigation-spec-standard.card.html`

External baselines:

- Web Content Accessibility Guidelines (WCAG) 2.2: <https://www.w3.org/TR/WCAG22/>
- WAI-ARIA Authoring Practices Guide: <https://www.w3.org/WAI/ARIA/apg/>
- Design Tokens Community Group reports: <https://www.designtokens.org/tr/>

The external links are baselines, not substitutes for applicable legal, contractual, security, privacy, or organizational requirements.

---

## 23. Approval record

| Role | Name | Decision | Date |
| --- | --- | --- | --- |
| Document owner | Unassigned | Pending | — |
| Design System Council | Unassigned | Pending | — |
| Accessibility Lead | Unassigned | Pending | — |
| Engineering Lead | Unassigned | Pending | — |
| Security/Privacy Lead | Unassigned | Pending | — |

This document remains **Proposed** until the required approvers are assigned and the approval record is complete.
