import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cdpPort = Number(process.env.MDS_CDP_PORT || 9830 + Math.floor(Math.random() * 150));
const storybookBaseUrl = process.env.MDS_STORYBOOK_URL || 'http://127.0.0.1:6006';
const storyId = 'reference-assemblies-planner-workbench--candidate-overview';
const outputDirectory = join(process.cwd(), 'audits', 'assemblies', 'planner-workbench', 'certification');
const profileDirectory = join(tmpdir(), `mds-pw-stress-${Date.now()}`);
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');

const viewports = [
  { name: 'mobile-narrow', width: 320, height: 844, mobile: true },
  { name: 'mobile', width: 390, height: 844, mobile: true },
  { name: 'tablet', width: 768, height: 1024, mobile: false },
  { name: 'desktop', width: 1440, height: 1200, mobile: false },
  { name: 'wide-desktop', width: 1920, height: 1080, mobile: false },
];

const scenarios = [
  'ready',
  'concurrent-conflict',
  'optimistic-rebound',
  'stale',
  'stress-high-density',
  'anantshriveda-warehouse',
  'minimum-content',
  'long-labels',
  'missing-data',
  'loading',
  'partial-loading',
  'empty-state',
  'error-state',
  'disabled-actions',
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
        if (message.method === 'Runtime.consoleAPICalled') {
          console.log('[BROWSER CONSOLE]', message.params.type, message.params.args?.map(a => a.value || a.description).join(' '));
        }
        if (message.method === 'Runtime.exceptionThrown') {
          console.error('[BROWSER EXCEPTION]', message.params.exceptionDetails?.exception?.description || message.params.exceptionDetails?.text);
        }
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
  if (result.exceptionDetails) {
    const desc = result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'Browser evaluation failed.';
    throw new Error(`Browser evaluation failed: ${desc}`);
  }
  return result.result?.value;
}

async function waitForStableStory(client) {
  for (let attempt = 0; attempt < 240; attempt++) {
    await delay(250);
    const ready = await evaluate(client, `Boolean(document.body?.innerText?.includes('Meridian Master Planner') || document.body?.innerText?.includes('Asclepius') || document.querySelector('.ds-workbench-3pane'))`);
    if (ready) return;
  }
  const diagnostic = await evaluate(client, `({
    location: location.href,
    title: document.title,
    text: document.body?.innerText?.slice(0, 1200),
    root: document.getElementById('storybook-root')?.innerHTML?.slice(0, 1200),
    html: document.body?.innerHTML?.slice(0, 1200),
    errorDisplay: document.querySelector('.sb-errordisplay')?.innerText || null
  })`);
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

console.log(`🚀 Spawning headless Edge on CDP port ${cdpPort}...`);
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
  assembly: 'ra-planner-workbench',
  version: '0.1.0',
  executedAt: new Date().toISOString(),
  storybookBaseUrl,
  scenarios: [],
  conflictResolutionVerification: null,
  intercompanyFlowVerification: null,
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
      // Retrying CDP socket connection
    }
  }

  assert(webSocketUrl, 'Failed to acquire CDP WebSocket URL from Edge browser.');
  client = new CDPClient(webSocketUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('Runtime.enable');

  console.log('✅ Connected to Headless CDP. Executing Multi-Viewport & Scenario Stress Gates...\n');

  for (const scenario of scenarios) {
    console.log(`📌 Testing Scenario: ${scenario}`);
    for (const viewport of viewports) {
      await client.send('Emulation.setDeviceMetricsOverride', {
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        mobile: viewport.mobile,
      });

      const targetUrl = storyUrl({ scenario });
      await client.send('Page.navigate', { url: targetUrl });
      await waitForStableStory(client);
      await delay(200);

      const axeResult = await runAxe(client);
      const layoutResult = await getLayoutEvidence(client);

      console.log(`   [${viewport.name} ${viewport.width}x${viewport.height}]: Axe passes: ${axeResult.passCount} (Violations: ${axeResult.violationCount}), H-Scroll: ${layoutResult.hasHorizontalScroll}`);

      assert.equal(
        axeResult.violationCount,
        0,
        `Axe violations found in ${scenario} at ${viewport.name}: ${JSON.stringify(axeResult.violations)}`
      );

      assert.equal(
        layoutResult.hasHorizontalScroll,
        false,
        `Horizontal scroll detected in ${scenario} at ${viewport.name}: scrollWidth=${layoutResult.scrollWidth}, clientWidth=${layoutResult.clientWidth}`
      );

      if (scenario === 'ready' && viewport.name === 'desktop') {
        const shot = await client.send('Page.captureScreenshot', { format: 'png' });
        const screenshotDir = join(outputDirectory, '..', 'screenshots');
        mkdirSync(screenshotDir, { recursive: true });
        const screenshotPath = join(screenshotDir, 'workbench-desktop-1440.png');
        writeFileSync(screenshotPath, Buffer.from(shot.data, 'base64'));
        console.log(`📸 Screenshot captured at: ${screenshotPath}`);
      }

      evidence.scenarios.push({
        scenario,
        viewport: viewport.name,
        width: viewport.width,
        height: viewport.height,
        axePasses: axeResult.passCount,
        hasHorizontalScroll: layoutResult.hasHorizontalScroll,
        overlappingControls: layoutResult.overlappingControls,
      });
    }
  }

  // Deterministic Concurrent Conflict Resolution Simulation
  console.log('\n🔒 Executing Deterministic Concurrent Conflict Resolution Simulation...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send('Page.navigate', { url: storyUrl({ scenario: 'concurrent-conflict' }) });
  await waitForStableStory(client);

  const conflictDrawerOpen = await evaluate(client, `Boolean(document.querySelector('.ds-conflict-drawer'))`);
  assert.equal(conflictDrawerOpen, true, 'Concurrent conflict resolver drawer is open as expected.');

  // Click 1-Click Action 3: Allocate Delta
  await evaluate(client, `(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Allocate Remaining Delta'));
    if (btn) btn.click();
  })()`);
  await delay(300);

  const bannerText = await evaluate(client, `document.querySelector('.ds-planner-banner')?.textContent || ''`);
  assert(bannerText.includes('Allocated Remaining Delta') || bannerText.includes('50 kg'), 'Resolution action committed delta successfully.');

  evidence.conflictResolutionVerification = {
    tested: true,
    drawerOpened: conflictDrawerOpen,
    resolutionAction: 'Allocate Remaining Delta (50 kg)',
    postResolutionBanner: bannerText,
    passed: true,
  };

  // Deterministic Intercompany Multi-Plant Switch Simulation
  console.log('🏭 Executing Multi-Plant Scope Switch (Asclepius F-119 ↔ Anantshriveda H-9)...');
  await client.send('Page.navigate', { url: storyUrl({ scenario: 'anantshriveda-warehouse' }) });
  await waitForStableStory(client);

  const headerSubhead = await evaluate(client, `document.querySelector('.ds-planner-header__subtitle')?.textContent || ''`);
  assert(headerSubhead.includes('Anantshriveda') && headerSubhead.includes('H-9'), 'Switched scope to Anantshriveda RM Warehouse H-9.');

  evidence.intercompanyFlowVerification = {
    tested: true,
    scopeSwitched: true,
    entityName: 'Anantshriveda Natural Care',
    facilityCode: 'H-9',
    passed: true,
  };

  const evidenceFilePath = join(outputDirectory, '2026-10-01-screen-stress-evidence.json');
  writeFileSync(evidenceFilePath, JSON.stringify(evidence, null, 2), 'utf8');

  console.log(`\n🎉 STRESS GATES COMPLETED SUCCESSFULLY!`);
  console.log(`📁 Evidence generated at: ${evidenceFilePath}`);

} finally {
  if (client) client.close();
  edge.kill('SIGKILL');
  try {
    rmSync(profileDirectory, { recursive: true, force: true });
  } catch {
    // Temp cleanup
  }
}
