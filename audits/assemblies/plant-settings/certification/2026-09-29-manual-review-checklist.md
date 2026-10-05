# Plant settings — manual certification checklist

- Assembly: `ra-plant-settings`
- Version: candidate 0.1.0
- Checklist date: 2026-09-29
- Automated evidence: passed (axe-core 0 violations, zero layout shift/overflow)
- Manual evidence: pending reviewer completion

## Keyboard and focus

- [ ] Tab navigation follows logical order: scope header actions, domain navigation list, main configuration panel, form controls, footer actions.
- [ ] Domain navigation buttons expose visible focus rings with `outline-offset: 1px`.
- [ ] Active section button correctly communicates `aria-current="page"`.
- [ ] Enter/Space activates domain switching without shifting page scroll position.
- [ ] Save operation triggers do not trap keyboard focus during `isSaving` pending state.
- [ ] Key rotation modal traps focus within dialog when open and restores focus to "Rotate webhook signing key" button upon dismissal.
- [ ] Escape key dismisses key rotation modal safely without executing rotation.

## Screen reader and announcements

- [ ] Page header and scope badges are announced in sequence.
- [ ] Navigation landmark has accessible label "Plant settings navigation" and list semantics (`role="list"`).
- [ ] All inputs, selects, and switches have explicit programmatic labels and helper text associations (`aria-describedby`).
- [ ] Operational status live region (`role="status"`, `aria-live="polite"`) announces:
  - Domain navigation transitions
  - Save pending, success, failure, and re-authentication states
  - Key rotation confirmation, pending KMS generation, and rollback execution
- [ ] Role badges in access control table announce role tier and active status.
- [ ] Connected services status table communicates latency and degradation warnings.

## Responsive, zoom, and text expansion

- [ ] Zero horizontal scrolling across 320px, 390px, 768px, and 1440px viewports.
- [ ] Sidebar collapses into a responsive horizontal/stacked list below 900px without losing active domain context.
- [ ] Action buttons stack vertically (`flex-direction: column-reverse`) on mobile viewports (≤640px) with full-width tap targets (min 44px height).
- [ ] In `stress-long-content`, long multi-plant director titles and 120-character webhook URLs wrap cleanly without table clipping or horizontal overflow.
- [ ] At 200% zoom, text remains legible without overlapping adjacent fieldsets or navigation items.
- [ ] At 400% zoom, main workspace content reflows into a single column.

## Security, privacy, and recovery

- [ ] Synthetic data only: no production credentials, real personal emails, or live secrets are rendered.
- [ ] Private key material is never rendered in default view; only public SHA-256 fingerprint is exposed.
- [ ] Key rotation requires explicit consequence acknowledgement and re-authentication passcode before dispatch.
- [ ] When key rotation fails, rollback execution is announced and previous key remains active.
- [ ] Save failure preserves all modified inputs on screen and allows immediate retry.
- [ ] Retention policy choices explicitly cite governed enterprise standards (`POL-AUD-12`, `POL-OPS-04`, `POL-SEC-08`, `POL-LEG-01`).

## Reviewer sign-off

| Review area | Reviewer | Result | Notes |
| --- | --- | --- | --- |
| Keyboard/focus | Pending | Pending |  |
| Screen reader | Pending | Pending |  |
| Zoom/reflow | Pending | Pending |  |
| Security/privacy | Pending | Pending |  |
| Domain/content | Pending | Pending |  |
