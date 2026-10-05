import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const TOKENS_DIR = path.join(ROOT_DIR, 'tokens');
const OUTPUT_FILE = path.join(ROOT_DIR, 'tokens.json');
const isCheckMode = process.argv.includes('--check');

// Approved tier-2 literal tokens per Token Architecture §1.5
const TIER2_LITERALS = new Set([
  '--control-h-sm', '--control-h-md', '--control-h-lg',
  '--control-px-sm', '--control-px-md', '--control-px-lg',
  '--row-h', '--header-h', '--cell-py', '--cell-px',
  '--ring-focus', '--ring-danger', '--ring-inverse',
  '--focus-ring-width', '--focus-ring-offset', '--focus-ring-color', '--focus-offset',
  '--scrim', '--blur-overlay',
  '--opacity-scrim', '--target-touch', '--target-pointer',
  '--target-size-min', '--target-size-standard'
]);

// Known component name prefixes for tier 3
const COMPONENT_PREFIXES = [
  'date-range-picker', 'date-time-picker', 'file-upload', 'scope-picker',
  'search-field', 'sortable-collection', 'split-button', 'button-group',
  'icon-button', 'accordion-item', 'accordion', 'avatar-group', 'avatar',
  'badge', 'button', 'card', 'chip-group', 'chip', 'fieldset',
  'icon', 'link', 'segmented-control', 'tag-list', 'tag',
  'description-list', 'empty-state', 'list-item', 'list',
  'pagination', 'skeleton', 'table', 'tree', 'alert', 'dialog',
  'drawer', 'popover', 'progress', 'snackbar', 'toaster', 'toast',
  'tooltip', 'autocomplete', 'checkbox-group', 'checkbox',
  'combobox', 'date-picker', 'field-context', 'field', 'file-dropzone',
  'file-item', 'input', 'multi-combobox', 'radio-group', 'radio',
  'range-slider', 'select', 'slider', 'switch', 'textarea', 'time-field',
  'breadcrumb', 'menu-list', 'menu', 'tab-panel', 'tabs',
  'aspect-ratio', 'box', 'container', 'divider', 'grid-item', 'grid',
  'heading', 'image', 'spacer', 'stack', 'surface', 'text', 'toolbar'
];

function kebabToCamel(str) {
  const clean = str.replace(/^--/, '');
  return clean.replace(/-([a-z0-9])/g, (_, g) => g.toUpperCase());
}

function inferType(name, value, annotationKind) {
  if (annotationKind === 'color') return 'color';
  if (annotationKind === 'font') return 'fontFamily';
  if (annotationKind === 'spacing') return 'dimension';
  if (annotationKind === 'shadow') return 'shadow';
  if (annotationKind === 'radius') return 'dimension';
  if (annotationKind === 'other') return 'other';

  if (name.includes('color') || name.startsWith('--grey-') || name.startsWith('--blue-') ||
      name.startsWith('--green-') || name.startsWith('--red-') || name.startsWith('--orange-') ||
      name.startsWith('--yellow-') || name.startsWith('--purple-') || name.startsWith('--teal-') ||
      name.includes('background') || name.includes('surface') || name.includes('border') ||
      name.includes('text') || name.includes('fill') || name.includes('scrim') ||
      /^#(?:[0-9a-fA-F]{3,8})$/.test(value) || value.startsWith('rgba(') || value.startsWith('rgb(')) {
    return 'color';
  }
  if (name.startsWith('--font-')) return 'fontFamily';
  if (name.startsWith('--weight-')) return 'fontWeight';
  if (name.startsWith('--leading-') || name.startsWith('--opacity-') || name.startsWith('--z-') || name.startsWith('--grid-columns')) return 'number';
  if (name.startsWith('--duration-') || /^\d+(?:\.\d+)?m?s$/.test(value)) return 'duration';
  if (name.startsWith('--shadow-') || name.startsWith('--elevation-') || name.includes('ring')) return 'shadow';
  if (name.startsWith('--radius-') || name.startsWith('--space-') || name.startsWith('--text-') ||
      name.startsWith('--control-') || name.startsWith('--icon-') || name.startsWith('--bp-') ||
      name.startsWith('--container-') || name.endsWith('-h') || name.endsWith('-w') ||
      /^\d+(?:\.\d+)?(?:px|rem|em|ch|%)$/.test(value)) {
    return 'dimension';
  }
  if (name.startsWith('--ease-') || name.startsWith('--transition-') || name.startsWith('--anim-') || name.startsWith('--border-hairline')) {
    return 'other';
  }
  return 'other';
}

function parseCssRules(cssText) {
  const rules = [];

  // Extract declarations and their annotations while preserving block context
  // First, extract comments with @kind annotations
  const annotationMap = new Map();
  const annotRegex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);\s*\/\*\s*@kind\s+([a-zA-Z0-9_-]+)\s*\*\//g;
  let aMatch;
  while ((aMatch = annotRegex.exec(cssText)) !== null) {
    annotationMap.set(aMatch[1].trim(), aMatch[3].trim());
  }

  // Strip all comments
  const strippedCss = cssText.replace(/\/\*[\s\S]*?\*\//g, '');

  // Parse CSS blocks: selector { declarations }
  const blockRegex = /([^{]+)\{([^}]+)\}/g;
  let blockMatch;
  while ((blockMatch = blockRegex.exec(strippedCss)) !== null) {
    const selector = blockMatch[1].trim();
    const body = blockMatch[2].trim();

    // Ignore @keyframes blocks
    if (selector.startsWith('@keyframes')) continue;

    const declRegex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
    let declMatch;
    while ((declMatch = declRegex.exec(body)) !== null) {
      const name = declMatch[1].trim();
      const value = declMatch[2].trim();
      const annotationKind = annotationMap.get(name);

      rules.push({ selector, name, value, annotationKind });
    }
  }

  return rules;
}

function categorizeToken(name, filename) {
  // Primitives
  if (filename === 'colors.css') return { tier: 'primitive', category: 'color' };
  if (filename === 'typography.css') return { tier: 'primitive', category: 'typography' };
  if (filename === 'spacing.css') {
    if (name.startsWith('--control-') || name.startsWith('--target-') || name === '--row-h') {
      return { tier: 'semantic', category: 'control' };
    }
    return { tier: 'primitive', category: 'space' };
  }
  if (filename === 'radius.css') {
    if (/^--radius-(?:0|2|4|6|8|12|16|24|full)$/.test(name)) return { tier: 'primitive', category: 'radius' };
    return { tier: 'semantic', category: 'radius' };
  }
  if (filename === 'borders.css') {
    if (name.startsWith('--border-width-')) return { tier: 'primitive', category: 'border' };
    return { tier: 'primitive', category: 'border' };
  }
  if (filename === 'elevation.css') {
    if (name.startsWith('--shadow-')) return { tier: 'primitive', category: 'elevation' };
    return { tier: 'semantic', category: 'elevation' };
  }
  if (filename === 'opacity.css') {
    if (/^--opacity-\d+$/.test(name)) return { tier: 'primitive', category: 'opacity' };
    return { tier: 'semantic', category: 'opacity' };
  }
  if (filename === 'iconography.css') return { tier: 'primitive', category: 'iconography' };
  if (filename === 'motion.css') return { tier: 'primitive', category: 'motion' };
  if (filename === 'layout.css') return { tier: 'primitive', category: 'layout' };
  if (filename === 'density.css') return { tier: 'semantic', category: 'density' };

  if (filename === 'semantic.css') {
    if (name.startsWith('--text-')) return { tier: 'semantic', category: 'text' };
    if (name.startsWith('--background-')) return { tier: 'semantic', category: 'background' };
    if (name.startsWith('--surface-')) return { tier: 'semantic', category: 'surface' };
    if (name.startsWith('--border-')) return { tier: 'semantic', category: 'border' };
    if (name.startsWith('--action-')) return { tier: 'semantic', category: 'action' };
    if (name.startsWith('--status-success-')) return { tier: 'semantic', category: 'success' };
    if (name.startsWith('--status-warning-')) return { tier: 'semantic', category: 'warning' };
    if (name.startsWith('--status-critical-')) return { tier: 'semantic', category: 'critical' };
    if (name.startsWith('--status-info-')) return { tier: 'semantic', category: 'info' };
    if (name.startsWith('--status-neutral-')) return { tier: 'semantic', category: 'neutral' };
    if (name.startsWith('--focus-')) return { tier: 'semantic', category: 'focus' };
    if (name.startsWith('--overlay-')) return { tier: 'semantic', category: 'overlay' };
    if (name.startsWith('--selection-')) return { tier: 'semantic', category: 'selection' };
    return { tier: 'semantic', category: 'general' };
  }

  if (filename === 'components.css') {
    const clean = name.replace(/^--/, '');
    // Match longest matching component prefix
    for (const prefix of COMPONENT_PREFIXES) {
      if (clean.startsWith(prefix)) {
        return { tier: 'component', category: kebabToCamel(prefix) };
      }
    }
    const parts = clean.split('-');
    return { tier: 'component', category: parts[0] };
  }

  return { tier: 'primitive', category: 'other' };
}

function resolveValue(value, tokenPathMap) {
  return value.replace(/var\((--[a-zA-Z0-9_-]+)\)/g, (match, varName) => {
    const targetPath = tokenPathMap.get(varName);
    if (targetPath) {
      return `{${targetPath}}`;
    }
    return match;
  });
}

export function buildTokens() {
  const files = [
    'colors.css', 'typography.css', 'spacing.css', 'radius.css',
    'borders.css', 'elevation.css', 'opacity.css', 'iconography.css',
    'motion.css', 'layout.css', 'density.css', 'semantic.css',
    'components.css'
  ];

  const allRules = [];

  for (const filename of files) {
    const filePath = path.join(TOKENS_DIR, filename);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileRules = parseCssRules(content).map(r => ({ ...r, file: filename }));
    allRules.push(...fileRules);
  }

  const baseRules = allRules.filter(r => !r.selector.includes('[data-theme="dark"]') && !r.selector.includes('@media'));
  const darkRules = allRules.filter(r => r.selector.includes('[data-theme="dark"]'));

  // First pass: Build token path lookup map
  const tokenPathMap = new Map();
  const tokenMetaMap = new Map();

  for (const r of baseRules) {
    if (r.selector.includes('[data-density="compact"]') || r.selector.includes('[data-density="expanded"]')) {
      continue; // Skip density overrides in base path map
    }
    const { tier, category } = categorizeToken(r.name, r.file);
    const camel = kebabToCamel(r.name);
    const dtcgPath = `${tier}.${category}.${camel}`;
    tokenPathMap.set(r.name, dtcgPath);
    tokenMetaMap.set(r.name, { ...r, tier, category, camel });
  }

  // Structure output object
  const output = {
    $description: 'Meridian Design System — Design Tokens (DTCG Standard)',
    $extensions: {
      'com.meridian.system': 'Meridian Design System',
      'com.meridian.version': '1.2.0',
      'com.meridian.source': 'tokens/*.css'
    },
    primitive: {},
    semantic: {},
    component: {},
    theme: {
      dark: {}
    }
  };

  // Populate base tokens
  for (const [name, meta] of tokenMetaMap.entries()) {
    const { tier, category, camel, value, annotationKind } = meta;

    if (!output[tier][category]) {
      output[tier][category] = {};
    }

    const resolvedVal = resolveValue(value, tokenPathMap);
    const tokenType = inferType(name, value, annotationKind);

    const tokenEntry = {
      $type: tokenType,
      $value: resolvedVal
    };

    if (TIER2_LITERALS.has(name)) {
      tokenEntry.$extensions = {
        'com.meridian.tier2Literal': true
      };
    }

    output[tier][category][camel] = tokenEntry;
  }

  // Populate theme.dark
  for (const override of darkRules) {
    const camel = kebabToCamel(override.name);
    const resolvedVal = resolveValue(override.value, tokenPathMap);
    output.theme.dark[camel] = {
      $value: resolvedVal
    };
  }

  const jsonString = JSON.stringify(output, null, 2) + '\n';

  if (isCheckMode) {
    if (!fs.existsSync(OUTPUT_FILE)) {
      console.error('Check failed: tokens.json does not exist. Run "npm run tokens:build" to generate.');
      process.exit(1);
    }
    const current = fs.readFileSync(OUTPUT_FILE, 'utf-8');
    if (current !== jsonString) {
      console.error('Check failed: tokens.json is out of sync with tokens/*.css. Run "npm run tokens:build" to update.');
      process.exit(1);
    }
    console.log('✓ tokens.json is in sync with tokens/*.css');
    return;
  }

  fs.writeFileSync(OUTPUT_FILE, jsonString, 'utf-8');
  console.log(`✓ Successfully compiled tokens.json (${tokenMetaMap.size} tokens processed across 3 tiers)`);
}

buildTokens();
