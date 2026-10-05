import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import postcss from 'postcss';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = path.join(ROOT, '_ds_manifest.json');
const BUNDLE_PATH = path.join(ROOT, '_ds_bundle.js');
const isCheckMode = process.argv.includes('--check');
const toPosix = value => value.split(path.sep).join('/');

function walkFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap(entry => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? walkFiles(entryPath) : [entryPath];
    })
    .sort();
}

function relativePath(filePath) {
  return toPosix(path.relative(ROOT, filePath));
}

function parseMarkerAttributes(marker) {
  return Object.fromEntries(
    [...marker.matchAll(/([a-zA-Z][\w-]*)="([^"]*)"/g)]
      .map(([, key, value]) => [key, value])
  );
}

function getMarkers(filePath, markerName) {
  const content = fs.readFileSync(filePath, 'utf8');
  const expression = new RegExp(`<!--\\s*@${markerName}\\s+([\\s\\S]*?)\\s*-->`, 'g');
  return [...content.matchAll(expression)].map(match => parseMarkerAttributes(match[1]));
}

function collectCards() {
  const cards = [];
  for (const directory of ['components', 'guidelines', 'specs']) {
    for (const filePath of walkFiles(path.join(ROOT, directory)).filter(file => file.endsWith('.html'))) {
      for (const metadata of getMarkers(filePath, 'dsCard')) {
        const { group, viewport, subtitle, name } = metadata;
        if (![group, viewport, subtitle, name].every(Boolean)) {
          throw new Error(`Incomplete @dsCard metadata in ${relativePath(filePath)}`);
        }
        cards.push({ path: relativePath(filePath), group, viewport, subtitle, name });
      }
    }
  }
  return cards;
}

function collectTemplates(previousTemplates) {
  const previousByEntry = new Map(previousTemplates.map(template => [template.entryPath, template]));
  const templates = [];
  for (const filePath of walkFiles(path.join(ROOT, 'templates')).filter(file => file.endsWith('.dc.html'))) {
    const entryPath = relativePath(filePath);
    for (const metadata of getMarkers(filePath, 'template')) {
      if (!metadata.name || !metadata.description) {
        throw new Error(`Incomplete @template metadata in ${entryPath}`);
      }
      const folder = relativePath(path.dirname(filePath));
      const thumbnailPath = `${folder}/.thumbnail`;
      const template = { name: metadata.name, description: metadata.description, folder, entryPath };
      if (fs.existsSync(path.join(ROOT, thumbnailPath))) {
        template.thumbnail = {
          path: thumbnailPath,
          kind: previousByEntry.get(entryPath)?.thumbnail?.kind || 'captured'
        };
      }
      templates.push(template);
    }
  }
  return templates;
}

function inferTokenKind(name, value, annotation) {
  if (annotation) return annotation;
  if (/^--font-/.test(name)) return 'font';
  if (/^--(?:shadow-|elevation-)/.test(name)) return 'shadow';
  if (/^--radius-/.test(name)) return 'radius';
  if (/^--(?:space-|control-|target-|row-h|header-h|cell-p[xy])/.test(name)) return 'spacing';
  if (/color|background|surface|border|text|fill|scrim/.test(name) ||
      /^#(?:[0-9a-f]{3,8})$/i.test(value) || /^(?:rgb|hsl)a?\(/i.test(value)) {
    return 'color';
  }
  return 'other';
}

function collectTokens(globalCssPaths, previousTokens) {
  const previousKinds = new Map();
  for (const token of previousTokens) {
    const key = `${token.definedIn}\0${token.name}`;
    if (!previousKinds.has(key)) previousKinds.set(key, token.kind);
  }

  const tokens = [];
  for (const cssPath of globalCssPaths.filter(file => file.startsWith('tokens/') && file.endsWith('.css'))) {
    const absolutePath = path.join(ROOT, cssPath);
    const source = fs.readFileSync(absolutePath, 'utf8');
    const annotations = new Map(
      [...source.matchAll(/(--[\w-]+)\s*:\s*[^;]+;\s*\/\*\s*@kind\s+([\w-]+)\s*\*\//g)]
        .map(([, name, kind]) => [name, kind])
    );
    const stylesheet = postcss.parse(source, { from: cssPath });

    stylesheet.walkRules(rule => {
      for (let parent = rule.parent; parent && parent.type !== 'root'; parent = parent.parent) {
        if (parent.type === 'atrule') return;
      }
      if (!/:root|\[data-(?:theme|density)=/.test(rule.selector)) return;

      rule.walkDecls(declaration => {
        if (!declaration.prop.startsWith('--')) return;
        const key = `${cssPath}\0${declaration.prop}`;
        const kind = previousKinds.get(key) ||
          inferTokenKind(declaration.prop, declaration.value, annotations.get(declaration.prop));
        tokens.push({
          name: declaration.prop,
          value: declaration.value.trim(),
          kind,
          definedIn: cssPath
        });
      });
    });
  }
  return tokens;
}

function collectThemes(globalCssPaths, previousThemes) {
  const available = new Set();
  for (const cssPath of globalCssPaths.filter(file => file.startsWith('tokens/') && file.endsWith('.css'))) {
    const source = fs.readFileSync(path.join(ROOT, cssPath), 'utf8');
    const stylesheet = postcss.parse(source, { from: cssPath });
    stylesheet.walkRules(rule => {
      for (let parent = rule.parent; parent && parent.type !== 'root'; parent = parent.parent) {
        if (parent.type === 'atrule') return;
      }
      for (const [, type, value] of rule.selector.matchAll(/\[data-(theme|density)="([^"]+)"\]/g)) {
        if (value === 'comfortable') continue;
        available.add(`[data-${type}="${value}"]`);
      }
    });
  }

  const labelFor = selector => {
    const previous = previousThemes.find(theme => theme.selector === selector);
    if (previous) return previous.label;
    const [, type, value] = selector.match(/\[data-(theme|density)="([^"]+)"\]/);
    const name = value[0].toUpperCase() + value.slice(1);
    return type === 'density' ? `Density ${name}` : name;
  };
  const ordered = previousThemes.filter(theme => available.has(theme.selector)).map(theme => theme.selector);
  for (const selector of available) if (!ordered.includes(selector)) ordered.push(selector);
  return ordered.map(selector => ({ selector, label: labelFor(selector) }));
}

function collectBrandFonts() {
  const cssPath = 'tokens/typography.css';
  const source = fs.readFileSync(path.join(ROOT, cssPath), 'utf8');
  return ['--font-sans', '--font-mono'].flatMap(token => {
    const match = source.match(new RegExp(`${token}:\\s*["']([^"']+)["']`));
    return match ? [{
      family: match[1],
      status: 'ok',
      tokens: [token],
      path: cssPath
    }] : [];
  });
}

function createManifest(previous) {
  const globalCssPaths = previous.globalCssPaths;
  for (const cssPath of globalCssPaths) {
    if (!fs.existsSync(path.join(ROOT, cssPath))) {
      throw new Error(`Manifest references missing stylesheet: ${cssPath}`);
    }
  }

  const componentNames = new Set();
  for (const component of previous.components) {
    if (componentNames.has(component.name)) throw new Error(`Duplicate component name: ${component.name}`);
    componentNames.add(component.name);
    const sourcePath = component.sourcePath || component.path;
    const absolutePath = path.resolve(ROOT, sourcePath);
    if (!absolutePath.startsWith(`${ROOT}${path.sep}`) || !fs.existsSync(absolutePath)) {
      throw new Error(`Manifest references missing or unsafe component source: ${sourcePath}`);
    }
  }

  return {
    ...previous,
    components: previous.components,
    cards: collectCards(),
    templates: collectTemplates(previous.templates),
    hasThumbnailHtml: fs.existsSync(path.join(ROOT, 'thumbnail.html')),
    globalCssPaths,
    tokens: collectTokens(globalCssPaths, previous.tokens),
    themes: collectThemes(globalCssPaths, previous.themes),
    brandFonts: collectBrandFonts()
  };
}

async function createBundle(manifest) {
  const components = manifest.components.map(component => ({
    name: component.name,
    sourcePath: component.sourcePath || component.path
  }));
  const entry = components
    .map(({ name, sourcePath }) => `export { ${name} } from ${JSON.stringify(`./${sourcePath}`)};`)
    .join('\n');
  const reactGlobalPlugin = {
    name: 'react-global',
    setup(buildApi) {
      buildApi.onResolve({ filter: /^react$/ }, () => ({ path: 'react', namespace: 'react-global' }));
      buildApi.onLoad({ filter: /.*/, namespace: 'react-global' }, () => ({
        contents: 'module.exports = globalThis.React;',
        loader: 'js'
      }));
    }
  };
  const result = await build({
    stdin: {
      contents: entry,
      resolveDir: ROOT,
      sourcefile: 'browser-entry.jsx',
      loader: 'jsx'
    },
    bundle: true,
    format: 'iife',
    globalName: '__meridianBrowserBundle',
    platform: 'browser',
    target: 'es2020',
    write: false,
    plugins: [reactGlobalPlugin]
  });
  const metadata = { format: 4, namespace: manifest.namespace, components };
  const bundledCode = result.outputFiles[0].text.replace(/[ \t]+$/gm, '');
  return `/* @ds-bundle: ${JSON.stringify(metadata)} */\n(() => {\n${bundledCode}\n  const namespace = window[${JSON.stringify(manifest.namespace)}] || (window[${JSON.stringify(manifest.namespace)}] = {});\n  Object.assign(namespace, __meridianBrowserBundle);\n})();`;
}

function writeOrCheck(filePath, generatedContent, label) {
  if (isCheckMode) {
    const currentContent = fs.readFileSync(filePath, 'utf8');
    if (currentContent !== generatedContent) {
      console.error(`${label} is out of date. Run npm run build:browser-artifacts.`);
      return false;
    }
    return true;
  }
  fs.writeFileSync(filePath, generatedContent, 'utf8');
  return true;
}

const previousManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const manifest = createManifest(previousManifest);
const manifestContent = JSON.stringify(manifest, null, 2);
const bundleContent = await createBundle(manifest);
const manifestIsCurrent = writeOrCheck(MANIFEST_PATH, manifestContent, '_ds_manifest.json');
const bundleIsCurrent = writeOrCheck(BUNDLE_PATH, bundleContent, '_ds_bundle.js');

if (isCheckMode) {
  if (!manifestIsCurrent || !bundleIsCurrent) process.exitCode = 1;
  else console.log('Browser bundle and manifest are up to date.');
} else {
  console.log(`Wrote ${manifest.components.length} component exports and ${manifest.tokens.length} token records.`);
}
