import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tokensPath = path.join(__dirname, 'src', 'tokens.json');
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const rawTokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Flatten tokens to CSS variables and JS constants
const cssVars = [];
const jsTokens = {};

function flatten(obj, prefix = 'ds') {
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object') {
      if ('$value' in value) {
        const varName = `--${prefix}-${key}`;
        cssVars.push(`  ${varName}: ${value.$value};`);

        // Populate nested JS object
        const parts = prefix.split('-').slice(1).concat(key);
        let cur = jsTokens;
        for (let i = 0; i < parts.length - 1; i++) {
          cur[parts[i]] = cur[parts[i]] || {};
          cur = cur[parts[i]];
        }
        cur[parts[parts.length - 1]] = value.$value;
      } else {
        flatten(value, `${prefix}-${key}`);
      }
    }
  }
}

flatten(rawTokens);

// 1. Write CSS file
const cssOutput = `:root {\n${cssVars.join('\n')}\n}\n`;
fs.writeFileSync(path.join(distDir, 'index.css'), cssOutput);

// 2. Write JS ESM file
const jsOutput = `export const tokens = ${JSON.stringify(jsTokens, null, 2)};\nexport default tokens;\n`;
fs.writeFileSync(path.join(distDir, 'index.js'), jsOutput);

// 3. Write TypeScript Declaration file
const dtsOutput = `export declare const tokens: ${JSON.stringify(jsTokens, null, 2)};\nexport default tokens;\n`;
fs.writeFileSync(path.join(distDir, 'index.d.ts'), dtsOutput);

console.log('✅ [@ds/tokens] Successfully built tokens to dist/ (CSS, JS, DTS)');
