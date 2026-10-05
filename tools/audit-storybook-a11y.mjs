import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT_DIR = process.cwd();
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cdpPort = 9988;
const profileDir = join(tmpdir(), 'mds-a11y-audit-' + Date.now());
const axeSource = readFileSync(join(ROOT_DIR, 'node_modules', 'axe-core', 'axe.min.js'), 'utf-8');

const STORIES_TO_AUDIT = [
  { id: 'reference-assemblies-planner-workbench--candidate-overview', name: 'Planner Workbench (Candidate Overview)' },
  { id: 'reference-assemblies-candidate-overview--dashboard-example', name: 'Plant Operations Dashboard' },
  { id: 'reference-assemblies-candidate-overview--form-example', name: 'Maintenance Request Form' },
  { id: 'reference-assemblies-candidate-overview--record-list-example', name: 'Work Order Register' },
  { id: 'reference-assemblies-candidate-overview--record-detail-example', name: 'Work Order Detail' },
  { id: 'reference-assemblies-candidate-overview--settings-example', name: 'Plant Settings' },
  { id: 'reference-assemblies-candidate-overview--analytics-example', name: 'Production Analytics' }
];

console.log('====================================================');
console.log('   PHASE 1: STORYBOOK REFERENCE ASSEMBLIES AXE-CORE SWEEP');
console.log('====================================================\n');
console.log(`Starting headless browser at CDP port ${cdpPort}...`);

const edge = spawn(edgePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-allow-origins=*',
  `--remote-debugging-port=${cdpPort}`,
  `--user-data-dir=${profileDir}`,
  'about:blank',
], { stdio: 'ignore' });

const delay = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  try {
    let wsUrl;
    for (let attempt = 0; attempt < 50; attempt++) {
      await delay(200);
      try {
        const list = await fetch(`http://127.0.0.1:${cdpPort}/json/list`).then(r => r.json());
        wsUrl = list.find(t => t.type === 'page')?.webSocketDebuggerUrl;
        if (!wsUrl) {
          const created = await fetch(`http://127.0.0.1:${cdpPort}/json/new`, { method: 'PUT' }).then(r => r.json()).catch(() => null);
          if (created?.webSocketDebuggerUrl) wsUrl = created.webSocketDebuggerUrl;
        }
        if (wsUrl) break;
      } catch {}
    }

    if (!wsUrl) throw new Error('Could not establish WebSocket connection to Edge DevTools.');

    const ws = new WebSocket(wsUrl);
    await new Promise(r => (ws.onopen = r));

    let msgId = 1;
    const send = (method, params = {}) => new Promise((res, rej) => {
      const id = msgId++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) rej(msg.error);
          else res(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');
    await send('Runtime.enable');

    const auditResults = [];
    const allViolationsTriaged = [];

    for (const story of STORIES_TO_AUDIT) {
      console.log(`\n▶ Auditing Story: ${story.name} [${story.id}]...`);
      const storyUrl = `http://127.0.0.1:6006/iframe.html?id=${story.id}&viewMode=story`;

      await send('Page.navigate', { url: storyUrl });

      // Wait for story root to be populated
      let ready = false;
      for (let i = 0; i < 40; i++) {
        await delay(250);
        const evalRes = await send('Runtime.evaluate', {
          expression: `Boolean(document.getElementById('storybook-root')?.children?.length > 0 || document.body?.innerText?.length > 50)`,
          returnByValue: true
        });
        if (evalRes?.result?.value) {
          ready = true;
          break;
        }
      }

      if (!ready) {
        console.warn(`  ⚠️ Timeout waiting for story ${story.id} to stabilize. Running audit anyway...`);
      } else {
        await delay(500); // Give microtasks and animations time to settle
      }

      // Inject axe-core
      await send('Runtime.evaluate', { expression: axeSource });

      // Run axe
      const axeResult = await send('Runtime.evaluate', {
        expression: `axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }
        }).then(r => ({
          passes: r.passes.length,
          violations: r.violations.map(v => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            help: v.help,
            helpUrl: v.helpUrl,
            nodes: v.nodes.map(n => ({
              target: n.target,
              html: n.html.slice(0, 150),
              failureSummary: n.failureSummary
            }))
          }))
        }))`,
        awaitPromise: true,
        returnByValue: true
      });

      const res = axeResult.result?.value;
      if (!res) {
        console.error(`  ❌ Failed to run axe-core on ${story.id}`);
        continue;
      }

      console.log(`  ✓ Passed rules: ${res.passes}`);
      console.log(`  Found violations: ${res.violations.length}`);

      for (const v of res.violations) {
        // Triage severity based on impact and rule ID
        let severity = 'P2 (Medium)';
        if (v.impact === 'critical' || v.id === 'button-name' || v.id === 'color-contrast' || v.id === 'label') {
          severity = 'P0 (Blocker)';
        } else if (v.impact === 'serious' || v.id === 'region' || v.id === 'landmark-unique' || v.id === 'heading-order') {
          severity = 'P1 (High)';
        }

        const triaged = {
          storyId: story.id,
          storyName: story.name,
          ruleId: v.id,
          impact: v.impact,
          severity,
          description: v.description,
          help: v.help,
          nodesCount: v.nodes.length,
          nodes: v.nodes
        };

        allViolationsTriaged.push(triaged);
        console.log(`    ❌ [${severity}] ${v.id} (${v.impact}): ${v.help} (${v.nodes.length} occurrences)`);
      }

      auditResults.push({
        story,
        passesCount: res.passes,
        violationsCount: res.violations.length,
        violations: res.violations
      });
    }

    // Report Summary
    console.log('\n====================================================');
    console.log('   SWEEP COMPLETED: TRIAGED SEVERITY SUMMARY');
    console.log('====================================================\n');

    const p0Violations = allViolationsTriaged.filter(v => v.severity.startsWith('P0'));
    const p1Violations = allViolationsTriaged.filter(v => v.severity.startsWith('P1'));
    const p2Violations = allViolationsTriaged.filter(v => v.severity.startsWith('P2'));

    console.log(`Total Stories Audited: ${STORIES_TO_AUDIT.length}`);
    console.log(`Total Violations Recorded: ${allViolationsTriaged.length}`);
    console.log(`- P0 (Blocker): ${p0Violations.length}`);
    console.log(`- P1 (High):    ${p1Violations.length}`);
    console.log(`- P2 (Medium):  ${p2Violations.length}\n`);

    if (p0Violations.length > 0) {
      console.log('--- Top P0 (Blocker) Issues ---');
      for (const v of p0Violations.slice(0, 10)) {
        console.log(`[${v.severity}] in ${v.storyName}: ${v.help}`);
        console.log(`  Rule: ${v.ruleId} | Targets: ${v.nodes.map(n => n.target.join(' ')).slice(0, 2).join('; ')}`);
      }
    }

    if (p1Violations.length > 0) {
      console.log('\n--- Top P1 (High) Issues ---');
      for (const v of p1Violations.slice(0, 10)) {
        console.log(`[${v.severity}] in ${v.storyName}: ${v.help}`);
        console.log(`  Rule: ${v.ruleId} | Targets: ${v.nodes.map(n => n.target.join(' ')).slice(0, 2).join('; ')}`);
      }
    }

    mkdirSync(join(ROOT_DIR, 'audits'), { recursive: true });
    writeFileSync(
      join(ROOT_DIR, 'audits', 'storybook-a11y-audit.json'),
      JSON.stringify({ auditResults, allViolationsTriaged }, null, 2)
    );
    console.log(`\nDetailed report written to audits/storybook-a11y-audit.json`);

  } catch (err) {
    console.error('Fatal audit error:', err);
  } finally {
    edge.kill();
    process.exit(0);
  }
}

setTimeout(run, 500);
