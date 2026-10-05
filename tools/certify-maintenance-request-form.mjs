import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cdpPort = Number(process.env.MDS_CDP_PORT || 9600 + Math.floor(Math.random() * 400));
const storybookBaseUrl = process.env.MDS_STORYBOOK_URL || 'http://127.0.0.1:6006';
const storyId = 'reference-assemblies-candidate-overview--form-example';
const outputDirectory = join(process.cwd(), 'audits', 'assemblies', 'maintenance-request-form', 'certification');
const profileDirectory = join(tmpdir(), `mds-mrf-certification-${Date.now()}`);
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const storySource = readFileSync(new URL('../apps/storybook/src/stories/ReferenceAssemblies.stories.tsx', import.meta.url), 'utf8');
const formSource = storySource.slice(
  storySource.indexOf('export const FormExample'),
  storySource.indexOf('export const SettingsExample')
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

async function waitForForm(client) {
  for (let attempt = 0; attempt < 120; attempt++) {
    await delay(250);
    const ready = await evaluate(client, `Boolean(document.querySelector('form') && document.querySelector('#maintenance-title'))`);
    if (ready) return;
  }
  const diagnostic = await evaluate(client, `({
    location: location.href,
    title: document.title,
    text: document.body?.innerText?.slice(0, 1200),
    html: document.body?.innerHTML?.slice(0, 1200)
  })`);
  throw new Error(`Maintenance request form did not render: ${JSON.stringify(diagnostic)}`);
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
    const controls = Array.from(document.querySelectorAll('button:not([hidden]), [role="button"]:not([hidden]), [role="switch"]:not([hidden])')).filter((element) => {
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
            firstText: controls[i].textContent.trim() || controls[i].getAttribute('aria-label') || controls[i].id,
            secondText: controls[j].textContent.trim() || controls[j].getAttribute('aria-label') || controls[j].id,
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
      statusRegions: document.querySelectorAll('[role="status"]').length,
      switches: Array.from(document.querySelectorAll('[role="switch"]')).map((switchElement) => ({
        label: switchElement.getAttribute('aria-labelledby') ? document.getElementById(switchElement.getAttribute('aria-labelledby'))?.textContent : switchElement.getAttribute('aria-label'),
        describedBy: switchElement.getAttribute('aria-describedby'),
      })),
      formFields: document.querySelectorAll('input, [role="combobox"]').length,
      actionButtons: Array.from(document.querySelectorAll('button')).map((button) => button.textContent.trim()),
    };
  })()`);
}

function runSourceChecks() {
  assert.doesNotMatch(formSource, /#[0-9a-f]{3,8}\b/i, 'Maintenance form source contains a raw hex color.');
  assert.doesNotMatch(formSource, /['"]\d+(?:\.\d+)?px['"]/, 'Maintenance form source contains a raw px literal.');
  assert.doesNotMatch(formSource, /[Ã‚ï¿½]|Ã¢[^\s]*/u, 'Maintenance form source contains mojibake-like text.');
  assert.doesNotMatch(formSource, /\b(password|secret|api[_-]?key|bearer|token)\b/i, 'Maintenance form source contains secret-like text.');
  for (const contract of [
    'MAINTENANCE_FORM_SCENARIO_ITEMS',
    'MAINTENANCE_SUBMIT_OUTCOME_ITEMS',
    'MAINTENANCE_DRAFT_OUTCOME_ITEMS',
    'parseMaintenanceCost',
    'data-harness="remove-on-copy"',
  ]) {
    assert.ok(storySource.includes(contract), `Maintenance form source contract missing: ${contract}`);
  }
}

async function runActionChecks(client, evidence) {
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });

  await client.send('Page.navigate', { url: storyUrl({ formScenario: 'ready', submitOutcome: 'success' }) });
  await waitForForm(client);
  await delay(250);
  const submitEvidence = await evaluate(client, `new Promise((resolve) => {
    const startedAt = performance.now();
    const submit = Array.from(document.querySelectorAll('button')).find((button) => button.textContent.includes('Submit request'));
    if (!submit) {
      resolve({ found: false });
      return;
    }
    submit.click();
    let pendingMs = null;
    const timer = setInterval(() => {
      const text = document.body.innerText;
      if (pendingMs === null && /Submitting request|Submitting maintenance request/.test(text)) {
        pendingMs = Math.round(performance.now() - startedAt);
      }
      if (/Maintenance request submitted successfully|Maintenance request submitted/.test(text)) {
        clearInterval(timer);
        resolve({ found: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: text.slice(0, 500) });
      }
    }, 20);
    setTimeout(() => {
      clearInterval(timer);
      resolve({ found: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: document.body.innerText.slice(0, 500) });
    }, 1800);
  })`);
  assert.equal(submitEvidence.found, true, 'Submit button not found.');
  assert.ok(submitEvidence.pendingMs <= 120, `Submit pending state took ${submitEvidence.pendingMs} ms.`);
  assert.match(submitEvidence.textSample, /Maintenance request submitted/, 'Submit success outcome was not announced.');
  evidence.actions.push({ action: 'submit-success', ...submitEvidence });

  await client.send('Page.navigate', { url: storyUrl({ formScenario: 'ready', draftOutcome: 'failure' }) });
  await waitForForm(client);
  await delay(250);
  const draftEvidence = await evaluate(client, `new Promise((resolve) => {
    const startedAt = performance.now();
    const draft = Array.from(document.querySelectorAll('button')).find((button) => button.textContent.includes('Save as Draft'));
    if (!draft) {
      resolve({ found: false });
      return;
    }
    draft.click();
    let pendingMs = null;
    const timer = setInterval(() => {
      const text = document.body.innerText;
      if (pendingMs === null && /Saving maintenance request draft|Saving draft/.test(text)) {
        pendingMs = Math.round(performance.now() - startedAt);
      }
      if (/Draft save failed|Draft not saved/.test(text)) {
        clearInterval(timer);
        resolve({ found: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: text.slice(0, 500) });
      }
    }, 20);
    setTimeout(() => {
      clearInterval(timer);
      resolve({ found: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: document.body.innerText.slice(0, 500) });
    }, 1600);
  })`);
  assert.equal(draftEvidence.found, true, 'Draft button not found.');
  assert.ok(draftEvidence.pendingMs <= 120, `Draft pending state took ${draftEvidence.pendingMs} ms.`);
  assert.match(draftEvidence.textSample, /Draft save failed|Draft not saved/, 'Draft failure outcome was not announced.');
  evidence.actions.push({ action: 'draft-failure', ...draftEvidence });
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
  assembly: 'ra-maintenance-request-form',
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
    await client.send('Page.navigate', { url: storyUrl({ formScenario: 'ready' }) });
    await waitForForm(client);
    await delay(350);

    const axe = await runAxe(client);
    const layout = await getLayoutEvidence(client);

    assert.equal(axe.violationCount, 0, `${viewport.name} axe violations: ${JSON.stringify(axe.violations)}`);
    assert.equal(layout.hasHorizontalScroll, false, `${viewport.name} has horizontal overflow.`);
    assert.equal(layout.overlappingControls, 0, `${viewport.name} has overlapping controls: ${JSON.stringify(layout.overlapPairs)}`);
    assert.ok(layout.statusRegions >= 1, `${viewport.name} is missing a status region.`);
    assert.ok(layout.switches.length >= 2, `${viewport.name} is missing dispatch switches.`);
    assert.ok(layout.switches.every((item) => item.label), `${viewport.name} has an unlabeled switch: ${JSON.stringify(layout.switches)}`);
    assert.ok(layout.actionButtons.some((text) => text.includes('Submit request')), `${viewport.name} is missing submit action.`);

    evidence.viewports.push({
      viewport: viewport.name,
      width: viewport.width,
      height: viewport.height,
      axe,
      layout: {
        hasHorizontalScroll: layout.hasHorizontalScroll,
        scrollWidth: layout.scrollWidth,
        clientWidth: layout.clientWidth,
        overlappingControls: layout.overlappingControls,
        statusRegions: layout.statusRegions,
        switches: layout.switches,
        formFields: layout.formFields,
        actionButtons: layout.actionButtons,
      },
    });
  }

  await runActionChecks(client, evidence);

  const outputPath = join(outputDirectory, '2026-09-29-technical-gate-evidence.json');
  writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Maintenance request form technical certification gates passed. Evidence: ${outputPath}`);
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
