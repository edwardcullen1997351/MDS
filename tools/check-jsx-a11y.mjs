import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { ESLint } from 'eslint';

const root = path.resolve(import.meta.dirname, '..');
const baselinePath = path.join(root, 'tools/jsx-a11y-baseline.json');
const eslint = new ESLint({ cwd: root, overrideConfigFile: path.join(root, 'eslint.config.mjs') });
const results = await eslint.lintFiles(['packages/react/src/', 'apps/storybook/src/']);
const current = new Map();
let advisoryCount = 0;
for (const result of results) {
  const relative = path.relative(root, result.filePath).replaceAll('\\', '/');
  const lines = fs.readFileSync(result.filePath, 'utf8').split(/\r?\n/);
  for (const message of result.messages) {
    if (!message.ruleId?.startsWith('jsx-a11y/')) {
      if (message.severity === 2) {
        console.error(`${relative}:${message.line} ${message.ruleId ?? 'parse-error'}: ${message.message}`);
        process.exitCode = 1;
      } else advisoryCount++;
      continue;
    }
    if (message.severity !== 2) throw new Error(`${message.ruleId} must remain an error.`);
    const source = lines.slice(message.line - 1, message.endLine ?? message.line)
      .join(' ').trim().replace(/\s+/g, ' ');
    const excerpt = (lines[message.line - 1] ?? '').trim().replace(/\s+/g, ' ');
    const hash = createHash('sha256').update(source).digest('hex').slice(0, 12);
    const key = `${relative}\t${message.ruleId}\t${excerpt}\t${hash}`;
    current.set(key, (current.get(key) ?? 0) + 1);
  }
}

if (process.argv.includes('--write-baseline')) {
  if (process.env.CI) throw new Error('Accessibility baselines cannot be updated in CI.');
  const entries = [...current].sort(([left], [right]) => left.localeCompare(right));
  fs.writeFileSync(baselinePath, `${JSON.stringify(Object.fromEntries(entries), null, 2)}\n`);
  console.log(`Recorded ${[...current.values()].reduce((sum, count) => sum + count, 0)} existing JSX accessibility findings.`);
  process.exit(0);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const added = [...current].filter(([key, count]) => count > (baseline[key] ?? 0));
const existing = [...current].reduce((sum, [key, count]) => sum + Math.min(count, baseline[key] ?? 0), 0);
if (added.length) {
  console.error('New JSX accessibility lint errors:');
  for (const [key, count] of added) console.error(`  ${key.replaceAll('\t', ' | ')} (+${count - (baseline[key] ?? 0)})`);
  process.exitCode = 1;
} else {
  console.log(`JSX accessibility gate passed; ${existing} documented legacy findings, no new errors. ${advisoryCount} token-literal advisories.`);
}
