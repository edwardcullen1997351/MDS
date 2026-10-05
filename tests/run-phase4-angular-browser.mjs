import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { chromium } from '@playwright/test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const windowsChrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
  (process.platform === 'win32' && fs.existsSync(windowsChrome) ? windowsChrome : undefined);

const built = await build({
  entryPoints: [path.join(root, 'tests/phase4-angular-browser.ts')],
  bundle: true, format: 'iife', platform: 'browser', target: 'es2022', write: false,
  tsconfig: path.join(root, 'packages/angular/tsconfig.json'),
  outdir: path.join(root, '.tmp/phase4-angular-bundle'),
});
const script = built.outputFiles.find(file => file.path.endsWith('.js'))?.contents;
if (!script) throw new Error('Phase 4 Angular browser bundle is incomplete.');

const server = http.createServer((request, response) => {
  const route = new URL(request.url, 'http://127.0.0.1').pathname;
  if (route === '/__phase4-angular.js') {
    response.setHeader('Content-Type', 'text/javascript');
    response.end(script);
  } else if (route === '/phase4-angular-browser.html') {
    response.setHeader('Content-Type', 'text/html');
    response.end(fs.readFileSync(path.join(root, 'tests/phase4-angular-browser.html')));
  } else {
    response.writeHead(404).end();
  }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  const url = `http://127.0.0.1:${server.address().port}/phase4-angular-browser.html`;
  browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#result')?.textContent?.startsWith('PHASE4_ANGULAR'), null, { timeout: 30000 });
  const result = (await page.locator('#result').textContent())?.replace(/^PHASE4_ANGULAR /, '') ?? '';
  console.log(result);
  if (result.includes(':fail')) process.exitCode = 1;
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
