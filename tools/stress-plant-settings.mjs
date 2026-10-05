import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cdpPort = Number(process.env.MDS_CDP_PORT || 9800 + Math.floor(Math.random() * 400));
const storybookBaseUrl = process.env.MDS_STORYBOOK_URL || 'http://127.0.0.1:6006';
const storyId = 'reference-assemblies-candidate-overview--settings-example';
const outputDirectory = join(process.cwd(), 'audits', 'assemblies', 'plant-settings', 'certification');
const profileDirectory = join(tmpdir(), `mds-ps-stress-${Date.now()}`);
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const storySource = readFileSync(new URL('../apps/storybook/src/stories/ReferenceAssemblies.stories.tsx', import.meta.url), 'utf8');
const settingsSource = storySource.slice(
  storySource.indexOf('export const SettingsExample'),
  storySource.indexOf('export const AnalyticsExample')
);

const viewports = [
  { name: 'mobile-narrow', width: 320, height: 844, mobile: true },
  { name: 'mobile', width: 390, height: 844, mobile: true },
  { name: 'tablet', width: 768, height: 1024, mobile: false },
  { name: 'desktop', width: 1440, height: 1200, mobile: false },
];

const scenarios = ['ready', 'dirty', 'restricted-section', 'concurrent-conflict', 'stress-long-content', 'high-density'];
const assemblyStates = ['loading', 'offline', 'restricted', 'stale'];
const saveOutcomes = ['success', 'failure', 'reauth-required', 'unknown'];
const rotationOutcomes = ['success', 'failure', 'reauth-failed', 'unknown'];

class CDPClient {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket.onopen = resolve;
      this.socket.onerror = reject;
      this.socket.onmessage = ({ data }) => {
        const message = JSON.parse(data);
        const request = this.pending.get(message.id);
        if (!request) return;
        this.pending.delete(message.id);
        message.error ? request.reject(message.error) : request.resolve(message.result);
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket.close();
  }
}

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function storyUrl(params = {}) {
  const search = new URLSearchParams({ id: storyId, viewMode: 'story', ...params });
  return `${storybookBaseUrl}/iframe.html?${search.toString()}`;
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Browser evaluation failed.');
  return result.result?.value;
}

async function waitForStableStory(client) {
  for (let attempt = 0; attempt < 240; attempt++) {
    await delay(250);
    const ready = await evaluate(client, `(() => {
      const root = document.querySelector('#storybook-root');
      return Boolean(root && root.textContent.trim().length > 0);
    })()`);
    if (ready) return;
  }
  const diagnostic = await evaluate(client, `({ location: location.href, title: document.title, text: document.body?.innerText?.slice(0, 1200) })`);
  throw new Error(`Story did not render: ${JSON.stringify(diagnostic)}`);
}

async function runAxe(client) {
  await client.send('Runtime.evaluate', { expression: axeSource });
  return evaluate(client, `axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }
  }).then(({ violations, passes, incomplete }) => ({
    violationCount: violations.length,
    violations: violations.map(({ id, impact, description, nodes }) => ({ id, impact, description, targets: nodes.map((node) => node.target) })),
    passCount: passes.length,
    incompleteCount: incomplete.length
  }))`);
}

async function getLayoutEvidence(client) {
  return evaluate(client, `(() => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
    const clientWidth = window.innerWidth;
    const controls = Array.from(document.querySelectorAll('button:not([hidden]), [role="button"]:not([hidden]), [role="combobox"]:not([hidden])')).filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return element.offsetParent !== null && style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    });
    let overlappingControls = 0;
    const overlapPairs = [];
    for (let i = 0; i < controls.length; i++) {
      const a = controls[i].getBoundingClientRect();
      if (!a.width || !a.height) continue;
      for (let j = i + 1; j < controls.length; j++) {
        const b = controls[j].getBoundingClientRect();
        if (!b.width || !b.height) continue;
        if (!(b.left >= a.right || b.right <= a.left || b.top >= a.bottom || b.bottom <= a.top)) {
          overlappingControls++;
          overlapPairs.push({
            firstText: controls[i].textContent.trim() || controls[i].getAttribute('aria-label'),
            secondText: controls[j].textContent.trim() || controls[j].getAttribute('aria-label')
          });
        }
      }
    }
    return {
      text: body.innerText,
      hasHorizontalScroll: scrollWidth > clientWidth + 2,
      scrollWidth,
      clientWidth,
      overlappingControls,
      overlapPairs,
      statusRegions: document.querySelectorAll('[role="status"]').length,
      navItems: document.querySelectorAll('.plant-settings-nav-button').length,
    };
  })()`);
}

function runSourceStressChecks() {
  assert.doesNotMatch(settingsSource, /#[0-9a-f]{3,8}\b/i, 'Plant settings source contains a raw hex color.');
  assert.doesNotMatch(settingsSource, /['"]\d+(?:\.\d+)?px['"]/, 'Plant settings source contains a raw px literal.');
  assert.doesNotMatch(settingsSource, /[Ã‚ï¿½]|Ã¢[^\s]*/u, 'Plant settings source contains mojibake-like text.');
  assert.doesNotMatch(settingsSource, /\b(password|secret|api[_-]?key|bearer|token)\b/i, 'Plant settings source contains secret-like text.');
}

async function runScenarioMatrix(client, evidence) {
  for (const viewport of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile });
    for (const scenario of scenarios) {
      await client.send('Page.navigate', { url: storyUrl({ settingsScenario: scenario, settingsSection: scenario === 'restricted-section' ? 'access' : 'general' }) });
      await waitForStableStory(client);
      await delay(300);

      const axe = await runAxe(client);
      const layout = await getLayoutEvidence(client);

      assert.equal(axe.violationCount, 0, `${viewport.name}/${scenario} axe violations: ${JSON.stringify(axe.violations)}`);
      assert.equal(layout.hasHorizontalScroll, false, `${viewport.name}/${scenario} has horizontal overflow.`);
      assert.equal(layout.overlappingControls, 0, `${viewport.name}/${scenario} has overlapping controls: ${JSON.stringify(layout.overlapPairs)}`);
      assert.ok(layout.statusRegions >= 1, `${viewport.name}/${scenario} is missing status region.`);

      if (scenario === 'dirty') {
        assert.match(layout.text, /Unsaved modifications/i, `${viewport.name}/${scenario} missing dirty banner.`);
      }
      if (scenario === 'concurrent-conflict') {
        assert.match(layout.text, /Concurrent modification detected/i, `${viewport.name}/${scenario} missing conflict status.`);
      }
      if (scenario === 'restricted-section') {
        assert.match(layout.text, /Restricted section access/i, `${viewport.name}/${scenario} missing restricted message.`);
      }

      evidence.scenarioMatrix.push({ viewport: viewport.name, width: viewport.width, height: viewport.height, scenario, axe, layout });
    }
  }
}

async function runAssemblyStateMatrix(client, evidence) {
  await client.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  for (const assemblyState of assemblyStates) {
    await client.send('Page.navigate', { url: storyUrl({ assemblyState }) });
    await waitForStableStory(client);
    await delay(250);

    const axe = await runAxe(client);
    const layout = await getLayoutEvidence(client);

    assert.equal(axe.violationCount, 0, `assemblyState=${assemblyState} axe violations: ${JSON.stringify(axe.violations)}`);
    assert.equal(layout.hasHorizontalScroll, false, `assemblyState=${assemblyState} has horizontal overflow.`);
    assert.equal(layout.overlappingControls, 0, `assemblyState=${assemblyState} has overlapping controls: ${JSON.stringify(layout.overlapPairs)}`);

    evidence.assemblyStates.push({ assemblyState, axe, hasHorizontalScroll: layout.hasHorizontalScroll, overlappingControls: layout.overlappingControls, textSample: layout.text.slice(0, 240) });
  }
}

async function runSaveOutcomeMatrix(client, evidence) {
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });
  for (const saveOutcome of saveOutcomes) {
    await client.send('Page.navigate', { url: storyUrl({ settingsScenario: 'ready', saveOutcome, settingsSection: 'general' }) });
    await waitForStableStory(client);
    await delay(250);

    const result = await evaluate(client, `new Promise((resolve) => {
      const startedAt = performance.now();
      const saveBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Save regional defaults'));
      if (!saveBtn) { resolve({ found: false }); return; }
      saveBtn.click();
      let pendingMs = null;
      const timer = setInterval(() => {
        const text = document.body.innerText;
        if (pendingMs === null && /Saving…/i.test(text)) pendingMs = Math.round(performance.now() - startedAt);
        if (/saved successfully|Save failed|Re-authentication required|Save outcome unknown/i.test(text)) {
          clearInterval(timer);
          resolve({ found: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: text.slice(0, 500) });
        }
      }, 20);
      setTimeout(() => {
        clearInterval(timer);
        resolve({ found: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: document.body.innerText.slice(0, 500) });
      }, 1800);
    })`);

    assert.equal(result.found, true, `Save button not found for outcome ${saveOutcome}.`);
    assert.ok(result.pendingMs <= 120, `Save pending state took ${result.pendingMs} ms for ${saveOutcome}.`);
    evidence.saveOutcomes.push({ saveOutcome, ...result });
  }
}

mkdirSync(outputDirectory, { recursive: true });
mkdirSync(profileDirectory, { recursive: true });
runSourceStressChecks();

const edge = spawn(edgePath, [
  '--headless=new',
  '--disable-gpu',
  '--disable-crash-reporter',
  '--disable-dev-shm-usage',
  '--no-first-run',
  '--no-default-browser-check',
  '--remote-allow-origins=*',
  `--remote-debugging-port=${cdpPort}`,
  `--user-data-dir=${profileDirectory}`,
  'about:blank',
], { stdio: 'inherit' });

let client;
const evidence = {
  assembly: 'ra-plant-settings',
  version: '0.1.0',
  executedAt: new Date().toISOString(),
  storybookBaseUrl,
  sourceStressChecks: 'pass',
  scenarioMatrix: [],
  assemblyStates: [],
  saveOutcomes: [],
};

try {
  let webSocketUrl;
  for (let attempt = 0; attempt < 80; attempt++) {
    await delay(250);
    try {
      const targets = await fetch(`http://127.0.0.1:${cdpPort}/json/list`).then((response) => response.json());
      webSocketUrl = targets.find((target) => target.type === 'page')?.webSocketDebuggerUrl;
      if (webSocketUrl) break;
    } catch {
      // Edge is starting
    }
  }
  if (!webSocketUrl) throw new Error('Edge DevTools endpoint did not become ready.');

  client = new CDPClient(webSocketUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  await runScenarioMatrix(client, evidence);
  await runAssemblyStateMatrix(client, evidence);
  await runSaveOutcomeMatrix(client, evidence);

  const outputPath = join(outputDirectory, '2026-09-29-screen-stress-evidence.json');
  writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Plant settings screen stress tests passed. Evidence: ${outputPath}`);
} finally {
  client?.close();
  edge.kill();
  await Promise.race([new Promise((resolve) => edge.once('exit', resolve)), delay(3000)]);
  try {
    rmSync(profileDirectory, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    console.warn(`Temporary Edge profile remains: ${profileDirectory}`);
  }
}
