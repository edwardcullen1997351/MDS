import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cdpPort = Number(process.env.MDS_CDP_PORT || 11100 + Math.floor(Math.random() * 400));
const storybookBaseUrl = process.env.MDS_STORYBOOK_URL || 'http://127.0.0.1:6006';
const storyId = 'reference-assemblies-candidate-overview--record-list-example';
const outputDirectory = join(process.cwd(), 'audits', 'assemblies', 'work-order-register', 'certification');
const profileDirectory = join(tmpdir(), `mds-wor-certification-${Date.now()}`);
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const storySource = readFileSync(new URL('../apps/storybook/src/stories/ReferenceAssemblies.stories.tsx', import.meta.url), 'utf8');
const registerSource = storySource.slice(
  storySource.indexOf('export const RecordListExample'),
  storySource.indexOf('export const RecordDetailExample')
);

const viewports = [
  { name: 'desktop', width: 1440, height: 1200, mobile: false },
  { name: 'tablet', width: 768, height: 1024, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true },
];

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

async function waitForRegister(client) {
  for (let attempt = 0; attempt < 180; attempt++) {
    await delay(250);
    const ready = await evaluate(client, `document.body?.innerText?.includes('Work order register')`);
    if (ready) return;
  }
  const diagnostic = await evaluate(client, `({ location: location.href, title: document.title, text: document.body?.innerText?.slice(0, 1200) })`);
  throw new Error(`Work order register did not render: ${JSON.stringify(diagnostic)}`);
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
    const visible = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
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
          overlapPairs.push({ firstText: controls[i].textContent.trim() || controls[i].getAttribute('aria-label'), secondText: controls[j].textContent.trim() || controls[j].getAttribute('aria-label') });
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
      visibleTable: visible('.work-order-register-table'),
      visibleCards: visible('.work-order-register-list'),
      tableRows: document.querySelectorAll('.work-order-register-table tbody tr').length,
      cards: document.querySelectorAll('.work-order-card').length,
      statusRegions: document.querySelectorAll('[role="status"]').length,
      checkboxes: document.querySelectorAll('input[type="checkbox"]').length,
    };
  })()`);
}

function runSourceChecks() {
  assert.doesNotMatch(registerSource, /#[0-9a-f]{3,8}\b/i, 'Work order register source contains a raw hex color.');
  assert.doesNotMatch(registerSource, /['"]\d+(?:\.\d+)?px['"]/, 'Work order register source contains a raw px literal.');
  assert.doesNotMatch(registerSource, /[Ã‚ï¿½]|Ã¢[^\s]*/u, 'Work order register source contains mojibake-like text.');
  assert.doesNotMatch(registerSource, /\b(password|secret|api[_-]?key|bearer|token)\b/i, 'Work order register source contains secret-like text.');
  for (const contract of ['WORK_ORDER_REGISTER_SCENARIO_ITEMS', 'WORK_ORDER_BULK_OUTCOME_ITEMS', 'Confirm delete selected', 'work-order-register-list']) {
    assert.ok(storySource.includes(contract), `Work order register source contract missing: ${contract}`);
  }
}

async function runBulkActionCheck(client, evidence) {
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });
  await client.send('Page.navigate', { url: storyUrl({ registerScenario: 'selected', bulkOutcome: 'success' }) });
  await waitForRegister(client);
  await delay(1200);
  const actionEvidence = await evaluate(client, `new Promise((resolve) => {
    const startedAt = performance.now();
    const first = Array.from(document.querySelectorAll('button')).find((button) => button.textContent.includes('Bulk Delete'));
    if (!first) {
      resolve({ found: false });
      return;
    }
    first.click();
    const waitForConfirm = setInterval(() => {
      const second = Array.from(document.querySelectorAll('button')).find((button) => button.textContent.includes('Confirm delete selected'));
      if (!second) return;
      clearInterval(waitForConfirm);
      second.click();
    }, 20);
    let pendingMs = null;
    const timer = setInterval(() => {
      const text = document.body.innerText;
      if (pendingMs === null && /Deleting \\d+ selected/.test(text)) pendingMs = Math.round(performance.now() - startedAt);
      if (/Selected work orders deleted/.test(text)) {
        clearInterval(waitForConfirm);
        clearInterval(timer);
        resolve({ found: true, confirmVisible: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: text.slice(0, 600) });
      }
    }, 20);
    setTimeout(() => {
      clearInterval(waitForConfirm);
      clearInterval(timer);
      resolve({ found: true, confirmVisible: Boolean(document.body.innerText.includes('Confirm delete selected') || pendingMs !== null), pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: document.body.innerText.slice(0, 600) });
    }, 1800);
  })`);
  assert.equal(actionEvidence.found, true, 'Bulk delete button was not found.');
  assert.equal(actionEvidence.confirmVisible, true, 'Bulk delete confirmation was not exposed.');
  assert.ok(actionEvidence.pendingMs <= 300, `Bulk delete pending state took ${actionEvidence.pendingMs} ms.`);
  assert.match(actionEvidence.textSample, /Selected work orders deleted/, 'Bulk delete success outcome was not announced.');
  evidence.actions.push({ action: 'bulk-delete-success', ...actionEvidence });
}

mkdirSync(outputDirectory, { recursive: true });
mkdirSync(profileDirectory, { recursive: true });
runSourceChecks();

const edge = spawn(edgePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-allow-origins=*',
  `--remote-debugging-port=${cdpPort}`,
  `--user-data-dir=${profileDirectory}`,
  'about:blank',
], { stdio: 'inherit' });

let client;
const evidence = {
  assembly: 'ra-work-order-register',
  version: '0.1.0',
  executedAt: new Date().toISOString(),
  storybookBaseUrl,
  sourceChecks: 'pass',
  viewports: [],
  actions: [],
};

try {
  let webSocketUrl;
  for (let attempt = 0; attempt < 80; attempt++) {
    await delay(250);
    try {
      const res = await fetch(`http://127.0.0.1:${cdpPort}/json/list`);
      if (res.ok) {
        const targets = await res.json();
        webSocketUrl = targets.find((target) => target.type === 'page')?.webSocketDebuggerUrl;
        if (!webSocketUrl) {
          const created = await fetch(`http://127.0.0.1:${cdpPort}/json/new`, { method: 'PUT' }).then((r) => r.json()).catch(() => null);
          if (created?.webSocketDebuggerUrl) {
            webSocketUrl = created.webSocketDebuggerUrl;
          }
        }
        if (webSocketUrl) break;
      }
    } catch {
      // Edge is still starting.
    }
  }
  if (!webSocketUrl) throw new Error('Edge DevTools endpoint did not become ready.');

  client = new CDPClient(webSocketUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  for (const viewport of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile });
    await client.send('Page.navigate', { url: storyUrl({ registerScenario: 'ready' }) });
    await waitForRegister(client);
    await delay(350);
    const axe = await runAxe(client);
    const layout = await getLayoutEvidence(client);

    assert.equal(axe.violationCount, 0, `${viewport.name} axe violations: ${JSON.stringify(axe.violations)}`);
    assert.equal(layout.hasHorizontalScroll, false, `${viewport.name} has horizontal overflow.`);
    assert.equal(layout.overlappingControls, 0, `${viewport.name} has overlapping controls: ${JSON.stringify(layout.overlapPairs)}`);
    assert.ok(layout.statusRegions >= 1, `${viewport.name} is missing status region.`);
    assert.ok(layout.checkboxes >= 2, `${viewport.name} is missing selection controls.`);
    if (viewport.width <= 900) {
      assert.equal(layout.visibleTable, false, `${viewport.name} still exposes the table.`);
      assert.equal(layout.visibleCards, true, `${viewport.name} card list is not visible.`);
      assert.ok(layout.cards >= 1, `${viewport.name} work order cards are missing.`);
    } else {
      assert.equal(layout.visibleTable, true, `${viewport.name} table is not visible.`);
    }

    evidence.viewports.push({ viewport: viewport.name, width: viewport.width, height: viewport.height, axe, layout });
  }

  await runBulkActionCheck(client, evidence);

  const outputPath = join(outputDirectory, '2026-09-29-technical-gate-evidence.json');
  writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Work order register technical certification gates passed. Evidence: ${outputPath}`);
} finally {
  client?.close();
  edge.kill();
  await Promise.race([new Promise((resolve) => edge.once('exit', resolve)), delay(3000)]);
  try {
    rmSync(profileDirectory, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  } catch {
    console.warn(`Temporary Edge profile remains for operating-system cleanup: ${profileDirectory}`);
  }
}
