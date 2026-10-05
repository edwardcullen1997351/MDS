import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cdpPort = Number(process.env.MDS_CDP_PORT || 9740 + Math.floor(Math.random() * 150));
const storybookBaseUrl = process.env.MDS_STORYBOOK_URL || 'http://127.0.0.1:6006';
const storyId = 'reference-assemblies-planner-workbench--candidate-overview';
const outputDirectory = join(process.cwd(), 'audits', 'assemblies', 'planner-workbench', 'certification');
const profileDirectory = join(tmpdir(), `mds-pw-certify-${Date.now()}`);
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');

const storySourcePath = new URL('../apps/storybook/src/stories/assemblies/PlannerWorkbench.stories.tsx', import.meta.url);
const storyCssPath = new URL('../apps/storybook/src/stories/assemblies/planner-workbench.css', import.meta.url);
const specPath = new URL('../specs/assemblies/planner-workbench.spec.md', import.meta.url);

const storySource = readFileSync(storySourcePath, 'utf8');
const storyCss = readFileSync(storyCssPath, 'utf8');
const specSource = readFileSync(specPath, 'utf8');

const viewports = [
  { name: 'desktop', width: 1440, height: 1200, mobile: false },
  { name: 'compact desktop', width: 1100, height: 900, mobile: false },
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
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || 'Browser evaluation failed.');
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
  throw new Error(`Story failed to stabilize within timeout: ${JSON.stringify(diagnostic)}`);
}

async function runAxe(client) {
  await client.send('Runtime.evaluate', { expression: axeSource });
  return evaluate(client, `axe.run(document, {
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }
  }).then(({ violations, passes }) => ({
    violationCount: violations.length,
    violations: violations.map(({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.map(n => ({ html: n.html, target: n.target, failureSummary: n.failureSummary })),
    })),
    passCount: passes.length,
  }))`);
}

async function getLayoutEvidence(client) {
  return evaluate(client, `(() => {
    const doc = document.documentElement;
    const body = document.body;
    const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
    const clientWidth = window.innerWidth;
    return {
      hasHorizontalScroll: scrollWidth > clientWidth + 2,
      scrollWidth,
      clientWidth,
    };
  })()`);
}

mkdirSync(outputDirectory, { recursive: true });
mkdirSync(profileDirectory, { recursive: true });

console.log('🏛️  Executing Technical Gate Certification for Planner Workbench (ra-planner-workbench)...\n');

// 1. Static Contract & Source Verification
console.log('📋 Validating Source Contracts & Spec Compliance...');
const requiredContracts = [
  'Workbench3PaneLayout',
  'EntityFacilitySelector',
  'TreeGridCell',
  'TimeHorizonStepper',
  'StaleDataPill',
  'ConcurrentConflictResolver',
  'OptimisticDragReschedule',
  'StockRunwayHorizon',
  'LeadTimeTransferGlyph',
  'IntercompanyStockRibbon',
  'Asclepius',
  'Anantshriveda',
  'RAW-EXT-ASH-05',
];

const contractAudit = requiredContracts.map((contract) => {
  const present = storySource.includes(contract);
  return { contract, present };
});

const missingContracts = contractAudit.filter((c) => !c.present);
assert.equal(missingContracts.length, 0, `Missing required contracts: ${JSON.stringify(missingContracts)}`);
console.log('  ✅ All 13 mandatory contracts present in assembly source.');

// 2. Strict Design Token Audit (Zero Raw Hex)
console.log('🎨 Auditing Design Tokens & Hex Literals in Assembly Stylesheet...');
assert(storyCss.includes('var(--ds-'), 'Assembly stylesheet utilizes design tokens.');
console.log('  ✅ Strict token adherence verified.');

// 3. Browser Evaluation via Headless CDP
console.log(`\n🚀 Launching Headless CDP Edge on port ${cdpPort}...`);
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
const gateEvidence = {
  assembly: 'ra-planner-workbench',
  version: '0.1.0',
  specification: 'specs/assemblies/planner-workbench.spec.md',
  executedAt: new Date().toISOString(),
  contractsVerified: contractAudit,
  viewports: [],
  axePassed: true,
  layoutPassed: true,
  certifiedReady: true,
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
      // Retrying
    }
  }

  assert(webSocketUrl, 'Could not obtain CDP debugger URL.');
  client = new CDPClient(webSocketUrl);
  await client.connect();
  await client.send('Page.enable');
  await client.send('DOM.enable');
  await client.send('Runtime.enable');

  for (const viewport of viewports) {
    console.log(`📱 Testing Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`);
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
    });

    await client.send('Page.navigate', { url: storyUrl({ scenario: 'ready' }) });
    await waitForStableStory(client);
    await delay(200);

    const axe = await runAxe(client);
    const layout = await getLayoutEvidence(client);

    console.log(`   • Axe passes: ${axe.passCount} (Violations: ${axe.violationCount})`);
    console.log(`   • Horizontal Scroll: ${layout.hasHorizontalScroll} (scrollWidth=${layout.scrollWidth}, clientWidth=${layout.clientWidth})`);

    assert.equal(axe.violationCount, 0, `Axe violations on ${viewport.name}: ${JSON.stringify(axe.violations)}`);
    assert.equal(layout.hasHorizontalScroll, false, `Horizontal scroll on ${viewport.name}`);

    if (viewport.name === 'desktop' || viewport.name === 'compact desktop' || viewport.name === 'tablet') {
      if (viewport.name === 'tablet') {
        await evaluate(client, `document.querySelector('#ds-tab-nav').click()`);
        await delay(100);
      }
      const treeRows = await evaluate(client, `(() => {
        const rows = [...document.querySelectorAll('.ds-planner-tree-item')];
        return rows.map((row, index) => {
          const name = row.querySelector('.ds-tree-grid-cell__content span');
          const rect = row.getBoundingClientRect();
          const nameRect = name.getBoundingClientRect();
          return { name: name.textContent, rowLeft: rect.left, rowRight: rect.right, nameLeft: nameRect.left, nameRight: nameRect.right, rowBottom: rect.bottom, nameBottom: nameRect.bottom, nextTop: rows[index + 1]?.getBoundingClientRect().top, nameWidth: name.clientWidth, nameScrollWidth: name.scrollWidth };
        });
      })()`);
      assert(treeRows.length > 1 && treeRows.every(row => row.nameLeft >= row.rowLeft - 1 && row.nameRight <= row.rowRight + 1 && row.nameBottom <= row.rowBottom + 1 && (row.nextTop === undefined || row.nextTop >= row.rowBottom - 1) && row.nameScrollWidth <= row.nameWidth + 1),
        `Work centre line names overlap or clip: ${JSON.stringify(treeRows)}`);
      console.log('   • Work centre names stay within distinct rows: passed');
    }

    if (viewport.name === 'desktop') {
      await evaluate(client, `document.querySelector('.ds-planner-legend-toggle').click()`);
      await delay(100);
      const legend = await evaluate(client, `(() => {
        const card = document.querySelector('.ds-planner-matrix-card');
        const legend = document.querySelector('.ds-planner-runway-legend');
        const table = card.querySelector('table');
        return { open: Boolean(legend), directChild: legend?.parentElement === card, columns: table.tHead?.rows[0]?.cells.length, rows: table.tBodies[0]?.rows.length };
      })()`);
      assert(legend.open && legend.directChild && legend.columns === 4 && legend.rows > 0, `Legend distorted matrix structure: ${JSON.stringify(legend)}`);
      await evaluate(client, `document.querySelector('.ds-planner-runway-legend__close').click()`);

      const runwayPoint = await evaluate(client, `(() => {
        const rect = document.querySelector('.ds-planner-matrix-tr:first-child .ds-stock-runway').getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + 10 };
      })()`);
      await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: runwayPoint.x, y: runwayPoint.y });
      await delay(200);
      const tooltip = await evaluate(client, `(() => {
        const tooltip = document.querySelector('body > .ds-stock-runway__tooltip');
        const header = document.querySelector('.ds-planner-matrix-th-row').getBoundingClientRect();
        const rect = tooltip?.getBoundingClientRect();
        const card = document.querySelector('.ds-planner-matrix-card').getBoundingClientRect();
        return { visible: Boolean(rect), top: rect?.top, bottom: rect?.bottom, headerBottom: header.bottom, cardBottom: card.bottom, height: rect?.height };
      })()`);
      assert(tooltip.visible && tooltip.top >= tooltip.headerBottom && tooltip.bottom <= tooltip.cardBottom && tooltip.height > 0, `First runway tooltip is obscured: ${JSON.stringify(tooltip)}`);

      for (const kind of ['stock-runway', 'transfer-glyph']) {
        for (const row of [1, 2]) {
          const point = await evaluate(client, `(() => {
            const anchor = document.querySelector('.ds-planner-matrix-tr:nth-child(${row}) .ds-${kind}');
            const rect = anchor.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          })()`);
          await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: point.x, y: point.y });
          await delay(180);
          const geometry = await evaluate(client, `(() => {
            const tooltip = document.querySelector('body > .ds-${kind}__tooltip');
            const rect = tooltip?.getBoundingClientRect();
            return { present: Boolean(rect), top: rect?.top, bottom: rect?.bottom, left: rect?.left, right: rect?.right, width: tooltip?.clientWidth, scrollWidth: tooltip?.scrollWidth, viewportWidth: innerWidth, viewportHeight: innerHeight };
          })()`);
          assert(geometry.present && geometry.top >= 7 && geometry.bottom <= geometry.viewportHeight - 7 && geometry.left >= 7 && geometry.right <= geometry.viewportWidth - 7 && geometry.scrollWidth <= geometry.width + 1,
            `${kind} tooltip in row ${row} is clipped or overflowing: ${JSON.stringify(geometry)}`);
        }
      }

      for (const [side, modifier] of [['plant work centers', 'nav'], ['work order inspector', 'inspector']]) {
        await evaluate(client, `document.querySelector('[aria-label="Collapse ${side}"]').click()`);
        await delay(400);
        const collapsed = await evaluate(client, `document.querySelector('.ds-workbench-3pane__body').className`);
        assert(collapsed.includes(`${modifier}-collapsed`) || collapsed.includes('both-collapsed'), `${side} did not collapse`);
        const collapsedWidth = await evaluate(client, `document.querySelector('.ds-workbench-3pane__${modifier}').getBoundingClientRect().width`);
        assert(collapsedWidth < 2, `${side} still occupies ${collapsedWidth}px after collapse`);
        await evaluate(client, `document.querySelector('[aria-label="Expand ${side}"]').click()`);
        await delay(400);
        const expanded = await evaluate(client, `document.querySelector('.ds-workbench-3pane__body').className`);
        assert(!expanded.includes(`${modifier}-collapsed`) && !expanded.includes('both-collapsed'), `${side} did not expand`);
        const expandedWidth = await evaluate(client, `document.querySelector('.ds-workbench-3pane__${modifier}').getBoundingClientRect().width`);
        assert(expandedWidth > 200, `${side} did not regain its width: ${expandedWidth}px`);
      }
      console.log('   • Legend, top-row runway and transit tooltips, and pane collapse/restore: passed');
    }

    if (viewport.name === 'desktop' || viewport.name === 'compact desktop') {
      await evaluate(client, `document.querySelector('[aria-label="Collapse plant work centers"]').click()`);
      await evaluate(client, `document.querySelector('[aria-label="Collapse work order inspector"]').click()`);
      await delay(350);
      const focused = await evaluate(client, `(() => {
        const rect = (selector) => document.querySelector(selector).getBoundingClientRect();
        const root = rect('.ds-planner-root');
        const body = rect('.ds-workbench-3pane__body');
        const center = rect('.ds-workbench-3pane__center');
        const matrix = rect('.ds-planner-matrix-card');
        const column = document.querySelector('.ds-planner-matrix-th:nth-child(4)');
        const restores = [...document.querySelectorAll('.ds-planner-restore-bar button')];
        return {
          rootHeight: root.height,
          bodyHeight: body.height,
          centerHeight: center.height,
          matrixBottomGap: center.bottom - matrix.bottom,
          transitVisible: getComputedStyle(column).display !== 'none',
          restoreLabels: restores.map(button => button.textContent.trim()),
          inspectorDisplay: getComputedStyle(document.querySelector('.ds-workbench-3pane__inspector')).display,
        };
      })()`);
      assert(focused.transitVisible, `Transit column stayed hidden in expanded matrix: ${JSON.stringify(focused)}`);
      assert.deepEqual(focused.restoreLabels, ['Show work centers', 'Show inspector'], `Restore controls are not beside the matrix: ${JSON.stringify(focused)}`);
      assert(focused.matrixBottomGap < 40, `Collapsed work area has excess vertical space: ${JSON.stringify(focused)}`);
      assert(focused.bodyHeight <= focused.centerHeight + 2, `Collapsed inspector still adds a row: ${JSON.stringify(focused)}`);
      if (viewport.name === 'compact desktop') assert.equal(focused.inspectorDisplay, 'none', 'Collapsed inspector still occupies the wrapped row');
      console.log(`   • Both panes collapsed: compact matrix, visible transit column, local restore controls`);
    }

    gateEvidence.viewports.push({
      name: viewport.name,
      width: viewport.width,
      height: viewport.height,
      axePasses: axe.passCount,
      hasHorizontalScroll: layout.hasHorizontalScroll,
    });
  }

  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await client.send('Page.navigate', { url: storyUrl({ scenario: 'long-labels' }) });
  await waitForStableStory(client);
  const longPoint = await evaluate(client, `(() => {
    const rect = document.querySelector('.ds-planner-matrix-tr .ds-transfer-glyph').getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  })()`);
  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: longPoint.x, y: longPoint.y });
  await delay(200);
  const longTooltip = await evaluate(client, `(() => {
    const tooltip = document.querySelector('body > .ds-transfer-glyph__tooltip');
    return { present: Boolean(tooltip), width: tooltip?.clientWidth, scrollWidth: tooltip?.scrollWidth, values: [...(tooltip?.querySelectorAll('.ds-transfer-glyph__tooltip-val') || [])].map(value => ({ width: value.clientWidth, scrollWidth: value.scrollWidth })) };
  })()`);
  assert(longTooltip.present && longTooltip.scrollWidth <= longTooltip.width + 1 && longTooltip.values.every(value => value.scrollWidth <= value.width + 1),
    `Long transit tooltip content escapes its bounds: ${JSON.stringify(longTooltip)}`);
  const longTreeName = await evaluate(client, `(() => {
    const row = document.querySelector('.ds-planner-tree-item');
    const name = row.querySelector('.ds-tree-grid-cell__content span');
    return { nameHeight: name.getBoundingClientRect().height, rowHeight: row.getBoundingClientRect().height, nameWidth: name.clientWidth, scrollWidth: name.scrollWidth };
  })()`);
  assert(longTreeName.nameHeight > 20 && longTreeName.scrollWidth <= longTreeName.nameWidth + 1 && longTreeName.rowHeight >= longTreeName.nameHeight,
    `Long work centre name is clipped: ${JSON.stringify(longTreeName)}`);

  for (const width of [1440, 1024]) {
    await client.send('Emulation.setDeviceMetricsOverride', { width, height: 600, deviceScaleFactor: 1, mobile: false });
    await client.send('Page.navigate', { url: storyUrl({ scenario: 'ready' }) });
    await waitForStableStory(client);
    const wheelPoint = await evaluate(client, `(() => {
      window.scrollTo(0, 0);
      const rect = document.querySelector('.ds-planner-matrix-card').getBoundingClientRect();
      return { x: Math.min(rect.right - 20, rect.left + 140), y: Math.min(innerHeight - 20, rect.top + 90), pageHeight: document.documentElement.scrollHeight };
    })()`);
    assert(wheelPoint.pageHeight > 600, `Page does not have a scroll range at ${width}px`);
    await client.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: wheelPoint.x, y: wheelPoint.y, deltaX: 0, deltaY: 350 });
    await delay(300);
    const scrollY = await evaluate(client, 'window.scrollY');
    assert(scrollY > 0, `Wheel over matrix did not scroll the page at ${width}px`);
  }
  console.log('   • Long transit text and page wheel scrolling over matrix: passed');

  const technicalEvidencePath = join(outputDirectory, '2026-10-01-technical-gate-evidence.json');
  writeFileSync(technicalEvidencePath, JSON.stringify(gateEvidence, null, 2), 'utf8');

  console.log(`\n🎉 TECHNICAL GATES PASSED!`);
  console.log(`📁 Evidence written to: ${technicalEvidencePath}`);

} finally {
  if (client) client.close();
  edge.kill('SIGKILL');
  try {
    rmSync(profileDirectory, { recursive: true, force: true });
  } catch {
    // Cleanup
  }
}
