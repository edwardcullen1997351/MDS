/* Date maths for DatePicker, in ISO strings — never Date objects.

   A `Date` is a timestamp, and every timestamp has a timezone. `new Date('2026-09-05')`
   parses as UTC midnight, `new Date(2026, 8, 5)` as local midnight, and
   `.toISOString()` on the second gives 2026-09-04 anywhere west of Greenwich.
   That is the classic off-by-one: a shift logged on the 5th filed against the
   4th, silently, for half the world's users. A calendar date is not an
   instant — it is three integers — so it stays a 'YYYY-MM-DD' string from the
   input, through the value, to the API.

   The one place a Date is unavoidable is the weekday of a given date, and it
   is built in UTC and read in UTC so no local offset can enter. */

export const pad = (n) => String(n).padStart(2, '0');
export const toIso = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

export function parseIso(s) {
  if (typeof s !== 'string') return null;
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s.trim());
  if (!m) return null;
  const y = +m[1];
  const mo = +m[2];
  const d = +m[3];
  if (mo < 1 || mo > 12 || d < 1 || d > daysInMonth(y, mo)) return null;
  return { y, m: mo, d };
}

/* What a human may TYPE. ISO and compact ISO only — slash formats are
   deliberately refused: 05/09/2026 is two different days depending on where
   the reader is from, and a plant that runs on shift boundaries cannot carry
   that ambiguity. `today` and `yesterday` are accepted because operators
   reach for them constantly and neither is ambiguous. */
export function parseTyped(s, today) {
  if (!s) return null;
  const t = s.trim().toLowerCase();
  if (t === 'today') return today;
  if (t === 'yesterday') return addDays(today, -1);
  const compact = /^(\d{4})(\d{2})(\d{2})$/.exec(t);
  if (compact) return parseIso(`${compact[1]}-${compact[2]}-${compact[3]}`);
  return parseIso(t);
}

export function daysInMonth(y, m) {
  return [31, (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

/* Monday = 0 by default: ISO 8601 weeks, and the site this system was written
   for runs Monday shifts. weekStartsOn shifts the whole grid, header included. */
export function weekdayIndex(iso, weekStartsOn = 1) {
  const p = parseIso(iso);
  if (!p) return 0;
  const dow = new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay(); /* 0 = Sunday */
  return (dow - weekStartsOn + 7) % 7;
}

export function addDays(iso, n) {
  const p = parseIso(iso);
  if (!p) return iso;
  const t = new Date(Date.UTC(p.y, p.m - 1, p.d));
  t.setUTCDate(t.getUTCDate() + n);
  return toIso(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}

export function addMonths(iso, n) {
  const p = parseIso(iso);
  if (!p) return iso;
  const total = (p.y * 12 + (p.m - 1)) + n;
  const y = Math.floor(total / 12);
  const m = (total % 12) + 1;
  /* 31 Mar − 1 month is 28 Feb, not 3 Mar: clamping is what a month-stepping
     calendar means, and rolling over skips a month in the grid. */
  return toIso(y, m, Math.min(p.d, daysInMonth(y, m)));
}

export const cmp = (a, b) => (a === b ? 0 : a < b ? -1 : 1);
export const isBefore = (a, b) => !!a && !!b && a < b;
export const inRange = (iso, from, to) => !!from && !!to && iso >= from && iso <= to;

export function todayIso() {
  const n = new Date();
  return toIso(n.getFullYear(), n.getMonth() + 1, n.getDate());
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const monthName = (m) => MONTHS[m - 1];
export const weekdayNames = (weekStartsOn = 1) => Array.from({ length: 7 }, (_, i) => DAYS[(i + weekStartsOn) % 7]);

/* The announced name of a day cell. Spoken, never displayed — the grid shows
   a bare number, and "5" alone tells a screen-reader user nothing. */
export function spokenDate(iso) {
  const p = parseIso(iso);
  if (!p) return iso;
  const dow = DAYS[new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay()];
  return `${dow} ${p.d} ${monthName(p.m)} ${p.y}`;
}

/* The 6×7 grid for a month: always six rows, so the panel never changes
   height between months — a calendar that grows a row in March moves the
   controls under the pointer that is about to click one. */
export function monthGrid(y, m, weekStartsOn = 1) {
  const first = toIso(y, m, 1);
  const lead = weekdayIndex(first, weekStartsOn);
  const start = addDays(first, -lead);
  return Array.from({ length: 42 }, (_, i) => {
    const iso = addDays(start, i);
    const p = parseIso(iso);
    return { iso, day: p.d, outside: p.m !== m || p.y !== y };
  });
}
