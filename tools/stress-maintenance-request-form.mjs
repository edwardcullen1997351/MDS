import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cdpPort = Number(process.env.MDS_CDP_PORT || 10100 + Math.floor(Math.random() * 400));
const storybookBaseUrl = process.env.MDS_STORYBOOK_URL || 'http://127.0.0.1:6006';
const storyId = 'reference-assemblies-candidate-overview--form-example';
const outputDirectory = join(process.cwd(), 'audits', 'assemblies', 'maintenance-request-form', 'certification');
const profileDirectory = join(tmpdir(), `mds-mrf-stress-${Date.now()}`);
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');
const storySource = readFileSync(new URL('../apps/storybook/src/stories/ReferenceAssemblies.stories.tsx', import.meta.url), 'utf8');
const formSource = storySource.slice(
  storySource.indexOf('export const FormExample'),
  storySource.indexOf('export const SettingsExample')
);

const viewports = [
  { name: 'mobile-narrow', width: 320, height: 844, mobile: true },
  { name: 'mobile', width: 390, height: 844, mobile: true },
  { name: 'tablet', width: 768, height: 1024, mobile: false },
  { name: 'desktop', width: 1440, height: 1200, mobile: false },
];

const scenarios = ['ready', 'pristine', 'invalid-title', 'invalid-cost', 'draft-recovery', 'stress-long-content'];
const assemblyStates = ['loading', 'offline', 'restricted', 'stale'];
const submitOutcomes = ['success', 'failure', 'partial', 'unknown'];
const draftOutcomes = ['success', 'failure'];

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
  for (let attempt = 0; attempt < 240; attempt++) {
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
      titleValue: document.querySelector('#maintenance-title')?.value || '',
      costValue: document.querySelector('#maintenance-cost')?.value || '',
      errorCount: document.querySelectorAll('[role="alert"], [aria-invalid="true"]').length,
      statusRegions: document.querySelectorAll('[role="status"]').length,
      actionButtons: Array.from(document.querySelectorAll('button')).map((button) => button.textContent.trim()),
      switches: document.querySelectorAll('[role="switch"]').length,
    };
  })()`);
}

function runSourceStressChecks() {
  assert.doesNotMatch(formSource, /#[0-9a-f]{3,8}\b/i, 'Maintenance form source contains a raw hex color.');
  assert.doesNotMatch(formSource, /['"]\d+(?:\.\d+)?px['"]/, 'Maintenance form source contains a raw px literal.');
  assert.doesNotMatch(formSource, /[Ã‚ï¿½]|Ã¢[^\s]*/u, 'Maintenance form source contains mojibake-like text.');
  assert.doesNotMatch(formSource, /\b(password|secret|api[_-]?key|bearer|token)\b/i, 'Maintenance form source contains secret-like text.');
  for (const contract of ['invalid-cost', 'draft-recovery', 'stress-long-content', 'Partial dispatch recorded']) {
    assert.ok(storySource.includes(contract), `Maintenance form stress contract missing: ${contract}`);
  }
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
      await client.send('Page.navigate', { url: storyUrl({ formScenario: scenario }) });
      await waitForStableStory(client);
      await delay(350);
      const axe = await runAxe(client);
      const layout = await getLayoutEvidence(client);

      assert.equal(axe.violationCount, 0, `${viewport.name}/${scenario} axe violations: ${JSON.stringify(axe.violations)}`);
      assert.equal(layout.hasHorizontalScroll, false, `${viewport.name}/${scenario} has horizontal overflow.`);
      assert.equal(layout.overlappingControls, 0, `${viewport.name}/${scenario} has overlapping controls: ${JSON.stringify(layout.overlapPairs)}`);
      assert.doesNotMatch(layout.text, /[Ã‚ï¿½]|Ã¢[^\s]*/u, `${viewport.name}/${scenario} rendered mojibake-like text.`);
      assert.ok(layout.statusRegions >= 1, `${viewport.name}/${scenario} is missing status region.`);
      assert.ok(layout.switches >= 2, `${viewport.name}/${scenario} is missing switches.`);
      if (scenario === 'invalid-title') assert.ok(layout.errorCount >= 1, `${viewport.name}/${scenario} missing title validation error.`);
      if (scenario === 'invalid-cost') assert.ok(layout.errorCount >= 1, `${viewport.name}/${scenario} missing cost validation error.`);
      if (scenario === 'draft-recovery') assert.match(layout.text, /Recovered draft loaded/, `${viewport.name}/${scenario} missing draft recovery status.`);
      if (scenario === 'stress-long-content') assert.ok(layout.titleValue.length > 100, `${viewport.name}/${scenario} missing long title stress data.`);

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
          errorCount: layout.errorCount,
          statusRegions: layout.statusRegions,
          switches: layout.switches,
          titleLength: layout.titleValue.length,
          costValue: layout.costValue,
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
    assert.equal(layout.overlappingControls, 0, `assemblyState=${assemblyState} has overlapping controls: ${JSON.stringify(layout.overlapPairs)}`);
    evidence.assemblyStates.push({
      assemblyState,
      axe,
      hasHorizontalScroll: layout.hasHorizontalScroll,
      overlappingControls: layout.overlappingControls,
      textSample: layout.text.slice(0, 240),
    });
  }
}

async function runSubmitOutcomeMatrix(client, evidence) {
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });
  for (const submitOutcome of submitOutcomes) {
    await client.send('Page.navigate', { url: storyUrl({ submitOutcome }) });
    await waitForStableStory(client);
    await delay(250);
    const actionEvidence = await evaluate(client, `new Promise((resolve) => {
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
        if (pendingMs === null && /Submitting maintenance request|Submitting request/.test(text)) {
          pendingMs = Math.round(performance.now() - startedAt);
        }
        if (/Maintenance request submitted|Submission failed|Partial dispatch recorded|Submission outcome unknown/.test(text)) {
          clearInterval(timer);
          resolve({ found: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: text.slice(0, 600) });
        }
      }, 20);
      setTimeout(() => {
        clearInterval(timer);
        resolve({ found: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: document.body.innerText.slice(0, 600) });
      }, 1800);
    })`);
    assert.equal(actionEvidence.found, true, `Submit button not found for ${submitOutcome}.`);
    assert.ok(actionEvidence.pendingMs <= 120, `Submit pending state took ${actionEvidence.pendingMs} ms for ${submitOutcome}.`);
    assert.match(actionEvidence.textSample, /Maintenance request submitted|Submission failed|Partial dispatch recorded|Submission outcome unknown/, `Submit outcome not observed for ${submitOutcome}.`);
    evidence.submitOutcomes.push({ submitOutcome, ...actionEvidence });
  }
}

async function runDraftOutcomeMatrix(client, evidence) {
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });
  for (const draftOutcome of draftOutcomes) {
    await client.send('Page.navigate', { url: storyUrl({ draftOutcome }) });
    await waitForStableStory(client);
    await delay(250);
    const actionEvidence = await evaluate(client, `new Promise((resolve) => {
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
        if (/Draft saved|Draft save failed|Draft not saved/.test(text)) {
          clearInterval(timer);
          resolve({ found: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: text.slice(0, 600) });
        }
      }, 20);
      setTimeout(() => {
        clearInterval(timer);
        resolve({ found: true, pendingMs, outcomeMs: Math.round(performance.now() - startedAt), textSample: document.body.innerText.slice(0, 600) });
      }, 1600);
    })`);
    assert.equal(actionEvidence.found, true, `Draft button not found for ${draftOutcome}.`);
    assert.ok(actionEvidence.pendingMs <= 120, `Draft pending state took ${actionEvidence.pendingMs} ms for ${draftOutcome}.`);
    assert.match(actionEvidence.textSample, /Draft saved|Draft save failed|Draft not saved/, `Draft outcome not observed for ${draftOutcome}.`);
    evidence.draftOutcomes.push({ draftOutcome, ...actionEvidence });
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
  assembly: 'ra-maintenance-request-form',
  version: '0.1.0',
  executedAt: new Date().toISOString(),
  storybookBaseUrl,
  sourceStressChecks: 'pass',
  scenarioMatrix: [],
  assemblyStates: [],
  submitOutcomes: [],
  draftOutcomes: [],
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
  await runSubmitOutcomeMatrix(client, evidence);
  await runDraftOutcomeMatrix(client, evidence);

  const outputPath = join(outputDirectory, '2026-09-29-screen-stress-evidence.json');
  writeFileSync(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(`Maintenance request form screen stress tests passed. Evidence: ${outputPath}`);
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
