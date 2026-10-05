import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const chrome = process.env.CHROME_BIN || 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
if (!fs.existsSync(chrome)) throw new Error('Set CHROME_BIN to a Chrome executable.');

const built = await build({
  entryPoints: [path.join(root, 'tests/phase4-browser.tsx')],
  bundle: true,
  format: 'iife',
  platform: 'browser',
  target: 'es2022',
  write: false,
  outdir: path.join(root, '.tmp/phase4-bundle'),
});
const script = built.outputFiles.find(file => file.path.endsWith('.js'))?.contents;
const styles = built.outputFiles.find(file => file.path.endsWith('.css'))?.contents;
if (!script || !styles) throw new Error('Phase 4 browser bundle is incomplete.');

const server = http.createServer((request, response) => {
  const route = new URL(request.url, 'http://127.0.0.1').pathname;
  if (route === '/__phase4.js') {
    response.setHeader('Content-Type', 'text/javascript');
    response.end(script);
  } else if (route === '/__phase4.css') {
    response.setHeader('Content-Type', 'text/css');
    response.end(styles);
  } else if (route === '/phase4-browser.html') {
    response.setHeader('Content-Type', 'text/html');
    response.end(fs.readFileSync(path.join(root, 'tests/phase4-browser.html')));
  } else {
    response.writeHead(404).end();
  }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const tempRoot = path.join(root, '.tmp');
fs.mkdirSync(tempRoot, { recursive: true });
const profile = fs.mkdtempSync(path.join(tempRoot, 'phase4-chrome-'));
if (!profile.startsWith(`${tempRoot}${path.sep}`)) throw new Error('Unsafe Chrome profile path.');

try {
  const url = `http://127.0.0.1:${server.address().port}/phase4-browser.html`;
  const args = [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-sandbox', '--disable-extensions',
    `--user-data-dir=${profile}`, '--virtual-time-budget=4000', '--dump-dom', url,
  ];
  const result = await new Promise((resolve, reject) => {
    const child = spawn(chrome, args, { windowsHide: true });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => child.kill(), 30000);
    child.stdout.setEncoding('utf8').on('data', chunk => { stdout += chunk; });
    child.stderr.setEncoding('utf8').on('data', chunk => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', code => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr });
    });
  });
  const match = result.stdout.match(/PHASE4_RESULT ([^<]+)<\/div>/);
  if (!match) throw new Error(`Phase 4 fixture did not finish (exit ${result.code}). ${result.stderr.slice(0, 500)}`);
  console.log(match[1]);
  if (match[1].includes(':fail')) process.exitCode = 1;
} finally {
  await new Promise(resolve => server.close(resolve));
  fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
