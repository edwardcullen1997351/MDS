const pad = (n: number): string => String(n).padStart(2, '0');

const cache = new Map<string, Intl.DateTimeFormat>();
const getFmt = (zone: string, opts: Intl.DateTimeFormatOptions = {}): Intl.DateTimeFormat => {
  const key = zone + JSON.stringify(opts);
  let f = cache.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', { timeZone: zone, ...opts });
    cache.set(key, f);
  }
  return f;
};

export function isZone(zone?: string): boolean {
  if (typeof zone !== 'string' || !zone.includes('/')) return false;
  try {
    getFmt(zone, { year: 'numeric' }).format(0);
    return true;
  } catch {
    return false;
  }
}

const PARTS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};

/** The wall clock a given UTC instant shows in a given IANA zone. */
export function zoneParts(instant?: string, zone?: string): { date?: string; time?: string } {
  if (!instant || !zone || !isZone(zone)) return { date: undefined, time: undefined };
  const t = Date.parse(instant);
  if (Number.isNaN(t)) return { date: undefined, time: undefined };

  const p: Record<string, string> = {};
  for (const { type, value } of getFmt(zone, PARTS).formatToParts(t)) {
    p[type] = value;
  }
  const h = p.hour === '24' ? '00' : p.hour;
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${h}:${p.minute}` };
}

/** Minutes that `zone` is ahead of UTC at an instant. */
export function offsetAt(instant: string, zone: string): number {
  const t = Date.parse(instant);
  if (Number.isNaN(t) || !isZone(zone)) return 0;
  const { date, time } = zoneParts(instant, zone);
  if (!date || !time) return 0;
  const asUtc = Date.parse(`${date}T${time}:00Z`);
  return Math.round((asUtc - Math.floor(t / 60000) * 60000) / 60000);
}

export interface InstantResult {
  instant?: string;
  shifted: boolean;
  ambiguous: boolean;
}

/**
 * Calculates the UTC instant at which `zone` shows `date` at `time`.
 */
export function instantFrom(date?: string, time?: string, zone?: string): InstantResult {
  if (!date || !time || !zone || !isZone(zone)) {
    return { instant: undefined, shifted: false, ambiguous: false };
  }
  const naive = `${date}T${time}:00Z`;
  const t0 = Date.parse(naive);
  if (Number.isNaN(t0)) {
    return { instant: undefined, shifted: false, ambiguous: false };
  }

  let guess = t0 - offsetAt(new Date(t0).toISOString(), zone) * 60000;
  guess = t0 - offsetAt(new Date(guess).toISOString(), zone) * 60000;

  const iso = (ms: number) =>
    new Date(Math.floor(ms / 60000) * 60000).toISOString().replace(/:\d{2}\.\d{3}Z$/, ':00Z');

  const back = zoneParts(iso(guess), zone);
  const shifted = back.date !== date || back.time !== time;

  let ambiguous = false;
  if (!shifted) {
    for (const mins of [60, 30]) {
      const earlier = guess - mins * 60000;
      const p = zoneParts(iso(earlier), zone);
      if (p.date === date && p.time === time) {
        guess = earlier;
        ambiguous = true;
        break;
      }
    }
  }
  return { instant: iso(guess), shifted, ambiguous };
}

/**
 * Returns the short name or offset for the zone at a given instant (e.g. 'IST', 'UTC+5:30', 'CET').
 */
export function zoneAbbr(zone?: string, instant?: string): string | undefined {
  if (!zone || !isZone(zone)) return undefined;
  const at = instant || new Date().toISOString();
  const t = Date.parse(at);
  if (Number.isNaN(t)) return undefined;

  const part = getFmt(zone, { hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short' })
    .formatToParts(t)
    .find((p) => p.type === 'timeZoneName');
  const v = part && part.value;

  if (v && !v.includes('/') && v.length <= 6 && !/^(GMT|UTC)/i.test(v)) {
    return v;
  }

  const o = offsetAt(at, zone);
  if (o === 0) return 'UTC';
  const sign = o < 0 ? '-' : '+';
  const h = Math.floor(Math.abs(o) / 60);
  const m = Math.abs(o) % 60;
  return `UTC${sign}${h}${m ? `:${pad(m)}` : ''}`;
}

export const nowInstant = (): string => {
  const n = new Date();
  return `${n.getUTCFullYear()}-${pad(n.getUTCMonth() + 1)}-${pad(n.getUTCDate())}T${pad(
    n.getUTCHours()
  )}:${pad(n.getUTCMinutes())}:00Z`;
};
