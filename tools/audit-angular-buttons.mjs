import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const ANGULAR_DIR = path.join(ROOT_DIR, 'packages', 'angular', 'src', 'components');

const buttonViolations = [];
let totalButtonsAudited = 0;
let rawButtonsWithoutType = 0;
let iconButtonsWithoutAccessibleName = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.html'))) {
      auditFile(fullPath);
    }
  }
}

function auditFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relPath = path.relative(ROOT_DIR, filePath);

  // Match <button ... > tags, respecting quotes
  const buttonRegex = /<button\b((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?>)/gs;
  let match;

  while ((match = buttonRegex.exec(content)) !== null) {
    totalButtonsAudited++;
    const attrs = match[1];
    const isSelfClosing = match[2].startsWith('/>');
    const startIdx = match.index;
    const lineNum = content.slice(0, startIdx).split('\n').length;

    // In Angular: type="button" or [type]="type" or [type]="'button'"
    const hasType = /(?:\[attr\.type\]|\[type\]|\btype)\s*=\s*["'{]/.test(attrs);
    if (!hasType) {
      rawButtonsWithoutType++;
      buttonViolations.push({
        file: relPath,
        line: lineNum,
        severity: 'P1 (High)',
        issue: 'Missing explicit `type="button"` on Angular <button> template. Defaults to `submit` in HTML forms.',
        snippet: `<button ${attrs.trim().slice(0, 80)}...>`
      });
    }

    // 2. Check for accessible name if it's icon-only
    const hasAriaLabel = /\b(?:\[attr\.aria-label\]|aria-label)\s*=\s*['"{]/.test(attrs);
    const hasAriaLabelledby = /\b(?:\[attr\.aria-labelledby\]|aria-labelledby)\s*=\s*['"{]/.test(attrs);
    const hasTitle = /\b(?:\[attr\.title\]|\[title\]|title)\s*=\s*['"{]/.test(attrs);

    if (!isSelfClosing) {
      const closingIdx = content.indexOf('</button>', startIdx);
      if (closingIdx !== -1) {
        const innerContent = content.slice(startIdx + match[0].length, closingIdx).trim();
        // Check if content only has icon or svg without plain text
        const hasSvgOrIconOnly = (innerContent.includes('<svg') || innerContent.includes('<ds-icon') || innerContent.includes('Icon')) &&
                                 !/[a-zA-Z0-9]{2,}/.test(innerContent.replace(/<[^>]+>/g, '').trim());

        if (hasSvgOrIconOnly && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
          iconButtonsWithoutAccessibleName++;
          buttonViolations.push({
            file: relPath,
            line: lineNum,
            severity: 'P0 (Blocker)',
            issue: 'Icon-only Angular <button> missing accessible name (`aria-label`, `[attr.aria-label]`, or `title`).',
            snippet: `<button ${attrs.trim().slice(0, 60)}...>${innerContent.slice(0, 40)}...</button>`
          });
        }
      }
    }
  }

  // Also check <ds-button ...> component usages
  const dsButtonRegex = /<ds-button\b([^>]*?)(\/?>)/gs;
  while ((match = dsButtonRegex.exec(content)) !== null) {
    totalButtonsAudited++;
    const attrs = match[1];
    const isSelfClosing = match[2].startsWith('/>');
    const startIdx = match.index;
    const lineNum = content.slice(0, startIdx).split('\n').length;

    const hasAriaLabel = /\b(?:\[attr\.aria-label\]|aria-label)\s*=\s*['"{]/.test(attrs);
    const hasAriaLabelledby = /\b(?:\[attr\.aria-labelledby\]|aria-labelledby)\s*=\s*['"{]/.test(attrs);
    const hasTitle = /\b(?:\[attr\.title\]|\[title\]|title)\s*=\s*['"{]/.test(attrs);

    if (isSelfClosing && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
      iconButtonsWithoutAccessibleName++;
      buttonViolations.push({
        file: relPath,
        line: lineNum,
        severity: 'P0 (Blocker)',
        issue: 'Self-closing <ds-button /> without accessible name.',
        snippet: `<ds-button ${attrs.trim().slice(0, 80)}/>`
      });
    }
  }
}

console.log('====================================================');
console.log('   PHASE 1: ANGULAR BUTTON & INTERACTIVE AUDIT');
console.log('====================================================\n');

walk(ANGULAR_DIR);

console.log(`Audited ${totalButtonsAudited} button elements across ${ANGULAR_DIR}`);
console.log(`- Native <button> without explicit type: ${rawButtonsWithoutType}`);
console.log(`- Icon-only buttons without accessible name: ${iconButtonsWithoutAccessibleName}`);
console.log(`\nTOTAL ANGULAR BUTTON VIOLATIONS FOUND: ${buttonViolations.length}`);

// Group by severity
const p0s = buttonViolations.filter(v => v.severity.startsWith('P0'));
const p1s = buttonViolations.filter(v => v.severity.startsWith('P1'));

console.log(`\n--- P0 (Blocker) Violations: ${p0s.length} ---`);
for (const v of p0s.slice(0, 15)) {
  console.log(`❌ [${v.severity}] ${v.file}:${v.line}`);
  console.log(`   ${v.issue}`);
  console.log(`   ${v.snippet}\n`);
}

console.log(`\n--- P1 (High) Violations: ${p1s.length} ---`);
for (const v of p1s.slice(0, 15)) {
  console.log(`⚠️  [${v.severity}] ${v.file}:${v.line}`);
  console.log(`   ${v.issue}`);
  console.log(`   ${v.snippet}\n`);
}

const outDir = path.join(ROOT_DIR, 'audits');
fs.writeFileSync(path.join(outDir, 'angular-buttons-audit.json'), JSON.stringify(buttonViolations, null, 2));
