import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cdpPort = Number(process.env.MDS_CDP_PORT || 9400 + Math.floor(Math.random() * 500));
const storybookBaseUrl = process.env.MDS_STORYBOOK_URL || 'http://127.0.0.1:6006';
const storyUrl = `${storybookBaseUrl}/iframe.html?id=reference-assemblies-candidate-overview--dashboard-example&viewMode=story`;
const outputDirectory = join(process.cwd(), 'audits', 'assemblies', 'plant-operations-dashboard', 'certification');
const profileDirectory = join(tmpdir(), `mds-pod-certification-${Date.now()}`);
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const storySource = readFileSync(new URL('../apps/storybook/src/stories/ReferenceAssemblies.stories.tsx', import.meta.url), 'utf8');
const dashboardSource = storySource.slice(
  storySource.indexOf('export const DashboardExample'),
  storySource.indexOf('export const FormExample')
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

async function waitForDashboard(client) {
  const startedAt = Date.now();
  for (let attempt = 0; attempt < 120; attempt++) {
    await delay(250);
    const result = await client.send('Runtime.evaluate', {
      expression: "Boolean(document.querySelector('.ds-dashboard'))",
      returnByValue: true,
    });
    if (result.result?.value) return Date.now() - startedAt;
  }

  const diagnostic = await client.send('Runtime.evaluate', {
    expression: "({ location: location.href, title: document.title, text: document.body?.innerText?.slice(0, 1000) })",
    returnByValue: true,
  });
  throw new Error(`Dashboard did not render: ${JSON.stringify(diagnostic.result?.value)}`);
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || 'Browser evaluation failed.');
  }
  return result.result?.value;
}

function assertNoSecretsOrRawPresentation() {
  assert.doesNotMatch(dashboardSource, /#[0-9a-f]{3,8}\b/i, 'Dashboard source contains a raw hex color.');
  assert.doesNotMatch(dashboardSource, /['"]\d+(?:\.\d+)?px['"]/, 'Dashboard source contains a raw px literal.');
  assert.doesNotMatch(dashboardSource, /\b(password|secret|api[_-]?key|bearer|token)\b/i, 'Dashboard source contains secret-like text.');
  assert.match(dashboardSource, /AssemblyStateHarness id="plant-operations-dashboard"/, 'Dashboard does not use the shared inspection harness.');
  assert.match(storySource, /data-harness="remove-on-copy"/, 'Shared inspection harness is not marked removable.');
}

mkdirSync(outputDirectory, { recursive: true });
mkdirSync(profileDirectory, { recursive: true });
assertNoSecretsOrRawPresentation();

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
  assembly: 'ra-plant-operations-dashboard',
  version: '0.2.0',
  executedAt: new Date().toISOString(),
  storyUrl,
  viewports: [],
  securityPrivacySourceScan: 'pass',
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
      // Edge is still starting.
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
    await client.send('Page.navigate', { url: storyUrl });
    const renderMs = await waitForDashboard(client);
    await delay(500);

    await client.send('Runtime.evaluate', { expression: axeSource });
    const axe = await evaluate(client, `axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }
    }).then(({ violations, passes, incomplete }) => ({
      violationCount: violations.length,
      violations: violations.map(({ id, impact, description, nodes }) => ({
        id,
        impact,
        description,
        nodes: nodes.map(({ target, html, failureSummary }) => ({
          target,
          html,
          failureSummary,
        }))
      })),
      passCount: passes.length,
      incompleteCount: incomplete.length
    }))`);

    const layout = await evaluate(client, `(() => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
      const clientWidth = window.innerWidth;
      const priorityTable = document.querySelector('.dashboard-priority-table');
      const priorityList = document.querySelector('.dashboard-priority-list');
      const visible = (element) => {
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
              first: controls[i].outerHTML.slice(0, 220),
              second: controls[j].outerHTML.slice(0, 220),
              firstText: controls[i].textContent.trim(),
              secondText: controls[j].textContent.trim(),
              firstRect: { left: a.left, top: a.top, right: a.right, bottom: a.bottom },
              secondRect: { left: b.left, top: b.top, right: b.right, bottom: b.bottom },
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
        dataTableSummaries: document.querySelectorAll('details summary').length,
        visiblePriorityTable: visible(priorityTable),
        visiblePriorityList: visible(priorityList),
        priorityCards: document.querySelectorAll('.dashboard-priority-card').length,
        dashboardWidgets: document.querySelectorAll('.ds-dashboard-widget').length,
        kpis: document.querySelectorAll('.ds-dashboard__kpis > *').length
      };
    })()`);

    assert.equal(axe.violationCount, 0, `${viewport.name} axe violations: ${JSON.stringify(axe.violations)}`);
    assert.equal(layout.hasHorizontalScroll, false, `${viewport.name} has horizontal overflow.`);
    assert.equal(layout.overlappingControls, 0, `${viewport.name} has overlapping controls: ${JSON.stringify(layout.overlapPairs)}`);
    assert.ok(layout.dataTableSummaries >= 2, `${viewport.name} is missing accessible chart table alternatives.`);
    assert.ok(layout.dashboardWidgets >= 3, `${viewport.name} is missing dashboard modules.`);
    assert.ok(layout.kpis >= 4, `${viewport.name} is missing KPI cards.`);
    if (viewport.name === 'mobile') {
      assert.equal(layout.visiblePriorityTable, false, 'Mobile still exposes the compact priority table.');
      assert.equal(layout.visiblePriorityList, true, 'Mobile priority card list is not visible.');
      assert.ok(layout.priorityCards >= 2, `Mobile priority cards are missing: ${JSON.stringify(layout)}`);
    }

    let exportAcknowledgementMs = null;
    if (viewport.name === 'desktop') {
      exportAcknowledgementMs = await evaluate(client, `new Promise((resolve) => {
        const startedAt = performance.now();
        const buttons = Array.from(document.querySelectorAll('button'));
        const exportButton = buttons.find((button) => button.textContent.includes('Export snapshot'));
        if (!exportButton) {
          resolve(null);
          return;
        }
        exportButton.click();
        const timer = setInterval(() => {
          if (exportButton.textContent.includes('Exporting snapshot')) {
            clearInterval(timer);
            resolve(Math.round(performance.now() - startedAt));
          }
        }, 5);
        setTimeout(() => {
          clearInterval(timer);
          resolve(1000);
        }, 1000);
      })`);
      assert.notEqual(exportAcknowledgementMs, null, 'Export button was not found.');
      assert.ok(exportAcknowledgementMs <= 400, `Export acknowledgement took ${exportAcknowledgementMs} ms.`);
    }

    evidence.viewports.push({
      viewport: viewport.name,
      width: viewport.width,
      height: viewport.height,
      renderMs,
      axe,
      layout,
      exportAcknowledgementMs,
    });
  }

  const evidencePath = join(outputDirectory, '2026-09-28-technical-gate-evidence.json');
  writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Plant operations dashboard technical certification gates passed. Evidence: ${evidencePath}`);
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
