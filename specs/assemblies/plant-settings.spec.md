# Plant settings reference assembly

```yaml
id: ra-plant-settings
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
last_reviewed: 2026-09-29
next_review_due: 2026-10-29
open_items: 2
```

## Purpose and boundary

Use this assembly for permission-sensitive plant configuration divided into stable categories. Do not use it for personal preferences mixed with system policy or for secrets displayed to the browser.

Outcome: an authorized administrator can understand scope and consequence, change one settings domain, and obtain an auditable success or recovery result.

## Dependencies

- Sidebar layout and approved local-navigation system
- Card, Table, Select, Input, Switch, Badge, Button, Checkbox, EmptyState
- Explicit save, confirmed action, asynchronous action, and recoverable failure patterns

## Assembly-owned contract

- Navigation state and active section are keyboard-operable, deep-linkable, and named.
- Each settings domain saves independently and retains unsaved input after failure.
- Authorization is enforced server-side and represented with restricted states.
- Secret material is never rendered; only approved metadata such as a fingerprint may be shown.
- Key rotation requires re-authentication, consequence confirmation, one-time delivery, and an audit event.
- Retention choices come from an approved records policy, not unsupported compliance claims.

## Required states

Default, dirty, saving, saved, failed, restricted section, session expired, concurrent change, key rotation pending/failed/unknown, integration degraded, and policy unavailable.

## Responsive and accessibility

The navigation becomes an approved narrow-width pattern without losing active context. Every field/group is labeled and described; save results are announced; focus remains in the affected section. Table surfaces feature wrapping and horizontal scrolling boundaries with zero outer-viewport overflow.

## Candidate budgets

- Section switch feedback under 100 ms for loaded settings.
- Interaction response p95 under 150 ms on the approved reference workstation.
- Maximum supported dataset 50 active roles and 20 integrated pipelines.
- One save in flight per settings domain.
- Service health refresh does not interrupt settings entry.

## Certification evidence

- `npm run certify:plant-settings`
- `npm run stress:plant-settings`
- `audits/assemblies/plant-settings/certification/2026-09-29-technical-gate-evidence.json`
- `audits/assemblies/plant-settings/certification/2026-09-29-screen-stress-evidence.json`

## Adoption rules

Adopters replace authorization, configuration, rotation, service-health, and audit adapters. They retain permission, secret-handling, concurrency, recovery, and records-policy contracts. The assembly owns no business authorization; the server remains authoritative.
