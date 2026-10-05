# Production analytics — manual certification checklist

- Assembly: `ra-production-analytics`
- Version: candidate 0.1.0
- Checklist date: 2026-09-29
- Automated evidence: passed
- Manual evidence: pending reviewer completion

## Keyboard and focus

- [ ] Time-range Select is reachable, named, and updates all charts/tables consistently.
- [ ] Export action exposes pending, success, failure, restricted, and unknown outcomes without focus loss.
- [ ] Chart table alternatives are reachable by keyboard.
- [ ] Loading, offline, restricted, and stale states expose recovery/action controls in logical order.

## Screen reader and announcements

- [ ] Data-quality status is announced and explains complete, missing, partial, empty, and high-density scenarios.
- [ ] Export status is announced for pending, success, failure, restricted, and unknown outcomes.
- [ ] Area, bar, and line chart table alternatives expose the same measure/unit as the chart.
- [ ] Empty states clearly describe when telemetry is unavailable instead of implying zero production.

## Responsive, zoom, and text expansion

- [ ] No horizontal scrolling at 320px, 390px, 768px, and 1440px.
- [ ] Long labels remain inspectable in the synchronized tables.
- [ ] High-density scenario remains navigable without hidden primary actions.
- [ ] 200% zoom preserves time-range, export, status, charts, and tables.
- [ ] 400% reflow does not hide status or export controls.

## Security, privacy, and recovery

- [ ] Synthetic data only; no personal/customer/secret values are present.
- [ ] Export restricted state uses least-privilege language.
- [ ] Export failure confirms no file was downloaded.
- [ ] Unknown export instructs users to check the audit log before retrying.
- [ ] Export copy avoids sensitive telemetry payload disclosure.

## Reviewer sign-off

| Review area | Reviewer | Result | Notes |
| --- | --- | --- | --- |
| Keyboard/focus | Pending | Pending |  |
| Screen reader | Pending | Pending |  |
| Zoom/reflow | Pending | Pending |  |
| Security/privacy | Pending | Pending |  |
| Domain/content | Pending | Pending |  |
