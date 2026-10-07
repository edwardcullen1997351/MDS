import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const indexPath = path.join(root, 'apps/storybook/dist/index.json');
if (!fs.existsSync(indexPath)) throw new Error('Run npm run build -w storybook-app before the accessibility gate.');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const baselinePath = path.join(root, 'tests/a11y/axe-baseline.json');
if (process.env.CI && process.env.A11Y_UPDATE_BASELINE) throw new Error('Axe baseline updates are disabled in CI.');
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
const coveredPrefixes = ['Components/', 'Composites/'];
const additionalPrefixes = ['Primitives/', 'Data Visualization/', 'Interaction Patterns/', 'Navigation Systems/', 'Layout Templates/'];
const prefixes = process.env.A11Y_SCOPE === 'all' ? [...coveredPrefixes, ...additionalPrefixes] : coveredPrefixes;
const stories = Object.entries(index.entries)
  .filter(([, entry]) => entry.type === 'story' && prefixes.some(prefix => entry.title.startsWith(prefix)))
  .filter(([id]) => {
    const filter = process.env.A11Y_STORY_FILTER;
    return !filter || filter.split(',').some(token => id.includes(token.trim()));
  })
  .filter(([id]) => !process.env.A11Y_ONLY_BASELINE_RULE || baseline[id]?.[process.env.A11Y_ONLY_BASELINE_RULE])
  .filter(([id]) => !process.env.A11Y_ONLY_UNBASELINED || !Object.hasOwn(baseline, id));
if (stories.length === 0) throw new Error('No matching Storybook accessibility stories were found.');

for (const [id, entry] of stories) {
  test(id, async ({ page }) => {
    const storyRoot = page.locator('#storybook-root > *').first();
    for (let mountAttempt = 0; mountAttempt < 3; mountAttempt++) {
      await page.goto(`/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'domcontentloaded' });
      try {
        await expect(storyRoot).toBeAttached({ timeout: 30_000 });
        break;
      } catch (error) {
        if (mountAttempt === 2) throw error;
        await page.waitForTimeout(250);
      }
    }
    await page.evaluate(title => {
      const root = document.querySelector('#storybook-root');
      const existingMain = root.querySelector('main, [role="main"]');
      const main = existingMain ?? document.createElement('main');
      const heading = document.createElement('h1');
      heading.textContent = title;
      heading.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap';
      if (existingMain) {
        if (!existingMain.querySelector('h1')) main.prepend(heading);
      } else {
        root.before(main);
        main.append(heading, root);
      }
    }, entry.title);
    // Axe should inspect the settled UI, not the low-opacity frames of entrance animations.
    await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; }' });
    let results;
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        results = await new AxeBuilder({ page }).analyze();
        break;
      } catch (error) {
        if (!String(error).includes('Axe is already running') || attempt === 5) throw error;
        await page.waitForTimeout(300);
      }
    }
    const current = Object.fromEntries(results.violations.map(violation => [violation.id, violation.nodes.length]));
    if (process.env.A11Y_AUDIT_OUTPUT) {
      const outputDir = path.resolve(root, process.env.A11Y_AUDIT_OUTPUT);
      fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(path.join(outputDir, `${id}.json`), JSON.stringify({
        title: entry.title,
        violations: results.violations.map(violation => ({
          rule: violation.id,
          nodes: violation.nodes.map(node => ({ target: node.target, html: node.html, failure: node.failureSummary })),
        })),
      }));
      return;
    }
    if (process.env.A11Y_REPORT) console.log(`${id}: ${JSON.stringify(current)}`);
    if (process.env.A11Y_REPORT_TARGETS) {
      console.log(`${id}: ${JSON.stringify(results.violations.map(violation => ({
        rule: violation.id,
        nodes: violation.nodes.map(node => ({ target: node.target, html: node.html, failure: node.failureSummary })),
      })))}`);
    }
    const additions = Object.entries(current)
      .filter(([rule, count]) => count > (baseline[id]?.[rule] ?? 0))
      .map(([rule, count]) => ({ rule, count, baseline: baseline[id]?.[rule] ?? 0,
        targets: results.violations.find(violation => violation.id === rule)?.nodes.map(node => node.target) }));
    expect(additions).toEqual([]);
    if (process.env.A11Y_UPDATE_BASELINE) {
      baseline[id] = current;
      fs.writeFileSync(baselinePath, `${JSON.stringify(Object.fromEntries(Object.entries(baseline).sort()), null, 2)}\n`);
    }
  });
}
