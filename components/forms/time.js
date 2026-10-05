/* Time maths for TimeField, in 'HH:mm' strings — the same reasoning as
   date.js: a wall-clock time is two integers, not an instant. It has no date
   and therefore no timezone, which is exactly why it composes with a
   DatePicker instead of being fused to one (Design Principles → Dates, times
   and timezones: the product builds the UTC instant from the two halves and
   the Site's zone, because only the product knows the Site).

   24-hour only. AM/PM is refused: 12:00 am is midnight to some readers and
   noon to others, and a plant whose shifts turn at 06:00, 14:00 and 22:00
   has no use for a convention that needs a suffix to be unambiguous. */

/* Re-exported, not redefined: two sibling modules exporting their own `pad`
   collide on import and only one survives. One definition, in date.js. */
export { pad } from './date.js';
import { pad } from './date.js';
export const toHm = (h, m) => `${pad(h)}:${pad(m)}`;

export function parseHm(s) {
  if (typeof s !== 'string') return null;
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const h = +m[1];
  const mi = +m[2];
  if (h > 23 || mi > 59) return null;
  return { h, m: mi };
}

/* What a human may TYPE. Named parseTypedTime rather than parseTyped so it
   cannot collide with date.js's date parser — a sibling module re-exporting
   the same name silently wins, and the loser's callers get the wrong parser.
   Digits without a separator are read the way an
   operator reads a clock — 412 is 04:12, 1412 is 14:12 — because that is how
   times are spoken and written on a shift sheet. `now` is accepted for the
   same reason `today` is in a date field. */
export function parseTypedTime(s, nowHm) {
  if (!s) return null;
  const t = s.trim().toLowerCase();
  if (t === 'now') return parseHm(nowHm);
  if (/^\d{1,2}$/.test(t)) { const h = +t; return h <= 23 ? { h, m: 0 } : null; }
  const digits = /^(\d{3,4})$/.exec(t);
  if (digits) {
    const d = digits[1];
    const h = +d.slice(0, d.length - 2);
    const mi = +d.slice(-2);
    return h <= 23 && mi <= 59 ? { h, m: mi } : null;
  }
  const dot = /^(\d{1,2})[.h](\d{2})$/.exec(t);
  if (dot) return parseHm(`${dot[1]}:${dot[2]}`);
  return parseHm(t);
}

export const minutesOf = (hm) => { const p = parseHm(hm); return p ? p.h * 60 + p.m : null; };

/* Steps CLAMP at the ends of the day rather than wrapping. A wrapping time
   field turns 23:50 + 20 min into 00:10, which in a shift log is the wrong
   day — and the field has no date with which to say so. */
export function addMinutes(hm, n, { min, max } = {}) {
  const cur = minutesOf(hm);
  if (cur == null) return hm;
  let next = cur + n;
  const lo = Math.max(0, minutesOf(min) ?? 0);
  const hi = Math.min(1439, minutesOf(max) ?? 1439);
  next = Math.max(lo, Math.min(hi, next));
  return toHm(Math.floor(next / 60), next % 60);
}

/* Snapped to the step, so ↑ from 04:07 with step 15 gives 04:15 rather than
   04:22 — the point of a step is to land on the grid it describes. */
export function stepFrom(hm, dir, step, bounds) {
  const cur = minutesOf(hm);
  if (cur == null) return hm;
  if (step <= 1) return addMinutes(hm, dir, bounds);
  const snapped = dir > 0 ? Math.floor(cur / step) * step + step : Math.ceil(cur / step) * step - step;
  return addMinutes(hm, snapped - cur, bounds);
}

export function nowHm() {
  const n = new Date();
  return toHm(n.getHours(), n.getMinutes());
}

/* Spoken, never displayed: "04:12" is read digit by digit by some screen
   readers, and "oh four twelve" is not a time anyone confirms confidently. */
export function spokenTime(hm) {
  const p = parseHm(hm);
  if (!p) return hm;
  return `${p.h} ${p.m === 0 ? "o'clock" : pad(p.m)}`;
}
