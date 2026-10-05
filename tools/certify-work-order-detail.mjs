import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cdpPort = Number(process.env.MDS_CDP_PORT || 9720 + Math.floor(Math.random() * 200));
const storybookBaseUrl = process.env.MDS_STORYBOOK_URL || 'http://127.0.0.1:6006';
const storyId = 'reference-assemblies-candidate-overview--record-detail-example';
const outputDirectory = join(process.cwd(), 'audits', 'assemblies', 'work-order-detail', 'certification');
const profileDirectory = join(tmpdir(), `mds-wod-certification-${Date.now()}`);
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const storySource = readFileSync(new URL('../apps/storybook/src/stories/ReferenceAssemblies.stories.tsx', import.meta.url), 'utf8');
const workOrderDetailSource = storySource.slice(
  storySource.indexOf('export const RecordDetailExample'),
  storySource.indexOf('export const DashboardExample')
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
  if (result.exceptionDetails) {
    const desc = result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'Browser evaluation failed.';
    throw new Error(`Browser evaluation failed: ${desc}`);
  }
  return result.result?.value;
}

async function waitForWorkOrderDetail(client) {
  for (let attempt = 0; attempt < 180; attempt++) {
    await delay(250);
    const ready = await evaluate(client, `document.body?.innerText?.includes('WO-561204')`);
    if (ready) return;
  }
  const diagnostic = await evaluate(client, `({ location: location.href, title: document.title, text: document.body?.innerText?.slice(0, 1200) })`);
  throw new Error(`Work order detail did not render: ${JSON.stringify(diagnostic)}`);
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
    const tabCard = document.querySelector('.work-order-detail-card:has(.ds-tabs)');
    const firstTab = document.querySelector('.ds-tab-trigger');
    const tabInsetLeft = (tabCard && firstTab)
      ? Math.round(firstTab.getBoundingClientRect().left - tabCard.getBoundingClientRect().left)
      : null;

    const statusRows = Array.from(document.querySelectorAll('.work-order-detail-status-row'));
    const minStatusRowHeight = statusRows.length
      ? Math.round(Math.min(...statusRows.map(r => r.getBoundingClientRect().height)))
      : null;

    const evidenceItems = Array.from(document.querySelectorAll('.work-order-detail-evidence-item'));
    const minEvidenceItemHeight = evidenceItems.length
      ? Math.round(Math.min(...evidenceItems.map(i => i.getBoundingClientRect().height)))
      : null;

    const metricCards = Array.from(document.querySelectorAll('.work-order-detail-metric'));
    const minMetricPadding = metricCards.length
      ? Math.round(Math.min(...metricCards.map(m => parseFloat(getComputedStyle(m).paddingLeft))))
      : null;

    const sidebar = document.querySelector('.ds-sidebar-layout__sidebar');
    const sidebarWidth = sidebar ? Math.round(sidebar.getBoundingClientRect().width) : null;

    return {
      text: body.innerText,
      hasHorizontalScroll: scrollWidth > clientWidth + 2,
      scrollWidth,
      clientWidth,
      overlappingControls,
      overlapPairs,
      statusRegions: document.querySelectorAll('[role="status"]').length,
      tabs: document.querySelectorAll('[role="tab"]').length,
      metrics: document.querySelectorAll('.work-order-detail-metric').length,
      tabInsetLeft,
      minStatusRowHeight,
      minEvidenceItemHeight,
      minMetricPadding,
      sidebarWidth,
      actionButtons: Array.from(document.querySelectorAll('button')).map((b) => b.textContent.trim()),
    };
  })()`);
}

function runSourceChecks() {
  assert.doesNotMatch(workOrderDetailSource, /#[0-9a-f]{3,8}\b/i, 'Work order detail source contains a raw hex color.');
  assert.doesNotMatch(workOrderDetailSource, /['"]\d+(?:\.\d+)?px['"]/, 'Work order detail source contains a raw px literal.');
  assert.doesNotMatch(workOrderDetailSource, /[Ã‚ï¿½]|Ã¢[^\s]*/u, 'Work order detail source contains mojibake-like text.');
  assert.doesNotMatch(workOrderDetailSource, /\b(password|secret|api[_-]?key|bearer|token)\b/i, 'Work order detail source contains secret-like text.');
  for (const contract of [
    'WORK_ORDER_DETAIL_SCENARIO_ITEMS',
    'WORK_ORDER_DETAIL_SAVE_OUTCOME_ITEMS',
    'WORK_ORDER_DETAIL_HOLD_OUTCOME_ITEMS',
    'work-order-detail-header',
    'work-order-detail-grid',
    'Place work order on hold',
    'Confirm Line Hold',
    'QP-4820-D',
    'WO-561204',
    'POL-AUD-12',
    'data-harness="remove-on-copy"',
  ]) {
    assert.ok(storySource.includes(contract), `Work order detail source contract missing: ${contract}`);
  }
}

async function runActionChecks(client, evidence) {
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });

  // Check 1: Save work order (success -> Rev E)
  await client.send('Page.navigate', { url: storyUrl({ detailScenario: 'ready', saveOutcome: 'success' }) });
  await waitForWorkOrderDetail(client);
  await delay(250);
  const saveEvidence = await evaluate(client, `new Promise((resolve) => {
    const startedAt = performance.now();
    const saveBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Save work order'));
    if (!saveBtn) { resolve({ found: false }); return; }
    saveBtn.click();
    let pendingMs = null;
    const timer = setInterval(() => {
      const text = document.body.innerText;
      if (pendingMs === null && /Saving…|Saving work order/i.test(text)) {
        pendingMs = Math.round(performance.now() - startedAt);
      }
      if (/saved successfully|Rev E active/i.test(text)) {
        clearInterval(timer);
        resolve({ found: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: text.slice(0, 500) });
      }
    }, 20);
    setTimeout(() => {
      clearInterval(timer);
      resolve({ found: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: document.body.innerText.slice(0, 500) });
    }, 1800);
  })`);
  assert.equal(saveEvidence.found, true, 'Save work order button not found.');
  assert.ok(saveEvidence.pendingMs <= 120, `Save pending state took ${saveEvidence.pendingMs} ms.`);
  assert.match(saveEvidence.textSample, /saved successfully|Rev E active/i, 'Save success outcome was not announced.');
  evidence.actions.push({ action: 'save-work-order-success', ...saveEvidence });

  // Check 2: Save work order (failure -> local entries retained)
  await client.send('Page.navigate', { url: storyUrl({ detailScenario: 'dirty', saveOutcome: 'failure' }) });
  await waitForWorkOrderDetail(client);
  await delay(250);
  const failEvidence = await evaluate(client, `new Promise((resolve) => {
    const startedAt = performance.now();
    const saveBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Save work order'));
    if (!saveBtn) { resolve({ found: false }); return; }
    saveBtn.click();
    let pendingMs = null;
    const timer = setInterval(() => {
      const text = document.body.innerText;
      if (pendingMs === null && /Saving…/i.test(text)) {
        pendingMs = Math.round(performance.now() - startedAt);
      }
      if (/Save failed|Unsaved entries are retained|unreachable/i.test(text)) {
        clearInterval(timer);
        resolve({ found: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: text.slice(0, 500) });
      }
    }, 20);
    setTimeout(() => {
      clearInterval(timer);
      resolve({ found: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: document.body.innerText.slice(0, 500) });
    }, 1800);
  })`);
  assert.equal(failEvidence.found, true, 'Save work order button not found for failure check.');
  assert.ok(failEvidence.pendingMs <= 120, `Save failure pending took ${failEvidence.pendingMs} ms.`);
  assert.match(failEvidence.textSample, /Save failed|Unsaved entries are retained|unreachable/i, 'Save failure outcome was not announced.');
  evidence.actions.push({ action: 'save-failure-retained', ...failEvidence });

  // Check 3: Place work order on hold modal workflow
  await client.send('Page.navigate', { url: storyUrl({ detailScenario: 'ready', holdOutcome: 'success' }) });
  await waitForWorkOrderDetail(client);
  await delay(250);
  const holdEvidence = await evaluate(client, `new Promise((resolve) => {
    const startedAt = performance.now();
    const holdBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Place work order on hold'));
    if (!holdBtn) { resolve({ found: false }); return; }
    holdBtn.click();

    setTimeout(() => {
      const modal = document.querySelector('.plant-settings-modal-dialog');
      const confirmBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('Confirm Line Hold'));
      if (!confirmBtn || !modal) { resolve({ found: true, confirmFound: false }); return; }
      confirmBtn.click();

      let pendingMs = null;
      const timer = setInterval(() => {
        const text = document.body.innerText;
        if (pendingMs === null && /Applying hold…|Applying line hold/i.test(text)) {
          pendingMs = Math.round(performance.now() - startedAt);
        }
        if (/placed on Line Hold|Tooling containment active/i.test(text)) {
          clearInterval(timer);
          resolve({ found: true, confirmFound: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: text.slice(0, 600) });
        }
      }, 20);

      setTimeout(() => {
        clearInterval(timer);
        resolve({ found: true, confirmFound: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: document.body.innerText.slice(0, 600) });
      }, 2000);
    }, 60);
  })`);
  assert.equal(holdEvidence.found, true, 'Place work order on hold button not found.');
  assert.equal(holdEvidence.confirmFound, true, 'Confirm Line Hold modal action not found.');
  assert.match(holdEvidence.textSample, /placed on Line Hold|Tooling containment active/i, 'Line hold placement was not confirmed.');
  evidence.actions.push({ action: 'line-hold-workflow', ...holdEvidence });
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
  assembly: 'ra-work-order-detail',
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
          const created = await fetch(`http://127.0.0.1:${cdpPort}/json/new`, { method: 'PUT' }).then(r => r.json()).catch(() => null);
          if (created?.webSocketDebuggerUrl) {
            webSocketUrl = created.webSocketDebuggerUrl;
          }
        }
        if (webSocketUrl) break;
      }
    } catch {
      // Edge is starting
    }
  }
  if (!webSocketUrl) throw new Error('Edge DevTools endpoint did not become ready.');

  client = new CDPClient(webSocketUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('Runtime.enable');

  for (const viewport of viewports) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
    });
    await client.send('Page.navigate', { url: storyUrl({ detailScenario: 'ready' }) });
    await waitForWorkOrderDetail(client);
    await delay(350);

    const axe = await runAxe(client);
    const layout = await getLayoutEvidence(client);

    assert.equal(axe.violationCount, 0, `${viewport.name} axe violations: ${JSON.stringify(axe.violations)}`);
    assert.equal(layout.hasHorizontalScroll, false, `${viewport.name} has horizontal overflow.`);
    assert.equal(layout.overlappingControls, 0, `${viewport.name} has overlapping controls: ${JSON.stringify(layout.overlapPairs)}`);
    assert.ok(layout.statusRegions >= 1, `${viewport.name} is missing status region.`);
    assert.equal(layout.tabs, 3, `${viewport.name} is missing 3 tabs.`);

    // Automated micro-spacing quality gates
    assert.ok(layout.tabInsetLeft >= 16, `${viewport.name} tab list is sticky to the left (${layout.tabInsetLeft}px < 16px inset).`);
    assert.ok(layout.minStatusRowHeight >= 28, `${viewport.name} status rows are too compact (${layout.minStatusRowHeight}px < 28px height).`);
    assert.ok(layout.minEvidenceItemHeight >= 48, `${viewport.name} evidence items are too compact (${layout.minEvidenceItemHeight}px < 48px height).`);
    assert.ok(layout.minMetricPadding >= 12, `${viewport.name} metric cards have insufficient padding (${layout.minMetricPadding}px < 12px).`);
    if (viewport.name === 'desktop') {
      assert.ok(layout.sidebarWidth >= 320, `Desktop sidebar track is too narrow (${layout.sidebarWidth}px < 320px).`);
    }

    evidence.viewports.push({ viewport: viewport.name, width: viewport.width, height: viewport.height, axe, layout });
  }

  await runActionChecks(client, evidence);

  const outputPath = join(outputDirectory, '2026-09-30-technical-gate-evidence.json');
  writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Work order detail technical certification gates passed. Evidence: ${outputPath}`);
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
