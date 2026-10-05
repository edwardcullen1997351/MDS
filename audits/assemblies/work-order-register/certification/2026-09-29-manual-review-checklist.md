# Work order register — manual certification checklist

- Assembly: `ra-work-order-register`
- Version: candidate 0.1.0
- Checklist date: 2026-09-29
- Automated evidence: passed
- Manual evidence: pending reviewer completion

## Keyboard and focus

- [ ] Search, area filter, state harness, and outcome harness are reachable and named.
- [ ] Row/card checkboxes have record-specific names and selection does not move focus unexpectedly.
- [ ] Compact pagination exposes first, nearby, and final page actions in logical order.
- [ ] Bulk delete requires two explicit activations and does not trap focus during pending state.
- [ ] Loading, offline, restricted, and stale states expose recovery/action controls in logical order.

## Screen reader and announcements

- [ ] Result count and selected-count changes are understandable without visual context.
- [ ] Live status announces filter changes, selected rows, pending deletion, success, failure, partial, restricted, and unknown outcomes.
- [ ] Empty results clearly describe recovery without implying missing authorization.
- [ ] Mobile/tablet card layout preserves the same core record identity, status, owner, date, and value information as the table.

## Responsive, zoom, and text expansion

- [ ] No horizontal scrolling at 320px, 390px, 768px, and 1440px.
- [ ] High-density compact pagination remains operable at tablet and mobile widths.
- [ ] Long work-order titles, owners, identifiers, dates, and values remain inspectable.
- [ ] 200% zoom preserves search, filters, selection, pagination, status, and actions.
- [ ] 400% reflow does not hide bulk selection or recovery controls.

## Security, privacy, and recovery

- [ ] Synthetic data only; no personal/customer/secret values are present.
- [ ] Bulk restricted state uses least-privilege language.
- [ ] Bulk failure confirms no destructive action was completed.
- [ ] Partial result identifies that only some selected records changed and preserves recovery context.
- [ ] Unknown outcome instructs users to verify the audit log before retrying.

## Reviewer sign-off

| Review area | Reviewer | Result | Notes |
| --- | --- | --- | --- |
| Keyboard/focus | Pending | Pending |  |
| Screen reader | Pending | Pending |  |
| Zoom/reflow | Pending | Pending |  |
| Security/privacy | Pending | Pending |  |
| Domain/content | Pending | Pending |  |
