// Shared token resolvers for the Meridian primitives.
// Every primitive takes token NAMES, never raw CSS values, and resolves them here.
//
// These resolvers are also the only validation the primitive layer has. A
// primitive is used more often than any component in the system, and a
// mistyped token name fails SILENTLY — `var(--text-secondry)` is valid CSS
// that resolves to nothing, so the property is simply dropped and the value
// inherits. That is invisible in review and nearly invisible on screen. So
// each resolver warns once per bad name rather than passing it through.

const warned = new Set();
function warnOnce(key, msg) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn('[Meridian] ' + msg);
}

const SPACE = ['0','px','half','1','2','3','4','5','6','7','8','10','12','16','20','24'];

/** space step -> var(--space-N). Unknown strings pass through ('auto', '50%', 'var(--x)'). */
export function sp(v) {
  if (v == null || v === false) return undefined;
  const k = String(v);
  return SPACE.indexOf(k) > -1 ? 'var(--space-' + k + ')' : k;
}

const COLOR_LITERAL = /^(#|rgb|hsl|oklch|var\(|transparent|currentColor|inherit|none)/;
/* The families a primitive may name. Anything outside them is either a typo
   or product code reaching past the semantic tier into the palette, which
   the token contract forbids. */
const COLOR_FAMILY = /^(text|surface|background|border|action|status|overlay|viz|focus)-/;

/** token name -> var(--token). Literal colours pass through. */
export function col(v) {
  if (!v) return undefined;
  if (COLOR_LITERAL.test(v)) return v;
  if (!COLOR_FAMILY.test(v)) {
    warnOnce('col:' + v, `primitives: "${v}" is not a semantic colour token. Expected one of the text-/surface-/background-/border-/action-/status-/overlay-/viz-/focus- families, a CSS colour, or a var(). An unknown name compiles to var(--${v}) and silently resolves to nothing.`);
  }
  return 'var(--' + v + ')';
}

const RADII = ['none','xs','sm','md','lg','xl','2xl','3xl','pill'];
export function rad(v) {
  if (v == null || v === false) return undefined;
  if (typeof v === 'number') return v;
  if (RADII.indexOf(v) > -1) return 'var(--radius-' + v + ')';
  if (!/^(var\(|calc\()/.test(v) && !/^\d/.test(v)) {
    warnOnce('rad:' + v, `primitives: radius "${v}" is not on the scale (${RADII.join(' / ')}).`);
  }
  return v;
}

/** elevation level 0-5 -> var(--elevation-N). */
export function shadow(v) {
  if (v == null || v === false) return undefined;
  if (typeof v === 'number') {
    if (v < 0 || v > 5 || !Number.isInteger(v)) {
      warnOnce('shadow:' + v, `primitives: elevation ${v} is off the ladder — it runs 0 to 5.`);
    }
    return 'var(--elevation-' + v + ')';
  }
  return col(v);
}

const BORDER_TONES = ['default','subtle','strong','hairline','control','focus','inverse','critical','warning','success','info'];
/** border tone -> hairline rule. */
export function hairline(v) {
  if (!v || v === 'none') return undefined;
  const tone = v === true ? 'default' : v;
  if (BORDER_TONES.indexOf(tone) === -1) {
    warnOnce('border:' + tone, `primitives: border tone "${tone}" is not a --border-* semantic. Expected one of ${BORDER_TONES.join(' / ')}.`);
  }
  return 'var(--border-width) solid var(--border-' + tone + ')';
}

/* Lowercase, and the casing is the whole point: only capital-initial exports
   reach window.<Namespace>, so as `TEXT_SIZES` this array was published beside
   the components and counted as one of them — 68 names on the namespace for 66
   components, with `FieldContext` (deliberate, documented, read by nine
   controls) and this (neither) making up the difference. Every other resolver
   in this file is already lowercase for exactly this reason. Renamed at 1.27.5
   so the export count and the component count are the same number. */
export const textSizes = ['2xs','xs','sm','base','md','lg','xl','2xl','3xl','4xl','5xl','6xl'];
export function fontSize(v) {
  if (!v) return undefined;
  if (textSizes.indexOf(v) > -1) return 'var(--text-' + v + ')';
  if (/^display-(sm|md|lg|xl)$/.test(v)) return 'var(--' + v + ')';
  if (!/^(var\(|calc\()/.test(v) && !/^\d/.test(v)) {
    warnOnce('size:' + v, `primitives: text size "${v}" is not on the scale (${textSizes.join(' / ')} or display-sm|md|lg|xl).`);
  }
  return v;
}

/* Margin props on a Box contradict the system's own layout rule (gaps, not
   margins) and are kept only because the console kit still uses a few. They
   warn instead of being removed: removing them would break a consumer, and
   silently accepting them would keep teaching the wrong pattern. */
export function deprecatedMargin(props) {
  const used = ['m','mx','my','mt','mr','mb','ml'].filter((k) => props[k] != null);
  if (!used.length) return;
  warnOnce('margin:' + used.join(','), `Box: margin props (${used.join(', ')}) are deprecated. Space siblings with the parent's gap — Stack gap, Grid gap, or Box gap — not with margins on the children. Element margins collapse unpredictably, and they break when a sibling is reordered or deleted, which is exactly what layout tooling does.`);
}
