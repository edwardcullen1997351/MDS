import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AGENTS_DIR = path.join(ROOT, '.agents');
const REGISTRY_PATH = path.join(AGENTS_DIR, 'registry.json');

const toKebab = s => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
const toPosix = p => p ? p.split(path.sep).join('/') : null;

function fileExists(relPath) {
  return relPath && fs.existsSync(path.join(ROOT, relPath));
}

// 1. Scan Components
const componentRegistry = {};

// Categories in components/
const componentTiers = {
  primitives: { tier: 1, label: 'Primitives' },
  core: { tier: 2, label: 'Core / General' },
  forms: { tier: 2, label: 'Forms' },
  feedback: { tier: 2, label: 'Feedback' },
  navigation: { tier: 2, label: 'Navigation' },
  data: { tier: 2, label: 'Data & Visualization' },
  composite: { tier: 3, label: 'Composite Assemblies' }
};

const componentsDir = path.join(ROOT, 'components');
if (fs.existsSync(componentsDir)) {
  for (const cat of fs.readdirSync(componentsDir)) {
    const catDir = path.join(componentsDir, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    const tierMeta = componentTiers[cat] || { tier: 2, label: cat };

    const files = fs.readdirSync(catDir);
    const componentNames = new Set();
    for (const file of files) {
      if (file.endsWith('.jsx')) {
        componentNames.add(path.basename(file, '.jsx'));
      } else if (file.endsWith('.d.ts')) {
        componentNames.add(path.basename(file, '.d.ts'));
      }
    }

    for (const name of componentNames) {
      const kebab = toKebab(name);
      const reactPath = `packages/react/src/components/${name}`;
      const reactEntry = fileExists(`${reactPath}/index.ts`)
        ? `${reactPath}/index.ts`
        : fileExists(`${reactPath}/${name}.tsx`)
          ? `${reactPath}/${name}.tsx`
          : null;

      const angularPath = `packages/angular/src/components/${kebab}`;
      const angularEntry = fileExists(`${angularPath}/index.ts`)
        ? `${angularPath}/index.ts`
        : fileExists(`${angularPath}/${kebab}.component.ts`)
          ? `${angularPath}/${kebab}.component.ts`
          : null;

      // Spec search
      let specPath = null;
      const specCandidates = [
        `specs/${cat}/${name}.spec.html`,
        `specs/${cat}/${name}.spec.md`,
        `specs/patterns/${name}.spec.html`
      ];
      for (const cand of specCandidates) {
        if (fileExists(cand)) {
          specPath = cand;
          break;
        }
      }

      const promptPath = `components/${cat}/${name}.prompt.md`;
      const dtsPath = `components/${cat}/${name}.d.ts`;
      const jsxPath = `components/${cat}/${name}.jsx`;

      componentRegistry[name] = {
        tier: tierMeta.tier,
        category: cat,
        react: reactEntry,
        angular: angularEntry,
        spec: specPath,
        types: fileExists(dtsPath) ? dtsPath : null,
        prompt: fileExists(promptPath) ? promptPath : null,
        prototype: fileExists(jsxPath) ? jsxPath : null,
        tokenPrefix: `--${kebab}`,
        tokens: fileExists(`tokens/components/${kebab}.css`) ? `tokens/components/${kebab}.css` : null
      };
    }
  }
}

// Also check packages/react/src/components for any components not yet in registry
const reactDir = path.join(ROOT, 'packages/react/src/components');
if (fs.existsSync(reactDir)) {
  for (const name of fs.readdirSync(reactDir)) {
    if (componentRegistry[name]) continue;
    const kebab = toKebab(name);
    const reactPath = `packages/react/src/components/${name}`;
    const reactEntry = fileExists(`${reactPath}/index.ts`)
      ? `${reactPath}/index.ts`
      : fileExists(`${reactPath}/${name}.tsx`)
        ? `${reactPath}/${name}.tsx`
        : null;

    const angularPath = `packages/angular/src/components/${kebab}`;
    const angularEntry = fileExists(`${angularPath}/index.ts`)
      ? `${angularPath}/index.ts`
      : fileExists(`${angularPath}/${kebab}.component.ts`)
        ? `${angularPath}/${kebab}.component.ts`
        : null;

    componentRegistry[name] = {
      tier: 2,
      category: 'data',
      react: reactEntry,
      angular: angularEntry,
      spec: fileExists(`specs/data/${name}.spec.html`) ? `specs/data/${name}.spec.html` : null,
      types: null,
      prompt: null,
      prototype: null,
      tokenPrefix: `--${kebab}`
    };
  }
}

// 2. Scan Patterns
const patternsRegistry = {};
const patternsDir = path.join(ROOT, 'specs/patterns');
if (fs.existsSync(patternsDir)) {
  for (const file of fs.readdirSync(patternsDir)) {
    if (file.endsWith('.spec.html')) {
      const name = path.basename(file, '.spec.html');
      const kebab = toKebab(name);
      patternsRegistry[name] = {
        spec: `specs/patterns/${file}`,
        card: fileExists(`specs/patterns/${kebab}-reference.card.html`) ? `specs/patterns/${kebab}-reference.card.html` : null,
        template: fileExists(`templates/${kebab}`) ? `templates/${kebab}` : null
      };
    }
  }
}

// 3. Scan Layouts
const layoutsRegistry = {};
const layoutsDir = path.join(ROOT, 'specs/layouts');
if (fs.existsSync(layoutsDir)) {
  for (const file of fs.readdirSync(layoutsDir)) {
    if (file.endsWith('.spec.html')) {
      const slug = path.basename(file, '.spec.html');
      layoutsRegistry[slug] = {
        spec: `specs/layouts/${file}`,
        template: fileExists(`templates/${slug}`) ? `templates/${slug}` : null
      };
    }
  }
}

// 4. Tokens Catalog
const tokensRegistry = {
  manifest: 'tokens.json',
  cssRoot: 'tokens',
  categories: {
    primitives: {
      colors: 'tokens/colors.css',
      spacing: 'tokens/spacing.css',
      typography: 'tokens/typography.css',
      radius: 'tokens/radius.css',
      borders: 'tokens/borders.css',
      opacity: 'tokens/opacity.css',
      elevation: 'tokens/elevation.css',
      motion: 'tokens/motion.css',
      density: 'tokens/density.css',
      fonts: 'tokens/fonts.css',
      iconography: 'tokens/iconography.css'
    },
    semantic: 'tokens/semantic.css',
    components: 'tokens/components.css',
    layout: 'tokens/layout.css',
    containerQueries: 'tokens/container-queries.css',
    base: 'tokens/base.css'
  }
};

const fullRegistry = {
  version: '1.2.0',
  description: 'Meridian Design System — O(1) Fast Lookup Registry for Developers & AI Agents',
  lastUpdated: new Date().toISOString(),
  counts: {
    components: Object.keys(componentRegistry).length,
    patterns: Object.keys(patternsRegistry).length,
    layouts: Object.keys(layoutsRegistry).length
  },
  components: componentRegistry,
  patterns: patternsRegistry,
  layouts: layoutsRegistry,
  tokens: tokensRegistry
};

if (!fs.existsSync(AGENTS_DIR)) {
  fs.mkdirSync(AGENTS_DIR, { recursive: true });
}

fs.writeFileSync(REGISTRY_PATH, JSON.stringify(fullRegistry, null, 2), 'utf8');
console.log(`✓ Registry written to ${REGISTRY_PATH}`);
console.log(`  Indexed: ${fullRegistry.counts.components} components, ${fullRegistry.counts.patterns} patterns, ${fullRegistry.counts.layouts} layouts.`);
