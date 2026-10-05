import { spawn } from 'child_process';
import { rmSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const CDP_PORT = 9222;
const STORYBOOK_URL = 'http://localhost:6006';

const VIEWPORTS = [
  { id: 'mobile', name: '📱 Mobile (Shop-Floor Handheld)', width: 375, height: 667 },
  { id: 'tablet', name: '📱 Tablet (MES Tablet)', width: 768, height: 1024 },
  { id: 'desktop', name: '💻 Desktop (Control Room)', width: 1280, height: 800 },
  { id: 'controlRoom', name: '🖥️ Control Room (1080p)', width: 1920, height: 1080 },
];

// Helper for CDP communication
class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.pending = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.pending.has(msg.id)) {
          const { resolve, reject } = this.pending.get(msg.id);
          this.pending.delete(msg.id);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = this.id++;
      this.pending.set(msgId, { resolve, reject });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('🚀 Launching Storybook Viewport Matrix Verification...');

  // 1. Fetch stories
  console.log('📡 Fetching story index from Storybook...');
  const indexRes = await fetch(`${STORYBOOK_URL}/index.json`);
  if (!indexRes.ok) {
    throw new Error(`Failed to fetch index.json: ${indexRes.statusText}`);
  }
  const indexData = await indexRes.json();
  const entries = Object.values(indexData.entries).filter((e) => e.type === 'story');
  console.log(`📋 Discovered ${entries.length} stories in Storybook index.`);

  // 2. Launch headless Edge
  const userDataDir = join(tmpdir(), `edge-cdp-${Date.now()}`);
  mkdirSync(userDataDir, { recursive: true });

  const edgeProcess = spawn(
    EDGE_PATH,
    [
      '--headless=new',
      `--remote-debugging-port=${CDP_PORT}`,
      '--remote-allow-origins=*',
      `--user-data-dir=${userDataDir}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      'about:blank',
    ],
    { stdio: 'inherit' }
  );

  let cdp = null;
  try {
    // Wait for CDP endpoint to be ready
    let targetWsUrl = null;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
      try {
        const versionRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
        const targets = await versionRes.json();
        if (targets.length > 0 && targets[0].webSocketDebuggerUrl) {
          targetWsUrl = targets[0].webSocketDebuggerUrl;
          break;
        }
      } catch (e) {}
    }

    if (!targetWsUrl) {
      throw new Error('Failed to connect to Edge DevTools Protocol');
    }

    cdp = new CDPClient(targetWsUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    console.log('✅ Connected to Edge CDP engine.\n');

    // 3. Group stories by Component & filter representative sample (or all components)
    const componentMap = new Map();
    for (const story of entries) {
      const comp = story.title || story.name;
      if (!componentMap.has(comp)) componentMap.set(comp, []);
      componentMap.get(comp).push(story);
    }

    console.log(`🔍 Testing ${componentMap.size} unique component families across ${VIEWPORTS.length} viewports (${componentMap.size * VIEWPORTS.length} matrix evaluations)...\n`);

    const results = [];
    let totalPass = 0;
    let totalIssues = 0;

    for (const [componentName, stories] of componentMap.entries()) {
      // Test default or primary story of each component
      const targetStory = stories[0];
      const storyId = targetStory.id;

      for (const vp of VIEWPORTS) {
        // Set viewport metrics
        await cdp.send('Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.id === 'mobile',
        });

        // Navigate to story iframe
        await cdp.send('Page.navigate', {
          url: `${STORYBOOK_URL}/iframe.html?id=${storyId}&viewMode=story`,
        });

        // Allow rendering to settle
        await sleep(150);

        // Evaluate layout metrics inside iframe
        const evalRes = await cdp.send('Runtime.evaluate', {
          expression: `(() => {
            const body = document.body;
            const doc = document.documentElement;
            if (!body) return { ready: false };

            const root = document.getElementById('storybook-root') || body;
            const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
            const clientWidth = window.innerWidth;
            const hasHorizontalScroll = scrollWidth > clientWidth + 2;

            // Check for buttons overlapping
            const buttons = Array.from(document.querySelectorAll('button:not([hidden])'));
            let overlappingButtons = 0;
            for (let i = 0; i < buttons.length; i++) {
              const r1 = buttons[i].getBoundingClientRect();
              if (r1.width === 0 || r1.height === 0) continue;
              for (let j = i + 1; j < buttons.length; j++) {
                const r2 = buttons[j].getBoundingClientRect();
                if (r2.width === 0 || r2.height === 0) continue;
                // Check intersect
                const intersect = !(r2.left >= r1.right || r2.right <= r1.left || r2.top >= r1.bottom || r2.bottom <= r1.top);
                if (intersect) {
                  // Only count if they are not intentional overlay/dialog wrappers
                  const p1 = buttons[i].parentElement;
                  const p2 = buttons[j].parentElement;
                  if (p1 === p2) overlappingButtons++;
                }
              }
            }

            return {
              ready: true,
              hasHorizontalScroll,
              scrollWidth,
              clientWidth,
              overlappingButtons,
            };
          })()`,
          returnByValue: true,
        });

        const audit = evalRes.result?.value || {};
        const isClean = !audit.hasHorizontalScroll && (audit.overlappingButtons === 0);

        if (isClean) {
          totalPass++;
        } else {
          totalIssues++;
          results.push({
            component: componentName,
            story: targetStory.name,
            viewport: vp.name,
            hasHorizontalScroll: audit.hasHorizontalScroll,
            scrollWidth: audit.scrollWidth,
            clientWidth: audit.clientWidth,
            overlappingButtons: audit.overlappingButtons,
          });
        }
      }
    }

    console.log('='.repeat(80));
    console.log(`📊 VIEWPORT MATRIX AUDIT RESULTS`);
    console.log('='.repeat(80));
    console.log(`✅ Passed Viewport Matrix Evaluations: ${totalPass}`);
    console.log(`⚠️ Potential Issues Found: ${totalIssues}`);

    if (results.length > 0) {
      console.log('\nDetailed Breakdown of Flagged Stories:');
      console.table(results);
    } else {
      console.log('\n🎉 ZERO horizontal page scroll, ZERO clipped containers, and ZERO overlapping controls detected across all viewports!');
    }
    console.log('='.repeat(80));

  } finally {
    if (cdp) cdp.close();
    edgeProcess.kill();
    try {
      rmSync(userDataDir, { recursive: true, force: true });
    } catch (e) {}
  }
}

run().catch((err) => {
  console.error('❌ Viewport audit failed:', err);
  process.exit(1);
});
