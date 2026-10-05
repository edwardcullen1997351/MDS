import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const COMPONENTS_DIR = path.join(ROOT_DIR, 'packages', 'react', 'src', 'components');

const buttonViolations = [];
let totalButtonsAudited = 0;
let rawHtmlButtonsWithoutType = 0;
let iconButtonsWithoutAccessibleName = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))) {
      auditFile(fullPath);
    }
  }
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relPath = path.relative(ROOT_DIR, filePath);
  const lines = content.split('\n');

  // Regex to match <button or <Button opening tags across lines
  // Match <button ... >
  const buttonRegex = /<button\b([^>]*?)(\/?>)/gs;
  let match;

  while ((match = buttonRegex.exec(content)) !== null) {
    totalButtonsAudited++;
    const attrs = match[1];
    const isSelfClosing = match[2].startsWith('/>');
    const startIdx = match.index;
    const lineNum = content.slice(0, startIdx).split('\n').length;

    // 1. Check for explicit type
    const hasType = /\btype\s*=\s*['"{]/.test(attrs);
    if (!hasType) {
      rawHtmlButtonsWithoutType++;
      buttonViolations.push({
        file: relPath,
        line: lineNum,
        severity: 'P1 (High)',
        issue: 'Missing explicit `type="button"` on native <button> element. Defaults to `submit` in HTML forms.',
        snippet: `<button ${attrs.trim().slice(0, 80)}...>`
      });
    }

    // 2. Check for accessible name if it looks like an icon-only button
    const hasAriaLabel = /\baria-label\s*=\s*['"{]/.test(attrs);
    const hasAriaLabelledby = /\baria-labelledby\s*=\s*['"{]/.test(attrs);
    const hasTitle = /\btitle\s*=\s*['"{]/.test(attrs);

    // Look at inner content if not self closing
    if (!isSelfClosing) {
      const closingIdx = content.indexOf('</button>', startIdx);
      if (closingIdx !== -1) {
        const innerContent = content.slice(startIdx + match[0].length, closingIdx).trim();
        // Check if inner content has only an icon or svg without plain text
        const hasSvgOrIconOnly = (innerContent.includes('<svg') || innerContent.includes('<Icon') || innerContent.includes('Icon')) &&
                                 !/[a-zA-Z0-9]{2,}/.test(innerContent.replace(/<[^>]+>/g, '').trim());

        if (hasSvgOrIconOnly && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
          iconButtonsWithoutAccessibleName++;
          buttonViolations.push({
            file: relPath,
            line: lineNum,
            severity: 'P0 (Blocker)',
            issue: 'Icon-only <button> missing accessible name (`aria-label`, `aria-labelledby`, or `title`). Screen readers cannot announce purpose.',
            snippet: `<button ${attrs.trim().slice(0, 60)}...>${innerContent.slice(0, 40)}...</button>`
          });
        }
      }
    }
  }

  // Also audit <Button ... > component usages in component wrappers
  const dsButtonRegex = /<Button\b([^>]*?)(\/?>)/gs;
  while ((match = dsButtonRegex.exec(content)) !== null) {
    totalButtonsAudited++;
    const attrs = match[1];
    const isSelfClosing = match[2].startsWith('/>');
    const startIdx = match.index;
    const lineNum = content.slice(0, startIdx).split('\n').length;

    const hasAriaLabel = /\baria-label\s*=\s*['"{]/.test(attrs);
    const hasAriaLabelledby = /\baria-labelledby\s*=\s*['"{]/.test(attrs);
    const hasTitle = /\btitle\s*=\s*['"{]/.test(attrs);

    if (isSelfClosing && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
      iconButtonsWithoutAccessibleName++;
      buttonViolations.push({
        file: relPath,
        line: lineNum,
        severity: 'P0 (Blocker)',
        issue: 'Self-closing <Button /> without children or accessible name (`aria-label`).',
        snippet: `<Button ${attrs.trim().slice(0, 80)}/>`
      });
    } else if (!isSelfClosing) {
      const closingIdx = content.indexOf('</Button>', startIdx);
      if (closingIdx !== -1) {
        const innerContent = content.slice(startIdx + match[0].length, closingIdx).trim();
        const textContent = innerContent.replace(/<[^>]+>/g, '').trim();
        if (textContent.length === 0 && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
          iconButtonsWithoutAccessibleName++;
          buttonViolations.push({
            file: relPath,
            line: lineNum,
            severity: 'P0 (Blocker)',
            issue: '<Button> with icon-only children missing accessible name (`aria-label`).',
            snippet: `<Button ${attrs.trim().slice(0, 60)}...>${innerContent.slice(0, 40)}...</Button>`
          });
        }
      }
    }
  }
}

console.log('====================================================');
console.log('   PHASE 1: REACT BUTTON & INTERACTIVE AUDIT');
console.log('====================================================\n');

walk(COMPONENTS_DIR);

console.log(`Audited ${totalButtonsAudited} button elements across ${COMPONENTS_DIR}`);
console.log(`- Native <button> without explicit type: ${rawHtmlButtonsWithoutType}`);
console.log(`- Icon-only buttons without accessible name: ${iconButtonsWithoutAccessibleName}`);
console.log(`\nTOTAL BUTTON VIOLATIONS FOUND: ${buttonViolations.length}`);

// Group by severity
const p0s = buttonViolations.filter(v => v.severity.startsWith('P0'));
const p1s = buttonViolations.filter(v => v.severity.startsWith('P1'));

console.log(`\n--- P0 (Blocker) Violations: ${p0s.length} ---`);
for (const v of p0s.slice(0, 15)) {
  console.log(`❌ [${v.severity}] ${v.file}:${v.line}`);
  console.log(`   ${v.issue}`);
  console.log(`   ${v.snippet}\n`);
}
if (p0s.length > 15) {
  console.log(`... and ${p0s.length - 15} more P0 violations.\n`);
}

console.log(`\n--- P1 (High) Violations: ${p1s.length} ---`);
for (const v of p1s.slice(0, 10)) {
  console.log(`⚠️  [${v.severity}] ${v.file}:${v.line}`);
  console.log(`   ${v.issue}`);
  console.log(`   ${v.snippet}\n`);
}
if (p1s.length > 10) {
  console.log(`... and ${p1s.length - 10} more P1 violations.\n`);
}

const outDir = path.join(ROOT_DIR, 'audits');
fs.writeFileSync(path.join(outDir, 'react-buttons-audit.json'), JSON.stringify(buttonViolations, null, 2));
