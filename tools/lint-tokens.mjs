import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const TOKENS_JSON_PATH = path.join(ROOT_DIR, 'tokens.json');

if (!fs.existsSync(TOKENS_JSON_PATH)) {
  console.error('Error: tokens.json not found. Run "node tools/build-tokens.mjs" first.');
  process.exit(1);
}

const tokens = JSON.parse(fs.readFileSync(TOKENS_JSON_PATH, 'utf-8'));
const errors = [];
const warnings = [];

// Build flat index of all tokens in tokens.json
const allPaths = new Set();
const pathTierMap = new Map();
const tokenDataMap = new Map();

function indexTokens(obj, currentPath = '') {
  for (const [key, val] of Object.entries(obj)) {
    if (key.startsWith('$')) continue;
    const nextPath = currentPath ? `${currentPath}.${key}` : key;
    if (val && typeof val === 'object' && val.$value !== undefined) {
      allPaths.add(nextPath);
      const tier = nextPath.split('.')[0];
      pathTierMap.set(nextPath, tier);
      tokenDataMap.set(nextPath, val);
    } else if (val && typeof val === 'object') {
      indexTokens(val, nextPath);
    }
  }
}

indexTokens(tokens.primitive, 'primitive');
indexTokens(tokens.semantic, 'semantic');
indexTokens(tokens.component, 'component');

// Helper to extract references {tier.category.name}
function extractReferences(valStr) {
  if (typeof valStr !== 'string') return [];
  const matches = valStr.match(/\{([^}]+)\}/g);
  if (!matches) return [];
  return matches.map(m => m.slice(1, -1));
}

// Approved primitive composite aliases (shorthands/series that alias other primitives or semantic tokens)
const APPROVED_PRIMITIVE_COMPOSITES = new Set([
  'primitive.color.viz1', 'primitive.color.viz2', 'primitive.color.viz3',
  'primitive.color.viz4', 'primitive.color.viz5', 'primitive.color.viz6',
  'primitive.typography.fontDisplay', 'primitive.typography.paragraphGap',
  'primitive.typography.paragraphGapTight', 'primitive.typography.paragraphGapLoose',
  'primitive.typography.codeFont', 'primitive.typography.codeInlineBackground',
  'primitive.typography.codeBlockPad',
  'primitive.border.borderHairline', 'primitive.border.borderHairlineSubtle',
  'primitive.border.borderHairlineStrong', 'primitive.border.borderFocusRing',
  'primitive.border.borderDashed', 'primitive.border.dividerInset',
  'primitive.iconography.iconGap',
  'primitive.motion.transitionControl', 'primitive.motion.transitionTint',
  'primitive.motion.transitionLayer', 'primitive.motion.transitionDialog',
  'primitive.motion.animFadeIn', 'primitive.motion.animFadeOut',
  'primitive.motion.animRiseIn', 'primitive.motion.animDropIn',
  'primitive.motion.animSlideInRight', 'primitive.motion.animSlideInLeft',
  'primitive.motion.animSlideInUp', 'primitive.motion.animIndeterminate',
  'primitive.motion.animSkeletonSweep',
  'primitive.layout.gridGutter', 'primitive.layout.gridMargin'
]);

// 1. Lint Primitive Tier
for (const [category, group] of Object.entries(tokens.primitive || {})) {
  for (const [tokenName, tokenData] of Object.entries(group)) {
    const fullPath = `primitive.${category}.${tokenName}`;
    const val = String(tokenData.$value);
    const refs = extractReferences(val);

    // Primitives must not reference anything unless they are approved composites
    if (refs.length > 0 && !APPROVED_PRIMITIVE_COMPOSITES.has(fullPath)) {
      errors.push(`[Tier 1 Violation] Primitive token '${fullPath}' contains references: ${refs.join(', ')}. Primitives must be literal values.`);
    }

    // Grey ramp spelling check
    if (tokenName.toLowerCase().includes('gray')) {
      errors.push(`[Naming Standard] Primitive token '${fullPath}' uses 'gray'. Spelling must be 'grey'.`);
    }
  }
}

// 2. Lint Semantic Tier
for (const [category, group] of Object.entries(tokens.semantic || {})) {
  for (const [tokenName, tokenData] of Object.entries(group)) {
    const fullPath = `semantic.${category}.${tokenName}`;
    const val = String(tokenData.$value);
    const refs = extractReferences(val);

    // Semantic tokens must not reference component tokens
    for (const ref of refs) {
      if (ref.startsWith('component.')) {
        errors.push(`[One-Direction Violation] Semantic token '${fullPath}' references component token '${ref}'. Cross-tier references must only point upward.`);
      }
      if (!allPaths.has(ref)) {
        errors.push(`[Unresolved Reference] Semantic token '${fullPath}' references non-existent token '${ref}'.`);
      }
    }

    // Literals in tier 2 must have tier2Literal extension or be geometric
    if (refs.length === 0 && tokenData.$type === 'color') {
      const isAllowedLiteral = tokenData.$extensions?.['com.meridian.tier2Literal'] === true;
      if (!isAllowedLiteral) {
        warnings.push(`[Tier 2 Color Literal] Semantic color token '${fullPath}' holds a raw color literal without '$extensions["com.meridian.tier2Literal"]'.`);
      }
    }

    // Forbidden abbreviations
    if (/(?:^|[a-z])Bg(?:[A-Z]|$)/.test(tokenName)) {
      errors.push(`[Naming Standard] Semantic token '${fullPath}' uses forbidden abbreviation 'bg'. Use 'background'.`);
    }
  }
}

// 3. Lint Component Tier
for (const [componentName, group] of Object.entries(tokens.component || {})) {
  for (const [tokenName, tokenData] of Object.entries(group)) {
    const fullPath = `component.${componentName}.${tokenName}`;
    const val = String(tokenData.$value);
    const refs = extractReferences(val);

    // Component tokens must not reference component tokens
    for (const ref of refs) {
      if (ref.startsWith('component.')) {
        errors.push(`[Peer Reference Violation] Component token '${fullPath}' references peer component token '${ref}'. Components must share semantic tokens, never component tokens.`);
      }

      // Component tokens referencing primitive color tokens is a violation (breaks theming)
      if (ref.startsWith('primitive.color.')) {
        errors.push(`[Theme Bypass Violation] Component token '${fullPath}' references primitive color '${ref}'. Color references in tier 3 must use semantic tokens.`);
      }

      if (!allPaths.has(ref)) {
        errors.push(`[Unresolved Reference] Component token '${fullPath}' references non-existent token '${ref}'.`);
      }
    }

    // Tier 3 permits no color literals (must reference semantic layer)
    if (tokenData.$type === 'color' && refs.length === 0 && val !== 'transparent' && val !== 'currentColor') {
      if (/^#(?:[0-9a-fA-F]{3,8})$/.test(val) || val.startsWith('rgb(') || val.startsWith('rgba(')) {
        errors.push(`[Tier 3 Color Literal Violation] Component token '${fullPath}' holds a raw color literal '${val}'. Colors in tier 3 must reference semantic tokens.`);
      }
    }

    // Forbidden abbreviations
    if (/(?:^|[a-z])Bg(?:[A-Z]|$)/.test(tokenName)) {
      errors.push(`[Naming Standard] Component token '${fullPath}' uses forbidden abbreviation 'bg'. Use 'background'.`);
    }
  }
}

// 4. Lint Theme Dark Overrides
for (const [tokenName, tokenData] of Object.entries(tokens.theme?.dark || {})) {
  const val = String(tokenData.$value);
  const refs = extractReferences(val);
  for (const ref of refs) {
    if (!allPaths.has(ref)) {
      errors.push(`[Unresolved Reference in Theme Dark] '${tokenName}' references non-existent token '${ref}'.`);
    }
  }
}

// Report
console.log(`\n=== Meridian Token Lint Report ===`);
console.log(`Audited ${allPaths.size} total tokens across 3 tiers + theme overrides.`);

if (warnings.length > 0) {
  console.log(`\nWarnings (${warnings.length}):`);
  for (const w of warnings) {
    console.warn(`  ⚠️  ${w}`);
  }
}

if (errors.length > 0) {
  console.log(`\nErrors (${errors.length}):`);
  for (const e of errors) {
    console.error(`  ❌ ${e}`);
  }
  console.log(`\nToken verification FAILED with ${errors.length} errors.\n`);
  process.exit(1);
} else {
  console.log(`\n✓ Token verification PASSED (0 errors).\n`);
  process.exit(0);
}
