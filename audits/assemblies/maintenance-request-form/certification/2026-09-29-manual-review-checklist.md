# Maintenance request form — manual certification checklist

- Assembly: `ra-maintenance-request-form`
- Version: candidate 0.1.0
- Checklist date: 2026-09-29
- Automated evidence: passed
- Manual evidence: pending reviewer completion

## Keyboard and focus

- [ ] Tab order follows title, classification, cost, switches, cancel, save draft, submit.
- [ ] Focus indicator is visible on all controls at default and high zoom.
- [ ] Validation failure places the user at the first actionable problem or makes the problem immediately discoverable.
- [ ] Save draft and submit loading states do not trap focus.
- [ ] Retry, request access, and stale-state controls are reachable in assembly-state views.

## Screen reader and announcements

- [ ] Request title label, required state, helper text, and error are announced.
- [ ] Maintenance class Select has a clear accessible name.
- [ ] Estimated cost label and validation error are announced.
- [ ] Dispatch switches announce name, state, and description.
- [ ] Live status announces draft, submit, partial, failed, and unknown outcomes.

## Responsive, zoom, and text expansion

- [ ] No horizontal scrolling at 320px, 390px, 768px, and 1440px.
- [ ] Long request title remains readable and editable.
- [ ] Action buttons remain reachable and do not overlap at mobile widths.
- [ ] 200% zoom preserves field labels, actions, status, and recovery controls.
- [ ] 400% reflow does not hide primary actions.

## Security, privacy, and recovery

- [ ] Synthetic data only; no personal/customer/secret values are present.
- [ ] Failed submit preserves all entered values.
- [ ] Unknown submit instructs the user to check the maintenance queue before retrying.
- [ ] Partial dispatch explains which side effect succeeded and which needs retry.
- [ ] Draft failure preserves entries locally.
- [ ] Cancel/reset behavior is accepted as safe or routed to remediation.

## Reviewer sign-off

| Review area | Reviewer | Result | Notes |
| --- | --- | --- | --- |
| Keyboard/focus | Pending | Pending |  |
| Screen reader | Pending | Pending |  |
| Zoom/reflow | Pending | Pending |  |
| Security/privacy | Pending | Pending |  |
| Domain/content | Pending | Pending |  |
