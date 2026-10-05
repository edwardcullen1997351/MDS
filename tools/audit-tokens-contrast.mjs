import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const TOKENS_PATH = path.join(ROOT_DIR, 'tokens.json');

const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf-8'));

// Helper to resolve reference strings like "{primitive.color.blue600}"
const allTokensFlat = new Map();
function flatten(obj, prefix = '') {
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith('$')) continue;
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && v.$value !== undefined) {
      allTokensFlat.set(p, v.$value);
    } else if (v && typeof v === 'object') {
      flatten(v, p);
    }
  }
}
flatten(tokens.primitive, 'primitive');
flatten(tokens.semantic, 'semantic');
flatten(tokens.component, 'component');

// Dark theme overrides
const darkOverrides = new Map();
if (tokens.theme?.dark) {
  for (const [k, v] of Object.entries(tokens.theme.dark)) {
    darkOverrides.set(k, v.$value);
  }
}

function resolveValue(val, isDark = false, depth = 0) {
  if (depth > 20) return val;
  if (typeof val !== 'string') return val;
  const match = val.match(/^\{([^}]+)\}$/);
  if (!match) return val;
  const ref = match[1];

  let resolvedRefVal;
  if (isDark) {
    // Check dark overrides: e.g. "text.textPrimary" or "semantic.text.textPrimary" or "--text-primary"
    for (const [dk, dv] of darkOverrides.entries()) {
      if (ref.endsWith(dk) || dk.endsWith(ref) || ref === dk) {
        resolvedRefVal = dv;
        break;
      }
    }
  }
  if (!resolvedRefVal) {
    if (allTokensFlat.has(ref)) {
      resolvedRefVal = allTokensFlat.get(ref);
    } else {
      // Search partial match
      for (const [k, v] of allTokensFlat.entries()) {
        if (k.endsWith(ref) || ref.endsWith(k)) {
          resolvedRefVal = v;
          break;
        }
      }
    }
  }
  if (!resolvedRefVal) return val;
  return resolveValue(resolvedRefVal, isDark, depth + 1);
}

function parseHex(hex) {
  if (!hex || typeof hex !== 'string') return null;
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length === 6) {
    const num = parseInt(clean, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  if (clean.length === 8) {
    const num = parseInt(clean.slice(0, 6), 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  return null;
}

function parseRgb(str, underlay = [255, 255, 255]) {
  if (!str || typeof str !== 'string') return null;
  const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
  if (m) {
    const r = parseInt(m[1]);
    const g = parseInt(m[2]);
    const b = parseInt(m[3]);
    const a = m[4] !== undefined ? parseFloat(m[4]) : 1;
    if (a < 1) {
      return [
        Math.round(r * a + underlay[0] * (1 - a)),
        Math.round(g * a + underlay[1] * (1 - a)),
        Math.round(b * a + underlay[2] * (1 - a)),
      ];
    }
    return [r, g, b];
  }
  return parseHex(str);
}

function luminance([r, g, b]) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function contrast(rgb1, rgb2) {
  if (!rgb1 || !rgb2) return null;
  const l1 = luminance(rgb1);
  const l2 = luminance(rgb2);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return Number(ratio.toFixed(2));
}

console.log('====================================================');
console.log('   PHASE 1: DESIGN TOKEN MATHEMATICAL CONTRAST AUDIT');
console.log('====================================================\n');

const testMatrix = [
  // 1. Text Primary on Base Surfaces
  { fg: 'semantic.text.textPrimary', bg: 'semantic.background.backgroundPage', type: 'text', min: 4.5, name: 'Text Primary on Background Page' },
  { fg: 'semantic.text.textPrimary', bg: 'semantic.surface.surfaceCard', type: 'text', min: 4.5, name: 'Text Primary on Surface Card' },
  { fg: 'semantic.text.textPrimary', bg: 'semantic.surface.surfaceRaised', type: 'text', min: 4.5, name: 'Text Primary on Surface Raised' },
  { fg: 'semantic.text.textPrimary', bg: 'semantic.surface.surfaceSunken', type: 'text', min: 4.5, name: 'Text Primary on Surface Sunken' },

  // 2. Text Secondary on Base Surfaces
  { fg: 'semantic.text.textSecondary', bg: 'semantic.background.backgroundPage', type: 'text', min: 4.5, name: 'Text Secondary on Background Page' },
  { fg: 'semantic.text.textSecondary', bg: 'semantic.surface.surfaceCard', type: 'text', min: 4.5, name: 'Text Secondary on Surface Card' },

  // 3. Text Tertiary on Base Surfaces (Large text/UI or subtle labels)
  { fg: 'semantic.text.textTertiary', bg: 'semantic.background.backgroundPage', type: 'text', min: 4.5, name: 'Text Tertiary on Background Page' },
  { fg: 'semantic.text.textTertiary', bg: 'semantic.surface.surfaceCard', type: 'text', min: 4.5, name: 'Text Tertiary on Surface Card' },

  // 4. Text Inverse on Inverse Surface
  { fg: 'semantic.text.textInverse', bg: 'semantic.background.backgroundInverse', type: 'text', min: 4.5, name: 'Text Inverse on Background Inverse' },
  { fg: 'semantic.text.textInverse', bg: 'semantic.surface.surfaceInverse', type: 'text', min: 4.5, name: 'Text Inverse on Surface Inverse' },

  // 5. Links
  { fg: 'semantic.text.textLink', bg: 'semantic.background.backgroundPage', type: 'text', min: 4.5, name: 'Text Link on Background Page' },
  { fg: 'semantic.text.textLink', bg: 'semantic.surface.surfaceCard', type: 'text', min: 4.5, name: 'Text Link on Surface Card' },

  // 6. Action Solid (Buttons)
  { fg: 'semantic.action.actionOnSolid', bg: 'semantic.action.actionSolid', type: 'text', min: 4.5, name: 'Action On-Solid (Text) on Action Solid (Button Fill)' },
  { fg: 'semantic.action.actionOnSolid', bg: 'semantic.action.actionSolidHover', type: 'text', min: 4.5, name: 'Action On-Solid (Text) on Action Solid Hover' },
  { fg: 'semantic.action.actionText', bg: 'semantic.action.actionSoft', type: 'text', min: 4.5, name: 'Action Text on Action Soft Background' },

  // 7. Status & Feedback (Text on soft backgrounds)
  { fg: 'semantic.success.statusSuccessText', bg: 'semantic.success.statusSuccessSoft', type: 'text', min: 4.5, name: 'Success Text on Success Soft Background' },
  { fg: 'semantic.warning.statusWarningText', bg: 'semantic.warning.statusWarningSoft', type: 'text', min: 4.5, name: 'Warning Text on Warning Soft Background' },
  { fg: 'semantic.critical.statusCriticalText', bg: 'semantic.critical.statusCriticalSoft', type: 'text', min: 4.5, name: 'Critical Text on Critical Soft Background' },
  { fg: 'semantic.info.statusInfoText', bg: 'semantic.info.statusInfoSoft', type: 'text', min: 4.5, name: 'Info Text on Info Soft Background' },
  { fg: 'semantic.neutral.statusNeutralText', bg: 'semantic.neutral.statusNeutralSoft', type: 'text', min: 4.5, name: 'Neutral Text on Neutral Soft Background' },

  // 8. Status Solid (Buttons / Badges)
  { fg: 'semantic.action.actionOnSolid', bg: 'semantic.critical.statusCriticalSolid', type: 'text', min: 4.5, name: 'On-Solid Text on Critical Solid Fill' },

  // 9. UI Boundaries (WCAG 1.4.11 >= 3.0:1)
  { fg: 'semantic.border.borderControl', bg: 'semantic.background.backgroundPage', type: 'ui', min: 3.0, name: 'Border Control against Background Page' },
  { fg: 'semantic.border.borderControl', bg: 'semantic.surface.surfaceCard', type: 'ui', min: 3.0, name: 'Border Control against Surface Card' },

  // 10. Focus Ring Non-Text Contrast (WCAG 2.4.13 >= 3.0:1)
  { fg: 'semantic.focus.focusRingColor', bg: 'semantic.background.backgroundPage', type: 'focus', min: 3.0, name: 'Focus Ring against Background Page' },
  { fg: 'semantic.focus.focusRingColor', bg: 'semantic.surface.surfaceCard', type: 'focus', min: 3.0, name: 'Focus Ring against Surface Card' },
  { fg: 'semantic.critical.statusCriticalSolid', bg: 'semantic.background.backgroundPage', type: 'focus', min: 3.0, name: 'Focus Ring Critical against Background Page' }
];

const results = { light: [], dark: [] };
let violations = [];

for (const mode of ['light', 'dark']) {
  const isDark = mode === 'dark';
  console.log(`\n================== THEME: ${mode.toUpperCase()} ==================`);

  for (const pair of testMatrix) {
    let rawFg = allTokensFlat.get(pair.fg);
    let rawBg = allTokensFlat.get(pair.bg);

    if (isDark) {
      const fgKey = pair.fg.split('.').pop();
      const bgKey = pair.bg.split('.').pop();
      if (darkOverrides.has(fgKey)) rawFg = darkOverrides.get(fgKey);
      if (darkOverrides.has(bgKey)) rawBg = darkOverrides.get(bgKey);
    }

    if (!rawFg || !rawBg) {
      console.warn(`[MISSING TOKEN] ${pair.name}: fg (${pair.fg})=` + rawFg + ` bg (${pair.bg})=` + rawBg);
      continue;
    }

    const resolvedFg = resolveValue(rawFg, isDark);
    const resolvedBg = resolveValue(rawBg, isDark);
    const underlay = isDark ? [20, 24, 29] : [255, 255, 255];
    const rgbBg = parseRgb(resolvedBg, underlay);
    const rgbFg = parseRgb(resolvedFg, rgbBg || underlay);

    const ratio = contrast(rgbFg, rgbBg);
    const passed = ratio ? ratio >= pair.min : false;

    const record = {
      mode,
      name: pair.name,
      fgToken: pair.fg,
      bgToken: pair.bg,
      resolvedFg,
      resolvedBg,
      ratio,
      minRequired: pair.min,
      type: pair.type,
      passed
    };

    results[mode].push(record);

    if (!passed) {
      const severity = ratio < 3.0 ? 'P0 (Blocker)' : 'P1 (High)';
      violations.push({ ...record, severity });
      console.log(`  ❌ [${severity}] ${pair.name}: ${ratio}:1 (Required >= ${pair.min}:1)`);
      console.log(`      FG [${pair.fg}]: ${resolvedFg}`);
      console.log(`      BG [${pair.bg}]: ${resolvedBg}`);
    } else {
      console.log(`  ✓ [PASS] ${pair.name}: ${ratio}:1 (>= ${pair.min}:1)`);
    }
  }
}

// Sizing & Geometry Tokens
console.log('\n================== GEOMETRY & TARGET SIZING TOKENS ==================');
const geometryTokens = [
  { path: 'semantic.focus.focusRingWidth', expected: '>= 2px', minPx: 2, desc: 'Focus Ring Width (WCAG 2.4.13 area requirement)' },
  { path: 'semantic.focus.focusOffset', expected: '>= 2px', minPx: 2, desc: 'Focus Ring Offset (WCAG 2.4.13 clearance)' },
  { path: 'semantic.control.targetTouch', expected: '>= 44px (AAA) or >= 24px (AA)', minPx: 24, desc: 'Touch Target Minimum (WCAG 2.5.8 AA)' },
  { path: 'semantic.control.targetPointer', expected: '>= 24px (AA)', minPx: 24, desc: 'Pointer Target Minimum (WCAG 2.5.8 AA)' },
  { path: 'semantic.density.controlHSm', expected: '>= 24px', minPx: 24, desc: 'Control Height SM (WCAG 2.5.8 AA)' },
  { path: 'semantic.density.controlHMd', expected: '>= 32px', minPx: 32, desc: 'Control Height MD' },
  { path: 'semantic.density.controlHLg', expected: '>= 40px', minPx: 40, desc: 'Control Height LG' }
];

for (const g of geometryTokens) {
  const raw = allTokensFlat.get(g.path);
  const resolved = resolveValue(raw, false);
  const num = parseFloat(resolved);
  const pass = !isNaN(num) && num >= g.minPx;
  if (pass) {
    console.log(`  ✓ [PASS] ${g.desc} [${g.path}]: ${resolved} (Expected ${g.expected})`);
  } else {
    console.log(`  ❌ [P1] ${g.desc} [${g.path}]: ${resolved} (Below required ${g.expected})`);
    violations.push({
      mode: 'all',
      name: g.desc,
      token: g.path,
      value: resolved,
      expected: g.expected,
      severity: 'P1 (High)'
    });
  }
}

console.log('\n====================================================');
console.log(`TOTAL TOKEN AUDIT VIOLATIONS: ${violations.length}`);
console.log('====================================================');

const outDir = path.join(ROOT_DIR, 'audits');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'token-contrast-results.json'), JSON.stringify({ results, violations }, null, 2));
