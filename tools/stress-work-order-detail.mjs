import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cdpPort = Number(process.env.MDS_CDP_PORT || 9820 + Math.floor(Math.random() * 200));
const storybookBaseUrl = process.env.MDS_STORYBOOK_URL || 'http://127.0.0.1:6006';
const storyId = 'reference-assemblies-candidate-overview--record-detail-example';
const outputDirectory = join(process.cwd(), 'audits', 'assemblies', 'work-order-detail', 'certification');
const profileDirectory = join(tmpdir(), `mds-wod-stress-${Date.now()}`);
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');

const viewports = [
  { name: 'mobile-narrow', width: 320, height: 844, mobile: true },
  { name: 'mobile', width: 390, height: 844, mobile: true },
  { name: 'tablet', width: 768, height: 1024, mobile: false },
  { name: 'desktop', width: 1440, height: 1200, mobile: false },
];

const scenarios = [
  'ready',
  'dirty',
  'on-hold',
  'restricted-planner',
  'concurrent-conflict',
  'stress-long-content',
  'high-density-history',
];
const assemblyStates = ['loading', 'offline', 'restricted', 'stale'];
const saveOutcomes = ['success', 'failure', 'reauth-required', 'unknown'];
const holdOutcomes = ['success', 'failure'];

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
      hasHorizontalScroll: scrollWidth > clientWidth + 2,
      scrollWidth,
      clientWidth,
      overlappingControls,
      overlapPairs,
      statusRegions: document.querySelectorAll('[role="status"]').length,
    };
  })()`);
}

mkdirSync(outputDirectory, { recursive: true });
mkdirSync(profileDirectory, { recursive: true });

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
  assembly: 'ra-work-order-detail',
  version: '0.1.0',
  executedAt: new Date().toISOString(),
  storybookBaseUrl,
  scenarios: [],
  states: [],
  saveOutcomes: [],
  holdOutcomes: [],
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

  // Matrix: 7 scenarios x 4 viewports
  for (const scenario of scenarios) {
    for (const viewport of viewports) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
      });
      await client.send('Page.navigate', { url: storyUrl({ detailScenario: scenario }) });
      await waitForStableStory(client);
      await delay(250);

      const axe = await runAxe(client);
      const layout = await getLayoutEvidence(client);

      assert.equal(axe.violationCount, 0, `Scenario ${scenario} on ${viewport.name} axe violations: ${JSON.stringify(axe.violations)}`);
      assert.equal(layout.hasHorizontalScroll, false, `Scenario ${scenario} on ${viewport.name} has horizontal overflow.`);
      assert.equal(layout.overlappingControls, 0, `Scenario ${scenario} on ${viewport.name} has overlapping controls: ${JSON.stringify(layout.overlapPairs)}`);

      evidence.scenarios.push({
        scenario,
        viewport: viewport.name,
        width: viewport.width,
        height: viewport.height,
        axePasses: axe.passCount,
        hasHorizontalScroll: layout.hasHorizontalScroll,
        overlappingControls: layout.overlappingControls,
      });
    }
  }

  // 4 Assembly States (desktop)
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });
  for (const state of assemblyStates) {
    await client.send('Page.navigate', { url: storyUrl({ assemblyState: state }) });
    await waitForStableStory(client);
    await delay(250);

    const axe = await runAxe(client);
    const layout = await getLayoutEvidence(client);

    assert.equal(axe.violationCount, 0, `State ${state} axe violations: ${JSON.stringify(axe.violations)}`);
    assert.equal(layout.hasHorizontalScroll, false, `State ${state} has horizontal overflow.`);
    assert.equal(layout.overlappingControls, 0, `State ${state} has overlapping controls.`);

    evidence.states.push({
      state,
      axePasses: axe.passCount,
      hasHorizontalScroll: layout.hasHorizontalScroll,
      overlappingControls: layout.overlappingControls,
    });
  }

  // 4 Save Outcomes (desktop)
  for (const outcome of saveOutcomes) {
    await client.send('Page.navigate', { url: storyUrl({ saveOutcome: outcome }) });
    await waitForStableStory(client);
    await delay(250);

    const axe = await runAxe(client);
    const layout = await getLayoutEvidence(client);

    assert.equal(axe.violationCount, 0, `Save outcome ${outcome} axe violations: ${JSON.stringify(axe.violations)}`);
    assert.equal(layout.hasHorizontalScroll, false, `Save outcome ${outcome} has horizontal overflow.`);

    evidence.saveOutcomes.push({
      outcome,
      axePasses: axe.passCount,
      hasHorizontalScroll: layout.hasHorizontalScroll,
    });
  }

  // 2 Hold Outcomes (desktop)
  for (const outcome of holdOutcomes) {
    await client.send('Page.navigate', { url: storyUrl({ holdOutcome: outcome }) });
    await waitForStableStory(client);
    await delay(250);

    const axe = await runAxe(client);
    const layout = await getLayoutEvidence(client);

    assert.equal(axe.violationCount, 0, `Hold outcome ${outcome} axe violations: ${JSON.stringify(axe.violations)}`);
    assert.equal(layout.hasHorizontalScroll, false, `Hold outcome ${outcome} has horizontal overflow.`);

    evidence.holdOutcomes.push({
      outcome,
      axePasses: axe.passCount,
      hasHorizontalScroll: layout.hasHorizontalScroll,
    });
  }

  const outputPath = join(outputDirectory, '2026-09-30-screen-stress-evidence.json');
  writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Work order detail screen stress testing passed (${evidence.scenarios.length + evidence.states.length + evidence.saveOutcomes.length + evidence.holdOutcomes.length} matrix checks). Evidence: ${outputPath}`);
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
