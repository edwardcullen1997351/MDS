import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cdpPort = Number(process.env.MDS_CDP_PORT || 9900 + Math.floor(Math.random() * 400));
const storybookBaseUrl = process.env.MDS_STORYBOOK_URL || 'http://127.0.0.1:6006';
const storyId = 'reference-assemblies-candidate-overview--dashboard-example';
const outputDirectory = join(process.cwd(), 'audits', 'assemblies', 'plant-operations-dashboard', 'certification');
const profileDirectory = join(tmpdir(), `mds-pod-stress-${Date.now()}`);
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const storySource = readFileSync(new URL('../apps/storybook/src/stories/ReferenceAssemblies.stories.tsx', import.meta.url), 'utf8');
const dashboardSource = storySource.slice(
  storySource.indexOf('export const DashboardExample'),
  storySource.indexOf('export const FormExample')
);

const viewports = [
  { name: 'mobile-narrow', width: 320, height: 844, mobile: true },
  { name: 'mobile', width: 390, height: 844, mobile: true },
  { name: 'tablet', width: 768, height: 1024, mobile: false },
  { name: 'desktop', width: 1440, height: 1200, mobile: false },
];

const scenarios = [
  'complete',
  'module-loading',
  'module-error',
  'partial',
  'restricted-module',
  'empty-queue',
  'stress-long-content',
  'stress-max-priority',
];

const assemblyStates = ['loading', 'offline', 'restricted', 'stale'];
const actionOutcomes = ['success', 'failure', 'restricted'];

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
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Browser evaluation failed.');
  return result.result?.value;
}

async function waitForStableStory(client) {
  for (let attempt = 0; attempt < 120; attempt++) {
    await delay(250);
    const ready = await evaluate(client, `(() => {
      const root = document.querySelector('#storybook-root');
      return Boolean(root && root.textContent.trim().length > 0);
    })()`);
    if (ready) return;
  }
  const diagnostic = await evaluate(client, `({
    location: location.href,
    title: document.title,
    text: document.body?.innerText?.slice(0, 1200),
    html: document.body?.innerHTML?.slice(0, 1200)
  })`);
  throw new Error(`Story did not render: ${JSON.stringify(diagnostic)}`);
}

function runSourceStressChecks() {
  assert.doesNotMatch(dashboardSource, /#[0-9a-f]{3,8}\b/i, 'Dashboard source contains a raw hex color.');
  assert.doesNotMatch(dashboardSource, /['"]\d+(?:\.\d+)?px['"]/, 'Dashboard source contains a raw px literal.');
  assert.doesNotMatch(dashboardSource, /[Â�]|â[^\s]*/u, 'Dashboard source contains mojibake-like text.');
  assert.doesNotMatch(dashboardSource, /\b(password|secret|api[_-]?key|bearer|token)\b/i, 'Dashboard source contains secret-like text.');
  for (const contract of ['stress-long-content', 'stress-max-priority', 'Array.from({ length: 50 }']) {
    assert.ok(storySource.includes(contract), `Dashboard stress contract missing: ${contract}`);
  }
}

async function runAxe(client) {
  await client.send('Runtime.evaluate', { expression: axeSource });
  return evaluate(client, `axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }
  }).then(({ violations, passes, incomplete }) => ({
    violationCount: violations.length,
    violations: violations.map(({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      targets: nodes.map((node) => node.target)
    })),
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
    const visible = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const controls = Array.from(document.querySelectorAll('button:not([hidden]), [role="button"]:not([hidden])'));
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
            firstText: controls[i].textContent.trim(),
            secondText: controls[j].textContent.trim(),
            firstRect: { left: a.left, top: a.top, right: a.right, bottom: a.bottom },
            secondRect: { left: b.left, top: b.top, right: b.right, bottom: b.bottom },
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
      dataTableSummaries: document.querySelectorAll('details summary').length,
      visiblePriorityTable: visible('.dashboard-priority-table'),
      visiblePriorityList: visible('.dashboard-priority-list'),
      priorityCards: document.querySelectorAll('.dashboard-priority-card').length,
      priorityRows: document.querySelectorAll('.dashboard-priority-table tbody tr').length,
      dashboardWidgets: document.querySelectorAll('.ds-dashboard-widget').length,
      kpis: document.querySelectorAll('.ds-dashboard__kpis > *').length,
      reviewButtons: Array.from(document.querySelectorAll('button')).filter((button) => button.textContent.includes('Review')).length,
    };
  })()`);
}

async function runScenarioMatrix(client, evidence) {
  for (const viewport of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
    });

    for (const scenario of scenarios) {
      const startedAt = performance.now();
      await client.send('Page.navigate', {
        url: storyUrl({ dashboardScenario: scenario, range: scenario === 'stress-max-priority' ? '30d' : '7d' }),
      });
      await waitForStableStory(client);
      await delay(350);
      const axe = await runAxe(client);
      const layout = await getLayoutEvidence(client);

      assert.equal(axe.violationCount, 0, `${viewport.name}/${scenario} axe violations: ${JSON.stringify(axe.violations)}`);
      assert.equal(layout.hasHorizontalScroll, false, `${viewport.name}/${scenario} has horizontal overflow.`);
      assert.equal(layout.overlappingControls, 0, `${viewport.name}/${scenario} has overlapping controls: ${JSON.stringify(layout.overlapPairs)}`);
      assert.doesNotMatch(layout.text, /[Â�]|â[^\s]*/u, `${viewport.name}/${scenario} rendered mojibake-like text.`);

      if (scenario !== 'empty-queue') assert.ok(layout.kpis >= 4, `${viewport.name}/${scenario} is missing KPI cards.`);
      if (scenario === 'empty-queue') assert.match(layout.text, /No priority actions/, `${viewport.name}/${scenario} missing empty state.`);
      if (scenario === 'module-error') assert.match(layout.text, /telemetry is unavailable/, `${viewport.name}/${scenario} missing module error copy.`);
      if (scenario === 'restricted-module') assert.match(layout.text, /output restricted/, `${viewport.name}/${scenario} missing restricted module copy.`);
      if (scenario === 'partial') assert.match(layout.text, /Partial telemetry/, `${viewport.name}/${scenario} missing partial telemetry disclosure.`);
      if (scenario === 'stress-max-priority') {
        const visiblePriorityRecords = viewport.mobile ? layout.priorityCards : layout.priorityRows;
        assert.equal(visiblePriorityRecords, 50, `${viewport.name}/${scenario} did not render 50 visible priority records.`);
      }
      if (viewport.mobile && scenario !== 'empty-queue') {
        assert.equal(layout.visiblePriorityTable, false, `${viewport.name}/${scenario} exposes the desktop priority table.`);
        assert.equal(layout.visiblePriorityList, true, `${viewport.name}/${scenario} does not expose mobile priority cards.`);
      }

      evidence.scenarioMatrix.push({
        viewport: viewport.name,
        width: viewport.width,
        height: viewport.height,
        scenario,
        elapsedMs: Math.round(performance.now() - startedAt),
        axe,
        layout: {
          hasHorizontalScroll: layout.hasHorizontalScroll,
          scrollWidth: layout.scrollWidth,
          clientWidth: layout.clientWidth,
          overlappingControls: layout.overlappingControls,
          dataTableSummaries: layout.dataTableSummaries,
          visiblePriorityTable: layout.visiblePriorityTable,
          visiblePriorityList: layout.visiblePriorityList,
          priorityCards: layout.priorityCards,
          priorityRows: layout.priorityRows,
          dashboardWidgets: layout.dashboardWidgets,
          kpis: layout.kpis,
        },
      });
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
    assert.equal(layout.overlappingControls, 0, `assemblyState=${assemblyState} has overlapping controls.`);
    evidence.assemblyStates.push({
      assemblyState,
      axe,
      hasHorizontalScroll: layout.hasHorizontalScroll,
      overlappingControls: layout.overlappingControls,
      textSample: layout.text.slice(0, 240),
    });
  }
}

async function runActionOutcomeMatrix(client, evidence) {
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });
  for (const actionOutcome of actionOutcomes) {
    await client.send('Page.navigate', { url: storyUrl({ actionOutcome }) });
    await waitForStableStory(client);
    await delay(350);
    const actionEvidence = await evaluate(client, `new Promise((resolve) => {
      const startedAt = performance.now();
      const exportButton = Array.from(document.querySelectorAll('button')).find((button) => button.textContent.includes('Export snapshot'));
      if (!exportButton) {
        resolve({ found: false });
        return;
      }
      exportButton.click();
      let pendingMs = null;
      const timer = setInterval(() => {
        if (pendingMs === null && exportButton.textContent.includes('Exporting snapshot')) {
          pendingMs = Math.round(performance.now() - startedAt);
        }
        const toastText = document.body.innerText;
        if (/Snapshot exported|Permission required|Export unavailable/.test(toastText)) {
          clearInterval(timer);
          resolve({
            found: true,
            pendingMs,
            outcomeMs: Math.round(performance.now() - startedAt),
            toastMatched: true,
            textSample: toastText.slice(0, 500)
          });
        }
      }, 20);
      setTimeout(() => {
        clearInterval(timer);
        resolve({
          found: true,
          pendingMs,
          outcomeMs: Math.round(performance.now() - startedAt),
          toastMatched: false,
          textSample: document.body.innerText.slice(0, 500)
        });
      }, 1800);
    })`);
    assert.equal(actionEvidence.found, true, `Export button not found for ${actionOutcome}.`);
    assert.ok(actionEvidence.pendingMs <= 100, `Export pending state took ${actionEvidence.pendingMs} ms for ${actionOutcome}.`);
    assert.equal(actionEvidence.toastMatched, true, `Export toast outcome not observed for ${actionOutcome}.`);
    evidence.actionOutcomes.push({ actionOutcome, ...actionEvidence });
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
  assembly: 'ra-plant-operations-dashboard',
  version: '0.2.0',
  executedAt: new Date().toISOString(),
  storybookBaseUrl,
  sourceStressChecks: 'pass',
  scenarioMatrix: [],
  assemblyStates: [],
  actionOutcomes: [],
};

try {
  let webSocketUrl;
  for (let attempt = 0; attempt < 30; attempt++) {
    await delay(250);
    try {
      const targets = await fetch(`http://127.0.0.1:${cdpPort}/json/list`).then((response) => response.json());
      webSocketUrl = targets.find((target) => target.type === 'page')?.webSocketDebuggerUrl;
      if (webSocketUrl) break;
    } catch {
      // Edge is still starting.
    }
  }
  if (!webSocketUrl) throw new Error('Edge DevTools endpoint did not become ready.');

  client = new CDPClient(webSocketUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  await runScenarioMatrix(client, evidence);
  await runAssemblyStateMatrix(client, evidence);
  await runActionOutcomeMatrix(client, evidence);

  const outputPath = join(outputDirectory, '2026-09-29-screen-stress-evidence.json');
  writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Plant operations dashboard screen stress tests passed. Evidence: ${outputPath}`);
} finally {
  client?.close();
  edge.kill();
  await Promise.race([
    new Promise((resolve) => edge.once('exit', resolve)),
    delay(3000),
  ]);
  try {
    rmSync(profileDirectory, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    console.warn(`Temporary Edge profile remains for operating-system cleanup: ${profileDirectory}`);
  }
}
