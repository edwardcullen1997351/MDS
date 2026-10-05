/* Timezone capability — added at 1.28.0, for DateTimePicker.

   Written because the principles (Dates, times and timezones) require an
   instant to be STORED in UTC and EDITED in the Site's zone, and nothing in
   the system could do that conversion. The alternative was a composite that
   emitted a local wall-clock string and told every consumer to convert it
   themselves — which is how the same offset bug gets written five times.

   No tz database is shipped. `Intl` already carries one in every browser
   this system supports, and it is the only copy guaranteed to agree with the
   platform's own formatting. We use it in both directions:

     instant → wall clock   Intl.DateTimeFormat with a timeZone, read back
                            as parts.
     wall clock → instant   guess the offset, apply it, then re-read the
                            result in the zone and correct once. Two passes
                            settle every case, because an offset error is at
                            most a few hours and re-reading detects it.

   Everything here takes and returns STRINGS — a UTC ISO instant ending in
   'Z', an ISO date, an 'HH:mm' time. A `Date` never leaves this file, for
   the same reason it never leaves date.js: it is a timestamp, and passing
   one around invites a local-offset read somewhere downstream. */

import { pad } from './date.js';

const cache = new Map();
const fmt = (zone, opts) => {
  const key = zone + JSON.stringify(opts);
  let f = cache.get(key);
  if (!f) { f = new Intl.DateTimeFormat('en-US', { timeZone: zone, ...opts }); cache.set(key, f); }
  return f;
};

export function isZone(zone) {
  if (typeof zone !== 'string' || !zone.includes('/')) return false;
  try { fmt(zone, { year: 'numeric' }).format(0); return true; } catch { return false; }
}

const PARTS = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false };

/* The wall clock a given instant shows in a given zone. */
export function zoneParts(instant, zone) {
  const t = Date.parse(instant);
  if (Number.isNaN(t) || !isZone(zone)) return { date: undefined, time: undefined };
  const p = {};
  for (const { type, value } of fmt(zone, PARTS).formatToParts(t)) p[type] = value;
  /* Intl renders midnight as hour 24 in some engines. */
  const h = p.hour === '24' ? '00' : p.hour;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${h}:${p.minute}` };
}

/* Minutes that `zone` is ahead of UTC at an instant. */
export function offsetAt(instant, zone) {
  const t = Date.parse(instant);
  if (Number.isNaN(t) || !isZone(zone)) return 0;
  const { date, time } = zoneParts(instant, zone);
  const asUtc = Date.parse(`${date}T${time}:00Z`);
  /* Rounded to the minute: the difference is a whole number of minutes by
     definition, and the seconds we dropped would otherwise skew it. */
  return Math.round((asUtc - Math.floor(t / 60000) * 60000) / 60000);
}

/**
 * The instant at which `zone` shows `date` at `time`.
 *
 * Returns `{ instant, shifted, ambiguous }`. The two flags are the honest
 * part: a wall clock is not a bijection with an instant.
 *  - `shifted`  — that clock time does not exist in that zone (the hour
 *                 skipped at spring forward). The instant returned is the
 *                 same moment the clock reaches next; the caller must say so
 *                 rather than pretend the entry was accepted verbatim.
 *  - `ambiguous`— that clock time happens twice (the hour repeated at
 *                 autumn back). The EARLIER of the two is returned, because
 *                 the first 02:30 is the one an operator writing a log means.
 */
export function instantFrom(date, time, zone) {
  if (!date || !time || !isZone(zone)) return { instant: undefined, shifted: false, ambiguous: false };
  const naive = `${date}T${time}:00Z`;
  const t0 = Date.parse(naive);
  if (Number.isNaN(t0)) return { instant: undefined, shifted: false, ambiguous: false };

  /* Pass 1: assume the offset that applies at the naive instant. Pass 2:
     re-read and correct, which fixes every case where the guess landed on
     the wrong side of a transition. */
  let guess = t0 - offsetAt(new Date(t0).toISOString(), zone) * 60000;
  guess = t0 - offsetAt(new Date(guess).toISOString(), zone) * 60000;

  const iso = (ms) => new Date(Math.floor(ms / 60000) * 60000).toISOString().replace(/:\d{2}\.\d{3}Z$/, ':00Z');
  const back = zoneParts(iso(guess), zone);
  const shifted = back.date !== date || back.time !== time;

  /* Ambiguous when an earlier candidate — one transition's worth back —
     shows the same wall clock. Checked at 30 and 60 minutes because
     transitions of both sizes exist. */
  let ambiguous = false;
  if (!shifted) {
    for (const mins of [60, 30]) {
      const earlier = guess - mins * 60000;
      const p = zoneParts(iso(earlier), zone);
      if (p.date === date && p.time === time) { guess = earlier; ambiguous = true; break; }
    }
  }
  return { instant: iso(guess), shifted, ambiguous };
}

/* The zone's own short name at that instant — 'CET' / 'CEST', not a fixed
   label, because the abbreviation changes with the season and a form that
   shows the wrong half of the year is worse than one showing none. */
export function zoneAbbr(zone, instant) {
  if (!isZone(zone)) return undefined;
  const at = instant || new Date().toISOString();
  const t = Date.parse(at);
  /* An hour field has to be requested alongside the zone name: asked for the
     name alone, some engines answer with the IANA id itself ("Europe/
     Amsterdam"), which is the zone, not a label a form can wear. */
  const part = fmt(zone, { hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short' })
    .formatToParts(t).find((p) => p.type === 'timeZoneName');
  const v = part && part.value;
  /* Accepted only if it reads as a LABEL a form can wear: a real
     abbreviation like CET or JST. Rejected: an IANA id (contains a slash), a
     sentence ("Central European Summer Time"), and — the case that shipped
     wrong — an engine's own offset rendering like "GMT+2", which is the same
     fact in a second notation. One notation for one fact, so anything
     offset-shaped falls through to the branch below. */
  if (v && !v.includes('/') && v.length <= 6 && !/^(GMT|UTC)/i.test(v)) return v;
  /* Otherwise a UTC offset, which is unambiguous and correct in both halves
     of the year: 'UTC+2', 'UTC+5:30', 'UTC'. Written the same way whatever
     the engine would have said. */
  const o = offsetAt(at, zone);
  if (o === 0) return 'UTC';
  const sign = o < 0 ? '-' : '+';
  const h = Math.floor(Math.abs(o) / 60);
  const m = Math.abs(o) % 60;
  return `UTC${sign}${h}${m ? `:${pad(m)}` : ''}`;
}

/* Now, as a UTC instant truncated to the minute — the precision this system
   edits in. */
export const nowInstant = () => {
  const n = new Date();
  return `${n.getUTCFullYear()}-${pad(n.getUTCMonth() + 1)}-${pad(n.getUTCDate())}T${pad(n.getUTCHours())}:${pad(n.getUTCMinutes())}:00Z`;
};
