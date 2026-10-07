import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(ROOT, 'tokens', 'components.css');
const OUT_DIR = path.join(ROOT, 'tokens', 'components');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const content = fs.readFileSync(SOURCE, 'utf8');

// Match sections delimited by /* ── Name ──...
const lines = content.split('\n');
const sections = [];
let currentName = 'header';
let currentLines = [];

for (const line of lines) {
  const match = line.match(/\/\* ── ([a-zA-Z0-9_\-\s()]+?) ─+/);
  if (match) {
    if (currentLines.length > 0) {
      sections.push({ name: currentName, lines: currentLines });
    }
    currentName = match[1].replace(/\(composite\)/, '').trim().toLowerCase().replace(/\s+/g, '-');
    currentLines = [line];
  } else {
    currentLines.push(line);
  }
}
if (currentLines.length > 0) {
  sections.push({ name: currentName, lines: currentLines });
}

let count = 0;
for (const sec of sections) {
  if (sec.name === 'header') continue;
  const fileName = `${sec.name}.css`;
  const filePath = path.join(OUT_DIR, fileName);
  fs.writeFileSync(filePath, sec.lines.join('\n').trim() + '\n', 'utf8');
  count++;
}

console.log(`✓ Modularized ${count} atomic component token files into tokens/components/`);
